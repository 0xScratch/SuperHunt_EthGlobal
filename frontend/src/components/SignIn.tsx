'use client'

import { client } from "@/app/client"
import { ConnectButton } from "thirdweb/react"
import { inAppWallet } from "thirdweb/wallets"

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
        />
    )
}