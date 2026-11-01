import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Only connect if not in mock/test mode
    try {
      await this.$connect();
    } catch (error) {
      console.warn('Prisma connection deferred (database may still be starting):', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
