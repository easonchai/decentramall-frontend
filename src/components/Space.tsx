import { Button, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import Graph from './Graph';
import Header from './Header';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%', 
    margin: 'auto', 
  },
  graph: {
    width: '50%',
    margin: 'auto',
    marginTop: '2rem'
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
    fontSize: '2rem',
    marginTop: '3rem'
  },
  newUserOptions: {
    // #429AFF
    display: 'flex',
    width: '100%',
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem'
  },
  primaryButton: {
    borderRadius: '100px',
    fontSize: '3rem',
    color: 'white',
    padding: '1rem 2rem',
    margin: '1rem'
  },
  secondaryButton: {
    borderRadius: '100px',
    fontSize: '3rem',
    margin: '1rem',
    padding: '1rem 2rem'
  }
}));

export default function Space() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Header />
        <Typography component="h1" className={classes.heading}>Current SPACE Price</Typography>
        <div className={classes.graph}>
          <Graph />
        </div>
        <span className={classes.newUserOptions}>
          <Button variant="contained" color="primary" className={classes.primaryButton}>
            Buy Space
          </Button>
          <Button variant="outlined" color="primary" className={classes.secondaryButton}>
            Rent Space
          </Button>
        </span>
    </div>
  );
}