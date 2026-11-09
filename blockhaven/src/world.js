// Voxel world: storage, authored-procedural generation, light propagation and edits.
import {BLOCKS,B} from './blocks.js';
import {makeNoise,mulberry,hash2,hash3,smooth,clamp} from './util.js';
export const SEA=20;
export class World{
 constructor(kind='over',W=256,D=256,H=64){this.kind=kind;this.W=W;this.D=D;this.H=H;const n=W*D*H;this.data=new Uint8Array(n);this.sky=new Uint8Array(n);this.blk=new Uint8Array(n);this.hm=new Uint8Array(W*D);this.edits=new Map();this.meta=new Map();this.pois={};this.dirty=new Set();this.urgent=new Set();this.biome=new Uint8Array(W*D);this.protect=[]}
 idx(x,y,z){return (y*this.D+z)*this.W+x}
 inb(x,y,z){return x>=0&&z>=0&&y>=0&&x<this.W&&z<this.D&&y<this.H}
 get(x,y,z){if(y<0)return 19;if(x<0||z<0||y>=this.H||x>=this.W||z>=this.D)return 0;return this.data[(y*this.D+z)*this.W+x]}
 skyAt(x,y,z){if(y>=this.H||x<0||z<0||x>=this.W||z>=this.D)return 15;if(y<0)return 0;return this.sky[(y*this.D+z)*this.W+x]}
 blkAt(x,y,z){if(!this.inb(x,y,z))return 0;return this.blk[(y*this.D+z)*this.W+x]}
 raw(x,y,z,id){if(this.inb(x,y,z))this.data[this.idx(x,y,z)]=id}
 // Player/game edits: records diff for saving and relights + marks chunks dirty.
 set(x,y,z,id,record=true){if(!this.inb(x,y,z))return false;const i=this.idx(x,y,z);if(this.data[i]===id)return false;this.data[i]=id;if(record)this.edits.set(i,id);this.updateHM(x,z);this.relight(x,z);this.markDirty(x,y,z);return true}
 markDirty(x,y,z){const cx=x>>4,cz=z>>4;const A=k=>{this.dirty.add(k);this.urgent.add(k)};A(cx+','+cz);if((x&15)===0)A((cx-1)+','+cz);if((x&15)===15)A((cx+1)+','+cz);if((z&15)===0)A(cx+','+(cz-1));if((z&15)===15)A(cx+','+(cz+1))}
 att(id){const b=BLOCKS[id];if(!b)return 0;if(b.opaque)return 15;if(b.liquid)return 2;if(id===9||id===36||id===50||id===14)return 1;return 0}
 updateHM(x,z){let y=this.H-1;while(y>=0&&this.att(this.data[this.idx(x,y,z)])===0)y--;this.hm[z*this.W+x]=y+1}
 surface(x,z){x=clamp(Math.floor(x),0,this.W-1);z=clamp(Math.floor(z),0,this.D-1);for(let y=this.H-1;y>=0;y--){const b=BLOCKS[this.data[this.idx(x,y,z)]];if(b&&b.solid)return y+1}return 0}
 isProtected(x,y,z){return this.protect.some(p=>x>=p[0]&&x<=p[3]&&y>=p[1]&&y<=p[4]&&z>=p[2]&&z<=p[5])}
 // ---------- lighting ----------
 lightRegion(x0,z0,x1,z1){const{W,D,H}=this;x0=Math.max(0,x0);z0=Math.max(0,z0);x1=Math.min(W-1,x1);z1=Math.min(D-1,z1);const q=this.q||(this.q=new Int32Array(1<<21));const QM=(1<<21)-1;
  let qh=0,qt=0;const push=i=>{q[qt&QM]=i;qt++};
  // clear + column skylight + sources
  for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){let l=15;for(let y=H-1;y>=0;y--){const i=(y*D+z)*W+x,id=this.data[i],a=this.att(id);if(a>=15)l=0;else if(a)l=Math.max(0,l-a);this.sky[i]=l;const e=BLOCKS[id].light;this.blk[i]=e}}
  // sky seeds: lit cells below a neighbour's skyline
  const hmN=(x,z)=>(x<0||z<0||x>=W||z>=D)?0:this.hm[z*W+x];
  for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const top=Math.max(hmN(x-1,z),hmN(x+1,z),hmN(x,z-1),hmN(x,z+1));for(let y=Math.min(H-1,top);y>=0;y--){const i=(y*D+z)*W+x;if(this.sky[i]>1)push(i)}}
  // border cells from outside the region push inward
  const border=(x,z)=>{if(x<0||z<0||x>=W||z>=D)return;for(let y=0;y<H;y++){const i=(y*D+z)*W+x;if(this.sky[i]>1)push(i)}};
  if(x0>0||x1<W-1||z0>0||z1<D-1){for(let x=x0-1;x<=x1+1;x++){border(x,z0-1);border(x,z1+1)}for(let z=z0;z<=z1;z++){border(x0-1,z);border(x1+1,z)}}
  this.flood(this.sky,q,qh,qt,QM,true);
  qh=0;qt=0;for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)for(let y=0;y<H;y++){const i=(y*D+z)*W+x;if(this.blk[i]>1)push(i)}
  const borderB=(x,z)=>{if(x<0||z<0||x>=W||z>=D)return;for(let y=0;y<H;y++){const i=(y*D+z)*W+x;if(this.blk[i]>1)push(i)}};
  if(x0>0||x1<W-1||z0>0||z1<D-1){for(let x=x0-1;x<=x1+1;x++){borderB(x,z0-1);borderB(x,z1+1)}for(let z=z0;z<=z1;z++){borderB(x0-1,z);borderB(x1+1,z)}}
  this.flood(this.blk,q,qh,qt,QM,false)}
 flood(L,q,qh,qt,QM,isSky){const{W,D,H,data}=this;const WD=W*D;
  while(qh<qt){const i=q[qh&QM];qh++;const l=L[i];if(l<=1)continue;const y=(i/WD)|0,r=i-y*WD,z=(r/W)|0,x=r-z*W;
   const tryN=(j)=>{const a=this.att(data[j]);if(a>=15)return;const nl=l-1-a;if(nl>L[j]){L[j]=nl;q[qt&QM]=j;qt++}};
   if(x>0)tryN(i-1);if(x<W-1)tryN(i+1);if(z>0)tryN(i-W);if(z<D-1)tryN(i+W);if(y>0)tryN(i-WD);if(y<H-1)tryN(i+WD)}}
 relight(x,z){// recompute lighting near an edit and mark chunks whose light changed
  const r=15,x0=Math.max(0,x-r),x1=Math.min(this.W-1,x+r),z0=Math.max(0,z-r),z1=Math.min(this.D-1,z+r);const{W,D,H}=this;
  const snap=new Uint8Array((x1-x0+1)*(z1-z0+1)*H*2);let k=0;for(let y=0;y<H;y++)for(let zz=z0;zz<=z1;zz++)for(let xx=x0;xx<=x1;xx++){const i=(y*D+zz)*W+xx;snap[k++]=this.sky[i];snap[k++]=this.blk[i]}
  this.lightRegion(x0,z0,x1,z1);k=0;const changed=new Set();for(let y=0;y<H;y++)for(let zz=z0;zz<=z1;zz++)for(let xx=x0;xx<=x1;xx++){const i=(y*D+zz)*W+xx;if(snap[k++]!==this.sky[i]|snap[k++]!==this.blk[i]){changed.add((xx>>4)+','+(zz>>4));if((xx&15)===0)changed.add(((xx>>4)-1)+','+(zz>>4));if((xx&15)===15)changed.add(((xx>>4)+1)+','+(zz>>4));if((zz&15)===0)changed.add((xx>>4)+','+((zz>>4)-1));if((zz&15)===15)changed.add((xx>>4)+','+((zz>>4)+1))}}
  for(const c of changed)this.dirty.add(c)}
 lightAll(){for(let z=0;z<this.D;z++)for(let x=0;x<this.W;x++)this.updateHM(x,z);this.lightRegion(0,0,this.W-1,this.D-1)}
 applyEdits(list){for(const[i,id]of list){if(i>=0&&i<this.data.length){this.data[i]=id;this.edits.set(i,id)}}}
}
// ---------------- Overworld generation ----------------
export const ANCHORS={village:[128,128],forest:[62,70],desert:[128,214],frost:[200,60],gloom:[208,178]};
export const BIOME={meadow:0,forest:1,desert:2,frost:3,gloom:4,village:5,beach:6,ocean:7};
export function generateOverworld(seed=7331){const w=new World('over');const N=makeNoise(seed),N2=makeNoise(seed+1),N3=makeNoise(seed+2);const R=mulberry(seed+9);const{W,D,H}=w;
 const heights=new Int16Array(W*D);
 for(let z=0;z<D;z++)for(let x=0;x<W;x++){
  const wx=x+N.fbm2(x/50,z/50,2)*14,wz=z+N.fbm2(x/50+40,z/50+40,2)*14;
  const wt=k=>{const[ax,az]=ANCHORS[k];const r={forest:58,desert:52,frost:62,gloom:52,village:30}[k];return clamp(1-Math.hypot(wx-ax,wz-az)/r,0,1)};
  const wf=wt('forest'),wd=wt('desert'),wfr=wt('frost'),wg=wt('gloom'),wv=wt('village');
  let h=24+N.fbm2(x/64,z/64,4)*9+N.fbm2(x/16,z/16,2)*2.2;
  h+=wf*2;
  const ridge=1-Math.abs(N2.fbm2(x/34,z/34,3));h+=Math.pow(wfr,1.15)*(20+ridge*16);
  h=h*(1-wd)+(23+Math.sin(x/5.5+N.n2(x/20,z/20)*3)*1.3+N.fbm2(x/30,z/30,2)*2)*wd;
  h-=wg*3;
  const dv=Math.hypot(x-128,z-128);if(dv<34){const t=smooth(clamp((dv-20)/14,0,1));h=24*(1-t)+h*t}
  // island rim
  const rr=Math.hypot(x-128,z-128)+N3.fbm2(x/40,z/40,3)*16;if(rr>96){const t=smooth(clamp((rr-96)/20,0,1));h=h*(1-t)+11*t}
  h=Math.round(clamp(h,4,H-7));heights[z*W+x]=h;
  let bi=BIOME.meadow;const top=Math.max(wf,wd,wfr,wg);if(dv<30)bi=BIOME.village;else if(top>.08){bi=[BIOME.forest,BIOME.desert,BIOME.frost,BIOME.gloom][[wf,wd,wfr,wg].indexOf(top)]}
  if(h<=SEA+1&&bi!==BIOME.frost&&bi!==BIOME.village)bi=h<SEA-1?BIOME.ocean:BIOME.beach;w.biome[z*W+x]=bi;
  for(let y=0;y<=h;y++){let id;if(y===0||(y<3&&hash3(x,y,z,seed)<.5))id=B.deepstone;else if(y<h-3)id=B.stone;else{
    if(bi===BIOME.desert)id=y===h||y>=h-2?B.sand:B.sandstone;else if(bi===BIOME.beach||bi===BIOME.ocean)id=B.sand;else if(bi===BIOME.frost)id=y===h?(h>44?B.snow:B.snowgrass):(h>34?B.stone:B.dirt);else if(bi===BIOME.gloom)id=y===h?(h<SEA?B.dirt:B.gloomgrass):B.dirt;else id=y===h?(h<SEA?B.dirt:B.grass):B.dirt;
    if(y===h&&h<SEA&&bi!==BIOME.desert&&N.n2(x/9,z/9)>.1)id=B.sand}
   w.data[w.idx(x,y,z)]=id}
  for(let y=h+1;y<=SEA;y++)w.data[w.idx(x,y,z)]=(bi===BIOME.frost&&y===SEA)?B.ice:B.water}
 // caves
 for(let z=0;z<D;z++)for(let x=0;x<W;x++){const h=heights[z*W+x];const dv=Math.hypot(x-128,z-128);const lim=dv<36?Math.min(h-9,14):h-(h<=SEA+1?6:1);for(let y=3;y<=lim;y++){const i=w.idx(x,y,z);const a=N2.n3(x/30,y/17,z/30),b=N3.n3(x/30+70,y/17,z/30);let air=a*a+b*b<.0048;if(!air&&y<22){const c=N.n3(x/44,y/15,z/44);air=c>.33-(22-y)*.004}if(air)w.data[i]=y<=5?B.magma:0}}
 // ores
 const vein=(id,count,size,ymax,ymin=1,region)=>{for(let n=0;n<count;n++){let x=Math.floor(R()*W),z=Math.floor(R()*D),y=ymin+Math.floor(R()*(ymax-ymin));if(region){const[ax,az,rad]=region;const a=R()*6.28,r=R()*rad;x=Math.floor(ax+Math.cos(a)*r);z=Math.floor(az+Math.sin(a)*r)}for(let k=0;k<size;k++){const xx=x+Math.floor(R()*3)-1,yy=y+Math.floor(R()*3)-1,zz=z+Math.floor(R()*3)-1;if(w.inb(xx,yy,zz)&&w.get(xx,yy,zz)===B.stone)w.raw(xx,yy,zz,id);x=xx;y=yy;z=zz}}};
 vein(B.coal_ore,700,9,50,4);vein(B.iron_ore,430,6,40,3);vein(B.gold_ore,170,5,24,2);vein(B.star_ore,70,4,13,2);vein(B.star_ore,70,4,14,2,[208,178,40]);vein(B.duskstone,60,6,9,1);
 // surface coal & iron near village so the opening is approachable
 vein(B.coal_ore,40,7,26,16,[128,128,60]);vein(B.iron_ore,40,5,22,8,[128,128,55]);
 // trees and plants
 const tree=(x,y,z,kind)=>{const h=kind==='pine'?6+Math.floor(R()*3):4+Math.floor(R()*3);const log=kind==='pine'?B.pine_log:kind==='gloom'?B.gloom_log:B.log,leaf=kind==='pine'?B.pine_leaves:kind==='gloom'?B.gloom_leaves:B.leaves;if(y+h+2>=H)return;
  for(let i=0;i<h;i++)w.raw(x,y+i,z,log);
  if(kind==='pine'){for(let ly=2;ly<=h+1;ly++){const r=ly>h?0:Math.min(2,Math.floor((h-ly)/2.5)+((ly%2)?1:0));for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++)if(Math.abs(dx)+Math.abs(dz)<=r+(r>1?1:0)&&w.get(x+dx,y+ly,z+dz)===0)w.raw(x+dx,y+ly,z+dz,leaf)}}
  else for(let ly=h-3;ly<=h+1;ly++){const r=ly>=h?1:2;for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){if(r===2&&Math.abs(dx)===2&&Math.abs(dz)===2&&R()<.6)continue;if(w.get(x+dx,y+ly,z+dz)===0)w.raw(x+dx,y+ly,z+dz,leaf)}}};
 for(let z=3;z<D-3;z++)for(let x=3;x<W-3;x++){const h=heights[z*W+x],bi=w.biome[z*W+x],top=w.get(x,h,z);if(w.get(x,h+1,z)!==0)continue;const r=hash2(x,z,seed);
  if(top===B.grass){const d=bi===BIOME.forest?.055:bi===BIOME.village?0:.01;if(r<d)tree(x,h+1,z,'oak');else if(r<d+.1&&bi!==BIOME.village)w.raw(x,h+1,z,B.tallgrass);else if(r<d+.12)w.raw(x,h+1,z,[B.flower_red,B.flower_yellow,B.flower_blue][Math.floor(hash2(z,x,3)*3)]);else if(r<d+.127&&bi!==BIOME.village)w.raw(x,h+1,z,B.berry_bush)}
  else if(top===B.snowgrass||top===B.snow){if(r<.014&&h<46)tree(x,h+1,z,'pine')}
  else if(top===B.gloomgrass){if(r<.045)tree(x,h+1,z,'gloom');else if(r<.08)w.raw(x,h+1,z,B.mushroom);else if(r<.1)w.raw(x,h+1,z,B.tallgrass)}
  else if(top===B.sand&&bi===BIOME.desert){if(r<.007){const ch=2+Math.floor(R()*2);for(let i=1;i<=ch;i++)w.raw(x,h+i,z,B.cactus)}}}
 // cave mushrooms
 for(let n=0;n<2600;n++){const x=Math.floor(R()*W),z=Math.floor(R()*D),y=4+Math.floor(R()*30);if(w.get(x,y,z)===0&&w.get(x,y-1,z)===B.stone)w.raw(x,y,z,B.mushroom)}
 buildStructures(w,heights,R);
 buildFerryDock(w);
 return w}
