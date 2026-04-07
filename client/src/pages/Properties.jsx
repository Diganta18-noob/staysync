import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineAdjustmentsHorizontal,
  HiOutlineMapPin,
  HiStar,
  HiOutlineHeart,
  HiHeart,
  HiPlus,
  HiXMark
} from 'react-icons/hi2';

const amenityIcons = {
  WiFi: '📶', AC: '❄️', Geyser: '♨️', 'Power Backup': '🔋',
  Laundry: '🧺', Gym: '💪', Parking: '🅿️', CCTV: '📹',
  Housekeeping: '🧹', TV: '📺',
};

const filterChips = {
  sharing: [{ label: 'Single', value: '1' }, { label: 'Double', value: '2' }, { label: 'Triple', value: '3' }],
  amenities: ['WiFi', 'AC', 'Geyser', 'Power Backup', 'Laundry', 'Gym'],
  food: [{ label: '3 Meals', value: '3-meals' }, { label: '2 Meals', value: '2-meals' }, { label: 'No Food', value: 'no-food' }],
};

const demoProperties = [
  {
    _id: '1', title: 'Sunrise PG for Men', description: 'Premium PG with modern amenities in Koramangala',
    address: { street: '4th Block, Koramangala', city: 'Bengaluru', state: 'Karnataka' },
    amenities: ['WiFi', 'AC', 'Gym', 'Laundry', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop'], rating: 4.5, reviewCount: 48, foodOptions: '3-meals',
    totalBeds: 50, occupiedBeds: 43, gender: 'male', propertyType: 'pg',
    priceRange: '₹7,500 - ₹12,000',
  },
  {
    _id: '2', title: 'Harmony Girls Hostel', description: 'Safe and comfortable hostel near HSR Layout',
    address: { street: 'HSR Layout Sector 7', city: 'Bengaluru', state: 'Karnataka' },
    amenities: ['WiFi', 'AC', 'CCTV', 'Housekeeping', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop'], rating: 4.8, reviewCount: 72, foodOptions: '3-meals',
    totalBeds: 80, occupiedBeds: 75, gender: 'female', propertyType: 'hostel',
    priceRange: '₹8,000 - ₹14,000',
  },
  {
    _id: '3', title: 'Urban Nest Coliving', description: 'Modern coliving space for professionals',
    address: { street: 'Indiranagar 100ft Road', city: 'Bengaluru', state: 'Karnataka' },
    amenities: ['WiFi', 'AC', 'Gym', 'TV', 'Parking'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1de2d93688?q=80&w=600&auto=format&fit=crop'], rating: 4.3, reviewCount: 35, foodOptions: '2-meals',
    totalBeds: 30, occupiedBeds: 22, gender: 'unisex', propertyType: 'coliving',
    priceRange: '₹10,000 - ₹18,000',
  },
  {
    _id: '4', title: 'Oaktree Men\'s PG', description: 'Affordable PG near Manyata Tech Park',
    address: { street: 'Hebbal, Near Manyata', city: 'Bengaluru', state: 'Karnataka' },
    amenities: ['WiFi', 'Geyser', 'Power Backup', 'Parking'],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=600&auto=format&fit=crop'], rating: 4.1, reviewCount: 28, foodOptions: '2-meals',
    totalBeds: 60, occupiedBeds: 41, gender: 'male', propertyType: 'pg',
    priceRange: '₹5,500 - ₹9,000',
  },
  {
    _id: '5', title: 'Elite Stay Premium', description: 'Luxury PG with premium fittings and amenities',
    address: { street: 'Whitefield Main Road', city: 'Bengaluru', state: 'Karnataka' },
    amenities: ['WiFi', 'AC', 'Gym', 'Laundry', 'TV', 'Housekeeping'],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'], rating: 4.7, reviewCount: 63, foodOptions: '3-meals',
    totalBeds: 40, occupiedBeds: 38, gender: 'unisex', propertyType: 'pg',
    priceRange: '₹12,000 - ₹22,000',
  },
  {
    _id: '6', title: 'Green Valley Hostel', description: 'Eco-friendly hostel with garden views',
    address: { street: 'Electronic City Phase 1', city: 'Bengaluru', state: 'Karnataka' },
    amenities: ['WiFi', 'Geyser', 'CCTV', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop'], rating: 4.0, reviewCount: 19, foodOptions: 'no-food',
    totalBeds: 45, occupiedBeds: 30, gender: 'female', propertyType: 'hostel',
    priceRange: '₹6,000 - ₹10,000',
  },
];

const Properties = () => {
  const { isOwner, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ sharing: [], amenities: [], food: [] });
  const [properties, setProperties] = useState(demoProperties);
  const [favorites, setFavorites] = useState(new Set());
  const debouncedSearch = useDebounce(search, 300);

  const toggleFilter = (category, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const activeFilterCount = Object.values(activeFilters).flat().length;

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-surface-900 dark:text-white">
              Discover Properties
            </h1>
            <p className="text-surface-500 mt-1">
              {properties.length} premium properties available
            </p>
          </div>
          {(isOwner || isAdmin) && (
            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
              <HiPlus className="w-5 h-5" />
              Add Property
            </button>
          )}
        </div>

        {/* Search and Filters Section */}
        <div className="glass-card p-4 rounded-2xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search by area, landmark, or PG name..."
                className="w-full bg-surface-100 dark:bg-surface-800 border-none rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                showFilters 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700 animate-fade-in">
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-3">Occupancy</h3>
                <div className="flex flex-wrap gap-2">
                  {filterChips.sharing.map(chip => (
                    <button
                      key={chip.value}
                      onClick={() => toggleFilter('sharing', chip.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        activeFilters.sharing.includes(chip.value)
                          ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                          : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-surface-300'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {filterChips.amenities.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => toggleFilter('amenities', amenity)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeFilters.amenities.includes(amenity)
                          ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                          : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-surface-300'
                      }`}
                    >
                      <span>{amenityIcons[amenity]}</span>
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button 
                  onClick={() => setActiveFilters({ sharing: [], amenities: [], food: [] })}
                  className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 mt-6"
                >
                  <HiXMark className="w-4 h-4" /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property, i) => {
            const occupancyRate = Math.round((property.occupiedBeds / property.totalBeds) * 100);
            return (
              <Link
                key={property._id}
                to={`/properties/${property._id}`}
                className="group flex flex-col bg-white dark:bg-surface-900 rounded-2xl overflow-hidden shadow-sm border border-surface-200 dark:border-surface-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${(i + 2) * 0.1}s` }}
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-surface-900 shadow-sm capitalize">
                      {property.propertyType}
                    </span>
                    {(property.totalBeds - property.occupiedBeds <= 5) && (
                      <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur-md rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1">
                        🔥 {property.totalBeds - property.occupiedBeds} beds left
                      </span>
                    )}
                  </div>
                  
                  {/* Price Badge */}
                  <span className="absolute bottom-3 right-3 px-3 py-1.5 bg-primary-600/90 backdrop-blur-md rounded-xl text-sm font-bold text-white shadow-sm">
                    {property.priceRange}
                  </span>

                  {/* Favorite Button */}
                  <button 
                    onClick={(e) => toggleFavorite(e, property._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md hover:bg-white text-surface-400 hover:text-red-500 rounded-xl transition-colors shadow-sm"
                  >
                    {favorites.has(property._id) ? <HiHeart className="w-5 h-5 text-red-500" /> : <HiOutlineHeart className="w-5 h-5" />}
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white line-clamp-1">
                      {property.title}
                    </h2>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 px-2 py-1 rounded-lg shrink-0">
                      <HiStar className="w-4 h-4" />
                      <span className="text-xs font-bold">{property.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-surface-500 mb-4">
                    <HiOutlineMapPin className="w-4 h-4 shrink-0" />
                    <span className="text-sm line-clamp-1">{property.address.street}, {property.address.city}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-semibold text-surface-600 dark:text-surface-400">
                        {amenityIcons[amenity]} {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-xs font-bold text-primary-600 dark:text-primary-400">
                        +{property.amenities.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Occupancy Bar */}
                  <div className="mt-auto pt-4 border-t border-surface-100 dark:border-surface-800">
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-surface-500">Occupancy</span>
                      <span className="text-surface-900 dark:text-white">{occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-1.5">
                      <div 
                        className="bg-primary-500 h-1.5 rounded-full" 
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-10 flex justify-center pb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map(page => (
              <button 
                key={page} 
                className={`w-10 h-10 rounded-xl font-bold transition-colors ${
                  page === 1 
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30' 
                    : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Properties;
