// ===== v2.0 story engine: menu, intro ad, dialogue, chapter loop, gifts =====
const L2=(e,j)=>LANG()==='ja'?j:e;
function setSCoins(){document.querySelectorAll('.scoins').forEach(e=>e.textContent=S.story.coins);}
function openSMenu(){scene='smenu';st=0;show('s-smenu');ST.on=false;setSCoins();const ss=S.story;const b=$('sm-cont');
 if(ss.stage==='intro'&&ss.ch===0){b.textContent=T('newgame');b.dataset.a='snew';}else{b.textContent=ss.done?T('theend'):T('cont',ss.ch+1);b.dataset.a='scont';}playSong('title');}
function storyStart(){ST.on=true;const ss=S.story;if(ss.done){ss.ch=11;ss.stage='pre';ss.done=0;}storyGo();}
function storyGo(){ST.on=true;const ss=S.story;save();setSCoins();
 if(ss.stage==='intro')return playIntro();
 const C=CH[ss.ch];
 if(ss.stage==='pre')return playDialog(C.pre,()=>{ss.stage='show';storyGo();},T('chapter',ss.ch+1)+' · '+L2(...C.title));
 if(ss.stage==='show')return storyTheme();
 if(ss.stage==='post')return playDialog(C.post,()=>{if(ss.ch>=CH.length-1){ss.done=1;ss.stage='pre';save();return ending();}ss.stage='shift';storyGo();});
 if(ss.stage==='shift'){const k=STALL_FOR(ss.ch);if(!k){ss.stage='shop';return storyGo();}return startServe(k);}
 if(ss.stage==='shop')return openShop();}
function storyTheme(){theme=THEMES.find(t=>t.id===CH[S.story.ch].th);scene='theme';st=0;show('s-theme');$('th-e').textContent=theme.e;$('th-n').textContent=THN(theme);$('th-h').textContent=THH(theme);
 $('th-p').innerHTML=theme.p.map(c=>'<i style="background:'+c+'"></i>').join('');$('th-rule').textContent=T('venue_'+VENUES[CH[S.story.ch].v])+' · '+T('chapter',S.story.ch+1);$('th-goal').textContent=T('goal',CH[S.story.ch].goal);SFX.sparkle();}
const _goTheme=goTheme;goTheme=function(){ST.on=false;_goTheme();$('th-rule').textContent=T('rule');$('th-goal').textContent='';};
const _goDress=goDress;goDress=function(){const keep=ST.on&&S.story.retry&&ST.lastO;_goDress();if(keep){O=JSON.parse(JSON.stringify(ST.lastO));Object.keys(O).forEach(k=>{if(CATS.some(c=>c[0]===k)&&O[k]&&!OWN()[O[k]])O[k]=null;});renderTabs();renderItems();renderTools();}S.story.retry=0;};
// ---- score hook: story buttons, gift event ----
function afterScore(R,tot){const free=!ST.on;$('sc-free').style.display=free?'':'none';$('sc-story').style.display=free?'none':'';setSCoins();
 document.querySelectorAll('.coins').forEach(e=>e.textContent=ST.on?S.story.coins:S.coins);
 if(ST.on){const g=CH[S.story.ch].goal,ok=tot>=g;ST.lastO=JSON.parse(JSON.stringify(O));S.story.lastO=ST.lastO;save();
  $('sc-unl').textContent=ok?T('pass'):T('fail');$('sc-tip').textContent=ok?R.tip:T('failmsg',g,tot)+' '+R.tip;
  $('sc-story').innerHTML=ok?'<button class="big ghost" data-a="photo">'+T('photo')+'</button><button class="big" data-a="spass">'+T('continue')+'</button>':'<button class="big ghost" data-a="sshift">'+T('toshift')+'</button><button class="big" data-a="sretry">'+T('retry')+'</button>';}
 if(RUN&&RUN.cameo&&!RUN.giftDone){RUN.giftDone=1;if(cameoLikes(RUN.cameo,O,theme,tot))setTimeout(()=>giftEvent(RUN.cameo),700);}}
