"use client";

import { useState, useEffect, useCallback } from "react";
import type { Testimonial } from "@/lib/types";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(next, 8000); // Auto-advance every 8 seconds
    return () => clearInterval(interval);
  }, [next, testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      <div className="absolute -top-10 -left-6 md:-left-12 opacity-10 dark:opacity-20">
        <Quote size={120} />
      </div>

      <div className="relative z-10 card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 md:p-12 text-center shadow-xl">
        {/* Rating */}
        <div className="flex justify-center gap-1 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={i < t.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"}
              fill="currentColor"
            />
          ))}
        </div>

        {/* Content */}
        <p className="text-xl md:text-3xl font-medium leading-relaxed text-foreground dark:text-white mb-10 min-h-[120px] flex items-center justify-center">
          &ldquo;{t.content}&rdquo;
        </p>

        {/* Client Info */}
        <div className="flex flex-col items-center">
          {t.client_avatar_url ? (
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-accent dark:border-white">
              <Image src={t.client_avatar_url} alt={t.client_name} width={64} height={64} className="object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-accent dark:bg-white text-white dark:text-accent font-bold text-xl flex items-center justify-center mb-4">
              {t.client_name.charAt(0)}
            </div>
          )}
          <h4 className="font-bold text-lg">{t.client_name}</h4>
          {(t.client_title || t.client_company) && (
            <p className="text-muted text-sm mt-1">
              {[t.client_title, t.client_company].filter(Boolean).join(" at ")}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="p-3 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === current ? "w-6 bg-accent dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-3 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
