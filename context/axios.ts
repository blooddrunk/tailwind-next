import { AxiosInstance } from 'axios';

import { createSimpleCtx } from './helpers';

const [useAxios, Provider] = createSimpleCtx<AxiosInstance>();

export { useAxios, Provider };
