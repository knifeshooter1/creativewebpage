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
const mainLight = new THREE.PointLight(0x00f0ff, 3, 60); mainLight.position.set(5, 10, 8); scene.add(mainLight);
const purpleLight = new THREE.PointLight(0x8b00ff, 2.5, 50); purpleLight.position.set(-8, 4, -5); scene.add(purpleLight);
const rimLight = new THREE.PointLight(0x0066ff, 1.5, 35); rimLight.position.set(0, -1, 10); scene.add(rimLight);
const backGlow = new THREE.PointLight(0x4400aa, 2, 40); backGlow.position.set(0, 3, -10); scene.add(backGlow);
const humanLight = new THREE.PointLight(0x00ccff, 4, 25); humanLight.position.set(8, 6, 10); scene.add(humanLight);
const humanLight2 = new THREE.PointLight(0x2244ff, 2, 20); humanLight2.position.set(12, 0, 5); scene.add(humanLight2);

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(80,80), new THREE.MeshStandardMaterial({color:0x020108,metalness:0.97,roughness:0.1}));
floor.rotation.x=-Math.PI/2; floor.position.y=-5; scene.add(floor);

// Walls
const wM=new THREE.MeshStandardMaterial({color:0x050510,metalness:0.5,roughness:0.8,transparent:true,opacity:0.6});
const bw=new THREE.Mesh(new THREE.PlaneGeometry(30,20),wM); bw.position.set(0,5,-10); scene.add(bw);

// Window frame
const fM=new THREE.MeshStandardMaterial({color:0x0a0a1a,metalness:0.9,roughness:0.2,emissive:0x050520,emissiveIntensity:0.3});
const wf=new THREE.Group();
const t1=new THREE.Mesh(new THREE.BoxGeometry(12,0.25,0.3),fM); t1.position.set(0,7,-9.8);
const b1=t1.clone(); b1.position.y=-2;
const l1=new THREE.Mesh(new THREE.BoxGeometry(0.25,9.25,0.3),fM); l1.position.set(-6,2.5,-9.8);
const r1=l1.clone(); r1.position.x=6;
wf.add(t1,b1,l1,r1); scene.add(wf);

// Vortex
const vc=5000,vG=new THREE.BufferGeometry(),vP=new Float32Array(vc*3),vC=new Float32Array(vc*3);
for(let i=0;i<vc;i++){const a=(i/vc)*Math.PI*16,r=0.2+(i/vc)*8,j=Math.pow(i/vc,0.5)*2;vP[i*3]=Math.cos(a)*r+(Math.random()-0.5)*j;vP[i*3+1]=2.5+Math.sin(a)*r*0.4+(Math.random()-0.5)*j;vP[i*3+2]=-14-Math.random()*12;const tt=i/vc;vC[i*3]=0.05+tt*0.4;vC[i*3+1]=0.2+(1-tt)*0.7;vC[i*3+2]=0.7+tt*0.3;}
vG.setAttribute('position',new THREE.BufferAttribute(vP,3));vG.setAttribute('color',new THREE.BufferAttribute(vC,3));
const vortex=new THREE.Points(vG,new THREE.PointsMaterial({size:0.1,vertexColors:true,transparent:true,opacity:0.85,blending:THREE.AdditiveBlending,depthWrite:false}));
vortex.position.set(-18, 2, -10);
vortex.scale.set(0.6, 0.6, 0.6);
scene.add(vortex);
for(let L=0;L<2;L++){const c2=1500,g2=new THREE.BufferGeometry(),p2=new Float32Array(c2*3),c3=new Float32Array(c2*3);for(let i=0;i<c2;i++){const a2=Math.random()*Math.PI*2,r2=1+Math.random()*7;p2[i*3]=Math.cos(a2)*r2+(Math.random()-0.5)*3;p2[i*3+1]=2.5+Math.sin(a2)*r2*0.3+(Math.random()-0.5)*2;p2[i*3+2]=-16-L*5-Math.random()*6;c3[i*3]=L===0?0.3:0.5;c3[i*3+1]=L===0?0.1:0;c3[i*3+2]=L===0?0.8:0.9;}g2.setAttribute('position',new THREE.BufferAttribute(p2,3));g2.setAttribute('color',new THREE.BufferAttribute(c3,3));scene.add(new THREE.Points(g2,new THREE.PointsMaterial({size:0.15+L*0.1,vertexColors:true,transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false})));}

