import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../persistence/prisma.service';
import { EventDeliveryStatus, EventReplayStatus } from '../../../generated/prisma/enums';
import { CreateEventReplayDto, CreateEventSubscriptionDto, CreateEventTopicDto, PublishEventMessageDto, TransitionEventDeliveryDto, TransitionEventReplayDto } from './dto/event-messaging.dto';

@Injectable()
export class EventMessagingService {
  constructor(private readonly prisma: PrismaService) {}

  private async audit(action: string, resourceType: string, resourceId?: string, payload?: object) {
    await this.prisma.auditLog.create({
      data: {
        eventType: `event-messaging.${action}`,
        actorType: 'SYSTEM',
        resourceType,
        resourceId,
        action,
        payload: payload ?? undefined,
      },
    });
  }

  private conflict(error: unknown): never {
    if ((error as { code?: string }).code === 'P2002') {
      throw new ConflictException('An event messaging record with this key already exists.');
    }
    throw error;
  }

  async dashboard() {
    const [topics, activeTopics, subscriptions, activeSubscriptions, messages, pending, processing, delivered, failed, deadLetters, openDeadLetters, replays, runningReplays] = await Promise.all([
      this.prisma.eventTopic.count(),
      this.prisma.eventTopic.count({ where: { status: 'ACTIVE' } }),
      this.prisma.eventSubscription.count(),
      this.prisma.eventSubscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.eventMessage.count(),
      this.prisma.eventDelivery.count({ where: { status: 'PENDING' } }),
      this.prisma.eventDelivery.count({ where: { status: 'PROCESSING' } }),
      this.prisma.eventDelivery.count({ where: { status: 'DELIVERED' } }),
      this.prisma.eventDelivery.count({ where: { status: 'FAILED' } }),
      this.prisma.eventDeadLetter.count(),
      this.prisma.eventDeadLetter.count({ where: { resolvedAt: null } }),
      this.prisma.eventReplay.count(),
      this.prisma.eventReplay.count({ where: { status: 'RUNNING' } }),
    ]);
    return {
      platform: 'CreatorOS Event & Messaging Platform',
      status: 'operational',
      topics: { total: topics, active: activeTopics },
      subscriptions: { total: subscriptions, active: activeSubscriptions },
      messages,
      deliveries: { pending, processing, delivered, failed },
      deadLetters: { total: deadLetters, open: openDeadLetters },
      replays: { total: replays, running: runningReplays },
    };
  }

  listTopics() {
    return this.prisma.eventTopic.findMany({ include: { _count: { select: { subscriptions: true, messages: true } } }, orderBy: { updatedAt: 'desc' } });
  }

  async createTopic(input: CreateEventTopicDto) {
    try {
      const row = await this.prisma.eventTopic.create({
        data: {
          topicKey: input.topicKey,
          name: input.name,
          description: input.description,
          status: input.status,
          partitions: input.partitions ?? 1,
          retentionDays: input.retentionDays ?? 30,
          ordered: input.ordered ?? false,
          schema: (input.schema ?? {}) as any,
        },
      });
      await this.audit('topic.created', 'EventTopic', row.id, { topicKey: row.topicKey });
      return row;
    } catch (error) {
      this.conflict(error);
    }
  }

  listSubscriptions() {
    return this.prisma.eventSubscription.findMany({ include: { topic: true }, orderBy: { updatedAt: 'desc' } });
  }

  async createSubscription(input: CreateEventSubscriptionDto) {
    const topic = await this.prisma.eventTopic.findUnique({ where: { id: input.topicId } });
    if (!topic) throw new NotFoundException('Event topic not found.');
    try {
      const row = await this.prisma.eventSubscription.create({
        data: {
          topicId: input.topicId,
          subscriptionKey: input.subscriptionKey,
          name: input.name,
          consumerType: input.consumerType,
          endpoint: input.endpoint,
          status: input.status,
          maxAttempts: input.maxAttempts ?? 5,
          retryDelaySeconds: input.retryDelaySeconds ?? 60,
          filter: (input.filter ?? {}) as any,
        },
      });
      await this.audit('subscription.created', 'EventSubscription', row.id, { subscriptionKey: row.subscriptionKey });
      return row;
    } catch (error) {
      this.conflict(error);
    }
  }

