// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';

// Demonstration dataset for multi-destination business analytics (Nepal Flagship & Japan Collection)
const ANALYTICS_DATA = {
  '30d': {
    kpis: {
      totalBookings: '1,842',
      bookingsGrowth: '+16.4% vs last period',
      revenueYen: '¥58,920,000',
      revenueGrowth: '+22.1% vs last period',
      topDestination: 'Pokhara (Phewa Lake, Nepal)',
      topDestShare: '31.2% market share',
      repeatRate: '33.4%',
      repeatGrowth: '+4.8% YoY'
    },
    monthlyTrends: [
      { month: 'Oct 2025', revenueM: 38.5, bookings: 1220 },
      { month: 'Nov 2025', revenueM: 48.2, bookings: 1510 },
      { month: 'Dec 2025', revenueM: 45.1, bookings: 1390 },
      { month: 'Jan 2026', revenueM: 47.6, bookings: 1460 },
      { month: 'Feb 2026', revenueM: 52.3, bookings: 1640 },
      { month: 'Mar 2026', revenueM: 58.9, bookings: 1842 }
    ],
    destinations: [
      { name: 'Pokhara & Phewa Lake (Nepal)', visitors: '575', share: '31.2%', trend: '+24%' },
      { name: 'Mount Fuji 5th Station (Japan)', visitors: '442', share: '24.0%', trend: '+14%' },
      { name: 'Kathmandu Durbar Square (Nepal)', visitors: '348', share: '18.9%', trend: '+19%' },
      { name: 'Lake Kawaguchiko & Oishi (Japan)', visitors: '286', share: '15.5%', trend: '+11%' },
      { name: 'Chitwan National Park (Nepal)', visitors: '191', share: '10.4%', trend: '+21%' }
    ],
    categories: [
      { name: 'Himalayan & Alpine Accommodation', amount: '¥30.6M', percent: 52 },
      { name: 'Multi-Day Guided Expeditions', amount: '¥17.1M', percent: 29 },
      { name: 'Wildlife Safaris & Cultural Passes', amount: '¥7.7M', percent: 13 },
      { name: 'Regional Food & Tea/Wine Tours', amount: '¥3.5M', percent: 6 }
    ],
    interests: [
      { name: 'Himalayan Nature & Lakes', percent: 42 },
      { name: 'Cultural Heritage & Stupas', percent: 25 },
      { name: 'Wildlife & Safari Adventures', percent: 16 },
      { name: 'Mountain Viewpoints & Dawn Trails', percent: 11 },
      { name: 'Relaxation & Hot Springs', percent: 6 }
    ],
    budgetSegments: [
      { name: 'Standard ($35–$100/day)', percent: 56, bookings: '1,030 bookings' },
      { name: 'Premium (≥ $100/day)', percent: 27, bookings: '498 bookings' },
      { name: 'Budget (≤ $35/day)', percent: 17, bookings: '314 bookings' }
    ],
    visitorRatio: {
      newPercent: 66.6,
      returnPercent: 33.4
    }
  },
  '90d': {
    kpis: {
      totalBookings: '5,210',
      bookingsGrowth: '+19.8% vs last period',
      revenueYen: '¥166,400,000',
      revenueGrowth: '+26.2% vs last period',
      topDestination: 'Pokhara (Phewa Lake, Nepal)',
      topDestShare: '30.8% market share',
      repeatRate: '31.5%',
      repeatGrowth: '+4.2% YoY'
    },
    monthlyTrends: [
      { month: 'Oct 2025', revenueM: 38.5, bookings: 1220 },
      { month: 'Nov 2025', revenueM: 48.2, bookings: 1510 },
      { month: 'Dec 2025', revenueM: 45.1, bookings: 1390 },
      { month: 'Jan 2026', revenueM: 47.6, bookings: 1460 },
      { month: 'Feb 2026', revenueM: 52.3, bookings: 1640 },
      { month: 'Mar 2026', revenueM: 58.9, bookings: 1842 }
    ],
    destinations: [
      { name: 'Pokhara & Phewa Lake (Nepal)', visitors: '1,605', share: '30.8%', trend: '+22%' },
      { name: 'Mount Fuji 5th Station (Japan)', visitors: '1,280', share: '24.6%', trend: '+15%' },
      { name: 'Kathmandu Durbar Square (Nepal)', visitors: '965', share: '18.5%', trend: '+18%' },
      { name: 'Lake Kawaguchiko & Oishi (Japan)', visitors: '790', share: '15.2%', trend: '+12%' },
      { name: 'Chitwan National Park (Nepal)', visitors: '570', share: '10.9%', trend: '+20%' }
    ],
    categories: [
      { name: 'Himalayan & Alpine Accommodation', amount: '¥86.5M', percent: 52 },
      { name: 'Multi-Day Guided Expeditions', amount: '¥48.3M', percent: 29 },
      { name: 'Wildlife Safaris & Cultural Passes', amount: '¥21.6M', percent: 13 },
      { name: 'Regional Food & Tea/Wine Tours', amount: '¥10.0M', percent: 6 }
    ],
    interests: [
      { name: 'Himalayan Nature & Lakes', percent: 41 },
      { name: 'Cultural Heritage & Stupas', percent: 26 },
      { name: 'Wildlife & Safari Adventures', percent: 15 },
      { name: 'Mountain Viewpoints & Dawn Trails', percent: 12 },
      { name: 'Relaxation & Hot Springs', percent: 6 }
    ],
    budgetSegments: [
      { name: 'Standard ($35–$100/day)', percent: 55, bookings: '2,865 bookings' },
      { name: 'Premium (≥ $100/day)', percent: 28, bookings: '1,460 bookings' },
      { name: 'Budget (≤ $35/day)', percent: 17, bookings: '885 bookings' }
    ],
    visitorRatio: {
      newPercent: 68.5,
      returnPercent: 31.5
    }
  }
};

