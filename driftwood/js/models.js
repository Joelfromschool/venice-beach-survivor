'use strict';
// Procedural low-poly models: soft round "toy" look.
const MAT={};
function mat(c,o={}){const k=c+JSON.stringify(o);if(!MAT[k])MAT[k]=new THREE.MeshPhongMaterial(Object.assign({color:c,shininess:6,specular:0x111111},o));return MAT[k]}
function mesh(g,c,o){const m=new THREE.Mesh(g,typeof c==='string'||typeof c==='number'?mat(c,o):c);m.castShadow=true;m.receiveShadow=true;return m}
const GEO={};
function sph(r,w=12,h=10){const k='s'+r+w+h;return GEO[k]||(GEO[k]=new THREE.SphereGeometry(r,w,h))}
function cyl(a,b,h,s=10){const k='c'+a+b+h+s;return GEO[k]||(GEO[k]=new THREE.CylinderGeometry(a,b,h,s))}
function box(w,h,d){const k='b'+w+h+d;return GEO[k]||(GEO[k]=new THREE.BoxGeometry(w,h,d))}
function rbox(w,h,d,r=.06){// rounded box via scaled sphere-ish: use box with bevel look (box + small spheres would be heavy) -> chamfer by extrude
 const k='rb'+w+h+d+r;if(GEO[k])return GEO[k];const s=new THREE.Shape();const x=-w/2,y=-d/2;
 s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+d-r);s.quadraticCurveTo(x+w,y+d,x+w-r,y+d);s.lineTo(x+r,y+d);s.quadraticCurveTo(x,y+d,x,y+d-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
 const g=new THREE.ExtrudeGeometry(s,{depth:h-2*Math.min(r,h/3),bevelEnabled:true,bevelThickness:Math.min(r,h/3),bevelSize:Math.min(r,h/3)*.8,bevelSegments:2,curveSegments:4});
 g.rotateX(-Math.PI/2);g.translate(0,Math.min(r,h/3),0);g.computeVertexNormals();return GEO[k]=g}
function at(m,x,y,z){m.position.set(x,y,z);return m}
function grp(...a){const g=new THREE.Group();a.forEach(x=>g.add(x));return g}

// ---------- season palette ----------
function seasonOf(d){const m=d.getMonth()+1,day=d.getDate();
 if((m===12&&day>=11)||m===1||(m===2&&day<25))return 'winter';
 if(m>=3&&m<=5)return 'spring';if(m>=6&&m<=8)return 'summer';return 'autumn'}
function leafCols(season,d){const m=d.getMonth()+1;
 if(season==='spring')return m===4&&d.getDate()<15?['#ffb7cf','#ff9fc0','#ffc9da']:['#6fcf5a','#5bbf4a','#86da6a'];
 if(season==='summer')return ['#3fae45','#349c3c','#4fbf52'];
 if(season==='autumn')return m===11?['#f08a2c','#e8692a','#f5b13a']:(m===10?['#9fc23f','#d7a93a','#86b83d']:['#62bb4a','#56ad42','#79c95a']);
 return ['#4f9a5a','#5aa565','#468f52']}

// ---------- nature ----------
function makeTree(season,d,fruit){
 const g=new THREE.Group();const lc=leafCols(season,d);
 const trunk=mesh(cyl(.13,.2,1.0,8),'#8a5a32');trunk.position.y=.5;g.add(trunk);
 const top=new THREE.Group();top.position.y=1.0;g.add(top);
 const a=mesh(sph(.78),lc[0]);a.scale.set(1,.82,1);a.position.y=.35;top.add(a);
 const b=mesh(sph(.6),lc[1]);b.scale.set(1,.85,1);b.position.y=.95;top.add(b);
 const c=mesh(sph(.38),lc[2]);c.position.y=1.38;top.add(c);
 if(season==='winter'){const s=mesh(sph(.42),'#ffffff');s.scale.set(1.1,.45,1.1);s.position.y=1.6;top.add(s);const s2=mesh(sph(.62),'#f4f8ff');s2.scale.set(1.1,.3,1.1);s2.position.y=1.15;top.add(s2)}
 const fr=new THREE.Group();top.add(fr);
 if(fruit){const fc={peach:'#ffa08a',apple:'#e8333a',orange:'#ff9a1a',cherry:'#d01f3a',pear:'#c8d84a'}[fruit]||'#ffa08a';
  [[.45,.35,.55],[-.5,.5,.45],[.05,.75,.6]].forEach(p=>{const f=mesh(sph(.14,8,6),fc);f.position.set(...p);fr.add(f)})}
 g.userData={top,fruit:fr};return g}
function makePalm(coco){const g=new THREE.Group();let y=0,x=0;
 for(let i=0;i<5;i++){const s=mesh(cyl(.13-i*.012,.16-i*.012,.42,7),i%2?'#b98a55':'#a87a48');x+=i*.035;s.position.set(x,y+.21,0);s.rotation.z=-i*.06;g.add(s);y+=.4}
 const top=new THREE.Group();top.position.set(x+.05,y,0);g.add(top);
 for(let i=0;i<7;i++){const lf=mesh(sph(.5,8,4),'#47b04f');lf.scale.set(1.5,.12,.38);const a=i/7*Math.PI*2;lf.position.set(Math.cos(a)*.62,-.12,Math.sin(a)*.62);lf.rotation.y=-a;lf.rotation.z=-.35;top.add(lf)}
 const fr=new THREE.Group();top.add(fr);if(coco){[[.15,-.18,.12],[-.12,-.2,.1],[0,-.22,-.15]].forEach(p=>{const c=mesh(sph(.12,8,6),'#6b4a2a');c.position.set(...p);fr.add(c)})}
 g.userData={top,fruit:fr};return g}
