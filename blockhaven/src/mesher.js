// Chunk mesher: face culling, per-vertex ambient occlusion and smooth sky/block light.
import * as THREE from '../vendor/three.module.min.js';
import {BLOCKS} from './blocks.js';
import {TS,AT,PER} from './textures.js';
const FACES=[
 {n:[1,0,0],c:[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],shade:.8,k:'side'},
 {n:[-1,0,0],c:[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],shade:.8,k:'side'},
 {n:[0,1,0],c:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],shade:1,k:'top'},
 {n:[0,-1,0],c:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],shade:.55,k:'bottom'},
 {n:[0,0,1],c:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],shade:.9,k:'front'},
 {n:[0,0,-1],c:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],shade:.7,k:'front'}];
const UVC=[[0,0],[1,0],[1,1],[0,1]];
const EPS=0.0008;
export function tileUV(t){const u=(t%PER)*TS/AT,v=1-(Math.floor(t/PER)*TS+TS)/AT;return[u+EPS,v+EPS,u+TS/AT-EPS,v+TS/AT-EPS]}
class Buf{constructor(){this.p=[];this.u=[];this.l=[];this.i=[];this.n=0}
 quad(ps,uvs,ls,flip){const b=this.n;for(let k=0;k<4;k++){this.p.push(ps[k][0],ps[k][1],ps[k][2]);this.u.push(uvs[k][0],uvs[k][1]);this.l.push(ls[k][0],ls[k][1],ls[k][2])}if(flip)this.i.push(b+1,b+2,b+3,b+1,b+3,b);else this.i.push(b,b+1,b+2,b,b+2,b+3);this.n+=4}
 geo(){if(!this.n)return null;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(this.u,2));g.setAttribute('lt',new THREE.Float32BufferAttribute(this.l,3));g.setIndex(this.n>65000?new THREE.Uint32BufferAttribute(this.i,1):new THREE.Uint16BufferAttribute(this.i,1));g.computeBoundingSphere();return g}}
