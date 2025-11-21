import { Controller, Get, Query } from '@nestjs/common';
import { CrustService } from './crust.service';

@Controller('crust')
export class CrustController {
  constructor(private readonly crustService: CrustService) {}

  @Get('balance')
  async getBalance(@Query('address') address: string) {
    return this.crustService.getWalletBalance(address);
  }
}