function giftEvent(c){const it=IT[c.id];S.owned[c.id]=1;S.story.owned[c.id]=1;S.gifts.push({id:c.id,who:c.who,d:Date.now()});save();
 $('gift-h').textContent=T('giftnew');$('gift-who').src=CAST[c.who].img;$('gift-say').textContent=CN(c.who)+L2(': ','：')+T('giftsay',IN(it));$('gift-it').src=thumb(c.id);$('gift-n').textContent=IN(it);
 $('gift').classList.add('on');SFX.fan();setTimeout(()=>SFX.sparkle(),400);burst(W/2,H*.5,60,['#ffcc33','#fff','#ff7eb6'],260);}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,ss=S.story;
 if(a==='giftok'){$('gift').classList.remove('on');SFX.tap();}
 else if(a==='story'){SFX.tap();openSMenu();}else if(a==='gohome2'){SFX.tap();goTitle();}
 else if(a==='snew'){SFX.sparkle();const keep=S.story.tutServe;S.story=defStory();S.story.tutServe=keep;save();storyStart();}
 else if(a==='scont'){SFX.sparkle();storyStart();}
 else if(a==='sdebug'){SFX.tap();ss.ch=CH.length-1;ss.stage='pre';ss.done=0;ss.coins+=1500;ITEMS.filter(i=>i.tags.includes('royal')).forEach(i=>ss.owned[i.id]=1);save();storyStart();}
 else if(a==='spass'){SFX.tap();ss.stage='post';storyGo();}
 else if(a==='sretry'){SFX.tap();ss.retry=1;ss.stage='show';storyGo();}
 else if(a==='sshift'){SFX.tap();ss.retry=1;ss.stage='shift';ST.retryAfter=1;storyGo();}
 else if(a==='dskip'){SFX.tap();if(DLG){const cb=DLG.cb;DLG=null;cb();}}
 else if(a==='introskip'){SFX.tap();INT=null;S.story.stage='pre';introDialog();}
 else if(a==='inhelp'){if(INT&&INT.wait){INT.wait=0;INT.i++;INT.t=0;$('in-help').classList.remove('on');SFX.fan();buzz(30);burst(W/2,H*.7,60,['#ff7eb6','#fff','#ffcc33'],300);capt();}}
});
// ---- dialogue ----
let DLG=null;
function playDialog(d,cb,head){scene='story';st=0;show('s-story');DLG={d,i:0,cb,head,t0:0};if(head)toast('📖 '+head,2200);playSong(d.bg==='night'||d.bg==='rain'?'title':'title');showBeat();}
function showBeat(){const b=DLG.d.lines[DLG.i];const who=b[0];$('dlg-n').textContent=CN(who);$('dlg-t').textContent=L2(b[1],b[2]);$('dlg-p').src=CAST[who].img||'';$('dlg').classList.toggle('right',who!=='pinco');
 DLG.t0=st;DLG.fx=b[3];if(b[3]==='shake'){SFX.gasp();buzz(40);}if(b[3]==='crown'){SFX.cheer();burst(W/2,H*.3,80,['#ffcc33','#fff','#ff7eb6'],300);}if(b[3]==='rain')SFX.thunder();SFX.tap();}
function nextBeat(){if(!DLG)return;if(st-DLG.t0<.25)return;DLG.i++;if(DLG.i>=DLG.d.lines.length){const cb=DLG.cb;DLG=null;cb();return;}showBeat();}
document.addEventListener('pointerup',e=>{if(scene!=='story'||!DLG)return;if(e.target.closest('button'))return;nextBeat();});
function storyBG(x,bg,t){const hz=H*.62;
 if(bg==='alley'||bg==='night'){venueBG(0,t,hz);if(bg==='night'){x.fillStyle='rgba(10,10,40,.55)';x.fillRect(0,0,W,H);rain(x,t);}return;}
 if(bg==='mall')return venueBG(1,t,hz);if(bg==='city')return venueBG(2,t,hz);if(bg==='tokyo')return venueBG(3,t,hz);if(bg==='paris')return venueBG(4,t,hz);if(bg==='london')return venueBG(5,t,hz);
 if(bg==='cafe')return stallBG('cafe',t);
 if(bg==='backstage'){x.fillStyle='#3a2050';x.fillRect(0,0,W,H);for(let i=0;i<3;i++){fillP(x,rrP(W*(.06+i*.32),H*.12,W*.26,H*.3,12),'#fff6e0','#c48a00',4);for(let k=0;k<6;k++){x.fillStyle='#ffe58a';x.fill(circP(W*(.06+i*.32)+k*W*.05+6,H*.12,5));}}x.fillStyle='#2a1838';x.fillRect(0,hz,W,H-hz);
  x.strokeStyle='#8a8f99';x.lineWidth=3;x.beginPath();x.moveTo(0,H*.5);x.lineTo(W,H*.5);x.stroke();for(let i=0;i<5;i++){fillP(x,rrP(W*(.1+i*.18),H*.5,W*.1,H*.12,8),['#ff7eb6','#b39dff','#7ee8c6','#ffcc33','#4fd8ff'][i],'#5a2a6a',3);}return;}
 drawBG(x,'bedroom',W,H,'#ff7eb6',t);}
