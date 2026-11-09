// Entities: shared voxel physics, mobs + AI, bosses, projectiles, item drops, particles.
import * as THREE from '../vendor/three.module.min.js';
import {G} from './state.js';
import {BLOCKS,B,I,def,iconCanvas,itemPixels} from './blocks.js';
import {makeModel,animate,extrudeIcon} from './models.js';
import {tileUV} from './mesher.js';
import {sfx} from './audio.js';
import {clamp,angleWrap} from './util.js';
// ---------- physics ----------
export function solidCell(x,y,z){return BLOCKS[G.world.get(x,y,z)].solid}
export function boxHits(px,py,pz,w,h){const x0=Math.floor(px-w),x1=Math.floor(px+w-1e-7),y0=Math.floor(py),y1=Math.floor(py+h-1e-7),z0=Math.floor(pz-w),z1=Math.floor(pz+w-1e-7);for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)if(solidCell(x,y,z))return true;return false}
export function boxHas(px,py,pz,w,h,test){const x0=Math.floor(px-w),x1=Math.floor(px+w-1e-7),y0=Math.floor(py),y1=Math.floor(py+h-1e-7),z0=Math.floor(pz-w),z1=Math.floor(pz+w-1e-7);for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const id=G.world.get(x,y,z);if(test(id,x,y,z))return id}return 0}
export function moveBody(e,dt){const w=e.w,h=e.h;let steps=Math.max(1,Math.ceil(Math.max(Math.abs(e.vel.x),Math.abs(e.vel.y),Math.abs(e.vel.z))*dt/.4));const sdt=dt/steps;e.hitX=e.hitZ=false;e.onGround=false;
 for(let s=0;s<steps;s++){
  e.pos.x+=e.vel.x*sdt;if(boxHits(e.pos.x,e.pos.y,e.pos.z,w,h)){if(e.vel.x>0)e.pos.x=Math.floor(e.pos.x+w)-w-1e-4;else e.pos.x=Math.floor(e.pos.x-w)+1+w+1e-4;e.vel.x=0;e.hitX=true}
  e.pos.z+=e.vel.z*sdt;if(boxHits(e.pos.x,e.pos.y,e.pos.z,w,h)){if(e.vel.z>0)e.pos.z=Math.floor(e.pos.z+w)-w-1e-4;else e.pos.z=Math.floor(e.pos.z-w)+1+w+1e-4;e.vel.z=0;e.hitZ=true}
  e.pos.y+=e.vel.y*sdt;if(boxHits(e.pos.x,e.pos.y,e.pos.z,w,h)){if(e.vel.y<0){e.pos.y=Math.floor(e.pos.y)+1;e.onGround=true}else e.pos.y=Math.floor(e.pos.y+h)-h-1e-4;e.vel.y=0}}
 if(e.pos.y<-20){e.pos.y=G.world.surface(e.pos.x,e.pos.z)+1;e.vel.set(0,0,0)}}
export function lightAt(x,y,z){const w=G.world;const s=w.skyAt(Math.floor(x),Math.floor(y),Math.floor(z)),b=w.blkAt(Math.floor(x),Math.floor(y),Math.floor(z));const sk=Math.pow(.82,15-s)*G.day,bl=Math.pow(.85,15-b);return Math.max(sk,bl,.08+(G.bright||0))}
// ray vs AABB
export function rayBox(o,d,min,max){let t0=0,t1=1e9;for(const a of['x','y','z']){if(Math.abs(d[a])<1e-9){if(o[a]<min[a]||o[a]>max[a])return null;continue}let ta=(min[a]-o[a])/d[a],tb=(max[a]-o[a])/d[a];if(ta>tb)[ta,tb]=[tb,ta];t0=Math.max(t0,ta);t1=Math.min(t1,tb);if(t0>t1)return null}return t0}
// ---------- particles ----------
let PM=null;const PARTS=[];const MAXP=500;const _m=new THREE.Matrix4(),_c=new THREE.Color();
export function initParticles(scene){const geo=new THREE.BoxGeometry(1,1,1);const mat=new THREE.MeshBasicMaterial({color:0xffffff});PM=new THREE.InstancedMesh(geo,mat,MAXP);PM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);PM.count=0;PM.frustumCulled=false;scene.add(PM);PM.setColorAt(0,_c.set(0xffffff))}
export function burst(x,y,z,color,n=10,spd=3,size=.09,life=.7,grav=14){for(let i=0;i<n;i++){if(PARTS.length>=MAXP)PARTS.shift();const c=Array.isArray(color)?color[i%color.length]:color;PARTS.push({x:x+(Math.random()-.5)*.5,y:y+(Math.random()-.5)*.5,z:z+(Math.random()-.5)*.5,vx:(Math.random()-.5)*spd,vy:Math.random()*spd*.9+.5,vz:(Math.random()-.5)*spd,life:life*(.6+Math.random()*.6),t:0,c,s:size*(.6+Math.random()*.8),g:grav})}}
const tileColorCache={};export function blockColors(id){if(tileColorCache[id])return tileColorCache[id];const b=BLOCKS[id];if(!b||!G.atlas)return['#888'];const g=G.atlas.getContext('2d');const t=b.tex.side;const x=(t%16)*16,y=Math.floor(t/16)*16;const d=g.getImageData(x,y,16,16).data;const out=[];for(let i=0;i<6;i++){let k=((Math.floor(Math.random()*16)*16+Math.floor(Math.random()*16))*4);for(let tries=0;tries<10&&d[k+3]<100;tries++)k=((Math.floor(Math.random()*16)*16+Math.floor(Math.random()*16))*4);out.push(`rgb(${d[k]},${d[k+1]},${d[k+2]})`)}return tileColorCache[id]=out}
function updateParticles(dt){let n=0;for(let i=PARTS.length-1;i>=0;i--){const p=PARTS[i];p.t+=dt;if(p.t>p.life){PARTS.splice(i,1);continue}p.vy-=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(p.g>0&&solidCell(Math.floor(p.x),Math.floor(p.y),Math.floor(p.z))){p.vy=0;p.vx*=.5;p.vz*=.5;p.y=Math.floor(p.y)+1.01}}
 for(const p of PARTS){if(n>=MAXP)break;const s=p.s*(1-p.t/p.life*.5);_m.makeScale(s,s,s);_m.setPosition(p.x,p.y,p.z);PM.setMatrixAt(n,_m);const l=lightAt(p.x,p.y,p.z);_c.set(p.c);if(!p.glow)_c.multiplyScalar(Math.min(1,l*1.1));PM.setColorAt(n,_c);n++}
 PM.count=n;PM.instanceMatrix.needsUpdate=true;if(PM.instanceColor)PM.instanceColor.needsUpdate=true}
