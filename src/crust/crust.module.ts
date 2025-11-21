import { Module } from '@nestjs/common';
import { CrustService } from './crust.service';
import { CrustController } from './crust.controller';

@Module({
  controllers: [CrustController],
  providers: [CrustService],
})
export class CrustModule {}
