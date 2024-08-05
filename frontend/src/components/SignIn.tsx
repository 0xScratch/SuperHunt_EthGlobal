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

const metalL2Testnet = defineChain({
    id: 1740,
    name: "Metal L2 Testnet",
    nativeCurrency: {name: "ETH", symbol: "ETH", decimals: 18},
    blockExplorers: [
        {
            name: "Metal L2 Testnet Explorer",
            url: "https://testnet.explorer.metall2.com",
            apiUrl: "https://api.metall2.com/api"
        },
    ],
    testnet: true,
})

const fraxtalTestnet = defineChain({
    id: 2522,
    name: "Fraxtal Testnet",
    nativeCurrency: {name: "Frax Ether", symbol: "frxETH", decimals: 18},
    blockExplorers: [
        {
            name: "Fraxscan",
            url: "https://holesky.fraxscan.com",
        },
    ],
    testnet: true,
})

const modeTestnet = defineChain({
    id: 919,
    name: "Mode Testnet",
    nativeCurrency: {name: "Sepolia Ether", symbol: "ETH", decimals: 18},
    blockExplorers: [
        {
            name: "Mode Sepolia Explorer",
            url: "https://sepolia.explorer.mode.network"
        },
    ],
    testnet: true,
})

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