// Used by `npm run start:tunnel`: the API is reached through the dev server's
// proxy (proxy.tunnel.json → localhost:1337), so a single public tunnel to
// port 4200 serves both the app and Strapi — no second tunnel, no CORS setup.
export const environment = {
  production: false,
  apiUrl: '',
};
