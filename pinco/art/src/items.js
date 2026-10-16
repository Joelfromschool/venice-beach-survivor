// ===== Pinco item catalogue + vector art (unit space: photo 466x560, legs to y≈905) =====
const SW=[['#ff7eb6','Bubblegum'],['#ff3d8b','Hot Pink'],['#ff8a65','Coral'],['#ff9a2e','Pumpkin'],['#ffcc33','Gold'],['#fff176','Lemon'],['#7ee8c6','Mint'],['#4fd8ff','Aqua'],['#b39dff','Lilac'],['#8e44ec','Grape'],['#2c3e8f','Midnight'],['#d6dbe6','Silver'],['#2b2233','Licorice'],['#fffafc','Cloud']];
const THEMES=[
 {id:'royal',n:'Royal Ball',e:'👑',p:['#ffcc33','#8e44ec','#ff7eb6','#b39dff','#fffafc'],bg:'ballroom',hint:'Gowns, crowns, pearls & sparkle!'},
 {id:'beach',n:'Beach Day',e:'🏖️',p:['#4fd8ff','#fff176','#ff8a65','#7ee8c6','#fffafc'],bg:'beach',hint:'Sunny, breezy & bright!'},
 {id:'pop',n:'Pop Star',e:'🎤',p:['#ff3d8b','#8e44ec','#4fd8ff','#ffcc33','#2b2233'],bg:'concert',hint:'Bold, loud & shiny!'},
 {id:'space',n:'Space Princess',e:'🚀',p:['#d6dbe6','#b39dff','#2c3e8f','#4fd8ff','#fffafc'],bg:'space',hint:'Silver, stars & cosmic glow!'},
 {id:'spooky',n:'Spooky Cute',e:'🦇',p:['#8e44ec','#ff9a2e','#2b2233','#7ee8c6','#b39dff'],bg:'spooky',hint:'Cute bats, pumpkins & purple!'},
 {id:'sweet',n:'Sweet Picnic',e:'🧁',p:['#ff7eb6','#fff176','#7ee8c6','#fffafc','#ff8a65'],bg:'bedroom',hint:'Pastels, bows & treats!'}];
