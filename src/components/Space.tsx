import { Button, makeStyles, Theme, Typography, useMediaQuery, useTheme, Dialog, DialogActions, DialogTitle, DialogContent, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import EtherService from '../services/EtherService';
import keccak256 from 'keccak256';
import dai from '../assets/dai.svg';
import Chipset from './Chipset';

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
    marginTop: '5rem'
  },
  spaceDetails: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    margin: '2rem',
    alignItems: 'center',
    '& h2': {
      color: theme.palette.secondary.main,
      fontSize: '2rem',
      fontWeight: 'bold',
      marginTop: '1rem'
    },
    '& h4': {
      color: theme.palette.secondary.main,
      fontSize: '2rem',
      marginTop: '1rem'
    },
    '& h3': {
      color: theme.palette.secondary.main,
      fontSize: '2rem',
      fontWeight: 'lighter'
    }
  },
  dialogTitle: {
    '& h2': {
      fontSize: '2rem'
    }
  }
}));

export default function Space() {
  const classes = useStyles();
  let etherService = EtherService.getInstance();
  let userAddress = etherService.getUserAddress();
  const [currentSupply, setCurrentSupply] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [contractBalance, setContractBalance] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [spaceList, setSpaceList] = React.useState<string[]>([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRentOpen = () => {
    setOpen(true);
  };

  const handleRentClose = () => {
    setOpen(false);
  };

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
                  setTokenId(token._hex.toString());
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

    if(open){
      getContractBalance();
    }
  },[etherService, userAddress, open])

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

  const sellSpace = async () => {
    etherService.sell(tokenId, callbackFn)
      .then(val => console.log("Success sell", val))
      .catch(err => console.log("Fail sell", err))
  }

  const getContractBalance = async () => {
    let address = "0x31263af02f40Aa9479eCb7e1c890999863b69725";
    etherService.balanceOf(address)
      .then(bal => {
        let balance = parseInt(bal);
        // Set contract balance
        setContractBalance(balance);

        // Set list
        let list: string[] = [];
        for(let i=0; i<balance; i++){
          etherService.tokenByIndex(address, i.toString())
            .then(token => list.push(token._hex.toString()))
            .catch(err => console.log(err));
        }
        setSpaceList(list);
      })
      .catch(err => console.log(err))
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
              <Typography component="h4">Token ID</Typography>
              <Typography component="h3">{tokenId}</Typography>
              <Typography component="h4">Status</Typography>
              <Chipset status="unstaked" />
              <span className={classes.spaceOwnerOptions}>
                <Button variant="contained" color="primary" className={classes.primaryButton} onClick={() => buySpace()}>
                  Stake Space
                </Button>
                <Button variant="outlined" color="primary" className={classes.secondaryButton} onClick={() => sellSpace()}>
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
              <Button variant="outlined" color="primary" className={classes.secondaryButton} onClick={() => handleRentOpen()}>
                Rent Space
              </Button>
            </span>
          </>
        }
        {
          open &&
          <div style={{fontSize: '2rem'}}>
            <Dialog
              fullScreen={fullScreen}
              open={open}
              onClose={handleRentClose}
              aria-labelledby="rent-dialog"
            >
              <DialogTitle className={classes.dialogTitle}>{"Available Spaces To Rent"}</DialogTitle>
              <DialogContent>
                <Grid container>
                  {contractBalance === 0 ?
                    "There are no available spaces to rent!" :
                    
                  }
                </Grid>
              </DialogContent>
            </Dialog>
          </div>
        }
    </div>
  );
}