import re
CSS='''
.cinecv{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;display:block}
.cinestop{position:absolute;right:12px;top:10px;z-index:5;font:800 14px system-ui;min-height:42px;padding:8px 14px;border-radius:999px;border:2px solid #241816;background:#ff6f6f;color:#fff;cursor:pointer;box-shadow:0 3px 0 #241816}
body.cine .tools,body.cine .top{display:none}
.knav{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}
.kbusy{margin:8px 0;padding:10px 12px;border-radius:12px;background:#f1ecff;color:#3a2a6a;font-weight:700;animation:kp 1.2s ease-in-out infinite alternate}@keyframes kp{from{opacity:.65}to{opacity:1}}
.kg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:8px 0}.kg label,.kfull{display:flex;flex-direction:column;gap:3px;font-size:13px;font-weight:600;color:#5a4a6a;min-width:0}.kfull{margin:8px 0}
.kg select,.kg input,.kfull select,.kg3 select{font:600 14px system-ui;min-height:40px;border:2px solid #e3d7ef;border-radius:10px;padding:6px 8px;background:#fff;color:#241a30;min-width:0;width:100%}
.kg input[type=range]{border:0;padding:0}
.kbig{min-height:220px;font-size:15px;line-height:1.45}
textarea.txt{width:100%;resize:vertical;font-family:inherit}
.kmem{background:#fff4d6;border-radius:12px;padding:8px 10px;font-size:13px}
.kcast{display:flex;flex-wrap:wrap;gap:8px}.kcard{display:flex;flex-direction:column;align-items:center;gap:3px;width:84px;padding:5px;border:2px solid #e3d7ef;border-radius:14px;background:#fff;cursor:pointer;font:600 12px system-ui;color:#2a1d36}
.kcard img,.kcard .ph{width:70px;height:70px;border-radius:10px;object-fit:cover;background:#f6dcc6;display:flex;align-items:center;justify-content:center;font-size:30px}.kcard[aria-pressed=true]{border-color:#7a5cff;background:#f1ecff;box-shadow:0 0 0 2px #7a5cff}
.kcard span:last-child{max-width:76px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ksum{background:#fbf8fd;border:2px solid #efe6f7;border-radius:14px;padding:10px 12px;margin:8px 0;font-size:14px}
.kshots{display:flex;flex-direction:column;gap:10px}.kshot{border:2px solid #e8dff2;border-radius:16px;padding:8px;background:#fff}.kshot.ok{border-color:#6cc58a;background:#f4fbf6}
.kst{display:flex;gap:10px;align-items:flex-start}.kth{position:relative;flex:0 0 132px;height:74px;border:0;padding:0;border-radius:10px;overflow:hidden;background:#241a30;cursor:pointer}.kth img{width:100%;height:100%;object-fit:cover;display:block}
.kpl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;text-shadow:0 1px 4px #000;opacity:.85}
.kin{min-width:0;font-size:13px;line-height:1.5}.kbadge{display:inline-block;font-size:11.5px;font-weight:700;padding:1px 7px;border-radius:999px;background:#efe8ff;color:#4a3a8a;margin:1px 0}
.kdesc{font-size:13px;margin:6px 2px 2px}.ksay{font-size:14px;margin:4px 2px;padding:6px 9px;background:#fff8e6;border-radius:10px}.kno{font-size:12.5px;margin:2px}
.kbtns{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.kbtns button{font:700 13px system-ui;min-height:36px;padding:5px 10px;border-radius:10px;border:2px solid #e3d7ef;background:#fff;color:#2a1d36;cursor:pointer}
.kbtns .kok{margin-left:auto}.kbtns .kok[aria-pressed=true]{background:#6cc58a;border-color:#3f9e5f;color:#fff}
.ked{margin-top:8px;border-top:2px dashed #eadff3;padding-top:6px}.kl{display:block;font-size:13px;color:#5a4a6a;margin:8px 0 4px}.kc{margin:4px 0}.kg3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin:4px 0 6px}
.kvo{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.kvo .kl{margin:0 6px 0 0}
.kgen{margin:14px 0;text-align:center}.btn.big{font-size:17px;min-height:54px;padding:10px 22px;background:#7a5cff;color:#fff}
.kvid{width:100%;border-radius:12px;background:#000;aspect-ratio:16/9}
.kmini{display:flex;flex-wrap:wrap;gap:6px}.kmini button,.kloc{position:relative;width:96px;border:2px solid #e3d7ef;border-radius:10px;padding:0;overflow:hidden;background:#fff;cursor:pointer;font:600 11px system-ui}
.kmini img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}.kmini button span{position:absolute;left:4px;top:3px;color:#fff;text-shadow:0 1px 3px #000;font-weight:800}.kloc span{display:block;padding:3px 4px}
.klib{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:6px 0;font-size:13px}.klib .x{margin-left:auto}
'''
s=open('creator.js').read().replace('/* @@CINE@@ */',open('cine.part.js').read())
for fn,embed in (('creator.html',False),('creator3d.html',True)):
  h=open(fn).read()
  if '.cinecv{' not in h:h=h.replace('</style>',CSS+'</style>',1)
  i1=h.index('<script>');i2=h.index('</script>',i1)+9;i3=h.index('<script>',i2);i4=h.index('</script>',i3)+9
  app=s
  if embed: app=app.replace('async function saveFile(blob,name){','async function saveFile(blob,name){if(window.parent!==window){try{window.parent.postMessage({type:"cc3d-save",name,blob},location.origin);toast("Saving…");return}catch(e){}}')
  assert '</script' not in app
  h=h[:i3]+'<script>'+app+'</script>'+h[i4:]
  open(fn,'w').write(h)
print("built",len(s))
