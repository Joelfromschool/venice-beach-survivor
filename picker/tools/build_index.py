#!/usr/bin/env python3
"""Generates /index.html (the game picker) from the GAMES table below.
Static output; GitHub Pages serves it as-is. Run: python3 picker/tools/build_index.py"""
import json, html, os, subprocess
from datetime import datetime
from zoneinfo import ZoneInfo
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
TZ = ZoneInfo('America/New_York')

def git_meta(game_id):
    """Commit count and last-updated date (America/New_York) for a game folder."""
    n = int(subprocess.check_output(
        ['git', 'rev-list', '--count', 'HEAD', '--', game_id], cwd=ROOT).decode().strip())
    raw = subprocess.check_output(
        ['git', 'log', '-1', '--format=%cI', '--', game_id], cwd=ROOT).decode().strip()
    dt = datetime.fromisoformat(raw).astimezone(TZ)
    return n, dt.strftime('%Y-%m-%d')


# id, href, new, rows, focus(object-position), EN, JA
GAMES = [
 dict(id='blockhaven', new=True, cat='adv', pos='50% 50%',
  en=('Blockhaven','Voxel adventure RPG','Mine, build and quest from Honeyvale to a blocky Santa Monica pier and Venice boardwalk. 16 quests, five bosses.'),
  ja=('ブロックヘイブン','ボクセル・アドベンチャーRPG','ハニーヴェイルから、ブロックでできたサンタモニカの桟橋とベニスの遊歩道へ。16のクエストと5体のボスが待っている。')),
 dict(id='unstitched', cat='adv', pos='50% 50%',
  en=('The Unstitched Kingdom','Story action RPG','A handmade kingdom is coming apart at the seams. Gather a party and mend six stitched-together worlds.'),
  ja=('ほどけた王国','ストーリー・アクションRPG','手づくりの王国がほころび始めた。仲間を集めて、6つの世界を縫い直そう。')),
 dict(id='hordes', cat='act', pos='50% 50%',
  en=('Honey Hordes','Survivor action','Something hungry is marching on Honeyvale. Keep moving, grab the shiny bits and survive the swarm.'),
  ja=('ハニーホード','サバイバー・アクション','おなかをすかせた大群がハニーヴェイルに迫る。動き続けて、キラキラを集めて、生き残れ。')),
 dict(id='kingdom', cat='puz', pos='50% 50%',
  en=('Honeyvale Defense','Tower defense','Build archers, mages and barracks along the road and hold the line against goblins, ghosts and trolls.'),
  ja=('ハニーヴェイル・ディフェンス','タワーディフェンス','道ぞいに弓兵・魔法使い・兵舎を建てて、ゴブリンやおばけ、トロルから村を守ろう。')),
 dict(id='tilemaster', cat='puz', pos='50% 50%',
  en=('Tile Master','Tile-matching puzzle',"Pooh's money-matching puzzle. Tap three of a kind to clear the stack before the tray fills up."),
  ja=('タイルマスター','タイル合わせパズル','プーのお金合わせパズル。トレイがいっぱいになる前に、同じタイルを3つそろえよう。')),
 dict(id='punchout', cat='act', pos='50% 40%',
  en=("Pooh's Punch Out",'Pixel boxing','From broke to champ. Read the tells, dodge, and counter your way up the ladder.'),
  ja=('プーのパンチアウト','ピクセル・ボクシング','ビンボーからチャンピオンへ。クセを読んで、かわして、カウンターで勝ち上がれ。')),
 dict(id='pinco', cat='puz', pos='50% 50%',
  en=('Pinco Pretty Princess','Dress-up & dance party','Style an outfit for the theme, strut the runway, and unlock dance-party movies.'),
  ja=('ピンコ・プリティ・プリンセス','きせかえ&ダンスパーティー','テーマに合わせてコーデして、ランウェイを歩いて、ダンスパーティーのムービーを集めよう。')),
 dict(id='secret', cat='puz', pos='50% 50%', secret=True,
  en=('Secret Project','Password required',"Something is waiting behind the pumpkin. You'll need the password."),
  ja=('シークレット・プロジェクト','パスワードが必要','かぼちゃの向こうで、なにかが待っている。パスワードを知っているなら……')),
 dict(id='beanrpg', cat='adv', pos='50% 50%',
  en=('Mr Bean RPG','Adventure RPG','Explore the town, the park and the dungeon with Mr Bean. Collect, battle and fill your journal.'),
  ja=('ミスター・ビーンRPG','アドベンチャーRPG','ミスター・ビーンと町・公園・ダンジョンを冒険。集めて、戦って、ずかんを埋めよう。')),
 dict(id='venice', cat='act', pos='50% 50%',
  en=('Venice Beach Survivor','Arcade survivor','Hit the boardwalk at sunset and outlast the chaos with a crew of beach locals.'),
  ja=('ベニスビーチ・サバイバー','アーケード・サバイバー','夕暮れのボードウォークで、ビーチの仲間たちとカオスを生きのびろ。')),
 dict(id='space', cat='puz', pos='50% 50%',
  en=('Mr Bean & Pooh: Space','Space maze','Mr Bean and Pooh drift through a maze among the stars. Find the way out.'),
  ja=('ミスター・ビーン&プー:スペース','スペース迷路','ミスター・ビーンとプーが星空の迷路へ。出口を見つけよう。')),
 dict(id='turf', cat='act', pos='50% 50%',
  en=('Turf Splat','Paintball FPS',"Paint the block in your crew's colors. Claim turf, splat rivals, hold the neighborhood."),
  ja=('ターフ・スプラット','ペイントボールFPS','街をチームの色に塗りかえろ。なわばりを広げて、ライバルをスプラット。')),
 dict(id='mossheart', cat='act', pos='50% 50%',
  en=('Mossheart','Forest FPS','Pick a side, forest spirits or the Ironworks, and fight for the sunlit grove.'),
  ja=('モスハート','森のFPS','森の精霊か、鉄工団か。陣営を選んで、光の森をかけて戦え。')),
 dict(id='gladiator', cat='adv', pos='50% 50%',
  en=('Atticus Vorn','Gladiator RPG','From slave to Champion of Rome. Fight in the arena, gather a party and win your freedom.'),
  ja=('アティカス・ヴォーン','剣闘士RPG','奴隷からローマの王者へ。闘技場で戦い、仲間を集め、自由を勝ち取れ。')),
]
ROWS = [
 ('all',  'All games',                 'すべてのゲーム', None),
 ('adv',  'Adventures & RPGs',         'アドベンチャー&RPG', 'adv'),
 ('act',  'Action & shooters',         'アクション&シューター', 'act'),
 ('puz',  'Puzzle, strategy & party',  'パズル・ストラテジー・パーティー', 'puz'),
]
UI = {
 'en': dict(brand_sub='Games', play='Play', open_secret='Unlock', newb='New', jump='Jump back in', last='Last played',
            lang='日本語', lang_label='Switch to Japanese', hint='Swipe the rows · tap a tile twice to play',
            pw_title='Secret Project', pw_sub='Enter the password', pw_wrong='Wrong password', pw_open='Open', pw_cancel='Cancel',
            skip='Skip to games', count='14 games'),
 'ja': dict(brand_sub='ゲームズ', play='あそぶ', open_secret='ひらく', newb='NEW', jump='つづきから', last='さいごにあそんだ',
            lang='English', lang_label='英語に切り替え', hint='横にスワイプ · タイルを2回タップであそぶ',
            pw_title='シークレット・プロジェクト', pw_sub='パスワードを入力', pw_wrong='パスワードがちがいます', pw_open='ひらく', pw_cancel='キャンセル',
            skip='ゲーム一覧へ', count='14タイトル'),
}
E = html.escape

