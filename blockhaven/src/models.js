// Blocky voxel models for the cast, mobs and bosses: every face is painted here as original pixel art.
import * as THREE from '../vendor/three.module.min.js';
const hex=h=>'#'+h.replace('#','');
function shade(col,a){const c=new THREE.Color(col);const k=1+a;return '#'+new THREE.Color(Math.min(1,c.r*k),Math.min(1,c.g*k),Math.min(1,c.b*k)).getHexString()}
const CORN={front:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],back:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],right:[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],left:[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],top:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],bottom:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]};
const SH={front:1,back:.78,left:.86,right:.86,top:1.08,bottom:.6};
let seed=1;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
// Build a model from parts. Returns {root, parts, mats, height}
export function buildModel(spec){const AW=128;let cx=0,cy=0,rowH=0;const rects=[];
 const faceDims=(s,f)=>f==='front'||f==='back'?[s[0],s[1]]:f==='left'||f==='right'?[s[2],s[1]]:[s[0],s[2]];
 for(const part of spec.parts)for(const f of Object.keys(CORN)){const[w,h]=faceDims(part.s,f);if(cx+w>AW){cx=0;cy+=rowH+1;rowH=0}rects.push({part,f,x:cx,y:cy,w,h});cx+=w+1;rowH=Math.max(rowH,h)}
 const AH=Math.pow(2,Math.ceil(Math.log2(cy+rowH+2)));const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const g=cv.getContext('2d');
 for(const r of rects){const base=r.part.c;seed=(r.x*31+r.y*17+7)|0||1;for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){g.fillStyle=shade(base,(rnd()-.5)*(r.part.noise??.12));g.fillRect(r.x+x,r.y+y,1,1)}
  const fn=r.part.f?.[r.f]||r.part.f?.all;if(fn){const P=(x,y,col,w=1,h=1)=>{if(x<0||y<0||x>=r.w||y>=r.h)return;g.fillStyle=col;g.fillRect(r.x+x,r.y+y,Math.min(w,r.w-x),Math.min(h,r.h-y))};fn(P,r.w,r.h,r.f)}}
 const tex=new THREE.CanvasTexture(cv);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
 const mat=new THREE.MeshBasicMaterial({map:tex,alphaTest:.5,side:THREE.DoubleSide,vertexColors:true});
 const root=new THREE.Group();const inner=new THREE.Group();root.add(inner);inner.scale.setScalar((spec.scale||1)/16);const parts={};
 for(const part of spec.parts){const pos=[],uv=[],col=[],idx=[];let n=0;for(const f of Object.keys(CORN)){const r=rects.find(q=>q.part===part&&q.f===f);const cs=CORN[f];const uvc=[[0,0],[1,0],[1,1],[0,1]];for(let k=0;k<4;k++){const c=cs[k];pos.push(part.o[0]+c[0]*part.s[0],part.o[1]+c[1]*part.s[1],part.o[2]+c[2]*part.s[2]);uv.push((r.x+uvc[k][0]*r.w)/AW,1-(r.y+(1-uvc[k][1])*r.h)/AH);const s=SH[f];col.push(s,s,s)}idx.push(n,n+1,n+2,n,n+2,n+3);n+=4}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.setIndex(idx);
  const grp=new THREE.Group();grp.position.set(...part.p);if(part.r)grp.rotation.set(...part.r);const mesh=new THREE.Mesh(geo,mat);grp.add(mesh);parts[part.n]=grp;(part.parent?parts[part.parent]:inner).add(grp)}
 return{root,inner,parts,mat,height:(spec.h||32)*(spec.scale||1)/16,spec}}
// ---------- painters ----------
const eyes=(P,x,y,opts={})=>{const{w=2,h=2,white='#ffffff',pupil='#1d1d24',gap=4,lid}=opts;for(const ox of[x,x+gap]){P(ox,y,white,w,h);P(ox+(ox===x?w-1:0),y+h-1,pupil)}if(lid){P(x,y,lid,w,1);P(x+gap,y,lid,w,1)}};
const knit=(base)=>(P,w,h)=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++)if((x+y)%3===0)P(x,y,shade(base,-.12));for(let x=0;x<w;x+=3)for(let y=0;y<h;y+=2)P(x,y,shade(base,.1))};
const C={shorts:'#4f5566',shortsD:'#3a3f4d',pink:'#f2a3c1',pinkD:'#d9829f',cream:'#f6ead2',grey:'#9b9ba4',greyD:'#7c7c86',gold:'#e8a92c',red:'#c8302c'};
export const SPECS={
 pinco:{h:32,parts:[
  {n:'legL',s:[4,10,4],p:[-2,10,0],o:[-2,-10,-2],c:C.pink,f:{all:(P,w,h,f)=>{if(f!=='bottom'){P(0,0,C.shorts,w,f==='top'?h:4);if(f!=='top'){P(0,3,C.shortsD,w,1);P(0,h-2,C.pinkD,w,2)}}}}},
  {n:'legR',s:[4,10,4],p:[2,10,0],o:[-2,-10,-2],c:C.pink,f:{all:(P,w,h,f)=>{if(f!=='bottom'){P(0,0,C.shorts,w,f==='top'?h:4);if(f!=='top'){P(0,3,C.shortsD,w,1);P(0,h-2,C.pinkD,w,2)}}}}},
  {n:'body',s:[8,11,4],p:[0,10,0],o:[-4,0,-2],c:C.grey,f:{all:(P,w,h,f)=>{knit(C.grey)(P,w,h);if(f==='bottom')P(0,0,C.shorts,w,h);if(f!=='top'&&f!=='bottom'){P(0,h-3,C.shorts,w,3);P(0,h-3,C.shortsD,w,1);P(0,h-4,shade(C.grey,-.14),w,1);P(0,0,shade(C.grey,-.2),w,1)}if(f==='front'){P(2,2,shade(C.grey,.18),1,7);P(5,2,shade(C.grey,.18),1,7)}}}},
  {n:'tail',s:[1,1,9],p:[0,3,-2],o:[0,0,-9],r:[.5,0,0],c:C.pink,parent:'body'},
  {n:'armL',s:[3,11,3],p:[-5.5,21,0],o:[-1.5,-11,-1.5],c:C.grey,f:{all:(P,w,h,f)=>{if(f!=='top')P(0,7,C.pink,w,4);knit(C.grey)(P,w,6)}}},
  {n:'armR',s:[3,11,3],p:[5.5,21,0],o:[-1.5,-11,-1.5],c:C.grey,f:{all:(P,w,h,f)=>{if(f!=='top')P(0,7,C.pink,w,4);knit(C.grey)(P,w,6)}}},
  {n:'head',s:[8,8,7],p:[0,21,0],o:[-4,0,-3.5],c:C.pink,f:{front:(P,w,h)=>{eyes(P,1,2,{w:2,h:2,lid:C.pinkD,gap:4});P(1,1,C.pinkD,2,1);P(5,1,C.pinkD,2,1)}}},
  {n:'snout',s:[4,3,5],p:[0,0,3.5],o:[-2,0,0],c:C.cream,parent:'head',f:{front:(P,w)=>{P(1,0,'#c2557a',2,1);P(1,2,'#a8655a',2,1)},top:(P,w,h)=>{P(1,h-1,'#c2557a',2,1)}}},
  {n:'earL',s:[2,3,1],p:[-3,8,0],o:[-1,0,0],c:C.pink,parent:'head',f:{front:(P)=>P(0,1,C.pinkD,2,2)}},
  {n:'earR',s:[2,3,1],p:[3,8,0],o:[-1,0,0],c:C.pink,parent:'head',f:{front:(P)=>P(0,1,C.pinkD,2,2)}}]},
 pooh:{h:27,parts:[
  {n:'shoeL',s:[4,3,6],p:[-2.6,0,0],o:[-2,0,-2],c:C.red,f:{all:(P,w,h,f)=>{if(f!=='top'&&f!=='bottom')P(0,h-1,'#7a1a18',w,1)}}},
  {n:'shoeR',s:[4,3,6],p:[2.6,0,0],o:[-2,0,-2],c:C.red,f:{all:(P,w,h,f)=>{if(f!=='top'&&f!=='bottom')P(0,h-1,'#7a1a18',w,1)}}},
  {n:'body',s:[10,10,7],p:[0,6,0],o:[-5,0,-3.5],c:C.gold,f:{all:(P,w,h,f)=>{if(f!=='bottom')P(0,0,C.red,w,f==='top'?h:5);if(f!=='top'&&f!=='bottom')P(0,5,'#6a3f1e',w,1);if(f==='front')P(6,6,'#d9a63c',2,1)}}},
  {n:'pot',s:[3,3,3],p:[5,2,1],o:[0,0,-1.5],c:'#f3a92e',parent:'body',f:{top:(P)=>P(0,0,'#8a5a22',3,3)}},
  {n:'armL',s:[3,7,3],p:[-6.5,15,0],o:[-1.5,-7,-1.5],c:C.gold,f:{all:(P,w,h,f)=>{if(f!=='bottom')P(0,0,C.red,w,2)}}},
  {n:'armR',s:[3,7,3],p:[6.5,15,0],o:[-1.5,-7,-1.5],c:C.gold,f:{all:(P,w,h,f)=>{if(f!=='bottom')P(0,0,C.red,w,2)}}},
  {n:'coin',s:[3,3,1],p:[0,-8,1.5],o:[-1.5,0,0],c:'#f7cf3e',parent:'armR',f:{front:(P)=>P(1,1,'#c98f1e')}},
  {n:'head',s:[10,9,8],p:[0,16,0],o:[-5,0,-4],c:C.gold,f:{front:(P,w,h)=>{P(2,3,'#2a1a10',1,2);P(7,3,'#2a1a10',1,2);P(2,3,'#fff');P(7,3,'#fff');P(1,2,'#a8701c',2,1);P(7,2,'#a8701c',2,1)}}},
  {n:'muzzle',s:[5,3,2],p:[0,0.5,4],o:[-2.5,0,0],c:'#f3cf7a',parent:'head',f:{front:(P,w)=>{P(1,0,'#2a1a10',3,1);P(1,2,'#8a4a1e',1,1);P(3,2,'#8a4a1e',1,1);P(2,2,'#c2557a',1,1)}}},
  {n:'earL',s:[3,3,2],p:[-4,9,-1],o:[-1.5,0,0],c:C.gold,parent:'head',f:{front:(P)=>P(1,1,'#c98f1e')}},
  {n:'earR',s:[3,3,2],p:[4,9,-1],o:[-1.5,0,0],c:C.gold,parent:'head',f:{front:(P)=>P(1,1,'#c98f1e')}}]},
 bean:{h:31,parts:[
  {n:'body',s:[8,22,6],p:[0,1,0],o:[-4,0,-3],c:'#7cc04a',f:{front:(P,w,h)=>{eyes(P,1,5,{w:2,h:3,gap:4});P(2,10,'#2f5a1c',4,1);P(2,11,'#ffffff',2,2);for(const y of[15,19])P(2,y,'#9ad66a',4,2)},all:(P,w,h,f)=>{if(f!=='front'){for(let y=2;y<h;y+=4)P(1,y,'#9ad66a',Math.max(1,w-2),2)}P(0,0,'#5f9c36',1,h);P(w-1,0,'#5f9c36',1,h)}}},
  {n:'beanie',s:[9,5,7],p:[0,22,0],o:[-4.5,0,-3.5],c:'#8e8e95',parent:'body',f:{all:(P,w,h)=>{for(let x=0;x<w;x+=2)P(x,0,'#76767e',1,h);P(0,h-1,'#6e6e76',w,1)}}},
  {n:'stem',s:[2,4,2],p:[0,27,0],o:[-1,0,-1],r:[0,0,.35],c:'#5f9c36',parent:'body'},
  {n:'curl',s:[2,2,4],p:[0,0,-3],o:[-1,0,-4],c:'#6cae3e',parent:'body'}]},
 kermit:{h:28,parts:[
  {n:'legL',s:[3,9,3],p:[-2,9,0],o:[-1.5,-9,-1.5],c:'#4fa83a',f:{all:(P,w,h,f)=>{if(f!=='top'&&f!=='bottom')P(0,h-1,'#3b8a2c',w,1)}}},
  {n:'legR',s:[3,9,3],p:[2,9,0],o:[-1.5,-9,-1.5],c:'#4fa83a',f:{all:(P,w,h,f)=>{if(f!=='top'&&f!=='bottom')P(0,h-1,'#3b8a2c',w,1)}}},
  {n:'toeL',s:[4,1,5],p:[0,-9,0],o:[-2,0,-1.5],c:'#4fa83a',parent:'legL',f:{top:(P,w,h)=>{P(1,h-1,'#3b8a2c');P(3,h-1,'#3b8a2c')}}},
  {n:'toeR',s:[4,1,5],p:[0,-9,0],o:[-2,0,-1.5],c:'#4fa83a',parent:'legR',f:{top:(P,w,h)=>{P(0,h-1,'#3b8a2c');P(2,h-1,'#3b8a2c')}}},
  {n:'body',s:[6,9,4],p:[0,9,0],o:[-3,0,-2],c:'#58b443',f:{front:(P,w,h)=>{P(1,2,'#7cc85e',4,5)}}},
  {n:'collar',s:[9,2,6],p:[0,7,0],o:[-4.5,0,-3],c:'#2e7d4f',parent:'body',f:{all:(P,w,h,f)=>{if(f!=='top'&&f!=='bottom'){for(let x=0;x<w;x+=2)P(x,h-1,'#5fbf86');}if(f==='top')for(let x=1;x<w;x+=2)P(x,0,'#1f5e3a',1,h)}}},
  {n:'armL',s:[2,9,2],p:[-4,17,0],o:[-1,-9,-1],c:'#58b443',f:{all:(P,w,h,f)=>{if(f!=='top')P(0,h-2,'#3b8a2c',w,2)}}},
  {n:'armR',s:[2,9,2],p:[4,17,0],o:[-1,-9,-1],c:'#58b443',f:{all:(P,w,h,f)=>{if(f!=='top')P(0,h-2,'#3b8a2c',w,2)}}},
  {n:'head',s:[9,5,7],p:[0,18,0],o:[-4.5,0,-3.5],c:'#58b443',f:{front:(P,w,h)=>{P(1,2,'#2a1414',7,1);P(1,1,'#2a1414');P(7,1,'#2a1414');P(2,3,'#c2455a',5,1)},top:(P,w,h)=>{P(2,1,'#4a9d37',5,1)}}},
  {n:'eyeL',s:[3,3,3],p:[-2.5,5,1],o:[-1.5,0,-1.5],c:'#ffffff',parent:'head',noise:.03,f:{front:(P)=>{P(1,1,'#141418');P(0,0,'#58b443',3,1)}}},
  {n:'eyeR',s:[3,3,3],p:[2.5,5,1],o:[-1.5,0,-1.5],c:'#ffffff',parent:'head',noise:.03,f:{front:(P)=>{P(1,1,'#141418');P(0,0,'#58b443',3,1)}}}]},
 pooping:{h:24,parts:[
  {n:'footL',s:[3,3,4],p:[-3,0,0],o:[-1.5,0,-1],c:'#6e4426'},{n:'footR',s:[3,3,4],p:[3,0,0],o:[-1.5,0,-1],c:'#6e4426'},
  {n:'body',s:[12,11,10],p:[0,3,0],o:[-6,0,-5],c:'#8a5a34',f:{front:(P,w,h)=>{P(1,2,'#ffd23f',4,3);P(7,2,'#ffd23f',4,3);P(2,3,'#2a1a10',2,2);P(8,3,'#2a1a10',2,2);P(1,2,'#6e4426',4,1);P(7,2,'#6e4426',4,1);P(4,6,'#3d2414',4,1);P(5,8,'#e9c9a0',2,1)}}},
  {n:'armL',s:[2,5,2],p:[-7,9,0],o:[-1,-5,-1],c:'#7a4e2c'},{n:'armR',s:[2,5,2],p:[7,9,0],o:[-1,-5,-1],c:'#7a4e2c'},
  {n:'brim',s:[14,1,12],p:[0,14,0],o:[-7,0,-6],c:'#3f6b3a'},
  {n:'hat',s:[8,6,7],p:[0,15,0],o:[-4,0,-3.5],c:'#3f6b3a',f:{all:(P,w,h,f)=>{if(f!=='top'&&f!=='bottom')P(0,h-2,'#6e4426',w,2);if(f==='front'){P(3,h-2,'#f2c447',2,2);P(3,h-2,'#c98f1e',1,1)}}}},
  {n:'tip',s:[4,4,4],p:[0,21,0],o:[-2,0,-2],r:[0,0,.45],c:'#3f6b3a'}]},
 bronny:{h:32,parts:[
  {n:'legL',s:[4,11,4],p:[-2,11,0],o:[-2,-11,-2],c:'#b9c0c8',f:{all:(P,w,h)=>{P(0,h-3,'#4a4a52',w,3)}}},
  {n:'legR',s:[4,11,4],p:[2,11,0],o:[-2,-11,-2],c:'#b9c0c8',f:{all:(P,w,h)=>{P(0,h-3,'#4a4a52',w,3)}}},
  {n:'body',s:[9,11,5],p:[0,11,0],o:[-4.5,0,-2.5],c:'#b9c0c8',f:{front:(P,w,h)=>{P(2,1,'#2f4fa8',5,10);P(3,3,'#f2c447',3,2);P(0,8,'#6e4426',w,1)}}},
  {n:'armL',s:[3,11,3],p:[-6,22,0],o:[-1.5,-11,-1.5],c:'#a9b0b8'},
  {n:'armR',s:[3,11,3],p:[6,22,0],o:[-1.5,-11,-1.5],c:'#a9b0b8',f:{all:(P,w,h)=>P(0,h-2,'#5a3d28',w,2)}},
  {n:'shield',s:[1,8,8],p:[-1.5,-8,0],o:[-1,0,-4],c:'#e8782a',parent:'armL',f:{all:(P,w,h,f)=>{if(f==='left'||f==='right'){P(0,3,'#2a1a10',8,1);P(3,0,'#2a1a10',1,8)}}}},
  {n:'head',s:[8,8,8],p:[0,22,0],o:[-4,0,-4],c:'#6b4a32',f:{front:(P,w,h)=>{eyes(P,1,3,{w:2,h:1,gap:4});P(0,0,'#1a1410',w,1);P(1,5,'#1a1410',6,3);P(2,6,'#f4f0e6',4,1)},top:(P,w,h)=>P(0,0,'#1a1410',w,h),back:(P,w,h)=>P(0,0,'#1a1410',w,3),left:(P,w,h)=>P(0,0,'#1a1410',w,2),right:(P,w,h)=>P(0,0,'#1a1410',w,2)}}]},
 asmon:{h:33,parts:[
  {n:'legL',s:[4,11,4],p:[-2,11,0],o:[-2,-11,-2],c:'#2e3a5c',f:{all:(P,w,h)=>P(0,h-3,'#5a3a22',w,3)}},
  {n:'legR',s:[4,11,4],p:[2,11,0],o:[-2,-11,-2],c:'#2e3a5c',f:{all:(P,w,h)=>P(0,h-3,'#5a3a22',w,3)}},
  {n:'body',s:[8,11,4],p:[0,11,0],o:[-4,0,-2],c:'#4b2e6e',f:{front:(P,w,h)=>{P(0,8,'#3a2414',w,1);P(3,8,'#f2c447',2,1)}}},
  {n:'cape',s:[10,19,1],p:[0,22,-2.2],o:[-5,-19,-1],r:[.12,0,0],c:'#33204d',f:{all:(P,w,h)=>{P(0,h-1,'#5c3c86',w,1)}}},
  {n:'armL',s:[3,11,3],p:[-5.5,22,0],o:[-1.5,-11,-1.5],c:'#4b2e6e',f:{all:(P,w,h)=>P(0,h-2,'#e2b48c',w,2)}},
  {n:'armR',s:[3,11,3],p:[5.5,22,0],o:[-1.5,-11,-1.5],c:'#4b2e6e',f:{all:(P,w,h)=>P(0,h-2,'#e2b48c',w,2)}},
  {n:'sword',s:[1,13,2],p:[0,-10,1],o:[-.5,0,0],r:[1.3,0,0],c:'#b88cff',parent:'armR',f:{all:(P,w,h)=>{P(0,0,'#5a3a22',w,3);P(0,3,'#f2c447',w,1)}}},
  {n:'head',s:[8,8,8],p:[0,22,0],o:[-4,0,-4],c:'#e2b48c',f:{front:(P,w,h)=>{P(0,0,'#5a3a22',w,2);P(1,3,'#2a1a10',2,1);P(5,3,'#2a1a10',2,1);P(1,5,'#6e4a2a',6,3);P(0,4,'#5a3a22',1,4);P(7,4,'#5a3a22',1,4);P(3,6,'#a8584a',2,1)},back:(P,w,h)=>P(0,0,'#5a3a22',w,h),left:(P,w,h)=>P(0,0,'#5a3a22',w,h),right:(P,w,h)=>P(0,0,'#5a3a22',w,h),top:(P,w,h)=>P(0,0,'#5a3a22',w,h)}},
  {n:'crown',s:[8,3,8],p:[0,8,0],o:[-4,0,-4],c:'#f2c447',parent:'head',f:{all:(P,w,h,f)=>{if(f!=='top'&&f!=='bottom'){for(let x=1;x<w;x+=3)P(x,0,'#fff2a6');P(3,1,'#d8306a')}if(f==='top')P(1,1,'#00000000')}}}]},
 // ---------- mobs ----------
 gloomie:{h:30,parts:[
  {n:'legL',s:[4,11,4],p:[-2,11,0],o:[-2,-11,-2],c:'#2c2a4a',f:{all:(P,w,h)=>{for(let y=1;y<h;y+=3)P(1,y,'#6b67a8')}}},
  {n:'legR',s:[4,11,4],p:[2,11,0],o:[-2,-11,-2],c:'#2c2a4a'},
  {n:'body',s:[8,10,4],p:[0,11,0],o:[-4,0,-2],c:'#3b3866',f:{front:(P,w,h)=>{P(1,2,'#7a4f9a',3,3);P(1,2,'#a8a2e0');P(3,4,'#a8a2e0')}}},
  {n:'armL',s:[3,10,3],p:[-5.5,20,0],o:[-1.5,-10,-1.5],r:[-1.45,0,0],c:'#3b3866'},
  {n:'armR',s:[3,10,3],p:[5.5,20,0],o:[-1.5,-10,-1.5],r:[-1.45,0,0],c:'#3b3866'},
  {n:'head',s:[8,8,8],p:[0,21,0],o:[-4,0,-4],c:'#34315c',f:{front:(P,w,h)=>{P(1,2,'#f2c447',2,2);P(5,2,'#f2c447',2,2);P(1,2,'#8a6a1a');P(6,3,'#8a6a1a');for(let x=1;x<7;x++)P(x,5+(x%2),'#a8a2e0')}}}]},
 archer:{h:30,parts:[
  {n:'legL',s:[2,12,2],p:[-2,12,0],o:[-1,-12,-1],c:'#4f7a34'},{n:'legR',s:[2,12,2],p:[2,12,0],o:[-1,-12,-1],c:'#4f7a34'},
  {n:'body',s:[6,10,3],p:[0,12,0],o:[-3,0,-1.5],c:'#5f8a3c',f:{all:(P,w,h)=>{for(let y=1;y<h;y+=3)P((y*3)%w,y,'#e8e2b0')}}},
  {n:'armL',s:[2,11,2],p:[-4,21,0],o:[-1,-11,-1],r:[-1.4,.2,0],c:'#4f7a34'},
  {n:'armR',s:[2,11,2],p:[4,21,0],o:[-1,-11,-1],r:[-1.2,-.2,0],c:'#4f7a34'},
  {n:'bow',s:[1,12,1],p:[0,-10,0],o:[-.5,-6,0],c:'#8c6440',parent:'armL'},
  {n:'head',s:[7,7,7],p:[0,22,0],o:[-3.5,0,-3.5],c:'#6a9a44',f:{front:(P)=>{P(1,3,'#ff4a4a');P(5,3,'#ff4a4a');P(2,5,'#2f4a1c',3,1)}}},
  {n:'thistle',s:[9,4,9],p:[0,7,0],o:[-4.5,0,-4.5],c:'#9a5ad0',parent:'head',f:{all:(P,w,h)=>{for(let x=0;x<w;x+=2)P(x,0,'#d8b0ff')}}}]},
 spider:{h:12,parts:[
  {n:'body',s:[10,7,12],p:[0,4,-3],o:[-5,0,-6],c:'#5d6c8a',f:{all:(P,w,h)=>{for(let x=1;x<w;x+=3)P(x,0,'#8d9cba',1,h)}}},
  {n:'head',s:[8,6,6],p:[0,4,3],o:[-4,0,0],c:'#4c5a76',f:{front:(P)=>{P(1,1,'#ff3a3a',2,2);P(5,1,'#ff3a3a',2,2);P(3,3,'#ff7a7a');P(4,3,'#ff7a7a')}}},
  ...[0,1,2,3].flatMap(i=>[{n:'lL'+i,s:[10,1,1],p:[-4,6,-6+i*3.4],o:[-10,0,-.5],r:[0,(i-1.5)*.3,-.5],c:'#3c4760'},{n:'lR'+i,s:[10,1,1],p:[4,6,-6+i*3.4],o:[0,0,-.5],r:[0,-(i-1.5)*.3,.5],c:'#3c4760'}])]},
 popshroom:{h:20,parts:[
  ...[[-3,-3],[3,-3],[-3,3],[3,3]].map(([x,z],i)=>({n:'f'+i,s:[3,3,3],p:[x,0,z],o:[-1.5,0,-1.5],c:'#e9dcc0'})),
  {n:'stem',s:[6,9,6],p:[0,3,0],o:[-3,0,-3],c:'#f1e6cc',f:{front:(P)=>{P(1,2,'#2a1a10',1,2);P(4,2,'#2a1a10',1,2);P(2,6,'#2a1a10',2,1)}}},
  {n:'cap',s:[13,6,13],p:[0,12,0],o:[-6.5,0,-6.5],c:'#c8382e',f:{all:(P,w,h)=>{for(const[x,y]of[[2,1],[8,2],[5,4],[10,0],[1,4]]){P(x,y,'#fff4e8',2,2)}}}}]},
 sheep:{h:16,parts:[
  ...[[-4,-5],[4,-5],[-4,5],[4,5]].map(([x,z],i)=>({n:'leg'+i,s:[3,6,3],p:[x,6,z],o:[-1.5,-6,-1.5],c:'#e8a6b6'})),
  {n:'body',s:[12,9,16],p:[0,6,0],o:[-6,0,-8],c:'#f3ead6',noise:.18,f:{all:knit('#f3ead6')}},
  {n:'head',s:[6,6,6],p:[0,10,8],o:[-3,0,0],c:'#f0b4c2',f:{front:(P)=>{P(1,2,'#2a1a10');P(4,2,'#2a1a10');P(2,4,'#c2557a',2,1)},top:(P,w,h)=>P(0,0,'#f3ead6',w,3)}}]},
 // ---------- bosses ----------
 colossus:{h:58,parts:[
  {n:'legL',s:[7,14,7],p:[-5,14,0],o:[-3.5,-14,-3.5],c:'#d8c48a'},{n:'legR',s:[7,14,7],p:[5,14,0],o:[-3.5,-14,-3.5],c:'#d8c48a'},
  {n:'body',s:[20,18,12],p:[0,14,0],o:[-10,0,-6],c:'#e0cf94',f:{all:(P,w,h)=>{for(let y=3;y<h;y+=5)P(0,y,'#c2a96a',w,1)},front:(P,w,h)=>{for(let y=3;y<h;y+=5)P(0,y,'#c2a96a',w,1);P(7,5,'#ffb52e',6,6);P(8,6,'#fff1a0',4,4)}}},
  {n:'armL',s:[6,20,6],p:[-13,31,0],o:[-3,-20,-3],c:'#d8c48a'},{n:'armR',s:[6,20,6],p:[13,31,0],o:[-3,-20,-3],c:'#d8c48a'},
  {n:'head',s:[12,10,10],p:[0,32,0],o:[-6,0,-5],c:'#e6d6a0',f:{front:(P)=>{P(2,4,'#ff8a1e',3,2);P(7,4,'#ff8a1e',3,2);P(3,7,'#8a6a3a',6,1)}}}]},
 warden:{h:50,parts:[
  {n:'legL',s:[7,12,7],p:[-5,12,0],o:[-3.5,-12,-3.5],c:'#e6eef6'},{n:'legR',s:[7,12,7],p:[5,12,0],o:[-3.5,-12,-3.5],c:'#e6eef6'},
  {n:'body',s:[18,16,12],p:[0,12,0],o:[-9,0,-6],c:'#eef3f8',noise:.2,f:{front:(P,w,h)=>P(4,3,'#a8d8f0',10,10)}},
  {n:'armL',s:[6,18,6],p:[-12,27,0],o:[-3,-18,-3],c:'#e6eef6',f:{all:(P,w,h)=>P(0,h-3,'#7fb8d8',w,3)}},{n:'armR',s:[6,18,6],p:[12,27,0],o:[-3,-18,-3],c:'#e6eef6',f:{all:(P,w,h)=>P(0,h-3,'#7fb8d8',w,3)}},
  {n:'head',s:[10,10,10],p:[0,28,0],o:[-5,0,-5],c:'#eef3f8',f:{front:(P)=>{P(1,2,'#7fb8d8',8,7);P(2,4,'#ffffff',2,2);P(6,4,'#ffffff',2,2);P(3,4,'#1a3a5a');P(6,4,'#1a3a5a');P(3,7,'#1a3a5a',4,1)}}},
  {n:'hornL',s:[2,6,2],p:[-4,9,0],o:[-1,0,-1],r:[0,0,.5],c:'#bfe8ff',parent:'head'},{n:'hornR',s:[2,6,2],p:[4,9,0],o:[-1,0,-1],r:[0,0,-.5],c:'#bfe8ff',parent:'head'}]},
 weaver:{h:26,scale:2.3,parts:[
  {n:'body',s:[12,8,14],p:[0,5,-4],o:[-6,0,-7],c:'#4a2f6e',f:{all:(P,w,h)=>{for(let x=1;x<w;x+=3)P(x,0,'#8a5ac4',1,h)},top:(P,w,h)=>{P(3,3,'#c9a0ff',6,2);P(5,1,'#c9a0ff',2,6)}}},
  {n:'head',s:[8,7,6],p:[0,5,3],o:[-4,0,0],c:'#3c2558',f:{front:(P)=>{for(const[x,y]of[[1,1],[5,1],[2,3],[4,3]])P(x,y,'#e06aff',2,2)}}},
  ...[0,1,2,3].flatMap(i=>[{n:'lL'+i,s:[12,1.5,1.5],p:[-5,8,-8+i*3.6],o:[-12,0,-.75],r:[0,(i-1.5)*.3,-.55],c:'#2a1a40'},{n:'lR'+i,s:[12,1.5,1.5],p:[5,8,-8+i*3.6],o:[0,0,-.75],r:[0,-(i-1.5)*.3,.55],c:'#2a1a40'}])]},
};
SPECS.asmonboss={...SPECS.asmon,scale:1.55};
// Original crab designs for the Coast: boxy shell, stalk eyes, two pincers (armL/armR), four legs per side.
const crabSpec=(shell,dark,big)=>({h:big?9:8,scale:big?3.4:1,parts:[
 {n:'body',s:[12,5,9],p:[0,3,0],o:[-6,0,-4.5],c:shell,noise:.12,f:{top:(P,w,h)=>{for(let x=1;x<w;x+=3)P(x,2,dark,1,h-4);if(big){P(3,1,'#f4f0e0',2,2);P(8,5,'#f4f0e0',2,2);P(5,3,'#b8e6e0',2,2)}},front:(P,w,h)=>{P(0,h-1,dark,w,1);P(4,2,'#3a1810',4,1)}}},
 {n:'eyeL',s:[1.5,3,1.5],p:[-2.5,8,3],o:[-.75,0,-.75],c:shell,f:{top:(P)=>P(0,0,'#141414',2,2),front:(P)=>P(0,0,'#141414',2,1)}},
 {n:'eyeR',s:[1.5,3,1.5],p:[2.5,8,3],o:[-.75,0,-.75],c:shell,f:{top:(P)=>P(0,0,'#141414',2,2),front:(P)=>P(0,0,'#141414',2,1)}},
 {n:'armL',s:[3,3,6],p:[-6,5,3],o:[-3,-1.5,0],r:[0,.35,0],c:shell,f:{front:(P,w,h)=>P(1,0,dark,1,h)}},
 {n:'armR',s:[3,3,6],p:[6,5,3],o:[0,-1.5,0],r:[0,-.35,0],c:shell,f:{front:(P,w,h)=>P(1,0,dark,1,h)}},
 ...(big?[{n:'crown',s:[6,2,4],p:[0,8,-1],o:[-3,0,-2],c:'#f4f0e0',f:{top:(P)=>P(2,1,'#9ad8ff',2,2)}}]:[]),
 ...[0,1,2,3].flatMap(i=>[{n:'lL'+i,s:[5,1.2,1.2],p:[-6,4,-3+i*2],o:[-5,0,-.6],r:[0,0,-.7],c:dark},{n:'lR'+i,s:[5,1.2,1.2],p:[6,4,-3+i*2],o:[0,0,-.6],r:[0,0,.7],c:dark}])]});
