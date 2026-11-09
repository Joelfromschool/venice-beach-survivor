// Blockhaven main game: renderer, chunk streaming, player, interaction, survival, quests, saving, cinema.
import * as THREE from '../vendor/three.module.min.js';
import {G,VERSION} from './state.js';
import {buildAtlas,buildCracks} from './textures.js';
import {BLOCKS,B,ITEMS,I,def,isBlock,maxStack,foodOf,fuelOf,RECIPES,SMELT,setAtlas,iconCanvas,itemPixels} from './blocks.js';
import {World,generateOverworld,generateRealm,generateCoast,SEA} from './world.js';
import {meshChunk,makeMaterials} from './mesher.js';
import {makeModel,animate,extrudeIcon} from './models.js';
import {audioWake,sfx,setMood,musicVolume,audioSuspend} from './audio.js';
import {QUESTS,NPC,BOSSES,BOSS_LINES,ASMON_JOIN,ENDING,IDLE,TRADES,AWAY,PLACE} from './story.js';
import * as E from './entities.js';
import * as UI from './ui.js';
import {T,tx,itemName} from './i18n.js';
import {clamp,angleWrap,mulberry} from './util.js';
const $=s=>document.querySelector(s);
const QA=new URLSearchParams(location.search).has('qa');
export const isTouch=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window&&navigator.maxTouchPoints>0);
// ---------------- options ----------------
const OPT_KEY='blockhaven-options-v1',SAVE_KEY='blockhaven-save-v1';
const defaults={lang:(navigator.language||'').startsWith('ja')?'ja':'en',sound:true,music:true,difficulty:1,keepInv:true,view:isTouch?4:6,sens:1,autojump:true,reduced:false,cheat:false};
try{G.opt=Object.assign({},defaults,JSON.parse(localStorage.getItem(OPT_KEY)||'{}'))}catch(e){G.opt={...defaults}}
export function saveOptions(){try{localStorage.setItem(OPT_KEY,JSON.stringify(G.opt))}catch(e){}}
// ---------------- renderer & scene ----------------
const canvas=$('#game');
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance',preserveDrawingBuffer:QA});
renderer.autoClear=false;renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
const scene=new THREE.Scene();G.scene=scene;
const camera=new THREE.PerspectiveCamera(72,1,.05,300);camera.rotation.order='YXZ';
const handScene=new THREE.Scene(),handCam=new THREE.PerspectiveCamera(62,1,.01,10);
const atlas=buildAtlas();setAtlas(atlas);G.atlas=atlas;
const atlasTex=new THREE.CanvasTexture(atlas);atlasTex.magFilter=atlasTex.minFilter=THREE.NearestFilter;atlasTex.generateMipmaps=false;G.atlasTex=atlasTex;
const MAT=makeMaterials(atlasTex);
scene.fog=new THREE.Fog(0x9fd0ff,30,70);
E.initParticles(scene);
// sky dressing
const skyGroup=new THREE.Group();scene.add(skyGroup);
function discTex(draw){const c=document.createElement('canvas');c.width=c.height=32;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t}
const sun=new THREE.Mesh(new THREE.PlaneGeometry(22,22),new THREE.MeshBasicMaterial({map:discTex(g=>{g.fillStyle='#fff6c8';g.fillRect(8,8,16,16);g.fillStyle='#ffe07a';g.fillRect(10,10,12,12);g.fillStyle='#ffd040';g.fillRect(13,13,6,6);g.fillStyle='rgba(255,230,140,.45)';g.fillRect(4,12,24,8);g.fillRect(12,4,8,24)}),transparent:true,fog:false,depthWrite:false}));
const moon=new THREE.Mesh(new THREE.PlaneGeometry(16,16),new THREE.MeshBasicMaterial({map:discTex(g=>{g.fillStyle='#e8ecf8';g.fillRect(9,9,14,14);g.fillStyle='#c6cde0';g.fillRect(12,12,4,3);g.fillRect(17,17,3,3);g.fillRect(13,18,2,2)}),transparent:true,fog:false,depthWrite:false}));
skyGroup.add(sun,moon);
const starGeo=new THREE.BufferGeometry();{const p=[];const r=mulberry(5);for(let i=0;i<500;i++){const a=r()*6.28,b=Math.acos(r()*1.6-.6);p.push(Math.cos(a)*Math.sin(b)*180,Math.cos(b)*180,Math.sin(a)*Math.sin(b)*180)}starGeo.setAttribute('position',new THREE.Float32BufferAttribute(p,3))}
const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xffffff,size:1.4,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));skyGroup.add(stars);
const cloudCanvas=document.createElement('canvas');cloudCanvas.width=cloudCanvas.height=64;{const g=cloudCanvas.getContext('2d');const r=mulberry(11);for(let i=0;i<34;i++){const x=Math.floor(r()*60),y=Math.floor(r()*60),w=3+Math.floor(r()*9),h=2+Math.floor(r()*5);g.fillStyle='#fff';g.fillRect(x,y,w,h)}}
const cloudTex=new THREE.CanvasTexture(cloudCanvas);cloudTex.magFilter=cloudTex.minFilter=THREE.NearestFilter;cloudTex.generateMipmaps=false;cloudTex.wrapS=cloudTex.wrapT=THREE.RepeatWrapping;cloudTex.repeat.set(4,4);
const clouds=new THREE.Mesh(new THREE.PlaneGeometry(1024,1024),new THREE.MeshBasicMaterial({map:cloudTex,transparent:true,opacity:.75,fog:false,depthWrite:false,side:THREE.DoubleSide}));clouds.rotation.x=-Math.PI/2;clouds.position.y=62;scene.add(clouds);
const ocean=new THREE.Mesh(new THREE.PlaneGeometry(2400,2400),new THREE.MeshBasicMaterial({color:0x2f63c0}));ocean.rotation.x=-Math.PI/2;ocean.position.set(128,SEA+.8,128);scene.add(ocean);
// target outline + cracks
const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.004,1.004,1.004)),new THREE.LineBasicMaterial({color:0x111111,transparent:true,opacity:.55}));outline.visible=false;scene.add(outline);
const crackTex=new THREE.CanvasTexture(buildCracks());crackTex.magFilter=crackTex.minFilter=THREE.NearestFilter;crackTex.generateMipmaps=false;crackTex.repeat.set(.1,1);
const crack=new THREE.Mesh(new THREE.BoxGeometry(1.01,1.01,1.01),new THREE.MeshBasicMaterial({map:crackTex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));crack.visible=false;scene.add(crack);
// quest beam
const beam=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,90,8,1,true),new THREE.MeshBasicMaterial({color:0xffd25a,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,side:THREE.DoubleSide}));beam.visible=false;scene.add(beam);
// ---------------- chunks ----------------
const chunks=new Map();
function disposeChunk(k){const c=chunks.get(k);if(!c)return;for(const m of[c.solid,c.water])if(m){scene.remove(m);m.geometry.dispose()}chunks.delete(k)}
function disposeAllChunks(){for(const k of[...chunks.keys()])disposeChunk(k)}
function buildChunk(cx,cz){const k=cx+','+cz;const m=meshChunk(G.world,cx,cz);const old=chunks.get(k);if(old)for(const o of[old.solid,old.water])if(o){scene.remove(o);o.geometry.dispose()}const c={solid:null,water:null};if(m.solid){c.solid=new THREE.Mesh(m.solid,MAT.solid);c.solid.matrixAutoUpdate=false;scene.add(c.solid)}if(m.water){c.water=new THREE.Mesh(m.water,MAT.water);c.water.renderOrder=2;c.water.matrixAutoUpdate=false;scene.add(c.water)}chunks.set(k,c)}
export function updateChunks(budget=6,cx0,cz0){const w=G.world;if(!w)return 0;const p=cx0!==undefined?{x:cx0,z:cz0}:camera.position;const pcx=Math.floor(p.x/16),pcz=Math.floor(p.z/16);const R=G.opt.view;const NX=w.W/16,NZ=w.D/16;const t0=performance.now();
 if(w.urgent&&w.urgent.size){for(const k of w.urgent){const[a,b]=k.split(',').map(Number);if(a>=0&&b>=0&&a<NX&&b<NZ&&chunks.has(k))buildChunk(a,b);w.dirty.delete(k)}w.urgent.clear()}
 if(w.dirty.size){const list=[...w.dirty].map(k=>{const[a,b]=k.split(',').map(Number);return[a,b,Math.hypot(a-pcx,b-pcz),k]}).sort((x,y)=>x[2]-y[2]);for(const[a,b,d,k]of list){if(performance.now()-t0>budget)break;w.dirty.delete(k);if(chunks.has(k))buildChunk(a,b)}}
 let built=0;const want=[];for(let dz=-R;dz<=R;dz++)for(let dx=-R;dx<=R;dx++){const a=pcx+dx,b=pcz+dz;if(a<0||b<0||a>=NX||b>=NZ)continue;const d=Math.hypot(dx,dz);if(d>R+.5)continue;if(!chunks.has(a+','+b))want.push([a,b,d])}
 want.sort((x,y)=>x[2]-y[2]);for(const[a,b]of want){if(performance.now()-t0>budget&&built>0)break;buildChunk(a,b);built++}
 for(const k of[...chunks.keys()]){const[a,b]=k.split(',').map(Number);if(Math.hypot(a-pcx,b-pcz)>R+2.5)disposeChunk(k)}
 return want.length-built}
// ---------------- player ----------------
const PW=.3,PH=1.8,EYE=1.62;
const P={pos:new THREE.Vector3(),vel:new THREE.Vector3(),yaw:0,pitch:0,w:PW,h:PH,onGround:false,hp:20,hunger:20,sat:5,exh:0,xp:0,level:0,inv:new Array(36).fill(null),armor:[null,null,null,null],sel:0,spawn:null,spawnDim:'over',fallStart:null,hurtCD:0,atkCD:0,regen:0,starve:0,eating:null,bow:null,slow:0,poison:0,dead:false,inWater:false,bob:0,swing:0,sleeping:false};G.P=P;
function maxHp(){return 20+2*Math.min(10,Math.floor(P.level/2))}
const input={keys:{},jump:false,sneak:false,sprint:false,attack:false,use:false,useEdge:false,stickX:0,stickY:0};G.input=input;
function heldStack(){return P.inv[P.sel]}
function heldDef(){const s=heldStack();return s?def(s.id):null}
// ---------------- inventory ----------------
export function addItem(id,n=1,dur){let left=n;const ms=maxStack(id);const d=def(id);
 if(ms>1)for(let i=0;i<36&&left>0;i++){const s=P.inv[i];if(s&&s.id===id&&s.count<ms){const k=Math.min(left,ms-s.count);s.count+=k;left-=k}}
 for(let i=0;i<36&&left>0;i++){if(!P.inv[i]){const k=Math.min(left,ms);P.inv[i]={id,count:k,dur:d?.dur?(dur??d.dur):undefined};left-=k}}
 UI.dirty();if(left<n)questCheck();return left}
