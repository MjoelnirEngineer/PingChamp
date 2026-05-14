# PingChamp - Setup & Quick Start Guide

## What's New

Your PingChamp application is now fully configured with a modern, real-time network monitoring interface. The demo code has been completely replaced with a functional application for monitoring multiple hosts and visualizing their ping response times.

## Project Structure

```
PingChamp/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── ping.service.ts          # Handles ping requests and result streaming
│   │   │   ├── target.service.ts        # Manages target list state
│   │   │   └── file.service.ts          # Saves/loads .pingchamp configuration files
│   │   ├── header/                      # Top navigation with save/load/clear buttons
│   │   ├── target-list/                 # Left panel - add targets and manage pinging
│   │   ├── ping-graph/                  # Right panel - visualizes ping results
│   │   ├── app.ts                       # Main component
│   │   ├── app.html                     # Main template
│   │   └── app.css                      # Main styles
│   ├── main.ts                          # Application entry point
│   └── styles.css                       # Global styles with Tailwind
├── backend/
│   ├── server.js                        # Express API for ping requests
│   ├── package.json                     # Backend dependencies
│   ├── .env.example                     # Configuration template
│   └── README.md                        # Backend setup instructions
├── package.json                         # Frontend dependencies
├── README.md                            # Main documentation
└── SETUP_GUIDE.md                       # This file
```

## Features Overview

### ✅ Add Targets
- Input hostname or IP address
- Set ping interval (in milliseconds)
- Set graph time window (in milliseconds)
- Click "Add Target" to start monitoring

### ✅ Monitor in Real-Time
- Green bars = successful pings with response time
- Red bars = failed pings (no response/timeout)
- Y-axis shows milliseconds
- Statistics show: Average, Min, Max times and success %

### ✅ Control Per Target
- Individual start/stop buttons
- Adjust ping interval without stopping
- Adjust max graph time window
- Remove targets when done

### ✅ Save Configurations
- **Save:** Export current setup as `.pingchamp` file
- **Load:** Import previously saved configurations
- **Clear:** Reset everything and start fresh

## Quick Start

### 1. Install Frontend Dependencies

```bash
cd PingChamp
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Start Backend Server (Required)

```bash
# From backend directory
npm start
```

Or with auto-reload during development:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

### 4. Start Frontend Development Server

```bash
# From project root (PingChamp folder)
npm start
```

Navigate to `http://localhost:4200`

## Configuration

### Frontend Configuration (Optional)

The frontend uses sensible defaults. To customize:

1. Edit `src/app/services/target.service.ts` to change default values
2. Edit component files to modify UI behavior

### Backend Configuration

Create a `.env` file in the `backend` folder:

```env
PORT=3001
HOST=localhost
FRONTEND_URL=http://localhost:4200
LOG_LEVEL=info
```

## Usage Guide

### Adding Your First Target

1. **Open the app** at `http://localhost:4200`
2. **In the left panel**, enter a hostname (e.g., `google.com`)
3. **Set ping interval** (default 5000ms = 5 seconds)
4. **Set max time** (default 300000ms = 5 minutes of history)
5. **Click "➕ Add Target"**
6. **Click "▶️ Start"** to begin pinging

### Reading the Graphs

- **Right side panel** shows real-time graphs
- **Green bars** = successful ping with response time
- **Red bars** = timeout/no response
- **Statistics box** shows:
  - **Avg**: Average response time
  - **Min**: Fastest response
  - **Max**: Slowest response
  - **Success**: Percentage of successful pings

### Saving Your Setup

1. Click **"💾 Save Config"**
2. Browser downloads a `.pingchamp` file
3. Load it later with **"📂 Load Config"**

## Common Tasks

### Monitor a Website
```
Hostname: google.com
Interval: 5000ms (ping every 5 seconds)
Max Time: 300000ms (show 5 minutes of data)
```

### Monitor a Local Server
```
Hostname: 192.168.1.100
Interval: 1000ms (ping every 1 second)
Max Time: 60000ms (show 1 minute of data)
```

### Monitor Multiple Targets
- Add multiple targets and start each one
- The graphs automatically resize to fit
- Each target has independent controls

## Troubleshooting

### "Backend not responding"
- ✅ Ensure backend is running: `npm start` in backend folder
- ✅ Check it's on `http://localhost:3001`
- ✅ Try the health check: `http://localhost:3001/health`

### "Pings failing for valid hosts"
- ✅ Ensure backend has internet access
- ✅ Check firewall allows outgoing ICMP
- ✅ Verify hostname is correct (try IP instead)
- ✅ Check backend logs for errors

### "Configuration won't load"
- ✅ Ensure file is valid `.pingchamp` or `.json`
- ✅ Try exporting a new configuration for comparison
- ✅ Check browser console for error messages

### "App looks broken on mobile"
- ✅ App is responsive but best on desktop
- ✅ Resize browser to see responsive behavior

## Architecture

### Services (Angular Services)

**PingService**
- Makes HTTP requests to backend `/api/ping`
- Manages ping timers and intervals
- Streams results via Observable
- Stores historical data

**TargetService**
- Manages list of targets to monitor
- State management with Signals
- Handles CRUD operations

**FileService**
- Exports targets to JSON (`.pingchamp` format)
- Imports from saved files
- Version management

### Components (Angular Components)

**Header**
- Save/Load/Clear buttons
- Application title

**TargetList**
- Add target form
- List of targets with controls
- Per-target settings (interval, max time)

**PingGraph**
- ASCII bar chart visualization
- Statistics calculation
- Real-time updates

## API Reference

### Backend Endpoint: GET /api/ping

**Request:**
```
GET http://localhost:3001/api/ping?host=google.com
```

**Success Response:**
```json
{
  "success": true,
  "responseTime": 45.2,
  "host": "google.com",
  "timestamp": "2026-05-02T10:30:00.000Z"
}
```

**Failure Response:**
```json
{
  "success": false,
  "host": "google.com",
  "error": "Request timed out",
  "timestamp": "2026-05-02T10:30:00.000Z"
}
```

## Building for Production

### Frontend
```bash
npm run build
```
Output: `dist/ping-champ/`

### Backend
```bash
# Set production environment variables
PORT=3001
FRONTEND_URL=https://yourapp.com

# Use PM2 or similar process manager
npm install -g pm2
pm2 start backend/server.js
```

## Technology Stack

- **Angular 21** - Modern, performant framework
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **Tailwind CSS** - Utility-first styling
- **Node.js/Express** - Backend API
- **Ping** - ICMP ping functionality

## Next Steps

1. ✅ Get both frontend and backend running
2. ✅ Add your first target
3. ✅ Try saving and loading configurations
4. ✅ Explore the responsive UI on different devices
5. ✅ Deploy to production (see README.md for details)

## Support

For issues or questions:

1. Check the main **README.md** for detailed documentation
2. Review **backend/README.md** for backend-specific issues
3. Check browser console for error messages
4. Verify backend logs for API issues

## License

MIT - Feel free to use, modify, and distribute

---

**Enjoy monitoring your network with PingChamp! 🚀📊**
