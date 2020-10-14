import { makeStyles } from '@material-ui/core';
import React from 'react';
import Graph from './Graph';
import Header from './Header';

const useStyles = makeStyles({
  root: {
    width: '85%', 
    margin: 'auto', 
  },
  graph: {
    width: '50%',
    margin: 'auto'
  }
});

export default function Space() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Header />
        <div className={classes.graph}>
          <Graph />
        </div>
        
    </div>
  );
}