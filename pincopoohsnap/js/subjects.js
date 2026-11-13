'use strict';
// Cut-out actors (billboards) with behaviors and reactions, plus a tiny particle system.
const FX={list:[],tex:{},
 t(k){if(this.tex[k])return this.tex[k];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.textAlign='center';g.textBaseline='middle';
  const glyph={z:['Z','#6a8aff'],note:['♪','#ff4ab0'],heart:['♥','#ff4a7a'],star:['★','#ffd23a'],spark:['✦','#ffffff'],crumb:['●','#c8945a'],petal:['❀','#ffb7d5'],steam:['~','#ffffff'],cool:['✧','#4af0ff'],drop:['●','#ffb21a']}[k];
  if(k==='cash'){g.save();g.translate(32,32);g.fillStyle='#fff';g.fillRect(-29,-17,58,34);g.fillStyle='#5cbf5a';g.fillRect(-26,-14,52,28);g.strokeStyle='#2e7d32';g.lineWidth=3;g.strokeRect(-22,-10,44,20);g.fillStyle='#eaffea';g.beginPath();g.arc(0,0,9,0,7);g.fill();g.fillStyle='#2e7d32';g.font='900 16px Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('$',0,1);g.restore();}
  else if(k==='coin'){g.fillStyle='#fff';g.beginPath();g.arc(32,32,26,0,7);g.fill();g.fillStyle='#ffc93a';g.beginPath();g.arc(32,32,22,0,7);g.fill();g.strokeStyle='#d99a10';g.lineWidth=3;g.beginPath();g.arc(32,32,16,0,7);g.stroke();g.fillStyle='#b8760a';g.font='900 24px Arial,sans-serif';g.fillText('$',32,34);}
  if(glyph){g.font='bold 50px sans-serif';g.lineWidth=6;g.strokeStyle='#ffffff';if(k!=='spark'&&k!=='steam')g.strokeText(glyph[0],32,34);g.fillStyle=glyph[1];g.fillText(glyph[0],32,34);}
  else if(k==='shadow'){const gr=g.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(0,0,0,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);}
  else if(k==='conf'){g.fillStyle='#fff';g.fillRect(16,24,32,16);}
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return this.tex[k]=t;},
 spawn(S,k,pos,vel,life,size,col){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:this.t(k),transparent:true,depthWrite:false,color:col||0xffffff}));m.position.copy(pos);m.scale.setScalar(size||.5);S.add(m);this.list.push({m,v:vel||new THREE.Vector3(),life,max:life,g:k==='conf'||k==='crumb'||k==='drop'||k==='coin'?-6:k==='cash'?-2.2:0,spin:k==='conf'||k==='cash'});},
 burst(S,k,pos,n,spd,life,size,cols){for(let i=0;i<n;i++){const v=new THREE.Vector3((Math.random()-.5)*spd,Math.random()*spd*.8+spd*.3,(Math.random()-.5)*spd);this.spawn(S,k,pos,v,life*(.6+Math.random()*.6),size,cols?cols[i%cols.length]:null);}},
 update(dt,S){for(let i=this.list.length-1;i>=0;i--){const p=this.list[i];p.life-=dt;if(p.life<=0){S.remove(p.m);p.m.material.dispose();this.list.splice(i,1);continue;}p.v.y+=p.g*dt;p.m.position.addScaledVector(p.v,dt);p.m.material.opacity=Math.min(1,p.life/p.max*2);if(p.spin)p.m.material.rotation+=dt*8;}},
 clear(S){for(const p of this.list){S.remove(p.m);p.m.material.dispose();}this.list=[];},
};
const CONF=[0xff4a8a,0x4ad8ff,0xffd23a,0x7ae05a,0xb07aff];
class Actor{
 constructor(sp,idx,pos,game){this.sp=sp;this.idx=idx;this.c=sp.c;this.ch=CHARS[sp.c];this.home=pos.clone();this.pos=pos.clone();this.G=game;this.S=game.scene;
  this.b=sp.b;this.state=sp.b==='sleep'?'sleep':sp.b==='hide'?'hide':'idle';this.pose=0;this.timer=1+Math.random()*3;this.look=0;this.tags=new Set();this.dir=1;this.y=0;this.rz=0;this.act=0;this.awake=false;this.hop=0;
  this.mats=[0,1,2].map(i=>{const n=(i===0&&this.ch.noIdle0)?1:i;const t=W.loadTex('art/c_'+this.c+'_'+n+'.webp?v='+(window.__BUILD__||''));return new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.08,side:THREE.DoubleSide,fog:true});});
  this.geo=new THREE.PlaneGeometry(1,1);this.geo.translate(0,.5,0);this.mesh=new THREE.Mesh(this.geo,this.mats[0]);this.grp=new THREE.Group();this.grp.add(this.mesh);this.S.add(this.grp);
  this.shadow=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:FX.t('shadow'),transparent:true,depthWrite:false}));this.shadow.rotation.x=-Math.PI/2;this.S.add(this.shadow);
  this.wanderA=this.home.clone();const t0=game.curve.getTangentAt(Math.min(.99,sp.t));this.tan=new THREE.Vector3(t0.x,0,t0.z).normalize();
  if(this.state==='hide'){this.grp.visible=false;this.shadow.visible=false;}
  this.target=null;this.specialT=0;this.secretT=0;}
 setPose(p){if(this.pose===p)return;this.pose=p;this.mesh.material=this.mats[p];}
 hasTag(t){return this.tags.has(t);}
 tag(t,dur){this.tags.add(t);if(dur)setTimeout(()=>this.tags.delete(t),dur*1000);}
 near(p,r){return this.pos.distanceTo(p)<r;}
 // ----- reactions -----
 onWhistle(){if(this.state==='gone')return;const G=this.G;
  if(this.sp.secret&&G.co.secret.item==='whistle'&&!G.secretDone)return this.doSecret();
  if(this.sp.branch&&!G.branchOpen)return this.doBranch();
  if(this.state==='sleep')return this.wake();
  if(this.state==='hide'&&this.near(G.cam.position,22))return this.reveal();
  if(this.state==='idle'||this.state==='wander'||this.state==='special'){this.state='look';this.timer=2.6;this.setPose(1);this.hop=.5;AU.play('boing');FX.burst(this.S,'heart',this.headPos(),3,2,1,.45);this.tag('look',2.6);}}
 onLure(item,p,hit){const G=this.G;if(this.state==='gone')return;
  if(hit&&item==='money'&&this.c==='pooh'){if(this.sp.secret&&G.co.secret.item==='money'&&!G.secretDone)return this.doSecret(p);this.target=p.clone();this.goal='money';this.state='goto';return;}
  if(hit){this.state='bonk';this.timer=2;this.setPose(1);this.tag('bonk',2.4);AU.play('bonk');FX.burst(this.S,'star',this.headPos(),6,3,1.2,.4);if(this.sp.secret&&G.co.secret.item==='apple'&&!G.secretDone&&item==='apple')setTimeout(()=>this.doSecret(),900);if(this.sp.branch&&!G.branchOpen)setTimeout(()=>this.doBranch(),900);return;}
  const d=this.pos.distanceTo(p);
  if(item==='money'){if(this.c==='pooh'&&d<32){if(this.sp.secret&&G.co.secret.item==='money'&&!G.secretDone)return this.doSecret(p);this.wakeIfSleep();this.grp.visible=true;this.shadow.visible=true;this.rz=0;this.target=p.clone();this.goal='money';this.state='goto';this.hop=.6;AU.play('boing');FX.burst(this.S,'heart',this.headPos(),4,2.5,1,.45);return;}
   if(d<9){this.wakeIfSleep();this.state='look';this.timer=2;this.setPose(1);this.hop=.4;}return;}
  if(item==='apple'){if(this.state==='hide'&&this.sp._propPos&&this.sp._propPos.distanceTo(p)<6)return this.reveal();
   if(d<10){if(this.sp.secret&&G.co.secret.item==='apple'&&!G.secretDone)return this.doSecret(p);if(this.sp.branch&&!G.branchOpen)return this.doBranch();
    this.wakeIfSleep();this.state='goto';this.target=p.clone();this.goal='apple';}}}
 wakeIfSleep(){if(this.state==='sleep'){this.rz=0;this.tag('woke',5);}}
 wake(){this.state='look';this.timer=3;this.rz=0;this.setPose(1);this.hop=.8;this.tag('woke',5);AU.play('pop');FX.burst(this.S,'spark',this.headPos(),6,3,.8,.4);}
 reveal(){this.state='look';this.timer=3;this.grp.visible=true;this.shadow.visible=true;this.setPose(1);this.hop=1;this.tag('surprise',4);AU.play('pop');FX.burst(this.S,'spark',this.headPos(),10,4,1,.5);if(this.c==='party')FX.burst(this.S,'conf',this.headPos(),24,6,1.6,.25,CONF);
  if(this.sp.secret&&this.G.co.secret.item==='apple'&&!this.G.secretDone)this.doSecret();
  if(this.sp.branch&&!this.G.branchOpen)this.doBranch();}
 doBranch(){const G=this.G;if(G.branchOpen||G.passedFork)return;this.grp.visible=true;this.shadow.visible=true;this.rz=0;this.state='run';this.timer=3;this.setPose(1);this.tag('woke',5);G.openBranch();
  const away=this.pos.clone().sub(G.cam.position).setY(0).normalize();this.target=this.pos.clone().addScaledVector(away,12);}
 doSecret(p){const G=this.G;if(G.secretDone)return;this.grp.visible=true;this.shadow.visible=true;this.rz=0;this.state='secret';this.secretT=0;this.timer=7;this.setPose(2);this.tag('secret',8);G.onSecret(this);this.secretBase=this.pos.clone();}
 headPos(){return this.pos.clone().add(new THREE.Vector3(0,this.ch.h*1.05+this.y,0));}
 // ----- update -----
 update(dt,t){const G=this.G,cam=G.cam.position;this.timer-=dt;const ch=this.ch;let bobY=0,sq=1;
  const dist=this.pos.distanceTo(cam);if(dist>120&&this.state!=='secret'){this.grp.visible=this.grp.visible&&true;}
  switch(this.state){
   case'idle':this.setPose(0);sq=1+Math.sin(t*2.4+this.idx)*.02;if(this.timer<=0){if(this.b==='special'){this.state='special';this.timer=3.6;this.specialT=0;}else if(this.b==='wander'){this.state='wander';this.timer=4+Math.random()*3;this.wdir=Math.random()<.5?-1:1;}else{this.state='look';this.timer=1.4;this.setPose(1);this.hop=.25;}}break;
   case'wander':{this.setPose(0);const v=this.tan.clone().multiplyScalar(this.wdir*1.4*dt);this.pos.add(v);if(this.pos.distanceTo(this.home)>5)this.wdir*=-1;bobY=Math.abs(Math.sin(t*9))*.18;this.walkDir(v);if(this.timer<=0){this.state='idle';this.timer=2+Math.random()*2;}}break;
   case'look':this.setPose(1);sq=1+Math.sin(t*6)*.03;if(this.timer<=0){this.state='idle';this.timer=2+Math.random()*3;}break;
   case'sleep':this.setPose(0);this.rz=1.3*(this.idx%2?1:-1);if(Math.random()<dt*.8)FX.spawn(this.S,'z',this.pos.clone().add(new THREE.Vector3(0,ch.h*.55,0)),new THREE.Vector3(.3,.8,0),2.2,.5);sq=1+Math.sin(t*1.6)*.04;if(dist<30&&Math.random()<dt*.15)AU.play('zzz');break;
   case'hide':break;
   case'bonk':this.setPose(1);this.rz=Math.sin(t*14)*.18;if(this.timer<=0){this.rz=0;this.state='look';this.timer=1.5;}break;
   case'goto':case'run':{const tg=this.target;const v=tg.clone().sub(this.pos).setY(0);const d=v.length();const zoomy=this.goal==='money'&&this.state==='goto';if(zoomy&&Math.random()<dt*14)FX.spawn(this.S,'coin',this.pos.clone().add(new THREE.Vector3(0,this.ch.h*.4+this.y,0)),new THREE.Vector3((Math.random()-.5),.6,(Math.random()-.5)),.6,.28);if(d>(this.state==='run'?.5:1.1)){v.normalize().multiplyScalar((this.state==='run'?6:zoomy?9.5:3.2)*dt);this.pos.add(v);this.walkDir(v);bobY=Math.abs(Math.sin(t*12))*.25;this.setPose(this.state==='run'?1:0);}
     else if(this.state==='run'){this.state='idle';this.timer=3;this.home=this.pos.clone();}
     else{this.state='eat';this.timer=this.goal==='money'?6:3.5;this.home=this.pos.clone();if(G.consume)G.consume(tg);if(this.goal==='money'){AU.play('cash');AU.play('yay');this.hop=1;FX.burst(this.S,'cash',this.headPos(),14,5,1.8,.55);FX.burst(this.S,'coin',this.headPos(),8,4,1.2,.32);}else AU.play('nom');}
     if(this.timer<-12){this.state='idle';this.timer=2;}}break;
   case'eat':if(this.goal==='money'){this.setPose(2);this.tag('money',.5);sq=1+Math.abs(Math.sin(t*7))*.05;this.rz=Math.sin(t*5)*.06;if(Math.random()<dt*7)FX.spawn(this.S,'cash',this.headPos().add(new THREE.Vector3(0,-.3,0)),new THREE.Vector3((Math.random()-.5)*3,2.6+Math.random()*1.5,(Math.random()-.5)*3),1.6,.5);if(Math.random()<dt*2.5)FX.spawn(this.S,'heart',this.headPos(),new THREE.Vector3((Math.random()-.5),1,0),1.4,.4);if(Math.random()<dt*1.2)AU.play('cash');if(this.timer<=0)this.rz=0;}
     else{this.setPose(this.c==='mogu'?2:ch.eat?0:1);this.tag('eat',.5);sq=1+Math.abs(Math.sin(t*10))*.05;if(Math.random()<dt*4)FX.spawn(this.S,'crumb',this.headPos().add(new THREE.Vector3(0,-.4,0)),new THREE.Vector3((Math.random()-.5)*2,1.5,(Math.random()-.5)*2),.8,.18);}
     if(this.timer<=0){this.state='look';this.timer=2;}break;
   case'special':this.specialT+=dt;this.setPose(2);this.tag('special',.3);this.fxSpecial(dt,t);bobY=this._by||0;sq=this._sq||1;if(this.timer<=0){this.state='idle';this.timer=2.5+Math.random()*2;this.rz=0;this._by=0;this._sq=1;}break;
   case'secret':{this.secretT+=dt;this.setPose(2);this.tag('secret',.4);this.fxSecret(dt,t);bobY=this._by||0;if(this.timer<=0){this.state='special';this.timer=3;this.rz=0;this._by=0;}}break;
  }
  if(this.hop>0){this.hop-=dt*2.2;bobY+=Math.max(0,Math.sin((1-this.hop)*Math.PI*1.5))*.6;}
  if(ch.float)bobY+=.25+Math.sin(t*2+this.idx)*.12;
  this.y=bobY;
  // size + billboard
  const h=ch.h*(this.state==='sleep'?.9:1);const im=this.mats[this.pose].map.image;const a=im&&im.width?im.width/im.height:.6;this.mesh.scale.set(h*a*this.dir,h*sq,1);
  this.grp.position.set(this.pos.x,bobY,this.pos.z);this.grp.rotation.y=Math.atan2(cam.x-this.pos.x,cam.z-this.pos.z);this.mesh.rotation.z=this.rz;
  if(this.state==='sleep')this.mesh.position.set(this.rz>0?h*.45:-h*.45,0,0);else this.mesh.position.set(0,0,0);
  this.shadow.position.set(this.pos.x,.05,this.pos.z);const sw=Math.max(.8,h*a*1.1)*(1-Math.min(.5,bobY*.15));this.shadow.scale.set(sw,sw*.55,1);}
 walkDir(v){const cam=this.G.cam;const right=new THREE.Vector3().subVectors(this.pos,cam.position);right.set(right.z,0,-right.x);const d=v.dot(right);if(Math.abs(d)>1e-4)this.dir=d>0?-1:1;}
 fxSpecial(dt,t){const S=this.S,k=this.specialT;this._by=0;this._sq=1;this.rz=0;
  switch(this.c){
   case'pinco':{const v=this.tan.clone().multiplyScalar(Math.sin(k*1.2)*2.6*dt);this.pos.add(v);this.walkDir(v);this.rz=Math.sin(k*2.4)*.08;if(Math.random()<dt*6)FX.spawn(S,'spark',this.pos.clone().add(new THREE.Vector3(0,.2,0)),new THREE.Vector3(0,.5,0),.5,.25);break;}
   case'bean':this._by=Math.abs(Math.sin(k*3))*2.2;this._sq=1+(Math.abs(Math.sin(k*3))<.15?-.15:.05);if(Math.abs(Math.sin(k*3))<.06&&Math.random()<.5)AU.play('boing');break;
   case'bronny':this._by=Math.max(0,Math.sin(k*1.8))*1.6;break;
   case'party':if(Math.random()<dt*2.5){FX.burst(S,'conf',this.headPos(),8,5,1.4,.2,CONF);if(this.near(this.G.cam.position,40))AU.play('horn');}this.rz=Math.sin(k*5)*.08;break;
   case'dkermit':if(Math.random()<dt*3)FX.spawn(S,'note',this.headPos(),new THREE.Vector3((Math.random()-.5)*.8,1.2,0),1.6,.5);this.rz=Math.sin(k*3)*.05;break;
   case'max':this._by=Math.max(0,Math.sin(k*2.2))*1.3;{const v=this.tan.clone().multiplyScalar(Math.cos(k*2.2)*2*dt);this.pos.add(v);this.walkDir(v);}break;
   case'asmon':if(Math.random()<dt*4)FX.spawn(S,'steam',this.headPos().add(new THREE.Vector3(.2,-.5,0)),new THREE.Vector3(0,.8,0),1.2,.4);break;
   case'pooh':if(Math.random()<dt*2)FX.spawn(S,'heart',this.headPos(),new THREE.Vector3((Math.random()-.5),1,0),1.4,.4);break;
   case'mogu':if(Math.random()<dt*3)FX.spawn(S,'cool',this.headPos(),new THREE.Vector3((Math.random()-.5),.8,0),1,.4);this._sq=1+Math.abs(Math.sin(k*8))*.04;break;
   case'pooping':this.rz=Math.sin(k*6)*.18;this._by=Math.abs(Math.sin(k*6))*.3;break;
  }}
 fxSecret(dt,t){const S=this.S,k=this.secretT;this._by=0;
  switch(this.c){
   case'pinco':this._by=Math.sin(Math.min(1,k/3)*Math.PI)*5+Math.max(0,Math.sin(k*2))*.5;this.rz=k<3?Math.sin(k*Math.PI*2/3*2)*.6:0;if(Math.random()<dt*14)FX.spawn(S,'spark',this.headPos(),new THREE.Vector3((Math.random()-.5)*2,-.5,(Math.random()-.5)*2),.8,.35);break;
   case'pooh':this._by=Math.min(4,k*1.2)+Math.sin(k*2)*.2;if(Math.random()<dt*16)FX.spawn(S,'cash',this.headPos().add(new THREE.Vector3((Math.random()-.5)*7,3.5+Math.random()*2,(Math.random()-.5)*7)),new THREE.Vector3(.3,-1.2,0),2.6,.55);if(Math.random()<dt*6)FX.spawn(S,this.G.co.id==='tokyo'?'petal':'coin',this.headPos().add(new THREE.Vector3((Math.random()-.5)*4,2.5,(Math.random()-.5)*4)),new THREE.Vector3(.4,-.6,0),2,.4);if(Math.random()<dt*1.5)AU.play('cash');break;
   case'party':if(Math.random()<dt*6)FX.burst(S,'conf',this.headPos(),10,7,1.6,.22,CONF);this.rz=Math.sin(k*6)*.1;break;
   case'dkermit':case'pooping':if(Math.random()<dt*5)FX.spawn(S,this.c==='dkermit'?'note':'star',this.headPos(),new THREE.Vector3((Math.random()-.5),1.2,0),1.6,.5);this.rz=Math.sin(k*(this.c==='pooping'?6:3))*.12;
     for(const a of this.G.actors)if(a!==this&&a.state!=='hide'&&a.state!=='gone'&&a.pos.distanceTo(this.pos)<26&&a.state!=='secret'){a.state='look';a.timer=2;a.setPose(1);if(Math.random()<dt*2)a.hop=.6;a.rz=0;a.tag('dance',2);}break;
   case'bronny':this._by=Math.max(0,Math.sin(k*2.4))*2.6;if(Math.random()<dt*6)FX.spawn(S,'star',this.headPos(),new THREE.Vector3((Math.random()-.5)*2,1,0),.8,.4);break;
   case'mogu':if(Math.random()<dt*8)FX.spawn(S,'cool',this.headPos().add(new THREE.Vector3((Math.random()-.5)*1.5,0,0)),new THREE.Vector3(0,1,0),1,.45);this._by=Math.abs(Math.sin(k*4))*.3;break;
   case'max':this._by=Math.max(0,Math.sin(k*1.6))*3;{const v=this.tan.clone().multiplyScalar(Math.cos(k*1.6)*4*dt);this.pos.add(v);this.walkDir(v);}if(Math.random()<dt*6)FX.spawn(S,'spark',this.headPos(),new THREE.Vector3(0,.5,0),.6,.3);break;
   case'bean':this._by=Math.abs(Math.sin(k*2.5))*3;{const v=this.tan.clone().multiplyScalar(Math.cos(k*1.25)*3*dt);this.pos.add(v);}if(Math.abs(Math.sin(k*2.5))<.05)FX.burst(S,'spark',this.pos.clone(),4,3,.6,.3);break;
  }}
 dispose(){this.S.remove(this.grp);this.S.remove(this.shadow);}
}
