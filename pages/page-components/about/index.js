// import React, { useState } from 'react';
// import Select from 'react-select';
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';

// // Sample data for Locations
// const locationOptions = [
//   { value: 'New York', label: 'New York' },
//   { value: 'Los Angeles', label: 'Los Angeles' },
//   { value: 'Chicago', label: 'Chicago' },
//   { value: 'Miami', label: 'Miami' },
// ];

// // Sample apartments data
// const apartments = [
//   { id: 1, location: 'New York', size: 1200, price: 1500 },
//   { id: 2, location: 'Chicago', size: 800, price: 900 },
//   { id: 3, location: 'Los Angeles', size: 1600, price: 3000 },
//   { id: 4, location: 'Miami', size: 1100, price: 1200 },
// ];

// function FilterComponent() {
//   const [selectedLocations, setSelectedLocations] = useState([]);
//   const [sizeRange, setSizeRange] = useState([0, 2000]);
//   const [priceRange, setPriceRange] = useState([0, 5000]);

//   // Handle Location Multi-select
//   const handleLocationChange = (selectedOption) => {
//     setSelectedLocations(selectedOption);
//   };

//   // Handle Size Range Change
//   const handleSizeChange = (value) => {
//     setSizeRange(value);
//   };

//   // Handle Price Range Change
//   const handlePriceChange = (value) => {
//     setPriceRange(value);
//   };

//   // Filter apartments based on selected filters
//   const filteredApartments = apartments.filter((apartment) => {
//     const inLocation = selectedLocations.length === 0 || selectedLocations.some((location) => location.value === apartment.location);
//     const inSizeRange = apartment.size >= sizeRange[0] && apartment.size <= sizeRange[1];
//     const inPriceRange = apartment.price >= priceRange[0] && apartment.price <= priceRange[1];
//     return inLocation && inSizeRange && inPriceRange;
//   });

//   return (
//     <div>
//       <form>
//         {/* Location Multi-select */}
//         <div>
//           <label>Select Location(s):</label>
//           <Select
//             isMulti
//             options={locationOptions}
//             onChange={handleLocationChange}
//             value={selectedLocations}
//           />
//         </div>

//         {/* Apartment Size Range Selector */}
//         <div>
//           <label>Apartment Size (sq ft): {sizeRange[0]} - {sizeRange[1]}</label>
//           <Slider
//             range
//             min={0}
//             max={2000}
//             value={sizeRange}
//             onChange={handleSizeChange}
//             step={10}
//             allowCross={false}
//           />
//         </div>

//         {/* Price Range Selector */}
//         <div>
//           <label>Price Range ($): {priceRange[0]} - {priceRange[1]}</label>
//           <Slider
//             range
//             min={0}
//             max={5000}
//             value={priceRange}
//             onChange={handlePriceChange}
//             step={50}
//             allowCross={false}
//           />
//         </div>

//         <button type="submit">Apply Filters</button>
//       </form>

//       <div>
//         <h3>Filtered Apartments:</h3>
//         {filteredApartments.length === 0 ? (
//           <p>No apartments found</p>
//         ) : (
//           filteredApartments.map((apartment) => (
//             <div key={apartment.id}>
//               <p>{apartment.location} | {apartment.size} sq ft | ${apartment.price}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default FilterComponent;

import React from 'react'

const index = () => {
  return (
    <div>index</div>
  )
}

export default index