// Ferry dock on Honeyvale's west shore: the bell sails you to the Coast (Venice Beach / Santa Monica).
function buildFerryDock(w){let x=104;const z=128;while(x>2){const h=w.surface(x,z);if(h<=SEA+1&&w.get(x,SEA,z)===B.water)break;x--}
 const shore=x+1;for(let xx=104;xx>shore;xx--){const h=w.surface(xx,z);for(const zz of[z-1,z,z+1]){w.raw(xx,h-1,zz,B.cobble);for(let y=h;y<h+3;y++)if(w.get(xx,y,zz)!==B.water)w.raw(xx,y,zz,0)}}
 const end=Math.max(2,shore-12);for(let xx=shore+2;xx>=end;xx--){for(const zz of[z-1,z,z+1])w.raw(xx,SEA+1,zz,B.boardwalk);if(xx%3===0)for(const zz of[z-2,z+2]){for(let y=SEA-4;y<=SEA+2;y++)w.raw(xx,y,zz,B.palm_log)}}
 for(const zz of[z-2,z+2])w.raw(end,SEA+2,zz,B.lamp);w.raw(end,SEA+2,z,B.ferry_bell);
 w.pois.ferry={x:end,y:SEA+2,z,stand:{x:end+2.5,y:SEA+2,z:z+.5}};w.protect.push([end-1,SEA-5,z-2,shore+2,SEA+4,z+2])}

