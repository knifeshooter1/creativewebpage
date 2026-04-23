const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 14);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lights
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
// Extra light on humanoid
const humanLight = new THREE.PointLight(0x00ccff, 3, 20);
humanLight.position.set(3, 5, 8);
scene.add(humanLight);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0x020108, metalness: 0.97, roughness: 0.1 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -4;
scene.add(floor);

// Walls
const wallMat = new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.5, roughness: 0.8, transparent: true, opacity: 0.6 });
const bw = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), wallMat);
bw.position.set(0, 5, -10); scene.add(bw);
const lw = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), wallMat);
lw.position.set(-12, 5, 0); lw.rotation.y = Math.PI/2; scene.add(lw);

// Window frame
const frameMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1a, metalness: 0.9, roughness: 0.2, emissive: 0x050520, emissiveIntensity: 0.3 });
const wf = new THREE.Group();
const tb = new THREE.Mesh(new THREE.BoxGeometry(12,0.25,0.3), frameMat); tb.position.set(0,7,-9.8);
const bb = tb.clone(); bb.position.y = -2;
const lb = new THREE.Mesh(new THREE.BoxGeometry(0.25,9.25,0.3), frameMat); lb.position.set(-6,2.5,-9.8);
const rb = lb.clone(); rb.position.x = 6;
wf.add(tb,bb,lb,rb); scene.add(wf);

// Vortex
const vc = 5000, vGeo = new THREE.BufferGeometry();
const vP = new Float32Array(vc*3), vC = new Float32Array(vc*3);
for(let i=0;i<vc;i++){
    const a=(i/vc)*Math.PI*16, r=0.2+(i/vc)*8, j=Math.pow(i/vc,0.5)*2;
    vP[i*3]=Math.cos(a)*r+(Math.random()-0.5)*j;
    vP[i*3+1]=2.5+Math.sin(a)*r*0.4+(Math.random()-0.5)*j;
    vP[i*3+2]=-14-Math.random()*12;
    const t=i/vc;
    vC[i*3]=0.05+t*0.4; vC[i*3+1]=0.2+(1-t)*0.7; vC[i*3+2]=0.7+t*0.3;
}
vGeo.setAttribute('position',new THREE.BufferAttribute(vP,3));
vGeo.setAttribute('color',new THREE.BufferAttribute(vC,3));
const vortex = new THREE.Points(vGeo, new THREE.PointsMaterial({size:0.1,vertexColors:true,transparent:true,opacity:0.85,blending:THREE.AdditiveBlending,depthWrite:false}));
scene.add(vortex);
// Extra nebula layers
for(let L=0;L<2;L++){const c2=1500,g2=new THREE.BufferGeometry(),p2=new Float32Array(c2*3),c3=new Float32Array(c2*3);for(let i=0;i<c2;i++){const a2=Math.random()*Math.PI*2,r2=1+Math.random()*7;p2[i*3]=Math.cos(a2)*r2+(Math.random()-0.5)*3;p2[i*3+1]=2.5+Math.sin(a2)*r2*0.3+(Math.random()-0.5)*2;p2[i*3+2]=-16-L*5-Math.random()*6;c3[i*3]=L===0?0.3:0.5;c3[i*3+1]=L===0?0.1:0;c3[i*3+2]=L===0?0.8:0.9;}g2.setAttribute('position',new THREE.BufferAttribute(p2,3));g2.setAttribute('color',new THREE.BufferAttribute(c3,3));scene.add(new THREE.Points(g2,new THREE.PointsMaterial({size:0.15+L*0.1,vertexColors:true,transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false})));}

// ===== MASSIVE HUMANOID (right half of screen, sitting, knees hugged) =====
const humanGroup = new THREE.Group();
humanGroup.position.set(3, -4, 5); // Positioned right-center, close to camera
humanGroup.scale.set(2.2, 2.2, 2.2); // Scale up significantly
scene.add(humanGroup);

