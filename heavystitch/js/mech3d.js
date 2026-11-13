/* Heavy Stitch v2.1: real 3D armor. Every equipped part is a Three.js mesh rig bolted onto the character
   cut-out (the cut-out is the chassis plane; helmets, plates, gauntlets, thrusters and guns sit around it in 3D).
   One shared offscreen WebGL renderer bakes the result into a 2D canvas used by the hangar, title, cutscenes
   and as the combat billboard texture. Falls back to the 2D painter (parts.js) if WebGL is unavailable. */
'use strict';
const MECH={R:null,ok:null,geo:{},mat:{},tex:{},
 init(){if(this.ok!==null)return this.ok;
  try{if(typeof THREE==='undefined')throw 0;const cv=document.createElement('canvas');cv.width=cv.height=8;
   const R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
   R.setPixelRatio(1);R.setClearColor(0x000000,0);R.outputEncoding=THREE.LinearEncoding;
   cv.addEventListener('webglcontextlost',e=>{e.preventDefault();this.ok=false;},false);
   cv.addEventListener('webglcontextrestored',()=>{this.ok=null;this.R=null;this.geo={};this.mat={};this.tex={};},false);
   this.R=R;this.maxDim=Math.min(4096,R.capabilities.maxTextureSize||4096);
   const g=new Uint8Array([70,70,70,255,165,165,165,255,255,255,255,255]);const gm=new THREE.DataTexture(g,3,1,THREE.RGBAFormat);gm.minFilter=gm.magFilter=THREE.NearestFilter;gm.generateMipmaps=false;gm.needsUpdate=true;this.grad=gm;
   this.ok=true;}catch(e){console.warn('MECH 3D unavailable, using 2D parts',e);this.ok=false;}
  return this.ok;},
 // ---------- materials ----------
 col(c){return new THREE.Color(c);},
 toon(c){const k='t'+c;return this.mat[k]||(this.mat[k]=new THREE.MeshPhongMaterial({color:this.col(c),specular:0x5a5f6a,shininess:38}));},
 glow(c){const k='g'+c;return this.mat[k]||(this.mat[k]=new THREE.MeshBasicMaterial({color:this.col(c)}));},
 ink(){return this.mat.ink||(this.mat.ink=new THREE.MeshBasicMaterial({color:0x0c0d13,side:THREE.BackSide}));},
 steel(){return this.toon('#c9ced8');},
 dark(){return this.toon('#24272f');},
 stripeTex(a){const k='s'+a;if(this.tex[k])return this.tex[k];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#141414';g.fillRect(0,0,64,64);g.strokeStyle=a;g.lineWidth=11;
  for(let x=-64;x<128;x+=22){g.beginPath();g.moveTo(x,64);g.lineTo(x+64,0);g.stroke();}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return this.tex[k]=t;},
 stripeMat(a){const k='sm'+a;return this.mat[k]||(this.mat[k]=new THREE.MeshPhongMaterial({map:this.stripeTex(a),specular:0x333333,shininess:20}));},
 haloTex(){if(this.tex.halo)return this.tex.halo;const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.3,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return this.tex.halo=new THREE.CanvasTexture(c);},
 haloMat(c){const k='h'+c;return this.mat[k]||(this.mat[k]=new THREE.SpriteMaterial({map:this.haloTex(),color:this.col(c),transparent:true,depthWrite:false,opacity:.85}));},
 // ---------- geometry ----------
 plateGeo(w,h,d,r){w=Math.max(1,w);h=Math.max(1,h);d=Math.max(1,d);const k=['p',w|0,h|0,d|0,r|0].join(',');if(this.geo[k])return this.geo[k];
  r=Math.min(r,w/2-.5,h/2-.5);const b=Math.min(d*.3,2.2);const W2=w/2-b,H2=h/2-b,rr=Math.max(.5,r-b);const s=new THREE.Shape();
  s.moveTo(-W2+rr,-H2);s.lineTo(W2-rr,-H2);s.quadraticCurveTo(W2,-H2,W2,-H2+rr);s.lineTo(W2,H2-rr);s.quadraticCurveTo(W2,H2,W2-rr,H2);s.lineTo(-W2+rr,H2);s.quadraticCurveTo(-W2,H2,-W2,H2-rr);s.lineTo(-W2,-H2+rr);s.quadraticCurveTo(-W2,-H2,-W2+rr,-H2);
  const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.5,d-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,curveSegments:4});g.center();g.computeBoundingBox();return this.geo[k]=g;},
 polyGeo(pts,d){const k='y'+pts.map(p=>p.map(v=>v.toFixed(1)).join(':')).join('|')+d;if(this.geo[k])return this.geo[k];const s=new THREE.Shape();s.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)s.lineTo(pts[i][0],pts[i][1]);
  const b=Math.min(d*.3,1.6);const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.5,d-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b*.8,bevelSegments:1});g.translate(0,0,-d/2);g.computeBoundingBox();return this.geo[k]=g;},
 cylGeo(r1,r2,h,n){const k=['c',r1.toFixed(1),r2.toFixed(1),h.toFixed(1),n].join(',');if(this.geo[k])return this.geo[k];const g=new THREE.CylinderGeometry(r1,r2,h,n||18);g.computeBoundingBox();return this.geo[k]=g;},
 sphGeo(r,part){const k='s'+r.toFixed(1)+(part||'');if(this.geo[k])return this.geo[k];const g=part==='half'?new THREE.SphereGeometry(r,24,12,0,Math.PI*2,0,Math.PI/2):new THREE.SphereGeometry(r,20,14);g.computeBoundingBox();return this.geo[k]=g;},
 torGeo(r,t){const k='o'+r.toFixed(1)+','+t.toFixed(1);if(this.geo[k])return this.geo[k];const g=new THREE.TorusGeometry(r,t,10,28);g.computeBoundingBox();return this.geo[k]=g;},
 boxGeo(w,h,d){const k=['b',w.toFixed(1),h.toFixed(1),d.toFixed(1)].join(',');if(this.geo[k])return this.geo[k];const g=new THREE.BoxGeometry(Math.max(.3,w),Math.max(.3,h),Math.max(.3,d));g.computeBoundingBox();return this.geo[k]=g;},
 // mesh + inverted-hull ink outline
 mesh(geo,mat,ol){const m=new THREE.Mesh(geo,mat);if(ol!==false){const bb=geo.boundingBox;const t=ol||1.3;const sx=bb.max.x-bb.min.x,sy=bb.max.y-bb.min.y,sz=bb.max.z-bb.min.z;
   const o=new THREE.Mesh(geo,this.ink());o.scale.set((sx+2*t)/Math.max(sx,.1),(sy+2*t)/Math.max(sy,.1),(sz+2*t)/Math.max(sz,.1));
   const cx=(bb.max.x+bb.min.x)/2,cy=(bb.max.y+bb.min.y)/2,cz=(bb.max.z+bb.min.z)/2;o.position.set(cx-cx*o.scale.x,cy-cy*o.scale.y,cz-cz*o.scale.z);m.add(o);}return m;},
};

