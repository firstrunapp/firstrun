module.exports = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  basePath: "/config",
  async redirects() {
    return [
      {
        source: '/',
        destination: '/config',
        permanent: false,
      },
    ]
  },
}
