import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecipeCard({ recipe, user, showRemoveFromFavorites, onRemoveFromFavorites }) {
  const navigate = useNavigate();

  const handleAddToFavorites = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(`/api/favorite/${recipe.id}`, {
        title: recipe.title,
        image: recipe.image
      });
      alert('Added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const handleRemoveFromFavorites = async (e) => {
    e.preventDefault();
    if (onRemoveFromFavorites) {
      onRemoveFromFavorites();
    }
  };

  return (
    <div className="recipe-card">
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="recipe-card-image"
      />
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {recipe.description && (
          <p className="recipe-card-description">{recipe.description}</p>
        )}
        <div className="recipe-card-actions">
          <Link 
            to={`/recipe/${recipe.id}`} 
            className="recipe-card-button recipe-card-button--primary"
          >
            View Details
          </Link>
          {user && !showRemoveFromFavorites && (
            <button 
              onClick={handleAddToFavorites} 
              className="recipe-card-button recipe-card-button--secondary"
            >
              Add to Favorites
            </button>
          )}
          {showRemoveFromFavorites && (
            <button 
              onClick={handleRemoveFromFavorites} 
              className="recipe-card-button recipe-card-button--danger"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;