// src/pages/Hotels.jsx
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import DestinationCard from '../components/DestinationCard';

const demoHotels = [
  // --- NEPAL HOTELS ---
  {
    id: 'h-pokhara',
    name: 'Phewa Lakeside Heritage Resort',
    country: 'Nepal',
    location: 'Pokhara, Gandaki Province',
    category: 'Lakeside Resort',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    short: 'Tranquil luxury retreat on Phewa Lake with private balconies facing Machapuchare and the Annapurna range.',
  },
  {
    id: 'h-kathmandu',
    name: 'Kathmandu Durbar Heritage Hotel',
    country: 'Nepal',
    location: 'Kathmandu Valley, Nepal',
    category: 'Boutique Heritage',
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80',
    short: 'Restored Newari architectural sanctuary with hand-carved woodwork, inner brick courtyards, and rooftop stupa views.',
  },
  {
    id: 'h-chitwan',
    name: 'Chitwan Jungle Safari Lodge',
    country: 'Nepal',
    location: 'Chitwan, Terai Lowlands',
    category: 'Eco Safari Lodge',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    short: 'Eco-lodge on the Rapti River boundary offering natural wilderness ambience, Tharu dinners, and guided safari departures.',
  },
  {
    id: 'h-nagarkot',
    name: 'Nagarkot Mountain Ridge Hotel',
    country: 'Nepal',
    location: 'Nagarkot Rim, Nepal',
    category: 'Mountain Panorama',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    short: 'Cliffside rooms designed with panoramic glass fronts capturing early dawn sunrises over the Everest and Langtang horizons.',
  },

  // --- JAPAN COLLECTION HOTELS ---
  {
    id: 'h-fuji-view',
    name: 'Fuji View Ryokan & Onsen',
    country: 'Japan',
    location: 'Yamanashi, Japan',
    category: 'Hot Spring Ryokan',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80',
    short: 'Traditional tatami suites featuring outdoor mineral hot spring baths overlooking snow-capped Mount Fuji.',
  },
  {
    id: 'h-kawaguchi-resort',
    name: 'Lake Kawaguchiko Waterside Hotel',
    country: 'Japan',
    location: 'Fuji Five Lakes, Japan',
    category: 'Lakeside Resort',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80',
    short: 'Lakeside boutique property featuring panoramic garden terraces and seasonal dining beside Lake Kawaguchiko.',
  }
];

export default function Hotels() {
  const [selectedCountry, setSelectedCountry] = useState('All');

  const filtered = selectedCountry === 'All'
    ? demoHotels
    : demoHotels.filter((h) => h.country === selectedCountry);

  return (
    <PageLayout title="Accommodations & Lodges">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <p className="text-sm text-gray-500">
          Hand-picked mountain resorts, jungle lodges, and traditional ryokans across Nepal and Japan.
        </p>

        <div className="flex justify-center gap-2 mt-4">
          {['All', 'Nepal', 'Japan'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedCountry === c
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {c === 'All' ? 'All Accommodations' : `${c} Collection`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((hotel) => (
          <DestinationCard key={hotel.id} destination={hotel} />
        ))}
      </div>
    </PageLayout>
  );
}
