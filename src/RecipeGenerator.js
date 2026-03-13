import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// CONSTANTS & ASSETS (Change 1)
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
    termsTitle: 'Terms & Conditions',
    welcomeBack: (name) => `Welcome back, <strong>${name || 'Chef'}</strong>! What are we cooking today?`,
    whatIngredients: 'What ingredients do you have?',
    scanPhoto: '📷 Scan Ingredients from Photo',
    startTyping: 'Start typing an ingredient...',
    add: 'Add',
    generateRecipes: '✨  Generate Recipes',
    generating: '⏳  Generating Recipes...',
    cookingUp: 'Cooking up something delicious...',
    hangTight: 'Hang tight while we find the perfect recipes for you 🍳',
    curatedRecipes: 'Your Curated Recipes',
    found: 'found',
    ingredients: 'Ingredients',
    viewInstructions: 'View Cooking Instructions',
    hideInstructions: 'Hide Cooking Instructions',
    home: '← Home',
    didYouKnow: '💡 Did You Know?',
  },
  es: {
    welcomeChef: '¡Bienvenido, Chef!',
    tellUs: 'Dinos tu nombre para empezar',
    yourName: 'Tu nombre...',
    letsCook: '¡A Cocinar! 🍳',
    selectLang: 'SELECCIONAR IDIOMA',
    termsTitle: 'Términos y Condiciones',
    welcomeBack: (name) => `¡Bienvenido de nuevo, <strong>${name || 'Chef'}</strong>! ¿Qué cocinamos hoy?`,
    whatIngredients: '¿Qué ingredientes tienes?',
    scanPhoto: '📷 Escanear Ingredientes de Foto',
    startTyping: 'Escribe un ingrediente...',
    add: 'Agregar',
    generateRecipes: '✨  Generar Recetas',
    generating: '⏳  Generando Recetas...',
    cookingUp: 'Preparando algo delicioso...',
    hangTight: 'Espera mientras encontramos las recetas perfectas 🍳',
    curatedRecipes: 'Tus Recetas Seleccionadas',
    found: 'encontradas',
    ingredients: 'Ingredientes',
    viewInstructions: 'Ver Instrucciones',
    hideInstructions: 'Ocultar Instrucciones',
    home: '← Inicio',
    didYouKnow: '💡 ¿Sabías que...?',
  },
  fr: {
    welcomeChef: 'Bienvenue, Chef !',
    tellUs: 'Dites-nous votre nom pour commencer',
    yourName: 'Votre nom...',
    letsCook: 'Cuisinons ! 🍳',
    selectLang: 'CHOISIR LA LANGUE',
    termsTitle: 'Conditions Générales',
    welcomeBack: (name) => `Bienvenue, <strong>${name || 'Chef'}</strong> ! Que cuisinons-nous aujourd\'hui ?`,
    whatIngredients: 'Quels ingrédients avez-vous ?',
    scanPhoto: '📷 Scanner les Ingrédients',
    startTyping: 'Tapez un ingrédient...',
    add: 'Ajouter',
    generateRecipes: '✨  Générer des Recettes',
    generating: '⏳  Génération en cours...',
    cookingUp: 'Préparation de quelque chose de délicieux...',
    hangTight: 'Patientez pendant que nous trouvons les recettes parfaites 🍳',
    curatedRecipes: 'Vos Recettes',
    found: 'trouvées',
    ingredients: 'Ingrédients',
    viewInstructions: 'Voir les Instructions',
    hideInstructions: 'Masquer les Instructions',
    home: '← Accueil',
    didYouKnow: '💡 Le saviez-vous ?',
  },
  de: {
    welcomeChef: 'Willkommen, Küchenchef!',
    tellUs: 'Sag uns deinen Namen',
    yourName: 'Dein Name...',
    letsCook: 'Los Kochen! 🍳',
    selectLang: 'SPRACHE WÄHLEN',
    termsTitle: 'Nutzungsbedingungen',
    welcomeBack: (name) => `Willkommen zurück, <strong>${name || 'Chef'}</strong>! Was kochen wir heute?`,
    whatIngredients: 'Welche Zutaten hast du?',
    scanPhoto: '📷 Zutaten vom Foto scannen',
    startTyping: 'Zutat eingeben...',
    add: 'Hinzufügen',
    generateRecipes: '✨  Rezepte Generieren',
    generating: '⏳  Rezepte werden generiert...',
    cookingUp: 'Etwas Leckeres wird zubereitet...',
    hangTight: 'Einen Moment bitte, wir finden die perfekten Rezepte 🍳',
    curatedRecipes: 'Deine Rezepte',
    found: 'gefunden',
    ingredients: 'Zutaten',
    viewInstructions: 'Anweisungen anzeigen',
    hideInstructions: 'Anweisungen ausblenden',
    home: '← Startseite',
    didYouKnow: '💡 Wussten Sie?',
  },
  zh: {
    welcomeChef: '欢迎，大厨！',
    tellUs: '请输入您的名字开始',
    yourName: '您的名字...',
    letsCook: '开始烹饪！🍳',
    selectLang: '选择语言',
    termsTitle: '条款与条件',
    welcomeBack: (name) => `欢迎回来，<strong>${name || '大厨'}</strong>！今天我们做什么？`,
    whatIngredients: '你有哪些食材？',
    scanPhoto: '📷 从照片扫描食材',
    startTyping: '输入食材...',
    add: '添加',
    generateRecipes: '✨  生成食谱',
    generating: '⏳  正在生成食谱...',
    cookingUp: '正在烹制美味佳肴...',
    hangTight: '请稍候，我们正在为您寻找完美的食谱 🍳',
    curatedRecipes: '为您精选的食谱',
    found: '个',
    ingredients: '食材',
    viewInstructions: '查看烹饪步骤',
    hideInstructions: '隐藏烹饪步骤',
    home: '← 首页',
    didYouKnow: '💡 你知道吗？',
  }
};

