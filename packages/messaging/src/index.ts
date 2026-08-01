import { randomUUID } from 'node:crypto';

export type TopicStatus =
  | 'active'
  | 'paused'
  | 'archived';

export type SubscriptionStatus =
  | 'active'
  | 'paused'
  | 'cancelled';

export type MessageStatus =
  | 'published'
  | 'partially-delivered'
  | 'delivered'
  | 'failed'
  | 'dead-lettered';

export type DeliveryStatus =
  | 'pending'
  | 'delivered'
  | 'failed'
  | 'dead-lettered';

export interface MessagingTopic {
  id: string;
  name: string;
  key: string;
  description?: string;
  status: TopicStatus;
  createdAt: string;
}

export interface MessagingSubscription {
  id: string;
  topicId: string;
  subscriber: string;
  status: SubscriptionStatus;
  maxAttempts: number;
  createdAt: string;
}

export interface MessagingMessage<TPayload = unknown> {
  id: string;
  topicId: string;
  topicKey: string;
  messageType: string;
  payload: TPayload;
  headers: Record<string, string>;
  status: MessageStatus;
  correlationId?: string;
  causationId?: string;
  publishedAt: string;
}

export interface MessageDelivery {
  id: string;
  messageId: string;
  subscriptionId: string;
  subscriber: string;
  status: DeliveryStatus;
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  error?: string;
}

export interface DeadLetterMessage {
  id: string;
  messageId: string;
  deliveryId: string;
  subscriptionId: string;
  subscriber: string;
  error: string;
  attempts: number;
  deadLetteredAt: string;
}

export interface CreateTopicInput {
  name: string;
  key: string;
  description?: string;
  status?: TopicStatus;
}

export interface CreateSubscriptionInput {
  topicId: string;
  subscriber: string;
  maxAttempts?: number;
}

export interface PublishMessageInput<TPayload = unknown> {
  topicId: string;
  messageType: string;
  payload: TPayload;
  headers?: Record<string, string>;
  correlationId?: string;
  causationId?: string;
}

export class MessagingTopicNotFoundError extends Error {
  constructor(topicId: string) {
    super(`Messaging topic ${topicId} was not found`);
    this.name = 'MessagingTopicNotFoundError';
  }
}

export class MessagingSubscriptionNotFoundError extends Error {
  constructor(subscriptionId: string) {
    super(`Messaging subscription ${subscriptionId} was not found`);
    this.name = 'MessagingSubscriptionNotFoundError';
  }
}

export class MessagingMessageNotFoundError extends Error {
  constructor(messageId: string) {
    super(`Messaging message ${messageId} was not found`);
    this.name = 'MessagingMessageNotFoundError';
  }
}

export class MessageDeliveryNotFoundError extends Error {
  constructor(deliveryId: string) {
    super(`Message delivery ${deliveryId} was not found`);
    this.name = 'MessageDeliveryNotFoundError';
  }
}

export class MessagingValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MessagingValidationError';
  }
}

export class InvalidDeliveryStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDeliveryStateError';
  }
}

export class InMemoryMessagingBroker {
  private readonly topics =
    new Map<string, MessagingTopic>();

  private readonly subscriptions =
    new Map<string, MessagingSubscription>();

  private readonly messages =
    new Map<string, MessagingMessage>();

  private readonly deliveries =
    new Map<string, MessageDelivery>();

  private readonly deadLetters =
    new Map<string, DeadLetterMessage>();

  createTopic(
    input: CreateTopicInput,
  ): MessagingTopic {
    const normalizedName = input.name.trim();
    const normalizedKey = input.key
      .trim()
      .toLowerCase();

    if (!normalizedName) {
      throw new MessagingValidationError(
        'Topic name is required',
      );
    }

    if (!normalizedKey) {
      throw new MessagingValidationError(
        'Topic key is required',
      );
    }

    const duplicateTopic =
      this.getTopics().find(
        (topic) => topic.key === normalizedKey,
      );

    if (duplicateTopic) {
      throw new MessagingValidationError(
        `Topic key ${normalizedKey} already exists`,
      );
    }

    const topic: MessagingTopic = {
      id: randomUUID(),
      name: normalizedName,
      key: normalizedKey,
      status: input.status ?? 'active',
      createdAt: new Date().toISOString(),
    };

    if (input.description !== undefined) {
      topic.description = input.description;
    }

    this.topics.set(topic.id, topic);

    return topic;
  }

