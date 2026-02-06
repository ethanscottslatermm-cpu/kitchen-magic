<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHEF - Final Preview</title>
    <link href="https://fonts.googleapis.com/css2?family=Quattrocento:wght@400;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Quattrocento', serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            padding: 40px 20px;
            color: #e2e8f0;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        .page {
            background: #1f2937;
            border-radius: 20px;
            padding: 50px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(248, 196, 113, 0.3);
        }

        .page-label {
            text-align: center;
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            color: #f8c471;
            margin-bottom: 30px;
            padding: 10px;
            background: rgba(248, 196, 113, 0.1);
            border-radius: 8px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
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

        @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
        }

        @keyframes blink {
            0%, 100% { border-right-color: transparent; }
            50% { border-right-color: #f8c471; }
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
            max-width: fit-content;
        }

        .chef-hat {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            font-family: 'Quattrocento', serif;
            font-size: 96px;
            font-weight: 400;
            background: linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 4px;
            margin-bottom: 20px;
            animation: glow 2.5s ease-in-out infinite alternate;
            text-align: center;
        }

        .subtitle {
            color: #f8c471;
            font-size: 18px;
            font-family: 'Open Sans', sans-serif;
            font-weight: 400;
            letter-spacing: 1px;
            font-style: italic;
            text-align: center;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .welcome-text {
            color: #e8e8e8;
            font-size: 14px;
            font-family: 'Open Sans', sans-serif;
            font-style: italic;
            font-weight: 400;
            margin-bottom: 30px;
            height: 40px;
            display: flex;
            align-items: center;
        }

        .gradient-text {
            background: linear-gradient(135deg, #f8c471, #fab1a0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .input-box {
            width: 100%;
            max-width: 400px;
            padding: 18px 24px;
            border: 2px solid #374151;
            border-radius: 12px;
            font-size: 18px;
            font-family: 'Quattrocento', serif;
            text-align: center;
            background: #111827;
            color: #e2e8f0;
            margin: 30px auto;
            display: block;
        }

        .terms-box {
            background: #111827;
            border: 1px solid #374151;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }

        .terms-title {
            font-family: 'Open Sans', sans-serif;
            font-size: 16px;
            font-weight: 400;
            font-style: italic;
            color: #f8c471;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }

        .terms-text {
            color: #94a3b8;
            font-size: 14px;
            line-height: 1.6;
            font-family: 'Open Sans', sans-serif;
        }

        .button {
            padding: 20px 50px;
            background: linear-gradient(135deg, #f8c471, #fab1a0, #ff9f43);
            border: none;
            border-radius: 12px;
            color: #1a1a2e;
            font-size: 20px;
            font-weight: 400;
            font-family: 'Quattrocento', serif;
            letter-spacing: 2px;
            box-shadow: 0 8px 30px rgba(248, 196, 113, 0.5);
            display: block;
            margin: 0 auto;
            cursor: pointer;
        }

        .ingredient-section {
            background: #111827;
            border: 2px solid #374151;
            border-radius: 12px;
            padding: 30px;
            margin-top: 30px;
        }

        .ingredient-label {
            color: #f8c471;
            font-size: 16px;
            font-family: 'Open Sans', sans-serif;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .footer {
            margin-top: 30px;
            color: #64748b;
            font-size: 12px;
            text-align: center;
            font-family: 'Open Sans', sans-serif;
        }

        .footer-brand {
            color: #f8c471;
            font-weight: 700;
        }

        .scan-button {
            background: rgba(248, 196, 113, 0.1);
            border: 2px solid rgba(248, 196, 113, 0.3);
            padding: 15px;
            border-radius: 10px;
            color: #f8c471;
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            text-align: center;
            margin-bottom: 20px;
        }

        .note {
            margin-top: 60px;
            padding: 30px;
            background: rgba(74, 222, 128, 0.1);
            border: 2px solid rgba(74, 222, 128, 0.3);
            border-radius: 12px;
            text-align: center;
        }

        .note-title {
            font-family: 'Quattrocento', serif;
            font-size: 24px;
            color: #4ade80;
            margin-bottom: 15px;
        }

        .note-text {
            font-family: 'Open Sans', sans-serif;
            font-size: 15px;
            line-height: 1.7;
            color: #cbd5e1;
        }

        @media (max-width: 1200px) {
            .container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- PAGE 1: WELCOME SCREEN -->
        <div class="page">
            <div class="page-label">📍 Page 1 - Welcome Screen</div>
            
            <div class="chef-hat">
                <svg width="140" height="140" viewBox="0 0 200 200" style="filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));">
                    <g transform="translate(100, 100)">
                        <path d="M -60 20 Q -60 -10, -50 -30 L 50 -30 Q 60 -10, 60 20 L 60 40 L -60 40 Z" 
                            fill="#f8f8f8" 
                            stroke="#2d2d2d" 
                            stroke-width="3"/>
                        
                        <circle cx="-45" cy="-25" r="22" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        <circle cx="-20" cy="-35" r="25" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        <circle cx="0" cy="-40" r="28" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        <circle cx="20" cy="-35" r="25" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        <circle cx="45" cy="-25" r="22" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        
                        <rect x="-60" y="35" width="120" height="15" fill="#e8e8e8" stroke="#2d2d2d" stroke-width="3"/>
                        
                        <line x1="-40" y1="-5" x2="-40" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                        <line x1="-20" y1="-5" x2="-20" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                        <line x1="0" y1="-5" x2="0" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                        <line x1="20" y1="-5" x2="20" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                        <line x1="40" y1="-5" x2="40" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                    </g>
                    
                    <g transform="translate(40, 150) rotate(-30)">
                        <rect x="-2" y="0" width="4" height="35" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                        <rect x="-8" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                        <rect x="-2" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                        <rect x="4" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                    </g>
                    
                    <g transform="translate(160, 150) rotate(30)">
                        <ellipse cx="0" cy="35" rx="6" ry="8" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                        <rect x="-2" y="0" width="4" height="35" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                    </g>
                </svg>
            </div>

            <h1 class="logo">CHEF</h1>
            
            <div class="subtitle">
                <span class="typewriter">Your Personal Kitchen Assistant</span>
            </div>

            <input type="text" class="input-box" placeholder="Enter your name..." value="Ethan">

            <div class="terms-box">
                <h3 class="terms-title">Terms & Conditions</h3>
                <p class="terms-text">
                    By proceeding, you agree to our Terms and Conditions. This Service provides AI-generated 
                    recipe suggestions based on your ingredients. You are responsible for verifying recipe 
                    safety and accuracy.
                </p>
            </div>

            <button class="button">Let's Cook</button>

            <div class="footer">
                © 2026 <span class="footer-brand">Monarch-Elite Holdings</span>. All Rights Reserved.
            </div>
        </div>

        <!-- PAGE 2: MAIN APP -->
        <div class="page">
            <div class="page-label">📍 Page 2 - Main App</div>
            
            <div class="welcome-text">
                <span class="typewriter">Welcome back, <span class="gradient-text">Ethan</span>!</span>
            </div>

            <div class="chef-hat">
                <svg width="140" height="140" viewBox="0 0 200 200" style="filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));">
                    <g transform="translate(100, 100)">
                        <path d="M -60 20 Q -60 -10, -50 -30 L 50 -30 Q 60 -10, 60 20 L 60 40 L -60 40 Z" 
                            fill="#f8f8f8" 
                            stroke="#2d2d2d" 
                            stroke-width="3"/>
                        
                        <circle cx="-45" cy="-25" r="22" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        <circle cx="-20" cy="-35" r="25" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        <circle cx="0" cy="-40" r="28" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        <circle cx="20" cy="-35" r="25" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        <circle cx="45" cy="-25" r="22" fill="#ffffff" stroke="#2d2d2d" stroke-width="3"/>
                        
                        <rect x="-60" y="35" width="120" height="15" fill="#e8e8e8" stroke="#2d2d2d" stroke-width="3"/>
                        
                        <line x1="-40" y1="-5" x2="-40" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                        <line x1="-20" y1="-5" x2="-20" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                        <line x1="0" y1="-5" x2="0" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                        <line x1="20" y1="-5" x2="20" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                        <line x1="40" y1="-5" x2="40" y2="25" stroke="#d0d0d0" stroke-width="2"/>
                    </g>
                    
                    <g transform="translate(40, 150) rotate(-30)">
                        <rect x="-2" y="0" width="4" height="35" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                        <rect x="-8" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                        <rect x="-2" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                        <rect x="4" y="30" width="4" height="15" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                    </g>
                    
                    <g transform="translate(160, 150) rotate(30)">
                        <ellipse cx="0" cy="35" rx="6" ry="8" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                        <rect x="-2" y="0" width="4" height="35" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1.5"/>
                    </g>
                </svg>
            </div>

            <h1 class="logo">CHEF</h1>
            
            <div class="subtitle">
                <span class="typewriter">Let's find you some food</span>
            </div>

            <div class="ingredient-section">
                <div class="ingredient-label">
                    <span>🥘</span> What ingredients do you have?
                </div>

                <div class="scan-button">
                    📷 Scan Ingredients
                </div>

                <input type="text" class="input-box" placeholder="Start typing an ingredient..." style="margin: 0 auto 20px;">
                
                <button class="button" style="font-size: 16px; padding: 15px 40px;">Generate Recipes</button>
            </div>

            <div class="footer">
                © 2026 <span class="footer-brand">Monarch-Elite Holdings</span>. All Rights Reserved.
            </div>
        </div>
    </div>

    <!-- Note Section -->
    <div class="note">
        <div class="note-title">✨ Preview Complete!</div>
        <p class="note-text">
            <strong>All Features Applied:</strong><br><br>
            ✅ Typewriter effects with cursor removal after 4 seconds<br>
            ✅ CHEF logo enlarged to 96px on both pages<br>
            ✅ Chef hat centered above CHEF on both pages<br>
            ✅ Glowing animation on CHEF logo<br>
            ✅ "Welcome back" with typewriter effect (top-left, small)<br>
            ✅ Quattrocento font for CHEF and recipe titles<br>
            ✅ All italics properly applied<br><br>
            <strong>Ready to deploy!</strong> 🚀
        </p>
    </div>
</body>
</html>
