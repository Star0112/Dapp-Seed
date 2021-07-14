import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { RefreshContextProvider } from './context/RefreshContext';
import { ThemeProvider } from 'styled-components';
import Layout from './layout';
import Home from './views/Home';
import theme from './theme';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RefreshContextProvider>
        <Router>
          <Layout>
            <Switch>
              <Route path="/" component={Home} exact />
            </Switch>
            <NotificationContainer />
          </Layout>
        </Router>
      </RefreshContextProvider>
    </ThemeProvider>
  );
}

export default App;
