/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/checkout': ['./public/FROSTLINEwhiteLOGOonly.png', './public/images/email-maribank-qr.png'],
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

