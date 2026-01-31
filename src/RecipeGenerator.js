<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHEF - Complete Design Preview</title>
    <link href="https://fonts.googleapis.com/css2?family=Eagle+Lake&family=Open+Sans:wght@400;500;600&family=Racing+Sans+One&family=Quando&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Eagle Lake', cursive;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            padding: 40px 20px;
            color: #e2e8f0;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        /* ===== PAGE 1: WELCOME SCREEN ===== */
        .welcome-screen {
            text-align: center;
            background: #1f2937;
            border-radius: 16px;
            padding: 50px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(248, 196, 113, 0.2);
            margin-bottom: 60px;
        }

        /* CSS Typewriter Effect */
        @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
        }

        @keyframes blink {
            50% { border-right-color: transparent; }
        }

        @keyframes removeCursor {
            to { border-right-color: transparent; }
        }

        .typewriter {
            overflow: hidden;
            border-right: 3px solid #f8c471;
            white-space: nowrap;
            margin: 0 auto;
            animation: 
                typewriter 3s steps(40) 1s forwards, 
                blink 0.75s step-end infinite 1s,
                removeCursor 0s 4s forwards;
            display: inline-block;
            width: 0;
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

        /* More intense pulsing for page 2 CHEF */
        @keyframes intensePulse {
            from {
                filter: drop-shadow(0 0 25px rgba(248, 196, 113, 1)) 
                        drop-shadow(0 0 45px rgba(250, 177, 160, 0.8))
                        drop-shadow(0 0 65px rgba(255, 159, 67, 0.6));
                transform: scale(1);
            }
            to {
                filter: drop-shadow(0 0 40px rgba(248, 196, 113, 1)) 
                        drop-shadow(0 0 65px rgba(250, 177, 160, 1))
                        drop-shadow(0 0 90px rgba(255, 159, 67, 0.8));
                transform: scale(1.05);
            }
        }

        .logo-intense {
            animation: intensePulse 2s ease-in-out infinite alternate;
        }

        .logo {
            font-family: 'Quando', serif;
            font-size: 72px;
            font-weight: 400;
            background: linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 4px;
            margin-bottom: 20px;
            animation: glow 2.5s ease-in-out infinite alternate;
        }

        .name-input {
            width: 100%;
            max-width: 400px;
            padding: 18px 24px;
            border: 2px solid #374151;
            border-radius: 12px;
            font-size: 18px;
            font-family: 'Eagle Lake', cursive;
            text-align: center;
            background: #111827;
            color: #e2e8f0;
            margin: 30px auto;
            display: block;
        }

        .lets-cook-btn {
            padding: 20px 50px;
            background: linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43);
            border: none;
            border-radius: 12px;
            color: #1a1a2e;
            font-size: 20px;
            font-weight: 400;
            cursor: pointer;
            font-family: 'Eagle Lake', cursive;
            letter-spacing: 2px;
            box-shadow: 0 8px 30px rgba(248, 196, 113, 0.5);
        }

        /* ===== PAGE 2: MAIN APP ===== */
        .main-app {
            margin-top: 60px;
        }

        /* Welcome text - Open Sans italic */
        .welcome-text {
            font-family: 'Open Sans', sans-serif;
            font-size: 22px;
            font-weight: 400;
            font-style: italic;
            color: #e8e8e8;
            text-align: left;
            margin-bottom: 30px;
        }

        .username {
            background: linear-gradient(135deg, #f8c471, #fab1a0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 400;
        }

        .chef-hat-container {
            text-align: center;
            margin: 20px 0;
        }

        /* Tagline - Open Sans italic */
        .tagline {
            text-align: center;
            font-family: 'Open Sans', sans-serif;
            font-size: 22px;
            font-style: italic;
            color: #f8c471;
            margin-bottom: 40px;
            font-weight: 400;
            text-shadow: 0 2px 8px rgba(248, 196, 113, 0.4);
        }

        /* ===== PAGE 3: RECIPE RESULTS ===== */
        .recipe-card {
            background: #1f2937;
            border-radius: 16px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(248, 196, 113, 0.2);
        }

        /* Recipe names - NO GLOWING */
        .recipe-name {
            font-family: 'Eagle Lake', cursive;
            font-size: 38px;
            font-weight: 400;
            background: linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            letter-spacing: 2px;
        }

        .recipe-description {
            font-family: 'Open Sans', sans-serif;
            color: #cbd5e1;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 20px;
        }

        .recipe-meta {
            display: flex;
            gap: 25px;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #374151;
            font-family: 'Open Sans', sans-serif;
        }

        .meta-item {
            color: #94a3b8;
            font-size: 15px;
            font-weight: 600;
        }

        .instructions-btn {
            width: 100%;
            padding: 18px;
            background: #111827;
            border: 2px solid #374151;
            border-radius: 10px;
            color: #cbd5e1;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            font-family: 'Open Sans', sans-serif;
        }

        .instructions-content {
            margin-top: 20px;
            padding: 30px;
            background: #111827;
            border-radius: 10px;
            border: 2px solid #374151;
        }

        .instruction-step {
            font-family: 'Open Sans', sans-serif;
            margin-bottom: 20px;
            padding-left: 50px;
            position: relative;
            color: #cbd5e1;
            line-height: 1.8;
            font-size: 16px;
        }

        .step-number {
            position: absolute;
            left: 0;
            top: 0;
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #f8c471, #fab1a0);
            color: #1a1a2e;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(248, 196, 113, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- ========================================== -->
        <!-- PAGE 1: WELCOME SCREEN -->
        <!-- ========================================== -->
        <div class="welcome-screen">
            <!-- Original Chef Hat SVG -->
            <svg width="140" height="140" viewBox="0 0 200 200" style="margin-bottom: 30px; filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));">
                <g transform="translate(100, 100)">
                    <!-- Hat body -->
                    <path d="M -60 20 Q -60 -10, -50 -30 L 50 -30 Q 60 -10, 60 20 L 60 40 L -60 40 Z" 
                        fill="#f8f8f8" 
                        stroke="#2d2d2d" 
                        stroke-width="3"/>
                    
                    <!-- Hat puffs -->
                    <circle cx="-45" cy="-25" r="22" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                    <circle cx="-20" cy="-35" r="25" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                    <circle cx="0" cy="-40" r="28" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                    <circle cx="20" cy="-35" r="25" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                    <circle cx="45" cy="-25" r="22" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                    
                    <!-- Hat band -->
                    <rect x="-60" y="35" width="120" height="15" fill="#e8e8e8" stroke="#2d2d2d" stroke-width="3"/>
                    
                    <!-- Decorative lines -->
                    <line x1="-40" y1="-5" x2="-40" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                    <line x1="-20" y1="-5" x2="-20" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                    <line x1="0" y1="-5" x2="0" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                    <line x1="20" y1="-5" x2="20" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                    <line x1="40" y1="-5" x2="40" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                </g>
                
                <!-- Fork -->
                <g transform="translate(40, 150) rotate(-30)">
                    <rect x="-2" y="0" width="4" height="35" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                    <rect x="-8" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                    <rect x="-2" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                    <rect x="4" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                </g>
                
                <!-- Spoon -->
                <g transform="translate(160, 150) rotate(30)">
                    <ellipse cx="0" cy="35" rx="6" ry="8" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                    <rect x="-2" y="0" width="4" height="35" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                </g>
            </svg>

            <h1 class="logo">CHEF</h1>
            
            <!-- Typewriter Effect (Italicized) -->
            <div style="height: 40px; display: flex; justify-content: center; align-items: center;">
                <p class="typewriter" style="color: #f8c471; font-size: 18px; font-family: 'Open Sans', sans-serif; font-style: italic;">
                    Your Personal Kitchen Assistant
                </p>
            </div>

            <!-- Centered Name Input (no label) -->
            <input type="text" class="name-input" placeholder="Enter your name..." value="Alex">

            <div style="margin: 30px 0; padding: 25px; background: #111827; border: 1px solid #374151; border-radius: 12px; text-align: left;">
                <h3 style="font-family: 'Open Sans', sans-serif; font-style: italic; font-size: 16px; color: #f8c471; margin-bottom: 10px;">Terms & Conditions</h3>
                <p style="font-family: 'Open Sans', sans-serif; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                    By proceeding, you agree to our Terms and Conditions. This Service provides AI-generated recipe suggestions.
                </p>
            </div>

            <!-- Centered Button -->
            <button class="lets-cook-btn">Let's Cook</button>

            <p style="margin-top: 30px; font-family: 'Open Sans', sans-serif; font-size: 12px; color: #64748b;">
                © 2026 <span style="color: #f8c471; font-weight: 700;">Monarch-Elite Holdings</span>. All Rights Reserved.
            </p>
        </div>

        <!-- ========================================== -->
        <!-- PAGE 2: MAIN APP -->
        <!-- ========================================== -->
        <div class="main-app">
            <!-- Welcome Text - Top Left, Smaller -->
            <div class="welcome-text typewriter">
                Welcome back, <span class="username">Alex</span>!
            </div>

            <!-- CHEF Centered - BIGGER (Quando) -->
            <div style="text-align: center; margin: 20px 0 30px 0;">
                <h1 class="logo logo-intense" style="font-family: 'Quando', serif; font-size: 80px; margin: 0;">CHEF</h1>
            </div>

            <!-- Tagline - Open Sans italic, removed "that hits" -->
            <h2 class="tagline">Let's create a meal</h2>

            <div style="background: #1f2937; border-radius: 16px; padding: 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                <h3 style="font-family: 'Open Sans', sans-serif; font-size: 18px; color: #cbd5e1; margin-bottom: 20px;">
                    🥘 What ingredients do you have?
                </h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 25px;">
                    <div style="background: #111827; border: 2px solid #374151; padding: 12px; border-radius: 10px; color: #cbd5e1; font-family: 'Open Sans', sans-serif;">
                        🍗 chicken
                    </div>
                    <div style="background: #111827; border: 2px solid #374151; padding: 12px; border-radius: 10px; color: #cbd5e1; font-family: 'Open Sans', sans-serif;">
                        🍚 rice
                    </div>
                    <div style="background: #111827; border: 2px solid #374151; padding: 12px; border-radius: 10px; color: #cbd5e1; font-family: 'Open Sans', sans-serif;">
                        🧄 garlic
                    </div>
                </div>
                <button class="lets-cook-btn" style="width: 100%; font-size: 18px;">✨ Let's Cook ✨</button>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- PAGE 3: RECIPE RESULTS -->
        <!-- ========================================== -->
        <div style="margin-top: 60px;">
            <h2 style="text-align: center; font-family: 'Open Sans', sans-serif; font-style: italic; font-size: 22px; color: #f8c471; margin-bottom: 40px; letter-spacing: 1px;">
                Your Curated Recipes (3)
            </h2>

            <!-- Recipe Card 1 - COMPLETE LAYOUT -->
            <div class="recipe-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <h3 class="recipe-name">Garlic Butter Chicken & Rice</h3>
                    <span style="padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Open Sans', sans-serif; background: rgba(74, 222, 128, 0.2); color: #4ade80; border: 2px solid rgba(74, 222, 128, 0.4);">Simple</span>
                </div>
                
                <p class="recipe-description">
                    Succulent chicken pieces seared to golden perfection, nestled on a bed of fluffy garlic-infused rice 
                    that will make your taste buds dance with joy.
                </p>
                
                <div class="recipe-meta">
                    <span class="meta-item">⏱️ 25 mins</span>
                    <span class="meta-item">📊 Easy</span>
                    <span class="meta-item">🍽️ Serves 4</span>
                </div>

                <!-- Ingredients Section -->
                <div style="margin-bottom: 25px; padding: 25px; background: #111827; border-radius: 12px; border: 2px solid #374151;">
                    <h4 style="font-family: 'Open Sans', sans-serif; font-size: 16px; font-weight: 700; color: #f8c471; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                        <span>🥘</span> Ingredients
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
                        <div style="padding: 10px 14px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #cbd5e1; font-size: 14px; display: flex; align-items: center; gap: 10px; font-family: 'Open Sans', sans-serif;">
                            <span style="font-size: 18px;">🍗</span> 4 chicken breasts
                        </div>
                        <div style="padding: 10px 14px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #cbd5e1; font-size: 14px; display: flex; align-items: center; gap: 10px; font-family: 'Open Sans', sans-serif;">
                            <span style="font-size: 18px;">🍚</span> 2 cups white rice
                        </div>
                        <div style="padding: 10px 14px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #cbd5e1; font-size: 14px; display: flex; align-items: center; gap: 10px; font-family: 'Open Sans', sans-serif;">
                            <span style="font-size: 18px;">🧄</span> 6 cloves garlic
                        </div>
                        <div style="padding: 10px 14px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #cbd5e1; font-size: 14px; display: flex; align-items: center; gap: 10px; font-family: 'Open Sans', sans-serif;">
                            <span style="font-size: 18px;">🧈</span> 4 tbsp butter
                        </div>
                        <div style="padding: 10px 14px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #cbd5e1; font-size: 14px; display: flex; align-items: center; gap: 10px; font-family: 'Open Sans', sans-serif;">
                            <span style="font-size: 18px;">🧂</span> Salt & pepper
                        </div>
                        <div style="padding: 10px 14px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #cbd5e1; font-size: 14px; display: flex; align-items: center; gap: 10px; font-family: 'Open Sans', sans-serif;">
                            <span style="font-size: 18px;">🥫</span> 3 cups broth
                        </div>
                    </div>
                </div>

                <button class="instructions-btn">📖 View Cooking Instructions ▼</button>
                
                <!-- Expanded Instructions -->
                <div class="instructions-content">
                    <div class="instruction-step">
                        <div class="step-number">1</div>
                        Season chicken pieces with salt and pepper generously on both sides.
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">2</div>
                        Heat butter in a large skillet over medium-high heat until melted and fragrant.
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">3</div>
                        Add minced garlic and sauté for 30 seconds until aromatic.
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">4</div>
                        Place chicken in the skillet and cook for 6-7 minutes per side until golden brown.
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">5</div>
                        While chicken cooks, prepare rice according to package directions with extra garlic.
                    </div>
                    <div class="instruction-step">
                        <div class="step-number">6</div>
                        Serve hot chicken over garlic rice and drizzle with pan juices.
                    </div>
                </div>

                <!-- Pro Tips -->
                <div style="margin-top: 20px; padding: 18px 22px; background: rgba(248, 196, 113, 0.1); border-radius: 10px; border: 2px solid rgba(248, 196, 113, 0.3);">
                    <div style="font-family: 'Open Sans', sans-serif; font-size: 14px; font-weight: 700; color: #f8c471; margin-bottom: 10px;">💡 Pro Tips</div>
                    <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6; font-family: 'Open Sans', sans-serif;">
                        Add a squeeze of lemon juice for extra flavor • Use day-old rice for better texture • Let chicken rest 3-4 minutes before serving
                    </p>
                </div>
            </div>

            <!-- Recipe Card 2 -->
            <div class="recipe-card">
                <h3 class="recipe-name">Crispy Garlic Rice Bowl</h3>
                <p class="recipe-description">
                    Transform simple rice into a crispy, golden masterpiece with aromatic garlic that creates 
                    an irresistible crunch in every bite.
                </p>
                <div class="recipe-meta">
                    <span class="meta-item">⏱️ 15 mins</span>
                    <span class="meta-item">📊 Easy</span>
                    <span class="meta-item">🍽️ Serves 2</span>
                </div>
                <button class="instructions-btn">📖 View Cooking Instructions ▼</button>
            </div>

            <!-- Recipe Card 3 -->
            <div class="recipe-card">
                <h3 class="recipe-name">One-Pan Chicken Rice Delight</h3>
                <p class="recipe-description">
                    Everything you need in one glorious pan - tender chicken, fluffy rice, and garlic magic 
                    all coming together in perfect harmony.
                </p>
                <div class="recipe-meta">
                    <span class="meta-item">⏱️ 30 mins</span>
                    <span class="meta-item">📊 Medium</span>
                    <span class="meta-item">🍽️ Serves 4</span>
                </div>
                <button class="instructions-btn">📖 View Cooking Instructions ▼</button>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 40px 0; color: #64748b; font-size: 12px; font-family: 'Open Sans', sans-serif;">
            © 2026 <span style="color: #f8c471; font-weight: 700;">Monarch-Elite Holdings</span>. All Rights Reserved.
        </div>
    </div>
</body>
</html>
