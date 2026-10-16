// ===== v2.0 SERVING MINI GAME =====
const FOODS={
 yakitori:['Yakitori','やきとり',.8],tsukune:['Tsukune','つくね',.8],edamame:['Edamame','えだまめ',0],ramune:['Ramune','ラムネ',0],
 nigiri:['Salmon Nigiri','サーモン握り',0],maki:['Maki Roll','まき寿司',0],tamago:['Tamago','たまご',0],tea:['Green Tea','お茶',0],
 ramen:['Ramen','ラーメン',1.2],gyoza:['Gyoza','ぎょうざ',.8],egg:['Ramen Egg','味玉',0],
 latte:['Latte','ラテ',.7],croissant:['Croissant','クロワッサン',0],cupcake:['Cupcake','カップケーキ',0],macaron:['Macaron','マカロン',0],
 baguette:['Baguette','バゲット',0],soup:['Onion Soup','オニオンスープ',.8],crepe:['Crêpe','クレープ',1],cheese:['Cheese','チーズ',0],juice:['Juice','ジュース',0],
 fish:['Plated Fish','お魚プレート',1.1],steak:['Steak','ステーキ',1.2],dessert:['Fancy Dessert','デザート',0],wine:['Wine','ワイン',0],garnish:['Garnish','かざり',0]};
const STALLS={yaki:{foods:['yakitori','tsukune','edamame','ramune'],lv:0},sushi:{foods:['nigiri','maki','tamago','tea'],lv:1},ramen:{foods:['ramen','gyoza','egg','tea'],lv:2},
 cafe:{foods:['latte','croissant','cupcake','macaron'],lv:3},bistro:{foods:['baguette','soup','crepe','cheese','juice'],lv:4},fine:{foods:['fish','steak','dessert','wine','garnish'],lv:5}};
