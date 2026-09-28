import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, CheckCircle2, Sparkles, X, Check } from 'lucide-react';
import { TRENDING_ITEMS, type TrendingItem } from '../data/trendingData';

interface TrendingCarouselProps {
  title?: string;
  subtitle?: string;
  items?: TrendingItem[];
}

export default function TrendingCarousel({
  title = 'Competitions & Challenges',
  subtitle = 'Live campus competitions, hackathons & pre-placement interview (PPI) challenges',
  items = TRENDING_ITEMS,
}: TrendingCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<TrendingItem | null>(null);
  const [registeredMap, setRegisteredMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleRegister = (item: TrendingItem) => {
    setRegisteredMap((prev) => ({ ...prev, [item.id]: true }));
    setSelectedChallenge(null);
    setToastMessage(`🎉 Successfully registered for ${item.brand} ${item.title}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-navy hover:bg-slate-50 flex items-center justify-center shadow-xs hover:shadow-md transition-all active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-blue-600 hover:text-blue-800 hover:bg-slate-50 flex items-center justify-center shadow-xs hover:shadow-md transition-all active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto no-scrollbar pb-3 pt-1 scroll-smooth snap-x snap-mandatory"
      >
        {items.map((item) => {
          const isRegistered = registeredMap[item.id];
          const isDark = item.textColor === 'text-white';

          return (
            <div
              key={item.id}
              className={`snap-start shrink-0 w-[310px] sm:w-[360px] md:w-[380px] rounded-3xl p-6 sm:p-7 bg-gradient-to-br ${item.gradientClass} ${item.textColor} border border-black/5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group`}
            >
              {/* Optional Background Student Image overlay */}
              {item.imageUrl && (
                <div className="absolute right-0 bottom-0 top-0 w-2/5 pointer-events-none opacity-30 group-hover:opacity-40 transition-opacity">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center mix-blend-overlay"
                  />
                </div>
              )}

              {/* Card Content Top */}
              <div className="relative z-10 space-y-3.5">
                {/* Brand & Category Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm tracking-wide uppercase font-sans">
                      {item.brand}
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${item.badgeColor}`}>
                    {item.category}
                  </span>
                </div>

                {/* Challenge Title */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className={`text-xs mt-1 leading-snug line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Key Benefit Bullets */}
                <ul className="space-y-1.5 pt-1 text-xs">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 font-medium">
                      <span className="text-blue-500 font-bold">•</span>
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action Bottom */}
              <div className="relative z-10 pt-5 mt-4 border-t border-black/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedChallenge(item)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 flex items-center gap-1.5 ${item.buttonColor}`}
                >
                  {isRegistered ? (
                    <>
                      <Check className="w-4 h-4" /> Registered
                    </>
                  ) : (
                    item.buttonText
                  )}
                </button>

                <div className="text-right">
                  {item.prizeAmount && (
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                      Prize Pool
                    </span>
                  )}
                  <span className="text-xs font-mono font-extrabold block">
                    {item.prizeAmount || item.registeredCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration / Details Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scale-up border border-slate-200 relative">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {selectedChallenge.brand} · {selectedChallenge.category}
              </span>
              {selectedChallenge.ppiAvailable && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                  PPI Opportunity
                </span>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-black text-navy">{selectedChallenge.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedChallenge.deadline}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Opportunity Highlights</p>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedChallenge.bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Fast-Track with Skilloryn Passport
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Your verified skill baseline and project artifacts will be shared directly with {selectedChallenge.brand}'s recruitment team upon entry.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleRegister(selectedChallenge)}
                className="flex-1 py-3.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-colors"
              >
                Confirm Free Registration
              </button>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-5 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
