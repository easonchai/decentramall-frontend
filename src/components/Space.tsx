import { Button, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import EtherService from '../services/EtherService';
import keccak256 from 'keccak256';
import dai from '../assets/dai.svg';

const useStyles = makeStyles((theme: Theme) => ({
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
  subheading: {
    textAlign: 'center',
    color: theme.palette.secondary.main,
    fontSize: '1.8rem',
    marginTop: '1rem',
    margin: 'auto',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
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
  },
  spaceOwnerOptions: {
    display: 'flex',
    width: '100%',
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem'
  },
  spaceDetails: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    margin: '2rem',
    '& h2': {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginTop: '1rem'
    },
    '& h3': {
      fontSize: '2rem',
      fontWeight: 'lighter'
    }
  }
}));

export default function Space() {
  const classes = useStyles();
  let etherService = EtherService.getInstance();
  let userAddress = etherService.getUserAddress();
  const [currentSupply, setCurrentSupply] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // First, get the current total supply
    etherService.totalSupply()
      .then(val => setCurrentSupply(parseInt(val, 16)))
      .catch(err => console.log("Fail get supply", err));

    // Then check if this person already bought a SPACE token
    if(userAddress){
      etherService.balanceOf(userAddress).then(
        balance => {
          let bal = parseInt(balance, 16);
          for(let i=0; i<bal; i++){
            etherService.tokenByIndex(userAddress, i.toString())
              .then(token => {
                if(token._hex.toString().substring(2) === keccak256(userAddress).toString('hex')){
                  // console.log("Owner")
                  setIsOwner(true);
                } 
                // else {
                //   console.log("not owner")
                // }
              })
          }
        }
      )
    }
  },[etherService, userAddress])

  const callbackFn = (result: any) => {
    console.log("cb fn ", result);
  }

  const getPrice = () => {
    let x = currentSupply + 1;
    return 2500*((x-600)/Math.sqrt(100000+(x-600)**2) + 1);
  }

  const buySpace = () => {
    etherService.buy(callbackFn)
      .then(val => console.log(val))
      .catch((err) => {
        if(err.code === "UNPREDICTABLE_GAS_LIMIT"){
          approveAmount();
        }
      })
  }

  const approveAmount = async () => {
    console.log("current", currentSupply)
    etherService.price(currentSupply+1, callbackFn)
      // Then approve
      .then(price => {
        console.log("Price: ", price)
        etherService.approve(price, callbackFn)
          .then(val => console.log("Success approve", val))
          .catch(err => console.log("Fail approve", err))
        }
      ).catch(err => console.log("Fail get price", err))
  }

  return (
    <div>
        <Typography component="h1" className={classes.heading}>Current SPACE Price</Typography>
        <Typography component="h2" className={classes.subheading}>
          <img src={dai} height="20px" alt="dai" style={{margin: '0.5rem'}} />
          {getPrice()} DAI
        </Typography>
        {
          isOwner ?
            <section className={classes.spaceDetails}>
              <Typography component="h2">Space Details</Typography>
              <Typography component="h3">{keccak256(userAddress).toString('hex')}</Typography>
              <Typography component="h2">Status</Typography>
              <Typography component="h3">Unstaked</Typography>
              <span className={classes.spaceOwnerOptions}>
                <Button variant="contained" color="primary" className={classes.primaryButton} onClick={() => buySpace()}>
                  Deposit Space
                </Button>
                <Button variant="outlined" color="primary" className={classes.secondaryButton} onClick={() => approveAmount()}>
                  Sell Space
                </Button>
              </span>
            </section>
          :
          <>
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
          </>
        }
    </div>
  );
}