// ============================================================================
// KITCHEN MAGIC - RecipeGenerator.js CHANGES GUIDE
// ============================================================================
// This file contains ALL the code changes to apply to your original
// RecipeGenerator.js. Follow the numbered instructions below.
//
// CHANGES:
// 1. "Did You Know?" sidebar on Page 2
// 2. Remove ingredient/search image icons
// 3. Verify recipe generation (JSON parsing hardened)
// 4. Improved recipe card layout (narrower, rounded, better spacing)
// 5. Language selection on Page 1
// 6. Loading GIF + animated text instead of logo
// ============================================================================

// ============================================================================
// CHANGE 1: ADD THESE CONSTANTS AFTER THE CHEF_IMG / LetsEatLogo DECLARATIONS
// (Insert right before "export default function RecipeGenerator()")
// ============================================================================

// ─── Food Facts for "Did You Know?" Sidebar ─────────────────────────────────
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

// ─── Language System ─────────────────────────────────────────────────────────
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
    welcomeBack: (name) => `Welcome back, ${name || 'Chef'}! What are we cooking today?`,
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
    welcomeBack: (name) => `¡Bienvenido de nuevo, ${name || 'Chef'}! ¿Qué cocinamos hoy?`,
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
    welcomeBack: (name) => `Bienvenue, ${name || 'Chef'} ! Que cuisinons-nous aujourd\'hui ?`,
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
    welcomeBack: (name) => `Willkommen zurück, ${name || 'Chef'}! Was kochen wir heute?`,
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
    welcomeBack: (name) => `欢迎回来，${name || '大厨'}！今天我们做什么？`,
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

