// ===== v1.1: title waltz, photo judges, home buttons, Pooh Bank =====
// ---------- title song: music box + harp + pads + chimes, 3/4 in D major, 32 bars (~69s loop) ----------
{const C={D:[62,66,69],G:[62,67,71],A:[61,64,69],Bm:[62,66,71],Em:[64,67,71],Fm:[61,66,69]},RT={D:38,G:43,A:45,Bm:47,Em:40,Fm:42};
 const A=['D','D','G','A','Bm','G','Em','A'],A2=['D','Fm','G','D','Bm','Em','A','D'],B=['G','A','Fm','Bm','G','D','Em','A'];
 const mA=[[81,0,0,0,78,81],[86,0,0,0,85,83],[83,0,0,0,79,83],[85,0,0,0,81,0],[83,0,0,0,78,83],[86,0,83,0,79,0],[79,0,0,0,76,79],[81,0,0,0,0,0]];
 const mA2=[[81,0,0,0,78,81],[85,0,0,0,81,85],[86,0,0,0,83,86],[88,0,86,0,81,0],[83,0,86,0,83,0],[79,0,83,0,79,0],[81,0,85,0,88,0],[86,0,0,0,0,0]];
 const mB=[[83,0,86,0,91,0],[88,0,0,0,85,0],[85,0,88,0,90,0],[86,0,0,0,83,0],[83,0,86,0,91,0],[90,0,88,0,86,0],[88,0,86,0,83,0],[85,0,0,0,81,0]];
 SONGS.title={waltz:1,bpm:84,bars:[...A,...A2,...B,...A2].map(k=>({ch:C[k],r:RT[k]})),mel:[...mA,...mA2,...mB,...mA2]};}
function mbox(f,t,v,bus,fx){const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),g2=AC.createGain();o.type='sine';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*3.01;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0005,t+1.6);g2.gain.setValueAtTime(v*.25,t);g2.gain.exponentialRampToValueAtTime(.0005,t+.35);
 o.connect(g);o2.connect(g2);g.connect(bus);g2.connect(bus);if(fx){g.connect(fx);}o.start(t);o2.start(t);o.stop(t+1.7);o2.stop(t+.4);}
function harp(f,t,v,bus){const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();o.type='triangle';o.frequency.value=f;lp.type='lowpass';lp.frequency.setValueAtTime(4200,t);lp.frequency.exponentialRampToValueAtTime(900,t+.9);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0005,t+1.1);o.connect(lp);lp.connect(g);g.connect(bus);o.start(t);o.stop(t+1.2);}
function pad(notes,t,d,bus){for(const n of notes)for(const det of[-6,6]){const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=mf(n);o.detune.value=det;lp.type='lowpass';lp.frequency.value=800;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.014,t+d*.35);g.gain.linearRampToValueAtTime(0,t+d*1.05);o.connect(lp);lp.connect(g);g.connect(bus);o.start(t);o.stop(t+d*1.1);}}
function chime(f,t,v,bus){[1,2.76,5.4].forEach((m,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f*m;g.gain.setValueAtTime(v/(i+1),t);g.gain.exponentialRampToValueAtTime(.0005,t+2.4/(i+1));o.connect(g);g.connect(bus);o.start(t);o.stop(t+2.5);});}
function waltzTick(T){const s=T.s,sp=60/s.bpm/2,now=AC.currentTime;while(T.nextT<now+.2){const t=T.nextT,i=T.step%6,bi=Math.floor(T.step/6)%s.bars.length,b=s.bars[bi];
 if(i===0){tone(mf(b.r),t,1.2,'sine',.22,T.bus);tone(mf(b.r),t,.6,'triangle',.08,T.bus);pad(b.ch.map(n=>n-12),t,sp*6,T.bus);if(bi%4===0)chime(mf(b.ch[0]+24),t,.05,T.bus);}
 if(i===2||i===4){b.ch.forEach(n=>harp(mf(n),t,.035,T.bus));}
 harp(mf([b.ch[0],b.ch[1],b.ch[2],b.ch[0]+12,b.ch[1]+12,b.ch[2]+12][i]),t+.02,.04,T.bus);
 const m=s.mel[bi][i];if(m)mbox(mf(m),t,.13,T.bus,T.fx);
 if(bi%8===7&&i===3)for(let k=0;k<6;k++)mbox(mf(86+[0,2,4,7,9,12][k]),t+k*.07,.04,T.bus);
 T.nextT+=sp;T.step++;}}
