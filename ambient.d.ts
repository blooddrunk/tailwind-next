import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;

    colors: {
      main: string;
      secondary: string;
    };
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    cancellable?: true | string;
    __needValidation?: boolean;
    transformData?: true | ((data: any) => any);
    transformPayload?: ({ data, params }: { data?: any; params?: any }) => { data?: any; params?: any };
  }

  export interface AxiosInstance {
    cancel?: (requestId: string, reason: string) => void;
    cancelAll?: (reason: string) => void;
  }

  export interface AxiosResponse<T = any> extends Promise<T> {}
}