// ===== HUMANOID — MEDIUM-CLOSE PORTRAIT =====
const humanGroup = new THREE.Group();
humanGroup.position.set(4, -21.5, 6);
humanGroup.scale.set(5, 5, 5);
scene.add(humanGroup);

function mk(shape, s, p, n) {
    const geo=new THREE.BufferGeometry(), pos=new Float32Array(n*3);
    for(let i=0;i<n;i++){
        let x,y,z;
        if(shape==='s'){const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),r=Math.cbrt(Math.random());x=r*Math.sin(ph)*Math.cos(th)*s[0];y=r*Math.sin(ph)*Math.sin(th)*s[1];z=r*Math.cos(ph)*s[2];}
        else if(shape==='c'){const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*s[0];x=Math.cos(a)*r;y=(Math.random()-0.5)*s[1];z=Math.sin(a)*r*(s[2]/s[0]);}
        else{x=(Math.random()-0.5)*s[0];y=(Math.random()-0.5)*s[1];z=(Math.random()-0.5)*s[2];}
        pos[i*3]=x+p[0];pos[i*3+1]=y+p[1];pos[i*3+2]=z+p[2];
    }
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); return geo;
}

const hM=new THREE.PointsMaterial({color:0x00d4ff,size:0.035,transparent:true,opacity:0.93,blending:THREE.AdditiveBlending,depthWrite:false});
const hD=new THREE.PointsMaterial({color:0x0099dd,size:0.03,transparent:true,opacity:0.78,blending:THREE.AdditiveBlending,depthWrite:false});
const hG=new THREE.PointsMaterial({color:0x44eeff,size:0.05,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false});
const hI=new THREE.PointsMaterial({color:0x88ffff,size:0.025,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending,depthWrite:false});

// HEAD — very detailed
const head=new THREE.Points(mk('s',[0.6,0.7,0.55],[0,5.8,0],4000),hM);
const skull=new THREE.Points(mk('s',[0.55,0.65,0.5],[0,5.85,0],2000),hI);
const brow=new THREE.Points(mk('b',[0.5,0.08,0.18],[0,5.95,0.4],600),hG);
const eyeL=new THREE.Points(mk('s',[0.1,0.07,0.06],[0.2,5.8,0.5],350),hG);
const eyeR=new THREE.Points(mk('s',[0.1,0.07,0.06],[-0.2,5.8,0.5],350),hG);
const jaw=new THREE.Points(mk('s',[0.4,0.25,0.35],[0,5.45,0.1],1200),hD);
const cheekL=new THREE.Points(mk('s',[0.15,0.12,0.1],[0.35,5.65,0.3],400),hD);
const cheekR=new THREE.Points(mk('s',[0.15,0.12,0.1],[-0.35,5.65,0.3],400),hD);

// NECK
const neck=new THREE.Points(mk('c',[0.2,0.45,0.18],[0,5.05,0],900),hD);
const neckDetail=new THREE.Points(mk('c',[0.15,0.35,0.12],[0,5.1,0.05],400),hI);

// SHOULDERS — broad
const sL=new THREE.Points(mk('s',[0.35,0.25,0.3],[0.7,4.75,0],1200),hM);
const sR=new THREE.Points(mk('s',[0.35,0.25,0.3],[-0.7,4.75,0],1200),hM);
const sDL=new THREE.Points(mk('s',[0.3,0.2,0.25],[0.75,4.8,0],500),hI);
const sDR=new THREE.Points(mk('s',[0.3,0.2,0.25],[-0.75,4.8,0],500),hI);

// TORSO — large, detailed musculature
const chest=new THREE.Points(mk('b',[1.2,0.9,0.6],[0,4.2,0],6000),hM);
const chestInner=new THREE.Points(mk('b',[1.0,0.75,0.45],[0,4.25,0.05],3000),hI);
const abs=new THREE.Points(mk('b',[0.95,0.7,0.5],[0,3.4,0.05],4000),hD);
const absDetail=new THREE.Points(mk('b',[0.8,0.6,0.35],[0,3.45,0.1],2000),hI);
const spine=new THREE.Points(mk('c',[0.06,2.2,0.06],[0,4.0,-0.3],600),hG);
const ribL=new THREE.Points(mk('b',[0.15,0.6,0.35],[0.5,4.1,0.15],800),hI);
const ribR=new THREE.Points(mk('b',[0.15,0.6,0.35],[-0.5,4.1,0.15],800),hI);

// LEFT ARM — static (partially visible or hidden depending on framing)
const lUA=new THREE.Points(mk('c',[0.18,1.0,0.18],[0.65,3.9,0.3],1000),hD);
const lFA=new THREE.Points(mk('c',[0.15,0.8,0.15],[0.5,3.3,0.7],800),hD);
const lHand=new THREE.Points(mk('s',[0.16,0.13,0.12],[0.25,3.1,0.95],500),hM);

// RIGHT ARM — THIS ONE FOLLOWS THE CURSOR
const rightArmGroup = new THREE.Group();
// Upper arm pivot at right shoulder
const rUA=new THREE.Points(mk('c',[0.18,1.0,0.18],[0,-0.5,0],1200),hD);
const rUAdetail=new THREE.Points(mk('c',[0.12,0.8,0.12],[0,-0.5,0],500),hI);
rightArmGroup.add(rUA,rUAdetail);

// Forearm as child
const forearmGroup = new THREE.Group();
forearmGroup.position.set(0,-1,0);
const rFA=new THREE.Points(mk('c',[0.15,0.8,0.15],[0,-0.4,0],1000),hD);
const rFAdetail=new THREE.Points(mk('c',[0.1,0.7,0.1],[0,-0.4,0],400),hI);
forearmGroup.add(rFA,rFAdetail);

// Hand at end of forearm
const handGroup = new THREE.Group();
handGroup.position.set(0,-0.85,0);
const rPalm=new THREE.Points(mk('s',[0.18,0.14,0.1],[0,0,0],600),hM);
const rThumb=new THREE.Points(mk('c',[0.04,0.15,0.04],[-0.12,0.05,0.05],200),hG);
const rIndex=new THREE.Points(mk('c',[0.03,0.2,0.03],[-0.06,-0.18,0.02],250),hG);
const rMiddle=new THREE.Points(mk('c',[0.03,0.22,0.03],[0,-0.2,0.02],250),hG);
const rRing=new THREE.Points(mk('c',[0.03,0.18,0.03],[0.05,-0.17,0.02],200),hG);
const rPinky=new THREE.Points(mk('c',[0.025,0.15,0.025],[0.1,-0.14,0.02],180),hG);
const rFingerTips=new THREE.Points(mk('s',[0.15,0.05,0.08],[0,-0.25,0.02],300),hG);
handGroup.add(rPalm,rThumb,rIndex,rMiddle,rRing,rPinky,rFingerTips);
forearmGroup.add(handGroup);
rightArmGroup.add(forearmGroup);
rightArmGroup.position.set(-0.7,4.75,0); // right shoulder position
humanGroup.add(rightArmGroup);

// No legs to save geometry for close-up view

humanGroup.add(head,skull,brow,eyeL,eyeR,jaw,cheekL,cheekR,
    neck,neckDetail,sL,sR,sDL,sDR,
    chest,chestInner,abs,absDetail,spine,ribL,ribR,
    lUA,lFA,lHand);

// Aura
const aC=4000,aG2=new THREE.BufferGeometry(),aP2=new Float32Array(aC*3);
for(let i=0;i<aC;i++){const a=Math.random()*Math.PI*2,h=2.5+Math.random()*4,r=0.7+Math.random()*0.6;aP2[i*3]=Math.cos(a)*r+(Math.random()-0.5)*0.4;aP2[i*3+1]=h;aP2[i*3+2]=Math.sin(a)*r*0.6+(Math.random()-0.5)*0.3;}
aG2.setAttribute('position',new THREE.BufferAttribute(aP2,3));
const aura=new THREE.Points(aG2,new THREE.PointsMaterial({color:0x2266ff,size:0.025,transparent:true,opacity:0.18,blending:THREE.AdditiveBlending,depthWrite:false}));
humanGroup.add(aura);

