// Blocks, items, recipes, smelting and icons for Blockhaven.
import {TILE,TS,AT,PER} from './textures.js';
export const B={};export const BLOCKS=[];
const t=n=>TILE[n];
function blk(id,key,o){const d=Object.assign({id,key,solid:true,opaque:true,cross:false,liquid:false,light:0,hard:1,tool:null,tier:0,cutout:false,drop:id,stack:64},o);if(typeof d.tex==='string')d.tex={top:t(d.tex),bottom:t(d.tex),side:t(d.tex)};else{const x=d.tex;d.tex={top:t(x.top||x.side),bottom:t(x.bottom||x.top||x.side),side:t(x.side),front:t(x.front||x.side)}}BLOCKS[id]=d;B[key]=id;return d}
BLOCKS[0]={id:0,key:'air',solid:false,opaque:false,light:0};B.air=0;
const plant={solid:false,opaque:false,cross:true,hard:0,cutout:true};
blk(1,'grass',{tex:{top:'grass_top',bottom:'dirt',side:'grass_side'},hard:.6,tool:'shovel',drop:2});
blk(2,'dirt',{tex:'dirt',hard:.5,tool:'shovel'});
blk(3,'stone',{tex:'stone',hard:1.5,tool:'pick',tier:1,drop:4});
blk(4,'cobble',{tex:'cobble',hard:2,tool:'pick',tier:1});
blk(5,'sand',{tex:'sand',hard:.5,tool:'shovel'});
blk(6,'sandstone',{tex:{top:'sandstone_top',side:'sandstone_side'},hard:.8,tool:'pick',tier:1});
blk(7,'log',{tex:{top:'log_top',side:'log_side'},hard:2,tool:'axe'});
blk(8,'planks',{tex:'planks',hard:2,tool:'axe'});
blk(9,'leaves',{tex:'leaves',opaque:false,cutout:true,hard:.2,drop:'leaves'});
blk(10,'glass',{tex:'glass',opaque:false,cutout:true,hard:.3,drop:0});
blk(11,'water',{tex:'water',solid:false,opaque:false,liquid:true,hard:-1,drop:0});
blk(12,'snow',{tex:'snow',hard:.2,tool:'shovel'});
blk(13,'snowgrass',{tex:{top:'snow',bottom:'dirt',side:'snow_side'},hard:.6,tool:'shovel',drop:2});
blk(14,'ice',{tex:'ice',opaque:false,cutout:true,hard:.5,tool:'pick',drop:0});
blk(15,'coal_ore',{tex:'coal_ore',hard:3,tool:'pick',tier:1,drop:101});
blk(16,'iron_ore',{tex:'iron_ore',hard:3,tool:'pick',tier:2});
blk(17,'gold_ore',{tex:'gold_ore',hard:3,tool:'pick',tier:3});
blk(18,'star_ore',{tex:'star_ore',hard:4,tool:'pick',tier:3,drop:104,light:3});
blk(19,'deepstone',{tex:'deepstone',hard:-1});
blk(20,'magma',{tex:'magma',hard:1.5,tool:'pick',tier:1,light:10});
blk(21,'bricks',{tex:'bricks',hard:2,tool:'pick',tier:1});
blk(22,'wool',{tex:'wool',hard:.8});
blk(23,'workbench',{tex:{top:'bench_top',bottom:'planks',side:'bench_side'},hard:2.5,tool:'axe'});
blk(24,'kiln',{tex:{top:'kiln_side',side:'kiln_side',front:'kiln_front'},hard:3.5,tool:'pick',tier:1,light:6});
blk(25,'chest',{tex:{top:'chest_side',side:'chest_side',front:'chest_front'},hard:2.5,tool:'axe'});
blk(26,'torch',{tex:'torch',solid:false,opaque:false,cutout:true,hard:0,light:14,torch:true});
blk(27,'flower_red',{tex:'flower_red',...plant});
blk(28,'flower_yellow',{tex:'flower_yellow',...plant});
blk(29,'tallgrass',{tex:'tallgrass',...plant,drop:'grass',replace:true});
for(let s=0;s<4;s++)blk(30+s,'wheat'+s,{tex:'wheat'+s,...plant,drop:'wheat',crop:s});
blk(34,'cactus',{tex:{top:'cactus_top',side:'cactus_side'},opaque:false,cutout:true,hard:.4,hurt:1});
blk(35,'pine_log',{tex:{top:'pine_top',side:'pine_log'},hard:2,tool:'axe'});
blk(36,'pine_leaves',{tex:'pine_leaves',opaque:false,cutout:true,hard:.2,drop:'leaves'});
blk(37,'duskstone',{tex:'duskstone',hard:8,tool:'pick',tier:3});
blk(38,'portal',{tex:'portal',solid:false,opaque:false,cutout:true,hard:-1,light:12,drop:0,portal:true});
blk(39,'gold_block',{tex:'gold_block',hard:3,tool:'pick',tier:2});
blk(40,'iron_block',{tex:'iron_block',hard:4,tool:'pick',tier:2});
blk(41,'bed',{tex:{top:'bed_top',bottom:'planks',side:'bed_side'},opaque:false,cutout:true,hard:.3,bed:true});
blk(42,'mossy',{tex:'mossy',hard:2,tool:'pick',tier:1});
blk(43,'felt_pink',{tex:'felt_pink',hard:.8});blk(44,'felt_blue',{tex:'felt_blue',hard:.8});blk(45,'felt_yellow',{tex:'felt_yellow',hard:.8});blk(46,'felt_green',{tex:'felt_green',hard:.8});
blk(47,'lamp',{tex:'lamp',hard:.5,light:15});
blk(48,'gloomgrass',{tex:{top:'gloom_top',bottom:'dirt',side:'gloom_side'},hard:.6,tool:'shovel',drop:2});
blk(49,'gloom_log',{tex:{top:'pine_top',side:'gloom_log'},hard:2,tool:'axe'});
blk(50,'gloom_leaves',{tex:'gloom_leaves',opaque:false,cutout:true,hard:.2,drop:'leaves',light:2});
blk(51,'berry_bush',{tex:'berry_bush',...plant,drop:'berries'});
blk(52,'stone_bricks',{tex:'stone_bricks',hard:2,tool:'pick',tier:1});
blk(53,'mushroom',{tex:'mushroom',...plant,food:[2,1]});
blk(54,'hoardstone',{tex:'hoardstone',hard:2,tool:'pick',tier:1});
blk(55,'web',{tex:'web',...plant,hard:.6,drop:106,web:true});
blk(56,'star_block',{tex:'star_block',hard:5,tool:'pick',tier:3});
blk(57,'sapling',{tex:'sapling',...plant,sapling:true});
blk(58,'flower_blue',{tex:'flower_blue',...plant});
blk(59,'gate',{tex:'lantern_gate',hard:-1,light:4});
blk(60,'socket',{tex:'shard_socket',hard:-1,socket:true});
blk(61,'kiln_lit',{tex:{top:'kiln_side',side:'kiln_side',front:'kiln_front'},hard:3.5,tool:'pick',tier:1,light:12,drop:24});
// Coast blocks (Venice Beach / Santa Monica)
blk(62,'palm_log',{tex:{top:'palm_top',side:'palm_log'},hard:2,tool:'axe'});
blk(63,'palm_leaves',{tex:'palm_leaves',opaque:false,cutout:true,hard:.2,drop:'leaves'});
blk(64,'asphalt',{tex:'asphalt',hard:1.5,tool:'pick',tier:1});
blk(65,'asphalt_line',{tex:'asphalt_line',hard:1.5,tool:'pick',tier:1,drop:64});
blk(66,'concrete',{tex:'concrete',hard:1.8,tool:'pick',tier:1});
blk(67,'boardwalk',{tex:'boardwalk',hard:2,tool:'axe'});
blk(68,'mural_sun',{tex:'mural_sun',hard:1.5,tool:'pick',mural:0});blk(69,'mural_wave',{tex:'mural_wave',hard:1.5,tool:'pick',mural:1});blk(70,'mural_palm',{tex:'mural_palm',hard:1.5,tool:'pick',mural:2});blk(71,'mural_pop',{tex:'mural_pop',hard:1.5,tool:'pick',mural:3});
blk(72,'seaglass_sand',{tex:'seaglass_sand',hard:.6,tool:'shovel',drop:166});
blk(73,'awning',{tex:'awning',hard:.8});
blk(74,'felt_red',{tex:'felt_red',hard:.8});blk(75,'felt_white',{tex:'felt_white',hard:.8});
blk(76,'ferry_bell',{tex:{top:'planks',side:'ferry_bell'},hard:-1,light:7,bell:true});
blk(77,'neon',{tex:'neon',hard:.8,light:13});
// Items (ids >= 100)
export const ITEMS={};export const I={};
function item(id,key,o={}){const d=Object.assign({id,key,stack:64},o);ITEMS[id]=d;I[key]=id;return d}
item(100,'stick');item(101,'coal',{fuel:8});item(102,'iron_ingot');item(103,'gold_ingot');item(104,'starshard');item(105,'coin');item(106,'yarn');item(107,'spore');item(108,'thorn');
item(109,'arrow');item(110,'bow',{stack:1,dur:200,bow:true});
item(111,'apple',{food:[4,2.4]});item(112,'bread',{food:[5,6]});item(113,'berries',{food:[2,1]});item(114,'wheat');item(115,'seeds',{plants:30});item(116,'raw_mutton',{food:[2,1]});item(117,'cooked_mutton',{food:[6,9]});item(118,'grow_dust',{grow:true});
const TIERS=['wood','stone','iron','star'];const TOOLS=['sword','pick','axe','shovel'];const DUR=[60,132,250,1200];const SPEED=[2,4,6,9];const DMG=[4,5,6,8];
TIERS.forEach((tier,ti)=>TOOLS.forEach((tool,k)=>item(120+ti*4+k,tier+'_'+tool,{stack:1,tool,tier:ti+1,dur:DUR[ti],speed:SPEED[ti],dmg:tool==='sword'?DMG[ti]:tool==='axe'?DMG[ti]-1:tool==='pick'?DMG[ti]-2:DMG[ti]-3})));
const ARMOR=['felt','iron','star'],SLOTS=['helmet','chest','legs','boots'],DEF=[[1,2,2,1],[2,5,4,2],[3,7,5,3]];
ARMOR.forEach((m,mi)=>SLOTS.forEach((s,k)=>item(140+mi*4+k,m+'_'+s,{stack:1,armor:k,def:DEF[mi][k],dur:[80,240,520][mi]})));
item(160,'sun_shard',{stack:1,shard:0});item(161,'frost_shard',{stack:1,shard:1});item(162,'gloom_shard',{stack:1,shard:2});
item(163,'honey',{food:[6,8],heal:4});item(164,'crown',{stack:1});item(165,'cooked_fish');item(166,'sea_glass');item(167,'tide_pearl',{stack:1});
export const isBlock=id=>id>0&&id<100;
export const def=id=>id<100?BLOCKS[id]:ITEMS[id];
export const maxStack=id=>def(id)?.stack||64;
export const foodOf=id=>def(id)?.food;
export const fuelOf=id=>id===101?8:id===I.stick?.5:[7,8,35,49,23,25,62,67].includes(id)?1.5:0;
// Recipes: ingredients plus a display grid (letters map to ingredient order). bench = needs a workbench nearby.
const R=[];export const RECIPES=R;
function rc(out,n,ing,grid,bench=true,cat='blocks'){R.push({out,n,ing,grid,bench,cat})}
rc(8,4,[[7,1]],'a',false);rc(8,4,[[35,1]],'a',false);rc(8,4,[[49,1]],'a',false);
rc(8,4,[[62,1]],'a',false);rc(67,4,[[8,3]],'aaa');rc(77,2,[[166,2],[101,1]],'ab.a');
rc(100,4,[[8,2]],'a..a',false,'items');
rc(23,1,[[8,4]],'aa.aa',false);
rc(26,4,[[101,1],[100,1]],'a..b',false);
rc(24,1,[[4,8]],'aaaa.aaaa');
rc(25,1,[[8,8]],'aaaa.aaaa');
rc(41,1,[[22,3],[8,3]],'aaabbb');
rc(6,4,[[5,4]],'aa.aa',false);rc(52,4,[[3,4]],'aa.aa',false);rc(21,2,[[3,2],[5,2]],'ab.ba',false);
rc(43,1,[[22,1],[113,1]],'ab',false);rc(44,1,[[22,1],[58,1]],'ab',false);rc(45,1,[[22,1],[28,1]],'ab',false);rc(46,1,[[22,1],[9,1]],'ab',false);
rc(47,1,[[10,4],[103,1],[101,1]],'.a.aba.c.');
rc(39,1,[[103,9]],'aaaaaaaaa');rc(40,1,[[102,9]],'aaaaaaaaa');rc(56,1,[[104,9]],'aaaaaaaaa');
const MAT=[8,4,102,104],TOOL_G={sword:'.a..a..b.',pick:'aaa.b..b.',axe:'aa.ab..b.',shovel:'.a..b..b.'},TOOL_N={sword:2,pick:3,axe:3,shovel:1};
TIERS.forEach((tier,ti)=>TOOLS.forEach((tool,k)=>rc(120+ti*4+k,1,[[MAT[ti],TOOL_N[tool]],[100,tool==='sword'?1:2]],TOOL_G[tool],true,'tools')));
const AMAT=[22,102,104],AG=['aaaa.a','a.aaaaaaa','aaaa.aa.a','a.aa.a'],AN=[5,8,7,4];
ARMOR.forEach((m,mi)=>SLOTS.forEach((s,k)=>rc(140+mi*4+k,1,[[AMAT[mi],AN[k]]],AG[k],true,'armor')));
rc(110,1,[[100,3],[106,3]],'.ab a.bab'.replace(' ',''),true,'tools');
rc(109,4,[[100,1],[108,1]],'b..a',false,'tools');
rc(108,2,[[34,1]],'a',false,'items');
rc(112,1,[[114,3]],'aaa',false,'food');
rc(118,2,[[107,1]],'a',false,'items');
// Smelting
export const SMELT={16:102,17:103,5:10,4:3,7:101,35:101,49:101,116:117,34:46};
// Icon rendering
let atlasCanvas=null;const iconCache={};
export function setAtlas(c){atlasCanvas=c}
const C=h=>h;
function px16(draw){const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');const pix=[];const P=(x,y,col)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>15||y>15)return;pix[y*16+x]=col};draw(P);
 // Auto outline for a crisp handmade pixel-art edge
 const out=[];for(let y=0;y<16;y++)for(let x=0;x<16;x++){if(pix[y*16+x])continue;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){let X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<16&&Y<16&&pix[Y*16+X]){out.push([x,y]);break}}}
 for(const[x,y]of out){g.fillStyle='#2a1d14';g.fillRect(x,y,1,1)}for(let i=0;i<256;i++)if(pix[i]){g.fillStyle=pix[i];g.fillRect(i%16,Math.floor(i/16),1,1)}return c}
