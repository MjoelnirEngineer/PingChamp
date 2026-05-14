# 🏗️ PingChamp Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PingChamp Application                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                     Header Component                      │ │
│  │  [ 💾 Save Config ]  [ 📂 Load Config ]  [ 🗑️ Clear All ] │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────┬────────────────────────────────────┐ │
│  │  Target List Panel   │     Graphs & Stats Panel          │ │
│  │  (Left Side)         │     (Right Side)                  │ │
│  │                      │                                    │ │
│  │  ┌────────────────┐  │  ┌─────────────────────────────┐  │ │
│  │  │ Add New Target │  │  │ [Target 1 Stats]            │  │ │
│  │  │ Host: ___      │  │  │ Avg: 45ms Min: 32ms Max: 89ms  │  │ │
│  │  │ Interval: ___  │  │  │ Success: 98%                │  │ │
│  │  │ Max Time: ___  │  │  │                              │  │ │
│  │  │ [Add Target]   │  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░  │  │ │
│  │  └────────────────┘  │  │ (Graph with bars)            │  │ │
│  │                      │  │ Green = Success, Red = Fail   │  │ │
│  │  ┌────────────────┐  │  └─────────────────────────────┘  │ │
│  │  │ google.com     │  │                                    │ │
│  │  │ 🟢 Pinging     │  │  ┌─────────────────────────────┐  │ │
│  │  │ Interval: 5000 │  │  │ [Target 2 Stats]            │  │ │
│  │  │ Max: 300000    │  │  │ Avg: 38ms Min: 28ms Max: 120ms │ │
│  │  │ [▶️ Stop]      │  │  │ Success: 95%                │  │ │
│  │  │ [❌ Remove]    │  │  │                              │  │ │
│  │  └────────────────┘  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░  │  │ │
│  │                      │  │ (Graph with bars)            │  │ │
│  │  ┌────────────────┐  │  └─────────────────────────────┘  │ │
│  │  │ 8.8.8.8        │  │                                    │ │
│  │  │ ⚪ Stopped     │  │                                    │ │
│  │  │ Interval: 2000 │  │                                    │ │
│  │  │ Max: 120000    │  │                                    │ │
│  │  │ [▶️ Start]     │  │                                    │ │
│  │  │ [❌ Remove]    │  │                                    │ │
│  │  └────────────────┘  │                                    │ │
│  │                      │                                    │ │
│  └──────────────────────┴────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
Frontend (Angular)
│
├─ TargetService (State Management with Signals)
│  └─ Observable: targets$ (list of PingTarget objects)
│
├─ PingService (Handles Pinging)
│  ├─ startPinging(host, interval) → Creates setInterval
│  ├─ performPing(host) → HTTP GET /api/ping?host=X
│  └─ Observable: pingResults$ (list of PingResult objects)
│
├─ FileService (Save/Load Configs)
│  ├─ saveToFile(targets) → Downloads .pingchamp
│  └─ loadFromFile(file) → Returns Promise<PingTarget[]>
│
└─ Components (React to Services)
   ├─ Header (UI for Save/Load/Clear)
   ├─ TargetList (Add targets, manage pinging)
   └─ PingGraph (Display results, calculate stats)
       │
       └─ HTTP Request (every interval)
              │
              ▼
Backend (Express.js)
│
└─ GET /api/ping?host=google.com
   │
   ├─ Validate hostname
   ├─ Execute ICMP ping via 'ping' library
   └─ Return { success: bool, responseTime: ms }
       │
       ▼
Frontend receives response
│
├─ Add to pingResults$ Observable
├─ Components subscribe and update UI
└─ Graph updates with new bar
```

## Component Hierarchy

```
App
├── Header
│   └── Buttons: Save, Load, Clear
│
└── MainContent
    ├── TargetList (Left Panel)
    │   ├── Add Target Form
    │   └── Target List
    │       └── TargetCard (repeated)
    │           ├── Display Name & ID
    │           ├── Start/Stop Button
    │           └── Settings (Interval, Max Time, Remove)
    │
    └── PingGraph (Right Panel)
        └── GraphCard (repeated for each target)
            ├── Header (Target name + Status)
            ├── Statistics (Avg, Min, Max, Success %)
            ├── Graph
            │   ├── Y-Axis (milliseconds)
            │   └── Bars (green/red for responses)
            ├── Legend (Color explanation)
            └── Info (Data points, Status)
