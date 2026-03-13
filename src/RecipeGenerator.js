import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// ASSETS & CONSTANTS (Changes 1 & 4)
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
  // (Remaining translations fr, de, zh as per your text file)
};

// ─── Change 1 & 6: Did You Know Sidebar Component ──────────────────────────
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

  // --- Original Claude Backend Logic (RESTORED)
  const generateRecipes = async () => {
    setLoading(true);
    try {
      // Pointing back to your original Netlify function
      const response = await fetch('/.netlify/functions/repair-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, language })
      });

      const text = await response.text();
      let generatedRecipes = [];

      // Change 12: Hardened JSON Parsing
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
