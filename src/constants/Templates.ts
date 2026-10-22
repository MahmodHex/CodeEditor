export interface TemplateItem {
  id: string;
  title: string;
  category: 'web' | 'game' | 'uikit' | 'script' | 'python';
  description: string;
  ext: string;
  code: string;
}

export const BUILTIN_TEMPLATES: TemplateItem[] = [
  {
    id: 'web-blank',
    title: 'index.html',
    category: 'web',
    description: 'Modern HTML5 starter boilerplate with responsive viewport.',
    ext: '.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Page</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 20px; background: #fafafa; }
    h1 { color: #06B6D4; }
  </style>
</head>
<body>
  <h1>Hello Creator!</h1>
  <p>Start editing this responsive web page.</p>
</body>
</html>`
  },
  {
    id: 'game-canvas',
    title: 'game.html',
    category: 'game',
    description: '2D HTML5 Canvas arcade game with loop and controls.',
    ext: '.html',
    code: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; background: #0b0b12; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
    canvas { background: #000; border: 2px solid #EC4899; border-radius: 8px; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="320" height="320"></canvas>
  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let x = 50, y = 50, dx = 2, dy = 2;

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(x, y, 30, 30);
      x += dx; y += dy;
      if (x + 30 > canvas.width || x < 0) dx = -dx;
      if (y + 30 > canvas.height || y < 0) dy = -dy;
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'uikit-components',
    title: 'components.css',
    category: 'uikit',
    description: 'Modern UI Kit with buttons, cards, inputs and badge styles.',
    ext: '.css',
    code: `/* UI Kit Design System */
:root {
  --primary: #F59E0B;
  --bg-card: #FFFFFF;
  --text-main: #0F172A;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background: var(--primary);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.card {
  background: var(--bg-card);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  background: rgba(245, 158, 11, 0.15);
  color: var(--primary);
}`
  },
  {
    id: 'script-js',
    title: 'main.js',
    category: 'script',
    description: 'Pure JavaScript async logic, events and utility helpers.',
    ext: '.js',
    code: `// JavaScript Application Logic
console.log("Runner initialized successfully.");

async function fetchUserStats(userId) {
  try {
    console.log(\`Fetching stats for user ID: \${userId}...\`);
    return { id: userId, status: "Active", timestamp: Date.now() };
  } catch (error) {
    console.error("Execution error:", error);
  }
}

// Example execution
fetchUserStats(101).then(data => console.log("Result:", data));`
  },
  {
    id: 'script-python',
    title: 'app.py',
    category: 'python',
    description: 'Pure Python script with classes, functions and execution entry point.',
    ext: '.py',
    code: `# Python Application Script
import sys

class CodeRunner:
    def __init__(self, name):
        self.name = name

    def execute(self):
        print(f"Executing {self.name} on Python {sys.version.split()[0]}")
        return True

if __name__ == "__main__":
    runner = CodeRunner("CodeEditor Core")
    runner.execute()`
  }
];
