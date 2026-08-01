import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import type {
  CreateSubscriptionInput,
  CreateTopicInput,
  PublishMessageInput,
} from '@creatoros/messaging';
import {
  InvalidDeliveryStateError,
  MessageDeliveryNotFoundError,
  MessagingMessageNotFoundError,
  MessagingSubscriptionNotFoundError,
  MessagingTopicNotFoundError,
  MessagingValidationError,
} from '@creatoros/messaging';
import { MessagingService } from './messaging.service';

@Controller('messaging')
export class MessagingController {
  constructor(
    private readonly messagingService:
      MessagingService,
  ) {}

  @Get('status')
  getStatus() {
    return this.messagingService.getStatus();
  }

  @Get('topics')
  getTopics() {
    return this.messagingService.getTopics();
  }

  @Get('topics/:topicId')
  getTopicById(
    @Param('topicId') topicId: string,
  ) {
    const topic =
      this.messagingService.getTopicById(
        topicId,
      );

    if (!topic) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Messaging Topic Not Found',
        message:
          `Messaging topic ${topicId} was not found`,
      });
    }

    return topic;
  }

  @Post('topics')
  createTopic(
    @Body() input: CreateTopicInput,
  ) {
    try {
      return this.messagingService.createTopic(
        input,
      );
    } catch (error) {
      this.handleMessagingError(error);
    }
  }

  @Get('subscriptions')
  getSubscriptions(
    @Query('topicId') topicId?: string,
  ) {
    return this.messagingService
      .getSubscriptions(topicId);
  }

  @Post('subscriptions')
  createSubscription(
    @Body()
    input: CreateSubscriptionInput,
  ) {
    try {
      return this.messagingService
        .createSubscription(input);
    } catch (error) {
      this.handleMessagingError(error);
    }
  }

  @Get('messages')
  getMessages() {
    return this.messagingService.getMessages();
  }

  @Get('messages/:messageId')
  getMessageById(
    @Param('messageId') messageId: string,
  ) {
    const message =
      this.messagingService.getMessageById(
        messageId,
      );

    if (!message) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Messaging Message Not Found',
        message:
          `Messaging message ${messageId} was not found`,
      });
    }

    return message;
  }

  @Post('messages')
  publishMessage(
    @Body()
    input: PublishMessageInput,
  ) {
    try {
      return this.messagingService
        .publishMessage(input);
    } catch (error) {
      this.handleMessagingError(error);
    }
  }

  @Get('deliveries')
  getDeliveries(
    @Query('messageId') messageId?: string,
  ) {
    return this.messagingService
      .getDeliveries(messageId);
  }

  @Post('deliveries/:deliveryId/fail')
  failDelivery(
    @Param('deliveryId') deliveryId: string,
    @Body() input: { error?: string },
  ) {
    try {
      return this.messagingService.failDelivery(
        deliveryId,
        input.error ??
          'Message delivery failed',
      );
    } catch (error) {
      this.handleMessagingError(error);
    }
  }

  @Post('deliveries/:deliveryId/retry')
  retryDelivery(
    @Param('deliveryId') deliveryId: string,
  ) {
    try {
      return this.messagingService
        .retryDelivery(deliveryId);
    } catch (error) {
      this.handleMessagingError(error);
    }
  }

  @Get('dead-letters')
  getDeadLetters() {
    return this.messagingService
      .getDeadLetters();
  }

  private handleMessagingError(
    error: unknown,
  ): never {
    if (
      error instanceof
        MessagingTopicNotFoundError ||
      error instanceof
        MessagingSubscriptionNotFoundError ||
      error instanceof
        MessagingMessageNotFoundError ||
      error instanceof
        MessageDeliveryNotFoundError
    ) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Messaging Resource Not Found',
        message: error.message,
      });
    }

    if (
      error instanceof
        MessagingValidationError ||
      error instanceof
        InvalidDeliveryStateError
    ) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Invalid Messaging Operation',
        message: error.message,
      });
    }

    throw error;
  }
}