// Dust trail
const dC=3500,dG=new THREE.BufferGeometry(),dP2=new Float32Array(dC*3),dV=[];
for(let i=0;i<dC;i++){dP2[i*3]=(Math.random()-0.5)*1;dP2[i*3+1]=3+Math.random()*3;dP2[i*3+2]=-0.3-Math.random()*7;dV.push({x:(Math.random()-0.5)*0.005,y:(Math.random()-0.5)*0.003+0.002,z:-0.005-Math.random()*0.015});}
dG.setAttribute('position',new THREE.BufferAttribute(dP2,3));
const dust=new THREE.Points(dG,new THREE.PointsMaterial({color:0x3366ee,size:0.025,transparent:true,opacity:0.28,blending:THREE.AdditiveBlending,depthWrite:false}));
humanGroup.add(dust);

// Workspace (far left, foreground)
const dkM=new THREE.MeshStandardMaterial({color:0x0c0c18,metalness:0.7,roughness:0.4});
const desk=new THREE.Mesh(new THREE.BoxGeometry(3.5,0.08,1.6),dkM);desk.position.set(-8,-2,2);scene.add(desk);
const mM=new THREE.MeshStandardMaterial({color:0x080810,metalness:0.9,roughness:0.2});
const mon=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.1,0.05),mM);mon.position.set(-8,-0.8,1.4);scene.add(mon);
const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.6,0.9),new THREE.MeshBasicMaterial({color:0x00ff44}));scr.position.set(-8,-0.8,1.43);scene.add(scr);

// Stars
const sC2=3000,sG2=new THREE.BufferGeometry(),sP2=new Float32Array(sC2*3);
for(let i=0;i<sC2;i++){sP2[i*3]=(Math.random()-0.5)*120;sP2[i*3+1]=(Math.random()-0.5)*70;sP2[i*3+2]=-15-Math.random()*100;}
sG2.setAttribute('position',new THREE.BufferAttribute(sP2,3));
scene.add(new THREE.Points(sG2,new THREE.PointsMaterial({color:0xffffff,size:0.04,transparent:true,opacity:0.5})));

scene.fog=new THREE.FogExp2(0x020108,0.012);

// ===== MOUSE / CURSOR =====
let mouseX=0,mouseY=0,targetCamX=0,mouseScreenX=0,mouseScreenY=0;
const raycaster=new THREE.Raycaster();
const mouseVec=new THREE.Vector2();
// Target for the hand in world space
let handTarget=new THREE.Vector3(0,4,5);

document.addEventListener('mousemove',e=>{
    mouseX=(e.clientX/innerWidth)*2-1;
    mouseY=-(e.clientY/innerHeight)*2+1;
    mouseScreenX=e.clientX;
    mouseScreenY=e.clientY;
    // Convert mouse to 3D world position on a plane near camera
    mouseVec.set(mouseX,mouseY);
    raycaster.setFromCamera(mouseVec,camera);
    const planeZ=6.5; 
    const dist=(planeZ-camera.position.z)/raycaster.ray.direction.z;
    handTarget=raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(dist));
});

document.querySelectorAll('.nav-item,.work-card,.hero-cta,.contact-link,.signal-btn,a').forEach(el=>{
    // Optionally trigger a hover state globally if needed, cursor removed
});

// Navigation
const sections=document.querySelectorAll('.content-section');
const navItems=document.querySelectorAll('.nav-item');
let currentSection=0;
function switchSection(i){if(i<0||i>=sections.length||i===currentSection)return;sections[currentSection].classList.remove('active');navItems[currentSection].classList.remove('active');currentSection=i;sections[currentSection].classList.add('active');navItems[currentSection].classList.add('active');gsap.to(camera.position,{y:1.5-i*0.4,z:14-i*0.5,duration:1.5,ease:'power2.inOut'});}
navItems.forEach((item,i)=>item.addEventListener('click',()=>switchSection(i)));
let scrollTimeout;
window.addEventListener('wheel',e=>{clearTimeout(scrollTimeout);scrollTimeout=setTimeout(()=>{if(e.deltaY>0)switchSection(currentSection+1);else switchSection(currentSection-1);},150);},{passive:true});

// Console
const cL2=['>SIGNAL_LOST','>RECONNECTING...','>SCANNING_PORTFOLIO','>NODE_ACTIVE:7','>RENDERING_DITHER','>FREQ:432Hz','>BUFFER:2048','>SHADER_OK','>VOID_STABLE','>TX_READY','>AWAITING...','>DRIFT:0.003'];
let cI=0;setInterval(()=>{const b=document.getElementById('console-body');const l=document.createElement('div');l.className='console-line';l.textContent=cL2[cI%cL2.length];b.appendChild(l);if(b.children.length>6)b.removeChild(b.children[0]);cI++;},3000);

