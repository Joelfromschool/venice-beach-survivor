// Campaign: the Great Honey Lantern quest line. Every line is bilingual.
export const NPC={
 bean:{name:{en:'Mr Bean',ja:'ミスター・ビーン'},role:{en:'Farmer',ja:'農家'},img:'h_bean'},
 pooh:{name:{en:'Pooh',ja:'プー'},role:{en:'Honey Merchant',ja:'はちみつ商人'},img:'h_pooh'},
 pooping:{name:{en:'Mr Pooping',ja:'ミスター・プーピング'},role:{en:'Blacksmith',ja:'鍛冶屋'},img:'h_pooping'},
 bronny:{name:{en:'Bronny',ja:'ブロニー'},role:{en:'Guard Captain',ja:'衛兵隊長'},img:'h_bronny'},
 kermit:{name:{en:'Kermit',ja:'カーミット'},role:{en:'Lantern Keeper',ja:'ランタン守り'},img:'h_kermit'},
 asmon:{name:{en:'Asmon',ja:'アズモン'},role:{en:'The Hoard King',ja:'財宝王'},img:'h_asmon'},
 pinco:{name:{en:'Pinco',ja:'ピンコ'},role:{en:'You',ja:'あなた'},img:'h_pinco'}};
const L=(en,ja)=>({en,ja});const L3=(en,ja,at)=>({en,ja,at});
// goal types: have(item ids,n) | turnin | sleep | flag | flags(list) | kills(n since offer)
export const QUESTS=[
 {id:'wood',giver:'bean',title:L('Punch a Tree','木をたたこう'),
  offer:[L("Pinco! You're up! The village needs builders. First things first: wood.",'ピンコ！おはよう！村には建てる人が必要なんだ。まずは木だよ。'),L('Hold ⛏ on a tree trunk until it pops. Bring me 6 logs.','木の幹を⛏長押しでこわそう。丸太を6つ集めてね。')],
  goal:{type:'have',ids:[7,35,49],n:6},hint:L('Collect 6 logs from trees','木から丸太を6つ集める'),
  done:[L("Six logs! My pod is so proud. Here, some apples for the road.",'丸太6つ！ぼくのさやも誇らしいよ。りんごをどうぞ。')],reward:[[111,3]],marker:'trees'},
 {id:'bench',giver:'bean',title:L('Workbench & Pickaxe','作業台とツルハシ'),
  offer:[L('Open your bag ▦ and the Crafting tab. Logs become planks, planks become a Workbench.','バッグ▦を開いて「クラフト」へ。丸太は板に、板は作業台になるよ。'),L('Place the Workbench, stand near it, and craft a Wooden Pickaxe!','作業台を置いて、そばで木のツルハシを作ろう！')],
  goal:{type:'have',ids:[121],n:1},hint:L('Craft a Wooden Pickaxe at a workbench','作業台で木のツルハシを作る'),
  done:[L("Look at you, a real miner! Take some seeds and bread. Plant seeds on grass.",'すごい、本物の採掘者だ！種とパンをどうぞ。種は草の上に植えられるよ。')],reward:[[115,4],[112,3]],marker:'npc'},
 {id:'stone',giver:'pooping',title:L('The Stone Age','石の時代'),
  offer:[L("Hmph. A wooden pick? Cute. A real adventurer needs stone tools.",'ふん、木のツルハシ？かわいいな。本物の冒険者には石の道具だ。'),L('Dig down into stone, gather cobblestone, then craft a Stone Pickaxe and a Stone Sword.','地面を掘って石を集め、石のツルハシと石の剣を作れ。')],
  goal:{type:'have',ids:[125],n:1,also:[[124,1]]},hint:L('Craft a Stone Pickaxe and Stone Sword','石のツルハシと石の剣を作る'),
  done:[L("Now THAT is a tool. Here's a kiln and some coal. Coal + stick = torches.",'それでこそ道具だ。窯と石炭をやろう。石炭と棒でたいまつができる。')],reward:[[24,1],[101,4]],marker:'npc'},
 {id:'night',giver:'bronny',title:L('Light the Night','夜を照らせ'),
  offer:[L("Captain Bronny here. When the sun sets, Gloomies crawl out of the dark.",'衛兵隊長ブロニーだ。日が沈むと暗やみからグルーミーが出てくる。'),L('Monsters only appear in darkness. Craft 8 torches, make a bed from 3 wool and 3 planks, and sleep through a night.','モンスターは暗い場所にしか出ない。たいまつを8本作り、羊毛3つと板3つでベッドを作って、夜を眠ってこえろ。'),L('Puffsheep in the meadows drop wool.','草原のフワヒツジが羊毛を落とすぞ。')],
  goal:{type:'sleep',also:[[26,8]]},hint:L('Have 8 torches, place a bed and sleep at night','たいまつ8本を持ち、ベッドを置いて夜に眠る'),
  done:[L("You made it to morning. That's how champions play. Take my spare bow and arrows.",'朝まで生きのびたな。それが王者のプレイだ。予備の弓と矢をやろう。')],reward:[[110,1],[109,16]],marker:'npc'},
 {id:'iron',giver:'pooping',title:L('Iron Will','鉄の意志'),
  offer:[L("Iron ore hides deeper, pinkish specks in the stone. You need a stone pick for it.",'鉄鉱石はもっと深くにある。石の中のピンク色の粒だ。石のツルハシが必要だ。'),L('Smelt it in a kiln, then craft an Iron Pickaxe.','窯で溶かして、鉄のツルハシを作れ。')],
  goal:{type:'have',ids:[129],n:1},hint:L('Smelt iron and craft an Iron Pickaxe','鉄を精錬して鉄のツルハシを作る'),
  done:[L("Fine work. I made you a chestplate while you were gone. Don't thank me. ...Okay, you can thank me.",'いい仕事だ。留守の間にチェストプレートを作っておいた。礼はいらん。…いや、言ってもいいぞ。')],reward:[[145,1]],marker:'npc'},
 {id:'gold',giver:'pooh',title:L("Pooh's Gold Rush",'プーのゴールドラッシュ'),
  offer:[L('Oh bother... Do you smell that? That is the smell of MONEY.','やれやれ…このにおい、わかる？これは「お金」のにおいだよ。'),L('Honeygold ore glitters deep underground. Bring me 6 Honeygold ingots and I will open my shop to you. For a price. Hee hee!','地下深くにハニーゴールド鉱石が光ってる。インゴットを6つ持ってきたら、お店を開いてあげる。お代はいただくけどね、えへへ！')],
  goal:{type:'turnin',ids:[103],n:6},hint:L('Bring Pooh 6 Honeygold ingots','プーにハニーゴールドインゴットを6つ届ける'),
  done:[L('Shiny! Shiny! SHINY! My shop is open. Coins from monsters are welcome here.','ピカピカ！ピカピカ！お店オープンだよ。モンスターのコインも大歓迎。')],reward:[[105,40]],marker:'npc'},
 // ---- Coast chapter: Venice Beach & Santa Monica ----
 {id:'ferry',giver:'pooh',title:L('Sun, Sand & Shoppers','太陽と砂浜とお客さん'),
  offer:[L("Pinco! A ferry docks on the west shore. It sails to the Coast: Venice Beach and Santa Monica!",'ピンコ！西の岸にフェリーが来てるよ。行き先はコースト、ベニスビーチとサンタモニカ！'),L('Tourists. Boardwalks. Tourists WITH money. Ring the ferry bell at the end of the west jetty. The whole gang is coming!','観光客、ボードウォーク、お金を持った観光客！西の桟橋の先にあるフェリーの鐘を鳴らして。みんなも来るよ！')],
  goal:{type:'flag',flag:'coastVisited'},hint:L('Ring the ferry bell on the west jetty (follow the beam)','西の桟橋のフェリーの鐘を鳴らす（光をたどって）'),
  done:[L("We made it! Smell that? Salt air and... money. I set up a stall at the Arcade on the pier.",'着いたね！このにおい、潮風と…お金！桟橋のアーケードにお店を出したよ。'),L('Bronny is already at the outdoor gym on Venice sand. Go say hi!','ブロニーはもうベニスの砂浜のアウトドアジムにいるよ。あいさつしてきて！')],reward:[[105,10]],marker:'ferry'},
 {id:'flex',giver:'bronny',title:L('Night on the Boardwalk','夜のボードウォーク'),
  offer:[L("Flex Beach, Pinco! Pull-up bars, sand, ocean. Best gym in the world.",'フレックスビーチだ、ピンコ！懸垂バーに砂浜に海。世界一のジムだ。'),L('But after sunset, Gloomies and Snapcrabs crawl up onto the boardwalk and under the pier. Knock out 6 monsters on the Coast.','でも日が沈むと、グルーミーやスナップクラブがボードウォークや桟橋の下に上がってくる。コーストでモンスターを6体たおせ。')],
  goal:{type:'kills',n:6},hint:L('Defeat 6 monsters on the Coast (night boardwalk / under the pier)','コーストでモンスターを6体たおす（夜のボードウォーク／桟橋の下）'),
  done:[L("Six! That's a highlight reel. Here, take the spare gym gear.",'6体！ハイライト映像ものだ。ジムの予備の装備を持っていけ。')],reward:[[112,4],[109,16],[105,8]],marker:'boardwalk'},
 {id:'seaglass',giver:'bean',title:L('Sea Glass Hunt','シーグラスさがし'),
  offer:[L('Mmm-hm! (Bean is sitting by the canals, pointing at the sand.)','ん〜ふふ！（ビーンは運河のそばに座って、砂浜を指さしている）'),L('Sparkly sand on the beach hides sea glass. Dig it up and bring me 8 pieces for my canal garden!','砂浜のキラキラした砂にはシーグラスがかくれてる。掘って8つ持ってきて。運河の庭に飾るんだ！')],
  goal:{type:'turnin',ids:[166],n:8},hint:L('Dig sparkly sand on the beach for 8 sea glass','砂浜のキラキラ砂を掘ってシーグラスを8つ集める'),
  done:[L('*delighted pod noises* So shiny! Here, some snacks from the canal market.','（さやがよろこんで鳴る）キラキラ！運河マーケットのおやつをどうぞ。')],reward:[[111,4],[112,2],[105,6]],marker:'seaglass'},
 {id:'murals',giver:'pooping',title:L('Mural Walk','壁画ウォーク'),
  offer:[L("Hmph. Yes, I skate. This bowl is the best on the Coast. Don't ask. I was the best skater in Honeyvale.",'ふん。そうだ、スケートもやる。このボウルはコーストで一番だ。聞くな。ハニーヴェイルで一番のスケーターだったんだ。'),L('The painters on the boardwalk made 4 big murals: a sun, a wave, a palm and a pop face. Go look at each one up close. Tap it. Art is good for you.','ボードウォークの画家が大きな壁画を4つ描いた。太陽、波、ヤシ、ポップな顔だ。ひとつずつ近くで見てタップしろ。芸術は体にいい。')],
  goal:{type:'flags',flags:['mural0','mural1','mural2','mural3']},hint:L('Tap the 4 murals on the Venice shopfronts','ベニスの店先の壁画4つをタップする'),
  done:[L('...They are pretty good, right? Here, I sharpened your gear on the rail. Free. This once.','…なかなかいいだろ？レールで道具をといでおいた。今回だけタダだ。')],reward:[[163,2],[105,8]],marker:'murals'},
 {id:'pier',giver:'pooh',title:L('Trouble Under the Pier','桟橋の下のトラブル'),
  offer:[L("Oh bother. Something under the pier keeps pinching my customers. Pinch! Pinch! Bad for business!",'やれやれ。桟橋の下の何かがお客さんをはさむんだ。チョキ！チョキ！商売あがったりだよ！'),L('It is the Tide Crab King. Climb down to the sand under the pier in Santa Monica and send him back to sea. He keeps a pearl. Pearls are money.','タイドクラブ・キングだよ。サンタモニカの桟橋の下の砂浜へおりて、海に追い返して。真珠を持ってるんだ。真珠はお金！')],
  goal:{type:'have',ids:[167],n:1},hint:L('Defeat the Tide Crab King under the Santa Monica pier','サンタモニカの桟橋の下でタイドクラブ・キングをたおす'),
  done:[L('THE PEARL! Look at it shine. Okay, okay, it is yours. Kermit has news back home.','真珠だ！この光！わかったよ、きみのものだよ。カーミットが村で知らせを待ってる。'),L('Ring the ferry bell on the jetty whenever you want to come back. The Coast is always open.','戻りたくなったら桟橋のフェリーの鐘を鳴らしてね。コーストはいつでも開いてるよ。')],reward:[[105,25],[163,3],[146,1]],marker:'pierUnder'},
 {id:'sun',giver:'kermit',title:L('The Sun Shard','太陽のかけら'),
  offer:[L('Hi-ho. Pinco, see this old gate? It once held the Great Honey Lantern.','やあ。ピンコ、この古い門が見える？昔は大はちみつランタンがあったんだ。'),L('Asmon, the Hoard King, stole it to light his pile of treasure. It cracked into three shards that ran off on their own.','財宝王アズモンが宝の山を照らすために盗んだんだ。ランタンは3つのかけらに割れて、ばらばらに飛んでいった。'),L('The Sun Shard is guarded inside the Sunken Shrine, in the southern desert.','太陽のかけらは南の砂漠、しずんだ神殿の中で守られている。')],
  goal:{type:'have',ids:[160],n:1},hint:L('Defeat the guardian of the Sunken Shrine (south)','南の「しずんだ神殿」の守護者をたおす'),
  done:[L('The Sun Shard! It even feels warm. Two more to go.','太陽のかけらだ！あたたかいね。あと2つ。')],reward:[[163,3]],marker:'shrine'},
 {id:'frost',giver:'kermit',title:L('The Frost Shard','氷のかけら'),
  offer:[L('The Frost Shard is on the summit of Frostpeak, north-east. Something big and furry lives up there.','氷のかけらは北東のフロストピーク山頂にある。大きくてもふもふした何かがいるよ。'),L('Wear armor and bring food. Snow makes everything slower except monsters.','よろいを着て食料を持っていこう。雪の上では、モンスター以外はみんな遅くなるんだ。')],
  goal:{type:'have',ids:[161],n:1},hint:L('Defeat the Frost Warden on Frostpeak (north-east)','北東フロストピークのフロストウォーデンをたおす'),
  done:[L('Brr! The Frost Shard! Your paws must be freezing.','ブルル！氷のかけらだ！手がこおってるでしょ。')],reward:[[112,4],[109,12]],marker:'spire'},
 {id:'gloom',giver:'kermit',title:L('The Gloom Shard','やみのかけら'),
  offer:[L('The last shard sank deep under the Gloomroot woods, east. A spiral stair leads down to the Hollow.','最後のかけらは東のグルームルートの森の地下深くにしずんだ。らせん階段がくぼ地へ続いているよ。'),L('Starshard glows down there. Iron gear at least, please. I worry.','そこではスターシャードが光ってる。せめて鉄の装備でね。心配なんだ。')],
  goal:{type:'have',ids:[162],n:1},hint:L('Defeat the Gloom Weaver in Gloomroot Hollow (east)','東グルームルートのくぼ地でグルームウィーバーをたおす'),
  done:[L('All three! Now set them into the sockets around the gate.','3つそろった！門のまわりの台座にはめこもう。')],reward:[[163,2]],marker:'hollow'},
 {id:'gate',giver:'kermit',title:L('Open the Lantern Gate','ランタンの門を開け'),
  offer:[L('Tap each glowing socket beside the gate to set a shard in it.','門の横の光る台座をタップして、かけらをはめよう。')],
  goal:{type:'flag',flag:'gateOpen'},hint:L('Place the 3 shards in the gate sockets','3つのかけらを門の台座にはめる'),
  done:[L('The gate is awake! It leads to the Hoard, Asmon\'s floating treasure isles. Bring him home... I mean, bring the Lantern home.','門が目覚めた！アズモンの浮かぶ宝島「ホード」へ行けるよ。彼を…いや、ランタンを取り戻して。')],reward:[[163,3]],marker:'gate'},
 {id:'asmon',giver:'kermit',title:L('The Hoard King','財宝王'),
  offer:[L('Step through the gate. Asmon waits on his throne in the middle of the Hoard.','門をくぐって。アズモンはホードの真ん中の玉座で待っている。')],
  goal:{type:'flag',flag:'asmonDown'},hint:L('Defeat Asmon in the Hoard','ホードでアズモンをたおす'),
  done:[],reward:[],marker:'arena'}];
