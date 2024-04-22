import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabase';
import './style.css';

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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for recipes..."
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.recipe.uri}>
            <h2>{recipe.recipe.label}</h2>
            <img src={recipe.recipe.image} alt={recipe.recipe.label} />
            <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
            <button onClick={() => saveRecipe(recipe.recipe)}>Save</button>
          </li>
        ))}
      </ul>
      <h2>Saved Recipes</h2>
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