export function countItem(id){let n=0;for(const s of P.inv)if(s&&s.id===id)n+=s.count;return n}
export function removeItem(id,n){if(countItem(id)<n)return false;for(let i=35;i>=0&&n>0;i--){const s=P.inv[i];if(s&&s.id===id){const k=Math.min(n,s.count);s.count-=k;n-=k;if(s.count<=0)P.inv[i]=null}}UI.dirty();return true}
function useDurability(k=1){const s=heldStack();if(!s||!s.dur||G.opt.cheat)return;s.dur-=k;if(s.dur<=0){P.inv[P.sel]=null;sfx('break',B.stone);UI.toast(T('broke',{item:itemName(s.id)}))}UI.dirty()}
// ---------------- crafting / smelting ----------------
export function nearBlock(ids,r=4){const w=G.world;const x0=Math.floor(P.pos.x),y0=Math.floor(P.pos.y),z0=Math.floor(P.pos.z);for(let y=y0-2;y<=y0+3;y++)for(let z=z0-r;z<=z0+r;z++)for(let x=x0-r;x<=x0+r;x++)if(ids.includes(w.get(x,y,z)))return true;return false}
export function canCraft(r){if(r.bench&&!nearBlock([B.workbench]))return false;if(G.opt.cheat)return true;return r.ing.every(([id,n])=>countItem(id)>=n)}
export function craft(r){if(!canCraft(r))return false;if(!G.opt.cheat)for(const[id,n]of r.ing)removeItem(id,n);const left=addItem(r.out,r.n);if(left>0)E.dropItem(r.out,left,P.pos.x,P.pos.y+1,P.pos.z);sfx('craft');G.stats.crafted++;questCheck();UI.dirty();return true}
export function kilnState(i){let k=G.world.meta.get('kiln:'+i);if(!k){k={q:[],out:[],prog:0};G.world.meta.set('kiln:'+i,k)}return k}
export function fuelUnits(){if(G.opt.cheat)return 999;let u=0;for(const f of[101,8,7,35,49,100])u+=countItem(f)*fuelOf(f);return Math.floor(u)}
export function smelt(i,inId,n){const out=SMELT[inId];if(!out)return false;n=Math.min(n,countItem(inId));if(n<=0)return false;
 if(!G.opt.cheat){n=Math.min(n,fuelUnits());if(n<=0){UI.toast(T('nofuel'));return false}let need=n;for(const f of[101,8,7,35,49,100]){const per=fuelOf(f);while(need>0&&countItem(f)>0){removeItem(f,1);need-=per}}}
 removeItem(inId,n);const k=kilnState(i);k.q.push([inId,n]);sfx('place',B.kiln);UI.dirty();return true}
function updateKilns(dt){for(const w of Object.values(G.worlds)){for(const[key,k]of w.meta){if(!key.startsWith('kiln:')||!k.q||!k.q.length)continue;k.prog+=dt*(G.opt.cheat?8:1);if(k.prog>=2.2){k.prog=0;const job=k.q[0];job[1]--;const o=SMELT[job[0]];const last=k.out.find(s=>s[0]===o);if(last)last[1]++;else k.out.push([o,1]);if(job[1]<=0)k.q.shift();UI.kilnTick()}}}}
export function collectKiln(i){const k=kilnState(i);for(const[id,n]of k.out){const left=addItem(id,n);if(left)E.dropItem(id,left,P.pos.x,P.pos.y+1,P.pos.z)}const any=k.out.length;k.out=[];if(any)sfx('pop');questCheck();UI.dirty()}
// ---------------- raycast ----------------
function raycast(o,d,maxD){let x=Math.floor(o.x),y=Math.floor(o.y),z=Math.floor(o.z);const sx=Math.sign(d.x),sy=Math.sign(d.y),sz=Math.sign(d.z);const tdx=Math.abs(1/d.x),tdy=Math.abs(1/d.y),tdz=Math.abs(1/d.z);let tx=(sx>0?x+1-o.x:o.x-x)*tdx,ty=(sy>0?y+1-o.y:o.y-y)*tdy,tz=(sz>0?z+1-o.z:o.z-z)*tdz;let face=[0,0,0],t=0;
 for(let i=0;i<64;i++){const id=G.world.get(x,y,z);if(id&&!BLOCKS[id].liquid)return{x,y,z,id,face,t};if(tx<ty&&tx<tz){if(tx>maxD)break;x+=sx;t=tx;tx+=tdx;face=[-sx,0,0]}else if(ty<tz){if(ty>maxD)break;y+=sy;t=ty;ty+=tdy;face=[0,-sy,0]}else{if(tz>maxD)break;z+=sz;t=tz;tz+=tdz;face=[0,0,-sz]}}return null}
const _o=new THREE.Vector3(),_d=new THREE.Vector3();
function lookRay(){_o.set(P.pos.x,P.pos.y+EYE,P.pos.z);_d.set(-Math.sin(P.yaw)*Math.cos(P.pitch),Math.sin(P.pitch),-Math.cos(P.yaw)*Math.cos(P.pitch));return[_o,_d]}
let target=null,targetEnt=null;
function updateTarget(){const[o,d]=lookRay();target=raycast(o,d,5);targetEnt=null;let best=target?target.t:5;
 for(const m of G.mobs){if(m.dead)continue;const aw=Math.max(m.w+.1,.62),ah=Math.max(m.h,1.25);const t=E.rayBox(o,d,{x:m.pos.x-aw,y:m.pos.y-.1,z:m.pos.z-aw},{x:m.pos.x+aw,y:m.pos.y+ah,z:m.pos.z+aw});if(t!==null&&t<Math.min(best,m.boss?5:3.8)){best=t;targetEnt=m}}
 for(const n of G.npcs){const t=E.rayBox(o,d,{x:n.pos.x-.45,y:n.pos.y,z:n.pos.z-.45},{x:n.pos.x+.45,y:n.pos.y+1.9,z:n.pos.z+.45});if(t!==null&&t<Math.min(best,4.5)){best=t;targetEnt=n}}
 if(targetEnt)target=null;outline.visible=!!target&&G.mode==='play';if(target)outline.position.set(target.x+.5,target.y+.5,target.z+.5)}
// ---------------- breaking / placing ----------------
let breaking=null;
function breakTime(id){const b=BLOCKS[id];if(b.hard<0)return Infinity;if(b.hard===0)return .05;const t=heldDef();const right=t&&t.tool&&t.tool===b.tool;const harvest=!b.tier||(right&&t.tier>=b.tier);let time=b.hard*(harvest?1.5:5)/(right?t.speed:1);if(t&&t.tool==='sword'&&(id===B.leaves||id===B.web))time*=.3;if(G.opt.cheat)time*=.08;return Math.max(.05,time)}
function harvestable(id){const b=BLOCKS[id];if(!b.tier)return true;const t=heldDef();return!!(t&&t.tool===b.tool&&t.tier>=b.tier)}
function dropsFor(id){const b=BLOCKS[id];const r=Math.random();if(b.drop===0)return[];if(b.drop==='leaves'){const out=[];if(r<.07)out.push([B.sapling,1]);if(id===B.leaves&&Math.random()<.06)out.push([111,1]);return out}if(b.drop==='grass')return r<.14?[[115,1]]:[];if(b.drop==='wheat')return b.crop===3?[[114,1],[115,1+Math.floor(Math.random()*2)]]:[[115,1]];if(b.drop==='berries')return[[113,2]];return[[b.drop,1]]}
export function breakBlock(x,y,z,byPlayer=true){const w=G.world;const id=w.get(x,y,z);if(!id)return;
 const drops=!byPlayer||harvestable(id)?dropsFor(id):[];w.set(x,y,z,0);for(const[d,n]of drops)E.dropItem(d,n,x+.5,y+.4,z+.5);
 const i=w.idx(x,y,z);const ch=w.meta.get('chest:'+i);if(ch){for(const s of chestSlots(i))if(s)E.dropItem(s.id,s.count,x+.5,y+.5,z+.5,null,s.dur);w.meta.delete('chest:'+i)}
 const kl=w.meta.get('kiln:'+i);if(kl){for(const[a,n]of kl.out)E.dropItem(a,n,x+.5,y+.5,z+.5);for(const[a,n]of kl.q)E.dropItem(a,n,x+.5,y+.5,z+.5);w.meta.delete('kiln:'+i)}
 if(id===B.bed&&P.spawn&&Math.floor(P.spawn.x)===x&&Math.floor(P.spawn.z)===z)P.spawn=null;
 sfx('break',id);E.burst(x+.5,y+.5,z+.5,E.blockColors(id),14,3);
 if(byPlayer){G.stats.mined++;const xp={15:1,16:1,17:2,18:5,37:2}[id];if(xp&&harvestable(id))gainXP(xp)}
 const up=w.get(x,y+1,z);if(up&&(BLOCKS[up].cross||BLOCKS[up].torch))breakBlock(x,y+1,z,false);
 if(id===B.cactus&&w.get(x,y+1,z)===B.cactus)breakBlock(x,y+1,z,false);
 G.growing.delete(i);questCheck()}
function canPlaceAt(x,y,z,id){const w=G.world;if(!w.inb(x,y,z))return false;const cur=w.get(x,y,z);if(cur&&!BLOCKS[cur].liquid&&!BLOCKS[cur].replace)return false;const b=BLOCKS[id];
 if(b.solid){if(x+1>P.pos.x-PW&&x<P.pos.x+PW&&z+1>P.pos.z-PW&&z<P.pos.z+PW&&y+1>P.pos.y&&y<P.pos.y+PH)return false;for(const m of G.mobs)if(x+1>m.pos.x-m.w&&x<m.pos.x+m.w&&z+1>m.pos.z-m.w&&z<m.pos.z+m.w&&y+1>m.pos.y&&y<m.pos.y+m.h)return false;for(const n of G.npcs)if(x+1>n.pos.x-.3&&x<n.pos.x+.3&&z+1>n.pos.z-.3&&z<n.pos.z+.3&&y+1>n.pos.y&&y<n.pos.y+1.8)return false}
 if(b.cross||b.torch){const below=w.get(x,y-1,z);if(!BLOCKS[below].solid)return false;if((b.crop!==undefined||b.sapling||[B.flower_red,B.flower_yellow,B.flower_blue,B.tallgrass,B.berry_bush].includes(id))&&![B.grass,B.dirt,B.gloomgrass,B.snowgrass].includes(below))return false}
 return true}
function placeBlock(id){if(!target)return false;const x=target.x+target.face[0],y=target.y+target.face[1],z=target.z+target.face[2];let pid=id;const it=heldDef();if(it&&it.plants)pid=it.plants;
 if(BLOCKS[target.id].replace&&pid!==B.tallgrass)return placeAt(target.x,target.y,target.z,pid);return placeAt(x,y,z,pid)}
export function placeAt(x,y,z,pid,free){if(!canPlaceAt(x,y,z,pid))return false;const w=G.world;w.set(x,y,z,pid);if(BLOCKS[pid].crop!==undefined){if(w.get(x,y-1,z)!==B.dirt)w.set(x,y-1,z,B.dirt);G.growing.add(w.idx(x,y,z))}if(BLOCKS[pid].sapling)G.growing.add(w.idx(x,y,z));
 if(!G.opt.cheat&&!free){const s=heldStack();if(s){s.count--;if(s.count<=0)P.inv[P.sel]=null}}sfx('place',pid);P.swing=.25;UI.dirty();questCheck();return true}
export function growAt(i,force){const w=G.world;const id=w.data[i];const b=BLOCKS[id];if(!b||id===undefined){G.growing.delete(i);return}const y=Math.floor(i/(w.W*w.D)),r=i-y*w.W*w.D,z=Math.floor(r/w.W),x=r-z*w.W;
 if(b.crop!==undefined){if(b.crop<3){w.set(x,y,z,force?33:id+1);if(force)E.glowBurst(x+.5,y+.5,z+.5,['#e9f7c8','#9ccf5a'],12,2)}if(BLOCKS[w.data[i]].crop===3)G.growing.delete(i)}
 else if(b.sapling){const h=4+Math.floor(Math.random()*2);for(let k=1;k<=h+1;k++)if(w.get(x,y+k,z)!==0)return;w.set(x,y,z,0);for(let k=0;k<h;k++)w.set(x,y+k,z,B.log);for(let ly=h-3;ly<=h+1;ly++){const rr=ly>=h?1:2;for(let dx=-rr;dx<=rr;dx++)for(let dz=-rr;dz<=rr;dz++){if(rr===2&&Math.abs(dx)===2&&Math.abs(dz)===2)continue;if(w.get(x+dx,y+ly,z+dz)===0)w.set(x+dx,y+ly,z+dz,B.leaves)}}G.growing.delete(i);if(force)E.glowBurst(x+.5,y+1,z+.5,['#e9f7c8','#9ccf5a'],16,3)}
 else G.growing.delete(i)}