const CATS=[['top','Dresses','👗'],['bot','Bottoms','🩳'],['shoe','Shoes','👠'],['hat','Crowns','👑'],['acc','Extras','💎'],['bow','Bows','🎀'],['wand','Wands','🪄'],['bg','Places','🏞️']];
// layer order (back→front)
const ORDER=['bg','capeback','legs','bot','shoe','top','acc','bow','hat','wand'];
function sh(c,a){let n=parseInt(c.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const f=a<0?0:255,t=Math.abs(a);r=Math.round((f-r)*t+r);g=Math.round((f-g)*t+g);b=Math.round((f-b)*t+b);return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function lg(x,y0,y1,c,k){const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,sh(c,.35*(k||1)));g.addColorStop(.55,c);g.addColorStop(1,sh(c,-.28*(k||1)));return g;}
function rg(x,cx,cy,r,c){const g=x.createRadialGradient(cx-r*.3,cy-r*.35,r*.1,cx,cy,r);g.addColorStop(0,sh(c,.55));g.addColorStop(.6,c);g.addColorStop(1,sh(c,-.3));return g;}
function fillP(x,p,fill,c,lw){x.fillStyle=fill;x.fill(p);x.lineWidth=lw||5;x.strokeStyle=sh(c,-.5);x.lineJoin='round';x.stroke(p);}
function spark(x,cx,cy,r,a){x.save();x.globalAlpha=a==null?.95:a;x.fillStyle='#fff';x.beginPath();for(let i=0;i<8;i++){const ang=i*Math.PI/4,rr=i%2?r*.28:r;x.lineTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr);}x.fill();x.restore();}
function gloss(x,p,y0,y1){x.save();x.clip(p);const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'rgba(255,255,255,.38)');g.addColorStop(.35,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(-100,y0,700,y1-y0);x.restore();}
function starP(cx,cy,r,ri){const p=new Path2D();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?(ri||r*.45):r;p.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}p.closePath();return p;}
function heartP(cx,cy,s){const p=new Path2D();p.moveTo(cx,cy+s*.9);p.bezierCurveTo(cx-s*1.3,cy+s*.1,cx-s*.9,cy-s*.95,cx,cy-s*.35);p.bezierCurveTo(cx+s*.9,cy-s*.95,cx+s*1.3,cy+s*.1,cx,cy+s*.9);return p;}
function circP(cx,cy,r){const p=new Path2D();p.arc(cx,cy,r,0,7);return p;}
function rrP(x0,y0,w,h,r){const p=new Path2D();p.roundRect?p.roundRect(x0,y0,w,h,r):p.rect(x0,y0,w,h);return p;}
// ---------- shapes (Path2D) for tops so stamps can clip ----------
const TOPSHAPE={
 gown(){const p=new Path2D();p.moveTo(98,212);p.quadraticCurveTo(195,192,298,212);p.lineTo(286,372);p.bezierCurveTo(340,470,420,700,430,860);for(let i=0;i<8;i++){const x0=430-i*55;p.quadraticCurveTo(x0-27,895,x0-55,862);}p.bezierCurveTo(-20,700,60,470,108,372);p.closePath();return p;},
 sun(){const p=new Path2D();p.moveTo(110,218);p.lineTo(285,218);p.lineTo(292,360);p.quadraticCurveTo(360,500,372,640);for(let i=0;i<6;i++){const x0=372-i*50;p.quadraticCurveTo(x0-25,668,x0-50,640);}p.quadraticCurveTo(30,500,104,360);p.closePath();return p;},
 pop(){const p=new Path2D();p.moveTo(96,214);p.quadraticCurveTo(195,196,300,214);p.lineTo(300,340);p.quadraticCurveTo(198,362,96,340);p.closePath();return p;},
 spacedr(){const p=new Path2D();p.moveTo(70,206);p.quadraticCurveTo(100,190,140,200);p.quadraticCurveTo(195,214,250,200);p.quadraticCurveTo(300,190,326,206);p.lineTo(296,250);p.lineTo(292,370);p.lineTo(352,640);p.lineTo(44,640);p.lineTo(104,370);p.lineTo(100,250);p.closePath();return p;},
 spooky(){const p=new Path2D();p.moveTo(100,214);p.quadraticCurveTo(195,198,296,214);p.lineTo(290,370);p.quadraticCurveTo(360,500,380,650);const n=7;for(let i=0;i<n;i++){const x0=380-i*(360/n);p.lineTo(x0-(360/n)/2,610);p.lineTo(x0-360/n,650);}p.quadraticCurveTo(30,500,106,370);p.closePath();return p;},
 tee(){const p=new Path2D();p.moveTo(98,210);p.lineTo(40,300);p.lineTo(86,330);p.lineTo(104,300);p.lineTo(100,420);p.quadraticCurveTo(198,436,296,420);p.lineTo(292,300);p.lineTo(316,330);p.lineTo(362,300);p.lineTo(298,208);p.quadraticCurveTo(198,240,98,210);p.closePath();return p;},
 hoodie(){const p=new Path2D();p.moveTo(92,200);p.lineTo(30,320);p.lineTo(78,350);p.lineTo(102,310);p.lineTo(96,440);p.quadraticCurveTo(198,458,302,440);p.lineTo(296,310);p.lineTo(322,350);p.lineTo(372,320);p.lineTo(304,198);p.quadraticCurveTo(198,180,92,200);p.closePath();return p;},
 mermaid(){const p=new Path2D();p.moveTo(102,214);p.quadraticCurveTo(198,198,294,214);p.lineTo(292,380);p.quadraticCurveTo(300,560,262,720);p.quadraticCurveTo(360,820,380,890);p.quadraticCurveTo(198,850,16,890);p.quadraticCurveTo(36,820,134,720);p.quadraticCurveTo(96,560,104,380);p.closePath();return p;},
 overall(){const p=new Path2D();p.moveTo(130,250);p.lineTo(266,250);p.lineTo(266,300);p.lineTo(300,330);p.lineTo(310,600);p.lineTo(214,600);p.lineTo(200,520);p.lineTo(186,600);p.lineTo(90,600);p.lineTo(96,330);p.lineTo(130,300);p.closePath();return p;}
};
const TORSO=()=>rrP(92,206,212,360,40);
function drawTop(x,it,c){const p=TOPSHAPE[it.shape]();
 if(it.shape==='gown'){fillP(x,p,lg(x,200,880,c),c);x.save();x.clip(p);x.globalAlpha=.25;x.fillStyle=sh(c,-.4);for(let i=0;i<7;i++){x.beginPath();x.moveTo(195,380);x.quadraticCurveTo(140+i*16,620,40+i*55,880);x.lineWidth=4;x.strokeStyle=sh(c,-.35);x.stroke();}x.restore();
  const w=new Path2D();w.moveTo(104,362);w.quadraticCurveTo(198,388,292,362);w.lineTo(290,392);w.quadraticCurveTo(198,416,106,392);w.closePath();fillP(x,w,lg(x,360,410,'#ffcc33'),'#ffcc33',3);gloss(x,p,200,500);}
 else if(it.shape==='sun'){fillP(x,p,lg(x,210,670,c),c);x.save();x.clip(p);x.fillStyle='rgba(255,255,255,.55)';for(let yy=260;yy<660;yy+=60)for(let xx=40;xx<380;xx+=60){x.fill(circP(xx+(yy/60%2)*30,yy,9));}x.restore();x.strokeStyle=sh(c,-.4);x.lineWidth=7;x.beginPath();x.moveTo(126,220);x.lineTo(140,170);x.moveTo(270,220);x.lineTo(256,170);x.stroke();gloss(x,p,210,450);}
 else if(it.shape==='pop'){fillP(x,p,lg(x,200,360,c),c);x.save();x.clip(p);for(let yy=214;yy<370;yy+=14)for(let xx=90;xx<310;xx+=14){x.fillStyle=(xx+yy)%28?sh(c,.35):sh(c,-.2);x.fill(circP(xx+(yy%28?7:0),yy,5.5));}x.restore();x.lineWidth=5;x.strokeStyle=sh(c,-.5);x.stroke(p);spark(x,140,250,14);spark(x,260,300,10);}
 else if(it.shape==='spacedr'){fillP(x,p,lg(x,190,650,c,1.3),c);x.save();x.clip(p);x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=3;for(let i=0;i<4;i++){x.beginPath();x.moveTo(60+i*10,420+i*60);x.lineTo(340-i*10,420+i*60);x.stroke();}x.restore();const b=rrP(100,360,196,26,10);fillP(x,b,lg(x,360,390,'#4fd8ff'),'#4fd8ff',3);x.fillStyle='#fff';x.fill(starP(198,373,13));gloss(x,p,190,420);}
 else if(it.shape==='spooky'){fillP(x,p,lg(x,210,660,c),c);x.save();x.clip(p);x.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<5;i++)x.fillRect(40+i*70,370,30,300);x.restore();x.stroke(p);const col=new Path2D();col.moveTo(100,214);col.lineTo(60,180);col.lineTo(130,200);col.lineTo(150,170);col.lineTo(198,205);col.lineTo(246,170);col.lineTo(266,200);col.lineTo(336,180);col.lineTo(296,214);col.closePath();fillP(x,col,lg(x,170,215,'#2b2233'),'#2b2233',3);gloss(x,p,210,420);}
 else if(it.shape==='tee'){fillP(x,p,lg(x,200,430,c),c);x.fillStyle=sh(c,.5);x.fill(heartP(198,320,38));x.lineWidth=4;x.strokeStyle=sh(c,-.4);x.stroke(heartP(198,320,38));gloss(x,p,200,330);}
 else if(it.shape==='hoodie'){fillP(x,p,lg(x,190,460,c),c);const pk=rrP(140,360,116,56,20);fillP(x,pk,sh(c,-.1),c,4);x.strokeStyle='#fff';x.lineWidth=5;x.beginPath();x.moveTo(176,214);x.lineTo(170,290);x.moveTo(220,214);x.lineTo(226,290);x.stroke();x.fillStyle='#fff';x.fill(circP(170,294,7));x.fill(circP(226,294,7));gloss(x,p,190,320);}
 else if(it.shape==='mermaid'){fillP(x,p,lg(x,200,890,c),c);x.save();x.clip(p);x.strokeStyle=sh(c,.4);x.lineWidth=3;for(let yy=390;yy<900;yy+=22)for(let xx=0;xx<400;xx+=28){x.beginPath();x.arc(xx+(yy/22%2)*14,yy,13,0,Math.PI);x.stroke();}x.restore();x.lineWidth=5;x.strokeStyle=sh(c,-.5);x.stroke(p);spark(x,150,500,12);spark(x,250,640,10);gloss(x,p,200,600);}
 else if(it.shape==='overall'){fillP(x,p,lg(x,240,610,c),c);x.strokeStyle=sh(c,-.4);x.lineWidth=10;x.beginPath();x.moveTo(140,252);x.lineTo(120,206);x.moveTo(256,252);x.lineTo(276,206);x.stroke();x.fillStyle='#ffcc33';x.fill(circP(140,262,9));x.fill(circP(256,262,9));const pk=rrP(160,300,76,50,12);fillP(x,pk,sh(c,.15),c,3);gloss(x,p,240,420);}
 return p;}
