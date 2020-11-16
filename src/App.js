import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link,
  withRouter,
  useLocation
} from "react-router-dom";

import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Toolbar,
  Typography,
  ListItemText
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import { theme } from './theme'
import './App.css';

import BarChartExample from './Components/BarChartExample'
import RacingBarChartExample from './Components/RacingBarChartExample'
import BrandRacing from './Components/BrandRacingChart';

// define routes - together with the menu drawer this is how the page is navigated
const routes = [
  {
    path: '/barchartexample',  // defines url ext
    name: 'BarChartExample', // name to show in the menu bar and title
    group: 1, // sublist - these will be grouped with divider between in menu drawer
    component: BarChartExample // app to render to this route/path
  },
  {
    path: '/racing',
    name: 'RacingBarChartExample',
    group: 1,
    component: RacingBarChartExample
  },
  {
    path: '/brandracing',
    name: 'BrandRacingChart',
    group: 1,
    component: BrandRacing
  },
  {
    path: '/',
    name: 'Home',
    group: 3,
    component: Home
  },
];

function getUniqueGroups(routes) {
  // takes array of routes, returns array of distinct groups for menu divisions
  let groups = routes.map((route) => { return route.group });
  return [...new Set(groups)]
};

function SubMenu({ routes, group }) {
  // takes array of routes and a group, filters for group-matching routes
  // returns a mui <List> with each as a menu item
  let matchingRoutes = routes.filter((route) => route.group === group);
  return (
    <React.Fragment>
      <List>
        {matchingRoutes.map((route, index) => {
          return (
            <ListItem button component={Link} to={route.path} key={route.name}>
              <ListItemIcon>{index % 2 === 0 ? <MailIcon /> : <InboxIcon />}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItem>
          )
        })}
      </List>
      <Divider />
    </React.Fragment>
  )
};

function Menu({ routes, toggleMenu }) {
  // takes an array of routes, orgs by group, makes into Lists and divides with Divider
  let uniqGroups = getUniqueGroups(routes);
  return (
    <div
      role="presentation"
      onClick={toggleMenu(false)}
      onKeyDown={toggleMenu(false)}
    >
      {uniqGroups.map((group) => { return <SubMenu key={group} routes={routes} group={group}></SubMenu> })}
    </div>
  )
};

const borderHeight = 2;
const useStyles = makeStyles(theme => ({
  root: {
    border: `${borderHeight}px solid blue`,
    flex: "1 1 auto",
    padding: 0,
    height: `calc(100% - 63.98px - ${borderHeight * 2}px)` // height of toolbar if you know it beforehand
  }
}));

function App() {
  // only state held in App so far is whether or not to open the menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [appTitle, setAppTitle] = useState('Home');

  const currentRoute = useLocation();
  const classes = useStyles();

  // effect to set the appbar title dep on app used
  useEffect(() => {
    let currRoute = routes.filter((route) => route.path === currentRoute.pathname);
    setAppTitle(currRoute[0].name);
  }, [currentRoute])

  // fn to open or close menu bar
  const toggleMenu = (open) => (event) => {
    // if we use either shift or tab then don't open/close, else key press will open/close
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMenuOpen(open);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu(true)}
            onKeyDown={toggleMenu(true)} >
            <MenuIcon />
          </IconButton>
          <Drawer anchor='left' open={menuOpen} onClose={toggleMenu(false)}>
            <Menu routes={routes} toggleMenu={toggleMenu}></Menu>
          </Drawer>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {appTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Switch>
        {routes.map((route) => {
          return (
            <Route key={route.name} path={route.path} component={() => <route.component classes={classes} />} />
          )
        })}
      </Switch>
    </ThemeProvider>
  );
}

// for now define dummy components to render
function Home() {
  return <h1>Home</h1>
}

export default withRouter(App);
