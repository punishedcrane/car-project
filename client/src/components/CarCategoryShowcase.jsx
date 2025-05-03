import React from 'react';

const CarCategoryShowcase = () => {
  const categories = [
    {
      id: 1,
      name: "Economy",
      description: "Our economy cars offer excellent fuel efficiency and affordability, perfect for city driving and budget-conscious travelers. These compact vehicles provide reliability and ease of parking while maintaining comfort for daily commutes.",
      image: "https://res.cloudinary.com/dysu1piy1/image/upload/v1745752277/swift-removebg-preview_1_krweot.png"
    },
    {
      id: 2,
      name: "Standard",
      description: "Standard vehicles balance comfort and value with additional space for passengers and luggage. These mid-size cars provide improved features, smoother rides, and are ideal for families or small groups looking for reliable transportation.",
      image: "https://res.cloudinary.com/dysu1piy1/image/upload/v1745752570/Screenshot_2025-04-25_202839-removebg-preview_5_1_swljig.png"
    },
    {
      id: 3,
      name: "Premium",
      description: "Premium cars deliver an upgraded experience with enhanced comfort, superior performance, and advanced technology features. Enjoy premium materials, enhanced sound systems, and additional safety features for a refined driving experience.",
      image: "https://res.cloudinary.com/dysu1piy1/image/upload/v1745752664/Screenshot_2025-04-25_202839-removebg-preview_1_1_neb7fv.png"
    },
    {
      id: 4,
      name: "Luxury",
      description: "Our luxury category offers top-tier vehicles featuring superior craftsmanship, cutting-edge technology, and exceptional performance. Experience first-class comfort with premium leather interiors, advanced driver assistance, and prestigious brands.",
      image: "https://res.cloudinary.com/dysu1piy1/image/upload/v1745752670/Screenshot_2025-04-25_202839-removebg-preview_6_1_l0qhkx.png"
    }
  ];

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 font-goldman">Our Fleet Categories</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="flex flex-col md:flex-row rounded-lg overflow-hidden border-2 border-yellow-500 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-sky-400 hover:bg-blue-950 hover:text-white group"
          >
            {/* Image takes 30% width on medium screens and up */}
            <div className="md:w-1/3 flex-shrink-0 flex items-center justify-center p-2">
              <img 
                src={category.image} 
                alt={`${category.name} car`} 
                className="w-full h-auto object-contain max-h-48"
              />
            </div>
            
            {/* Content takes 70% width on medium screens and up */}
            <div className="md:w-2/3 p-6">
              <h3 className="text-xl font-bold mb-4 group-hover:text-white font-goldman">{category.name}</h3>
              <p className="group-hover:text-white">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarCategoryShowcase;