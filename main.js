// ===== THREE.JS SCENE =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 14);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ===== LIGHTS =====
scene.add(new THREE.AmbientLight(0x0a0a2e, 0.4));
const mainLight = new THREE.PointLight(0x00f0ff, 2.5, 60);
mainLight.position.set(3, 8, 6);
scene.add(mainLight);
const purpleLight = new THREE.PointLight(0x8b00ff, 2, 50);
purpleLight.position.set(-8, 4, -5);
scene.add(purpleLight);
const rimLight = new THREE.PointLight(0x0066ff, 1.2, 35);
rimLight.position.set(0, -1, 10);
scene.add(rimLight);
const backGlow = new THREE.PointLight(0x4400aa, 1.5, 40);
backGlow.position.set(0, 3, -10);
scene.add(backGlow);

// ===== REFLECTIVE FLOOR =====
const floorGeo = new THREE.PlaneGeometry(80, 80);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x020108, metalness: 0.97, roughness: 0.1 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.5;
scene.add(floor);

// ===== ROOM WALLS (subtle) =====
const wallMat = new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.5, roughness: 0.8, transparent: true, opacity: 0.6 });
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), wallMat);
backWall.position.set(0, 4, -10);
scene.add(backWall);
const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 15), wallMat);
leftWall.position.set(-12, 4, 0);
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

// ===== COSMIC WINDOW (VORTEX) =====
const windowFrame = new THREE.Group();
const frameMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1a, metalness: 0.9, roughness: 0.2, emissive: 0x050520, emissiveIntensity: 0.3 });
const topBar = new THREE.Mesh(new THREE.BoxGeometry(12, 0.25, 0.3), frameMat);
topBar.position.set(0, 6, -9.8);
const botBar = topBar.clone(); botBar.position.y = -1.5;
const leftBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 7.75, 0.3), frameMat);
leftBar2.position.set(-6, 2.25, -9.8);
const rightBar2 = leftBar2.clone(); rightBar2.position.x = 6;
const midBarV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 7.75, 0.3), frameMat);
midBarV.position.set(0, 2.25, -9.8);
windowFrame.add(topBar, botBar, leftBar2, rightBar2, midBarV);
scene.add(windowFrame);

// Vortex nebula (dense spiral particle cloud)
const vortexCount = 5000;
const vortexGeo = new THREE.BufferGeometry();
const vortexPos = new Float32Array(vortexCount * 3);
const vortexCol = new Float32Array(vortexCount * 3);
const vortexSizes = new Float32Array(vortexCount);
for (let i = 0; i < vortexCount; i++) {
    const angle = (i / vortexCount) * Math.PI * 16;
    const radius = 0.2 + (i / vortexCount) * 8;
    const jitter = Math.pow(i / vortexCount, 0.5) * 2;
    vortexPos[i*3] = Math.cos(angle) * radius + (Math.random()-0.5)*jitter;
    vortexPos[i*3+1] = 2.5 + Math.sin(angle) * radius * 0.4 + (Math.random()-0.5)*jitter;
    vortexPos[i*3+2] = -14 - Math.random() * 12;
    const t = i / vortexCount;
    // Blue core → purple edge
    vortexCol[i*3] = 0.05 + t * 0.4;   // R
    vortexCol[i*3+1] = 0.2 + (1-t) * 0.7; // G
    vortexCol[i*3+2] = 0.7 + t * 0.3;     // B
    vortexSizes[i] = 0.04 + Math.random() * 0.1;
}
vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPos, 3));
vortexGeo.setAttribute('color', new THREE.BufferAttribute(vortexCol, 3));
const vortexMat = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
const vortex = new THREE.Points(vortexGeo, vortexMat);
scene.add(vortex);

// Extra nebula glow layers
for (let layer = 0; layer < 2; layer++) {
    const lCount = 1500;
    const lGeo = new THREE.BufferGeometry();
    const lPos = new Float32Array(lCount * 3);
    const lCol = new Float32Array(lCount * 3);
    for (let i = 0; i < lCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 1 + Math.random() * 7;
        lPos[i*3] = Math.cos(a) * r + (Math.random()-0.5)*3;
        lPos[i*3+1] = 2.5 + Math.sin(a) * r * 0.3 + (Math.random()-0.5)*2;
        lPos[i*3+2] = -16 - layer*5 - Math.random()*6;
        lCol[i*3] = layer === 0 ? 0.3 : 0.5;
        lCol[i*3+1] = layer === 0 ? 0.1 : 0.0;
        lCol[i*3+2] = layer === 0 ? 0.8 : 0.9;
    }
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
    lGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
    const lMat = new THREE.PointsMaterial({ size: 0.15 + layer*0.1, vertexColors: true, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false });
    scene.add(new THREE.Points(lGeo, lMat));
}

