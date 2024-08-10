'use client';

import { client } from "@/app/client"
import { baseSepolia, optimismSepolia } from "thirdweb/chains"
import { ConnectButton } from "thirdweb/react"
import { inAppWallet } from "thirdweb/wallets"
// import { defineChain } from "thirdweb/chains"
import {
    celoAlfajores,
    metalL2Testnet,
    fraxtalTestnet,
    modeTestnet
} from "@/context/customTestnets"

const wallets = [
    inAppWallet({
        auth: {
            options: [
                "passkey"
            ]
        }
    })
]

export const SignIn = () => {
    return (
        <ConnectButton 
            client={client}
            wallets={wallets}
            chains={[optimismSepolia, baseSepolia, celoAlfajores, metalL2Testnet, fraxtalTestnet, modeTestnet]}
            accountAbstraction={
                {
                    chain: optimismSepolia,
                    sponsorGas: true,
                    // factoryAddress: "0xAde918BDd0BB917B8e41753D0142A71E144Ff764"
                    
                }
            }
  
        />

    )
}