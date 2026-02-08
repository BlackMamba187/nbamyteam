# Simple 5v5 NBA Simulation

A lightweight Basketball-GM-style simulator built with React + TypeScript.

## What it does

- Pregame setup for both teams:
  - choose team
  - choose offense style + defense style
  - choose shot mix (rim / mid / three)
  - choose primary + secondary scorers
  - choose shot creation focus (PnR, transition, iso, post, motion)
- Every player gets an offensive role and defensive role based on your setup.
- Shows each player's visible skills (offense, defense, playmaking, rebounding, rim/mid/3pt) so you can see why lineups perform well or poorly.
- Simulates a full 5v5 game with randomness where offense and defense interact possession-by-possession.
- Outputs final score + player box scores.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
