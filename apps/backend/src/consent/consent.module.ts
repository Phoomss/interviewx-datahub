import { Module } from '@nestjs/common';
import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';
import { AuthorizationDecisionService } from './authorization-decision.service';
import { PiiVaultService } from './pii-vault.service';

@Module({
  controllers: [ConsentController],
  providers: [ConsentService, AuthorizationDecisionService, PiiVaultService],
  exports: [ConsentService, AuthorizationDecisionService, PiiVaultService],
})
export class ConsentModule {}
