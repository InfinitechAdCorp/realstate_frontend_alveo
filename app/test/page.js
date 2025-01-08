// // components/Header.js

// 'use client'
// import Image from 'next/image'
// import { useEffect, useState } from 'react'
// import { Terminal } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import DevelopmentTypeModal from '@/components/admin/developmentTypeModal'
// import ArchitecturalThemeModal from '@/components/admin/architecturalThemeModal'
// import StatusModal from '@/components/admin/statusModal'
// import { Input } from '@/components/ui/input'
// import Demo from './../properties/page'
// import Header from '../pages/header'
// import Link from 'next/link'
// import AreaModal from '@/components/admin/areaModal'

// export default function Admin ({}) {
//   const [isVisible, setIsVisible] = useState(true) // Controls visibility of popup
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     code: ''
//   })
//   const [error, setError] = useState('')
//   const [isOtpSent, setIsOtpSent] = useState(false) // To track OTP sent state

//   const [properties, setProperties] = useState([]) // State to store fetched data from API

//   const [counts, setCounts] = useState({
//     properties: 0,
//     otherBuildings: 0,
//     condominiums: 0,
//     locations: 0
//   })
//   const [isSidebarVisible, setSidebarVisible] = useState(false) // State for controlling sidebar visibility
//   const [isDevelopmentTypeModalOpen, setDevelopmentTypeModalOpen] =
//     useState(false)
//   const [isArchitecturalThemeModalOpen, setArchitecturalThemeModalOpen] =
//     useState(false)
//   const [isStatusModalOpen, setStatusModalOpen] = useState(false)
//   const [isAreaModalOpen, setAreaModalOpen] = useState(false)

//   // Functions to open the respective modals
//   const openDevelopmentTypeModal = () => setDevelopmentTypeModalOpen(true)
//   const openArchitecturalThemeModal = () => setArchitecturalThemeModalOpen(true)
//   const openStatusModal = () => setStatusModalOpen(true)
//   const openAreaModal = () => setAreaModalOpen(true)

//   const handleInputChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }
//   const handleLogin = async e => {
//     e.preventDefault()

//     // Step 1: User submits email and password to login
//     const response = await fetch('https://infinitech-testing1.online/api/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         email: formData.email,
//         password: formData.password
//       })
//     })

//     if (response.ok) {
//       // If login is successful, show OTP input
//       setError('') // Reset any previous error
//       console.log('Login successful. OTP sent to email.')
//       setIsOtpSent(true) // Allow the user to enter OTP
//     } else {
//       setError('Invalid email or password.')
//     }
//   }

//   const handleOtpVerification = async e => {
//     e.preventDefault()

//     // Step 2: User submits OTP for verification
//     const otpResponse = await fetch('https://infinitech-testing1.online/api/verify-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         email: formData.email, // Include email to identify user for OTP check
//         otp: formData.otp // OTP entered by user
//       })
//     })

//     if (otpResponse.ok) {
//       // If OTP verification is successful
//       console.log('OTP verified. You are now logged in.')
//       // Redirect user to dashboard or home page
//     } else {
//       setError('Invalid or expired OTP.')
//     }

//   }

//   const fetchCount = async (endpoint, key) => {
//     try {
//       const response = await fetch(`https://infinitech-testing1.online/api/admin/${endpoint}`);
//       const data = await response.json();

//       if (response.ok) {
//         setCounts(prevCounts => ({ ...prevCounts, [key]: data.count }))
//       } else {
//         console.error(`Error fetching ${key} count:`, data)
//       }
//     } catch (error) {
//       console.error(`Fetch error for ${key}:`, error)
//     }
//   }

//   // Fetch count data after login success
//   useEffect(() => {

//     if (isLoggedIn) {
//       fetchCount("countproperties", "properties");
//       fetchCount("countotherbuildings", "otherBuildings");
//       fetchCount("countcondominiums", "condominiums");
//       fetchCount("countlocations", "locations");

//     }
//   }, [isLoggedIn]); // Runs only when isLoggedIn is true
//   const openSidebar = () => {
//     setSidebarVisible(true)
//   }

//   // Function to close the sidebar
//   const closeSidebar = () => {
//     setSidebarVisible(false)
//   }

//   // Functions to close the respective modals
//   const closeModal = () => {
//     setDevelopmentTypeModalOpen(false)
//     setArchitecturalThemeModalOpen(false)
//     setStatusModalOpen(false)
//     setAreaModalOpen(false)
//   }

//   return (
//     <>

//       {/* {isVisible && (
//         <div className='popup-container fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50'>
//           <div className='popup-content bg-white p-8 rounded-lg shadow-xl w-full max-w-lg'>
//             <h2 className='text-2xl font-semibold text-center mb-4'>ACCOUNT</h2>
//             <form>
//               <div>
//                 <label htmlFor='email' className='block text-lg font-medium'>
//                   Email:
//                 </label>
//                 <input
//                   type='email'
//                   id='email'
//                   name='email'
//                   className='h-10 text-xl w-full mt-2 px-4 border border-gray-300 rounded-md'
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <br />
//               <div>
//                 <label htmlFor='password' className='block text-lg font-medium'>
//                   Password:
//                 </label>
//                 <input
//                   className='h-10 text-xl w-full mt-2 px-4 border border-gray-300 rounded-md'
//                   type='password'
//                   id='password'
//                   name='password'
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               {error && <p className='text-red-500 mt-2'>{error}</p>}

