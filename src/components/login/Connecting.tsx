import { Stack } from '@mui/material';
import { LoginFragment } from './LoginFragment';
import { DivBox } from '../common/DivBox';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppContext } from '../AppContextProvider';
import { useAccount } from 'wagmi';

export const Connecting: React.FC = () => {
  const { web3Session } = useAppContext();
  const { status } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while wagmi is still reconnecting to a previously connected wallet
    if (web3Session) {
      console.debug('navigate :: app');
      navigate('/app');
    }
  }, [web3Session, status, navigate]);

  return (
    <LoginFragment
      content={
        <Stack key={'login-buttons'} spacing={1}>
          {<DivBox sx={{ margin: '1em' }}>{'Connecting ...'}</DivBox>}
        </Stack>
      }
    />
  );
};
