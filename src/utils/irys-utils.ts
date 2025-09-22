import { IrysAccess } from './IrysAccess';
import { errorMessage, infoMessage, isStatusMessage, StatusMessage } from '../types';

export const IRYS_GATEWAY = process.env.REACT_APP_IRYS_GATEWAY;

export type IrysData = {
  blockchainBalance: string;
  address: string;
  loadedBalance: string;
  pricePerMega: string;
  uploadableMegabytes: number;
};

export async function loadIrysData(irysAccess: IrysAccess): Promise<
  IrysData & {
    statusMessage: StatusMessage;
  }
> {
  const address = irysAccess.web3Session.publicAddress;
  try {
    let statusMessage: StatusMessage = infoMessage('Ok');
    const loadedBalance = (await irysAccess.getLoadedBalance()).toString();
    const pricePerMega = (await irysAccess.getPrice(1024 * 1024)).toString();
    let blockchainBalance = '0';
    console.log('getBlockchainBalance', blockchainBalance);
    blockchainBalance = (await irysAccess.web3Session.web3.eth.getBalance(address)).toString();

    if (isStatusMessage(blockchainBalance)) {
      statusMessage = blockchainBalance;
      blockchainBalance = '0';
    }

    const uploadableMegabytes = Math.floor((100 * +loadedBalance) / +pricePerMega) / 100;

    return { blockchainBalance, loadedBalance, statusMessage, address, pricePerMega, uploadableMegabytes };
  } catch (e) {
    return {
      statusMessage: errorMessage('Irys Data loading failed', e),
      blockchainBalance: '0',
      loadedBalance: '0',
      address,
      pricePerMega: '0',
      uploadableMegabytes: 0
    };
  }
}
