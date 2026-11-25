// Catch screen: flick a honey jar at the pal. Pseudo-3D physics, shrinking ring bonus, curveballs, shakes.
import {SP,ITEMS} from './data.js?v=1.0.0';
import {S} from './state.js?v=1.0.0';
import {AU} from './audio.js?v=1.0.0';
let cv,g,W,H,DPR,st=null,raf=0,img=null,bgImg=null,video=null;
const F=()=>.30*H,HH=()=>.485*H,ZC=6;
const proj=(x,y,z)=>[W/2+x*F()/z,HH()-(y-1.5)*F()/z];
const imgs={};function loadImg(src){if(!imgs[src]){const i=new Image();i.src=src;imgs[src]=i}return imgs[src]}
export function jarImg(type){return loadImg('art/'+type+'.png?v='+window.__V)}
export function startEncounter(opts){// opts:{spawn,lv,iv,shiny,bonus:{jars}, bg, T, onEnd, toast}
 cv=document.getElementById('enc');g=cv.getContext('2d');resize();
 const sp=SP[opts.sp];img=loadImg(window.__art(opts.sp,opts.shiny,opts.hat));bgImg=loadImg('bg/'+opts.bg+'.webp?v='+window.__V);
 const types=['jar','gjar','rjar'];
 st={o:opts,sp,t:0,phase:'aim',jarType:opts.bonus?'vjar':(types.find(k=>S.items[k]>0)||'jar'),ball:null,hold:null,ring:0,hop:0,hopT:2+Math.random()*3,msg:[],parts:[],
  drop:false,bun:false,used:0,throws:0,first:true,shakes:0,shakeT:0,vjars:opts.bonus?opts.bonus.jars:0,result:null,fade:0,stars:[],ar:!!S.arDef,hint:0};
 cv.classList.add('on');document.getElementById('encUI').classList.add('on');
 if(st.ar)startAR();updUI();cancelAnimationFrame(raf);let last=performance.now();
 const loop=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;step(dt);draw();if(st)raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
 AU.song('enc');AU.play('appear');
}
export function resize(){if(!cv)return;DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR}
function ringCol(){const c=st.sp.cr*(st.bun?1.3:1);return c>=.4?'#4ee36a':c>=.25?'#ffe14a':c>=.12?'#ff9a2e':'#ff4a4a'}
function creature(){const h=Math.min(H*.27,W*.62)*(st.sp.sz||1);const ar=img.width?img.width/img.height:.7;const fx=W/2,fy=H*.56-st.hop*h*.35;return {x:fx-h*ar/2,y:fy-h,w:h*ar,h,cx:fx,cy:fy-h*.5,R:Math.max(h*.42,48)}}
export function endEncounter(){if(!st)return;cancelAnimationFrame(raf);stopAR();cv.classList.remove('on');document.getElementById('encUI').classList.remove('on');st=null}
function startAR(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){st.ar=false;st.o.toast(st.o.T('arBlocked'));updUI();return}
 video=document.getElementById('arVid');navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false}).then(s=>{if(!st||!st.ar){s.getTracks().forEach(t=>t.stop());return}video.srcObject=s;video.play().catch(()=>{});video.classList.add('on')})
 .catch(()=>{if(st){st.ar=false;st.o.toast(st.o.T('arBlocked'));updUI()}})}
function stopAR(){if(video){video.classList.remove('on');const s=video.srcObject;if(s)s.getTracks().forEach(t=>t.stop());video.srcObject=null}}
export function toggleAR(){if(!st)return;st.ar=!st.ar;if(st.ar)startAR();else stopAR();updUI()}
export function cycleJar(){if(!st||st.o.bonus)return;const types=['jar','gjar','rjar'].filter(k=>S.items[k]>0||S.cheat);if(!types.length)return;const i=types.indexOf(st.jarType);st.jarType=types[(i+1)%types.length];AU.play('tap');updUI()}
export function useBerry(k){if(!st||st.phase!=='aim'||st.ball)return;if(st[k==='drop'?'drop':'bun'])return;if(!(S.items[k]>0)&&!S.cheat)return;if(!S.cheat)S.items[k]--;st[k==='drop'?'drop':'bun']=true;AU.play('item');
 const c=creature();for(let i=0;i<14;i++)st.parts.push({x:c.cx,y:c.cy,vx:(Math.random()-.5)*300,vy:-Math.random()*300,l:1,c:k==='drop'?'#ffb52e':'#ff9ec7',r:6});updUI()}
