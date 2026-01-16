interface ScrollingBannerProps {
  items: string[];
  speed?: number;
}

const ScrollingBanner = ({ items, speed = 30 }: ScrollingBannerProps) => {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="bg-primary-700 py-4 overflow-hidden">
      <div className="relative">
        <div 
          className="flex gap-8 animate-scroll"
          style={{
            animation: `scroll ${speed}s linear infinite`,
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white font-semibold text-sm tracking-wider whitespace-nowrap"
            >
              <span>{item}</span>
              {index < duplicatedItems.length - 1 && (
                <span className="text-medical-teal">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollingBanner;