let growT=0;function updateGrowth(dt){growT+=dt;if(growT<4)return;growT=0;if(G.dim!=='over')return;for(const i of[...G.growing])if(Math.random()<(G.opt.cheat?.9:.18))growAt(i)}
export function chestSlots(i){const w=G.world;let c=w.meta.get('chest:'+i);if(!c){c={slots:new Array(27).fill(null)};w.meta.set('chest:'+i,c)}if(c.items){c.slots=new Array(27).fill(null);c.items.forEach(([id,n],k)=>c.slots[(k*2)%27]={id,count:n,dur:def(id)?.dur});delete c.items}return c.slots}
// ---------------- survival ----------------
const DMG_MUL=[0,.6,1,1.4];export function dmgMul(){return DMG_MUL[G.opt.difficulty]??1}
function armorDef(){let d=0;for(const a of P.armor)if(a)d+=def(a.id).def;return d}
export function hurtPlayer(dmg,from,kb=5){if(P.dead||(G.mode!=='play'))return;if(G.opt.cheat||P.hurtCD>0||dmg<=0)return;const red=1-Math.min(.8,armorDef()*.04);const final=Math.max(.5,dmg*red);P.hp-=final;P.hurtCD=.5;sfx('hurt');UI.flash();
 for(let i=0;i<4;i++){const a=P.armor[i];if(a){a.dur--;if(a.dur<=0){P.armor[i]=null;UI.toast(T('broke',{item:itemName(a.id)}))}}}
 if(from){const dx=P.pos.x-from.x,dz=P.pos.z-from.z,d=Math.hypot(dx,dz)||1;P.vel.x+=dx/d*kb;P.vel.z+=dz/d*kb;P.vel.y=Math.max(P.vel.y,4.5)}
 P.exh+=.3;P.eating=null;UI.dirty();if(P.hp<=0)die()}
export function aoe(pos,r,dmg){const d=Math.hypot(P.pos.x-pos.x,P.pos.z-pos.z),dy=Math.abs(P.pos.y-pos.y);if(d<r&&dy<2.6)hurtPlayer(dmg,pos,7)}
export function explode(x,y,z,r,dmg){sfx('boom');E.burst(x,y,z,['#ffffff','#d8d8d8','#ffb86a','#f2e6c8'],40,9,.18,.9,4);G.shake=.6;const w=G.world;const d=Math.hypot(P.pos.x-x,P.pos.y+.9-y,P.pos.z-z);if(d<r*2)hurtPlayer(dmg*(1-d/(r*2))*dmgMul(),{x,y,z},12);
 for(const m of G.mobs){const md=Math.hypot(m.pos.x-x,m.pos.y-y,m.pos.z-z);if(md<r*1.6&&!m.boss)E.hurtMob(m,10*(1-md/(r*1.6)),{x,z})}
 const R=Math.ceil(r);for(let dy=-R;dy<=R;dy++)for(let dz=-R;dz<=R;dz++)for(let dx=-R;dx<=R;dx++){if(dx*dx+dy*dy+dz*dz>r*r)continue;const bx=Math.floor(x+dx),by=Math.floor(y+dy),bz=Math.floor(z+dz);const id=w.get(bx,by,bz);if(!id||BLOCKS[id].hard<0||BLOCKS[id].liquid||w.isProtected(bx,by,bz))continue;if(Math.random()<.3)for(const[a,n]of dropsFor(id))E.dropItem(a,n,bx+.5,by+.5,bz+.5);w.raw(bx,by,bz,0);w.edits.set(w.idx(bx,by,bz),0);w.markDirty(bx,by,bz)}
 for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)w.updateHM(clamp(Math.floor(x)+dx,0,w.W-1),clamp(Math.floor(z)+dz,0,w.D-1));w.relight(Math.floor(x),Math.floor(z))}
export function gainXP(n){P.xp+=n;let need=10+P.level*7;let up=false;while(P.xp>=need){P.xp-=need;P.level++;need=10+P.level*7;up=true}if(up){sfx('level');UI.banner(T('levelup',{n:P.level}),P.level%2===0&&P.level<=20?T('heartup'):'');if(P.level%2===0)P.hp=Math.min(maxHp(),P.hp+2)}else if(n>0)sfx('xp');UI.dirty()}
function die(){P.dead=true;P.hp=0;G.stats.deaths++;P.eating=null;P.bow=null;
 if(!G.opt.keepInv){for(const s of[...P.inv,...P.armor].filter(Boolean))E.dropItem(s.id,s.count,P.pos.x,P.pos.y+.5,P.pos.z,new THREE.Vector3((Math.random()-.5)*4,3,(Math.random()-.5)*4),s.dur);P.inv.fill(null);P.armor.fill(null)}
 for(const m of[...G.mobs])if(m.boss)E.removeMob(m);E.clearTelegraphs();G.activeBoss=null;UI.boss(null);
 setTimeout(()=>{G.mode='dead';UI.deathScreen()},700)}
export function respawn(){P.dead=false;P.hp=maxHp();P.hunger=Math.max(P.hunger,14);P.sat=4;P.vel.set(0,0,0);P.poison=0;P.slow=0;P.fire=0;P.fallStart=null;
 const sp=P.spawn&&validSpawn()?P.spawn:null;const dim=sp?P.spawnDim:G.dim==='coast'?'coast':'over';if(dim!==G.dim)switchDim(dim,false);
 const s=sp||(dim==='coast'?G.worlds.coast.pois.spawn:G.worlds.over.pois.spawn);P.pos.set(s.x,s.y,s.z);if(!sp)P.pos.y=G.world.surface(s.x,s.z);for(const m of[...G.mobs])if(m.d.hostile&&Math.hypot(m.pos.x-P.pos.x,m.pos.z-P.pos.z)<14)E.removeMob(m);G.mode='play';UI.closePanel(true);UI.dirty();save()}
function validSpawn(){const w=G.worlds[P.spawnDim];if(!w)return false;return w.get(Math.floor(P.spawn.x),Math.floor(P.spawn.y)-1,Math.floor(P.spawn.z))===B.bed}
function eat(s){const d=def(s.id);const f=d.food;P.hunger=Math.min(20,P.hunger+f[0]);P.sat=Math.min(P.hunger,P.sat+f[1]);if(d.heal)P.hp=Math.min(maxHp(),P.hp+d.heal);s.count--;if(s.count<=0)P.inv[P.sel]=null;sfx('burp');UI.dirty()}
// ---------------- NPCs ----------------
function markerTex(ch,col){const c=document.createElement('canvas');c.width=8;c.height=12;const g=c.getContext('2d');g.fillStyle='#2a1d14';if(ch==='!'){g.fillRect(2,0,4,8);g.fillRect(2,9,4,3);g.fillStyle=col;g.fillRect(3,1,2,6);g.fillRect(3,10,2,1)}else{g.fillRect(1,0,6,2);g.fillRect(5,0,3,6);g.fillRect(2,5,4,4);g.fillRect(2,9,4,3);g.fillStyle=col;g.fillRect(2,1,5,1);g.fillRect(6,1,1,4);g.fillRect(3,5,3,1);g.fillRect(3,6,2,2);g.fillRect(3,10,2,1)}const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t}
const MARK={'!':markerTex('!','#ffd23f'),'?':markerTex('?','#7fe07a')};
export function spawnNPCs(){for(const n of G.npcs)scene.remove(n.root);G.npcs=[];if(G.dim==='realm'||!G.world.pois.npcs)return;const list=[...G.world.pois.npcs];if(G.flags.asmonJoined)list.push(G.dim==='coast'?{id:'asmon',x:89.5,y:27,z:49.5}:{id:'asmon',x:134.5,y:25,z:124.5});
 for(const s of list){const model=makeModel(s.id);const root=model.root;
  const mk=new THREE.Sprite(new THREE.SpriteMaterial({map:MARK['!'],depthTest:false,transparent:true}));mk.scale.set(.4,.6,1);mk.position.y=model.height+.6;mk.visible=false;mk.renderOrder=5;root.add(mk);
  root.position.set(s.x,s.y,s.z);scene.add(root);G.npcs.push({id:s.id,npc:true,pos:new THREE.Vector3(s.x,s.y,s.z),home:new THREE.Vector3(s.x,s.y,s.z),yaw:0,root,model,mk,t:Math.random()*9,vel:new THREE.Vector3(),w:.3,h:1.8,wander:2})}}
function updateNPCs(dt){for(const n of G.npcs){n.t+=dt;const dx=P.pos.x-n.pos.x,dz=P.pos.z-n.pos.z,d=Math.hypot(dx,dz);let spd=0;
  if(d<5&&G.mode!=='title'){n.yaw+=angleWrap(Math.atan2(dx,dz)-n.yaw)*Math.min(1,dt*5);n.vel.x*=.5;n.vel.z*=.5}
  else{n.wander-=dt;if(n.wander<=0){n.wander=3+Math.random()*4;const hd=Math.hypot(n.pos.x-n.home.x,n.pos.z-n.home.z);n.wdir=hd>3?Math.atan2(n.home.x-n.pos.x,n.home.z-n.pos.z):Math.random()<.5?Math.random()*6.28:null}if(n.wdir!=null&&n.wander>1.5){spd=1;n.yaw+=angleWrap(n.wdir-n.yaw)*Math.min(1,dt*4);n.vel.x=Math.sin(n.yaw)*spd;n.vel.z=Math.cos(n.yaw)*spd}else{n.vel.x=n.vel.z=0}}
  n.vel.y-=26*dt;E.moveBody(n,dt);if((n.hitX||n.hitZ)&&n.onGround)n.vel.y=7.5;
  n.root.position.copy(n.pos);n.root.rotation.y=n.yaw;animate(n.model,n.t,spd);
  n.model.mat.color.setScalar(Math.min(1,E.lightAt(n.pos.x,n.pos.y+1,n.pos.z)*1.05));
  const st=npcQuestState(n.id);n.mk.visible=!!st&&G.mode==='play';if(st){n.mk.material.map=MARK[st];n.mk.position.y=n.model.height+.6+Math.sin(n.t*3)*.08}}}
// ---------------- quests ----------------
export function curQuest(){return QUESTS[G.quest.i]}
function goalMet(q){const g=q.goal;if(g.type==='have'||g.type==='turnin'){let n=0;for(const id of g.ids)n+=countItem(id);if(n<g.n)return false}if(g.type==='sleep'&&!G.flags.slept)return false;if(g.type==='flag'&&!G.flags[g.flag])return false;if(g.type==='flags'&&!g.flags.every(f=>G.flags[f]))return false;if(g.type==='kills'&&G.stats.kills-(G.quest.k0??G.stats.kills)<g.n)return false;if(g.also)for(const[id,n]of g.also)if(countItem(id)<n)return false;return true}
export function questCheck(){const q=curQuest();if(!q||G.quest.stage!=='active')return;if(goalMet(q)){if(q.id==='asmon'){finishQuest();return}G.quest.stage='ready';sfx('quest');UI.banner(T('questready'),T('returnto',{name:tx(NPC[q.giver].name)}));UI.dirty()}}
// The world where the current quest's giver must be met (offer in q.at, turn-in in q.doneAt); realm counts as Honeyvale's side.
export function questWorld(){const q=curQuest();if(!q)return null;return G.quest.stage==='ready'?q.doneAt:G.quest.stage==='offer'?q.at:null}
export function giverHere(){const w=questWorld();return !w||w===(G.dim==='coast'?'coast':'over')}
function npcQuestState(id){const q=curQuest();if(!q||q.giver!==id||!giverHere())return null;if(G.quest.stage==='offer')return'!';if(G.quest.stage==='ready')return'?';return null}
export function finishQuest(){const q=curQuest();if(!q)return;if(q.goal.type==='turnin'&&!G.opt.cheat)removeItem(q.goal.ids[0],q.goal.n);for(const[id,n]of q.reward){const left=addItem(id,n);if(left)E.dropItem(id,left,P.pos.x,P.pos.y+1,P.pos.z)}if(q.id==='gold')G.flags.shop=true;gainXP(20+G.quest.i*6);G.quest.i++;G.quest.stage='offer';sfx('fanfare');UI.dirty();save()}
export function talkTo(n){const id=n.id;const q=curQuest();const st=npcQuestState(id);
 if(st==='!'){UI.dialog(q.offer.map(t=>({who:id,t})),()=>{G.quest.stage='active';G.quest.k0=G.stats.kills;if(q.goal.type==='sleep')G.flags.slept=false;UI.banner(T('newquest'),tx(q.title));questCheck();UI.dirty()});return}
 if(st==='?'){UI.dialog(q.done.map(t=>({who:id,t})),()=>{finishQuest();const nq=curQuest();if(nq&&nq.giver===id)setTimeout(()=>talkTo(n),350)});return}
 const here=G.dim==='coast'?'coast':'over';if(q&&q.giver===id&&(G.quest.stage==='offer'||G.quest.stage==='ready')&&!giverHere()){const away=(AWAY[id]&&AWAY[id][questWorld()])||[];if(away.length){UI.dialog(away.map(t=>({who:id,t})),null,[{label:T('hint'),fn:()=>UI.toast(T('travelhint',{place:tx(PLACE[questWorld()])}))}]);return}}
 const lines=(IDLE[id]||[]).filter(l=>!l.at||l.at===here);const line=lines[Math.floor(Math.random()*lines.length)];const extra=[];
 if(id==='pooh'&&G.flags.shop)extra.push({label:T('shop'),fn:()=>UI.trade()});
 if(id==='pooping')extra.push({label:T('repair4'),fn:()=>repairHeld()});
 if(q&&G.quest.stage==='active')extra.push({label:T('hint'),fn:()=>UI.toast(tx(q.hint))});
 if(id==='asmon'&&G.flags.finished&&!G.flags.rematch&&G.dim==='over')extra.push({label:T('rematch'),fn:()=>rematch()});
 UI.dialog([{who:id,t:line}],null,extra)}
