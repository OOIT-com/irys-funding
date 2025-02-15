import { JSX, ReactNode } from 'react';
import { FundingIrysUi } from '../funding-irys/FundingIrysUi';

import fundingIrysPng from '../images/funding-irys.png';
import { AppIcon } from '../common/AppIcon';

export type MenuEntry = {
  path: string;
  name: string;
  icon?: ReactNode;
  description: string;
  element: JSX.Element;
  hidden?: boolean;
};
export type MenuColumn = { name: string; description: string; entries: MenuEntry[] };
const menuColumnsAll: MenuColumn[] = [
  {
    name: ' User DApps',
    description: '',
    entries: [
      {
        path: 'funding-irys',
        name: 'Funding Irys',
        icon: <AppIcon src={fundingIrysPng} alt={'Funding Irys'} />,
        description: 'Funding Irys with MetaMask',
        element: <FundingIrysUi />
      }
    ]
  }
];

export const menuColumns: MenuColumn[] = menuColumnsAll
  .map((menuColumn) => {
    return {
      ...menuColumn,
      entries: menuColumn.entries
    };
  })
  .filter((menuColumn) => menuColumn.entries.length > 0);
