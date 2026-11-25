'use strict';
// ================= home interior & decorating =================
const FSIZE={bed:[1,2],kotatsu:[1,1],table:[1,1],armchair:[1,1],shelf:[1,1],logbench:[1,1]};
function patCanvas(col,pat,w=256,h=256,repeat=1){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=col;x.fillRect(0,0,w,h);
 const dk='rgba(0,0,0,.08)',lt='rgba(255,255,255,.35)';
 if(pat==='wave'){x.strokeStyle=lt;x.lineWidth=6;for(let y=20;y<h;y+=40){x.beginPath();for(let i=0;i<=w;i+=8)x.lineTo(i,y+Math.sin(i/20)*8);x.stroke()}}
 else if(pat==='hex'){x.strokeStyle='rgba(180,110,10,.35)';x.lineWidth=4;const s=22;for(let j=0;j<h/s/1.5+1;j++)for(let i=0;i<w/s/1.7+1;i++){const cx=i*s*1.73+(j%2)*s*.86,cy=j*s*1.5;x.beginPath();for(let k=0;k<6;k++){const a=k/6*Math.PI*2+Math.PI/6;x.lineTo(cx+Math.cos(a)*s,cy+Math.sin(a)*s)}x.closePath();x.stroke()}}
 else if(pat==='star'){x.fillStyle='#fff6c0';for(let i=0;i<40;i++){const px=(i*97)%w,py=(i*61)%h;x.beginPath();x.arc(px,py,(i%3)+1.5,0,7);x.fill()}}
 else if(pat==='log'){x.fillStyle=dk;for(let y=0;y<h;y+=32){x.fillRect(0,y,w,4)}x.fillStyle='rgba(255,255,255,.12)';for(let y=10;y<h;y+=32)x.fillRect(0,y,w,6)}
 else if(pat==='dot'){x.fillStyle='rgba(255,140,170,.5)';for(let i=0;i<w;i+=32)for(let j=0;j<h;j+=32){x.beginPath();x.arc(i+((j/32)%2)*16,j,6,0,7);x.fill()}}
 else if(pat==='stripe'){x.fillStyle=lt;for(let i=0;i<w;i+=32)x.fillRect(i,0,14,h)}
 else if(pat==='grid'){x.strokeStyle='rgba(140,110,70,.45)';x.lineWidth=4;for(let i=0;i<=w;i+=64){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}for(let j=0;j<=h;j+=48){x.beginPath();x.moveTo(0,j);x.lineTo(w,j);x.stroke()}}
 else if(pat==='plank'){x.fillStyle=dk;for(let y=0;y<h;y+=32){x.fillRect(0,y,w,3);x.fillRect(((y/32)%2)*128+60,y,3,32)}}
 else if(pat==='tatami'){x.strokeStyle='rgba(90,110,40,.45)';x.lineWidth=6;x.strokeRect(3,3,w-6,h/2-6);x.strokeRect(3,h/2+3,w/2-6,h/2-6);x.strokeRect(w/2+3,h/2+3,w/2-6,h/2-6);x.strokeStyle='rgba(90,110,40,.18)';x.lineWidth=2;for(let i=0;i<h;i+=8){x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke()}}
 else if(pat==='check'){x.fillStyle=dk;for(let i=0;i<w;i+=64)for(let j=0;j<h;j+=64)if(((i+j)/64)%2)x.fillRect(i,j,64,64)}
 else if(pat==='dots'){x.fillStyle='rgba(180,150,90,.35)';for(let i=0;i<60;i++){x.beginPath();x.arc((i*53)%w,(i*29)%h,2,0,7);x.fill()}}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const House={
 enter(){const H=S.house;const R=HOUSE[H.tier].room;const grp=new THREE.Group();G.scene.add(grp);G.worldGrp.visible=false;
  Crit.reset&&0;
  G.interior={grp,R,camTarget:new THREE.Vector3(R/2,0,R/2+.3),camDist:R/5.2+.35,pos:new THREE.Vector3(R/2,0,R-.5),yaw:Math.PI,deco:false,sel:null,meshes:[]};
  this.buildRoom();G.scene.remove(G.player);grp.add(G.player);G.player.position.set(R/2,0,R-.5);G.player.rotation.y=Math.PI;
  G.light=new THREE.PointLight(0xffe2b0,.7,R*2.2);G.light.position.set(R/2,2.6,R/2);grp.add(G.light);
  updateSky(true);SFX.play('door');Music.indoor(true);UI.show('house');Tut.ev('enter');save()},
 exit(){const I=G.interior;if(!I)return;this.decoEnd();G.scene.remove(I.grp);I.grp.remove(G.player);G.scene.add(G.player);G.worldGrp.visible=true;G.interior=null;
  const hm=G.homeM;G.pp.set(hm.position.x,0,hm.position.z+hm.userData.door.z+.35);G.pp.y=walkH(G.W,G.pp.x,G.pp.z)||.3;G.yaw=0;G.player.position.copy(G.pp);
  updateSky(true);updateCamera(0,true);SFX.play('door');Music.indoor(false);UI.show('hud');save()},
 buildRoom(){const I=G.interior,R=I.R,H=S.house;for(const m of I.meshes)I.grp.remove(m);I.meshes=[];
  const add=m=>{I.grp.add(m);I.meshes.push(m);return m};
  const fl=ITEMS[H.floor]||ITEMS.f_plank,wl=ITEMS[H.wall]||ITEMS.w_cream;
  const ft=patCanvas(fl.col,fl.pat);ft.repeat.set(R/2,R/2);const f=add(new THREE.Mesh(new THREE.PlaneGeometry(R,R),new THREE.MeshLambertMaterial({map:ft})));f.rotation.x=-Math.PI/2;f.position.set(R/2,0,R/2);f.receiveShadow=true;I.floor=f;
  const base=add(mesh(box(R+.4,.3,R+.4),'#8a6a4a'));base.position.set(R/2,-.16,R/2);
  const wt=patCanvas(wl.col,wl.pat);wt.repeat.set(R/2,1.2);const wm=new THREE.MeshLambertMaterial({map:wt});
  const wb=add(new THREE.Mesh(new THREE.BoxGeometry(R+.4,2.6,.2),wm));wb.position.set(R/2,1.3,-.1);wb.receiveShadow=true;
  const wl2=add(new THREE.Mesh(new THREE.BoxGeometry(.2,2.6,R+.2),wm));wl2.position.set(-.1,1.3,R/2);const wr=add(new THREE.Mesh(new THREE.BoxGeometry(.2,2.6,R+.2),wm));wr.position.set(R+.1,1.3,R/2);
  const trim=add(mesh(box(R+.4,.12,.24),'#ffffff'));trim.position.set(R/2,.06,-.05);
  // window on back wall
  const win=add(new THREE.Mesh(box(1.1,.8,.05),new THREE.MeshBasicMaterial({color:G.isNight?0x2a3560:0xbfe9ff})));win.position.set(R/2+(R>4?1.2:0),1.5,.02);const wf=add(mesh(box(1.25,.95,.04),'#ffffff'));wf.position.set(win.position.x,1.5,0);
  // door mat
  const dm=add(new THREE.Mesh(new THREE.PlaneGeometry(1,.6),new THREE.MeshLambertMaterial({color:0xc98f4f})));dm.rotation.x=-Math.PI/2;dm.position.set(R/2,.01,R-.3);
  I.fm=[];for(const it of H.room){const m=makeFurn(it.id,it.x2);m.rotation.y=(it.r||0)*Math.PI/2;const [w,d]=this.size(it);m.position.set(it.x+w/2,0,it.z+d/2);add(m);it._m=m;I.fm.push(m)}
  if(I.deco)this.grid(true)},
 size(it){const s=FSIZE[it.id]||[1,1];return (it.r||0)%2?[s[1],s[0]]:s},
 occ(ignore){const R=G.interior.R;const o=new Set();for(const it of S.house.room){if(it===ignore||it.id==='rug')continue;const [w,d]=this.size(it);for(let a=0;a<w;a++)for(let b=0;b<d;b++)o.add((it.x+a)+','+(it.z+b))}return o},
 fits(it,x,z){const R=G.interior.R;const [w,d]=this.size(it);if(x<0||z<0||x+w>R||z+d>R)return false;if(z+d>=R&&Math.abs(x+w/2-R/2)<1&&it.id!=='rug')return false;if(it.id==='rug')return true;const o=this.occ(it);for(let a=0;a<w;a++)for(let b=0;b<d;b++)if(o.has((x+a)+','+(z+b)))return false;return true},
 update(dt){const I=G.interior;if(!I)return;const j=G.joy;let mag=Math.min(1,Math.hypot(j.x,j.y));if(UI.blocking()||I.deco)mag=0;const sp=mag<.05?0:2.4;
  const p=I.pos;if(sp){const ang=Math.atan2(j.x,j.y);let d=ang-I.yaw;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;I.yaw+=d*Math.min(1,dt*14);
   const nx=p.x+Math.sin(I.yaw)*sp*dt,nz=p.z+Math.cos(I.yaw)*sp*dt;const o=this.occ();const ok=(x,z)=>x>.3&&z>.3&&x<I.R-.3&&z<I.R-.2&&!o.has(Math.floor(x)+','+Math.floor(z));
   if(ok(nx,p.z))p.x=nx;if(ok(p.x,nz))p.z=nz}
  const u=G.player.userData;const ph=G.t*9;const amp=sp?.45:0;u.legs[0].rotation.x=Math.sin(ph)*amp;u.legs[1].rotation.x=-Math.sin(ph)*amp;u.arms[0].rotation.x=-Math.sin(ph)*amp*.8;u.arms[1].rotation.x=Math.sin(ph)*amp*.8;
  G.player.position.set(p.x,0,p.z);G.player.rotation.y=I.yaw;
  I.camTarget.set(I.R/2,0,I.R/2+.3);
  for(const m of I.fm){if(m.userData.flame){m.userData.flame[0].scale.y=1+Math.sin(G.t*12)*.15}if(m.userData.fish){m.userData.fish.position.x=Math.sin(G.t*.8)*.25;m.userData.fish.rotation.y=Math.cos(G.t*.8)>0?0:Math.PI}if(m.userData.screen)m.userData.screen.material.color.setHSL((G.t*.1)%1,.7,.6);if(m.userData.glow2)m.userData.glow2.rotation.y+=dt}
  if(I.sel&&I.ghost){I.ghost.position.y=.05+Math.sin(G.t*5)*.04}},
 nearDoor(){const I=G.interior;return I&&I.pos.z>I.R-1.1&&Math.abs(I.pos.x-I.R/2)<1.0},
 // ---------- decorate ----------
 decoStart(){const I=G.interior;I.deco=true;this.grid(true);UI.deco()},
 decoEnd(){const I=G.interior;if(!I||!I.deco)return;I.deco=false;this.grid(false);this.clearGhost();I.sel=null;UI.decoClose&&UI.decoClose()},
 grid(on){const I=G.interior;if(I.gridM){I.grp.remove(I.gridM);I.gridM=null}if(!on)return;const R=I.R;const pts=[];for(let i=0;i<=R;i++){pts.push(i,.02,0,i,.02,R,0,.02,i,R,.02,i)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));I.gridM=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.5}));I.grp.add(I.gridM)},
 clearGhost(){const I=G.interior;if(I&&I.ghost){I.grp.remove(I.ghost);I.ghost=null}},
 pickCell(cx,cy){const I=G.interior;const r=new THREE.Raycaster();r.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),G.cam);const h=r.intersectObject(I.floor);if(!h.length)return null;const p=h[0].point;return [Math.floor(p.x),Math.floor(p.z)]},
 at(x,z){for(let i=S.house.room.length-1;i>=0;i--){const it=S.house.room[i];const [w,d]=this.size(it);if(x>=it.x&&x<it.x+w&&z>=it.z&&z<it.z+d)return it}return null},
 tapFloor(cx,cy){const I=G.interior;if(!I||!I.deco)return;const c=this.pickCell(cx,cy);if(!c)return;const [x,z]=c;
  if(I.sel){// move/place selected
   const it=I.sel;if(!this.fits(it,x,z)){UI.toast(T('roomFull'));SFX.play('nope');return}it.x=x;it.z=z;if(it._new){S.house.room.push(it);delete it._new;stat('deco')}I.sel=null;this.clearGhost();this.buildRoom();SFX.play('place');UI.decoSel(null);save();Tut.ev('deco');return}
  const it=this.at(x,z);if(it){I.sel=it;this.ghostFor(it);UI.decoSel(it);SFX.play('tap')}},
 ghostFor(it){const I=G.interior;this.clearGhost();const m=makeFurn(it.id,it.x2);m.rotation.y=(it.r||0)*Math.PI/2;const [w,d]=this.size(it);m.position.set(it.x+w/2,.05,it.z+d/2);m.traverse(c=>{if(c.material){c.material=c.material.clone();c.material.transparent=true;c.material.opacity=.6;if(c.material.emissive)c.material.emissive.setHex(0x335533)}});I.grp.add(m);I.ghost=m;if(it._m)it._m.visible=false},
 newItem(id,x2){const I=G.interior;const it={id,x:0,z:0,r:0,_new:true};if(x2)it.x2=x2;// find a free spot to preview
  outer:for(let z=0;z<I.R;z++)for(let x=0;x<I.R;x++)if(this.fits(it,x,z)){it.x=x;it.z=z;break outer}
  I.sel=it;this.ghostFor(it);UI.decoSel(it)},
 rotate(){const I=G.interior,it=I.sel;if(!it)return;it.r=((it.r||0)+1)%4;if(!it._new&&!this.fits(it,it.x,it.z)){it.r=(it.r+3)%4;UI.toast(T('roomFull'));return}if(!it._new)this.buildRoom();this.ghostFor(it);SFX.play('tap');save()},
 store(){const I=G.interior,it=I.sel;if(!it)return;if(!it._new){S.house.room.splice(S.house.room.indexOf(it),1);S.storage.push({id:it.id,q:1,x:it.x2})}else{S.storage.push({id:it.id,q:1,x:it.x2})}I.sel=null;this.clearGhost();this.buildRoom();UI.decoSel(null);SFX.play('pop');save()},
 cancelSel(){const I=G.interior;const it=I.sel;if(!it)return;if(it._new){S.storage.push({id:it.id,q:1,x:it.x2})}I.sel=null;this.clearGhost();this.buildRoom();UI.decoSel(null)},
 setSurface(id){const it=ITEMS[id];const H=S.house;const k=it.cat==='wall'?'wall':'floor';const old=H[k];H[k]=id;S.owned[id]=1;if(old&&old!==id)S.owned[old]=1;this.buildRoom();SFX.play('place');save()},
};
