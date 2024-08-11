'use client';

import { SignIn } from "./SignIn";

export const NavBar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-1 bg-white">
            <div className="font-extrabold text-3xl text-[#ff0420] italic flex-shrink-0 py-4">SUPERHUNT</div>
            <div className="flex space-x-6 ml-6 font-bold flex-grow">
                <a href="#bounties" className="text-gray-500 no-underline text-lg hover:text-black transition-colors duration-300">My bounties</a>
                <a href="#submissions" className="text-gray-500 no-underline text-lg hover:text-black transition-colors duration-300">My submissions</a>
            </div>
            <div className="ml-auto mr-2 flex-shrink-0">
                <div className="w-40"> {/* Adjust width as needed */}
                    <SignIn />
                </div>
            </div>
        </nav>
    );
};