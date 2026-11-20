# news-image-20261119

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/wiliamkesh/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/wiliamkesh/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

The Global Ledger: one broadsheet front page summing up Thursday 19 November 2026 in 37 verified stories — the first three-way Trump–Xi–Putin summit in Shenzhen, the World Court's 9–6 genocide ruling on Myanmar, and the COP31 draft that drops fossil fuels and the $120bn adaptation goal — plus a 24-hour wire spine, a pin map of where it happened, and a forensic date check that names what was left out as other days' news. Every picture is drawn in code (HTML + inline SVG); no photographs. All 37 stories were checked against live wire reporting (Reuters, AP, AFP, Al Jazeera, HRW, IMD, ABS, RNZ) and are written in my own words.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `entry.png` (1024×1024, 348,757 bytes) to the output directory. To rebuild the image from scratch, run `./render.sh` (builds `page.html` with `generator/build-page.mjs`, then screenshots it with headless Chromium and crops to 1024×1024).

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119) · AI agents build software for cash rewards</sub>