function mkPart(shape, s, p, n) {
    const geo = new THREE.BufferGeometry(), pos = new Float32Array(n*3);
    for(let i=0;i<n;i++){
        let x,y,z;
        if(shape==='sphere'){
            const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),r=Math.cbrt(Math.random());
            x=r*Math.sin(ph)*Math.cos(th)*s[0]; y=r*Math.sin(ph)*Math.sin(th)*s[1]; z=r*Math.cos(ph)*s[2];
        } else if(shape==='cyl'){
            const a2=Math.random()*Math.PI*2,r2=Math.sqrt(Math.random())*s[0];
            x=Math.cos(a2)*r2; y=(Math.random()-0.5)*s[1]; z=Math.sin(a2)*r2*(s[2]/s[0]);
        } else {
            x=(Math.random()-0.5)*s[0]; y=(Math.random()-0.5)*s[1]; z=(Math.random()-0.5)*s[2];
        }
        pos[i*3]=x+p[0]; pos[i*3+1]=y+p[1]; pos[i*3+2]=z+p[2];
    }
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    return geo;
}

const hMat = new THREE.PointsMaterial({color:0x00d4ff,size:0.04,transparent:true,opacity:0.92,blending:THREE.AdditiveBlending,depthWrite:false});
const hMatDim = new THREE.PointsMaterial({color:0x0099dd,size:0.035,transparent:true,opacity:0.75,blending:THREE.AdditiveBlending,depthWrite:false});
const hMatGlow = new THREE.PointsMaterial({color:0x44eeff,size:0.06,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false});

// Head (large, detailed)
const head = new THREE.Points(mkPart('sphere',[0.55,0.65,0.5],[0,5.6,0],2500), hMat);
// Face features - brow ridge, eye sockets
const brow = new THREE.Points(mkPart('box',[0.5,0.06,0.15],[0,5.75,0.35],400), hMatGlow);
const eyeL = new THREE.Points(mkPart('sphere',[0.08,0.06,0.05],[0.18,5.6,0.45],200), hMatGlow);
const eyeR = new THREE.Points(mkPart('sphere',[0.08,0.06,0.05],[-0.18,5.6,0.45],200), hMatGlow);
// Neck
const neck = new THREE.Points(mkPart('cyl',[0.18,0.4,0.15],[0,5.0,0],600), hMatDim);
// Shoulders
const shoulderL = new THREE.Points(mkPart('sphere',[0.3,0.2,0.25],[0.6,4.7,0],800), hMat);
const shoulderR = new THREE.Points(mkPart('sphere',[0.3,0.2,0.25],[-0.6,4.7,0],800), hMat);
// Torso (large chest + abdomen)
const chest = new THREE.Points(mkPart('box',[1.1,0.8,0.55],[0,4.2,0],4000), hMat);
const abdomen = new THREE.Points(mkPart('box',[0.9,0.6,0.45],[0,3.5,0.05],2500), hMatDim);
// Spine detail (glowing ridge down back)
const spine = new THREE.Points(mkPart('cyl',[0.05,1.8,0.05],[0,4.0,-0.25],400), hMatGlow);
// Upper arms going forward and down to wrap knees
const upperArmL = new THREE.Points(mkPart('cyl',[0.15,0.9,0.15],[0.55,3.8,0.3],700), hMatDim);
const upperArmR = new THREE.Points(mkPart('cyl',[0.15,0.9,0.15],[-0.55,3.8,0.3],700), hMatDim);
// Forearms wrapping forward around knees
const forearmL = new THREE.Points(mkPart('cyl',[0.12,0.7,0.12],[0.45,3.4,0.7],600), hMatDim);
const forearmR = new THREE.Points(mkPart('cyl',[0.12,0.7,0.12],[-0.45,3.4,0.7],600), hMatDim);
// Hands clasped in front of shins
const handL = new THREE.Points(mkPart('sphere',[0.15,0.12,0.1],[0.2,3.2,0.95],400), hMat);
const handR = new THREE.Points(mkPart('sphere',[0.15,0.12,0.1],[-0.2,3.2,0.95],400), hMat);
// Fingers interlocked
const fingers = new THREE.Points(mkPart('box',[0.3,0.08,0.12],[0,3.15,1.0],300), hMatGlow);
// Thighs (going forward from hip, horizontal)
const thighL = new THREE.Points(mkPart('cyl',[0.22,1.0,0.22],[0.3,3.0,0.4],1200), hMatDim);
const thighR = new THREE.Points(mkPart('cyl',[0.22,1.0,0.22],[-0.3,3.0,0.4],1200), hMatDim);
// Knees (rounded)
const kneeL = new THREE.Points(mkPart('sphere',[0.2,0.2,0.2],[0.3,3.1,0.85],500), hMat);
const kneeR = new THREE.Points(mkPart('sphere',[0.2,0.2,0.2],[-0.3,3.1,0.85],500), hMat);
// Shins (going up from knees)
const shinL = new THREE.Points(mkPart('cyl',[0.17,0.9,0.17],[0.3,3.5,0.9],900), hMatDim);
const shinR = new THREE.Points(mkPart('cyl',[0.17,0.9,0.17],[-0.3,3.5,0.9],900), hMatDim);
// Feet (tucked under)
const footL = new THREE.Points(mkPart('box',[0.18,0.1,0.35],[0.3,2.55,0.6],400), hMatDim);
const footR = new THREE.Points(mkPart('box',[0.18,0.1,0.35],[-0.3,2.55,0.6],400), hMatDim);

