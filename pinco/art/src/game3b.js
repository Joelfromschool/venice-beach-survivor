// ===== v2.0 runway: venues, crowd, reactions, secret cameos, rhythm POSE =====
const VENUES=['alley','mall','city','tokyo','paris','london'];
const CROWD_N=[3,10,20,30,42,64];
const REACT={
 en:{gen:['Fantastic!','Marvelous!','Iconic!','Slay!','Gorgeous!','Bravo!','Stunning!','Yes, queen!','Serve!','Obsessed!!',"Chef's kiss!",'Main character energy!','Runway royalty!','Legendary!','FASHION!!','Couture!'],
  fun:['My wig just flew off!','Call the fashion police… to arrest my jealousy!',"I'd wear that to court!",'Is she even real?!','I dropped my popcorn!','My grandma just fainted (happily)!','I need a fan… and a nap!','Someone frame this!','I sold my car for this seat. Worth it!','My heart did a cartwheel!'],
  low:['Hmm… bold?','Interesting choice…','*polite clapping*',"It's… a look!",'Brave. Very brave.','Is that… on purpose?','Okay… I see you!','Points for confidence!'],
  high:['TEN OUT OF TEN!',"I'm crying real tears!",'Somebody crown her!','Absolutely flawless!','THE MOMENT!!','History in the making!'],
  th:{royal:'So regal!',beach:'Beach babe!',pop:'Pop icon!',space:'Out of this world!',spooky:'Spook-tacular!',sweet:'Sweet as candy!',swamp:'Swamp chic!',honey:'Sweet as honey!',pea:'Pea-rfection!'},
  rare:'Suteki da ne~ ✨'},
 ja:{gen:['ステキ！','すばらしい！','アイコニック！','最高！','ゴージャス！','ブラボー！','見とれちゃう！','女王さま！','キマってる！','推せる！！','100点満点のキス！','主人公オーラ！','ランウェイの女王！','伝説！','ファッション！！','クチュール！'],
  fun:['ウィッグが飛んでった！','ファッション警察よんで…私の嫉妬を逮捕して！','あれ着て裁判いける！','実在するの！？','ポップコーン落とした！','おばあちゃんが（しあわせで）気絶した！','うちわと…お昼寝が必要！','だれか額に入れて！','車を売ってこの席買った。価値あり！','心がでんぐり返しした！'],
  low:['うーん…大胆？','おもしろい選択…','*おつきあいの拍手*','これは…ひとつのスタイル！','勇気ある。とても。','それって…わざと？','うん…見えてるよ！','自信は満点！'],
  high:['10点満点！','ガチ泣きしてる！','だれか王冠を！','完ぺき！','神回！！','歴史的瞬間！'],
  th:{royal:'気品がすごい！',beach:'ビーチの女神！',pop:'ポップアイコン！',space:'宇宙級！',spooky:'おばけカワイイ！',sweet:'キャンディみたい！',swamp:'沼シック！',honey:'はちみつみたいに甘い！',pea:'えんどう豆パーフェクト！'},
  rare:'Marvelous!'}};
function pickReacts(tot,vi,tid){const L=REACT[LANG()]||REACT.en;let n=1+(tot>=9?1:0)+(tot>=12?1:0);n=Math.round(n*[.6,.8,1,1.1,1.25,1.4][vi]);n=Math.max(1,Math.min(3,n));
 let pool=tot<=6?[...L.low,...L.low,...L.gen.slice(0,4)]:tot>=11?[...L.high,...L.gen,...L.fun]:[...L.gen,...L.fun];if(tot>6&&L.th[tid])pool.push(L.th[tid],L.th[tid]);
 const out=[];const used=new Set();while(out.length<n&&used.size<pool.length){let s=Math.random()<.025?(LANG()==='ja'?L.rare:REACT.en.rare):pk(pool);if(used.has(s))continue;used.add(s);out.push(s);}
 if(LANG()==='ja'&&Math.random()<.03)out[out.length-1]=REACT.ja.rare;return out;}
// ---- secret cameo (≈15% of shows) ----
const CAMEO_CATS=['hat','bow','acc','wand'];
function pickCameo(){if(Math.random()>(window.__CAMEO??.15))return null;const who=pk(['party','holiday','baller','mole','tad','leaf']);
 let pool=ITEMS.filter(i=>CAMEO_CATS.includes(i.c)&&!OWN()[i.id]&&!['cape','wings'].includes(i.k));if(!pool.length)pool=ITEMS.filter(i=>CAMEO_CATS.includes(i.c));
 const pref=pool.filter(i=>i.tags.some(t=>CAST[who].vibe.includes(t)));const it=pk(pref.length?pref:pool);return{who,id:it.id,side:Math.random()<.5?0:1};}
