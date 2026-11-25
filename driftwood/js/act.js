'use strict';
// ================= actions, critters, particles =================
const Act={parts:[],
 // ---- target finding ----
 target(){const p=G.pp,yaw=G.yaw;const fx=p.x+Math.sin(yaw)*.8,fz=p.z+Math.cos(yaw)*.8;const tool=heldTool();const tk=tool?ITEMS[tool.id].tool:null;
  if(G.fishing)return {k:G.fishing.ph==='bite'?'reel':'wait'};
  if(tk==='net'){for(const b of G.bugs){if(!b.fled&&Math.hypot(b.x-(p.x+Math.sin(yaw)*1.0),b.z-(p.z+Math.cos(yaw)*1.0))<1.5)return {k:'swing'}}}
  let best=null,bd=9;const cand=(k,o,d,pri=0)=>{const s=d-pri;if(s<bd){bd=s;best={k,o}}};
  for(const id in G.npcs){const n=G.npcs[id];if(!n.vis)continue;const d=Math.hypot(n.x-fx,n.z-fz);if(d<1.2&&Math.hypot(n.x-p.x,n.z-p.z)<1.9)cand('talk',n,d,.5)}
  for(const d of S.w.drops){const dd=Math.hypot(d.x-p.x,d.z-p.z);if(dd<.75)cand('pick',d,dd-.3,.2)}
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const o=G.obj.get(oKey(Math.floor(fx)+dx,Math.floor(fz)+dz));if(!o)continue;const [ox,,oz]=objPos(o);const d=Math.hypot(ox-fx,oz-fz);
   const lim={tree:.95,palm:.95,rock:1.0,weed:.6,flower:.6,sapling:.6,dig:.6,furn:.75,bottle:.65,shell:.6}[o.t]||.6;if(d>lim)continue;
   if(o.t==='tree'||o.t==='palm')cand(tk==='axe'&&o.t==='tree'?'chop':'shake',o,d);
   else if(o.t==='rock')cand('hit',o,d);
   else if(o.t==='weed')cand('pull',o,d);
   else if(o.t==='flower')cand(tk==='can'?'water':(o.wild||o.st===3?'pickf':'look'),o,d);
   else if(o.t==='sapling')cand(tk==='can'?'water':'look',o,d);
   else if(o.t==='dig')cand('dig',o,d,.1);
   else if(o.t==='furn')cand('take',o,d);
   else if(o.t==='bottle'||o.t==='shell')cand('pickobj',o,d,.1)}
  const bd2=Math.hypot(G.bench.position.x-fx,G.bench.position.z-fz);if(bd2<1.0)cand('craft',G.bench,bd2);
  // home door
  const hm=G.homeM;if(hm){const dx=hm.position.x+hm.userData.door.x,dz=hm.position.z+hm.userData.door.z;const d=Math.hypot(dx-p.x,dz-p.z);if(d<.9)cand('enter',hm,d)}
  if(best)return best;
  if(tk==='rod'){const w=this.waterAhead();if(w)return {k:'fish',o:w}}
  if(tk==='net')return {k:'swing'};
  if(tk==='shovel')return {k:'dig0'};
  if(tk==='can')return {k:'water0'};
  if(tk==='axe')return {k:'swing0'};
  return {k:'none'}},
 waterAhead(){const p=G.pp;for(let r=1.1;r<=3.2;r+=.3){const x=p.x+Math.sin(G.yaw)*r,z=p.z+Math.cos(G.yaw)*r;const tx=Math.floor(x),tz=Math.floor(z);if(tx<0||tz<0||tx>=G.W.N||tz>=G.W.N)return null;const t=G.W.T[G.W.I(tx,tz)];
   if(t===TY.SEA||t===TY.RIVER||t===TY.POND){const where=t===TY.SEA?'sea':t===TY.POND?'pond':'river';const y=t===TY.SEA?-.2:LV_H[G.W.L[G.W.I(tx,tz)]]-.32;return {x,z,y,where,tx,tz}}
   if(t===TY.BRIDGE||t===TY.DOCK)continue;if(r>2.3&&walkH(G.W,x,z)!=null&&!(t===TY.SAND))return null}return null},
 label(t){return {talk:'act_talk',shake:'act_shake',chop:'act_chop',hit:'act_hit',pull:'act_pull',pickf:'act_pick',water:'act_water',dig:'act_dig2',take:'act_take',pickobj:'act_pick',pick:'act_pick',craft:'act_craft',enter:'act_enter',fish:'act_fish',reel:'act_reel',wait:'act_wait',swing:'act_swing',dig0:'act_dig',water0:'act_water',swing0:'act_chop',look:'act_look',none:'act_none'}[t.k]},
 icon(t){return {talk:'💬',shake:'🌳',chop:'🪓',hit:'🪨',pull:'🌿',pickf:'🌼',water:'💧',dig:'⛏️',take:'📦',pickobj:'✋',pick:'✋',craft:'🔨',enter:'🚪',fish:'🎣',reel:'❗',wait:'🎣',swing:'🦋',dig0:'⛏️',water0:'💧',swing0:'🪓',look:'👀',none:'✋'}[t.k]},
 // ---- do action ----
 go(){if(G.busy>0&&!G.fishing)return;const t=this.target();const tool=heldTool();const tk=tool?ITEMS[tool.id].tool:null;
  switch(t.k){
  case 'talk':NPC.talk(t.o);break;
  case 'pick':this.pickDrop(t.o);break;
  case 'pickobj':{const o=t.o;if(o.t==='bottle'){if(!canAdd('recipe')){UI.toast(T('bagFull'));return}removeObj(o);addItem('recipe',1,o.rec);UI.toast(T('bottle'));SFX.play('pop');playAnim('pick',.35)}else{if(!canAdd(o.id)){UI.toast(T('bagFull'));return}removeObj(o);addItem(o.id);UI.itemGet(o.id);SFX.play('pop');playAnim('pick',.35)}break}
  case 'shake':this.shake(t.o);break;
  case 'chop':this.chop(t.o);break;
  case 'hit':if(tk!=='shovel'&&tk!=='axe'){UI.toast(T('needTool'));return}this.hitRock(t.o);break;
  case 'pull':{if(!canAdd('weeds')){UI.toast(T('bagFull'));return}removeObj(t.o);addItem('weeds');SFX.play('pull');playAnim('pick',.35);stat('weed');UI.itemGet('weeds');break}
  case 'pickf':{const o=t.o;const id='fl_'+o.sp+'_'+o.col;if(!canAdd(id)){UI.toast(T('bagFull'));return}removeObj(o);addItem(id);SFX.play('pull');playAnim('pick',.35);UI.itemGet(id);break}
  case 'water':case 'water0':this.water(t.o);break;
  case 'dig':if(tk!=='shovel'){UI.toast(T('needShovel'));return}this.dig(t.o);break;
  case 'dig0':this.dig(null);break;
  case 'take':{const o=t.o;if(!canAdd(o.id)){UI.toast(T('bagFull'));return}removeObj(o);addItem(o.id,1,o.x2);SFX.play('pop');playAnim('pick',.35);break}
  case 'craft':UI.craft();break;
  case 'enter':House.enter();break;
  case 'fish':this.cast(t.o);break;
  case 'reel':case 'wait':this.reel();break;
  case 'swing':this.swing();break;
  case 'swing0':playAnim('swing',.35);SFX.play('swish');break;
  case 'look':UI.toast(t.o.t==='sapling'?'🌱':'🌱 '+(t.o.wat?'💧':''));break;
  default:if(!tk)UI.toast(T('needTool'))}
 },
 face(x,z){G.yaw=Math.atan2(x-G.pp.x,z-G.pp.z)},
 pickDrop(d){if(!canAdd(d.id,d.q)){UI.toast(T('bagFull'));return}removeDrop(d);addItem(d.id,d.q);SFX.play('pop');playAnim('pick',.3);UI.itemGet(d.id,d.q);if(d.id==='branch'&&!S.tut.done)Tut.ev('branch')},
 shake(o){const [ox,,oz]=objPos(o);this.face(ox,oz);playAnim('shake',.6);G.busy=.6;o._shake=.6;SFX.play('rustle');stat('shake');
  const around=()=>{const a=Math.random()*Math.PI*2,r=.75+Math.random()*.35;return [ox+Math.cos(a)*r,oz+Math.abs(Math.sin(a))*r*.9+.3]};
  setTimeout(()=>{
   if(o.ripe){const f=o.t==='palm'?'coconut':o.fr;const n=o.t==='palm'?2:3;for(let i=0;i<n;i++){const [x,z]=around();dropItem(f,x,z)}o.ripe=false;o.pick=dayNum();refreshObj(o);SFX.play('drop');return}
   o.shook=(o.shook||0)+1;
   if(o.shook===1&&o.t==='tree'){const need=!S.tut.done&&Tut.step()==='shake';const r=Math.random();
    if(need||r<.55){const [x,z]=around();dropItem('branch',x,z);if(Math.random()<.4||need){const [x2,z2]=around();dropItem('branch',x2,z2)}SFX.play('drop');return}
    if(r<.68&&(S.furnDrops||0)<2&&S.tut.done){S.furnDrops=(S.furnDrops||0)+1;const pool=['stool','fern','birdhouse','lantern','vase','teaset','honeypot','radio'];const [x,z]=around();dropItem(pool[(Math.random()*pool.length)|0],x,z);SFX.play('drop');return}}
   UI.toast(T('noBranch'))},380)},
 chop(o){const [ox,,oz]=objPos(o);this.face(ox,oz);playAnim('swing',.4);G.busy=.4;o._shake=.4;SFX.play('chop');
  setTimeout(()=>{if((o.chop||0)>=3){UI.toast(T('treeDone'));return}o.chop=(o.chop||0)+1;const r=Math.random();const id=r<.34?'wood':r<.67?'softwood':'hardwood';const a=Math.random()*6;dropItem(id,ox+Math.cos(a)*.8,oz+.6+Math.abs(Math.sin(a))*.4);wearTool()},250)},
 hitRock(o){const [ox,,oz]=objPos(o);this.face(ox,oz);playAnim('swing',.4);G.busy=.45;o._shake=.3;SFX.play('clink');stat('rock');
  setTimeout(()=>{if((o.hits||0)>=6){UI.toast(T('rockDone'));return}o.hits=(o.hits||0)+1;const a=Math.random()*Math.PI;
   if(o.money){const c=[100,200,400,800,1600,3200][o.hits-1];S.coins+=c;UI.toast('+'+c+' 🍯');SFX.play('coin');UI.refreshHud()}
   else{const r=Math.random();const id=r<.02?'gold':r<.55?'stone':r<.8?'clay':'iron';dropItem(id,ox+Math.cos(a)*.9,oz+.5+Math.sin(a)*.5)}
   this.splash(ox,.6,oz+.3,.3,6,0xb0a890);wearTool()},200)},
 water(o){const s=heldTool();if(!s){UI.toast(T('needTool'));return}playAnim('pick',.5);G.busy=.5;SFX.play('water');
  const fx=G.pp.x+Math.sin(G.yaw)*.9,fz=G.pp.z+Math.cos(G.yaw)*.9;this.splash(fx,(walkH(G.W,fx,fz)??.3)+.1,fz,.4,10,0x7fd0ff);
  // water all planted flowers in a 3x3 around target
  const cx=Math.floor(fx),cz=Math.floor(fz);let n=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const q=G.obj.get(oKey(cx+a,cz+b));if(q&&(q.t==='flower'&&!q.wild||q.t==='sapling')&&!q.wat){q.wat=true;n++}}
  if(n){stat('water',n);UI.toast(T('watered'))}wearTool()},
 dig(o){const s=heldTool();playAnim('dig',.5);G.busy=.5;SFX.play('dig');stat('digTry');
  setTimeout(()=>{
   if(o){if(o.clam){if(!canAdd('clam')){UI.toast(T('bagFull'));return}removeObj(o);addItem('clam');UI.toast(T('dugClam'));UI.itemGet('clam');stat('dig')}
    else{if(!canAdd('fossil_u')){UI.toast(T('bagFull'));return}removeObj(o);addItem('fossil_u');UI.toast(T('dugFossil'));SFX.play('jingle');stat('dig');stat('fossil')}}
   else{const fx=G.pp.x+Math.sin(G.yaw)*.8,fz=G.pp.z+Math.cos(G.yaw)*.8;this.splash(fx,(walkH(G.W,fx,fz)??.3)+.05,fz,.3,8,0x8a6a42);UI.toast(T('nothing'))}
   wearTool()},300)},
 // ---- bugs ----
 swing(){playAnim('swing',.4);G.busy=.4;SFX.play('swish');const fx=G.pp.x+Math.sin(G.yaw)*1.0,fz=G.pp.z+Math.cos(G.yaw)*1.0;
  setTimeout(()=>{let b=null,bd=1.5;for(const x of G.bugs){if(x.fled)continue;const d=Math.hypot(x.x-fx,x.z-fz);if(d<bd){bd=d;b=x}}
   if(!b){UI.toast(T('missBug'));return}
   Crit.removeBug(b);wearTool();this.caught('bu_'+b.id,null)},180)},
 caught(itemId,size){const it=ITEMS[itemId];const nm=N(it.n);const kind=it.cat==='fish'?'fish':'bug';const ped=S.pedia[kind]||(S.pedia[kind]={});const isNew=!ped[it.crit];ped[it.crit]=(ped[it.crit]||0)+1;
  stat(kind);if(kind==='fish'&&size)S.stats['big_'+it.crit]=Math.max(S.stats['big_'+it.crit]||0,size);
  playAnim('cheer',1.0);G.busy=1.0;SFX.play('fanfare');
  const ok=addItem(itemId,1,size?{cm:size}:undefined);
  UI.catchPop(itemId,T(kind==='fish'?'caughtFish':'caughtBug',nm),size?T('sizeCm',size):'',isNew,ok);
  if(!ok)UI.toast(T('bagFull'));
  Tut.ev(kind);save()},
 // ---- fishing ----
 cast(w){const s=heldTool();this.face(w.x,w.z);playAnim('cast',.5);SFX.play('cast');
  const bob=new THREE.Group();const b1=new THREE.Mesh(sph(.09,10,8),mat('#e2333c'));const b2=new THREE.Mesh(new THREE.SphereGeometry(.091,10,8,0,Math.PI*2,0,Math.PI/2),mat('#ffffff'));b2.position.y=.0;bob.add(b1,b2);
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:0xffffff}));
  G.worldGrp.add(bob,line);bob.position.set(G.pp.x,G.pp.y+1.2,G.pp.z);
  G.fishing={ph:'fly',t:0,w,bob,line,x:w.x,z:w.z,y:w.y,fish:null,n:0,nt:0};
  G.anim={k:'hold',t:0,d:.01}},
 reel(){const F=G.fishing;if(!F)return;
  if(F.ph==='bite'){const f=F.fish;const sp=FISH.find(x=>x[0]===f.id);const size=Math.round((sp[4]*14+8)*(0.8+Math.random()*.5));Crit.removeFish(f);this.endFish();this.splash(F.x,F.y,F.z,.5,14,0xffffff);wearTool();this.caught('fi_'+f.id,size);return}
  if(F.fish&&(F.ph==='nibble'||F.ph==='approach')){Crit.scareFish(F.fish);UI.toast(T('fishGone'))}
  this.endFish();SFX.play('reel')},
 endFish(){const F=G.fishing;if(!F)return;G.worldGrp.remove(F.bob,F.line);G.fishing=null;G.anim=null;const u=G.player.userData;u.arms[1].rotation.x=0},
 updFish(dt){const F=G.fishing;if(!F)return;F.t+=dt;const bob=F.bob;
  const tip=new THREE.Vector3(G.pp.x+Math.sin(G.yaw)*1.0,G.pp.y+1.55,G.pp.z+Math.cos(G.yaw)*1.0);
  if(F.ph==='fly'){const f=Math.min(1,F.t/.5);bob.position.set(tip.x+(F.x-tip.x)*f,tip.y+(F.y-tip.y)*f+Math.sin(f*Math.PI)*1.2,tip.z+(F.z-tip.z)*f);if(f>=1){F.ph='wait';F.t=0;this.splash(F.x,F.y,F.z,.3,8,0xffffff);SFX.play('plip')}}
  else{let dip=0;
   if(F.ph==='wait'){// find fish
    if(!F.fish){let best=null,bd=4.5;for(const f of G.fish){if(f.scared||f.where!==F.w.where)continue;const d=Math.hypot(f.x-F.x,f.z-F.z);if(d<bd){bd=d;best=f}}
     if(best){F.fish=best;best.hook=true;F.ph='approach';F.t=0}else if(F.t>.8){const f=Crit.spawnFishNear(F);if(f){F.fish=f;f.hook=true;F.ph='approach';F.t=0}}
     if(F.t>9){UI.toast(T('fishNone'));this.endFish();return}}}
   if(F.ph==='approach'){const f=F.fish;const a=Math.atan2(F.z-f.z,F.x-f.x);const d=Math.hypot(F.x-f.x,F.z-f.z);f.rot=a;if(d>.45){f.x+=Math.cos(a)*dt*1.0;f.z+=Math.sin(a)*dt*1.0}else{F.ph='nibble';F.t=0;F.n=1+((Math.random()*3)|0);F.nt=.5+Math.random()*.5}}
   if(F.ph==='nibble'){F.nt-=dt;if(F.nt<=0){if(F.n>0){F.n--;F.nt=.7+Math.random()*.7;F.dip=.25;SFX.play('nibble');this.ripple(F.x,F.y,F.z,.25)}else{F.ph='bite';F.t=0;F.dip=.9;SFX.play('bite');this.splash(F.x,F.y,F.z,.45,14,0xffffff);UI.excl()}}}
   if(F.ph==='bite'&&F.t>(!S.tut.done?1.3:.85)){Crit.scareFish(F.fish);UI.toast(T('fishGone'));this.endFish();return}
   F.dip=Math.max(0,(F.dip||0)-dt*2.2);dip=F.ph==='bite'?.12:F.dip*.12;
   bob.position.set(F.x,F.y-dip+Math.sin(G.t*3)*.015,F.z)}
  const pts=F.line.geometry.attributes.position;pts.setXYZ(0,tip.x,tip.y,tip.z);pts.setXYZ(1,bob.position.x,bob.position.y+.05,bob.position.z);pts.needsUpdate=true;F.line.geometry.computeBoundingSphere()},
 // ---- particles ----
 splash(x,y,z,r,n,col){for(let i=0;i<n;i++){const m=new THREE.Mesh(sph(.05,5,4),new THREE.MeshBasicMaterial({color:col,transparent:true}));const a=Math.random()*Math.PI*2;m.position.set(x,y,z);
  G.worldGrp.add(m);this.parts.push({m,vx:Math.cos(a)*r*(1+Math.random()),vy:1.8+Math.random()*1.2,vz:Math.sin(a)*r*(1+Math.random()),t:.6})}},
 ripple(x,y,z,s){const m=new THREE.Mesh(new THREE.RingGeometry(.12,.17,18),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,y+.01,z);G.worldGrp.add(m);this.parts.push({m,ring:1,t:.8})},
 sparkle(x,y,z){for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.05),new THREE.MeshBasicMaterial({color:0xfff27a,transparent:true}));m.position.set(x,y,z);G.worldGrp.add(m);const a=i/8*Math.PI*2;this.parts.push({m,vx:Math.cos(a)*.8,vy:1.2,vz:Math.sin(a)*.8,t:.7,ng:1})}},
 update(dt){this.updFish(dt);
  for(let i=this.parts.length-1;i>=0;i--){const p=this.parts[i];p.t-=dt;if(p.ring){p.m.scale.multiplyScalar(1+dt*3);p.m.material.opacity=p.t}else{p.vy-=(p.ng?2:9)*dt;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.m.position.z+=p.vz*dt;p.m.material.opacity=Math.min(1,p.t*2)}
   if(p.t<=0){G.worldGrp.remove(p.m);this.parts.splice(i,1)}}
  // cursor ring on target
  const t=G._tgt;let cx=null,cz=null;if(t&&t.o&&t.k!=='talk'){if(t.o.t){const p=objPos(t.o);cx=p[0];cz=p[2]}else if(t.o.x!=null&&t.k==='pick'){cx=t.o.x;cz=t.o.z}else if(t.k==='fish'){cx=t.o.x;cz=t.o.z}}
  if(cx!=null){G.cursor.visible=true;G.cursor.position.set(cx,(t.k==='fish'?t.o.y:(walkH(G.W,cx,cz)??.3))+.03,cz);G.cursor.scale.setScalar(1+Math.sin(G.t*6)*.08)}else G.cursor.visible=false}
};
// ================= critters =================
const Crit={
 reset(){for(const b of G.bugs)G.worldGrp&&G.worldGrp.remove(b.m);for(const f of G.fish)G.worldGrp&&G.worldGrp.remove(f.m);G.bugs=[];G.fish=[];this.acc=0;
  const W=G.W;this.water={sea:[],river:[],pond:[]};for(let z=0;z<W.N;z++)for(let x=0;x<W.N;x++){const t=W.T[W.I(x,z)];
   if(t===TY.RIVER)this.water.river.push([x,z]);else if(t===TY.POND)this.water.pond.push([x,z]);else if(t===TY.SEA){let near=false;for(let a=-3;a<=3&&!near;a++)for(let b=-3;b<=3;b++){const nx=x+a,nz=z+b;if(nx>=0&&nz>=0&&nx<W.N&&nz<W.N&&W.T[W.I(nx,nz)]===TY.SAND){near=true;break}}
    let adj=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,nz=z+b;if(nx>=0&&nz>=0&&nx<W.N&&nz<W.N&&W.T[W.I(nx,nz)]===TY.SAND)adj=true}if(near&&!adj)this.water.sea.push([x,z])}}},
 avail(list,where){const d=now(),h=d.getHours(),m=d.getMonth()+1;return list.filter(f=>(where?f[3]===where:true)&&inHours(h,f[6]||f[5])&&f[7].includes(m))},
 fishAvail(where){const d=now(),h=d.getHours(),m=d.getMonth()+1;return FISH.filter(f=>f[3]===where&&inHours(h,f[6])&&f[7].includes(m))},
 bugAvail(){const d=now(),h=d.getHours(),m=d.getMonth()+1;return BUGS.filter(b=>inHours(h,b[5])&&b[6].includes(m))},
 makeFish(where,x,z){const sp=this.fishAvail(where);if(!sp.length)return null;// rarity: cheaper fish more common
  const wts=sp.map(f=>1/Math.sqrt(f[5]));let r=Math.random()*wts.reduce((a,b)=>a+b,0);let s=sp[0];for(let i=0;i<sp.length;i++){r-=wts[i];if(r<=0){s=sp[i];break}}
  const y=where==='sea'?-.19:LV_H[G.W.L[G.W.I(Math.floor(x),Math.floor(z))]]-.32;
  const m=new THREE.Mesh(new THREE.CircleGeometry(.5,14),new THREE.MeshBasicMaterial({color:0x10304a,transparent:true,opacity:.42,depthWrite:false}));m.rotation.x=-Math.PI/2;const sc=.16+s[4]*.07;m.scale.set(sc*1.7,sc,1);
  m.position.set(x,y+.005,z);G.worldGrp.add(m);const f={id:s[0],where,x,z,y,m,tx:x,tz:z,rot:0,t:0};G.fish.push(f);return f},
 spawnFishNear(F){const L=this.water[F.w.where];const c=L.filter(([x,z])=>{const d=Math.hypot(x+.5-F.x,z+.5-F.z);return d>1.2&&d<2.6});if(!c.length)return null;const [x,z]=c[(Math.random()*c.length)|0];return this.makeFish(F.w.where,x+.5,z+.5)},
 removeFish(f){G.worldGrp.remove(f.m);G.fish.splice(G.fish.indexOf(f),1)},
 scareFish(f){if(!f)return;f.scared=1.2;f.hook=false},
 makeBug(def,x,y,z,anchor){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(def[7],def[8]),depthWrite:false}));const s=def[3]==='fly'||def[3]==='night'?.42:.32;sp.scale.set(s,s,s);sp.center.set(.5,.2);
  sp.position.set(x,y,z);G.worldGrp.add(sp);const b={id:def[0],kind:def[3],x,y,z,bx:x,by:y,bz:z,m:sp,s,ph:Math.random()*9,anchor};
  if(def[0]==='firefly'){sp.material.color.set(0xeaff80)}G.bugs.push(b);return b},
 removeBug(b){G.worldGrp.remove(b.m);const i=G.bugs.indexOf(b);if(i>=0)G.bugs.splice(i,1)},
 spawnBug(force){const av=this.bugAvail();if(!av.length)return;const p=G.pp;
  for(let tries=0;tries<12;tries++){const def=av[(Math.random()*av.length)|0];const ang=Math.random()*Math.PI*2,r=force?2.5+Math.random()*2:5+Math.random()*7;const x=p.x+Math.cos(ang)*r,z=p.z+Math.sin(ang)*r;
   const h=walkH(G.W,x,z);const k=def[3];
   if(k==='fly'||k==='night'||(force&&k!=='tree'&&k!=='rock'&&k!=='flower')){if(h==null)continue;if(blockedSoft(x,z))continue;return this.makeBug(def,x,h+(k==='fly'||k==='night'?.7:.02),z)}
   if(k==='ground'){if(h==null||blockedSoft(x,z))continue;const t=G.W.T[G.W.I(Math.floor(x),Math.floor(z))];if(t!==TY.GRASS)continue;return this.makeBug(def,x,h+.02,z)}
   const want=k==='tree'?['tree']:k==='flower'?['flower']:['rock'];
   const near=S.w.objs.filter(o=>want.includes(o.t)&&o._m&&Math.hypot(o.x+.5-x,o.z+.5-z)<6&&Math.hypot(o.x+.5-p.x,o.z+.5-p.z)>(force?1.5:4)&&!G.bugs.some(b=>b.anchor===o));
   if(!near.length)continue;const o=near[(Math.random()*near.length)|0];const [ox,oy,oz]=objPos(o);
   if(k==='tree')return this.makeBug(def,ox,oy+.55,oz+.22,o);if(k==='flower')return this.makeBug(def,ox,oy+.42,oz+.05,o);return this.makeBug(def,ox+.45,oy+.02,oz+.35,o)}},
 update(dt){const p=G.pp;this.acc=(this.acc||0)+dt;
  if(this.acc>1){this.acc=0;
   // despawn far
   for(const b of [...G.bugs])if(Math.hypot(b.x-p.x,b.z-p.z)>16)this.removeBug(b);
   for(const f of [...G.fish])if(Math.hypot(f.x-p.x,f.z-p.z)>16&&!f.hook)this.removeFish(f);
   if(G.bugs.length<5)this.spawnBug(!S.tut.done&&Tut.step()==='bug'&&G.bugs.length<2);
   // fish
   for(const where of ['sea','river','pond']){const cnt=G.fish.filter(f=>f.where===where).length;if(cnt>=3)continue;const L=this.water[where].filter(([x,z])=>{const d=Math.hypot(x+.5-p.x,z+.5-p.z);return d<12&&d>2});if(!L.length)continue;const [x,z]=L[(Math.random()*L.length)|0];this.makeFish(where,x+.5,z+.5)}}
  for(const b of [...G.bugs]){b.ph+=dt;const d=Math.hypot(b.x-p.x,b.z-p.z);
   if(!b.fled&&d<2.8&&G.running){b.fled=1;if(!S.tutBug){S.tutBug=true;UI.toast(T('bugFled'))}}
   if(b.fled){b.fled+=dt;if(b.kind==='fly'||b.kind==='night'||b.kind==='tree'||b.kind==='flower'){b.y+=dt*3;b.x+=(b.x-p.x)/Math.max(d,.1)*dt*3;b.z+=(b.z-p.z)/Math.max(d,.1)*dt*3}else{b.m.material.opacity=Math.max(0,1-b.fled*2)}if(b.fled>1.4){this.removeBug(b);continue}}
   else if(b.kind==='fly'||b.kind==='night'){b.x=b.bx+Math.sin(b.ph*.7)*1.2;b.z=b.bz+Math.sin(b.ph*.5+1)*1.0;b.y=b.by+Math.sin(b.ph*2.3)*.18;b.m.scale.x=b.s*(.55+Math.abs(Math.sin(b.ph*12))*.45)}
   else if(b.kind==='ground'){if(Math.random()<dt*.4){b.bx+=(Math.random()-.5)*.8;b.bz+=(Math.random()-.5)*.8;if(blockedSoft(b.bx,b.bz)||walkH(G.W,b.bx,b.bz)==null){b.bx=b.x;b.bz=b.z}}b.x+=(b.bx-b.x)*dt;b.z+=(b.bz-b.z)*dt;b.y=(walkH(G.W,b.x,b.z)??b.y)+.02}
   else if(b.kind==='flower'){b.m.scale.x=b.s*(.8+Math.abs(Math.sin(b.ph*10))*.2)}
   if(b.id==='firefly')b.m.material.opacity=.5+Math.sin(b.ph*4)*.5;
   if(b.id!=='firefly')b.m.material.color.setScalar(G.tint||1);b.m.position.set(b.x,b.y,b.z)}
  for(const f of G.fish){f.t+=dt;if(f.scared>0){f.scared-=dt;f.x+=Math.cos(f.rot+Math.PI)*dt*2.5;f.z+=Math.sin(f.rot+Math.PI)*dt*2.5;f.m.material.opacity=Math.max(0,.42*f.scared);if(f.scared<=0){this.removeFish(f);break}}
   else if(!f.hook){if(Math.hypot(f.tx-f.x,f.tz-f.z)<.1||f.t>4){f.t=0;const a=Math.random()*Math.PI*2;const nx=f.x+Math.cos(a)*1.2,nz=f.z+Math.sin(a)*1.2;const tx=Math.floor(nx),tz=Math.floor(nz);if(tx>=0&&tz>=0&&tx<G.W.N&&tz<G.W.N){const t=G.W.T[G.W.I(tx,tz)];const ok=f.where==='sea'?t===TY.SEA:f.where==='pond'?t===TY.POND:t===TY.RIVER;if(ok){f.tx=nx;f.tz=nz}}}
    const a=Math.atan2(f.tz-f.z,f.tx-f.x);f.rot=a;const dd=Math.hypot(f.tx-f.x,f.tz-f.z);if(dd>.05){f.x+=Math.cos(a)*dt*.35;f.z+=Math.sin(a)*dt*.35}}
   f.m.position.x=f.x;f.m.position.z=f.z;f.m.rotation.z=-f.rot}}
};
function blockedSoft(x,z){const o=G.obj.get(oKey(Math.floor(x),Math.floor(z)));if(o&&(o.t==='tree'||o.t==='rock'||o.t==='palm'))return true;for(const b of G.blds)if(Math.abs(x-b.x)<b.w/2+.3&&Math.abs(z-b.z)<b.d/2+.3)return true;return false}