export function run(){if(!st||st.phase==='shake'||st.phase==='suck')return;AU.play('back');finish({ran:true})}
function jarsLeft(){if(st.o.bonus)return st.vjars;return S.cheat?999:(S.items[st.jarType]||0)}
function updUI(){if(!st)return;const u=document.getElementById('encUI');
 u.querySelector('#eName').textContent=st.o.T&&st.o.name;u.querySelector('#eCp').textContent='CP '+st.o.cp;
 u.querySelector('#eJarN').textContent='×'+(S.cheat&&!st.o.bonus?'∞':jarsLeft());u.querySelector('#eJarI').src=jarImg(st.jarType).src;
 u.querySelector('#eAR').classList.toggle('act',st.ar);u.querySelector('#eDrop').classList.toggle('act',st.drop||st.bun);
 u.querySelector('#eBerryN').textContent=(S.items.drop||0)+(S.items.bun||0)>0||S.cheat?'':'0';
 u.querySelector('#eShiny').style.display=st.o.shiny?'':'none'}
// --- touch ---
export function onDown(x,y){if(!st||st.phase!=='aim'||st.ball)return false;const jx=W/2,jy=H*.86;if(Math.hypot(x-jx,y-jy)>Math.max(80,W*.2))return false;
 if(jarsLeft()<=0){st.o.toast(st.o.T('noJars'));return true}
 st.hold={x,y,pts:[[x,y,performance.now()]],ang:null,spin:0,curve:false,dir:0};st.hint=1;return true}
export function onMove(x,y){const h=st&&st.hold;if(!h)return;const now=performance.now();h.pts.push([x,y,now]);if(h.pts.length>12)h.pts.shift();h.x=x;h.y=y;
 // spin detection: angle around the jar's rest point
 const jx=W/2,jy=H*.86,dx=x-jx,dy=y-jy;if(Math.hypot(dx,dy)>14&&y>H*.62){const a=Math.atan2(dy,dx);if(h.ang!=null){let d=a-h.ang;if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;h.spin+=d}h.ang=a;
  if(Math.abs(h.spin)>Math.PI*2.2&&!h.curve){h.curve=true;h.dir=Math.sign(h.spin);AU.play('star')}}}
export function onUp(x,y){const h=st&&st.hold;if(!h)return;st.hold=null;const now=performance.now();const pts=h.pts.filter(p=>now-p[2]<90);const a=pts[0]||h.pts[0];const dt=Math.max(.016,(now-a[2])/1000);
 const vx=(x-a[0])/dt,vy=(y-a[1])/dt;if(vy>-H*.5||y>H*.8&&vy>-H*1.2){return}// not a throw
 const k=1/H;const sx=x,sy=y;// release position -> world
 const z0=.6,y0=1.5+(HH()-sy)*z0/F(),x0=(sx-W/2)*z0/F();
 const pw=Math.min(5,-vy*k);st.ball={x:x0,y:y0,z:z0,vx:vx*k*6,vy:2.6+1.8*pw,vz:4+4*pw,curve:h.curve?h.dir:0,rot:0,t:0,type:st.jarType,state:'fly'};
 if(st.o.bonus)st.vjars--;else if(!S.cheat)S.items[st.jarType]--;st.throws++;AU.play('throw');updUI()}