// Stats
function animateStats(){document.querySelectorAll('.stat-value').forEach(el=>{const t=parseInt(el.dataset.count);let c=0;const s=t/60;const iv=setInterval(()=>{c+=s;if(c>=t){c=t;clearInterval(iv);}el.textContent=Math.floor(c);},30);});}

// Loading
let lP=0;const lI=setInterval(()=>{lP+=Math.random()*15+5;if(lP>=100){lP=100;clearInterval(lI);document.getElementById('loader-status').textContent='ENTERING VOID...';setTimeout(()=>{document.getElementById('loading-screen').classList.add('hidden');animateStats();},600);}document.getElementById('loader-bar').style.width=lP+'%';},200);

// Readout
setInterval(()=>{const f=(55+Math.random()*10).toFixed(2);const e=document.getElementById('readout-content');if(e&&e.children[4])e.children[4].textContent='FPS::'+f;},500);

// ===== ANIMATION =====
const clock=new THREE.Clock();
// Smooth hand target
let smoothHand=new THREE.Vector3(0,4,5);

function animate(){
    requestAnimationFrame(animate);
    const t=clock.getElapsedTime();
    
    targetCamX+=(mouseX*1.5-targetCamX)*0.02;
    camera.position.x=targetCamX;
    camera.lookAt(2,1,-4);

    vortex.rotation.z=t*0.06;
    
    // Breathing
    humanGroup.children.forEach((ch,i)=>{if(ch!==rightArmGroup&&ch!==aura&&ch!==dust)ch.position.y+=Math.sin(t*1.2+i*0.1)*0.0002;});
    head.rotation.z=Math.sin(t*0.4)*0.03;
    
    // ===== RIGHT ARM FOLLOWS CURSOR =====
    // Convert handTarget from world space to humanGroup local space
    const localTarget=humanGroup.worldToLocal(handTarget.clone());
    // Smooth interpolation
    smoothHand.lerp(localTarget,0.12);
    
    // Calculate arm angles from shoulder to target
    const shoulderPos=new THREE.Vector3(-0.7,4.75,0);
    const toTarget=smoothHand.clone().sub(shoulderPos);
    const dist=toTarget.length();
    const maxReach=2.5;
    const clampedDist=Math.min(dist,maxReach);
    const dir=toTarget.normalize();
    const reachPoint=shoulderPos.clone().add(dir.clone().multiplyScalar(clampedDist));
    
    // Point upper arm toward target
    rightArmGroup.lookAt(
        rightArmGroup.position.x+dir.x,
        rightArmGroup.position.y+dir.y,
        rightArmGroup.position.z+dir.z
    );
    // Rotate so arm extends along -Y (local down)
    rightArmGroup.rotateX(-Math.PI/2);
    
    // Scale forearm stretch based on distance
    const stretch=Math.min(clampedDist/1.8,1.4);
    forearmGroup.position.y=-1*stretch;
    handGroup.position.y=-0.85*stretch;
    
    // Hand glow intensifies near interactive elements
    const nearUI=mouseScreenX<innerWidth*0.45;
    rPalm.material.opacity=nearUI?1:0.55;
    rFingerTips.material.opacity=nearUI?0.9:0.4;
    
    // Dust trail
    const dp=dust.geometry.attributes.position;
    for(let i=0;i<dC;i++){
        dp.array[i*3]+=dV[i].x;dp.array[i*3+1]+=dV[i].y+Math.sin(t*0.5+i*0.1)*0.0004;dp.array[i*3+2]+=dV[i].z;
        if(dp.array[i*3+2]<-8){dp.array[i*3]=(Math.random()-0.5)*1;dp.array[i*3+1]=3+Math.random()*3;dp.array[i*3+2]=-0.3;}
    }
    dp.needsUpdate=true;

    aura.material.opacity=0.14+Math.sin(t*1.5)*0.06;
    mainLight.intensity=3+Math.sin(t*0.8)*0.4;
    purpleLight.position.x=-8+Math.sin(t*0.3)*3;
    scr.material.color.setHSL(0.33,1,0.28+Math.random()*0.04);

    renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
