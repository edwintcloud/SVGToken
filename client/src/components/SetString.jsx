import React, { useContext } from 'react';
import { Input } from 'reakit';
import { generate } from 'geopattern';
import { Context } from './Context';

export default () => {
  // context is the global state
  const { state, setState } = useContext(Context);

  // generate image from string
  const generateImage = value => {
    return generate(value, {
      generator: 'squares',
      color: '#9b2929',
    }).toDataUri();
  };

  const handleKeyDown = e => {
    // if the enter key is pressed, set the value with the string
    if (e.keyCode === 13) {
      // let drizzle know we want to call the `set` method with `value`
      const stackId = state.drizzle.contracts.SVGToken.methods.set.cacheSend(generateImage(e.target.value), {
        from: state.drizzleState.accounts[0],
        gas: 6000000,
        gasPrice: 40000000000,
      });

      // save the `stackId` for later reference
      setState({ stackId, value: e.target.value, init: true });
    }
  };

  return (
    <div>
      <Input type="text" onKeyDown={handleKeyDown} />
    </div>
  );
};
