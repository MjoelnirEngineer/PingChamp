# PingChamp

A real-time network monitoring application built with Angular 21 that allows you to ping multiple hosts and visualize response times in interactive graphs. Monitor your network health with beautiful, responsive charts showing response times, success rates, and connectivity status.

## Features

✨ **Core Features:**
- ➕ Add multiple hosts/IP addresses to monitor
- 📊 Real-time ASCII-based graphs showing ping response times
- 🟢 Green bars for successful pings
- 🔴 Red bars for timeouts/no response
- ⚙️ Individual ping interval configuration per target (customizable in milliseconds)
- 📈 Configurable graph time window per target
- ▶️ Start/Stop pinging individual targets
- 💾 Save configurations to `.pingchamp` files
- 📂 Load saved configurations
- 📉 Statistics display: Average, Min, Max response times
- ✅ Success rate calculation
- 🎯 Y-axis in milliseconds

## Technical Stack

- **Frontend:** Angular 21 with Standalone Components
- **Styling:** Tailwind CSS + Custom CSS
- **State Management:** RxJS + Angular Signals
- **Data Visualization:** Custom ASCII bar charts
- **Type Safety:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm 10+
- Angular CLI 21.2.8+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload on code changes.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## How to Use

### Adding Targets

1. Fill in the hostname or IP address in the "Add New Target" section
2. Set the ping interval (in milliseconds) - how often to ping the host
3. Set the max time window for the graph (in milliseconds) - how long to display data
4. Click "➕ Add Target"

### Monitoring Targets

1. Each target appears as a card in the left panel
2. Click "▶️ Start" to begin pinging a target
3. View real-time graphs on the right showing response times
4. Click "⏸️ Stop" to stop pinging

### Saving and Loading Configurations

- **Save:** Click "💾 Save Config" to export your targets and settings as a `.pingchamp` file
- **Load:** Click "📂 Load Config" to import a previously saved configuration

### Graph Interpretation

- **Green Bars:** Successful ping responses with millisecond values
- **Red Bars:** Failed pings (timeout/no response)
- **Statistics Panel:** Shows Average, Min, Max times and success percentage
- **Y-Axis:** Response time in milliseconds
- **Data Points:** Individual ping attempts displayed sequentially

## Architecture

### Services

#### `PingService`
- Manages ping execution and intervals
- Stores ping results with timestamps
- Handles success/failure tracking
- Observable stream of results

#### `TargetService`
- Manages list of targets to monitor
- Handles CRUD operations for targets
- Maintains target configuration (interval, max time)
- Tracks active/inactive state

#### `FileService`
- Exports targets to `.pingchamp` JSON files
- Imports configurations from saved files
- Handles file I/O operations

### Components

#### `App`
- Main application container
- Integrates all sub-components

#### `Header`
- Save/Load/Clear controls
- Application title and subtitle

#### `TargetList`
- Add new targets form
- List of active targets with individual controls
- Settings management per target

#### `PingGraph`
- Real-time graph visualization for all targets
- Statistics calculation and display
- Responsive grid layout

## Configuration File Format (`.pingchamp`)

```json
{
  "version": "1.0",
  "targets": [
    {
      "id": "target-1",
      "host": "google.com",
      "intervalMs": 5000,
      "maxTimeMs": 300000,
      "isActive": false
    }
  ],
  "createdAt": "2026-05-02T10:30:00.000Z"
}
```

## Backend Requirements

The application expects a `/api/ping` endpoint to be available:

```
GET /api/ping?host=<hostname>
```

### Expected Response Format

```json
{
  "success": true,
  "responseTime": 45.2
}
```

Or on failure:

```json
{
  "success": false
}
```

### Sample Node.js Express Backend

```javascript
const express = require('express');
const ping = require('ping');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/ping', async (req, res) => {
  const { host } = req.query;
  
  if (!host) {
    return res.status(400).json({ error: 'host parameter required' });
  }

  try {
    const result = await ping.promise.probe(host, {
      timeout: 10,
    });
    
    res.json({
      success: result.alive,
      responseTime: result.time || 0,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3001, () => {
  console.log('Ping API server running on http://localhost:3001');
});
```

Install required package:
```bash
npm install express cors ping
```

## Development

### Running Tests

```bash
npm test
```

### Code Quality

The project uses:
- ESLint for linting
- Prettier for code formatting
- TypeScript strict mode

## Browser Support

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Troubleshooting

### Pings show as failed
- Ensure the backend API is running at the expected endpoint
- Check CORS headers if running frontend and backend on different origins
- Verify the hostname/IP address is correct
- Check firewall rules

### Graphs not updating
- Verify the target is in "Pinging" state (🟢 indicator)
- Check browser console for errors
- Ensure the interval is not too high (minimum 100ms recommended)

### Configuration won't load
- Ensure the file is a valid `.pingchamp` file
- Check browser console for parsing errors
- Try exporting a new configuration and comparing the format

## License

MIT

## Version

1.0.0 - May 2026
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# PingChamp
