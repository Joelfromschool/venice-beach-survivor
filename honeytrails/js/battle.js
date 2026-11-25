// Arena / boss party battle: tap to attack, fill energy for a special, swipe left/right to dodge.
import {SP,cpm} from './data.js?v=1.0.0';
import {AU} from './audio.js?v=1.0.0';
let cv,g,W,H,DPR,st=null,raf=0;const imgs={};
const L=src=>{if(!imgs[src]){const i=new Image();i.src=src;imgs[src]=i}return imgs[src]};
export function startBattle(o){// o:{team:[pal], opp:{sp,lv,hpMax,tier}, raid, bg, T, onEnd}
 cv=document.getElementById('bat');g=cv.getContext('2d');resize();
 const team=o.team.map(p=>({p,img:L(window.__art(p.sp,p.shiny,p.hat)),hp:p.hp*6,max:p.hp*6,A:(SP[p.sp].st[0]+p.iv[0])*cpm(p.lv),D:(SP[p.sp].st[1]+p.iv[1])*cpm(p.lv)}));
 const os=SP[o.opp.sp],om=cpm(o.opp.lv);
 st={o,team,cur:0,opp:{sp:o.opp.sp,img:L('art/'+o.opp.sp+'.webp?v='+window.__V),hp:o.opp.hpMax,max:o.opp.hpMax,A:(os.st[0]+15)*om*(o.raid?1+o.opp.tier*.12:1),D:(os.st[1]+15)*om},
  bg:L('bg/'+o.bg+'.webp?v='+window.__V),t:0,time:o.raid?150:100,energy:0,cd:0,next:2.5,warn:0,dodgeT:-9,shake:0,fx:[],msg:[],over:false,swap:0,myHit:0,oppHit:0,slide:0,started:false,intro:1.4};
 cv.classList.add('on');document.getElementById('batUI').classList.add('on');AU.song('battle');
 cancelAnimationFrame(raf);let last=performance.now();const loop=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;step(dt);draw();if(st)raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);upd()}
export function resize(){if(!cv)return;DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR}
export function endBattle(){if(!st)return;cancelAnimationFrame(raf);cv.classList.remove('on');document.getElementById('batUI').classList.remove('on');st=null}
function me(){return st.team[st.cur]}
function upd(){if(!st)return;const u=document.getElementById('batUI');const m=me();const T=st.o.T;
 u.querySelector('#bOppN').textContent=T(st.opp.sp,1);u.querySelector('#bOppHp').style.width=(st.opp.hp/st.opp.max*100)+'%';
 u.querySelector('#bMeN').textContent=m?T(m.p.sp,1)+'  CP '+m.p.cp:'';u.querySelector('#bMeHp').style.width=(m?m.hp/m.max*100:0)+'%';
 u.querySelector('#bEn').style.width=st.energy+'%';u.querySelector('#bSpec').classList.toggle('ready',st.energy>=100);
 u.querySelector('#bTime').textContent=Math.ceil(Math.max(0,st.time));
 u.querySelector('#bTeam').innerHTML=st.team.map((x,i)=>`<i class="${x.hp<=0?'ko':i===st.cur?'cur':''}" style="background-image:url(${x.img.src})"></i>`).join('')}
let down=null;
export function onDown(x,y){if(!st||st.over)return;down={x,y,t:performance.now()}}
export function onUp(x,y){if(!st||st.over||!down)return;const dx=x-down.x,dy=y-down.y,dt=performance.now()-down.t;down=null;
 if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)&&dt<450){dodge(Math.sign(dx));return}
 if(Math.hypot(dx,dy)<30)attack()}
export function special(){if(!st||st.over||st.energy<100||st.intro>0||!me()||me().hp<=0)return;st.energy=0;const dmg=dmgTo(st.opp,me().A,6);st.opp.hp=Math.max(0,st.opp.hp-dmg);st.oppHit=.5;st.shake=.5;AU.play('big');
 st.msg.push({k:'special',t:0});for(let i=0;i<30;i++){const a=Math.random()*7;st.fx.push({x:W/2,y:H*.33,vx:Math.cos(a)*400,vy:Math.sin(a)*400,l:1,c:['#ffd23a','#ff7ad9','#fff'][i%3]})}upd();checkEnd()}
function dmgTo(t,A,mult){return Math.max(1,Math.round(mult*4.2*A/t.D*(0.9+Math.random()*.2)))}
function attack(){if(st.intro>0||st.cd>0||!me()||me().hp<=0||st.swap>0)return;st.cd=.32;const dmg=dmgTo(st.opp,me().A,1);st.opp.hp=Math.max(0,st.opp.hp-dmg);st.energy=Math.min(100,st.energy+9);st.myHit=.18;st.oppHit=.2;AU.play('atk');
 st.fx.push({x:W/2+(Math.random()-.5)*W*.2,y:H*.3+(Math.random()-.5)*H*.1,vx:0,vy:-60,l:.7,txt:'-'+dmg});upd();checkEnd()}
