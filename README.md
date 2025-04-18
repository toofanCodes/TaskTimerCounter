# Task Timer Counter 

A lightweight, self‑hosted web app to track exactly how much time you spend on each bit of work—perfect for measuring the hours you invest per job application, sprint, or any project.

## 📝 Motivation

When I was applying for jobs, I wanted to keep a precise record of:

- **Time per application** (reading, coding tests, writing cover letters)  
- **Overall session productivity** (how long I spent in each “sprint” of work)  

I couldn’t find a free tool that let me break down my workflow into custom Projects → Sprints → Tasks → individual Elements, and everything worth using was locked behind a \$30–\$50/year subscription. So I leaned into the “vibe‑coding” era and built my own.

## 🚀 Features

- **Hierarchical Tracking**  
  Organize work into Projects, Sprints, Tasks, and then log each discrete Element you complete.  
- **Live Timer + Counter**  
  Start a timer on any task, auto‑save in the background, and hit “✓” to mark each Element done.  
- **Persistence & Autosave**  
  All logs are saved in JSON on your server (no database required), with file‑locking to prevent corruption.  
- **CSV Export**  
  Download a full breakdown of timestamps, durations, and totals to analyze in Excel or Google Sheets.  
- **Zero Subscription**  
  Fully open‑source and free—no per‑year fees.

## 💻 Tech Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript  
- **Backend:** Node.js + Express  
- **Storage:** `log.json` (append‑and‑lock via [`proper‑lockfile`](https://github.com/moxystudio/proper-lockfile))  
- **Deployment:** Any Node‑capable host (I’ll be running it on Vercel)

## 🚀 Getting Started

1. **Clone & install**  
   ```bash
   git clone https://github.com/your‑username/task‑timer.git
   cd task‑timer
   npm install
   ```
2. **Run the server**  
   ```bash
   npm start
   # → http://localhost:3000
   ```
3. **Use it!**  
   - Create a Project (e.g. “Company X Applications”)  
   - Start a Sprint (e.g. “April 2025”)  
   - Start or select a Task (e.g. “Algorithm Challenge”)  
   - Hit “Start Task” → work → hit “✓” on each completed element → export CSV when you’re done  

## 🤝 Contributing

Feel free to open issues or submit PRs—whether it’s a UI polish, dark‑mode tweak, or new reporting feature, I’d love your help!

---

Built out of personal need, now free for everyone. Enjoy, and happy tracking! 🎉

```
