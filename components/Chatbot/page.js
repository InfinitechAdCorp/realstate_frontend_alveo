import React, { useState, useEffect, useRef } from "react";
import { createBot } from "botui";
import Image from "next/image";

const MyBot = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [property, setProperty] = useState([]);
  const [location, setLocation] = useState([]);
  const [values, setValues] = useState({
    location: "",
    architectural: "",
    price: "",
    unit: "",
  });
  const [unitOptions, setUnitOptions] = useState([
    { label: "1BR", value: "1BR" },
    { label: "2BR", value: "2BR" },
    { label: "3BR", value: "3BR" },
    { label: "Studio", value: "Studio" },
  ]);
  const [priceOptions, setPriceOptions] = useState([
    { label: "1M-3M", value: "1,000,000 - 3,000,000" },
    { label: "3M-5M", value: "3,000,000 - 5,000,000" },
    { label: "5M-8M", value: "5,000,000 - 8,000,000" },
    { label: "8M-15M", value: "8,000,000 - 15,000,000" },
    { label: "15M-30M", value: "15,000,000 - 30,000,000" },
    { label: "30M-50M", value: "30,000,000 - 50,000,000" },
    { label: "50M +", value: "50,000,000" },
  ]);
  const [architectural, setArchitectural] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [conversationStage, setConversationStage] = useState("greeting");
  const myBot = createBot();

  const chatContainerRef = useRef(null);
  useEffect(() => {
    // Whenever values.location changes, you can perform some action
    console.log(values);
  }, [values]); // This will run when values.location is updated

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
    if (userMessage.trim() !== "") {
      setMessages([...messages, { sender: "user", text: userMessage }]);
      setUserMessage("");
      showTypingIndicator();
      setTimeout(() => {
        processUserResponse(userMessage);
      }, 2000);
    }
  };

  const processUserResponse = (message) => {
    console.log(
      `processUserResponse called with message: ${message}, Stage: ${conversationStage}`
    );
    switch (conversationStage) {
      case "greeting":
        handleGreeting(message);
        break;
      case "viewProperty":
        handleViewProperty(message);
        break;
      case "handleArchitectural":
        handleArchitectural(message); // Pass the selected location to handleArchitectural
        break;
      case "handleUnit":
        handleUnit(message); // Pass the selected location to handleArchitectural
        break;
      case "handlePrice":
        handlePrice(message); // Pass the selected location to handleArchitectural
        break;
      case "showProperty":
        showProperty(message); // Pass the selected location to handleArchitectural
        break;
      default:
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "I didn’t understand that." },
        ]);
        break;
    }
  };
  const handleButtonClick = (value) => {
    // Find the selected unit in the unit options array
    const selectedUnit = unitOptions.find((option) => option.value === value);
    const selectedPrice = priceOptions.find((price) => price.value === value);

    // Find the selected location in the location array
    const selectedLocation = location.find((loc) => loc.location === value);
    console.log(selectedPrice);
    // Find the selected architectural theme in the architectural array
    const selectedArchitectural = architectural.find(
      (item) => item.architectural_theme === value
    );

    // Update architectural field if a valid architectural theme is found
    if (selectedArchitectural) {
      console.log("Selected Architectural:", selectedArchitectural);
      setValues((prevValues) => ({
        ...prevValues,
        architectural: selectedArchitectural.architectural_theme,
      }));
    }

    // Update location field if a valid location is found
    if (selectedLocation) {
      console.log("Selected Location:", selectedLocation.location);
      setValues((prevValues) => ({
        ...prevValues,
        location: selectedLocation.location,
      }));
    }

    // Update unit field if a valid unit is selected
    if (selectedUnit) {
      console.log("Selected Unit:", selectedUnit.value);
      setValues((prevValues) => ({
        ...prevValues,
        unit: selectedUnit.value,
      }));
    }

    // Handle button actions based on the value
    if (value === "viewProperty") {
      setConversationStage("viewProperty");
      handleViewProperty();
    } else if (value === "otherServices") {
      setConversationStage("otherServices");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Our team is here to assist with any other services you may need! But it is currently unavailable.",
        },
      ]);
    } else if (selectedLocation) {
      setConversationStage("handleArchitectural");
      handleArchitectural(selectedLocation.location);
    } else if (selectedArchitectural) {
      setConversationStage("handleUnit");
      handleUnit(selectedArchitectural);
    } else if (selectedUnit) {
      setConversationStage("handlePrice");
      handlePrice(selectedUnit);
    } else if (selectedPrice) {
      setConversationStage("showProperty");
      showProperty(selectedPrice);
    } else {
      console.error("Invalid selection or no matching location found.");
    }
  };
  const showProperty = (message) => {
    console.log(message.value);
    console.log(property);

    // Check if the price range fits
    const checkPriceRange = (messageValue, property) => {
      const messageRange = messageValue.split(" - ");
      const messageStart = parseFloat(
        messageRange[0].replace(/[^0-9.-]+/g, "")
      );
      const messageEnd = parseFloat(messageRange[1].replace(/[^0-9.-]+/g, ""));

      for (let i = 0; i < property.length; i++) {
        const propertyRange = property[i].price_range.split(" - ");
        const propertyStart = parseFloat(
          propertyRange[0].replace(/[^0-9.-]+/g, "")
        );
        const propertyEnd = parseFloat(
          propertyRange[1].replace(/[^0-9.-]+/g, "")
        );

        // Check if message value is within property range or overlaps
        if (
          (messageStart >= propertyStart && messageStart <= propertyEnd) ||
          (messageEnd >= propertyStart && messageEnd <= propertyEnd) ||
          (messageStart <= propertyStart && messageEnd >= propertyEnd)
        ) {
          return true;
        }
      }
      return false;
    };

    // Format properties for display with HTML
    const formatPropertyInfo = (property) => {
      return property
        .map((p) => {
          return `
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
        <div style="font-size: 18px; font-weight: bold; color: #007bff; text-align: center; ">
          <a href='/pages/buildings/${p.id}' style="color: #007bff; text-decoration: none; font-weight: bold;">Click here to view the full property details</a>
        </div>

        <div style="font-size: 16px; color: #333; margin-bottom: 12px;">
          <strong style="font-weight: bold;">Property Name:</strong> ${p.name}
        </div>
        
        <div style="font-size: 16px; color: #333; margin-bottom: 12px;">
          <strong style="font-weight: bold;">Location:</strong> ${p.location}
        </div>

        <div style="font-size: 16px; color: #333; margin-bottom: 12px;">
          <strong style="font-weight: bold;">Specific Location:</strong> ${p.specific_location}
        </div>

        <div style="font-size: 16px; color: #333; margin-bottom: 12px;">
          <strong style="font-weight: bold;">Land Area:</strong> ${p.land_area}
        </div>

        <div style="font-size: 16px; color: #333; margin-bottom: 12px;">
          <strong style="font-weight: bold;">Price Range:</strong> 
          <span style="color: #28a745; font-weight: bold;">${p.price_range}</span>
        </div>

        <div style="font-size: 16px; color: #333; margin-bottom: 12px;">
          <strong style="font-weight: bold;">Units Available:</strong> 
          <span style="color: #ffc107; font-weight: bold;">${p.units}</span>
        </div>
      </div>
    `;
        })
        .join('<br /><hr style="border-color: #ddd;" /><br />');
    };

    // Check if the price range fits and send the formatted message
    const isWithinPriceRange = checkPriceRange(message.value, property);

    if (isWithinPriceRange) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: `We found properties that fit your price range: ${message.value}. Here's more information about the property:`,
        },
        { sender: "bot", text: formatPropertyInfo(property) },
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: `Sorry, no properties found that match your price range: ${message.value}.`,
        },
      ]);
    }
  };

  const handleGreeting = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "Welcome to ALVEO! How can I assist you today?" },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        buttons: [
          { label: "View Property", value: "viewProperty" },
          { label: "Other Services", value: "otherServices" },
        ],
      },
    ]);

    setConversationStage("waitingForResponse");
  };
  const handleViewProperty = async () => {
    // Step 1: Set initial bot message
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "In what Location?" },
    ]);

    // Step 2: Fetch locations from API
    try {
      const response = await fetch(
        "https://infinitech-testing1.online/api/locations"
      );
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
          sender: "bot",
          buttons: locationButtons,
        },
      ]);

      // Step 6: Update conversation stage
      setConversationStage("handleArchitectural");
      // console.log('Conversation stage updated:', conversationStage);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Sorry, there was an issue fetching the locations.",
        },
      ]);
    }
  };
  const handleUnit = async (message) => {
    // Step 1: Inform the user about the selected location
    console.log("Before updating:", message);

    // Setting messages based on updated state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        text: `You selected ${message.architectural_theme} in ${values.location}. What kind of unit do you prefer?`,
      },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        buttons: unitOptions,
      },
    ]);
  };

  const handleArchitectural = async (selectedLocation) => {
    // Step 1: Inform the user about the selected location
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        text: `You selected ${selectedLocation}. Do you have an architectural theme you prefer?`,
      },
    ]);

    // Step 2: Fetch architectural themes from the API
    try {
      const response = await fetch(
        "https://infinitech-testing1.online/api/getArchitectural"
      ); // Adjust URL if needed
      const data = await response.json();

      // Step 3: Update the architectural state with fetched data
      setArchitectural(data);

      // Step 4: Create buttons for the architectural themes
      const architecturalButtons = data.map((theme) => ({
        label: theme.architectural_theme, // Assuming `name` is the property for theme names
        value: theme.architectural_theme, // Use `id` or any unique identifier for the theme
      }));

      // Step 5: Add the buttons to the messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          buttons: architecturalButtons,
        },
      ]);
      console.log(values);
      // Step 6: Change conversation stage
      setConversationStage("selectArchitectural");
    } catch (error) {
      console.error("Error fetching architectural themes:", error);

      // Inform the user about the error
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Sorry, there was an issue fetching the architectural themes. Please try again later.",
        },
      ]);
    }
  };

  const handlePropertyDetails = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        text: "Thank you for showing interest in our properties! 😊 Unfortunately, we couldn’t find any matches at the moment. To assist you further, feel free to contact us directly, and our team will be happy to help. Let me know how you’d like to proceed, and we’ll make sure to find the perfect fit for you!",
      },
    ]);
    setConversationStage("greeting");
  };
  const handlePrice = (value) => {
    // Update the messages to ask for the price range
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        text: `What price range are you looking for your ${value.label} ${values.architectural} in ${values.location}?`,
      },
    ]);

    // Log the current values to the console
    console.log(values);

    // Make the API request directly here
    fetch(
      `https://infinitech-testing1.online/api/propertiesChatbot?location=${values.location}&architectural=${values.architectural}&unit=${values.unit}`
    )
      .then((response) => response.json())
      .then((properties) => {
        console.log("Fetched Properties:", properties);
        setProperty(properties);
        console.log(value);
        // You can also update the state with the fetched properties, if needed
        // For example: setProperties(properties);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text: "Sorry, there was an issue fetching the properties. Please try again later.",
          },
        ]);
      });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        buttons: priceOptions,
      },
    ]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        <span style={{ fontSize: "30px" }}>💬</span>
      </div>

      {isChatVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "auto",
            height: "400px",
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            padding: "10px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              paddingBottom: "10px",
              borderBottom: "2px solid #ccc",
              marginBottom: "10px",
            }}
          >
            <Image
              src="/assets/logo.png"
              alt="Alveo"
              width={100}
              height={100}
            />
          </div>
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column", // Stack text and buttons vertically within the container
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  alignItems:
                    message.sender === "user" ? "flex-end" : "flex-start", // Align text and buttons based on sender
                }}
              >
                <div
                  style={{
                    maxWidth: "90%",
                    height: "100%",
                    backgroundColor:
                      message.sender === "user" ? "#007bff" : "#f1f1f1",
                    color: message.sender === "user" ? "white" : "black",
                    padding: "5px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    wordWrap: "break-word",
                  }}
                >
                  {/* Render message text with dangerous HTML injection */}
                  <div dangerouslySetInnerHTML={{ __html: message.text }} />
                  {message.buttons && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column", // Stack buttons vertically
                        gap: "5px", // Slight gap between buttons
                        alignItems: "left", // Center buttons
                      }}
                    >
                      {message.buttons.map((button, i) => (
                        <button
                          key={i}
                          onClick={() => handleButtonClick(button.value)}
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            width: "auto", // Auto width to avoid stretching the button
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#0056b3";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#007bff";
                            e.target.style.transform = "scale(1)";
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
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: "10px",
            }}
          >
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUserInput()}
              style={{
                flex: 1,
                padding: "6px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                marginRight: "10px",
              }}
              placeholder="Type a message..."
            />
            <button
              onClick={handleUserInput}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "5px 12px",
                borderRadius: "25px",
                cursor: "pointer",
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
