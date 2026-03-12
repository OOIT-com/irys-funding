import { ethers } from 'ethers';
import { UploadBuilder, WebUploader } from '@irys/web-upload';
import { WebAvalanche, WebEthereum, WebMatic } from '@irys/web-upload-ethereum';
import { EthersV6Adapter } from '@irys/web-upload-ethereum-ethers-v6';
import { errorMessage, isStatusMessage, StatusMessage, Web3Session } from '../types';
import { getNetworkInfo } from '../network-info';
import { Buffer } from 'buffer';
import type { Readable } from 'stream';

export type Tags = {
  name: string;
  value: string;
}[];

type BaseWebIrys = Awaited<ReturnType<UploadBuilder['build']>>;

const w = window as any;

export class IrysAccess {
  public readonly web3Session: Web3Session;
  private irys: BaseWebIrys | undefined;

  constructor(web3Session: Web3Session) {
    this.web3Session = web3Session;
  }

  public async init(): Promise<StatusMessage | undefined> {
    const irys = await getWebIrys(this.web3Session);
    if (isStatusMessage(irys)) {
      return irys;
    }
    this.irys = irys;
  }

  public getToken(): string {
    return this.irys?.token ?? '';
  }

  public getAddress(): string {
    return this.irys?.address ?? '';
  }

  public async getBalance(address: string) {
    return this.irys?.getBalance(address) || Promise.resolve('');
  }

  public async getLoadedBalance() {
    return this.irys?.getLoadedBalance() || Promise.resolve('');
  }

  public getPrice(bytes: number) {
    return this.irys?.getPrice(bytes) || 0;
  }

  public fund(amount: string) {
    return this.irys?.fund(amount);
  }

  public toAtomic(amount: any) {
    return this.irys?.utils.toAtomic(amount);
  }

  public withdrawBalance(amount: any) {
    return this.irys?.withdrawBalance(amount);
  }

  public async upload(data: string | Buffer | Readable, tags: Tags): Promise<any | StatusMessage> {
    if (!this.irys) {
      return errorMessage('Irys not initialized!');
    }
    return this.irys.upload(data, { tags });
  }
}

const getWebIrys = async (web3Session: Web3Session): Promise<BaseWebIrys | StatusMessage> => {
  const { chainId } = web3Session;

  console.log('🔍 getWebIrys() initialization:');
  console.log('  - chainId from web3Session:', chainId);

  const { currencySymbol, isMainnet, name } = getNetworkInfo(chainId);

  console.log('  - Detected network:', name);
  console.log('  - Currency symbol:', currencySymbol);
  console.log('  - Is mainnet:', isMainnet);

  const provider = new ethers.BrowserProvider(w.ethereum);
  let uploader;
  switch (currencySymbol) {
    case 'ETH':
      console.log('  - Using Ethereum uploader');
      uploader = WebUploader(WebEthereum).withAdapter(EthersV6Adapter(provider));
      break;
    case 'MATIC':
      console.log('  - Using Matic uploader');
      uploader = WebUploader(WebMatic).withAdapter(EthersV6Adapter(provider));
      break;
    case 'AVAX':
      console.log('  - Using Avalanche uploader');
      uploader = WebUploader(WebAvalanche).withAdapter(EthersV6Adapter(provider));
      break;
    default:
      console.error('  - ❌ Unsupported currency:', currencySymbol);
      return errorMessage(
        `Blockchain <${name}> with token ${currencySymbol} not supported`,
        `Currently only the following tokens are supported: ${Array.from(supportedSymbols).join(', ')}`
      );
  }
  const rpcUrl: string | undefined = import.meta.env.VITE_IRYS_RPC_URL_DEV ?? '';
  if (!isMainnet && rpcUrl) {
    console.log('  - Using devnet with RPC:', rpcUrl);
    uploader.withRpc(rpcUrl).devnet();
  } else {
    console.log('  - Using mainnet');
  }
  return await uploader.build();
};

export const supportedSymbols = new Set<string>(['ETH', 'AVAX', 'MATIC']);
