import re,json,shutil,os
B=json.load(open('version.json'))['build']
s=open('src/shell.html').read()
upd=open('/tmp/vbs/gladiator/index.html').read();i=upd.find('version.json');j=upd.rfind('<script',0,i);upd=upd[j:upd.find('</script>',i)+9].replace('"VBF",sans-serif','ui-rounded,system-ui,sans-serif').replace('#1a1530ee','#8e44ecee').replace('#ffe58a','#fff')
g=open('src/game.js').read().replace('Fredoka,"Baloo 2",system-ui,sans-serif','ui-rounded,"Arial Rounded MT Bold",system-ui,sans-serif').replace('Fredoka,system-ui','ui-rounded,"Arial Rounded MT Bold",system-ui')
s=s.replace('%BUILD%',B).replace('%ITEMS%',open('src/items.js').read()+'\n'+open('src/items2.js').read()+'\n'+open('src/i18n.js').read()).replace('%GAME%',g+'\n'+open('src/game2.js').read().replace('Fredoka,system-ui','ui-rounded,system-ui')+''.join('\n'+open('src/game3'+c+'.js').read() for c in 'abcdef')).replace('%UPD%',upd)
for out in ['/tmp/vbs/pinco','/workspace/venice-pages/pinco']:
  os.makedirs(out+'/art',exist_ok=True);open(out+'/index.html','w').write(s);shutil.copy('version.json',out)
  for f in ['manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png']:
    if os.path.exists(f):shutil.copy(f,out)
  [shutil.copy('art/'+f,out+'/art/') for f in ['pinco.png','j_bean.png','j_kermit.png','j_pooh.png','j_king.png']+['c_'+n+'.png' for n in ['party','holiday','baller','mole','tad','leaf']]]
print('built',B,len(s))
