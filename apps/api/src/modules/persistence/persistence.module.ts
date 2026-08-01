import { Global, Module } from '@nestjs/common';
import { PersistenceController } from './persistence.controller';
import { PersistenceService } from './persistence.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  controllers: [
    PersistenceController,
  ],
  providers: [
    PrismaService,
    PersistenceService,
  ],
  exports: [
    PrismaService,
    PersistenceService,
  ],
})
export class PersistenceModule {}
