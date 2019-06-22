import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider as ThemeProvider } from 'reakit';
import defaultTheme from 'reakit-theme-default';
import routes from './routes';
import { NotFoundPage } from './pages';
import { ContextProvider } from './components';
import GlobalStyle from './GlobalStyle';

// React App Root Component
export default props => {
  return (
    <BrowserRouter>
      <ContextProvider initialState={{ drizzle: props.drizzle }}>
        <ThemeProvider theme={defaultTheme}>
          <Switch>
            {routes.map((route, i) => (
              <Route key={i} exact path={route.path} render={() => <route.component {...props} />} />
            ))}
            <Route render={() => <NotFoundPage {...props} />} />
          </Switch>
        </ThemeProvider>
        <GlobalStyle />
      </ContextProvider>
    </BrowserRouter>
  );
};
