'use client'

import { addresses } from "@/utils/addresses"
import { getContract } from "thirdweb"
import { client } from "@/app/client"
import { optimismSepolia } from "thirdweb/chains"

const attestContractAddress = addresses["11155420"]["AttestContract"]

export const Attest = () => {
    const attestContract = getContract({
        address: attestContractAddress,
        chain: optimismSepolia,
        client
    })
}