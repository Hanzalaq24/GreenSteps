# 🌱 GreenSteps

**Understand, Track & Reduce Your Carbon Footprint**

GreenSteps is a carbon footprint awareness platform that goes beyond a simple calculator — it's a complete carbon management platform that helps individuals understand their environmental impact, track progress over time, simulate reduction scenarios, and take meaningful action through personalized insights.

---

## 🎯 Problem

Many people want to live more sustainably but struggle to understand how their daily activities contribute to carbon emissions. Without clear insights and actionable guidance, reducing one's carbon footprint can feel overwhelming.

---

## 💡 Solution

GreenSteps simplifies sustainability by providing:

1. **Understand** — A guided 5-question assessment that calculates your estimated carbon footprint
2. **Track** — Historical monitoring with monthly trend charts and streak tracking
3. **Reduce** — A Carbon Reduction Simulator that shows projected savings from lifestyle changes

---

## ✨ Features

### 📊 Carbon Footprint Assessment
Answer 5 simple questions about your daily habits (travel, electricity, food, shopping) and receive an estimated carbon footprint score with detailed breakdown.

### 🔬 Carbon Reduction Simulator
Toggle different scenarios (switch to public transport, go solar, reduce meat consumption) and instantly see projected emissions, monthly savings, and how many trees equivalent you'd save annually. Combine multiple scenarios to see cumulative impact.

### 📈 Historical Tracking
Every assessment is saved with timestamps. View your monthly trend chart to see if your footprint is improving or increasing over time. Track your best month and compare with previous periods.

### 🧠 Personalized Insights
Data-driven recommendations based on YOUR actual emissions — not generic advice:
- "Transportation contributes 63% of your footprint"
- "Switching to public transport twice weekly could reduce emissions by 18kg CO₂/month"
- Achievement badges for high scores and improvement trends

### 🎯 Personalized Action Plan
Get tailored action items ranked by difficulty and impact, from easy wins (switch to LED bulbs) to bigger commitments (install solar panels).

### 🏆 Eco Challenges
Gamified challenges that make sustainability fun. Complete challenges to earn points and track your eco-journey.

### 📱 Fully Responsive Design
Optimized experience across desktop, tablet, and mobile devices.

---

## 🚀 User Journey

1. Complete the Carbon Assessment (5 questions, ~60 seconds)
2. Receive Your Carbon Score (0-100)
3. View Emission Breakdown by category (transport, electricity, food, shopping)
4. Explore Carbon Reduction Simulator — toggle scenarios, see projected savings
5. Track Progress Over Time — monthly trend chart
6. Receive Personalized Insights — data-driven, not generic
7. Follow Your Action Plan with Eco Challenges

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.6 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.2 | Build tool |
| Tailwind CSS | 4.1.17 | Styling |
| lucide-react | — | Icons |
| html2canvas | 1.4.1 | Report download |

---

## ♿ Accessibility

GreenSteps is designed with accessibility in mind:

* Semantic HTML structure
* Keyboard-friendly navigation
* Responsive layouts across all devices
* Clear typography and visual hierarchy
* ARIA labels on interactive elements
* Color contrast ratios meeting WCAG standards

---

## ⚡ Performance

* Fully inlined bundle (vite-plugin-singlefile) — zero external requests
* Client-side rendering with no server dependency
* Lightweight architecture (~87KB gzipped)
* Optimized assets and lazy rendering
* Mobile-first responsive design

---

## 🔒 Security

* **Content Security Policy (CSP)** — Restricts script execution to self-only
* **X-Frame-Options: DENY** — Prevents clickjacking via iframe embedding
* **X-Content-Type-Options: nosniff** — Prevents MIME type sniffing
* **XSS Protection** — React auto-escaping + input validation
* **Input Sanitization** — Range clamping, enum whitelisting on assessment inputs
* **Safe localStorage** — try/catch + schema validation on all JSON.parse calls
* **Zero-division guards** — Prevents calculation errors on edge cases
* **No sensitive data collection** — All data stays in browser localStorage

---

## 📷 Screenshots

### Home Page
A clean and engaging landing page that introduces users to carbon footprint awareness.

### Assessment Page
Interactive 5-step questionnaire with progress indicators.

### Dashboard
Comprehensive view with score, donut chart, category breakdown, Carbon Simulator, trend chart, and personalized insights.

### Action Plan
Personalized recommendations with eco challenges and point tracking.

---

## 🔮 Future Improvements

* User authentication for cross-device sync
* Community eco challenges and leaderboards
* Carbon offset marketplace integration
* Regional emission benchmarks with real-time data
* AI-powered sustainability recommendations
* PWA support for offline access

---

## 📌 Challenge Alignment

This project directly addresses the **Carbon Footprint Awareness Platform** challenge:

| Requirement | Implementation |
|------------|----------------|
| **Understand** | 5-question assessment with detailed emission breakdown by category |
| **Track** | Historical data persistence, monthly trend charts, streak tracking, best month stats |
| **Reduce** | Carbon Reduction Simulator with interactive scenario toggles, projected savings, tree-equivalent calculations, personalized actionable insights |

---

## 👨‍💻 Developed By

**Hanzala Qureshi**

Built for the **Virtual PromptWars Challenge 3: Carbon Footprint Awareness Platform**

---

## 🏃 Quick Start

```bash
# Clone the repository
git clone https://github.com/Hanzalaq24/GreenSteps.git
cd GreenSteps

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License

MIT License — use freely for learning and contribution to climate action.
