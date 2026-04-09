import React, { useRef, useEffect, useState } from 'react';
import './ScrollingText.css';

const ScrollingText = ({ children, speed = 60, className = '' }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [repeats, setRepeats] = useState(1);
    const [duration, setDuration] = useState(10); // default 10 seconds empty

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        // Measure container and text width
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.offsetWidth || 1;

        // Calculate how many times the text must repeat to stretch past the screen
        const repeatsNeeded = Math.ceil(containerWidth / textWidth) + 1;
        setRepeats(repeatsNeeded);

        // Dynamically set animation duration based on total block length! 
        // This ensures the custom 'speed' stays consistent for short vs long text.
        const blockWidth = textWidth * repeatsNeeded;
        setDuration(blockWidth / speed);
        
    }, [children, speed]);

    const repeatArray = new Array(repeats).fill(0);

    return (
        <span className={`scrolling-container ${className}`} ref={containerRef}>
            <div className="scrolling-wrapper" style={{ animationDuration: `${duration}s` }}>
                {/* Block 1: The original filled sequence */}
                <div className="scrolling-block">
                    {repeatArray.map((_, i) => (
                        <span key={`b1-${i}`} className="scrolling-text" ref={i === 0 ? textRef : null}>
                            {children}
                        </span>
                    ))}
                </div>
                {/* Block 2: Exact duplicate for the seamless infinite loop! */}
                <div className="scrolling-block" aria-hidden="true">
                    {repeatArray.map((_, i) => (
                        <span key={`b2-${i}`} className="scrolling-text">
                            {children}
                        </span>
                    ))}
                </div>
            </div>
        </span>
    );
};

export default ScrollingText;
