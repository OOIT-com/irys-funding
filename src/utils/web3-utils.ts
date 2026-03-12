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
  // Get chainId directly from MetaMask to avoid caching issues
  const w = window as any;

  if (!w.ethereum) {
    console.error('❌ MetaMask not available');
    throw new Error('MetaMask not available');
  }

  // Always get the LATEST chainId from MetaMask provider
  const metamaskChainId = await w.ethereum.request({ method: 'eth_chainId' });
  const chainIdDecimal = parseInt(metamaskChainId, 16);

  console.log('🔍 getChainId() called:');
  console.log('  - MetaMask chainId (hex):', metamaskChainId);
  console.log('  - MetaMask chainId (decimal):', chainIdDecimal);

  // Also check Web3's value for comparison
  const web3ChainId = await web3.eth.getChainId();
  console.log('  - Web3 cached chainId:', web3ChainId);

  if (Number(web3ChainId) !== chainIdDecimal) {
    console.warn('⚠️ Web3 chainId mismatch! MetaMask:', chainIdDecimal, 'Web3:', web3ChainId);
    console.warn('⚠️ Using MetaMask value as source of truth');
  }

  return chainIdDecimal;
}
