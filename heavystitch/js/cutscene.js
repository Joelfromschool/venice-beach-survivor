/* Heavy Stitch: anime-style cutscene player (letterbox, Ken Burns, speed lines, stings, typewriter). */
'use strict';
const CUT={shots:null,i:0,done:null,typing:0,full:'',raf:0,fx:null,fxT:0,cache:{},
 $:id=>document.getElementById(id),
 async charImg(c){const S=HS.state;let key,load,paint;
  if(c.armor==='ace'){const a=ACES[c.id];key='ace_'+c.id;load=a.load;paint=a.paint;}
  else if(c.armor){load=S.load[c.id]||STARTER;paint=PAINTS.find(p=>p.id===(S.paint[c.id]||'grey'))||PAINTS[0];key=c.id+JSON.stringify(load)+paint.id;}
  if(!load){return CHARS[c.id].img;}
  if(this.cache[key])return this.cache[key];
  const r=await composeAsync(c.id,load,paint,{scale:1.6});const url=r.canvas.toDataURL('image/png');this.cache[key]=url;return url;},
 play(shots,done){this.shots=shots;this.i=0;this.done=done;HS.show('sCut');AU.playMusic(shots.music||'debrief');this.show();},
 async show(){const s=this.shots[this.i];if(!s){return this.end();}
  const L=HS.lang,stage=document.querySelector('.cstage');
  const bg=this.$('cBg');bg.className='cbg';void bg.offsetWidth;bg.style.backgroundImage=`url(art/${s.bg||'bg_sky'}.webp)`;bg.classList.add('kb'+(1+this.i%3));if(s.fx==='red')bg.classList.add('red');
  const ct=this.$('cTitle');ct.className='ctitle';ct.innerHTML='';
  const cc=this.$('cChars');cc.innerHTML='';
  if(s.card){const m=s.card;ct.classList.add('on');
   ct.innerHTML=m.free?`<div class="k">${HS.T('free')}</div><div class="t">${m.title[L]}</div>`:
    `<div class="k">${L==='ja'?'EPISODE':HS.T('ep')}</div><div class="n">${String(m.ep).padStart(2,'0')}</div><div class="t">${m.title.en}</div><div class="j">第${m.ep}話「${m.title.ja}」</div>`;}
  else if(s.title){ct.classList.add('on');ct.style.background='none';ct.innerHTML=`<h1 class="logo"><span>HEAVY</span><span>STITCH</span></h1><div class="j">ヘビー・スティッチ</div><div class="k" style="margin-top:14px">${HS.T('brand')}</div>`;}
  else if(s.credits){ct.classList.add('on');ct.innerHTML=`<div class="cr">${HS.T('creditsTxt').replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div>`;}
  if(!s.title)ct.style.background='';
  if(s.chars){const n=s.chars.length;for(const c of s.chars){const im=new Image();im.className='cchar in'+(s.fx==='zoom'?' zoom':'');im.style.left=(c.x*100)+'%';
    if(c.s)im.style.height=(82*c.s)+'%';if(s.who&&c.id!==s.who&&n>1)im.classList.add('dim');
    cc.appendChild(im);this.charImg(c).then(u=>im.src=u);}}
  // dialogue
  const dl=this.$('cDlg');const txt=s[L]||s.en||'';dl.style.display=(s.card||s.title||s.credits)&&!txt?'none':'';
  dl.classList.toggle('narr',!s.who);this.$('cName').textContent=s.who?CHARS[s.who].name[L]:'';
  this.full=txt;this.typing=0;this.$('cText').textContent='';
  // fx
  stage.classList.remove('shake');if(s.fx==='shake'||s.sting==='boom'){void stage.offsetWidth;stage.classList.add('shake');}
  const fl=this.$('cFlash');fl.classList.remove('on');if(s.fx==='slash'||s.fx==='flash'||s.sting==='hit'||s.card){void fl.offsetWidth;fl.classList.add('on');}
  this.fx=s.fx||(s.card?'lines':null);this.fxT=0;
  const st=s.card?'hitst':s.sting==='hit'?'hitst':s.sting==='clank'?'clank':s.sting;if(st)AU.play(st);
  if(s.card)AU.play('whoosh');
  this.loop();},
 loop(){cancelAnimationFrame(this.raf);let last=performance.now();const cv=this.$('cFx'),c=cv.getContext('2d');
  const step=(now)=>{const dt=Math.min(.05,(now-last)/1000);last=now;this.fxT+=dt;
   // typewriter
   if(this.typing<this.full.length){const sp=HS.lang==='ja'?38:60;const n=Math.min(this.full.length,this.typing+sp*dt);if(Math.floor(n)>Math.floor(this.typing)&&Math.floor(n)%3===0)AU.play('type',.6);this.typing=n;this.$('cText').textContent=this.full.slice(0,Math.floor(this.typing));}
   const W=cv.clientWidth,H=cv.clientHeight;if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}c.clearRect(0,0,W,H);
   if(this.fx==='lines'||this.fx==='zoom'){c.save();c.translate(W/2,H*.45);const R=Math.hypot(W,H);c.fillStyle='rgba(255,255,255,.16)';
    for(let i=0;i<70;i++){const a=(i*137.5+Math.floor(this.fxT*14)*31)%360*Math.PI/180,w=.004+((i*7)%5)*.002,r0=R*(.32+((i*13)%7)*.03);
     c.beginPath();c.moveTo(Math.cos(a-w)*R,Math.sin(a-w)*R);c.lineTo(Math.cos(a)*r0,Math.sin(a)*r0);c.lineTo(Math.cos(a+w)*R,Math.sin(a+w)*R);c.fill();}c.restore();}
   if(this.fx==='slash'&&this.fxT<.6){const t=this.fxT/.6;c.save();c.globalAlpha=1-t;c.fillStyle='#fff';c.translate(W*(t*1.4-.2),H/2);c.rotate(-.5);c.fillRect(-W,-6,W*2,12);c.fillStyle='#ff7a1a';c.fillRect(-W,10,W*2,4);c.restore();}
   // halftone corner
   c.save();c.fillStyle='rgba(0,0,0,.22)';for(let y=0;y<H;y+=10)for(let x=W*.72+((y/10)%2)*5;x<W;x+=10){const r=((x-W*.72)/(W*.28))*3.2;c.beginPath();c.arc(x,y,r,0,7);c.fill();}c.restore();
   this.raf=requestAnimationFrame(step);};
  this.raf=requestAnimationFrame(step);},
 tap(){if(this.typing<this.full.length){this.typing=this.full.length;this.$('cText').textContent=this.full;return;}this.i++;AU.play('ui',.5);this.show();},
 end(){cancelAnimationFrame(this.raf);const d=this.done;this.done=null;this.shots=null;if(d)d();},
 init(){const st=this.$('sCut');st.addEventListener('pointerdown',e=>{if(e.target.closest('#cSkip'))return;AU.unlock();this.tap();});
  this.$('cSkip').addEventListener('click',e=>{e.stopPropagation();AU.play('back');this.end();});}
};
