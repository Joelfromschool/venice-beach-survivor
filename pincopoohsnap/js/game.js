'use strict';
// Rail photo-safari engine: camera, input, lures, shutter and photo scoring.
const G={on:false,paused:false,speed:1/100,
 init(){const el=document.getElementById('view');this.el=el;
  this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.outputEncoding=THREE.sRGBEncoding;this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;el.appendChild(this.renderer.domElement);
  W.onSlow=fps=>{W.shadows=false;if(W.dl)W.dl.castShadow=false;this.renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));this.resize();};
  this.cam=new THREE.PerspectiveCamera(60,1,.1,600);this.pcv=document.createElement('canvas');this.pcv.width=360;this.pcv.height=270;
  window.addEventListener('resize',()=>this.resize());this.resize();this.bindInput();
  const loop=ts=>{requestAnimationFrame(loop);const now=ts/1000;const dt=Math.min(.05,now-(this.last||now));this.last=now;if(this.on&&!this.paused)this.frame(dt);};requestAnimationFrame(loop);},
 resize(){const w=window.innerWidth,h=window.innerHeight;this.W=w;this.H=h;this.renderer.setSize(w,h);this.cam.aspect=w/h;
  const fw=Math.min(w*.94,h*.78*4/3),fh=fw*.75;this.fr={x:(w-fw)/2,y:(h-fh)/2,w:fw,h:fh};
  const vf=document.getElementById('vf');if(vf){vf.style.left=this.fr.x+'px';vf.style.top=this.fr.y+'px';vf.style.width=fw+'px';vf.style.height=fh+'px';}
  if(W.halosObj)W.halosObj.material.uniforms.uScale.value=h*this.renderer.getPixelRatio()*.9;document.documentElement.style.setProperty('--frb',(h-this.fr.y-fh)+'px');document.documentElement.style.setProperty('--frt',this.fr.y+'px');this.applyFov();},
 applyFov(){const hf=(64/this.zoom)*Math.PI/180;const f=(this.fr.w/2)/Math.tan(hf/2);this.cam.fov=2*Math.atan((this.H/2)/f)*180/Math.PI;this.cam.updateProjectionMatrix();},
 zoom:1,
 setZoom(z){this.zoom=Math.max(1,Math.min(4,z));this.applyFov();const zr=document.getElementById('zoomR');if(zr&&+zr.value!==this.zoom)zr.value=this.zoom;const zt=document.getElementById('zoomT');if(zt)zt.textContent='×'+this.zoom.toFixed(1);},
 // ---------- course lifecycle ----------
 start(co){this.cleanup();this.co=co;const S=this.scene=new THREE.Scene();this.cv=W.build(co,S);this.curve=this.cv.A;this.u=0;this.speed=1/100;this.yaw=0;this.pitch=0;this.setZoom(1);
  this.branchOpen=false;this.passedFork=false;this.secretDone=false;this.film=40;this.photos=[];this.items=[];this.t=0;this.whCd=0;this.thCd=0;this.ending=false;this.tipsShown={};
  this.actors=co.spawns.map((sp,i)=>{const c=sp.path==='B'&&this.cv.B?this.cv.B:this.cv.A;const a=new Actor(sp,i,W.spawnPts[i],this);a.pathKey=sp.path||'';if(sp.path==='B')a.curveB=true;return a;});
  for(const a of this.actors)if(a.sp.path==='B'){a.grp.visible=false;a.shadow.visible=false;a.state=a.state==='hide'?'hide':a.state;a.pathHidden=true;}
  FX.clear(S);this.on=true;this.paused=false;HUD.start(co);AU.playMusic(co.reg);this.frame(0);},
 cleanup(){if(this.scene){FX.clear(this.scene);this.scene.traverse(o=>{if(o.geometry&&!Object.values(W.G).includes(o.geometry))o.geometry.dispose();});}this.scene=null;this.on=false;this.actors=[];},
 openBranch(){if(this.branchOpen||!this.cv.B)return;this.branchOpen=true;HUD.banner(HS.T('newPath'),'#7ae05a');AU.play('fanfare');
  if(W.barrier){const b=W.barrier;let k=0;const iv=setInterval(()=>{k+=.08;b.position.y-=.25;b.rotation.z+=.05;if(k>1){clearInterval(iv);b.visible=false;}},30);}
  for(const a of this.actors)if(a.sp.path==='B'){a.pathHidden=false;if(a.state!=='hide'){a.grp.visible=true;a.shadow.visible=true;}}},
 onSecret(a){this.secretDone=true;AU.play('secret');HUD.banner(HS.T('secretEv')+' '+HS.L(this.co.secret),'#ffd23a',true);if(navigator.vibrate)try{navigator.vibrate(60);}catch(e){}},
 // ---------- frame ----------
 frame(dt){this.t+=dt;const co=this.co;
  if(!this.ending){this.u+=dt*this.speed;}
  if(co.fork&&!this.passedFork&&this.u>=co.fork.t){this.passedFork=true;if(this.branchOpen){this.curve=this.cv.B;}else{for(const a of this.actors)if(a.sp.path==='B'){a.state='gone';a.grp.visible=false;a.shadow.visible=false;}}}
  if(this.passedFork&&!this.branchOpen)for(const a of this.actors)if(a.sp.path==='B'&&a.state!=='gone'){a.state='gone';a.grp.visible=false;a.shadow.visible=false;}
  if(this.passedFork&&this.branchOpen)for(const a of this.actors)if(a.sp.path==='A'&&a.state!=='gone'){a.state='gone';a.grp.visible=false;a.shadow.visible=false;}
  const u=Math.min(.999,this.u);const p=this.curve.getPointAt(u),tg=this.curve.getTangentAt(u);
  const baseYaw=Math.atan2(tg.x,tg.z);const sway=Math.sin(this.t*1.7)*.04;
  this.cam.position.set(p.x,2.3+Math.sin(this.t*3.1)*.04,p.z);const yw=baseYaw+this.yaw,pt=this.pitch+sway*.3;
  const dir=new THREE.Vector3(Math.sin(yw)*Math.cos(pt),Math.sin(pt),Math.cos(yw)*Math.cos(pt));this.cam.lookAt(this.cam.position.clone().add(dir));this.dir=dir;
  if(W.waterMesh)W.waterMesh.position.y=.05+Math.sin(this.t*1.3)*.04;
  for(const a of this.actors){if(a.state==='gone'||a.pathHidden)continue;a.update(dt,this.t);}
  this.updItems(dt);FX.update(dt,this.scene);this.whCd-=dt;this.thCd-=dt;
  HUD.update(this);
  if(this.first)this.tips();
  if(this.u>=1&&!this.ending){this.ending=true;HUD.banner(HS.T('courseEnd'),'#ff5aa0');AU.play('fanfare');setTimeout(()=>{this.on=false;HS.review(this.photos,this.co,{secret:this.secretDone,branch:this.branchOpen});},2200);}
  W.update(dt,this.t,this.cam);
  this.renderer.render(this.scene,this.cam);},
 tips(){const u=this.u,T=(k,at)=>{if(u>=at&&!this.tipsShown[k]){this.tipsShown[k]=1;HUD.tip(HS.T(k));}};T('tipAim',.005);T('tipShoot',.05);T('tipZoom',.11);T('tipApple',.17);T('tipWhistle',.25);if(HS.state.money)T('tipMoney',.33);},
 // ---------- items ----------
 throwItem(kind){if(!this.on||this.paused||this.ending||this.thCd>0)return;if(kind==='money'&&!HS.state.money)return;this.thCd=.45;AU.play('throw');
  const m=kind==='apple'?this.appleMesh():this.moneyMesh();const p=this.cam.position.clone().addScaledVector(this.dir,1).add(new THREE.Vector3(0,-.4,0));m.position.copy(p);this.scene.add(m);
  const v=this.dir.clone().multiplyScalar(17+4/this.zoom).add(new THREE.Vector3(0,4.5,0));this.items.push({m,v,kind,land:false,life:9});HUD.press(kind);},
 appleMesh(){const g=new THREE.Group();const a=new THREE.Mesh(W.geo('sph'),W.m(0xff3a3a));a.scale.setScalar(.55);g.add(a);const st=new THREE.Mesh(W.geo('cyl'),W.m(0x6a4a2a));st.scale.set(.06,.25,.06);st.position.y=.3;g.add(st);const lf=new THREE.Mesh(W.geo('sph'),W.m(0x4ac04a));lf.scale.set(.18,.06,.1);lf.position.set(.1,.36,0);g.add(lf);return g;},
 moneyMesh(){const g=new THREE.Group();const cloth=W.m(0xf1e2b4);const a=new THREE.Mesh(W.geo('sph'),cloth);a.scale.set(.66,.6,.62);g.add(a);const nk=new THREE.Mesh(W.geo('cyl'),cloth);nk.scale.set(.2,.18,.2);nk.position.y=.36;g.add(nk);const tie=new THREE.Mesh(W.geo('cyl'),W.m(0xe0a630));tie.scale.set(.24,.06,.24);tie.position.y=.34;g.add(tie);const top=new THREE.Mesh(W.geo('sph'),cloth);top.scale.set(.3,.14,.3);top.position.y=.5;g.add(top);
  if(!this._dolTex)this._dolTex=W.canvasTex(128,128,(c,w,h)=>{c.fillStyle='#f1e2b4';c.beginPath();c.arc(64,64,62,0,7);c.fill();c.font='900 100px Arial Black,Arial,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#2e8b3e';c.fillText('$',64,70);});
  const dm=new THREE.MeshBasicMaterial({map:this._dolTex,transparent:true,alphaTest:.3});for(const s of[1,-1]){const q=new THREE.Mesh(new THREE.PlaneGeometry(.62,.62),dm);q.position.z=.6*s;q.rotation.y=s>0?0:Math.PI;g.add(q);}g.userData.money=1;return g;},
 updItems(dt){for(let i=this.items.length-1;i>=0;i--){const it=this.items[i];
   if(!it.land){it.v.y-=14*dt;it.m.position.addScaledVector(it.v,dt);if(it.kind==='money'){it.m.rotation.y+=dt*9;it.m.rotation.z=Math.sin(it.m.rotation.y)*.25;if(Math.random()<dt*10)FX.spawn(this.scene,'coin',it.m.position.clone(),new THREE.Vector3(0,.4,0),.5,.22);}else it.m.rotation.x+=dt*6;
    for(const a of this.actors){if(a.state==='gone'||a.state==='hide'||!a.grp.visible)continue;const c=a.pos.clone().setY(a.y+a.ch.h*.5);if(c.distanceTo(it.m.position)<Math.max(.6,a.ch.h*.38)){a.onLure(it.kind,it.m.position.clone(),true);it.land=true;it.v.set(0,0,0);it.m.position.y=.3;it.bonked=true;break;}}
    if(!it.land&&it.m.position.y<=.3){it.m.position.y=.3;it.land=true;AU.play('thud');FX.burst(this.scene,'spark',it.m.position,4,2,.5,.3);
     for(const a of this.actors)if(a.state!=='gone'&&!a.pathHidden)a.onLure(it.kind,it.m.position.clone(),false);}}
   else{it.life-=dt;if(it.life<1)it.m.scale.setScalar(Math.max(.01,it.life));if(it.life<=0){this.scene.remove(it.m);this.items.splice(i,1);}}}},
 consume(p){for(const it of this.items){if(it.land&&it.m.position.distanceTo(p)<1.5){it.life=Math.min(it.life,.6);}}},
 whistle(){if(!this.on||this.paused||this.ending||this.whCd>0)return;this.whCd=2.2;AU.play('whistle');HUD.ring();HUD.press('whistle');
  for(const a of this.actors){if(a.state==='gone'||a.pathHidden)continue;if(a.pos.distanceTo(this.cam.position)<32)a.onWhistle();}},
 // ---------- shutter ----------
 shoot(){if(!this.on||this.paused||this.ending)return;if(this.film<=0){HUD.flashMsg(HS.T('noFilm'));AU.play('film');return;}
  this.film--;AU.play('shutter');this.renderer.render(this.scene,this.cam);const fr=this.fr,pr=this.renderer.getPixelRatio();const g=this.pcv.getContext('2d');
  try{g.drawImage(this.renderer.domElement,fr.x*pr,fr.y*pr,fr.w*pr,fr.h*pr,0,0,360,270);}catch(e){}
  const img=this.pcv.toDataURL('image/jpeg',.8);const meta=this.analyze();meta.img=img;meta.course=this.co.id;meta.reg=this.co.reg;meta.id=this.photos.length;this.photos.push(meta);HUD.snap(img);},
 analyze(){const subs=[];const cam=this.cam;cam.updateMatrixWorld();const ray=new THREE.Raycaster();
  for(const a of this.actors){if(a.state==='gone'||a.pathHidden||!a.grp.visible)continue;a.grp.updateMatrixWorld(true);
   const pts=[[-.5,0],[.5,0],[-.5,1],[.5,1],[0,.5]].map(([x,y])=>new THREE.Vector3(x,y,0).applyMatrix4(a.mesh.matrixWorld));
   let behind=false;const uv=pts.map(p=>{const v=p.clone().project(cam);if(v.z>1||v.z<-1)behind=true;const sx=(v.x+1)/2*this.W,sy=(1-v.y)/2*this.H;return[(sx-this.fr.x)/this.fr.w,(sy-this.fr.y)/this.fr.h];});
   if(behind)continue;const xs=uv.slice(0,4).map(q=>q[0]),ys=uv.slice(0,4).map(q=>q[1]);const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
   const cx0=Math.max(0,x0),cx1=Math.min(1,x1),cy0=Math.max(0,y0),cy1=Math.min(1,y1);if(cx1<=cx0||cy1<=cy0)continue;
   const full=(x1-x0)*(y1-y0),vis=(cx1-cx0)*(cy1-cy0);if(vis<.003)continue;
   // occlusion (center ray)
   const ctr=pts[4];const d=ctr.distanceTo(cam.position);ray.set(cam.position,ctr.clone().sub(cam.position).normalize());ray.far=d-1;let hidden=false;if(W.occ.length){const hit=ray.intersectObjects(W.occ,true);if(hit.length)hidden=true;}
   const mx=(cx0+cx1)/2,my=(cy0+cy1)/2;const center=Math.abs(mx-.5)<.14&&Math.abs(my-.5)<.16;
   const tags=[...a.tags];if(a.state==='sleep')tags.push('sleep');
   subs.push({c:a.c,pose:a.pose,frac:vis,size:Math.round(Math.min(1000,vis/.28*1000)),center,crop:vis<full*.78,hidden,tags,dist:d});}
  const score=s=>s.size+this.posePts(s);subs.sort((a,b)=>score(b)-score(a));
  const main=subs[0]||null;const count=subs.filter(s=>s.frac>=.01).length;const tags=[...new Set(subs.flatMap(s=>s.tags))];
  return{subs,main,count,tags};},
 posePts(s){let p=[200,500,900][s.pose]||200;const t=s.tags;if(t.includes('sleep'))p+=100;if(t.includes('eat'))p+=300;if(t.includes('bonk'))p+=400;if(t.includes('woke'))p+=300;if(t.includes('surprise'))p+=500;if(t.includes('dance'))p+=300;if(t.includes('money'))p+=300;return p;},
 // evaluation breakdown used by the review screen
 evalPhoto(m){if(!m.main)return{total:0,none:true};const s=m.main;const size=s.size,pose=this.posePts(s);let mult=1;const notes=[];if(s.center){mult*=2;notes.push('centered');}if(s.crop){mult*=.6;notes.push('cropped');}if(s.hidden){mult*=.5;notes.push('hidden');}
  const friends=Math.max(0,m.count-1)*400;const special=s.tags.includes('secret')?2500:0;const total=Math.round(((size+pose)*mult+friends+special)/10)*10;return{size,pose,mult,notes,friends,special,total};},
 // ---------- input ----------
 bindInput(){const el=this.el;const pts=new Map();let pinch0=0,zoom0=1;
  el.addEventListener('pointerdown',e=>{if(!this.on)return;el.setPointerCapture&&el.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2){const a=[...pts.values()];pinch0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);zoom0=this.zoom;}AU.unlock();});
  el.addEventListener('pointermove',e=>{if(!this.on||!pts.has(e.pointerId))return;const pr=pts.get(e.pointerId);const dx=e.clientX-pr.x,dy=e.clientY-pr.y;pr.x=e.clientX;pr.y=e.clientY;
   if(pts.size>=2){const a=[...pts.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch0>0)this.setZoom(zoom0*d/pinch0);return;}
   if(this.paused)return;const k=(HS.state.opt.sens||1)*.0042/this.zoom;this.yaw=Math.max(-1.9,Math.min(1.9,this.yaw-dx*k));this.pitch=Math.max(-.55,Math.min(.6,this.pitch-dy*k));});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch0=0;};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  // silent dev keys (not shown anywhere)
  window.addEventListener('keydown',e=>{if(!this.on)return;const k=e.key.toLowerCase();if(k===' ')this.shoot();if(k==='a')this.throwItem('apple');if(k==='m')this.throwItem('money');if(k==='w')this.whistle();if(k==='arrowleft')this.yaw+=.1;if(k==='arrowright')this.yaw-=.1;if(k==='arrowup')this.pitch+=.05;if(k==='arrowdown')this.pitch-=.05;});},
 // aim helper for tests: point camera at actor
 aimAt(a){const p=this.cam.position;const d=a.pos.clone().add(new THREE.Vector3(0,a.y+a.ch.h*.5,0)).sub(p);const u=Math.min(.999,this.u);const tg=this.curve.getTangentAt(u);const base=Math.atan2(tg.x,tg.z);let y=Math.atan2(d.x,d.z)-base;while(y>Math.PI)y-=Math.PI*2;while(y<-Math.PI)y+=Math.PI*2;this.yaw=Math.max(-1.9,Math.min(1.9,y));this.pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));},
};
