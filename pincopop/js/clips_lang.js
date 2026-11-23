'use strict';
// LANGUAGE clips (times in beats). Lesson phrases are shown in BOTH languages whatever the UI language;
// explanations follow the UI language. l01-l06: Japanese-speaking teachers, English for Japanese viewers.
// l07-l12: English-speaking teachers, Japanese (kana + romaji) for English viewers.
window.CLIPS=window.CLIPS||[];
// bilingual lesson line: same text whatever the UI language
function LB(t0,t1,str,st,y,o){return [t0,t1,str,str,st,y,o]}
const LBG='#eef6ff/#dcecff';
CLIPS.push(
// ---------- English for Japanese viewers ----------
{id:'l01',cat:'lng',by:'prof',song:'sweet',seed:801,bpm:100,likes:64300,cm:1500,
 cap:['English at the café ☕ 3 phrases you will actually hear #English #learnenglish','カフェで使える英語☕ 本当によく聞く3フレーズ #英会話 #英語'],
 snd:['Latte Lesson','ラテ・レッスン'],
 com:[['pooh','I say "for here" and then take it to go anyway','「For here」って言って結局持って帰る'],['bean','"I would like to purchase" is my whole personality','「I would like to purchase」がぼくの全て']],
 shots:[
 {d:5,bg:'cafe',a:[['c_prof_1',.5,.88,.46,'talk',{in:'pop'}]],tx:[[0,5,'English at the café ☕','カフェで英語 ☕','big',.17],[1,5,'with Professor Pooping','プーピング教授の英会話','pillk',.31]],sx:[[0,'chime'],[1,'pop']]},
 {d:7,bg:'cafe',blur:1,tr:'whip',a:[['p_cup',.5,.84,.2,'float',{in:'pop',sh:0}]],tx:[LB(0,7,'Can I get a latte, please?\nラテをお願いします','pill',.2),[1.5,7,'"Can I get…?" = casual but polite','「Can I get…?」はカジュアルで丁寧','tag',.34]],sx:[[0,'pop'],[1.5,'ding']]},
 {d:7,bg:'cafe',tr:'cut',a:[['c_pooh_1',.3,.88,.38,'bob'],['c_prof_0',.72,.88,.38,'idle',{sw:[[3,'c_prof_1']]}]],tx:[LB(0,3.2,'For here or to go?\n店内ですか？お持ち帰りですか？','bub',.3,{x:.36,tx:.3,ty:.5,who:'pooh'}),LB(3.2,7,'To go, please!\n持ち帰りでお願いします','bub',.3,{x:.64,tx:.72,ty:.5,who:'prof'})],sx:[[3.2,'pop']]},
 {d:6,bg:'cafe',tr:'whip',a:[['c_bean_0',.5,.88,.42,'shake']],fx:[['sweat',1,6,{x:.58,y:.52}]],tx:[LB(0,6,'I would like to purchase one coffee.\nコーヒーを1杯購入したいのですが','bub',.28,{x:.5,tx:.5,ty:.48,who:'bean'}),[2,6,'correct… but very formal 😅','正しいけど、かなりかたい 😅','tag',.44]],sx:[[2,'boing']]},
 {d:5,bg:'cafe',tr:'zoom',a:[['c_prof_0',.5,.88,.44,'nod']],fx:[['check',.5,5,{x:.5,y:.42}],['sparkle',0,5,{x:.5,y:.5,r:.25}]],tx:[LB(0,5,'Thanks! Have a good one!\nありがとう！よい一日を！','pill',.2),[1.5,5,'say it with a smile 😊','笑顔で言えば完璧 😊','tag',.32]],sx:[[.5,'ding']]}
]},
{id:'l02',cat:'lng',by:'mogu',song:'comedy',seed:802,bpm:104,likes:51800,cm:1200,
 cap:['Train English 🚃 ask, transfer, get off #English #tokyotrain','電車で使える英語🚃 聞く・乗り換える・降りる #英会話'],
 snd:['Next Stop Fluent','次はペラペラ駅'],
 com:[['bronny','"I\'m getting off!" saved me on the Yamanote','「I\'m getting off!」に山手線で救われた'],['prof','Platform numbers: always worth asking.','番線は聞いて損なし。']],
 shots:[
 {d:5,bg:'train',a:[['c_mogu_1',.5,.88,0.357,'hop',{in:'pop'}]],tx:[[0,5,'English on the train 🚃','電車で使える英語 🚃','big',.17]],sx:[[0,'pop']]},
 {d:7,bg:'train',blur:1,tr:'whip',a:[['p_ic',.5,.84,.13,'float',{in:'pop',sh:0}]],tx:[LB(0,7,'Does this train go to Shinjuku?\nこの電車は新宿に行きますか？','pill',.2),[1.5,7,'just swap in any station name','駅名を入れかえるだけ','tag',.34]],sx:[[0,'pop'],[1.5,'ding']]},
 {d:7,bg:'train',tr:'cut',a:[['c_mogu_3',.5,.88,0.34,'tremble']],tx:[LB(0,7,"What's the next stop?\n次の駅はどこですか？",'pill',.2),LB(1.8,7,'Where do I transfer?\nどこで乗り換えですか？','pillk',.33)],sx:[[0,'pop'],[1.8,'pop']]},
 {d:7,bg:'train',tr:'whip',cam:[1,1.1,.5,.6,.5,.6],a:[['c_bean_3',.22,.88,.34,'idle'],['c_mogu_5',.52,.88,0.306,'shake'],['c_pooping_0',.82,.88,.34,'idle']],tx:[LB(0,7,"Excuse me, I'm getting off!\nすみません、降ります！",'bub',.3,{x:.5,tx:.52,ty:.52,who:'mogu'}),[2,7,'works on crowded trains','満員電車でも使える','tag',.45]],sx:[[0,'squeak'],[2,'ding']]},
 {d:5,bg:'train',tr:'zoom',a:[['c_mogu_2',.5,.88,0.374,'dance']],fx:[['sparkle',0,5,{x:.5,y:.5,r:.25}]],tx:[[0,5,'next stop: fluent 😎','次は〜ペラペラ駅 😎','big',.18]],sx:[[0,'chime']]}
]},
{id:'l03',cat:'lng',by:'prof',song:'sweet',seed:803,bpm:98,likes:88900,cm:2700,
 cap:['"I\'m fine, thank you, and you?" — what people actually say 🗣️ #English #eikaiwa','「I\'m fine, thank you」以外の答え方🗣️ ネイティブがよく使う返事 #英会話'],
 snd:['Fine Thank You Funk','ファイン・サンキュー・ファンク'],
 com:[['bean','I have retired the robot answer','ロボット返事は引退しました'],['pinco','"Not bad!" is my go-to 💕','「Not bad!」よく使う💕']],
 shots:[
 {d:5,bg:'park',a:[['c_prof_0',.5,.88,.46,'talk',{in:'pop'}]],tx:[[0,5,'"How are you?" — real answers','「How are you?」リアルな答え方','big',.17]],sx:[[0,'chime']]},
 {d:7,bg:'park',tr:'whip',a:[['c_bean_0',.5,.88,.42,'idle']],tx:[LB(0,7,"I'm fine, thank you. And you?\n元気です、ありがとう。あなたは？",'bub',.28,{x:.5,tx:.5,ty:.48,who:'bean'}),[2,7,'textbook classic… a bit stiff 🤖','教科書の定番…ちょっとかため 🤖','tag',.44]],sx:[[2,'boing']]},
 {d:8,bg:LBG,tr:'whip',a:[['c_prof_1',.5,.9,.32,'nod']],tx:[LB(0,8,'Good, you?\nいいよ、そっちは？','pill',.2),LB(1.5,8,'Pretty good!\nけっこういい感じ！','pill',.32),LB(3,8,'Not bad!\n悪くないよ！','pill',.44)],sx:[[0,'pop'],[1.5,'pop'],[3,'pop']]},
 {d:7,bg:LBG,tr:'cut',a:[['c_pooh_3',.5,.9,.3,'bob']],tx:[LB(0,7,"How's it going?\n調子どう？",'pill',.2),LB(1.5,7,"What's up?\n最近どう？",'pillk',.32),[3,7,'"What\'s up?" → "Not much!"','「What\'s up?」には「Not much!（特に何も）」','tag',.44]],sx:[[0,'pop'],[1.5,'pop'],[3,'ding']]},
 {d:5,bg:'park',tr:'zoom',a:[['c_bean_1',.5,.88,.44,'bob']],fx:[['hearts',1,5,{x:.5,y:.5,n:6}]],tx:[LB(0,5,'Good, you? 😎\nいいよ、そっちは？','bub',.3,{x:.5,tx:.5,ty:.5,who:'bean'})],sx:[[0,'cheer']]}
]},
{id:'l04',cat:'lng',by:'mogu',song:'sweet',seed:804,bpm:96,likes:72100,cm:2100,
 cap:['Sweet English for couples 💕 asking out, missing someone, saying it back #English #couples','カップルの英語💕 誘う・会いたい・気持ちを伝える #英会話'],
 snd:['Love You Too (original)','ラブ・ユー・トゥー（オリジナル）'],
 com:[['pinco','"You mean a lot to me" 🥹','「You mean a lot to me」🥹'],['asmon','Sending this to Kaise. For research.','カイセに送る。研究のために。']],
 shots:[
 {d:5,bg:'promenade',a:[['c_mogu_4',.5,.88,0.374,'bob',{in:'pop'}]],fx:[['hearts',1,5,{x:.5,y:.5,n:6}]],tx:[[0,5,'English for couples 💕','カップルの英語 💕','big',.17]],sx:[[0,'aww']]},
 {d:7,bg:LBG,tr:'whip',a:[['p_heart',.5,.84,.14,'pulse',{in:'pop',sh:0}]],tx:[LB(0,7,'Are you free on Friday?\n金曜日、空いてる？','pill',.2),LB(1.8,7,'Want to grab dinner?\nご飯行かない？','pill',.33)],sx:[[0,'pop'],[1.8,'pop']]},
 {d:7,bg:'promenade',tr:'cut',a:[['c_mogu_0',.5,.88,.3,'sway']],tx:[LB(0,7,'I miss you.\n会いたいな／さみしいよ','pill',.2),[1.8,7,'"miss" = sad you can’t be together','「miss」は会えなくてさみしい気持ち','tag',.32]],sx:[[0,'aww'],[1.8,'ding']]},
 {d:7,bg:'promenade',tr:'whip',a:[['c_mogu_1',.3,.88,0.323,'bob'],['c_pinco_1',.72,.88,.42,'hop']],tx:[LB(0,7,'You mean a lot to me.\nあなたは私にとって大切な人','pill',.2),[1.8,7,'softer than "I love you" — still sweet','「I love you」よりやわらかいけど十分あまい','tag',.34]],sx:[[0,'pop'],[1.8,'aww']]},
 {d:5,bg:'promenade',tr:'zoom',a:[['c_mogu_4',.3,.88,0.323,'bob'],['c_pinco_5',.72,.88,.42,'dance']],fx:[['hearts',0,5,{x:.5,y:.5,n:10}]],tx:[LB(0,5,'Love you! ❤️  /  Love you too!\n大好き！／私も！','pill',.2)],sx:[[0,'kiss']]}
]},
{id:'l05',cat:'lng',by:'prof',song:'parent',seed:805,bpm:94,likes:58700,cm:1600,
 cap:['Baby & pregnancy English 👶 due date, diapers, baby shower #English #baby','赤ちゃん・妊娠の英語👶 予定日、おむつ、ベビーシャワー #英会話 #子育て'],
 snd:['Little Words Lullaby','ちいさな言葉のララバイ'],
 com:[['pooping','diaper vs nappy: the great debate','diaper派かnappy派か、それが問題だ'],['party','baby shower = my favorite party 🎉','ベビーシャワー＝いちばん好きなパーティー🎉']],
 shots:[
 {d:5,bg:'nursery',a:[['c_prof_0',.5,.88,.46,'talk',{in:'pop'}]],tx:[[0,5,'Baby & pregnancy English 👶','赤ちゃん・妊娠の英語 👶','big',.17]],sx:[[0,'chime']]},
 {d:8,bg:LBG,tr:'whip',a:[['p_onesie',.5,.86,.14,'float',{in:'pop',sh:0}]],tx:[LB(0,8,"We're expecting!\n赤ちゃんができました！",'pill',.2),LB(1.6,8,'due date\n出産予定日','pillk',.32),LB(3.2,8,'morning sickness\nつわり','pillk',.43)],sx:[[0,'aww'],[1.6,'pop'],[3.2,'pop']]},
 {d:8,bg:LBG,tr:'cut',a:[['p_bottle',.34,.86,.14,'float',{sh:0}],['p_paci',.66,.86,.1,'float',{sh:0}]],tx:[LB(0,8,'diaper (US) / nappy (UK)\nおむつ','pill',.2),LB(1.6,8,'pacifier (US) / dummy (UK)\nおしゃぶり','pill',.32),LB(3.2,8,'baby bottle\n哺乳びん','pillk',.44)],sx:[[0,'pop'],[1.6,'pop'],[3.2,'pop']]},
 {d:6,bg:'nursery',tr:'whip',a:[['c_pooh_3',.5,.88,.42,'hop']],fx:[['confetti',1,6,{n:30}]],tx:[LB(0,6,'baby shower\nベビーシャワー','pill',.2),[1.5,6,'a party before the baby arrives 🎉','赤ちゃんが生まれる前のお祝い会 🎉','tag',.32]],sx:[[0,'pop'],[1.5,'cheer']]},
 {d:5,bg:'nursery',tr:'zoom',a:[['c_prof_1',.5,.88,.44,'nod']],fx:[['hearts',0,5,{x:.5,y:.5,n:6}]],tx:[LB(0,5,'Congratulations! 🎉\nおめでとう！','pill',.2)],sx:[[0,'chime']]}
]},
{id:'l06',cat:'lng',by:'mogu',song:'comedy',seed:806,bpm:108,likes:97400,cm:3300,
 cap:['English slang you will hear everywhere 😎 (use with friends!) #English #slang','よく聞く英語スラング😎（友だち同士で使ってね）#英会話 #スラング'],
 snd:['Low-Key Banger','ひそかな名曲'],
 com:[['bronny','"that\'s fire" is approved 🔥','「that\'s fire」公認🔥'],['prof','Please do not say "my bad" in your thesis defense.','論文発表で「my bad」は控えましょう。']],
 shots:[
 {d:5,bg:'boardwalk',a:[['c_mogu_2',.5,.88,0.374,'bob',{in:'pop'}]],tx:[[0,5,'English slang 😎','ネイティブのスラング 😎','big',.17]],sx:[[0,'scratch']]},
 {d:7,bg:'boardwalk',tr:'whip',a:[['c_bronny_1',.5,.9,.32,'hop']],tx:[LB(0,7,'No way!\nうそでしょ！／まさか！','pill',.2),LB(1.8,7,"I'm down!\nいいね、乗った！",'pill',.32)],sx:[[0,'pop'],[1.8,'pop']]},
 {d:7,bg:LBG,tr:'cut',a:[['c_mogu_3',.5,.9,0.255,'tremble']],tx:[LB(0,7,'My bad.\nごめん、私のミス','pill',.2),LB(1.5,7,'low-key\nひそかに／ちょっと','pill',.32),[3,7,'"I low-key love this song"','「I low-key love this song」＝この曲ひそかに好き','tag',.44]],sx:[[0,'pop'],[1.5,'pop'],[3,'ding']]},
 {d:7,bg:'boardwalk',tr:'whip',a:[['c_pooh_5',.5,.9,.32,'bob']],fx:[['sparkle',0,7,{x:.5,y:.6,r:.2}]],tx:[LB(0,7,"That's fire! 🔥\n最高！めっちゃいい！",'pill',.2),[1.8,7,'casual — for friends, not your boss','カジュアルなので友だち同士で。上司にはNG','tag',.33]],sx:[[0,'pop'],[1.8,'buzz']]},
 {d:5,bg:'boardwalk',tr:'zoom',a:[['c_mogu_5',.5,.88,0.374,'dance']],tx:[LB(0,5,'See ya! ✌️\nまたね！','big',.18)],sx:[[0,'cheer']]}
]},
// ---------- Japanese for English viewers ----------
{id:'l07',cat:'lng',by:'pooh',song:'food',seed:807,bpm:100,likes:83600,cm:2400,
 cap:['Order at a Japanese café ☕ sumimasen, kudasai, mochikaeri #learnjapanese #japanese','英語圏の人向け：カフェの日本語☕ すみません・ください・持ち帰り #日本語'],
 snd:['Kudasai Groove','ください・グルーヴ'],
 com:[['bean','pointing + "kore o kudasai" is elite','指さし＋「これをください」は最強'],['pinco','arigatō gozaimasu 💕','ありがとうございます💕']],
 shots:[
 {d:5,bg:'cafe',a:[['c_pooh_3',.5,.88,.46,'hop',{in:'pop'}]],tx:[[0,5,'Japanese at the café ☕','カフェの日本語 ☕','big',.17],[1,5,'for English speakers','英語を話す人向け','pillk',.31]],sx:[[0,'pop']]},
 {d:7,bg:'cafe',blur:1,tr:'whip',a:[['c_pooh_1',.5,.9,.32,'bob']],tx:[LB(0,7,'すみません\nsumimasen','pill',.2),[1.5,7,'= "excuse me" — to call the staff','＝店員さんを呼ぶときの "excuse me"','tag',.32]],sx:[[0,'pop'],[1.5,'ding']]},
 {d:8,bg:LBG,tr:'cut',a:[['p_cup',.5,.87,.14,'float',{sh:0}]],tx:[LB(0,8,'ラテをください\nrate o kudasai','pill',.2),[1.5,8,'"___ o kudasai" = "___, please"','「〜をください」＝ "___, please"','tag',.31],LB(3,8,'これをください\nkore o kudasai','pillk',.42),[4.2,8,'(point and say "this one, please" 👉)','（指さして「これ」でもOK 👉）','tag',.53]],sx:[[0,'pop'],[3,'pop']]},
 {d:8,bg:'cafe',tr:'whip',a:[['c_bean_1',.3,.88,.36,'bob'],['c_pooh_3',.72,.88,.4,'idle',{sw:[[4,'c_pooh_5']]}]],tx:[LB(0,4,'店内でお召し上がりですか？\ntennai de omeshiagari desu ka?','bub',.28,{x:.38,tx:.3,ty:.5,who:'bean'}),[1,4,'"Eating here?"','＝ "Eating here?"','tag',.46],LB(4,8,'持ち帰りで！\nmochikaeri de!','bub',.28,{x:.64,tx:.72,ty:.48,who:'pooh'}),[4.8,8,'"To go!"','＝ "To go!"','tag',.46]],sx:[[4,'pop']]},
 {d:5,bg:'cafe',tr:'zoom',a:[['c_pooh_5',.5,.88,.44,'bob']],fx:[['sparkle',0,5,{x:.5,y:.5,r:.25}]],tx:[LB(0,5,'ありがとうございます！\narigatō gozaimasu!','pill',.2),[1.5,5,'= "thank you very much!"','＝ "thank you very much!"','tag',.32]],sx:[[0,'chime']]}
]},
{id:'l08',cat:'lng',by:'bronny',song:'comedy',seed:808,bpm:104,likes:69200,cm:1900,
 cap:['Japanese for the train 🚃 ikimasu ka, norikae, orimasu #learnjapanese #tokyo','英語圏の人向け：電車の日本語🚃 行きますか・乗り換え・降ります #日本語'],
 snd:['Orimasu! (original)','降ります！（オリジナル）'],
 com:[['mogu','"orimasu!" = instant path through the crowd','「降ります！」で人の波が割れる'],['pooh','I float, so I never transfer','ぼく浮いてるから乗り換えしない']],
 shots:[
 {d:5,bg:'train',a:[['c_bronny_0',.5,.88,.48,'bob',{in:'pop'}]],tx:[[0,5,'Japanese for the train 🚃','電車の日本語 🚃','big',.17],[1,5,'for English speakers','英語を話す人向け','pillk',.31]],sx:[[0,'pop']]},
 {d:7,bg:'train',blur:1,tr:'whip',a:[['p_ic',.5,.86,.12,'float',{in:'pop',sh:0}]],tx:[LB(0,7,'新宿に行きますか？\nShinjuku ni ikimasu ka?','pill',.2),[1.5,7,'= "Does this go to Shinjuku?"','＝ "Does this go to Shinjuku?"','tag',.32]],sx:[[0,'pop'],[1.5,'ding']]},
 {d:7,bg:LBG,tr:'cut',a:[['c_bronny_5',.5,.9,.3,'nod']],tx:[LB(0,7,'乗り換え\nnorikae','pill',.2),[1,7,'= transfer','＝ transfer','tag',.3],LB(2.5,7,'〜番線\n~bansen','pill',.41),[3.5,7,'= platform number','＝ platform number','tag',.51]],sx:[[0,'pop'],[2.5,'pop']]},
 {d:7,bg:'train',tr:'whip',cam:[1,1.1,.5,.6,.5,.6],a:[['c_mogu_1',.2,.88,0.272,'idle'],['c_bronny_3',.52,.88,.4,'shake'],['c_pooping_0',.84,.88,.32,'idle']],tx:[LB(0,7,'降ります！\norimasu!','bub',.28,{x:.52,tx:.52,ty:.45,who:'bronny'}),[1.8,7,'= "I\'m getting off!" — great on packed trains','＝ "I\'m getting off!" 満員電車で便利','tag',.43]],sx:[[0,'squeak'],[1.8,'ding']]},
 {d:6,bg:'train',tr:'zoom',a:[['c_bronny_0',.5,.88,.44,'nod']],tx:[[0,6,'train manners: talk softly, skip phone calls 🤫','マナー：小声で、通話はひかえめに 🤫','pill',.2]],sx:[[0,'chime']]}
]},
{id:'l09',cat:'lng',by:'pooh',song:'food',seed:809,bpm:98,likes:77500,cm:2000,
 cap:['5 Japanese words for every day 🍙 including the ones before and after eating #learnjapanese','英語圏の人向け：毎日使う日本語5つ🍙 食事のあいさつも #日本語'],
 snd:['Itadakimasu Bounce','いただきます・バウンス'],
 com:[['bean','gochisōsama deshita (to every snack)','ごちそうさまでした（全おやつに）'],['bronny','ohayō gozaimasu fam ☀️','おはようございます☀️']],
 shots:[
 {d:5,bg:'kitchen',a:[['c_pooh_3',.5,.88,.46,'hop',{in:'pop'}]],tx:[[0,5,'5 Japanese words for every day 🍙','毎日使う日本語5つ 🍙','big',.17],[1,5,'for English speakers','英語を話す人向け','pillk',.31]],sx:[[0,'pop']]},
 {d:8,bg:LBG,tr:'whip',a:[['c_pooh_1',.5,.9,.28,'bob']],tx:[LB(0,8,'おはようございます\nohayō gozaimasu','pill',.2),[1,8,'= good morning','＝ good morning','tag',.3],LB(2.5,8,'こんにちは\nkonnichiwa','pill',.41),[3.5,8,'= hello / good afternoon','＝ hello / good afternoon','tag',.51]],sx:[[0,'pop'],[2.5,'pop']]},
 {d:6,bg:LBG,tr:'cut',a:[['c_pooh_5',.5,.9,.3,'nod']],tx:[LB(0,6,'ありがとうございます\narigatō gozaimasu','pill',.2),[1.2,6,'= thank you (polite)','＝ thank you（ていねい）','tag',.31]],sx:[[0,'pop'],[1.2,'ding']]},
 {d:9,bg:'kitchen',tr:'whip',a:[['p_onigiri',.5,.87,.12,'float',{sh:0}]],tx:[LB(0,9,'いただきます\nitadakimasu','pill',.2),[1,9,'said before eating 🙏','食べる前のあいさつ 🙏','tag',.3],LB(3,9,'ごちそうさまでした\ngochisōsama deshita','pill',.41),[4,9,'said after eating: thanks for the meal','食べたあとのあいさつ','tag',.52]],sx:[[0,'pop'],[3,'chomp']]},
 {d:5,bg:'kitchen',tr:'zoom',a:[['c_pooh_3',.5,.88,.44,'bob']],fx:[['sparkle',0,5,{x:.5,y:.5,r:.25}]],tx:[LB(0,5,'またね！\nmata ne!','big',.18),[1.2,5,'= see you!','＝ see you!','tag',.3]],sx:[[0,'cheer']]}
]},
{id:'l10',cat:'lng',by:'bronny',song:'sweet',seed:810,bpm:94,likes:104000,cm:4100,
 cap:['How to say "I love you" in Japanese 💛 (and why most people say suki) #learnjapanese #love','英語圏の人向け：「好き」の伝え方💛 好き・大好き・愛してる #日本語'],
 snd:['Daisuki Daydream','大好きデイドリーム'],
 com:[['kaise','"aitai" 🥹','「会いたい」🥹'],['asmon','I say daisuki to ramen daily.','ラーメンには毎日「大好き」と言っている。']],
 shots:[
 {d:5,bg:'promenade',a:[['c_bronny_3',.5,.88,.48,'bob',{in:'pop'}]],fx:[['hearts',1,5,{x:.5,y:.5,n:6}]],tx:[[0,5,'"I love you" in Japanese 💛','「好き」の伝え方 💛','big',.17],[1,5,'for English speakers','英語を話す人向け','pillk',.31]],sx:[[0,'aww']]},
 {d:7,bg:LBG,tr:'whip',a:[['p_heart',.5,.86,.12,'pulse',{sh:0}]],tx:[LB(0,7,'好きです\nsuki desu','pill',.2),[1.5,7,'= I like you / I love you — the classic confession','＝ 告白の定番 "I like you"','tag',.32]],sx:[[0,'pop'],[1.5,'aww']]},
 {d:7,bg:'promenade',tr:'cut',a:[['c_bronny_4',.5,.9,.3,'bob']],tx:[LB(0,7,'大好き！\ndaisuki!','pill',.2),[1.5,7,'= I really love… (you, or this ramen 🍜)','＝ 人にも食べ物にも使える "I really love"','tag',.32]],sx:[[0,'pop'],[1.5,'giggle']]},
 {d:7,bg:'promenade',tr:'whip',a:[['c_bronny_0',.5,.9,.3,'sway']],fx:[['hearts',1,7,{x:.5,y:.55,n:8}]],tx:[LB(0,7,'愛してる\naishiteru','pill',.2),[1.5,7,'a deep "I love you" — many couples rarely say it out loud','＝ 深い "I love you"。口に出すのはまれなカップルも多い','tag',.33]],sx:[[0,'pop'],[1.5,'aww']]},
 {d:8,bg:LBG,tr:'cut',a:[['c_bronny_1',.5,.9,.28,'hop']],tx:[LB(0,8,'会いたい\naitai','pill',.2),[1,8,'= I miss you / I want to see you','＝ "I miss you"','tag',.3],LB(2.8,8,'デートしませんか？\ndēto shimasen ka?','pill',.41),[3.8,8,'= Would you like to go on a date?','＝ "Would you like to go on a date?"','tag',.52]],sx:[[0,'pop'],[2.8,'kiss']]}
]},
{id:'l11',cat:'lng',by:'pooh',song:'parent',seed:811,bpm:94,likes:61200,cm:1700,
 cap:['Baby & pregnancy Japanese 👶 akachan, omutsu, dakko #learnjapanese #baby','英語圏の人向け：赤ちゃん・妊娠の日本語👶 赤ちゃん・おむつ・抱っこ #日本語'],
 snd:['Dakko Dakko','だっこ・だっこ'],
 com:[['pooping','"dakko!" is said 400 times a day at my house','うちでは「だっこ！」1日400回'],['pinco','omedetō to all new parents 💕','新米パパママおめでとう💕']],
 shots:[
 {d:5,bg:'nursery',a:[['c_pooh_3',.5,.88,.46,'hop',{in:'pop'}]],tx:[[0,5,'Baby & pregnancy Japanese 👶','赤ちゃん・妊娠の日本語 👶','big',.17],[1,5,'for English speakers','英語を話す人向け','pillk',.31]],sx:[[0,'aww']]},
 {d:8,bg:LBG,tr:'whip',a:[['p_bottle',.5,.87,.13,'float',{sh:0}]],tx:[LB(0,8,'赤ちゃん\nakachan','pill',.2),[1,8,'= baby','＝ baby','tag',.3],LB(2.5,8,'おむつ\nomutsu','pill',.41),[3.5,8,'= diaper / nappy','＝ diaper / nappy','tag',.51]],sx:[[0,'pop'],[2.5,'pop']]},
 {d:8,bg:LBG,tr:'cut',a:[['p_onesie',.5,.87,.13,'float',{sh:0}]],tx:[LB(0,8,'妊娠中\nninshin-chū','pill',.2),[1,8,'= pregnant','＝ pregnant','tag',.3],LB(2.5,8,'予定日\nyoteibi','pill',.41),[3.5,8,'= due date','＝ due date','tag',.51]],sx:[[0,'pop'],[2.5,'pop']]},
 {d:6,bg:'nursery',tr:'whip',a:[['pooh_parent_0',.5,.88,.44,'bob']],tx:[LB(0,6,'抱っこ\ndakko','pill',.2),[1.2,6,'= carry in your arms — toddlers say "dakko!" 🥹','＝ "carry me!" 小さい子の「だっこ！」🥹','tag',.32]],sx:[[0,'pop'],[1.2,'aww']]},
 {d:5,bg:'nursery',tr:'zoom',a:[['c_pooh_5',.5,.88,.44,'bob']],fx:[['confetti',0,5,{n:30}]],tx:[LB(0,5,'おめでとうございます！\nomedetō gozaimasu!','pill',.2),[1.2,5,'= congratulations!','＝ congratulations!','tag',.32]],sx:[[0,'cheer']]}
]},
{id:'l12',cat:'lng',by:'bronny',song:'comedy',seed:812,bpm:108,likes:99800,cm:3600,
 cap:['Japanese slang 🔥 yabai, maji de, umai (friends only!) #learnjapanese #slang','英語圏の人向け：日本語スラング🔥 やばい・マジで・うまい #日本語'],
 snd:['Yabai Beat','やばいビート'],
 com:[['mogu','yabai can mean 3 things in one sentence','やばいは1文で3つの意味になる'],['prof','Context determines yabai. Fascinating.','やばいの意味は文脈次第。興味深い。']],
 shots:[
 {d:5,bg:'boardwalk',a:[['c_bronny_1',.5,.88,.48,'hop',{in:'pop'}]],tx:[[0,5,'Japanese slang 🔥','日本語スラング 🔥','big',.17],[1,5,'for English speakers','英語を話す人向け','pillk',.31]],sx:[[0,'scratch']]},
 {d:7,bg:LBG,tr:'whip',a:[['c_bronny_3',.5,.9,.3,'shake']],tx:[LB(0,7,'やばい\nyabai','pill',.2),[1.2,7,'= "crazy" — amazing OR terrible 😳','＝ 最高にも最悪にも使える 😳','tag',.31]],sx:[[0,'pop'],[1.2,'boing']]},
 {d:6,bg:LBG,tr:'cut',a:[['c_mogu_3',.5,.9,0.238,'tremble']],tx:[LB(0,6,'マジで？\nmaji de?','pill',.2),[1.2,6,'= seriously? / for real?','＝ seriously? / for real?','tag',.31]],sx:[[0,'pop'],[1.2,'ding']]},
 {d:8,bg:'kitchen',tr:'whip',a:[['p_ramen',.5,.87,.13,'float',{sh:0}]],tx:[LB(0,8,'うまい！\numai!','pill',.2),[1,8,'= tasty! (casual)','＝ tasty!（カジュアル）','tag',.3],LB(2.5,8,'おいしい\noishii','pillk',.41),[3.5,8,'= delicious (polite, works anywhere)','＝ delicious（どこでも使える）','tag',.51]],sx:[[0,'slurp'],[2.5,'pop']]},
 {d:5,bg:'boardwalk',tr:'whip',a:[['c_bronny_5',.5,.9,.32,'bob']],fx:[['sparkle',0,5,{x:.5,y:.6,r:.2}]],tx:[LB(0,5,'すごい！\nsugoi!','pill',.2),[1.2,5,'= amazing!','＝ amazing!','tag',.31]],sx:[[0,'cheer']]},
 {d:5,bg:'boardwalk',tr:'zoom',a:[['c_bronny_0',.5,.88,.44,'nod']],tx:[[0,5,'slang = friends only. polite words for strangers 🙇','スラングは友だち同士で。初対面にはていねいに 🙇','pill',.2]],sx:[[0,'chime']]}
]}
);
