'use strict';
// ================= Driftwood Days core =================
const VERSION='1.0.0';
const SAVE_KEY='driftwood_save_v1';
const LAY={dock:[27,43],marquee:[27,28.3],bench:[30.3,29.7],shop:[32.5,34.5],museum:[31.5,21.5],tent:[21.5,32.6],
 homes:{bean:[11.5,21.5],pinco:[12,29],bronny:[38.5,21.5],asmon:[37.5,31.5],mogu:[27.5,37.6]},
 spots:{pooping:[27,30.5],pooh:[32.5,36.3],kermit:[31.5,23.5],kaise:[24.4,31.4]},lamps:[[24.2,30.2],[30.4,32.4],[23,26],[29,37]]};
const HOME_COL={bean:['#bfe39a','#5d8f2f'],pinco:['#ffd1e0','#e8608f'],bronny:['#ffe08a','#5b2a86'],asmon:['#c7bde0','#4a3570'],bbean:['#bfe39a','#5d8f2f']};
let S=null;// save
const G={scene:null,cam:null,ren:null,W:null,obj:new Map(),ents:[],npcs:{},bugs:[],fish:[],drops:[],t:0,dt:0,mode:'title',joy:{x:0,y:0,on:false},
 player:null,pp:new THREE.Vector3(27,0.3,43),yaw:Math.PI,speed:0,busy:0,anim:null,fishing:null,lastAct:'',paused:false,interior:null};
