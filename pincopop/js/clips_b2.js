'use strict';
// v1.5.2 batch. Facts checked 2026-11-24 (JST): AAP winter car-seat tips (healthychildren.org Winter-Car-Seat-Safety-Tips),
// JANM 2026 Oshogatsu Family Festival page (janm.org/events/2026-01-11/...). No prices, no ratings.
window.CLIPS=window.CLIPS||[];
const B2P='#fff1f6/#ffe0ec',B2B='#eaf4ff/#d4e8ff',B2D='#1a1430/#2e2350';
CLIPS.push(
// bb15 PSA (pill checklist): winter car seat
{id:'bb15',cat:'parent',also:['la'],bb:1,by:'pooping',song:'parent',seed:5201,bpm:100,likes:268000,cm:12400,note:1,
 cap:['the puffy-coat car seat rule nobody told me 🚗🫛 (AAP tips) #carseatsafety #babybean #parenting','ダウンのままチャイルドシートはNGって知らなかった🚗🫛（米国小児科学会） #チャイルドシート #ベビービーン'],
 snd:['Buckle Up Bean','シートベルトとビーン'],
 com:[['pinco','did the pinch test on my car seat. TIGHTENED.','つまみテストした。締め直した。'],['prof','Source: AAP / HealthyChildren.org winter car seat tips.','出典：米国小児科学会 HealthyChildren.org']],
 shots:[
 {d:5,bg:'living',a:[['pooping_parent_1',.38,.9,.44,'talk'],['bbean_0',.74,.84,.26,'idle']],fx:[['snow',0,5,{n:20}]],tx:[[0,5,'cold morning car ride? read this 🚗❄️','寒い朝のドライブ？これ読んで 🚗❄️','big',.18]],sx:[[0,'pop']]},
 {d:6,bg:B2B,dots:0,tr:'whip',a:[['p_mittens',.5,.64,.14,'float',{sh:0}]],fx:[['cross',.6,6]],tx:[[0,6,'✗ no puffy coat or snowsuit under the harness','✗ ハーネスの下にダウンやスノースーツはNG','pill',.22,{s:.9}],[1.5,6,'in a crash the padding squashes and the straps get loose','衝突時に中わたがつぶれて、ベルトがゆるむ','tag',.34]],sx:[[0,'buzz']]},
 {d:6,bg:B2B,dots:0,tr:'whip',a:[['p_onesie',.5,.64,.14,'float',{sh:0}]],fx:[['check',.6,6]],tx:[[0,6,'☑ thin, snug layers + hat, socks, mittens','☑ 薄くてぴったりの重ね着＋帽子・靴下・手袋','pill',.22,{s:.9}]],sx:[[0,'ding']]},
 {d:6,bg:B2B,dots:0,tr:'whip',a:[['p_gift',.5,.64,.13,'float',{sh:0}]],fx:[['check',.6,6]],tx:[[0,6,'☑ pinch test: if you can pinch the strap, tighten it','☑ つまみテスト：ベルトがつまめたら締め直す','pill',.22,{s:.9}]],sx:[[0,'ding']]},
 {d:6,bg:'living',tr:'zoom',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_1',.74,.84,.26,'hop']],fx:[['hearts',0,6,{x:.72,y:.55,n:6}]],tx:[[0,6,'☑ coat or blanket goes OVER the buckled straps 💛','☑ 上着や毛布はベルトを締めた「上」から 💛','pill',.2,{s:.9}]],sx:[[0,'chime']]}
]},
// bb16 ASMR: the one tooth
{id:'bb16',cat:'parent',also:['comedy'],bb:1,by:'bean',song:'asmr',seed:5202,bpm:70,likes:239000,cm:9300,look:'asmr',
 cap:['ASMR: Baby Bean shows you his ONE tooth 🦷🫛 #babybean #firsttooth #asmr','ASMR：ベビービーン、歯が1本はえました🦷🫛 #ベビービーン #はじめての歯'],
 snd:['One Tooth Whisper','一本歯ささやき'],
 com:[['bean','he gets the tooth from me','歯はぼく似'],['pooh','it is a very good tooth','とても良い歯です']],
 shots:[
 {d:6,bg:'nursery',cam:[1,1.25,.5,.5,.5,.5],a:[['bbean_0',.5,.84,.32,'idle']],fx:[['mist',0,6]],tx:[[0,6,'*whispers* he has something to show you','＊ささやき＊ 見せたいものがあるって','sub',.27]],sx:[[0,'tick']]},
 {d:6,bg:'nursery',tr:'cut',cam:[1.25,1.55,.5,.55,.5,.5],a:[['bbean_1',.5,.84,.32,'idle']],fx:[['shine',1,6,{x:.5,y:.6}]],tx:[[0,6,'…one (1) tooth 🦷','…歯が1本 🦷','sub',.27]],sx:[[0,'ding']]},
 {d:6,bg:'nursery',tr:'cut',a:[['c_bean_1',.33,.9,.42,'bob'],['bbean_1',.73,.84,.26,'bob']],fx:[['sparkle',0,6]],tx:[[0,6,'Dad also has one tooth. it runs in the family.','パパも歯が1本。遺伝です。','sub',.27]],sx:[[0,'giggle']]},
 {d:6,bg:'bedtime',tr:'zoom',a:[['bbean_2',.5,.84,.32,'bob']],fx:[['zzz',0,6,{x:.6,y:.5}],['stars',0,6]],tx:[[0,6,'goodnight, tooth 🌙','おやすみ、歯 🌙','sub',.27]],sx:[[0,'snore']]}
]},
// bb17 SCRAPBOOK: Oshogatsu in LA (JANM, Little Tokyo)
{id:'bb17',cat:'la',also:['parent','lng'],bb:1,by:'bronny',song:'sweet',seed:5203,bpm:96,likes:208000,cm:7800,note:1,
 cap:['a Japanese New Year in LA for Baby Bean 🎍🫛 JANM’s Oshogatsu Family Festival (2027 date TBA) #littletokyo #oshogatsu #babybean','LAでベビービーンのお正月🎍🫛 全米日系人博物館のお正月ファミリーフェス（2027年は日程未発表） #リトル東京'],
 snd:['Mochitsuki Morning','もちつきの朝'],
 com:[['pooping','we are watching the mochi pounding from a safe distance','もちつきは安全な距離から見学します'],['pinco','LA + oshogatsu = perfect','LA＋お正月＝最高']],
 shots:[
 {d:5,bg:'la_lights',a:[['c_bronny_1',.38,.9,.44,'bob'],['bbean_0',.74,.84,.24,'hop']],fx:[['sparkle',0,5]],tx:[[0,5,'Baby Bean’s first oshogatsu… in LA 🎍','ベビービーン初めてのお正月…LAで 🎍','big',.2]],sx:[[0,'chime']]},
 {d:6,bg:B2P,dots:0,tr:'slide',a:[['p_teapot',.5,.6,.15,'float',{sh:0}]],fx:[['sparkle',0,6,{x:.5,y:.6,r:.2}]],tx:[[0,6,'📍 JANM Oshogatsu Family Festival','📍 全米日系人博物館 お正月ファミリーフェス','loc',.2,{s:.85}],[1.5,6,'last time: Sun Jan 11, 2026 · JACCC Plaza, Little Tokyo · free','前回：2026年1月11日(日)・リトル東京 JACCCプラザ・無料','tag',.32,{s:.9}]],sx:[[0,'shutter']]},
 {d:6,bg:B2P,dots:0,tr:'slide',a:[['p_onigiri',.5,.6,.14,'float',{sh:0}]],tx:[[0,6,'last year: mochitsuki (rice pounding) by Kodama Taiko + crafts + origami','前回：コダマ太鼓のもちつき、工作、折り紙','tag',.24,{s:.9}]],sx:[[0,'boing']]},
 {d:6,bg:B2P,dots:0,tr:'slide',a:[['p_calendar',.5,.6,.14,'float',{sh:0}]],tx:[[0,6,'2027 date not announced yet — watch janm.org','2027年の日程は未発表 — janm.org をチェック','tag',.24,{s:.9}]],sx:[[0,'ding']]},
 {d:5,bg:'la_lights',tr:'zoom',a:[['c_bronny_4',.35,.9,.42,'hop'],['bbean_1',.74,.84,.24,'hop']],fx:[['confetti',0,5]],tx:[[0,5,'あけましておめでとう from LA 🎍','LAから、あけましておめでとう 🎍','big',.2]],sx:[[0,'cheer']]}
]},
// bb18 COMEDY: peekaboo with Mogu (Mogu stays in his mound)
{id:'bb18',cat:'comedy',also:['parent'],bb:1,by:'mogu',song:'comedy',seed:5204,bpm:120,likes:281000,cm:11600,
 cap:['Mogu Mogu invented peekaboo (from his mound) 🕳️🫛 #babybean #peekaboo #mogumogu','モグモグ、いないいないばあを発明（穴から）🕳️🫛 #ベビービーン #いないいないばあ'],
 snd:['Peek-a-Mogu','いないいないモグ'],
 com:[['pinco','the giggle at 0:09 😭','0:09の笑い声😭'],['pooping','new babysitter unlocked','新しい子守が誕生']],
 shots:[
 {d:5,bg:'park',a:[['bbean_0',.3,.84,.28,'idle'],['c_mogu_0',.72,.92,.3,'idle']],tx:[[0,5,'Baby Bean meets Mogu Mogu 🫛🕳️','ベビービーン、モグモグに会う 🫛🕳️','big',.17]],sx:[[0,'pop']]},
 {d:4,bg:'park',tr:'cut',a:[['bbean_0',.3,.84,.28,'idle'],['c_mogu_1',.72,.92,.3,'hop']],fx:[['emoji',0,4,{e:'🙈',x:.72,y:.5,n:3}]],tx:[[0,4,'いないいない…','いないいない…','manga',.2,{rot:-4}]],sx:[[0,'whoosh']]},
 {d:4,bg:'park',tr:'flash',a:[['bbean_1',.3,.84,.28,'hop'],['c_mogu_3',.72,.92,.3,'shake']],fx:[['impact',0,1],['emoji',0,4,{e:'😆',x:.3,y:.5,n:5}]],tx:[[0,4,'BA!!','ばあ！！','manga',.2,{rot:5}]],sx:[[0,'boing'],[.3,'giggle']]},
 {d:4,bg:'park',tr:'flash',a:[['bbean_1',.3,.84,.28,'hop'],['c_mogu_5',.72,.92,.3,'wiggle']],fx:[['emoji',0,4,{e:'😂',x:.3,y:.5,n:6}]],tx:[[0,4,'again!! (x37)','もう1回！！（37回目）','manga',.2,{rot:-3}]],sx:[[0,'giggle']]},
 {d:5,bg:'park',tr:'zoom',a:[['bbean_2',.3,.84,.28,'bob'],['c_mogu_4',.72,.92,.3,'bob']],fx:[['zzz',0,5,{x:.32,y:.52}],['hearts',0,5,{x:.7,y:.6,n:5}]],tx:[[0,5,'mission complete. back to the mound.','任務完了。穴に戻ります。','cap',.2,{wps:3}]],sx:[[0,'aww']]}
]},
// pa07 FLASH CARDS: Japanese New Year words (language + parenting)
{id:'pa07',cat:'parent',also:['lng'],by:'pinco',song:'sweet',seed:5205,bpm:100,likes:164000,cm:5900,
 cap:['5 Japanese New Year words for bilingual families 🎍 #japanese #oshogatsu #bilingualkids','バイリンガル家族のためのお正月ことば5つ🎍 #日本語 #お正月 #バイリンガル育児'],
 snd:['Shogatsu Flash Cards','お正月フラッシュカード'],
 com:[['bronny','otoshidama is my favorite word now','おとしだまが一番好きな言葉になった'],['bean','kagami mochi looks like me stacked','鏡もち、ぼくを重ねたみたい']],
 shots:[
 {d:4,bg:'living',a:[['c_pinco_1',.5,.9,.46,'dance',{in:'pop'}]],tx:[[0,4,'New Year words for little ones 🎍','子どもと覚えるお正月ことば 🎍','big',.18]],sx:[[0,'pop']]},
 {d:5,bg:B2P,dots:0,tr:'flash',a:[['babies_0',.5,.86,.24,'hop']],tx:[[0,5,'あけまして\nおめでとう','あけまして\nおめでとう','big',.3,{s:1.25}],[1,5,'akemashite omedetō\n= Happy New Year','= 新年のあいさつ','tag',.42,{x:.5}]],sx:[[0,'ding']]},
 {d:5,bg:B2P,dots:0,tr:'flash',a:[['bbean_1',.5,.84,.26,'hop']],tx:[[0,5,'お年玉','お年玉','big',.3,{s:1.25}],[1,5,'otoshidama\n= New Year money for kids','= 子どもがもらうお正月のおこづかい','tag',.42,{x:.5}]],sx:[[0,'ding']]},
 {d:5,bg:B2P,dots:0,tr:'flash',tx:[[0,5,'おせち','おせち','big',.3,{s:1.25}],[1,5,'osechi\n= New Year feast in boxes','= 重箱に詰めたお正月料理','tag',.42,{x:.5}]],a:[['p_mamezara',.72,.62,.11,'float',{sh:0}],['bbean_1',.4,.84,.24,'hop']],sx:[[0,'ding']]},
 {d:5,bg:B2P,dots:0,tr:'flash',a:[['bbean_0',.5,.84,.26,'idle']],tx:[[0,5,'鏡もち','鏡もち','big',.3,{s:1.25}],[1,5,'kagami mochi\n= stacked rice-cake decoration','= 重ねたおもちのお飾り','tag',.42,{x:.5}]],sx:[[0,'ding']]},
 {d:5,bg:B2P,dots:0,tr:'flash',a:[['babies_0',.5,.86,.24,'bob']],tx:[[0,5,'年賀状','年賀状','big',.3,{s:1.25}],[1,5,'nengajō\n= New Year greeting card','= 新年のあいさつのはがき','tag',.42,{x:.5}]],sx:[[0,'ding']]},
 {d:4,bg:'living',tr:'zoom',a:[['c_pinco_4',.35,.9,.42,'hop'],['babies_0',.76,.9,.2,'hop']],fx:[['confetti',0,4]],tx:[[0,4,'which one is your kid’s favorite?','お子さんのお気に入りはどれ？','tag',.2]],sx:[[0,'cheer']]}
]},
// pa08 DAY IN THE LIFE (timestamps): dad + Baby Bean
{id:'pa08',cat:'parent',bb:1,by:'pooping',song:'lofi',seed:5206,bpm:88,likes:226000,cm:8700,look:'film',
 cap:['a realistic day with a 6-month-old pea 🫛⏰ #dayinthelife #dadlife #babybean','6か月のさやえんどうとのリアルな1日🫛⏰ #パパの日常 #ベビービーン'],
 snd:['Clockwork Pea','時計じかけのさや'],
 com:[['pinco','“10:15 nap (planned)” 😭','「10:15 昼寝（予定）」😭'],['pooh','the coffee at 15:40 is the real hero','15:40のコーヒーが本当の主役']],
 shots:[
 {d:5,bg:'bedtime',a:[['pooping_parent_1',.5,.9,.46,'talk']],tx:[[0,5,'05:52 · he is awake. so I am awake.','05:52・彼が起きた。なので私も起きた。','cap',.2,{wps:3}]],sx:[[0,'ding']]},
 {d:5,bg:'kitchen',tr:'whip',a:[['p_bottle',.5,.6,.14,'float',{sh:0}],['bbean_0',.5,.86,.26,'idle']],tx:[[0,5,'07:00 · bottle. burp. outfit change #1.','07:00・ミルク。げっぷ。着替え1回目。','cap',.2,{wps:3}]],sx:[[0,'pop']]},
 {d:5,bg:'nursery',tr:'whip',a:[['bbean_2',.5,.84,.3,'bob']],fx:[['zzz',0,5,{x:.58,y:.5}]],tx:[[0,5,'10:15 · nap (planned) · 10:22 · nap (actual)','10:15・昼寝（予定）・10:22・昼寝（実際）','cap',.2,{wps:3}]],sx:[[0,'yawn']]},
 {d:5,bg:'park',tr:'whip',a:[['pooping_parent_0',.38,.9,.44,'bob'],['bbean_1',.74,.84,.24,'hop']],tx:[[0,5,'13:30 · park. he stared at one leaf for 20 min.','13:30・公園。葉っぱ1枚を20分見てた。','cap',.2,{wps:3}]],sx:[[0,'chime']]},
 {d:5,bg:'cafe',tr:'whip',a:[['p_mug',.5,.62,.14,'float',{sh:0}]],fx:[['steam',0,5,{x:.5,y:.52}]],tx:[[0,5,'15:40 · coffee #3 (cold, as usual)','15:40・コーヒー3杯目（いつも通り冷めてる）','cap',.2,{wps:3}]],sx:[[0,'pour']]},
 {d:6,bg:'bedtime',tr:'zoom',a:[['pooping_parent_2',.35,.9,.42,'bob'],['bbean_2',.72,.84,.26,'bob']],fx:[['stars',0,6],['zzz',0,6,{x:.75,y:.5}]],tx:[[0,6,'19:30 · asleep. I miss him already.','19:30・寝た。もう会いたい。','cap',.2,{wps:3}]],sx:[[0,'aww']]}
]},
// pa09 CLAY: first winter with a baby, things nobody tells you
{id:'pa09',cat:'parent',also:['comedy'],by:'pooh',song:'clay',seed:5207,bpm:112,likes:158000,cm:6100,look:'clay',
 cap:['first winter with a baby: things nobody tells you ❄️👶 #parenting #firstwinter','赤ちゃんと初めての冬、誰も教えてくれないこと❄️👶 #子育て #はじめての冬'],
 snd:['Clay Snow Day','ねんどの雪の日'],
 com:[['pooping','the mitten one is SO real','ミトンのやつ本当にそれ'],['max','I also lose mittens 🐶','私もミトンなくす🐶']],
 shots:[
 {d:4,bg:'park',a:[['c_pooh_1',.5,.9,.46,'bob',{in:'pop'}]],fx:[['snow',0,4,{n:30}]],tx:[[0,4,'first winter with a baby: nobody tells you…','赤ちゃんと初めての冬、誰も教えてくれない…','big',.18]],sx:[[0,'pop']]},
 {d:5,bg:B2B,dots:0,tr:'spin',a:[['p_mittens',.5,.6,.16,'float',{sh:0}]],tx:[[0,5,'1. mittens are removed in 4 seconds','1. ミトンは4秒で外される','pill',.22]],sx:[[0,'boing']]},
 {d:5,bg:B2B,dots:0,tr:'spin',a:[['p_onesie',.5,.6,.16,'float',{sh:0}]],tx:[[0,5,'2. getting dressed to go out takes longer than going out','2. 出かける準備が、お出かけより長い','pill',.22,{s:.9}]],sx:[[0,'boing']]},
 {d:5,bg:B2B,dots:0,tr:'spin',a:[['p_snowflake',.5,.6,.16,'float',{sh:0}]],tx:[[0,5,'3. their first snowflake is your favorite day','3. 初めての雪の日が、最高の思い出になる','pill',.22,{s:.9}]],sx:[[0,'chime']]},
 {d:5,bg:'park',tr:'zoom',a:[['c_pooh_2',.32,.9,.42,'shake'],['babies_0',.75,.9,.22,'hop']],fx:[['snow',0,5,{n:40}],['hearts',0,5,{x:.72,y:.6,n:5}]],tx:[[0,5,'stay warm, everyone ☃️','みんな、あったかくしてね ☃️','big',.2]],sx:[[0,'aww']]}
]},
// bb19 SPLIT SCREEN playdate: Baby Bean x Baby Pinco
{id:'bb19',cat:'parent',also:['comedy'],bb:1,by:'pinco',song:'sweet',seed:5208,bpm:104,likes:247000,cm:9800,
 cap:['first playdate: Baby Bean x Baby Pinco 🫛🩷 what the parents saw vs what happened #babybean #playdate','初めての公園デート：ベビービーン×ベビーピンコ🫛🩷 親が見たもの vs 実際 #ベビービーン'],
 snd:['Tiny Besties','ちいさな親友'],
 com:[['pooping','they are best friends now. we did nothing.','もう親友。親は何もしてない。'],['bean','I approve this friendship','この友情を認めます']],
 shots:[
 {d:5,bg:'park',a:[['c_pinco_0',.33,.9,.44,'bob'],['pooping_parent_0',.72,.9,.44,'bob']],tx:[[0,5,'first playdate 🫛🩷','はじめての公園デート 🫛🩷','big',.17]],sx:[[0,'pop']]},
 {d:9,bg:'#111/#222',dots:0,tr:'wipe',panes:[{r:[0,0,.5,1],bg:'park',a:[['babies_0',.5,.86,.3,'idle']],tx:[[0,9,'BABY PINCO','ベビーピンコ','pill',.15],[2,9,'*stares*','＊じーっ＊','tag',.3,{x:.5}]]},{r:[.5,0,.5,1],bg:'park',a:[['bbean_0',.5,.84,.3,'idle']],tx:[[0,9,'BABY BEAN','ベビービーン','pill',.15],[4,9,'*stares back*','＊じーっ＊','tag',.3,{x:.5}]]}],sx:[[0,'swish'],[2,'tick'],[4,'tick']]},
 {d:5,bg:'park',tr:'flash',a:[['babies_0',.3,.88,.24,'hop'],['bbean_1',.7,.84,.24,'hop']],fx:[['hearts',0,5,{n:10}],['emoji',.5,5,{e:'🤝',x:.5,y:.5,n:3}]],tx:[[0,5,'…best friends. 4 minutes.','…親友に。4分で。','cap',.2,{wps:3}]],sx:[[0,'giggle']]},
 {d:5,bg:'park',tr:'zoom',a:[['babies_0',.3,.88,.24,'bob'],['bbean_2',.7,.84,.24,'bob']],fx:[['zzz',0,5,{x:.72,y:.52}],['sparkle',0,5]],tx:[[0,5,'(then naps, together)','（そして一緒にお昼寝）','cap',.2,{wps:3}]],sx:[[0,'aww']]}
]}
);