function repairHeld(){const s=heldStack();const d=s&&def(s.id);if(!d||!d.dur){UI.toast(T('norepair'));return}if(s.dur>=d.dur){UI.toast(T('alreadyfine'));return}if(!G.opt.cheat&&!removeItem(105,4)){UI.toast(T('needcoins',{n:4}));return}s.dur=d.dur;sfx('craft');UI.toast(T('repaired',{item:itemName(s.id)}));UI.dirty()}
export function doTrade(tr){if(!G.opt.cheat){for(const[id,n]of tr.give)if(countItem(id)<n){UI.toast(T('cantafford'));return false}for(const[id,n]of tr.give)removeItem(id,n)}const left=addItem(tr.get[0],tr.get[1]);if(left)E.dropItem(tr.get[0],left,P.pos.x,P.pos.y+1,P.pos.z);sfx('coin');questCheck();return true}
function hd(p){return Math.hypot(P.pos.x-p.x,P.pos.z-p.z)}
const OVER_MARK={trees:1,shrine:1,spire:1,hollow:1,gate:1,ferry:1};const COAST_MARK={boardwalk:1,seaglass:1,murals:1,pierUnder:1};
// Where to travel to reach another world from this one.
function exitTo(dim){if(G.dim==='realm')return G.world.pois.returnGate||{x:48,y:29,z:86};if(G.dim==='coast')return G.world.pois.ferry;if(dim==='coast')return G.worlds.over.pois.ferry;if(dim==='realm')return G.worlds.over.pois.gate;return null}
let sgCache={t:0,p:null};
function nearestSeaGlass(){const now=performance.now();if(now-sgCache.t<1200&&sgCache.p)return sgCache.p;const w=G.world;let best=null,bd=1e9;const px=Math.floor(P.pos.x),pz=Math.floor(P.pos.z);for(let z=Math.max(0,pz-70);z<Math.min(w.D,pz+70);z++)for(let x=40;x<90;x++){const y=w.surface(x,z)-1;if(w.get(x,y,z)===B.seaglass_sand){const d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;best={x:x+.5,y,z:z+.5}}}}sgCache={t:now,p:best};return best}
export function objectivePos(){const q=curQuest();if(!q)return null;const npcPos=id=>{const n=G.npcs.find(n=>n.id===id);if(n)return n.pos;const p=G.world.pois.npcs?.find(n=>n.id===id);return p};
 if(G.quest.stage!=='active'){if(G.dim==='realm')return exitTo('over');if(!giverHere())return exitTo(questWorld());return npcPos(q.giver)}
 const want=OVER_MARK[q.marker]?'over':COAST_MARK[q.marker]?'coast':q.marker==='arena'?'realm':G.dim;
 if(q.marker==='ferry'&&G.dim==='over'){const f=G.world.pois.ferry;return f}
 if(want!==G.dim&&q.marker!=='arena')return exitTo(want);
 const cp=G.world.pois;switch(q.marker){case'boardwalk':return hd(cp.pierUnder)<30?cp.pierUnder:{x:91.5,y:24,z:Math.max(120,Math.min(200,P.pos.z))};case'seaglass':return nearestSeaGlass();case'murals':{let b=null,bd=1e9;cp.murals.forEach((m,k)=>{if(G.flags['mural'+k])return;const d=hd(m);if(d<bd){bd=d;b=m}});return b}case'pierUnder':return hd(cp.pierUnder)<16||P.pos.y<DECKY()?cp.pierUnder:cp.pierUnder.door}
 const ov=G.worlds.over.pois;switch(q.marker){case'trees':return G.treeSpot;case'shrine':return G.dim==='over'?(hd(ov.shrine.door)<10?ov.shrine:ov.shrine.door):null;case'spire':return G.dim==='over'?(hd(ov.spire.door)<6||P.pos.y>ov.spire.y-12?ov.spire:ov.spire.door):null;case'hollow':return G.dim==='over'?(hd(ov.hollow.door)<8||P.pos.y<ov.hollow.door.y-6?ov.hollow:ov.hollow.door):null;case'gate':return G.dim==='over'?ov.gate:null;case'arena':return G.dim==='over'?ov.gate:G.dim==='coast'?exitTo('over'):G.worlds.realm.pois.arena}return null}
const DECKY=()=>25;
// ---------------- bosses & gate ----------------
G.activeBoss=null;
function updateBossTriggers(){if(G.activeBoss){const m=G.activeBoss;if(!G.mobs.includes(m)){G.activeBoss=null;UI.boss(null)}else{UI.boss(m);if(Math.hypot(P.pos.x-m.pos.x,P.pos.z-m.pos.z)>48){E.removeMob(m);G.activeBoss=null;UI.boss(null)}}return}
 const w=G.world;for(const[key,bd]of Object.entries(BOSSES)){if(G.bossesDown[key]&&!(key==='asmon'&&G.flags.rematch))continue;const poi=w.pois[bd.poi];if(!poi||!poi.box)continue;const b=poi.box;if(P.pos.x>=b[0]&&P.pos.x<=b[3]+1&&P.pos.z>=b[2]&&P.pos.z<=b[5]+1&&P.pos.y>=b[1]-1&&P.pos.y<=b[4]+1){
  const sx=poi.x+.5,sz=key==='asmon'?poi.z-6:poi.z+.5;const m=E.spawnMob(key,sx,poi.y+.2,sz);m.yaw=Math.atan2(P.pos.x-sx,P.pos.z-sz);G.activeBoss=m;sfx('roar');UI.bossIntro(tx(bd.name),tx(BOSS_LINES[key]));return}}}
export function onBossDefeated(m){const key=m.type;G.bossesDown[key]=true;{const id=BOSSES[key].drop;const left=addItem(id,1);if(left)E.dropItem(id,1,P.pos.x,P.pos.y+1,P.pos.z);else UI.pickup(id,1);questCheck()}for(let i=0;i<10;i++)E.dropItem(105,1,m.pos.x,m.pos.y+1,m.pos.z);E.dropItem(112,3,m.pos.x,m.pos.y+1,m.pos.z);gainXP(m.d.xp);sfx('shard');UI.banner(T('bossdown'),tx(BOSSES[key].name));E.glowBurst(m.pos.x,m.pos.y+1.5,m.pos.z,['#ffd25a','#ffffff','#ffb52e'],40,6,1.4);save()}
export function onAsmonYield(m){G.flags.asmonDown=true;G.bossesDown.asmon=true;E.clearTelegraphs();for(const x of[...G.mobs])if(x!==m&&x.d.hostile)E.hurtMob(x,999,null);sfx('shard');
 if(G.flags.asmonJoined){G.flags.rematch=false;setTimeout(()=>UI.dialog([{who:'asmon',t:{en:'Again?! Fine, fine, you win. See you back in the village.',ja:'またか！わかったわかった、おまえの勝ちだ。村で会おう。'}}],()=>{E.removeMob(m);G.activeBoss=null;UI.boss(null);addItem(105,30);save()}),700);return}
 setTimeout(()=>UI.dialog(ASMON_JOIN,()=>{E.removeMob(m);G.activeBoss=null;UI.boss(null);G.flags.asmonJoined=true;addItem(164,1);questCheck();startEnding()}),900)}
export function bossPhase(m,ph){if(ph>1){UI.banner(T('phase',{n:ph}),'');sfx('roar');G.shake=.4}}
export function insertShard(i){const w=G.world;const g=w.pois.gate;if(!g)return;const k=g.sockets.findIndex(s=>w.idx(...s)===i);if(k<0)return;const sk=G.flags.sockets||(G.flags.sockets=[0,0,0]);if(sk[k]){UI.toast(T('socketfull'));return}
 const shard=[160,161,162].find(id=>countItem(id)>0);if(!shard){UI.toast(T('needshard'));return}removeItem(shard,1);sk[k]=shard;sfx('shard');E.glowBurst(g.sockets[k][0]+.5,g.sockets[k][1]+1,g.sockets[k][2]+.5,['#ffd25a','#ffffff'],20,3);refreshSocketGems();if(sk.every(Boolean))openGate();save()}
let socketGems=[];function refreshSocketGems(){for(const m of socketGems)scene.remove(m);socketGems=[];if(G.dim!=='over')return;const g=G.world.pois.gate;const sk=G.flags.sockets||[];g.sockets.forEach((s,k)=>{if(!sk[k])return;const m=E.itemMesh(sk[k]);m.scale.setScalar(.6);m.position.set(s[0]+.5,s[1]+1.5,s[2]+.5);scene.add(m);socketGems.push(m)})}
export function openGate(){const w=G.worlds.over;const[a,b,c,d,e]=w.pois.gate.inner;for(let y=b;y<=e;y++)for(let x=a;x<=d;x++)w.set(x,y,c,B.portal,false);G.flags.gateOpen=true;sfx('portal');UI.banner(T('gateopen'),'');questCheck()}
function ensureGateState(){if(G.flags.gateOpen){const w=G.worlds.over;const[a,b,c,d,e]=w.pois.gate.inner;for(let y=b;y<=e;y++)for(let x=a;x<=d;x++)w.raw(x,y,c,B.portal)}}
function ensureRealmGate(){const w=G.worlds.realm;const[a,b,c,d,e]=w.pois.returnGate.inner;for(let y=b;y<=e;y++)for(let x=a;x<=d;x++)w.raw(x,y,c,B.portal)}
let portalCD=0;function checkPortal(dt){portalCD-=dt;if(portalCD>0)return;if(E.boxHas(P.pos.x,P.pos.y,P.pos.z,PW,PH,i=>i===B.portal)){portalCD=3;sfx('portal');UI.fadeFlash();switchDim(G.dim==='over'?'realm':'over',true)}}
export function switchDim(dim,place){const from=G.dim;if(dim==='realm'&&!G.worlds.realm){G.worlds.realm=generateRealm();applySavedWorld('realm');ensureRealmGate();G.worlds.realm.lightAll()}
 if(dim==='coast'&&!G.worlds.coast){G.worlds.coast=generateCoast();applySavedWorld('coast');G.worlds.coast.lightAll()}
 E.clearEntities();G.activeBoss=null;UI.boss(null);disposeAllChunks();G.dim=dim;G.world=G.worlds[dim];G.world.dirty.clear();if(G.world.urgent)G.world.urgent.clear();
 ocean.visible=dim!=='realm';clouds.visible=dim!=='realm';
 if(place){if(dim==='realm'){const s=G.world.pois.spawn;P.pos.set(s.x,s.y,s.z);P.yaw=0}else if(dim==='coast'){const s=G.world.pois.spawn;P.pos.set(s.x,s.y,s.z);P.yaw=-Math.PI/2}else if(from==='coast'){const f=G.world.pois.ferry.stand;P.pos.set(f.x,f.y,f.z);P.yaw=-Math.PI/2}else{const g=G.world.pois.gate;P.pos.set(g.x+2,g.y,g.z+3.5);P.yaw=Math.PI}}
 P.vel.set(0,0,0);P.fallStart=null;spawnNPCs();refreshSocketGems();updateChunks(400,P.pos.x,P.pos.z);G.region=null;if(dim==='realm'&&place)UI.banner(T('realm'),T('realmsub'));if(dim==='coast'&&place){UI.banner(T('coast'),T('coastsub'));G.region='ferry'}
 if(G.mode==='play')setMood(dim==='realm'?'realm':isNight()?'night':'day')}