//               <div className='w-full flex gap-6 mt-4 justify-center'>
//                 <button
//                   className='w-32 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300'
//                   type='submit'
//                   onClick={handleLogin}
//                 >
//                   LOGIN
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )} */}

//       <div className='fixed w-full'>
//         <header className='fixed top-0 left-0 w-full bg-white shadow-lg z-50'>
//           <div className='flex justify-between items-center p-4'>
//             <div class='menu-container'>
//               <img
//                 src='/assets/menu.png'
//                 alt='Menu'
//                 class='cursor-pointer transform rotate-180 hover:opacity-80 w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
//                 style={{ width: '25px', height: '25px' }}
//                 onClick={openSidebar}
//               />
//             </div>
//             <div className='logosec'>
//               <Link href='/'>
//                 <div className='logo cursor-pointer text-darkblue font-semibold text-lg'>
//                   ALVEO LAND
//                 </div>
//               </Link>
//             </div>

//             <div className='message flex items-center space-x-4'>
//               <div className='circle w-4 h-4 rounded-full bg-red-500'></div>
//               <img
//                 src='https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png'
//                 className='icn'
//                 alt='message-icon'
//                 width={20}
//                 height={20}
//               />
//               <div className='dp'>
//                 <img
//                   src='https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png'
//                   className='dpicn rounded-full'
//                   alt='profile'
//                   width={40}
//                   height={40}
//                 />
//               </div>
//             </div>
//           </div>
//         </header>
//         {isSidebarVisible && (
//           <div
//             className='fixed top-0 left-0 h-full w-64 bg-blue-950 text-white transition-transform transform z-50 sm:w-72 overflow-y-auto lg:w-2/5 xl:w-2/12 2xl:w-2/12'
//             tabIndex='-1'
//             onClick={closeSidebar}
//             onKeyDown={e => e.key === 'Escape' && closeSidebar()}
//           >
//             <div className='flex justify-between items-center p-4 border-b border-gray-700 '>
//               <Link
//                 href='/pages/aboutalveo/aboutalveo'
//                 className='text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg'
//               >
//                 ALVEO
//               </Link>
//               <span
//                 className='text-xl font-bold cursor-pointer'
//                 onClick={closeSidebar}
//               >
//                 &times;
//               </span>
//             </div>

//             <nav className='p-4 cursor-pointer'>
//               <ul className='space-y-2' onClick={openDevelopmentTypeModal}>
//                 <li>Development Type</li>
//               </ul>
//               <ul className='space-y-2' onClick={openArchitecturalThemeModal}>
//                 <li>Architectural Theme</li>
//               </ul>
//               <ul className='space-y-2' onClick={openStatusModal}>
//                 <li>Status</li>
//               </ul>
//               <ul className='space-y-2' onClick={openAreaModal}>
//                 <li>Location</li>
//               </ul>

//               <Link
//                 href='/appointment'
//                 className='text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg'
//               >
//                 APPOINTMENTS
//               </Link>
//             </nav>

//           </div>
//         )}
//         <div className='main-container mt-24 p-4 flex justify-center items-center'>
//           <div className='main max-w-screen-xl mx-auto'>
//             <div className='box-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center'>
//               {/* Box 1 */}
//               <div className='box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
//                 <div className='text text-center flex flex-col items-center'>
//                   <div className='flex items-center mb-2'>
//                     <h2 className='topic-heading text-3xl font-semibold'>
//                       {counts.properties}
//                     </h2>
//                     <img
//                       src='/assets/town.png'
//                       alt='Views'
//                       className='ml-4'
//                       width={50}
//                       height={50}
//                     />
//                   </div>
//                   <h2 className='topic text-lg font-medium'>Properties</h2>
//                 </div>
//               </div>

//               {/* Box 2 */}
//               <div className='box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
//                 <div className='text text-center flex flex-col items-center'>
//                   <div className='flex items-center mb-2'>
//                     <h2 className='topic-heading text-3xl font-semibold'>
//                       {counts.otherBuildings}
//                     </h2>
//                     <img
//                       src='/assets/neighborhood.png'
//                       alt='Other Buildings'
//                       className='ml-4'
//                       width={50}
//                       height={50}
//                     />
//                   </div>
//                   <h2 className='topic text-lg font-medium'>Other Buildings</h2>
//                 </div>
//               </div>

//               {/* Box 3 */}
//               <div className='box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
//                 <div className='text text-center flex flex-col items-center'>
//                   <div className='flex items-center mb-2'>
//                     <h2 className='topic-heading text-3xl font-semibold'>
//                       {counts.condominiums}
//                     </h2>
//                     <img
//                       src='/assets/skyline.png'
//                       alt='Condominiums'
//                       className='ml-4'
//                       width={50}
//                       height={50}
//                     />
//                   </div>
//                   <h2 className='topic text-lg font-medium'>Condominiums</h2>
//                 </div>
//               </div>

//               {/* Box 4 */}
//               <div className='box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
//                 <div className='text text-center flex flex-col items-center'>
//                   <div className='flex items-center mb-2'>
//                     <h2 className='topic-heading text-3xl font-semibold'>
//                       {counts.locations}
//                     </h2>
//                     <img
//                       src='/assets/location.png'
//                       alt='Locations'
//                       className='ml-4'
//                       width={50}
//                       height={50}
//                     />
//                   </div>
//                   <h2 className='topic text-lg font-medium'>Locations</h2>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Demo Section */}
//         <div className='demo-container min-h-screen mt-14 w-9/12 mx-auto overflow-y-auto scrollbar-hidden flex justify-center'>
//           <div>
//             <Demo />
//           </div>
//         </div>

