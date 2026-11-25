// Driftwood Days - strings (EN / JA)
'use strict';
const STR={
 brand:['A LANZAGAMES game','LANZAGAMES'],
 title:['Driftwood Days','ドリフトウッド・デイズ'],
 sub:['Cozy island life with friends','なかまとのんびり島ぐらし'],
 tap:['Tap to start','タップしてスタート'],
 cont:['Continue','つづきから'],newg:['New island','あたらしい島'],options:['Options','オプション'],allgames:['All games','ゲーム一覧'],
 newWarn:['Start a new island? Your current island will be replaced.','あたらしい島をはじめますか？今の島のデータは消えます。'],
 yes:['Yes','はい'],no:['No','いいえ'],ok:['OK','OK'],close:['Close','とじる'],back:['Back','もどる'],cancel:['Cancel','やめる'],next:['Next','つぎへ'],done:['Done','できた'],
 // creation
 createT:['Make your islander','じぶんの島民をつくろう'],yourName:['Your name','なまえ'],islandName:['Island name','島の名前'],
 defName:['Sunny','サニー'],defIsland:['Driftwood','ドリフトウッド'],
 skin:['Skin','はだ'],hair:['Hair','かみがた'],hairC:['Hair color','かみの色'],eyes:['Eyes','め'],topC:['Shirt','シャツ'],
 letsGo:["Let's go!",'しゅっぱつ！'],
 // hud
 act_talk:['Talk','はなす'],act_shake:['Shake','ゆする'],act_chop:['Chop','切る'],act_hit:['Hit rock','岩をたたく'],act_dig:['Dig','ほる'],act_pick:['Pick up','ひろう'],
 act_pull:['Pull weed','ざっ草をぬく'],act_fish:['Cast','つりざおを投げる'],act_reel:['Reel in!','つりあげる！'],act_wait:['Wait…','まって…'],act_swing:['Swing net','あみをふる'],act_water:['Water','水やり'],
 act_enter:['Enter','入る'],act_exit:['Go outside','外へ出る'],act_craft:['Craft','つくる'],act_read:['Read','読む'],act_take:['Pick up','しまう'],act_look:['Look','見る'],act_none:['—','—'],act_dig2:['Dig up','ほりおこす'],
 tools:['Tools','どうぐ'],noTool:['Put away','しまう'],bag:['Pocket','ポケット'],phone:['Leaf Pad','リーフパッド'],
 sneak:['Sneaking…','しのび足…'],
 // phone
 app_tasks:['Island Stamps','アイランドスタンプ'],app_pedia:['Critter Guide','いきもの図鑑'],app_diy:['DIY Recipes','DIYレシピ'],app_map:['Map','マップ'],
 app_ward:['Wardrobe','きせかえ'],app_friends:['Friends','なかま'],app_opt:['Options','オプション'],app_title:['Save & title','セーブしてタイトルへ'],app_help:['How to play','あそびかた'],
 // bag menu
 bagFull:['Your pockets are full!','ポケットがいっぱい！'],
 m_eat:['Eat','食べる'],m_plant:['Plant','植える'],m_place:['Place here','ここに置く'],m_equip:['Hold','持つ'],m_wear:['Wear','着る'],m_drop:['Drop','おとす'],m_store:['Send home','家に送る'],m_open:['Open','あける'],m_learn:['Learn recipe','レシピをおぼえる'],
 tasty:['Tasty!','おいしい！'],cantPlant:["You can't plant here. Face open grass.",'ここには植えられません。空いている草地の方を向いて。'],cantPlace:["There's no room here.",'ここには置けません。'],
 placed:['Placed!','置いた！'],planted:['Planted!','植えた！'],
 // actions
 gotX:['Got {0}!','{0}を手に入れた！'],gotXn:['Got {0} ×{1}!','{0}×{1}を手に入れた！'],
 nothing:['Nothing here…','なにもない…'],noBranch:['The tree rustles…','木がゆれた…'],
 toolBroke:['Oh no! Your {0} broke!','あっ！{0}がこわれた！'],
 needShovel:['You need a shovel to dig this up.','ほるにはスコップが必要です。'],needTool:['Hold a tool first (tool button).','先にどうぐを持とう（どうぐボタン）。'],
 rockDone:['The rock is all tapped out for today.','今日はこの岩からはもう何も出ない。'],treeDone:["You've chopped all the wood you can from this tree today.",'今日この木から取れる木材はもうない。'],
 fishNoWater:['Face the water to cast.','水の方を向いて投げよう。'],fishGone:['It got away…','にげられた…'],fishNibble:['Nibble…','ツンツン…'],fishNone:['Nothing is biting. Try another spot!','食いつかない。場所を変えてみよう！'],
 caughtFish:['I caught a {0}!','{0}をつりあげた！'],caughtBug:['I caught a {0}!','{0}をつかまえた！'],bugFled:['It flew away! Move slowly to sneak.','にげちゃった！ゆっくり動いてしのび足。'],missBug:['Missed!','からぶり！'],
 sizeCm:['{0} cm','{0}cm'],newEntry:['New in your Critter Guide!','図鑑に登録！'],
 dugFossil:['Dug up a fossil!','化石をほりあてた！'],dugClam:['Dug up a clam!','アサリをほった！'],
 bottle:['A message bottle! There is a DIY recipe inside.','ボトルメール！中にDIYレシピが入っている。'],
 learned:['Learned the {0} recipe!','{0}のレシピをおぼえた！'],knowIt:['You already know this recipe.','このレシピはもう知っている。'],
 watered:['Watered!','水をあげた！'],
 // craft
 craftT:['Workbench','作業台'],craftBtn:['Craft','つくる'],needMats:['Not enough materials','材料が足りない'],crafted:['Crafted {0}!','{0}ができた！'],
 craftHint:['Tap a recipe, then Craft. Materials come from your pockets.','レシピを選んで「つくる」。材料はポケットから使います。'],
 // shop
 shopT:["Pooh's Honey Pot Shop",'プーのハニーポット商店'],buy:['Buy','買う'],sell:['Sell','売る'],sold:['Sold for {0} coins!','{0}コインで売れた！'],
 bought:['Bought {0}!','{0}を買った！'],noCoins:['Not enough Honey Coins.','ハニーコインが足りない。'],sellSel:['Sell selected','選んだものを売る'],sellAll:['Select all','すべて選ぶ'],
 daily:["Today's picks",'今日のおすすめ'],always:['Always in stock','定番'],
 coins:['Honey Coins','ハニーコイン'],stamps:['Island Stamps','アイランドスタンプ'],
 // stamp shop
 stampShopT:['Stamp Exchange','スタンプ交換所'],redeem:['Redeem','交換'],noStamps:['Not enough Island Stamps.','スタンプが足りない。'],
 // museum
 museumT:['Island Museum','島の博物館'],donate:['Donate','寄贈する'],assess:['Assess fossils','化石を鑑定'],donated:['Donated!','寄贈した！'],
 nothingDonate:["You have nothing new to donate right now.",'今寄贈できる新しいものはありません。'],museumColl:['Collection','コレクション'],
 // pedia
 fish:['Fish','さかな'],bugs:['Bugs','むし'],fossils:['Fossils','化石'],price:['Price','値段'],where:['Where','場所'],when:['Time','時間'],months:['Months','月'],
 allDay:['All day','一日中'],allYear:['All year','一年中'],nowHere:['Out now!','今いる！'],notYet:['Not caught yet','まだつかまえていない'],
 w_sea:['Sea','海'],w_river:['River','川'],w_pond:['Pond','池'],w_fly:['Flying','飛んでいる'],w_flower:['On flowers','花の上'],w_tree:['On trees','木の幹'],w_ground:['On the ground','地面'],w_rock:['Under rocks','岩のそば'],w_night:['Near lights at night','夜の明かりのそば'],
 // tasks
 tasksT:['Island Stamps','アイランドスタンプ'],todayT:['Daily stamps','今日のスタンプ'],goalsT:['Island goals','島の目標'],claim:['Claim','もらう'],claimed:['Claimed','受け取り済み'],
 stampGet:['+{0} Island Stamps!','スタンプ+{0}！'],
 // house
 houseT:['Home','おうち'],decorate:['Decorate','もようがえ'],storage:['Storage','しまう場所'],rotate:['Rotate','回転'],move:['Move','移動'],storeIt:['Put away','しまう'],
 wallT:['Wallpaper','かべ紙'],floorT:['Flooring','ゆか'],furnT:['Furniture','家具'],tapFloor:['Tap a spot on the floor.','床の場所をタップ。'],
 roomFull:["That spot isn't free.",'そこには置けません。'],toBag:['To pockets','ポケットへ'],toStore:['To storage','しまう場所へ'],
 // wardrobe
 wardT:['Wardrobe','きせかえ'],tops:['Tops','トップス'],bottoms:['Bottoms','ボトムス'],hats:['Hats','ぼうし'],shoes:['Shoes','くつ'],looks:['Hair & face','かみ・かお'],noneHat:['No hat','なし'],
 // friends
 friendsT:['Friends','なかま'],hearts:['Friendship','なかよし度'],
 // talk
 tk_chat:['Chat','おしゃべり'],tk_gift:['Give a gift','プレゼント'],tk_favor:['Need a hand?','なにか手伝おうか？'],tk_bye:['Bye!','またね！'],
 tk_shop:['Shop','お店'],tk_sell:['Sell','売る'],tk_stamps:['Stamp Exchange','スタンプ交換'],tk_home:['About my home','家のこと'],tk_donate:['Donate','寄贈する'],tk_museum:['See collection','コレクションを見る'],
 tk_deliver:['Here you go!','はい、どうぞ！'],pickGift:['Pick a gift','プレゼントを選ぶ'],noGift:["You have nothing to give.",'あげられるものがない。'],
 // map
 mapT:['Island map','島のマップ'],
 // options
 optT:['Options','オプション'],music:['Music','音楽'],sfx:['Sound effects','効果音'],lang:['Language','言語'],on:['On','オン'],off:['Off','オフ'],
 cheat:['Cheat code','チートコード'],cheatPh:['Enter code','コードを入力'],apply:['Apply','適用'],cheatBad:['Unknown code','不明なコード'],
 cheatOn:['AMSABABY is on!','AMSABABY 有効！'],cheatOff:['Turn off cheat','チートをオフ'],
 ch_coins:['+50,000 coins','+50,000コイン'],ch_stamps:['+5,000 stamps','+5,000スタンプ'],ch_recipes:['Learn every recipe','すべてのレシピ'],ch_mats:['Material pack','素材パック'],
 ch_hour:['Skip 1 hour','1時間すすめる'],ch_day:['Skip to tomorrow','次の日へ'],ch_now:['Back to real time','実際の時刻にもどす'],ch_house:['Finish house upgrades','家の増築を完了'],ch_villagers:['Everyone moves in now','全員すぐ引っこし'],ch_tools:['Tools never break','どうぐがこわれない'],
 ch_furn:['One of every furniture','家具ぜんぶ'],ch_tut:['Skip tutorial','チュートリアルをとばす'],
 resetT:['Delete save','セーブを削除'],resetQ:['Delete this island forever?','この島のデータを完全に消しますか？'],
 saved:['Saved','セーブしました'],
 update:['A new version is ready','新しいバージョンがあります'],reload:['Update','更新'],
 // tutorial
 tutSkip:['Skip step','スキップ'],tutHintBtn:['Hint','ヒント'],
 tut1:['Talk to Mr Pooping in the plaza.','広場のミスター・プーピングに話しかけよう。'],
 tut1h:['Walk with the joystick (drag on the left side). The bouncing arrow points the way. Stand next to him and tap the big button.','左側をドラッグして歩こう。はねる矢印が行き先。となりに立って大きいボタンをタップ。'],
 tut2:['Shake trees to collect 5 tree branches ({0}/5).','木をゆすって木の枝を5本集めよう（{0}/5）。'],
 tut2h:['Walk up to a round tree, face it and tap Shake. Branches drop at your feet; walk over them and tap Pick up.','丸い木の前に立って「ゆする」をタップ。落ちた枝の上で「ひろう」。'],
 tut3:['Craft a Flimsy Fishing Rod at the workbench.','作業台でボロのつりざおをつくろう。'],
 tut3h:['The workbench is next to the Resident Tent. Face it, tap Craft, pick the rod, then tap Craft.','作業台は島民テントのとなり。向かって「つくる」→つりざおを選んで「つくる」。'],
 tut4:['Hold the rod and catch a fish.','つりざおを持って魚をつろう。'],
 tut4h:['Tap the tool button (bottom right, small) and choose the rod. Face the river or sea and tap Cast. Wait for the bobber to sink with a splash, then tap Reel in! quickly. Tapping during the small nibbles scares the fish.','右下の小さいどうぐボタンでつりざおを選ぶ。川か海を向いて「投げる」。ウキが大きくしずんだらすぐ「つりあげる」！小さくツンツンしている間はがまん。'],
 tut5:['Craft a Flimsy Net and catch a bug.','ボロのあみをつくって虫をつかまえよう。'],
 tut5h:['Craft the net at the workbench, hold it, then walk slowly toward a bug (push the joystick only a little to sneak). Face it and tap Swing net.','作業台であみをつくって持とう。ジョイスティックを少しだけたおすとしのび足。虫の方を向いて「あみをふる」。'],
 tut6:['Sell something at Pooh\'s shop.','プーのお店で何か売ろう。'],
 tut6h:['Pooh stands in front of the shop with the honey sign, east of the plaza. Talk to him and choose Sell.','広場の東、はちみつの看板のお店の前にプーがいる。話しかけて「売る」。'],
 tut7:['Go inside your tent and decorate it.','自分のテントに入ってもようがえしよう。'],
 tut7h:['Your tent is southwest of the plaza. Tap Enter at the door, then tap Decorate and place any furniture (you got a stool from Mr Pooping).','テントは広場の南西。入口で「入る」→「もようがえ」で家具を置こう（ミスター・プーピングにもらったイスがある）。'],
 tut8:['Tell Mr Pooping how your first day went.','ミスター・プーピングに一日目の報告をしよう。'],
 tut8h:['Head back to the plaza and talk to him.','広場にもどって話しかけよう。'],
 tutDone:['Tutorial complete! Your island life begins. Check Island Stamps on your Leaf Pad for goals.','チュートリアル完了！島ぐらしのはじまり。リーフパッドのスタンプで目標をチェック。'],
 // misc
 night:['Night','夜'],welcomeBack:['Welcome back!','おかえり！'],newDay:['A new day on {0}!','{0}に新しい朝！'],
 movedIn:['{0} moved in to the island!','{0}が島に引っこしてきた！'],kaiseHere:['Kaise is visiting the plaza today with clothes to sell.','今日はカイセが広場で服を売りにきている。'],
 houseReady:['Your home upgrade is finished!','家の増築が完了した！'],
 seasonSpring:['Spring','春'],seasonSummer:['Summer','夏'],seasonAutumn:['Autumn','秋'],seasonWinter:['Winter','冬'],
 rotateTip:['Turn your phone back to portrait for the best view, or keep playing in landscape.','縦向きがおすすめ。横向きでもあそべます。'],
 helpBody:[
 '<b>Move</b>: drag anywhere on the left half of the screen. Push the stick only a little to sneak up on bugs.<br><b>Act</b>: the big round button does whatever fits what you are facing: talk, shake, pick up, dig, fish, catch.<br><b>Tools</b>: the small button above it picks the tool in your hand. Tools wear out, so craft spares.<br><b>Leaf Pad</b> (top right): stamps, critter guide, recipes, map, wardrobe, friends and options.<br><b>Time</b> follows your real clock. Each day starts fresh at 5 AM: fruit regrows, new fossils, new shop stock and new favors.<br><b>Money</b>: sell things at Pooh\'s shop for Honey Coins. Pay off your home with Mr Pooping to make it bigger.<br><b>Flowers</b>: plant seeds next to each other and water them. Neighbors can make new colors overnight!',
 '<b>移動</b>：画面の左半分をドラッグ。少しだけたおすと虫にしのび寄れる。<br><b>アクション</b>：大きい丸ボタンで、向いているものに合わせて話す・ゆする・ひろう・ほる・つる・つかまえる。<br><b>どうぐ</b>：上の小さいボタンで持つどうぐを選ぶ。どうぐはこわれるので予備をつくろう。<br><b>リーフパッド</b>（右上）：スタンプ、図鑑、レシピ、マップ、きせかえ、なかま、オプション。<br><b>時間</b>は本物の時計とおなじ。毎朝5時に新しい一日：果物、化石、お店の品物、おねがいごとが新しくなる。<br><b>お金</b>：プーのお店で売ってハニーコインに。ミスター・プーピングにローンを返すと家が大きくなる。<br><b>花</b>：となり同士に植えて水やり。次の日に新しい色が咲くかも！'],
};
let LANG=(()=>{try{const s=localStorage.getItem('dd_lang');if(s)return s}catch(e){}return (navigator.language||'en').toLowerCase().startsWith('ja')?'ja':'en'})();
function T(k,...a){const s=STR[k];let t=s?(LANG==='ja'?s[1]:s[0]):k;a.forEach((v,i)=>{t=t.split('{'+i+'}').join(v)});return t}
function N(n){return Array.isArray(n)?(LANG==='ja'?n[1]:n[0]):n}
function setLang(l){LANG=l;try{localStorage.setItem('dd_lang',l)}catch(e){}document.documentElement.lang=l}
