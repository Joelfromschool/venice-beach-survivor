/* Heavy Stitch: combat engine (Three.js r149). v3: real procedural 3D character rigs (models.js) with jointed mech armor; cameras, drift, slash combos, supers, Dead Zone. */
'use strict';
function computeStats(cid,load){const ch=CHARS[cid],m=ch.mul||{ap:1,spd:1,en:1,fire:1,dash:1};const p=s=>load[s]?PARTS[load[s]]:null;
 const LV=(typeof HS!=='undefined'&&HS.state&&HS.state.lv)||{};const k=s=>1+.06*(load[s]?LV[load[s]]||0:0);
 const hd=p('head')||{},co=p('core')||{},ar=p('arms')||{},lg=p('legs')||PARTS.l_kick,bo=p('booster')||PARTS.b_puff,ge=p('gen')||PARTS.g_pocket,fc=p('fcs')||PARTS.f_peep;
 let weight=0;for(const s of SLOTS){if(s!=='legs'&&p(s))weight+=p(s).w;}
 const ap=Math.round(((hd.ap||0)*k('head')+(co.ap||0)*k('core')+(ar.ap||0)*k('arms')+(lg.ap||0)*k('legs'))*m.ap);
 const def=Math.round(((hd.def||0)*k('head')+(co.def||0)*k('core')+(ar.def||0)*k('arms')+(lg.def||0)*k('legs'))/4);
 const stab=(hd.stab||0)+(co.stab||0);const cap=lg.load;const over=Math.max(0,weight-cap);
 let spd=15*lg.spd*(.6+.4*bo.thrust)*m.spd;spd*=over>0?Math.max(.55,1-over/cap*2.2):1+(cap-weight)/cap*.12;
 const enb=co.enb||1;let fire=0;
 for(const s of['wr','wl','sh','bk']){const w=p(s);if(!w||!w.dmg)continue;let d=w.dmg*(w.pel||1)*(w.n||1)*(w.hits||1)*(w.rate||1);if(w.cls==='drones')d=w.dmg*2*2;if(w.cls==='pulse')d=w.dmg*w.rate;fire+=d*k(s);}
 fire*=m.fire*(ar.aim||1);
 return{ap,def,stab,load:cap,weight,over,spd,en:Math.round(ge.en*enb*m.en*k('gen')),regen:ge.regen*enb,delay:ge.delay,dash:bo.dash*m.dash,ab:bo.ab,use:bo.use,jump:lg.jump,
  range:fc.range*(hd.scan||1),lock:fc.lock,miss:fc.miss,aim:ar.aim||1,melee:ar.melee||1,fire:Math.round(fire),kits:3+((p('bk')&&p('bk').cls==='rack')?p('bk').kits:0)};}
const V3=THREE.Vector3;const _v=new V3(),_v2=new V3(),_v3=new V3();
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t;
function angDiff(a,b){let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d;}
const MOVES={pinco:{en:'PINK OVERDRIVE',ja:'ピンク・オーバードライブ'},pooh:{en:'HUNNY HAMMER',ja:'ハニー・ハンマー'},bean:{en:'POD SPLITTER',ja:'ポッド・スプリッター'},asmon:{en:'VIOLET OVERRIDE',ja:'バイオレット・オーバーライド'},
 pile:{en:'NEEDLE DRIVE',ja:'ニードル・ドライブ'},rail:{en:'SKYFALL RAIL',ja:'スカイフォール・レール'},laser:{en:'NEON BREAKER',ja:'ネオン・ブレイカー'}};
