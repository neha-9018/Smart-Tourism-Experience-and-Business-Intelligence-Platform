// src/pages/PlanMyTrip.jsx
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';

// Multi-destination AI planning catalogue (Nepal Flagship + Japan Collection)
const PLANNING_CATALOGUE = [
  // --- NEPAL EXPERIENCES ---
  {
    id: 'pokhara-phewa',
    name: 'Pokhara & Phewa Lake Dawn Boating',
    country: 'Nepal',
    location: 'Gandaki Province, Nepal',
    category: 'Nature & Adventure',
    interests: ['Nature', 'Relaxation', 'Adventure'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced'],
    costYen: 2500, // equivalent in Yen for consistent multi-currency model
    costLabel: '¥2,500 (~$17 USD)',
    suitableTime: 'Morning',
    durationHours: 3.0,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'Serene sunrise boating across Phewa Lake with crystal-clear reflections of the Annapurna and Machapuchare peaks.',
    explanation: 'Selected for pristine Himalayan morning visibility and peaceful lakeside relaxation.'
  },
  {
    id: 'sarangkot-sunrise',
    name: 'Sarangkot Sunrise & Paragliding',
    country: 'Nepal',
    location: 'Pokhara, Nepal',
    category: 'Adventure',
    interests: ['Adventure', 'Nature'],
    budgetTiers: ['Standard', 'Premium'],
    travelStyles: ['Balanced', 'Active'],
    costYen: 7500,
    costLabel: '¥7,500 (~$50 USD)',
    suitableTime: 'Morning',
    durationHours: 3.5,
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80',
    description: 'Witnessing golden Himalayan dawn rays over Annapurna I and Dhaulagiri, followed by tandem paragliding down to Lake Pokhara.',
    explanation: 'High adventure engagement matching active travel preferences with panoramic mountain vistas.'
  },
  {
    id: 'kathmandu-durbar',
    name: 'Kathmandu Durbar Square & Kumari Ghar',
    country: 'Nepal',
    location: 'Kathmandu Valley, Nepal',
    category: 'Culture & Heritage',
    interests: ['Culture', 'Food'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced', 'Active'],
    costYen: 1500,
    costLabel: '¥1,500 (~$10 USD)',
    suitableTime: 'Afternoon',
    durationHours: 2.5,
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80',
    description: 'Immersive exploration of historic Newari pagoda temples, courtyards of medieval Malla kings, and living goddess traditions.',
    explanation: 'Matches cultural heritage priorities and provides accessible historic walking routes.'
  },
  {
    id: 'boudhanath-stupa',
    name: 'Boudhanath Stupa & Monastic Kora',
    country: 'Nepal',
    location: 'Kathmandu, Nepal',
    category: 'Culture & Heritage',
    interests: ['Culture', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced'],
    costYen: 600,
    costLabel: '¥600 (~$4 USD)',
    suitableTime: 'Evening',
    durationHours: 2.0,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'Circumambulating the massive sacred white mandala stupa amidst swirling incense, glowing butter lamps, and rooftop dining.',
    explanation: 'Ideal evening contemplative experience offering authentic Himalayan Buddhist spirituality.'
  },
  {
    id: 'chitwan-safari',
    name: 'Chitwan Jungle Safari & Rhino Tracking',
    country: 'Nepal',
    location: 'Terai Lowlands, Nepal',
    category: 'Wildlife & Nature',
    interests: ['Nature', 'Adventure'],
    budgetTiers: ['Standard', 'Premium'],
    travelStyles: ['Balanced', 'Active'],
    costYen: 6800,
    costLabel: '¥6,800 (~$45 USD)',
    suitableTime: 'Morning',
    durationHours: 4.0,
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    description: 'Guided wilderness Jeep expedition along the Rapti River encountering endangered greater one-horned rhinos and native wildlife.',
    explanation: 'Prime wildlife safari matching nature-focused travelers seeking conservation experiences.'
  },
  {
    id: 'lumbini-sacred-garden',
    name: 'Lumbini Sacred Nativity Garden',
    country: 'Nepal',
    location: 'Rupandehi, Nepal',
    category: 'Pilgrimage & Heritage',
    interests: ['Culture', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced'],
    costYen: 1200,
    costLabel: '¥1,200 (~$8 USD)',
    suitableTime: 'Morning',
    durationHours: 3.0,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'Peaceful walk through the historic birthplace of Buddha, the marker stone of Queen Maya Devi, and international monasteries.',
    explanation: 'World-renowned peace monument providing unmatched historic and meditative tranquility.'
  },
  {
    id: 'mustang-canyon',
    name: 'Mustang Wind-Carved Desert Canyon Trail',
    country: 'Nepal',
    location: 'Annapurna / Mustang, Nepal',
    category: 'Mountain & Culture',
    interests: ['Adventure', 'Nature', 'Culture'],
    budgetTiers: ['Standard', 'Premium'],
    travelStyles: ['Active'],
    costYen: 8500,
    costLabel: '¥8,500 (~$58 USD)',
    suitableTime: 'Afternoon',
    durationHours: 4.5,
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    description: 'High-altitude desert exploration past ancient cliffside sky-caves, dry riverbeds of the Kali Gandaki, and Tibetan chortens.',
    explanation: 'Rare Himalayan desert scenery tailored for active adventure seekers and cultural discovery.'
  },
  {
    id: 'nagarkot-sunrise',
    name: 'Nagarkot Himalayan Panoramic Sunrise',
    country: 'Nepal',
    location: 'Bhaktapur Rim, Nepal',
    category: 'Nature & Viewpoints',
    interests: ['Nature', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced'],
    costYen: 2000,
    costLabel: '¥2,000 (~$14 USD)',
    suitableTime: 'Morning',
    durationHours: 2.5,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    description: 'Early morning mountain vista from 2,175 meters overlooking eight Himalayan ranges and crisp pine ridge walking paths.',
    explanation: 'Breathtaking first light sightlines over the Himalayas with easy accessibility from Kathmandu.'
  },

  // --- JAPAN EXPERIENCES (RETAINED COLLECTION) ---
  {
    id: 'fuji-5th-station',
    name: 'Mount Fuji 5th Station Alpine Trek',
    country: 'Japan',
    location: 'Yoshida Trail, Yamanashi',
    category: 'Nature & Mountain',
    interests: ['Nature', 'Adventure'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Balanced', 'Active'],
    costYen: 2500,
    costLabel: '¥2,500 (~$17 USD)',
    suitableTime: 'Morning',
    durationHours: 3.5,
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80',
    description: 'High-altitude subalpine volcanic trail at 2,305m elevation with views over the sea of clouds and Mount Fuji summit.',
    explanation: 'Iconic sacred alpine setting with crisp morning visibility and mountain shrine heritage.'
  },
  {
    id: 'lake-kawaguchi-oishi',
    name: 'Lake Kawaguchiko Floral Stroll & Cruise',
    country: 'Japan',
    location: 'Fuji Five Lakes, Japan',
    category: 'Nature & Scenic',
    interests: ['Nature', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced'],
    costYen: 1500,
    costLabel: '¥1,500 (~$10 USD)',
    suitableTime: 'Morning',
    durationHours: 2.5,
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80',
    description: 'Lakeside promenade famous for mirror reflections of Mount Fuji, seasonal lavender beds, and serene waters.',
    explanation: 'Calm waterside stroll ideal for unhurried travel and photography.'
  },
  {
    id: 'chureito-pagoda-japan',
    name: 'Chureito Pagoda & Arakurayama Trail',
    country: 'Japan',
    location: 'Fujiyoshida, Japan',
    category: 'Culture & Heritage',
    interests: ['Culture', 'Nature'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced', 'Active'],
    costYen: 0,
    costLabel: 'Free (~¥0)',
    suitableTime: 'Morning',
    durationHours: 2.0,
    image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic five-story vermilion pagoda with postcard-perfect perspectives of Mount Fuji across seasonal blossoms.',
    explanation: 'Historic peaceful vantage point with zero admission fee.'
  }
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';

export default function PlanMyTrip() {
  // User Preferences State
  const [targetCountry, setTargetCountry] = useState('Nepal'); // 'Nepal', 'Japan', 'All'
  const [duration, setDuration] = useState(3); // 1, 2, 3, 5 days
  const [budget, setBudget] = useState('Standard'); // Budget, Standard, Premium
  const [interests, setInterests] = useState(['Nature', 'Culture']);
  const [travelStyle, setTravelStyle] = useState('Balanced');

  // Generated Plan State
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Saved Itineraries State
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tourism360_saved_itineraries') || '[]');
      setSavedItineraries(stored);
    } catch (e) {
      console.error('Failed to load saved itineraries:', e);
    }
  }, []);

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== interest));
      }
    } else {
      setInterests([...interests, interest]);
    }
  };

  // Content-Based Explainable AI Recommendation Engine
  const generateRecommendations = () => {
    setIsGenerating(true);
    setSaveStatus('');

    setTimeout(() => {
      // 1. Filter pool by target country
      const countryPool = targetCountry === 'All'
        ? PLANNING_CATALOGUE
        : PLANNING_CATALOGUE.filter((item) => item.country === targetCountry);

      // 2. Score each experience
      const scoredItems = countryPool.map((item) => {
        let score = 50;

        // Interest overlap
        const matchedInterests = item.interests.filter((int) => interests.includes(int));
        score += matchedInterests.length * 20;

        // Budget match
        if (item.budgetTiers.includes(budget)) {
          score += 20;
        } else if (budget === 'Budget' && item.costYen > 3000) {
          score -= 25;
        }

        // Travel style match
        if (item.travelStyles.includes(travelStyle)) {
          score += 10;
        }

        const normalizedScore = Math.min(98, Math.max(68, score));

        const reasons = [];
        if (matchedInterests.length > 0) {
          reasons.push(`Matches ${matchedInterests.join(' & ')}`);
        }
        if (item.budgetTiers.includes(budget)) {
          reasons.push(`Fits ${budget} budget`);
        }
        reasons.push(`Optimal for ${item.suitableTime}`);

        return {
          ...item,
          matchScore: normalizedScore,
          matchedInterests,
          explanationTag: reasons.join(' • ')
        };
      });

      // Sort by score descending
      scoredItems.sort((a, b) => b.matchScore - a.matchScore);

      // 3. Multi-day schedule assignment
      const slotsPerDay = travelStyle === 'Relaxed'
        ? ['Morning', 'Afternoon']
        : ['Morning', 'Afternoon', 'Evening'];

      const pool = [...scoredItems];
      const usedIds = new Set();
      const days = [];

      for (let dayIndex = 1; dayIndex <= duration; dayIndex++) {
        const daySchedule = [];

        slotsPerDay.forEach((slotName) => {
          let candidate = pool.find((item) => !usedIds.has(item.id) && item.suitableTime === slotName);
          if (!candidate) {
            candidate = pool.find((item) => !usedIds.has(item.id));
          }

          if (candidate) {
            usedIds.add(candidate.id);
            daySchedule.push({
              timeSlot: slotName,
              destination: candidate
            });
          }
        });

        days.push({
          dayNumber: dayIndex,
          activities: daySchedule
        });
      }

      // Aggregate calculations
      let totalCostYen = 0;
      days.forEach((day) => {
        day.activities.forEach((act) => {
          totalCostYen += act.destination.costYen;
        });
      });

      const newItinerary = {
        id: 'itin_' + Date.now(),
        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        preferences: {
          targetCountry,
          duration,
          budget,
          interests: [...interests],
          travelStyle
        },
        days,
        totalCostYen,
        totalDestinations: usedIds.size
      };

      setGeneratedItinerary(newItinerary);
      setIsGenerating(false);

      setTimeout(() => {
        const resultsEl = document.getElementById('itinerary-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 350);
  };

  const saveItinerary = () => {
    if (!generatedItinerary) return;

    try {
      const existing = JSON.parse(localStorage.getItem('tourism360_saved_itineraries') || '[]');
      const updated = [generatedItinerary, ...existing.filter((item) => item.id !== generatedItinerary.id)];

      localStorage.setItem('tourism360_saved_itineraries', JSON.stringify(updated));
      setSavedItineraries(updated);

      const legacyIds = [];
      generatedItinerary.days.forEach((d) => {
        d.activities.forEach((a) => legacyIds.push(a.destination.id));
      });
      localStorage.setItem('itinerary', JSON.stringify(legacyIds));

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (e) {
      console.error('Failed to save itinerary:', e);
      setSaveStatus('error');
    }
  };

  const loadSavedItinerary = (saved) => {
    setGeneratedItinerary(saved);
    setTargetCountry(saved.preferences.targetCountry || 'Nepal');
    setDuration(saved.preferences.duration);
    setBudget(saved.preferences.budget);
    setInterests(saved.preferences.interests);
    setTravelStyle(saved.preferences.travelStyle);
    setShowSavedDrawer(false);

    setTimeout(() => {
      const resultsEl = document.getElementById('itinerary-results');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const deleteSavedItinerary = (id, e) => {
    e.stopPropagation();
    const updated = savedItineraries.filter((item) => item.id !== id);
    setSavedItineraries(updated);
    localStorage.setItem('tourism360_saved_itineraries', JSON.stringify(updated));
  };

  return (
    <PageLayout>
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center space-x-2 bg-primary/5 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 border border-primary/10">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          <span>Multi-Destination Explainable AI Trip Planner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-3">
          Plan Your Next Journey
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Select your destination collection, duration, budget, and travel interests to generate an explainable day-wise itinerary.
        </p>

        {savedItineraries.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowSavedDrawer(true)}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-primary hover:text-accent bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span>📂 View Saved Itineraries</span>
              <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                {savedItineraries.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Main Preference Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden mb-12">
        <div className="bg-primary text-white px-6 sm:px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Step 1: Set Journey Preferences</h2>
            <p className="text-xs text-gray-300 mt-0.5">Scored by our explainable content-based recommendation model</p>
          </div>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-200 font-mono">
            {targetCountry === 'Nepal' ? 'Nepal Flagship' : targetCountry === 'Japan' ? 'Japan Collection' : 'Global'}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* 1. Country / Destination Region */}
          <div>
            <label className="block text-sm font-bold text-primary mb-3">
              1. Destination Region
              <span className="text-xs font-normal text-gray-500 ml-2">Choose your primary travel focus</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'Nepal', label: 'Nepal (Flagship)', desc: 'Himalayan peaks, wildlife & heritage', flag: '🇳🇵' },
                { key: 'Japan', label: 'Japan (Collection)', desc: 'Mount Fuji & Yamanashi lakes', flag: '🗾' },
                { key: 'All', label: 'All Destinations', desc: 'Cross-regional multi-country pool', flag: '🌍' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setTargetCountry(opt.key)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    targetCountry === opt.key
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/30 text-primary shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.flag}</div>
                  <div className="font-bold text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Duration */}
          <div>
            <label className="block text-sm font-bold text-primary mb-3">
              2. Trip Duration
              <span className="text-xs font-normal text-gray-500 ml-2">How many days will you travel?</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { days: 1, label: '1 Day', sub: 'Express Explorer' },
                { days: 2, label: '2 Days', sub: 'Weekend Getaway' },
                { days: 3, label: '3 Days', sub: 'Classic Circuit' },
                { days: 5, label: '5 Days', sub: 'Grand Expedition' }
              ].map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setDuration(opt.days)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    duration === opt.days
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/30 text-primary shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-base font-bold">{opt.label}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Budget */}
          <div>
            <label className="block text-sm font-bold text-primary mb-3">
              3. Budget Tier
              <span className="text-xs font-normal text-gray-500 ml-2">Estimated daily activities & entry allowances</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { tier: 'Budget', label: 'Budget', desc: 'Free viewpoints & public transit', limit: '≤ $35 / day' },
                { tier: 'Standard', label: 'Standard', desc: 'Popular sights, permits & guides', limit: '$35 – $100 / day' },
                { tier: 'Premium', label: 'Premium', desc: 'Private safaris, flights & lodges', limit: '≥ $100 / day' }
              ].map((opt) => (
                <button
                  key={opt.tier}
                  type="button"
                  onClick={() => setBudget(opt.tier)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    budget === opt.tier
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/30 text-primary shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-bold text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                  <div className="text-xs font-semibold text-accent mt-2">{opt.limit}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Interests */}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              4. Interests
              <span className="text-xs font-normal text-gray-500 ml-2">Select all themes you wish to prioritize</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {[
                { name: 'Nature', icon: '🏔️' },
                { name: 'Culture', icon: '🏛️' },
                { name: 'Food', icon: '🍲' },
                { name: 'Adventure', icon: '🪂' },
                { name: 'Relaxation', icon: '⛵' }
              ].map((item) => {
                const isSelected = interests.includes(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggleInterest(item.name)}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs ring-2 ring-primary/20'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Travel Style */}
          <div>
            <label className="block text-sm font-bold text-primary mb-3">
              5. Travel Pace
              <span className="text-xs font-normal text-gray-500 ml-2">Determines the density of scheduled activities</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { style: 'Relaxed', label: 'Relaxed', desc: '1–2 unhurried stops per day' },
                { style: 'Balanced', label: 'Balanced', desc: '2–3 nicely paced stops per day' },
                { style: 'Active', label: 'Active', desc: '3 full stops (morning, afternoon, night)' }
              ].map((opt) => (
                <button
                  key={opt.style}
                  type="button"
                  onClick={() => setTravelStyle(opt.style)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    travelStyle === opt.style
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/30 text-primary shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-bold text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-500">
              Curated experiences ready to score for {targetCountry}
            </span>
            <button
              type="button"
              onClick={generateRecommendations}
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-accent text-white px-8 py-3.5 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <span>Scoring Destinations...</span>
              ) : (
                <>
                  <span>✨ Generate AI Itinerary</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Itinerary Section */}
      {generatedItinerary && (
        <section id="itinerary-results" className="max-w-5xl mx-auto scroll-mt-24 mb-16">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 sm:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                  AI Recommendation
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mt-2">
                  Your {generatedItinerary.preferences.duration}-Day {generatedItinerary.preferences.targetCountry} Itinerary
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Generated {generatedItinerary.createdAt} • {generatedItinerary.preferences.travelStyle} Pace • {generatedItinerary.preferences.budget} Budget
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={saveItinerary}
                  className="bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition shadow-xs cursor-pointer"
                >
                  Save Itinerary
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-gray-100 text-gray-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Print
                </button>
              </div>
            </div>

            {saveStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs">
                Itinerary saved to browser storage. Access it anytime via "View Saved Itineraries".
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <span className="text-xs text-gray-500">Duration</span>
                <div className="text-lg font-bold text-primary mt-1">{generatedItinerary.preferences.duration} Days</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <span className="text-xs text-gray-500">Stops</span>
                <div className="text-lg font-bold text-primary mt-1">{generatedItinerary.totalDestinations} Places</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <span className="text-xs text-gray-500">Est. Activity Total</span>
                <div className="text-lg font-bold text-accent mt-1">¥{generatedItinerary.totalCostYen.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <span className="text-xs text-gray-500">Focus</span>
                <div className="text-xs font-bold text-primary mt-1.5 truncate">
                  {generatedItinerary.preferences.interests.join(' & ')}
                </div>
              </div>
            </div>
          </div>

          {/* Days */}
          <div className="space-y-8">
            {generatedItinerary.days.map((day) => (
              <div key={day.dayNumber} className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
                <div className="bg-gray-50/80 px-6 sm:px-8 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                      {day.dayNumber}
                    </span>
                    <h3 className="text-base font-bold text-primary">Day {day.dayNumber} Plan</h3>
                  </div>
                  <span className="text-xs text-gray-500">{day.activities.length} activities scheduled</span>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {day.activities.map((act) => {
                    const dest = act.destination;
                    return (
                      <div
                        key={dest.id}
                        className="flex flex-col md:flex-row gap-5 p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xs transition-all group"
                      >
                        <div className="relative w-full md:w-56 h-48 md:h-auto rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={dest.image || FALLBACK_IMAGE}
                            alt={dest.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_IMAGE;
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-primary/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                            {act.timeSlot}
                          </span>
                        </div>

                        <div className="flex flex-col flex-grow justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                                {dest.category}
                              </span>
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                {dest.matchScore}% Match
                              </span>
                              <span className="text-xs text-gray-500">
                                📍 {dest.location}
                              </span>
                            </div>

                            <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">
                              {dest.name}
                            </h4>

                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                              {dest.description}
                            </p>

                            <div className="mt-3 bg-gray-50 rounded-xl p-2.5 text-xs text-gray-600 border border-gray-100 flex items-start space-x-2">
                              <span className="text-accent font-bold flex-shrink-0">Why selected:</span>
                              <span className="leading-snug">{dest.explanation}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <div>
                              <span>Estimated Cost: </span>
                              <strong className="text-xs text-primary font-bold">{dest.costLabel}</strong>
                            </div>
                            <div>
                              <span>Suggested Time: </span>
                              <strong className="text-primary font-semibold">{dest.durationHours} hrs</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Saved Itineraries Drawer */}
      {showSavedDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 bg-primary text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Saved Itineraries</h3>
                <p className="text-xs text-gray-300">Stored in browser localStorage</p>
              </div>
              <button
                onClick={() => setShowSavedDrawer(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex-grow overflow-y-auto space-y-4">
              {savedItineraries.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  <p>No saved itineraries yet.</p>
                </div>
              ) : (
                savedItineraries.map((saved) => (
                  <div
                    key={saved.id}
                    onClick={() => loadSavedItinerary(saved)}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-accent hover:shadow-xs transition-all cursor-pointer bg-white group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        {saved.preferences.targetCountry || 'Nepal'} • {saved.preferences.duration} Days
                      </span>
                      <button
                        onClick={(e) => deleteSavedItinerary(saved.id, e)}
                        className="text-gray-400 hover:text-red-600 p-1 text-xs cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-primary mt-2 group-hover:text-accent transition-colors">
                      {saved.preferences.duration}-Day {saved.preferences.targetCountry || 'Custom'} Journey
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {saved.totalDestinations} stops • Saved on {saved.createdAt}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowSavedDrawer(false)}
                className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
