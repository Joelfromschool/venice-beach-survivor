// English + Japanese strings for Blockhaven UI, items and the intro captions.
import {G} from './state.js';
import {def} from './blocks.js';
const S={
 title:['Blockhaven','ブロックヘイブン'],subtitle:['A voxel adventure in Honeyvale','ハニーヴェイルのボクセル冒険'],
 newgame:['New Adventure','新しい冒険'],cont:['Continue','つづきから'],options:['Options','設定'],picker:['◀ Game Picker','◀ ゲーム選択'],intro:['Watch Intro','オープニング'],
 confirmNew:['Start over? Your current save will be replaced.','最初から始めますか？今のセーブは上書きされます。'],yes:['Yes','はい'],no:['No','いいえ'],
 resume:['Back to Game','ゲームにもどる'],quit:['Save & Title','セーブしてタイトルへ'],paused:['Paused','一時停止'],
 lang:['Language','言語'],sound:['Sound','効果音'],music:['Music','音楽'],difficulty:['Difficulty','難易度'],keepInv:['Keep items on faint','気絶してもアイテム保持'],view:['View distance','描画距離'],sens:['Look speed','視点感度'],autojump:['Auto-jump','自動ジャンプ'],reduced:['Reduce motion','動きをへらす'],
 on:['On','オン'],off:['Off','オフ'],diff0:['Peaceful','ピースフル'],diff1:['Gentle','やさしい'],diff2:['Normal','ふつう'],diff3:['Hard','むずかしい'],
 cheat:['Cheat code','チートコード'],cheatPh:['Enter code','コードを入力'],cheatOn:['AMSABABY active: no damage, free crafting, triple damage.','AMSABABY有効：ダメージなし、素材なしでクラフト、攻撃3倍。'],cheatConfirm:['Turn on AMSABABY? You will be invincible and crafting is free.','AMSABABYを有効にしますか？無敵になりクラフトが無料になります。'],cheatOff:['Turn off cheat','チートをオフ'],cheatBad:['Unknown code','不明なコード'],apply:['Apply','適用'],
 close:['Close','閉じる'],back:['Back','もどる'],
 inventory:['Inventory','持ち物'],craft:['Crafting','クラフト'],quests:['Quests','クエスト'],map:['Map','地図'],armor:['Armor','よろい'],
 needbench:['Needs a workbench nearby','近くに作業台が必要'],crafted:['Crafted','作った'],makeit:['Craft','作る'],make5:['×5','×5'],
 all:['All','すべて'],cat_blocks:['Blocks','ブロック'],cat_tools:['Tools','道具'],cat_armor:['Armor','よろい'],cat_food:['Food','食べ物'],cat_items:['Items','アイテム'],
 tapmove:['Tap a slot, then tap another to move. Double-tap to use or equip.','スロットをタップして、別のスロットをタップで移動。ダブルタップで使用・装備。'],
 kiln:['Kiln','窯'],smeltIt:['Smelt','精錬'],smeltAll:['All','全部'],fuel:['Fuel','燃料'],queue:['Smelting','精錬中'],output:['Output','完成品'],collect:['Collect','受け取る'],nothingSmelt:['Nothing here can be smelted.','精錬できるものがありません。'],
 chest:['Chest','チェスト'],yours:['Your bag','あなたのバッグ'],takeAll:['Take all','全部とる'],
 trade:["Pooh's Shop",'プーのお店'],buy:['Trade','交換'],
 next:['Next ▶','次へ ▶'],skip:['Skip ▶▶','スキップ ▶▶'],
 fainted:['You fainted!','気絶した！'],faintsub:['You wake up at your bed or the village.','ベッドか村で目を覚まします。'],respawn:['Wake up','目を覚ます'],
 theend:['The End','おしまい'],credits:['Thanks for playing Blockhaven!','ブロックヘイブンを遊んでくれてありがとう！'],keepplaying:['Keep exploring','冒険をつづける'],
 stats:['Playtime {t} · Monsters {k} · Blocks mined {m} · Crafted {c}','プレイ時間 {t}・モンスター {k}・採掘 {m}・クラフト {c}'],
 loading:['Loading','読み込み中'],gen:['Shaping the island…','島をつくっています…'],light:['Lighting the sky…','空を照らしています…'],mesh:['Placing blocks…','ブロックを置いています…'],
 update:['A new version is ready.','新しいバージョンがあります。'],reload:['Update','更新'],
 saved:['Saved','セーブしました'],
 jump:['Jump','ジャンプ'],mine:['Mine','掘る'],use:['Use','使う'],sneak:['Sneak','しのび'],talk:['Talk','話す'],bag:['Bag','バッグ'],
 broke:['{item} broke!','{item}がこわれた！'],nofuel:['No fuel! Coal, planks or logs burn.','燃料がない！石炭・板・丸太が燃えます。'],levelup:['Level {n}!','レベル {n}！'],heartup:['+1 max heart','最大ハート+1'],
 questready:['Quest complete!','クエスト達成！'],returnto:['Return to {name}','{name}のところへもどろう'],newquest:['New quest','新しいクエスト'],
 shop:['🍯 Shop','🍯 お店'],repair4:['🔨 Repair held (4 coins)','🔨 手持ちを修理（コイン4枚）'],hint:['💡 Hint','💡 ヒント'],rematch:['⚔ Rematch','⚔ 再戦'],
 norepair:['Hold a tool or armor to repair.','修理する道具かよろいを持ってね。'],alreadyfine:['It is already like new.','もう新品同様だ。'],needcoins:['You need {n} coins.','コインが{n}枚必要です。'],repaired:['{item} repaired!','{item}を修理した！'],cantafford:['Not enough to trade.','交換するものが足りない。'],
 bossdown:['Boss defeated!','ボス撃破！'],phase:['Phase {n}!','フェーズ {n}！'],socketfull:['This socket is already lit.','この台座はもう光っている。'],needshard:['You need the matching shard.','合うかけらが必要です。'],
 meetin:['Ferry: meet {name} in {place}','フェリーで{place}へ：{name}に会う'],travelhint:['Ring the ferry bell on the jetty to sail to {place}.','桟橋のフェリーの鐘を鳴らして{place}へ。'],
 coast:['The Coast','コースト'],coastsub:['Venice Beach & Santa Monica','ベニスビーチ＆サンタモニカ'],venice:['Venice Beach','ベニスビーチ'],venicesub:['Boardwalk · Flex Beach · Skate Bowl · Canals','ボードウォーク・フレックスビーチ・スケートボウル・運河'],santamonica:['Santa Monica','サンタモニカ'],santamonicasub:['The Pier · Sky Wheel · Bluff Park','桟橋・スカイホイール・崖の上の公園'],ferryreg:['Ferry Jetty','フェリー桟橋'],ferrysub:['Ring the bell to sail','鐘を鳴らして出航'],honeyvale:['Honeyvale','ハニーヴェイル'],honeyvalesub:['Home sweet home','なつかしの村'],sailing:['Sailing…','出航中…'],ringbell:['Ring bell','鐘を鳴らす'],muralseen:['Mural admired ({n}/4)','壁画を鑑賞した（{n}/4）'],viewmural:['Admire','鑑賞する'],killsleft:['Monsters: {n}/{m}','モンスター：{n}/{m}'],
 gateopen:['The Lantern Gate opens!','ランタンの門が開いた！'],realm:['The Hoard','ホード'],realmsub:["Asmon's floating treasure isles",'アズモンの浮かぶ宝島'],
 nothungry:['You are not hungry.','おなかはすいていない。'],noarrows:['No arrows!','矢がない！'],tapsocket:['Tap the socket','台座をタップ'],invfull:['Bag is full!','バッグがいっぱい！'],
 spawnset:['Wake-up point set.','目覚める場所をセットした。'],monstersnear:['You cannot sleep, monsters are nearby!','近くにモンスターがいて眠れない！'],goodmorning:['Good morning!','おはよう！'],
 talkto:['Talk to {name}','{name}と話す'],usebench:['Workbench','作業台'],usekiln:['Kiln','窯'],openchest:['Open chest','チェストを開ける'],sleep:['Sleep','眠る'],setshard:['Set shard','かけらをはめる'],
 rematchon:['Asmon is waiting on his throne again.','アズモンがまた玉座で待っている。'],
 day:['Day {n}','{n}日目'],hp:['Health','体力'],food:['Hunger','満腹度'],lv:['Lv','Lv'],
 c1:['Honeyvale. A blocky island where the honey lantern always glowed.','ハニーヴェイル。はちみつランタンがいつも光っていた、ブロックの島。'],
 c2:['Bean farmed, Pooh counted coins, Mr Pooping hammered, Bronny kept watch, Kermit tended the gate.','ビーンは畑を耕し、プーはコインを数え、プーピングは鉄を打ち、ブロニーは見張り、カーミットは門を守っていた。'],
 c3:['Then Asmon, the Hoard King, took the Great Honey Lantern for his treasure pile.','ある日、財宝王アズモンが大はちみつランタンを宝の山のために持ち去った。'],
 c4:['The lantern cracked into three shards that scattered across the island.','ランタンは3つのかけらに割れ、島中に散らばった。'],
 c5:['Wake up, Pinco. Honeyvale needs a hero.','起きて、ピンコ。ハニーヴェイルには英雄が必要だ。'],
 controls:['WASD move · Space jump · Mouse look · Left mine/attack · Right use/place · E bag · F talk · Q drop · V view · J quests','WASD移動・Spaceジャンプ・マウス視点・左クリック掘る/攻撃・右クリック使う/置く・Eバッグ・F話す・Q捨てる・V視点・Jクエスト'],
 touchhelp:['Left stick move · drag to look · tap to use · hold to mine','左スティックで移動・ドラッグで視点・タップで使う・長押しで掘る'],
 version:['Version {v}','バージョン {v}'],nosave:['No saved game yet.','セーブデータがありません。'],
 objective:['Objective','目標'],done:['Done','完了'],allquests:['Campaign complete!','キャンペーン完了！'],
 you:['You','あなた'],village:['Honeyvale','ハニーヴェイル']};