export function glowBurst(x,y,z,color,n,spd,life=.9){const s=PARTS.length;burst(x,y,z,color,n,spd,.12,life,-1);for(let i=s;i<PARTS.length;i++)PARTS[i].glow=true}
// ---------- item drops ----------
const geoCache={};
export function itemGeometry(id){if(geoCache[id])return geoCache[id];let g;const b=id<100&&BLOCKS[id];
 if(b&&!b.cross&&!b.torch){g=new THREE.BoxGeometry(1,1,1);const uv=g.attributes.uv;const faces=[b.tex.side,b.tex.side,b.tex.top,b.tex.bottom,b.tex.front??b.tex.side,b.tex.side];for(let f=0;f<6;f++){const[u0,v0,u1,v1]=tileUV(faces[f]);for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)?u1:u0,uv.getY(i)?v1:v0)}}g.userData.block=true}
 else{let c=itemPixels(id);if(!c){c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(iconCanvas(id),0,0,16,16)}g=extrudeIcon(c,1.2)}
 return geoCache[id]=g}
let blockMat=null,iconMat=null;function mats(){if(!blockMat){blockMat=new THREE.MeshBasicMaterial({map:G.atlasTex,alphaTest:.5,side:THREE.DoubleSide});iconMat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide})}return[blockMat,iconMat]}
export function itemMesh(id){const[bm,im]=mats();const g=itemGeometry(id);const m=new THREE.Mesh(g,g.userData.block?bm.clone():im.clone());return m}
export function dropItem(id,n,x,y,z,vel,dur){if(!id||n<=0)return;const m=itemMesh(id);const s=id<100&&BLOCKS[id]&&!BLOCKS[id].cross?.26:.42;m.scale.setScalar(s);G.scene.add(m);const it={id,n,dur,pos:new THREE.Vector3(x,y,z),vel:vel||new THREE.Vector3((Math.random()-.5)*2.5,3.5,(Math.random()-.5)*2.5),w:.13,h:.25,mesh:m,t:0,spin:Math.random()*6};G.items.push(it);return it}
function updateItems(dt){const P=G.P;for(let i=G.items.length-1;i>=0;i--){const it=G.items[i];it.t+=dt;it.vel.y-=18*dt;it.vel.x*=Math.pow(.05,dt);it.vel.z*=Math.pow(.05,dt);
  // magnet + pickup
  const dx=P.pos.x-it.pos.x,dy=P.pos.y+.8-it.pos.y,dz=P.pos.z-it.pos.z,d=Math.hypot(dx,dy,dz);
  if(it.t>.45&&d<3.2&&G.mode==='play'&&!P.dead){const sp=Math.min(14,4+d*6);it.vel.set(dx/d*sp,dy/d*sp+18*dt,dz/d*sp);if(d<1.25){const left=G.api.addItem(it.id,it.n,it.dur);if(left<it.n){sfx('pop');G.api.onPickup(it.id,it.n-left)}it.n=left;if(left<=0){G.scene.remove(it.mesh);G.items.splice(i,1);continue}}}
  moveBody(it,dt);if(it.onGround){it.vel.x*=.8;it.vel.z*=.8}
  if(it.t>300){G.scene.remove(it.mesh);G.items.splice(i,1);continue}
  it.mesh.position.set(it.pos.x,it.pos.y+.18+Math.sin(it.t*2.5)*.07,it.pos.z);it.mesh.rotation.y=it.spin+it.t*1.6;const l=lightAt(it.pos.x,it.pos.y+.2,it.pos.z);it.mesh.material.color.setScalar(Math.min(1,l*1.08))}}