function makeRock(){const g=new THREE.Group();const r=mesh(new THREE.DodecahedronGeometry(.5,1),'#a9a9a0');r.scale.set(1.1,.8,1);r.position.y=.32;g.add(r);
 const r2=mesh(new THREE.DodecahedronGeometry(.22,0),'#bdbdb3');r2.position.set(.35,.12,.25);g.add(r2);g.userData={top:r};return g}
function makeWeed(){const g=new THREE.Group();for(let i=0;i<4;i++){const c=mesh(new THREE.ConeGeometry(.06,.32,5),'#4f9e3a');c.position.set(Math.cos(i*1.7)*.1,.16,Math.sin(i*1.7)*.1);c.rotation.z=Math.cos(i*2.1)*.35;c.rotation.x=Math.sin(i*2.1)*.35;g.add(c)}return g}
function makeFlower(sp,col,stage=3){const g=new THREE.Group();const c=FCOL[col][0];
 const pos=stage>=3?[[0,0],[.18,.12],[-.16,.14],[.05,-.17]]:[[0,0]];
 for(const [x,z] of pos){
  if(stage<2){const s=mesh(new THREE.ConeGeometry(.05,.15,5),'#5aaa3c');s.position.set(x,.07,z);g.add(s);continue}
  const st=mesh(cyl(.015,.015,.32,4),'#4f9e3a');st.position.set(x,.16,z);g.add(st);
  const lf=mesh(sph(.06,6,4),'#5aaa3c');lf.scale.set(1.6,.3,.7);lf.position.set(x+.06,.08,z);g.add(lf);
  if(stage===2){const b=mesh(sph(.05,6,5),'#6fbf4a');b.position.set(x,.34,z);g.add(b);continue}
  if(sp==='tulip'){const h=mesh(new THREE.CylinderGeometry(.08,.05,.13,6,1,true),c,{side:THREE.DoubleSide});h.position.set(x,.38,z);g.add(h);const bt=mesh(sph(.05,6,4),c);bt.position.set(x,.33,z);g.add(bt)}
  else if(sp==='rose'){const h=mesh(sph(.09,8,6),c);h.scale.set(1,.75,1);h.position.set(x,.37,z);g.add(h);const h2=mesh(sph(.055,6,5),c);h2.position.set(x,.43,z);g.add(h2)}
  else{for(let i=0;i<6;i++){const p=mesh(sph(.045,5,4),c);p.scale.set(1.5,.3,.8);const a=i/6*Math.PI*2;p.position.set(x+Math.cos(a)*.065,.36,z+Math.sin(a)*.065);p.rotation.y=-a;g.add(p)}const ce=mesh(sph(.035,6,4),'#f5c93a');ce.position.set(x,.37,z);g.add(ce)}
 }return g}
function makeSapling(stage){const g=new THREE.Group();const s=.35+stage*.18;const t=mesh(cyl(.04,.06,s,6),'#8a5a32');t.position.y=s/2;g.add(t);
 const l=mesh(sph(.12+stage*.1,8,6),'#6fcf5a');l.position.y=s+.05;g.add(l);return g}
