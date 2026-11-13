/* Heavy Stitch v2: camera modes, cockpit view, drift, sword-slash combos, super meter, combo/hype/banter, hit-stop. */
'use strict';
Object.assign(G,{
 CAMS:['fp','shoulder','third'],
 applyCam(){const b=document.querySelector('.tb[data-k="cam"] b');if(b)b.textContent={fp:'1P',shoulder:'SH',third:'3P'}[this.camMode]||'SH';
  const ck=document.getElementById('cockpit');if(ck&&this.camMode!=='fp')ck.classList.remove('on');},
 setCam(m){this.camMode=m;HS.state.opt.cam=m;HS.save();this.applyCam();if(this.on&&m==='fp')this.drawCockpit();},
 cycleCam(){const L=this.CAMS;this.setCam(L[(L.indexOf(this.camMode)+1)%L.length]);AU.play('ui');HUD.pop(HS.T({fp:'cam_fp',shoulder:'cam_sh',third:'cam_tp'}[this.camMode]),'#2bfff1');},
 // cockpit overlay: canopy struts, dash and the mech's own arms + weapons
 drawCockpit(){const P=this.P;if(!P)return;const cv=document.getElementById('ckC');const dpr=Math.min(2,devicePixelRatio||1);const W=cv.width=Math.round(cv.clientWidth*dpr)||innerWidth,H=cv.height=Math.round(cv.clientHeight*dpr)||innerHeight;
  const g=cv.getContext('2d');g.clearRect(0,0,W,H);const pt=this.paint,ink='#07080b';
  // canopy struts
  g.fillStyle=ink;g.beginPath();g.moveTo(0,0);g.lineTo(W*.16,0);g.lineTo(W*.02,H*.42);g.lineTo(0,H*.46);g.fill();g.beginPath();g.moveTo(W,0);g.lineTo(W*.84,0);g.lineTo(W*.98,H*.42);g.lineTo(W,H*.46);g.fill();
  g.strokeStyle=pt.g;g.lineWidth=2*dpr;g.globalAlpha=.8;g.beginPath();g.moveTo(W*.16,0);g.lineTo(W*.02,H*.42);g.moveTo(W*.84,0);g.lineTo(W*.98,H*.42);g.stroke();g.globalAlpha=1;
  // visor brackets
  g.strokeStyle='rgba(43,255,241,.55)';g.lineWidth=2*dpr;const b=Math.min(W,H)*.06,mx=W*.5,my=H*.47,bw=Math.min(W,H)*.22;
  for(const[sx,sy]of[[-1,-1],[1,-1],[-1,1],[1,1]]){g.beginPath();g.moveTo(mx+sx*bw,my+sy*bw-sy*b);g.lineTo(mx+sx*bw,my+sy*bw);g.lineTo(mx+sx*bw-sx*b,my+sy*bw);g.stroke();}
  // arms + weapons, drawn with the same part painters as the hangar
  const portrait=H>W;const sc=Math.min(W,H)*(portrait?.42:.5)/90;const pod=CHARS[P.cid].body==='pod';const by=portrait?H*.8:H*1.06;
  const arm=(side,s)=>{const Wp=P.W[s];g.save();g.translate(side>0?W*(portrait?.74:.64):W*(portrait?.26:.36),by);g.rotate(side>0?-1.95:-1.19);if(side<0)g.scale(1,-1);g.scale(sc,sc);
   if(!pod){plate(g,rrect(-140,-24,150,48,10),pt.p,{lw:2.4});stripes(g,rrect(-110,-20,40,40,3),HAZ);plate(g,rrect(-40,-30,40,60,8),pt.s,{lw:2});bolt(g,-20,-16,3);bolt(g,-20,16,3);cable(g,-130,22,-10,26,14,pt.g);}
   else{glow(g,0,0,40,pt.g,.6);}
   if(Wp){const w=Wp.p;if(w.cls==='blade'||w.cls==='pile')bladeShape(g,w,pt,90,false);else weaponShape(g,w,pt,90,{});}
   g.restore();};
  arm(1,'wr');arm(-1,'wl');
  // dash band
  g.fillStyle=ink;g.beginPath();g.moveTo(0,H);g.lineTo(0,H*.9);g.lineTo(W*.32,H*.94);g.lineTo(W*.68,H*.94);g.lineTo(W,H*.9);g.lineTo(W,H);g.fill();
  g.save();g.beginPath();g.moveTo(W*.32,H*.94);g.lineTo(W*.68,H*.94);g.lineTo(W*.66,H);g.lineTo(W*.34,H);g.clip();g.strokeStyle=HAZ;g.lineWidth=8*dpr;for(let x=W*.2;x<W*.8;x+=22*dpr){g.beginPath();g.moveTo(x,H);g.lineTo(x+H*.08,H*.92);g.stroke();}g.restore();},
 updMoves(dt,want,f){const P=this.P,S=P.st,I=this.in,cheat=HS.state.cheat;
  P.driftCd=Math.max(0,P.driftCd-dt);P.slashCd=Math.max(0,P.slashCd-dt);P.superT=Math.max(0,(P.superT||0)-dt);
  if(P.slashT>0){P.slashT-=dt;if(P.slashT<=0)P.slashN=0;}
  if(I.camPress){I.camPress=false;this.cycleCam();}
  if(I.driftPress){I.driftPress=false;const cost=200*S.use;
   if(P.driftCd<=0&&!P.enOut&&P.stun<=0&&(cheat||P.en>=cost*.5)){if(!cheat)P.en-=cost;P.enDelay=S.delay;
    let d;if(want.lengthSq()>.05)d=want.clone().normalize();else{const r=new V3(-f.z,0,f.x);d=r.multiplyScalar((P.driftSide=-(P.driftSide||-1)));}
    const sp=38*S.dash;P.vel.x=d.x*sp;P.vel.z=d.z*sp;P.driftT=.5;P.driftCd=.55;P.abOn=false;P.lunge=null;P.slashLunge=null;P.dashT=0;
    if(!this.lock||this.manualT>0){const ty=Math.atan2(d.x,d.z);this.camYaw+=angDiff(this.camYaw,ty)*.5;this.manualT=.5;}
    AU.play('drift');HUD.pop(HS.T('drift'),'#ff3df0');this.ringFx(P.pos.clone().setY(.2),0xff3df0,.5,4.5,.3);this.shake=Math.max(this.shake,.15);this.stats.drifts=(this.stats.drifts||0)+1;}
   else AU.play('deny');}
  if(I.slashPress){I.slashPress=false;this.doSlash();}
  if(I.superPress){I.superPress=false;if(P.sup>=100&&P.stun<=0)this.doSuper();else{AU.play('deny');HUD.pop(HS.T('super')+' '+Math.floor(P.sup)+'%','#ffd23a');}}
  if(P.slashLunge){const L=P.slashLunge;L.t-=dt;const T=L.tgt;if(T&&T.alive){const to=T.pos.clone().sub(P.pos).setY(0);if(to.length()>T.r+2.6){to.normalize();P.vel.x=to.x*50;P.vel.z=to.z*50;}else{P.vel.multiplyScalar(.2);L.t=0;}}
   if(Math.random()<.7)this.trail(P,1);if(L.t<=0){P.slashLunge=null;this.slashHit(L.n);}}},
 driftSparks(){const P=this.P;const pal=[0xffd23a,0xff3df0,0xffffff];for(let i=0;i<3;i++){const v=new V3(rnd(-4,4)-P.vel.x*.15,rnd(2,6),rnd(-4,4)-P.vel.z*.15);this.puff(P.pos.clone().add(new V3(rnd(-1,1),.3,rnd(-1,1))),v,pal[i],rnd(.6,1.1),.35,-14);}
  if(Math.random()<.3)this.puff(P.pos.clone().setY(.4),new V3(0,1,0),0x777777,2.2,.6,0);},
 doSlash(){const P=this.P;if(P.stun>0||P.slashCd>0||P.lunge||P.slashLunge||P.ap<=0)return;
  P.slashN=P.slashT>0?P.slashN%3+1:1;P.slashT=.6;P.slashCd=.17;const n=P.slashN;this.stats.slashes=(this.stats.slashes||0)+1;
  const T=this.lock;const d=T&&T.alive?T.pos.distanceTo(P.pos):1e9;
  if(T&&T.alive&&d<22&&d>T.r+3&&T.type!=='bleg'){P.slashLunge={tgt:T,t:.28,n};P.driftT=0;AU.play('dash',.6);}
  else{const fw=new V3(Math.sin(this.camYaw),0,Math.cos(this.camYaw));P.vel.addScaledVector(fw,10);this.slashHit(n);}},
 slashHit(n){const P=this.P;if(!P)return;const w=P.W.wl&&P.W.wl.p.cls==='blade'?P.W.wl.p:null;const base=(w?w.dmg:520)*P.st.melee*[1,1.15,1.6][n-1];
  const T=this.lock;const dir=T&&T.alive?T.pos.clone().sub(P.pos).setY(0).normalize():new V3(Math.sin(this.camYaw),0,Math.cos(this.camYaw));
  const col=w&&w.shape==='regalia'?0xc58cff:new THREE.Color(this.paint.g).getHex();this.slashFx(P.pos,dir,col,n===3);if(n>=2)this.slashFx(P.pos,dir,0xffffff,n===3);
  AU.play('blade');let hit=0;
  for(const e of this.E){if(!e.alive||e.retreat||(e.type==='ace'&&!e.ready))continue;const to=e.pos.clone().sub(P.pos);const ey=(e.pos.y||0)+this.aimY(e)*.5;const yd=Math.abs(ey-(P.pos.y+1.5));to.y=0;const dd=to.length();
   const reach=7+e.r+(e.type==='boss'||e.type==='bleg'?5:0);if(dd>reach||yd>6+(e.type==='bleg'||e.type==='boss'?8:0))continue;if(dd>3){to.normalize();if(to.dot(dir)<.05)continue;}
   this.dmgFoe(e,base,(w?w.shock:300)*(n===3?1.6:1),'slash');hit++;if(!e.static&&e.type!=='boss'&&e.type!=='bleg'&&e.type!=='ace'&&e.vel)e.vel.addScaledVector(dir,n===3?18:6);}
  if(hit){this.impact();this.hitStop=n===3?.1:.04;if(n===3){this.shake=Math.max(this.shake,.35);HUD.pop(HS.T('slash')+' ×3!','#ffffff');}P.vel.multiplyScalar(.3);}
  HUD.slashFlash(n);},
 doSuper(){const P=this.P;P.sup=0;P.superT=1.8;this.stats.supers=(this.stats.supers||0)+1;const name=SUPERS[P.cid]||SUPERS.pinco;
  this.cutinT=.95;AU.play('super');HUD.cutin(P.comp,name[HS.lang],P.cid,true);
  setTimeout(()=>{if(!this.on||!this.P)return;const c=P.pos.clone().setY(2);const pal=[0xff3df0,0x2bfff1,0xffd23a,0x7dff4a,0xff7a1a];
   for(let i=0;i<5;i++)setTimeout(()=>{if(!this.on||!this.scene)return;this.ringFx(c.clone().setY(.3+i*.4),pal[i],1,24+i*3,.6);this.burst(c,pal[i],30,22,2.4,.8);},i*90);
   this.shake=1;this.hitStop=.14;AU.play('boom');this.impact();
   for(const e of this.E.slice()){if(!e.alive||e.retreat)continue;const d=Math.hypot(e.pos.x-P.pos.x,e.pos.z-P.pos.z);if(d<30)this.dmgFoe(e,4000*P.st.melee,900,'super');}
   HUD.hype(HS.L(HYPE[3][1]));},700);},
 onHit(e,dmg,src){this.combo++;this.comboT=2.2;if(this.combo>this.comboBest)this.comboBest=this.combo;e.lastSrc=src;
  if(src!=='super')this.sup(src==='slash'?3:src==='melee'?2.5:.6);
  if(e.z&&typeof Z!=='undefined')Z.onHit(this,e,src);
  const h=HYPE[this.hypeI];if(h&&this.combo>=h[0]){this.hypeI++;HUD.hype(HS.L(h[1]));this.shake=Math.max(this.shake,.2);if(this.banterCd<=0)this.banter();}
  if(this.combo%10===0)AU.play('combo',Math.min(10,this.combo/10));},
 sup(n){const P=this.P;if(!P)return;P.sup=Math.min(100,P.sup+n*(HS.state.cheat?3:1));},
 updFun(dt){if(this.comboT>0){this.comboT-=dt;if(this.comboT<=0){this.combo=0;this.hypeI=0;}}this.banterCd-=dt;},
 banter(){const P=this.P;this.banterCd=14;const chief=Math.random()<.3;const pool=chief?BANTER.chief:BANTER[P.cid];if(!pool)return;const b=pool[Math.floor(Math.random()*pool.length)];HUD.comm({who:chief?'pooping':P.cid,en:b.en,ja:b.ja});},
 scrapBurst(p,e){const eye=e.eye||0x7dff4a;this.burst(p,eye,14,10,1.2,.45);this.burst(p,0x9aa0aa,12,8,.9,.8);this.burst(p,0xffd23a,6,12,.7,.3);this.ringFx(new V3(p.x,.2,p.z),eye,.4,e.r*3,.35);
  AU.play('pop',.7);if(e.type==='brute'||e.type==='exploder')this.explode(p,e.type==='brute'?8:5,0xff7a1a,true,true);},
});
Object.assign(HUD,{
 recoil(s){const el=document.getElementById('cockpit');const c=s==='wl'?'kl':'kr';el.classList.remove(c);void el.offsetWidth;el.classList.add(c);},
 slashFlash(n){const el=this.$('slashFx');el.dataset.n=n;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');},
});
