'use strict';
// Pinco Pooh Snap v1.3: Venice Ocean Front Walk + The Strand, and a Santa Monica pedestrian promenade.
// All buildings, signs and murals are original procedural art (no real brands or logos).
const RAILS={
 // A: Ocean Front Walk, then veers onto The Strand beside the sand. B (secret): stays on the walk past the courts and the gym pen.
 venice(z,b){const base=Math.sin(z*.03)*.6;if(b)return base-1.2*smooth(112,140,z);const k=smooth(112,168,z);return base+k*(21+Math.sin(z*.045)*1.4);},
 santamonica(z){return Math.sin(z*.012)*1.1;},
};
const THEMES13={boardwalk:{near:[],far:[]},promenade:{near:[],far:[]}};
Object.assign(VISCFG.venice,{path:'strand',nocurb:true,top:0x3a9bff,hor:0xd8f1ff,sun:[.55,.5,.6],hi:.9,di:1.12,ringC:0xa7b8a2});
VISCFG.santamonica={top:0x1d2766,hor:0xff9a6a,sun:[-.15,.1,.95],sunC:0xffb27a,hemiS:0x9aa0e0,hemiG:0x7a5a5a,hi:1.12,di:.75,gr:'pave',g1:0x8a7d7a,g2:0x7d7174,path:'paver',ring:'city',ringC:0x3a3a6a,night:true,dusk:true,birds:null,nocurb:true,charTint:0xffe6dc};
VISCFG.shibuya.charTint=0xe2d8ff;
(function(){
 const pt=W.pathTex.bind(W);
 W.pathTex=function(kind){if(!['strand','ofw','paver'].includes(kind))return pt(kind);const key='pt_'+kind;if(this.tex[key])return this.tex[key];
  const t=this.canvasTex(256,512,(g,w,h)=>{const R=Math.random;
   const grain=(n,a,c)=>{for(let i=0;i<n;i++){g.fillStyle=c||`rgba(0,0,0,${R()*a})`;g.fillRect(R()*w,R()*h,1+R()*2,1+R()*2);}};
   const sand=(x0,x1)=>{for(let i=0;i<1600;i++){const x=x0+R()*(x1-x0);g.fillStyle=`rgba(236,214,160,${R()*.55})`;g.fillRect(x,R()*h,2+R()*3,2+R()*3);}};
   if(kind==='strand'){g.fillStyle='#a9a7a0';g.fillRect(0,0,w,h);grain(5000,.12);grain(1500,0,'rgba(255,255,255,.08)');
    g.fillStyle='#f2f0ea';g.fillRect(10,0,6,h);g.fillRect(w-16,0,6,h);g.fillStyle='#f2c230';for(let y=0;y<h;y+=128)g.fillRect(w/2-4,y,8,70);sand(0,30);sand(w-30,w);
    g.globalAlpha=.25;g.fillStyle='#fff';g.font='900 40px Arial Black,Arial';g.save();g.translate(w*.27,h*.72);g.rotate(-Math.PI/2);g.fillText('BIKES',-58,12);g.restore();g.globalAlpha=1;}
   else if(kind==='ofw'){g.fillStyle='#d6cdbd';g.fillRect(0,0,w,h);grain(6000,.1);grain(2000,0,'rgba(255,250,235,.12)');
    g.strokeStyle='rgba(110,98,84,.45)';g.lineWidth=2;for(let y=0;y<h;y+=64){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}for(const x of[w/3,w*2/3]){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
    for(let i=0;i<14;i++){g.fillStyle=`rgba(90,80,70,${.05+R()*.08})`;g.beginPath();g.ellipse(R()*w,R()*h,6+R()*16,4+R()*10,R()*3,0,7);g.fill();}sand(0,40);sand(w-40,w);}
   else{// promenade pavers: running bond in warm terracotta / sand tones with a darker border band
    g.fillStyle='#8a6a58';g.fillRect(0,0,w,h);const C=['#c98b6a','#b97a5e','#d49c78','#c08466','#a87058','#d8b090'];
    for(let y=0;y<h;y+=16)for(let x=-(y/16%2)*16;x<w;x+=32){g.fillStyle=C[(R()*C.length)|0];g.fillRect(x+1,y+1,30,14);}
    g.fillStyle='rgba(60,40,36,.35)';g.fillRect(0,0,w,h*0);for(let y=0;y<h;y+=128){g.fillStyle='rgba(235,220,200,.55)';g.fillRect(0,y,w,6);}grain(3000,.12);}
  });t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return this.tex[key]=t;};
})();
// ---------- shared helpers ----------
const S13={
 cache:{},
 sign(W,t,bg,fg,o){const k=t+'|'+bg+'|'+fg+'|'+(o&&o.neon?1:0)+(o&&o.w||'');return this.cache[k]||(this.cache[k]=W.signUV(t,bg,fg,o||{w:256,h:64}));},
 mural(W,i){const k='mural'+i;if(this.cache[k])return this.cache[k];return this.cache[k]=W.paintUV(256,160,(g,w,h)=>{const R=W.rnd;
   if(i===0){const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#ff7ab8');gr.addColorStop(.55,'#ffb85a');gr.addColorStop(1,'#ffe08a');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#fff3c0';g.beginPath();g.arc(w/2,h*.62,36,0,7);g.fill();
    g.fillStyle='#3a2a5a';for(let k=0;k<5;k++){g.fillRect(0,h*.62+k*9,w,3);}for(const x of[34,70,190,224]){g.fillRect(x,h*.3,4,h*.5);for(let a=0;a<6;a++){g.save();g.translate(x+2,h*.3);g.rotate(a*1.05);g.beginPath();g.ellipse(14,0,16,4,0,0,7);g.fill();g.restore();}}
    g.font='900 34px Chewy,Arial Black';g.textAlign='center';g.fillStyle='#fff';g.strokeStyle='#3a2a5a';g.lineWidth=5;g.strokeText('VENICE',w/2,40);g.fillText('VENICE',w/2,40);}
   else if(i===1){g.fillStyle='#2ab0c8';g.fillRect(0,0,w,h);const C=['#ffffff','#1a7aa8','#7ae0e8','#ffd23a'];for(let k=0;k<7;k++){g.strokeStyle=C[k%4];g.lineWidth=9;g.beginPath();for(let x=0;x<=w;x+=8)g.lineTo(x,h*.2+k*18+Math.sin(x*.05+k)*10);g.stroke();}
    g.fillStyle='#ff5aa0';g.beginPath();g.arc(w*.78,h*.25,18,0,7);g.fill();}
   else if(i===2){g.fillStyle='#ffd23a';g.fillRect(0,0,w,h);g.fillStyle='#ff8a3a';for(let a=0;a<16;a++){g.save();g.translate(w/2,h/2);g.rotate(a*Math.PI/8);g.fillRect(0,-6,w,12);g.restore();}
    g.fillStyle='#fff6d0';g.beginPath();g.arc(w/2,h/2,44,0,7);g.fill();g.fillStyle='#3a2a2a';g.beginPath();g.arc(w/2-15,h/2-8,6,0,7);g.arc(w/2+15,h/2-8,6,0,7);g.fill();g.lineWidth=5;g.strokeStyle='#3a2a2a';g.beginPath();g.arc(w/2,h/2+4,20,.2,Math.PI-.2);g.stroke();}
   else{g.fillStyle='#7a5ad8';g.fillRect(0,0,w,h);const C=['#ff5aa0','#4ad8ff','#ffd23a','#7ae05a','#ffffff'];for(let k=0;k<22;k++){g.fillStyle=C[k%5];g.beginPath();const x=R()*w,y=R()*h,r=8+R()*26;if(k%3)g.arc(x,y,r,0,7);else g.rect(x-r,y-r/2,r*2,r);g.fill();}
    g.font='900 30px Chewy,Arial Black';g.textAlign='center';g.fillStyle='#fff';g.strokeStyle='#2a1a4a';g.lineWidth=5;g.strokeText('SNAP!',w/2,h-20);g.fillText('SNAP!',w/2,h-20);}});},
 graffiti(W,i){const k='graf'+i;if(this.cache[k])return this.cache[k];return this.cache[k]=W.paintUV(256,128,(g,w,h)=>{const R=W.rnd;const bg=['#e8e2d8','#d8dde4','#f0e0d0'][i%3];g.fillStyle=bg;g.fillRect(0,0,w,h);
   const C=['#ff4a8a','#3ac0e0','#ffd23a','#7ae05a','#b07aff','#ff8a3a','#2a2a44'];for(let k2=0;k2<10;k2++){g.fillStyle=C[(R()*C.length)|0];g.globalAlpha=.85;g.beginPath();g.ellipse(R()*w,R()*h,14+R()*40,8+R()*20,R()*3,0,7);g.fill();}g.globalAlpha=1;
   const word=['SNAP','POOH$','PINCO','LANZA','BEAN!','WOW'][i%6];g.font='900 54px Chewy,Arial Black';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=12;g.strokeStyle='#1a1a2a';g.strokeText(word,w/2,h/2+4);
   const gr=g.createLinearGradient(0,h*.3,0,h*.7);gr.addColorStop(0,C[i%5]);gr.addColorStop(1,C[(i+2)%5]);g.fillStyle=gr;g.fillText(word,w/2,h/2+4);g.lineWidth=2;g.strokeStyle='#fff';g.strokeText(word,w/2,h/2+4);
   for(let k2=0;k2<6;k2++){g.fillStyle='#fff';g.beginPath();g.arc(R()*w,R()*h,2,0,7);g.fill();}});},
 // continuous facade row along a curve: fn(b,w,d) builds one unit at its local origin (front face at +d/2)
 row(W,c,t0,t1,s,front,widths,fn,o){o=o||{};let t=t0;const L=W.cv.L;while(t<t1){const w=widths();const tc=t+w/2/L;const d=o.depth||8;
   if(!(o.skip&&o.skip(tc))){const p=W.place(c,tc,s,front+d/2);const to=W.place(c,tc,0,0);const ry=W.face(p,to);const b=PB(W,W.mb,p.x,0,p.z,ry);fn(b,w,d,tc);W.take(p,Math.min(w,d)*.45);}
   t+=(w+(o.gap||.15))/L;}},
};
// ---------- props ----------
Object.assign(PROPS,{
 // Ocean Front Walk storefront: open shop on the walk, awning, sign, upper floors with windows / murals
 ofw(b,o){const w=o.w,h=o.h,d=o.d||8;const col=o.col,trim=o.trim||0xffffff;
  b.P(W.rbox(w,h,d,.12),0,0,0,0,1,1,1,col,'std',{ao:.82,jit:.04});b.P(W.rbox(w+.3,.45,d+.3,.08),0,h-.2,0,0,1,1,1,trim,'std');
  b.P(W.rbox(w-1,2.9,.08,.02),0,.05,d/2+.01,0,1,1,1,0x3a322c,'std');b.P(W.rbox(w-.6,.3,.25,.02),0,2.95,d/2+.08,0,1,1,1,trim,'std');
  // merch racks: hanging shirts / hats / boards in the open shopfront
  const n=Math.max(3,Math.floor((w-1.6)/.8));for(let i=0;i<n;i++){const x=-w/2+1.1+i*((w-2.2)/(n-1));const c=b.pick(PAL.bright.concat([0xffffff,0x2a2a44,0x9fe0e8]));
   if(o.kind===1){b.P(W.rbox(.22,1.6,.06,.02),x,.4,d/2+.25,0,1,1,1,c,'std',{},0,(i%2?.06:-.06));}
   else{b.P(W.rbox(.5,.62,.05,.02),x,1.45,d/2+.3,0,1,1,1,c,'std');b.P(W.rbox(.82,.18,.05,.02),x,1.9,d/2+.3,0,1,1,1,c,'std');}}
  b.P(W.rbox(w-1.4,.06,.06,.02),0,2.15,d/2+.3,0,1,1,1,0x8a8a92,'std');
  // sidewalk display table
  if(o.table){b.P(W.rbox(1.8,.08,.8,.02),-w/4,.85,d/2+1,0,1,1,1,0xf4efe6,'std');for(const x of[-.8,.8])b.P(W.box(),-w/4+x,0,d/2+1,0,.06,.85,.06,0x6a6a72,'std');for(let i=0;i<5;i++)b.P(W.box(),-w/4-.7+i*.35,.93,d/2+1,0,.26,.08+((i*7)%3)*.05,.4,b.pick(PAL.bright),'std');}
  // awning
  const aw=o.aw;for(let i=0;i<Math.round(w/.7);i++){const x=-w/2+.35+i*.7;b.P(W.rbox(.7,.1,1.6,.02),x,3.35,d/2+.7,0,1,1,1,i%2?aw:0xffffff,'std',{},.4);}
  b.P(W.rbox(w,.22,.16,.02),0,3.05,d/2+1.42,0,1,1,1,aw,'std');
  b.signQuad(o.uv,0,3.95,d/2+.06,0,Math.min(w*.8,4.6),Math.min(w*.8,4.6)/4,0);
  // upper floors
  const floors=Math.floor((h-4.6)/2.7);if(o.mural!=null&&floors>=1){const mh=h-5;b.signQuad(o.mural,0,4.6+mh/2,d/2+.04,0,w-.8,Math.min(mh,(w-.8)*.62),0);}
  else for(let f=0;f<floors;f++){const nc=Math.max(2,Math.floor(w/2.4));for(let c=0;c<nc;c++){const x=(c-(nc-1)/2)*(w/nc),y=5+f*2.7;b.P(W.rbox(1.1,1.4,.1,.03),x,y,d/2+.03,0,1,1,1,0x9fd4ee,'glass');b.P(W.rbox(1.35,.12,.25,.02),x,y-.1,d/2+.07,0,1,1,1,trim,'std');
    if(o.balc&&c%2===0){b.P(W.rbox(1.6,.08,.7,.02),x,y-.15,d/2+.35,0,1,1,1,trim,'std');b.P(W.rbox(1.6,.06,.04,.02),x,y+.75,d/2+.68,0,1,1,1,0x2a2a33,'std');for(let k=0;k<5;k++)b.P(W.box(),x-.7+k*.35,y-.1,d/2+.68,0,.03,.85,.03,0x2a2a33,'std');}}}
  if(o.roofsign){b.P(W.box(),-w/4,h,0,0,.12,1.4,.12,0x555a66,'std');b.P(W.box(),w/4,h,0,0,.12,1.4,.12,0x555a66,'std');}
  b.occ(0,h/2,0,w,h,d);},
 tent(b){const c=b.pick([0xffffff,0x3a8ad8,0xff5a5a,0xffd23a,0x2fb0a0,0xff8ab8]);for(const x of[-1.35,1.35])for(const z of[-1.35,1.35])b.P(W.cyl(5),x,0,z,0,.07,2.3,.07,0xe0e0e0,'std');
  b.P(W.cone(4),0,2.25,0,Math.PI/4,4.1,.75,4.1,c,'std',{ao:.9});b.P(W.rbox(2.6,.08,1,.02),0,.8,.55,0,1,1,1,0xf4f0e6,'std');b.P(W.rbox(2.6,.75,.04,.01),0,.05,1.03,0,1,1,1,b.pick(PAL.pastel),'std');
  for(let i=0;i<6;i++)b.P(W.box(),-1.05+i*.42,.88,.55,0,.3,.1+(i%3)*.08,.3,b.pick(PAL.bright.concat([0xffffff,0x8a5a3a])),'std');
  if(b.R(0,1)<.6){b.P(W.box(),.9,.85,-.4,0,.06,1.2,.06,0x8a8a92,'std');for(let k=0;k<3;k++)b.P(W.rbox(.4,.5,.04,.02),.9,1.3,-.6+k*.3,0,1,1,1,b.pick(PAL.bright),'std');}},
 bcourt(b,o){o=o||{};const L=o.L||26,Wd=o.W||13;b.P(W.rbox(L+2,.06,Wd+2,.02),0,0,0,0,1,1,1,0x3c7f62,'std');b.P(W.rbox(L,.07,Wd,.02),0,0,0,0,1,1,1,0x4c9a78,'std');
  const ln=(x,z,w,d)=>b.P(W.box(),x,.075,z,0,w,.012,d,0xffffff,'std');ln(0,Wd/2,L,.1);ln(0,-Wd/2,L,.1);ln(L/2,0,.1,Wd);ln(-L/2,0,.1,Wd);ln(0,0,.1,Wd);
  b.P(W.tor(Math.PI*2,.02),0,.08,0,0,3.6,3.6,3.6,0xffffff,'std',{},Math.PI/2);
  for(const sd of[-1,1]){b.P(W.box(),sd*(L/2-2.9),.073,0,0,5.8,.012,4.8,0xc8603a,'std');b.P(W.tor(Math.PI*2,.02),sd*(L/2-5.8),.08,0,0,3.6,3.6,3.6,0xffffff,'std',{},Math.PI/2);
   b.P(W.cyl(8),sd*(L/2+.6),0,0,0,.26,4.1,.26,0x2a5bd0,'std');b.P(W.box(),sd*(L/2+.1),3.9,0,0,1,.18,.18,0x2a5bd0,'std');b.P(W.box(),sd*(L/2-.4),3.4,0,0,.1,1.15,1.85,0xffffff,'std');b.P(W.box(),sd*(L/2-.46),3.55,0,0,.04,.5,.62,0xff6a2a,'std');
   b.P(W.tor(Math.PI*2,.05),sd*(L/2-.85),3.4,0,0,.82,.82,.82,0xff6a2a,'std',{},Math.PI/2);b.P(W.cyl(10,1.5),sd*(L/2-.85),2.86,0,0,.6,.52,.6,0xffffff,'alpha');}
  if(o.open){for(const sd of[-1,1]){for(let z=-Wd/2-1;z<=Wd/2+1;z+=1.6)b.P(W.box(),sd*(L/2+1.4),0,z,0,.07,1.1,.07,0x8a929a,'std');b.P(W.box(),sd*(L/2+1.4),1.05,0,0,.08,.08,Wd+2,0x8a929a,'std');b.P(W.box(),sd*(L/2+1.4),.55,0,0,.05,.05,Wd+2,0x8a929a,'std');}return;}
  // fence on the far side and ends (keeps the rail side open for photos)
  for(let x=-L/2-1;x<=L/2+1;x+=3)b.P(W.box(),x,0,-Wd/2-1,0,.08,3.6,.08,0x8a929a,'std');b.P(W.box(),0,3.55,-Wd/2-1,0,L+2,.08,.08,0x8a929a,'std');b.P(W.box(),0,1.8,-Wd/2-1,0,L+2,3.5,.02,0xb8c0c8,'alpha');
  for(const sd of[-1,1]){for(let z=-Wd/2-1;z<=Wd/2+1;z+=3)b.P(W.box(),sd*(L/2+1),0,z,0,.08,3.6,.08,0x8a929a,'std');b.P(W.box(),sd*(L/2+1),1.8,0,0,.02,3.5,Wd+2,0xb8c0c8,'alpha');}
  for(let i=0;i<3;i++)b.P(W.rbox(3,.1,.5,.02),-6+i*6,.45,Wd/2+1.6,0,1,1,1,0x9a9aa2,'std');},
 paddle(b){const L=13,Wd=6;b.P(W.rbox(L+2,.06,Wd+2,.02),0,0,0,0,1,1,1,0x2f6a9a,'std');b.P(W.rbox(L,.07,Wd,.02),0,0,0,0,1,1,1,0x3f8acb,'std');
  const ln=(x,z,w,d)=>b.P(W.box(),x,.075,z,0,w,.012,d,0xffffff,'std');ln(0,Wd/2,L,.08);ln(0,-Wd/2,L,.08);ln(L/2,0,.08,Wd);ln(-L/2,0,.08,Wd);ln(0,0,L,.06);
  for(const z of[-Wd/2-.4,Wd/2+.4])b.P(W.cyl(6),0,0,z,0,.1,1,.1,0x333333,'std');b.P(W.box(),0,.5,0,0,.03,.8,Wd+.8,0x222222,'alpha');b.P(W.box(),0,.92,0,0,.06,.08,Wd+.8,0xffffff,'std');
  for(let x=-L/2-1;x<=L/2+1;x+=2.6)b.P(W.box(),x,0,-Wd/2-1,0,.07,3,.07,0x8a929a,'std');b.P(W.box(),0,1.5,-Wd/2-1,0,L+2,3,.02,0xb8c0c8,'alpha');},
 volley(b){for(const x of[-4.5,4.5])b.P(W.cyl(6),x,0,0,0,.12,2.6,.12,0xf4f4f4,'std');b.P(W.box(),0,2.1,0,0,9,.9,.02,0x2a2a33,'alpha');b.P(W.box(),0,2.5,0,0,9,.08,.05,0xffffff,'std');b.P(W.sph(10),b.R(-2,2),.25,1.6,0,.42,.42,.42,0xffd23a,'std');},
 artwall(b,o){const n=o&&o.n||3;for(let i=0;i<n;i++){const x=(i-(n-1)/2)*5.2,ry=(i%2?.18:-.18);b.P(W.rbox(4.6,3.6,.5,.06),x,0,0,ry,1,1,1,0xe2dcd2,'std',{ao:.85});const uv=S13.graffiti(W,(o&&o.k||0)+i);
   W.put(b.mb,b.base,W.quad(),x+Math.sin(ry)*.27,1.8,Math.cos(ry)*.27,ry,4.5,3.4,1,0xffffff,'sign',{uv});W.put(b.mb,b.base,W.quad(),x-Math.sin(ry)*.27,1.8,-Math.cos(ry)*.27,ry+Math.PI,4.5,3.4,1,0xffffff,'sign',{uv:S13.graffiti(W,(o&&o.k||0)+i+3)});}},
 musclepen(b){const L=15,Wd=10;for(let x=-L/2;x<=L/2;x+=1.5){b.P(W.box(),x,0,-Wd/2,0,.07,1.1,.07,0xffffff,'std');b.P(W.box(),x,0,Wd/2,0,.07,1.1,.07,0xffffff,'std');}b.P(W.box(),0,1.05,-Wd/2,0,L,.08,.08,0xffffff,'std');b.P(W.box(),0,1.05,Wd/2,0,L,.08,.08,0xffffff,'std');
  for(const sd of[-1,1]){for(let z=-Wd/2;z<=Wd/2;z+=1.5)b.P(W.box(),sd*L/2,0,z,0,.07,1.1,.07,0xffffff,'std');b.P(W.box(),sd*L/2,1.05,0,0,.08,.08,Wd,0xffffff,'std');}
  b.P(W.rbox(L-.4,.04,Wd-.4,.01),0,.01,0,0,1,1,1,0xead9b0,'std');
  // big sign frame at the back
  for(const x of[-3.4,3.4])b.P(W.cyl(8),x,0,-Wd/2+.3,0,.22,4.6,.22,0x2a3a5a,'std');b.P(W.rbox(7.4,1.3,.2,.06),0,4.2,-Wd/2+.3,0,1,1,1,0x2a3a5a,'std');b.signQuad(S13.sign(W,'MUSCLE BEACH','#ffd23a','#2a3a5a',{w:512,h:96}),0,4.85,-Wd/2+.42,0,7,1.15,0);
  // rings / pull-up frame
  b.P(W.cyl(8),-5.5,0,-1,0,.18,3.4,.18,0x3a8ad8,'std');b.P(W.cyl(8),-2.5,0,-1,0,.18,3.4,.18,0x3a8ad8,'std');b.P(W.cyl(8),-4,3.35,-1,0,.12,3.1,.12,0xcccccc,'std',{},0,Math.PI/2);for(const x of[-4.6,-3.4]){b.P(W.box(),x,2.4,-1,0,.02,1,.02,0x888888,'std');b.P(W.tor(Math.PI*2,.05),x,2.25,-1,0,.4,.4,.4,0x222222,'std');}
  // dumbbell rack + benches
  b.P(W.rbox(3,.7,.7,.04),4,0,-3.3,0,1,1,1,0x5a5a66,'std');for(let i=0;i<6;i++){b.P(W.cyl(8),2.8+i*.48,.82,-3.3,0,.22,.22,.22,0x222228,'std',{},Math.PI/2);}
  for(const [x,z] of[[1.5,1.8],[4.8,1]]){b.P(W.rbox(1.6,.12,.45,.03),x,.5,z,.3,1,1,1,0x3a3a44,'std');b.P(W.cyl(8),x,1.05,z,.3,.05,2.2,.05,0xcccccc,'std',{},0,Math.PI/2);for(const k of[-.9,.9])b.P(W.cyl(14),x+Math.cos(.3)*k,1.05,z-Math.sin(.3)*k,.3,.65,.12,.65,0x222228,'std',{},0,Math.PI/2);b.P(W.box(),x+.5,0,z-.2,0,.08,1,.08,0x666a75,'std');b.P(W.box(),x-.5,0,z+.2,0,.08,1,.08,0x666a75,'std');}},
 skatepark(b){b.P(W.rbox(26,.12,18,.03),0,0,0,0,1,1,1,0xcfcfd4,'std');
  // quarter pipes and a fun box with rails (the bowl itself comes from the spawn prop)
  for(const sd of[-1,1]){b.P(W.lathe('qp',[[0,0],[0,2.2],[.3,2.2],[.3,.1],[2.4,0]],2),sd*11.5,0,0,sd>0?0:Math.PI,1,1,6,0xc4c4ca,'std');}
  b.P(W.rbox(4,.9,3,.15),0,0,-5.5,0,1,1,1,0xbcbcc4,'std');for(const sd of[-1,1])b.P(W.rbox(2,.9,3,.1),sd*3,0,-5.5,0,1,1,1,0xbcbcc4,'std',{},0,sd*-.42);
  b.P(W.cyl(6),0,1.25,-3.6,0,.08,6,.08,0xffd23a,'std',{},0,Math.PI/2);for(const x of[-2.6,2.6])b.P(W.cyl(6),x,0,-3.6,0,.08,1.25,.08,0xffd23a,'std');
  for(let i=0;i<3;i++){const uv=S13.graffiti(W,i+1);W.put(b.mb,b.base,W.quad(),-7+i*7,.62,-8.95,0,6.6,1.2,1,0xffffff,'sign',{uv});b.P(W.rbox(7,1.3,.2,.04),-7+i*7,0,-9.1,0,1,1,1,0xd8d8de,'std');}},
 lifeg2(b){PROPS.lifeguard(b);},
 dino(b,o){// original topiary dinosaur (long-neck) in a raised planter
  const g=0x3f8a3a,tip=0x6fb85a;b.P(W.rbox(4.6,.7,2.2,.12),0,0,0,0,1,1,1,0xb8a898,'std',{ao:.8});b.P(W.rbox(4.4,.12,2,.05),0,.7,0,0,1,1,1,0x4a3a2a,'std');
  const P=(x,y,z,sx,sy,sz,v)=>b.P(W.blob(v||0),x,y,z,0,sx,sy,sz,g,'fol',{grad:tip,ao:.75,jit:.1,sway:.004});
  if(!o||o.k===0){P(0,2,0,2.6,1.6,1.4,0);for(const x of[-.8,.8])for(const z of[-.45,.45])P(x,1.15,z,.55,1.1,.55,1);for(let i=0;i<5;i++)P(1.1+i*.32,2.4+i*.5,0,.6,.6,.6,(i+2)%4);P(2.7,4.9,0,1,.6,.65,3);for(let i=0;i<4;i++)P(-1.3-i*.45,1.9-i*.25,0,.7-i*.1,.55-i*.08,.6-i*.1,(i+1)%4);}
  else{P(0,1.9,0,2.2,1.5,1.3,2);for(const x of[-.6,.6])for(const z of[-.4,.4])P(x,1.1,z,.5,1,.5,1);P(1.3,2.6,0,1.3,1,1,0);for(let i=0;i<3;i++)P(1.1-i*.4,3.1+i*.15,0,.25,.6,.3,3);for(let i=0;i<4;i++)P(-1.2-i*.4,1.7-i*.2,0,.6-i*.1,.5,.5,1);}
  b.occ(0,2,0,4,3,1.5);},
 promlamp(b){b.P(W.cyl(10,.8),0,0,0,0,.42,.6,.42,0x1f2a2a,'std');b.P(W.cyl(8,.8),0,.5,0,0,.18,4.4,.18,0x1f2a2a,'std');b.P(W.box(),0,4.6,0,0,1.6,.1,.1,0x1f2a2a,'std');
  for(const x of[-.75,.75]){b.P(W.sph(10),x,4.95,0,0,.55,.62,.55,0xfff2c8,'glow');b.halo(x,4.95,0,0xffd8a0,b.night?4.5:2);}b.P(W.sph(10),0,5.35,0,0,.5,.56,.5,0xfff2c8,'glow');b.halo(0,5.35,0,0xffd8a0,b.night?4.5:2);},
 kiosk(b){const c=b.pick([0x2f6a5a,0x7a2a3a,0x2a3a6a]);b.P(W.rbox(2.4,1.1,1.6,.1),0,0,0,0,1,1,1,c,'std',{ao:.85});b.P(W.rbox(2.6,.1,1.8,.04),0,1.1,0,0,1,1,1,0xe8dcc8,'std');for(const x of[-1.1,1.1])b.P(W.box(),x,1.1,0,0,.08,1.4,.08,0x222222,'std');
  b.P(W.cyl(10,.2),0,2.5,0,0,3.2,.7,2.4,c,'std');for(let i=0;i<5;i++)b.P(W.sph(6),-.8+i*.4,1.25,.3,0,.28,.28,.28,b.pick(PAL.bright),'std');b.halo(0,2.2,.6,0xffd8a0,b.night?3:1.2);
  b.signQuad(S13.sign(W,b.pick(['FLOWERS','MAPS','CHURROS','HATS','POSTCARDS']),'#f6efe0','#7a2a3a'),0,.65,.82,0,2,.5,0);},
 busker(b,o){// small performance spot: speaker, mic stand, open case, a performer figure from the crowd system
  const k=o&&o.k||0;b.P(W.rbox(.7,.9,.5,.06),.9,0,-.3,0,1,1,1,0x222228,'std');b.P(W.cyl(10),.9,.55,-.04,0,.4,.4,.05,0x555560,'std',{},Math.PI/2);
  b.P(W.cyl(6),-.2,0,.2,0,.04,1.5,.04,0x333333,'std');b.P(W.sph(8),-.2,1.55,.2,0,.12,.14,.12,0x222222,'std');b.P(W.rbox(1,.12,.5,.03),.2,.02,1,.2,1,1,1,0x3a2a2a,'std');b.P(W.rbox(.9,.04,.4,.02),.2,.13,1,.2,1,1,1,0xb02a3a,'std');
  if(k===1){b.P(W.rbox(1.4,.12,.45,.03),-1,.85,-.1,0,1,1,1,0x111111,'std');b.P(W.box(),-1,.97,-.02,0,1.3,.03,.22,0xf4f4f4,'std');for(const x of[-1.6,-.4])b.P(W.box(),x,0,-.1,0,.06,.85,.06,0x333333,'std');}
  if(k===2){for(let i=0;i<4;i++)b.P(W.sph(8),-.9+Math.cos(i*1.6)*.35,2.3+Math.sin(i*1.6)*.35,0,0,.16,.16,.16,PAL.bright[i],'std');}
  b.crowd(-.6,-.1,Math.PI,1);},
 bikerack(b){for(let i=0;i<4;i++)b.P(W.tor(Math.PI,.04),-1.2+i*.8,0,0,Math.PI/2,.7,.9,.7,0x9aa0aa,'std');},
 trash(b){b.P(W.cyl(10),0,0,0,0,.6,.95,.6,b.pick([0x2a5bd0,0x3a8a5a,0x555a66]),'std');b.P(W.cyl(10),0,.95,0,0,.66,.08,.66,0x333333,'std');},
});
// ---------- course sets ----------
SETS.venice=function(W,mb,co,cv){const L=cv.L;const OC=-1,IN=1;// place() side: OC = ocean (+x), IN = inland
 const spi=c=>co.spawns.findIndex(s=>s.c===c&&(c!=='bronny'||s.path==='B')&&(c!=='pooping'||s.path==='B'));
 // walk + frontage paving
 const ot=W.pathTex('ofw').clone();ot.needsUpdate=true;ot.repeat.set(3,1);const ofwMat=new THREE.MeshLambertMaterial({map:ot});
 W.strip(cv.A,-.12,.52,-1.5,8.5,.07,ofwMat,7);if(cv.B)W.strip(cv.B,.44,1.2,-1.5,8.5,.07,ofwMat,7);
 // the VENICE sign over the walk
 SK.arch(W,mb,.05,'VENICE',{col:0x2a3a5a,fg:'#2a3a5a',ball:0xff5aa0,w:7,h:8.2});
 // inland storefront row (follows B, which equals A before the fork)
 const bc=cv.B||cv.A;const cols=[0xffe2ec,0xfff2d0,0xd8f0ff,0xe8ffe0,0xfde0c8,0xf0e2ff,0xffffff,0xffd6d6,0xd2f4ee];const aws=PAL.bright;
 const words=['SUNGLASSES','T-SHIRTS','PIZZA SLICE','SURF SHOP','SKATE SHOP','TACOS','SOUVENIRS','HENNA ART','ICE CREAM','JUICE BAR','HATS','POSTERS','SANDALS','BURGERS','BIKE RENTAL','LEMONADE'];let wi=0,mi=0;
 S13.row(W,bc,-.12,1.18,IN,10.5,()=>W.R(6.5,10.5),(b,w,d)=>{const h=W.rnd()<.35?W.R(9.5,12):W.R(6.2,8.8);const mural=W.rnd()<.3?S13.mural(W,(mi++)%4):null;
   PROPS.ofw(b,{w,h,d,col:W.pick(cols),trim:W.pick([0xffffff,0x2a3a5a,0xf4e6c8]),aw:W.pick(aws),uv:S13.sign(W,words[(wi++)%words.length],W.pick(['#ffffff','#2a2a44','#fff3d6']),W.pick(['#ff4a8a','#2a9ad8','#ff7a2a','#7a4ad8'])),mural,kind:W.rnd()<.3?1:0,table:W.rnd()<.4,balc:W.rnd()<.4,roofsign:W.rnd()<.2});
   if(W.rnd()<.55){const v=b.wp(W.R(-w/3,w/3),0,d/2+2.2);W.crowdAt(v.x,v.z,b.ry+W.R(-1,1));}},{depth:8});
 // second row behind (taller hotels / apartments peeking over)
 S13.row(W,bc,-.12,1.18,IN,22,()=>W.R(10,16),(b,w,d)=>{PROPS.building(b,{w,h:W.R(12,20),d,col:W.pick([0xf4ede0,0xe8d8c8,0xd8e4ee,0xf2d8c8])});},{depth:9});
 // palms lining the beach side of the walk
 SK.row(W,-.1,.5,.045,OC,7.8,1.2,(p,ry)=>W.prop('palm',p,ry),{pd:6.5});
 SK.row(W,.5,1.15,.05,IN,7.5,1.2,(p,ry)=>W.prop('palm',p,ry),{pd:6.5,c:cv.B||cv.A});
 // vendors on the beach edge of the walk
 SK.row(W,-.05,.46,.035,OC,5.4,1.9,(p,ry)=>{if(W.rnd()<.75){W.prop('tent',p,ry);if(W.rnd()<.7)W.crowdAt(p.x+Math.sin(ry)*2.2,p.z+Math.cos(ry)*2.2,ry+Math.PI);}},{pd:4.2,sl:1.2});
 // benches, bins and bike racks along the shopfronts
 SK.row(W,0,1.1,.03,IN,7.6,1,(p,ry)=>W.prop(W.pick(['bench','trash','bikerack','bench','lamp']),p,ry),{pd:6.5,c:cv.B||cv.A});
 // Venice Art Walls on the sand
 SK.fit(W,.15,OC,19,7,(p,ry)=>{W.prop('artwall',p,ry+.3);const b=PB(W,mb,p.x,0,p.z,ry);b.crowd(-3,4,0);b.crowd(4,3.5,.5);},{pd:12});
 // paddle tennis courts
 for(const t of[.25,.3])SK.fit(W,t,OC,15,6,(p,ry)=>W.prop('paddle',p,ry),{pd:10,step:3});
 // skate park around Pinco's bowl
 {const i=spi('pinco');if(i>=0){const sp=W.spawnPts[i];const to=W.place(cv.A,co.spawns[i].t,0,0);const ry=W.face(sp,to);const c=sp.clone().addScaledVector(sp.clone().sub(to).setY(0).normalize(),4.5);const b=PB(W,mb,c.x,0,c.z,ry);PROPS.skatepark(b);W.take(c,9);SK.crowdRing(W,c,6,11);}}
 // basketball courts at Bronny's spot (path B, between the walk and The Strand)
 {const i=spi('bronny');if(i>=0){const sp=W.spawnPts[i];const c0=co.spawns[i].path==='B'?cv.B:cv.A;const to=W.place(c0,co.spawns[i].t,0,0);const ry=W.face(sp,to);const away=sp.clone().sub(to).setY(0).normalize();const along=new V3(away.z,0,-away.x);
   const c=sp.clone().addScaledVector(away,2.2).addScaledVector(along,-8.5);const b=PB(W,mb,c.x,0,c.z,ry);PROPS.bcourt(b,{L:22,W:9.5,open:1});W.take(c,10);
   const c2=c.clone().addScaledVector(along,-27);const b2=PB(W,mb,c2.x,0,c2.z,ry);PROPS.bcourt(b2,{L:22,W:9.5,open:1});W.take(c2,10);for(let k=0;k<4;k++){const q=b2.wp(W.R(-8,8),0,W.R(-4,4));W.crowdAt(q.x,q.z,W.R(0,6));}}}
 // Muscle Beach-style outdoor gym pen at Mr Pooping's spot
 {const i=spi('pooping');if(i>=0){const sp=W.spawnPts[i];const c0=co.spawns[i].path==='B'?cv.B:cv.A;const to=W.place(c0,co.spawns[i].t,0,0);const ry=W.face(sp,to);const away=sp.clone().sub(to).setY(0).normalize();const c=sp.clone().addScaledVector(away,3.4);
   const b=PB(W,mb,c.x,0,c.z,ry);PROPS.musclepen(b);W.take(c,8);for(const [x,z] of[[-5,2.5],[5.5,-1.5],[-2,-3]]){const q=b.wp(x,0,z);W.crowdAt(q.x,q.z,W.R(0,6),{force:true,s:1.08});}SK.crowdRing(W,c,5,10);}}
 // the beach: lifeguard towers, volleyball, umbrellas
 for(const z of[30,95,160,225]){const x=W.shoreX(z)-7;const p=new V3(x,0,z);if(W.ok(p,2.4,{pd:6,wm:1})){W.take(p,2.6);W.prop('lifeguard',p,-Math.PI/2);}}
 for(const z of[55,75,130]){const p=new V3(W.shoreX(z)-14,0,z);if(W.ok(p,4.5,{pd:6,wm:1})){W.take(p,4.5);W.prop('volley',p,0);for(let k=0;k<4;k++)W.crowdAt(p.x+W.R(-4,4),p.z+(k%2?2.5:-2.5),k%2?Math.PI:0);}}
 for(let i=0;i<26;i++){const z=W.R(0,250),x=W.shoreX(z)-W.R(4,16);const p=new V3(x,0,z);if(W.ok(p,1.8,{pd:5,wm:1})){W.take(p,1.8);W.prop(W.rnd()<.6?'umbrella':'towel',p,W.R(0,6));if(W.rnd()<.6)W.crowdAt(p.x+1.4,p.z+.6,W.R(0,6));}}
 // The Strand: cyclists and skaters along path A after the fork
 for(let i=0;i<16;i++){const t=W.R(.55,1.12);const s=W.rnd()<.5?1:-1;const p=W.place(cv.A,t,s,W.R(3.2,4.4));const q=new V3(p.x,0,p.z);let ok=true;for(const sp of W.spawnPts)if(sp.distanceTo(q)<4)ok=false;if(ok)W.crowdAt(p.x,p.z,W.yawAt(cv.A,t)+(s>0?0:Math.PI),{force:true});}
 // walkers on the boardwalk
 for(let i=0;i<46;i++){const t=W.R(-.05,1.1);const c=t<.48?cv.A:(cv.B||cv.A);const p=W.place(c,t,W.rnd()<.6?IN:OC,W.R(3.2,8.5));if(W.ok(p,.6,{pd:3,sp:3.5,sl:.8}))W.crowdAt(p.x,p.z,W.R(0,6));}
 // drum circle on the sand
 SK.fit(W,.38,OC,22,4,(p)=>{SK.crowdRing(W,p,10,3.2);for(let k=0;k<5;k++){const a=k*1.25;W.put(mb,new THREE.Matrix4(),W.cyl(10,.85),p.x+Math.cos(a)*2,0,p.z+Math.sin(a)*2,0,.5,.8,.5,0x8a5a3a,'std');}},{pd:14});
 // Santa Monica's pier and wheel waiting at the end of The Strand
 SETS._pier(W,mb,284);
};
SETS._pier=function(W,mb,z0){const L=120,Wd=16;const bx=W.shoreX(z0)-6,bz=z0;const b=PB(W,mb,bx,0,bz,Math.PI/2);
 b.P(W.rbox(Wd,.5,L,.1),0,2.4,L/2,0,1,1,1,0xc8a27a,'std',{ao:.9});for(let z=2;z<L;z+=6)for(const x of[-Wd/2+.6,0,Wd/2-.6])b.P(W.cyl(8),x,-3,z,0,.55,5.5,.55,0x7a5a3a,'std');
 for(const x of[-Wd/2+.2,Wd/2-.2]){b.P(W.rbox(.15,.12,L,.03),x,3.7,L/2,0,1,1,1,0xffffff,'std');for(let z=1;z<L;z+=2.5)b.P(W.rbox(.12,1,.12,.02),x,2.8,z,0,1,1,1,0xffffff,'std');}
 for(const x of[-6,6])b.P(W.rbox(.6,7,.6,.12),x,2.6,3,0,1,1,1,0x2a6ad8,'std');const uv=S13.sign(W,'PIER','#2a6ad8','#ffffff',{w:256,h:64,edge:'#ffd23a'});b.P(W.rbox(12.6,1.6,.3,.2),0,8,3,0,1,1,1,0x2a6ad8,'std');b.signQuad(uv,0,8.8,2.8,Math.PI,8,2,1);
 for(let z=14;z<L-10;z+=12){for(const x of[-Wd/2+1,Wd/2-1])PROPS.lamp(PB(W,mb,...b.wp(x,2.65,z).toArray(),x>0?-Math.PI/2:Math.PI/2));}
 const wc=b.wp(2,2.65,52);const wheel=SK.group(W);wheel.position.set(wc.x,wc.y+13,wc.z);const R=11;
 SK.local(W,wheel,lb=>{for(let i=0;i<16;i++){const a=i/16*Math.PI*2;lb.P(W.cyl(6),0,0,0,0,.18,R,.18,i%2?0xffd23a:0xffffff,'std',{},0,a);}lb.P(W.tor(Math.PI*2,.025),0,0,0,0,R*2,R*2,R*2,0xff5a8a,'std');lb.P(W.tor(Math.PI*2,.03),0,0,0,0,R*1.3,R*1.3,R*1.3,0x3ac0e0,'std');
  lb.P(W.cyl(10),0,0,-.6,0,1.2,1.2,1.2,0xffffff,'std',{},Math.PI/2);for(let i=0;i<24;i++){const a=i/24*Math.PI*2;lb.P(W.sph(6),0,Math.cos(a)*R,Math.sin(a)*R,0,.4,.4,.4,[0xff5a8a,0xffd23a,0x3ac0e0][i%3],'glow');}});
 wheel.rotation.order='YXZ';wheel.rotation.y=0;
 SK.local(W,SK.group(W),lb=>{for(const sd of[-1,1])for(const xx of[-1.3,1.3])lb.P(W.cyl(8),wc.x+sd*3.4,wc.y,wc.z+xx,0,.45,14.4,.45,0xffffff,'std',{},0,sd*.23);});
 W.anims.push((dt,t)=>{wheel.rotation.x=t*.12;});W.halo(wc.x,wc.y+13,wc.z,0xffc0e0,10);
 const cc2=b.wp(-3,2.65,84);const curve=new THREE.CatmullRomCurve3([[-10,0,0],[-4,6,0],[2,10,-2],[6,6,-4],[2,2,-6],[-4,8,-8],[-10,4,-6],[-14,2,-2]].map(a=>new V3(cc2.x+a[0],cc2.y+1+a[1],cc2.z+a[2])),true);
 W.mb.add(new THREE.TubeGeometry(curve,90,.32,6,true),new THREE.Matrix4(),0xff4a5a,'std');for(let i=0;i<14;i++){const q=curve.getPointAt(i/14);W.put(mb,new THREE.Matrix4(),W.cyl(6),q.x,cc2.y,q.z,0,.3,Math.max(.5,q.y-cc2.y),.3,0xffffff,'std');}
 for(let i=0;i<30;i++){const q=b.wp(W.R(-Wd/2+1.5,Wd/2-1.5),0,W.R(8,L-8));W.crowdAt(q.x,q.z,W.R(0,6),{y:2.65,force:true});}};
SETS.santamonica=function(W,mb,co,cv){const c=cv.A;const L=cv.L;
 const pt=W.pathTex('paver').clone();pt.needsUpdate=true;pt.repeat.set(9,1);const pav=new THREE.MeshLambertMaterial({map:pt});W.strip(c,-.14,1.22,0,12.2,.07,pav,7);
 const crossT=[.33,.67];const inCross=t=>crossT.some(x=>Math.abs(t-x)<.032);
 // cross streets (asphalt + crosswalk stripes)
 const asph=new THREE.MeshLambertMaterial({color:0x4a4a55});
 for(const ct of crossT){const p=W.place(c,ct,0,0);const ry=W.yawAt(c,ct);const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.box(),0,.075,0,0,110,.02,11,0x45454f,'std');for(let i=-5;i<=5;i++)if(Math.abs(i)>0)b.P(W.box(),i*1.1,.09,6.4,0,.6,.01,2.4,0xf4f4f4,'std');for(let i=-5;i<=5;i++)b.P(W.box(),i*1.1,.09,-6.4,0,.6,.01,2.4,0xf4f4f4,'std');
  for(const x of[-30,-18,18,30])b.P(W.box(),x,.09,0,0,3,.01,.18,0xf2c230,'std');
  for(const sd of[-1,1]){b.P(W.cyl(8),sd*10.6,0,-6.8,0,.16,4.2,.16,0x2a2a30,'std');b.P(W.rbox(.5,1.3,.45,.1),sd*10.6,3.4,-6.6,0,1,1,1,0x2a2a30,'std');b.P(W.sph(8),sd*10.6,4.3,-6.36,0,.3,.3,.1,0xff3a3a,'glow');b.halo(sd*10.6,4.3,-6.2,0xff4a3a,1.4);
   for(const zz of[-14,-26,14,26])PROPS.building(PB(W,mb,...b.wp(sd*40,0,zz).toArray(),sd>0?-Math.PI/2:Math.PI/2),{w:11,h:W.R(12,22),d:10,col:W.pick([0x6a5a7a,0x5a6a8a,0x7a6a6a]),flat:1});}}
 // facades on both sides
 const cols=[0xe8d8c4,0xd8c8b8,0xf0e4d4,0xc8b8a8,0xe0cbb8,0xd6dde4,0xf2dccc,0xbfc7cf];const words=['BOOKS','SHOES','GELATO','TOYS','OPTICS','DENIM','CAFE','CINEMA','RECORDS','BAKERY','GAMES','PHOTO','TEA HOUSE','FLOWERS','SKATE','PIANO','CANDY','ART'];let wi=0;
 for(const s of[-1,1])S13.row(W,c,-.14,1.2,s,12.4,()=>W.R(7,11.5),(b,w,d,tc)=>{const h=W.R(9,17);const col=W.pick(cols);b.P(W.rbox(w,h,d,.12),0,0,0,0,1,1,1,col,'std',{ao:.8,jit:.04});
   b.P(W.rbox(w+.3,.55,d+.3,.08),0,h-.25,0,0,1,1,1,0xf4ece0,'std');b.P(W.rbox(w+.1,.25,d+.1,.05),0,4.3,0,0,1,1,1,0xf4ece0,'std');
   // tall glass shopfront, lit warm at dusk
   b.P(W.rbox(w-1.4,3.2,.1,.02),0,.25,d/2+.02,0,1,1,1,0xffe0a8,'glow');for(let k=0;k<=3;k++)b.P(W.box(),-w/2+.7+k*(w-1.4)/3,.2,d/2+.08,0,.12,3.4,.1,0x2a2a30,'std');b.P(W.box(),0,3.45,d/2+.08,0,w-1.2,.14,.12,0x2a2a30,'std');
   const word=words[(wi++)%words.length];const cinema=word==='CINEMA';
   if(cinema){b.P(W.rbox(w-1,1.6,1.4,.1),0,3.7,d/2+.7,0,1,1,1,0x2a2a44,'std');b.signQuad(S13.sign(W,'NOW SHOWING  ★  SNAP!','#fff2c8','#2a2a44',{w:512,h:64}),0,4.5,d/2+1.42,0,w-1.4,.9,1);for(let k=0;k<12;k++)b.halo(-w/2+1+k*(w-2)/11,3.75,d/2+1.45,0xffe0a0,.9);}
   else{const aw=W.pick([0x7a2a3a,0x2a4a3a,0x2a3a6a,0x6a4a2a,0x3a3a3a]);b.P(W.rbox(w-1,.12,1.5,.04),0,3.6,d/2+.75,0,1,1,1,aw,'std',{},.32);b.signQuad(S13.sign(W,word,'#1e1a24',W.pick(['#ffe7a8','#ffd0e0','#c8f0ff']),{w:256,h:64,neon:1}),0,4.0,d/2+.12,0,Math.min(w*.7,4),Math.min(w*.7,4)/4,1);}
   const fl=Math.floor((h-5.2)/2.8);const nc=Math.max(2,Math.floor(w/2.3));for(let f=0;f<fl;f++)for(let k=0;k<nc;k++){const x=(k-(nc-1)/2)*(w/nc),y=5.4+f*2.8;const lit=W.rnd()<.55;b.P(W.rbox(1.15,1.6,.1,.03),x,y,d/2+.03,0,1,1,1,lit?W.pick([0xffe2a8,0xffd08a,0xfff0d0]):0x3a3e5a,lit?'glow':'glass');b.P(W.box(),x,y-.12,d/2+.08,0,1.4,.12,.22,0xf4ece0,'std');}
   if(W.rnd()<.4){b.P(W.rbox(w*.6,.15,.9,.04),0,5.3,d/2+.45,0,1,1,1,0x2a2a30,'std');for(let k=0;k<6;k++)b.P(W.box(),-w*.3+k*w*.12,5.4,d/2+.88,0,.04,.8,.04,0x2a2a30,'std');}
   {const pc=new THREE.Color(col).multiplyScalar(.82).getHex();for(const sx of[-1,1])b.P(W.box(),sx*(w/2-.18),.1,d/2+.06,0,.36,h-.5,.22,pc,'std');b.P(W.box(),0,.1,d/2+.07,0,w-.4,.28,.16,pc,'std');}
   if(!cinema&&W.rnd()<.55){const sx=W.rnd()<.5?-1:1,bx=sx*(w/2-.9),bc=W.pick(['#ffe7a8','#ffd0e0','#c8f0ff','#d8ffc8']),bw=['★','♪','☕','✿','◆','♥'][(W.rnd()*6)|0];
    b.P(W.box(),bx,5.95,d/2+.5,0,.08,.08,1,0x2a2a30,'std');b.P(W.rbox(.14,1.25,.95,.05),bx,4.75,d/2+.62,0,1,1,1,0x2a2a30,'std');const u=S13.sign(W,bw,'#2a2030',bc,{w:64,h:64,neon:1});for(const r of[-1,1])b.signQuad(u,bx+r*.08,5.35,d/2+.62,r*Math.PI/2,.8,.8,1);}
   b.occ(0,h/2,0,w,h,d);if(W.rnd()<.65){const v=b.wp(W.R(-w/3,w/3),0,d/2+1.8);W.crowdAt(v.x,v.z,b.ry+W.R(-1.2,1.2));}},{depth:9,skip:inCross});
 // string lights zig-zagging across the street
 for(let t=-.06;t<1.16;t+=.045){if(inCross(t))continue;const a=W.place(c,t,1,12.2),b2=W.place(c,t+.022,-1,12.2);const I=new THREE.Matrix4();for(let i=0;i<=16;i++){const k=i/16;const x=a.x+(b2.x-a.x)*k,z=a.z+(b2.z-a.z)*k,y=8.4-Math.sin(k*Math.PI)*1.3;W.put(mb,I,W.sph(6),x,y,z,0,.17,.22,.17,0xfff0c0,'glow');if(i%2===0)W.halo(x,y,z,0xffd8a0,.7);}}
 // lamps, palms in planters, topiary dinos, kiosks, performers (all kept clear of the friends)
 SK.row(W,-.08,1.12,.06,1,10.2,1,(p,ry)=>W.prop('promlamp',p,ry),{pd:8});SK.row(W,-.05,1.12,.06,-1,10.2,1,(p,ry)=>W.prop('promlamp',p,ry),{pd:8});
 for(const s of[-1,1])SK.row(W,-.02+(s>0?.02:0),1.12,.085,s,9.6,1.4,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(1.8,.6,1.8,.1),0,0,0,0,1,1,1,0xb8a898,'std');W.prop(W.rnd()<.6?'palm':'tree',p.clone().setY(.6),ry);},{pd:8,sl:1});
 let dk=0;for(const t of[.08,.22,.45,.58,.8,.95])SK.fit(W,t,(dk%2?1:-1),5.6,2.6,(p,ry)=>{PROPS.dino(PB(W,mb,p.x,0,p.z,ry+Math.PI/2),{k:dk%2});dk++;},{pd:4.4,step:1.6,tries:4});
 for(const t of[.15,.52,.88])SK.fit(W,t,(t>.5?-1:1),6.4,1.8,(p,ry)=>W.prop('kiosk',p,ry),{pd:5,step:1.5});
 let bk=0;for(const t of[.28,.62,.74,1.02])SK.fit(W,t,(bk%2?-1:1),8,3,(p,ry)=>{PROPS.busker(PB(W,mb,p.x,0,p.z,ry),{k:bk});const b=PB(W,mb,p.x,0,p.z,ry);for(let k=0;k<7;k++){const a=-1.2+k*.4;const q=b.wp(Math.sin(a)*3.4,0,Math.cos(a)*3.4);W.crowdAt(q.x,q.z,b.ry+a+Math.PI);}bk++;},{pd:5,step:1.5});
 for(const s of[-1,1])SK.row(W,0,1.1,.07,s,8.6,.8,(p,ry)=>W.prop(W.pick(['bench','trash','bench','bikerack']),p,ry),{pd:7.5});
 // sidewalk cafe clusters in front of the shops
  let cf=0;for(const t of[.05,.19,.41,.55,.71,.86,1.0])SK.fit(W,t,(cf++%2?1:-1),9.2,2.8,(p,ry)=>{for(let k=-1;k<=1;k++){const q=PB(W,mb,p.x,0,p.z,ry).wp(k*2.3,0,0);if(k===0||W.rnd()<.8)W.prop('cafe',q,ry+W.R(-.3,.3));}},{pd:6,step:1.2,tries:4});
  for(let i=0;i<170;i++){const t=W.R(-.05,1.12);const p=W.place(c,t,W.rnd()<.5?1:-1,W.R(2.8,10.5));if(W.ok(p,.6,{pd:2.6,sp:3.2,sl:.7}))W.crowdAt(p.x,p.z,W.R(0,6));}
 // ocean-side hint at the far end: a glimpse of palms and the evening sky down the street
};
// ---- v1.3: instanced grass tufts + wildflowers along the rail on grass courses (2 draw calls) ----
W.tufts=function(co,S,cv){const V=this.VIS;if(V.gr!=='grass'||this.noTufts)return;const R=(a,b)=>a+this.rnd()*(b-a);
 const tex=(fn)=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');fn(g);const t=new THREE.CanvasTexture(c);if(THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;return t;};
 const gt=tex(g=>{for(let i=0;i<16;i++){const x=6+Math.random()*52,h=26+Math.random()*36,lean=(Math.random()-.5)*16;g.strokeStyle=`hsl(${95+Math.random()*25},${45+Math.random()*20}%,${30+Math.random()*28}%)`;g.lineWidth=3+Math.random()*2;g.lineCap='round';g.beginPath();g.moveTo(x,64);g.quadraticCurveTo(x+lean*.3,64-h*.6,x+lean,64-h);g.stroke();}});
 const ft=tex(g=>{g.strokeStyle='#4f8f3a';g.lineWidth=3;for(const x of[20,44]){g.beginPath();g.moveTo(x,64);g.lineTo(x+(x<32?-3:3),30);g.stroke();}for(const [x,y] of[[17,24],[47,22],[32,34]]){g.fillStyle='#fff';for(let k=0;k<5;k++){const a=k/5*6.283;g.beginPath();g.arc(x+Math.cos(a)*6,y+Math.sin(a)*6,5,0,7);g.fill();}g.fillStyle='#ffcf3a';g.beginPath();g.arc(x,y,4,0,7);g.fill();}});
 const cross=(w,h)=>{const a=new THREE.PlaneGeometry(w,h);a.translate(0,h/2,0);const b=a.clone();b.rotateY(Math.PI/2);const g=THREE.BufferGeometryUtils?THREE.BufferGeometryUtils.mergeBufferGeometries([a,b]):null;if(g)return g;
  const P=[...a.attributes.position.array,...b.attributes.position.array],N=[...a.attributes.normal.array,...b.attributes.normal.array],U=[...a.attributes.uv.array,...b.attributes.uv.array],I=[...a.index.array,...[...b.index.array].map(i=>i+4)];
  const m=new THREE.BufferGeometry();m.setAttribute('position',new THREE.Float32BufferAttribute(P,3));m.setAttribute('normal',new THREE.Float32BufferAttribute(N.map((v,i)=>i%3===1?1:0),3));m.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));m.setIndex(I);return m;};
 const curves=[cv.A];if(cv.B)curves.push(cv.B);const sp=this.spawnPts||[];const pts=[],fls=[];const q=new THREE.Vector3();
 for(const c of curves){const n=c===cv.A?1250:560;for(let i=0;i<n;i++){const t=R(-.02,1.02),s=this.rnd()<.5?1:-1,d=Math.pow(this.rnd(),1.6)*30+2.6;const p=this.place(c,Math.max(0,Math.min(1,t)),s,d);if(t<0||t>1)p.z+=(t<0?t:t-1)*250;
  if(this.pathDist(p.x,p.z)<2.4)continue;if(co.water&&this.waterD(p.x,p.z)>-3)continue;q.set(p.x,0,p.z);let bad=false;for(const s0 of sp){q.y=s0.y;if(s0.distanceTo(q)<2.2){bad=true;break;}}if(bad)continue;
  p.y=this.H(p.x,p.z);(this.rnd()<.2?fls:pts).push(p);}}
 const mk=(arr,geo,map,sz,cols)=>{if(!arr.length)return;const mat=new THREE.MeshLambertMaterial({map,alphaTest:.45,side:THREE.DoubleSide});const im=new THREE.InstancedMesh(geo,mat,arr.length);const o=new THREE.Object3D();const col=new THREE.Color();
  arr.forEach((p,i)=>{o.position.copy(p);o.rotation.set(0,this.rnd()*6.28,0);const k=R(sz[0],sz[1]);o.scale.set(k,k*R(.8,1.25),k);o.updateMatrix();im.setMatrixAt(i,o.matrix);col.set(cols[(this.rnd()*cols.length)|0]);col.offsetHSL(0,0,R(-.06,.06));im.setColorAt(i,col);});
  im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.frustumCulled=false;S.add(im);return im;};
 const gc=new THREE.Color(V.g2).lerp(new THREE.Color(0xffffff),.25).getHex();
 mk(pts,cross(1,.62),gt,[.45,.92],[gc,0xffffff,0xe8ffd0]);
 mk(fls,cross(.7,.6),ft,[.6,.95],[0xffffff,0xffd6ec,0xfff2a8,0xd8e4ff,0xffc4c4]);};
{const _b=W.build;W.build=function(co,S){const cv=_b.call(this,co,S);try{this.tufts(co,S,cv);}catch(e){console.warn('tufts',e);}return cv;};}