// ---------- time ----------
function now(){return new Date(Date.now()+(S?S.timeOff:0))}
function shifted(d){return new Date(d.getTime()-5*3600e3)}
function dayKey(d=now()){const x=shifted(d);return x.getFullYear()+'-'+(x.getMonth()+1)+'-'+x.getDate()}
function dayNum(d=now()){const x=shifted(d);return Math.floor((Date.UTC(x.getFullYear(),x.getMonth(),x.getDate()))/864e5)}
function hourF(d=now()){return d.getHours()+d.getMinutes()/60}
function season(){return seasonOf(now())}
function rnd(seed){return rngf(seed)}
// ---------- save ----------
function newSave(name,island,look){
 return {v:1,name,island,look,coins:300,stamps:0,cap:20,bag:Array(20).fill(null),storage:[],recipes:Object.keys(RECIPES).filter(k=>RECIPES[k][3]==='start'),
  house:{tier:0,debt:HOUSE[0].debt,pend:-1,room:[],wall:'w_cream',floor:'f_plank'},owned:{t_white:1,b_shorts:1,s_sneak:1,w_cream:1,f_plank:1},
  pedia:{},museum:{},vill:{},w:null,tut:{step:0,done:false,branches:0},stats:{},goals:{},daily:{key:'',list:[]},opt:{music:1,sfx:1},cheat:false,timeOff:0,
  dayKey:'',start:dayNum(new Date()),days:0,shop:{},kaiseDay:-1,unbreak:false,seed:(Math.random()*1e9)|0,tutBug:false};
}
function save(){if(!S)return;try{S.pos=[G.pp.x,G.pp.z,G.yaw];localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}
function loadSave(){try{const s=localStorage.getItem(SAVE_KEY);if(s)return JSON.parse(s)}catch(e){}return null}
// ---------- bag helpers ----------
function bagCount(id){let n=0;for(const s of S.bag)if(s&&s.id===id)n+=s.q;return n}
function anyFlowerCount(){let n=0;for(const s of S.bag)if(s&&ITEMS[s.id].cat==='flower')n+=s.q;return n}
function addItem(id,q=1,extra){const it=ITEMS[id];if(!it)return false;const st=it.st||1;let left=q;
 for(const s of S.bag)if(s&&s.id===id&&st>1&&s.q<st&&!extra){const k=Math.min(st-s.q,left);s.q+=k;left-=k;if(!left)break}
 while(left>0){const i=S.bag.findIndex(s=>!s);if(i<0)break;const k=Math.min(st,left);S.bag[i]={id,q:k};if(it.tool)S.bag[i].d=it.dur;if(extra)S.bag[i].x=extra;left-=k}
 if(left<q){UI.refreshHud();}return left===0}
function canAdd(id,q=1){const st=ITEMS[id].st||1;let room=0;for(const s of S.bag){if(!s)room+=st;else if(s.id===id&&st>1)room+=st-s.q}return room>=q}
function removeItem(id,q=1){for(let i=S.bag.length-1;i>=0&&q>0;i--){const s=S.bag[i];if(s&&s.id===id){const k=Math.min(s.q,q);s.q-=k;q-=k;if(!s.q)S.bag[i]=null}}UI.refreshHud();return q===0}
function removeAnyFlower(q){for(let i=S.bag.length-1;i>=0&&q>0;i--){const s=S.bag[i];if(s&&ITEMS[s.id].cat==='flower'){const k=Math.min(s.q,q);s.q-=k;q-=k;if(!s.q)S.bag[i]=null}}}
function stat(k,n=1){S.stats[k]=(S.stats[k]||0)+n;if(S.daily&&S.daily.list)for(const d of S.daily.list){const def=DAILY_POOL.find(p=>p[0]===d.id);if(def&&def[3]===k&&!d.claimed)d.prog=Math.min(def[4],(d.prog||0)+n)}UI.badge()}
function heldTool(){const i=S.held;if(i==null)return null;const s=S.bag[i];if(!s||!ITEMS[s.id].tool){S.held=null;return null}return s}
function wearTool(){const s=heldTool();if(!s||S.unbreak||S.cheat&&S.unbreak)return;s.d=(s.d==null?ITEMS[s.id].dur:s.d)-1;if(s.d<=0){const nm=N(ITEMS[s.id].n);S.bag[S.held]=null;S.held=null;updateHeld();UI.toast(T('toolBroke',nm));SFX.play('break')}}
// ---------- three setup ----------
function initThree(){
 const ren=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;
 ren.outputEncoding=THREE.sRGBEncoding;document.getElementById('view').appendChild(ren.domElement);G.ren=ren;
 const sc=new THREE.Scene();G.scene=sc;const cam=new THREE.PerspectiveCamera(30,1,.5,200);G.cam=cam;
 const hemi=new THREE.HemisphereLight(0xd8f4ff,0x94a670,.65);sc.add(hemi);G.hemi=hemi;
 const sun=new THREE.DirectionalLight(0xffffff,1);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc2=sun.shadow.camera;sc2.left=-18;sc2.right=18;sc2.top=18;sc2.bottom=-18;sc2.near=1;sc2.far=60;sun.shadow.bias=-.0008;sun.shadow.normalBias=.02;
 sc.add(sun);sc.add(sun.target);G.sun=sun;
 const amb=new THREE.AmbientLight(0xffffff,.06);sc.add(amb);G.amb=amb;
 sc.fog=new THREE.Fog(0x86d0f5,40,90);
 addEventListener('resize',resize);resize();
}
function resize(){const w=innerWidth,h=innerHeight;G.ren.setSize(w,h);G.cam.aspect=w/h;G.cam.updateProjectionMatrix();G.portrait=h>w}
// ---------- world build ----------
function buildWorld(){
 const sc=G.scene;if(G.worldGrp)sc.remove(G.worldGrp);const wg=new THREE.Group();G.worldGrp=wg;sc.add(wg);
 const W=G.W=G.W||genIsland();const ss=season();G.builtSeason=ss;
 wg.add(buildTerrain(W,ss));G.water=buildWater(W);wg.add(G.water);
 // bridges & dock
 const bridges=[[25,14,24,1],[36,13,20,0],[11,16,22,1]];
 for(const [z,x0,x1,lv] of bridges){let a=99,b=-1;for(let x=x0;x<=x1;x++)if(W.T[W.I(x,z)]===TY.BRIDGE){a=Math.min(a,x);b=Math.max(b,x)}if(b<0)continue;const len=b-a+1;const br=makeBridge(len,true);br.position.set(a+len/2,LV_H[W.L[W.I(a,z)]]+.01,z+.5);wg.add(br)}
 const dk=makeDock(4);dk.position.set(27,.2,W.dockZ+1);wg.add(dk);
 // buildings
 G.blds=[];
 const addB=(m,x,z,w,d,kind,id)=>{m.position.set(x,walkH(W,x,z)||.3,z);wg.add(m);G.blds.push({m,x,z,w,d,kind,id});return m};
 const sign=(txt,bg)=>{const c=document.createElement('canvas');c.width=256;c.height=110;const x=c.getContext('2d');x.fillStyle=bg;x.font='900 64px Nunito,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,128,58);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t};
 addB(makeMarquee(),...LAY.marquee,3.4,3.2,'marquee');
 addB(makeHouse('#fff1c9','#e8a33a',{w:2.6,d:2.0,awning:'#e8a33a',sign:true,signTex:sign('🍯 SHOP','#b8741a')}),...LAY.shop,2.6,2.0,'shop');
 addB(makeMuseum(),...LAY.museum,3.2,2.4,'museum');
 const bw=makeWorkbench();bw.position.set(LAY.bench[0],walkH(W,...LAY.bench),LAY.bench[1]);wg.add(bw);G.bench=bw;
 G.lamps=[];for(const [x,z] of LAY.lamps){const l=makeLampPost();l.position.set(x,walkH(W,x,z),z);wg.add(l);G.lamps.push(l)}
 buildPlayerHome();buildVillHomes();
 // world objects
 G.obj.clear();G.objGrp=new THREE.Group();wg.add(G.objGrp);
 for(const o of S.w.objs)spawnObj(o);
 G.dropGrp=new THREE.Group();wg.add(G.dropGrp);for(const d of S.w.drops)spawnDrop(d);
 G.arrow=makeArrow();G.arrow.visible=false;wg.add(G.arrow);
 G.cursor=new THREE.Mesh(new THREE.RingGeometry(.28,.36,20),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7,depthWrite:false}));G.cursor.rotation.x=-Math.PI/2;wg.add(G.cursor);
}
function buildPlayerHome(){const wg=G.worldGrp;if(G.homeM){wg.remove(G.homeM);G.blds=G.blds.filter(b=>b.kind!=='home')}
 const t=S.house.tier;const m=t===0?makeTent('#5fb0e8'):makeHouse(['#fff','#ffe6c4','#e8f4ff','#ffe1ec'][t],['#5fb0e8','#4a8fd0','#3b6fb6','#e05a4f'][t],{w:1.8+t*.35,d:1.6+t*.25,h:1.1+t*.15,chimney:t>=2});
 const [x,z]=LAY.tent;m.position.set(x,walkH(G.W,x,z),z);wg.add(m);G.homeM=m;const w=t===0?2.2:1.8+t*.35,d=t===0?2.2:1.6+t*.25;G.blds.push({m,x,z,w,d,kind:'home'})}
