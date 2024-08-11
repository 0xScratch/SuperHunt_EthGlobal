'use client';

import { addresses } from '@/utils/addresses';
import { useState } from 'react';
import { TransactionButton, useActiveWallet, useActiveWalletChain } from 'thirdweb/react';
import { chains } from '../utils/chains';
import { client } from '@/app/client';
import { getContract } from 'thirdweb';

export const PostBounty = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [worldIDVerified, setWorldIDVerified] = useState(false);
    const [balance, setBalance] = useState('');

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     // Handle form submission logic here
    //     console.log({
    //         title,
    //         description,
    //         instructions,
    //         worldIDVerified,
    //         balance,
    //     });
    // };

    const wallet = useActiveWalletChain()

    const superHuntContractAddress = addresses['11155420']['SuperHunt'];

    const contract = getContract({
        address: superHuntContractAddress,
        chain: chains[wallet?.id as number],
        client  
    })

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-red-600">Post a Bounty</h2>
            <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <label className="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <label className="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <label className="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="instructions">
                        Instructions
                    </label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <label className="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4">
                        World ID Verified
                    </label>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="worldIDYes"
                            name="worldIDVerified"
                            value="yes"
                            checked={worldIDVerified === true}
                            onChange={() => setWorldIDVerified(true)}
                            className="mr-2"
                        />
                        <label htmlFor="worldIDYes" className="mr-4">Yes</label>
                        <input
                            type="radio"
                            id="worldIDNo"
                            name="worldIDVerified"
                            value="no"
                            checked={worldIDVerified === false}
                            onChange={() => setWorldIDVerified(false)}
                            className="mr-2"
                        />
                        <label htmlFor="worldIDNo">No</label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <label className="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="balance">
                        Balance (in dollars)
                    </label>
                    <input
                        type="number"
                        id="balance"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>
                <button
                    type='submit'
                    className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-300"
                >
                    Post Bounty
                </button>
            </form>
        </div>
    );
};