import React from 'react';
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import MewConnect from "@myetherwallet/mewconnect-web-client";
import Web3 from 'web3';

export default function ConnectWallet(){
  return (
    <Web3Connect.Button
      network="mainnet" // optional
      providerOptions={{
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID" // required
          }
        },
        portis: {
          package: Portis, // required
          options: {
            id: "PORTIS_ID" // required
          }
        },
        torus: {
          package: Torus, // required
          options: {
            enableLogging: false, // optional
            buttonPosition: "bottom-left", // optional
            buildEnv: "production", // optional
            showTorusButton: true // optional
          }
        },
        fortmatic: {
          package: Fortmatic, // required
          options: {
            key: "FORTMATIC_KEY" // required
          }
        },
        mewconnect: {
          package: MewConnect, // required
          options: {
            infuraId: "INFURA_ID" // required
          }
        }
      }}
      onConnect={(provider: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const web3 = new Web3(provider); // add provider to web3
      }}
      onClose={() => {
        console.log("Web3Connect Modal Closed"); // modal has closed
      }}
    />
  )
}