def tile(g, row, first_secret):
    t, genre, _ = g['en']
    sid = ' id="secretTile"' if first_secret else ''
    cls = 'tile' + (' is-secret' if g.get('secret') else '')
    badge = f'<span class="badge" data-i18n="newb">New</span>' if g.get('new') else ''
    return (f'<a class="{cls}"{sid} href="{g["id"]}/" data-game="{g["id"]}" data-row="{row}">'
            f'<img src="picker/tiles/{g["id"]}.webp" alt="" loading="lazy" decoding="async" width="640" height="360">'
            f'<span class="tile-shade"></span>{badge}'
            f'<span class="tile-text"><span class="tile-title" data-t="{g["id"]}">{E(t)}</span>'
            f'<span class="tile-genre" data-g="{g["id"]}">{E(genre)}</span></span></a>')

def build():
    rows_html = []
    secret_done = False
    for rid, en, ja, cat in ROWS:
        items = [g for g in GAMES if cat is None or g['cat'] == cat]
        tiles = []
        for g in items:
            fs = g.get('secret') and not secret_done
            if fs: secret_done = True
            tiles.append(tile(g, rid, fs))
        rows_html.append(
          f'<section class="row" data-rowid="{rid}" aria-labelledby="h-{rid}">'
          f'<h2 class="row-title" id="h-{rid}" data-i18n-row="{rid}">{E(en)}</h2>'
          f'<div class="row-wrap"><button class="row-nav prev" type="button" aria-label="Scroll left" tabindex="-1">‹</button>'
          f'<div class="track" role="list">{"".join(tiles)}</div>'
          f'<button class="row-nav next" type="button" aria-label="Scroll right" tabindex="-1">›</button></div></section>')
    first = GAMES[0]
    metas = {g['id']: git_meta(g['id']) for g in GAMES}
    def game_payload(g):
        rev, updated = metas[g['id']]
        return dict(id=g['id'], new=bool(g.get('new')), secret=bool(g.get('secret')), pos=g['pos'],
                    en=g['en'], ja=g['ja'], rev=rev, updated=updated)
    data = dict(games=[game_payload(g) for g in GAMES],
                rows={rid: dict(en=en, ja=ja) for rid, en, ja, _ in ROWS}, ui=UI)
    page = TEMPLATE
    r0, u0 = metas[first['id']]
    def fmt_en(n, iso):
        months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split()
        y, m, d = iso.split('-')
        word = 'revision' if n == 1 else 'revisions'
        return f"{n} {word} · Last updated {months[int(m)-1]} {int(d)}, {y}"
    rep = {
      '%%ROWS%%': ''.join(rows_html),
      '%%DATA%%': json.dumps(data, ensure_ascii=False, separators=(',', ':')),
      '%%T%%': E(first['en'][0]), '%%G%%': E(first['en'][1]), '%%D%%': E(first['en'][2]),
      '%%ID%%': first['id'],
      '%%META%%': E(fmt_en(r0, u0)),
    }
    for k, v in rep.items(): page = page.replace(k, v)
    open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(page)
    print('wrote index.html', len(page), 'bytes')

