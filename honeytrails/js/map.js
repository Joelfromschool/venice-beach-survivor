// 3D map view (Three.js). Soft, bright stylized world drawn from world.js; nothing loaded from the network.
import * as THREE from '../vendor/three.module.min.js?v=1.0.1';
import {CELL,parkV,waterV,cellRoads,cellPaths,cellStops,cellArena,cellSpawns,raidAt,terrain,hash,rng} from './world.js?v=1.0.1';
import {SP} from './data.js?v=1.0.1';
import {S} from './state.js?v=1.0.1';
const TP=192,SAMP=33; // texture px per cell, noise samples per side
export const M={yaw:0,dist:90,tyaw:0,tdist:90,px:0,py:0,ax:0,ay:0,moving:0,face:1,night:false,spawns:[],stops:[],arenas:[],ready:false};
let R,scene,cam,ground,ox=0,oy=0,chunks=new Map(),queue=[],texCache={},avatar,avShadow,ring,ring2,sun,hemi,clock=0;
const PAL={day:{base:[172,226,152],park:[112,204,110],park2:[100,194,100],water:[84,178,240],shore:[170,226,246],road:'#fffbe6',roadE:'#bfd9a8',path:'#f6efcb',fog:0xbfe8f2,b:[[255,236,214],[226,240,255],[255,226,236],[232,248,226]],roof:[[255,150,120],[120,170,240],[240,130,170],[110,200,150]],tree:0x56b65a,tree2:0x7ccc5e,trunk:0x9a7650},
 night:{base:[52,86,120],park:[42,104,104],park2:[36,94,96],water:[30,62,132],shore:[60,104,160],road:'#9fb6d8',roadE:'#3c5a80',path:'#7f9cc4',fog:0x2a3f6e,b:[[120,140,190],[110,130,180],[130,130,190],[110,140,170]],roof:[[200,120,140],[90,120,200],[170,100,170],[80,150,140]],tree:0x2f7a72,tree2:0x3b8c78,trunk:0x5a4a50}};
let P=PAL.day;
const W2S=(X,Y)=>[X-ox,-(Y-oy)];
export function texFor(src){if(!texCache[src]){const t=new THREE.TextureLoader().load(src);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;texCache[src]=t}return texCache[src]}
export function artSrc(sp,shiny,hat){return window.__art(sp,shiny,hat)}
export function initMap(canvas){
 R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setClearColor(0,0);
 R.outputColorSpace=THREE.SRGBColorSpace;
 scene=new THREE.Scene();scene.fog=new THREE.Fog(P.fog,230,470);
 cam=new THREE.PerspectiveCamera(42,1,1,1200);
 hemi=new THREE.HemisphereLight(0xffffff,0x9ab89a,1.1);scene.add(hemi);sun=new THREE.DirectionalLight(0xffffff,1.0);sun.position.set(-60,120,40);scene.add(sun);
 // avatar
 const shTex=shadowTex();
 avShadow=new THREE.Mesh(new THREE.CircleGeometry(2.6,24),new THREE.MeshBasicMaterial({map:shTex,transparent:true,depthWrite:false}));avShadow.rotation.x=-Math.PI/2;avShadow.position.y=.15;scene.add(avShadow);
 avatar=new THREE.Sprite(new THREE.SpriteMaterial({map:texFor(artSrc(S.avatar||'pinco')),fog:false,alphaTest:.04}));avatar.center.set(.5,0);scene.add(avatar);
 ring=new THREE.Mesh(new THREE.RingGeometry(39,40.5,96),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.2;scene.add(ring);
 ring2=new THREE.Mesh(new THREE.RingGeometry(0,1,48),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.3,depthWrite:false}));ring2.rotation.x=-Math.PI/2;ring2.position.y=.18;scene.add(ring2);
 M.shTex=shTex;resize();M.ready=true}
