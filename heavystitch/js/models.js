// Heavy Stitch v3.0 - real 3D chassis models + bolt-on heavy armor (Three.js, procedural, no external assets)
// Exposes CH3D: build(charId, loadout, paint, opt) -> rig {root, J (joints), S (sockets), update(dt,st), kick(slot), dispose()}
//               stage(canvas, opts) live viewer (hangar/title/menu), snap(...) static render (cut-ins / cutscenes), partIcon(...)
var CH3D=window.CH3D=(()=>{
const T=THREE,PI=Math.PI;
const V3=T.Vector3;
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,smooth=(a,b,k,dt)=>a+(b-a)*(1-Math.exp(-k*dt));
const col=c=>new T.Color(c).convertSRGBToLinear();
// deterministic noise
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
// ---------------- TEXTURES (generated once, shared) ----------------
const TX={};
function canvasTex(w,h,draw,o){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new T.CanvasTexture(c);
 if(!o||o.wrap!==false){t.wrapS=t.wrapT=T.RepeatWrapping;}if(o&&o.srgb)t.encoding=T.sRGBEncoding;t.anisotropy=4;return t;}
function plateTex(){if(TX.plate)return TX.plate;seed=11;
 TX.plate=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#d8d8d8';g.fillRect(0,0,w,h);
  // mottled grime
  for(let i=0;i<900;i++){const x=rnd()*w,y=rnd()*h,r=4+rnd()*26;const a=rnd()*.07;g.fillStyle=`rgba(${rnd()<.5?20:60},${rnd()<.5?18:40},14,${a})`;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
  // panel seams (irregular grid)
  g.strokeStyle='rgba(30,30,30,.6)';g.lineWidth=2;const xs=[0,256],ys=[0,300];
  for(const x of xs){g.beginPath();g.moveTo(x+.5,0);g.lineTo(x+.5,h);g.stroke();}
  for(const y of ys){g.beginPath();g.moveTo(0,y+.5);g.lineTo(w,y+.5);g.stroke();}
  g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1;for(const x of xs){g.beginPath();g.moveTo(x+3,0);g.lineTo(x+3,h);g.stroke();}for(const y of ys){g.beginPath();g.moveTo(0,y+3);g.lineTo(w,y+3);g.stroke();}
  // rivets along seams
  for(const x of xs)for(let y=30;y<h;y+=80){rivet(g,x+12,y);}
  // scratches & scuffs
  for(let i=0;i<160;i++){const x=rnd()*w,y=rnd()*h,l=6+rnd()*40,a=rnd()*PI;g.strokeStyle=`rgba(255,255,255,${.12+rnd()*.3})`;g.lineWidth=rnd()<.8?1:2;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}
  for(let i=0;i<40;i++){const x=rnd()*w,y=rnd()*h;g.fillStyle=`rgba(255,255,255,${rnd()*.18})`;g.fillRect(x,y,4+rnd()*30,1+rnd()*3);}
  // drip stains
  for(let i=0;i<26;i++){const x=rnd()*w,y=rnd()*h,l=20+rnd()*80;const gr=g.createLinearGradient(x,y,x,y+l);gr.addColorStop(0,'rgba(40,28,18,.28)');gr.addColorStop(1,'rgba(40,28,18,0)');g.fillStyle=gr;g.fillRect(x,y,2+rnd()*4,l);}
 });return TX.plate;}
function rivet(g,x,y){g.fillStyle='rgba(0,0,0,.55)';g.beginPath();g.arc(x+1,y+1,4.5,0,7);g.fill();g.fillStyle='#bdbdbd';g.beginPath();g.arc(x,y,3.6,0,7);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(x-1.2,y-1.2,1.4,0,7);g.fill();}
function hazardTex(){if(TX.haz)return TX.haz;seed=21;TX.haz=canvasTex(256,64,(g,w,h)=>{g.fillStyle='#f2b81c';g.fillRect(0,0,w,h);g.fillStyle='#16161a';
  for(let x=-h;x<w+h;x+=48){g.beginPath();g.moveTo(x,h);g.lineTo(x+24,h);g.lineTo(x+24+h,0);g.lineTo(x+h,0);g.closePath();g.fill();}
  for(let i=0;i<120;i++){g.fillStyle=`rgba(${rnd()<.5?255:30},${rnd()<.5?255:25},${rnd()<.5?255:20},${rnd()*.25})`;g.fillRect(rnd()*w,rnd()*h,1+rnd()*10,1+rnd()*2);}
 },{srgb:true});return TX.haz;}
function ventTex(){if(TX.vent)return TX.vent;TX.vent=canvasTex(128,128,(g,w,h)=>{g.fillStyle='#3a3a3a';g.fillRect(0,0,w,h);for(let y=8;y<h;y+=16){g.fillStyle='#0c0c0c';g.fillRect(8,y,w-16,8);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(8,y+8,w-16,1.5);}},{srgb:true});return TX.vent;}
function feltTex(){if(TX.felt)return TX.felt;seed=31;TX.felt=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#e6e6e6';g.fillRect(0,0,w,h);
  for(let i=0;i<5000;i++){const v=200+rnd()*55|0;g.fillStyle=`rgba(${v},${v},${v},.5)`;const x=rnd()*w,y=rnd()*h,a=rnd()*PI;g.fillRect(x,y,1,2+rnd()*3);}
  for(let i=0;i<1400;i++){g.fillStyle=`rgba(0,0,0,${rnd()*.08})`;g.fillRect(rnd()*w,rnd()*h,2,2);}});return TX.felt;}
const DECALS=['HS-07','LC-2291','AX-41','MK.III','LOOM-X','HS-113','R-09','KN-5'];
function decalTex(i){const k='dec'+i;if(TX[k])return TX[k];const txt=DECALS[i%DECALS.length];
 TX[k]=canvasTex(256,96,(g,w,h)=>{g.clearRect(0,0,w,h);g.font='bold 54px "Arial Narrow",Arial,sans-serif';g.textBaseline='middle';g.fillStyle='rgba(235,235,225,.92)';g.fillText(txt,10,46);
  g.fillRect(10,80,w-40,5);g.font='bold 15px Arial';g.fillText(i%2?'▲ HIGH VOLTAGE':'NO STEP · 400kPa',12,10);
  g.globalCompositeOperation='destination-out';seed=41+i;for(let j=0;j<160;j++){g.fillStyle=`rgba(0,0,0,${rnd()*.8})`;g.fillRect(rnd()*w,rnd()*h,1+rnd()*5,1+rnd()*2);}},{wrap:false,srgb:true});return TX[k];}
// ---------------- MATERIALS (cached) ----------------
const MC={};
function M(key,make){return MC[key]||(MC[key]=make());}
const hex=c=>typeof c==='string'?c:'#'+col(c).getHexString();
// weathered painted armor plate
function plateM(c){return M('pl'+hex(c),()=>new T.MeshStandardMaterial({color:col(c).lerp(col('#5d5f63'),.26),map:plateTex(),bumpMap:plateTex(),bumpScale:.012,metalness:.55,roughness:.5,flatShading:true}));}
// bare gunmetal frame
function metalM(c){c=c||'#2c2f36';return M('mt'+hex(c),()=>new T.MeshStandardMaterial({color:col(c),map:plateTex(),metalness:.8,roughness:.42,flatShading:true}));}
function chromeM(){return M('chrome',()=>new T.MeshStandardMaterial({color:col('#b9c2cc'),metalness:.85,roughness:.3}));}
function rubberM(){return M('rub',()=>new T.MeshStandardMaterial({color:0x16171a,metalness:0,roughness:.9}));}
function hazM(){return M('haz',()=>new T.MeshStandardMaterial({map:hazardTex(),metalness:.3,roughness:.6,flatShading:true}));}
function ventM(){return M('vent',()=>new T.MeshStandardMaterial({map:ventTex(),metalness:.6,roughness:.5}));}
function glowM(c){return M('gl'+hex(c),()=>{const m=new T.MeshBasicMaterial({color:col(c)});m.toneMapped=false;return m;});}
function glassM(c){return M('gs'+hex(c),()=>new T.MeshStandardMaterial({color:col(c).multiplyScalar(.5),emissive:col(c),emissiveIntensity:.9,metalness:.2,roughness:.1,transparent:true,opacity:.62}));}
function haloM(c){return M('ha'+hex(c),()=>new T.MeshBasicMaterial({color:col(c),transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false}));}
function feltM(c,o){return M('fe'+hex(c)+(o||''),()=>new T.MeshStandardMaterial({color:col(c),map:feltTex(),bumpMap:feltTex(),bumpScale:.02,metalness:0,roughness:.96}));}
function skinM(c){return M('sk'+hex(c),()=>new T.MeshStandardMaterial({color:col(c),metalness:0,roughness:.7}));}
function clothM(c,r){return M('cl'+hex(c)+(r||''),()=>new T.MeshStandardMaterial({color:col(c),map:feltTex(),metalness:0,roughness:r||.85}));}
function decalM(i){return M('dc'+i,()=>new T.MeshBasicMaterial({map:decalTex(i),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));}
function basicM(c){return M('bs'+hex(c),()=>new T.MeshBasicMaterial({color:col(c)}));}
// ---------------- GEOMETRY (cached) ----------------
const GC={};
function G(key,make){return GC[key]||(GC[key]=make());}
const r3=v=>Math.round(v*1000)/1000;
function boxG(w,h,d){return G(`b${r3(w)},${r3(h)},${r3(d)}`,()=>new T.BoxGeometry(w,h,d));}
// chamfered plate: w (x) h (y) d (z thickness), chamfer c, extruded along z, centered
function plateG(w,h,d,c){c=c==null?Math.min(w,h)*.18:c;return G(`p${r3(w)},${r3(h)},${r3(d)},${r3(c)}`,()=>{const s=new T.Shape(),x=w/2,y=h/2;
 s.moveTo(-x+c,-y);s.lineTo(x-c,-y);s.lineTo(x,-y+c);s.lineTo(x,y-c);s.lineTo(x-c,y);s.lineTo(-x+c,y);s.lineTo(-x,y-c);s.lineTo(-x,-y+c);s.closePath();
 const bv=Math.min(d*.3,.03);const g=new T.ExtrudeGeometry(s,{depth:Math.max(.001,d-bv*2),bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:1,curveSegments:1});g.translate(0,0,-(d-bv*2)/2);g.computeVertexNormals();return g;});}
// trapezoid wedge plate (top width w2)
function trapG(w,w2,h,d){return G(`t${r3(w)},${r3(w2)},${r3(h)},${r3(d)}`,()=>{const s=new T.Shape();s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w2/2,h/2);s.lineTo(-w2/2,h/2);s.closePath();
 const bv=Math.min(d*.3,.025);const g=new T.ExtrudeGeometry(s,{depth:Math.max(.001,d-bv*2),bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:1});g.translate(0,0,-(d-bv*2)/2);return g;});}
// wrap-around shell: arc from a0..a1 (0 = +Z forward, + = toward +X), radius r (inner), thickness t, height h (y), seg facets
function shellG(r,t,a0,a1,h,seg){seg=seg||6;return G(`s${r3(r)},${r3(t)},${r3(a0)},${r3(a1)},${r3(h)},${seg}`,()=>{const s=new T.Shape();const P=(R,a)=>[R*Math.sin(a),-R*Math.cos(a)];
 let p=P(r+t,a0);s.moveTo(p[0],p[1]);for(let i=1;i<=seg;i++){p=P(r+t,a0+(a1-a0)*i/seg);s.lineTo(p[0],p[1]);}for(let i=seg;i>=0;i--){p=P(r,a0+(a1-a0)*i/seg);s.lineTo(p[0],p[1]);}s.closePath();
 const bv=Math.min(t*.35,.025);const g=new T.ExtrudeGeometry(s,{depth:Math.max(.001,h-bv*2),bevelEnabled:true,bevelThickness:bv,bevelSize:bv*.7,bevelSegments:1,curveSegments:1});
 g.rotateX(-PI/2);g.translate(0,-(h-bv*2)/2,0);g.computeVertexNormals();return g;});}
// tapered faceted sleeve (open front optional) along y, centered
function sleeveG(rt,rb,h,seg,a0,a1){seg=seg||7;a0=a0==null?0:a0;a1=a1==null?PI*2:a1;return G(`v${r3(rt)},${r3(rb)},${r3(h)},${seg},${r3(a0)},${r3(a1)}`,()=>new T.CylinderGeometry(rt,rb,h,seg,1,false,a0,a1-a0));}
function cylG(rt,rb,h,seg,open){return G(`c${r3(rt)},${r3(rb)},${r3(h)},${seg||12},${open?1:0}`,()=>new T.CylinderGeometry(rt,rb,h,seg||12,1,!!open));}
function sphG(r,ws,hs){return G(`o${r3(r)},${ws||20},${hs||14}`,()=>new T.SphereGeometry(r,ws||20,hs||14));}
function sphSegG(r,p0,pl,t0,tl,ws,hs){return G(`q${r3(r)},${r3(p0)},${r3(pl)},${r3(t0)},${r3(tl)},${ws||16},${hs||10}`,()=>new T.SphereGeometry(r,ws||16,hs||10,p0,pl,t0,tl));}
function capG(r,l,rs){return G(`k${r3(r)},${r3(l)},${rs||12}`,()=>new T.CapsuleGeometry(r,l,5,rs||12));}
function torG(r,t,rs,ts,arc){return G(`r${r3(r)},${r3(t)},${rs||6},${ts||20},${r3(arc||PI*2)}`,()=>new T.TorusGeometry(r,t,rs||6,ts||20,arc||PI*2));}
function latheG(key,pts,seg){return G('l'+key,()=>{const g=new T.LatheGeometry(pts.map(p=>new T.Vector2(p[0],p[1])),seg||24);g.computeVertexNormals();return g;});}
function planeG(w,h){return G(`pl${r3(w)},${r3(h)}`,()=>new T.PlaneGeometry(w,h));}
function tubeG(key,pts,r,seg,rs){return G('tb'+key,()=>new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>new V3(p[0],p[1],p[2]))),seg||24,r,rs||8,false));}
// smooth radius-varying tube (tail, stalk) with tapered end caps
// ---------------- MESH HELPERS ----------------
function mk(geo,mat,parent,x,y,z,rx,ry,rz,sx,sy,sz){const m=new T.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);if(rx||ry||rz)m.rotation.set(rx||0,ry||0,rz||0);
 if(sx!=null)m.scale.set(sx,sy==null?sx:sy,sz==null?sx:sz);if(parent)parent.add(m);return m;}
