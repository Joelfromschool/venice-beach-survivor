'use strict';
if(THREE.ColorManagement)THREE.ColorManagement.legacyMode=false;
// Pinco Pooh Snap v1.1 world engine: merged vertex-colour scenery, sky dome, terrain, animated water,
// swaying foliage, neon/glow halos, instanced crowds and birds. Everything is procedural and original.
const V3=THREE.Vector3;
const _e=new THREE.Euler(),_q=new THREE.Quaternion(),_s=new V3(),_p=new V3(),_v=new V3(),_n=new V3(),_c=new THREE.Color(),_c2=new THREE.Color(),_nm=new THREE.Matrix3();
function MX(x,y,z,ry,sx,sy,sz,rx,rz){_e.set(rx||0,ry||0,rz||0,'YXZ');_q.setFromEuler(_e);_p.set(x||0,y||0,z||0);_s.set(sx==null?1:sx,sy==null?1:sy,sz==null?1:sz);return new THREE.Matrix4().compose(_p,_q,_s);}
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
// value noise
function hash2(x,y){let h=(x|0)*374761393+(y|0)*668265263;h=(h^(h>>>13))*1274126177;return((h^(h>>>16))>>>0)/4294967295;}
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
 const a=hash2(xi,yi),b=hash2(xi+1,yi),c=hash2(xi,yi+1),d=hash2(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,y){return vnoise(x,y)*.55+vnoise(x*2.1,y*2.1)*.3+vnoise(x*4.3,y*4.3)*.15;}

