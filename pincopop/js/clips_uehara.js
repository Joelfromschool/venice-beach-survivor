'use strict';
// FOOD: Yoyogi Uehara (代々木上原) café & restaurant reviews (times in beats).
// Real places, checked Nov 2026 (official sites, Time Out Tokyo, Tabelog, local guides). Only verified facts are stated;
// no prices, ratings or quotes. Character reactions are clearly playful opinions. All storefront/food art is original.
window.CLIPS=window.CLIPS||[];
function UH(name){return [.6,99,'📍 '+name[0]+' · Yoyogi Uehara','📍 '+name[1]+'・代々木上原','pillk',.32,{w:.94}]}
const UOP=['(playful opinion — go taste for yourself!)','（個人の感想です。ぜひ自分の舌で！）'];
CLIPS.push(
{id:'u01',cat:'food',by:'pooh',song:'sweet',seed:901,bpm:100,likes:68400,cm:1900,
 cap:['Hidden donut house in Yoyogi Uehara 🍩 fluffy fermented-dough donuts. 📍 Haritts · Yoyogi Uehara #tokyocafe #donuts','代々木上原の隠れ家ドーナツ🍩 発酵生地でふんわり。📍 ハリッツ・代々木上原 #代々木上原カフェ #ドーナツ'],
 snd:['Fluffy Lane','ふわふわ路地'],
 com:[['bean','arrived early. worth it. 🫛','早めに着いた。正解。🫛'],['pinco','the house is so cute 🏠💕','お店の建物がかわいすぎる🏠💕']],
 shots:[
 {d:5,bg:'u_donut',a:[['c_pooh_3',.5,.88,.42,'hop',{in:'pop'}]],tx:[[0,5,'Hidden donut house 🍩','隠れ家ドーナツ 🍩','big',.17],UH(['Haritts','ハリッツ'])],sx:[[0,'pop'],[.6,'ding']]},
 {d:7,bg:'u_donut',blur:1,tr:'whip',a:[['p_sdonut',.33,.66,.2,'float',{in:'pop',sh:0}],['p_donutc',.68,.68,.2,'float',{in:'pop',sh:0,t:[1,7]}]],fx:[['sparkle',.5,7,{x:.5,y:.6,r:.25}]],tx:[[0,7,'fermented dough = fluffy + chewy','発酵生地で、ふんわりもっちり','pill',.2],[1.8,7,'tucked inside a renovated Japanese house on a quiet lane','静かな路地の、古い家を改装したお店','tag',.33]],sx:[[0,'pop'],[1,'pop'],[1.8,'ding']]},
 {d:7,bg:'u_donut',tr:'cut',a:[['c_bean_3',.5,.88,.4,'shake']],tx:[[0,7,'popular flavors can sell out — go early!','人気の味は売り切れることも。早めがおすすめ','pill',.2],[2,7,'running there now (no arms, full speed)','いま向かってる（腕なし全速力）','bub',.36,{x:.5,tx:.5,ty:.5,who:'bean'}]],sx:[[0,'tick'],[2,'whoosh']]},
 {d:6,bg:'u_donut',tr:'zoom',a:[['c_pooh_5',.5,.88,.44,'dance']],fx:[['hearts',0,6,{x:.5,y:.5,n:8}]],tx:[[0,6,'Pooh’s verdict: one happy spin 🍩💛','プーの感想：うれしくて一回転 🍩💛','bub',.3,{x:.5,tx:.5,ty:.48,who:'pooh'}],[1.5,6,UOP[0],UOP[1],'tag',.45]],sx:[[0,'cheer']]}
]},
{id:'u02',cat:'food',by:'bronny',song:'food',seed:902,bpm:96,likes:57300,cm:1400,
 cap:['London-style pie & mash in Tokyo 🥧 meat pie, mash, parsley sauce. 📍 dish · Yoyogi Uehara #tokyofood #pieandmash','東京でロンドン伝統のパイ＆マッシュ🥧 📍 dish（ディッシュ）・代々木上原 #代々木上原ランチ'],
 snd:['Pie-Game Warmup','パイ前ウォームアップ'],
 com:[['pooh','the parsley sauce looks so good','パセリソースがおいしそう'],['asmon','A villain respects a good pie.','悪役も、いいパイには敬意を払う。']],
 shots:[
 {d:5,bg:'u_pie',a:[['c_bronny_0',.5,.88,.48,'bob',{in:'pop'}]],tx:[[0,5,'London pie in Tokyo?! 🥧','ロンドンのパイ、東京で 🥧','big',.17],UH(['dish','dish（ディッシュ）'])],sx:[[0,'pop'],[.6,'ding']]},
 {d:7,bg:'u_pie',blur:1,tr:'whip',a:[['p_pie',.5,.68,.3,'pulse',{in:'drop',sh:0}]],fx:[['steam',.5,7,{x:.5,y:.5}]],tx:[[0,7,'British-style pie & mash','イギリス伝統のパイ＆マッシュ','pill',.2],[1.8,7,'meat pie + mashed potatoes + green parsley sauce','ミートパイ＋マッシュポテト＋パセリソース','tag',.32]],sx:[[0,'thud'],[1.8,'ding']]},
 {d:7,bg:'u_pie',tr:'cut',a:[['c_bronny_1',.5,.9,.34,'hop']],tx:[[0,7,'café by day — wine & tapas too 🍷','昼はカフェ、ワインやタパスも 🍷','pill',.2],[1.8,7,'upstairs, about a minute from the station','駅から約1分、2階のお店','tag',.32]],sx:[[0,'pop'],[1.8,'ding']]},
 {d:6,bg:'u_pie',tr:'zoom',a:[['c_bronny_5',.5,.88,.46,'bob']],fx:[['sparkle',0,6,{x:.5,y:.5,r:.25}]],tx:[[0,6,'pre-game meal? pie-game meal 🏀🥧','試合前メシ、パイで決まり 🏀🥧','bub',.3,{x:.5,tx:.5,ty:.48,who:'bronny'}],[1.5,6,UOP[0],UOP[1],'tag',.45]],sx:[[0,'cheer']]}
]},
{id:'u03',cat:'food',by:'pinco',song:'sweet',seed:903,bpm:98,likes:61900,cm:1600,
 cap:['Retro café with Indonesian plates 🍳 nasi goreng, mie goreng, vintage glassware. 📍 Fireking Cafe · Yoyogi Uehara #tokyocafe','レトロなカフェでインドネシアごはん🍳 📍 ファイヤーキングカフェ・代々木上原 #代々木上原カフェ'],
 snd:['Jade Mug Bossa','ジェイドマグ・ボサ'],
 com:[['asmon','I would like one of every mug.','マグを全部ひとつずつください。'],['mogu','nasi goreng from underground: approved','地下からナシゴレン承認']],
 shots:[
 {d:5,bg:'u_retro',a:[['c_pinco_0',.5,.88,.48,'bob',{in:'pop'}]],tx:[[0,5,'Retro café, Indonesian plates 🍳','レトロカフェでナシゴレン 🍳','big',.17],UH(['Fireking Cafe','ファイヤーキングカフェ'])],sx:[[0,'pop'],[.6,'ding']]},
 {d:7,bg:'u_retro',blur:1,tr:'whip',a:[['p_nasi',.33,.66,.24,'float',{in:'pop',sh:0}],['p_miegoreng',.68,.68,.24,'float',{in:'pop',sh:0,t:[1,7]}]],fx:[['steam',.5,7,{x:.5,y:.5}]],tx:[[0,7,'nasi goreng & mie goreng','ナシゴレン＆ミーゴレン','pill',.2],[1.8,7,'Indonesian & Thai dishes','インドネシア＆タイ料理','tag',.32]],sx:[[0,'sizzle',2],[1,'pop']]},
 {d:7,bg:'u_retro',tr:'cut',a:[['c_pinco_5',.5,.9,.34,'nod']],tx:[[0,7,'shelves of vintage Fire-King glassware 💚','ヴィンテージのファイヤーキング食器がずらり 💚','pill',.2],[1.8,7,'and a gallery wall with changing shows','壁はギャラリー、展示も入れかわる','tag',.33]],sx:[[0,'sparkle'],[1.8,'ding']]},
 {d:6,bg:'u_retro',tr:'zoom',a:[['c_asmon_2',.32,.88,.4,'bob'],['c_pinco_1',.72,.88,.42,'hop']],fx:[['hearts',1,6,{x:.5,y:.5,n:6}]],tx:[[0,6,'came for the noodles, stayed for the mugs','麺目当てで来たのに、マグに心を奪われた','bub',.28,{x:.4,tx:.32,ty:.46,who:'asmon'}],[1.5,6,UOP[0],UOP[1],'tag',.45]],sx:[[0,'slurp'],[1.5,'giggle']]}
]},
{id:'u04',cat:'food',by:'party',song:'sweet',seed:904,bpm:100,likes:83100,cm:2500,
 cap:['A brand-new parfait every month 🍨 with a diagram of every layer. 📍 Bien-Être · Yoyogi Uehara #parfait #tokyosweets','毎月かわる季節のパフェ🍨 層ごとの解説図つき。📍 ビヤンネートル・代々木上原 #パフェ #代々木上原'],
 snd:['Layer by Layer','ひと層ずつ'],
 com:[['prof','Dessert with documentation. My favorite genre.','解説図つきデザート。好きなジャンルです。'],['pinco','booking next month already 📅','もう来月の予約した📅']],
 shots:[
 {d:5,bg:'u_patis',a:[['c_party_1',.5,.88,.46,'dance',{in:'pop'}]],tx:[[0,5,'A new parfait every month 🍨','毎月かわるパフェ 🍨','big',.17],UH(['Bien-Être','ビヤンネートル'])],sx:[[0,'pop'],[.6,'ding']]},
 {d:7,bg:'u_patis',blur:1,tr:'whip',a:[['p_parfait',.5,.72,.32,'pulse',{in:'drop',sh:0}]],fx:[['sparkle',.5,7,{x:.5,y:.55,r:.22}]],tx:[[0,7,'seasonal parfait, changes monthly','季節のパフェが毎月かわる','pill',.2],[1.8,7,'served with a diagram of every layer 📐','層ごとの解説図つき 📐','tag',.32]],sx:[[0,'chime'],[1.8,'ding']]},
 {d:7,bg:'u_patis',tr:'cut',a:[['c_prof_2',.5,.9,.34,'tremble']],tx:[[0,7,'a dessert with documentation. peer reviewed ✅','解説図つきのデザート。査読済み ✅','bub',.26,{x:.5,tx:.5,ty:.5,who:'prof'}],[2,7,'"bien-être" = "well-being" in French','店名はフランス語で「幸福感」','tag',.42]],sx:[[0,'pop'],[2,'ding']]},
 {d:6,bg:'u_patis',tr:'zoom',a:[['c_party_5',.5,.88,.46,'dance']],fx:[['confetti',0,6,{n:36}]],tx:[[0,6,'popular — booking ahead is recommended','人気なので予約がおすすめ','pill',.2],[1.5,6,'a parfait party every month?! 🎉','毎月パフェパーティー！？🎉','bub',.34,{x:.5,tx:.5,ty:.5,who:'party'}],[2.5,6,UOP[0],UOP[1],'tag',.47]],sx:[[0,'pop'],[1.5,'cheer']]}
]},
{id:'u05',cat:'food',by:'mogu',song:'food',seed:905,bpm:98,likes:49600,cm:1100,
 cap:['Paris vibes a minute from the station 🥖 boulangerie & café. 📍 Main Mano · Yoyogi Uehara #bakery #tokyobakery','駅1分でパリ気分🥖 ブーランジェリー＆カフェ。📍 マンマーノ・代々木上原 #パン屋 #代々木上原'],
 snd:['Croissant Tunnel','クロワッサン・トンネル'],
 com:[['max','the terrace looks perfect for dogs 🐶','テラスが犬にもよさそう🐶'],['pooh','I would carry 12 baguettes','バゲット12本持てる']],
 shots:[
 {d:5,bg:'u_bakery',a:[['c_mogu_1',.5,.88,0.357,'hop',{in:'pop'}]],tx:[[0,5,'Paris vibes, 1 min from the station 🥖','駅1分でパリ気分 🥖','big',.17],UH(['Main Mano','マンマーノ'])],sx:[[0,'pop'],[.6,'ding']]},
 {d:7,bg:'u_bakery',blur:1,tr:'whip',a:[['p_baguette',.5,.7,.26,'float',{in:'pop',sh:0}]],fx:[['sparkle',.5,7,{x:.5,y:.58,r:.22}]],tx:[[0,7,'boulangerie & café','ブーランジェリー＆カフェ','pill',.2],[1.8,7,'Paris-inspired storefront and breads','パリをイメージした外観とパン','tag',.32]],sx:[[0,'pop'],[1.8,'ding']]},
 {d:7,bg:'u_bakery',tr:'cut',a:[['c_mogu_5',.5,.9,0.272,'bob']],tx:[[0,7,'a few terrace seats outside ☀️','外にはテラス席も ☀️','pill',.2],[1.8,7,'closed Tue & Wed — check before you go','火・水は定休。行く前にチェック','tag',.32]],sx:[[0,'pop'],[1.8,'tick']]},
 {d:6,bg:'u_bakery',tr:'zoom',a:[['c_mogu_4',.5,.88,0.357,'bob']],fx:[['hearts',0,6,{x:.5,y:.5,n:8}]],tx:[[0,6,'I dug a tunnel straight to the croissants 🥐','クロワッサンまでトンネル掘った 🥐','bub',.3,{x:.5,tx:.5,ty:.5,who:'mogu'}],[1.5,6,UOP[0],UOP[1],'tag',.45]],sx:[[0,'cheer']]}
]},
{id:'u06',cat:'food',by:'max',song:'sweet',seed:906,bpm:96,likes:54800,cm:1300,
 cap:['The "Paris breakfast" morning set ☀️🥐 breads, butter, jam, a drink. 📍 Katane Bakery · Yoyogi Uehara #breakfast #tokyobakery','「パリの朝食」モーニング☀️🥐 📍 カタネベーカリー・代々木上原 #モーニング #代々木上原'],
 snd:['Morning Walk Waltz','朝さんぽワルツ'],
 com:[['pooping','dad-approved breakfast 👍','パパ公認の朝ごはん👍'],['bean','I would like the jam. Just the jam.','ジャムだけください。']],
 shots:[
 {d:5,bg:'u_morning',a:[['c_max_1',.5,.88,.42,'hop',{in:'pop'}]],tx:[[0,5,'The "Paris breakfast" ☀️🥐','「パリの朝食」☀️🥐','big',.17],UH(['Katane Bakery','カタネベーカリー'])],sx:[[0,'pop'],[.6,'ding']]},
 {d:7,bg:'u_morning',blur:1,tr:'whip',a:[['p_brekkie',.5,.7,.24,'pulse',{in:'drop',sh:0}]],tx:[[0,7,'morning set: breads, butter & jam','モーニング：パン、バター、ジャム','pill',.2],[1.8,7,'+ a drink and a little glass of juice','＋ドリンクと小さなジュース','tag',.32]],sx:[[0,'thud'],[1.8,'ding']]},
 {d:7,bg:'u_morning',tr:'cut',a:[['c_max_0',.5,.9,.32,'bob']],tx:[[0,7,'the café is downstairs from the bakery','カフェはベーカリーの地下','pill',.2],[1.8,7,'a short walk from the station','駅から少し歩きます','tag',.32]],sx:[[0,'pop'],[1.8,'ding']]},
 {d:6,bg:'u_morning',tr:'zoom',a:[['c_max_5',.32,.88,.4,'hop'],['c_pooping_1',.72,.88,.4,'bob']],fx:[['sparkle',0,6,{x:.5,y:.5,r:.25}]],tx:[[0,6,'morning walk → bakery. best walk ever 🐶','朝の散歩→パン屋さん。最高の散歩 🐶','bub',.28,{x:.4,tx:.32,ty:.5,who:'max'}],[1.5,6,UOP[0],UOP[1],'tag',.45]],sx:[[0,'cheer']]}
]},
{id:'u07',cat:'food',by:'pooping',song:'food',seed:907,bpm:96,likes:72600,cm:2000,
 cap:['Sanuki udon, done right 🍜 big chicken tempura and iriko dashi. 📍 Sanuki Udon Genki · Yoyogi Uehara #udon #tokyofood','本格さぬきうどん🍜 大きなかしわ天といりこ出汁。📍 讃岐饂飩 元喜・代々木上原 #うどん #代々木上原ランチ'],
 snd:['Dashi Steam Ballad','出汁の湯気バラード'],
 com:[['bronny','the kashiwa-ten size 😳','かしわ天のサイズ😳'],['pooh','udon > pancakes (today only)','うどん＞パンケーキ（今日だけ）']],
 shots:[
 {d:5,bg:'u_udon',a:[['c_pooping_2',.5,.88,.42,'bob',{in:'pop'}]],tx:[[0,5,'Sanuki udon, done right 🍜','本格さぬきうどん 🍜','big',.17],UH(['Sanuki Udon Genki','讃岐饂飩 元喜'])],sx:[[0,'pop'],[.6,'ding']]},
 {d:7,bg:'u_udon',blur:1,tr:'whip',a:[['p_udon',.5,.7,.28,'float',{in:'pop',sh:0}]],fx:[['steam',0,7,{x:.5,y:.5}]],tx:[[0,7,'noodles made with 100% Japanese wheat','国産小麦100％のうどん','pill',.2],[1.8,7,'dashi with iriko (dried sardines) 🐟','いりこが香る出汁 🐟','tag',.32]],sx:[[0,'slurp'],[1.8,'ding']]},
 {d:7,bg:'u_udon',tr:'cut',a:[['c_pooping_5',.5,.9,.32,'nod']],tx:[[0,7,'known for big kashiwa-ten (chicken tempura)','名物：大きなかしわ天（鶏天）','pill',.2],[1.8,7,'"Genki-mori": shrimp, chicken & chikuwa tempura','「元喜盛」はえび天・かしわ天・ちくわ天つき','tag',.33]],sx:[[0,'sizzle',2],[1.8,'ding']]},
 {d:6,bg:'u_udon',tr:'zoom',a:[['c_pooping_3',.5,.88,.42,'tremble']],fx:[['steam',0,6,{x:.5,y:.6}]],tx:[[0,6,'I’m not crying, it’s the dashi steam 🥲','泣いてない、出汁の湯気だよ 🥲','bub',.28,{x:.5,tx:.5,ty:.5,who:'pooping'}],[1.5,6,'moved here from Sengoku in 2021','2021年に千石から移転','tag',.42],[2.5,6,UOP[0],UOP[1],'tag',.5]],sx:[[0,'aww']]}
]},
{id:'u08',cat:'food',by:'bean',song:'sweet',seed:908,bpm:98,likes:66300,cm:1800,
 cap:['A whole shop of gâteau au chocolat 🍫 tasting flights + coffee pairings. 📍 Minimal The Baking · Yoyogi Uehara #chocolate #tokyocafe','ガトーショコラ専門店🍫 食べ比べ＆コーヒーペアリング。📍 ミニマル ザ ベイキング・代々木上原 #ガトーショコラ'],
 snd:['Bean to Bar to Bean','ビーン・トゥ・バー・トゥ・ビーン'],
 com:[['prof','Pairing chocolate with coffee: scientifically delightful.','チョコとコーヒーの組み合わせ：科学的に最高。'],['pinco','the tasting flight 😍','食べ比べ😍']],
 shots:[
 {d:5,bg:'u_choco',a:[['c_bean_1',.5,.88,.44,'bob',{in:'pop'}]],tx:[[0,5,'A whole shop of gâteau chocolat 🍫','ガトーショコラ専門店 🍫','big',.17],UH(['Minimal The Baking','ミニマル ザ ベイキング'])],sx:[[0,'pop'],[.6,'ding']]},
 {d:7,bg:'u_choco',blur:1,tr:'whip',a:[['p_flight',.5,.7,.24,'pulse',{in:'drop',sh:0}]],fx:[['sparkle',.5,7,{x:.5,y:.58,r:.22}]],tx:[[0,7,'gâteau chocolat tasting flight','ガトーショコラの食べ比べ','pill',.2],[1.8,7,'by bean-to-bar chocolate maker Minimal','Bean to Barチョコの「Minimal」が手がける','tag',.32]],sx:[[0,'thud'],[1.8,'ding']]},
 {d:7,bg:'u_choco',tr:'cut',a:[['p_mug',.32,.86,.14,'float',{sh:0}],['c_prof_1',.7,.9,.32,'nod']],fx:[['steam',0,7,{x:.32,y:.72}]],tx:[[0,7,'the barista suggests a coffee to pair ☕','バリスタが合うコーヒーを提案 ☕','pill',.2],[1.8,7,'small shop, no seat reservations','席は少なめ、予約不可','tag',.32]],sx:[[0,'pop'],[1.8,'ding']]},
 {d:6,bg:'u_choco',tr:'zoom',a:[['c_bean_5',.5,.88,.44,'dance']],fx:[['hearts',0,6,{x:.5,y:.5,n:8}]],tx:[[0,6,'a bean reviewing bean-to-bar. full circle 🫛🍫','豆がBean to Barをレビュー。運命 🫛🍫','bub',.28,{x:.5,tx:.5,ty:.5,who:'bean'}],[1.5,6,UOP[0],UOP[1],'tag',.45]],sx:[[0,'cheer']]}
]}
);