function buildVillHomes(){const wg=G.worldGrp;(G.vhomes||[]).forEach(m=>wg.remove(m));G.vhomes=[];G.blds=G.blds.filter(b=>b.kind!=='vhome');
 for(const id of RESIDENTS){if(id==='bbean')continue;const v=S.vill[id];const [x,z]=LAY.homes[id];let m;
  if(id==='mogu'){m=makeMound();m.position.set(x,walkH(G.W,x,z),z);wg.add(m);G.vhomes.push(m);if(v&&v.in)G.blds.push({m,x,z,w:1.2,d:1.0,kind:'vhome',id});continue}
  if(!v||!v.in){// empty plot marker
   const p=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.0),new THREE.MeshLambertMaterial({color:0xc9a66b,transparent:true,opacity:.55}));p.rotation.x=-Math.PI/2;p.position.set(x,walkH(G.W,x,z)+.02,z);wg.add(p);G.vhomes.push(p);continue}
  const c=HOME_COL[id];m=makeHouse(c[0],c[1],{w:2.2,d:1.8,h:1.2,chimney:id==='asmon'});m.position.set(x,walkH(G.W,x,z),z);wg.add(m);G.vhomes.push(m);G.blds.push({m,x,z,w:2.2,d:1.8,kind:'vhome',id})}}
// ---------- world objects (trees, rocks, flowers, ...) ----------
const oKey=(x,z)=>x+','+z;
function freeTile(x,z,margin=0){const W=G.W;if(x<1||z<1||x>=W.N-1||z>=W.N-1)return false;const t=W.T[W.I(x,z)];if(t!==TY.GRASS&&t!==TY.SAND)return false;if(W.RAMP[W.I(x,z)]>=0)return false;
 if(G.obj.has(oKey(x,z)))return false;for(const b of G.blds){if(Math.abs(x+.5-b.x)<b.w/2+.5+margin&&Math.abs(z+.5-b.z)<b.d/2+.5+margin+(b.kind!=='marquee'?.6:.8))return false}
 if(Math.hypot(x+.5-LAY.bench[0],z+.5-LAY.bench[1])<1.3)return false;for(const s of Object.values(LAY.spots))if(Math.hypot(x+.5-s[0],z+.5-s[1])<1.2)return false;
 for(const l of LAY.lamps)if(Math.hypot(x+.5-l[0],z+.5-l[1])<.9)return false;return true}
function genWorld(){const W=G.W=G.W||genIsland();const R=rngf(4242);const objs=[];
 G.obj.clear();G.blds=[{x:LAY.marquee[0],z:LAY.marquee[1],w:3.4,d:3.2,kind:'marquee'},{x:LAY.shop[0],z:LAY.shop[1],w:2.6,d:2.0},{x:LAY.museum[0],z:LAY.museum[1],w:3.2,d:2.4},{x:LAY.tent[0],z:LAY.tent[1],w:2.2,d:2.2}];
 for(const id in LAY.homes){const [x,z]=LAY.homes[id];G.blds.push({x,z,w:2.6,d:2.2})}
 const plaza=(x,z)=>Math.hypot(x-27,z-31.5)<5.5||Math.hypot(x-27,z-39)<3.5;
 const put=o=>{objs.push(o);G.obj.set(oKey(o.x,o.z),o)};
 for(let z=0;z<W.N;z++)for(let x=0;x<W.N;x++){if(!freeTile(x,z,.3))continue;const t=W.T[W.I(x,z)];
  // keep river banks a bit open
  let nearWater=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const tt=W.T[W.I(x+a,z+b)];if(tt===TY.RIVER||tt===TY.POND||tt===TY.BRIDGE)nearWater=true}
  const r=R();
  if(t===TY.GRASS&&!plaza(x+.5,z+.5)&&!nearWater){
   if(r<.085){const fruit=R()<.35;put({t:'tree',x,z,fr:fruit?SEASON_FRUIT:null,ripe:fruit})}
   else if(r<.092)put({t:'rock',x,z})
   else if(r<.12)put({t:'weed',x,z})
   else if(r<.135){const cs=['red','yellow','white'];put({t:'flower',x,z,sp:['tulip','rose','cosmos'][(R()*3)|0],col:cs[(R()*3)|0],st:3,wild:true})}
  }else if(t===TY.SAND&&r<.05&&!(x>=24&&x<=30&&z>=38)){put({t:'palm',x,z,ripe:true})}
 }
 // guarantee a few trees near the plaza for the tutorial
 for(const [x,z] of [[23,28],[20,29],[33,29],[34,31],[24,37],[22,36]]){if(freeTile(x,z))put({t:'tree',x,z,fr:SEASON_FRUIT,ripe:true})}
 for(const [x,z] of [[29,25],[25,24]]){if(freeTile(x,z))put({t:'weed',x,z})}
 return {objs,drops:[]}}
function objPos(o){const x=o.x+.5+(o.ox||0),z=o.z+.5+(o.oz||0);return [x,walkH(G.W,x,z)??0.3,z]}
function spawnObj(o){let m;const d=now();const ss=G.builtSeason||season();
 if(o.t==='tree'){m=makeTree(ss,d,o.ripe?o.fr:null);const s=.9+((o.x*7+o.z*3)%5)*.05;m.scale.setScalar(s)}
 else if(o.t==='palm')m=makePalm(o.ripe);else if(o.t==='rock')m=makeRock();else if(o.t==='weed')m=makeWeed();
 else if(o.t==='flower')m=makeFlower(o.sp,o.col,o.st);else if(o.t==='sapling')m=makeSapling(o.st||0);
 else if(o.t==='dig')m=o.clam?makeClamSpot():makeDigSpot();else if(o.t==='furn'){m=makeFurn(o.id,o.x2);m.rotation.y=(o.r||0)*Math.PI/2}
 else if(o.t==='bottle')m=makeBottle();else if(o.t==='shell'){m=itemSprite(o.id,.45)}else return;
 const p=objPos(o);m.position.set(...p);if(o.t==='tree'||o.t==='rock')m.rotation.y=((o.x*13+o.z*7)%10)/10*Math.PI;
 if(o.t==='dig'&&o.clam)m.userData.spurt=true;
 o._m=m;G.objGrp.add(m);G.obj.set(oKey(o.x,o.z),o)}
function removeObj(o){if(o._m)G.objGrp.remove(o._m);G.obj.delete(oKey(o.x,o.z));const i=S.w.objs.indexOf(o);if(i>=0)S.w.objs.splice(i,1)}
function addObj(o){S.w.objs.push(o);spawnObj(o);return o}
function refreshObj(o){if(o._m)G.objGrp.remove(o._m);spawnObj(o)}
function spawnDrop(d){const sp=itemSprite(d.id,.5);sp.position.set(d.x,(walkH(G.W,d.x,d.z)??.3)+.02,d.z);d._m=sp;G.dropGrp.add(sp);
 const sh=shadowBlob(.18);sh.position.set(d.x,(walkH(G.W,d.x,d.z)??.3)+.02,d.z);d._s=sh;G.dropGrp.add(sh)}
function dropItem(id,x,z,q=1){const d={id,x,z,q};S.w.drops.push(d);spawnDrop(d);d._m.position.y+=1.2;d._fall=1;return d}
function removeDrop(d){G.dropGrp.remove(d._m);G.dropGrp.remove(d._s);S.w.drops.splice(S.w.drops.indexOf(d),1)}
// ---------- collisions ----------
function blocked(x,z,r=.28){const W=G.W;const h0=walkH(W,G.pp.x,G.pp.z);
 for(const [ax,az] of [[r,0],[-r,0],[0,r],[0,-r],[r*.7,r*.7],[-r*.7,r*.7],[r*.7,-r*.7],[-r*.7,-r*.7]]){const h=walkH(W,x+ax,z+az);if(h==null)return true;if(h0!=null&&Math.abs(h-h0)>.6)return true}
 for(const b of G.blds){if(Math.abs(x-b.x)<b.w/2+r*.6&&Math.abs(z-b.z)<b.d/2+r*.6)return true}
 for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const o=G.obj.get(oKey(Math.floor(x)+dx,Math.floor(z)+dz));if(!o)continue;let rr=0;
  if(o.t==='tree'||o.t==='palm')rr=.42;else if(o.t==='rock')rr=.5;else if(o.t==='furn'&&!['rug'].includes(o.id))rr=.4;else if(o.t==='sapling'&&o.st>=2)rr=.25;
  if(rr){const [ox,,oz]=objPos(o);if(Math.hypot(x-ox,z-oz)<rr+r)return true}}
 if(Math.hypot(x-G.bench.position.x,z-G.bench.position.z)<.75)return true;
 for(const l of G.lamps)if(Math.hypot(x-l.position.x,z-l.position.z)<.3)return true;
 for(const id in G.npcs){const n=G.npcs[id];if(!n.vis)continue;if(Math.hypot(x-n.x,z-n.z)<(n.r||.4)+r*.6)return true}
 return false}
