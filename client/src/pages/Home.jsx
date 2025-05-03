import React from 'react';
import { Link } from 'react-router-dom';  // Ensure this is included
import Slider from '../components/Slider';
import InfiniteLogoSlider from '../components/InfiniteLogoSlider';
import CarCategoryShowcase from '../components/CarCategoryShowcase';
import FeaturedVehicles from '../components/FeaturedVehicles';
import NewArrival from '../components/NewArrival';
import CarSaleSection from '../components/CarSaleSection';

 

const Home = () => {
  return (
    <div>
      
      {/* <Link to="/vehicles">View Vehicles</Link> */}
      <Slider />
      <InfiniteLogoSlider />
      <CarCategoryShowcase/>
      <FeaturedVehicles />
      <NewArrival/>
      <CarSaleSection/>
      
    </div>
  );
};

export default Home;
