import { MessagingService } from './messaging.service';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    service = new MessagingService();
  });

  it('should report operational status', () => {
    expect(service.getStatus()).toEqual({
      module: 'messaging',
      package: '@creatoros/messaging',
      status: 'operational',
      provider: 'InMemoryMessagingBroker',
      topics: 0,
      subscriptions: 0,
      messages: 0,
      deliveries: 0,
      delivered: 0,
      failed: 0,
      deadLetters: 0,
      fullyDeliveredMessages: 0,
    });
  });

  it('should create a topic', () => {
    const topic = service.createTopic({
      name: 'Workflow Events',
      key: 'workflow.events',
      description:
        'Workflow lifecycle messages.',
    });

    expect(topic.key).toBe(
      'workflow.events',
    );

    expect(service.getTopics().count)
      .toBe(1);
  });

  it('should create a subscription', () => {
    const topic = service.createTopic({
      name: 'Knowledge Events',
      key: 'knowledge.events',
    });

    const subscription =
      service.createSubscription({
        topicId: topic.id,
        subscriber: 'Living Vision',
        maxAttempts: 3,
      });

    expect(subscription.topicId)
      .toBe(topic.id);

    expect(
      service.getSubscriptions().count,
    ).toBe(1);
  });

  it('should publish and deliver a message', () => {
    const topic = service.createTopic({
      name: 'Content Events',
      key: 'content.events',
    });

    service.createSubscription({
      topicId: topic.id,
      subscriber: 'Content Factory',
    });

    const result =
      service.publishMessage({
        topicId: topic.id,
        messageType:
          'content.idea.generated',
        payload: {
          idea: 'Future civilizations',
        },
      });

    expect(result.message.status)
      .toBe('delivered');

    expect(result.deliveries)
      .toHaveLength(1);

    expect(
      result.deliveries[0]?.status,
    ).toBe('delivered');
  });

  it('should fail and retry a delivery', () => {
    const topic = service.createTopic({
      name: 'Retry Events',
      key: 'retry.events',
    });

    service.createSubscription({
      topicId: topic.id,
      subscriber: 'Retry Consumer',
      maxAttempts: 3,
    });

    const published =
      service.publishMessage({
        topicId: topic.id,
        messageType: 'retry.test',
        payload: {},
      });

    const deliveryId =
      published.deliveries[0]?.id;

    expect(deliveryId).toBeDefined();

    const failed = service.failDelivery(
      deliveryId as string,
      'Temporary delivery failure',
    );

    expect(failed.status).toBe('failed');

    const retried =
      service.retryDelivery(
        deliveryId as string,
      );

    expect(retried.status)
      .toBe('delivered');

    expect(retried.attempts).toBe(2);
  });

  it('should expose message history', () => {
    const topic = service.createTopic({
      name: 'History Events',
      key: 'history.events',
    });

    service.publishMessage({
      topicId: topic.id,
      messageType: 'history.created',
      payload: {
        active: true,
      },
    });

    expect(service.getMessages().count)
      .toBe(1);
  });
});