// ---------- player ----------
function buildPlayer(){if(G.player)G.player.parent&&G.player.parent.remove(G.player);G.player=makePlayer(S.look);G.player.add(shadowBlob(.35));(G.interior?G.interior.grp:G.scene).add(G.player);updateHeld()}
function updateHeld(){const h=G.player.userData.held;h.clear();const s=heldTool();if(s)h.add(heldModel(ITEMS[s.id].tool));UI.refreshHud()}
// ---------- daily reset ----------
function ensureDay(silent){const k=dayKey();if(S.dayKey===k)return false;const first=!S.dayKey;S.dayKey=k;dailyReset(first);if(!first&&!silent){UI.toast(T('newDay',S.island));}return true}
function dailyReset(first){const dn=dayNum();const R=rngf(dn*7919+S.seed);
 S.days=(S.days||0)+(first?0:1);
 // trees
 for(const o of S.w.objs){if(o.t==='tree'||o.t==='palm'){o.shook=0;o.chop=0;if(!o.ripe&&o.fr!==undefined&&(o.fr||o.t==='palm')&&dn-(o.pick||0)>=3){o.ripe=true}}
  if(o.t==='rock'){o.hits=0;o.money=false}}
 const rocks=S.w.objs.filter(o=>o.t==='rock');if(rocks.length)rocks[(R()*rocks.length)|0].money=true;
 // remove old dig spots, shells, bottle
 for(const o of [...S.w.objs])if(o.t==='dig'||o.t==='shell'||o.t==='bottle')removeObj(o);
 // flowers: grow, breed
 const fl=S.w.objs.filter(o=>o.t==='flower'&&!o.wild);
 const born=[];
 for(const o of fl){if(o.st===3&&o.wat){for(const p of fl){if(p===o||p.st!==3||p.sp!==o.sp)continue;if(Math.abs(p.x-o.x)+Math.abs(p.z-o.z)!==1&&!(Math.abs(p.x-o.x)===1&&Math.abs(p.z-o.z)===1))continue;
   for(const [a,b,c,ch] of BREED){if(((o.col===a&&p.col===b)||(o.col===b&&p.col===a))&&R()<ch*(S.cheat?2:1)&&o.x<=p.x){born.push({sp:o.sp,col:c,near:[o,p]});break}}}}
  if(o.st<3&&(o.wat||R()<.5))o.st++;o.wat=false}
 for(const b of born){for(const [a,c] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const x=b.near[0].x+a,z=b.near[0].z+c;if(G.W&&freeTileWorld(x,z)){S.w.objs.push({t:'flower',x,z,sp:b.sp,col:b.col,st:2,hyb:true});S.newHybrid=(S.newHybrid||0)+1;break}}}
 // saplings
 for(const o of [...S.w.objs])if(o.t==='sapling'){o.st=(o.st||0)+1;if(o.st>=4){o.t='tree';o.ripe=!!o.fr;delete o.st}}
 // weeds regrow
 let wc=S.w.objs.filter(o=>o.t==='weed').length;for(let k=0;k<40&&wc<26;k++){const x=4+((R()*40)|0),z=6+((R()*36)|0);if(freeTileWorld(x,z)&&G.W.T[G.W.I(x,z)]===TY.GRASS){S.w.objs.push({t:'weed',x,z});wc++}}
 // dig spots (fossils on grass, clams on sand), shells, bottle
 let n=0;for(let k=0;k<200&&n<4;k++){const x=4+((R()*40)|0),z=6+((R()*36)|0);if(freeTileWorld(x,z)&&G.W.T[G.W.I(x,z)]===TY.GRASS){S.w.objs.push({t:'dig',x,z});n++}}
 n=0;for(let k=0;k<300&&n<4;k++){const x=4+((R()*40)|0),z=4+((R()*40)|0);if(freeTileWorld(x,z)&&G.W.T[G.W.I(x,z)]===TY.SAND){S.w.objs.push({t:'dig',x,z,clam:true});n++}}
 n=0;for(let k=0;k<300&&n<4;k++){const x=4+((R()*40)|0),z=4+((R()*40)|0);if(freeTileWorld(x,z)&&G.W.T[G.W.I(x,z)]===TY.SAND){S.w.objs.push({t:'shell',x,z,id:R()<.12?'conch':'shell'});n++}}
 const unknown=BOTTLE_POOL.filter(r=>!S.recipes.includes(r));
 if(unknown.length){for(let k=0;k<300;k++){const x=4+((R()*40)|0),z=4+((R()*40)|0);if(freeTileWorld(x,z)&&G.W.T[G.W.I(x,z)]===TY.SAND){S.w.objs.push({t:'bottle',x,z,rec:unknown[(R()*unknown.length)|0]});break}}}
 // shop stock
 const furnPool=FURN.map(f=>f[0]).filter(id=>!['tank','cage','fstand','arcade','xmastree','snowman'].includes(id)&&ITEMS[id].p>0);
 const clothPool=CLOTHES.map(c=>c[0]).filter(i=>i!=='t_jersey');
 const pick=(a,k)=>{const c=[...a],o=[];while(o.length<k&&c.length)o.push(c.splice((R()*c.length)|0,1)[0]);return o};
 S.shop={furn:pick(furnPool,3),wall:pick(WALLS.map(w=>w[0]),1).concat(pick(FLOORS.map(f=>f[0]),1)),cloth:pick(clothPool,2),kaise:pick(clothPool,5)};
 // house upgrade
 if(S.house.pend>=0){S.house.tier=S.house.pend;S.house.pend=-1;S.house.debt=HOUSE[S.house.tier].debt;S.houseReadyMsg=true;if(S.house.tier>=2)stat('house2')}
 // villagers move in (after tutorial)
 S.moved=[];
 for(const id of RESIDENTS){const v=S.vill[id]||(S.vill[id]={f:0});if(!v.in&&(VILL[id].arrive===0||(S.tut.done&&S.days>=VILL[id].arrive))){v.in=true;if(!first&&VILL[id].arrive>0)S.moved.push(id)}
  v.talk=0;v.gift=0;v.favor=null;if(v.in&&S.tut.done&&R()<.6){const kinds=['item','fish','bug'];const k=kinds[(R()*3)|0];v.favor={k,item:k==='item'?['peach','apple','orange','shell','wood','stone','clam','coconut'][(R()*8)|0]:null,done:false}}}
 // daily tasks
 const pool=[...DAILY_POOL];const L=[];while(L.length<5&&pool.length)L.push({id:pool.splice((R()*pool.length)|0,1)[0][0],prog:0});S.daily={key:S.dayKey,list:L};
 S.kaiseDay=(S.tut.done&&dn%3===1)?dn:-1;
 if(G.worldGrp&&!first){rebuildObjects()}
 save()}