export const BOSSES={
 colossus:{name:L('Sandstone Colossus','砂岩の巨像'),hp:220,poi:'shrine',drop:160,model:'colossus'},
 warden:{name:L('Frost Warden','フロストウォーデン'),hp:260,poi:'spire',drop:161,model:'warden'},
 weaver:{name:L('Gloom Weaver','グルームウィーバー'),hp:300,poi:'hollow',drop:162,model:'weaver'},
 tidecrab:{name:L('Tide Crab King','タイドクラブ・キング'),hp:260,poi:'pierUnder',drop:167,model:'tidecrab'},
 asmon:{name:L('Asmon, the Hoard King','財宝王アズモン'),hp:420,poi:'arena',drop:164,model:'asmonboss'}};
export const BOSS_LINES={
 colossus:L('GRRRND... WHO DISTURBS THE SUN?','ゴゴゴ…太陽をさわがすのは誰だ？'),
 warden:L('HRRRAAAH! (It is very cold and very angry.)','グオオオ！（とても寒くて、とても怒っている）'),
 weaver:L('Sssso many threads to tie you up with...','ふふふ…しばる糸ならたくさんあるわよ…'),
 tidecrab:L('*click click* MY pier. MY pearl. MY sand!','（カチカチ）おれの桟橋。おれの真珠。おれの砂浜！'),
 asmon:L("My hoard. My lantern. My throne. You can't just walk in here, Pinco!",'わたしの宝。わたしのランタン。わたしの玉座。勝手に入るなピンコ！')};
export const ASMON_JOIN=[
 {who:'asmon',t:L('Okay. OKAY. Stop. I yield.','わかった。わかったから。もう降参だ。')},
 {who:'asmon',t:L('The truth? The Lantern made the gold shine... but nobody was here to see it. It was lonely, sitting on a pile of treasure by myself.','本当はな…ランタンで金は光った。でも見てくれる人は誰もいない。宝の山に一人で座ってても、さびしかったんだ。')},
 {who:'pinco',t:L('(Pinco offers a paw.) Come back to Honeyvale. Pooh will love your gold.','（ピンコは手をさしだした）ハニーヴェイルに来なよ。プーはきみの金が大好きだよ。')},
 {who:'asmon',t:L("...Fine. But I'm keeping the crown. Here, take the Lantern. And this spare crown, it's yours.",'…いいだろう。でも王冠は自分のだ。ほら、ランタンを返す。それと予備の王冠、おまえにやる。')}];
export const ENDING=[
 {who:'kermit',t:L('The Great Honey Lantern is home! Look how warm the whole valley glows.','大はちみつランタンが帰ってきた！谷全体があたたかく光ってる。')},
 {who:'pooh',t:L("And Asmon brought gold! I mean, friends. Friends AND gold. Best day ever.",'しかもアズモンが金を…じゃなくて、友だちを連れてきた！友だちと金！最高の日だね。')},
 {who:'bean',t:L('*happy pod noises* Mmm-hm! (One tooth, one big smile.)','（さやがうれしそうに鳴る）ん〜ふふ！（歯は1本、笑顔はでっかく）')},
 {who:'pooping',t:L('Hmph. Good job, kid. My forge is always open to you.','ふん。よくやったな。おれの鍛冶場はいつでも開いてるぞ。')},
 {who:'bronny',t:L("Honeyvale is safe. That's a championship run, Pinco.",'ハニーヴェイルは安全だ。チャンピオン級の冒険だったぞ、ピンコ。')}];
export const IDLE={
 bean:[L('Seeds grow on grass or dirt. Grow dust from Popshroom spores makes them pop up instantly!','種は草か土に植えられるよ。ポップシュルームの胞子で作る「成長の粉」で一気に育つ！'),L('Mmm-hm! (Bean smiles with his one tooth.)','ん〜ふふ！（ビーンは1本の歯で笑った）'),L3('The canals are so calm. Ducks would love it here. (No ducks yet.)','運河はとても静か。アヒルが気に入りそう。（まだアヒルはいない）','coast')],
 pooping:[L('Got a worn-out tool? I fix anything for 4 coins.','道具がボロボロ？コイン4枚で何でも直してやる。'),L('Starshard gear is the best. Starshard hides very deep, near the bottom of the world.','最強はスターシャードの装備だ。世界の底近く、とても深い所にある。')],
 pooh:[L('Money money money... and honey. Mostly money.','お金お金お金…それと、はちみつ。主にお金。'),L('Did you know Gloomies drop coins? I love Gloomies. From far away.','グルーミーはコインを落とすって知ってた？グルーミー大好き。遠くからね。'),L3('The Sky Wheel goes round and round, like coins in a pocket.','スカイホイールはぐるぐる回る。ポケットのコインみたいに。','coast')],
 bronny:[L('Popshrooms swell and flash before they pop. Back away fast!','ポップシュルームは破裂する前にふくらんで光る。すぐ離れろ！'),L('Sleep in a bed to set where you wake up after fainting.','ベッドで眠ると、気絶したあとの復活地点になるぞ。'),L3('Sea glass hides in sparkly sand. Snapcrabs drop it too.','シーグラスはキラキラ砂の中にある。スナップクラブも落とすぞ。','coast')],
 kermit:[L('Torches stop monsters from appearing nearby. Light up your caves!','たいまつがあると近くにモンスターが出ない。洞くつを明るくしよう！'),L('The shards hum when you are close. Follow the golden beam on your screen.','近づくとかけらがうなるんだ。画面の金色の光をたどって。'),L3('From the bluff park you can see the whole bay. The ferry bell takes you home.','崖の上の公園から湾全体が見えるよ。フェリーの鐘で家に帰れるよ。','coast')],
 asmon:[L3('Fine, the village is... cozy. Do NOT tell anyone I said that.','まあ、この村は…居心地がいい。誰にも言うなよ。','over'),L3('Want a rematch? Step through the gate. I will be on my throne. Practicing.','再戦したい？門をくぐれ。玉座で…練習しておく。','over'),
  L3('This pier has so many shiny things. None of them are mine. I checked.','この桟橋はピカピカだらけだ。どれもわたしのじゃない。確認した。','coast'),L3('Want a rematch? It has to be at the Lantern Gate back in Honeyvale. Take the ferry home first.','再戦したい？それはハニーヴェイルのランタンの門でだ。まずフェリーで帰れ。','coast')]};
