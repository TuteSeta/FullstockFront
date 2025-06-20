'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const IntroAnimation = dynamic(() => import('./IntroAnimation'), { ssr: false });

export default function ClientTransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
    setShowContent(false); // ocultar contenido al iniciar transición

    const timeout = setTimeout(() => {
      setShowAnimation(false);
      setShowContent(true); // mostrar solo cuando termina
    }, 2000); // ⏱️ duración de animación

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="relative w-full h-full">
      {showAnimation && <IntroAnimation />}
      {showContent && (
        <div className="transition-opacity duration-300 opacity-100">
          {children}
        </div>
      )}
    </div>
  );
}