  async publish(topicKey: string, input: PublishEventMessageDto) {
    const topic = await this.prisma.eventTopic.findUnique({ where: { topicKey } });
    if (!topic || topic.status !== 'ACTIVE') throw new NotFoundException('Active event topic not found.');
    if (input.idempotencyKey) {
      const existing = await this.prisma.eventMessage.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
      if (existing) return this.prisma.eventMessage.findUnique({ where: { id: existing.id }, include: { deliveries: true } });
    }
    const subscriptions = await this.prisma.eventSubscription.findMany({ where: { topicId: topic.id, status: 'ACTIVE' } });
    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.eventMessage.create({
        data: {
          topicId: topic.id,
          eventName: input.eventName,
          eventVersion: input.eventVersion,
          producer: input.producer,
          aggregateType: input.aggregateType,
          aggregateId: input.aggregateId,
          correlationId: input.correlationId,
          causationId: input.causationId,
          idempotencyKey: input.idempotencyKey,
          priority: input.priority,
          payload: input.payload as any,
          headers: (input.headers ?? {}) as any,
        },
      });
      if (subscriptions.length > 0) {
        await tx.eventDelivery.createMany({
          data: subscriptions.map((subscription) => ({
            messageId: created.id,
            subscriptionId: subscription.id,
            status: 'PENDING',
          })),
        });
      }
      return created;
    });
    await this.audit('message.published', 'EventMessage', message.id, { topicKey, eventName: message.eventName, deliveries: subscriptions.length });
    return this.prisma.eventMessage.findUnique({ where: { id: message.id }, include: { topic: true, deliveries: true } });
  }

  listMessages(topicKey?: string) {
    return this.prisma.eventMessage.findMany({ where: topicKey ? { topic: { topicKey } } : undefined, include: { topic: true, _count: { select: { deliveries: true } } }, orderBy: { occurredAt: 'desc' }, take: 250 });
  }

  listDeliveries(status?: EventDeliveryStatus) {
    return this.prisma.eventDelivery.findMany({ where: status ? { status } : undefined, include: { message: true, subscription: true }, orderBy: { createdAt: 'desc' }, take: 250 });
  }

  async transitionDelivery(id: string, input: TransitionEventDeliveryDto) {
    const found = await this.prisma.eventDelivery.findUnique({ where: { id }, include: { subscription: true } });
    if (!found) throw new NotFoundException('Event delivery not found.');
    const isTerminal = found.status === EventDeliveryStatus.DELIVERED || found.status === EventDeliveryStatus.DEAD_LETTER || found.status === EventDeliveryStatus.CANCELLED;
    if (isTerminal && input.status !== found.status) throw new ConflictException('A terminal event delivery cannot be transitioned.');
    const attemptsIncrement = input.status === EventDeliveryStatus.PROCESSING || input.status === EventDeliveryStatus.RETRYING || input.status === EventDeliveryStatus.DELIVERED;
    const row = await this.prisma.eventDelivery.update({
      where: { id },
      data: {
        status: input.status,
        response: input.response,
        lastError: input.error,
        attempts: attemptsIncrement ? { increment: 1 } : undefined,
        deliveredAt: input.status === EventDeliveryStatus.DELIVERED ? new Date() : undefined,
        nextAttemptAt: input.status === EventDeliveryStatus.RETRYING ? new Date(Date.now() + found.subscription.retryDelaySeconds * 1000) : undefined,
      },
    });
    if (input.status === EventDeliveryStatus.DEAD_LETTER) {
      await this.prisma.eventDeadLetter.upsert({
        where: { deliveryId: id },
        update: { reason: input.error ?? 'Delivery moved to dead letter queue.', payload: found.messageId as any },
        create: { deliveryId: id, reason: input.error ?? 'Delivery moved to dead letter queue.', payload: { messageId: found.messageId } },
      });
    }
    await this.audit('delivery.transitioned', 'EventDelivery', id, { status: row.status, attempts: row.attempts });
    return row;
  }

  listDeadLetters() {
    return this.prisma.eventDeadLetter.findMany({ include: { delivery: { include: { message: true, subscription: true } } }, orderBy: { createdAt: 'desc' }, take: 250 });
  }

  async resolveDeadLetter(id: string) {
    const found = await this.prisma.eventDeadLetter.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Dead letter record not found.');
    const row = await this.prisma.eventDeadLetter.update({ where: { id }, data: { resolvedAt: new Date() } });
    await this.audit('dead-letter.resolved', 'EventDeadLetter', id);
    return row;
  }

  listReplays() {
    return this.prisma.eventReplay.findMany({ include: { topic: true, subscription: true }, orderBy: { createdAt: 'desc' } });
  }

  async createReplay(input: CreateEventReplayDto) {
    const topic = await this.prisma.eventTopic.findUnique({ where: { id: input.topicId } });
    if (!topic) throw new NotFoundException('Event topic not found.');
    try {
      const row = await this.prisma.eventReplay.create({
        data: {
          topicId: input.topicId,
          subscriptionId: input.subscriptionId,
          replayKey: input.replayKey,
          fromMessageId: input.fromMessageId,
          toMessageId: input.toMessageId,
          limit: input.limit ?? 1000,
          status: 'PLANNED',
        },
      });
      await this.audit('replay.created', 'EventReplay', row.id, { replayKey: row.replayKey });
      return row;
    } catch (error) {
      this.conflict(error);
    }
  }

  async transitionReplay(id: string, input: TransitionEventReplayDto) {
    const found = await this.prisma.eventReplay.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Event replay not found.');
    const isTerminal = found.status === EventReplayStatus.COMPLETED || found.status === EventReplayStatus.FAILED || found.status === EventReplayStatus.CANCELLED;
    if (isTerminal) throw new ConflictException('Event replay is already terminal.');
    const nextIsTerminal = input.status === EventReplayStatus.COMPLETED || input.status === EventReplayStatus.FAILED || input.status === EventReplayStatus.CANCELLED;
    const row = await this.prisma.eventReplay.update({
      where: { id },
      data: {
        status: input.status,
        error: input.error,
        startedAt: input.status === EventReplayStatus.RUNNING && !found.startedAt ? new Date() : undefined,
        completedAt: nextIsTerminal ? new Date() : undefined,
      },
    });
    await this.audit('replay.transitioned', 'EventReplay', id, { status: row.status });
    return row;
  }
}
