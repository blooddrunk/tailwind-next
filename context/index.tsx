import { ReactNode } from 'react';

import { AxiosProvider } from './axios';
import axios from '@/plugins/axios';

export default ({ children }: { children: ReactNode }) => {
  return <AxiosProvider value={axios}>{children}</AxiosProvider>;
};

export * from './axios';
