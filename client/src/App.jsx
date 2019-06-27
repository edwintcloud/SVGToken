import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider as ThemeProvider } from 'reakit';
import defaultTheme from 'reakit-theme-default';
import routes from './routes';
import { NotFoundPage } from './pages';
import { ContextProvider } from './components';
import GlobalStyle from './GlobalStyle';

// React App Root Component
const App = () => {
  return (
    <BrowserRouter>
      <ContextProvider initialState={{}}>
        <ThemeProvider theme={defaultTheme}>
          <Switch>
            {routes.map(route => (
              <Route key={route.key} exact path={route.path} render={() => <route.component />} />
            ))}
            <Route render={() => <NotFoundPage />} />
          </Switch>
        </ThemeProvider>
        <GlobalStyle />
      </ContextProvider>
    </BrowserRouter>
  );
};

export default App;
