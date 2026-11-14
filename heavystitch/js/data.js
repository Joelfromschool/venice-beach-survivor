/* Heavy Stitch: characters, parts, paints, enemies, missions. All names and designs are original. */
'use strict';
const SLOTS=['head','core','arms','legs','booster','gen','fcs','wr','wl','sh','bk'];
// Characters. Anchors are in source-image pixels. "sl"/"sr" = screen-left/right side.
const CHARS={
 pinco:{img:'art/c_pinco.webp',w:170,h:320,body:'humanoid',play:true,
  name:{en:'Pinco',ja:'ピンコ'},role:{en:'Balanced striker',ja:'バランス型ストライカー'},
  blurb:{en:'Long limbs, quick hands. Arm and leg hardpoints take anything you weld on.',ja:'長い手足と速い手。腕と脚のハードポイントは、何でも溶接できる。'},
  mul:{ap:1,spd:1,en:1,fire:1,dash:1},
  a:{shw:[44,118],bkw:[140,116],head:[80,20],hw:100,eyeY:54,torso:[92,158,78,62],shl:[56,124],shr:[134,124],hl:[52,214],hr:[114,186],legl:[66,262],legr:[121,262],ftl:[55,300],ftr:[122,304],back:[94,128],hip:[130,208],unit:86}},
 pooh:{img:'art/c_pooh.webp',w:233,h:320,body:'float',play:true,
  name:{en:'Pooh',ja:'プー'},role:{en:'Heavy fortress',ja:'重装フォートレス'},
  blurb:{en:'Big heart, bigger plating. No legs, so his hover rings lock around his floating shoes.',ja:'大きなハートに、もっと大きな装甲。脚がないので、浮かぶくつのまわりにホバーリングを装着。'},
  mul:{ap:1.3,spd:.86,en:1.05,fire:1,dash:.9},
  a:{shw:[52,104],bkw:[192,104],head:[118,14],hw:118,eyeY:70,torso:[118,172,116,70],shl:[72,126],shr:[166,126],hl:[22,108],hr:[212,116],ftl:[80,288],ftr:[148,292],back:[118,128],hip:[74,222],unit:110}},
 bean:{img:'art/c_bean.webp',w:179,h:320,body:'pod',play:true,
  name:{en:'Mr Bean',ja:'ミスター・ビーン'},role:{en:'Agile skirmisher',ja:'高機動スカーミッシャー'},
  blurb:{en:'No arms, all nerve. Weapons clamp to side pylons and a spine mount; the tail takes the thruster.',ja:'うではないけど、度胸はある。武器はサイドパイロンと背骨マウントに。しっぽにはスラスター。'},
  mul:{ap:.82,spd:1.2,en:1,fire:1,dash:1.25},
  a:{shw:[44,128],bkw:[156,122],head:[100,46],hw:100,eyeY:100,torso:[98,196,96,92],shl:[56,132],shr:[144,132],hl:[8,186],hr:[192,186],ml:[50,186],mr:[148,186],tail:[150,272],bottom:[94,300],back:[98,128],hip:[98,250],unit:92}},
 asmon:{img:'art/c_asmon.webp',w:136,h:320,body:'humanoid',play:false,
  name:{en:'Asmon',ja:'アズモン'},role:{en:'Override duelist',ja:'オーバーライド・デュエリスト'},
  blurb:{en:'Former LOOMCORP ace. Fights like he owns the city and wants it to know.',ja:'元ルームコープのエース。街ごと自分のものだと言わんばかりに戦う。'},
  mul:{ap:1.05,spd:1.05,en:1,fire:1.1,dash:1.05},
  a:{shw:[26,118],bkw:[110,112],head:[62,22],hw:88,eyeY:80,torso:[62,166,80,64],shl:[26,126],shr:[108,126],hl:[18,218],hr:[112,222],legl:[46,272],legr:[90,272],ftl:[44,306],ftr:[94,306],back:[62,130],hip:[100,206],unit:80}},
 bronny:{img:'art/c_bronny.webp',w:198,h:320,body:'humanoid',play:false,
  name:{en:'Bronny',ja:'ブロニー'},role:{en:'Courtside Lancer ace',ja:'コートサイド・ランサーのエース'},
  a:{shw:[46,124],bkw:[150,120],head:[96,16],hw:100,eyeY:62,torso:[100,166,90,70],shl:[52,136],shr:[150,136],hl:[30,210],hr:[166,200],legl:[66,262],legr:[128,262],ftl:[56,300],ftr:[140,300],back:[100,140],hip:[70,206],unit:92}},
 dkermit:{img:'art/c_dkermit.webp',w:298,h:420,body:'humanoid',play:false,
  name:{en:'Dark Kermit',ja:'ダーク・カーミット'},role:{en:'LOOMCORP foreman',ja:'ルームコープの監督官'},
  a:{shw:[96,182],bkw:[256,176],head:[175,40],hw:140,eyeY:100,torso:[175,290,120,90],shl:[110,190],shr:[245,190],hl:[40,206],hr:[276,300],legl:[125,360],legr:[215,360],ftl:[100,400],ftr:[230,400],back:[175,200],hip:[215,300],unit:112}},
 pooping:{img:'art/c_pooping.webp',w:231,h:320,name:{en:'Mr Pooping',ja:'ミスター・プーピング'}},
 max:{img:'art/c_max.webp',w:178,h:400,name:{en:'Max',ja:'マックス'}},
 party:{img:'art/c_party.webp',w:186,h:400,name:{en:'Party Hat Guy',ja:'パーティーハット・ガイ'}},
};
const PLAYABLE=['pinco','pooh','bean','asmon'];

