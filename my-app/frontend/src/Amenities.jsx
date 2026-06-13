import React from 'react';
import './Amenities.css';
import { BedDouble, ChefHat, Wifi, Snowflake, Bath, Tv, Flame, Car, ShieldCheck, Coffee, Shirt, HeartPulse } from 'lucide-react';
import { useScrollReveal } from './AnimationUtils';

const Amenities = () => {
  useScrollReveal();
  const amenitiesList = [
    { icon: <BedDouble size={32} />, title: 'Premium Bedding', desc: 'Luxury mattresses with Egyptian cotton linens' },
    { icon: <ChefHat size={32} />, title: 'Modern Kitchen', desc: 'Fully equipped with premium appliances' },
    { icon: <Wifi size={32} />, title: 'High-Speed WiFi', desc: '100 Mbps fiber optic connection' },
    { icon: <Snowflake size={32} />, title: 'Air Conditioning', desc: 'Split AC in every room' },
    { icon: <Bath size={32} />, title: 'Spa Bathroom', desc: 'Rain shower & premium toiletries' },
    { icon: <Tv size={32} />, title: 'Smart TV', desc: '55" 4K with Netflix & Prime' },
    { icon: <Flame size={32} />, title: 'Fire Pit', desc: 'Evening bonfire arrangements' },
    { icon: <Car size={32} />, title: 'Free Parking', desc: 'Secure gated parking' },
    { icon: <ShieldCheck size={32} />, title: '24/7 Security', desc: 'CCTV surveillance & security guards' },
    { icon: <Coffee size={32} />, title: 'Tea/Coffee Maker', desc: 'Complimentary premium beverages' },
    { icon: <Shirt size={32} />, title: 'Laundry Service', desc: 'Same day laundry available' },
    { icon: <HeartPulse size={32} />, title: 'Medical Kit', desc: 'First aid & emergency assistance' }
  ];

  return (
    <section id="amenities" className="amenities">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ Premium Amenities ✦</span>
          <h2>Everything You Need for a Perfect Stay</h2>
          <p>Thoughtfully curated to make your wilderness experience comfortable & memorable</p>
        </div>
        <div className="amenities-grid">
          {amenitiesList.map((amenity, index) => (
            <div className="amenity-card reveal" key={index}>
              <div className="amenity-icon">{amenity.icon}</div>
              <h3>{amenity.title}</h3>
              <p>{amenity.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;