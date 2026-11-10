#!/bin/sh
# Re-subset vendored fonts. Japanese subset covers only the strings in index.html's pickerData.
set -e; cd "$(dirname "$0")/../.."
python3 -c "
import json,re
d=re.search(r'<script id=\"pickerData\" type=\"application/json\">(.*?)</script>',open('index.html').read(),re.S).group(1)
print(''.join(sorted(set(c for c in d if ord(c)>0x2000)))+'・…—「」、。！？：（）',end='')" > /tmp/hv_jp.txt
for w in Regular Bold; do l=$(echo $w | tr A-Z a-z)
pyftsubset /usr/share/fonts/opentype/noto/NotoSansCJK-$w.ttc --font-number=0 --text-file=/tmp/hv_jp.txt --flavor=woff2 --output-file=picker/fonts/noto-jp-$l-subset.woff2; done
