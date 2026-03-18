# 🌿 הסוכן האישי — כושר ותזונה

## פריסה ב-Vercel (5 דקות)

### שלב 1 — העלה ל-GitHub
1. כנס ל-[github.com](https://github.com) וצור repository חדש בשם `fitness-agent`
2. העלה את כל הקבצים

### שלב 2 — פרוס ב-Vercel
1. כנס ל-[vercel.com](https://vercel.com) והתחבר עם GitHub
2. לחץ **Add New Project** ובחר את ה-repo
3. בחלק **Environment Variables** הוסף:
   - `ANTHROPIC_API_KEY` = המפתח שלך מ-[console.anthropic.com](https://console.anthropic.com)
4. לחץ **Deploy**

### זהו! תוך דקה תקבל קישור כמו:
`https://fitness-agent-xxx.vercel.app`

---

## פיתוח מקומי
```bash
npm install
cp .env.example .env.local
# ערוך את .env.local והוסף את המפתח שלך
npm run dev
```
פתח [http://localhost:3000](http://localhost:3000)
