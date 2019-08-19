import { ComponentType } from 'react';

export type LayoutComponentType = ComponentType & {
  Layout?: ComponentType;
};

export * from './default';
