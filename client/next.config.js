const path = require('path')

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['img.a.transfermarkt.technology'],
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'src', 'styles', 'components'),
      path.join(__dirname, 'src', 'styles', 'pages'),
    ],
    prependData: `@import "../main.scss";`,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}