// ===== HUMANOID FIGURE (Sitting, knees hugged) =====
const humanGroup = new THREE.Group();
humanGroup.position.set(-1.5, -2.5, 3);
scene.add(humanGroup);

function createBodyPart(shape, scale, pos, particleCount) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        let x, y, z;
        if (shape === 'sphere') {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2*Math.random()-1);
            const r = Math.cbrt(Math.random());
            x = r * Math.sin(phi) * Math.cos(theta) * scale[0];
            y = r * Math.sin(phi) * Math.sin(theta) * scale[1];
            z = r * Math.cos(phi) * scale[2];
        } else if (shape === 'cylinder') {
            const a = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * scale[0];
            x = Math.cos(a) * r;
            y = (Math.random()-0.5) * scale[1];
            z = Math.sin(a) * r * (scale[2]/scale[0]);
        } else {
            x = (Math.random()-0.5) * scale[0];
            y = (Math.random()-0.5) * scale[1];
            z = (Math.random()-0.5) * scale[2];
        }
        positions[i*3] = x + pos[0];
        positions[i*3+1] = y + pos[1];
        positions[i*3+2] = z + pos[2];
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
}

const humanMat = new THREE.PointsMaterial({
    color: 0x00d4ff, size: 0.05, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false
});
const humanMatDim = new THREE.PointsMaterial({
    color: 0x0088cc, size: 0.04, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false
});

// Sitting figure: head, neck, torso, upper-arms wrapping knees, thighs (horizontal), shins (vertical)
const head = new THREE.Points(createBodyPart('sphere', [0.32,0.38,0.3], [0,3.2,0], 500), humanMat);
const neck = new THREE.Points(createBodyPart('cylinder', [0.1,0.2,0.1], [0,2.95,0], 100), humanMatDim);
const torso = new THREE.Points(createBodyPart('box', [0.65,1.0,0.35], [0,2.3,0], 700), humanMat);
// Thighs go forward (horizontal)
const thighL = new THREE.Points(createBodyPart('cylinder', [0.15,0.7,0.15], [0.2,1.7,0.35], 200), humanMatDim);
const thighR = new THREE.Points(createBodyPart('cylinder', [0.15,0.7,0.15], [-0.2,1.7,0.35], 200), humanMatDim);
// Shins come up vertically (knees hugged)
const shinL = new THREE.Points(createBodyPart('cylinder', [0.12,0.65,0.12], [0.2,2.1,0.7], 180), humanMatDim);
const shinR = new THREE.Points(createBodyPart('cylinder', [0.12,0.65,0.12], [-0.2,2.1,0.7], 180), humanMatDim);
// Arms wrapping around knees
const armL = new THREE.Points(createBodyPart('cylinder', [0.1,0.6,0.1], [0.35,2.1,0.5], 150), humanMatDim);
const armR = new THREE.Points(createBodyPart('cylinder', [0.1,0.6,0.1], [-0.35,2.1,0.5], 150), humanMatDim);
// Front arm bridge (hands clasped around knees)
const hands = new THREE.Points(createBodyPart('sphere', [0.3,0.15,0.15], [0,2.0,0.8], 120), humanMat);

humanGroup.add(head, neck, torso, thighL, thighR, shinL, shinR, armL, armR, hands);

// Dissolving dust trail from back
const dustCount = 2000;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);
const dustVel = [];
for (let i = 0; i < dustCount; i++) {
    dustPos[i*3] = (Math.random()-0.5)*0.6;
    dustPos[i*3+1] = 1.8 + Math.random()*1.8;
    dustPos[i*3+2] = -0.3 - Math.random()*5;
    dustVel.push({ 
        x: (Math.random()-0.5)*0.008, 
        y: (Math.random()-0.5)*0.004 + 0.002, 
        z: -0.008 - Math.random()*0.02 
    });
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dustMat = new THREE.PointsMaterial({ color: 0x3366ee, size: 0.035, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
const dustCloud = new THREE.Points(dustGeo, dustMat);
humanGroup.add(dustCloud);

// ===== WORKSPACE (Desk + Monitor) =====
const deskMat = new THREE.MeshStandardMaterial({ color: 0x0c0c18, metalness: 0.7, roughness: 0.4 });
const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 1.6), deskMat);
deskTop.position.set(5, -0.5, -3);
scene.add(deskTop);
const legGeo = new THREE.BoxGeometry(0.08, 2, 0.08);
[[-1.6,-1,-0.7],[1.6,-1,-0.7],[-1.6,-1,0.7],[1.6,-1,0.7]].forEach(p => {
    const leg = new THREE.Mesh(legGeo, deskMat);
    leg.position.set(5+p[0], -0.5+p[1], -3+p[2]);
    scene.add(leg);
});

// Monitor
const monitorMat = new THREE.MeshStandardMaterial({ color: 0x080810, metalness: 0.9, roughness: 0.2 });
const monitor = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.05), monitorMat);
monitor.position.set(5, 0.6, -3.6);
scene.add(monitor);
// Screen with green code glow
const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ff44 });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), screenMat);
screen.position.set(5, 0.6, -3.57);
scene.add(screen);
// Monitor stand
const stand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), monitorMat);
stand.position.set(5, -0.1, -3.6);
scene.add(stand);

