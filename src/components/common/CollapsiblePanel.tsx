import { LDAccordionSummary, LDBox } from './StyledBoxes';
import * as React from 'react';
import { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { Accordion, IconButton, Stack, SxProps } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HelpBox } from './HelpBox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ButtonPanel } from './ButtonPanel';

type Level = 'top' | 'second' | 'third' | 'fourth' | 'fifth';
type StylesProps = { title: SxProps; outer: SxProps; outerSpacing?: number };
const styles: Record<Level, StylesProps> = {
  top: {
    title: {
      fontSize: '1.6em',
      //margin: '1em 0 0.4em 0'
      lineHeight: '1.6'
    },
    outer: {}
  },
  second: {
    title: { fontSize: '1.3em', margin: '0.3em 0 0.4em 0' },
    outer: { border: 'solid 2px gray', borderRadius: '' }
  },
  third: {
    title: { fontSize: '1.1em', margin: '0.3em 0 0.4em 0' },
    outer: { border: 'solid 1px gray', borderRadius: '' }
  },
  fourth: {
    title: { fontSize: '1em', margin: '0.1em 0 0.1em 0' },
    outer: { border: 'solid 1px gray', borderRadius: '' },
    outerSpacing: 1
  },
  fifth: {
    title: { fontSize: '1.1em', margin: '0.3em 0 0.4em 0' },
    outer: { border: 'solid 1px gray', borderRadius: '' }
  }
};
export type CollapsiblePanelProps = {
  title: string | ReactNode;
  help?: string | ReactNode;
  toolbar?: ReactNode | ReactNode[];
  content?: ReactNode | ReactNode[];
  level?: Level;
  collapsible?: boolean;
  collapsed?: boolean;
  spacing?: number;
};
export const CollapsiblePanel: FC<PropsWithChildren<CollapsiblePanelProps>> = ({
  title,
  help,
  toolbar,
  content,
  level = 'second',
  collapsible = true,
  collapsed = false,
  spacing = 1,
  children
}) => {
  const [exp, setExp] = useState(!collapsed);

  const expandIcon = collapsible ? <ExpandMoreIcon /> : undefined;

  const [helpOn, setHelpOn] = useState(false);
  let titleElement = typeof title === 'string' ? <Stack sx={{ whiteSpace: 'nowrap' }}>{title}</Stack> : title;
  if (help) {
    titleElement = (
      <ButtonPanel sx={{ whiteSpace: 'nowrap' }}>
        {title}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setHelpOn((b) => !b);
          }}
        >
          <InfoOutlinedIcon />
        </IconButton>
      </ButtonPanel>
    );
  }

  return (
    <Accordion expanded={!collapsible || exp} onChange={() => setExp((b) => !b)}>
      <LDAccordionSummary expandIcon={expandIcon} aria-controls="panel1bh-data" id="panel1bh-header">
        <Stack sx={{ width: '100%' }} spacing={1}>
          <Stack
            key={'title-row'}
            direction={'row'}
            justifyContent="space-between"
            alignItems="center"
            spacing={styles[level].outerSpacing || 4}
          >
            <LDBox sx={styles[level].title} direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
              {titleElement}
            </LDBox>
            {exp && (
              <Stack
                key={'title-row'}
                direction={'row'}
                sx={{ paddingRight: '1em' }}
                justifyContent="space-between"
                alignItems="baseline"
                spacing={2}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                {toolbar}
              </Stack>
            )}
          </Stack>
          {helpOn && <HelpBox help={help} done={() => setHelpOn(false)} />}
        </Stack>
      </LDAccordionSummary>
      <AccordionDetails sx={{ marginTop: '1em' }}>
        <Stack spacing={spacing}>{content || children}</Stack>
      </AccordionDetails>
    </Accordion>
  );
};