function fill(w,x0,y0,z0,x1,y1,z1,id){for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)w.raw(x,y,z,id)}
function hollow(w,x0,y0,z0,x1,y1,z1,wall,inner=0){fill(w,x0,y0,z0,x1,y1,z1,wall);fill(w,x0+1,y0+1,z0+1,x1-1,y1-1,z1-1,inner)}
function house(w,x,y,z,wx,wz,h,wall,roof,floor){fill(w,x-1,y,z-1,x+wx,y+h+4,z+wz,0);fill(w,x,y-1,z,x+wx-1,y-1,z+wz-1,floor);
 for(let yy=y;yy<y+h;yy++)for(let zz=z;zz<z+wz;zz++)for(let xx=x;xx<x+wx;xx++){const edge=xx===x||xx===x+wx-1||zz===z||zz===z+wz-1;if(!edge)continue;const corner=(xx===x||xx===x+wx-1)&&(zz===z||zz===z+wz-1);w.raw(xx,yy,zz,corner?B.log:wall)}
 // windows
 for(const[xx,zz]of[[x+2,z],[x+wx-3,z],[x,z+2],[x+wx-1,z+wz-3],[x+2,z+wz-1]])w.raw(xx,y+1,zz,B.glass);
 // roof: stepped
 for(let s=0;s<=Math.ceil(wz/2);s++)for(let xx=x-1;xx<=x+wx;xx++){w.raw(xx,y+h+s,z-1+s,roof);w.raw(xx,y+h+s,z+wz-s,roof);for(let zz=z+s;zz<z+wz-s;zz++)if(xx===x||xx===x+wx-1)w.raw(xx,y+h+s,zz,wall)}
 // door (south side, z min)
 const dx=x+Math.floor(wx/2);w.raw(dx,y,z,0);w.raw(dx,y+1,z,0)}
