import { useCallback } from 'react';
import Web3 from 'web3';
import { Button, Tooltip } from '@mui/material';
import { errorMessage, infoMessage, PublicKeyHolder, Web3Session } from '../../types';
import { useNavigate } from 'react-router-dom';

import { displayAddress } from '../../utils/misc-util';
import { getCurrentAddress, getChainId } from '../../utils/web3-utils';
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
      const alreadyConnected = 'Already connected!';
      console.error(alreadyConnected);
      dispatchSnackbarMessage(infoMessage(alreadyConnected));
      return;
    }
    let web3: Web3 | undefined = undefined;
    let chainId = 0;
    let publicAddress: string | undefined = undefined;
    let publicKeyHolder: PublicKeyHolder | undefined = undefined;
    try {
      if (!w.ethereum) {
        const cannotConnect = 'Cannot connect to Metamask Wallet!';
        console.error(cannotConnect);
        dispatchSnackbarMessage(errorMessage(cannotConnect, 'window.ethereum id not initialized!'));
        return;
      }

      await w.ethereum.enable();

      const ethereumEnabled = 'Ethereum is enabled!';
      console.log(ethereumEnabled);
      dispatchSnackbarMessage(infoMessage(ethereumEnabled));

      // We don't know window.web3 version, so we use our own instance of Web3
      // with the injected provider given by MetaMask
      web3 = new Web3(w.ethereum);
      const webInitialized = 'Web3 initialized!';
      console.log(webInitialized);
      dispatchSnackbarMessage(infoMessage(webInitialized));

      chainId = await getChainId(web3);

      console.log('App detected chainId:', chainId);
      console.log('MetaMask chainId:', await w.ethereum.request({ method: 'eth_chainId' }));

      publicAddress = await getCurrentAddress(web3);

      if (!publicAddress) {
        const openMetamaskFirst = 'Please open MetaMask first.';
        console.error(openMetamaskFirst);
        dispatchSnackbarMessage(errorMessage(openMetamaskFirst, 'Web3 could not detect a public address!'));
        return;
      } else {
        const successfullyConnected = `Address ${displayAddress(publicAddress)} connected`;
        console.log(successfullyConnected);
        dispatchSnackbarMessage(infoMessage(successfullyConnected));
      }

      w?.ethereum?.on('accountsChanged', () =>
        // e: never
        {
          console.log('accountsChanged');
          w?.location?.reload(true);
        }
      );

      w?.ethereum?.on('chainChanged', () => {
        console.log('chainChanged');
        w?.location?.reload(true);
      });
    } catch (error) {
      const metamaskError = 'Error occurred while connecting to MetaMask Wallet';

      console.error(metamaskError);
      dispatchSnackbarMessage(errorMessage(metamaskError, error));
    } finally {
      if (!web3 || !publicAddress || !chainId) {
        const couldNotCreateWeb3Session = 'Could not create Web3 Session!';
        console.error(couldNotCreateWeb3Session);
        dispatchSnackbarMessage(errorMessage(couldNotCreateWeb3Session));
      } else {
        const web3Session: Web3Session = {
          web3,
          publicAddress,
          publicKeyHolder,
          chainId,
          mode: 'metamask'
        };

        console.log(web3Session);

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