function dodge(d){if(st.intro>0)return;st.dodgeT=st.t;st.slide=d;AU.play('dodge')}
function step(dt){if(!st)return;st.t+=dt;if(st.intro>0){st.intro-=dt;return}
 if(!st.over){st.time-=dt;st.cd-=dt;st.next-=dt;st.swap=Math.max(0,st.swap-dt);
  if(st.next<.8&&!st.warn){st.warn=1;AU.play('warn')}
  if(st.next<=0){st.warn=0;st.next=2+Math.random()*1.4-(st.o.raid?st.o.opp.tier*.08:0);const m=me();if(m&&m.hp>0&&st.swap<=0){const dodged=st.t-st.dodgeT<.75;let dmg=dmgTo(m,st.opp.A,st.o.raid?2.6:2.1);if(dodged){dmg=Math.ceil(dmg*.2);st.msg.push({k:'dodge',t:0})}
   m.hp=Math.max(0,m.hp-dmg);st.shake=dodged?0:.35;AU.play(dodged?'dodge':'hurt');st.fx.push({x:W*.3,y:H*.68,vx:0,vy:-60,l:.8,txt:'-'+dmg,c:'#ff6a6a'});
   if(m.hp<=0){const n=st.team.findIndex(x=>x.hp>0);if(n>=0){st.cur=n;st.swap=1}else{st.over=true;AU.play('lose');setTimeout(()=>fin(false),1400)}}upd()}}
  if(st.time<=0&&!st.over){st.over=true;st.timeUp=true;AU.play('lose');setTimeout(()=>fin(false),1400)}
  if(Math.floor(st.time*4)!==Math.floor((st.time+dt)*4))upd()}
 st.myHit=Math.max(0,st.myHit-dt);st.oppHit=Math.max(0,st.oppHit-dt);st.shake=Math.max(0,st.shake-dt);st.slide*=Math.pow(.02,dt);
 for(const f of st.fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.l-=dt*1.4;if(!f.txt)f.vy+=300*dt}st.fx=st.fx.filter(f=>f.l>0);for(const m of st.msg)m.t+=dt;st.msg=st.msg.filter(m=>m.t<1.1)}
function checkEnd(){if(st.opp.hp<=0&&!st.over){st.over=true;st.won=true;AU.play('win');setTimeout(()=>fin(true),1600)}}
function fin(won){const cb=st.o.onEnd,team=st.team;endBattle();cb({won,team})}
function cover(im){const ir=im.width/im.height,sr=W/H;let w,h;if(ir>sr){h=H;w=H*ir}else{w=W;h=W/ir}g.drawImage(im,(W-w)/2,(H-h)/2,w,h)}
function draw(){if(!st)return;g.setTransform(DPR,0,0,DPR,0,0);const sx=st.shake?(Math.random()-.5)*14*st.shake/.35:0;g.translate(sx,0);
 if(st.bg.complete&&st.bg.width)cover(st.bg);else{g.fillStyle='#6a8';g.fillRect(0,0,W,H)}g.fillStyle='rgba(20,10,40,.18)';g.fillRect(0,0,W,H);
 // platforms
 g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(W*.58,H*.49,W*.32,H*.035,0,0,7);g.fill();g.beginPath();g.ellipse(W*.3,H*.86,W*.26,H*.03,0,0,7);g.fill();
 // opponent
 const o=st.opp,oi=o.img;if(oi.width){const h=Math.min(H*.33,W*.75)*(st.o.raid?1.1:1)*(SP[o.sp].sz||1);const w=h*oi.width/oi.height;const lunge=st.next<.25&&!st.over?(1-st.next/.25)*30:0;
  const y=H*.49-h+Math.sin(st.t*2)*4+lunge;g.save();if(st.oppHit>0)g.globalAlpha=.55+.45*Math.sin(st.t*60);if(st.won){g.globalAlpha=Math.max(0,1-(st.t%9));}g.drawImage(oi,W*.58-w/2,y,w,h);g.restore();
  if(st.warn&&!st.over){g.fillStyle='#ffe14a';g.font=`${Math.round(W*.1)}px Chewy, sans-serif`;g.textAlign='center';g.fillText('!',W*.58+w*.45,y+30);g.strokeStyle='rgba(255,225,74,.8)';g.lineWidth=4;g.beginPath();g.arc(W*.58,y+h*.5,h*.55*(st.next/.8),0,7);g.stroke()}}
 // mine
 const m=me();if(m&&m.img.width){const h=Math.min(H*.24,W*.55)*(SP[m.p.sp].sz||1);const w=h*m.img.width/m.img.height;const lunge=st.myHit>0?18:0;const x=W*.3-w/2+st.slide*W*.22+lunge;const y=H*.86-h+(st.swap>0?st.swap*H*.3:0);
  g.save();g.translate(x+w/2,0);g.scale(-1,1);g.translate(-(x+w/2),0);if(m.hp<=0)g.globalAlpha=.3;g.drawImage(m.img,x,y,w,h);g.restore()}
 for(const f of st.fx){g.globalAlpha=Math.max(0,Math.min(1,f.l));if(f.txt){g.font=`${Math.round(W*.07)}px Chewy, sans-serif`;g.textAlign='center';g.lineWidth=5;g.strokeStyle='rgba(40,20,60,.8)';g.strokeText(f.txt,f.x,f.y);g.fillStyle=f.c||'#fff';g.fillText(f.txt,f.x,f.y)}else{g.fillStyle=f.c;g.beginPath();g.arc(f.x,f.y,5,0,7);g.fill()}}g.globalAlpha=1;
 const T=st.o.T;const big=(t,y,c)=>{g.font=`${Math.round(Math.min(52,W*.12))}px Chewy, sans-serif`;g.textAlign='center';g.lineWidth=8;g.strokeStyle='rgba(50,20,70,.85)';g.strokeText(t,W/2,y);g.fillStyle=c;g.fillText(t,W/2,y)};
 for(const mm of st.msg)big(T(mm.k),H*.58-mm.t*30,mm.k==='dodge'?'#8fe3ff':'#ffd23a');
 if(st.intro>0)big(T('battle'),H*.45,'#fff');
 if(st.over)big(st.won?T('win'):st.timeUp?T('timeUp'):T('lose'),H*.45,st.won?'#fff27a':'#fff')}
export function active(){return !!st}
export function dbg(){return st}
