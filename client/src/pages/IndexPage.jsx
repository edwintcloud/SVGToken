/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext, useEffect } from 'react';
import { Grid, styled, Box } from 'reakit';
import { withRouter } from 'react-router-dom';
import { generate } from 'geopattern';
import { Context, NavBar, NavLink, GoogleButton, BannerText } from '../components';

// See https://v0.reakit.io/components for a list of components

export default withRouter(({ history }) => {
  // context is the global state
  const { state, setState } = useContext(Context);

  useEffect(() => {
    if (state.currentUser) {
      history.replace('/dashboard');
    }
  });

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
