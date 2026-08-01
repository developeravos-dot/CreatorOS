import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { EventBusService } from './event-bus.service';

@Controller('events')
export class EventBusController {
  constructor(
    private readonly eventBusService: EventBusService,
  ) {}

  @Get('status')
  getStatus() {
    return this.eventBusService.getStatus();
  }

  @Get()
  getEvents() {
    return this.eventBusService.getEvents();
  }

  @Get(':eventId')
  getEventById(
    @Param('eventId') eventId: string,
  ) {
    const event =
      this.eventBusService.getEventById(eventId);

    if (!event) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Event Not Found',
        message: `Event ${eventId} was not found`,
      });
    }

    return event;
  }

  @Post('platform-started')
  publishPlatformStarted() {
    return this.eventBusService.publishPlatformStarted();
  }
}
