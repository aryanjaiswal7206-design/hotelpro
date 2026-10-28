const { spawn, execSync } = require('child_process');
const path = require('path');
const net = require('net');
const fs = require('fs');

console.log('====================================================');
console.log('🏨 HotelPro - Enterprise Hotel Management System');
console.log('====================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Read backend/.env to check MONGODB_URI
const getEnvUri = () => {
  try {
    const envPath = path.join(__dirname, 'backend/.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/MONGODB_URI=(.*)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch (e) {}
  return 'mongodb://127.0.0.1:27017/hotelpro';
};

// Helper: check if a port is open
const isPortOpen = (port, host = '127.0.0.1', timeout = 1000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
};

// Helper: free port if occupied by previous stale processes
const freePortIfOccupied = (port) => {
  if (!isWindows) return;
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { stdio: 'pipe' }).toString();
    const lines = output.trim().split('\r\n');
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && pid !== String(process.pid)) {
          try {
            console.log(`[Port Clean] Freeing port ${port} by terminating PID ${pid}...`);
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          } catch (e) {}
        }
      }
    }
  } catch (e) {
    // Port is free
  }
};

const findMongodBinary = () => {
  const commonPaths = [
    'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
  ];

  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }

  try {
    const whereResult = execSync('where mongod', { stdio: 'pipe' }).toString().trim().split('\r\n')[0];
    if (whereResult && fs.existsSync(whereResult)) return whereResult;
  } catch (e) {
    // ignore
  }

  return null;
};

let mongodProc = null;
let backendProc = null;
let frontendProc = null;

const startSystem = async () => {
  // Ensure ports 5000 and 5173 are free
  freePortIfOccupied(5000);
  freePortIfOccupied(5173);

  const mongoUri = getEnvUri();
  const isAtlas = mongoUri.startsWith('mongodb+srv://') || (!mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost'));

  if (isAtlas) {
    console.log('[1/3] Using MongoDB Atlas Cloud Database.');
    console.log(`      URI: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
  } else {
    // 1. Check & Start MongoDB if needed
    console.log('[1/3] Checking local MongoDB status on port 27017...');
    let mongoActive = await isPortOpen(27017, '127.0.0.1');

    if (!mongoActive) {
      console.log('[MongoDB] Port 27017 inactive. Starting local MongoDB daemon...');
      const mongodBin = findMongodBinary();
      const dbPath = path.resolve(__dirname, 'backend/data/db');
      if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });

      if (mongodBin) {
        console.log(`[MongoDB] Executing: "${mongodBin}" --dbpath "${dbPath}"`);
        mongodProc = spawn(mongodBin, ['--dbpath', dbPath, '--bind_ip', '127.0.0.1'], {
          detached: false,
          stdio: 'ignore',
        });

        for (let i = 0; i < 15; i++) {
          await new Promise((r) => setTimeout(r, 500));
          if (await isPortOpen(27017, '127.0.0.1')) {
            mongoActive = true;
            console.log('✅ [MongoDB] Daemon running on 127.0.0.1:27017');
            break;
          }
        }
      } else {
        console.warn('⚠️ [MongoDB] mongod binary not found. If using a remote/service MongoDB, connecting directly.');
      }
    } else {
      console.log('✅ [MongoDB] MongoDB is already active on 127.0.0.1:27017');
    }
  }

  // 2. Start Backend
  console.log('[2/3] Launching Backend API Server (Port 5000)...');
  backendProc = spawn(npmCmd, ['start'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true,
  });

  // Wait for backend to be ready
  await new Promise((r) => setTimeout(r, 2000));

  // 3. Start Frontend
  console.log('[3/3] Launching Frontend Client (Port 5173)...');
  frontendProc = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true,
  });

  console.log('\n====================================================');
  console.log('🎉 HotelPro Full Stack is Online!');
  console.log('👉 Frontend UI  : http://localhost:5173');
  console.log('👉 Backend API  : http://localhost:5000/api/health');
  console.log('====================================================\n');
};

const cleanup = () => {
  console.log('\n[HotelPro] Shutting down all processes...');
  if (frontendProc) frontendProc.kill();
  if (backendProc) backendProc.kill();
  if (mongodProc) mongodProc.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

startSystem().catch((err) => {
  console.error('Fatal startup error:', err);
  cleanup();
});
