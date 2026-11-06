// src/pages/Home.jsx
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import { DESTINATIONS } from '../data/destinations';
import { Link } from 'react-router-dom';

// Hero image: Annapurna range soaring above cloud inversion at dawn
const HERO_IMAGE = 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80';

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering logic across country, category, and search query
  const filtered = DESTINATIONS.filter((dest) => {
    const matchesCountry = selectedCountry === 'All' || dest.country === selectedCountry;
    const matchesCategory = selectedCategory === 'All' || dest.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchTerm || (
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.short.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesCountry && matchesCategory && matchesSearch;
  });

  const handleSearch = (term) => {
    setSearchTerm(term.trim());
  };

  return (
    <PageLayout>
      {/* 1. Global Multi-Destination Hero Banner */}
      <section
        className="relative bg-cover bg-center rounded-3xl mb-12 flex items-center justify-center overflow-hidden shadow-2xl min-h-[400px] md:min-h-[480px]"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
        }}
      >
        {/* Navy gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-black/30"></div>

        <div className="relative text-center px-6 max-w-4xl z-10">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-xs text-white text-xs md:text-sm font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-white/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span>Multi-Destination Travel & Business Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-3 drop-shadow-md">
            Tourism360
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium mb-3 tracking-tight">
            Explore More. Experience More.
          </p>

          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow mb-6">
            From the Himalayan summits and wildlife sanctuaries of Nepal to the sacred alpine shrines of Japan — discover curated journeys powered by explainable AI.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/plan"
              className="bg-accent text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-accent/90 transition shadow-md"
            >
              ✨ Plan Your AI Journey
            </Link>
            <Link
              to="/explore"
              className="bg-white/90 text-primary font-bold text-sm px-6 py-3 rounded-xl hover:bg-white transition shadow-md"
            >
              Explore All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Platform Value Props Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-lg flex-shrink-0 font-bold">
            🇳🇵
          </div>
          <div>
            <h3 className="font-bold text-primary text-sm">Nepal Flagship Collection</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Explore 6 premier circuits across Pokhara, Kathmandu, Chitwan, Lumbini, Mustang, and Nagarkot.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg flex-shrink-0 font-bold">
            🗾
          </div>
          <div>
            <h3 className="font-bold text-primary text-sm">Japan Alpine Collection</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Seamlessly cross-reference Mount Fuji, Lake Kawaguchiko, and Yamanashi cultural destinations.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0 font-bold">
            📊
          </div>
          <div>
            <h3 className="font-bold text-primary text-sm">Tourism Intelligence</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Enterprise business analytics monitoring cross-border visitor demand, booking volume, and growth.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search Bar */}
      <SearchBar
        placeholder="Search destinations (e.g. Pokhara, Kathmandu, Chitwan, Mount Fuji)..."
        onSearch={handleSearch}
      />

      {/* 4. Country Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Destination Region:</span>
        {[
          { key: 'All', label: 'All Destinations', flag: '🌍' },
          { key: 'Nepal', label: 'Nepal (Primary)', flag: '🇳🇵' },
          { key: 'Japan', label: 'Japan Collection', flag: '🇯🇵' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCountry(tab.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedCountry === tab.key
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{tab.flag}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 5. Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {['All', 'Nature', 'Culture', 'Wildlife', 'Pilgrimage', 'Adventure'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-accent text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 6. Destination Grid Header */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">
            {selectedCountry === 'Nepal'
              ? 'Nepal Flagship Destinations'
              : selectedCountry === 'Japan'
              ? 'Japan Supported Collection'
              : 'Featured Global Destinations'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified mountain, wildlife, and cultural destinations curated for travelers
          </p>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {filtered.length} {filtered.length === 1 ? 'place' : 'places'}
        </span>
      </div>

      {/* 7. Destination Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No destinations match your search or filter.</p>
          <button
            onClick={() => { setSelectedCountry('All'); setSelectedCategory('All'); setSearchTerm(''); }}
            className="mt-3 text-accent text-xs font-semibold hover:underline"
          >
            Reset all filters
          </button>
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