function grp(parent,x,y,z,rx,ry,rz){const g=new T.Group();g.position.set(x||0,y||0,z||0);if(rx||ry||rz)g.rotation.set(rx||0,ry||0,rz||0);if(parent)parent.add(g);return g;}
function joint(name,parent,x,y,z){const g=grp(parent,x,y,z);g.name=name;return g;}
// orient a cylinder-like mesh (along y) from a to b in parent space
const _up=new V3(0,1,0);
function between(mesh,a,b){const d=new V3().subVectors(b,a);const L=d.length();mesh.position.copy(a).addScaledVector(d,.5);mesh.quaternion.setFromUnitVectors(_up,d.clone().normalize());return L;}
// ---------------- CHARACTER BODIES ----------------
// Every body returns {root, J, D}. Forward = +Z. Character's right side = -X. Units = world units (game scale).
// J: lean, hips, chest, neck, head, shR/shL (upper arm), elR/elL (forearm), hdR/hdL (hand), thR/thL, knR/knL, ftR/ftL, back, tail[], shoeR/shoeL
// D: dimensions used by armor fitting
const SPEC={
 pinco:{type:'hum',H:4.6,skin:'#ef9fb4',top:'#8b8e92',bottom:'#7d8084',bare:{legs:1,arms:0,feet:1,hands:1},hipY:1.98,th:.86,sh:.9,legR:.12,thR:.15,
  waist:.42,chestR:.54,chestZ:.8,torsoH:.95,shX:.58,uLen:.6,fLen:.58,armR:.15,hand:.17,headR:.6,neck:.22,foot:[.23,.15,.42],tail:1,face:'pinco'},
 asmon:{type:'hum',H:4.6,skin:'#e3b497',top:'#3b2466',bottom:'#17161d',boot:'#221d2b',trim:'#b585ff',bare:{legs:0,arms:0,feet:0,hands:0},glove:'#1c1824',hipY:1.95,th:.9,sh:.9,legR:.14,thR:.17,
  waist:.4,chestR:.5,chestZ:.74,torsoH:.95,shX:.56,uLen:.6,fLen:.56,armR:.14,hand:.14,headR:.52,neck:.19,foot:[.16,.14,.32],coat:1,face:'asmon'},
 bronny:{type:'hum',H:4.6,skin:'#7b4a33',top:'#eef0f4',bottom:'#eef0f4',trim:'#1e2d50',acc:'#ff8a1a',boot:'#1e2d50',bare:{legs:1,arms:1,feet:0,hands:1},hipY:1.98,th:.9,sh:.92,legR:.15,thR:.18,
  waist:.44,chestR:.56,chestZ:.72,torsoH:1.0,shX:.62,uLen:.6,fLen:.58,armR:.16,hand:.16,headR:.52,neck:.2,foot:[.17,.16,.36],jersey:1,face:'bronny'},
 dkermit:{type:'hum',H:5,skin:'#6fa83c',top:'#18191c',bottom:'#141518',boot:'#101012',trim:'#7dff4a',bare:{legs:0,arms:0,feet:0,hands:1},hipY:1.95,th:.9,sh:.9,legR:.16,thR:.19,
  waist:.5,chestR:.6,chestZ:.75,torsoH:1.05,shX:.66,uLen:.64,fLen:.58,armR:.16,hand:.18,headR:.62,neck:.16,foot:[.19,.15,.36],coat:1,hood:1,face:'kermit'},
 pooh:{type:'pooh',H:4.4},bean:{type:'bean',H:4.6},
};
const capFront=(r,hw,t0,t1,ws,hs)=>sphSegG(r,PI/2-hw,hw*2,t0,t1-t0,ws||16,hs||8);
const capBack=(r,hw,t0,t1,ws,hs)=>sphSegG(r,PI/2+hw,PI*2-hw*2,t0,t1-t0,ws||18,hs||8);
function eyePair(head,x,y,z,r,white,pupil,o){o=o||{};const out=[];for(const s of[-1,1]){const e=mk(sphG(r,16,12),skinM(white),head,s*x,y,z,0,0,0,o.sx||1,o.sy||1,o.sz||.7);
  if(pupil)mk(sphG(r*.55,12,10),skinM(pupil),e,o.px?o.px*s:0,o.py||0,r*.62,0,0,0,1,1,.6);
  mk(sphG(r*.16,8,6),basicM('#ffffff'),e,-r*.2,r*.25,r*.9);out.push(e);}return out;}
function buildHuman(id,sp){const root=new T.Group(),J={},D={},B=[];const add=(m)=>{B.push(m);return m;};
 const lean=J.lean=joint('lean',root);const hips=J.hips=joint('hips',lean,0,sp.hipY,0);
 const skin=feltM(sp.skin),top=clothM(sp.top),bot=clothM(sp.bottom),boot=sp.boot?clothM(sp.boot,.55):skin;
 const glove=sp.glove?clothM(sp.glove,.6):feltM(sp.skin);
 Object.assign(D,{hipY:sp.hipY,th:sp.th,sh:sp.sh,legR:sp.legR,thR:sp.thR,waist:sp.waist,chestR:sp.chestR,chestZ:sp.chestZ,torsoH:sp.torsoH,shX:sp.shX,uLen:sp.uLen,fLen:sp.fLen,armR:sp.armR,hand:sp.hand,headR:sp.headR,foot:sp.foot,body:'hum'});
 // ----- legs
 for(const s of['R','L']){const x=(s==='R'?-1:1)*sp.waist*.52;const th=J['th'+s]=joint('th'+s,hips,x,-.08,0);const kn=J['kn'+s]=joint('kn'+s,th,0,-sp.th,0);const ft=J['ft'+s]=joint('ft'+s,kn,0,-sp.sh,0);
  add(mk(capG(sp.thR,sp.th-sp.thR,10),sp.bare.legs?skin:bot,th,0,-sp.th/2,0));
  add(mk(capG(sp.legR,sp.sh-sp.legR,10),sp.bare.legs?skin:bot,kn,0,-sp.sh/2,0));
  const f=sp.foot;add(mk(sphG(1,16,10),sp.bare.feet?skin:boot,ft,0,-sp.hipY+sp.th+sp.sh+f[1]*.9-.02,f[2]*.42,0,0,0,f[0],f[1],f[2]));
  if(!sp.bare.feet){add(mk(cylG(sp.legR*1.25,sp.legR*1.35,.42,10),boot,kn,0,-sp.sh+.18,0));add(mk(boxG(f[0]*2.1,.06,f[2]*2.1),rubberM(),ft,0,-sp.hipY+sp.th+sp.sh+.03,f[2]*.42));}
  if(sp.jersey){add(mk(cylG(sp.legR*1.12,sp.legR*1.18,.5,10),clothM('#ffffff'),kn,0,-sp.sh+.32,0));}
 }
 // shorts / pants top
 if(sp.bare.legs){add(mk(latheG(id+'shorts',[[sp.waist*.8,.08],[sp.waist*1.02,0],[sp.waist*1.12,-.25],[sp.waist*1.15,-.42],[sp.waist*.3,-.46]],14),bot,hips,0,0,0,0,0,0,1,1,.82));
  for(const s of['R','L'])add(mk(cylG(sp.thR*1.55,sp.thR*1.7,.42,12),bot,J['th'+s],0,-.2,0));
  if(id==='pinco'){for(const s of[-1,1])add(mk(plateG(.2,.18,.04,.03),bot,hips,s*sp.waist*1.05,-.32,.0,0,s*PI/2,0));}
  if(sp.jersey){for(const s of[-1,1])add(mk(boxG(.05,.4,.02),clothM(sp.trim),J[s<0?'thR':'thL'],s*sp.thR*1.62,-.22,0,0,0,0));}
 }else{add(mk(latheG(id+'pelvis',[[sp.waist*.8,.1],[sp.waist,0],[sp.waist*1.05,-.25],[sp.waist*.3,-.34]],14),bot,hips,0,0,0,0,0,0,1,1,.8));}
 // ----- torso
 const chest=J.chest=joint('chest',hips,0,.32,0);const r=sp.chestR,w=sp.waist,th=sp.torsoH;
 const tprof=[[w*.95,-.2],[w,0],[r*.94,th*.42],[r,th*.62],[r*.92,th*.8],[r*.55,th*.96],[sp.neck*1.2,th]];D.tp=tprof.map(q=>[q[0]*(sp.coat?1.06:1.0),q[1]]);D.tz=sp.chestZ*(sp.coat?1.05:1);D.pk=id;
 add(mk(latheG(id+'torso',[[0,-.2]].concat(tprof),18),top,chest,0,0,0,0,0,0,1,1,sp.chestZ));
 if(id==='pinco'){add(mk(torG(w*1.0,.05,8,22),top,chest,0,-.14,0,PI/2,0,0,1,sp.chestZ,1));}
 if(sp.jersey){add(mk(torG(r*.6,.035,6,20,PI),clothM(sp.trim),chest,0,th*.86,r*.18,PI/2+.5,0,0,1,1,1));
  const n=mk(planeG(.3,.32),new T.MeshBasicMaterial({map:numTex('0',sp.trim,sp.acc),transparent:true}),chest,0,th*.45,r*sp.chestZ+.02);add(n);}
 const neck=J.neck=joint('neck',chest,0,th,0);
 add(mk(cylG(sp.neck,sp.neck*1.1,.22,12),id==='pinco'?top:skinM(sp.skin),neck,0,.05,0));
 if(id==='pinco')add(mk(torG(sp.neck*1.15,.08,8,16),top,neck,0,.02,0,PI/2,0,0));
 // ----- arms
 for(const s of['R','L']){const sg=s==='R'?-1:1;const sh=J['sh'+s]=joint('sh'+s,chest,sg*sp.shX,th*.8,0);sh.rotation.z=sg*.12;
  const el=J['el'+s]=joint('el'+s,sh,0,-sp.uLen,0);const hd=J['hd'+s]=joint('hd'+s,el,0,-sp.fLen,0);
  const am=sp.bare.arms?skin:top;add(mk(sphG(sp.armR*1.25,12,10),am,sh,0,-.02,0));
  add(mk(capG(sp.armR,sp.uLen-sp.armR,10),am,sh,0,-sp.uLen/2,0));add(mk(capG(sp.armR*.92,sp.fLen-sp.armR,10),am,el,0,-sp.fLen/2,0));
  if(id==='pinco')add(mk(torG(sp.armR*.95,.035,6,14),top,el,0,-sp.fLen+.08,0,PI/2,0,0));
  if(sp.coat){add(mk(cylG(sp.armR*1.25,sp.armR*1.45,.22,10),top,el,0,-sp.fLen+.14,0));add(mk(torG(sp.armR*1.42,.02,4,14),glowM(sp.trim),el,0,-sp.fLen+.04,0,PI/2,0,0));}
  add(mk(sphG(sp.hand,14,10),sp.bare.hands?skin:glove,hd,0,-sp.hand*.6,0,0,0,0,1,1.1,.85));
  add(mk(sphG(sp.hand*.42,8,6),sp.bare.hands?skin:glove,hd,-sg*sp.hand*.55,-sp.hand*.2,sp.hand*.55));}
 // ----- coat (Asmon / Dark Kermit)
 if(sp.coat){const tr=glowM(sp.trim);
  add(mk(latheG(id+'coatT',[[w*1.08,-.25],[r*1.0,th*.45],[r*1.05,th*.62],[r*.98,th*.82],[r*.6,th*.98]],14),top,chest,0,0,0,0,0,0,1.02,1,sp.chestZ*1.05));
  for(const s of[-1,1]){add(mk(boxG(.03,th*.95,.02),tr,chest,s*.09,th*.45,r*sp.chestZ*1.07+.02,-.08,0,0));}
  add(mk(trapG(r*.9,r*.5,.42,.06),top,chest,0,th*.96,-.08,-.4,0,0)); // collar
  // skirt panels on thighs + hips back
  for(const s of['R','L']){const sg=s==='R'?-1:1;const sk=mk(shellG(sp.thR*1.5,.035,sg>0?-.3:-2.4,sg>0?2.4:.3,1.15,5),top,J['th'+s],0,-.5,0);add(sk);
   add(mk(boxG(.025,1.1,.025),tr,J['th'+s],sg*sp.thR*1.6,-.5,sp.thR*.4));}
  add(mk(shellG(w*1.05,.04,PI*.62,PI*1.38,1.2,6),top,hips,0,-.55,0));
 }
 // ----- head
 const head=J.head=joint('head',neck,0,.18,0);const hr=sp.headR;D.headC=new V3(0,hr*.95,0);
 const face=sp.face;
 if(face==='pinco'){const hm=add(mk(sphG(hr,24,18),skin,head,0,hr*.95,0,0,0,0,1,1.05,.96));
  const cream=feltM('#f7e6da');add(mk(sphG(hr*.62,20,14),cream,head,0,hr*.62,hr*.68,0,0,0,1.18,.78,1.05));
  add(mk(sphG(hr*.2,14,10),feltM('#d9566e'),head,0,hr*.82,hr*1.3,0,0,0,1.35,.8,1));
  add(mk(torG(hr*.18,.018,5,12,PI*.8),basicM('#5a2a32'),head,0,hr*.42,hr*1.22,0,0,PI*1.1,1,1,1));
  const eyes=eyePair(head,hr*.36,hr*1.18,hr*.78,hr*.25,'#f4c63a','#111111',{sz:.75,px:.0,py:-.0});
  for(const e of eyes){const lid=mk(sphSegG(hr*.25*1.1,0,PI*2,0,PI*.45,14,6),feltM(sp.skin),e,0,0,0,-.25,0,0,1.08,1.08,1.08);}
  for(const s of[-1,1]){const ear=mk(sphG(hr*.34,14,10),skin,head,s*hr*.72,hr*1.72,-hr*.1,0,0,s*-.35,1,1,.42);add(ear);mk(sphG(hr*.24,12,8),feltM('#f7d9d0'),ear,0,0,.45*hr*.34,0,0,0,1,1,.4);}
  const wm=basicM('#f4f1ea');for(const s of[-1,1])for(let i=0;i<3;i++){const wk=mk(cylG(.006,.006,hr*1.1,4),wm,head,s*hr*.72,hr*(.62+i*.07),hr*.95,0,0,s*(PI/2+(i-1)*.18));}
  add(mk(capG(.03,hr*.32,6),basicM('#3b3b40'),head,-hr*.36,hr*1.5,hr*.78,0,0,PI/2+.25));add(mk(capG(.03,hr*.32,6),basicM('#3b3b40'),head,hr*.36,hr*1.5,hr*.78,0,0,PI/2-.25));
  D.faceZ=hr*.96;D.eyeY=hr*1.18;D.ears=1;
 }else{const sk=feltM(sp.skin);const hs=face==='kermit'?[1.15,.85,1]:[.92,1.08,.98];add(mk(sphG(hr,24,18),sk,head,0,hr*.95,0,0,0,0,...hs));
  add(mk(sphG(hr*.62,16,12),sk,head,0,hr*.55,0,0,0,0,1.2,1,1.15));
  D.faceZ=hr*.98;D.eyeY=hr*1.05;
  if(face==='asmon'){const hair=feltM('#5b3a26'),beard=feltM('#6e4a33');
   add(mk(capBack(hr*1.07,.75,0,PI*.62),hair,head,0,hr*.95,0,0,0,0,1,1.04,1.02));add(mk(capFront(hr*1.08,.8,0,PI*.2),hair,head,0,hr*.95,0));
   for(const[x,y,z,sc,rz,rx]of[[0,1.78,.35,.5,0,.4],[-.38,1.72,.42,.42,.6,.3],[.4,1.7,.36,.42,-.7,.3],[.15,1.85,.0,.5,-.2,0],[-.2,1.8,-.3,.5,.3,-.3],[.62,1.45,.3,.32,-1,0],[-.66,1.45,.3,.32,1,0]])add(mk(sphG(hr*sc,12,8),hair,head,x*hr,y*hr,z*hr,rx,0,rz,1.3,.62,1.1));
   add(mk(capFront(hr*1.03,1.15,PI*.68,PI*.93),beard,head,0,hr*.95,0,0,0,0,1,1.05,1.02));
   add(mk(capG(hr*.08,hr*.5,8),beard,head,0,hr*.66,hr*.94,0,0,PI/2));
   const vf=mk(shellG(hr*.98,.05,-1.05,1.05,hr*.32,8),metalM('#1d1828'),head,0,hr*1.12,0);add(vf);add(mk(shellG(hr*1.01,.03,-.9,.9,hr*.22,8),glassM('#b26cff'),head,0,hr*1.12,0));
   add(mk(capG(hr*.05,hr*.25,6),hair,head,-hr*.33,hr*1.38,hr*.86,0,0,PI/2+.15));add(mk(capG(hr*.05,hr*.25,6),hair,head,hr*.33,hr*1.38,hr*.86,0,0,PI/2-.15));
   for(const s of[-1,1])add(mk(sphG(hr*.16,8,6),sk,head,s*hr*.95,hr*1.0,0,0,0,0,.5,1,.8));
  }else if(face==='bronny'){const hair=feltM('#141414');add(mk(sphSegG(hr*1.04,0,PI*2,0,PI*.3,18,6),hair,head,0,hr*.95,0,-.12,0,0,.94,1.1,1));
   add(mk(capFront(hr*1.04,1.15,PI*.64,PI*.95),hair,head,0,hr*.95,0,0,0,0,.94,1.06,1.02));add(mk(capBack(hr*1.03,1.2,PI*.25,PI*.62),hair,head,0,hr*.95,0,0,0,0,.94,1.06,1.02));
   eyePair(head,hr*.32,hr*1.12,hr*.84,hr*.11,'#ffffff','#1a0e08',{sz:.6});
   add(mk(capFront(hr*1.0,.45,PI*.6,PI*.68,12,3),basicM('#ffffff'),head,0,hr*.95,0,0,0,0,.97,1.08,1.08));
   add(mk(capG(hr*.05,hr*.22,6),hair,head,-hr*.3,hr*1.32,hr*.86,0,0,PI/2+.2));add(mk(capG(hr*.05,hr*.22,6),hair,head,hr*.3,hr*1.32,hr*.86,0,0,PI/2-.2));
   for(const s of[-1,1])add(mk(sphG(hr*.18,8,6),sk,head,s*hr*.92,hr*1.0,0,0,0,0,.5,1,.8));
  }else if(face==='kermit'){const eyeW=feltM('#f4f1ea');for(const s of[-1,1]){const e=mk(sphG(hr*.34,16,12),eyeW,head,s*hr*.45,hr*1.55,hr*.45);add(e);
    mk(boxG(hr*.3,hr*.06,.04),basicM('#111111'),e,0,0,hr*.32);mk(boxG(hr*.06,hr*.22,.04),basicM('#111111'),e,0,0,hr*.32);}
   add(mk(capFront(hr*1.0,.95,PI*.55,PI*.7,16,4),basicM('#5a1414'),head,0,hr*.95+.01,0,0,0,0,1.16,.86,1.01));
   add(mk(cylG(hr*.22,hr*.24,hr*.18,16),metalM('#222'),head,hr*.45,hr*1.55,hr*.72,PI/2,0,0));add(mk(cylG(hr*.17,hr*.17,.02,16),glowM(sp.trim),head,hr*.45,hr*1.55,hr*.82,PI/2,0,0));
   const hood=mk(capBack(hr*1.3,1.15,0,PI*.7,20,10),clothM(sp.top),head,0,hr*1.05,-hr*.12,0,0,0,1.12,1.08,1.05);add(hood);
   for(let i=0;i<6;i++){const a=PI*.6+i*PI*.16;add(mk(G('kc',()=>new T.ConeGeometry(hr*.16,hr*.4,4)),feltM(sp.skin),neck,Math.sin(a)*hr*.55,.05,Math.cos(a)*hr*.55,PI/2+.6,0,-Math.sin(a)*.4));}
  }
 }
 // ----- tail (Pinco)
 J.tail=[];if(sp.tail){let p=joint('tail0',hips,0,-.3,-sp.waist*.95);J.tail.push(p);const tm=skin;const n=8,L=.3;
  for(let i=0;i<n;i++){const rr=.06-i*.003;add(mk(capG(rr,L,8),tm,p,0,0,-L/2,PI/2,0,0));const nx=joint('tail'+(i+1),p,0,0,-L);p.rotation.x=i===0?.9:i<4?-.18:-.28;J.tail.push(nx);p=nx;}
  add(mk(sphG(.075,10,8),tm,p,0,0,0));}
 J.back=joint('back',chest,0,th*.6,-r*sp.chestZ);
 D.H=sp.H;return{root,J,D,B};}
