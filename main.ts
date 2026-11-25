// Crowd sniper for "Pump.fun Paper Sprint: Any Bot Can Win" (make.fun).
// Run by the grader as `node /bot/main.ts` (Node 22, type stripping, no deps).
// Strategy: buy a new pump.fun launch only once a real crowd has shown up
// (>=12 distinct non-creator buyers in its first 40 slots, >=0.5 SOL net
// inflow, creator has not sold), build up to 0.3 SOL per coin within the 1%
// of-real-reserve buy cap, and ride it with a trailing stop (arm +15%, trail
// 25%) and a -10% stop-loss — no fixed take-profit, so a 5-15x runner pays
// for the many small losers. Guardrail probes keep the run above 20 round
// trips even on a quiet window. Fully deterministic: every decision is a
// pure function of the batches; no clock, no randomness, no I/O.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

// One strategy, one entry point: the grader executes this file twice and the
// two action logs must match byte for byte, so nothing here reads the clock,
// the environment, or any source of randomness.
await runBot(createStrategy(DEFAULT_PARAMS));
