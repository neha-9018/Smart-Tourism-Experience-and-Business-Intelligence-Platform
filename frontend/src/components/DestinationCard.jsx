// src/components/DestinationCard.jsx
import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';

export default function DestinationCard({ destination }) {
  const { id, name, image, short, category, location, country } = destination;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group">
      {/* Image container */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={image || FALLBACK_IMAGE}
          alt={name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {category && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-primary text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
            {category}
          </span>
        )}
        {country && (
          <span className="absolute top-3 right-3 bg-primary/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
            {country}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
          <svg className="w-3.5 h-3.5 mr-1 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{location || country || 'Nepal'}</span>
        </div>

        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
          {name}
        </h3>

        <p className="text-sm text-gray-600 mb-5 flex-grow line-clamp-3 leading-relaxed">
          {short}
        </p>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <Link
            to={`/destinations/${id}`}
            className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            <span>View Details</span>
            <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
