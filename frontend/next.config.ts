// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // styled-components를 위한 SWC 컴파일러 설정 추가
    styledComponents: true,
  },
};

export default nextConfig;