// Ferry: ring the bell to sail between Honeyvale and the Coast.
function sail(){if(G.sailing)return;G.sailing=true;sfx('level');UI.toast(T('sailing'));const to=G.dim==='coast'?'over':'coast';setTimeout(()=>{G.sailing=false;switchDim(to,true);if(to==='coast'&&!G.flags.coastVisited){G.flags.coastVisited=true;questCheck()}if(to==='over')UI.banner(T('honeyvale'),T('honeyvalesub'));save()},QA?50:700)}
// Region banners on the Coast (one continuous shoreline: Santa Monica north, Venice south)
function updateRegion(){if(G.dim!=='coast')return;const r=G.world.pois.regions.find(r=>P.pos.z>=r.z0&&P.pos.z<=r.z1);if(!r||r.name===G.region)return;G.region=r.name;const k=r.name==='ferry'?'ferryreg':r.name;UI.banner(T(k),T(k==='ferryreg'?'ferrysub':k+'sub'))}
let lastKills=-1;function trackKills(){const q=curQuest();if(q&&q.goal.type==='kills'&&G.quest.stage==='active'){const n=Math.min(q.goal.n,G.stats.kills-(G.quest.k0??G.stats.kills));if(n!==lastKills){if(lastKills>=0&&n>lastKills)UI.toast(T('killsleft',{n,m:q.goal.n}));lastKills=n;questCheck()}}else lastKills=-1}
// ---------------- mob spawning ----------------
let spawnT=0;function updateSpawning(dt){spawnT-=dt;if(spawnT>0)return;spawnT=.8;const w=G.world;updateRegion();trackKills();
 const hostile=G.mobs.filter(m=>m.d.hostile&&!m.boss).length,sheep=G.mobs.filter(m=>m.type==='sheep').length;
 if(w.kind==='over'&&sheep<8){const a=Math.random()*6.28,r=20+Math.random()*30;const x=P.pos.x+Math.cos(a)*r,z=P.pos.z+Math.sin(a)*r;const y=w.surface(x,z);if(w.get(Math.floor(x),y-1,Math.floor(z))===B.grass&&Math.hypot(x-128,z-128)>24&&!w.get(Math.floor(x),y,Math.floor(z)))E.spawnMob('sheep',x,y,z)}
 if(G.opt.difficulty===0||G.activeBoss)return;const cap=[0,9,13,18][G.opt.difficulty];if(hostile>=cap)return;
 for(let tries=0;tries<4;tries++){const a=Math.random()*6.28,r=14+Math.random()*26;const x=Math.floor(P.pos.x+Math.cos(a)*r),z=Math.floor(P.pos.z+Math.sin(a)*r);if(!w.inb(x,1,z))continue;
  let y;if(Math.random()<.5){y=w.surface(x+.5,z+.5)}else{y=Math.floor(P.pos.y)+Math.floor(Math.random()*24)-12;let ok=false;for(let k=0;k<10;k++,y--){if(y>0&&!w.get(x,y,z)&&!w.get(x,y+1,z)&&BLOCKS[w.get(x,y-1,z)].solid){ok=true;break}}if(!ok)continue}
  if(y<1||w.get(x,y,z)||w.get(x,y+1,z)||!BLOCKS[w.get(x,y-1,z)].solid)continue;
  if(w.kind==='over'&&(Math.hypot(x-128,z-128)<30||w.isProtected(x,y,z)))continue;
  const pu=w.pois.pierUnder,under=w.kind==='coast'&&pu&&x>=pu.box[0]&&x<=pu.box[3]&&z>=pu.box[2]&&z<=pu.box[5]&&y<=pu.box[4]&&!G.bossesDown.tidecrab;if(w.kind==='coast'&&(Math.hypot(x-w.pois.spawn.x,z-w.pois.spawn.z)<14||(!under&&w.isProtected(x,y,z))||(w.get(x,y-1,z)===B.water)))continue;
  const sky=w.skyAt(x,y,z)*G.day,blk=w.blkAt(x,y,z);if(blk>3||(sky>4.5&&!under))continue;if(Math.hypot(x-P.pos.x,y-P.pos.y,z-P.pos.z)<12)continue;
  const bi=w.kind==='over'?w.biome[z*w.W+x]:9;const r2=Math.random();let type=r2<.42?'gloomie':r2<.62?'archer':r2<.82?'spider':'popshroom';if(bi===4&&Math.random()<.4)type='spider';if(bi===3&&Math.random()<.4)type='archer';if(w.kind==='realm')type=Math.random()<.5?'gilded':'archer';if(w.kind==='coast'){const r3=Math.random();type=under?(r3<.6?'crab':'gloomie'):r3<.4?'crab':r3<.75?'gloomie':'archer'}
  E.spawnMob(type,x+.5,y,z+.5);break}}
// ---------------- day / night ----------------
const DAY_LEN=720;
function daylight(c){return clamp(.5+Math.sin(c*Math.PI*2)*2.4,0,1)}
const COL={day:new THREE.Color(0x8fc6ff),dusk:new THREE.Color(0xf2a26a),night:new THREE.Color(0x0c1230),realm:new THREE.Color(0x5a3f7a),cave:new THREE.Color(0x101018)};const _sky=new THREE.Color();
function updateSky(dt){if(G.dim==='realm'){G.day=.85;_sky.copy(COL.realm);sun.visible=moon.visible=false;stars.material.opacity=.6}else{const dl=daylight(G.clock);G.day=.16+dl*.84;const s=Math.sin(G.clock*Math.PI*2);const duskAmt=clamp(1-Math.abs(s)*4,0,1);_sky.copy(COL.night).lerp(COL.day,dl).lerp(COL.dusk,duskAmt*.55);sun.visible=moon.visible=true;stars.material.opacity=clamp(1-dl*1.6,0,1)}
 if(G.mode==='play'&&P.pos.y<SEA-6&&G.world.skyAt(Math.floor(P.pos.x),Math.floor(P.pos.y+1.6),Math.floor(P.pos.z))<6)_sky.lerp(COL.cave,.65);
 scene.background=_sky;scene.fog.color.copy(_sky);MAT.uniforms.uFogColor.value.copy(_sky);MAT.uniforms.uDay.value=G.day;G.bright=G.opt.cheat?.12:0;MAT.uniforms.uBright.value=G.bright;
 const far=G.opt.view*16*.92;MAT.uniforms.uFogNear.value=far*.55;MAT.uniforms.uFogFar.value=far;scene.fog.near=far*.55;scene.fog.far=far;if(Math.abs(camera.far-(far+40))>1){camera.far=far+40;camera.updateProjectionMatrix()}
 const a=G.clock*Math.PI*2;skyGroup.position.copy(camera.position);sun.position.set(Math.cos(a)*150,Math.sin(a)*150,-30);moon.position.set(-Math.cos(a)*150,-Math.sin(a)*150,-30);sun.lookAt(camera.position);moon.lookAt(camera.position);
 clouds.material.opacity=.25+G.day*.55;clouds.position.x=camera.position.x;clouds.position.z=camera.position.z;cloudTex.offset.set(camera.position.x/256+G.time*.0012,-camera.position.z/256)}
export function isNight(){return G.dim!=='realm'&&Math.sin(G.clock*Math.PI*2)<-.05}
// ---------------- player update ----------------
let footT=0,lastHitX=false,lastHitZ=false;
function updatePlayer(dt){const w=G.world;if(P.dead)return;
 P.hurtCD-=dt;P.atkCD-=dt;P.slow-=dt;P.swing=Math.max(0,P.swing-dt);
 const inW=!!E.boxHas(P.pos.x,P.pos.y+.1,P.pos.z,PW,1.2,id=>BLOCKS[id].liquid);P.inWater=inW;const inWeb=!!E.boxHas(P.pos.x,P.pos.y,P.pos.z,PW,PH,id=>id===B.web);
 let f=0,s=0;const k=input.keys;if(k.KeyW||k.ArrowUp)f+=1;if(k.KeyS||k.ArrowDown)f-=1;if(k.KeyA||k.ArrowLeft)s-=1;if(k.KeyD||k.ArrowRight)s+=1;f+=-input.stickY;s+=input.stickX;const mag=Math.min(1,Math.hypot(f,s));if(mag>0){const n=Math.hypot(f,s);f=f/n*mag;s=s/n*mag}
 const sneak=input.sneak||k.ShiftLeft;const sprint=(input.sprint||k.ControlLeft||(isTouch&&Math.hypot(input.stickX,input.stickY)>.97))&&P.hunger>6&&!sneak&&f>.5;
 let spd=sneak?1.4:sprint?5.7:4.3;if(inW)spd*=.55;if(inWeb)spd*=.22;if(P.slow>0)spd*=.5;if(P.eating||P.bow)spd*=.35;
 const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw);const tvx=(fx*f+rx*s)*spd,tvz=(fz*f+rz*s)*spd;const acc=P.onGround?16:5;
 P.vel.x+=(tvx-P.vel.x)*Math.min(1,acc*dt);P.vel.z+=(tvz-P.vel.z)*Math.min(1,acc*dt);
 const jumpHeld=input.jump||k.Space;
 if(inW){P.vel.y-=7*dt;if(jumpHeld)P.vel.y=Math.min(P.vel.y+22*dt,3.2);P.vel.y=Math.max(P.vel.y,-3);P.fallStart=null}else if(inWeb){P.vel.y=Math.max(P.vel.y-6*dt,-1);P.fallStart=null}else P.vel.y-=28*dt;
 if(P.onGround&&!inW){if(jumpHeld){P.vel.y=8.6;P.exh+=sprint?.2:.05}else if(G.opt.autojump&&mag>.2&&(lastHitX||lastHitZ)){const ax=Math.floor(P.pos.x+(fx*f+rx*s)*.7),az=Math.floor(P.pos.z+(fz*f+rz*s)*.7),ay=Math.floor(P.pos.y+.1);if(BLOCKS[w.get(ax,ay,az)].solid&&!BLOCKS[w.get(ax,ay+1,az)].solid&&!BLOCKS[w.get(ax,ay+2,az)].solid&&!E.boxHits(P.pos.x,P.pos.y+1.05,P.pos.z,PW,PH))P.vel.y=8.6}}
 if(inW&&(lastHitX||lastHitZ)&&jumpHeld)P.vel.y=5;
 const wasGround=P.onGround,prevY=P.pos.y,ox=P.pos.x,oz=P.pos.z;E.moveBody(P,dt);lastHitX=P.hitX;lastHitZ=P.hitZ;
 if(sneak&&wasGround&&!inW&&!P.onGround&&P.vel.y<=0){P.pos.x=ox;P.pos.z=oz;P.pos.y=prevY;P.vel.set(0,0,0);P.onGround=true}
 if(!P.onGround&&!inW){P.fallStart=Math.max(P.fallStart??P.pos.y,P.pos.y)}if(P.onGround&&P.fallStart!==null){const fall=P.fallStart-P.pos.y;P.fallStart=null;if(fall>3.4&&!inW)hurtPlayer(Math.floor(fall-3),null,0)}
 const below=w.get(Math.floor(P.pos.x),Math.floor(P.pos.y-.2),Math.floor(P.pos.z));if(below===B.magma&&!sneak){P.fire=(P.fire||0)+dt;if(P.fire>.6){P.fire=0;hurtPlayer(2,null,0)}}
 if(E.boxHas(P.pos.x,P.pos.y,P.pos.z,PW+.06,PH,id=>id===B.cactus))hurtPlayer(1,null,2);
 if(P.poison>0){P.poison-=dt;P.pt=(P.pt||0)+dt;if(P.pt>1){P.pt=0;if(P.hp>1&&!G.opt.cheat){P.hp-=1;UI.flash();UI.dirty()}}}
 if(P.pos.y<-5)hurtPlayer(100,null);
 const hs=Math.hypot(P.vel.x,P.vel.z);if(P.onGround&&hs>.5){P.bob+=dt*hs*2.1;footT-=dt*hs;if(footT<=0){footT=sprint?1.9:2.3;sfx('step',below)}}
 P.exh+=dt*(.006+(hs>.5?.012:0)+(sprint?.06:0));if(P.exh>=4){P.exh-=4;if(P.sat>0)P.sat=Math.max(0,P.sat-1);else if(!G.opt.cheat)P.hunger=Math.max(0,P.hunger-1);UI.dirty()}
 const mh=maxHp();if(P.hunger>=18&&P.hp<mh){P.regen+=dt;if(P.regen>3){P.regen=0;P.hp=Math.min(mh,P.hp+1);P.exh+=2.5;UI.dirty()}}else if(P.hunger>=10&&G.opt.difficulty<=1&&P.hp<mh){P.regen+=dt*.4;if(P.regen>3){P.regen=0;P.hp=Math.min(mh,P.hp+1);P.exh+=2;UI.dirty()}}
 if(P.hunger<=0){P.starve+=dt;if(P.starve>4){P.starve=0;if(P.hp>1){P.hp-=1;UI.flash();UI.dirty()}}}
 if(G.opt.cheat){P.hp=mh;P.hunger=20}
 checkPortal(dt)}