// ---------- mobs ----------
export const MOB={
 gloomie:{hp:20,speed:2.4,dmg:3,w:.3,h:1.85,hostile:true,burns:true,xp:5,drops:()=>[[105,1+Math.floor(Math.random()*2)],Math.random()<.12?[102,1]:null]},
 gilded:{hp:34,speed:3,dmg:4,w:.3,h:1.85,hostile:true,xp:8,model:'gloomie',tint:[1.25,1.05,.45],drops:()=>[[105,3+Math.floor(Math.random()*3)]]},
 archer:{hp:18,speed:2.3,dmg:3,w:.28,h:1.9,hostile:true,burns:true,ranged:true,xp:5,drops:()=>[[108,1+Math.floor(Math.random()*2)],Math.random()<.5?[109,1+Math.floor(Math.random()*3)]:null]},
 spider:{hp:16,speed:3.4,dmg:2,w:.6,h:.8,hostile:true,climbs:true,xp:5,drops:()=>[[106,1+Math.floor(Math.random()*2)]]},
 spiderling:{hp:8,speed:3.8,dmg:2,w:.4,h:.55,hostile:true,climbs:true,xp:2,model:'spider',scale:.6,drops:()=>[Math.random()<.5?[106,1]:null]},
 popshroom:{hp:18,speed:2.3,dmg:0,w:.4,h:1.25,hostile:true,fuse:true,xp:5,drops:()=>[[107,1+Math.floor(Math.random()*2)]]},
 sheep:{hp:8,speed:1.3,dmg:0,w:.45,h:1.1,hostile:false,xp:1,drops:()=>[[22,1],[116,1+Math.floor(Math.random()*2)]]},
 colossus:{hp:220,speed:1.8,dmg:7,w:.95,h:3.5,boss:true,xp:120},
 warden:{hp:260,speed:2.5,dmg:6,w:.85,h:3.1,boss:true,xp:140},
 weaver:{hp:300,speed:3,dmg:5,w:1.4,h:1.6,boss:true,xp:160},
 crab:{hp:14,speed:2.6,dmg:3,w:.55,h:1,scale:1.35,hostile:true,xp:4,drops:()=>[[105,1],Math.random()<.35?[166,1]:null]},
 tidecrab:{hp:260,speed:2.4,dmg:6,w:1.3,h:2.2,boss:true,xp:150},
 asmon:{hp:420,speed:2.6,dmg:6,w:.55,h:3.2,boss:true,xp:250,model:'asmonboss'}};
export function spawnMob(type,x,y,z){const d=MOB[type];const m=makeModel(d.model||type);if(d.scale)m.inner.scale.multiplyScalar(d.scale);if(d.tint)m.mat.color.setRGB(...d.tint);G.scene.add(m.root);
 const mob={type,d,pos:new THREE.Vector3(x,y,z),vel:new THREE.Vector3(),yaw:Math.random()*6.28,hp:d.hp*(d.boss&&G.flags.rematch&&type==='asmon'?1.25:1),maxHp:0,w:d.w,h:d.h,model:m,t:Math.random()*10,atk:1,hurt:0,state:'idle',tm:0,wander:0,target:null,fuse:0,dead:0,boss:!!d.boss,cool:{},spec:0};mob.maxHp=mob.hp;G.mobs.push(mob);return mob}
export function removeMob(m){G.scene.remove(m.model.root);const i=G.mobs.indexOf(m);if(i>=0)G.mobs.splice(i,1);if(m.ring)G.scene.remove(m.ring)}
export function hurtMob(m,dmg,from,kb=6){if(m.dead||m.hp<=0)return;if(m.boss&&m.invuln>0)return;if(m.weak>0)dmg*=1.5;m.hp-=dmg;m.hurt=.25;sfx(m.boss?'hit':'mobhurt');const c=m.d.boss?['#ffd25a','#fff']:['#ff6a6a','#ffd2d2'];burst(m.pos.x,m.pos.y+m.h*.6,m.pos.z,c,8,3,.07,.4);
 if(from&&!m.boss){const dx=m.pos.x-from.x,dz=m.pos.z-from.z,d=Math.hypot(dx,dz)||1;m.vel.x=dx/d*kb;m.vel.z=dz/d*kb;m.vel.y=4.5}
 if(m.type==='sheep'){m.flee=4}
 if(m.type==='asmon'&&m.hp<=1){m.hp=1;m.defeated=true;return}
 if(m.hp<=0){m.dead=.01;m.vel.set(0,2,0);if(m.boss)G.api.onBossDefeated(m)}}
