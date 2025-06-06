// --- START OF FILE level_helpers_urban.js ---

// Assumes globals: Math, console, getRandomInt, distance, TILE_SIZE, TILE
// Assumes constants from constants.js (MIN_BLOCK_URBAN_NORMAL, MAX_STREET_THICKNESS_URBAN, DISTRICT_TYPE_URBAN, LOOP_CREATION_PROBABILITY etc.)

function carveLineUrban(level, x1, y1, x2, y2, tileToSet = TILE.FLOOR, width = 1, canCarveTest = (lx, ly, tile) => tile === TILE.WALL, bounds = null) {
    let dx = Math.abs(x2 - x1); let dy = Math.abs(y2 - y1); let sx = (x1 < x2) ? 1 : -1; let sy = (y1 < y2) ? 1 : -1; let err = dx - dy; let currentX = x1; let currentY = y1; let safety = 0; const maxSafety = (level.width + level.height) * 2;
    const minX = bounds ? Math.max(0, bounds.x1) : 0; const minY = bounds ? Math.max(0, bounds.y1) : 0; const maxX = bounds ? Math.min(level.width - 1, bounds.x2) : level.width - 1; const maxY = bounds ? Math.min(level.height - 1, bounds.y2) : level.height - 1;
    const isHorizontal = dx > dy;
    while (safety++ < maxSafety) {
        for (let w_offset = 0; w_offset < width; w_offset++) { let carveX = currentX; let carveY = currentY; if (width > 1) { if (isHorizontal) carveY += w_offset - Math.floor(width / 2); else carveX += w_offset - Math.floor(width / 2); }
            if (carveX >= minX && carveX <= maxX && carveY >= minY && carveY <= maxY) { const currentTile = level.grid[carveY]?.[carveX]; if (currentTile !== undefined && canCarveTest(carveX, carveY, currentTile)) { if(level.grid[carveY]) level.grid[carveY][carveX] = tileToSet; }}}
        if ((currentX === x2) && (currentY === y2)) break; let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; currentX += sx; } if (e2 < dx) { err += dx; currentY += sy; }
    } if (safety >= maxSafety) console.warn("carveLineUrban exceeded safety limit", { x1, y1, x2, y2 });
}

function getWeightedRandomDistrictUrban() {
    const totalWeight = DISTRICT_POOL_URBAN.reduce((sum, district) => sum + district.w, 0); let randomNum = Math.random() * totalWeight;
    for (const district of DISTRICT_POOL_URBAN) { if (randomNum < district.w) return district.type; randomNum -= district.w; } return DISTRICT_POOL_URBAN[DISTRICT_POOL_URBAN.length - 1].type;
}

