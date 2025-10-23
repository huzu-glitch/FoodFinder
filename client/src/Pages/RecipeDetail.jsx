import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecipeDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchRecipe();
  }, [id]);

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

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return (
    <div className="page-container">
      <div className="recipe-detail-container">
        <div className="loading-state">Loading...</div>
      </div>
    </div>
  );
  
  if (!recipe) return (
    <div className="page-container">
      <div className="recipe-detail-container">
        <div className="error-state">Recipe not found</div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="recipe-detail-container">
        <div className="recipe-detail-card">
          {/* Large Recipe Image */}
          <div className="recipe-detail-image-container">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="recipe-detail-image"
            />
          </div>

          {/* Recipe Title & Description */}
          <div className="recipe-detail-header">
            <h1 className="recipe-detail-title">{recipe.title}</h1>
            {recipe.summary && (
              <div 
                className="recipe-detail-description"
                dangerouslySetInnerHTML={{ 
                  __html: recipe.summary.replace(/<[^>]*>/g, '') 
                }} 
              />
            )}
            <div className="recipe-detail-meta">
              {recipe.readyInMinutes && (
                <span className="recipe-meta-item">
                  <strong>Ready in:</strong> {recipe.readyInMinutes} minutes
                </span>
              )}
              {recipe.servings && (
                <span className="recipe-meta-item">
                  <strong>Servings:</strong> {recipe.servings}
                </span>
              )}
            </div>
          </div>

          {/* Ingredients Section */}
          {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
            <div className="recipe-detail-section">
              <h2 className="recipe-section-title">Ingredients</h2>
              <ul className="recipe-ingredients-list">
                {recipe.extendedIngredients.map((ingredient, index) => (
                  <li key={index} className="recipe-ingredient-item">
                    {ingredient.original}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions Section */}
          {recipe.instructions && (
            <div className="recipe-detail-section">
              <h2 className="recipe-section-title">Instructions</h2>
              <div className="recipe-instructions">
                <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="recipe-detail-actions">
            <button 
              onClick={handleBack} 
              className="recipe-detail-button recipe-detail-button--secondary"
            >
              Back to Results
            </button>
            {user && (
              <button 
                onClick={handleAddToFavorites} 
                className="recipe-detail-button recipe-detail-button--primary"
              >
                Add to Favorites
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;