export function setAvatar(id){avatar.material.map=texFor(artSrc(id));avatar.material.needsUpdate=true;const im=avatar.material.map.image;}
export function resize(){if(!R)return;const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<.6?44:38;cam.updateProjectionMatrix()}
function shadowTex(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,2,32,32,31);gr.addColorStop(0,'rgba(20,40,30,.45)');gr.addColorStop(1,'rgba(20,40,30,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);const t=new THREE.CanvasTexture(c);return t}
export function setOrigin(X,Y){ox=X;oy=Y;for(const [k,c] of chunks)disposeChunk(c);chunks.clear();queue=[]}
export function setNight(n){if(M.night===n&&M._pal)return;M.night=n;M._pal=1;P=n?PAL.night:PAL.day;scene.fog.color.setHex(P.fog);hemi.intensity=n?.8:1.1;sun.intensity=n?.4:1.0;
 for(const [k,c] of chunks)disposeChunk(c);chunks.clear();queue=[];document.body.classList.toggle('night',n)}
function disposeChunk(c){scene.remove(c.g);c.g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map&&o.material.map.isCanvasTexture)o.material.map.dispose();if(!o.material._shared)o.material.dispose()}})}
const TREE_G=[new THREE.CylinderGeometry(.5,.7,3,6).translate(0,1.5,0),new THREE.IcosahedronGeometry(3.2,1).translate(0,5.2,0)];
const BOX_G=new THREE.BoxGeometry(1,1,1).translate(0,.5,0);
function buildChunk(ix,iy){const g=new THREE.Group();const x0=ix*CELL,y0=iy*CELL;
 // ground texture
 const c=document.createElement('canvas');c.width=c.height=TP;const ctx=c.getContext('2d');const img=ctx.createImageData(TP,TP);const D=img.data;
 const pv=new Float32Array(SAMP*SAMP),wv=new Float32Array(SAMP*SAMP);
 for(let j=0;j<SAMP;j++)for(let i=0;i<SAMP;i++){const X=x0+i/(SAMP-1)*CELL,Y=y0+CELL-j/(SAMP-1)*CELL;pv[j*SAMP+i]=parkV(X,Y);wv[j*SAMP+i]=waterV(X,Y)}
 const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
 for(let y=0;y<TP;y++){const fy=y/(TP-1)*(SAMP-1),jy=Math.min(SAMP-2,Math.floor(fy)),ty=fy-jy;
  for(let x=0;x<TP;x++){const fx=x/(TP-1)*(SAMP-1),jx=Math.min(SAMP-2,Math.floor(fx)),tx=fx-jx;const k=jy*SAMP+jx;
   const bl=(A)=>A[k]*(1-tx)*(1-ty)+A[k+1]*tx*(1-ty)+A[k+SAMP]*(1-tx)*ty+A[k+SAMP+1]*tx*ty;
   const p=bl(pv),w=bl(wv);const pk=ss(.55,.57,p),wt=ss(.695,.705,w),sh=ss(.67,.69,w)*(1-wt);
   let col=P.base.slice();const pc=((x+y)>>3)%2?P.park:P.park2;const pm=pk*.85+(pk>0?.15*(Math.sin((x0+x)*.05)*.5+.5)*pk:0);
   for(let q=0;q<3;q++){col[q]=col[q]*(1-pm)+pc[q]*pm;col[q]=col[q]*(1-sh*.8)+P.shore[q]*sh*.8;col[q]=col[q]*(1-wt)+(P.water[q]+(w-.7)*60)*wt}
   const o=(y*TP+x)*4;const n=(hash(x0+x,y0+y,5)-.5)*5;D[o]=col[0]+n;D[o+1]=col[1]+n;D[o+2]=col[2]+n;D[o+3]=255}}
 ctx.putImageData(img,0,0);
 const S2=TP/CELL,tx=X=>(X-x0)*S2,ty=Y=>(y0+CELL-Y)*S2;
 // paths then roads (from neighbours so edges match)
 ctx.lineCap='round';ctx.lineJoin='round';
 for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){for(const pts of cellPaths(ix+dx,iy+dy)){ctx.strokeStyle=P.path;ctx.lineWidth=3*S2;ctx.setLineDash([5*S2,3*S2]);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(tx(p[0]),ty(p[1])):ctx.moveTo(tx(p[0]),ty(p[1])));ctx.stroke();ctx.setLineDash([])}}
 const roads=[];for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)roads.push(...cellRoads(ix+dx,iy+dy));
 for(const pass of [0,1])for(const r of roads){ctx.strokeStyle=pass?P.road:P.roadE;ctx.lineWidth=(pass?6.5:9)*r[4]*S2;ctx.beginPath();ctx.moveTo(tx(r[0]),ty(r[1]));ctx.lineTo(tx(r[2]),ty(r[3]));ctx.stroke()}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=R.capabilities.getMaxAnisotropy();tex.generateMipmaps=true;tex.minFilter=THREE.LinearMipmapLinearFilter;
 const pl=new THREE.Mesh(new THREE.PlaneGeometry(CELL,CELL),new THREE.MeshBasicMaterial({map:tex}));pl.rotation.x=-Math.PI/2;const [sx,sz]=W2S(x0+CELL/2,y0+CELL/2);pl.position.set(sx,0,sz);g.add(pl);
 // trees & buildings, away from roads
 const r=rng(hash(ix,iy,91));const nearRoad=(X,Y)=>roads.some(q=>{const px=q[2]-q[0],py=q[3]-q[1],L=px*px+py*py;let t=((X-q[0])*px+(Y-q[1])*py)/L;t=Math.max(0,Math.min(1,t));const ex=q[0]+px*t-X,ey=q[1]+py*t-Y;return ex*ex+ey*ey<121});
 const trees=[],blds=[];
 for(let i=0;i<40;i++){const X=x0+r()*CELL,Y=y0+r()*CELL;const t=terrain(X,Y);if(nearRoad(X,Y))continue;if(t==='park'&&trees.length<22)trees.push([X,Y,.8+r()*.6]);else if(t==='urban'&&r()<.12)trees.push([X,Y,.7+r()*.4])}
 if(terrain(x0+CELL/2,y0+CELL/2)==='urban'){for(let i=0;i<14&&blds.length<5;i++){const w=10+r()*14,d=10+r()*14,h=3.5+r()*6;const X=x0+14+w/2+r()*(CELL-28-w),Y=y0+14+d/2+r()*(CELL-28-d);
  if(terrain(X,Y)!=='urban'||nearRoad(X,Y)||[[-w/2,-d/2],[w/2,d/2],[-w/2,d/2],[w/2,-d/2]].some(([a,b])=>nearRoad(X+a,Y+b)))continue;if(blds.some(b=>Math.abs(b[0]-X)<(b[3]+w)/2+3&&Math.abs(b[1]-Y)<(b[4]+d)/2+3))continue;blds.push([X,Y,h,w,d])}}
 if(trees.length){const tm=new THREE.InstancedMesh(TREE_G[0],trunkMat(),trees.length),cm=new THREE.InstancedMesh(TREE_G[1],crownMat(),trees.length);const m4=new THREE.Matrix4(),col=new THREE.Color();
  trees.forEach((t,i)=>{const [a,b]=W2S(t[0],t[1]);m4.makeScale(t[2],t[2],t[2]).setPosition(a,0,b);tm.setMatrixAt(i,m4);cm.setMatrixAt(i,m4);col.setHex(i%3?P.tree:P.tree2);cm.setColorAt(i,col)});g.add(tm,cm)}
 if(blds.length){const bm=new THREE.InstancedMesh(BOX_G,bldMat(),blds.length);const m4=new THREE.Matrix4(),col=new THREE.Color();
  const rm=new THREE.InstancedMesh(BOX_G,bldMat(),blds.length);
  blds.forEach((b,i)=>{const [a,c2]=W2S(b[0],b[1]);const ci=Math.floor(hash(b[0],b[1],3)*4);m4.makeScale(b[3],b[2],b[4]).setPosition(a,0,c2);bm.setMatrixAt(i,m4);const k=P.b[ci];col.setRGB(k[0]/255,k[1]/255,k[2]/255,THREE.SRGBColorSpace);bm.setColorAt(i,col);
   m4.makeScale(b[3]+1.2,1.1,b[4]+1.2).setPosition(a,b[2],c2);rm.setMatrixAt(i,m4);const q=P.roof[ci];col.setRGB(q[0]/255,q[1]/255,q[2]/255,THREE.SRGBColorSpace);rm.setColorAt(i,col)});g.add(bm,rm)}
 scene.add(g);return {g,ix,iy}}