//         <div>
//           <DevelopmentTypeModal
//             isOpen={isDevelopmentTypeModalOpen}
//             closeModal={closeModal}
//           />
//           <ArchitecturalThemeModal
//             isOpen={isArchitecturalThemeModalOpen}
//             closeModal={closeModal}
//           />
//           <StatusModal isOpen={isStatusModalOpen} closeModal={closeModal} />
//           <AreaModal isOpen={isAreaModalOpen} closeModal={closeModal} />
//         </div>
//       </div>
//     </>
//   )
// }

// components/Header.js

'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Terminal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/alert/page';
import DevelopmentTypeModal from '@/components/admin/developmentTypeModal'
import ArchitecturalThemeModal from '@/components/admin/architecturalThemeModal'
import StatusModal from '@/components/admin/statusModal'

import { Input } from '@/components/ui/input'

import Demo from './../properties/page'
import Header from '../pages/header'
import Link from 'next/link'
import AreaModal from '@/components/admin/areaModal'
import Appointment from '@/components/admin/appointments'
import Slider from "react-slick";

export default function Admin ({}) {
   const [showProperties, setShowProperties] = useState(false);
  const [isVisible, setIsVisible] = useState(true) // Controls visibility of popup
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: ''
  })
  const [error, setError] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false) // To track OTP sent state
  const [isLoggedIn, setisLoggedin] = useState(false) // To track OTP sent state
  const [submittedProperties, setSubmittedProperties] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);

  const [properties, setProperties] = useState([]) // State to store fetched data from API

  const [counts, setCounts] = useState({
    properties: 0,
    otherBuildings: 0,
    condominiums: 0,
    locations: 0
  })
    const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [isSidebarVisible, setSidebarVisible] = useState(false) // State for controlling sidebar visibility
  const [isDevelopmentTypeModalOpen, setDevelopmentTypeModalOpen] =
    useState(false)
  const [isArchitecturalThemeModalOpen, setArchitecturalThemeModalOpen] =
    useState(false)
  const [isStatusModalOpen, setStatusModalOpen] = useState(false)
  const [isAreaModalOpen, setAreaModalOpen] = useState(false)

  // Functions to open the respective modals
  const openDevelopmentTypeModal = () => setDevelopmentTypeModalOpen(true)
  const openArchitecturalThemeModal = () => setArchitecturalThemeModalOpen(true)
  const openStatusModal = () => setStatusModalOpen(true)
  const openAreaModal = () => setAreaModalOpen(true)
    const [activeNav, setActiveNav] = useState("Properties"); // Default active nav
const [data, setData] = useState({
  newType: '',
  newTheme: '',
  newStatus: '',
  newLocation: '',
  developmentTypes: [], // Ensure this is initialized as an array
  architecturalThemes: [],
  statusOptions: [],
  chatbotEntries: [], // Ensure chatbotEntries is an array
  newQuestion: "",
  newAnswer: "",
      newAreaName: '',
    newTitle: '',
    newDescription: '',
    newImage: null,
    locations: [],
});

 const [chatbotData, setChatbotData] = useState([]);
const [chatbotFormData, setChatbotFormData] = useState({ question: "", answer: "" });

  const [editing, setEditing] = useState(null);
  const navItems = [
    
    { name: "Properties", onClick: () => console.log("Properties Clicked") },
    { name: "Details", onClick: () =>console.log("Detailes Clicked") },
    { name: "Chatbot", onClick: () =>console.log("Detailes Clicked") },
    { name: "Client Property", onClick: () =>console.log("Detailes Clicked") },
    { name: "Appointments", onClick: () =>console.log("Detailes Clicked") },
  ];

const [isEditing, setIsEditing] = useState(false);

  const [success, setSuccess] = useState('');
const handleAddLoc = async (type, areaName, title, description, image, setData, listType, areaId = null) => {
  setError('');  // Clear previous errors
  setSuccess('');  // Clear previous success messages

  // Validate input fields
  if (!areaName || !title || !description) {
    setError('All fields are required');
    return;
  }

  // Create a new object to send the data, including the Base64 string for the image
  const requestData = {
    area_name: areaName,
    title: title,
    description: description,
    image: image || null,  // Send the Base64 string or null if no image is selected
  };

  // Add area ID if it's an update request
  if (type === 'update' && areaId) {
    requestData.id = areaId;
  }

  // Log the requestData for debugging
  console.log('Request Data:', requestData);

  try {
    // Send the request to the backend
    const response = await fetch('https://infinitech-testing1.online/api/admin/add-area', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Ensure content type is set to JSON
      },
      body: JSON.stringify(requestData),  // Send the data as JSON string
    });

    const data = await response.json();  // Parse the JSON response

    if (response.ok) {
  
      handleShowSuccessToast('Location added successfully!');

      // Fetch the updated list of locations after adding the new location
      fetchLocations(setData);

      // Optionally, clear the form fields or reset the state
      setData(prevData => ({
        ...prevData,
        newAreaName: '',
        newTitle: '',
        newDescription: '',
        newImage: null, // Reset the image
      }));

    } else {
      console.error('Error:', data.message);
      setError(data.message || 'Something went wrong');
    }
  } catch (err) {
    console.error('An error occurred:', err);
    setError('An error occurred during submission');
  }
};
  const handleShowSuccessToast = (message) => {
    showToast(message, 'success');
  };

  const handleShowErrorToast = (message) => {
    showToast(message, 'error'); // Error toast
  };

  const handleShowWarningToast = (message) => {
    showToast(message, 'warning'); // Warning toast
  };
