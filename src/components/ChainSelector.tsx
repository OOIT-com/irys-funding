import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useChainId, useSwitchChain } from 'wagmi';
import { SelectUi } from '../ui-factory/widgets/SelectUi';
import { AttributeDef, PRecord, PValue, SelectValue } from '../ui-factory/types';

const selectChainName = 'selectChain';
const asNumber = (v: PValue) => Number(v);
export const ChainSelector: React.FC = () => {
  const { switchChain, chains } = useSwitchChain();
  const chainId = useChainId();

  const [attributeDef, setAttributeDef] = useState<AttributeDef>({
    name: selectChainName,
    label: 'Change the Blockchain...'
  });
  const [pRecord, setPRecord] = useState<PRecord>({});

  useEffect(() => {
    const selectList: SelectValue[] = [];
    chains.forEach(({ id, name }) => {
      selectList.push({ value: id, label: name });
    });
    setAttributeDef((def) => ({ ...def, uiTypeOptions: { selectList } }));
  }, [chains]);

  useEffect(() => {
    const chainId = asNumber(pRecord[selectChainName]);
    if (chainId) {
      switchChain({ chainId });
    }
  }, [pRecord]);

  return (
    <Stack direction="column">
      <SelectUi
        def={attributeDef}
        value={chainId}
        action={(value: PRecord) =>
          setPRecord((pRecord) => {
            const chainId0 = asNumber(value[selectChainName]);
            if (pRecord[selectChainName] === chainId0) {
              return pRecord;
            }
            return {
              ...pRecord,
              [selectChainName]: chainId0
            };
          })
        }
      />
    </Stack>
  );
};