function dist2(a,b){return Math.hypot(a.x-b.x,a.z-b.z)}
function seesPlayer(m){const P=G.P;const ox=m.pos.x,oy=m.pos.y+m.h*.85,oz=m.pos.z;const tx=P.pos.x-ox,ty=P.pos.y+1.5-oy,tz=P.pos.z-oz;const d=Math.hypot(tx,ty,tz);const n=Math.ceil(d*3);for(let i=1;i<n;i++){const f=i/n;if(BLOCKS[G.world.get(Math.floor(ox+tx*f),Math.floor(oy+ty*f),Math.floor(oz+tz*f))].opaque)return false}return true}
export function fire(kind,x,y,z,vx,vy,vz,owner,dmg,extra={}){let mesh;if(kind==='arrow'||kind==='thorn'){mesh=itemMesh(kind==='arrow'?109:108);mesh.scale.setScalar(.5)}else if(kind==='icicle'){mesh=new THREE.Mesh(new THREE.ConeGeometry(.12,.7,5),new THREE.MeshBasicMaterial({color:0xbfe8ff}));}else if(kind==='boulder'){mesh=itemMesh(B.sandstone);mesh.scale.setScalar(.9)}else if(kind==='web'){mesh=itemMesh(B.web);mesh.scale.setScalar(.6)}else if(kind==='coin'){mesh=itemMesh(105);mesh.scale.setScalar(.6)}else if(kind==='bubble'){mesh=new THREE.Mesh(new THREE.BoxGeometry(.32,.32,.32),new THREE.MeshBasicMaterial({color:0x9fe4ff,transparent:true,opacity:.75}))}else{mesh=new THREE.Mesh(new THREE.SphereGeometry(.15),new THREE.MeshBasicMaterial({color:0xffffff}))}
 G.scene.add(mesh);const p={kind,pos:new THREE.Vector3(x,y,z),vel:new THREE.Vector3(vx,vy,vz),owner,dmg,mesh,t:0,grav:kind==='bubble'?1.5:kind==='icicle'||kind==='web'?4:kind==='coin'?20:12,...extra};G.projectiles.push(p);return p}
function updateProjectiles(dt){const P=G.P;for(let i=G.projectiles.length-1;i>=0;i--){const p=G.projectiles[i];p.t+=dt;const rm=()=>{G.scene.remove(p.mesh);G.projectiles.splice(i,1)};if(p.stuck){if(p.t>2)rm();continue}
 p.vel.y-=p.grav*dt;const steps=Math.ceil(p.vel.length()*dt/.25)||1;let done=false;for(let s=0;s<steps&&!done;s++){p.pos.addScaledVector(p.vel,dt/steps);
  if(solidCell(Math.floor(p.pos.x),Math.floor(p.pos.y),Math.floor(p.pos.z))){if(p.kind==='boulder'||p.kind==='coin'){G.api.aoe(p.pos,1.6,p.dmg,'mob');burst(p.pos.x,p.pos.y+.5,p.pos.z,p.kind==='coin'?['#f4c43a','#fff2a6']:blockColors(B.sandstone),14,4);sfx(p.kind==='coin'?'coin':'slam');rm();done=true;break}p.stuck=true;p.t=0;sfx('thunk');done=true;break}
  if(p.owner==='player'){for(const m of G.mobs){if(m.dead)continue;if(Math.abs(p.pos.x-m.pos.x)<m.w+.15&&Math.abs(p.pos.z-m.pos.z)<m.w+.15&&p.pos.y>m.pos.y&&p.pos.y<m.pos.y+m.h){hurtMob(m,p.dmg,{x:p.pos.x-p.vel.x,z:p.pos.z-p.vel.z},4);rm();done=true;break}}}
  else if(!P.dead&&Math.abs(p.pos.x-P.pos.x)<.45&&Math.abs(p.pos.z-P.pos.z)<.45&&p.pos.y>P.pos.y&&p.pos.y<P.pos.y+1.8){G.api.hurtPlayer(p.dmg,p.pos);if(p.kind==='web')P.slow=3;rm();done=true;break}}
 if(done)continue;if(p.t>8){rm();continue}
 p.mesh.position.copy(p.pos);if(p.kind==='icicle'){p.mesh.lookAt(p.pos.x+p.vel.x,p.pos.y+p.vel.y,p.pos.z+p.vel.z);p.mesh.rotateX(Math.PI/2)}else if(p.kind==='arrow'||p.kind==='thorn'){p.mesh.rotation.set(0,Math.atan2(p.vel.x,p.vel.z)-Math.PI/2,0);p.mesh.rotateZ(Math.atan2(p.vel.y,Math.hypot(p.vel.x,p.vel.z))-Math.PI/4)}else p.mesh.rotation.x+=dt*6}}
