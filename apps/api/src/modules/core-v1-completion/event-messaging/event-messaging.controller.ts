import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventDeliveryStatus } from '../../../generated/prisma/enums';
import { RequirePermissions } from '../security/permissions.decorator';
import { Permissions } from '../security/permissions';
import { CreateEventReplayDto, CreateEventSubscriptionDto, CreateEventTopicDto, PublishEventMessageDto, TransitionEventDeliveryDto, TransitionEventReplayDto } from './dto/event-messaging.dto';
import { EventMessagingService } from './event-messaging.service';

@ApiTags('Event & Messaging Platform')
@ApiBearerAuth()
@Controller('event-messaging')
export class EventMessagingController {
  constructor(private readonly events: EventMessagingService) {}

  @Get('dashboard') @RequirePermissions(Permissions.EventMessagingDashboardRead)
  dashboard() { return this.events.dashboard(); }

  @Get('topics') @RequirePermissions(Permissions.EventTopicsRead)
  topics() { return this.events.listTopics(); }

  @Post('topics') @RequirePermissions(Permissions.EventTopicsWrite)
  createTopic(@Body() body: CreateEventTopicDto) { return this.events.createTopic(body); }

  @Get('subscriptions') @RequirePermissions(Permissions.EventSubscriptionsRead)
  subscriptions() { return this.events.listSubscriptions(); }

  @Post('subscriptions') @RequirePermissions(Permissions.EventSubscriptionsWrite)
  createSubscription(@Body() body: CreateEventSubscriptionDto) { return this.events.createSubscription(body); }

  @Post('topics/:topicKey/publish') @RequirePermissions(Permissions.EventMessagesPublish)
  publish(@Param('topicKey') topicKey: string, @Body() body: PublishEventMessageDto) { return this.events.publish(topicKey, body); }

  @Get('messages') @RequirePermissions(Permissions.EventMessagesRead)
  messages(@Query('topicKey') topicKey?: string) { return this.events.listMessages(topicKey); }

  @Get('deliveries') @RequirePermissions(Permissions.EventDeliveriesRead)
  deliveries(@Query('status') status?: EventDeliveryStatus) { return this.events.listDeliveries(status); }

  @Patch('deliveries/:id/transition') @RequirePermissions(Permissions.EventDeliveriesManage)
  transitionDelivery(@Param('id') id: string, @Body() body: TransitionEventDeliveryDto) { return this.events.transitionDelivery(id, body); }

  @Get('dead-letters') @RequirePermissions(Permissions.EventDeadLettersRead)
  deadLetters() { return this.events.listDeadLetters(); }

  @Post('dead-letters/:id/resolve') @RequirePermissions(Permissions.EventDeadLettersManage)
  resolveDeadLetter(@Param('id') id: string) { return this.events.resolveDeadLetter(id); }

  @Get('replays') @RequirePermissions(Permissions.EventReplaysRead)
  replays() { return this.events.listReplays(); }

  @Post('replays') @RequirePermissions(Permissions.EventReplaysManage)
  createReplay(@Body() body: CreateEventReplayDto) { return this.events.createReplay(body); }

  @Patch('replays/:id/transition') @RequirePermissions(Permissions.EventReplaysManage)
  transitionReplay(@Param('id') id: string, @Body() body: TransitionEventReplayDto) { return this.events.transitionReplay(id, body); }
}
