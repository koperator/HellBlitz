// --- START OF FILE minimap.js ---

// Assumes globals: window.level, window.player, performance, document
// Assumes constants from constants.js: TILE_SIZE, TILE, FOG_STATE,
//                                     COLOR_FLOOR, COLOR_WALL, COLOR_OBSTACLE

const MINIMAP_TILE_SIZE = 1; // Each tile on the map will be 1x1 pixel on the minimap
const MINIMAP_PADDING = 10;
const MINIMAP_BORDER_COLOR = 'rgba(128, 128, 128, 0.7)';
const MINIMAP_BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.5)';

const MINIMAP_PLAYER_COLOR = 'rgba(255, 0, 0, 1)';   // Bright red for player
const MINIMAP_EXIT_COLOR = 'rgba(0, 255, 0, 1)';     // Bright green for exit
const MINIMAP_ENTRANCE_COLOR = 'rgba(200, 0, 0, 1)'; // Dark red for map entrances
const MINIMAP_WALL_COLOR = 'rgba(100, 100, 100, 1)'; // Consistent wall color
const MINIMAP_FLOOR_COLOR = 'rgba(60, 60, 60, 1)';   // Consistent floor color
const MINIMAP_HIDDEN_COLOR = 'rgba(30, 30, 30, 0.8)';// Color for hidden fog tiles
const MINIMAP_CRATE_COLOR = 'rgba(255, 165, 0, 1)'; // Orange for crates

let offscreenMinimapCanvas = null;
let offscreenMinimapCtx = null;
let minimapNeedsVisualUpdate = true; // Flag to trigger re-render of the offscreen buffer
let currentMinimapLevelWidth = 0;
let currentMinimapLevelHeight = 0;

// This function will be called by game.js at a set interval
function setMinimapNeedsUpdateFlag() {
    minimapNeedsVisualUpdate = true;
}

// Internal function to render the entire minimap state to the offscreen buffer
function _renderMinimapDataToOffscreenBuffer() {
    if (!window.level || !window.level.grid || !window.level.fogGrid || !window.player) {
        minimapNeedsVisualUpdate = false; 
        return;
    }

    const level = window.level;
    const player = window.player;

    if (!offscreenMinimapCanvas || currentMinimapLevelWidth !== level.width || currentMinimapLevelHeight !== level.height) {
        currentMinimapLevelWidth = level.width;
        currentMinimapLevelHeight = level.height;
        offscreenMinimapCanvas = document.createElement('canvas');
        offscreenMinimapCanvas.width = currentMinimapLevelWidth * MINIMAP_TILE_SIZE;
        offscreenMinimapCanvas.height = currentMinimapLevelHeight * MINIMAP_TILE_SIZE;
        offscreenMinimapCtx = offscreenMinimapCanvas.getContext('2d');
        if (!offscreenMinimapCtx) {
            console.error("Minimap: Failed to get 2D context for offscreen canvas.");
            offscreenMinimapCanvas = null; 
            minimapNeedsVisualUpdate = false;
            return;
        }
    }

    if (!offscreenMinimapCtx) { 
        minimapNeedsVisualUpdate = false;
        return;
    }

    offscreenMinimapCtx.clearRect(0, 0, offscreenMinimapCanvas.width, offscreenMinimapCanvas.height);

    for (let r = 0; r < level.height; r++) {
        for (let c = 0; c < level.width; c++) {
            let tileColor = MINIMAP_HIDDEN_COLOR;

            if (level.fogGrid[r]?.[c] === FOG_STATE.REVEALED) {
                const tileType = level.grid[r]?.[c];
                switch (tileType) {
                    case TILE.FLOOR:
                        tileColor = MINIMAP_FLOOR_COLOR;
                        break;
                    case TILE.WALL:
                    case TILE.OBSTACLE: 
                        tileColor = MINIMAP_WALL_COLOR;
                        break;
                    case TILE.ENTRANCE:
                        tileColor = MINIMAP_ENTRANCE_COLOR;
                        break;
                    case TILE.EXPLOSIVE_CRATE:
                        tileColor = MINIMAP_CRATE_COLOR; // Specific color for crates
                        break;
                    default: 
                        tileColor = MINIMAP_HIDDEN_COLOR;
                }
            }
            offscreenMinimapCtx.fillStyle = tileColor;
            offscreenMinimapCtx.fillRect(
                c * MINIMAP_TILE_SIZE,
                r * MINIMAP_TILE_SIZE,
                MINIMAP_TILE_SIZE,
                MINIMAP_TILE_SIZE
            );
        }
    }

    if (player.active) {
        const playerTileX = Math.floor(player.x / TILE_SIZE);
        const playerTileY = Math.floor(player.y / TILE_SIZE);
        if (playerTileX >= 0 && playerTileX < level.width && playerTileY >= 0 && playerTileY < level.height) {
            offscreenMinimapCtx.fillStyle = MINIMAP_PLAYER_COLOR;
            offscreenMinimapCtx.fillRect(
                playerTileX * MINIMAP_TILE_SIZE,
                playerTileY * MINIMAP_TILE_SIZE,
                MINIMAP_TILE_SIZE,
                MINIMAP_TILE_SIZE
            );
        }
    }

    if (level.endX > 0 && level.endY > 0) {
        const exitTileX = Math.floor(level.endX / TILE_SIZE);
        const exitTileY = Math.floor(level.endY / TILE_SIZE);
        if (exitTileX >= 0 && exitTileX < level.width && exitTileY >= 0 && exitTileY < level.height) {
            if (level.fogGrid[exitTileY]?.[exitTileX] === FOG_STATE.REVEALED) {
                offscreenMinimapCtx.fillStyle = MINIMAP_EXIT_COLOR;
                offscreenMinimapCtx.fillRect(
                    exitTileX * MINIMAP_TILE_SIZE,
                    exitTileY * MINIMAP_TILE_SIZE,
                    MINIMAP_TILE_SIZE,
                    MINIMAP_TILE_SIZE
                );
            }
        }
    }
    minimapNeedsVisualUpdate = false; 
}

function drawMinimap(mainCtx, mainCanvas) {
    if (!window.level || !window.level.grid) { 
        return;
    }

    if (minimapNeedsVisualUpdate) {
        _renderMinimapDataToOffscreenBuffer();
    }

    if (!offscreenMinimapCanvas || !offscreenMinimapCtx) {
        return;
    }

    const minimapDisplayWidth = offscreenMinimapCanvas.width;
    const minimapDisplayHeight = offscreenMinimapCanvas.height;

    const minimapXOnScreen = mainCanvas.width - minimapDisplayWidth - MINIMAP_PADDING;
    const minimapYOnScreen = MINIMAP_PADDING;

    mainCtx.fillStyle = MINIMAP_BACKGROUND_COLOR;
    mainCtx.fillRect(minimapXOnScreen - 2, minimapYOnScreen - 2, minimapDisplayWidth + 4, minimapDisplayHeight + 4);
    mainCtx.strokeStyle = MINIMAP_BORDER_COLOR;
    mainCtx.lineWidth = 1;
    mainCtx.strokeRect(minimapXOnScreen - 2, minimapYOnScreen - 2, minimapDisplayWidth + 4, minimapDisplayHeight + 4);

    mainCtx.drawImage(offscreenMinimapCanvas, minimapXOnScreen, minimapYOnScreen);

    mainCtx.lineWidth = 1; 
}
// --- END OF FILE minimap.js ---