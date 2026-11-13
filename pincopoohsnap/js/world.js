'use strict';
if(THREE.ColorManagement)THREE.ColorManagement.legacyMode=false;
// Course builder: rails, ground, backdrop dome and procedural props (all original).
const V3=THREE.Vector3;
const W={tex:{},
 loadTex(url){if(this.tex[url])return this.tex[url];const t=new THREE.TextureLoader().load(url);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;this.tex[url]=t;return t;},
 canvasTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;},
 mat(col,opt){return new THREE.MeshLambertMaterial(Object.assign({color:col},opt||{}));},
 matCache:{},m(col){return this.matCache[col]||(this.matCache[col]=this.mat(col));},
 rnd:null,seed(s){let x=s>>>0||1;this.rnd=()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296;};},
 R(a,b){return a+(b-a)*this.rnd();},pick(a){return a[(this.rnd()*a.length)|0];},
 // ---------- curves ----------
 makeCurves(co){const L=250,n=14;const ph=co.id.length*1.7;const A=[];
  for(let i=0;i<=n;i++){const z=i*L/n;const x=Math.sin(z*.018+ph)*9+Math.sin(z*.041+ph*2)*4;A.push(new V3(x,0,z));}
  const ca=new THREE.CatmullRomCurve3(A,false,'centripetal');let cb=null;
  if(co.fork){const B=[];const fz=co.fork.t*L;for(let i=0;i<=n;i++){const p=A[i].clone();if(p.z>fz){const k=Math.min(1,(p.z-fz)/60);p.x+=co.fork.dir*k*k*(3-2*k)*34;}B.push(p);}cb=new THREE.CatmullRomCurve3(B,false,'centripetal');}
  return{A:ca,B:cb,L};},
 // place relative to curve: t param, side, lateral distance
 place(curve,t,s,d){const p=curve.getPointAt(Math.min(.999,Math.max(0,t)));const tg=curve.getTangentAt(Math.min(.999,Math.max(0,t)));const nx=new V3(tg.z,0,-tg.x).normalize();/* nx points to the LEFT of travel */return p.clone().addScaledVector(nx,-s*d);},
 // ---------- build ----------
 build(co,scene){this.seed(co.id.split('').reduce((a,c)=>a*31+c.charCodeAt(0),7));const S=scene;const cv=this.makeCurves(co);this.cv=cv;this.co=co;this.occ=[];
  this.scene=S;S.background=new THREE.Color(co.fog);S.fog=new THREE.Fog(co.fog,70,230);
  const hemi=new THREE.HemisphereLight(0xffffff,0x9a8a70,co.night?.75:.95);S.add(hemi);const dl=new THREE.DirectionalLight(co.night?0xd0b8ff:0xfff2dc,co.night?.55:.8);dl.position.set(-40,80,30);S.add(dl);
  // backdrop dome (follows camera)
  this.dome=this.makeDome('art/bg_'+co.bg+'.webp');S.add(this.dome);
  // ground
  const gt=this.canvasTex(256,256,(g,w,h)=>{const c=new THREE.Color(co.ground);g.fillStyle='#'+c.getHexString();g.fillRect(0,0,w,h);for(let i=0;i<14;i++){const k=(Math.random()-.5)*.08;const cc=c.clone().offsetHSL(0,0,k);g.fillStyle='#'+cc.getHexString();g.globalAlpha=.5;g.beginPath();g.arc(Math.random()*w,Math.random()*h,20+Math.random()*50,0,7);g.fill();}g.globalAlpha=1;for(let i=0;i<1400;i++){const k=(Math.random()-.5)*.14;const cc=c.clone().offsetHSL(0,0,k);g.fillStyle='#'+cc.getHexString();const r=1+Math.random()*3;g.fillRect(Math.random()*w,Math.random()*h,r,r);}});
  gt.wrapS=gt.wrapT=THREE.RepeatWrapping;gt.repeat.set(60,60);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(800,800),new THREE.MeshLambertMaterial({map:gt}));gr.rotation.x=-Math.PI/2;gr.position.set(0,0,125);S.add(gr);
  if(co.water){const wm=new THREE.MeshLambertMaterial({color:co.night?0x3a5aa0:0x3ec5e0,transparent:true,opacity:.92});const w=new THREE.Mesh(new THREE.PlaneGeometry(400,800),wm);w.rotation.x=-Math.PI/2;w.position.set(co.water*(200+30),.05,125);S.add(w);this.waterMesh=w;
   const foam=new THREE.Mesh(new THREE.PlaneGeometry(2,800),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7}));foam.rotation.x=-Math.PI/2;foam.position.set(co.water*30,.07,125);S.add(foam);}
  // paths
  this.ribbon(cv.A,co.path,S);if(cv.B){this.ribbon(cv.B,co.path,S);this.barrier=this.makeBarrier();const bp=this.place(cv.B,co.fork.t+.07,0,0);this.barrier.position.copy(bp);const tg=cv.B.getTangentAt(co.fork.t+.07);this.barrier.rotation.y=Math.atan2(tg.x,tg.z);S.add(this.barrier);}
  // decor
  this.decor(co,S);
  return cv;},
 makeDome(url){const R=170,H=200;const g=new THREE.CylinderGeometry(R,R,H,72,1,true);const pos=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let th=Math.atan2(x,z)*180/Math.PI;/* 0 = forward(+z) */let a=th+60;a=((a%360)+360)%360;const k=Math.floor(a/120);let l=(a-k*120)/120;if(k%2)l=1-l;uv.setX(i,1-l);}
  uv.needsUpdate=true;const cv=document.createElement('canvas');cv.width=1280;cv.height=720;const t=new THREE.CanvasTexture(cv);t.wrapS=THREE.ClampToEdgeWrapping;if(THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;
  const im=new Image();im.onload=()=>{const g=cv.getContext('2d');g.drawImage(im,0,0,1280,720);const d=g.getImageData(0,0,1280,6).data;let r=0,gg=0,b=0,n=0;for(let i=0;i<d.length;i+=4){r+=d[i];gg+=d[i+1];b+=d[i+2];n++;}const col=`rgb(${r/n|0},${gg/n|0},${b/n|0})`;
   const gr=g.createLinearGradient(0,0,0,110);gr.addColorStop(0,col);gr.addColorStop(1,col.replace('rgb','rgba').replace(')',',0)'));g.fillStyle=gr;g.fillRect(0,0,1280,110);t.needsUpdate=true;
   if(this.scene)this.scene.background=new THREE.Color(col);};im.src=url;
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,fog:false,depthWrite:false}));m.renderOrder=-10;m.userData.H=H;m.position.y=H*.5-H*.52;return m;},
 ribbon(curve,col,S){const N=160,w=2.6;const pos=[],idx=[];for(let i=0;i<=N;i++){const t=i/N;const p=curve.getPointAt(t),tg=curve.getTangentAt(t);const nx=new V3(tg.z,0,-tg.x).normalize();const a=p.clone().addScaledVector(nx,w),b=p.clone().addScaledVector(nx,-w);pos.push(a.x,.03,a.z,b.x,.03,b.z);if(i<N){const j=i*2;idx.push(j,j+1,j+2,j+1,j+3,j+2);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide}));S.add(m);
  // edge dots
  const em=this.m(0xffffff);for(let i=0;i<N;i+=4){const t=i/N;const p=curve.getPointAt(t),tg=curve.getTangentAt(t);const nx=new V3(tg.z,0,-tg.x).normalize();for(const s of[-1,1]){const d=new THREE.Mesh(this.geo('dot'),em);d.position.copy(p).addScaledVector(nx,s*(w+.25));d.position.y=.06;S.add(d);}}},
 G:{},geo(k){if(this.G[k])return this.G[k];let g;switch(k){case'dot':g=new THREE.CylinderGeometry(.12,.12,.08,8);break;case'box':g=new THREE.BoxGeometry(1,1,1);break;case'cyl':g=new THREE.CylinderGeometry(.5,.5,1,12);break;case'cone':g=new THREE.ConeGeometry(.5,1,12);break;case'sph':g=new THREE.SphereGeometry(.5,14,10);break;case'ico':g=new THREE.IcosahedronGeometry(.5,1);break;case'tor':g=new THREE.TorusGeometry(.5,.08,8,24);break;}return this.G[k]=g;},
 part(k,col,sx,sy,sz,x,y,z,parent){const m=new THREE.Mesh(this.geo(k),this.m(col));m.scale.set(sx,sy,sz);m.position.set(x,y,z);if(parent)parent.add(m);return m;},
 makeBarrier(){const g=new THREE.Group();for(const x of[-2.8,2.8])this.part('cyl',0xffffff,.3,2.2,.3,x,1.1,0,g);for(let i=0;i<2;i++){const b=this.part('box',i?0xff5aa0:0xffffff,5.6,.4,.15,0,.9+i*.6,0,g);}const sign=this.part('box',0xffd23a,1.8,1,.1,0,2.3,0,g);return g;},
 // ---------- props ----------
 prop(k,S,p,rotY){const g=new THREE.Group();const P=(...a)=>this.part(...a,g);const R=(a,b)=>this.R(a,b);
  switch(k){
   case'palm':{const h=R(7,11);const seg=6;for(let i=0;i<seg;i++)P('cyl',0x9a6a3a,.5-i*.03,h/seg,.5-i*.03,Math.sin(i*.5)*.4,h/seg*(i+.5),0);for(let i=0;i<7;i++){const l=P('cone',0x3aa84a,.9,4.2,.25,0,h,0);l.rotation.set(Math.PI/2-.45,i*Math.PI*2/7,0,'YXZ');l.position.set(Math.sin(i*.9)*1.4,h-.2,Math.cos(i*.9)*1.4);l.lookAt(Math.sin(i*.9)*6,h-2.5,Math.cos(i*.9)*6);l.rotateX(Math.PI/2);}P('sph',0x7a4a2a,.5,.5,.5,.3,h-.3,.2);break;}
   case'tree':case'sakura':case'ginkgo':case'fern':{const col=k==='sakura'?0xffb7d5:k==='ginkgo'?0xffd23a:k==='fern'?0x2f9a3a:0x5ab84a;const h=k==='fern'?.4:R(2.4,3.6);P('cyl',0x8a5a3a,.45,h*2,.45,0,h,0);const n=k==='fern'?5:4;for(let i=0;i<n;i++)P('ico',col,R(2.4,3.4),R(2,2.8),R(2.4,3.4),R(-1.1,1.1),h*2+R(-.2,1.4),R(-1.1,1.1));if(k!=='fern')this.occ.push(g);break;}
   case'bush':for(let i=0;i<3;i++)P('ico',0x4aa848,R(1.4,2),R(1.1,1.5),R(1.4,2),R(-.8,.8),.6,R(-.5,.5));break;
   case'building':{const w=R(6,10),h=R(6,16),d=R(6,9);const cols=this.co.night?[0x4a3a7a,0x2a3a6a,0x6a3a6a,0x3a4a5a]:[0xf7c8a0,0xa8d8e8,0xf5e3a8,0xd8b8e8,0xbfe3c0,0xf3b8b8];const b=P('box',this.pick(cols),w,h,d,0,h/2,0);b.material=this.winMat(b.material.color.getHex());this.occ.push(g);P('box',0xffffff,w+.3,.4,d+.3,0,h,0);if(this.co.night&&this.rnd()<.6){const sc=new THREE.Mesh(this.geo('box'),new THREE.MeshBasicMaterial({color:this.pick([0xff4ad8,0x4af0ff,0xffe14a,0x8a6aff])}));sc.scale.set(w*.6,h*.25,.2);sc.position.set(0,h*.62,-d/2-.12);g.add(sc);}break;}
   case'shop':{const w=R(5,7);P('box',this.pick([0xff9ab8,0x7ad8d0,0xffd27a,0xb8a0f0,0x9ad87a]),w,4,4,0,2,0);const aw=P('box',this.pick([0xff5a7a,0x3ab0a0,0xffffff]),w+.4,.25,1.6,0,3.2,-2.6);aw.rotation.x=.35;P('box',0x9ad8ff,w*.6,1.6,.1,0,1.4,-2.05);this.occ.push(g);break;}
   case'umbrella':{P('cyl',0xffffff,.1,2.6,.1,0,1.3,0);const c=P('cone',this.pick([0xff5a8a,0x3ac0e0,0xffd23a,0x7ad85a]),3.4,1,3.4,0,2.8,0);P('box',0xffffff,1.6,.08,.9,1.6,.05,.6);break;}
   case'towel':P('box',this.pick([0xff7ab0,0x5ad0f0,0xffe14a]),1.2,.04,2.2,0,.03,0);break;
   case'gate':{for(const x of[-1.6,1.6])P('box',0xffffff,.3,2,.3,x,1,0);P('box',0x3a8ad8,3.4,.3,.15,0,1.8,0);P('box',0x3a8ad8,3.4,.3,.15,0,1,0);break;}
   case'bowl':{const t=new THREE.Mesh(new THREE.TorusGeometry(4,1,8,28,Math.PI*2),this.m(0xd8d8e0));t.rotation.x=Math.PI/2;t.position.y=.2;t.scale.z=.5;g.add(t);P('cyl',0xb8b8c8,7,.05,7,0,.05,0);break;}
   case'hoop':{P('cyl',0x444a55,.25,4,.25,0,2,0);P('box',0xffffff,1.8,1.2,.1,0,4,.2);const r=P('tor',0xff6a2a,1,1,1,0,3.5,.75);r.rotation.x=Math.PI/2;P('box',0xd8a06a,6,.04,6,0,.02,2.5);break;}
   case'gym':{for(const x of[-1.5,1.5])P('cyl',0x3a8ad8,.18,3,.18,x,1.5,0);P('cyl',0xdddddd,.08,3,.08,0,3,0).rotation.z=Math.PI/2;break;}
   case'cafe':{P('cyl',0xffffff,.08,.9,.08,0,.45,0);P('cyl',0xffffff,1.1,.08,1.1,0,.92,0);P('cyl',0xffffff,.06,2.4,.06,0,1.2,0);P('cone',this.pick([0x3ab0a0,0xff7a5a,0xf0c040]),2.6,.8,2.6,0,2.5,0);for(const x of[-1,1])P('box',0x9a6a3a,.6,.6,.6,x,.3,.4);break;}
   case'crate':P('box',0xc8945a,2.2,2,2.2,0,1,0);P('box',0x9a6a3a,2.3,.2,2.3,0,2,0);P('box',0x7ad8d0,2.4,1.1,.12,0,1.1,-1.15);break;
   case'bench':P('box',0x9a6a3a,2.4,.15,.7,0,.6,0);P('box',0x9a6a3a,2.4,.6,.12,0,1,.32);for(const x of[-1,1])P('box',0x555a66,.12,.6,.6,x,.3,0);break;
   case'planter':P('cyl',0xd8784a,.9,1,.9,0,.5,0);P('ico',0x4ab84a,1.4,1.2,1.4,0,1.3,0);P('sph',this.pick([0xff5a8a,0xffd23a,0xb08aff]),.4,.4,.4,.3,1.8,.2);break;
   case'stall':{P('box',0xd8a06a,3,1.1,1.6,0,.55,0);P('box',0xfff3e0,3.2,.1,1.8,0,1.15,0);for(const x of[-1.4,1.4])P('cyl',0x9a6a3a,.1,2.4,.1,x,2.1,.7);const r=P('box',this.pick([0xff5a5a,0x3a8ad8,0xffd23a]),3.4,.2,2,0,3.2,.2);r.rotation.x=-.2;for(let i=0;i<5;i++)P('sph',this.pick([0xff6a3a,0xffd23a,0x7ad85a,0xff4a8a]),.35,.35,.35,-1.1+i*.55,1.35,0);break;}
   case'fountain':{P('cyl',0xd8d8e0,3,.6,3,0,.3,0);P('cyl',0x6ad8f0,2.6,.1,2.6,0,.62,0);P('cyl',0xd8d8e0,.5,1.6,.5,0,1.1,0);P('cyl',0xd8d8e0,1.2,.25,1.2,0,1.9,0);const w=P('cone',0xbff0ff,.9,1,.9,0,2.5,0);w.material=new THREE.MeshBasicMaterial({color:0xdff8ff,transparent:true,opacity:.7});break;}
   case'vending':P('box',this.pick([0xff4a5a,0x3a8ad8,0xffffff]),1.4,2.2,1,0,1.1,0);P('box',0xbff0ff,1,1.2,.05,0,1.4,-.52);break;
   case'lantern':{P('cyl',0x333333,.08,2.6,.08,0,1.3,0);const l=new THREE.Mesh(this.geo('sph'),new THREE.MeshBasicMaterial({color:0xff6a5a}));l.scale.set(.8,1.1,.8);l.position.y=2.6;g.add(l);break;}
   case'picnic':P('box',this.pick([0xff5a7a,0x5ab0ff]),2.6,.03,2.6,0,.02,0);P('box',0xc8945a,.7,.5,.5,.5,.25,.4);P('sph',0xff3a3a,.3,.3,.3,-.6,.15,-.4);break;
   case'boat':{const b=P('box',0x9a6a3a,1.8,.6,5,0,.25,0);P('box',0xc8945a,1.6,.1,4.6,0,.56,0);for(let i=0;i<6;i++)P('sph',this.pick([0xffd23a,0xff6a3a,0x7ad85a,0xb04ad8]),.35,.35,.35,R(-.5,.5),.75,R(-1.8,1.8));P('cone',0xe8d098,1.4,.5,1.4,0,1.6,1.4);break;}
   case'tuktuk':P('box',0x3ac0d0,1.6,1.4,2.4,0,1.1,0);P('box',0xffd23a,1.8,.2,2.6,0,2,0);for(const z of[-.9,.9])for(const x of[-.8,.8])P('cyl',0x222222,.6,.25,.6,x,.35,z).rotation.z=Math.PI/2;break;
   case'rock':P('ico',0x3a3a40,R(1.6,2.6),R(1,1.8),R(1.6,2.6),0,.5,0);break;
   case'surf':for(let i=0;i<3;i++){const s=P('box',this.pick([0xff5a8a,0x3ac0e0,0xffd23a,0x7ad85a,0xff8a3a]),.6,2.6,.12,(i-1)*.8,1.3,0);s.rotation.z=(i-1)*.12;}break;
   case'torch':P('cyl',0x8a5a3a,.15,2.6,.15,0,1.3,0);{const f=new THREE.Mesh(this.geo('cone'),new THREE.MeshBasicMaterial({color:0xffa23a}));f.scale.set(.4,.8,.4);f.position.y=2.9;g.add(f);}break;
   case'torii':{for(const x of[-3,3])P('cyl',0xe8502a,.5,7,.5,x,3.5,0);P('box',0xe8502a,8.4,.5,.6,0,6,0);P('box',0x333333,9.4,.4,.8,0,6.9,0);break;}
   case'lamp':P('cyl',0x444a55,.1,4,.1,0,2,0);{const l=new THREE.Mesh(this.geo('sph'),new THREE.MeshBasicMaterial({color:0xfff2b0}));l.scale.set(.5,.5,.5);l.position.y=4.1;g.add(l);}break;
   case'spire':{P('box',0xf3e3c0,4,3,4,0,1.5,0);P('cone',0xffc23a,3,8,3,0,7,0);P('cone',0xe8502a,5,1.6,5,0,3.6,0);this.occ.push(g);break;}
   case'hibiscus':for(let i=0;i<3;i++)P('sph',this.pick([0xff3a5a,0xff7ab0,0xffd23a]),.5,.3,.5,R(-.6,.6),.5+R(0,.4),R(-.6,.6));P('ico',0x2f9a3a,1.4,.8,1.4,0,.4,0);break;
   case'screen':{P('box',0x222233,.4,6,.4,0,3,0);const s=new THREE.Mesh(this.geo('box'),new THREE.MeshBasicMaterial({color:this.pick([0xff4ad8,0x4af0ff,0xffe14a,0x9a6aff])}));s.scale.set(5,3,.2);s.position.y=6.5;g.add(s);break;}
   case'crosswalk':for(let i=0;i<8;i++)P('box',0xffffff,1,.02,6,(i-3.5)*1.6,.04,0);break;
   case'flowers':for(let i=0;i<6;i++)P('sph',this.pick([0xff5a8a,0xffd23a,0xffffff,0xb08aff]),.3,.3,.3,R(-1,1),.25,R(-1,1));break;
   case'pier':for(let i=0;i<8;i++){P('cyl',0x7a5a3a,.4,3,.4,-2,1,i*3);P('cyl',0x7a5a3a,.4,3,.4,2,1,i*3);}P('box',0xa07a5a,5,.3,24,0,2.5,10.5);break;
  }
  g.position.copy(p);g.rotation.y=rotY||0;S.add(g);if(['bush','rock','tree','palm','sakura','ginkgo','building','shop','stall','cafe','vending','hibiscus'].includes(k)&&!this.occ.includes(g))this.occ.push(g);return g;},
 winMat(col){const k='w'+col+(this.co.night?'n':'');if(this.matCache[k])return this.matCache[k];const night=this.co.night;const c=new THREE.Color(col);
  const t=this.canvasTex(64,128,(g,w,h)=>{g.fillStyle='#'+c.getHexString();g.fillRect(0,0,w,h);for(let y=8;y<h-6;y+=16)for(let x=6;x<w-6;x+=14){g.fillStyle=night?(Math.random()<.6?'#ffe9a0':'#2a2a44'):(Math.random()<.5?'#bfe9ff':'#ffffffaa');g.fillRect(x,y,8,9);}});
  t.wrapS=t.wrapT=THREE.RepeatWrapping;return this.matCache[k]=new THREE.MeshLambertMaterial({map:t,emissive:night?0x332244:0,emissiveIntensity:night?.6:0});},
 // ---------- decor sets per theme ----------
 decor(co,S){const cv=this.cv;const sets={
   beach:{near:['umbrella','towel','palm','surf','flowers'],far:['palm','shop','palm','building']},
   street:{near:['cafe','planter','lamp','bench','flowers'],far:['shop','shop','tree','building']},
   pier:{near:['umbrella','palm','lamp','towel','stall'],far:['palm','building','shop']},
   campus:{near:['bench','tree','lamp','flowers','bush'],far:['building','tree','tree']},
   crossing:{near:['lamp','vending','screen','lantern'],far:['building','building','building','screen']},
   sakura:{near:['sakura','lantern','bench','flowers'],far:['sakura','building','spire','sakura']},
   park:{near:['ginkgo','bench','bush','flowers','lamp'],far:['ginkgo','tree','ginkgo']},
   lane:{near:['planter','vending','lamp','bush'],far:['shop','building','tree','shop']},
   market:{near:['stall','palm','flowers','hibiscus'],far:['palm','spire','tree','palm']},
   jungle:{near:['fern','hibiscus','rock','palm'],far:['tree','palm','rock','fern']},
   luau:{near:['torch','surf','umbrella','palm','hibiscus'],far:['palm','palm','shop','building']}}[co.theme];
  const spawnPts=co.spawns.map(sp=>this.place(sp.path==='B'&&cv.B?cv.B:cv.A,sp.t,sp.s,sp.d));this.spawnPts=spawnPts;
  const segD=(p,a,b)=>{const ab=b.clone().sub(a);const t=Math.max(0,Math.min(1,p.clone().sub(a).dot(ab)/ab.lengthSq()));return a.clone().addScaledVector(ab,t).setY(0).distanceTo(p.clone().setY(0));};
  const sight=co.spawns.map((sp,i)=>{const c=sp.path==='B'&&cv.B?cv.B:cv.A;return[-.06,-.03,0,.03].map(dt=>[spawnPts[i],c.getPointAt(Math.max(0,Math.min(1,sp.t+dt)))]);}).flat();
  const ok=(p,r)=>{for(const q of spawnPts)if(q.distanceTo(p)<Math.max(r,5))return false;for(const [a,b] of sight)if(segD(p,a,b)<3.2)return false;for(const c of[cv.A,cv.B])if(c){for(let i=0;i<=120;i++){if(c.getPointAt(i/120).distanceTo(p)<5.5)return false;}}return true;};
  const water=co.water;
  const curves=cv.B?[cv.A,cv.B]:[cv.A];
  for(const c of curves)for(let t=.02;t<1;t+=.035){for(const s of[-1,1]){if(water&&s===water&&this.rnd()<.7)continue;
     const d=this.R(6,13);const p=this.place(c,t+this.R(-.01,.01),s,d);if(ok(p,3.2)&&this.rnd()<.6)this.prop(this.pick(sets.near),S,p,this.R(0,6.28));
     const d2=this.R(18,40);const p2=this.place(c,t,s,d2);if((!water||s!==water)&&ok(p2,5)&&this.rnd()<.55){const g=this.prop(this.pick(sets.far),S,p2,0);g.lookAt(this.place(c,t,0,0));}}}
  // theme set-pieces near the rail
  if(co.theme==='crossing')for(const t of[.25,.55,.8])this.prop('crosswalk',S,this.place(cv.A,t,0,0),Math.atan2(cv.A.getTangentAt(t).x,cv.A.getTangentAt(t).z));
  if(co.theme==='park'||co.theme==='sakura')this.prop('torii',S,this.place(cv.A,.03,0,0),Math.atan2(cv.A.getTangentAt(.03).x,cv.A.getTangentAt(.03).z));
  if(co.theme==='pier'){const p=this.place(cv.A,.45,-1,24);this.prop('pier',S,p,-Math.PI/2);}
  if(co.theme==='jungle'){const p=this.place(cv.A,.4,1,26);const wf=new THREE.Mesh(new THREE.PlaneGeometry(8,22),new THREE.MeshBasicMaterial({color:0xe8fbff,transparent:true,opacity:.85}));wf.position.copy(p).add(new V3(0,11,0));wf.lookAt(this.place(cv.A,.4,0,0).setY(11));S.add(wf);this.prop('rock',S,p.clone().add(new V3(5,0,0)),0);this.prop('rock',S,p.clone().add(new V3(-5,0,0)),0);}
  // spawn props
  co.spawns.forEach((sp,i)=>{if(!sp.prop)return;const c=sp.path==='B'&&cv.B?cv.B:cv.A;const p=spawnPts[i];const to=this.place(c,sp.t,0,0);let off=new V3();
   const behind=p.clone().sub(to).setY(0).normalize();const side=new V3(behind.z,0,-behind.x);
   if(['umbrella','cafe','stall','tree','sakura','lantern','torch','fern','planter','vending','fountain','hoop','gym','surf'].includes(sp.prop))off.addScaledVector(behind,2.2).addScaledVector(side,1.6);
   if(['crate','bush','rock'].includes(sp.prop))off.addScaledVector(behind,-0.9);
   const g=this.prop(sp.prop==='tree'?'tree':sp.prop,S,p.clone().add(off),0);g.lookAt(to.x,0,to.z);{const oi=this.occ.indexOf(g);if(oi>=0)this.occ.splice(oi,1);}sp._prop=g;sp._propPos=p.clone().add(off);});
 },
};
