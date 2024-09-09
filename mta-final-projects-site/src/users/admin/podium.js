import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { backendURL } from '../../config';
import { convertWixImageUrl } from '../../utils/Utils';
import confetti from 'canvas-confetti'; // Confetti library
import AdminButtons from './AdminButtons';

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
  backgroundColor: '#f0f8ff';
`;

const CategorySelector = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap on small screens */
  justify-content: center;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button`
  background-color: #175a94;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9em;

  &:hover {
    background-color: #0e3f6d;
  }
`;

const OverallButton = styled(CategoryButton)`
  background-color: #6A9C89;

  &:hover {
    background-color: #08af6d;
  }
`;

const PodiumList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 40px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PodiumPlace = styled.div`
  margin: 0 20px;
  text-align: center;
  animation: ${jumpAnimation} 1s ease;
  position: absolute;
  z-index: 1;

  ${({ place }) =>
    place === 1
      ? `
          left: 49%;
          top: 40px;
          transform: translate(-50%, -25px);
        `
      : place === 2
      ? `
          left: calc(50% - 280px);
          top: 90px;
          transform: translateY(-25px);
        `
      : place === 3
      ? `
          left: calc(50% + 90px);
          top: 100px;
          transform: translateY(-25px);
        `
      : ''}

  &:hover {
    animation: ${jumpAnimation} 0.5s ease;
  }

  @media (max-width: 768px) {
    position: static;
    transform: none;
    margin-bottom: 30px;
  }
`;

const PodiumImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    animation: ${jumpAnimation} 0.5s ease;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const PodiumTitle = styled.h3`
  color: #175a94;
  font-size: 1.2em;

  @media (max-width: 480px) {
    font-size: 1em;
  }
`;

const PodiumScore = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  color: #0e3f6d;

  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

const PodiumBase = styled.img`
  position: absolute;
  margin-top: 600px;
  bottom: -550px;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  z-index: 0;

  @media (max-width: 768px) {
    position: static;
    margin-top: 20px;
    width: 70%;
  }
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
        setPodiumData(response.data);
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

  // Helper function to capitalize category name
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
            <PodiumTitle>
              {index + 1} - {project.title}
            </PodiumTitle>
            <PodiumScore>
              {category === 'topOverallProjects'
                ? `${project.avgTotal} / 50`
                : `${project[`avg${capitalize(category.replace('top', ''))}`]} / 10`}
            </PodiumScore>
          </PodiumPlace>
        ))}
        {/* Podium base image */}
        <PodiumBase src={`${process.env.PUBLIC_URL}/podium.png`} alt="Podium" />
      </PodiumList>
    );
  };

  return (
    <PodiumContainer>
      <h1>Project Podium</h1>
      <CategorySelector>
        <OverallButton onClick={() => handleCategoryChange('topOverallProjects')}>Overall</OverallButton>
        <CategoryButton onClick={() => handleCategoryChange('topComplexity')}>Complexity</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topUsability')}>Usability</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topInnovation')}>Innovation</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topPresentation')}>Presentation</CategoryButton>
        <CategoryButton onClick={() => handleCategoryChange('topProficiency')}>Proficiency</CategoryButton>
      </CategorySelector>

      {/* Render the podium */}
      {renderPodium(selectedCategory)}
    <AdminButtons />
    </PodiumContainer>
  );
};

export default Podium;
