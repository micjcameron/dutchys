import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async createSession() {
    return this.sessionsService.createSession();
  }

  @Get(':id')
  async getSession(@Param('id') id: string) {
    return this.sessionsService.getSessionById(id);
  }

  @Patch(':id')
  async updateSession(@Param('id') id: string, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.updateSession(id, dto);
  }
}
