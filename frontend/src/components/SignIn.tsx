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

const celoAlfajores = defineChain({
    id: 44787,
    name: "Celo Alfajores",
    nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
    blockExplorers: [
        {
            name: "Alfajoresscan",
            url: "https://alfajores.celoscan.io",
            apiUrl: "https://api-alfajores.celoscan.io/api" 
        },
    ],
    testnet: true,
})

const celoDango = defineChain({
    id: 44787,
    rpc: "https://forno.dango.celo-testnet.org/",
    name: "Celo Dango",
    nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
    blockExplorers: [
        {
            name: "Dangoscan",
            url: "https://celo-dango.blockscout.com",
            apiUrl: "https://api.dango.celo.org/api"
        },
    ],
    testnet: true,
})



export const SignIn = () => {
    return (
        <ConnectButton 
            client={client}
            wallets={wallets}
            chains={[baseSepolia, optimismSepolia, celoAlfajores, celoDango]}
        />

    )
}