import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  default: {},
  middleware: {
    external: true,
  },
};

export default config;
