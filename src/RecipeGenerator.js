import React, { useState, useRef } from 'react';
import { Camera, Plus, X, Sparkles, UtensilsCrossed, ChevronRight, Lightbulb } from 'lucide-react';

export default function RecipeGenerator() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [recipeCount, setRecipeCount] = useState(5);
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

Suggest ${recipeCount} diverse recipes ranging from simple everyday meals to creative/gourmet dishes. Mix it up with:
- Simple comfort food (sandwiches, pasta, basic dinners)
- Creative/interesting combinations
- International cuisine variations
- Quick meals and more elaborate dishes

For each recipe, include:
1. Recipes using ONLY my current ingredients
2. Creative variations that might need 1-2 additional ingredients (mark these clearly as "optional additions")

Return ONLY a JSON array with this exact format:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "ingredients": ["ingredient1", "ingredient2"],
    "time": "cooking time",
    "difficulty": "easy/medium/hard",
    "creativityLevel": "simple/creative/gourmet",
    "optionalAdditions": ["optional ingredient 1", "optional ingredient 2"],
    "instructions": ["Step 1 instruction", "Step 2 instruction", "Step 3 instruction"]
  }
]

Be diverse in your suggestions - include both practical everyday meals and more adventurous creative options. No preamble or explanation, just the JSON array.`
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

  // Welcome Screen
  if (showWelcome) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

          .terms-content {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 10px;
          }

          .terms-content::-webkit-scrollbar {
            width: 6px;
          }

          .terms-content::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
            border-radius: 3px;
          }

          .terms-content::-webkit-scrollbar-thumb {
            background: rgba(212, 175, 55, 0.5);
            border-radius: 3px;
          }
        `}</style>

        <div style={{
          maxWidth: '700px',
          width: '100%',
          animation: 'slideUp 0.6s ease-out'
        }}>
          {/* Logo/Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '60px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #d4af37)',
              }}></div>
              <h1 style={{
                fontSize: '56px',
                fontWeight: '300',
                color: '#ffffff',
                margin: 0,
                letterSpacing: '10px',
                textTransform: 'uppercase'
              }}>
                CHEF
              </h1>
              <div style={{
                width: '60px',
                height: '2px',
                background: 'linear-gradient(90deg, #d4af37, transparent)',
              }}></div>
            </div>
            <p style={{
              color: '#d4af37',
              fontSize: '14px',
              margin: 0,
              letterSpacing: '3px',
              fontWeight: '300',
              textTransform: 'uppercase'
            }}>
              Executive Recipe Generator
            </p>
          </div>

          {/* Welcome Card */}
          <div style={{
            background: 'rgba(26, 26, 26, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '50px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '300',
              color: '#ffffff',
              marginTop: 0,
              marginBottom: '15px',
              letterSpacing: '2px'
            }}>
              Welcome Back
            </h2>
            
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '15px',
              lineHeight: '1.8',
              marginBottom: '35px',
              fontWeight: '300'
            }}>
              Your personal culinary assistant powered by advanced AI technology. 
              Transform your available ingredients into exceptional meals with precision and ease.
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '25px',
              marginBottom: '35px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#d4af37',
                  margin: 0,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase'
                }}>
                  Terms & Conditions
                </h3>
                <button
                  onClick={() => setShowTerms(!showTerms)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontFamily: 'inherit',
                    letterSpacing: '0.5px'
                  }}
                >
                  {showTerms ? 'Hide' : 'Read Full Terms'}
                </button>
              </div>

              {showTerms ? (
                <div className="terms-content" style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  lineHeight: '1.7',
                  fontWeight: '300'
                }}>
                  <p style={{ marginTop: '10px', marginBottom: '10px' }}><strong>Last Updated:</strong> January 2026</p>
                  
                  <p style={{ marginBottom: '15px' }}>
                    By accessing and using this Executive Recipe Generator ("Service"), you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>1. Acceptance of Terms</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    By using this Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use immediately.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>2. Service Description</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    The Service provides AI-powered recipe suggestions based on user-provided ingredients. Recipes are generated for informational and convenience purposes only.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>3. User Responsibilities</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    You are responsible for verifying the accuracy and safety of all recipes. Users should exercise proper food safety practices and be aware of personal dietary restrictions, allergies, and health conditions. We are not liable for any adverse effects resulting from recipe preparation or consumption.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>4. Intellectual Property</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    All content, design, and functionality of the Service are owned by Monarch-Elite Holdings and protected by intellectual property laws. Unauthorized reproduction or distribution is prohibited.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>5. Privacy & Data</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    Ingredient data and uploaded images are processed to generate recipes. We do not store personal data beyond what is necessary for Service functionality. By using the Service, you consent to this processing.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>6. Disclaimers</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    The Service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or suitability of recipes. Users assume all risk associated with recipe preparation and consumption.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>7. Limitation of Liability</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    Monarch-Elite Holdings shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from use of the Service, including but not limited to food-related injuries, allergic reactions, or property damage.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>8. Modifications</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    We reserve the right to modify these Terms at any time. Continued use of the Service constitutes acceptance of modified Terms.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>9. Governing Law</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>10. Contact</strong></p>
                  <p style={{ marginBottom: '5px' }}>
                    For questions regarding these Terms, please contact: legal@monarch-elite.com
                  </p>
                </div>
              ) : (
                <p style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  margin: 0,
                  fontWeight: '300'
                }}>
                  By proceeding, you agree to our Terms and Conditions. This Service provides AI-generated recipe suggestions based on your ingredients. You are responsible for verifying recipe safety and accuracy.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowWelcome(false)}
              style={{
                width: '100%',
                padding: '18px',
                background: '#d4af37',
                border: 'none',
                borderRadius: '4px',
                color: '#000000',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'inherit',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Continue to Generator
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '30px',
            textAlign: 'left',
            paddingLeft: '10px'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '11px',
              margin: 0,
              fontWeight: '300',
              letterSpacing: '0.5px'
            }}>
              Powered by <span style={{ color: '#d4af37', fontWeight: '500' }}>Monarch-Elite Holdings</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      padding: '40px 20px',
      animation: 'fadeIn 0.6s ease-out',
      position: 'relative'
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
        maxWidth: '900px',
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

          {/* Recipe Count Selector */}
          {ingredients.length > 0 && (
            <div style={{
              marginTop: '25px',
              padding: '20px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#d4af37',
                marginBottom: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                Number of Recipes: {recipeCount}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={recipeCount}
                onChange={(e) => setRecipeCount(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#d4af37'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>3</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>10</span>
              </div>
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
              <img 
                src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTM5cjM3YzlxMGQzaThtNmtkdXU1NDJzcG1sYzBpOXFmMjh3a3VrOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1vnAdLgAmPqV5WcJ4W/giphy.gif"
                alt="Chef preparing"
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  background: 'rgba(26, 26, 26, 0.8)',
                  padding: '10px'
                }}
              />
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
              Your Curated Recipes ({recipes.length})
            </h2>
            
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="recipe-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: 'rgba(26, 26, 26, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '35px',
                  marginBottom: '25px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '400',
                    color: '#ffffff',
                    margin: 0,
                    letterSpacing: '1px',
                    flex: 1
                  }}>
                    {recipe.name}
                  </h3>
                  {recipe.creativityLevel && (
                    <span style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: recipe.creativityLevel === 'gourmet' ? 'rgba(212, 175, 55, 0.2)' : 
                                  recipe.creativityLevel === 'creative' ? 'rgba(100, 150, 255, 0.2)' : 
                                  'rgba(100, 255, 150, 0.2)',
                      color: recipe.creativityLevel === 'gourmet' ? '#d4af37' : 
                             recipe.creativityLevel === 'creative' ? '#6496ff' : 
                             '#64ff96',
                      border: `1px solid ${recipe.creativityLevel === 'gourmet' ? 'rgba(212, 175, 55, 0.4)' : 
                                          recipe.creativityLevel === 'creative' ? 'rgba(100, 150, 255, 0.4)' : 
                                          'rgba(100, 255, 150, 0.4)'}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '600'
                    }}>
                      {recipe.creativityLevel === 'gourmet' ? '✨ Gourmet' : 
                       recipe.creativityLevel === 'creative' ? '💡 Creative' : 
                       '🍽️ Simple'}
                    </span>
                  )}
                </div>
                
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

                {recipe.optionalAdditions && recipe.optionalAdditions.length > 0 && (
                  <div style={{
                    borderTop: '1px solid rgba(100, 150, 255, 0.2)',
                    paddingTop: '20px',
                    marginTop: '20px',
                    background: 'rgba(100, 150, 255, 0.05)',
                    padding: '20px',
                    borderRadius: '6px'
                  }}>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6496ff',
                      marginBottom: '12px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Lightbulb size={14} />
                      Optional Additions (Enhance This Dish)
                    </p>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {recipe.optionalAdditions.map((ing, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(100, 150, 255, 0.1)',
                            border: '1px solid rgba(100, 150, 255, 0.3)',
                            color: '#6496ff',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '400'
                          }}
                        >
                          + {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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

      {/* Footer - Always visible on main app */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '11px',
          margin: 0,
          fontWeight: '300',
          letterSpacing: '0.5px'
        }}>
          Powered by <span style={{ color: '#d4af37', fontWeight: '500' }}>Monarch-Elite Holdings</span>
        </p>
      </div>
    </div>
  );
}
