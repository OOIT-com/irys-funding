import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { errorMessage, infoMessage, SnackbarMessage, StatusMessage, Web3Session } from '../types';
import { useAccount, useChainId } from 'wagmi';
import Web3 from 'web3';

let SnackbarMessageCounter = 0;
const noop = () => {};
export type WrapFun = <R>(loading: string, p: () => Promise<R>) => Promise<R | StatusMessage>;
export type SetWeb3Session = (w?: Web3Session) => void;

export type AppContextData = {
  loading: string;
  setLoading: (value: string) => void;

  wrap: WrapFun;

  snackbarMessage?: SnackbarMessage;
  setSnackbarMessage: (value: SnackbarMessage) => void;
  dispatchSnackbarMessage: (statusMessage: StatusMessage | string | undefined, duration?: number) => void;
  web3Session?: Web3Session;
  setWeb3Session: SetWeb3Session;
};

const defaultValue: AppContextData = {
  loading: '',
  setLoading: noop as never,
  wrap: noop as never,
  setSnackbarMessage: noop as never,
  dispatchSnackbarMessage: noop as never,
  setWeb3Session: noop as never
};

export const AppContext = createContext<AppContextData | undefined>(undefined);

export function AppContextProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [loading, setLoading] = useState('');
  const [web3Session, setWeb3SessionState] = useState<Web3Session>();
  const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>();

  // wagmi hooks: source of truth for account and chain – update automatically when
  // the user switches networks or accounts in the MetaMask extension
  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  console.debug('chainId', chainId);

  // Rebuild the Web3Session whenever wagmi reports a new address or chainId.
  // Creating a fresh Web3 instance from window.ethereum ensures every eth call
  // (balance, gas price, …) targets the currently selected network.
  useEffect(() => {
    console.debug('AppContextProvider :: isConnected', isConnected);
    console.debug('AppContextProvider :: address', address);
    console.debug('AppContextProvider :: chainId', chainId);
    if (isConnected && address && chainId) {
      console.debug('AppContextProvider :: setWeb3SessionState ok');
      const web3 = new Web3((window as any).ethereum);
      setWeb3SessionState({
        web3,
        publicAddress: address.toLowerCase(),
        chainId,
        mode: 'metamask'
      });
    } else if (status !== 'reconnecting' && status !== 'connecting' && !isConnected) {
      console.debug('AppContextProvider :: setWeb3SessionState undefined');
      // Only clear the session once wagmi has finished its reconnection attempt
      setWeb3SessionState(undefined);
    }
  }, [isConnected, address, chainId, status]);

  // Kept for backwards compatibility: only publicKeyHolder updates are honoured;
  // the chain/address/web3 fields always come from wagmi.
  const setWeb3Session = useCallback((update?: Web3Session) => {
    if (update?.publicKeyHolder) {
      setWeb3SessionState((prev) => (prev ? { ...prev, publicKeyHolder: update.publicKeyHolder } : prev));
    }
  }, []);

  const wrap = useCallback(
    async function w<P = void>(loading: string, p: () => Promise<P>): Promise<P | StatusMessage> {
      try {
        setLoading(loading);
        return await p();
      } catch (e) {
        return errorMessage('Error occurred', e);
      } finally {
        setLoading('');
      }
    },
    [setLoading]
  );

  const dispatchSnackbarMessage = useCallback(
    (statusMessage: StatusMessage | string | undefined, duration: number = 3000) => {
      if (!statusMessage) {
        return;
      }
      if (typeof statusMessage === 'string') {
        statusMessage = infoMessage(statusMessage);
      }
      SnackbarMessageCounter++;
      const snackbarMessage: SnackbarMessage = { ...statusMessage, duration, counter: SnackbarMessageCounter };

      setSnackbarMessage(snackbarMessage);
    },
    [setSnackbarMessage]
  );

  const value: AppContextData = useMemo(
    () => ({
      loading,
      setLoading,

      wrap,

      snackbarMessage,
      setSnackbarMessage,
      dispatchSnackbarMessage,
      web3Session,
      setWeb3Session
    }),
    [
      loading,
      setLoading,
      wrap,
      snackbarMessage,
      setSnackbarMessage,
      dispatchSnackbarMessage,
      web3Session,
      setWeb3Session
    ]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextData {
  return useContext(AppContext) || defaultValue;
}