function numTex(n,c1,c2){const k='num'+n+c1;if(TX[k])return TX[k];TX[k]=canvasTex(128,128,(g,w,h)=>{g.clearRect(0,0,w,h);g.font='bold 120px Arial Black,Arial';g.textAlign='center';g.textBaseline='middle';g.lineWidth=12;g.strokeStyle=c2;g.strokeText(n,64,70);g.fillStyle=c1;g.fillText(n,64,70);},{wrap:false,srgb:true});return TX[k];}

function buildPooh(){const root=new T.Group(),J={},D={},B=[];const add=m=>{B.push(m);return m;};
 const gold=feltM('#e8a634'),gold2=feltM('#f2c25e'),red=clothM('#c8262a'),brown=feltM('#3e2418');
 const lean=J.lean=joint('lean',root);const hips=J.hips=joint('hips',lean,0,1.0,0);
 add(mk(latheG('poohLo',[[0,-.2],[.55,-.14],[.82,.05],[.95,.35],[.97,.6],[.96,.95]],22),gold,hips));
 const chest=J.chest=joint('chest',hips,0,.95,0);
 add(mk(latheG('poohUp',[[.96,0],[.92,.3],[.82,.6],[.66,.82],[.45,.95],[.2,1.0]],22),gold,chest));
 add(mk(cylG(.985,.985,.16,24),clothM('#4a3020',.6),chest,0,0,0));add(mk(boxG(.24,.2,.06),chromeM(),chest,0,0,.98));
 // vest (open front)
 add(mk(sleeveG(.8,1.03,.82,18,.55,PI*2-.55),red,chest,0,.48,0));
 add(mk(sleeveG(.5,.8,.2,18,.62,PI*2-.62),red,chest,0,.98,0));
 for(const s of[-1,1]){add(mk(boxG(.03,.72,.03),glowM('#4ef0ff'),chest,s*.48,.45,.84,-.25,0,s*.12));add(mk(boxG(.16,.12,.05),metalM('#c9ced8'),chest,s*.55,.6,.78,-.2,s*.4,0));}
 add(mk(plateG(.28,.08,.04,.01),hazM(),chest,-.62,.25,.72,0,-.6,0));
 // honey canister on belt
 const can=grp(chest,.78,-.08,.5,0,.7,0);add(mk(cylG(.15,.15,.3,14),glassM('#ffa21a'),can));add(mk(cylG(.17,.17,.06,14),metalM('#555'),can,0,.17,0));add(mk(cylG(.17,.17,.06,14),metalM('#555'),can,0,-.17,0));
 // head
 const neck=J.neck=joint('neck',chest,0,.95,0);const head=J.head=joint('head',neck,0,.0,0);const hr=.8;
 add(mk(sphG(hr,26,18),gold,head,0,hr*.78,0,0,0,0,1.06,.94,.96));
 add(mk(sphG(.4,20,14),gold2,head,0,hr*.5,hr*.68,0,0,0,1.25,.85,.95));
 add(mk(sphG(.17,14,10),brown,head,0,hr*.68,hr*1.12,0,0,0,1.35,.85,1));
 add(mk(torG(.15,.03,6,16,PI),basicM('#4a1a12'),head,0,hr*.36,hr*1.06,-.25,0,PI));
 add(mk(sphG(.08,10,8),skinM('#e2606a'),head,0,hr*.27,hr*1.04,0,0,0,1.2,.7,.8));
 eyePair(head,hr*.34,hr*.95,hr*.85,.075,'#111111',null,{sz:.6});
 for(const s of[-1,1])add(mk(capG(.025,.12,6),brown,head,s*hr*.34,hr*1.15,hr*.83,0,0,PI/2+s*.25));
 for(const s of[-1,1]){const e=mk(sphG(.28,14,10),gold,head,s*hr*.68,hr*1.42,-.05,0,0,-s*.3,1,1,.55);add(e);mk(sphG(.18,12,8),feltM('#c8862a'),e,0,0,.1,0,0,0,1,1,.4);}
 // arms (stubby)
 for(const s of['R','L']){const sg=s==='R'?-1:1;const sh=J['sh'+s]=joint('sh'+s,chest,sg*.82,.6,0);sh.rotation.z=sg*.75;const el=J['el'+s]=joint('el'+s,sh,0,-.32,0);const hd=J['hd'+s]=joint('hd'+s,el,0,-.3,0);
  add(mk(capG(.22,.3,10),gold,sh,0,-.15,0));add(mk(sleeveG(.26,.27,.26,12),red,sh,0,-.06,0));add(mk(capG(.2,.25,10),gold,el,0,-.14,0));add(mk(sphG(.23,12,10),gold,hd,0,-.06,0,0,0,0,1,1.05,.85));}
 // floating shoes
 for(const s of['R','L']){const sg=s==='R'?-1:1;const sh=J['shoe'+s]=joint('shoe'+s,lean,sg*.45,.32,.08);const u=grp(sh);
  add(mk(sphG(1,16,10),clothM('#c8262a',.6),u,0,.06,.04,0,0,0,.22,.17,.36));add(mk(boxG(.44,.08,.74),clothM('#f2efe8',.7),u,0,-.07,.04));
  add(mk(sphG(1,12,8),clothM('#b38a2a',.6),u,0,.15,-.06,0,0,0,.16,.1,.18));add(mk(boxG(.3,.03,.4),glowM('#4ef0ff'),u,0,-.115,.04));
  J['ft'+s]=sh;}
 J.back=joint('back',chest,0,.5,-.88);J.tail=[];D.tp=[[1.05,-.05],[1.04,.3],[.95,.6],[.82,.85],[.55,1.0]];D.tz=1;D.pk='pooh';
 D.body='float';D.H=4.4;D.headR=hr;D.headC=new V3(0,hr*.78,0);D.chestR=.96;D.chestZ=1;D.waist=.96;D.torsoH=1.0;D.shX=.82;D.uLen=.32;D.fLen=.3;D.armR=.22;D.hand=.23;D.faceZ=hr*.92;D.eyeY=hr*.95;D.ears=1;
 return{root,J,D,B};}

function buildBean(){const root=new T.Group(),J={},D={},B=[];const add=m=>{B.push(m);return m;};
 const green=feltM('#9fc23a'),dark=feltM('#7d9c2a');
 const lean=J.lean=joint('lean',root);const hips=J.hips=joint('hips',lean,0,1.55,0);
 add(mk(latheG('beanLo',[[0,-1.42],[.22,-1.36],[.46,-1.18],[.64,-.85],[.73,-.45],[.75,0]],22),green,hips));
 const chest=J.chest=joint('chest',hips,0,0,0);
 add(mk(latheG('beanUp',[[.75,0],[.75,.5],[.72,1.05],[.64,1.5],[.5,1.85],[.28,2.08],[0,2.16]],22),green,chest));
 add(mk(cylG(.77,.77,.2,22),clothM('#26272c',.6),chest,0,.02,0));add(mk(sleeveG(.775,.775,.12,22,-.9,.9),hazM(),chest,0,.02,0));
 for(let y=-1.1;y<1.9;y+=.16)add(mk(boxG(.012,.07,.012),basicM('#d8e88a'),chest,0,y,y<0?(.75-Math.max(0,(-y-.4))*.4):(.75-Math.max(0,y-1.0)*.35)));
 const neck=J.neck=joint('neck',chest,0,1.1,0);const head=J.head=joint('head',neck,0,0,0);
 // face on pod front (pod radius ~.72 here)
 for(const s of[-1,1]){mk(sphG(.075,12,10),basicM('#121212'),head,s*.2,.22,.68,0,0,0,1,1.4,.5);mk(sphG(.018,6,4),basicM('#ffffff'),head,s*.2-.02,.26,.71);}
 add(mk(torG(.13,.022,6,14,PI),basicM('#1c2410'),head,0,-.04,.7,-.2,0,PI));
 add(mk(boxG(.1,.11,.04),skinM('#fbf7ea'),head,0,-.16,.69,-.1,0,0));
 // beanie (hidden when a helmet is fitted)
 const bn=J.beanie=grp(head,0,.55,0);const knit=clothM('#5a5c62',.95);
 add(mk(latheG('beanie',[[.7,0],[.68,.3],[.58,.55],[.38,.72],[0,.78]],20),knit,bn,0,0,0));add(mk(torG(.7,.07,8,24),knit,bn,0,.02,0,PI/2,0,0));add(mk(torG(.715,.025,4,28),glowM('#4ef0ff'),bn,0,.1,0,PI/2,0,0));
 add(mk(cylG(.03,.03,.3,8),chromeM(),bn,0,.9,0));add(mk(sphG(.06,8,6),metalM('#555'),bn,0,1.06,0));
 // stalk + tail
 add(mk(tubeG('beanStalk',[[-.3,1.75,-.1],[-.75,2.1,-.15],[-1.0,2.6,-.1],[-.85,3.0,0],[-.6,2.95,.05]],.11,24,8),green,chest));
 const tl=J.tailRoot=joint('tail0',hips,.05,-1.35,0);add(mk(tubeG('beanTail',[[0,0,0],[.35,-.12,0],[.75,.0,0],[.95,.3,0],[.85,.55,0]],.1,20,8),green,tl));J.tail=[tl];
 // pylons (weapon mounts) - joints for "arms"
 for(const s of['R','L']){const sg=s==='R'?-1:1;const sh=J['sh'+s]=joint('sh'+s,chest,sg*.74,.45,0);const el=J['el'+s]=joint('el'+s,sh,0,-.28,0);const hd=J['hd'+s]=joint('hd'+s,el,0,-.22,0);}
 J.back=joint('back',chest,0,.6,-.72);D.tp=[[.75,0],[.75,.5],[.72,1.05],[.64,1.5],[.5,1.85],[.28,2.08]];D.lp=[[.46,-1.18],[.64,-.85],[.73,-.45],[.75,0]];D.tz=1;D.pk='bean';
 D.body='pod';D.H=4.6;D.headR=.72;D.headC=new V3(0,.2,0);D.chestR=.75;D.chestZ=1;D.waist=.75;D.torsoH=1.1;D.shX=.74;D.uLen=.28;D.fLen=.22;D.armR=.12;D.hand=.1;D.faceZ=.7;D.eyeY=.22;
 return{root,J,D,B};}
