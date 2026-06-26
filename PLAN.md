# tahc — Full Rebuild Plan

## Concept

A private 2-person chat system disguised as a "random group chat with strangers."

**Public branding:** "Drop into a live conversation with strangers"
**Hidden reality:** Designed for 2 specific people to communicate privately
**Deception mechanism:** 6 bots with unique personalities fill the chat, making it look like a busy group
**Key rule:** The private-comms purpose is never surfaced in the UI

---

## Core Product Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Room model | Single global room | Small private audience, simplest routing |
| Capacity | 7 real users + 6 bots | Enough crowd noise, not overwhelming |
| Session length | Forced 11 minutes | Ephemeral feel, limits archive size |
| Session timer | Visible countdown | Creates urgency, fits "stranger chat" brand |
| Message history | None (per session only) | Privacy, forces fresh starts |
| Archive access | Creator only via magic link | pranavamk07@gmail.com |
| Bot AI | voidai.app (1-2 bots), scripted pool (4-5 bots) | Cost control + naturalness |
| Auth | Supabase anon auth for users, magic link for creator | Zero friction for users |

---

## Architecture Overview

```
Browser (React + Vite)
│
├── / ──── Landing page ("drop into a live conversation")
├── /chat ─ Main chat (anonymous, live, ephemeral)
└── /~ ─── Creator archive (magic link protected)
       │
       ▼
Supabase
│
├── DB: sessions, participants, messages tables
├── Realtime: channels per session (messages + participants)
├── Auth: anon for users, email magic link for creator
└── Edge Functions (Deno):
    ├── /join-session   — find/create session, issue client_token
    ├── /end-session    — compress → archive → cleanup → new session
    └── /bot-tick       — cron every 15s, fires due bots
         │
         ├── scripted driver: pull from personality.idlePool / triggerKeywords
         └── AI driver: POST voidai.app → timeout 5s → fallback to scripted
```

### Data Flow
```
Page load  →  /join-session  →  session_id + client_token + display_name
                                         │
                             Supabase Realtime channel (session_id)
                                         │
User types  →  supabase.insert(messages)  →  Realtime pushes to all subscribers
Bot cron    →  /bot-tick inserts messages →  same Realtime channel
                                         │
At 11min    →  /end-session fires (server cron)
            →  compress messages → sessions.archive jsonb
            →  delete messages rows
            →  set is_active=false  →  Realtime UPDATE → all clients see it
            →  create new session immediately
                                         │
Client      →  SessionEndOverlay (3s countdown) → rejoin new session
```

---

## Database Schema

### `sessions`
```sql
id            uuid        PRIMARY KEY DEFAULT gen_random_uuid()
started_at    timestamptz NOT NULL DEFAULT now()
ended_at      timestamptz NULL
is_active     boolean     NOT NULL DEFAULT true
user_count    integer     NOT NULL DEFAULT 0
archive       jsonb       NULL
```

### `participants`
```sql
id            uuid        PRIMARY KEY DEFAULT gen_random_uuid()
session_id    uuid        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE
display_name  text        NOT NULL
is_bot        boolean     NOT NULL DEFAULT false
bot_type      text        NULL           -- 'scripted' | 'ai'
joined_at     timestamptz NOT NULL DEFAULT now()
left_at       timestamptz NULL
client_token  text        NULL           -- anon token for real users
bot_state     jsonb       NULL           -- { next_speak_at, personality_id, messages_sent }
```

### `messages`
```sql
id              uuid        PRIMARY KEY DEFAULT gen_random_uuid()
session_id      uuid        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE
participant_id  uuid        NOT NULL REFERENCES participants(id)
display_name    text        NOT NULL     -- denormalized for speed
content         text        NOT NULL
type            text        NOT NULL DEFAULT 'chat'   -- 'chat' | 'emote' | 'info'
sent_at         timestamptz NOT NULL DEFAULT now()
```

### RLS Policies

```sql
-- sessions: creator read only
CREATE POLICY "creator_read_sessions" ON sessions
  FOR SELECT USING (auth.email() = 'pranavamk07@gmail.com');

-- participants: users read own row (by client_token claim), creator reads all
CREATE POLICY "user_read_own_participant" ON participants
  FOR SELECT USING (
    client_token = current_setting('request.jwt.claims', true)::json->>'client_token'
    OR auth.email() = 'pranavamk07@gmail.com'
  );

-- messages: users read current active session, creator reads all
CREATE POLICY "user_read_active_session_messages" ON messages
  FOR SELECT USING (
    session_id IN (SELECT id FROM sessions WHERE is_active = true)
    OR auth.email() = 'pranavamk07@gmail.com'
  );

CREATE POLICY "user_insert_messages" ON messages
  FOR INSERT WITH CHECK (
    session_id IN (SELECT id FROM sessions WHERE is_active = true)
    -- participant validation happens in edge function
  );
```

