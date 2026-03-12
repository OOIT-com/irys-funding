import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Debug component to monitor MetaMask network changes.
 * Add this to your app temporarily to verify chainChanged events are firing.
 *
 * Usage: <MetaMaskDebugMonitor />
 */
export const MetaMaskDebugMonitor = () => {
  const [chainId, setChainId] = useState<string>('');
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    const w = window as any;

    if (!w.ethereum) {
      setEventLog(['❌ MetaMask not detected']);
      return;
    }

    // Test if ethereum provider is available and working
    setEventLog((prev) => [...prev, `🔍 MetaMask provider detected: ${typeof w.ethereum}`]);
    setEventLog((prev) => [...prev, `🔍 Has .on method: ${typeof w.ethereum.on === 'function'}`]);
    setEventLog((prev) => [...prev, `🔍 Has .request method: ${typeof w.ethereum.request === 'function'}`]);

    // Get initial chainId
    w.ethereum
      .request({ method: 'eth_chainId' })
      .then((id: string) => {
        setChainId(id);
        setEventLog((prev) => [...prev, `📊 Initial chainId: ${id} (${parseInt(id, 16)})`]);
      })
      .catch((error: any) => {
        setEventLog((prev) => [...prev, `❌ Error getting chainId: ${error.message}`]);
      });

    // Monitor chainChanged events
    const chainChangedHandler = (newChainId: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setChainId(newChainId);
      setEventLog((prev) => [...prev, `[${timestamp}] 🔄 chainChanged: ${newChainId} (${parseInt(newChainId, 16)})`]);
    };

    // Monitor accountsChanged events
    const accountsChangedHandler = (accounts: string[]) => {
      const timestamp = new Date().toLocaleTimeString();
      setEventLog((prev) => [...prev, `[${timestamp}] 👤 accountsChanged: ${accounts[0] || 'none'}`]);
    };

    // Monitor connect events
    const connectHandler = (connectInfo: any) => {
      const timestamp = new Date().toLocaleTimeString();
      setEventLog((prev) => [...prev, `[${timestamp}] 🔌 connect: ${JSON.stringify(connectInfo)}`]);
    };

    // Monitor disconnect events
    const disconnectHandler = (error: any) => {
      const timestamp = new Date().toLocaleTimeString();
      setEventLog((prev) => [...prev, `[${timestamp}] 🔌 disconnect: ${error?.message || 'unknown'}`]);
    };

    // Register listeners using EIP-1193 standard
    try {
      w.ethereum.on('chainChanged', chainChangedHandler);
      w.ethereum.on('accountsChanged', accountsChangedHandler);
      w.ethereum.on('connect', connectHandler);
      w.ethereum.on('disconnect', disconnectHandler);
      setEventLog((prev) => [...prev, '✅ Event listeners registered via .on()']);
    } catch (error: any) {
      setEventLog((prev) => [...prev, `❌ Error registering listeners: ${error.message}`]);
    }

    // Cleanup - use removeListener (EIP-1193 standard)
    return () => {
      try {
        if (w.ethereum.removeListener) {
          w.ethereum.removeListener('chainChanged', chainChangedHandler);
          w.ethereum.removeListener('accountsChanged', accountsChangedHandler);
          w.ethereum.removeListener('connect', connectHandler);
          w.ethereum.removeListener('disconnect', disconnectHandler);
          setEventLog((prev) => [...prev, '🧹 Listeners removed']);
        }
      } catch (error: any) {
        console.error('Error removing listeners:', error);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        bgcolor: 'background.paper',
        border: '2px solid #666',
        borderRadius: 2,
        p: 2,
        maxWidth: 400,
        maxHeight: 300,
        overflow: 'auto',
        zIndex: 9999
      }}
    >
      <Typography variant="h6" gutterBottom>
        🔍 MetaMask Monitor
      </Typography>
      <Typography variant="body2">
        <strong>Current Chain:</strong> {chainId || 'Loading...'} {chainId && `(${parseInt(chainId, 16)})`}
      </Typography>
      <Box sx={{ mt: 1, fontSize: '0.75rem', fontFamily: 'monospace' }}>
        {eventLog.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </Box>
    </Box>
  );
};