// Fetch locations and update state
const fetchLocations = async (setData) => {
  try {
    const response = await fetch("https://infinitech-testing1.online/api/admin/area");
    const data = await response.json();
    console.log("Fetched Locations:", data);
    setData(prevData => ({ ...prevData, locations: data }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handleImageChange = (e) => {
  const file = e.target.files[0];  // Get the selected file
  if (file) {
    // Convert the image file to Base64 string using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      // Once conversion is complete, update the state with the Base64 string
      setData({ ...data, newImage: reader.result });
      console.log('Selected image (Base64):', reader.result);  // Log the Base64 string for debugging
    };
    reader.readAsDataURL(file);  // Read the file as Base64 string
  }
};
  useEffect(() => {
    // Function to fetch data from the backend
    const fetchData = async () => {
      try {
        // Set loading to true when the fetch starts

        // Fetch the data for each category
        const propertiesRes = await fetch('https://infinitech-testing1.online/api/admin/countproperties');
        const propertiesData = await propertiesRes.json();

        const otherBuildingsRes = await fetch('https://infinitech-testing1.online/api/admin/countotherbuildings');
        const otherBuildingsData = await otherBuildingsRes.json();

        const condominiumsRes = await fetch('https://infinitech-testing1.online/api/admin/countcondominiums');
        const condominiumsData = await condominiumsRes.json();

        const locationsRes = await fetch('https://infinitech-testing1.online/api/admin/countlocations');
        const locationsData = await locationsRes.json();

        // Update the state with the fetched counts
        setCounts({
          properties: propertiesData.count || 0,  // Use 0 if count is not available
          otherBuildings: otherBuildingsData.count || 0,
          condominiums: condominiumsData.count || 0,
          locations: locationsData.count || 0
        });
       console.log('Updated counts:', {
          properties: propertiesData.count || 0,
          otherBuildings: otherBuildingsData.count || 0,
          condominiums: condominiumsData.count || 0,
          locations: locationsData.count || 0
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };

    // Fetch the data when the component mounts (page loads)
    fetchData();
  }, []);

  useEffect(() => {
    console.log(activeNav);
    if (activeNav === "Details") {
      fetchData(); // Fetch other data for "Details"
    } else if (activeNav === "Chatbot") {
      const fetchChatbotData = async () => {
    
        try {
          const response = await fetch('https://infinitech-testing1.online/api/admin/getChatbot');
          const chatbotData = await response.json();
          console.log(chatbotData)
          // Update chatbotEntries state
          setData((prevData) => ({
            ...prevData,
            chatbotEntries: chatbotData,
          }));
        } catch (error) {
          console.error("Error fetching chatbot data:", error);
        }
      };

      fetchChatbotData();
    } else if (activeNav === "Client Property") {
      fetch('https://infinitech-testing1.online/api/admin/submitted-properties')
        .then(response => response.json())
        .then(data => {
          setSubmittedProperties(data);  // Store the data in the state
        })
        .catch(error => {
          console.error('Error fetching submitted properties:', error);
        });
    }
  }, [activeNav]);
 
const fetchData = () => {
  fetch("https://infinitech-testing1.online/api/admin/development-types")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Development Types:", data);
      setData((prevData) => ({ ...prevData, developmentTypes: data }));
    })
    .catch((error) => console.error("Error fetching data:", error));

  fetch("https://infinitech-testing1.online/api/admin/architectural-themes")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Architectural Themes:", data);
      setData((prevData) => ({ ...prevData, architecturalThemes: data }));
    })
    .catch((error) => console.error("Error fetching data:", error));

  fetch("https://infinitech-testing1.online/api/admin/status")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Status:", data);
      setData((prevData) => ({ ...prevData, statusOptions: data }));
    })
    .catch((error) => console.error("Error fetching data:", error));

  fetch("https://infinitech-testing1.online/api/admin/area") 
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Locations:", data);
      setData((prevData) => ({ ...prevData, locations: data }));
    })
    .catch((error) => console.error("Error fetching data:", error));
};
const handleAdd = (type, newItem, setData, field) => {
  console.log("Adding item:", newItem); // Log the new item being added
console.log(type)
  // Check if we are adding a chatbot entry
  if (type === "chatbot") {
    const { question, answer } = newItem;

    // If we are editing an existing entry, use PUT instead of POST
    const method = isEditing ? "PUT" : "POST";
    console.log(method)
    const url = isEditing ? `https://infinitech-testing1.online/api/admin/chatbot/${newItem.id}` : "https://infinitech-testing1.online/api/admin/addChatbot";
    console.log(url)
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Ensure the response contains success status and new item with id
        if (data.success) {
          handleShowSuccessToast(`${isEditing ? "Updated" : "Added"} chatbot entry successfully!`);

          // If adding a new entry, add the entry with id to the chatbotEntries array
          if (isEditing) {
            setData((prevData) => ({
              ...prevData,
              chatbotEntries: prevData.chatbotEntries.map((item) =>
                item.id === newItem.id ? { ...item, question, answer } : item
              ),
            }));
          } else {
            const addedItem = { ...newItem, id: data.data.id }; // Ensure newItem includes id
            setData((prevData) => ({
              ...prevData,
              chatbotEntries: [...prevData.chatbotEntries, addedItem],
            }));
          }

          // Clear the input fields
          setChatbotFormData({ question: "", answer: "" });
        } else {
          console.error("Error response from API:", data.message);
        }

        fetchData(); // Optionally fetch the updated data
      })
      .catch((error) => {
        // Log the error if request fails
        console.error("Error adding/updating data:", error);
      });

  }  else {
    // Existing logic for other types (e.g., developmentTypes, locations)
    fetch(`https://infinitech-testing1.online/api/admin/add-${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log success and update state
        if (data.success) {
          handleShowSuccessToast(`Item added successfully: ${newItem}`);

          // Update the data state by adding the new item to the appropriate field
          setData((prevData) => ({
            ...prevData,
            [field]: Array.isArray(prevData[field])
              ? [...prevData[field], { name: newItem }]  // Add new item to array
              : [{ name: newItem }],  // Initialize as an array if it was not an array
          }));

          // Clear the input after adding the new item
          if (field === "developmentTypes") {
            setData({ ...data, newType: "" });
          } else if (field === "architecturalThemes") {
            setData({ ...data, newTheme: "" });
          } else if (field === "statusOptions") {
            setData({ ...data, newStatus: "" });
          } else if (field === "locations") {
            setData({
              ...data,
              newAreaName: "",
              newTitle: "",
              newDescription: "",
              newImage: null,
            });
          }
        } else {
          handleShowSuccessToast("Added Successfully");
        }

        // Optionally, you can fetch the updated data
        fetchData();
      })
      .catch((error) => handleShowErrorToast("Error adding data:", error));
  }
};
  const openModal2 = (filesArray) => {
    setModalImages(filesArray.map((file) => file.replace(/\\/g, '/'))); // Replace backslashes with forward slashes
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal2 = () => {
    setModalIsOpen(false);
    setModalImages([]);
  };
const handleDelete = (type, id, field) => {
  console.log(type, id, field); // Debugging log to check the values

  // Handle deletion of chatbot entries separately
  if (type === "chatbot") {
    const url = `https://infinitech-testing1.online/api/admin/deleteChatbot/${id}`; // API endpoint for chatbot deletion
    console.log("Deleting from URL:", url);

    // Send DELETE request
    fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        // Check if the response is successful
        if (response.ok) {
          handleShowSuccessToast(`Deleted Successfully!`);
        }else {
          handleShowErrorToast(`Deletion Failed!`)
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        console.log("Delete Response:", data);

        // Update state to remove the deleted chatbot entry
        setData((prevData) => {
          const updatedData = { ...prevData };

          // Ensure the field exists and is an array
          if (Array.isArray(prevData[field])) {
            updatedData[field] = prevData[field].filter((item) => item.id !== id);
          }

          return updatedData; // Return updated state
        });
        handleShowSuccessToast("Chatbot entry deleted successfully."); // Optional: Notify user
      })
      .catch((error) => {
       
        console.error("Error deleting chatbot entry:", error);
        handleShowErrorToast("An error occurred while deleting the chatbot entry.");
      });
  } else {
    // Existing logic for deleting other types (e.g., developmentTypes, locations)
    const url = `https://infinitech-testing1.online/api/admin/delete-${type}/${id}`;
    console.log("Deleting from URL:", url);  // Debugging line to check the URL

    fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          handleShowSuccessToast(`Deleted Successfully: ${id}`);
        }else {
          handleShowErrorToast(`Deletion Failed: ${id}`)
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);

        // Update state by filtering out the deleted item from array fields
        setData((prevData) => {
          const updatedData = { ...prevData };

          if (Array.isArray(prevData[field])) {
            updatedData[field] = prevData[field].filter((item) => item.id !== id);
          } else {
            updatedData[field] = prevData[field] === id ? "" : prevData[field];
          }

          // Reset the form values after deletion (for each field type)
          if (field === "developmentTypes") {
            updatedData.newType = "";
          } else if (field === "architecturalThemes") {
            updatedData.newTheme = "";
          } else if (field === "statusOptions") {
            updatedData.newStatus = "";
          } else if (field === "locations") {
            updatedData.newAreaName = "";
            updatedData.newTitle = "";
            updatedData.newDescription = "";
            updatedData.newImage = null;
          }

          return updatedData;
        });
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        handleShowErrorToast("An error occurred while deleting the item.");
      });
  }
};

