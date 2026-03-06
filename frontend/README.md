# 🚀 Portfolio Website

A clean, modern personal portfolio — ready to deploy on **GitHub Pages** or any static host.

Built with vanilla **HTML, CSS, and JavaScript** — zero dependencies, zero build step.

---

## 📁 Project Structure

```
portfolio/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles (CSS variables, responsive)
├── js/
│   ├── data.js         # ✏️  Edit this — your projects & skills
│   └── main.js         # App logic (typed text, animations, form)
├── assets/
│   └── resume.pdf      # Drop your resume here
└── README.md
```

---

## ✏️ Customisation Checklist

### 1. Personal Info (`index.html`)
- [ ] Replace `[Your Name]` with your name (search & replace, ~6 occurrences)
- [ ] Update `YN` logo initials in the nav and footer
- [ ] Update `<meta name="description">` for SEO
- [ ] Update GitHub / LinkedIn / Twitter links in the footer

### 2. Projects & Skills (`js/data.js`)
- [ ] Edit `PROJECTS` array with your real projects
- [ ] Edit `SKILLS` array with your tech stack
- [ ] Update `TYPED_STRINGS` with your roles/titles

### 3. Resume (`assets/`)
- [ ] Drop your `resume.pdf` into the `assets/` folder

### 4. Contact Form
The form currently simulates sending. To wire it to a real backend:

**Option A — Formspree (free, no backend needed)**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option B — Custom API** (see comment in `js/main.js`)
```js
const res = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message }),
});
```

---

## 🚀 Deploy to GitHub Pages

### Option 1 — Via GitHub UI
1. Push this folder to a GitHub repo
2. Go to **Settings → Pages**
3. Source: `Deploy from a branch` → `main` → `/ (root)`
4. Your site will be live at `https://yourusername.github.io/repo-name`

### Option 2 — Custom Domain
After enabling Pages, add a `CNAME` file with your domain:
```
yourdomain.com
```
Then point your DNS `A` records to GitHub's IPs (see GitHub docs).

---

## 🛠 Local Development

No build tools needed. Just open `index.html` in a browser, or use a dev server:

```bash
# Python
python3 -m http.server 3000

# Node (npx)
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

---

## 🎨 Theming

All colours are CSS variables in `css/style.css`:

```css
:root {
  --bg:      #0a0a0f;   /* page background */
  --accent:  #a78bfa;   /* purple highlight */
  --accent2: #38bdf8;   /* blue highlight */
  --green:   #4ade80;   /* "available" badge */
}
```

Change these to retheme the entire site instantly.

---

## 📄 License

MIT — do whatever you like with it.