// ---------- PARTS ----------
// tier: 0 starter, 1 mid, 2 late, 3 legendary. unlock: mission id that puts it in the shop. reward: mission that grants it.
const PARTS={};
function P(id,slot,en,ja,tier,price,st,shape,x){PARTS[id]=Object.assign({id,slot,name:{en,ja},tier,price,shape},st,x||{});}
// HEAD {w,ap,def,stab}
P('h_thimble','head','HD-01 Scrap Cap','HD-01 スクラップ・キャップ',0,0,{w:380,ap:820,def:140,stab:180},'cap');
P('h_button','head','Slit Visor','スリット・バイザー',1,3400,{w:420,ap:900,def:150,stab:200},'visor',{unlock:'m1'});
P('h_darner','head','Antenna Fin','アンテナ・フィン',1,5200,{w:520,ap:1020,def:170,stab:260},'fin',{unlock:'m2'});
P('h_beetle','head','Riot Horns','ライオット・ホーン',2,11800,{w:760,ap:1300,def:220,stab:380},'horns',{unlock:'m4'});
P('h_owl','head','Optic Cluster','オプティック・クラスター',2,13500,{w:480,ap:960,def:160,stab:240,scan:1.25},'cluster',{unlock:'m5'});
P('h_halo','head','Crown Sensor Array','クラウン・センサーアレイ',3,38000,{w:420,ap:1450,def:240,stab:420,scan:1.2},'halo',{reward:'m8'});
// CORE {w,ap,def,stab}
P('c_patch','core','CR-01 Scrap Plate','CR-01 スクラッププレート',0,0,{w:2100,ap:3200,def:180,stab:520},'patch');
P('c_quilt','core','Grid Plating','グリッド・プレーティング',1,4800,{w:2300,ap:3700,def:210,stab:600},'quilt',{unlock:'m1'});
P('c_brig','core','Slat Armor Mk.II','スラットアーマー Mk.II',1,7600,{w:2700,ap:4100,def:240,stab:700},'brig',{unlock:'m3'});
P('c_rivet','core','Reactor Heart','リアクター・ハート',2,14200,{w:2600,ap:4300,def:250,stab:680,enb:1.15},'rivet',{unlock:'m5'});
P('c_bastion','core','Bulwark Frame','ブルワーク・フレーム',2,17500,{w:3900,ap:5600,def:330,stab:960},'bastion',{unlock:'m6'});
P('c_cathedral','core','Arcology Core','アーコロジー・コア',3,42000,{w:3100,ap:6000,def:340,stab:900,enb:1.2},'cathedral',{reward:'m9'});
// ARMS {w,ap,def,aim,melee}
P('a_clamp','arms','AR-01 Clamp Sleeves','AR-01 クランプ・スリーブ',0,0,{w:1100,ap:1500,def:150,aim:1,melee:1},'clamp');
P('a_spool','arms','Coil Gauntlets','コイル・ガントレット',1,4200,{w:1300,ap:1750,def:170,aim:1.05,melee:1.05},'spool',{unlock:'m1'});
P('a_feather','arms','Carbon Braces','カーボン・ブレイス',1,6400,{w:800,ap:1300,def:130,aim:1.18,melee:.95},'feather',{unlock:'m2'});
P('a_piston','arms','Piston Cuffs','ピストン・カフ',2,12600,{w:1700,ap:2100,def:200,aim:1,melee:1.35},'piston',{unlock:'m4'});
P('a_board','arms','Slab Pauldrons','スラブ・ポールドロン',2,15000,{w:2400,ap:2700,def:280,aim:.92,melee:1.1},'board',{unlock:'m6'});
P('a_atlas','arms','Titan Servos','タイタン・サーボ',3,40000,{w:1900,ap:2800,def:290,aim:1.15,melee:1.4},'atlas',{reward:'m10'});
// LEGS {w,ap,def,spd,jump,load}
P('l_kick','legs','LG-01 Kick Plates','LG-01 キックプレート',0,0,{w:2600,ap:2500,def:160,spd:1,jump:1,load:9600},'kick');
P('l_sprint','legs','Sprinter Struts','スプリンター・ストラット',1,5600,{w:2100,ap:2100,def:140,spd:1.14,jump:1.1,load:8800},'sprint',{unlock:'m2'});
P('l_coil','legs','Spring Coils','スプリング・コイル',1,7200,{w:2500,ap:2400,def:150,spd:1.04,jump:1.4,load:9400},'coil',{unlock:'m3'});
P('l_skate','legs','Mag Skates','マグ・スケート',2,12900,{w:2800,ap:2600,def:170,spd:1.22,jump:.9,load:10200},'skate',{unlock:'m5'});
P('l_anvil','legs','Pile Stompers','パイル・ストンパー',2,16400,{w:4400,ap:3900,def:300,spd:.86,jump:.8,load:15800},'anvil',{unlock:'m6'});
P('l_cloud','legs','Gravlift Walkers','グラヴリフト・ウォーカー',3,39000,{w:2600,ap:3300,def:240,spd:1.2,jump:1.35,load:13000},'cloud',{reward:'m7'});
// BOOSTER {w,thrust,dash,ab,use}
P('b_puff','booster','BT-01 Puff Booster','BT-01 パフ・ブースター',0,0,{w:420,thrust:1,dash:1,ab:1,use:1},'puff');
P('b_hornet','booster','Hornet Twin','ホーネット・ツイン',1,5000,{w:520,thrust:1.08,dash:1.15,ab:1.05,use:1.08},'hornet',{unlock:'m2'});
P('b_kettle','booster','Pressure Drive','プレッシャー・ドライブ',1,6800,{w:700,thrust:1.02,dash:.95,ab:1.25,use:.95},'kettle',{unlock:'m3'});
P('b_comet','booster','Comet Jets','コメット・ジェット',2,14800,{w:640,thrust:1.16,dash:1.3,ab:1.2,use:1.12},'comet',{unlock:'m5'});
P('b_wild','booster','Wildfire Ring','ワイルドファイア・リング',3,36000,{w:600,thrust:1.22,dash:1.35,ab:1.35,use:.95},'wildfire',{reward:'f1'});
// GENERATOR {w,en,regen,delay}
P('g_pocket','gen','GN-01 Pocket Dynamo','GN-01 ポケット・ダイナモ',0,0,{w:520,en:2000,regen:820,delay:1},'pocket');
P('g_teapot','gen','Canister Reactor','キャニスター・リアクター',1,5400,{w:700,en:2400,regen:880,delay:1},'teapot',{unlock:'m2'});
P('g_spindle','gen','Stack Cell','スタック・セル',1,8200,{w:640,en:2200,regen:1080,delay:.8},'spindle',{unlock:'m4'});
P('g_lantern','gen','Fusion Bulb','フュージョン・バルブ',2,15600,{w:820,en:2900,regen:1100,delay:.85},'lantern',{unlock:'m6'});
P('g_sun','gen','Micro Star','マイクロ・スター',3,41000,{w:760,en:3300,regen:1380,delay:.7},'sun',{reward:'m9'});
// FCS {w,range,lock,miss}
P('f_peep','fcs','FC-01 Peep Scope','FC-01 ピープ・スコープ',0,0,{w:120,range:70,lock:1,miss:1},'peep');
P('f_magpie','fcs','Spike Array','スパイク・アレイ',1,4600,{w:160,range:78,lock:1.2,miss:1.25},'magpie',{unlock:'m3'});
P('f_needle','fcs','Long Optic','ロング・オプティック',2,12200,{w:180,range:105,lock:1.1,miss:1},'needle',{unlock:'m5'});
P('f_oracle','fcs','Oracle Uplink','オラクル・アップリンク',3,34000,{w:150,range:95,lock:1.45,miss:1.5},'oracle',{reward:'f2'});
// WEAPONS {w,cls,dmg,rate,shock,mag,reload,spd,rng,...}
// right hand
P('wr_tacker','wr','RF-01 Bolt Rifle','RF-01 ボルト・ライフル',0,0,{w:620,cls:'rifle',dmg:120,rate:4,shock:40,mag:30,reload:2.2,spd:150,rng:70},'rifle');
P('wr_stapler','wr','Buzz SMG','バズSMG',1,4400,{w:520,cls:'rifle',dmg:58,rate:11,shock:22,mag:60,reload:2.4,spd:140,rng:48},'smg',{unlock:'m1'});
P('wr_buck','wr','Riot Scattergun','ライオット・スキャッターガン',1,6200,{w:720,cls:'shotgun',dmg:62,pel:9,rate:1.25,shock:34,mag:8,reload:2.6,spd:120,rng:30},'shotgun',{unlock:'m2',short:{en:'Scatter',ja:'スキャッター'}});
P('wr_seam','wr','Longshot Rifle','ロングショット・ライフル',1,8800,{w:860,cls:'rifle',dmg:420,rate:.9,shock:180,mag:8,reload:3,spd:260,rng:105},'longrifle',{unlock:'m3',short:{en:'Longshot',ja:'ロングショット'}});
P('wr_rivet','wr','Burst Driver','バースト・ドライバー',2,12400,{w:760,cls:'rifle',dmg:150,rate:6.5,burst:3,shock:70,mag:36,reload:2.6,spd:170,rng:72},'burst',{unlock:'m4',short:{en:'Burst',ja:'バースト'}});
P('wr_hammer','wr','Hammer Cannon','ハンマー・キャノン',2,15800,{w:1600,cls:'cannon',dmg:1150,rate:.5,shock:620,mag:6,reload:3.6,spd:85,rng:80,splash:5},'cannon',{unlock:'m6',short:{en:'Hammer',ja:'ハンマー'}});
P('wr_thread','wr','Arc Laser','アーク・レーザー',2,17200,{w:900,cls:'laser',dmg:180,rate:2.5,shock:80,en:90,charge:.8,cdmg:1500,cshock:520,rng:90},'laser',{unlock:'m7',short:{en:'Laser',ja:'レーザー'}});
P('wr_couture','wr','Prism Repeater','プリズム・リピーター',3,44000,{w:980,cls:'rifle',dmg:240,rate:5,shock:110,mag:40,reload:2,spd:220,rng:90},'couture',{reward:'m10',short:{en:'Prism',ja:'プリズム'}});
// left hand
P('wl_cutter','wl','BL-01 Heat Cutter','BL-01 ヒートカッター',0,0,{w:340,cls:'blade',dmg:900,rate:1.2,shock:360,cdmg:2200,cshock:900,rng:13},'cutter');
P('wl_pistol','wl','Bolt Pistol','ボルト・ピストル',1,3600,{w:380,cls:'rifle',dmg:95,rate:4.5,shock:34,mag:24,reload:1.8,spd:150,rng:60},'pistol',{unlock:'m1'});
P('wl_scatter','wl','Scatter Mitt','スキャッター・ミット',1,6000,{w:640,cls:'shotgun',dmg:58,pel:8,rate:1.4,shock:30,mag:8,reload:2.4,spd:120,rng:28},'mitt',{unlock:'m2'});
P('wl_shears','wl','Shear Claws','シアー・クロー',1,8400,{w:520,cls:'blade',dmg:620,hits:2,rate:1.5,shock:300,cdmg:2600,cshock:1000,rng:12},'shears',{unlock:'m3',short:{en:'Claws',ja:'クロー'}});
P('wl_needle','wl','Pile Driver','パイル・ドライバー',2,18800,{w:1300,cls:'pile',dmg:2600,rate:.45,shock:1400,cdmg:4200,cshock:1800,rng:9},'needle',{unlock:'m5',short:{en:'Pile',ja:'パイル'}});
P('wl_moon','wl','Plasma Crescent','プラズマ・クレセント',3,40000,{w:460,cls:'blade',dmg:1200,rate:1.2,shock:480,cdmg:3400,cshock:1200,rng:15,wave:1},'moon',{reward:'m8'});
// shoulder
P('sh_sparrow','sh','MS-01 Sparrow Pod','MS-01 スパロウ・ポッド',0,0,{w:700,cls:'missile',dmg:240,n:4,rate:.3,shock:120,spd:46,turn:3},'pod');
P('sh_firefly','sh','Firefly Swarm','ファイアフライ・スウォーム',1,6600,{w:780,cls:'missile',dmg:110,n:10,rate:.28,shock:55,spd:52,turn:4},'swarm',{unlock:'m2',short:{en:'Firefly',ja:'ファイアフライ'}});
P('sh_mortar','sh','Drum Mortar','ドラム・モーター',1,7400,{w:980,cls:'mortar',dmg:680,n:2,rate:.35,shock:420,spd:40,splash:6},'mortar',{unlock:'m3',short:{en:'Mortar',ja:'モーター'}});
P('sh_thimble','sh','Tube Rockets','チューブ・ロケット',2,11200,{w:900,cls:'rocket',dmg:900,n:2,rate:.45,shock:520,spd:90,splash:4},'rockets',{unlock:'m4',short:{en:'Rockets',ja:'ロケット'}});
P('sh_gatling','sh','Rotor Gatling','ローター・ガトリング',2,13600,{w:1100,cls:'gatling',dmg:46,rate:14,shock:16,mag:180,reload:4,spd:150,rng:60},'gatling',{unlock:'m6',short:{en:'Gatling',ja:'ガトリング'}});
P('sh_star','sh','Starburst Array','スターバースト・アレイ',3,43000,{w:1200,cls:'missile',dmg:200,n:16,rate:.22,shock:90,spd:55,turn:4.5},'starburst',{reward:'m9',short:{en:'Starburst',ja:'スターバースト'}});
// back
P('bk_rack','bk','Repair Kit Rack','リペアキット・ラック',0,0,{w:300,cls:'rack',kits:1},'rack');
P('bk_cannon','bk','Long Cannon','ロング・キャノン',1,8600,{w:1500,cls:'cannon',dmg:1300,rate:.32,shock:700,mag:5,reload:4,spd:95,rng:90,splash:6},'bkcannon',{unlock:'m3',short:{en:'Cannon',ja:'キャノン'}});
P('bk_kites','bk','Kite Drones','カイト・ドローン',2,14400,{w:600,cls:'drones',dmg:70,rate:.1,dur:12,shock:28},'kites',{unlock:'m5'});
P('bk_pulse','bk','Pulse Barrier','パルス・バリア',2,13000,{w:800,cls:'pulse',rate:.1,dur:4,red:.75,dmg:600,shock:500},'pulse',{unlock:'m6'});
P('bk_rail','bk','LOOM-X Railgun','ルームX・レールガン',3,46000,{w:1700,cls:'rail',dmg:4200,rate:.18,shock:1600,charge:1.1,rng:140},'rail',{reward:'m10',short:{en:'Railgun',ja:'レールガン'}});
// character uniques
P('wl_rapier','wl','Monowire Saber','モノワイヤー・セイバー',2,0,{w:420,cls:'blade',dmg:760,hits:3,rate:1.4,shock:330,cdmg:3000,cshock:1150,rng:14},'rapier',{only:'pinco',reward:'m4',short:{en:'Saber',ja:'セイバー'}});
P('bk_hunny','bk','Hunny Mortar','ハニー・モーター',2,0,{w:1100,cls:'mortar',dmg:520,n:3,rate:.3,shock:380,spd:38,splash:7,slow:1},'hunny',{only:'pooh',reward:'m2'});
P('sh_podburst','sh','Pod Burst Array','ポッドバースト・アレイ',2,0,{w:760,cls:'missile',dmg:130,n:12,rate:.26,shock:70,spd:58,turn:4.2},'podburst',{only:'bean',reward:'m3',short:{en:'Pod Burst',ja:'ポッドバースト'}});
P('wl_regalia','wl','Violet Override Blade','ヴァイオレット・オーバーライド',3,0,{w:560,cls:'blade',dmg:1300,rate:1.1,shock:520,cdmg:3600,cshock:1300,rng:16,wave:1},'regalia',{only:'asmon',reward:'m10',short:{en:'Override',ja:'オーバーライド'}});
// gacha-exclusive parts (FLUX banners only)
P('h_oni','head','Oni Riot Visor','オニ・ライオットバイザー',3,0,{w:520,ap:1500,def:250,stab:430,scan:1.15},'horns',{gacha:1});
P('c_overclock','core','Overclock Core','オーバークロック・コア',3,0,{w:2900,ap:5800,def:320,stab:860,enb:1.28},'rivet',{gacha:1});
P('b_phantom','booster','Phantom Jets','ファントム・ジェット',3,0,{w:560,thrust:1.25,dash:1.45,ab:1.3,use:.9},'comet',{gacha:1});
P('wr_zap','wr','Zapper Repeater','ザッパー・リピーター',3,0,{w:820,cls:'rifle',dmg:150,rate:8,shock:70,mag:48,reload:1.8,spd:240,rng:85},'laser',{gacha:1,short:{en:'Zapper',ja:'ザッパー'}});
P('wl_katana','wl','Neon Katana','ネオン・カタナ',3,0,{w:420,cls:'blade',dmg:1400,hits:2,rate:1.5,shock:560,cdmg:3800,cshock:1400,rng:16,wave:1},'katana',{gacha:1,short:{en:'Katana',ja:'カタナ'}});
P('sh_hive','sh','Swarm Hive','スウォーム・ハイヴ',3,0,{w:900,cls:'missile',dmg:150,n:14,rate:.3,shock:70,spd:58,turn:4.6},'swarm',{gacha:1,short:{en:'Hive',ja:'ハイヴ'}});
P('bk_saw','bk','Buzzsaw Drones','バズソー・ドローン',3,0,{w:620,cls:'drones',dmg:120,rate:.12,dur:14,shock:40},'kites',{gacha:1,short:{en:'Saws',ja:'ソー'}});

