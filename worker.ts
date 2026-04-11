// Complete worker with API and static assets
export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle ads.txt redirect
    if (url.pathname === '/ads.txt') {
      return Response.redirect(
        'https://srv.adstxtmanager.com/19390/ikuttes.my.id',
        301
      );
    }

    // API routes - proxy to working API worker
    if (url.pathname.startsWith('/drills/') || 
        url.pathname.startsWith('/quiz/') || 
        url.pathname.startsWith('/exam/') || 
        url.pathname.startsWith('/auth/') || 
        url.pathname.startsWith('/user/') || 
        url.pathname.startsWith('/questions/') || 
        url.pathname.startsWith('/explanations/') || 
        url.pathname.startsWith('/analytics/') || 
        url.pathname.startsWith('/rank/') || 
        url.pathname.startsWith('/tryout/') || 
        url.pathname.startsWith('/health') || 
        url.pathname.startsWith('/db/')) {
      
      // Proxy to the working API worker
      const apiUrl = `https://ikuttes.robimaulanaspsi.workers.dev${url.pathname}${url.search}`;
      
      // Clone the request to avoid body already used error
      const requestClone = new Request(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
      });
      
      return fetch(requestClone);
    }

    // Static assets and SPA fallback
    const response = await env.ASSETS.fetch(request);
    
    // Add cache-busting headers to prevent stale deployments
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
