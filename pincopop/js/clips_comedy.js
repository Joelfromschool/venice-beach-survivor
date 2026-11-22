'use strict';
// COMEDY clips (times in beats)
window.CLIPS=window.CLIPS||[];
CLIPS.push(
{id:'c01',cat:'comedy',by:'bronny',song:'comedy',seed:201,bpm:128,likes:120400,cm:4410,
 cap:['Walking in like I own the boardwalk 😎 …the boardwalk: no #fail #venicebeach','ボードウォークを堂々と歩いてたら😎 …ボードウォーク「いいえ」 #失敗'],
 snd:['Confidence Walk (slip remix)','自信満々ウォーク（すべりリミックス）'],
 com:[['pinco','the facepalm at the end 💀','最後の顔に手💀'],['pooh','are you ok','だいじょうぶ？']],
 shots:[
 {d:6,bg:'boardwalk',cam:[1,1.05,.5,.5,.55,.5],a:[['c_bronny_0',.25,.86,.48,'bob',{mv:[.55,.86],mvd:6,me:'lin'}]],tx:[[0,6,'me walking in confidently','自信満々で登場するぼく','sub',.2]],sx:[[0,'pop']]},
 {d:4,bg:'boardwalk',tr:'cut',cam:[1.2,1.3,.55,.55,.6,.6],a:[['bronny_comedy_0',.55,.8,.46,'shake']],fx:[['speed',0,1.5]],tx:[[0,4,'the floor:','床：','big',.18]],sx:[[0,'slip'],[1.6,'thud']],shake:[1.6,2.4,.025],pz:[1.6]},
 {d:4,bg:'boardwalk',tr:'cut',cam:[1.3,1.3,.55,.55,.7,.7],a:[['c_bronny_1',.55,.74,.4,'idle',{rot:-88,mid:1}]],fx:[['stars',0,4,{x:.5,y:.66}],['impact',0,1,{x:.55,y:.8,s:.22,t:'BONK'}]],tx:[[1,4,"it's fine. I'm fine.","だいじょうぶ。平気。",'sub',.3]],sx:[[0,'bonk']]},
 {d:6,bg:'boardwalk',tr:'whip',a:[['bronny_comedy_1',.3,.86,.46,'shake'],['pinco_comedy_0',.72,.86,.46,'idle',{in:'r'}]],fx:[['emoji',1,6,{e:'😂',x:.5,y:.5,n:8}]],tx:[[0,6,'(he was not fine)','（平気じゃなかった）','pillk',.2]],sx:[[0,'laugh'],[2,'laugh']]}
]},
{id:'c02',cat:'comedy',by:'pooh',song:'comedy',seed:202,bpm:126,likes:88700,cm:2905,
 cap:['"We have pancakes at home" 🥲 #wehavefoodathome','「パンケーキは家にあるでしょ」🥲'],
 snd:['Pancakes At Home','家のパンケーキ'],
 com:[['pooping','I stand by my toast','あのトーストは自信作'],['bean','the toast deserved better','トーストに罪はない']],
 shots:[
 {d:5,bg:'promenade',a:[['c_pooh_3',.32,.86,.44,'hop'],['c_pooping_1',.72,.86,.4,'idle']],tx:[[0,5,'Me: can we get pancakes? 🥞','ぼく：パンケーキ食べたい？🥞','bub',.32,{x:.33,tx:.32,ty:.44,who:'pooh'}]],sx:[[0,'pop']]},
 {d:5,bg:'promenade',tr:'cut',cam:[1.25,1.3,.7,.7,.5,.5],a:[['c_pooh_3',.32,.86,.44,'idle'],['c_pooping_0',.72,.86,.4,'talk']],tx:[[0,5,'Dad: we have pancakes at home','パパ：パンケーキは家にあるでしょ','bub',.3,{x:.62,tx:.72,ty:.47,who:'pooping'}]]},
 {d:4,bg:'kitchen',tr:'whip',cam:[1.15,1.3,.5,.5,.6,.6],a:[['p_toast',.5,.72,.25,'tremble',{in:'drop',sh:0}]],fx:[['smoke',0,4,{x:.5,y:.6}]],tx:[[0,4,'the pancakes at home:','家のパンケーキ：','big',.2]],sx:[[0,'thud'],[1,'crickets']]},
 {d:4,bg:'promenade',tr:'cut',cam:[1.5,1.6,.32,.32,.48,.48],a:[['c_pooh_0',.32,.86,.44,'tremble']],fx:[['bgtint',0,4,{c:'#203050',a:.35}]],tx:[[0,4,'🥲','🥲','big',.25,{s:2}]],sx:[[0,'scratch']]}
]},
{id:'c03',cat:'comedy',by:'pinco',song:'makeup',seed:203,bpm:122,likes:156000,cm:5210,
 cap:['Learning the new dance trend 💃 attempt #47 (Pooh learned it in one try??) #dancetrend','新しいダンスに挑戦💃 47回目（プーは1回で覚えた？？）'],
 snd:['Paw Step Challenge','肉球ステップ・チャレンジ'],
 com:[['pooh','I just float 🤷','ぼくは浮いてるだけ🤷'],['party','teach me!!!','教えて！！！']],
 shots:[
 {d:4,bg:'living',a:[['pinco_comedy_2',.5,.88,.5,'talk']],fx:[['rec',0,4]],tx:[[0,4,'learning the new dance trend 💃','新しいダンス練習中 💃','pill',.2]],sx:[[0,'pop']]},
 {d:6,bg:'living',tr:'flash',a:[['pinco_comedy_1',.5,.88,.5,'dance']],fx:[['notes',0,6,{x:.5,y:.4}]],tx:[[0,6,'attempt #1','1回目','tag',.17],[2,6,'nailed it?','完璧？','sub',.64]],sx:[[0,'pop']]},
 {d:4,bg:'living',tr:'cut',cam:[1.1,1.2,.5,.5,.55,.55],a:[['c_pinco_3',.5,.88,.5,'shake',{rot:12}]],fx:[['stars',0,4,{x:.5,y:.42}]],tx:[[0,4,'attempt #47','47回目','tag',.17]],sx:[[0,'boing'],[.5,'thud']],shake:[.5,1.2,.02]},
 {d:6,bg:'living',tr:'whip',a:[['pinco_comedy_0',.27,.88,.42,'idle'],['c_pooh_1',.7,.86,.46,'dance']],fx:[['sparkle',0,6,{x:.7,y:.55}]],tx:[[0,6,'Pooh in the background, first try:','うしろのプー、1回で完璧：','pill',.18]],sx:[[0,'chime'],[3,'laugh']]}
]},
{id:'c04',cat:'comedy',by:'asmon',song:'villain',seed:204,bpm:140,likes:99100,cm:3388,
 cap:['Villain monologue, interrupted 😈🍝 #villainlife','悪役の演説、中断😈🍝'],
 snd:['Doom Monologue','破滅の演説'],
 com:[['pooping','dinner was getting cold','ご飯が冷めちゃうから'],['bronny','COMING! 😂','今行く！😂']],
 shots:[
 {d:8,bg:'lair',cam:[1,1.12,.5,.5,.5,.45],a:[['c_asmon_5',.5,.9,.6,'nod']],fx:[['flash',3,3.8,{c:'#b9a6ff',a:.7}],['bars',0,8]],tx:[[0,8,'I SHALL RULE HONEYVALE!!','ハニーヴェイルはオレのものだ！！','bub',.24,{x:.5,tx:.5,ty:.33,who:'asmon'}]],sx:[[0,'evil'],[3,'thunder']],pz:[3]},
 {d:6,bg:'lair',tr:'cut',a:[['c_asmon_5',.3,.9,.6,'idle'],['c_pooping_1',.82,.88,.38,'idle',{in:'r'}]],tx:[[1,6,"Asmon, dinner's ready 🍝",'アスモン、ご飯よ🍝','bub',.38,{x:.68,tx:.8,ty:.55,who:'pooping'}]],sx:[[1,'pop']]},
 {d:4,bg:'lair',tr:'cut',cam:[1.4,1.4,.3,.3,.42,.42],a:[['c_asmon_5',.3,.9,.6,'idle']],tx:[[0,4,'...','…','big',.25]],sx:[[0,'crickets']]},
 {d:6,bg:'lair',tr:'zoom',a:[['c_asmon_1',.5,.9,.6,'hop']],fx:[['hearts',0,6,{x:.5,y:.4}]],tx:[[0,6,'COMING!!','今行く！！','big',.2,{c:'#ffd84a'}],[2,6,'villains have bedtimes too','悪役にも門限はある','sub',.66]],sx:[[0,'boing'],[1,'laugh']]}
]},
{id:'c05',cat:'comedy',by:'bean',song:'comedy',seed:205,bpm:132,likes:143000,cm:6020,
 cap:['When someone says "up top!" and you have no arms 🫛✋ he found a way #highfive','「ハイタッチ！」って言われたけど腕がない🫛✋ でも方法を見つけた'],
 snd:['Up Top Polka','ハイタッチ・ポルカ'],
 com:[['bronny','that was the best high five of my life','人生最高のハイタッチだった'],['prof','Innovative. Headbutt-five.','画期的。頭突きタッチ。']],
 shots:[
 {d:4,bg:'park',a:[['c_bronny_1',.68,.86,.48,'hop'],['c_bean_1',.3,.86,.36,'idle']],tx:[[0,4,'UP TOP! ✋','ハイタッチ！✋','bub',.3,{x:.66,tx:.66,ty:.4,who:'bronny'}]],sx:[[0,'pop']]},
 {d:5,bg:'park',tr:'cut',cam:[1.4,1.5,.3,.3,.65,.62],a:[['c_bean_1',.3,.86,.36,'idle',{sw:[[2.5,'c_bean_3']]}]],tx:[[0,5,'Mr Bean:','ミスター・ビーン：','pill',.24],[2.5,5,'(no arms)','（腕がない）','pillk',.31]],sx:[[2.5,'crickets']]},
 {d:4,bg:'park',tr:'whip',a:[['c_bronny_1',.66,.86,.48,'idle'],['c_bean_5',.3,.86,.36,'idle',{arc:[.57,.6,.3,0],t:[0,1.4],rot:20}],['c_bean_5',.57,.6,.36,'shake',{t:[1.4,4],rot:20,sh:0}]],fx:[['impact',1.4,2.4,{x:.6,y:.35,t:'BOOP',s:.18}],['sparkle',1.4,4,{x:.6,y:.4}]],sx:[[0,'rise'],[1.4,'bonk']],shake:[1.4,2,.02]},
 {d:5,bg:'park',tr:'flash',a:[['c_bronny_3',.68,.86,.48,'hop'],['c_bean_2',.3,.86,.36,'dance']],fx:[['confetti',0,5]],tx:[[0,5,'he found a way 🫡','方法を見つけた🫡','big',.2]],sx:[[0,'cheer']]}
]},
{id:'c06',cat:'comedy',by:'pooh',song:'comedy',seed:206,bpm:136,likes:76500,cm:1980,
 cap:['When the store says "closing in 5 minutes" 🏃💨 (Pooh doesn’t even have legs) #grocery','「閉店5分前です」の放送が流れたとき🏃💨（プーは足すらない）'],
 snd:['Last Call Gallop','閉店ギャロップ'],
 com:[['mogu','he took the last onigiri','最後のおにぎり取られた'],['prof','Floating shoes reach 40 km/h','浮遊靴は時速40km']],
 shots:[
 {d:4,bg:'grocery',cam:[1,1.08,.5,.5,.5,.5],fx:[['flash',0,.5]],tx:[[0,4,'📢 "store closing in 5 minutes"','📢「まもなく閉店です」','pillk',.2],[1.5,4,'Pooh:','プー：','big',.3]],sx:[[0,'ding']]},
 {d:6,bg:'grocery',tr:'zoom',a:[['c_pooh_3',.5,.95,.5,'hop',{in:'b',mv:[.5,.82,.75],mvd:5,me:'lin'}],['p_donut',.2,.6,.1,'spin',{arc:[-.1,.3,.2,2],t:[1.5,4],sh:0}],['p_burger',.8,.62,.1,'spin',{arc:[1.1,.35,.2,2],t:[2,4.5],sh:0}],['p_onigiri',.3,.6,.09,'spin',{arc:[.1,.2,.2,1],t:[3,5],sh:0}]],fx:[['lines',0,6],['speed',0,6]],tx:[[0,6,'NOT WITHOUT MY SNACKS','おやつなしでは帰らない','big',.17,{c:'#ffd84a'}]],sx:[[0,'whoosh'],[1.5,'pop'],[2,'pop'],[3,'pop']],shake:[0,6,.006]},
 {d:5,bg:'grocery',tr:'flash',a:[['c_pooh_2',.5,.86,.5,'bob']],fx:[['money',0,5,{n:18}],['sparkle',0,5,{x:.5,y:.6}]],tx:[[0,5,'made it ✅','間に合った ✅','big',.2],[1.5,5,'paid in gold coins, again','また金貨で支払い','sub',.66]],sx:[[0,'cash'],[1,'cheer']]}
]},
{id:'c07',cat:'comedy',by:'pooping',song:'comedy',seed:207,bpm:124,likes:61200,cm:1540,
 cap:['Dad joke night at the club 🎤 tough crowd (Bronny) #dadjokes #standup','クラブでダジャレナイト🎤 手ごわい客（ブロニー）'],
 snd:['Ba-Dum Shuffle','バダム・シャッフル'],
 com:[['bronny','I laughed on the inside','心の中では笑ってた'],['pooh','flat 😂😂','ぺったんこ😂😂']],
 shots:[
 {d:4,bg:'stage',a:[['c_pooping_1',.45,.84,.4,'idle']],fx:[['spot',0,4,{x:.45,y:.62}]],tx:[[0,4,'Dad joke night 🎤','ダジャレナイト 🎤','big',.18]],sx:[[0,'cheer']]},
 {d:8,bg:'stage',tr:'cut',cam:[1.1,1.2,.45,.45,.55,.5],a:[['c_pooping_0',.45,.84,.4,'talk']],fx:[['spot',0,8,{x:.45,y:.62}]],tx:[[0,8,'Why did the pancake go to therapy?','パンケーキはなぜカウンセリングへ？','bub',.3,{x:.45,tx:.45,ty:.48,who:'pooping'}],[4,8,'It felt a little flat.','ちょっとペシャンコな気分だったから。','sub',.66]],sx:[[6,'rimshot']]},
 {d:5,bg:'stage',tr:'cut',cam:[1.1,1.1,.5,.5,.55,.55],a:[['bronny_comedy_2',.5,.9,.6,'idle']],fx:[['bgtint',0,5,{c:'#000',a:.35}]],tx:[[0,5,'the crowd:','お客さん：','pill',.18]],sx:[[0,'crickets'],[2,'crickets']]},
 {d:5,bg:'stage',tr:'whip',a:[['c_pooping_5',.45,.84,.4,'bob']],fx:[['spot',0,5,{x:.45,y:.62}],['sparkle',0,5,{x:.45,y:.55}]],tx:[[0,5,"I'll be here all week 👍",'今週ずっと出演してます👍','bub',.34,{x:.45,tx:.45,ty:.48,who:'pooping'}]],sx:[[0,'rimshot']]}
]},
{id:'c08',cat:'comedy',by:'mogu',song:'sweet',seed:208,bpm:110,likes:47300,cm:1210,
 cap:['Hide and seek world champion 😎 undefeated since forever #hideandseek','かくれんぼ世界王者😎 ずっと無敗'],
 snd:['Ready Or Not (mole mix)','もういいかい（モグラMIX）'],
 com:[['max','I was SO close','あとちょっとだったのに'],['party','the sunglasses 😂','サングラス😂']],
 shots:[
 {d:4,bg:'park',a:[['c_mogu_1',.5,.86,.42,'bob']],tx:[[0,4,'Mogu is the hide and seek champion','モグはかくれんぼチャンピオン','pill',.2]],sx:[[0,'pop']]},
 {d:4,bg:'park',tr:'cut',a:[['c_max_0',.5,.86,.36,'idle']],fx:[['count',0,4,{x:.5,y:.35,from:3}]],tx:[[0,4,'Max is counting…','マックスが数えてる…','pillk',.17]],sx:[[0,'tick'],[1.33,'tick'],[2.66,'tick']]},
 {d:6,bg:'park',tr:'whip',a:[['c_mogu_0',.25,.9,.24,'idle',{mv:[.25,.98],mvd:1}],['c_max_3',.75,.86,.36,'sneak',{mv:[.4,.86],mvd:5}]],tx:[[0,6,'*sniff sniff*','*くんくん*','sub',.6]],fx:[['sweat',2,6,{x:.33,y:.82}]],sx:[[1,'tick'],[2,'tick'],[3,'tick']]},
 {d:6,bg:'park',tr:'flash',a:[['c_max_3',.38,.86,.36,'shake'],['c_mogu_2',.76,.86,.4,'bob',{in:'b'}]],fx:[['sparkle',0,6,{x:.76,y:.55}]],tx:[[0,6,'undefeated 😎','無敗 😎','big',.2]],sx:[[0,'boing'],[1,'laugh']]}
]},
{id:'c09',cat:'comedy',by:'pinco',song:'sweet',seed:209,bpm:112,likes:83400,cm:2260,
 cap:['Beach day: expectation vs reality 🌴🛹 #expectationvsreality','ビーチの日：理想と現実🌴🛹'],
 snd:['Strand Cruise','ストランド・クルーズ'],
 com:[['pooh','I caught your apple 🍎','りんごキャッチしたよ🍎'],['bronny','the skateboard has left the chat','スケボーは退出しました']],
 shots:[
 {d:8,bg:'#bfe9ff/#fff2c7',dots:0,panes:[
   {r:[0,0,1,.5],bg:'boardwalk',a:[['c_pinco_5',.55,.97,.72,'idle']],fx:[['sparkle',0,8,{x:.5,y:.5,r:.3}]],tx:[[0,8,'Expectation','理想','pill',.22,{x:.22}]]},
   {r:[0,.5,1,.5],bg:'boardwalk',a:[['c_pinco_2',.3,.97,.72,'shake',{mv:[.68,.9],mvd:3,t:[0,3.2]}],['c_pinco_3',.68,.97,.72,'shake',{t:[3.2,8],rot:25}],['c_pooh_4',.3,.97,.62,'hop',{t:[4,8],in:'l'}]],fx:[['stars',3.2,8,{x:.66,y:.3}]],tx:[[0,8,'Reality','現実','pillk',.22,{x:.22}]]}],
  sx:[[0,'chime'],[1,'whoosh'],[3.2,'thud'],[4,'boing']]},
 {d:5,bg:'boardwalk',tr:'whip',a:[['pinco_comedy_0',.5,.88,.5,'idle']],tx:[[0,5,'every. single. time.','毎回。かならず。','big',.2]],sx:[[0,'laugh']]}
]},
{id:'c10',cat:'comedy',by:'prof',song:'sweet',seed:210,bpm:100,likes:69900,cm:1888,
 cap:['Fun science fact about Pooh 🧪 peer reviewed by Mr Bean #science','プーについての科学豆知識🧪 ミスター・ビーンによる査読済み'],
 snd:['Lab Notes Lo-Fi','研究ノートLo-Fi'],
 com:[['pooh','it is true. no legs.','本当だよ。足ないよ。'],['bean','I also have no legs. or arms.','ぼくも足ないよ。腕も。']],
 shots:[
 {d:4,bg:'#d7f3ff/#f2e8ff',a:[['c_prof_0',.5,.84,.46,'talk']],tx:[[0,4,'🧪 Fun science fact','🧪 科学の豆知識','big',.18]],sx:[[0,'chime']]},
 {d:8,bg:'#d7f3ff/#f2e8ff',tr:'whip',a:[['c_pooh_3',.42,.84,.55,'float']],fx:[['arrow',1,8,{x:.62,y:.78,r:Math.PI}],['arrow',3,8,{x:.62,y:.45,r:Math.PI}]],
  tx:[[0,8,'Pooh has 0 legs','プーの足は0本','pill',.16],[1,8,'shoes (floating)','くつ（浮いてる）','tag',.78,{x:.82}],[3,8,'100% vibes','ノリ100%','tag',.45,{x:.82}]],sx:[[1,'pop'],[3,'pop']]},
 {d:5,bg:'#d7f3ff/#f2e8ff',tr:'flash',a:[['c_prof_1',.3,.84,.4,'nod'],['c_bean_5',.72,.84,.34,'bob']],fx:[['check',1,5,{x:.5,y:.36}]],tx:[[0,5,'peer reviewed by Mr Bean','ミスター・ビーンが査読','sub',.24]],sx:[[1,'ding']]}
]}
);