function freeTileWorld(x,z){if(!G.W)return false;const W=G.W;if(x<1||z<1||x>=W.N-1||z>=W.N-1)return false;const t=W.T[W.I(x,z)];if(t!==TY.GRASS&&t!==TY.SAND)return false;if(W.RAMP[W.I(x,z)]>=0)return false;
 for(const o of S.w.objs)if(o.x===x&&o.z===z)return false;
 const B=[[...LAY.marquee,3.6,3.4],[...LAY.shop,2.8,2.4],[...LAY.museum,3.4,2.8],[...LAY.tent,2.6,2.6],[...LAY.bench,1.4,1.2]];for(const id in LAY.homes)B.push([...LAY.homes[id],2.8,2.6]);for(const s of Object.values(LAY.spots))B.push([...s,1.2,1.2]);
 for(const [bx,bz,w,d] of B)if(Math.abs(x+.5-bx)<w/2+.4&&Math.abs(z+.5-bz)<d/2+.8)return false;
 if(Math.abs(x+.5-27)<1.2&&z>=40)return false;return true}
function rebuildObjects(){G.objGrp.clear();G.obj.clear();for(const o of S.w.objs)spawnObj(o);buildPlayerHome();buildVillHomes();spawnNPCs()}
// ---------- camera ----------
const camT=new THREE.Vector3();
function updateCamera(dt,snap){const p=G.interior?G.interior.camTarget:G.pp;const port=G.portrait;
 const d=G.interior?G.interior.camDist*(port?Math.min(2.1,1.25/Math.max(.3,innerWidth/innerHeight)*.55):1):(port?1.18:1.0)*(G.zoom||1);const off=G.interior?new THREE.Vector3(0,11.5*d,9.5*d):new THREE.Vector3(0,13.5*d,12.5*d);
 const tgt=new THREE.Vector3(p.x,(G.interior?0:(G.pp.y||0))*.6,p.z-(port?.2:.6));
 if(snap)camT.copy(tgt);else camT.lerp(tgt,Math.min(1,dt*5));
 G.cam.position.copy(camT).add(off);G.cam.lookAt(camT);
 G.sun.position.set(camT.x-8,22,camT.z+10);G.sun.target.position.copy(camT)}