function cameoLikes(c,o,t,tot){const goal=ST.on?CH[S.story.ch].goal:10;if(tot<Math.max(9,goal))return false;const it=IT[c.id],cs=CAST[c.who];
 if(it.tags.includes(t.id)||cs.vibe.includes(t.id))return true;const worn=CATS.map(q=>o[q[0]]).filter(Boolean);
 return worn.some(id=>cs.cols.some(cc=>hexd(col(o,id),cc)<80))||worn.some(id=>IT[id].tags.some(g=>cs.vibe.includes(g)));}
function drawItemOn(x,id,cx,cy,w){const it=IT[id],[bx,by,bw,bh]=BOX[it.c];const s=w/bw;x.save();x.translate(cx-(bx+bw/2)*s,cy-(by+bh/2)*s);x.scale(s,s);const o=newOutfit();o[it.c]=id;itemDraw(x,id,o,false);x.restore();}
// cameo anchor: where on each cut-out the item goes (fractions of w,h from top-centre)
const ANCH={party:{hat:[0,.1,.9],bow:[.25,.16,.5],acc:[0,.5,1.4],wand:[.5,.45,.7]},holiday:{hat:[0,.1,.9],bow:[.3,.12,.5],acc:[0,.45,1.6],wand:[.5,.4,.7]},baller:{hat:[0,.06,.6],bow:[.2,.08,.35],acc:[0,.35,1.1],wand:[.45,.5,.6]},
 mole:{hat:[0,.08,.6],bow:[.3,.1,.3],acc:[0,.5,.9],wand:[.45,.5,.4]},tad:{hat:[.05,.42,.7],bow:[.25,.45,.4],acc:[0,.75,1],wand:[.45,.75,.5]},leaf:{hat:[0,.1,.7],bow:[.3,.15,.35],acc:[0,.6,1],wand:[.45,.6,.5]}};
function drawCameo(x,c,cx,by,h,t){const im=CAST[c.who].im;if(!im||!im.naturalWidth)return;const w=h*im.naturalWidth/im.naturalHeight,bob=Math.abs(Math.sin(t*5))*h*.05;
 drawCut(x,c.who,cx,by-bob,h,t,{rot:Math.sin(t*3)*.05});const it=IT[c.id],a=(ANCH[c.who]||ANCH.party)[it.c];drawItemOn(x,c.id,cx+a[0]*w,by-bob-h+a[1]*h,w*a[2]);
 if(t%1.2<.6){x.save();x.globalAlpha=.9;spark(x,cx+w*.45,by-h*.95-bob,8);x.restore();}}