// ---------- builder ----------
function mechBuild(charId,loadout,paint,opt){const M=MECH;const ch=CHARS[charId];const A=ch.a,u=A.unit;const P=paint;
 const part=s=>loadout&&loadout[s]?PARTS[loadout[s]]:null;const root=new THREE.Group();const marks={};const noz=[];
 const V=(x,y)=>[x,-y];// image px -> world
 const add=(par,obj,x,y,z,rx,ry,rz)=>{obj.position.set(x||0,y||0,z||0);obj.rotation.set(rx||0,ry||0,rz||0);par.add(obj);return obj;};
 const G=(x,y,z,rx,ry,rz)=>{const g=new THREE.Group();const p=V(x,y);add(root,g,p[0],p[1],z,0,0,0);g.rotation.order='ZYX';g.rotation.set((rx||0)-.16,ry||0,rz||0);return g;};
 const pl=(par,w,h,d,mat,x,y,z,r,ry,rz)=>add(par,M.mesh(M.plateGeo(w,h,d,r==null?Math.min(w,h)*.22:r),mat),x,y,z,0,ry||0,rz||0);
 const bx=(par,w,h,d,mat,x,y,z,rz)=>add(par,M.mesh(M.boxGeo(w,h,d),mat),x,y,z,0,0,rz||0);
 const cy=(par,r1,r2,h,mat,x,y,z,rx,ry,rz,ol)=>add(par,M.mesh(M.cylGeo(r1,r2,h,18),mat,ol),x,y,z,rx,ry,rz);
 const sp=(par,r,mat,x,y,z,ol)=>add(par,M.mesh(M.sphGeo(r),mat,ol),x,y,z);
 const gl=(par,w,h,d,c,x,y,z,rz)=>add(par,new THREE.Mesh(M.boxGeo(w,h,d),M.glow(c)),x,y,z,0,0,rz||0);
 const halo=(par,c,s,x,y,z)=>{const h=new THREE.Sprite(M.haloMat(c));h.scale.set(s,s,1);h.position.set(x,y,z);par.add(h);return h;};
 const bolt=(par,x,y,z,r)=>{r=r||u*.03;const b=cy(par,r,r,r*.8,M.steel(),x,y,z,Math.PI/2,0,0,.7);return b;};
 const stripe=(par,w,h,x,y,z,rz)=>{const m=new THREE.Mesh(M.boxGeo(w,h,1.2),M.stripeMat(P.a));m.material.map.repeat&&0;add(par,m,x,y,z,0,0,rz||0);return m;};
 const mark=(name,par,x,y,z)=>{const o=new THREE.Object3D();o.position.set(x,y,z||0);par.add(o);marks[name]=o;return o;};
 const nozzle=(par,x,y,z,rz,len,r)=>{const n=cy(par,r*.8,r*1.15,len,M.dark(),x,y,z,0,0,rz);const g=new THREE.Mesh(M.cylGeo(r*.9,r*.9,1,14),M.glow(P.g));g.position.y=-len/2-.4;n.add(g);halo(n,P.g,r*5.5,0,-len/2-r*.8,1);const o=new THREE.Object3D();o.position.y=-len/2-r;n.add(o);noz.push(o);return n;};
 const pri=M.toon(P.p),sec=M.toon(P.s),acc=M.toon(P.a);
 const trimC=p=>p&&p.tier>=3?'#ff3df0':null;
 const trim=(par,w,h,x,y,z,c)=>{if(!c)return;gl(par,w,1.6,1.6,c,x,y+h/2,z);gl(par,w,1.6,1.6,c,x,y-h/2,z);};
 const body=ch.body||'humanoid';const ry0=.5;
 // ---------- BACK weapon (behind, screen-right shoulder) ----------
 const bk=part('bk');if(bk){const s=bk.shape,g=G(A.bkw[0],A.bkw[1],-u*.32,0,-.25,0),tc=trimC(bk);
  if(s==='rack'){pl(g,u*.62,u*.56,u*.3,sec,0,u*.18,0);pl(g,u*.34,u*.3,u*.08,M.toon('#f4f1e6'),0,u*.24,u*.17,4);gl(g,u*.06,u*.22,1,P.g,0,u*.24,u*.22);gl(g,u*.22,u*.06,1,P.g,0,u*.24,u*.22);stripe(g,u*.56,u*.08,0,-u*.06,u*.16);mark('bk',g,0,u*.5,0);}
  else if(s==='bkcannon'){pl(g,u*.46,u*.4,u*.36,sec,0,0,0);const b=cy(g,u*.13,u*.15,u*1.5,pri,u*.18,u*.72,0,0,0,-.38);cy(b,u*.18,u*.18,u*.22,sec,0,u*.72,0);stripe(b,u*.2,u*.12,0,u*.15,u*.15);mark('bk',b,0,u*.84,0);trim(g,u*.46,u*.4,0,0,u*.19,tc);}
  else if(s==='kites'){cy(g,u*.06,u*.06,u*.7,sec,0,u*.3,0);for(const k of[-1,1]){const d=new THREE.Group();add(g,d,k*u*.36,u*.72+(k>0?u*.08:0),u*.1,0,0,k*.2);pl(d,u*.34,u*.18,u*.12,pri,0,0,0,6);cy(d,u*.1,u*.1,u*.03,M.dark(),-u*.22,u*.06,0,0,0,0);cy(d,u*.1,u*.1,u*.03,M.dark(),u*.22,u*.06,0,0,0,0);const L=sp(d,u*.05,M.glow(P.g),0,-u*.02,u*.08,false);halo(d,P.g,u*.3,0,0,u*.1);}mark('bk',g,0,u*.75,u*.1);}
  else if(s==='pulse'){pl(g,u*.36,u*.5,u*.3,sec,0,u*.1,0);const d=cy(g,u*.4,u*.22,u*.14,pri,0,u*.62,0,-1.1,0,0);const e=new THREE.Mesh(M.cylGeo(u*.24,u*.24,1,20),M.glow(P.g));e.position.y=u*.075;d.add(e);halo(g,P.g,u*1.1,0,u*.66,u*.2);mark('bk',g,0,u*.66,u*.2);trim(g,u*.36,u*.5,0,u*.1,u*.16,tc);}
  else if(s==='rail'){pl(g,u*.5,u*.42,u*.34,sec,0,0,0);const r=new THREE.Group();add(g,r,u*.1,u*.2,0,0,0,-.34);for(const k of[-1,1])pl(r,u*.08,u*1.7,u*.14,pri,k*u*.11,u*.8,0,2);gl(r,u*.05,u*1.4,u*.05,P.g,0,u*.8,0);halo(r,P.g,u*.5,0,u*1.6,u*.1);mark('bk',r,0,u*1.65,0);trim(g,u*.5,u*.42,0,0,u*.18,tc||'#ff3df0');}
  else if(s==='hunny'){pl(g,u*.34,u*.36,u*.3,sec,0,0,0);const pot=sp(g,u*.32,M.toon('#b06a2a'),0,u*.48,0);pot.scale.set(1,.85,1);cy(g,u*.26,u*.26,u*.1,M.toon('#f2a531'),0,u*.78,0);sp(g,u*.12,M.toon('#ffc21f'),0,u*.84,u*.06);for(const k of[-1,1])bolt(g,k*u*.3,u*.48,u*.12);mark('bk',g,0,u*.9,0);}
 }
 // ---------- BOOSTER (behind body, sticks out past the silhouette) ----------
 const bo=part('booster');if(bo){const X=Math.max(1,ch.w*.42/(u*.6)),s=bo.shape,g=G(A.back[0],A.back[1]-u*.16,-u*.42,0,0,0),tc=trimC(bo);pl(g,u*.7,u*.6,u*.3,sec,0,-u*.1,0);
  if(s==='puff'){for(const k of[-1,1]){const t=sp(g,u*.24,pri,k*u*.6*X,u*.1,u*.05);bx(g,u*.6*X,u*.08,u*.12,sec,k*u*.3*X,u*.06,0);nozzle(g,k*u*.6*X,-u*.2,u*.05,0,u*.2,u*.1);bolt(g,k*u*.6*X,u*.1,u*.27);stripe(g,u*.3,u*.06,k*u*.6*X,u*.2,u*.2);}}
  else if(s==='hornet'){for(const k of[-1,1]){const w=new THREE.Group();add(g,w,k*u*.6*X,u*.2,0,0,0,k*.4);pl(w,u*.24,u*.86,u*.2,pri,0,u*.1,0,8);stripe(w,u*.2,u*.12,0,u*.4,u*.11);nozzle(w,0,-u*.38,0,0,u*.16,u*.09);trim(w,u*.24,u*.86,0,u*.1,u*.11,tc);}}
  else if(s==='kettle'){for(const k of[-1,1]){const t=sp(g,u*.3,pri,k*u*.55*X,u*.34,0);t.scale.set(1,1.15,.8);cy(g,u*.08,u*.08,u*.14,sec,k*u*.55*X,u*.72,0);stripe(g,u*.4,u*.07,k*u*.55*X,u*.34,u*.25);nozzle(g,k*u*.68*X,-u*.04,0,k*.5,u*.24,u*.11);}bx(g,u*1.1*X,u*.12,u*.16,sec,0,u*.34,0);}
  else if(s==='comet'){for(const k of[-1,1]){const w=new THREE.Group();add(g,w,k*u*.3*X,u*.12,0,0,0,0);const pts=k>0?[[0,-u*.1],[u*.95,u*.62],[u*1.05,u*.5],[u*.25,-u*.3]]:[[0,-u*.1],[-u*.25,-u*.3],[-u*1.05,u*.5],[-u*.95,u*.62]];add(w,M.mesh(M.polyGeo(pts,u*.1),pri),0,0,0);
   add(w,M.mesh(M.polyGeo(k>0?[[u*.5,u*.25],[u*.92,u*.75],[u*.82,u*.3]]:[[-u*.5,u*.25],[-u*.82,u*.3],[-u*.92,u*.75]],u*.08),acc),0,0,u*.06);nozzle(w,k*u*.1,-u*.28,0,0,u*.2,u*.1);if(tc)gl(w,u*.9,1.6,1.6,tc,k*u*.5,u*.2,u*.07,k*.65);}}
  else if(s==='wildfire'){const RR=u*.78*Math.max(1,X*.9);add(g,M.mesh(M.torGeo(RR,u*.07),sec),0,u*.2,0);for(let i=0;i<8;i++){const a=Math.PI*(.05+.9*i/7);const x=Math.cos(a)*RR,y=u*.2+Math.sin(a)*RR;nozzle(g,x,y,0,a-Math.PI/2+Math.PI,u*.16,u*.07);}add(g,new THREE.Mesh(M.torGeo(RR,u*.02),M.glow(tc||P.g)),0,u*.2,u*.08);}
 }
 // ---------- character plane (the chassis) ----------
 if(opt.img){const k='c'+charId;let t=M.tex[k];if(!t||t.image!==opt.img){t=new THREE.Texture(opt.img);t.encoding=THREE.LinearEncoding;t.needsUpdate=true;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;M.tex[k]=t;}
  const pm=new THREE.Mesh(new THREE.PlaneGeometry(ch.w,ch.h),new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.45}));pm.position.set(ch.w/2,-ch.h/2,0);root.add(pm);}
 // ---------- LEGS / mobility ----------
 const lg=part('legs');if(lg){const s=lg.shape,tc=trimC(lg);
  if(body==='float'){const big=s==='anvil'?1.3:s==='sprint'?.95:s==='cloud'?1.15:1;
   for(const sd of['l','r']){const F=A['ft'+sd],k=sd==='l'?-1:1,g=G(F[0],F[1]+u*.1,u*.04,-.1,ry0*.5,0);
    const ring=add(g,M.mesh(M.torGeo(u*.3*big,u*.035*big),pri),0,0,0,Math.PI/2,0,0);if(s==='coil'||s==='cloud'||s==='anvil')add(g,M.mesh(M.torGeo(u*.24*big,u*.03),sec),0,-u*.07,0,Math.PI/2,0,0);
    for(const j of[-1,1]){const pod=new THREE.Group();add(g,pod,j*u*.33*big,u*.02,0,0,0,j*.15);cy(pod,u*.06*big,u*.07*big,u*.2*big,sec,0,0,0);pl(pod,u*.05,u*.14*big,u*.12*big,pri,j*u*.06*big,u*.02,0,2);nozzle(pod,0,-u*.13*big,0,0,u*.08,u*.055*big);}
    if(s==='sprint'||s==='comet')for(const j of[-1,1])add(g,M.mesh(M.polyGeo([[0,0],[j*u*.3,u*.22],[j*u*.22,-u*.02]],u*.05),acc),j*u*.38,0,0);
    if(s==='skate')for(const j of[-1,0,1])cy(g,u*.06,u*.06,u*.05,M.dark(),j*u*.18,-u*.16,u*.02,Math.PI/2,0,0);
    if(s==='cloud'){halo(g,P.g,u*1.0,0,-u*.18,u*.1);}
    if(tc)add(g,new THREE.Mesh(M.torGeo(u*.34*big,u*.015),M.glow(tc)),0,-u*.02,u*.03,Math.PI/2,0,0);}}
  else if(body==='pod'){const B=A.bottom,T=A.tail;const g=G(B[0],B[1]-u*.24,u*.14,0,ry0*.6,0);pl(g,u*.92,u*.3,u*.16,pri,0,0,0,8);stripe(g,u*.76,u*.08,0,u*.02,u*.085);trim(g,u*.92,u*.3,0,0,u*.09,tc);
   const len=s==='sprint'||s==='cloud'?1.25:s==='anvil'?1.0:1.1;const t=G(T[0],T[1],u*.1,0,0,-.5);cy(t,u*.16,u*.2,u*.42*len,sec,0,0,0);pl(t,u*.3,u*.2,u*.3,pri,0,u*.12,0,5);nozzle(t,0,-u*.22*len-u*.08,0,0,u*.16,u*.13);
   if(s==='coil')for(let i=0;i<3;i++)add(t,M.mesh(M.torGeo(u*.19,u*.025),M.steel()),0,-u*.04+i*u*.08,0,Math.PI/2,0,0);
   if(s==='sprint'||s==='comet'||s==='cloud')add(t,M.mesh(M.polyGeo([[0,0],[u*.32,u*.26],[u*.1,-u*.1]],u*.05),acc),u*.12,0,0);}
  else{for(const sd of['l','r']){const K=A['leg'+sd],F=A['ft'+sd];if(!K||!F)continue;const dx=F[0]-K[0],dy=F[1]-K[1],L=Math.hypot(dx,dy);const ang=Math.atan2(dx,dy);
    const gw=u*(s==='anvil'?.34:s==='sprint'?.2:.26),gh=Math.max(L*.95,u*.36);const g=G(K[0]+dx*.42,K[1]+dy*.42,u*.12,0,ry0,ang);
    pl(g,gw,gh,u*.13,pri,0,0,0,6);gl(g,gw*.18,gh*.5,1,P.g,0,-gh*.05,u*.07);trim(g,gw,gh,0,0,u*.07,tc);
    sp(g,gw*.42,sec,0,gh*.48,u*.04).scale.set(1,.8,.7);bolt(g,0,gh*.48,u*.1);
    if(s==='sprint')add(g,M.mesh(M.polyGeo([[0,u*.1],[u*.26,-u*.05],[0,-u*.12]],u*.05),acc),gw*.45,0,0);
    if(s==='coil')for(let i=0;i<4;i++)add(g,M.mesh(M.torGeo(gw*.5,u*.022),M.steel()),0,-gh*.1+i*u*.06,u*.02,Math.PI/2,0,0);
    const fg=G(F[0],F[1]-u*.04,u*.1,0,ry0,0);
    if(s==='anvil'){pl(fg,u*.5,u*.2,u*.3,sec,0,0,0,5);stripe(fg,u*.4,u*.07,0,0,u*.16);}
    if(s==='skate'){pl(fg,u*.44,u*.06,u*.2,pri,0,-u*.06,0,2);for(const j of[-1,1]){cy(fg,u*.06,u*.06,u*.06,M.dark(),j*u*.14,-u*.12,0,Math.PI/2,0,0);halo(fg,P.g,u*.2,j*u*.14,-u*.12,u*.05);}}
    if(s==='cloud'){const p=add(fg,M.mesh(M.cylGeo(u*.26,u*.22,u*.06,20),M.toon('#d6dbe3')),0,-u*.1,0);halo(fg,P.g,u*.8,0,-u*.14,u*.1);}
    nozzle(fg,-u*.16*(sd==='l'?1:-1),u*.1,-u*.02,(sd==='l'?-1:1)*.6,u*.12,u*.06);}}}
 // ---------- CORE: chest plating + shoulder armor ----------
 const co=part('core');if(co){const s=co.shape,tc=trimC(co);const[tx,ty,tw,th]=A.torso;
  if(body==='pod'){const g=G(tx,ty-th*.12,u*.16,0,ry0*.5,0);/*pod*/pl(g,tw*1.2,u*.24,u*.16,sec,0,th*.18,0,5);for(const k of[-1,1])pl(g,u*.16,u*.34,u*.22,pri,k*tw*.6,th*.18,0,4);
   const pw=tw*.74,ph=th*.62;coreFace(g,s,pw,ph,0,-th*.12,u*.06,tc);}
  else{const g=G(tx,ty-th*.04,u*.16,-.06,ry0*.6,0);const cf=body==='float'?.8:.92;coreFace(g,s,tw*cf,th*(body==='float'?.9:1),0,0,0,tc);
   const ps=s==='bastion'||s==='cathedral'?1.3:s==='quilt'?1.05:1;
   for(const sd of['l','r']){const S=A['sh'+sd],k=sd==='l'?-1:1;const pg=G(S[0]+k*u*.02,S[1]-u*.04,u*.12,0,ry0,-k*.25);
    const d=add(pg,M.mesh(M.sphGeo(u*.22*ps,'half'),pri),0,0,0);d.scale.set(1.1,.9,.75);
    pl(pg,u*.46*ps,u*.1,u*.2*ps,sec,0,-u*.02,0,3);bolt(pg,0,u*.12*ps,u*.15*ps);if(s==='bastion'||s==='brig')stripe(pg,u*.36*ps,u*.06,0,-u*.02,u*.11*ps);if(tc)gl(pg,u*.44*ps,1.6,1.6,tc,0,u*.04,u*.12*ps);}}
 }
 function coreFace(g,s,w,h,x,y,z,tc){
  if(s==='patch'){pl(g,w,h,u*.14,pri,x,y,z,8);bx(g,w*.18,h*.8,1.5,acc,x-w*.28,y,z+u*.075);for(const[a,b]of[[-1,1],[1,1],[-1,-1],[1,-1]])bolt(g,x+a*w*.4,y+b*h*.4,z+u*.08);gl(g,w*.3,u*.04,1,P.g,x+w*.12,y+h*.2,z+u*.08);}
  else if(s==='quilt'){for(let r=0;r<3;r++)for(let k=0;k<2;k++)pl(g,w*.47,h*.31,u*.12,r%2===k%2?pri:M.toon(shade(P.p,.86)),x+(k-.5)*w*.5,y+(1-r)*h*.33,z,6);gl(g,u*.035,h*.9,1,P.g,x,y,z+u*.07);}
  else if(s==='brig'){for(let r=0;r<4;r++)add(g,M.mesh(M.plateGeo(w*(1.04-r*.05),h*.3,u*.1,4),r%2?pri:M.toon(shade(P.p,.88))),x,y+h*.36-r*h*.24,z+r*u*.02,-.18,0,0);for(let i=0;i<5;i++)bolt(g,x-w*.4+i*w*.2,y+h*.4,z+u*.07);}
  else if(s==='rivet'){pl(g,w,h,u*.14,pri,x,y,z,10);const rc=cy(g,w*.22,w*.22,u*.12,sec,x,y+h*.06,z+u*.08,Math.PI/2,0,0);const d=new THREE.Mesh(M.cylGeo(w*.15,w*.15,1,22),M.glow(P.g));d.position.y=u*.065;rc.add(d);halo(g,P.g,w*.9,x,y+h*.06,z+u*.2);for(let i=0;i<8;i++){const a=i/8*6.283;bolt(g,x+Math.cos(a)*w*.3,y+h*.06+Math.sin(a)*w*.3,z+u*.08);}}
  else if(s==='bastion'){pl(g,w*1.1,h*1.04,u*.2,pri,x,y,z,6);pl(g,w*1.16,h*.18,u*.24,sec,x,y+h*.5,z+u*.02,4);for(const k of[-1,1]){bx(g,w*.16,h*.36,2,M.dark(),x+k*w*.24,y+h*.06,z+u*.11);for(let i=0;i<3;i++)gl(g,w*.12,1.8,1,P.g,x+k*w*.24,y+h*.18-i*h*.1,z+u*.12);}stripe(g,w*.9,h*.12,x,y-h*.38,z+u*.105);}
  else if(s==='cathedral'){pl(g,w*1.04,h*1.08,u*.16,pri,x,y,z,6);pl(g,w*.38,h*.82,u*.22,sec,x,y+h*.06,z+u*.02,4);for(let i=0;i<5;i++)gl(g,w*.28,1.8,1,P.g,x,y+h*.36-i*h*.15,z+u*.14);halo(g,P.g,w*.9,x,y+h*.15,z+u*.2);for(const k of[-1,1]){bx(g,w*.1,h*.5,2,M.dark(),x+k*w*.34,y+h*.08,z+u*.09);gl(g,w*.05,h*.42,1,'#ff3df0',x+k*w*.34,y+h*.08,z+u*.1);}stripe(g,w*.9,h*.08,x,y-h*.44,z+u*.09);}
  if(tc)trim(g,w,h,x,y,z+u*.09,tc);}
 // ---------- GEN (hip) ----------
 const ge=part('gen');if(ge&&A.hip){const s=ge.shape,g=G(A.hip[0],A.hip[1],u*.2,0,ry0,0);
  if(s==='pocket'){pl(g,u*.3,u*.3,u*.18,sec,0,0,0,4);gl(g,u*.18,u*.12,1,P.g,0,u*.02,u*.1);halo(g,P.g,u*.4,0,0,u*.12);}
  else if(s==='teapot'){const b=sp(g,u*.2,pri,0,0,0);b.scale.set(1,.85,.8);add(g,M.mesh(M.polyGeo([[0,0],[u*.2,u*.1],[u*.22,u*.06],[u*.02,-u*.06]],u*.06),sec),u*.14,0,0);sp(g,u*.07,M.glow(P.g),0,0,u*.16,false);halo(g,P.g,u*.5,0,0,u*.18);}
  else if(s==='spindle'){cy(g,u*.12,u*.12,u*.44,sec,0,0,0);for(let i=0;i<4;i++)add(g,new THREE.Mesh(M.torGeo(u*.125,u*.018),M.glow(P.g)),0,-u*.15+i*u*.1,0,Math.PI/2,0,0);cy(g,u*.16,u*.16,u*.06,pri,0,u*.24,0);cy(g,u*.16,u*.16,u*.06,pri,0,-u*.24,0);halo(g,P.g,u*.5,0,0,u*.15);}
  else if(s==='lantern'){cy(g,u*.17,u*.17,u*.06,pri,0,u*.2,0);cy(g,u*.17,u*.17,u*.06,pri,0,-u*.18,0);for(let i=0;i<4;i++){const a=i/4*6.283+.4;cy(g,u*.015,u*.015,u*.36,M.dark(),Math.cos(a)*u*.15,0,Math.sin(a)*u*.15);}sp(g,u*.11,M.glow(P.g),0,0,0,false);halo(g,P.g,u*.8,0,0,u*.2);}
  else if(s==='sun'){const d=cy(g,u*.17,u*.17,u*.08,M.toon('#ff3df0'),0,0,0,Math.PI/2,0,0);for(let i=0;i<10;i++){const a=i/10*6.283;add(g,M.mesh(M.polyGeo([[-u*.04,0],[u*.04,0],[0,u*.12]],u*.04),M.toon('#ff3df0'),.8),Math.cos(a)*u*.18,Math.sin(a)*u*.18,0,0,0,a-Math.PI/2);}sp(g,u*.09,M.glow(P.g),0,0,u*.05,false);halo(g,P.g,u*.9,0,0,u*.15);}
  pl(g,u*.32,u*.06,u*.14,sec,0,u*.26,-u*.02,2);}
 // ---------- ARMS ----------
 const ar=part('arms');if(ar){const s=ar.shape,tc=trimC(ar);
  if(body==='pod'){for(const sd of['l','r']){const m=A['m'+sd],H=A['h'+sd],k=sd==='l'?-1:1;const g=G(m[0],m[1],u*.14,0,ry0*.5,0);const L=Math.abs(H[0]-m[0]);const th=s==='board'||s==='atlas'?u*.2:s==='feather'?u*.1:u*.14;
    pl(g,L,th,u*.14,sec,k*L/2,0,0,3);pl(g,u*.22,u*.42,u*.24,pri,0,0,u*.02,6);bolt(g,0,u*.12,u*.14);bolt(g,0,-u*.12,u*.14);pl(g,u*.2,u*.36,u*.2,pri,k*(L-u*.06),0,0,5);
    if(s==='piston')cy(g,u*.03,u*.03,L*.8,M.steel(),k*L/2,th*.7,0,0,0,Math.PI/2);if(s==='spool')for(let i=0;i<4;i++)add(g,new THREE.Mesh(M.torGeo(th*.6,u*.015),M.glow(P.g)),k*(u*.2+i*u*.12),0,0,0,Math.PI/2,0);
    if(s==='atlas'||s==='board')stripe(g,L*.6,th*.5,k*L*.5,0,u*.075);if(s==='feather')for(let i=0;i<3;i++)add(g,M.mesh(M.polyGeo([[0,0],[k*u*.3,u*.08],[k*u*.28,-u*.02]],u*.04),i%2?acc:pri),k*(u*.2+i*u*.14),th*.5,0);
    if(tc)gl(g,L,1.6,1.6,tc,k*L/2,th/2,u*.08);}
   const band=G((A.ml[0]+A.mr[0])/2,A.ml[1],u*.12,0,0,0);pl(band,A.mr[0]-A.ml[0]+u*.1,u*.16,u*.12,sec,0,0,0,5);}
  else for(const sd of['l','r']){const S=A['sh'+sd],H=A['h'+sd];if(!S||!H)continue;const dx=H[0]-S[0],dy=H[1]-S[1],L=Math.hypot(dx,dy);const ang=Math.atan2(dx,dy);
   const bl=s==='board'||s==='atlas'?.6:.5,bw=s==='feather'?.18:s==='atlas'?.36:s==='board'?.32:.26;const g=G(S[0]+dx*.66,S[1]+dy*.66,u*.16,0,ry0,ang);
   const gw=u*bw,gh=Math.max(L*bl,u*.3);
   if(s==='spool'){cy(g,gw*.5,gw*.5,gh,sec,0,0,0);for(let i=0;i<4;i++)add(g,new THREE.Mesh(M.torGeo(gw*.52,u*.016),M.glow(P.g)),0,-gh*.3+i*gh*.2,0,Math.PI/2,0,0);pl(g,gw*.4,gh*.9,u*.1,pri,gw*.45,0,0,3);}
   else if(s==='board'){pl(g,gw*1.5,gh*1.1,u*.12,pri,0,0,u*.04,6);stripe(g,gw*1.2,u*.1,0,gh*.3,u*.11);for(const j of[-1,1])bolt(g,j*gw*.55,-gh*.4,u*.11);}
   else if(s==='feather'){pl(g,gw,gh,u*.12,pri,0,0,0,4);for(let i=0;i<3;i++)add(g,M.mesh(M.polyGeo([[0,0],[-u*.34,u*.1],[-u*.3,-u*.02]],u*.04),i%2?acc:pri),-gw*.4,gh*.3-i*gh*.25,0);}
   else{pl(g,gw,gh,u*.16,pri,0,0,0,s==='atlas'?10:6);pl(g,gw*1.12,u*.08,u*.18,sec,0,-gh*.42,0,2);bolt(g,0,gh*.3,u*.09);
    if(s==='piston')for(const j of[-1,1])cy(g,u*.025,u*.025,gh*1.1,M.steel(),j*gw*.6,gh*.1,0);
    if(s==='atlas'){pl(g,gw*1.25,gh*.3,u*.2,M.toon(P.s),0,-gh*.25,u*.02,6);gl(g,gw*.8,1.8,1,'#ff3df0',0,gh*.1,u*.09);}
    if(s==='clamp')gl(g,gw*.5,1.8,1,P.g,0,0,u*.085);}
   if(tc)trim(g,gw,gh,0,0,u*.09,tc);
   const e=G(S[0]+dx*.38,S[1]+dy*.38,u*.12,0,0,0);sp(e,u*(s==='atlas'?.13:.1),sec,0,0,0);bolt(e,0,0,u*.1);
   const sh2=G(S[0]+dx*.16,S[1]+dy*.16,u*.1,0,ry0,ang);pl(sh2,u*bw*.9,L*.22,u*.12,M.toon(shade(P.p,.86)),0,0,0,4);}}
 // ---------- HEAD (helmet bolted over the head; snout/face stays clear) ----------
 const hd=part('head');if(hd){const s=hd.shape,tc=trimC(hd);const[hx,hy]=A.head,w=A.hw,rim=A.eyeY-.25*w,top=hy-.12*w;const R=w*.52,Hh=Math.max(w*.25,rim-top);
  const g=G(hx,rim,0,0,ry0*.6,0);const dome=add(g,M.mesh(M.sphGeo(R,'half'),pri),0,0,0);dome.scale.set(1,Hh/R,.86);
  add(g,M.mesh(M.cylGeo(R*1.05,R*1.07,w*.1,28),sec),0,w*.02,0);gl(g,R*.16,Hh*.9,1,P.a,0,Hh*.45,R*.86*.75);
  if(tc)add(g,new THREE.Mesh(M.cylGeo(R*1.08,R*1.08,1.6,28),M.glow(tc)),0,w*.07,0);
  const pod=k=>{const e=pl(g,w*.16,w*.26,w*.22,sec,k*R*1.02,-w*.06,0,5);sp(e,w*.04,M.glow(P.g),k*w*.02,0,w*.12,false);bolt(g,k*R*1.02,-w*.16,w*.12);};
  if(s==='visor'){pl(g,R*2.1,w*.17,w*.12,sec,0,-w*.02,R*.9,6);gl(g,R*1.6,w*.07,w*.02,P.g,0,-w*.02,R*.9+w*.065);halo(g,P.g,R*1.6,0,-w*.02,R*.9+w*.08);}
  else pod(-1),pod(1);
  if(s==='fin')add(g,M.mesh(M.polyGeo([[-w*.08,0],[-w*.02,Hh+w*.42],[w*.2,Hh+w*.22],[w*.12,0]],w*.08),acc),0,0,0);
  if(s==='horns'){const soft=body==='float';for(const k of[-1,1]){const hg=new THREE.Group();add(g,hg,k*R*.55,Hh*.7,0,0,0,-k*(soft?.25:.6));cy(hg,w*.04,w*.09,w*(soft?.26:.42),acc,0,w*(soft?.13:.21),0);if(soft)sp(hg,w*.07,M.glow(P.g),0,w*.28,0,false);else{const t=cy(hg,0,w*.04,w*.2,acc,0,w*.5,0,0,0,-k*.6);}}}
  if(s==='cluster'){const c=pl(g,w*.3,w*.32,w*.18,sec,R*.75,Hh*.45,R*.5,6);for(const[a,b,r]of[[-.04,.06,.07],[.07,.02,.05],[-.02,-.08,.045]]){cy(g,w*r,w*r,w*.05,M.dark(),R*.75+a*w,Hh*.45+b*w,R*.5+w*.1,Math.PI/2,0,0);sp(g,w*r*.7,M.glow(P.g),R*.75+a*w,Hh*.45+b*w,R*.5+w*.13,false);}}
  if(s==='halo'){add(g,M.mesh(M.torGeo(w*.42,w*.035),M.toon('#ff3df0')),0,Hh+w*.22,0,Math.PI/2-.25,0,0);add(g,new THREE.Mesh(M.torGeo(w*.42,w*.014),M.glow(P.g)),0,Hh+w*.22,w*.01,Math.PI/2-.25,0,0);halo(g,P.g,w*1.1,0,Hh+w*.22,0);pl(g,R*2.06,w*.13,w*.1,M.toon('#ff3df0'),0,w*.1,R*.86,5);}
  if(s==='cap'){pl(g,R*2.12,w*.09,w*.14,sec,0,-w*.02,R*.6,3);}
  marks.headTop=mark('headTop',g,0,Hh,0);}
 // ---------- FCS (sensor bolted to the side of the head) ----------
 const fc=part('fcs');if(fc){const s=fc.shape,[hx]=A.head,w=A.hw,g=G(hx+.6*w,A.eyeY-.34*w,w*.2,0,ry0,0);
  if(s==='peep'){pl(g,w*.18,w*.14,w*.14,sec,0,0,0,3);cy(g,w*.05,w*.05,w*.06,M.dark(),w*.1,0,0,0,0,Math.PI/2);sp(g,w*.035,M.glow(P.g),w*.14,0,0,false);halo(g,P.g,w*.3,w*.14,0,w*.04);}
  else if(s==='magpie'){pl(g,w*.16,w*.14,w*.14,sec,0,0,0,3);for(let i=0;i<3;i++){cy(g,w*.012,w*.012,w*.36+i*w*.06,M.dark(),-w*.04+i*w*.04,w*.2+i*w*.03,0,0,0,.2-i*.2);sp(g,w*.025,M.glow(P.g),-w*.08+i*w*.05+(1-i)*w*.04,w*.38+i*w*.06,0,false);}}
  else if(s==='needle'){pl(g,w*.36,w*.1,w*.12,sec,w*.12,0,0,3);pl(g,w*.12,w*.06,w*.1,pri,w*.08,w*.08,0,2);sp(g,w*.045,M.glow(P.g),w*.32,0,0,false);halo(g,P.g,w*.35,w*.32,0,w*.04);}
  else if(s==='oracle'){add(g,M.mesh(M.torGeo(w*.14,w*.022),M.toon('#ff3df0')),w*.12,w*.16,0,0,.6,0);sp(g,w*.07,M.glow(P.g),w*.12,w*.16,0,false);halo(g,P.g,w*.5,w*.12,w*.16,w*.05);pl(g,w*.1,w*.12,w*.1,sec,0,0,0,3);}}
 // ---------- WEAPONS (mounted on the hands / pylons, chunky) ----------
 const wu=u*(body==='float'?.92:1.02);
 for(const[sl,hand,dir]of[['wr','hl',-1],['wl','hr',1]]){const w=part(sl);if(!w||!A[hand])continue;const H=A[hand];const blade=['blade','pile'].includes(w.cls);
  const g=G(H[0],H[1],u*.32,0,dir<0?Math.PI-ry0:ry0,0);const inner=new THREE.Group();g.add(inner);inner.rotation.z=blade?-.32:-.05;
  const m=blade?bladeMesh(inner,w,wu):gunMesh(inner,w,wu);mark(sl,inner,m[0],m[1],0);if(body==='pod')bolt(g,0,0,u*.1);}
 function gunMesh(g,p,u2){const s=p.shape,tc=trimC(p);let mz=[u2*1.15,0];const D=u2*.2;
  const body_=(L,Hh,c)=>pl(g,L,Hh,D,c||pri,L/2-u2*.05,0,0,4);const barrel=(x,y,L,r)=>cy(g,r,r,L,M.dark(),x+L/2,y,0,0,0,Math.PI/2);
  bx(g,u2*.12,u2*.26,D*.8,sec,u2*.05,-u2*.15,0,-.2);
  if(s==='rifle'){body_(u2*.8,u2*.24);barrel(u2*.74,u2*.02,u2*.45,u2*.05);pl(g,u2*.3,u2*.1,D*.7,sec,u2*.38,u2*.18,0,3);sp(g,u2*.035,M.glow(P.g),u2*.53,u2*.18,D*.4,false);stripe(g,u2*.16,u2*.12,u2*.58,0,D/2+.6);pl(g,u2*.3,u2*.16,D*.8,sec,-u2*.2,-u2*.02,0,3);mz=[u2*1.2,u2*.02];}
  else if(s==='smg'){body_(u2*.6,u2*.28);cy(g,u2*.12,u2*.12,D*.9,sec,u2*.3,-u2*.2,0,Math.PI/2,0,0);barrel(u2*.55,u2*.03,u2*.28,u2*.045);stripe(g,u2*.14,u2*.1,u2*.15,u2*.04,D/2+.6);mz=[u2*.84,u2*.03];}
  else if(s==='shotgun'||s==='mitt'){body_(u2*.55,u2*.34);barrel(u2*.48,u2*.08,u2*.5,u2*.065);barrel(u2*.48,-u2*.07,u2*.5,u2*.065);stripe(g,u2*.16,u2*.14,u2*.1,0,D/2+.6);mz=[u2*.98,0];}
  else if(s==='longrifle'){body_(u2*.85,u2*.22);barrel(u2*.8,u2*.02,u2*.8,u2*.04);cy(g,u2*.06,u2*.06,u2*.5,sec,u2*.42,u2*.2,0,0,0,Math.PI/2);sp(g,u2*.04,M.glow(P.g),u2*.68,u2*.2,0,false);pl(g,u2*.4,u2*.16,D*.8,sec,-u2*.25,-u2*.02,0,3);mz=[u2*1.6,u2*.02];}
  else if(s==='burst'){body_(u2*.72,u2*.3);for(let i=0;i<3;i++)barrel(u2*.68,u2*.09-i*u2*.08,u2*.36,u2*.035);for(let i=0;i<4;i++)bolt(g,u2*.12+i*u2*.15,u2*.08,D/2+.4,u2*.025);mz=[u2*1.05,0];}
  else if(s==='cannon'){cy(g,u2*.2,u2*.24,u2*1.3,pri,u2*.55,0,0,0,0,Math.PI/2);cy(g,u2*.27,u2*.27,u2*.24,sec,u2*1.12,0,0,0,0,Math.PI/2);cy(g,u2*.13,u2*.13,u2*.26,M.dark(),u2*1.2,0,0,0,0,Math.PI/2);stripe(g,u2*.3,u2*.3,u2*.3,0,u2*.25);if(tc)gl(g,u2*1.2,1.8,1.8,tc,u2*.55,u2*.22,0);mz=[u2*1.34,0];}
  else if(s==='laser'){cy(g,u2*.12,u2*.12,u2*.95,pri,u2*.45,0,0,0,0,Math.PI/2);for(let i=0;i<3;i++)add(g,new THREE.Mesh(M.torGeo(u2*.13,u2*.03),M.glow(P.g)),u2*.3+i*u2*.18,0,0,0,Math.PI/2,0);sp(g,u2*.08,M.glow(P.g),u2*.96,0,0,false);halo(g,P.g,u2*.6,u2*.96,0,u2*.1);mz=[u2*1.02,0];}
  else if(s==='couture'){body_(u2*1.0,u2*.26,M.toon('#ff3df0'));for(let i=0;i<4;i++)gl(g,u2*.1,u2*.1,2,P.g,u2*.2+i*u2*.18,0,D/2+.8);barrel(u2*.95,0,u2*.45,u2*.045);halo(g,P.g,u2*.8,u2*.5,0,D);mz=[u2*1.42,0];}
  else{body_(u2*.5,u2*.22);barrel(u2*.45,u2*.02,u2*.2,u2*.04);stripe(g,u2*.12,u2*.1,u2*.25,0,D/2+.6);mz=[u2*.66,u2*.02];}
  if(tc&&s!=='cannon')gl(g,u2*.6,1.6,1.6,tc,u2*.3,u2*.13,D/2);return mz;}
 function bladeMesh(g,p,u2){const s=p.shape;let tip=[u2*1.3,0];pl(g,u2*.42,u2*.26,u2*.22,sec,0,0,0,4);bolt(g,-u2*.1,0,u2*.12);
  if(s==='cutter'){add(g,M.mesh(M.polyGeo([[u2*.15,-u2*.08],[u2*1.15,-u2*.08],[u2*1.38,u2*.03],[u2*.15,u2*.09]],u2*.05),M.toon('#dfe3ea')),0,0,0);pl(g,u2*.24,u2*.3,u2*.24,pri,u2*.15,0,0,3);for(let i=1;i<5;i++)bx(g,1.2,u2*.15,u2*.06,M.dark(),u2*.2+i*u2*.2,0,0,.4);tip=[u2*1.38,0];}
  else if(s==='shears'){for(const k of[-1,1])add(g,M.mesh(M.polyGeo([[u2*.1,0],[u2*1.15,k*u2*.04],[u2*1.1,k*u2*.13],[u2*.1,k*u2*.09]],u2*.04),M.toon('#d5dae2')),0,0,k*u2*.02);bolt(g,u2*.12,0,u2*.06,u2*.05);tip=[u2*1.15,0];}
  else if(s==='needle'){pl(g,u2*.8,u2*.4,u2*.3,pri,u2*.2,0,0,10);stripe(g,u2*.2,u2*.3,u2*.0,0,u2*.16);cy(g,u2*.07,0,u2*1.0,M.toon('#e9ecf2'),u2*1.1,0,0,0,0,-Math.PI/2);halo(g,P.g,u2*.5,u2*.7,0,u2*.1);tip=[u2*1.62,0];}
  else{const col=s==='regalia'?'#c58cff':s==='rapier'?'#ff4fa0':P.g;const L=s==='katana'?1.75:s==='regalia'?1.7:1.6;
   const bl=add(g,new THREE.Mesh(M.polyGeo(s==='moon'||s==='regalia'?[[u2*.15,-u2*.1],[u2*L*.7,u2*.22],[u2*L,0],[u2*L*.7,u2*.05],[u2*.15,u2*.08]]:[[u2*.18,-u2*.07],[u2*L,s==='katana'?u2*.05:0],[u2*.18,u2*.07]],u2*.03),M.glow(col)),0,0,u2*.02);
   const core=add(g,new THREE.Mesh(M.polyGeo([[u2*.2,-u2*.02],[u2*(L-.06),s==='katana'?u2*.04:0],[u2*.2,u2*.02]],u2*.035),M.glow('#ffffff')),0,0,u2*.04);
   for(let i=0;i<4;i++)halo(g,col,u2*.6,u2*(.4+i*.33),0,u2*.05);pl(g,u2*.08,u2*.34,u2*.24,s==='katana'?acc:M.toon('#ffd23a'),u2*.17,0,0,2);tip=[u2*L,0];}
  return tip;}
 // ---------- SHOULDER weapon (screen-left shoulder) ----------
 const shp=part('sh');if(shp){const s=shp.shape,g=G(A.shw[0],A.shw[1],u*.06,0,ry0,0),tc=trimC(shp);pl(g,u*.4,u*.1,u*.3,sec,0,-u*.02,0,3);
  if(s==='pod'){pl(g,u*.56,u*.44,u*.36,pri,0,u*.26,0,6);for(let i=0;i<2;i++)for(let j=0;j<2;j++){cy(g,u*.075,u*.075,u*.04,M.dark(),-u*.13+i*u*.26,u*.36-j*u*.2,u*.18,Math.PI/2,0,0);sp(g,u*.04,acc,-u*.13+i*u*.26,u*.36-j*u*.2,u*.19,false);}mark('sh',g,0,u*.3,u*.2);}
  else if(s==='swarm'){const b=sp(g,u*.34,pri,0,u*.28,0);b.scale.set(1,.75,.7);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)sp(g,u*.035,M.glow(P.g),i*u*.13,u*.28+j*u*.1,u*.24,false);mark('sh',g,0,u*.28,u*.25);}
  else if(s==='mortar'){const t=cy(g,u*.13,u*.15,u*.7,pri,-u*.12,u*.36,0,0,0,.45);cy(t,u*.17,u*.17,u*.1,sec,0,u*.36,0);stripe(t,u*.2,u*.1,0,0,u*.14);mark('sh',t,0,u*.4,0);}
  else if(s==='rockets'){for(const k of[-1,1]){cy(g,u*.12,u*.12,u*.6,pri,k*u*.16,u*.32,0);add(g,M.mesh(M.sphGeo(u*.12,'half'),acc),k*u*.16,u*.62,0);}stripe(g,u*.5,u*.08,0,u*.1,u*.13);mark('sh',g,0,u*.68,0);}
  else if(s==='gatling'){pl(g,u*.36,u*.32,u*.32,sec,0,u*.18,0,5);const b=new THREE.Group();add(g,b,-u*.2,u*.18,0,0,0,0);for(let i=0;i<6;i++){const a=i/6*6.283;cy(b,u*.03,u*.03,u*.72,M.steel(),-u*.36,Math.cos(a)*u*.07,Math.sin(a)*u*.07,0,0,Math.PI/2);}cy(b,u*.12,u*.12,u*.08,pri,-u*.62,0,0,0,0,Math.PI/2);mark('sh',b,-u*.74,0,0);}
  else if(s==='starburst'){const h=cy(g,u*.38,u*.38,u*.18,pri,0,u*.36,0,Math.PI/2,0,0,1.4);h.geometry=M.cylGeo(u*.38,u*.38,u*.18,6);for(let i=0;i<7;i++){const a=i/6*6.283,r=i<6?u*.22:0;sp(g,u*.05,M.glow(P.g),Math.cos(a)*r,u*.36+Math.sin(a)*r,u*.1,false);}halo(g,P.g,u*.7,0,u*.36,u*.12);mark('sh',g,0,u*.36,u*.12);}
  else if(s==='podburst'){sp(g,u*.16,sec,0,u*.32,0);for(let i=0;i<8;i++){const a=i/8*6.283;cy(g,u*.05,u*.05,u*.22,pri,Math.cos(a)*u*.22,u*.32+Math.sin(a)*u*.22,0,0,0,a-Math.PI/2);}halo(g,P.g,u*.5,0,u*.32,u*.12);mark('sh',g,0,u*.32,u*.12);}
  if(tc)gl(g,u*.5,1.6,1.6,tc,0,u*.06,u*.16);}
 mark('head',root,A.head[0],-A.head[1],0);mark('center',root,A.torso[0],-A.torso[1],0);
 return{root,marks,noz};}