function flatten(w,x0,z0,x1,z1,y,top=B.grass){for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){for(let yy=y+1;yy<w.H;yy++)w.raw(x,yy,z,0);for(let yy=y-4;yy<y;yy++)if(w.get(x,yy,z)===0||!BLOCKS[w.get(x,yy,z)].solid)w.raw(x,yy,z,B.dirt);w.raw(x,y,z,top)}}
function buildStructures(w,heights,R){const P=w.pois;const H=w.H;
 // ---- Village of Honeyvale (centre) ----
 const vy=24;flatten(w,100,100,156,156,vy);
 // paths
 for(let i=104;i<=152;i++){for(const k of[127,128,129]){w.raw(i,vy,k,B.cobble);w.raw(k,vy,i,B.cobble)}}
 // plaza
 for(let z=119;z<=137;z++)for(let x=119;x<=137;x++)if(Math.hypot(x-128,z-128)<9.5)w.raw(x,vy,z,B.stone_bricks);
 // Lantern Gate (Kermit) on the plaza's north side
 const gx=126,gz=121;for(let y=vy+1;y<=vy+5;y++){w.raw(gx-1,y,gz,B.gate);w.raw(gx+4,y,gz,B.gate)}for(let x=gx-1;x<=gx+4;x++){w.raw(x,vy+6,gz,B.gate);w.raw(x,vy,gz,B.gate)}
 const sockets=[[gx-1,vy+1,gz+1],[gx+1,vy+1,gz+2],[gx+4,vy+1,gz+1]];for(const[x,y,z]of[[gx-2,vy+1,gz],[gx+5,vy+1,gz]])w.raw(x,y,z,B.lamp);
 sockets.forEach(([x,y,z])=>w.raw(x,y,z,B.socket));
 P.gate={x:gx,y:vy+1,z:gz,inner:[gx,vy+1,gz,gx+3,vy+5,gz],sockets};
 // well
 hollow(w,131,vy-3,131,135,vy+1,135,B.cobble,B.water);fill(w,132,vy+1,132,134,vy+1,134,0);for(const[x,z]of[[131,131],[135,131],[131,135],[135,135]])fill(w,x,vy+2,z,x,vy+3,z,B.planks);fill(w,131,vy+4,131,135,vy+4,135,B.planks);
 // Bean's farmhouse + fields (NW)
 house(w,108,vy+1,108,8,7,4,B.planks,B.felt_green,B.planks);
 for(let z=106;z<=116;z++)for(let x=118;x<=124;x++){if(x===121){w.raw(x,vy,z,B.water)}else{w.raw(x,vy,z,B.dirt);w.raw(x,vy+1,z,30+((x+z)%3===0?3:Math.floor(hash2(x,z,5)*4)))}}
 // Mr Pooping's smithy (NE)
 house(w,138,vy+1,106,9,8,4,B.cobble,B.bricks,B.stone_bricks);w.raw(140,vy+1,110,B.kiln_lit);w.raw(141,vy+1,110,B.kiln);w.raw(144,vy+1,111,B.iron_block);w.raw(143,vy+1,112,B.workbench);w.raw(142,vy+1,113,B.lamp);
 // Pooh's honey shop (SE)
 house(w,138,vy+1,140,9,8,4,B.felt_yellow,B.felt_pink,B.planks);w.raw(141,vy+1,143,B.gold_block);w.raw(142,vy+1,143,B.gold_block);w.raw(143,vy+1,143,B.gold_block);w.raw(145,vy+1,146,B.chest);w.raw(140,vy+3,145,B.lamp);w.raw(145,vy+3,142,B.lamp);
 // Bronny's watchtower (SW)
 hollow(w,108,vy+1,140,114,vy+12,146,B.stone_bricks,0);w.raw(111,vy+1,140,0);w.raw(111,vy+2,140,0);for(let y=vy+1;y<vy+12;y++){const k=(y-vy-1)%8,pos=[[109,141],[110,141],[111,141],[112,141],[113,141],[113,142],[113,143],[113,144]][k];w.raw(pos[0],y,pos[1],B.planks)}fill(w,107,vy+12,139,115,vy+12,147,B.planks);fill(w,109,vy+12,141,113,vy+12,145,0);for(let x=107;x<=115;x+=2){w.raw(x,vy+13,139,B.stone_bricks);w.raw(x,vy+13,147,B.stone_bricks)}w.raw(111,vy+12,146,B.lamp);
 // Player's starter cottage spot (east of plaza) - a little camp with a bench
 w.raw(150,vy+1,126,B.workbench);w.raw(151,vy+1,130,B.chest);
 // lamp posts
 for(const[x,z]of[[118,118],[138,118],[118,138],[138,138],[128,104],[128,152],[104,128],[152,128]]){fill(w,x,vy+1,z,x,vy+2,z,B.log);w.raw(x,vy+3,z,B.lamp)}
 w.protect.push([100,0,100,156,H,156]);
 P.village={x:128,y:vy+1,z:128};P.spawn={x:128.5,y:vy+1,z:133.5};
 P.npcs=[{id:'bean',x:117.5,y:vy+1,z:113.5},{id:'pooping',x:142.5,y:vy+1,z:115.5},{id:'pooh',x:142.5,y:vy+1,z:145.5},{id:'bronny',x:111.5,y:vy+1,z:137.5},{id:'kermit',x:131.5,y:vy+1,z:122.5}];
 w.meta.set('chest:'+w.idx(151,vy+1,130),{items:[[111,3],[100,2]]});w.meta.set('chest:'+w.idx(145,vy+1,146),{items:[[163,2],[105,5]]});
 // ---- Sunken Shrine (desert south) ----
 {const cx=128,cz=212,base=23;const half=12;for(let l=0;l<=11;l++){const r=half-l;fill(w,cx-r,base+l,cz-r,cx+r,base+l,cz+r,l%3===2?B.stone_bricks:B.sandstone)}
  fill(w,cx-half,base-3,cz-half,cx+half,base-1,cz+half,B.sandstone);
  // inner chamber
  fill(w,cx-7,base,cz-7,cx+7,base+6,cz+7,0);fill(w,cx-7,base-1,cz-7,cx+7,base-1,cz+7,B.stone_bricks);for(let x=cx-7;x<=cx+7;x+=4){w.raw(x,base+3,cz-7,B.torch)}
  // tunnel entrance north
  fill(w,cx-1,base,cz-half-1,cx+1,base+2,cz-7,0);w.raw(cx-2,base+2,cz-half,B.torch);w.raw(cx+2,base+2,cz-half,B.torch);
  for(const[x,z]of[[cx-5,cz-5],[cx+5,cz-5],[cx-5,cz+5],[cx+5,cz+5]])fill(w,x,base,z,x,base+5,z,B.sandstone);
  for(const[x,z]of[[cx-3,cz-3],[cx+3,cz-3],[cx-3,cz+3],[cx+3,cz+3]])w.raw(x,base+5,z,B.lamp);
  w.raw(cx,base,cz+6,B.chest);w.meta.set('chest:'+w.idx(cx,base,cz+6),{items:[[103,4],[102,6],[112,4],[109,12],[105,20]]});
  P.shrine={x:cx,y:base,z:cz,box:[cx-7,base,cz-7,cx+7,base+6,cz+7],door:{x:cx,y:base,z:cz-half-2}};w.protect.push([cx-half-1,0,cz-half-1,cx+half+1,H,cz+half+1])}
 // ---- Frostpeak Spire (north-east summit) ----
 {let best=[200,60,0];for(let z=40;z<84;z++)for(let x=180;x<224;x++){const h=heights[z*w.W+x];if(h>best[2])best=[x,z,h]}const[sx,sz]=best;const top=Math.min(best[2]+1,H-12);
  fill(w,sx-8,top,sz-8,sx+8,H-1,sz+8,0);for(let z=sz-8;z<=sz+8;z++)for(let x=sx-8;x<=sx+8;x++){if(Math.hypot(x-sx,z-sz)>8.6)continue;for(let y=top-6;y<top;y++)if(!BLOCKS[w.get(x,y,z)].solid)w.raw(x,y,z,B.stone);w.raw(x,top-1,z,(x+z)%2?B.ice:B.stone_bricks);if(Math.hypot(x-sx,z-sz)>7.6){w.raw(x,top,z,B.stone_bricks)}}
  for(const[x,z]of[[sx-6,sz-6],[sx+6,sz-6],[sx-6,sz+6],[sx+6,sz+6]]){fill(w,x,top,z,x,top+3,z,B.stone_bricks);w.raw(x,top+4,z,B.lamp)}
  // stairway down to the south
  let x=sx,y=top-1,z=sz+9;w.raw(sx,top,sz+8,0);w.raw(sx-1,top,sz+8,0);
  for(let i=0;i<60&&y>2;i++){const g=w.surface(x,z)-1;if(g>=y&&i>2)break;for(const dx of[0,-1]){w.raw(x+dx,y-1,z,B.cobble);for(let k=0;k<4;k++)w.raw(x+dx,y+k,z,0)}if(i%5===0)w.raw(x+1,y,z,B.torch);z++;y--}
  P.spire={x:sx,y:top,z:sz,box:[sx-8,top-1,sz-8,sx+8,top+8,sz+8],door:{x:sx,y:y,z:z}};w.protect.push([sx-9,top-7,sz-9,sx+9,H,sz+9])}
 // ---- Gloomroot Hollow (east) ----
 {const cx=210,cz=180,s=w.surface(cx,cz);const cy=8;
  // boss cavern
  for(let y=3;y<=16;y++)for(let z=cz-12;z<=cz+12;z++)for(let x=cx-12;x<=cx+12;x++){const d=((x-cx)/12)**2+((y-9)/7.5)**2+((z-cz)/12)**2;if(d<1)w.raw(x,y,z,y<=4?B.stone:0);else if(d<1.25&&BLOCKS[w.get(x,y,z)].solid===false)w.raw(x,y,z,B.stone)}
  fill(w,cx-11,4,cz-11,cx+11,4,cz+11,B.stone);for(let z=cz-11;z<=cz+11;z++)for(let x=cx-11;x<=cx+11;x++){if(Math.hypot(x-cx,z-cz)<11.5)w.raw(x,4,z,hash2(x,z,8)<.15?B.magma:B.mossy)}
  for(let i=0;i<40;i++){const a=R()*6.28,r=6+R()*5;const x=Math.round(cx+Math.cos(a)*r),z=Math.round(cz+Math.sin(a)*r),y=5+Math.floor(R()*6);if(w.get(x,y,z)===0)w.raw(x,y,z,B.web)}
  for(let i=0;i<26;i++){const a=R()*6.28,b=R()*1.2;const x=Math.round(cx+Math.cos(a)*12.4),z=Math.round(cz+Math.sin(a)*12.4),y=Math.round(6+b*6);if(w.get(x,y,z)===B.stone)w.raw(x,y,z,i%3===0?B.star_ore:B.gloom_leaves)}
  // shaft with spiral stairs from the surface
  const sxx=cx,szz=cz-15;const ring=[];for(let i=0;i<5;i++)ring.push([i,0]);for(let i=1;i<5;i++)ring.push([4,i]);for(let i=3;i>=0;i--)ring.push([i,4]);for(let i=3;i>0;i--)ring.push([0,i]);
  const top=Math.max(s,w.surface(sxx,szz));fill(w,sxx-3,6,szz-3,sxx+3,top+1,szz+3,B.stone_bricks);fill(w,sxx-2,5,szz-2,sxx+2,top+6,szz+2,0);
  let k=0;for(let y=top;y>=5;y--){const[px,pz]=ring[k%ring.length];w.raw(sxx-2+px,y-1,szz-2+pz,B.stone_bricks);if(k%6===0)w.raw(sxx-2+px,y+1,szz-2+pz,B.torch);k++}
  // connect shaft bottom to cavern
  fill(w,sxx-1,5,szz+2,sxx+1,8,cz-8,0);fill(w,sxx-1,4,szz+2,sxx+1,4,cz-8,B.stone_bricks);
  // ruined archway at surface
  for(const[x,z]of[[sxx-3,szz-3],[sxx+3,szz-3],[sxx-3,szz+3],[sxx+3,szz+3]])fill(w,x,top+1,z,x,top+4,z,B.mossy);fill(w,sxx-3,top+1,szz-3,sxx+3,top+1,szz+3,B.mossy);fill(w,sxx-2,top+1,szz-2,sxx+2,top+1,szz+2,0);w.raw(sxx,top+1,szz-3,0);w.raw(sxx,top+2,szz-3,0);fill(w,sxx-1,top+1,szz-4,sxx+1,top+3,szz-4,0);
  P.hollow={x:cx,y:5,z:cz,box:[cx-12,4,cz-12,cx+12,16,cz+12],door:{x:sxx,y:top+1,z:szz-4}};w.protect.push([cx-13,0,cz-13,cx+13,18,cz+13],[sxx-4,0,szz-4,sxx+4,H,szz+4])}
 // ---- small cave dungeons ----
 P.dungeons=[];let tries=0;while(P.dungeons.length<7&&tries++<400){const x=20+Math.floor(R()*216),z=20+Math.floor(R()*216),y=8+Math.floor(R()*14);if(Math.hypot(x-128,z-128)<40||Math.hypot(x-128,z-128)>100)continue;if(w.get(x,y,z)!==0)continue;let solid=0;for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)if(BLOCKS[w.get(x+dx,y-1,z+dz)].solid)solid++;if(solid<20)continue;
  hollow(w,x-4,y-1,z-4,x+4,y+4,z+4,B.mossy,0);for(let i=-1;i<=1;i++){w.raw(x+i,y,z-4,0);w.raw(x+i,y+1,z-4,0);w.raw(x+4,y,z+i,0);w.raw(x+4,y+1,z+i,0)}w.raw(x,y,z+3,B.chest);
  const loot=[[101,4+Math.floor(R()*6)],[102,2+Math.floor(R()*4)],[112,2],[109,8]];if(R()<.6)loot.push([103,2+Math.floor(R()*3)]);if(R()<.35)loot.push([104,1]);if(R()<.4)loot.push([[129,145,128][Math.floor(R()*3)],1]);w.meta.set('chest:'+w.idx(x,y,z+3),{items:loot});P.dungeons.push({x,y,z})}
}
// ---------------- The Hoard (Asmon's sky realm) ----------------
export function generateRealm(seed=99){const w=new World('realm',96,96,64);const N=makeNoise(seed),R=mulberry(seed);const P=w.pois;
 const island=(cx,cz,r,y,deep)=>{for(let z=cz-r-4;z<=cz+r+4;z++)for(let x=cx-r-4;x<=cx+r+4;x++){const d=Math.hypot(x-cx,z-cz)+N.n2(x/6,z/6)*3;if(d>r)continue;const depth=Math.floor((1-d/r)*deep)+1;for(let k=0;k<depth;k++)w.raw(x,y-k,z,k===0?B.hoardstone:hash3(x,y-k,z)<.08?B.gold_ore:B.hoardstone)}};
 island(48,40,17,30,9);island(48,82,7,28,5);island(20,30,5,33,4);island(76,28,6,26,4);island(70,62,4,35,3);island(22,64,5,31,4);
 // gold hoard piles
 for(let i=0;i<70;i++){const a=R()*6.28,r=8+R()*7,x=Math.round(48+Math.cos(a)*r),z=Math.round(40+Math.sin(a)*r);const s=w.surface(x,z);if(s>20)w.raw(x,s,z,R()<.8?B.gold_block:B.chest)}
 // arena floor
 for(let z=28;z<=52;z++)for(let x=36;x<=60;x++)if(Math.hypot(x-48,z-40)<11){w.raw(x,30,z,(x+z)%2?B.stone_bricks:B.hoardstone);for(let y=31;y<40;y++)w.raw(x,y,z,0)}
 for(let a=0;a<6.28;a+=.5){const x=Math.round(48+Math.cos(a)*10),z=Math.round(40+Math.sin(a)*10);w.raw(x,31,z,B.stone_bricks);w.raw(x,32,z,B.stone_bricks);w.raw(x,33,z,B.lamp)}
 // throne
 fill(w,46,31,29,50,31,30,B.gold_block);fill(w,47,32,29,49,34,29,B.gold_block);w.raw(48,35,29,B.lamp);
 // bridge from spawn island
 for(let z=50;z<=76;z++){const y=Math.round(28+(z-76)*-2/26);for(const x of[47,48,49])w.raw(x,y,z,B.planks);if(z%4===0){w.raw(46,y+1,z,B.torch);w.raw(50,y+1,z,B.torch)}}
 // return gate on spawn island
 for(let y=29;y<=33;y++){w.raw(46,y,86,B.gate);w.raw(50,y,86,B.gate)}for(let x=46;x<=50;x++)w.raw(x,34,86,B.gate);
 P.returnGate={inner:[47,29,86,49,33,86]};P.spawn={x:48.5,y:29,z:80.5};P.arena={x:48,y:31,z:40,box:[37,30,29,59,40,51]};
 for(let i=0;i<4;i++){const x=40+i*5,z=34;}
 return w}