// ─── Did You Know Sidebar Component ─────────────────────────────────────────
function DidYouKnowSidebar({ t }) {
  const [phase, setPhase] = React.useState('welcome');
  const [factIndex, setFactIndex] = React.useState(0);
  const [factVisible, setFactVisible] = React.useState(false);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
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
    <div style={{
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
          animation: phase === 'fadeout'
            ? 'fadeOut 0.6s ease forwards'
            : 'fadeUp 0.5s ease forwards',
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
// CHANGE 2: ADD THIS STATE INSIDE RecipeGenerator COMPONENT (near other useState calls)
// ============================================================================
// const [language, setLanguage] = useState('en');

// AND this derived value right after:
// const t = TRANSLATIONS[language] || TRANSLATIONS.en;


// ============================================================================
// CHANGE 3: ADD THESE KEYFRAMES TO globalStyles (inside the template literal)
// ============================================================================
/*
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(-8px); }
    }

    @keyframes textCycle {
      0%, 40% { opacity: 1; }
      50% { opacity: 0; }
      60%, 100% { opacity: 1; }
    }

    @media (max-width: 900px) {
      .did-you-know-sidebar { display: none !important; }
    }
*/


// ============================================================================
// CHANGE 4: REPLACE THE LOADING PAGE (PAGE 1) LOGO + WELCOME TEXT
// Replace the Logo and "Welcome, Chef!" section with this:
// ============================================================================
/*
  FIND THIS in Page 1:
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', animation: 'fadeUp 0.7s ease-out' }}>
      <LetsEatLogo size={360} />
    </div>

  REPLACE WITH:
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

  AND replace the static "Welcome, Chef!" h2 text with: {t.welcomeChef}
  AND replace "Tell us your name..." p text with: {t.tellUs}
  AND replace "Your name..." placeholder with: {t.yourName}
  AND replace "Let's Cook! 🍳" button text with: {t.letsCook}
*/


// ============================================================================
// CHANGE 5: ADD LANGUAGE SELECTOR ON PAGE 1
// Insert BEFORE the Terms & Conditions box on Page 1:
// ============================================================================
/*
    {/* Language Selector * /}
    <div style={{
      marginBottom: '24px', textAlign: 'left',
      background: 'var(--cream)', borderRadius: '12px',
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
              border: language === lang.code
                ? '2px solid var(--amber)'
                : '1.5px solid var(--border)',
              background: language === lang.code
                ? 'rgba(243,146,0,0.12)' : 'white',
              color: language === lang.code
                ? 'var(--brown-warm)' : 'var(--text-mid)',
              fontSize: '13px', fontWeight: '700',
              fontFamily: "'Nunito', sans-serif",
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
*/


// ============================================================================
// CHANGE 6: ADD DID YOU KNOW SIDEBAR TO PAGE 2
// Insert inside the Page 2 return, right after the opening background blobs:
// ============================================================================
/*
    {/* Did You Know Sidebar * /}
    <DidYouKnowSidebar t={t} />
*/


// ============================================================================
// CHANGE 7: UPDATE PAGE 2 WELCOME TEXT TO USE TRANSLATIONS
// ============================================================================
/*
  FIND: Welcome back, <strong ...>{userName || 'Chef'}</strong>! What are we cooking today?
  REPLACE WITH: <span dangerouslySetInnerHTML={{ __html: t.welcomeBack(userName) }} />

  Or more simply just replace the text content with: {t.welcomeBack(userName)}
*/


// ============================================================================
// CHANGE 8: UPDATE LOADING STATE TO USE GIF + ANIMATED TEXT
// Replace the loading section (the one with cookBounce animation) with:
// ============================================================================
/*
    {loading && (
      <div style={{
        textAlign: 'center', padding: '60px 20px',
        background: 'transparent', borderRadius: '20px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <img
            src={LOADING_GIF}
            alt="Cooking..."
            style={{
              width: '200px', height: '200px', borderRadius: '16px',
              objectFit: 'cover',
              boxShadow: '0 8px 30px rgba(243,146,0,0.3)',
            }}
          />
        </div>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '22px', fontWeight: '700',
          color: 'var(--brown-dark)', marginBottom: '8px',
          animation: 'textCycle 3s ease-in-out infinite',
        }}>{t.cookingUp}</p>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', fontWeight: '500' }}>
          {t.hangTight}
        </p>
      </div>
    )}
*/


// ============================================================================
// CHANGE 9: IMPROVE RECIPE CARD LAYOUT
// In the recipe card rendering, change these styles:
// ============================================================================
/*
  FIND the recipe card wrapper:
    style={{ animationDelay: ..., background: 'transparent', borderRadius: '20px', padding: '32px', marginBottom: '22px' }}

  REPLACE WITH:
    style={{
      animationDelay: `${index * 0.1}s`,
      background: 'rgba(255,255,255,0.5)',
      border: '1px solid rgba(93,42,24,0.1)',
      borderRadius: '24px',
      padding: '32px 28px',
      marginBottom: '24px',
      maxWidth: '720px',
      margin: '0 auto 24px',
      backdropFilter: 'blur(6px)',
      boxShadow: '0 4px 20px rgba(93,42,24,0.08)',
    }}
*/


// ============================================================================
// CHANGE 10: REMOVE IMAGE ICONS FROM INGREDIENT CHIPS IN RECIPE CARDS
// In the ingredients grid inside recipe cards:
// ============================================================================
/*
  FIND:
    <span style={{ fontSize: '16px' }}>{getIngredientIcon(ing)}</span> {ing}

  REPLACE WITH:
    <span style={{ color: 'var(--brown-warm)', fontSize: '14px' }}>•</span> {ing}
*/


// ============================================================================
// CHANGE 11: REMOVE IMAGE ICON FROM INPUT AUTOCOMPLETE
// In the autocomplete dropdown items:
// ============================================================================
/*
  FIND:
    {getIngredientIcon(item)} {item}

  REPLACE WITH:
    {item}
*/


// ============================================================================
// CHANGE 12: HARDEN RECIPE GENERATION JSON PARSING
// The existing generateRecipes function already has good JSON parsing.
// Add this additional fallback inside the catch block:
// ============================================================================
/*
  After the existing JSON.parse attempts, add before the final throw:

  // Third attempt: try to extract individual recipe objects
  try {
    const recipePattern = /\{[^{}]*"name"[^{}]*"instructions"[^{}]*\}/gs;
    const matches = text.match(recipePattern);
    if (matches && matches.length > 0) {
      generatedRecipes = matches.map(m => JSON.parse(m));
    }
  } catch (thirdError) {
    // Fall through to the throw below
  }
*/
