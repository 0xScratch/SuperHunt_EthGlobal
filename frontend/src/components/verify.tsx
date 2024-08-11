'use client';

import { addresses } from "@/utils/addresses";
import { IDKitWidget, ISuccessResult, useIDKit } from "@worldcoin/idkit";
import { getContract, prepareContractCall } from "thirdweb";
import { optimismSepolia } from "thirdweb/chains";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { client } from "@/app/client";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import { useState } from "react";
import file from "@/utils/abis/ID.json";
import Image from "next/image";

const idContractAddress = addresses["11155420"]["ID"];

export const Verify = () => {
    const account = useActiveAccount();
    console.log(idContractAddress)
    const idContract = getContract({
        address: idContractAddress,
        chain: optimismSepolia,
        client,
        abi: file.abi as any
    })

    const {mutateAsync: sendTx} = useSendTransaction();

    const submitTx = async (proof: ISuccessResult) => {
        try {

            const transaction = prepareContractCall({
                contract: idContract,
                method: "verifyAndExecute",
                params: [
                    account?.address as string,
                    BigInt(proof!.merkle_root),
                    BigInt(proof!.nullifier_hash),
                    decodeAbiParameters(parseAbiParameters("uint256[8]"), proof!.proof as `0x${string}`)[0],
                ]
            })
            await sendTx(transaction);
        } catch (e) {
            console.error(e)
        }
    }

    
    return (
        <div>
            {account && 
                <IDKitWidget
                    app_id={process.env.NEXt_PUBLIC_APP_ID as `app_${string}`}
                    action={process.env.NEXT_PUBLIC_ACTION as string}
                    signal={account?.address}
                    onSuccess={submitTx}
                    autoClose
                        >
                    {({ open }) => <button onClick={open} className="flex items-center space-x-2 px-4 py-3 bg-white text-black font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-75 transition-colors duration-300">
                            <Image src="/worldcoin.png" alt="Worldcoin Logo" width={20} height={20} />
                            <span>Verify WorldID</span>
                        </button>}
                </IDKitWidget>
            }
        </div>
    )
}