function buildBody(id){const sp=SPEC[id]||SPEC.pinco;const b=sp.type==='pooh'?buildPooh():sp.type==='bean'?buildBean():buildHuman(id,sp);
 b.root.updateMatrixWorld(true);const bx=new T.Box3();for(const m of b.B){if(m.geometry){m.geometry.computeBoundingBox&&!m.geometry.boundingBox&&m.geometry.computeBoundingBox();const bb=m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld);bx.union(bb);}}
 const s=sp.H/Math.max(.5,bx.max.y);b.root.scale.setScalar(s);b.D.scale=s;b.D.top=bx.max.y;return b;}
// ---------------- ARMOR FITTING ----------------
function plate2M(c){return M('p2'+hex(c),()=>{const m=plateM(c).clone();m.side=T.DoubleSide;return m;});}
function profR(prof,y){if(y<=prof[0][1])return prof[0][0];for(let i=1;i<prof.length;i++){if(y<=prof[i][1]){const a=prof[i-1],b=prof[i];return lerp(a[0],b[0],(y-a[1])/(b[1]-a[1]||1));}}return prof[prof.length-1][0];}
// plate that follows a body profile (lathe), from y0..y1, offset off from the surface, thickness t, arc a0..a1 (0 = front), chamfered top/bottom
function wrapG(pk,prof,y0,y1,off,t,a0,a1,seg,steps){steps=steps||3;return G(`w${pk},${r3(y0)},${r3(y1)},${r3(off)},${r3(t)},${r3(a0)},${r3(a1)},${seg},${steps}`,()=>{const pts=[],c=Math.min(t*.9,(y1-y0)*.2);
 pts.push(new T.Vector2(profR(prof,y0)+off,y0));for(let i=0;i<=steps;i++){const y=lerp(y0+c,y1-c,i/steps);pts.push(new T.Vector2(profR(prof,y)+off+t,y));}
 pts.push(new T.Vector2(profR(prof,y1)+off,y1));for(let i=steps-1;i>=1;i--){const y=lerp(y0,y1,i/steps);pts.push(new T.Vector2(profR(prof,y)+off,y));}pts.push(pts[0].clone());
 const g=new T.LatheGeometry(pts,seg||8,a0,a1-a0);g.computeVertexNormals();return g;});}