let _tm,_cm,_bm;const trunkMat=()=>{if(!_tm||_tm._n!==M.night){_tm=new THREE.MeshLambertMaterial({color:P.trunk,flatShading:true});_tm._n=M.night;_tm._shared=1}return _tm};
const crownMat=()=>{if(!_cm||_cm._n!==M.night){_cm=new THREE.MeshLambertMaterial({color:0xffffff,flatShading:true});_cm._n=M.night;_cm._shared=1}return _cm};
const bldMat=()=>{if(!_bm){_bm=new THREE.MeshLambertMaterial({color:0xffffff,emissive:0x303030});_bm._shared=1}return _bm};
// ---------- entities ----------
const ents=new Map(); // key -> {kind, obj3d, data}
function stopMesh(){const g=new THREE.Group();
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.35,.5,7,8),new THREE.MeshLambertMaterial({color:0x6b5b8a}));pole.position.y=3.5;g.add(pole);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.6,.6,6),new THREE.MeshLambertMaterial({color:0xfff0c0}));base.position.y=.3;g.add(base);
 const hexM=new THREE.MeshLambertMaterial({color:0xffc233,emissive:0x553300,flatShading:true});
 const hx=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.2,1,6),hexM);hx.rotation.x=Math.PI/2;const hold=new THREE.Group();hold.add(hx);
 const inner=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,1.1,6),new THREE.MeshLambertMaterial({color:0xfff6d8,flatShading:true}));inner.rotation.x=Math.PI/2;hold.add(inner);
 hold.position.y=9.2;g.add(hold);g.userData={hold,hexM};return g}
