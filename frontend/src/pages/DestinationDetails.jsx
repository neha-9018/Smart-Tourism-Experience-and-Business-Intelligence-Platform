// src/pages/DestinationDetails.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import AttractionCard from '../components/AttractionCard';
import { DESTINATIONS } from '../data/destinations';

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = DESTINATIONS.find((d) => d.id === id);

  const addToItinerary = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('itinerary') || '[]');
      if (!stored.includes(id)) {
        stored.push(id);
        localStorage.setItem('itinerary', JSON.stringify(stored));
        alert(`${destination.name} added to your trip planning itinerary!`);
      } else {
        alert(`${destination.name} is already in your trip itinerary.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!destination) {
    return (
      <PageLayout title="Destination Not Found">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">We could not find the requested destination in the multi-destination catalogue.</p>
          <Link to="/explore" className="text-sm font-semibold text-accent hover:underline">
            ← Back to Explore All Destinations
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-primary">Destinations</Link>
          <span>/</span>
          <span className="text-primary font-medium">{destination.country}</span>
          <span>/</span>
          <span className="text-gray-700 font-semibold">{destination.name}</span>
        </div>

        {/* Hero Image Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg h-72 sm:h-96 w-full bg-gray-100">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-white/90 text-primary text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                {destination.category}
              </span>
              <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                {destination.country}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              {destination.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 mt-1 flex items-center">
              📍 {destination.location}
            </p>
          </div>
        </div>

        {/* Content & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-primary mb-3">About {destination.name}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {destination.description}
              </p>

              {/* Highlights */}
              {destination.highlights && destination.highlights.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Destination Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {destination.highlights.map((h, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        <span className="text-accent font-bold">✓</span>
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Attractions Section */}
            {destination.attractions && destination.attractions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">Featured Attractions</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {destination.attractions.map((attr, idx) => (
                    <AttractionCard key={idx} attraction={attr} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Action Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-primary">Trip Planning Quick Facts</h3>

              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Country:</span>
                  <span className="font-semibold text-primary">{destination.country}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-semibold text-primary">{destination.category}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Recommended Time:</span>
                  <span className="font-semibold text-primary">{destination.durationHours || 3} hours</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Optimal Slot:</span>
                  <span className="font-semibold text-primary">{destination.suitableTime || 'Morning'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Estimated Cost:</span>
                  <span className="font-bold text-accent">{destination.costEstimate || 'Free / Low cost'}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={addToItinerary}
                  className="w-full bg-accent text-white text-xs font-semibold py-3 rounded-xl hover:bg-accent/90 transition shadow-xs cursor-pointer"
                >
                  + Add to Trip Itinerary
                </button>
                <Link
                  to="/plan"
                  className="block text-center w-full bg-primary text-white text-xs font-semibold py-3 rounded-xl hover:bg-primary/90 transition shadow-xs"
                >
                  ✨ Build Multi-Day AI Plan
                </Link>
              </div>
            </div>

            <Link
              to="/explore"
              className="inline-flex items-center text-xs font-semibold text-primary hover:text-accent transition"
            >
              ← Back to Explore Destinations
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
