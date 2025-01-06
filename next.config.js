/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t.s3.us-east-1.amazonaws.com',
            port: '',
            pathname: '/picture-submissions/**',
          },
          {
            protocol: 'https',
            hostname: 'amplify-d2e7zdl8lpqran-ma-robdayimagesbuckete97c22-bwldlxhxdd4t.s3.us-east-1.amazonaws.com',
            port: '',
            pathname: '/**',
          }
        ],
      },
}

module.exports = nextConfig