// ---------- bottoms ----------
function legX(side,y){const t=(y-540)/360;return side?246+10*t:150-8*t;}
function drawBot(x,it,c){let p;
 if(it.k==='tutu'){for(let L=0;L<3;L++){p=new Path2D();const y0=380+L*14,y1=520+L*26,w=130+L*30;p.moveTo(198-90,y0);for(let i=0;i<=12;i++){const xx=198-w+i*(2*w/12);p.quadraticCurveTo(xx-w/12,y1+14,xx,y1);}p.lineTo(198+90,y0);p.closePath();x.globalAlpha=.75+L*.08;fillP(x,p,lg(x,y0,y1,sh(c,L*.12)),c,3);}x.globalAlpha=1;for(let i=0;i<6;i++)spark(x,90+i*40,470+(i%2)*40,8,.8);return p;}
 if(it.k==='shorts'){p=new Path2D();p.moveTo(96,380);p.lineTo(300,380);p.lineTo(316,610);p.lineTo(214,616);p.lineTo(198,520);p.lineTo(182,616);p.lineTo(80,610);p.closePath();fillP(x,p,lg(x,380,620,c),c);x.strokeStyle='rgba(255,255,255,.6)';x.setLineDash([8,7]);x.lineWidth=3;x.beginPath();x.moveTo(100,402);x.lineTo(296,402);x.stroke();x.setLineDash([]);gloss(x,p,380,500);return p;}
 if(it.k==='leggings'){p=new Path2D();p.moveTo(98,380);p.lineTo(298,380);p.lineTo(legX(1,880)+26,880);p.lineTo(legX(1,880)-26,880);p.lineTo(198,560);p.lineTo(legX(0,880)+26,880);p.lineTo(legX(0,880)-26,880);p.closePath();fillP(x,p,lg(x,380,880,c),c);x.save();x.clip(p);x.fillStyle='rgba(255,255,255,.35)';for(let yy=420;yy<880;yy+=46){x.fill(starP(legX(0,yy),yy,10));x.fill(starP(legX(1,yy+23),yy+23,10));}x.restore();return p;}
 if(it.k==='starskirt'){p=new Path2D();p.moveTo(104,380);p.lineTo(292,380);p.lineTo(350,640);p.quadraticCurveTo(198,670,46,640);p.closePath();fillP(x,p,lg(x,380,660,c),c);x.save();x.clip(p);x.fillStyle='#ffcc33';for(let i=0;i<9;i++)x.fill(starP(80+((i*67)%260),430+((i*41)%200),13));x.restore();gloss(x,p,380,520);return p;}
 if(it.k==='cargo'){p=new Path2D();p.moveTo(92,380);p.lineTo(304,380);p.lineTo(318,890);p.lineTo(212,890);p.lineTo(198,560);p.lineTo(184,890);p.lineTo(78,890);p.closePath();fillP(x,p,lg(x,380,890,c),c);fillP(x,rrP(84,600,48,60,8),sh(c,-.1),c,3);fillP(x,rrP(266,600,48,60,8),sh(c,-.1),c,3);return p;}
 if(it.k==='bloomers'){p=new Path2D();p.moveTo(100,380);p.lineTo(296,380);p.quadraticCurveTo(330,560,300,600);p.quadraticCurveTo(250,620,206,590);p.lineTo(198,540);p.lineTo(190,590);p.quadraticCurveTo(146,620,96,600);p.quadraticCurveTo(66,560,100,380);fillP(x,p,lg(x,380,620,c),c);x.save();x.clip(p);x.fillStyle='rgba(255,255,255,.6)';for(let yy=400;yy<620;yy+=40)for(let xx=90;xx<320;xx+=40)x.fill(heartP(xx+(yy/40%2)*20,yy,9));x.restore();return p;}
}
// ---------- shoes ----------
function feet(cb){cb(legX(0,900),906,-1);cb(legX(1,900),906,1);}
function drawShoe(x,it,c){feet((fx,fy,s)=>{let p;
 if(it.k==='heels'){p=new Path2D();p.moveTo(fx-30,fy-16);p.quadraticCurveTo(fx,fy-34,fx+34*1,fy-6);p.lineTo(fx+36,fy+10);p.lineTo(fx-24,fy+10);p.closePath();fillP(x,p,lg(x,fy-34,fy+10,c),c,4);fillP(x,rrP(fx-28,fy+6,10,30,4),sh(c,-.3),c,3);x.fill(circP(fx+4,fy-20,0));x.fillStyle='#fff';x.fill(heartP(fx+4,fy-14,9));}
 else if(it.k==='sneaks'){p=rrP(fx-34,fy-26,74,40,18);fillP(x,p,lg(x,fy-26,fy+14,c),c,4);fillP(x,rrP(fx-36,fy+4,78,14,7),'#fffafc','#d6dbe6',3);x.strokeStyle='#fff';x.lineWidth=3;for(let i=0;i<3;i++){x.beginPath();x.moveTo(fx-12+i*10,fy-22);x.lineTo(fx-4+i*10,fy-12);x.stroke();}}
 else if(it.k==='boots'){p=new Path2D();p.moveTo(fx-24,fy-120);p.lineTo(fx+22,fy-120);p.lineTo(fx+24,fy-20);p.quadraticCurveTo(fx+46,fy-14,fx+44,fy+14);p.lineTo(fx-28,fy+14);p.closePath();fillP(x,p,lg(x,fy-120,fy+14,c),c,4);fillP(x,rrP(fx-28,fy-128,54,16,8),sh(c,.35),c,3);gloss(x,p,fy-120,fy-40);}
 else if(it.k==='jelly'){p=rrP(fx-32,fy-10,70,22,10);x.globalAlpha=.8;fillP(x,p,lg(x,fy-10,fy+12,c),c,3);x.globalAlpha=1;x.strokeStyle=c;x.lineWidth=7;x.beginPath();x.moveTo(fx-20,fy-6);x.quadraticCurveTo(fx,fy-34,fx+24,fy-6);x.stroke();x.fillStyle='#fff';x.fill(circP(fx,fy-22,6));}
 else if(it.k==='moon'){p=rrP(fx-36,fy-60,80,76,30);fillP(x,p,lg(x,fy-60,fy+16,c,1.3),c,4);fillP(x,rrP(fx-38,fy-66,84,18,9),'#fffafc','#d6dbe6',3);x.fillStyle='#4fd8ff';x.fill(starP(fx+4,fy-24,14));gloss(x,p,fy-60,fy-20);}
 else if(it.k==='slippers'){p=new Path2D();p.ellipse(fx+4,fy,40,20,0,0,7);fillP(x,p,rg(x,fx+4,fy-6,40,c),c,3);x.fillStyle='#fffafc';x.fill(circP(fx-14,fy-16,8));x.fill(circP(fx+2,fy-18,8));x.fillStyle='#2b2233';x.fill(circP(fx+24,fy-6,3.5));x.fill(circP(fx+12,fy-6,3.5));}
});}
// ---------- hats ----------
function drawHat(x,it,c){if(it.k!=='helmet'){x.save();x.translate(0,-34);_hat(x,it,c);x.restore();}else _hat(x,it,c);}
function _hat(x,it,c){let p;
 if(it.k==='tiara'){p=new Path2D();p.moveTo(110,40);p.quadraticCurveTo(170,-10,250,30);p.lineTo(240,46);p.quadraticCurveTo(172,10,118,52);p.closePath();fillP(x,p,lg(x,0,50,c),c,3);for(const [px,py,r] of [[132,24,10],[178,4,16],[222,14,11]]){fillP(x,starP(px,py,r),'#fff','#b39dff',2);}x.fillStyle='#ff3d8b';x.fill(circP(178,26,8));spark(x,200,-14,12);}
 else if(it.k==='crown'){p=new Path2D();p.moveTo(100,46);p.lineTo(92,-40);p.lineTo(132,-6);p.lineTo(160,-62);p.lineTo(188,-8);p.lineTo(220,-60);p.lineTo(246,-6);p.lineTo(282,-38);p.lineTo(270,46);p.quadraticCurveTo(186,30,100,46);p.closePath();fillP(x,p,lg(x,-62,46,c,1.2),c,5);for(const [px,py,cc] of [[160,-62,'#ff3d8b'],[220,-60,'#4fd8ff'],[92,-40,'#7ee8c6'],[282,-38,'#b39dff']])fillP(x,circP(px,py,9),rg(x,px,py,9,cc),cc,2);fillP(x,rrP(150,10,60,24,10),rg(x,180,22,26,'#ff3d8b'),'#ff3d8b',3);gloss(x,p,-60,40);spark(x,120,-20,10);}
 else if(it.k==='sunhat'){p=new Path2D();p.ellipse(176,40,190,46,-.12,0,7);fillP(x,p,lg(x,-6,86,c),c,5);const d=new Path2D();d.ellipse(176,10,96,62,-.12,Math.PI,0);d.closePath();fillP(x,d,lg(x,-52,40,c),c,5);fillP(x,rrP(84,10,184,22,10),'#ff7eb6','#ff7eb6',3);x.fillStyle='#fff176';x.fill(circP(258,22,14));x.fillStyle='#ff8a65';x.fill(circP(258,22,6));}
 else if(it.k==='witch'){p=new Path2D();p.ellipse(176,46,170,34,-.1,0,7);fillP(x,p,lg(x,12,80,c),c,5);const d=new Path2D();d.moveTo(96,40);d.quadraticCurveTo(150,-60,200,-170);d.quadraticCurveTo(260,-170,290,-130);d.quadraticCurveTo(240,-140,224,-90);d.quadraticCurveTo(240,-20,256,36);d.closePath();fillP(x,d,lg(x,-170,40,c),c,5);fillP(x,rrP(104,8,152,24,8),'#ff9a2e','#ff9a2e',3);x.fillStyle='#ffcc33';x.fill(starP(170,-60,14));x.fill(starP(220,-110,9));}
 else if(it.k==='helmet'){p=circP(178,86,150);x.save();x.globalAlpha=.28;x.fillStyle=rg(x,178,86,150,c);x.fill(p);x.restore();x.lineWidth=7;x.strokeStyle=sh(c,.2);x.stroke(p);x.save();x.globalAlpha=.7;x.strokeStyle='#fff';x.lineWidth=9;x.beginPath();x.arc(178,86,124,3.6,4.4);x.stroke();x.restore();fillP(x,rrP(80,200,196,30,14),lg(x,200,230,'#d6dbe6'),'#d6dbe6',4);x.fillStyle='#ff3d8b';x.fill(circP(178,-62,10));x.strokeStyle='#d6dbe6';x.lineWidth=4;x.beginPath();x.moveTo(178,-64);x.lineTo(178,-80);x.stroke();}
 else if(it.k==='beret'){p=new Path2D();p.ellipse(150,24,120,44,-.25,0,7);fillP(x,p,rg(x,150,20,120,c),c,5);x.fillStyle=sh(c,-.4);x.fill(circP(120,-16,9));gloss(x,p,-20,40);}
 else if(it.k==='bunny'){for(const s of[0,1]){p=new Path2D();const bx=s?224:132;p.ellipse(bx,-50,24,66,s?.25:-.25,0,7);fillP(x,p,lg(x,-116,16,c),c,4);const q=new Path2D();q.ellipse(bx,-46,11,46,s?.25:-.25,0,7);x.fillStyle='#ff7eb6';x.fill(q);}fillP(x,rrP(100,12,170,16,8),c,c,3);}
}
// ---------- accessories ----------
function drawAcc(x,it,c,back){
 if(it.k==='cape'){if(!back)return fillP(x,rrP(110,196,176,22,10),lg(x,196,218,'#ffcc33'),'#ffcc33',3);const p=new Path2D();p.moveTo(104,206);p.quadraticCurveTo(198,190,292,206);p.quadraticCurveTo(420,520,410,860);p.quadraticCurveTo(198,900,-14,860);p.quadraticCurveTo(-24,520,104,206);fillP(x,p,lg(x,200,880,c),c,5);x.save();x.clip(p);x.fillStyle='rgba(255,255,255,.4)';for(let i=0;i<14;i++)x.fill(starP(10+((i*97)%400),300+((i*131)%540),8));x.restore();return;}
 if(back)return;
 if(it.k==='pearls'){for(let i=0;i<13;i++){const a=Math.PI*(.12+i*.0635),px=198+Math.cos(a)*112,py=196+Math.sin(a)*48;fillP(x,circP(px,py,11),rg(x,px,py,11,c),c,2);}spark(x,150,236,8);}
 else if(it.k==='shades'){const p=new Path2D();p.ellipse(130,48,34,24,0,0,7);p.moveTo(250,40);p.ellipse(214,42,30,22,0,0,7);fillP(x,p,lg(x,22,72,c),c,5);x.strokeStyle=sh(c,-.5);x.lineWidth=6;x.beginPath();x.moveTo(164,46);x.lineTo(184,44);x.moveTo(96,46);x.lineTo(68,40);x.stroke();x.fillStyle='rgba(255,255,255,.7)';x.fill(circP(118,38,7));x.fill(circP(204,34,6));}
 else if(it.k==='purse'){x.strokeStyle=sh(c,-.4);x.lineWidth=6;x.beginPath();x.arc(36,470,28,Math.PI,0);x.stroke();const p=heartP(36,520,44);fillP(x,p,rg(x,36,510,50,c),c,4);spark(x,24,500,9);}
 else if(it.k==='mic'){fillP(x,rrP(440,430,18,90,8),lg(x,430,520,'#2b2233'),'#2b2233',3);fillP(x,circP(449,418,26),rg(x,449,418,26,c),c,4);x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=2;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(430,418+i*8);x.lineTo(468,418+i*8);x.stroke();}spark(x,460,404,9);}
 else if(it.k==='earstar'){for(const [px,py] of [[86,86],[276,98]]){x.strokeStyle='#ffcc33';x.lineWidth=3;x.beginPath();x.moveTo(px,py);x.lineTo(px,py+22);x.stroke();fillP(x,starP(px,py+38,18),rg(x,px,py+38,18,c),c,3);}}
 else if(it.k==='wings'){/* drawn back */}
}
function drawWings(x,c){for(const s of[-1,1]){const p=new Path2D();p.moveTo(198,260);p.bezierCurveTo(198+s*120,120,198+s*260,170,198+s*230,320);p.bezierCurveTo(198+s*260,420,198+s*120,440,198,330);x.globalAlpha=.6;fillP(x,p,rg(x,198+s*160,280,160,c),c,4);x.globalAlpha=1;}spark(x,60,220,10);spark(x,340,240,12);}
// ---------- bows ----------
function drawBow(x,it,c){const bx=96,by=34;
 if(it.k==='flower'){for(let i=0;i<6;i++){const a=i*Math.PI/3;fillP(x,circP(bx+Math.cos(a)*20,by+Math.sin(a)*20,15),rg(x,bx+Math.cos(a)*20,by+Math.sin(a)*20,15,c),c,3);}fillP(x,circP(bx,by,12),rg(x,bx,by,12,'#ffcc33'),'#ffcc33',3);return;}
 const big=it.k==='ribbon'?1.25:1;x.save();x.translate(bx,by);x.rotate(-.35);x.scale(big,big);
 const p=new Path2D();p.moveTo(0,0);p.bezierCurveTo(-40,-44,-74,-16,-60,10);p.bezierCurveTo(-50,34,-20,22,0,0);p.moveTo(0,0);p.bezierCurveTo(40,-44,74,-16,60,10);p.bezierCurveTo(50,34,20,22,0,0);fillP(x,p,rg(x,0,-4,70,c),c,4);
 if(it.k==='polka'){x.save();x.clip(p);x.fillStyle='#fff';for(const [px,py] of [[-40,-12],[-24,8],[38,-14],[26,8],[-52,4],[52,2]])x.fill(circP(px,py,5));x.restore();}
 if(it.k==='ribbon'){const t=new Path2D();t.moveTo(-6,6);t.quadraticCurveTo(-30,60,-20,96);t.lineTo(-6,84);t.lineTo(6,96);t.quadraticCurveTo(8,50,6,6);fillP(x,t,lg(x,0,96,c),c,3);}
 fillP(x,rrP(-12,-12,24,24,9),rg(x,0,0,14,sh(c,-.1)),c,3);x.restore();}