function makeHole(){const m=new THREE.Mesh(new THREE.CircleGeometry(.32,12),new THREE.MeshLambertMaterial({color:0x6a4a2c}));m.rotation.x=-Math.PI/2;m.position.y=.012;m.receiveShadow=true;return m}
let _digTex=null;
function makeDigSpot(){if(!_digTex){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.strokeStyle='#5a3a1e';x.lineWidth=5;x.lineCap='round';
 for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.3;x.beginPath();x.moveTo(32,32);x.lineTo(32+Math.cos(a)*24,32+Math.sin(a)*24);x.stroke()}
 _digTex=new THREE.CanvasTexture(c)}
 const m=new THREE.Mesh(new THREE.PlaneGeometry(.6,.6),new THREE.MeshLambertMaterial({map:_digTex,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.015;return m}
function makeClamSpot(){const g=new THREE.Group();const m=makeHole();m.scale.setScalar(.35);g.add(m);g.userData.spurt=true;return g}

// ---------- buildings ----------
function makeHouse(wall,roof,o={}){const g=new THREE.Group();const w=o.w||2.4,d=o.d||2.0,h=o.h||1.4;
 const body=mesh(rbox(w,h,d,.12),wall);g.add(body);
 const r=mesh(new THREE.ConeGeometry(Math.max(w,d)*.82,1.1,4),roof);r.rotation.y=Math.PI/4;r.scale.set(1,1,d/w);r.position.y=h+.5;g.add(r);
 const door=mesh(rbox(.55,.85,.08,.08),'#8a5a32');door.position.set(0,0,d/2+.01);g.add(door);
 const knob=mesh(sph(.04,6,4),'#ffd34d');knob.position.set(.17,.42,d/2+.07);g.add(knob);
 const winM=new THREE.MeshPhongMaterial({color:0x9fd6ff,emissive:0x000000,shininess:30});
 const wins=[];[-.75,.75].forEach(x=>{const fr=mesh(rbox(.48,.44,.06,.05),'#ffffff');fr.position.set(x*w/2.4,.55,d/2+.01);g.add(fr);const wi=new THREE.Mesh(box(.36,.32,.03),winM);wi.position.set(x*w/2.4,.61,d/2+.06);g.add(wi)});
 wins.push(winM);
 if(o.chimney){const ch=mesh(box(.28,.6,.28),'#b86b4b');ch.position.set(-w*.28,h+.8,-.2);g.add(ch)}
 if(o.sign){const s=mesh(rbox(.9,.42,.08,.08),'#fff6dc');s.position.set(0,h+.12,d/2+.12);g.add(s);if(o.signTex){const p=new THREE.Mesh(new THREE.PlaneGeometry(.78,.34),new THREE.MeshBasicMaterial({map:o.signTex,transparent:true}));p.position.set(0,h+.33,d/2+.17);g.add(p)}}
 if(o.awning){for(let i=0;i<6;i++){const a=mesh(box(w/6,.06,.6),i%2?'#ffffff':o.awning);a.position.set(-w/2+w/12+i*w/6,h-.15,d/2+.25);a.rotation.x=.35;g.add(a)}}
 g.userData={wins,door:new THREE.Vector3(0,0,d/2+.5)};return g}
function makeTent(col){const g=new THREE.Group();const t=mesh(new THREE.ConeGeometry(1.25,1.7,4),col);t.rotation.y=Math.PI/4;t.position.y=.85;g.add(t);
 const sh=new THREE.Shape();sh.moveTo(-.38,0);sh.lineTo(.38,0);sh.lineTo(0,.95);sh.closePath();
 const door=new THREE.Mesh(new THREE.ShapeGeometry(sh),mat('#3b4a6b',{side:THREE.DoubleSide}));door.rotation.x=-.48;door.position.set(0,.02,.9);g.add(door);
 const fl=new THREE.Mesh(new THREE.ShapeGeometry((()=>{const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(.42,0);s.lineTo(0,.9);s.closePath();return s})()),mat('#ffd34d',{side:THREE.DoubleSide}));fl.rotation.x=-.48;fl.position.set(.02,.03,.91);g.add(fl);
 const pole=mesh(cyl(.03,.03,.35,5),'#8a5a32');pole.position.y=1.85;g.add(pole);const flag=mesh(box(.3,.18,.02),'#ffd34d');flag.position.set(.15,1.95,0);g.add(flag);
 const pegs=[[-.95,.95],[.95,.95],[-.95,-.95],[.95,-.95]];pegs.forEach(([x,z])=>{const p=mesh(cyl(.03,.02,.2,4),'#8a5a32');p.position.set(x*1.05,.08,z*1.05);g.add(p)});
 g.userData={wins:[],door:new THREE.Vector3(0,0,1.05)};return g}
function makeMarquee(){const g=new THREE.Group();const c=mesh(cyl(1.7,1.7,1.4,16),'#ffffff');c.position.y=.7;g.add(c);
 for(let i=0;i<8;i++){const s=mesh(new THREE.CylinderGeometry(1.72,1.72,1.4,16,1,true,i/8*Math.PI*2,Math.PI/8),'#59b36b');s.position.y=.7;g.add(s)}
 const r=mesh(new THREE.ConeGeometry(2.0,1.2,16),'#59b36b');r.position.y=2.0;g.add(r);const k=mesh(sph(.15),'#ffd34d');k.position.y=2.65;g.add(k);
 const door=mesh(rbox(.8,1.0,.1,.1),'#3e7d48');door.position.set(0,0,1.66);g.add(door);
 g.userData={wins:[],door:new THREE.Vector3(0,0,2.1)};return g}
function makeMuseum(){const g=new THREE.Group();const b=mesh(rbox(3.2,1.6,2.4,.1),'#f3ead8');g.add(b);
 const r=mesh(cyl(1.0,1.6,.6,16),'#7aa7c7');r.position.y=1.9;g.add(r);const dome=mesh(sph(1.0,16,8),'#8fbad6');dome.scale.y=.6;dome.position.y=2.2;g.add(dome);
 for(let i=0;i<4;i++){const c=mesh(cyl(.1,.1,1.5,8),'#ffffff');c.position.set(-1.2+i*.8,.75,1.3);g.add(c)}
 const st=mesh(box(3.0,.18,.6),'#ffffff');st.position.set(0,1.55,1.32);g.add(st);
 const door=mesh(rbox(.7,1.0,.1,.1),'#5a7fa8');door.position.set(0,0,1.21);g.add(door);
 const owl=mesh(sph(.18,8,6),'#3e9b45');owl.position.set(0,2.95,0);g.add(owl);
 g.userData={wins:[],door:new THREE.Vector3(0,0,1.7)};return g}
function makeWorkbench(){const g=new THREE.Group();const t=mesh(rbox(1.1,.12,.6,.04),'#c48a4f');t.position.y=.62;g.add(t);
 [[-.45,-.22],[.45,-.22],[-.45,.22],[.45,.22]].forEach(([x,z])=>{const l=mesh(box(.1,.62,.1),'#8a5a32');l.position.set(x,.31,z);g.add(l)});
 const s=mesh(box(1.0,.06,.5),'#a87342');s.position.y=.22;g.add(s);const h=mesh(cyl(.03,.03,.35,5),'#555');h.rotation.z=1.2;h.position.set(-.2,.8,0);g.add(h);
 const sw=mesh(box(.3,.08,.12),'#9fb6c3');sw.position.set(.25,.72,.05);g.add(sw);return g}
function makeLampPost(){const g=new THREE.Group();const p=mesh(cyl(.05,.07,1.6,6),'#4a4a52');p.position.y=.8;g.add(p);
 const l=new THREE.Mesh(sph(.17,10,8),new THREE.MeshPhongMaterial({color:0xfff2c0,emissive:0x000000}));l.position.y=1.7;g.add(l);
 const c=mesh(new THREE.ConeGeometry(.22,.16,8),'#4a4a52');c.position.y=1.86;g.add(c);g.userData={bulb:l.material};return g}
function makeBridge(len,horiz){const g=new THREE.Group();const w=1.6;
 for(let i=0;i<Math.round(len*3);i++){const p=mesh(box(horiz?.3:w,.08,horiz?w:.3),i%2?'#b98552':'#c99460');p.position[horiz?'x':'z']=-len/2+.17+i/3;g.add(p)}
 [-1,1].forEach(s=>{const r=mesh(box(horiz?len:.08,.08,horiz?.08:len),'#8a5a32');r.position.set(horiz?0:s*w/2,.42,horiz?s*w/2:0);g.add(r);
  for(let i=0;i<=3;i++){const po=mesh(box(.1,.45,.1),'#8a5a32');po.position.set(horiz?-len/2+i*len/3:s*w/2,.22,horiz?s*w/2:-len/2+i*len/3);g.add(po)}});return g}
function makeDock(len){const g=new THREE.Group();for(let i=0;i<len*3;i++){const p=mesh(box(1.8,.1,.3),i%2?'#b98552':'#c99460');p.position.z=i/3;g.add(p)}
 for(let i=0;i<=len;i+=1)[-.85,.85].forEach(x=>{const po=mesh(cyl(.08,.08,1.1,6),'#7a4a2a');po.position.set(x,-.3,i);g.add(po)});return g}
function makeMound(){const g=new THREE.Group();const m=mesh(sph(.9,14,8),'#7a5232');m.scale.set(1,.1,1);g.add(m);
 for(let i=0;i<7;i++){const c=mesh(sph(.12,6,4),'#8f6440');const a=i/7*Math.PI*2;c.position.set(Math.cos(a)*.8,.05,Math.sin(a)*.8);g.add(c)}
 const fence=new THREE.Group();for(let i=0;i<14;i++){const a=i/14*Math.PI*2;const p=mesh(box(.08,.35,.08),'#e9d7b0');p.position.set(Math.cos(a)*1.35,.17,Math.sin(a)*1.35);if(i!==3&&i!==4)fence.add(p)}g.add(fence);return g}
function makeBottle(){const g=new THREE.Group();const b=new THREE.Mesh(cyl(.08,.1,.3,8),new THREE.MeshPhongMaterial({color:0x9fe0d0,transparent:true,opacity:.75,shininess:60}));b.rotation.z=Math.PI/2;b.position.y=.1;g.add(b);
 const c=mesh(cyl(.04,.04,.08,6),'#8a5a32');c.rotation.z=Math.PI/2;c.position.set(.18,.1,0);g.add(c);const p=mesh(cyl(.04,.04,.18,6),'#fff6dc');p.rotation.z=Math.PI/2;p.position.y=.1;g.add(p);return g}
function makeArrow(){const g=new THREE.Group();const m=new THREE.MeshBasicMaterial({color:0xffcf3a});const c=new THREE.Mesh(new THREE.ConeGeometry(.25,.4,4),m);c.rotation.x=Math.PI;g.add(c);
 const s=new THREE.Mesh(box(.14,.3,.14),m);s.position.y=.32;g.add(s);return g}

// ---------- furniture ----------
function makeFurn(id,extra){const g=new THREE.Group();const add=(m,x,y,z)=>{m.position.set(x,y,z);g.add(m);return m};
 const wood='#c48a4f',dark='#8a5a32';
 switch(id){
 case 'stool':add(mesh(cyl(.25,.25,.1,12),wood),0,.42,0);[0,1,2].forEach(i=>{const a=i/3*Math.PI*2;add(mesh(cyl(.035,.04,.4,5),dark),Math.cos(a)*.16,.2,Math.sin(a)*.16)});break;
 case 'logbench':add(mesh(cyl(.16,.16,1.3,10),'#a06a3a'),0,.4,0).rotation.z=Math.PI/2;add(mesh(box(.12,.3,.12),dark),-.45,.15,0);add(mesh(box(.12,.3,.12),dark),.45,.15,0);g.children[0].scale.set(1,1,.8);break;
 case 'table':add(mesh(rbox(1.0,.1,.8,.08),wood),0,.6,0);[[-.4,-.3],[.4,-.3],[-.4,.3],[.4,.3]].forEach(([x,z])=>add(mesh(cyl(.05,.05,.6,6),dark),x,.3,z));break;
 case 'campfire':for(let i=0;i<6;i++){const a=i/6*Math.PI*2;add(mesh(sph(.1,6,4),'#999'),Math.cos(a)*.3,.06,Math.sin(a)*.3)}
  [0,1,2].forEach(i=>{const l=add(mesh(cyl(.05,.05,.5,6),dark),0,.12,0);l.rotation.z=Math.PI/2;l.rotation.y=i*1.05});
  {const f=add(new THREE.Mesh(new THREE.ConeGeometry(.16,.4,6),new THREE.MeshBasicMaterial({color:0xffa030})),0,.35,0);const f2=add(new THREE.Mesh(new THREE.ConeGeometry(.09,.26,6),new THREE.MeshBasicMaterial({color:0xffe070})),0,.3,0);g.userData.flame=[f,f2]}break;
 case 'birdhouse':add(mesh(cyl(.05,.05,1.0,6),dark),0,.5,0);add(mesh(rbox(.35,.35,.35,.04),'#6fb0e0'),0,1.0,0);{const r=add(mesh(new THREE.ConeGeometry(.33,.25,4),'#e05a4f'),0,1.48,0);r.rotation.y=Math.PI/4}add(mesh(cyl(.06,.06,.02,8),'#333'),0,1.18,.18).rotation.x=Math.PI/2;break;
 case 'fern':add(mesh(cyl(.2,.15,.3,10),'#c96a3a'),0,.15,0);for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const l=add(mesh(sph(.2,6,4),'#3f9e45'),Math.cos(a)*.15,.42,Math.sin(a)*.15);l.scale.set(.5,1,.2);l.rotation.y=-a;l.rotation.z=.6}break;
 case 'lamp':add(mesh(cyl(.15,.18,.08,10),'#e9d7b0'),0,.04,0);add(mesh(cyl(.025,.025,.9,6),'#e9d7b0'),0,.5,0);{const s=add(new THREE.Mesh(new THREE.ConeGeometry(.28,.3,10,1,true),new THREE.MeshPhongMaterial({color:0xffe1ec,emissive:0x553322,side:THREE.DoubleSide})),0,1.0,0);g.userData.glow=s.material}break;
 case 'bed':add(mesh(rbox(.9,.35,1.7,.08),wood),0,0,0);add(mesh(rbox(.84,.16,1.5,.08),'#ffffff'),0,.35,.05);add(mesh(rbox(.86,.12,1.0,.06),'#7fb0e0'),0,.45,.32);add(mesh(rbox(.6,.14,.3,.07),'#fff6dc'),0,.5,-.55);add(mesh(rbox(.9,.7,.1,.05),wood),0,0,-.82);break;
 case 'shelf':add(mesh(rbox(.9,1.4,.4,.04),wood),0,0,0);[.35,.75,1.1].forEach((y,j)=>{for(let i=0;i<5;i++)add(mesh(box(.1,.28,.26),['#e05a4f','#5fb0e8','#ffd34d','#8cc152','#b77bd9'][(i+j)%5]),-.3+i*.15,y,.05)});break;
 case 'armchair':add(mesh(rbox(.9,.45,.8,.15),'#e58aa6'),0,0,0);add(mesh(rbox(.9,.5,.2,.1),'#e58aa6'),0,.4,-.3);add(mesh(rbox(.18,.3,.7,.08),'#d9718f'),-.38,.4,0);add(mesh(rbox(.18,.3,.7,.08),'#d9718f'),.38,.4,0);break;
 case 'rug':{const r=new THREE.Mesh(new THREE.CircleGeometry(.9,24),new THREE.MeshLambertMaterial({color:0xe58aa6}));r.rotation.x=-Math.PI/2;r.position.y=.02;r.receiveShadow=true;g.add(r);const r2=new THREE.Mesh(new THREE.CircleGeometry(.5,24),new THREE.MeshLambertMaterial({color:0xffd1de}));r2.rotation.x=-Math.PI/2;r2.position.y=.025;g.add(r2);g.userData.flat=true}break;
 case 'clock':add(mesh(rbox(.5,1.6,.35,.06),'#8a5a32'),0,0,0);add(mesh(cyl(.17,.17,.03,16),'#fff6dc'),0,1.3,.18).rotation.x=Math.PI/2;add(mesh(box(.02,.12,.02),'#333'),0,1.34,.2);add(mesh(sph(.06,8,6),'#ffd34d'),0,.6,.18);break;
 case 'radio':add(mesh(rbox(.6,.38,.25,.08),'#e05a4f'),0,0,0);add(mesh(cyl(.11,.11,.02,12),'#fff6dc'),-.14,.19,.13).rotation.x=Math.PI/2;add(mesh(box(.18,.12,.02),'#fff6dc'),.14,.2,.13);add(mesh(cyl(.01,.01,.4,4),'#555'),.2,.5,0).rotation.z=-.4;break;
 case 'vase':add(mesh(sph(.16,10,8),'#5fb0e8'),0,.16,0);add(mesh(cyl(.07,.1,.15,8),'#5fb0e8'),0,.33,0);[[-.06,'#ff8fbc'],[.06,'#ffd23a'],[0,'#e2333c']].forEach(([x,c],i)=>{add(mesh(cyl(.01,.01,.3,4),'#4f9e3a'),x,.5,0);add(mesh(sph(.06,6,5),c),x*1.6,.66+i*.03,0)});break;
 case 'kotatsu':add(mesh(rbox(1.2,.4,1.2,.12),'#d9534f'),0,0,0);add(mesh(rbox(1.0,.06,1.0,.03),wood),0,.4,0);add(mesh(sph(.08,8,6),'#ff9a1a'),.15,.5,0);add(mesh(sph(.08,8,6),'#ff9a1a'),.0,.5,.12);break;
 case 'lantern':add(mesh(cyl(.03,.03,.9,5),dark),0,.45,0);{const l=add(new THREE.Mesh(sph(.22,10,8),new THREE.MeshPhongMaterial({color:0xff6a4a,emissive:0x331100})),0,.95,0);l.scale.y=1.3;g.userData.glow=l.material}break;
 case 'beachchair':{const s=add(mesh(box(.6,.06,1.2),'#5fb0e8'),0,.3,0);s.rotation.x=-.35;add(mesh(box(.6,.04,.5),'#ffffff'),0,.36,.0).rotation.x=-.35;[[-.28,.4],[.28,.4],[-.28,-.4],[.28,-.4]].forEach(([x,z])=>add(mesh(box(.05,.3,.05),'#ddd'),x,.15,z))}break;
 case 'parasol':add(mesh(cyl(.03,.03,1.8,5),'#eee'),0,.9,0);for(let i=0;i<8;i++){const p=add(mesh(new THREE.ConeGeometry(1.0,.45,8,1,true,i/8*Math.PI*2,Math.PI/4),i%2?'#ffffff':'#ff6a5a',{side:THREE.DoubleSide}),0,1.85,0)}break;
 case 'xmastree':add(mesh(cyl(.08,.1,.3,6),dark),0,.15,0);[[.6,.6,.55],[.45,.5,.95],[.3,.45,1.3]].forEach(([r,h,y])=>add(mesh(new THREE.ConeGeometry(r,h,8),'#2f8f4a'),0,y,0));
  {const s=add(new THREE.Mesh(new THREE.OctahedronGeometry(.12),new THREE.MeshBasicMaterial({color:0xffe14d})),0,1.6,0);g.userData.glow2=s}
  [['#e2333c',.3,.6,.3],['#ffd23a',-.3,.7,.25],['#5fb0e8',.15,1.0,.32],['#ff8fbc',-.18,1.15,.2],['#e2333c',.05,.8,-.4]].forEach(([c,x,y,z])=>add(new THREE.Mesh(sph(.06,6,5),new THREE.MeshBasicMaterial({color:c})),x,y,z));break;
 case 'surfboard':{const b=add(mesh(sph(.5,12,8),'#5fd0c8'),0,.75,0);b.scale.set(.42,1.5,.08);const s=add(mesh(box(.04,1.4,.1),'#ffffff'),0,.75,.0)}add(mesh(box(.5,.08,.3),dark),0,.04,0);break;
 case 'arcade':add(mesh(rbox(.7,1.5,.6,.05),'#3d2f6b'),0,0,0);{const sc=add(new THREE.Mesh(box(.5,.4,.02),new THREE.MeshBasicMaterial({color:0x58e0ff})),0,1.1,.31);g.userData.screen=sc}add(mesh(box(.6,.08,.3),'#2a2050'),0,.8,.35);add(mesh(sph(.04,6,4),'#e2333c'),-.1,.86,.38);add(mesh(sph(.04,6,4),'#ffd23a'),.1,.86,.38);add(mesh(box(.68,.18,.04),'#ff79a8'),0,1.42,.3);break;
 case 'teaset':add(mesh(sph(.16,10,8),'#fbfbf6'),0,.16,0);add(mesh(cyl(.03,.03,.14,5),'#fbfbf6'),.18,.2,0).rotation.z=-1;add(mesh(sph(.04,6,4),'#5fb0e8'),0,.32,0);[[-.3,.1],[.25,.2]].forEach(([x,z])=>add(mesh(cyl(.07,.05,.08,8),'#fbfbf6'),x,.04,z));break;
 case 'honeypot':add(mesh(sph(.35,12,10),'#e8a33a'),0,.33,0);add(mesh(cyl(.2,.25,.12,10),'#e8a33a'),0,.68,0);add(mesh(sph(.3,10,6),'#ffcf3a'),0,.62,0).scale.y=.35;break;
 case 'beanplush':{const b=add(mesh(sph(.25,12,10),'#8cc152'),0,.38,0);b.scale.set(.8,1.5,.8);add(mesh(sph(.04,6,4),'#222'),-.07,.55,.18);add(mesh(sph(.04,6,4),'#222'),.07,.55,.18);add(mesh(box(.05,.06,.02),'#fff'),0,.44,.2);add(mesh(cyl(.02,.03,.18,5),'#5d8f2f'),0,.82,0).rotation.z=.6}break;
 case 'guitar':{const b=add(mesh(sph(.22,12,8),'#c98f4f'),0,.3,0);b.scale.set(1,1.2,.35);add(mesh(box(.07,.6,.05),'#8a5a32'),0,.8,0);add(mesh(cyl(.06,.06,.02,10),'#3b2a1a'),0,.32,.08).rotation.x=Math.PI/2}break;
 case 'snowman':add(mesh(sph(.35,12,10),'#ffffff'),0,.33,0);add(mesh(sph(.25,12,10),'#ffffff'),0,.82,0);add(mesh(new THREE.ConeGeometry(.04,.18,6),'#ff8a2a'),0,.82,.3).rotation.x=Math.PI/2;add(mesh(sph(.03,6,4),'#222'),-.08,.9,.22);add(mesh(sph(.03,6,4),'#222'),.08,.9,.22);add(mesh(cyl(.27,.27,.08,12),'#e05a4f'),0,.62,0);break;
 case 'tank':{add(mesh(rbox(.9,.1,.5,.03),'#555'),0,0,0);const gl=add(new THREE.Mesh(box(.86,.5,.46),new THREE.MeshPhongMaterial({color:0x7fd0f0,transparent:true,opacity:.45,shininess:80})),0,.36,0);
  const f=add(mesh(sph(.1,8,6),extra&&ITEMS[extra]&&ITEMS[extra].tint||'#ff9a3a'),0,.36,0);f.scale.set(1.6,.8,.6);g.userData.fish=f;add(mesh(rbox(.9,.06,.5,.02),'#555'),0,.6,0)}break;
 case 'cage':add(mesh(rbox(.5,.06,.4,.02),'#8a5a32'),0,0,0);add(new THREE.Mesh(box(.46,.36,.36),new THREE.MeshPhongMaterial({color:0xe8f4ff,transparent:true,opacity:.35})),0,.24,0);add(mesh(rbox(.5,.06,.4,.02),'#8a5a32'),0,.42,0);add(mesh(sph(.06,6,4),'#3a3a3a'),0,.12,0).scale.set(1.5,.6,1);break;
 case 'fstand':add(mesh(rbox(.6,.2,.6,.04),'#e9d7b0'),0,0,0);add(mesh(cyl(.04,.04,.4,6),'#8a5a32'),0,.4,0);add(mesh(sph(.2,8,6),'#c9a66b'),0,.7,0).scale.set(1.4,.8,.8);break;
 default:add(mesh(rbox(.6,.6,.6,.08),'#ccc'),0,0,0);
 }
 return g}

// ---------- player (chibi) ----------
const SKINS=['#ffe0c7','#f6c9a5','#e0a77e','#b97b52','#8a5636'];
const HAIRC=['#3b2a20','#6b4226','#a8692f','#e8c06a','#e86a5a','#ff9bbd','#6fa8e8','#f3f3f3'];
const HAIRS=['short','bob','bun','spiky','long'];
function faceTex(skin,eyes){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle=skin;x.fillRect(0,0,512,256);
 const cx=128,cy=140;x.fillStyle='#2a2230';
 if(eyes===1){x.lineWidth=7;x.strokeStyle='#2a2230';x.lineCap='round';[-26,26].forEach(o=>{x.beginPath();x.arc(cx+o,cy,10,Math.PI*1.1,Math.PI*1.9);x.stroke()})}
 else{[-26,26].forEach(o=>{x.beginPath();x.ellipse(cx+o,cy,eyes===2?8:9,eyes===2?11:15,0,0,Math.PI*2);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(cx+o+3,cy-5,4,0,Math.PI*2);x.fill();x.fillStyle='#2a2230'})}
 x.fillStyle='rgba(255,120,130,.45)';[-44,44].forEach(o=>{x.beginPath();x.ellipse(cx+o,cy+20,11,6,0,0,Math.PI*2);x.fill()});
 x.strokeStyle='#8a3b3b';x.lineWidth=4;x.beginPath();x.arc(cx,cy+18,7,.2,Math.PI-.2);x.stroke();
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t}
function patTex(c1,c2,pat){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle=c1;x.fillRect(0,0,128,128);x.fillStyle=c2;
 if(pat==='stripe')for(let i=0;i<128;i+=24)x.fillRect(0,i,128,10);
 else if(pat==='heart'){const h=(px,py,s)=>{x.beginPath();x.moveTo(px,py+s*.3);x.bezierCurveTo(px,py,px-s*.5,py,px-s*.5,py+s*.3);x.bezierCurveTo(px-s*.5,py+s*.6,px,py+s*.8,px,py+s);x.bezierCurveTo(px,py+s*.8,px+s*.5,py+s*.6,px+s*.5,py+s*.3);x.bezierCurveTo(px+s*.5,py,px,py,px,py+s*.3);x.fill()};h(32,44,30)}
 else if(pat==='flower')for(let i=0;i<6;i++){const px=(i*47)%128,py=(i*71)%128;for(let k=0;k<5;k++){x.beginPath();x.arc(px+Math.cos(k*1.26)*7,py+Math.sin(k*1.26)*7,6,0,7);x.fill()}}
 else if(pat==='dots')for(let i=0;i<128;i+=21)for(let j=0;j<128;j+=21){x.beginPath();x.arc(i+((j/21)%2)*10,j,4,0,7);x.fill()}
 else if(pat==='num9'){x.font='bold 64px Nunito,Arial';x.textAlign='center';x.fillText('9',32,80);x.fillRect(0,0,128,6)}
 else if(pat==='hood'){x.fillRect(0,0,128,14)}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function makePlayer(look){const g=new THREE.Group();const L=look;const skin=SKINS[L.skin|0],hc=HAIRC[L.hairC|0];
 const top=ITEMS[L.top]||ITEMS.t_white,bot=ITEMS[L.bottom]||ITEMS.b_shorts,sh=ITEMS[L.shoe]||ITEMS.s_sneak;
 const body=new THREE.Group();g.add(body);
 const legs=[];[-.1,.1].forEach(x=>{const lg=new THREE.Group();lg.position.set(x,.32,0);const l=mesh(cyl(.065,.07,.22,8),bot.pat==='skirt'?skin:bot.col);l.position.y=-.12;lg.add(l);const s=mesh(sph(.09,8,6),sh.col);s.scale.set(1,.6,1.35);s.position.set(0,-.25,.03);lg.add(s);body.add(lg);legs.push(lg)});
 const hip=mesh(cyl(.19,.2,.14,12),bot.col);hip.position.y=.36;body.add(hip);
 if(bot.pat==='skirt'){const sk=mesh(new THREE.ConeGeometry(.28,.24,12,1,true),bot.col,{side:THREE.DoubleSide});sk.position.y=.36;body.add(sk)}
 const tm=new THREE.MeshPhongMaterial({map:patTex(top.col,top.c2,top.pat),shininess:4});
 const torso=new THREE.Mesh(cyl(.16,.2,.3,12),tm);torso.castShadow=true;torso.position.y=.55;body.add(torso);
 if(top.pat==='hood'){const hd=mesh(sph(.14,8,6),top.c2);hd.scale.set(1.3,.6,.8);hd.position.set(0,.68,-.12);body.add(hd)}
 const arms=[];[-1,1].forEach(s=>{const a=new THREE.Group();a.position.set(s*.2,.66,0);const sl=new THREE.Mesh(cyl(.055,.06,.14,6),tm);sl.position.y=-.06;a.add(sl);const hnd=mesh(cyl(.045,.05,.12,6),skin);hnd.position.y=-.17;a.add(hnd);const fi=mesh(sph(.055,6,5),skin);fi.position.y=-.24;a.add(fi);a.rotation.z=s*.25;body.add(a);arms.push(a)});
 const head=new THREE.Group();head.position.y=.98;body.add(head);
 const hm=new THREE.MeshPhongMaterial({map:faceTex(skin,L.eyes|0),shininess:4});const hs=new THREE.Mesh(sph(.33,20,16),hm);hs.castShadow=true;head.add(hs);// u=.25 faces +z
 const hcM=mat(hc);
 const cap=new THREE.Mesh(new THREE.SphereGeometry(.35,20,12,0,Math.PI*2,0,Math.PI*.42),hcM);cap.castShadow=true;cap.rotation.x=-.35;cap.position.set(0,.02,-.02);head.add(cap);
 const back=new THREE.Mesh(new THREE.SphereGeometry(.345,16,12,Math.PI*.15,Math.PI*.7,0,Math.PI*.72),hcM);back.rotation.y=Math.PI;back.position.z=-.01;head.add(back);
 const hair=L.hair|0;
 if(hair===1){[-1,1].forEach(s=>{const b=new THREE.Mesh(sph(.17,10,8),hcM);b.scale.set(.7,1.3,1);b.position.set(s*.27,-.1,-.04);head.add(b)})}
 if(hair===2){const b=new THREE.Mesh(sph(.14,10,8),hcM);b.position.set(0,.36,-.1);head.add(b)}
 if(hair===3){for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.08,.2,6),hcM);const a=(i-2)*.38;c.position.set(Math.sin(a)*.22,.3,Math.cos(a)*.1-.05);c.rotation.z=-a*.8;c.rotation.x=-.4;head.add(c)}}
 if(hair===4){const b=new THREE.Mesh(cyl(.3,.34,.55,14),hcM);b.position.set(0,-.25,-.12);b.scale.z=.55;head.add(b)}
 const hat=ITEMS[L.hat];if(hat){const hg=new THREE.Group();hg.position.y=.2;head.add(hg);
  if(hat.pat==='straw'){hg.add(at(mesh(cyl(.5,.5,.03,18),hat.col),0,.06,0));hg.add(at(mesh(cyl(.26,.3,.2,14),hat.col),0,.16,0));hg.add(at(mesh(cyl(.305,.305,.06,14),hat.c2),0,.1,0))}
  else if(hat.pat==='beanie'){const b=mesh(new THREE.SphereGeometry(.36,16,10,0,Math.PI*2,0,Math.PI*.5),hat.col);b.position.y=-.05;hg.add(b);hg.add(at(mesh(cyl(.36,.36,.08,16),hat.c2),0,-.04,0));hg.add(at(mesh(sph(.09,8,6),hat.c2),0,.32,0))}
  else if(hat.pat==='cap'){const b=mesh(new THREE.SphereGeometry(.355,16,10,0,Math.PI*2,0,Math.PI*.5),hat.col);b.position.y=-.05;hg.add(b);const br=mesh(cyl(.22,.22,.03,14),hat.col);br.scale.z=.7;br.position.set(0,-.03,.32);hg.add(br)}
  else if(hat.pat==='crown'){for(let i=0;i<9;i++){const a=i/9*Math.PI*2;hg.add(at(mesh(sph(.07,6,5),i%2?hat.col:hat.c2),Math.cos(a)*.3,-.02,Math.sin(a)*.3))}}
  else if(hat.pat==='bean'){const b=mesh(sph(.2,10,8),hat.col);b.scale.set(1,1.4,1);b.position.y=.18;hg.add(b);hg.add(at(mesh(cyl(.02,.03,.15,5),hat.c2),0,.48,0))}}
 const held=new THREE.Group();arms[1].add(held);held.position.y=-.24;
 g.userData={body,legs,arms,head,held};return g}
