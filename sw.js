/* هر بار index.html یا استایل‌ها تغییر کرد، این شماره را یکی بالا ببرید (ct-v19 → ct-v20 …).
   پاک‌شدن کش فقط فایل‌های ظاهری اپ را تازه می‌کند؛ اطلاعات (امتیازها، یادداشت‌ها، شماره دانشجویی) دست نمی‌خورد. */
const V='ct-v24',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
  // Apps Script، Google Drive، فونت‌ها و هر درخواست POST یا Range: همیشه مستقیم از شبکه (بدون کش)
  if(r.method!=='GET'||u.origin!==location.origin||r.headers.has('range'))return;
  // خود صفحه: اول شبکه (همیشه تازه‌ترین نسخه)، اگر اینترنت نبود از کش
  if(r.mode==='navigate'){e.respondWith(fetch(r,{cache:'no-cache'}).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put('index.html',c))}return x}).catch(()=>caches.match('index.html')));return}
  // آیکون‌ها و manifest: از کش، و در پس‌زمینه به‌روزرسانی
  e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x}).catch(()=>m);return m||n}))});