const cprof=(r)=>[[r,-10],[r,10]];
function fitArmor(body,load,paint,o){o=o||{};const{J,D}=body;const S={noz:[]};const pk=D.pk||'x';
 const part=s=>load&&load[s]?PARTS[load[s]]:null;
 const C={p:paint.p,s:paint.s,a:paint.a,g:paint.g};
 const PL=plateM(C.p),PL2=plate2M(C.p),FR=metalM(C.s),FR2=plate2M(C.s),AC=plateM(C.a),GL=glowM(C.g),GS=glassM(C.g),CH=chromeM(),RB=rubberM(),HZ=hazM(),VT=ventM(),DK=metalM('#1a1c21');
 const A=[];const reg=m=>{A.push(m);return m;};
 // --- building blocks
 const plate=(p,w,h,d,m,x,y,z,rx,ry,rz,c)=>reg(mk(plateG(w,h,d,c),m||PL,p,x,y,z,rx,ry,rz));
 const box=(p,w,h,d,m,x,y,z,rx,ry,rz)=>reg(mk(boxG(w,h,d),m||FR,p,x,y,z,rx,ry,rz));
 const cyl=(p,rt,rb,h,m,x,y,z,rx,ry,rz,seg)=>reg(mk(cylG(rt,rb,h,seg||10),m||FR,p,x,y,z,rx,ry,rz));
 const bolt=(p,x,y,z,rx,ry,rz,r)=>reg(mk(cylG(r||.035,r||.035,.03,6),CH,p,x,y,z,rx==null?PI/2:rx,ry||0,rz||0));
 const boltRow=(p,n,x0,x1,y,z,ry)=>{for(let i=0;i<n;i++)bolt(p,lerp(x0,x1,n<2?.5:i/(n-1)),y,z,PI/2,ry||0,0);};
 const piston=(p,a,b,r)=>{r=r||.05;const d=new V3().subVectors(b,a),L=d.length();const g=grp(p);g.position.copy(a);g.quaternion.setFromUnitVectors(_up,d.clone().normalize());
  reg(mk(cylG(r,r,L*.55,8),DK,g,0,L*.275,0));reg(mk(cylG(r*.55,r*.55,L*.5,8),CH,g,0,L*.72,0));reg(mk(cylG(r*1.3,r*1.3,.05,8),FR,g,0,0,0));return g;};
 const cable=(p,pts,r,key)=>reg(mk(tubeG(key,pts,r||.025,14,5),RB,p));
 const haz=(p,w,h,x,y,z,rx,ry,rz)=>reg(mk(plateG(w,h,.025,Math.min(w,h)*.15),HZ,p,x,y,z,rx,ry,rz));
 const decal=(p,w,i,x,y,z,rx,ry,rz)=>reg(mk(planeG(w,w*.375),decalM(i),p,x,y,z,rx,ry,rz));
 const vent=(p,w,h,x,y,z,rx,ry,rz)=>reg(mk(plateG(w,h,.03,.01),VT,p,x,y,z,rx,ry,rz));
 const glow=(p,w,h,d,x,y,z,rx,ry,rz)=>reg(mk(boxG(w,h,d),GL,p,x,y,z,rx,ry,rz));
 const wrap=(p,prof,key,y0,y1,off,t,a0,a1,m,seg,sz)=>{const w=reg(mk(wrapG(key,prof,y0,y1,off,t,a0,a1,seg),m||PL2,p));if(sz)w.scale.z=sz;return w;};
 const nozzle=(p,x,y,z,r,len,rx,rz)=>{const g=grp(p,x,y,z,rx||0,0,rz||0);reg(mk(cylG(r*.75,r,len,10,true),M('nzM',()=>{const m=metalM('#3a3d44').clone();m.side=T.DoubleSide;return m;}),g,0,-len/2,0));
  reg(mk(cylG(r*.8,r*.8,.02,10),GL,g,0,-len*.8,0));reg(mk(torG(r,.025,4,10),DK,g,0,-len,0,PI/2,0,0));const s=grp(g,0,-len-.05,0);S.noz.push(s);return g;};
 const isHum=D.body==='hum',isFloat=D.body==='float',isPod=D.body==='pod';
 const tp=D.tp,tz=D.tz||1,th=D.torsoH;
 // ================= CORE =================
 const core=part('core');
 if(core){const sh=core.shape,ch=J.chest;
  if(isPod){// belt band + chest plate on the pod
   wrap(ch,tp,pk+'c',-.16,.2,.03,.07,0,PI*2,FR2,12);haz(ch,.7,.1,0,.02,.86,0,0,0);
   const top=sh==='bastion'||sh==='cathedral'?1.0:.8;wrap(ch,tp,pk+'f'+sh,.25,top,.02,.09,-1.0,1.0,PL2,6);
   wrap(ch,tp,pk+'bk',.25,.95,.02,.08,PI-1.1,PI+1.1,PL2,6);
   if(sh==='rivet'||sh==='cathedral'){reg(mk(cylG(.14,.14,.06,12),GL,ch,0,.55,.86,PI/2,0,0));reg(mk(torG(.16,.04,6,12),DK,ch,0,.55,.86));}
   else{vent(ch,.34,.16,0,.55,.86,-.05,0,0);}
   boltRow(ch,4,-.5,.5,.3,.82);decal(ch,.3,1,.32,.75,.78,0,.38,0);
   if(sh==='brig'||sh==='quilt'){wrap(ch,tp,pk+'sl',.75,.92,.02,.1,-1.2,1.2,PL2,6);}
   if(sh==='bastion'){for(const s of[-1,1])plate(ch,.12,.6,.36,PL,s*.8,.55,0,0,0,s*.1);}
  }else{
   const off=isFloat?.0:.015;const fr=isFloat?-.85:-1.05,fr2=-fr;const ytop=isFloat?.82:th*.9,ybot=isFloat?.08:th*.18;
   const thick={patch:.08,quilt:.08,brig:.08,rivet:.09,bastion:.13,cathedral:.1}[sh]||.08;
   if(sh==='quilt'){for(const[y0,y1]of[[ybot,lerp(ybot,ytop,.48)],[lerp(ybot,ytop,.52),ytop]])for(const[a0,a1]of[[fr,-.04],[.04,fr2]])wrap(ch,tp,pk+'q'+y0+a0,y0,y1,off,thick,a0,a1,PL2,4,tz);}
   else if(sh==='brig'){const n=4;for(let i=0;i<n;i++){const y0=lerp(ybot,ytop,i/n),y1=lerp(ybot,ytop,(i+.86)/n);wrap(ch,tp,pk+'b'+i,y0,y1,off+i*.012,thick,fr-.15,fr2+.15,i%2?PL2:FR2,8,tz);}}
   else wrap(ch,tp,pk+'f'+sh,ybot,ytop,off,thick,fr,fr2,PL2,isFloat?8:6,tz);
   // back plate + abdomen
   wrap(ch,tp,pk+'bk'+sh,ybot+.05,ytop,off,thick*.9,PI-1.15,PI+1.15,PL2,6,tz);
   if(isHum)wrap(ch,tp,pk+'ab',-.12,ybot-.03,off,.07,-.75,.75,FR2,4,tz);
   const fz=(profR(tp,(ybot+ytop)/2)+off+thick)*tz;const my=(ybot+ytop)/2;
   // collar ring
   if(isHum){const nr=profR(tp,th*.92);wrap(ch,[[nr+.02,th*.84],[nr*.8,th*1.02]],pk+'col'+sh,th*.84,th*1.02,0,sh==='bastion'?.12:.07,0,PI*2,FR2,10);}
   // details per shape
   if(sh==='patch'){for(const s of[-1,1])box(ch,.07,ytop-ybot,.05,RB,s*.22*tz,my,fz*.98,-.08,0,s*.35);boltRow(ch,3,-.22,.22,ytop-.08,fz*.97);decal(ch,.32,0,.2,my+.05,fz+.01,0,.25,0);}
   if(sh==='quilt'){boltRow(ch,4,-.3,.3,my,fz*.99);decal(ch,.3,4,-.2,ybot+.12,fz*.98+.01,0,-.2,0);}
   if(sh==='brig'){decal(ch,.3,2,.22,ytop-.12,fz+.03,0,.25,0);haz(ch,.42,.08,0,ybot+.04,fz*.98,0,0,0);}
   if(sh==='rivet'){const g=grp(ch,0,my+.05,fz);reg(mk(cylG(.2,.22,.08,12),DK,g,0,0,0,PI/2,0,0));reg(mk(cylG(.15,.15,.05,12),GL,g,0,0,.04,PI/2,0,0));reg(mk(torG(.2,.035,6,12),CH,g,0,0,.05));
    for(let i=0;i<6;i++){const a=i/6*PI*2;bolt(g,Math.cos(a)*.27,Math.sin(a)*.27,.02);}decal(ch,.26,6,-.24,ytop-.1,fz*.96,0,-.3,0);}
   if(sh==='bastion'){vent(ch,.4,.18,0,ybot+.14,fz+.0,-.06,0,0);for(const s of[-1,1])plate(ch,.16,(ytop-ybot)*.85,.42,PL,s*(profR(tp,my)+.12),my,0,0,0,s*.08);
    haz(ch,.5,.09,0,ytop-.05,fz*.97,0,0,0);boltRow(ch,5,-.34,.34,my+.05,fz*.99);decal(ch,.3,5,-.18,my-.12,fz+.01,0,-.15,0);}
   if(sh==='cathedral'){for(const s of[-1,1]){glow(ch,.03,(ytop-ybot)*.75,.02,s*.1,my,fz+.01);plate(ch,.08,(ytop-ybot)*.9,.12,FR,s*.2,my,fz*.97);}
    vent(ch,.16,.3,0,my,fz*.99);wrap(ch,tp,pk+'cat2',ytop-.05,ytop+.08,off+thick,.06,-.6,.6,FR2,6,tz);decal(ch,.3,7,.26,ybot+.1,fz*.96,0,.3,0);}
   // cables chest -> arms
   if(isHum&&(sh==='rivet'||sh==='cathedral'||sh==='bastion')){for(const s of[-1,1])cable(ch,[[s*.18,my+.1,fz],[s*.38,ytop,fz*.7],[s*D.shX*.9,th*.85,.1]],.025,pk+'cb'+s+sh);}
   S.chestF=grp(ch,0,my,fz);
  }}
 S.center=grp(J.chest,0,isPod?.5:th*.55,0);
 // ================= HEAD =================
 const hp=part('head');
 if(hp){const h=J.head,hr=D.headR,c=D.headC,sh=hp.shape;
  if(isPod){if(J.beanie)J.beanie.visible=false;const top=grp(h,0,0,0);
   wrap(top,tp.map(q=>[q[0],q[1]-1.1]),pk+'hm'+sh,.45,1.02,.02,.08,0,PI*2,PL2,10);reg(mk(sphSegG(.52,0,PI*2,0,PI*.5,8,3),PL,top,0,1.0,0,0,0,0,1,.45,1));
   wrap(top,tp.map(q=>[q[0],q[1]-1.1]),pk+'vz',.12,.34,.04,.04,-1.1,1.1,GS,10);wrap(top,tp.map(q=>[q[0],q[1]-1.1]),pk+'vzf',.34,.42,.03,.06,-1.25,1.25,FR2,10);
   haz(top,.4,.07,0,.62,.8,-.15,0,0);
   S.headTop=grp(top,0,1.25,0);
  }else{const eared=!!D.ears;const g=grp(h,c.x,c.y,c.z);const R=hr*1.1;const sx=eared?(isFloat?.58:.62):1.0;
   // faceted helmet shell: top + back
   reg(mk(sphSegG(R,0,PI*2,0,PI*.36,10,3),PL,g,0,0,0,0,0,0,sx,1,1.0));
   if(!eared)reg(mk(capBack(R*1.0,1.0,PI*.3,PI*.62,10,3),PL2,g,0,0,0,0,0,0,1,1,1));
   else{reg(mk(capBack(R*.98,1.1,PI*.36,PI*.64,10,3),PL2,g,0,0,0));reg(mk(shellG(R*.93,.06,-PI,PI,R*.16,12),FR2,g,0,R*.36,0));}
   // brow band + visor
   const eyeY=D.eyeY-c.y;
   if(isFloat){// Pooh: visor flipped UP on the brow so his face stays friendly
    const v=grp(g,0,0,0,-.72,0,0);reg(mk(shellG(R*.97,.05,-.8,.8,R*.24,8),FR2,v,0,eyeY,0));reg(mk(shellG(R*1.0,.025,-.7,.7,R*.15,8),GS,v,0,eyeY,0));
    for(const s of[-1,1])cyl(g,.09,.09,.1,DK,s*R*.62,eyeY+.05,R*.62,0,0,PI/2);
   }else{const vr=Math.max(D.faceZ+.02,hr*1.02);const vw=sh==='visor'?1.25:1.0;
    reg(mk(shellG(vr,.03,-vw,vw,hr*(sh==='visor'?.34:.24),10),GS,g,0,eyeY,0));
    reg(mk(shellG(vr+.005,.06,-vw-.12,vw+.12,hr*.1,10),FR2,g,0,eyeY+hr*(sh==='visor'?.2:.15),0));
    if(!eared||sh==='visor')for(const s of[-1,1]){plate(g,.08,hr*.6,hr*.55,FR,s*R*.98*sx,eyeY-hr*.15,-.02,0,0,0);bolt(g,s*R*1.03*sx,eyeY-hr*.1,0,0,0,PI/2);}
   }
   haz(g,R*.5*sx,.07,0,R*.55,R*.62,-.85,0,0);decal(g,R*.5,3,0,R*.78,R*.45,-1.05,0,0);
   if(sh==='cap'){plate(g,R*.9*sx,.05,R*.55,FR,0,R*.42,R*.75,-.12,0,0,.04);}
   if(sh==='fin'){plate(g,.05,R*.55,R*1.1,AC,0,R*1.0,-R*.15,.2,0,0,.08);reg(mk(cylG(.012,.012,R*.8,4),CH,g,R*.35*sx,R*1.05,-R*.3,-.3,0,0));}
   if(sh==='horns'){for(const s of[-1,1]){const hn=reg(mk(trapG(.14,.03,R*.85,.08),AC,g,s*R*.55*sx,R*.85,R*.25,-.6,s*.2,-s*.55));}plate(g,R*1.0*sx,.12,.1,FR,0,R*.48,R*.72,-.5,0,0,.04);}
   if(sh==='cluster'){const cg=grp(g,-R*.82*sx,eyeY+hr*.15,R*.25);box(cg,.16,.3,.3,FR,0,0,0);for(let i=0;i<3;i++){reg(mk(cylG(.055,.055,.06,10),GL,cg,-.04,-.08+i*.09,.16,PI/2,0,0));}
    reg(mk(cylG(.01,.01,R*.7,4),CH,g,R*.4*sx,R*1.0,-R*.2,-.2,0,.2));}
   if(sh==='halo'){// crown sensor array (no halo): spikes + rear dish
    for(let i=0;i<6;i++){const a=PI*(.25+i*.3);const x=Math.sin(a)*R*.55*sx,z=-Math.cos(a)*R*.55;reg(mk(G('spk',()=>new T.ConeGeometry(.04,.32,4)),FR,g,x,R*.9,z,0,0,0));reg(mk(sphG(.03,6,4),GL,g,x,R*1.07,z));}
    const d=grp(g,0,R*.55,-R*1.0,.4,0,0);reg(mk(cylG(R*.38,R*.2,.08,10),FR,d,0,0,0,PI/2,0,0));reg(mk(cylG(.03,.03,R*.3,4),CH,d,0,0,R*.1,PI/2,0,0));}
   S.headTop=grp(g,0,R,0);}
 }
 // ================= ARMS =================
 const ap=part('arms');
 for(const sd of['R','L']){const sg=sd==='R'?-1:1;const sh=J['sh'+sd],el=J['el'+sd],hd=J['hd'+sd];
  if(isPod){// weapon pylons (Bean has no arms): bracket on the pod side + hydraulic boom
   const br=grp(J.chest,sg*.6,.45,0);plate(br,.18,.42,.42,FR,sg*.1,0,0);bolt(br,sg*.2,.12,.12,0,0,PI/2);bolt(br,sg*.2,-.12,.12,0,0,PI/2);
   const big=ap&&['piston','board','atlas'].includes(ap.shape);const boom=box(sh,.12,.12,.36,ap?PL:FR,0,-.06,.05);plate(el,.16,.2,.26,ap?PL:FR,0,-.02,.08);
   if(ap){piston(br,new V3(sg*.12,-.18,-.05),new V3(sg*.18,-.32,.12),.035);if(big)plate(sh,.06,.3,.42,AC,sg*.09,.02,.05);if(ap.shape==='spool')reg(mk(torG(.1,.025,5,10),CH,el,0,-.02,.08,0,PI/2,0));}
   continue;}
  if(!ap)continue;const s=ap.shape;const ar=D.armR,ul=D.uLen,fl=D.fLen;
  const heavy=s==='board'||s==='atlas'||s==='piston';
  // pauldron
  const pg=grp(sh,sg*ar*.25,ar*.3,0);const pw=isFloat?ar*2.3:ar*(s==='board'?3.6:s==='feather'?2.1:2.7);
  reg(mk(sphSegG(pw*.62,0,PI*2,0,PI*.5,7,3),PL,pg,0,0,0,0,0,0,1.1,s==='board'?.55:.75,1.05));
  plate(pg,pw*.9,pw*.55,.08,PL,sg*pw*.45,-pw*.2,0,0,PI/2,sg*.35);if(s==='board'){plate(pg,pw*1.1,.1,pw*1.15,AC,sg*pw*.15,pw*.3,0,0,0,sg*.3);haz(pg,pw*.6,.06,sg*pw*.55,-pw*.05,0,0,sg*PI/2,sg*.35);}
  if(!isFloat)decal(pg,pw*.6,5+(sd==='R'?0:1),sg*(pw*.5+.045),-pw*.15,0,0,sg*PI/2,0);
  // upper arm + elbow + gauntlet
  if(!isFloat)wrap(sh,cprof(ar),pk+'ua'+s,-ul*.85,-ul*.3,.02,.05,0,PI*2,PL2,7);
  reg(mk(sphSegG(ar*1.25,0,PI*2,0,PI*.6,6,3),FR,el,0,0,0,PI/2,0,0,1,1,1));
  const gr=isFloat?ar*1.0:ar*(heavy?1.12:.95);const gl=isFloat?fl*1.1:fl*.82;
  wrap(el,[[gr*.95,-gl],[gr*1.2,-gl*.3],[gr*1.0,0]],pk+'ga'+s+gr,-gl,-.04,.02,heavy?.09:.06,0,PI*2,PL2,7);
  plate(hd,D.hand*1.5,.06,D.hand*1.3,FR,0,-D.hand*.2,D.hand*.55,-PI/2+.2,0,0,.03);
  haz(el,gr*1.1,.05,0,-gl*.55,gr*1.22,0,0,0);
  if(s==='spool'){for(let i=0;i<3;i++)reg(mk(torG(gr*1.25,.035,6,12),CH,el,0,-gl*(.3+i*.2),0,PI/2,0,0));}
  if(s==='piston'||s==='atlas'){piston(el,new V3(sg*gr*1.15,-gl*.85,-.02),new V3(sg*gr*1.3,-.05,-.04),.05);piston(sh,new V3(sg*ar*1.3,-ul*.2,-.08),new V3(sg*ar*1.2,-ul*.95,-.06),.045);}
  if(s==='atlas'){reg(mk(cylG(ar*.9,ar*.9,.16,10),DK,el,sg*ar*1.0,0,0,0,0,PI/2));reg(mk(cylG(ar*.5,ar*.5,.18,10),GL,el,sg*ar*1.0,0,0,0,0,PI/2));plate(el,gr*2.4,gl*.55,.08,PL,0,-gl*.5,gr*1.15,0,0,0);}
  if(s==='feather'){for(let i=0;i<3;i++)plate(el,.04,gl*.8,gr*.6,DK,sg*gr*1.15,-gl*.45,-.06+i*.07,0,0,0);}
  if(s==='clamp'){for(const y of[-gl*.25,-gl*.75])reg(mk(torG(gr*1.15,.025,4,10),DK,el,0,y,0,PI/2,0,0));}
  if(isFloat)plate(sh,ar*1.8,ar*.9,.08,PL,0,-ul*.4,ar*.9,0,0,0);
 }
 // ================= LEGS =================
 const lp=part('legs');
 if(lp){const s=lp.shape;
  if(isFloat){// Pooh: thruster housings bolted to the floating shoes (the shoes stay visible)
   for(const sd of['R','L']){const sg=sd==='R'?-1:1;const u=grp(J['shoe'+sd]);
    const big=s==='anvil'?1.25:s==='sprint'?.85:1;
    plate(u,.5*big,.16,.42*big,FR,0,-.15,-.12,0,0,0);plate(u,.12,.24*big,.5*big,PL,sg*.27*big,0,-.06,0,0,0);
    nozzle(u,0,-.22,-.22,.1*big,.16);nozzle(u,0,-.22,.12,.08*big,.14);reg(mk(torG(.2*big,.03,4,12),DK,u,0,.18,-.22,PI/2,0,0));
    if(s==='skate'){for(const z of[-.25,.3])reg(mk(cylG(.08,.08,.5,10),DK,u,0,-.28,z,0,0,PI/2));}
    if(s==='coil'){for(let i=0;i<3;i++)reg(mk(torG(.16,.025,5,12),CH,u,0,.28+i*.07,-.22,PI/2,0,0));}
    if(s==='cloud')reg(mk(torG(.34,.03,4,20),GL,u,0,-.24,0,PI/2,0,0));
    if(s==='anvil')plate(u,.56,.1,.62,AC,0,-.04,.05,0,0,0);
    haz(u,.3,.06,0,-.08,.12*big+.2,0,0,0);}
  }else if(isPod){const lp2=D.lp;const ch=J.hips;
   for(let i=0;i<4;i++){const a=i*PI/2;wrap(ch,lp2,pk+'sk'+i+s,-1.0,-.12,.02,s==='anvil'?.12:.08,a-.6,a+.6,PL2,4);}
   wrap(ch,lp2,pk+'skb',-.12,0,.03,.06,0,PI*2,FR2,12);haz(ch,.5,.08,0,-.5,.82,-.1,0,0);
   const tr=J.tailRoot;if(tr){const ng=grp(tr,.85,.6,0);reg(mk(cylG(.14,.14,.24,10),FR,ng,0,0,0));nozzle(ng,0,.05,0,.12,.2,PI,0);}
   for(const s2 of[-1,1])nozzle(ch,s2*.42,-1.0,-.32,.1,.16,-.3,s2*.2);
  }else{const tr=D.thR,lr=D.legR,thL=D.th,shL=D.sh,f=D.foot;
   const heavy=s==='anvil',slim=s==='sprint';
   for(const sd of['R','L']){const sg=sd==='R'?-1:1;const th2=J['th'+sd],kn=J['kn'+sd],ft=J['ft'+sd];
    // thigh: front + outer plate (inner thigh stays bare)
    wrap(th2,cprof(tr),pk+'th'+s+sd,-thL*.85,-thL*.38,.02,heavy?.09:.06,sg>0?-.7:-2.07,sg>0?2.07:.7,PL2,6);
    // knee cap
    const kg=grp(kn,0,0,lr*1.2);reg(mk(sphSegG(lr*1.6,0,PI*2,0,PI*.5,6,3),PL,kg,0,0,0,PI/2,0,0,1,1,.7));bolt(kg,0,0,lr*1.1);
    // shin greave (front arc, tapered)
    const gR=lr*(heavy?1.5:slim?1.05:1.25);wrap(kn,[[gR*1.0,-shL*.92],[gR*1.15,-shL*.55],[gR*1.05,-shL*.1]],pk+'sh'+s+gR,-shL*.88,-shL*.12,.02,heavy?.1:.07,-1.25,1.25,PL2,6);
    wrap(kn,[[gR*.95,-shL*.9],[gR*1.0,-shL*.15]],pk+'cf'+s,-shL*.8,-shL*.2,.02,.05,PI-.7,PI+.7,FR2,4);
    haz(kn,gR*1.2,.05,0,-shL*.32,gR*1.3,0,0,0);
    piston(kn,new V3(sg*gR*1.05,-shL*.85,-gR*.4),new V3(sg*gR*1.0,-shL*.2,-gR*.6),.04);
    // sabaton: armour over the heel/instep, toes stay visible
    const fy=-D.hipY+thL+shL;const sb=grp(ft,0,0,0);
    reg(mk(sphSegG(1,PI/2+.9,PI*2-1.8,0,PI*.5,8,3),PL2,sb,0,fy+f[1]*.9,f[2]*.3,0,0,0,f[0]*1.18,f[1]*1.6,f[2]*1.05));
    plate(sb,f[0]*1.7,.07,f[2]*.9,FR,0,fy+f[1]*1.75,f[2]*.25,.12,0,0,.03);
    if(heavy){plate(sb,f[0]*2.5,.14,f[2]*2.3,DK,0,fy+.05,f[2]*.4,0,0,0,.05);plate(kn,gR*2.4,shL*.4,.1,PL,0,-shL*.6,gR*1.3,0,0,0);}
    if(slim){plate(kn,.05,shL*.7,.14,CH,0,-shL*.55,-gR*1.15,.2,0,0,.02);}
    if(s==='coil'){for(let i=0;i<4;i++)reg(mk(torG(gR*1.3,.03,5,12),CH,kn,0,-shL*(.3+i*.15),0,PI/2,0,0));}
    if(s==='skate'){for(const z of[-.15,.15])reg(mk(cylG(.09,.09,.08,12),DK,sb,0,fy-.04,f[2]*.4+z*f[2]*2.2,0,0,PI/2));box(sb,.05,.05,f[2]*2,GL,0,fy-.02,f[2]*.4);}
    if(s==='cloud'){reg(mk(torG(gR*1.6,.03,4,18),GL,kn,0,-shL*.95,0,PI/2,0,0));for(const s3 of[-1,1])plate(kn,.04,.3,.25,AC,s3*gR*1.5,-shL*.85,-.05,0,0,s3*.3);}
    nozzle(ft,0,fy+f[1]*1.6,-f[2]*.55,.06,.1,-.6,0);
   }
   // hip skirt plates
   for(const s2 of[-1,1])wrap(J.hips,cprof(D.waist*1.12),pk+'hip'+s2,-.42,-.05,.02,.06,s2>0?.6:-PI*.62-.0,s2>0?PI*.62:-.6,PL2,4,.82);
  }}
 // ================= BOOSTER =================
 const bo=part('booster');
 if(bo){const s=bo.shape,b=J.back;const W=isFloat?1.6:isPod?1.3:1.35;const g=grp(b,0,0,0);g.scale.setScalar(W);
  plate(g,.5,.55,.18,FR,0,0,-.06);vent(g,.3,.2,0,.05,-.16);
  if(s==='puff'){box(g,.42,.36,.3,PL,0,-.05,-.26);nozzle(g,0,-.26,-.3,.12,.2);decal(g,.3,1,0,.08,-.42,0,PI,0);}
  if(s==='hornet'){for(const sg of[-1,1]){const w=grp(g,sg*.32,.05,-.25,0,0,sg*.4);reg(mk(capG(.13,.4,8),PL,w,0,0,0));plate(w,.04,.5,.35,AC,sg*.14,.12,0,0,0,sg*.2);nozzle(w,0,-.3,0,.1,.18);}}
  if(s==='kettle'){for(const sg of[-1,1]){const t=grp(g,sg*.24,.02,-.28);reg(mk(capG(.17,.42,10),PL,t,0,0,0));haz(t,.2,.06,0,.12,.0,0,sg*.0,0);reg(mk(torG(.175,.02,4,12),DK,t,0,-.1,0,PI/2,0,0));}
   nozzle(g,0,-.34,-.3,.12,.18);cable(g,[[-.24,.3,-.28],[0,.42,-.2],[.24,.3,-.28]],.03,'kettleC');}
  if(s==='comet'){for(const sg of[-1,1]){const t=grp(g,sg*.2,.12,-.3,.12,0,0);reg(mk(cylG(.1,.12,.9,10),PL,t,0,0,0));reg(mk(cylG(.13,.13,.1,10),AC,t,0,.3,0));nozzle(t,0,-.45,0,.11,.2);}}
  if(s==='wildfire'){const fr=grp(g,0,.05,-.28);for(let i=0;i<6;i++){const a=PI*(-.42+i*.168);const x=Math.sin(a)*.5,y=Math.cos(a)*.5-.25;const u=grp(fr,x,y,0,0,0,-a*.5);box(u,.14,.24,.2,PL,0,0,0);nozzle(u,0,-.14,0,.07,.12);}
   box(fr,.9,.08,.12,DK,0,.18,0);haz(fr,.6,.06,0,.24,-.07,0,PI,0);}
 }
 // ================= GENERATOR =================
 const gp=part('gen');
 if(gp){const s=gp.shape;const g=isPod?grp(J.chest,0,-.3,-.74):isFloat?grp(J.chest,.0,.15,-.98):grp(J.chest,0,th*.12,-(profR(tp,th*.12)*tz+.08));
  if(s==='pocket'){box(g,.3,.18,.14,PL,0,0,-.02);glow(g,.2,.03,.02,0,0,-.1);}
  if(s==='teapot'){reg(mk(capG(.11,.25,8),FR,g,0,0,-.08,0,0,PI/2));glow(g,.25,.03,.03,0,0,-.2);bolt(g,.2,0,-.08,0,0,PI/2);}
  if(s==='spindle'){for(let i=0;i<3;i++){reg(mk(cylG(.08,.08,.14,8),i===1?GS:FR,g,(i-1)*.17,0,-.1,0,0,0));}}
  if(s==='lantern'){reg(mk(cylG(.1,.1,.26,10),GS,g,0,0,-.12,0,0,PI/2));for(const x of[-.15,.15])reg(mk(cylG(.12,.12,.04,10),DK,g,x,0,-.12,0,0,PI/2));}
  if(s==='sun'){reg(mk(sphG(.11,12,8),GL,g,0,0,-.14));for(let i=0;i<3;i++)reg(mk(torG(.15,.02,4,12),DK,g,0,0,-.14,i,i*.8,0));}
 }
 // ================= FCS =================
 const fp=part('fcs');
 if(fp){const s=fp.shape;const at=isPod?grp(J.head,.45,.6,-.2):grp(J.chest,(isFloat?.55:D.shX*.55),isFloat?.82:th*.97,-.1);
  if(s==='peep'){box(at,.12,.12,.2,FR,0,.06,0);reg(mk(cylG(.04,.04,.03,8),GL,at,0,.06,.11,PI/2,0,0));}
  if(s==='magpie'){box(at,.14,.08,.14,FR,0,.04,-.05);for(let i=0;i<3;i++)reg(mk(cylG(.008,.012,.5+i*.12,4),CH,at,-.04+i*.04,.3+i*.06,-.08,-.15,0,(i-1)*.15));}
  if(s==='needle'){reg(mk(cylG(.045,.06,.5,8),FR,at,0,.1,.12,PI/2,0,0));reg(mk(cylG(.04,.04,.02,8),GL,at,0,.1,.38,PI/2,0,0));box(at,.1,.1,.12,DK,0,.06,-.08);}
  if(s==='oracle'){const d=grp(at,0,.3,-.15,-.4,0,0);reg(mk(cylG(.2,.05,.08,10),FR,d,0,0,0,0,0,0));reg(mk(cylG(.01,.01,.28,4),CH,at,0,.12,-.1));reg(mk(sphG(.03,6,4),GL,d,0,.08,0));}
 }
 // ================= WEAPONS =================
 for(const sd of['wr','wl']){const w=part(sd);if(!w)continue;const hd=J[sd==='wr'?'hdR':'hdL'];const grip=grp(hd,0,-D.hand*.5,isPod?.12:0,PI/2,0,0);grip.scale.setScalar(isFloat?1.5:1.3);
  const r=buildWeapon(w,C,{reg,plate,box,cyl,bolt,haz,glow,nozzle,mats:{PL,FR,AC,GL,GS,CH,DK,RB}},grip,isPod);S[sd]=r.tip;S[sd+'Blade']=r.blade;S[sd+'G']=grip;}
 const swp=part('sh');
 if(swp){const at=isPod?grp(J.chest,-.62,1.25,-.25):isFloat?grp(J.chest,-.85,.72,-.3):grp(J.chest,-D.shX*1.0,th*.86,-.25);at.scale.setScalar(isFloat?1.8:1.6);const pivot=grp(at);S.shPivot=pivot;
  box(at,.16,.14,.2,FR,0,-.02,0);piston(at,new V3(0,-.12,-.08),new V3(0,.08,-.02),.03);const r=buildShoulder(swp,C,{reg,plate,box,cyl,bolt,haz,glow,mats:{PL,FR,AC,GL,GS,CH,DK,RB}},pivot);S.sh=r.tip;S.spin=r.spin;}
 const bwp=part('bk');
 if(bwp){const at=isPod?grp(J.chest,.5,.95,-.62):isFloat?grp(J.back,.62,.05,-.05):grp(J.back,D.shX*.75,th*.22,-.06);at.scale.setScalar(isFloat?1.5:1.35);const r=buildBack(bwp,C,{reg,plate,box,cyl,bolt,haz,glow,nozzle,mats:{PL,FR,AC,GL,GS,CH,DK,RB}},at,isFloat);S.bk=r.tip;}
 return{A,S};}
