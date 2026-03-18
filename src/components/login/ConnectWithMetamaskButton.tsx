import React, { useCallback, useEffect } from 'react';
import { Button, Stack, Tooltip } from '@mui/material';
import { useAccount, useConnect, useConnectors } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContextProvider';
import { errorMessage, infoMessage } from '../../types';
import LinkIcon from '@mui/icons-material/Link';

export const ConnectWithMetamaskButton: React.FC = () => {
  const navigate = useNavigate();
  const { dispatchSnackbarMessage, web3Session } = useAppContext();
  const { connect, isPending, error } = useConnect();
  const connectors = useConnectors();
  const { isConnected } = useAccount();

  // Navigate to the main page once the session is ready
  useEffect(() => {
    if (web3Session) {
      navigate('/funding-irys');
    }
  }, [web3Session, navigate]);

  // Surface connection errors as snackbar messages
  useEffect(() => {
    if (error) {
      dispatchSnackbarMessage(errorMessage('MetaMask connection failed', error.message));
    }
  }, [error, dispatchSnackbarMessage]);

  const handleConnect = useCallback(() => {
    const connector = connectors.find((c) => c.id === 'metaMask') ?? connectors[0];
    if (!connector) {
      dispatchSnackbarMessage(infoMessage('No injected wallet found. Please install MetaMask.'));
      return;
    }
    connect({ connector });
  }, [connect, connectors, dispatchSnackbarMessage]);

  return (
    <Stack direction="column">
      <Tooltip title={'Connect with MetaMask or other EVM Plugin Wallet'}>
        <Button
          startIcon={<LinkIcon />}
          variant={'contained'}
          onClick={handleConnect}
          disabled={isPending || isConnected}
          color={'primary'}
        >
          {isPending ? 'Connecting…' : 'Connect with MetaMask Wallet'}
        </Button>
      </Tooltip>
    </Stack>
  );
};
