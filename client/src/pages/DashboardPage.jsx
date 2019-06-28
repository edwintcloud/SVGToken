/* eslint-disable jsx-a11y/accessible-emoji */
/* eslin-disable no-restricted-syntax */
import React, { useContext, useEffect } from 'react';
import { Grid, styled, Label, Input, Tabs, Paragraph, Box, Button } from 'reakit';
import { drizzleReactHooks } from 'drizzle-react';
import { generate } from 'geopattern';
import { withRouter } from 'react-router-dom';
import { Context, NavBar, NavLink, GoogleButton, GoogleLogoutButton } from '../components';

// See https://v0.reakit.io/components for a list of components

export default withRouter(({ history }) => {
  // context is the global state
  const { state, setState } = useContext(Context);
  const { drizzle } = drizzleReactHooks.useDrizzle();
  const contract = drizzle.contracts.SVGToken;
  const drizzleState = drizzleReactHooks.useDrizzleState(_drizzleState => ({
    SVGToken: _drizzleState.contracts.SVGToken,
    account: _drizzleState.accounts[0],
  }));
  const baseGen = generate('svg', {
    generator: 'squares',
    color: '#7221ff',
  }).toDataUri();
  let images = [];

  // each time num of images changes, update global state
  useEffect(() => {
    if (!state.currentUser) {
      history.replace('/');
    }
    if (contract && contract.methods && drizzleState.SVGToken) {
      const numImagesKey = contract.methods.getNumImages.cacheCall();
      if (drizzleState.SVGToken.getNumImages[numImagesKey]) {
        const numImages = drizzleState.SVGToken.getNumImages[numImagesKey];
        for (let i = 0; i < Number(numImages.value); i += 1) {
          contract.methods.getSVG.cacheCall(i);
        }
      }

      const svgValues = Object.values(drizzleState.SVGToken.getSVG);
      if (svgValues.length > images.length) {
        images = [];
        for (const [key, value] of Object.entries(drizzleState.SVGToken.getSVG)) {
          if (!key) break;
          const { name, style, color } = JSON.parse(value.value);
          const uri = generate(name, {
            generator: style,
            color,
          }).toDataUri();
          images.push({
            color,
            uri,
          });
        }
      }
    }

    if ((state.images && state.images.length < images.length) || !state.images) {
      setState({ images });
    }
  });

  const tryDownload = imageUri => {
    const element = window.document.createElement('a');
    element.setAttribute('href', imageUri);
    element.setAttribute('download', 'text.svg');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const updateSiteTheme = imageData => {
    setState({
      previewUri: imageData.uri,
      genInfo: {
        color: imageData.color,
      },
    });
  };

  const googleSignin = res => {
    const { familyName, givenName } = res.profileObj;
    setState({
      currentUser: {
        firstName: givenName,
        lastName: familyName,
      },
    });
  };

  const googleSignout = () => {
    setState({
      currentUser: null,
    });
    history.replace('/');
  };

  const generatePreview = () => {
    const color = window.document.getElementById('colorSelect').value;
    const style = window.document.getElementById('styleSelect').value;
    if (color === 'true' || style === 'true') return;
    const { firstName, lastName } = state.currentUser;
    const name = `${firstName} ${lastName}`;
    const uri = generate(name, {
      generator: style,
      color,
    }).toDataUri();
    setState({
      previewUri: uri,
      genInfo: {
        name,
        color,
        style,
      },
    });
  };

  const makePurchase = () => {
    if (!drizzleState.account || !state.genInfo) return;
    // let drizzle know we want to call the `set` method with `value`
    contract.methods.mint.cacheSend(JSON.stringify(state.genInfo), {
      from: drizzleState.account,
      // gas: 7001102,
      // gasPrice: 500000000,
      gas: 700000,
      gasPrice: 5000000000,
    });
  };

  if (!state.currentUser) {
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
      </AppGrid>
    );
  }

  return (
    <AppGrid image={(state.previewUri && state.previewUri) || baseGen}>
      <NavBar cols="1fr min-content min-content" color={(state.genInfo && state.genInfo.color) || null}>
        <NavLink align="left" size="2em" padding="0 20px" cols="40px 1fr" to="/">
          SVGToken
        </NavLink>
        <span
          style={{
            whiteSpace: 'pre',
            marginRight: 20,
            color: 'white',
            alignSelf: 'center',
          }}
        >
          {state.currentUser && `${state.currentUser.firstName} ${state.currentUser.lastName}`}
        </span>
        <GoogleLogoutButton buttonText="Logout" onLogoutSuccess={googleSignout} />
      </NavBar>
      <Tabs.Container>
        {tabs => (
          <Grid
            templateRows="min-content 1fr"
            justifySelf="center"
            alignSelf="center"
            borderRadius={5}
            gap={15}
            backgroundColor="white"
          >
            <Tabs marginTop={10}>
              <Tabs.Tab tab="first" {...tabs}>
                Generate
              </Tabs.Tab>
              <Tabs.Tab tab="second" {...tabs}>
                Owned
              </Tabs.Tab>
            </Tabs>
            <Tabs.Panel
              tab="first"
              {...tabs}
              padding="15px 30px 25px 30px"
              justifySelf="center"
              boxShadow="0 0.125rem 0.5rem rgba(0, 0, 0, 0.3), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2)"
              borderRadius="3px"
            >
              <Grid gap={30}>
                <Grid templateColumns="min-content 1fr" alignItems="center">
                  <Paragraph margin="20px 90px 15px 0" fontSize={16}>
                    Preview:
                  </Paragraph>
                  <Box
                    justifySelf="center"
                    width={150}
                    height={150}
                    border="1px solid black"
                    background={state.previewUri && `url(${state.previewUri})`}
                  />
                </Grid>

                <Grid>
                  <Grid templateColumns="min-content 1fr">
                    <Label htmlFor="styleSelect" alignSelf="center" marginRight={40}>
                      Style:
                    </Label>
                    <Input use="select" id="styleSelect" onChange={generatePreview}>
                      <option disabled selected value>
                        -- select an option --
                      </option>
                      <option value="chevrons">Chevrons</option>
                      <option value="overlappingCircles">Overlapping Circles</option>
                      <option value="plusSigns">Plus Signs</option>
                      <option value="xes">XES</option>
                      <option value="sineWaves">Sine Waves</option>
                      <option value="hexagons">Hexagons</option>
                      <option value="overlappingRings">Overlapping Rings</option>
                      <option value="plaid">Plaid</option>
                      <option value="triangles">Triangles</option>
                      <option value="squares">Squares</option>
                      <option value="nestedSquares">Nested Squares</option>
                      <option value="mosaicSquares">Mosaic Squares</option>
                      <option value="concentricCircles">Concentric Circles</option>
                      <option value="diamonds">Diamonds</option>
                      <option value="tessellation">Tessellation</option>
                    </Input>
                  </Grid>
                </Grid>
                <Grid>
                  <Grid templateColumns="min-content 1fr">
                    <Label htmlFor="colorSelect" alignSelf="center" marginRight={40}>
                      Color:
                    </Label>
                    <Input use="select" id="colorSelect" onChange={generatePreview}>
                      <option disabled selected value>
                        -- select an option --
                      </option>
                      <option value="#103880">Navy</option>
                      <option value="#2E73FC">Blue</option>
                      <option value="#1AF9FE">Aqua</option>
                      <option value="#0B8080">Teal</option>
                      <option value="#808014">Olive</option>
                      <option value="#30800F">Green</option>
                      <option value="#5AE424">Lime</option>
                      <option value="#FCEB2F">Yellow</option>
                      <option value="#FFA625">Orange</option>
                      <option value="#FE431C">Red</option>
                      <option value="#801D08">Maroon</option>
                      <option value="#F382FD">Fuschia</option>
                      <option value="#823F80">Purple</option>
                      <option value="#C1C1C1">Silver</option>
                      <option value="#808080">Gray</option>
                      <option value="#000000">Black</option>
                    </Input>
                  </Grid>
                </Grid>
                <Grid justifyContent="center">
                  <Button
                    height={50}
                    width={120}
                    fontSize={20}
                    fontWeight={300}
                    backgroundColor={(state.previewUri && `rgb(61, 17, 132)`) || `rgba(61, 17, 132, 0.3)`}
                    disabled={!state.previewUri}
                    onClick={makePurchase}
                  >
                    Purchase
                  </Button>
                </Grid>
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel
              tab="second"
              {...tabs}
              justifySelf="center"
              boxShadow="0 0.125rem 0.5rem rgba(0, 0, 0, 0.3), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2)"
              borderRadius="3px"
            >
              <Grid
                gap={20}
                margin={5}
                templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
                overflowY="auto"
                height="50vh"
                width="50vw"
              >
                {(state.images &&
                  state.images.length > 0 &&
                  state.images.map(imageData => (
                    <Grid margin={15} justifyItems="center">
                      <Grid justifyItems="center" gap={10} width="min-content" height={220}>
                        <Box
                          justifySelf="center"
                          width={150}
                          height={150}
                          border="1px solid black"
                          background={`url(${imageData.uri})`}
                          onClick={() => updateSiteTheme(imageData)}
                          cursor="pointer"
                        />

                        <Button
                          height={50}
                          width={120}
                          fontSize={20}
                          fontWeight={300}
                          backgroundColor="rgba(61, 17, 132, 1)"
                          onClick={() => tryDownload(imageData.uri)}
                        >
                          Download
                        </Button>
                      </Grid>
                    </Grid>
                  ))) || <Paragraph alignSelf="center">Nothing to see here... </Paragraph>}
              </Grid>
            </Tabs.Panel>
          </Grid>
        )}
      </Tabs.Container>
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