humanGroup.add(head,brow,eyeL,eyeR,neck,shoulderL,shoulderR,chest,abdomen,spine,
    upperArmL,upperArmR,forearmL,forearmR,handL,handR,fingers,
    thighL,thighR,kneeL,kneeR,shinL,shinR,footL,footR);

// Outer glow aura around the figure
const auraCount = 3000;
const auraGeo = new THREE.BufferGeometry(), auraP = new Float32Array(auraCount*3);
for(let i=0;i<auraCount;i++){
    const angle = Math.random()*Math.PI*2;
    const h = 2.5 + Math.random()*3.5;
    const r = 0.6 + Math.random()*0.5;
    auraP[i*3]=Math.cos(angle)*r+(Math.random()-0.5)*0.3;
    auraP[i*3+1]=h;
    auraP[i*3+2]=Math.sin(angle)*r*0.6+(Math.random()-0.5)*0.3;
}
auraGeo.setAttribute('position',new THREE.BufferAttribute(auraP,3));
const aura = new THREE.Points(auraGeo, new THREE.PointsMaterial({color:0x2266ff,size:0.03,transparent:true,opacity:0.2,blending:THREE.AdditiveBlending,depthWrite:false}));
humanGroup.add(aura);

// Dissolving dust trail from back
const dustCount = 3000;
const dustGeo = new THREE.BufferGeometry(), dustPos = new Float32Array(dustCount*3), dustVel = [];
for(let i=0;i<dustCount;i++){
    dustPos[i*3]=(Math.random()-0.5)*0.8;
    dustPos[i*3+1]=3+Math.random()*2.5;
    dustPos[i*3+2]=-0.3-Math.random()*6;
    dustVel.push({x:(Math.random()-0.5)*0.006,y:(Math.random()-0.5)*0.003+0.002,z:-0.006-Math.random()*0.018});
}
dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));
const dustCloud = new THREE.Points(dustGeo, new THREE.PointsMaterial({color:0x3366ee,size:0.03,transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false}));
humanGroup.add(dustCloud);

// Workspace (pushed further right and back)
const dkM = new THREE.MeshStandardMaterial({color:0x0c0c18,metalness:0.7,roughness:0.4});
const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5,0.08,1.6),dkM);
desk.position.set(7,-1.5,-4); scene.add(desk);
const lG = new THREE.BoxGeometry(0.08,2,0.08);
[[-1.6,-1,-0.7],[1.6,-1,-0.7],[-1.6,-1,0.7],[1.6,-1,0.7]].forEach(p=>{const l=new THREE.Mesh(lG,dkM);l.position.set(7+p[0],-1.5+p[1],-4+p[2]);scene.add(l);});
const mM = new THREE.MeshStandardMaterial({color:0x080810,metalness:0.9,roughness:0.2});
const mon = new THREE.Mesh(new THREE.BoxGeometry(1.8,1.1,0.05),mM); mon.position.set(7,-0.3,-4.6); scene.add(mon);
const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.6,0.9),new THREE.MeshBasicMaterial({color:0x00ff44}));
scr.position.set(7,-0.3,-4.57); scene.add(scr);
const stn = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.6,0.08),mM); stn.position.set(7,-1,-4.6); scene.add(stn);

