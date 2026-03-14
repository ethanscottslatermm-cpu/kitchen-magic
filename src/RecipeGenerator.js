/**
 * Copyright (c) 2026 Monarch-Elite Holdings
 * All Rights Reserved
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Download } from 'lucide-react';

// ─── Logo SVG ────────────────────────────────────────────────────────────────
const CHEF_IMG = "/chef-logo.png";

const LetsEatLogo = ({ size = 250 }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }}>
    <img
      src={CHEF_IMG}
      alt="Itadakimasu - Let's Eat Chef Logo"
      style={{
        maxWidth: size,
        width: '100%',
        height: 'auto',
        opacity: 1,
        transition: 'opacity 0.3s ease',
        filter: 'drop-shadow(0 0 18px rgba(243,146,0,0.55)) drop-shadow(0 0 6px rgba(160,69,31,0.35))',
      }}
    />
  </div>
);



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

  const commonIngredients = [
    'chicken breast', 'chicken thighs', 'chicken wings', 'ground beef', 'pork chops',
    'salmon', 'shrimp', 'tilapia', 'eggs', 'rice', 'pasta', 'spaghetti', 'penne',
    'tomatoes', 'potatoes', 'onions', 'garlic', 'bell peppers', 'broccoli', 'carrots',
    'spinach', 'mushrooms', 'zucchini', 'cheese', 'mozzarella', 'cheddar', 'parmesan',
    'milk', 'butter', 'flour', 'bread', 'tortillas', 'beans', 'chickpeas', 'lentils',
    'corn', 'peas', 'green beans', 'lettuce', 'cucumber', 'avocado', 'lime', 'lemon'
  ];

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
    if (outcome === 'accepted') {}  // install accepted
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length >= 2) {
      const filtered = commonIngredients.filter(item =>
        item.toLowerCase().includes(value.toLowerCase()) && !ingredients.includes(item)
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
    setExpandedRecipes(prev => ({ ...prev, [index]: !prev[index] }));
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
        if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        const text = data.content[0].text.trim();
        const cleanText = text.replace(/```json|```/g, '').trim();
        const detectedIngredients = JSON.parse(cleanText);
        setIngredients([...ingredients, ...detectedIngredients]);
      } catch (error) {
        console.error('Error detecting ingredients:', error);
        alert('Could not detect ingredients. Please try again or add them manually.');
      } finally {
        setLoading(false);
      }
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
2. Brief description (keep it simple, avoid apostrophes and special characters)
3. Full list of ingredients needed
4. Cooking time
5. Difficulty level (easy or medium only)
6. Number of servings
7. Step-by-step instructions (5-7 steps, keep each step clear and simple)

CRITICAL JSON REQUIREMENTS:
- Return ONLY a valid JSON array
- NO markdown, NO backticks, NO explanation text before or after
- Use double quotes for all strings
- Escape any quotes inside strings with backslash
- No trailing commas
- Ensure all brackets and braces are properly closed

Return ONLY a JSON array with this exact format:
[
  {
    "name": "Recipe Name",
    "description": "Brief description without special characters",
    "ingredients": ["ingredient1", "ingredient2"],
    "time": "15 mins",
    "difficulty": "easy",
    "servings": "Serves 4",
    "instructions": ["Step 1", "Step 2", "Step 3"]
  }
]

Return 3-4 recipes maximum. Focus on simple, approachable home cooking. Return ONLY the JSON array with no other text.`
          }]
        })
      });
      if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      let text = data.content[0].text.trim();
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      const firstBracket = text.indexOf('[');
      const lastBracket = text.lastIndexOf(']');
      if (firstBracket === -1 || lastBracket === -1) throw new Error('Invalid JSON response - no array found. Please try again.');
      text = text.substring(firstBracket, lastBracket + 1);
      text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      text = text.replace(/,(\s*[}\]])/g, '$1');
      let generatedRecipes;
      try {
        generatedRecipes = JSON.parse(text);
      } catch (parseError) {
        try {
          const fixedText = text.replace(/\\"|"/g, (m) => m === '\\"' ? '\\"' : '"');
          generatedRecipes = JSON.parse(fixedText);
        } catch (secondError) {
          throw new Error('Could not parse recipe JSON. Please try with fewer or different ingredients.');
        }
      }
      if (!Array.isArray(generatedRecipes) || generatedRecipes.length === 0) throw new Error('No recipes were generated. Please try again.');
      setRecipes(generatedRecipes.slice(0, 4));
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert(`Could not generate recipes: ${error.message}\n\nTry using different ingredients.`);
    } finally {
      setLoading(false);
    }
  };

  // ─── SHARED STYLES ──────────────────────────────────────────────────────────
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Nunito:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --brown-dark:   #5D2A18;
      --brown-mid:    #7A3520;
      --brown-warm:   #A0451F;
      --amber:        #F39200;
      --amber-light:  #FFAD33;
      --cream:        #FFF8EE;
      --cream-dark:   #F5EDD8;
      --white:        #FFFFFF;
      --text-dark:    #3B1A08;
      --text-mid:     #6B3018;
      --text-light:   #9A6040;
      --border:       rgba(93, 42, 24, 0.2);
      --shadow-warm:  rgba(93, 42, 24, 0.15);
    }

    body { font-family: 'Nunito', sans-serif; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes pulse-amber {
      0%, 100% { box-shadow: 0 0 0 0 rgba(243, 146, 0, 0.4); }
      50%       { box-shadow: 0 0 0 12px rgba(243, 146, 0, 0); }
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    @keyframes cookBounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-8px); }
    }

    .page-enter { animation: fadeIn 0.5s ease-out forwards; }
    .card-enter { animation: fadeUp 0.5s ease-out backwards; }

    .ingredient-chip {
      animation: fadeUp 0.3s ease-out backwards;
      transition: all 0.2s ease;
    }
    .ingredient-chip:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px var(--shadow-warm);
    }

    .recipe-card {
      animation: fadeUp 0.5s ease-out backwards;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .recipe-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 24px 60px var(--shadow-warm);
    }

    input:focus { outline: none; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream-dark); border-radius: 3px; }
    ::-webkit-scrollbar-thumb { background: var(--brown-warm); border-radius: 3px; }

    @media (max-width: 600px) {
      .main-grid { grid-template-columns: 1fr !important; }
      .recipe-meta { flex-wrap: wrap; }
    }
  `;

  // ─── PAGE 1 — WELCOME ───────────────────────────────────────────────────────
  if (showWelcome) {
    return (
      <div className="page-enter" style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #FFF8EE 0%, #F5EDD8 60%, #FFDBA4 100%)',
        fontFamily: "'Nunito', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative', overflow: 'hidden'
      }}>
        <style>{globalStyles}</style>

        {/* Decorative background blobs */}
        <div style={{
          position: 'fixed', top: '-120px', right: '-120px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(243,146,0,0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'fixed', bottom: '-100px', left: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,134,42,0.14) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Install prompt */}
        {showInstallPrompt && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1001 }}>
            <button onClick={handleInstallClick} style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, var(--amber), var(--brown-warm))',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
              boxShadow: '0 4px 14px rgba(243,146,0,0.4)', fontFamily: 'Nunito, sans-serif'
            }}>
              <Download size={14} /> Install App
            </button>
          </div>
        )}

        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', animation: 'fadeUp 0.7s ease-out' }}>
            <LetsEatLogo size={360} />
          </div>

          {/* Card */}
          <div className="card-enter" style={{
            background: 'transparent',
            borderRadius: '24px',
            padding: '44px 40px',
            animationDelay: '0.15s'
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '22px', fontWeight: '700',
              color: 'var(--brown-dark)', marginBottom: '6px', letterSpacing: '0.3px'
            }}>
              Welcome, Chef!
            </h2>
            <p style={{
              color: 'var(--text-light)', fontSize: '14px',
              marginBottom: '28px', fontWeight: '500'
            }}>
              Tell us your name to get started
            </p>

            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && userName.trim() && setShowWelcome(false)}
              placeholder="Your name..."
              style={{
                width: '100%', padding: '14px 18px',
                border: '2px solid rgba(243,146,0,0.4)',
                borderRadius: '12px', fontSize: '15px',
                fontFamily: "'Nunito', sans-serif",
                textAlign: 'center', background: 'var(--cream)',
                color: 'var(--text-dark)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                marginBottom: '24px',
                boxShadow: '0 0 0 3px rgba(243,146,0,0.12), 0 0 18px rgba(243,146,0,0.18)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--amber)';
                e.target.style.boxShadow = '0 0 0 4px rgba(243,146,0,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Terms */}
            <div style={{
              background: 'var(--cream)', borderRadius: '12px',
              padding: '18px 20px', marginBottom: '24px',
              border: '1px solid rgba(243,146,0,0.35)', textAlign: 'left',
              boxShadow: '0 0 0 3px rgba(243,146,0,0.10), 0 0 18px rgba(243,146,0,0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '12px', fontWeight: '800', color: 'var(--brown-mid)',
                  textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                  Terms & Conditions
                </span>
                <button onClick={() => setShowTerms(!showTerms)} style={{
                  background: 'none', border: 'none', fontSize: '12px',
                  color: 'var(--brown-warm)', cursor: 'pointer', fontWeight: '700',
                  textDecoration: 'underline', fontFamily: 'Nunito, sans-serif'
                }}>
                  {showTerms ? 'Hide' : 'Read'}
                </button>
              </div>

              {showTerms ? (
                <div style={{
                  maxHeight: '220px', overflowY: 'auto',
                  color: 'var(--text-light)', fontSize: '12px', lineHeight: '1.7'
                }}>
                  <p><strong>Last Updated:</strong> January 2026</p>
                  <p style={{ marginTop: '10px' }}>By accessing and using this Recipe Generator ("Service"), you agree to be bound by these Terms and Conditions.</p>
                  <p style={{ marginTop: '10px' }}><strong>1. Acceptance of Terms</strong><br />By using this Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
                  <p style={{ marginTop: '10px' }}><strong>2. Service Description</strong><br />The Service provides AI-powered recipe suggestions based on user-provided ingredients. Recipes are generated for informational purposes only.</p>
                  <p style={{ marginTop: '10px' }}><strong>3. User Responsibilities</strong><br />You are responsible for verifying the accuracy and safety of all recipes. Users should exercise proper food safety practices.</p>
                  <p style={{ marginTop: '10px' }}><strong>4. Intellectual Property</strong><br />All content, design, and functionality are owned by Monarch-Elite Holdings and protected by intellectual property laws.</p>
                  <p style={{ marginTop: '10px' }}><strong>5. Limitation of Liability</strong><br />Monarch-Elite Holdings shall not be liable for any damages arising from use of the Service.</p>
                  <p style={{ marginTop: '10px' }}><strong>6. Contact:</strong> legal@monarch-elite.com</p>
                </div>
              ) : (
                <p style={{ color: 'var(--text-light)', fontSize: '12.5px', lineHeight: '1.6' }}>
                  By proceeding, you agree to our Terms and Conditions. This Service provides AI-generated recipe suggestions. You are responsible for verifying recipe safety and accuracy.
                </p>
              )}
            </div>

            <button
              onClick={() => userName.trim() && setShowWelcome(false)}
              disabled={!userName.trim()}
              style={{
                width: '100%', padding: '16px',
                background: userName.trim()
                  ? 'linear-gradient(135deg, #F39200 0%, #A0451F 100%)'
                  : '#D1C4B0',
                border: 'none', borderRadius: '12px',
                color: 'white', fontSize: '15px',
                fontWeight: '800', letterSpacing: '1px',
                textTransform: 'uppercase',
                fontFamily: "'Nunito', sans-serif",
                cursor: userName.trim() ? 'pointer' : 'not-allowed',
                boxShadow: userName.trim() ? '0 8px 24px rgba(243,146,0,0.55), 0 0 30px rgba(243,146,0,0.3), inset 0 0 12px rgba(255,255,255,0.12)' : 'none',
                transition: 'all 0.25s ease',
                animation: userName.trim() ? 'pulse-amber 2.5s infinite' : 'none'
              }}
              onMouseOver={(e) => userName.trim() && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Let's Cook! 🍳
            </button>
          </div>

          <p style={{
            marginTop: '24px', color: 'var(--text-light)',
            fontSize: '12px', fontWeight: '500'
          }}>
            © 2026 <strong style={{ color: 'var(--brown-warm)' }}>Monarch-Elite Holdings</strong>. All Rights Reserved.
          </p>
        </div>
      </div>
    );
  }

  // ─── PAGE 2 — MAIN APP ──────────────────────────────────────────────────────
  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #FFF8EE 0%, #F5EDD8 60%, #FFDBA4 100%)',
      fontFamily: "'Nunito', sans-serif",
      padding: '32px 20px',
      position: 'relative', overflow: 'hidden',
      color: 'var(--text-dark)'
    }}>
      <style>{globalStyles}</style>

      {/* Background blobs */}
      <div style={{
        position: 'fixed', top: '-100px', right: '-100px',
        width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(243,146,0,0.16) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-80px', left: '-60px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,134,42,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Install prompt */}
      {showInstallPrompt && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1001 }}>
          <button onClick={handleInstallClick} style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, var(--amber), var(--brown-warm))',
            border: 'none', borderRadius: '8px', color: 'white',
            fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px',
            boxShadow: '0 4px 14px rgba(243,146,0,0.4)', fontFamily: 'Nunito, sans-serif'
          }}>
            <Download size={14} /> Install App
          </button>
        </div>
      )}

      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Return Home button */}
        <div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 10 }}>
          <button
            onClick={() => setShowWelcome(true)}
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '1.5px solid var(--border)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: 'var(--brown-dark)',
              fontSize: '13px',
              fontWeight: '700',
              fontFamily: "'Nunito', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 2px 10px rgba(93,42,24,0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            ← Home
          </button>
        </div>

        {/* Header: Logo centered */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', animation: 'fadeUp 0.6s ease-out' }}>
            <LetsEatLogo size={320} />
          </div>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            color: 'var(--text-mid)', fontSize: '15px',
            fontWeight: '600', letterSpacing: '0.3px'
          }}>
            Welcome back, <strong style={{ color: 'var(--brown-warm)' }}>{userName || 'Chef'}</strong>! What are we cooking today?
          </p>
        </div>

        {/* Ingredient Input Section */}
        <div className="card-enter" style={{
          background: 'transparent',
          borderRadius: '20px', padding: '36px',
          marginBottom: '28px',
          animationDelay: '0.1s'
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '19px', fontWeight: '700',
            color: 'var(--brown-dark)', marginBottom: '22px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '22px' }}>🥘</span> What ingredients do you have?
          </h3>

          {/* Scan button */}
          <div style={{ marginBottom: '18px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, rgba(243,146,0,0.12), rgba(200,134,42,0.08))',
                border: '1.5px dashed var(--brown-warm)',
                borderRadius: '12px', color: 'var(--brown-mid)',
                fontSize: '14px', fontWeight: '700',
                fontFamily: "'Nunito', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(243,146,0,0.22), rgba(200,134,42,0.15))';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(243,146,0,0.12), rgba(200,134,42,0.08))';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Camera size={18} /> 📷 Scan Ingredients from Photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
              onChange={handleImageCapture} style={{ display: 'none' }} />
          </div>

          {/* Text input + Add */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', position: 'relative' }}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Start typing an ingredient..."
              style={{
                flex: 1, padding: '13px 18px',
                border: '2px solid var(--border)', borderRadius: '10px',
                fontSize: '14px', fontFamily: "'Nunito', sans-serif",
                background: 'var(--cream)', color: 'var(--text-dark)',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--amber)';
                e.target.style.boxShadow = '0 0 0 3px rgba(243,146,0,0.15)';
              }}
              onBlur={(e) => {
                setTimeout(() => setShowAutocomplete(false), 200);
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />

            {showAutocomplete && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: '110px',
                background: 'white', border: '2px solid var(--border)',
                borderTop: 'none', borderRadius: '0 0 10px 10px',
                maxHeight: '200px', overflowY: 'auto', zIndex: 20,
                boxShadow: '0 12px 30px rgba(93,42,24,0.12)'
              }}>
                {autocompleteResults.map((item) => (
                  <div key={item} onClick={() => selectAutocomplete(item)} style={{
                    padding: '11px 18px', cursor: 'pointer',
                    color: 'var(--text-mid)', fontSize: '14px',
                    fontWeight: '500', transition: 'background 0.15s'
                  }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--cream)'; e.currentTarget.style.color = '#5D3A1A'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-mid)'; }}>
                    {getIngredientIcon(item)} {item}
                  </div>
                ))}
              </div>
            )}

            <button onClick={addIngredient} style={{
              padding: '13px 22px',
              background: 'linear-gradient(135deg, #F39200, #A0451F)',
              border: 'none', borderRadius: '10px',
              color: 'white', fontSize: '14px', fontWeight: '800',
              fontFamily: "'Nunito', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(243,146,0,0.4)',
              transition: 'all 0.2s ease'
            }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(243,146,0,0.55)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(243,146,0,0.4)'; }}>
              Add
            </button>
          </div>

          {/* Ingredient chips */}
          {ingredients.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
              gap: '10px', marginBottom: '22px'
            }}>
              {ingredients.map((ingredient, index) => (
                <div key={ingredient} className="ingredient-chip" style={{
                  animationDelay: `${index * 0.04}s`,
                  background: 'var(--cream)', border: '1.5px solid var(--border)',
                  borderRadius: '10px', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 2px 8px rgba(93,42,24,0.06)'
                }}>
                  <span style={{ flex: 1, color: 'var(--text-dark)', fontWeight: '600', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ingredient}
                  </span>
                  <X size={13} style={{ cursor: 'pointer', color: '#E05555', flexShrink: 0 }}
                    onClick={() => removeIngredient(index)} />
                </div>
              ))}
            </div>
          )}

          {/* Generate button */}
          {ingredients.length > 0 && (
            <button onClick={generateRecipes} disabled={loading} style={{
              width: '100%', padding: '18px',
              background: loading
                ? 'linear-gradient(135deg, #D1C4B0, #B8A89A)'
                : 'linear-gradient(135deg, #F39200 0%, #A0451F 100%)',
              border: 'none', borderRadius: '12px',
              color: 'white', fontSize: '16px',
              fontWeight: '800', letterSpacing: '0.5px',
              fontFamily: "'Nunito', sans-serif",
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 28px rgba(243,146,0,0.45)',
              transition: 'all 0.25s ease',
              animation: loading ? 'none' : 'pulse-amber 2.5s infinite'
            }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}>
              {loading ? '⏳  Generating Recipes...' : '✨  Generate Recipes'}
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'transparent',
            borderRadius: '20px'
          }}>
            <div style={{ marginBottom: '24px', animation: 'cookBounce 1.2s ease-in-out infinite' }}>
              <LetsEatLogo size={220} />
            </div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '22px', fontWeight: '700',
              color: 'var(--brown-dark)', marginBottom: '8px'
            }}>Cooking up something delicious...</p>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', fontWeight: '500' }}>
              Hang tight while we find the perfect recipes for you 🍳
            </p>
          </div>
        )}

        {/* Recipes */}
        {recipes.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '26px', fontWeight: '700',
              color: 'var(--brown-dark)', textAlign: 'center',
              marginBottom: '24px'
            }}>
              Your Curated Recipes
              <span style={{
                marginLeft: '12px', fontSize: '14px',
                fontFamily: "'Nunito', sans-serif", fontWeight: '700',
                background: 'linear-gradient(135deg, #F39200, #A0451F)',
                color: 'white', padding: '3px 12px', borderRadius: '20px', verticalAlign: 'middle'
              }}>
                {recipes.length} found
              </span>
            </h2>

            {recipes.map((recipe, index) => (
              <div key={recipe.name} className="recipe-card" style={{
                animationDelay: `${index * 0.1}s`,
                background: 'transparent',
                borderRadius: '20px', padding: '32px',
                marginBottom: '22px'
              }}>
                {/* Recipe header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '28px', fontWeight: '700',
                    color: 'var(--brown-dark)', flex: 1,
                    lineHeight: '1.2'
                  }}>
                    {recipe.name}
                  </h3>
                  <span style={{
                    flexShrink: 0, padding: '5px 14px', borderRadius: '20px',
                    fontSize: '11px', fontWeight: '800',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    fontFamily: "'Nunito', sans-serif",
                    background: recipe.difficulty === 'easy'
                      ? 'rgba(74, 200, 128, 0.15)'
                      : 'rgba(243, 146, 0, 0.15)',
                    color: recipe.difficulty === 'easy' ? '#27AE60' : '#A0451F',
                    border: recipe.difficulty === 'easy'
                      ? '1.5px solid rgba(74,200,128,0.4)'
                      : '1.5px solid rgba(243,146,0,0.4)'
                  }}>
                    {recipe.difficulty === 'easy' ? 'Easy' : 'Moderate'}
                  </span>
                </div>

                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
                  {recipe.description}
                </p>

                {/* Meta row */}
                <div className="recipe-meta" style={{
                  display: 'flex', gap: '20px', marginBottom: '22px',
                  paddingBottom: '18px',
                  borderBottom: '1.5px solid var(--cream-dark)'
                }}>
                  {[
                    { icon: '⏱️', label: recipe.time },
                    { icon: '📊', label: recipe.difficulty === 'easy' ? 'Easy' : 'Medium' },
                    { icon: '🍽️', label: recipe.servings }
                  ].map(({ icon, label }, i) => (
                    <span key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      color: 'var(--text-mid)', fontSize: '13px', fontWeight: '700'
                    }}>
                      <span style={{ fontSize: '16px' }}>{icon}</span> {label}
                    </span>
                  ))}
                </div>

                {/* Ingredients grid */}
                {recipe.ingredients?.length > 0 && (
                  <div style={{
                    marginBottom: '20px', padding: '22px',
                    background: 'var(--cream)', borderRadius: '14px',
                    border: '1px solid var(--border)'
                  }}>
                    <h4 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '15px', fontWeight: '700',
                      color: 'var(--brown-dark)', marginBottom: '16px',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      🥘 Ingredients
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                      gap: '10px'
                    }}>
                      {recipe.ingredients.map((ing, idx) => (
                        <div key={idx} style={{
                          padding: '9px 13px',
                          background: 'white',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text-dark)', fontSize: '13px',
                          fontWeight: '600',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          boxShadow: '0 1px 4px rgba(93,42,24,0.05)'
                        }}>
                          <span style={{ fontSize: '16px' }}>{getIngredientIcon(ing)}</span> {ing}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions toggle */}
                <button
                  onClick={() => toggleInstructions(index)}
                  style={{
                    width: '100%', padding: '14px 20px',
                    background: 'var(--cream)', border: '1.5px solid var(--border)',
                    borderRadius: '10px', color: 'var(--brown-dark)',
                    fontSize: '14px', fontWeight: '700',
                    fontFamily: "'Nunito', sans-serif",
                    cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--amber)';
                    e.currentTarget.style.background = 'rgba(243,146,0,0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--cream)';
                  }}
                >
                  <span>📖 {expandedRecipes[index] ? 'Hide' : 'View'} Cooking Instructions</span>
                  <span style={{ color: 'var(--brown-warm)', fontWeight: '800' }}>
                    {expandedRecipes[index] ? '▲' : '▼'}
                  </span>
                </button>

                {expandedRecipes[index] && (
                  <div style={{
                    marginTop: '14px', padding: '24px',
                    background: 'var(--cream)', borderRadius: '12px',
                    border: '1px solid var(--border)'
                  }}>
                    <ol style={{ listStyle: 'none', counterReset: 'step-counter', margin: 0, padding: 0 }}>
                      {recipe.instructions?.map((instruction, i) => (
                        <li key={i} style={{
                          marginBottom: '16px', paddingLeft: '48px',
                          position: 'relative', color: 'var(--text-mid)',
                          lineHeight: '1.7', fontSize: '14px', fontWeight: '500'
                        }}>
                          <div style={{
                            position: 'absolute', left: 0, top: 0,
                            width: '32px', height: '32px',
                            background: 'linear-gradient(135deg, #F39200, #A0451F)',
                            color: 'white', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '800', fontSize: '13px',
                            boxShadow: '0 3px 10px rgba(243,146,0,0.35)'
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
          textAlign: 'center', padding: '24px',
          color: 'var(--text-light)', fontSize: '12px', fontWeight: '600'
        }}>
          © 2026 <strong style={{ color: 'var(--brown-warm)' }}>Monarch-Elite Holdings</strong>. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
