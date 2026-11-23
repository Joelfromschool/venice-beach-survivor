'use strict';
// PincoPop clip renderer: draws a clip deterministically for any time t (seconds), so clips can pause, loop and preview instantly.
const RD=(()=>{
 const IMG={},BL={},VID={};
 const PI=Math.PI,TAU=PI*2;
 const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,k)=>a+(b-a)*k;
 const E={io:k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,out:k=>1-Math.pow(1-k,3),in:k=>k*k*k,back:k=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2)},bounce:k=>{const n=7.5625,d=2.75;if(k<1/d)return n*k*k;if(k<2/d)return n*(k-=1.5/d)*k+.75;if(k<2.5/d)return n*(k-=2.25/d)*k+.9375;return n*(k-=2.625/d)*k+.984375},lin:k=>k};
 const hr=(i,k)=>{const x=Math.sin(i*12.9898+k*78.233)*43758.5453;return x-Math.floor(x)};
 const FONT='system-ui,-apple-system,"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Segoe UI",sans-serif';
 // ---------- assets ----------
 function load(name){if(IMG[name])return IMG[name].p;const im=new Image();im.decoding='async';const e={im,ok:false};
  e.p=new Promise(res=>{im.onload=()=>{e.ok=true;res(im)};im.onerror=()=>res(null)});im.src='art/'+name+'.webp?v='+(window.__BUILD__||'');IMG[name]=e;return e.p}
 const get=n=>{const e=IMG[n];return e&&e.ok?e.im:null};
 function blurOf(n){if(BL[n])return BL[n];const im=get(n);if(!im)return null;const c=document.createElement('canvas');c.width=72;c.height=128;const x=c.getContext('2d');x.drawImage(im,0,0,72,128);const c2=document.createElement('canvas');c2.width=36;c2.height=64;c2.getContext('2d').drawImage(c,0,0,36,64);BL[n]=c2;return c2}
 function assets(clip){const s=new Set();const walk=sh=>{if(sh.bg&&sh.bg!=='video'&&!sh.bg.startsWith('#'))s.add('bg_'+sh.bg);(sh.a||[]).forEach(a=>{s.add(a[0]);const o=a[5]||{};(o.sw||[]).forEach(w=>s.add(w[1]))});(sh.panes||[]).forEach(walk)};clip.shots.forEach(walk);(clip.shots||[]).forEach(sh=>(sh.fx||[]).forEach(f=>{const o=f[3]||{};(o.items||[]).forEach(it=>s.add(it[0]));(o.imgs||[]).forEach(it=>s.add('bg_'+it[0]));if(o.img)s.add(f[0]==='card'?'bg_'+o.img:o.img)}));if(clip.live&&typeof CREATORS!=='undefined')clip.live.chat.forEach(c=>{const cr=CREATORS[c[1]];if(cr)s.add(cr.av)});return [...s]}
 function loadClip(clip){if(!clip._assets)clip._assets=assets(clip);return Promise.all(clip._assets.map(load))}
 const ready=clip=>(clip._assets||(clip._assets=assets(clip))).every(n=>IMG[n]&&IMG[n].ok);
 // ---------- normalize: beats -> seconds, compute event list ----------
 function norm(clip){if(clip._n)return clip;const spb=60/clip.bpm;let T=0;const ev=[];
  const cv=sh=>{sh.d*=spb;(sh.a||[]).forEach(a=>{const o=a[5];if(!o)return;if(o.t)o.t=o.t.map(x=>x*spb);if(o.sw)o.sw.forEach(w=>w[0]*=spb);if(o.mvd)o.mvd*=spb;if(o.mt)o.mt=o.mt*spb});
   (sh.tx||[]).forEach(t=>{t[0]*=spb;t[1]*=spb});(sh.fx||[]).forEach(f=>{f[1]*=spb;f[2]*=spb;if(f[0]==='tier'&&f[3]&&f[3].items)f[3].items=f[3].items.map(it=>[it[0],it[1],it[2]*spb])});(sh.sx||[]).forEach(s=>{s[0]*=spb});if(sh.pz)sh.pz=sh.pz.map(x=>x*spb);if(sh.shake)sh.shake=[sh.shake[0]*spb,sh.shake[1]*spb,sh.shake[2]];(sh.panes||[]).forEach(p=>{p.d=sh.d/spb;cv(p);p.d=sh.d})};
  if(clip.live){clip.live.chat.forEach(c=>{c[0]*=spb;ev.push([c[0],'notif'])});(clip.live.gifts||[]).forEach((g,i,a)=>{a[i]=g*spb;ev.push([a[i],'gift'])})}
  clip.shots.forEach(sh=>{cv(sh);sh.t0=T;
   const add=s=>{(s.sx||[]).forEach(x=>ev.push([T+x[0],x[1],x[2]]));(s.tx||[]).forEach(t=>{const o=t[6]||{};if(t[4]==='bub'&&o.who){const w=(t[2]||'').split(/\s+/).length;ev.push([T+t[0]+.04,'voice',o.who,Math.max(3,Math.min(12,Math.round(w*1.6)))])}});(s.panes||[]).forEach(add)};
   add(sh);if(sh.tr&&sh.tr!=='cut'&&sh.t0>0){const m={whip:'whoosh',zoom:'swish',wipe:'swish',spin:'whoosh',flash:null,glitch:'scratch',slide:'swish'}[sh.tr];if(m&&!sh.notrsfx)ev.push([T-.08,m])}
   T+=sh.d});
  clip.dur=clip.vid?(clip.vdur||T):T;ev.sort((a,b)=>a[0]-b[0]);clip._ev=ev;clip._n=1;return clip}
 // ---------- text cache ----------
 const TC=new Map();let tcN=0;
 function wrap(x,str,maxW){const out=[];str.split('\n').forEach(par=>{const cjk=/[\u3000-\u9fff\uff00-\uffef]/.test(par);
  // CJK lines break between characters but keep latin words (romaji, English) whole and keep their spaces
  const toks=cjk?(par.match(/[\u3000-\u303f\uff01-\uff60、。！？」』）]+|[a-zA-Z0-9$%#@.'’:+\-/?!,\u00c0-\u024f]+| +|\S/g)||[]):par.split(' ');let line='';
  for(const tk of toks){if(cjk&&/^ +$/.test(tk)){if(line)line+=' ';continue}const sep=cjk?'':(line?' ':'');let test=line+sep+tk;if(x.measureText(test.trimEnd()).width>maxW&&line.trim()&&!(cjk&&/^[、。！？」』）,.!?]+$/.test(tk))){out.push(line.trimEnd());line=tk}else line=test}
  line=line.trimEnd();
  // keep closing punctuation on its line
  if(line)out.push(line)});return out}
 function textCanvas(str,st,fs,maxW,o){o=o||{};const key=st+'|'+fs+'|'+maxW+'|'+(o.c||'')+'|'+str;let r=TC.get(key);if(r)return r;
  if(TC.size>420){TC.clear()}
  const c=document.createElement('canvas'),x=c.getContext('2d');const jp=/[\u3040-\u30ff\u4e00-\u9fff]/.test(str);try{if('lang' in x)x.lang=jp?'ja':'en';else c.setAttribute('lang',jp?'ja':'en')}catch(e){}const wt=st==='sub'||st==='bub'||st==='cap'||st==='chat'?800:st==='note'||st==='retro'||st==='serif'?700:900;const FF=st==='retro'?'"Courier New",ui-monospace,Menlo,monospace,'+FONT:st==='serif'?'Georgia,"Times New Roman","Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif':FONT;
  x.font=`${wt} ${fs}px ${FF}`;const lines=wrap(x,str,maxW);const lh=fs*1.24;
  const pad=st.startsWith('pill')||st==='note'||st==='pink'||st==='yel'||st==='mint'||st==='tag'||st==='loc'||st==='lower'||st==='type'||st==='chat'?fs*.42:st==='serif'||st==='manga'?fs*.7:st==='neon'?fs*.45:st==='bub'?fs*.62:st==='stamp'?fs*.5:fs*.2;
  const ws=lines.map(l=>x.measureText(l).width);const W=Math.ceil(Math.max(...ws,1)+pad*2+fs*.3),H=Math.ceil(lines.length*lh+pad*2+fs*.25);
  c.width=W;c.height=H;try{if('lang' in x)x.lang=jp?'ja':'en'}catch(e){}x.font=`${wt} ${fs}px ${FF}`;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
  const bgc={note:'rgba(20,10,20,.72)',pill:'#fff',pillk:'rgba(10,10,14,.78)',pink:'#ff4f9a',yel:'#ffd84a',mint:'#38dcb0',tag:'rgba(255,255,255,.92)',loc:'#fff',lower:o.bg||'#ff2d55',type:'rgba(12,12,16,.82)',chat:'rgba(0,0,0,.38)'}[st];
  const fgc=o.c||({note:'#fff',pill:'#111',pillk:'#fff',pink:'#fff',yel:'#111',mint:'#0b2b22',tag:'#e0337a',bub:'#222',stamp:'#e82c4a',loc:'#e8235a',lower:'#fff',type:'#7dffb0',serif:'#f3e6c8',manga:'#111',neon:'#fff',retro:'#f6f6f6',cap:'#fff'}[st]||'#fff');
  if(bgc){x.fillStyle=bgc;lines.forEach((l,i)=>{const w=ws[i]+pad*2,yy=pad*.5+i*lh;rr(x,(W-w)/2,yy,w,lh+pad*.9,fs*.38);x.fill()})}
  if(st==='bub'){x.fillStyle='#fff';rr(x,1,1,W-2,H-2,fs*.9);x.fill();x.strokeStyle='rgba(0,0,0,.12)';x.lineWidth=2;x.stroke()}
  if(st==='serif'){x.fillStyle='rgba(12,9,6,.9)';x.fillRect(0,0,W,H);x.strokeStyle='#d8c49a';x.lineWidth=Math.max(1,fs*.06);x.strokeRect(fs*.22,fs*.22,W-fs*.44,H-fs*.44);x.strokeRect(fs*.34,fs*.34,W-fs*.68,H-fs*.68)}
  if(st==='manga'){x.fillStyle='#fff';x.strokeStyle='#111';x.lineWidth=fs*.16;x.beginPath();const n=14;for(let i=0;i<n*2;i++){const a=i*PI/n,rx=(W/2-fs*.12)*(i%2?.9:1),ry=(H/2-fs*.12)*(i%2?.82:1);x.lineTo(W/2+Math.cos(a)*rx,H/2+Math.sin(a)*ry)}x.closePath();x.fill();x.stroke()}
  if(st==='stamp'){x.strokeStyle=fgc;x.lineWidth=fs*.14;rr(x,fs*.1,fs*.1,W-fs*.2,H-fs*.2,fs*.3);x.stroke()}
  lines.forEach((l,i)=>{const yy=(bgc?pad*.5+lh*.5+pad*.45:pad+lh*.5)+i*lh;
   if(st==='neon'){x.save();x.shadowColor=o.g||'#ff4fd8';x.shadowBlur=fs*.5;x.strokeStyle=o.g||'#ff4fd8';x.lineWidth=fs*.12;x.strokeText(l,W/2,yy);x.shadowBlur=fs*.25;x.strokeText(l,W/2,yy);x.restore()}
   else if(st==='retro'){x.strokeStyle='rgba(0,0,0,.85)';x.lineWidth=fs*.22;x.lineJoin='round';x.strokeText(l,W/2,yy);x.fillStyle='rgba(0,0,0,.6)';x.fillText(l,W/2+fs*.08,yy+fs*.08)}
   else if(!bgc&&st!=='bub'&&st!=='stamp'&&st!=='serif'&&st!=='manga'){x.strokeStyle=o.sc||'#111';x.lineWidth=fs*(st==='sub'||st==='cap'?.2:.24);x.strokeText(l,W/2,yy+fs*.04)}
   x.fillStyle=fgc;x.fillText(l,W/2,yy)});
  r={c,w:W,h:H};TC.set(key,r);return r}
 function rr(x,a,b,w,h,r){r=Math.min(r,h/2,w/2);x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
 // ---------- shapes ----------
 function heart(x,cx,cy,s){x.beginPath();x.moveTo(cx,cy+s*.35);x.bezierCurveTo(cx-s*.9,cy-s*.2,cx-s*.45,cy-s*.95,cx,cy-s*.42);x.bezierCurveTo(cx+s*.45,cy-s*.95,cx+s*.9,cy-s*.2,cx,cy+s*.35);x.closePath()}
 function star4(x,cx,cy,s){x.beginPath();for(let i=0;i<8;i++){const a=i*PI/4,r=i%2?s*.28:s;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}x.closePath()}
 function star5(x,cx,cy,s){x.beginPath();for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,r=i%2?s*.45:s;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}x.closePath()}
 function burst(x,cx,cy,s,n){x.beginPath();for(let i=0;i<n*2;i++){const a=i*PI/n,r=i%2?s*.62:s*(1+.12*Math.sin(i*1.7));x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}x.closePath()}
 function coin(x,cx,cy,s,sp){const w=Math.abs(Math.cos(sp))*s+.5;x.fillStyle='#e9a81b';x.beginPath();x.ellipse(cx,cy,w,s,0,0,TAU);x.fill();x.fillStyle='#ffd451';x.beginPath();x.ellipse(cx,cy,w*.78,s*.78,0,0,TAU);x.fill();if(w>s*.4){x.fillStyle='#c98a0c';x.font=`900 ${s*1.1}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.save();x.translate(cx,cy);x.scale(w/s,1);x.fillText('$',0,s*.05);x.restore()}}
 function bill(x,cx,cy,s,rot){x.save();x.translate(cx,cy);x.rotate(rot);x.fillStyle='#5dbb63';x.fillRect(-s,-s*.5,s*2,s);x.strokeStyle='#2e7d32';x.lineWidth=s*.1;x.strokeRect(-s*.85,-s*.38,s*1.7,s*.76);x.fillStyle='#2e7d32';x.font=`900 ${s*.7}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('$',0,s*.03);x.restore()}
 // ---------- fx ----------
 function drawFx(x,f,lt,R,T,front){const [k,t0,t1,o0]=f;const o=o0||{};if(lt<t0||lt>t1)return;const la=lt-t0,dur=t1-t0;const W=R.w,H=R.h;const cx=R.x+(o.x==null?.5:o.x)*W,cy=R.y+(o.y==null?.5:o.y)*H;const s=W*(o.s||1);
  const back=['rays','glow','spot','vignette','bgtint'].includes(k)||!!o.back||((k==='coins'||k==='money')&&!o.front);if(back===!!front)return;
  const fin=Math.min(1,la/.2),fout=Math.min(1,(t1-lt)/.25),A=Math.min(fin,fout);x.save();
  switch(k){
   case 'rays':{x.globalAlpha=.35*A;x.translate(cx,cy);x.rotate(la*.4);x.fillStyle=o.c||'#fff6c8';for(let i=0;i<14;i++){x.rotate(TAU/14);x.beginPath();x.moveTo(0,0);x.lineTo(H,-H*.12);x.lineTo(H,H*.12);x.closePath();x.fill()}break}
   case 'glow':{const g=x.createRadialGradient(cx,cy,0,cx,cy,s*.6);g.addColorStop(0,o.c||'rgba(255,240,200,.75)');g.addColorStop(1,'rgba(255,240,200,0)');x.globalAlpha=A;x.fillStyle=g;x.fillRect(R.x,R.y,W,H);break}
   case 'spot':{const g=x.createRadialGradient(cx,cy,W*.1,cx,cy,W*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.72)');x.globalAlpha=A;x.fillStyle=g;x.fillRect(R.x,R.y,W,H);break}
   case 'vignette':{const g=x.createRadialGradient(R.x+W/2,R.y+H/2,H*.3,R.x+W/2,R.y+H/2,H*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,o.c||'rgba(0,0,0,.55)');x.globalAlpha=A;x.fillStyle=g;x.fillRect(R.x,R.y,W,H);break}
   case 'bgtint':{x.globalAlpha=A*(o.a||.35);x.fillStyle=o.c||'#000';x.fillRect(R.x,R.y,W,H);break}
   case 'hearts':{const n=o.n||14;for(let i=0;i<n;i++){const sp=hr(i,1)*1.2,age=(la-sp*dur*.6);if(age<0)continue;const life=1.6,p=(age%life)/life;if(age>life&&!o.loop)continue;const hx=cx+(hr(i,2)-.5)*W*(o.w||.5)+Math.sin(p*6+i)*W*.03,hy=cy-p*H*.35;x.globalAlpha=(1-p)*A;x.fillStyle=['#ff4f9a','#ff2d55','#ff8fc4','#ffffff'][i%4];heart(x,hx,hy,W*.03*(.7+hr(i,3)));x.fill()}break}
   case 'sparkle':{const n=o.n||12;for(let i=0;i<n;i++){const ph=(la*1.6+hr(i,4))%1;const a=Math.sin(ph*PI);const r=(o.r||.25)*W;const sx=cx+(hr(i,5)-.5)*2*r,sy=cy+(hr(i,6)-.5)*2*r*1.3;x.globalAlpha=a*A;x.fillStyle=o.c||(i%3?'#fff':'#ffe27a');star4(x,sx,sy,W*.028*(.5+hr(i,7))*a);x.fill()}break}
   case 'confetti':{const n=o.n||50;const cols=['#ff4f9a','#ffd84a','#38dcb0','#5aa9ff','#b07bff','#ff8a3d'];for(let i=0;i<n;i++){const d=hr(i,8)*.6;const age=la-d;if(age<0)continue;const fy=R.y-H*.05+age*H*(.35+hr(i,9)*.3),fx=R.x+hr(i,10)*W+Math.sin(age*3+i)*W*.04;if(fy>R.y+H)continue;x.save();x.globalAlpha=A;x.translate(fx,fy);x.rotate(age*(3+i%5));x.scale(1,Math.cos(age*6+i));x.fillStyle=cols[i%6];x.fillRect(-W*.012,-W*.007,W*.024,W*.014);x.restore()}break}
   case 'money':{const n=o.n||26;for(let i=0;i<n;i++){const d=hr(i,11)*.8;let age=la-d;if(age<0)continue;if(dur>3.2)age%=2.6;const fy=R.y-H*.06+age*H*(.4+hr(i,12)*.35),fx=R.x+hr(i,13)*W+Math.sin(age*2+i)*W*.05;if(fy>R.y+H*1.05)continue;x.globalAlpha=A;if(i%3===0)bill(x,fx,fy,W*.045,Math.sin(age*3+i)*.6);else coin(x,fx,fy,W*.028,age*7+i)}break}
   case 'coins':{const n=o.n||10;for(let i=0;i<n;i++){const d=i*.05;const age=la-d;if(age<0)continue;const k2=Math.min(1,age/.9);const vx=(i%2?1:-1)*W*(.2+hr(i,14)*.3),vy=-H*(.3+hr(i,15)*.25);const px=cx+vx*k2,py=cy+vy*k2+H*1.1*k2*k2;x.globalAlpha=A*(1-Math.max(0,k2-.8)*5);coin(x,px,py,W*.03,age*9+i)}break}
   case 'steam':{const n=o.n||7;for(let i=0;i<n;i++){const p=((la*.5+hr(i,16))%1);const sx=cx+(hr(i,17)-.5)*W*.12+Math.sin(p*5+i)*W*.03,sy=cy-p*H*.2;x.globalAlpha=(1-p)*.45*A;x.fillStyle=o.c||'#fff';x.beginPath();x.arc(sx,sy,W*(.025+p*.05),0,TAU);x.fill()}break}
   case 'smoke':{const n=o.n||10;for(let i=0;i<n;i++){const p=((la*.45+hr(i,18))%1);const sx=cx+(hr(i,19)-.5)*W*.2+p*W*.06,sy=cy-p*H*.3;x.globalAlpha=(1-p)*.6*A;x.fillStyle=i%2?'#6b6b6b':'#8d8d8d';x.beginPath();x.arc(sx,sy,W*(.04+p*.08),0,TAU);x.fill()}break}
   case 'zzz':{for(let i=0;i<3;i++){const p=((la*.45+i/3)%1);x.globalAlpha=Math.sin(p*PI)*A;x.fillStyle=o.c||'#fff';x.strokeStyle='#3a3a7a';x.lineWidth=W*.008;x.font=`900 ${W*(.05+p*.05)}px ${FONT}`;x.textAlign='center';const zx=cx+p*W*.12+Math.sin(p*6)*W*.02,zy=cy-p*H*.14;x.strokeText('Z',zx,zy);x.fillText('Z',zx,zy)}break}
   case 'stars':{const n=5;for(let i=0;i<n;i++){const a=la*4+i*TAU/n;x.globalAlpha=A;x.fillStyle='#ffd84a';x.strokeStyle='#b8860b';x.lineWidth=2;star5(x,cx+Math.cos(a)*W*.12,cy+Math.sin(a)*W*.04,W*.03);x.fill();x.stroke()}break}
   case 'tears':{for(let i=0;i<10;i++){const p=((la*1.3+i/10)%1);const side=i%2?1:-1;const tx=cx+side*(W*.05+p*W*.14),ty=cy+(-p*.12+p*p*.5)*H*.4;x.globalAlpha=(1-p)*A;x.fillStyle='#7cc8ff';x.beginPath();x.arc(tx,ty,W*.012,0,TAU);x.fill()}break}
   case 'sweat':{const p=(la*1.2)%1;x.globalAlpha=A*(1-p*.6);x.fillStyle='#8fd3ff';x.beginPath();const sx=cx,sy=cy+p*H*.06;x.moveTo(sx,sy-W*.035);x.quadraticCurveTo(sx+W*.025,sy,sx,sy+W*.02);x.quadraticCurveTo(sx-W*.025,sy,sx,sy-W*.035);x.fill();break}
   case 'lines':{x.globalAlpha=.75*A;x.strokeStyle=o.c||'#fff';const n=26;for(let i=0;i<n;i++){const a=i*TAU/n+hr(i,20)*.2,flick=hr(i,Math.floor(la*14))>.35;if(!flick)continue;x.lineWidth=W*.006*(1+hr(i,21));const r0=W*.55,r1=H*.8;x.beginPath();x.moveTo(R.x+W/2+Math.cos(a)*r0,R.y+H/2+Math.sin(a)*r0*1.4);x.lineTo(R.x+W/2+Math.cos(a)*r1,R.y+H/2+Math.sin(a)*r1);x.stroke()}break}
   case 'speed':{x.globalAlpha=.6*A;x.strokeStyle='#fff';for(let i=0;i<14;i++){const yy=R.y+hr(i,22)*H,len=W*(.2+hr(i,23)*.4),xx=R.x+((hr(i,24)*W*2-la*W*3.2)%(W*2)+W*2)%(W*2)-W*.5;x.lineWidth=W*.006;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+len,yy);x.stroke()}break}
   case 'notes':{for(let i=0;i<6;i++){const p=((la*.4+i/6)%1);x.globalAlpha=Math.sin(p*PI)*A;x.fillStyle=['#ff4f9a','#5aa9ff','#ffd84a'][i%3];x.font=`900 ${W*.07}px ${FONT}`;x.textAlign='center';x.fillText(i%2?'♪':'♫',cx+(hr(i,25)-.5)*W*.5+Math.sin(p*6)*W*.04,cy-p*H*.25)}break}
   case 'mist':{for(let i=0;i<40;i++){const p=((la*1.8+hr(i,26))%1);const ang=(o.a||-2.6)+(hr(i,27)-.5)*.5;x.globalAlpha=(1-p)*.55*A;x.fillStyle='#fff';x.beginPath();x.arc(cx+Math.cos(ang)*p*W*.35,cy+Math.sin(ang)*p*W*.35,W*.006+p*W*.012,0,TAU);x.fill()}break}
   case 'impact':{const p=Math.min(1,la/.15);x.globalAlpha=A;x.translate(cx,cy);x.rotate(.2);x.scale(p,p);x.fillStyle=o.c||'#ffd84a';x.strokeStyle='#111';x.lineWidth=W*.012;burst(x,0,0,W*(o.s||.16),10);x.fill();x.stroke();if(o.t){x.fillStyle='#e8233f';x.font=`900 ${W*.07}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(o.t,0,0)}break}
   case 'flash':{x.globalAlpha=Math.max(0,1-la/(dur||.3))*(o.a||.9);x.fillStyle=o.c||'#fff';x.fillRect(R.x,R.y,W,H);break}
   case 'fade':{x.globalAlpha=clamp(la/dur,0,1);x.fillStyle=o.c||'#000';x.fillRect(R.x,R.y,W,H);break}
   case 'bars':{const h=H*.09*Math.min(1,la/.3);x.fillStyle='#000';x.fillRect(R.x,R.y,W,h);x.fillRect(R.x,R.y+H-h,W,h);break}
   case 'rec':{x.globalAlpha=A;x.fillStyle=(Math.floor(lt*2)%2)?'#ff2d2d':'rgba(255,45,45,.35)';x.beginPath();x.arc(R.x+W*.14,R.y+H*.14,W*.016,0,TAU);x.fill();x.fillStyle='#fff';x.font=`800 ${W*.04}px ${FONT}`;x.textBaseline='middle';x.fillText('REC  00:0'+Math.floor(la%10),R.x+W*.17,R.y+H*.142);x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=W*.006;const m=W*.08,L=W*.07;[[R.x+m,R.y+m+H*.04,1,1],[R.x+W-m,R.y+m+H*.04,-1,1],[R.x+m,R.y+H-m-H*.2,1,-1],[R.x+W-m,R.y+H-m-H*.2,-1,-1]].forEach(([a,b,sx,sy])=>{x.beginPath();x.moveTo(a,b+L*sy);x.lineTo(a,b);x.lineTo(a+L*sx,b);x.stroke()});break}
   case 'arrow':{const p=E.back(Math.min(1,la/.3));x.globalAlpha=A;x.translate(cx,cy);x.rotate(o.r||0);x.scale(p,p);x.fillStyle=o.c||'#ff2d55';x.strokeStyle='#fff';x.lineWidth=W*.008;x.beginPath();const L=W*.16;x.moveTo(0,0);x.lineTo(-L*.3,-L*.25);x.lineTo(-L*.3,-L*.1);x.lineTo(-L,-L*.1);x.lineTo(-L,L*.1);x.lineTo(-L*.3,L*.1);x.lineTo(-L*.3,L*.25);x.closePath();x.fill();x.stroke();break}
   case 'check':case 'cross':{const p=E.back(Math.min(1,la/.25));x.globalAlpha=A;x.translate(cx,cy);x.scale(p,p);x.fillStyle=k==='check'?'#2fcf7a':'#ff3b4e';x.beginPath();x.arc(0,0,W*.07,0,TAU);x.fill();x.strokeStyle='#fff';x.lineWidth=W*.018;x.lineCap='round';x.beginPath();if(k==='check'){x.moveTo(-W*.03,0);x.lineTo(-W*.008,W*.025);x.lineTo(W*.035,-W*.025)}else{x.moveTo(-W*.028,-W*.028);x.lineTo(W*.028,W*.028);x.moveTo(W*.028,-W*.028);x.lineTo(-W*.028,W*.028)}x.stroke();break}
   case 'stars5':{const n=o.n||5;for(let i=0;i<5;i++){const p=E.back(clamp((la-i*.12)/.25,0,1));x.save();x.globalAlpha=A;x.translate(cx+(i-2)*W*.11,cy);x.scale(p,p);x.fillStyle=i<n?'#ffd84a':'rgba(255,255,255,.35)';x.strokeStyle='#b8860b';x.lineWidth=W*.006;star5(x,0,0,W*.045);x.fill();x.stroke();x.restore()}break}
   case 'smear':{x.globalAlpha=A*.85;x.strokeStyle='#ff3f8e';x.lineCap='round';x.lineWidth=W*.03;const n=Math.min(7,Math.floor(la*6)+1);for(let i=0;i<n;i++){x.beginPath();x.moveTo(cx+(hr(i,30)-.5)*W*.2,cy+(hr(i,31)-.5)*W*.14);x.quadraticCurveTo(cx+(hr(i,32)-.5)*W*.3,cy+(hr(i,33)-.5)*W*.2,cx+(hr(i,34)-.5)*W*.22,cy+(hr(i,35)-.5)*W*.15);x.stroke()}break}
   case 'nails':{const cols=o.cols||['#ff4f9a','#ffd84a','#38dcb0','#5aa9ff','#b07bff'];x.globalAlpha=A;for(let i=0;i<5;i++){const nx=cx+(i-2)*W*.15,ny=cy+Math.abs(i-2)*W*.035;x.fillStyle='#f4a7bb';rr(x,nx-W*.06,ny-W*.02,W*.12,W*.32,W*.06);x.fill();x.fillStyle='#ffe0e8';rr(x,nx-W*.045,ny,W*.09,W*.12,W*.045);x.fill();const fill=clamp((la-i*.35)/.3,0,1);if(fill>0){x.save();x.beginPath();rr(x,nx-W*.045,ny,W*.09,W*.12,W*.045);x.clip();x.fillStyle=cols[i%cols.length];x.fillRect(nx-W*.05,ny+W*.12*(1-fill),W*.1,W*.13);if(fill>=1&&o.gems){x.fillStyle='#fff';star4(x,nx,ny+W*.05,W*.025);x.fill()}x.fillStyle='rgba(255,255,255,.5)';x.fillRect(nx-W*.03,ny+W*.015,W*.012,W*.07);x.restore()}}break}
   case 'blush':{x.globalAlpha=A*.55;x.fillStyle='#ff6b9a';[[-1],[1]].forEach(([s2])=>{x.beginPath();x.ellipse(cx+s2*W*(o.d||.08),cy,W*.04,W*.022,0,0,TAU);x.fill()});break}
   case 'emoji':{const n=o.n||8;for(let i=0;i<n;i++){const p=((la*.55+hr(i,36))%1);x.globalAlpha=Math.sin(p*PI)*A;x.font=`${W*(.06+hr(i,37)*.04)}px ${FONT}`;x.textAlign='center';x.fillText(o.e||'😂',cx+(hr(i,38)-.5)*W*.7,cy-p*H*.3)}break}
   case 'count':{const n=o.from||3;const step=dur/n;const i=Math.min(n-1,Math.floor(la/step));const p=(la-i*step)/step;x.globalAlpha=A*(1-Math.max(0,p-.7)/.3);x.translate(cx,cy);const sc=1.4-E.out(Math.min(1,p*4))*.4;x.scale(sc,sc);x.font=`900 ${W*.3}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.lineWidth=W*.03;x.strokeStyle='#111';x.strokeText(String(n-i),0,0);x.fillStyle=o.c||'#fff';x.fillText(String(n-i),0,0);break}
   case 'bubbles':{for(let i=0;i<14;i++){const p=((la*.35+hr(i,39))%1);x.globalAlpha=(1-p)*.7*A;x.strokeStyle='#fff';x.lineWidth=W*.004;x.beginPath();x.arc(cx+(hr(i,40)-.5)*W*.5+Math.sin(p*5+i)*W*.03,cy-p*H*.4,W*(.012+hr(i,41)*.02),0,TAU);x.stroke()}break}
   case 'snow':{const n=o.n||60;for(let i=0;i<n;i++){const sp=.05+hr(i,50)*.08;const fy=((hr(i,51)+la*sp*(o.v||1))%1.05)-.03;const fx=hr(i,52)+Math.sin(la*.9+i)*.02;const r=W*(.004+hr(i,53)*.008);x.globalAlpha=A*(.5+hr(i,54)*.5);x.fillStyle='#fff';x.beginPath();x.arc(R.x+fx*W,R.y+fy*H,r,0,TAU);x.fill()}break}
   case 'bokeh':{const n=o.n||18;const cols=o.cols||['#ffd88a','#ffffff','#9fd0ff'];x.globalCompositeOperation='screen';for(let i=0;i<n;i++){const bx=R.x+hr(i,55)*W+Math.sin(la*.3+i)*W*.02,by=R.y+(o.y0==null?.05:o.y0)*H+hr(i,56)*H*(o.h||.6);const r=W*(.025+hr(i,57)*.05);const tw=.5+.5*Math.sin(la*(1+hr(i,58)*2)+i);const g=x.createRadialGradient(bx,by,0,bx,by,r);const c=cols[i%cols.length];g.addColorStop(0,c);g.addColorStop(.7,c);g.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=A*(.12+.22*tw);x.fillStyle=g;x.beginPath();x.arc(bx,by,r,0,TAU);x.fill()}break}
   case 'tier':{const rows=o.rows||['S','A','B','C'];const rc=['#ff5a6e','#ffa54a','#ffd84a','#8fe36a','#6ab7ff'];const V=VIS||R;const top=R.y+H*(o.y||.24),rh=H*(o.rh||.1),lw=V.w*.22,x0=V.x+V.w*.05,ww=V.w*.9;x.globalAlpha=A;
     rows.forEach((r,i)=>{const y=top+i*(rh+H*.008);x.fillStyle='rgba(20,20,28,.78)';x.fillRect(x0,y,ww,rh);x.fillStyle=rc[i%5];x.fillRect(x0,y,lw,rh);const lb=Array.isArray(r)?(LANG==='ja'&&r[1]?r[1]:r[0]):r;const tc=textCanvas(lb,'tier',Math.round(rh*.36),9999,{c:'#111'});const sc=Math.min(1,lw*.92/tc.w,rh*.9/tc.h);x.drawImage(tc.c,x0+lw/2-tc.w*sc/2,y+rh/2-tc.h*sc/2,tc.w*sc,tc.h*sc)});
     const cnt={};(o.items||[]).forEach(it=>{const [nm,row,at]=it;if(la<at)return;const k=E.back(clamp((la-at)/.3,0,1));const c=cnt[row]=(cnt[row]||0)+1;const im=get(nm);if(!im)return;const hh=rh*.86*k,wwi=hh*im.width/im.height;const y=top+row*(rh+H*.008)+rh/2;const xx=x0+lw+W*.015+(c-1)*rh*1.05+rh*.45;x.drawImage(im,xx-wwi/2,y-hh/2,wwi,hh)});break}
   case 'polaroid':{(o.imgs||[]).forEach((it,i)=>{const [nm,at,rt,px,py]=it;if(la<at)return;const k=E.out(clamp((la-at)/.35,0,1));const im=get('bg_'+nm);const pw=W*(o.s||.5),ph=pw*1.12;x.save();x.globalAlpha=A;x.translate(R.x+W*(px==null?.5:px),R.y+H*(py==null?.45:py)-(1-k)*H*.3);x.rotate((rt||0)*PI/180*k);x.scale(1+(1-k)*.4,1+(1-k)*.4);x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=W*.03;x.fillStyle='#fbfaf6';x.fillRect(-pw/2,-ph/2,pw,ph);x.shadowBlur=0;if(im){const iw=pw*.88,ih=iw;const sy=im.height*.18;x.drawImage(im,0,sy,im.width,im.width,-iw/2,-ph/2+pw*.06,iw,ih)}x.restore()});break}
   case 'card':{const im=get('bg_'+o.img);const cw=W*(o.w||.82),ch=H*(o.h||.42),cx0=R.x+(W-cw)/2,cy0=R.y+H*(o.y||.15);const k=E.back(clamp(la/.3,0,1));x.save();x.globalAlpha=A;x.translate(cx0+cw/2,cy0+ch/2);x.rotate((o.r||-2)*PI/180);x.scale(k,k);x.translate(-cw/2,-ch/2);x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=W*.04;x.fillStyle='#fff';rr(x,0,0,cw,ch,W*.03);x.fill();x.shadowBlur=0;x.save();rr(x,W*.02,H*.045,cw-W*.04,ch-H*.06,W*.02);x.clip();if(im){const s2=Math.max((cw-W*.04)/im.width,(ch-H*.06)/im.height);x.drawImage(im,(cw-im.width*s2)/2,H*.045+(ch-H*.06-im.height*s2)*.45,im.width*s2,im.height*s2)}x.restore();x.fillStyle=o.hc||'#ff4f9a';x.beginPath();x.arc(W*.05,H*.022,W*.018,0,TAU);x.fill();x.fillStyle='#ddd';x.fillRect(W*.08,H*.016,cw*.35,H*.012);x.restore();break}
   case 'map':{const pins=o.pins||[];x.globalAlpha=A;x.fillStyle='#f4efe2';x.fillRect(R.x,R.y,W,H);x.strokeStyle='#e2dac6';x.lineWidth=W*.02;for(let i=0;i<9;i++){x.beginPath();x.moveTo(R.x+hr(i,60)*W,R.y);x.lineTo(R.x+hr(i,61)*W,R.y+H);x.stroke();x.beginPath();x.moveTo(R.x,R.y+hr(i,62)*H);x.lineTo(R.x+W,R.y+hr(i,63)*H);x.stroke()}
     if(o.park){const [px,py,pw,ph]=o.park;x.fillStyle='#bfe3a6';rr(x,R.x+px*W,R.y+py*H,pw*W,ph*H,W*.08);x.fill();x.fillStyle='#8cc7e8';x.beginPath();x.ellipse(R.x+(px+pw*.5)*W,R.y+(py+ph*.55)*H,pw*W*.15,ph*H*.08,0,0,TAU);x.fill()}
     const prog=clamp(la/(o.dur||dur*.8),0,1);if(pins.length>1){x.strokeStyle='#ff4f9a';x.lineWidth=W*.012;x.setLineDash([W*.025,W*.018]);x.beginPath();const segs=pins.length-1,upto=prog*segs;for(let i=0;i<=Math.min(segs,Math.floor(upto));i++){const p=pins[i];const X=R.x+p[0]*W,Y=R.y+p[1]*H;if(i===0)x.moveTo(X,Y);else x.lineTo(X,Y)}const fi=Math.floor(upto);if(fi<segs){const a=pins[fi],b=pins[fi+1],f=upto-fi;x.lineTo(R.x+lerp(a[0],b[0],f)*W,R.y+lerp(a[1],b[1],f)*H)}x.stroke();x.setLineDash([])}
     pins.forEach((p,i)=>{const at=(pins.length>1?i/(pins.length-1):0)*(o.dur||dur*.8);if(la<at)return;const k=E.back(clamp((la-at)/.3,0,1));const X=R.x+p[0]*W,Y=R.y+p[1]*H;x.save();x.translate(X,Y);x.scale(k,k);x.fillStyle=p[2]||'#ff2d55';x.beginPath();x.arc(0,-W*.05,W*.035,0,TAU);x.fill();x.beginPath();x.moveTo(-W*.03,-W*.035);x.lineTo(W*.03,-W*.035);x.lineTo(0,0);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(0,-W*.05,W*.014,0,TAU);x.fill();if(p[3]){const lb=LANG==='ja'&&p[4]?p[4]:p[3];const fs=W*.036;const tc=textCanvas(lb,'tier',Math.round(fs),9999,{c:'#d61f69'});const tw=tc.w,pd=fs*.25,L=p[5]==='l';const V=VIS||R;let bx=L?-W*.05-tw-pd*2:W*.05;bx=Math.max(V.x+fs*.3-X,Math.min(V.x+V.w-fs*.3-X-tw-pd*2,bx));x.fillStyle='rgba(255,255,255,.95)';rr(x,bx,-W*.05-tc.h/2,tw+pd*2,tc.h,fs*.5);x.fill();x.drawImage(tc.c,bx+pd,-W*.05-tc.h/2)}x.restore()});break}
   case 'shine':{const p=(la/dur);x.globalAlpha=A*.6;x.translate(R.x+W*(p*1.6-.3),R.y);x.rotate(.35);x.fillStyle='rgba(255,255,255,.55)';x.fillRect(-W*.04,-H*.2,W*.08,H*1.4);break}
  }
  x.restore()}
 // ---------- actors ----------
 function drawActor(x,a,lt,sd,T,bpm,R,shadowOnly){const name=a[0],o=a[5]||{};const t0=o.t?o.t[0]:0,t1=o.t?o.t[1]:sd;if(lt<t0||lt>t1+.001)return;
  let nm=name;if(o.sw)for(const w of o.sw)if(lt>=w[0])nm=w[1];const im=get(nm);if(!im)return;
  const la=lt-t0,rem=t1-lt,span=Math.max(.001,t1-t0);let px=a[1],py=a[2],sc=1,sx=1,sy=1,rot=(o.rot||0)*PI/180,al=o.op==null?1:o.op,lift=0;
  if(o.mv){const md=o.mvd||span,mt=o.mt||0;const k=(E[o.me||'io'])(clamp((la-mt)/md,0,1));px=lerp(a[1],o.mv[0],k);py=lerp(a[2],o.mv[1],k);if(o.mv[2]!=null)sc*=lerp(1,o.mv[2],k)}
  if(o.arc){const k=clamp(la/span,0,1);px=lerp(a[1],o.arc[0],k);py=lerp(a[2],o.arc[1],k);lift=o.arc[2]*4*k*(1-k);rot+=(o.arc[3]||0)*TAU*k}
  const b=T*bpm/60,ph=b-Math.floor(b);const an=a[4]||'idle',sp=o.sp||1;
  switch(an){
   case 'idle':sy*=1+.012*Math.sin(TAU*T*.9*sp);sx*=1-.006*Math.sin(TAU*T*.9*sp);break;
   case 'bob':{const q=Math.abs(Math.sin(PI*ph));lift+=q*.018;const sq=Math.max(0,1-ph*7);sy*=1-.035*sq;sx*=1+.03*sq;break}
   case 'hop':{const q=Math.sin(PI*ph);lift+=q*.06;const sq=Math.max(0,1-ph*6)+Math.max(0,(ph-.88)*8);sy*=1-.06*Math.min(1,sq);sx*=1+.05*Math.min(1,sq);break}
   case 'hop2':{const b2=b/2,p2=b2-Math.floor(b2);const q=Math.max(0,Math.sin(PI*Math.min(1,p2*1.6)));lift+=q*.09;break}
   case 'wiggle':rot+=.07*Math.sin(PI*b);sy*=1+.01*Math.sin(TAU*b);break;
   case 'dance':{rot+=.13*Math.sin(PI*b);lift+=Math.abs(Math.sin(PI*b))*.03;sx*=1+.02*Math.sin(TAU*b);break}
   case 'shake':px+=Math.sin(la*70)*.008;rot+=Math.sin(la*55)*.02;break;
   case 'tremble':px+=Math.sin(la*90)*.003;break;
   case 'talk':sy*=1+.02*Math.abs(Math.sin(la*13*sp));sx*=1-.008*Math.abs(Math.sin(la*13*sp));rot+=.015*Math.sin(la*3);break;
   case 'float':lift+=.012+.012*Math.sin(TAU*T*.45);rot+=.025*Math.sin(TAU*T*.3);break;
   case 'spin':rot+=TAU*la/span*(o.turns||1);break;
   case 'sneak':lift+=Math.abs(Math.sin(PI*b*2))*.012;rot+=.05*Math.sin(PI*b*2);break;
   case 'pulse':sc*=1+.045*Math.max(0,Math.cos(TAU*ph));break;
   case 'nod':rot+=.05*Math.sin(TAU*b);break;
   case 'fall':{lift-=la*la*1.2;rot+=la*2.5*(o.dir||1);break}
   case 'zoomin':sc*=1+la*.06;break;
   case 'sway':rot+=.06*Math.sin(TAU*T*.5);break;
  }
  // entrance / exit
  const inD=.32,outD=.28;
  if(o.in&&la<inD){const k=la/inD;switch(o.in){case 'pop':sc*=E.back(k);break;case 'l':px=lerp(-.45,px,E.out(k));break;case 'r':px=lerp(1.45,px,E.out(k));break;case 'b':py=lerp(py+.7,py,E.out(k));break;case 'drop':{const kk=Math.min(1,la/.45);lift+=(1-E.bounce(kk))*.9;break}case 'fade':al*=k;break}}
  if(o.in==='drop'&&la<.45&&la>=inD){lift+=(1-E.bounce(la/.45))*.9}
  if(o.out&&rem<outD){const k=1-rem/outD;switch(o.out){case 'pop':sc*=1-E.in(k);break;case 'l':px=lerp(px,-.5,E.in(k));break;case 'r':px=lerp(px,1.5,E.in(k));break;case 'up':lift+=E.in(k)*1.2;break;case 'fade':al*=1-k;break;case 'fall':py+=E.in(k)*.9;rot+=k*1.2;break}}
  if(sc<=0.001||al<=0.001)return;
  const H=a[3]*R.h*sc,W=H*im.width/im.height;const bx=R.x+px*R.w,by=R.y+py*R.h;
  if(shadowOnly){if(o.sh===0)return;const ss=Math.max(.35,1-lift*2.5);x.save();x.globalAlpha=.32*al*ss;x.fillStyle='#000';x.beginPath();x.ellipse(bx,by-H*.01,W*.34*ss,W*.07*ss,0,0,TAU);x.fill();x.restore();return}
  x.save();x.globalAlpha=al;x.translate(bx,by-lift*R.h);x.rotate(rot);x.scale(sx*(o.flip?-1:1),sy);
  const ay=o.mid?-H/2:0;x.drawImage(im,-W/2,-H-ay,W,H);x.restore()}
 // ---------- scene ----------
 function drawBg(x,sh,R,lt){const bg=sh.bg;if(!bg)return;
  if(bg==='video'){const v=VID.cur;if(v&&v.readyState>=2){const vw=v.videoWidth||720,vh=v.videoHeight||1280;const s=Math.max(R.w/vw,R.h/vh);x.drawImage(v,R.x+(R.w-vw*s)/2,R.y+(R.h-vh*s)/2,vw*s,vh*s)}else if(VID.poster&&VID.poster.complete){x.drawImage(VID.poster,R.x,R.y,R.w,R.h)}return}
  if(bg[0]==='#'){const cs=bg.split('/');const g=x.createLinearGradient(R.x,R.y,R.x+R.w*.3,R.y+R.h);g.addColorStop(0,cs[0]);g.addColorStop(1,cs[1]||cs[0]);x.fillStyle=g;x.fillRect(R.x-R.w,R.y-R.h,R.w*3,R.h*3);
   if(sh.dots!==0){x.fillStyle='rgba(255,255,255,.16)';const step=R.w/7;for(let i=-1;i<9;i++)for(let j=-1;j<16;j++){x.beginPath();x.arc(R.x+i*step+(j%2)*step/2+(lt*8)%step,R.y+j*step,step*.12,0,TAU);x.fill()}}return}
  const n='bg_'+bg;const im=sh.blur?blurOf(n):get(n);if(!im)return;const ov=1.06;x.drawImage(im,R.x-R.w*(ov-1)/2,R.y-R.h*(ov-1)/2,R.w*ov,R.h*ov)}
 function cam(sh,lt){const c=sh.cam||[1,1.06,.5,.5,.5,.5];const k=E.io(clamp(lt/sh.d,0,1));let z=lerp(c[0],c[1],k),cx=lerp(c[2],c[3],k),cy=lerp(c[4],c[5],k);
  if(sh.pz)for(const p of sh.pz){const d=lt-p;if(d>=0&&d<.6)z*=1+.09*Math.exp(-d*7)}
  if(z<1)z=1;const hz=.5/z-.025;cx=clamp(cx,hz,1-hz);cy=clamp(cy,hz,1-hz);
  let ox=0,oy=0;if(sh.shake&&lt>=sh.shake[0]&&lt<=sh.shake[1]){const a=sh.shake[2]||.02;ox=Math.sin(lt*73)*a;oy=Math.cos(lt*61)*a}
  return {z,cx,cy,ox,oy}}
 function drawScene(x,clip,sh,lt,T,R){
  x.save();x.beginPath();x.rect(R.x,R.y,R.w,R.h);x.clip();
  const c=cam(sh,lt);x.translate(R.x+R.w/2+c.ox*R.w,R.y+R.h/2+c.oy*R.h);x.scale(c.z,c.z);x.translate(-R.x-c.cx*R.w,-R.y-c.cy*R.h);
  drawBg(x,sh,R,lt);
  if(sh.panes){sh.panes.forEach(p=>{const r=p.r;drawScene(x,clip,p,lt,T,{x:R.x+r[0]*R.w,y:R.y+r[1]*R.h,w:r[2]*R.w,h:r[3]*R.h});if(p.border!==0){x.strokeStyle='#fff';x.lineWidth=R.w*.008;x.strokeRect(R.x+r[0]*R.w,R.y+r[1]*R.h,r[2]*R.w,r[3]*R.h)}})}
  (sh.fx||[]).forEach(f=>drawFx(x,f,lt,R,T,false));
  const acts=(sh.a||[]).slice().sort((p,q)=>((p[5]&&p[5].z)||0)-((q[5]&&q[5].z)||0)||p[2]-q[2]);
  if(!sh.noshadow)acts.forEach(a=>drawActor(x,a,lt,sh.d,T,clip.bpm,R,true));
  acts.forEach(a=>drawActor(x,a,lt,sh.d,T,clip.bpm,R,false));
  (sh.fx||[]).forEach(f=>drawFx(x,f,lt,R,T,true));
  x.restore();
  if(!NOTXT)drawTexts(x,sh,lt,R)}
 let LANG='en',VIS=null,NOTXT=false,SAFE=null,CURCAT='';
 function drawTexts(x,sh,lt,R){if(!sh.tx)return;const vx0=Math.max(R.x,VIS?VIS.x:R.x),vx1=Math.min(R.x+R.w,VIS?VIS.x+VIS.w:R.x+R.w),vw=vx1-vx0;
  const placed=[];for(const t of sh.tx){const [t0,t1,en,ja,st0,y0,o0]=t;if(lt<t0||lt>t1)continue;const o=o0||{};const st=st0||'pill';let str=LANG==='ja'&&ja?ja:en;if(!str)continue;
   const vh0=VIS?VIS.h:R.h;const base=vw*({big:.088,num:.2,title:.07,sub:.056,bub:.05,stamp:.1,tag:.042,loc:.046,lower:.05,type:.05,cap:.062,neon:.08,retro:.056,serif:.06,manga:.064}[st]||.054)*(o.s||1)*(VIS&&vw<VIS.w*.7?1.55:1);
   if(st==='type'||st==='cap'){const la0=lt-t0;if(st==='type'){const ch=[...str];str=ch.slice(0,Math.max(1,Math.floor(la0*(o.cps||20)))).join('')}else{const cj=/[\u3040-\u30ff\u4e00-\u9fff]/.test(str);const parts=cj?(str.match(/.{1,3}/gu)||[str]):str.split(' ');str=parts.slice(0,Math.max(1,Math.floor(la0*(o.wps||(cj?3.4:2.8))))).join(cj?'':' ')}}const fs=Math.round(base);
   const maxW=vw*(o.w||(st==='bub'?.6:.84));
   // progressive word reveal for big/sub
   // whole caption appears at once, wrapped and shrunk until it fits inside the visible screen
   let f2=fs,tc=textCanvas(str,st,f2,maxW,o);for(let k=0;k<16&&(tc.w>vw*.94||tc.h>R.h*.3);k++){f2=Math.max(8,Math.round(f2*.88));tc=textCanvas(str,st,f2,maxW,o)}const full=tc;
   const la=lt-t0,rem=t1-lt;let sc=1,al=1,rot=(o.rot||0)*PI/180;
   if(st==='stamp'){const k=Math.min(1,la/.18);sc=lerp(2.2,1,E.out(k));al=k;rot+=-.18}
   else if(st==='num'||st==='big'){sc=la<.22?E.back(la/.22):1}
   else if(st==='type'||st==='cap'){sc=1;al=1}
   else{sc=la<.2?lerp(.6,1,E.back(la/.2)):1;al=Math.min(1,la/.1)}
   if(rem<.12&&!o.hold){al*=rem/.12}
   let cx=vx0+vw*(o.x==null?.5:o.x),cy=R.y+R.h*(y0==null?.3:y0);
   cx=clamp(cx,vx0+full.w/2+vw*.03,vx1-full.w/2-vw*.03);if(full.w>vw*.94)cx=vx0+vw/2;
   const vy0=VIS?VIS.y:R.y;const SF=SAFE||{top:.062,railL:.86,railT:.53,railB:.9,metaT:.87};
   const yTop=vy0+vh0*Math.max(.11,SF.top+.012),yBot=vy0+vh0*(SF.metaT-(CURCAT==='preg'?.075:.01));
   cy=Math.min(Math.max(cy,yTop+tc.h/2),yBot-tc.h/2);
   if(st!=='bub'&&st!=='stamp'&&st!=='num')for(const q of placed){if(Math.abs(cx-q[0])<(tc.w+q[2])/2&&Math.abs(cy-q[1])<(tc.h+q[3])/2-1)cy=q[1]+q[3]/2+tc.h/2+vh0*.004}
   // keep clear of the right-side button rail
   const rl=vx0+vw*SF.railL-vw*.015,rT=vy0+vh0*SF.railT,rB=vy0+vh0*SF.railB;
   if(cy+tc.h/2>rT&&cy-tc.h/2<rB&&cx+tc.w/2>rl){const L0=vx0+vw*.03,aw=rl-L0;
    if(tc.w>aw){let f3=f2;for(let k=0;k<16&&tc.w>aw;k++){f3=Math.max(8,Math.round(f3*.9));tc=textCanvas(str,st,f3,Math.min(maxW,aw*.92),o)}}
    // if it now sits clear of the rail band vertically, fine; else shift left
    cx=Math.min(cx,rl-tc.w/2);cx=Math.max(cx,L0+tc.w/2);cy=Math.min(Math.max(cy,yTop+tc.h/2),yBot-tc.h/2)}
   
   if(st!=='bub'&&st!=='stamp'&&st!=='num')placed.push([cx,cy,tc.w,tc.h]);
   if(st==='bub'&&o.tx!=null){const tx=R.x+R.w*o.tx,ty=R.y+R.h*o.ty;x.save();x.globalAlpha=al;x.fillStyle='#fff';x.beginPath();const bx=clamp(tx,cx-tc.w*.35,cx+tc.w*.35),by=cy+tc.h*.5*sc-2;x.moveTo(bx-tc.h*.22,by);x.lineTo(bx+tc.h*.22,by);x.lineTo(lerp(bx,tx,.55),lerp(by,ty,.55));x.closePath();x.fill();x.restore()}
   if(window.__TXTCHK&&sc>=.999){const l=cx-tc.w/2,r=cx+tc.w/2,tp=cy-tc.h/2,bt=cy+tc.h/2;const V=VIS||R;const SF=SAFE||{top:.062,railL:.86,railT:.53,railB:.9,metaT:.87};const hitRail=r>V.x+V.w*SF.railL+1&&bt>V.y+V.h*SF.railT&&tp<V.y+V.h*SF.railB;if(l<V.x-1||r>V.x+V.w+1||tp<V.y+V.h*SF.top-1||bt>V.y+V.h*SF.metaT+1||hitRail)window.__TXTCHK.push([str,Math.round(l),Math.round(r),Math.round(tp),Math.round(bt),Math.round(V.w),Math.round(V.h)])}
   x.save();x.globalAlpha=al;x.translate(cx,cy);x.rotate(rot);x.scale(sc,sc);
   x.drawImage(tc.c,-tc.w/2,-tc.h/2);
   x.restore()}}
 // ---------- transitions ----------
 const TR=.3;
 function shotAt(clip,t){const S=clip.shots;let i=0;while(i<S.length-1&&t>=S[i+1].t0)i++;return i}
 function draw(x,clip,t,CW,CH){CURCAT=clip.cat;const T0=t;if(clip.look==='clay')t=Math.floor(t*8)/8;
  const s=Math.max(CW/9,CH/16),FW=9*s,FH=16*s;const R={x:(CW-FW)/2,y:(CH-FH)/2,w:FW,h:FH};VIS={x:0,y:0,w:CW,h:CH};
  x.fillStyle='#111';x.fillRect(0,0,CW,CH);if(clip.look==='clay'){const f=Math.floor(t*8);x.save();x.translate((hr(f,70)-.5)*CW*.006,(hr(f,71)-.5)*CW*.006)}
  const i=shotAt(clip,t),sh=clip.shots[i],lt=t-sh.t0;const tr=sh.tr||'cut';
  if(i>0&&tr!=='cut'&&lt<TR){NOTXT=true;const p=lt/TR,pv=clip.shots[i-1],plt=pv.d-.0001+lt*0;
   switch(tr){
    case 'whip':{const e=E.io(p);x.save();x.translate(-e*CW,0);drawScene(x,clip,pv,Math.min(pv.d,pv.d-.01),t,R);x.restore();x.save();x.translate((1-e)*CW,0);drawScene(x,clip,sh,lt,t,R);x.restore();
     x.save();x.globalAlpha=.35*Math.sin(p*PI);x.fillStyle='#fff';for(let k=0;k<9;k++){x.fillRect(0,hr(k,50)*CH,CW,CH*.012)}x.restore();break}
    case 'slide':{const e=E.io(p);x.save();x.translate(0,-e*CH*.25);x.globalAlpha=1;drawScene(x,clip,pv,pv.d-.01,t,R);x.restore();x.save();x.translate(0,(1-e)*CH);drawScene(x,clip,sh,lt,t,R);x.restore();break}
    case 'zoom':{x.save();x.globalAlpha=1;x.translate(CW/2,CH/2);x.scale(1+p*.7,1+p*.7);x.translate(-CW/2,-CH/2);drawScene(x,clip,pv,pv.d-.01,t,R);x.restore();x.save();x.globalAlpha=E.out(p);x.translate(CW/2,CH/2);const z=.75+.25*E.out(p);x.scale(z,z);x.translate(-CW/2,-CH/2);drawScene(x,clip,sh,lt,t,R);x.restore();break}
    case 'spin':{const e=E.io(p);x.save();x.translate(CW/2,CH/2);x.rotate(e*PI*.5);x.scale(1+e,1+e);x.translate(-CW/2,-CH/2);x.globalAlpha=1-e;drawScene(x,clip,pv,pv.d-.01,t,R);x.restore();x.save();x.globalAlpha=e;x.translate(CW/2,CH/2);x.rotate((e-1)*PI*.5);const z=.5+.5*e;x.scale(z,z);x.translate(-CW/2,-CH/2);drawScene(x,clip,sh,lt,t,R);x.restore();break}
    case 'wipe':{drawScene(x,clip,pv,pv.d-.01,t,R);x.save();const e=E.io(p);x.beginPath();const ang=-.5,len=Math.hypot(CW,CH)*1.3;const px0=-CW*.3+e*CW*1.6;x.moveTo(px0-len,-CH);x.lineTo(px0,-CH);x.lineTo(px0-CH*.6,CH*2);x.lineTo(px0-len-CH,CH*2);x.closePath();x.clip();drawScene(x,clip,sh,lt,t,R);x.restore();
     x.save();x.strokeStyle='rgba(255,140,190,.9)';x.lineWidth=CW*.08;x.lineCap='round';x.beginPath();x.moveTo(px0,-CH*.1);x.lineTo(px0-CH*.6*1.05,CH*1.1);x.stroke();x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=CW*.02;x.stroke();x.restore();break}
    case 'glitch':{drawScene(x,clip,p<.5?pv:sh,p<.5?pv.d-.01:lt,t,R);x.save();for(let k=0;k<7;k++){const y=hr(k,Math.floor(p*20))*CH,h=CH*.05;const dx=(hr(k,60+Math.floor(p*20))-.5)*CW*.15;x.drawImage(x.canvas,0,y,CW,h,dx,y,CW,h)}x.globalCompositeOperation='screen';x.globalAlpha=.25*(1-Math.abs(p-.5)*2);x.fillStyle='#ff00aa';x.fillRect(0,0,CW,CH);x.restore();break}
    case 'flash':default:{drawScene(x,clip,sh,lt,t,R);x.save();x.globalAlpha=Math.pow(1-p,1.6);x.fillStyle='#fff';x.fillRect(0,0,CW,CH);x.restore()}}
   NOTXT=false;x.save();drawTexts(x,sh,lt,R);x.restore();
  }else drawScene(x,clip,sh,lt,t,R);
  if(sh.post){x.save();sh.post(x,lt,R);x.restore()}
  if(clip.look==='clay')x.restore();
  if(clip.look||clip.live)LOOK(x,clip,clip.look==='clay'?t:T0,CW,CH);
  if(clip.cat==='preg')drawNote(x,R);else if(clip.note)drawNote(x,R,NOTE2)}
 const NOTE2={en:'ⓘ Dates can change. Check the official site.',ja:'ⓘ 日程変更の可能性あり。公式サイトで確認を。'};
 // ---------- looks: whole-frame video styles ----------
 let BLM=null;const MONO='"Courier New",ui-monospace,Menlo,monospace';
 function LOOK(x,clip,t,CW,CH){const lk=clip.look,SF=SAFE||{top:.062,railL:.86,metaT:.87};const top=CH*Math.max(.11,SF.top+.04);x.save();
  if(lk==='glow'||lk==='night'){if(!BLM){BLM=document.createElement('canvas')}BLM.width=Math.max(8,CW>>3);BLM.height=Math.max(8,CH>>3);const b=BLM.getContext('2d');b.drawImage(x.canvas,0,0,BLM.width,BLM.height);x.globalCompositeOperation='screen';x.globalAlpha=lk==='night'?.45:.32;x.drawImage(BLM,0,0,CW,CH);x.globalCompositeOperation='source-over';x.globalAlpha=1;const g=x.createRadialGradient(CW/2,CH/2,CH*.3,CW/2,CH/2,CH*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,20,.45)');x.fillStyle=g;x.fillRect(0,0,CW,CH)}
  else if(lk==='vhs'){x.globalCompositeOperation='saturation';x.globalAlpha=.35;x.fillStyle='#808080';x.fillRect(0,0,CW,CH);x.globalCompositeOperation='screen';x.globalAlpha=.18;x.drawImage(x.canvas,CW*.006,0);x.globalCompositeOperation='source-over';x.globalAlpha=1;
   x.fillStyle='rgba(0,0,0,.16)';for(let y=0;y<CH;y+=3)x.fillRect(0,y,CW,1);const by=((t*.18)%1.2-.1)*CH;for(let k=0;k<5;k++){const y=by+k*CH*.006;x.fillStyle=`rgba(255,255,255,${.05+hr(k,Math.floor(t*30))*.12})`;x.fillRect(0,y,CW,CH*.004)}
   const f=Math.round(CW*.05);x.font=`700 ${f}px ${MONO}`;x.textBaseline='top';x.fillStyle='#fff';x.shadowColor='#000';x.shadowBlur=0;x.fillText((Math.floor(t*2)%2?'▶ ':'  ')+'PLAY',CW*.05,top);x.font=`700 ${Math.round(f*.85)}px ${MONO}`;const ss=Math.floor(t)%60;x.fillText(clip.vhsDate||'DEC.24 1998',CW*.05,CH*SF.metaT-f*3.2);x.fillText('SP  0:00:'+(ss<10?'0':'')+ss,CW*.05,CH*SF.metaT-f*2.1)}
  else if(lk==='film'){const bw=clip.bw;x.globalCompositeOperation='saturation';x.globalAlpha=bw?1:.6;x.fillStyle='#808080';x.fillRect(0,0,CW,CH);x.globalCompositeOperation=bw?'multiply':'color';x.globalAlpha=bw?.12:.32;x.fillStyle='#b08a5a';x.fillRect(0,0,CW,CH);x.globalCompositeOperation='source-over';
   const fr=Math.floor(t*12);x.globalAlpha=.05+.04*hr(fr,80);x.fillStyle='#000';x.fillRect(0,0,CW,CH);x.globalAlpha=1;for(let i=0;i<90;i++){x.fillStyle=hr(i,fr)>.5?'rgba(255,255,255,.22)':'rgba(0,0,0,.25)';x.fillRect(hr(i+300,fr)*CW,hr(i+600,fr)*CH,1.5,1.5)}
   for(let k=0;k<2;k++){if(hr(k,fr)>.55){x.fillStyle='rgba(255,255,255,.25)';x.fillRect(hr(k+9,fr)*CW,0,1,CH)}}const g=x.createRadialGradient(CW/2,CH/2,CH*.25,CW/2,CH/2,CH*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=g;x.fillRect(0,0,CW,CH)}
  else if(lk==='clay'){x.globalCompositeOperation='soft-light';x.globalAlpha=.35;x.fillStyle='#ffb46a';x.fillRect(0,0,CW,CH);x.globalCompositeOperation='source-over';x.globalAlpha=1;const g=x.createRadialGradient(CW/2,CH/2,CH*.3,CW/2,CH/2,CH*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(40,20,0,.38)');x.fillStyle=g;x.fillRect(0,0,CW,CH);
   const f=Math.round(CW*.04);x.font=`800 ${f}px ${FONT}`;x.textBaseline='top';x.fillStyle='rgba(255,255,255,.85)';x.fillText('● stop-motion',CW*.05,top)}
  else if(lk==='anime'){x.globalCompositeOperation='saturation';x.globalAlpha=.3;x.fillStyle='hsl(0,100%,50%)';x.fillRect(0,0,CW,CH);x.globalCompositeOperation='source-over';x.globalAlpha=.16;x.fillStyle='#000';const st=CW/34;for(let yy=0;yy<CH*.22;yy+=st)for(let xx=0;xx<CW;xx+=st){const r=st*.42*(1-yy/(CH*.22));if(r>.4){x.beginPath();x.arc(xx+((yy/st)%2)*st/2,CH-yy,r,0,TAU);x.fill()}}x.globalAlpha=1;x.strokeStyle='#111';x.lineWidth=CW*.02;x.strokeRect(CW*.01,CH*.01,CW*.98,CH*.98)}
  else if(lk==='asmr'){x.globalCompositeOperation='soft-light';x.globalAlpha=.4;x.fillStyle='#ff9e5a';x.fillRect(0,0,CW,CH);x.globalCompositeOperation='source-over';x.globalAlpha=1;const g=x.createRadialGradient(CW/2,CH*.48,CH*.18,CW/2,CH*.48,CH*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,5,0,.7)');x.fillStyle=g;x.fillRect(0,0,CW,CH);
   const f=Math.round(CW*.04);x.font=`800 ${f}px ${FONT}`;x.textBaseline='top';x.fillStyle='rgba(255,255,255,.9)';x.fillText('🎧 ASMR',CW*.05,top)}
  if(clip.live)LIVE(x,clip,t,CW,CH,top,SF);
  x.restore()}
 function LIVE(x,clip,t,CW,CH,top,SF){const L=clip.live;const f=Math.round(CW*.042);x.textBaseline='middle';x.font=`900 ${f}px ${FONT}`;
  const bw=f*3.1,bh=f*1.5,bx=CW*.04,by=top;x.fillStyle='#ff1f4b';rr(x,bx,by,bw,bh,f*.3);x.fill();x.fillStyle='#fff';x.textAlign='center';x.fillText('LIVE',bx+bw/2,by+bh/2);
  const v=Math.floor((L.v0||800)+t*(L.rate||37)+Math.sin(t*2.3)*6);const vs=v>=10000?(v/1000).toFixed(1)+'K':v.toLocaleString('en-US');x.font=`800 ${f}px ${FONT}`;const tw=x.measureText('👁 '+vs).width+f;x.fillStyle='rgba(0,0,0,.45)';rr(x,bx+bw+f*.3,by,tw,bh,f*.3);x.fill();x.fillStyle='#fff';x.fillText('👁 '+vs,bx+bw+f*.3+tw/2,by+bh/2);x.textAlign='left';
  // chat: newest at the bottom, max 4 lines, slides up
  const shown=L.chat.filter(c=>c[0]<=t).slice(-4);const fs=Math.round(CW*.036);const maxW=CW*.62;let y=CH*(SF.metaT||.87)-CH*.07;
  for(let i=shown.length-1;i>=0;i--){const c=shown[i];const cr=typeof CREATORS!=='undefined'&&CREATORS[c[1]];const nm=cr?cr.h:c[1];const msg=LANG==='ja'&&c[3]?c[3]:c[2];const tc=textCanvas(nm+'  '+msg,'chat',fs,maxW,{});const age=t-c[0];const k=clamp(age/.25,0,1);const al=(i===0&&shown.length===4)?.55:1;
   y-=tc.h+CH*.006;const ax=CW*.04,av=fs*1.7;x.globalAlpha=k*al;const im=cr&&get(cr.av);x.save();x.beginPath();x.arc(ax+av/2,y+tc.h/2,av/2,0,TAU);x.fillStyle='#fff';x.fill();x.clip();if(im){const s=av/Math.min(im.width,im.height*.6);x.drawImage(im,ax+av/2-im.width*s/2,y+tc.h/2-av/2-im.height*s*.02,im.width*s,im.height*s)}x.restore();
   x.drawImage(tc.c,ax+av+fs*.3,y+(1-k)*fs);x.globalAlpha=1}
  // gifts float up on the right of the chat
  (L.gifts||[]).forEach((g,i)=>{const a=t-g;if(a<0||a>2.2)return;x.globalAlpha=1-a/2.2;x.font=`${Math.round(CW*.08)}px ${FONT}`;x.fillText(['🎁','🫛','💐','🌟','💗'][i%5],CW*(.66+.06*Math.sin(i)),CH*(SF.metaT||.87)-CH*.12-a*CH*.12);x.globalAlpha=1})}
 const NOTE={en:'ⓘ Not medical advice. Ask your doctor or midwife.',ja:'ⓘ 医療アドバイスではありません。医師・助産師にご相談を。'};
 function drawNote(x,R,NT){const V=VIS||R,SF=SAFE||{metaT:.87};const vw=Math.min(V.w,R.w);const fs=Math.max(10,Math.round(vw*.035));
  const rl=SF.railL||.86;const mw=V.w*(rl-.06);const N=NT||NOTE;const str=N[LANG]||N.en;let f=fs,tc=textCanvas(str,'note',f,mw,{});const y=V.y+V.h*SF.metaT-tc.h*.5-V.h*.006;x.save();x.globalAlpha=1;x.drawImage(tc.c,V.x+V.w*.025,y-tc.h/2);x.restore()}
 return {load,loadClip,ready,norm,draw,get,assets,textCanvas,set lang(l){LANG=l},set safe(v){SAFE=v},get lang(){return LANG},VID,rr,heart}
})();
