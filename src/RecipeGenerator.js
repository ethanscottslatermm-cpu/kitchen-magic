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
import { Camera, X, Download } from 'lucide-react';

export default function RecipeGenerator() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipes, setExpandedRecipes] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const fileInputRef = useRef(null);

  // Common ingredients for autocomplete
  const commonIngredients = [
    'chicken breast', 'chicken thighs', 'chicken wings', 'ground beef', 'pork chops',
    'salmon', 'shrimp', 'tilapia', 'eggs', 'rice', 'pasta', 'spaghetti', 'penne',
    'tomatoes', 'potatoes', 'onions', 'garlic', 'bell peppers', 'broccoli', 'carrots',
    'spinach', 'mushrooms', 'zucchini', 'cheese', 'mozzarella', 'cheddar', 'parmesan',
    'milk', 'butter', 'flour', 'bread', 'tortillas', 'beans', 'chickpeas', 'lentils',
    'corn', 'peas', 'green beans', 'lettuce', 'cucumber', 'avocado', 'lime', 'lemon'
  ];

  // Food category icons mapping
  const foodIcons = {
    'rice': '🍚', 'tomato': '🥫', 'egg': '🥚', 'chicken': '🍗', 'broccoli': '🥦',
    'pepper': '🌶️', 'pasta': '🍝', 'bread': '🍞', 'cheese': '🧀', 'milk': '🥛',
    'beef': '🥩', 'pork': '🥓', 'fish': '🐟', 'shrimp': '🍤', 'potato': '🥔',
    'carrot': '🥕', 'onion': '🧅', 'garlic': '🧄', 'lettuce': '🥬', 'mushroom': '🍄',
    'corn': '🌽', 'bean': '🫘', 'avocado': '🥑', 'lemon': '🍋', 'lime': '🍋',
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

  // Autocomplete handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length >= 2) {
      const filtered = commonIngredients.filter(item => 
        item.toLowerCase().includes(value.toLowerCase()) &&
        !ingredients.includes(item)
      ).slice(0, 5);
      setAutocompleteResults(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  };

  const selectAutocomplete = (item) => {
    setIngredients([...ingredients, item]);
    setInputValue('');
    setShowAutocomplete(false);
  };

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
      setShowAutocomplete(false);
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const toggleInstructions = (index) => {
    setExpandedRecipes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleImageCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result.split(',')[1];
      
      setLoading(true);
      try {
        const response = await fetch('/.netlify/functions/anthropic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: file.type, data: base64Image } },
                { type: 'text', text: 'List all the food ingredients you can see in this image. Return ONLY a JSON array of ingredient names, nothing else. Format: ["ingredient1", "ingredient2", ...]. Be specific and list individual items.' }
              ]
            }]
          })
        });

        const data = await response.json();
        const text = data.content[0].text.trim();
        const cleanText = text.replace(/```json|```/g, '').trim();
        const detectedIngredients = JSON.parse(cleanText);
        
        setIngredients([...ingredients, ...detectedIngredients]);
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
    setExpandedRecipes({});

    try {
      const response = await fetch('/.netlify/functions/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `I have these ingredients: ${ingredients.join(', ')}. 

You can also assume I have these common pantry items available: salt, pepper, olive oil, butter.

Suggest 3-4 simple to moderate difficulty recipes (NO fancy restaurant-style dishes - just home cooking). Mix it up with:
- Simple comfort food (easy everyday meals)
- Moderate difficulty dishes (still approachable for home cooks)
- International cuisine variations (but keep them simple)

For each recipe, provide:
1. Name
2. Brief description
3. Full list of ingredients needed
4. Cooking time
5. Difficulty level (easy or medium only)
6. Number of servings
7. Step-by-step instructions (5-7 steps)

CRITICAL: You MUST return ONLY valid JSON. No markdown, no backticks, no explanation text.

Return ONLY a JSON array with this exact format:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "ingredients": ["ingredient1", "ingredient2"],
    "time": "15 mins",
    "difficulty": "easy",
    "servings": "Serves 4",
    "instructions": ["Step 1 instruction", "Step 2 instruction", "Step 3 instruction"]
  }
]

