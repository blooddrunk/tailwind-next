import { AxiosInstance } from 'axios';

import { createCtx } from './helpers';

const [useAxios, AxiosProvider] = createCtx<AxiosInstance>();

export { useAxios, AxiosProvider };
