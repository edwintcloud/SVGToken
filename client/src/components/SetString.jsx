import React, { useContext } from 'react';
import { Context } from './Context';
import { Input } from 'reakit';

export default props => {
  // context is the global state
  const { state, setState } = useContext(Context);

  const handleKeyDown = e => {
    // if the enter key is pressed, set the value with the string
    if (e.keyCode === 13) {
      // let drizzle know we want to call the `set` method with `value`
      const stackId = state.drizzle.contracts.SVGToken.methods['set'].cacheSend(e.target.value, {
        from: state.drizzleState.accounts[0],
      });

      // save the `stackId` for later reference
      setState({ stackId });
    }
  };

  const getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = state.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[state.drizzleState.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
  };

  return (
    <div>
      <Input type="text" onKeyDown={handleKeyDown} />
      <div>{getTxStatus()}</div>
    </div>
  );
};
