# Pump.fun Paper Sprint — Crowd Sniper

[![make.fun · u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b.svg)](https://make.fun/bounty/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b?utm_source=github&utm_medium=readme&utm_campaign=u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![rank](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/davlermid/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/rank.svg)](https://make.fun/bounty/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![reward](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/davlermid/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/reward.svg)](https://make.fun/bounty/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b?utm_source=github&utm_medium=readme&utm_campaign=u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)

A paper-trading bot for the [Pump.fun Paper Sprint: Any Bot Can Win](https://make.fun/bounty/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b) bounty ($2, winner takes all, ranked by Net PnL on a 6-hour replay of real pump.fun data). One program, `main.ts` (Node 22, no dependencies), speaking the `agent-fun/replay/v2` protocol via the vendored SDK shim.

## Strategy — crowd sniper

Most pump.fun launches go to zero; a few run 5–15x. This bot does the opposite of the classic launch sniper: instead of racing to be first, it waits for proof that a real crowd is piling in, then rides the move with a trailing stop and no fixed take-profit, so the rare runner pays for the many small losers.

- **Entry (first 40 slots after creation):** at least 12 distinct non-creator buyers, at least 0.5 SOL net inflow, creator has not sold, price run-up 0–50% from creation, real SOL reserve 0.5–60 SOL.
- **Size:** up to 0.3 SOL per coin, added in tranches within the 1%-of-real-reserve per-reply buy cap (97% of the cap, for margin).
- **Exits:** −10% stop-loss, trailing stop (arms at +15%, exits on a 25% fall from the peak value), 3000-slot max hold, exit at once if the creator sells or the coin goes 1500 slots without a trade. No fixed take-profit.
- **Guardrail:** tiny 0.01 SOL probe round trips keep the run on pace for the 20-coin / 0.01 SOL round-trip minimum even on a quiet window.
- **Determinism:** every decision is a pure function of the batches — no clock, no randomness, no I/O — so two executions produce byte-identical action logs.

## Dev-window backtest (local replay of the kit's frozen 24 h dataset)

| | |
|---|---|
| Net PnL | **+0.900 SOL** |
| Fills / coins / round trips | 528 / 120 / 177 |
| Max drawdown | 6.6% (limit 50%) |
| Coins with round trip ≥ 0.01 SOL | 119 (guardrail needs 20) |
| Net PnL at 2x fees | +0.641 SOL |

Same window, for comparison: pilot momentum −9.38 SOL, pilot reversion −4.02 SOL, pilot sniper −0.49 SOL, hold-cash 0. The win is fat-tailed — one +1.61 SOL runner in 24 h carries it — so the final 6 h window is a shot at catching a runner, which is exactly what a winner-takes-all bounty rewards.

## Run it

```sh
node main.ts
```

The grader runs `node /bot/main.ts` with this directory mounted at `/bot`; the bot reads the harness protocol on stdin and writes one reply per batch on stdout. `strategy.ts` holds the strategy (parameterised, `DEFAULT_PARAMS` is the shipped setting); `vendor/makefun-bot.ts` is a byte-identical copy of the kit's `sdk/ts/makefun-bot.ts`.

## License

MIT — see [LICENSE](LICENSE).
