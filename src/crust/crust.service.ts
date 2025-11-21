import { Injectable } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';

@Injectable()
export class CrustService {
  private api: ApiPromise;

  async connect() {
    if (!this.api) {
      const provider = new WsProvider(process.env.CRUST_CHAIN_URL);
      this.api = await ApiPromise.create({ provider });
    }
    return this.api;
  }

  async getWalletBalance(address: string) {
    const api = await this.connect();

    const account: any = await api.query.system.account(address);
    const data = account.data; // FIXED

    return {
      free: data.free.toHuman(),
      reserved: data.reserved.toHuman(),
      miscFrozen: data.miscFrozen.toHuman(),
      feeFrozen: data.feeFrozen.toHuman(),
    };
  }
}
