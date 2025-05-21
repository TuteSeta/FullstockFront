"use client";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ label = "Volver" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition mb-4 mt-4"
    >
      <ArrowLeft className="w-5 h-5" />
      {label}
    </button>
  );
}
