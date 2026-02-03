// hmac.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HmacGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-signature'];
    const timestamp = request.headers['x-timestamp'];
    const secret = process.env.HMAC_SECRET;

    if (!signature || !timestamp) throw new UnauthorizedException();

    // 1. Freshness Check (60 second window)
    const now = Date.now();
    if (Math.abs(now - parseInt(timestamp)) > 60000) {
      throw new UnauthorizedException('Request expired');
    }

    // 2. Signature Validation
    const serverSignature = crypto
      .createHmac('sha256', secret!)
      .update(timestamp)
      .digest('hex');

    if (signature !== serverSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}