import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabase';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'; 


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
    <Container>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search for recipes..."
              />
            </Form.Group>
            <Button variant="primary" type="submit">Search</Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-4">
        {recipes.map((recipe) => (
          <Col key={recipe.recipe.uri} xs={12} sm={6} md={4} lg={3}>
            <Card className="mb-4">
              <Card.Img variant="top" src={recipe.recipe.image} alt={recipe.recipe.label} />
              <Card.Body>
                <Card.Title>{recipe.recipe.label}</Card.Title>
                <Card.Text>
                  <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
                </Card.Text>
                <Button variant="primary" onClick={() => saveRecipe(recipe.recipe)}>Save</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <h2>Saved Recipes</h2>
        </Col>
      </Row>
      <Row className="mt-2 justify-content-center">
        {savedRecipes.map((savedRecipe) => (
          <Col key={savedRecipe.id} xs={6} sm={4} md={3} lg={2}>
            <Card className="mb-4">
              <Card.Img variant="top" src={savedRecipe.image} alt={savedRecipe.label} />
              <Card.Body>
                <Card.Title>{savedRecipe.label}</Card.Title>
                <Card.Text>
                  <a href={savedRecipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RecipeSearch;