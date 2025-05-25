// --- START OF FILE level_assets.js ---

// Assumes globals: console, AssetManager (to signal completion)
// Assumes constants from constants.js will be loaded before this (TILE_SIZE etc.)
// Assumes constants like ZONE_TYPE, DISTRICT_TYPE_URBAN, etc., are now defined in constants.js

// --- Urban Generator Specific Constants ---
// Most of these were moved to constants.js to resolve load order issues.
// This file now primarily focuses on loading tile-specific image assets.

// var showDistrictTint = true; // This is now in constants.js

// --- Tile Image Loading ---
// Global image variables are declared in game_setup.js:
// var imgWall, imgObstacle, imgFloor, imgEntrance;
// var imagesLoaded = false; // Also in game_setup.js

const TILE_IMAGE_FILENAMES = { // Updated to new naming convention
    WALL: 'wall.png',
    OBSTACLE: 'obstacle.png',
    FLOOR: 'floor.png', 
    ENTRANCE: 'entrance.png'
};
const imagesToLoadCount = Object.keys(TILE_IMAGE_FILENAMES).length;
var loadedImageCount = 0; 

function loadTileImages() {
    console.log("Loading tile images (from level_assets.js)...");
    const onImageLoadOrError = (path, success) => { 
        loadedImageCount++;
        if (success) {
            // console.log(`Tile image loaded: ${path}`); 
        }
        if (loadedImageCount === imagesToLoadCount) {
            imagesLoaded = true; 
            console.log("All tile images in level_assets.js finished loading attempt. Completing AssetManager task 'tileImages'.");
            if (typeof AssetManager !== 'undefined' && AssetManager.completeExternalLoadingTask) {
                AssetManager.completeExternalLoadingTask('tileImages');
            } else {
                console.warn("AssetManager not ready to complete tileImages task.");
            }
        }
    };

    if (typeof imgWall === 'undefined') window.imgWall = new Image(); else window.imgWall = imgWall;
    if (typeof imgObstacle === 'undefined') window.imgObstacle = new Image(); else window.imgObstacle = imgObstacle;
    if (typeof imgFloor === 'undefined') window.imgFloor = new Image(); else window.imgFloor = imgFloor;
    if (typeof imgEntrance === 'undefined') window.imgEntrance = new Image(); else window.imgEntrance = imgEntrance;


    window.imgWall.onload = () => onImageLoadOrError(TILE_IMAGE_FILENAMES.WALL, true);
    window.imgWall.onerror = (e) => { console.error(`Failed to load TILE image: ${TILE_IMAGE_FILENAMES.WALL}. Attempted src: ${imgWall.src}. Event:`, e); onImageLoadOrError(TILE_IMAGE_FILENAMES.WALL, false); };
    
    window.imgObstacle.onload = () => onImageLoadOrError(TILE_IMAGE_FILENAMES.OBSTACLE, true);
    window.imgObstacle.onerror = (e) => { console.error(`Failed to load TILE image: ${TILE_IMAGE_FILENAMES.OBSTACLE}. Attempted src: ${imgObstacle.src}. Event:`, e); onImageLoadOrError(TILE_IMAGE_FILENAMES.OBSTACLE, false); };

    window.imgFloor.onload = () => onImageLoadOrError(TILE_IMAGE_FILENAMES.FLOOR, true);
    window.imgFloor.onerror = (e) => { console.error(`Failed to load TILE image: ${TILE_IMAGE_FILENAMES.FLOOR}. Attempted src: ${imgFloor.src}. Event:`, e); onImageLoadOrError(TILE_IMAGE_FILENAMES.FLOOR, false); };
    
    window.imgEntrance.onload = () => onImageLoadOrError(TILE_IMAGE_FILENAMES.ENTRANCE, true);
    window.imgEntrance.onerror = (e) => { console.error(`Failed to load TILE image: ${TILE_IMAGE_FILENAMES.ENTRANCE}. Attempted src: ${imgEntrance.src}. Event:`, e); onImageLoadOrError(TILE_IMAGE_FILENAMES.ENTRANCE, false); };

    // Assign src using the updated TILE_IMAGE_FILENAMES
    window.imgWall.src = TILE_IMAGE_FILENAMES.WALL;
    window.imgObstacle.src = TILE_IMAGE_FILENAMES.OBSTACLE;
    window.imgFloor.src = TILE_IMAGE_FILENAMES.FLOOR;
    window.imgEntrance.src = TILE_IMAGE_FILENAMES.ENTRANCE;
}
// --- END OF FILE level_assets.js ---