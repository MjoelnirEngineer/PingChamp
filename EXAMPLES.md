# 📖 PingChamp Usage Examples

## Real-World Scenarios

### Scenario 1: Monitor a Website

**Goal:** Monitor google.com availability and response times

**Setup:**
```
Hostname: google.com
Ping Interval: 5000ms (ping every 5 seconds)
Max Time: 300000ms (show 5 minutes of history)
```

**Expected Results:**
- Green bars for successful responses
- Average response time around 30-60ms
- 99-100% success rate
- Smooth, consistent bars

**Use Case:** Website uptime monitoring

---

### Scenario 2: Monitor Local Server

**Goal:** Monitor a local server's connectivity and performance

**Setup:**
```
Hostname: 192.168.1.100
Ping Interval: 1000ms (ping every second)
Max Time: 60000ms (show 1 minute of history)
```

**Expected Results:**
- Very fast response times (< 5ms)
- Nearly 100% success rate
- Tight clustering of bars (consistent)
- Very green bar visualization

**Use Case:** Local infrastructure monitoring

---

### Scenario 3: Network Stability Test

**Goal:** Test internet stability during work

**Setup:**
```
Hostname: 8.8.8.8 (Google DNS)
Ping Interval: 2000ms (ping every 2 seconds)
Max Time: 600000ms (show 10 minutes of history)
```

**Expected Results:**
- Mixed response times
- Some red bars during network issues
- Success rate drops when issues occur
- Helps identify ISP/network problems

**Use Case:** Internet stability monitoring

---

### Scenario 4: Multi-Target Production Monitoring

**Goal:** Monitor multiple critical servers

**Setup:**
```
Target 1: prod-api.example.com (Interval: 5000ms)
Target 2: prod-db.example.com (Interval: 5000ms)
Target 3: cdn.example.com (Interval: 10000ms)
Target 4: 8.8.8.8 (Interval: 5000ms)
```

**Expected Results:**
- Each target has its own graph card
- Can start/stop each independently
- Quickly spot which service has issues
- Beautiful dashboard of all systems

**Use Case:** Multi-server monitoring dashboard

---

### Scenario 5: Troubleshooting Network Issues

**Goal:** Diagnose why connection to a server is slow

**Setup:**
```
Hostname: problematic-server.local
Ping Interval: 1000ms (frequent pings)
Max Time: 120000ms (2 minutes - recent data only)
```

**Observations:**
- Watch response times in real-time
- Red bars = dropped packets
- High variation = unstable connection
- Consistent high times = slow server/network
- Sudden spikes = temporary issues

**Use Case:** Network troubleshooting

---

## Graph Interpretation Examples

### Example 1: Healthy Server

```
Status: 🟢 Pinging
Avg: 42ms | Min: 38ms | Max: 45ms | Success: 100%

████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
█ █  █ █ █  █  █ █  █ █ █  █  █  █ █  █ █ █
■ ■  ■ ■ ■  ■  ■ ■  ■ ■ ■  ■  ■  ■ ■  ■ ■ ■

Legend:
■ Green (Success): 20 pings
□ Red (Fail): 0 pings
```

**Interpretation:** 
- Very consistent response times
- No failures
- Server is healthy and responsive

---

### Example 2: Intermittent Issues

```
Status: 🟢 Pinging
Avg: 45ms | Min: 35ms | Max: 120ms | Success: 85%

████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
█ █  █  ███████  █ █  █  ████████  █ █  █ █
■ ■  ■  ■■■■■■■  ■ ■  ■  ■■■■■■■■  ■ ■  ■ ■

Legend:
■ Green (Success): 17 pings  
█ Red (Fail): 3 pings
```

**Interpretation:**
- Occasional timeout/failure (red bars)
- Some spikes in response time
- Server has intermittent issues
- Network might be unstable

---

### Example 3: Server Down

```
Status: 🟢 Pinging
Avg: N/A | Min: N/A | Max: N/A | Success: 0%

████████████████████████████████████████████
█ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █

Legend:
■ Green (Success): 0 pings
█ Red (Fail): 20 pings
```

**Interpretation:**
- All pings failed (all red)
- Server is unreachable
- Network issue or server is down
- Immediate action required

---

### Example 4: Improving Connection

```
Status: 🟢 Pinging
Avg: 78ms | Min: 45ms | Max: 150ms | Success: 95%

████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
█ █ █ █  █ █  █ █  █ █ █  █  █ █ █  █ █ █ █

Legend:
■ Green (Success): 19 pings
█ Red (Fail): 1 ping
```

**Interpretation:**
- Initially had issues (high max time, some failures)
- Improving over time (later bars are lower/greener)
- Possible recovery from network issue
- Monitor for continued improvement

---

## Configuration Examples

### Example Config File: Multi-Site Monitoring

```json
{
  "version": "1.0",
  "targets": [
    {
      "id": "target-1",
      "host": "api.example.com",
      "intervalMs": 5000,
      "maxTimeMs": 300000,
      "isActive": false
    },
    {
      "id": "target-2",
      "host": "database.example.com",
      "intervalMs": 10000,
      "maxTimeMs": 600000,
      "isActive": false
    },
    {
      "id": "target-3",
      "host": "cdn.example.com",
      "intervalMs": 2000,
      "maxTimeMs": 120000,
      "isActive": false
    },
    {
      "id": "target-4",
      "host": "8.8.8.8",
      "intervalMs": 5000,
      "maxTimeMs": 300000,
      "isActive": false
    }
  ],
  "createdAt": "2026-05-02T10:30:00.000Z"
}
```