SPECS.crab=crabSpec('#e2683a','#a83a1e',false);
SPECS.tidecrab=crabSpec('#d24a3c','#7a2224',true);
export function makeModel(id){return buildModel(SPECS[id])}
// Walk/idle animation shared by humanoids and creatures
export function animate(m,t,speed,opts={}){const P=m.parts;const sw=Math.sin(t*9)*Math.min(1,speed*.35);
 if(P.legL){P.legL.rotation.x=sw*.8;P.legR.rotation.x=-sw*.8}
 if(P.armL&&!opts.armsFixed){P.armL.rotation.x=(opts.armL??0)-sw*.7;P.armR.rotation.x=(opts.armR??0)+sw*.7}
 if(P.shoeL){P.shoeL.position.y=1.5+Math.sin(t*9)*1.4*Math.min(1,speed)+Math.sin(t*2)*.6;P.shoeR.position.y=1.5-Math.sin(t*9)*1.4*Math.min(1,speed)+Math.sin(t*2+1)*.6;P.shoeL.position.z=sw*2;P.shoeR.position.z=-sw*2}
 if(m.spec===SPECS.bean){const hop=Math.abs(Math.sin(t*7))*(speed>.1?3:.6);P.body.position.y=1+hop;P.body.rotation.z=Math.sin(t*3.5)*.06}
 if(P.footL){P.footL.rotation.x=sw*.7;P.footR.rotation.x=-sw*.7;P.body.rotation.z=sw*.08}
 if(P.leg0)for(let i=0;i<4;i++)P['leg'+i].rotation.x=(i%2?sw:-sw)*.7;
 if(P.lL0)for(let i=0;i<4;i++){P['lL'+i].rotation.x=Math.sin(t*14+i)*.25*Math.min(1,speed);P['lR'+i].rotation.x=-Math.sin(t*14+i)*.25*Math.min(1,speed)}
 if(P.f0)for(let i=0;i<4;i++)P['f'+i].position.y=Math.max(0,Math.sin(t*10+i*1.6))*1.5*Math.min(1,speed);
 if(P.tail){P.tail.rotation.x=.5+Math.sin(t*2.2)*.25;P.tail.rotation.y=Math.sin(t*1.6)*.35}
 if(P.cape)P.cape.rotation.x=.12+Math.min(.5,speed*.12)+Math.sin(t*3)*.03}
