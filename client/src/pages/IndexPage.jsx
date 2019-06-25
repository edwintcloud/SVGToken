/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext } from 'react';
import { Grid, styled, Box } from 'reakit';
import { withRouter } from 'react-router-dom';
import { generate } from 'geopattern';
import { Context, NavBar, NavLink, GoogleButton, BannerText } from '../components';

// See https://v0.reakit.io/components for a list of components

export default withRouter(({ history }) => {
  // context is the global state
  const { state, setState } = useContext(Context);

  const googleSignin = res => {
    const { familyName, givenName } = res.profileObj;
    setState({
      currentUser: {
        firstName: givenName,
        lastName: familyName,
      },
    });
    history.push('/dashboard');
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
  }

  return (
    <AppGrid
      image={generate('svg', {
        generator: 'squares',
        color: '#7221ff',
      }).toDataUri()}
    >
      <NavBar cols="1fr min-content min-content">
        <NavLink align="left" size="2em" padding="0 20px" cols="40px 1fr" to="/">
          SVGToken
        </NavLink>
        <GoogleButton
          clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
          uxMode="redirect"
          buttonText="Sign In"
          onSuccess={googleSignin}
          onFailure={err => console.log(err)}
          className="button"
          isSignedIn
        />
      </NavBar>
      <Box alignSelf="center" justifySelf="center">
        <BannerText>I heard you can store images on the blockchain 🔗</BannerText>
        <BannerText alt="left" margin="50px 200px">
          I mean sure... if you got the gas 💁‍♂️
        </BannerText>
      </Box>
    </AppGrid>
  );
});

// Styled Components, Media Queries, and Animations

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