function layOutStreetsUrbanInBounds(level, bounds, isDense = false) {
    const { x1, y1, x2, y2 } = bounds; const regionWidth = x2 - x1 + 1; const regionHeight = y2 - y1 + 1; const minBlock = isDense ? MIN_BLOCK_URBAN_DENSE : MIN_BLOCK_URBAN_NORMAL; const maxBlock = isDense ? MAX_BLOCK_URBAN_DENSE : MAX_BLOCK_URBAN_NORMAL; const defaultStreetThickness = isDense ? STREET_THICKNESS_DENSE_URBAN : MAX_STREET_THICKNESS_URBAN;
    for (let ry_init = y1; ry_init <= y2; ry_init++) { for (let rx_init = x1; rx_init <= x2; rx_init++) { if (level.districtGrid[ry_init]?.[rx_init] === undefined && level.districtGrid[ry_init]) level.districtGrid[ry_init][rx_init] = DISTRICT_TYPE_URBAN.NONE; } }
    let currentShiftY = 0; let lastQuarterY = -1; let currentStreetThicknessY = isDense ? defaultStreetThickness : getRandomInt(MIN_STREET_THICKNESS_URBAN, MAX_STREET_THICKNESS_URBAN);
    for (let ry_loop = y1; ry_loop <= y2;) { const currentQuarterY = Math.floor((ry_loop - y1) / (regionHeight / 3)); if (currentQuarterY !== lastQuarterY ) { if (Math.random() < 0.9) { if (Math.random() < 0.75) { currentShiftY = (Math.random() < 0.5) ? 1 : -1; } else if (PRIMARY_QUARTER_SHIFT_MAX_URBAN > 1) { currentShiftY = getRandomInt(2, PRIMARY_QUARTER_SHIFT_MAX_URBAN) * ((Math.random() < 0.5) ? 1 : -1); } else { currentShiftY = 0; }} else { currentShiftY = 0; } if(!isDense) currentStreetThicknessY = getRandomInt(MIN_STREET_THICKNESS_URBAN, MAX_STREET_THICKNESS_URBAN); lastQuarterY = currentQuarterY; }
        const baseStreetY = ry_loop + currentShiftY; const actualY = Math.max(y1, Math.min(y2 - currentStreetThicknessY + 1, baseStreetY)); const blockH = getRandomInt(minBlock, maxBlock);
        for (let sy = 0; sy < currentStreetThicknessY; sy++) { const currentGlobalY = actualY + sy; if (currentGlobalY >= y1 && currentGlobalY <= y2) { let secondaryShiftX = 0; if (sy === Math.floor(currentStreetThicknessY / 2) && Math.random() < 0.4) { secondaryShiftX = (Math.random() < 0.5) ? -SECONDARY_STREET_SEGMENT_SHIFT_MAX : SECONDARY_STREET_SEGMENT_SHIFT_MAX; } for (let rx_street = x1; rx_street <= x2; rx_street++) { const finalX = Math.max(x1, Math.min(x2, rx_street + secondaryShiftX)); if(level.grid[currentGlobalY]) level.grid[currentGlobalY][finalX] = TILE.FLOOR; if(level.districtGrid[currentGlobalY]) level.districtGrid[currentGlobalY][finalX] = DISTRICT_TYPE_URBAN.NONE; if (secondaryShiftX !== 0 && rx_street + secondaryShiftX !== finalX) { if(level.grid[currentGlobalY]) level.grid[currentGlobalY][rx_street] = TILE.FLOOR; if(level.districtGrid[currentGlobalY]) level.districtGrid[currentGlobalY][rx_street] = DISTRICT_TYPE_URBAN.NONE; }}}}
        ry_loop += blockH + currentStreetThicknessY;
    }
    let currentShiftX = 0; let lastQuarterX = -1; let currentStreetThicknessX = isDense ? defaultStreetThickness : getRandomInt(MIN_STREET_THICKNESS_URBAN, MAX_STREET_THICKNESS_URBAN);
    for (let rx_loop = x1; rx_loop <= x2;) { const currentQuarterX = Math.floor((rx_loop - x1) / (regionWidth / 3)); if (currentQuarterX !== lastQuarterX) { if (Math.random() < 0.9) { if (Math.random() < 0.75) { currentShiftX = (Math.random() < 0.5) ? 1 : -1; } else if (PRIMARY_QUARTER_SHIFT_MAX_URBAN > 1) { currentShiftX = getRandomInt(2, PRIMARY_QUARTER_SHIFT_MAX_URBAN) * ((Math.random() < 0.5) ? 1 : -1); } else { currentShiftX = 0;}} else { currentShiftX = 0;} if(!isDense) currentStreetThicknessX = getRandomInt(MIN_STREET_THICKNESS_URBAN, MAX_STREET_THICKNESS_URBAN); lastQuarterX = currentQuarterX; }
        const baseStreetX = rx_loop + currentShiftX; const actualX = Math.max(x1, Math.min(x2 - currentStreetThicknessX + 1, baseStreetX)); const blockW = getRandomInt(minBlock, maxBlock);
        for (let sx = 0; sx < currentStreetThicknessX; sx++) { const currentGlobalX = actualX + sx; if (currentGlobalX >= x1 && currentGlobalX <= x2) { let secondaryShiftY = 0; if (sx === Math.floor(currentStreetThicknessX / 2) && Math.random() < 0.4) { secondaryShiftY = (Math.random() < 0.5) ? -SECONDARY_STREET_SEGMENT_SHIFT_MAX : SECONDARY_STREET_SEGMENT_SHIFT_MAX; } for (let ry_street = y1; ry_street <= y2; ry_street++) { const finalY = Math.max(y1, Math.min(y2, ry_street + secondaryShiftY)); if(level.grid[finalY]) level.grid[finalY][currentGlobalX] = TILE.FLOOR; if(level.districtGrid[finalY]) level.districtGrid[finalY][currentGlobalX] = DISTRICT_TYPE_URBAN.NONE; if (secondaryShiftY !== 0 && ry_street + secondaryShiftY !== finalY) { if(level.grid[ry_street]) level.grid[ry_street][currentGlobalX] = TILE.FLOOR; if(level.districtGrid[ry_street]) level.districtGrid[ry_street][currentGlobalX] = DISTRICT_TYPE_URBAN.NONE; }}}}
        rx_loop += blockW + currentStreetThicknessX;
    }
}

