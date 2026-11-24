// Ελάχιστος service worker: απαραίτητος για εγκατάσταση σε Chrome/Android και κρατά στη μνήμη τους ήχους οργάνων.
const CACHE='arpa-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;
  if(u.pathname.includes('/sf/')){            // δείγματα ήχου: από τη μνήμη πρώτα
    e.respondWith(caches.open(CACHE).then(async c=>{ const hit=await c.match(r); if(hit) return hit; const res=await fetch(r); if(res.ok) c.put(r,res.clone()); return res; }));
  } else {                                     // υπόλοιπα: δίκτυο πρώτα, μνήμη αν είσαι εκτός σύνδεσης
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); return res; }).catch(()=>caches.match(r)));
  }
});