function heldModel(tool){const g=new THREE.Group();
 if(tool==='rod'){const r=mesh(cyl(.012,.02,1.2,5),'#b07a3f');r.position.y=.5;r.rotation.x=.9;g.add(r)}
 else if(tool==='net'){const r=mesh(cyl(.015,.02,.8,5),'#b07a3f');r.position.y=.3;g.add(r);const h=new THREE.Mesh(new THREE.TorusGeometry(.18,.02,5,14),mat('#e8b04a'));h.position.y=.85;g.add(h);const n=new THREE.Mesh(sph(.17,8,6),new THREE.MeshPhongMaterial({color:0xffffff,transparent:true,opacity:.45}));n.scale.z=.4;n.position.y=.85;g.add(n);g.rotation.x=.5}
 else if(tool==='shovel'){const r=mesh(cyl(.015,.02,.8,5),'#b07a3f');r.position.y=.2;g.add(r);const b=mesh(sph(.13,8,6),'#9fb6c3');b.scale.set(1,1.3,.3);b.position.y=-.25;g.add(b)}
 else if(tool==='axe'){const r=mesh(cyl(.02,.025,.6,5),'#b07a3f');r.position.y=.2;g.add(r);const b=mesh(box(.18,.14,.04),'#9fb6c3');b.position.set(.08,.45,0);g.add(b)}
 else if(tool==='can'){const b=mesh(cyl(.1,.12,.18,10),'#7fc7e8');b.position.y=0;g.add(b);const s=mesh(cyl(.02,.03,.2,5),'#3b88ad');s.rotation.z=-1;s.position.set(.15,.05,0);g.add(s)}
 return g}