// ---- venue backdrops ----
function venueBG(vi,t,hz){const x=X;
 if(vi===0){let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a1a3a');g.addColorStop(1,'#4a2a3a');x.fillStyle=g;x.fillRect(0,0,W,H);
  for(let r=0;r<16;r++)for(let c=0;c<10;c++){const bx=c*W/8-(r%2)*W/16,by=r*hz/12;x.fillStyle=(r*7+c*3)%5?'#8a4a3a':'#7a3a30';x.fillRect(bx+2,by+2,W/8-4,hz/12-4);}
  x.fillStyle='#3a2a2a';x.fillRect(0,hz,W,H-hz);// string lights
  x.strokeStyle='#222';x.lineWidth=2;x.beginPath();x.moveTo(0,hz*.18);x.quadraticCurveTo(W/2,hz*.42,W,hz*.18);x.stroke();for(let i=1;i<10;i++){const k=i/10,yy=hz*.18+(hz*.24)*4*k*(1-k)*0.95;x.fillStyle=['#ffcc33','#ff7eb6','#7ee8c6','#4fd8ff'][i%4];x.globalAlpha=.6+.4*Math.sin(t*4+i);x.fill(circP(W*k,yy+6,6));x.globalAlpha=1;}
  // the curtain (it's Pinco's blanket… shh)
  x.fillStyle='#ff9fca';x.beginPath();x.moveTo(W*.36,hz*.5);x.lineTo(W*.64,hz*.5);x.lineTo(W*.62,hz);x.lineTo(W*.38,hz);x.fill();x.strokeStyle='#ff7eb6';x.lineWidth=3;for(let i=0;i<5;i++){x.beginPath();x.moveTo(W*(.39+i*.055),hz*.52);x.lineTo(W*(.4+i*.055),hz);x.stroke();}
  // trash can + puddle
  fillP(x,rrP(W*.82,hz-60,44,60,6),'#7a8a8a','#7a8a8a',3);x.fillStyle='rgba(120,160,220,.3)';x.beginPath();x.ellipse(W*.18,H*.9,60,12,0,0,7);x.fill();return;}
 if(vi===1){let g=x.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#fff0f7');g.addColorStop(1,'#ffd6ea');x.fillStyle=g;x.fillRect(0,0,W,hz);
  for(let i=0;i<4;i++){const sx=i*W/4+8;fillP(x,rrP(sx,hz*.25,W/4-16,hz*.6,8),'#cfefff','#8ac',3);x.fillStyle='#ff7eb6';x.fillRect(sx,hz*.18,W/4-16,hz*.08);x.fillStyle='#fff';x.fill(circP(sx+(W/4-16)/2,hz*.6,10));}
  x.fillStyle='#ff3d8b';x.font='900 '+Math.round(W*.06)+'px '+FONT;x.textAlign='center';x.fillText('✨ POP-UP ✨',W/2,hz*.13);
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){x.fillStyle=(r+c)%2?'#f3e6ff':'#fff';x.fillRect(c*W/8,hz+r*(H-hz)/8,W/8,(H-hz)/8);}return;}
 if(vi===2){x.fillStyle='#1a1030';x.fillRect(0,0,W,H);for(let i=0;i<14;i++){x.fillStyle='#2a2050';const bw=W/10,bh=hz*(.4+((i*37)%50)/100);x.fillRect(i*bw*.8-10,hz-bh,bw*.9,bh);x.fillStyle='#ffe58a55';for(let k=0;k<6;k++)x.fillRect(i*bw*.8-4+(k%2)*bw*.4,hz-bh+10+Math.floor(k/2)*22,bw*.25,10);}
  x.fillStyle='#2a1a40';x.fillRect(0,hz,W,H-hz);for(const sx of[.2,.8]){const g=x.createRadialGradient(W*sx,0,10,W*sx,hz,H*.7);g.addColorStop(0,'rgba(255,255,220,.35)');g.addColorStop(1,'rgba(255,255,220,0)');x.fillStyle=g;x.beginPath();x.moveTo(W*sx-10,0);x.lineTo(W*sx+10,0);x.lineTo(W*.5+(sx-.5)*W*.4+Math.sin(t+sx*9)*40+80,H);x.lineTo(W*.5+(sx-.5)*W*.4+Math.sin(t+sx*9)*40-80,H);x.fill();}return;}
 if(vi===3){x.fillStyle='#0d0820';x.fillRect(0,0,W,H);const signs=[['ピンコ','#ff3d8b'],['ファッション','#4fd8ff'],['カワイイ','#7ee8c6'],['東京','#ffcc33'],['♥','#ff7eb6']];
  signs.forEach(([s,c],i)=>{const sx=(i*W/4.3)+8,sy=hz*(.15+(i%2)*.32);x.save();x.shadowColor=c;x.shadowBlur=18;x.strokeStyle=c;x.lineWidth=3;x.strokeRect(sx,sy,W/5,hz*.26);x.fillStyle=c;x.globalAlpha=.7+.3*Math.sin(t*6+i*2);x.font='900 '+Math.round(W*.045)+'px '+FONT;x.textAlign='center';x.fillText(s,sx+W/10,sy+hz*.17);x.restore();});
  x.fillStyle='#1a1030';x.fillRect(0,hz,W,H-hz);for(let i=0;i<6;i++){x.strokeStyle=['#ff3d8b','#4fd8ff','#7ee8c6'][i%3];x.globalAlpha=.35;x.lineWidth=3;x.beginPath();x.moveTo(W*(i/5),0);x.lineTo(W/2+Math.sin(t*1.5+i)*W*.6,H*.8);x.stroke();}x.globalAlpha=1;return;}
 if(vi===4){let g=x.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#1a1450');g.addColorStop(1,'#5a3a8a');x.fillStyle=g;x.fillRect(0,0,W,H);
  // Eiffel silhouette
  x.fillStyle='#2a1a40';x.beginPath();const ex=W*.78;x.moveTo(ex-50,hz);x.quadraticCurveTo(ex-12,hz*.6,ex-4,hz*.05);x.lineTo(ex+4,hz*.05);x.quadraticCurveTo(ex+12,hz*.6,ex+50,hz);x.lineTo(ex+30,hz);x.quadraticCurveTo(ex,hz*.8,ex-30,hz);x.fill();
  for(let i=0;i<12;i++){x.globalAlpha=.5+.5*Math.sin(t*9+i*3);spark(x,ex+(Math.random()-.5)*30,hz*(.1+i*.07),3);}x.globalAlpha=1;
  for(const cx of[.25,.5]){x.strokeStyle='#ffcc33';x.lineWidth=2;x.beginPath();x.moveTo(W*cx,0);x.lineTo(W*cx,hz*.15);x.stroke();for(let k=-2;k<=2;k++){x.fillStyle='#fff6b0';x.fill(circP(W*cx+k*14,hz*.2+Math.abs(k)*-4,4+Math.sin(t*5+k)));}spark(x,W*cx,hz*.22,10);}
  x.fillStyle='#3a2050';x.fillRect(0,hz,W,H-hz);return;}
 // london
 let g=x.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#05051a');g.addColorStop(1,'#2a1a5a');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.fillStyle='#151030';const bx=W*.14;x.fillRect(bx-18,hz*.18,36,hz*.82);x.beginPath();x.moveTo(bx-22,hz*.18);x.lineTo(bx,hz*.02);x.lineTo(bx+22,hz*.18);x.fill();x.fillStyle='#ffe58a';x.fill(circP(bx,hz*.3,12));x.strokeStyle='#151030';x.lineWidth=2;x.beginPath();x.moveTo(bx,hz*.3);x.lineTo(bx+Math.cos(t)*9,hz*.3+Math.sin(t)*9);x.stroke();
 x.save();x.shadowColor='#ff3d8b';x.shadowBlur=24;x.fillStyle='#ff3d8b';x.font='900 '+Math.round(W*.09)+'px '+FONT;x.textAlign='center';x.fillText('LFW',W*.62,hz*.3);x.restore();
 for(let i=0;i<10;i++){x.strokeStyle=['#ff3d8b','#4fd8ff','#ffcc33','#7ee8c6','#b39dff'][i%5];x.globalAlpha=.45;x.lineWidth=3;x.beginPath();x.moveTo(W*((i%5)/4),hz*.05);x.lineTo(W/2+Math.sin(t*2+i)*W*.7,H*.85);x.stroke();}x.globalAlpha=1;
 x.fillStyle='#1a1040';x.fillRect(0,hz,W,H-hz);if(Math.random()<.5)burst(Math.random()*W,0,1,['#ff3d8b','#ffcc33','#4fd8ff','#7ee8c6','#fff'],50);}
