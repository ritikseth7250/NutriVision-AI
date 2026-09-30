/**
 * ============================================================================
 * NutriVision AI - Core Frontend Logic
 * AI Vision Frontend Prototype - Clean Vanilla JavaScript
 * ============================================================================
 * 
 * Modular architecture ready for FastAPI integration:
 * - Mock Vision Inference Engine
 * - Drag-and-drop Image Upload & Preview
 * - Interactive Simulated AI Pipeline
 * - Real-time Nutritional Dashboard & Chart.js Visualizer
 */

// ---------------------------------------------------------------------------
// 1. Mock Food Knowledge Base
// ---------------------------------------------------------------------------
const FOOD_DATABASE = {
  'chicken-rice': {
    name: 'Grilled Chicken Rice',
    confidence: '96.4%',
    calories: 620,
    protein: 32,
    carbs: 72,
    fat: 20,
    fiber: 4,
    statusClass: 'moderate',
    statusIcon: '⚠️',
    assessment: 'Moderate — good protein but relatively high in calories and simple carbohydrates.',
    suggestions: [
      'Swap white rice with brown rice or quinoa for higher dietary fiber and lower GI.',
      'Add steamed broccoli or mixed salad to increase micronutrient density.',
      'Reduce cooking oil or skin on chicken to lower saturated fat content.'
    ],
    // Clean SVG graphic representation for sample preview
    svgThumb: generateFoodSvg('#f59e0b', '🍗 Chicken Rice')
  },
  'avocado-toast': {
    name: 'Avocado Toast with Poached Egg',
    confidence: '94.8%',
    calories: 410,
    protein: 18,
    carbs: 34,
    fat: 22,
    fiber: 7,
    statusClass: 'healthy',
    statusIcon: '✅',
    assessment: 'Healthy — rich in heart-healthy monounsaturated fats, dietary fiber, and choline.',
    suggestions: [
      'Opt for whole-grain artisanal sourdough for sustained energy release.',
      'Sprinkle hemp seeds or pumpkin seeds for extra zinc and magnesium.',
      'Keep sodium moderate by using herbs and red pepper flakes for seasoning.'
    ],
    svgThumb: generateFoodSvg('#10b981', '🥑 Avocado Toast')
  },
  'paneer-tikka': {
    name: 'Paneer Tikka Protein Bowl',
    confidence: '92.1%',
    calories: 540,
    protein: 28,
    carbs: 42,
    fat: 26,
    fiber: 6,
    statusClass: 'healthy',
    statusIcon: '✅',
    assessment: 'Balanced — excellent vegetarian protein, calcium, and antioxidant-rich bell peppers.',
    suggestions: [
      'Pair with low-fat mint yogurt instead of heavy mayonnaise-based dressings.',
      'Incorporate roasted chickpeas for a complete amino acid profile.',
      'Moderate portion of paneer if aiming strictly for low-fat macros.'
    ],
    svgThumb: generateFoodSvg('#f97316', '🧀 Paneer Tikka')
  },
  'salmon-quinoa': {
    name: 'Grilled Salmon & Quinoa',
    confidence: '97.2%',
    calories: 580,
    protein: 42,
    carbs: 38,
    fat: 24,
    fiber: 5,
    statusClass: 'healthy',
    statusIcon: '✅',
    assessment: 'Optimal — superior lean protein and high concentration of Omega-3 fatty acids.',
    suggestions: [
      'Season with fresh lemon juice and dill for enhanced iron absorption.',
      'A top-tier post-workout or recovery meal with complete branched-chain amino acids (BCAAs).',
      'Pairs exceptionally well with sautéed asparagus or baby spinach.'
    ],
    svgThumb: generateFoodSvg('#06b6d4', '🐟 Salmon Quinoa')
  },
  'green-salad': {
    name: 'Mediterranean Chickpea Salad',
    confidence: '95.0%',
    calories: 320,
    protein: 14,
    carbs: 45,
    fat: 9,
    fiber: 11,
    statusClass: 'healthy',
    statusIcon: '✅',
    assessment: 'Very Healthy — low calorie density with exceptional gut-friendly fiber.',
    suggestions: [
      'Add a hardboiled egg or grilled tofu if a higher protein goal is desired.',
      'Use extra virgin olive oil as the primary healthy lipid source.',
      'Great choice for metabolic health and glycemic management.'
    ],
    svgThumb: generateFoodSvg('#22c55e', '🥗 Green Salad')
  }
};