// ---------------- mesh builder (merges many parts into a few draw calls) ----------------
class MB{
 constructor(){this.L={};}
 lay(k){return this.L[k]||(this.L[k]={pos:[],nor:[],col:[],uv:[],sw:[],idx:[],n:0});}
 add(geo,mtx,col,k,o){o=o||{};k=k||'std';const ck=o.chunk===false?'x':Math.floor((mtx.elements[14]+60)/55);const L=this.lay(k+'|'+ck);
  const P=geo.attributes.position,N=geo.attributes.normal,U=geo.attributes.uv;const n0=L.n;_nm.getNormalMatrix(mtx);
  if(!geo.boundingBox)geo.computeBoundingBox();const y0=geo.boundingBox.min.y,hy=(geo.boundingBox.max.y-y0)||1;
  _c.set(col);const grad=o.grad!=null?new THREE.Color(o.grad):null;const by=mtx.elements[13];
  for(let i=0;i<P.count;i++){_v.fromBufferAttribute(P,i).applyMatrix4(mtx);L.pos.push(_v.x,_v.y,_v.z);
   _n.fromBufferAttribute(N,i).applyMatrix3(_nm).normalize();L.nor.push(_n.x,_n.y,_n.z);
   const ly=(P.getY(i)-y0)/hy;let f=1;if(o.ao)f=o.ao+(1-o.ao)*Math.min(1,ly*1.6);if(o.jit)f*=1+(hash2(i*7+n0,(_v.x*13|0)+(_v.z*7|0))-.5)*o.jit;
   if(grad){_c2.copy(_c).lerp(grad,ly);L.col.push(_c2.r*f,_c2.g*f,_c2.b*f);}else L.col.push(_c.r*f,_c.g*f,_c.b*f);
   if(o.uv&&U){const r=o.uv;L.uv.push(r[0]+(r[2]-r[0])*U.getX(i),r[1]+(r[3]-r[1])*U.getY(i));}else if(o.uvw&&U){L.uv.push(U.getX(i)*o.uvw[0],U.getY(i)*o.uvw[1]);}else L.uv.push(0,0);
   L.sw.push(o.sway?o.sway*Math.max(0,_v.y-by)*(o.swayK||1):0);}
  if(geo.index){const I=geo.index.array;for(let i=0;i<I.length;i++)L.idx.push(I[i]+n0);}else for(let i=0;i<P.count;i++)L.idx.push(n0+i);
  L.n+=P.count;}
 build(parent,mats){const out=[];for(const key in this.L){const L=this.L[key];if(!L.n)continue;const k=key.split('|')[0];const mat=mats[k];if(!mat)continue;
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(L.pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(L.nor,3));
   g.setAttribute('color',new THREE.Float32BufferAttribute(L.col,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(L.uv,2));if(k==='fol')g.setAttribute('aSway',new THREE.Float32BufferAttribute(L.sw,1));
   g.setIndex(L.idx);g.computeBoundingSphere();const m=new THREE.Mesh(g,mat);m.matrixAutoUpdate=false;
   if(k==='std'||k==='fol'||k==='sign'){m.castShadow=true;m.receiveShadow=true;}parent.add(m);out.push(m);}
  this.L={};return out;}
}

const W={tex:{},G:{},matCache:{},
 loadTex(url){if(this.tex[url])return this.tex[url];const t=new THREE.TextureLoader().load(url);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;this.tex[url]=t;return t;},
 canvasTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;},
 mat(col,opt){return new THREE.MeshLambertMaterial(Object.assign({color:col},opt||{}));},
 m(col){return this.matCache[col]||(this.matCache[col]=this.mat(col));},
 rnd:null,seed(s){let x=s>>>0||1;this.rnd=()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296;};},
 R(a,b){return a+(b-a)*this.rnd();},pick(a){return a[(this.rnd()*a.length)|0];},
 // legacy simple geometry cache (used by game.js for thrown apples/money)
 geo(k){if(this.G[k])return this.G[k];let g;switch(k){case'dot':g=new THREE.CylinderGeometry(.12,.12,.08,8);break;case'box':g=new THREE.BoxGeometry(1,1,1);break;case'cyl':g=new THREE.CylinderGeometry(.5,.5,1,12);break;case'cone':g=new THREE.ConeGeometry(.5,1,12);break;case'sph':g=new THREE.SphereGeometry(.5,14,10);break;case'ico':g=new THREE.IcosahedronGeometry(.5,1);break;case'tor':g=new THREE.TorusGeometry(.5,.08,8,24);break;}return this.G[k]=g;},
 U:{uTime:{value:0}},
 // ---------------- shape library (base at y=0 unless noted) ----------------
 SG:{},
 sg(key,fn){return this.SG[key]||(this.SG[key]=fn());},
 rbox(w,h,d,r){r=Math.min(r==null?.12:r,w*.45,h*.45,d*.45);const key='rb'+[w,h,d,r].map(v=>Math.round(v*20)).join('_');return this.sg(key,()=>{
   if(r<.05)return new THREE.BoxGeometry(w,h,d).translate(0,h/2,0);const g=new THREE.BoxGeometry(1,1,1,3,3,3);const P=g.attributes.position,N=g.attributes.normal;const hx=w/2,hy=h/2,hz=d/2;
   const map=(u,hh)=>{const a=Math.abs(u),s=Math.sign(u);if(a<.17)return u*6*(hh-r);return s*hh;};
   for(let i=0;i<P.count;i++){const x=map(P.getX(i),hx),y=map(P.getY(i),hy),z=map(P.getZ(i),hz);const ix=Math.max(-hx+r,Math.min(hx-r,x)),iy=Math.max(-hy+r,Math.min(hy-r,y)),iz=Math.max(-hz+r,Math.min(hz-r,z));
    _n.set(x-ix,y-iy,z-iz);const l=_n.length();if(l>1e-5){_n.multiplyScalar(1/l);P.setXYZ(i,ix+_n.x*r,iy+_n.y*r+hy,iz+_n.z*r);N.setXYZ(i,_n.x,_n.y,_n.z);}else P.setXYZ(i,x,y+hy,z);}
   return g;});},
 box(){return this.sg('box',()=>new THREE.BoxGeometry(1,1,1).translate(0,.5,0));},
 cyl(seg,top){seg=seg||12;top=top==null?1:top;return this.sg('cy'+seg+'_'+top,()=>new THREE.CylinderGeometry(.5*top,.5,1,seg,1).translate(0,.5,0));},
 cone(seg){seg=seg||12;return this.sg('co'+seg,()=>new THREE.ConeGeometry(.5,1,seg,1).translate(0,.5,0));},
 sph(seg){seg=seg||12;return this.sg('sp'+seg,()=>new THREE.SphereGeometry(.5,seg,Math.max(6,seg*2/3|0)));},
 hemi(seg){seg=seg||14;return this.sg('he'+seg,()=>new THREE.SphereGeometry(.5,seg,7,0,Math.PI*2,0,Math.PI/2));},
 quad(){return this.sg('quad',()=>new THREE.PlaneGeometry(1,1));},
 tor(arc,tube){arc=arc||Math.PI*2;tube=tube||.08;return this.sg('to'+arc.toFixed(2)+tube,()=>new THREE.TorusGeometry(.5,tube,8,28,arc));},
 blob(v){return this.sg('bl'+v,()=>{const g=new THREE.IcosahedronGeometry(.5,2);const P=g.attributes.position;
   // merge duplicate vertices so normals stay smooth
   const mp=new Map();for(let i=0;i<P.count;i++){const k=P.getX(i).toFixed(3)+P.getY(i).toFixed(3)+P.getZ(i).toFixed(3);if(!mp.has(k)){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);const d=1+(vnoise(x*3+v*7,y*3+z*2+v)-.5)*.42+(vnoise(x*7+v,z*7)-.5)*.12;mp.set(k,[x*d,y*d*(y<0?.75:1),z*d]);}const q=mp.get(k);P.setXYZ(i,q[0],q[1],q[2]);}
   g.computeVertexNormals();
   // smooth normals across seams
   const nm=new Map();const N=g.attributes.normal;for(let i=0;i<P.count;i++){const k=P.getX(i).toFixed(3)+P.getY(i).toFixed(3)+P.getZ(i).toFixed(3);const a=nm.get(k)||[0,0,0];a[0]+=N.getX(i);a[1]+=N.getY(i);a[2]+=N.getZ(i);nm.set(k,a);}
   for(let i=0;i<P.count;i++){const k=P.getX(i).toFixed(3)+P.getY(i).toFixed(3)+P.getZ(i).toFixed(3);const a=nm.get(k);_n.set(a[0],a[1],a[2]).normalize();N.setXYZ(i,_n.x,_n.y,_n.z);}
   return g;});},
 frond(){return this.sg('frond',()=>{// arched palm leaf with folded V section, base at origin, points +z
   const seg=10,pos=[],idx=[];for(let i=0;i<=seg;i++){const t=i/seg;const z=t*4.2;const y=Math.sin(t*Math.PI*.85)*1.1-t*t*1.6;const w=Math.sin(Math.min(1,t*1.3)*Math.PI)*.62+.04;
    pos.push(-w,y-.14*w,z, 0,y+.08,z, w,y-.14*w,z);if(i<seg){const a=i*3;idx.push(a,a+3,a+1,a+1,a+3,a+4,a+1,a+4,a+2,a+2,a+4,a+5);}}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);
   const g2=g.toNonIndexed();g2.computeVertexNormals();const N=g2.attributes.normal;for(let i=0;i<N.count;i++){if(N.getY(i)<0)N.setXYZ(i,-N.getX(i),-N.getY(i),-N.getZ(i));}
   g2.setAttribute('uv',new THREE.Float32BufferAttribute(new Array(N.count*2).fill(0),2));return g2;});},
 prism(){return this.sg('prism',()=>{// gable roof: width x, height y, depth z, ridge along z
   const s=new THREE.Shape();s.moveTo(-.5,0);s.lineTo(.5,0);s.lineTo(0,1);s.lineTo(-.5,0);const g=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false});g.translate(0,0,-.5);return g.toNonIndexed();});},
 lathe(key,pts,seg){return this.sg('la'+key,()=>{const g=new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||16);g.computeVertexNormals();return g;});},
 tube(key,curve,r,seg){return this.sg('tu'+key,()=>new THREE.TubeGeometry(curve,seg||48,r,6,false));},
 // ---------------- placement ----------------
 // put a part: base matrix * local transform
 put(mb,base,geo,x,y,z,ry,sx,sy,sz,col,k,o,rx,rz){mb.add(geo,base.clone().multiply(MX(x,y,z,ry,sx,sy,sz,rx,rz)),col,k,o);},
 place(curve,t,s,d){let tt=Math.min(.999,Math.max(0,t));const p=curve.getPointAt(tt);const tg=curve.getTangentAt(tt);if(t>.999)p.addScaledVector(tg,(t-.999)*this.cv.L);if(t<0)p.addScaledVector(tg,t*this.cv.L);
  const nx=new V3(tg.z,0,-tg.x).normalize();return p.clone().addScaledVector(nx,-s*d);},
 tanAt(curve,t){return curve.getTangentAt(Math.min(.999,Math.max(0,t)));},
 yawAt(curve,t){const tg=this.tanAt(curve,t);return Math.atan2(tg.x,tg.z);},
 // ---------------- curves ----------------
 makeCurves(co){const L=250,n=14;const ph=co.id.length*1.7;const A=[];
  for(let i=0;i<=n;i++){const z=i*L/n;const x=Math.sin(z*.018+ph)*9+Math.sin(z*.041+ph*2)*4;A.push(new V3(x,0,z));}
  const ca=new THREE.CatmullRomCurve3(A,false,'centripetal');let cb=null;
  if(co.fork){const B=[];const fz=co.fork.t*L;for(let i=0;i<=n;i++){const p=A[i].clone();if(p.z>fz){const k=Math.min(1,(p.z-fz)/60);p.x+=co.fork.dir*k*k*(3-2*k)*34;}B.push(p);}cb=new THREE.CatmullRomCurve3(B,false,'centripetal');}
  return{A:ca,B:cb,L};},
 // approximate distance from the rails (cheap; used for terrain + scatter)
 pathX(z,b){const co=this.co;const ph=co.id.length*1.7;const zz=Math.max(0,Math.min(250,z));let x=Math.sin(zz*.018+ph)*9+Math.sin(zz*.041+ph*2)*4;if(b&&co.fork){const fz=co.fork.t*250;if(zz>fz){const k=Math.min(1,(zz-fz)/60);x+=co.fork.dir*k*k*(3-2*k)*34;}}return x;},
 pathDist(x,z){let d=Math.abs(x-this.pathX(z));if(this.co.fork)d=Math.min(d,Math.abs(x-this.pathX(z,1)));const dz=z<0?-z:z>250?z-250:0;return Math.hypot(d,dz);},
 shoreX(z){return 31+Math.sin(z*.045)*3.2+Math.sin(z*.13)*1.1;},
 waterD(x,z){const w=this.co.water;if(!w)return-99;return w*x-this.shoreX(z);},// >0 = in water
 H(x,z){const d=this.pathDist(x,z);let h=0;const wd=this.waterD(x,z);
  if(d>16)h+=(fbm(x*.05,z*.05)-.45)*smooth(16,30,d)*1.2;
  const hill=this.VIS.hills==null?1:this.VIS.hills;if(d>55)h+=smooth(55,150,d)*(5+fbm(x*.012+3,z*.012)*16)*hill;
  if(this.co.water){if(wd>-1)h=Math.min(h,0)-smooth(-1,10,wd)*3.2;else if(wd>-30)h*=smooth(-1,-30,wd);}
  return h;},
};
// ---------------- per-course look ----------------
const VISCFG={
 venice:{top:0x3d9dff,hor:0xd4f0ff,sun:[-.5,.55,.65],sunC:0xfff1c8,hemiS:0xbfe6ff,hemiG:0xf3d9a8,hi:.95,di:1.05,gr:'sand',g1:0xf6dfa8,g2:0xeccf8e,path:'board',ring:'hills',ringC:0x9fb59a,deep:0x0f74c9,shal:0x48d9e0,birds:'gull'},
 abbot:{top:0x4aa2ff,hor:0xffe9d2,sun:[.45,.6,.6],sunC:0xfff0d0,hemiS:0xd6ecff,hemiG:0xd8c2a2,hi:.95,di:1.0,gr:'pave',g1:0xe2d6c0,g2:0xd3c4a8,path:'asphalt',ring:'hills',ringC:0xb0b89a,birds:'pigeon'},
 santamonica:{top:0x4d7fe8,hor:0xffd6b5,sun:[-.7,.32,.55],sunC:0xffd2a0,hemiS:0xffd9c4,hemiG:0xf2c890,hi:.9,di:1.1,gr:'sand',g1:0xf7dcae,g2:0xeec993,path:'bike',ring:'hills',ringC:0xb59a8e,deep:0x1c63b8,shal:0x5bc8d8,birds:'gull'},
 ucla:{top:0x4aa0ff,hor:0xd8f0ff,sun:[.4,.62,.55],sunC:0xfff4d8,hemiS:0xcbe8ff,hemiG:0x8fc46a,hi:.95,di:1.0,gr:'grass',g1:0x86d05e,g2:0x6fbd4c,path:'brick',ring:'hills',ringC:0x93ad8a,birds:'pigeon'},
 shibuya:{top:0x24195c,hor:0xb257c8,sun:[.3,.5,.6],sunC:0xd9b4ff,hemiS:0xb7a2ff,hemiG:0x6a4a8a,hi:1.25,di:.55,gr:'pave',g1:0x6d7194,g2:0x5e6386,path:'asphalt',ring:'city',ringC:0x3a3266,night:true,birds:null},
 tokyo:{top:0x5aaeff,hor:0xffe6f0,sun:[-.4,.62,.6],sunC:0xfff2e6,hemiS:0xd9ecff,hemiG:0xb6d690,hi:.95,di:1.0,gr:'grass',g1:0xa9da7c,g2:0x93cc68,path:'stone',ring:'city',ringC:0xb7bfd8,birds:'pigeon'},
 yoyogi:{top:0x4fa8ff,hor:0xe2f6ea,sun:[.5,.6,.5],sunC:0xfff4d0,hemiS:0xd2f0ff,hemiG:0x88c25a,hi:.95,di:1.0,gr:'grass',g1:0x8ed35e,g2:0x74c049,path:'gravel',ring:'forest',ringC:0x4f8f4a,deep:0x2c7f8e,shal:0x6fd0c0,birds:'crow'},
 uehara:{top:0x5aacff,hor:0xeaf3fb,sun:[-.45,.6,.55],sunC:0xfff4e0,hemiS:0xdaecff,hemiG:0xc9c3b2,hi:.95,di:.95,gr:'pave',g1:0xd2cfc6,g2:0xc4c1b8,path:'asphalt',ring:'city',ringC:0xb9c3d3,birds:'pigeon'},
 thailand:{top:0x2f96ff,hor:0xfff1cc,sun:[.5,.58,.6],sunC:0xfff0c0,hemiS:0xd0ecff,hemiG:0xa8d070,hi:.95,di:1.05,gr:'grass',g1:0x9ad470,g2:0x86c55c,path:'tile',ring:'jungle',ringC:0x6aa35a,deep:0x2a8a74,shal:0x6fd6b4,birds:'tropic'},
 maui:{top:0x2b94ff,hor:0xd6f6ff,sun:[-.4,.6,.6],sunC:0xfff6dc,hemiS:0xcdeeff,hemiG:0x6fb85a,hi:.95,di:1.05,gr:'grass',g1:0x69c252,g2:0x56ad44,path:'road',ring:'jungle',ringC:0x5e9a5a,deep:0x0b65c2,shal:0x3fd8e6,birds:'tropic',hills:1.5},
 hawaii:{top:0x2fa0ff,hor:0xd2f8ff,sun:[.5,.55,.6],sunC:0xfff4d8,hemiS:0xcff0ff,hemiG:0xf0dcae,hi:.95,di:1.05,gr:'sand',g1:0xf8e8c0,g2:0xeedba8,path:'sandplank',ring:'jungle',ringC:0x4f9a58,deep:0x0a6ec8,shal:0x4fe2e8,birds:'tropic',hills:1.3},
};
Object.assign(W,{
 VIS:{},
 // ---------------- textures ----------------
 groundTex(kind){const key='gt_'+kind;if(this.tex[key])return this.tex[key];
  const t=this.canvasTex(512,512,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);const R=Math.random;
   if(kind==='sand'){for(let i=0;i<9000;i++){const v=200+R()*55|0;g.fillStyle=`rgb(${v},${v-4},${v-14})`;g.fillRect(R()*w,R()*h,1+R()*2,1+R()*2);}
    g.globalAlpha=.06;g.strokeStyle='#b89a70';g.lineWidth=3;for(let y=0;y<h;y+=22){g.beginPath();for(let x=0;x<=w;x+=8)g.lineTo(x,y+Math.sin(x*.05+y)*5);g.stroke();}g.globalAlpha=1;}
   else if(kind==='grass'){for(let i=0;i<14000;i++){const v=190+R()*65|0;g.strokeStyle=`rgb(${v-30},${v},${v-50})`;g.lineWidth=1+R();const x=R()*w,y=R()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+(R()-.5)*4,y-3-R()*6);g.stroke();}
    for(let i=0;i<60;i++){g.fillStyle=['#fff','#ffe14a','#ff9ad0','#ffffff'][i%4];g.beginPath();g.arc(R()*w,R()*h,2,0,7);g.fill();}}
   else{for(let i=0;i<9000;i++){const v=205+R()*50|0;g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(R()*w,R()*h,2,2);}
    g.strokeStyle='rgba(120,120,120,.35)';g.lineWidth=3;for(let x=0;x<=w;x+=128){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();g.beginPath();g.moveTo(0,x);g.lineTo(w,x);g.stroke();}}});
  t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return this.tex[key]=t;},
 pathTex(kind){const key='pt_'+kind;if(this.tex[key])return this.tex[key];
  const t=this.canvasTex(256,512,(g,w,h)=>{const R=Math.random;const fill=c=>{g.fillStyle=c;g.fillRect(0,0,w,h);};const grain=(a,c)=>{for(let i=0;i<3000;i++){g.fillStyle=c||`rgba(0,0,0,${R()*a})`;g.fillRect(R()*w,R()*h,2,2);}};
   switch(kind){
    case'board':fill('#d9d2c4');grain(.08);g.strokeStyle='#bdb3a2';g.lineWidth=3;for(let y=0;y<h;y+=64){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}g.fillStyle='#ff6fa8';g.fillRect(14,0,10,h);g.fillStyle='#4ac6e8';g.fillRect(w-24,0,10,h);break;
    case'bike':fill('#cfc9bd');grain(.08);g.fillStyle='#2fb5a0';g.fillRect(w/2-60,0,120,h);g.fillStyle='#fff';for(let y=0;y<h;y+=128)g.fillRect(w/2-4,y,8,64);break;
    case'asphalt':fill('#5c6070');grain(.25,null);for(let i=0;i<2500;i++){g.fillStyle=`rgba(255,255,255,${R()*.08})`;g.fillRect(R()*w,R()*h,2,2);}g.fillStyle='#f4f4f4';g.fillRect(6,0,10,h);g.fillRect(w-16,0,10,h);g.fillStyle='#ffd23a';for(let y=0;y<h;y+=128)g.fillRect(w/2-5,y,10,70);break;
    case'road':fill('#585b63');grain(.25);g.fillStyle='#ffd23a';g.fillRect(w/2-12,0,8,h);g.fillRect(w/2+4,0,8,h);g.fillStyle='#fff';g.fillRect(8,0,8,h);g.fillRect(w-16,0,8,h);break;
    case'brick':for(let y=0;y<h;y+=32)for(let x=-(y/32%2)*32;x<w;x+=64){const v=R()*30|0;g.fillStyle=`rgb(${190+v},${100+v/2|0},${78+v/3|0})`;g.fillRect(x+2,y+2,60,28);}g.globalCompositeOperation='destination-over';fill('#e6d2bf');g.globalCompositeOperation='source-over';break;
    case'stone':fill('#d8d2c8');for(let y=0;y<h;y+=64)for(let x=-(y/64%2)*40;x<w;x+=80){const v=R()*24|0;g.fillStyle=`rgb(${214+v},${206+v},${192+v})`;g.beginPath();g.roundRect?g.roundRect(x+3,y+3,74,58,10):g.rect(x+3,y+3,74,58);g.fill();}break;
    case'gravel':fill('#d7c7a6');for(let i=0;i<5000;i++){const v=160+R()*80|0;g.fillStyle=`rgb(${v},${v-10},${v-30})`;g.beginPath();g.arc(R()*w,R()*h,1+R()*2.5,0,7);g.fill();}break;
    case'tile':fill('#e3c9a2');for(let y=0;y<h;y+=48)for(let x=0;x<w;x+=48){g.fillStyle=(x/48+y/48)%2?'#d7b58a':'#ecd5b2';g.fillRect(x+2,y+2,44,44);}break;
    case'sandplank':fill('#d9b98a');for(let y=0;y<h;y+=32){const v=R()*26|0;g.fillStyle=`rgb(${222+v},${190+v},${140+v})`;g.fillRect(0,y,w,29);g.fillStyle='rgba(120,80,40,.35)';g.fillRect(0,y+29,w,3);g.fillStyle='rgba(120,80,40,.5)';g.fillRect(20,y+12,5,5);g.fillRect(w-25,y+12,5,5);}break;
    default:fill('#ccc');}});
  t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return this.tex[key]=t;},
 glowTex(){if(this.tex.glow)return this.tex.glow;return this.tex.glow=this.canvasTex(64,64,(g)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);});},
 cloudTex(){if(this.tex.cloud)return this.tex.cloud;return this.tex.cloud=this.canvasTex(256,128,(g,w,h)=>{const R=Math.random;for(let i=0;i<26;i++){const x=40+R()*176,y=60+R()*36-(Math.abs(x-128)<60?18:0),r=18+R()*26;const gr=g.createRadialGradient(x,y-r*.3,r*.1,x,y,r);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.7,'rgba(250,252,255,.9)');gr.addColorStop(1,'rgba(235,242,255,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
   const sh=g.createLinearGradient(0,60,0,128);sh.addColorStop(0,'rgba(255,255,255,0)');sh.addColorStop(1,'rgba(190,205,230,.55)');g.globalCompositeOperation='source-atop';g.fillStyle=sh;g.fillRect(0,0,w,h);});},
 // neon / billboard ad strip for screens (scrolls)
 screenTex(){const t=this.canvasTex(256,1024,(g,w,h)=>{const C=['#ff4ad8','#4af0ff','#ffe14a','#8a6aff','#4aff9a','#ff7a3a'];const words=['SNAP!','ピンコ','MONEY','スナップ','PINCO','マネー','SMILE','パシャ!','POOH','カメラ'];
   for(let i=0;i<8;i++){const y=i*128;const gr=g.createLinearGradient(0,y,w,y+128);gr.addColorStop(0,C[i%6]);gr.addColorStop(1,C[(i+2)%6]);g.fillStyle=gr;g.fillRect(0,y,w,128);
    g.globalAlpha=.35;g.fillStyle='#fff';for(let k=0;k<6;k++){g.beginPath();g.arc(Math.random()*w,y+Math.random()*128,6+Math.random()*22,0,7);g.fill();}g.globalAlpha=1;
    g.font='bold 52px "Hiragino Sans","Arial Black",sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=8;g.strokeStyle='rgba(0,0,0,.35)';g.strokeText(words[i%words.length],w/2,y+66);g.fillStyle='#fff';g.fillText(words[i%words.length],w/2,y+64);}});
  t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;},
 // ---------------- sign atlas ----------------
 atlasInit(){const c=document.createElement('canvas');c.width=c.height=1024;this.atC=c;this.atG=c.getContext('2d');this.atG.fillStyle='#fff';this.atG.fillRect(0,0,1024,1024);this.atX=0;this.atY=0;this.atRow=0;
  this.atT=new THREE.CanvasTexture(c);this.atT.encoding=THREE.sRGBEncoding;this.atT.anisotropy=4;},
 atAlloc(w,h){if(this.atX+w>1024){this.atX=0;this.atY+=this.atRow;this.atRow=0;}if(this.atY+h>1024){this.atX=0;this.atY=0;}const r={x:this.atX,y:this.atY,w,h};this.atX+=w;this.atRow=Math.max(this.atRow,h);
  return r;},
 atUV(r){return[(r.x+1)/1024,1-(r.y+r.h-1)/1024,(r.x+r.w-1)/1024,1-(r.y+1)/1024];},
 // text sign; returns uv rect
 signUV(text,bg,fg,opt){opt=opt||{};const w=opt.w||256,h=opt.h||64;const r=this.atAlloc(w,h);const g=this.atG;g.save();g.translate(r.x,r.y);
  if(opt.neon){g.fillStyle=bg;g.fillRect(0,0,w,h);}else{g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle=opt.edge||'rgba(255,255,255,.9)';g.lineWidth=6;g.strokeRect(5,5,w-10,h-10);}
  g.textAlign='center';g.textBaseline='middle';let fs=opt.fs||h*.62;g.font=`900 ${fs}px "Chewy","Hiragino Sans","Arial Rounded MT Bold","Arial Black",sans-serif`;while(g.measureText(text).width>w*.88&&fs>10){fs-=2;g.font=`900 ${fs}px "Chewy","Hiragino Sans","Arial Rounded MT Bold","Arial Black",sans-serif`;}
  if(opt.neon){g.shadowColor=fg;g.shadowBlur=14;g.fillStyle='#fff';g.fillText(text,w/2,h/2+2);g.shadowBlur=0;g.lineWidth=2;g.strokeStyle=fg;g.strokeText(text,w/2,h/2+2);}
  else{g.lineWidth=fs*.14;g.strokeStyle='rgba(0,0,0,.25)';g.strokeText(text,w/2,h/2+3);g.fillStyle=fg;g.fillText(text,w/2,h/2+2);}
  g.restore();this.atT.needsUpdate=true;return this.atUV(r);},
 paintUV(w,h,fn){const r=this.atAlloc(w,h);const g=this.atG;g.save();g.beginPath();g.rect(r.x,r.y,w,h);g.clip();g.translate(r.x,r.y);fn(g,w,h);g.restore();this.atT.needsUpdate=true;return this.atUV(r);},
});
Object.assign(W,{
 // ---------------- materials ----------------
 makeMats(){const U=this.U;const night=this.VIS.night;
  const fol=new THREE.MeshLambertMaterial({vertexColors:true});
  fol.onBeforeCompile=s=>{s.uniforms.uTime=U.uTime;s.vertexShader='attribute float aSway;\nuniform float uTime;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat swp=uTime*1.6+position.x*.21+position.z*.17;transformed.x+=sin(swp)*aSway;transformed.z+=cos(swp*.8+1.3)*aSway*.7;transformed.y+=sin(swp*1.3)*aSway*.15;');};
  fol.customProgramCacheKey=()=>'snapfol';
  const M={
   std:new THREE.MeshLambertMaterial({vertexColors:true}),
   fol,
   glass:new THREE.MeshPhongMaterial({vertexColors:true,shininess:90,specular:0x8899aa}),
   glow:new THREE.MeshBasicMaterial({vertexColors:true}),
   sign:night?new THREE.MeshBasicMaterial({map:this.atT}):new THREE.MeshLambertMaterial({map:this.atT}),
   signB:new THREE.MeshBasicMaterial({map:this.atT}),
   scr:new THREE.MeshBasicMaterial({map:this.scrT}),
   cloud:new THREE.MeshBasicMaterial({map:this.cloudTex(),transparent:true,depthWrite:false,fog:false,vertexColors:true}),
   add:new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),
   alpha:new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.55,depthWrite:false,side:THREE.DoubleSide}),
  };M.far=M.std;M.cloud.renderOrder=-5;this.MATS=M;return M;},
 skyMat(){const V=this.VIS;return new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,
  uniforms:{uTop:{value:new THREE.Color(V.top)},uHor:{value:new THREE.Color(V.hor)},uSun:{value:new V3(...V.sun).normalize()},uSunC:{value:new THREE.Color(V.sunC)},uNight:{value:V.night?1:0}},
  vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform vec3 uTop,uHor,uSun,uSunC;uniform float uNight;varying vec3 vD;
   void main(){vec3 d=normalize(vD);float h=d.y;vec3 c=mix(uHor,uTop,pow(smoothstep(-.03,.75,h),.75));
    float s=max(dot(d,normalize(uSun)),0.);c+=uSunC*(pow(s,900.)*4.+pow(s,60.)*.45+pow(s,7.)*.16)*(1.-uNight*.85);
    if(uNight>.5){vec3 q=floor(d*220.);float r=fract(sin(dot(q,vec3(12.9898,78.233,37.719)))*43758.5453);c+=step(.996,r)*smoothstep(.08,.45,h)*vec3(.9,.9,1.);}
    gl_FragColor=vec4(c,1.);
    #include <encodings_fragment>
   }`});},
 waterMat(){const V=this.VIS;const U=this.U;return this.wMat=new THREE.ShaderMaterial({fog:false,
  uniforms:{uTime:U.uTime,uDeep:{value:new THREE.Color(V.deep||0x1a7fc8)},uShal:{value:new THREE.Color(V.shal||0x5fe0e6)},uSky:{value:new THREE.Color(V.hor)},uSide:{value:this.co.water||1},uFogC:{value:new THREE.Color(V.hor)},uFogN:{value:60},uFogF:{value:520}},
  vertexShader:`uniform float uTime;varying vec3 vW;varying float vFd;
   void main(){vec4 w=modelMatrix*vec4(position,1.);w.y+=sin(w.x*.23+uTime*1.5)*.13+sin(w.z*.29+uTime*1.1)*.11+sin((w.x+w.z)*.61+uTime*2.4)*.05;vW=w.xyz;vec4 mv=viewMatrix*w;vFd=-mv.z;gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform float uTime,uSide,uFogN,uFogF;uniform vec3 uDeep,uShal,uSky,uFogC;varying vec3 vW;varying float vFd;
   void main(){float sh=31.+sin(vW.z*.045)*3.2+sin(vW.z*.13)*1.1;float d=uSide*vW.x-sh;
    float k=clamp(d/45.,0.,1.);vec3 c=mix(uShal,uDeep,pow(k,.6));
    float n=sin(vW.x*.9+uTime*1.3)*sin(vW.z*.8-uTime*1.1)+sin(vW.x*.37-vW.z*.52+uTime*.7)*.8;c+=vec3(.13,.16,.16)*smoothstep(1.,1.7,n)*(1.-k*.5);
    float wave=fract(d*.085-uTime*.16);float band=smoothstep(.0,.05,wave)*(1.-smoothstep(.05,.16,wave))*(1.-smoothstep(4.,26.,d));
    float foam=(1.-smoothstep(-.6,2.2,d+sin(vW.z*.7+uTime*2.)*.5))*.9;
    c=mix(c,vec3(1.),clamp(foam+band*.7,0.,1.));
    vec3 V=normalize(cameraPosition-vW);float fr=pow(1.-clamp(V.y,0.,1.),4.);c=mix(c,uSky*1.05,fr*.55);
    c=mix(c,uFogC,smoothstep(uFogN,uFogF,vFd));gl_FragColor=vec4(c,1.);
    #include <encodings_fragment>
   }`});},
 haloMat(){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  uniforms:{uMap:{value:this.glowTex()},uScale:{value:window.innerHeight*Math.min(2,window.devicePixelRatio||1)*.9},uTime:this.U.uTime,uFogF:{value:300}},
  vertexShader:`attribute float aSize;attribute vec3 color;uniform float uScale,uTime,uFogF;varying vec3 vC;varying float vA;
   void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float fl=.85+.15*sin(uTime*3.+position.x*1.7+position.z);gl_PointSize=min(150.,aSize*uScale/max(1.,-mv.z))*fl;vC=color;vA=1.-smoothstep(uFogF*.4,uFogF,-mv.z);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform sampler2D uMap;varying vec3 vC;varying float vA;void main(){vec4 t=texture2D(uMap,gl_PointCoord);gl_FragColor=vec4(vC*t.a*vA,1.);}`});},
 halo(x,y,z,col,size){_c.set(col);this.HL.push(x,y,z,_c.r,_c.g,_c.b,size||1);},
 crowdAt(x,z,ry,o){if(!(o&&o.force)){if(this.pathDist(x,z)<6)return;const q=new V3(x,0,z);for(const sp of this.spawnPts||[])if(sp.distanceTo(q)<6.5)return;}this.CR.push({x,z,ry:ry||0,y:o&&o.y||this.H(x,z),s:o&&o.s||1});},
});
Object.assign(W,{
 // ---------------- build a course ----------------
 build(co,scene){this.seed(co.id.split('').reduce((a,c)=>a*31+c.charCodeAt(0),7));const S=scene;this.co=co;this.scene=S;const cv=this.makeCurves(co);this.cv=cv;this.occ=[];this.anims=[];this.HL=[];this.CR=[];this.birds=null;this.waterMesh=null;
  const V=this.VIS=Object.assign({},VISCFG[co.id]||VISCFG.venice);
  if(this.atT)this.atT.dispose();if(this.scrT)this.scrT.dispose();this.atlasInit();this.scrT=this.screenTex();
  const M=this.makeMats();const mb=this.mb=new MB();
  S.background=new THREE.Color(V.hor);S.fog=new THREE.Fog(V.hor,60,520);
  // lights
  const hemi=new THREE.HemisphereLight(V.hemiS,V.hemiG,V.hi);S.add(hemi);
  const dl=new THREE.DirectionalLight(V.sunC,V.di);this.dl=dl;const sd=new V3(...V.sun).normalize();this.sunDir=sd;dl.position.copy(sd).multiplyScalar(80);
  dl.castShadow=this.shadows!==false;dl.shadow.mapSize.set(1024,1024);const sc=dl.shadow.camera;sc.left=-38;sc.right=38;sc.top=38;sc.bottom=-38;sc.near=1;sc.far=220;dl.shadow.bias=-.0006;dl.shadow.normalBias=.04;S.add(dl);S.add(dl.target);
  // sky dome (follows camera)
  const dome=new THREE.Mesh(new THREE.SphereGeometry(440,32,16),this.skyMat());dome.renderOrder=-10;dome.frustumCulled=false;this.dome=dome;S.add(dome);
  this.terrain(S);
  if(co.water){const wg=new THREE.PlaneGeometry(520,960,90,170);wg.rotateX(-Math.PI/2);const w=new THREE.Mesh(wg,this.waterMat());w.position.set(co.water*(24+260),-.15,125);w.receiveShadow=false;S.add(w);this.waterPlane=w;}
  // rails (paths)
  this.ribbon(cv.A,S);if(cv.B){this.ribbon(cv.B,S);this.barrier=this.makeBarrier();const bp=this.place(cv.B,co.fork.t+.07,0,0);this.barrier.position.copy(bp);this.barrier.rotation.y=this.yawAt(cv.B,co.fork.t+.07);S.add(this.barrier);}else this.barrier=null;
  this.occG=new THREE.Group();S.add(this.occG);
  this.decor(co,S);
  if(typeof SETS!=='undefined'&&SETS[co.id])SETS[co.id](this,mb,co,cv);
  this.scatter();
  this.ring(mb);this.clouds(mb);
  mb.build(S,M);
  this.makeHalos(S);this.makeCrowd(S);this.makeBirds(S);
  this.perf={n:0,t:0,done:false};
  return cv;},
 occBox(x,y,z,w,h,d,ry){const m=new THREE.Mesh(this.box(),this.occM||(this.occM=new THREE.MeshBasicMaterial({visible:false})));m.position.set(x,y,z);m.scale.set(w,h,d);m.rotation.y=ry||0;m.updateMatrixWorld();this.occG.add(m);this.occ.push(m);return m;},
 terrain(S){const V=this.VIS,co=this.co;const N=150,SZ=780;const g=new THREE.PlaneGeometry(SZ,SZ,N,N);g.rotateX(-Math.PI/2);g.translate(0,0,125);
  const P=g.attributes.position;const cols=[];const c1=new THREE.Color(V.g1),c2=new THREE.Color(V.g2),wet=new THREE.Color(0xcfb486),grass=new THREE.Color(V.gr==='sand'?0xa9cf7a:V.g2),hill=new THREE.Color(V.ringC),uw=new THREE.Color(V.deep||0x3a7aa0),c=new THREE.Color();
  for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i);const h=this.H(x,z);P.setY(i,h);const n=fbm(x*.04,z*.04);c.copy(c1).lerp(c2,smooth(.35,.7,n));
   const d=this.pathDist(x,z);if(V.gr==='sand'&&!co.water||V.gr==='sand'&&this.waterD(x,z)<-40)c.lerp(grass,smooth(40,70,d)*.8);
   if(V.gr==='pave'&&d>26)c.lerp(new THREE.Color(V.night?0x3e4260:0xa9c98a),smooth(26,60,d)*.7);
   if(d>55)c.lerp(hill,smooth(55,170,d)*.55);
   if(co.water){const wd=this.waterD(x,z);if(wd>-14)c.lerp(wet,smooth(-14,-1,wd)*.7);if(wd>0)c.lerp(uw,smooth(0,8,wd));}
   cols.push(c.r,c.g,c.b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));g.computeVertexNormals();
  const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*SZ/9,uv.getY(i)*SZ/9);
  const t=this.groundTex(V.gr);const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:t,vertexColors:true}));m.receiveShadow=true;S.add(m);this.ground=m;},
 ribbon(curve,S){const V=this.VIS;const N=220,w=2.7;const pos=[],uv=[],idx=[];let len=0,prev=null;const t0=-.12,t1=1.2;
  const cb=[],cbi=[];// curbs
  for(let i=0;i<=N;i++){const t=t0+(t1-t0)*i/N;const p=this.place(curve,t,0,0);const tg=this.tanAt(curve,t);const nx=new V3(tg.z,0,-tg.x).normalize();if(prev)len+=p.distanceTo(prev);prev=p;
   const a=p.clone().addScaledVector(nx,w),b=p.clone().addScaledVector(nx,-w);pos.push(a.x,.05,a.z,b.x,.05,b.z);uv.push(0,len/10.8,1,len/10.8);
   if(i<N){const j=i*2;idx.push(j,j+1,j+2,j+1,j+3,j+2);}
   for(const s of[1,-1]){const o=p.clone().addScaledVector(nx,s*(w+.2)),q=p.clone().addScaledVector(nx,s*(w-.02)),r=p.clone().addScaledVector(nx,s*(w+.3));cb.push(q.x,.05,q.z,q.x,.12,q.z,o.x,.13,o.z,r.x,.02,r.z);}
   if(i<N){for(let s=0;s<2;s++){const b0=(i*2+s)*4,b1=((i+1)*2+s)*4;for(let k=0;k<3;k++){const A=b0+k,B=b0+k+1,C=b1+k,D=b1+k+1;if(s===0)cbi.push(A,C,B,B,C,D);else cbi.push(A,B,C,B,D,C);}}}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const t=this.pathTex(V.path);const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:t}));m.receiveShadow=true;S.add(m);
  const cg=new THREE.BufferGeometry();cg.setAttribute('position',new THREE.Float32BufferAttribute(cb,3));cg.setIndex(cbi);cg.computeVertexNormals();
  const ccol={board:0xc9bfae,bike:0xc4bcae,asphalt:0xa9acb6,road:0xb0b0b4,brick:0xa8583e,stone:0xaaa296,gravel:0xa8946e,tile:0xb48a5a,sandplank:0x8a5e36}[V.path]||0xdddddd;
  const cm=new THREE.Mesh(cg,new THREE.MeshLambertMaterial({color:ccol}));cm.receiveShadow=true;S.add(cm);},
 makeBarrier(){const g=new THREE.Group();const mb=new MB();const I=new THREE.Matrix4();
  for(const x of[-2.9,2.9]){this.put(mb,I,this.cyl(10),x,0,0,0,.34,2.4,.34,0xffffff,'std',{chunk:false});this.put(mb,I,this.sph(10),x,2.45,0,0,.42,.42,.42,0xff5aa0,'std',{chunk:false});}
  for(let i=0;i<2;i++)for(let k=0;k<6;k++)this.put(mb,I,this.rbox(1,.42,.18,.06),-2.5+k,.75+i*.7,0,0,1,1,1,(k+i)%2?0xff5aa0:0xffffff,'std',{chunk:false});
  this.put(mb,I,this.rbox(2.2,1.1,.16,.1),0,2.2,0,0,1,1,1,0xffd23a,'std',{chunk:false});this.put(mb,I,this.sph(10),0,2.75,.05,0,.5,.5,.2,0x7ae05a,'std',{chunk:false});
  mb.build(g,this.MATS);return g;},
 // distant silhouettes around the course
 ring(mb){const V=this.VIS,co=this.co;const I=new THREE.Matrix4();const cz=125;
  const skip=a=>co.water&&Math.sin(a)*co.water>-.15;// angle a: x=sin(a)*r
  if(V.ring==='hills'||V.ring==='jungle'||V.ring==='forest'){const n=V.ring==='forest'?70:46;
   for(let i=0;i<n;i++){const a=i/n*Math.PI*2+this.R(-.03,.03);if(skip(a))continue;const r=this.R(250,330);const x=Math.sin(a)*r,z=cz+Math.cos(a)*r;
    if(V.ring==='forest'){const s=this.R(16,30);this.put(mb,I,this.blob(i%4),x,this.H(x,z)+s*.3,z,this.R(0,6),s*1.6,s*1.2,s*1.6,V.ringC,'far',{ao:.7,jit:.15});continue;}
    const s=this.R(50,90),h=this.R(28,62)*(V.ring==='jungle'?1.3:1);this.put(mb,I,this.blob(i%4),x,this.H(x,z)-h*.15,z,this.R(0,6),s*1.5,h*1.25,s,V.ringC,'far',{ao:.75,jit:.1,grad:V.ring==='jungle'?0x8ccf72:0xd8d0c0});}}
  if(V.ring==='city'){const nC=V.night;for(let i=0;i<64;i++){const a=i/64*Math.PI*2+this.R(-.02,.02);const r=this.R(170,260);const x=Math.sin(a)*r,z=cz+Math.cos(a)*r;const w=this.R(14,26),h=this.R(24,co.id==='uehara'?45:90),d=this.R(14,24);
    const col=nC?this.pick([0x2e2a5a,0x3a3470,0x2a3460]):this.pick([0xc7cfdf,0xb5c0d6,0xd8dce6,0xa8b6cc,0xe4e0ea]);this.put(mb,I,this.box(),x,this.H(x,z)-2,z,a,w,h,d,col,'far',{ao:.75});
    if(nC){for(let k=0;k<6;k++){if(this.rnd()<.25)continue;this.put(mb,I,this.quad(),x-Math.sin(a)*(d/2+.3),this.H(x,z)+h*(.15+k*.13),z-Math.cos(a)*(d/2+.3),a+Math.PI,w*.8,h*.045,1,this.pick([0xffe08a,0xff8ae6,0x8af0ff,0xffe08a]),'glow',{chunk:false});}}}}},
 clouds(mb){const V=this.VIS;const n=V.night?8:16;const I=new THREE.Matrix4();for(let i=0;i<n;i++){const a=this.R(0,Math.PI*2);const r=this.R(280,380);const x=Math.sin(a)*r,z=125+Math.cos(a)*r;const y=this.R(70,150);const s=this.R(70,130);
   const col=V.night?0x8a6ab8:0xffffff;for(let k=0;k<2;k++)this.put(mb,I,this.quad(),x+this.R(-15,15),y+k*8,z,a+Math.PI,s*(1-k*.3),s*.5*(1-k*.3),1,col,'cloud',{chunk:false});}},
 makeHalos(S){if(!this.HL.length)return;const n=this.HL.length/7;const p=new Float32Array(n*3),c=new Float32Array(n*3),s=new Float32Array(n);for(let i=0;i<n;i++){p.set(this.HL.slice(i*7,i*7+3),i*3);c.set(this.HL.slice(i*7+3,i*7+6),i*3);s[i]=this.HL[i*7+6];}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(c,3));g.setAttribute('aSize',new THREE.BufferAttribute(s,1));
  const pts=new THREE.Points(g,this.haloMat());pts.frustumCulled=false;pts.renderOrder=5;S.add(pts);this.halosObj=pts;},
 makeCrowd(S){const L=this.CR;if(!L.length)return;const n=L.length;const night=this.VIS.night;
  const body=new THREE.CylinderGeometry(.26,.32,1.0,10).translate(0,.95,0);const legs=new THREE.CylinderGeometry(.24,.2,.5,8).translate(0,.25,0);
  const merge=(gs,cs)=>{const mb=new MB();const I=new THREE.Matrix4();gs.forEach((g,i)=>mb.add(g,I,cs[i],'std',{chunk:false}));const L2=mb.L['std|x'];const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(L2.pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(L2.nor,3));g.setAttribute('color',new THREE.Float32BufferAttribute(L2.col,3));g.setIndex(L2.idx);return g;};
  const gB=merge([body,legs],[0xffffff,0x4a4a5a]);const gH=merge([new THREE.SphereGeometry(.24,10,8).translate(0,1.68,0),new THREE.SphereGeometry(.25,10,6,0,Math.PI*2,0,1.3).translate(0,1.74,-.02),new THREE.SphereGeometry(.035,6,4).translate(-.08,1.71,.22),new THREE.SphereGeometry(.035,6,4).translate(.08,1.71,.22),new THREE.SphereGeometry(.05,6,4).scale(1.4,.5,.6).translate(0,1.6,.22)],[0xffffff,0x2a2018,0x111111,0x111111,0x8a2a2a]);
  const bob=s=>{s.uniforms.uTime=this.U.uTime;s.vertexShader='uniform float uTime;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat ph=instanceMatrix[3].x*1.7+instanceMatrix[3].z*1.3;transformed.y+=abs(sin(uTime*3.2+ph))*.12*step(.5,fract(ph*.37));transformed.x+=sin(uTime*1.5+ph)*.04*position.y;');};
  const mk=(g,cols)=>{const m=new THREE.MeshLambertMaterial({vertexColors:true});m.onBeforeCompile=bob;m.customProgramCacheKey=()=>'crowd';const im=new THREE.InstancedMesh(g,m,n);const mt=new THREE.Matrix4();
   L.forEach((p,i)=>{const s=p.s*this.R(.9,1.1);im.setMatrixAt(i,MX(p.x,p.y,p.z,p.ry,s,s,s));im.setColorAt(i,new THREE.Color(cols(i)));});im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.castShadow=!night;im.receiveShadow=false;S.add(im);return im;};
  const shirts=[0xff5a8a,0x4ac0ff,0xffd23a,0x7ae05a,0xb07aff,0xff8a3a,0xffffff,0x3a5bd0,0xff3a5a,0x2fd0b0];const skins=[0xffd9b8,0xf1c08f,0xd49a6a,0xa86e45,0x7a4a2a,0xffe2c8];
  mk(gB,()=>this.pick(shirts));mk(gH,()=>this.pick(skins));},
 makeBirds(S){const V=this.VIS;if(!V.birds)return;const n=14;const col={gull:0xffffff,pigeon:0x9aa0b8,crow:0x2a2a33,tropic:0xff7a3a}[V.birds];
  const g=new THREE.BufferGeometry();const p=[0,0,.35, -.12,0,-.3, .12,0,-.3, 0,0,.15, -1.1,0,-.15, -.05,0,-.2, 0,0,.15, .05,0,-.2, 1.1,0,-.15];g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();
  const m=new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide});m.onBeforeCompile=s=>{s.uniforms.uTime=this.U.uTime;s.vertexShader='uniform float uTime;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat ph=instanceMatrix[3].x*.7+instanceMatrix[3].z*.3;transformed.y+=abs(position.x)*sin(uTime*8.+ph)*.55;');};m.customProgramCacheKey=()=>'bird';
  const im=new THREE.InstancedMesh(g,m,n);im.frustumCulled=false;S.add(im);this.birds={im,list:[...Array(n)].map((_,i)=>({cx:this.R(-40,40),cz:this.R(10,260),r:this.R(10,30),h:this.R(14,30),sp:this.R(.25,.5)*(i%2?1:-1),ph:this.R(0,6.28),s:V.birds==='tropic'?.7:1}))};},
 // ---------------- per-frame ----------------
 update(dt,t,cam){this.U.uTime.value=t;if(this.dome)this.dome.position.copy(cam.position);
  if(this.dl&&this.dl.castShadow){const f=new V3();cam.getWorldDirection(f);f.y=0;f.normalize();const tp=cam.position.clone().addScaledVector(f,18);tp.y=0;tp.x=Math.round(tp.x*4)/4;tp.z=Math.round(tp.z*4)/4;this.dl.target.position.copy(tp);this.dl.position.copy(tp).addScaledVector(this.sunDir,90);this.dl.target.updateMatrixWorld();}
  if(this.scrT)this.scrT.offset.y=Math.floor(t*.7)*.125+0;
  if(this.birds){const B=this.birds;B.list.forEach((b,i)=>{const a=b.ph+t*b.sp;const x=b.cx+Math.cos(a)*b.r,z=b.cz+Math.sin(a)*b.r,y=b.h+Math.sin(t*.7+i)*1.5;const yaw=Math.atan2(-Math.sin(a)*b.sp,Math.cos(a)*b.sp);B.im.setMatrixAt(i,MX(x,y,z,yaw,b.s,b.s,b.s,0,Math.sign(b.sp)*.25));});B.im.instanceMatrix.needsUpdate=true;}
  for(const f of this.anims)f(dt,t);
  // adaptive quality: drop shadows / resolution on slow devices
  const P=this.perf;if(P&&!P.done&&dt>0){P.n++;if(P.n>20){P.t+=dt;if(P.n>110){P.done=true;const fps=90/P.t;if(fps<42&&this.onSlow)this.onSlow(fps);}}}},
});
Object.assign(W,{
 prop(k,p,ry,s){if(!PROPS[k])return;const b=PB(this,this.mb,p.x,p.y!=null&&p.y!==0?p.y:this.H(p.x,p.z),p.z,ry||0,s);PROPS[k](b);return b;},
 face(p,to){return Math.atan2(to.x-p.x,to.z-p.z);},
 decor(co,S){const cv=this.cv;
  const sets={
   beach:{near:['umbrella','towel','palm','surf','umbrella','flowers'],far:['palm','shop','palm','palm']},
   street:{near:['cafe','planter','lamp','bench','tree'],far:['tree','planter','tree']},
   pier:{near:['umbrella','palm','lamp','towel','stall'],far:['palm','shop','palm','palm']},
   campus:{near:['bench','tree','lamp','flowers','bush'],far:['tree','tree','bush','tree']},
   crossing:{near:['lamp','vending','screen','lantern','bench'],far:['building','screen']},
   sakura:{near:['sakura','lantern','bench','flowers','toro','sakura'],far:['sakura','tree','sakura']},
   park:{near:['ginkgo','bench','bush','flowers','lamp','tree','toro'],far:['cedar','cedar','tree','ginkgo','cedar']},
   lane:{near:['planter','vending','lamp','bush','pole'],far:['tree','planter','tree']},
   market:{near:['stall','palm','flowers','hibiscus','tuktuk'],far:['palm','tree','palm']},
   jungle:{near:['fern','hibiscus','lavarock','palm','monstera'],far:['tree','palm','rock','monstera','palm']},
   luau:{near:['torch','surf','umbrella','palm','hibiscus','tiki'],far:['palm','palm','tree']}}[co.theme]||{near:['bush'],far:['tree']};
  const spawnPts=co.spawns.map(sp=>this.place(sp.path==='B'&&cv.B?cv.B:cv.A,sp.t,sp.s,sp.d));this.spawnPts=spawnPts;
  const segD=(p,a,b)=>{const ab=b.clone().sub(a);const t=Math.max(0,Math.min(1,p.clone().sub(a).dot(ab)/ab.lengthSq()));return a.clone().addScaledVector(ab,t).setY(0).distanceTo(p.clone().setY(0));};
  const sight=co.spawns.map((sp,i)=>{const c=sp.path==='B'&&cv.B?cv.B:cv.A;return[-.07,-.04,-.015,.015].map(dt=>[spawnPts[i],c.getPointAt(Math.max(0,Math.min(1,sp.t+dt)))]);}).flat();
  this.taken=[];
  const ok=this.ok=(p,r,o)=>{o=o||{};for(const q of spawnPts)if(q.distanceTo(p)<Math.max(r+1.5,o.sp||5))return false;for(const [a,b] of sight)if(segD(p,a,b)<r+(o.sl||1.8))return false;
   if(this.pathDist(p.x,p.z)<(o.pd||(r+3.4)))return false;if(co.water&&this.waterD(p.x,p.z)>-(o.wm||3))return false;for(const q of this.taken)if(q.p.distanceTo(p)<q.r+r)return false;return true;};
  this.take=(p,r)=>this.taken.push({p:p.clone(),r});
  // spawn props first (reserve their spots)
  this.noOcc=true;
  co.spawns.forEach((sp,i)=>{if(!sp.prop)return;const c=sp.path==='B'&&cv.B?cv.B:cv.A;const p=spawnPts[i];const to=this.place(c,sp.t,0,0);let off=new V3();
   const behind=p.clone().sub(to).setY(0).normalize();const side=new V3(behind.z,0,-behind.x);
   if(['umbrella','cafe','stall','tree','sakura','lantern','torch','fern','planter','vending','fountain','hoop','gym','surf'].includes(sp.prop))off.addScaledVector(behind,2.2).addScaledVector(side,1.6);
   if(['crate','bush','rock'].includes(sp.prop))off.addScaledVector(behind,-0.9);
   const pp=p.clone().add(off);pp.y=0;this.prop(sp.prop,pp,this.face(pp,to));sp._propPos=pp.clone();this.take(pp,2.2);});
  this.noOcc=false;
  this.sets=sets;},
 // scatter generic decor (called after set pieces so landmarks get first pick)
 scatter(){const co=this.co,cv=this.cv,sets=this.sets,ok=this.ok;const curves=cv.B?[cv.A,cv.B]:[cv.A];
  for(const c of curves)for(let t=-.1;t<1.16;t+=.03){for(const s of[-1,1]){
    const d=this.R(6.5,13);const p=this.place(c,t+this.R(-.01,.01),s,d);if(ok(p,1.6)&&this.rnd()<.62){this.prop(this.pick(sets.near),p,this.face(p,this.place(c,t,0,0)));this.take(p,1.8);}
    const d2=this.R(19,42);const p2=this.place(c,t,s,d2);if(ok(p2,3.5)&&this.rnd()<.6){this.prop(this.pick(sets.far),p2,this.face(p2,this.place(c,t,0,0)));this.take(p2,3.5);}}}},
});
// occluders are skipped while placing spawn props
(function(){const o=W.occBox.bind(W);W.occBox=function(...a){if(this.noOcc)return null;return o(...a);};})();
