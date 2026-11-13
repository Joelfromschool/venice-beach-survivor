'use strict';
// Landmark-inspired, original set pieces for each course.
const SK={
 at(W,t,s,d,c){return W.place(c||W.cv.A,t,s,d);},
 // try to place something of radius r around (t,s,d), pushing outward until it fits
 fit(W,t,s,d,r,fn,o){o=o||{};const c=o.c||W.cv.A;for(let k=0;k<(o.tries||5);k++){const p=W.place(c,t,s,d+k*(o.step||4));if(W.ok(p,r,o)){W.take(p,r);const to=W.place(c,t,0,0);fn(p,o.ry!=null?o.ry:W.face(p,to));return p;}}return null;},
 row(W,t0,t1,st,s,d,r,fn,o){for(let t=t0;t<t1;t+=st)SK.fit(W,t,s,d,r,fn,o);},
 group(W){const g=new THREE.Group();W.scene.add(g);return g;},
 local(W,g,fn){const mb=new MB();const b=PB(W,mb,0,0,0,0,1);b.halo=()=>{};b.occ=()=>{};b.crowd=()=>{};fn(b);mb.build(g,W.MATS);return g;},
 crowdRing(W,p,n,r,face){for(let i=0;i<n;i++){const a=W.R(0,6.28),rr=W.R(r*.4,r);const x=p.x+Math.cos(a)*rr,z=p.z+Math.sin(a)*rr;const q=new V3(x,0,z);if(W.pathDist(x,z)<6)continue;if(W.co.water&&W.waterD(x,z)>-1)continue;let ok=true;for(const sp of W.spawnPts)if(sp.distanceTo(q)<3.5)ok=false;if(!ok)continue;W.crowdAt(x,z,face!=null?face:W.R(0,6.28));}},
 arch(W,mb,t,text,o){o=o||{};const p=W.place(W.cv.A,t,0,0);const ry=W.yawAt(W.cv.A,t);const b=PB(W,mb,p.x,0,p.z,ry+Math.PI/2);const w=o.w||6.2,h=o.h||7.5,c=o.col||0x2a5bd0;
  for(const z of[-w,w]){b.P(W.rbox(.7,h,.7,.15),0,0,z,0,1,1,1,c,'std',{ao:.8});b.P(W.sph(10),0,h+.3,z,0,.9,.9,.9,o.ball||0xffd23a,'std');}
  b.P(W.rbox(.6,1.8,w*2-.4,.2),0,h-1.9,0,0,1,1,1,o.board||0xffffff,'std');const uv=W.signUV(text,o.bg||'#ffffff',o.fg||'#2a5bd0',{w:512,h:96,edge:o.edge});
  for(const sd of[1,-1])W.put(mb,b.base,W.quad(),sd*.32,h-1,0,sd*Math.PI/2,w*2-1,1.6,1,0xffffff,o.glow?'signB':'sign',{uv});
  for(let i=0;i<10;i++){const z=-w+1+i*(w*2-2)/9;b.P(W.sph(6),0,h-.08,z,0,.22,.22,.22,0xfff2b0,'glow');b.halo(0,h-.1,z,0xffe6a0,1.4);}
  W.occBox&&0;return b;},
 waterTex(W){const t=W.canvasTex(64,256,(g,w,h)=>{g.fillStyle='#cfefff';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.fillStyle=`rgba(255,255,255,${.4+Math.random()*.6})`;g.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*4,20+Math.random()*60);}for(let i=0;i<30;i++){g.fillStyle='rgba(120,190,230,.35)';g.fillRect(Math.random()*w,Math.random()*h,3,30+Math.random()*50);}});t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;},
 train(W,len,cols){const g=SK.group(W);SK.local(W,g,b=>{for(let i=0;i<len;i++){const z=i*8.6;b.P(W.rbox(3,3.1,8.2,.6),0,.3,z,0,1,1,1,cols[0],'std');b.P(W.rbox(3.05,.45,8.25,.1),0,1.2,z,0,1,1,1,cols[1],'std');
   for(let k=0;k<4;k++)for(const x of[-1.52,1.52])b.P(W.rbox(.06,.9,1.3,.05),x,1.9,z-2.8+k*1.85,0,1,1,1,W.VIS.night?0xffe7a0:0x9fd8ff,W.VIS.night?'glow':'glass');}});return g;},
};
const SETS={
 venice(W,mb,co,cv){
  SK.arch(W,mb,.07,'VENICE',{col:0x2a3a5a,fg:'#2a3a5a',ball:0xff5aa0,w:6.6,h:8});
  // ocean-side lifeguard towers and beach life
  for(const z of[38,120,200]){const x=-(W.shoreX(z)-9);const p=new V3(x,0,z);if(W.ok(p,2.4,{pd:6})){W.take(p,2.6);W.prop('lifeguard',p,Math.PI/2+.3);}}
  // skate bowl + muscle beach pen
  SK.fit(W,.3,1,21,6.5,(p,ry)=>{W.prop('bowl',p,ry);SK.crowdRing(W,p,7,8);});
  SK.fit(W,.56,1,19,5,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(10,.3,8,.1),0,0,0,0,1,1,1,0xe8d7b0,'std');for(let i=0;i<9;i++)for(const sd of[-1,1])b.P(W.rbox(.08,1.1,.08,.02),sd*5,.3,-4+i,0,1,1,1,0xffffff,'std');
   const uv=W.signUV('MUSCLE BEACH','#ffd23a','#2a3a5a',{w:512,h:96});b.P(W.rbox(4.6,1,.15,.05),0,2.4,-4,0,1,1,1,0x2a3a5a,'std');b.signQuad(uv,0,2.9,-3.9,0,4.4,.82,0);for(const x of[-2,2])b.P(W.cyl(6),x,0,-4,0,.15,2.4,.15,0x2a3a5a,'std');
   W.prop('gym',b.wp(-2.5,0,1),ry);W.prop('gym',b.wp(2.5,0,-1),ry+.3);SK.crowdRing(W,p,6,4);});
  // boardwalk shop row (inland side)
  SK.row(W,-.08,1.16,.04,1,25,3.6,(p,ry)=>{W.prop(W.rnd()<.75?'shop':'building',p,ry);if(W.rnd()<.6)SK.crowdRing(W,W.place(cv.A,0,0,0).set(p.x,0,p.z).add(new V3(Math.sin(ry)*4.5,0,Math.cos(ry)*4.5)),3,2.5);},{pd:12});
  SK.row(W,0,1.12,.06,-1,15,1.5,(p,ry)=>{W.prop('palm',p,ry);},{pd:7});
  for(let i=0;i<30;i++){const t=W.R(0,1.1);const p=W.place(cv.A,t,-1,W.R(8,17));if(W.ok(p,.6,{pd:5}))W.crowdAt(p.x,p.z,W.R(0,6));}},
 abbot(W,mb,co,cv){
  const C=['#ff6aa8','#ffb03a','#3ac0e0','#8a6aff'];
  for(const s of[-1,1])SK.row(W,-.1,1.16,.034,s,14.5,3.2,(p,ry)=>{if(W.rnd()<.14){// mural wall
     const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(7,6,1.2,.15),0,0,-.5,0,1,1,1,0xf4ede0,'std',{ao:.85});const uv=W.paintUV(256,224,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#ffe0f0');gr.addColorStop(1,'#d8f4ff');g.fillStyle=gr;g.fillRect(0,0,w,h);
      for(const sd of[-1,1])for(let i=0;i<7;i++){g.fillStyle=C[i%4];g.beginPath();g.ellipse(w/2+sd*(30+i*10),h*.45-i*6,48-i*4,14,sd*(.9-i*.12),0,7);g.fill();}g.fillStyle='#fff';g.beginPath();g.arc(w/2,h*.5,18,0,7);g.fill();g.font='900 30px Chewy,Arial Black';g.fillStyle='#2a2a44';g.textAlign='center';g.fillText('FLY HIGH',w/2,h-18);});
     b.signQuad(uv,0,3,.12,0,6.4,5.6,0);b.occ(0,3,-.5,7,6,1.2);}else W.prop('shop',p,ry,1);
    if(W.rnd()<.5)SK.crowdRing(W,p.clone().add(new V3(Math.sin(ry)*5,0,Math.cos(ry)*5)),2,2);},{pd:11});
  // string lights over the street
  for(let t=.05;t<1.1;t+=.09){const a=W.place(cv.A,t,1,11),b2=W.place(cv.A,t,-1,11);const I=new THREE.Matrix4();for(const q of[a,b2])W.put(mb,I,W.cyl(6),q.x,0,q.z,0,.14,6.5,.14,0x3a3a44,'std');
   for(let i=0;i<=14;i++){const k=i/14;const x=a.x+(b2.x-a.x)*k,z=a.z+(b2.z-a.z)*k,y=6.3-Math.sin(k*Math.PI)*1.1;W.put(mb,I,W.sph(6),x,y,z,0,.2,.26,.2,[0xffe08a,0xff8ac0,0x8ae0ff][i%3],'glow');W.halo(x,y,z,[0xffd27a,0xff8ac0,0x8ae0ff][i%3],.45);}}},
 santamonica(W,mb,co,cv){
  SK.row(W,0,1.14,.05,1,17,1.6,(p,ry)=>W.prop('palm',p,ry),{pd:7});SK.row(W,-.05,1.16,.06,1,30,3.6,(p,ry)=>W.prop(W.rnd()<.5?'shop':'building',p,ry),{pd:14});
  // the pier (ocean side)
  const t=.42;const p0=W.place(cv.A,t,-1,7);const dir=new V3(-1,0,0);const L=120,Wd=16;const bx=p0.x-4,bz=p0.z;const b=PB(W,mb,bx,0,bz,-Math.PI/2);
  for(let z=0;z<30;z+=6)W.take(b.wp(0,0,z),Wd/2);b.P(W.rbox(Wd,.5,L,.1),0,2.4,L/2,0,1,1,1,0xc8a27a,'std',{ao:.9});for(let z=2;z<L;z+=6)for(const x of[-Wd/2+.6,0,Wd/2-.6])b.P(W.cyl(8),x,-3,z,0,.55,5.5,.55,0x7a5a3a,'std');
  for(const x of[-Wd/2+.2,Wd/2-.2]){b.P(W.rbox(.15,.12,L,.03),x,3.7,L/2,0,1,1,1,0xffffff,'std');for(let z=1;z<L;z+=2.5)b.P(W.rbox(.12,1,.12,.02),x,2.8,z,0,1,1,1,0xffffff,'std');}
  b.P(W.rbox(Wd,2.4,1,.1),0,0,0,0,1,1,1,0xc8a27a,'std');
  // entrance arch
  for(const x of[-6,6])b.P(W.rbox(.6,7,.6,.12),x,2.6,3,0,1,1,1,0x2a6ad8,'std');const uv=W.signUV('SANTA MONICA PIER','#2a6ad8','#ffffff',{w:512,h:96,edge:'#ffd23a'});b.P(W.rbox(12.6,1.6,.3,.2),0,8,3,0,1,1,1,0x2a6ad8,'std');b.signQuad(uv,0,8.8,2.8,Math.PI,12,1.5,1);b.signQuad(uv,0,8.8,3.2,0,12,1.5,1);
  for(let i=0;i<10;i++){b.halo(-5.4+i*1.2,9.8,3,0xffe6a0,1.3);}
  for(let z=14;z<L-10;z+=12){for(const x of[-Wd/2+1,Wd/2-1])PROPS.lamp(PB(W,mb,...b.wp(x,2.65,z).toArray().map((v,i)=>v),x>0?-Math.PI/2:Math.PI/2));}
  for(const z of[22,34])PROPS.stall(PB(W,mb,...b.wp(-4,2.65,z).toArray(),-Math.PI/2+Math.PI/2),{t:z===22?'CORN DOGS':'LEMONADE'});
  // Ferris wheel (spins)
  const wc=b.wp(2,2.65,58);const wheel=SK.group(W);wheel.position.set(wc.x,wc.y+13,wc.z);wheel.rotation.y=0;const R=11;
  SK.local(W,wheel,lb=>{for(let i=0;i<16;i++){const a=i/16*Math.PI*2;lb.P(W.cyl(6),0,0,0,0,.18,R,.18,i%2?0xffd23a:0xffffff,'std',{},0,a);}lb.P(W.tor(Math.PI*2,.025),0,0,0,0,R*2,R*2,R*2,0xff5a8a,'std');lb.P(W.tor(Math.PI*2,.03),0,0,0,0,R*1.3,R*1.3,R*1.3,0x3ac0e0,'std');
   lb.P(W.cyl(10),0,0,-.6,0,1.2,1.2,1.2,0xffffff,'std',{},Math.PI/2);for(let i=0;i<24;i++){const a=i/24*Math.PI*2;lb.P(W.sph(6),0,Math.cos(a)*R,Math.sin(a)*R,0,.4,.4,.4,[0xff5a8a,0xffd23a,0x3ac0e0][i%3],'glow');}});
  wheel.rotation.order='YXZ';wheel.rotation.y=Math.PI/2;W.take(new V3(wc.x,0,wc.z),12);
  SK.local(W,SK.group(W),lb=>{for(const sd of[-1,1])for(const xx of[-1.3,1.3])lb.P(W.cyl(8),wc.x+xx,wc.y,wc.z+sd*3.4,0,.45,14.4,.45,0xffffff,'std',{},-sd*.23,0);});
  const gon=new THREE.InstancedMesh(W.rbox(1.6,1.5,1.4,.35),W.MATS.std,12);const gcol=[0xff5a8a,0xffd23a,0x3ac0e0,0x7ad85a,0xb07aff,0xff8a3a];const geo=gon.geometry.clone();const cc=[];for(let i=0;i<geo.attributes.position.count;i++)cc.push(1,1,1);geo.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));gon.geometry=geo;
  for(let i=0;i<12;i++)gon.setColorAt(i,new THREE.Color(gcol[i%6]));W.scene.add(gon);gon.frustumCulled=false;
  W.anims.push((dt,t)=>{const a0=t*.12;wheel.children.forEach(m=>{});wheel.rotation.z=a0;for(let i=0;i<12;i++){const a=a0+i/12*Math.PI*2;gon.setMatrixAt(i,MX(wc.x,wc.y+13+Math.cos(a)*R-1.6,wc.z+Math.sin(a)*R,0,1,1,1));}gon.instanceMatrix.needsUpdate=true;});
  W.halo(wc.x,wc.y+13,wc.z,0xffc0e0,10);
  // roller coaster loop
  const cc2=b.wp(-3,2.65,86);const curve=new THREE.CatmullRomCurve3([[-10,0,0],[-4,6,0],[2,10,-2],[6,6,-4],[2,2,-6],[-4,8,-8],[-10,4,-6],[-14,2,-2]].map(a=>new V3(cc2.x+a[2],cc2.y+1+a[1],cc2.z+a[0])),true);
  W.mb.add(new THREE.TubeGeometry(curve,90,.32,6,true),new THREE.Matrix4(),0xff4a5a,'std');for(let i=0;i<14;i++){const q=curve.getPointAt(i/14);W.put(mb,new THREE.Matrix4(),W.cyl(6),q.x,cc2.y,q.z,0,.3,Math.max(.5,q.y-cc2.y),.3,0xffffff,'std');}
  for(let i=0;i<40;i++){const z=W.R(8,L-8),x=W.R(-Wd/2+1.5,Wd/2-1.5);const q=b.wp(x,0,z);W.crowdAt(q.x,q.z,W.R(0,6),{y:2.65});}
  for(let i=0;i<24;i++){const t2=W.R(0,1.1);const q=W.place(cv.A,t2,-1,W.R(8,16));if(W.ok(q,.6,{pd:5}))W.crowdAt(q.x,q.z,W.R(0,6));}},
 ucla(W,mb,co,cv){
  const brick=0xb5563a,trim=0xf0e2c8;
  const hall=(p,ry,big)=>{const b=PB(W,mb,p.x,0,p.z,ry);const w=big?26:18,h=big?11:9,d=10;b.P(W.rbox(w,h,d,.2),0,0,0,0,1,1,1,brick,'std',{ao:.8,jit:.06});b.P(W.rbox(w+.6,.6,d+.6,.15),0,h,0,0,1,1,1,trim,'std');
   for(let f=0;f<2;f++)for(let c=0;c<Math.floor(w/3);c++){const x=-w/2+1.6+c*3;b.P(W.rbox(1.4,2.2,.12,.6),x,2+f*4,d/2+.03,0,1,1,1,0x9ad7ef,'glass');b.P(W.rbox(1.8,.25,.3,.05),x,1.8+f*4,d/2+.05,0,1,1,1,trim,'std');}
   if(big){for(const sd of[-1,1]){b.P(W.rbox(5,22,5,.25),sd*7,0,d/2-2,0,1,1,1,brick,'std',{ao:.8});b.P(W.rbox(5.6,.5,5.6,.1),sd*7,22,d/2-2,0,1,1,1,trim,'std');for(let k=0;k<3;k++)b.P(W.rbox(1.2,2.6,.1,.6),sd*7,12+k*3.2,d/2+.53,0,1,1,1,0x2a3a5a,'glass');
     b.P(W.cyl(8,.6),sd*7,22.5,d/2-2,Math.PI/8,4.6,4,4.6,0xc8a070,'std');b.P(W.cone(8),sd*7,26.4,d/2-2,Math.PI/8,3.6,3.4,3.6,0xb5563a,'std');}
    for(let i=0;i<3;i++){b.P(W.rbox(2.2,4.6,.4,1),-3+i*3,0,d/2+.2,0,1,1,1,0x5a3a2a,'std');b.P(W.tor(Math.PI,.15),-3+i*3,4.4,d/2+.35,0,2.3,2.3,2.3,trim,'std');}
    const uv=W.signUV('ROYAL HALL','#f0e2c8','#7a3a2a',{w:512,h:96});b.signQuad(uv,0,8.6,d/2+.06,0,7,1.3,0);}
   b.P(W.prism(),0,h+.5,0,Math.PI/2,d+.4,3,w,0xc0603a,'std');b.occ(0,h/2,0,w,h,d);};
  SK.fit(W,.12,1,30,11,(p,ry)=>hall(p,ry,0),{pd:20});SK.fit(W,.36,1,30,13,(p,ry)=>hall(p,ry,1),{pd:20,tries:6});
  SK.fit(W,.62,-1,30,11,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(20,9,12,.2),0,0,0,0,1,1,1,brick,'std',{ao:.8});b.P(W.cyl(8),0,9,0,Math.PI/8,9,6,9,brick,'std',{ao:.85});b.P(W.cyl(8),0,15,0,Math.PI/8,7.4,1,7.4,trim,'std');b.P(W.hemi(16),0,16,0,0,7,7,7,0xc89a5a,'std');b.P(W.cyl(8),0,19.4,0,0,.9,2.4,.9,trim,'std');
   for(let k=0;k<8;k++){const a=k/8*Math.PI*2+Math.PI/8;b.P(W.rbox(1.2,3.2,.1,.6),Math.sin(a)*4.55,10.2,Math.cos(a)*4.55,a,1,1,1,0x2a3a5a,'glass');}
   for(let c=0;c<5;c++)b.P(W.rbox(1.6,2.8,.12,.8),-7+c*3.5,2.5,6.03,0,1,1,1,0x9ad7ef,'glass');const uv=W.signUV('BOOK HALL','#f0e2c8','#7a3a2a',{w:512,h:96});b.signQuad(uv,0,7.2,6.08,0,6,1.1,0);b.P(W.prism(),0,9,0,Math.PI/2,12.4,2,20.4,0xc0603a,'std');b.occ(0,8,0,20,16,12);});
  for(const s of[-1,1])SK.row(W,-.08,1.16,.09,s,40,8,(p,ry)=>hall(p,ry,0),{pd:30});
  SK.fit(W,.18,-1,16,4,(p,ry)=>{W.prop('fountain',p,ry,1.2);SK.crowdRing(W,p,8,7);});
  SK.row(W,0,1.1,.05,1,8.5,1.3,(p,ry)=>W.prop('lamp',p,ry),{});
  for(let i=0;i<40;i++){const t=W.R(-.05,1.1),s=W.rnd()<.5?1:-1;const p=W.place(cv.A,t,s,W.R(8,22));if(W.ok(p,.6,{pd:5}))W.crowdAt(p.x,p.z,W.R(0,6));}},
 shibuya(W,mb,co,cv){
  for(const t of[.25,.55,.82]){const p=W.place(cv.A,t,0,0);const ry=W.yawAt(cv.A,t);W.prop('crosswalk',p.clone().add(new V3(Math.sin(ry)*7,0,Math.cos(ry)*7)),ry);W.prop('crosswalk',p.clone().add(new V3(-Math.sin(ry)*7,0,-Math.cos(ry)*7)),ry);
   const b=PB(W,mb,p.x,0,p.z,ry);for(const sd of[-1,1]){b.P(W.rbox(9,.04,1.1,.01),sd*4,.05,0,Math.PI/4*sd,1,1,1,0xf6f6f6,'std');}
   SK.crowdRing(W,p.clone().add(new V3(Math.cos(ry)*9,0,-Math.sin(ry)*9)),5,4);SK.crowdRing(W,p.clone().add(new V3(-Math.cos(ry)*9,0,Math.sin(ry)*9)),5,4);}
  for(const s of[-1,1])SK.row(W,-.1,1.18,.04,s,17,4,(p,ry)=>{W.prop('building',p,ry,1);},{pd:12});
  for(const s of[-1,1])SK.row(W,-.1,1.18,.06,s,30,5,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);PROPS.building(b,{h:W.R(20,34),w:W.R(9,13),d:W.R(8,10),flat:1});if(W.rnd()<.7){const v0=W.R(0,8)|0;const hh=W.R(10,16);b.P(W.rbox(9,5.4,.5,.2),0,hh,5.2,0,1,1,1,0x1a1a2a,'std');b.P(W.quad(),0,hh+2.7,5.5,0,8.4,4.8,1,0xffffff,'scr',{uv:[0,v0/8,1,(v0+1)/8]});b.halo(0,hh+2.7,6.5,0xd0a0ff,10);}},{pd:22});
  // round tower
  SK.fit(W,.5,-1,24,7,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.cyl(24),0,0,0,0,12,30,12,0xd8dce6,'std',{ao:.8});b.P(W.cyl(24),0,30,0,0,12.6,.8,12.6,0xffffff,'std');for(let k=0;k<6;k++)b.P(W.cyl(24),0,4+k*4.4,0,0,12.15,1.2,12.15,0x8ad0ff,'glass');
   const uv=W.signUV('PINCO 108','#140c2a','#ff4ad8',{neon:1,w:96,h:384});b.signQuad(uv,0,17,6.2,0,2.6,12,1);b.halo(0,17,7,0xff4ad8,12);b.occ(0,15,0,11,30,11);},{pd:16});
  // elevated rail over the street with a passing train
  const tt=.68;const pc=W.place(cv.A,tt,0,0);const ry=W.yawAt(cv.A,tt);const bb=PB(W,mb,pc.x,0,pc.z,ry);bb.P(W.rbox(90,1.4,6,.2),0,8,0,0,1,1,1,0x8a8aa0,'std');bb.P(W.rbox(90,.8,.3,.1),0,9.4,2.9,0,1,1,1,0xb0b0c0,'std');bb.P(W.rbox(90,.8,.3,.1),0,9.4,-2.9,0,1,1,1,0xb0b0c0,'std');
  for(const x of[-40,-26,-12,12,26,40])bb.P(W.rbox(1.6,8,3,.2),x,0,0,0,1,1,1,0x7a7a90,'std');const uv=W.signUV('スナップ線 SNAP LINE','#140c2a','#4af0ff',{neon:1,w:512,h:64});bb.signQuad(uv,0,8.7,3.05,0,10,1.25,1);bb.signQuad(uv,0,8.7,-3.05,Math.PI,10,1.25,1);
  for(let x=-40;x<=40;x+=8)bb.halo(x,7.2,0,0xc8b0ff,2.5);
  const tr=SK.train(W,5,[0xe8eef6,0x3ac08a]);tr.rotation.y=ry+Math.PI/2;W.anims.push((dt,t)=>{const k=((t*.09)%1.6)-.8;const v=new V3(Math.cos(ry),0,-Math.sin(ry));tr.position.set(pc.x+v.x*k*120,9.3,pc.z+v.z*k*120);});
  // neon light pools on the street
  for(let i=0;i<70;i++){const t=W.R(-.05,1.1),s=W.rnd()<.5?1:-1;const p=W.place(cv.A,t,s,W.R(5.5,12));if(W.ok(p,.5,{pd:5}))W.crowdAt(p.x,p.z,W.R(0,6));}},
 tokyo(W,mb,co,cv){
  // lattice tower in the distance
  const tp=W.place(cv.A,.62,-1,75);const b=PB(W,mb,tp.x,W.H(tp.x,tp.z),tp.z,0);const H=70;
  for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;b.P(W.cyl(6,.4),Math.cos(a)*9,0,Math.sin(a)*9,0,1.4,H*.63,1.4,i%2?0xff5a2a:0xffffff,'std',{},-Math.sin(a)*.16,Math.cos(a)*.16);}
  for(let k=0;k<9;k++){const y=k*H*.07,w=2*(6.36-.114*y);const c=k%2?0xffffff:0xff5a2a;for(let i=0;i<4;i++){const a=i*Math.PI/2;b.P(W.box(),Math.cos(a)*w/2,y,Math.sin(a)*w/2,a+Math.PI/2,w,.5,.5,c,'std');}}
  b.P(W.cyl(12),0,H*.45,0,0,6,2.2,6,0xffffff,'std');b.P(W.cyl(12),0,H*.45+.6,0,0,6.2,1,6.2,0x8ad0ff,'glass');b.P(W.cyl(8,.4),0,H*.47,0,0,1.6,H*.45,1.6,0xff5a2a,'std');b.P(W.cyl(10),0,H*.75,0,0,3,1.4,3,0xffffff,'std');b.P(W.cyl(6,.2),0,H*.78,0,0,.6,H*.25,.6,0xffffff,'std');b.halo(0,H*1.02,0,0xff6a5a,3);
  // big lantern gate over the path
  const gp=W.place(cv.A,.12,0,0);const gry=W.yawAt(cv.A,.12);const g=PB(W,mb,gp.x,0,gp.z,gry+Math.PI/2);
  for(const z of[-5.6,5.6])for(const x of[-1.6,1.6])g.P(W.cyl(12),x,0,z,0,.75,6.4,.75,0xd8322a,'std',{ao:.8});for(const z of[-5.6,5.6])g.P(W.rbox(4.2,5,3,.15),0,0,z*1.18,0,1,1,1,0xd8322a,'std',{ao:.8});
  g.P(W.rbox(4.6,.8,16,.2),0,6.3,0,0,1,1,1,0xd8322a,'std');g.P(W.prism(),0,7.1,0,0,6.4,2.4,18,0x3a3a40,'std');g.P(W.rbox(6.8,.3,18.4,.1),0,7,0,0,1,1,1,0x2a2a30,'std');
  g.P(W.sph(16),0,4.8,0,0,2.6,3.2,2.6,0xe8322a,'glow');g.P(W.cyl(12),0,6.2,0,0,1.8,.35,1.8,0x2a2a2a,'std');g.P(W.cyl(12),0,3.15,0,0,1.8,.35,1.8,0x2a2a2a,'std');
  const uv=W.signUV('ピンコ門','#e8322a','#1a1a1a',{w:256,h:128,edge:'#e8322a'});g.signQuad(uv,1.32,4.8,0,Math.PI/2,1.8,.9,1);g.signQuad(uv,-1.32,4.8,0,-Math.PI/2,1.8,.9,1);
  // five-storey pagoda
  SK.fit(W,.42,1,26,6,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(9,1.2,9,.1),0,0,0,0,1,1,1,0xd8d2c4,'std');for(let k=0;k<5;k++){const s=6.4-k*.8,y=1.2+k*3.4;b.P(W.rbox(s*.62,2.4,s*.62,.1),0,y,0,0,1,1,1,0xd8322a,'std',{ao:.85});b.P(W.cone(4),0,y+2.2,0,Math.PI/4,s*1.5,1.3,s*1.5,0x3a3a40,'std');}
   b.P(W.cyl(8),0,18.2,0,0,.3,6,.3,0xd8a03a,'std');for(let k=0;k<6;k++)b.P(W.tor(Math.PI*2,.08),0,19+k*.75,0,0,.9,.9,.9,0xd8a03a,'std',{},Math.PI/2);b.occ(0,9,0,5,18,5);},{pd:16});
  for(const s of[-1,1])SK.row(W,-.1,1.16,.07,s,34,6,(p,ry)=>W.prop('building',p,ry,1),{pd:26});
  SK.row(W,.0,1.12,.08,-1,9,1,(p,ry)=>W.prop('lantern',p,ry),{});
  for(let i=0;i<40;i++){const t=W.R(-.05,1.1),s=W.rnd()<.5?1:-1;const p=W.place(cv.A,t,s,W.R(6,14));if(W.ok(p,.5,{pd:5}))W.crowdAt(p.x,p.z,W.R(0,6));}},
 yoyogi(W,mb,co,cv){
  for(const t of[.03,.52]){const p=W.place(cv.A,t,0,0);const b=PB(W,mb,p.x,0,p.z,W.yawAt(cv.A,t));W.take(p.clone().add(new V3(4,0,0)),1.5);PROPS.torii(b,{col:0x9a7452,cap:0x5a4632,s:1.35});}
  // sake barrel wall (original colourful labels)
  SK.fit(W,.3,-1,13,6,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(12,.6,3,.1),0,0,0,0,1,1,1,0x7a6a5a,'std');
   for(let r=0;r<3;r++)for(let c=0;c<8;c++){const x=-5.25+c*1.5,y=1.3+r*1.42;b.P(W.cyl(14),x,y,-.45,0,1.38,1.45,1.38,0xf6f2e8,'std',{},Math.PI/2);for(const zz of[-.2,.75])b.P(W.cyl(14),x,y,zz,0,1.42,.12,1.42,0x2a3a6a,'std',{},Math.PI/2);
    const uv=W.signUV(['祭','福','花','春','空','星','光','音'][(r*3+c)%8],W.pick(['#ffffff','#fff3d6']),W.pick(['#d8322a','#2a5bd0','#2a9a4a','#1a1a1a']),{w:64,h:64,edge:'#d8a03a'});b.signQuad(uv,x,y,1.03,0,.95,.95,0);}
   b.P(W.rbox(12.4,.4,3.4,.1),0,5.6,0,0,1,1,1,0x5a4632,'std');b.P(W.prism(),0,6,0,Math.PI/2,3.6,1.2,12.6,0x4a3a2a,'std');b.occ(0,3,0,12,6,3);SK.crowdRing(W,p.clone().add(new V3(Math.sin(ry)*5,0,Math.cos(ry)*5)),6,3);});
  for(const s of[-1,1])SK.row(W,-.1,1.16,.03,s,22,3,(p,ry)=>W.prop('cedar',p,ry),{pd:14});
  for(let i=0;i<10;i++){const z=W.R(20,240);const x=W.shoreX(z)-W.R(1,4);const p=new V3(x,0,z);if(W.ok(p,1.2,{wm:-2,pd:5}))W.prop('rock',p,W.R(0,6));}
  for(let i=0;i<34;i++){const t=W.R(-.05,1.1),s=W.rnd()<.5?1:-1;const p=W.place(cv.A,t,s,W.R(7,16));if(W.ok(p,.6,{pd:5}))W.crowdAt(p.x,p.z,W.R(0,6),{s:W.rnd()<.3?.7:1});}},
 uehara(W,mb,co,cv){
  // utility poles + wires
  let last=null;for(let t=-.05;t<1.15;t+=.05){const p=W.place(cv.A,t,1,6.2);W.prop('pole',p,W.yawAt(cv.A,t));if(last){const I=new THREE.Matrix4();for(const y of[7.6,8.4]){const a=last.clone().setY(y),c=p.clone().setY(y);const L=a.distanceTo(c);W.put(mb,I,W.cyl(4),a.x,y,a.z,Math.atan2(c.x-a.x,c.z-a.z),.05,L,.05,0x333333,'std',{},Math.PI/2);}}last=p;}
  // domed landmark
  SK.fit(W,.36,1,34,10,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(16,8,16,.3),0,0,0,0,1,1,1,0xf6f2ea,'std',{ao:.85});for(let k=0;k<4;k++)b.P(W.hemi(16),Math.cos(k*Math.PI/2)*5.5,8,Math.sin(k*Math.PI/2)*5.5,0,4,4,4,0xe8eef6,'std');
   b.P(W.cyl(16),0,8,0,0,9,2.4,9,0xf6f2ea,'std');b.P(W.hemi(20),0,10.4,0,0,10,10,10,0xdfe8f3,'std');b.P(W.cyl(8),0,15.2,0,0,.3,2,.3,0xd8a03a,'std');b.P(W.cyl(12,.8),9.5,0,6,0,1.4,24,1.4,0xf6f2ea,'std');b.P(W.cyl(12),9.5,18,6,0,2,.6,2,0xffffff,'std');b.P(W.cone(12),9.5,24,6,0,1.2,4,1.2,0xdfe8f3,'std');
   for(let c=0;c<5;c++)b.P(W.rbox(1.2,3,.12,.6),-5+c*2.5,2,8.03,0,1,1,1,0x6ab0d8,'glass');b.occ(0,6,0,16,12,16);},{pd:24});
  // station + elevated line with a train
  const t0=.62,t1=1.05;const pts=[];for(let t=t0;t<=t1;t+=.02)pts.push(W.place(cv.A,t,-1,24));
  pts.forEach((p,i)=>{W.take(p,4);if(i%2===0){const b=PB(W,mb,p.x,0,p.z,0);b.P(W.rbox(2,6,2,.2),0,0,0,0,1,1,1,0xb8b8c0,'std');}if(i<pts.length-1){const q=pts[i+1];const m=p.clone().lerp(q,.5);const L=p.distanceTo(q)+.4;W.put(mb,new THREE.Matrix4(),W.rbox(7,1,L,.15),m.x,6,m.z,Math.atan2(q.x-p.x,q.z-p.z),1,1,1,0xd0d0d8,'std');}});
  const sp=W.place(cv.A,.8,-1,17);W.take(sp,8);const sb=PB(W,mb,sp.x,0,sp.z,W.face(sp,W.place(cv.A,.8,0,0)));sb.P(W.rbox(16,.5,4,.1),0,6.2,0,0,1,1,1,0xe8e4dc,'std');sb.P(W.rbox(16.6,.3,4.6,.1),0,10,0,0,1,1,1,0x5a6a8a,'std');for(const x of[-7,0,7])sb.P(W.cyl(8),x,6.7,1.6,0,.25,3.4,.25,0x8a8a92,'std');
  const uv=W.signUV('代々木上原 STATION','#ffffff','#2a5bd0',{w:512,h:64});sb.signQuad(uv,0,9.2,2.1,0,8,1,0);sb.P(W.rbox(2.6,6.2,2.6,.2),-9,0,0,0,1,1,1,0xd8d4cc,'std');
  const tr=SK.train(W,4,[0xf2f2f2,0x2a9a4a]);const A=pts[0],B=pts[pts.length-1];W.anims.push((dt,t)=>{const k=(Math.sin(t*.25)+1)/2;tr.position.copy(A).lerp(B,k);tr.position.y=6.5;tr.rotation.y=Math.atan2(B.x-A.x,B.z-A.z);});
  SK.row(W,-.1,1.16,.036,1,15,3.6,(p,ry)=>W.prop(W.rnd()<.8?'house':'building',p,ry),{pd:11});SK.row(W,-.1,.6,.036,-1,15,3.6,(p,ry)=>W.prop(W.rnd()<.8?'house':'building',p,ry),{pd:11});
  for(let i=0;i<20;i++){const t=W.R(-.05,1.1),s=W.rnd()<.5?1:-1;const p=W.place(cv.A,t,s,W.R(6,11));if(W.ok(p,.5,{pd:5}))W.crowdAt(p.x,p.z,W.R(0,6));}},
 thailand(W,mb,co,cv){
  const temple=(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(14,1.6,20,.2),0,0,0,0,1,1,1,0xf6f2ea,'std',{ao:.85});for(let i=0;i<5;i++)b.P(W.rbox(4,.3,1,.05),0,i*.32,10.2+i*.3*0,0,1,1,1,0xeae4d8,'std');
   b.P(W.rbox(10,6,16,.15),0,1.6,0,0,1,1,1,0xfaf6ee,'std',{ao:.88});for(let k=0;k<5;k++)b.P(W.rbox(1.1,3.6,.12,.5),-3.6+k*1.8,3,8.03,0,1,1,1,0xd8a03a,'std');
   for(let k=0;k<3;k++){const s=1-k*.18;b.P(W.prism(),0,7.6+k*2.2,-k*.8,0,12*s,4.2*s,18*s-k*2,k%2?0x2a7a4a:0xd83a2a,'std');b.P(W.prism(),0,7.6+k*2.2-.25,-k*.8,0,12.6*s,4.4*s,.3,0xd8a03a,'std');
    for(const sd of[-1,1])b.P(W.cone(6),sd*6*s,7.8+k*2.2,9*s-k,0,.25,1.6,.25,0xf0c040,'std',{},.5,sd*-.6);}
   b.P(W.cone(8),0,15.5,0,0,.4,3,.4,0xf0c040,'std');b.occ(0,7,0,10,12,16);SK.crowdRing(W,p.clone().add(new V3(Math.sin(ry)*12,0,Math.cos(ry)*12)),6,4);};
  SK.fit(W,.3,1,26,11,temple,{pd:18});
  SK.fit(W,.66,1,28,8,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(12,1.5,12,.2),0,0,0,0,1,1,1,0xf6f2ea,'std');b.P(W.lathe('stupa',[[0,0],[5,0],[5,1],[4.2,1.4],[4.4,2.4],[3.6,2.8],[3.8,4],[3.4,6],[2.6,8],[1.2,9],[1,9.6],[.7,10],[.5,13],[.2,16],[0,17.5]],20),0,1.5,0,0,1,1,1,0xf0c040,'std',{ao:.75});
   for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;b.P(W.lathe('stupa2',[[0,0],[1.2,0],[1.1,1.5],[.6,2.6],[.2,4],[0,4.6]],12),Math.cos(a)*5.2,1.5,Math.sin(a)*5.2,0,1,1,1,0xf0c040,'std');}b.halo(0,19,0,0xffe08a,3);b.occ(0,8,0,8,16,8);},{pd:20});
  for(const s of[1])SK.row(W,-.08,1.16,.06,s,34,6,(p,ry)=>W.prop(W.rnd()<.5?'building':'shop',p,ry),{pd:28});
  // food stall row with bunting
  SK.row(W,.05,1.1,.07,1,9.5,1.8,(p,ry)=>W.prop('stall',p,ry),{});
  for(let t=.05;t<1.08;t+=.1){const a=W.place(cv.A,t,1,9.5),b2=W.place(cv.A,t+.05,1,9.5);for(let i=0;i<10;i++){const k=i/10;const x=a.x+(b2.x-a.x)*k,z=a.z+(b2.z-a.z)*k,y=4.2-Math.sin(k*Math.PI)*.8;W.put(mb,new THREE.Matrix4(),W.cone(3),x,y-.6,z,Math.atan2(b2.x-a.x,b2.z-a.z)+Math.PI/2,.5,.6,.08,W.pick(PAL.bright),'std',{},Math.PI);}}
  // longtail boats on the river
  for(let i=0;i<4;i++){const g=SK.group(W);SK.local(W,g,b=>PROPS.boat(b));const z0=W.R(0,250),x=-(W.shoreX(z0)+W.R(4,14)),sp=W.R(2,4)*(i%2?1:-1);g.rotation.y=sp>0?0:Math.PI;W.anims.push((dt,t)=>{let z=((z0+t*sp)%320+320)%320-35;g.position.set(x,Math.sin(t*2+i)*.12-.1,z);g.rotation.z=Math.sin(t*1.6+i)*.05;});}
  for(let i=0;i<30;i++){const t=W.R(-.05,1.1);const p=W.place(cv.A,t,1,W.R(5,12));if(W.ok(p,.5,{pd:5}))W.crowdAt(p.x,p.z,W.R(0,6));}},
 maui(W,mb,co,cv){
  // volcano
  const vp=W.place(cv.A,.75,-1,150);const b=PB(W,mb,vp.x,-2,vp.z,0);b.P(W.lathe('volc',[[0,22],[18,26],[24,30],[30,27],[60,14],[95,4],[120,0],[0,0]],40),0,0,0,0,1,1.5,1,0x6aa45a,'far',{grad:0x9a5a3a,jit:.08});b.P(W.cyl(30),0,38,0,0,30,.5,30,0x7a4a3a,'far');
  for(let i=0;i<6;i++){const a=i;b.P(W.quad(),Math.cos(a)*60,30+i*2,Math.sin(a)*60,-a,60,14,1,0xffffff,'cloud',{chunk:false});}
  // sea cliffs + crashing foam
  for(let z=-30;z<300;z+=11){const x=W.shoreX(z)+W.R(-1,3);const p=new V3(x,0,z);if(!W.ok(p,2,{wm:-8,pd:10}))continue;const s=W.R(3,6);W.put(mb,new THREE.Matrix4(),W.blob(W.R(0,4)|0),x,-.5,z,W.R(0,6),s,s*.8,s*1.2,0x55505c,'std',{jit:.2,ao:.65});W.halo(x+1.5,1,z,0xffffff,2.5);}
  SK.row(W,0,1.12,.08,-1,10,1.5,(p,ry)=>W.prop('lavarock',p,ry),{});
  // lookout with fence + rainbow surfboards
  SK.fit(W,.45,1,9,3,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(8,.3,5,.1),0,0,0,0,1,1,1,0xb08a5a,'std');for(let i=0;i<9;i++)b.P(W.rbox(.15,1.2,.15,.03),-4+i,0,-2.4,0,1,1,1,0x9a6a3a,'std');b.P(W.rbox(8,.15,.15,.03),0,1.1,-2.4,0,1,1,1,0x9a6a3a,'std');const uv=W.signUV('LOOKOUT','#2a7a4a','#ffffff',{});b.signQuad(uv,3,1.8,-2.3,0,2,.5,0);});
  SK.row(W,-.05,1.15,.05,1,22,4,(p,ry)=>W.prop(W.rnd()<.4?'palm':'tree',p,ry),{pd:14});
  const rb=W.place(cv.A,.55,-1,90);const r=PB(W,mb,rb.x,0,rb.z,W.face(rb,W.place(cv.A,.5,0,0)));[0xff4a4a,0xffa23a,0xffe14a,0x5ad85a,0x4aa8ff,0xa86aff].forEach((c,i)=>r.P(W.tor(Math.PI,.006),0,0,0,0,80-i*1.1,80-i*1.1,80,c,'alpha',{chunk:false}));},
 hawaii(W,mb,co,cv){
  // waterfall cliff
  SK.fit(W,.4,1,30,12,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);for(let i=0;i<9;i++){const x=(i-4)*4.4,s=W.R(7,10);b.P(W.blob(i%4),x,W.R(4,10),-4-W.R(0,4),W.R(0,6),s,s*2.2,s,0x4a6a4a,'std',{grad:0x5ab85a,jit:.15,ao:.6});}
   b.P(W.cyl(20),0,0,4,0,14,.3,10,0x4fd0e0,'glass');b.P(W.rbox(4.2,22,.3,.2),0,.2,.6,0,1,1,1,0xffffff,'std',{chunk:false});
   const wt=SK.waterTex(W);const wf=new THREE.Mesh(new THREE.PlaneGeometry(4.6,22),new THREE.MeshBasicMaterial({map:wt,transparent:true,opacity:.92}));const q=b.wp(0,11.2,.9);wf.position.copy(q);wf.rotation.y=ry;W.scene.add(wf);W.anims.push((dt,t)=>{wt.offset.y=t*1.2;});
   for(let i=0;i<8;i++)b.halo(W.R(-3,3),W.R(.5,3),W.R(1,4),0xffffff,W.R(3,6));[0xff4a4a,0xffa23a,0xffe14a,0x5ad85a,0x4aa8ff,0xa86aff].forEach((c,i)=>b.P(W.tor(Math.PI,.008),0,1,4,0,30-i*.45,30-i*.45,30,c,'alpha',{chunk:false}));
   for(let i=0;i<6;i++)W.prop('palm',b.wp((i-2.5)*6,0,6+W.R(0,3)),ry);b.occ(0,10,-6,36,20,8);},{pd:24});
  // hula stage
  SK.fit(W,.68,1,19,7,(p,ry)=>{const b=PB(W,mb,p.x,0,p.z,ry);b.P(W.rbox(12,1,7,.15),0,0,0,0,1,1,1,0xb07a4a,'std');for(let i=0;i<12;i++)b.P(W.rbox(.95,.06,7,.02),-5.5+i,1,0,0,1,1,1,i%2?0xc08a5a:0xa86e40,'std');
   for(const x of[-5.5,5.5])for(const z of[-3,3])b.P(W.cyl(8),x,1,z,0,.35,4.6,.35,0x8a5a32,'std');b.P(W.prism(),0,5.4,0,Math.PI/2,8.4,2.6,13.4,0xd8b46a,'std',{jit:.15});
   for(let i=0;i<14;i++)b.P(W.rbox(.5,.9,.04,.02),-5.8+i*.9,4.9,3.6,0,1,1,1,W.pick([0x7ad85a,0xffd23a,0xff7ab0]),'std');const uv=W.signUV('ALOHA STAGE','#ffd23a','#c83a2a',{});b.signQuad(uv,0,5.6,4.1,0,4,1,0);
   for(const x of[-7,7])PROPS.torch(PB(W,mb,...b.wp(x,0,3).toArray(),ry));for(let i=0;i<5;i++){const q=b.wp(-3.6+i*1.8,0,0);W.crowdAt(q.x,q.z,ry,{y:1.05});}
   SK.crowdRing(W,p.clone().add(new V3(Math.sin(ry)*9,0,Math.cos(ry)*9)),14,5,ry+Math.PI);b.occ(0,3,0,12,6,7);},{pd:14});
  // outrigger canoes on the beach + tikis
  for(const z of[30,95,170,230]){const x=-(W.shoreX(z)-6);const p=new V3(x,0,z);if(W.ok(p,2,{pd:6})){W.take(p,2.5);const b=PB(W,mb,x,0,z,.2);b.P(W.sph(12),0,.3,0,0,.9,.8,7,0xc83a2a,'std');b.P(W.rbox(.8,.1,6.4,.05),0,.65,0,0,1,1,1,0x9a6a3a,'std');for(const zz of[-1.5,1.5])b.P(W.cyl(5),1.2,.6,zz,0,.08,2.4,.08,0x9a6a3a,'std',{},0,-Math.PI/2);b.P(W.sph(8),2.4,.4,0,0,.3,.3,5,0xe8d098,'std');}}
  SK.row(W,0,1.12,.05,-1,16,1.6,(p,ry)=>W.prop('palm',p,ry),{pd:7});SK.row(W,-.05,1.15,.06,1,30,4,(p,ry)=>W.prop(W.rnd()<.5?'shop':'palm',p,ry),{pd:20});
  for(let i=0;i<24;i++){const t=W.R(0,1.1);const p=W.place(cv.A,t,-1,W.R(8,18));if(W.ok(p,.6,{pd:5}))W.crowdAt(p.x,p.z,W.R(0,6));}},
};
