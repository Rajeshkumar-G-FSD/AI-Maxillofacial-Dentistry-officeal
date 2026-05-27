import React, { useEffect, useRef, useState } from 'react';
import './HeroScrollytelling.css';

const HeroScrollytelling = () => {
  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const frameCount = 240;
  const imagesRef = useRef([]);

  const currentFrame = (index) => (
    `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let loadedCount = 0;
    
    // Preload images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      imagesRef.current.push(img);
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          // Draw first frame immediately
          renderImage(img, context, canvas);
        }
        if (loadedCount === frameCount) {
          setImagesLoaded(true);
        }
      };
    }

    const renderImage = (img, ctx, cvs) => {
      const hRatio = cvs.width / img.width;
      const vRatio = cvs.height / img.height;
      const ratio = Math.max(hRatio, vRatio); // Use max to cover the screen like background-size: cover
      
      const centerShift_x = (cvs.width - img.width * ratio) / 2;
      const centerShift_y = (cvs.height - img.height * ratio) / 2;
      
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(
        img, 
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      triggerScrollUpdate();
    };

    let ticking = false;

    const triggerScrollUpdate = () => {
      if (!scrollContainerRef.current) return;
      
      const scrollContainer = scrollContainerRef.current;
      const scrollContainerTop = scrollContainer.offsetTop;
      const scrollTop = window.scrollY - scrollContainerTop;
      
      // We only want to animate within the container's height
      const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
      
      if (maxScroll <= 0) return;

      let scrollFraction = scrollTop / maxScroll;
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));
      
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      
      const img = imagesRef.current[frameIndex];
      if (img && img.complete) {
        renderImage(img, context, canvas);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          triggerScrollUpdate();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="hero-scroll-container" ref={scrollContainerRef}>
      <div className="hero-sticky-section">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-content">
          <div className="container">
            <h1>Creating beautiful smiles</h1>
            <p>Our dental clinic provides premium services across the country. Let us take care of your beautiful smile.</p>
            <button className="btn btn-outline btn-hero">
              OUR SERVICES <span className="icon">↓</span>
            </button>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <span className="mouse"></span>
        </div>
      </div>
    </div>
  );
};

export default HeroScrollytelling;
