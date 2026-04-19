const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Resolve the parent directory since this script is inside scripts/
const projectDir = path.join(__dirname, '..');
const publicDir = path.join(projectDir, 'public');

const isImageFileRegex = /\.(png|jpg|jpeg)$/i;
const hasImageExtRegex = /\.(png|jpg|jpeg)/i;
const imageExtGlobalRegex = /\.(png|jpg|jpeg)/gi;

// Exclude favicons and web-app-manifest items from processing
const excludeRegex = /(favicon|apple-touch|mstile|android-chrome|web-app-manifest|safari-pinned)/i;

let convertedImagesCount = 0;
let deletedImagesCount = 0;
let filesUpdatedCount = 0;
let totalReferencesUpdatedCount = 0;

async function processImages(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await processImages(fullPath);
        } else if (isImageFileRegex.test(file) && !excludeRegex.test(file)) {
            const ext = path.extname(file);
            // Construct the robust webp path
            const webpPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';
            
            try {
                // Convert using sharp
                await sharp(fullPath)
                    .webp({ quality: 85 })
                    .toFile(webpPath);
                convertedImagesCount++;
                
                // Delete the original file
                fs.unlinkSync(fullPath);
                deletedImagesCount++;
            } catch(e) {
                console.error(`Error processing ${file}: ${e.message}`);
            }
        }
    }
}

function updateCodeReferences(dir) {
    const extsToScan = ['.html', '.css', '.json'];
    const ignoreDirs = ['.git', '.vscode', 'node_modules', 'scripts']; // ignore node_modules and scripts

    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                updateCodeReferences(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (extsToScan.includes(ext)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const lines = content.split('\n');
                let matchCount = 0;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // Skip the entire line if it's related to the excluded stuff (favicon/manifests)
                    if (excludeRegex.test(line)) {
                        continue;
                    }
                    
                    if (hasImageExtRegex.test(line)) {
                        const matches = line.match(imageExtGlobalRegex);
                        if (matches) {
                            matchCount += matches.length;
                            // Replace exactly .png, .jpg, .jpeg with .webp
                            lines[i] = line.replace(imageExtGlobalRegex, '.webp');
                        }
                    }
                }
                
                if (matchCount > 0) {
                    fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
                    filesUpdatedCount++;
                    totalReferencesUpdatedCount += matchCount;
                }
            }
        }
    }
}

async function run() {
    try {
        console.log("=== WebP Migration Started ===");
        
        console.log("-> Processing images in public directory...");
        await processImages(publicDir);
        console.log(`[Success] Converted ${convertedImagesCount} images to WebP.`);
        console.log(`[Success] Deleted ${deletedImagesCount} original files.`);
        
        console.log("-> Updating references in project files...");
        updateCodeReferences(projectDir);
        console.log(`[Success] Updated ${totalReferencesUpdatedCount} references across ${filesUpdatedCount} files.`);
        
        console.log("=== Migration Successfully Completed! ===");
    } catch (err) {
        console.error("Migration Failed:", err);
    }
}

run();