const N={palm_log:['Palm Log','ヤシの丸太'],palm_leaves:['Palm Fronds','ヤシの葉'],asphalt:['Asphalt','アスファルト'],asphalt_line:['Bike Path Line','自転車道のライン'],concrete:['Concrete','コンクリート'],boardwalk:['Boardwalk Planks','ボードウォークの板'],mural_sun:['Sun Mural','太陽の壁画'],mural_wave:['Wave Mural','波の壁画'],mural_palm:['Palm Mural','ヤシの壁画'],mural_pop:['Pop Face Mural','ポップ顔の壁画'],seaglass_sand:['Sparkly Sand','キラキラ砂'],awning:['Striped Awning','しま模様のひさし'],felt_red:['Red Felt','赤いフェルト'],felt_white:['White Felt','白いフェルト'],ferry_bell:['Ferry Bell','フェリーの鐘'],neon:['Neon Tube','ネオン管'],sea_glass:['Sea Glass','シーグラス'],tide_pearl:['Tide Pearl','潮の真珠'],
grass:['Grass Block','草ブロック'],dirt:['Dirt','土'],stone:['Stone','石'],cobble:['Cobblestone','丸石'],sand:['Sand','砂'],sandstone:['Sandstone','砂岩'],log:['Oak Log','オークの丸太'],planks:['Planks','板'],leaves:['Leaves','葉'],glass:['Glass','ガラス'],water:['Water','水'],snow:['Snow','雪'],snowgrass:['Snowy Grass','雪の草'],ice:['Ice','氷'],coal_ore:['Coal Ore','石炭鉱石'],iron_ore:['Iron Ore','鉄鉱石'],gold_ore:['Honeygold Ore','ハニーゴールド鉱石'],star_ore:['Starshard Ore','スターシャード鉱石'],deepstone:['Deepstone','ディープストーン'],magma:['Magma','マグマ'],bricks:['Bricks','レンガ'],wool:['Wool','羊毛'],workbench:['Workbench','作業台'],kiln:['Kiln','窯'],kiln_lit:['Kiln','窯'],chest:['Chest','チェスト'],torch:['Torch','たいまつ'],flower_red:['Red Tulip','赤いチューリップ'],flower_yellow:['Buttercup','キンポウゲ'],flower_blue:['Bluebell','ブルーベル'],tallgrass:['Tall Grass','背の高い草'],cactus:['Cactus','サボテン'],pine_log:['Pine Log','松の丸太'],pine_leaves:['Pine Needles','松の葉'],duskstone:['Duskstone','ダスクストーン'],portal:['Gate Light','門の光'],gold_block:['Honeygold Block','ハニーゴールドブロック'],iron_block:['Iron Block','鉄ブロック'],bed:['Bed','ベッド'],mossy:['Mossy Stone','苔石'],felt_pink:['Pink Felt','ピンクのフェルト'],felt_blue:['Blue Felt','青いフェルト'],felt_yellow:['Yellow Felt','黄色いフェルト'],felt_green:['Green Felt','緑のフェルト'],lamp:['Honey Lamp','はちみつランプ'],gloomgrass:['Gloom Grass','やみの草'],gloom_log:['Gloom Log','やみの丸太'],gloom_leaves:['Gloom Leaves','やみの葉'],berry_bush:['Berry Bush','ベリーの茂み'],stone_bricks:['Stone Bricks','石レンガ'],mushroom:['Mushroom','キノコ'],hoardstone:['Hoardstone','ホードストーン'],web:['Cobweb','クモの巣'],star_block:['Starshard Block','スターシャードブロック'],sapling:['Sapling','苗木'],gate:['Lantern Gate','ランタンの門'],socket:['Shard Socket','かけらの台座'],wheat0:['Wheat Crop','小麦の作物'],
 stick:['Stick','棒'],coal:['Coal','石炭'],iron_ingot:['Iron Ingot','鉄インゴット'],gold_ingot:['Honeygold Ingot','ハニーゴールドインゴット'],starshard:['Starshard','スターシャード'],coin:['Coin','コイン'],yarn:['Yarn','毛糸'],spore:['Spore','胞子'],thorn:['Thorn','トゲ'],arrow:['Arrow','矢'],bow:['Bow','弓'],apple:['Apple','りんご'],bread:['Bread','パン'],berries:['Berries','ベリー'],wheat:['Wheat','小麦'],seeds:['Seeds','種'],raw_mutton:['Raw Mutton','生の羊肉'],cooked_mutton:['Cooked Mutton','焼いた羊肉'],grow_dust:['Grow Dust','成長の粉'],
 sun_shard:['Sun Shard','太陽のかけら'],frost_shard:['Frost Shard','氷のかけら'],gloom_shard:['Gloom Shard','やみのかけら'],honey:['Honey Jar','はちみつのビン'],crown:['Spare Crown','予備の王冠'],cooked_fish:['Cooked Fish','焼き魚']};