const line=(P,x0,y0,x1,y1,col,col2)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;P(x,y,col);if(col2)P(x+1,y,col2)}};
const disc=(P,cx,cy,r,col,hi)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+.5)P(cx+x,cy+y,hi&&x<0&&y<0&&x*x+y*y<r*r*.4?hi:col)};
const TP={wood:['#c69a5b','#8c6438','#e2bd85'],stone:['#9a9a9a','#6e6e6e','#c4c4c4'],iron:['#e3e6ea','#9aa1a8','#ffffff'],star:['#b07cf5','#7244b8','#e9d6ff'],felt:['#f1e8d4','#c9b99a','#ffffff']};
function drawItem(id){const d=ITEMS[id];if(!d)return null;const k=d.key;return px16(P=>{
 const handle=()=>line(P,2,14,9,7,'#7a5532','#523620');
 if(d.tool){const [m,dk,lt]=TP[TIERS[d.tier-1]];
  if(d.tool==='sword'){line(P,2,14,4,12,'#7a5532','#523620');line(P,3,10,7,14,dk);line(P,5,11,13,3,m,lt);line(P,6,12,14,4,dk);P(13,2,lt)}
  if(d.tool==='pick'){handle();for(let a=-1.75;a<=0.2;a+=.12){const x=4+Math.cos(a)*9.3,y=12+Math.sin(a)*9.3;P(x,y,m);P(x-.8,y+.8,dk)}P(5,3,lt);P(12,10,lt)}
  if(d.tool==='axe'){line(P,2,14,10,6,'#7a5532','#523620');for(let y=2;y<8;y++)for(let x=9;x<14;x++)if(x-9+y-2<8&&!(x===9&&y>5))P(x,y,y<4?lt:x>11?dk:m)}
  if(d.tool==='shovel'){line(P,2,14,9,7,'#7a5532','#523620');disc(P,11,5,2,m,lt);P(13,3,m);P(12,3,m);P(13,4,dk)}
  return}
 if(d.armor!==undefined){const [m,dk,lt]=TP[ARMOR[Math.floor((id-140)/4)]];const s=d.armor;
  if(s===0){for(let y=4;y<11;y++)for(let x=3;x<13;x++)if(!(y>7&&x>5&&x<10))P(x,y,y===4?lt:x===3||x===12?dk:m)}
  if(s===1){for(let y=3;y<14;y++)for(let x=2;x<14;x++){if(y<6&&x>5&&x<10)continue;if(y>6&&(x<4||x>11))continue;P(x,y,x<5?lt:x>10?dk:m)}}
  if(s===2){for(let y=3;y<14;y++)for(let x=4;x<12;x++){if(y>6&&x>6&&x<9)continue;P(x,y,y===3?lt:x===4||x===11?dk:m)}}
  if(s===3){for(let y=7;y<13;y++){for(let x=2;x<6;x++)P(x,y,m);for(let x=10;x<14;x++)P(x,y,m)}for(let x=0;x<7;x++)P(x,12,dk);for(let x=9;x<16;x++)P(x,12,dk);P(2,7,lt);P(10,7,lt)}
  return}
 switch(k){
 case'stick':line(P,3,13,12,4,'#8c6440','#5e4026');break;
 case'coal':disc(P,8,8,4,'#2f2c2b','#56504c');P(5,10,'#1d1b1a');break;
 case'iron_ingot':case'gold_ingot':{const c=k==='iron_ingot'?['#dfe3e8','#a3aab2','#ffffff']:['#f5c43a','#c98f1e','#fff2a6'];for(let y=6;y<11;y++)for(let x=2+(10-y);x<14-(10-y)/2;x++)P(x,y,y===6?c[2]:y===10?c[1]:c[0]);break}
 case'starshard':for(let y=0;y<6;y++){for(let x=-y;x<=y;x++)P(8+x,3+y,x<0?'#e9d6ff':'#b07cf5');for(let x=-(5-y);x<=5-y;x++)P(8+x,9+y,x<0?'#9a62e8':'#7244b8')}P(8,1,'#fff');break;
 case'sea_glass':for(const[x,y,w,h,c]of[[4,5,4,4,'#5fe0c0'],[8,8,4,3,'#7ab8ff'],[6,10,3,3,'#9be08a']]){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)P(xx,yy,c);P(x,y,'#ffffff')}break;
 case'tide_pearl':disc(P,8,8,5,'#eef4ff','#ffffff');disc(P,7,7,2,'#ffffff');P(10,10,'#b8c8e8');P(11,9,'#c9d6f0');break;
 case'coin':disc(P,8,8,5,'#f4c43a','#fff2a6');line(P,8,5,8,11,'#c98f1e');line(P,6,6,10,6,'#c98f1e');line(P,6,10,10,10,'#c98f1e');break;
 case'yarn':disc(P,8,9,5,'#f29ab9','#ffd0e1');for(let i=0;i<4;i++)line(P,4+i*2,5,6+i*2,13,'#d46f95');line(P,12,11,15,14,'#f29ab9');break;
 case'spore':for(const[x,y]of[[5,6],[9,4],[11,9],[6,11],[8,8],[3,9],[12,5]])disc(P,x,y,1,'#c9e6a0','#f2ffe0');break;
 case'thorn':line(P,3,13,12,4,'#4c9a3c','#2f7a2c');line(P,12,4,14,2,'#e8e2b0');P(7,9,'#e8e2b0');P(9,6,'#e8e2b0');break;
 case'arrow':line(P,3,13,12,4,'#8c6440');line(P,11,3,13,5,'#c4c4c4');P(13,3,'#e9e9e9');P(12,2,'#9a9a9a');P(14,4,'#9a9a9a');line(P,2,12,4,14,'#f29ab9');P(2,14,'#f29ab9');P(1,12,'#d46f95');break;
 case'bow':for(let a=-1.2;a<=1.2;a+=.1)P(5+Math.cos(a)*7,8+Math.sin(a)*7,'#8c6440');line(P,8,2,8,14,'#f2f2f2');P(11,4,'#5e4026');P(11,12,'#5e4026');break;
 case'apple':disc(P,8,10,4,'#d8312c','#ff7a6a');line(P,8,4,8,6,'#5e4026');P(9,4,'#4f9530');P(10,4,'#4f9530');P(10,3,'#69b541');break;
 case'bread':for(let y=6;y<12;y++)for(let x=2;x<14;x++)if((x-8)*(x-8)/36+(y-9)*(y-9)/9<=1)P(x,y,y<8?'#e4b062':'#c88a3a');line(P,5,7,6,9,'#a46a28');line(P,8,7,9,9,'#a46a28');line(P,11,7,12,9,'#a46a28');break;
 case'berries':for(const[x,y]of[[6,9],[10,9],[8,6],[8,11]])disc(P,x,y,2,'#d8306a','#ff8ab0');P(8,3,'#4f9530');break;
 case'wheat':for(let i=0;i<4;i++)line(P,5+i*2,14,7+i,3,'#d6b04a','#c2973a');line(P,4,10,12,10,'#8c6440');break;
 case'seeds':for(const[x,y]of[[5,8],[8,6],[11,9],[7,11],[10,12]]){P(x,y,'#9ccf5a');P(x+1,y,'#6ea93a')}break;
 case'raw_mutton':case'cooked_mutton':{const c=k==='raw_mutton'?['#e87a84','#ffb0b8']:['#9a5a2a','#c98a4a'];disc(P,7,8,4,c[0],c[1]);line(P,10,11,14,14,'#f4ecdc');P(14,13,'#f4ecdc');P(13,14,'#f4ecdc');break}
 case'grow_dust':for(let i=0;i<14;i++){const a=i*2.3,r=i*.35;P(8+Math.cos(a)*r,10+Math.sin(a)*r*.6,i%3?'#e9f7c8':'#9ccf5a')}P(8,4,'#fff');P(5,6,'#fff');P(11,5,'#fff');break;
 case'honey':for(let y=5;y<14;y++)for(let x=3;x<13;x++)if((x-8)*(x-8)/25+(y-9.5)*(y-9.5)/20<=1)P(x,y,y<7?'#c98f1e':'#f3a92e');for(let x=5;x<11;x++)P(x,4,'#e8d8b0');P(6,8,'#ffd65a');P(7,9,'#ffd65a');break;
 case'sun_shard':case'frost_shard':case'gloom_shard':{const c={sun_shard:['#ffb52e','#fff1a0','#d9771a'],frost_shard:['#7fd8f4','#e8fbff','#3a9ccc'],gloom_shard:['#a477d8','#eadbff','#5a3b8f']}[k];for(let y=1;y<15;y++){const w=Math.round(3.4-Math.abs(y-7)*.42);for(let x=-w;x<=w;x++)P(8+x+(y>8?1:0),y,x<0?c[1]:x>0?c[2]:c[0])}break}
 case'crown':for(let x=2;x<14;x++)for(let y=8;y<13;y++)P(x,y,y===8?'#fff2a6':'#f4c43a');for(const x of[2,5,8,11,13]){P(x,7,'#f4c43a');P(x,6,'#f4c43a');P(x,5,'#fff2a6')}P(5,10,'#d8306a');P(8,10,'#6d9ae6');P(11,10,'#d8306a');break;
 default:disc(P,8,8,4,'#ccc')}})}