```

## Service Interactions

### Scenario: User adds target and starts pinging

```
1. User enters "google.com" and clicks "Add Target"
   └─> TargetList calls targetService.addTarget("google.com")
       └─> Creates PingTarget with ID, host, default interval/maxTime
           └─> Updates targets$ Observable
               └─> PingGraph component receives new target
                   └─> Creates new GraphCard in the grid

2. User clicks "▶️ Start" button
   └─> TargetList calls pingService.startPinging(host, interval)
       └─> Creates setInterval that runs every 5000ms
           └─> Calls performPing(host)
               └─> Makes HTTP GET to /api/ping?host=google.com
                   └─> Backend responds with {success, responseTime}
                       └─> pingService adds to pingResults$ Observable
                           └─> PingGraph receives result
                               └─> Updates graph with new bar
                                   └─> Calculates new statistics
                                       └─> Updates Avg, Min, Max, Success %

3. User adjusts interval to 2000ms
   └─> TargetList calls targetService.updateTarget() and pingService.stopPinging()
       └─> pingService creates new interval with 2000ms
           └─> Pings now occur every 2 seconds

4. User clicks "⏸️ Stop"
   └─> pingService.stopPinging(host)
       └─> Clears the setInterval
           └─> No more HTTP requests
               └─> PingGraph continues showing historical data
```

## File Organization

```
src/
├── app/
│   ├── services/
│   │   ├── ping.service.ts ────── Manages ping execution
│   │   ├── target.service.ts ──── Manages target list state
│   │   └── file.service.ts ────── Save/load configurations
│   │
│   ├── header/
│   │   ├── header.ts ──────────── Component logic
│   │   ├── header.html ───────── UI template
│   │   └── header.css ───────── Styling
│   │
│   ├── target-list/
│   │   ├── target-list.ts ──── Component logic
│   │   ├── target-list.html ──── UI template
│   │   └── target-list.css ──── Styling
│   │
│   ├── ping-graph/
│   │   ├── ping-graph.ts ──────── Component logic
│   │   ├── ping-graph.html ───── UI template
│   │   └── ping-graph.css ───── Styling
│   │
│   ├── app.ts ────────────────── Main component
│   ├── app.html ───────────────── Main template
│   ├── app.css ────────────────── Main styles
│   └── app.config.ts ────────── Configuration
│
├── main.ts ──────────────────── Entry point
└── styles.css ────────────────── Global styles

backend/
├── server.js ───────────────── Express server
├── package.json ────────────── Dependencies
├── .env.example ────────────── Config template
└── README.md ────────────────── Backend docs
```

## State Management Flow

```
Global State (Services)
│
├─ TargetService.targets$: Observable<PingTarget[]>
│  │ PingTarget: { id, host, intervalMs, maxTimeMs, isActive }
│  │
│  ├─ addTarget(host)
│  ├─ removeTarget(id)
│  ├─ updateTarget(id, updates)
│  ├─ setTargetActive(id, isActive)
│  ├─ setTargets(targets)
│  └─ clear()
│
├─ PingService.pingResults$: Observable<PingResult[]>
│  │ PingResult: { host, timestamp, responseTime, success }
│  │
│  ├─ startPinging(host, interval)
│  ├─ stopPinging(host)
│  ├─ stopAllPinging()
│  ├─ getResultsForHost(host)
│  ├─ clearResultsForHost(host)
│  └─ clearAllResults()
│
└─ FileService
   ├─ saveToFile(targets)
   ├─ loadFromFile(file): Promise<PingTarget[]>
   └─ exportAsJson(targets): string
