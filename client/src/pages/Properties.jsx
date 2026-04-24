import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
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

const baseDemoProperties = [
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

// Multiply the array to demonstrate infinite scroll properly
const demoProperties = Array.from({ length: 4 }).flatMap((_, index) => 
  baseDemoProperties.map(prop => ({
    ...prop,
    _id: `${prop._id}-${index}`,
    title: index > 0 ? `${prop.title} (Block ${String.fromCharCode(65 + index)})` : prop.title
  }))
);

const cardVariants = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.45, bounce: 0 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    filter: "blur(2px)",
    transition: { duration: 0.2 }
  }
};

const Properties = () => {
  const { isOwner, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ sharing: [], amenities: [], food: [] });
  const [favorites, setFavorites] = useState(new Set());
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const loaderRef = useRef(null);
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

  // Filter logic
  const filteredProperties = useMemo(() => {
    let result = demoProperties;
    
    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.address.city.toLowerCase().includes(q) ||
        p.address.street.toLowerCase().includes(q)
      );
    }
    
    // Amenities
    if (activeFilters.amenities.length > 0) {
      result = result.filter(p => 
        activeFilters.amenities.every(a => p.amenities.includes(a))
      );
    }
    
    return result;
  }, [debouncedSearch, activeFilters]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && displayCount < filteredProperties.length && !isLoadingMore) {
        setIsLoadingMore(true);
        // Simulate network request
        setTimeout(() => {
          setDisplayCount(prev => Math.min(prev + 6, filteredProperties.length));
          setIsLoadingMore(false);
        }, 800);
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [displayCount, filteredProperties.length, isLoadingMore]);

  // Reset infinite scroll count when filters change
  useEffect(() => {
    setDisplayCount(6);
  }, [debouncedSearch, activeFilters]);

  const displayedProperties = filteredProperties.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-surface-900 dark:text-white">
              Discover Properties
            </h1>
            <p className="text-surface-500 mt-1">
              {filteredProperties.length} premium properties available
            </p>
          </div>
          {(isOwner || isAdmin) && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
            >
              <HiPlus className="w-5 h-5" />
              Add Property
            </motion.button>
          )}
        </motion.div>

        {/* Search and Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-2xl mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search by area, landmark, or PG name..."
                className="w-full bg-surface-100 dark:bg-surface-800 border-none rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-shadow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                showFilters 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </motion.button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Properties Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedProperties.map((property) => {
              const occupancyRate = Math.round((property.occupiedBeds / property.totalBeds) * 100);
              return (
                <motion.div
                  layout
                  key={property._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    to={`/properties/${property._id}`}
                    className="group flex flex-col bg-white dark:bg-surface-900 rounded-[24px] overflow-hidden shadow-sm border border-surface-200 dark:border-surface-800 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Image Section */}
                    <div className="relative h-64 w-full overflow-hidden">
                      <img 
                        src={property.images[0]} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <span className="px-3 py-1.5 bg-white/70 dark:bg-surface-900/70 backdrop-blur-md rounded-full text-xs font-bold text-surface-900 dark:text-white shadow-sm capitalize border border-white/20 dark:border-white/10">
                            {property.propertyType}
                          </span>
                          {(property.totalBeds - property.occupiedBeds <= 5) && (
                            <span className="px-3 py-1.5 bg-red-500/80 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-red-400/30">
                              🔥 {property.totalBeds - property.occupiedBeds} beds left
                            </span>
                          )}
                        </div>
                        
                        {/* Favorite Button */}
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleFavorite(e, property._id)}
                          className="p-2.5 bg-white/70 dark:bg-surface-900/70 backdrop-blur-md hover:bg-white text-surface-400 hover:text-red-500 rounded-full transition-colors shadow-sm border border-white/20 dark:border-white/10"
                        >
                          {favorites.has(property._id) ? <HiHeart className="w-5 h-5 text-red-500" /> : <HiOutlineHeart className="w-5 h-5 dark:text-white" />}
                        </motion.button>
                      </div>
                      
                      {/* Price Badge */}
                      <span className="absolute bottom-4 left-4 px-4 py-2 bg-primary-600/90 backdrop-blur-md rounded-2xl text-sm font-bold text-white shadow-lg border border-primary-500/50">
                        {property.priceRange}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white line-clamp-1">
                          {property.title}
                        </h2>
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 px-2 py-1 rounded-lg shrink-0">
                          <HiStar className="w-4 h-4" />
                          <span className="text-xs font-bold">{property.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-surface-500 dark:text-surface-400 mb-5">
                        <HiOutlineMapPin className="w-4 h-4 shrink-0" />
                        <span className="text-sm line-clamp-1">{property.address.street}, {property.address.city}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <span key={amenity} className="px-2.5 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-xs font-semibold text-surface-700 dark:text-surface-300">
                            {amenityIcons[amenity]} {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="px-2.5 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-xs font-bold text-primary-600 dark:text-primary-400">
                            +{property.amenities.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Occupancy Bar */}
                      <div className="mt-auto pt-5 border-t border-surface-100 dark:border-surface-800/50">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                          <span className="text-surface-500">Occupancy</span>
                          <span className="text-surface-900 dark:text-white">{occupancyRate}%</span>
                        </div>
                        <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${occupancyRate}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full" 
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {displayedProperties.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineMagnifyingGlass className="w-10 h-10 text-surface-400" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No properties found</h3>
            <p className="text-surface-500">Try adjusting your filters or search criteria.</p>
          </motion.div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loaderRef} className="mt-10 flex justify-center pb-8 h-12">
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-surface-500">
              <div className="w-5 h-5 border-2 border-surface-300 border-t-primary-600 rounded-full animate-spin" />
              <span className="text-sm font-medium">Loading more properties...</span>
            </div>
          )}
          {!isLoadingMore && displayCount >= filteredProperties.length && filteredProperties.length > 0 && (
            <div className="text-surface-500 text-sm font-medium">
              You've reached the end of the list.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Properties;
