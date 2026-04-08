import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "photo.yupoo.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "photo3.yupoo.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.szwego.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "xcimg.szwego.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "a202407061430087932002123.wecatalog.cn",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
