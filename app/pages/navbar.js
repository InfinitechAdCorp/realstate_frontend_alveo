// components/Navbar.js
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-customBlue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/logo.png" // Replace with your logo path
              alt="Logo"
              className="h-8 w-auto mr-2"
            />
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-green-400">
              Home
            </Link>
            <Link href="/about" className="hover:text-green-400">
              About Us
            </Link>
            <Link href="/properties" className="hover:text-green-400">
              Properties
            </Link>
            <Link href="/for-sale" className="hover:text-green-400">
              For Sale
            </Link>
            <Link href="/agent" className="hover:text-green-400">
              Agent
            </Link>
            <Link href="/careers" className="hover:text-green-400">
              Careers
            </Link>
            <Link href="/contact" className="hover:text-green-400">
              Contact Us
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="hover:text-green-400">Form & Utilities</button>
            <button className="hover:text-green-400">Download App</button>
            <button className="hover:text-green-400">🌙</button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-2 px-4 pb-4">
            <Link href="/" className="block hover:text-green-400">
              Home
            </Link>
            <Link href="/about" className="block hover:text-green-400">
              About Us
            </Link>
            <Link href="/properties" className="block hover:text-green-400">
              Properties
            </Link>
            <Link href="/for-sale" className="block hover:text-green-400">
              For Sale
            </Link>
            <Link href="/agent" className="block hover:text-green-400">
              Agent
            </Link>
            <Link href="/careers" className="block hover:text-green-400">
              Careers
            </Link>
            <Link href="/contact" className="block hover:text-green-400">
              Contact Us
            </Link>
            <button className="block w-full text-left hover:text-green-400">
              Form & Utilities
            </button>
            <button className="block w-full text-left hover:text-green-400">
              Download App
            </button>
            <button className="block w-full text-left hover:text-green-400">
              🌙
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
