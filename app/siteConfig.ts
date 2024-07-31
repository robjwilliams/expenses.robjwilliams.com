export const siteConfig = {
  name: "Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/",
    overview: "/overview",
    purchases: "/purchases",
    settings: "/settings",
  },
  externalLink: {
    blocks: "https://blocks.tremor.so/templates#dashboard",
  },
};

export type siteConfig = typeof siteConfig;