// ---------------- WEAPONS ----------------
// hand weapons: built in grip space, +Z = muzzle direction, +Y = top of the gun
function buildWeapon(w,C,K,g,isPod){const{reg,plate,box,cyl,bolt,haz,glow}=K,m=K.mats;const s=w.shape;let tip=null,blade=null;const S=isPod?1.1:1;
 const barrel=(r,len,x,y,z,mat)=>cyl(g,r,r,len,mat||m.DK,x,y,z+len/2,PI/2,0,0,10);
 const end=(z,y)=>{tip=grp(g,0,y||.05,z);};
 switch(s){
 case'rifle':box(g,.13,.2,.62,m.FR,0,.06,.16);plate(g,.15,.12,.4,m.PL,0,.17,.12,0,0,0,.03);barrel(.035,.45,0,.08,.47);box(g,.08,.22,.1,m.DK,0,-.1,.15,.25,0,0);box(g,.09,.14,.22,m.FR,0,.0,-.2);
  cyl(g,.04,.04,.18,m.DK,0,.27,.1,PI/2,0,0,8);glow(g,.01,.03,.4,.075,.1,.18);haz(g,.12,.035,0,.1,.48,0,0,0);end(.94,.08);break;
 case'smg':box(g,.12,.18,.42,m.FR,0,.05,.12);barrel(.03,.2,0,.07,.33);box(g,.07,.3,.08,m.DK,0,-.14,.2,.1,0,0);plate(g,.13,.08,.28,m.PL,0,.15,.1,0,0,0,.02);glow(g,.01,.025,.3,.065,.08,.12);end(.55,.07);break;
 case'shotgun':box(g,.18,.22,.58,m.FR,0,.06,.14);for(const x of[-.05,.05])barrel(.05,.38,x,.1,.42);box(g,.16,.08,.32,m.PL,0,-.06,.4);box(g,.1,.16,.24,m.DK,0,-.02,-.2);haz(g,.16,.04,0,.18,.3,0,0,0);end(.82,.1);break;
 case'longrifle':box(g,.12,.18,.72,m.FR,0,.06,.18);barrel(.03,.75,0,.08,.54);cyl(g,.06,.06,.42,m.DK,0,.25,.16,PI/2,0,0,10);cyl(g,.05,.05,.02,m.GL,0,.25,.38,PI/2,0,0,10);box(g,.08,.14,.3,m.FR,0,.0,-.26);
  plate(g,.14,.1,.36,m.PL,0,.15,.06,0,0,0,.03);end(1.3,.08);break;
 case'burst':box(g,.16,.22,.56,m.FR,0,.06,.15);for(let i=0;i<3;i++)barrel(.025,.32,(i-1)*.05,.1,.43);plate(g,.18,.12,.36,m.PL,0,.19,.1,0,0,0,.03);box(g,.08,.2,.1,m.DK,0,-.1,.15,.2,0,0);glow(g,.012,.03,.3,.085,.1,.15);end(.76,.1);break;
 case'cannon':cyl(g,.16,.18,.9,m.PL,0,.1,.3,PI/2,0,0,10);cyl(g,.12,.12,.3,m.DK,0,.1,.86,PI/2,0,0,10);cyl(g,.19,.19,.1,m.AC,0,.1,.1,PI/2,0,0,10);box(g,.14,.2,.3,m.FR,0,-.12,.0);
  haz(g,.3,.06,0,.27,.4,0,0,0);for(let i=0;i<4;i++)bolt(g,.17,.1,i*.2,0,0,PI/2);end(1.04,.1);break;
 case'laser':box(g,.14,.2,.5,m.FR,0,.06,.12);for(let i=0;i<3;i++){cyl(g,.07,.07,.04,m.CH,0,.08,.42+i*.08,PI/2,0,0,10);}barrel(.04,.3,0,.08,.38);cyl(g,.045,.045,.03,m.GL,0,.08,.7,PI/2,0,0,10);
  glow(g,.12,.02,.3,0,.17,.12);box(g,.07,.2,.09,m.DK,0,-.1,.12,.2,0,0);end(.74,.08);break;
 case'couture':box(g,.16,.2,.6,m.FR,0,.06,.14);reg(mk(G('prism',()=>new T.OctahedronGeometry(.1,0)),m.GS,g,0,.2,.2,0,0,0,1,1,1.8));plate(g,.17,.06,.5,m.PL,0,-.06,.24,0,0,0,.02);barrel(.035,.38,0,.07,.44);end(.84,.07);break;
 // ---- left hand
 case'pistol':box(g,.1,.14,.3,m.FR,0,.06,.1);box(g,.07,.2,.08,m.DK,0,-.06,.03,.2,0,0);barrel(.025,.12,0,.07,.25);glow(g,.01,.02,.18,.055,.07,.1);end(.39,.07);break;
 case'mitt':box(g,.26,.26,.42,m.PL,0,.02,.08);for(const x of[-.06,.06])for(const y of[-.04,.08])barrel(.035,.14,x,y,.29);haz(g,.27,.05,0,.16,.0,0,0,0);end(.45,.02);break;
 case'needle':cyl(g,.13,.13,.55,m.PL,0,.08,.05,PI/2,0,0,10);cyl(g,.04,.015,.5,m.CH,0,.08,.55,PI/2,0,0,8);for(let i=0;i<3;i++)reg(mk(torG(.135,.025,4,10),m.DK,g,0,.08,-.1+i*.14));haz(g,.2,.05,0,.22,.05,0,0,0);end(.8,.08);break;
 default:{// blades
  const L={cutter:.9,shears:.55,moon:.95,rapier:1.25,regalia:1.4,katana:1.45}[s]||1;box(g,.08,.08,.26,m.DK,0,0,.02);box(g,.18,.05,.06,m.FR,0,0,.16);
  if(s==='shears'){for(let i=0;i<3;i++){const b=reg(mk(trapG(.08,.01,L,.02),m.CH,g,(i-1)*.06,.02,.2+L/2,PI/2,0,0));glow(g,.006,.006,L*.9,(i-1)*.06,.055,.2+L/2);}blade=grp(g,0,0,.2+L);tip=blade;break;}
  if(s==='moon'){const a=reg(mk(torG(.45,.035,4,18,PI*.9),m.GL,g,0,.0,.45,PI/2,0,PI*.55));reg(mk(torG(.45,.06,4,18,PI*.9),m.FR,g,0,-.0,.45,PI/2,0,PI*.55,1.01,1.01,.6));blade=grp(g,0,0,.9);tip=blade;break;}
  const wB={cutter:.2,rapier:.08,regalia:.24,katana:.13}[s]||.14;
  {const bm=reg(mk(trapG(wB,wB*.3,L,.04),m.CH,g,0,0,.2+L/2));bm.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(new V3(0,1,0),new V3(0,0,1),new V3(1,0,0)));}glow(g,.016,wB*.18,L*.95,0,wB*.42,.2+L/2);
  if(s==='cutter'){const cm=reg(mk(trapG(wB*1.1,wB*.3,L*.6,.05),m.GL,g,0,0,.2+L*.3));cm.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(new V3(0,1,0),new V3(0,0,1),new V3(1,0,0)));cm.scale.set(.85,1,.5);}
  if(s==='regalia'){plate(g,.32,.06,.12,m.AC,0,0,.22,0,0,0,.03);glow(g,.04,.02,L*.8,0,-.06,.25+L*.4);}
  if(s==='katana'){box(g,.12,.12,.03,m.AC,0,0,.17);}
  blade=grp(g,0,0,.2+L);tip=blade;}
 }
 g.scale.setScalar(S);if(!tip)tip=grp(g,0,.05,.5);return{tip,blade};}