// Telegraph rings on the ground
export function ring(x,y,z,r,color=0xff4a3a){const g=new THREE.RingGeometry(r*.82,r,40);g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.75,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,y+.06,z);G.scene.add(m);const fill=new THREE.Mesh(new THREE.CircleGeometry(r,40).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.18,depthWrite:false}));fill.position.copy(m.position);fill.position.y+=.01;G.scene.add(fill);fill.scale.setScalar(.01);return{m,fill,r,remove(){G.scene.remove(m);G.scene.remove(fill)}}}
const RINGS=[];export function timedRing(x,y,z,r,delay,onHit,color){const R=ring(x,y,z,r,color);RINGS.push({R,t:0,delay,onHit,x,y,z,r})}
export const WAVES=[];export function wave(x,y,z,speed,max,dmg,color=0xffc24a){const g=new THREE.RingGeometry(.9,1,48);g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,y+.15,z);G.scene.add(m);WAVES.push({m,x,y,z,r:.5,speed,max,dmg,hit:false})}
function updateTelegraphs(dt){const P=G.P;for(let i=RINGS.length-1;i>=0;i--){const q=RINGS[i];q.t+=dt;q.R.fill.scale.setScalar(Math.min(1,q.t/q.delay));if(q.t>=q.delay){q.R.remove();RINGS.splice(i,1);q.onHit&&q.onHit(q)}}
 for(let i=WAVES.length-1;i>=0;i--){const w=WAVES[i];w.r+=w.speed*dt;w.m.scale.setScalar(w.r);w.m.material.opacity=.85*(1-w.r/w.max);const d=Math.hypot(P.pos.x-w.x,P.pos.z-w.z);if(!w.hit&&Math.abs(d-w.r)<.7&&P.onGround&&Math.abs(P.pos.y-w.y)<1.6){w.hit=true;G.api.hurtPlayer(w.dmg,{x:w.x,y:w.y,z:w.z})}if(w.r>=w.max){G.scene.remove(w.m);WAVES.splice(i,1)}}}
