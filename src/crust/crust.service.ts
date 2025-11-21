import { Injectable } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';

@Injectable()
export class CrustService {
  async getWalletBalance(address: string) {
    // Create provider for each request (Render-safe)
    const provider = new WsProvider(process.env.CRUST_CHAIN_URL);

    // Create API instance
    const api = await ApiPromise.create({ provider });

    const account: any = await api.query.system.account(address);
    const data = account.data;

    // IMPORTANT: disconnect to avoid hanging
    await api.disconnect();

    return {
      free: data.free.toHuman(),
      reserved: data.reserved.toHuman(),
      miscFrozen: data.miscFrozen.toHuman(),
      feeFrozen: data.feeFrozen.toHuman(),
    };
  }
}
