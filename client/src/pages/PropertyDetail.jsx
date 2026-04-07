import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineMapPin, HiOutlineStar, HiOutlineHeart,
  HiOutlineShare, HiOutlineArrowLeft, HiOutlinePhone,
  HiOutlineBuildingOffice2, HiOutlineCheckCircle,
  HiOutlineClock, HiOutlineShieldCheck,
} from 'react-icons/hi2';

const demoProperty = {
  _id: '1', title: 'Sunrise PG for Men',
  description: 'Premium paying guest accommodation with fully furnished rooms, 24/7 security, and home-cooked meals. Located in the heart of Koramangala, just 5 minutes from Forum Mall and close to major IT parks.',
  address: { street: '4th Block, Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' },
  amenities: ['WiFi', 'AC', 'Gym', 'Laundry', 'Power Backup', 'CCTV', 'Housekeeping', 'TV', 'Parking'],
  rating: 4.5, reviewCount: 48, foodOptions: '3-meals', gender: 'male', propertyType: 'pg',
  rules: ['No smoking inside premises', 'Gate closes at 11 PM', 'Visitors allowed till 8 PM', 'No pets allowed'],
  owner: { name: 'Vikram Kapoor', phone: '+91-9876543210' },
  rooms: [
    { _id: 'r1', roomNumber: 'A-101', sharingType: 1, pricePerBed: 12000, totalBeds: 1, occupiedBeds: 0, features: ['Balcony', 'Attached Washroom'], floor: 1 },
    { _id: 'r2', roomNumber: 'A-102', sharingType: 2, pricePerBed: 8500, totalBeds: 2, occupiedBeds: 1, features: ['Attached Washroom'], floor: 1 },
    { _id: 'r3', roomNumber: 'A-201', sharingType: 2, pricePerBed: 8500, totalBeds: 2, occupiedBeds: 2, features: ['Attached Washroom'], floor: 2 },
    { _id: 'r4', roomNumber: 'B-101', sharingType: 3, pricePerBed: 6500, totalBeds: 3, occupiedBeds: 1, features: ['Common Washroom'], floor: 1 },
    { _id: 'r5', roomNumber: 'B-102', sharingType: 3, pricePerBed: 6500, totalBeds: 3, occupiedBeds: 3, features: ['Common Washroom'], floor: 1 },
    { _id: 'r6', roomNumber: 'B-201', sharingType: 1, pricePerBed: 14000, totalBeds: 1, occupiedBeds: 0, features: ['Balcony', 'Attached Washroom', 'Study Table'], floor: 2 },
  ],
};

const amenityEmojis = {
  WiFi: '📶', AC: '❄️', Gym: '💪', Laundry: '🧺', 'Power Backup': '🔋',
  CCTV: '📹', Housekeeping: '🧹', TV: '📺', Parking: '🅿️', Geyser: '♨️',
};

const sharingLabels = { 1: 'Single', 2: 'Double', 3: 'Triple', 4: 'Quad' };

const PropertyDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const property = demoProperty;

  const totalBeds = property.rooms.reduce((a, r) => a + r.totalBeds, 0);
  const occupiedBeds = property.rooms.reduce((a, r) => a + r.occupiedBeds, 0);
  const availableBeds = totalBeds - occupiedBeds;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20">
      {/* Hero image */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 overflow-hidden">
        <div className="absolute inset-0 bg-card-shine animate-shimmer" />
        <div className="absolute inset-0 flex items-center justify-center">
          <HiOutlineBuildingOffice2 className="w-32 h-32 text-white/20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link to="/properties" className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <HiOutlineArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <HiOutlineShare className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <HiOutlineHeart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Property title overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge bg-white/90 text-surface-900 capitalize">{property.propertyType}</span>
            <span className="badge bg-white/90 text-surface-900 capitalize">{property.gender}</span>
            <span className="badge bg-white/90 text-surface-900">{property.foodOptions.replace('-', ' ')}</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">{property.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-white/90">
              <HiOutlineMapPin className="w-4 h-4" />
              <span className="text-sm">{property.address.street}, {property.address.city}</span>
            </div>
            <div className="flex items-center gap-1 text-white/90">
              <HiOutlineStar className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold">{property.rating}</span>
              <span className="text-sm text-white/70">({property.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Inventory Alert */}
            {availableBeds <= 5 && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 animate-pulse-glow">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">
                    Only {availableBeds} bed{availableBeds !== 1 ? 's' : ''} left!
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">Book now before they're gone.</p>
                </div>
              </div>
            )}

            {/* About */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-3">About this Property</h2>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                    <span className="text-xl">{amenityEmojis[amenity] || '✨'}</span>
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white">Available Rooms</h2>
                <span className="badge-primary">{availableBeds} beds available</span>
              </div>

              <div className="space-y-3">
                {property.rooms.map((room) => {
                  const available = room.totalBeds - room.occupiedBeds;
                  const isFull = available === 0;

                  return (
                    <div
                      key={room._id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                        isFull
                          ? 'bg-surface-100 dark:bg-surface-800/30 border-surface-200 dark:border-surface-700 opacity-60'
                          : selectedRoom === room._id
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 shadow-md'
                          : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:border-primary-300 cursor-pointer'
                      }`}
                      onClick={() => !isFull && setSelectedRoom(room._id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-surface-900 dark:text-white">Room {room.roomNumber}</span>
                          <span className="badge-primary text-xs">{sharingLabels[room.sharingType]} Sharing</span>
                          <span className="text-xs text-surface-400">Floor {room.floor}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {room.features.map((f) => (
                            <span key={f} className="text-xs px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-700 text-surface-500">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <div className="text-right">
                          <p className="text-lg font-bold text-surface-900 dark:text-white">₹{room.pricePerBed.toLocaleString()}</p>
                          <p className="text-xs text-surface-500">/bed/month</p>
                        </div>
                        {isFull ? (
                          <span className="badge-danger">Full</span>
                        ) : (
                          <span className="badge-success">{available} left</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rules */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4">House Rules</h2>
              <div className="space-y-3">
                {property.rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <HiOutlineCheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-surface-600 dark:text-surface-300">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm text-surface-500 mb-1">Starting from</p>
                <p className="text-4xl font-display font-bold text-surface-900 dark:text-white">
                  ₹6,500
                  <span className="text-base font-normal text-surface-400">/month</span>
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <span className="text-sm text-surface-500">Security Deposit</span>
                  <span className="text-sm font-semibold text-surface-900 dark:text-white">1 Month Rent</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <span className="text-sm text-surface-500">Food</span>
                  <span className="text-sm font-semibold text-surface-900 dark:text-white capitalize">{property.foodOptions.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <span className="text-sm text-surface-500">Available Beds</span>
                  <span className={`text-sm font-semibold ${availableBeds <= 3 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {availableBeds} of {totalBeds}
                  </span>
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  disabled={!selectedRoom}
                  className="btn-primary w-full py-3.5 text-base"
                  onClick={() => setShowBookingModal(true)}
                >
                  {selectedRoom ? 'Book Now' : 'Select a Room'}
                </button>
              ) : (
                <Link to="/login" className="btn-primary w-full py-3.5 text-base block text-center">
                  Login to Book
                </Link>
              )}

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-surface-400">
                <div className="flex items-center gap-1">
                  <HiOutlineClock className="w-3.5 h-3.5" />
                  <span>10 min lock</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure payment</span>
                </div>
              </div>

              {/* Owner info */}
              <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                <p className="text-sm font-medium text-surface-900 dark:text-white mb-3">Property Owner</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">VK</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{property.owner.name}</p>
                    <p className="text-xs text-surface-500">Property Owner</p>
                  </div>
                  <button className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                    <HiOutlinePhone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
