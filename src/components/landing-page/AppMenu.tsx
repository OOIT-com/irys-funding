import { ListItemButton, ListItemIcon, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledListItemText } from '../common/StyledComponents';
import { menuColumns } from './menu-defs';
import Grid from '@mui/material/Grid2';
import { DivBox } from '../common/DivBox';
import { MenuTooltip } from '../common/StyledTooltips';
import { Fragment } from 'react';

const showDescription = false;

export function AppMenu() {
  const navigate = useNavigate();

  return (
    <Stack sx={{ width: '100%' }}>
      <Grid key={'grid-2'} container justifyContent="left" spacing={1}>
        {menuColumns.map((menuColumn) => (
          <Fragment key={menuColumn.name}>
            <Grid key={'title' + menuColumn.name} size={12}>
              <DivBox sx={{ margin: '1em 0 0.4em 0', display: 'inline-block', fontSize: '1.4em' }}>
                {menuColumn.name}
              </DivBox>
            </Grid>
            {menuColumn.entries.map(({ path, name, description, icon }) => (
              <Grid key={path} size={3}>
                <MenuTooltip title={description}>
                  <ListItemButton onClick={() => navigate('/' + path)}>
                    {icon && <ListItemIcon>{icon}</ListItemIcon>}

                    <StyledListItemText
                      primary={name}
                      secondary={
                        <span key={'icon'}>
                          {
                            // icon ||
                            showDescription ? description : ''
                          }
                        </span>
                      }
                    />
                  </ListItemButton>
                </MenuTooltip>
              </Grid>
            ))}
          </Fragment>
        ))}
      </Grid>
    </Stack>
  );
}
