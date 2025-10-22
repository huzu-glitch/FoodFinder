import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/favorites');
      if (response.data.success) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (recipeId) => {
    try {
      const response = await axios.delete(`/api/favorites/${recipeId}`);
      if (response.data.success) {
        setFavorites(favorites.filter(fav => fav.recipe_id !== recipeId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>My Favorite Recipes</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet. Start searching for recipes!</p>
      ) : (
        <div className="recipes-grid">
          {favorites.map((fav) => (
            <div key={fav.recipe_id} className="recipe-card">
              <img src={fav.image_url} alt={fav.title} />
              <div className="recipe-card-content">
                <h3>{fav.title}</h3>
                <div className="recipe-card-actions">
                  <Link to={`/recipe/${fav.recipe_id}`} className="btn btn-sm">
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleRemove(fav.recipe_id)} 
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;