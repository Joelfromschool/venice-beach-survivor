// ===== v2.0 i18n: every UI + story string lives here. [English, 日本語] =====
const STR={
 play:['▶ FREE STYLE','▶ フリースタイル'],story:['📖 STORY','📖 ストーリー'],closet:['👗 MY CLOSET','👗 クローゼット'],bank:['🍯 POOH BANK','🍯 プーさん銀行'],options:['⚙️ OPTIONS','⚙️ オプション'],
 logo2:['Pretty Princess','プリティ・プリンセス'],
 best:['Rounds: {0} · Best: {1}★','ラウンド {0} ・ ベスト {1}★'],
 todaytheme:["TODAY'S THEME",'きょうのテーマ'],rule:['90 seconds to style Pinco · ✨ = on-theme item','90秒でピンコをコーデ ・ ✨=テーマにぴったり'],letsstyle:["LET'S STYLE! 💖",'コーデしよう！💖'],
 stamp:['✏️ Stamp','✏️ スタンプ'],clear:['Clear','けす'],torunway:['✨ TO THE RUNWAY!','✨ ランウェイへ！'],skip:['Skip ⏩','スキップ ⏩'],
 photo:['📸 Photo','📸 写真'],closet2:['👗 Closet','👗 クローゼット'],home:['🏠 Home','🏠 ホーム'],next:['▶ Next','▶ つぎへ'],coins:['coins','コイン'],
 mycloset:['👗 My Closet','👗 クローゼット'],back:['Back','もどる'],savepng:['📸 Save PNG','📸 保存'],close:['Close','とじる'],
 paused:['Paused','ポーズ中'],pausemsg:["Leave this round? Your look won't be judged.",'このラウンドをやめる？ コーデは審査されないよ。'],keep:['Keep styling','つづける'],leave:['Leave','やめる'],
 none:['None','なし'],timeup:["⏰ Time's up! To the runway!",'⏰ 時間切れ！ランウェイへ！'],
 unlocked:['Unlocked {0}! −{1} coins','{0}をゲット！ −{1}コイン'],needmore:['Need {0} more coins for {1}','{1}まで あと{0}コイン'],
 pickfirst:['Pick an item first, then tint it','先にアイテムをえらんでから色をぬってね'],stampdress:['Stamp on the dress!','ドレスにスタンプしてね！'],stampbody:['Stamp on the body — or pick a dress first','からだにスタンプ — または先にドレスをえらんでね'],
 hintstamp:['Tap the outfit to stamp {0}s!','コーデをタップして{0}をスタンプ！'],hinttint:['Tap a colour to tint the {0}','色をタップして{0}をぬろう'],hintpick:['Pick an item, then tap a colour to tint it','アイテムをえらんで色をタップ'],
 st_star:['star','ほし'],st_heart:['heart','ハート'],st_dot:['dot','ドット'],
 saved:['📸 Photo saved!','📸 保存したよ！'],deleted:['Look deleted','コーデを消したよ'],
 nolooks:['No looks yet — finish a round and your look is saved here automatically.','まだコーデがないよ — ラウンドをクリアすると自動で保存されるよ。'],
 stars15:['{0} / 15 stars','{0} / 15 スター'],afford:['🛍️ {0} locked items are now in your price range — tap 🔒 items to unlock!','🛍️ {0}個のアイテムが買えるよ — 🔒をタップしてゲット！'],
 nextunl:['Next unlock: {0} for {1} coins','つぎのアイテム：{0}（{1}コイン）'],ownall:['You own every item! 👑','ぜんぶ持ってる！👑'],
 tiptheme:['Tip: wear more ✨ items for "{0}" — the Places tab counts double!','ヒント：「{0}」の✨アイテムをもっと！ばしょは2倍カウント！'],
 tipcol:['Tip: Dark Kermit wants theme colours — tint items with the swatches on the theme card.','ヒント：ダーク・カーミットはテーマカラーが好き — テーマの色でぬってみて。'],
 tipcre:['Tip: Dark Kermit wants originality — tint your items and stamp the dress (✏️).','ヒント：ダーク・カーミットは個性が好き — 色ぬり＆スタンプ（✏️）をしよう。'],
 judgessay:['The judges say…','しんさいんのひとこと…'],pose:['✨ POSE! ✨','✨ ポーズ！ ✨'],
 freebtn:['FREE!','タダ！'],
 // options
 o_title:['⚙️ Options','⚙️ オプション'],o_music:['🎵 Music','🎵 おんがく'],o_sfx:['🔔 Sound FX','🔔 こうかおん'],o_lang:['🌐 Language','🌐 ことば'],o_easy:['🎯 Easy rhythm poses','🎯 かんたんポーズリズム'],
 o_reset:['🗑 Reset progress','🗑 データをリセット'],o_resetq:['Reset ALL progress? Coins, items, story and closet will be erased.','ぜんぶリセットする？ コイン・アイテム・ストーリー・クローゼットが消えるよ。'],o_resetdone:['Progress reset ✨','リセットしたよ ✨'],
 o_credits:['Credits','クレジット'],o_by:['A game by AMSA Baby Productions','制作：AMSA Baby Productions'],o_thanks:['Starring Pinco and the plush crew 💖','出演：ピンコとぬいぐるみのなかまたち 💖'],
 o_on:['ON','オン'],o_off:['OFF','オフ'],yes:['Yes','はい'],no:['No','いいえ'],resume:['▶ Resume','▶ つづける'],
 // story ui
 tap:['tap ▶','タップ ▶'],skipall:['Skip ⏭','スキップ ⏭'],chapter:['Chapter {0}','第{0}話'],goal:['Goal: {0}★ or more','目標：{0}★以上'],
 newgame:['New story','はじめから'],cont:['Continue · Ch.{0}','つづきから ・ 第{0}話'],storytitle:['📖 Story Mode','📖 ストーリーモード'],
 pass:['🎉 You did it!','🎉 やったね！'],fail:['So close! 💕','おしい！💕'],failmsg:['Need {0}★ — you got {1}★. Every princess stumbles. Try again!','目標{0}★ — 今回{1}★。プリンセスだってつまずくよ。もう一回！'],
 retry:['↻ Try again','↻ もう一回'],toshift:['🍢 Work a shift first','🍢 先にバイトする'],continue:['▶ Continue','▶ つづける'],
 shop:['🛍️ Boutique','🛍️ ブティック'],shopnext:['▶ Next show','▶ つぎのショーへ'],buy:['Buy','買う'],owned:['Owned','持ってる'],
 shopnote:['✨ = matches the next theme: {0}','✨ = つぎのテーマ「{0}」にぴったり'],
 // serving
 shift:['Shift','バイト'],serveTut:['How to serve','おしごとのしかた'],
 tut1:['1. Read the order bubble above a customer.','1. お客さんの吹き出しで注文をチェック。'],
 tut2:['2. Tap foods below to put them on your tray.','2. 下の料理をタップしてトレーにのせる。'],
 tut3:['3. Tap the customer to serve! Fast = big tips, streaks = combo!','3. お客さんをタップして出す！早いとチップ、連続でコンボ！'],
 tut4:['🗑 clears the tray. Don\'t let the patience bar run out!','🗑でトレーをリセット。ガマンゲージに注意！'],
 gotit:['Got it! 💖','わかった！💖'],shiftover:['Shift over!','おつかれさま！'],served:['Served: {0}','提供：{0}'],angry:['Walked out: {0}','帰っちゃった：{0}'],
 tips:['Tips: +{0}','チップ：+{0}'],earned:['Earned {0} coins','{0}コインかせいだ！'],combo:['COMBO ×{0}!','コンボ ×{0}！'],wrong:['Wrong order!','注文ちがい！'],
 trayfull:['Tray full!','トレーがいっぱい！'],cooking:['Cooking…','調理中…'],hmph:['Hmph!','ふんっ！'],thanks:['Thanks!','ありがとう！'],yum:['Yum!','おいしい！'],
 critic:['CRITIC','評論家'],
 // pose rhythm
 posetap:['TAP TO POSE!','タップでポーズ！'],perfect:['PERFECT!','パーフェクト！'],good:['GOOD!','グッド！'],miss:['MISS','ミス'],
 poseTut:['Rhythm Pose!','リズムポーズ！'],poseTut1:['Circles pop up on the beat. Tap each one when the shrinking ring touches it!','ビートにあわせて丸が出るよ。リングが重なった瞬間にタップ！'],
 poseTut2:['More PERFECTs = a fancier pose + a judge bonus!','パーフェクトが多いほど豪華なポーズ＆審査ボーナス！'],
 p_wave:['A cute wave!','かわいく手をふる！'],p_hip:['Hand on hip!','腰に手を！'],p_twirl:['Twirl!','くるっとターン！'],p_kiss:['Blown kiss! 💋','投げキッス！💋'],p_princess:['PRINCESS POSE! 👑','プリンセスポーズ！👑'],
 p_bonus:['+{0}★ judge bonus','審査ボーナス +{0}★'],
 // gifts
 gifts:['🎁 Gifts','🎁 プレゼント'],nogifts:['No gifts yet. Someone special might be watching your shows… 👀','まだプレゼントはないよ。だれかがショーを見てるかも…👀'],
 giftfrom:['From {0}','{0}より'],giftnew:['🎁 Secret fan!','🎁 ひみつのファン！'],giftsay:['I love what you did! Take my {0}!','すてきだった！私の{0}をあげる！'],
 yay:['Yay! 💖','やったー！💖'],incrowd:['👀 {0} is in the crowd!','👀 {0}が観客席に！'],looks:['Looks','コーデ'],
 venue_alley:['Back-Alley Show','路地裏ショー'],venue_mall:['Mall Pop-Up','モールのポップアップ'],venue_city:['City Fashion Show','シティ・ファッションショー'],venue_tokyo:['Tokyo Fashion Week','東京ファッションウィーク'],venue_paris:['Paris Fashion Week','パリ・ファッションウィーク'],venue_london:['LONDON FASHION WEEK','ロンドン・ファッションウィーク'],
 st_yaki:['Street Yakitori Stand','屋台やきとり'],st_sushi:['Sushi Cart','おすし屋台'],st_ramen:['Ramen Shop','ラーメン屋'],st_cafe:['Café & Bakery','カフェ＆ベーカリー'],st_bistro:['Bistro','ビストロ'],st_fine:['Fine Dining','高級レストラン'],
 debug:['🐞 Debug: jump to finale','🐞 デバッグ：最終話へ'],theend:['THE END 👑','おしまい 👑'],
 intro_skip:['Skip intro ⏭','スキップ ⏭'],
};
const LANG=()=>(typeof S!=='undefined'&&S&&S.lang)||'en';
function T(k,...a){const e=STR[k];let s=e?(LANG()==='ja'&&e[1]!=null?e[1]:e[0]):k;a.forEach((v,i)=>{s=s.split('{'+i+'}').join(v);});return s;}
const JA_ITEM={gown:'ボールガウン',sun:'サンドレス',tee:'ハートT',pop:'スパンコールトップ',spacedr:'ギャラクシードレス',spooky:'コウモリドレス',hoodie:'くもパーカー',mermaid:'マーメイドガウン',overall:'ピクニックオーバーオール',tutu:'チュチュ',shorts:'デニムショーツ',leggings:'星のレギンス',starskirt:'星のスカート',cargo:'ゆるパンツ',bloomers:'ハートブルマ',heels:'ガラスのヒール',sneaks:'スニーカー',jelly:'ゼリーサンダル',boots:'ゴーゴーブーツ',moon:'ムーンブーツ',slippers:'うさぎスリッパ',tiara:'ティアラ',sunhat:'むぎわら帽子',crown:'おおきな王冠',witch:'まじょの帽子',helmet:'宇宙ヘルメット',beret:'ベレー帽',bunny:'うさみみ',pearls:'パール',shades:'星のサングラス',purse:'ハートポーチ',mic:'キラキラマイク',earstar:'星のイヤリング',cape:'星空マント',wings:'妖精の羽',classic:'定番リボン',polka:'水玉リボン',ribbon:'ロングリボン',flower:'お花クリップ',starw:'星のステッキ',heartw:'ハートのステッキ',moonw:'月の王笏',bubble:'シャボン玉ステッキ',pumpkin:'かぼちゃステッキ',ballroom:'舞踏会',beachbg:'ビーチ',bedroom:'ピンクのお部屋',concert:'コンサート',spacebg:'宇宙',spookybg:'おばけの庭',
 lilygown:'スイレンのガウン',cloakdr:'真夜中のマント',swampsiren:'沼のセイレーン',honeygown:'ハニカムガウン',beetee:'ミツバチT',redtee:'プーさん赤T',honeyhood:'はちみつパーカー',peadress:'えんどう豆ドレス',gardenover:'ガーデンオーバーオール',starhood:'星空パーカー',candysun:'キャンディストライプ',pearlmaid:'パールマーメイド',plaidcrop:'チェックのクロップ',nebula:'星雲ガウン',lilytutu:'スイレンのチュチュ',honeytutu:'はちみつチュチュ',beeshorts:'ミツバチショーツ',peaskirt:'えんどう豆スカート',plaidleg:'チェックのレギンス',gardenpants:'ガーデンパンツ',honeybloom:'はちみつブルマ',swampskirt:'沼のスカート',lilyslip:'スイレンのスリッパ',rainboots:'レインブーツ',beesneaks:'ミツバチスニーカー',frogboots:'カエルブーツ',rubyheels:'ルビーのヒール',peasandal:'えんどう豆サンダル',starmoon:'星と月のブーツ',lilyhat:'はっぱの帽子',honeypot:'はちみつ壺ハット',antenna:'ミツバチの触角',peabeanie:'えんどう豆ニット帽',meshcap:'フルーツキャップ',frogcrown:'カエル王子の王冠',rosetiara:'バラのティアラ',starberet:'星のベレー帽',dipper:'ハニーディッパー',jar:'ホタルのびん',peapurse:'えんどう豆ポーチ',beewings:'ミツバチの羽',batwings:'コウモリの羽',lilybeads:'スイレンのネックレス',honeypearls:'はちみつパール',nightcape:'夜のマント',beebow:'ミツバチリボン',lilyclip:'スイレンの花',peabow:'えんどう豆リボン',batbow:'コウモリリボン',starribbon:'星のリボン',lilyw:'スイレンのステッキ',hexw:'ハニカムステッキ',peaw:'えんどう豆ステッキ',fireflyw:'ホタルのステッキ',sunw:'ひまわりステッキ',swampbg:'月夜の沼',honeybg:'はちみつホール',gardenbg:'えんどう豆の庭'};