TEMPLATE = r'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0b0c0f">
<title>Honeyvale Games</title>
<link rel="icon" href="picker/favicon.svg" type="image/svg+xml">
<link rel="preload" href="picker/fonts/sora-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="picker/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="picker/picker.css">
<script>(function(){try{if(sessionStorage.getItem("lg-splash-seen")==="1"||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches))document.documentElement.classList.add("lg-splash-skip")}catch(e){document.documentElement.classList.add("lg-splash-skip")}})();</script>
</head>
<body>
<div id="lgSplash" class="lg-splash" role="dialog" aria-label="LANZAGAMES" aria-modal="true">
  <div class="lg-lockup">
    <h1 class="lg-wm">LANZAGAMES</h1>
    <div class="lg-letters" aria-hidden="true"></div>
  </div>
</div>
<a class="skip" href="#rows" data-i18n="skip">Skip to games</a>
<header class="top">
  <a class="brand" href="./" aria-label="Honeyvale Games">
    <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M16 10.2 21 13.1v5.8L16 21.8l-5-2.9v-5.8Z" fill="currentColor"/></svg>
    <span class="brand-name">Honeyvale</span><span class="brand-sub" data-i18n="brand_sub">Games</span>
  </a>
  <button class="lang" id="langBtn" type="button" lang="ja" aria-label="Switch to Japanese">日本語</button>
</header>

<main>
<section class="hero" id="hero" aria-live="polite">
  <div class="hero-media" aria-hidden="true">
    <img class="hero-poster" id="heroPoster" src="picker/posters/%%ID%%.webp" alt="" style="object-position:50% 50%">
    <video class="hero-video" id="vA" muted playsinline loop preload="none" disablepictureinpicture></video>
    <video class="hero-video" id="vB" muted playsinline loop preload="none" disablepictureinpicture></video>
  </div>
  <div class="hero-scrim" aria-hidden="true"></div>
  <div class="hero-body">
    <p class="hero-eyebrow"><span class="badge hero-new" id="heroNew" data-i18n="newb">New</span><span id="heroGenre">%%G%%</span></p>
    <h1 class="hero-title" id="heroTitle">%%T%%</h1>
    <p class="hero-desc" id="heroDesc">%%D%%</p>
    <div class="hero-actions">
      <a class="btn-play" id="heroPlay" href="%%ID%%/" data-game="%%ID%%"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg><span id="heroPlayLabel" data-i18n="play">Play</span></a>
      <span class="hero-hint" data-i18n="hint">Swipe the rows · tap a tile twice to play</span>
      <p class="hero-meta" id="heroMeta">%%META%%</p>
    </div>
  </div>
</section>

<div class="rows" id="rows">
  <section class="row" id="continueRow" hidden aria-labelledby="h-cont">
    <h2 class="row-title" id="h-cont" data-i18n="jump">Jump back in</h2>
    <div class="row-wrap"><div class="track" id="continueTrack" role="list"></div></div>
  </section>
  %%ROWS%%
</div>
<footer class="foot"><span data-i18n="count">14 games</span> · Honeyvale</footer>
</main>

<div id="spGate" class="gate" role="dialog" aria-modal="true" aria-labelledby="spTitle" style="display:none">
  <div class="gate-card">
    <img class="gate-art" src="picker/posters/secret.webp" alt="">
    <div class="gate-body">
      <h2 id="spTitle" data-i18n="pw_title">Secret Project</h2>
      <label for="spPw" data-i18n="pw_sub">Enter the password</label>
      <input id="spPw" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go">
      <div id="spErr" class="gate-err" role="alert"></div>
      <button id="spGo" class="btn-play gate-go" type="button" data-i18n="pw_open">Open</button>
      <button id="spX" class="gate-cancel" type="button" data-i18n="pw_cancel">Cancel</button>
    </div>
  </div>
</div>

<script id="pickerData" type="application/json">%%DATA%%</script>
<script src="picker/splash.js" defer></script>
<script src="picker/picker.js" defer></script>
</body>
</html>
'''
if __name__ == '__main__':
    build()