  getTopics(): MessagingTopic[] {
    return Array.from(this.topics.values());
  }

  getTopicById(
    topicId: string,
  ): MessagingTopic | undefined {
    return this.topics.get(topicId);
  }

  createSubscription(
    input: CreateSubscriptionInput,
  ): MessagingSubscription {
    const topic = this.topics.get(input.topicId);

    if (!topic) {
      throw new MessagingTopicNotFoundError(
        input.topicId,
      );
    }

    if (!input.subscriber.trim()) {
      throw new MessagingValidationError(
        'Subscriber is required',
      );
    }

    const maxAttempts =
      input.maxAttempts ?? 3;

    if (maxAttempts < 1) {
      throw new MessagingValidationError(
        'Maximum delivery attempts must be at least 1',
      );
    }

    const subscription: MessagingSubscription = {
      id: randomUUID(),
      topicId: topic.id,
      subscriber: input.subscriber.trim(),
      status: 'active',
      maxAttempts,
      createdAt: new Date().toISOString(),
    };

    this.subscriptions.set(
      subscription.id,
      subscription,
    );

    return subscription;
  }

  getSubscriptions(
    topicId?: string,
  ): MessagingSubscription[] {
    const subscriptions =
      Array.from(this.subscriptions.values());

    if (!topicId) {
      return subscriptions;
    }

    return subscriptions.filter(
      (subscription) =>
        subscription.topicId === topicId,
    );
  }

  getSubscriptionById(
    subscriptionId: string,
  ): MessagingSubscription | undefined {
    return this.subscriptions.get(
      subscriptionId,
    );
  }

  publishMessage<TPayload>(
    input: PublishMessageInput<TPayload>,
  ): {
    message: MessagingMessage<TPayload>;
    deliveries: MessageDelivery[];
  } {
    const topic = this.topics.get(input.topicId);

    if (!topic) {
      throw new MessagingTopicNotFoundError(
        input.topicId,
      );
    }

    if (topic.status !== 'active') {
      throw new MessagingValidationError(
        `Topic ${topic.id} is not active`,
      );
    }

    if (!input.messageType.trim()) {
      throw new MessagingValidationError(
        'Message type is required',
      );
    }

    const publishedAt =
      new Date().toISOString();

    const message: MessagingMessage<TPayload> = {
      id: randomUUID(),
      topicId: topic.id,
      topicKey: topic.key,
      messageType: input.messageType.trim(),
      payload: input.payload,
      headers: input.headers ?? {},
      status: 'published',
      publishedAt,
    };

    if (input.correlationId !== undefined) {
      message.correlationId =
        input.correlationId;
    }

    if (input.causationId !== undefined) {
      message.causationId =
        input.causationId;
    }

    this.messages.set(
      message.id,
      message as MessagingMessage,
    );

    const activeSubscriptions =
      this.getSubscriptions(topic.id).filter(
        (subscription) =>
          subscription.status === 'active',
      );

    const deliveries =
      activeSubscriptions.map(
        (subscription): MessageDelivery => {
          const delivery: MessageDelivery = {
            id: randomUUID(),
            messageId: message.id,
            subscriptionId:
              subscription.id,
            subscriber:
              subscription.subscriber,
            status: 'pending',
            attempts: 0,
            maxAttempts:
              subscription.maxAttempts,
          };

          this.deliver(delivery);

          this.deliveries.set(
            delivery.id,
            delivery,
          );

          return delivery;
        },
      );

    this.refreshMessageStatus(message.id);

    return {
      message:
        this.messages.get(message.id) as
          MessagingMessage<TPayload>,
      deliveries,
    };
  }

  getMessages(): MessagingMessage[] {
    return Array.from(this.messages.values());
  }

  getMessageById(
    messageId: string,
  ): MessagingMessage | undefined {
    return this.messages.get(messageId);
  }

  getDeliveries(
    messageId?: string,
  ): MessageDelivery[] {
    const deliveries =
      Array.from(this.deliveries.values());

    if (!messageId) {
      return deliveries;
    }

    return deliveries.filter(
      (delivery) =>
        delivery.messageId === messageId,
    );
  }

  failDelivery(
    deliveryId: string,
    error: string,
  ): MessageDelivery {
    const delivery =
      this.requireDelivery(deliveryId);

    if (delivery.status !== 'delivered') {
      throw new InvalidDeliveryStateError(
        `Only delivered messages can be marked as failed`,
      );
    }

    const timestamp = new Date().toISOString();

    delivery.status = 'failed';
    delivery.failedAt = timestamp;
    delivery.error =
      error || 'Message delivery failed';

    this.moveToDeadLetterIfRequired(
      delivery,
    );

    this.refreshMessageStatus(
      delivery.messageId,
    );

    return delivery;
  }