function arenaMesh(a){const g=new THREE.Group();
 const b1=new THREE.Mesh(new THREE.CylinderGeometry(7,8,2,8),new THREE.MeshLambertMaterial({color:0xf7f1e6,flatShading:true}));b1.position.y=1;g.add(b1);
 const b2=new THREE.Mesh(new THREE.CylinderGeometry(4.5,6,9,8),new THREE.MeshLambertMaterial({color:0xff8fb8,flatShading:true}));b2.position.y=6.5;g.add(b2);
 const top=new THREE.Mesh(new THREE.CylinderGeometry(6.5,5,1.4,8),new THREE.MeshLambertMaterial({color:0xffd34d,flatShading:true}));top.position.y=11.6;g.add(top);
 for(let i=0;i<8;i++){const fl=new THREE.Mesh(new THREE.ConeGeometry(.9,2.2,4),new THREE.MeshLambertMaterial({color:i%2?0x6ad0ff:0xff7aa8,flatShading:true}));const a2=i/8*Math.PI*2;fl.position.set(Math.cos(a2)*5.6,13.2,Math.sin(a2)*5.6);g.add(fl)}
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:texFor(artSrc(a.def)),fog:true,alphaTest:.04}));sp.center.set(.5,0);sp.position.y=12.3;g.add(sp);
 const label=new THREE.Sprite(new THREE.SpriteMaterial({map:null,transparent:true,depthTest:false,fog:false}));label.center.set(.5,0);label.position.y=29;label.visible=false;g.add(label);
 g.userData={sp,label};return g}
function labelTex(text,col){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.font='bold 30px Chewy, sans-serif';const w=Math.min(250,g.measureText(text).width+34);
 g.fillStyle=col||'rgba(224,69,123,.92)';const x=(256-w)/2;g.beginPath();g.roundRect(x,8,w,48,24);g.fill();g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText(text,128,33);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function spawnMesh(s){const g=new THREE.Group();const sh=new THREE.Mesh(new THREE.CircleGeometry(2.4,20),new THREE.MeshBasicMaterial({map:M.shTex,transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.12;g.add(sh);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:texFor(artSrc(s.sp,s.shiny,s.hat)),fog:true,alphaTest:.04}));sp.center.set(.5,0);g.add(sp);
 const grass=new THREE.Group();for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.55,2.6,4),new THREE.MeshLambertMaterial({color:i%2?0x3fae4e:0x5cc85a,flatShading:true}));c.position.set(Math.cos(i*1.3)*1.2,1.2,Math.sin(i*1.3)*1.2);c.rotation.z=(i-2)*.25;grass.add(c)}g.add(grass);
 g.userData={sp,grass,sh};return g}
