'use strict';
// Original procedural props for Pinco Pooh Snap v1.1 (merged into a few draw calls by W's mesh builder).
// Convention: local +z faces the rail.
function PB(W,mb,x,y,z,ry,s){s=s||1;const base=MX(x,y,z,ry,s,s,s);const b={W,mb,base,ry,s,night:!!W.VIS.night,
 P(geo,x,y,z,r,sx,sy,sz,col,k,o,rx,rz){W.put(mb,base,geo,x,y,z,r,sx,sy,sz,col,k,o,rx,rz);},
 R:(a,c)=>W.R(a,c),pick:a=>W.pick(a),
 wp(x,y,z){return new V3(x,y,z).applyMatrix4(base);},
 halo(x,y,z,col,size){const v=b.wp(x,y,z);W.halo(v.x,v.y,v.z,col,(size||1)*s);},
 crowd(x,z,r,sc){const v=b.wp(x,0,z);W.crowdAt(v.x,v.z,(r||0)+ry,{s:sc||1});},
 occ(x,y,z,w,h,d){const v=b.wp(x,y,z);W.occBox(v.x,v.y,v.z,w*s,h*s,d*s,ry);},
 sign(text,bg,fg,opt){return W.signUV(text,bg,fg,opt);},
 signQuad(uv,x,y,z,r,w,h,glow){W.put(mb,base,W.quad(),x,y,z,r||0,w,h,1,0xffffff,glow?'signB':'sign',{uv});},
};return b;}
const PAL={pastel:[0xffb3c8,0x9fe0e8,0xffe28a,0xc9b3ff,0xb8eaa0,0xffc59a,0xa8d4ff,0xf7d0e8],bright:[0xff5a8a,0x3ac0e0,0xffd23a,0x7ad85a,0xb07aff,0xff8a3a],
 leaf:[0x4fb848,0x5cc452,0x3fa844,0x6ccf58],leafTip:[0x9be36a,0xa8ea72,0x8ad860]};
