export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
  authorizedParties: [
    "https://filmfind.online",
    "https://www.filmfind.online",
    "http://localhost:3000",
  ],
};