const STARTER={head:'h_thimble',core:'c_patch',arms:'a_clamp',legs:'l_kick',booster:'b_puff',gen:'g_pocket',fcs:'f_peep',wr:'wr_tacker',wl:'wl_cutter',sh:'sh_sparrow',bk:'bk_rack'};

// ---------- PAINTS (p primary, s secondary/gunmetal, a accent, g glow) ----------
const PAINTS=[
 {id:'grey',name:{en:'Scrap Grey',ja:'スクラップ・グレー'},p:'#8d939e',s:'#3a3f4b',a:'#ff7a1a',g:'#4ef0ff',price:0},
 {id:'orange',name:{en:'Safety Orange',ja:'セーフティ・オレンジ'},p:'#d9701f',s:'#2c2f3a',a:'#e8e2d0',g:'#4ef0ff',price:2500},
 {id:'night',name:{en:'Night Circuit',ja:'ナイト・サーキット'},p:'#2b3140',s:'#14171f',a:'#46e6ff',g:'#46e6ff',price:4000,unlock:'m2'},
 {id:'gum',name:{en:'Rust Belt',ja:'ラスト・ベルト'},p:'#7a4a2e',s:'#231a15',a:'#d9a441',g:'#ff8a3a',price:4000,unlock:'m3'},
 {id:'hazard',name:{en:'Hazard Honey',ja:'ハザード・ハニー'},p:'#ffc21f',s:'#1d1b17',a:'#141414',g:'#ffd257',price:5000,unlock:'m4'},
 {id:'olive',name:{en:'Hazmat Olive',ja:'ハズマット・オリーブ'},p:'#6f7a45',s:'#2a2d22',a:'#e8d36a',g:'#a8ff5e',price:5000,unlock:'m5'},
 {id:'violet',name:{en:'Override Violet',ja:'オーバーライド・ヴァイオレット'},p:'#5d3c8c',s:'#1d1530',a:'#e4b34a',g:'#c58cff',price:0,reward:'m8'},
 {id:'chrome',name:{en:'Gunmetal Bandit',ja:'ガンメタル・バンディット'},p:'#7d848e',s:'#1e2127',a:'#e8273a',g:'#ff4155',price:9000,unlock:'m7'},
 {id:'neon',name:{en:'Neon Riot',ja:'ネオン・ライオット'},p:'#1c1f2e',s:'#0d0f18',a:'#ff2bd6',g:'#2bfff1',price:0,gacha:1},
 {id:'toxic',name:{en:'Dead Zone Toxic',ja:'デッドゾーン・トキシック'},p:'#3d4a2a',s:'#151a10',a:'#c6ff2e',g:'#7dff4a',price:0,gacha:1},
];

