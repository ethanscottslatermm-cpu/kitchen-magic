import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// CONSTANTS & ASSETS (Change 1 & 4)
// ============================================================================
const FOOD_FACTS = [
  "Honey never spoils. Archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible!",
  "Bananas are berries, but strawberries are not — botanically speaking!",
  "The most expensive spice by weight is saffron, costing up to $5,000 per pound.",
  "Apples float in water because they are 25% air.",
  "It takes about 12 pounds of milk to make just 1 pound of cheese.",
  "Carrots were originally purple before the 17th century!",
  "A single spaghetti noodle is called a spaghetto.",
  "Peanuts are not nuts — they are legumes that grow underground.",
  "Chocolate was once used as currency by the Aztecs.",
  "The average American eats about 23 pounds of pizza per year.",
  "Vanilla is the second most expensive spice after saffron.",
  "Cranberries can bounce like rubber balls when they are ripe!",
  "Nutmeg in large doses can cause hallucinations.",
  "The fear of cooking is called mageirocophobia.",
  "Ketchup was sold as medicine in the 1830s.",
  "Almonds are members of the peach family.",
  "Avocados are actually a fruit, not a vegetable!",
  "The most stolen food in the world is cheese.",
  "Lemons contain more sugar than strawberries.",
  "Worcestershire sauce is made from fermented anchovies."
];

const LOADING_GIF = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3g4bHR1Ym9vYWlzaW54cHVibjR4MnFpNTFzaDdxZDlmc2hob2l3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dWacKLne4EowGUaVUw/giphy.gif";

const TRANSLATIONS = {
  en: {
    welcomeChef: 'Welcome, Chef!',
    tellUs: 'Tell us your name to get started',
    yourName: 'Your name...',
    letsCook: "Let's Cook! 🍳",
    selectLang: 'SELECT LANGUAGE',
    welcomeBack: (name) => `Welcome back, <strong>${name || 'Chef'}</strong>! What are we cooking today?`,
    cookingUp: 'Cooking up something delicious...',
    hangTight: 'Hang tight while we find the perfect recipes for you 🍳',
    didYouKnow: '💡 Did You Know?',
  },
  es: {
    welcomeChef: '¡Bienvenido, Chef!',
    tellUs: 'Dinos tu nombre para empezar',
    yourName: 'Tu nombre...',
    letsCook: '¡A Cocinar! 🍳',
    selectLang: 'SELECCIONAR IDIOMA',
    welcomeBack: (name) => `¡Bienvenido de nuevo, <strong>${name || 'Chef'}</strong>! ¿Qué cocinamos hoy?`,
    cookingUp: 'Preparando algo delicioso...',
    hangTight: 'Espera mientras encontramos las recetas perfectas 🍳',
    didYouKnow: '💡 ¿Sabías que...?',
  }
  // (fr, de, zh languages would follow the same structure)
};

// ─── Sidebar Component (Change 1 & 6) ───────────────────────────────────────
function DidYouKnowSidebar({ t }) {
  const [phase, setPhase] = useState('welcome');
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const cycle = () => {
      setPhase('welcome');
      setFactVisible(false);
      timerRef.current = setTimeout(() => {
        setPhase('bubble');
        timerRef.current = setTimeout(() => {
          setFactVisible(true);
          timerRef.current = setTimeout(() => {
            setPhase('fadeout');
            timerRef.current = setTimeout(() => {
              setFactIndex(prev => (prev + 1) % FOOD_FACTS.length);
              cycle();
            }, 600);
          }, 3000); 
        }, 500);
      }, 2000);
    };
    cycle();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="did-you-know-sidebar" style={{
      position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)',
      width: '240px', zIndex: 50, pointerEvents: 'none',
    }}>
      {(phase === 'bubble' || phase === 'fact' || phase === 'fadeout') && (
        <div style={{
          background: 'rgba(255,248,238,0.96)',
          border: '1.5px solid rgba(243,146,0,0.35)',
          borderRadius: '16px', padding: '18px 16px',
          boxShadow: '0 8px 30px rgba(93,42,24,0.15)',
          backdropFilter: 'blur(8px)',
          animation: phase === 'fadeout' ? 'fadeOut 0.6s ease forwards' : 'fadeUp 0.5s ease forwards',
        }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#d16a1e', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>
            {t.didYouKnow}
          </div>
          {factVisible && (
            <div style={{ fontSize: '12.5px', color: '#555', lineHeight: '1.65', textAlign: 'center', fontStyle: 'italic', animation: 'fadeUp 0.4s ease' }}>
              {FOOD_FACTS[factIndex]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT (FIX: Export Default added here)
// ============================================================================
export default function RecipeGenerator() {
  const [page, setPage] = useState(1);
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // --- RESTORED ORIGINAL CLAUDE BACKEND LOGIC ---
  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Calling your existing Claude Netlify function
      const response = await fetch('/.netlify/functions/repair-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, language })
      });

      const text = await response.text();
      let generatedRecipes = [];

      // Change 12: Hardened JSON Parsing Fallback
      try {
        generatedRecipes = JSON.parse(text);
      } catch (e) {
        const recipePattern = /\{[^{}]*"name"[^{}]*"instructions"[^{}]*\}/gs;
        const matches = text.match(recipePattern);
        if (matches && matches.length > 0) {
          generatedRecipes = matches.map(m => JSON.parse(m));
        } else {
          throw e;
        }
      }
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error("Claude Engine Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: '100vh', background: '#fff9f0' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-8px); } }
        @keyframes textCycle { 0%, 40% { opacity: 1; } 50% { opacity: 0; } 60%, 100% { opacity: 1; } }
        @media (max-width: 900px) { .did-you-know-sidebar { display: none !important; } }
      `}</style>

      {page === 1 ? (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <img src={LOADING_GIF} alt="Logo" style={{ width: '280px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(243,146,0,0.35)' }} />
          </div>
          <h2>{t.welcomeChef}</h2>
          <input 
            type="text" 
            placeholder={t.yourName} 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', margin: '20px 0' }}
          />
          <button onClick={() => setPage(2)} style={{ width: '100%', padding: '14px', background: '#d16a1e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
            {t.letsCook}
          </button>
        </div>
      ) : (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
          <DidYouKnowSidebar t={t} />
          <h2 style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: t.welcomeBack(userName) }} />
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <img src={LOADING_GIF} alt="Loading" style={{ width: '150px', borderRadius: '15px' }} />
              <p style={{ animation: 'textCycle 3s infinite', fontWeight: 'bold', color: '#d16a1e' }}>{t.cookingUp}</p>
            </div>
          ) : (
            recipes.map((recipe, i) => (
              <div key={i} style={{ background: 'white', padding: '32px', borderRadius: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '720px', margin: '0 auto 24px' }}>
                <h3>{recipe.name}</h3>
                {recipe.ingredients.map((ing, j) => <div key={j} style={{ margin: '4px 0' }}><span style={{ color: 'orange' }}>•</span> {ing}</div>)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