// ---------- wands ----------
function drawWand(x,it,c){const hx=446,hy=452;x.save();x.translate(hx,hy);x.rotate(-.35);
 fillP(x,rrP(-6,-150,12,170,6),lg(x,-150,20,it.k==='pumpkin'?'#7ee8c6':'#fffafc'),'#d6dbe6',3);
 x.strokeStyle='rgba(255,126,182,.8)';x.lineWidth=4;for(let i=0;i<6;i++){x.beginPath();x.moveTo(-6,-140+i*26);x.lineTo(6,-128+i*26);x.stroke();}
 let p;
 if(it.k==='starw')p=starP(0,-180,46,20);
 else if(it.k==='heartw')p=heartP(0,-178,40);
 else if(it.k==='moonw'){p=new Path2D();p.arc(0,-184,42,0,7);p.moveTo(30,-200);p.arc(18,-196,34,0,7,true);}
 else if(it.k==='bubble'){p=new Path2D();p.arc(0,-188,40,0,7);p.arc(0,-188,30,0,7,true);}
 else if(it.k==='pumpkin'){p=new Path2D();p.ellipse(0,-180,44,36,0,0,7);}
 fillP(x,p,rg(x,0,-184,46,c),c,4);
 if(it.k==='pumpkin'){x.fillStyle='#2b2233';x.fill(starP(-14,-186,8,4));x.fill(starP(14,-186,8,4));x.beginPath();x.arc(0,-172,14,0,Math.PI);x.fill();fillP(x,rrP(-5,-222,10,18,4),'#7ee8c6','#7ee8c6',2);}
 if(it.k==='bubble'){x.globalAlpha=.5;for(const [bx,by,r] of [[-50,-240,14],[30,-260,10],[-20,-290,8]]){x.strokeStyle=c;x.lineWidth=3;x.stroke(circP(bx,by,r));}x.globalAlpha=1;}
 spark(x,-18,-200,12);spark(x,34,-150,8,.8);x.restore();}