// ---------- ENEMIES ----------
const FOES={
 dummy:{ap:400,shock:200,r:1.4,score:50,name:{en:'Target drone',ja:'標的ドローン'}},
 spindle:{ap:620,shock:260,r:1.5,score:120,cr:350,name:{en:'Buzz drone',ja:'バズ・ドローン'}},
 walker:{ap:1300,shock:520,r:1.9,score:220,cr:600,name:{en:'Shear Walker',ja:'シアー・ウォーカー'}},
 tank:{ap:2000,shock:900,r:2.6,score:300,cr:800,name:{en:'Crawler tank',ja:'クローラー戦車'}},
 turret:{ap:1600,shock:800,r:2,score:260,cr:700,name:{en:'Spike Turret',ja:'スパイク・タレット'}},
 pylon:{ap:3200,shock:0,r:2.6,score:400,cr:900,name:{en:'Glimmer pump',ja:'グリマーポンプ'}},
 gate:{ap:7000,shock:0,r:4,score:800,cr:2000,name:{en:'Gate core',ja:'ゲートコア'}},
 jammer:{ap:5200,shock:0,r:3,score:600,cr:1500,name:{en:'Jammer mast',ja:'ジャマー・マスト'}},
 anchor:{ap:5600,shock:0,r:3,score:700,cr:1600,name:{en:'Spire anchor',ja:'スパイア・アンカー'}},
 heart:{ap:16000,shock:0,r:5,score:2000,cr:5000,name:{en:'Heart Reactor',ja:'ハート・リアクター'}},
 boss:{ap:30000,shock:4200,r:7,score:3000,cr:8000,name:{en:'LOOM Walker LW-0',ja:'ルーム・ウォーカー LW-0'}},
};
const ACES={
 bronny:{ap:18000,shock:2600,spd:15,char:'bronny',paint:{p:'#c9ced8',s:'#20314f',a:'#ff8a1a',g:'#ffb347'},
   load:{head:null,core:'c_bastion',arms:'a_piston',legs:'l_skate',booster:'b_comet',wr:'wr_buck',wl:'wl_shears',sh:'sh_firefly',bk:null},
   frame:{en:'SLAM WARD',ja:'スラム・ワード'}},
 dkermit:{ap:11000,shock:2200,spd:12,char:'dkermit',paint:{p:'#2a2f2a',s:'#141614',a:'#d9b13b',g:'#8dff6a'},
   load:{head:null,core:'c_brig',arms:'a_spool',legs:'l_coil',booster:'b_kettle',wr:'wr_seam',wl:null,sh:'sh_mortar',bk:'bk_kites'},
   frame:{en:'BOG FOREMAN',ja:'ボグ・フォアマン'}},
 asmon:{ap:24000,shock:3200,spd:17,char:'asmon',paint:{p:'#4b2f78',s:'#1b1430',a:'#e4b34a',g:'#c58cff'},
   load:{head:null,core:'c_cathedral',arms:'a_atlas',legs:'l_cloud',booster:'b_wild',wr:'wr_couture',wl:'wl_regalia',sh:'sh_star',bk:null},
   frame:{en:'VIOLET OVERRIDE',ja:'ヴァイオレット・オーバーライド'}},
};

