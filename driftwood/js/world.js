'use strict';
// Rendering of the island: terrain mesh, water, lights, sky.
const GRASS={spring:['#7fd162','#76c95a'],summer:['#5fc04c','#56b744'],autumn:['#93c556','#8abd4e'],winter:['#eef3f7','#e4ebf1']};
const R3={};
function hexc(h){return new THREE.Color(h)}
function buildTerrain(W,season){
 const pos=[],col=[],idx=[];let vi=0;const c=new THREE.Color();
 const quad=(p,colr,jit=0)=>{for(const v of p){pos.push(v[0],v[1],v[2]);c.set(colr);if(jit){const k=1+jit*(Math.random()-.5);c.r*=k;c.g*=k;c.b*=k}col.push(c.r,c.g,c.b)}idx.push(vi,vi+1,vi+2,vi,vi+2,vi+3);vi+=4};
 const N=W.N;const gc=GRASS[season];
 const corners=(x,z)=>{if(x<0||z<0||x>=N||z>=N)return [-1.2,-1.2,-1.2,-1.2];const i=W.I(x,z);const h=tileTop(W,x,z);
  if(W.RAMP[i]===0){const hi=LV_H[W.L[i]+1];return [hi,hi,h,h]}return [h,h,h,h]};// order: (x,z),(x+1,z),(x+1,z+1),(x,z+1)
 for(let z=0;z<N;z++)for(let x=0;x<N;x++){const i=W.I(x,z),t=W.T[i];const k=corners(x,z);
  let top;if(t===TY.SEA){let sh=false;for(let a=-2;a<=2&&!sh;a++)for(let b=-2;b<=2;b++){const nx=x+a,nz=z+b;if(nx>=0&&nz>=0&&nx<N&&nz<N&&W.T[W.I(nx,nz)]!==TY.SEA){sh=true;break}}top=sh?'#7fd0c8':'#2f93ad'}else if(t===TY.SAND||t===TY.DOCK)top=((x*7+z*13)%5===0)?'#f4e4b4':'#f2dfa9';else if(t===TY.RIVER||t===TY.POND)top='#6f9a8a';else top=((x+z)%2?gc[0]:gc[1]);
  if(t===TY.BRIDGE)top='#6f9a8a';
  const hh=t===TY.BRIDGE?[tileTop(W,x,z)-1.25,tileTop(W,x,z)-1.25,tileTop(W,x,z)-1.25,tileTop(W,x,z)-1.25]:k;
  // top (counter-clockwise seen from above: y up => order (x,z+1),(x+1,z+1),(x+1,z),(x,z))
  quad([[x,hh[3],z+1],[x+1,hh[2],z+1],[x+1,hh[1],z],[x,hh[0],z]],top,t===TY.SEA?0:.05);
  // sides: compare with 4 neighbours
  const me=hh;
  const sides=[[0,-1,[0,1],[3,2]],[1,0,[1,2],[0,3]],[0,1,[2,3],[1,0]],[-1,0,[3,0],[2,1]]];
  for(const [dx,dz,mine,theirs] of sides){const nx=x+dx,nz=z+dz;let o;
   if(nx<0||nz<0||nx>=N||nz>=N)o=[-1.2,-1.2,-1.2,-1.2];else{const j=W.I(nx,nz);o=W.T[j]===TY.BRIDGE?Array(4).fill(tileTop(W,nx,nz)-1.25):corners(nx,nz)}
   const a1=me[mine[0]],a2=me[mine[1]],b1=o[theirs[0]],b2=o[theirs[1]];
   if(a1<=b1+.001&&a2<=b2+.001)continue;
   const cs=[[x,z],[x+1,z],[x+1,z+1],[x,z+1]];const p1=cs[mine[0]],p2=cs[mine[1]];
   const lo1=Math.min(a1,b1),lo2=Math.min(a2,b2);const d=Math.max(a1-lo1,a2-lo2);
   const isG=t===TY.GRASS;
   if(isG&&d>.5){// cliff: lip band + rock
    const lip=.14;quad([[p1[0],a1,p1[1]],[p2[0],a2,p2[1]],[p2[0],a2-lip,p2[1]],[p1[0],a1-lip,p1[1]]].reverse(),season==='winter'?'#dfe6ec':'#4f9a3c');
    const mid1=(a1-lip+lo1)/2,mid2=(a2-lip+lo2)/2;
    quad([[p1[0],a1-lip,p1[1]],[p2[0],a2-lip,p2[1]],[p2[0],mid2,p2[1]],[p1[0],mid1,p1[1]]].reverse(),'#b4885a',.08);
    quad([[p1[0],mid1,p1[1]],[p2[0],mid2,p2[1]],[p2[0],lo2,p2[1]],[p1[0],lo1,p1[1]]].reverse(),'#9a7048',.08);
   }else{const sc=isG?'#a5784c':(t===TY.SAND?'#e2c98e':t===TY.DOCK?'#9a6a3a':'#8a7a5a');
    quad([[p1[0],a1,p1[1]],[p2[0],a2,p2[1]],[p2[0],lo2,p2[1]],[p1[0],lo1,p1[1]]].reverse(),sc,.06)}
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
 const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}));m.receiveShadow=true;return m}
function waterTex(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#ffffff';x.fillRect(0,0,128,128);
 x.strokeStyle='rgba(120,170,200,.35)';x.lineWidth=3;x.lineCap='round';for(let i=0;i<14;i++){const px=(i*37)%128,py=(i*53)%128;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+8,py-5,px+16,py);x.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function buildWater(W){const grp=new THREE.Group();const tex=waterTex();tex.repeat.set(24,24);
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshPhongMaterial({color:0x5ccbe0,map:tex,transparent:true,opacity:.7,shininess:60,specular:0x335566}));sea.rotation.x=-Math.PI/2;sea.position.set(24,-.22,24);sea.receiveShadow=true;grp.add(sea);
 const rt=waterTex();rt.repeat.set(1,1);
 const rm=new THREE.MeshPhongMaterial({color:0x5cc8e0,map:rt,transparent:true,opacity:.85,shininess:60,specular:0x335566});
 const pos=[],uv=[],idx=[];let vi=0;
 const fall=[],fuv=[],fidx=[];let fi=0;
 for(let z=0;z<W.N;z++)for(let x=0;x<W.N;x++){const i=W.I(x,z),t=W.T[i];if(t!==TY.RIVER&&t!==TY.POND&&t!==TY.BRIDGE)continue;const h=LV_H[W.L[i]]-.33;
  pos.push(x,h,z+1,x+1,h,z+1,x+1,h,z,x,h,z);uv.push(x/2,z/2,(x+1)/2,z/2,(x+1)/2,(z+1)/2,x/2,(z+1)/2);idx.push(vi,vi+1,vi+2,vi,vi+2,vi+3);vi+=4;
  // waterfall to south lower river
  const j=z+1<W.N?W.I(x,z+1):-1;if(j>=0&&(W.T[j]===TY.RIVER||W.T[j]===TY.BRIDGE)&&W.L[j]<W.L[i]){const h2=LV_H[W.L[j]]-.33;fall.push(x,h,z+1.01,x+1,h,z+1.01,x+1,h2,z+1.01,x,h2,z+1.01);fuv.push(0,0,1,0,1,1,0,1);fidx.push(fi,fi+2,fi+1,fi,fi+3,fi+2);fi+=4}
  if(j>=0&&W.T[j]===TY.SEA){}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 const river=new THREE.Mesh(g,rm);river.receiveShadow=true;grp.add(river);
 let fallM=null;if(fi){const ft=(()=>{const c=document.createElement('canvas');c.width=32;c.height=128;const x=c.getContext('2d');x.fillStyle='#bfefff';x.fillRect(0,0,32,128);x.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<10;i++)x.fillRect((i*7)%32,(i*29)%128,3,26);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,1);return t})();
  const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(fall,3));fg.setAttribute('uv',new THREE.Float32BufferAttribute(fuv,2));fg.setIndex(fidx);fg.computeVertexNormals();
  fallM=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({map:ft,transparent:true,opacity:.9,side:THREE.DoubleSide}));grp.add(fallM)}
 // foam ring around shore
 const fpos=[],fid=[];let k=0;for(let z=0;z<W.N;z++)for(let x=0;x<W.N;x++){if(W.T[W.I(x,z)]!==TY.SEA)continue;let near=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,nz=z+b;if(nx>=0&&nz>=0&&nx<W.N&&nz<W.N&&W.T[W.I(nx,nz)]===TY.SAND)near=true}
  if(near){fpos.push(x,-.2,z+1,x+1,-.2,z+1,x+1,-.2,z,x,-.2,z);fid.push(k,k+1,k+2,k,k+2,k+3);k+=4}}
 const fgm=new THREE.BufferGeometry();fgm.setAttribute('position',new THREE.Float32BufferAttribute(fpos,3));fgm.setIndex(fid);
 const foam=new THREE.Mesh(fgm,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.28,depthWrite:false}));grp.add(foam);
 grp.userData={tex,rt,fallM,foam,sea};return grp}
// ---------- sky & light by time ----------
const SKY_KEYS=[// hour, sky, sun color, sun int, amb int, hemiSky, hemiGround
 [0,'#1b2650','#8090d0',.25,.35,'#5060a0','#202838'],[4,'#26305e','#8090d0',.25,.35,'#5060a0','#202838'],[5.5,'#f2a98a','#ffc09a',.6,.5,'#f0b0a0','#705848'],
 [7,'#9ad8f2','#fff1d6',1.0,.62,'#cfefff','#8a9a6a'],[12,'#86d0f5','#ffffff',1.1,.68,'#d8f4ff','#94a670'],[16,'#8fd0ef','#fff0d0',1.0,.62,'#d0eeff','#90a06a'],
 [17.5,'#f6b27a','#ffb27a',.8,.55,'#ffc89a','#806050'],[19,'#5a4a8a','#a090e0',.4,.42,'#7a70b0','#303048'],[20.5,'#1f2a58','#8090d0',.28,.36,'#5060a0','#202838'],[24,'#1b2650','#8090d0',.25,.35,'#5060a0','#202838']];
function skyAt(h){for(let i=0;i<SKY_KEYS.length-1;i++){const a=SKY_KEYS[i],b=SKY_KEYS[i+1];if(h>=a[0]&&h<=b[0]){const f=(h-a[0])/(b[0]-a[0]);const mix=(p,q)=>new THREE.Color(p).lerp(new THREE.Color(q),f);
  return {sky:mix(a[1],b[1]),sun:mix(a[2],b[2]),si:a[3]+(b[3]-a[3])*f,ai:a[4]+(b[4]-a[4])*f,hs:mix(a[5],b[5]),hg:mix(a[6],b[6]),night:h<5.5||h>=18.6}}}return null}
