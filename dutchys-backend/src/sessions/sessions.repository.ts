import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {}

  create(data: Partial<Session>): Session {
    return this.repository.create(data);
  }

  save(session: Session): Promise<Session> {
    return this.repository.save(session);
  }

  findById(id: string): Promise<Session | null> {
    return this.repository.findOne({ where: { id } });
  }
}