// Generates an inline Data URL SVG for dishes when external photos are not uploaded
function generateFoodSvg(accentColor, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.35" />
        <stop offset="100%" style="stop-color:#0b0f19;stop-opacity:1" />
      </radialGradient>
    </defs>
    <rect width="600" height="400" fill="url(#grad)" />
    <circle cx="300" cy="200" r="130" fill="#121829" stroke="${accentColor}" stroke-width="3" stroke-dasharray="8 4"/>
    <circle cx="300" cy="200" r="105" fill="#1b253b" />
    <text x="300" y="195" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#f8fafc" text-anchor="middle">${label}</text>
    <text x="300" y="230" font-family="system-ui, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">NutriVision AI • High-Resolution Test Specimen</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ---------------------------------------------------------------------------
// 2. Global State & Targets
// ---------------------------------------------------------------------------
const DAILY_TARGETS = {
  calories: 2200,
  protein: 120, // grams
  carbs: 250,   // grams
  fat: 70       // grams
};

const state = {
  currentImageData: null,
  currentFoodKey: 'chicken-rice',
  currentAnalysis: null,
  dailyLog: [
    {
      time: '08:30 AM',
      name: 'Avocado Toast with Poached Egg',
      calories: 410,
      protein: 18,
      carbs: 34,
      fat: 22
    },
    {
      time: '11:15 AM',
      name: 'Greek Yogurt & Almonds',
      calories: 220,
      protein: 16,
      carbs: 12,
      fat: 10
    }
  ]
};

let nutritionChart = null;

// ---------------------------------------------------------------------------
// 3. Initialization
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initDropzone();
  initSampleChips();
  initAnalyzeButton();
  initLogButton();
  initDashboard();

  // Pre-load default specimen so user can test immediately
  loadSampleFood('chicken-rice');
});

// ---------------------------------------------------------------------------
// 4. File Upload & Drag-and-Drop Handling
// ---------------------------------------------------------------------------
function initDropzone() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  if (!dropzone || !fileInput) return;

  // Open file browser on click
  dropzone.addEventListener('click', (e) => {
    // Prevent double triggering if clicked directly on input
    if (e.target !== fileInput) {
      fileInput.click();
    }
  });

  // Handle native file selection
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      processSelectedFile(file);
    }
  });

  // Drag and drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-active');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-active');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  });
}

function processSelectedFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please upload a valid image file (JPG, PNG, WebP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    state.currentImageData = dataUrl;
    state.currentFoodKey = 'custom'; // custom uploaded item

    displayPreviewImage(dataUrl, file.name);
    // De-activate preset sample chips
    document.querySelectorAll('.sample-chip').forEach(c => c.classList.remove('active'));
    showToast(`Loaded "${file.name}" ready for analysis.`);
  };
  reader.readAsDataURL(file);
}

function displayPreviewImage(src, labelText = 'Ready for Vision AI scan') {
  const previewWrapper = document.getElementById('previewWrapper');
  const previewImage = document.getElementById('previewImage');
  const previewSubtext = document.getElementById('previewSubtext');

  if (previewWrapper && previewImage) {
    previewImage.src = src;
    previewWrapper.classList.add('visible');
    if (previewSubtext) previewSubtext.textContent = labelText;
  }
}

// ---------------------------------------------------------------------------
// 5. Sample Preset Chips
// ---------------------------------------------------------------------------
function initSampleChips() {
  const chips = document.querySelectorAll('.sample-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const foodKey = chip.getAttribute('data-food');
      if (foodKey && FOOD_DATABASE[foodKey]) {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        loadSampleFood(foodKey);
      }
    });
  });
}

function loadSampleFood(foodKey) {
  const food = FOOD_DATABASE[foodKey];
  if (!food) return;

  state.currentFoodKey = foodKey;
  state.currentImageData = food.svgThumb;

  displayPreviewImage(food.svgThumb, `Preset Specimen: ${food.name}`);
}

// ---------------------------------------------------------------------------
// 6. Food Analysis Simulation (Ready for FastAPI endpoint)
// ---------------------------------------------------------------------------
function initAnalyzeButton() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  if (!analyzeBtn) return;

  analyzeBtn.addEventListener('click', () => {
    if (!state.currentImageData) {
      showToast('Please upload an image or select a sample dish first.');
      return;
    }
    runVisionAnalysis();
  });
}

