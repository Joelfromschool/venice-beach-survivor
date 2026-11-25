'use strict';
// Pure island layout (no THREE) so it can be tested headless.
const ISL_N=48;
const TY={SEA:0,SAND:1,GRASS:2,RIVER:3,POND:4,DOCK:5,BRIDGE:6,ROCKY:7};
const LV_H=[.3,1.4,2.5];
function rngf(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function genIsland(){
 const N=ISL_N,T=new Uint8Array(N*N),L=new Uint8Array(N*N),RAMP=new Int8Array(N*N).fill(-1);
 const I=(x,z)=>z*N+x;
 const nz=(x,z)=>Math.sin(x*.41+1.3)*Math.cos(z*.37+.4)*.7+Math.sin(x*.17+z*.23)*.6+Math.cos(x*.73-z*.61)*.3;
 for(let z=0;z<N;z++)for(let x=0;x<N;x++){const dx=x+.5-24,dz=z+.5-24;const d=Math.hypot(dx,dz*1.04)+nz(x,z);
  const i=I(x,z);if(d<19.6){T[i]=d>17.3?TY.SAND:TY.GRASS}else T[i]=TY.SEA;}
 // plateau level 1 (north) & level 2
 for(let z=0;z<N;z++)for(let x=0;x<N;x++){const i=I(x,z);if(T[i]!==TY.GRASS)continue;
  const edge=15.5+1.6*Math.sin(x*.33)+.8*Math.sin(x*.71+1);
  if(z<edge)L[i]=1;
  if(L[i]===1&&Math.hypot(x+.5-31,z+.5-9.5)+Math.sin(x*.9)*.4<4.0)L[i]=2;}
 // smooth levels: remove 1-tile notches
 for(let pass=0;pass<2;pass++)for(let z=1;z<N-1;z++)for(let x=1;x<N-1;x++){const i=I(x,z);if(T[i]!==TY.GRASS)continue;const c={};[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const j=I(x+a,z+b);if(T[j]===TY.GRASS){c[L[j]]=(c[L[j]]||0)+1}});for(const k in c)if(c[k]>=3&&+k!==L[i])L[i]=+k}
 // river polyline
 const RV=[[19,9.5],[20,15],[21,20],[20,24],[17.5,28],[16.5,33],[16.5,38],[15.5,44]];
 const segD=(px,pz)=>{let b=1e9;for(let k=0;k<RV.length-1;k++){const [ax,az]=RV[k],[bx,bz]=RV[k+1];const vx=bx-ax,vz=bz-az;let t=((px-ax)*vx+(pz-az)*vz)/(vx*vx+vz*vz);t=Math.max(0,Math.min(1,t));b=Math.min(b,Math.hypot(px-ax-vx*t,pz-az-vz*t))}return b};
 for(let z=0;z<N;z++)for(let x=0;x<N;x++){const i=I(x,z);if(T[i]===TY.SEA)continue;if(segD(x+.5,z+.5)<1.05){if(L[i]===2)L[i]=1;T[i]=TY.RIVER}}
 // river source pond at top
 for(let z=0;z<N;z++)for(let x=0;x<N;x++){const i=I(x,z);if(T[i]!==TY.SEA&&Math.hypot(x+.5-19,z+.5-9.5)<1.6){T[i]=TY.RIVER;L[i]=1}}
 // pond east
 for(let z=0;z<N;z++)for(let x=0;x<N;x++){const i=I(x,z);if(T[i]===TY.GRASS&&L[i]===0&&Math.hypot(x+.5-36,(z+.5-27)*1.2)<2.3)T[i]=TY.POND}
 // level of river tiles = min of neighbours? river keeps its plateau level; tiles on sand = level0
 // bridges
 const bridge=(z,x0,x1)=>{for(let x=x0;x<=x1;x++){const i=I(x,z);if(T[i]===TY.RIVER)T[i]=TY.BRIDGE}};
 bridge(25,14,24);bridge(36,13,20);bridge(11,16,22);
 // ramps: tile at level 0 whose north neighbour is level1 (dir 0 = up toward -z)
 const ramp=(x,z,dir)=>{const i=I(x,z);if(T[i]===TY.GRASS){RAMP[i]=dir}};
 // find west ramp near x=9..10 and east near x=36 : search first level0 grass below a level1 tile
 const mkRampAt=(x)=>{for(let z=4;z<30;z++){const i=I(x,z),j=I(x,z+1);if(T[i]===TY.GRASS&&L[i]===1&&T[j]===TY.GRASS&&L[j]===0){ramp(x,z+1,0);return z+1}}return -1};
 const rz=[mkRampAt(9),mkRampAt(10),mkRampAt(33),mkRampAt(34)];
 // level2 ramp (from level1 up): find level1 tile south of level2 tile near x=30
 for(const x of [30,31]){for(let z=4;z<20;z++){const i=I(x,z),j=I(x,z+1);if(L[i]===2&&L[j]===1&&T[j]===TY.GRASS){RAMP[j]=0;break}}}
 // dock: south shore around x=26-27
 let sz=0;for(let z=N-1;z>0;z--){if(T[I(26,z)]!==TY.SEA){sz=z;break}}
 for(let z=sz+1;z<=sz+4&&z<N;z++){T[I(26,z)]=TY.DOCK;T[I(27,z)]=TY.DOCK}
 return {N,T,L,RAMP,I,dockZ:sz,rampZ:rz};
}
// tile height (top surface) helpers
function tileTop(W,x,z){if(x<0||z<0||x>=W.N||z>=W.N)return -1.2;const i=W.I(x,z),t=W.T[i];
 if(t===TY.SEA)return -1.2;if(t===TY.SAND)return 0;if(t===TY.DOCK)return .25;if(t===TY.RIVER||t===TY.POND)return LV_H[W.L[i]]-.95;
 return LV_H[W.L[i]]}
function walkH(W,px,pz){const x=Math.floor(px),z=Math.floor(pz);if(x<0||z<0||x>=W.N||z>=W.N)return null;const i=W.I(x,z),t=W.T[i];
 if(t===TY.SEA||t===TY.RIVER||t===TY.POND)return null;if(t===TY.DOCK)return .25;if(t===TY.SAND)return 0;
 if(t===TY.BRIDGE)return LV_H[W.L[i]]+.05;
 if(W.RAMP[i]===0){const f=pz-z;return LV_H[W.L[i]]+(LV_H[W.L[i]+1]-LV_H[W.L[i]])*(1-f)}
 return LV_H[W.L[i]]}
if(typeof module!=='undefined')module.exports={genIsland,TY,walkH,tileTop,LV_H};
