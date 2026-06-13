import React from 'react';
import { MdWhatsapp } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';
import './FloatingActions.css';

export default function FloatingActions() {
  return (
    <div className="floating-actions">
      <a href="tel:+917845671542" className="float-btn float-call" aria-label="Call Us">
        <FiPhone size={22} />
      </a>
      <a href="https://wa.me/917845671542" target="_blank" rel="noopener noreferrer" className="float-btn float-wa" aria-label="WhatsApp">
        <MdWhatsapp size={26} />
      </a>
    </div>
  );
}