// ---------------- actions ----------------
let useHoldT=0;
function weaponCD(d){if(!d||!d.tool)return .32;return d.tool==='sword'?.55:d.tool==='axe'?.85:.4}
export function doAttack(){if(!targetEnt||targetEnt.npc)return false;if(P.atkCD>0)return true;const d=heldDef();let dmg=d&&d.dmg?d.dmg:1;const crit=!P.onGround&&P.vel.y<-1;if(crit){dmg*=1.5;E.glowBurst(targetEnt.pos.x,targetEnt.pos.y+targetEnt.h*.7,targetEnt.pos.z,['#fff6a8','#ffffff'],8,3,.5)}if(G.opt.cheat)dmg*=3;
 E.hurtMob(targetEnt,dmg,P.pos,targetEnt.boss?0:6.5);P.atkCD=weaponCD(d);P.swing=.3;sfx('swing');if(d&&d.dur)useDurability(d.tool==='sword'?1:2);P.exh+=.1;return true}
function updateActions(dt){updateTarget();
 const attacking=input.attack||input.mouseL;
 if(attacking){if(targetEnt&&!targetEnt.npc){doAttack();breaking=null}
  else if(target){const key=target.x+','+target.y+','+target.z;if(!breaking||breaking.key!==key)breaking={key,x:target.x,y:target.y,z:target.z,id:target.id,t:0,need:breakTime(target.id),snd:0};
   breaking.t+=dt;breaking.snd-=dt;if(breaking.snd<=0){breaking.snd=.24;sfx('hit_block',breaking.id);P.swing=.25;E.burst(target.x+.5+target.face[0]*.52,target.y+.5+target.face[1]*.52,target.z+.5+target.face[2]*.52,E.blockColors(breaking.id),3,1.5,.07,.4)}
   if(breaking.t>=breaking.need){const bid=breaking.id;breakBlock(breaking.x,breaking.y,breaking.z);const d=heldDef();if(d&&d.dur&&BLOCKS[bid].hard>0)useDurability(d.tool==='sword'?2:1);P.exh+=.025;breaking=null}}
  else{breaking=null;if(P.swing<=0&&input.attackEdge){P.swing=.3;sfx('swing')}}}
 else breaking=null;input.attackEdge=false;
 crack.visible=!!breaking&&breaking.need<1e6;if(crack.visible){crack.position.set(breaking.x+.5,breaking.y+.5,breaking.z+.5);crackTex.offset.x=Math.min(9,Math.floor(breaking.t/breaking.need*10))/10}
 const s=heldStack(),d=heldDef();
 if(input.useEdge){input.useEdge=false;useHoldT=0;onUse()}
 if(input.use){useHoldT+=dt;
  if(P.eating){P.eating.t+=dt;if(Math.floor(P.eating.t*5)!==Math.floor((P.eating.t-dt)*5))sfx('eat');if(P.eating.t>=1){const st=heldStack();if(st&&st.id===P.eating.id)eat(st);P.eating=null}}
  if(P.bow)P.bow.t=Math.min(1.1,P.bow.t+dt);
  if(!P.eating&&!P.bow&&useHoldT>.3&&s&&(isBlock(s.id)||d.plants)&&target){useHoldT=0;placeBlock(s.id)}}
 else{if(P.bow){const ch=Math.min(1,P.bow.t);if(ch>.15&&(G.opt.cheat||removeItem(109,1))){const[o,dv]=lookRay();const sp=10+22*ch;E.fire('arrow',o.x+dv.x*.5,o.y+dv.y*.5-.1,o.z+dv.z*.5,dv.x*sp,dv.y*sp+1,dv.z*sp,'player',2+Math.round(7*ch));sfx('shoot');useDurability(1)}P.bow=null}P.eating=null}
 UI.action(contextLabel())}
function contextLabel(){if(targetEnt&&targetEnt.npc)return T('talkto',{name:tx(NPC[targetEnt.id].name)});const n=nearestNPC();if(n)return T('talkto',{name:tx(NPC[n.id].name)});if(!target)return'';const id=target.id;if(id===B.workbench)return T('usebench');if(id===B.kiln||id===B.kiln_lit)return T('usekiln');if(id===B.chest)return T('openchest');if(id===B.bed)return T('sleep');if(id===B.socket)return T('setshard');if(id===B.ferry_bell)return T('ringbell');if(G.dim==='coast'&&(G.world.pois.murals||[]).some(m=>target.x>=m.box[0]&&target.x<=m.box[3]&&target.y>=m.box[1]&&target.y<=m.box[4]&&target.z>=m.box[2]&&target.z<=m.box[5]))return T('viewmural');return''}
function nearestNPC(){let best=null,bd=3;for(const n of G.npcs){const d=Math.hypot(n.pos.x-P.pos.x,n.pos.z-P.pos.z);if(d<bd&&Math.abs(n.pos.y-P.pos.y)<2){bd=d;best=n}}return best}
export function interactNearest(){updateTarget();if(targetEnt&&targetEnt.npc){talkTo(targetEnt);return true}const n=nearestNPC();if(n){talkTo(n);return true}if(target&&interactBlock(target))return true;return false}
function interactBlock(t){const w=G.world,id=t.id,i=w.idx(t.x,t.y,t.z);
 if(id===B.workbench){UI.inventory('craft');return true}
 if(id===B.kiln||id===B.kiln_lit){UI.kiln(i);return true}
 if(id===B.chest){UI.chest(i);return true}
 if(id===B.bed){trySleep(t);return true}
 if(id===B.socket){insertShard(i);return true}
 if(id===B.ferry_bell){sail();return true}
 const muralK=G.dim==='coast'?(G.world.pois.murals||[]).findIndex(m=>t.x>=m.box[0]&&t.x<=m.box[3]&&t.y>=m.box[1]&&t.y<=m.box[4]&&t.z>=m.box[2]&&t.z<=m.box[5]):-1;
 if(muralK>=0){const k=muralK;if(!G.flags['mural'+k]){G.flags['mural'+k]=true;sfx('level');E.glowBurst(t.x+.5,t.y+.5,t.z+.5,['#ffd25a','#ff6fb0','#5ad0ff'],20,3,.8)}const n=[0,1,2,3].filter(j=>G.flags['mural'+j]).length;UI.toast(T('muralseen',{n}));questCheck();return true}
 return false}
export function onUse(){const s=heldStack(),d=heldDef();
 if(targetEnt&&targetEnt.npc){talkTo(targetEnt);return}
 if(target&&!(input.keys.ShiftLeft||input.sneak)&&interactBlock(target))return;
 if(d&&d.grow&&target){const i=G.world.idx(target.x,target.y,target.z);const b=BLOCKS[target.id];if(b.crop!==undefined||b.sapling){growAt(i,true);if(!G.opt.cheat){s.count--;if(s.count<=0)P.inv[P.sel]=null}UI.dirty();return}}
 const food=d&&(d.food);if(food){if(P.hunger<20||(d.heal&&P.hp<maxHp())||G.opt.cheat)P.eating={t:0,id:s.id};else UI.toast(T('nothungry'));return}
 if(d&&d.bow){if(countItem(109)>0||G.opt.cheat){P.bow={t:0};sfx('bow')}else UI.toast(T('noarrows'));return}
 if(s&&(isBlock(s.id)||d.plants)&&target){placeBlock(s.id);return}
 if(d&&d.armor!==undefined){equipFromSlot(P.sel);return}
 if(!target&&!targetEnt)interactNearest()}
export function equipFromSlot(i){const s=P.inv[i];if(!s)return;const d=def(s.id);if(d.armor===undefined)return;const old=P.armor[d.armor];P.armor[d.armor]=s;P.inv[i]=old;sfx('place',B.iron_block);UI.dirty()}
export function unequip(k){const a=P.armor[k];if(!a)return;const idx=P.inv.findIndex(x=>!x);if(idx<0){UI.toast(T('invfull'));return}P.inv[idx]=a;P.armor[k]=null;UI.dirty()}
export function trySleep(t){P.spawn={x:t.x+.5,y:t.y+1,z:t.z+.5};P.spawnDim=G.dim;if(!isNight()){UI.toast(T('spawnset'));return}
 if(G.mobs.some(m=>m.d.hostile&&Math.hypot(m.pos.x-P.pos.x,m.pos.z-P.pos.z)<8)){UI.toast(T('monstersnear'));return}
 sfx('sleep');G.mode='sleep';UI.sleepFade(()=>{G.clock=.02;G.flags.slept=true;for(const m of[...G.mobs])if(m.d.hostile&&!m.boss)E.removeMob(m);G.mode='play';UI.toast(T('goodmorning'));questCheck();save()})}
// ---------------- camera & hand ----------------
const playerModel=makeModel('pinco');playerModel.root.visible=false;scene.add(playerModel.root);
let handMesh=null,handId=-2;
function makeHand(id){if(handMesh)handScene.remove(handMesh);handId=id;let m;if(id<0){m=new THREE.Mesh(new THREE.BoxGeometry(.16,.16,.3),new THREE.MeshBasicMaterial({color:0xf2a3c1}));m.material.userData.base=new THREE.Color(0xf2a3c1);const sl=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.42),new THREE.MeshBasicMaterial({color:0x9b9ba4}));sl.material.userData.base=new THREE.Color(0x9b9ba4);sl.position.z=.34;m.add(sl);m.userData.paw=true}else{m=E.itemMesh(id);const blk=id<100&&!BLOCKS[id].cross&&!BLOCKS[id].torch;m.userData.blk=blk;m.scale.setScalar(blk?.3:.3)}handMesh=m;handScene.add(m)}
function updateHand(){const s=heldStack();const id=s?s.id:-1;if(id!==handId)makeHand(id);const m=handMesh;const sw=P.swing>0?Math.sin((.3-P.swing)/.3*Math.PI):0;const bob=G.opt.reduced?0:Math.sin(P.bob)*.02,bobY=G.opt.reduced?0:Math.abs(Math.cos(P.bob))*.02;
 if(m.userData.paw){m.position.set(.36+bob,-.3+bobY+sw*.1,-.62-sw*.15);m.rotation.set(.25-sw*.9,.2,0)}
 else if(m.userData.blk){m.position.set(.42+bob,-.38+bobY+sw*.12,-.62-sw*.2);m.rotation.set(.1-sw*.8,.7,0)}
 else{m.position.set(.42+bob,-.36+bobY+sw*.05,-.7-sw*.15);m.rotation.set(-sw*1.3,-.4,.25);if(P.eating){m.position.set(.15,-.25+Math.sin(P.eating.t*25)*.03,-.45);m.rotation.set(.4,0,0)}if(P.bow){m.position.set(.1,-.25,-.5+Math.min(1,P.bow.t)*.08);m.rotation.set(0,-1.2,0)}}
 const l=Math.min(1,E.lightAt(P.pos.x,P.pos.y+1.6,P.pos.z)*1.08);const lit=o=>{const b=o.material.userData.base;if(b)o.material.color.copy(b).multiplyScalar(l);else o.material.color.setScalar(l)};lit(m);for(const c of m.children)lit(c)}
