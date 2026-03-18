import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import { infoMessage, isStatusMessage, StatusMessage } from '../../types';
import { Box } from '@mui/material';
import { StatusMessageElement } from '../common/StatusMessageElement';
import { IrysFundingUi } from './IrysFundingUi';
import { IrysAccess } from '../../utils/IrysAccess';
import { useAppContext } from '../AppContextProvider';
import { CollapsiblePanel } from '../common/CollapsiblePanel';
import { Web3NotInitialized } from '../common/Web3NotInitialized';
import { AppTopTitle } from '../common/AppTopTitle';
import artworkPng from '../images/funding-irys.png';

export function FundingIrysUi() {
  const { wrap, web3Session } = useAppContext();
  const { web3, publicAddress } = web3Session || {};

  const [statusMessage, setStatusMessage] = useState<StatusMessage>();
  const [irysAccess, setIrysAccess] = useState<IrysAccess>();

  useEffect(() => {
    const init = async () =>
      wrap('Initializing Irys Access...', async () => {
        setStatusMessage(infoMessage('Initializing Irys Access...'));
        if (web3Session) {
          const _irysAccess = new IrysAccess(web3Session);
          const res = await _irysAccess.init();
          if (isStatusMessage(res)) {
            setStatusMessage(res);
          } else {
            setStatusMessage(undefined);
            setIrysAccess(_irysAccess);
          }
        }
      });

    init().catch(console.error);
  }, [wrap, web3Session]);

  if (!publicAddress || !web3) {
    return <Web3NotInitialized />;
  }

  const content: ReactNode[] = [<StatusMessageElement key={'statusMessage'} statusMessage={statusMessage} />];

  if (irysAccess) {
    content.push(
      <Box key={'irys-content'} sx={{ width: '100%' }}>
        <IrysFundingUi irysAccess={irysAccess} />
      </Box>
    );
  }

  return (
    <CollapsiblePanel
      level={'top'}
      title={<AppTopTitle title={'Funding Irys'} avatar={artworkPng} />}
      content={content}
      collapsible={false}
    />
  );
}
