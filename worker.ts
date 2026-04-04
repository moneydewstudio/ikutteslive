// TEAM_022: Redirect /ads.txt to Ezoic Ads.txt Manager while serving the SPA from static assets.

export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/ads.txt') {
      return Response.redirect(
        'https://srv.adstxtmanager.com/19390/ikuttes.my.id',
        301
      );
    }

    return env.ASSETS.fetch(request);
  },
};
