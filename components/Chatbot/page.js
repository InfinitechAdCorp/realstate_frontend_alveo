import React, { useState, useEffect, useRef } from 'react';
import { createBot } from 'botui';
import Image from 'next/image';

const MyBot = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
    const [location, setLocation] = useState([]);
        const [architectural, setArchitectural] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [conversationStage, setConversationStage] = useState('greeting');
  const myBot = createBot();

  const chatContainerRef = useRef(null);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const showTypingIndicator = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleUserInput = () => {
    if (userMessage.trim() !== '') {
      setMessages([...messages, { sender: 'user', text: userMessage }]);
      setUserMessage('');
      showTypingIndicator();
      setTimeout(() => {
        processUserResponse(userMessage);
      }, 2000);
    }
  };

const processUserResponse = (message) => {
  console.log(`processUserResponse called with message: ${message}, Stage: ${conversationStage}`);
  switch (conversationStage) {
    case 'greeting':
      handleGreeting(message);
      break;
    case 'viewProperty':
      handleViewProperty(message);
      break;
    case 'handleArchitectural':
      handleArchitectural(message); // Pass the selected location to handleArchitectural
      break;
    default:
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'I didn’t understand that.' },
      ]);
      break;
  }
};


  const handleGreeting = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: 'Welcome to ALVEO! How can I assist you today?' },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'bot',
        buttons: [
          { label: 'View Property', value: 'viewProperty' },
          { label: 'Other Services', value: 'otherServices' },
        ],
      },
    ]);

    setConversationStage('waitingForResponse');
  };
const handleViewProperty = async () => {
  // Step 1: Set initial bot message
  setMessages((prevMessages) => [
    ...prevMessages,
    { sender: 'bot', text: 'In what Location?' },
  ]);

  // Step 2: Fetch locations from API
  try {
    const response = await fetch('http://localhost:8000/api/locations');
    const data = await response.json();

    // Step 3: Update `location` state with fetched data
    setLocation(data);

    // Step 4: Map over the data to create clickable buttons
    const locationButtons = data.map((loc) => ({
      label: loc.location, // Button text
      value: loc.location, // Button value (location name)
    }));

    // Step 5: Add buttons to messages
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'bot',
        buttons: locationButtons,
      },
    ]);

    // Step 6: Update conversation stage
    setConversationStage('handleArchitectural');
    console.log('Conversation stage updated:', conversationStage);
  } catch (error) {
    console.error('Error fetching locations:', error);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: 'Sorry, there was an issue fetching the locations.' },
    ]);
  }
};

const handleArchitectural = async (selectedLocation) => {
  // Step 1: Inform the user about the selected location
  setMessages((prevMessages) => [
    ...prevMessages,
    {
      sender: 'bot',
      text: `You selected ${selectedLocation}. Do you have an architectural theme you prefer?`,
    },
  ]);

  // Step 2: Fetch architectural themes from the API
  try {
    const response = await fetch('http://localhost:8000/api/getArchitectural'); // Adjust URL if needed
    const data = await response.json();

    // Step 3: Update the architectural state with fetched data
    setArchitectural(data);

    // Step 4: Create buttons for the architectural themes
    const architecturalButtons = data.map((theme) => ({
      label: theme.architectural_theme, // Assuming `name` is the property for theme names
      value: theme.architectural_theme,   // Use `id` or any unique identifier for the theme
    }));

    // Step 5: Add the buttons to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'bot',
        buttons: architecturalButtons,
      },
    ]);
console.log(architectural)
    // Step 6: Change conversation stage
    setConversationStage('selectArchitectural');
  } catch (error) {
    console.error('Error fetching architectural themes:', error);

    // Inform the user about the error
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'bot',
        text: 'Sorry, there was an issue fetching the architectural themes. Please try again later.',
      },
    ]);
  }
};


  const handlePropertyDetails = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'bot',
        text: 'Thank you for showing interest in our properties! 😊 Unfortunately, we couldn’t find any matches at the moment. To assist you further, feel free to contact us directly, and our team will be happy to help. Let me know how you’d like to proceed, and we’ll make sure to find the perfect fit for you!',
      },
    ]);
    setConversationStage('greeting');
  };
const handleButtonClick = (value) => {
  // Find the selected location in the array
  const selectedLocation = location.find((loc) => loc.location === value);

  // Check if a match was found before accessing properties
  if (selectedLocation) {
    console.log('Selected Location:', selectedLocation.location);
  } else {
    console.log('No matching location found for value:', value);
  }

  // Handle button actions based on the value
  if (value === 'viewProperty') {
    setConversationStage('viewProperty');
    handleViewProperty();
  } else if (value === 'otherServices') {
    setConversationStage('otherServices');
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: 'Our team is here to assist with any other services you may need!' },
    ]);
  } else if (selectedLocation) {
    setConversationStage('handleArchitectural');
    handleArchitectural(selectedLocation.location);
  } else {
    console.error('Invalid selection or no matching location found.');
  }
};


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isChatVisible) {
      handleGreeting();  
    }
  }, [isChatVisible]);

  return (
    <div>
      <div
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
        }}
      >
        <span style={{ fontSize: '30px' }}>💬</span>
      </div>

      {isChatVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            width: 'auto',
            height: '400px',
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            padding: '10px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              paddingBottom: '10px',
              borderBottom: '2px solid #ccc',
              marginBottom: '10px',
            }}
          >
            <Image src="/assets/logo.png" alt="Alveo" width={100} height={100} />
          </div>

       <div
  ref={chatContainerRef}
  style={{
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }}
>
  {messages.map((message, index) => (
    <div
      key={index}
      style={{
        display: 'flex',
        flexDirection: 'column', // Stack text and buttons vertically within the container
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start', // Align text and buttons based on sender
      }}
    >
      <div
        style={{
          maxWidth: '90%',
          height:'100%',
          backgroundColor: message.sender === 'user' ? '#007bff' : '#f1f1f1',
          color: message.sender === 'user' ? 'white' : 'black',
          padding:'5px',
          borderRadius: '10px',
          fontSize: '14px',
        // Space between text and buttons
          wordWrap: 'break-word',
        }}
      >
        {message.text}
    {message.buttons && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column', // Stack buttons vertically
            gap: '5px', // Slight gap between buttons
            alignItems: 'left', // Center buttons
          }}
        >
          {message.buttons.map((button, i) => (
            <button
              key={i}
              onClick={() => handleButtonClick(button.value)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '6px 14px', // Adjusted padding for compact buttons
                borderRadius: '8px', // Rounded corners for a softer appearance
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                width: 'auto', // Auto width to avoid stretching the button
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0056b3';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
      </div>

  
    </div>
  ))}

  {isTyping && (
    <div
      style={{
        position: 'absolute',
        bottom: '70px',
        left: '10px',
        display: 'flex',
        justifyContent: 'center',
        animation: 'typingAnimation 1.5s infinite',
      }}
    >
      <div
        className="typing-indicator"
        style={{
          fontSize: '24px',
          color: '#007bff',
          display: 'flex',
          gap: '5px',
        }}
      >
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </div>
    </div>
  )}
</div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingTop: '10px',
            }}
          >
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '20px',
                border: '1px solid #ccc',
                marginRight: '10px',
              }}
              placeholder="Type a message..."
            />
            <button
              onClick={handleUserInput}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '25px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes typingAnimation {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBot;
