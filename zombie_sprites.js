// --- START OF FILE zombie_sprites.js ---

// Assumes globals: console, AssetManager (to signal completion)
// Assumes constants: ZOMBIE_TYPE (from constants.js)

// --- Load Zombie Sprites ---
const zombieSpritePaths = { // Updated to new naming convention
    [ZOMBIE_TYPE.REGULAR]: 'regular.png',
    [ZOMBIE_TYPE.TANK]: 'tank.png',
    [ZOMBIE_TYPE.TYRANT]: 'tyrant.png',
    [ZOMBIE_TYPE.RUNNER]: 'runner.png',
    [ZOMBIE_TYPE.SPITTER]: 'spitter.png',
    [ZOMBIE_TYPE.BLOATER]: 'bloater.png',
    [ZOMBIE_TYPE.SCREAMER]: 'screamer.png',
    [ZOMBIE_TYPE.HIVE_MASTER]: 'hivemaster.png', // was _HIVE_MASTER.png
    [ZOMBIE_TYPE.DRONE]: 'drone.png', // This is the enemy drone sprite (was _DRONE.png)
    [ZOMBIE_TYPE.HEAVY]: 'heavy.png', 
};

// `zombieSprites` object is declared in game_setup.js with `var`
// var zombieSprites = {};
// var allCustomZombieSpritesAttemptedLoad = false; // Declared in game_setup.js

var zombieSpritesToLoadCount = Object.keys(zombieSpritePaths).length; 
var zombieSpritesLoadedCount = 0; 

function loadZombieSprites() {
    console.log("Loading zombie sprites (from zombie_sprites.js)...");
    if (zombieSpritesToLoadCount === 0) {
        allCustomZombieSpritesAttemptedLoad = true;
        console.log("No custom zombie sprites to load (from zombie_sprites.js). Completing AssetManager task 'zombieSprites'.");
        if (typeof AssetManager !== 'undefined' && AssetManager.completeExternalLoadingTask) {
            AssetManager.completeExternalLoadingTask('zombieSprites');
        }
        return;
    }

    const onSpriteLoadOrError = (path, success) => { 
        zombieSpritesLoadedCount++;
        if (success) {
            // console.log(`Zombie sprite loaded: ${path}`); 
        }
        if (zombieSpritesLoadedCount === zombieSpritesToLoadCount) {
            allCustomZombieSpritesAttemptedLoad = true; 
            console.log("All zombie sprites in zombie_sprites.js finished loading attempt. Completing AssetManager task 'zombieSprites'.");
            if (typeof AssetManager !== 'undefined' && AssetManager.completeExternalLoadingTask) {
                AssetManager.completeExternalLoadingTask('zombieSprites');
            } else {
                console.warn("AssetManager not ready to complete zombieSprites task.");
            }
        }
    };

    for (const typeKey in zombieSpritePaths) {
        const path = zombieSpritePaths[typeKey]; // path is now the correct lowercase, no-underscore name
        const img = new Image();
        img.onload = () => {
            zombieSprites[typeKey] = img;
            onSpriteLoadOrError(path, true);
        };
        img.onerror = (e) => {
            console.error(`Failed to load ZOMBIE sprite: ${path}. Attempted src: ${img.src}. Event:`, e);
            zombieSprites[typeKey] = null; 
            onSpriteLoadOrError(path, false);
        };
        // console.log(`Assigning src for ZOMBIE sprite ${typeKey}: ${path}`);
        img.src = path; // Use the new path
    }
}
// --- END OF FILE zombie_sprites.js ---