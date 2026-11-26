// Procedural world: deterministic from absolute coordinates, so the same street looks the same every visit.
// No map tiles or network: roads, parks and water come from seeded noise around the player's coordinates.
import {SPECIES,SP,RAR_W,STOP_NAMES} from './data.js?v=1.0.2';
export const CELL=160;
export const HATS=new Set(['bean','pinco','pooh','mogu','bronny']);
export function hash(...a){let h=2166136261>>>0;for(const v of a){let x=(typeof v==='number'?Math.floor(v):strH(v))|0;h^=x&255;h=Math.imul(h,16777619);h^=(x>>>8)&255;h=Math.imul(h,16777619);h^=(x>>>16)&255;h=Math.imul(h,16777619);h^=x>>>24;h=Math.imul(h,16777619)}
 h^=h>>>13;h=Math.imul(h,0x5bd1e995);h^=h>>>15;return (h>>>0)/4294967296}
function strH(s){let h=0;for(let i=0;i<s.length;i++)h=Math.imul(h,31)+s.charCodeAt(i)|0;return h}
export function rng(seed){let s=Math.floor(seed*4294967295)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}}
// value noise
function vn(x,y,sc,salt){const X=x/sc,Y=y/sc,ix=Math.floor(X),iy=Math.floor(Y),fx=X-ix,fy=Y-iy;
 const s=t=>t*t*(3-2*t),a=hash(ix,iy,salt),b=hash(ix+1,iy,salt),c=hash(ix,iy+1,salt),d=hash(ix+1,iy+1,salt);
 const u=s(fx),v=s(fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
export function parkV(x,y){return vn(x,y,420,11)*.65+vn(x,y,130,12)*.35}
export function waterV(x,y){return vn(x,y,700,21)*.7+vn(x,y,160,22)*.3}
// terrain at absolute meters: 'water' | 'park' | 'urban'
export function terrain(x,y){if(waterV(x,y)>.7)return 'water';if(parkV(x,y)>.56)return 'park';return 'urban'}
// projection: lat/lon -> absolute meters (x east, y north)
export function project(lat,lon){const k=Math.cos(Math.round(lat*2)/2*Math.PI/180);return {x:lon*111320*k,y:lat*110540}}
// roads: edges of the cell grid; each edge exists with a seeded chance
export function roadEdge(ix,iy,dir){return hash(ix,iy,dir==='v'?31:32)>.22}
export function cellRoads(ix,iy){const out=[];const x0=ix*CELL,y0=iy*CELL;
 if(roadEdge(ix,iy,'v'))out.push([x0,y0,x0,y0+CELL,1]);
 if(roadEdge(ix,iy,'h'))out.push([x0,y0,x0+CELL,y0,1]);
 // a narrower mid-block street sometimes
 const m=hash(ix,iy,33);if(m<.3)out.push([x0+CELL/2,y0,x0+CELL/2,y0+CELL,.6]);else if(m<.55)out.push([x0,y0+CELL/2,x0+CELL,y0+CELL/2,.6]);
 return out.filter(r=>terrain((r[0]+r[2])/2,(r[1]+r[3])/2)!=='water')}
// park footpaths (curvy)
export function cellPaths(ix,iy){const x0=ix*CELL,y0=iy*CELL,cx=x0+CELL/2,cy=y0+CELL/2;if(terrain(cx,cy)!=='park')return[];
 const r=rng(hash(ix,iy,41));const pts=[];const a=r()*Math.PI;for(let i=0;i<=8;i++){const t=i/8-.5;pts.push([cx+Math.cos(a)*t*CELL*1.1+Math.sin(i*1.3+r()*3)*8,cy+Math.sin(a)*t*CELL*1.1+Math.cos(i*1.1)*8])}return [pts]}
// stops & arenas
export function cellStops(ix,iy){const r=rng(hash(ix,iy,51));const n=r()<.35?0:(r()<.6?1:2);const out=[];
 for(let i=0;i<n;i++){let x=ix*CELL+12+r()*(CELL-24),y=iy*CELL+12+r()*(CELL-24);
  // snap toward a road edge if any
  if(r()<.6){if(r()<.5)x=ix*CELL+9;else y=iy*CELL+9}
  if(terrain(x,y)==='water')continue;const nm=STOP_NAMES[Math.floor(r()*STOP_NAMES.length)];out.push({id:`s${ix}_${iy}_${i}`,x,y,en:nm[0],ja:nm[1],pic:Math.floor(r()*6)})}
 return out}
export function cellArena(ix,iy){const h=hash(ix,iy,61);if(h>.11)return null;const r=rng(hash(ix,iy,62));const x=ix*CELL+30+r()*(CELL-60),y=iy*CELL+30+r()*(CELL-60);
 if(terrain(x,y)==='water')return null;return {id:`a${ix}_${iy}`,x,y,def:pickSpecies(r,terrain(x,y),false,true),tier:1+Math.floor(r()*3)}}
export function raidAt(arena,now){const hr=Math.floor(now/3600000);if(hash(arena.id,hr,71)>.45)return null;const r=rng(hash(arena.id,hr,72));
 const tierR=r();const tier=tierR<.4?1:tierR<.75?3:5;const pool={1:['prof','pinco','bramble','lkpooh'],3:['bronny','troll','moth','kermit','hpbronny','wzpoop'],5:['asmon']}[tier];
 const sp=pool[Math.floor(r()*pool.length)];const end=(hr+1)*3600000;return {sp,tier,end,key:arena.id+':'+hr}}
export function isNight(d=new Date()){const h=d.getHours();return h>=18||h<6}
export function pickSpecies(r,ter,night,strong){const pool=[];for(const s of SPECIES){if(s.raidOnly||!s.bio.length)continue;let w=RAR_W[s.rar];
  const ok=s.bio.includes(ter)||(night&&s.bio.includes('night'));if(!ok)w*=.12;if(s.bio.includes('night')&&!night&&s.bio.length===1)w*=.15;
  if(strong&&s.rar==='c')w*=.03;if(strong&&s.id==='kaise')w=0;pool.push([s.id,w])}
 let t=pool.reduce((a,b)=>a+b[1],0)*r();for(const [id,w] of pool){t-=w;if(t<=0)return id}return pool[0][0]}
// spawns for a cell during a 10-minute window. Each spawn lives 8-12 minutes (1.0.2: denser + faster respawn).
const WIN=10*60000;
export function cellSpawns(ix,iy,now,night,boost){const out=[];for(const wk of [Math.floor(now/WIN)-1,Math.floor(now/WIN)]){
  const r=rng(hash(ix,iy,wk,81));const cx=ix*CELL+CELL/2,cy=iy*CELL+CELL/2;const t=terrain(cx,cy);let n=(t==='park'?5:4)+(r()<.5?1:0)+(boost?3:0);
  for(let i=0;i<n;i++){let x=ix*CELL+r()*CELL,y=iy*CELL+r()*CELL;const ter=terrain(x,y);
   const start=wk*WIN+r()*WIN*.7,dur=8*60000+r()*4*60000;const sp=pickSpecies(r,ter,night);
   const lvR=r(),iv=[Math.floor(r()*16),Math.floor(r()*16),Math.floor(r()*16)],shR=r();const hR=r();
   if(now<start||now>start+dur)continue;
   out.push({key:`w${ix}_${iy}_${wk}_${i}`,x,y,sp,ter,lvR,iv,shiny:shR<(boost?1/20:1/256),hat:HATS.has(sp)&&holiday(now)&&hR<.4,end:start+dur})}}
 return out}

export function holiday(now){const d=new Date(now),m=d.getMonth(),day=d.getDate();return (m===10&&day>=20)||m===11||(m===0&&day<=7)}
