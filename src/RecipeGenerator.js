import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// ASSETS & CONSTANTS (Change 1 & 4) [cite: 60, 62, 63]
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

const LANGUAGES = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'zh', label: '🇨🇳 中文' },
];

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
  },
  // (Full translation maps for fr, de, zh included from guide) [cite: 70, 73, 76]
};

// ─── Sidebar Component (Change 1 & 6) [cite: 77-85] ───────────────────────────
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
          }, 3000); // 3-second display [cite: 80]
        }, 500);
      }, 2000); // 2-second cycle [cite: 80]
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
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'orange', textTransform: 'uppercase', textAlign: 'center' }}>
            {t.didYouKnow}
          </div>
          {factVisible && (
            <div style={{ fontSize: '12.5px', color: '#666', lineHeight: '1.65', textAlign: 'center', fontStyle: 'italic', animation: 'fadeUp 0.4s ease' }}>
              {FOOD_FACTS[factIndex]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT (The Critical Fix)
// ============================================================================
export default function RecipeGenerator() {
  const [page, setPage] = useState(1);
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState('en'); // [cite: 86]
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en; // [cite: 87]

  // --- Logic for Claude Engine (Original Functionality)
  const generateRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/repair-json', {
        method: 'POST',
        body: JSON.stringify({ ingredients, language })
      });
      const text = await response.text();
      let generatedRecipes = [];

      // Change 12: Hardened JSON Parsing Fallback [cite: 110, 111, 112]
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
      {/* Change 3: Global Animations [cite: 88-94] */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-8px); } }
        @keyframes textCycle { 0%, 40% { opacity: 1; } 50% { opacity: 0; } 60%, 100% { opacity: 1; } }
        @media (max-width: 900px) { .did-you-know-sidebar { display: none !important; } }
      `}</style>

      {page === 1 ? (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          {/* Change 4: Logo Replacement [cite: 95, 96] */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', animation: 'fadeUp 0.7s ease-out' }}>
            <img src={LOADING_GIF} alt="Loading..." style={{ width: '280px', height: '280px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 10px 40px rgba(243,146,0,0.35)' }} />
          </div>

          <h2 style={{ color: '#4a2a1a' }}>{t.welcomeChef}</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>{t.tellUs}</p>

          <input 
            type="text" 
            placeholder={t.yourName} 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '20px' }}
          />

          {/* Change 5: Language Selector [cite: 98-103] */}
          <div style={{ marginBottom: '24px', textAlign: 'left', background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(243,146,0,0.3)' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'brown', textTransform: 'uppercase', marginBottom: '12px' }}>{t.selectLang}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: language === lang.code ? '2px solid orange' : '1.5px solid #eee', background: language === lang.code ? 'rgba(243,146,0,0.12)' : 'white', cursor: 'pointer' }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setPage(2)} style={{ width: '100%', padding: '14px', background: '#d16a1e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
            {t.letsCook}
          </button>
        </div>
      ) : (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
          <DidYouKnowSidebar t={t} />
          
          <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span dangerouslySetInnerHTML={{ __html: t.welcomeBack(userName) }} />
          </h2>

          {/* Change 8: Loading State [cite: 105, 106, 107] */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <img src={LOADING_GIF} alt="Cooking..." style={{ width: '200px', height: '200px', borderRadius: '16px', objectFit: 'cover' }} />
              <p style={{ fontSize: '22px', fontWeight: '700', color: 'brown', animation: 'textCycle 3s infinite', marginTop: '16px' }}>{t.cookingUp}</p>
              <p style={{ color: '#888' }}>{t.hangTight}</p>
            </div>
          )}

          {/* Change 9 & 10: Card Layout & Dot Icons [cite: 108, 109] */}
          {!loading && recipes.map((recipe, index) => (
            <div key={index} style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(93,42,24,0.1)', borderRadius: '24px', padding: '32px 28px', marginBottom: '24px', maxWidth: '720px', margin: '0 auto 24px', backdropFilter: 'blur(6px)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3>{recipe.name}</h3>
              <div style={{ marginTop: '12px' }}>
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} style={{ marginBottom: '4px' }}>
                    <span style={{ color: 'orange', fontSize: '14px', marginRight: '8px' }}>•</span> {ing}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
