// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xl font-bold tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block"></span>
              <span>Tourism<span className="text-accent">360</span></span>
            </div>
            <p className="text-xs text-gray-300 mt-1 font-medium">
              Explore More. Experience More.
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              AI-Powered Multi-Destination Tourism & Business Intelligence Platform
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <Link to="/explore" className="hover:text-accent transition-colors">Explore</Link>
            <Link to="/plan" className="hover:text-accent transition-colors">AI Trip Planner</Link>
            <Link to="/hotels" className="hover:text-accent transition-colors">Hotels</Link>
            <Link to="/admin" className="hover:text-accent transition-colors">Business Analytics</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <p>© 2026 Tourism360. Supporting Nepal, Japan & Global Mountain Destinations.</p>
          <div className="flex space-x-4">
            <span className="text-gray-500">Nepal Flagship</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">Japan Collection</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">Global Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
