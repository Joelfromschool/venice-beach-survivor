'use strict';
// v1.5.5 batch: Baby Bean + Parenting, no date/price/rating claims.
window.CLIPS=window.CLIPS||[];
CLIPS.push(
{id:'bb23',cat:'parent',also:['tokyo'],bb:1,by:'pooping',song:'lofi',seed:5401,bpm:84,likes:233000,cm:8800,look:'film',
 cap:['slow Sunday walk in Yoyogi Park with Baby Bean 🍂🫛 #yoyogipark #babybean #sundaywalk','ベビービーンと代々木公園で日曜のおさんぽ🍂🫛 #代々木公園 #ベビービーン'],
 snd:['Ginkgo Stroll','いちょうさんぽ'],
 com:[['pinco','the leaf catch 😭','葉っぱキャッチ😭'],['pooh','I would also stare at that leaf','ぼくもその葉っぱ見つめる']],
 shots:[
 {d:5,bg:'x_ginkgo',a:[['pooping_parent_0',.38,.9,.44,'bob'],['bbean_0',.74,.84,.24,'idle']],tx:[[0,5,'Sunday walk, no plans 🍂','日曜のおさんぽ、予定なし 🍂','serif',.2]],sx:[[0,'chime']]},
 {d:5,bg:'x_ginkgo',tr:'cut',cam:[1.3,1.3,.5,.55,.5,.5],a:[['bbean_0',.5,.84,.32,'idle']],fx:[['sparkle',0,5,{x:.5,y:.4,r:.2}]],tx:[[0,5,'one leaf landed on his bonnet','ボンネットに葉っぱが1枚','serif',.2]],sx:[[0,'tick']]},
 {d:5,bg:'x_ginkgo',tr:'cut',a:[['bbean_1',.5,.84,.32,'hop']],fx:[['hearts',0,5,{n:6}]],tx:[[0,5,'best thing that happened all week','今週いちばんの出来事','serif',.2]],sx:[[0,'giggle']]},
 {d:5,bg:'x_ginkgo',tr:'zoom',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_2',.72,.84,.26,'bob']],fx:[['zzz',0,5,{x:.75,y:.5}]],tx:[[0,5,'(asleep by the gate)','（出口でおやすみ）','serif',.2]],sx:[[0,'aww']]}
]},
{id:'pa12',cat:'parent',also:['comedy'],by:'pooping',song:'comedy',seed:5402,bpm:112,likes:169000,cm:7200,
 cap:['new-parent survival kit, ranked ☕🍼 #parenting #newparents #tierlist','新米パパママのサバイバルグッズ格付け☕🍼 #子育て #格付け'],
 snd:['Survival Tier','サバイバル格付け'],
 com:[['bean','the mug is S tier forever','マグは永遠にS'],['max','I am also a survival item 🐶','私もサバイバルグッズ🐶']],
 shots:[
 {d:4,bg:'living',a:[['pooping_parent_1',.5,.9,.46,'talk',{in:'pop'}]],tx:[[0,4,'new-parent survival kit tier list ☕','新米親\nサバイバル格付け ☕','big',.2]],sx:[[0,'pop']]},
 {d:12,bg:'#1d1430/#3a2350',dots:0,tr:'whip',fx:[['tier',0,12,{rows:[['S','S'],['A','A'],['B','B'],['C','C']],y:.22,rh:.11,items:[['p_mug',0,.6],['p_bottle',0,2],['p_onesie',1,3.4],['p_phone',2,4.8],['p_rattle',3,6.2]]}]],tx:[[.6,2,'reheated coffee (3rd time)','温め直したコーヒー（3回目）','tag',.72],[2,3.4,'a ready bottle at 3 a.m.','夜中3時に準備済みのミルク','tag',.72],[3.4,4.8,'spare onesies. many.','替えの肌着。大量に。','tag',.72],[4.8,6.2,'phone (camera roll: 4,000 baby pics)','スマホ（赤ちゃん写真4000枚）','tag',.72],[6.2,8,'the loud rattle (he loves it, we don’t)','うるさいガラガラ（彼は好き、親は…）','tag',.72],[8,12,'S tier: each other 💛','S：おたがいの存在 💛','tag',.72]],sx:[[.6,'pop'],[2,'pop'],[3.4,'pop'],[4.8,'pop'],[6.2,'pop'],[8,'aww']]}
]},
{id:'bb24',cat:'parent',bb:1,by:'pooh',song:'sweet',seed:5403,bpm:80,likes:248000,cm:10100,
 cap:['Uncle Pooh reads Baby Bean a bedtime story 📖🌙 (he made it up) #babybean #bedtimestory','プーおじさんの読み聞かせ📖🌙（即興） #ベビービーン #読み聞かせ'],
 snd:['Honey Moon Story','はちみつ月のおはなし'],
 com:[['pooping','who fell asleep first? (Pooh)','先に寝たのは？（プー）'],['pinco','I need this story as a book','この話、絵本にして']],
 shots:[
 {d:5,bg:'bedtime',a:[['c_pooh_1',.36,.9,.44,'talk'],['bbean_0',.74,.84,.26,'idle']],fx:[['stars',0,5]],tx:[[0,5,'“once upon a time, a little pea…”','「むかしむかし、小さなおまめが…」','bub',.24,{x:.4}]],sx:[[0,'chime']]},
 {d:5,bg:'bedtime',tr:'cut',a:[['c_pooh_0',.36,.9,.44,'bob'],['bbean_1',.74,.84,.26,'hop']],tx:[[0,5,'“…found a moon made of honey.”','「…はちみつのお月さまを見つけました」','bub',.24,{x:.4}]],sx:[[0,'tick']]},
 {d:5,bg:'bedtime',tr:'cut',a:[['c_pooh_2',.36,.9,.44,'bob'],['bbean_2',.74,.84,.26,'bob']],fx:[['zzz',0,5,{x:.77,y:.5}]],tx:[[0,5,'“and he ate— I mean, he said goodnight.”','「そして食べ…じゃなくて、おやすみを言いました」','bub',.24,{x:.4}]],sx:[[0,'yawn']]},
 {d:5,bg:'bedtime',tr:'zoom',a:[['c_pooh_0',.36,.9,.44,'idle'],['bbean_2',.74,.84,.26,'idle']],fx:[['zzz',0,5,{x:.4,y:.45}],['zzz',0,5,{x:.77,y:.5}],['stars',0,5]],tx:[[0,5,'goodnight, both of you 🌙','ふたりとも、\nおやすみ 🌙','big',.2]],sx:[[0,'snore']]}
]}
);
