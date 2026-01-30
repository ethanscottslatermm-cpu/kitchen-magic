import React, { useState, useRef } from 'react';
import { Camera, Plus, X, ChefHat, Sparkles, Trash2, UtensilsCrossed } from 'lucide-react';

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleImageCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result.split(',')[1];
      setCapturedImage(event.target.result);
      
      setLoading(true);
      try {
        const response = await fetch('/.netlify/functions/anthropic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: file.type,
                    data: base64Image
                  }
                },
                {
                  type: 'text',
                  text: 'List all the food ingredients you can see in this image. Return ONLY a JSON array of ingredient names, nothing else. Format: ["ingredient1", "ingredient2", ...]. Be specific and list individual items.'
                }
              ]
            }]
          })
        });

        const data = await response.json();
        const text = data.content[0].text.trim();
        const cleanText = text.replace(/```json|```/g, '').trim();
        const detectedIngredients = JSON.parse(cleanText);
        
        setIngredients([...ingredients, ...detectedIngredients]);
        setCapturedImage(null);
      } catch (error) {
        console.error('Error detecting ingredients:', error);
        alert('Could not detect ingredients. Please try again or add them manually.');
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const generateRecipes = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    setRecipes([]);

    const coreIngredients = ['salt', 'pepper', 'onion', 'cheese', 'garlic powder', 'onion powder'];
    const allIngredients = [...new Set([...ingredients, ...coreIngredients])];

    try {
      const response = await fetch('/.netlify/functions/anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `I have these ingredients: ${ingredients.join(', ')}. 

You can also assume I have these common pantry items available: salt, pepper, onion, cheese, garlic powder, onion powder.

Suggest 3 simple, everyday recipes that a regular person would make at home. Focus on common meals like sandwiches, pasta, stir-fries, casseroles, breakfast foods, etc. - NOT fancy restaurant dishes. Keep it practical and easy. Return ONLY a JSON array with this exact format:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "ingredients": ["ingredient1", "ingredient2"],
    "time": "cooking time",
    "difficulty": "easy/medium/hard",
    "instructions": ["Step 1 instruction", "Step 2 instruction", "Step 3 instruction"]
  }
]

Include clear step-by-step cooking instructions. Make recipes that feel like home cooking, not gourmet meals. No preamble or explanation, just the JSON array.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text.trim();
      const cleanText = text.replace(/```json|```/g, '').trim();
      const generatedRecipes = JSON.parse(cleanText);
      
      setRecipes(generatedRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert('Could not generate recipes. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      padding: '40px 20px',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .ingredient-chip {
          animation: slideUp 0.3s ease-out backwards;
        }

        .recipe-card {
          animation: slideUp 0.5s ease-out backwards;
          transition: all 0.3s ease;
        }

        .recipe-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .button {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .button:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          animation: 'slideUp 0.6s ease-out',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '50px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #d4af37)',
            }}></div>
            <h1 style={{
              fontSize: '48px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: '300',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '8px',
              textTransform: 'uppercase'
            }}>
              CHEF
            </h1>
            <div style={{
              width: '50px',
              height: '2px',
              background: 'linear-gradient(90deg, #d4af37, transparent)',
            }}></div>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            margin: 0,
            letterSpacing: '3px',
            fontWeight: '300',
            textTransform: 'uppercase'
          }}>
            Executive Recipe Generator
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'rgba(26, 26, 26, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.6s ease-out 0.2s backwards',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#d4af37',
            marginTop: 0,
            marginBottom: '25px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Available Ingredients
          </h2>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <button
              className="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                padding: '16px',
                background: 'transparent',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '4px',
                color: '#d4af37',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              <Camera size={18} />
              Scan Ingredients
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Enter ingredient..."
              style={{
                flex: 1,
                padding: '14px 20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                background: 'rgba(0,0,0,0.3)',
                color: '#ffffff',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
            <button
              className="button"
              onClick={addIngredient}
              style={{
                padding: '14px 30px',
                background: '#d4af37',
                border: 'none',
                borderRadius: '4px',
                color: '#000000',
                fontSize: '13px',
                fontWeight: '600',
                fontFamily: 'inherit',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              Add
            </button>
          </div>

          {ingredients.length > 0 && (
            <div style={{
              marginTop: '25px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="ingredient-chip"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    padding: '10px 16px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#d4af37',
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                  }}
                >
                  {ingredient}
                  <X
                    size={14}
                    style={{ cursor: 'pointer', opacity: 0.7 }}
                    onClick={() => removeIngredient(index)}
                  />
                </div>
              ))}
            </div>
          )}

          {ingredients.length > 0 && (
            <button
              className="button"
              onClick={generateRecipes}
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '30px',
                padding: '18px',
                background: loading ? 'rgba(100,100,100,0.3)' : '#d4af37',
                border: 'none',
                borderRadius: '4px',
                color: '#000000',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'inherit',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : 'Generate Recipes'}
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            marginTop: '60px',
            textAlign: 'center',
            animation: 'slideUp 0.5s ease-out'
          }}>
            <div style={{
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(26, 26, 26, 0.8)',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px'
              }}>
                👨‍🍳
              </div>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '16px',
              fontWeight: '300',
              letterSpacing: '2px',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              I'll be serving you shortly
            </p>
          </div>
        )}

        {/* Recipes Display */}
        {recipes.length > 0 && (
          <div style={{
            marginTop: '50px'
          }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#d4af37',
              marginBottom: '30px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textAlign: 'center'
            }}>
              Your Curated Recipes
            </h2>
            
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="recipe-card"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  background: 'rgba(26, 26, 26, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '35px',
                  marginBottom: '25px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '400',
                  color: '#ffffff',
                  marginTop: 0,
                  marginBottom: '12px',
                  letterSpacing: '1px'
                }}>
                  {recipe.name}
                </h3>
                
                <p style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  marginBottom: '20px',
                  fontWeight: '300'
                }}>
                  {recipe.description}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '15px',
                  marginBottom: '25px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#d4af37',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                  }}>
                    {recipe.time}
                  </span>
                  <span style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#d4af37',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    textTransform: 'capitalize'
                  }}>
                    {recipe.difficulty}
                  </span>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '20px',
                  marginTop: '20px'
                }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#d4af37',
                    marginBottom: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    Ingredients
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {recipe.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'rgba(255,255,255,0.7)',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '300'
                        }}
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {recipe.instructions && recipe.instructions.length > 0 && (
                  <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '20px',
                    marginTop: '20px'
                  }}>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#d4af37',
                      marginBottom: '15px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>
                      Preparation
                    </p>
                    <ol style={{
                      margin: '0',
                      paddingLeft: '20px',
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: '1.8'
                    }}>
                      {recipe.instructions.map((instruction, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: '14px',
                            marginBottom: '12px',
                            fontWeight: '300'
                          }}
                        >
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
