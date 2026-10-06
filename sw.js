/* ===== Service Worker：Pyodide 运行时持久缓存（在线版加速） =====
 * 只缓存 libs/pyodide/ 下的运行时大文件（约 13MB），其余请求一律直通网络。
 * 首次「运行」后运行时进入 Cache Storage，之后访问在线版秒加载；
 * file:// 本地打开时不会注册（见 app.js 的协议判断），不影响离线包。
 * 升级 Pyodide 版本时把 CACHE 名一并改掉，让用户端重新缓存。
 */
const CACHE = "pyodide-rt-0.26.4";
const PREFIX = "/libs/pyodide/";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("pyodide-rt-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin || !url.pathname.includes(PREFIX)) return;
  // 缓存优先：命中直接返回；未命中走网络并顺手写入缓存
  e.respondWith(
    caches.match(e.request).then(
      (hit) =>
        hit ||
        fetch(e.request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
    )
  );
});
