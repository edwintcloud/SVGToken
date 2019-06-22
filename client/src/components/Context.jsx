import React, { useState } from 'react';

export const Context = React.createContext(null);

export const ContextProvider = ({ initialState, children }) => {
  const [state, setState] = useState(initialState);

  const providerActions = {
    setState: values =>
      setState(prevState => {
        return { ...prevState, ...values };
      }),
  };
  return (
    <Context.Provider
      value={{
        state: { ...state },
        ...providerActions,
      }}
    >
      {children}
    </Context.Provider>
  );
};
