import { celoAlfajores, fraxtalTestnet, modeTestnet } from "@/context/customTestnets";
import { baseSepolia, optimismSepolia } from "thirdweb/chains";

export const chains: { [key: number]: any } = {
    11155420: optimismSepolia,
    84532: baseSepolia,
    44787: celoAlfajores,
    2522: fraxtalTestnet,
    919: modeTestnet,
};