const SUPERS={pinco:{en:'PINK NOVA STORM',ja:'ピンク・ノヴァ・ストーム'},pooh:{en:'HUNNY METEOR',ja:'ハニー・メテオ'},bean:{en:'POD BIG BANG',ja:'ポッド・ビッグバン'},asmon:{en:'VIOLET APOCALYPSE',ja:'バイオレット・アポカリプス'}};
const G={on:false,paused:false,R:null,scene:null,cam:null,in:{},keys:{},stick:{x:0,y:0},camYaw:Math.PI,drag:null,quality:'high',
 init(){const cv=document.getElementById('gl');const mobile=matchMedia('(pointer:coarse)').matches;
  try{this.R=new THREE.WebGLRenderer({canvas:cv,antialias:!mobile,powerPreference:'high-performance'});}catch(e){this.noGL=true;this.bind();return;}this.R.outputEncoding=THREE.sRGBEncoding;
  this.cam=new THREE.PerspectiveCamera(62,1,.1,900);
  const gm=new Uint8Array([56,56,56,255,128,128,128,255,212,212,212,255]);this.grad=new THREE.DataTexture(gm,3,1);this.grad.minFilter=this.grad.magFilter=THREE.NearestFilter;this.grad.needsUpdate=true;
  this.texLoader=new THREE.TextureLoader();this.bind();addEventListener('resize',()=>this.resize());},
 setQuality(q){this.quality=q;if(this.R){const dpr=window.devicePixelRatio||1;this.R.setPixelRatio(Math.min(dpr,q==='high'?(matchMedia('(pointer:coarse)').matches?1.6:2):1));this.resize();}},
 resize(){if(!this.R)return;const cv=this.R.domElement;const w=cv.clientWidth||innerWidth,h=cv.clientHeight||innerHeight;this.R.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();},
 mat(col,em){return new THREE.MeshToonMaterial({color:col,gradientMap:this.grad,emissive:em||0x000000});},
 glowMat(col,op){return new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op==null?1:op,blending:THREE.AdditiveBlending,depthWrite:false});},
 box(w,h,d,col,em,outline){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),this.mat(col,em));if(outline!==false&&this.quality==='high')this.outline(m);return m;},
 outline(m){const o=new THREE.Mesh(m.geometry,this.inkMat||(this.inkMat=new THREE.MeshBasicMaterial({color:0x07080b,side:THREE.BackSide})));o.scale.setScalar(1.07);m.add(o);return m;},
 // ---------------- WORLD ----------------
 buildWorld(mapId){const M=MAPS[mapId];const sc=this.scene=new THREE.Scene();this.map=M;this.mapId=mapId;
  sc.background=new THREE.Color(M.sky);sc.fog=new THREE.Fog(M.fog,50,240);if(window.CH3D)try{sc.environment=CH3D.envFor(this.R);}catch(e){}this.dying=[];
  sc.add(new THREE.HemisphereLight(0xdfe6ff,new THREE.Color(M.ground).multiplyScalar(1.4),.5));
  const dl=new THREE.DirectionalLight(M.light,.8);dl.position.set(-40,70,30);sc.add(dl);const rl=new THREE.DirectionalLight(M.rim,.55);rl.position.set(50,20,-60);sc.add(rl);
  const bt=this.texLoader.load('art/'+M.bg+'.webp');bt.encoding=THREE.sRGBEncoding;bt.wrapS=THREE.MirroredRepeatWrapping;bt.repeat.set(4,1);
  const cyl=new THREE.Mesh(new THREE.CylinderGeometry(320,320,240,48,1,true),new THREE.MeshBasicMaterial({map:bt,side:THREE.BackSide,fog:false,depthWrite:false}));cyl.position.y=40;cyl.renderOrder=-2;sc.add(cyl);this.backdrop=cyl;
  const gc=document.createElement('canvas');gc.width=gc.height=256;const g=gc.getContext('2d');g.fillStyle=M.ground;g.fillRect(0,0,256,256);
  for(let i=0;i<900;i++){g.fillStyle=`rgba(${Math.random()<.5?'0,0,0':'255,255,255'},${Math.random()*.06})`;g.fillRect(Math.random()*256,Math.random()*256,2+Math.random()*6,2+Math.random()*3);}
  g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=3;g.strokeRect(0,0,256,256);g.strokeStyle='rgba(255,255,255,.06)';g.lineWidth=1;g.strokeRect(4,4,248,248);
  g.fillStyle='rgba(0,0,0,.35)';for(const[x,y]of[[8,8],[248,8],[8,248],[248,248]]){g.beginPath();g.arc(x,y,3,0,7);g.fill();}
  const gt=new THREE.CanvasTexture(gc);gt.wrapS=gt.wrapT=THREE.RepeatWrapping;gt.repeat.set(70,70);gt.encoding=THREE.sRGBEncoding;gt.anisotropy=4;
  const sky=M.props==='sky',gr=sky?M.r+10:560;
  const ground=new THREE.Mesh(sky?new THREE.CylinderGeometry(gr,gr*.7,6,6):new THREE.PlaneGeometry(gr,gr),new THREE.MeshLambertMaterial({map:gt}));
  if(sky){ground.position.y=-3;gt.repeat.set(14,14);}else ground.rotation.x=-Math.PI/2;sc.add(ground);
  const ring=new THREE.Mesh(new THREE.RingGeometry(M.r-.25,M.r+.25,96),this.glowMat(M.line,.55));ring.rotation.x=-Math.PI/2;ring.position.y=.03;sc.add(ring);
  for(let i=0;i<32;i++){const a=i/32*Math.PI*2;const p=this.box(.5,2.2,.5,0x22252e,0,false);p.position.set(Math.cos(a)*(M.r+1),1.1,Math.sin(a)*(M.r+1));sc.add(p);
   const l=new THREE.Mesh(new THREE.BoxGeometry(.56,.3,.56),this.glowMat(M.line));l.position.set(p.position.x,2.1,p.position.z);sc.add(l);}
  const hm=new THREE.Mesh(new THREE.RingGeometry(5,5.6,40),this.glowMat(M.line,.35));hm.rotation.x=-Math.PI/2;hm.position.y=.02;sc.add(hm);
  this.colliders=[];this.propList=[];this.buildProps(M);this.fxInit();},
 seed:1,srand(){this.seed=(this.seed*16807)%2147483647;return(this.seed-1)/2147483646;},
 addProp(m,x,z,r){m.position.x=x;m.position.z=z;this.scene.add(m);if(m.isMesh)this.propList.push(m);if(r)this.colliders.push({x,z,r});return m;},
 buildProps(M){const S=this.scene,R=()=>this.srand();this.seed=M.props.length*977+13;const rr=M.r;const hi=this.quality==='high';
  const ok=(x,z,clear)=>Math.hypot(x,z)>clear&&Math.hypot(x,z)<rr-4&&Math.hypot(x,z-24)>12;const k=M.props;if(k==='zone'){if(typeof Z!=='undefined')Z.build(this);return;}
  if(k==='yard'||k==='town'){const cols=k==='yard'?[0xff7a1a,0x2a8a96,0x8d939e,0x3a3f4b]:[0x9a5a3a,0x5a6a8a,0x8a7a4a,0x6a3a3a];
   for(let i=0;i<(k==='yard'?16:20);i++){let x,z;do{x=(R()-.5)*2*rr;z=(R()-.5)*2*rr;}while(!ok(x,z,16));
    if(k==='yard'){const c=this.box(7,2.8,2.8,cols[i%4]);c.rotation.y=R()*3;c.position.y=1.4;this.addProp(c,x,z,3.4);if(R()<.4){const c2=this.box(7,2.8,2.8,cols[(i+1)%4]);c2.position.set(0,2.8,0);c2.rotation.y=(R()-.5)*.4;c.add(c2);}}
    else{const h=3+R()*4,w=5+R()*4;const hs=this.box(w,h,w*.8,0x3a2e2a);hs.position.y=h/2;this.addProp(hs,x,z,w*.55);const roof=new THREE.Mesh(new THREE.BoxGeometry(w*1.1,.5,w*.92),this.mat(cols[i%4]));roof.position.y=h/2+.25;hs.add(roof);
     const win=new THREE.Mesh(new THREE.PlaneGeometry(w*.6,.35),this.glowMat(i%2?0xff3df0:0x2bfff1,.9));win.position.set(0,h*.15,w*.4+.01);hs.add(win);
     if(R()<.5)this.holo(hs,0,h/2+2.2,w*.4+.02,R()<.5?0xff3df0:0x2bfff1,w*.7);}}
   if(k==='yard'){const bb=this.box(.6,12,.6,0x22252e,0,false);bb.position.y=6;this.addProp(bb,-40,10,.6);this.holo(bb,0,5,0,0xff3df0,9);for(const s of[-1,1]){const p=this.box(1.2,18,1.2,0xff7a1a);p.position.y=9;this.addProp(p,s*30,-50,1.2);}const beam=this.box(62,1.4,1.6,0xff7a1a);beam.position.set(0,18,-50);S.add(beam);}}
  else if(k==='highway'){for(let i=0;i<6;i++){const s=i%2?1:-1;const pole=this.box(.5,10,.5,0x22252e,0,false);pole.position.y=5;this.addProp(pole,s*24,-60+i*24,.6);this.holo(pole,0,5,0,i%3?0xff3df0:0x2bfff1,6);}const road=new THREE.Mesh(new THREE.PlaneGeometry(22,600),new THREE.MeshLambertMaterial({color:0x1b1d22}));road.rotation.x=-Math.PI/2;road.position.y=.04;S.add(road);
   for(let z=-140;z<140;z+=8){const d=new THREE.Mesh(new THREE.PlaneGeometry(.4,3.4),this.glowMat(0xffd27a,.6));d.rotation.x=-Math.PI/2;d.position.set(0,.06,z);S.add(d);}
   for(const s of[-1,1]){for(let z=-70;z<=70;z+=18){const p=this.box(.4,7,.4,0x30343c,0,false);p.position.y=3.5;this.addProp(p,s*13,z,.6);const h=new THREE.Mesh(new THREE.BoxGeometry(1.6,.3,.6),this.glowMat(0xffb347));h.position.set(s*12.4,7,z);S.add(h);}
    const rail=this.box(.4,1,140,0x8d939e);rail.position.set(s*11.6,.5,0);S.add(rail);}
   for(let i=0;i<10;i++){const x=(R()<.5?-1:1)*(26+R()*30),z=(R()-.5)*120;const r=new THREE.Mesh(new THREE.DodecahedronGeometry(3+R()*4,0),this.mat(0x5a4038));r.scale.y=.7+R();r.position.y=1;if(hi)this.outline(r);this.addProp(r,x,z,4);}}
  else if(k==='factory'){for(let i=0;i<9;i++){let x,z;do{x=(R()-.5)*2*rr;z=(R()-.5)*2*rr;}while(!ok(x,z,20));const s=new THREE.Mesh(new THREE.CylinderGeometry(3,3.4,16,14),this.mat(0x6a6a70));s.position.y=8;if(hi)this.outline(s);this.addProp(s,x,z,3.6);
    const b=new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),this.glowMat(0xff3a2a));b.position.y=8.4;s.add(b);for(const y of[-3,2]){const band=new THREE.Mesh(new THREE.CylinderGeometry(3.15,3.15,.6,14),this.mat(0xff4a2a,0x401008));band.position.y=y;s.add(band);}}
   for(let i=0;i<6;i++){const p=this.box(18,1.2,1.2,0x4a4a50);p.position.set((R()-.5)*80,6+R()*4,(R()-.5)*80);p.rotation.y=R()*3;S.add(p);}}
  else if(k==='court'){const lines=new THREE.Mesh(new THREE.RingGeometry(7,7.5,48),this.glowMat(0xe8eef7,.5));lines.rotation.x=-Math.PI/2;lines.position.y=.05;S.add(lines);
   const mid=new THREE.Mesh(new THREE.PlaneGeometry(.5,80),this.glowMat(0xe8eef7,.4));mid.rotation.x=-Math.PI/2;mid.position.y=.05;S.add(mid);
   for(let i=0;i<14;i++){const a=i/14*Math.PI*2;const b=this.box(14,5+R()*3,6,0x3a4050);b.position.set(Math.cos(a)*(rr+8),2.5,Math.sin(a)*(rr+8));b.rotation.y=-a+Math.PI/2;b.rotation.z=.25;S.add(b);}
   for(const a of[.8,2.35,3.9,5.5]){const t=this.box(1,26,1,0x2a2e3a);t.position.y=13;this.addProp(t,Math.cos(a)*(rr+2),Math.sin(a)*(rr+2),1.2);const h=new THREE.Mesh(new THREE.BoxGeometry(4,2,.6),this.glowMat(0xdbe8ff));h.position.y=13.5;t.add(h);}}
  else if(k==='canyon'||k==='crater'){for(let i=0;i<(k==='canyon'?22:12);i++){let x,z;do{x=(R()-.5)*2*rr;z=(R()-.5)*2*rr;}while(!ok(x,z,14));const r=new THREE.Mesh(new THREE.DodecahedronGeometry(2+R()*4,0),this.mat(0x5a4038));r.scale.y=.6+R()*1.4;r.rotation.y=R()*3;r.position.y=1;if(hi)this.outline(r);this.addProp(r,x,z,3.4);}
   for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const c=new THREE.Mesh(new THREE.DodecahedronGeometry(10+R()*6,0),this.mat(0x3a2c28));c.scale.y=1.5+R();c.position.set(Math.cos(a)*(rr+16),6,Math.sin(a)*(rr+16));S.add(c);}
   for(let i=0;i<16;i++){const cr=new THREE.Mesh(new THREE.PlaneGeometry(.35,6+R()*10),this.glowMat(0x46e6ff,.6));cr.rotation.x=-Math.PI/2;cr.rotation.z=R()*3;cr.position.set((R()-.5)*rr*1.6,.05,(R()-.5)*rr*1.6);S.add(cr);}}
  else if(k==='sky'){for(let i=0;i<6;i++){const a=i/6*Math.PI*2+.3;const t=this.box(2,5+R()*4,2,0x3a4258);t.position.y=3;this.addProp(t,Math.cos(a)*(rr-8),Math.sin(a)*(rr-8),1.6);const l=new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),this.glowMat(0x5ab8ff));l.position.y=3.5;t.add(l);}}
  else if(k==='spire'){const sp=new THREE.Group();for(let i=0;i<7;i++){const b=this.box(30-i*3.6,22,30-i*3.6,0x2a2638);b.position.y=11+i*22;sp.add(b);const band=new THREE.Mesh(new THREE.BoxGeometry(31-i*3.6,.8,31-i*3.6),this.glowMat(0xc58cff,.7));band.position.y=i*22+21;sp.add(band);}sp.position.set(0,0,-170);S.add(sp);
   for(let i=0;i<10;i++){let x,z;do{x=(R()-.5)*2*rr;z=(R()-.5)*2*rr;}while(!ok(x,z,24));const b=this.box(4,3+R()*6,4,0x2a2638);b.position.y=2;this.addProp(b,x,z,2.8);}}
 },
 holo(parent,x,y,z,col,w){const c=document.createElement('canvas');c.width=256;c.height=96;const g=c.getContext('2d');const hx='#'+col.toString(16).padStart(6,'0');
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,256,96);g.strokeStyle=hx;g.lineWidth=6;g.strokeRect(4,4,248,88);g.fillStyle=hx;g.font='900 44px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';
  const words=['ネオン','LOOM','スクラップ','24H','HUSK','電脳','RAMEN','ZONE 9','危険','GLIMMER'];g.fillText(words[(this.holoN=(this.holoN||0)+1)%words.length],128,50);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.375),new THREE.MeshBasicMaterial({map:t,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,y,z);parent.add(m);return m;},
 // ---------------- FX POOLS ----------------
 fxInit(){const S=this.scene;const N=700;const geo=new THREE.BufferGeometry();this.pN=N;this.pPos=new Float32Array(N*3);this.pCol=new Float32Array(N*3);this.pSize=new Float32Array(N);this.pA=new Float32Array(N);
  geo.setAttribute('position',new THREE.BufferAttribute(this.pPos,3));geo.setAttribute('color',new THREE.BufferAttribute(this.pCol,3));geo.setAttribute('size',new THREE.BufferAttribute(this.pSize,1));geo.setAttribute('alpha',new THREE.BufferAttribute(this.pA,1));
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{scale:{value:innerHeight}},
   vertexShader:'attribute float size;attribute float alpha;attribute vec3 color;varying vec3 vC;varying float vA;uniform float scale;void main(){vC=color;vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*scale/(-mv.z);gl_Position=projectionMatrix*mv;}',
   fragmentShader:'varying vec3 vC;varying float vA;void main(){vec2 d=gl_PointCoord-.5;float r=length(d);if(r>.5)discard;float a=smoothstep(.5,.0,r);gl_FragColor=vec4(vC*(.6+a),vA*a);}'});
  this.pts=new THREE.Points(geo,mat);this.pts.frustumCulled=false;S.add(this.pts);this.parts=[];for(let i=0;i<N;i++){this.parts.push({life:0});this.pA[i]=0;}this.pI=0;
  this.shotGeo=new THREE.BoxGeometry(.18,.18,1.6);this.ballGeo=new THREE.SphereGeometry(.35,8,6);this.misGeo=new THREE.ConeGeometry(.22,1,6);this.misGeo.rotateX(Math.PI/2);
  this.shots=[];this.eshots=[];this.beams=[];this.rings=[];this.decals=[];this.matCache={};},
 gm(col,op){const k=col+'_'+(op||1);return this.matCache[k]||(this.matCache[k]=this.glowMat(col,op));},
 puff(p,v,col,size,life,grav){const i=this.pI;this.pI=(this.pI+1)%this.pN;const q=this.parts[i];q.life=q.max=life;q.x=p.x;q.y=p.y;q.z=p.z;q.vx=v?v.x:0;q.vy=v?v.y:0;q.vz=v?v.z:0;q.s=size;q.g=grav||0;
  const c=this._c||(this._c=new THREE.Color());c.set(col);this.pCol[i*3]=c.r;this.pCol[i*3+1]=c.g;this.pCol[i*3+2]=c.b;},
 burst(p,col,n,spd,size,life){const v=new V3();for(let i=0;i<n;i++){v.set(rnd(-1,1),rnd(-.4,1),rnd(-1,1)).normalize().multiplyScalar(rnd(.3,1)*spd);this.puff(p,v,col,size*rnd(.6,1.2),life*rnd(.6,1.1),-6);}},
 updParts(dt){const P=this.pPos;for(let i=0;i<this.pN;i++){const q=this.parts[i];if(q.life<=0){this.pA[i]=0;continue;}q.life-=dt;q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;q.vx*=.96;q.vz*=.96;
   P[i*3]=q.x;P[i*3+1]=q.y;P[i*3+2]=q.z;const t=Math.max(0,q.life/q.max);this.pA[i]=t;this.pSize[i]=q.s*(.5+t*.5);}
  const g=this.pts.geometry;g.attributes.position.needsUpdate=g.attributes.alpha.needsUpdate=g.attributes.size.needsUpdate=g.attributes.color.needsUpdate=true;this.pts.material.uniforms.scale.value=this.R.domElement.clientHeight*.9;},
 ringFx(p,col,r0,r1,life,flat){const m=new THREE.Mesh(new THREE.RingGeometry(.8,1,40),this.glowMat(col,.9));m.position.copy(p);if(flat!==false)m.rotation.x=-Math.PI/2;else m.lookAt(this.cam.position);this.scene.add(m);this.rings.push({m,t:0,life,r0,r1});return m;},
 beamFx(a,b,col,w,life){const len=a.distanceTo(b);const m=new THREE.Mesh(new THREE.CylinderGeometry(w,w,len,8,1,true),this.glowMat(col,.95));m.position.copy(a).lerp(b,.5);m.quaternion.setFromUnitVectors(new V3(0,1,0),b.clone().sub(a).normalize());this.scene.add(m);
  const core=new THREE.Mesh(new THREE.CylinderGeometry(w*.35,w*.35,len,6,1,true),this.glowMat(0xffffff,1));m.add(core);this.beams.push({m,t:0,life});},
 slashFx(p,dir,col,big){const s=big?1.25:.85;const m=new THREE.Mesh(new THREE.RingGeometry(2.4*s,3*s,24,1,-1.2,2.4),this.glowMat(col,.85));m.material.side=THREE.DoubleSide;m.position.copy(p);m.position.y+=1.8;
  m.lookAt(p.x+dir.x,p.y+1.8,p.z+dir.z);m.rotateX(-Math.PI/2+rnd(-.5,.5));m.rotateZ(Math.PI/2);this.scene.add(m);this.rings.push({m,t:0,life:.22,r0:1,r1:1.25,slash:1});},
 decal(p,r,col,life){const m=new THREE.Mesh(new THREE.CircleGeometry(r,28),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.35,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(p.x,.06,p.z);this.scene.add(m);
  const e=new THREE.Mesh(new THREE.RingGeometry(r-.2,r,28),this.glowMat(col,.9));e.position.z=.001;m.add(e);const d={m,t:0,life};this.decals.push(d);return d;},
 // ---------------- UNITS ----------------
 makeSprite(comp,h){const tex=new THREE.CanvasTexture(comp.canvas);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=4;const w=h*comp.W/comp.H;const geo=new THREE.PlaneGeometry(w,h);
  const footOff=(1-comp.feetY/comp.H)*h;geo.translate(0,h/2-footOff,0);const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.04,side:THREE.DoubleSide}));
  m.userData={w,h,footOff,comp};const sh=new THREE.Mesh(new THREE.CircleGeometry(1.4,20),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.45,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.04;
  const grp=new THREE.Group();grp.add(m);this.scene.add(grp);this.scene.add(sh);return{grp,spr:m,shadow:sh};},
 // v3: real 3D chassis model (turns, animates, armour on joints)
 makeModel(cid,load,paint){const rig=CH3D.build(cid,load,paint,{});const grp=new THREE.Group();grp.add(rig.root);this.scene.add(grp);
  const sh=new THREE.Mesh(new THREE.CircleGeometry(1.4,20),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.45,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.04;this.scene.add(sh);
  return{grp,rig,shadow:sh,yaw:0};},
 sock(u,k,out){out=out||new V3();const o=u.rig&&(u.rig.S[k]||u.rig.S.center);if(o)return o.getWorldPosition(out);return out.copy(u.pos).setY(u.pos.y+2.4);},
 nozW(u){const L=u.rig&&u.rig.S.noz;if(L&&L.length)return L.map(o=>o.getWorldPosition(new V3()));if(u.comp&&u.spr){const t=[];for(const n of u.comp.anchors.noz)t.push(this.anchorWorld(u,n[0],n[1],new V3()));return t;}
  const b=new V3(-Math.sin(u.yaw||0),0,-Math.cos(u.yaw||0));return[u.pos.clone().addScaledVector(b,.9).setY(u.pos.y+2.2)];},
 animP(dt){const P=this.P;if(!P||!P.rig)return;const T=this.lock&&this.lock.alive?this.lock:null;const sp=Math.hypot(P.vel.x,P.vel.z);
  const firing=this.in.fr||this.in.fl||this.in.sp;let want=P.yaw;
  if(P.ap>0){if(P.lunge&&P.lunge.tgt&&P.lunge.tgt.alive){const d=P.lunge.tgt.pos;want=Math.atan2(d.x-P.pos.x,d.z-P.pos.z);}
   else if(T)want=Math.atan2(T.pos.x-P.pos.x,T.pos.z-P.pos.z);else if(firing||P.lunge||this.camMode!=='third')want=this.camYaw;else if(sp>2.5)want=Math.atan2(P.vel.x,P.vel.z);}
  const lat=P.vel.x*Math.cos(P.yaw)-P.vel.z*Math.sin(P.yaw);if(P.driftT>0)want+=clamp(lat*.03,-.6,.6);
  P.yaw+=angDiff(P.yaw,want)*clamp((P.driftT>0?5:11)*dt,0,1);P.grp.rotation.y=P.yaw;
  const c=Math.cos(P.yaw),s=Math.sin(P.yaw);const lx=P.vel.x*c-P.vel.z*s,lz=P.vel.x*s+P.vel.z*c;
  let pitch=0;if(T){const tp=this.aimPoint(T,0,P.pos);const dy=tp.y-(P.pos.y+2.6),dh=Math.hypot(tp.x-P.pos.x,tp.z-P.pos.z);pitch=clamp(Math.atan2(dy,dh),-.7,.9);}
  const gun=s2=>{const W=P.W[s2];return W&&!['blade','pile','rack','drones','pulse'].includes(W.p.cls);};
  const up=this.in.up&&!P.enOut&&P.en>0;const bank=P.driftT>0?Math.sign(lat||1)*-1:clamp(-lat*.035,-.8,.8);
  P.rig.update(dt,{spd:Math.min(1,sp/Math.max(6,P.st.spd)),mvA:Math.atan2(lx,lz),air:!P.grounded,boost:P.abOn?1:P.dashT>0?.8:up?.45:0,bank:-bank,pitch,
   aimR:gun('wr')&&(this.in.fr||!!T),aimL:gun('wl')&&(this.in.fl||!!T),dead:P.ap<=0,spinFast:this.in.sp&&P.active==='sh'});},
 updDying(dt){if(!this.dying||!this.dying.length)return;for(const e of this.dying){e.dieT-=dt;if(e.rig)e.rig.update(dt,{dead:true});if(e.pos.y>0)e.pos.y=Math.max(0,e.pos.y-dt*8);e.grp.position.copy(e.pos);
   if(e.dieT<=0){this.scene.remove(e.grp);this.scene.remove(e.shadow);}}this.dying=this.dying.filter(e=>e.dieT>0);},
 anchorWorld(u,ax,ay,out){const d=u.spr.userData;const lx=(ax/d.comp.W-.5)*d.w,ly=(1-ay/d.comp.H)*d.h-d.footOff+(u.spr.position.y||0);
  const r=this._r||(this._r=new V3());r.set(Math.cos(u.grp.rotation.y),0,-Math.sin(u.grp.rotation.y));return out.copy(u.pos).addScaledVector(r,lx).setY(u.pos.y+ly);},
 foeMesh(t){const g=new THREE.Group();const hi=this.quality==='high';const add=(m,x,y,z)=>{m.position.set(x,y,z);g.add(m);return m;};const ol=m=>{if(hi)this.outline(m);return m;};
  switch(t){
  case'dummy':{const o=ol(new THREE.Mesh(new THREE.OctahedronGeometry(1.2,0),this.mat(0xff7a1a)));add(o,0,0,0);add(new THREE.Mesh(new THREE.TorusGeometry(1.7,.12,6,24),this.glowMat(0x4ef0ff,.8)),0,0,0);g.userData.spin=o;break;}
  case'spindle':{const c=ol(new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,1.5,10),this.mat(0x8d939e)));c.rotation.z=Math.PI/2;add(c,0,0,0);
   for(const s of[-1,1]){const d=ol(new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,.22,14),this.mat(0x2a2e3a)));d.rotation.z=Math.PI/2;add(d,s*.85,0,0);}
   const th=new THREE.Mesh(new THREE.TorusGeometry(.62,.09,6,16),this.glowMat(0x4ef0ff,.8));th.rotation.y=Math.PI/2;add(th,0,0,0);g.userData.eye=add(new THREE.Mesh(new THREE.SphereGeometry(.32,10,8),this.glowMat(0xff3a2a)),0,0,.55);break;}
  case'walker':{add(this.box(1.8,1.1,1.4,0x6a6f7a),0,2.6,0);add(this.box(.9,.6,.9,0x3a3f4b),0,3.3,.4);g.userData.eye=add(new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),this.glowMat(0xff3a2a)),0,3.3,.88);
   for(const s of[-1,1]){const l=this.box(.35,2.4,.35,0x3a3f4b);l.rotation.x=.35;add(l,s*.6,1.2,-.2);add(this.box(.6,.2,1,0x2a2e3a),s*.6,.1,.2);const bl=this.box(.12,.5,2.4,0xd5dae2);bl.rotation.x=-.3;add(bl,s*1.05,2.4,.9);}break;}
  case'tank':{add(this.box(3,1.1,3.8,0x5a5f4a),0,1.1,0);for(const s of[-1,1])add(this.box(.7,.9,4.1,0x22252e),s*1.75,.5,0);add(ol(new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.3,.9,10),this.mat(0x6a6f5a))),0,2.1,-.2);
   add(this.box(.35,.35,2.6,0x2a2e3a),0,2.3,1.3);add(new THREE.Mesh(new THREE.BoxGeometry(3.05,.2,1),this.mat(0xff7a1a)),0,1.4,1.2);g.userData.eye=add(new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),this.glowMat(0xff3a2a)),0,2.5,.8);break;}
  case'turret':{add(ol(new THREE.Mesh(new THREE.CylinderGeometry(1.6,2,1.2,10),this.mat(0x3a3f4b))),0,.6,0);const hd=add(this.box(2,1.4,1.6,0x8d939e),0,1.9,0);
   for(let i=0;i<3;i++){const tb=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.3,8),this.glowMat(0xff3a2a));tb.rotation.x=Math.PI/2;tb.position.set(-.6+i*.6,.2,.82);hd.add(tb);g.userData.eye=tb;}g.userData.head=hd;break;}
  case'pylon':{add(ol(new THREE.Mesh(new THREE.CylinderGeometry(1.6,2.2,8,10),this.mat(0x4a4a52))),0,4,0);for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.9,.18,6,20),this.glowMat(0x4ef0ff,.9));r.rotation.x=Math.PI/2;add(r,0,1.8+i*2.2,0);}
   add(new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,30,6,1,true),this.glowMat(0x4ef0ff,.18)),0,20,0);break;}
  case'gate':{for(const s of[-1,1])add(this.box(2.4,12,2.4,0x4a4a52),s*6,6,0);add(this.box(14.4,2.4,2.4,0x4a4a52),0,12,0);g.userData.eye=add(new THREE.Mesh(new THREE.SphereGeometry(2.4,16,12),this.mat(0xff3a2a,0x801010)),0,6,0);
   g.userData.spin=add(new THREE.Mesh(new THREE.TorusGeometry(3.2,.25,6,28),this.glowMat(0xff7a1a,.8)),0,6,0);break;}
  case'jammer':{for(let i=0;i<4;i++){const l=this.box(.3,16,.3,0x8d939e);const a=i/4*Math.PI*2;add(l,Math.cos(a)*1.2,8,Math.sin(a)*1.2);}
   const d=new THREE.Mesh(new THREE.SphereGeometry(2,14,8,0,Math.PI*2,0,1.1),this.mat(0xe8e8ee));d.rotation.x=-.8;add(d,0,15,0);g.userData.eye=add(new THREE.Mesh(new THREE.SphereGeometry(.6,8,6),this.glowMat(0xff3a2a)),0,16.5,0);add(this.box(4,2,4,0x3a3f4b),0,1,0);break;}
  case'anchor':{add(ol(new THREE.Mesh(new THREE.CylinderGeometry(2.2,3,9,8),this.mat(0x2a2638))),0,4.5,0);
   const c=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,160,6,1,true),this.glowMat(0xc58cff,.5));c.rotation.x=.75;add(c,0,60,-55);g.userData.eye=add(new THREE.Mesh(new THREE.SphereGeometry(1.2,12,8),this.glowMat(0xc58cff)),0,9.5,0);break;}
  case'heart':{g.userData.spin=add(new THREE.Mesh(new THREE.IcosahedronGeometry(3.6,1),this.mat(0x6a3ab0,0x401a80)),0,7,0);for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(5+i*1.2,.2,6,36),this.glowMat(0xc58cff,.7));r.rotation.set(i,i*.7,0);add(r,0,7,0);g.userData['r'+i]=r;}
   add(this.box(10,3,10,0x2a2638),0,1.5,0);break;}
  case'truck':{add(this.box(2.6,2.2,2.2,0x3a3f4b),0,1.5,2.4);add(this.box(2.8,2.6,5,0xffc21f),0,1.7,-1.3);add(new THREE.Mesh(new THREE.BoxGeometry(2.85,.4,5.05),this.mat(0x141414)),0,1.2,-1.3);
   for(const s of[-1,1])for(const z of[-3,0,2.4]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.4,10),this.mat(0x111111));w.rotation.z=Math.PI/2;add(w,s*1.4,.55,z);}add(new THREE.Mesh(new THREE.BoxGeometry(2,.3,.1),this.glowMat(0xffe6a0)),0,1.3,3.52);break;}
  case'gen':{add(ol(new THREE.Mesh(new THREE.CylinderGeometry(3,3.6,5,14),this.mat(0x3a3f4b))),0,2.5,0);const r=new THREE.Mesh(new THREE.TorusGeometry(3.3,.3,8,30),this.glowMat(0x4ef0ff));r.rotation.x=Math.PI/2;add(r,0,3.5,0);
   add(new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,3,12),this.glowMat(0x4ef0ff,.7)),0,6,0);break;}
  case'lantern':{add(this.box(4,1.6,4,0x22252e),0,.8,0);add(this.box(1.2,9,1.2,0x3a3f4b),0,5,0);for(const y of[3,5.5,8])add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.3,1.5),this.glowMat(0xffd23a,.9)),0,y,0);
   const l=new THREE.Mesh(new THREE.OctahedronGeometry(2.4,0),this.mat(0x2bfff1,0x10a0a0));add(l,0,11.5,0);g.userData.spin=l;add(new THREE.Mesh(new THREE.SphereGeometry(4.2,16,12),this.glowMat(0x2bfff1,.2)),0,11.5,0);
   add(new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,40,8,1,true),this.glowMat(0x2bfff1,.25)),0,32,0);break;}
  }
  this.scene.add(g);return g;},
 bossMesh(){const g=new THREE.Group();g.add(this.box(9,3.2,7,0x6a6a72));const top=this.box(6,1.8,5,0x4a4a52);top.position.y=2.4;g.add(top);
  const loom=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,7,12),this.mat(0x8d939e));loom.rotation.z=Math.PI/2;loom.position.set(0,3.8,1.5);if(this.quality==='high')this.outline(loom);g.add(loom);
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.8,12,8),this.glowMat(0xff3a2a));eye.position.set(0,1,3.6);g.add(eye);
  const stripe=new THREE.Mesh(new THREE.BoxGeometry(9.1,.5,7.1),this.mat(0xff7a1a));stripe.position.y=-1;g.add(stripe);
  const core=new THREE.Mesh(new THREE.SphereGeometry(1.6,16,12),this.mat(0x4ef0ff,0x2090a0));core.position.y=-2.2;g.add(core);
  for(const s of[-1,1]){const pod=this.box(1.6,1.6,2.4,0x3a3f4b);pod.position.set(s*3.6,2.6,-1);g.add(pod);}
  const legs=[];for(const[sx,sz]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const up=this.box(1,1,1,0x4a4a52),lo=this.box(.9,1,.9,0x3a3f4b),j=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),this.mat(0xffb347,0xa05010)),ft=this.box(2.2,.6,2.2,0x2a2e3a);
   this.scene.add(up);this.scene.add(lo);this.scene.add(j);this.scene.add(ft);legs.push({up,lo,j,ft,sx,sz});}
  this.scene.add(g);return{g,core,eye,legs,loom};},
 // ---------------- MISSION START ----------------
 async start(mission,charId,load,paintId){if(this.noGL){HS.toast(HS.lang==='ja'?'この端末ではWebGLが使えません':'This device could not start WebGL (3D). Try another browser.',5000);HS.show('sMenu');return;}this.cleanup();this.setQuality(HS.state.opt.q||'high');this.buildWorld(mission.map);this.resize();
  const st=computeStats(charId,load);const P=this.P={cid:charId,load,st,pos:new V3(0,0,24),vel:new V3(),ap:st.ap,apMax:st.ap,en:st.en,enMax:st.en,enDelay:0,enOut:false,
   kits:st.kits,kitsMax:st.kits,shock:0,stun:0,abOn:false,dashT:0,lunge:null,shield:0,grounded:true,dmgTaken:0,kitsUsed:0,drones:[],lean:0,driftT:0,driftCd:0,slashN:0,slashT:0,slashCd:0,sup:0};
  const paint=PAINTS.find(p=>p.id===paintId)||PAINTS[0];this.paint=paint;
  const comp=await composeAsync(charId,load,paint,{scale:1.5});P.comp=comp;if(!this.on&&!this.scene)return;
  if(window.CH3D){try{Object.assign(P,this.makeModel(charId,load,paint));P.yaw=this.camYaw;P.grp.rotation.y=P.yaw;}catch(e){console.warn('3D model failed, sprite fallback',e);Object.assign(P,this.makeSprite(comp,charId==='pooh'?4.4:4.6));}}else Object.assign(P,this.makeSprite(comp,charId==='pooh'?4.4:4.6));
  P.W={};for(const s of['wr','wl','sh','bk']){const w=load[s]?PARTS[load[s]]:null;P.W[s]=w?{p:w,cd:0,mag:w.mag||0,rl:0,held:0}:null;}
  P.active=P.W.sh?'sh':'bk';if(mission.zombie)for(const s of['wr','wl','sh','bk']){const W=P.W[s];if(W&&W.p.mag)W.res=W.p.mag*6;}
  this.mission=mission;this.phaseI=-1;this.t=0;this.E=[];this.allies=[];this.objs=[];this.slow=0;this.shake=0;this.lock=null;this.result=null;this.resultShown=false;this.endT=0;this.boss=null;this.lowWarned=false;
  this.wave=0;this.waves=[];this.extra=null;this.phWait=0;this.manualT=0;this.camYaw=Math.PI;if(this.P&&this.P.rig){this.P.yaw=Math.PI;this.P.grp.rotation.y=Math.PI;}this.cutinT=0;this.cutinCd=0;this.stats={kills:0};this.clearInput();this.combo=0;this.comboT=0;this.comboBest=0;this.hitStop=0;this.banterCd=8;this.hypeI=0;this.boxes=[];this.camMode=HS.state.opt.cam||'shoulder';this.applyCam();
  this.on=true;this.paused=false;HUD.reset();this.nextPhase();
  AU.playMusic(mission.zombie?'zombie':['m7','m8','m9','f2'].includes(mission.id)?'boss':'sortie');
  this.cam.position.set(0,8,40);this.last=performance.now();cancelAnimationFrame(this.raf);this.raf=requestAnimationFrame(t=>this.frame(t));},
 cleanup(){cancelAnimationFrame(this.raf);this.on=false;const ck=document.getElementById('cockpit');if(ck)ck.classList.remove('on');document.body.classList.remove('zmode');document.getElementById('fxLines').classList.remove('on');if(this.scene){this.scene.traverse(o=>{if(o.userData&&o.userData.keep)return;if(o.geometry)o.geometry.dispose();if(o.material){const m=o.material;if(m.map)m.map.dispose();if(m.dispose)m.dispose();}});}this.scene=null;this.P=null;AU.boost(0);},
 // ---------------- PHASES ----------------
 nextPhase(){this.phaseI++;const M=this.mission;const ph=M.phases[this.phaseI];if(!ph){return this.finish(true);}
  this.ph=ph;this.phT=0;const D=this.phData={};this.objs=[];HUD.objective(ph,this.phaseI,M.phases.length);
  if(ph.tip)HUD.tip(HS.T(ph.tip));if(ph.comm)setTimeout(()=>{if(this.on)HUD.comm(COMMS[ph.comm]);},900);if(this.phaseI>0)AU.play('warn');
  switch(ph.type){
  case'reach':D.at=new V3(ph.at[0],0,ph.at[1]);D.hold=0;this.objs=[{pos:D.at,kind:'reach'}];if(ph.spawn)this.spawnList(ph.spawn);
   const bm=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,60,16,1,true),this.glowMat(0x4ef0ff,.18));bm.position.set(D.at.x,30,D.at.z);this.scene.add(bm);D.beam=bm;this.ringFx(D.at.clone().setY(.1),0x4ef0ff,6,6,9999);break;
  case'kill':this.spawnList(ph.spawn,ph.need);break;
  case'escort':D.trucks=[];for(let i=0;i<ph.trucks;i++){const m=this.foeMesh('truck');const t={pos:new V3((i-1)*5,0,ph.from-i*9),mesh:m,ap:3600,apMax:3600,alive:true,r:2.4,type:'truck'};m.position.copy(t.pos);D.trucks.push(t);m.traverse(o=>{if(o.isMesh&&o.material&&o.material.type!=='MeshBasicMaterial')this.propList.push(o);});}
   D.waveI=0;this.P.pos.set(0,0,ph.from+14);this.camYaw=0;this.objs=D.trucks.map(t=>({u:t,kind:'ally'}));break;
  case'defend':{const k=this.mapId==='town'?'lantern':'gen';const m=this.foeMesh(k);D.core={pos:new V3(0,0,0),mesh:m,ap:ph.hp,apMax:ph.hp,alive:true,r:3.5,type:k};D.waveI=-1;D.breakT=2;this.colliders.push({x:0,z:0,r:3.8});this.objs=[{u:D.core,kind:'ally'}];
   this.P.pos.set(0,0,12);break;}
  case'duel':{const a=this.spawnAce(ph.ace,false);D.ace=a;a.pos.set(this.P.pos.x+rnd(-8,8),0,this.P.pos.z-34);D.addT=ph.adds?ph.adds[0].every*.5:0;HUD.boss(a);HUD.stamp(ACES[ph.ace].frame[HS.lang]);AU.play('hitst');break;}
  case'boss':this.spawnBoss();break;
  case'survive':D.need=ph.kills;D.k0=this.stats.kills;break;
  case'endless':D.breakT=2;break;
  case'zombie':Z.begin(this);break;}},
 ringPos(c,i,n){const a=i/n*Math.PI*2+rnd(-.2,.2);return new V3(c[0]+Math.cos(a)*c[2],0,c[1]+Math.sin(a)*c[2]);},
 spawnList(list,need){for(const s of list){for(let i=0;i<s.n;i++){let p;if(s.at)p=new V3(s.at[0],0,s.at[1]);else if(s.ring)p=this.ringPos(s.ring,i,s.n);else{const a=rnd(0,Math.PI*2);p=new V3(Math.cos(a)*(this.map.r-8),0,Math.sin(a)*(this.map.r-8));}
  const e=this.spawn(s.t,p);if(s.y)e.baseY=e.pos.y=s.y;if(s.shock!=null)e.shockMax=s.shock;e.need=need?s.t===need:true;}}},
 spawn(t,pos,mult){const F=FOES[t];mult=mult||1;const e={type:t,pos:pos.clone(),vel:new V3(),ap:F.ap*mult,apMax:F.ap*mult,shock:0,shockMax:F.shock,stag:0,cd:rnd(1,2.5),r:F.r,alive:true,mesh:this.foeMesh(t),t:rnd(0,9),
   baseY:t==='spindle'?rnd(4.5,8):t==='dummy'?3:0,name:F.name,cr:F.cr||0,need:true,static:['turret','pylon','gate','jammer','anchor','heart','dummy'].includes(t)};
  if(e.static&&t!=='dummy')this.colliders.push(e.col={x:pos.x,z:pos.z,r:e.r*.9});
  e.pos.y=e.baseY;e.mesh.position.copy(e.pos);this.E.push(e);this.ringFx(new V3(pos.x,.1,pos.z),0xff3a2a,.5,4,.5);return e;},
 spawnAce(id,ally){const A=ACES[id];const e={type:'ace',ace:id,pos:new V3(),vel:new V3(),ap:A.ap,apMax:A.ap,shock:0,shockMax:A.shock,stag:0,cd:2,mcd:5,bcd:4,dcd:1.5,r:1.6,alive:true,name:CHARS[A.char].name,frame:A.frame,ally:!!ally,spd:A.spd,t:0,cr:4000,need:true,y:0,lean:0};
  e.ready=false;const sc=this.scene;let ok=false;if(window.CH3D){try{Object.assign(e,this.makeModel(A.char,A.load,A.paint));e.yaw=0;e.ready=true;ok=true;}catch(err){console.warn('ace model',err);}}
  if(!ok)composeAsync(A.char,A.load,A.paint,{scale:1.3}).then(c=>{if(!this.on||this.scene!==sc)return;e.comp=c;Object.assign(e,this.makeSprite(c,A.char==='dkermit'?5:4.6));e.ready=true;});
  if(ally)this.allies.push(e);else this.E.push(e);return e;},
 spawnBoss(){const B=this.bossMesh();const F=FOES.boss;const e={type:'boss',pos:new V3(0,0,-30),vel:new V3(),ap:F.ap,apMax:F.ap,shock:0,shockMax:F.shock,stag:0,r:6,alive:true,name:F.name,B,need:true,legs:[],kneel:0,mcd:6,lcd:11,scd:5,cr:F.cr,yaw:0,h:9,t:0};
  for(let i=0;i<4;i++){const L={type:'bleg',pos:new V3(),ap:5200,apMax:5200,shock:0,shockMax:0,r:1.6,alive:true,boss:e,i,name:{en:'Leg joint',ja:'脚の関節'},need:false,stag:0,cr:500,vel:new V3()};e.legs.push(L);this.E.push(L);}
  this.E.push(e);this.boss=e;HUD.boss(e);},
 // ---------------- MAIN LOOP ----------------
 frame(now){if(!this.on)return;this.raf=requestAnimationFrame(t=>this.frame(t));let dt=Math.min(.05,(now-this.last)/1000);this.last=now;
  if(this.paused||!this.P){this.render();return;}
  this.slow=Math.max(0,this.slow-dt);this.cutinT=Math.max(0,this.cutinT-dt);this.cutinCd=Math.max(0,this.cutinCd-dt);
  if(this.hitStop>0)this.hitStop-=dt;const ts=this.cutinT>0?.06:this.hitStop>0?.04:this.slow>0?.28:1;const d=dt*ts;this.t+=d;this.phT+=d;
  if(!this.result){this.updPlayer(d);this.updPhase(d);}else{this.endT-=dt;if(this.endT<=0&&!this.resultShown){this.resultShown=true;HS.missionEnd(this.result);}}this.animP(d);this.updDying(d);
  this.updFun(dt);this.updEnemies(d);this.updAllies(d);this.updShots(d);this.updFx(d);this.updCam(dt);this.render();HUD.update(dt);},
 render(){if(this.scene)this.R.render(this.scene,this.cam);},
 // ---------------- PLAYER ----------------
 updPlayer(dt){const P=this.P,S=P.st;if(P.ap<=0)return;const cheat=HS.state.cheat;P.stun=Math.max(0,P.stun-dt);P.shield=Math.max(0,P.shield-dt);
  let jx=this.stick.x,jy=this.stick.y;if(this.keys.KeyA)jx-=1;if(this.keys.KeyD)jx+=1;if(this.keys.KeyW)jy+=1;if(this.keys.KeyS)jy-=1;const jl=Math.hypot(jx,jy);if(jl>1){jx/=jl;jy/=jl;}
  const f=new V3(Math.sin(this.camYaw),0,Math.cos(this.camYaw)),r=new V3(-f.z,0,f.x);const want=new V3().addScaledVector(f,jy).addScaledVector(r,jx);if(P.stun>0)want.set(0,0,0);
  this.updLock(dt);const T=this.lock;let enUse=0;
  if(P.abOn&&(P.en<=0||P.enOut))P.abOn=false;
  const tv=want.clone().multiplyScalar(S.spd);
  if(P.abOn){const dir=T?T.pos.clone().sub(P.pos).setY(0).normalize():f.clone();if(want.lengthSq()>.1)dir.addScaledVector(want,.6).normalize();tv.copy(dir).multiplyScalar(40*S.ab);enUse+=380*S.use;if(Math.random()<.6)this.trail(P,2);}
  document.getElementById('fxLines').classList.toggle('on',!!P.abOn);
  if(this.in.dashPress){this.in.dashPress=false;const cost=330*S.use;if(P.en>=cost*.5&&!P.enOut&&P.stun<=0){if(!cheat)P.en-=cost;P.enDelay=S.delay;const d=want.lengthSq()>.05?want.clone().normalize():f.clone().multiplyScalar(-1);
    P.vel.addScaledVector(d,46*S.dash);P.dashT=.28;AU.play('dash');this.burst(P.pos.clone().setY(P.pos.y+1.5),0x4ef0ff,12,10,.9,.35);this.ringFx(P.pos.clone().setY(P.pos.y+.2),0x4ef0ff,.5,3.5,.3);P.abOn=false;}}
  P.dashT=Math.max(0,P.dashT-dt);
  this.updMoves(dt,want,f);
  if(P.lunge){const L=P.lunge;L.t-=dt;if(L.tgt&&L.tgt.alive){const to=L.tgt.pos.clone().sub(P.pos);if(to.length()>L.reach){P.vel.copy(to.normalize().multiplyScalar(L.speed));}else{P.vel.multiplyScalar(.2);L.t=0;}}else P.vel.multiplyScalar(.9);
   if(L.t<=0){P.lunge=null;this.meleeHit(L);}}
  else if(P.slashLunge){P.vel.y=Math.max(P.vel.y,0);}else if(P.driftT>0){P.driftT-=dt;const sp=Math.hypot(P.vel.x,P.vel.z);if(Math.random()<.9)this.driftSparks();P.vel.x*=Math.pow(.6,dt);P.vel.z*=Math.pow(.6,dt);if(sp<8)P.driftT=0;}
  else{const k=P.dashT>0?2:P.abOn?4:P.grounded?10:5;P.vel.x=lerp(P.vel.x,tv.x,clamp(k*dt,0,1));P.vel.z=lerp(P.vel.z,tv.z,clamp(k*dt,0,1));}
  const up=this.in.up&&!P.enOut&&P.en>0&&P.stun<=0;if(up){P.vel.y=lerp(P.vel.y,13*S.jump,clamp(6*dt,0,1));enUse+=300*S.use;if(Math.random()<.5)this.trail(P,1);}
  else if(!P.lunge){P.vel.y-=(P.abOn?6:30)*dt;if(P.abOn)P.vel.y=Math.max(P.vel.y,-2);}
  P.pos.addScaledVector(P.vel,dt);if(P.pos.y<=0){if(!P.grounded&&P.vel.y<-14){this.shake=Math.max(this.shake,.25);this.burst(P.pos.clone(),0xc9b8a0,10,6,1.2,.4);}P.pos.y=0;P.vel.y=Math.max(0,P.vel.y);P.grounded=true;}else P.grounded=false;
  const ceil=this.mission.zombie?4:34;if(P.pos.y>ceil){P.pos.y=ceil;P.vel.y=Math.min(0,P.vel.y);}this.bound(P.pos,1.4);
  if(enUse>0){if(!cheat)P.en-=enUse*dt;P.enDelay=S.delay;}else{P.enDelay-=dt;if(P.enDelay<=0)P.en+=S.regen*dt*(P.enOut?.55:1);}
  if(P.en<=0&&!P.enOut){P.en=0;P.enOut=true;P.abOn=false;AU.play('warn');}if(P.enOut&&P.en>=P.enMax)P.enOut=false;P.en=clamp(P.en,0,P.enMax);
  AU.boost(P.abOn?1:up?.7:P.dashT>0?.8:Math.min(.35,Math.hypot(P.vel.x,P.vel.z)/S.spd*.3));
  for(const s of['wr','wl','sh','bk']){const W=P.W[s];if(!W)continue;W.cd-=dt;if(W.rl>0){W.rl-=dt;if(W.rl<=0){if(W.res!=null){const n=Math.min(W.p.mag,W.res);W.res-=n;W.mag=n;}else W.mag=W.p.mag;}}}
  if(P.stun<=0&&!P.lunge&&!P.slashLunge){this.handleWeapon('wr',this.in.fr,dt);this.handleWeapon('wl',this.in.fl,dt);this.handleWeapon(P.active,this.in.sp,dt);}
  if(this.in.swapPress){this.in.swapPress=false;if(P.W.sh&&P.W.bk&&P.W.bk.p.cls!=='rack'){P.active=P.active==='sh'?'bk':'sh';AU.play('ui');HUD.toast(P.W[P.active].p.name[HS.lang]);}else AU.play('deny');}
  if(this.in.lockPress){this.in.lockPress=false;this.cycleLock();}
  if(this.in.abPress){this.in.abPress=false;if(!P.enOut){P.abOn=!P.abOn;if(P.abOn){AU.play('dash');this.ringFx(P.pos.clone().setY(1.5),0xff7a1a,.5,5,.35,false);}}}
  if(this.in.repPress){this.in.repPress=false;this.repair();}
  for(const d of P.drones){d.t-=dt;d.a+=dt*2.4;d.pos.set(P.pos.x+Math.cos(d.a)*3,P.pos.y+4+Math.sin(d.a*2)*.4,P.pos.z+Math.sin(d.a)*3);d.mesh.position.copy(d.pos);d.mesh.rotation.y+=dt*4;d.cd-=dt;
   if(d.cd<=0&&this.lock){d.cd=.5;this.fireBullet(d.pos.clone(),this.lock,{dmg:d.w.dmg,shock:d.w.shock,spd:140,col:0x4ef0ff,size:.7});}if(d.t<=0)this.scene.remove(d.mesh);}
  P.drones=P.drones.filter(d=>d.t>0);
  P.grp.position.copy(P.pos);P.shadow.position.set(P.pos.x,.04,P.pos.z);P.shadow.scale.setScalar(clamp(1-P.pos.y/30,.3,1));
  const lat=P.vel.x*Math.cos(this.camYaw)-P.vel.z*Math.sin(this.camYaw);P.lean=lerp(P.lean,clamp(-lat*.012,-.28,.28)+(P.stun>0?Math.sin(this.t*40)*.06:0),clamp(10*dt,0,1));
  if(P.spr)P.spr.position.y=P.grounded?Math.abs(Math.sin(this.t*9))*.08*Math.min(1,Math.hypot(P.vel.x,P.vel.z)/8):Math.sin(this.t*3)*.12;
  const hot=up||P.abOn||P.dashT>0;for(const tmp of this.nozW(P)){this.puff(tmp,new V3(rnd(-.5,.5),-2-(up?6:0),rnd(-.5,.5)),this.paint.g,hot?1.7:.7,.18,0);}
  if(P.ap<P.apMax*.3&&!this.lowWarned){this.lowWarned=true;HUD.comm(COMMS.c_lowap);}
  for(const e of this.E){if(!e.alive||e.type==='bleg'||e.type==='boss')continue;const dx=P.pos.x-e.pos.x,dz=P.pos.z-e.pos.z,dd=Math.hypot(dx,dz),rr=e.r+1.2;
   if(dd<rr&&dd>0&&Math.abs((e.pos.y||0)-P.pos.y)<3){P.pos.x+=dx/dd*(rr-dd);P.pos.z+=dz/dd*(rr-dd);if(P.abOn){this.dmgFoe(e,700*S.melee,500,'ram');P.abOn=false;P.vel.multiplyScalar(-.3);this.shake=.4;AU.play('pile');}}}},
 bound(p,r){if(this.boxes)for(const b of this.boxes){if(!b.on||p.y>b.h)continue;const cx=clamp(p.x,b.x0,b.x1),cz=clamp(p.z,b.z0,b.z1);const dx=p.x-cx,dz=p.z-cz,d=Math.hypot(dx,dz);if(d<r){if(d>1e-4){p.x+=dx/d*(r-d);p.z+=dz/d*(r-d);}else{const ox=Math.min(p.x-b.x0,b.x1-p.x),oz=Math.min(p.z-b.z0,b.z1-p.z);if(ox<oz)p.x=p.x-b.x0<b.x1-p.x?b.x0-r:b.x1+r;else p.z=p.z-b.z0<b.z1-p.z?b.z0-r:b.z1+r;}}}
  for(const c of this.colliders){const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),rr=c.r+r;if(d<rr&&d>0&&p.y<8){p.x+=dx/d*(rr-d);p.z+=dz/d*(rr-d);}}
  const R=this.map.r-1,d=Math.hypot(p.x,p.z);if(d>R){p.x*=R/d;p.z*=R/d;}},
 trail(P,s){for(const tmp of this.nozW(P)){this.puff(tmp,new V3(rnd(-1,1),rnd(-1,1),rnd(-1,1)),s>1?0xff7a1a:this.paint.g,1.4*s,.4,0);}},
 repair(){const P=this.P;if(P.kits<=0||P.ap>=P.apMax){AU.play('deny');return;}P.kits--;P.kitsUsed++;P.ap=Math.min(P.apMax,P.ap+P.apMax*.32);AU.play('repair');this.burst(P.pos.clone().setY(2),0x6dff9a,24,6,1.2,.7);this.ringFx(P.pos.clone().setY(.2),0x6dff9a,.5,4,.5);this.lowWarned=false;},
 targets(){return this.E.filter(e=>e.alive&&!e.retreat&&(e.type!=='ace'||e.ready));},
 updLock(){const P=this.P;const range=P.st.range;
  if(this.lock&&(!this.lock.alive||this.lock.retreat||this.lock.pos.distanceTo(P.pos)>range*1.15))this.lock=null;
  if(!this.lock){let best=null,bs=1e9;const f=new V3(Math.sin(this.camYaw),0,Math.cos(this.camYaw));for(const e of this.targets()){const to=e.pos.clone().sub(P.pos);const d=to.length();if(d>range)continue;to.y=0;to.normalize();
    const sc=d*(1.6-to.dot(f))*(e.type==='boss'&&e.kneel<=0?3:1);if(sc<bs){bs=sc;best=e;}}if(best){this.lock=best;AU.play('lock',.5);}}},
 cycleLock(){const c=this.targets().filter(e=>e.pos.distanceTo(this.P.pos)<this.P.st.range);if(!c.length)return;c.sort((a,b)=>a.pos.distanceTo(this.P.pos)-b.pos.distanceTo(this.P.pos));const i=c.indexOf(this.lock);this.lock=c[(i+1)%c.length];AU.play('lock');},
 aimY(e){return e.aimY!=null?e.aimY:e.z?e.h*.6:e.type==='ace'?2.2:e.type==='bleg'?0:e.type==='dummy'||e.type==='spindle'?0:e.static?(e.type==='jammer'?14:e.type==='heart'?7:3):e.type==='walker'?2.6:e.type==='tank'?1.6:1;},
 aimPoint(e,spd,from){const p=e.pos.clone();p.y=(e.pos.y||0)+this.aimY(e);if(e.vel&&spd){const t=from.distanceTo(p)/spd;p.addScaledVector(e.vel,t*.8);}return p;},
 muzzle(s){const P=this.P;if(P.rig)return this.sock(P,s);const a=P.comp.anchors[s]||P.comp.anchors.center;return this.anchorWorld(P,a[0],a[1],new V3());},
 handleWeapon(s,held,dt){const P=this.P,W=P.W[s];if(!W)return;const w=W.p,cls=w.cls;const melee=cls==='blade'||cls==='pile',chargeable=melee||w.charge;
  if(chargeable){if(held){W.held+=dt;if(W.held>.25&&!W.chg){W.chg=1;AU.play('charge',.6);}if(W.held>.3&&Math.random()<.6){this.puff(this.muzzle(s),new V3(rnd(-1,1),rnd(-1,1),rnd(-1,1)),this.paint.g,1.3,.25,0);}return;}
   if(W.held>0){const h=W.held;W.held=0;W.chg=0;if(W.cd>0)return;const full=h>=(w.charge||(cls==='pile'?.45:.55));
    if(melee)this.startMelee(s,w,full);else if(cls==='rail'){if(full)this.fireRail(s,w);else AU.play('deny');}else if(cls==='laser'){if(full)this.fireBeam(s,w);else this.fireOne(s,W,w);}}
   return;}
  if(!held||W.cd>0)return;if(w.mag&&W.mag<=0){if(W.rl<=0&&(W.res==null||W.res>0)){W.rl=w.reload;AU.play('ui',.4);}else if(W.res===0&&!W.dry){W.dry=1;HUD.pop(HS.T('noAmmo'),'#ff5a4a');}return;}
  if(cls==='drones'){W.cd=1/w.rate;this.deployDrones(w);return;}if(cls==='pulse'){W.cd=1/w.rate;this.pulse(w);return;}if(cls==='rack')return;
  this.fireOne(s,W,w);},
 fireOne(s,W,w){const P=this.P,T=this.lock,cls=w.cls;const isArm=s==='wr'||s==='wl';W.cd=1/(w.rate*(isArm?P.st.aim:1));if(P.rig)P.rig.kick(s);if(w.mag){W.mag--;if(W.mag<=0&&(W.res==null||W.res>0))W.rl=w.reload;}if(this.camMode==='fp')HUD.recoil(s);
  if(w.en){if(P.en<w.en||P.enOut){W.cd=.2;return;}if(!HS.state.cheat)P.en-=w.en;P.enDelay=P.st.delay*.5;}
  const fire=()=>{if(!this.on||!this.P)return;const m=this.muzzle(s);const T2=this.lock;this.puff(m,null,0xffe6b0,cls==='cannon'?3:1.4,.07,0);
   switch(cls){
   case'rifle':case'gatling':this.fireBullet(m,T2,{dmg:w.dmg,shock:w.shock,spd:w.spd,col:this.paint.g,size:cls==='gatling'?.6:.9,spread:cls==='gatling'?.04:.015,rng:w.rng});AU.play('rifle',cls==='gatling'?.45:.8);break;
   case'shotgun':for(let i=0;i<w.pel;i++)this.fireBullet(m,T2,{dmg:w.dmg,shock:w.shock,spd:w.spd,col:0xffb347,size:.6,spread:.11,rng:w.rng,life:.4});AU.play('shotgun');this.shake=Math.max(this.shake,.12);break;
   case'cannon':this.fireBullet(m,T2,{dmg:w.dmg,shock:w.shock,spd:w.spd,col:0xff7a1a,size:2.2,splash:w.splash,rng:w.rng,heavy:1,trail:1});AU.play('cannon');this.shake=Math.max(this.shake,.35);
    if(T2)P.vel.addScaledVector(T2.pos.clone().sub(P.pos).setY(0).normalize(),-6);this.burst(m,0xffb347,14,8,1.6,.3);break;
   case'laser':this.fireBullet(m,T2,{dmg:w.dmg,shock:w.shock,spd:200,col:0x4ef0ff,size:1.1,rng:w.rng});AU.play('laser');break;
   case'missile':for(let i=0;i<w.n;i++)setTimeout(()=>{if(this.on&&this.P)this.fireMissile(this.muzzle(s),T2,w,i,w.n);},i*55);AU.play('missile');break;
   case'mortar':for(let i=0;i<w.n;i++)setTimeout(()=>{if(this.on&&this.P)this.fireMortar(this.muzzle(s),T2,w,i);},i*160);AU.play('cannon',.6);break;
   case'rocket':for(let i=0;i<w.n;i++)setTimeout(()=>{if(!this.on||!this.P)return;this.fireBullet(this.muzzle(s),T2,{dmg:w.dmg,shock:w.shock,spd:w.spd,col:0xff7a1a,size:1.6,splash:w.splash,rng:120,heavy:1,trail:1});AU.play('missile');},i*140);break;}};
  if(w.burst){for(let i=0;i<w.burst;i++)setTimeout(fire,i*60);}else fire();},
 fireBullet(from,T,o){const dir=new V3();if(T&&T.alive){dir.copy(this.aimPoint(T,o.spd,from)).sub(from).normalize();}else{dir.set(Math.sin(this.camYaw),0,Math.cos(this.camYaw));}
  if(o.spread){dir.x+=rnd(-o.spread,o.spread);dir.y+=rnd(-o.spread,o.spread);dir.z+=rnd(-o.spread,o.spread);dir.normalize();}
  const m=new THREE.Mesh(this.shotGeo,this.gm(o.col));m.scale.setScalar(o.size||1);m.position.copy(from);m.lookAt(from.clone().add(dir));this.scene.add(m);
  this.shots.push({m,pos:from.clone(),vel:dir.multiplyScalar(o.spd),life:o.life||((o.rng||80)/o.spd*1.3),dmg:o.dmg,shock:o.shock,splash:o.splash,heavy:o.heavy,trail:o.trail,col:o.col,slow:o.slow});},
 fireMissile(from,T,w,i,n){const m=new THREE.Mesh(this.misGeo,this.gm(0xffe0a0));m.position.copy(from);this.scene.add(m);const a=(i/n)*Math.PI*2;
  this.shots.push({m,pos:from.clone(),vel:new V3(Math.cos(a)*8,10+rnd(0,6),Math.sin(a)*8),life:4,dmg:w.dmg,shock:w.shock,homing:T,turn:w.turn*this.P.st.lock,spd:w.spd*this.P.st.miss,trail:1,col:0xffb347,splash:1.6,missile:1});},
 fireMortar(from,T,w,i){const tp=T&&T.alive?T.pos.clone().add(new V3(rnd(-3,3),0,rnd(-3,3))):from.clone().add(new V3(Math.sin(this.camYaw)*30,0,Math.cos(this.camYaw)*30));tp.y=T&&T.alive?T.pos.y:0;
  const ft=1.1+i*.1,vel=tp.clone().sub(from).divideScalar(ft);vel.y=(tp.y-from.y+.5*30*ft*ft)/ft;const m=new THREE.Mesh(this.ballGeo,this.gm(w.slow?0xffc21f:0xff7a1a));m.scale.setScalar(1.3);m.position.copy(from);this.scene.add(m);
  this.shots.push({m,pos:from.clone(),vel,life:ft+.5,grav:30,dmg:w.dmg,shock:w.shock,splash:w.splash,heavy:1,trail:1,col:0xffb347,slow:w.slow,mortar:1});},
 fireBeam(s,w){const P=this.P,T=this.lock;const from=this.muzzle(s);const to=T?this.aimPoint(T,0,from):from.clone().add(new V3(Math.sin(this.camYaw)*w.rng,0,Math.cos(this.camYaw)*w.rng));
  P.W[s].cd=1.6;if(P.en<w.en*3&&!HS.state.cheat){AU.play('deny');return;}if(!HS.state.cheat)P.en-=w.en*3;this.beamFx(from,to,0x4ef0ff,.5,.35);AU.play('beam');this.shake=.3;
  if(T&&T.pos.distanceTo(P.pos)<w.rng*1.2){this.cutIn('laser',T,()=>{this.dmgFoe(T,w.cdmg,w.cshock,'beam');this.impact();});}},
 fireRail(s,w){const P=this.P,T=this.lock;const from=this.muzzle(s);const to=T?this.aimPoint(T,0,from):from.clone().add(new V3(Math.sin(this.camYaw)*w.rng,0,Math.cos(this.camYaw)*w.rng));
  P.W[s].cd=1/w.rate;this.beamFx(from,to,this.paint.g,.8,.45);AU.play('beam');AU.play('cannon');this.shake=.5;P.vel.addScaledVector(to.clone().sub(from).setY(0).normalize(),-12);
  if(T&&T.pos.distanceTo(P.pos)<w.rng){this.cutIn('rail',T,()=>{this.dmgFoe(T,w.dmg,w.shock,'beam');this.impact();this.burst(to,0xffffff,30,16,2,.5);});}},
 deployDrones(w){const P=this.P;for(let i=0;i<2;i++){const m=new THREE.Group();const b=new THREE.Mesh(new THREE.OctahedronGeometry(.6,0),this.mat(new THREE.Color(this.paint.p).getHex()));b.scale.set(1,.5,1.4);m.add(b);const e=new THREE.Mesh(new THREE.SphereGeometry(.2,6,4),this.gm(this.paint.g));e.position.z=.6;m.add(e);this.scene.add(m);
  P.drones.push({mesh:m,pos:new V3(),a:i*Math.PI,t:w.dur,cd:.3+i*.25,w});}AU.play('lock');HUD.toast(w.name[HS.lang]);},
 pulse(w){const P=this.P;P.shield=w.dur;P.shieldRed=w.red;AU.play('beam');this.ringFx(P.pos.clone().setY(1),this.paint.g,.5,10,.5);this.ringFx(P.pos.clone().setY(2),this.paint.g,.5,8,.6,false);
  for(const e of this.E){if(e.alive&&e.pos.distanceTo(P.pos)<9){this.dmgFoe(e,w.dmg,w.shock,'pulse');if(!e.static&&e.type!=='boss'&&e.type!=='bleg')e.vel.add(e.pos.clone().sub(P.pos).setY(0).normalize().multiplyScalar(20));}}},
 startMelee(s,w,charged){const P=this.P,T=this.lock;P.W[s].cd=1/w.rate;const reach=w.rng*(charged?1.6:1);
  if(T&&T.alive&&T.pos.distanceTo(P.pos)<reach+6){P.lunge={tgt:T,t:charged?.32:.22,speed:charged?62:44,reach:T.r+2.2,w,charged,s};}
  else{P.lunge={tgt:null,t:.12,w,charged,s,speed:0,reach:0};P.vel.addScaledVector(new V3(Math.sin(this.camYaw),0,Math.cos(this.camYaw)),20);}
  AU.play(w.cls==='pile'?'dash':'blade');if(P.rig)P.rig.slash(s,charged?.5:.36);},
 meleeHit(L){const P=this.P,w=L.w,T=L.tgt;const dir=T?T.pos.clone().sub(P.pos).setY(0).normalize():new V3(Math.sin(this.camYaw),0,Math.cos(this.camYaw));
  const col=w.shape==='regalia'?0xc58cff:new THREE.Color(this.paint.g).getHex();this.slashFx(P.pos,dir,col,L.charged);
  if(w.wave)this.fireBullet(this.muzzle(L.s),T,{dmg:w.dmg*.5,shock:w.shock*.4,spd:70,col,size:3,rng:40});
  const hitIt=T&&T.alive&&T.pos.distanceTo(P.pos)<T.r+5.5+(T.type==='bleg'||T.type==='boss'?6:0);if(!hitIt){AU.play('blade',.6);return;}
  const hits=w.hits||1;const dmg=(L.charged?w.cdmg:w.dmg)*P.st.melee,sh=L.charged?w.cshock:w.shock;
  const apply=()=>{for(let i=0;i<hits;i++)setTimeout(()=>{if(!this.on||!T.alive||!this.P)return;this.dmgFoe(T,dmg/hits,sh/hits,'melee');if(i)this.slashFx(P.pos,dir,col,L.charged);AU.play(w.cls==='pile'?'pile':'blade');},i*90);
   this.impact();this.shake=L.charged?.6:.3;P.vel.addScaledVector(dir,-8);};
  if(L.charged||(w.cls==='pile'&&T.stag>0))this.cutIn(w.cls==='pile'?'pile':P.cid,T,apply);else apply();},
 cutIn(key,T,cb){if(this.cutinCd>0){cb();return;}this.cutinCd=5;this.cutinT=.85;AU.play('cutin');const mv=MOVES[key]||MOVES[this.P.cid];HUD.cutin(this.P.comp,mv[HS.lang],this.P.cid);setTimeout(()=>{if(this.on&&this.P)cb();},650);},
 impact(){const c=this.R.domElement;c.classList.add('impact');setTimeout(()=>c.classList.remove('impact'),55);},
 // ---------------- DAMAGE ----------------
 dmgFoe(e,dmg,shock,src){if(!e||!e.alive||e.ally||e.retreat||this.result)return;if(HS.state.cheat)dmg*=3;if(e.stag>0)dmg*=1.5;
  if(e.type==='boss'){dmg*=e.kneel>0?1.3:.2;shock=e.kneel>0?0:shock*.5;}
  if(e.type==='ace'&&!e.ready)return;if(e.armor&&src!=='slash'&&src!=='super'&&src!=='melee')dmg*=.55;e.ap-=dmg;e.hitT=.08;
  if(e.shockMax>0&&e.stag<=0){e.shock+=shock;if(e.shock>=e.shockMax)this.stagger(e);}
  const ap=this.aimPoint(e,0,e.pos);HUD.dmgNum(ap,Math.round(dmg),e.stag>0,e);if(src!=='pulse')AU.play('hit',.35);this.onHit(e,dmg,src);
  if(e.type==='ace'&&this.ph&&this.ph.type==='duel'&&this.ph.until>0&&e.ap<=e.apMax*this.ph.until){e.ap=e.apMax*this.ph.until;this.aceRetreat(e);return;}
  if(e.ap<=0)this.killFoe(e);},
 stagger(e){e.stag=e.type==='ace'?3.2:e.type==='boss'?4:2.6;e.shock=0;this.slow=.45;this.shake=Math.max(this.shake,.35);AU.play('break');HUD.stamp(HS.T('break'));
  this.burst(this.aimPoint(e,0,e.pos),0xffffff,26,14,1.5,.5);this.ringFx(this.aimPoint(e,0,e.pos),0xffffff,.5,6,.35,false);if(e.type==='ace'||e.type==='boss')HUD.comm(COMMS.c_break);},
 aceRetreat(e){e.retreat=true;e.retT=2.2;e.stag=0;HUD.comm(COMMS.c_retreat);AU.play('whoosh');if(this.lock===e)this.lock=null;},
 killFoe(e){e.alive=false;e.ap=0;const p=this.aimPoint(e,0,e.pos);const big=e.type==='boss'||e.type==='heart'||e.type==='gate'||e.type==='ace'||e.type==='brute';
  if(e.z)this.scrapBurst(p,e);else this.explode(p,big?9:e.r*1.8,big?0xffffff:0xff7a1a,true,true);if(big){this.slow=1.1;this.shake=1;}
  if(e.mesh){this.scene.remove(e.mesh);e.mesh.traverse(o=>{if(o.geometry)o.geometry.dispose();});}if(e.grp){if(e.rig&&this.dying){e.dieT=1.8;this.dying.push(e);}else{this.scene.remove(e.grp);this.scene.remove(e.shadow);}}if(e.col){const i=this.colliders.indexOf(e.col);if(i>=0)this.colliders.splice(i,1);}
  if(e.type==='bleg'){this.legDown(e);return;}
  if(e.type==='boss'){for(const L of e.legs){L.alive=false;}for(const k of['up','lo','j','ft'])for(const l of e.B.legs)this.scene.remove(l[k]);this.scene.remove(e.B.g);}
  this.stats.kills++;this.stats.cr=(this.stats.cr||0)+(e.cr||0);if(this.lock===e)this.lock=null;if(e.z&&typeof Z!=='undefined')Z.onKill(this,e);else this.sup(big?25:6);},
 legDown(L){const B=L.boss;AU.play('break');HUD.stamp(HS.T('break'));const down=B.legs.filter(l=>!l.alive).length;
  if(down>=2&&B.kneel<=0){B.kneel=6.5;B.stag=6.5;HUD.comm(COMMS.c_boss2);this.slow=.6;this.lock=B;}},
 hurtPlayer(dmg,shock,from){const P=this.P;if(!P||P.ap<=0||this.result)return;if(HS.state.cheat){this.burst(P.pos.clone().setY(2),0xffffff,4,4,.8,.2);return;}
  if(P.dashT>.12||P.driftT>0||P.superT>0){HUD.pop(HS.T('dodge'),'#2bfff1');return;}
  dmg*=clamp(1-P.st.def/1200,.45,1);if(P.shield>0)dmg*=1-(P.shieldRed||.7);dmg=Math.round(dmg);P.ap-=dmg;P.dmgTaken+=dmg;if(P.rig)P.rig.hitReact();HUD.hurt();AU.play('hurt',.6);this.shake=Math.max(this.shake,Math.min(.5,dmg/900));
  P.shock+=shock||0;if(P.shock>1100+P.st.stab*2){P.shock=0;P.stun=.7;P.abOn=false;HUD.stamp(HS.T('staggered'));if(from)P.vel.add(P.pos.clone().sub(from).setY(0).normalize().multiplyScalar(14));}
  if(P.ap<=0){P.ap=0;this.playerDown();}},
 playerDown(){const P=this.P;this.explode(P.pos.clone().setY(2),6,0xff3a2a,true);this.slow=1.5;P.abOn=false;P.vel.set(0,0,0);AU.boost(0);this.finish(false);},
 // ---------------- ENEMIES ----------------
 foeTarget(e){const D=this.phData||{};const P=this.P;if(e.allyTgt&&e.allyTgt.alive&&Math.random()<.995)return e.allyTgt;e.allyTgt=null;
  if(this.ph&&(this.ph.type==='escort'||this.ph.type==='defend')&&(e.type==='spindle'||e.type==='walker'||e.type==='tank')){
   if(e.prefObj==null)e.prefObj=Math.random()<.6;if(e.prefObj){const objs=this.ph.type==='escort'?D.trucks.filter(t=>t.alive):D.core&&D.core.alive?[D.core]:[];
    if(objs.length){let b=objs[0],bd=1e9;for(const o of objs){const d=o.pos.distanceTo(e.pos);if(d<bd){bd=d;b=o;}}return b;}}}
  if(this.allies.length&&Math.random()<.3){const a=this.allies.find(a=>a.ready&&a.alive);if(a){e.allyTgt=a;return a;}}
  return P&&P.ap>0?{pos:P.pos,player:1,r:1.4}:null;},
 hurtTarget(t,dmg,shock,from){if(!t)return;if(t.player){this.hurtPlayer(dmg,shock,from);return;}if(t.type==='ace'){t.ap=Math.max(t.apMax*.25,t.ap-dmg*.3);return;}
  if(!t.alive)return;t.ap-=dmg;t.hitT=.1;if(t.ap<=0){t.alive=false;t.ap=0;this.explode(t.pos.clone().setY(2),5,0xff3a2a,true);if(t.mesh)t.mesh.visible=false;}},
 updEnemies(dt){const P=this.P;if(!P)return;for(const e of this.E){if(!e.alive)continue;e.t+=dt;if(e.hitT)e.hitT-=dt;
   if(e.stag>0){e.stag-=dt;if(e.stag<=0&&e.type==='boss')e.kneel=0;}
   if(e.z){continue;}if(e.type==='ace'){this.aceAI(e,dt);continue;}if(e.type==='boss'){this.bossAI(e,dt);continue;}if(e.type==='bleg')continue;
   const m=e.mesh;const tgt=this.foeTarget(e);const tp=tgt?tgt.pos:P.pos;const to=_v.copy(tp).sub(e.pos);const dist=Math.hypot(to.x,to.z);
   if(m.userData.spin){m.userData.spin.rotation.y+=dt*1.5;m.userData.spin.rotation.x+=dt*.6;}
   if(e.stag>0){m.rotation.z=Math.sin(e.t*30)*.15;e.vel.multiplyScalar(.9);}else m.rotation.z=0;
   const stunned=e.stag>0||this.result;e.cd-=dt*(e.slowT>0?.4:1);if(e.slowT>0)e.slowT-=dt;
   switch(e.type){
   case'dummy':e.pos.y=e.baseY+Math.sin(e.t*2)*.4;break;
   case'spindle':{if(!stunned){const want=dist>16?1:dist<9?-1:0;const tang=new V3(-to.z,0,to.x).normalize();const dir=_v2.set(to.x,0,to.z).normalize().multiplyScalar(want).addScaledVector(tang,Math.sin(e.t*.7+e.r)>0?.8:-.8);
     e.vel.lerp(dir.multiplyScalar(11*(e.slowT>0?.4:1)),clamp(2*dt,0,1));e.pos.y=lerp(e.pos.y,e.baseY+Math.sin(e.t*1.4)*1.2+(tgt&&tgt.player?P.pos.y*.5:0),dt);
     if(e.cd<=0&&dist<55){e.cd=rnd(1.6,2.6);this.foeShot(e,tgt,90,.9,0xff3a2a,1);}}
    m.rotation.y=Math.atan2(to.x,to.z);break;}
   case'walker':{if(!stunned){const dir=_v2.set(to.x,0,to.z).normalize();const want=dist>12?1:dist<6?-.5:0;e.vel.lerp(dir.multiplyScalar(want*8*(e.slowT>0?.4:1)),clamp(3*dt,0,1));
     if(e.cd<=0){if(dist<8){e.cd=2.2;this.slashFx(e.pos,_v2.set(to.x,0,to.z).normalize(),0xff3a2a,false);this.hurtTarget(tgt,320,300,e.pos);AU.play('blade',.5);}else if(dist<45){e.cd=rnd(2,3);this.foeShot(e,tgt,80,2.6,0xff5a2a,3);}}}
    m.rotation.y=Math.atan2(to.x,to.z);m.position.y=Math.abs(Math.sin(e.t*6))*.15*Math.min(1,e.vel.length()/4);break;}
   case'tank':{if(!stunned){const dir=_v2.set(to.x,0,to.z).normalize();const want=dist>28?1:dist<16?-.6:0;e.vel.lerp(dir.multiplyScalar(want*5),clamp(dt,0,1));
     if(e.cd<=0&&dist<70){e.cd=rnd(3.5,5);this.foeMortar(e,tgt);}}m.rotation.y=lerp(m.rotation.y,Math.atan2(to.x,to.z),clamp(2*dt,0,1));break;}
   case'turret':{if(m.userData.head)m.userData.head.rotation.y=Math.atan2(to.x,to.z);if(!stunned&&e.cd<=0&&dist<60){e.cd=rnd(2.4,3.4);for(let i=0;i<3;i++)setTimeout(()=>{if(e.alive&&this.on)this.foeShot(e,tgt,110,2,0xff3a2a,1);},i*120);}break;}
   case'gate':case'heart':{if(!stunned&&e.cd<=0&&dist<80){e.cd=e.type==='heart'?3:4.5;for(let i=0;i<(e.type==='heart'?6:4);i++)setTimeout(()=>{if(e.alive&&this.on)this.foeMissile(e,tgt);},i*150);}
    if(e.type==='heart'){for(let i=0;i<3;i++){const r=m.userData['r'+i];if(r){r.rotation.x+=dt*(.5+i*.3);r.rotation.y+=dt*.4;}}}break;}
   case'jammer':case'anchor':case'pylon':break;}
   if(!e.static){e.pos.addScaledVector(e.vel,dt);if(e.type!=='spindle')e.pos.y=0;this.bound(e.pos,e.r);m.position.x=e.pos.x;m.position.z=e.pos.z;if(e.type==='spindle')m.position.y=e.pos.y;}
   else m.position.y=e.pos.y;
   if(m.userData.eye)m.userData.eye.material=e.stag>0?this.gm(0xffffff):e.hitT>0?this.gm(0xffe0a0):this.gm(0xff3a2a);
   if(e.type!=='static'&&m.userData.eye&&e.type==='anchor')m.userData.eye.material=this.gm(0xc58cff);}
  if(typeof Z!=='undefined'&&this.mission&&this.mission.zombie)Z.updFoes(this,dt);
  this.E=this.E.filter(e=>e.alive||e.type==='bleg');},
 foeShot(e,tgt,spd,size,col,dmgMul){if(!tgt)return;const from=this.aimPoint(e,0,e.pos);const tp=tgt.player?this.P.pos.clone().setY(this.P.pos.y+2.2):tgt.pos.clone().setY(1.5);
  if(tgt.player)tp.addScaledVector(this.P.vel,from.distanceTo(tp)/spd*rnd(.2,.9));const dir=tp.sub(from).normalize();dir.x+=rnd(-.03,.03);dir.y+=rnd(-.02,.02);
  const m=new THREE.Mesh(this.ballGeo,this.gm(col));m.scale.setScalar(size);m.position.copy(from);this.scene.add(m);
  this.eshots.push({m,pos:from,vel:dir.multiplyScalar(spd),life:1.6,dmg:90*dmgMul,shock:60*dmgMul,tgt,col});AU.play('laser',.2);},
 foeMissile(e,tgt){if(!tgt)return;const from=this.aimPoint(e,0,e.pos);const m=new THREE.Mesh(this.misGeo,this.gm(0xff6a3a));m.scale.setScalar(1.4);m.position.copy(from);this.scene.add(m);
  this.eshots.push({m,pos:from,vel:new V3(rnd(-10,10),14,rnd(-10,10)),life:4.5,dmg:260,shock:180,tgt,homing:1,turn:2.2,spd:36,col:0xff6a3a});AU.play('missile',.4);},
 foeMortar(e,tgt){if(!tgt)return;const from=e.pos.clone().setY(2.6);const tp=tgt.pos.clone();tp.y=tgt.player?this.P.pos.y*.3:0;tp.x+=rnd(-2,2);tp.z+=rnd(-2,2);const ft=1.6;
  const vel=tp.clone().sub(from).divideScalar(ft);vel.y=(tp.y-from.y+.5*30*ft*ft)/ft;const m=new THREE.Mesh(this.ballGeo,this.gm(0xff3a2a));m.scale.setScalar(1.6);m.position.copy(from);this.scene.add(m);
  const warn=this.decal(tp,4,0xff3a2a,ft);this.eshots.push({m,pos:from,vel,life:ft+.4,grav:30,dmg:420,shock:380,splash:4.5,tgt,col:0xff3a2a});AU.play('cannon',.4);},
 // ---------------- ACES & ALLIES ----------------
 nearestFoe(p,max){let b=null,bd=max||1e9;for(const e of this.E){if(!e.alive||e.type==='bleg'&&false||e.retreat)continue;if(e.type==='boss'&&e.kneel<=0)continue;const d=e.pos.distanceTo(p);if(d<bd){bd=d;b=e;}}return b;},
 aceAI(e,dt){if(!e.ready)return;const A=ACES[e.ace];const P=this.P;e.t+=0;
  if(e.retreat){e.retT-=dt;e.vel.y=lerp(e.vel.y,18,dt*2);e.vel.x*=.98;e.vel.z*=.98;e.pos.addScaledVector(e.vel,dt);this.placeAce(e,dt);this.puff(e.pos.clone().setY(e.pos.y+1),null,A.paint.g,2,.3,0);
   if(e.retT<=0){e.alive=false;e.gone=true;this.scene.remove(e.grp);this.scene.remove(e.shadow);}return;}
  let tgt,tp;if(e.ally){tgt=this.nearestFoe(e.pos,90);if(!tgt){const f=P.pos.clone().add(new V3(Math.sin(this.camYaw+1.2)*6,0,Math.cos(this.camYaw+1.2)*6));e.vel.lerp(f.sub(e.pos).setY(0).multiplyScalar(1.5),clamp(dt*2,0,1));e.pos.addScaledVector(e.vel,dt);e.pos.y=lerp(e.pos.y,1.5,dt);this.placeAce(e,dt);return;}tp=this.aimPoint(tgt,0,e.pos);}
  else{tgt=this.foeTarget(e);if(!tgt)return;tp=tgt.player?P.pos.clone().setY(P.pos.y+2.2):tgt.pos.clone().setY(1.5);}e.aimAt=tp;
  const to=tp.clone().sub(e.pos);const dist=Math.hypot(to.x,to.z);const dir=new V3(to.x,0,to.z).normalize();const tang=new V3(-dir.z,0,dir.x);
  const pd=e.ace==='bronny'?11:e.ace==='dkermit'?26:16;
  if(e.stag>0){e.vel.multiplyScalar(.9);e.lean=Math.sin(this.t*30)*.15;}
  else if(e.lunge){e.lunge-=dt;e.vel.copy(dir).multiplyScalar(48);if(dist<3.2||e.lunge<=0){e.lunge=0;if(e.rig)e.rig.slash('wl',.35);const col=new THREE.Color(A.paint.g).getHex();this.slashFx(e.pos,dir,col,true);AU.play('blade');
    if(dist<5){if(e.ally)this.dmgFoe(tgt,1400,700,'ally');else this.hurtTarget(tgt,e.ace==='asmon'?720:560,700,e.pos);}e.vel.multiplyScalar(-.4);}}
  else{if(e.dirT==null||(e.dirT-=dt)<=0){e.dirT=rnd(1.2,2.6);e.sgn=Math.random()<.5?-1:1;}const want=dist>pd+4?1:dist<pd-4?-1:0;
   const tv=dir.clone().multiplyScalar(want*e.spd).addScaledVector(tang,e.sgn*e.spd*.8);e.vel.x=lerp(e.vel.x,tv.x,clamp(3*dt,0,1));e.vel.z=lerp(e.vel.z,tv.z,clamp(3*dt,0,1));
   const ty=(tgt.player?P.pos.y:0)+(e.ace==='asmon'?3+Math.sin(this.t)*2:e.ace==='dkermit'?1:.5);e.vel.y=(ty-e.pos.y)*2;
   e.dcd-=dt;if(e.dcd<=0){e.dcd=rnd(1.6,3.2)*(e.ally?1.5:1);e.vel.addScaledVector(tang,e.sgn*34);this.burst(e.pos.clone().setY(e.pos.y+1.5),A.paint.g,10,8,1,.3);AU.play('dash',.4);}
   e.cd-=dt;e.mcd-=dt;e.bcd-=dt;const from=e.rig&&e.rig.S.wr?this.sock(e,'wr'):e.pos.clone().setY(e.pos.y+2.6);
   const shoot=(n,spread,spd,col,dmg)=>{if(e.rig)e.rig.kick('wr');for(let i=0;i<n;i++){const d=tp.clone().sub(from).normalize();d.x+=rnd(-spread,spread);d.y+=rnd(-spread,spread)*.5;d.z+=rnd(-spread,spread);
     if(e.ally){this.fireBullet(from,tgt,{dmg:dmg*1.4,shock:dmg*.6,spd,col,size:.8,spread,rng:90});}
     else{const m=new THREE.Mesh(this.ballGeo,this.gm(col));m.scale.setScalar(1);m.position.copy(from);this.scene.add(m);this.eshots.push({m,pos:from.clone(),vel:d.normalize().multiplyScalar(spd),life:1.6,dmg,shock:dmg*.6,tgt,col});}}};
   const W=A.load.wr;if(e.cd<=0&&dist<70){if(W==='wr_buck'){if(dist<26){e.cd=1.5;shoot(7,.09,110,0xffb347,70);AU.play('shotgun',.5);}}
    else if(W==='wr_seam'){e.cd=2.4;shoot(1,.005,200,0x8dff6a,380);AU.play('rifle',.6);}else{e.cd=.9;for(let i=0;i<3;i++)setTimeout(()=>{if(e.alive&&this.on&&!e.retreat)shoot(1,.02,170,0xc58cff,120);},i*90);AU.play('rifle',.5);}}
   if(e.mcd<=0&&dist<80){e.mcd=e.ace==='asmon'?6:7.5;const sh=A.load.sh;if(sh==='sh_mortar'&&!e.ally)this.foeMortar(e,tgt);else if(!e.ally){const n=sh==='sh_star'?8:5;for(let i=0;i<n;i++)setTimeout(()=>{if(e.alive&&this.on&&!e.retreat)this.foeMissile(e,tgt);},i*80);}
    else{for(let i=0;i<6;i++)setTimeout(()=>{if(this.on&&e.alive&&tgt.alive)this.fireMissile(from,tgt,{dmg:260,shock:150,turn:4,spd:56},i,6);},i*70);}}
   if(A.load.wl&&e.bcd<=0&&dist<pd+10&&PARTS[A.load.wl].cls==='blade'){e.bcd=rnd(4,6);e.lunge=.5;AU.play('charge',.5);}}
  e.pos.addScaledVector(e.vel,dt);if(e.pos.y<0)e.pos.y=0;this.bound(e.pos,1.4);
  const lat=e.vel.x*Math.cos(this.camYaw)-e.vel.z*Math.sin(this.camYaw);if(e.stag<=0)e.lean=lerp(e.lean||0,clamp(-lat*.012,-.3,.3),clamp(8*dt,0,1));
  this.placeAce(e,dt);if(e.vel.lengthSq()>40){for(const tmp of this.nozW(e)){this.puff(tmp,new V3(0,-3,0),A.paint.g,1.2,.16,0);}}},
 placeAce(e,dt){dt=dt||.016;e.grp.position.copy(e.pos);e.shadow.position.set(e.pos.x,.04,e.pos.z);
  if(e.rig){const sp=Math.hypot(e.vel.x,e.vel.z);let want=e.yaw||0;if(e.lunge&&e.aimAt||(!e.retreat&&e.aimAt))want=Math.atan2(e.aimAt.x-e.pos.x,e.aimAt.z-e.pos.z);else if(sp>3)want=Math.atan2(e.vel.x,e.vel.z);
   e.yaw=(e.yaw||0)+angDiff(e.yaw||0,want)*clamp(8*dt,0,1);e.grp.rotation.y=e.yaw;const c=Math.cos(e.yaw),s=Math.sin(e.yaw);const lx=e.vel.x*c-e.vel.z*s,lz=e.vel.x*s+e.vel.z*c;
   if(e.hitT>0&&!e._hit)e.rig.hitReact();e._hit=e.hitT>0;const far=this.cam?this.cam.position.distanceTo(e.pos)>55:false;
   let pitch=0;if(e.aimAt){pitch=clamp(Math.atan2(e.aimAt.y-(e.pos.y+2.6),Math.hypot(e.aimAt.x-e.pos.x,e.aimAt.z-e.pos.z)),-.7,.8);}
   e.rig.update(dt,{spd:Math.min(1,sp/Math.max(6,e.spd||12)),mvA:Math.atan2(lx,lz),air:e.pos.y>.8,boost:e.retreat||sp>30?1:e.lunge?.8:0,bank:clamp(-lx*.03,-.8,.8),pitch,aimR:!!e.aimAt,lod:far?1:0});return;}
  e.spr.rotation.z=e.lean||0;e.spr.position.y=Math.sin(this.t*3+1)*.12;e.spr.material.color.setScalar(e.hitT>0?2:1);},
 updAllies(dt){if(!this.P)return;for(const a of this.allies){if(a.alive)this.aceAI(a,dt);}},
 // ---------------- BOSS ----------------
 seg(m,a,b,t){const len=a.distanceTo(b);m.position.copy(a).lerp(b,.5);m.scale.set(t,len,t);m.quaternion.setFromUnitVectors(new V3(0,1,0),_v3.copy(b).sub(a).normalize());},
 bossAI(e,dt){const B=e.B,P=this.P;e.t+=dt;const kneel=e.kneel>0;if(kneel){e.kneel-=dt;if(e.kneel<=0){e.stag=0;for(const L of e.legs)if(!L.alive){L.alive=true;L.ap=L.apMax*.6;}AU.play('rise');}}
  const h=lerp(e.h,kneel?4:9,dt*3);e.h=h;e.aimY=h-2.2;
  const to=_v.copy(P.pos).sub(e.pos);const dist=Math.hypot(to.x,to.z);
  if(!kneel&&!this.result){const want=dist>30?1:dist<18?-.6:0;e.vel.lerp(_v2.set(to.x,0,to.z).normalize().multiplyScalar(want*4),clamp(dt,0,1));e.pos.addScaledVector(e.vel,dt);this.bound(e.pos,5);
   e.yaw=e.yaw+clamp(angDiff(e.yaw,Math.atan2(to.x,to.z)),-dt*.8,dt*.8);
   e.mcd-=dt;e.scd-=dt;e.lcd-=dt;const tgt={pos:P.pos,player:1,r:1.4};
   if(e.mcd<=0){e.mcd=rnd(5,7);for(let i=0;i<8;i++)setTimeout(()=>{if(e.alive&&this.on&&!this.result)this.foeMissile({pos:e.pos,aimY:e.h+2,type:'boss'},tgt);},i*90);}
   if(e.scd<=0){e.scd=rnd(3.5,5);for(let i=0;i<6;i++)setTimeout(()=>{if(e.alive&&this.on&&!this.result)this.foeShot({pos:e.pos,aimY:e.h-1,type:'boss'},tgt,95,1.6,0xff3a2a,2);},i*110);}
   if(e.lcd<=0&&dist<45){e.lcd=rnd(9,12);AU.play('alarm');HUD.toast('⚠ '+(HS.lang==='ja'?'衝撃波！上昇でかわせ':'SHOCKWAVE! Boost up!'),1);setTimeout(()=>{if(!e.alive||!this.on)return;this.waves.push({c:e.pos.clone(),r:3,spd:26,hit:false});this.shake=.8;AU.play('boom');this.ringFx(e.pos.clone().setY(.2),0xff7a1a,1,10,.4);},1100);}}
  B.g.position.set(e.pos.x,h,e.pos.z);B.g.rotation.y=e.yaw;B.g.rotation.z=kneel?Math.sin(e.t*8)*.03:0;B.loom.rotation.x+=dt*(kneel?.3:2);B.core.material.emissive.setHex(kneel?(Math.sin(e.t*12)>0?0x60f0ff:0x2090a0):0x103040);
  const cy=Math.cos(e.yaw),sy=Math.sin(e.yaw);
  e.legs.forEach((L,i)=>{const l=B.legs[i];const lx=l.sx*4,lz=l.sz*3;const hip=new V3(e.pos.x+lx*cy+lz*sy,h-.5,e.pos.z-lx*sy+lz*cy);
   const step=kneel?0:Math.max(0,Math.sin(e.t*2.4+i*1.6))*1.2;const fx=l.sx*8.5,fz=l.sz*7;const foot=new V3(e.pos.x+fx*cy+fz*sy,step,e.pos.z-fx*sy+fz*cy);
   const knee=hip.clone().lerp(foot,.5);knee.add(new V3(knee.x-e.pos.x,0,knee.z-e.pos.z).normalize().multiplyScalar(2.5));knee.y=kneel?h*.6:h+2.4;
   this.seg(l.up,hip,knee,1.1);this.seg(l.lo,knee,foot,.9);l.j.position.copy(knee);l.ft.position.copy(foot);L.pos.copy(knee);
   l.j.material.emissive.setHex(L.alive?(L.hitT>0?0xffffff:0xa05010):0x111111);l.j.material.color.setHex(L.alive?0xffb347:0x333333);if(L.hitT)L.hitT-=dt;});},
 // ---------------- PROJECTILES ----------------
 updShots(dt){const P=this.P;
  for(const s of this.shots){s.life-=dt;if(s.homing&&s.homing.alive){const tp=this.aimPoint(s.homing,0,s.pos);const want=tp.sub(s.pos).normalize().multiplyScalar(s.spd);s.vel.lerp(want,clamp(s.turn*dt,0,1));}
   if(s.grav)s.vel.y-=s.grav*dt;s.pos.addScaledVector(s.vel,dt);s.m.position.copy(s.pos);if(s.missile||s.mortar)s.m.lookAt(_v.copy(s.pos).add(s.vel));if(s.trail&&Math.random()<.7)this.puff(s.pos,null,s.col,s.missile?1:1.4,.25,0);
   let hit=null;for(const e of this.E){if(!e.alive||e.retreat||(e.type==='ace'&&!e.ready))continue;const r=e.type==='boss'?(e.kneel>0?3:2.2):e.type==='bleg'?2.2:e.r+.6;
    if(s.pos.distanceTo(this.aimPoint(e,0,e.pos))<r+(s.splash?.6:0)||(e.static&&e.type!=='dummy'&&Math.hypot(s.pos.x-e.pos.x,s.pos.z-e.pos.z)<e.r&&s.pos.y<(e.type==='jammer'?16:e.type==='heart'?11:8))){hit=e;break;}}
   if(hit){this.dmgFoe(hit,s.dmg,s.shock,'shot');if(hit.slowT!=null||s.slow)hit.slowT=s.slow?3:0;this.burst(s.pos,s.col,s.heavy?10:4,s.heavy?8:5,s.heavy?1.4:.8,.25);if(s.splash)this.splash(s.pos,s.splash,s.dmg*.5,s.shock*.5,hit,s.slow);s.life=0;}
   else if(s.pos.y<0){if(s.splash){this.explode(s.pos.clone().setY(.5),s.splash,s.col,false);this.splash(s.pos,s.splash,s.dmg*.6,s.shock*.6,null,s.slow);}else this.puff(s.pos.clone().setY(.2),null,0xc9b8a0,1.2,.3,0);s.life=0;}
   if(s.life<=0)this.scene.remove(s.m);}
  this.shots=this.shots.filter(s=>s.life>0);
  const pc=P?_v2.copy(P.pos).setY(P.pos.y+2.2):null;
  for(const s of this.eshots){s.life-=dt;if(s.homing&&s.tgt){const tp=s.tgt.player?(P?P.pos.clone().setY(P.pos.y+2):s.pos):s.tgt.pos.clone().setY(1.5);s.vel.lerp(tp.sub(s.pos).normalize().multiplyScalar(s.spd),clamp(s.turn*dt,0,1));}
   if(s.grav)s.vel.y-=s.grav*dt;s.pos.addScaledVector(s.vel,dt);s.m.position.copy(s.pos);if(s.homing){s.m.lookAt(_v.copy(s.pos).add(s.vel));if(Math.random()<.6)this.puff(s.pos,null,0xff6a3a,1,.25,0);}
   let done=false;if(P&&P.ap>0&&s.pos.distanceTo(pc)<(s.splash?2.6:1.9)){this.hurtPlayer(s.dmg,s.shock,s.pos);done=true;}
   else if(s.tgt&&!s.tgt.player&&s.tgt.alive!==false&&s.pos.distanceTo(_v.copy(s.tgt.pos).setY(1.5))<(s.tgt.r||2)+1.2){this.hurtTarget(s.tgt,s.dmg,s.shock);done=true;}
   else if(s.pos.y<0){done=true;if(s.splash){this.explode(s.pos.clone().setY(.4),s.splash,0xff3a2a,false);if(P&&P.pos.distanceTo(_v.copy(s.pos).setY(0))<s.splash+1&&P.pos.y<3)this.hurtPlayer(s.dmg,s.shock,s.pos);
     if(s.tgt&&!s.tgt.player&&s.tgt.pos.distanceTo(_v.copy(s.pos).setY(0))<s.splash+(s.tgt.r||2))this.hurtTarget(s.tgt,s.dmg,s.shock);}}
   if(done){this.burst(s.pos,s.col,5,5,.9,.25);s.life=0;}if(s.life<=0)this.scene.remove(s.m);}
  this.eshots=this.eshots.filter(s=>s.life>0);
  if(this.waves&&P){for(const w of this.waves){w.r+=w.spd*dt;const d=Math.hypot(P.pos.x-w.c.x,P.pos.z-w.c.z);if(!w.hit&&Math.abs(d-w.r)<2.2&&P.pos.y<1.8){w.hit=true;this.hurtPlayer(900,1400,w.c);}
    if(Math.random()<.9)for(let i=0;i<3;i++){const a=rnd(0,7);this.puff(new V3(w.c.x+Math.cos(a)*w.r,.6,w.c.z+Math.sin(a)*w.r),new V3(0,3,0),0xff9a3a,2.6,.35,0);}}
   this.waves=this.waves.filter(w=>w.r<60);}},
 splash(p,r,dmg,shock,skip,slow){for(const e of this.E){if(!e.alive||e===skip||e.retreat)continue;if(this.aimPoint(e,0,e.pos).distanceTo(p)<r+e.r){this.dmgFoe(e,dmg,shock,'splash');if(slow)e.slowT=3;}}},
 explode(p,r,col,big,party){this.burst(p,col,big?40:18,r*2.2,big?2.6:1.6,big?.9:.5);if(party){const pal=[0xff3df0,0x2bfff1,0xffd23a,0x7dff4a];for(let i=0;i<4;i++)this.burst(p,pal[i],big?10:5,r*2.6,big?1.8:1.2,big?.8:.5);this.ringFx(new V3(p.x,p.y,p.z),pal[Math.floor(Math.random()*4)],.5,r*1.8,.4,false);}this.burst(p,0x444444,big?16:6,r,3,1.1);this.ringFx(new V3(p.x,Math.max(.1,p.y-1),p.z),col,.5,r*1.4,.45);
  if(p.y<5)this.decal(p,r*.7,0x111111,6);AU.play('boom',big?1:.6);this.shake=Math.max(this.shake,big?.7:.25);},
 updFx(dt){this.updParts(dt);
  for(const r of this.rings){r.t+=dt;const k=Math.min(1,r.t/r.life);const sc=lerp(r.r0,r.r1,r.slash?k:1-Math.pow(1-k,3));r.m.scale.setScalar(sc);r.m.material.opacity=.9*(1-k);if(k>=1){this.scene.remove(r.m);r.m.geometry.dispose();r.m.material.dispose();}}
  this.rings=this.rings.filter(r=>r.t<r.life);
  for(const b of this.beams){b.t+=dt;const k=b.t/b.life;b.m.material.opacity=.95*(1-k);b.m.scale.x=b.m.scale.z=1-k*.8;if(k>=1){this.scene.remove(b.m);b.m.geometry.dispose();b.m.material.dispose();}}
  this.beams=this.beams.filter(b=>b.t<b.life);
  for(const d of this.decals){d.t+=dt;if(d.life<30&&d.t>d.life*.6)d.m.material.opacity=.35*Math.max(0,1-(d.t-d.life*.6)/(d.life*.4));if(d.t>=d.life){this.scene.remove(d.m);d.m.geometry.dispose();d.m.material.dispose();}}
  this.decals=this.decals.filter(d=>d.t<d.life);
  const D=this.phData||{};if(D.trucks)for(const t of D.trucks){t.mesh.position.copy(t.pos);if(t.alive&&Math.random()<.2)this.puff(t.pos.clone().add(new V3(.8,2.8,2.6)),new V3(0,2,0),0x666666,1,.6,0);}
  if(D.core&&D.core.mesh&&D.core.alive){D.core.mesh.rotation.y+=dt*.4;}
  for(const e of this.E){if(e.type==='dummy'&&e.mesh)e.mesh.position.y=e.pos.y;}},
 // ---------------- CAMERA ----------------
 updCam(dt){const P=this.P;if(!P||!P.grp)return;const portrait=innerHeight>innerWidth;
  if(this.manualT>0)this.manualT-=dt;else if(this.lock&&this.lock.alive&&!this.result){const tp=this.lock.pos;const ty=Math.atan2(tp.x-P.pos.x,tp.z-P.pos.z);this.camYaw+=angDiff(this.camYaw,ty)*clamp(3.2*dt,0,1);}
  if(this.keys.ArrowLeft)this.camYaw+=dt*2.2;if(this.keys.ArrowRight)this.camYaw-=dt*2.2;
  const f=_v.set(Math.sin(this.camYaw),0,Math.cos(this.camYaw)),r=_v2.set(-f.z,0,f.x);
  const cm=this.result?'third':this.camMode,fp=cm==='fp';
  const dist=fp?-.4:cm==='third'?(portrait?14:12.5):(portrait?8.8:7.4),side=fp||cm==='third'?0:(portrait?1.25:2.3),hgt=fp?3.3:(cm==='third'?5.6:2.9)+Math.min(4,P.pos.y*.15);
  const fov=fp?(portrait?78:68):portrait?68:58;if(this.cam.fov!==fov){this.cam.fov=fov;this.cam.updateProjectionMatrix();}
  const want=P.pos.clone().addScaledVector(f,-dist).addScaledVector(r,-side);want.y=P.pos.y+hgt;if(this.result&&!this.result.win)want.y+=3;
  if(fp)this.cam.position.copy(want);else this.cam.position.lerp(want,clamp(7*dt,0,1));const look=P.pos.clone().addScaledVector(f,fp?20:10).addScaledVector(r,-side*.6);look.y=P.pos.y+(fp?3.1:cm==='third'?2.6:2.2);
  if(this.lock&&this.lock.alive){const ly=this.aimPoint(this.lock,0,P.pos).y;look.y=lerp(look.y,ly,.35);}
  this.shake=Math.max(0,this.shake-dt*1.8);const sk=this.shake*(HS.state.opt.shake===false?0:1);if(sk>0)this.cam.position.add(new V3(rnd(-1,1)*sk,rnd(-1,1)*sk,rnd(-1,1)*sk*.5));
  this.cam.lookAt(look);
  P.grp.visible=P.shadow.visible=!fp;const ck=this.ckEl||(this.ckEl=document.getElementById('cockpit'));if(ck.classList.contains('on')!==fp){ck.classList.toggle('on',fp);if(fp)this.drawCockpit();}
  const face=u=>{if(!u||!u.grp||u.rig)return;u.grp.rotation.y=Math.atan2(this.cam.position.x-u.pos.x,this.cam.position.z-u.pos.z);};face(P);if(P.spr)P.spr.rotation.z=P.lean;
  for(const e of this.E)if(e.type==='ace')face(e);for(const a of this.allies)face(a);
  if(this.backdrop)this.backdrop.position.set(this.cam.position.x,40,this.cam.position.z);
  if(this.propList&&this.propList.length){const rc=this._rc||(this._rc=new THREE.Raycaster());const tgt=_v3.copy(P.pos).setY(P.pos.y+2);const dir=tgt.clone().sub(this.cam.position);const len=dir.length();rc.set(this.cam.position,dir.normalize());rc.far=len;
   const hit=new Set(this.camMode==='fp'?[]:rc.intersectObjects(this.propList,false).map(h=>h.object));for(const m of this.propList){const f=hit.has(m);if(f!==!!m.userData.faded){m.userData.faded=f;m.material.transparent=f;m.material.opacity=f?.22:1;m.material.depthWrite=!f;m.material.needsUpdate=true;for(const c of m.children)c.visible=!f;}}}},
 // ---------------- PHASE LOGIC ----------------
 updPhase(dt){const ph=this.ph,D=this.phData,P=this.P;if(!ph||this.phWait>0){if(this.phWait>0){this.phWait-=dt;if(this.phWait<=0)this.nextPhase();}return;}
  const L=HS.lang;
  switch(ph.type){
  case'reach':{const d=Math.hypot(P.pos.x-D.at.x,P.pos.z-D.at.z);if(d<6){D.hold+=dt;if(ph.hold&&Math.random()<.5)this.puff(D.at.clone().setY(rnd(0,8)),new V3(0,6,0),0x4ef0ff,1.2,.6,0);}else D.hold=Math.max(0,D.hold-dt*.5);
   HUD.progress(ph.hold&&d<6?HS.T('scan')+' '+Math.round(D.hold/ph.hold*100)+'%':Math.round(d)+'m');D.beam.material.opacity=.14+Math.sin(this.t*4)*.06;
   if(D.hold>=(ph.hold||0)&&d<6){this.scene.remove(D.beam);for(const r of this.rings)if(r.life>999)r.t=r.life;this.phaseDone();}break;}
  case'kill':{const left=this.E.filter(e=>e.alive&&e.need&&e.type!=='bleg').length;HUD.progress(left+' ▸');if(left===0)this.phaseDone();break;}
  case'escort':{const alive=D.trucks.filter(t=>t.alive);if(!alive.length)return this.finish(false);
   for(const t of alive){if(t.pos.z<ph.to)t.pos.z+=ph.spd*dt;}
   const w=ph.waves[D.waveI];if(w&&this.phT>=w.at){D.waveI++;const lead=alive[0].pos;for(let i=0;i<w.n;i++){const s=(i%2?1:-1)*rnd(22,34);this.spawn(w.t,new V3(clamp(lead.x+s,-60,60),0,clamp(lead.z+rnd(10,30),-66,66)));}AU.play('alarm',.5);}
   HUD.progress(HS.T('obj_trucks')+' '+alive.length+'/'+D.trucks.length+'  ·  '+Math.round(clamp((alive[0].pos.z-ph.from)/(ph.to-ph.from),0,1)*100)+'%');
   if(alive.every(t=>t.pos.z>=ph.to)){D.saved=alive.length;this.extra=alive.length/D.trucks.length;for(const e of this.E)if(e.alive)this.killFoe(e);this.phaseDone();}break;}
  case'defend':{const c=D.core;if(!c.alive)return this.finish(false);const left=this.E.filter(e=>e.alive).length;
   if(left===0){D.breakT-=dt;if(D.breakT<=0){D.waveI++;if(D.waveI>=ph.waves.length){this.extra=c.ap/c.apMax;this.phaseDone();break;}
     D.breakT=3;this.spawnList(ph.waves[D.waveI]);HUD.stamp(HS.T('wave')+' '+(D.waveI+1));AU.play('alarm');
     if(ph.ally&&D.waveI===ph.allyWave&&!D.allyIn){D.allyIn=true;const a=this.spawnAce(ph.ally,true);a.pos.set(P.pos.x+6,14,P.pos.z+6);a.vel.set(0,-10,0);setTimeout(()=>{if(this.on)HUD.comm(COMMS.c_ally);},600);}}}
   HUD.progress((this.mapId==='town'?HS.T('obj_lantern'):HS.T('obj_gen'))+' '+Math.round(c.ap/c.apMax*100)+'%  ·  '+HS.T('wave')+' '+Math.max(1,D.waveI+1)+'/'+ph.waves.length);break;}
  case'duel':{const a=D.ace;if(a.ready&&(!a.alive||a.gone)){this.phaseDone();break;}
   if(ph.adds){D.addT-=dt;if(D.addT<=0){D.addT=ph.adds[0].every;this.spawnList(ph.adds);}}HUD.progress('');break;}
  case'boss':{if(!this.boss.alive){this.phaseDone();break;}HUD.progress(this.boss.kneel>0?'▼ CORE':(this.boss.legs.filter(l=>!l.alive).length+'/2 ✕'));break;}
  case'survive':{const k=this.stats.kills-D.k0;HUD.progress(k+' / '+D.need);if(k>=D.need){for(const e of this.E)if(e.alive)this.killFoe(e);this.phaseDone();break;}
   const alive=this.E.filter(e=>e.alive).length;D.sp=(D.sp||0)-dt;if(alive<6&&D.sp<=0){D.sp=1.1;const t=ph.mix[Math.floor(Math.random()*ph.mix.length)];const a=rnd(0,7);this.spawn(t,new V3(P.pos.x+Math.cos(a)*40,0,P.pos.z+Math.sin(a)*40).clampLength(0,this.map.r-6));}break;}
  case'zombie':Z.update(this,dt);break;
  case'endless':{const left=this.E.filter(e=>e.alive).length;if(left===0){D.breakT-=dt;if(D.breakT<=0){if(this.wave>0){this.stats.cr=(this.stats.cr||0)+this.mission.cr;HUD.toast('+'+this.mission.cr+' CR');}this.wave++;D.breakT=3;
     const n=3+this.wave,mult=1+this.wave*.12;const pool=this.wave<3?['spindle','walker']:this.wave<6?['spindle','walker','tank']:['spindle','walker','tank','turret'];
     for(let i=0;i<n;i++){const a=rnd(0,7);this.spawn(pool[i%pool.length],new V3(Math.cos(a)*(this.map.r-10),0,Math.sin(a)*(this.map.r-10)),mult);}HUD.stamp(HS.T('wave')+' '+this.wave);AU.play('alarm');}}
   HUD.progress(HS.T('wave')+' '+this.wave+'  ·  '+left+' ▸');break;}}},
 phaseDone(){if(this.phWait>0||this.result)return;AU.play('rise');HUD.flashObj();const last=this.phaseI>=this.mission.phases.length-1;if(last){this.finish(true);return;}this.phWait=1.4;HUD.progress('✓');},
 finish(win){if(this.result)return;const P=this.P,M=this.mission;if(M.zombie)return Z.finish(this);const time=this.t;const apPct=P.apMax?P.ap/P.apMax:0;
  if(M.endless){win=this.wave>1;}
  let extra=this.extra!=null?this.extra:1-P.kitsUsed/Math.max(1,P.kitsMax)*.6;
  const tS=M.par?(time<=M.par?1:Math.max(0,1-(time-M.par)/M.par)):1;let score=40*tS+35*(HS.state.cheat?1:apPct)+25*extra;
  let rank=score>=85?'S':score>=68?'A':score>=50?'B':'C';if(M.endless)rank=this.wave>=12?'S':this.wave>=8?'A':this.wave>=4?'B':'C';if(!win)rank='—';
  const mul={S:1.5,A:1.25,B:1,C:.8}[rank]||0;const base=M.endless?0:M.cr;const credits=Math.round(win?base*mul+(this.stats.cr||0):(this.stats.cr||0)*.25+(M.endless?(this.stats.cr||0)*.75:0));
  this.result={win,mission:M,time,apPct,kills:this.stats.kills,rank,credits,wave:this.wave,extra,kitsUsed:P.kitsUsed,cid:P.cid,score:Math.round(score)};
  this.endT=win?2.4:2.8;HUD.stamp(HS.T(win?'mclear':'mfail'));AU.play(win?'win':'lose');P.abOn=false;AU.boost(0);this.lock=null;document.getElementById('fxLines').classList.remove('on');
  if(win)this.slow=1.2;},
 // ---------------- INPUT ----------------
 press(k,down){const I=this.in;if(k==='fr'||k==='fl'||k==='sp'||k==='up'||k==='act')I[k]=down;else if(down)I[k+'Press']=true;if(k==='act'&&down)I.actPress=true;},
 clearInput(){this.in={};this.keys={};this.stick.x=this.stick.y=0;document.querySelectorAll('.tb.on').forEach(b=>b.classList.remove('on'));const kn=document.querySelector('#stick .knob');if(kn)kn.style.transform='';},
 bind(){const KM={Space:'up',KeyJ:'fr',KeyK:'fl',KeyF:'sp',ShiftLeft:'dash',ShiftRight:'dash',KeyE:'ab',KeyQ:'swap',Tab:'lock',KeyR:'rep',KeyL:'lock',KeyX:'drift',KeyU:'slash',KeyV:'super',KeyC:'cam',KeyG:'act'};
  addEventListener('keydown',ev=>{if(!this.on)return;if(ev.code==='Escape'||ev.code==='KeyP'){HS.togglePause();ev.preventDefault();return;}if(this.paused)return;
   if(KM[ev.code]){ev.preventDefault();if(!ev.repeat)this.press(KM[ev.code],true);}this.keys[ev.code]=true;if(ev.code.startsWith('Arrow'))ev.preventDefault();});
  addEventListener('keyup',ev=>{this.keys[ev.code]=false;if(KM[ev.code])this.press(KM[ev.code],false);});
  addEventListener('blur',()=>this.clearInput());
  const cv=document.getElementById('gl');cv.addEventListener('contextmenu',e=>e.preventDefault());
  cv.addEventListener('pointerdown',ev=>{if(!this.on||this.paused)return;if(ev.pointerType==='mouse'){if(ev.button===0)this.press('fr',true);if(ev.button===2)this.press('fl',true);if(ev.button===1)this.press('sp',true);}
   else{this.drag={id:ev.pointerId,x:ev.clientX};}});
  addEventListener('pointerup',ev=>{if(ev.pointerType==='mouse'){if(ev.button===0)this.press('fr',false);if(ev.button===2)this.press('fl',false);if(ev.button===1)this.press('sp',false);}if(this.drag&&this.drag.id===ev.pointerId)this.drag=null;});
  addEventListener('pointermove',ev=>{if(this.drag&&this.drag.id===ev.pointerId){this.camYaw-=(ev.clientX-this.drag.x)*.006;this.drag.x=ev.clientX;this.manualT=1.2;}});
  cv.addEventListener('wheel',ev=>{if(this.on){this.camYaw-=ev.deltaX*.003;}},{passive:true});
  const st=document.getElementById('stick'),kn=st.querySelector('.knob');let sid=null;
  const mv=ev=>{const r=st.getBoundingClientRect();const R=r.width/2;let dx=ev.clientX-(r.left+R),dy=ev.clientY-(r.top+R);const l=Math.hypot(dx,dy);if(l>R*.8){dx*=R*.8/l;dy*=R*.8/l;}kn.style.transform=`translate(${dx}px,${dy}px)`;
   let x=dx/(R*.8),y=-dy/(R*.8);const m=Math.hypot(x,y);if(m<.12){x=y=0;}this.stick.x=x;this.stick.y=y;};
  st.addEventListener('pointerdown',ev=>{ev.preventDefault();sid=ev.pointerId;st.setPointerCapture(sid);mv(ev);});
  st.addEventListener('pointermove',ev=>{if(ev.pointerId===sid)mv(ev);});
  const end=ev=>{if(ev.pointerId!==sid)return;sid=null;this.stick.x=this.stick.y=0;kn.style.transform='';};st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
  document.querySelectorAll('.tb').forEach(b=>{const k=b.dataset.k;let pid=null;
   b.addEventListener('pointerdown',ev=>{ev.preventDefault();pid=ev.pointerId;try{b.setPointerCapture(pid);}catch(e){}b.classList.add('on');AU.unlock&&AU.unlock();if(this.on&&!this.paused)this.press(k,true);});
   const up=ev=>{if(ev.pointerId!==pid)return;pid=null;b.classList.remove('on');this.press(k,false);};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
   b.addEventListener('contextmenu',e=>e.preventDefault());});
  document.getElementById('gPause').addEventListener('click',()=>HS.togglePause());},
 debugSkip(){if(!this.on||this.result||!this.ph)return false;const D=this.phData;
  if(this.ph.type==='reach'){this.P.pos.set(D.at.x,0,D.at.z);D.hold=this.ph.hold||0;}
  else if(this.ph.type==='escort'){for(const t of D.trucks)if(t.alive)t.pos.z=this.ph.to;}
  else if(this.ph.type==='defend'){D.waveI=this.ph.waves.length;for(const e of this.E)if(e.alive)this.killFoe(e);this.extra=1;this.phaseDone();}
  else if(this.ph.type==='endless'){this.wave+=3;this.finish(true);}
  else if(this.ph.type==='zombie'){Z.debugSkip(this);}
  else{for(const e of this.E)if(e.alive&&e.type!=='bleg'){if(e.type==='ace'){e.alive=false;e.gone=true;e.ready=true;if(e.grp){this.scene.remove(e.grp);this.scene.remove(e.shadow);}}else this.killFoe(e);}if(this.ph.type==='survive')this.stats.kills=this.phData.k0+this.ph.kills;if(this.ph.type==='kill'||this.ph.type==='duel'||this.ph.type==='boss')this.phaseDone();}
  return true;},
};
// ---------------- HUD ----------------
const HUD={
 $:id=>document.getElementById(id),
 reset(){this.c={};['bossbar','comm','tip','reticle','stamp','combo','hype','pop'].forEach(i=>this.$(i).classList.remove('on'));this.$('markers').innerHTML='';this.mk=[];this.bossE=null;
  this.$('cutin').classList.remove('on');this.$('objP').textContent='';this.dn=[];for(let i=0;i<14;i++){const d=document.createElement('div');d.className='dn';d.style.display='none';this.$('markers').appendChild(d);this.dn.push({el:d,t:0});}this.dnI=0;this.lastDn=null;
  const P=G.P;this.$('wpn').innerHTML='';this.$('kits').innerHTML='';},
 objective(ph,i,n){this.$('objT').textContent=(HS.lang==='ja'?'目標 ':'OBJECTIVE ')+(i+1)+'/'+n;this.$('objN').textContent=ph.obj[HS.lang];this.$('objP').textContent='';this.flashObj();
  this.$('bossbar').classList.toggle('on',false);this.bossE=null;},
 flashObj(){const o=this.$('obj');o.classList.remove('flash');void o.offsetWidth;o.classList.add('flash');},
 progress(t){if(this.c.prog!==t){this.c.prog=t;this.$('objP').textContent=t;}},
 tip(t){const el=this.$('tip');el.textContent=t;el.classList.add('on');clearTimeout(this.tipT);this.tipT=setTimeout(()=>el.classList.remove('on'),7000);},
 comm(c){if(!c)return;const ch=CHARS[c.who];this.$('commI').src=ch.img;this.$('commN').textContent=ch.name[HS.lang];this.$('commT').textContent=c[HS.lang];const el=this.$('comm');el.classList.add('on');AU.play('type',.5);
  clearTimeout(this.commT);this.commT=setTimeout(()=>el.classList.remove('on'),4200);},
 boss(e){this.bossE=e;const n=e.name[HS.lang]+(e.frame?' · '+e.frame[HS.lang]:'');this.$('bossN').textContent=n;this.$('bossbar').classList.add('on');},
 stamp(t){const el=this.$('stamp');el.textContent=t;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');},
 toast(t,short){HS.toast(t,short?900:1600);},
 pop(t,col){const el=this.$('pop');el.textContent=t;el.style.color=col||'#fff';el.classList.remove('on');void el.offsetWidth;el.classList.add('on');},
 hype(t){const el=this.$('hype');el.textContent=t;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');AU.play('hype');},
 updFun(P){const c=this.c;const cb=G.combo;if(c.combo!==cb){c.combo=cb;const el=this.$('combo');el.classList.toggle('on',cb>=2);if(cb>=2){this.$('comboN').textContent=cb;this.$('comboL').textContent=HS.T('hits');el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');el.dataset.tier=cb>=50?3:cb>=20?2:cb>=10?1:0;}}
  if(G.comboT>0)this.$('comboBar').style.width=(G.comboT/2.2*100)+'%';
  const sp=Math.floor(P.sup);if(c.sup!==sp){c.sup=sp;this.$('supb').style.width=sp+'%';const full=sp>=100;document.querySelector('.tb[data-k="super"]').classList.toggle('ready',full);this.$('supbox').classList.toggle('full',full);if(full&&!c.supFull)this.pop(HS.T('superReady'),'#ffd23a');c.supFull=full;}
  const dc=P.driftCd>0||P.enOut;if(c.dcd!==dc){c.dcd=dc;document.querySelector('.tb[data-k="drift"]').classList.toggle('cd',dc);}
  const sn=P.slashN;if(c.sn!==sn){c.sn=sn;this.$('slashPips').innerHTML=[1,2,3].map(i=>`<i class="${i<=sn?'on':''}"></i>`).join('');}},
 hurt(){const v=this.$('vign');v.classList.add('hurt');clearTimeout(this.hT);this.hT=setTimeout(()=>v.classList.remove('hurt'),90);},
 cutin(comp,name,cid,sup){const cv=this.$('cutC');const W=cv.width=520,H=cv.height=300;const g=cv.getContext('2d');g.clearRect(0,0,W,H);
  const src=comp.canvas,sw=src.width,sh=src.height*.6;const sc=Math.max(W/sw,H/sh)*1.05;g.drawImage(src,0,0,sw,sh,(W-sw*sc)/2,0,sw*sc,sh*sc);
  this.$('cutT').textContent=name;this.$('cutS').textContent=CHARS[cid].name[HS.lang];const el=this.$('cutin');el.classList.remove('on');el.classList.toggle('super',!!sup);void el.offsetWidth;el.classList.add('on');
  G.impact();clearTimeout(this.ciT);this.ciT=setTimeout(()=>el.classList.remove('on'),900);},
 proj(v){const p=_v3.copy(v).project(G.cam);const cv=G.R.domElement;return{x:(p.x*.5+.5)*cv.clientWidth,y:(-p.y*.5+.5)*cv.clientHeight,z:p.z};},
 dmgNum(p,n,crit,key){if(!this.dn||!G.cam)return;const s=this.proj(p);if(s.z>1)return;
  // merge rapid hits on the same target into one rising number (no piles of tiny numbers)
  const L=this.lastDn;if(key&&L&&L.key===key&&L.t>.35){L.n+=n;L.el.textContent=L.n.toLocaleString();L.t=.75;if(crit)L.el.className='dn crit';L.el.style.opacity=1;return;}
  const d=this.dn[this.dnI];this.dnI=(this.dnI+1)%this.dn.length;d.key=key;d.n=n;
  d.el.textContent=n.toLocaleString();d.el.className='dn'+(crit?' crit':'');d.x=s.x+rnd(-24,24);d.y=s.y-20+rnd(-10,0);d.t=.75;d.el.style.display='';d.el.style.transform=`translate(${d.x}px,${d.y}px)`;d.el.style.opacity=1;this.lastDn=d;},
 fmt(t){t=Math.max(0,Math.floor(t));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');},
 update(dt){const P=G.P;if(!P)return;const c=this.c;const set=(k,el,v,prop)=>{if(c[k]!==v){c[k]=v;if(prop)this.$(el).style[prop]=v;else this.$(el).textContent=v;}};
  set('ap','apv',String(Math.max(0,Math.round(P.ap))));set('apb','apb',(P.ap/P.apMax*100).toFixed(1)+'%','width');set('enb','enb',(P.en/P.enMax*100).toFixed(1)+'%','width');
  if(c.enout!==P.enOut){c.enout=P.enOut;this.$('enb').parentNode.parentNode.classList.toggle('out',P.enOut);}
  if(c.apLow!==(P.ap<P.apMax*.3)){c.apLow=P.ap<P.apMax*.3;this.$('apb').parentNode.classList.toggle('low',c.apLow);}
  const kk=P.kits+'/'+P.kitsMax;if(c.kits!==kk){c.kits=kk;let h='';for(let i=0;i<P.kitsMax;i++)h+=`<i class="${i<P.kits?'':'x'}"></i>`;this.$('kits').innerHTML=h;}
  set('timer','timer',G.mission&&G.mission.endless?HS.T('wave')+' '+G.wave:this.fmt(G.t));
  // weapons
  const L=HS.lang;const wbase=(s,short)=>{const W=P.W[s];if(!W)return'—';const w=W.p;return (short&&w.short&&w.short[L])||w.name[L].replace(/^[A-Z]{2}-\d+ /,'');};
  const wl=(s,short)=>{const W=P.W[s];if(!W)return'—';let t=wbase(s,short);if(W.rl>0)t+=(short?' ':' · ')+HS.T('reload');else if(W.p.mag)t+=(short?' ':' · ')+W.mag+(W.res!=null?'/'+W.res:'');if(W.held>0)t+=' ◆';return t;};
  const wk=['wr','wl',P.active].map(s=>wl(s)+wl(s,1)).join('|')+P.active+L;if(c.wk!==wk){c.wk=wk;
   this.$('tbR').textContent=wl('wr',1);this.$('tbL').textContent=wl('wl',1);this.$('tbS').textContent=wl(P.active,1);
   this.$('wpn').innerHTML=`<div>R · ${wl('wr')}</div><div>L · ${wl('wl')}</div><div class="on">${P.active==='sh'?'SH':'BK'} · ${wl(P.active)}</div>`+(P.W.sh&&P.W.bk&&P.W.bk.p.cls!=='rack'?`<div>⇄ ${P.active==='sh'?'BK':'SH'} · ${wl(P.active==='sh'?'bk':'sh')}</div>`:'');}
  // reticle
  const ret=this.$('reticle');const T=G.lock;if(T&&T.alive){const s=this.proj(G.aimPoint(T,0,P.pos));if(s.z<1){ret.classList.add('on');ret.style.transform=`translate(${s.x}px,${s.y}px)`;ret.classList.toggle('stag',T.stag>0);
    this.$('rAp').style.width=(T.ap/T.apMax*100)+'%';this.$('rSh').style.width=(T.shockMax?(T.stag>0?100:T.shock/T.shockMax*100):0)+'%';}else ret.classList.remove('on');}else ret.classList.remove('on');
  // boss bar
  if(this.bossE){const e=this.bossE;this.$('bossAp').style.width=(Math.max(0,e.ap)/e.apMax*100)+'%';this.$('bossSh').style.width=(e.stag>0?100:e.shockMax?e.shock/e.shockMax*100:0)+'%';this.$('bossSh').parentNode.classList.toggle('full',e.stag>0);}
  // objective markers
  const objs=G.objs||[];while(this.mk.length<objs.length){const d=document.createElement('div');d.className='mk';d.innerHTML='<i></i><span></span>';this.$('markers').appendChild(d);this.mk.push(d);}
  const cv=G.R.domElement,W=cv.clientWidth,H=cv.clientHeight;
  this.mk.forEach((d,i)=>{const o=objs[i];if(!o||(o.u&&!o.u.alive)){d.style.display='none';return;}d.style.display='';const p=o.u?o.u.pos.clone().setY(5):o.pos.clone().setY(3);const s=this.proj(p);let x=s.x,y=s.y,off=false;
   if(s.z>1){x=W-x;y=H-40;off=true;}if(x<30||x>W-30||y<60||y>H-30)off=true;x=clamp(x,30,W-30);y=clamp(y,90,H-40);d.classList.toggle('off',off);d.classList.toggle('ally',o.kind==='ally');d.style.transform=`translate(${x}px,${y}px)`;
   const txt=o.u?Math.round(o.u.ap/o.u.apMax*100)+'%':Math.round(Math.hypot(P.pos.x-o.pos.x,P.pos.z-o.pos.z))+'m';const sp=d.lastChild;if(sp.textContent!==txt)sp.textContent=txt;});
  for(const d of this.dn){if(d.t>0){d.t-=dt;d.y-=dt*70;if(d.t<=0){d.t=0;d.key=null;d.el.style.opacity=0;d.el.style.display='none';continue;}d.el.style.transform=`translate(${d.x}px,${d.y}px)`;d.el.style.opacity=Math.min(1,d.t*3);}}
  // touch button cooldown states
  const cd=(k,v)=>{if(c['cd'+k]!==v){c['cd'+k]=v;const b=document.querySelector(`.tb[data-k="${k}"]`);if(b)b.classList.toggle('cd',v);}};
  HUD.updFun(P);cd('rep',P.kits<=0);cd('ab',P.enOut);cd('dash',P.enOut);cd('up',P.enOut);cd('swap',!(P.W.sh&&P.W.bk&&P.W.bk.p.cls!=='rack'));
  const ab=document.querySelector('.tb[data-k="ab"]');if(ab&&c.abOn!==P.abOn){c.abOn=P.abOn;ab.classList.toggle('lit',P.abOn);}},
};