// ===== BEANBAG CHAIR =====
const chairGeo = new THREE.SphereGeometry(0.8, 16, 12, 0, Math.PI*2, 0, Math.PI*0.55);
const chairMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1e, roughness: 0.95, metalness: 0.1 });
const chair = new THREE.Mesh(chairGeo, chairMat);
chair.position.set(4, -2.1, -1.5);
chair.scale.set(1.1, 0.5, 1);
scene.add(chair);

// ===== HOLOGRAPHIC PROJECTOR =====
const projBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.25, 0.12, 8),
    new THREE.MeshStandardMaterial({ color: 0x111128, metalness: 0.95, roughness: 0.1, emissive: 0x001133, emissiveIntensity: 0.5 })
);
projBase.position.set(5.8, -0.42, -2.5);
scene.add(projBase);

// Hologram astronaut
const holoCount = 600;
const holoGeo = new THREE.BufferGeometry();
const holoPos = new Float32Array(holoCount * 3);
for (let i = 0; i < holoCount; i++) {
    const t = i / holoCount;
    if (t > 0.85) { // helmet sphere
        const a = Math.random()*Math.PI*2;
        const p2 = Math.acos(2*Math.random()-1);
        holoPos[i*3] = Math.sin(p2)*Math.cos(a)*0.18;
        holoPos[i*3+1] = t * 1.4 + Math.sin(p2)*Math.sin(a)*0.18;
        holoPos[i*3+2] = Math.cos(p2)*0.18;
    } else if (t > 0.5) { // torso
        holoPos[i*3] = (Math.random()-0.5)*0.28;
        holoPos[i*3+1] = t * 1.4;
        holoPos[i*3+2] = (Math.random()-0.5)*0.2;
    } else { // legs
        holoPos[i*3] = (Math.random()-0.5)*0.22;
        holoPos[i*3+1] = t * 1.4;
        holoPos[i*3+2] = (Math.random()-0.5)*0.18;
    }
}
holoGeo.setAttribute('position', new THREE.BufferAttribute(holoPos, 3));
const holoMat = new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.025, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false });
const hologram = new THREE.Points(holoGeo, holoMat);
hologram.position.set(5.8, -0.35, -2.5);
scene.add(hologram);

// Hologram beam cone
const beamGeo = new THREE.ConeGeometry(0.5, 1.5, 16, 1, true);
const beamMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.035, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
const beam = new THREE.Mesh(beamGeo, beamMat);
beam.position.set(5.8, 0.35, -2.5);
scene.add(beam);

// ===== AMBIENT STAR FIELD =====
const starCount = 3000;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    starPos[i*3] = (Math.random()-0.5)*120;
    starPos[i*3+1] = (Math.random()-0.5)*70;
    starPos[i*3+2] = -15 - Math.random()*100;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.5 });
scene.add(new THREE.Points(starGeo, starMat));

// Bright stars (few larger ones)
const brightCount = 100;
const brightGeo = new THREE.BufferGeometry();
const brightPos = new Float32Array(brightCount * 3);
for (let i = 0; i < brightCount; i++) {
    brightPos[i*3] = (Math.random()-0.5)*80;
    brightPos[i*3+1] = (Math.random()-0.5)*50;
    brightPos[i*3+2] = -20 - Math.random()*60;
}
brightGeo.setAttribute('position', new THREE.BufferAttribute(brightPos, 3));
const brightMat = new THREE.PointsMaterial({ color: 0xaaddff, size: 0.12, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
scene.add(new THREE.Points(brightGeo, brightMat));

// ===== FOG =====
scene.fog = new THREE.FogExp2(0x020108, 0.018);

// ===== MOUSE TRACKING =====
let mouseX = 0, mouseY = 0, targetCamX = 0, targetCamY = 0;
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / innerWidth) * 2 - 1;
    mouseY = -(e.clientY / innerHeight) * 2 + 1;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('.nav-item, .work-card, .hero-cta, .contact-link, .signal-btn, a').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// ===== NAVIGATION =====
const sections = document.querySelectorAll('.content-section');
const navItems = document.querySelectorAll('.nav-item');
let currentSection = 0;

function switchSection(index) {
    if (index < 0 || index >= sections.length || index === currentSection) return;
    sections[currentSection].classList.remove('active');
    navItems[currentSection].classList.remove('active');
    currentSection = index;
    sections[currentSection].classList.add('active');
    navItems[currentSection].classList.add('active');
    gsap.to(camera.position, { y: 1.5 - index * 0.4, z: 14 - index * 0.5, duration: 1.5, ease: 'power2.inOut' });
}
navItems.forEach((item, i) => item.addEventListener('click', () => switchSection(i)));

let scrollTimeout;
window.addEventListener('wheel', e => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) switchSection(currentSection + 1);
        else switchSection(currentSection - 1);
    }, 150);
}, { passive: true });

