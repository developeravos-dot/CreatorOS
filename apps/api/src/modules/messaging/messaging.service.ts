import { Injectable } from '@nestjs/common';
import {
  CreateSubscriptionInput,
  CreateTopicInput,
  InMemoryMessagingBroker,
  PublishMessageInput,
} from '@creatoros/messaging';

@Injectable()
export class MessagingService {
  private readonly broker =
    new InMemoryMessagingBroker();

  createTopic(input: CreateTopicInput) {
    return this.broker.createTopic(input);
  }

  getTopics() {
    const topics = this.broker.getTopics();

    return {
      registry: 'messaging-topics',
      status: 'operational',
      count: topics.length,
      topics,
    };
  }

  getTopicById(topicId: string) {
    return this.broker.getTopicById(topicId);
  }

  createSubscription(
    input: CreateSubscriptionInput,
  ) {
    return this.broker.createSubscription(
      input,
    );
  }

  getSubscriptions(topicId?: string) {
    const subscriptions =
      this.broker.getSubscriptions(topicId);

    return {
      registry: 'messaging-subscriptions',
      status: 'operational',
      count: subscriptions.length,
      subscriptions,
    };
  }

  publishMessage(
    input: PublishMessageInput,
  ) {
    return this.broker.publishMessage(input);
  }

  getMessages() {
    const messages =
      this.broker.getMessages();

    return {
      registry: 'messaging-messages',
      status: 'operational',
      count: messages.length,
      messages,
    };
  }

  getMessageById(messageId: string) {
    return this.broker.getMessageById(
      messageId,
    );
  }

  getDeliveries(messageId?: string) {
    const deliveries =
      this.broker.getDeliveries(messageId);

    return {
      registry: 'message-deliveries',
      status: 'operational',
      count: deliveries.length,
      deliveries,
    };
  }

  failDelivery(
    deliveryId: string,
    error: string,
  ) {
    return this.broker.failDelivery(
      deliveryId,
      error,
    );
  }

  retryDelivery(deliveryId: string) {
    return this.broker.retryDelivery(
      deliveryId,
    );
  }

  getDeadLetters() {
    const deadLetters =
      this.broker.getDeadLetters();

    return {
      registry: 'dead-letter-messages',
      status: 'operational',
      count: deadLetters.length,
      deadLetters,
    };
  }

  getStatus() {
    return {
      module: 'messaging',
      ...this.broker.getStatus(),
    };
  }
}
