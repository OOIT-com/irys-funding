import {Box, Button, IconButton, Stack, Toolbar, Tooltip, useTheme} from '@mui/material';
import logo from '../../images/keyblock200.png';
import {green} from '@mui/material/colors';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import {useContext, useState} from 'react';
import {ColorModeContext} from '../../FundingIrysDApp';
import {getNetworkInfo} from '../../network-info';
import {Web3InfoPage} from './Web3InfoPage';
import {useIsSmall} from '../utils';
import {displayAddress} from '../../utils/misc-util';
import {useAppContext} from '../AppContextProvider';
import {LDAppBar} from '../common/StyledBoxes';

const ConnectionAddressDisplay = ({publicAddress, isXs}: { publicAddress?: string; isXs: boolean }) => {
    const {wrap} = useAppContext();
    if (!publicAddress) {
        return (
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={0.5}
                sx={{color: 'white', fontWeight: 'bold'}}
            >
                <LinkOffIcon/>
                <Box>{'Not Connected'}</Box>
            </Stack>
        );
    } else {
        return (
            <Tooltip title={'Copy Address to clipboard'}>
                <Button
                    onClick={() => wrap('Copy Address to clipboard...', () => navigator.clipboard.writeText(publicAddress))}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={0.5}
                        sx={{color: green[200], fontWeight: 'bold'}}
                    ><LinkIcon/>
                        <Box sx={{color: green[200], fontWeight: 'bold'}}>{displayAddress(publicAddress, isXs)}</Box>
                    </Stack>{' '}
                </Button>
            </Tooltip>
        );
    }
};

export function AppHeader() {
    const {web3Session} = useAppContext();
    const {publicAddress} = web3Session || {};
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [openInfoPage, setOpenInfoPage] = useState(false);

    const isXs = useIsSmall();

    let name = 'Not Connected';

    if (web3Session) {
        const {networkId} = web3Session;
        const networkInfo = getNetworkInfo(networkId);
        name = networkInfo.name;
    }

    return (
        <LDAppBar position="static" elevation={0}>
            <Toolbar variant="regular">
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}
                       sx={{width: '100%'}}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={0.5}
                        sx={{fontWeight: 'bold', fontSize: '120%', cursor: 'pointer'}}
                    >
                        <img src={logo} alt={'KeyBlock'} style={{maxHeight: '1.2em'}}/>
                    </Stack>
                    <ConnectionAddressDisplay publicAddress={publicAddress} isXs={isXs}/>

                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
                        <Button onClick={() => setOpenInfoPage(true)} startIcon={<InfoOutlinedIcon/>}>
                            {isXs ? '' : name}
                        </Button>
                    </Stack>

                    <IconButton style={{float: 'right'}} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                    </IconButton>
                </Stack>
            </Toolbar>
            <Web3InfoPage open={openInfoPage} done={() => setOpenInfoPage(false)}></Web3InfoPage>
        </LDAppBar>
    );
}
