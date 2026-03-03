import React from 'react';
import { HiCheckCircle, HiExclamation, HiXCircle } from 'react-icons/hi';

const StockBadge = ({ quantity, threshold = 10 }) => {
  if (quantity === 0) {
    return (
      <span className="badge badge-danger inline-flex items-center">
        <HiXCircle className="mr-1 h-4 w-4" />
        Out of Stock
      </span>
    );
  }
  
  if (quantity <= 3) {
    return (
      <span className="badge badge-danger inline-flex items-center">
        <HiExclamation className="mr-1 h-4 w-4" />
        Critical ({quantity})
      </span>
    );
  }
  
  if (quantity <= threshold) {
    return (
      <span className="badge badge-warning inline-flex items-center">
        <HiExclamation className="mr-1 h-4 w-4" />
        Low ({quantity})
      </span>
    );
  }
  
  return (
    <span className="badge badge-success inline-flex items-center">
      <HiCheckCircle className="mr-1 h-4 w-4" />
      In Stock ({quantity})
    </span>
  );
};

export default StockBadge;