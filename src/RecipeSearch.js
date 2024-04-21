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
  const searchRecipes = async () => {
    try {
      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      setRecipes(response.data.hits);
    } catch (error) {
      console.error('Error fetching recipes:', error);
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
    <div className="container mx-auto flex flex-col md:flex-row">
      <div className="md:w-1/2 p-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for recipes..."
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Search</button>
        </form>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.recipe.uri} className="mb-4">
              <h2>{recipe.recipe.label}</h2>
              <img src={recipe.recipe.image} alt={recipe.recipe.label} className="w-full h-auto" />
              <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:text-blue-700">View Recipe</a>
              <button onClick={() => saveRecipe(recipe.recipe)} className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Save</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Saved Recipes</h2>
        <ul>
          {savedRecipes.map((savedRecipe) => (
            <li key={savedRecipe.id} className="mb-4">
              <h2>{savedRecipe.label}</h2>
              <img src={savedRecipe.image} alt={savedRecipe.label} className="w-full h-auto" />
              <a href={savedRecipe.url} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:text-blue-700">View Recipe</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeSearch;