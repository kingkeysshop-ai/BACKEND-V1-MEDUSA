const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const MEDUSA_SERVER_PATH = path.join(process.cwd(), '.medusa', 'server');

// Tolerant async post-build wrapper for Railway timing issues
(async () => {
  let serverExists = false;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts && !serverExists) {
    if (fs.existsSync(MEDUSA_SERVER_PATH)) {
      serverExists = true;
      console.log('.medusa/server found, proceeding with post-build steps.');
      break;
    }
    console.warn(`.medusa/server not found, attempt ${attempts + 1}/${maxAttempts}. Waiting 2s...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }

  if (!serverExists) {
    console.warn('.medusa/server directory not found after retries. Skipping post-build steps. This may indicate a build issue.');
    return;
  }

  // Copy pnpm-lock.yaml
  fs.copyFileSync(
    path.join(process.cwd(), 'pnpm-lock.yaml'),
    path.join(MEDUSA_SERVER_PATH, 'pnpm-lock.yaml')
  );

  // Copy .env if it exists
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(
      envPath,
      path.join(MEDUSA_SERVER_PATH, '.env')
    );
  }

  // Install dependencies
  console.log('Installing dependencies in .medusa/server...');
  execSync('pnpm i --prod --frozen-lockfile', { 
    cwd: MEDUSA_SERVER_PATH,
    stdio: 'inherit'
  });
})();
