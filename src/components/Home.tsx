import { makeStyles } from '@material-ui/core';
import React from 'react';
import Header from './Header';

const useStyles = makeStyles({
    root: {
      width: '85%', 
      margin: 'auto', 
    },
  });
  

export default function Home(){
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <Header />
        </div>
    )
}