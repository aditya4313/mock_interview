
"use client"

import React, { useState } from 'react';

function Page() {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle = {
    border: '2px solid #4CAF50', // Green border
    borderRadius: '10px', // Rounded corners
    padding: '20px', // Space inside the border
    backgroundColor: '#e0f7fa', // Light blue background
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
    transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Scale effect on hover
    transition: 'transform 0.3s ease', // Smooth transition
    maxWidth: '600px', // Max width of the container
  };

  const headingStyle = {
    textAlign: 'center', // Center the heading
    color: '#00796b', // Dark teal color
    fontFamily: 'Arial, sans-serif', // Font family
    fontSize: '24px', // Font size
    marginBottom: '20px', // Space below the heading
  };

  const listStyle = {
    listStyleType: 'decimal', // Ordered list with numbers
    paddingLeft: '20px', // Indent the list
    fontFamily: 'Arial, sans-serif', // Font family
    fontSize: '18px', // Font size
    color: '#004d40', // Darker teal color for text
  };

  const listItemStyle = {
    margin: '10px 0', // Space between list items
    transition: 'color 0.3s ease', // Smooth color transition
  };

  const strongStyle = {
    color: '#000', // Black color for important text
    fontWeight: 'bold', // Bold text
  };

  return (
    <div className='flex justify-center mt-10 justify-items-center'>
      <div
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1 style={headingStyle}>How It Works</h1>
        <ol style={listStyle}>
          <li style={listItemStyle}>
            <strong style={strongStyle}>Login:</strong> Securely log in to access the platform.
          </li>
          <li style={listItemStyle}>
            <strong style={strongStyle}>Start the Interview:</strong> Open the webcam and sit in front of the camera.
          </li>
          <li style={listItemStyle}>
            <strong style={strongStyle}>Answer Questions:</strong> Questions will be displayed one by one on the screen.
          </li>
          <li style={listItemStyle}>
            <strong style={strongStyle}>Respond:</strong> Answer each question verbally; the system will record your responses.
          </li>
          <li style={listItemStyle}>
            <strong style={strongStyle}>Evaluation:</strong> The AI will evaluate your answers, providing ratings and feedback.
          </li>
          <li style={listItemStyle}>
            <strong style={strongStyle}>Review:</strong> Access your stored data and review your performance anytime.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Page;
