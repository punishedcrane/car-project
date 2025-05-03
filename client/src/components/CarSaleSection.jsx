import React from 'react';




const CarSaleSection = () => {
  return (
    <section className="w-full py-12 gradient-background text-white">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-10 px-6">
        
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <img
            src="https://res.cloudinary.com/dysu1piy1/image/upload/v1745853689/i4-eDrive40_zg6lbv.png"
            alt="Ferrari"
            className="mx-auto w-full h-auto object-contain"
            loading="lazy"
          />
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
          Affordable rates from $50/day. Unlimited miles. 24/7 support. Book now for the best deals!
          </h1>
          <p className="text-lg">
          Enjoy competitive car rental rates starting at just $30 per day with unlimited mileage included. Our fleet features economy, luxury, and SUV options to suit every need. Flexible pick-up and drop-off, 24/7 customer support, and no hidden fees. Special discounts for weekly rentals. Reserve today for the best deals and a hassle-free experience!
          </p>
        </div>

      </div>
    </section>
  );
};

export default CarSaleSection;