// Lines a quest giver says when the quest belongs to the OTHER world (never pretend the gate/village/beach is right here).
// AWAY[npc].over = said on the Coast about a Honeyvale quest; AWAY[npc].coast = said in Honeyvale about a Coast quest.
export const AWAY={
 kermit:{over:[L("Hi-ho, Pinco! The bluff is lovely, but a Lantern Keeper's job is back home.",'やあ、ピンコ！崖の上は気持ちいいけど、ランタン守りの仕事は村にあるんだ。'),L("There's news about the Great Honey Lantern at the old Lantern Gate in Honeyvale. Ring the ferry bell on the jetty, and meet me at the gate back home!",'ハニーヴェイルの古いランタンの門で、大はちみつランタンの知らせがあるんだ。桟橋のフェリーの鐘を鳴らして、村の門で会おう！')],
  coast:[L('Hi-ho! I will be up on the bluff park on the Coast. Ring the ferry bell on the west jetty.','やあ！ぼくはコーストの崖の上の公園にいるよ。西の桟橋のフェリーの鐘を鳴らしてね。')]},
 pooh:{over:[L('Business on the pier is great, but the deal I have for you is back in Honeyvale. Ring the ferry bell and meet me in the village!','桟橋の商売は絶好調！でもきみへの話はハニーヴェイルでね。フェリーの鐘を鳴らして、村で会おう！')],
  coast:[L('Not here, silly! Come find me at my Arcade stall on the Santa Monica pier. The ferry bell is on the west jetty.','ここじゃないよ！サンタモニカの桟橋のアーケードにあるお店に来てね。フェリーの鐘は西の桟橋だよ。')]},
 bean:{over:[L('Mm-hm! (Bean points across the water, toward home.) My farm work is back in Honeyvale. Take the ferry and find me in the village.','ん〜ふふ！（ビーンは海の向こう、村のほうを指さした）畑の仕事はハニーヴェイルにあるよ。フェリーで帰って、村で会おう。')],
  coast:[L('Mm-hm! (Bean mimes little waves.) Meet me by the Venice canals on the Coast. The ferry bell is on the west jetty.','ん〜ふふ！（ビーンは小さな波のまねをした）コーストのベニスの運河で会おう。フェリーの鐘は西の桟橋だよ。')]},
 pooping:{over:[L('Hmph. My forge is in Honeyvale, not on a beach. Take the ferry home and talk to me there.','ふん。おれの鍛冶場は浜辺じゃなくハニーヴェイルだ。フェリーで帰ってから話しかけろ。')],
  coast:[L("Hmph. I'll be at the skate bowl in Venice, on the Coast. Ferry bell, west jetty. Don't make me wait.",'ふん。コーストのベニスのスケートボウルにいる。フェリーの鐘は西の桟橋だ。待たせるなよ。')]},
 bronny:{over:[L("Captain's orders: this job is back in Honeyvale. Ring the ferry bell and meet me in the village.",'隊長命令だ。この任務はハニーヴェイルにある。フェリーの鐘を鳴らして、村で会おう。')],
  coast:[L('I am needed at Flex Beach, the outdoor gym in Venice on the Coast. Ring the ferry bell on the west jetty.','おれはコーストのベニスにあるアウトドアジム、フレックスビーチに行く。西の桟橋のフェリーの鐘を鳴らせ。')]},
 asmon:{over:[],coast:[]}};
// Where each quest is offered (at) and turned in (doneAt).
const COASTQ=['flex','seaglass','murals','pier'];
for(const q of QUESTS){q.at=COASTQ.includes(q.id)?'coast':'over';q.doneAt=q.id==='ferry'?'coast':q.at}
export const PLACE={over:L('Honeyvale','ハニーヴェイル'),coast:L('the Coast','コースト')};
// Pooh's shop and Mr Pooping's services
export const TRADES=[
 {give:[[105,6]],get:[112,3]},{give:[[105,5]],get:[163,2]},{give:[[105,8]],get:[109,16]},{give:[[105,12]],get:[47,2]},{give:[[105,25]],get:[146,1]},{give:[[105,45]],get:[104,1]},
 {give:[[103,1]],get:[105,5]},{give:[[114,8]],get:[105,3]},{give:[[22,3]],get:[105,2]},{give:[[104,1]],get:[105,18]},{give:[[106,4]],get:[105,2]}];