function assignDistrictsUrbanInBounds(level, bounds, isDense = false) {
    const { x1, y1, x2, y2 } = bounds; const visitedRegion = Array.from({ length: level.height }, () => Array(level.width).fill(false)); let blocksInRegion = [];
    for (let r_scan = y1; r_scan <= y2; r_scan++) { for (let c_scan = x1; c_scan <= x2; c_scan++) { if (level.grid[r_scan]?.[c_scan] === TILE.WALL && !visitedRegion[r_scan]?.[c_scan]) {
        const currentBlockTiles = []; const q = [[c_scan, r_scan]]; visitedRegion[r_scan][c_scan] = true; let isProperBlock = true; let minBlockX = c_scan, maxBlockX = c_scan, minBlockY = r_scan, maxBlockY = r_scan;
        while (q.length > 0) { const [qx, qy_bfs] = q.shift(); if (qx <= x1 || qx >= x2 || qy_bfs <= y1 || qy_bfs >= y2 ) isProperBlock = false; if (qx <= 0 || qx >= level.width - 1 || qy_bfs <= 0 || qy_bfs >= level.height - 1) isProperBlock = false; currentBlockTiles.push({ x: qx, y: qy_bfs }); minBlockX = Math.min(minBlockX, qx); maxBlockX = Math.max(maxBlockX, qx); minBlockY = Math.min(minBlockY, qy_bfs); maxBlockY = Math.max(maxBlockY, qy_bfs); const neighbors = [[0,1],[0,-1],[1,0],[-1,0]];
            for(const [dx,dy_n] of neighbors){ const nx = qx+dx; const ny = qy_bfs+dy_n; if(nx>=x1 && nx<=x2 && ny>=y1 && ny<=y2){ if(level.grid[ny]?.[nx]===TILE.WALL && !visitedRegion[ny]?.[nx]){ visitedRegion[ny][nx]=true; q.push([nx,ny]);}} else if (nx>=0 && nx < level.width && ny>=0 && ny < level.height && level.grid[ny]?.[nx]===TILE.WALL) { isProperBlock = false;} else {isProperBlock = false;}}}
        let perimeterFloorCount = 0; let perimeterTotal = 0; for(let px = minBlockX; px <= maxBlockX; px++){ if(level.grid[minBlockY-1]?.[px] !== undefined && minBlockY-1 >= y1) { perimeterTotal++; if(level.grid[minBlockY-1][px] === TILE.FLOOR) perimeterFloorCount++; } if(level.grid[maxBlockY+1]?.[px] !== undefined && maxBlockY+1 <= y2) { perimeterTotal++; if(level.grid[maxBlockY+1][px] === TILE.FLOOR) perimeterFloorCount++; } } for(let py_perimeter = minBlockY; py_perimeter <= maxBlockY; py_perimeter++){ if(level.grid[py_perimeter]?.[minBlockX-1] !== undefined && minBlockX-1 >= x1) { perimeterTotal++; if(level.grid[py_perimeter][minBlockX-1] === TILE.FLOOR) perimeterFloorCount++; } if(level.grid[py_perimeter]?.[maxBlockX+1] !== undefined && maxBlockX+1 <= x2) { perimeterTotal++; if(level.grid[py_perimeter][maxBlockX+1] === TILE.FLOOR) perimeterFloorCount++; } } isProperBlock = (perimeterTotal > 0 && perimeterFloorCount >= perimeterTotal * 0.5) && isProperBlock;
        const currentBlockMinSize = isDense ? MIN_BLOCK_URBAN_DENSE : MIN_BLOCK_URBAN_NORMAL; const minBlockArea = Math.max(4, Math.floor(currentBlockMinSize / 2) * Math.floor(currentBlockMinSize / 2));
        if (currentBlockTiles.length > minBlockArea && isProperBlock) { const districtType = isDense ? DISTRICT_TYPE_URBAN.DENSE_URBAN_CORE : getWeightedRandomDistrictUrban(); currentBlockTiles.forEach(tile => { if(level.districtGrid[tile.y]) level.districtGrid[tile.y][tile.x] = districtType; }); blocksInRegion.push({ type: districtType, tiles: currentBlockTiles, bounds: { minX: minBlockX, maxX: maxBlockX, minY: minBlockY, maxY: maxBlockY } }); }
    }}}
    blocksInRegion.forEach(block => { if (block.type !== DISTRICT_TYPE_URBAN.PARK && block.type !== DISTRICT_TYPE_URBAN.DENSE_URBAN_CORE) { carveAlleysForSpecificBlockUrban(level, block.tiles, bounds); }});
    level.blocks = (level.blocks || []).concat(blocksInRegion);
}

function carveAlleysForSpecificBlockUrban(level, blockTiles, regionBounds) {
    if (Math.random() < ALLEY_CHANCE_URBAN) {
        const edgeWallTiles = []; blockTiles.forEach(wallTile => { const { x, y } = wallTile; const neighbors = [[0,1],[0,-1],[1,0],[-1,0]]; for(const [dx,dy] of neighbors){ const nx=x+dx; const ny=y+dy; if(nx>=regionBounds.x1 && nx<=regionBounds.x2 && ny>=regionBounds.y1 && ny<=regionBounds.y2){ if(level.grid[ny]?.[nx] === TILE.FLOOR){ edgeWallTiles.push({wallX:x, wallY:y}); break; }}}});
        if (edgeWallTiles.length < 2) return; let startEdge = edgeWallTiles[getRandomInt(0, edgeWallTiles.length - 1)]; let endEdge = null; edgeWallTiles.sort((a,b) => distance(b.wallX,b.wallY,startEdge.wallX,startEdge.wallY) - distance(a.wallX,a.wallY,startEdge.wallX,startEdge.wallY)); for(let i=0;i<edgeWallTiles.length;i++){if(edgeWallTiles[i].wallX!==startEdge.wallX || edgeWallTiles[i].wallY!==startEdge.wallY){endEdge=edgeWallTiles[i];break;}}
        if(startEdge && endEdge){ const pathStartX=startEdge.wallX; const pathStartY=startEdge.wallY; const pathEndX=endEdge.wallX; const pathEndY=endEdge.wallY; const blockWallCoords = new Set(blockTiles.map(t => `${t.x},${t.y}`)); const canCarveAlleyTile = (lx,ly,tile) => blockWallCoords.has(`${lx},${ly}`); let midX1=pathStartX,midY1=pathStartY,midX2=pathEndX,midY2=pathEndY; if(Math.random()<0.5){midX1=pathEndX;midY2=pathStartY;}else{midY1=pathEndY;midX2=pathStartX;} const alleyWidth = getRandomInt(ALLEY_MIN_WIDTH, ALLEY_MAX_WIDTH); carveLineUrban(level,pathStartX,pathStartY,midX1,midY1,TILE.FLOOR,alleyWidth,canCarveAlleyTile, regionBounds); carveLineUrban(level,midX1,midY1,midX2,midY2,TILE.FLOOR,alleyWidth,canCarveAlleyTile, regionBounds); carveLineUrban(level,midX2,midY2,pathEndX,pathEndY,TILE.FLOOR,alleyWidth,canCarveAlleyTile, regionBounds); if(level.grid[startEdge.wallY]?.[startEdge.wallX]===TILE.WALL && blockWallCoords.has(`${startEdge.wallX},${startEdge.wallY}`) && level.grid[startEdge.wallY])level.grid[startEdge.wallY][startEdge.wallX]=TILE.FLOOR; if(level.grid[endEdge.wallY]?.[endEdge.wallX]===TILE.WALL && blockWallCoords.has(`${endEdge.wallX},${endEdge.wallY}`) && level.grid[endEdge.wallY])level.grid[endEdge.wallY][endEdge.wallX]=TILE.FLOOR; }
    }
}

function generateMazeRegion(level, bounds) {
    const { x1, y1, x2, y2 } = bounds;
    for (let y_init_maze = y1; y_init_maze <= y2; y_init_maze++) { for (let x_init_maze = x1; x_init_maze <= x2; x_init_maze++) { if(level.grid[y_init_maze]) level.grid[y_init_maze][x_init_maze] = TILE.WALL; if(level.districtGrid[y_init_maze]) level.districtGrid[y_init_maze][x_init_maze] = DISTRICT_TYPE_URBAN.MAZE_RUIN;}}
    const stack = []; let startMazeX = x1+(getRandomInt(0,Math.floor((x2-x1-1)/2))*2)+1; let startMazeY = y1+(getRandomInt(0,Math.floor((y2-y1-1)/2))*2)+1; startMazeX=Math.max(x1+1,Math.min(x2-1,startMazeX)); startMazeY=Math.max(y1+1,Math.min(y2-1,startMazeY)); if((startMazeX-x1)%2===0)startMazeX=(startMazeX+1<=x2-1&&startMazeX+1>=x1+1)?startMazeX+1:startMazeX-1; if((startMazeY-y1)%2===0)startMazeY=(startMazeY+1<=y2-1&&startMazeY+1>=y1+1)?startMazeY+1:startMazeY-1; startMazeX=Math.max(x1+1,Math.min(x2-1,startMazeX)); startMazeY=Math.max(y1+1,Math.min(y2-1,startMazeY));
    if(level.grid[startMazeY]?.[startMazeX]===undefined){console.error("Maze start out of bounds",startMazeX,startMazeY,bounds);return;} if(level.grid[startMazeY]) level.grid[startMazeY][startMazeX]=TILE.FLOOR;stack.push({x:startMazeX,y:startMazeY});
    const carveMaze=(cx,cy)=>{if(cx>=x1&&cx<=x2&&cy>=y1&&cy<=y2 && level.grid[cy]){level.grid[cy][cx]=TILE.FLOOR;}}; let mazeGenSteps=0;const maxMazeGenSteps=(x2-x1+1)*(y2-y1+1)*1.5;
    while(stack.length>0&&mazeGenSteps<maxMazeGenSteps){mazeGenSteps++;const current=stack[stack.length-1];const neighbors=[];const directions=[{x:0,y:-2},{x:0,y:2},{x:-2,y:0},{x:2,y:0}];directions.sort(()=>Math.random()-0.5);
    for(const dir of directions){const nx=current.x+dir.x;const ny=current.y+dir.y;const wallX=current.x+dir.x/2;const wallY=current.y+dir.y/2;if(nx>x1&&nx<x2&&ny>y1&&ny<y2&&level.grid[ny]?.[nx]===TILE.WALL&&wallX>x1&&wallX<x2&&wallY>y1&&wallY<y2){neighbors.push({x:nx,y:ny,wallX:wallX,wallY:wallY});}}
    if(neighbors.length>0){const chosen=neighbors[0];carveMaze(chosen.wallX,chosen.wallY);carveMaze(chosen.x,chosen.y);stack.push({x:chosen.x,y:chosen.y});}else{stack.pop();}}
    if(mazeGenSteps>=maxMazeGenSteps)console.warn("Maze region gen steps exceeded.");
    const mazeLoopProb = (typeof LOOP_CREATION_PROBABILITY !== 'undefined' ? LOOP_CREATION_PROBABILITY : 0.1) * 1.5;
    for (let my = y1 + 1; my < y2; my++) { for (let mx = x1 + 1; mx < x2; mx++) { if (level.grid[my]?.[mx] === TILE.WALL) { if (level.grid[my]?.[mx-1]===TILE.FLOOR && level.grid[my]?.[mx+1]===TILE.FLOOR && mx-1>=x1 && mx+1<=x2 && Math.random()<mazeLoopProb && level.grid[my]) level.grid[my][mx]=TILE.FLOOR; else if (level.grid[my-1]?.[mx]===TILE.FLOOR && level.grid[my+1]?.[mx]===TILE.FLOOR && my-1>=y1 && my+1<=y2 && Math.random()<mazeLoopProb && level.grid[my]) level.grid[my][mx]=TILE.FLOOR; }}}
    const mazeObstacleDensity = (RUBBLE_DENSITY_URBAN / 3) * RUBBLE_DENSITY_MAZE_MULTIPLIER_URBAN;
    for (let my_obs = y1 + 1; my_obs < y2; my_obs++) { for (let mx_obs = x1 + 1; mx_obs < x2; mx_obs++) { if (level.grid[my_obs]?.[mx_obs] === TILE.FLOOR && Math.random() < mazeObstacleDensity && level.grid[my_obs]) { level.grid[my_obs][mx_obs] = TILE.OBSTACLE; }}}
}

function generateMonolithPlazaRegion(level, bounds) {
    const { x1, y1, x2, y2 } = bounds;
    for (let y_mp = y1; y_mp <= y2; y_mp++) { for (let x_mp = x1; x_mp <= x2; x_mp++) { if(level.grid[y_mp]) level.grid[y_mp][x_mp] = TILE.FLOOR; if(level.districtGrid[y_mp]) level.districtGrid[y_mp][x_mp] = DISTRICT_TYPE_URBAN.MONOLITH_PLAZA; }}
    const monolithWidth = Math.max(3, Math.floor((x2 - x1 + 1 - (MONOLITH_MARGIN*2)) * 0.6)); const monolithHeight = Math.max(3, Math.floor((y2 - y1 + 1 - (MONOLITH_MARGIN*2)) * 0.6));
    const monolithX = x1 + MONOLITH_MARGIN + Math.floor(((x2 - x1 + 1 - (MONOLITH_MARGIN*2)) - monolithWidth) / 2); const monolithY = y1 + MONOLITH_MARGIN + Math.floor(((y2 - y1 + 1 - (MONOLITH_MARGIN*2)) - monolithHeight) / 2);
    for (let my_mp = monolithY; my_mp < monolithY + monolithHeight; my_mp++) { for (let mx_mp = monolithX; mx_mp < monolithX + monolithWidth; mx_mp++) { if (mx_mp >= x1 && mx_mp <= x2 && my_mp >= y1 && my_mp <= y2) { if(level.grid[my_mp]) level.grid[my_mp][mx_mp] = TILE.WALL; if(level.districtGrid[my_mp]) level.districtGrid[my_mp][mx_mp] = DISTRICT_TYPE_URBAN.INDUSTRIAL; }}}
    if (monolithWidth > 3 && monolithHeight > 3) { const entranceSide = getRandomInt(0,3); let ex_mp = monolithX + Math.floor(monolithWidth/2); let ey_mp = monolithY + Math.floor(monolithHeight/2); if(entranceSide === 0) ey_mp = monolithY; else if(entranceSide === 1) ex_mp = monolithX + monolithWidth -1; else if(entranceSide === 2) ey_mp = monolithY + monolithHeight -1; else ex_mp = monolithX; if (level.grid[ey_mp]?.[ex_mp] === TILE.WALL && level.grid[ey_mp]) level.grid[ey_mp][ex_mp] = TILE.FLOOR;}
}

function createLoopsUrban(level) {
    let loopsCreated = 0; const loopProb = typeof LOOP_CREATION_PROBABILITY !== 'undefined' ? LOOP_CREATION_PROBABILITY : 0.15;
    for (let y = 1; y < level.height - 1; y++) { for (let x = 1; x < level.width - 1; x++) { if (level.grid[y]?.[x] === TILE.WALL || level.grid[y]?.[x] === TILE.OBSTACLE) {
        if (level.grid[y]?.[x-1]===TILE.FLOOR && level.grid[y]?.[x+1]===TILE.FLOOR && Math.random()<loopProb && level.grid[y]) { level.grid[y][x]=TILE.FLOOR; loopsCreated++; continue; }
        if (level.grid[y-1]?.[x]===TILE.FLOOR && level.grid[y+1]?.[x]===TILE.FLOOR && Math.random()<loopProb && level.grid[y]) { level.grid[y][x]=TILE.FLOOR; loopsCreated++; }
    }}} console.log(`Created ${loopsCreated} global loops.`);
}

function carveOpenAreasUrban(level) {
    const carvingDensityFactor = typeof CARVING_DENSITY_FACTOR !== 'undefined' ? CARVING_DENSITY_FACTOR : 60;
    const minCarveSize = typeof URBAN_CARVING_MIN_SIZE !== 'undefined' ? URBAN_CARVING_MIN_SIZE : 2; // Using specific Urban carving size
    const maxCarveSize = typeof URBAN_CARVING_MAX_SIZE !== 'undefined' ? URBAN_CARVING_MAX_SIZE : 4; // Using specific Urban carving size
    const totalTiles = level.width * level.height; const openingsToCarve = Math.floor(totalTiles / carvingDensityFactor); let openingsMade = 0;
    for (let i = 0; i < openingsToCarve; i++) { const size = getRandomInt(minCarveSize, maxCarveSize); const randX = getRandomInt(1, level.width - size - 2); const randY = getRandomInt(1, level.height - size - 2); if (randX <=0 || randY <=0) continue;
        for (let y_carve = randY; y_carve < randY + size; y_carve++) { for (let x_carve = randX; x_carve < randX + size; x_carve++) { if (x_carve > 0 && x_carve < level.width - 1 && y_carve > 0 && y_carve < level.height - 1) { if(level.grid[y_carve]) level.grid[y_carve][x_carve] = TILE.FLOOR; if(level.districtGrid[y_carve]?.[x_carve] && level.districtGrid[y_carve][x_carve] !== DISTRICT_TYPE_URBAN.NONE && level.districtGrid[y_carve]) level.districtGrid[y_carve][x_carve] = DISTRICT_TYPE_URBAN.NONE; }}} openingsMade++;
    } console.log(`Carved ${openingsMade} global open areas.`);
}

function carveBuildingCorners(level) {
    let cornersCarved = 0; if (!level.blocks || level.blocks.length === 0) { const tempVisited = Array.from({length: level.height}, () => Array(level.width).fill(false)); level.blocks = []; for(let r_bc=1; r_bc<level.height-1; ++r_bc){ for(let c_bc=1; c_bc<level.width-1; ++c_bc){ if(level.grid[r_bc]?.[c_bc] === TILE.WALL && !tempVisited[r_bc]?.[c_bc]){ const q_bc=[[c_bc,r_bc]]; tempVisited[r_bc][c_bc] = true; const blockTiles_bc=[{x:c_bc,y:r_bc}]; let minX_bc=c_bc,maxX_bc=c_bc,minY_bc=r_bc,maxY_bc=r_bc; while(q_bc.length > 0){ const[qx_bc,qy_bc]=q_bc.shift(); minX_bc=Math.min(minX_bc,qx_bc);maxX_bc=Math.max(maxX_bc,qx_bc);minY_bc=Math.min(minY_bc,qy_bc);maxY_bc=Math.max(maxY_bc,qy_bc); [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx_bc,dy_bc])=>{ const nx_bc=qx_bc+dx_bc,ny_bc=qy_bc+dy_bc; if(nx_bc>0&&nx_bc<level.width-1&&ny_bc>0&&ny_bc<level.height-1&&level.grid[ny_bc]?.[nx_bc]===TILE.WALL&&!tempVisited[ny_bc]?.[nx_bc]){tempVisited[ny_bc][nx_bc]=true;q_bc.push([nx_bc,ny_bc]);blockTiles_bc.push({x:nx_bc,y:ny_bc});}}); } if(blockTiles_bc.length > 4) level.blocks.push({type:level.districtGrid[r_bc]?.[c_bc] || DISTRICT_TYPE_URBAN.NONE, tiles: blockTiles_bc, bounds: {minX:minX_bc,maxX:maxX_bc,minY:minY_bc,maxY:maxY_bc}}); }}}}
    level.blocks.forEach(block => { if (block.type === DISTRICT_TYPE_URBAN.PARK || block.type === DISTRICT_TYPE_URBAN.OPEN_FIELD || block.type === DISTRICT_TYPE_URBAN.MONOLITH_PLAZA || block.type === DISTRICT_TYPE_URBAN.MAZE_RUIN) return;
        if (Math.random() < BUILDING_CORNER_CARVE_CHANCE) { const cornerType = getRandomInt(0, 3); const carveSize = getRandomInt(BUILDING_CORNER_CARVE_MIN_SIZE, BUILDING_CORNER_CARVE_MAX_SIZE); let startX_cc, startY_cc; switch (cornerType) { case 0: startX_cc = block.bounds.minX; startY_cc = block.bounds.minY; break; case 1: startX_cc = block.bounds.maxX - carveSize + 1; startY_cc = block.bounds.minY; break; case 2: startX_cc = block.bounds.minX; startY_cc = block.bounds.maxY - carveSize + 1; break; case 3: startX_cc = block.bounds.maxX - carveSize + 1; startY_cc = block.bounds.maxY - carveSize + 1; break; default: startX_cc=block.bounds.minX; startY_cc=block.bounds.minY; }
        startX_cc = Math.max(1, Math.min(level.width - carveSize - 1, startX_cc)); startY_cc = Math.max(1, Math.min(level.height - carveSize - 1, startY_cc)); startX_cc = Math.max(block.bounds.minX, Math.min(block.bounds.maxX - carveSize + 1, startX_cc)); startY_cc = Math.max(block.bounds.minY, Math.min(block.bounds.maxY - carveSize + 1, startY_cc)); let canCarve_cc = true; let originalWallTilesInCarveArea_cc = 0;
        for (let y_cc = startY_cc; y_cc < startY_cc + carveSize; y_cc++) { for (let x_cc = startX_cc; x_cc < startX_cc + carveSize; x_cc++) { if (x_cc > 0 && x_cc < level.width - 1 && y_cc > 0 && y_cc < level.height - 1) { let isPartOfThisBlock_cc = false; for(const tile_cc of block.tiles){ if(tile_cc.x === x_cc && tile_cc.y ===y_cc){isPartOfThisBlock_cc = true; break;}} if (level.grid[y_cc]?.[x_cc] === TILE.WALL && isPartOfThisBlock_cc) { originalWallTilesInCarveArea_cc++; }} else { canCarve_cc = false; break; }} if (!canCarve_cc) break; }
        if (canCarve_cc && originalWallTilesInCarveArea_cc > (carveSize * carveSize * 0.3)) { for (let y_cc_carve = startY_cc; y_cc_carve < startY_cc + carveSize; y_cc_carve++) { for (let x_cc_carve = startX_cc; x_cc_carve < startX_cc + carveSize; x_cc_carve++) { if (x_cc_carve > 0 && x_cc_carve < level.width - 1 && y_cc_carve > 0 && y_cc_carve < level.height - 1 && level.grid[y_cc_carve]) { level.grid[y_cc_carve][x_cc_carve] = TILE.FLOOR; }}} cornersCarved++; } }}); console.log(`Carved ${cornersCarved} building corners.`);
}

function placeRoadblocks(level) {
    let roadblocksPlaced = 0; 
    const ROADBLOCK_PLACE_ATTEMPTS_LOCAL = typeof ROADBLOCK_PLACE_ATTEMPTS !== 'undefined' ? ROADBLOCK_PLACE_ATTEMPTS : 5; // Use constant or a default
    for (let i = 0; i < ROADBLOCK_PLACE_ATTEMPTS_LOCAL; i++) { 
        const isHorizontal = Math.random() < 0.5; 
        const length = ROADBLOCK_LENGTH; 
        const thickness = ROADBLOCK_THICKNESS; 
        const randX = isHorizontal ? getRandomInt(1, level.width - length - 1) : getRandomInt(1, level.width - thickness - 1); 
        const randY = isHorizontal ? getRandomInt(1, level.height - thickness - 1) : getRandomInt(1, level.height - length - 1); 
        let canPlace = true; let roadblockTiles = [];
        if (isHorizontal) { for (let y_rb = randY; y_rb < randY + thickness; y_rb++) { for (let x_rb = randX; x_rb < randX + length; x_rb++) { if (level.grid[y_rb]?.[x_rb] !== TILE.FLOOR || level.districtGrid[y_rb]?.[x_rb] !== DISTRICT_TYPE_URBAN.NONE) { canPlace = false; break; } roadblockTiles.push({x:x_rb, y:y_rb}); } if (!canPlace) break; }
        } else { for (let y_rb = randY; y_rb < randY + length; y_rb++) { for (let x_rb = randX; x_rb < randX + thickness; x_rb++) { if (level.grid[y_rb]?.[x_rb] !== TILE.FLOOR || level.districtGrid[y_rb]?.[x_rb] !== DISTRICT_TYPE_URBAN.NONE) { canPlace = false; break; } roadblockTiles.push({x:x_rb,y:y_rb}); } if (!canPlace) break; } }
        if (canPlace && roadblockTiles.length > 0) { roadblockTiles.forEach(tile => { if(level.grid[tile.y]) level.grid[tile.y][tile.x] = TILE.OBSTACLE; }); roadblocksPlaced++; } } console.log(`Placed ${roadblocksPlaced} roadblocks.`);
}
// --- END OF FILE level_helpers_urban.js ---