'use client'

import { client } from "@/app/client"
import { baseSepolia, optimismSepolia } from "thirdweb/chains"
import { ConnectButton } from "thirdweb/react"
import { inAppWallet } from "thirdweb/wallets"
import { defineChain } from "thirdweb/chains"

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
            chains={[baseSepolia, optimismSepolia]}
        />

    )
}