const FN=id=>L2(FOODS[id][0],FOODS[id][1]);
// flat cut-out food art (unit 100x100)
function foodArt(x,id){const F=(p,c,lw)=>fillP(x,p,c,c,lw||4),C=(cx,cy,r)=>circP(cx,cy,r),R=(a,b,c,d,e)=>rrP(a,b,c,d,e);
 const skew=(cols)=>{x.strokeStyle='#c8955a';x.lineWidth=5;x.beginPath();x.moveTo(12,88);x.lineTo(88,12);x.stroke();cols.forEach((c,i)=>F(C(30+i*17,70-i*17,12),c));};
 switch(id){
 case'yakitori':skew(['#c8743a','#7ac142','#c8743a']);x.fillStyle='rgba(255,255,255,.35)';x.fill(C(26,64,4));break;
 case'tsukune':skew(['#8a4a2a','#8a4a2a','#8a4a2a']);x.strokeStyle='#ffcc33';x.lineWidth=3;x.beginPath();x.moveTo(20,60);x.lineTo(70,10);x.stroke();break;
 case'edamame':F(R(16,52,68,30,14),'#fff');for(let i=0;i<3;i++){F(new Path2D(`M${22+i*18} 40 q10 -14 20 0 q-10 14 -20 0z`),'#7ac142',3);}break;
 case'ramune':F(R(36,14,28,74,12),'#7fd8ff');F(C(50,30,8),'#e6f8ff',3);F(R(40,10,20,8,3),'#4fd8ff',3);break;
 case'nigiri':F(R(18,52,64,28,14),'#fffafc');F(new Path2D('M14 54 q36 -30 72 0 q-36 10 -72 0z'),'#ff8a65');x.strokeStyle='#fff';x.lineWidth=3;for(let i=0;i<3;i++){x.beginPath();x.moveTo(30+i*14,46);x.lineTo(38+i*14,56);x.stroke();}break;
 case'maki':for(const [cx,cy] of[[32,58],[66,58],[50,34]]){F(C(cx,cy,17),'#2b4a2b');F(C(cx,cy,12),'#fffafc',2);F(C(cx,cy,5),'#ff8a65',2);}break;
 case'tamago':F(R(18,52,64,26,12),'#fffafc');F(R(16,30,68,26,6),'#ffd34d');F(R(44,28,12,52,3),'#2b4a2b',2);break;
 case'tea':F(new Path2D('M22 34 h56 l-6 46 q-22 10 -44 0z'),'#9fd68a');F(new Path2D('M26 40 h48 l-1 8 h-46z'),'#5aa34a',2);x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.moveTo(40,26);x.quadraticCurveTo(36,16,44,10);x.moveTo(56,26);x.quadraticCurveTo(52,16,60,10);x.stroke();break;
 case'ramen':F(new Path2D('M10 46 h80 q-4 40 -40 40 q-36 0 -40 -40z'),'#e23b3b');F(new Path2D('M14 46 h72 q-4 8 -36 8 q-32 0 -36 -8z'),'#f2c46a',3);x.strokeStyle='#fff6b0';x.lineWidth=3;for(let i=0;i<4;i++){x.beginPath();x.moveTo(24+i*14,48);x.quadraticCurveTo(30+i*14,40,36+i*14,48);x.stroke();}F(C(66,42,8),'#fff',2);F(C(66,42,4),'#ffb020',1);F(R(28,30,14,16,3),'#2b4a2b',2);break;
 case'gyoza':for(let i=0;i<3;i++)F(new Path2D(`M${14+i*24} 62 q14 -36 28 0 z`),'#f6dca0');x.strokeStyle='#c8955a';x.lineWidth=2;for(let i=0;i<3;i++){x.beginPath();x.moveTo(20+i*24,52);x.lineTo(36+i*24,52);x.stroke();}F(R(10,62,80,10,5),'#fff');break;
 case'egg':F(new Path2D('M50 14 q30 30 24 50 q-6 22 -24 22 q-18 0 -24 -22 q-6 -20 24 -50z'),'#c8955a');F(C(50,58,14),'#ffb020',3);break;
 case'latte':F(R(22,30,52,52,10),'#fffafc');F(new Path2D('M74 42 q16 4 0 20'),'#fffafc');F(new Path2D('M26 34 h44 v8 h-44z'),'#c8955a',2);F(heartP(48,38,6),'#fff',1);break;
 case'croissant':F(new Path2D('M10 64 q14 -40 40 -40 q26 0 40 40 q-16 -10 -24 -6 q-8 -16 -16 -16 q-8 0 -16 16 q-8 -4 -24 6z'),'#e8a34a');x.strokeStyle='#a0622a';x.lineWidth=3;x.beginPath();x.moveTo(36,32);x.lineTo(40,52);x.moveTo(64,32);x.lineTo(60,52);x.stroke();break;
 case'cupcake':F(new Path2D('M26 56 h48 l-6 30 h-36z'),'#7ee8c6');F(new Path2D('M20 58 q0 -30 30 -30 q30 0 30 30z'),'#ff9fca');F(C(50,24,7),'#e23b3b',3);break;
 case'macaron':F(R(20,24,60,20,10),'#b39dff');F(R(22,42,56,10,5),'#fff6e0',2);F(R(20,50,60,20,10),'#b39dff');break;
 case'baguette':x.save();x.translate(50,50);x.rotate(-.6);F(R(-44,-12,88,24,12),'#e8a34a');x.strokeStyle='#a0622a';x.lineWidth=3;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(i*16-6,-8);x.lineTo(i*16+6,8);x.stroke();}x.restore();break;
 case'soup':F(new Path2D('M12 44 h76 q-4 38 -38 38 q-34 0 -38 -38z'),'#8e5a3a');F(R(16,38,68,12,6),'#e8a34a',3);F(C(36,42,5),'#fff6b0',1);F(C(62,42,6),'#fff6b0',1);break;
 case'crepe':F(new Path2D('M20 20 L80 26 L50 88 z'),'#f6dca0');F(new Path2D('M24 22 q30 -12 56 4 q-26 10 -56 -4z'),'#fff');F(C(46,24,6),'#e23b3b',2);F(C(60,24,6),'#e23b3b',2);break;
 case'cheese':F(new Path2D('M12 70 L80 30 L88 70 z'),'#ffd34d');x.fillStyle='#e8b020';x.fill(C(50,60,6));x.fill(C(72,56,4));x.fill(C(34,66,3));break;
 case'juice':F(new Path2D('M30 20 h40 l-6 66 h-28z'),'#ff9a2e');F(C(66,22,10),'#ffd34d',3);x.strokeStyle='#e23b3b';x.lineWidth=4;x.beginPath();x.moveTo(52,22);x.lineTo(60,6);x.stroke();break;
 case'fish':F(new Path2D('M6 66 q44 22 88 0 q-44 10 -88 0z'),'#fffafc');F(new Path2D('M24 54 q20 -18 40 0 l12 -8 v16 l-12 -8 q-20 18 -40 0z'),'#ff8a65');F(C(30,52,2),'#2b2233',1);break;
 case'steak':F(new Path2D('M6 68 q44 22 88 0 q-44 10 -88 0z'),'#fffafc');F(new Path2D('M22 60 q4 -24 30 -22 q26 2 24 22 q-26 10 -54 0z'),'#8a3a2a');x.strokeStyle='#5a2a1a';x.lineWidth=3;x.beginPath();x.moveTo(32,50);x.lineTo(42,56);x.moveTo(50,46);x.lineTo(60,52);x.stroke();break;
 case'dessert':F(new Path2D('M6 72 q44 20 88 0 q-44 8 -88 0z'),'#fffafc');F(R(32,40,36,30,6),'#8a4a2a');F(R(30,34,40,10,5),'#ff9fca',3);F(C(50,28,6),'#e23b3b',2);spark(x,72,24,6);break;
 case'wine':F(new Path2D('M30 16 h40 q0 34 -20 36 q-20 -2 -20 -36z'),'#a3102a');x.strokeStyle='#ccd';x.lineWidth=4;x.beginPath();x.moveTo(50,52);x.lineTo(50,82);x.moveTo(36,84);x.lineTo(64,84);x.stroke();break;
 case'garnish':for(let i=0;i<3;i++){x.save();x.translate(50,58);x.rotate(-1+i);F(new Path2D('M0 0 q-14 -20 0 -40 q14 20 0 40z'),'#3fae5a',3);x.restore();}F(C(50,60,6),'#e23b3b',2);break;}}
