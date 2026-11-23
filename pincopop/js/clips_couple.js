'use strict';
// COUPLES clips (times in beats): Asmon (ex-villain who joined the heroes) and Kaise, his kind, witty girlfriend.
// Affectionate parody only: comedy (stream o'clock, tier lists, chores, date night) + everyday relationship advice.
window.CLIPS=window.CLIPS||[];
const KBG='#fff0f6/#efe4ff';
CLIPS.push(
{id:'k01',cat:'couple',by:'asmon',song:'comedy',seed:1001,bpm:104,likes:121000,cm:4800,
 cap:['Asked him the time. Every answer was the same ⌚ #couples #streamoclock','時間を聞いたら、答えはいつも同じ⌚ #カップル #配信の時間'],
 snd:["Stream O'Clock",'配信の時間'],
 com:[['kaise','I gave him that watch for DATE o’clock 😤💕','あの時計、デートの時間のためにあげたんだけど😤💕'],['pooh','what time is it now? (stream o’clock)','いま何時？（配信の時間）']],
 shots:[
 {d:5,bg:'stream',a:[['asmon_couple_0',.32,.88,.44,'bob',{in:'l'}],['kaise_1',.72,.88,.44,'idle',{in:'r'}]],tx:[[0,5,'POV: you ask him the time ⌚','POV：彼に時間を聞くと ⌚','big',.17]],sx:[[0,'pop']]},
 {d:6,bg:'stream',tr:'cut',a:[['asmon_couple_0',.32,.88,.44,'idle'],['kaise_0',.72,.88,.44,'bob']],tx:[[0,3,'Babe, what time is it?','ねえ、いま何時？','bub',.3,{x:.64,tx:.72,ty:.46,who:'kaise'}],[3,6,'Stream o’clock.','配信の時間。','bub',.3,{x:.36,tx:.32,ty:.46,who:'asmon'}]],sx:[[3,'tick']]},
 {d:6,bg:'stream',tr:'whip',a:[['c_asmon_1',.5,.9,.36,'hop']],tx:[[0,6,'3 pm: stream o’clock','15時：配信の時間','pill',.2],[1.5,6,'9 pm: stream o’clock','21時：配信の時間','pill',.3],[3,6,'3 am: stream o’clock','深夜3時：配信の時間','pill',.4]],sx:[[0,'tick'],[1.5,'tick'],[3,'tick']]},
 {d:7,bg:'stream',tr:'cut',a:[['c_asmon_0',.3,.88,.42,'idle',{sw:[[3,'c_asmon_3']]}],['kaise_5',.72,.88,.44,'nod']],tx:[[0,7,'The watch I gave you shows OTHER hours too 😌','あげた時計、ほかの時間もあるんだけど😌','bub',.28,{x:.62,tx:.72,ty:.46,who:'kaise'}]],sx:[[3,'boing']]},
 {d:6,bg:'stream',tr:'zoom',a:[['asmon_couple_2',.32,.88,.44,'bob'],['kaise_3',.72,.88,.44,'hop']],fx:[['hearts',.5,6,{x:.5,y:.5,n:10}]],tx:[[0,6,'new time unlocked: date o’clock 💕','新しい時間を解放：デートの時間 💕','big',.18]],sx:[[0,'aww']]}
]},
{id:'k02',cat:'couple',by:'kaise',song:'comedy',seed:1002,bpm:106,likes:143000,cm:6100,
 cap:['Couple fast food tier list 📋🍟 the fries debate got serious #tierlist #couples','カップルでファストフード格付け📋🍟 ポテト論争が本気に #格付け #カップル'],
 snd:['S Tier Snacks','Sランクおやつ'],
 com:[['asmon','I have been corrected. Fries are S.','訂正された。ポテトはS。'],['bean','where is the pea pod on this list','このリストにさやえんどうは？']],
 shots:[
 {d:5,bg:'stream',a:[['kaise_2',.5,.88,.48,'bob',{in:'pop'}]],tx:[[0,5,'Couple fast food tier list 📋','カップルでファストフード格付け 📋','big',.17]],sx:[[0,'pop']]},
 {d:7,bg:KBG,tr:'whip',a:[['p_tier',.3,.74,.2,'float',{in:'pop',sh:0}],['p_fries',.72,.74,.18,'pulse',{in:'pop',sh:0}]],tx:[[0,7,'Fries: S tier. Non-negotiable.','ポテト：Sランク。異論は認めない。','pill',.2],[2,7,'S','S','stamp',.42,{x:.72}]],sx:[[0,'pop'],[2,'ding']]},
 {d:7,bg:'stream',tr:'cut',a:[['c_asmon_5',.3,.88,.42,'talk'],['kaise_1',.72,.88,.44,'idle']],fx:[['cross',2.5,7,{x:.3,y:.36}]],tx:[[0,7,'Fries are B tier.','ポテトはBランクだろ。','bub',.3,{x:.36,tx:.3,ty:.46,who:'asmon'}],[2.5,7,'(the room goes silent)','（静まりかえる部屋）','tag',.44]],sx:[[0,'pop'],[2.5,'crickets']]},
 {d:7,bg:'stream',tr:'cut',a:[['c_asmon_3',.3,.88,.42,'tremble'],['kaise_4',.72,.88,.44,'bob']],tx:[[0,7,'Interesting. So who’s sharing my fries tonight?','へえ。じゃあ今夜、私のポテトは誰が食べるの？','bub',.28,{x:.62,tx:.72,ty:.46,who:'kaise'}]],sx:[[0,'giggle']]},
 {d:6,bg:'stream',tr:'zoom',a:[['c_asmon_1',.3,.88,.42,'hop'],['kaise_3',.72,.88,.44,'hop']],fx:[['confetti',0,6,{n:36}]],tx:[[0,6,'Fries: S tier (unanimous) 🍟','ポテト：Sランク（全会一致）🍟','big',.18],[1.5,6,'tip: disagree with a laugh, not a fight','コツ：ケンカより、笑って意見を言い合う','tag',.3]],sx:[[0,'cheer']]}
]},
{id:'k03',cat:'couple',by:'asmon',song:'villain',seed:1003,bpm:100,likes:98700,cm:3300,
 cap:['Ex-villain’s new evil plan: doing the chores 🧽 + 3 tips for sharing them #couples #chores','元悪役の新たな野望：家事🧽 分担のコツ3つ #カップル #家事分担'],
 snd:['Evil Dishes Overture','悪の皿洗い序曲'],
 com:[['kaise','the yellow gloves are a whole look 💛','黄色い手袋、似合いすぎ💛'],['pooping','"own it, don’t help" — dad agrees','「手伝うじゃなく担当」パパも同意']],
 shots:[
 {d:5,bg:'kitchen',a:[['asmon_couple_1',.5,.88,.48,'bob',{in:'pop'}]],fx:[['flash',0,.6,{c:'#b9a6ff',a:.5}]],tx:[[0,5,'Ex-villain’s new evil plan: chores 🧽','元悪役の新たな野望：家事 🧽','big',.17]],sx:[[0,'evil']]},
 {d:7,bg:'kitchen',tr:'whip',a:[['asmon_couple_1',.3,.88,.42,'shake'],['kaise_0',.72,.88,.44,'idle']],fx:[['sparkle',1,7,{x:.3,y:.6,r:.15}]],tx:[[0,7,'MWAHAHA. The dishes… are DONE.','ムハハハ。皿洗い…完了だ。','bub',.3,{x:.38,tx:.3,ty:.46,who:'asmon'}]],sx:[[0,'evil'],[1,'sparkle']]},
 {d:9,bg:KBG,tr:'whip',a:[['p_heart',.5,.88,.1,'pulse',{sh:0}]],tx:[[0,9,'sharing chores, 3 tips:','家事分担のコツ3つ：','pill',.18],[1.2,9,'1. make the list together','① いっしょにリストにする','tag',.28],[2.8,9,'2. trade the jobs you hate for ones you don’t mind','② 苦手な家事と平気な家事を交換','tag',.38],[4.4,9,'3. don’t "help" — own it','③「手伝う」じゃなく「自分の担当」に','tag',.48]],sx:[[1.2,'tick'],[2.8,'tick'],[4.4,'tick']]},
 {d:6,bg:'kitchen',tr:'zoom',a:[['asmon_couple_1',.3,.88,.42,'bob'],['kaise_3',.72,.88,.44,'hop']],fx:[['hearts',0,6,{x:.5,y:.5,n:8}]],tx:[[0,6,'Best villain arc ever 😍','史上いちばん素敵な悪役の改心😍','bub',.3,{x:.62,tx:.72,ty:.46,who:'kaise'}]],sx:[[0,'aww']]}
]},
{id:'k04',cat:'couple',by:'kaise',song:'sweet',seed:1004,bpm:96,likes:88100,cm:2600,
 cap:['Date night rule #1: phones away 📵 quality time = full attention #datenight #couples','デートの夜ルール①：スマホはしまう📵 #デート #カップル'],
 snd:['Phones Down Slow Jam','スマホ置いてスロージャム'],
 com:[['asmon','2 hours. no stats. I am a changed man.','2時間、数字見なかった。俺は変わった。'],['pinco','stealing the question idea 💕','質問のアイデアもらう💕']],
 shots:[
 {d:5,bg:'sushi',a:[['kaise_0',.5,.88,.48,'bob',{in:'pop'}]],tx:[[0,5,'Date night rule #1 📵','デートの夜ルール① 📵','big',.17]],sx:[[0,'pop']]},
 {d:7,bg:KBG,tr:'whip',a:[['p_phone',.5,.82,.14,'tremble',{in:'pop',sh:0}]],fx:[['cross',1,7,{x:.5,y:.66}]],tx:[[0,7,'phones face-down (or in a bag)','スマホは伏せる（かバッグへ）','pill',.2],[1.8,7,'quality time = full attention','大事な時間は、ちゃんと向き合う','tag',.32]],sx:[[1,'buzz'],[1.8,'ding']]},
 {d:7,bg:'sushi',tr:'cut',a:[['asmon_couple_0',.3,.88,.42,'idle',{sw:[[3,'c_asmon_3']]}],['kaise_5',.72,.88,.44,'nod']],tx:[[0,7,'No checking stream stats 👀','配信の数字チェックも禁止 👀','bub',.3,{x:.62,tx:.72,ty:.46,who:'kaise'}]],sx:[[3,'boing']]},
 {d:7,bg:KBG,tr:'whip',a:[['p_heart',.5,.86,.12,'pulse',{sh:0}]],tx:[[0,7,'ask a fun question:','たのしい質問をしてみる：','pill',.2],[1.5,7,'"What made you smile this week?"','「今週いちばん笑ったことは？」','tag',.32]],sx:[[0,'pop'],[1.5,'chime']]},
 {d:6,bg:'sushi',tr:'zoom',a:[['c_asmon_1',.3,.88,.42,'hop'],['kaise_3',.72,.88,.44,'hop']],fx:[['hearts',0,6,{x:.5,y:.5,n:10}]],tx:[[0,6,'he lasted 2 hours. new record 💕','2時間がまん成功。新記録 💕','big',.18]],sx:[[0,'cheer']]}
]},
{id:'k05',cat:'couple',by:'asmon',song:'sweet',seed:1005,bpm:94,likes:92400,cm:3000,
 cap:['How to apologize (ex-villain edition) 💐 name it, no "but", fix it #couples #relationshiptips','上手なあやまり方（元悪役版）💐 #カップル #恋愛アドバイス'],
 snd:['Sorry Not Sorry (Actually Sorry)','ほんとにごめんのうた'],
 com:[['kaise','the alarm worked. he was on time 🥹','アラーム効いた。時間どおりに来た🥹'],['prof','Specific apologies are more effective. Correct.','具体的な謝罪の方が効果的。正解。']],
 shots:[
 {d:5,bg:'living',a:[['asmon_couple_2',.5,.88,.48,'bob',{in:'pop'}]],tx:[[0,5,'How to apologize (ex-villain edition) 💐','上手なあやまり方（元悪役版）💐','big',.17]],sx:[[0,'pop']]},
 {d:7,bg:KBG,tr:'whip',a:[['c_asmon_0',.5,.9,.3,'nod']],tx:[[0,7,'1. say exactly what you did','① 何をしたか具体的に言う','pill',.2],[1.5,7,'"I’m sorry I was late for dinner."','「夕飯に遅れてごめん」','tag',.32]],sx:[[0,'tick'],[1.5,'pop']]},
 {d:7,bg:KBG,tr:'cut',a:[['c_asmon_3',.5,.9,.3,'tremble']],fx:[['cross',1,7,{x:.5,y:.42}]],tx:[[0,7,'2. no "but…"','② 「でも…」はつけない','pill',.2],[1.5,7,'"sorry, but the stream ran long" ❌','「ごめん、でも配信が長引いて」❌','tag',.3]],sx:[[0,'tick'],[1,'buzz']]},
 {d:7,bg:KBG,tr:'cut',a:[['asmon_couple_0',.5,.9,.3,'bob']],tx:[[0,7,'3. say how you’ll fix it','③ どう直すかを伝える','pill',.2],[1.5,7,'"I set an alarm on the watch you gave me."','「もらった時計にアラームをセットした」','tag',.32]],sx:[[0,'tick'],[1.5,'ding']]},
 {d:6,bg:'living',tr:'zoom',a:[['asmon_couple_2',.3,.88,.42,'bob'],['kaise_3',.72,.88,.44,'hop']],fx:[['hearts',.5,6,{x:.5,y:.5,n:8}]],tx:[[0,6,'Apology accepted. The flowers helped 🌸','許す。お花も効いた 🌸','bub',.28,{x:.62,tx:.72,ty:.46,who:'kaise'}],[1.5,6,'flowers optional, changes required','お花は任意、行動は必須','tag',.44]],sx:[[0,'aww']]}
]},
{id:'k06',cat:'couple',by:'kaise',song:'sweet',seed:1006,bpm:96,likes:79300,cm:2200,
 cap:['Talk like a team 🗣️💕 "I feel ___ when ___" + listen to understand #communication #couples','チームみたいに話そう🗣️💕 気持ちの伝え方と聞き方 #カップル #恋愛アドバイス'],
 snd:['Team Talk','チームトーク'],
 com:[['asmon','the 3 am goodnight text is now scheduled','深夜3時のおやすみメッセージ、予約済み'],['pooping','"so you mean…" saves marriages','「つまり〜ってこと？」は夫婦を救う']],
 shots:[
 {d:5,bg:'park',a:[['kaise_0',.5,.88,.48,'bob',{in:'pop'}]],tx:[[0,5,'Talk like a team 🗣️💕','チームみたいに話そう 🗣️💕','big',.17]],sx:[[0,'pop']]},
 {d:7,bg:KBG,tr:'whip',a:[['kaise_1',.5,.9,.3,'nod']],tx:[[0,7,'try "I feel ___ when ___"','「〜のとき、〜な気持ちになる」と伝える','pill',.2],[1.8,7,'"I feel lonely when streams run really late."','「配信がすごく長引くと、さみしいな」','tag',.32]],sx:[[0,'pop'],[1.8,'aww']]},
 {d:7,bg:'park',tr:'cut',a:[['c_asmon_0',.5,.9,.34,'nod']],tx:[[0,7,'listen to understand, not to win','勝つためじゃなく、わかるために聞く','pill',.2]],sx:[[0,'chime']]},
 {d:8,bg:'park',tr:'whip',a:[['c_asmon_5',.3,.88,.42,'talk'],['kaise_3',.72,.88,.44,'idle',{sw:[[4,'kaise_0']]}]],tx:[[0,8,'repeat it back: "So you mean…?"','「つまり〜ってこと？」と確かめる','pill',.18],[1.5,8,'So… a goodnight text, even at 3 am?','つまり…深夜3時でもおやすみメッセージ？','bub',.32,{x:.38,tx:.3,ty:.46,who:'asmon'}],[4,8,'Exactly 💕','そういうこと💕','bub',.44,{x:.72,tx:.72,ty:.5,who:'kaise'}]],sx:[[1.5,'pop'],[4,'aww']]},
 {d:5,bg:'park',tr:'zoom',a:[['c_asmon_1',.3,.88,.42,'hop'],['kaise_0',.72,.88,.44,'bob']],fx:[['hearts',0,5,{x:.5,y:.5,n:8}]],tx:[[0,5,'teammates, not opponents 🤝','敵じゃなくて、チームメイト 🤝','big',.18]],sx:[[0,'cheer']]}
]},
{id:'k07',cat:'couple',by:'asmon',song:'villain',seed:1007,bpm:100,likes:110000,cm:3900,
 cap:['Villain monologue vs one simple question 😈🍔 #couples #exvillain','悪役の演説 vs ひとつの質問😈🍔 #カップル #元悪役'],
 snd:['Monologue Interrupted','中断された演説'],
 com:[['kaise','he had not eaten. as suspected.','やっぱり食べてなかった。'],['max','snack arc is the best arc 🐶','おやつ編がいちばん🐶']],
 shots:[
 {d:5,bg:'lair',a:[['c_asmon_5',.5,.9,.5,'nod',{in:'pop'}]],fx:[['flash',1,1.6,{c:'#b9a6ff',a:.6}]],tx:[[0,5,'When the ex-villain gets dramatic 😈','元悪役がドラマチックになると 😈','big',.17]],sx:[[0,'evil'],[1,'thunder']]},
 {d:7,bg:'lair',tr:'cut',cam:[1,1.12,.5,.5,.5,.45],a:[['c_asmon_5',.5,.9,.56,'shake']],tx:[[0,7,'I shall conquer the WORLD… right after this stream!','世界を征服してやる…この配信のあとでな！','bub',.24,{x:.5,tx:.5,ty:.34,who:'asmon'}]],sx:[[0,'evil']]},
 {d:6,bg:'lair',tr:'whip',a:[['kaise_4',.5,.88,.48,'bob',{in:'r'}]],tx:[[0,6,'Did you eat today?','今日ちゃんと食べた？','bub',.28,{x:.5,tx:.5,ty:.44,who:'kaise'}]],sx:[[0,'pop']]},
 {d:6,bg:'lair',tr:'cut',cam:[1.2,1.25,.5,.42,.5,.42],a:[['c_asmon_3',.5,.9,.5,'tremble']],tx:[[1,6,'…no.','…食べてない。','big',.2]],sx:[[1,'crickets']]},
 {d:6,bg:'lair',tr:'zoom',a:[['c_asmon_4',.3,.88,.42,'bob'],['kaise_3',.72,.88,.44,'hop']],fx:[['hearts',0,6,{x:.5,y:.5,n:8}]],tx:[[0,6,'villain arc paused. snack arc begins 🍔','悪役編は休止。おやつ編スタート 🍔','big',.18]],sx:[[0,'chomp'],[.5,'aww']]}
]},
{id:'k08',cat:'couple',by:'kaise',song:'comedy',seed:1008,bpm:108,likes:95600,cm:3100,
 cap:['Couples game night 🎮 10,000 hours of practice vs. her first try #gamenight #couples','カップルでゲームナイト🎮 1万時間の経験 vs 彼女の初プレイ #カップル'],
 snd:['GG Rematch','GG・もう一回'],
 com:[['asmon','I demand a rematch. Respectfully.','再戦を要求する。敬意をこめて。'],['bronny','good sport energy 🙌','いい負けっぷり🙌']],
 shots:[
 {d:5,bg:'stream',a:[['kaise_1',.5,.88,.48,'bob',{in:'pop'}],['p_pad',.5,.6,.1,'float',{sh:0}]],tx:[[0,5,'Couples game night 🎮','カップルでゲームナイト 🎮','big',.17]],sx:[[0,'pop']]},
 {d:6,bg:'stream',tr:'whip',a:[['c_asmon_1',.5,.9,.48,'hop']],tx:[[0,6,'I’ve played this for 10,000 hours.','このゲーム、1万時間やってる。','bub',.28,{x:.5,tx:.5,ty:.44,who:'asmon'}]],sx:[[0,'pop']]},
 {d:5,bg:'stream',tr:'flash',a:[['c_asmon_3',.3,.88,.42,'tremble'],['kaise_3',.72,.88,.44,'hop']],fx:[['stars',0,5,{x:.5,y:.4}]],tx:[[0,5,'K.O.','K.O.','stamp',.22]],sx:[[0,'bonk'],[.5,'giggle']]},
 {d:7,bg:'stream',tr:'cut',a:[['c_asmon_0',.3,.88,.42,'nod'],['kaise_0',.72,.88,.44,'bob']],tx:[[0,7,'GG! Rematch? 😇','GG！もう一回やる？😇','bub',.28,{x:.66,tx:.72,ty:.46,who:'kaise'}],[2.5,7,'GG… you’re amazing.','GG…すごいな。','bub',.4,{x:.34,tx:.3,ty:.5,who:'asmon'}]],sx:[[0,'pop'],[2.5,'aww']]},
 {d:5,bg:KBG,tr:'zoom',a:[['p_pad',.5,.84,.14,'pulse',{sh:0}]],tx:[[0,5,'good sport > good score','スコアより、いい負けっぷり','pill',.2],[1.2,5,'cheer each other on 📣','おたがいを応援しよう 📣','tag',.32]],sx:[[0,'chime']]}
]},
{id:'k09',cat:'couple',by:'kaise',song:'sweet',seed:1009,bpm:94,likes:76800,cm:2000,
 cap:['Say thank you for the small stuff 🙏 it adds up #gratitude #couples','小さなことにも「ありがとう」🙏 積み重ねが大事 #カップル #恋愛アドバイス'],
 snd:['Little Thank Yous','ちいさなありがとう'],
 com:[['asmon','I checked the watch 40 times writing this comment','このコメント書く間に時計を40回見た'],['pinco','thank you for this video 💕','この動画にありがとう💕']],
 shots:[
 {d:5,bg:'living',a:[['kaise_0',.5,.88,.48,'bob',{in:'pop'}]],tx:[[0,5,'Say thank you for the small stuff 🙏','小さなことにも「ありがとう」🙏','big',.17]],sx:[[0,'pop']]},
 {d:9,bg:KBG,tr:'whip',a:[['p_heart',.5,.88,.1,'pulse',{sh:0}]],tx:[[0,9,'• thanks for doing the dishes','・皿洗いしてくれてありがとう','tag',.22],[1.6,9,'• thanks for waiting for me','・待っててくれてありがとう','tag',.32],[3.2,9,'• thanks for remembering','・覚えててくれてありがとう','tag',.42]],sx:[[0,'tick'],[1.6,'tick'],[3.2,'tick']]},
 {d:7,bg:'living',tr:'cut',a:[['c_asmon_1',.5,.9,.34,'hop']],tx:[[0,7,'notice it, name it, say it out loud','気づいて、言葉にして、声に出す','pill',.2]],sx:[[0,'chime']]},
 {d:6,bg:'living',tr:'zoom',a:[['asmon_couple_0',.3,.88,.42,'bob'],['kaise_3',.72,.88,.44,'hop']],fx:[['hearts',0,6,{x:.5,y:.5,n:8}]],tx:[[0,6,'Thanks for the watch. I check it… constantly.','時計ありがとう。…ずっと見てる。','bub',.28,{x:.38,tx:.3,ty:.46,who:'asmon'}]],sx:[[0,'aww']]}
]},
{id:'k10',cat:'couple',by:'asmon',song:'comedy',seed:1010,bpm:100,likes:132000,cm:5200,
 cap:['Made HER a tier list for once 📋💕 #tierlist #couples','今回は俺が彼女のために格付け📋💕 #格付け #カップル'],
 snd:['All S Tier','全部Sランク'],
 com:[['kaise','okay I cried 😭','泣いた😭'],['party','S TIER COUPLE 🎉','Sランクカップル🎉']],
 shots:[
 {d:5,bg:'stream',a:[['c_asmon_0',.5,.9,.5,'bob',{in:'pop'}]],tx:[[0,5,'Making HER a tier list for once 📋💕','今回は俺が彼女のために格付け 📋💕','big',.17]],sx:[[0,'pop']]},
 {d:8,bg:KBG,tr:'whip',a:[['p_tier',.5,.86,.16,'float',{sh:0}]],tx:[[0,8,'Reasons I love her','彼女の好きなところ','pill',.18],[1.2,8,'her laugh: S','笑い声：S','tag',.28],[2.4,8,'her tier lists: S','格付けセンス：S','tag',.37],[3.6,8,'the watch: S','時計のプレゼント：S','tag',.46]],sx:[[1.2,'ding'],[2.4,'ding'],[3.6,'ding']]},
 {d:6,bg:'stream',tr:'cut',a:[['c_asmon_5',.5,.9,.44,'talk']],tx:[[0,6,'B tier: …','Bランク：…','pill',.2],[2,6,'(there is no B tier)','（Bランクは存在しない）','bub',.32,{x:.5,tx:.5,ty:.46,who:'asmon'}]],sx:[[0,'crickets'],[2,'boing']]},
 {d:7,bg:'stream',tr:'zoom',a:[['asmon_couple_2',.3,.88,.42,'bob'],['kaise_3',.72,.88,.44,'hop']],fx:[['hearts',0,7,{x:.5,y:.5,n:12}],['confetti',.5,7,{n:30}]],tx:[[0,7,'Okay, that’s actually S tier 😭','これは本当にSランクだよ😭','bub',.28,{x:.62,tx:.72,ty:.46,who:'kaise'}]],sx:[[0,'aww'],[.5,'cheer']]}
]}
);
