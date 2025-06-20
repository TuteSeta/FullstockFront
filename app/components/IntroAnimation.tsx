'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

export default function IntroAnimation() {
  return (
    <div className="absolute inset-0 bg-[#111] z-50 flex flex-col items-center justify-start pt-24">
      <div className="flex flex-col items-center w-[200px]">
        <motion.h1
          className="text-white text-4xl font-bold mb-4 text-center"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          FullStock
        </motion.h1>
        <DotLottieReact
          src="https://lottie.host/d50d8a9c-3d5b-467e-aa5b-a29305cbaf14/pPXIdG5pKV.lottie"
          autoplay
          loop={false}
          style={{ height: '200px', width: '200px', filter: 'invert(1)' }}
        />
      </div>
    </div>
  );
}
