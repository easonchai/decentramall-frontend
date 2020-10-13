import { Link, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import ConnectWallet from './ConnectWallet';

const useStyles = makeStyles((theme: Theme) => ({
    logo: {
        fontFamily: "'Pacifico', cursive",
        fontSize: '3rem',
        color: theme.palette.secondary.main,
        cursor: 'pointer'
    }, 
    links: {
        fontSize: '3rem',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'uppercase',
        flex: 2
    },
    active: {
        color: theme.palette.primary.main,
        margin: '0px 20px',
        cursor: 'pointer'
    },
    link: {
        color: theme.palette.secondary.main,
        margin: '0px 20px',
        cursor: 'pointer'
    },
    connect: {
        flex: 1
    },
    navigation: {
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '85%', 
        margin: 'auto', 
        marginTop: '1rem'
    }
}))

export default function Header(){
    const classes = useStyles();

    const isActive = (href:string) => {
        if (href === window.location.pathname){
            return true;
        } else {
            return false;
        }
    }

    return(
        <nav className={classes.navigation}>
            <Typography component="h1" style={{flex: '1'}}>
                <Link href="/" className={classes.logo} underline="none">Decentramall</Link>
            </Typography>
            <ul className={classes.links}>
                <Link href="/" className={isActive("/") ? classes.active : classes.link} underline="none">Home</Link>
                <Link href="/space" className={isActive("/space") ? classes.active : classes.link} underline="none">Space</Link>
            </ul>
            {/* <Typography component="h2" className={classes.connect}>Connect Wallet</Typography> */}
            <ConnectWallet />
        </nav>
    )
}