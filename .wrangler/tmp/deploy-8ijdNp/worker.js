// worker.ts
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/ads.txt") {
      return Response.redirect(
        "https://srv.adstxtmanager.com/19390/ikuttes.my.id",
        301
      );
    }
    if (url.pathname.startsWith("/drills/") || url.pathname.startsWith("/quiz/") || url.pathname.startsWith("/exam/") || url.pathname.startsWith("/auth/") || url.pathname.startsWith("/user/") || url.pathname.startsWith("/questions/") || url.pathname.startsWith("/explanations/") || url.pathname.startsWith("/analytics/") || url.pathname.startsWith("/rank/") || url.pathname.startsWith("/tryout/") || url.pathname.startsWith("/health") || url.pathname.startsWith("/db/")) {
      const apiUrl = `https://ikuttes.robimaulanaspsi.workers.dev${url.pathname}${url.search}`;
      const requestClone = new Request(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : void 0
      });
      return fetch(requestClone);
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
