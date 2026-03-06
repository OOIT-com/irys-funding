import axios from 'axios';
import { errorMessage, StatusMessage } from '../types';
// tutorial
export const getBlockchainBalance = async (address: string, isMainnet = true): Promise<StatusMessage | string> => {
  const prefix = isMainnet ? '' : '-testnet';
  const host = `https://api${prefix}.polygonscan.com`;
  console.log(`*** Polygon${prefix} get balance  ***`);
  const apikey = import.meta.env.VITE_POLYGONSCAN_API_KEY;
  const url = `${host}/api?module=account&action=balance&address=${address}&apikey=${apikey}`;
  const res = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 200) {
    return res.data?.result || '';
  } else {
    return errorMessage('Request for Polygon balance failed!', `${res.status}, ${res.status}`);
  }
};
