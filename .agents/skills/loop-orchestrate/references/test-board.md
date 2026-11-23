# Test board

How [`loop-orchestrate`](../SKILL.md) step 4 keeps the owner's Stop 2 work in one private artifact instead of the chat (test-board D1–D9). In a long run, test steps posted in chat get buried under thread traffic. The orchestrator then restates them, which buries the owner in text and burns tokens. On the board, each test lives in one place that stays visible, and the owner reports back there.

**Surface.** Only where the host publishes artifacts with the `artifact` capability (Claude app, claude.ai/code). Elsewhere (Cursor, a terminal without the Artifact tool) Stop 2 stays in chat in the [`loop-verdict`](../../loop-verdict/SKILL.md) format. If a run moves to such a surface, post every open card as that chat handoff once. A verdict typed in chat ("pass CSV export") is always accepted, board or not.

## What the board holds

One card per PR at Stop 2: the task title, PR link, preview link, the [`loop-verdict`](../../loop-verdict/SKILL.md) step 1 content (steps to try, each with what the owner should see; what checks couldn't cover; choices the owner would notice), a ✓ / ✗ and note per step, **Pass / Change / Drop**, and a message thread between the owner and the orchestrator. Merged and dropped laps move to a collapsed *Done* list. Questions that aren't about a PR at Stop 2 (stop-list questions from threads, new tasks) still go to chat with the question tool.

## Files

A multi-file artifact with one writer per file, so saves from the two sides never conflict (test-board D7):

| File | Writer | Holds |
|---|---|---|
| `index.html` | nobody after creation | the page (§ Page template) |
| `board.json` | the orchestrator, through the `Artifact` tool | cards, replies, which owner entries are handled |
| `owner.json` | the page, through the files form of `artifact.publish` with `ifMatch` | the owner's verdicts and messages, append-only |

`board.json`:

```json
{
  "run": "run-2026-11-23",
  "cards": [
    {
      "lap": "csv-export",
      "round": 2,
      "title": "Export tasks as CSV",
      "pr": "https://github.com/<owner>/<repo>/pull/42",
      "preview": "https://<preview-host>/",
      "state": "ready",
      "steps": [{ "try": "Open Tasks, tap Export", "see": "a CSV downloads with every task" }],
      "uncovered": "Large backlogs (over 1,000 tasks) not tried",
      "picked": "",
      "replies": [{ "text": "New preview with due dates.", "at": "2026-11-23T10:00:00Z" }]
    }
  ],
  "handled": ["e-1732350000000-a1b2"],
  "done": [{ "title": "Avatar in top bar", "pr": "https://github.com/<owner>/<repo>/pull/41", "outcome": "merged" }]
}
```

`owner.json`:

```json
{
  "entries": [
    {
      "id": "e-1732350000000-a1b2",
      "lap": "csv-export",
      "round": 1,
      "kind": "verdict",
      "verdict": "change",
      "text": "Needs due dates",
      "results": [{ "result": "fail", "note": "no due date column" }],
      "at": "2026-11-23T09:40:00Z"
    }
  ]
}
```

- `state`: `ready` to test · `changing` while a Change is with its thread · `merging` after a Pass.
- `round` starts at 1 and goes up with every new preview of that PR. An entry for an older round is stale.
- `kind`: `verdict` (`verdict`: `pass` · `change` · `drop`; `results` are the step ticks for that round) or `message` (`text` only).
- The page keeps ticks and notes on the device while the owner tests and sends them only with a verdict. A tick on its own never saves, so it never wakes the orchestrator (test-board D8).
- Each sent entry shows *waiting for the orchestrator* on the card until its `id` appears in `handled`.

## Orchestrator steps

1. **Create** the board at the first Stop 2 of a run, unless step 6 finds one. Copy § Page template to `<scratchpad>/test-board/index.html` and change its `<title>` to `Test board · <run>` (the tag names the artifact; the publish `title` parameter doesn't override it). Write `board.json` and `owner.json` (`{"entries": []}`) next to it, and publish once: `file_path` is the page, `files` holds both JSON files, `capabilities: {artifact: {}}`, icon `checklist`. Load the artifact skills the host requires before that first publish; the template already meets the page contract. The publish result says whether this session now watches the board. The watch is what turns the owner's saves into turns here.
2. **Write** only `board.json` after that: republish that one file to the board's `url`. Never write `owner.json`. Add a card when a PR reaches Stop 2. When a Change round brings a new preview, raise the card's `round`, replace its steps and set `state` to `ready`.
3. **Read** `owner.json` (`Artifact` read with `path: "owner.json"`) on every board wake-up, and also on every other event (a thread report, an owner message). If the watch misses a save, the next event still finds it. Act on each entry whose `id` isn't in `handled`:
   - **Verdict for the card's current round:** act as in [`loop-orchestrate`](../SKILL.md) step 4. Pass: sweep, then merge. Change: send the ✗ steps, their notes and `text` to the thread. Drop: close. A verdict on the board counts exactly like one in chat (test-board D2). Then set `state`, add a one-line reply, and add the `id` to `handled`.
   - **Verdict for an older round:** don't act. Reply that it was for an earlier preview, and mark it handled.
   - **Message:** answer it with a reply on the card, relaying to the thread when only the thread can answer, and mark it handled.
   Write all of it back to `board.json` in one publish per event.
4. **Chat** carries only the board link and one line per change: `Test board: <url> · To test: <titles> · Merged: <titles>`. Never repeat steps or verdict questions in chat (test-board D3). With the away switch on, cards still land on the board, and the chat line names them.
5. **Close** the run by leaving every card under *Done*. The next run creates a new board.
6. **Resume** after an orchestrator restart (`loop-orchestrate` step 1): find the run's board with `Artifact` list (title `Test board · <run>`), read `board.json` and `owner.json`, and watch it again (`ArtifactComments` with `action: "watch"` and its `url`). Never create a second board for a run that has one. Rebuild the local page file from § Page template if the scratchpad is gone; only `board.json` is published from now on.

## Page template

Copy as-is; the page fills itself from the two JSON files.

```html
<title>Test board</title>
<style>
:root{--bg:#f7f7f5;--card:#fff;--text:#1d1d1b;--muted:#6b6b66;--line:#e3e2dc;--ok:#1f7a3f;--fail:#b3261e;--accent:#2f5fd0;--chip:#efeee9}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#161614;--card:#1f1f1c;--text:#ecebe6;--muted:#a3a29c;--line:#34332f;--ok:#5cc184;--fail:#f08a82;--accent:#8aa9ff;--chip:#2a2a26}}
:root[data-theme="dark"]{--bg:#161614;--card:#1f1f1c;--text:#ecebe6;--muted:#a3a29c;--line:#34332f;--ok:#5cc184;--fail:#f08a82;--accent:#8aa9ff;--chip:#2a2a26}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:760px;margin:0 auto;padding:20px 16px 48px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:0}
.sub,.muted{color:var(--muted);font-size:13px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:16px 0}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0}
.chip{background:var(--chip);border-radius:99px;padding:2px 10px;font-size:12px}
a{color:var(--accent)}
ol{padding-left:20px;margin:12px 0}li{margin:0 0 12px}
.see{color:var(--muted)}
button{font:inherit;border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:8px;padding:6px 12px;min-height:40px;cursor:pointer}
button:disabled{opacity:.5;cursor:default}
button[aria-pressed="true"].ok{border-color:var(--ok);color:var(--ok)}
button[aria-pressed="true"].fail{border-color:var(--fail);color:var(--fail)}
button.primary{background:var(--accent);border-color:var(--accent);color:var(--bg)}
textarea,input{font:inherit;width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--bg);color:var(--text)}
.msgs p{margin:6px 0}.msgs b{font-weight:600}
details{margin-top:24px}
.banner{background:var(--chip);border-radius:8px;padding:8px 12px;margin:12px 0}
</style>
<main>
  <h1>Test board</h1>
  <div class="sub" id="sub">Loading…</div>
  <div id="banner"></div>
  <div id="cards"></div>
  <details id="done"><summary>Done</summary><ul id="doneList"></ul></details>
</main>
<script>
(() => {
  let board = null, owner = { entries: [] }, ownerSha = null, api, saving = false;
  const armed = {};
  const $ = (id) => document.getElementById(id);
  const el = (tag, props = {}, kids = []) => { const n = Object.assign(document.createElement(tag), props); kids.forEach((k) => n.append(k)); return n; };
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const PENDING = "tb-pending";
  const tickKey = (c) => "tb-ticks:" + c.lap + "#" + c.round;
  const banner = (t) => $("banner").replaceChildren(t ? el("div", { className: "banner", textContent: t }) : "");
  const sha = async (text) => { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); };
  async function loadJson(name) { const r = await fetch(name + "?t=" + Date.now(), { cache: "no-store" }); if (!r.ok) throw new Error(name); const text = await r.text(); return { data: JSON.parse(text), hash: await sha(text) }; }

  async function sendPending() {
    if (saving) return;
    const pending = store.get(PENDING, []).filter((p) => !owner.entries.some((e) => e.id === p.id));
    store.set(PENDING, pending);
    if (!pending.length) return;
    if (api === undefined) { banner("Connecting… your answer is kept and sent in a moment."); return; }
    if (api === null) { banner("Saving isn't available in this view. Open the board in the Claude app, or type your verdict in chat (for example: pass " + pending[0].lap + ")."); return; }
    saving = true; render();
    const text = JSON.stringify({ entries: owner.entries.concat(pending) }, null, 2);
    try {
      const res = await api.publish({ "owner.json": { content: text, contentType: "application/json", ifMatch: ownerSha } });
      owner = JSON.parse(text); ownerSha = (res.shas && res.shas["owner.json"]) || (await sha(text));
      store.set(PENDING, []); banner("Sent. The orchestrator picks it up on its next turn.");
    } catch (e) {
      const code = e && e.code;
      if (code === "conflict") { banner("The board changed. Sending again…"); try { const o = await loadJson("owner.json"); owner = o.data; ownerSha = o.hash; } catch {} saving = false; setTimeout(sendPending, 800); return; }
      if (code === "rate_limited") banner("Sending too often. It goes out on your next action.");
      else if (code === "upstream_error") { saving = false; setTimeout(sendPending, 1500 + Math.random() * 1000); return; }
      else { api = null; banner("Saving isn't available in this view. Type your verdict in chat (for example: pass " + pending[0].lap + ")."); }
    }
    saving = false; render();
  }

  function queue(entry) { const p = store.get(PENDING, []); p.push(Object.assign({ id: "e-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6), at: new Date().toISOString() }, entry)); store.set(PENDING, p); sendPending(); }

  function stepItem(card, i, ticks) {
    const t = ticks[i] || (ticks[i] = { result: null, note: "" });
    const persist = () => store.set(tickKey(card), ticks);
    const mark = (val, label, cls) => el("button", { className: cls, textContent: label, ariaPressed: String(t.result === val), onclick: () => { t.result = t.result === val ? null : val; persist(); render(); } });
    const s = card.steps[i];
    return el("li", {}, [el("div", { textContent: s.try }), el("div", { className: "see", textContent: "You should see: " + s.see }), el("div", { className: "row" }, [mark("ok", "✓ Works", "ok"), mark("fail", "✗ Not right", "fail")]), el("input", { placeholder: "Note (optional)", value: t.note, oninput: (e) => { t.note = e.target.value; persist(); } })]);
  }

  function verdictRow(card, ticks, noteBox) {
    const k = card.lap + "#" + card.round;
    const send = (v) => { const text = noteBox.value.trim(); if (v !== "pass" && !text && !ticks.some((t) => t && t.result === "fail")) { banner("Say what should change: mark a step ✗ or write a note."); noteBox.focus(); return; } armed[k] = null; queue({ lap: card.lap, round: card.round, kind: "verdict", verdict: v, text, results: ticks }); };
    const btn = (v, label, cls) => el("button", { className: cls, disabled: saving, textContent: armed[k] === v ? "Tap again to " + { pass: "merge", change: "send", drop: "close the PR" }[v] : label, onclick: () => { if (armed[k] === v) send(v); else { armed[k] = v; render(); } } });
    return el("div", { className: "row" }, [btn("pass", "Pass", "primary"), btn("change", "Change", ""), btn("drop", "Drop", "")]);
  }

  function cardNode(card) {
    const handled = new Set(board.handled || []);
    const mine = owner.entries.concat(store.get(PENDING, [])).filter((e) => e.lap === card.lap);
    const waiting = mine.some((e) => !handled.has(e.id) && (e.kind === "message" || e.round === card.round));
    const label = waiting ? "Waiting for the orchestrator" : { ready: "Ready to test", changing: "Change in progress", merging: "Merging" }[card.state] || card.state;
    const kids = [el("div", { className: "row" }, [el("h2", { textContent: card.title }), el("span", { className: "chip", textContent: label })]), el("div", { className: "row" }, [el("a", { href: card.preview, target: "_blank", rel: "noopener", textContent: "Open preview" }), el("a", { href: card.pr, target: "_blank", rel: "noopener", textContent: "PR" })])];
    if (card.state === "ready" && !waiting) {
      const ticks = store.get(tickKey(card), []);
      kids.push(el("ol", {}, card.steps.map((_, i) => stepItem(card, i, ticks))));
      if (card.uncovered) kids.push(el("p", { className: "muted", textContent: "Checks couldn't cover: " + card.uncovered }));
      if (card.picked) kids.push(el("p", { className: "muted", textContent: "I picked: " + card.picked }));
      const noteBox = el("textarea", { rows: 2, placeholder: "What should change? (needed for Change or Drop)" });
      kids.push(noteBox, verdictRow(card, ticks, noteBox));
    }
    const thread = mine.map((e) => ({ at: e.at, who: "You", text: e.kind === "verdict" ? e.verdict.toUpperCase() + (e.text ? ": " + e.text : "") : e.text })).concat((card.replies || []).map((r) => ({ at: r.at, who: "Orchestrator", text: r.text }))).sort((a, b) => String(a.at).localeCompare(String(b.at)));
    kids.push(el("div", { className: "msgs" }, thread.map((m) => el("p", {}, [el("b", { textContent: m.who + ": " }), m.text]))));
    const ask = el("input", { placeholder: "Message the orchestrator about this PR" });
    kids.push(el("div", { className: "row" }, [ask, el("button", { textContent: "Send", disabled: saving, onclick: () => { const t = ask.value.trim(); if (t) queue({ lap: card.lap, round: card.round, kind: "message", text: t }); } })]));
    return el("section", { className: "card" }, kids);
  }

  function render() {
    const cards = board.cards || [];
    $("sub").textContent = cards.length ? cards.length + " on the board" : "Nothing to test right now.";
    $("cards").replaceChildren(...cards.map(cardNode));
    $("doneList").replaceChildren(...(board.done || []).map((d) => el("li", {}, [el("a", { href: d.pr, target: "_blank", rel: "noopener", textContent: d.title }), " · " + d.outcome])));
    $("done").hidden = !(board.done || []).length;
  }

  async function boot() {
    try { board = (await loadJson("board.json")).data; const o = await loadJson("owner.json"); owner = o.data; ownerSha = o.hash; }
    catch { $("sub").textContent = "Couldn't load the board. Ask the orchestrator in chat."; return; }
    render();
    try { api = (window.claude && (await window.claude.use("artifact"))) || null; } catch { api = null; }
    sendPending();
  }
  boot();
})();
</script>
```
