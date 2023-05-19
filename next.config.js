/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\@stacks\//,
      type: "asset/source",
    });
    return config;
  },
};