const FONT='ui-rounded,"Hiragino Maru Gothic ProN","Hiragino Sans","Arial Rounded MT Bold","Noto Sans JP",system-ui,sans-serif';
function drawFolding(x,cx,y,s){x.strokeStyle='#8a8f99';x.lineWidth=4*s;x.beginPath();x.moveTo(cx-14*s,y);x.lineTo(cx+14*s,y-30*s);x.moveTo(cx+14*s,y);x.lineTo(cx-14*s,y-30*s);x.stroke();fillP(x,rrP(cx-18*s,y-34*s,36*s,8*s,3*s),'#b0b5bf','#8a8f99',2);fillP(x,rrP(cx-16*s,y-70*s,32*s,30*s,4*s),'#b0b5bf','#8a8f99',2);}
function crowdSpots(vi,hz){if(RUN.spots)return RUN.spots;const n=CROWD_N[vi],sp=[];
 if(vi===0){[[.14,.62],[.86,.66],[.2,.86]].forEach(([fx,fy])=>sp.push({x:W*fx,y:hz+(H-hz)*fy*0.9,r:22,c:'#fff',chair:1}));}
 else{const rows=Math.ceil(n/8);for(let i=0;i<n;i++){const side=i%2,j=Math.floor(i/2),per=Math.ceil(n/2/rows),row=j%rows,col=Math.floor(j/rows);const k=(row+1)/(rows+1)*0.9+.08;
  const x0=side?W*(.6+k*.42):W*(.4-k*.42);sp.push({x:x0+(side?1:-1)*col*W*.08*(1+k),y:hz+(H-hz)*k+((col*13)%9),r:6+k*20,c:['#b39dff','#7ee8c6','#ffcc33','#4fd8ff','#ff8a65','#fffafc','#ff7eb6','#8fd14f'][(i*3)%8],ph:Math.random()*6});}}
 sp.sort((a,b)=>a.y-b.y);return RUN.spots=sp;}
function drawCrowdP(x,p,t){const b=Math.abs(Math.sin(t*4+(p.ph||0)))*p.r*.15;const y=p.y-b;x.fillStyle=p.c;x.globalAlpha=.95;
 x.beginPath();x.ellipse(p.x,y+p.r*.9,p.r*.9,p.r*.75,0,Math.PI,0);x.fill();x.fill(circP(p.x,y-p.r*.2,p.r*.62));x.fill(circP(p.x-p.r*.45,y-p.r*.75,p.r*.22));x.fill(circP(p.x+p.r*.45,y-p.r*.75,p.r*.22));
 x.fillStyle='#2b2233';x.fill(circP(p.x-p.r*.2,y-p.r*.25,p.r*.08));x.fill(circP(p.x+p.r*.2,y-p.r*.25,p.r*.08));x.globalAlpha=1;}