// --- sim ---
function step(dt){st.t+=dt;st.ring=(st.t%2.2)/2.2;
 // hop/attack
 st.hopT-=dt;if(st.hopT<0&&st.phase==='aim'){st.hopping=.7;st.hopT=(st.bun?7:3)+Math.random()*(st.bun?6:4)}
 if(st.hopping>0){st.hopping-=dt;st.hop=Math.sin((1-st.hopping/.7)*Math.PI)}else st.hop=0;
 const b=st.ball;
 if(b&&b.state==='fly'){b.t+=dt;b.vy-=9.8*dt;if(b.curve)b.vx+=b.curve*7.5*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;const pz=b.z;b.z+=b.vz*dt;b.rot+=dt*(b.curve?22:9);
  if(pz<ZC&&b.z>=ZC){const [sx,sy]=proj(b.x,b.y,ZC);const c=creature();const d=Math.hypot(sx-c.cx,sy-c.cy);const inBody=sx>c.x+c.w*.12&&sx<c.x+c.w*.88&&sy>c.y+c.h*.08&&sy<c.y+c.h;
   if(d<c.R||inBody){hit(d,c);return}}
  if(b.y<-.3||b.z>16||b.t>3){b.state='miss';b.t=0;st.first=false}}
 if(b&&b.state==='miss'){b.t+=dt;if(b.t>.5){st.ball=null;checkOut()}}
 if(st.phase==='suck'){st.fade=Math.min(1,st.fade+dt*2.4);if(st.fade>=1){st.phase='drop';st.dropT=0}}
 if(st.phase==='drop'){st.dropT+=dt;if(st.dropT>.6){st.phase='shake';st.shakeT=0;st.shakes=0}}
 if(st.phase==='shake'){st.shakeT+=dt;if(st.shakeT>1.05){st.shakeT=0;if(st.shakes<st.passN){st.shakes++;AU.play('wobble');if(st.shakes===3&&st.passN>=3){st.phase='caught';st.ct=0;AU.play('catch');sparkle()}}else{breakFree()}}}
 if(st.phase==='caught'){st.ct+=dt;if(st.ct>1.6&&!st.result){finish({caught:true,bonus:st.bonusName,curve:st.curveOK,first:st.firstOK,throws:st.throws})}}
 if(!st)return;
 if(st.phase==='out'){st.ft=(st.ft||0)+dt;if(st.ft>.6){st.phase='aim';st.fade=0;st.ball=null;checkFlee()}}
 for(const p of st.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.l-=dt*1.3}st.parts=st.parts.filter(p=>p.l>0);
 for(const m of st.msg)m.t+=dt;st.msg=st.msg.filter(m=>m.t<1.3)}
function hit(d,c){const b=st.ball;b.state='hit';AU.play('hit');const rr=c.R*(1-.8*st.ring);let bonus=0,name='';
 if(d<=rr){const f=rr/c.R;if(f<.35){bonus=1.85;name='excellent'}else if(f<.7){bonus=1.5;name='great'}else{bonus=1.15;name='nice'}}
 st.bonusName=name;st.curveOK=!!b.curve;st.firstOK=st.first;st.first=false;
 if(name){st.msg.push({k:name,t:0});AU.play('nice',name==='excellent'?3:name==='great'?2:1)}if(b.curve)st.msg.push({k:'curve',t:-.25});
 // probability
 const lvPen=Math.max(.35,1.15-st.o.lv/45);const base=Math.min(.95,st.sp.cr*lvPen*(st.o.raid?.7:1));
 const jm=b.type==='vjar'?1.6:ITEMS[b.type].m;let m=jm*(st.drop?1.5:1)*(b.curve?1.7:1)*(bonus||1);if(S.cheat)m*=1.3;
 const P=1-Math.pow(1-base,m);const q=Math.pow(P,1/3);let n=0;while(n<3&&Math.random()<q)n++;st.passN=n;
 st.drop=false;st.bun=false;st.phase='suck';st.fade=0;AU.play('suck');st.hitPos={x:b.x,y:b.y};updUI()}