**Enable Realtime on:** `sessions`, `participants`, `messages`

---

## Archive Format

```json
{
  "session_id": "uuid",
  "started_at": "2026-06-03T14:00:00Z",
  "ended_at": "2026-06-03T14:11:00Z",
  "duration_seconds": 660,
  "real_user_count": 2,
  "total_participants": 8,
  "messages": [
    { "t": 12,  "n": "ash",   "c": "hey",           "k": "chat" },
    { "t": 34,  "n": "nova",  "c": "anyone here?",  "k": "chat" },
    { "t": 45,  "n": "river", "c": "* waves *",     "k": "emote" }
  ]
}
```

`t` = seconds elapsed from `started_at`. Export as plaintext: `[00:12] ash: hey`

---

## Bot System

### Personality Structure
```typescript
interface BotPersonality {
  id: string
  displayNamePool: string[]          // random pick each new session
  description: string                // system prompt for AI driver
  type: 'scripted' | 'ai'
  cadence: { minSeconds: number, maxSeconds: number }
  triggerKeywords: Record<string, string[]>   // "music" → ["what are you listening to?", ...]
  idlePool: string[]                 // fired when no keyword match
}
```

### 6 Bot Personalities (draft)

| ID | Display names | Vibe | Cadence | Type |
|----|---------------|------|---------|------|
| `nova` | nova, n0va, nov4 | Curious, asks questions, tech-adjacent | 20–55s | scripted |
| `ash` | ash, a5h, a_sh | Chill, minimal responses, lurker energy | 35–90s | scripted |
| `river` | river, r1ver | Philosophical, slightly dramatic | 25–70s | scripted |
| `pixel` | pixel, p1xel, px | Enthusiastic, internet-native slang | 15–45s | scripted |
| `echo` | echo, 3cho | Repeats/riffs on what others say | 20–60s | ai |
| `static` | static, st4tic | Cryptic, short, unpredictable | 40–120s | ai |

### Bot Driver Interface
```typescript
// Both drivers return a plain string. Caller inserts to messages identically.
interface BotDriver {
  generate(context: {
    bot: BotPersonality,
    recentMessages: Array<{ display_name: string, content: string }>
  }): Promise<string>
}

// ScriptedDriver: keyword scan → matched pool or idlePool
// AIDriver: POST voidai.app, timeout 5s, catch → fallback to ScriptedDriver
```

### `/bot-tick` Logic (runs every 15s via Supabase cron)
```
1. Get active session
2. SELECT participants WHERE is_bot=true AND bot_state->>'next_speak_at' <= now()
3. For each due bot:
   a. Fetch last 10 messages for context
   b. Check triggerKeywords against recent messages
   c. Generate message (scripted or AI driver)
   d. INSERT into messages
   e. UPDATE bot_state.next_speak_at = now() + random(min, max)
4. On new session: stagger bot join times (random 0–90s delay each)
```

---

## Session Lifecycle (step by step)

### Page Load → Active
1. Browser hits `/chat`
2. `useSession` hook fires `/join-session` edge function (POST, no auth header)
3. Edge function:
   - Find active session (`is_active = true`). If none: create one + insert 6 bots
   - Count real users (`is_bot = false AND left_at IS NULL`)
   - If count >= 7: return 429 with remaining seconds
   - Generate `display_name` (adjective + noun, e.g. "silent_moth")
   - Generate `client_token` (UUID)
   - Insert participant row
   - Return `{ session_id, client_token, display_name, session_started_at, participant_id }`
4. Client stores `client_token` + `session_id` in `sessionStorage` (dies on tab close)
5. `useRealtime` subscribes to `messages` + `participants` channels filtered to `session_id`
6. `useSession` subscribes to `sessions` row (watches `is_active`)

### During Session
- User sends: `supabase.from('messages').insert({ session_id, participant_id, display_name, content, type })`
- Bots fire via `/bot-tick` cron
- `SessionTimer` counts down from `660 - (now - session_started_at)` seconds
- User count in header = `participants.length` (bots included, no `is_bot` label)

