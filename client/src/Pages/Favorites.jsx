import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

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

  if (loading) return (
    <div className="page-container">
      <div className="container">
        <div className="loading-state">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>My Favorite Recipes</h1>
        </div>
        {favorites.length === 0 ? (
          <div className="empty-state">
            <p>No favorites yet. Start searching for recipes!</p>
          </div>
        ) : (
          <div className="recipes-grid">
            {favorites.map((fav) => {
              // Transform favorite data to match RecipeCard expected format
              const recipeData = {
                id: fav.recipe_id,
                title: fav.title,
                image: fav.image_url,
                description: fav.description || 'One of your favorite recipes'
              };
              return (
                <RecipeCard 
                  key={fav.recipe_id} 
                  recipe={recipeData} 
                  user={true} 
                  showRemoveFromFavorites={true}
                  onRemoveFromFavorites={() => handleRemove(fav.recipe_id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;