// ---------- emoji / sprite textures ----------
const _etex={};
function emojiCanvas(e,tint,size=96){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');x.font=Math.round(size*.78)+'px "Apple Color Emoji","Noto Color Emoji","Segoe UI Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,size/2,size*.55);
 if(tint){x.globalCompositeOperation='source-atop';x.globalAlpha=.55;x.fillStyle=tint;x.fillRect(0,0,size,size)}return c}
function emojiTex(e,tint){const k=e+tint;if(!_etex[k]){const t=new THREE.CanvasTexture(emojiCanvas(e,tint));t.encoding=THREE.sRGBEncoding;_etex[k]=t}return _etex[k]}
function itemSprite(id,s=.55){const it=ITEMS[id];let tex;
 if(it.svg){const k='svg'+id;if(!_etex[k]){const c=document.createElement('canvas');c.width=c.height=96;const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const im=new Image();im.onload=()=>{c.getContext('2d').drawImage(im,8,8,80,80);t.needsUpdate=true};
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(SVG[it.svg].replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" color="'+(it.col&&it.col[0]==='#'?it.col:'#ccc')+'" '));_etex[k]=t}tex=_etex[k]}
 else tex=emojiTex(it.e||'🎁',it.tint||'');
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthWrite:false}));sp.scale.set(s,s,s);sp.center.set(.5,.15);return sp}
function shadowBlob(r=.4){const m=new THREE.Mesh(new THREE.CircleGeometry(r,16),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.22,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.02;return m}
