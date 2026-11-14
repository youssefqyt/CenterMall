const { spawn } = require('child_process');
const path = require('path');

console.log('==============================================');
console.log('       CENTER MALL - LAUNCHING PLATFORM       ');
console.log('==============================================');
console.log('1. Starting Backend API on http://localhost:5000');
console.log('2. Starting Expo Mobile App Server');
console.log('----------------------------------------------');

// 1. Launch Backend
const backend = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('❌ Failed to start Backend:', err);
});

// 2. Launch Mobile Expo
const mobile = spawn('npx', ['expo', 'start'], {
  cwd: path.join(__dirname, 'mobile'),
  stdio: 'inherit',
  shell: true
});

mobile.on('error', (err) => {
  console.error('❌ Failed to start Mobile Expo:', err);
});

process.on('SIGINT', () => {
  console.log('\nShutting down Center MALL services...');
  backend.kill();
  mobile.kill();
  process.exit(0);
});