function rain(x,t){x.strokeStyle='rgba(180,200,255,.5)';x.lineWidth=2;x.beginPath();for(let i=0;i<70;i++){const rx=((i*97+t*60)%W),ry=((i*53+t*700)%(H+40))-20;x.moveTo(rx,ry);x.lineTo(rx-4,ry+16);}x.stroke();}
SC3.story=function(t,dt){if(!DLG){return;}const d=DLG.d;storyBG(X,d.bg,t);if(DLG.fx==='rain'&&d.bg!=='night'){X.fillStyle='rgba(10,10,40,.4)';X.fillRect(0,0,W,H);rain(X,t);}
 const who=d.lines[DLG.i][0],cast=d.cast,n=cast.length,base=H*.72,shake=DLG.fx==='shake'&&t-DLG.t0<.6?Math.sin(t*60)*8:0;
 cast.forEach((k,i)=>{const cx=W*(n===1?.5:.2+.6*i/(n-1))+shake,sp=k===who;const h=(k==='pinco'?H*.46:k==='mole'||k==='tad'||k==='leaf'?H*.2:H*.27)*(sp?1.08:.92);const bob=sp?Math.abs(Math.sin(t*6))*8:0;
  drawCut(X,k,cx,base-bob,h,t,{a:sp?1:.8,rot:sp?Math.sin(t*3)*.04:0,outfit:k==='pinco'&&DLG.fx==='crown'?Object.assign({},PINO(),{hat:'crown'}):null});});
 if(DLG.fx==='crown'&&Math.random()<.4)burst(Math.random()*W,0,2,['#ffcc33','#ff7eb6','#fff'],60);};
// ---- intro "mobile ad" ----
let INT=null;
function playIntro(){scene='intro';st=0;show('s-intro');document.querySelector('#s-intro .skip').style.display='';INT={i:0,t:0,wait:0};capt();playSong('title');}
function capt(){const c=$('in-cap'),it=INTRO[INT.i];if(!it)return;c.textContent=L2(...it[1]);c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');
 if(it[2]==='help'){INT.wait=1;$('in-help').textContent='👆 '+L2(...it[1]);$('in-help').classList.add('on');c.textContent='';}
 if(it[2]==='shadow'){stopSong();SFX.thunder();}if(it[2]==='yank'){SFX.whoosh();SFX.gasp();buzz(60);}if(it[2]==='spot'){SFX.fan();}if(it[2]==='star'){SFX.sparkle();}}