export function clearTelegraphs(){for(const q of RINGS)q.R.remove();RINGS.length=0;for(const w of WAVES)G.scene.remove(w.m);WAVES.length=0}
// ---------- AI ----------
function face(m,tx,tz,rate,dt){const want=Math.atan2(tx-m.pos.x,tz-m.pos.z);m.yaw+=angleWrap(want-m.yaw)*Math.min(1,rate*dt)}
function walk(m,dirx,dirz,spd,dt){const acc=m.onGround?10:3;m.vel.x+=(dirx*spd-m.vel.x)*Math.min(1,acc*dt);m.vel.z+=(dirz*spd-m.vel.z)*Math.min(1,acc*dt);if((m.hitX||m.hitZ)&&m.onGround&&spd>.1){if(m.d.climbs)m.vel.y=5.5;else m.vel.y=8}else if((m.hitX||m.hitZ)&&m.d.climbs&&spd>.1)m.vel.y=Math.max(m.vel.y,3)}
function mobUpdate(m,dt){const P=G.P;const d=m.d;m.t+=dt;m.atk-=dt;m.hurt-=dt;if(m.slowT)m.slowT-=dt;
 if(m.dead){m.dead+=dt;m.model.root.rotation.z=Math.min(Math.PI/2,m.dead*5);if(m.dead>.6){burst(m.pos.x,m.pos.y+.6,m.pos.z,['#ffffff','#d9d9e6'],14,2.5,.12,.6,-1);for(const dr of (d.drops?d.drops():[]))if(dr)dropItem(dr[0],dr[1],m.pos.x,m.pos.y+.6,m.pos.z);if(!m.boss)G.api.gainXP(d.xp);G.stats.kills++;removeMob(m);return}moveBody(m,dt);syncModel(m,dt,0);return}
 const dx=P.pos.x-m.pos.x,dz=P.pos.z-m.pos.z,dist=Math.hypot(dx,dz),dy=P.pos.y-m.pos.y;let spd=0;
 if(m.boss){bossUpdate(m,dt,dx,dz,dist,dy);}
 else{const lit=G.world.skyAt(Math.floor(m.pos.x),Math.floor(m.pos.y+1),Math.floor(m.pos.z))>=14&&G.day>.75&&G.world.kind!=='realm';
  if(d.burns&&lit){m.burn=(m.burn||0)+dt;if(m.burn>1){m.burn=0;hurtMob(m,2,null);burst(m.pos.x,m.pos.y+1.6,m.pos.z,['#ff9a2b','#ffd25a'],5,1,.1,.5,-2)}}
  let aggro=d.hostile&&!P.dead&&dist<18&&Math.abs(dy)<8&&!G.opt.cheatGhost;
  if(m.type==='spider'&&lit&&!m.angry)aggro=false;if(m.hurt>0&&d.hostile)m.angry=true;
  if(m.type==='sheep'){if(m.flee>0){m.flee-=dt;const a=Math.atan2(-dx,-dz);spd=d.speed*2.2;m.yaw=a;walk(m,Math.sin(a),Math.cos(a),spd,dt)}else{m.wander-=dt;if(m.wander<=0){m.wander=2+Math.random()*4;m.wdir=Math.random()<.4?null:Math.random()*6.28}if(m.wdir!=null){spd=d.speed;face(m,m.pos.x+Math.sin(m.wdir),m.pos.z+Math.cos(m.wdir),4,dt);walk(m,Math.sin(m.yaw),Math.cos(m.yaw),spd,dt)}else walk(m,0,0,0,dt)}}
  else if(aggro){face(m,P.pos.x,P.pos.z,8,dt);
   if(d.ranged){const want=dist<6?-1:dist>11?1:0;spd=d.speed*(want===0?.4:1);const sx=Math.sin(m.yaw),sz=Math.cos(m.yaw);const strafe=want===0?Math.sin(m.t*.8):0;walk(m,sx*want+Math.cos(m.yaw)*strafe,sz*want-Math.sin(m.yaw)*strafe,spd,dt);
    if(m.atk<=0&&dist<16&&seesPlayer(m)){m.atk=2.2;const ox=m.pos.x,oy=m.pos.y+1.5,oz=m.pos.z;const tx=P.pos.x-ox,tz=P.pos.z-oz,hd=Math.hypot(tx,tz),sp=13,tt=hd/sp;const ty=P.pos.y+1.2-oy+.5*12*tt*tt;fire('thorn',ox,oy,oz,tx/hd*sp,ty/tt,tz/hd*sp,'mob',d.dmg*G.api.dmgMul());sfx('shoot')}}
   else if(d.fuse){spd=dist>1.6?d.speed:0;walk(m,dx/(dist||1),dz/(dist||1),spd,dt);if(dist<2.7&&Math.abs(dy)<2.5){if(m.fuse===0)sfx('fuse');m.fuse+=dt}else if(dist>5)m.fuse=Math.max(0,m.fuse-dt);
    if(m.fuse>=1.5){G.api.explode(m.pos.x,m.pos.y+.6,m.pos.z,2.6,14);m.hp=0;m.dead=.6;removeMob(m);return}}
   else{spd=dist>1.1?d.speed:0;walk(m,dx/(dist||1),dz/(dist||1),spd,dt);if(dist<1.5&&Math.abs(dy)<1.7&&m.atk<=0){m.atk=1;m.swing=.3;G.api.hurtPlayer(d.dmg*G.api.dmgMul(),m.pos)}}}
  else{m.wander-=dt;if(m.wander<=0){m.wander=2+Math.random()*5;m.wdir=Math.random()<.5?null:Math.random()*6.28}if(m.wdir!=null){spd=d.speed*.5;face(m,m.pos.x+Math.sin(m.wdir),m.pos.z+Math.cos(m.wdir),3,dt);walk(m,Math.sin(m.yaw),Math.cos(m.yaw),spd,dt)}else walk(m,0,0,0,dt)}}
 // water
 const inW=BLOCKS[G.world.get(Math.floor(m.pos.x),Math.floor(m.pos.y+.4),Math.floor(m.pos.z))].liquid;if(inW){m.vel.y=Math.min(m.vel.y+30*dt,2.5)}
 if(!m.flying)m.vel.y-=(inW?8:26)*dt;moveBody(m,dt);syncModel(m,dt,Math.hypot(m.vel.x,m.vel.z));
 // despawn far hostiles
 if(!m.boss&&dist>80)removeMob(m)}
function syncModel(m,dt,speed){const r=m.model.root;r.position.copy(m.pos);r.rotation.y=m.yaw;animate(m.model,m.t,speed,{armL:m.d.hostile&&m.type==='gloomie'?0:0});const l=lightAt(m.pos.x,m.pos.y+m.h*.6,m.pos.z);const base=m.d.tint||[1,1,1];
 if(m.hurt>0)m.model.mat.color.setRGB(1,.35,.35);else if(m.fuse>0&&Math.sin(m.fuse*m.fuse*12)>0)m.model.mat.color.setRGB(2,2,2);else m.model.mat.color.setRGB(base[0]*l,base[1]*l,base[2]*l);
 if(m.fuse>0){const s=1+m.fuse*.12;m.model.inner.scale.setScalar(s/16*(m.d.scale||1))}
 if(m.swing>0){m.swing-=dt;if(m.model.parts.armR)m.model.parts.armR.rotation.x=-1.45-Math.sin(m.swing*10)*.6}
 if(m.tellPose&&m.model.parts.armL){m.model.parts.armL.rotation.x=m.tellPose;m.model.parts.armR.rotation.x=m.tellPose}}
