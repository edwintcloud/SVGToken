import React, { useContext } from 'react';
import { Grid, styled, keyframes, Image, Heading, Box } from 'reakit';
import { generate } from 'geopattern';
import logo from '../static/images/logo.svg';
import { ReadString, SetString, Context, NavBar, NavLink, GoogleButton, BannerText } from '../components';

// See https://v0.reakit.io/components for a list of components

export default () => {
  // context is the global state
  const { state, setState } = useContext(Context);

  const tryOpen = () => {
    if (!state.image) return;
    const element = window.document.createElement('a');
    element.setAttribute('href', state.image);
    element.setAttribute('download', 'text.svg');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

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
    <AppGrid
      image={generate('svg', {
        generator: 'squares',
        color: '#7221ff',
      }).toDataUri()}
    >
      <NavBar cols="1fr min-content min-content">
        <NavLink align="left" size="2em" padding="0 20px" cols="40px 1fr">
          SVGToken
        </NavLink>
        <GoogleButton
          clientId={process.env.GOOGLE_OAUTH_CLIENT_ID}
          uxMode="redirect"
          buttonText="Sign In"
          onSuccess={() => {}}
          onFailure={err => console.log(err)}
          className="button"
          isSignedIn
        />
      </NavBar>
      <Box alignSelf="center" justifySelf="center">
        <BannerText>I heard you can store images on the blockchain 🔗</BannerText>
        <BannerText alt margin="50px 200px">
          Sign in and find out 🔑
        </BannerText>
      </Box>
      {/* <ReadString />
      <Logo src={logo} alt="logo" />
      <SetString />
      {(state.init && 'Please confirm transaction') || state.value}
      <button type="button" onClick={tryOpen}>
        Test
      </button> */}
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
  ${props =>
    (props.image &&
      `
  background-image: url(${props.image});
  `) ||
    `background-color: #282c34;`}
  padding-top: 60px;
  min-height: 100vh;
`;
