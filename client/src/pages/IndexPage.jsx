import React, { useContext } from 'react';
import { Grid, styled, keyframes, Image, Heading } from 'reakit';
import logo from '../static/images/logo.svg';
import { ReadString, SetString, Context } from '../components';

// See https://v0.reakit.io/components for a list of components

export default props => {
  // context is the global state
  const { state, setState } = useContext(Context);

  if (!state.drizzleState) {
    // setup listener
    state.drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = state.drizzle.store.getState();

      // check to see if it's ready, if so, update global context state
      if (drizzleState.drizzleStatus.initialized) {
        setState({
          drizzleState,
        });
      }
    });
    return (
      <AppGrid textAlign="center">
        <Logo src={logo} alt="logo" />
        <Heading>Loading Drizzle...</Heading>
      </AppGrid>
    );
  }

  return (
    <AppGrid textAlign="center">
      <Logo src={logo} alt="logo" />
      <ReadString />
      <SetString />
    </AppGrid>
  );
};

// Styled Components, Media Queries, and Animations

const LogoSpin = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

const Logo = styled(Image)`
  animation: ${LogoSpin} infinite 20s linear;
  height: 25vmin;
  pointer-events: none;
`;

const AppGrid = styled(Grid)`
  background-color: #282c34;
  grid-template-rows: 34vh min-content min-content;
  min-height: 100vh;
  align-items: center;
  justify-items: center;
  color: white;
  padding: 10vh 25vw;
`;