function drawBlockIcon(id){const d=BLOCKS[id];const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');g.imageSmoothingEnabled=false;const tile=i=>[(i%PER)*TS,Math.floor(i/PER)*TS];
 if(d.cross||d.torch){const[sx,sy]=tile(d.tex.side);g.drawImage(atlasCanvas,sx,sy,16,16,0,0,32,32);return c}
 const face=(ti,a,b,cc,dd,e,f,shade)=>{const[sx,sy]=tile(ti);g.setTransform(a,b,cc,dd,e,f);g.drawImage(atlasCanvas,sx,sy,16,16,0,0,16,16);if(shade){g.fillStyle=`rgba(0,0,0,${shade})`;g.fillRect(0,0,16,16)}};
 face(d.tex.top,14/16,7/16,-14/16,7/16,16,2,0);face(d.tex.front??d.tex.side,14/16,7/16,0,15/16,2,9,.22);face(d.tex.side,14/16,-7/16,0,15/16,16,16,.4);g.setTransform(1,0,0,1,0,0);return c}
export function iconCanvas(id){if(iconCache[id])return iconCache[id];let c;if(id<100){c=drawBlockIcon(id)}else{const s=drawItem(id);c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');g.imageSmoothingEnabled=false;if(s)g.drawImage(s,0,0,32,32)}iconCache[id]=c;return c}
const urlCache={};export function iconURL(id){return urlCache[id]||(urlCache[id]=iconCanvas(id).toDataURL())}
export function itemPixels(id){return drawItem(id)} // for extruded held items
export const ARMOR_SLOTS=SLOTS;
