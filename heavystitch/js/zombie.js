/* Heavy Stitch v2: DEAD ZONE — round-based Husk survival (original mode inspired by classic arcade zombie survival).
   Start in a small walled checkpoint; spend points on gates to open bigger areas. Husks start dumb and slow and get
   smarter as the zone grows and the rounds climb (pathing, spreading out, flanking, climbing, runners, exploders, armor, Brutes). */
'use strict';
const Z={
 C:4,
 ROOMS:[
  {x0:-16,x1:16,z0:-16,z1:16,name:{en:'Checkpoint',ja:'検問所'},col:0x2bfff1},
  {x0:-24,x1:24,z0:-64,z1:-16,name:{en:'Night Market',ja:'ナイトマーケット'},col:0xff3df0},
  {x0:16,x1:64,z0:-24,z1:16,name:{en:'Rail Yard',ja:'操車場'},col:0xffd23a},
  {x0:24,x1:72,z0:-72,z1:-24,name:{en:'Neon Plaza',ja:'ネオン広場'},col:0x7dff4a},
  {x0:-72,x1:-16,z0:-28,z1:16,name:{en:'Reactor Hall',ja:'リアクターホール'},col:0xff7a1a},
  {x0:-28,x1:28,z0:16,z1:72,name:{en:'Overpass',ja:'高架下'},col:0xb05cff}],
 DOORS:[
  {a:0,b:1,line:'z',v:-16,lo:-4,hi:4,cost:750},{a:0,b:2,line:'x',v:16,lo:-4,hi:4,cost:1000},{a:1,b:3,line:'x',v:24,lo:-48,hi:-40,cost:1250},
  {a:2,b:3,line:'z',v:-24,lo:36,hi:44,cost:1250},{a:0,b:4,line:'x',v:-16,lo:-4,hi:4,cost:1500},{a:0,b:5,line:'z',v:16,lo:-4,hi:4,cost:1500}],
 WINS:[['z',-16,-10,0],['x',16,10,0],['x',-16,-10,0],['z',16,10,0],['z',-64,-10,1],['z',-64,10,1],['x',-24,-50,1],['x',64,-6,2],['z',16,46,2],
  ['x',72,-46,3],['z',-72,50,3],['x',-72,-6,4],['z',-28,-42,4],['z',16,-42,4],['x',-28,42,5],['x',28,42,5],['z',72,2,5]],
 SUPPLY:[11,-11],
 lab(x,z){for(let i=0;i<this.ROOMS.length;i++){const r=this.ROOMS[i];if(x>r.x0&&x<r.x1&&z>r.z0&&z<r.z1)return i;}return-1;},
 // ---------- BUILD (called from G.buildProps for the 'zone' map) ----------
 build(G){const S=G.scene,C=this.C;G.boxes=[];this.doorM=[];this.winM=[];
  const wallMat=G.mat(0x2a2d36),stripMat=G.glowMat(0x2bfff1,.85),hazMat=G.mat(0xffd23a);
  const addBox=(x0,x1,z0,z1,h,mesh)=>{const b={x0,x1,z0,z1,h,on:true,mesh};G.boxes.push(b);return b;};
  const wall=(x0,x1,z0,z1)=>{const w=x1-x0,d=z1-z0;const m=new THREE.Mesh(new THREE.BoxGeometry(w,5,d),wallMat);m.position.set((x0+x1)/2,2.5,(z0+z1)/2);S.add(m);G.propList.push(m);
   const st=new THREE.Mesh(new THREE.BoxGeometry(w+.02,.25,d+.02),stripMat);st.position.y=2.4;m.add(st);const hz=new THREE.Mesh(new THREE.BoxGeometry(w+.04,.5,d+.04),hazMat);hz.position.y=-2.1;m.add(hz);addBox(x0,x1,z0,z1,5.5,m);};
  // room floors
  this.floors=this.ROOMS.map((r,i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(r.x1-r.x0-.4,r.z1-r.z0-.4),new THREE.MeshBasicMaterial({color:i?0x0d0e14:0x1a2a33,transparent:true,opacity:.55,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set((r.x0+r.x1)/2,.03,(r.z0+r.z1)/2);S.add(m);
   const e=new THREE.Mesh(new THREE.RingGeometry(1,1.02,4,1),G.glowMat(r.col,.0));return m;});
  // edges from the cell grid
  const N=Math.round(144/C),O=-72;const L=(i,j)=>i<0||j<0||i>=N||j>=N?-1:this.lab(O+i*C+C/2,O+j*C+C/2);
  const isDoor=(line,v,a)=>this.DOORS.findIndex(d=>d.line===line&&d.v===v&&a>d.lo-.01&&a<d.hi+.01);
  const isWin=(line,v,a)=>this.WINS.findIndex(w=>w[0]===line&&w[1]===v&&Math.abs(w[2]-a)<C/2);
  const T=.5;
  // vertical edges (line x = const)
  for(let i=-1;i<N;i++){let run=null;const x=O+(i+1)*C;const flush=()=>{if(run){wall(x-T,x+T,run[0],run[1]);run=null;}};
   for(let j=0;j<N;j++){const a=L(i,j),b=L(i+1,j);const z0=O+j*C,z1=z0+C;if(a===b||(a<0&&b<0)){flush();continue;}
    if(isDoor('x',x,z0+C/2)>=0||isWin('x',x,z0+C/2)>=0){flush();continue;}if(run&&Math.abs(run[1]-z0)<.01)run[1]=z1;else{flush();run=[z0,z1];}}flush();}
  for(let j=-1;j<N;j++){let run=null;const z=O+(j+1)*C;const flush=()=>{if(run){wall(run[0],run[1],z-T,z+T);run=null;}};
   for(let i=0;i<N;i++){const a=L(i,j),b=L(i,j+1);const x0=O+i*C,x1=x0+C;if(a===b||(a<0&&b<0)){flush();continue;}
    if(isDoor('z',z,x0+C/2)>=0||isWin('z',z,x0+C/2)>=0){flush();continue;}if(run&&Math.abs(run[1]-x0)<.01)run[1]=x1;else{flush();run=[x0,x1];}}flush();}
  // gates
  for(const d of this.DOORS){const g=new THREE.Group();const len=d.hi-d.lo;const body=new THREE.Mesh(new THREE.BoxGeometry(d.line==='z'?len:.9,5,d.line==='z'?.9:len),G.mat(0x3a2e14));g.add(body);
   for(let k=0;k<4;k++){const s=new THREE.Mesh(new THREE.BoxGeometry(d.line==='z'?len*.98:.95,.35,d.line==='z'?.95:len*.98),k%2?G.mat(0x111111):hazMat);s.position.y=-1.6+k*.9;g.add(s);}
   const mid=(d.lo+d.hi)/2;if(d.line==='z')g.position.set(mid,2.5,d.v);else g.position.set(d.v,2.5,mid);S.add(g);
   const sign=G.holo(g,0,3.6,0,0xffd23a,5);sign.material.map=this.priceTex(d.cost);sign.rotation.y=d.line==='z'?0:Math.PI/2;d.sign=sign;
   d.box=d.line==='z'?addBox(d.lo,d.hi,d.v-T,d.v+T,9,g):addBox(d.v-T,d.v+T,d.lo,d.hi,9,g);d.mesh=g;d.c=d.line==='z'?new V3(mid,0,d.v):new V3(d.v,0,mid);}
  // barricade windows
  this.wins=this.WINS.map(w=>{const[line,v,c,near]=w;const r=this.ROOMS[near];const nearSide=line==='z'?((r.z0+r.z1)/2>v?1:-1):((r.x0+r.x1)/2>v?1:-1);
   const pos=line==='z'?new V3(c,0,v):new V3(v,0,c);const nrm=line==='z'?new V3(0,0,nearSide):new V3(nearSide,0,0);
   const g=new THREE.Group();g.position.copy(pos);S.add(g);for(const s of[-1,1]){const post=new THREE.Mesh(new THREE.BoxGeometry(line==='z'?.6:1.1,5,line==='z'?1.1:.6),wallMat);post.position.set(line==='z'?s*1.8:0,2.5,line==='z'?0:s*1.8);g.add(post);}
   const top=new THREE.Mesh(new THREE.BoxGeometry(line==='z'?4:1,1.2,line==='z'?1:4),wallMat);top.position.y=4.4;g.add(top);
   const planks=[];for(let k=0;k<5;k++){const pm=new THREE.Mesh(new THREE.BoxGeometry(line==='z'?3.6:.3,.5,line==='z'?.3:3.6),G.mat(k%2?0x8d939e:0x6a6f7a));pm.position.y=.6+k*.7;pm.rotation[line==='z'?'z':'x']=(k%2?.12:-.12);g.add(pm);planks.push(pm);}
   const glowS=new THREE.Mesh(new THREE.PlaneGeometry(line==='z'?3.6:.01,.15),G.glowMat(0x2bfff1,.8));
   const box=line==='z'?addBox(c-2,c+2,v-T,v+T,5.5,null):addBox(v-T,v+T,c-2,c+2,5.5,null);
   return{line,v,c,near,pos,nrm,g,planks,n:5,box,out:pos.clone().addScaledVector(nrm,-5),inn:pos.clone().addScaledVector(nrm,3),tearT:0};});
  // supply station
  const sp=new THREE.Group();const crate=G.box(3,2.2,3,0x22252e);crate.position.y=1.1;sp.add(crate);const crs=new THREE.Mesh(new THREE.BoxGeometry(3.05,.5,1),G.glowMat(0x7dff4a,.9));crs.position.y=1.6;sp.add(crs);
  const crs2=new THREE.Mesh(new THREE.BoxGeometry(1,.5,3.05),G.glowMat(0x7dff4a,.9));crs2.position.y=1.6;sp.add(crs2);const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,14,6,1,true),G.glowMat(0x7dff4a,.25));lamp.position.y=8;sp.add(lamp);
  sp.position.set(this.SUPPLY[0],0,this.SUPPLY[1]);S.add(sp);G.colliders.push({x:this.SUPPLY[0],z:this.SUPPLY[1],r:2});G.holo(sp,0,4.2,0,0x7dff4a,4).material.map=this.priceTex(500,'+');
  // holo room signs + some neon clutter
  this.ROOMS.forEach((r,i)=>{const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='#'+r.col.toString(16).padStart(6,'0');g.font='900 52px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(r.name.en.toUpperCase(),256,50);
   const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const m=new THREE.Mesh(new THREE.PlaneGeometry(10,1.9),new THREE.MeshBasicMaterial({map:t,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
   m.position.set((r.x0+r.x1)/2,7.5,(r.z0+r.z1)/2);m.userData.bill=1;S.add(m);r.sign=m;});
  const R=()=>G.srand();for(let i=1;i<6;i++){const r=this.ROOMS[i];for(let k=0;k<3;k++){const x=r.x0+6+R()*(r.x1-r.x0-12),z=r.z0+6+R()*(r.z1-r.z0-12);if(this.nearDoorOrWin(x,z,7))continue;const c=G.box(4,2+R()*2,2.4,[0xff7a1a,0x2a8a96,0x3a3f4b][k%3]);c.rotation.y=R()*3;c.position.y=1.2;G.addProp(c,x,z,2.6);}}},
 nearDoorOrWin(x,z,r){for(const d of this.DOORS){const mid=(d.lo+d.hi)/2;const p=d.line==='z'?[mid,d.v]:[d.v,mid];if(Math.hypot(p[0]-x,p[1]-z)<r+4)return true;}for(const w of this.WINS){const p=w[0]==='z'?[w[2],w[1]]:[w[1],w[2]];if(Math.hypot(p[0]-x,p[1]-z)<r)return true;}return Math.hypot(x-this.SUPPLY[0],z-this.SUPPLY[1])<r;},
 priceTex(n,pre){const c=document.createElement('canvas');c.width=256;c.height=96;const g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,0,256,96);g.strokeStyle=pre?'#7dff4a':'#ffd23a';g.lineWidth=6;g.strokeRect(4,4,248,88);
  g.fillStyle=pre?'#7dff4a':'#ffd23a';g.font='900 54px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText((pre||'')+n,128,52);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;},
 // ---------- MODE ----------
 begin(G){const P=G.P;this.G=G;this.round=0;this.pts=500;this.score=0;this.open=[true,false,false,false,false,false];this.toSpawn=0;this.spawnT=0;this.breakT=3;this.kills=0;this.smartSaid=false;this.climbSaid=false;
  this.plankPts=0;this.actHold=0;this.actT=null;for(const w of this.wins){w.n=5;this.setPlanks(w);}for(const d of this.DOORS){d.open=false;d.box.on=true;d.mesh.visible=true;d.mesh.position.y=2.5;}
  P.pos.set(0,0,4);G.camYaw=Math.PI;this.floorTint();document.body.classList.add('zmode');HUD.zInit();setTimeout(()=>{if(G.on)HUD.comm(COMMS.z_start);},900);HUD.tip(HS.T('tip_zombie'));},
 rooms(){return this.open.filter(Boolean).length;},
 iq(){return this.rooms()-1+Math.floor(this.round/4);},
 floorTint(){this.floors.forEach((m,i)=>{m.material.color.setHex(this.open[i]?0x1a2a33:0x08080c);m.material.opacity=this.open[i]?.5:.75;});},
 setPlanks(w){w.planks.forEach((p,k)=>{p.visible=k<w.n;});},
 startRound(G){this.round++;this.toSpawn=Math.min(80,4+3*this.round);this.spawnT=1;this.brutes=this.round%10===0?1+Math.floor(this.round/20):0;
  HUD.zRound(this.round,true);AU.play('round');if(this.brutes){setTimeout(()=>{if(G.on)HUD.comm(COMMS.z_boss);},1500);}
  const iq=this.iq();if(iq>=3&&!this.smartSaid){this.smartSaid=true;setTimeout(()=>{if(G.on)HUD.comm(COMMS.z_smart);},2400);}},
 update(G,dt){const P=G.P;if(!P)return;
  const alive=G.E.filter(e=>e.alive&&e.z);
  if(this.breakT>0){this.breakT-=dt;if(this.breakT<=0)this.startRound(G);}
  else{this.spawnT-=dt;const cap=10+2*this.rooms();
   if(this.toSpawn>0&&alive.length<cap&&this.spawnT<=0){this.spawnT=Math.max(.35,2-this.round*.1)*(alive.length<3?.5:1);this.toSpawn--;this.spawnOne(G);}
   if(this.toSpawn<=0&&alive.length===0){this.breakT=8;HUD.zRound(this.round,false);HUD.pop((HS.lang==='ja'?'ラウンド ':'ROUND ')+this.round+(HS.lang==='ja'?' クリア！':' CLEAR!'),'#7dff4a');AU.play('hype');G.sup(10);}}
  // interactables
  const I=G.in;let best=null;
  for(const d of this.DOORS){if(d.open||!(this.open[d.a]||this.open[d.b]))continue;const dd=Math.hypot(P.pos.x-d.c.x,P.pos.z-d.c.z);if(dd<6.5&&(!best||dd<best.d))best={kind:'door',d:dd,o:d,cost:d.cost};}
  for(const w of this.wins){if(!this.open[w.near]||w.n>=5)continue;const dd=Math.hypot(P.pos.x-w.inn.x,P.pos.z-w.inn.z);if(dd<5&&(!best||dd<best.d))best={kind:'rebuild',d:dd,o:w};}
  const ds=Math.hypot(P.pos.x-this.SUPPLY[0],P.pos.z-this.SUPPLY[1]);if(ds<5.5&&(!best||ds<best.d))best={kind:'supply',d:ds,cost:500};
  this.act=best;HUD.zAct(best,this.pts);
  if(best&&best.kind==='rebuild'){if(I.act){this.actHold-=dt;if(this.actHold<=0){this.actHold=.42;const w=best.o;if(!w.tearing||w.tearing.alive===false){w.n=Math.min(5,w.n+1);this.setPlanks(w);this.addPts(10,true);AU.play('plank');G.burst(w.pos.clone().setY(1+w.n*.6),0xd8dce4,6,5,.7,.3);}}}else this.actHold=0;}
  if(I.actPress){I.actPress=false;if(best&&best.kind==='door')this.buyDoor(G,best.o);else if(best&&best.kind==='supply')this.supply(G);else if(!best)AU.play('deny',.5);}
  // animate opened gates sinking
  for(const d of this.DOORS){if(d.open&&d.mesh.visible){d.mesh.position.y-=dt*4;if(d.mesh.position.y<-3)d.mesh.visible=false;}}
  for(const r of this.ROOMS){if(r.sign)r.sign.lookAt(G.cam.position.x,r.sign.position.y,G.cam.position.z);}
  for(const d of this.DOORS){if(d.sign&&d.sign.parent&&d.sign.parent.visible!==false){const wp=new THREE.Vector3();d.sign.getWorldPosition(wp);const a=Math.atan2(G.cam.position.x-wp.x,G.cam.position.z-wp.z);d.sign.rotation.y=a-(d.sign.parent.rotation?d.sign.parent.rotation.y:0);}}
  HUD.zUpdate(this);HUD.progress(HS.T('round')+' '+this.round+'  ·  '+alive.length+'+'+this.toSpawn);},
 addPts(n,plank){if(plank){if(this.plankPts>=500)return;this.plankPts+=n;}this.pts+=n;this.score+=n;HUD.zPts(n);},
 buyDoor(G,d){if(this.pts<d.cost&&!HS.state.cheat){AU.play('deny');HUD.pop(HS.T('notEnough'),'#ff5a4a');return;}if(!HS.state.cheat)this.pts-=d.cost;d.open=true;d.box.on=false;
  const newR=this.open[d.a]?d.b:d.a;const wasNew=!this.open[newR];this.open[newR]=true;this.floorTint();AU.play('door');G.shake=.4;G.burst(d.c.clone().setY(2.5),0xffd23a,30,12,1.4,.6);
  if(wasNew){HUD.comm(COMMS.z_door);HUD.stamp(HS.L(this.ROOMS[newR].name));}
  const iq=this.iq();if(iq>=3&&!this.smartSaid){this.smartSaid=true;setTimeout(()=>{if(G.on)HUD.comm(COMMS.z_smart);},4800);}},
 supply(G){const P=G.P;if(this.pts<500&&!HS.state.cheat){AU.play('deny');HUD.pop(HS.T('notEnough'),'#ff5a4a');return;}if(!HS.state.cheat)this.pts-=500;
  for(const s of['wr','wl','sh','bk']){const W=P.W[s];if(W&&W.p.mag){W.res=W.p.mag*6;W.mag=W.p.mag;W.rl=0;W.dry=0;}}P.ap=Math.min(P.apMax,P.ap+P.apMax*.5);P.kits=P.kitsMax;
  AU.play('repair');AU.play('buy');G.burst(P.pos.clone().setY(2),0x7dff4a,30,8,1.3,.7);G.ringFx(P.pos.clone().setY(.2),0x7dff4a,.5,5,.5);HUD.pop(HS.T('supply')+' ✓','#7dff4a');},
 // ---------- SPAWN ----------
 pickType(){const r=this.round,iq=this.iq(),x=Math.random();
  if(this.brutes>0&&this.toSpawn<=Math.max(2,this.brutes*2)){this.brutes--;return'brute';}
  if(r>=8&&x<.14)return'armored';if(r>=6&&x<.26)return'exploder';if(r>=5&&iq>=1&&x<.26+Math.min(.3,(r-5)*.04))return'runner';return'walker';},
 spawnOne(G){const P=G.P,iq=this.iq();const ws=this.wins.filter(w=>this.open[w.near]&&!this.farOpen(w));const list=ws.length?ws:this.wins.filter(w=>this.open[w.near]);
  let w;if(iq<2){list.sort((a,b)=>a.pos.distanceTo(P.pos)-b.pos.distanceTo(P.pos));w=list[Math.floor(Math.random()*Math.min(2,list.length))];}
  else{w=list[Math.floor(Math.random()*list.length)];}
  const t=this.pickType();const e=this.makeHusk(G,t,w.out.clone().add(new V3(rnd(-1,1),0,rnd(-1,1))));e.win=w;e.state='approach';e.climber=iq>=4&&(t==='runner'||Math.random()<.25)&&t!=='brute';},
 farOpen(w){const far=w.pos.clone().addScaledVector(w.nrm,-3);const l=this.lab(far.x,far.z);return l>=0&&this.open[l];},
 makeHusk(G,t,pos){const r=this.round,iq=this.iq();const hp=300*(1+.18*(r-1))*({walker:1,runner:.8,exploder:.9,armored:2.2,brute:14}[t]);
  const spd=t==='runner'?Math.min(15,12+r*.08):t==='brute'?Math.min(6,3.5+r*.08):Math.min(9.5,2.6+.3*(r-1)+.6*iq)*(t==='armored'?.8:1);
  const sc=t==='brute'?2.1:t==='runner'?.92:1;const m=this.huskMesh(G,t,sc);const e={type:t,z:1,pos:pos.clone(),vel:new V3(),ap:hp,apMax:hp,shock:0,shockMax:0,stag:0,cd:1,r:1.1*sc,h:3.3*sc,alive:true,mesh:m,t:rnd(0,9),
   name:{en:'HUSK',ja:'ハスク'},cr:0,need:true,spd,armor:t==='armored',eye:m.userData.eyeCol,side:Math.random()<.5?-1:1};
  e.mesh.position.copy(e.pos);G.E.push(e);return e;},
 huskMesh(G,t,sc){const g=new THREE.Group();const body=new THREE.Group();g.add(body);const add=(m,x,y,z,p)=>{m.position.set(x,y,z);(p||body).add(m);return m;};
  const col={walker:0x5a6450,runner:0x6a5a4a,exploder:0x5a5a40,armored:0x3a4250,brute:0x4a3a3a}[t];const eyeCol={walker:0x7dff4a,runner:0xff7a1a,exploder:0xffd23a,armored:0x2bfff1,brute:0xff3a2a}[t];
  add(G.box(.5,1.5,.5,0x2a2e33,0,false),-.35,.75,0);add(G.box(.5,1.5,.5,0x2a2e33,0,false),.35,.75,0);
  const torso=add(G.box(1.4,1.4,.9,col),0,2.1,0);torso.rotation.x=.35;
  if(t==='armored'){add(G.box(1.6,.9,1.1,0x8d939e),0,2.3,.1);add(G.box(.7,.4,.9,0xffd23a,0,false),0,1.6,.3);}
  if(t==='exploder'){const tank=add(new THREE.Mesh(new THREE.SphereGeometry(.75,10,8),G.mat(0xffd23a,0x403000)),0,2.4,-.6);g.userData.tank=tank;}
  const head=add(G.box(.8,.7,.8,0x3a3f4b),0,3.05,.3);const visor=new THREE.Mesh(new THREE.BoxGeometry(.7,.16,.05),G.glowMat(eyeCol,1));visor.position.set(0,.05,.42);head.add(visor);
  const arms=[];for(const s of[-1,1]){const a=new THREE.Group();a.position.set(s*.85,2.55,.1);body.add(a);const arm=G.box(.32,.32,1.5,0x2a2e33,0,false);arm.position.z=.7;a.add(arm);const claw=G.box(.45,.2,.4,0x8d939e,0,false);claw.position.z=1.5;a.add(claw);a.rotation.x=-.25;arms.push(a);}
  if(t==='brute'){add(G.box(2.2,.8,1.2,0x8d939e),0,2.9,0);for(const s of[-1,1])add(new THREE.Mesh(new THREE.ConeGeometry(.25,.8,6),G.mat(0xff3a2a)),s*.8,3.5,0);}
  g.scale.setScalar(sc);g.userData={arms,body,head,visor,eyeCol};G.scene.add(g);return g;},
 // ---------- AI ----------
 updFoes(G,dt){const P=G.P;if(!P)return;const iq=this.iq();const pRoom=this.lab(P.pos.x,P.pos.z);const zs=G.E.filter(e=>e.alive&&e.z);
  for(const e of zs){e.t+=dt;if(e.hitT)e.hitT-=dt;const m=e.mesh,u=m.userData;let want=null,speed=e.spd*(e.slowT>0?.4:1);if(e.slowT>0)e.slowT-=dt;e.cd-=dt;
   const stunned=G.result||e.stag>0;if(e.stag>0)e.stag-=dt;
   switch(e.state){
   case'approach':{const w=e.win;if(e.climber&&w.n>0){e.state='climb';e.cT=0;break;}want=w.out.clone().addScaledVector(w.nrm,1.2);if(e.pos.distanceTo(want)<1.6||Math.hypot(e.pos.x-w.pos.x,e.pos.z-w.pos.z)<4.2){e.state=w.n>0?'tear':'enter';e.tT=.6;}break;}
   case'tear':{const w=e.win;want=null;e.vel.multiplyScalar(.8);w.tearing=e;if(w.n<=0){e.state='enter';break;}e.tT-=dt;if(e.tT<=0){e.tT=Math.max(.45,1.3-iq*.12-this.round*.02);w.n--;this.setPlanks(w);AU.play('plank',.7);G.burst(w.pos.clone().setY(.8+w.n*.7),0x9aa0aa,6,6,.7,.4);u.arms.forEach(a=>a.rotation.x=-1.3);}
    const fy=Math.atan2(-w.nrm.x*-1,-w.nrm.z*-1);m.rotation.y=Math.atan2(w.nrm.x,w.nrm.z);break;}
   case'enter':{const w=e.win;want=w.inn;speed=Math.max(4,speed*.7);if(e.pos.distanceTo(w.inn)<1.4||Math.hypot(e.pos.x-w.inn.x,e.pos.z-w.inn.z)<1.6){e.state='hunt';if(w.tearing===e)w.tearing=null;}break;}
   case'climb':{const w=e.win;e.cT+=dt;const k=Math.min(1,e.cT/1.6);e.pos.lerpVectors(w.out,w.inn,k);e.pos.y=Math.sin(k*Math.PI)*5.8;if(!this.climbSaid&&k>.3){this.climbSaid=true;HUD.comm(COMMS.z_climb);}if(k>=1){e.state='hunt';e.pos.y=0;}break;}
   default:{// hunt
    const zr=this.lab(e.pos.x,e.pos.z);let tgt=P.pos;
    if(iq>=1&&zr>=0&&pRoom>=0&&zr!==pRoom){const nx=this.route(zr,pRoom);if(nx)tgt=nx;}
    else if(iq>=3&&e.type!=='brute'){const d=e.pos.distanceTo(P.pos);if(d>9){const to=P.pos.clone().sub(e.pos).setY(0).normalize();const pr=new V3(-to.z,0,to.x).multiplyScalar(e.side*Math.min(10,d*.45));tgt=P.pos.clone().add(pr);}}
    want=tgt;break;}}
   if(e.state==='climb'){m.position.copy(e.pos);m.rotation.y=Math.atan2(e.win.nrm.x,e.win.nrm.z);continue;}
   if(want&&!stunned){const to=want.clone().sub(e.pos).setY(0);const d=to.length();if(d>.2){to.normalize();
     // dumb husks turn slowly and walk straight; smart ones steer quickly
     const turn=clamp((iq>=2?6:2.2)*dt,0,1);const tv=to.multiplyScalar(speed);e.vel.x=lerp(e.vel.x,tv.x,turn+.08);e.vel.z=lerp(e.vel.z,tv.z,turn+.08);}}
   else e.vel.multiplyScalar(.85);
   // separation
   for(const o of zs){if(o===e||o.state==='climb')continue;const dx=e.pos.x-o.pos.x,dz=e.pos.z-o.pos.z,dd=dx*dx+dz*dz,rr=(e.r+o.r)*1.1;if(dd<rr*rr&&dd>1e-4){const k=(rr-Math.sqrt(dd))*2;e.vel.x+=dx*k;e.vel.z+=dz*k;}}
   e.pos.addScaledVector(e.vel,dt);e.pos.y=0;if(e.state==='hunt'||e.state==='approach'||e.state==='tear')G.bound(e.pos,e.r*.8);
   if(e.state==='enter'){const w=e.win;/* walk through the window opening only */const lat=w.line==='z'?e.pos.x-w.c:e.pos.z-w.c;if(Math.abs(lat)>1.4){if(w.line==='z')e.pos.x=w.c+Math.sign(lat)*1.4;else e.pos.z=w.c+Math.sign(lat)*1.4;}}
   // attack
   const pd=Math.hypot(P.pos.x-e.pos.x,P.pos.z-e.pos.z);
   if(!stunned&&e.state==='hunt'&&P.ap>0){
    if(e.type==='exploder'){if(pd<3.8&&!e.fuse){e.fuse=.6;AU.play('alarm',.5);}if(e.fuse){e.fuse-=dt;u.visor.material=G.gm(Math.sin(e.t*40)>0?0xffffff:0xff3a2a);if(e.fuse<=0){this.detonate(G,e);continue;}}}
    else if(pd<(e.type==='brute'?5:2.7)+(P.pos.y<4.5?0:-99)&&e.cd<=0){e.cd=e.type==='brute'?2.2:e.type==='runner'?.8:1.1;u.arms.forEach(a=>a.rotation.x=-1.4);
     const dmg=P.apMax*(.05+.004*this.round)*(e.type==='brute'?3.2:e.type==='armored'?1.3:1);if(e.type==='brute'){G.ringFx(e.pos.clone().setY(.2),0xff3a2a,.5,6,.35);G.shake=.6;AU.play('boom',.6);}
     G.hurtPlayer(dmg,e.type==='brute'?900:120,e.pos);AU.play('hurt',.4);}}
   // animate
   const mv=Math.hypot(e.vel.x,e.vel.z);if(e.state!=='tear'&&mv>.3)m.rotation.y=lerp(m.rotation.y,m.rotation.y+angDiff(m.rotation.y,Math.atan2(e.vel.x,e.vel.z)),clamp(8*dt,0,1));
   const ph=e.t*(4+mv*.8);u.body.position.y=Math.abs(Math.sin(ph))*.12;u.body.rotation.z=Math.sin(ph)*.08*(e.type==='runner'?2:1);u.arms.forEach((a,i)=>{a.rotation.x=lerp(a.rotation.x,-.25+Math.sin(ph+i*Math.PI)*.18,clamp(6*dt,0,1));});
   if(e.type!=='exploder'||!e.fuse)u.visor.material=G.gm(e.hitT>0?0xffffff:e.eye);if(u.tank)u.tank.scale.setScalar(1+Math.sin(e.t*6)*.06);
   m.position.set(e.pos.x,e.pos.y,e.pos.z);
   if(Math.random()<dt*.15)AU.play('groan',.5);}},
 route(from,to){// BFS over open gates -> next waypoint (door centre)
  const prev={};prev[from]=-1;const q=[from];while(q.length){const r=q.shift();if(r===to)break;for(const d of this.DOORS){if(!d.open)continue;const n=d.a===r?d.b:d.b===r?d.a:-1;if(n<0||prev[n]!==undefined||!this.open[n])continue;prev[n]={r,d};q.push(n);}}
  if(prev[to]===undefined)return null;let cur=to,step=null;while(prev[cur]!==-1){step=prev[cur];if(step.r===from)break;cur=step.r;}return step?step.d.c:null;},
 detonate(G,e){const p=e.pos.clone().setY(1.5);G.explode(p,6,0xffd23a,true,true);const P=G.P;if(P&&P.pos.distanceTo(p)<7)G.hurtPlayer(P.apMax*.22,700,p);
  for(const o of G.E){if(o!==e&&o.alive&&o.z&&o.pos.distanceTo(p)<7)G.dmgFoe(o,1500,0,'splash');}e.lastSrc='boom';G.killFoe(e);},
 onHit(G,e,src){if(src!=='boom')this.addPts(10);},
 onKill(G,e){this.kills++;const melee=e.lastSrc==='slash'||e.lastSrc==='melee';const bonus=e.type==='brute'?500:e.type==='armored'?40:0;
  if(e.lastSrc!=='boom'||true)this.addPts((melee?100:60)+bonus);G.sup(melee?6:3);
  if(e.type==='exploder'&&e.lastSrc!=='boom'){const p=e.pos.clone();setTimeout(()=>{if(!G.on||!G.scene)return;for(const o of G.E){if(o.alive&&o.z&&o.pos.distanceTo(p)<6)G.dmgFoe(o,900,0,'splash');}},60);}
  if(e.win&&e.win.tearing===e)e.win.tearing=null;},
 finish(G){const P=G.P,M=G.mission;const rounds=Math.max(0,this.round-1);const flux=10*rounds+Math.floor(this.kills/10);
  G.result={win:false,zombie:true,mission:M,time:G.t,apPct:0,kills:this.kills,rank:'—',credits:Math.floor(this.score/2),wave:this.round,round:this.round,rounds,score:this.score,flux,cid:P.cid,kitsUsed:P.kitsUsed};
  G.endT=2.8;HUD.stamp(HS.T('zover'));AU.play('lose');P.abOn=false;AU.boost(0);G.lock=null;G.slow=1.2;},
 debugSkip(G){for(const e of G.E)if(e.alive&&e.z){e.lastSrc='shot';G.killFoe(e);}this.toSpawn=0;if(this.breakT>1)this.breakT=.5;return true;},
};
Object.assign(HUD,{
 zInit(){this.c.zr=null;this.c.zp=null;},
 zRound(n,start){const el=this.$('zRound');el.textContent=n;el.classList.remove('pulse');void el.offsetWidth;el.classList.add(start?'pulse':'done');if(start)this.stamp(HS.T('round')+' '+n);},
 zPts(n){const el=this.$('zAdd');el.textContent='+'+n;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');},
 zUpdate(Zs){const c=this.c;if(c.zp!==Zs.pts){c.zp=Zs.pts;this.$('zPts').textContent=Zs.pts.toLocaleString();}if(c.zr!==Zs.round){c.zr=Zs.round;this.$('zRound').textContent=Zs.round;}},
 zAct(a,pts){const b=document.querySelector('.tb[data-k="act"]');const k=a?a.kind+(a.cost||'')+(a.cost&&pts<a.cost?'x':''):'';if(this.c.act===k)return;this.c.act=k;
  b.classList.toggle('show',!!a);if(!a)return;b.classList.toggle('cd',!!(a.cost&&pts<a.cost&&!HS.state.cheat));
  b.querySelector('b').textContent=HS.T(a.kind==='door'?'open':a.kind);b.querySelector('small').textContent=a.cost?a.cost.toLocaleString():(HS.lang==='ja'?'長押し':'HOLD');},
});