### At 11 Minutes (server-authoritative)
1. Server cron fires `/end-session`
2. Fetch all messages for session, compress to archive jsonb
3. `UPDATE sessions SET archive=..., ended_at=now(), is_active=false`
4. `DELETE FROM messages WHERE session_id=...`
5. Create new session row immediately
6. Insert 6 bots into new session with staggered `next_speak_at`

### Client on Session End
1. Realtime UPDATE on `sessions` row: `is_active` → false
2. `useSession` triggers `onSessionEnd`
3. `SessionEndOverlay` renders: "Session ended. New session in 3..." countdown
4. After 3s: clear local messages, call `/join-session` again → new session

### Room Full
- `/join-session` returns `{ error: 'room_full', retry_after_seconds: N }`
- Client shows: "Room is full. Try again in MM:SS"
- Client retries automatically when timer hits zero

### Tab Close / Inactivity
- `client_token` in sessionStorage dies on tab close → participant slot stays until cleanup
- Cleanup cron (every 2min): participants with no message in 5min → `left_at = now()`

---

## Creator Archive (`/~`)

### Auth Flow
1. Navigate to `/~`
2. `useCreatorAuth`: calls `supabase.auth.getSession()`
3. No session → render `<CreatorLogin>`: email input + "Send magic link"
4. Submit: `supabase.auth.signInWithOtp({ email })`
5. User clicks email link → redirected to `/~?token_hash=...&type=email`
6. App exchanges hash: `supabase.auth.verifyOtp({ token_hash, type: 'email' })`
7. Session established. RLS checks `auth.email() = 'pranavamk07@gmail.com'`
8. Wrong email → authenticates fine but all queries return 0 rows (RLS blocks)

### UI
```
/~ (authed)
├── Header: "tahc archive" + sign out button
├── SessionList
│   └── rows: date, duration (MM:SS), real user count, total messages
│       └── click row → open SessionDetail
└── SessionDetail (selected session)
    ├── Metadata: started, ended, duration, N real users, N bot messages, N user messages
    ├── Transcript: scrollable, renders from archive.messages
    │   └── format: [MM:SS] display_name: content
    └── Export buttons:
        ├── "Export JSON"  → download archive as .json
        └── "Export Text"  → reconstruct [MM:SS] name: content per line
```

---

## File Change Map

