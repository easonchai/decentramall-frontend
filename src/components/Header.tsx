import { Link, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Blockies from 'react-blockies';
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import Portis from "@portis/web3";
// import Fortmatic from "fortmatic";
// import MewConnect from "@myetherwallet/mewconnect-web-client";
import Torus from "@toruslabs/torus-embed";
import Web3 from 'web3';

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
        flex: 3
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
        marginTop: '1rem'
    }
}))

export default function Header(){
    const classes = useStyles();
    const [connected, setConnected] = useState(false);

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
            <div className={classes.connect}>
                {
                connected ?
                    "Connected"
                    :
                    <Web3Connect.Button
                        network="ropsten" // optional
                        providerOptions={{
                            walletconnect: {
                            package: WalletConnectProvider, // required
                            options: {
                                infuraId: "0517ded556c34f80b1c8919fe712a995" // required
                            }
                            },
                            // portis: {
                            //   package: Portis, // required
                            //   options: {
                            //     id: "PORTIS_ID" // required
                            //   }
                            // },
                            torus: {
                            package: Torus, // required
                            options: {
                                enableLogging: false, // optional
                                buttonPosition: "bottom-left", // optional
                                buildEnv: "production", // optional
                                showTorusButton: true // optional
                            }
                            },
                            // fortmatic: {
                            //   package: Fortmatic, // required
                            //   options: {
                            //     key: "FORTMATIC_KEY" // required
                            //   }
                            // },
                            // mewconnect: {
                            //   package: MewConnect, // required
                            //   options: {
                            //     infuraId: "" // required
                            //   }
                            // }
                        }}
                        onConnect={(provider: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const web3 = new Web3(provider); // add provider to web3
                            console.log("connected!")
                        }}
                        onClose={() => {
                            console.log("Web3Connect Modal Closed"); // modal has closed
                        }}
                        />
                }
            </div>
        </nav>
    )
}