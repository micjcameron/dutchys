import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { SubmitContactFormDto } from './dto/submit-contact-form.dto';
import { HmacGuard } from 'src/utils/guards/hmac.guard';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @UseGuards(HmacGuard)
  @Post('contact')
  async submitContactForm(@Body() dto: SubmitContactFormDto) {
    return this.communicationService.submitContactForm(dto);
  }
}
