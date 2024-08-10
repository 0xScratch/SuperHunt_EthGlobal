'use client'

import { useState } from 'react';
import { addresses } from "@/utils/addresses"
import { getContract, prepareContractCall, waitForReceipt } from "thirdweb"
import { client } from "@/app/client"
import { baseSepolia, optimismSepolia } from "thirdweb/chains"
import { getGitRepoDetails } from '@/utils/GitHub';
import { useSendTransaction } from 'thirdweb/react';
import { detectMethod } from 'thirdweb/utils';
import { encrypt } from '@/utils/encryption';

const attestContractAddress = addresses["11155420"]["AttestContract"]

const convertToApiUrl = (githubUrl: string): string => {
    const apiBaseUrl = "https://api.github.com/repos/";
    const urlParts = githubUrl.split("github.com/");
    if (urlParts.length !== 2) {
        throw new Error("Invalid GitHub URL");
    }
    return apiBaseUrl + urlParts[1];
};

export const Attest = () => {
    const [url, setUrl] = useState('');
    const attestContract = getContract({
        address: attestContractAddress,
        chain: optimismSepolia,
        client
    });

    // TODO: Change it with the correct contract, testing purpose for now
    const testingContract = getContract({
        address: "0x8eE93dABa63D831f1133FdE801a3e978d31A28c5",
        chain: baseSepolia,
        client
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    const {mutateAsync: sendTx} = useSendTransaction();

    const handleButtonClick = async () => {

        const convertedUrl = convertToApiUrl(url);

        const [LatestCommitHash, demoUrl, realAppUrl, authenticatedUrl, totalCommits] = await getGitRepoDetails(convertedUrl);

        const encryptedUrl = encrypt(url);
        
        const attestTransaction = prepareContractCall({
            contract: attestContract,
            method: "function attestUint(string memory Encrypted_GitHub_Repo, string memory Latest_Commit_Hash, string memory Demo_URL, string memory Real_App_URL, uint16 Total_Commits, string memory Authenticated_URL)",
            params: [encryptedUrl, LatestCommitHash, demoUrl, realAppUrl, totalCommits, authenticatedUrl]
        })
        const tx = await sendTx(attestTransaction);

        const transactionHash = tx.transactionHash

        const receipt = await waitForReceipt({
            client,
            chain: optimismSepolia,
            transactionHash
        })

        const UID = receipt.logs[1].data;

        // This will be replaced, for now just testing purpose. Replace your contract and make sure to take care of the chain on which the bounty was on!
        const testTransaction = prepareContractCall({
            contract: testingContract,
            method: "function setUID(bytes32 _UID)",
            params: [UID]
        })
        try {
            await sendTx(testTransaction);
        } catch (error) {
            console.error('Error setting UID:', error);
        }
    };


    return (
        <div>
            <input 
                type="text" 
                value={url} 
                onChange={handleInputChange} 
                placeholder="Enter URL"
                className='text-black'
            />
            <button onClick={handleButtonClick}>Submit</button>
        </div>
    );
};