function runVisionAnalysis() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const previewWrapper = document.getElementById('previewWrapper');
  const aiStatusBox = document.getElementById('aiStatusBox');
  const aiStatusText = document.getElementById('aiStatusText');
  const resultCard = document.getElementById('resultCard');
  const resultEmptyState = document.getElementById('resultEmptyState');

  // Disable button & trigger laser scanning animation
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = `
    <span class="spinner"></span>
    <span>Analyzing...</span>
  `;
  if (previewWrapper) previewWrapper.classList.add('scanning');
  if (aiStatusBox) aiStatusBox.classList.add('visible');

  // Progressive simulation steps (emulates deep learning inference lifecycle)
  const steps = [
    { delay: 100, text: 'Preprocessing tensor & normalizing color channels...' },
    { delay: 600, text: 'Executing YOLOv8 segmentation on food regions...' },
    { delay: 1100, text: 'Calculating volumetric density & querying nutritional db...' }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      if (aiStatusText) aiStatusText.textContent = step.text;
    }, step.delay);
  });

  // Final delivery of results after simulated latency (1.4 seconds)
  setTimeout(() => {
    // Determine analysis data: either specific preset or synthetic custom item
    let resultData;
    if (state.currentFoodKey === 'custom') {
      resultData = {
        name: 'Detected: Mixed Healthy Bowl',
        confidence: '93.8%',
        calories: 520,
        protein: 26,
        carbs: 58,
        fat: 18,
        fiber: 6,
        statusClass: 'healthy',
        statusIcon: '✅',
        assessment: 'Good balance of complex carbs and lean protein with moderate fats.',
        suggestions: [
          'High micronutrient profile suitable for general wellness.',
          'Consider tracking dressing volume to prevent hidden oil calories.',
          'Great meal composition for maintaining stable blood glucose levels.'
        ]
      };
    } else {
      resultData = FOOD_DATABASE[state.currentFoodKey] || FOOD_DATABASE['chicken-rice'];
    }

    state.currentAnalysis = resultData;

    // Render results into UI
    renderAnalysisResult(resultData);

    // Reset button & scanner visuals
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <span>Analyze Food</span>
    `;
    if (previewWrapper) previewWrapper.classList.remove('scanning');
    if (aiStatusBox) aiStatusBox.classList.remove('visible');

    if (resultEmptyState) resultEmptyState.style.display = 'none';
    if (resultCard) {
      resultCard.classList.add('visible');
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast(`Food recognized: ${resultData.name}`);

    /**
     * =============================================================
     * FUTURE AI MODEL API INTEGRATION POINT (Gemini / OpenAI / Custom API):
     * =============================================================
     * Replace this simulated timeout with your real AI model API call:
     *
     * Option A: Backend / Custom AI Model API (FastAPI / Node.js)
     * const formData = new FormData();
     * formData.append("image", fileObject);
     * const response = await fetch("http://localhost:8000/api/analyze-food", {
     *   method: "POST",
     *   body: formData
     * });
     * const data = await response.json();
     * renderAnalysisResult(data);
     *
     * Option B: Direct Multimodal Vision API (e.g. Gemini / GPT-4o)
     * const response = await fetch("https://your-api-endpoint/vision", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json", "Authorization": "Bearer YOUR_API_KEY" },
     *   body: JSON.stringify({ image: state.currentImageData, prompt: "Analyze food macros and return JSON" })
     * });
     * =============================================================
     */
  }, 1400);
}

function renderAnalysisResult(food) {
  // Title & Confidence
  const foodTitle = document.getElementById('resFoodTitle');
  const foodConf = document.getElementById('resFoodConfidence');
  const resThumb = document.getElementById('resFoodThumb');

  if (foodTitle) foodTitle.textContent = food.name;
  if (foodConf) foodConf.textContent = `${food.confidence} Confidence`;
  if (resThumb && state.currentImageData) resThumb.src = state.currentImageData;

  // Macros
  setText('resCal', food.calories);
  setText('resPro', food.protein);
  setText('resCarb', food.carbs);
  setText('resFat', food.fat);
  setText('resFib', food.fiber);

  // Health Assessment Alert Box
  const assessBox = document.getElementById('resAssessmentBox');
  const assessIcon = document.getElementById('resAssessmentIcon');
  const assessText = document.getElementById('resAssessmentText');

  if (assessBox && assessText) {
    assessBox.className = `assessment-box ${food.statusClass}`;
    if (assessIcon) assessIcon.textContent = food.statusIcon;
    assessText.textContent = food.assessment;
  }

  // Suggestions List
  const suggestionsList = document.getElementById('resSuggestionsList');
  if (suggestionsList) {
    suggestionsList.innerHTML = food.suggestions.map(s => `
      <li class="suggestion-item">
        <span class="suggestion-bullet">✔</span>
        <span>${s}</span>
      </li>
    `).join('');
  }
}

// ---------------------------------------------------------------------------
// 7. Adding Scanned Meal to Today's Dashboard Log
// ---------------------------------------------------------------------------
function initLogButton() {
  const logBtn = document.getElementById('logMealBtn');
  if (!logBtn) return;

  logBtn.addEventListener('click', () => {
    if (!state.currentAnalysis) {
      showToast('Analyze an item before logging to dashboard.');
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLogEntry = {
      time: timeString,
      name: state.currentAnalysis.name,
      calories: state.currentAnalysis.calories,
      protein: state.currentAnalysis.protein,
      carbs: state.currentAnalysis.carbs,
      fat: state.currentAnalysis.fat
    };

    // Prepend to top of daily log
    state.dailyLog.unshift(newLogEntry);

    // Refresh Dashboard calculations and Chart
    updateDashboardUI();
    showToast(`Logged "${newLogEntry.name}" to today's intake!`);

    // Smooth scroll down to dashboard
    const dashSection = document.getElementById('dashboard');
    if (dashSection) {
      dashSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ---------------------------------------------------------------------------
// 8. Daily Dashboard & Chart.js Implementation
// ---------------------------------------------------------------------------
function initDashboard() {
  updateDashboardUI();
}

function updateDashboardUI() {
  // Aggregate daily totals
  const totals = state.dailyLog.reduce((acc, item) => {
    acc.calories += item.calories;
    acc.protein += item.protein;
    acc.carbs += item.carbs;
    acc.fat += item.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Update Numbers
  setText('dashCal', totals.calories.toLocaleString());
  setText('dashPro', `${totals.protein}g`);
  setText('dashCarb', `${totals.carbs}g`);
  setText('dashFat', `${totals.fat}g`);

  // Update Progress Bars
  setProgressBar('dashCalProgress', (totals.calories / DAILY_TARGETS.calories) * 100);
  setProgressBar('dashProProgress', (totals.protein / DAILY_TARGETS.protein) * 100);
  setProgressBar('dashCarbProgress', (totals.carbs / DAILY_TARGETS.carbs) * 100);
  setProgressBar('dashFatProgress', (totals.fat / DAILY_TARGETS.fat) * 100);

  // Render Log Table
  renderMealsTable();

  // Render / Update Chart.js
  renderNutritionChart(totals);
}

function renderMealsTable() {
  const tbody = document.getElementById('mealsTableBody');
  if (!tbody) return;

  if (state.dailyLog.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:#64748b;">No meals recorded today.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.dailyLog.map((meal, index) => `
    <tr>
      <td style="color:#64748b; font-size:0.82rem;">${meal.time}</td>
      <td style="font-weight:600; color:#f8fafc;">${meal.name}</td>
      <td><span style="color:#10b981; font-weight:700;">${meal.calories}</span> kcal</td>
      <td><span style="color:#06b6d4;">${meal.protein}g</span> P • <span style="color:#f59e0b;">${meal.carbs}g</span> C • <span style="color:#f43f5e;">${meal.fat}g</span> F</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="removeMeal(${index})" title="Remove item" style="padding: 2px 8px; font-size: 0.75rem;">
          ✕
        </button>
      </td>
    </tr>
  `).join('');
}

// Global removal function accessible by inline onclick
window.removeMeal = function(index) {
  if (state.dailyLog[index]) {
    const removed = state.dailyLog.splice(index, 1);
    updateDashboardUI();
    showToast(`Removed "${removed[0].name}"`);
  }
};

function renderNutritionChart(totals) {
  const ctx = document.getElementById('nutritionChart');
  if (!ctx) return;

  // Total macro weight in grams
  const macroTotal = (totals.protein + totals.carbs + totals.fat) || 1;
  const proPct = Math.round((totals.protein / macroTotal) * 100);
  const carbPct = Math.round((totals.carbs / macroTotal) * 100);
  const fatPct = Math.round((totals.fat / macroTotal) * 100);

  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    ctx.parentElement.innerHTML = `<div style="color:#94a3b8; text-align:center; padding:2rem;">Chart.js is loading or working in offline mode.<br>Protein: ${totals.protein}g | Carbs: ${totals.carbs}g | Fat: ${totals.fat}g</div>`;
    return;
  }

  const chartData = {
    labels: [
      `Protein (${totals.protein}g - ${proPct}%)`,
      `Carbs (${totals.carbs}g - ${carbPct}%)`,
      `Fat (${totals.fat}g - ${fatPct}%)`
    ],
    datasets: [{
      data: [totals.protein, totals.carbs, totals.fat],
      backgroundColor: [
        '#06b6d4', // Cyan (Protein)
        '#f59e0b', // Amber (Carbs)
        '#f43f5e'  // Rose (Fat)
      ],
      borderColor: '#090d16',
      borderWidth: 3,
      hoverOffset: 6
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 11, weight: '500' },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8
      }
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    }
  };

  if (nutritionChart) {
    nutritionChart.data = chartData;
    nutritionChart.update();
  } else {
    nutritionChart = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions
    });
  }
}

// ---------------------------------------------------------------------------
// 9. Utility Helpers
// ---------------------------------------------------------------------------
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setProgressBar(id, percent) {
  const el = document.getElementById(id);
  if (el) {
    const clamped = Math.min(Math.max(percent, 0), 100);
    el.style.width = `${clamped}%`;
  }
}

function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color:#10b981;">●</span>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
