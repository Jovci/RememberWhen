/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false
  },
  images: {
    domains: [
      'scontent.fyzd1-3.fna.fbcdn.net',
      'instagram.fyto1-2.fna.fbcdn.net',
      'assets.vogue.com',
      'm.media-amazon.com',
      'upload.wikimedia.org'
    ]
  },
/*   async rewrites() {
    return [
      {
        source: '/index',
        destination: '/map/index',
      },
    ];
  } */
}

export default nextConfig