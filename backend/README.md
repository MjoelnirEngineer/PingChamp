# PingChamp Backend API

Simple Node.js/Express backend server for the PingChamp network monitoring application.

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-02T10:30:00.000Z"
}
```

### GET /api/ping?host=<hostname>
Ping a host and return response time.

**Parameters:**
- `host` (string, required): Hostname or IP address to ping

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
  "host": "invalid-host",
  "error": "Request timed out",
  "timestamp": "2026-05-02T10:30:00.000Z"
}
```

## Configuration

Configure the server via `.env` file:

```env
# Server Port (default: 3001)
PORT=3001

# Server Host (default: localhost)
HOST=localhost

# Frontend URL for CORS
FRONTEND_URL=http://localhost:4200

# Log level
LOG_LEVEL=info
```

## Requirements

- Node.js 18+
- npm 9+

## Security Notes

- Host parameter is validated to prevent injection attacks
- Only allows valid hostname/IP formats
- CORS is restricted to the configured frontend URL
- Add rate limiting in production for security

## Troubleshooting

### "ping module not found"
Make sure you run `npm install` in the backend directory.

### "CORS error"
Check that `FRONTEND_URL` in `.env` matches your frontend URL.

### "Port already in use"
Change the `PORT` in `.env` file to an available port.

### Pings timing out
- Ensure the host is reachable from your network
- Check firewall settings
- Some networks may block ICMP packets

## Production Deployment

For production:

1. Set appropriate environment variables
2. Use a process manager like PM2
3. Add rate limiting middleware
4. Set up reverse proxy (nginx/Apache)
5. Enable HTTPS
6. Monitor logs and performance

Example PM2 deployment:
```bash
npm install -g pm2
pm2 start server.js --name pingchamp-api
pm2 save
pm2 startup
```

## License

MIT
