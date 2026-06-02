import removeImports from 'next-remove-imports'

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ['172.30.29.80'],
}

export default removeImports()(nextConfig)

