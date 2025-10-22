import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecipeCard({ recipe, user }) {
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

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-card-content">
        <h3>{recipe.title}</h3>
        <div className="recipe-card-actions">
          <Link to={`/recipe/${recipe.id}`} className="btn btn-sm">
            View Recipe
          </Link>
          {user && (
            <button onClick={handleAddToFavorites} className="btn btn-sm btn-primary">
              Add to Favorites
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;