import React from 'react';

// create context with no upfront defaultValue
// without having to do undefined check all the time
export function createCtx<A>() {
  const ctx = React.createContext<A | undefined>(undefined);
  function useCtx() {
    const c = React.useContext(ctx);
    if (!c) throw new Error('useCtx must be inside a Provider with a value');
    return c;
  }
  return [useCtx, ctx.Provider] as const;
}

type ReducerType<State> = (state: State, action: State) => State;
export function createCtxWithReducer<A>(defaultValue: A, reducer: ReducerType<A>) {
  type DispatchType = React.Dispatch<typeof defaultValue>;
  const defaultDispatch: DispatchType = () => defaultValue;
  const ctx = React.createContext({ state: defaultValue, dispatch: defaultDispatch });
  function Provider(props: React.PropsWithChildren<{}>) {
    const [state, dispatch] = React.useReducer(reducer, defaultValue);
    return <ctx.Provider value={{ state, dispatch }} {...props} />;
  }
  return [ctx, Provider] as const;
}

export function createCtxWithState<A>(defaultValue: A) {
  type UpdateType = React.Dispatch<React.SetStateAction<typeof defaultValue>>;
  const defaultUpdate: UpdateType = () => defaultValue;
  const ctx = React.createContext({ state: defaultValue, update: defaultUpdate });
  function Provider(props: React.PropsWithChildren<{}>) {
    const [state, update] = React.useState(defaultValue);
    return <ctx.Provider value={{ state, update }} {...props} />;
  }
  return [ctx, Provider] as const;
}