const handleInputChange_chatbot = (e) => {
  const { name, value } = e.target;
  setChatbotFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleLogin = async e => {
    e.preventDefault()

    // Step 1: User submits email and password to login
    const response = await fetch('https://infinitech-testing1.online/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    })

    if (response.ok) {
      // If login is successful, show OTP input
      setError('') // Reset any previous error
      console.log('Login successful. OTP sent to email.')
 
    } else {
      setError('Invalid email or password.')
    }
  }

  const handlePropertiesClick = () => {
    setShowProperties(!showProperties);
  };

  const fetchCount = async (endpoint, key) => {
    try {
      const response = await fetch(
        `https://infinitech-testing1.online/api/admin/${endpoint}`
      )
      const data = await response.json()

      if (response.ok) {
        setCounts(prevCounts => ({ ...prevCounts, [key]: data.count }))
      } else {
        console.error(`Error fetching ${key} count:`, data)
      }
    } catch (error) {
      console.error(`Fetch error for ${key}:`, error)
    }
  }

  // Fetch count data after login success
  useEffect(() => {
    if (isLoggedIn) {
      fetchCount('countproperties', 'properties')
      fetchCount('countotherbuildings', 'otherBuildings')
      fetchCount('countcondominiums', 'condominiums')
      fetchCount('countlocations', 'locations')
    }
  }, [isLoggedIn]) // Runs only when isLoggedIn is true
  const openSidebar = () => {
    setSidebarVisible(true)
  }

  // Function to close the sidebar
  const closeSidebar = () => {
    setSidebarVisible(false)
  }

  // Functions to close the respective modals
  const closeModal = () => {
    setDevelopmentTypeModalOpen(false)
    setArchitecturalThemeModalOpen(false)
    setStatusModalOpen(false)
    setAreaModalOpen(false)
  }

  return (
    <>
      {/* {isVisible && (
        <div className='popup-container fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50'>
          <div className='popup-content bg-white p-8 rounded-lg shadow-xl w-full max-w-lg'>
            <h2 className='text-2xl font-semibold text-center mb-4'>ACCOUNT</h2>
            <form>
              <div>
                <label htmlFor='email' className='block text-lg font-medium'>
                  Email:s
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  className='h-10 text-xl w-full mt-2 px-4 border border-gray-300 rounded-md'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <br />
              <div>
                <label htmlFor='password' className='block text-lg font-medium'>
                  Password:
                </label>
                <input
                  className='h-10 text-xl w-full mt-2 px-4 border border-gray-300 rounded-md'
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && <p className='text-red-500 mt-2'>{error}</p>}

              <div className='w-full flex gap-6 mt-4 justify-center'>
                <button
                  className='w-32 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300'
                  type='submit'
                  onClick={handleLogin}
                >
                  LOGIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      <div className="flex fixed w-full">
 <div className="text-xl text-black w-1/6 relative border-r shadow-md h-screen bg-gray-100">
  <div className="mt-24 border-indigo-950">
<nav className="p-6 space-y-2">
        <ul>
          {navItems.map((item) => (
            <li
              key={item.name}
              onClick={() => {
                setActiveNav(item.name);
                item.onClick();
              }}
              className={`group cursor-pointer transition-all duration-300 rounded-lg ${
                activeNav === item.name ? "bg-indigo-100" : "hover:bg-indigo-100"
              }`}
            >
              <div
                className={`p-3 transition-all duration-300 ${
                  activeNav === item.name
                    ? "text-indigo-600"
                    : "text-gray-700 group-hover:text-indigo-600"
                }`}
              >
                {item.name}
              </div>
            </li>
          ))}
        </ul>
 
      </nav>
  </div>
</div>


      <div className=' w-5/6'>
        <header className='fixed top-0 left-0 w-full bg-white shadow-lg z-50'>
          <div className='flex justify-between items-center p-4'>
            <div >
              <img
                src='/assets/menu.png'
                alt='Menu'
                className='cursor-pointer transform rotate-180 hover:opacity-80 w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
                style={{ width: '25px', height: '25px' }}
                onClick={openSidebar}
              />
            </div>
            <div className='logosec'>
              <Link href='/'>
                <div className='logo cursor-pointer text-darkblue font-semibold text-lg'>
                  ALVEO LAND
                </div>
              </Link>
            </div>

            <div className='message flex items-center space-x-4'>
              <div className='circle w-4 h-4 rounded-full bg-red-500'></div>
              <img
                src='https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png'
                className='icn'
                alt='message-icon'
                width={20}
                height={20}
              />
              <div className='dp'>
                <img
                  src='https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png'
                  className='dpicn rounded-full'
                  alt='profile'
                  width={40}
                  height={40}
                />
              </div>
            </div>
          </div>
        </header>
        {isSidebarVisible && (
          <div
            className='fixed top-0 left-0 h-full w-64 bg-blue-950 text-white transition-transform transform z-50 sm:w-72 overflow-y-auto lg:w-2/5 xl:w-2/12 2xl:w-2/12'
            tabIndex='-1'
            onClick={closeSidebar}
            onKeyDown={e => e.key === 'Escape' && closeSidebar()}
          >
            <div className='flex justify-between items-center p-4 border-b border-gray-700 '>
              <Link
                href='/pages/aboutalveo/aboutalveo'
                className='text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg'
              >
                ALVEO
              </Link>
              <span
                className='text-xl font-bold cursor-pointer'
                onClick={closeSidebar}
              >
                &times;
              </span>
            </div>

            <nav className='p-4'>
              <ul className='space-y-2' onClick={openDevelopmentTypeModal}>
                <li>Development Type</li>
              </ul>
              <ul className='space-y-2' onClick={openArchitecturalThemeModal}>
                <li>Architectural Theme</li>
              </ul>
              <ul className='space-y-2' onClick={openStatusModal}>
                <li>Status</li>
              </ul>
              <ul className='space-y-2' onClick={openAreaModal}>
                <li>Location</li>
              </ul>
              <Link
                href='/pages/appointment'
                className='text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg'
              >
                APPOINTMENTS
              </Link>
              <Link
                href='/pages/submitted-properties'
                className='text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg'
              >
                SUBMITTED PROPERTIES
              </Link>
            </nav>
          </div>
        )}
        <div className='main-container mt-24 p-4 flex justify-center items-center'>
          <div className='main max-w-screen-xl mx-auto'>
            <div className='box-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center'>
              {/* Box 1 */}
              <div className='box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                <div className='text text-center flex flex-col items-center'>
                  <div className='flex items-center mb-2'>
                    <h2 className='topic-heading text-3xl font-semibold'>
                      {counts.properties}
                    </h2>
                    <img
                      src='/assets/town.png'
                      alt='Views'
                      className='ml-4'
                      width={50}
                      height={50}
                    />
                  </div>
                  <h2 className='topic text-lg font-medium'>Properties</h2>
                </div>
              </div>

              {/* Box 2 */}
              <div className='box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                <div className='text text-center flex flex-col items-center'>
                  <div className='flex items-center mb-2'>
                    <h2 className='topic-heading text-3xl font-semibold'>
                      {counts.otherBuildings}
                    </h2>
                    <img
                      src='/assets/neighborhood.png'
                      alt='Other Buildings'
                      className='ml-4'
                      width={50}
                      height={50}
                    />
                  </div>
                  <h2 className='topic text-lg font-medium'>Other Buildings</h2>
                </div>
              </div>

              {/* Box 3 */}
              <div className='box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                <div className='text text-center flex flex-col items-center'>
                  <div className='flex items-center mb-2'>
                    <h2 className='topic-heading text-3xl font-semibold'>
                      {counts.condominiums}
                    </h2>
                    <img
                      src='/assets/skyline.png'
                      alt='Condominiums'
                      className='ml-4'
                      width={50}
                      height={50}
                    />
                  </div>
                  <h2 className='topic text-lg font-medium'>Condominiums</h2>
                </div>
              </div>

              {/* Box 4 */}
              <div className='box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                <div className='text text-center flex flex-col items-center'>
                  <div className='flex items-center mb-2'>
                    <h2 className='topic-heading text-3xl font-semibold'>
                      {counts.locations}
                    </h2>
                    <img
                      src='/assets/location.png'
                      alt='Locations'
                      className='ml-4'
                      width={50}
                      height={50}
                    />
                  </div>
                  <h2 className='topic text-lg font-medium'>Locations</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
<div className="demo-container min-h-screen mt-14 w-11/12 mx-auto overflow-y-auto scrollbar-hidden flex justify-center">
  {activeNav === "Properties" && <div><Demo /></div>}
    {activeNav === "Appointments" && <div><Appointment /></div>}
 {activeNav === "Client Property" && (
  <div>
    {/* Render the submitted properties here */}
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">First Name</th>
          <th className="px-4 py-2">Last Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Property Name</th>
          <th className="px-4 py-2">Location</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Files</th>
        </tr>
      </thead>
 <tbody>
              {submittedProperties.map((property) => {
                // Parse the files field into an array
                const filesArray = JSON.parse(property.files);

                return (
                  <tr key={property.id}>
                    <td className="border px-4 py-2">{property.first_name}</td>
                    <td className="border px-4 py-2">{property.last_name}</td>
                    <td className="border px-4 py-2">{property.email}</td>
                    <td className="border px-4 py-2">{property.phone}</td>
                    <td className="border px-4 py-2">{property.property_name}</td>
                    <td className="border px-4 py-2">{property.location}</td>
                    <td className="border px-4 py-2">{property.price}</td>
                    <td className="border px-4 py-2">{property.status}</td>
                    <td className="border px-4 py-2">{property.description}</td>

                    <td className="border px-4 py-2">
                      {/* Button to show images in the modal */}
                      {filesArray.length > 0 && (
                        <button
                          onClick={() => openModal2(filesArray)}
                          className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Show Images
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for displaying images */}
{modalIsOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg w-1/3 h-auto overflow-x-auto flex items-center justify-center">
      <button
        onClick={closeModal2}
        className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded p-2"
      >
        X
      </button>
      <div className="flex justify-center items-center w-full h-full">
        {modalImages.map((image, index) => (
          <img
            key={index}
            src={`https://infinitech-testing1.online/${image}`} // Full URL to the image
            alt={`Property image ${index + 1}`}
            className="w-full h-full object-contain" // Make image fill the container
          />
        ))}
      </div>
    </div>
  </div>
)}

{activeNav === "Details" && (
  <div className='h-96 overflow-y-auto'>
    {/* Development Type and Architectural Theme in 1st Row, 3 Columns */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      
      {/* Development Type */}
      <div className='h-80 overflow-y-auto'>
        <h2 className="text-xl font-semibold mb-4">Development Types</h2>
        <div className="flex gap-2 mb-4 ">
          <input
            type="text"
            placeholder="New Type Name"
            value={data.newType}
            onChange={(e) => setData({ ...data, newType: e.target.value })}
            className="border rounded p-2 w-full"
          />
          <button
            onClick={() => {
              handleAdd("development-type", data.newType, setData, "developmentTypes");
              setData({ ...data, newType: '' }); // Clear input after adding
            }}
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add
          </button>
        </div>
        <ul>
          {data.developmentTypes?.length > 0 ? (
            data.developmentTypes.map((type) => (
              <li key={type.id} className="flex justify-between p-2 border-b hover:bg-gray-100">
                <span>{type.name}</span>
                <button
                  onClick={() => handleDelete("development-type", type.id, "developmentTypes")}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No Development Types Found</li>
          )}
        </ul>
      </div>

      {/* Architectural Theme */}
      <div className='h-80 overflow-y-auto'>
        <h2 className="text-xl font-semibold mb-4">Architectural Themes</h2>
      <div className="flex gap-2 mb-4 ">

          <input
            type="text"
            placeholder="New Theme Name"
            value={data.newTheme}
            onChange={(e) => setData({ ...data, newTheme: e.target.value })}
            className="border rounded p-2 w-full"
          />
          <button
            onClick={() => {
              handleAdd("architectural-theme", data.newTheme, setData, "architecturalThemes");
              setData({ ...data, newTheme: '' }); // Clear input after adding
            }}
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add
          </button>

        </div>
        <ul>
          {data.architecturalThemes?.length > 0 ? (
            data.architecturalThemes.map((theme, index) => (
              <li key={index} className="flex justify-between p-2 border-b hover:bg-gray-100">
                <span>{theme.name}</span>
                <button
                  onClick={() => handleDelete("architectural-theme", theme.id, "architecturalThemes")}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No Architectural Themes Found</li>
          )}
        </ul>
      </div>

      {/* Status */}
      <div className='h-80 overflow-y-auto'>
        <h2 className="text-xl font-semibold mb-4">Status</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="New Status"
            value={data.newStatus}
            onChange={(e) => setData({ ...data, newStatus: e.target.value })}
            className="border rounded p-2 w-full"
          />
          <button
            onClick={() => {
              handleAdd("status", data.newStatus, setData, "statusOptions");
              setData({ ...data, newStatus: '' }); // Clear input after adding
            }}
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add
          </button>
        </div>
        <ul>
          {data.statusOptions?.length > 0 ? (
            data.statusOptions.map((status, index) => (
              <li key={index} className="flex justify-between p-2 border-b hover:bg-gray-100">
                <span>{status.name}</span>
                <button
                  onClick={() => handleDelete("status", status.id, "statusOptions")}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No Status Options Found</li>
          )}
        </ul>
      </div>
    </div>

    {/* Location in the 2nd Row, 1 Column */}
 <div className="grid grid-cols-1 mb-6 className='h-80 overflow-y-auto'">
    <h2 className="text-xl font-semibold mb-4">Locations</h2>
    <div className="flex gap-2 mb-4">
      {/* Area Name Input */}
      <input
        type="text"
        placeholder="Area Name"
        value={data.newAreaName || ''}
        onChange={(e) => setData({ ...data, newAreaName: e.target.value })}
        className="border rounded p-2 w-full"
      />

      {/* Title Input */}
      <input
        type="text"
        placeholder="Title"
        value={data.newTitle || ''}
        onChange={(e) => setData({ ...data, newTitle: e.target.value })}
        className="border rounded p-2 w-full"
      />

      {/* Description Input */}
      <input
        type="text"
        placeholder="Description"
        value={data.newDescription || ''}
        onChange={(e) => setData({ ...data, newDescription: e.target.value })}
        className="border rounded p-2 w-full"
      />

      {/* Image Upload */}
      <input
        type="file"
        onChange={handleImageChange}
        className="border rounded p-2 w-full"
      />

      {/* Add Button */}
      <button
        onClick={() => {
          handleAddLoc(
            'location',
            data.newAreaName,
            data.newTitle,
            data.newDescription,
            data.newImage,  // Pass the image here
            setData,
            'locations'
          );
        }}
        className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        Add
      </button>
    </div>

    {/* Error and Success Messages */}
    {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error message */}
    {success && <p className="text-green-500 mb-4">{success}</p>} {/* Success message */}

    {/* Locations List */}
    <ul>
      {data.locations?.length > 0 ? (
        data.locations.map((location, index) => (
          <li key={index} className="flex justify-between p-2 border-b hover:bg-gray-100">
            <span>{location.area_name} - {location.title}</span>
            <button
              onClick={() => handleDelete('location', location.id, 'locations')}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))
      ) : (
        <li>No Locations Found</li>
      )}
    </ul>
  </div>
  </div>
)}

{activeNav === "Chatbot" && (
  <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Chatbot Table</h3>

    <table className="min-w-full table-auto mb-8 border-collapse">
      <thead>
        <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600 ">ID</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600 ">Question</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600 ">Answer</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600 ">Actions</th>
        </tr>
      </thead>
<tbody>
  {data.chatbotEntries && data.chatbotEntries.length > 0 ? (
    data.chatbotEntries.map((item) => (
      <tr key={item.id || `${item.question}-${item.answer}`} className="hover:bg-gray-100">
        <td className="px-4 py-2 text-sm text-gray-800">{item.id}</td>
        <td className="px-4 py-2 text-sm text-gray-800">{item.question}</td>
        <td className="px-4 py-2 text-sm text-gray-800">{item.answer}</td>
        <td className="px-4 py-2 text-sm text-gray-800">
          <button
            className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500"
            onClick={() => handleDelete('chatbot', item.id, 'chatbotEntries')}
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="4"
        className="px-4 py-2 text-center text-sm text-gray-500"
      >
        No data available
      </td>
    </tr>
  )}
</tbody>



    </table>

    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? 'Edit' : 'Add'} Chatbot Entry
      </h4>

      <div className="space-y-4">
        <input
          type="text"
          name="question"
          value={chatbotFormData.question}
          onChange={handleInputChange_chatbot}
          placeholder="Enter question"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="answer"
          value={chatbotFormData.answer}
          onChange={handleInputChange_chatbot}
          placeholder="Enter answer"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          className={`w-full py-3 text-white rounded-md ${isEditing ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-green-600 hover:bg-green-500'}`}
          onClick={() => handleAdd('chatbot', {
            question: chatbotFormData.question,
            answer: chatbotFormData.answer
          }, setData, 'chatbotEntries')}
        >
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  </div>
)}


</div>


        <div>
          <DevelopmentTypeModal
            isOpen={isDevelopmentTypeModalOpen}
            closeModal={closeModal}
          />
          <ArchitecturalThemeModal
            isOpen={isArchitecturalThemeModalOpen}
            closeModal={closeModal}
          />
          <StatusModal isOpen={isStatusModalOpen} closeModal={closeModal} />
          <AreaModal isOpen={isAreaModalOpen} closeModal={closeModal} />
        </div>
      </div>
   </div>

    </>
  )
}