const TIER={wood:['Wooden','木の'],stone:['Stone','石の'],iron:['Iron','鉄の'],star:['Starshard','スターシャードの'],felt:['Felt','フェルトの']};
const PART={sword:['Sword','剣'],pick:['Pickaxe','ツルハシ'],axe:['Axe','オノ'],shovel:['Shovel','シャベル'],helmet:['Helmet','ヘルメット'],chest:['Chestplate','チェストプレート'],legs:['Leggings','レギンス'],boots:['Boots','ブーツ']};
export const lang=()=>G.opt&&G.opt.lang==='ja'?1:0;
export function T(k,vars){const e=S[k];let s=e?e[lang()]:k;if(vars)for(const[a,b]of Object.entries(vars))s=s.split('{'+a+'}').join(b);return s}
export function tx(o){if(!o)return'';if(typeof o==='string')return o;return lang()?(o.ja||o.en):o.en}
export function itemName(id){const d=def(id);if(!d)return'?';let k=d.key||'';if(/^wheat\d/.test(k))k='wheat0';if(N[k])return N[k][lang()];const m=k.match(/^(wood|stone|iron|star|felt)_(\w+)$/);if(m&&PART[m[2]]){const t=TIER[m[1]][lang()],p=PART[m[2]][lang()];return lang()?t+p:t+' '+p}return k}
