import { Grid, makeStyles, Theme, Typography, IconButton, Paper, InputBase } from '@material-ui/core';
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import StoreCard from './StoreCard';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme:Theme) => ({
    bigText: {
      fontSize: '5rem',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    bigTextContainer: {
      height: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    storeList: {
      height: '100vh',
      padding: '0rem 0rem 5rem 0rem',
      display: 'flex',
      flexDirection: 'row'
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      fontSize: '1.4rem',
    },
    iconButton: {
      padding: 10,
    },
    paper: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '50%',
      margin: 'auto'
    },
  }));
  

export default function Home(){
    const classes = useStyles();
    return(
        <div>
          <div className={classes.bigTextContainer}>
            <div>
              <Typography component="h2" className={classes.bigText}>Your One Stop</Typography>
              <Typography component="h2" className={classes.bigText}>Shopping Destination.</Typography>
            </div>
          </div>
          <Grid container className={classes.storeList}>
            <Grid item xs={12} style={{margin: '5rem'}}>
              <Paper component="form" className={classes.paper}>
                <InputBase
                  className={classes.input}
                  placeholder="Search Stores"
                  inputProps={{ 'aria-label': 'search stores' }}
                />
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                  <SearchIcon fontSize="large"/>
                </IconButton>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StoreCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StoreCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StoreCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StoreCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StoreCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StoreCard />
            </Grid>
          </Grid>
        </div>
    )
}