import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecipeDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/api/recipe/${id}`);
      if (response.data.success) {
        setRecipe(response.data.recipe);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(`/api/favorite/${id}`, {
        title: recipe.title,
        image: recipe.image
      });
      alert('Added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!recipe) return <div className="container">Recipe not found</div>;

  return (
    <div className="container">
      <div className="recipe-detail">
        <h1>{recipe.title}</h1>
        <img src={recipe.image} alt={recipe.title} className="recipe-detail-img" />
        
        {user && (
          <button onClick={handleAddToFavorites} className="btn btn-primary">
            Add to Favorites
          </button>
        )}

        <div className="recipe-info">
          <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
        </div>

        {recipe.instructions && (
          <div className="recipe-section">
            <h2>Instructions</h2>
            <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
          </div>
        )}

        {recipe.extendedIngredients && (
          <div className="recipe-section">
            <h2>Ingredients</h2>
            <ul>
              {recipe.extendedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetail;