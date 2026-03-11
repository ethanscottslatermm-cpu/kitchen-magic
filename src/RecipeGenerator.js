/**
 * Copyright (c) 2026 Monarch-Elite Holdings
 * All Rights Reserved
 * 
 * Kitchen Magic - Recipe Generator
 * Updated with: Language selection, Did You Know sidebar, 
 * improved recipe cards, loading GIF, text-only ingredients/search
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Download } from 'lucide-react';

// ─── Food Facts for "Did You Know?" Sidebar ─────────────────────────────────
const FOOD_FACTS = [
  "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible!",
  "Bananas are berries, but strawberries aren't — botanically speaking!",
  "The world's most expensive spice by weight is saffron, costing up to $5,000 per pound.",
  "Apples float in water because they are 25% air.",
  "It takes about 12 pounds of milk to make just 1 pound of cheese.",
  "Carrots were originally purple before the 17th century!",
  "A single spaghetti noodle is called a 'spaghetto'.",
  "Peanuts are not nuts — they're legumes that grow underground.",
  "Chocolate was once used as currency by the Aztecs.",
  "The average American eats about 23 pounds of pizza per year.",
  "Vanilla is the second most expensive spice after saffron.",
  "Cranberries can bounce like rubber balls when they're ripe!",
  "Nutmeg in large doses can cause hallucinations.",
  "The fear of cooking is called 'mageirocophobia'.",
  "Ketchup was sold as medicine in the 1830s.",
  "Almonds are members of the peach family.",
  "One ear of corn has about 800 kernels arranged in 16 rows.",
  "Avocados are actually a fruit, not a vegetable!",
  "The most stolen food in the world is cheese.",
  "Lemons contain more sugar than strawberries."
];

// ─── Language Translations ───────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    appTitle: "Kitchen Magic",
    welcomeBack: "Welcome Back, Chef! 🍳",
    didYouKnow: "Did You Know?",
    ingredients: "Ingredients",
    ingredientPlaceholder: "Enter an ingredient (e.g., chicken, rice, tomato)",
    addIngredient: "Add",
    search: "Search Recipes",
    searchPlaceholder: "Search for a recipe...",
    generateRecipe: "Generate Recipe ✨",
    generating: "Creating something delicious...",
    generatingAlt: "Cooking up magic...",
    recipeResult: "Your Recipe",
    servings: "Servings",
    prepTime: "Prep Time",
    cookTime: "Cook Time",
    instructions: "Instructions",
    noIngredients: "Add some ingredients to get started!",
    removeIngredient: "Remove",
    selectLanguage: "Select Language",
    getStarted: "Let's Cook!",
    loading: "Preparing your kitchen...",
    clearAll: "Clear All",
    tryAgain: "Try Again",
    errorMessage: "Something went wrong. Please try again.",
    back: "← Back",
    downloadRecipe: "Download Recipe",
  },
  es: {
    appTitle: "Magia en la Cocina",
    welcomeBack: "¡Bienvenido de nuevo, Chef! 🍳",
    didYouKnow: "¿Sabías que...?",
    ingredients: "Ingredientes",
    ingredientPlaceholder: "Ingresa un ingrediente (ej: pollo, arroz, tomate)",
    addIngredient: "Agregar",
    search: "Buscar Recetas",
    searchPlaceholder: "Buscar una receta...",
    generateRecipe: "Generar Receta ✨",
    generating: "Creando algo delicioso...",
    generatingAlt: "Cocinando magia...",
    recipeResult: "Tu Receta",
    servings: "Porciones",
    prepTime: "Tiempo de Preparación",
    cookTime: "Tiempo de Cocción",
    instructions: "Instrucciones",
    noIngredients: "¡Agrega algunos ingredientes para comenzar!",
    removeIngredient: "Quitar",
    selectLanguage: "Seleccionar Idioma",
    getStarted: "¡A Cocinar!",
    loading: "Preparando tu cocina...",
    clearAll: "Limpiar Todo",
    tryAgain: "Intentar de Nuevo",
    errorMessage: "Algo salió mal. Por favor, intenta de nuevo.",
    back: "← Atrás",
    downloadRecipe: "Descargar Receta",
  },
  fr: {
    appTitle: "Magie en Cuisine",
    welcomeBack: "Bienvenue, Chef ! 🍳",
    didYouKnow: "Le saviez-vous ?",
    ingredients: "Ingrédients",
    ingredientPlaceholder: "Entrez un ingrédient (ex : poulet, riz, tomate)",
    addIngredient: "Ajouter",
    search: "Chercher des Recettes",
    searchPlaceholder: "Rechercher une recette...",
    generateRecipe: "Générer une Recette ✨",
    generating: "Création de quelque chose de délicieux...",
    generatingAlt: "Cuisine magique en cours...",
    recipeResult: "Votre Recette",
    servings: "Portions",
    prepTime: "Temps de Préparation",
    cookTime: "Temps de Cuisson",
    instructions: "Instructions",
    noIngredients: "Ajoutez des ingrédients pour commencer !",
    removeIngredient: "Retirer",
    selectLanguage: "Choisir la Langue",
    getStarted: "Cuisinons !",
    loading: "Préparation de votre cuisine...",
    clearAll: "Tout Effacer",
    tryAgain: "Réessayer",
    errorMessage: "Quelque chose s'est mal passé. Veuillez réessayer.",
    back: "← Retour",
    downloadRecipe: "Télécharger la Recette",
  },
  de: {
    appTitle: "Küchenmagie",
    welcomeBack: "Willkommen zurück, Küchenchef! 🍳",
    didYouKnow: "Wussten Sie?",
    ingredients: "Zutaten",
    ingredientPlaceholder: "Zutat eingeben (z.B. Hähnchen, Reis, Tomate)",
    addIngredient: "Hinzufügen",
    search: "Rezepte Suchen",
    searchPlaceholder: "Nach einem Rezept suchen...",
    generateRecipe: "Rezept Generieren ✨",
    generating: "Etwas Leckeres wird kreiert...",
    generatingAlt: "Zauberküche...",
    recipeResult: "Ihr Rezept",
    servings: "Portionen",
    prepTime: "Vorbereitungszeit",
    cookTime: "Kochzeit",
    instructions: "Anweisungen",
    noIngredients: "Fügen Sie Zutaten hinzu, um zu beginnen!",
    removeIngredient: "Entfernen",
    selectLanguage: "Sprache Wählen",
    getStarted: "Los Kochen!",
    loading: "Küche wird vorbereitet...",
    clearAll: "Alles Löschen",
    tryAgain: "Erneut Versuchen",
    errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    back: "← Zurück",
    downloadRecipe: "Rezept Herunterladen",
  },
  zh: {
    appTitle: "厨房魔法",
    welcomeBack: "欢迎回来，大厨！🍳",
    didYouKnow: "你知道吗？",
    ingredients: "食材",
    ingredientPlaceholder: "输入食材（例如：鸡肉、米饭、番茄）",
    addIngredient: "添加",
    search: "搜索食谱",
    searchPlaceholder: "搜索食谱...",
    generateRecipe: "生成食谱 ✨",
    generating: "正在创造美味...",
    generatingAlt: "烹饪魔法中...",
    recipeResult: "你的食谱",
    servings: "份量",
    prepTime: "准备时间",
    cookTime: "烹饪时间",
    instructions: "步骤",
    noIngredients: "添加一些食材开始吧！",
    removeIngredient: "移除",
    selectLanguage: "选择语言",
    getStarted: "开始烹饪！",
    loading: "准备你的厨房...",
    clearAll: "清除全部",
    tryAgain: "重试",
    errorMessage: "出了点问题，请重试。",
    back: "← 返回",
    downloadRecipe: "下载食谱",
  }
};

const LANGUAGE_OPTIONS = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'zh', label: '🇨🇳 中文' },
];

// ─── Loading GIF URL ─────────────────────────────────────────────────────────
const LOADING_GIF = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3g4bHR1Ym9vYWlzaW54cHVibjR4MnFpNTFzaDdxZDlmc2hob2l3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dWacKLne4EowGUaVUw/giphy.gif";

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  // Global
  container: {
    minHeight: '100vh',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#e8e8e8',
    position: 'relative',
    overflow: 'hidden',
  },
  // Loading Page (Page 1)
  loadingPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    textAlign: 'center',
  },
  loadingGif: {
    width: '280px',
    height: '280px',
    borderRadius: '20px',
    objectFit: 'cover',
    marginBottom: '30px',
    boxShadow: '0 10px 40px rgba(233, 69, 96, 0.3)',
  },
  loadingTextContainer: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #e94560, #f5a623, #e94560)',
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'shimmer 2s ease-in-out infinite',
  },
  // Language Selection
  languageSection: {
    marginTop: '40px',
    width: '100%',
    maxWidth: '360px',
  },
  languageLabel: {
    fontSize: '14px',
    color: '#a0a0b8',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '600',
  },
  languageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
  },
  languageBtn: (isSelected) => ({
    padding: '12px 16px',
    borderRadius: '12px',
    border: isSelected ? '2px solid #e94560' : '2px solid rgba(255,255,255,0.1)',
    background: isSelected ? 'rgba(233, 69, 96, 0.15)' : 'rgba(255,255,255,0.05)',
    color: isSelected ? '#e94560' : '#c8c8d8',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  }),
  getStartedBtn: {
    marginTop: '30px',
    padding: '16px 48px',
    borderRadius: '50px',
    border: 'none',
    background: 'linear-gradient(135deg, #e94560, #c23152)',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(233, 69, 96, 0.4)',
    transition: 'all 0.3s ease',
    letterSpacing: '1px',
  },
  // Main Page (Page 2)
  mainPage: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '280px',
    background: 'rgba(0,0,0,0.2)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  sidebarBubble: {
    background: 'rgba(233, 69, 96, 0.1)',
    border: '1px solid rgba(233, 69, 96, 0.25)',
    borderRadius: '16px',
    padding: '20px 16px',
    marginTop: '20px',
    width: '100%',
    position: 'relative',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  },
  sidebarBubbleTitle: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#e94560',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  sidebarBubbleFact: {
    fontSize: '13px',
    color: '#c8c8d8',
    lineHeight: '1.6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  welcomeText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#f5a623',
    textAlign: 'center',
    transition: 'opacity 0.5s ease',
  },
  mainContent: {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto',
    maxHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #e94560, #f5a623)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#c8c8d8',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  // Ingredients Section (NO images/icons)
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#e0e0e8',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
  },
  textInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#e8e8e8',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  addBtn: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #e94560, #c23152)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  ingredientTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  ingredientTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    background: 'rgba(233, 69, 96, 0.12)',
    border: '1px solid rgba(233, 69, 96, 0.3)',
    color: '#e8c8c8',
    fontSize: '13px',
    fontWeight: '600',
  },
  removeTagBtn: {
    background: 'none',
    border: 'none',
    color: '#e94560',
    cursor: 'pointer',
    padding: '0',
    fontSize: '16px',
    lineHeight: 1,
  },
  // Search Section (NO images/icons)
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#e8e8e8',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  // Generate Button
  generateBtn: {
    width: '100%',
    padding: '16px 32px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #e94560, #c23152)',
    color: '#fff',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(233, 69, 96, 0.35)',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px',
    marginTop: '8px',
  },
  generateBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  // Recipe Card (improved layout — narrower, rounded, polished)
  recipeCard: {
    maxWidth: '560px',
    margin: '24px auto 0',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  recipeCardHeader: {
    background: 'linear-gradient(135deg, rgba(233,69,96,0.15), rgba(245,166,35,0.1))',
    padding: '24px 28px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  recipeTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px',
  },
  recipeMeta: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  recipeMetaItem: {
    fontSize: '13px',
    color: '#a0a0b8',
    fontWeight: '600',
  },
  recipeMetaValue: {
    color: '#f5a623',
    fontWeight: '700',
  },
  recipeCardBody: {
    padding: '24px 28px',
  },
  recipeIngredientsTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#e94560',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  recipeIngredientItem: {
    fontSize: '14px',
    color: '#c8c8d8',
    padding: '4px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    lineHeight: '1.5',
  },
  recipeInstructionsTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#e94560',
    marginTop: '20px',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  recipeInstructionStep: {
    fontSize: '14px',
    color: '#c8c8d8',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    lineHeight: '1.6',
  },
  stepNumber: {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(233,69,96,0.2)',
    color: '#e94560',
    textAlign: 'center',
    lineHeight: '24px',
    fontSize: '12px',
    fontWeight: '700',
    marginRight: '10px',
  },
  // Error & loading states
  generatingContainer: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  generatingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(233,69,96,0.2)',
    borderTopColor: '#e94560',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 16px',
  },
  errorBox: {
    background: 'rgba(233,69,96,0.1)',
    border: '1px solid rgba(233,69,96,0.3)',
    borderRadius: '12px',
    padding: '16px 20px',
    textAlign: 'center',
    color: '#e8a0a0',
    fontSize: '14px',
  },
  clearBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#a0a0b8',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    marginLeft: '12px',
  },
  // Mobile Responsive
  '@media (max-width: 768px)': {
    mainPage: { flexDirection: 'column' },
    sidebar: { width: '100%', borderRight: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    mainContent: { padding: '20px' },
  },
};

// ─── CSS Keyframes (injected) ────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById('kitchen-magic-styles')) return;
  const style = document.createElement('style');
  style.id = 'kitchen-magic-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes textCycle {
      0%, 40% { opacity: 1; transform: translateY(0); }
      45%, 55% { opacity: 0; transform: translateY(-10px); }
      60%, 100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes bubblePop {
      0% { opacity: 0; transform: scale(0.8) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    
    @keyframes bubbleFade {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.95) translateY(-5px); }
    }
    
    .km-input:focus {
      border-color: rgba(233, 69, 96, 0.5) !important;
      box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.1);
    }
    
    .km-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(233, 69, 96, 0.45);
    }
    
    .km-lang-btn:hover {
      background: rgba(233, 69, 96, 0.1) !important;
      border-color: rgba(233, 69, 96, 0.4) !important;
    }
    
    .km-tag:hover .km-tag-remove {
      color: #ff6b7f !important;
    }
    
    @media (max-width: 768px) {
      .km-main-page { flex-direction: column !important; }
      .km-sidebar { 
        width: 100% !important; 
        border-right: none !important; 
        border-bottom: 1px solid rgba(255,255,255,0.06) !important; 
        padding: 16px !important;
      }
      .km-main-content { padding: 20px !important; }
      .km-recipe-card { max-width: 100% !important; }
    }
    
    @media (max-width: 480px) {
      .km-main-content { padding: 14px !important; }
      .km-header-title { font-size: 22px !important; }
    }
  `;
  document.head.appendChild(style);
};

// ─── Did You Know Sidebar Component ─────────────────────────────────────────
const DidYouKnowSidebar = ({ t }) => {
  const [phase, setPhase] = useState('welcome'); // 'welcome' | 'bubble' | 'fact' | 'fadeout'
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Cycle: welcome (2s) -> bubble appears (0.5s) -> fact shows (3s) -> fadeout (0.5s) -> repeat
    const cycle = () => {
      // Phase 1: Show welcome
      setPhase('welcome');
      setFactVisible(false);

      timerRef.current = setTimeout(() => {
        // Phase 2: Show bubble
        setPhase('bubble');

        timerRef.current = setTimeout(() => {
          // Phase 3: Show fact
          setFactVisible(true);

          timerRef.current = setTimeout(() => {
            // Phase 4: Fade out
            setPhase('fadeout');

            timerRef.current = setTimeout(() => {
              // Next fact, restart cycle
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
    <div style={styles.sidebar} className="km-sidebar">
      {/* Welcome Text */}
      <div style={{
        ...styles.welcomeText,
        opacity: phase === 'welcome' ? 1 : 0.4,
        transition: 'opacity 0.5s ease',
      }}>
        {t.welcomeBack}
      </div>

      {/* Did You Know Bubble */}
      {(phase === 'bubble' || phase === 'fact' || phase === 'fadeout') && (
        <div style={{
          ...styles.sidebarBubble,
          animation: phase === 'fadeout' ? 'bubbleFade 0.6s ease forwards' : 'bubblePop 0.5s ease forwards',
        }}>
          <div style={styles.sidebarBubbleTitle}>
            💡 {t.didYouKnow}
          </div>
          {factVisible && (
            <div style={{
              ...styles.sidebarBubbleFact,
              animation: 'fadeInUp 0.4s ease',
            }}>
              {FOOD_FACTS[factIndex]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Loading Page Component (Page 1) ─────────────────────────────────────────
const LoadingPage = ({ language, setLanguage, onStart, t }) => {
  const [textIndex, setTextIndex] = useState(0);
  const loadingTexts = [t.loading, t.generating, t.generatingAlt];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % loadingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [t]);

  return (
    <div style={styles.loadingPage}>
      {/* Loading GIF instead of logo */}
      <img
        src={LOADING_GIF}
        alt="Kitchen Magic Loading"
        style={styles.loadingGif}
      />

      {/* Animated alternating text */}
      <div style={styles.loadingTextContainer}>
        <div
          key={textIndex}
          style={{
            ...styles.loadingText,
            animation: 'fadeInUp 0.5s ease',
          }}
        >
          {loadingTexts[textIndex]}
        </div>
      </div>

      {/* Language Selection */}
      <div style={styles.languageSection}>
        <div style={styles.languageLabel}>{t.selectLanguage}</div>
        <div style={styles.languageGrid}>
          {LANGUAGE_OPTIONS.map(lang => (
            <button
              key={lang.code}
              className="km-lang-btn"
              style={styles.languageBtn(language === lang.code)}
              onClick={() => setLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Get Started Button */}
      <button
        className="km-btn"
        style={styles.getStartedBtn}
        onClick={onStart}
      >
        {t.getStarted}
      </button>
    </div>
  );
};

// ─── Recipe Card Component (improved layout) ─────────────────────────────────
const RecipeCard = ({ recipe, t }) => {
  if (!recipe) return null;

  return (
    <div style={styles.recipeCard} className="km-recipe-card">
      <div style={styles.recipeCardHeader}>
        <div style={styles.recipeTitle}>{recipe.title || t.recipeResult}</div>
        <div style={styles.recipeMeta}>
          {recipe.servings && (
            <span style={styles.recipeMetaItem}>
              {t.servings}: <span style={styles.recipeMetaValue}>{recipe.servings}</span>
            </span>
          )}
          {recipe.prepTime && (
            <span style={styles.recipeMetaItem}>
              {t.prepTime}: <span style={styles.recipeMetaValue}>{recipe.prepTime}</span>
            </span>
          )}
          {recipe.cookTime && (
            <span style={styles.recipeMetaItem}>
              {t.cookTime}: <span style={styles.recipeMetaValue}>{recipe.cookTime}</span>
            </span>
          )}
        </div>
      </div>
      <div style={styles.recipeCardBody}>
        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <>
            <div style={styles.recipeIngredientsTitle}>{t.ingredients}</div>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} style={styles.recipeIngredientItem}>• {ing}</div>
            ))}
          </>
        )}
        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <>
            <div style={styles.recipeInstructionsTitle}>{t.instructions}</div>
            {recipe.instructions.map((step, i) => (
              <div key={i} style={styles.recipeInstructionStep}>
                <span style={styles.stepNumber}>{i + 1}</span>
                {step}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main RecipeGenerator Component ──────────────────────────────────────────
const RecipeGenerator = () => {
  const [page, setPage] = useState('loading'); // 'loading' | 'main'
  const [language, setLanguage] = useState('en');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    injectStyles();
  }, []);

  // Add ingredient
  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients(prev => [...prev, trimmed]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (ing) => {
    setIngredients(prev => prev.filter(i => i !== ing));
  };

  const clearIngredients = () => {
    setIngredients([]);
  };

  // Recipe generation (verified working flow)
  const generateRecipe = async () => {
    if (ingredients.length === 0 && !searchQuery.trim()) return;

    setIsGenerating(true);
    setError(null);
    setRecipe(null);

    try {
      const prompt = searchQuery.trim()
        ? `Generate a detailed recipe for: ${searchQuery}. Language: ${language}`
        : `Generate a detailed recipe using these ingredients: ${ingredients.join(', ')}. Language: ${language}`;

      // Using Anthropic API via serverless proxy
      const response = await fetch('/.netlify/functions/anthropic-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: `${prompt}

Please respond ONLY with valid JSON in this exact format (no markdown, no backticks, no extra text):
{
  "title": "Recipe Name",
  "servings": "4",
  "prepTime": "15 min",
  "cookTime": "30 min",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["Step 1 description", "Step 2 description"]
}`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      // Extract text content from response
      let textContent = '';
      if (data.content && Array.isArray(data.content)) {
        textContent = data.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('');
      } else if (typeof data.content === 'string') {
        textContent = data.content;
      } else if (data.text) {
        textContent = data.text;
      }

      if (!textContent) {
        throw new Error('No content in API response');
      }

      // Clean and parse JSON
      const cleaned = textContent.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Validate recipe structure
      if (!parsed.title || !parsed.ingredients || !parsed.instructions) {
        throw new Error('Invalid recipe format returned');
      }

      setRecipe(parsed);
    } catch (err) {
      console.error('Recipe generation error:', err);
      setError(t.errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  // ─── Render Loading Page (Page 1) ──────────────────────────────────────
  if (page === 'loading') {
    return (
      <div style={styles.container}>
        <LoadingPage
          language={language}
          setLanguage={setLanguage}
          onStart={() => setPage('main')}
          t={t}
        />
      </div>
    );
  }

  // ─── Render Main Page (Page 2) ─────────────────────────────────────────
  return (
    <div style={styles.container}>
      <div style={styles.mainPage} className="km-main-page">
        {/* Sidebar with Did You Know */}
        <DidYouKnowSidebar t={t} />

        {/* Main Content */}
        <div style={styles.mainContent} className="km-main-content">
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.title} className="km-header-title">{t.appTitle}</div>
            <button
              style={styles.backBtn}
              onClick={() => { setPage('loading'); setRecipe(null); setError(null); }}
            >
              {t.back}
            </button>
          </div>

          {/* Ingredients Section — TEXT ONLY, no images */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>{t.ingredients}</div>
            <div style={styles.inputRow}>
              <input
                type="text"
                className="km-input"
                style={styles.textInput}
                placeholder={t.ingredientPlaceholder}
                value={ingredientInput}
                onChange={e => setIngredientInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                style={styles.addBtn}
                onClick={addIngredient}
              >
                {t.addIngredient}
              </button>
            </div>
            {ingredients.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={styles.ingredientTags}>
                  {ingredients.map((ing, i) => (
                    <span key={i} style={styles.ingredientTag} className="km-tag">
                      {ing}
                      <button
                        className="km-tag-remove"
                        style={styles.removeTagBtn}
                        onClick={() => removeIngredient(ing)}
                        title={t.removeIngredient}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button style={styles.clearBtn} onClick={clearIngredients}>
                  {t.clearAll}
                </button>
              </div>
            )}
            {ingredients.length === 0 && (
              <div style={{ fontSize: '13px', color: '#808098', fontStyle: 'italic' }}>
                {t.noIngredients}
              </div>
            )}
          </div>

          {/* Search Section — TEXT ONLY, no images */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>{t.search}</div>
            <input
              type="text"
              className="km-input"
              style={styles.searchInput}
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <button
            className="km-btn"
            style={{
              ...styles.generateBtn,
              ...(isGenerating || (ingredients.length === 0 && !searchQuery.trim()) ? styles.generateBtnDisabled : {}),
            }}
            onClick={generateRecipe}
            disabled={isGenerating || (ingredients.length === 0 && !searchQuery.trim())}
          >
            {isGenerating ? '⏳ ' + t.generating : t.generateRecipe}
          </button>

          {/* Generating Spinner */}
          {isGenerating && (
            <div style={styles.generatingContainer}>
              <div style={styles.generatingSpinner} />
              <div style={{ color: '#a0a0b8', fontSize: '14px' }}>{t.generating}</div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ ...styles.errorBox, marginTop: '16px' }}>
              {error}
              <button
                style={{ ...styles.addBtn, marginLeft: '12px', fontSize: '12px', padding: '6px 14px' }}
                onClick={generateRecipe}
              >
                {t.tryAgain}
              </button>
            </div>
          )}

          {/* Recipe Result */}
          {recipe && <RecipeCard recipe={recipe} t={t} />}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