// ---- rhythm pose ----
const POSES={wave:{k:'p_wave'},hip:{k:'p_hip'},twirl:{k:'p_twirl'},kiss:{k:'p_kiss'},princess:{k:'p_princess'}};
function newRun(){const vi=ST.on?CH[S.story.ch].v:2;return{fl:[],white:0,posed:0,jn:[],jt:[],vi,pops:[],react:null,cameo:pickCameo(),done:0,rh:null,pose:null,rt:0};}
function startRhythm(){const beat=60/126,easy=!!S.easy,n=easy?4:(RUN.vi>=3?6:5),t0=AC?AC.currentTime+.25:performance.now()/1000+.25;const cs=[];
 let lx=W/2,ly=H*.45;const slots=n===4?[2,3,4,6]:n===5?[2,3,4,5,6]:[2,3,4,5,6,7];
 for(let i=0;i<n;i++){let px,py,g=0;do{px=W*(.18+Math.random()*.64);py=H*(.26+Math.random()*.42);g++;}while(Math.hypot(px-lx,py-ly)<W*.28&&g<30);lx=px;ly=py;cs.push({x:px,y:py,bt:t0+slots[i]*beat,g:null,n:i+1});}
 RUN.rh={t0,beat,cs,easy,pw:easy?.12:.075,gw:easy?.24:.16,app:beat*(easy?2.6:2)};stopSong();sting(t0,beat);}
function nowA(){return AC?AC.currentTime:performance.now()/1000;}
function sting(t0,b){if(!AC)return;const bus=MG;for(let i=0;i<8;i++){const t=t0+i*b;tone(140,t,.18,'sine',.6,bus,45);if(i%2)noise(t,.1,.3,1700,bus);noise(t+b/2,.03,.12,9000,bus,'highpass');
  const ch=i<4?[69,73,76]:[74,78,81];ch.forEach(n=>tone(mf(n),t,b*.6,'square',.03,bus));tone(mf((i<4?45:50)),t,b*.9,'sawtooth',.06,bus);if(i>=2)tone(mf([81,83,85,86,88,90][i-2]),t,b*.5,'triangle',.14,bus);}
 const te=t0+8*b;noise(te,1.2,.3,6000,bus,'highpass');[74,78,81,86].forEach(n=>tone(mf(n),te,1.2,'triangle',.1,bus));}
function hitCircle(cx,cy){const R=RUN.rh;if(!R||R.over)return;const now=nowA();let best=null;
 for(const c of R.cs){if(c.g)continue;const dt=now-c.bt;if(dt<-R.gw*1.6||dt>R.gw)continue;if(Math.hypot(cx-c.x,cy-c.y)>W*.13)continue;if(!best||Math.abs(dt)<Math.abs(now-best.bt))best=c;}
 if(!best)return;const d=Math.abs(now-best.bt);best.g=d<=R.pw?'perfect':d<=R.gw?'good':'miss';best.gt=now;
 if(best.g!=='miss'){RUN.white=best.g==='perfect'?.35:.2;SFX.click();SFX.ooh(.5);burst(best.x,best.y,best.g==='perfect'?22:10,['#fff','#ffcc33','#ff7eb6'],180);RUN.fl.push({x:best.x,y:best.y,t:0,r:30});buzz(15);}else SFX.bad();}
function rhythmTick(){const R=RUN.rh,now=nowA();for(const c of R.cs)if(!c.g&&now>c.bt+R.gw){c.g='miss';c.gt=now;}
 if(!R.over&&R.cs.every(c=>c.g)){R.over=now;const pts=R.cs.reduce((a,c)=>a+(c.g==='perfect'?2:c.g==='good'?1:0),0)/(2*R.cs.length);
  const tier=pts>=.999?'princess':pts>=.75?'kiss':pts>=.45?(Math.random()<.5?'hip':'twirl'):'wave';RUN.pose=tier;RUN.poseT=now;
  const add={princess:[1,1,1],kiss:[1,0,1],hip:[0,0,1],twirl:[0,0,1],wave:[0,0,0]}[tier];RESULT.bonus=add.reduce((a,b)=>a+b,0);RESULT.stars=RESULT.stars.map((s,i)=>Math.min(5,s+add[i]));
  const tot=RESULT.stars.reduce((a,b)=>a+b,0);RESULT.coins=5+tot*2+(tot>=13?10:0);RESULT.pose=tier;RESULT.say=RESULT.stars.map((s,i)=>pk((LANG()==='ja'?JUDGES[i].lj:JUDGES[i].lines)[s-1]));
  if(tier==='princess'){SFX.cheer();burst(W/2,H*.4,90,['#fff','#ffcc33','#ff7eb6','#b39dff'],320);}else if(tier==='kiss'){SFX.clap(24,1.5);SFX.ooh(1);for(let i=0;i<14;i++)RUN.hearts.push({x:W/2+(Math.random()-.5)*60,y:H*.4,vx:(Math.random()-.5)*160,vy:-80-Math.random()*120,t:0});}else{SFX.clap(tier==='wave'?8:16,1);}
  for(let i=0;i<6;i++)setTimeout(()=>{if(RUN){RUN.fl.push({x:Math.random()*W,y:H*(.3+Math.random()*.5),t:0,r:26});SFX.flash();RUN.white=.3;}},i*120);}}