const JA_THEME={royal:['舞踏会','ガウン、王冠、パールでキラキラ！'],beach:['ビーチの日','晴れて、さわやか、あかるく！'],pop:['ポップスター','大胆に、元気に、ピカピカに！'],space:['宇宙プリンセス','シルバー、星、宇宙のかがやき！'],spooky:['おばけカワイイ','コウモリ、かぼちゃ、むらさき！'],sweet:['スイーツピクニック','パステル、リボン、おやつ！'],swamp:['沼のガラ','スイレン、真夜中マント、カエル王子のドラマ！'],honey:['はちみつパーティー','金色で、あまくて、ちょっとベタベタ！'],pea:['えんどう豆ガーデン','みどり、お花、えんどう豆！']};
const JA_CAT={top:'ドレス',bot:'ボトムス',shoe:'くつ',hat:'かんむり',acc:'こもの',bow:'リボン',wand:'ステッキ',bg:'ばしょ'};
const IN=it=>LANG()==='ja'&&JA_ITEM[it.id]||it.n;
const THN=t=>LANG()==='ja'&&JA_THEME[t.id]?JA_THEME[t.id][0]:t.n;
const THH=t=>LANG()==='ja'&&JA_THEME[t.id]?JA_THEME[t.id][1]:t.hint;
const CATN=c=>{const r=CATS.find(q=>q[0]===c);return LANG()==='ja'?JA_CAT[c]:r[1];};
function applyLang(){document.documentElement.lang=LANG();document.querySelectorAll('[data-i18n]').forEach(e=>{e.textContent=T(e.dataset.i18n);});}