```

## Data Types

### PingTarget
```typescript
{
  id: "target-1",           // Unique identifier
  host: "google.com",       // Hostname or IP
  intervalMs: 5000,         // Ping frequency in ms
  maxTimeMs: 300000,        // Graph time window in ms
  isActive: true            // Currently pinging?
}
```

### PingResult
```typescript
{
  host: "google.com",           // Which target
  timestamp: Date,              // When
  responseTime: 45.2 | null,    // Response time in ms (null = failure)
  success: true                 // Did it succeed?
}
```

### GraphData (Internal)
```typescript
{
  target: PingTarget,           // The target being displayed
  labels: ["10:30:45", "..."],  // Time labels
  data: [45.2, null, 32.1],     // Response times or null
  backgroundColors: [...]       // Colors for bars
}
```

### PingChampFile (Saved Config)
```json
{
  "version": "1.0",
  "targets": [PingTarget, ...],
  "createdAt": "2026-05-02T10:30:00.000Z"
}
```

## API Communication

### HTTP Request
```
GET http://localhost:3001/api/ping?host=google.com
```

### Success Response (200 OK)
```json
{
  "success": true,
  "responseTime": 45.2,
  "host": "google.com",
  "timestamp": "2026-05-02T10:30:00.000Z"
}
```

### Failure Response (200 OK - not an error)
```json
{
  "success": false,
  "host": "google.com",
  "error": "Request timed out",
  "timestamp": "2026-05-02T10:30:00.000Z"
}
```

### Error Response (400, 500, etc.)
```json
{
  "success": false,
  "error": "Invalid host format"
}
```

## Execution Timeline Example

```
Time: 10:30:00
├─ User adds "google.com" target
└─ TargetService.addTarget() → targets$ emits new value

Time: 10:30:05
├─ User clicks "Start"
├─ PingService.startPinging("google.com", 5000) 
├─ First ping sent immediately
├─ HTTP GET /api/ping?host=google.com
└─ Response: {success: true, responseTime: 45.2}
   └─ PingService adds to pingResults$
   └─ PingGraph component updates
   └─ Calculates: Avg=45.2, Min=45.2, Max=45.2, Success%=100

Time: 10:30:10 (5 seconds later)
├─ Second ping sent (interval of 5000ms)
├─ Response: {success: true, responseTime: 38.9}
│  └─ pingResults$ now has 2 entries
│  └─ PingGraph updates
│  └─ Calculates: Avg=42.05, Min=38.9, Max=45.2, Success%=100

Time: 10:30:15 (10 seconds later)
├─ Third ping sent
├─ Response: {success: false}
│  └─ pingResults$ now has 3 entries
│  └─ PingGraph shows red bar for failure
│  └─ Calculates: Avg=42.05, Min=38.9, Max=45.2, Success%=66.7%

Time: 10:30:20
├─ User clicks "Stop"
├─ PingService.stopPinging("google.com")
├─ clearInterval() called
└─ No more pings sent, but data remains visible
```

## Graph Rendering Example

```
When 3 pings complete:
- Ping 1: 45.2ms (success) → Green bar at 45% height
- Ping 2: 38.9ms (success) → Green bar at 39% height
- Ping 3: timeout (failure) → Red bar at 100% height (full height)

Y-Axis (milliseconds):
┌─────────────────────────────────────────┐ 45ms (max)
│                                           │
│    █ (45.2)    █ (38.9)    █ (fail)      │
│                                           │
└─────────────────────────────────────────┘ 0ms

Statistics:
- Average: 42.05ms (only successes counted)
- Min: 38.9ms
- Max: 45.2ms
- Success: 66.7% (2 out of 3)
- Success Count: 2
- Failure Count: 1
```

---

## Key Concepts

### 1. **Reactive Programming (RxJS)**
- Services expose Observable streams (targets$, pingResults$)
- Components subscribe to observables
- UI updates automatically when data changes

### 2. **Angular Signals**
- Used for internal component state
- More performant than traditional change detection
- Automatic optimization

### 3. **Component Communication**
- Services act as intermediaries
- Components communicate through observables
- No direct parent-child binding complexity

### 4. **Separation of Concerns**
- Services handle business logic
- Components handle UI and user interaction
- Clean, maintainable code

### 5. **Responsive Design**
- Flexbox layout adapts to screen size
- Mobile-first approach
- Works on all screen sizes

---

**This architecture is scalable, maintainable, and production-ready! 🚀**
