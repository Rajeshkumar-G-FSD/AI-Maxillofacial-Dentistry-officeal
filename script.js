document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("hero-canvas");
    const context = canvas.getContext("2d");
    
    const frameCount = 240;
    // Format the index to match the ezgif-frame-001.jpg format
    const currentFrame = index => (
        `ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
    );

    const images = [];
    let loadedImages = 0;

    // Set initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Preload all 240 images
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
        
        img.onload = () => {
            loadedImages++;
            // When the first image loads, draw it immediately as the initial state
            if (i === 1) {
                renderImage(img);
            }
        };
    }

    function renderImage(img) {
        // Calculate scale to "contain" the image within the canvas bounds while preserving aspect ratio
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio);
        
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        // Clear previous frame
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw new frame
        context.drawImage(
            img, 
            0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
        );
    }

    // Handle window resizing
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Force a re-render of the current frame on resize
        triggerScrollUpdate();
    });

    // Handle scrolling
    let ticking = false;
    
    function triggerScrollUpdate() {
        const scrollContainer = document.querySelector('.scroll-container');
        
        // Calculate scroll position relative to the scroll container's top
        const scrollContainerTop = scrollContainer.offsetTop;
        const scrollTop = window.scrollY - scrollContainerTop;
        
        // The maximum amount we can scroll before leaving the sticky area
        const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
        
        let scrollFraction = scrollTop / maxScroll;
        
        // Clamp between 0 and 1
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));
        
        // Map the scroll fraction (0 to 1) to a frame index (0 to 239)
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );
        
        if (images[frameIndex] && images[frameIndex].complete) {
            renderImage(images[frameIndex]);
        }
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                triggerScrollUpdate();
                ticking = false;
            });
            ticking = true;
        }
    });
});
