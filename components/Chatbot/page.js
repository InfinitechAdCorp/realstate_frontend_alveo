import React, { useState, useEffect, useRef } from 'react';
import { createBot } from 'botui';
import Image from 'next/image';

const MyBot = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
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
    switch (conversationStage) {
      case 'greeting':
        handleGreeting(message);
        break;
      case 'viewProperty':
        handleViewProperty(message);
        break;
      case 'propertyDetails':
        handlePropertyDetails(message);
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
      { sender: 'bot', text: 'Hi there! 👋. How can I assist you today?' },
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

  const handleViewProperty = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: 'Please select: For Sale or For Lease.' },
    ]);
    setConversationStage('propertyDetails');
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
    if (value === 'viewProperty') {
      setConversationStage('viewProperty');
      handleViewProperty();
    } else if (value === 'otherServices') {
      setConversationStage('otherServices');
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Our team is here to assist with any other services you may need!' },
      ]);
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
            width: '300px',
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
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    backgroundColor: message.sender === 'user' ? '#007bff' : '#f1f1f1',
                    color: message.sender === 'user' ? 'white' : 'black',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    margin: '5px',
                    wordWrap: 'break-word',
                  }}
                >
                  {message.text}
                </div>

                {message.buttons && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginTop: '10px',
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
                          padding: '10px 20px',
                          borderRadius: '25px',
                          cursor: 'pointer',
                        }}
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                )}
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
