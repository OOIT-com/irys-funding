import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useAppContext } from '../AppContextProvider';
import { getNetworkInfo } from '../../network-info';

/**
 * Network Diagnostics Component
 * Shows real-time network information to help debug network detection issues
 */
export const NetworkDiagnostics: React.FC = () => {
  const { web3Session } = useAppContext();
  const [metamaskChainId, setMetamaskChainId] = useState<string>('');
  const [metamaskChainIdDecimal, setMetamaskChainIdDecimal] = useState<number>(0);
  const [web3ChainId, setWeb3ChainId] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const refreshChainInfo = async () => {
    const w = window as any;
    if (!w.ethereum) {
      console.error('MetaMask not available');
      return;
    }

    try {
      // Get chainId from MetaMask
      const mmChainId = await w.ethereum.request({ method: 'eth_chainId' });
      const mmChainIdDec = parseInt(mmChainId, 16);
      setMetamaskChainId(mmChainId);
      setMetamaskChainIdDecimal(mmChainIdDec);

      // Get chainId from Web3
      if (web3Session?.web3) {
        const w3ChainId = await web3Session.web3.eth.getChainId();
        setWeb3ChainId(Number(w3ChainId));
      }

      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error refreshing chain info:', error);
    }
  };

  useEffect(() => {
    refreshChainInfo();
  }, [web3Session]);

  const sessionChainId = web3Session?.chainId ?? 0;
  const sessionNetworkInfo = getNetworkInfo(sessionChainId);
  const metamaskNetworkInfo = getNetworkInfo(metamaskChainIdDecimal);

  const mismatch = sessionChainId !== metamaskChainIdDecimal && metamaskChainIdDecimal !== 0;

  return (
    <Card sx={{ m: 2, backgroundColor: mismatch ? '#fff3e0' : '#e8f5e9' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔍 Network Diagnostics
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            <strong>Session ChainId:</strong> {sessionChainId} ({sessionNetworkInfo.name})
          </Typography>
          <Typography variant="subtitle2">
            <strong>MetaMask ChainId:</strong> {metamaskChainId} ({metamaskChainIdDecimal}) - {metamaskNetworkInfo.name}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Web3 ChainId:</strong> {web3ChainId}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Last updated: {lastUpdate}
          </Typography>
        </Box>

        {mismatch && (
          <Box sx={{ mt: 2, p: 1, backgroundColor: '#ff9800', borderRadius: 1 }}>
            <Typography variant="body2" color="white">
              ⚠️ <strong>MISMATCH DETECTED!</strong> Your app session shows {sessionNetworkInfo.name} but MetaMask is
              connected to {metamaskNetworkInfo.name}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" size="small" onClick={refreshChainInfo}>
            Refresh
          </Button>
          <Button variant="outlined" size="small" onClick={() => window.location.reload()} sx={{ ml: 1 }}>
            Reload Page
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