// Extruded pixel item (held tools, dropped items): each opaque pixel becomes a tiny voxel.
export function extrudeIcon(canvas,depth=1){const g=canvas.getContext('2d');const d=g.getImageData(0,0,16,16).data;const pos=[],col=[];const A=(x,y)=>x>=0&&y>=0&&x<16&&y<16&&d[(y*16+x)*4+3]>128;
 const q=(pts,c,s)=>{for(const i of[0,1,2,0,2,3]){pos.push(...pts[i]);col.push(c[0]*s,c[1]*s,c[2]*s)}};
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){if(!A(x,y))continue;const i=(y*16+x)*4,c=[d[i]/255,d[i+1]/255,d[i+2]/255];const X=x/16-.5,Y=(15-y)/16-.5,s=1/16,z0=-depth/32,z1=depth/32;
  q([[X,Y,z1],[X+s,Y,z1],[X+s,Y+s,z1],[X,Y+s,z1]],c,1);q([[X+s,Y,z0],[X,Y,z0],[X,Y+s,z0],[X+s,Y+s,z0]],c,.8);
  if(!A(x-1,y))q([[X,Y,z0],[X,Y,z1],[X,Y+s,z1],[X,Y+s,z0]],c,.7);if(!A(x+1,y))q([[X+s,Y,z1],[X+s,Y,z0],[X+s,Y+s,z0],[X+s,Y+s,z1]],c,.7);
  if(!A(x,y-1))q([[X,Y+s,z1],[X+s,Y+s,z1],[X+s,Y+s,z0],[X,Y+s,z0]],c,.95);if(!A(x,y+1))q([[X,Y,z0],[X+s,Y,z0],[X+s,Y,z1],[X,Y,z1]],c,.6)}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));return geo}
