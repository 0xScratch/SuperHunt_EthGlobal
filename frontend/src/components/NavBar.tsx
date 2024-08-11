'use client';

import { useActiveAccount } from "thirdweb/react";
import { SignIn } from "./SignIn";
import { Verify } from "./verify";

export const NavBar = () => {
    const account = useActiveAccount()
    return (
        <nav className="flex items-center justify-between px-6 py-1 bg-[#f1f4f9]">
            <div className="font-extrabold text-3xl text-[#ff0420] italic flex-shrink-0 py-4 ml-3">SUPERHUNT</div>
            <div className="flex space-x-6 ml-6 font-bold flex-grow">
                <a href="#bounties" className="text-gray-500 no-underline text-lg hover:text-black transition-colors duration-300">My bounties</a>
                <a href="#submissions" className="text-gray-500 no-underline text-lg hover:text-black transition-colors duration-300">My submissions</a>
            </div>

            {account && <div className="mr-10">
                <Verify />
            </div>}
            <div className="ml-auto mr-2 flex-shrink-0">
                <div className="w-40"> {/* Adjust width as needed */}
                    <SignIn />
                </div>
            </div>
        </nav>
    );
};