// shoulder weapons: built facing +Z on a pivot above the shoulder
function buildShoulder(w,C,K,g){const{reg,plate,box,cyl,bolt,haz,glow}=K,m=K.mats;const s=w.shape;let tip=null,spin=null;
 const pod=(nx,ny,r,dep,y)=>{box(g,nx*r*2.4+.06,ny*r*2.4+.06,dep,m.PL,0,y,0);for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const x=(i-(nx-1)/2)*r*2.4,yy=y+(j-(ny-1)/2)*r*2.4;cyl(g,r,r,.02,m.DK,x,yy,dep/2+.005,PI/2,0,0,8);reg(mk(sphG(r*.6,6,4),m.AC,g,x,yy,dep/2-.02));}
  haz(g,nx*r*2.4,.04,0,y+ny*r*1.2+.04,dep/2-.02,PI/2*0,0,0);};
 switch(s){
 case'pod':pod(2,2,.06,.4,.14);tip=grp(g,0,.14,.25);break;
 case'swarm':pod(3,3,.04,.36,.14);tip=grp(g,0,.14,.22);break;
 case'podburst':pod(3,2,.05,.36,.14);plate(g,.06,.3,.4,m.AC,.22,.14,0,0,0,0,.02);tip=grp(g,0,.14,.22);break;
 case'starburst':pod(4,3,.045,.42,.18);plate(g,.5,.06,.46,m.FR,0,.0,0,0,0,0,.02);tip=grp(g,0,.18,.25);break;
 case'mortar':cyl(g,.16,.16,.34,m.PL,0,.22,0,0,0,PI/2,12);cyl(g,.09,.09,.42,m.DK,0,.32,.1,-.7,0,0,10);haz(g,.3,.05,0,.38,0,0,0,0);tip=grp(g,0,.48,.28);break;
 case'rockets':for(const x of[-.1,.1]){cyl(g,.08,.08,.55,m.PL,x,.2,.05,PI/2,0,0,10);cyl(g,.06,.06,.02,m.DK,x,.2,.33,PI/2,0,0,10);}box(g,.32,.06,.3,m.FR,0,.1,0);tip=grp(g,0,.2,.36);break;
 case'gatling':box(g,.24,.22,.3,m.FR,0,.2,-.05);spin=grp(g,0,.2,.12);for(let i=0;i<6;i++){const a=i/6*PI*2;cyl(spin,.025,.025,.55,m.DK,Math.cos(a)*.07,Math.sin(a)*.07,.27,PI/2,0,0,6);}
  for(const z of[.1,.42])reg(mk(cylG(.11,.11,.03,10),m.FR,spin,0,0,z,PI/2,0,0));reg(mk(tubeG('gatBelt',[[.12,.2,-.1],[.25,.0,-.15],[.18,-.2,-.05]],.03,8,4),m.CH,g));tip=grp(g,0,.2,.7);break;
 default:pod(2,2,.06,.4,.22);tip=grp(g,0,.22,.25);}
 return{tip,spin};}
// back weapons: rack over the screen-left shoulder (+X), barrel folds forward over the shoulder
function buildBack(w,C,K,g,isFloat){const{reg,plate,box,cyl,bolt,haz,glow,nozzle}=K,m=K.mats;const s=w.shape;let tip=null;
 box(g,.2,.3,.14,m.FR,0,0,0);
 switch(s){
 case'rack':box(g,.3,.42,.22,m.PL,0,.05,-.14);for(const y of[-.06,.16]){box(g,.24,.14,.06,m.AC,0,y,-.27);box(g,.05,.1,.065,basicM('#f4f4f4'),0,y,-.27);box(g,.1,.03,.065,basicM('#f4f4f4'),0,y,-.27);}tip=grp(g,0,.3,0);break;
 case'bkcannon':{const a=grp(g,.05,.2,0,-.08,0,0);cyl(a,.11,.13,1.5,m.PL,0,0,.45,PI/2,0,0,10);cyl(a,.08,.08,.3,m.DK,0,0,1.3,PI/2,0,0,10);cyl(a,.15,.15,.12,m.AC,0,0,-.1,PI/2,0,0,10);haz(a,.2,.05,0,.13,.35,0,0,0);
  box(g,.12,.36,.12,m.DK,0,.15,0);tip=grp(a,0,0,1.48);break;}
 case'rail':{const a=grp(g,.05,.2,0,-.06,0,0);for(const x of[-.07,.07])plate(a,.06,.16,1.7,m.PL,x,0,.55,0,0,0,.02);glow(a,.03,.05,1.5,0,0,.6);plate(a,.26,.24,.5,m.FR,0,0,-.05,0,0,0,.05);for(let i=0;i<4;i++)box(a,.22,.04,.06,m.DK,0,.1,.3+i*.3);haz(a,.2,.05,0,.13,-.05,0,0,0);
  tip=grp(a,0,0,1.42);break;}
 case'kites':for(const y of[0,.28]){const d=grp(g,0,y,-.18);box(d,.36,.08,.24,m.PL,0,0,0);for(const x of[-.2,.2])reg(mk(cylG(.08,.08,.02,10),m.GL,d,x,.05,0));}tip=grp(g,0,.4,0);break;
 case'pulse':{const d=grp(g,0,.25,-.1,.3,0,0);cyl(d,.28,.2,.08,m.PL,0,0,0,PI/2,0,0,10);reg(mk(cylG(.16,.16,.02,10),m.GL,d,0,0,.05,PI/2,0,0));for(let i=0;i<4;i++){const a=i/4*PI*2;box(d,.06,.06,.12,m.DK,Math.cos(a)*.28,Math.sin(a)*.28,.04);}tip=grp(d,0,0,.1);break;}
 case'hunny':{const a=grp(g,.02,.3,-.08,-.5,0,0);cyl(a,.2,.2,.42,m.PL,0,0,.1,PI/2,0,0,12);reg(mk(cylG(.17,.17,.3,12),glassM('#ffa21a'),a,0,0,.1,PI/2,0,0));for(const z of[-.1,.3])reg(mk(torG(.205,.03,4,14),m.DK,a,0,0,z));cyl(a,.1,.1,.3,m.DK,0,0,.45,PI/2,0,0,10);tip=grp(a,0,0,.6);break;}
 default:tip=grp(g,0,.3,0);}
 return{tip};}
// ---------------- RIG + PROCEDURAL ANIMATION ----------------
function build(id,load,paint,opt){opt=opt||{};paint=paint||PAINTS[0];const body=buildBody(id);const bodyMeshes=[];if(opt.noBody)body.root.traverse(o=>{if(o.isMesh||o.isLine||o.isLineSegments)bodyMeshes.push(o);});const arm=fitArmor(body,load||{},paint,opt);const J=body.J,D=body.D,S=arm.S;
 if(opt.noBody)for(const m of bodyMeshes)m.visible=false;
 const rest=new Map();const walk=o=>{if(!o)return;if(Array.isArray(o)){o.forEach(walk);return;}if(o.isObject3D&&!rest.has(o))rest.set(o,{r:o.rotation.clone(),p:o.position.clone()});};
 for(const k in J)walk(J[k]);if(S.shPivot)walk(S.shPivot);
 // LOD: tiny parts hidden when far away
 const detail=[];for(const m of arm.A){if(m.geometry){if(!m.geometry.boundingSphere)m.geometry.computeBoundingSphere();if(m.geometry.boundingSphere.radius*Math.max(m.scale.x,m.scale.y,m.scale.z)<.09)detail.push(m);}}
 const A={t:Math.random()*10,ph:0,kick:{wr:0,wl:0,sh:0,bk:0},hit:0,slash:-1,slashDur:.4,slashSide:'wl',dead:0,air:0,boost:0,bank:0,spd:0,mvA:0,aim:{wr:0,wl:0},pitch:0,lod:0,spin:0};
 const kind=D.body;const R=k=>rest.get(J[k]);
 function reset(){for(const[o,v]of rest){o.rotation.copy(v.r);o.position.copy(v.p);}}
 function update(dt,s){s=s||{};A.t+=dt;const t=A.t;
  const spd=clamp(s.spd||0,0,1);A.spd=smooth(A.spd,spd,10,dt);const sp=A.spd;
  if(s.mvA!=null)A.mvA=s.mvA;A.ph+=dt*(2+sp*(kind==='float'?7:kind==='pod'?8:10));
  A.air=smooth(A.air,s.air?1:0,8,dt);A.boost=smooth(A.boost,s.boost||0,8,dt);A.bank=smooth(A.bank,clamp(s.bank||0,-1,1),9,dt);A.pitch=smooth(A.pitch,s.pitch||0,10,dt);
  A.dead=smooth(A.dead,s.dead?1:0,s.dead?4:8,dt);A.hit=Math.max(0,A.hit-dt*4);for(const k in A.kick)A.kick[k]=Math.max(0,A.kick[k]-dt*7);
  A.aim.wr=smooth(A.aim.wr,s.aimR?1:0,12,dt);A.aim.wl=smooth(A.aim.wl,s.aimL?1:0,12,dt);
  if(A.slash>=0){A.slash+=dt/A.slashDur;if(A.slash>=1)A.slash=-1;}
  reset();
  const ca=Math.cos(A.mvA),sa=Math.sin(A.mvA),sw=Math.sin(A.ph),cw=Math.cos(A.ph);const grounded=1-A.air;const dead=A.dead;
  // whole-body lean / bank / boost tilt
  J.lean.rotation.z=-A.bank*.38*(1-dead);J.lean.rotation.x=(A.boost*.32+sp*.06*grounded)*(1-dead);
  if(kind==='hum'){const amp=.7*sp*grounded;
   for(const[sd,sg]of[['R',1],['L',-1]]){const th=J['th'+sd],kn=J['kn'+sd];const s1=sw*sg;
    th.rotation.x+=-s1*amp*ca;th.rotation.z+=s1*amp*sa*.55;kn.rotation.x+=Math.max(0,Math.sin(A.ph*1+(sg>0?PI/2:-PI/2)))*amp*1.25;
    th.rotation.x+=A.air*(sg>0?-.65:-.25)+A.boost*.35;kn.rotation.x+=A.air*(sg>0?1.1:.6)+A.boost*.25;}
   J.hips.position.y+=Math.abs(cw)*.07*sp*grounded+Math.sin(t*2.1)*.012;J.hips.rotation.y=sw*.08*sp;J.chest.rotation.y=-sw*.1*sp;J.chest.rotation.x+=Math.sin(t*2.1)*.015;
   // arms
   for(const[sd,ws,sg]of[['R','wr',-1],['L','wl',1]]){const sh=J['sh'+sd],el=J['el'+sd];const aimW=A.aim[ws];const blade=!!S[ws+'Blade'];
    const swing=-sw*sg*.5*sp*grounded;sh.rotation.x+=swing*(1-aimW);el.rotation.x+=-.25-.2*sp;sh.rotation.z+=-sg*A.air*.35;
    if(blade){sh.rotation.x+=-.55*(1-aimW)+(-1.0)*aimW;el.rotation.x+=-.55;}
    else if(S[ws]){sh.rotation.x+=lerp(-.25,-1.5-A.pitch,aimW);el.rotation.x+=lerp(-.35,-.05,aimW);sh.rotation.z+=sg*.12*aimW;}
    const k=A.kick[ws];sh.rotation.x+=-k*.35;el.rotation.x+=-k*.25;}
   J.head.rotation.x+=-A.pitch*.4;
  }else if(kind==='float'){// Pooh: hover bob, shoes walk in the air
   J.hips.position.y+=Math.sin(t*2.6)*.06+sp*.05;J.chest.rotation.z=Math.sin(t*1.3)*.03+sw*.05*sp;J.chest.rotation.x+=Math.sin(t*2.6)*.02;
   for(const[sd,sg]of[['R',1],['L',-1]]){const sh=J['shoe'+sd];const s1=sw*sg;sh.position.z+=s1*.3*sp*ca;sh.position.x+=s1*.2*sp*sa;sh.position.y+=Math.max(0,s1)*.18*sp+Math.sin(t*3+sg)*.05+A.air*.1;sh.rotation.x=-s1*.3*sp-A.boost*.5;}
   for(const[sd,ws,sg]of[['R','wr',-1],['L','wl',1]]){const sh=J['sh'+sd],el=J['el'+sd];const aimW=A.aim[ws];const blade=!!S[ws+'Blade'];
    sh.rotation.x+=(-sw*sg*.45*sp)*(1-aimW);sh.rotation.z=lerp(R('sh'+sd).r.z,sg*.25,Math.max(aimW,blade?.6:0));
    if(blade){sh.rotation.x+=-.9;el.rotation.x+=-.4;}else if(S[ws]){sh.rotation.x+=lerp(-.3,-1.45-A.pitch,aimW);}
    const k=A.kick[ws];sh.rotation.x+=-k*.4;}
   J.head.rotation.z=Math.sin(t*1.1)*.05;J.head.rotation.x+=-A.pitch*.3;
  }else{// Bean: hop + wobble
   J.hips.position.y+=Math.abs(sw)*.2*sp*grounded+Math.sin(t*2.2)*.03;J.chest.rotation.z=Math.sin(A.ph)*.08*sp+Math.sin(t*1.7)*.03;J.chest.rotation.x+=sp*.1;
   for(const[sd,ws]of[['R','wr'],['L','wl']]){const sh=J['sh'+sd],el=J['el'+sd];const aimW=A.aim[ws];sh.rotation.x+=lerp(-1.25,-1.55-A.pitch,aimW)+Math.sin(t*2+(sd==='R'?0:1))*.04;el.rotation.x+=-.05;sh.rotation.x+=-A.kick[ws]*.3;}
   if(J.tailRoot)J.tailRoot.rotation.z=Math.sin(t*3)*.15+sw*.2*sp;
  }
  // slash swing (left blade, or right if that is the blade)
  if(A.slash>=0){const p=A.slash,sd=A.slashSide==='wr'?'R':'L',sg=sd==='R'?-1:1;const sh=J['sh'+sd],el=J['el'+sd];
   const k=p<.3?p/.3:p<.62?1-(p-.3)/.32:0;const w=p<.3?p/.3:p<.62?1:1-(p-.62)/.38;
   // wind up high & out, then cut across the body
   const ux=lerp(-2.7,-.5,1-k),uz=lerp(sg*.9,-sg*.6,1-k);
   if(kind!=='pod'){sh.rotation.x=lerp(sh.rotation.x,ux,w);sh.rotation.z=lerp(sh.rotation.z,uz,w);el.rotation.x=lerp(el.rotation.x,-.2,w);
    J.chest.rotation.y+=lerp(0,sg*.5,k*w)-sg*.35*(1-k)*w;}
   else{sh.rotation.y=lerp(0,sg*1.4,k*w)-sg*.7*(1-k)*w;}
   J.lean.rotation.x+=.12*w;}
  // hit react
  if(A.hit>0){J.chest.rotation.x-=A.hit*.35;J.head.rotation.x-=A.hit*.3;J.lean.rotation.x-=A.hit*.12;}
  // defeat pose
  if(dead>0){if(kind==='hum'){for(const[sd,sg]of[['R',1],['L',-1]]){J['th'+sd].rotation.x=lerp(J['th'+sd].rotation.x,-1.25+(sg>0?0:.15),dead);J['kn'+sd].rotation.x=lerp(J['kn'+sd].rotation.x,2.25,dead);
     J['sh'+sd].rotation.x=lerp(J['sh'+sd].rotation.x,.25,dead);J['el'+sd].rotation.x=lerp(J['el'+sd].rotation.x,-.3,dead);}
    J.hips.position.y-=dead*(D.th*.64+D.sh*.42);J.chest.rotation.x+=dead*.55;J.head.rotation.x+=dead*.5;}
   else if(kind==='float'){J.hips.position.y-=dead*.55;J.lean.rotation.x-=dead*.25;J.head.rotation.x+=dead*.35;J.head.rotation.z+=dead*.2;for(const sd of['R','L']){J['shoe'+sd].position.y-=dead*.2;J['shoe'+sd].position.z+=dead*.35;J['sh'+sd].rotation.z*=1+dead*.4;}}
   else{J.lean.rotation.z+=dead*1.35;J.lean.position.x-=dead*.4;}}
  // tails
  if(J.tail&&J.tail.length>1){for(let i=0;i<J.tail.length;i++){const o=J.tail[i];o.rotation.y=(rest.get(o)?rest.get(o).r.y:0)+Math.sin(t*2.2-i*.55)*.16+sw*.1*sp;}}
  if(S.shPivot)S.shPivot.rotation.x=-A.pitch*.8-A.kick.sh*.2;
  if(S.spin)S.spin.rotation.z+=dt*(s.spinFast?32:1.5);
  if(s.lod!=null&&s.lod!==A.lod){A.lod=s.lod;for(const m of detail)m.visible=!A.lod;}
 }
 const rig={root:body.root,J,D,S,body,armor:arm,id,update,
  kick(slot){if(A.kick[slot]!=null)A.kick[slot]=1;},slash(side,dur){A.slash=0;A.slashSide=side||'wl';A.slashDur=dur||.4;},hitReact(){A.hit=1;},
  state:A,world(o,out){return o.getWorldPosition(out||new V3());},
  dispose(){body.root.removeFromParent();}};
 body.root.traverse(o=>{o.userData.keep=true;});update(0,{});return rig;}


