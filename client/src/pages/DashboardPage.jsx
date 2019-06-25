/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext } from 'react';
import { Grid, styled, Label, Input, Group, Tabs, Paragraph, Box, Button } from 'reakit';
import { generate } from 'geopattern';
import { withRouter } from 'react-router-dom';
import { ReadString, Context, NavBar, NavLink, GoogleButton, BannerText, GoogleLogoutButton } from '../components';

// See https://v0.reakit.io/components for a list of components

export default withRouter(({ history }) => {
  // context is the global state
  const { state, setState } = useContext(Context);

  const tryDownload = () => {
    if (!state.previewUri) return;
    const element = window.document.createElement('a');
    element.setAttribute('href', state.previewUri);
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
    console.log(color);
    console.log(style);
    console.log(name);
    const uri = generate(name, {
      generator: style,
      color,
    }).toDataUri();
    setState({ previewUri: uri });
  };

  const makePurchase = () => {
    console.log('ding');
    // let drizzle know we want to call the `set` method with `value`
    state.drizzle.contracts.SVGToken.methods.set.cacheSend(state.previewUri, {
      from: state.drizzleState.accounts[0],
      gas: 6000000,
      gasPrice: 40000000000,
    });
    setState({ init: true });
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

  if (!state.currentUser || !state.drizzleState) {
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
        <NavLink align="left" size="2em" padding="0 20px" cols="40px 1fr">
          SVGToken
        </NavLink>
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
              backgroundColor="white"
              height="min-content"
              width="50vw"
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
              <Tabs.Panel tab="second" {...tabs}>
                Second
              </Tabs.Panel>
            </Grid>
          )}
        </Tabs.Container>
      </BannerText>
      <ReadString />
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
