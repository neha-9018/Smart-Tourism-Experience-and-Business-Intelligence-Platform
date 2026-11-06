// src/data/destinations.js
// Centralized, authentic multi-destination catalogue for Tourism360

export const DESTINATIONS = [
  // --- PRIMARY DESTINATION: NEPAL ---
  {
    id: 'pokhara',
    name: 'Pokhara',
    country: 'Nepal',
    location: 'Gandaki Province, Nepal',
    category: 'Nature & Adventure',
    short: 'Nepal’s premier lakeside haven beneath the Annapurna massif, famous for Phewa Lake, Sarangkot dawn vistas, and paragliding.',
    description: 'Nestled on the shores of serene Phewa Lake against the dramatic backdrop of Machapuchare (Fishtail) and the Annapurna range, Pokhara is Nepal’s tourism capital for nature lovers and adventurers. Travelers can row colorful wooden boats, watch Himalayan sunrises from Sarangkot, explore the World Peace Pagoda, and take off on world-class tandem paragliding flights.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    featured: true,
    interests: ['Nature', 'Adventure', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced', 'Active'],
    costEstimate: '¥4,500 (~$30 USD)',
    suitableTime: 'Morning',
    durationHours: 3.5,
    highlights: ['Phewa Lake Boating', 'Sarangkot Sunrise', 'World Peace Stupa', 'Davis Falls'],
    attractions: [
      {
        name: 'Phewa Lake & Tal Barahi Temple',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        description: 'Tranquil freshwater lake featuring mirror reflections of Mount Machapuchare and a historic island shrine.'
      },
      {
        name: 'Sarangkot Mountain Viewpoint',
        image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80',
        description: 'Celebrated hilltop ridge providing 360-degree panoramic sunrises over Dhaulagiri and Annapurna.'
      }
    ]
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    country: 'Nepal',
    location: 'Bagmati Province, Nepal',
    category: 'Culture & Heritage',
    short: 'The historic capital valley steeped in ancient Newari craftsmanship, sacred Buddhist stupas, and UNESCO royal palace squares.',
    description: 'Kathmandu is a living open-air museum where centuries-old Hindu and Buddhist traditions coexist. Centered around Kathmandu Durbar Square, the historic royal seat of Malla kings, the valley encompasses iconic landmarks including the hilltop Swayambhunath (Monkey Temple), the massive hemispherical Boudhanath Stupa, and the sacred cremation ghats of Pashupatinath Temple on the Bagmati River.',
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80',
    featured: true,
    interests: ['Culture', 'Food', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced', 'Active'],
    costEstimate: '¥3,200 (~$22 USD)',
    suitableTime: 'Afternoon',
    durationHours: 4.0,
    highlights: ['Kathmandu Durbar Square', 'Boudhanath Stupa', 'Swayambhunath', 'Thamel Artisan Bazaars'],
    attractions: [
      {
        name: 'Kathmandu Durbar Square',
        image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80',
        description: 'UNESCO World Heritage royal plaza filled with tiered pagoda temples, palace courtyards, and Kumari Ghar.'
      },
      {
        name: 'Boudhanath Stupa',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
        description: 'One of the largest spherical stupas in the world, surrounded by Tibetan monasteries, butter lamps, and prayer wheels.'
      }
    ]
  },
  {
    id: 'chitwan',
    name: 'Chitwan National Park',
    country: 'Nepal',
    location: 'Terai Lowlands, Nepal',
    category: 'Wildlife & Nature',
    short: 'Subtropical jungle sanctuary home to endangered greater one-horned rhinoceroses, Royal Bengal tigers, and river safaris.',
    description: 'Situated in the lush subtropical Terai plains, Chitwan National Park was Nepal’s first national park and is a world-renowned UNESCO natural reserve. Visitors embark on jeep safaris and peaceful dugout canoe rides along the Rapti River to observe one-horned rhinos, marsh mugger crocodiles, over 500 bird species, and elusive Bengal tigers, complemented by vibrant Tharu cultural traditions.',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    featured: true,
    interests: ['Nature', 'Adventure', 'Culture'],
    budgetTiers: ['Standard', 'Premium'],
    travelStyles: ['Balanced', 'Active'],
    costEstimate: '¥6,800 (~$45 USD)',
    suitableTime: 'Morning',
    durationHours: 4.5,
    highlights: ['Rapti River Canoe Safari', 'One-Horned Rhino Tracking', 'Tharu Cultural Heritage', 'Birdwatching'],
    attractions: [
      {
        name: 'Rapti River Wildlife Trail',
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
        description: 'Guided dawn safaris spotting endangered rhinoceroses grazing in misty riverbanks and tall elephant grass.'
      }
    ]
  },
  {
    id: 'lumbini',
    name: 'Lumbini',
    country: 'Nepal',
    location: 'Rupandehi District, Nepal',
    category: 'Pilgrimage & Heritage',
    short: 'The revered birthplace of Siddhartha Gautama (Lord Buddha), featuring the sacred Maya Devi Temple and monastic gardens.',
    description: 'Lumbini is one of the world’s four primary Buddhist holy pilgrimage sites. Believed to be the exact location where Queen Maya Devi gave birth to Prince Siddhartha in 623 BCE, the UNESCO World Heritage sacred zone features the ancient Ashoka Pillar, the sacred Pushkarini bathing pond, and an international monastic zone where countries worldwide have constructed Buddhist monasteries reflecting distinct architectural traditions.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    featured: true,
    interests: ['Culture', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced'],
    costEstimate: '¥2,500 (~$17 USD)',
    suitableTime: 'Morning',
    durationHours: 3.0,
    highlights: ['Maya Devi Temple', 'Ashoka Pillar', 'International Monastic Zone', 'World Peace Flame'],
    attractions: [
      {
        name: 'Sacred Maya Devi Temple',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
        description: 'The archaeological monument marking the marker stone of the Buddha’s nativity site and sacred pond.'
      }
    ]
  },
  {
    id: 'mustang',
    name: 'Mustang',
    country: 'Nepal',
    location: 'Dhawalagiri / Annapurna, Nepal',
    category: 'Mountain & Culture',
    short: 'The legendary forbidden kingdom beyond the Annapurna massif with wind-carved desert canyons and preserved Tibetan culture.',
    description: 'Upper and Lower Mustang lie in the rain shadow of the central Himalayas, characterized by dramatic ochre and grey sandstone cliffs, wind-sculpted canyons, and ancient sky-caves. Once an independent sovereign kingdom (the Kingdom of Lo), Mustang preserves pure Tibetan Buddhist ritual practices, fortress-like gompas, and the sacred multi-faith pilgrimage temple of Muktinath.',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    featured: true,
    interests: ['Adventure', 'Culture', 'Nature'],
    budgetTiers: ['Standard', 'Premium'],
    travelStyles: ['Active'],
    costEstimate: '¥8,500 (~$58 USD)',
    suitableTime: 'Morning',
    durationHours: 5.0,
    highlights: ['Muktinath Temple', 'Lo Manthang Walled City', 'Kali Gandaki Gorge', 'Ancient Cliff Caves'],
    attractions: [
      {
        name: 'Muktinath Sacred Temple',
        image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
        description: 'Venerated high-altitude temple at 3,710 meters revered by Hindus and Buddhists for eternal water spouts and flames.'
      }
    ]
  },
  {
    id: 'nagarkot',
    name: 'Nagarkot',
    country: 'Nepal',
    location: 'Bhaktapur District, Nepal',
    category: 'Nature & Viewpoints',
    short: 'Tranquil mountain rim settlement celebrated for sweeping panoramic sunrises stretching from Annapurna to Mount Everest.',
    description: 'Perched on the northeast rim of the Kathmandu Valley at an elevation of 2,175 meters, Nagarkot is acclaimed as the ultimate Himalayan vantage point. On crisp mornings, travelers enjoy golden first light illuminating eight Himalayan ranges, including Annapurna, Manaslu, Ganesh Himal, Langtang, and on clear days, the distant apex of Mount Everest.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    featured: true,
    interests: ['Nature', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced'],
    costEstimate: '¥2,800 (~$19 USD)',
    suitableTime: 'Morning',
    durationHours: 2.5,
    highlights: ['Himalayan Dawn Panorama', 'Everest Range View', 'Pine Ridge Nature Trails', 'Local Tea Gardens'],
    attractions: [
      {
        name: 'Nagarkot Sunrise Observation Tower',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        description: 'Panoramic viewing deck offering early dawn sightlines over eight major Himalayan ranges.'
      }
    ]
  },

  // --- SUPPORTED DESTINATION COLLECTION: JAPAN (Yamanashi & Mount Fuji) ---
  {
    id: 'mount-fuji',
    name: 'Mount Fuji (5th Station)',
    country: 'Japan',
    location: 'Yamanashi, Japan',
    category: 'Nature & Mountain',
    short: 'Japan’s iconic snow-capped sacred volcano offering world-famous alpine sunrises and historic pilgrimage routes.',
    description: 'Mount Fuji (Fujisan) is Japan’s highest mountain at 3,776 meters and a UNESCO World Heritage cultural property. The 5th Station at 2,305 meters serves as both the principal climbing trailhead and an alpine destination in its own right, offering historic Komitake Shrine, mountain shops, and sweeping cloud-sea panoramas.',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80',
    featured: false,
    interests: ['Nature', 'Adventure'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Balanced', 'Active'],
    costEstimate: '¥2,500 (~$17 USD)',
    suitableTime: 'Morning',
    durationHours: 3.5,
    highlights: ['Komitake Shrine', 'Yoshida Trailhead', 'Cloud-Sea Observation Deck'],
    attractions: [
      {
        name: 'Fuji Subaru Line 5th Station',
        image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80',
        description: 'High-altitude station with shrines and viewing decks overlooking the Fuji Five Lakes.'
      }
    ]
  },
  {
    id: 'lake-kawaguchiko',
    name: 'Lake Kawaguchiko & Oishi Park',
    country: 'Japan',
    location: 'Yamanashi, Japan',
    category: 'Nature & Scenic',
    short: 'Tranquil lakeside shores famous for blooming seasonal lavender and iconic mirror reflections of Mount Fuji.',
    description: 'The most accessible of the Fuji Five Lakes, Lake Kawaguchiko is famous for mirrored water reflections of Mount Fuji. Oishi Park on the northern shore showcases sweeping floral carpets from summer lavender to autumn kochia bushes.',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80',
    featured: false,
    interests: ['Nature', 'Relaxation'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced'],
    costEstimate: '¥1,500 (~$10 USD)',
    suitableTime: 'Morning',
    durationHours: 2.5,
    highlights: ['Oishi Park Flower Path', 'Lakeside Cruise Boat', 'Mount Tenjo Ropeway'],
    attractions: [
      {
        name: 'Oishi Park Promenade',
        image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80',
        description: 'Lakeside walking trail known for panoramic Fuji views across beds of purple lavender.'
      }
    ]
  },
  {
    id: 'chureito-pagoda',
    name: 'Chureito Pagoda',
    country: 'Japan',
    location: 'Fujiyoshida, Japan',
    category: 'Culture & Heritage',
    short: 'Historic five-story peace pagoda overlooking Mount Fuji, vibrant cherry blossoms, and Yamanashi valleys.',
    description: 'Perched on the mountainside of Arakurayama Sengen Park, the five-story vermilion Chureito Pagoda provides one of Japan’s most celebrated cultural panoramas, especially during spring cherry blossoms and autumn maples.',
    image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80',
    featured: false,
    interests: ['Culture', 'Nature'],
    budgetTiers: ['Budget', 'Standard', 'Premium'],
    travelStyles: ['Relaxed', 'Balanced', 'Active'],
    costEstimate: 'Free (~¥0)',
    suitableTime: 'Morning',
    durationHours: 2.0,
    highlights: ['398 Stone Steps Climb', 'Vermilion Pagoda', 'Arakura Sengen Shrine'],
    attractions: [
      {
        name: 'Arakurayama Observation Deck',
        image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80',
        description: 'Famous mountain viewing deck framing the classic Japanese postcard perspective.'
      }
    ]
  }
];

export const COUNTRIES = ['All Destinations', 'Nepal', 'Japan'];
export const CATEGORIES = ['All Categories', 'Nature', 'Culture', 'Wildlife', 'Pilgrimage', 'Adventure', 'Relaxation'];