// ---------------- The Coast: Venice Beach (south) and Santa Monica (north), one continuous shoreline ----------------
export function generateCoast(seed=310){const W=128,D=256,H=64;const w=new World('coast',W,D,H);const N=makeNoise(seed),R=mulberry(seed);const P=w.pois;
 const land=(x,z)=>{if(x<44)return Math.floor(11+x*.2+N.n2(x/9,z/9)*1.2);return 21+Math.floor((x-44)/16)};
 // terrain: ocean -> beach -> bike path -> promenade -> town / bluff
 for(let z=0;z<D;z++)for(let x=0;x<W;x++){let h=land(x,z);let top=B.sand;
  if(x>=87&&x<=89){h=23;top=x===88&&z%6<4?B.asphalt_line:B.asphalt}
  else if(x>=90&&x<=93){h=23;top=B.concrete}
  else if(x>=94){h=23;top=z<112?B.grass:B.concrete}
  for(let y=0;y<=h;y++){let id=y===h?top:y>h-3?(x>=87?B.dirt:B.sand):y<8?B.stone:B.sandstone;if(y===0)id=B.deepstone;w.raw(x,y,z,id)}
  for(let y=h+1;y<=SEA;y++)w.raw(x,y,z,B.water)}
 // Santa Monica bluffs (Palisades feel): tall sandstone cliff with a grassy park on top
 for(let z=0;z<108;z++)for(let x=96;x<W;x++){const top=32+Math.floor(N.n2(x/14,z/14)*1.5);const edge=x<100;for(let y=23;y<=top;y++)w.raw(x,y,z,y===top?B.grass:y>top-2?B.dirt:(hash3(x,y,z)<.15?B.sand:B.sandstone));if(edge&&hash2(x,z,4)<.3)w.raw(x,top,z,B.sandstone)}
 // stairway down the bluff
 for(let k=0;k<10;k++){const z=100-k;for(const x of[97,98,99]){w.raw(x,23+k,z,B.concrete);for(let y=24+k;y<=36;y++)w.raw(x,y,z,0)}}
 const palm=(x,y,z,h=7)=>{for(let i=0;i<h;i++)w.raw(x,y+i,z,B.palm_log);const tx=x,ty=y+h;w.raw(tx,ty,z,B.palm_leaves);for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]])for(let r=1;r<=3;r++){w.raw(tx+dx*r,ty-(r>2?1:0),z+dz*r,B.palm_leaves)}for(const[dx,dz]of[[1,1],[-1,1],[1,-1],[-1,-1]])w.raw(tx+dx,ty,z+dz,B.palm_leaves)};
 for(let z=6;z<104;z+=8)palm(104+(z%16?0:6),w.surface(104,z),z,8);
 for(let z=4;z<D-4;z+=9)if(z<40||z>62)palm(84,w.surface(84,z),z,6+(z%3));
 // bluff park benches + lamps
 for(let z=10;z<100;z+=15){const y=w.surface(110,z);w.raw(110,y,z,B.planks);w.raw(110,y,z+1,B.planks);w.raw(112,y,z+3,B.lamp)}
 // ---- The pier ----
 const DY=26,Z0=44,Z1=58;
 for(let x=6;x<=95;x++)for(let z=Z0;z<=Z1;z++){w.raw(x,DY,z,B.boardwalk);for(let y=DY+1;y<DY+12;y++)if(x<96)w.raw(x,y,z,0)}
 for(let x=6;x<=95;x+=5)for(const z of[Z0,51,Z1]){for(let y=1;y<DY;y++){const id=w.get(x,y,z);if(id===B.water||id===0)w.raw(x,y,z,B.log)}}
 for(let x=6;x<=95;x+=2)for(const z of[Z0,Z1])w.raw(x,DY+1,z,B.planks);
 // ramp bridge from bluff top to deck
 for(let x=96;x<=104;x++){const y=DY+Math.round((x-96)*6/8);for(let z=48;z<=54;z++){w.raw(x,y,z,B.concrete);for(let yy=y+1;yy<y+5;yy++)w.raw(x,yy,z,0)}}
 // beach stairs up to the pier
 for(let k=0;k<4;k++)for(const x of[80,81])w.raw(x,22+k,Z1+1+k-0,B.planks);
 // entrance arch (lit, no lettering)
 for(const z of[Z0+2,Z1-2])for(let y=DY+1;y<=DY+6;y++)w.raw(93,y,z,B.iron_block);for(let z=Z0+2;z<=Z1-2;z++){w.raw(93,DY+7,z,B.felt_blue);if(z%2)w.raw(93,DY+6,z,B.neon)}
 // Ferris wheel (Sky Wheel): ring, spokes, gondolas, A-frame
 const cx=26,cy=DY+12,cz=51,RR=10;
 for(let a=0;a<6.283;a+=.02){const x=Math.round(cx+Math.cos(a)*RR),y=Math.round(cy+Math.sin(a)*RR);w.raw(x,y,cz,Math.floor(a*4)%2?B.felt_red:B.felt_white)}
 for(let k=0;k<8;k++){const a=k*Math.PI/4;for(let r=0;r<RR;r+=.5)w.raw(Math.round(cx+Math.cos(a)*r),Math.round(cy+Math.sin(a)*r),cz,B.iron_block);const gx=Math.round(cx+Math.cos(a)*(RR+1)),gy=Math.round(cy+Math.sin(a)*(RR+1))-1;w.raw(gx,gy,cz,B.lamp);w.raw(gx,gy,cz-1,[B.felt_yellow,B.felt_blue,B.felt_pink,B.felt_green][k%4]);w.raw(gx,gy,cz+1,[B.felt_yellow,B.felt_blue,B.felt_pink,B.felt_green][k%4])}
 w.raw(cx,cy,cz,B.gold_block);for(const z of[cz-2,cz+2]){for(let y=DY+1;y<cy;y++){const off=Math.round((cy-y)*.45);w.raw(cx-off,y,z,B.iron_block);w.raw(cx+off,y,z,B.iron_block)}w.raw(cx,cy,z,B.iron_block)}w.raw(cx,cy,cz-1,B.iron_block);w.raw(cx,cy,cz+1,B.iron_block);
 // small coaster track
 for(let x=8;x<=20;x++){const y=DY+2+Math.round(Math.abs(Math.sin(x/2.2))*4);w.raw(x,y,Z0+1,B.iron_block);for(let yy=DY+1;yy<y;yy+=1)if(x%3===0)w.raw(x,yy,Z0+1,B.iron_block)}
 // arcade hall (neon trim), carousel, food stalls with striped awnings
 hollow(w,54,DY,Z0,68,DY+5,Z0+5,B.felt_pink,0);for(let x=55;x<=67;x++){w.raw(x,DY+5,Z0,B.neon);w.raw(x,DY+5,Z0+5,B.neon)}for(let x=56;x<=66;x+=2){w.raw(x,DY+2,Z0+5,B.glass);w.raw(x,DY+3,Z0+5,B.glass)}w.raw(61,DY+1,Z0+5,0);w.raw(61,DY+2,Z0+5,0);for(let x=56;x<=66;x+=3)w.raw(x,DY+1,Z0+2,B.felt_blue);
 for(let a=0;a<6.283;a+=.1){const x=Math.round(80+Math.cos(a)*4),z=Math.round(Z0+3+Math.sin(a)*3);w.raw(x,DY+1,z,B.planks);w.raw(x,DY+4,z,B.felt_yellow)}for(let dz=-2;dz<=2;dz++)for(let dx=-3;dx<=3;dx++)w.raw(80+dx,DY+5,Z0+3+dz,(dx+dz)%2?B.felt_red:B.felt_white);w.raw(80,DY+6,Z0+3,B.lamp);for(const[dx,dz]of[[-2,0],[2,0],[0,-1],[0,1]]){w.raw(80+dx,DY+1,Z0+3+dz,B.felt_white);w.raw(80+dx,DY+2,Z0+3+dz,B.felt_pink)}
 for(const x0 of[40,48,70])for(let x=x0;x<x0+5;x++){w.raw(x,DY+1,Z1-1,B.planks);w.raw(x,DY+4,Z1-2,B.awning);w.raw(x,DY+4,Z1-1,B.awning);if(x===x0||x===x0+4)for(let y=DY+1;y<DY+4;y++)w.raw(x,y,Z1-1,B.planks)}
 for(let x=10;x<=92;x+=8)w.raw(x,DY+1,51,B.lamp);
 // under-pier grotto (boss arena): flat dry sand, dark beneath the deck
 for(let x=56;x<=86;x++)for(let z=Z0;z<=Z1;z++){for(let y=19;y<=21;y++)w.raw(x,y,z,B.sand);for(let y=22;y<DY;y++)if(w.get(x,y,z)!==B.log)w.raw(x,y,z,0)}
 for(let i=0;i<18;i++){const x=58+Math.floor(R()*27),z=Z0+1+Math.floor(R()*13);if(!w.get(x,22,z))w.raw(x,22,z,R()<.5?B.web:B.seaglass_sand)}
 P.pier={x:50,y:DY+1,z:51};P.pierUnder={x:72,y:22,z:51,box:[58,21,Z0+1,86,25,Z1-1],door:{x:86,y:23,z:Z1+3}};
 w.protect.push([6,DY,Z0,104,DY+30,Z1]);
 // ---- Ferry jetty between the two neighbourhoods ----
 for(let x=30;x<=88;x++)for(let z=114;z<=116;z++){if(w.surface(x,z)<=23){w.raw(x,23,z,B.boardwalk);if(x%4===0&&(z===114||z===116))for(let y=1;y<23;y++){const id=w.get(x,y,z);if(id===B.water||id===0)w.raw(x,y,z,B.palm_log)}}}
 w.raw(30,24,115,B.ferry_bell);w.raw(30,24,114,B.lamp);w.raw(30,24,116,B.lamp);P.ferry={x:30,y:24,z:115};P.spawn={x:33.5,y:24,z:115.5};w.protect.push([29,1,113,40,30,117]);
 // ---- Venice Beach ----
 // Mural Walk shopfronts on the promenade (murals face the ocean)
 const COLS=[B.felt_pink,B.felt_blue,B.felt_yellow,B.felt_green,B.bricks,B.felt_white,B.felt_red];
 const MURALS={124:B.mural_sun,146:B.mural_wave,179:B.mural_palm,201:B.mural_pop};
 // 7x7 block pixel-art murals (original designs) painted on the shopfronts: sunset, wave, palm, pop face
 const PAL={P:B.felt_pink,Y:B.felt_yellow,R:B.felt_red,W:B.felt_white,B:B.felt_blue,G:B.felt_green,L:B.palm_log,S:B.sand,K:B.asphalt,N:B.neon,C:B.concrete};
 const ART={[B.mural_sun]:['PPPYPPP','PYYYYYP','PYYYYYP','RRYYYRR','RRRRRRR','BWBBWBB','BBBBBBB'],[B.mural_wave]:['WWWWWWW','WWWBBBW','WWBBWWB','WBBWBWW','BBWBBBB','BBBBBBB','SSSSSSS'],[B.mural_palm]:['PPGGGPP','PGGLGGP','GPPLPPG','PPPLPPP','PPLPPPP','SSLSSSS','SSSSSSS'],[B.mural_pop]:['NYYYYYN','YKWYKWY','YKKYKKY','YYYYYYY','YRYYYRY','YYRRRYY','NYYYYYN']};
 for(let z=120;z<210;z+=11){if(z+8>=156&&z<=164)continue;const mural=Object.keys(MURALS).some(k=>+k===z+4);const hgt=mural?10:5+Math.floor(R()*3),col=COLS[Math.floor(R()*COLS.length)];hollow(w,95,23,z,105,23+hgt,z+8,col,0);for(let x=95;x<=105;x++)for(let zz=z;zz<=z+8;zz++)w.raw(x,24+hgt,zz,B.planks);w.raw(95,24,z+4,0);w.raw(95,25,z+4,0);for(let zz=z+1;zz<z+8;zz+=3)w.raw(95,26,zz,B.glass);w.raw(94,26,z+2,B.lamp);for(let zz=z;zz<=z+8;zz++)w.raw(94,25+hgt-1,zz,B.awning)}
 for(const[z0,id]of Object.entries(MURALS)){const z=+z0;const art=ART[id];for(let r=0;r<7;r++)for(let c=0;c<7;c++)w.raw(95,32-r,z+3-c,PAL[art[r][c]]);w.raw(95,26,z+3,id);w.raw(94,24,z-3,B.lamp);w.raw(94,24,z+3,B.lamp)}
 P.murals=Object.keys(MURALS).map(z=>({x:94,y:24,z:+z,box:[95,26,+z-3,95,32,+z+3]}));
 // hanging-sign arch over the side street (lights only, no lettering)
 for(let x=94;x<=127;x++)for(let z=158;z<=162;z++)w.raw(x,23,z,x%6===0&&z===160?B.asphalt_line:B.asphalt);
 for(const z of[157,163])for(let y=24;y<=31;y++)w.raw(100,y,z,B.iron_block);for(let z=157;z<=163;z++){w.raw(100,32,z,B.iron_block);w.raw(100,31,z,z%2?B.neon:B.felt_white)}
 // Flex Beach outdoor gym on the sand
 const gy=w.surface(70,140);for(let x=66;x<=82;x++)for(let z=134;z<=150;z++){w.raw(x,gy-1,z,B.sand);for(let y=gy;y<gy+5;y++)w.raw(x,y,z,0);if((x===66||x===82)&&z%4===0){w.raw(x,gy,z,B.palm_log);w.raw(x,gy+1,z,B.palm_log)}}
 for(let x=72;x<=78;x++)for(let z=144;z<=148;z++)w.raw(x,gy-1,z,B.concrete);
 for(const[x,z]of[[68,138],[74,138],[68,145]]){for(let y=gy;y<gy+3;y++){w.raw(x,y,z,B.felt_yellow);w.raw(x+4,y,z,B.felt_yellow)}for(let k=0;k<=4;k++)w.raw(x+k,gy+3,z,B.iron_block)}
 for(let z=136;z<=140;z++){w.raw(80,gy,z,B.felt_blue);w.raw(80,gy+1+(z-136>>1),z,B.felt_blue)}
 for(const z of[145,147]){w.raw(73,gy,z,B.planks);w.raw(74,gy,z,B.planks);w.raw(75,gy,z,B.planks);w.raw(73,gy+1,z,B.felt_red);w.raw(75,gy+1,z,B.felt_red)}for(const z of[144,148]){w.raw(77,gy,z,B.iron_block);w.raw(77,gy+1,z,B.felt_white);w.raw(77,gy+2,z,B.iron_block)}
 P.gym={x:74,y:gy,z:142};
 // Sunset Skate Bowl
 const sy=23;for(let x=60;x<=84;x++)for(let z=174;z<=198;z++){for(let y=19;y<=sy;y++)w.raw(x,y,z,y===sy?B.concrete:B.sandstone);for(let y=sy+1;y<sy+4;y++)w.raw(x,y,z,0)}
 const bowl=(bx,bz,r,dep)=>{for(let x=bx-r-1;x<=bx+r+1;x++)for(let z=bz-r-1;z<=bz+r+1;z++){const d=Math.hypot(x-bx,z-bz);if(d>r+.5)continue;const depth=Math.round(dep*(1-(d/(r+.5))**2));if(depth<=0){w.raw(x,sy,z,B.iron_block);continue}for(let y=sy-depth+1;y<=sy;y++)w.raw(x,y,z,0);w.raw(x,sy-depth,z,depth>=dep-1?B.felt_blue:B.concrete)}};
 bowl(68,184,6,4);bowl(79,192,3,2);for(let z=176;z<=196;z+=10)for(const x of[61,83])w.raw(x,sy+1,z,B.lamp);for(let x=74;x<=83;x++)w.raw(x,sy+1,178,B.iron_block);for(let z=180;z<=186;z++){w.raw(83,sy+1,z,B.concrete);w.raw(84,sy+2,z,B.concrete)}
 P.skate={x:72,y:sy+1,z:196};
 // lifeguard towers (stilts + blue hut)
 for(const z of[132,166,214,30,90]){const x=60,y=w.surface(x,z);for(const[dx,dz]of[[0,0],[2,0],[0,2],[2,2]])for(let k=0;k<3;k++)w.raw(x+dx,y+k,z+dz,B.planks);for(let dx=-1;dx<=3;dx++)for(let dz=-1;dz<=3;dz++)w.raw(x+dx,y+3,z+dz,B.planks);hollow(w,x,y+4,z,x+2,y+6,z+2,B.felt_blue,0);w.raw(x,y+5,z+1,B.glass);w.raw(x+1,y+7,z+1,B.felt_red)}
 // Canal Row: water channels, little bridges and bright cottages
 for(let z=212;z<D-2;z++)for(let x=94;x<W-1;x++){for(let y=20;y<=23;y++)w.raw(x,y,z,0);w.raw(x,19,z,B.sandstone);w.raw(x,22,z,B.grass);w.raw(x,21,z,B.dirt);w.raw(x,20,z,B.dirt)}
 const canal=(x0,z0,x1,z1)=>{for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){w.raw(x,19,z,B.sandstone);w.raw(x,20,z,B.water);w.raw(x,21,z,B.water);w.raw(x,22,z,0)}};
 canal(100,212,102,D-3);canal(113,212,115,D-3);canal(94,224,126,226);canal(94,240,126,242);
 for(const[x0,z]of[[100,233],[113,218],[113,248]]){for(let x=x0-1;x<=x0+3;x++){w.raw(x,22,z,B.planks);w.raw(x,22,z+1,B.planks)}w.raw(x0+1,23,z,B.planks)}
 for(const[x0,z0]of[[104,214],[104,229],[104,244],[117,214],[117,229],[117,244],[95,214],[95,229],[95,244]]){const c=COLS[(x0+z0)%COLS.length];const ww=x0===95?4:7;hollow(w,x0,22,z0,x0+ww,26,z0+7,c,0);for(let x=x0;x<=x0+ww;x++)for(let z=z0;z<=z0+7;z++)w.raw(x,27,z,B.bricks);w.raw(x0+1,23,z0,0);w.raw(x0+1,24,z0,0);w.raw(x0+3,24,z0,B.glass);w.raw(x0+1,25,z0-1,B.lamp)}
 for(let x=94;x<=126;x++){w.raw(x,22,211,B.concrete)}
 P.canals={x:109,y:23,z:238};
 // sea glass hidden in the beach sand
 for(let n=0;n<70;n++){const x=46+Math.floor(R()*38),z=2+Math.floor(R()*250);if(z>=Z0-1&&z<=Z1+1)continue;const y=w.surface(x,z)-1;if(w.get(x,y,z)===B.sand)w.raw(x,y,z,B.seaglass_sand)}
 // towels & umbrellas
 for(let n=0;n<14;n++){const x=58+Math.floor(R()*20),z=8+Math.floor(R()*240);if(z>Z0-3&&z<Z1+3)continue;const y=w.surface(x,z);if(w.get(x,y-1,z)!==B.sand&&w.get(x,y-1,z)!==B.seaglass_sand)continue;const c=COLS[n%4];w.raw(x,y,z,c);w.raw(x+1,y,z,c);for(let k=1;k<4;k++)w.raw(x+2,y-1+k,z,B.planks);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)w.raw(x+2+dx,y+3,z+dz,n%2?B.awning:B.felt_white)}
 // cast hanging out on the coast
 const at=(id,x,z)=>({id,x:x+.5,y:w.surface(x,z),z:z+.5});
 P.npcs=[at('bronny',74,142),at('bean',109,238),at('pooping',72,196),at('pooh',62,52),at('kermit',112,70)];
 P.regions=[{z0:0,z1:112,name:'santamonica'},{z0:113,z1:117,name:'ferry'},{z0:118,z1:D,name:'venice'}];
 for(let z=0;z<D;z++)for(let x=0;x<W;x++)w.updateHM(x,z);
 return w}
