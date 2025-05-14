````markdown
# 🚀 Succinct Quiz App

A sleek, multi-level quiz application designed to test your knowledge of the Succinct Network whitepaper. Built with ❤️ by [Jadeofwallstreet](https://x.com/MetisCharter).

---

## ✨ Features

- 🔐 Supabase Auth (with Google/Discord login)
- 🧠 5 quiz levels with 10 questions each, increasing in difficulty
- ✅ Real-time answer checking and progress tracking
- 🏆 Public leaderboard showing top quiz scorers
- 🎉 Fun and humorous UX flow with congratulatory music
- 🌗 Light/Dark mode with a custom color palette:
  - `#fe11c5` (Pink)
  - `#8bcbe8` (Sky Blue)
  - `#000000` (Black)
  - `#f9f9f9` (White)

---

## 🛠️ Tech Stack

- **React (TypeScript)**
- **Supabase (Auth + Database)**
- **TailwindCSS** for styling
- **Custom routing and state management**

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/succinct-quiz-app.git
cd succinct-quiz-app
````

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file with the following:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your [Supabase dashboard](https://app.supabase.com/).

---

### 4. Run the development server

```bash
npm run dev
```

---

## 🧪 Quiz Content

The quiz pulls from a custom database of simplified questions extracted from the [Succinct whitepaper](https://docs.succinct.xyz/docs/network/whitepapers), rewritten with humor and clarity.

All correct answers are tracked in the database and user scores update automatically.

---

## 🧠 How It Works

* Users authenticate with Supabase (Discord or Google)
* Questions load dynamically per level
* Answer checking is done client-side against stored correct answers
* Level progress and scores are stored in Supabase
* Leaderboard ranks users by total correct answers

---

## 📸 Screenshots

*Coming soon*

---

## 👤 Built By

**Jadeofwallstreet**
Follow on X: [@MetisCharter](https://x.com/MetisCharter)

---

## 📄 License

MIT License. Use it, remix it, just don’t forget to credit. 😉