const FOODIMG={};function foodImg(id){if(FOODIMG[id])return FOODIMG[id];const c=document.createElement('canvas');c.width=c.height=112;const x=c.getContext('2d');x.translate(6,6);foodArt(x,id);FOODIMG[id]=c;c.url=c.toDataURL();return c;}
// stall backdrops
function stallBG(k,t){const x=X,cy=H*.5;
 const P={yaki:['#1a1030','#3a1a2a','#a0622a'],sushi:['#e6f2ff','#bcd8f0','#c8955a'],ramen:['#5a1010','#8a2a1a','#6a3a1a'],cafe:['#ffe6f0','#fff6e0','#e8b896'],bistro:['#2a4a3a','#3a6a4a','#8a5a3a'],fine:['#1a0a2a','#2a1a3a','#fffafc']}[k];
 let g=x.createLinearGradient(0,0,0,cy);g.addColorStop(0,P[0]);g.addColorStop(1,P[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
 if(k==='yaki'){for(let i=0;i<5;i++){const lx=W*(.1+i*.2),ly=H*.12+Math.sin(t*2+i)*3;fillP(x,new Path2D(`M${lx-16} ${ly} q16 -10 32 0 v34 q-16 10 -32 0z`),'#e23b3b','#e23b3b',3);x.fillStyle='#ffe58a88';x.fill(circP(lx,ly+16,22));x.fillStyle='#fff';x.font='900 14px '+FONT;x.textAlign='center';x.fillText('焼',lx,ly+22);}
  for(let i=0;i<6;i++){x.globalAlpha=.25;x.fillStyle='#fff';x.fill(circP(W*.5+Math.sin(t+i)*30,cy-((t*40+i*30)%120),10+i));}x.globalAlpha=1;}
 if(k==='sushi'||k==='ramen'){const nc=k==='sushi'?'#2c3e8f':'#2b2233';for(let i=0;i<5;i++){fillP(x,rrP(W*(i/5)+2,H*.08,W/5-4,H*.12,4),nc,nc,2);}x.fillStyle='#fff';x.font='900 '+Math.round(W*.06)+'px '+FONT;x.textAlign='center';x.fillText(k==='sushi'?'寿 司':'ら ー め ん',W/2,H*.16);
  if(k==='ramen')for(let i=0;i<5;i++){x.globalAlpha=.2;x.fillStyle='#fff';x.fill(circP(W*(.2+i*.15),cy-((t*30+i*40)%140),14));}x.globalAlpha=1;}
 if(k==='cafe'){for(let i=0;i<8;i++){x.fillStyle=i%2?'#ffd6ea':'#fff0f7';x.fillRect(i*W/8,0,W/8,cy);}fillP(x,rrP(W*.3,H*.06,W*.4,H*.14,10),'#2b3a2b','#5a3a1a',6);x.fillStyle='#fff';x.font='800 '+Math.round(W*.045)+'px '+FONT;x.textAlign='center';x.fillText('☕ CAFÉ ♥',W/2,H*.14);}
 if(k==='bistro'){for(let i=0;i<8;i++){x.fillStyle=i%2?'#e23b3b':'#fff';x.beginPath();x.moveTo(i*W/8,0);x.lineTo((i+1)*W/8,0);x.lineTo((i+1)*W/8,H*.1);x.quadraticCurveTo((i+.5)*W/8,H*.14,i*W/8,H*.1);x.fill();}x.fillStyle='#ffe58a';x.font='italic 900 '+Math.round(W*.06)+'px Georgia,serif';x.textAlign='center';x.fillText('Bistro Pinco',W/2,H*.2);}
 if(k==='fine'){for(const cx of[.25,.75]){x.strokeStyle='#ffcc33';x.lineWidth=2;x.beginPath();x.moveTo(W*cx,0);x.lineTo(W*cx,H*.06);x.stroke();for(let j=-2;j<=2;j++){x.fillStyle='#fff6b0';x.fill(circP(W*cx+j*12,H*.08,4+Math.sin(t*4+j)));}spark(x,W*cx,H*.09,9);}x.fillStyle='#ffcc33';x.font='italic 900 '+Math.round(W*.055)+'px Georgia,serif';x.textAlign='center';x.fillText('Le Petit Pinco ★★★',W/2,H*.2);}
 // counter
 g=x.createLinearGradient(0,cy,0,H);g.addColorStop(0,P[2]);g.addColorStop(1,sh(P[2],-.35));x.fillStyle=g;x.fillRect(0,cy,W,H-cy);x.fillStyle=sh(P[2],.3);x.fillRect(0,cy,W,10);
 if(k==='fine'){x.fillStyle='#fffafc';x.fillRect(0,cy,W,24);}
 counterDecor(k,t,cy);}
function counterDecor(k,t,cy){const x=X,fs=STALLS[k].foods;const y0=cy+H*.05;
 if(k==='yaki'||k==='ramen'){fillP(x,rrP(W*.08,y0,W*.84,H*.09,10),'#3a3a3a','#222',4);for(let i=0;i<7;i++){x.fillStyle='rgba(255,'+(90+Math.sin(t*8+i)*40|0)+',40,.8)';x.fillRect(W*.11+i*W*.115,y0+H*.065,W*.08,6);}}
 else{fillP(x,rrP(W*.06,y0+H*.03,W*.88,H*.06,30),'#fffafc','#d6dbe6',3);}
 fs.forEach((f,i)=>{const s=Math.min(W*.16,H*.08),px=W*(.1+.8*(i+.5)/fs.length)-s/2;x.drawImage(foodImg(f),px,y0-s*.15+Math.sin(t*2+i)*2,s,s);});
 for(let i=0;i<3;i++){x.save();x.globalAlpha=.18;x.fillStyle='#fff';x.fill(circP(W*(.2+i*.3)+Math.sin(t+i)*14,y0-((t*30+i*50)%90),10+i*3));x.restore();}}
// ---- shift state ----
let SV=null;
const CUST_COL=['#ffcc33','#7ee8c6','#b39dff','#4fd8ff','#ff8a65','#fffafc','#ff9fca','#8fd14f'];
function startServe(k){const st0=STALLS[k],lv=st0.lv,chOdd=S.story.ch%2;scene='serve';st=0;show('s-serve');playSong('dress');
 SV={k,lv,foods:st0.foods,time:60+lv*5,left:60+lv*5,cust:[null,null,null],tray:[],cook:{},next:1.2,served:0,angry:0,coins:0,tips:0,combo:0,best:0,pops:[],
  pat:Math.max(12,24-lv*2-chOdd*1.5),gap:Math.max(2.6,6.2-lv*.6-chOdd*.4),maxN:lv<2?3:4,done:0,tut:!S.story.tutServe};
 $('sv-name').textContent='🍽️ '+T('st_'+k);renderFoods();renderTray();updSV();
 if(SV.tut){PAUSED=true;tutorial(T('serveTut'),[T('tut1'),T('tut2'),T('tut3'),T('tut4')],()=>{S.story.tutServe=1;save();PAUSED=false;});}}
function renderFoods(){$('sv-foods').style.gridTemplateColumns='repeat('+(SV.foods.length>4?3:SV.foods.length===4?4:3)+',1fr)';$('sv-foods').innerHTML=SV.foods.map(f=>'<button class="food'+(FOODS[f][2]?' ck':'')+'" data-food="'+f+'"><img src="'+foodImg(f).url+'" alt=""><span>'+FN(f)+'</span><i></i></button>').join('');}
function renderTray(){$('sv-tray').innerHTML=(SV.tray.length?SV.tray.map(f=>'<img src="'+foodImg(f).url+'">').join(''):'<span class="lbl0">'+L2('Tray — tap foods ↓','トレー — 下の料理をタップ ↓')+'</span>')+'<button class="trash" data-a="svtrash">🗑</button>';}
function updSV(){$('sv-time').textContent=Math.ceil(Math.max(0,SV.left))+'s';$('sv-bar').style.width=Math.max(0,SV.left/SV.time*100)+'%';$('sv-coins').textContent=SV.coins;}
function makeOrder(){const lv=SV.lv,fs=SV.foods.filter(f=>f!=='garnish');const n=1+Math.floor(Math.random()*Math.min(SV.maxN,1+lv*.6+st/40));const o={};
 for(let i=0;i<n;i++){const f=pk(fs);o[f]=(o[f]||0)+1;}if(SV.k==='fine'){const mains=Object.keys(o).filter(f=>f==='fish'||f==='steak'||f==='dessert').reduce((a,f)=>a+o[f],0);if(mains)o.garnish=Math.min(2,mains);}return o;}
function spawnCust(){const free=SV.cust.map((c,i)=>c?null:i).filter(i=>i!==null);if(!free.length)return;const i=pk(free);const critic=SV.k==='fine'&&Math.random()<.35;
 const cast=Math.random()<.12?pk(['party','holiday','baller','mole','tad','leaf','bean','pooh']):null;
 SV.cust[i]={o:makeOrder(),pat:SV.pat*(critic?.75:1)*(SV.tut&&SV.served===0?2.5:1),p0:0,t:0,col:pk(CUST_COL),ears:Math.floor(Math.random()*3),cast,critic,leave:0};SV.cust[i].p0=SV.cust[i].pat;}
function custRect(i){const w=W/3;return{x:i*w+4,y:H*.17,w:w-8,h:H*.36};}
SC3.serve=function(t,dt){if(!SV)return;stallBG(SV.k,t);const run=!PAUSED&&!SV.done;
 if(run){SV.left-=dt;SV.next-=dt;if(SV.next<=0&&SV.left>4){spawnCust();SV.next=SV.gap*(.7+Math.random()*.6);}
  for(const f in SV.cook){SV.cook[f]-=dt;const b=document.querySelector('[data-food="'+f+'"]');if(b){b.classList.add('cook');b.querySelector('i').style.width=Math.max(0,100-SV.cook[f]/FOODS[f][2]*100)+'%';}if(SV.cook[f]<=0){delete SV.cook[f];if(b){b.classList.remove('cook');b.querySelector('i').style.width='0';}addTray(f,1);}}
  updSV();if(SV.left<=0)endShift();}
 for(let i=0;i<3;i++){const c=SV.cust[i];if(!c)continue;if(run&&!c.leave){c.pat-=dt;if(c.pat<=0){c.leave=-1;SV.angry++;SV.combo=0;SFX.angry();svPop(i,T('hmph'),'#e23b3b');}}c.t+=dt;if(c.leave){c.lt=(c.lt||0)+dt;if(c.lt>.7){SV.cust[i]=null;continue;}}
  drawCust(c,custRect(i),t);}
 for(const p of SV.pops){p.t+=dt;X.save();X.globalAlpha=Math.max(0,1-p.t/1.2);X.font='900 '+Math.round(W*.05)+'px '+FONT;X.textAlign='center';X.lineWidth=5;X.strokeStyle='#fff';X.fillStyle=p.c;X.strokeText(p.s,p.x,p.y-p.t*40);X.fillText(p.s,p.x,p.y-p.t*40);X.restore();}SV.pops=SV.pops.filter(p=>p.t<1.2);
 if(SV.combo>=2){X.save();X.textAlign='center';X.font='900 '+Math.round(W*.06)+'px '+FONT;X.fillStyle='#ff3d8b';X.strokeStyle='#fff';X.lineWidth=6;const s=T('combo',SV.combo);X.strokeText(s,W/2,H*.18);X.fillText(s,W/2,H*.18);X.restore();}};
function drawCust(c,r,t){const x=X,cx=r.x+r.w/2,lv=c.leave?Math.min(1,c.lt/.7):0,ent=Math.min(1,c.t*3),by=r.y+r.h+(1-ent)*60+lv*80;x.save();x.globalAlpha=ent*(1-lv);
 const angry=c.pat/c.p0<.3,hop=Math.abs(Math.sin(t*(angry?14:4)))*(angry?6:3);
 if(c.cast){drawCut(x,c.cast,cx,by-hop,r.h*.7,t);}else{const hr=r.w*.27,hy=by-r.h*.42-hop;x.fillStyle=c.col;x.beginPath();x.ellipse(cx,by-r.h*.02,r.w*.36,r.h*.26,0,Math.PI,0);x.fill();
  if(c.ears===0){x.fill(circP(cx-hr*.75,hy-hr*.8,hr*.35));x.fill(circP(cx+hr*.75,hy-hr*.8,hr*.35));}else if(c.ears===1){x.beginPath();x.ellipse(cx-hr*.45,hy-hr*1.2,hr*.2,hr*.6,-.2,0,7);x.ellipse(cx+hr*.45,hy-hr*1.2,hr*.2,hr*.6,.2,0,7);x.fill();}else{x.beginPath();x.moveTo(cx-hr*.9,hy-hr*.3);x.lineTo(cx-hr*.6,hy-hr*1.3);x.lineTo(cx-hr*.1,hy-hr*.7);x.moveTo(cx+hr*.9,hy-hr*.3);x.lineTo(cx+hr*.6,hy-hr*1.3);x.lineTo(cx+hr*.1,hy-hr*.7);x.fill();}
  fillP(x,circP(cx,hy,hr),c.col,c.col,3);x.fillStyle='#2b2233';x.fill(circP(cx-hr*.35,hy-hr*.05,hr*.12));x.fill(circP(cx+hr*.35,hy-hr*.05,hr*.12));x.strokeStyle='#2b2233';x.lineWidth=3;x.beginPath();if(angry)x.arc(cx,hy+hr*.5,hr*.22,Math.PI+.3,-.3);else x.arc(cx,hy+hr*.25,hr*.22,.3,Math.PI-.3);x.stroke();
  if(angry){x.beginPath();x.moveTo(cx-hr*.55,hy-hr*.4);x.lineTo(cx-hr*.15,hy-hr*.25);x.moveTo(cx+hr*.55,hy-hr*.4);x.lineTo(cx+hr*.15,hy-hr*.25);x.stroke();}
  x.fillStyle='rgba(255,110,160,.5)';x.fill(circP(cx-hr*.6,hy+hr*.25,hr*.15));x.fill(circP(cx+hr*.6,hy+hr*.25,hr*.15));
  if(c.critic){x.strokeStyle='#ffcc33';x.lineWidth=3;x.stroke(circP(cx+hr*.35,hy-hr*.05,hr*.25));x.beginPath();x.moveTo(cx+hr*.6,hy);x.lineTo(cx+hr*.7,hy+hr*.8);x.stroke();fillP(x,rrP(cx-hr*.7,hy-hr*1.35,hr*1.4,hr*.3,4),'#2b2233','#2b2233',2);fillP(x,rrP(cx-hr*.45,hy-hr*1.9,hr*.9,hr*.6,4),'#2b2233','#2b2233',2);}}
 // order bubble
 const items=Object.entries(c.o);const bw=r.w,bh=Math.min(r.h*.44,30+items.length*0)+4,bx=r.x,byy=r.y-4;x.globalAlpha=ent*(1-lv);
 fillP(x,rrP(bx,byy,bw,bh+18,14),c.critic?'#fff6e0':'#fff',c.critic?'#c48a00':'#ff7eb6',3);
 const isz=Math.min((bw-10)/Math.max(2,items.length)-14,bh-8);items.forEach(([f,n],j)=>{const ix=bx+6+j*(isz+16);x.drawImage(foodImg(f),ix,byy+5,isz,isz);x.fillStyle='#5a2a6a';x.font='900 '+Math.round(isz*.42)+'px '+FONT;x.textAlign='left';x.fillText('×'+n,ix+isz-4,byy+isz+2);});
 if(c.critic){x.fillStyle='#c48a00';x.font='900 10px '+FONT;x.textAlign='right';x.fillText(T('critic'),bx+bw-8,byy+bh+13);}
 const pf=Math.max(0,c.pat/c.p0);fillP(x,rrP(bx+8,byy+bh+6,bw*.6,8,4),'#eee','#ccc',1);x.fillStyle=pf>.5?'#22b35a':pf>.25?'#ffb020':'#e23b3b';x.beginPath();x.roundRect?x.roundRect(bx+8,byy+bh+6,bw*.6*pf,8,4):x.rect(bx+8,byy+bh+6,bw*.6*pf,8);x.fill();x.restore();}
function svPop(i,s,c){const r=custRect(i);SV.pops.push({s,x:r.x+r.w/2,y:r.y+r.h*.5,t:0,c});}
function addTray(f,silent){if(SV.tray.length>=6){toast(T('trayfull'));SFX.bad();return;}SV.tray.push(f);renderTray();if(!silent)SFX.tap();else SFX.equip();}
function serveTo(i){const c=SV.cust[i];if(!c||c.leave)return;if(!SV.tray.length){SFX.bad();return;}const cnt={};SV.tray.forEach(f=>cnt[f]=(cnt[f]||0)+1);const ok=Object.keys(c.o).length===Object.keys(cnt).length&&Object.entries(c.o).every(([f,n])=>cnt[f]===n);
 if(!ok){SFX.bad();buzz(30);svPop(i,T('wrong'),'#e23b3b');SV.combo=0;c.pat-=2;SV.tray=[];renderTray();return;}
 const n=SV.tray.length,pf=c.pat/c.p0;SV.combo++;SV.best=Math.max(SV.best,SV.combo);const tip=Math.round(pf*5*(c.critic?2:1));const cb=SV.combo>=3?Math.min(8,SV.combo):0;const earn=2*n+tip+cb;
 SV.coins+=earn;SV.tips+=tip;SV.served++;c.leave=1;SV.tray=[];renderTray();SFX.coin();SFX.buy();buzz(12);const r=custRect(i);burst(r.x+r.w/2,r.y+r.h*.5,16,['#ffcc33','#fff'],140);svPop(i,'+'+earn+(SV.combo>=3?' 🔥':''),'#22b35a');if(SV.combo>=3)SFX.sparkle();updSV();}
function endShift(){SV.done=1;stopSong();SFX.fan();S.story.coins+=SV.coins;save();setSCoins();
 tutorial(T('shiftover'),['🍽️ '+T('served',SV.served),'😤 '+T('angry',SV.angry),'💁 '+T('tips',SV.tips),'🔥 '+T('combo',SV.best),'<b style="font-size:20px;color:#c48a00">🪙 '+T('earned',SV.coins)+'</b>'],()=>{SV=null;S.story.stage='shop';storyGo();});}
document.addEventListener('click',e=>{const b=e.target.closest('[data-food]');if(b&&SV&&!SV.done&&!PAUSED){const f=b.dataset.food;if(FOODS[f][2]){if(SV.cook[f]!=null){toast(T('cooking'));return;}SV.cook[f]=FOODS[f][2];SFX.stamp();}else addTray(f);return;}
 const t2=e.target.closest('[data-a="svtrash"]');if(t2&&SV){SV.tray=[];renderTray();SFX.tap();}});
cv.addEventListener('pointerdown',e=>{if(scene!=='serve'||!SV||SV.done||PAUSED)return;for(let i=0;i<3;i++){const r=custRect(i);if(e.clientX>r.x&&e.clientX<r.x+r.w&&e.clientY>r.y-10&&e.clientY<r.y+r.h+20){serveTo(i);return;}}});