// ============================================================================
// SIDEBAR COMPONENT (Change 1 & 6)
// ============================================================================
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
          }, 4000);
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
          <div style={{
            fontSize: '11px', fontWeight: '800', color: 'var(--brown-warm)',
            textTransform: 'uppercase', letterSpacing: '1.5px',
            marginBottom: '8px', textAlign: 'center',
          }}>
            {t.didYouKnow}
          </div>
          {factVisible && (
            <div style={{
              fontSize: '12.5px', color: 'var(--text-mid)', lineHeight: '1.65',
              textAlign: 'center', fontStyle: 'italic',
              animation: 'fadeUp 0.4s ease',
            }}>
              {FOOD_FACTS[factIndex]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT (The Fix for Netlify Error)
// ============================================================================
export default function RecipeGenerator() {
  // --- State (Change 2)
  const [page, setPage] = useState(1);
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // --- Logic for JSON Parsing (Change 12)
  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Mocking the generation logic as per instructions
      const text = await performGeneration(); 
      let generatedRecipes = [];
      
      try {
        generatedRecipes = JSON.parse(text);
      } catch (e) {
        // Fallback extract logic
        const recipePattern = /\{[^{}]*"name"[^{}]*"instructions"[^{}]*\}/gs;
        const matches = text.match(recipePattern);
        if (matches && matches.length > 0) {
          generatedRecipes = matches.map(m => JSON.parse(m));
        } else {
          throw new Error("Could not parse recipes");
        }
      }
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: '100vh', background: 'var(--cream-bg)' }}>
      {/* Change 3: Global Styles Keyframes */}
      <style>{`
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-8px); } }
        @keyframes textCycle { 0%, 40% { opacity: 1; } 50% { opacity: 0; } 60%, 100% { opacity: 1; } }
        @media (max-width: 900px) { .did-you-know-sidebar { display: none !important; } }
      `}</style>

      {page === 1 ? (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          {/* Change 4: Logo Replacement with GIF */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', animation: 'fadeUp 0.7s ease-out' }}>
            <img
              src={LOADING_GIF}
              alt="Kitchen Magic Loading"
              style={{
                width: '280px', height: '280px', borderRadius: '20px',
                objectFit: 'cover',
                boxShadow: '0 10px 40px rgba(243,146,0,0.35)',
                filter: 'drop-shadow(0 0 18px rgba(243,146,0,0.4))',
              }}
            />
          </div>

          <h2 style={{ color: 'var(--brown-dark)' }}>{t.welcomeChef}</h2>
          <p style={{ color: 'var(--text-mid)', marginBottom: '24px' }}>{t.tellUs}</p>

          <input 
            type="text" 
            placeholder={t.yourName} 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '20px' }}
          />

          {/* Change 5: Language Selector */}
          <div style={{
            marginBottom: '24px', textAlign: 'left',
            background: 'white', borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid rgba(243,146,0,0.3)',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: '800', color: 'var(--brown-mid)',
              textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px',
            }}>
              {t.selectLang}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    padding: '8px 14px', borderRadius: '8px',
                    border: language === lang.code ? '2px solid orange' : '1.5px solid #eee',
                    background: language === lang.code ? 'rgba(243,146,0,0.12)' : 'white',
                    color: language === lang.code ? 'brown' : '#666',
                    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setPage(2)} 
            style={{ width: '100%', padding: '14px', background: 'orange', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}
          >
            {t.letsCook}
          </button>
        </div>
      ) : (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
          {/* Change 6: Sidebar on Page 2 */}
          <DidYouKnowSidebar t={t} />

          {/* Change 7: Translated Welcome Text */}
          <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span dangerouslySetInnerHTML={{ __html: t.welcomeBack(userName) }} />
          </h2>

          {/* Change 8: Loading State with GIF */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ marginBottom: '24px' }}>
                <img src={LOADING_GIF} alt="Cooking..." style={{ width: '200px', height: '200px', borderRadius: '16px', objectFit: 'cover' }} />
              </div>
              <p style={{ fontSize: '22px', fontWeight: '700', animation: 'textCycle 3s infinite' }}>{t.cookingUp}</p>
              <p style={{ color: '#888' }}>{t.hangTight}</p>
            </div>
          )}

          {/* Change 9 & 10: Recipe Cards & Removed Icons */}
          {!loading && recipes.map((recipe, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(93,42,24,0.1)',
              borderRadius: '24px', padding: '32px 28px',
              marginBottom: '24px', maxWidth: '720px', margin: '0 auto 24px',
              backdropFilter: 'blur(6px)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}>
              <h3>{recipe.name}</h3>
              <div style={{ marginTop: '12px' }}>
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} style={{ marginBottom: '4px' }}>
                    <span style={{ color: 'orange', marginRight: '8px' }}>•</span> {ing}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button onClick={() => setPage(1)} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
            {t.home}
          </button>
        </div>
      )}
    </div>
  );
}

// Dummy helper for example
async function performGeneration() {
  return JSON.stringify([{ name: "Example Recipe", ingredients: ["Flour", "Water"] }]);
}
