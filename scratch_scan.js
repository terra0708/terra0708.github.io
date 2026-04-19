const fs = require('fs');
const path = require('path');

const exts = ['.png', '.jpg', '.jpeg'];
const fileExts = ['.html', '.css', '.json'];
const ignoreDirs = ['.git', '.vscode', 'node_modules'];

let totalFiles = 0;
let totalChanges = 0;
const results = {};

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                scanDir(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (fileExts.includes(ext)) {
                scanFile(fullPath);
            }
        }
    }
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // regex to find .png, .jpg, .jpeg (case insensitive)
    // Avoid matching if it's part of a word like some.png.js, but standard match is fine.
    // Also we exclude favicons
    const lines = content.split('\n');
    let fileMatches = 0;
    
    for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (line.match(/favicon|apple-touch|mstile|android-chrome/i)) continue; // ignore favicon references
        
        const matches = line.match(/\.png|\.jpg|\.jpeg/gi);
        if (matches) {
            fileMatches += matches.length;
        }
    }
    
    if (fileMatches > 0) {
        totalFiles++;
        totalChanges += fileMatches;
        // Make path relative for cleaner output
        const relPath = path.relative(__dirname, filePath);
        results[relPath] = fileMatches;
    }
}

try {
    scanDir(__dirname);
    console.log(JSON.stringify({
        totalFiles,
        totalChanges,
        results
    }, null, 2));
} catch (e) {
    console.error(e);
}
