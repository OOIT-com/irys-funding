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

export async function getCurrentNetworkId(web3: Web3): Promise<number> {
  const chainId = await web3.eth.getChainId();
  console.debug('chainId from web3:', chainId);

  // Ensure we return a proper number
  const networkId = typeof chainId === 'string' ? parseInt(chainId, 16) : Number(chainId);
  console.debug('converted networkId:', networkId);

  const w = window as any;
  const metamaskChainId = await w.ethereum.request({ method: 'eth_chainId' });
  const metamaskNetworkId = parseInt(metamaskChainId, 16);

  console.log('App detected networkId:', networkId);
  console.log('MetaMask chainId (hex):', metamaskChainId);
  console.log('MetaMask networkId (decimal):', metamaskNetworkId);

  return +(chainId || '-1').toString();
}
