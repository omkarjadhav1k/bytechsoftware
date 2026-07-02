import fs from 'fs';
import path from 'path';

// Helper to recursively copy directories
function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) {
    console.warn(`Source folder does not exist: ${from}`);
    return;
  }
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

// Paths configuration
const source = path.join(process.cwd(), 'theterotale', 'dist');
const target = path.join(process.cwd(), 'public', 'theterotale');

try {
  console.log(`Copying build output from ${source} to ${target}...`);
  
  // Clean target directory first to avoid stale assets
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  
  copyFolderSync(source, target);
  console.log('Terotale copy completed successfully!');
} catch (err) {
  console.error('Failed to copy terotale build output:', err);
  process.exit(1);
}
