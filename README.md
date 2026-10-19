# Playwright: travel booking E2E

End-to-end test of a tour booking flow on a live travel website, written with Playwright Test.

## Scenario

`tests/example.spec.js` walks the full purchase funnel:

1. Search for tours to a destination
2. Pick a random hotel from the search results and open its page in a new tab
3. Choose a tour offer and wait for price actualization (handles the "price changed" popup)
4. Select a flight option
5. Fill in contact details and proceed to checkout
6. Verify the checkout URL after each step and after a page reload

The test deals with real-site instability: dismisses overlays, waits for dynamic content, and checks every navigation by URL.

## Config

- Headed Chromium with `slowMo` for visual debugging
- Video kept on failure, screenshots on failure
- HTML reporter, trace on first retry

## Run

```bash
npm install
npx playwright install chromium
npx playwright test
```
