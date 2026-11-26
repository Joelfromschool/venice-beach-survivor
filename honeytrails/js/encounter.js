// Catch screen: flick a honey jar at the pal. Pseudo-3D physics, shrinking ring bonus, curveballs, shakes.
import {SP,ITEMS} from './data.js?v=1.0.4';
import {S} from './state.js?v=1.0.4';
import {AU} from './audio.js?v=1.0.4';
let cv,g,W,H,DPR,st=null,raf=0,img=null,bgImg=null,video=null;
const F=()=>.30*H,HH=()=>.485*H,ZC=6;
const proj=(x,y,z)=>[W/2+x*F()/z,HH()-(y-1.5)*F()/z];
const imgs={};function loadImg(src){if(!imgs[src]){const i=new Image();i.src=src;imgs[src]=i}return imgs[src]}
export function jarImg(type){return loadImg('art/'+type+'.png?v='+window.__V)}
export function startEncounter(opts){// opts:{spawn,lv,iv,shiny,bonus:{jars}, bg, T, onEnd, toast}
 cv=document.getElementById('enc');g=cv.getContext('2d');resize();
 const sp=SP[opts.sp];img=loadImg(window.__art(opts.sp,opts.shiny,opts.hat));bgImg=loadImg('bg/'+opts.bg+'.webp?v='+window.__V);
 const types=['jar','gjar','rjar'];
 st={o:opts,sp,t:0,phase:'aim',jarType:opts.bonus?'vjar':(types.find(k=>S.items[k]>0)||'jar'),ball:null,hold:null,ring:0,hop:0,hopT:5+Math.random()*4,miss:0,arrow:!!opts.tutorial,msg:[],parts:[],
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
export function onDown(x,y){if(!st||st.phase!=='aim'||st.ball)return false;if(y<H*.62)return false;
 if(jarsLeft()<=0){st.o.toast(st.o.T('noJars'));return true}
 st.hold={x,y,x0:x,y0:y,t0:performance.now(),pts:[[x,y,performance.now()]],ang:null,spin:0,curve:false,dir:0};st.hint=1;return true}
export function onMove(x,y){const h=st&&st.hold;if(!h)return;const now=performance.now();h.pts.push([x,y,now]);if(h.pts.length>12)h.pts.shift();h.x=x;h.y=y;
 // spin detection: angle around the jar's rest point
 const jx=W/2,jy=H*.86,dx=x-jx,dy=y-jy;if(Math.hypot(dx,dy)>14&&y>H*.62){const a=Math.atan2(dy,dx);if(h.ang!=null){let d=a-h.ang;if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;h.spin+=d}h.ang=a;
  if(Math.abs(h.spin)>Math.PI*2.2&&!h.curve){h.curve=true;h.dir=Math.sign(h.spin);AU.play('star')}}}
export function onUp(x,y,cancel){const h=st&&st.hold;if(!h)return;st.hold=null;const now=performance.now();
 const dy=h.y0-y,dxT=x-h.x0,dur=Math.max(.03,(now-h.t0)/1000);const rec=h.pts.filter(p=>now-p[2]<120);const a=rec[0]||h.pts[0];const rdt=Math.max(.016,(now-a[2])/1000);
 const vUp=(a[1]-y)/rdt/H,vUpAll=dy/dur/H;// screens per second
 const isThrow=dy>Math.max(22,H*.035)&&(vUp>.35||vUpAll>.35||dy>H*.14);if(!isThrow)return;
 const c=creature();const pn=Math.min(4,Math.max(vUp,vUpAll,dy/H*3));// normalized power, clamped
 const ang=Math.atan2(dxT,dy);const reach=Math.max(40,y-c.cy);let off=Math.max(-W,Math.min(W,x-c.cx+Math.tan(Math.max(-1.2,Math.min(1.2,ang)))*reach));
 {const A=Math.abs(off),L=W*.6;off=A<L?off*.3:Math.sign(off)*(L*.3+(A-L)*.9)};// aim assist: roughly-right flicks are bent toward the pal
 const vy=Math.max(-.22,Math.min(.22,(1.4-pn)*.12));// strength only nudges height a little, never overshoots
 st.ball={sx0:x,sy0:y,tx:c.cx+off,ty:c.cy+vy*c.h,t:0,T:.5,arc:H*.12,curve:h.curve?h.dir:0,rot:0,type:st.jarType,state:'fly',x:0,y:0,s:74};
 if(st.o.bonus)st.vjars--;else if(!S.cheat)S.items[st.jarType]--;st.throws++;st.arrow=false;AU.play('throw');updUI()}
function ballPos(b,u){const e=1-Math.pow(1-u,1.6);return [b.sx0+(b.tx-b.sx0)*e+b.curve*Math.sin(Math.PI*u)*W*.16,b.sy0+(b.ty-b.sy0)*e-b.arc*Math.sin(Math.PI*u),74+(46-74)*e]}
// --- sim ---
function step(dt){st.t+=dt;st.ring=(st.t%3.2)/3.2;
 // hop/attack
 st.hopT-=dt;if(st.hopT<0&&st.phase==='aim'){st.hopT=6+Math.random()*5;if('rel'.includes(st.sp.rar)&&!st.bun&&!st.o.tutorial&&!(st.ball&&st.ball.state==='fly'))st.hopping=.6}
 if(st.hopping>0){st.hopping-=dt;st.hop=Math.sin((1-st.hopping/.7)*Math.PI)}else st.hop=0;if(st.hopping>0)st.hopping-=0;
 const b=st.ball;
 if(b&&b.state==='fly'){b.t+=dt;b.rot+=dt*(b.curve?22:9);const u=Math.min(1,b.t/b.T);[b.x,b.y,b.s]=ballPos(b,u);
  if(u>=1){const c=creature();const d=Math.hypot(b.x-c.cx,b.y-c.cy);const inBody=b.x>c.x-c.w*.1&&b.x<c.x+c.w*1.1&&b.y>c.y-c.h*.05&&b.y<c.y+c.h*1.02;
   if(d<c.R*1.5||inBody){hit(d,c);return}b.state='miss';b.t=0;b.vx=(b.tx-b.sx0)/b.T*.6;b.vy=-H*.2;st.first=false;st.miss++;
   if(st.miss>=2){st.arrow=true;const e=document.getElementById('eHint');if(e){e.textContent=st.o.T('missHint');clearTimeout(e._t);e._t=setTimeout(()=>{e.textContent=''},5000)}}}}
 if(b&&b.state==='miss'){b.t+=dt;b.x+=b.vx*dt;b.vy+=H*1.6*dt;b.y+=b.vy*dt;if(b.t>.5){st.ball=null;checkOut()}}
 if(st.phase==='suck'){st.fade=Math.min(1,st.fade+dt*2.4);if(st.fade>=1){st.phase='drop';st.dropT=0}}
 if(st.phase==='drop'){st.dropT+=dt;if(st.dropT>.6){st.phase='shake';st.shakeT=0;st.shakes=0}}
 if(st.phase==='shake'){st.shakeT+=dt;if(st.shakeT>1.05){st.shakeT=0;if(st.shakes<st.passN){st.shakes++;AU.play('wobble');if(st.shakes===3&&st.passN>=3){st.phase='caught';st.ct=0;AU.play('catch');sparkle()}}else{breakFree()}}}
 if(st.phase==='caught'){st.ct+=dt;if(st.ct>1.6&&!st.result){finish({caught:true,bonus:st.bonusName,curve:st.curveOK,first:st.firstOK,throws:st.throws})}}
 if(!st)return;
 if(st.phase==='out'){st.ft=(st.ft||0)+dt;if(st.ft>.6){st.phase='aim';st.fade=0;st.ball=null;checkFlee()}}
 for(const p of st.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.l-=dt*1.3}st.parts=st.parts.filter(p=>p.l>0);
 for(const m of st.msg)m.t+=dt;st.msg=st.msg.filter(m=>m.t<1.3)}
const BASE={c:.88,u:.7,r:.48,e:.36,l:.3};
export function catchP(sp,lv,jar,drop,curve,bonus,raid){const lvPen=Math.max(.75,1.05-lv/100);const base=Math.min(.97,BASE[sp.rar]*lvPen);
 const jm=jar==='vjar'?1.6:ITEMS[jar].m;const m=jm*(drop?1.5:1)*(curve?1.3:1)*(bonus||1);return 1-Math.pow(1-base,m)}
function hit(d,c){const b=st.ball;b.state='hit';AU.play('hit');const rr=c.R*(1-.7*st.ring);let bonus=0,name='';
 if(d<=rr+12){const f=rr/c.R;if(f<.45){bonus=1.5;name='excellent'}else if(f<.75){bonus=1.3;name='great'}else{bonus=1.1;name='nice'}}
 st.bonusName=name;st.curveOK=!!b.curve;st.firstOK=st.first;st.first=false;st.miss=0;st.arrow=false;
 if(name){st.msg.push({k:name,t:0});AU.play('nice',name==='excellent'?3:name==='great'?2:1)}if(b.curve)st.msg.push({k:'curve',t:-.25});
 let P=catchP(st.sp,st.o.lv,b.type,st.drop,b.curve,bonus,st.o.raid);if(S.cheat)P=Math.max(P,.97);if(st.o.tutorial)P=1;
 const q=Math.pow(P,1/3);let n=0;while(n<3&&Math.random()<q)n++;st.passN=n;
 st.drop=false;st.bun=false;st.phase='suck';st.fade=0;AU.play('suck');st.hitPos={x:b.x,y:b.y};updUI()}
function breakFree(){st.phase='out';st.ft=0;AU.play('broke');st.msg.push({k:'broke',t:0});const c=creature();for(let i=0;i<20;i++)st.parts.push({x:c.cx,y:H*.56-10,vx:(Math.random()-.5)*600,vy:-Math.random()*500,l:1,c:'#ffd76a',r:5})}
function checkFlee(){if(st.o.bonus){checkOut();return}if(Math.random()<({c:0,u:.02,r:.05,e:.06,l:0}[st.sp.rar])*(st.o.shiny?.5:1)){st.phase='fled';AU.play('flee');st.msg.push({k:'fled',t:0});setTimeout(()=>finish({fled:true}),1200)}else checkOut()}
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
 if(b&&(b.state==='fly'||b.state==='miss')){g.globalAlpha=b.state==='miss'?Math.max(0,1-b.t*2):1;drawJar(b.type,b.x,b.y,b.s,b.rot);g.globalAlpha=1}
 if(st.phase==='suck'){drawJar(st.ball.type,st.hitPos.x,st.hitPos.y-30*st.fade,46,0)}
 if(st.phase==='drop'||st.phase==='shake'||st.phase==='caught'){const t=st.phase==='drop'?Math.min(1,st.dropT/.45):1;const sx=st.hitPos.x+(W/2-st.hitPos.x)*t,sy0=st.hitPos.y-30;const gy=H*.56-22;let sy=sy0+(gy-sy0)*(t*t);
  if(st.phase==='drop'&&st.dropT>.45)sy=gy-Math.sin((st.dropT-.45)/.15*Math.PI)*8;
  let rot=0;if(st.phase==='shake'&&st.shakes<3&&st.shakeT>.35&&st.shakeT<.85){const k=(st.shakeT-.35)/.5;rot=Math.sin(k*Math.PI*3)*.45*(1-k)}
  drawJar(st.ball.type,sx,sy,48,rot);if(st.phase==='shake')for(let i=0;i<st.shakes;i++){g.fillStyle='#fff';g.beginPath();g.arc(sx-14+i*14,sy-40,4,0,7);g.fill()}}
 // jar in hand
 if(st.phase==='aim'&&!st.ball){const h=st.hold;const x=h?h.x:W/2,y=h?h.y:H*.86+Math.sin(st.t*3)*3;drawJar(st.jarType,x,y,74,h&&h.curve?st.t*14:h?Math.sin(st.t*10)*.1:0);
  if(h&&h.curve){for(let i=0;i<3;i++)star(x+Math.cos(st.t*8+i*2)*48,y+Math.sin(st.t*8+i*2)*48,5)}
  if(st.arrow&&!h)drawArrow()}
 for(const p of st.parts){g.globalAlpha=Math.max(0,Math.min(1,p.l));g.fillStyle=p.c;if(p.star)star(p.x,p.y,p.r,p.c);else{g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()}}g.globalAlpha=1;
 for(const m of st.msg){if(m.t<0)continue;const k=m.t;g.save();g.globalAlpha=Math.max(0,1-Math.max(0,k-.9)*2.5);g.translate(W/2,H*.27-k*30);const s=Math.min(1,k*5);g.scale(s,s);
  g.font=`${Math.round(Math.min(46,W*.11))}px Chewy, sans-serif`;g.textAlign='center';g.lineWidth=7;g.strokeStyle='rgba(60,30,70,.85)';const tx=st.o.T(m.k);g.strokeText(tx,0,m.k==='curve'?50:0);
  g.fillStyle={excellent:'#ff7ad9',great:'#ffd23a',nice:'#7dff8a',curve:'#8fe3ff',broke:'#fff',fled:'#fff'}[m.k]||'#fff';g.fillText(tx,0,m.k==='curve'?50:0);g.restore()}
 if(st.phase==='caught'){g.font=`${Math.round(Math.min(48,W*.115))}px Chewy, sans-serif`;g.textAlign='center';g.lineWidth=8;g.strokeStyle='rgba(60,30,70,.85)';const tx=st.o.T('caught');g.strokeText(tx,W/2,H*.3);g.fillStyle='#fff27a';g.fillText(tx,W/2,H*.3)}}
function drawArrow(){const c=creature();const x0=W/2,y0=H*.8,x1=c.cx,y1=c.cy+c.R*.6;g.save();g.lineWidth=7;g.lineCap='round';g.setLineDash([2,16]);g.strokeStyle='rgba(255,255,255,.85)';
 g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo(x0,(y0+y1)/2-H*.05,x1,y1);g.stroke();g.setLineDash([]);
 g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.moveTo(x1,y1-22);g.lineTo(x1-16,y1+4);g.lineTo(x1+16,y1+4);g.closePath();g.fill();
 const k=(st.t*.9)%1,e=1-Math.pow(1-k,2);const fx=x0,fy=y0+H*.03-(H*.2)*e;g.globalAlpha=k<.85?1:(1-k)/.15;g.font=`${Math.round(Math.min(48,W*.12))}px sans-serif`;g.textAlign='center';g.fillText('👆',fx,fy+20);g.restore()}
function star(x,y,r,c='#fff6a0'){g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();g.fill()}
export function active(){return !!st}

export function dbg(){return st}