// ---------- bosses ----------
function bossUpdate(m,dt,dx,dz,dist,dy){const P=G.P;const d=m.d;m.tm-=dt;m.invuln=(m.invuln||0)-dt;m.weak=(m.weak||0)-dt;const nd=dist||1;const mul=G.api.dmgMul();
 for(const k in m.cool)m.cool[k]-=dt;const ready=(k,t)=>{if((m.cool[k]??t*.5)<=0){m.cool[k]=t;return true}if(m.cool[k]===undefined)m.cool[k]=t*.5;return false};
 m.tellPose=null;
 if(m.defeated){m.vel.x=m.vel.z=0;m.model.root.rotation.x=.25;if(!m.joined){m.joined=true;G.api.onAsmonYield(m)}return}
 if(P.dead){walk(m,0,0,0,dt);return}
 if(m.state==='tell'){m.tm-=0;walk(m,0,0,0,dt);face(m,P.pos.x,P.pos.z,m.lockAim?0:4,dt);m.tellPose=m.pose??-2.6;if(m.tm<=0){m.state='act';m.act(m)}return}
 if(m.state==='dash'){walk(m,m.dir[0],m.dir[1],m.dashSpd,dt);if(dist<1.8&&!m.dashHit){m.dashHit=true;G.api.hurtPlayer(m.dashDmg*mul,m.pos,10)}if(m.tm<=0||m.hitX||m.hitZ){m.state='recover';m.tm=1.1;m.weak=1.1;if(m.hitX||m.hitZ){burst(m.pos.x,m.pos.y+1,m.pos.z,['#ffffff','#bfe8ff'],16,4);sfx('slam')}}return}
 if(m.state==='leap'){m.flying=false;if(m.onGround&&m.tm<.6){m.state='recover';m.tm=.8;G.api.aoe(m.pos,2.9,7*mul,'mob');sfx('slam');burst(m.pos.x,m.pos.y+.3,m.pos.z,['#4a2f6e','#8a5ac4'],20,5)}return}
 if(m.state==='recover'||m.state==='act'){walk(m,0,0,0,dt);if(m.tm<=0)m.state='chase';return}
 // chase
 face(m,P.pos.x,P.pos.z,5,dt);const spd=dist>2.4?d.speed*(m.type==='asmon'&&m.hp<m.maxHp/3?1.25:1):0;walk(m,dx/nd,dz/nd,spd,dt);
 const tell=(t,act,pose)=>{m.state='tell';m.tm=t;m.act=act;m.pose=pose;sfx('roar')};
 const melee=(r,dmg)=>()=>{G.api.aoe(m.pos,r,dmg*mul,'mob');sfx('slam');burst(m.pos.x+Math.sin(m.yaw)*1.5,m.pos.y+.4,m.pos.z+Math.cos(m.yaw)*1.5,['#ffffff','#e0cf94'],14,4);m.state='recover';m.tm=.9;m.weak=.9};
 if(m.type==='colossus'){
  if(dist<3.6&&ready('slam',2.4))return tell(.85,melee(3.4,7),-3);
  if(ready('quake',7.5))return tell(1.1,()=>{wave(m.pos.x,m.pos.y,m.pos.z,7,13,5*mul);sfx('slam');m.state='recover';m.tm=1;m.weak=1},-.6);
  if(dist>4&&ready('throw',8.5))return tell(.6,()=>{const sp=11,tt=dist/sp;fire('boulder',m.pos.x,m.pos.y+3.4,m.pos.z,dx/nd*sp,(dy+.5*12*tt*tt-2.4)/tt,dz/nd*sp,'mob',6*mul);m.state='recover';m.tm=.6},-2.8);
  if(!m.summoned&&m.hp<m.maxHp*.5){m.summoned=true;for(const s of[-1,1])spawnMob('gloomie',m.pos.x+s*3,m.pos.y+.5,m.pos.z+2)}}
 if(m.type==='warden'){
  if(dist<3.2&&ready('swipe',1.8))return tell(.6,melee(3,6),-2.4);
  if(ready('volley',5))return tell(.7,()=>{const base=Math.atan2(dx,dz);for(let i=-2;i<=2;i++){const a=base+i*.22,sp=14;const tt=dist/sp;fire('icicle',m.pos.x,m.pos.y+2.6,m.pos.z,Math.sin(a)*sp,(dy-1+.5*4*tt*tt)/Math.max(.3,tt),Math.cos(a)*sp,'mob',4*mul)}sfx('shoot');m.state='recover';m.tm=.6},-2);
  if(dist>4&&ready('charge',9))return tell(1,()=>{m.state='dash';m.tm=.9;m.dir=[dx/nd,dz/nd];m.dashSpd=13;m.dashHit=false;m.dashDmg=8},-1.2);
  if(!m.summoned&&m.hp<m.maxHp*.5){m.summoned=true;for(const s of[-1,1])spawnMob('archer',m.pos.x+s*4,m.pos.y+.5,m.pos.z)}}
 if(m.type==='weaver'){
  if(dist<2.8&&ready('bite',1.5))return tell(.45,()=>{if(dist<3.2){G.api.hurtPlayer(5*mul,m.pos);P.poison=4}m.state='recover';m.tm=.5},0);
  if(ready('web',4.5))return tell(.4,()=>{const sp=12,tt=dist/sp;fire('web',m.pos.x,m.pos.y+1.4,m.pos.z,dx/nd*sp,(dy+.5*4*tt*tt)/Math.max(.3,tt),dz/nd*sp,'mob',1);m.state='recover';m.tm=.3},0);
  if(ready('leap',8))return tell(1,()=>{const tx=P.pos.x,tz=P.pos.z;timedRing(tx,P.pos.y,tz,2.9,1,null,0xb05aff);const T=1;m.vel.set((tx-m.pos.x)/T,13,(tz-m.pos.z)/T);m.state='leap';m.tm=T+.2},0);
  for(const th of[.66,.33])if(!m['s'+th]&&m.hp<m.maxHp*th){m['s'+th]=true;for(let k=0;k<3;k++)spawnMob('spiderling',m.pos.x+Math.cos(k*2)*3,m.pos.y+.5,m.pos.z+Math.sin(k*2)*3)}}
 if(m.type==='tidecrab'){
  if(dist<3.4&&ready('pinch',1.7))return tell(.55,melee(3.3,6),-1.6);
  if(ready('bubbles',4.8))return tell(.6,()=>{const base=Math.atan2(dx,dz);for(let i=-3;i<=3;i++){const a=base+i*.2,sp=8+Math.abs(i);fire('bubble',m.pos.x,m.pos.y+1.6,m.pos.z,Math.sin(a)*sp,2.5,Math.cos(a)*sp,'mob',3*mul)}sfx('shoot');m.state='recover';m.tm=.5},-.8);
  if(dist>4&&ready('scuttle',7))return tell(.9,()=>{const s=Math.random()<.5?1:-1;m.state='dash';m.tm=.7;m.dir=[(dx/nd)*.8+(-dz/nd)*.6*s,(dz/nd)*.8+(dx/nd)*.6*s];m.dashSpd=14;m.dashHit=false;m.dashDmg=7},-1);
  if(ready('wave',9)&&m.hp<m.maxHp*.75)return tell(1,()=>{wave(m.pos.x,m.pos.y,m.pos.z,7,12,5*mul,0x5ad0ff);sfx('slam');m.state='recover';m.tm=1;m.weak=1},-2.4);
  for(const th of[.5,.25])if(!m['s'+th]&&m.hp<m.maxHp*th){m['s'+th]=true;for(let k=0;k<3;k++)spawnMob('crab',m.pos.x+Math.cos(k*2)*3,m.pos.y+.5,m.pos.z+Math.sin(k*2)*3)}}
 if(m.type==='asmon'){const ph=m.hp>m.maxHp*.66?1:m.hp>m.maxHp*.33?2:3;if(ph!==m.phase){m.phase=ph;G.api.bossPhase(m,ph);m.invuln=1}
  if(dist<3.4&&ready('slash',1.6))return tell(.55,()=>{G.api.aoe(m.pos,3.4,6*mul,'mob');sfx('swing');m.state='recover';m.tm=.5;setTimeout(()=>{if(!m.dead&&!m.defeated&&G.P&&Math.hypot(G.P.pos.x-m.pos.x,G.P.pos.z-m.pos.z)<3.2){G.api.aoe(m.pos,3.2,5*mul,'mob');sfx('swing')}},350)},-2.8);
  if(dist>3.5&&ready('dash',ph===3?4.5:6.5))return tell(.8,()=>{m.state='dash';m.tm=.55;m.dir=[dx/nd,dz/nd];m.dashSpd=15;m.dashHit=false;m.dashDmg=8},-2);
  if(ph>=2&&ready('rain',7.5)){for(let k=0;k<7;k++){const a=Math.random()*6.28,r=k?1.5+Math.random()*4:0;const x=P.pos.x+Math.cos(a)*r,z=P.pos.z+Math.sin(a)*r,y=G.world.surface(x,z);timedRing(x,y,z,1.3,1.3,q=>{fire('coin',q.x,q.y+7,q.z,0,-16,0,'mob',5*mul)},0xffc24a)}sfx('coin');m.atk=1}
  if(ph===3&&!m.summoned){m.summoned=true;for(let k=0;k<3;k++)spawnMob('gilded',m.pos.x+Math.cos(k*2.1)*4,m.pos.y+.5,m.pos.z+Math.sin(k*2.1)*4)}
  if(ph===3&&ready('wave',9))return tell(1,()=>{wave(m.pos.x,m.pos.y,m.pos.z,8,14,6*mul,0xffd25a);sfx('slam');m.state='recover';m.tm=1;m.weak=1},-3)}}
export function updateEntities(dt){for(let i=G.mobs.length-1;i>=0;i--){const m=G.mobs[i];if(m)mobUpdate(m,dt)}updateItems(dt);updateProjectiles(dt);updateParticles(dt);updateTelegraphs(dt)}
export function clearEntities(){for(const m of[...G.mobs])removeMob(m);for(const it of G.items)G.scene.remove(it.mesh);G.items.length=0;for(const p of G.projectiles)G.scene.remove(p.mesh);G.projectiles.length=0;clearTelegraphs();PARTS.length=0}
