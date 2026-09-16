/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Remplace par le domaine de ton projet Supabase, ex: abcdefgh.supabase.co
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