const _tp=new THREE.Vector3(),_back=new THREE.Vector3();
function updateCamera(dt){const eye=P.pos.y+EYE-((input.sneak||input.keys.ShiftLeft)?.12:0);const bobY=G.opt.reduced?0:Math.abs(Math.sin(P.bob))*.06,bobX=G.opt.reduced?0:Math.cos(P.bob)*.035;
 const shake=G.shake>0&&!G.opt.reduced?(Math.random()-.5)*G.shake*.3:0;G.shake=Math.max(0,(G.shake||0)-dt);
 camera.rotation.set(P.pitch,P.yaw,0);
 if(G.view===0){camera.position.set(P.pos.x+bobX*Math.cos(P.yaw),eye+bobY+shake,P.pos.z-bobX*Math.sin(P.yaw));playerModel.root.visible=false}
 else{const back=G.view===1?1:-1;const[o,d]=lookRay();_back.set(-d.x*back,-d.y*back,-d.z*back);let dist=4;const hit=raycast(o,_back,4);if(hit)dist=Math.max(.6,hit.t-.3);camera.position.set(o.x+_back.x*dist,o.y+_back.y*dist+shake,o.z+_back.z*dist);if(back<0)camera.lookAt(o);playerModel.root.visible=!P.dead}
 playerModel.root.position.copy(P.pos);playerModel.root.rotation.y=P.yaw+Math.PI;animate(playerModel,G.time,Math.hypot(P.vel.x,P.vel.z));const pm=playerModel.parts;if(P.swing>0)pm.armR.rotation.x=-Math.sin((.3-P.swing)/.3*Math.PI)*1.6;pm.head.rotation.x=-P.pitch*.7;
 playerModel.mat.color.setScalar(Math.min(1,E.lightAt(P.pos.x,P.pos.y+1,P.pos.z)*1.05));if(P.hurtCD>.3)playerModel.mat.color.setRGB(1,.4,.4);
 for(const g of socketGems)g.rotation.y+=dt*1.5}
// ---------------- resize ----------------
function resize(){const w=innerWidth,h=innerHeight;const dpr=Math.min(devicePixelRatio||1,isTouch?1.6:2);renderer.setPixelRatio(dpr);renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<h?80:72;camera.updateProjectionMatrix();handCam.aspect=w/h;handCam.fov=w<h?74:60;handCam.updateProjectionMatrix();document.body.classList.toggle('portrait',w<h);document.body.classList.toggle('touch',isTouch)}
addEventListener('resize',resize);resize();
// ---------------- input ----------------
const look=(dx,dy)=>{const s=.0026*G.opt.sens;P.yaw-=dx*s;P.pitch=clamp(P.pitch-dy*s,-1.55,1.55)};
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;input.keys[e.code]=true;audioWake();
 if(G.mode==='play'){if(e.code.startsWith('Digit')){const n=+e.code.slice(5);if(n>=1&&n<=9){P.sel=n-1;UI.dirty()}}if(e.code==='KeyE'){UI.inventory('inv');e.preventDefault()}if(e.code==='KeyC')UI.inventory('craft');if(e.code==='F5'||e.code==='KeyV'){G.view=(G.view+1)%3;e.preventDefault()}if(e.code==='KeyQ')dropHeld();if(e.code==='KeyF')interactNearest();if(e.code==='Escape')UI.pause();if(e.code==='KeyJ')UI.quests()}
 else if((e.code==='Escape'||e.code==='KeyE')&&UI.isOpen()&&['inventory','menu'].includes(G.mode)){UI.closePanel();e.preventDefault()}
 else if(G.mode==='dialog'&&(e.code==='Space'||e.code==='Enter')){UI.dialogNext();e.preventDefault()}
 else if(G.mode==='cinema'&&(e.code==='Escape'||e.code==='Space'))skipCinema();
 if(e.code==='Space'&&G.mode==='play')e.preventDefault()});
addEventListener('keyup',e=>{input.keys[e.code]=false});
canvas.addEventListener('mousedown',e=>{audioWake();if(isTouch||G.mode!=='play')return;if(document.pointerLockElement!==canvas&&!QA){canvas.requestPointerLock?.();return}if(e.button===0){input.mouseL=true;input.attackEdge=true}if(e.button===2){input.use=true;input.useEdge=true}});
addEventListener('mouseup',e=>{if(e.button===0)input.mouseL=false;if(e.button===2)input.use=false});
addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&G.mode==='play')look(e.movementX,e.movementY)});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('wheel',e=>{if(G.mode!=='play')return;P.sel=(P.sel+(e.deltaY>0?1:8))%9;UI.dirty()},{passive:true});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&G.mode==='play'&&!isTouch&&!QA)UI.pause()});
export function dropHeld(){const s=heldStack();if(!s)return;const[o,d]=lookRay();const it=E.dropItem(s.id,1,o.x+d.x*.6,o.y-.3,o.z+d.z*.6,new THREE.Vector3(d.x*5,2,d.z*5),s.dur);it.t=-1;s.count--;if(s.count<=0)P.inv[P.sel]=null;UI.dirty()}
const touches=new Map();
canvas.addEventListener('touchstart',e=>{audioWake();if(G.mode!=='play')return;for(const t of e.changedTouches)touches.set(t.identifier,{x:t.clientX,y:t.clientY,t:performance.now(),moved:0,hold:false});e.preventDefault()},{passive:false});
canvas.addEventListener('touchmove',e=>{for(const t of e.changedTouches){const s=touches.get(t.identifier);if(!s)continue;const dx=t.clientX-s.x,dy=t.clientY-s.y;s.moved+=Math.abs(dx)+Math.abs(dy);s.x=t.clientX;s.y=t.clientY;if(G.mode==='play')look(dx*1.5,dy*1.5)}e.preventDefault()},{passive:false});
const endTouch=e=>{for(const t of e.changedTouches){const s=touches.get(t.identifier);if(!s)continue;touches.delete(t.identifier);if(s.hold)input.attack=false;else if(performance.now()-s.t<260&&s.moved<14&&G.mode==='play'){updateTarget();if(targetEnt&&!targetEnt.npc)doAttack();else onUse()}}e.preventDefault()};
canvas.addEventListener('touchend',endTouch,{passive:false});canvas.addEventListener('touchcancel',endTouch,{passive:false});
setInterval(()=>{for(const s of touches.values())if(!s.hold&&performance.now()-s.t>300&&s.moved<16&&G.mode==='play'){s.hold=true;input.attack=true;input.attackEdge=true}},50);
export function bindTouchControls(){const stick=$('#stickZone'),knob=$('#knob'),base=$('#stick');let sid=null,cx=0,cy=0;const R=46;
 const move=t=>{let dx=t.clientX-cx,dy=t.clientY-cy;const d=Math.hypot(dx,dy);if(d>R){dx=dx/d*R;dy=dy/d*R}input.stickX=dx/R;input.stickY=dy/R;knob.style.transform=`translate(${dx}px,${dy}px)`};
 stick.addEventListener('touchstart',e=>{audioWake();const t=e.changedTouches[0];sid=t.identifier;const r=base.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;move(t);e.preventDefault()},{passive:false});
 stick.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===sid)move(t);e.preventDefault()},{passive:false});
 const end=e=>{for(const t of e.changedTouches)if(t.identifier===sid){sid=null;input.stickX=input.stickY=0;knob.style.transform=''}e.preventDefault()};stick.addEventListener('touchend',end,{passive:false});stick.addEventListener('touchcancel',end,{passive:false});
 const hold=(id,on,off)=>{const el=$(id);const d=e=>{audioWake();el.classList.add('down');on();e.preventDefault();e.stopPropagation()};const u=e=>{if(!el.classList.contains('down'))return;el.classList.remove('down');off&&off();e.preventDefault()};el.addEventListener('touchstart',d,{passive:false});el.addEventListener('touchend',u,{passive:false});el.addEventListener('touchcancel',u,{passive:false});el.addEventListener('mousedown',d);el.addEventListener('mouseup',u);el.addEventListener('mouseleave',u)};
 hold('#bJump',()=>input.jump=true,()=>input.jump=false);
 hold('#bMine',()=>{input.attack=true;input.attackEdge=true},()=>input.attack=false);
 hold('#bUse',()=>{input.use=true;input.useEdge=true},()=>input.use=false);
 hold('#bSneak',()=>{input.sneak=!input.sneak;$('#bSneak').classList.toggle('on',input.sneak)},null);
 hold('#bTalk',()=>interactNearest(),null)}
// ---------------- save / load ----------------
function encodeEdits(m){const a=[...m.entries()].sort((x,y)=>x[0]-y[0]);const out=[];let last=0;for(const[i,id]of a){out.push(i-last,id);last=i}return out}
function decodeEdits(arr){const out=[];let last=0;for(let k=0;k<arr.length;k+=2){last+=arr[k];out.push([last,arr[k+1]])}return out}
const packStack=s=>s?[s.id,s.count,s.dur??-1]:0;const unpackStack=a=>a?{id:a[0],count:a[1],dur:a[2]>=0?a[2]:undefined}:null;
export function save(){if(!G.started||!G.inGame)return false;try{const worlds={};for(const[k,w]of Object.entries(G.worlds)){worlds[k]={edits:encodeEdits(w.edits),meta:[...w.meta.entries()].map(([k,v])=>[k,k.startsWith('chest:')&&v.slots?{slots:v.slots.map(packStack)}:v])}}
 const data={v:1,ver:VERSION,saved:Date.now(),dim:G.dim,clock:G.clock,playtime:G.playtime,player:{pos:[P.pos.x,P.pos.y,P.pos.z],yaw:P.yaw,pitch:P.pitch,hp:P.dead?maxHp():P.hp,hunger:P.hunger,sat:P.sat,xp:P.xp,level:P.level,inv:P.inv.map(packStack),armor:P.armor.map(packStack),sel:P.sel,spawn:P.spawn,spawnDim:P.spawnDim},quest:G.quest,flags:G.flags,bossesDown:G.bossesDown,stats:G.stats,growing:[...G.growing]};
 data.worlds=worlds;const s=JSON.stringify(data);localStorage.setItem(SAVE_KEY,s);try{localStorage.setItem(SAVE_KEY+'-backup',s)}catch(e){}G.lastSave=performance.now();return true}catch(e){console.warn('save failed',e);return false}}
