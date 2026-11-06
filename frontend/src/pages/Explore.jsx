// src/pages/Explore.jsx
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import PageLayout from '../components/PageLayout';
import { DESTINATIONS, COUNTRIES, CATEGORIES } from '../data/destinations';

export default function Explore() {
  const [selectedCountry, setSelectedCountry] = useState('All Destinations');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = DESTINATIONS.filter((d) => {
    const matchesCountry = selectedCountry === 'All Destinations' || d.country === selectedCountry;
    const matchesCategory = selectedCategory === 'All Categories' || d.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchTerm || (
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.short.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesCountry && matchesCategory && matchesSearch;
  });

  const handleSearch = (term) => {
    setSearchTerm(term.trim());
  };

  return (
    <PageLayout title="Explore Global Destinations">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <p className="text-sm text-gray-500">
          Discover hand-picked cultural heritage, alpine vistas, and wildlife reserves across Nepal and Japan.
        </p>
      </div>

      <SearchBar
        placeholder="Search by destination name, highlights, or region..."
        onSearch={handleSearch}
      />

      {/* Country Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {COUNTRIES.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCountry(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCountry === c
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-accent text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Showing {filtered.length} of {DESTINATIONS.length} Destinations
        </span>
        {(selectedCountry !== 'All Destinations' || selectedCategory !== 'All Categories' || searchTerm) && (
          <button
            onClick={() => { setSelectedCountry('All Destinations'); setSelectedCategory('All Categories'); setSearchTerm(''); }}
            className="text-xs font-semibold text-accent hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No destinations match the selected criteria.</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
