'use strict';
// MAKEUP clips (times in beats)
window.CLIPS=window.CLIPS||[];
CLIPS.push(
{id:'m01',cat:'makeup',by:'pinco',song:'makeup',seed:401,bpm:120,likes:188000,cm:6100,
 cap:['5-minute soft glam 💗 blush, gloss, shimmer, done #softglam #grwm #tutorial','5分でソフトグラム💗 チーク・グロス・ラメで完成'],
 snd:['Soft Glam Drop','ソフトグラム・ドロップ'],
 com:[['asmon','the transition 😳','トランジションやば😳'],['bean','I tried this and now I am pink','まねしたらピンクになった']],
 shots:[
 {d:4,bg:'vanity',a:[['c_pinco_0',.5,.9,.52,'bob',{in:'pop'}]],tx:[[0,4,'5-minute soft glam 💗','5分でソフトグラム 💗','big',.17]],sx:[[0,'pop']]},
 {d:4,bg:'vanity',tr:'whip',cam:[1.15,1.25,.5,.5,.42,.4],a:[['pinco_makeup_0',.5,.92,.55,'idle']],fx:[['blush',1,4,{x:.47,y:.36,d:.09}],['sparkle',1,4,{x:.44,y:.38,r:.06,n:6}]],tx:[[0,4,'1. blush (pink, obviously)','1. チーク（もちろんピンク）','pill',.17]],sx:[[1,'swish'],[2,'swish']]},
 {d:4,bg:'vanity',tr:'whip',cam:[1.15,1.25,.5,.5,.42,.4],a:[['pinco_makeup_1',.5,.92,.55,'idle']],fx:[['sparkle',1,4,{x:.47,y:.4,r:.05,n:5}]],tx:[[0,4,'2. gloss','2. グロス','pill',.17],[1.5,4,'*mwah*','*チュッ*','big',.6,{c:'#ff8fc4'}]],sx:[[1.5,'kiss']]},
 {d:3,bg:'vanity',tr:'cut',cam:[1.1,1.1,.5,.5,.5,.5],a:[['p_palette',.5,.62,.2,'pulse',{in:'pop',sh:0}]],fx:[['shine',0,3]],tx:[[0,3,'3. shimmer ✨','3. ラメ ✨','pill',.17]],sx:[[0,'riser']]},
 {d:8,bg:'vanity',tr:'wipe',a:[['pinco_makeup_2',.5,.92,.56,'bob']],fx:[['rays',0,8,{x:.5,y:.45,c:'#ffe1f0'}],['sparkle',0,8,{x:.5,y:.5,r:.3,n:18}],['hearts',1,8,{x:.5,y:.6,n:10}]],tx:[[0,8,'DONE 💅','完成 💅','big',.17,{c:'#ff8fc4'}]],sx:[[0,'drop'],[1,'kiss']],pz:[0,2,4,6]}
]},
{id:'m02',cat:'makeup',by:'asmon',song:'villain',seed:402,bpm:140,likes:166000,cm:7333,
 cap:['Villain contour tutorial 😈 rule 2 is the most important #contour #villainera','悪役シェーディング講座😈 ルール2がいちばん大事'],
 snd:['Contour of Doom','破滅のシェーディング'],
 com:[['pinco','why is this actually good','なんで普通に上手いの'],['pooh','are you a hero now?','もうヒーローなの？']],
 shots:[
 {d:6,bg:'lair',cam:[1,1.1,.5,.5,.5,.45],a:[['c_asmon_0',.5,.92,.6,'idle']],fx:[['bars',0,6],['flash',2,2.8,{c:'#b9a6ff',a:.6}]],tx:[[0,6,'villain contour tutorial 😈','悪役シェーディング講座 😈','big',.17]],sx:[[0,'evil'],[2,'thunder']]},
 {d:6,bg:'lair',tr:'cut',cam:[1.2,1.35,.5,.5,.4,.36],a:[['asmon_makeup_0',.5,.94,.62,'idle']],tx:[[0,6,'rule 1: contour like your evil plan depends on it','ルール1：悪の計画がかかってるつもりで塗れ','pill',.17]],sx:[[1,'swish'],[2.5,'swish'],[4,'swish']]},
 {d:6,bg:'lair',tr:'cut',a:[['asmon_makeup_1',.5,.94,.62,'shake']],fx:[['flash',0,.8,{c:'#9b7bff',a:.5}]],tx:[[0,6,'rule 2: evil laugh after every stroke','ルール2：塗るたびに高笑い','pill',.17],[1,6,'MWAHAHA','ムハハハ','big',.64,{c:'#b9a6ff'}]],sx:[[0,'thunder'],[1,'evil']],shake:[1,3,.01]},
 {d:8,bg:'vanity',tr:'wipe',a:[['asmon_makeup_2',.5,.94,.62,'bob']],fx:[['sparkle',0,8,{x:.5,y:.4,r:.25,n:16}],['rays',0,8,{x:.5,y:.4,c:'#f1e2ff'}]],tx:[[0,8,'the reveal ✨','完成 ✨','big',.17],[2,8,'he joined the heroes (for the skincare)','ヒーローの仲間入り（スキンケア目当て）','sub',.28]],sx:[[0,'drop'],[2,'aww']],pz:[0,4]}
]},
{id:'m03',cat:'makeup',by:'pooh',song:'makeup',seed:403,bpm:124,likes:144000,cm:5101,
 cap:['Glow-up challenge ✨ before money vs after money #glowup #transition','グロウアップチャレンジ✨ お金の前とあと'],
 snd:['Glow Up Bounce','グロウアップ・バウンス'],
 com:[['pinco','the beat drop!!!','ビートの落ち方！！！'],['asmon','money is the best skincare','お金は最高のスキンケア']],
 shots:[
 {d:6,bg:'bedtime',cam:[1.05,1.15,.5,.5,.55,.5],a:[['pooh_parent_1',.5,.86,.5,'sway']],fx:[['bgtint',0,6,{c:'#0d0a30',a:.3}]],tx:[[0,6,'before money:','お金の前：','pill',.17]],sx:[[0,'yawn'],[4,'riser']]},
 {d:10,bg:'promenade',tr:'wipe',a:[['c_pooh_1',.5,.86,.52,'hop']],fx:[['rays',0,10,{x:.5,y:.5}],['money',0,10,{n:24}],['sparkle',0,10,{x:.5,y:.55,r:.3,n:16}]],tx:[[0,10,'after money:','お金のあと：','pill',.17],[2,10,'✨ GLOW UP ✨','✨ グロウアップ ✨','big',.25,{c:'#ffd84a'}]],sx:[[0,'drop'],[2,'cash']],pz:[0,1,2,3,4,6,8]}
]},
{id:'m04',cat:'makeup',by:'bean',song:'comedy',seed:404,bpm:126,likes:121000,cm:4200,
 cap:["Lipstick tutorial (no arms edition) 💄 slay? #makeupfail #noarms",'リップ講座（腕なし版）💄 盛れてる？'],
 snd:['Smudge Polka','はみだしポルカ'],
 com:[['pinco','it’s giving… everywhere','…全体的に塗れてる'],['prof','The lipstick has achieved full coverage','口紅が全面カバーを達成']],
 shots:[
 {d:4,bg:'vanity',a:[['c_bean_1',.5,.88,.44,'bob']],tx:[[0,4,'lipstick tutorial 💄','リップ講座 💄','big',.17],[1,4,'(no arms edition)','（腕なし版）','pillk',.26]],sx:[[0,'pop']]},
 {d:6,bg:'vanity',tr:'whip',cam:[1.2,1.3,.5,.5,.5,.5],a:[['c_bean_0',.5,.88,.44,'shake'],['p_lipstick',.72,.5,.12,'wiggle',{mv:[.55,.48],mvd:1.5,sh:0}]],fx:[['smear',2,6,{x:.5,y:.6}]],tx:[[0,6,'step 1: hold the lipstick','ステップ1：リップを持つ','pill',.17],[2,6,'step 1 (revised): wiggle at it','ステップ1（修正）：くねくねする','pill',.24]],sx:[[2,'swish'],[2.5,'swish'],[3,'swish'],[3.5,'swish']]},
 {d:6,bg:'vanity',tr:'flash',a:[['c_bean_5',.5,.88,.44,'bob']],fx:[['smear',0,6,{x:.5,y:.62}],['sparkle',0,6,{x:.5,y:.6,r:.25}]],tx:[[0,6,'slay? 💅','盛れてる？💅','big',.17],[2,6,'(it is everywhere)','（全体的についた）','sub',.32]],sx:[[0,'chime'],[2,'laugh']]}
]},
{id:'m05',cat:'makeup',by:'pinco',song:'sweet',seed:405,bpm:108,likes:176000,cm:6600,
 cap:['GRWM for date night with… Pooh?? 💕 he brought gold coins instead of flowers #grwm #datenight','デートの準備GRWM…相手はプー？？💕 花のかわりに金貨'],
 snd:['Promenade Date','プロムナード・デート'],
 com:[['pooh','the coins were the flowers 🌹','金貨が花束だよ🌹'],['party','WEDDING WHEN','結婚式いつ！？']],
 shots:[
 {d:5,bg:'vanity',a:[['pinco_comedy_2',.5,.9,.52,'talk']],fx:[['rec',0,5]],tx:[[0,5,'GRWM for date night 💕','デートの準備 GRWM 💕','big',.17],[2,5,'with… Pooh??','相手は…プー？？','pill',.31]],sx:[[0,'pop'],[2,'boing']]},
 {d:4,bg:'vanity',blur:1,tr:'whip',a:[['p_palette',.32,.6,.15,'float',{in:'pop',sh:0}],['p_perfume',.68,.62,.14,'float',{in:'pop',sh:0,t:[1,4]}]],fx:[['mist',1.5,4,{x:.64,y:.5,a:-2.4}]],tx:[[0,4,'eyeshadow ✔︎','アイシャドウ ✔︎','tag',.42,{x:.32}],[1,4,'perfume ✔︎','香水 ✔︎','tag',.42,{x:.68}]],sx:[[0,'pop'],[1,'pop'],[1.5,'spray']]},
 {d:4,bg:'vanity',tr:'wipe',a:[['pinco_makeup_2',.5,.92,.55,'bob']],fx:[['sparkle',0,4,{x:.5,y:.45,r:.25,n:14}]],tx:[[0,4,'ready ✨','準備OK ✨','big',.17]],sx:[[0,'sparkle']]},
 {d:8,bg:'promenade',tr:'zoom',a:[['c_pinco_5',.33,.86,.46,'bob'],['c_pooh_5',.7,.86,.44,'bob']],fx:[['coins',1,3,{x:.7,y:.5,n:12}],['hearts',2,8,{x:.5,y:.5,n:14}]],tx:[[0,8,'he brought gold coins instead of flowers','花のかわりに金貨をくれた','pill',.17],[3,8,'10/10 date 🥹','満点デート 🥹','big',.27,{c:'#ff8fc4'}]],sx:[[1,'cash'],[3,'aww']]}
]},
{id:'m06',cat:'makeup',by:'prof',song:'food',seed:406,bpm:96,likes:52200,cm:1400,
 cap:['Science-approved makeup review 🧪 the nail polish failed the sniff test #beautyreview','科学的コスメレビュー🧪 マニキュアはにおいで不合格'],
 snd:['Beaker Beat','ビーカー・ビート'],
 com:[['pinco','finally a reliable source','やっと信頼できる情報源'],['bean','can you review me','ぼくもレビューして']],
 shots:[
 {d:4,bg:'#e1f6ff/#ffe6f3',a:[['c_prof_0',.5,.86,.46,'talk']],tx:[[0,4,'science-approved makeup review 🧪','科学的コスメレビュー 🧪','big',.17]],sx:[[0,'chime']]},
 {d:4,bg:'#e1f6ff/#ffe6f3',tr:'whip',a:[['p_perfume',.32,.6,.16,'float',{in:'pop',sh:0}],['c_prof_1',.72,.86,.4,'nod']],fx:[['check',1,4,{x:.32,y:.34}],['mist',.5,2,{x:.3,y:.48,a:-2}]],tx:[[0,4,'perfume: smells like science','香水：科学のにおい','pill',.17]],sx:[[.5,'spray'],[1,'ding']]},
 {d:4,bg:'#e1f6ff/#ffe6f3',tr:'whip',a:[['p_polish',.32,.62,.15,'tremble',{in:'pop',sh:0}],['c_prof_2',.72,.86,.4,'shake']],fx:[['cross',1,4,{x:.32,y:.36}]],tx:[[0,4,'nail polish: failed the sniff test','マニキュア：においで不合格','pill',.17]],sx:[[1,'buzz']]},
 {d:5,bg:'#e1f6ff/#ffe6f3',tr:'whip',a:[['p_palette',.32,.62,.16,'pulse',{in:'pop',sh:0}],['c_prof_1',.72,.86,.4,'hop']],fx:[['check',1,5,{x:.32,y:.38}],['stars5',1.5,5,{x:.5,y:.26,n:5}],['shine',0,3]],tx:[[0,5,'palette: refracts light beautifully','パレット：光の屈折が美しい','pill',.17]],sx:[[1,'ding'],[1.5,'chime']]}
]},
{id:'m07',cat:'makeup',by:'bronny',song:'makeup',seed:407,bpm:118,likes:97400,cm:3100,
 cap:['My pre-game skincare routine 🧴🏀 step 3 is the most important #skincare','試合前のスキンケア🧴🏀 ステップ3が最重要'],
 snd:['Court Glow','コート・グロウ'],
 com:[['pinco','"that’s a 9" LMAOOO','「9点だな」で草'],['asmon','I respect the routine','そのルーティン、尊敬する']],
 shots:[
 {d:4,bg:'vanity',a:[['c_bronny_3',.5,.88,.52,'bob']],tx:[[0,4,'my pre-game skincare routine 🧴','試合前のスキンケア 🧴','big',.17]],sx:[[0,'pop']]},
 {d:4,bg:'vanity',blur:1,tr:'whip',a:[['p_smoothie',.32,.62,.18,'float',{in:'pop',sh:0}],['bronny_comedy_2',.7,.88,.5,'idle']],tx:[[0,4,'step 1: hydrate (ugh)','ステップ1：水分補給（うぇ）','pill',.17]],sx:[[0,'pop'],[1.5,'gulp']]},
 {d:4,bg:'vanity',blur:1,tr:'whip',a:[['p_brush',.3,.6,.18,'wiggle',{in:'pop',sh:0}],['c_bronny_0',.7,.88,.5,'bob']],fx:[['sparkle',1,4,{x:.7,y:.45}]],tx:[[0,4,'step 2: glow','ステップ2：ツヤ','pill',.17]],sx:[[1,'swish'],[1.5,'sparkle']]},
 {d:6,bg:'vanity',tr:'whip',a:[['p_mirror',.28,.6,.22,'idle',{in:'pop',sh:0}],['bronny_comedy_2',.7,.88,.5,'nod']],tx:[[0,6,'step 3: look in the mirror and say','ステップ3：鏡を見てひとこと','pill',.17],[2,6,"\"that's a 9\"",'「9点だな」','bub',.36,{x:.66,tx:.7,ty:.46,who:'bronny'}]],sx:[[2,'ding'],[3,'laugh']]}
]},
{id:'m08',cat:'makeup',by:'pinco',song:'parent',seed:408,bpm:92,likes:74400,cm:1900,
 cap:['Nail art for paws 💅 rainbow set with tiny gems #nailart #asmr','肉球ネイル💅 レインボーにちいさなストーン'],
 snd:['Polish Pop','ポリッシュ・ポップ'],
 com:[['party','RAINBOW 🌈🌈','レインボー🌈🌈'],['mogu','can you do claws','爪にもできる？']],
 shots:[
 {d:4,bg:'vanity',a:[['c_pinco_5',.5,.9,.52,'bob']],tx:[[0,4,'nail art for paws 💅','肉球ネイル 💅','big',.17]],sx:[[0,'pop']]},
 {d:8,bg:'#ffe4ef/#ffd0e4',tr:'whip',cam:[1,1.06,.5,.5,.5,.5],a:[['p_polish',.82,.36,.14,'wiggle',{sh:0}]],fx:[['nails',0,8,{x:.47,y:.52,gems:1}],['sparkle',5,8,{x:.47,y:.58,r:.3,n:14}]],tx:[[0,8,'rainbow set 🌈','レインボーネイル 🌈','pill',.17]],sx:[[0,'swish'],[1.5,'swish'],[3,'swish'],[4.5,'swish'],[6,'swish'],[6.5,'sparkle']]},
 {d:5,bg:'vanity',tr:'wipe',a:[['pinco_makeup_2',.5,.92,.55,'bob']],fx:[['sparkle',0,5,{x:.5,y:.5,r:.3,n:16}]],tx:[[0,5,'+ tiny gems ✨','＋ちいさなストーン ✨','big',.17]],sx:[[0,'chime']]}
]},
{id:'m09',cat:'makeup',by:'party',song:'makeup',seed:409,bpm:120,likes:210000,cm:9900,
 cap:['Everyone did the glam transition challenge ✨ who did it best? #transitionchallenge','みんなでグラム・トランジション✨ いちばんは誰？'],
 snd:['Snap Glam (original)','スナップ・グラム（オリジナル）'],
 com:[['bean','me obviously 😉','もちろんぼく😉'],['mogu','the sunglasses ate','サングラス優勝']],
 shots:[
 {d:4,bg:'#2a0f3d/#ff4f9a',a:[['c_party_0',.5,.86,.5,'bob']],fx:[['sparkle',0,4,{x:.5,y:.5,r:.35}]],tx:[[0,4,'glam transition challenge ✨','グラム・トランジション ✨','big',.17]],sx:[[2,'riser']]},
 {d:2,bg:'vanity',tr:'flash',a:[['pinco_makeup_2',.5,.92,.56,'pulse']],fx:[['sparkle',0,2,{x:.5,y:.45,r:.25}]],tx:[[0,2,'Pinco','ピンコ','tag',.2]],sx:[[0,'drop']]},
 {d:2,bg:'lair',tr:'flash',a:[['asmon_makeup_2',.5,.94,.6,'pulse']],fx:[['sparkle',0,2,{x:.5,y:.4,r:.25}]],tx:[[0,2,'Asmon','アスモン','tag',.2]],sx:[[0,'drop']]},
 {d:2,bg:'#ffe08a/#ff9fc2',tr:'flash',a:[['c_bean_5',.5,.86,.5,'pulse']],tx:[[0,2,'Mr Bean','ミスター・ビーン','tag',.2]],sx:[[0,'drop']]},
 {d:2,bg:'promenade',tr:'flash',a:[['c_pooh_5',.5,.86,.5,'pulse']],fx:[['coins',0,2,{x:.5,y:.5}]],tx:[[0,2,'Pooh','プー','tag',.2]],sx:[[0,'drop']]},
 {d:2,bg:'park',tr:'flash',a:[['c_mogu_2',.5,.86,.46,'pulse']],tx:[[0,2,'Mogu','モグ','tag',.2]],sx:[[0,'drop']]},
 {d:2,bg:'boardwalk',tr:'flash',a:[['c_bronny_5',.5,.86,.52,'pulse']],tx:[[0,2,'Bronny','ブロニー','tag',.2]],sx:[[0,'drop']]},
 {d:6,bg:'#2a0f3d/#ff4f9a',tr:'zoom',a:[['c_party_5',.5,.86,.52,'dance']],fx:[['confetti',0,6,{n:80}],['rays',0,6,{x:.5,y:.55}]],tx:[[0,6,'who did it best? 👇','いちばんは誰？👇','big',.17]],sx:[[0,'cheer']]}
]},
{id:'m10',cat:'makeup',by:'party',song:'sweet',seed:410,bpm:104,likes:63300,cm:1720,
 cap:['Rainbow eyeshadow on a polka-dot face 🌈 bold? yes. #eyeshadow #colorful','水玉の顔にレインボーアイシャドウ🌈 大胆？もちろん'],
 snd:['Polka Dot Pop','ポルカドット・ポップ'],
 com:[['pinco','teach me this blend','このグラデーション教えて'],['asmon','…acceptable.','…悪くない。']],
 shots:[
 {d:4,bg:'vanity',a:[['c_party_0',.5,.9,.52,'bob']],tx:[[0,4,'rainbow eyeshadow 🌈','レインボーアイシャドウ 🌈','big',.17],[1,4,'on a polka-dot face','水玉の顔に','pill',.31]],sx:[[0,'pop']]},
 {d:6,bg:'vanity',blur:1,tr:'whip',cam:[1.05,1.15,.5,.5,.55,.55],a:[['p_palette',.5,.62,.22,'pulse',{in:'pop',sh:0}],['p_brush',.76,.5,.18,'wiggle',{in:'pop',sh:0,t:[1,6]}]],fx:[['shine',0,3],['sparkle',2,6,{x:.5,y:.55,r:.15}]],tx:[[0,6,'every color. yes, every.','全色。そう、全色。','pill',.17]],sx:[[1,'swish'],[2,'swish'],[3,'swish']]},
 {d:6,bg:'#ff9fc2/#7fd8ff',tr:'wipe',a:[['c_party_1',.5,.88,.54,'dance']],fx:[['confetti',0,6,{n:60}],['sparkle',0,6,{x:.5,y:.45,r:.3}]],tx:[[0,6,'bold? yes. 🌈','大胆？もちろん 🌈','big',.17]],sx:[[0,'drop'],[1,'cheer']]}
]}
);