function envFor(R){if(R.__env)return R.__env;const pm=new T.PMREMGenerator(R);const sc=new T.Scene();
 const g=new T.SphereGeometry(50,32,16);const cols=[];const p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i)/50;const c=y>0?new T.Color(0x9aa6b8).lerp(new T.Color(0x2a3242),1-y):new T.Color(0x3a3632).lerp(new T.Color(0x121212),-y);cols.push(c.r,c.g,c.b);}
 g.setAttribute('color',new T.Float32BufferAttribute(cols,3));sc.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
 const L=(c,x,y,z,w,h)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:c,side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);sc.add(m);};
 L(0xfff1dc,-20,30,20,24,14);L(0x8fe8ff,30,10,-25,16,30);L(0xffffff,0,40,-10,30,10);L(0xff9a4a,-35,5,-10,10,20);
 R.__env=pm.fromScene(sc,.04).texture;pm.dispose();return R.__env;}
// game-matched lighting for viewers: same recipe as the mission maps (hemi + key + rim) plus a reflection env
function lights(sc,o){o=o||{};const L=[];const h=new T.HemisphereLight(0xdfe6ff,new T.Color(o.ground||'#2a2d36').multiplyScalar(1.4),.55);sc.add(h);const d=new T.DirectionalLight(o.light||0xffd2a0,.95);d.position.set(-4,7,5);sc.add(d);
 const r=new T.DirectionalLight(o.rim||0x4ef0ff,.7);r.position.set(5,3,-6);sc.add(r);const f=new T.DirectionalLight(0xffffff,.25);f.position.set(2,2,6);sc.add(f);return[h,d,r,f];}
// ---------------- VIEWERS (hangar / title / menu), SNAPSHOTS, PART ICONS ----------------
const VW={R:null,lost:false,stages:new Set(),raf:0,last:0};
function viewR(){if(VW.R&&!VW.lost)return VW.R;try{const cv=document.createElement('canvas');const R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});
  R.outputEncoding=T.sRGBEncoding;R.setClearColor(0x000000,0);cv.addEventListener('webglcontextlost',e=>{e.preventDefault();VW.lost=true;});cv.addEventListener('webglcontextrestored',()=>{VW.lost=false;VW.R=null;for(const s of VW.stages)s._dirty=true;});VW.R=R;VW.lost=false;return R;}catch(e){return null;}}
function frameCam(cam,H,w,h,o){o=o||{};const asp=w/h;cam.aspect=asp;const fov=o.fov||28;cam.fov=fov;const fit=(o.fit||1.18)*H;const dist=fit/2/Math.tan(fov*PI/360)/(asp<.75?asp/.75:1);
 cam.position.set(o.cx||0,H*.52+(o.cy||0),dist);cam.lookAt(o.cx||0,H*.48+(o.cy||0),0);cam.updateProjectionMatrix();}
function makeScene(R){const sc=new T.Scene();sc.environment=envFor(R);lights(sc,{});return sc;}
// Live stage drawing into a 2D canvas: {chars:[{id,load,paint,x,yaw}], auto (rad/s), drag, w,h (px)}
function stage(cv,o){const R=viewR();if(!R)return null;o=o||{};const st={cv,o,rigs:[],yaw:o.yaw||0,auto:o.auto==null?.35:o.auto,hold:0,_dirty:true,t:0};
 st.sc=makeScene(R);st.cam=new T.PerspectiveCamera(28,1,.1,200);
 const sh=new T.Mesh(new T.CircleGeometry(1.6,28),new T.MeshBasicMaterial({color:0,transparent:true,opacity:.42,depthWrite:false}));sh.rotation.x=-PI/2;sh.position.y=.01;st.sc.add(sh);st.shadow=sh;
 st.set=function(chars){for(const r of st.rigs)r.dispose();st.rigs=[];for(const c of chars||[]){const r=build(c.id,c.load,c.paint,c.opt);r.root.position.x=c.x||0;r.baseYaw=c.yaw||0;st.sc.add(r.root);st.rigs.push(r);}st.H=Math.max(...(chars||[{}]).map(c=>(SPEC[c.id]||{}).H||4.6));st._dirty=true;return st;};
 st.setYaw=function(deg){st.yaw=deg*PI/180;st.auto=0;st._dirty=true;};
 st.stop=function(){VW.stages.delete(st);for(const r of st.rigs)r.dispose();st.rigs=[];};
 if(o.drag!==false){let px=null;cv.addEventListener('pointerdown',e=>{px=e.clientX;st.hold=1;try{cv.setPointerCapture(e.pointerId);}catch(_){}});cv.addEventListener('pointermove',e=>{if(px==null)return;st.yaw+=(e.clientX-px)*.012;px=e.clientX;});
  const up=()=>{px=null;st.hold=2.5;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.style.touchAction='pan-y';}
 if(o.chars)st.set(o.chars);VW.stages.add(st);loop();return st;}
function renderStage(st,dt){const R=viewR();if(!R)return;const cv=st.cv;if(!cv.isConnected){VW.stages.delete(st);return;}if(cv.offsetParent===null&&!st.o.always)return;
 const w=st.o.w||cv.width,h=st.o.h||cv.height;if(R.domElement.width!==w||R.domElement.height!==h)R.setSize(w,h,false);
 if(st.hold>0)st.hold=Math.max(0,st.hold-dt);else st.yaw+=st.auto*dt;st.t+=dt;
 for(const r of st.rigs){r.root.rotation.y=st.yaw+r.baseYaw;r.update(dt,st.o.anim||{});}
 st.shadow.scale.setScalar(st.rigs.length>1?2.4:1);frameCam(st.cam,st.H||4.6,w,h,st.o.cam);R.render(st.sc,st.cam);
 const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);g.drawImage(R.domElement,0,0,cv.width,cv.height);}
function loop(){if(VW.raf)return;const f=now=>{VW.raf=0;const dt=Math.min(.1,(now-(VW.last||now))/1000);VW.last=now;let any=false;
 for(const st of VW.stages){any=true;st.acc=(st.acc||0)+dt;if(st.acc<(st.hold>0&&st.hold<2.5?1/60:1/30)&&!st._dirty)continue;const d=Math.min(.1,st.acc);st.acc=0;st._dirty=false;try{renderStage(st,d);}catch(e){console.warn('stage',e);VW.stages.delete(st);}}
 if(any)VW.raf=requestAnimationFrame(f);else VW.last=0;};VW.raf=requestAnimationFrame(f);}
function alive(st){return !!st&&VW.stages.has(st);}
// One-off render, compose()-compatible: {canvas,W,H,feetY,anchors,scale,mode:'3d'}
function snap(id,load,paint,opt){opt=opt||{};const R=viewR();if(!R)return null;const H=(SPEC[id]||{}).H||4.6;const s=opt.scale||1.6;const w=Math.round((opt.w||300)*s),h=Math.round((opt.h||420)*s);
 const sc=makeScene(R);const rig=build(id,load,paint,opt);rig.root.rotation.y=opt.yaw==null?.42:opt.yaw;sc.add(rig.root);rig.update(.016,opt.anim||{aimR:0});
 if(!opt.noShadow){const sh=new T.Mesh(new T.CircleGeometry(1.5,24),new T.MeshBasicMaterial({color:0,transparent:true,opacity:.35,depthWrite:false}));sh.rotation.x=-PI/2;sh.position.y=.01;sc.add(sh);}
 const cam=new T.PerspectiveCamera(28,w/h,.1,200);frameCam(cam,H,w,h,opt.cam||{fit:1.3});R.setSize(w,h,false);R.setClearColor(0,0);R.render(sc,cam);
 const cv=opt.canvas||document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.clearRect(0,0,w,h);g.drawImage(R.domElement,0,0);
 const pr=o=>{const v=o.getWorldPosition(new V3()).project(cam);return[(v.x*.5+.5)*w,(-v.y*.5+.5)*h];};const S=rig.S;
 const anchors={noz:(S.noz||[]).map(pr),center:S.center?pr(S.center):[w/2,h/2],head:pr(rig.J.head)};for(const k of['wr','wl','sh','bk'])if(S[k])anchors[k]=pr(S[k]);
 const feet=new V3(0,0,0).project(cam);rig.dispose();
 return{canvas:cv,W:w,H:h,feetY:(-feet.y*.5+.5)*h,anchors,scale:s,mode:'3d'};}
// Part icon: only the part, auto-cropped
const ICON3={};
function partIcon(id,paint,size){const p=PARTS[id];if(!p)return null;paint=paint||PAINTS[0];size=size||96;const k=id+paint.id+size;if(ICON3[k])return ICON3[k];const R=viewR();if(!R)return null;
 const cid=p.only||(p.slot==='legs'||p.slot==='arms'?'pinco':'pinco');const ld={[p.slot]:id};const sc=makeScene(R);const rig=build(cid,ld,paint,{noBody:true});sc.add(rig.root);
 const yaw={wr:-1.2,wl:-1.9,sh:-.9,bk:-2.2,booster:2.6,gen:2.8,fcs:-.6}[p.slot];rig.root.rotation.y=yaw==null?.5:yaw;rig.update(.016,{});rig.root.updateMatrixWorld(true);
 const bx=new T.Box3();for(const m of rig.armor.A){if(m.geometry){m.geometry.computeBoundingBox();bx.union(m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld));}}
 const out=document.createElement('canvas');out.width=out.height=size;if(bx.isEmpty()){ICON3[k]=out;rig.dispose();return out;}
 const c=bx.getCenter(new V3()),sz=bx.getSize(new V3());const rad=Math.max(sz.x,sz.y,sz.z)*.62+.05;const cam=new T.PerspectiveCamera(30,1,.01,100);
 cam.position.set(c.x+rad*.6,c.y+rad*.8,c.z+rad*3.4);cam.lookAt(c);const r=size*2;R.setSize(r,r,false);R.setClearColor(0,0);R.render(sc,cam);
 out.getContext('2d').drawImage(R.domElement,0,0,r,r,0,0,size,size);ICON3[k]=out;rig.dispose();return out;}
function available(){return !!viewR();}
return{alive,available,lights,build,buildBody,stage,snap,partIcon,envFor,SPEC,mats:{plateM,metalM,glowM,hazM},_GC:GC,_MC:MC};
})();
