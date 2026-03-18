import { createConfig, http } from 'wagmi';
import {
  mainnet,
  sepolia,
  polygon,
  polygonAmoy,
  avalanche,
  avalancheFuji,
  optimism,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  moonriver,
  filecoin
} from 'viem/chains';
import { injected } from 'wagmi/connectors';
import { defineChain } from 'viem';

// Custom chain definitions not yet in viem/chains
const filecoinCalibration = defineChain({
  id: 314159,
  name: 'Filecoin - Calibration Testnet',
  nativeCurrency: { name: 'testnet filecoin', symbol: 'tFIL', decimals: 18 },
  rpcUrls: { default: { http: ['https://api.calibration.node.glif.io/rpc/v1'] } },
  blockExplorers: { default: { name: 'Filscan', url: 'https://calibration.filscan.io' } }
});

const sonicTestnet = defineChain({
  id: 64165,
  name: 'Sonic Testnet',
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.soniclabs.com/'] } },
  blockExplorers: { default: { name: 'Sonic Explorer', url: 'https://testnet.soniclabs.com/' } }
});

const harmonyMainnet = defineChain({
  id: 1666600000,
  name: 'Harmony Mainnet',
  nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
  rpcUrls: { default: { http: ['https://api.harmony.one'] } },
  blockExplorers: { default: { name: 'Harmony Explorer', url: 'https://explorer.harmony.one/' } }
});

const harmonyTestnet = defineChain({
  id: 1666700000,
  name: 'Harmony Testnet',
  nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
  rpcUrls: { default: { http: ['https://api.s0.b.hmny.io'] } },
  blockExplorers: { default: { name: 'Harmony Explorer', url: 'https://explorer.testnet.harmony.one/' } }
});

export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    sepolia,
    polygon,
    polygonAmoy,
    avalanche,
    avalancheFuji,
    optimism,
    bsc,
    bscTestnet,
    fantom,
    fantomTestnet,
    moonriver,
    filecoin,
    filecoinCalibration,
    sonicTestnet,
    harmonyMainnet,
    harmonyTestnet
  ],
  connectors: [injected({ target: 'metaMask' })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
    [optimism.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [fantom.id]: http(),
    [fantomTestnet.id]: http(),
    [moonriver.id]: http(),
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
    [sonicTestnet.id]: http(),
    [harmonyMainnet.id]: http(),
    [harmonyTestnet.id]: http()
  }
});

