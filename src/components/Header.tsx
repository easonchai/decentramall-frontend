import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
    logo: {
        fontFamily: "'Pacifico', cursive",
        fontSize: '3rem'
    }
})

export default function Header(){
    const classes = useStyles();

    return(
        <nav>
            <Typography component="h1" className={classes.logo}>Decentramall</Typography>
        </nav>
    )
}