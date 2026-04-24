const video = document.getElementById('bg-video');
const feedbackOverlay = document.getElementById('feedback-overlay');

// Hidden canvas to analyze video frames for motion tracking
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
canvas.width = 64;  // Low resolution for fast frame differencing
canvas.height = 64;

let prevFrameData = null;

// The centroid of detected motion
let motionX = 0.5;
let motionY = 0.5;

// The target coordinates we are interpolating towards
let targetX = 0.5;
let targetY = 0.5;

let activeZone = null;
let activationTimer = null;
let idleTimer = 0;

// Force play for strict browsers
video.play().catch(e => console.log("Video autoplay needs permission", e));

function renderLoop() {
    if (video.readyState >= video.HAVE_CURRENT_DATA && !video.paused) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frameData.data;
        
        if (prevFrameData) {
            let motionCount = 0;
            let sumX = 0;
            let sumY = 0;
            
            // Perform fast frame differencing to find moving pixels
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i+1];
                const b = data[i+2];
                // Calculate luminance
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                
                const pr = prevFrameData[i];
                const pg = prevFrameData[i+1];
                const pb = prevFrameData[i+2];
                const plum = 0.299 * pr + 0.587 * pg + 0.114 * pb;
                
                // Absolute difference threshold for noise reduction
                if (Math.abs(lum - plum) > 25) {
                    const pixelIndex = i / 4;
                    const x = pixelIndex % canvas.width;
                    const y = Math.floor(pixelIndex / canvas.width);
                    sumX += x;
                    sumY += y;
                    motionCount++;
                }
            }
            
            // If enough meaningful motion is detected
            if (motionCount > 15) {
                targetX = (sumX / motionCount) / canvas.width;
                targetY = (sumY / motionCount) / canvas.height;
                idleTimer = 0;
            } else {
                // Idle State: If no meaningful motion, naturally drift to center
                idleTimer++;
                if (idleTimer > 60) { // ~1 second of stillness
                    targetX = 0.5;
                    targetY = 0.5;
                }
            }
        }
        
        // Save frame for next loop
        prevFrameData = new Uint8ClampedArray(data);
    }
    
    // Smooth interpolation (no jitter or snapping)
    motionX += (targetX - motionX) * 0.08;
    motionY += (targetY - motionY) * 0.08;
    
    checkZones(motionX, motionY);
    
    requestAnimationFrame(renderLoop);
}

function checkZones(x, y) {
    let newZone = null;
    
    // Define the 4 navigation zones based on motion centroid
    if (x < 0.25) newZone = 'left';        // Home
    else if (x > 0.75) newZone = 'right';  // Work
    else if (y < 0.25) newZone = 'top';    // About
    else if (y > 0.75) newZone = 'bottom'; // Contact
    
    if (newZone !== activeZone) {
        // Clear any pending activations if the hand leaves the zone
        if (activationTimer) {
            clearTimeout(activationTimer);
            activationTimer = null;
        }
        
        // Reset visible state
        feedbackOverlay.className = '';
        
        if (newZone) {
            // Soft directional glow near screen edges on approach
            feedbackOverlay.classList.add(`hover-${newZone}`);
            
            // Small delay (~200ms) before confirming selection
            activationTimer = setTimeout(() => {
                activateZone(newZone);
            }, 250);
        }
        
        activeZone = newZone;
    }
}

function activateZone(zone) {
    // Remove hover glow to trigger the pulse
    feedbackOverlay.classList.remove(`hover-${zone}`);
    
    // Force a CSS reflow to ensure the pulse animation fires
    void feedbackOverlay.offsetWidth;
    
    feedbackOverlay.classList.add(`active-${zone}`);
    
    // Gentle luminance shift in the entire scene
    document.body.classList.add('luminance-shift');
    setTimeout(() => {
        document.body.classList.remove('luminance-shift');
    }, 1200);
    
    // Console log the "navigation" since we have zero UI
    console.log(`Navigated to: ${zone.toUpperCase()}`);
}

// Start analyzing the video loop
requestAnimationFrame(renderLoop);
