import React, { useState } from 'react';
import PropTypes from 'prop-types';

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

ContextProvider.defaultProps = {
  initialState: {},
};

ContextProvider.propTypes = {
  initialState: PropTypes.shape({}),
  children: PropTypes.node.isRequired,
};
