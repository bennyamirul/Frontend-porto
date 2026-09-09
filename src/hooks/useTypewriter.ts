"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterOptions = {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
};

type TypewriterPhase = "typing" | "pausing" | "deleting";

/**
 * Membuat teks typewriter yang mengetik, menunggu, lalu menghapus kata secara looping.
 * Hook ini dipilih agar efek hero tetap kecil, mudah dipahami, dan tidak menambah dependency baru.
 */
export function useTypewriter({ words, typingSpeed = 80, deletingSpeed = 45, pauseMs = 1200 }: TypewriterOptions) {
  const wordsKey = words.join("\u0000");
  const safeWords = useMemo(() => wordsKey.split("\u0000").filter(Boolean), [wordsKey]);
  const [wordIndex, setWordIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>("typing");

  useEffect(() => {
    if (safeWords.length === 0) {
      return;
    }

    const activeWord = safeWords[wordIndex] ?? safeWords[0];
    const visibleLetterCount = Math.min(letterCount, activeWord.length);
    const delay = phase === "pausing" ? pauseMs : phase === "typing" ? typingSpeed : deletingSpeed;

    const timer = window.setTimeout(() => {
      if (phase === "typing") {
        if (visibleLetterCount < activeWord.length) {
          setLetterCount(visibleLetterCount + 1);
          return;
        }

        // Saat satu kata selesai diketik, beri jeda agar pengunjung sempat membacanya.
        setPhase("pausing");
        return;
      }

      if (phase === "pausing") {
        setPhase("deleting");
        return;
      }

      if (visibleLetterCount > 0) {
        setLetterCount(visibleLetterCount - 1);
        return;
      }

      // Setelah teks kosong, pindah ke kata berikutnya dan mulai siklus mengetik lagi.
      setWordIndex((currentIndex) => (currentIndex + 1) % safeWords.length);
      setLetterCount(0);
      setPhase("typing");
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deletingSpeed, letterCount, pauseMs, phase, safeWords, typingSpeed, wordIndex]);

  return safeWords.length > 0 ? (safeWords[wordIndex] ?? "").slice(0, letterCount) : "";
}
