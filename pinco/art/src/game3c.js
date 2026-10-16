// ===== v2.0 story script (12 chapters). Beat: [speaker, English, 日本語, fx] =====
const CH=[
 {v:0,th:'sweet',goal:6,title:['A Star in the Alley','路地裏のスター'],
  pre:{bg:'alley',cast:['pinco','party','leaf'],lines:[
   ['party',"Ta-daaa! One runway, three folding chairs, and a VERY nice curtain I… found.",'ジャジャーン！ランウェイと折りたたみイス3つ、それに…拾った、とってもステキなカーテン！'],
   ['pinco',"A runway? For me? But I don't have anything to wear…",'ランウェイ？わたしに？でも着る服がないよ…'],
   ['leaf',"Hi!! I'm Sprout! I'm your first fan! I made a sign! It says 'PINCO'!",'こんにちは！スプラウトだよ！きみのファン第1号！看板つくったの！「ピンコ」って書いてある！'],
   ['party',"Wear what you've got! The Plush Panel happened to be walking by — they'll judge!",'あるものを着ればいい！ちょうどぬいぐるみ審査団が通りかかったから、審査してもらおう！'],
   ['bean',"…we were going to a sad poetry night. But okay.",'…悲しい詩の夜に行くとこだったけど。まあいいよ。'],
   ['kermit',"I judge EVERYTHING. Even alleys. ESPECIALLY alleys.",'私はすべてを審査する。路地裏でもな。むしろ路地裏こそ。'],
   ['pooh',"Is there honey at a fashion show? …No? Oh bother.",'ファッションショーにはちみつある？…ないの？やれやれ。']]},
  post:{bg:'alley',cast:['pinco','party','holiday'],lines:[
   ['party',"You were AMAZING! But a princess needs outfits. Outfits need coins. Coins need…",'すごかった！でもプリンセスには服がいる。服にはコイン。コインには…'],
   ['holiday',"A JOB! Ho ho hooo! I'm Jolly Jingles, and my yakitori stand needs a helper!",'おしごと！ホッホッホー！ジョリー・ジングルだよ！やきとり屋台の手伝いを募集中！'],
   ['pinco',"I'll do it! Skewers for sparkles!",'やる！串でキラキラをかせぐぞ！']]}},
 {v:0,th:'beach',goal:7,title:['Sticks & Sparkles','串とキラキラ'],
  pre:{bg:'alley',cast:['pinco','tad','party'],lines:[
   ['tad',"An alley show? With FOLDING chairs? How… quaint. Darling, I'm Madame Smugsworth.",'路地裏ショー？折りたたみイスで？なんて…素朴。わたくし、マダム・スマッグよ。'],
   ['tad',"I've walked in the MALL. With real lights. Try to keep up, sweetie.",'わたくしはモールで歩いたことがあるの。本物のライトでね。ついてこられるかしら。'],
   ['pinco',"Um… nice to meet you? I like your eyelids!",'えっと…よろしく？そのまぶた、ステキだね！'],
   ['tad',"…Hmph. Flattery won't help you. Beach theme, today. Good luck.",'…ふん。おせじは通じないわ。今日のテーマはビーチ。せいぜいがんばって。']]},
  post:{bg:'alley',cast:['pinco','mole','party'],lines:[
   ['mole',"…h-hi. *pops up from the ground* …that was really pretty. …bye.",'…こ、こんにちは。*地面からぽこっ* …すごくきれいだった。…じゃあね。'],
   ['pinco',"Wait, who was that?!",'まって、今のだれ！？'],
   ['party',"That's Mochi Mole. Super shy. If she popped up, you're doing GREAT. Next stop… the MALL!",'もぐもちだよ。すごく人見知り。顔を出したってことは、すごくいい感じってこと！次は…モールだ！']]}},
 {v:1,th:'pop',goal:8,title:['Mall Pop-Up','モールのポップアップ'],
  pre:{bg:'mall',cast:['pinco','party','tad'],lines:[
   ['party',"I booked us a pop-up at the mall! Between the pretzel shop and the phone cases!",'モールのポップアップを予約したよ！プレッツェル屋とスマホケース屋のあいだ！'],
   ['tad',"Oh look, it's the alley girl. The mall is MY runway, darling.",'あら、路地裏の子。モールはわたくしのランウェイよ。'],
   ['pinco',"Then let's both make it sparkle!",'じゃあ、ふたりでキラキラにしよう！'],
   ['tad',"…Why are you so NICE. It's very annoying.",'…なんでそんなにイイ子なの。すごくイライラする。']]},
  post:{bg:'mall',cast:['pinco','party'],lines:[
   ['party',"The crowd LOVED you! I got you a new job too — at a SUSHI CART! Fancy!",'お客さん大喜び！新しいバイトも見つけたよ — おすし屋台！おしゃれ！'],
   ['pinco',"I've never rolled sushi… but I've rolled out of bed!",'おすしは巻いたことないけど…ベッドから転がり落ちたことはある！']]}},
 {v:1,th:'royal',goal:8,title:['Wardrobe Malfunction!','衣装トラブル！'],
  pre:{bg:'backstage',cast:['pinco','leaf','party'],lines:[
   ['pinco',"Oh no oh no oh NO! My dress ripped! Five minutes to showtime!",'どうしよう！ドレスがやぶれた！本番まであと5分！','shake'],
   ['leaf',"Don't panic! I brought TAPE! Fashion is ninety percent tape!",'あわてないで！テープ持ってきた！ファッションの9割はテープだよ！'],
   ['party',"And ten percent believing in yourself! …and maybe glue.",'のこり1割は自分を信じること！…あと、のりも。'],
   ['pinco',"Okay. Tape, courage, royal theme. I can do this!",'よし。テープと勇気とロイヤルテーマ。いける！']]},
  post:{bg:'mall',cast:['pinco','kermit','leaf'],lines:[
   ['kermit',"The visible tape. Was it… a statement? A critique of fast fashion?",'見えているテープ。あれは…主張か？ファストファッションへの批評か？'],
   ['pinco',"…Yes. Totally. On purpose.",'…うん。そう。わざとだよ。'],
   ['leaf',"(It was not on purpose.) 🤫",'（わざとじゃないよ）🤫']]}},
 {v:2,th:'space',goal:9,title:['Big City Lights','都会のスポットライト'],
  pre:{bg:'city',cast:['pinco','baller','party'],lines:[
   ['baller',"Yo! Slam Dunkle here. Nine-time All-Plush. My sneaker brand sponsors this show!",'よう！スラム・ダンクルだ。オールぬいぐるみ9回選出。このショーのスポンサーさ！'],
   ['baller',"I saw your mall walk. You've got GAME. Space theme tonight — shoot for the stars!",'モールのウォーク見たぜ。センスある！今夜は宇宙テーマ — 星までシュートだ！'],
   ['pinco',"A real celebrity?! Can I have your autograph? On my… paw?",'本物のセレブ！？サインください！…この手に？'],
   ['baller',"Only if I get yours after the show. Deal?",'ショーのあとで君のサインもくれるならな。決まり？']]},
  post:{bg:'city',cast:['pinco','baller'],lines:[
   ['baller',"That was a SLAM DUNK! Here's some advice: champions practise. Go work at the ramen shop — fast hands, fast feet!",'スラムダンクだったな！アドバイスだ：チャンピオンは練習する。ラーメン屋で働け — 速い手、速い足！'],
   ['pinco',"Noodles = training. Got it!",'ラーメン＝トレーニング。わかった！']]}},
 {v:2,th:'spooky',goal:9,title:['The Fall','まさかの転倒'],
  pre:{bg:'city',cast:['pinco','tad','bean'],lines:[
   ['tad',"Spooky night, darling. Don't trip in those shoes. It would be SO embarrassing.",'おばけの夜よ。そのくつで転ばないでね。とっても恥ずかしいもの。'],
   ['bean',"Falling is just… flying, but sad.",'転ぶってさ…悲しい飛行なんだよ。'],
   ['pinco',"I won't fall. I won't fall. I won't fa—",'転ばない。転ばない。ころば—']]},
  post:{bg:'city',cast:['pinco','kermit','tad'],lines:[
   ['pinco',"I… I FELL. On the runway. In front of EVERYONE.",'わたし…転んだ。ランウェイで。みんなの前で。','shake'],
   ['kermit',"And then you got up and POSED. Darling, that was the most honest moment in fashion this year.",'そして立ち上がってポーズした。あれは今年いちばん正直なファッションの瞬間だった。'],
   ['tad',"…Fine. That was iconic. I hate it. Teach me how to fall like that.",'…いいわ。あれは伝説よ。くやしい。あの転び方、教えて。']]}},
 {v:3,th:'honey',goal:10,title:['Tokyo Calling','トーキョー・コーリング'],
  pre:{bg:'tokyo',cast:['pinco','party','pooh'],lines:[
   ['party',"PINCO. We got invited to… TOKYO FASHION WEEK!!",'ピンコ。招待が来た…東京ファッションウィーク！！','shake'],
   ['pinco',"TOKYO?! Neon! Kawaii! Tiny desserts!",'東京！？ネオン！カワイイ！ちっちゃいスイーツ！'],
   ['pooh',"The theme is HONEY PARTY. I may have… suggested it.",'テーマは「はちみつパーティー」。ぼくが…提案したかも。'],
   ['pinco',"Suteki da ne~! Let's make it golden!",'素敵だね〜！金色にしよう！']]},
  post:{bg:'cafe',cast:['pinco','pooh','holiday'],lines:[
   ['holiday',"Ho ho! I opened a café in Tokyo! Want a shift? Lattes and cupcakes!",'ホッホー！東京にカフェを開いたよ！バイトする？ラテとカップケーキ！'],
   ['pooh',"I will be your most loyal customer. Every five minutes.",'ぼく、いちばんの常連になるよ。5分おきに。']]}},
 {v:3,th:'pea',goal:10,title:['Almost Quitting','もうやめたい'],
  pre:{bg:'night',cast:['pinco','leaf','mole','bean'],lines:[
   ['pinco',"Smugsworth got a magazine cover. I got a cold. I miss my blanket… Maybe I'm not a princess.",'スマッグは雑誌の表紙。わたしは風邪。毛布が恋しい…わたし、プリンセスじゃないのかも。','rain'],
   ['leaf',"Pinco… you're MY princess. Since the alley. Since the sign!",'ピンコ…きみはぼくのプリンセスだよ。路地裏のときから。看板のときから！'],
   ['mole',"*pop* …I knitted you a tiny blanket. It's very small. Like me.",'*ぽこっ* …ちっちゃい毛布、編んだの。すごく小さいの。わたしみたいに。'],
   ['bean',"Being sad is okay. Walking anyway… that's brave. I'll cry in the front row for you.",'悲しくてもいいんだよ。それでも歩くのが…勇気。最前列で泣いて応援するね。'],
   ['pinco',"…Okay. One more walk. For you guys.",'…うん。もう一回歩く。みんなのために。']]},
  post:{bg:'tokyo',cast:['pinco','leaf','mole'],lines:[
   ['pinco',"I'm NOT quitting! Next stop… PARIS!",'やめない！次は…パリ！'],
   ['mole',"…yay. *hides again, happily*",'…やったぁ。*しあわせそうにまたかくれる*']]}},
 {v:4,th:'swamp',goal:11,title:['Bonjour, Paris','ボンジュール、パリ'],
  pre:{bg:'paris',cast:['pinco','kermit','tad'],lines:[
   ['kermit',"Welcome to MY event. The Paris Swamp Gala. Lily pads. Midnight. DRAMA.",'わたしのイベントへようこそ。パリ沼のガラ。スイレン。真夜中。ドラマ。'],
   ['tad',"Pinco, darling… I saved you the good mirror backstage. Don't make it weird.",'ピンコ…楽屋のいい鏡、あなたにとっておいたわ。変な空気にしないで。'],
   ['pinco',"Smugsworth! You're being NICE?",'スマッグ！やさしくしてくれるの？'],
   ['tad',"I said don't make it weird!",'変な空気にしないでって言ったでしょ！']]},
  post:{bg:'paris',cast:['pinco','party'],lines:[
   ['party',"Paris loves you! Quick, a bistro needs help tonight. Crêpes, soup, baguettes!",'パリが君にメロメロ！今夜はビストロのお手伝い。クレープ、スープ、バゲット！'],
   ['pinco',"Oui oui! …that's all the French I know.",'ウィウィ！…フランス語これしか知らない。']]}},
 {v:4,th:'pop',goal:11,title:['The Blanket Thief','毛布どろぼう'],
  pre:{bg:'backstage',cast:['pinco','party','leaf'],lines:[
   ['pinco',"Wait. That curtain backstage. Pink. Fluffy. A little stain shaped like a heart…",'まって。楽屋のあのカーテン。ピンクで、ふわふわで、ハートの形のシミ…'],
   ['pinco',"THAT'S MY BLANKET!!!",'それ、わたしの毛布！！！','shake'],
   ['party',"…Okay. Okay okay okay. I can explain.",'…よし。よしよしよし。説明させて。'],
   ['party',"That night I needed a curtain for the alley show. I saw a blanket. I YANKED it. Then you walked out crying…",'あの夜、路地裏ショーのカーテンが必要で。毛布を見つけて、ひっぱった。そしたら君が泣きながら出てきて…'],
   ['party',"…and I felt SO bad that I… discovered you? As a princess? To make it up to you?",'…すごく申し訳なくて…君をプリンセスとして発掘した？おわびに？'],
   ['pinco',"You stole my blanket… and gave me a DREAM?!",'毛布をぬすんで…夢をくれたってこと！？'],
   ['leaf',"This is the best plot twist I've ever seen.",'こんなすごいどんでん返し、はじめて見た。'],
   ['pinco',"…Come here. *hug* But you're carrying my bags in London.",'…こっち来て。*ぎゅっ* でもロンドンでは荷物もってね。']]},
  post:{bg:'paris',cast:['pinco','party'],lines:[
   ['party',"Here. Your blanket. Washed. Twice.",'はい。君の毛布。洗ったよ。2回。'],
   ['pinco',"Keep it as our curtain. For every show. It's lucky now.",'カーテンとして使って。毎回のショーで。もうラッキーアイテムだから。']]}},
 {v:5,th:'space',goal:11,title:['Road to London','ロンドンへの道'],
  pre:{bg:'london',cast:['pinco','tad','baller'],lines:[
   ['tad',"Pinco. I have to tell you something. I was mean because… you scared me. You're GOOD.",'ピンコ。言わなきゃいけないことがあるの。意地悪したのは…こわかったから。あなた、すごいもの。'],
   ['pinco',"You're good too! Let's be scary-good together!",'スマッグもすごいよ！いっしょに最強になろう！'],
   ['baller',"Two rivals teaming up? That's championship energy. London semi-finals — space theme!",'ライバルがチームに？チャンピオンのエネルギーだ。ロンドン準決勝 — 宇宙テーマ！']]},
  post:{bg:'london',cast:['pinco','holiday','party'],lines:[
   ['holiday',"One last shift before the finale! A FINE DINING restaurant. Plating! Wine! Picky critics!",'決勝前の最後のバイト！高級レストラン。盛りつけ！ワイン！うるさい評論家！'],
   ['party',"Remember: garnish EVERYTHING. Critics love a little leaf on top.",'忘れずに：ぜんぶに飾りつけ。評論家は葉っぱがのってるのが好きなんだ。']]}},
 {v:5,th:'royal',goal:12,title:['LONDON FASHION WEEK','ロンドン・ファッションウィーク'],
  pre:{bg:'london',cast:['pinco','party','leaf','mole','tad'],lines:[
   ['party',"This is it. London Fashion Week. The biggest runway in the world.",'ついにきた。ロンドン・ファッションウィーク。世界一のランウェイ。'],
   ['leaf',"Everybody's here! Even Jolly Jingles closed the café!",'みんな来てる！ジョリー・ジングルもカフェを閉めて来たよ！'],
   ['mole',"…I'm not even hiding. *stays up*",'…今日はかくれない。*ずっと顔を出してる*'],
   ['tad',"Go get them, princess. I mean it.",'行ってらっしゃい、プリンセス。本気よ。'],
   ['pinco',"From a cold rainy night… to here. Let's GO!",'寒い雨の夜から…ここまで来た。いくよ！']]},
  post:{bg:'london',cast:['pinco','king','party'],lines:[
   ['king',"By royal decree! I, King Pooh, have seen many princesses. None with a heart like yours.",'王の命令じゃ！わしキング・プーは、多くのプリンセスを見てきた。だが、そなたほどの心はない。'],
   ['king',"Kneel, Pinco. …Actually, don't, the floor is sticky. I spilled honey.",'ひざまずくのじゃ、ピンコ。…いや、やめておけ、床がベタベタじゃ。はちみつこぼした。'],
   ['king',"I crown you… a TRUE PRINCESS!",'そなたを…真のプリンセスに任命する！','crown'],
   ['party',"*sobbing* I stole a blanket and found a PRINCESS!",'*号泣* 毛布をぬすんだら、プリンセスが見つかった！'],
   ['pinco',"Thank you, everyone. I'm home. 💖",'みんな、ありがとう。ここが、わたしのおうち。💖']]}}
];
const STALL_FOR=ch=>['yaki','yaki','sushi','sushi','ramen','ramen','cafe','cafe','bistro','bistro','fine',null][ch];
// intro "mobile ad" cut list: [duration, caption key, scene]
const INTRO=[[1.7,['THIS IS PINCO 💖','これがピンコ 💖'],'home'],[1.6,['ONE NIGHT…','ある夜…'],'shadow'],[1.3,['NOOOO!! 😱','いやあああ！！😱'],'yank'],[1.9,['SHE LOST EVERYTHING','すべてを失った…'],'rain'],[0,['TAP TO HELP!','タップでたすけて！'],'help'],[1.4,['WAIT… WHO\'S THAT?!','まって…あれはだれ！？'],'spot'],[1.8,['A STAR IS BORN ✨','スター誕生 ✨'],'star']];
const INTRO_D=[['party',"Whoa whoa WHOA. You there! In the rain!",'おっとっと！そこの君！雨の中の！'],['pinco',"M-me? I'm just… cold. Someone took my blanket.",'わ、わたし？…さむいだけ。だれかに毛布を取られたの。'],['party',"Forget the blanket! Look at you! You look like a PRINCESS! You should walk the runway!",'毛布なんていい！見てごらん！君はまるでプリンセスだ！ランウェイを歩くべきだよ！'],['party',"I'm Polka Pete — party hat, antler hands, big dreams. Come with me!",'ぼくはポルカ・ピート — パーティーハットに、つのの手、でっかい夢。ついておいで！'],['pinco',"A princess… me? …Okay!",'プリンセス…わたしが？…うん！']];
