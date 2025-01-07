'use client'
import Image from 'next/image'
import Directory from '../../pathDirectory'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Hook for navigation
import Header from '../../header'
import Footer from './../../footer'
import SEO from './../../../seo/page'
import Link from 'next/link'

export default function BlogPost ({ params }) {
  const router = useRouter() // Correct usage inside a component
  const { slug } = params // Extract slug from params
  const [posts, setPosts] = useState({})
  const [propertyData, setPropertyData] = useState([])

  // Fetch locations dynamically and set posts object
useEffect(() => {
  console.log(params.slug);
  // Fetch data from the backend API using template literal for params
  fetch(`https://infinitech-testing1.online/api/areas/${params.slug}`) // Correctly interpolated the URL with params
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
.then(response => {
  console.log('Fetched data:', response.data); // Log the fetched data

  const fetchedPosts = {};
  // Process the data into a key-value object
  const location = response.data; // The fetched location object from the API
  const key = location.area_name; // Use the area_name as the key

  fetchedPosts[key] = {
    location: location.area_name,
    key: key,
    path: location.image, // Image path from the API
    title: location.title,
    intro: location.description
  };

  setPosts(fetchedPosts); // Set the transformed data to state
});

}, [params]); // Add `params` as a dependency to refetch when params change



  const post = posts[slug] || {
    title: 'Post Not Found',
    intro: 'This post does not exist.',
    image: '/assets/default.jpg',
    location: 'Unknown'
  }

  const PropertyCard = ({ property, onClick }) => {
    return (

      <div className='flex w-80 flex-col bg-gray-100 rounded-lg shadow-lg  mx-auto lg:w-2/3 xl:w-3/12 overflow-hidden text-center transform transition-transform duration-300 ease-in-out  m-2 hover:translate-y-3 hover:shadow-xl'>
        <SEO
          title='REAL ESTATE'
          description='Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter..'
          keywords='alveo, real estate, location, property, building location, property location'
          canonical='http://localhost:3000/pages/locations'
        />
    
         <Image
      src={
        property.path
          ? (property.path.startsWith('http') || property.path.startsWith('https'))
            ? property.path // If it's a URL, use it directly
            : `https://infinitech-testing1.online/${property.path.replace(/\\/g, '/')}` // If it's a local asset, prepend the local server URL
          : '' // Fallback if property.path is null or undefined
      }
      alt={property.name}
      width={400} // Adjusted width
      height={300} // Adjusted height
        className='w-full h-60 object-cover' // Set a fixed height for the image
    />
        <div className='p-6'>
          <h2 className='text-2xl font-bold mb-4 text-gray-800 lg:text-4xl xl:text-3xl'>
            {property.name}
          </h2>
          <p className='text-lg text-orange-600 mb-2 lg:text-2xl xl:text-xl'>
            <strong>Price Range:</strong> {property.price_range}
          </p>
          <p className='text-md text-gray-600 mb-2 lg:text-2xl xl:text-xl'>
            <strong>Status:</strong> {property.status}
          </p>
          <p className='text-md text-gray-600 lg:text-2xl xl:text-xl'>
            <strong>Location:</strong> {property.specific_location}
          </p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch(`https://infinitech-testing1.online/api/blog/${slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch blog post data')
        }
        const fetchedData = await response.json()
        setPropertyData(fetchedData)
      } catch (err) {}
    }
    fetchApi() // Call the fetch function
  }, [slug])

  return (
    <>
  <div className='flex flex-col min-h-screen'>
  <Header />
  <div className='flex-grow'>
   
   <div className="w-full h-full">
  {Object.values(posts).map(post => (
    
    <div key={post.key} className="relative mt-1 w-full">
       <Directory
      currentLocation='LOCATION'
      specificLocation={`${post.location.toUpperCase()}`} // Pass location here
    />
    <img
  src={`http://localhost:3000${post.path}`} // Try to load from localhost:3000
  onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop if image fails
    e.target.src = `https://infinitech-testing1.online${post.path}`; // Fallback to localhost:8000 if not found
  }}
  alt={post.location}
  width={2000}
  height={500}
  className="w-full h-40 object-cover sm:h-60 md:h-80 lg:h-96 xl:h-72"
  priority
/>

      <div className="left-0 right-0 h-28 lg:h-40 bg-blue-900 flex flex-col justify-center p-2 text-white w-screen">
        <div className="-mt-10 left-0 right-0 h-1/5 bg-blue-900 flex flex-col justify-center p-2 text-white">
          <p className="mt-6 text-sm font-bold sm:text-lg md:text-2xl lg:text-4xl xl:text-2xl">
            Premium Lots for Sale in {post.location}
          </p>
          <p className="-mt-4 text-sm font-bold sm:text-lg md:text-2xl lg:text-4xl xl:text-3xl">
            {post.title}
          </p>
        </div>
      </div>
      <div className="sm:-mt-3 md:-mt-5 -mt-10 border-black border-2 lg:h-48 xl:h-28 xl:-mt-10 2xl:h-16 bg-white text-justify text-black flex justify-center left-10 h-28 w-3/3 mx-2 text-lg p-2">
        <p className="text-sm indent-10 sm:text-lg sm:p-2 md:text-xl lg:text-3xl lg:p-5 xl:text-xl 2xl:p-1">
          {post.intro}
        </p>
      </div>
    </div>
  ))}
</div>


    <div className='relative text-center sm:px-10 md:mx-5 justify-center'>
      <h1 className='text-2xl font-bold justify-center mt-10 -mb-5 sm:text-4xl lg:text-5xl xl:text-3xl'>
        FEATURED PROPERTIES
      </h1>
      <div className='justify-start items-start gap-1 mt-5 w-full mb-20'>
        {propertyData.map(property => (
          <Link
            key={property.id}
            href={`/pages/buildings/${property.id}`}
            passHref
            className='no-underline'
          >
            <PropertyCard property={property} />
          </Link>
        ))}
      </div>
    </div>
  </div>
  <Footer />
</div>

    </>
  )
}
