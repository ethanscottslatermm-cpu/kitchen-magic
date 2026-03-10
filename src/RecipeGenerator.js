/**
 * Copyright (c) 2026 Monarch-Elite Holdings
 * All Rights Reserved
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Download } from 'lucide-react';

// ─── Loading GIF URL ──────────────────────────────────────────────────────────
const LOADING_GIF = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3g4bHR1Ym9vYWlzaW54cHVibjR4MnFpNTFzaDdxZDlmc2hob2l3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dWacKLne4EowGUaVUw/giphy.gif";

// ─── Did You Know Facts ───────────────────────────────────────────────────────
const FOOD_FACTS = [
  "Honey never spoils — archaeologists found 3000-year-old honey in Egyptian tombs!",
  "Bananas are technically berries, but strawberries are not.",
  "Apples float in water because 25% of their volume is air.",
  "The world's most expensive spice is saffron — it takes 75,000 flowers for 1 pound.",
  "Avocados are a fruit, and they ripen faster next to bananas.",
  "Carrots were originally purple, not orange.",
  "Chocolate was once used as currency by the Aztecs.",
  "A single coffee tree produces only about 1 pound of coffee per year.",
  "Cashews grow on the outside of a fruit called a cashew apple.",
  "Pineapples contain an enzyme that literally digests proteins — including your tongue!",
  "The Caesar salad was invented in Tijuana, Mexico, not Rome.",
  "Garlic was found in King Tut's tomb — ancient Egyptians valued it highly.",
  "Cucumbers are 96% water.",
  "Eating spicy food doesn't actually burn your stomach — capsaicin just tricks pain receptors.",
  "The first pizza delivery was made in 1889, to Queen Margherita of Italy.",
];

// ─── Language Translations ────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    name: "English",
    flag: "🇺🇸",
    title: "Kitchen Magic",
    subtitle: "AI-Powered Recipe Generator",
    enterName: "Enter your name to get started",
    namePlaceholder: "Your name...",
    startCooking: "Start Cooking!",
    welcomeBack: "Welcome back",
    ingredientsLabel: "What ingredients do you have?",
    ingredientPlaceholder: "Type an ingredient...",
    addIngredient: "Add",
    generateRecipe: "Generate Recipe",
    generating: "Generating...",
    yourRecipe: "Your Recipe",
    ingredients: "Ingredients",
    instructions: "Instructions",
    tips: "Chef's Tips",
    newRecipe: "New Recipe",
    noIngredients: "Please add at least one ingredient.",
    didYouKnow: "Did you know?",
    searchPlaceholder: "Search recipes...",
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
    title: "Magia de Cocina",
    subtitle: "Generador de Recetas con IA",
    enterName: "Ingresa tu nombre para comenzar",
    namePlaceholder: "Tu nombre...",
    startCooking: "¡Empezar a Cocinar!",
    welcomeBack: "Bienvenido de nuevo",
    ingredientsLabel: "¿Qué ingredientes tienes?",
    ingredientPlaceholder: "Escribe un ingrediente...",
    addIngredient: "Agregar",
    generateRecipe: "Generar Receta",
    generating: "Generando...",
    yourRecipe: "Tu Receta",
    ingredients: "Ingredientes",
    instructions: "Instrucciones",
    tips: "Consejos del Chef",
    newRecipe: "Nueva Receta",
    noIngredients: "Por favor agrega al menos un ingrediente.",
    didYouKnow: "¿Sabías que?",
    searchPlaceholder: "Buscar recetas...",
  },
  fr: {
    name: "Français",
    flag: "🇫🇷",
    title: "Magie Culinaire",
    subtitle: "Générateur de Recettes IA",
    enterName: "Entrez votre nom pour commencer",
    namePlaceholder: "Votre nom...",
    startCooking: "Commencer à Cuisiner!",
    welcomeBack: "Bon retour",
    ingredientsLabel: "Quels ingrédients avez-vous?",
    ingredientPlaceholder: "Tapez un ingrédient...",
    addIngredient: "Ajouter",
    generateRecipe: "Générer une Recette",
    generating: "Génération...",
    yourRecipe: "Votre Recette",
    ingredients: "Ingrédients",
    instructions: "Instructions",
    tips: "Conseils du Chef",
    newRecipe: "Nouvelle Recette",
    noIngredients: "Veuillez ajouter au moins un ingrédient.",
    didYouKnow: "Le saviez-vous?",
    searchPlaceholder: "Rechercher des recettes...",
  },
  de: {
    name: "Deutsch",
    flag: "🇩🇪",
    title: "Küchenmagie",
    subtitle: "KI-gestützter Rezeptgenerator",
    enterName: "Gib deinen Namen ein, um zu beginnen",
    namePlaceholder: "Dein Name...",
    startCooking: "Fang an zu kochen!",
    welcomeBack: "Willkommen zurück",
    ingredientsLabel: "Welche Zutaten hast du?",
    ingredientPlaceholder: "Zutat eingeben...",
    addIngredient: "Hinzufügen",
    generateRecipe: "Rezept generieren",
    generating: "Generieren...",
    yourRecipe: "Dein Rezept",
    ingredients: "Zutaten",
    instructions: "Anweisungen",
    tips: "Kochstipps",
    newRecipe: "Neues Rezept",
    noIngredients: "Bitte füge mindestens eine Zutat hinzu.",
    didYouKnow: "Wusstest du?",
    searchPlaceholder: "Rezepte suchen...",
  },
  zh: {
    name: "中文",
    flag: "🇨🇳",
    title: "厨房魔法",
    subtitle: "AI驱动的食谱生成器",
    enterName: "输入您的姓名开始",
    namePlaceholder: "您的姓名...",
    startCooking: "开始烹饪！",
    welcomeBack: "欢迎回来",
    ingredientsLabel: "您有哪些食材？",
    ingredientPlaceholder: "输入食材...",
    addIngredient: "添加",
    generateRecipe: "生成食谱",
    generating: "生成中...",
    yourRecipe: "您的食谱",
    ingredients: "食材",
    instructions: "步骤",
    tips: "厨师小贴士",
    newRecipe: "新食谱",
    noIngredients: "请至少添加一种食材。",
    didYouKnow: "您知道吗？",
    searchPlaceholder: "搜索食谱...",
  },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Lato', sans-serif;
    background: linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #1a0a00 100%);
    min-height: 100vh;
    color: #f5e6d3;
  }

  /* ── Loading Screen ── */
  .loading-screen {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, #1a0a00, #3d1f00, #1a0a00);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.5s ease;
  }
  .loading-gif {
    width: 180px; height: 180px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #f5a623;
    box-shadow: 0 0 30px rgba(245,166,35,0.4);
    margin-bottom: 24px;
  }
  .loading-text-container {
    text-align: center;
    height: 60px;
    display: flex; align-items: center; justify-content: center;
  }
  .loading-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: #f5a623;
    opacity: 0;
    transform: translateY(10px);
    animation: textCycle 4s ease-in-out infinite;
    position: absolute;
  }
  .loading-text:nth-child(1) { animation-delay: 0s; }
  .loading-text:nth-child(2) { animation-delay: 2s; }
  @keyframes textCycle {
    0%   { opacity: 0; transform: translateY(10px); }
    15%  { opacity: 1; transform: translateY(0); }
    40%  { opacity: 1; transform: translateY(0); }
    55%  { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 0; transform: translateY(10px); }
  }

  /* ── Page 1 ── */
  .page1 {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px;
    animation: fadeIn 0.8s ease;
  }
  .page1-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(245,166,35,0.3);
    border-radius: 20px;
    padding: 48px 40px;
    max-width: 480px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .app-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.8rem;
    color: #f5a623;
    margin-bottom: 8px;
    text-shadow: 0 0 20px rgba(245,166,35,0.3);
  }
  .app-subtitle {
    font-size: 0.95rem;
    color: rgba(245,230,211,0.7);
    margin-bottom: 32px;
    letter-spacing: 0.05em;
  }
  .lang-selector {
    display: flex; flex-wrap: wrap; gap: 8px;
    justify-content: center;
    margin-bottom: 28px;
  }
  .lang-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid rgba(245,166,35,0.4);
    background: transparent;
    color: #f5e6d3;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .lang-btn:hover, .lang-btn.active {
    background: rgba(245,166,35,0.2);
    border-color: #f5a623;
    color: #f5a623;
  }
  .name-input {
    width: 100%;
    padding: 14px 18px;
    border-radius: 12px;
    border: 1px solid rgba(245,166,35,0.3);
    background: rgba(255,255,255,0.07);
    color: #f5e6d3;
    font-size: 1rem;
    font-family: 'Lato', sans-serif;
    margin-bottom: 16px;
    outline: none;
    transition: border-color 0.2s;
  }
  .name-input:focus { border-color: #f5a623; }
  .name-input::placeholder { color: rgba(245,230,211,0.4); }
  .start-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #f5a623, #e8821a);
    color: #1a0a00;
    font-size: 1.05rem;
    font-weight: 700;
    font-family: 'Lato', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(245,166,35,0.3);
  }
  .start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(245,166,35,0.4);
  }

  /* ── Page 2 ── */
  .page2 {
    min-height: 100vh;
    padding: 24px 20px;
    max-width: 960px;
    margin: 0 auto;
    animation: fadeIn 0.6s ease;
    position: relative;
  }
  .page2-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap; gap: 12px;
  }
  .welcome-msg {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    color: #f5a623;
    animation: slideInLeft 0.5s ease;
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Did You Know Sidebar ── */
  .did-you-know {
    position: fixed;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    width: 220px;
    z-index: 100;
    pointer-events: none;
  }
  .dyk-bubble {
    background: rgba(245,166,35,0.12);
    border: 1px solid rgba(245,166,35,0.5);
    border-radius: 16px;
    padding: 14px 16px;
    backdrop-filter: blur(8px);
    opacity: 0;
    transform: scale(0.85) translateX(20px);
    transition: opacity 0.4s ease, transform 0.4s ease;
    box-shadow: 0 4px 24px rgba(245,166,35,0.15);
  }
  .dyk-bubble.visible {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
  .dyk-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #f5a623;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .dyk-fact {
    font-size: 0.82rem;
    color: rgba(245,230,211,0.9);
    line-height: 1.5;
    opacity: 0;
    transition: opacity 0.4s ease 0.2s;
  }
  .dyk-fact.visible { opacity: 1; }

  /* ── Main Card ── */
  .main-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(245,166,35,0.2);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .section-label {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(245,166,35,0.7);
    margin-bottom: 12px;
  }
  .ingredient-row {
    display: flex; gap: 10px; margin-bottom: 14px;
  }
  .ingredient-input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid rgba(245,166,35,0.25);
    background: rgba(255,255,255,0.06);
    color: #f5e6d3;
    font-size: 0.95rem;
    font-family: 'Lato', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .ingredient-input:focus { border-color: #f5a623; }
  .ingredient-input::placeholder { color: rgba(245,230,211,0.35); }
  .add-btn {
    padding: 12px 20px;
    border-radius: 10px;
    border: 1px solid rgba(245,166,35,0.5);
    background: rgba(245,166,35,0.15);
    color: #f5a623;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .add-btn:hover { background: rgba(245,166,35,0.25); }
  .tags-wrap {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;
    min-height: 36px;
  }
  .tag {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(245,166,35,0.15);
    border: 1px solid rgba(245,166,35,0.35);
    color: #f5e6d3;
    font-size: 0.85rem;
    animation: popIn 0.2s ease;
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }
  .tag-remove {
    cursor: pointer; opacity: 0.6;
    font-size: 0.75rem;
    transition: opacity 0.2s;
    background: none; border: none; color: inherit;
    padding: 0; line-height: 1;
  }
  .tag-remove:hover { opacity: 1; }
  .generate-btn {
    width: 100%;
    padding: 15px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #f5a623, #e8821a);
    color: #1a0a00;
    font-size: 1rem;
    font-weight: 700;
    font-family: 'Lato', sans-serif;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 20px rgba(245,166,35,0.25);
    position: relative;
    overflow: hidden;
  }
  .generate-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(245,166,35,0.35);
  }
  .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .generate-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: translateX(-100%);
    transition: transform 0.4s ease;
  }
  .generate-btn:hover:not(:disabled)::after { transform: translateX(100%); }

  /* ── Recipe Card ── */
  .recipe-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(245,166,35,0.25);
    border-radius: 18px;
    padding: 28px 32px;
    margin-bottom: 24px;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.35);
    animation: slideUp 0.5s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .recipe-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    color: #f5a623;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(245,166,35,0.2);
    padding-bottom: 14px;
  }
  .recipe-section-title {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(245,166,35,0.75);
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .recipe-section-title:first-of-type { margin-top: 0; }
  .recipe-list {
    list-style: none;
    padding: 0;
  }
  .recipe-list li {
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.92rem;
    line-height: 1.5;
    color: rgba(245,230,211,0.88);
    display: flex; gap: 10px;
  }
  .recipe-list li::before {
    content: '•';
    color: #f5a623;
    flex-shrink: 0;
  }
  .recipe-step {
    display: flex; gap: 12px; padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.92rem; line-height: 1.5;
    color: rgba(245,230,211,0.88);
  }
  .step-num {
    background: rgba(245,166,35,0.2);
    border: 1px solid rgba(245,166,35,0.4);
    border-radius: 50%;
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; color: #f5a623;
    flex-shrink: 0; margin-top: 2px;
  }
  .new-recipe-btn {
    display: block; margin: 0 auto;
    padding: 12px 32px;
    border-radius: 10px;
    border: 1px solid rgba(245,166,35,0.5);
    background: transparent;
    color: #f5a623;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: 'Lato', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 20px;
  }
  .new-recipe-btn:hover {
    background: rgba(245,166,35,0.1);
    transform: translateY(-1px);
  }

  /* ── Camera / Upload ── */
  .camera-section { margin-top: 20px; }
  .camera-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px;
    border-radius: 10px;
    border: 1px dashed rgba(245,166,35,0.4);
    background: transparent;
    color: rgba(245,230,211,0.6);
    font-size: 0.88rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .camera-btn:hover {
    border-color: #f5a623;
    color: #f5a623;
    background: rgba(245,166,35,0.08);
  }
  .image-preview {
    position: relative; margin-top: 12px; display: inline-block;
  }
  .image-preview img {
    max-width: 100%; border-radius: 12px;
    border: 1px solid rgba(245,166,35,0.25);
    max-height: 200px; object-fit: cover;
  }
  .remove-img-btn {
    position: absolute; top: 6px; right: 6px;
    background: rgba(0,0,0,0.6); border: none;
    border-radius: 50%; width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff;
  }

  /* ── Error ── */
  .error-msg {
    background: rgba(220,50,50,0.15);
    border: 1px solid rgba(220,50,50,0.4);
    border-radius: 10px;
    padding: 12px 16px;
    color: #ff9090;
    font-size: 0.88rem;
    margin-bottom: 16px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .did-you-know { display: none; }
    .page2 { padding: 16px 14px; }
    .main-card { padding: 20px 16px; }
    .recipe-card { padding: 20px 18px; }
    .app-title { font-size: 2.2rem; }
    .page1-card { padding: 32px 24px; }
  }
`;

// ─── Did You Know Component ───────────────────────────────────────────────────
function DidYouKnow({ t, show }) {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [factVisible, setFactVisible] = useState(false);
  const [currentFact, setCurrentFact] = useState(FOOD_FACTS[0]);
  const [factIndex, setFactIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    // Delay start until after welcome greeting settles
    const startDelay = setTimeout(() => {
      runCycle(0);
    }, 2000);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timerRef.current);
    };
  }, [show]);

  function runCycle(idx) {
    const fact = FOOD_FACTS[idx % FOOD_FACTS.length];
    setCurrentFact(fact);
    setFactIndex(idx);

    // Bubble appears
    setBubbleVisible(true);

    // Fact text appears ~300ms later
    timerRef.current = setTimeout(() => {
      setFactVisible(true);
    }, 300);

    // After 3s total, fade everything out
    timerRef.current = setTimeout(() => {
      setFactVisible(false);
      timerRef.current = setTimeout(() => {
        setBubbleVisible(false);
        // Pause before next cycle
        timerRef.current = setTimeout(() => {
          runCycle(idx + 1);
        }, 1500);
      }, 400);
    }, 3000);
  }

  if (!show) return null;

  return (
    <div className="did-you-know">
      <div className={`dyk-bubble${bubbleVisible ? ' visible' : ''}`}>
        <div className="dyk-label">
          <span>💭</span>
          <span>{t.didYouKnow}</span>
        </div>
        <div className={`dyk-fact${factVisible ? ' visible' : ''}`}>
          {currentFact}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RecipeGenerator() {
  const [page, setPage] = useState('loading');
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);

  const t = TRANSLATIONS[language];

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setPage('page1'), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ── Helpers ──
  const addIngredient = () => {
    const val = inputValue.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients([...ingredients, val]);
      setInputValue('');
    }
  };

  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addIngredient();
  };

  const handleStart = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setPage('page2');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCapturedImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Recipe Generation ──
  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      setError(t.noIngredients);
      return;
    }
    setError('');
    setLoading(true);
    setRecipe(null);

    try {
      const messages = [];
      const promptText = `You are a creative chef. Generate a recipe using these ingredients: ${ingredients.join(', ')}.
Respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{
  "title": "Recipe Name",
  "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
  "instructions": ["Step 1 description", "Step 2 description"],
  "tips": ["Tip 1", "Tip 2"]
}`;

      if (capturedImage) {
        messages.push({
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: capturedImage.split(',')[1] } },
            { type: 'text', text: promptText }
          ]
        });
      } else {
        messages.push({ role: 'user', content: promptText });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const text = data.content?.map(b => b.text || '').join('') || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setRecipe(parsed);
    } catch (err) {
      setError(`Failed to generate recipe: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetRecipe = () => {
    setRecipe(null);
    setIngredients([]);
    setInputValue('');
    setError('');
    setCapturedImage(null);
  };

  // ── Render ──
  return (
    <>
      <style>{styles}</style>

      {/* Loading Screen */}
      {page === 'loading' && (
        <div className="loading-screen">
          <img src={LOADING_GIF} alt="Loading" className="loading-gif" />
          <div className="loading-text-container" style={{ position: 'relative', width: '300px' }}>
            <span className="loading-text">Preparing your kitchen...</span>
            <span className="loading-text">Magic recipes await!</span>
          </div>
        </div>
      )}

      {/* Page 1 – Name + Language */}
      {page === 'page1' && (
        <div className="page1">
          <div className="page1-card">
            <div className="app-title">{t.title}</div>
            <div className="app-subtitle">{t.subtitle}</div>

            {/* Language Selector */}
            <div className="lang-selector">
              {Object.entries(TRANSLATIONS).map(([code, lang]) => (
                <button
                  key={code}
                  className={`lang-btn${language === code ? ' active' : ''}`}
                  onClick={() => setLanguage(code)}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'rgba(245,230,211,0.6)', marginBottom: '16px' }}>
              {t.enterName}
            </p>
            <input
              className="name-input"
              type="text"
              placeholder={t.namePlaceholder}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
            />
            <button className="start-btn" onClick={handleStart}>
              {t.startCooking}
            </button>
          </div>
        </div>
      )}

      {/* Page 2 – Recipe Generator */}
      {page === 'page2' && (
        <>
          <DidYouKnow t={t} show={true} />

          <div className="page2">
            <div className="page2-header">
              <div className="welcome-msg">
                {t.welcomeBack}, {userName}! 👨‍🍳
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.entries(TRANSLATIONS).map(([code, lang]) => (
                  <button
                    key={code}
                    className={`lang-btn${language === code ? ' active' : ''}`}
                    onClick={() => setLanguage(code)}
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>
            </div>

            {!recipe ? (
              <div className="main-card">
                <div className="section-label">{t.ingredientsLabel}</div>

                <div className="ingredient-row">
                  <input
                    className="ingredient-input"
                    type="text"
                    placeholder={t.ingredientPlaceholder}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="add-btn" onClick={addIngredient}>
                    {t.addIngredient}
                  </button>
                </div>

                {ingredients.length > 0 && (
                  <div className="tags-wrap">
                    {ingredients.map(ing => (
                      <div key={ing} className="tag">
                        <span>{ing}</span>
                        <button className="tag-remove" onClick={() => removeIngredient(ing)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Camera / Image upload */}
                <div className="camera-section">
                  <button className="camera-btn" onClick={() => fileInputRef.current?.click()}>
                    <Camera size={16} />
                    <span>Add photo of ingredients</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  {capturedImage && (
                    <div className="image-preview">
                      <img src={capturedImage} alt="Ingredients" />
                      <button className="remove-img-btn" onClick={() => setCapturedImage(null)}>
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {error && <div className="error-msg" style={{ marginTop: '16px' }}>{error}</div>}

                <button
                  className="generate-btn"
                  style={{ marginTop: '24px' }}
                  onClick={generateRecipe}
                  disabled={loading}
                >
                  {loading ? t.generating : t.generateRecipe}
                </button>
              </div>
            ) : (
              <div className="recipe-card">
                <div className="recipe-title">{recipe.title}</div>

                <div className="recipe-section-title">{t.ingredients}</div>
                <ul className="recipe-list">
                  {recipe.ingredients?.map((ing, i) => (
                    <li key={i}><span>{ing}</span></li>
                  ))}
                </ul>

                <div className="recipe-section-title">{t.instructions}</div>
                {recipe.instructions?.map((step, i) => (
                  <div key={i} className="recipe-step">
                    <div className="step-num">{i + 1}</div>
                    <div>{step}</div>
                  </div>
                ))}

                {recipe.tips?.length > 0 && (
                  <>
                    <div className="recipe-section-title">{t.tips}</div>
                    <ul className="recipe-list">
                      {recipe.tips.map((tip, i) => (
                        <li key={i}><span>{tip}</span></li>
                      ))}
                    </ul>
                  </>
                )}

                <button className="new-recipe-btn" onClick={resetRecipe}>
                  ← {t.newRecipe}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
