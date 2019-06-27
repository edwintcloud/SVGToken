/* eslint-disable jsx-a11y/accessible-emoji */
/* eslin-disable no-restricted-syntax */
import React, { useContext, useEffect } from 'react';
import { Grid, styled, Label, Input, Group, Tabs, Paragraph, Box, Button } from 'reakit';
import { drizzleReactHooks } from 'drizzle-react';
import { generate } from 'geopattern';
import { withRouter } from 'react-router-dom';
import { Context, NavBar, NavLink, GoogleButton, BannerText, GoogleLogoutButton } from '../components';

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
          images.push(value);
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

  const generateUri = () => {
    const color = window.document.getElementById('colorSelect').value;
    const style = window.document.getElementById('styleSelect').value;
    if (color === 'true' || style === 'true') return;
    const { firstName, lastName } = state.currentUser;
    const name = `${firstName} ${lastName}`;
    const uri = generate(name, {
      generator: style,
      color,
    }).toDataUri();
    setState({ previewUri: uri });
  };

  const makePurchase = () => {
    // let drizzle know we want to call the `set` method with `value`
    contract.methods.mint.cacheSend(state.previewUri, {
      from: drizzleState.account,
      gas: 1000000000,
      gasPrice: 40000000,
    });
    setState({ init: true });
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
      <BannerText
        alt="full"
        style={{
          height: '76vh',
          width: '90vw',
          background: state.previewUri && `url(${state.previewUri})`,
        }}
      >
        <Tabs.Container>
          {tabs => (
            <Grid
              templateRows="min-content 1fr"
              backgroundColor="rgba(255, 255, 255, 0.2)"
              height="min-content"
              width="44vw"
              justifySelf="center"
              alignSelf="center"
              borderRadius={5}
              gap={10}
            >
              <Tabs>
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
                width="70%"
                justifySelf="center"
                boxShadow="0 0.125rem 0.5rem rgba(0, 0, 0, 0.3), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2)"
                borderRadius="3px"
                marginBottom={30}
              >
                <Grid gap={20} marginBottom={30}>
                  <Grid>
                    <Paragraph margin="20px 90px 15px 0" fontSize={16}>
                      Preview
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
                    <Group margin="15px 30px" justifySelf="center">
                      <Label htmlFor="styleSelect" alignSelf="center" marginRight={40}>
                        Style:
                      </Label>
                      <Input use="select" id="styleSelect" height={40} width={200} onChange={generateUri} fontSize={20}>
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
                    </Group>
                  </Grid>
                  <Grid>
                    <Group margin="15px 30px" justifySelf="center">
                      <Label htmlFor="colorSelect" alignSelf="center" marginRight={40}>
                        Color:
                      </Label>
                      <Input use="select" id="colorSelect" height={40} width={200} onChange={generateUri} fontSize={20}>
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
                    </Group>
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
                width="70%"
                justifySelf="center"
                boxShadow="0 0.125rem 0.5rem rgba(0, 0, 0, 0.3), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2)"
                borderRadius="3px"
                marginBottom={30}
              >
                <Grid
                  gap={20}
                  margin={5}
                  marginBottom={30}
                  templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
                  overflowY="auto"
                  height="50vh"
                >
                  {(state.images &&
                    state.images.length > 0 &&
                    state.images.map(image => (
                      <Grid margin={15} justifyItems="center">
                        <Grid justifyItems="center" gap={10} width="min-content" height={220}>
                          <Box
                            justifySelf="center"
                            width={150}
                            height={150}
                            border="1px solid black"
                            background={image.value && `url(${image.value})`}
                          />

                          <Button
                            height={50}
                            width={120}
                            fontSize={20}
                            fontWeight={300}
                            backgroundColor={(image.value && `rgb(61, 17, 132)`) || `rgba(61, 17, 132, 0.3)`}
                            disabled={!image.value}
                            onClick={() => tryDownload(image.value)}
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
      </BannerText>
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
