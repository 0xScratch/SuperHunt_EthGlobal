import { defineChain } from "thirdweb";

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

export { celoAlfajores, celoDango, metalL2Testnet, fraxtalTestnet, modeTestnet }