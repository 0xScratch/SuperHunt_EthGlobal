'use client';

import { addresses } from "@/utils/addresses";
import { IDKitWidget, ISuccessResult, useIDKit } from "@worldcoin/idkit";
import { getContract, prepareContractCall } from "thirdweb";
import { optimismSepolia } from "thirdweb/chains";
import { TransactionButton, useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "@/app/client";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import { useState } from "react";
import file from "@/utils/abis/ID.json";
import Image from "next/image";
import { detectMethod } from "thirdweb/utils";

const idContractAddress = addresses["11155420"]["ID"];

export const Verify = () => {
    const account = useActiveAccount();

    const idContract = getContract({
        address: idContractAddress,
        chain: optimismSepolia,
        client,
    })

    const { data: isVerified } = useReadContract({
        contract: idContract,
        method: "function getIsWorldIDverified(address signal) public view returns (bool)",
        params: [account?.address as string]
    })

    const {mutateAsync: sendTx} = useSendTransaction();

    const submitTx = async (proof: ISuccessResult) => {
        try {

            const transaction = prepareContractCall({
                contract: idContract,
                method: "function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof)",
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
        <div className="flex gap-4">
            {!isVerified ? (
                <>
                    <TransactionButton
                        transaction={() => prepareContractCall({
                            contract: idContract,
                            method: "function manualVerify(address _currentUser)",
                            params: [account?.address as string]
                        })}
                    >
                        Manual Verify
                    </TransactionButton>
                    {account && 
                        <IDKitWidget
                            app_id={process.env.NEXt_PUBLIC_APP_ID as `app_${string}`}
                            action={process.env.NEXT_PUBLIC_ACTION as string}
                            signal={account?.address}
                            onSuccess={submitTx}
                            autoClose
                        >
                            {({ open }) => (
                                <button 
                                    onClick={open} 
                                    className="flex items-center space-x-2 px-4 py-3 bg-white text-black font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-75 transition-colors duration-300"
                                >
                                    <Image src="/worldcoin.png" alt="Worldcoin Logo" width={20} height={20} />
                                    <span>Verify WorldID</span>
                                </button>
                            )}
                        </IDKitWidget>
                    }
                </>
            ) : (
                <div className="flex items-center bg-green-100 border-2 border-green-500 rounded-lg p-4 font-bold text-green-700 shadow-lg animate-pulse">
                    <div className="w-5 h-5 bg-green-500 rounded-full mr-2 relative">
                        <div className="absolute top-0 left-0 w-full h-full border-2 border-green-500 rounded-full animate-ping"></div>
                    </div>
                    <span>World ID Verified!</span>
                </div>
            )}
        </div>
    )
}