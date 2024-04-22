import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabase';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const RecipeSearch = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  

  useEffect(() => {
    fetchSavedRecipes();
  }, []); 


  const APP_ID = 'd1f32121';
  const APP_KEY = '88b6effb4d9723efc212e72d295399e3';

  const fetchSavedRecipes = async () => {
    try {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) {
        throw error;
      }
      setSavedRecipes(data || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error.message);
    }
  };

  const saveRecipe = async (recipe) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([
          {
            label: recipe.label,
            image: recipe.image,
            url: recipe.url,
          },
        ]);

      if (error) {
        throw error;
      }

      setSavedRecipes([...savedRecipes, data[0]]);
    } catch (error) {
      console.error('Error saving recipe:', error.message);
    }
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      setRecipes(response.data.hits);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="input-group">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                className="form-control"
                placeholder="Search for recipes..."
              />
              <div className="input-group-append">
                <button type="submit" className="btn btn-primary">Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-4 mb-4" key={recipe.recipe.uri}>
            <div className="card">
              <img src={recipe.recipe.image} className="card-img-top" alt={recipe.recipe.label} />
              <div className="card-body">
                <h5 className="card-title">{recipe.recipe.label}</h5>
                <a href={recipe.recipe.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">View Recipe</a>
                <button onClick={() => saveRecipe(recipe.recipe)} className="btn btn-success ml-2">Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-5">Saved Recipes</h2>
      <ul>
        {savedRecipes.map((savedRecipe) => (
          <li key={savedRecipe.id}>
            <h2>{savedRecipe.label}</h2>
            <img src={savedRecipe.image} alt={savedRecipe.label} />
            <a href={savedRecipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RecipeSearch;