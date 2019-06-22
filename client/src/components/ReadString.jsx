import React, { useContext } from 'react';
import { Context } from './Context';
import { Heading } from 'reakit';

export default props => {
  // context is the global state
  const { state, setState } = useContext(Context);

  if (!state.dataKey) {
    const dataKey = state.drizzle.contracts.SVGToken.methods['myString'].cacheCall();
    setState({ dataKey });
  }

  // using the saved `dataKey`, get the variable we're interested in
  const myString = state.drizzleState.contracts.SVGToken.myString[state.dataKey];

  return <Heading fontWeight={200}>My stored string: {myString && myString.value}</Heading>;
};
