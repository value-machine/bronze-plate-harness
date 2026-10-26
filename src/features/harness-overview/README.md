# harness-overview

## Purpose

Welcome card on the home page that links visitors to the static overview of the agent harness (`public/harness.html`, with `public/harness-overview.png` as its preview). It is template onboarding content: every visitor sees it, signed in or not, on a preview URL and on the first local run.

## Structure

| Layer      | Path                                 | Purpose                                                     |
| ---------- | ------------------------------------ | ----------------------------------------------------------- |
| Components | `components/HarnessOverviewCard.tsx` | Card with the preview image and one link to `/harness.html` |

The page and the image are plain static files in `public/`, so they stay crawlable and need no JavaScript. The card is rendered by `src/pages/HomePage.tsx`.

## Dependencies

- Kit components `Card` and `Button` (`src/components/common/`), `formContentWidthClassName` from `src/shared/theme/appViewLayout`.
- `public/harness.html` and `public/harness-overview.png` (hand-written snapshot labelled with the harness version; update both when the loop or skills change, and re-screenshot the page for the PNG).

## Removing it from a fork

Delete this folder and the `HarnessOverviewCard` import and line in `src/pages/HomePage.tsx`. The two `public/harness*` files can go with it. No config flag exists on purpose (home-page card, owner, v0.43.0).