### New files to create
```
src/lib/supabase.js                          Supabase client singleton
src/hooks/useSession.js                      Session join, state, is_active watcher
src/hooks/useRealtime.js                     Realtime subscriptions + sendMessage
src/hooks/useCreatorAuth.js                  Magic link auth + isCreator check
src/components/chat/SessionTimer.jsx         Countdown, warns red at <=60s
src/components/chat/SessionEndOverlay.jsx    Full-screen 3s transition
src/pages/Chat.jsx                           Main chat (renamed from HowTo.jsx)
src/pages/CreatorArchive.jsx                 /~ route shell
src/components/archive/CreatorLogin.jsx      Magic link form
src/components/archive/SessionList.jsx       Past sessions table
src/components/archive/SessionDetail.jsx     Transcript + export
supabase/migrations/001_initial.sql          Full schema + RLS + indexes
supabase/functions/join-session/index.ts     Find/create session, issue token
supabase/functions/end-session/index.ts      Archive, cleanup, start new session
supabase/functions/bot-tick/index.ts         Cron driver (15s)
supabase/functions/_shared/botPersonalities.ts  6 personality definitions
supabase/functions/_shared/voidaiClient.ts   voidai.app driver + fallback
.env.local                                   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

### Files to modify
```
src/App.jsx                  Add /chat and /~ routes. Wrap with Supabase context.
src/components/chat/UserList.jsx      Remove tripcode, no is_bot exposure
src/components/chat/Message.jsx       id→uuid, timestamp→ISO string, add isOwn prop
src/components/chat/ChatInput.jsx     Remove /whisper + /nick. Keep /me. 500-char limit.
src/utils/messageParser.js            formatTimestamp accepts ISO. Add formatElapsed(s).
package.json                          @supabase/supabase-js already installed
```

### Files to delete
```
src/hooks/useChat.js         Replaced by useSession + useRealtime
src/utils/mockData.js        All data from Supabase
src/pages/HowTo.jsx          Replaced by Chat.jsx
```

---

## Environment Variables

### `.env.local` (frontend, not committed)
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Supabase Edge Function secrets (set in dashboard → Edge Functions → Secrets)
```
VOIDAI_API_KEY=
VOIDAI_BASE_URL=https://voidai.app/v1   (assumed, confirm from docs)
CREATOR_EMAIL=pranavamk07@gmail.com
SUPABASE_SERVICE_ROLE_KEY=              (auto-injected by Supabase runtime)
```

---

## Implementation Phases

### Phase 1 — Supabase Foundation
- [ ] Create Supabase project (user action)
- [ ] Write `supabase/migrations/001_initial.sql`
- [ ] Apply migration via Supabase dashboard SQL editor
- [ ] Enable Realtime on sessions, participants, messages tables
- [ ] Create `.env.local` with project URL + anon key
- [ ] Create `src/lib/supabase.js`
- [ ] Deploy `/join-session` edge function, test with curl
- **Checkpoint:** curl `/join-session` returns a valid session_id + client_token

### Phase 2 — Live Chat Wiring
- [ ] Create `useSession.js` — calls /join-session, stores state, watches is_active
- [ ] Create `useRealtime.js` — Realtime channels, sendMessage
- [ ] Create `Chat.jsx` (from HowTo.jsx), swap hooks, update App.jsx routes
- [ ] Delete `useChat.js` and `mockData.js`
- **Checkpoint:** Two incognito tabs exchange messages in real-time

### Phase 3 — Session Lifecycle
- [ ] Deploy `/end-session` edge function
- [ ] Register end-session server cron (every 1 min, checks elapsed >= 660s)
- [ ] Create `SessionTimer.jsx` — countdown from session_started_at
- [ ] Create `SessionEndOverlay.jsx` — full-screen 3s transition
- [ ] Wire `useSession` to watch `is_active` Realtime UPDATE
- **Checkpoint:** Manually trigger end-session, verify archive stored, clients transition

### Phase 4 — Bot Engine
- [ ] Write `supabase/functions/_shared/botPersonalities.ts` (all 6)
- [ ] Deploy `/bot-tick` edge function (scripted path only)
- [ ] Register bot-tick cron (every 15s)
- [ ] Write `voidaiClient.ts` once voidai.app credentials provided
- [ ] Assign echo + static to AI type, test
- [ ] Tune cadence + keyword triggers
- **Checkpoint:** Open chat, wait 30s, 2+ bot messages appear naturally

### Phase 5 — Creator Archive
- [ ] Enable Supabase Auth email magic links in dashboard
- [ ] Create `useCreatorAuth.js`
- [ ] Add `/~` route to `App.jsx`
- [ ] Create `CreatorArchive.jsx`, `CreatorLogin.jsx`, `SessionList.jsx`, `SessionDetail.jsx`
- [ ] Test: request magic link, click, land on archive, view + export a session
- **Checkpoint:** Full transcript readable, JSON + text export working

### Phase 6 — Branding + Deception Polish
- [ ] Landing page (`/`): copy → "drop into a live conversation with strangers"
- [ ] Header user count: `participants.length` (bots + real, no label)
- [ ] Audit all UI text: remove any language hinting at private/2-person nature
- [ ] Remove irrelevant settings from SettingsPanel (color scheme etc already gone)
- [ ] Final bot timing: stagger-join visible, cadence feels organic
- **Checkpoint:** Fresh visitor reads chat and believes it's a random public group

---

## Open Items

1. **voidai.app credentials** — needed before Phase 4 AI driver implementation. Provide: API key, base URL, model name.
2. **Session timer visibility** — confirmed: visible countdown in UI ✓
3. **Display name wordlist** — need to pick adjective/noun pools for anonymous user names (e.g. "silent_moth", "dark_river"). Can use a hardcoded list of ~50 pairs or generate dynamically.
4. **Command set** — keeping `/me` only. Confirm: remove `/nick` and `/whisper` entirely? Or keep `/nick` for fun (just changes display_name locally for the session)?
5. **Bot stagger on new session** — bots join over 0–90s after session starts. Confirm this feels right vs all joining instantly.

---

## Notes

- `client_token` stored in `sessionStorage` → deliberately lost on tab close. Forces fresh participant slot. No cross-device continuity by design.
- Bots counted in user display total. Frontend never receives `is_bot` field. RLS ensures this.
- Archive compression: `t` field (seconds elapsed) instead of full timestamps saves ~60% jsonb size per message.
- `end-session` creates the new session synchronously before returning, so there's zero downtime between sessions.
- `/~` route is intentionally obscure (tilde prefix). No links point to it anywhere in the public UI.
