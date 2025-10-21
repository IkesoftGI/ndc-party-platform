// src/components/NewsTicker.tsx
import React from "react";
import Marquee from "react-fast-marquee";
import "@styles/NewsTicker.css";

interface NewsTickerProps {
  posts: { id: string; headline?: string; title: string }[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ posts }) => {
  // Only take posts with headline
  const headlines = posts
    .filter((p) => p.headline && p.headline.trim() !== "")
    .map((p) => p.headline as string);

  if (!headlines.length) return null;

  return (
    <div className="news-ticker bg-warning text-dark py-1 px-3 fw-bold border-top border-bottom">
      <Marquee pauseOnHover speed={60}>
        {headlines.map((headline, index) => (
          <span key={index} className="me-5">
            📰 {headline}
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default NewsTicker;
