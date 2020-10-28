import { Button, makeStyles, Theme, Typography, Dialog, DialogTitle, DialogContent, Grid, ButtonBase, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import EtherService from '../services/EtherService';
import keccak256 from 'keccak256';
import dai from '../assets/dai.svg';
import Chipset from './Chipset';
import bigInt from 'big-integer';

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
  const [userAddress, setUserAddress] = useState('');
  const [currentSupply, setCurrentSupply] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [contractBalance, setContractBalance] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [spaceList, setSpaceList] = React.useState<string[]>([]);
  const [hexTokenId, setHexTokenId] = useState('');
  const [isStaked, setIsStaked] = useState(false);

  const handleRentOpen = async () => {
    getAvailableSpace();
    setOpen(true);
  };

  const handleRentClose = () => {
    setOpen(false);
  };

  const accChangeCallback = (accounts: string[]) => {
    setIsOwner(false);
    setUserAddress(accounts[0]);
    sessionStorage.setItem('userAddress', accounts[0]);
  }

  const chainChangeCallback = (chainID: string) => {
      // TODO: remove the magic number for Rinkeby network/chain id
      if (chainID !== '3') {
          console.log("not on ropsten!")
      }
  }

  useEffect(() => {
    if(etherService.isEthereumNodeAvailable()){
      etherService.addAllListeners(chainChangeCallback, accChangeCallback);

      // First, get the current total supply
      etherService.totalSupply()
        .then(val => setCurrentSupply(parseInt(val, 16)))
        .catch(err => console.log("Fail get supply", err));

      // Then check if this person already bought a SPACE token
      if(userAddress){
        let hexId = keccak256(userAddress).toString('hex');
        let id = bigInt(hexId, 16).toString();
        setHexTokenId(hexId);
        setTokenId(id);

        etherService.balanceOf(userAddress).then(
          balance => {
            let bal = parseInt(balance, 16);
            for(let i=0; i<bal; i++){
              etherService.tokenByIndex(userAddress, i.toString())
                .then(token => {
                  if(token._hex.toString().substring(2) === hexTokenId){
                    // console.log("Owner")                    
                    setIsOwner(true);
                  } 
                  else {
                    console.log("not owner")
                    setIsOwner(false);
                    // Check if this is staked
                    etherService.isStaked(id)
                    .then(res => console.log(res))
                    .catch(err => console.log(err))
                  }
                })
            }
          }
        )
      }
    }
    // componentWillUnmount alternative
    return () => {
      if (etherService.isEthereumNodeAvailable()) {
          etherService.removeAllListeners();
      }
    };
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
      .then(val => {
        console.log(val);
        setIsOwner(true);
      })
      .catch((err) => {
        if(err.code === "UNPREDICTABLE_GAS_LIMIT"){
          console.log("approve")
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

  const approveRentAmount = async (duration: number) => {
    // console.log("current", currentSupply)
    etherService.price(currentSupply+1, callbackFn)
      // Then approve
      .then(price => {
        console.log("Price: ", price)
        const approveAmount = (duration * parseInt(price)) / 22525710;

        etherService.approve(approveAmount.toString(), callbackFn)
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

  const getAvailableSpace = async () => {
    etherService.balanceOf("0x31263af02f40Aa9479eCb7e1c890999863b69725")
      .then(async bal => {
        let balance = parseInt(bal);
        // Set contract balance
        setContractBalance(balance);

        // Set list
        let list:string[] = [];
        for(let i=0; i<balance; i++){
          let val = await getTokenIdByIndex(i.toString());
          list.push(val._hex.toString())
        }
        setSpaceList(list)
      })
      .catch(err => console.log(err))
  }

  const getTokenIdByIndex = (index: string):Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      etherService.tokenByIndex("0x31263af02f40Aa9479eCb7e1c890999863b69725", index)
        .then(res => resolve(res))
        .catch(err => reject(err));
    })
  }

  const depositSpace = async () => {    
    etherService.deposit(tokenId, "375428", callbackFn)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const rentSpace = async (hexCode: string, duration: number) => {
    etherService.rent(tokenId, "random-uri", duration.toString(), callbackFn)
      .then(res => console.log("success rent: ", res))
      .catch((err) => {
        if(err.code === "UNPREDICTABLE_GAS_LIMIT"){
          approveRentAmount(duration);
        }
      })
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
              <Typography component="h3">{hexTokenId}</Typography>
              <Typography component="h4">Status</Typography>
              <Chipset status="unstaked" />
              <span className={classes.spaceOwnerOptions}>
                <Button variant="contained" color="primary" className={classes.primaryButton} onClick={() => depositSpace()}>
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
              fullWidth
              open={open}
              onClose={handleRentClose}
              aria-labelledby="rent-dialog"
              maxWidth="md"
            >
              <DialogTitle className={classes.dialogTitle}>{"Available Spaces To Rent"}</DialogTitle>
              <DialogContent>
                <Grid container style={{fontSize: '1.8rem'}}>
                  {contractBalance === 0 ?
                    "There are no available spaces to rent!" :
                    spaceList.map(id => {
                      return(
                        <Grid item xs={6} style={{padding: '3rem'}} key={id}>
                          <Card style={{minHeight: '100px', display: 'flex', alignItems: 'center'}}>
                            <ButtonBase
                              focusRipple
                              key={id}
                              onClick={() => rentSpace(id, 187714)}
                              style={{width: '100%', minHeight: '100px'}}
                            >
                              <CardContent style={{width: '100%'}}>
                                <Typography component="h1" style={{fontSize: '2rem', fontWeight:'bold'}}>
                                  &#127756; SPACE #{id.substring(0, 6) + "..." + id.substring(id.length-5, id.length+1)}
                                </Typography>
                              </CardContent>
                            </ButtonBase>
                          </Card>
                        </Grid>
                      )
                    })
                  }
                </Grid>
              </DialogContent>
            </Dialog>
          </div>
        }
    </div>
  );
}