// first tap starts the title song (iOS needs a gesture)
addEventListener('pointerdown',()=>{const first=!AC;audio();if(AC&&AC.state==='suspended')AC.resume();if((scene==='title'||scene==='theme'||scene==='bank')&&!TR.some(t=>!t.dead))playSong(scene==='bank'?'title':'title');},{capture:true});
// ---------- photo judges ----------
const JIMG={};['bean','kermit','pooh','king'].forEach(n=>{const i=new Image();i.src='art/j_'+n+'.png?v2';JIMG[n]=i;});
JUDGES.length=0;JUDGES.push(
 {n:'Emo Bean',nj:'エモ・ビーン',img:'bean',r:'Vibes',rj:'バイブス',c:'#8fd14f',h:150,
  lines:[["It's okay… the void hugs us both","My heart is a rainy pod… but I believe in you"],["Kinda dark… kinda cute… like me","It hurts, but softly. Good try"],["This look gets my sad little soul","Nice vibes… I'm almost not sad"],["I wrote a sad poem about it. It's beautiful","Ugh. I'm crying. In a good way"],["You healed my emo heart 🖤💚","Perfect vibes… even my bangs are happy"]],
  lj:[['だいじょうぶ…闇がふたりを包むよ','心は雨のさや…でも信じてる'],['ちょっと暗い…ちょっとかわいい…ぼくみたい','痛いけど、やさしい。がんばったね'],['このコーデ、ぼくの悲しい魂にひびく','いいバイブス…ちょっと元気出た'],['悲しい詩を書いたよ。美しいんだ','うっ…泣いてる。いい意味で'],['エモい心が癒された 🖤💚','完璧なバイブス…前髪までうれしい']]},
 {n:'Dark Kermit',nj:'ダーク・カーミット',img:'kermit',r:'Critique',rj:'辛口',c:'#2b2233',h:150,
  lines:[['A TRAGEDY.','I must lie down.','Hideous. Next!'],['Mediocre. Ugh.','The swamp weeps.'],['Acceptable… barely.','Hmph. Fine.'],['I am… almost moved.','Not terrible. Shocking.'],['MAGNIFICENT! *faints*','I take back every word!']],
  lj:[['悲劇だ。','横にならせてくれ…','ひどい。次！'],['平凡。うぅ。','沼が泣いている。'],['まあ…ギリ合格。','ふん。いいだろう。'],['私が…感動しかけた。','悪くない。おどろいた。'],['すばらしい！*気絶*','前言撤回だ！']]},
 {n:'Pooh',nj:'プーさん',img:'pooh',r:'Yum Factor',rj:'おいしさ',c:'#ffcc33',h:160,
  lines:[['Oh bother… is it lunch?','I like it! …I think?'],['Pretty! Got any honey?','Ooh, sparkly…'],['Yummy outfit!','Lovely! Like honey!'],['Oh my! Delicious!','Hunny-licious!'],['BEST THING EVER!!','Sweeter than hunny! 🍯']],
  lj:[['やれやれ…お昼ごはん？','好き！…たぶん？'],['かわいい！はちみつある？','わあ、キラキラ…'],['おいしそうなコーデ！','すてき！はちみつみたい！'],['わあ！おいしそう！','はちみつ級！'],['さいこう！！','はちみつよりあまい！🍯']]});
