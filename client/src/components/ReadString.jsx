import React, { useContext, useEffect } from 'react';
import { Context } from './Context';

export default () => {
  // context is the global state
  const { state, setState } = useContext(Context);

  if (!state.dataKey) {
    const dataKey = state.drizzle.contracts.SVGToken.methods.myString.cacheCall();
    setState({ dataKey });
  }

  // using the saved `dataKey`, get the variable we're interested in
  const myString = state.drizzleState.contracts.SVGToken.myString[state.dataKey];

  useEffect(() => {
    if (myString && myString.value) {
      setState({ image: myString.value, init: false });
    }
  }, [myString, setState]);

  return <></>;
};
