'use client' // app/blog/[slug]/page.js
import Image from 'next/image'
import Directory from '../../pathDirectory'
import SEO from '../../../seo/page'
import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

import Header from '../../header'
import Footer from './../../footer'

export default function BlogPost({ params }) {
  const { slug } = params // Extract slug from params
  const headings = [
    'ALL ACROSS THE PHILIPPINES',
    'MASTERPLANNED DEVELOPMENTS',
    'DYNAMIC COMMUNITIES'
  ]

  const posts = {
    aboutalveo: {
      title: 'ABOUT ALVEO',
      path: '/assets/alveoland.jpg',
      path1: '/assets/alveoland2.jpg',
      content: 'ALVEOLAND',
      layout: <div>Your custom layout for ABOUT ALVEO</div>,
      currentLocation: 'ABOUT ALVEO',
      specificLocation: ''
    },
    commtalk: {
      title: 'CommTalk Service',
      content: 'Details about the CommTalk service.',
      layout: <div>Your custom layout for CommTalk</div>,
      currentLocation: 'ABOUT ALVEO',
      specificLocation: 'CommTalk'
    },
    contactus: {
      title: 'Contact Us',
      content: 'Reach out to us through our contact form.',
      layout: <div>Your custom layout for Contact Us</div>,
      currentLocation: 'ABOUT ALVEO',
      specificLocation: 'Contact Us'
    },
    jointeamalveo: {
      title: 'Join Team Alveo',
      content: 'Information on how to join Team Alveo.',
      layout: <div>Your custom layout for Join Team Alveo</div>,
      currentLocation: 'ABOUT ALVEO',
      specificLocation: 'JoinTeamAlveo'
    }
  }

  const post = posts[slug] || {
    title: 'Post Not Found',
    content: 'This post does not exist.'
  }

  useEffect(() => {
    // Add any side-effects here if necessary
  }, [slug])
  
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % headings.length)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [headings.length])

  return (
    <>
      <div className='w-full h-screen'>
        <SEO
          title='REAL ESTATE'
          description='Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter..'
          keywords='alveo, real estate, property, lands, investment, loan, buildings,'
          canonical='https://realstate-frontend-alveo.vercel.app'
        />
        <Header />
        <Directory
          currentLocation={post.currentLocation}
          specificLocation={post.specificLocation}
        />
        {slug === 'aboutalveo' && post.path && (
          <div className='directory-wrapper lg:h-2/3 xl:h-2/4'>
            <div className='relative'>
              <img
                src={post.path}
                alt={post.title}
                width={800}
                height={300}
                className='img object-cover w-full h-1/2 xl:h-96'
              />
              <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-[#00008b] pointer-events-none' />
            </div>
            <div className='absolute top-1/3 mt-3 left-5 w-4/5 z-10 text-white text-sm mx-1 sm:mx-10 sm:ml-20 md:top-96 lg:mt-64 lg:top-96 lg:ml-10'>
              <div className='flex space-x-4 h-36 lg:mt-48 lg:top-64 lg:ml-10 xl:-mt-16 xl:ml-40'>
                {headings.map((heading, idx) => (
                  <h1
                    key={idx}
                    className={`${
                      index === idx
                        ? 'opacity-100 transform translate-x-0 transition-all duration-1500'
                        : 'opacity-0 transform translate-x-5'
                    } w-full text-sm sm:text-2xl md:text-3xl lg:text-4xl`}
                  >
                    {heading}
                  </h1>
                ))}
              </div>
            </div>

            <div className='relative mt-5 h-24 p-2 text-black lg:mt-20 xl:mt-12'>
              <table className='w-full sm:w-10/12 sm:mx-14 xl:mx-28'>
                <tbody>
                  <tr>
                    <td className='font-bold text-xl bg-[#002B47] text-white py-2 px-4 md:text-4xl lg:text-3xl'>
                      LIVE WELL WITH ALVEO
                    </td>
                    <td className='text-base text-black py-2 px-4 border border-black text-justify indent-5 md:text-2xl lg:text-md'>
                      Carrying the legacy of Ayala Land, the largest and most
                      experienced real estate developer in the Philippines,
                      Alveo offers a remarkable portfolio of prime real estate
                      developments within thriving and emerging growth centers
                      around the country.
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='mt-10 ml-0 w-11/12 justify-center text-center sm:mx-10'>
                {/* First Column */}
                <h1 className='font-semibold text-xl text-[#002B47] md:text-4xl'>
                  OUR FOUNDATION
                </h1>
                <p className='text-sm md:text-2xl'>
                  With more than 35 years of experience ...
                </p>
                {/* Second Column */}
                <h1 className='font-semibold mt-20 text-xl text-[#002B47] md:text-4xl'>
                  CONTEMPORARY ENVIRONMENTS FOR HOME, WORK, AND LEISURE
                </h1>
                <p className='text-sm md:text-2xl'>
                  Alveo Lands extensive range of holistic developments...
                </p>
              </div>
            </div>

            <div className='h-fit relative mt-96 justify-center p-3'>
              <div className='container'>
                <h1 className='text-3xl text-center'>AWARDS AND RECOGNITION</h1>
                <div className='flex space-x-8 mt-8 justify-center'>
                  {/* First Award */}
                  <div className='flex flex-col items-center w-1/3'>
                    <img
                      src='/assets/certifications-and-awards-1551190300720.png'
                      alt='Certifications and Awards'
                      className='w-2/3 h-1/3'
                    />
                    <div className='mt-4 text-center'>
                      <h1 className='text-xl font-bold'>
                        Quadruple A contractor
                      </h1>
                      <small className='text-sm text-justify'>
                        The notice on DMCI Homes upgraded category was released
                        on January 18, 2017 by Philippine Contractors
                        Accreditation Board (PCAB). The AAAA license given to
                        DMCI Homes is currently the highest given to firms that
                        satisfy the institution's requirements.
                      </small>
                    </div>
                  </div>

                  {/* Second Award */}
                  <div className='flex flex-col items-center w-1/3'>
                    <img
                      src='/assets/certifications-and-awards-1551158091582.png'
                      alt='Philippine Quill Awards'
                      className='w-2/3 h-1/3'
                    />
                    <div className='mt-4 text-center'>
                      <h1 className='text-xl font-bold'>
                        Philippine Quill Awards 2012
                      </h1>
                      <small className='text-sm text-justify'>
                        DMCI Homes Ikaw Na, Maybe Customer Service Campaign won
                        an Excellence Award in the 11th Philippine Quill Awards
                        for Communication Management Division Employee/Member
                        Communication Category. The Philippine Quill is the
                        country’s most prestigious and relevant award for
                        business communicators.
                      </small>
                    </div>
                  </div>

                  {/* Third Award */}
                  <div className='flex flex-col items-center w-1/3'>
                    <img
                      src='/assets/certifications-and-awards-1551158690171.png'
                      alt='ULI Healthy Places Awards'
                      className='w-2/3 h-1/3'
                    />
                    <div className='mt-4 text-center'>
                      <h1 className='text-xl font-bold'>
                        ULI Healthy Places Awards
                      </h1>
                      <small className='text-sm text-justify'>
                        Aiming to recognize outstanding and innovative
                        development with advanced design strategies that focus
                        on the development of the environment and promote
                        healthy living in the country, the recently-concluded
                        1st ULI Philippines Healthy Places Awards conferred DMCI
                        Homes Arista Place as the winner in the residential
                        category.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
