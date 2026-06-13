import React from 'react';
import { GiBed } from 'react-icons/gi';
import { TbAirConditioning } from 'react-icons/tb';
import {
  MdTv, MdBedroomParent, MdWaterDrop, MdCelebration,
  MdOutlineCleaningServices, MdWifi
} from 'react-icons/md';
import { FaWifi, FaShower, FaLeaf, FaStar, FaUsers } from 'react-icons/fa';
import {
  FiStar, FiWifi, FiDroplet, FiTv, FiHome, FiCheckCircle,
  FiPhone, FiMapPin, FiSun
} from 'react-icons/fi';

/**
 * Maps icon name strings (as stored in the DB) to React components.
 * Falls back to FiStar if icon name not found.
 */
const ICON_MAP = {
  // Game Icons
  GiBed,
  // Tabler
  TbAirConditioning,
  // Material Design
  MdTv,
  MdBedroomParent,
  MdWaterDrop,
  MdCelebration,
  MdOutlineCleaningServices,
  MdWifi,
  // Font Awesome
  FaWifi,
  FaShower,
  FaLeaf,
  FaStar,
  FaUsers,
  // Feather
  FiStar,
  FiWifi,
  FiDroplet,
  FiTv,
  FiHome,
  FiCheckCircle,
  FiPhone,
  FiMapPin,
  FiSun,
};

/**
 * Returns a React icon element for the given icon name string.
 * @param {string} iconName - Name like 'GiBed', 'FaWifi', etc.
 * @param {number} size - Icon size in px
 * @param {object} props - Additional props to pass to the icon
 */
export const getIcon = (iconName, size = 24, props = {}) => {
  const Icon = ICON_MAP[iconName];
  if (!Icon) return <FiStar size={size} {...props} />;
  return <Icon size={size} {...props} />;
};

export default ICON_MAP;
