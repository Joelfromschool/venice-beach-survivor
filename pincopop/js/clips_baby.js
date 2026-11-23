'use strict';
// v1.3.2 BABY BEAN + PARENTING pack. Baby Bean = pea-pod baby in a cream bonnet, no arms/legs (art babies_1, bbean_0..2).
// bb:1 marks Baby Bean clips (boosted in For You). Tokyo facts reuse the 2026 checks from clips_tokyo/clips_local (note:1).
window.CLIPS=window.CLIPS||[];
const BBG='#fff3f8/#e8f4ff',BBN='#1a1440/#3a2a6a';
CLIPS.push(
// bb01 night vlog: first Christmas lights (Keyakizaka)
{id:'bb01',cat:'parent',also:['tokyo'],bb:1,by:'pooping',song:'xmas',seed:4101,bpm:96,likes:318000,cm:16400,look:'night',note:1,
 cap:['Baby Bean sees Christmas lights for the first time 💙🫛 Keyakizaka “SNOW & BLUE” #babybean #firstchristmas #roppongi','ベビービーン、はじめてのイルミネーション💙🫛 けやき坂「SNOW＆BLUE」 #ベビービーン #はじめてのクリスマス'],
 snd:['First Lights Lullaby','はじめての光の子守歌'],
 com:[['pinco','THE GASP 😭💙','その「わぁ」😭💙'],['pooh','I would also gasp','ぼくも「わぁ」ってなる'],['bean','that is my nephew. probably.','ぼくの甥っ子。たぶん。']],
 shots:[
 {d:5,bg:'x_keyaki',blur:1,a:[['c_pooping_1',.5,.9,.44,'bob']],fx:[['rec',0,5]],tx:[[0,5,'taking Baby Bean to see the lights 💙','ベビービーンとイルミネーションへ 💙','type',.2,{cps:14}]],sx:[[0,'type']]},
 {d:6,bg:'x_keyaki',tr:'zoom',cam:[1,1.15,.5,.5,.6,.6],a:[['bbean_0',.5,.82,.3,'idle',{in:'pop'}]],fx:[['bokeh',0,6],['snow',0,6,{n:30}]],tx:[[1,6,'…','…','big',.2]],sx:[[1,'aww']]},
 {d:6,bg:'x_keyaki',tr:'cut',cam:[1.4,1.5,.5,.5,.42,.42],a:[['bbean_0',.5,.82,.3,'pulse']],fx:[['sparkle',0,6,{x:.5,y:.45,r:.2}],['bokeh',0,6]],tx:[[0,6,'*the gasp*','＊「わぁ」＊','cap',.2]],sx:[[0,'sparkle'],[.5,'aww']]},
 {d:7,bg:'x_keyaki',tr:'whip',a:[['c_pooping_2',.32,.9,.42,'bob'],['bbean_1',.72,.86,.26,'hop']],fx:[['hearts',0,7,{n:10}]],tx:[[0,7,'📍 Roppongi Hills Keyakizaka · Nov 5–Dec 25 · 17:00–22:00','📍 六本木ヒルズ けやき坂・11/5〜12/25・17:00〜22:00','tag',.2]],sx:[[0,'bells']]}
]},
// bb02 reaction: Baby Bean & the scone (Beagle, Yoyogi-Uehara)
{id:'bb02',cat:'food',also:['parent','tokyo'],bb:1,by:'pooh',song:'sweet',seed:4102,bpm:100,likes:276000,cm:12100,note:1,
 cap:['Baby Bean vs. a scone 🥐🫛 (babysitting day at a kid-friendly café in Yoyogi-Uehara) #babybean #scones #yoyogiuehara','ベビービーン vs スコーン🥐🫛（代々木上原の子連れOKカフェでベビーシッター） #ベビービーン #スコーン'],
 snd:['Crumb Patrol','くずパトロール'],
 com:[['pooping','thank you for babysitting, Pooh','プー、シッターありがとう'],['pinco','the crumbs on the bonnet 😭','ボンネットにくず😭']],
 shots:[
 {d:5,bg:'cafe',a:[['pooh_parent_0',.33,.86,.42,'bob'],['bbean_1',.72,.86,.24,'hop',{in:'pop'}]],tx:[[0,5,'babysitting Baby Bean at a scone café 🥐','スコーンのカフェでベビービーンのシッター 🥐','big',.17]],sx:[[0,'pop']]},
 {d:6,bg:'cafe',tr:'cut',cam:[1.3,1.3,.5,.5,.62,.62],a:[['p_sconecream',.5,.7,.16,'float',{sh:0}]],fx:[['steam',0,6,{x:.5,y:.6}]],tx:[[0,6,'the scone: present ✓','スコーン：準備OK ✓','cap',.2]],sx:[[0,'ding']]},
 {d:6,bg:'cafe',tr:'cut',cam:[1.35,1.35,.5,.5,.55,.55],a:[['bbean_0',.5,.84,.3,'tremble'],['p_scone',.78,.82,.09,'idle',{sh:0}]],tx:[[0,6,'Baby Bean: *staring contest with a scone*','ベビービーン：＊スコーンとにらめっこ＊','cap',.2]],sx:[[0,'tick'],[2,'tick'],[4,'tick']]},
 {d:6,bg:'cafe',tr:'zoom',a:[['bbean_1',.5,.84,.3,'hop']],fx:[['confetti',0,6,{n:24}],['hearts',0,6,{n:8}]],tx:[[0,6,'verdict: the scone won (he got the crumbs)','結果：スコーンの勝ち（くずだけゲット）','cap',.2],[2.5,6,'parents: check what suits your baby’s age','保護者の方へ：月齢に合うものかご確認を','tag',.36]],sx:[[0,'cheer']]},
 {d:6,bg:'cafe',tr:'cut',a:[['pooh_parent_1',.5,.86,.44,'bob']],tx:[[0,6,'📍 Beagle (soup & scones) · Yoyogi-Uehara','📍 ビーグル（スープとスコーン）・代々木上原','loc',.2],[.8,6,'dogs & kids welcome · 10+ homemade scones','犬連れ・子連れ歓迎・自家製スコーン10種類以上','tag',.3]],sx:[[0,'ding']]}
]},
// bb03 storytime captions: stroller walk in Yoyogi Park
{id:'bb03',cat:'parent',also:['tokyo'],bb:1,by:'pooping',song:'lofi',seed:4103,bpm:80,likes:241000,cm:9800,note:1,
 cap:['stroller walk with Baby Bean in Yoyogi Park 🍂🫛 yellow ginkgo + the Forest Fountain #yoyogipark #babybean','ベビービーンと代々木公園をベビーカーさんぽ🍂🫛 イチョウと森の噴水 #代々木公園 #ベビービーン'],
 snd:['Ginkgo Stroll','イチョウさんぽ'],
 com:[['bean','I walked there too (no stroller, no arms)','ぼくも歩いた（ベビーカーなし、腕なし）'],['pinco','yellow everything 💛','ぜんぶ黄色💛']],
 shots:[
 {d:6,bg:'x_ginkgo',a:[['pooping_parent_0',.45,.9,.46,'bob',{mv:[.55,.9],mvd:6}]],tx:[[0,6,'stroller walk in Yoyogi Park 🍂','代々木公園をベビーカーでおさんぽ 🍂','cap',.2,{wps:3}]],sx:[[0,'chime']]},
 {d:7,bg:'x_ginkgo',tr:'cut',cam:[1.25,1.3,.5,.5,.6,.6],a:[['bbean_0',.5,.84,.3,'idle']],fx:[['snow',0,7,{n:20,c:'#ffd84a'}]],tx:[[0,7,'Baby Bean meets ginkgo leaves (they’re usually brightest late Nov – mid Dec)','ベビービーン、イチョウの葉っぱとご対面（見頃はだいたい11月下旬〜12月中旬）','cap',.2,{wps:3}]],sx:[[0,'aww']]},
 {d:7,bg:'x_yoyogi',tr:'whip',a:[['bbean_1',.5,.84,.28,'hop']],fx:[['sparkle',0,7,{x:.5,y:.4}]],tx:[[0,7,'the Forest Fountain reopened Nov 13 — light-up 17:00–21:00','森の噴水は11/13にリニューアル、ライトアップ17:00〜21:00','cap',.2,{wps:3}]],sx:[[0,'sparkle']]},
 {d:6,bg:'x_yoyogi',tr:'cut',a:[['pooping_parent_1',.35,.9,.42,'idle'],['bbean_2',.72,.84,.26,'bob']],fx:[['zzz',0,6,{x:.76,y:.5}]],tx:[[0,6,'…asleep before the music show 😴','…音楽ショーの前に寝た 😴','cap',.2,{wps:3}]],sx:[[0,'aww']]}
]},
// bb04 split screen: expectation vs reality holiday card
{id:'bb04',cat:'comedy',also:['parent'],bb:1,by:'pooping',song:'comedy',seed:4104,bpm:112,likes:226000,cm:8800,
 cap:['holiday card photoshoot: expectation vs reality 📸🫛 #babybean #holidaycard','年賀状・クリスマスカード撮影：理想と現実📸🫛 #ベビービーン'],
 snd:['Say Pea-se','はい、ピース'],
 com:[['pooh','reality is the better card','現実のほうがいいカード'],['asmon','the yawn is iconic','あくびが伝説']],
 shots:[
 {d:5,bg:'living',a:[['c_pooping_0',.5,.9,.44,'talk']],tx:[[0,5,'holiday card photoshoot 📸','カード用の写真撮影 📸','big',.17]],sx:[[0,'shutter']]},
 {d:10,bg:'#111/#222',dots:0,tr:'wipe',panes:[{r:[0,0,.5,1],bg:'x_gold',a:[['bbean_0',.5,.8,.34,'idle']],fx:[['sparkle',0,10]],tx:[[0,10,'EXPECTATION','理想','pill',.15]]},{r:[.5,0,.5,1],bg:'living',a:[['bbean_2',.5,.84,.34,'tremble']],tx:[[0,10,'REALITY','現実','pill',.15],[3,10,'*yawn*','＊あくび＊','tag',.3,{x:.4}]]}],sx:[[0,'shutter'],[3,'boing']]},
 {d:6,bg:'living',tr:'zoom',a:[['c_pooping_2',.32,.9,.42,'bob'],['bbean_1',.72,.86,.26,'hop']],fx:[['confetti',0,6,{n:30}]],tx:[[0,6,'we used the yawn one 💌','あくびの写真を採用 💌','big',.18]],sx:[[0,'cheer']]}
]},
// bb05 ASMR bedtime
{id:'bb05',cat:'parent',bb:1,by:'pooping',song:'asmr',seed:4105,bpm:64,likes:198000,cm:7100,look:'asmr',
 cap:['ASMR bedtime with Baby Bean 🌙🎧 bath → pajamas → song → sleep #babybean #bedtime #asmr','ベビービーンの寝かしつけASMR🌙🎧 お風呂→パジャマ→歌→ねんね #ベビービーン #寝かしつけ'],
 snd:['Pea-ceful Night','ぴーすふるナイト'],
 com:[['pinco','the routine is so calming','ルーティンが癒やし'],['prof','A steady routine helps many babies settle.','毎日同じ流れは寝つきに役立つことが多い。']],
 shots:[
 {d:5,bg:'bedtime',blur:1,a:[['bbean_1',.5,.84,.3,'bob']],fx:[['bgtint',0,5,{c:'#1a1440',a:.3}]],tx:[[0,5,'bedtime routine, whisper edition 🌙','寝かしつけルーティン（ささやき版）🌙','cap',.25]],sx:[[0,'chime']]},
 {d:6,bg:'bedtime',blur:1,tr:'cut',a:[['p_duck',.5,.7,.14,'float',{sh:0}]],fx:[['bubbles',0,6,{x:.5,y:.7}]],tx:[[0,6,'1. warm bath','①あったかいお風呂','cap',.25]],sx:[[.3,'pour']]},
 {d:6,bg:'bedtime',blur:1,tr:'cut',a:[['p_onesie',.5,.68,.16,'float',{sh:0}]],tx:[[0,6,'2. cozy pajamas','②ふわふわパジャマ','cap',.25]],sx:[[.3,'swish']]},
 {d:6,bg:'bedtime',blur:1,tr:'cut',a:[['bbean_2',.5,.84,.3,'idle']],fx:[['notes',0,6,{x:.6,y:.45}]],tx:[[0,6,'3. the same little song','③いつもの子守歌','cap',.25]],sx:[[.3,'chime']]},
 {d:6,bg:'bedtime',tr:'cut',a:[['bbean_2',.5,.84,.3,'idle']],fx:[['bgtint',0,6,{c:'#0d0a30',a:.45}],['zzz',0,6,{x:.62,y:.5}]],tx:[[0,6,'4. …zzz','④…すやすや','cap',.25]],sx:[[0,'aww']]}
]},
// bb06 typewriter vlog: day in the life of a pea-pod baby
{id:'bb06',cat:'parent',bb:1,by:'pooping',song:'lofi',seed:4106,bpm:88,likes:184000,cm:6400,
 cap:['day in the life of a pea-pod baby 🫛 (narrated by dad) #babybean #dayinthelife','さやえんどうベビーの1日🫛（パパのナレーション） #ベビービーン #ベビーの1日'],
 snd:['Tiny Schedule','ちいさなスケジュール'],
 com:[['pooh','09:00 nap again is so real','9時にまた昼寝、リアル'],['bronny','no arms, no legs, all vibes','腕なし脚なし、雰囲気だけ']],
 shots:[
 {d:5,bg:'nursery',a:[['bbean_1',.5,.84,.3,'hop']],fx:[['rec',0,5]],tx:[[0,5,'06:30 — awake. very awake.','06:30 起床。ばっちり起床。','type',.2,{cps:14}]],sx:[[0,'type']]},
 {d:5,bg:'kitchen',tr:'cut',a:[['bbean_0',.5,.84,.3,'idle'],['p_bottle',.75,.8,.1,'idle',{sh:0}]],fx:[['rec',0,5]],tx:[[0,5,'07:00 — breakfast. tiny sips.','07:00 朝ごはん。ちびちび。','type',.2,{cps:14}]],sx:[[0,'type']]},
 {d:5,bg:'nursery',tr:'cut',a:[['bbean_2',.5,.84,.3,'idle']],fx:[['rec',0,5],['zzz',0,5,{x:.6,y:.5}]],tx:[[0,5,'09:00 — nap #1','09:00 お昼寝その1','type',.2,{cps:14}]],sx:[[0,'type']]},
 {d:5,bg:'park',tr:'cut',a:[['pooping_parent_0',.5,.9,.46,'bob']],fx:[['rec',0,5]],tx:[[0,5,'11:00 — stroller adventure','11:00 ベビーカー大冒険','type',.2,{cps:14}]],sx:[[0,'type']]},
 {d:6,bg:'living',tr:'zoom',a:[['c_pooping_2',.32,.9,.42,'bob'],['bbean_1',.72,.86,.26,'hop']],fx:[['rec',0,6],['hearts',0,6,{n:8}]],tx:[[0,6,'15:00 — giggles. best part of the day.','15:00 にこにこタイム。1日でいちばん好きな時間。','type',.2,{cps:14}]],sx:[[0,'giggle']]}
]},
// bb07 anime: first word
{id:'bb07',cat:'comedy',also:['parent'],bb:1,by:'pooping',song:'anime',seed:4107,bpm:156,likes:263000,cm:13300,look:'anime',
 cap:['Baby Bean’s FIRST WORD (anime edition) 🫛✨ #babybean #firstword','ベビービーン、はじめての言葉（アニメ版）🫛✨ #ベビービーン #はじめての言葉'],
 snd:['FIRST WORD!! (opening)','はじめての言葉！！（OP）'],
 com:[['pooping','I was hoping for “dada”','「パパ」を期待してた'],['bean','correct word honestly','正しい言葉だと思う']],
 shots:[
 {d:8,bg:'living',a:[['c_pooping_1',.32,.9,.44,'bob'],['bbean_0',.72,.86,.28,'tremble']],fx:[['lines',0,8]],tx:[[0,8,'HE’S ABOUT TO TALK!!','しゃべりそう！！','manga',.18,{rot:-4}]],sx:[[0,'riser']]},
 {d:8,bg:'#ffd84a/#ff8a3d',dots:0,tr:'flash',a:[['bbean_1',.5,.84,.36,'pulse']],fx:[['rays',0,8],['impact',0,3,{x:.5,y:.3,t:'PEA!'}],['sparkle',0,8]],tx:[[3,8,'“PEA!”','「ピー！」','manga',.2,{rot:5}]],sx:[[0,'drop'],[3,'cheer']]},
 {d:8,bg:'living',tr:'whip',a:[['c_pooping_3',.32,.9,.44,'shake'],['bbean_1',.72,.86,.28,'hop']],fx:[['confetti',0,8,{n:30}]],tx:[[0,8,'…we’ll take it 💚','…それでよし 💚','manga',.2,{rot:-3}]],sx:[[0,'laugh']]}
]},
// bb08 tier list: Baby Bean ranks his toys
{id:'bb08',cat:'parent',bb:1,by:'pooping',song:'comedy',seed:4108,bpm:108,likes:207000,cm:9200,
 cap:['Baby Bean ranks his toys 📋🫛 (the box was S tier) #babybean #tierlist','ベビービーンのおもちゃ格付け📋🫛（箱がSランク） #ベビービーン #格付け'],
 snd:['Toy Tiers','おもちゃランキング'],
 com:[['pinco','the box always wins','いつも箱が勝つ'],['pooh','duck deserved better','アヒルかわいそう']],
 shots:[
 {d:5,bg:'nursery',a:[['bbean_1',.5,.84,.3,'hop',{in:'pop'}]],tx:[[0,5,'Baby Bean ranks his toys 📋','ベビービーンがおもちゃを格付け 📋','big',.17]],sx:[[0,'pop']]},
 {d:12,bg:'#2a1d48/#4a2d6a',dots:0,tr:'whip',fx:[['tier',0,12,{rows:['S','A','B','C'],y:.22,rh:.11,items:[['p_rattle',1,.8],['p_duck',2,2.4],['p_paci',1,4],['p_onesie',3,5.6],['p_gift',0,8]]}]],tx:[[.8,2.4,'rattle: A (loud = good)','ガラガラ：A（うるさい＝良い）','tag',.72],[2.4,4,'duck: B','アヒル：B','tag',.72],[4,5.6,'pacifier: A','おしゃぶり：A','tag',.72],[5.6,8,'pajamas: C (bedtime = no)','パジャマ：C（寝る＝イヤ）','tag',.72],[8,12,'the BOX the gift came in: S','プレゼントが入ってた箱：S','tag',.72]],sx:[[.8,'ding'],[2.4,'ding'],[4,'ding'],[5.6,'boing'],[8,'cheer']]},
 {d:6,bg:'nursery',tr:'zoom',a:[['c_pooping_3',.32,.9,.42,'tremble'],['bbean_1',.72,.86,.26,'hop']],tx:[[0,6,'I spent weeks picking those toys.','おもちゃ、何週間も選んだのに。','bub',.3,{x:.4,tx:.32,ty:.5,who:'pooping'}]],sx:[[0,'laugh']]}
]},
// pa01 listicle: winter outing checklist
{id:'pa01',cat:'parent',by:'pooping',song:'xmas',seed:4201,bpm:100,likes:149000,cm:5200,
 cap:['winter outing checklist with little ones ❄️👶 save this #parenting #winter','小さい子との冬のおでかけチェックリスト❄️👶 保存してね #子育て #冬'],
 snd:['Pack It Up','準備ばんたん'],
 com:[['pooh','spare clothes saved me 3 times','着替えに3回救われた'],['pinco','saving!!','保存！！']],
 shots:[
 {d:5,bg:BBG,a:[['pooping_parent_2',.5,.9,.46,'bob']],fx:[['snow',0,5,{n:30}]],tx:[[0,5,'winter outing checklist ❄️','冬のおでかけチェックリスト ❄️','big',.17]],sx:[[0,'bells']]},
 {d:5,bg:BBG,tr:'whip',a:[['p_mittens',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'☑ layers you can add or remove','☑ 脱ぎ着しやすい重ね着','pill',.22]],sx:[[0,'ding']]},
 {d:5,bg:BBG,tr:'whip',a:[['p_onesie',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'☑ spare clothes (always)','☑ 着替え（必ず）','pill',.22]],sx:[[0,'ding']]},
 {d:5,bg:BBG,tr:'whip',a:[['p_bottle',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'☑ drinks + snacks','☑ 飲み物とおやつ','pill',.22]],sx:[[0,'ding']]},
 {d:5,bg:BBG,tr:'whip',a:[['p_calendar',.5,.62,.14,'float',{sh:0}]],tx:[[0,5,'☑ check weather + opening hours','☑ 天気と営業時間をチェック','pill',.22]],sx:[[0,'ding']]},
 {d:6,bg:'park',tr:'zoom',a:[['pooping_parent_0',.4,.9,.44,'bob'],['babies_0',.78,.9,.2,'hop']],fx:[['hearts',0,6,{n:8}]],tx:[[0,6,'and leave 10 minutes earlier than you think 😅','あと、思ってるより10分早く出発 😅','tag',.22]],sx:[[0,'chime']]}
]},
// pa02 claymation: tidy-up game
{id:'pa02',cat:'parent',by:'pooh',song:'clay',seed:4202,bpm:112,likes:137000,cm:4700,look:'clay',
 cap:['stop-motion: the 2-minute tidy-up game 🧸 (babysitter Pooh edition) #parenting #stopmotion','ストップモーション：2分でお片付けゲーム🧸（シッターのプー編） #子育て #ストップモーション'],
 snd:['Tidy Tempo','お片付けテンポ'],
 com:[['pooping','trying this tonight','今夜やってみる'],['pinco','Baby Pinco did the most work','ベビーピンコがいちばん働いた']],
 shots:[
 {d:6,bg:'nursery',a:[['pooh_parent_1',.5,.86,.44,'bob']],tx:[[0,6,'turn tidy-up into a game 🧸','お片付けをゲームにする 🧸','cap',.22]],sx:[[0,'pop']]},
 {d:6,bg:'nursery',tr:'cut',a:[['babies_0',.3,.9,.22,'hop',{mv:[.55,.9],mvd:6}],['p_duck',.7,.86,.08,'idle',{mv:[.5,.86],mvd:6}]],fx:[['count',0,6,{from:3}]],tx:[[0,6,'set a short timer','短いタイマーをセット','cap',.22]],sx:[[0,'tick'],[2,'tick'],[4,'tick']]},
 {d:6,bg:'nursery',tr:'cut',a:[['babies_1',.35,.9,.22,'hop'],['babies_2',.68,.9,.22,'dance']],fx:[['lines',0,6]],tx:[[0,6,'every toy “goes home” to its box','おもちゃを「おうち」の箱に帰す','cap',.22]],sx:[[0,'boing'],[3,'boing']]},
 {d:6,bg:'nursery',tr:'zoom',a:[['pooh_parent_0',.5,.86,.44,'hop']],fx:[['confetti',0,6,{n:30}]],tx:[[0,6,'cheer at the end 🎉','最後はみんなで拍手 🎉','cap',.22]],sx:[[0,'cheer']]}
]}
);