// Render a loadout onto the character in 3D and bake it into a 2D canvas. Same contract as compose().
function compose3d(charId,loadout,paint,opt){opt=opt||{};const M=MECH;if(!M.init())return null;const ch=CHARS[charId];let S=opt.scale||2;
 const W=Math.round(ch.w*2.15),H=Math.round(ch.h*1.45);const ox=(W-ch.w)/2,oy=ch.h*.3;
 while(W*S>M.maxDim||H*S>M.maxDim)S*=.8;
 const cw=Math.round(W*S),chh=Math.round(H*S);const R=M.R;R.setSize(cw,chh,false);
 const scene=new THREE.Scene();const cam=new THREE.OrthographicCamera(-ox,W-ox,oy,-(H-oy),-3000,3000);cam.position.z=1000;cam.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xdfe8ff,0x3a3040,.42));const kl=new THREE.DirectionalLight(0xfff4e6,.78);kl.position.set(-.7,1.1,1.2);scene.add(kl);const rl=new THREE.DirectionalLight(0x8fd8ff,.42);rl.position.set(1.2,.2,.35);scene.add(rl);const fl=new THREE.DirectionalLight(0xffffff,.16);fl.position.set(0,-.4,1);scene.add(fl);
 const b=mechBuild(charId,loadout,paint,opt);scene.add(b.root);scene.updateMatrixWorld(true);
 R.clear();R.render(scene,cam);
 const cv=opt.canvas||document.createElement('canvas');cv.width=cw;cv.height=chh;const c=cv.getContext('2d');c.clearRect(0,0,cw,chh);
 if(!opt.noShadow){c.save();c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse((ox+ch.w/2)*S,(oy+ch.h+4)*S,ch.w*.45*S,10*S,0,0,7);c.fill();c.restore();}
 c.drawImage(R.domElement,0,0);
 const v=new THREE.Vector3();const px=o=>{o.getWorldPosition(v);v.project(cam);return[(v.x+1)/2*cw,(1-v.y)/2*chh];};
 const out={noz:b.noz.map(px)};for(const k in b.marks)out[k]=px(b.marks[k]);
 // free per-render objects (geometries/materials are cached and shared)
 b.root.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='PlaneGeometry'){o.geometry.dispose();o.material.dispose();}});
 return{canvas:cv,W:cw,H:chh,feetY:(oy+ch.h)*S,anchors:out,scale:S,mode:'3d'};}