function breakFree(){st.phase='out';st.ft=0;AU.play('broke');st.msg.push({k:'broke',t:0});const c=creature();for(let i=0;i<20;i++)st.parts.push({x:c.cx,y:H*.56-10,vx:(Math.random()-.5)*600,vy:-Math.random()*500,l:1,c:'#ffd76a',r:5})}
function checkFlee(){if(st.o.bonus){checkOut();return}if(Math.random()<st.sp.fl*(st.o.shiny?.5:1)){st.phase='fled';AU.play('flee');st.msg.push({k:'fled',t:0});setTimeout(()=>finish({fled:true}),1200)}else checkOut()}
function checkOut(){if(st&&st.o.bonus&&st.vjars<=0&&st.phase==='aim'){st.phase='fled';AU.play('flee');st.msg.push({k:'fled',t:0});setTimeout(()=>finish({fled:true}),1200)}}
function sparkle(){for(let i=0;i<26;i++){const a=Math.random()*Math.PI*2,s=150+Math.random()*250;st.parts.push({x:W/2,y:H*.56-24,vx:Math.cos(a)*s,vy:Math.sin(a)*s-200,l:1.2,c:['#fff27a','#ffffff','#ff9ec7','#7fd8ff'][i%4],r:4+Math.random()*4,star:true})}}
function finish(r){if(!st||st.result)return;st.result=r;const cb=st.o.onEnd;endEncounter();cb(r)}
// --- draw ---
function cover(im){const ir=im.width/im.height,sr=W/H;let w,h;if(ir>sr){h=H;w=H*ir}else{w=W;h=W/ir}g.drawImage(im,(W-w)/2,(H-h)/2,w,h)}
function drawJar(type,x,y,s,rot=0,squash=1){const im=jarImg(type);if(!im.complete||!im.width)return;g.save();g.translate(x,y);g.rotate(rot);g.scale(1/squash*1,squash);const w=s,h=s*im.height/im.width;g.drawImage(im,-w/2,-h/2,w,h);g.restore()}
function draw(){if(!st)return;g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,W,H);
 if(!st.ar){if(bgImg.complete&&bgImg.width)cover(bgImg);else{g.fillStyle='#9fd88a';g.fillRect(0,0,W,H)}
  const gr=g.createLinearGradient(0,H*.55,0,H);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.25)');g.fillStyle=gr;g.fillRect(0,H*.55,W,H*.45)}
 const c=creature();
 // ground shadow
 g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(W/2,H*.56,c.w*.38*(1-st.hop*.3),c.h*.05,0,0,Math.PI*2);g.fill();
 // creature
 const vis=st.phase==='aim'||st.phase==='out'?1:st.phase==='suck'?1-st.fade:0;
 if(img.complete&&img.width&&vis>0&&st.phase!=='fled'){g.save();const bob=Math.sin(st.t*2.6)*c.h*.012;const sq=1+Math.sin(st.t*2.6)*.012;
  if(st.phase==='suck'){const k=1-st.fade;g.globalAlpha=1;g.translate(c.cx,c.cy);g.scale(k,k);g.translate(-c.cx,-c.cy);g.filter&&(g.filter=`brightness(${1+st.fade*2})`)}
  if(st.phase==='out'){const k=Math.min(1,st.ft*3);g.translate(c.cx,c.y+c.h);g.scale(k,k);g.translate(-c.cx,-(c.y+c.h))}
  g.drawImage(img,c.x,c.y+bob+c.h*(1-sq),c.w,c.h*sq);if(g.filter)g.filter='none';g.restore();
  if(st.phase==='suck'){g.fillStyle=`rgba(255,250,220,${.6*(1-st.fade)})`;g.beginPath();g.arc(c.cx,c.cy,c.R*(1-st.fade*.7),0,Math.PI*2);g.fill()}
  if(st.o.shiny&&st.phase==='aim'){for(let i=0;i<4;i++){const a=st.t*1.5+i*1.6;star(c.cx+Math.cos(a)*c.w*.55,c.cy+Math.sin(a*1.3)*c.h*.45,6+3*Math.sin(st.t*5+i))}}
  if(st.phase==='aim'&&!(st.ball&&st.ball.state==='hit')){// rings
   g.lineWidth=3;g.strokeStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(c.cx,c.cy,c.R,0,Math.PI*2);g.stroke();
   g.lineWidth=5;g.strokeStyle=ringCol();g.beginPath();g.arc(c.cx,c.cy,c.R*(1-.8*st.ring),0,Math.PI*2);g.stroke();
   if(st.drop||st.bun){g.font='28px sans-serif';g.textAlign='center';g.fillText(st.drop?'🍯':'🧁',c.cx+c.w*.45,c.y+20)}}}
 // jar in flight / on ground
 const b=st.ball;
 if(b&&(b.state==='fly'||b.state==='miss')){const [sx,sy]=proj(b.x,Math.max(b.y,-.2),Math.max(.3,b.z));const s=Math.max(10,62*.6/Math.max(.3,b.z)*1.2);g.globalAlpha=b.state==='miss'?Math.max(0,1-b.t*2):1;
  g.fillStyle='rgba(0,0,0,.15)';const [gx,gy]=proj(b.x,0,Math.max(.3,b.z));g.beginPath();g.ellipse(gx,gy,s*.4,s*.1,0,0,7);g.fill();drawJar(b.type,sx,sy,s,b.rot);g.globalAlpha=1}
 if(st.phase==='suck'){const [sx,sy]=proj(st.hitPos.x,st.hitPos.y+.6*st.fade,ZC*.92);drawJar(st.ball.type,sx,sy,44,0)}
 if(st.phase==='drop'||st.phase==='shake'||st.phase==='caught'){const t=st.phase==='drop'?Math.min(1,st.dropT/.45):1;const [sx,sy0]=proj(st.hitPos.x*(1-t),st.hitPos.y+.6,ZC*.92);const gy=H*.56-22;let sy=sy0+(gy-sy0)*(t*t);
  if(st.phase==='drop'&&st.dropT>.45)sy=gy-Math.sin((st.dropT-.45)/.15*Math.PI)*8;
  let rot=0;if(st.phase==='shake'&&st.shakes<3&&st.shakeT>.35&&st.shakeT<.85){const k=(st.shakeT-.35)/.5;rot=Math.sin(k*Math.PI*3)*.45*(1-k)}
  drawJar(st.ball.type,sx,sy,48,rot);if(st.phase==='shake')for(let i=0;i<st.shakes;i++){g.fillStyle='#fff';g.beginPath();g.arc(sx-14+i*14,sy-40,4,0,7);g.fill()}}
 // jar in hand
 if(st.phase==='aim'&&!st.ball){const h=st.hold;const x=h?h.x:W/2,y=h?h.y:H*.86+Math.sin(st.t*3)*3;drawJar(st.jarType,x,y,74,h&&h.curve?st.t*14:h?Math.sin(st.t*10)*.1:0);
  if(h&&h.curve){for(let i=0;i<3;i++)star(x+Math.cos(st.t*8+i*2)*48,y+Math.sin(st.t*8+i*2)*48,5)}
  if(!st.hint&&st.t>1.2){g.globalAlpha=.6+.4*Math.sin(st.t*4);const k=(st.t*.8)%1;g.fillStyle='#fff';g.beginPath();g.arc(W/2+k*0,H*.86-k*H*.25,14,0,7);g.fill();g.globalAlpha=1}}
 for(const p of st.parts){g.globalAlpha=Math.max(0,Math.min(1,p.l));g.fillStyle=p.c;if(p.star)star(p.x,p.y,p.r,p.c);else{g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()}}g.globalAlpha=1;
 for(const m of st.msg){if(m.t<0)continue;const k=m.t;g.save();g.globalAlpha=Math.max(0,1-Math.max(0,k-.9)*2.5);g.translate(W/2,H*.27-k*30);const s=Math.min(1,k*5);g.scale(s,s);
  g.font=`${Math.round(Math.min(46,W*.11))}px Chewy, sans-serif`;g.textAlign='center';g.lineWidth=7;g.strokeStyle='rgba(60,30,70,.85)';const tx=st.o.T(m.k);g.strokeText(tx,0,m.k==='curve'?50:0);
  g.fillStyle={excellent:'#ff7ad9',great:'#ffd23a',nice:'#7dff8a',curve:'#8fe3ff',broke:'#fff',fled:'#fff'}[m.k]||'#fff';g.fillText(tx,0,m.k==='curve'?50:0);g.restore()}
 if(st.phase==='caught'){g.font=`${Math.round(Math.min(48,W*.115))}px Chewy, sans-serif`;g.textAlign='center';g.lineWidth=8;g.strokeStyle='rgba(60,30,70,.85)';const tx=st.o.T('caught');g.strokeText(tx,W/2,H*.3);g.fillStyle='#fff27a';g.fillText(tx,W/2,H*.3)}}
function star(x,y,r,c='#fff6a0'){g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();g.fill()}
export function active(){return !!st}

export function dbg(){return st}