const BUNDLES_JA=['おためし壺','はちみつびん','人気No.1','いちばんお得','メガ巣箱','王家の宝物庫'];
const KING_LINES_JA=['王家のファッションには王家のコインを！','王の命令じゃ：タダである！','プリンセスたるもの、コイン切れはならぬ。','持っていきなさい、宝物庫は底なしじゃ！','はちみつもコインも？ なんという王国！','かしこく使うのじゃ…いや、使っちゃえ！ホッホー！'];
const KL=()=>LANG()==='ja'?KING_LINES_JA:KING_LINES;
const pk=a=>a[Math.floor(Math.random()*a.length)];
score=function(o,t){const worn=CATS.map(c=>o[c[0]]).filter(Boolean);let match=0;
 for(const id of worn){const it=IT[id];const w=it.c==='bg'?2:1;if(it.tags.includes(t.id))match+=w;else if(it.tags.includes('sparkle')&&['royal','pop','space','swamp'].includes(t.id))match+=.4*w;}
 const themeS=Math.min(1,match/8);
 const cl=worn.filter(id=>IT[id].c!=='bg');let cs=0;for(const id of cl){const d=Math.min(...t.p.map(p=>hexd(col(o,id),p)));cs+=d<60?1:d<120?.5:0;}
 const colorS=cl.length?cs/cl.length*Math.min(1,cl.length/5):0;
 const tinted=cl.filter(id=>o.tint[id]&&o.tint[id]!==IT[id].col).length;
 const creS=.35*(worn.length/8)+.4*Math.min(1,o.stamps.length/12)+.25*(cl.length?Math.min(1,tinted/Math.max(3,cl.length*.6)):0);
 const sweet=worn.filter(id=>IT[id].tags.some(g=>g==='honey'||g==='sweet')).length;
 const raw=[.45*colorS+.3*themeS+.25*creS, .4*themeS+.35*creS+.25*colorS-(o.stamps.length<10?.08:0)-(tinted<3?.08:0), .5*themeS+.25*colorS+.25*creS+(sweet>=2?.1:0)];
 const base=[.7,-.45,.8],mul=[4.4,4.8,4.2];
 const stars=raw.map((v,i)=>Math.max(1,Math.min(5,Math.round(base[i]+v*mul[i]+(Math.random()-.5)*.3))));
 const tot=stars[0]+stars[1]+stars[2];const coins=5+tot*2+(tot>=13?10:0);
 const low=Math.min(themeS,colorS,creS);const tip=low===themeS?T('tiptheme',THN(t)):low===colorS?T('tipcol'):T('tipcre');
 const say=stars.map((s,i)=>pk((LANG()==='ja'?JUDGES[i].lj:JUDGES[i].lines)[s-1]));
 return{stars,coins,tip,say,themeS,colorS,creS};};
drawJudge=function(x,j,cx,cy,s,t,stars,shown,say,idx){const im=JIMG[j.img];const H0=j.h*s,ratio=im.naturalWidth?im.naturalWidth/im.naturalHeight:.7,W0=H0*ratio;
 const rev=RUN&&RUN.jt&&RUN.jt[idx]?Math.max(0,1-(t-RUN.jt[idx])*3):0;
 const harsh=idx===1&&stars&&shown>.9&&stars<=2;const jit=harsh?Math.sin(t*40)*3:0;
 const bob=Math.abs(Math.sin(t*(idx===2?5:3.2)+idx))*6*s;const sq=1+rev*.12;
 x.save();x.translate(cx+jit,cy+70*s);
 
 // paddle rises from behind the judge
 if(stars){const up=Math.min(1,shown*2.2),e=1-Math.pow(1-up,3);const py=-H0-30*s-e*40*s+(1-e)*H0*.8;x.save();x.strokeStyle='#8a5a3c';x.lineWidth=6*s;x.beginPath();x.moveTo(W0*.3,-H0*.35);x.lineTo(0,py+70*s);x.stroke();
  x.translate(0,py);x.rotate(Math.sin(t*3+idx)*.04);x.scale(s,s);fillP(x,rrP(-58,0,116,70,16),'#fff',j.c==='#2b2233'?'#5a2a6a':j.c,4);x.fillStyle=idx===1?'#2b2233':'#ff3d8b';x.font='800 15px ui-rounded,"Arial Rounded MT Bold",system-ui';x.textAlign='center';x.fillText(LANG()==='ja'?j.rj:j.r.toUpperCase(),0,20);
  for(let i=0;i<5;i++){const on=i<Math.min(stars,Math.floor(shown*6));x.fillStyle=on?'#ffcc33':'#eee';x.fill(starP(-40+i*20,46,10));x.strokeStyle=on?'#c48a00':'#ccc';x.lineWidth=2;x.stroke(starP(-40+i*20,46,10));}x.restore();}
 x.translate(0,-bob);x.scale(1/sq*(1+rev*.05),sq);x.rotate(Math.sin(t*2+idx*2)*.03);
 if(im.naturalWidth)x.drawImage(im,-W0/2,-H0,W0,H0);x.restore();
 x.save();x.font='800 '+Math.round(11.5*s/.85)+'px ui-rounded,"Arial Rounded MT Bold",system-ui';x.textAlign='center';x.fillStyle=idx===1?'#2b2233':'#5a2a6a';x.fillText(LANG()==='ja'?j.nj:j.n,cx,cy+90*s);x.restore();
 if(say){x.save();x.font='800 '+Math.round(12*s/.85)+'px ui-rounded,"Arial Rounded MT Bold",system-ui';let fs=Math.round(12*s/.85);x.font='800 '+fs+'px ui-rounded,system-ui';while(x.measureText(say).width+14>W/3-4&&fs>8){fs--;x.font='800 '+fs+'px ui-rounded,system-ui';}const tw=x.measureText(say).width+14,bx=Math.max(4,Math.min(W-tw-4,cx-tw/2)),by=cy+96*s;x.fillStyle=idx===1?'#2b2233':'#fff';x.strokeStyle=idx===1?'#8fd14f':'#ff7eb6';x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(bx,by,tw,24,12):x.rect(bx,by,tw,24);x.fill();x.stroke();x.fillStyle=idx===1?'#8fd14f':'#8e44ec';x.textAlign='center';x.fillText(say,bx+tw/2,by+17);x.restore();}};