// ---------- MAPS ----------
const MAPS={
 yard:{bg:'bg_hangar',ground:'#2a2d36',line:'#ff8a2a',fog:'#141a26',sky:'#0c1018',light:'#ffd2a0',rim:'#4ef0ff',props:'yard',r:66},
 highway:{bg:'bg_highway',ground:'#262a33',line:'#ffb347',fog:'#101828',sky:'#0b1222',light:'#ffc07a',rim:'#5ab8ff',props:'highway',r:74},
 factory:{bg:'bg_factory',ground:'#2c2a2a',line:'#ff4a2a',fog:'#2a1712',sky:'#1a0f0c',light:'#ff9a6a',rim:'#ff4a2a',props:'factory',r:70},
 court:{bg:'bg_court',ground:'#2a3040',line:'#e8eef7',fog:'#121a2a',sky:'#0b1020',light:'#dbe8ff',rim:'#ff8a2a',props:'court',r:56},
 canyon:{bg:'bg_canyon',ground:'#3a302c',line:'#46e6ff',fog:'#2a1c1a',sky:'#1a1018',light:'#ffb07a',rim:'#46e6ff',props:'canyon',r:72},
 crater:{bg:'bg_canyon',ground:'#2f2a2b',line:'#46e6ff',fog:'#1d1418',sky:'#140c12',light:'#ff9a6a',rim:'#46e6ff',props:'crater',r:70},
 sky:{bg:'bg_city',ground:'#2e3242',line:'#ff3df0',fog:'#2a1c3a',sky:'#1a1428',light:'#ffd0a0',rim:'#5ab8ff',props:'sky',r:58},
 spire:{bg:'bg_spire',ground:'#25222f',line:'#c58cff',fog:'#1b1530',sky:'#120d22',light:'#d7c0ff',rim:'#c58cff',props:'spire',r:70},
 town:{bg:'bg_town',ground:'#2a2632',line:'#ffb347',fog:'#24162e',sky:'#140c1c',light:'#ffb070',rim:'#ff3df0',props:'town',r:66},
 zone:{bg:'bg_zone',ground:'#232a24',line:'#7dff4a',fog:'#0f1f16',sky:'#08120e',light:'#b8ffc0',rim:'#7dff4a',props:'zone',r:120},
};

