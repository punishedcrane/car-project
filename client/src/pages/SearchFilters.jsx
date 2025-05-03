// SearchFilters.jsx
import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { MdElectricCar, MdStars, MdFiberNew } from 'react-icons/md';

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedQuality,
  setSelectedQuality,
  isElectric,
  setIsElectric,
  isFeatured,
  setIsFeatured,
  isNewArrival,
  setIsNewArrival,
  sortOrder,
  setSortOrder,
  resetFilters,
  showFilters,
  toggleFilters,
  totalVehicles,
  filteredCount
}) => {
  return (
    <>
      {/* Mobile Toggle Filter Button */}
      <div className="md:hidden mb-4 flex justify-between items-center">
        <div className="relative flex-1 mr-2">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={toggleFilters}
          className="bg-blue-500 text-white p-2 rounded-lg flex items-center"
        >
          <FaFilter className="mr-1" />
          <span className="text-sm">Filters</span>
        </button>
      </div>
      
      {/* Filter Section - Desktop & Tablet & Mobile (when expanded) */}
      <div className={`bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 md:mb-8 ${!showFilters && 'hidden md:block'}`}>
        {/* Desktop & Tablet Search */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Quality Filter */}
          <div>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Quality Levels</option>
              <option value="Economy">Economy</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          
          {/* Sort Order */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sort By Price</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Mobile-only Filters */}
        <div className="grid grid-cols-1 gap-3 mb-4 md:hidden">
          {/* Quality Filter - Mobile */}
          <div>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Quality Levels</option>
              <option value="Economy">Economy</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          
          {/* Sort Order - Mobile */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Sort By Price</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Toggle Filters - Both Mobile & Desktop */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
          <button
            onClick={() => setIsElectric(!isElectric)}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1 md:py-2 rounded-lg border text-xs md:text-sm ${
              isElectric ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            <MdElectricCar size={16} />
            Electric
          </button>
          
          <button
            onClick={() => setIsFeatured(!isFeatured)}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1 md:py-2 rounded-lg border text-xs md:text-sm ${
              isFeatured ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            <MdStars size={16} />
            Featured
          </button>
          
          <button
            onClick={() => setIsNewArrival(!isNewArrival)}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1 md:py-2 rounded-lg border text-xs md:text-sm ${
              isNewArrival ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            <MdFiberNew size={16} />
            New
          </button>
          
          <button
            onClick={resetFilters}
            className="px-3 md:px-4 py-1 md:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs md:text-sm"
          >
            Reset
          </button>
        </div>
        
        {/* Results Count */}
        <div className="text-gray-600 text-xs md:text-sm">
          Showing {filteredCount} of {totalVehicles} vehicles
        </div>
      </div>
    </>
  );
};

export default SearchFilters;