judging=function(t){bgDraw(X,O,W,H,t);X.fillStyle='rgba(30,0,50,.35)';X.fillRect(0,0,W,H);
 const pl=place(W*.2,H*.05,W*.6,H*.44);X.save();X.translate(pl.ox,pl.oy);X.scale(pl.s,pl.s);drawPinco(X,O);X.restore();
 X.fillStyle='rgba(255,255,255,.92)';X.beginPath();X.roundRect?X.roundRect(8,H*.5,W-16,H*.47,24):X.rect(8,H*.5,W-16,H*.47);X.fill();
 X.textAlign='center';X.fillStyle='#8e44ec';X.font='800 '+Math.round(W*.055)+'px ui-rounded,"Arial Rounded MT Bold",system-ui';X.fillText(T('judgessay'),W/2,H*.5+W*.075);
 const s=Math.min(W/3/140,H*.3/230);RUN.jt=RUN.jt||[];for(let i=0;i<3;i++){const jt=t-.6-i*1.1,shown=Math.max(0,jt);const st=RESULT.stars[i];
  const prev=RUN.jn[i]||0,nowN=Math.min(st,Math.floor(shown*6));if(nowN>prev){for(let q=prev;q<nowN;q++)SFX.judge(q);RUN.jn[i]=nowN;if(nowN===st){RUN.jt[i]=t;burst(W*(i+.5)/3,H*.66,st*4,i===1?['#8fd14f','#2b2233']:['#ffcc33','#fff'],120);buzz(10);if(i===1&&st<=2)SFX.boo();}}
  drawJudge(X,JUDGES[i],W*(i+.5)/3,H*.74,s,t,jt>0?st:0,shown,jt>1?RESULT.say[i]:null,i);}};
// ---------- home buttons + leave confirm ----------
let PAUSED=false;
function askLeave(){if(!['dress','runway','judge'].includes(scene)){goTitle();return;}PAUSED=true;$('confirm').classList.add('on');SFX.tap();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a==='gohome'){askLeave();}else if(a==='stay'){PAUSED=false;$('confirm').classList.remove('on');SFX.tap();}else if(a==='leave'){PAUSED=false;$('confirm').classList.remove('on');SFX.tap();goTitle();}
 else if(a==='bank'){SFX.tap();openBank();}else if(a==='bankx'){SFX.tap();goTitle();}});
