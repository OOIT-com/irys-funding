import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useAppContext } from '../AppContextProvider';
import { useAccount, useChainId } from 'wagmi';
import { getNetworkInfo } from '../../network-info';

/**
 * Network Diagnostics Component
 * Shows real-time network information from wagmi (the authoritative source).
 */
export const NetworkDiagnostics: React.FC = () => {
  const { web3Session } = useAppContext();
  const { address, status } = useAccount();
  const wagmiChainId = useChainId();

  const sessionChainId = web3Session?.chainId ?? 0;
  const networkInfo = getNetworkInfo(wagmiChainId);

  // After migration, wagmiChainId and sessionChainId should always match.
  // A mismatch would only appear transiently during the session rebuild.
  const mismatch = sessionChainId !== wagmiChainId && sessionChainId !== 0;

  return (
    <Card sx={{ m: 2, backgroundColor: mismatch ? '#fff3e0' : '#e8f5e9' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔍 Network Diagnostics
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            <strong>Wallet Status:</strong> {status}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Address:</strong> {address ?? 'Not connected'}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Chain ID (wagmi):</strong> {wagmiChainId} — {networkInfo.name}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Chain ID (session):</strong> {sessionChainId || '—'}
          </Typography>
        </Box>

        {mismatch && (
          <Box sx={{ mt: 2, p: 1, backgroundColor: '#ff9800', borderRadius: 1 }}>
            <Typography variant="body2" color="white">
              ⚠️ <strong>Transient mismatch</strong> – the session is being rebuilt for chain {wagmiChainId}.
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" size="small" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