Return 3-4 recipes maximum. Focus on simple, approachable home cooking. Return ONLY the JSON array, nothing else.`
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
        throw new Error('Could not parse recipe JSON. Please try again with different ingredients.');
      }
      
      if (!Array.isArray(generatedRecipes) || generatedRecipes.length === 0) {
        throw new Error('No recipes were generated. Please try again.');
      }
      
      // Limit to 3-4 recipes
      const limitedRecipes = generatedRecipes.slice(0, 4);
      setRecipes(limitedRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert(`Could not generate recipes: ${error.message}\n\nTry using different ingredients.`);
    }

    setLoading(false);
  };

  // Welcome Screen
  if (showWelcome) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        fontFamily: "'Open Sans', sans-serif",
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600&display=swap');
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes glow {
            from {
              filter: drop-shadow(0 0 20px rgba(248, 196, 113, 0.8)) 
                      drop-shadow(0 0 35px rgba(250, 177, 160, 0.6));
            }
            to {
              filter: drop-shadow(0 0 30px rgba(248, 196, 113, 1)) 
                      drop-shadow(0 0 50px rgba(250, 177, 160, 0.8));
            }
          }

          @keyframes buttonGlow {
            from {
              box-shadow: 0 8px 30px rgba(248, 196, 113, 0.5);
            }
            to {
              box-shadow: 0 12px 40px rgba(248, 196, 113, 0.7);
            }
          }

          .terms-content {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 10px;
          }

          .terms-content::-webkit-scrollbar { width: 6px; }
          .terms-content::-webkit-scrollbar-track { background: #374151; border-radius: 3px; }
          .terms-content::-webkit-scrollbar-thumb { background: #f8c471; border-radius: 3px; }
        `}</style>

        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(248, 196, 113, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(250, 177, 160, 0.06) 0%, transparent 40%)
          `,
          pointerEvents: 'none', zIndex: 0
        }}></div>

        {showInstallPrompt && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 1001, animation: 'slideUp 0.5s ease-out'
          }}>
            <button onClick={handleInstallClick} style={{
              padding: '12px 20px', background: 'linear-gradient(135deg, #f8c471, #fab1a0)',
              border: 'none', borderRadius: '8px', color: '#1a1a2e', fontSize: '12px',
              fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(248, 196, 113, 0.4)',
              display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
              <Download size={16} /> Install App
            </button>
          </div>
        )}

        <div style={{ maxWidth: '700px', width: '100%', animation: 'slideUp 0.6s ease-out', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{
              fontFamily: "'Montserrat', sans-serif", fontSize: '64px', fontWeight: '800',
              background: 'linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', letterSpacing: '4px', textTransform: 'uppercase',
              marginBottom: '12px', animation: 'glow 2.5s ease-in-out infinite alternate'
            }}>
              CHEF
            </h1>
            <p style={{
              color: '#94a3b8', fontSize: '16px', marginBottom: '40px',
              fontWeight: '500', letterSpacing: '1px'
            }}>
              Your Personal Kitchen Companion
            </p>
          </div>

          <div style={{
            background: '#1f2937', borderRadius: '16px', padding: '60px 50px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(248, 196, 113, 0.2)'
          }}>
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block', color: '#cbd5e1', fontSize: '14px',
                marginBottom: '10px', fontWeight: '600', letterSpacing: '0.5px'
              }}>
                What's your name?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                style={{
                  width: '100%', maxWidth: '400px', padding: '16px 20px',
                  border: '2px solid #374151', borderRadius: '10px', fontSize: '16px',
                  fontFamily: "'Open Sans', sans-serif", textAlign: 'center',
                  background: '#111827', color: '#e2e8f0', transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f8c471';
                  e.target.style.boxShadow = '0 0 0 4px rgba(248, 196, 113, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#374151';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{
              background: '#111827', border: '1px solid #374151',
              borderRadius: '12px', padding: '25px', marginBottom: '30px', textAlign: 'left'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '15px'
              }}>
                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif", fontSize: '13px',
                  fontWeight: '700', color: '#f8c471', margin: 0,
                  letterSpacing: '1px', textTransform: 'uppercase'
                }}>
                  Terms & Conditions
                </h3>
                <button
                  onClick={() => setShowTerms(!showTerms)}
                  style={{
                    background: 'transparent', border: 'none', color: '#fab1a0',
                    fontSize: '12px', cursor: 'pointer', textDecoration: 'underline',
                    fontWeight: '600', fontFamily: "'Open Sans', sans-serif"
                  }}
                >
                  {showTerms ? 'Hide' : 'Read Full Terms'}
                </button>
              </div>

              {showTerms ? (
                <div className="terms-content" style={{
                  color: '#94a3b8', fontSize: '12px', lineHeight: '1.7', fontWeight: '300'
                }}>
                  <p style={{ marginTop: '10px', marginBottom: '10px' }}><strong>Last Updated:</strong> January 2026</p>
                  
                  <p style={{ marginBottom: '15px' }}>
                    By accessing and using this Executive Recipe Generator ("Service"), you agree to be bound by these Terms and Conditions.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>1. Acceptance of Terms</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    By using this Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>2. Service Description</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    The Service provides AI-powered recipe suggestions based on user-provided ingredients. Recipes are generated for informational purposes only.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>3. User Responsibilities</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    You are responsible for verifying the accuracy and safety of all recipes. Users should exercise proper food safety practices.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>4. Intellectual Property</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    All content, design, and functionality of the Service are owned by Monarch-Elite Holdings and protected by intellectual property laws.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>5. Limitation of Liability</strong></p>
                  <p style={{ marginBottom: '15px' }}>
                    Monarch-Elite Holdings shall not be liable for any damages arising from use of the Service.
                  </p>

                  <p style={{ marginTop: '15px', marginBottom: '8px' }}><strong>6. Contact</strong></p>
                  <p style={{ marginBottom: '5px' }}>
                    For questions regarding these Terms, please contact: legal@monarch-elite.com
                  </p>
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  By proceeding, you agree to our Terms and Conditions. This Service provides AI-generated 
                  recipe suggestions based on your ingredients. You are responsible for verifying recipe 
                  safety and accuracy.
                </p>
              )}
            </div>

            <button
              onClick={() => userName.trim() && setShowWelcome(false)}
              style={{
                padding: '18px 45px',
                background: 'linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43)',
                border: 'none', borderRadius: '10px', color: '#1a1a2e',
                fontSize: '16px', fontWeight: '700', cursor: userName.trim() ? 'pointer' : 'not-allowed',
                boxShadow: '0 8px 30px rgba(248, 196, 113, 0.5)',
                textTransform: 'uppercase', letterSpacing: '1px',
                fontFamily: "'Montserrat', sans-serif", transition: 'all 0.3s',
                animation: 'buttonGlow 2.5s ease-in-out infinite alternate',
                opacity: userName.trim() ? 1 : 0.5
              }}
              onMouseOver={(e) => userName.trim() && (e.target.style.transform = 'translateY(-3px)')}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ✨ Let's Cook ✨
            </button>

            <div style={{ marginTop: '25px', color: '#64748b', fontSize: '11px', textAlign: 'center' }}>
              © 2026 <span style={{ color: '#f8c471', fontWeight: '700' }}>Monarch-Elite Holdings</span>. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontFamily: "'Open Sans', sans-serif",
      padding: '40px 20px',
      animation: 'fadeIn 0.6s ease-out',
      position: 'relative',
      color: '#e2e8f0'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glow {
          from {
            filter: drop-shadow(0 0 20px rgba(248, 196, 113, 0.8)) 
                    drop-shadow(0 0 35px rgba(250, 177, 160, 0.6));
          }
          to {
            filter: drop-shadow(0 0 30px rgba(248, 196, 113, 1)) 
                    drop-shadow(0 0 50px rgba(250, 177, 160, 0.8));
          }
        }

        @keyframes loadingPulse {
          0%, 100% { 
            opacity: 0.9; 
            transform: scale(1);
            box-shadow: 0 10px 40px rgba(248, 196, 113, 0.3);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.08);
            box-shadow: 0 15px 50px rgba(248, 196, 113, 0.5);
          }
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          45% { opacity: 1; transform: translateY(0); }
          55% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        @keyframes buttonGlow {
          from { box-shadow: 0 8px 30px rgba(248, 196, 113, 0.5); }
          to { box-shadow: 0 12px 40px rgba(248, 196, 113, 0.7); }
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
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
          border-color: rgba(248, 196, 113, 0.4);
        }
      `}</style>

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(248, 196, 113, 0.06) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(250, 177, 160, 0.06) 0%, transparent 40%)
        `,
        pointerEvents: 'none', zIndex: 0
      }}></div>

      {showInstallPrompt && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 1001, animation: 'slideUp 0.5s ease-out'
        }}>
          <button onClick={handleInstallClick} style={{
            padding: '12px 20px', background: 'linear-gradient(135deg, #f8c471, #fab1a0)',
            border: 'none', borderRadius: '8px', color: '#1a1a2e', fontSize: '12px',
            fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(248, 196, 113, 0.4)',
            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <Download size={16} /> Install App
          </button>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: '28px',
            color: '#cbd5e1', marginBottom: '8px', fontWeight: '600'
          }}>
            Welcome back, <span style={{
              background: 'linear-gradient(135deg, #f8c471, #fab1a0)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', fontWeight: '800'
            }}>{userName || 'Chef'}</span>! 👋🏽
          </h2>
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: '48px', fontWeight: '800',
            background: 'linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: '8px', letterSpacing: '3px',
            animation: 'glow 2.5s ease-in-out infinite alternate'
          }}>
            CHEF
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: '500' }}>
            Let's create something amazing today
          </p>
        </div>

        {/* Ingredient Input Section */}
        <div style={{
          background: '#1f2937', borderRadius: '16px', padding: '40px',
          marginBottom: '30px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(248, 196, 113, 0.2)'
        }}>
          <h3 style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: '18px',
            fontWeight: '700', color: '#cbd5e1', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span>🥘</span> What ingredients do you have?
          </h3>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1, padding: '16px',
                background: 'linear-gradient(135deg, rgba(248, 196, 113, 0.15), rgba(250, 177, 160, 0.1))',
                border: '1px solid rgba(248, 196, 113, 0.3)',
                borderRadius: '12px', color: '#f8c471', fontSize: '14px',
                fontWeight: '500', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', letterSpacing: '0.5px', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(248, 196, 113, 0.25), rgba(250, 177, 160, 0.15))';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(248, 196, 113, 0.15), rgba(250, 177, 160, 0.1))';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Camera size={18} /> 📷 Scan Ingredients
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

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', position: 'relative' }}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Start typing an ingredient..."
              style={{
                flex: 1, padding: '14px 20px', border: '2px solid #374151',
                borderRadius: '10px', fontSize: '15px', transition: 'all 0.3s',
                background: '#111827', color: '#e2e8f0',
                fontFamily: "'Open Sans', sans-serif", outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f8c471';
                e.target.style.boxShadow = '0 0 0 4px rgba(248, 196, 113, 0.2)';
              }}
              onBlur={(e) => {
                setTimeout(() => setShowAutocomplete(false), 200);
                e.target.style.borderColor = '#374151';
                e.target.style.boxShadow = 'none';
              }}
            />
            
            {showAutocomplete && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: '130px',
                background: '#1f2937', border: '2px solid #374151',
                borderTop: 'none', borderRadius: '0 0 10px 10px',
                maxHeight: '200px', overflowY: 'auto', zIndex: 10,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}>
                {autocompleteResults.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => selectAutocomplete(item)}
                    style={{
                      padding: '12px 20px', cursor: 'pointer',
                      color: '#cbd5e1', transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#111827';
                      e.target.style.color = '#f8c471';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#cbd5e1';
                    }}
                  >
                    {getIngredientIcon(item)} {item}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={addIngredient}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #f8c471, #fab1a0)',
                border: 'none', borderRadius: '10px', color: '#1a1a2e',
                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(248, 196, 113, 0.4)',
                fontFamily: "'Montserrat', sans-serif", transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(248, 196, 113, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(248, 196, 113, 0.4)';
              }}
            >
              Add
            </button>
          </div>

          {ingredients.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '10px', marginBottom: '25px'
            }}>
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="ingredient-chip"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    background: '#111827', border: '2px solid #374151',
                    padding: '12px 16px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#f8c471';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(248, 196, 113, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#374151';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{getIngredientIcon(ingredient)}</span>
                  <span style={{
                    flex: 1, color: '#cbd5e1',
                    fontWeight: '600', fontSize: '14px'
                  }}>
                    {ingredient}
                  </span>
                  <X
                    size={14}
                    style={{ cursor: 'pointer', color: '#ef4444', transition: 'color 0.2s' }}
                    onClick={() => removeIngredient(index)}
                    onMouseOver={(e) => e.target.style.color = '#dc2626'}
                    onMouseOut={(e) => e.target.style.color = '#ef4444'}
                  />
                </div>
              ))}
            </div>
          )}

          {ingredients.length > 0 && (
            <button
              onClick={generateRecipes}
              disabled={loading}
              style={{
                width: '100%', padding: '20px',
                background: loading ? 'rgba(100,100,100,0.3)' : 'linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43)',
                border: 'none', borderRadius: '10px', color: '#1a1a2e',
                fontSize: '17px', fontWeight: '700', letterSpacing: '1px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 30px rgba(248, 196, 113, 0.5)',
                textTransform: 'uppercase',
                fontFamily: "'Montserrat', sans-serif",
                transition: 'all 0.3s',
                animation: loading ? 'none' : 'buttonGlow 2.5s ease-in-out infinite alternate'
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-3px)')}
              onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? 'Processing...' : "✨ Let's Cook ✨"}
            </button>
          )}
        </div>

        {/* Loading State with NEW GIF */}
        {loading && (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: '#1f2937', borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(248, 196, 113, 0.2)'
          }}>
            <img 
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3M3c2NwYXJ3cGl2NzF3bTE3a3BpMXZjeW1uemV6Nmk2MW1rYjBmbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LgWKJCkGlCgES5Rm28/giphy.gif"
              alt="Cooking"
              style={{
                width: '240px', height: '240px', borderRadius: '50%',
                border: '4px solid #374151', marginBottom: '40px',
                animation: 'loadingPulse 2s ease-in-out infinite',
                boxShadow: '0 10px 40px rgba(248, 196, 113, 0.3)'
              }}
            />
            
            <div style={{ position: 'relative', height: '100px' }}>
              <div style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: '28px', fontWeight: '700',
                background: 'linear-gradient(135deg, #f8c471, #fab1a0)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', marginBottom: '15px',
                position: 'absolute', width: '100%', left: 0, opacity: 0,
                animation: 'fadeInOut 4s ease-in-out infinite'
              }}>
                ✨ Hang tight ✨
              </div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: '28px', fontWeight: '700',
                background: 'linear-gradient(135deg, #f8c471, #fab1a0)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', marginBottom: '15px',
                position: 'absolute', width: '100%', left: 0, opacity: 0,
                animation: 'fadeInOut 4s ease-in-out 2s infinite'
              }}>
                🍳 Deliciousness is on the way! 🍳
              </div>
            </div>
          </div>
        )}

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <div style={{ marginTop: '50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: '18px',
                fontWeight: '700', color: '#f8c471', letterSpacing: '2px',
                textTransform: 'uppercase', margin: 0
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
                  background: '#1f2937', borderRadius: '16px',
                  padding: '35px', marginBottom: '25px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(248, 196, 113, 0.2)'
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontFamily: "'Montserrat', sans-serif", fontSize: '28px',
                    fontWeight: '700', color: '#e2e8f0', margin: 0, flex: 1
                  }}>
                    {recipe.name}
                  </h3>
                  <span style={{
                    padding: '6px 14px', borderRadius: '20px',
                    fontSize: '11px', fontWeight: '700',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    fontFamily: "'Montserrat', sans-serif",
                    background: recipe.difficulty === 'easy' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 196, 113, 0.2)',
                    color: recipe.difficulty === 'easy' ? '#4ade80' : '#f8c471',
                    border: recipe.difficulty === 'easy' ? '2px solid rgba(74, 222, 128, 0.4)' : '2px solid rgba(248, 196, 113, 0.4)'
                  }}>
                    {recipe.difficulty === 'easy' ? 'Simple' : 'Moderate'}
                  </span>
                </div>
                
                <p style={{
                  color: '#94a3b8', fontSize: '15px',
                  lineHeight: '1.7', marginBottom: '20px'
                }}>
                  {recipe.description}
                </p>

                <div style={{
                  display: 'flex', gap: '20px', marginBottom: '25px',
                  paddingBottom: '20px', borderBottom: '2px solid #374151'
                }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#94a3b8', fontSize: '14px', fontWeight: '600'
                  }}>
                    <span style={{ color: '#f8c471', fontSize: '16px' }}>⏱️</span>
                    {recipe.time}
                  </span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#94a3b8', fontSize: '14px', fontWeight: '600'
                  }}>
                    <span style={{ color: '#f8c471', fontSize: '16px' }}>📊</span>
                    {recipe.difficulty === 'easy' ? 'Easy' : 'Medium'}
                  </span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#94a3b8', fontSize: '14px', fontWeight: '600'
                  }}>
                    <span style={{ color: '#f8c471', fontSize: '16px' }}>🍽️</span>
                    {recipe.servings}
                  </span>
                </div>

                <button
                  onClick={() => toggleInstructions(index)}
                  style={{
                    width: '100%', padding: '16px 22px',
                    background: '#111827', border: '2px solid #374151',
                    borderRadius: '10px', color: '#cbd5e1',
                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: "'Montserrat', sans-serif",
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#f8c471';
                    e.currentTarget.style.background = '#1f2937';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(248, 196, 113, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#374151';
                    e.currentTarget.style.background = '#111827';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>📖 {expandedRecipes[index] ? 'Hide' : 'View'} Cooking Instructions</span>
                  <span>{expandedRecipes[index] ? '▲' : '▼'}</span>
                </button>

                {expandedRecipes[index] && (
                  <div style={{
                    marginTop: '15px', padding: '25px',
                    background: '#111827', borderRadius: '10px',
                    border: '2px solid #374151'
                  }}>
                    <ol style={{
                      listStyle: 'none', counterReset: 'step-counter',
                      margin: 0, padding: 0
                    }}>
                      {recipe.instructions && recipe.instructions.map((instruction, i) => (
                        <li
                          key={i}
                          style={{
                            counterIncrement: 'step-counter',
                            marginBottom: '18px', paddingLeft: '45px',
                            position: 'relative', color: '#cbd5e1',
                            lineHeight: '1.7', fontSize: '15px'
                          }}
                        >
                          <div style={{
                            content: 'counter(step-counter)',
                            position: 'absolute', left: 0, top: 0,
                            width: '32px', height: '32px',
                            background: 'linear-gradient(135deg, #f8c471, #fab1a0)',
                            color: '#1a1a2e', borderRadius: '50%',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontWeight: '700',
                            fontSize: '14px',
                            boxShadow: '0 4px 12px rgba(248, 196, 113, 0.4)'
                          }}>
                            {i + 1}
                          </div>
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

        {/* Footer */}
        <div style={{
          textAlign: 'center', padding: '25px',
          color: '#64748b', fontSize: '12px'
        }}>
          © 2026 <span style={{ color: '#f8c471', fontWeight: '700' }}>Monarch-Elite Holdings</span>. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