// ---------- Pooh Bank ----------
const BUNDLES=[[100,'Starter Pot',1],[500,'Honey Jar',2],[1200,'POPULAR',3],[3000,'BEST VALUE',4],[7500,'Mega Hive',5],[20000,'ROYAL TREASURY',6]];
const KING_LINES=['Royal coins for royal fashion!','By royal decree: it is FREE!','A princess must never run short of coins.','Take them, my dear — the treasury is bottomless!','Hunny AND coins? What a kingdom!','Spend wisely… or don\'t! Ho ho!'];
let bankCD=0;
function coinArt(n){const c=document.createElement('canvas');c.width=180;c.height=110;const x=c.getContext('2d');
 if(n>=6){const p=rrP(30,40,120,62,10);fillP(x,p,lg(x,40,102,'#a0522d'),'#a0522d',4);fillP(x,rrP(26,24,128,26,12),lg(x,24,50,'#c8743a'),'#a0522d',4);x.fillStyle='#ffcc33';x.fillRect(30,46,120,6);x.fillRect(84,40,12,62);for(let i=0;i<9;i++)fillP(x,circP(40+i*12,24-Math.abs(4-i)*3,9),rg(x,40+i*12,20,9,'#ffcc33'),'#c48a00',2);x.fillStyle='#ff3d8b';x.fill(circP(90,70,7));spark(x,140,20,10);spark(x,36,30,7);return c.toDataURL();}
 const stacks=n,cx0=90-(stacks-1)*15;for(let s=0;s<stacks;s++){const h=3+s*2+(s%2)*2,bx=cx0+s*30;for(let i=0;i<h;i++){const y=96-i*7;x.fillStyle='#c48a00';x.beginPath();x.ellipse(bx,y+3,15,6,0,0,7);x.fill();x.fillStyle=rg(x,bx,y,15,'#ffcc33');x.beginPath();x.ellipse(bx,y,15,6,0,0,7);x.fill();}}
 spark(x,150,20,9);spark(x,28,40,6);return c.toDataURL();}
function openBank(){scene='bank';st=0;show('s-bank');setCoins();if(AC)playSong('title');
 $('bank-grid').innerHTML=BUNDLES.map(([n,l,k],i)=>'<div class="bcard'+(k>=3?' hot':'')+(k===6?' royal':'')+'"><b class="rib">'+(LANG()==='ja'?BUNDLES_JA[i]:l)+'</b><img src="'+coinArt(k)+'" alt=""><div class="amt">'+n.toLocaleString('en-US')+'</div><div class="lbl">'+T('coins')+'</div><button class="free" data-buy="'+i+'">'+T('freebtn')+'</button></div>').join('');
 kingSay(KL()[0]);}
function kingSay(t){const d=$('bank-say');d.textContent=t;d.classList.remove('pop');void d.offsetWidth;d.classList.add('pop');}
document.addEventListener('click',e=>{const b=e.target.closest('[data-buy]');if(!b)return;const now=performance.now();if(now<bankCD){SFX.bad();return;}bankCD=now+1000;
 document.querySelectorAll('.free').forEach(f=>{f.classList.add('cd');});setTimeout(()=>document.querySelectorAll('.free').forEach(f=>f.classList.remove('cd')),1000);
 const [n]=BUNDLES[+b.dataset.buy];S.coins+=n;save();coinFly(b,Math.min(26,6+(+b.dataset.buy)*4));kingSay(pk(KL()));buzz(15);
 if(AC){const t0=AC.currentTime;for(let i=0;i<10;i++)tone(mf(88+[0,4,7,12][i%4]),t0+i*.05,.25,'triangle',.12);noise(t0,.5,.12,9000,null,'highpass');}
 let shown=S.coins-n;const step=Math.max(1,Math.ceil(n/30));const iv=setInterval(()=>{shown=Math.min(S.coins,shown+step);document.querySelectorAll('.coins').forEach(e=>e.textContent=shown);if(shown>=S.coins)clearInterval(iv);},25);});
function coinFly(from,k){const r=from.getBoundingClientRect(),tg=$('bank-bal').getBoundingClientRect();for(let i=0;i<k;i++){const c=document.createElement('i');c.className='coinic fly';document.body.appendChild(c);
 const sx=r.left+r.width/2,sy=r.top+r.height/2,mx=sx+(Math.random()-.5)*160,my=sy-60-Math.random()*120,ex=tg.left+20,ey=tg.top+tg.height/2;
 c.animate([{transform:`translate(${sx}px,${sy}px) scale(.6)`,opacity:1},{transform:`translate(${mx}px,${my}px) scale(1.2)`,opacity:1,offset:.45},{transform:`translate(${ex}px,${ey}px) scale(.7)`,opacity:.9}],{duration:700+Math.random()*300,delay:i*25,easing:'cubic-bezier(.3,.7,.4,1)'}).onfinish=()=>c.remove();}
 const pill=$('bank-bal');pill.animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:400,delay:600});}