// ---------- backgrounds (screen space w×h) ----------
function drawBG(x,k,w,h,c,t){t=t||0;const G=(a,b)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
 if(k==='studio'||!k){x.fillStyle=G('#ffe3f1','#ffc4de');x.fillRect(0,0,w,h);x.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<14;i++)x.fill(heartP((i*97)%w,(i*57)%(h*.8),8+i%3*4));return;}
 if(k==='ballroom'){x.fillStyle=G(sh(c,-.55),sh(c,-.1));x.fillRect(0,0,w,h);for(let i=0;i<4;i++){const ax=w*(i+.5)/4;x.fillStyle='rgba(255,230,160,.18)';x.beginPath();x.moveTo(ax-w*.1,h*.75);x.lineTo(ax-w*.1,h*.3);x.arc(ax,h*.3,w*.1,Math.PI,0);x.lineTo(ax+w*.1,h*.75);x.fill();}
  for(const cx of[w*.25,w*.75]){x.strokeStyle='#ffcc33';x.lineWidth=2;x.beginPath();x.moveTo(cx,0);x.lineTo(cx,h*.1);x.stroke();for(let j=0;j<7;j++){x.fillStyle=(j+((t*4)|0))%2?'#fff6c8':'#ffcc33';x.fill(circP(cx-w*.09+j*w*.03,h*.12+Math.sin(j)*4,3.5));}}
  x.fillStyle=G('#c69c6d','#8a5a3c');x.fillRect(0,h*.75,w,h*.25);x.strokeStyle='rgba(255,255,255,.12)';for(let i=0;i<10;i++){x.beginPath();x.moveTo(w/2,h*.75);x.lineTo(i*w/9,h);x.stroke();}return;}
 if(k==='beach'){x.fillStyle=G('#7fd8ff','#ffe8b8');x.fillRect(0,0,w,h);x.fillStyle='#fff3a6';x.fill(circP(w*.8,h*.16,w*.1));x.fillStyle='rgba(255,255,255,.8)';x.fill(rrP(w*.1,h*.12,w*.24,h*.04,20));x.fillStyle='#3fb6e8';x.fillRect(0,h*.55,w,h*.1);x.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<8;i++){x.beginPath();x.arc(i*w/7+Math.sin(t*2)*6,h*.65,w/14,Math.PI,0);x.fill();}x.fillStyle=G('#ffe2a0','#f2c27a');x.fillRect(0,h*.65,w,h*.35);x.fillStyle='#ff8a65';x.fill(starP(w*.12,h*.88,12));return;}
 if(k==='concert'){x.fillStyle=G('#1a0b33','#3a1460');x.fillRect(0,0,w,h);const cols=['#ff3d8b','#4fd8ff','#ffcc33','#8e44ec'];for(let i=0;i<4;i++){x.save();x.globalAlpha=.22;x.fillStyle=cols[i];x.beginPath();const sx=w*(.1+i*.27),a=Math.sin(t*1.5+i)*.25;x.moveTo(sx,0);x.lineTo(w/2+Math.sin(a)*w*.6-w*.12,h*.85);x.lineTo(w/2+Math.sin(a)*w*.6+w*.12,h*.85);x.fill();x.restore();}
  x.fillStyle='#120726';x.fillRect(0,h*.8,w,h*.2);for(let i=0;i<22;i++){x.fillStyle='#24104a';x.fill(circP(i*w/20,h*.86+Math.sin(t*6+i)*3,w*.035));}return;}
 if(k==='space'){x.fillStyle=G('#0b0a2e','#3a2a7a');x.fillRect(0,0,w,h);for(let i=0;i<60;i++){x.fillStyle='rgba(255,255,255,'+(.4+.6*Math.abs(Math.sin(t*2+i)))+')';x.fillRect((i*137)%w,(i*71)%h,2,2);}x.fillStyle=rg(x,w*.82,h*.2,w*.12,'#ff7eb6');x.fill(circP(w*.82,h*.2,w*.12));x.strokeStyle='rgba(255,230,160,.7)';x.lineWidth=4;x.beginPath();x.ellipse(w*.82,h*.2,w*.2,w*.04,-.3,0,7);x.stroke();x.fillStyle=G('#8f86b8','#5c537f');x.beginPath();x.ellipse(w/2,h*1.05,w*.9,h*.25,0,0,7);x.fill();return;}
 if(k==='spooky'){x.fillStyle=G('#2a1048','#6a3a8a');x.fillRect(0,0,w,h);x.fillStyle='#fff6c8';x.fill(circP(w*.75,h*.17,w*.11));x.fillStyle='#2a1048';x.fill(circP(w*.71,h*.15,w*.1));x.fillStyle='#1b0a2e';for(let i=0;i<3;i++){const bx=w*(.15+i*.3)+Math.sin(t*3+i)*10,by=h*(.2+i*.05);x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx-15,by-12,bx-28,by);x.quadraticCurveTo(bx-15,by-4,bx,by+4);x.quadraticCurveTo(bx+15,by-4,bx+28,by);x.quadraticCurveTo(bx+15,by-12,bx,by);x.fill();}
  x.fillStyle=G('#3b1a5c','#24103a');x.fillRect(0,h*.78,w,h*.22);for(const px of[w*.12,w*.88]){x.fillStyle=rg(x,px,h*.83,w*.07,'#ff9a2e');x.beginPath();x.ellipse(px,h*.83,w*.07,w*.055,0,0,7);x.fill();x.fillStyle='#fff6a0';x.fill(starP(px-8,h*.82,5,2));x.fill(starP(px+8,h*.82,5,2));}return;}
 if(k==='bedroom'){x.fillStyle=G('#fff0f7','#ffd6ea');x.fillRect(0,0,w,h);x.fillStyle='rgba(255,126,182,.18)';for(let yy=0;yy<h*.75;yy+=40)for(let xx=0;xx<w;xx+=40)x.fill(heartP(xx+(yy/40%2)*20,yy+20,7));x.fillStyle='#fff';x.fill(rrP(w*.62,h*.12,w*.28,h*.22,10));x.fillStyle='#bfe9ff';x.fill(rrP(w*.64,h*.135,w*.24,h*.19,6));x.fillStyle=G('#ffc4de','#f39ac2');x.fillRect(0,h*.75,w,h*.25);x.fillStyle='#ffe066';x.fill(circP(w*.12,h*.72,w*.06));return;}
}
// ---------- catalogue ----------
const ITEMS=[
 {id:'gown',c:'top',n:'Ball Gown',shape:'gown',col:'#ff7eb6',tags:['royal','sparkle'],p:0},
 {id:'sun',c:'top',n:'Sundress',shape:'sun',col:'#fff176',tags:['beach','sweet'],p:0},
 {id:'tee',c:'top',n:'Heart Tee',shape:'tee',col:'#4fd8ff',tags:['beach','sweet','pop'],p:0},
 {id:'pop',c:'top',n:'Sequin Top',shape:'pop',col:'#ff3d8b',tags:['pop','sparkle'],p:40},
 {id:'spacedr',c:'top',n:'Galaxy Dress',shape:'spacedr',col:'#d6dbe6',tags:['space','sparkle'],p:60},
 {id:'spooky',c:'top',n:'Bat Dress',shape:'spooky',col:'#8e44ec',tags:['spooky'],p:50},
 {id:'hoodie',c:'top',n:'Cloud Hoodie',shape:'hoodie',col:'#b39dff',tags:['sweet','space','pop'],p:40},
 {id:'mermaid',c:'top',n:'Mermaid Gown',shape:'mermaid',col:'#7ee8c6',tags:['royal','beach','sparkle'],p:90},
 {id:'overall',c:'top',n:'Picnic Overalls',shape:'overall',col:'#ff8a65',tags:['sweet','beach'],p:45},
 {id:'tutu',c:'bot',n:'Tutu',k:'tutu',col:'#ff7eb6',tags:['sweet','royal','spooky'],p:0},
 {id:'shorts',c:'bot',n:'Denim Shorts',k:'shorts',col:'#4fd8ff',tags:['beach','pop'],p:0},
 {id:'leggings',c:'bot',n:'Star Leggings',k:'leggings',col:'#2c3e8f',tags:['space','pop'],p:35},
 {id:'starskirt',c:'bot',n:'Star Skirt',k:'starskirt',col:'#8e44ec',tags:['pop','space','sparkle'],p:45},
 {id:'cargo',c:'bot',n:'Comfy Pants',k:'cargo',col:'#b39dff',tags:['sweet','space'],p:30},
 {id:'bloomers',c:'bot',n:'Heart Bloomers',k:'bloomers',col:'#ff3d8b',tags:['sweet','spooky'],p:30},
 {id:'heels',c:'shoe',n:'Glass Heels',k:'heels',col:'#b39dff',tags:['royal','sparkle'],p:0},
 {id:'sneaks',c:'shoe',n:'Sneakers',k:'sneaks',col:'#ff3d8b',tags:['pop','beach','sweet'],p:0},
 {id:'jelly',c:'shoe',n:'Jelly Sandals',k:'jelly',col:'#7ee8c6',tags:['beach','sweet'],p:20},
 {id:'boots',c:'shoe',n:'Go-Go Boots',k:'boots',col:'#2b2233',tags:['pop','spooky'],p:40},
 {id:'moon',c:'shoe',n:'Moon Boots',k:'moon',col:'#d6dbe6',tags:['space'],p:50},
 {id:'slippers',c:'shoe',n:'Bunny Slippers',k:'slippers',col:'#fffafc',tags:['sweet','spooky'],p:25},
 {id:'tiara',c:'hat',n:'Tiara',k:'tiara',col:'#ffcc33',tags:['royal','sparkle'],p:0},
 {id:'sunhat',c:'hat',n:'Sun Hat',k:'sunhat',col:'#fff176',tags:['beach','sweet'],p:0},
 {id:'crown',c:'hat',n:'Big Crown',k:'crown',col:'#ffcc33',tags:['royal','sparkle'],p:70},
 {id:'witch',c:'hat',n:'Witch Hat',k:'witch',col:'#2b2233',tags:['spooky'],p:45},
 {id:'helmet',c:'hat',n:'Space Bubble',k:'helmet',col:'#4fd8ff',tags:['space'],p:60},
 {id:'beret',c:'hat',n:'Beret',k:'beret',col:'#ff3d8b',tags:['pop','sweet'],p:30},
 {id:'bunny',c:'hat',n:'Bunny Ears',k:'bunny',col:'#fffafc',tags:['sweet','pop','spooky'],p:35},
 {id:'pearls',c:'acc',n:'Pearls',k:'pearls',col:'#fffafc',tags:['royal'],p:0},
 {id:'shades',c:'acc',n:'Star Shades',k:'shades',col:'#ff3d8b',tags:['beach','pop'],p:0},
 {id:'purse',c:'acc',n:'Heart Purse',k:'purse',col:'#ff7eb6',tags:['sweet','royal'],p:25},
 {id:'mic',c:'acc',n:'Sparkle Mic',k:'mic',col:'#ffcc33',tags:['pop'],p:40},
 {id:'earstar',c:'acc',n:'Star Earrings',k:'earstar',col:'#ffcc33',tags:['space','pop','sparkle'],p:30},
 {id:'cape',c:'acc',n:'Starry Cape',k:'cape',col:'#8e44ec',tags:['royal','space','spooky'],p:60},
 {id:'wings',c:'acc',n:'Fairy Wings',k:'wings',col:'#b39dff',tags:['sweet','royal','sparkle'],p:55},
 {id:'classic',c:'bow',n:'Classic Bow',k:'classic',col:'#ff3d8b',tags:['sweet','royal'],p:0},
 {id:'polka',c:'bow',n:'Polka Bow',k:'polka',col:'#8e44ec',tags:['spooky','pop','sweet'],p:0},
 {id:'ribbon',c:'bow',n:'Long Ribbon',k:'ribbon',col:'#4fd8ff',tags:['beach','space'],p:20},
 {id:'flower',c:'bow',n:'Flower Clip',k:'flower',col:'#ff8a65',tags:['beach','sweet'],p:20},
 {id:'starw',c:'wand',n:'Star Wand',k:'starw',col:'#ffcc33',tags:['royal','space','sparkle'],p:0},
 {id:'heartw',c:'wand',n:'Heart Wand',k:'heartw',col:'#ff3d8b',tags:['sweet','pop'],p:0},
 {id:'moonw',c:'wand',n:'Moon Scepter',k:'moonw',col:'#d6dbe6',tags:['space','royal'],p:40},
 {id:'bubble',c:'wand',n:'Bubble Wand',k:'bubble',col:'#4fd8ff',tags:['beach','sweet'],p:25},
 {id:'pumpkin',c:'wand',n:'Pumpkin Wand',k:'pumpkin',col:'#ff9a2e',tags:['spooky'],p:35},
 {id:'ballroom',c:'bg',n:'Ballroom',k:'ballroom',col:'#8e44ec',tags:['royal'],p:0},
 {id:'beach',c:'bg',n:'Beach',k:'beach',col:'#4fd8ff',tags:['beach'],p:0},
 {id:'bedroom',c:'bg',n:'Pink Room',k:'bedroom',col:'#ff7eb6',tags:['sweet'],p:0},
 {id:'concert',c:'bg',n:'Concert',k:'concert',col:'#ff3d8b',tags:['pop'],p:40},
 {id:'space',c:'bg',n:'Outer Space',k:'space',col:'#2c3e8f',tags:['space'],p:50},
 {id:'spooky',c:'bg',n:'Spooky Garden',k:'spooky',col:'#8e44ec',tags:['spooky'],p:45}];
ITEMS.forEach(i=>{if(i.c==='bg'&&i.id==='spooky')i.id='spookybg';if(i.c==='bg'&&i.id==='beach')i.id='beachbg';if(i.c==='bg'&&i.id==='space')i.id='spacebg';});
const BOX={top:[-20,180,460,720],bot:[40,360,320,540],shoe:[90,760,220,180],hat:[60,-190,260,280],acc:[-30,160,520,440],bow:[30,-30,140,140],wand:[360,180,160,320],bg:[0,0,1,1]};