function setSpriteSize(sp,h){const im=sp.material.map&&sp.material.map.image;const ar=im&&im.width?im.width/im.height:.7;sp.scale.set(h*ar,h,1)}
// refresh which entities exist around the player (called ~every 1.5s)
export function refreshEntities(now,boost){const ix=Math.floor(M.px/CELL),iy=Math.floor(M.py/CELL);const want=new Set();M.spawns=[];M.stops=[];M.arenas=[];
 for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const cx=ix+dx,cy=iy+dy;
  for(const s of cellSpawns(cx,cy,now,M.night,boost)){if(S.gone[s.key])continue;M.spawns.push(s);want.add(s.key);if(!ents.has(s.key)){const o=spawnMesh(s);ents.set(s.key,{kind:'spawn',o,d:s});scene.add(o)}}
  for(const s of cellStops(cx,cy)){M.stops.push(s);want.add(s.id);if(!ents.has(s.id)){const o=stopMesh();ents.set(s.id,{kind:'stop',o,d:s});scene.add(o)}}
  const a=cellArena(cx,cy);if(a){M.arenas.push(a);want.add(a.id);if(!ents.has(a.id)){const o=arenaMesh(a);ents.set(a.id,{kind:'arena',o,d:a});scene.add(o)}}}
 // extra spawns injected by the game (cheat, raid rewards)
 for(const s of (M.extra||[])){if(S.gone[s.key]||s.end<now)continue;M.spawns.push(s);want.add(s.key);if(!ents.has(s.key)){const o=spawnMesh(s);ents.set(s.key,{kind:'spawn',o,d:s});scene.add(o)}}
 for(const [k,e] of ents)if(!want.has(k)){scene.remove(e.o);e.o.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&!(o.material.map&&texCache_has(o.material.map)))o.material.dispose()});ents.delete(k)}
 for(const a of M.arenas){const e=ents.get(a.id);const rd=raidAt(a,now);a.raid=rd;const sp=e.o.userData.sp;const want2=rd?rd.sp:a.def;if(sp._sp!==want2){sp.material.map=texFor(artSrc(want2));sp.material.needsUpdate=true;sp._sp=want2}
  const lab=e.o.userData.label;if(rd&&!S.raidsDone[rd.key]){const txt='★'.repeat(rd.tier>3?5:rd.tier)+' '+mmss(rd.end-now);if(lab._t!==txt){if(lab.material.map)lab.material.map.dispose();lab.material.map=labelTex(txt);lab.material.needsUpdate=true;lab._t=txt}lab.visible=true}else lab.visible=false}}
