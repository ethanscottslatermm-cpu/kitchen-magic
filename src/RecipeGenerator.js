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
      
      // Extract ingredients from image using Claude
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Quicksand', 'Comic Neue', cursive",
      padding: '20px',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Fredoka:wght@600&display=swap');
        
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
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes cookingAnimation {
          0%, 100% { 
            transform: translateY(0) rotate(-5deg); 
          }
          25% { 
            transform: translateY(-15px) rotate(5deg); 
          }
          50% { 
            transform: translateY(0) rotate(-5deg); 
          }
          75% { 
            transform: translateY(-10px) rotate(3deg); 
          }
        }

        .ingredient-chip {
          animation: slideUp 0.3s ease-out backwards;
        }

        .recipe-card {
          animation: slideUp 0.5s ease-out backwards;
          transition: all 0.3s ease;
        }

        .recipe-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .button {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .button:hover {
          transform: scale(1.05);
        }

        .button:active {
          transform: scale(0.95);
        }

        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          animation: 'slideUp 0.6s ease-out'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '10px'
          }}>
            <h1 style={{
              fontSize: '42px',
              fontFamily: "'Fredoka', cursive",
              color: '#fff',
              margin: 0,
              textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              Kitchen
              <span style={{
                fontSize: '48px',
                display: 'inline-block',
                animation: 'bounce 2s ease-in-out infinite'
              }}>
                🧑‍🍳
              </span>
              Magic
            </h1>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            margin: 0
          }}>
            Scan or add ingredients to discover delicious recipes ✨
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.6s ease-out 0.2s backwards'
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '600',
            color: '#667eea',
            marginTop: 0,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <UtensilsCrossed size={24} />
            My Ingredients
          </h2>

          {/* Camera and Input Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <button
              className="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '16px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              <Camera size={20} />
              Scan Food
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

          {/* Manual Input */}
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Type an ingredient..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              className="button"
              onClick={addIngredient}
              style={{
                padding: '12px 20px',
                background: '#48bb78',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(72, 187, 120, 0.4)'
              }}
            >
              <Plus size={18} />
              Add
            </button>
          </div>

          {/* Ingredients List */}
          {ingredients.length > 0 && (
            <div style={{
              marginTop: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="ingredient-chip"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    background: 'linear-gradient(135deg, #ffd89b 0%, #fc9842 100%)',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(252, 152, 66, 0.3)'
                  }}
                >
                  {ingredient}
                  <X
                    size={16}
                    style={{ cursor: 'pointer' }}
                    onClick={() => removeIngredient(index)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Generate Button */}
          {ingredients.length > 0 && (
            <button
              className="button"
              onClick={generateRecipes}
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '16px',
                background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                borderRadius: '16px',
                color: 'white',
                fontSize: '17px',
                fontWeight: '700',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: loading ? 'none' : '0 6px 16px rgba(245, 87, 108, 0.4)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <Sparkles size={20} className={loading ? 'spinning' : ''} />
              {loading ? 'Generating Magic...' : 'Generate Recipes'}
            </button>
          )}
        </div>

        {/* Loading Animation - Cooking Cat */}
        {loading && (
          <div style={{
            marginTop: '40px',
            textAlign: 'center',
            animation: 'slideUp 0.5s ease-out'
          }}>
            <div style={{
              marginBottom: '20px'
            }}>
              <img 
                src="https://media.tenor.com/zWgPObq1HIEAAAAM/cat-cooking.gif"
                alt="Chef cat cooking"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  background: 'white',
                  padding: '10px'
                }}
              />
            </div>
            <p style={{
              color: '#fff',
              fontSize: '18px',
              fontWeight: '600',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Chef Whiskers is cooking up something special...
            </p>
          </div>
        )}

        {/* Recipes Display */}
        {recipes.length > 0 && (
          <div style={{
            marginTop: '24px'
          }}>
            <h2 style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '16px',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>🍽️</span>
              Your Recipe Ideas
              <span style={{ fontSize: '32px' }}>🍳</span>
            </h2>
            
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="recipe-card"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  background: 'white',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '40px',
                  opacity: '0.3'
                }}>
                  🍴
                </div>
                
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#764ba2',
                  marginTop: 0,
                  marginBottom: '8px'
                }}>
                  {recipe.name}
                </h3>
                
                <p style={{
                  color: '#4a5568',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  marginBottom: '12px'
                }}>
                  {recipe.description}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '12px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    background: '#e6fffa',
                    color: '#319795',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    ⏱️ {recipe.time}
                  </span>
                  <span style={{
                    background: '#fef5e7',
                    color: '#d69e2e',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    📊 {recipe.difficulty}
                  </span>
                </div>

                <div style={{
                  borderTop: '2px dashed #e2e8f0',
                  paddingTop: '12px',
                  marginTop: '12px'
                }}>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#718096',
                    marginBottom: '6px'
                  }}>
                    Using:
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    {recipe.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#edf2f7',
                          color: '#4a5568',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '13px'
                        }}
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {recipe.instructions && recipe.instructions.length > 0 && (
                  <div style={{
                    borderTop: '2px dashed #e2e8f0',
                    paddingTop: '12px',
                    marginTop: '12px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#667eea',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      👨‍🍳 Cooking Instructions:
                    </p>
                    <ol style={{
                      margin: '0',
                      paddingLeft: '20px',
                      color: '#4a5568'
                    }}>
                      {recipe.instructions.map((instruction, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                            marginBottom: '8px'
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