function introDialog(){$('in-help').classList.remove('on');playDialog({bg:'night',cast:['pinco','party'],lines:INTRO_D},()=>{S.story.stage='pre';save();storyGo();});}
SC3.intro=function(t,dt){if(!INT){return;}INT.t+=dt;const it=INTRO[INT.i];if(!it){INT=null;S.story.stage='pre';introDialog();return;}
 if(!INT.wait&&it[0]&&INT.t>it[0]){INT.i++;INT.t=0;capt();return;}const k=it[2],u=INT.t;const pin=(cx,by,h,o)=>drawCut(X,'pinco',cx,by,h*1.5,t,o);
 if(k==='home'){drawBG(X,'bedroom',W,H,'#ff7eb6',t);fillP(X,rrP(W*.05,H*.62,W*.9,H*.16,20),'#fff6fb','#c88',4);pin(W/2,H*.78,H*.34*(1+u*.05),{rot:-.15});blanket(W*.5,H*.66,1);X.fillStyle='#fff';X.font='900 30px '+FONT;X.fillText('z z z',W*.7,H*.4-u*10);}
 else if(k==='shadow'){X.fillStyle='#0a0618';X.fillRect(0,0,W,H);pin(W/2,H*.78,H*.34,{rot:-.15,a:.5});blanket(W*.5,H*.66,1);const sx=W*1.2-u*W*.5;X.fillStyle='rgba(0,0,0,.85)';X.beginPath();X.ellipse(sx,H*.5,W*.35,H*.45,0,0,7);X.fill();X.fillRect(sx-W*.5,H*.55,W*.3,24);if(Math.random()<.04){X.fillStyle='rgba(255,255,255,.5)';X.fillRect(0,0,W,H);}}
 else if(k==='yank'){X.fillStyle='#1a1030';X.fillRect(0,0,W,H);const sh=Math.sin(t*70)*10*(1-Math.min(1,u));pin(W/2+sh,H*.8,H*.4*(1+u*.2),{rot:Math.sin(t*40)*.05});blanket(W*.5+u*W*1.6,H*.66-u*H*.3,1-u*.3,u*3);}
 else if(k==='rain'){X.fillStyle='#141a3a';X.fillRect(0,0,W,H);X.fillStyle='#0c1028';for(let i=0;i<7;i++)X.fillRect(i*W/6-10,H*(.25+((i*37)%30)/100),W/7,H);X.fillStyle='#ffe58a33';X.fill(circP(W*.8,H*.3,40));rain(X,t);X.fillStyle='#1a2040';X.fillRect(0,H*.82,W,H*.2);
  pin(W*.2+u*W*.25,H*.88,H*.26,{rot:Math.sin(t*6)*.05,opt:{ph:t*6}});}
 else if(k==='help'){X.fillStyle='#141a3a';X.fillRect(0,0,W,H);rain(X,t);pin(W*.5,H*.75,H*.3,{rot:Math.sin(t*2)*.03});X.fillStyle='rgba(255,255,255,'+(.15+.1*Math.sin(t*6))+')';X.fill(circP(W*.5,H*.6,H*.25));}
 else if(k==='spot'){X.fillStyle='#141a3a';X.fillRect(0,0,W,H);rain(X,t);const g=X.createRadialGradient(W*.7,H*.6,10,W*.7,H*.6,H*.4);g.addColorStop(0,'rgba(255,250,200,.7)');g.addColorStop(1,'rgba(255,250,200,0)');X.fillStyle=g;X.fillRect(0,0,W,H);
  pin(W*.3,H*.82,H*.3);drawCut(X,'party',W*1.1-Math.min(1,u*2)*W*.4,H*.82,H*.4,t,{rot:Math.sin(t*8)*.06});}
 else if(k==='star'){drawBG(X,'concert',W,H,'#ff3d8b',t);pin(W*.5,H*.86,H*.5*(1+Math.sin(t*4)*.02));if(Math.random()<.6)burst(Math.random()*W,Math.random()*H*.6,3,['#fff','#ffcc33','#ff7eb6'],120);}};
function blanket(cx,cy,s,rot){X.save();X.translate(cx,cy);X.rotate(rot||0);X.scale(s,s);const p=new Path2D();p.moveTo(-W*.42,0);p.quadraticCurveTo(0,-30,W*.42,0);p.lineTo(W*.44,H*.13);p.quadraticCurveTo(0,H*.1,-W*.44,H*.13);p.closePath();fillP(X,p,'#ff9fca','#ff7eb6',4);
 X.save();X.clip(p);X.fillStyle='#ffd6ea';for(let i=-6;i<7;i++)X.fill(heartP(i*40,40+(i%2)*30,10));X.restore();X.restore();}
// ---- ending ----
function ending(){scene='end';st=0;show('s-intro');document.querySelector('#s-intro .skip').style.display='none';$('in-cap').textContent=T('theend');$('in-help').classList.remove('on');SFX.cheer();playSong('title');}
SC3.end=function(t){drawBG(X,'ballroom',W,H,'#ffcc33',t);drawCut(X,'pinco',W/2,H*.97,H*.62,t,{outfit:Object.assign({},PINO(),{hat:'crown'}),opt:{arm:poseArm('princess',t)}});if(Math.random()<.6)burst(Math.random()*W,0,3,['#ffcc33','#ff7eb6','#fff','#b39dff'],80);
 X.save();X.textAlign='center';X.fillStyle='#fff';X.font='800 15px '+FONT;X.fillText(T('o_by'),W/2,H*.93);X.restore();if(t>7&&!SC3.endT){SC3.endT=1;}};
document.addEventListener('pointerup',e=>{if(scene==='end'&&st>2.5&&!e.target.closest('button')){SC3.endT=0;goTitle();}});
