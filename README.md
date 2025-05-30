# 👮‍♂️ SportsBooks

This is a React/Next.js-based web application that allows users to input and compare sportsbook odds across multiple teams and bet types (Moneyline, Puck Line, Over/Under Totals) to identify **arbitrage opportunities** in real time.

---

## 🚀 Features

- ✅ **Dynamic Sportsbook Input Table**
  Add odds from various sportsbooks for Moneyline, Puck Line, and Total/OverUnder bets.

- ✅ **Supports Multiple Sports and Teams**
  Input odds for two or more teams across different bet types.

- ✅ **Flexible Odds Format Input**

  - **Moneyline**: Enter American odds (e.g., `+150`, `-120`)
  - **Puck Line / Totals**: Enter Decimal odds (e.g., `1.91`, `2.05`)

- ✅ **Real-Time Arbitrage Detection**
  Instantly see when arbitrage exists, and how to split bets to guarantee a profit.

- ✅ **Profit and Payout Breakdown**
  For each arbitrage opportunity, see where to place your bets, the amount, and expected payouts.

- ✅ **Implied Probability Conversion**
  See how your odds translate to winning probabilities per bet type.

---

## 🏧 Tech Stack

- **Frontend:** React, Next.js, TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/UI, custom logic
- **State Handling:** Local state & component props
- **Utility Functions:** Custom odds conversion utilities

---

## 📂 Folder Structure

```bash
.
├── app/
│   ├── page.tsx                   # Entry page with Calculator component
│   └── components/
│       ├── Calculator.tsx         # Main calculator logic & layout
│       ├── SportsBooks.tsx        # Manages sportsbook input and selection
│       ├── SportsbookTable.tsx    # Odds entry UI per sportsbook/team
│       ├── ArbitrageResults.tsx   # Core logic for arb detection & results
│       └── ArbitrageResultsList.tsx # Aggregates and displays results
├── lib/
│   └── oddsConverter.ts           # Odds conversion helpers (American <-> Decimal)
├── public/                        # Sportsbook logos, etc.
├── styles/                        # Tailwind / Global styles
└── README.md
```

---

## 🧐 Arbitrage Logic

Arbitrage exists when the **inverse sum of all odds is less than 1**, meaning you can bet on all outcomes and lock in a profit.

Example (2 outcomes):

```ts
1 / decimalOdd1 + 1 / decimalOdd2 < 1;
```

The app calculates:

- **Total Investment**
- **Stake per Outcome**
- **Payout per Outcome**
- **Guaranteed Profit**

---

## 🔢 Odds Input Format

| Bet Type   | Input Format   | Display Span        |
| ---------- | -------------- | ------------------- |
| Moneyline  | `+150`, `-120` | Shows % probability |
| Puck Line  | `1.91`         | Shows American odds |
| Over/Under | `2.05`         | Shows American odds |

---

## 🖥️ Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/arbitrage-calculator.git
cd arbitrage-calculator
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the dev server

```bash
npm run dev
# or
yarn dev
```

### 4. Open in browser

Visit: `http://localhost:3000`

---

## 🛠️ Utilities

**Odds Conversion Helpers:** Located in `lib/oddsConverter.ts`

```ts
decimalToAmericanOdds(decimal: number): number
americanToDecimalOdds(american: number): number
moneylineToProbability(american: number): number
```

---

## 🧰 Testing

> Coming soon: Unit and integration tests with Playwright & Vitest.

---

## 📦 Deployment

You can deploy this app to:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Render**

Example:

```bash
vercel --prod
```

---

## 🙋‍♂️ Contributing

Contributions are welcome! Please submit pull requests or open issues.

---

## 📄 License

MIT License. See `LICENSE` file for details.

---

## 👨‍💻 Author

Developed by **John Parker**
Senior Software Engineer & Team Lead – [LinkedIn](https://linkedin.com/in/jp0624)

---

## 📸 Preview

![Screenshot](./public/screenshot.png)