**Use:** Load this to instantly monitor your infrastructure

---

## Common Tasks & Solutions

### Task: Monitor Multiple Servers

**Step-by-Step:**
1. Add first server: `server1.local`
2. Add second server: `server2.local`
3. Add third server: `server3.local`
4. Start each individually or
5. Start all by clicking each "▶️ Start" button
6. Watch all graphs update simultaneously

**Result:** Multi-server dashboard

---

### Task: Test Internet Stability

**Step-by-Step:**
1. Add target: `8.8.8.8` (Google DNS)
2. Set interval to: `1000` (ping every second)
3. Set max time to: `600000` (10 minutes)
4. Click "▶️ Start"
5. Do your work
6. Check back to see stability metrics

**Result:** Know your internet is stable/unstable

---

### Task: Save Your Monitoring Setup

**Step-by-Step:**
1. Set up all your targets
2. Configure intervals and max times
3. Click "💾 Save Config"
4. Browser downloads: `pingchamp-[timestamp].pingchamp`
5. Keep this file for future use

**Result:** Reusable configuration

---

### Task: Load a Previously Saved Setup

**Step-by-Step:**
1. Click "📂 Load Config"
2. Select previously saved `.pingchamp` file
3. All targets load instantly
4. Configure is ready to use
5. Click "▶️ Start" on each target

**Result:** Quick setup of complex monitoring

---

### Task: Monitor During a Network Issue

**Step-by-Step:**
1. Add problematic host
2. Set interval: `1000` (frequent pings)
3. Set max time: `120000` (2 minutes)
4. Watch the real-time data
5. Record when issues occur
6. Save config for later analysis

**Result:** Visual evidence of network problems

---

## Performance Metrics Guide

### What Good Metrics Look Like

| Metric | Good Range | Acceptable | Concerning |
|--------|-----------|-----------|-----------|
| Response Time | < 50ms | 50-100ms | > 100ms |
| Success Rate | 99-100% | 95-99% | < 95% |
| Consistency | Tight clustering | Some variation | High variation |
| Pattern | Steady bars | Few spikes | Many spikes/gaps |

---

### Response Time Categories

```
< 10ms   : Excellent (local/fast network)
10-50ms  : Good (typical internet)
50-100ms : Acceptable (some latency)
100-200ms: Slow (significant latency)
> 200ms  : Very Slow (problematic)
```

---

### Success Rate Categories

```
99-100%  : Excellent (highly reliable)
95-99%   : Good (occasional issues)
90-95%   : Fair (regular issues)
< 90%    : Poor (frequent problems)
0%       : Critical (completely down)
```

---

## Advanced Usage

### Monitoring Across Timezones

**Setup multiple targets in different regions:**
```
Target 1: us-east-1.example.com
Target 2: eu-west-1.example.com
Target 3: ap-southeast-1.example.com
```

**Result:** Understand global performance

---

### SLA Monitoring

**Track uptime against SLA requirements:**
- Set up critical services
- Monitor continuously
- Watch success rate percentage
- Document incidents via save/load

---

### ISP Quality Verification

**Monitor Internet quality:**
1. Add primary DNS: `8.8.8.8`
2. Add backup DNS: `1.1.1.1`
3. Add external host: `google.com`
4. Monitor consistently
5. Identify patterns in your ISP

---

### Server Startup Monitoring

**Watch servers come online:**
1. Add target that's currently down
2. Start monitoring (will show all red)
3. Watch as server starts (bars turn green)
4. See when server is fully responsive
5. Graph shows exact startup timeline

---

## Tips & Tricks

### Reduce Memory Usage
- Lower graph time window (maxTimeMs)
- Increase ping interval (intervalMs)
- Remove targets you're not monitoring

### Get More Detail
- Reduce ping interval (e.g., 1000ms vs 5000ms)
- Reduce max time window (e.g., 120000ms vs 600000ms)
- Zoom into recent performance

### Setup Favorites
- Create different `.pingchamp` files for different scenarios
- Save "Production.pingchamp" with production servers
- Save "Local.pingchamp" with local servers
- Load quickly based on your need

### Monitor Efficiently
- Start with 5000ms interval (reasonable default)
- Adjust down only if you need frequent updates
- Adjust up if server is stable and you want less traffic
- Balance accuracy vs performance

---

## Expected Behavior

### Fresh Start
- Add target → appears in list → status is "⚪ Stopped"
- No graphs yet (no data to display)
- Target ready to monitor

### After Starting
- Status changes to "🟢 Pinging"
- After 5-10 seconds → first bar appears
- Graph updates every interval
- Statistics continuously calculated

### While Monitoring
- Bars appear at regular intervals
- Green bars = successful responses
- Red bars = failed responses
- Statistics update in real-time

### After Stopping
- Status changes back to "⚪ Stopped"
- Graph freezes (stops updating)
- Data remains visible
- Can start again anytime

---

## Conclusion

**PingChamp is flexible and powerful. Use these examples as starting points for your own monitoring needs.**

Happy monitoring! 📊🚀
