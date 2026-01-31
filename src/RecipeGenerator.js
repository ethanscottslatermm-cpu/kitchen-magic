/**
 * Copyright (c) 2026 Monarch-Elite Holdings
 * All Rights Reserved
 * 
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Unauthorized copying, modification, distribution, or use of this software,
 * via any medium, is strictly prohibited without explicit written permission
 * from Monarch-Elite Holdings.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Plus, X, Sparkles, UtensilsCrossed, ChevronRight, Lightbulb, Download, Clock, TrendingUp } from 'lucide-react';

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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Food category icons mapping
  const foodIcons = {
    'rice': '🍚',
    'tomato': '🥫',
    'egg': '🥚',
    'chicken': '🍗',
    'broccoli': '🥦',
    'pepper': '🌶️',
    'pasta': '🍝',
    'bread': '🍞',
    'cheese': '🧀',
    'milk': '🥛',
    'beef': '🥩',
    'pork': '🥓',
    'fish': '🐟',
    'shrimp': '🍤',
    'potato': '🥔',
    'carrot': '🥕',
    'onion': '🧅',
    'garlic': '🧄',
    'lettuce': '🥬',
    'mushroom': '🍄',
    'corn': '🌽',
    'bean': '🫘',
    'default': '🥘'
  };

  const getIngredientIcon = (ingredient) => {
    const lower = ingredient.toLowerCase();
    for (const [key, icon] of Object.entries(foodIcons)) {
      if (lower.includes(key)) return icon;
    }
    return foodIcons.default;
  };

  // PWA Install Prompt Handler
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('App installed successfully');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

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
3. A food image search term (simple 2-3 word description for finding images)

CRITICAL: You MUST return ONLY valid JSON. No markdown, no backticks, no explanation text.

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
    "imageSearchTerm": "fried rice chicken",
    "instructions": ["Step 1 instruction", "Step 2 instruction", "Step 3 instruction"]
  }
]

Be diverse in your suggestions - include both practical everyday meals and more adventurous creative options. Return ONLY the JSON array, nothing else.`
          }]
        })
      });

      const data = await response.json();
      
      let text = data.content[0].text.trim();
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      const firstBracket = text.indexOf('[');
      const lastBracket = text.lastIndexOf(']');
      
      if (firstBracket === -1 || lastBracket === -1) {
        throw new Error('Invalid JSON response - no array found');
      }
      
      text = text.substring(firstBracket, lastBracket + 1);
      
      let generatedRecipes;
      try {
        generatedRecipes = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Attempted to parse:', text);
        throw new Error('Could not parse recipe JSON. Please try again with different ingredients or fewer recipes.');
      }
      
      if (!Array.isArray(generatedRecipes) || generatedRecipes.length === 0) {
        throw new Error('No recipes were generated. Please try again.');
      }
      
      // Add Unsplash images to recipes
      const recipesWithImages = generatedRecipes.map(recipe => ({
        ...recipe,
        imageUrl: `https://source.unsplash.com/400x400/?${encodeURIComponent(recipe.imageSearchTerm || recipe.name)}`
      }));
      
      setRecipes(recipesWithImages);
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert(`Could not generate recipes: ${error.message}\n\nTry using fewer ingredients or reducing the number of recipes.`);
    }

    setLoading(false);
  };

  // Welcome Screen
  if (showWelcome) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1e1e1e 100%)',
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

          @keyframes fadeInText {
            from { 
              opacity: 0;
              transform: translateY(10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes glow {
            from {
              text-shadow: 
                0 0 10px rgba(212, 175, 55, 0.8),
                0 0 20px rgba(212, 175, 55, 0.6),
                0 0 30px rgba(212, 175, 55, 0.4),
                0 0 40px rgba(212, 175, 55, 0.2);
            }
            to {
              text-shadow: 
                0 0 15px rgba(212, 175, 55, 1),
                0 0 30px rgba(212, 175, 55, 0.8),
                0 0 45px rgba(212, 175, 55, 0.6),
                0 0 60px rgba(212, 175, 55, 0.4);
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

        {/* Background effect */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        {showInstallPrompt && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1001,
            animation: 'slideUp 0.5s ease-out'
          }}>
            <button
              onClick={handleInstallClick}
              style={{
                padding: '12px 20px',
                background: '#d4af37',
                border: 'none',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Download size={16} />
              Install App
            </button>
          </div>
        )}

        <div style={{
          maxWidth: '700px',
          width: '100%',
          animation: 'slideUp 0.6s ease-out',
          position: 'relative',
          zIndex: 1
        }}>
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
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6))',
              }}></div>
              <h1 style={{
                fontSize: '56px',
                fontWeight: '300',
                color: '#d4af37',
                margin: 0,
                letterSpacing: '10px',
                textTransform: 'uppercase',
                textShadow: `
                  0 0 10px rgba(212, 175, 55, 0.8),
                  0 0 20px rgba(212, 175, 55, 0.6),
                  0 0 30px rgba(212, 175, 55, 0.4),
                  0 0 40px rgba(212, 175, 55, 0.2)
                `,
                animation: 'glow 2s ease-in-out infinite alternate'
              }}>
                CHEF
              </h1>
              <div style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.6), transparent)',
              }}></div>
            </div>
            <p style={{
              color: 'rgba(212, 175, 55, 0.8)',
              fontSize: '13px',
              margin: 0,
              letterSpacing: '3px',
              fontWeight: '400',
              animation: 'fadeInText 1s ease-out 0.5s backwards'
            }}>
              Your Personal Culinary Assistant
            </p>
          </div>

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
              © 2026 <span style={{ color: '#d4af37', fontWeight: '500' }}>Monarch-Elite Holdings</span>. All Rights Reserved.
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
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1e1e1e 100%)',
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

        @keyframes fadeInText {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          from {
            text-shadow: 
              0 0 10px rgba(212, 175, 55, 0.8),
              0 0 20px rgba(212, 175, 55, 0.6),
              0 0 30px rgba(212, 175, 55, 0.4),
              0 0 40px rgba(212, 175, 55, 0.2);
          }
          to {
            text-shadow: 
              0 0 15px rgba(212, 175, 55, 1),
              0 0 30px rgba(212, 175, 55, 0.8),
              0 0 45px rgba(212, 175, 55, 0.6),
              0 0 60px rgba(212, 175, 55, 0.4);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
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

      {/* Background effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      {showInstallPrompt && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1001,
          animation: 'slideUp 0.5s ease-out'
        }}>
          <button
            onClick={handleInstallClick}
            style={{
              padding: '12px 20px',
              background: '#d4af37',
              border: 'none',
              borderRadius: '8px',
              color: '#000000',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Download size={16} />
            Install App
          </button>
        </div>
      )}

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header with Illuminated CHEF */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          animation: 'slideUp 0.6s ease-out',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
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
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6))',
            }}></div>
            <h1 style={{
              fontSize: '48px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: '300',
              color: '#d4af37',
              margin: 0,
              letterSpacing: '8px',
              textTransform: 'uppercase',
              textShadow: `
                0 0 10px rgba(212, 175, 55, 0.8),
                0 0 20px rgba(212, 175, 55, 0.6),
                0 0 30px rgba(212, 175, 55, 0.4),
                0 0 40px rgba(212, 175, 55, 0.2)
              `,
              animation: 'glow 2s ease-in-out infinite alternate'
            }}>
              CHEF
            </h1>
            <div style={{
              width: '50px',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.6), transparent)',
            }}></div>
          </div>
          <p style={{
            color: 'rgba(212, 175, 55, 0.8)',
            fontSize: '13px',
            margin: 0,
            letterSpacing: '3px',
            fontWeight: '400',
            animation: 'fadeInText 1s ease-out 0.5s backwards'
          }}>
            Your Personal Culinary Assistant
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'rgba(26, 26, 26, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.6s ease-out 0.2s backwards',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'rgba(212, 175, 55, 0.15)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🥘
            </div>
            <h2 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
              letterSpacing: '1px'
            }}>
              Available Ingredients
            </h2>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <button
              className="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                color: '#d4af37',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                letterSpacing: '0.5px',
                cursor: 'pointer'
              }}
            >
              <Camera size={18} />
              📷 Scan Ingredients
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
            gap: '12px',
            marginBottom: '24px'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Enter ingredient..."
              style={{
                flex: 1,
                padding: '16px 20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
                background: 'rgba(0,0,0,0.4)',
                color: '#ffffff',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                e.target.style.background = 'rgba(0,0,0,0.6)';
                e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'rgba(0,0,0,0.4)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              className="button"
              onClick={addIngredient}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #d4af37, #b8941f)',
                border: 'none',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'inherit',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
              }}
            >
              Add
            </button>
          </div>

          {ingredients.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '10px',
              marginBottom: '30px'
            }}>
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="ingredient-chip"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{getIngredientIcon(ingredient)}</span>
                  <span style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '14px',
                    fontWeight: '500',
                    flex: 1
                  }}>
                    {ingredient}
                  </span>
                  <X
                    size={14}
                    style={{ 
                      cursor: 'pointer', 
                      color: 'rgba(255,255,255,0.4)',
                      transition: 'color 0.2s'
                    }}
                    onClick={() => removeIngredient(index)}
                    onMouseOver={(e) => e.target.style.color = '#ff6b6b'}
                    onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}
                  />
                </div>
              ))}
            </div>
          )}

          {ingredients.length > 0 && (
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.5px'
                }}>
                  Number of Recipes
                </span>
                <span style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#d4af37'
                }}>
                  {recipeCount}
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                value={recipeCount}
                onChange={(e) => setRecipeCount(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  outline: 'none',
                  WebkitAppearance: 'none',
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
                padding: '20px',
                background: loading ? 'rgba(100,100,100,0.3)' : 'linear-gradient(135deg, #d4af37, #b8941f)',
                border: 'none',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '15px',
                fontWeight: '700',
                fontFamily: 'inherit',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(212, 175, 55, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {loading ? 'Processing...' : (
                <>
                  Generate Recipes
                  <span style={{
                    display: 'inline-block',
                    marginLeft: '8px',
                    animation: 'sparkle 1.5s ease-in-out infinite'
                  }}>✨</span>
                </>
              )}
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

        {/* Recipes Display with Photos */}
        {recipes.length > 0 && (
          <div style={{
            marginTop: '50px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#d4af37',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                margin: 0,
                textShadow: `
                  0 0 10px rgba(212, 175, 55, 0.6),
                  0 0 20px rgba(212, 175, 55, 0.4)
                `
              }}>
                Your Curated Recipes ({recipes.length})
              </h2>
            </div>
            
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="recipe-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: 'rgba(26, 26, 26, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth > 768 ? '200px 1fr' : '1fr',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <img 
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  style={{
                    width: window.innerWidth > 768 ? '200px' : '100%',
                    height: window.innerWidth > 768 ? '200px' : '180px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '500',
                      color: '#ffffff',
                      margin: 0,
                      letterSpacing: '1px',
                      flex: 1
                    }}>
                      {recipe.name}
                    </h3>
                    {recipe.creativityLevel && (
                      <span style={{
                        fontSize: '10px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        background: recipe.creativityLevel === 'gourmet' ? 'rgba(212, 175, 55, 0.2)' : 
                                    recipe.creativityLevel === 'creative' ? 'rgba(100, 150, 255, 0.2)' : 
                                    'rgba(100, 255, 150, 0.2)',
                        color: recipe.creativityLevel === 'gourmet' ? '#d4af37' : 
                               recipe.creativityLevel === 'creative' ? '#6496ff' : 
                               '#64ff96',
                        border: `1px solid ${recipe.creativityLevel === 'gourmet' ? 'rgba(212, 175, 55, 0.4)' : 
                                            recipe.creativityLevel === 'creative' ? 'rgba(100, 150, 255, 0.4)' : 
                                            'rgba(100, 255, 150, 0.4)'}`
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
                    lineHeight: '1.6',
                    marginBottom: '12px'
                  }}>
                    {recipe.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginTop: '8px'
                  }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      <Clock size={14} style={{ color: '#d4af37' }} />
                      {recipe.time}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'capitalize'
                    }}>
                      <TrendingUp size={14} style={{ color: '#d4af37' }} />
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
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
          © 2026 <span style={{ color: '#d4af37', fontWeight: '500' }}>Monarch-Elite Holdings</span>. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
