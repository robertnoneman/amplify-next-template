import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ItsRobday PWA',
    short_name: 'ItsRobday',
    description: 'A Progressive Web App for itsRobday.com built with Next.js',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/RobdayIcon.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/RobdayIcon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}