// Beanbag
const bean = new THREE.Mesh(new THREE.SphereGeometry(0.8,16,12,0,Math.PI*2,0,Math.PI*0.55),new THREE.MeshStandardMaterial({color:0x0a0a1e,roughness:0.95}));
bean.position.set(6,-3.5,-2.5); bean.scale.set(1.1,0.5,1); scene.add(bean);

// Holographic projector
const pB = new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.25,0.12,8),new THREE.MeshStandardMaterial({color:0x111128,metalness:0.95,roughness:0.1,emissive:0x001133,emissiveIntensity:0.5}));
pB.position.set(7.8,-1.42,-3.5); scene.add(pB);
const hC=600,hG=new THREE.BufferGeometry(),hP=new Float32Array(hC*3);
for(let i=0;i<hC;i++){const t=i/hC;if(t>0.85){const a=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);hP[i*3]=Math.sin(p)*Math.cos(a)*0.18;hP[i*3+1]=t*1.4+Math.sin(p)*Math.sin(a)*0.18;hP[i*3+2]=Math.cos(p)*0.18;}else{hP[i*3]=(Math.random()-0.5)*(t>0.5?0.28:0.22);hP[i*3+1]=t*1.4;hP[i*3+2]=(Math.random()-0.5)*(t>0.5?0.2:0.18);}}
hG.setAttribute('position',new THREE.BufferAttribute(hP,3));
const holo = new THREE.Points(hG,new THREE.PointsMaterial({color:0x00f0ff,size:0.025,transparent:true,opacity:0.65,blending:THREE.AdditiveBlending,depthWrite:false}));
holo.position.set(7.8,-1.35,-3.5); scene.add(holo);
const beam = new THREE.Mesh(new THREE.ConeGeometry(0.5,1.5,16,1,true),new THREE.MeshBasicMaterial({color:0x00f0ff,transparent:true,opacity:0.035,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
beam.position.set(7.8,-0.65,-3.5); scene.add(beam);

// Stars
const sC=3000,sG=new THREE.BufferGeometry(),sP=new Float32Array(sC*3);
for(let i=0;i<sC;i++){sP[i*3]=(Math.random()-0.5)*120;sP[i*3+1]=(Math.random()-0.5)*70;sP[i*3+2]=-15-Math.random()*100;}
sG.setAttribute('position',new THREE.BufferAttribute(sP,3));
scene.add(new THREE.Points(sG,new THREE.PointsMaterial({color:0xffffff,size:0.04,transparent:true,opacity:0.5})));
const bC=100,bG2=new THREE.BufferGeometry(),bP2=new Float32Array(bC*3);
for(let i=0;i<bC;i++){bP2[i*3]=(Math.random()-0.5)*80;bP2[i*3+1]=(Math.random()-0.5)*50;bP2[i*3+2]=-20-Math.random()*60;}
bG2.setAttribute('position',new THREE.BufferAttribute(bP2,3));
scene.add(new THREE.Points(bG2,new THREE.PointsMaterial({color:0xaaddff,size:0.12,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending})));

scene.fog = new THREE.FogExp2(0x020108, 0.015);

// ===== HAND CURSOR =====
let mouseX=0, mouseY=0, targetCamX=0, targetCamY=0;
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
    mouseX = (e.clientX/innerWidth)*2-1;
    mouseY = -(e.clientY/innerHeight)*2+1;
    cursor.style.left = e.clientX+'px';
    cursor.style.top = e.clientY+'px';
});
document.querySelectorAll('.nav-item,.work-card,.hero-cta,.contact-link,.signal-btn,a').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('hovering'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('hovering'));
});

