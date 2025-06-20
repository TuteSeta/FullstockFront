'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

export default function IntroAnimation() {
  return (
    <div className="absolute inset-0 bg-[#111] z-50 grid place-items-center px-4">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h1
          className="text-white text-5xl font-bold mb-6 text-center"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          FullStock
        </motion.h1>

        <DotLottieReact
          src="https://lottie.host/d50d8a9c-3d5b-467e-aa5b-a29305cbaf14/pPXIdG5pKV.lottie"
          autoplay
          loop={false}
          style={{
            height: '300px',
            width: '300px',
            filter: 'invert(1)',
          }}
        />

        <motion.p
          className="text-gray-400 mt-6 text-sm tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Cargando sistema de inventario...
        </motion.p>
      </motion.div>
    </div>
  );
}
