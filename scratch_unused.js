const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const projectDir = __dirname;
const extsToScan = ['.html', '.css', '.json', '.js', '.webmanifest', '.en'];
const ignoreDirs = ['.git', '.vscode', 'node_modules', 'scripts']; 

const allImages = [];

function collectImages(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            collectImages(fullPath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico'].includes(ext)) {
                allImages.push({
                    name: file,
                    path: fullPath,
                    used: false
                });
            }
        }
    }
}

collectImages(publicDir);

function checkUsage(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                checkUsage(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (extsToScan.includes(ext) || file.includes('manifest')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                for (const img of allImages) {
                    if (!img.used && content.includes(img.name)) {
                        img.used = true;
                    }
                }
            }
        }
    }
}

checkUsage(projectDir);

const unused = allImages.filter(img => !img.used);

console.log("=== Unused Images Analysis ===");
if (unused.length === 0) {
    console.log("No unused images found! Your project is fully optimized.");
} else {
    console.log(`Found ${unused.length} unused images. Deleting them now...`);
    unused.forEach(img => {
        try {
            fs.unlinkSync(img.path);
            const relPath = path.relative(projectDir, img.path);
            console.log(`[DELETED] ${relPath}`);
        } catch (e) {
            console.error(`Failed to delete ${img.path}:`, e);
        }
    });
}
