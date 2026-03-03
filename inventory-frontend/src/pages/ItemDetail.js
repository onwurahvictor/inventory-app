// ItemDetail.js - Add error handling
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { itemAPI } from '../services/api';
import './ItemDetail.css';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    } else {
      setError('No item ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching item with ID:', id);
      
      const response = await itemAPI.getById(id);
      console.log('Item response:', response);
      
      if (response.data.success) {
        setItem(response.data.data.item);
      } else {
        throw new Error('Item not found');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      
      if (error.response?.status === 404) {
        setError('Item not found. It may have been deleted.');
        toast.error('Item not found');
      } else {
        setError('Failed to load item details');
        toast.error('Failed to load item');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Item</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/items')} className="btn-primary">
          Back to Items
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="error-state">
        <div className="error-icon">❓</div>
        <h2>Item Not Found</h2>
        <p>The item you're looking for doesn't exist or has been deleted.</p>
        <button onClick={() => navigate('/items')} className="btn-primary">
          Back to Items
        </button>
      </div>
    );
  }

  return (
    <div className="item-detail-page">
      {/* Your existing item detail JSX */}
      <div className="detail-header">
        <button onClick={() => navigate('/items')} className="back-btn">
          ← Back to Items
        </button>
        <h1>{item.name}</h1>
        <p>SKU: {item.sku || 'N/A'}</p>
      </div>
      {/* Rest of your item detail content */}
    </div>
  );
};

export default ItemDetail;