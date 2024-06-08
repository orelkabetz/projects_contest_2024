// Carousel.js

import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Carousel.css';

const CustomCarousel = ({ projects }) => {
    // Function to render project attributes dynamically
    const renderProjectAttributes = (project) => {
        return Object.entries(project).map(([key, value]) => (
            <p key={key}>
                <strong>{key}:</strong> {value}
            </p>
        ));
    };

    return (
        <Carousel
            swipeable={true}
            draggable={true}
            showDots={true}
            responsive={{
                superLargeDesktop: {
                    breakpoint: { max: 4000, min: 3000 },
                    items: 1
                },
                desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 1
                },
                tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 1
                },
                mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1
                }
            }}
            arrows={true} // Show arrows
        >
            {projects.map((project, index) => (
                <div key={index}>
                    {renderProjectAttributes(project)}
                </div>
            ))}
        </Carousel>
    );
};

export default CustomCarousel;