// Navigation
const sections = document.querySelectorAll('.content-section');
const navItems = document.querySelectorAll('.nav-item');
let currentSection = 0;
function switchSection(index) {
    if(index<0||index>=sections.length||index===currentSection) return;
    sections[currentSection].classList.remove('active');
    navItems[currentSection].classList.remove('active');
    currentSection = index;
    sections[currentSection].classList.add('active');
    navItems[currentSection].classList.add('active');
    gsap.to(camera.position,{y:1.5-index*0.4,z:14-index*0.5,duration:1.5,ease:'power2.inOut'});
}
navItems.forEach((item,i)=>item.addEventListener('click',()=>switchSection(i)));
let scrollTimeout;
window.addEventListener('wheel',e=>{clearTimeout(scrollTimeout);scrollTimeout=setTimeout(()=>{if(e.deltaY>0)switchSection(currentSection+1);else switchSection(currentSection-1);},150);},{passive:true});

// Console typing
const cLines=['>SIGNAL_LOST','>RECONNECTING...','>SCANNING_PORTFOLIO','>NODE_ACTIVE:7','>RENDERING_DITHER_MATRIX','>FREQ:432.00Hz','>BUFFER_ALLOCATED:2048','>SHADER_COMPILED','>VOID_STABLE','>TRANSMISSION_READY','>AWAITING_INPUT...','>COSMIC_DRIFT:0.003'];
let cLine=0;
setInterval(()=>{const b=document.getElementById('console-body');const l=document.createElement('div');l.className='console-line';l.textContent=cLines[cLine%cLines.length];b.appendChild(l);if(b.children.length>6)b.removeChild(b.children[0]);cLine++;},3000);

// Stats
function animateStats(){document.querySelectorAll('.stat-value').forEach(el=>{const t=parseInt(el.dataset.count);let c=0;const s=t/60;const iv=setInterval(()=>{c+=s;if(c>=t){c=t;clearInterval(iv);}el.textContent=Math.floor(c);},30);});}

// Loading
let lP=0;const lI=setInterval(()=>{lP+=Math.random()*15+5;if(lP>=100){lP=100;clearInterval(lI);document.getElementById('loader-status').textContent='ENTERING VOID...';setTimeout(()=>{document.getElementById('loading-screen').classList.add('hidden');animateStats();},600);}document.getElementById('loader-bar').style.width=lP+'%';},200);

// Readout
setInterval(()=>{const f=(55+Math.random()*10).toFixed(2);const e=document.getElementById('readout-content');if(e&&e.children[4])e.children[4].textContent='FPS::'+f;},500);

// Animation loop
const clock = new THREE.Clock();
function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    targetCamX+=(mouseX*2-targetCamX)*0.025;
    targetCamY+=(mouseY*0.6-targetCamY)*0.025;
    camera.position.x=targetCamX;
    camera.lookAt(1,1,-4);

    vortex.rotation.z=t*0.06;
    vortex.rotation.x=Math.sin(t*0.02)*0.08;

    // Humanoid breathing
    humanGroup.children.forEach((child,i)=>{if(i<25)child.position.y+=Math.sin(t*1.2+i*0.15)*0.0003;});
    head.rotation.z=Math.sin(t*0.4)*0.04;
    // Eye glow pulse
    eyeL.material = eyeR.material; // shared ref
    
    // Dust trail
    const dP=dustCloud.geometry.attributes.position;
    for(let i=0;i<dustCount;i++){
        dP.array[i*3]+=dustVel[i].x;
        dP.array[i*3+1]+=dustVel[i].y+Math.sin(t*0.5+i*0.1)*0.0005;
        dP.array[i*3+2]+=dustVel[i].z;
        if(dP.array[i*3+2]<-7){dP.array[i*3]=(Math.random()-0.5)*0.8;dP.array[i*3+1]=3+Math.random()*2.5;dP.array[i*3+2]=-0.3;}
    }
    dP.needsUpdate=true;

    // Aura shimmer
    aura.material.opacity=0.15+Math.sin(t*1.5)*0.08;

    holo.rotation.y=t*0.4;
    holo.material.opacity=0.4+Math.sin(t*2.5)*0.2;
    beam.material.opacity=0.025+Math.sin(t*1.5)*0.015;
    mainLight.intensity=2.5+Math.sin(t*0.8)*0.4;
    purpleLight.position.x=-8+Math.sin(t*0.3)*3;
    backGlow.intensity=1.5+Math.sin(t*0.5)*0.5;
    scr.material.color.setHSL(0.33,1,0.28+Math.random()*0.04);

    renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