export default function AdminDashboard() {
  const [period, setPeriod] = useState('30d');
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const data = ANALYTICS_DATA[period] || ANALYTICS_DATA['30d'];

  const handleRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-10">

        {/* 1. Dashboard Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Tourism Business Overview
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitor multi-destination performance, understand visitor behaviour and identify growth opportunities across Nepal and Japan collections.
              </p>
            </div>

            {/* Filter & Controls */}
            <div className="flex items-center space-x-2">
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPeriod('30d')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                    period === '30d' ? 'bg-white text-primary shadow-xs font-semibold' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Last 30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('90d')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                    period === '90d' ? 'bg-white text-primary shadow-xs font-semibold' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Last 90 Days
                </button>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Refresh
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition cursor-pointer"
              >
                Export
              </button>
            </div>
          </div>

          {/* Compact Demonstration Data Disclosure */}
          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>
              <strong>Note:</strong> Illustrative multi-destination analytics for presentation and prototype evaluation.
            </span>
            <span className="text-gray-400">Updated: {lastRefreshed}</span>
          </div>
        </div>

        {/* 2. KPI Section: Four Equal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Bookings
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary mt-2">
              {data.kpis.totalBookings}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              {data.kpis.bookingsGrowth}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estimated Revenue
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary mt-2">
              {data.kpis.revenueYen}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              {data.kpis.revenueGrowth}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Top Destination
            </div>
            <div className="text-xl sm:text-2xl font-bold text-primary mt-2 truncate">
              {data.kpis.topDestination}
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              {data.kpis.topDestShare}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Returning Visitors
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary mt-2">
              {data.kpis.repeatRate}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              {data.kpis.repeatGrowth}
            </div>
          </div>
        </div>

        {/* 3. Business Performance Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary">
            Business Performance
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel: Monthly Revenue Trend */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-primary">Monthly Revenue Trend</h3>
                    <p className="text-xs text-gray-500">Gross monthly tourism revenue across Nepal & Japan portfolios</p>
                  </div>
                  <span className="text-xs text-gray-400">Past 6 Months</span>
                </div>

                <div className="w-full h-56 pt-4">
                  <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                    <line x1="30" y1="20" x2="480" y2="20" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="30" y1="70" x2="480" y2="70" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="30" y1="120" x2="480" y2="120" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="30" y1="150" x2="480" y2="150" stroke="#e5e7eb" strokeWidth="1" />

                    <text x="5" y="24" fill="#9ca3af" fontSize="10">¥65M</text>
                    <text x="5" y="74" fill="#9ca3af" fontSize="10">¥45M</text>
                    <text x="5" y="124" fill="#9ca3af" fontSize="10">¥25M</text>
                    <text x="15" y="154" fill="#9ca3af" fontSize="10">0</text>

                    {data.monthlyTrends.map((d, i) => {
                      const barWidth = 36;
                      const x = 50 + i * 72;
                      const maxVal = 65;
                      const barHeight = (d.revenueM / maxVal) * 125;
                      const y = 150 - barHeight;

                      return (
                        <g key={d.month}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx="3"
                            fill="#0a1f44"
                            className="hover:opacity-90 transition-opacity"
                          />
                          <text
                            x={x + barWidth / 2}
                            y={y - 5}
                            fill="#0a1f44"
                            fontSize="10"
                            fontWeight="600"
                            textAnchor="middle"
                          >
                            ¥{d.revenueM}M
                          </text>
                          <text
                            x={x + barWidth / 2}
                            y="166"
                            fill="#6b7280"
                            fontSize="10"
                            textAnchor="middle"
                          >
                            {d.month.split(' ')[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                Peak booking momentum aligns with autumn Himalayan trekking (Oct-Nov) and spring mountain blossom journeys (Mar).
              </div>
            </div>

            {/* Right Panel: Revenue by Category */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-primary">Revenue by Category</h3>
                    <p className="text-xs text-gray-500">Share of revenue across product segments</p>
                  </div>
                  <span className="text-xs text-gray-400">Total 100%</span>
                </div>

                <div className="space-y-4 pt-2">
                  {data.categories.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700">{cat.name}</span>
                        <span className="font-semibold text-primary">
                          {cat.amount} ({cat.percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${cat.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 text-xs text-gray-500">
                Accommodations and multi-day guided packages account for over 81% of total multi-destination revenue.
              </div>
            </div>
          </div>
        </div>

        {/* 4. Destination Performance Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary">
            Popular Destinations
          </h2>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/75 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-5 font-semibold">Destination</th>
                    <th className="py-3 px-5 font-semibold text-center">Visitors</th>
                    <th className="py-3 px-5 font-semibold text-center">Market Share</th>
                    <th className="py-3 px-5 font-semibold text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.destinations.map((dest) => (
                    <tr key={dest.name} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-primary">
                        {dest.name}
                      </td>
                      <td className="py-3.5 px-5 text-center text-gray-700">
                        {dest.visitors}
                      </td>
                      <td className="py-3.5 px-5 text-center text-gray-700">
                        {dest.share}
                      </td>
                      <td className="py-3.5 px-5 text-right font-medium text-emerald-600">
                        {dest.trend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. Customer Insights Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary">
            Customer Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
              <h3 className="text-sm font-semibold text-primary mb-1">
                Travel Interests Distribution
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Primary interest declared during multi-destination trip planning
              </p>

              <div className="space-y-3">
                {data.interests.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-semibold text-primary">{item.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
              <h3 className="text-sm font-semibold text-primary mb-1">
                Budget Segment Distribution
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Traveler spending tier allocation
              </p>

              <div className="space-y-3.5">
                {data.budgetSegments.map((seg) => (
                  <div key={seg.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">{seg.name}</span>
                      <span className="font-semibold text-primary">{seg.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${seg.percent}%` }}
                      ></div>
                    </div>
                    <div className="text-[11px] text-gray-400">{seg.bookings}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-1">
                  Visitor Retention Ratio
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  First-time global travelers compared to repeat guests
                </p>

                <div className="space-y-2 pt-2">
                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden flex">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${data.visitorRatio.newPercent}%` }}
                      title={`New: ${data.visitorRatio.newPercent}%`}
                    ></div>
                    <div
                      className="bg-accent h-full"
                      style={{ width: `${data.visitorRatio.returnPercent}%` }}
                      title={`Returning: ${data.visitorRatio.returnPercent}%`}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                      <span className="text-gray-600">New Visitors ({data.visitorRatio.newPercent}%)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block"></span>
                      <span className="text-gray-600">Returning ({data.visitorRatio.returnPercent}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 text-xs text-gray-500">
                Repeat travelers frequently cross over between Himalayan nature routes and Japanese cultural circuits on subsequent holidays.
              </div>
            </div>
          </div>
        </div>

        {/* 6. Growth Opportunities Section */}
        <div className="space-y-4 pb-6">
          <h2 className="text-lg font-bold text-primary">
            Business Growth Opportunities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">
                  Cross-Selling Complementary Experiences
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Travelers booking Pokhara lakeside stays exhibit high affinity for Sarangkot sunrise flights and Chitwan wildlife extensions. Creating integrated packages that pair mountain viewpoints with national park safaris unlocks substantial basket expansion.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                Opportunity: Multi-circuit packaging
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">
                  Promoting Less-Discovered Destinations
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Encouraging visitors toward Upper Mustang and Lumbini pilgrimage corridors distributes travel density away from saturated city centers. Targeted regional campaigns can showcase high-altitude desert canyons and peace heritage to discerning travelers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                Opportunity: Regional dispersal
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">
                  Creating Seasonal Travel Packages
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Structuring dual-season campaigns—such as autumn Himalayan rhododendron trails and winter snow-clear panorama packages—helps level out seasonal travel fluctuations and attract travelers during shoulder months.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                Opportunity: Off-peak occupancy
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