// King Pooh: photo cut-out (533x440 unit space) + flat cut-out king outfit
function drawKing(x,cx,by,hh,t){const im=JIMG.king;if(!im.naturalWidth)return;const s=hh/560;x.save();x.translate(cx,by);x.rotate(Math.sin(t*1.6)*.025);x.translate(0,-Math.abs(Math.sin(t*1.6))*6);x.scale(s,s);x.translate(-266,-440);
 // cape (behind)
 const cp=new Path2D();cp.moveTo(120,250);cp.quadraticCurveTo(300,170,500,240);cp.quadraticCurveTo(600,380,580,470);cp.lineTo(-20,470);cp.quadraticCurveTo(-20,360,120,250);fillP(x,cp,lg(x,170,470,'#c0182f'),'#c0182f',6);
 x.save();x.clip(cp);x.globalAlpha=.18;x.fillStyle='#fff';for(let i=0;i<6;i++){x.beginPath();x.ellipse(60+i*90,330,18,140,.2,0,7);x.fill();}x.restore();
 const trim=(px,py)=>{fillP(x,rrP(px-22,py,44,140,22),'#fffafc','#d6dbe6',3);x.fillStyle='#2b2233';for(let i=0;i<5;i++){const yy=py+20+i*38;x.beginPath();x.moveTo(px-4+(i%2)*8,yy);x.lineTo(px+(i%2)*8,yy+12);x.lineTo(px+4+(i%2)*8,yy);x.fill();}};trim(70,330);trim(530,330);
 x.drawImage(im,0,0,533,440);
 // ermine collar
 // crown
 x.save();x.translate(330,22);x.rotate(.14);const cr=new Path2D();cr.moveTo(-96,40);cr.lineTo(-104,-46);cr.lineTo(-62,-8);cr.lineTo(-34,-70);cr.lineTo(0,-14);cr.lineTo(34,-70);cr.lineTo(62,-8);cr.lineTo(104,-46);cr.lineTo(96,40);cr.quadraticCurveTo(0,24,-96,40);cr.closePath();
 const cap=new Path2D();cap.ellipse(0,0,80,44,0,Math.PI,0);x.fillStyle='#a3102a';x.fill(cap);fillP(x,cr,lg(x,-70,40,'#ffcc33',1.2),'#ffcc33',5);fillP(x,rrP(-98,20,196,26,12),lg(x,20,46,'#ffcc33'),'#c48a00',4);
 [[-34,-70,'#ff3d8b'],[34,-70,'#4fd8ff'],[-104,-46,'#7ee8c6'],[104,-46,'#b39dff']].forEach(([gx,gy,gc])=>fillP(x,circP(gx,gy,10),rg(x,gx,gy,10,gc),gc,2));
 [[-50,33,'#e23b3b'],[0,33,'#2c3e8f'],[50,33,'#3fae5a']].forEach(([gx,gy,gc])=>fillP(x,rrP(gx-9,gy-8,18,16,5),rg(x,gx,gy,10,gc),gc,2));gloss(x,cr,-70,30);spark(x,-70,-40,12);spark(x,80,-20,9);x.restore();
 // scepter
 x.save();x.translate(420,380);x.rotate(.3);fillP(x,rrP(-8,-300,16,330,8),lg(x,-300,30,'#ffcc33'),'#c48a00',3);for(let i=0;i<5;i++)fillP(x,rrP(-11,-260+i*56,22,10,5),'#ffe066','#c48a00',2);
 fillP(x,circP(0,-326,32),rg(x,0,-326,32,'#ffcc33'),'#c48a00',4);fillP(x,starP(0,-374,26,11),rg(x,0,-374,26,'#fff6b0'),'#c48a00',3);fillP(x,circP(0,-326,12),rg(x,0,-326,12,'#e23b3b'),'#e23b3b',2);spark(x,30,-380,12);x.restore();
 x.restore();}
function drawBank(t){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5d1fb0');g.addColorStop(.5,'#8e44ec');g.addColorStop(1,'#ffcc33');X.fillStyle=g;X.fillRect(0,0,W,H);
 X.save();X.translate(W/2,H*.2);X.rotate(t*.15);for(let i=0;i<16;i++){X.rotate(Math.PI/8);X.fillStyle=i%2?'rgba(255,230,120,.12)':'rgba(255,255,255,.06)';X.beginPath();X.moveTo(0,0);X.lineTo(W,-W*.2);X.lineTo(W,W*.2);X.fill();}X.restore();
 const r=$('bank-host').getBoundingClientRect();drawKing(X,r.left+r.width*.4,r.bottom-4,r.height*.98,t);
 if(Math.random()<.25)burst(Math.random()*W,r.top+Math.random()*r.height,1,['#ffcc33','#fff6b0'],30);}
