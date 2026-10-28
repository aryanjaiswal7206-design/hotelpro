const mongoose = require('mongoose');
const net = require('net');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let mongodProcess = null;

// Helper: check if a port is open
const isPortOpen = (port = 27017, host = '127.0.0.1', timeout = 1200) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;

    socket.setTimeout(timeout);
    socket.once('connect', () => {
      status = true;
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

// Helper: find mongod binary
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

// Helper: ensure data/db directory exists
const getDbPath = () => {
  const dbDir = path.resolve(__dirname, '../../data/db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  return dbDir;
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
  const isAtlasOrRemote = uri.startsWith('mongodb+srv://') || (!uri.includes('127.0.0.1') && !uri.includes('localhost'));

  if (isAtlasOrRemote) {
    console.log('[MongoDB] Connecting to MongoDB Atlas Cloud Database...');
  } else {
    // 1. Check if local MongoDB is already listening on 27017
    const portListening = await isPortOpen(27017, '127.0.0.1');

    if (!portListening) {
      console.log('[MongoDB] Port 27017 is not active. Attempting to start local MongoDB daemon...');
      const mongodBin = findMongodBinary();

      if (mongodBin) {
        const dbPath = getDbPath();
        console.log(`[MongoDB] Launching: ${mongodBin} --dbpath "${dbPath}"`);

        mongodProcess = spawn(mongodBin, ['--dbpath', dbPath, '--bind_ip', '127.0.0.1'], {
          detached: false,
          stdio: 'ignore',
        });

        // Wait up to 6 seconds for port to open
        for (let i = 0; i < 12; i++) {
          await new Promise((r) => setTimeout(r, 500));
          if (await isPortOpen(27017, '127.0.0.1')) {
            console.log('[MongoDB] Auto-started successfully and listening on 127.0.0.1:27017');
            break;
          }
        }
      } else {
        console.warn('[MongoDB] mongod binary not found in standard paths. Ensure MongoDB service is running.');
      }
    }
  }

  // 2. Connect via Mongoose
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Connection Error] Failed to connect to database: ${err.message}`);
    if (isAtlasOrRemote) {
      console.error('\nTips for MongoDB Atlas:');
      console.error('1. Check Network Access in Atlas: Ensure IP Access list has 0.0.0.0/0 (Allow from anywhere).');
      console.error('2. Verify your Database User username & password in backend/.env MONGODB_URI.');
      console.error('3. Verify password does not contain unescaped special characters (e.g., @ should be %40).\n');
    }
    throw err;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodProcess) {
    mongodProcess.kill();
  }
};

module.exports = { connectDB, disconnectDB };
