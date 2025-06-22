/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  output: 'server',
  staticPageGenerationTimeout: 1200,
  unstable_excludeFiles: [
    '**/app/admin/**/*.js',
    '**/app/admin/**/*.ts',
    '**/app/admin/**/*.tsx',
  ],
}

export default nextConfig