// ---------- lighting by clock ----------
let lastSkyUpd=-1;
function updateSky(force){const h=hourF();if(!force&&Math.abs(h-lastSkyUpd)<.02)return;lastSkyUpd=h;const k=skyAt(h);G.isNight=k.night;
 G.scene.background=k.sky;G.scene.fog.color.copy(k.sky);G.sun.color.copy(k.sun);G.sun.intensity=k.si*(G.interior?.3:.62);G.hemi.color.copy(k.hs);G.hemi.groundColor.copy(k.hg);G.hemi.intensity=k.ai*.62+(G.interior?.2:0);
 const lv=Math.min(1,(k.si+k.ai)/1.6);G.tint=G.interior?1:.42+.58*lv;for(const d of S.w.drops)d._m&&d._m.material.color.setScalar(G.tint);for(const o of S.w.objs)if(o.t==='shell'&&o._m)o._m.material.color.setScalar(G.tint);
 const glow=k.night?0xffd27a:0x000000;
 for(const b of (G.blds||[]))if(b.m&&b.m.userData.wins)for(const w of b.m.userData.wins)w.emissive.setHex(glow);
 for(const m of (G.vhomes||[]))if(m.userData&&m.userData.wins)for(const w of m.userData.wins)w.emissive.setHex(glow);
 for(const l of (G.lamps||[]))l.userData.bulb.emissive.setHex(k.night?0xffd27a:0x000000);
 if(G.water){const s=G.water.userData.sea.material;s.color.set(k.night?0x2f6f9a:0x4fc3d9)}
}
// ---------- main loop ----------
let lastT=performance.now(),accSave=0,accMin=0,accCull=0;
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-lastT)/1000);lastT=t;G.dt=dt;G.t+=dt;
 if(G.mode!=='create'&&G.cam.view&&G.cam.view.enabled)G.cam.clearViewOffset();
 if(G.mode==='title'){titleCam(dt);G.ren.render(G.scene,G.cam);return}
 if(G.mode==='create'){const W=innerWidth,H=innerHeight,cp=document.querySelector('#sCreate .cpanel'),r=cp?cp.getBoundingClientRect():{top:H,left:W};const land=r.top<H*.3;const av=land?H:Math.max(120,r.top);const tf=Math.tan(G.cam.fov*Math.PI/360);let d=1.9/((land?.78:av*.78/H)*2*tf);if(land)d*=1;d=Math.max(2.4,Math.min(10,d));const dir=new THREE.Vector3(0,.9,4.8).normalize();G.cam.position.set(27,1.0+dir.y*d,42.4+dir.z*d);G.cam.lookAt(27,1.0,42.4);G.cam.setViewOffset(W,H,land?Math.round(W/2-r.left/2):0,land?0:Math.round(H/2-av/2),W,H);if(G.player)G.player.rotation.y=Math.sin(G.t*.6)*.5;G.ren.render(G.scene,G.cam);return}
 if(G.mode!=='play'){G.ren.render(G.scene,G.cam);return}
 accMin+=dt;if(accMin>2){accMin=0;if(ensureDay())UI.afterNewDay();updateSky();if(!G.interior)NPC.schedule();Music.tick()}
 if(G.interior)House.update(dt);else{updatePlayer(dt);NPC.update(dt);Crit.update(dt);Act.update(dt);animWorld(dt)}
 updateCamera(dt);
 accCull+=dt;if(accCull>.4&&!G.interior){accCull=0;cull()}
 accSave+=dt;if(accSave>20){accSave=0;save()}
 Tut.update(dt);UI.frame(dt);
 G.ren.render(G.scene,G.cam)}
function cull(){const p=G.pp;for(const o of S.w.objs){if(!o._m)continue;const dx=o.x+.5-p.x,dz=o.z+.5-p.z;o._m.visible=Math.abs(dx)<(G.portrait?11:17)&&dz<9&&dz>-(G.portrait?19:16)}}
function titleCam(dt){const a=G.t*.05;const cx=27,cz=30;G.cam.position.set(cx+Math.sin(a)*24,17,cz+Math.cos(a)*24);G.cam.lookAt(cx,0,cz-2);G.sun.position.set(cx-8,22,cz+10);G.sun.target.position.set(cx,0,cz);
 if(G.water){G.water.userData.tex.offset.x+=dt*.01;G.water.userData.rt.offset.y-=dt*.25}}
