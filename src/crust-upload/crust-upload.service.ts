import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import * as crypto from '@polkadot/util-crypto';
import { typesBundleForPolkadot } from '@crustio/type-definitions';

@Injectable()
export class CrustUploadService {
  async uploadToCrust(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const SEED = process.env.CRUST_SEED;
    const CHAIN_URL = process.env.CRUST_CHAIN_URL;
    const GATEWAY = process.env.CRUST_IPFS_GATEWAY;

    if (!SEED || !CHAIN_URL || !GATEWAY) {
      throw new BadRequestException('Missing Crust environment variables');
    }

    await crypto.cryptoWaitReady();
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri(SEED);

    const msg = pair.address;
    const signature = pair.sign(msg);
    const sigHex = `0x${Buffer.from(signature).toString('hex')}`;
    const authRaw = `sub-${pair.address}:${sigHex}`;
    const authHeader = `Basic ${Buffer.from(authRaw).toString('base64')}`;

    const form = new FormData();
    form.append('file', file.buffer, file.originalname);

    const addResp = await axios.post(`${GATEWAY}/api/v0/add`, form, {
      headers: {
        ...form.getHeaders(),
        authorization: authHeader,
      },
    });

    const cid = addResp.data.Hash;
    if (!cid) throw new Error('No CID returned from Crust gateway');

    const provider = new WsProvider(CHAIN_URL);
    const api = await ApiPromise.create({ provider, typesBundle: typesBundleForPolkadot });

    await api.tx.market
      .placeStorageOrder(cid, file.size, 0, '')
      .signAndSend(pair);

    return {
      cid,
      url: `${GATEWAY}/ipfs/${cid}`,
      size: file.size,
    };
  }
}
