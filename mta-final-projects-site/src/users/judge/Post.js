import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGithub } from 'react-icons/fa'; // Import GitHub icon from react-icons

const PostContainer = styled.div`
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
    width: 100%;
    height: auto;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const ExpandableInfo = styled.div`
    margin-top: 10px;
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

const Post = ({ project }) => {
    const [isInfoExpanded, setIsInfoExpanded] = useState(false);

    // Convert Wix image URL to standard HTTPS URL
    const convertWixImageUrl = (url) => {
        if (url && url.startsWith('wix:image://')) {
            const wixUrl = url.replace('wix:image://v1/', '');
            const parts = wixUrl.split('~');
            if (parts.length > 1) {
                const imageUrl = parts[0];
                const imageNameAndSuffix = parts[1].split('/');
                if (imageNameAndSuffix.length > 1) {
                    const suffix = imageNameAndSuffix[0].split('.')[1]; // Extract the file extension
                    return `https://static.wixstatic.com/media/${imageUrl}~mv2.${suffix}`;
                }
            }
        }
        return url || 'https://via.placeholder.com/150'; // Placeholder URL in case of error
    };

    const imageUrl = convertWixImageUrl(project.ProjectImage);

    return (
        <PostContainer>
            <Title>{project.Title}</Title>

            <Image 
                src={imageUrl} 
                alt={project.Title} 
                style={{ 
                    width: '50%', 
                    height: 'auto', 
                    borderRadius: '8px', 
                    marginBottom: '16px' 
                }} 
            />
            <Content><strong>שם הסדנה:</strong> {project.WorkshopName}</Content>
            <Content><strong>מספר הסדנה:</strong> {project.WorkshopId}</Content>
            <Content><strong>סטודנטים:</strong> {project.ProjectOwners}</Content>
            <Content><strong>שנה:</strong> {project.ProjectYear}</Content>
            <Content><strong>שם המנחה:</strong> {project.Lecturer}</Content>
            <Content><strong>טלפון:</strong> {project.StudentPhone}</Content>
            <Content><strong>Email:</strong> {project.StudentEmail}</Content>

            
            {/* Expandable Info Section */}
            <ExpandableInfo>
                <button onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
                    {isInfoExpanded ? 'Hide Info' : 'Show Info'}
                </button>
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
        </PostContainer>
    );
};

export default Post;
