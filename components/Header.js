// Header.js
import React, { useState } from 'react';
import { FiSearch, FiMenu, FiUser, FiLogIn } from 'react-icons/fi'; 

function Header() {
    const [searchInput, setSearchInput] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen); 
    };

    return (
        <header className="bg-emerald-500 shadow-md p-4 text-white"> 
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            {/* Logo or Branding */}
                            <a href="/">
                                <span className="text-xl font-bold">Nyumba</span>
                            </a>
                        </div>

                        <div className="hidden md:flex md:ml-6 items-center">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-300" />
                                </span>
                                <input
                                    className="py-2 pl-10 pr-4 rounded-full text-sm flex-1 border border-gray-300 focus:outline-none focus:border-white"
                                    type="text"
                                    placeholder="Search"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation links for medium screens and up */}
                    <nav className="hidden md:flex space-x-4"> {/* Changed to 'md:flex' to show on medium screens and up */}
                        <a href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">Become a host</a> {/* Adjusted hover color */}
                        <a href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">Help</a> {/* Adjusted hover color */}
                        <a href="/users/signup" className="flex items-center text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">
                            <FiUser className="mr-1" /> Sign up
                        </a>
                        <a href="/users/login" className="flex items-center text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">
                            <FiLogIn className="mr-1" /> Log in
                        </a>
                    </nav>

                    {/* Hamburger menu on small screens */}
                    <div className="flex items-center md:hidden"> {/* Adjusted to hide on 'md' and larger screens */}
                        {/* Hamburger button */}
                        <button 
                            type="button" 
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-emerald-700 focus:outline-none" 
                            onClick={toggleMobileMenu} 
                        >
                            <FiMenu className="block h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile menu, show/hide based on menu state. */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="/create-listing" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">Create</a>
                            <a href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">Become a host</a>
                            <a href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">Help</a>
                            <a href="/users/signup" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">Sign up</a>
                            <a href="/users/login" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-700">Log in</a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
