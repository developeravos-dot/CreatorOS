import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainEventPublisher } from './domain-event.publisher';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [DomainEventPublisher],
  exports: [CqrsModule, DomainEventPublisher],
})
export class CreatorOsMessagingModule {}