export function readSave(){for(const k of[SAVE_KEY,SAVE_KEY+'-backup']){try{const s=localStorage.getItem(k);if(!s)continue;const d=JSON.parse(s);if(d&&d.v===1&&d.player&&d.worlds&&d.worlds.over)return d}catch(e){}}return null}
let pendingSave=null;
function applySavedWorld(kind){const d=pendingSave;if(!d||!d.worlds[kind])return;const w=G.worlds[kind];w.applyEdits(decodeEdits(d.worlds[kind].edits));w.meta=new Map(d.worlds[kind].meta.map(([k,v])=>[k,k.startsWith('chest:')&&v.slots?{slots:v.slots.map(unpackStack)}:v]));for(let z=0;z<w.D;z++)for(let x=0;x<w.W;x++)w.updateHM(x,z)}
// ---------------- world boot ----------------
const frame=()=>new Promise(r=>requestAnimationFrame(()=>setTimeout(r,0)));
export async function bootWorld(progress){progress(.15,'gen');await frame();G.worlds={over:generateOverworld()};G.world=G.worlds.over;G.cleanMeta=G.world.meta.size;progress(.55,'light');await frame();G.world.lightAll();progress(.75,'mesh');await frame();findTreeSpot();G.growing=new Set();scanGrowing()}
function findTreeSpot(){const w=G.worlds.over;let best=null,bd=1e9;for(let z=60;z<200;z+=2)for(let x=60;x<200;x+=2){const y=w.surface(x,z)-1;if(w.get(x,y,z)===B.leaves){const d=Math.hypot(x-128,z-128);if(d>30&&d<bd){bd=d;best={x,y:y-3,z}}}}G.treeSpot=best||{x:100,y:26,z:100}}
function scanGrowing(){const w=G.worlds.over;for(let z=100;z<160;z++)for(let x=100;x<160;x++)for(let y=22;y<30;y++){const id=w.get(x,y,z);if(BLOCKS[id].crop!==undefined&&BLOCKS[id].crop<3)G.growing.add(w.idx(x,y,z))}}
async function freshWorlds(){const w=G.worlds.over;E.clearEntities();if(G.dim!=='over'||w.edits.size||G.worlds.realm||G.worlds.coast){UI.loading(.3,T('gen'));await frame();disposeAllChunks();G.worlds={over:generateOverworld()};G.worlds.over.lightAll();G.cleanMeta=G.worlds.over.meta.size;findTreeSpot();UI.loading(1,'')}G.world=G.worlds.over;G.dim='over';ocean.visible=clouds.visible=true;G.growing=new Set();scanGrowing()}
export async function newGame(){try{localStorage.removeItem(SAVE_KEY);localStorage.removeItem(SAVE_KEY+'-backup')}catch(e){}pendingSave=null;await freshWorlds();Object.assign(P,{hp:20,hunger:20,sat:5,exh:0,xp:0,level:0,sel:0,spawn:null,spawnDim:'over',dead:false,poison:0,slow:0,fallStart:null});P.inv=new Array(36).fill(null);P.armor=[null,null,null,null];G.quest={i:0,stage:'offer'};G.flags={};G.bossesDown={};G.stats={kills:0,mined:0,crafted:0,deaths:0};G.clock=.03;G.playtime=0;const s=G.world.pois.spawn;P.pos.set(s.x,s.y,s.z);P.yaw=0;P.pitch=-.05;P.vel.set(0,0,0);addItem(111,2)}
export async function continueGame(){const d=readSave();if(!d)return false;pendingSave=d;await freshWorlds();applySavedWorld('over');G.flags=d.flags||{};ensureGateState();G.worlds.over.lightAll();disposeAllChunks();G.growing=new Set(d.growing||[]);
 const p=d.player;P.pos.set(...p.pos);P.vel.set(0,0,0);P.yaw=p.yaw;P.pitch=p.pitch;P.hp=p.hp>0?p.hp:20;P.hunger=p.hunger;P.sat=p.sat;P.xp=p.xp;P.level=p.level;P.inv=p.inv.map(unpackStack);P.armor=p.armor.map(unpackStack);P.sel=p.sel;P.spawn=p.spawn;P.spawnDim=p.spawnDim||'over';P.dead=false;P.fallStart=null;
 G.quest=d.quest;G.bossesDown=d.bossesDown||{};G.stats=d.stats||G.stats;G.clock=d.clock;G.playtime=d.playtime||0;
 if(d.dim==='realm'||d.dim==='coast'){switchDim(d.dim,false);P.pos.set(...p.pos);P.yaw=p.yaw}return true}
export function enterPlay(){G.mode='play';G.started=true;G.inGame=true;UI.hud(true);spawnNPCs();refreshSocketGems();updateChunks(400,P.pos.x,P.pos.z);UI.dirty();setMood(G.dim==='realm'?'realm':isNight()?'night':'day');if(!isTouch&&!QA)canvas.requestPointerLock?.();save()}
export function toTitle(){save();G.inGame=false;G.mode='title';UI.hud(false);E.clearEntities();if(G.dim!=='over')switchDim('over',false);spawnNPCs();document.exitPointerLock?.();setMood('title');UI.title()}
// ---------------- cinema (in-engine intro) ----------------
let cine=null;const castActors=[];
export function startCinema(after){G.mode='cinema';UI.hud(false);document.querySelector('#title')?.classList.add('hidden');spawnNPCs();const asmon=makeModel('asmon');asmon.root.position.set(127.5,31,121.5);asmon.root.visible=false;scene.add(asmon.root);castActors.push(asmon);
 const pinco=makeModel('pinco');pinco.root.position.set(128.5,25,131.5);pinco.root.rotation.y=Math.PI;scene.add(pinco.root);castActors.push(pinco);
 cine={t:0,after,asmon,pinco,shots:[
 {d:6,from:[128,52,250],to:[128,40,180],look:[128,26,128],cap:'c1',clock:.02},
 {d:6,from:[150,34,152],to:[112,30,142],look:[128,26,124],cap:'c2',clock:.12},
 {d:6,from:[132,31,129],to:[128.8,32.2,125.6],look:[127.5,32.6,121.5],cap:'c3',clock:.47,asmon:true},
 {d:6,from:[128,58,140],to:[128,74,152],look:[150,30,170],cap:'c4',clock:.48,shards:true},
 {d:5.5,from:[128.5,27.2,125.5],to:[128.5,26.6,128.4],look:[128.5,26.4,131.5],cap:'c5',clock:.05,title:true}]};
 setMood('title')}
function updateCinema(dt){const c=cine;c.t+=dt;let acc=0,shot=null,k=0;for(const s of c.shots){if(c.t<acc+s.d){shot=s;k=(c.t-acc)/s.d;break}acc+=s.d}if(!shot){endCinema();return}
 const e=k*k*(3-2*k);camera.position.set(shot.from[0]+(shot.to[0]-shot.from[0])*e,shot.from[1]+(shot.to[1]-shot.from[1])*e,shot.from[2]+(shot.to[2]-shot.from[2])*e);camera.lookAt(...shot.look);G.clock=shot.clock+k*.02;
 c.asmon.root.visible=!!shot.asmon;if(shot.asmon){c.asmon.root.rotation.y=Math.atan2(camera.position.x-127.5,camera.position.z-121.5);animate(c.asmon,G.time,0);c.asmon.parts.armR.rotation.x=-2.6-Math.sin(G.time*3)*.2;c.asmon.mat.color.setScalar(.95);if(Math.random()<.4)E.glowBurst(127.3,33.8,122.4,['#ffd25a','#fff2a6'],1,1.2,.8)}
 if(shot.shards&&Math.random()<.6){for(const[col,tx2,tz]of[['#ffb52e',128,212],['#7fd8f4',200,60],['#a477d8',210,180]])E.glowBurst(128+(tx2-128)*k,32+Math.sin(k*3.14)*24,124+(tz-124)*k,[col,'#ffffff'],2,1.5,1.4)}
 animate(c.pinco,G.time,0);c.pinco.mat.color.setScalar(.95);if(shot.title)c.pinco.parts.armR.rotation.x=-2.6+Math.sin(G.time*6)*.3;
 if(c.cap!==shot.cap){c.cap=shot.cap;UI.caption(T(shot.cap),!!shot.title)}}
export function skipCinema(){if(cine)endCinema()}
function endCinema(){const c=cine;cine=null;for(const a of castActors)scene.remove(a.root);castActors.length=0;UI.caption('',false,true);c.after&&c.after()}
// ---------------- ending ----------------
function startEnding(){G.flags.finished=true;save();setTimeout(()=>{switchDim('over',true);{const g=G.worlds.over.pois.gate;const w=G.worlds.over;const[a,b,c,d,e]=g.inner;const cx=Math.floor((a+d)/2);for(const[dx,dy,id]of[[0,2,B.gold_block],[1,2,B.gold_block],[0,3,B.lamp],[1,3,B.lamp],[0,4,B.gold_block],[1,4,B.gold_block]])w.set(cx+dx,e+dy,c,id);P.pos.set(cx+1,g.y,c+9.5);P.yaw=0;P.pitch=.12;disposeAllChunks()}G.clock=.04;for(let i=0;i<30;i++)setTimeout(()=>E.glowBurst(118+Math.random()*20,34+Math.random()*6,118+Math.random()*20,['#ffd25a','#f29ab9','#7fd8f4','#a477d8','#ffffff'],24,6,1.4),i*220);setMood('ending');UI.dialog(ENDING,()=>{G.mode='ending';UI.ending();save()})},500)}
export function rematch(){G.flags.rematch=true;UI.toast(T('rematchon'))}
function updateTitleCam(){const a=G.time*.05;camera.position.set(128+Math.cos(a)*30,40,128+Math.sin(a)*30);camera.lookAt(128,27,128);G.clock=.1}
// ---------------- main loop ----------------
let last=performance.now(),frames=0,fpsT=0;G.fps=0;G.time=0;G.view=0;G.day=1;G.growing=new Set();G.playtime=0;
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;frames++;fpsT+=dt;if(fpsT>=1){G.fps=frames;frames=0;fpsT=0}
 try{G.time+=dt;
  if(G.mode==='play'){G.playtime+=dt;G.clock=(G.clock+dt/DAY_LEN)%1;updatePlayer(dt);updateActions(dt);E.updateEntities(dt);updateNPCs(dt);updateSpawning(dt);updateBossTriggers();updateKilns(dt);updateGrowth(dt);updateCamera(dt);updateHand();UI.tick(dt);if(performance.now()-(G.lastSave||0)>30000)save();
   setMood(G.activeBoss?'boss':G.dim==='realm'?'realm':P.pos.y<SEA-4&&G.world.skyAt(Math.floor(P.pos.x),Math.floor(P.pos.y+1.6),Math.floor(P.pos.z))<8?'cave':isNight()?'night':'day');
   const op=objectivePos();beam.visible=!!op;if(op){beam.position.set(op.x+.5,(op.y||30)+44,op.z+.5);beam.material.opacity=.22+Math.sin(G.time*3)*.08}}
  else{beam.visible=false;outline.visible=false;crack.visible=false;
   if(G.mode==='cinema'&&cine){updateCinema(dt);E.updateEntities(dt);updateNPCs(dt)}
   else if(G.mode==='title'){updateTitleCam();updateNPCs(dt)}
   else if(G.inGame){updateCamera(0);updateKilns(dt);if(G.mode==='sleep'||G.mode==='ending'){E.updateEntities(dt);updateNPCs(dt)}}}
  updateSky(dt);updateChunks(G.mode==='loading'?30:G.mode==='play'?5:8);
  renderer.clear();renderer.render(scene,camera);if(G.mode==='play'&&G.view===0&&!P.dead){renderer.clearDepth();renderer.render(handScene,handCam)}}
 catch(err){console.error(err);G.lastError=String(err&&err.stack||err)}}
requestAnimationFrame(loop);
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();audioSuspend(true);if(G.mode==='play')UI.pause()}else audioSuspend(false)});
addEventListener('pagehide',()=>save());
// ---------------- API for UI/entities ----------------
G.api={giverHere,questWorld,addItem,countItem,removeItem,onPickup:(id,n)=>{UI.pickup(id,n);questCheck()},hurtPlayer,aoe,explode,gainXP,dmgMul,onBossDefeated,onAsmonYield,bossPhase,craft,canCraft,smelt,collectKiln,kilnState,fuelUnits,chestSlots,equipFromSlot,unequip,doTrade,talkTo,respawn,save,newGame,continueGame,enterPlay,toTitle,startCinema,skipCinema,readSave,saveOptions,maxHp,armorDef,interactNearest,curQuest,objectivePos,giverHere,questWorld,QUESTS,AWAY,isNight,rematch,musicVolume,setMood,bindTouchControls,nearBlock,dropHeld,bootWorld,setView:v=>{G.view=v},P,input,isTouch};
if(QA){window.BH={G,P,E,B,I,BLOCKS,RECIPES,SMELT,addItem,countItem,removeItem,breakBlock,placeAt,craft,canCraft,smelt,collectKiln,kilnState,chestSlots,save,readSave,continueGame,newGame,enterPlay,toTitle,startCinema,skipCinema,switchDim,sail,interactBlock,QUESTS,AWAY,giverHere,questWorld,questCheck,talkTo,finishQuest,curQuest,objectivePos,hurtPlayer,respawn,updateChunks,target:()=>{updateTarget();return{target,ent:targetEnt&&(targetEnt.id||targetEnt.type)}},interactNearest,openGate,insertShard,growAt,isNight,explode,gainXP,UI,camera,renderer,scene,chunks,raycast,spawnNPCs,trySleep,onUse,doAttack,maxHp}}
