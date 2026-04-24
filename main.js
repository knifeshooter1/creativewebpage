const video = document.getElementById('bg-video');
const sections = document.querySelectorAll('.step');

// We will use requestAnimationFrame to smoothly interpolate the video's current time
let scrollFraction = 0;
let targetTime = 0;
let currentTime = 0;
let isLoaded = false;

// Wait for video metadata so we know the duration
video.addEventListener('loadedmetadata', () => {
    isLoaded = true;
});

// Calculate how far down the user has scrolled (0.0 to 1.0)
window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
        scrollFraction = window.scrollY / maxScroll;
    }
});

// Animation loop to smoothly update the video playback frame
function renderLoop() {
    if (isLoaded && video.duration) {
        // Calculate the target time in the video based on scroll
        targetTime = scrollFraction * video.duration;
        
        // Linear interpolation (lerp) for smooth scrubbing
        // The 0.08 factor determines the "smoothness" (lower is smoother/slower, higher is snappier)
        currentTime += (targetTime - currentTime) * 0.08;
        
        // Update video
        video.currentTime = currentTime;
    }
    
    // Add simple fade effects for sections based on their position in the viewport
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const sectionCenter = rect.top + rect.height / 2;
        
        // Distance from center of screen
        const dist = Math.abs(viewportCenter - sectionCenter);
        const maxDist = window.innerHeight / 1.5;
        
        // Calculate opacity based on distance
        let opacity = 1 - (dist / maxDist);
        if (opacity < 0) opacity = 0;
        
        section.style.opacity = opacity;
        section.style.transform = `translateY(${dist * 0.05}px)`;
    });

    requestAnimationFrame(renderLoop);
}

// Start the loop
requestAnimationFrame(renderLoop);