const texCache_has=t=>Object.values(texCache).includes(t);
const mmss=ms=>{const s=Math.max(0,Math.floor(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
// ---------- per frame ----------
export function frame(dt,now){if(!R)return;clock+=dt;
 // chunk streaming
 const ix=Math.floor(M.px/CELL),iy=Math.floor(M.py/CELL),RAD=3;
 for(let dx=-RAD;dx<=RAD;dx++)for(let dy=-RAD;dy<=RAD;dy++){const k=(ix+dx)+','+(iy+dy);if(!chunks.has(k)&&!queue.some(q=>q.k===k))queue.push({k,ix:ix+dx,iy:iy+dy,d:dx*dx+dy*dy})}
 queue.sort((a,b)=>a.d-b.d);let built=0;const t0=performance.now();while(queue.length&&(built<1||performance.now()-t0<8)){const q=queue.shift();if(Math.abs(q.ix-ix)>RAD||Math.abs(q.iy-iy)>RAD)continue;chunks.set(q.k,buildChunk(q.ix,q.iy));built++;if(!M.firstBuilt&&chunks.size>=9)M.firstBuilt=true}
 for(const [k,c] of chunks)if(Math.abs(c.ix-ix)>RAD+1||Math.abs(c.iy-iy)>RAD+1){disposeChunk(c);chunks.delete(k)}
 // camera
 M.yaw+=(M.tyaw-M.yaw)*Math.min(1,dt*10);M.dist+=(M.tdist-M.dist)*Math.min(1,dt*8);
 const [ax,az]=W2S(M.ax,M.ay);const pitch=.30+(M.dist-34)/81*.4;
 cam.position.set(ax+Math.sin(M.yaw)*Math.cos(pitch)*M.dist,Math.sin(pitch)*M.dist+3,az+Math.cos(M.yaw)*Math.cos(pitch)*M.dist);M._lk=M._lk||new THREE.Vector3();M._lk.set(ax-Math.sin(M.yaw)*M.dist*.28,4,az-Math.cos(M.yaw)*M.dist*.28);cam.lookAt(M._lk);
 // avatar
 const bob=M.moving?Math.abs(Math.sin(clock*9))*1.1:Math.sin(clock*2.2)*.25;
 avatar.position.set(ax,bob,az);setSpriteSize(avatar,11-(M.moving?Math.abs(Math.sin(clock*9))*.4:0));if(M.face<0)avatar.scale.x*=-1;
 avShadow.position.set(ax,.15,az);avShadow.scale.setScalar(1-bob*.12);ring.position.set(ax,.2,az);ring2.position.set(ax,.18,az);
 const rp=(clock*.6)%1;ring2.scale.setScalar(4+rp*36);ring2.material.opacity=.32*(1-rp);
 // entities
 for(const [k,e] of ents){const d=e.d;const [x,z]=W2S(d.x,d.y);e.o.position.set(x,0,z);const dist=Math.hypot(d.x-M.ax,d.y-M.ay);
  if(e.kind==='spawn'){const u=e.o.userData,near=dist<75;e.near=near;e.o.visible=dist<140;u.sp.visible=near;u.sh.visible=near;u.grass.visible=!near;
   if(near){const ph=hash(k)*6;const bb=Math.abs(Math.sin(clock*2.4+ph))*.6;u.sp.position.y=bb;setSpriteSize(u.sp,(SP[d.sp].sz||1)*8.5*(d.raid?1.2:1));if(!e.seen){e.seen=true;e.pop=0}if(e.pop<1){e.pop=Math.min(1,e.pop+dt*3);u.sp.scale.multiplyScalar(.3+.7*e.pop)}}
   else{u.grass.rotation.y=Math.sin(clock*7+hash(k)*9)*.25;u.grass.children.forEach((c,i)=>c.rotation.z=(i-2)*.25+Math.sin(clock*14+i)*.18)}}
  else if(e.kind==='stop'){const u=e.o.userData;const used=!!S.spun[d.id]&&S.spun[d.id]>Date.now();u.hold.rotation.y+=dt*(used?.3:1.2);u.hexM.color.setHex(used?0xc9a6ff:0xffc233);u.hexM.emissive.setHex(used?0x2a1050:(dist<45?0x775000:0x553300));
   u.hold.position.y=9.2+Math.sin(clock*2+hash(k)*5)*.4;e.o.scale.setScalar(dist<45?1.15:1)}
  else if(e.kind==='arena'){const u=e.o.userData;setSpriteSize(u.sp,d.raid&&!S.raidsDone[d.raid.key]?13:10);u.sp.position.y=12.3+Math.sin(clock*1.6)*.3}}
 R.render(scene,cam)}
// project world point (absolute) to screen px
const v3=new THREE.Vector3();
export function toScreen(X,Y,h=0){const [x,z]=W2S(X,Y);v3.set(x,h,z).project(cam);return [(v3.x+1)/2*innerWidth,(1-v3.y)/2*innerHeight,v3.z]}
export function screenToGround(sx,sy){const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(sx/innerWidth*2-1,-(sy/innerHeight)*2+1),cam);const t=-ray.ray.origin.y/ray.ray.direction.y;if(t<0)return null;
 const p=ray.ray.origin.clone().addScaledVector(ray.ray.direction,t);return {X:p.x+ox,Y:-p.z+oy}}
export function pick(sx,sy){let best=null,bd=1e9;
 for(const [k,e] of ents){if(!e.o.visible)continue;if(e.kind==='spawn'&&!e.near)continue;const d=e.d;const h=e.kind==='spawn'?4:e.kind==='stop'?8:12;const [x,y,z]=toScreen(d.x,d.y,h);if(z>1)continue;
  const r=e.kind==='arena'?70:e.kind==='stop'?52:50;const dd=Math.hypot(x-sx,y-sy);if(dd<r&&dd<bd){bd=dd;best=e}}
 return best}
export function camYawRel(){return M.yaw}