export function meshChunk(w,cx,cz){const solid=new Buf(),water=new Buf();const x0=cx*16,z0=cz*16;const H=w.H;
 const op=(x,y,z)=>{const b=BLOCKS[w.get(x,y,z)];return b.opaque?1:0};
 for(let y=0;y<H;y++)for(let z=z0;z<z0+16;z++)for(let x=x0;x<x0+16;x++){const id=w.get(x,y,z);if(!id)continue;const b=BLOCKS[id];
  if(b.cross){const sl=w.skyAt(x,y,z)/15,bl=w.blkAt(x,y,z)/15;const[u0,v0,u1,v1]=tileUV(b.tex.side);const L=[[sl,bl,1],[sl,bl,1],[sl,bl,1],[sl,bl,1]];const uv=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];const o=.15,e=.85;
   for(const[a,c]of[[[x+o,z+o],[x+e,z+e]],[[x+e,z+o],[x+o,z+e]]]){solid.quad([[a[0],y,a[1]],[c[0],y,c[1]],[c[0],y+1,c[1]],[a[0],y+1,a[1]]],uv,L);solid.quad([[c[0],y,c[1]],[a[0],y,a[1]],[a[0],y+1,a[1]],[c[0],y+1,c[1]]],uv,L)}continue}
  if(b.torch){const sl=w.skyAt(x,y,z)/15,bl=1;const L=[[sl,bl,1],[sl,bl,1],[sl,bl,1],[sl,bl,1]];const[u0,v0,u1,v1]=tileUV(b.tex.side);const du=(u1-u0)/16,dv=(v1-v0)/16;const a=x+7/16,c=x+9/16,za=z+7/16,zc=z+9/16,top=y+10/16;
   const su=[[u0+7*du,v0],[u0+9*du,v0],[u0+9*du,v0+10*dv],[u0+7*du,v0+10*dv]];
   solid.quad([[a,y,zc],[c,y,zc],[c,top,zc],[a,top,zc]],su,L);solid.quad([[c,y,za],[a,y,za],[a,top,za],[c,top,za]],su,L);solid.quad([[c,y,zc],[c,y,za],[c,top,za],[c,top,zc]],su,L);solid.quad([[a,y,za],[a,y,zc],[a,top,zc],[a,top,za]],su,L);
   const tu=[[u0+7*du,v0+10*dv],[u0+9*du,v0+10*dv],[u0+9*du,v0+12*dv],[u0+7*du,v0+12*dv]];solid.quad([[a,top,zc],[c,top,zc],[c,top,za],[a,top,za]],tu,L);continue}
  const isWater=b.liquid;const target=isWater?water:solid;
  for(const f of FACES){const nx=x+f.n[0],ny=y+f.n[1],nz=z+f.n[2];const nid=w.get(nx,ny,nz),nb=BLOCKS[nid];
   if(isWater){if(nb.liquid||nb.opaque)continue}else{if(nb.opaque)continue;if(nid===id&&(b.cutout&&id!==9&&id!==36&&id!==50))continue}
   if(f.n[1]===-1&&y===0)continue;
   const tile=f.k==='front'?(b.tex.front??b.tex.side):b.tex[f.k];const[u0,v0,u1,v1]=tileUV(tile);
   const ps=[],uvs=[],ls=[];const ao=[];
   const ax=f.n[0]?0:f.n[1]?1:2;const tA=ax===0?[1,2]:ax===1?[0,2]:[0,1];
   for(let k=0;k<4;k++){const c=f.c[k];let px=x+c[0],py=y+c[1],pz=z+c[2];
    if(isWater&&c[1]===1&&!BLOCKS[w.get(x,y+1,z)].liquid)py-=.125;
    ps.push([px,py,pz]);uvs.push([UVC[k][0]?u1:u0,UVC[k][1]?v1:v0]);
    const d1=[0,0,0],d2=[0,0,0];d1[tA[0]]=c[tA[0]]?1:-1;d2[tA[1]]=c[tA[1]]?1:-1;
    const s1=op(nx+d1[0],ny+d1[1],nz+d1[2]),s2=op(nx+d2[0],ny+d2[1],nz+d2[2]),cc=op(nx+d1[0]+d2[0],ny+d1[1]+d2[1],nz+d1[2]+d2[2]);
    const a=s1&&s2?0:3-s1-s2-cc;ao.push(a);
    let sk=w.skyAt(nx,ny,nz),bl=w.blkAt(nx,ny,nz),cnt=1;
    if(!s1){sk+=w.skyAt(nx+d1[0],ny+d1[1],nz+d1[2]);bl+=w.blkAt(nx+d1[0],ny+d1[1],nz+d1[2]);cnt++}
    if(!s2){sk+=w.skyAt(nx+d2[0],ny+d2[1],nz+d2[2]);bl+=w.blkAt(nx+d2[0],ny+d2[1],nz+d2[2]);cnt++}
    if(!cc&&!(s1&&s2)){sk+=w.skyAt(nx+d1[0]+d2[0],ny+d1[1]+d2[1],nz+d1[2]+d2[2]);bl+=w.blkAt(nx+d1[0]+d2[0],ny+d1[1]+d2[1],nz+d1[2]+d2[2]);cnt++}
    if(b.light)bl=Math.max(bl/cnt,b.light)*cnt;
    ls.push([sk/cnt/15,bl/cnt/15,f.shade*(isWater?1:[.55,.7,.85,1][a])])}
   target.quad(ps,uvs,ls,ao[0]+ao[2]<ao[1]+ao[3])}}
 return{solid:solid.geo(),water:water.geo()}}
// Shared shader: daylight-scaled sky light, warm block light, fog.
export function makeMaterials(atlasTex){
 const uniforms={map:{value:atlasTex},uDay:{value:1},uFogColor:{value:new THREE.Color(0x9fd0ff)},uFogNear:{value:30},uFogFar:{value:70},uMinLight:{value:.1},uTime:{value:0},uBright:{value:0}};
 const vs=`attribute vec3 lt;varying vec3 vL;varying vec2 vUv;varying float vDepth;void main(){vL=lt;vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`;
 const fs=(alpha)=>`uniform sampler2D map;uniform float uDay,uFogNear,uFogFar,uMinLight,uBright;uniform vec3 uFogColor;varying vec3 vL;varying vec2 vUv;varying float vDepth;
 void main(){vec4 t=texture2D(map,vUv);${alpha?'':'if(t.a<.5)discard;'}float sk=pow(.82,(1.-vL.x)*15.)*uDay;float bl=pow(.85,(1.-vL.y)*15.);vec3 lc=max(vec3(sk)*mix(vec3(.55,.6,.85),vec3(1.),uDay),vec3(bl)*vec3(1.,.86,.62));lc=max(lc,vec3(uMinLight+uBright));vec3 c=t.rgb*lc*vL.z;float f=smoothstep(uFogNear,uFogFar,vDepth);gl_FragColor=vec4(mix(c,uFogColor,f),${alpha?'t.a*.78':'1.'});}`;
 const solid=new THREE.ShaderMaterial({uniforms,vertexShader:vs,fragmentShader:fs(false)});
 const water=new THREE.ShaderMaterial({uniforms,vertexShader:vs,fragmentShader:fs(true),transparent:true,depthWrite:false,side:THREE.DoubleSide});
 return{solid,water,uniforms}}
