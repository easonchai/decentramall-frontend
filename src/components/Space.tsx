import { Button, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Graph from './Graph';
import Header from './Header';
import EtherService from '../services/EtherService';

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
  let etherService = EtherService.getInstance();

  const callbackFn = (result: any) => {
    console.log("cb fn ", result);
  }

  const buySpace = () => {
    etherService.buy(callbackFn)
      .then(val => console.log(val))
      .catch(err => console.log(err))
  }

  const approveAmount = async () => {
    //Bad idea to chain but it is what it is    
    // First, get total supply
    etherService.totalSupply()
      // Then get price
      .then(currentSupply => 
        etherService.price(parseInt(currentSupply,16)+1, callbackFn)
          // Then approve
          .then(price => {
            console.log("Price: ", price)
            etherService.approve(price, callbackFn)
              .then(val => console.log("Success approve", val))
              .catch(err => console.log("Fail approve", err))
            }
          ).catch(err => console.log("Fail get price", err))
      ).catch(err => console.log("Fail get supply", err));
  }

  return (
    <div className={classes.root}>
        <Header />
        <Typography component="h1" className={classes.heading}>Current SPACE Price</Typography>
        <div className={classes.graph}>
          <Graph />
        </div>
        <span className={classes.newUserOptions}>
          <Button variant="contained" color="primary" className={classes.primaryButton} onClick={() => buySpace()}>
            Buy Space
          </Button>
          <Button variant="outlined" color="primary" className={classes.secondaryButton} onClick={() => approveAmount()}>
            Rent Space
          </Button>
        </span>
    </div>
  );
}