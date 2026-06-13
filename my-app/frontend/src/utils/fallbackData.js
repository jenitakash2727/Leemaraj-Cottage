export const FALLBACK_ROOMS = [
  { id: 1, name: 'Single Room', price_per_day: 2500, suitable_guests: 2, additional_guest_info: 'Up to 2 Additional Guests Can Be Accommodated', image_url: '' },
  { id: 2, name: 'Double Bedroom', price_per_day: 4000, suitable_guests: 4, additional_guest_info: '1 Additional Guest Can Be Accommodated', image_url: '' },
  { id: 3, name: 'Triple Bedroom', price_per_day: 6000, suitable_guests: 6, additional_guest_info: '1–2 Additional Guests Can Be Accommodated Subject to Availability', image_url: '' },
];

export const FALLBACK_PACKAGES = [
  { id: 1, guest_range: '25–35 Guests', price: 23000, duration: '24 Hours', no_extra_charges: true },
  { id: 2, guest_range: '1–15 Guests', price: 12000, duration: '24 Hours', no_extra_charges: true },
  { id: 3, guest_range: 'Up to 10 Guests', price: 10000, duration: '24 Hours', no_extra_charges: true },
];

export const FALLBACK_AMENITIES = [
  { id: 1, name: '5 Queen Size Teakwood Beds', description: 'Premium teakwood beds for a comfortable sleep.', icon: 'FiCheckCircle' },
  { id: 2, name: 'Fully Air-Conditioned Rooms', description: 'Stay cool and comfortable.', icon: 'FiCheckCircle' },
  { id: 3, name: '65-Inch Smart TV with OTT Access', description: 'Enjoy your favorite shows and movies.', icon: 'FiCheckCircle' },
  { id: 4, name: 'Free High-Speed Wi-Fi', description: 'Stay connected throughout the property.', icon: 'FiCheckCircle' },
  { id: 5, name: 'Extra Beds Available on Request', description: 'Flexible sleeping arrangements.', icon: 'FiCheckCircle' },
  { id: 6, name: '24 Hours Hot & Normal Water Facility', description: 'Available at all times.', icon: 'FiCheckCircle' },
  { id: 7, name: '24 Hours RO Drinking Water Facility', description: 'Pure and safe drinking water.', icon: 'FiCheckCircle' },
  { id: 8, name: 'Ideal for Events & Gatherings', description: 'Perfect for Family Functions, Wedding Events, Temple Visits, Picnics & Group Outings.', icon: 'FiCheckCircle' },
  { id: 9, name: 'Spacious, Clean and Peaceful Environment', description: 'Relax in our beautifully maintained property.', icon: 'FiCheckCircle' },
];

export const FALLBACK_POLICIES = [
  { id: 1, title: 'Cancellation', content: '50% Refund Will Be Provided Upon Cancellation', policy_type: 'cancellation' },
  { id: 2, title: 'Check-In', content: 'Check-In Is Not Permitted Between 10:00 PM and 5:00 AM', policy_type: 'checkin' },
  { id: 3, title: 'Smoking', content: 'Smoking Is Strictly Prohibited', policy_type: 'rules' },
  { id: 4, title: 'Alcohol', content: 'Alcohol / Liquor Is Strictly Prohibited', policy_type: 'rules' },
  { id: 5, title: 'Food', content: 'Non-Vegetarian Cooking and Consumption Inside the Property Is Not Allowed', policy_type: 'rules' },
  { id: 6, title: 'Pets', content: 'Pets Are Not Allowed', policy_type: 'rules' },
  { id: 7, title: 'Couples', content: 'Unmarried Couples Are Strictly Not Allowed', policy_type: 'rules' },
];
