import { useCallback } from 'react';
import Web3 from 'web3';
import { Button, Tooltip } from '@mui/material';
import { errorMessage, infoMessage, PublicKeyHolder, Web3Session } from '../../types';
import { useNavigate } from 'react-router-dom';

import { displayAddress } from '../../utils/misc-util';
import { getCurrentAddress, getCurrentNetworkId } from '../../utils/web3-utils';
import { useAppContext } from '../AppContextProvider';
import { StatusMessageElement } from '../common/StatusMessageElement';
import LinkIcon from '@mui/icons-material/Link';

export const ConnectWithMetamaskButton: React.FC = () => {
  const navigate = useNavigate();
  const app = useAppContext();
  const { wrap, dispatchSnackbarMessage, web3Session, setWeb3Session } = app;

  const handleEthereum = useCallback(async () => {
    if (!app) {
      return;
    }

    const w: any = window;
    if (!dispatchSnackbarMessage || !setWeb3Session) {
      console.error('dispatchSnackbarMessage/setWeb3Session not initialized!');
      return;
    }
    if (web3Session) {
      dispatchSnackbarMessage(infoMessage('Already connected!'));
      return;
    }
    let web3: Web3 | undefined = undefined;
    let networkId = 0;
    let publicAddress: string | undefined = undefined;
    let publicKeyHolder: PublicKeyHolder | undefined = undefined;
    try {
      if (!w.ethereum) {
        dispatchSnackbarMessage(
          errorMessage('Can not connect to Metamask Wallet!', 'window.ethereum id not initialized!')
        );
        return;
      }

      await w.ethereum.enable();

      dispatchSnackbarMessage(infoMessage('Ethereum is enabled!'));

      // We don't know window.web3 version, so we use our own instance of Web3
      // with the injected provider given by MetaMask
      web3 = new Web3(w.ethereum);
      dispatchSnackbarMessage(infoMessage('Web3 initialized!'));

      w?.ethereum?.on('accountsChanged', () =>
        // e: never
        {
          w?.location?.reload();
        }
      );

      w?.ethereum?.on('networkChanged', () => {
        w?.location?.reload();
      });

      networkId = await getCurrentNetworkId(web3);

      publicAddress = await getCurrentAddress(web3);

      // PUBLIC ADDRESS & PUBLIC KEY
      if (!publicAddress) {
        dispatchSnackbarMessage(errorMessage('Please open MetaMask first.', 'Web3 could not detect a public address!'));
        return;
      } else {
        dispatchSnackbarMessage(infoMessage(`Address ${displayAddress(publicAddress)} connected`));
      }
    } catch (error) {
      dispatchSnackbarMessage(errorMessage('Error occurred while connecting to MetaMask Wallet', error));
    } finally {
      if (!web3 || !publicAddress || !networkId) {
        dispatchSnackbarMessage(errorMessage('Could not create Web3 Session!'));
      } else {
        const web3Session: Web3Session = {
          web3,
          publicAddress,
          publicKeyHolder,
          networkId,
          mode: 'metamask'
        };

        app.setWeb3Session({ ...web3Session });
        navigate('/funding-irys');
      }
    }
  }, [dispatchSnackbarMessage, app, navigate, web3Session, setWeb3Session]);

  const connectMetaMask = useCallback(
    () =>
      wrap('Connect with MetaMask', async () => {
        if (!app) {
          return;
        }

        const w: any = window;
        const errorMethode = (e: Error) => dispatchSnackbarMessage(errorMessage(`Error occurred!`, e));
        if (w.ethereum) {
          await handleEthereum().catch(errorMethode);
        } else {
          dispatchSnackbarMessage(infoMessage('Try to detect MetaMask...'));
          w.addEventListener('ethereum#initialized', () => handleEthereum().catch(errorMethode), {
            once: true
          });
        }
      }),
    [wrap, app, handleEthereum, dispatchSnackbarMessage]
  );

  if (!app) {
    return <StatusMessageElement statusMessage={infoMessage('DApp initializing...')}></StatusMessageElement>;
  }

  return (
    <Tooltip title={'Connect with MetaMask or other EVM Plugin Wallet'}>
      <Button startIcon={<LinkIcon />} variant={'contained'} onClick={connectMetaMask} color={'primary'}>
        Connect with MetaMask Wallet
      </Button>
    </Tooltip>
  );
};
