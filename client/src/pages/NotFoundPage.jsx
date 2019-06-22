import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, styled, Heading, Paragraph } from 'reakit';

export default withRouter(props => {
  // Redirect to not-found page with message on component mount.
  useEffect(() => {
    if (props.location.pathname !== '/not-found') {
      props.history.replace('/not-found', props.location.pathname);
    }
  });

  return (
    <Box textAlign="center">
      <Info use="h1">
        <Paragraph>
          Page
          {props.location.state}
          not found 😱
        </Paragraph>
      </Info>
    </Box>
  );
});

// Styled Components, Media Queries, and Animations

const Info = styled(Heading)`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin) !important;
  color: white;
  font-weight: unset;
  margin: unset;
`;
