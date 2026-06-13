import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="spinner-wrapper" role="status" aria-label={text}>
    <div className="spinner" />
    {text && <p className="spinner-text">{text}</p>}
  </div>
);

export const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner spinner--lg" />
  </div>
);

export const InlineError = ({ message = 'Something went wrong. Please try again.' }) => (
  <div className="inline-error" role="alert">
    <span className="inline-error__icon">!</span>
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
