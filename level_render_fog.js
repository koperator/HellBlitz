// --- START OF FILE level_render_fog.js ---

// Assumes globals: window, canvas, ctx, Math, console, document
// Assumes constants from constants.js (TILE_SIZE, FOG_STATE, PLAYER_VISION_RADIUS, etc., COLOR_FLOOR, FOG_COLOR_HIDDEN_STANDARD, etc., CLASS_ID)
// Assumes tile images from level_assets.js (imgWall, imagesLoaded, imgFloor, imgFloorTiled etc.)
// Assumes DISTRICT_OVERLAY_TINTS_URBAN, showDistrictTint from level_assets.js
// Assumes isWallForLoS from level_generator.js

// --- Line of Sight Function (Crucial for Fog of War) ---
function hasLineOfSight(worldX1, worldY1, worldX2, worldY2, wallCheckCallback, revealCallback, stepScale = 1.0) {
    const dx = worldX2 - worldX1;
    const dy = worldY2 - worldY1;
    const totalDist = Math.sqrt(dx * dx + dy * dy);

    if (totalDist === 0) {
        const gridX = Math.floor(worldX1 / TILE_SIZE);
        const gridY = Math.floor(worldY1 / TILE_SIZE);
        if (revealCallback) {
             const isActualWall = window.level.grid[gridY]?.[gridX] === TILE.WALL || window.level.grid[gridY]?.[gridX] === TILE.EXPLOSIVE_CRATE;
             revealCallback(gridX, gridY, isActualWall);
        }
        return !wallCheckCallback(gridX, gridY);
    }

    const numSteps = Math.max(1, Math.floor(totalDist / (TILE_SIZE * stepScale)));
    const stepX = dx / numSteps;
    const stepY = dy / numSteps;

    let currentWorldX = worldX1;
    let currentWorldY = worldY1;
    let lastRevealedGridX = -1;
    let lastRevealedGridY = -1;

    for (let i = 0; i <= numSteps; i++) {
        const currentGridX = Math.floor(currentWorldX / TILE_SIZE);
        const currentGridY = Math.floor(currentWorldY / TILE_SIZE);

        if (revealCallback && (currentGridX !== lastRevealedGridX || currentGridY !== lastRevealedGridY)) {
            const isActualWall = window.level.grid[currentGridY]?.[currentGridX] === TILE.WALL || window.level.grid[currentGridY]?.[currentGridX] === TILE.EXPLOSIVE_CRATE;
            revealCallback(currentGridX, currentGridY, isActualWall);
            lastRevealedGridX = currentGridX;
            lastRevealedGridY = currentGridY;
        }

        if (wallCheckCallback(currentGridX, currentGridY)) {
            const targetGridX = Math.floor(worldX2 / TILE_SIZE);
            const targetGridY = Math.floor(worldY2 / TILE_SIZE);
            if (currentGridX === targetGridX && currentGridY === targetGridY) {
                 return false; 
            }
            if (i < numSteps) { 
                 return false;
            }
        }

        if (i < numSteps) {
            currentWorldX += stepX;
            currentWorldY += stepY;
        }
    }

    const finalGridX = Math.floor(worldX2 / TILE_SIZE);
    const finalGridY = Math.floor(worldY2 / TILE_SIZE);
    if (revealCallback && (finalGridX !== lastRevealedGridX || finalGridY !== lastRevealedGridY)) {
        const isActualWallFinal = window.level.grid[finalGridY]?.[finalGridX] === TILE.WALL || window.level.grid[finalGridY]?.[finalGridX] === TILE.EXPLOSIVE_CRATE;
        revealCallback(finalGridX, finalGridY, isActualWallFinal);
    }
    return !wallCheckCallback(finalGridX, finalGridY); 
}


function _renderStaticTilesToBuffer() {
    if (!window.level || !window.level.grid || !window.level.fogGrid || typeof canvas === 'undefined' ) {
        window.staticBufferNeedsRedraw = true; 
        return;
    }
    const levelData = window.level;

    if (!staticTileBufferCanvas || staticTileBufferCanvas.width !== levelData.width * TILE_SIZE || staticTileBufferCanvas.height !== levelData.height * TILE_SIZE) {
        staticTileBufferCanvas = document.createElement('canvas');
        staticTileBufferCanvas.width = levelData.width * TILE_SIZE;
        staticTileBufferCanvas.height = levelData.height * TILE_SIZE;
        staticTileBufferCtx = staticTileBufferCanvas.getContext('2d');
        if (!staticTileBufferCtx) {
            console.error("Failed to create static tile buffer context. Static map rendering will be disabled.");
            staticTileBufferCanvas = null;
            window.staticBufferNeedsRedraw = false; 
            return;
        }
        if (window.previouslyRevealedStaticTiles) window.previouslyRevealedStaticTiles.clear();
    }

    // console.log(`PERF: _renderStaticTilesToBuffer actually executing. Frame: ${window.frameCount || 0}`);

    staticTileBufferCtx.clearRect(0, 0, staticTileBufferCanvas.width, staticTileBufferCanvas.height);
    staticTileBufferCtx.lineWidth = 1;

    // --- Floor Rendering Priority ---
    let floorRendered = false;

    if (imagesLoaded && window.imgFloor && window.imgFloor.complete && window.imgFloor.naturalHeight !== 0) {
        for (let y = 0; y < levelData.height; y++) {
            if (!levelData.grid[y]) continue;
            for (let x = 0; x < levelData.width; x++) {
                const fogState = levelData.fogGrid[y]?.[x];
                const tileType = levelData.grid[y][x];
                if ((fogState === FOG_STATE.REVEALED || fogState === FOG_STATE.WALL_VISIBLE) && (tileType === TILE.FLOOR || tileType === TILE.EXPLOSIVE_CRATE)) { // Crates are on floor
                    staticTileBufferCtx.drawImage(window.imgFloor, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                } else if (fogState === FOG_STATE.REVEALED || fogState === FOG_STATE.WALL_VISIBLE) {
                    staticTileBufferCtx.fillStyle = COLOR_FLOOR; 
                    staticTileBufferCtx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
        floorRendered = true;
    } 
    else if (window.imgFloorTiled && window.imgFloorTiled.complete && window.imgFloorTiled.naturalHeight !== 0) {
        try {
            const floorPattern = staticTileBufferCtx.createPattern(window.imgFloorTiled, 'repeat');
            if (floorPattern) {
                staticTileBufferCtx.fillStyle = floorPattern;
                staticTileBufferCtx.fillRect(0, 0, staticTileBufferCanvas.width, staticTileBufferCanvas.height);
                floorRendered = true;
            }
        } catch (e) {
            console.error("Error creating floor pattern from _floor_tiled.png:", e);
        }
    }
    
    if (!floorRendered) { 
        staticTileBufferCtx.fillStyle = COLOR_FLOOR; 
        staticTileBufferCtx.fillRect(0, 0, staticTileBufferCanvas.width, staticTileBufferCanvas.height); 
    }

    for (let y = 0; y < levelData.height; y++) {
        if (!levelData.grid[y]) continue;
        for (let x = 0; x < levelData.width; x++) {
            const fogState = levelData.fogGrid[y]?.[x];
            if (fogState === FOG_STATE.REVEALED || fogState === FOG_STATE.WALL_VISIBLE) {
                const tileType = levelData.grid[y][x];
                let tileImage = null;
                let stroke = false;
                let fallbackFillColor = null; 

                if (tileType !== TILE.FLOOR) { 
                    switch (tileType) {
                        case TILE.WALL: 
                            tileImage = window.imgWall; 
                            stroke = true; 
                            fallbackFillColor = COLOR_WALL; 
                            break;
                        case TILE.OBSTACLE: 
                            tileImage = window.imgObstacle; 
                            stroke = true; 
                            fallbackFillColor = COLOR_OBSTACLE; 
                            break;
                        case TILE.ENTRANCE: 
                            tileImage = window.imgEntrance; 
                            fallbackFillColor = COLOR_ENTRANCE; 
                            break;
                        case TILE.EXPLOSIVE_CRATE:
                            tileImage = window.imgExplosiveCrate; // Use new image
                            fallbackFillColor = COLOR_EXPLOSIVE_CRATE; // Use new color
                            break;
                        default: 
                            continue; 
                    }

                    if (imagesLoaded && tileImage && tileImage.complete && tileImage.naturalHeight !== 0) {
                        staticTileBufferCtx.drawImage(tileImage, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    } else if (fallbackFillColor) { 
                        staticTileBufferCtx.fillStyle = fallbackFillColor;
                        staticTileBufferCtx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                    if (stroke && tileType !== TILE.EXPLOSIVE_CRATE) { // Don't stroke crates by default unless desired
                        staticTileBufferCtx.strokeStyle = COLOR_WALL_STROKE;
                        staticTileBufferCtx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }

                if (showDistrictTint && levelData.districtGrid && DISTRICT_OVERLAY_TINTS_URBAN[levelData.districtGrid[y]?.[x]]) {
                    const districtTint = DISTRICT_OVERLAY_TINTS_URBAN[levelData.districtGrid[y][x]];
                    if(districtTint && districtTint !== 'rgba(0,0,0,0)') { 
                        staticTileBufferCtx.fillStyle = districtTint;
                        staticTileBufferCtx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }
        }
    }
    window.staticBufferNeedsRedraw = false; 
}


function drawLevel(ctx, levelData, offsetX, offsetY) {
    const currentLevel = window.level || levelData;
    const currentPlayer = window.player;

    if (!currentLevel || !currentLevel.grid || !currentLevel.fogGrid || typeof canvas === 'undefined'){ console.warn("drawLevel missing critical data or canvas"); return; }
    if(typeof TILE_SIZE==='undefined'||typeof FOG_STATE==='undefined'||typeof TILE==='undefined'||typeof COLOR_FLOOR==='undefined'||typeof COLOR_WALL==='undefined'||typeof COLOR_OBSTACLE==='undefined'||typeof COLOR_ENTRANCE==='undefined'||typeof FOG_COLOR_HIDDEN_STANDARD==='undefined'|| typeof FOG_COLOR_HIDDEN_RECON === 'undefined' || typeof FOG_COLOR_WALL_VISIBLE_RECON === 'undefined' || typeof COLOR_WALL_STROKE==='undefined' || typeof CLASS_ID === 'undefined'){console.error("drawLevel missing constants");return;}

    const imagesOrTiledFloorReady = imagesLoaded || (window.imgFloorTiled && window.imgFloorTiled.complete && window.imgFloorTiled.naturalHeight !== 0);

    if (window.staticBufferNeedsRedraw && imagesOrTiledFloorReady ) { 
        _renderStaticTilesToBuffer(); 
    }

    if (staticTileBufferCanvas && staticTileBufferCtx && imagesOrTiledFloorReady) {
        const sx = offsetX; 
        const sy = offsetY; 
        const sWidth = canvas.width;   
        const sHeight = canvas.height;  
        const dx = 0;                   
        const dy = 0;                   
        const dWidth = canvas.width;   
        const dHeight = canvas.height;  

        const clampedSx = Math.max(0, Math.min(sx, staticTileBufferCanvas.width - 1)); 
        const clampedSy = Math.max(0, Math.min(sy, staticTileBufferCanvas.height - 1)); 
        
        const clampedSWidth = Math.min(sWidth, staticTileBufferCanvas.width - clampedSx);
        const clampedSHeight = Math.min(sHeight, staticTileBufferCanvas.height - clampedSy);
        
        const destXOffset = clampedSx - sx; 
        const destYOffset = clampedSy - sy;

        if (clampedSWidth > 0 && clampedSHeight > 0) { 
            ctx.drawImage(
                staticTileBufferCanvas,
                clampedSx, clampedSy,       
                clampedSWidth, clampedSHeight, 
                dx + destXOffset, dy + destYOffset,         
                clampedSWidth, clampedSHeight  
            );
        }
    } else if (!imagesOrTiledFloorReady) {
        // console.warn("drawLevel: Base tile images (like _floor_tiled.png or individual tiles) not yet loaded. Skipping static buffer draw for this frame.");
    } else { 
        // console.warn("drawLevel: Static tile buffer likely exists, but required floor texture(s) not ready. Drawing black background.");
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }

    const startCol = Math.max(0, Math.floor(offsetX / TILE_SIZE));
    const endCol = Math.min(currentLevel.width, Math.ceil((offsetX + canvas.width) / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(offsetY / TILE_SIZE));
    const endRow = Math.min(currentLevel.height, Math.ceil((offsetY + canvas.height) / TILE_SIZE));

    for (let y = startRow; y < endRow; y++) {
        if (!currentLevel.fogGrid[y]) continue;
        for (let x = startCol; x < endCol; x++) {
            const fogState = currentLevel.fogGrid[y][x];
            const screenX = x * TILE_SIZE - offsetX;
            const screenY = y * TILE_SIZE - offsetY;

            if (fogState === FOG_STATE.HIDDEN) {
                if (currentPlayer && currentPlayer.classData.id === CLASS_ID.RECON) {
                    ctx.fillStyle = FOG_COLOR_HIDDEN_RECON;
                } else {
                    ctx.fillStyle = FOG_COLOR_HIDDEN_STANDARD;
                }
                ctx.fillRect(screenX, screenY, TILE_SIZE + 0.5, TILE_SIZE + 0.5); 
            }
        }
    }

    if (currentLevel.endX > 0 && currentLevel.endY > 0 && currentLevel.fogGrid) {
        const endGridX = Math.floor(currentLevel.endX / TILE_SIZE);
        const endGridY = Math.floor(currentLevel.endY / TILE_SIZE);
        const endFogState = currentLevel.fogGrid[endGridY]?.[endGridX];
        if (endFogState === FOG_STATE.REVEALED || endFogState === FOG_STATE.WALL_VISIBLE) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.fillRect(currentLevel.endX - TILE_SIZE / 2 - offsetX, currentLevel.endY - TILE_SIZE / 2 - offsetY, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = 'lime'; ctx.lineWidth = 2;
            ctx.strokeRect(currentLevel.endX - TILE_SIZE / 2 - offsetX, currentLevel.endY - TILE_SIZE / 2 - offsetY, TILE_SIZE, TILE_SIZE);
        }
    }
}

let newlyRevealedTilesInFrame = false; 

function updateFogOfWar() {
    const currentLevel = window.level;
    const currentPlayer = window.player;
    const currentMercs = window.mercenaries;

    if (!currentPlayer || !currentLevel || !currentLevel.fogGrid || !currentLevel.width || !currentLevel.height) { return; }
    if (typeof TILE_SIZE === 'undefined' || typeof FOG_STATE === 'undefined' || typeof FOG_LOS_STEP_SCALE === 'undefined' ||
        typeof PLAYER_VISION_RADIUS === 'undefined' || typeof MERC_VISION_RADIUS === 'undefined' || typeof DRONE_VISION_RADIUS === 'undefined' || typeof CLASS_ID === 'undefined') {
        console.error("updateFogOfWar: Missing required global constants!"); return;
    }

    newlyRevealedTilesInFrame = false; 

    const revealTile = (gridX, gridY, isActualWallTile) => {
         if (gridX >= 0 && gridX < currentLevel.width && gridY >= 0 && gridY < currentLevel.height) {
             const currentFogState = currentLevel.fogGrid[gridY]?.[gridX];
             const tileKey = `${gridX},${gridY}`; 

             let oldFogStateForStaticCheck = currentFogState;

             let newFogState = currentFogState;
             if (currentFogState === FOG_STATE.HIDDEN || currentFogState === FOG_STATE.WALL_VISIBLE) {
                if (currentPlayer.classData.id === CLASS_ID.RECON &&
                    currentPlayer.passiveType === 'fog_wall_vision' &&
                    isActualWallTile &&
                    currentFogState !== FOG_STATE.REVEALED) {
                    newFogState = FOG_STATE.WALL_VISIBLE;
                } else if (currentFogState !== FOG_STATE.REVEALED) {
                    newFogState = FOG_STATE.REVEALED;
                }
             }

             if (newFogState !== currentFogState) {
                currentLevel.fogGrid[gridY][gridX] = newFogState;

                const tileType = currentLevel.grid[gridY]?.[gridX];
                const isStaticTile = (tileType === TILE.FLOOR || tileType === TILE.WALL || tileType === TILE.OBSTACLE || tileType === TILE.ENTRANCE || tileType === TILE.EXPLOSIVE_CRATE);

                if (isStaticTile && (newFogState === FOG_STATE.REVEALED || newFogState === FOG_STATE.WALL_VISIBLE) &&
                    !(oldFogStateForStaticCheck === FOG_STATE.REVEALED || oldFogStateForStaticCheck === FOG_STATE.WALL_VISIBLE)) {
                     if (typeof window !== 'undefined' && window.previouslyRevealedStaticTiles && !window.previouslyRevealedStaticTiles.has(tileKey)) {
                        newlyRevealedTilesInFrame = true; 
                        window.previouslyRevealedStaticTiles.add(tileKey);
                     }
                }
             }
         }
    };

    const revealAround = (worldCenterX, worldCenterY, radiusInTiles) => {
        if (typeof worldCenterX !== 'number' || typeof worldCenterY !== 'number' || radiusInTiles <= 0) return;

        const centerGridX = Math.floor(worldCenterX / TILE_SIZE);
        const centerGridY = Math.floor(worldCenterY / TILE_SIZE);
        const radiusSq = radiusInTiles * radiusInTiles;
        const intRadius = Math.ceil(radiusInTiles);

        for (let dy = -intRadius; dy <= intRadius; dy++) {
            for (let dx = -intRadius; dx <= intRadius; dx++) {
                if (dx*dx + dy*dy <= radiusSq) {
                    const currentGridX = centerGridX + dx;
                    const currentGridY = centerGridY + dy;
                    if (currentGridX >= 0 && currentGridX < currentLevel.width && currentGridY >= 0 && currentGridY < currentLevel.height) {
                        const fogState = currentLevel.fogGrid[currentGridY]?.[currentGridX];
                        const tileTypeAtLoc = currentLevel.grid[currentGridY]?.[currentGridX];
                        const isWallTileHere = tileTypeAtLoc === TILE.WALL || tileTypeAtLoc === TILE.EXPLOSIVE_CRATE;

                        let needsProcessing = fogState === FOG_STATE.HIDDEN;
                        if (fogState === FOG_STATE.WALL_VISIBLE) {
                            if (!(currentPlayer.classData.id === CLASS_ID.RECON && currentPlayer.passiveType === 'fog_wall_vision' && isWallTileHere)) {
                                needsProcessing = true;
                            }
                        }

                        if (needsProcessing) {
                            const tileWorldCenterX = currentGridX * TILE_SIZE + TILE_SIZE / 2;
                            const tileWorldCenterY = currentGridY * TILE_SIZE + TILE_SIZE / 2;
                            if (typeof hasLineOfSight === 'function') {
                                 hasLineOfSight(worldCenterX, worldCenterY, tileWorldCenterX, tileWorldCenterY,
                                                isWallForLoS, revealTile, FOG_LOS_STEP_SCALE);
                            } else {
                                console.warn("hasLineOfSight function not found, revealing tile directly.");
                                revealTile(currentGridX, currentGridY, isWallTileHere);
                            }
                        }
                    }
                }
            }
        }
    };

    if (currentPlayer.x && currentPlayer.y) revealAround(currentPlayer.x, currentPlayer.y, PLAYER_VISION_RADIUS);
    if (currentMercs && Array.isArray(currentMercs)) {
        currentMercs.forEach(merc => {
            if (merc && merc.active && typeof merc.x === 'number' && typeof merc.y === 'number') revealAround(merc.x, merc.y, MERC_VISION_RADIUS);
        });
    }
    if (currentPlayer.drones && Array.isArray(currentPlayer.drones) && currentPlayer.classData.id !== CLASS_ID.RECON) {
        currentPlayer.drones.forEach(drone => {
            if (drone && drone.active && typeof drone.x === 'number' && typeof drone.y === 'number') revealAround(drone.x, drone.y, DRONE_VISION_RADIUS);
        });
    }

    if (newlyRevealedTilesInFrame) {
        window.staticBufferNeedsRedraw = true;
    }
}

// --- Helper function to destroy a tile ---
function destroyTile(gridX, gridY) {
    const currentLevel = window.level;
    if (!currentLevel || !currentLevel.grid) return;
    if (gridX > 0 && gridX < currentLevel.width - 1 && gridY > 0 && gridY < currentLevel.height - 1) {
        const tileType = currentLevel.grid[gridY]?.[gridX];
        if (tileType === TILE.WALL || tileType === TILE.OBSTACLE || tileType === TILE.EXPLOSIVE_CRATE) {
            if (currentLevel.grid[gridY]) currentLevel.grid[gridY][gridX] = TILE.FLOOR;
            if (currentLevel.pathfinderGrid && typeof currentLevel.pathfinderGrid.setWalkableAt === 'function') {
                currentLevel.pathfinderGrid.setWalkableAt(gridX, gridY, true);
            }
            if (currentLevel.fogGrid?.[gridY]?.[gridX] !== FOG_STATE.REVEALED && currentLevel.fogGrid[gridY]) {
                currentLevel.fogGrid[gridY][gridX] = FOG_STATE.REVEALED;
            }
            if (typeof window !== 'undefined') {
                 window.staticBufferNeedsRedraw = true;
                 if (window.previouslyRevealedStaticTiles) {
                    window.previouslyRevealedStaticTiles.delete(`${gridX},${gridY}`);
                 }
            }
            // If it was an explosive crate, remove it from the active list
            if (tileType === TILE.EXPLOSIVE_CRATE && window.explosiveCrates) {
                window.explosiveCrates = window.explosiveCrates.filter(crate => !(crate.gridX === gridX && crate.gridY === gridY));
            }
        }
    }
}
// --- END OF FILE level_render_fog.js ---