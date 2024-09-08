import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { backendURL } from '../../config'; // Assuming your config file has the backend URL
import { convertWixImageUrl } from '../../utils/Utils';
import confetti from 'canvas-confetti'; // Confetti library

// Jump animation for the project images
const jumpAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
`;

// Styled components for podium display
const PodiumContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const CategorySelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button`
  background-color: #175a94;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  margin: 0 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0e3f6d;
  }
`;

const PodiumList = styled.div`
  display: flex;
  justify-content: space-between; /* Ensure correct placement */
  align-items: flex-end; /* Aligns items at the bottom */
  margin-top: 40px;
  position: relative;
  z-index: 1;
`;

const PodiumPlace = styled.div`
  margin: 0 20px;
  text-align: center;
  animation: ${jumpAnimation} 1s ease;
  position: absolute;
  z-index: 1;
  
  /* Adjust the positions for first, second, and third place */
  ${({ place }) =>
    place === 1
      ? `
        left: 49%;
        top: 40px; /* 25px above the podium base */
        transform: translate(-50%, -25px); /* Centered horizontally and adjusted vertically */
      `
      : place === 2
      ? `
        left: calc(50% - 280px); /* 25px to the left */
        top: 90px; /* 25px above the podium base */
        transform: translateY(-25px);
      `
      : place === 3
      ? `
        left: calc(50% + 90px); /* 25px to the right */
        top: 100px; /* 25px above the podium base */
        transform: translateY(-25px);
      `
      : ''}
`;

const PodiumImage = styled.img`
  left: 50%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  &:hover {
    animation: ${jumpAnimation} 0.5s ease;
  }
`;

const PodiumTitle = styled.h3`
  color: #175a94;
`;

const PodiumScore = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  color: #0e3f6d;
`;

const PodiumBase = styled.img`
  position: absolute;
  margin-top: 600px;
  bottom: -550px; /* Adjusted the podium image to be 250px lower */
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  z-index: 0; /* Ensure it's behind the podium places */
`;



// Confetti function to trigger on hover
const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

// Podium component
const Podium = () => {
  const [podiumData, setPodiumData] = useState({
    overall: [],
    complexity: [],
    usability: [],
    innovation: [],
    presentation: [],
    proficiency: [],
  });

  const [selectedCategory, setSelectedCategory] = useState('topOverallProjects');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch podium data from the backend
    const fetchPodiumData = async () => {
      try {
        const response = await axios.get(`${backendURL}/admin/podium`);
        setPodiumData(response.data); // Assuming data comes in the correct format
        setLoading(false);
      } catch (error) {
        console.error('Error fetching podium data:', error);
        setLoading(false);
      }
    };

    fetchPodiumData();
  }, []);

  if (loading) {
    return <p>Loading podium...</p>;
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Render podium for the selected category
  const renderPodium = (category) => {
    const top3 = podiumData[category];
    if (!top3 || top3.length === 0) {
      return <p>No data available for this category</p>;
    }

    return (
      <PodiumList>
        {top3.map((project, index) => (
          <PodiumPlace key={index} place={index + 1} onMouseEnter={triggerConfetti}>
            <PodiumImage src={convertWixImageUrl(project.image)} alt={project.title} />
            <PodiumTitle>{index + 1} - {project.title}</PodiumTitle> {/* Adding place before title */}
            <PodiumScore>
              {category === 'topOverallProjects'
                ? `${project.avgTotal} / 50` // Show total score for overall
                : `${project[`avg${capitalize(category.replace('top', ''))}`]} / 10`} {/* Show category-specific score */}
            </PodiumScore>
          </PodiumPlace>
        ))}
        {/* Podium base image */}
        <PodiumBase src={`${process.env.PUBLIC_URL}/podium.png`} alt="Podium" />
      </PodiumList>
    );
  };

  // Helper function to capitalize category name
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <PodiumContainer>
      <h1>Project Podium</h1>
      <CategorySelector>
        <CategoryButton onClick={() => handleCategoryChange('topOverallProjects')}>Overall</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topComplexity')}>Complexity</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topUsability')}>Usability</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topInnovation')}>Innovation</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topPresentation')}>Presentation</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topProficiency')}>Proficiency</CategoryButton>
      </CategorySelector>

      {/* Render the podium */}
      {renderPodium(selectedCategory)}
    </PodiumContainer>
  );
};

export default Podium;