const PROPS={
 palm(b){const h=b.R(7,11),lean=b.R(-.5,.5),seg=8;let px=0,py=0;for(let i=0;i<seg;i++){const t=i/seg,x=Math.sin(t*1.6)*lean*1.6;b.P(W.cyl(8,.92),x,py,0,0,.62-t*.2,h/seg+.05,.62-t*.2,i%2?0x9a6a3a:0x8a5c34,'std',{ao:.85},0,-lean*.18);py+=h/seg;px=x;}
  for(let i=0;i<12;i++){const a=i*Math.PI*2/12+b.R(-.15,.15);const up=i%2?b.R(-.35,-.1):b.R(.05,.3);b.P(W.frond(),px,py-.15,0,a,1.3,1.15,1.15,b.pick(PAL.leaf),'fol',{grad:b.pick(PAL.leafTip),sway:.05},up);}
  for(let i=0;i<3;i++)b.P(W.sph(8),px+Math.cos(i*2.1)*.35,py-.45,Math.sin(i*2.1)*.35,0,.42,.45,.42,0x6a4a2a,'std');b.occ(px*.5,h/2,0,1,h,1);},
 tree(b,o){o=o||{};const h=o.h||b.R(2.2,3.4),r=o.r||b.R(2.6,3.4);const leaf=o.col||b.pick(PAL.leaf),tip=o.tip||b.pick(PAL.leafTip);
  b.P(W.cyl(8,.7),0,0,0,0,.6,h+1,.6,o.trunk||0x8a5a3a,'std',{ao:.8});b.P(W.cyl(6,.5),.2,h*.7,0,0,.25,1.6,.25,o.trunk||0x8a5a3a,'std',{},0,-.7);b.P(W.cyl(6,.5),-.2,h*.8,0,0,.22,1.4,.22,o.trunk||0x8a5a3a,'std',{},.2,.8);
  const n=o.n||5;for(let i=0;i<n;i++){const a=i*2.4,rr=i===n-1?0:r*.35;const sc=r*(i===n-1?.95:b.R(.75,.95));b.P(W.blob((i+(o.v||0))%4),Math.cos(a)*rr,h+r*.45+(i===n-1?r*.45:b.R(-.1,.35)*r),Math.sin(a)*rr,b.R(0,6),sc*1.15,sc*.95,sc*1.15,leaf,'fol',{grad:tip,ao:.72,sway:.025,jit:.12});}
  b.occ(0,h+r*.6,0,r*1.6,r*1.6,r*1.6);},
 sakura(b){PROPS.tree(b,{col:0xf4a3c4,tip:0xffd8ea,trunk:0x5a3a3a,v:1});for(let i=0;i<4;i++)b.P(W.sph(6),b.R(-2.5,2.5),.03,b.R(-2.5,2.5),0,b.R(1.5,2.6),.04,b.R(1.5,2.6),0xffc9dd,'std');},
 ginkgo(b){const h=b.R(2,2.8);b.P(W.cyl(8,.7),0,0,0,0,.55,h+3,.55,0x7a5a3a,'std',{ao:.8});for(let i=0;i<4;i++){const s=2.9-i*.6;b.P(W.blob(i),0,h+1+i*1.5,0,i,s*1.2,s*.9,s*1.2,0xf2c62a,'fol',{grad:0xffe680,ao:.75,sway:.025,jit:.12});}b.occ(0,h+3,0,4,6,4);},
 cedar(b){const h=b.R(13,19);b.P(W.cyl(8,.6),0,0,0,0,.8,h*.6,.8,0x6a4430,'std',{ao:.8});for(let i=0;i<5;i++){const t=i/5,r=4.2*(1-t*.7);b.P(W.cone(10),0,h*.25+i*h*.15,0,i,r,h*.28,r,0x2f7d3e,'fol',{grad:0x5aae52,ao:.7,sway:.012,jit:.1});}b.occ(0,h*.55,0,4,h*.7,4);},
 fern(b){for(let i=0;i<7;i++)b.P(W.frond(),0,.1,0,i*.9+b.R(0,.4),.42,.5,.42,b.pick([0x2f9a3a,0x3aaa48]),'fol',{grad:0x7ad860,sway:.08},-.5);},
 monstera(b){for(let i=0;i<6;i++){b.P(W.cyl(5),0,0,0,0,.06,.9+i*.08,.06,0x2f8a3a,'std',{},Math.cos(i)*.5,Math.sin(i)*.5);b.P(W.sph(10),Math.sin(i*1.05)*.7,1.1+i*.1,Math.cos(i*1.05)*.7,i,1.2,.08,1,0x2a9a40,'fol',{sway:.06,grad:0x5acf60},.5,0);}},
 bush(b,o){const col=b.pick(PAL.leaf);for(let i=0;i<3;i++)b.P(W.blob(i),b.R(-.8,.8),.55,b.R(-.5,.5),b.R(0,6),b.R(1.5,2),b.R(1.2,1.5),b.R(1.5,2),col,'fol',{grad:0x9be36a,ao:.6,sway:.02,jit:.12});
  if(o&&o.flowers||b.R(0,1)<.5){const fc=b.pick([0xff5a8a,0xffffff,0xffd23a,0xb08aff]);for(let i=0;i<7;i++)b.P(W.sph(6),b.R(-1,1),b.R(.6,1.4),b.R(-.7,.7),0,.22,.22,.22,fc,'std');}b.occ(0,.7,0,2.2,1.4,1.6);},
 hibiscus(b){PROPS.bush(b,{flowers:1});for(let i=0;i<5;i++){const c=b.pick([0xff3a5a,0xff7ab0,0xffd23a,0xff6a2a]);const x=b.R(-.9,.9),y=b.R(.8,1.4),z=b.R(-.3,.8);for(let k=0;k<5;k++)b.P(W.sph(6),x+Math.cos(k*1.26)*.16,y,z+Math.sin(k*1.26)*.16,0,.24,.08,.24,c,'std');b.P(W.sph(5),x,y+.05,z,0,.08,.08,.08,0xffe14a,'std');}},
 flowers(b){b.P(W.rbox(3,.3,1.6,.12),0,0,0,0,1,1,1,0xa0704a,'std');b.P(W.rbox(2.8,.12,1.4,.05),0,.26,0,0,1,1,1,0x5a3a26,'std');const c=[b.pick(PAL.bright),b.pick(PAL.bright),0xffffff];for(let i=0;i<14;i++){const x=b.R(-1.2,1.2),z=b.R(-.5,.5);b.P(W.cyl(4),x,.3,z,0,.04,.3,.04,0x3a9a3a,'std');b.P(W.sph(6),x,.65,z,0,.24,.18,.24,c[i%3],'std');}},
 planter(b){b.P(W.cyl(10,1.25),0,0,0,0,1.1,.9,1.1,0xd8784a,'std',{ao:.8});b.P(W.cyl(10),0,.88,0,0,1.25,.1,1.25,0xe8906a,'std');b.P(W.blob(1),0,1.3,0,0,1.3,1.1,1.3,0x4ab84a,'fol',{grad:0x9be36a,sway:.03});for(let i=0;i<5;i++)b.P(W.sph(6),b.R(-.5,.5),b.R(1.4,1.9),b.R(-.5,.5),0,.24,.24,.24,b.pick([0xff5a8a,0xffd23a,0xb08aff]),'std');},
 rock(b){const s=b.R(1.4,2.6);b.P(W.blob(b.R(0,4)|0),0,s*.25,0,b.R(0,6),s,s*b.R(.5,.75),s*b.R(.8,1.1),b.pick([0x8a8478,0x9a9488,0x5a5560]),'std',{jit:.18,ao:.7});b.occ(0,s*.3,0,s*.9,s*.6,s*.9);},
 lavarock(b){const s=b.R(1.2,2.4);b.P(W.blob(b.R(0,4)|0),0,s*.2,0,b.R(0,6),s,s*.6,s,0x5a5560,'std',{jit:.25,ao:.7});},
 // ----- beach -----
 umbrella(b,o){const cA=o&&o.c||b.pick(PAL.bright),cB=0xffffff;b.P(W.cyl(6),0,0,0,0,.09,2.7,.09,0xf4f4f4,'std');for(let i=0;i<8;i++)b.P(W.sg('umb'+i,()=>new THREE.ConeGeometry(.5,1,3,1,false,i*Math.PI/4,Math.PI/4).translate(0,.5,0)),0,2.3,0,0,3.6,.9,3.6,i%2?cA:cB,'std',{ao:.85});
  b.P(W.sph(6),0,3.2,0,0,.18,.18,.18,cA,'std');if(!o||!o.nochair){b.P(W.rbox(.8,.1,1.8,.04),1.3,.35,.6,.2,1,1,1,b.pick(PAL.pastel),'std');b.P(W.rbox(.8,.1,.9,.04),1.3,.6,-.35,.2,1,1,1,b.pick(PAL.pastel),'std',{},-.9);}},
 towel(b){const c=[b.pick(PAL.bright),0xffffff,b.pick(PAL.bright)];for(let i=0;i<3;i++)b.P(W.rbox(1.3,.05,.75,.02),0,.02,-.75+i*.75,0,1,1,1,c[i],'std');},
 surf(b){b.P(W.rbox(2.6,.2,.3,.08),0,1.6,-.3,0,1,1,1,0x9a6a3a,'std');for(const x of[-1.2,1.2])b.P(W.rbox(.2,1.8,.3,.06),x,0,-.3,0,1,1,1,0x9a6a3a,'std');
  for(let i=0;i<4;i++){const c=b.pick(PAL.bright);b.P(W.sph(10),(i-1.5)*.62,1.35,0,0,.55,2.7,.14,c,'std',{},0,(i-1.5)*.06);b.P(W.sph(8),(i-1.5)*.62,1.35,.05,0,.08,2.4,.15,0xffffff,'std',{},0,(i-1.5)*.06);}},
 lifeguard(b){const c=b.pick([0x6ac8ff,0xff8ab8,0xffd23a,0x8ae06a]);for(const x of[-1.1,1.1])for(const z of[-1.1,1.1])b.P(W.cyl(6),x,0,z,0,.22,2.4,.22,0xf2efe6,'std');b.P(W.rbox(3.4,.25,3.4,.08),0,2.4,0,0,1,1,1,0xf2efe6,'std');
  b.P(W.rbox(2.6,1.9,2.4,.25),0,2.6,0,0,1,1,1,c,'std',{ao:.85});b.P(W.rbox(2,.8,.08,.05),0,3.3,1.21,0,1,1,1,0x3a4a5a,'glass');b.P(W.rbox(3,.3,2.9,.12),0,4.5,0,0,1,1,1,0xffffff,'std');
  for(let i=0;i<5;i++)b.P(W.rbox(.9,.08,.5,.02),0,i*.5,1.9+i*.42,0,1,1,1,0xf2efe6,'std',{},-.6);b.P(W.cyl(5),1.2,4.6,0,0,.05,1.8,.05,0xdddddd,'std');b.P(W.box(),1.55,5.9,0,0,.7,.45,.03,0xff3a3a,'std');b.occ(0,3,0,2.6,3.5,2.4);},
 // ----- street -----
 building(b,o){o=o||{};const w=o.w||b.R(7,11),h=o.h||b.R(7,16),d=o.d||b.R(6,9);const N=b.night;
  const col=o.col||(N?b.pick([0x5a4a9a,0x3a4a8a,0x7a4a8a,0x4a5a7a]):b.pick(PAL.pastel));b.P(W.rbox(w,h,d,.3),0,0,0,0,1,1,1,col,'std',{ao:.78});
  b.P(W.rbox(w+.5,.5,d+.5,.15),0,h-.1,0,0,1,1,1,N?0x8a7ab8:0xffffff,'std');b.P(W.rbox(w+.2,1,d+.2,.1),0,0,0,0,1,1,1,N?0x2a2a44:0xf4ece0,'std');
  const fl=Math.max(2,Math.floor((h-1.5)/2.6)),cols=Math.max(2,Math.floor(w/2.1));
  for(const face of[0,1,2]){const fw=face?d:w,nc=face?Math.max(1,Math.floor(d/2.3)):cols;const zf=face?0:d/2+.03;
   for(let f=0;f<fl;f++)for(let c=0;c<nc;c++){const lx=(c-(nc-1)/2)*(fw/nc),y=1.6+f*2.6;if(y+1.2>h-.4)continue;let x=lx,z=zf,r=0;if(face===1){x=w/2+.03;z=lx;r=Math.PI/2;}if(face===2){x=-w/2-.03;z=lx;r=-Math.PI/2;}
    const lit=N&&b.R(0,1)<.65;b.P(W.rbox(1.1,1.35,.12,.04),x,y,z,r,1,1,1,lit?b.pick([0xffe7a0,0xffd27a,0xbfe8ff,0xff9ae0]):(N?0x2a2a4a:b.pick([0x8fd0f5,0xa7dcf8,0x9ad7ef])),lit?'glow':'glass');
    if(!N)b.P(W.rbox(1.3,.12,.24,.04),x,y-.1,z,r,1,1,1,0xffffff,'std');}}
  if(!o.flat){b.P(W.cyl(10),w*.25,h+.3,-d*.15,0,1.4,1.6,1.4,N?0x6a6a8a:0xd8d4cc,'std');b.P(W.cone(10),w*.25,h+1.9,-d*.15,0,1.6,.6,1.6,N?0x5a5a7a:0xb8b4ac,'std');b.P(W.rbox(1.6,1,1.2,.1),-w*.25,h+.3,0,0,1,1,1,0xc8c8cc,'std');}
  if(N&&b.R(0,1)<.75){const nc=b.pick(['#ff4ad8','#4af0ff','#ffe14a','#9a6aff','#4aff9a']);const t=b.pick(['カラオケ','ラーメン','スナップ','ピンコ','たいやき','ゲーム','SNAP','PINCO','カフェ','すし']);const uv=b.sign(t,'#140c2a',nc,{neon:1});
   const sw=Math.min(w*.8,6.5);b.signQuad(uv,0,h*.7,d/2+.12,0,sw,sw/4,1);b.halo(0,h*.7,d/2+1,parseInt(nc.slice(1),16),5);
   if(b.R(0,1)<.6){const t2=b.pick(['居酒屋','本','ゲーム','カラオケ','ピンコ']);const uv2=b.sign(t2,'#140c2a',b.pick(['#ff4ad8','#4af0ff','#ffe14a']),{neon:1,w:64,h:256});b.signQuad(uv2,w/2+.15,h*.45,d/2-.6,Math.PI/2,1.4,5.6,1);}}
  b.occ(0,h/2,0,w,h,d);},
 shop(b,o){o=o||{};const w=o.w||b.R(5.5,7.5),h=o.h||b.R(4.2,6.5),d=4.6;const N=b.night;const col=o.col||b.pick(PAL.pastel),aw=o.aw||b.pick(PAL.bright);
  b.P(W.rbox(w,h,d,.2),0,0,0,0,1,1,1,col,'std',{ao:.8});b.P(W.rbox(w+.3,.45,d+.3,.12),0,h-.1,0,0,1,1,1,0xffffff,'std');
  b.P(W.rbox(w*.55,2.2,.14,.05),-w*.12,.5,d/2,0,1,1,1,N?0xffe7a0:0x9fd8ff,N?'glow':'glass');b.P(W.rbox(1.1,2.4,.16,.05),w*.33,0,d/2,0,1,1,1,0x8a5a3a,'std');b.P(W.rbox(w*.6,.2,.3,.06),-w*.12,.4,d/2+.1,0,1,1,1,0xffffff,'std');
  for(let i=0;i<Math.round(w/.7);i++){const x=-w/2+.35+i*.7;b.P(W.rbox(.7,.12,1.7,.03),x,3.05,d/2+.75,0,1,1,1,i%2?aw:0xffffff,'std',{},.38);}
  b.P(W.rbox(w,.25,.2,.05),0,2.8,d/2+1.5,0,1,1,1,aw,'std');
  const t=o.t||b.pick(['TACOS','SURF','ICE CREAM','SHADES','PIZZA','COFFEE','DONUTS','BOBA','VINTAGE','JUICE','RECORDS','POKE']);const uv=b.sign(t,b.pick(['#ffffff','#2a2a44','#fff3d6']),b.pick(['#ff4a8a','#2a9ad8','#ff7a2a','#7a4ad8']),{});
  b.signQuad(uv,0,3.75,d/2+.13,0,Math.min(w*.8,4.4),Math.min(w*.8,4.4)/4,N);if(h>5)for(let i=0;i<2;i++)b.P(W.rbox(1.2,1.2,.12,.04),(i-.5)*w*.45,h-1.6,d/2+.02,0,1,1,1,N?0xffe7a0:0x9fd8ff,N?'glow':'glass');
  b.P(W.cyl(10,1.2),w/2-.5,0,d/2+.7,0,.7,.7,.7,0xd8784a,'std');b.P(W.blob(2),w/2-.5,.95,d/2+.7,0,.9,.9,.9,0x4ab84a,'fol',{sway:.03});if(N)b.halo(0,2.8,d/2+1.4,0xffd27a,3);b.occ(0,h/2,0,w,h,d);},
 cafe(b){b.P(W.cyl(10),0,.9,0,0,1.1,.08,1.1,0xffffff,'std');b.P(W.cyl(6),0,0,0,0,.1,.9,.1,0x555a66,'std');const c=b.pick([0x3ab0a0,0xff7a5a,0xf0c040,0xff8ab8]);PROPS.umbrella(b,{c,nochair:1});
  for(const a of[0,2.1,4.2]){const x=Math.cos(a)*1.1,z=Math.sin(a)*1.1;b.P(W.rbox(.55,.08,.55,.03),x,.5,z,-a,1,1,1,0x9a6a3a,'std');b.P(W.rbox(.55,.6,.08,.03),x+Math.cos(a)*.27,.55,z+Math.sin(a)*.27,Math.PI/2-a,1,1,1,0x9a6a3a,'std');b.P(W.cyl(5),x,0,z,0,.06,.5,.06,0x555a66,'std');}
  b.P(W.cyl(8),.2,.98,.1,0,.18,.2,.18,0xffffff,'std');b.P(W.cyl(8),-.25,.98,-.1,0,.16,.16,.16,0xff7ab0,'std');},
 bench(b){for(let i=0;i<4;i++)b.P(W.rbox(2.4,.09,.16,.03),0,.55,-.3+i*.17,0,1,1,1,0xb07a4a,'std');for(let i=0;i<2;i++)b.P(W.rbox(2.4,.12,.08,.03),0,.8+i*.22,-.36,0,1,1,1,0xb07a4a,'std',{},-.2);for(const x of[-1,1]){b.P(W.rbox(.1,.55,.7,.03),x,0,-.05,0,1,1,1,0x3a3f4a,'std');b.P(W.rbox(.08,.6,.08,.02),x,.55,-.4,0,1,1,1,0x3a3f4a,'std');}},
 lamp(b,o){const col=o&&o.col||0x3a3f4a;b.P(W.cyl(8,.6),0,0,0,0,.35,.5,.35,col,'std');b.P(W.cyl(8,.7),0,.4,0,0,.16,4.2,.16,col,'std');b.P(W.tor(Math.PI,.07),0,4.6,.45,Math.PI/2,1,1,1,col,'std',{},0,0);
  b.P(W.cone(10),0,4.3,.92,0,.6,.35,.6,col,'std');b.P(W.sph(10),0,4.3,.92,0,.42,.42,.42,0xfff2b0,'glow');b.halo(0,4.25,.92,0xffe6a0,b.night?5:2.4);
  if(o&&o.banner){b.P(W.rbox(.06,1.2,.6,.02),0,3,.35,0,1,1,1,o.banner,'std');}},
 vending(b){const c=b.pick([0xff4a5a,0x3a8ad8,0xffffff,0x4ac06a]);b.P(W.rbox(1.4,2.2,1,.1),0,0,0,0,1,1,1,c,'std',{ao:.85});b.P(W.rbox(1.1,1.1,.06,.04),0,.95,.5,0,1,1,1,0xdff6ff,'glow');
  for(let i=0;i<8;i++)b.P(W.cyl(6),-.38+(i%4)*.25,1.2+(i>>2)*.45,.46,0,.14,.3,.14,b.pick(PAL.bright),'std');b.P(W.rbox(.9,.3,.06,.03),0,.3,.5,0,1,1,1,0x222233,'std');b.halo(0,1.5,.8,0xcfeeff,b.night?3.5:1.2);},
 crate(b){for(const [x,y,z,s] of[[0,0,0,1.8],[1.7,0,.2,1.5],[.6,1.8,0,1.4]]){b.P(W.rbox(s,s,s,.08),x,y,z,b.R(-.2,.2),1,1,1,0xc8945a,'std',{ao:.85});for(const yy of[.15,.85])b.P(W.rbox(s+.05,.12,s+.05,.03),x,y+s*yy,z,0,1,1,1,0x9a6a3a,'std');}
  b.P(W.sph(8),.3,3.3,0,0,.5,.5,.5,0xff4a3a,'std');b.P(W.sph(8),.8,3.25,.1,0,.45,.45,.45,0xffa23a,'std');b.occ(.6,1.3,0,3.2,2.6,2);},
 stall(b,o){const roof=b.pick([0xff5a5a,0x3a8ad8,0xffd23a,0x2fb0a0,0xff8ab8]);b.P(W.rbox(3.2,1.1,1.6,.1),0,0,0,0,1,1,1,0xd8a06a,'std',{ao:.85});b.P(W.rbox(3.4,.12,1.8,.05),0,1.1,0,0,1,1,1,0xfff3e0,'std');
  for(const x of[-1.5,1.5])b.P(W.cyl(6),x,1.1,-.6,0,.12,1.7,.12,0x9a6a3a,'std');for(let i=0;i<6;i++)b.P(W.rbox(.62,.1,2.1,.03),-1.55+i*.62,2.95,-.1,0,1,1,1,i%2?roof:0xffffff,'std',{},-.25);
  for(let i=0;i<6;i++)b.P(W.sph(8),-1.2+i*.48,1.32,.2,0,.4,.36,.4,b.pick([0xff6a3a,0xffd23a,0x7ad85a,0xff4a8a,0xffa23a]),'std');
  if(o&&o.steam||b.R(0,1)<.4){b.P(W.cyl(10),.9,1.16,-.3,0,.7,.45,.7,0x8a8a92,'std');b.halo(.9,1.9,-.3,0xffffff,1.6);}
  const t=o&&o.t||b.pick(['SNACKS','FRUIT','ジュース','たこ焼き','ICE','MANGO','NOODLES','ข้าว']);const uv=b.sign(t,'#fff8e6',b.pick(['#e8402a','#2a7ad8','#2a9a4a']),{});b.signQuad(uv,0,2.45,.85,0,2.2,.55,b.night);
  if(b.night)b.halo(0,2.4,.5,0xffd27a,2.6);},
 fountain(b){b.P(W.lathe('fnt',[[0,0],[3.1,0],[3.2,.6],[2.9,.65],[2.9,.35],[0,.35]],20),0,0,0,0,1,1,1,0xe2ddd4,'std',{ao:.85});b.P(W.cyl(20),0,.4,0,0,5.8,.1,5.8,0x6ad8f0,'glass');
  b.P(W.cyl(10,.8),0,.4,0,0,.6,1.6,.6,0xe2ddd4,'std');b.P(W.lathe('fnt2',[[0,0],[1.2,.1],[1.3,.35],[0,.3]],16),0,1.9,0,0,1,1,1,0xe2ddd4,'std');
  b.P(W.cone(12),0,2.2,0,0,1,1.4,1,0xdff8ff,'alpha');b.P(W.cone(12),0,.5,0,0,2.4,1.2,2.4,0xdff8ff,'alpha');b.halo(0,2.8,0,0xffffff,2);b.halo(.6,1,.3,0xffffff,1.2);},
 lantern(b){b.P(W.cyl(6),0,0,0,0,.12,2.7,.12,0x333333,'std');b.P(W.rbox(1,.1,.1,.03),0,2.7,0,0,1,1,1,0x333333,'std');b.P(W.sph(12),0,2.35,.4,0,.62,.85,.62,0xff5a4a,'glow');b.P(W.cyl(8),0,2.75,.4,0,.4,.08,.4,0x222222,'std');b.P(W.cyl(8),0,1.88,.4,0,.4,.08,.4,0x222222,'std');b.halo(0,2.35,.6,0xff8a6a,b.night?4:2.2);},
 toro(b){b.P(W.rbox(1,.3,1,.06),0,0,0,0,1,1,1,0x9a968e,'std');b.P(W.cyl(8),0,.3,0,0,.35,1.1,.35,0xa8a49c,'std');b.P(W.rbox(1,.75,1,.08),0,1.4,0,0,1,1,1,0xb0aca4,'std');b.P(W.rbox(.5,.4,.06,.03),0,1.55,.5,0,1,1,1,0xffe8a0,'glow');b.P(W.cone(4),0,2.15,0,Math.PI/4,1.9,.7,1.9,0x8a867e,'std');b.P(W.sph(8),0,2.85,0,0,.25,.3,.25,0x8a867e,'std');},
 picnic(b){const c=b.pick([0xff5a7a,0x5ab0ff,0xffd23a]);for(let i=0;i<4;i++)for(let k=0;k<4;k++)b.P(W.rbox(.65,.03,.65,.01),-.97+i*.65,.02,-.97+k*.65,0,1,1,1,(i+k)%2?c:0xffffff,'std');
  b.P(W.rbox(.7,.45,.5,.08),.6,.04,.4,.3,1,1,1,0xc8945a,'std');b.P(W.tor(Math.PI,.04),.6,.5,.4,.3,.6,.6,.6,0x9a6a3a,'std');b.P(W.sph(8),-.6,.18,-.4,0,.3,.3,.3,0xff3a3a,'std');b.P(W.cyl(8),-.2,.04,.3,0,.3,.06,.3,0xffffff,'std');},
 gate(b){for(const x of[-1.6,1.6])b.P(W.rbox(.3,2,.3,.06),x,0,0,0,1,1,1,0xffffff,'std');for(const y of[.9,1.7])b.P(W.rbox(3.2,.25,.12,.05),0,y,0,0,1,1,1,0x3a8ad8,'std');for(let i=0;i<6;i++)b.P(W.rbox(.08,1.1,.08,.02),-1.2+i*.48,.75,0,0,1,1,1,0x3a8ad8,'std');},
 hoop(b){b.P(W.rbox(7,.06,7,.03),0,0,2.6,0,1,1,1,0xe07a3a,'std');b.P(W.rbox(7.2,.04,.12,.01),0,.04,-.85,0,1,1,1,0xffffff,'std');b.P(W.tor(Math.PI*2,.03),0,.06,2.6,0,3,3,3,0xffffff,'std',{},Math.PI/2);
  b.P(W.cyl(8),0,0,0,0,.28,4.2,.28,0x2a5bd0,'std');b.P(W.rbox(.2,.2,1,.04),0,4,.4,0,1,1,1,0x2a5bd0,'std');b.P(W.rbox(1.9,1.2,.1,.05),0,3.5,.9,0,1,1,1,0xffffff,'std');b.P(W.rbox(.7,.5,.04,.02),0,3.6,.96,0,1,1,1,0xff6a2a,'std');
  b.P(W.tor(Math.PI*2,.06),0,3.45,1.35,0,.85,.85,.85,0xff6a2a,'std',{},Math.PI/2);b.P(W.cyl(10,1.5),0,2.9,1.35,0,.62,.55,.62,0xffffff,'alpha');},
 gym(b){for(const x of[-1.6,1.6])b.P(W.cyl(8),x,0,0,0,.18,3,.18,0x3a8ad8,'std');b.P(W.cyl(8),0,3,0,0,.09,3.2,.09,0xdddddd,'std',{},0,Math.PI/2);
  b.P(W.rbox(1.6,.15,.5,.05),0,.55,1.4,0,1,1,1,0x3a3a44,'std');for(const x of[-.5,.5])b.P(W.rbox(.1,.5,.4,.02),x,0,1.4,0,1,1,1,0x666a75,'std');b.P(W.cyl(8),0,1.3,1.1,0,.06,2.2,.06,0xcccccc,'std',{},0,Math.PI/2);
  for(const x of[-.9,.9])b.P(W.cyl(14),x,1.3,1.1,0,.7,.14,.7,0x222228,'std',{},0,Math.PI/2);b.P(W.rbox(2.4,.06,2,.02),0,0,1.2,0,1,1,1,0x5a5a66,'std');},
 bowl(b){b.P(W.lathe('bowl',[[0,-1.6],[2.5,-1.5],[4,-.8],[4.6,0],[5.4,0],[5.4,.1],[0,.1]],28),0,0,0,0,1,1,1,0xd2d2d8,'std',{});b.P(W.tor(Math.PI*2,.06),0,.02,0,0,9.2,9.2,9.2,0x8a8a92,'std',{},Math.PI/2);
  const uv=W.paintUV(256,128,(g,w,h)=>{g.fillStyle='#d2d2d8';g.fillRect(0,0,w,h);const C=['#ff4a8a','#3ac0e0','#ffd23a','#7ae05a','#b07aff'];for(let i=0;i<9;i++){g.fillStyle=C[i%5];g.beginPath();g.ellipse(Math.random()*w,Math.random()*h,20+Math.random()*30,12+Math.random()*16,Math.random()*3,0,7);g.fill();}g.font='900 46px Chewy,Arial Black';g.fillStyle='#fff';g.strokeStyle='#2a2a44';g.lineWidth=6;g.strokeText('SKATE',128-70,80);g.fillText('SKATE',128-70,80);});
  b.signQuad(uv,0,-1.1,-2.6,0,3.4,1.7,0);},
 boat(b){b.P(W.sph(16),0,.35,0,0,1.8,1.1,6,0x9a6a3a,'std',{ao:.7});b.P(W.rbox(1.5,.1,5,.05),0,.75,0,0,1,1,1,0xc8945a,'std');b.P(W.cone(8),0,.6,3,0,.4,1.6,.4,0x9a6a3a,'std',{},-1.1);
  for(let i=0;i<4;i++)b.P(W.rbox(.1,.4,.1,.02),0,1.3+i*.12,2.9+i*.14,0,1,1,1,b.pick(PAL.bright),'std');for(let i=0;i<6;i++)b.P(W.sph(8),b.R(-.5,.5),.95,b.R(-1.8,1.4),0,.35,.35,.35,b.pick([0xffd23a,0xff6a3a,0x7ad85a,0xb04ad8]),'std');
  b.P(W.cyl(6),0,.9,-2.6,0,.08,3.6,.08,0x666a70,'std',{},-1.2);b.P(W.rbox(.4,.5,.6,.08),0,1,-2.5,0,1,1,1,0x4a4a55,'std');},
 tuktuk(b){const c=b.pick([0x3ac0d0,0x2a7ad8,0xff3a7a,0x4ac06a]);b.P(W.rbox(1.6,1,2.6,.3),0,.35,0,0,1,1,1,c,'std',{ao:.8});b.P(W.rbox(1.8,.16,2.8,.08),0,2.1,0,0,1,1,1,0xffd23a,'std');
  for(const x of[-.75,.75])for(const z of[-1,1])b.P(W.rbox(.1,.8,.1,.03),x,1.3,z,0,1,1,1,0x444444,'std');b.P(W.rbox(1.3,.6,.06,.03),0,1.2,1.25,0,1,1,1,0xbfe9ff,'glass');
  for(const [x,z] of[[0,1.15],[-.75,-.9],[.75,-.9]])b.P(W.cyl(12),x,.35,z,0,.62,.22,.62,0x222222,'std',{},0,Math.PI/2);b.P(W.sph(8),0,.7,1.32,0,.2,.2,.1,0xffffcc,'glow');b.P(W.rbox(1.4,.5,.6,.1),0,.8,-.6,0,1,1,1,0xffffff,'std');},
 torch(b){b.P(W.cyl(6,.8),0,0,0,0,.16,2.6,.16,0x8a5a3a,'std');for(let i=0;i<3;i++)b.P(W.cyl(6),0,.6+i*.7,0,0,.2,.08,.2,0x5a3a20,'std');b.P(W.cyl(8,1.4),0,2.55,0,0,.3,.35,.3,0x5a3a20,'std');
  b.P(W.cone(8),0,2.85,0,0,.38,.8,.38,0xffb23a,'glow');b.P(W.cone(6),0,2.9,0,0,.2,.5,.2,0xfff2a0,'glow');b.halo(0,3.1,0,0xffa040,b.night?5:3);},
 torii(b,o){const c=o&&o.col||0xe8502a,s=o&&o.s||1;for(const x of[-3,3]){b.P(W.cyl(14,.9),x*s,0,0,0,.6*s,7.4*s,.6*s,c,'std',{ao:.8});b.P(W.cyl(14),x*s,0,0,0,.78*s,.6*s,.78*s,0x2a2a2a,'std');}
  b.P(W.rbox(8.2*s,.45*s,.5*s,.08),0,5.4*s,0,0,1,1,1,c,'std');b.P(W.rbox(.4*s,.9*s,.3*s,.05),0,5.85*s,0,0,1,1,1,c,'std');
  for(const sd of[-1,1]){b.P(W.rbox(5.4*s,.55*s,.75*s,.1),sd*2.55*s,6.55*s,0,0,1,1,1,c,'std',{},0,sd*.05);b.P(W.rbox(5.6*s,.32*s,.9*s,.1),sd*2.6*s,7.05*s,0,0,1,1,1,o&&o.cap||0x2a2a2a,'std',{},0,sd*.08);}},
 screen(b){b.P(W.rbox(.5,6,.5,.1),0,0,0,0,1,1,1,0x2a2a3a,'std');b.P(W.rbox(5.6,3.4,.4,.15),0,5,0,0,1,1,1,0x1a1a2a,'std');const v0=b.R(0,8)|0;b.P(W.quad(),0,6.7,.22,0,5,3,1,0xffffff,'scr',{uv:[0,v0/8,1,(v0+1)/8]});b.halo(0,6.7,1,0xc8a0ff,6);},
 crosswalk(b){for(let i=0;i<9;i++)b.P(W.rbox(1,.03,6.5,.01),(i-4)*1.7,.05,0,0,1,1,1,0xf6f6f6,'std');},
 pole(b){b.P(W.cyl(8,.75),0,0,0,0,.36,9,.36,0x9a968e,'std');for(const y of[7.6,8.4])b.P(W.rbox(2.2,.12,.12,.03),0,y,0,0,1,1,1,0x6a665e,'std');b.P(W.cyl(10),.55,6.2,0,0,.6,1,.6,0x8a8a92,'std');},
 tiki(b){const h=b.R(2.2,3);b.P(W.cyl(10,.9),0,0,0,0,1,h,1,0x8a5a32,'std',{ao:.75});b.P(W.rbox(.8,.3,.15,.05),0,h*.72,.45,0,1,1,1,0xffffff,'std');b.P(W.rbox(.7,.25,.15,.05),0,h*.45,.45,0,1,1,1,0x3a2010,'std');
  for(const x of[-.2,.2])b.P(W.sph(8),x,h*.75,.48,0,.18,.18,.08,0x2a1a0a,'std');b.P(W.cone(10),0,h,0,0,1.2,.6,1.2,0x6aa040,'std');},
 house(b,o){const w=b.R(6,8),h=b.R(5.5,7),d=6;const col=b.pick([0xf4ede0,0xe8e2d6,0xdfe8ee,0xf2e2d0,0xe6efe2]);b.P(W.rbox(w,h,d,.15),0,0,0,0,1,1,1,col,'std',{ao:.82});
  b.P(W.prism(),0,h,0,0,w+1,2.2,d+1,b.pick([0x5a6a7a,0x8a4a3a,0x4a5a4a,0x3a4a6a]),'std');for(let f=0;f<2;f++)for(let c=0;c<2;c++)b.P(W.rbox(1.3,1.1,.1,.04),(c-.5)*w*.5,1.2+f*2.6,d/2+.03,0,1,1,1,0x9ad7ef,'glass');
  b.P(W.rbox(w*.6,.15,1.1,.04),0,3.2,d/2+.55,0,1,1,1,0xdddddd,'std');for(let i=0;i<6;i++)b.P(W.rbox(.06,.8,.06,.02),-w*.28+i*w*.112,3.3,d/2+1.05,0,1,1,1,0x999999,'std');
  b.P(W.rbox(1,2,.12,.04),w*.3,0,d/2+.04,0,1,1,1,0x7a5a3a,'std');b.P(W.rbox(w+.4,1,.3,.06),0,0,d/2+1.6,0,1,1,1,0xd8d2c4,'std');for(let i=0;i<3;i++)b.P(W.blob(i),-w*.3+i*.9,1.1,d/2+1.4,0,.9,.7,.6,0x4ab84a,'fol',{sway:.02});b.occ(0,h/2,0,w,h,d);},
};
// prop-specific occluder skips (spawn props that hide actors should not block photos)
const PROP_S={palm:1,tree:1,sakura:1,ginkgo:1,cedar:1,building:1,shop:1,house:1};