function poseArm(tier,t){switch(tier){case'wave':return[420+Math.sin(t*12)*40,40,-1];case'hip':return[318,360,1];case'kiss':return[236+Math.sin(t*3)*6,118,-1];case'princess':return[440,-60,-1];case'twirl':return[440,160,-1];default:return null;}}
function poseName(tier,vi){if(tier!=='princess')return T(POSES[tier].k);const top=LANG()==='ja'?['プリンセスポーズ！👑','プリンセスポーズ！👑','スーパースター・プリンセス！🌟','スーパースター・プリンセス！🌟','ロイヤル・クチュール・ポーズ！💎','ロイヤル・クチュール・ポーズ！💎']:['PRINCESS POSE! 👑','PRINCESS POSE! 👑','SUPERSTAR PRINCESS! 🌟','SUPERSTAR PRINCESS! 🌟','ROYAL COUTURE POSE! 💎','ROYAL COUTURE POSE! 💎'];return top[vi];}
// ---- runway (replaces v1 runway) ----
runway=function(t,dt){const vi=RUN.vi,hz=H*.36;RUNI=vi;if(!RUN.hearts)RUN.hearts=[];
 if(ST.on)venueBG(vi,t,hz);else{bgDraw(X,O,W,H,t);X.fillStyle='rgba(20,0,40,.35)';X.fillRect(0,0,W,H);}
 // carpet (grows with venue)
 const cw=[.06,.08,.1,.11,.12,.13][vi];const g=X.createLinearGradient(0,hz,0,H);g.addColorStop(0,vi===0?'#c9a27a':'#ff9fca');g.addColorStop(1,vi===0?'#a07850':vi>=4?'#c4166a':'#ff3d8b');X.fillStyle=g;X.beginPath();X.moveTo(W*(.5-cw),hz);X.lineTo(W*(.5+cw),hz);X.lineTo(W*1.05,H);X.lineTo(-W*.05,H);X.fill();
 X.fillStyle='rgba(255,255,255,.22)';for(let i=0;i<10;i++){const k=((i/10+t*.25)%1),y=hz+(H-hz)*k*k,ww=W*(.12+.98*k*k);X.fillRect(W/2-ww/2,y,ww,2+k*4);}
 // crowd
 const sp=crowdSpots(vi,hz);const cam=RUN.cameo;let camDrawn=false;
 for(let i=0;i<sp.length;i++){const p=sp[i];if(p.chair){drawFolding(X,p.x,p.y+40,1.1);const who=['party','leaf','mole'][i];if(!(cam&&i===2))drawCut(X,who,p.x,p.y+6,who==='mole'?60:who==='leaf'?72:100,t,{rot:Math.sin(t*3+i)*.05});continue;}
  drawCrowdP(X,p,t);if(Math.random()<dt*(.4+vi*.25))RUN.fl.push({x:p.x,y:p.y-p.r*.4,t:0,r:p.r});}
 if(cam){const p=vi===0?sp[2]:sp.filter(q=>(q.x>W/2)===!!cam.side).slice(-2)[0]||sp[sp.length-1];drawCameo(X,cam,p.x,p.y+(vi===0?8:p.r),Math.max(64,p.r*4.2),t);if(!RUN.camToast&&t>1.2){RUN.camToast=1;toast(T('incrowd',CN(cam.who)),1800);SFX.sparkle();}}
 // walk
 const walkT=Math.min(1,t/5.2),k=1-Math.pow(1-walkT,1.6),atEnd=t>=5.2;const s0=place(0,0,W,H*.9).s,s=s0*(.28+.6*k)*(RUN.rh?.82:1);const fy=hz+(H*.94-hz)*k;const ph=atEnd?0:t*7.5;const bob=atEnd?0:Math.abs(Math.sin(ph))*12*s;
 // reactions
 if(!RUN.react){const tot=RESULT.stars.reduce((a,b)=>a+b,0);RUN.react=pickReacts(tot,vi,theme.id).map((s2,i,a)=>({s:s2,at:1+(i+.3+Math.random()*.4)*(3.8/a.length)}));}
 for(const r of RUN.react){if(!r.p&&t>=r.at){r.p=1;const q=pk(sp);RUN.pops.push({s:r.s,x:Math.max(80,Math.min(W-80,q.x)),y:Math.max(H*.2,q.y-q.r*2-20),t:0});SFX.ooh(.8);SFX.clap(10+vi*4,1);}}
 // pose state
 const R=RUN.rh;let arm=null,rot=atEnd?Math.sin(t*5)*.03:Math.sin(ph)*.035,flip=1,sq=1;
 if(atEnd&&!RUN.rt){RUN.rt=1;if(!S.tutPose){PAUSED=true;tutorial(T('poseTut'),[T('poseTut1'),T('poseTut2')],()=>{S.tutPose=1;save();PAUSED=false;startRhythm();});}else startRhythm();}
 if(RUN.pose){const pt=nowA()-RUN.poseT;arm=poseArm(RUN.pose,pt);if(RUN.pose==='twirl'){flip=Math.cos(Math.min(pt,1)*Math.PI*4);}if(RUN.pose==='hip')rot=.06;if(RUN.pose==='princess'){sq=1+Math.sin(Math.min(pt,.5)*Math.PI*2)*.06;rot=-.04;}
  if(pt>2.1)RUN.done=1;}
 if(ST.on&&S.story.ch===5&&t>2.2&&t<3.9){if(!RUN.fell){RUN.fell=1;SFX.gasp();SFX.whoosh();buzz(60);RUN.pops.push({s:L2('Oh no!! 😱','あぶない！！😱'),x:W/2,y:H*.3,t:0});}const fk=Math.min(1,(t-2.2)/.3)*(1-Math.max(0,(t-3.4)/.5));rot=fk*1.4;if(t>3.4&&!RUN.fellUp){RUN.fellUp=1;SFX.cheer();RUN.pops.push({s:L2('She got up! LEGEND!','立ち上がった！伝説！'),x:W/2,y:H*.25,t:0});}}
 X.save();X.translate(W/2,fy-bob);X.rotate(rot);X.scale(flip*(1/Math.sqrt(sq)),sq);X.translate(-225*s,-930*s);X.scale(s,s);drawPinco(X,O,{ph,arm});X.restore();
 if(RUN.pose==='princess'){const pt=nowA()-RUN.poseT;const gx=W/2,gy=fy-860*s;X.save();X.globalAlpha=Math.max(0,1-Math.abs(pt-.6)*2);spark(X,gx+30*s,gy,40*(1+Math.sin(pt*20)*.2));X.restore();if(Math.random()<.5)burst(W/2+(Math.random()-.5)*W*.6,fy-Math.random()*800*s,2,['#ffcc33','#fff'],80);}
 for(const h of RUN.hearts){h.t+=dt;h.x+=h.vx*dt;h.y+=h.vy*dt;X.globalAlpha=Math.max(0,1-h.t/1.6);X.fillStyle='#ff3d8b';X.fill(heartP(h.x,h.y,12+h.t*8));}X.globalAlpha=1;
 if(!atEnd&&Math.random()<dt*14)burst(W/2+(Math.random()-.5)*W*.5*k,fy-(Math.random()*900*s),2,['#fff','#ffcc33','#ff7eb6','#4fd8ff'],60);
 for(const f of RUN.fl){f.t+=dt;X.globalAlpha=Math.max(0,1-f.t*4);X.fillStyle='#fff';X.fill(starP(f.x,f.y,f.r*1.4*(1+f.t*3),f.r*.3));if(f.t===dt&&Math.random()<.5){SFX.flash();RUN.white=Math.max(RUN.white,.2);}}
 X.globalAlpha=1;RUN.fl=RUN.fl.filter(f=>f.t<.3);
 // crowd pops
 for(const p of RUN.pops){p.t+=dt;const a=p.t<.2?p.t/.2:Math.max(0,1-(p.t-1.6)/.5),sc=p.t<.2?.6+p.t*2:1;if(a<=0)continue;X.save();X.globalAlpha=a;X.translate(p.x,p.y-p.t*18);X.scale(sc,sc);X.font='900 '+Math.round(Math.min(18,W*.045))+'px '+FONT;const tw=Math.min(W*.8,X.measureText(p.s).width+22);
  X.fillStyle='#fff';X.strokeStyle='#ff7eb6';X.lineWidth=3;X.beginPath();X.roundRect?X.roundRect(-tw/2,-18,tw,32,16):X.rect(-tw/2,-18,tw,32);X.fill();X.stroke();X.beginPath();X.moveTo(-6,14);X.lineTo(0,24);X.lineTo(6,14);X.fill();X.fillStyle='#8e44ec';X.textAlign='center';X.fillText(p.s,0,4,tw-12);X.restore();}
 RUN.pops=RUN.pops.filter(p=>p.t<2.2);
 // rhythm overlay
 if(R){rhythmTick();const now=nowA();
  if(!R.over&&now<R.cs[0].bt){const pulse=1+Math.sin(now*14)*.06;X.save();X.translate(W/2,H*.17);X.scale(pulse,pulse);X.textAlign='center';X.font='900 '+Math.round(W*.1)+'px '+FONT;X.lineWidth=8;X.strokeStyle='#fff';X.fillStyle='#ff3d8b';X.strokeText(T('posetap'),0,0);X.fillText(T('posetap'),0,0);X.restore();}
  for(const c of R.cs){const ap=c.bt-now;const r0=W*.085;
   if(!c.g&&ap<R.app){const k2=Math.max(0,ap/R.app);X.save();X.globalAlpha=Math.min(1,(1-k2)*3);fillP(X,circP(c.x,c.y,r0),'rgba(255,61,139,.85)','#ff3d8b',4);X.strokeStyle='#fff';X.lineWidth=5;X.stroke(circP(c.x,c.y,r0));
    X.fillStyle='#fff';X.font='900 '+Math.round(r0)+'px '+FONT;X.textAlign='center';X.fillText(c.n,c.x,c.y+r0*.35);X.strokeStyle=Math.abs(ap)<R.pw?'#ffcc33':'#fff';X.lineWidth=4;X.stroke(circP(c.x,c.y,r0*(1+k2*2.2)));X.restore();}
   if(c.g){const gt=now-c.gt;if(gt<.7){X.save();X.globalAlpha=1-gt/.7;X.textAlign='center';X.font='900 '+Math.round(W*.065)+'px '+FONT;X.lineWidth=6;X.strokeStyle='#fff';X.fillStyle=c.g==='perfect'?'#ffb020':c.g==='good'?'#22b35a':'#8a8a9a';const s2=T(c.g);X.strokeText(s2,c.x,c.y-gt*40);X.fillText(s2,c.x,c.y-gt*40);if(c.g!=='miss'){X.strokeStyle='#ffcc33';X.lineWidth=3;X.stroke(circP(c.x,c.y,r0*(1+gt*2)));}X.restore();}}}
  if(RUN.pose){const pt=now-RUN.poseT;X.save();X.textAlign='center';const sc=Math.min(1,pt*4)*(1+Math.sin(pt*8)*.03);X.translate(W/2,H*.16);X.scale(sc,sc);X.font='900 '+Math.round(W*.085)+'px '+FONT;X.lineWidth=8;X.strokeStyle='#fff';X.fillStyle='#ff3d8b';const nm=poseName(RUN.pose,vi);X.strokeText(nm,0,0,W*.94);X.fillText(nm,0,0,W*.94);
   if(RESULT.bonus){X.font='900 '+Math.round(W*.055)+'px '+FONT;X.fillStyle='#8e44ec';X.strokeText(T('p_bonus',RESULT.bonus),0,W*.09);X.fillText(T('p_bonus',RESULT.bonus),0,W*.09);}
   const pc=R.cs.filter(c=>c.g==='perfect').length,gc=R.cs.filter(c=>c.g==='good').length;X.font='800 '+Math.round(W*.04)+'px '+FONT;X.fillStyle='#fff';X.lineWidth=5;X.strokeStyle='#5d1fb0';const sm=T('perfect')+' '+pc+'  ·  '+T('good')+' '+gc;X.strokeText(sm,0,W*.16);X.fillText(sm,0,W*.16);X.restore();}}
 if(RUN.white>0){X.fillStyle='rgba(255,255,255,'+RUN.white+')';X.fillRect(0,0,W,H);RUN.white-=dt*2;}};
cv.addEventListener('pointerdown',e=>{if(scene==='runway'&&RUN&&RUN.rh)hitCircle(e.clientX,e.clientY);});
// skip during runway: jump to end of walk / auto-resolve rhythm
document.addEventListener('click',e=>{const b=e.target.closest('[data-a="skip"]');if(!b)return;if(scene==='runway'&&RUN){if(!RUN.rh&&!RUN.rt){st=5.2;}else if(RUN.rh&&!RUN.rh.over){for(const c of RUN.rh.cs)if(!c.g){c.g='miss';c.gt=nowA();}}else RUN.done=1;}},true);
// generic tutorial modal
let TUTCB=null;function tutorial(h,lines,cb){$('tut-h').textContent=h;$('tut-b').innerHTML=lines.map(l=>'<p>'+l+'</p>').join('');$('tut').classList.add('on');TUTCB=cb;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a="tutok"]');if(!b)return;$('tut').classList.remove('on');SFX.sparkle();const c=TUTCB;TUTCB=null;c&&c();});
