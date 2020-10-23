import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Space from "./components/Space";
import Store from "./components/Store";
import Home from "./components/Home";
import Admin from './components/Admin';

const THEME = createMuiTheme({
  typography: {
    fontFamily: `'Open Sans', "Asap", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 10,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
  },
  palette: {
    primary: {
      light: "#ffcdab",
      main: "#ffa45c",
      dark: "#e6883e",
    },
    secondary: {
      main: "#333",
      light: "#5d5d5a",
      dark: "#1a1a1a",
    },
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={THEME}>
    <BrowserRouter>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/space" component={Space} />
        <Route path="/store/:id" component={Store} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
