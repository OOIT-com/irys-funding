import {Stack} from '@mui/material';
import {ConnectWithMetamaskButton} from './ConnectWithMetamaskButton';
import {LoginFragment} from './LoginFragment';
import {DivBox} from '../common/DivBox';

const title = process.env.REACT_APP_TITLE;
export const Login: React.FC = () => {

    return (
        <LoginFragment
            content={
                <Stack key={'login-buttons'} spacing={1}>
                    {!!title && <DivBox sx={{margin: '1em'}}>{title}</DivBox>}
                    <ConnectWithMetamaskButton key={'connect-with-metamask'}/>
                </Stack>
            }
        />
    );
};
