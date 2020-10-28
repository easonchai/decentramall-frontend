import { Link, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles((theme:Theme) => ({
    footer: {
        height: '5vh',
        display: 'flex',
        margin: '20px',
        alignItems: 'center',
    },
    footerText: {
        fontSize: '1.4rem',
        fontWeight: 'lighter',
        flex: '2',
        textAlign: 'center'
    },
    footerLinks: {
        fontSize: '1.4rem',
        color: theme.palette.primary.dark,
        paddingRight: '2rem'
    }
}))

export default function Footer() {
    const classes = useStyles();
    
    return(
        <footer className={classes.footer}>
            <span style={{flex:"1"}}>
                <Link href="https://github.com/decentramall" className={classes.footerLinks}>GitHub</Link>
                <Link href="https://twitter.com/decentramall" className={classes.footerLinks}>Medium</Link>
                <Link href="https://twitter.com/decentramall" className={classes.footerLinks}>Twitter</Link>
                <Link href="https://twitter.com/decentramall" className={classes.footerLinks}>Discord</Link>
            </span>
            <Typography component="h5" className={classes.footerText}>Decentramall 2020</Typography>
            <span style={{display: 'flex', flex:"1", justifyContent: 'flex-end', alignItems: 'center'}}>
                <GitHubIcon style={{fontSize: '2rem', marginRight: '2rem'}}/>
                <TwitterIcon style={{fontSize: '2rem', marginRight: '2rem'}}/>
                <EmailIcon style={{fontSize: '2rem', marginRight: '2rem'}}/>
            </span>
        </footer>
    )
}