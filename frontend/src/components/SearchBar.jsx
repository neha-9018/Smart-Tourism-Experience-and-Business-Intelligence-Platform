import { useState } from 'react';

export default function SearchBar({ placeholder = 'Search destinations, lakes, or sights...', onSearch }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(term);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setTerm(val);
    if (onSearch) onSearch(val);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-8">
      <div className="relative flex items-center shadow-sm rounded-xl overflow-hidden border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-white transition-all">
        <div className="pl-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-grow px-4 py-3 text-sm text-primary placeholder-gray-400 focus:outline-none"
        />
        {term && (
          <button
            type="button"
            onClick={() => { setTerm(''); onSearch && onSearch(''); }}
            className="text-gray-400 hover:text-gray-600 px-2"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="bg-accent text-white px-6 py-3 text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
