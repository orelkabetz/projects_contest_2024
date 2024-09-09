import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGithub, FaStar } from 'react-icons/fa'; // Import GitHub and Star icons
import { MdGrading } from "react-icons/md";
import { convertWixImageUrl } from './Utils'

const PostContainer = styled.div`
    position: relative;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    background-color: #F5F5F5;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.15);
    }
`;

const Title = styled.h2`
    margin: 0 0 10px;
    font-size: 24px;
    color: #333;
`;

const Content = styled.p`
    margin: 0 0 10px;
    font-size: 16px;
    color: #555;
`;

const Image = styled.img`
    width: 50%; /* Reduced the image size by 50% */
    height: auto;
    border-radius: 8px;
    margin-bottom: 16px;
`;

const ExpandableInfo = styled.div`
    margin-top: 10px;
`;

const ShowInfoButton = styled.button`
    padding: 10px 20px;
    background-color: #175a94; /* Match the GradeButton color */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 10px;

    &:hover {
        background-color: #0e3f6d; /* Darker color on hover */
    }
`;

const GithubLink = styled.a`
    display: inline-flex;
    align-items: center;
    color: #333;
    text-decoration: none;
    margin-top: 10px;

    &:hover {
        color: #000;
    }

    svg {
        margin-right: 8px;
    }
`;

const GradeButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background-color: #175a94;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
    
    &:hover {
        background-color: #0e3f6d;
        transform: scale(1.1);
    }

    &:hover::after {
        content: 'Click to grade the project';
        position: absolute;
        top: -40px;
        right: 0;
        background-color: #333;
        color: #fff;
        padding: 5px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0.9;
    }

    svg {
        margin: 0;
    }
`;

const Post = ({ project, onGrade, showGradeButton }) => {
    const [isInfoExpanded, setIsInfoExpanded] = useState(false);

    const imageUrl = convertWixImageUrl(project.ProjectImage);

    return (
        <PostContainer>
            <Title>{project.Title}</Title>

            <Image 
                src={imageUrl} 
                alt={project.Title} 
            />
            <Content><strong>Workshop Name:</strong> {project.WorkshopName}</Content>
            <Content><strong>Workshop ID:</strong> {project.WorkshopId}</Content>
            <Content><strong>Project ID:</strong> {project.ProjectNumber}</Content>
            <Content><strong>Project Owners:</strong> {project.ProjectOwners}</Content>
            <Content><strong>Year:</strong> {project.ProjectYear}</Content>
            <Content><strong>Lecturer:</strong> {project.Lecturer}</Content>
            <Content><strong>Phone:</strong> {project.StudentPhone}</Content>
            <Content><strong>Email:</strong> {project.StudentEmail}</Content>

            {/* Expandable Info Section */}
            <ExpandableInfo>
                <ShowInfoButton onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
                    {isInfoExpanded ? 'Hide Info' : 'Show Info'}
                </ShowInfoButton>
                {isInfoExpanded && (
                    <div>
                        <Content><strong>Info:</strong> {project.ProjectInfo}</Content>
                    </div>
                )}
            </ExpandableInfo>

            {/* GitHub Link */}
            {project.GitHubLink && (
                <GithubLink href={project.GitHubLink} target="_blank">
                    <FaGithub size={20} />
                    View on GitHub
                </GithubLink>
            )}

            {/* Conditionally render Grade Button */}
            {showGradeButton && (
                <GradeButton onClick={onGrade}>
                    <MdGrading size={28} />
                </GradeButton>
            )}
        </PostContainer>
    );
};

export default Post;
