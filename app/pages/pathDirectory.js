"use client"; // Ensure this is at the top
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'; // Import this to handle query params
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import PlaceIcon from '@mui/icons-material/Place';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import SEO from "./../seo/page"
const Directory = ({ currentLocation, specificLocation }) => {
    // Define the href based on currentLocation
     let locationLink = '';
    if(currentLocation ==='GUIDE'){
        locationLink = '/guide'
    } else if(currentLocation ==='LOCATION'){
        locationLink = '/location'
    } 

    return (
        <>
         <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, luxury living, property, condominiums, luxury homes, investment, location, property location, condominium slot, property location"
  canonical="http://localhost:3000"
/>
       <div className="  mt-1 h-20 ml-5 w-12/12 -mb-12">
    <div className=" flex items-left justify-left sm:justify-left">
        <Breadcrumbs aria-label="breadcrumb" className="text-sm sm:text-xl md:text-2xl lg:text-4xl xl:text-2xl lg:ml-5">
            <Link
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center' }}
                color="inherit"
                href="/"
            >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                HOME
            </Link>
            <Link
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center' }}
                color="inherit"
                href={`/pages/${locationLink}`}
            >
                <PlaceIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                {currentLocation}
            </Link>

            {specificLocation && (
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href={`/pages/${locationLink}`}
                >
                    <LocationCityIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    {specificLocation}
                </Link>
            )}
        </Breadcrumbs>
    </div>
</div>

        </>
    );
};

export default Directory;
