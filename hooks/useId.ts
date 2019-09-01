import { useRef } from 'react';
import nanoid from 'nanoid';

export const useId = () => {
  const scope = useRef<string>(nanoid());
  return scope.current;
};
