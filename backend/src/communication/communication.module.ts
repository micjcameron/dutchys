import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { MailService } from './mail.service';

@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService, MailService],
  exports: [CommunicationService, MailService],
})
export class CommunicationModule {}
