import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './session.entity';
import { SessionsRepository } from './sessions.repository';

const STEP_KEYS = [
  'step1',
  'step2',
  'step3',
  'step4',
  'step5',
  'step6',
  'step7',
  'step8',
  'step9',
  'step10',
  'step11',
  'step12',
  'step13',
  'step14',
  'step15',
  'step16',
  'step17',
  'step18',
] as const;

type StepKey = (typeof STEP_KEYS)[number];

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async createSession() {
    const session = this.sessionsRepository.create({});
    const saved = await this.sessionsRepository.save(session);

    return {
      id: saved.id,
      createdAt: saved.createdAt,
    };
  }

  async getSessionById(id: string) {
    const session = await this.sessionsRepository.findById(id);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async updateSession(id: string, dto: UpdateSessionDto) {
    const session = await this.sessionsRepository.findById(id);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (dto.stepCompleted !== undefined) {
      const key = this.getStepKey(dto.stepCompleted);
      session[key] = true;
    }

    if (dto.currentProduct !== undefined) {
      session.currentProduct = dto.currentProduct;
    }

    if (dto.cartId !== undefined) {
      session.cartId = dto.cartId;
    }

    if (dto.productType !== undefined) {
      session.productType = dto.productType ?? null;
    }

    const saved = await this.sessionsRepository.save(session);

    return {
      id: saved.id,
      updatedAt: saved.updatedAt,
    };
  }

  private getStepKey(stepCompleted: number): StepKey {
    const key = STEP_KEYS[stepCompleted - 1];
    if (!key) {
      throw new BadRequestException('Invalid step');
    }
    return key;
  }
}