// ===== CONSOLE TYPING =====
const consoleLines = [
    '> SIGNAL_LOST', '> RECONNECTING...', '> SCANNING_PORTFOLIO',
    '> NODE_ACTIVE: 7', '> RENDERING_DITHER_MATRIX', '> FREQ: 432.00 Hz',
    '> BUFFER_ALLOCATED: 2048', '> SHADER_COMPILED', '> VOID_STABLE',
    '> TRANSMISSION_READY', '> AWAITING_INPUT...', '> COSMIC_DRIFT: 0.003'
];
let consoleLine = 0;
setInterval(() => {
    const body = document.getElementById('console-body');
    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = consoleLines[consoleLine % consoleLines.length];
    body.appendChild(line);
    if (body.children.length > 6) body.removeChild(body.children[0]);
    consoleLine++;
}, 3000);

// ===== STAT COUNTER =====
function animateStats() {
    document.querySelectorAll('.stat-value').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = target / 60;
        const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = Math.floor(current);
        }, 30);
    });
}

// ===== LOADING =====
let loadProgress = 0;
const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15 + 5;
    if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadInterval);
        document.getElementById('loader-status').textContent = 'ENTERING VOID...';
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            animateStats();
        }, 600);
    }
    document.getElementById('loader-bar').style.width = loadProgress + '%';
}, 200);

// ===== READOUT =====
setInterval(() => {
    const fps = (55 + Math.random()*10).toFixed(2);
    const el = document.getElementById('readout-content');
    if (el && el.children[4]) el.children[4].textContent = `FPS::${fps}`;
}, 500);

// ===== ANIMATION LOOP =====
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Camera parallax
    targetCamX += (mouseX * 2 - targetCamX) * 0.025;
    targetCamY += (mouseY * 0.6 - targetCamY) * 0.025;
    camera.position.x = targetCamX;
    camera.lookAt(0, 1, -4);

    // Vortex rotation
    vortex.rotation.z = t * 0.06;
    vortex.rotation.x = Math.sin(t * 0.02) * 0.08;

    // Humanoid breathing
    humanGroup.children.forEach((child, i) => {
        if (i < 10) child.position.y = Math.sin(t * 1.2 + i * 0.2) * 0.015;
    });
    // Subtle head tilt
    head.rotation.z = Math.sin(t * 0.5) * 0.03;

    // Dust trail
    const dPos = dustCloud.geometry.attributes.position;
    for (let i = 0; i < dustCount; i++) {
        dPos.array[i*3] += dustVel[i].x;
        dPos.array[i*3+1] += dustVel[i].y + Math.sin(t*0.5 + i*0.1)*0.0005;
        dPos.array[i*3+2] += dustVel[i].z;
        if (dPos.array[i*3+2] < -6) {
            dPos.array[i*3] = (Math.random()-0.5)*0.6;
            dPos.array[i*3+1] = 1.8 + Math.random()*1.8;
            dPos.array[i*3+2] = -0.3;
        }
    }
    dPos.needsUpdate = true;

    // Hologram
    hologram.rotation.y = t * 0.4;
    hologram.material.opacity = 0.4 + Math.sin(t * 2.5) * 0.2;
    beam.material.opacity = 0.025 + Math.sin(t * 1.5) * 0.015;

    // Lights
    mainLight.intensity = 2.5 + Math.sin(t * 0.8) * 0.4;
    purpleLight.position.x = -8 + Math.sin(t * 0.3) * 3;
    backGlow.intensity = 1.5 + Math.sin(t * 0.5) * 0.5;

    // Screen flicker
    screen.material.color.setHSL(0.33, 1, 0.28 + Math.random() * 0.04);

    renderer.render(scene, camera);
}
animate();

// ===== RESIZE =====
window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});