// ---------- player movement ----------
function updatePlayer(dt){const pl=G.player,u=pl.userData;const j=G.joy;let mag=Math.min(1,Math.hypot(j.x,j.y));
 if(G.busy>0){G.busy-=dt;mag=0}if(G.fishing||UI.blocking())mag=0;
 const run=mag>.62,sneak=mag>.05&&mag<=.62;G.sneak=sneak;const sp=mag<.05?0:(sneak?1.5+mag*1.2:3.6);
 if(mag>.05){const ang=Math.atan2(j.x,j.y);let d=ang-G.yaw;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;G.yaw+=d*Math.min(1,dt*14);
  const vx=Math.sin(G.yaw)*sp*dt,vz=Math.cos(G.yaw)*sp*dt;
  if(!blocked(G.pp.x+vx,G.pp.z))G.pp.x+=vx;if(!blocked(G.pp.x,G.pp.z+vz))G.pp.z+=vz}
 G.speed=sp;G.running=run&&sp>0;
 const h=walkH(G.W,G.pp.x,G.pp.z);if(h!=null)G.pp.y+=(h-G.pp.y)*Math.min(1,dt*18);
 pl.position.copy(G.pp);pl.rotation.y=G.yaw;
 // walk anim
 const ph=G.t*(run?13:9);const amp=sp>0?(run?.7:.45):0;
 u.legs[0].rotation.x=Math.sin(ph)*amp;u.legs[1].rotation.x=-Math.sin(ph)*amp;
 if(!G.anim){u.arms[0].rotation.x=-Math.sin(ph)*amp*.8;u.arms[1].rotation.x=Math.sin(ph)*amp*.8}
 u.body.position.y=sp>0?Math.abs(Math.sin(ph))*.05:Math.sin(G.t*2)*.008;
 if(G.anim){G.anim.t+=dt;const a=G.anim,f=a.t/a.d;
  if(a.k==='swing'){u.arms[1].rotation.x=-2.4+f*3.4;u.arms[1].rotation.z=.2}
  else if(a.k==='shake'){u.arms[0].rotation.x=u.arms[1].rotation.x=-1.6+Math.sin(f*30)*.25}
  else if(a.k==='dig'){u.arms[1].rotation.x=-.4-Math.sin(f*Math.PI)*1.2;u.body.rotation.x=Math.sin(f*Math.PI)*.25}
  else if(a.k==='pick'){u.body.rotation.x=Math.sin(f*Math.PI)*.5;u.arms[1].rotation.x=-Math.sin(f*Math.PI)*1.2}
  else if(a.k==='cast'){u.arms[1].rotation.x=f<.4?-2.6:-1.0}
  else if(a.k==='hold'){u.arms[1].rotation.x=-1.0}
  else if(a.k==='cheer'){u.arms[0].rotation.x=u.arms[1].rotation.x=-2.8;u.arms[0].rotation.z=-.5;u.arms[1].rotation.z=.5;u.body.position.y=Math.abs(Math.sin(f*Math.PI*2))*.12}
  if(a.t>=a.d){if(a.k!=='hold'){G.anim=null;u.body.rotation.x=0;u.arms[0].rotation.z=-.25;u.arms[1].rotation.z=.25}else a.t=a.d}}
 // footstep sfx
 if(sp>0){G.stepT=(G.stepT||0)+dt*(run?2.2:1.4);if(G.stepT>.5){G.stepT=0;const t=G.W.T[G.W.I(Math.floor(G.pp.x),Math.floor(G.pp.z))];SFX.play(t===TY.SAND?'stepSand':(t===TY.BRIDGE||t===TY.DOCK)?'stepWood':'step')}}
}
function playAnim(k,d){G.anim={k,t:0,d}}
// ---------- world animation ----------
function animWorld(dt){const w=G.water.userData;w.tex.offset.x+=dt*.012;w.tex.offset.y+=dt*.006;w.rt.offset.y-=dt*.3;if(w.fallM)w.fallM.material.map.offset.y-=dt*1.2;w.foam.material.opacity=.22+Math.sin(G.t*1.6)*.1;
 for(const o of S.w.objs){const m=o._m;if(!m||!m.visible)continue;
  if(o._shake>0){o._shake-=dt;const tp=m.userData.top;if(tp)tp.rotation.z=Math.sin(o._shake*40)*.12*o._shake*2}
  if(o.t==='furn'&&m.userData.flame){m.userData.flame[0].scale.y=1+Math.sin(G.t*12+o.x)*.15;m.userData.flame[1].scale.y=1+Math.cos(G.t*10)*.2}
  if(o.t==='dig'&&o.clam){if(Math.sin(G.t*2+o.x*3)>.97&&!o._sp){o._sp=1;Act.splash(o.x+.5,(walkH(G.W,o.x+.5,o.z+.5)??0)+.05,o.z+.5,.35,6,0xffffff)}else if(Math.sin(G.t*2+o.x*3)<.5)o._sp=0}
  if(o.t==='bottle')m.rotation.z=Math.sin(G.t*2)*.1;
  if(o.t==='flower'&&o.wat)m.children.forEach((c,i)=>{if(i===0)c.material&&0})}
 for(const d of S.w.drops){if(d._fall>0){d._fall-=dt*3;const y=(walkH(G.W,d.x,d.z)??.3)+.02;d._m.position.y=y+Math.max(0,d._fall)*1.2}}
 G.arrow.position.y=G.arrowY+Math.abs(Math.sin(G.t*3))*.3;G.arrow.rotation.y+=dt*2}
// ---------- startup ----------
function startPlay(isNew){G.mode='play';UI.show('hud');
 if(!S.w){S.w=genWorld()}
 G.W=G.W||genIsland();
 ensureDay(true);
 buildWorld();buildPlayer();
 if(isNew||!S.pos){G.pp.set(LAY.dock[0],.25,LAY.dock[1]);G.yaw=Math.PI}else{G.pp.set(S.pos[0],0,S.pos[1]);G.yaw=S.pos[2]||0;if(walkH(G.W,G.pp.x,G.pp.z)==null||blocked(G.pp.x,G.pp.z)){G.pp.set(LAY.tent[0],0,LAY.tent[1]+1.8)}}
 G.pp.y=walkH(G.W,G.pp.x,G.pp.z)||0;
 spawnNPCs();updateSky(true);updateCamera(0,true);Music.start();Crit.reset();
 UI.refreshHud();UI.afterNewDay(true);Tut.start(isNew);save()}
function spawnNPCs(){NPC.spawnAll()}
