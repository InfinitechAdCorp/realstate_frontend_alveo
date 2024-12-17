"use client";
import React, { useEffect, useState } from "react";
import * as fabric from "fabric";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { jsPDF } from "jspdf";
import Image from "next/image";
import SEO from "./../../seo/page"
const CanvasApp = () => {
  const [canvas, setCanvas] = useState(null);
  const [scaling, setScaling] = useState(25);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [roomDimensions, setRoomDimensions] = useState({ width: 0, height: 0 }); // State to store room dimensions
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [groupedData, setGroupedData] = useState({});
  const [roomWidth, setRoomWidth] = useState(5); // Default room width (in meters)
  const [roomLength, setRoomLength] = useState(4.5); // Default room length (in meters)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [labelsVisible, setLabelsVisible] = useState(true); // Track visibility state of labels
  const [draggedItem, setDraggedItem] = useState(null);
  const [roomIdCounter, setRoomIdCounter] = useState(1);
  const [prevAltText, setPrevAltText] = useState(null); // State to store previous altText
  const [imageIdCounter, setImageIdCounter] = useState(1); // Counter for image IDs
  const [altTextCounters, setAltTextCounters] = useState({});
  const [imageDetails, setImageDetails] = useState([]); // State to store image details

  let canvasInstance = null; // Declare the canvas instance outside of the function
  const initCanvas = () => {
    // If the canvas is already initialized, dispose of it
    if (canvasInstance) {

      canvasInstance.dispose(); // Dispose of the current canvas to avoid duplication
    }

    // Create a new canvas instance
    canvasInstance = new fabric.Canvas("canvas", {
      width: window.innerWidth,
      height: window.innerHeight,
      preserveObjectStacking: true,
    });

    // Add grid to the canvas
    addGrid(canvasInstance);

    // Update state for canvas dimensions
    setCanvasDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

 
    return canvasInstance;
  };

  // Effect to initialize canvas on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newCanvas = initCanvas();
      setCanvas(newCanvas);
      fetchData(); // Fetch data and update state
    }
  }, []);

  // Start with room-1
  let rooms = []; // Array to store room data

  // Function to create a room
  const createRoom = (width, height) => {
    if (!canvas) return false;

    const roomId = `room-${roomIdCounter}`;

    // Increment counter after creating the room
    setRoomIdCounter((prevCounter) => prevCounter + 1);

    // Calculate initial room dimensions based on scaling factor in pixels
    const roomWidthPx = (width * 200) / scaling;
    const roomHeightPx = (height * 200) / scaling;

    // Create a rectangle representing the room
    const roomRect = new fabric.Rect({
      width: roomWidthPx,
      height: roomHeightPx,
      fill: null,
      stroke: "#808080",
      strokeWidth: 1,
      transparentCorners: false,
      cornerSize: 17,
      cornerStyle: "circle",
      cornerColor: "white",
      cornerStrokeColor: "#808080",
      hasBorders: true,
      lockMovementX: false,
      lockMovementY: false,
      selectable: true, // Make sure the object is selectable
      evented: true,
      id: roomId,
    });
    const roomIdLabel = new fabric.Textbox("", {
      fontSize: 22,
      fill: "#000000",
      left: roomRect.left + roomRect.getScaledWidth() / 2, // Center horizontally at the top
      top: roomRect.top - 20, // Position the label 20 pixels above the room
      width: 100, // Set a fixed width for the textbox
      editable: true, // Allow the text to be edited
      textAlign: "center", // Center the text
      selectable: true, // Allow the text box to be selected
      id: `${roomId}`,
      zIndex: "1000",
    });

    // Create text labels for width and height inside the room (using Textbox for editable text)
    const widthLabel = new fabric.Textbox("", {
      fontSize: 18,
      fill: "#000000",
      left: roomRect.left + roomRect.getScaledWidth() / 2, // Center horizontally at the bottom
      top: roomRect.top + roomRect.getScaledHeight() + 10, // 10 pixels below the room
      width: 100, // Set a fixed width for the textbox
      editable: true, // Allow the text to be edited
      textAlign: "center", // Center the text
      selectable: true, // Allow the text box to be selected
      id: `${roomId}-widthLabel`,
    });

    const heightLabel = new fabric.Textbox("", {
      fontSize: 18,
      fill: "#000000",
      left: roomRect.left - 30, // Positioned to the left of the room
      top: roomRect.top + roomRect.getScaledHeight() / 2, // Vertically centered
      width: 100, // Set a fixed width for the textbox
      editable: true, // Allow the text to be edited
      textAlign: "center", // Center the text
      selectable: true, // Allow the text box to be selected
      id: `${roomId}-widthLabel`,
    });

    // Function to update the labels when the room is modified
    const updateLabels = () => {
      // Calculate the current width and height in pixels
      const roomWidth = Math.round(roomRect.width * roomRect.scaleX);
      const roomHeight = Math.round(roomRect.height * roomRect.scaleY);

      // Convert pixel dimensions to meters
      const pixelsPerBox = 50;
      const metersPerBox = 0.5;

      const widthInMeters = (roomWidth / pixelsPerBox) * metersPerBox;
      const heightInMeters = (roomHeight / pixelsPerBox) * metersPerBox;

      // Update width label text
      widthLabel.set({
        text: `${widthInMeters.toFixed(2)} m`,
        left: roomRect.left + roomRect.getScaledWidth() / 2, // Center horizontally at the bottom
        top: roomRect.top + roomRect.getScaledHeight() + 10, // 10 pixels below the room
      });
      roomIdLabel.set({
        text: `${roomId}`,
        left: roomRect.left + roomRect.getScaledWidth() / 5, // Center horizontally
        top: roomRect.top - 80, // 30 pixels above the room (adjust this distance if needed)
      });

      // Update height label text
      heightLabel.set({
        text: `${heightInMeters.toFixed(2)} m`,
        left: roomRect.left - 30, // Positioned to the left of the room
        top: roomRect.top + roomRect.getScaledHeight() / 2, // Vertically centered
      });

      // Re-render the canvas to update the labels
      canvas.renderAll();
    };

    // Handle text editing
    const handleTextEditing = (label, isWidthLabel) => {
      label.on("editing:exited", () => {
        const newSize = parseFloat(label.text.replace(" m", ""));
        if (!isNaN(newSize)) {
          const pixelsPerBox = 50;
          const metersPerBox = 0.5;

          if (isWidthLabel) {
            // Update the room width
            roomRect.set({ width: (newSize * pixelsPerBox) / metersPerBox });
          } else {
            // Update the room height
            roomRect.set({ height: (newSize * pixelsPerBox) / metersPerBox });
          }

          // After modifying the room, update the labels and render the canvas
          updateLabels();
        }
      });
    };

    // Add the room rectangle and labels to the canvas
    canvas.add(roomRect);
    canvas.add(widthLabel, heightLabel, roomIdLabel);
    canvas.centerObject(roomRect);
    canvas.setActiveObject(roomRect);
    canvas.renderAll();

    // Store the labels inside the room object
    roomRect.widthLabel = widthLabel;
    roomRect.heightLabel = heightLabel;
    roomRect.roomIdLabel = roomIdLabel;

    // Set up event listeners to update labels on any modification
    roomRect.on("selected", updateLabels);
    roomRect.on("moving", updateLabels);
    roomRect.on("scaling", updateLabels);
    roomRect.on("modified", updateLabels);

    // Set up event listeners to update displayed dimensions
    roomRect.on("selected", () => displayDimensions(roomRect));
    roomRect.on("moving", () => displayDimensions(roomRect));
    roomRect.on("scaling", () => displayDimensions(roomRect));
    roomRect.on("modified", () => displayDimensions(roomRect)); // Finalize on modification

    // Remove labels when room is removed or deleteda

    // Enable text editing for width and height
    handleTextEditing(widthLabel, true);
    handleTextEditing(heightLabel, false);
    rooms.push({
      id: roomId,
      roomRect,
      widthLabel,
      heightLabel,
    });

    // Log all room items with their ID, width, and height

    rooms.forEach((room) => {
      const width = room.roomRect.width * room.roomRect.scaleX;
      const height = room.roomRect.height * room.roomRect.scaleY;
    });
    return { widthLabel, heightLabel, id: roomId };
  };

  const toggleLabels = () => {
    if (!canvas) return;

    const selectedObject = canvas.getActiveObject();

    if (selectedObject && selectedObject.type === "rect") {
      // If a room (rectangle) is selected, only toggle its associated labels
      const widthLabel = selectedObject.widthLabel;
      const heightLabel = selectedObject.heightLabel;

      // Toggle visibility for the selected room's labels
      if (widthLabel) {
        widthLabel.set("visible", !widthLabel.visible);
      }
      if (heightLabel) {
        heightLabel.set("visible", !heightLabel.visible);
      }
    } else if (selectedObject && selectedObject.type === "image") {
      // If an image is selected, toggle the visibility for its associated labels
      const widthLabel = selectedObject.widthLabel;
      const heightLabel = selectedObject.heightLabel;

      // Toggle visibility for the selected image's labels
      if (widthLabel) {
        widthLabel.set("visible", !widthLabel.visible);
      }
      if (heightLabel) {
        heightLabel.set("visible", !heightLabel.visible);
      }
    } else {
      // If no room or image is selected, toggle visibility for all labels on the canvas
      const allObjects = canvas.getObjects();
      allObjects.forEach((object) => {
        if (
          (object.type === "text" || object.type === "textbox") &&
          object !== selectedObject
        ) {
          object.set("visible", labelsVisible);
        }
      });
    }

    // Toggle the visibility state
    setLabelsVisible((prevState) => !prevState);

    // Re-render the canvas to apply the visibility changes
    canvas.renderAll();
  };

  // Update function to calculate and set room dimensions
  const displayDimensions = (roomRect) => {
    // Calculate width and height in pixels
    const roomWidth = Math.round(roomRect.width * roomRect.scaleX);
    const roomHeight = Math.round(roomRect.height * roomRect.scaleY);

    // Convert pixel dimensions to meters based on your grid spacing
    const pixelsPerBox = 50; // 50px per box
    const metersPerBox = 0.5; // 4 boxes = 1 square meter

    // Calculate width and height in meters
    const widthInMeters = (roomWidth / pixelsPerBox) * metersPerBox;
    const heightInMeters = (roomHeight / pixelsPerBox) * metersPerBox;

    // Update the state with the dimensions in meters
    setDimensions({
      width: widthInMeters,
      height: heightInMeters,
    });

    // Optional: Log the calculations for debugging

  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/roomplanner");
      const data = await response.json();
      const grouped = data.data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      setGroupedData(grouped);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExport = () => {
    if (!canvas) return;

    // Set the background color to white for a clean export
    canvas.backgroundColor = "white";

    // Define the output image size (optional: you can specify the width and height)
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // Create an off-screen canvas to apply watermark
    const offScreenCanvas = document.createElement("canvas");
    const ctx = offScreenCanvas.getContext("2d");

    // Set the size of the off-screen canvas to match the main canvas
    offScreenCanvas.width = canvasWidth;
    offScreenCanvas.height = canvasHeight;

    // Draw the canvas content onto the off-screen canvas
    const img = new window.Image();
    img.crossOrigin = "anonymous"; // Enable cross-origin access
    img.src = canvas.toDataURL("image/png"); // Export as PNG
    img.onload = () => {
      // Draw the original canvas image onto the off-screen canvas
      ctx.drawImage(img, 0, 0);

      // Now apply the watermark to the off-screen canvas
      const watermarkImg = new window.Image();
      watermarkImg.crossOrigin = "anonymous"; // Enable cross-origin access
      watermarkImg.src = "/assets/RoomPlanner/infinitech.png"; // Watermark image path
      watermarkImg.onload = () => {
        // Control watermark size (adjust this value to change the size)
        const watermarkSize = 0.15; // 15% of the canvas width/height
        const watermarkWidth = offScreenCanvas.width * watermarkSize;
        const watermarkHeight = offScreenCanvas.height * watermarkSize;

        // Set transparency of the watermark
        ctx.globalAlpha = 0.25; // Set transparency to 25%

        // Draw watermark at the four corners
        ctx.drawImage(watermarkImg, 10, 10, watermarkWidth, watermarkHeight); // Upper Left
        ctx.drawImage(
          watermarkImg,
          offScreenCanvas.width - watermarkWidth - 10,
          10,
          watermarkWidth,
          watermarkHeight
        ); // Upper Right
        ctx.drawImage(
          watermarkImg,
          10,
          offScreenCanvas.height - watermarkHeight - 10,
          watermarkWidth,
          watermarkHeight
        ); // Lower Left
        ctx.drawImage(
          watermarkImg,
          offScreenCanvas.width - watermarkWidth - 10,
          offScreenCanvas.height - watermarkHeight - 10,
          watermarkWidth,
          watermarkHeight
        ); // Lower Right

        // Draw watermark in the center
        ctx.drawImage(
          watermarkImg,
          offScreenCanvas.width / 2 - watermarkWidth / 2,
          offScreenCanvas.height / 2 - watermarkHeight / 2,
          watermarkWidth,
          watermarkHeight
        ); // Center

        // Convert the off-screen canvas back to a data URL (with watermark)
        const finalImage = offScreenCanvas.toDataURL("image/png");

        // Create a downloadable link for the image with watermark
        const a = document.createElement("a");
        a.href = finalImage; // Use the image data with watermark
        a.download = "RoomPlanner-with-watermark.png"; // Set the download file name
        a.click(); // Trigger the download
      };
    };
  };

  // Handle object deletion
  const handleDelete = () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      // Check if the selected object is an image
      if (activeObject.type === "image") {
        // Remove associated labels (imgIdLabel, widthLabel, heightLabel)
        const imgIdLabel = activeObject.imgIdLabel;
        const widthLabel = activeObject.widthLabel;
        const heightLabel = activeObject.heightLabel;

        // Remove the labels from the canvas
        if (imgIdLabel) canvas.remove(imgIdLabel);
        if (widthLabel) canvas.remove(widthLabel);
        if (heightLabel) canvas.remove(heightLabel);
      }

      // Remove the active image object from the canvas
      canvas.remove(activeObject);

      // Optionally, re-render the canvas
      canvas.renderAll();
    } else if (activeObject) {
      // Check if the selected object is a room (which is a rectangle with labels)
      if (
        activeObject.type === "rect" &&
        activeObject.id &&
        activeObject.id.startsWith("room-")
      ) {
        // Retrieve the associated labels
        const roomIdLabel = activeObject.roomIdLabel;
        const widthLabel = activeObject.widthLabel;
        const heightLabel = activeObject.heightLabel;

        // Ensure labels exist and are part of the canvas before attempting to remove
        if (roomIdLabel) {
  
          canvas.remove(roomIdLabel);
        }
        if (widthLabel) {
      
          canvas.remove(widthLabel);
        }
        if (heightLabel) {
      
          canvas.remove(heightLabel);
        }

        // Remove the room rectangle itself
  
        canvas.remove(activeObject);

        // Re-render the canvas to apply the changes
        canvas.renderAll();
      } else {
       
      }
    }

    // You could add further checks for other types of objects (like images) here, as in your original code
  };

  // Declare the global variable to store image IDs that have been added to the canvas
  const loadedImageIds = new Set();

  const handleItemClick = (item) => {
    if (!canvas) {
      console.error("Canvas not initialized yet.");
      return;
    }

    const category = item.dataset.category;
    const picture = item.dataset.picture;

    if (!category || !picture) {
      console.error("Missing category or picture data.");
      return;
    }

    const width = (item.dataset.width * 37.8) / scaling;
    const height = (item.dataset.height * 37.8) / scaling;

    const imageURL = `http://localhost:3000/assets/RoomPlanner/${encodeURIComponent(
      category
    )}/${encodeURIComponent(picture)}`;


    const altText = item.getAttribute("alt");
    const imgElement = new window.Image(); // Using window.Image to avoid Next.js conflict
    imgElement.src = imageURL;

    // Update the altText counter and generate imageId
    setAltTextCounters((prevCounters) => {
      const newCounters = { ...prevCounters };

      // If this altText has been used before, increment its count; otherwise, start at 1
      const newCount = (newCounters[altText] || 0) + 1;
      newCounters[altText] = newCount; // Update the counter for this altText

      // Generate the item ID using the updated count
      const imageId = `${altText} item-${newCount}`;

  

      // Check if the image has already been added (either through ID check or canvas object check)
      if (loadedImageIds.has(imageId)) {
       
        return newCounters; // Prevent adding the image again
      }

      // Check if the image is already on the canvas by searching for its ID in the canvas
      const existingImage = canvas
        .getObjects("image")
        .find((img) => img.id === imageId);
      if (existingImage) {
      
        return newCounters; // Skip adding it again
      }

      imgElement.onload = () => {
        const img = new fabric.Image(imgElement, {
          left: 0,
          top: 0,
          scaleX: width / imgElement.width,
          scaleY: height / imgElement.height,
          id: imageId, // Use the dynamically generated image ID
        });

        // Mark this image ID as loaded
        loadedImageIds.add(imageId);

        // Add the image to the canvas
        canvas.add(img);
        canvas.centerObject(img);
        canvas.renderAll();

        const imgIdLabel = new fabric.Textbox("", {
          fontSize: 22,
          fill: "#000000",

          width: 300, // Set a fixed width for the textbox
          editable: true, // Allow the text to be edited
          textAlign: "center", // Center the text
          selectable: true, // Allow the text box to be selected
          id: `${imageId}`,
          zIndex: "1000",
        });
        const widthLabel = new fabric.Textbox("", {
          editable: true,
          fontSize: 14,
          fill: "#000000",
          selectable: true,
          id: `${imageId}-widthLabel`,
        });

        const heightLabel = new fabric.Textbox("", {
          editable: true,
          fontSize: 14,
          fill: "#000000",
          selectable: true,
          id: `${imageId}-heightLabel`,
        });

        const updateLabels = () => {
          const imgWidth = Math.round(img.width * img.scaleX);
          const imgHeight = Math.round(img.height * img.scaleY);

          const pixelsPerBox = 50;
          const metersPerBox = 0.5;

          const widthInMeters = (imgWidth / pixelsPerBox) * metersPerBox;
          const heightInMeters = (imgHeight / pixelsPerBox) * metersPerBox;
          const enlargedFontSize = 28;
          imgIdLabel.set({
            text: `${imageId}`,
            left: img.left - 80, // Center horizontally
            top: img.top - 80, // 30 pixels above the room (adjust this distance if needed)
          });
          widthLabel.set({
            text: `${widthInMeters.toFixed(2)} m`,
            left: img.left + img.getScaledWidth() / 2,
            top: img.top + img.getScaledHeight() + 10,
            fontSize: enlargedFontSize,
          });

          heightLabel.set({
            text: `${heightInMeters.toFixed(2)} m`,
            left: img.left - 30,
            top: img.top + img.getScaledHeight() / 2,
            fontSize: enlargedFontSize,
          });

          canvas.renderAll();
        };

        // Add the labels to the canvas
        canvas.add(widthLabel, heightLabel, imgIdLabel);
        updateLabels(); // Initial call to display dimensions

        // Function to enable label editing
        const handleTextEditing = (label, isWidthLabel) => {
          label.on("editing:exited", () => {
            const newSize = parseFloat(label.text.replace("m", ""));
            if (!isNaN(newSize)) {
              const pixelsPerBox = 50;
              const metersPerBox = 0.5;

              if (isWidthLabel) {
                img.set({
                  scaleX:
                    (newSize * pixelsPerBox) / metersPerBox / imgElement.width,
                });
              } else {
                img.set({
                  scaleY:
                    (newSize * pixelsPerBox) / metersPerBox / imgElement.height,
                });
              }

              updateLabels();
            }
          });
        };

        // Enable label editing
        handleTextEditing(widthLabel, true);
        handleTextEditing(heightLabel, false);

        // Update labels and image size on selected, moving, scaling, or modified
        img.on("selected", updateLabels);
        img.on("moving", updateLabels);
        img.on("scaling", updateLabels);
        img.on("modified", updateLabels);

        img.on("selected", () => displayDimensions(img));
        img.on("moving", () => displayDimensions(img));
        img.on("scaling", () => displayDimensions(img));
        img.on("modified", () => displayDimensions(img));

        // Store the labels inside the image object
        img.widthLabel = widthLabel;
        img.heightLabel = heightLabel;
        img.imgIdLabel = imgIdLabel;
        setImageDetails((prevDetails) => [
          ...prevDetails,
          { imageId, widthLabel, heightLabel },
        ]);
      };

      imgElement.onerror = (error) => {
        console.error("Error loading image:", error);
      };

      // Return the updated counters to maintain state
      return newCounters;
    });
  };

  const addGrid = (
    canvas,
    gridSpacing = 50,
    gridColor = "black",
    gridOpacity = 0.3,
    canvasInstance
  ) => {
    const canvasWidth = 10000;
    const canvasHeight = 100000;

    // Clear previous grid lines
    const existingGridLines = canvas.getObjects("line");
    canvas.remove(...existingGridLines);

    const gridLines = [];

    // Set the grid color with opacity
    const gridLineOptions = {
      stroke: gridColor,
      strokeWidth: 1,
      selectable: false, // Make the grid lines non-selectable
      opacity: gridOpacity, // Set opacity of grid lines
    };

    // Create vertical grid lines
    for (let x = 0; x <= canvasWidth; x += gridSpacing) {
      const line = new fabric.Line([x, 0, x, canvasHeight], gridLineOptions);
      gridLines.push(line);
    }

    // Create horizontal grid lines
    for (let y = 0; y <= canvasHeight; y += gridSpacing) {
      const line = new fabric.Line([0, y, canvasWidth, y], gridLineOptions);
      gridLines.push(line);
    }

    // Add all the grid lines to the canvas
    canvas.add(...gridLines);
    canvas.renderAll(); // Re-render the canvas to display the grid
  };

  // Handle zoom functionality
  const handleZoom = (increase) => {
    let currentZoom = canvas.getZoom();
    currentZoom *= increase ? 1.1 : 0.9;
    if (currentZoom > 3) currentZoom = 3;
    if (currentZoom < 0.1) currentZoom = 0.1;
    canvas.setZoom(currentZoom);
  };

  const handleAddTextbox = () => {
    if (!canvas) return;

    // Create a fabric.js textbox
    const textbox = new fabric.Textbox("Click to edit", {
      left: 100, // Set initial position
      top: 100, // Set initial position
      fontSize: 20,
      width: 200, // Set width
      height: 50, // Set height
      editable: true,
      fill: "black", // Text color
      backgroundColor: "white", // Background color
      fontFamily: "Arial", // Set font family
      fontWeight: "normal", // Set font weight to normal to avoid boldness
    });

    // Add the textbox to the canvas
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll(); // Re-render the canvas to display the new object

    // After adding the textbox, display its dimensions
    displayDimensions(textbox); // Call displayDimensions to show textbox dimensions

    // Add event listeners to update dimensions on selection, moving, scaling, or modification
    textbox.on("selected", () => displayDimensions(textbox));
    textbox.on("moving", () => displayDimensions(textbox));
    textbox.on("scaling", () => displayDimensions(textbox));
    textbox.on("modified", () => displayDimensions(textbox)); // Finalize on modification
  };

  const logActiveObjectIds = () => {
    const doc = new jsPDF(); // Get jsPDF from the global window object

    const exportData = {
      rooms: {},
      images: [],
    };

    // Check if the canvas and active objects exist
    if (canvas) {
      // Collect room details
      canvas.getObjects().forEach((obj) => {
        if (
          obj.id &&
          obj.id.startsWith("room-") &&
          !obj.id.includes("-widthLabel") &&
          !obj.id.includes("-heightLabel")
        ) {
          const widthInPixels = Math.round(obj.width * obj.scaleX);
          const heightInPixels = Math.round(obj.height * obj.scaleY);

          const pixelsPerBox = 50;
          const metersPerBox = 0.5;
          const widthInMeters = (widthInPixels / pixelsPerBox) * metersPerBox;
          const heightInMeters = (heightInPixels / pixelsPerBox) * metersPerBox;

          // Store room details, using the room ID as the key
          if (!exportData.rooms[obj.id]) {
            exportData.rooms[obj.id] = {
              id: obj.id,
              width: widthInMeters.toFixed(2),
              height: heightInMeters.toFixed(2),
            };
          }
        }
      });

      // Collect image details
      imageDetails.forEach((imageDetail) => {
        exportData.images.push({
          imageId: imageDetail.imageId,
          widthLabel: imageDetail.widthLabel.text,
          heightLabel: imageDetail.heightLabel.text,
        });
      });

      // Set up PDF title
      doc.setFontSize(12);
      doc.text("Room and Image Details:", 14, 10);

      // Set up room details in the PDF
      doc.setFontSize(10);
      let yPosition = 20; // Start position for room details
      for (const roomId in exportData.rooms) {
        const room = exportData.rooms[roomId];
        doc.text(
          `${room.id} - Width: ${room.width} m - Height: ${room.height} m`,
          14,
          yPosition
        );
        yPosition += 10; // Move to next line
      }

      // Set up image details in the PDF
      yPosition += 10; // Add some space between rooms and images
      exportData.images.forEach((image) => {
        doc.text(
          ` ${image.imageId} - Width Label: ${image.widthLabel} - Height Label: ${image.heightLabel}`,
          14,
          yPosition
        );
        yPosition += 10; // Move to next line
      });

      // Save the PDF file
      doc.save("exported_data.pdf");
    } else {

    }
  };

  const resetCanvas = () => {
    if (canvas) {
      // Dispose of the current canvas instance to avoid "already initialized" error
      canvas.dispose();
    }
  setRoomIdCounter(1);
    setAltTextCounters({});

  // Clear the loadedImageIds set
  loadedImageIds.clear();
    // Initialize a new canvas and set it to the state
    const newCanvas = initCanvas();
    setCanvas(newCanvas); // Set the new canvas instance

    // Show the popup container for entering room dimensions (optional)
    // popupContainer.style.display = "block"; (Uncomment if needed)
  };

  const handleCreateRoom = () => {
    // Call the createRoom function with the provided dimensions
    createRoom(roomWidth, roomLength);

    // After creating the room, hide the popup
    setShowPopup(false);
  };
  const handlePointerDown = (e) => {

    // Add your logic here
  };

  return (
    
  <div className="header-container">
     <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, property customize, building format, property layout, roomplanner, roomlayout, realstate customization,room layout"
  canonical="http://localhost:3000/pages/roomplanner"
/>
  <div className="header-container bg-blue-500">
    <div className="button-container flex flex-wrap gap-1 justify-center p-3 bg-blue-500">
      <button
        className="new-btn h-12 bg-blue-700 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={resetCanvas}
      >
        New
      </button>
      <button
        className="generate-room-btn h-12 bg-blue-600 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={() => createRoom(10, 10)}
      >
        Generate Room
      </button>
      <button
        className="label-btn h-12 bg-blue-600 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={handleAddTextbox}
      >
        Label
      </button>
      <button
        className="delete-btn h-12 bg-blue-600 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        className="zoom-btn plus h-12 bg-blue-600 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={() => handleZoom(true)}
      >
        Zoom In
      </button>
      <button
        className="zoom-btn minus h-12 bg-blue-600 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={() => handleZoom(false)}
      >
        Zoom Out
      </button>
      <button
        className="label-btn h-12 bg-blue-600 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={toggleLabels}
      >
        Show/Hide Label
      </button>
      <button
        className="export-btn h-12 bg-blue-600 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={handleExport}
      >
        Export Planner
      </button>
      <button
        className="label-btn h-12 bg-blue-600 text-white text-lg font-bold rounded px-4 py-2 hover:opacity-90"
        onClick={logActiveObjectIds}
      >
        Export Data
      </button>
    </div>
  </div>
  {/* Main content */}
  <div className="flex flex-col lg:flex-row fixed w-full">
    {/* Accordion section */}
    <div className="w-full lg:w-1/3 xl:w-1/4  bg-white z-50 p-2">
      <Accordion type="single" collapsible>
        {Object.keys(groupedData).map((category, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg xl:text-xl w-full p-4 flex justify-between items-center">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 w-full justify-items-center max-h-64 xl:max-h-96 overflow-y-auto gap-4">
                {groupedData[category].map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`text-center w-4/5 ${
                      itemIndex % 2 === 0 &&
                      itemIndex === groupedData[category].length - 1
                        ? "col-span-2"
                        : ""
                    }`}
                  >
                    <h4 className="text-sm xl:text-base">{item.name}</h4>
                    <p className="text-xs xl:text-sm">
                      {item.height} x {item.width}
                    </p>
                    <img
                      src={`http://localhost:3000/assets/RoomPlanner/${category}/${item.picture}`}
                      alt={item.name}
                      className="w-16 h-16 xl:w-24 xl:h-24 cursor-pointer"
                      data-category={category}
                      data-picture={item.picture}
                      data-width={item.width}
                      data-height={item.height}
                      onClick={(e) => handleItemClick(e.target)}
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>

    {/* Canvas container */}
    <div className="relative flex-grow xl:w-3/4 2xl:w-3/4 " onClick={handlePointerDown}>
  <canvas
    id="canvas"
    className="border-black w-screen h-32 xl:h-screen lg:h-auto  "
  ></canvas>
  <div
    id="dimensionDisplay"
    className="text-lg w-auto fixed top-10 left-5 bg-white text-black p-2 border-2 border-black rounded z-50 xl:left-1/4 xl:top-20 mt-2"
    dangerouslySetInnerHTML={{
      __html: `Height: ${dimensions.height.toFixed(
        2
      )} m<br/>Width: ${dimensions.width.toFixed(2)} m`,
    }}
  />
</div>

  </div>
</div>

  );
};

export default CanvasApp;
