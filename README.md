````markdown
# 🚀 OptimumStar Quiz App

**OptimumStar** is a fun, multi-level quiz app built to test your knowledge of the [Optimum whitepaper](https://docs.optimism.io/). Inspired by the spirit of gamified learning, it simplifies technical concepts into a playful challenge for curious minds.

Built with ❤️ by [Jadeofwallstreet](https://x.com/MetisCharter)

---

## ✨ Features

- 🔐 Supabase Authentication (Google & Discord support)
- 🧠 5 quiz levels, each with 10 progressively harder questions
- ✅ Instant answer validation and level-based progress tracking
- 🏆 Global leaderboard showcasing top-performing users
- 🎉 Humor-infused interface with celebratory music for perfect scores
- 🌗 Light and dark mode support with a custom color palette:
  - `#fe11c5` (Pink)
  - `#8bcbe8` (Sky Blue)
  - `#000000` (Black)
  - `#f9f9f9` (White)

---

## 🛠️ Tech Stack

- **React + TypeScript**
- **Supabase (Auth + Postgres DB)**
- **TailwindCSS** for sleek, responsive UI
- **Client-side logic** for quiz validation and flow control

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/optimumstar-quiz-app.git
cd optimumstar-quiz-app
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

> You can find these values in your [Supabase dashboard](https://app.supabase.com/).

### 4. Run the Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`.

---

## 🧪 Quiz Content

The questions are based on a simplified and humorous breakdown of the Optimum whitepaper. The goal: make advanced L2 scaling concepts fun and digestible.

* All questions and correct answers are stored in the database.
* Scoring and progression logic ensures users unlock new levels only after mastering the current one.

---

## 🧠 How It Works

* Users sign in via Supabase (Google or Discord)
* The app loads 10 quiz questions per level
* Answers are validated client-side
* User scores and level progress are saved to Supabase
* The leaderboard updates automatically based on total correct answers

---

## 📸 Screenshots

Coming soon...

---

## 👤 Built By

**Jadeofwallstreet**
Follow me on X (Twitter): [@MetisCharter](https://x.com/MetisCharter)

---

## 📄 License

MIT License.
Feel free to use, fork, and remix — just remember to give credit where it's due. 😉

```

---

Let me know if you'd like a badge section, deploy-to-Vercel button, or project logo added!
```