  retryDelivery(
    deliveryId: string,
  ): MessageDelivery {
    const delivery =
      this.requireDelivery(deliveryId);

    if (delivery.status !== 'failed') {
      throw new InvalidDeliveryStateError(
        `Only failed deliveries can be retried`,
      );
    }

    if (
      delivery.attempts >=
      delivery.maxAttempts
    ) {
      this.moveToDeadLetterIfRequired(
        delivery,
      );

      throw new InvalidDeliveryStateError(
        `Delivery ${delivery.id} has reached its maximum attempts`,
      );
    }

    delete delivery.error;
    delete delivery.failedAt;

    delivery.status = 'pending';

    this.deliver(delivery);

    this.refreshMessageStatus(
      delivery.messageId,
    );

    return delivery;
  }

  getDeadLetters(): DeadLetterMessage[] {
    return Array.from(
      this.deadLetters.values(),
    );
  }

  getStatus() {
    const messages = this.getMessages();
    const deliveries = this.getDeliveries();

    return {
      package: '@creatoros/messaging',
      status: 'operational' as const,
      provider: 'InMemoryMessagingBroker',
      topics: this.topics.size,
      subscriptions: this.subscriptions.size,
      messages: this.messages.size,
      deliveries: this.deliveries.size,
      delivered: deliveries.filter(
        (delivery) =>
          delivery.status === 'delivered',
      ).length,
      failed: deliveries.filter(
        (delivery) =>
          delivery.status === 'failed',
      ).length,
      deadLetters: this.deadLetters.size,
      fullyDeliveredMessages:
        messages.filter(
          (message) =>
            message.status === 'delivered',
        ).length,
    };
  }

  private deliver(
    delivery: MessageDelivery,
  ): void {
    const timestamp = new Date().toISOString();

    delivery.attempts += 1;
    delivery.lastAttemptAt = timestamp;
    delivery.deliveredAt = timestamp;
    delivery.status = 'delivered';
  }

  private requireDelivery(
    deliveryId: string,
  ): MessageDelivery {
    const delivery =
      this.deliveries.get(deliveryId);

    if (!delivery) {
      throw new MessageDeliveryNotFoundError(
        deliveryId,
      );
    }

    return delivery;
  }

  private moveToDeadLetterIfRequired(
    delivery: MessageDelivery,
  ): void {
    if (
      delivery.attempts <
      delivery.maxAttempts
    ) {
      return;
    }

    const timestamp = new Date().toISOString();

    delivery.status = 'dead-lettered';

    const existingDeadLetter =
      this.getDeadLetters().find(
        (deadLetter) =>
          deadLetter.deliveryId ===
          delivery.id,
      );

    if (!existingDeadLetter) {
      const deadLetter: DeadLetterMessage = {
        id: randomUUID(),
        messageId: delivery.messageId,
        deliveryId: delivery.id,
        subscriptionId:
          delivery.subscriptionId,
        subscriber: delivery.subscriber,
        error:
          delivery.error ??
          'Maximum delivery attempts reached',
        attempts: delivery.attempts,
        deadLetteredAt: timestamp,
      };

      this.deadLetters.set(
        deadLetter.id,
        deadLetter,
      );
    }
  }

  private refreshMessageStatus(
    messageId: string,
  ): void {
    const message =
      this.messages.get(messageId);

    if (!message) {
      throw new MessagingMessageNotFoundError(
        messageId,
      );
    }

    const deliveries =
      this.getDeliveries(messageId);

    if (deliveries.length === 0) {
      message.status = 'published';
      return;
    }

    if (
      deliveries.every(
        (delivery) =>
          delivery.status === 'delivered',
      )
    ) {
      message.status = 'delivered';
      return;
    }

    if (
      deliveries.every(
        (delivery) =>
          delivery.status ===
          'dead-lettered',
      )
    ) {
      message.status = 'dead-lettered';
      return;
    }

    if (
      deliveries.some(
        (delivery) =>
          delivery.status === 'failed' ||
          delivery.status ===
            'dead-lettered',
      )
    ) {
      message.status = 'partially-delivered';
      return;
    }

    message.status = 'published';
  }
}
