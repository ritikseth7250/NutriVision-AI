# NutriVision AI

A web-based tool that estimates nutrition and calories from photos of food.

Right now, this repo contains the frontend interface with simulated AI results, built using pure HTML, CSS, and vanilla JavaScript so it's easy to run and test without needing backend setup.

---

## What It Does

- **Landing Page**: Basic introduction with project overview and links to start scanning.
- **Image Scanner**: Supports uploading files via file picker or drag-and-drop, with an image preview and sample test dishes built in.
- **Nutritional Breakdown**: Once an image is scanned, it displays:
  - Detected dish name
  - Calories (kcal)
  - Macronutrients (Protein, Carbs, Fat, Fiber)
  - Quick health summary
  - Practical suggestions (e.g. portion size, fiber additions)
- **Daily Dashboard**: Tracks total calories and macros for the day, updates dynamically as you log scanned meals, and includes a table of logged items with timestamps.

---

## Project Structure

```text
nutrivision/
├── frontend/
│   ├── index.html        # Main landing page
│   ├── scan.html         # Scanner and dashboard interface
│   ├── css/
│   │   └── style.css     # Styling and layout
│   ├── js/
│   │   └── app.js        # UI logic and mock data
│   └── assets/           # Media files
└── README.md
```

---

## How to Run Locally

You don't need any build steps, npm, or node installed.

### Option 1: Using Python local server
From the project root:

```bash
python -m http.server 3000 --directory frontend
```

Open your browser at:
```text
http://localhost:3000
```

### Option 2: Open directly in browser
Just double-click `frontend/index.html` or drag it into any web browser.

---

## Tech Stack

- **HTML5** for semantic markup
- **CSS3** (Flexbox, Grid, custom styling, responsive design)
- **Vanilla JavaScript (ES6+)** for all interactions and state management

---

## Key Highlights & Features

- ⚡ **Zero Dependencies**: Pure HTML5, CSS3, and ES6+ JavaScript. No build step or node_modules needed.
- 🎯 **Interactive Vision Scanner**: Drag-and-drop or file upload with simulated real-time inference scanner animation.
- 📊 **Macro & Calorie Tracking**: Detailed breakdown for calories, protein, carbs, fat, and dietary fiber.
- 💡 **Dietary Insights**: Contextual health assessments and tailored meal suggestions based on nutritional density.
- 📱 **Responsive Design**: Clean glassmorphism UI optimized across desktop and mobile screens.

---

## Roadmap

- [ ] FastAPI backend integration with Google Gemini Vision API
- [ ] Export daily nutrition logs to CSV / JSON
- [ ] Custom macro goals and target calorie alerts
- [ ] Multi-item meal recognition support

