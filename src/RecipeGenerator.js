import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Download } from "lucide-react";

// =====================================
// Inline logo (placeholder) – keep or replace with your SVG
// =====================================
const CHEFIMG = ""; // keep your existing base64 or import

const LetsEatLogo = ({ size = 250 }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
    <img
      src={CHEFIMG}
      alt="Itadakimasu - Lets Eat Chef Logo"
      style={{
        maxWidth: size,
        width: "100%",
        height: "auto",
        opacity: 1,
        transition: "opacity 0.3s ease",
        filter:
          "drop-shadow(0 0 18px rgba(243,146,0,0.55)) drop-shadow(0 0 6px rgba(160,69,31,0.35))",
      }}
    />
  </div>
);

// =====================================
// Global styles (same as your file)
// =====================================
const globalStyles = `
  :root {
    --amber: #F39200;
    --brown: #A0451F;
    --brown-dark: #5D2A18;
    --brown-warm: #C8862A;
    --cream: #FFF8EE;
    --cream-dark: #F0E3CC;
    --border: rgba(130,92,57,0.25);
    --text-dark: #3E2A20;
    --text-mid: #6D5240;
    --text-light: #9B7F6B;
    --shadow-warm: rgba(93,42,24,0.28);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pageEnter {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse-amber {
    0% { box-shadow: 0 0 0 0 rgba(243,146,0,0.55); }
    70% { box-shadow: 0 0 0 14px rgba(243,146,0,0); }
    100% { box-shadow: 0 0 0 0 rgba(243,146,0,0); }
  }

  .page-enter {
    animation: pageEnter 0.45s ease-out;
  }

  .card-enter {
    animation: fadeUp 0.5s ease-out backwards;
  }

  .recipe-card {
    animation: fadeUp 0.5s ease-out backwards;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .recipe-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 24px 60px var(--shadow-warm);
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--cream-dark);
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--brown-warm);
    border-radius: 3px;
  }

  @media (max-width: 600px) {
    .main-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

// =====================================
// Main Component
// =====================================
export default function RecipeGenerator() {
  // Core state
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("en");

  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const [recipes, setRecipes] = useState([]);
  const [expandedRecipes, setExpandedRecipes] = useState({});
  const [loading, setLoading] = useState(false);

  const [showTerms, setShowTerms] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const fileInputRef = useRef(null);

  // Facts sidebar
  const [currentFact, setCurrentFact] = useState("");
  const [showFactBubble, setShowFactBubble] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);

  const COOKING_FACTS = [
    "Adding salt early helps build flavor in soups and sauces.",
    "Let meat rest after cooking so the juices redistribute.",
    "Pasta water should taste as salty as the sea.",
    "Searing meat does not lock in juices, but it adds flavor.",
    "Room temperature eggs whip up with more volume.",
  ];

  // Loading messages for GIF screen
  const loadingMessages = [
    "Slicing and dicing your ideas...",
    "Simmering the perfect recipes...",
    "Seasoning with a pinch of creativity...",
    "Plating something tasty just for you...",
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Common ingredients (autocomplete)
  const commonIngredients = [
    "chicken breast",
    "chicken thighs",
    "chicken wings",
    "ground beef",
    "pork chops",
    "salmon",
    "shrimp",
    "tilapia",
    "eggs",
    "rice",
    "pasta",
    "spaghetti",
    "penne",
    "tomatoes",
    "potatoes",
    "onions",
    "garlic",
    "bell peppers",
    "broccoli",
    "carrots",
    "spinach",
    "mushrooms",
    "zucchini",
    "cheese",
    "mozzarella",
    "cheddar",
    "parmesan",
    "milk",
    "butter",
    "flour",
    "bread",
    "tortillas",
    "beans",
    "chickpeas",
    "lentils",
    "corn",
    "peas",
    "green beans",
    "lettuce",
    "cucumber",
    "avocado",
    "lime",
    "lemon",
  ];

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const outcome = await deferredPrompt.userChoice;
    if (outcome?.outcome === "accepted") {
      console.log("App installed successfully");
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  // Autocomplete input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length >= 2) {
      const filtered = commonIngredients
        .filter(
          (item) =>
            item.toLowerCase().includes(value.toLowerCase()) &&
            !ingredients.includes(item)
        )
        .slice(0, 5);
      setAutocompleteResults(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  };

  const selectAutocomplete = (item) => {
    if (!ingredients.includes(item)) {
      setIngredients([...ingredients, item]);
    }
    setInputValue("");
    setShowAutocomplete(false);
  };

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInputValue("");
    setShowAutocomplete(false);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const toggleInstructions = (index) => {
    setExpandedRecipes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Image capture (unchanged; text‑only ingredients UI so we just keep logic)
  const handleImageCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result.split(",")[1];
      setLoading(true);
      try {
        const response = await fetch("/.netlify/functions/anthropic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: file.type,
                      data: base64Image,
                    },
                  },
                  {
                    type: "text",
                    text: `List all the food ingredients you can see in this image. Return ONLY a valid JSON array of ingredient names, nothing else. Format: ["ingredient1","ingredient2",...].`,
                  },
                ],
              },
            ],
          }),
        });

        const data = await response.json();
        const text = data.content?.[0]?.text?.trim() || "[]";
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const detectedIngredients = JSON.parse(cleanText);
        setIngredients([...ingredients, ...(detectedIngredients || [])]);
      } catch (error) {
        console.error("Error detecting ingredients", error);
        alert("Could not detect ingredients. Please try again or add them manually.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Language prompt helper
  const languagePrompt =
    language === "en"
      ? "Use English for all text."
      : language === "es"
      ? "Use Spanish for all text."
      : language === "fr"
      ? "Use French for all text."
      : "Use German for all text.";

  // Recipe generation
  const generateRecipes = async () => {
    if (ingredients.length === 0) return;

    setLoading(true);
    setRecipes([]);
    setExpandedRecipes({});

    try {
      const response = await fetch("/.netlify/functions/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `
I have these ingredients: ${ingredients.join(", ")}.
You can also assume I have these common pantry items available: salt, pepper, olive oil, butter.

${languagePrompt}

Suggest 3-4 simple to moderate difficulty recipes. 
NO fancy restaurant-style dishes - just home cooking.
Mix it up with:
- Simple comfort food and everyday meals
- Moderate difficulty dishes still approachable for home cooks
- International cuisine variations but keep them simple

For each recipe, provide:
1. Name
2. Brief description (keep it simple, avoid apostrophes and special characters)
3. Full list of ingredients needed
4. Cooking time
5. Difficulty level ("easy" or "medium" only)
6. Number of servings
7. Step-by-step instructions (5-7 steps, clear and simple)

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

Return 3-4 recipes maximum. Focus on simple, approachable home cooking.
              `.trim(),
            },
          ],
        }),
      });

      const data = await response.json();
      let text = (data.content?.[0]?.text || "").trim();

      // Strip code fences or stray text
      text = text.replace(/```json/g, "").replace(/```/g, "");
      const firstBracket = text.indexOf("[");
      const lastBracket = text.lastIndexOf("]");
      if (firstBracket === -1 || lastBracket === -1) {
        throw new Error("Invalid JSON response - no array found. Please try again.");
      }

      text = text.substring(firstBracket, lastBracket + 1);

      // Remove control characters
      text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      // Remove BOM if present
      text = text.replace(/\uFEFF/g, "");

      let generatedRecipes;
      try {
        generatedRecipes = JSON.parse(text);
      } catch (parseError) {
        // Attempt a simple fix: remove stray "!" characters
        try {
          const fixedText = text.replace(/!/g, "");
          generatedRecipes = JSON.parse(fixedText);
        } catch {
          throw new Error(
            "Could not parse recipe JSON. Please try with fewer or different ingredients."
          );
        }
      }

      if (!Array.isArray(generatedRecipes) || generatedRecipes.length === 0) {
        throw new Error("No recipes were generated. Please try again.");
      }

      setRecipes(generatedRecipes.slice(0, 4));
    } catch (error) {
      console.error("Error generating recipes", error);
      alert(`Could not generate recipes: ${error.message}. Try using different ingredients.`);
    } finally {
      setLoading(false);
    }
  };

  // Loading message cycling (for GIF screen)
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);
    return () => clearInterval(id);
  }, [loading]);

  // Did You Know? fact cycle on Page 2
  useEffect(() => {
    if (showWelcome) return;

    let timeoutIds = [];

    const cycleFacts = () => {
      setShowWelcomeBack(true);
      setShowFactBubble(false);

      timeoutIds.push(
        setTimeout(() => {
          setShowWelcomeBack(false);
          setShowFactBubble(true);
          const randomFact =
            COOKING_FACTS[Math.floor(Math.random() * COOKING_FACTS.length)];
          setCurrentFact(randomFact);

          timeoutIds.push(
            setTimeout(() => {
              setShowFactBubble(false);
              timeoutIds.push(setTimeout(cycleFacts, 1000));
            }, 3000) // fact visible up to 3s
          );
        }, 1500) // welcome-back visible first
      );
    };

    cycleFacts();

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [showWelcome]);

  // =========================
  // PAGE 1 – Welcome
  // =========================
  if (showWelcome) {
    return (
      <div
        className="page-enter"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(160deg, #FFF8EE 0%, #F5EDD8 60%, #FFDBA4 100%)",
          fontFamily: "Nunito, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <style>{globalStyles}</style>

        {/* Decorative blobs */}
        <div
          style={{
            position: "fixed",
            top: "-120px",
            right: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(243,146,0,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-100px",
            left: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,134,42,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "520px",
            width: "100%",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <LetsEatLogo size={320} />
          </div>

          {/* Card */}
          <div
            className="card-enter"
            style={{
              background: "rgba(255,255,255,0.98)",
              borderRadius: "24px",
              padding: "32px 26px 30px",
              boxShadow: "0 18px 55px rgba(93,42,24,0.25)",
              border: "1px solid rgba(160,69,31,0.18)",
            }}
          >
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--brown-dark)",
                marginBottom: 6,
                letterSpacing: 0.3,
              }}
            >
              Welcome, Chef!
            </h2>
            <p
              style={{
                color: "var(--text-light)",
                fontSize: 14,
                marginBottom: 18,
                fontWeight: 500,
              }}
            >
              Tell us your name and language to get started.
            </p>

            {/* Language selection */}
            <div style={{ marginBottom: 18, textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "var(--text-mid)",
                }}
              >
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1.5px solid var(--border)",
                  fontSize: 14,
                  fontFamily: "Nunito, sans-serif",
                  background: "var(--cream)",
                  color: "var(--text-dark)",
                }}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            {/* Name input */}
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && userName.trim()) {
                  setShowWelcome(false);
                }
              }}
              placeholder="Your name..."
              style={{
                width: "100%",
                padding: "14px 18px",
                border: "2px solid rgba(243,146,0,0.4)",
                borderRadius: "12px",
                fontSize: 15,
                fontFamily: "Nunito, sans-serif",
                textAlign: "center",
                background: "var(--cream)",
                color: "var(--text-dark)",
                transition: "border-color 0.2s, box-shadow 0.2s",
                marginBottom: 24,
                boxShadow:
                  "0 0 0 3px rgba(243,146,0,0.12), 0 0 18px rgba(243,146,0,0.18)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--amber)";
                e.target.style.boxShadow =
                  "0 0 0 4px rgba(243,146,0,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />

            {/* Terms toggle */}
            <button
              type="button"
              onClick={() => setShowTerms((v) => !v)}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--brown-warm)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              {showTerms ? "Hide Terms" : "View Terms & Conditions"}
            </button>

            {showTerms && (
              <div
                style={{
                  maxHeight: 220,
                  overflowY: "auto",
                  color: "var(--text-light)",
                  fontSize: 12,
                  lineHeight: 1.7,
                  textAlign: "left",
                  borderRadius: 10,
                  border: "1px solid var(--cream-dark)",
                  padding: 12,
                  marginBottom: 12,
                  background: "rgba(255,248,238,0.6)",
                }}
              >
                <p>
                  <strong>Last Updated</strong> January 2026
                </p>
                <p style={{ marginTop: 10 }}>
                  By accessing and using this Recipe Generator Service, you agree
                  to be bound by these Terms and Conditions.
                </p>
                <p style={{ marginTop: 10 }}>
                  <strong>1. Acceptance of Terms</strong>
                  <br />
                  By using this Service, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms.
                </p>
                <p style={{ marginTop: 10 }}>
                  <strong>2. Service Description</strong>
                  <br />
                  The Service provides AI-powered recipe suggestions based on
                  user-provided ingredients. Recipes are generated for
                  informational purposes only.
                </p>
                <p style={{ marginTop: 10 }}>
                  <strong>3. User Responsibilities</strong>
                  <br />
                  You are responsible for verifying the accuracy and safety of
                  all recipes. Users should exercise proper food safety
                  practices.
                </p>
                <p style={{ marginTop: 10 }}>
                  <strong>4. Intellectual Property</strong>
                  <br />
                  All content, design, and functionality are owned by
                  Monarch-Elite Holdings and protected by intellectual property
                  laws.
                </p>
                <p style={{ marginTop: 10 }}>
                  <strong>5. Limitation of Liability</strong>
                  <br />
                  Monarch-Elite Holdings shall not be liable for any damages
                  arising from use of the Service.
                </p>
                <p style={{ marginTop: 10 }}>
                  <strong>6. Contact</strong>
                  <br />
                  legal@monarch-elite.com
                </p>
              </div>
            )}

            <p
              style={{
                color: "var(--text-light)",
                fontSize: 12.5,
                lineHeight: 1.6,
                marginBottom: 18,
              }}
            >
              By proceeding, you agree to our Terms and Conditions. This Service
              provides AI-generated recipe suggestions. You are responsible for
              verifying recipe safety and accuracy.
            </p>

            <button
              type="button"
              onClick={() => {
                if (userName.trim()) setShowWelcome(false);
              }}
              disabled={!userName.trim()}
              style={{
                width: "100%",
                padding: "16px",
                background: userName.trim()
                  ? "linear-gradient(135deg, #F39200 0%, #A0451F 100%)"
                  : "#D1C4B0",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontFamily: "Nunito, sans-serif",
                cursor: userName.trim() ? "pointer" : "not-allowed",
                boxShadow: userName.trim()
                  ? "0 8px 24px rgba(243,146,0,0.55), 0 0 30px rgba(243,146,0,0.3), inset 0 0 12px rgba(255,255,255,0.12)"
                  : "none",
                transition: "all 0.25s ease",
                animation: userName.trim() ? "pulse-amber 2.5s infinite" : "none",
              }}
              onMouseOver={(e) => {
                if (!userName.trim()) return;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Lets Cook!
            </button>

            <p
              style={{
                marginTop: 24,
                color: "var(--text-light)",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              © 2026{" "}
              <strong style={{ color: "var(--brown-warm)" }}>
                Monarch-Elite Holdings
              </strong>
              . All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Loading screen (GIF + animated text)
  // =========================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #FFF8EE 0%, #F5EDD8 60%, #FFDBA4 100%)",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        <style>{globalStyles}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              marginBottom: 24,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3g4bHR1Ym9vYWlzaW54cHVibjR4MnFpNTFzaDdxZDlmc2hob2l3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dWacKLne4EowGUaVUw/giphy.gif"
              alt="Cooking animation"
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "22px",
                boxShadow: "0 14px 40px rgba(93,42,24,0.28)",
                objectFit: "cover",
              }}
            />
          </div>
          <p
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--brown-dark)",
              marginBottom: 10,
            }}
          >
            Cooking up something delicious...
          </p>
          <p
            style={{
              color: "var(--text-light)",
              fontSize: 14,
              fontWeight: 600,
              minHeight: 20,
              transition: "opacity 0.3s ease",
            }}
          >
            {loadingMessages[loadingMessageIndex]}
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE 2 – Main App
  // =========================
  return (
    <div
      className="page-enter"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #FFF8EE 0%, #F5EDD8 60%, #FFDBA4 100%)",
        fontFamily: "Nunito, sans-serif",
        padding: "32px 20px",
        position: "relative",
        overflow: "hidden",
        color: "var(--text-dark)",
      }}
    >
      <style>{globalStyles}</style>

      {/* Install prompt */}
      {showInstallPrompt && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1001,
          }}
        >
          <button
            onClick={handleInstallClick}
            style={{
              padding: "10px 18px",
              background:
                "linear-gradient(135deg, var(--amber), var(--brown-warm))",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
              boxShadow: "0 4px 14px rgba(243,146,0,0.4)",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <Download size={14} />
            Install App
          </button>
        </div>
      )}

      {/* Return Home */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          padding: 12,
        }}
      >
        <button
          onClick={() => setShowWelcome(true)}
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1.5px solid var(--border)",
            borderRadius: 10,
            padding: "8px 14px",
            color: "var(--brown-dark)",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "Nunito, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 10px rgba(93,42,24,0.1)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.9)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.6)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span>Home</span>
        </button>
      </div>

      {/* Header + logo */}
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
            animation: "fadeUp 0.7s ease-out",
          }}
        >
          <LetsEatLogo size={360} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p
            style={{
              fontFamily: "Nunito, sans-serif",
              color: "var(--text-mid)",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 0.3,
            }}
          >
            Welcome back,{" "}
            <strong style={{ color: "var(--brown-warm)" }}>
              {userName || "Chef"}
            </strong>
            ! What are we cooking today?
          </p>
        </div>
      </div>

      {/* Did You Know sidebar */}
      <div
        style={{
          position: "fixed",
          top: "100px",
          right: "24px",
          width: "260px",
          zIndex: 20,
          fontFamily: "Nunito, sans-serif",
        }}
      >
        {showWelcomeBack && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "14px",
              padding: "12px 14px",
              boxShadow: "0 8px 24px rgba(93,42,24,0.18)",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--brown-dark)",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Welcome back, {userName || "Chef"}!
          </div>
        )}

        {showFactBubble && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "18px",
              padding: "12px 14px",
              boxShadow: "0 10px 26px rgba(93,42,24,0.22)",
              fontSize: 12,
              color: "var(--text-dark)",
              position: "relative",
              animation: "fadeUp 0.4s ease-out",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: "var(--amber)",
                marginBottom: 6,
              }}
            >
              Did you know?
            </div>
            <div>{currentFact}</div>
          </div>
        )}
      </div>

      {/* Main grid */}
      <div
        className="main-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.3fr)",
          gap: 28,
          maxWidth: 1120,
          margin: "16px auto 40px",
        }}
      >
        {/* Left: ingredient + controls */}
        <div>
          <div
            className="card-enter"
            style={{
              background: "rgba(255,255,255,0.96)",
              borderRadius: 20,
              padding: 36,
              marginBottom: 28,
              boxShadow: "0 14px 40px rgba(93,42,24,0.18)",
              border: "1px solid rgba(243,146,0,0.16)",
              animationDelay: "0.1s",
            }}
          >
            <h3
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 19,
                fontWeight: 700,
                color: "var(--brown-dark)",
                marginBottom: 22,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 22 }}>🥕</span>
              What ingredients do you have?
            </h3>

            {/* Input + add */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 18,
                position: "relative",
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") addIngredient();
                }}
                placeholder="Start typing an ingredient..."
                style={{
                  flex: 1,
                  padding: "13px 18px",
                  border: "2px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "Nunito, sans-serif",
                  background: "var(--cream)",
                  color: "var(--text-dark)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--amber)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(243,146,0,0.15)";
                }}
                onBlur={(e) => {
                  setTimeout(() => setShowAutocomplete(false), 200);
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={addIngredient}
                style={{
                  padding: "0 16px",
                  borderRadius: 10,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #F39200 0%, #A0451F 100%)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(243,146,0,0.5)",
                }}
              >
                Add
              </button>

              {/* Autocomplete dropdown (text‑only) */}
              {showAutocomplete && autocompleteResults.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    borderRadius: 10,
                    boxShadow: "0 10px 30px rgba(93,42,24,0.18)",
                    marginTop: 4,
                    zIndex: 5,
                    maxHeight: 210,
                    overflowY: "auto",
                  }}
                >
                  {autocompleteResults.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => selectAutocomplete(item)}
                      style={{
                        width: "100%",
                        padding: "8px 14px",
                        textAlign: "left",
                        border: "none",
                        background: "transparent",
                        fontSize: 13,
                        cursor: "pointer",
                        color: "var(--text-dark)",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Image upload (no icon inside input, just button) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-light)",
                  textAlign: "left",
                  flex: 1,
                }}
              >
                Optionally, snap a picture of your ingredients and we will try
                to recognize them.
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.9)",
                  color: "var(--brown-dark)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Camera size={16} />
                Use Camera
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageCapture}
              />
            </div>

            {/* Selected ingredients chips (text-only) */}
            {ingredients.length > 0 && (
              <div
                style={{
                  marginBottom: 20,
                  padding: 12,
                  background: "rgba(255,248,238,0.8)",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "#fff",
                      border: "1px solid var(--border)",
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{ing}</span>
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                    >
                      <X size={14} color="#A0451F" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Generate button */}
            <button
              type="button"
              onClick={generateRecipes}
              disabled={ingredients.length === 0}
              style={{
                width: "100%",
                padding: 18,
                background:
                  ingredients.length === 0
                    ? "#D1C4B0"
                    : "linear-gradient(135deg, #F39200 0%, #A0451F 100%)",
                border: "none",
                borderRadius: 12,
                color: "white",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 0.5,
                fontFamily: "Nunito, sans-serif",
                textTransform: "uppercase",
                cursor: ingredients.length === 0 ? "not-allowed" : "pointer",
                boxShadow:
                  ingredients.length === 0
                    ? "none"
                    : "0 8px 28px rgba(243,146,0,0.45)",
                transition: "all 0.25s ease",
              }}
              onMouseOver={(e) => {
                if (ingredients.length === 0) return;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {ingredients.length === 0 ? "Add ingredients to start" : "Generate Recipes"}
            </button>
          </div>
        </div>

        {/* Right: recipes */}
        <div>
          <div
            style={{
              marginTop: 16,
              maxWidth: 860,
              marginInline: "auto",
            }}
          >
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--brown-dark)",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Your Curated Recipes
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 14,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  background:
                    recipes.length > 0
                      ? "linear-gradient(135deg, #F39200, #A0451F)"
                      : "rgba(0,0,0,0.06)",
                  color: recipes.length > 0 ? "#fff" : "var(--text-light)",
                  padding: "3px 12px",
                  borderRadius: 20,
                  verticalAlign: "middle",
                }}
              >
                {recipes.length} found
              </span>
            </h2>

            {recipes.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-light)",
                  fontSize: 14,
                }}
              >
                Add some ingredients and tap Generate to see tailored recipes.
              </p>
            )}

            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="recipe-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: "rgba(255,255,255,0.96)",
                  borderRadius: 18,
                  padding: "28px 24px",
                  marginBottom: 20,
                  maxWidth: 640,
                  width: "100%",
                  marginInline: "auto",
                  boxShadow: "0 14px 40px rgba(93,42,24,0.18)",
                  border: "1px solid rgba(243,146,0,0.16)",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                    gap: 12,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "var(--brown-dark)",
                      flex: 1,
                      lineHeight: 1.2,
                    }}
                  >
                    {recipe.name}
                  </h3>
                  <span
                    style={{
                      flexShrink: 0,
                      padding: "5px 14px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontFamily: "Nunito, sans-serif",
                      background:
                        recipe.difficulty === "easy"
                          ? "rgba(74,200,128,0.15)"
                          : "rgba(243,146,0,0.15)",
                      color:
                        recipe.difficulty === "easy" ? "#27AE60" : "#A0451F",
                      border:
                        recipe.difficulty === "easy"
                          ? "1.5px solid rgba(74,200,128,0.4)"
                          : "1.5px solid rgba(243,146,0,0.4)",
                    }}
                  >
                    {recipe.difficulty === "easy" ? "Easy" : "Moderate"}
                  </span>
                </div>

                <p
                  style={{
                    color: "var(--text-light)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    marginBottom: 20,
                  }}
                >
                  {recipe.description}
                </p>

                {/* Meta row */}
                <div
                  className="recipe-meta"
                  style={{
                    display: "flex",
                    gap: 20,
                    marginBottom: 22,
                    paddingBottom: 18,
                    borderBottom: "1.5px solid var(--cream-dark)",
                    flexWrap: "wrap",
                  }}
                >
                  {[{ icon: "⏱", label: recipe.time },
                    {
                      icon: "⭐",
                      label:
                        recipe.difficulty === "easy" ? "Easy" : "Medium",
                    },
                    { icon: "🍽", label: recipe.servings },
                  ].map(({ icon, label }, i) => (
                    <span
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--text-mid)",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      {label}
                    </span>
                  ))}
                </div>

                {/* Ingredients (text-only) */}
                {recipe.ingredients?.length > 0 && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: 22,
                      background: "var(--cream)",
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--brown-dark)",
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      Ingredients
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(190px, 1fr))",
                        gap: 10,
                      }}
                    >
                      {recipe.ingredients.map((ing, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "9px 13px",
                            background: "#fff",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            color: "var(--text-dark)",
                            fontSize: 13,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {ing}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions toggle */}
                <button
                  type="button"
                  onClick={() => toggleInstructions(index)}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "var(--cream)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 10,
                    color: "var(--brown-dark)",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "Nunito, sans-serif",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "var(--amber)";
                    e.currentTarget.style.background =
                      "rgba(243,146,0,0.08)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--cream)";
                  }}
                >
                  <span>
                    {expandedRecipes[index]
                      ? "Hide Cooking Instructions"
                      : "View Cooking Instructions"}
                  </span>
                  <span
                    style={{ color: "var(--brown-warm)", fontWeight: 800 }}
                  >
                    {expandedRecipes[index] ? "−" : "+"}
                  </span>
                </button>

                {expandedRecipes[index] && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: 24,
                      background: "var(--cream)",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <ol
                      style={{
                        listStyle: "none",
                        counterReset: "step-counter",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      {recipe.instructions?.map((instruction, i) => (
                        <li
                          key={i}
                          style={{
                            marginBottom: 16,
                            paddingLeft: 48,
                            position: "relative",
                            color: "var(--text-mid)",
                            lineHeight: 1.7,
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #F39200, #A0451F)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 800,
                            }}
                          >
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
        </div>
      </div>
    </div>
  );
}