// ---------- MISSIONS ----------
// phase types: reach, kill, escort, defend, duel, boss, survive, endless
const MISSIONS=[
 {id:'m1',ep:1,map:'yard',par:150,cr:6000,brief:'s_m1',debrief:'d_m1',grant:['wr_stapler'],
  title:{en:'Bolt the First Plate',ja:'最初の装甲'},
  sum:{en:'Training sortie at Scrapyard 9. Learn to boost, lock on, shoot and slash.',ja:'第9スクラップヤードでの訓練出撃。ブースト、ロック、射撃、斬撃を覚えよう。'},
  phases:[
   {type:'reach',at:[0,-34],obj:{en:'Boost to the marker',ja:'マーカーまでブーストせよ'},tip:'tip_move'},
   {type:'kill',spawn:[{t:'dummy',n:4,ring:[0,-34,14],y:3}],obj:{en:'Lock on and shoot the target drones',ja:'ロックオンして標的ドローンを撃て'},tip:'tip_fire'},
   {type:'kill',spawn:[{t:'dummy',n:2,ring:[0,-10,8],y:2,shock:60}],obj:{en:'Break a drone, then hit it with your blade',ja:'ドローンを崩して、ブレードで斬れ'},tip:'tip_blade'},
   {type:'kill',spawn:[{t:'spindle',n:5,ring:[0,0,40]}],obj:{en:'Raid! Destroy the LOOMCORP drones',ja:'襲撃！ルームコープのドローンを撃破せよ'},tip:'tip_dash',comm:'c_m1raid'}]},
 {id:'m2',ep:2,map:'highway',par:200,cr:9000,brief:'s_m2',debrief:'d_m2',grant:['bk_hunny','h_button'],
  title:{en:'Night Convoy',ja:'夜のコンボイ'},
  sum:{en:'Escort three honey-fuel haulers across the dead highway. Keep at least one alive.',ja:'ハニー燃料の輸送車3台を廃ハイウェイの先まで護衛せよ。最低1台を守りきれ。'},
  phases:[
   {type:'escort',trucks:3,from:-62,to:62,spd:2.6,waves:[{t:'spindle',n:3,at:8},{t:'walker',n:2,at:20},{t:'spindle',n:4,at:32},{t:'walker',n:3,at:44},{t:'spindle',n:3,at:52}],obj:{en:'Escort the fuel haulers',ja:'燃料輸送車を護衛せよ'},tip:'tip_escort'}]},
 {id:'m3',ep:3,map:'factory',par:260,cr:12000,brief:'s_m3',debrief:'d_m3',grant:['sh_podburst','c_brig'],
  title:{en:'Glimmer Refinery',ja:'グリマー精製所'},
  sum:{en:'Hit the LOOMCORP refinery. Destroy four Glimmer pumps, then the gate core.',ja:'ルームコープの精製所を叩け。グリマーポンプ4基、そしてゲートコアを破壊せよ。'},
  phases:[
   {type:'kill',spawn:[{t:'pylon',n:4,ring:[0,0,36]},{t:'turret',n:2,ring:[0,0,22]},{t:'tank',n:2,ring:[0,0,48]}],need:'pylon',obj:{en:'Destroy the Glimmer pumps',ja:'グリマーポンプを破壊せよ'}},
   {type:'kill',spawn:[{t:'gate',n:1,at:[0,-50]},{t:'walker',n:4,ring:[0,-40,14]}],need:'gate',obj:{en:'Destroy the gate core',ja:'ゲートコアを破壊せよ'}},
   {type:'duel',ace:'dkermit',until:.5,obj:{en:'The foreman is here. Drive him off',ja:'監督官が出た。撃退せよ'},comm:'c_m3kermit'}]},
 {id:'m4',ep:4,map:'yard',par:240,cr:14000,brief:'s_m4',debrief:'d_m4',grant:['wl_rapier','h_beetle'],
  title:{en:'Hold Scrapyard 9',ja:'第9スクラップヤード防衛戦'},
  sum:{en:'LOOMCORP is coming for our hangar. Protect the yard generator through three waves.',ja:'ルームコープが格納庫を狙っている。3波の攻撃からヤードの発電機を守れ。'},
  phases:[
   {type:'defend',hp:9000,waves:[[{t:'spindle',n:6}],[{t:'walker',n:3},{t:'tank',n:2}],[{t:'spindle',n:4},{t:'walker',n:3},{t:'turret',n:2,ring:[0,0,34]}]],obj:{en:'Defend the yard generator',ja:'ヤードの発電機を守れ'},tip:'tip_defend'}]},
 {id:'m5',ep:5,map:'court',par:180,cr:16000,brief:'s_m5',debrief:'d_m5',grant:['l_skate'],
  title:{en:'Courtside',ja:'コートサイド'},
  sum:{en:'A mercenary ace challenged the Brigade to a duel in the Neon Colosseum. Beat Bronny.',ja:'傭兵のエースがネオン・コロシアムで旅団に決闘を挑んできた。ブロニーを倒せ。'},
  phases:[{type:'duel',ace:'bronny',until:0,obj:{en:'Defeat Bronny',ja:'ブロニーを倒せ'},tip:'tip_stagger'}]},
 {id:'m6',ep:6,map:'canyon',par:300,cr:18000,brief:'s_m6',debrief:'d_m6',grant:['g_spindle'],
  title:{en:'Three Relays',ja:'三つの中継塔'},
  sum:{en:'Scan three relay beacons, destroy the jammer, then reach extraction.',ja:'中継ビーコン3つをスキャンし、ジャマーを破壊して、回収地点へ向かえ。'},
  phases:[
   {type:'reach',at:[-40,-30],hold:2,spawn:[{t:'spindle',n:3,ring:[-40,-30,20]}],obj:{en:'Scan relay beacon 1 of 3',ja:'中継ビーコンをスキャン (1/3)'}},
   {type:'reach',at:[42,-38],hold:2,spawn:[{t:'walker',n:3,ring:[42,-38,18]}],obj:{en:'Scan relay beacon 2 of 3',ja:'中継ビーコンをスキャン (2/3)'}},
   {type:'reach',at:[10,40],hold:2,spawn:[{t:'tank',n:2,ring:[10,40,22]},{t:'spindle',n:2,ring:[10,40,16]}],obj:{en:'Scan relay beacon 3 of 3',ja:'中継ビーコンをスキャン (3/3)'}},
   {type:'kill',spawn:[{t:'jammer',n:1,at:[0,-58]},{t:'turret',n:3,ring:[0,-58,12]}],need:'jammer',obj:{en:'Destroy the jammer mast',ja:'ジャマー・マストを破壊せよ'}},
   {type:'reach',at:[0,58],obj:{en:'Reach extraction',ja:'回収地点へ向かえ'}}]},
 {id:'m7',ep:7,map:'crater',par:260,cr:22000,brief:'s_m7',debrief:'d_m7',grant:['l_cloud'],
  title:{en:'The LOOM Walker',ja:'ルーム・ウォーカー'},
  sum:{en:'LOOMCORP fielded a four-legged siege unit. Break its legs, then hit the core.',ja:'ルームコープが四脚の攻城兵器を投入した。脚を壊して、コアを叩け。'},
  phases:[{type:'boss',obj:{en:'Destroy the LOOM Walker',ja:'ルーム・ウォーカーを撃破せよ'},tip:'tip_boss'}]},
 {id:'m8',ep:8,map:'sky',par:200,cr:24000,brief:'s_m8',debrief:'d_m8',grant:['h_halo','wl_moon'],paint:'violet',
  title:{en:'Violet Override',ja:'ヴァイオレット・オーバーライド'},
  sum:{en:'Asmon, LOOMCORP’s top ace, is hunting the Brigade across the skyway rooftops. Survive him.',ja:'ルームコープ最強のエース、アズモンが屋上スカイウェイで旅団を狩りに来た。生き延びろ。'},
  phases:[{type:'duel',ace:'asmon',until:.5,adds:[{t:'spindle',n:3,every:22}],obj:{en:'Survive Asmon. Push him back',ja:'アズモンを押し返せ'},comm:'c_m8asmon'}]},
 {id:'m9',ep:9,map:'spire',par:360,cr:30000,brief:'s_m9',debrief:'d_m9',grant:['c_cathedral','g_sun','sh_star'],
  title:{en:'Arcology Assault',ja:'アーコロジー強襲'},
  sum:{en:'Storm the LOOMCORP Spire. Cut the anchors, beat Asmon, shut down the Heart Reactor.',ja:'ルームコープ・スパイア強襲。アンカーを断ち、アズモンを倒し、ハート・リアクターを止めろ。'},
  phases:[
   {type:'kill',spawn:[{t:'anchor',n:3,ring:[0,0,44]},{t:'walker',n:3,ring:[0,0,30]},{t:'spindle',n:4,ring:[0,0,36]}],need:'anchor',obj:{en:'Cut the three spire anchors',ja:'スパイア・アンカー3基を断て'}},
   {type:'duel',ace:'asmon',until:0,obj:{en:'Defeat Asmon',ja:'アズモンを倒せ'},comm:'c_m9asmon'},
   {type:'kill',spawn:[{t:'heart',n:1,at:[0,0]},{t:'turret',n:3,ring:[0,0,16]}],need:'heart',obj:{en:'Destroy the Heart Reactor',ja:'ハート・リアクターを破壊せよ'},comm:'c_m9heart'}]},
 {id:'m10',ep:10,map:'town',par:260,cr:36000,brief:'s_m10',debrief:'d_m10',grant:['a_atlas','wr_couture','bk_rail','wl_regalia'],
  title:{en:'Stitched Together',ja:'つなぎ合わせて'},
  sum:{en:'Leftover LOOMCORP machines went rogue at the slum festival. Protect the district beacon.',ja:'ルームコープの残存機械がスラムの祭りで暴走した。地区のビーコンを守れ。'},
  phases:[{type:'defend',hp:12000,ally:'asmon',allyWave:1,waves:[[{t:'spindle',n:6},{t:'walker',n:2}],[{t:'walker',n:4},{t:'tank',n:2},{t:'spindle',n:4}],[{t:'tank',n:3},{t:'turret',n:2,ring:[0,0,30]},{t:'spindle',n:6}]],obj:{en:'Protect the district beacon',ja:'地区のビーコンを守れ'},comm:'c_m10'}]},
 // free sorties
 {id:'f1',free:true,map:'highway',par:150,cr:9000,unlockAfter:'m1',grant:['b_wild'],grantRank:'S',
  title:{en:'Scrap Run',ja:'スクラップ・ラン'},sum:{en:'Wreck 25 LOOMCORP machines as fast as you can. Repeatable.',ja:'ルームコープの機械25機をできるだけ速く破壊せよ。くり返し出撃可。'},
  phases:[{type:'survive',kills:25,mix:['spindle','spindle','walker','tank'],obj:{en:'Wreck LOOMCORP machines',ja:'ルームコープの機械を破壊せよ'}}]},
 {id:'f2',free:true,map:'court',par:300,cr:20000,unlockAfter:'m5',grant:['f_oracle'],grantRank:'S',
  title:{en:'Ace Gauntlet',ja:'エース・ガントレット'},sum:{en:'Three aces back to back: Bronny, Dark Kermit, Asmon. Repeatable.',ja:'エース3人と連戦：ブロニー、ダーク・カーミット、アズモン。くり返し出撃可。'},
  phases:[{type:'duel',ace:'bronny',until:0,obj:{en:'Ace 1: Bronny',ja:'エース1：ブロニー'}},{type:'duel',ace:'dkermit',until:0,obj:{en:'Ace 2: Dark Kermit',ja:'エース2：ダーク・カーミット'}},{type:'duel',ace:'asmon',until:0,obj:{en:'Ace 3: Asmon',ja:'エース3：アズモン'}}]},
 {id:'f3',free:true,map:'factory',par:0,cr:1500,unlockAfter:'m4',endless:true,
  title:{en:'Last Stand',ja:'ラスト・スタンド'},sum:{en:'Endless waves. Credits for every wave you clear. Repeatable.',ja:'終わりのないウェーブ。クリアしたウェーブごとにクレジット。くり返し出撃可。'},
  phases:[{type:'endless',obj:{en:'Survive the waves',ja:'ウェーブを生き延びろ'}}]},
];

// Dead Zone (zombie mode) pseudo-mission
const ZMISSION={id:'zombie',zombie:true,map:'zone',par:0,cr:0,title:{en:'Dead Zone',ja:'デッドゾーン'},
 sum:{en:'Rogue Husks swarm the quarantine zone. Survive the rounds, earn points, open the gates.',ja:'暴走ハスクが隔離区域にあふれる。ラウンドを生き延び、ポイントでゲートを開け。'},
 phases:[{type:'zombie',obj:{en:'Survive the Husk rounds',ja:'ハスクのラウンドを生き延びろ'}}]};
