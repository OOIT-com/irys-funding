import Web3 from 'web3';

export async function getCurrentAddress(web3: Web3) {
  const coinbase = await web3.eth.getCoinbase();
  let addr = coinbase;
  if (Array.isArray(coinbase)) {
    addr = coinbase[0];
  }
  if (!addr) {
    return;
  }
  return addr.toLowerCase();
}

export async function getChainId(web3: Web3): Promise<number> {
  const chainId0 = await web3.eth.getChainId();
  console.debug('chainId from web3:', chainId0);

  // Ensure we return a proper number
  const chainId = typeof chainId0 === 'string' ? parseInt(chainId0, 16) : Number(chainId0);
  console.debug('converted chainId:', chainId);

  const w = window as any;
  const metamaskChainId = await w.ethereum.request({ method: 'eth_chainId' });
  const metamaskNetworkId = parseInt(metamaskChainId, 16);

  console.log('App detected chainId:', chainId);
  console.log('MetaMask chainId (hex):', metamaskChainId);
  console.log('MetaMask chainId (decimal):', metamaskNetworkId);

  return +(chainId || '-1').toString();
}
