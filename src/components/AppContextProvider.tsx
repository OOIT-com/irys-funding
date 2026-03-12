import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { errorMessage, infoMessage, SnackbarMessage, StatusMessage, Web3Session } from '../types';

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
  const [web3Session, setWeb3Session] = useState<Web3Session>();
  const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>();

  // Set up MetaMask event listeners on app initialization
  useEffect(() => {
    const w = window as any;

    if (!w.ethereum) {
      console.log('MetaMask not detected on app init');
      return;
    }

    console.log('🔍 Initializing MetaMask event listeners...');
    console.log('  - Provider type:', typeof w.ethereum);
    console.log('  - Has .on():', typeof w.ethereum.on === 'function');
    console.log('  - Has .request():', typeof w.ethereum.request === 'function');
    console.log('  - Has .removeListener():', typeof w.ethereum.removeListener === 'function');
    console.log('  - Provider isMetaMask:', w.ethereum.isMetaMask);

    const accountsChangedHandler = (accounts: string[]) => {
      console.log('🔄 [Global] accountsChanged event fired:', accounts);
      console.log('  - Reloading page...');
      window.location.reload();
    };

    const chainChangedHandler = (newChainId: string) => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`🔄 [Global] chainChanged event fired at ${timestamp}!`);
      console.log('  - new chainId (hex):', newChainId);
      console.log('  - new chainId (decimal):', parseInt(newChainId, 16));
      console.log('  - Reloading page in 100ms to ensure state is consistent...');

      // Small delay to ensure MetaMask has fully switched
      setTimeout(() => {
        window.location.reload();
      }, 100);
    };

    // Register event listeners using EIP-1193 standard
    try {
      w.ethereum.on('accountsChanged', accountsChangedHandler);
      w.ethereum.on('chainChanged', chainChangedHandler);
      console.log('✅ [Global] MetaMask event listeners registered successfully');

      // Log current state for debugging
      w.ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId: string) => {
          console.log('📊 Current chainId at registration:', chainId, `(${parseInt(chainId, 16)})`);
        })
        .catch((error: any) => {
          console.error('❌ Error getting initial chainId:', error);
        });

      // Also log accounts
      w.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          console.log('👤 Current accounts at registration:', accounts);
        })
        .catch((error: any) => {
          console.error('❌ Error getting accounts:', error);
        });
    } catch (error) {
      console.error('❌ [Global] Error registering MetaMask listeners:', error);
    }

    // Cleanup function
    return () => {
      try {
        if (w.ethereum.removeListener) {
          w.ethereum.removeListener('accountsChanged', accountsChangedHandler);
          w.ethereum.removeListener('chainChanged', chainChangedHandler);
          console.log('🧹 [Global] MetaMask event listeners cleaned up');
        }
      } catch (error) {
        console.error('❌ [Global] Error removing listeners:', error);
      }
    };
  }, []); // Empty dependency array - run once on mount

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
