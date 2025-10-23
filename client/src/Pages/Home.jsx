import React, { useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import SearchInput from "../components/SearchInput";
import Loading from "../components/Loading";

function Home({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!query.trim()) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await axios.get(`/api/search?q=${query}`);
      if (response.data.success) {
        setResults(response.data.results);
        if (response.data.results.length === 0) {
          setMessage("No recipes found. Try a different search.");
        }
      }
    } catch (error) {
      setMessage("Error fetching recipes. Please try again.");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="search-section">
          <h1>Find Your Perfect Recipe</h1>
          <div className="search-form">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSubmit={handleSearch}
              placeholder="Search for recipes..."
            />
            <div className="search-button-container">
              <button 
                type="button" 
                onClick={handleSearch} 
                className="btn btn-primary" 
                disabled={loading || !query.trim()}
              >
                {loading ? "Searching..." : "Search"}
              </button>
              {loading && query.trim() && (
                <Loading 
                  size="small" 
                  type="spinner" 
                  className="loading-inline" 
                  show={loading}
                />
              )}
            </div>
          </div>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="recipes-grid">
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
