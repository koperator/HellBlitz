// --- START OF FILE level_generator.js ---

// Assumes globals: window, console, Math, PF, getRandomInt, distance, TILE_SIZE, TILE, FOG_STATE, Powerup, MAX_POWERUPS_ON_MAP, powerupConfig, START_AREA_RADIUS
// Assumes constants from constants.js (START_AREA_RADIUS, NUM_EXITS, MIN_ENTRANCE_EXIT_DISTANCE_FACTOR, TILE.EXPLOSIVE_CRATE, MAX_EXPLOSIVE_CRATES, RUBBLE_CHANCE, STITCH_CHANCE_OPEN etc.)
// Assumes constants from constants.js (ZONE_TYPE, MAX_STREET_THICKNESS_URBAN, DISTRICT_TYPE_URBAN etc. are now here)
// Assumes helper functions from level_helpers_urban.js (layOutStreetsUrbanInBounds, assignDistrictsUrbanInBounds, generateMazeRegion, generateMonolithPlazaRegion, createLoopsUrban, carveOpenAreasUrban, carveBuildingCorners, placeRoadblocks etc.)
// Assumes ExplosiveCrate class will be defined

// <<< CONSTANTS FOR MAZE OPENINGS >>>
const MAZE_EXTRA_OPENING_CHANCE = 0.3;
const MAZE_MIN_OPENINGS_PER_SIDE_TARGET = 1;
const MAZE_MAX_OPENINGS_PER_SIDE = 3;


// --- Core Level Helper Functions ---
function isWall(gridX, gridY) { // For projectile collision (stopping)
    const currentLevel = window.level || {}; if (!currentLevel.grid) return true;
    if (gridX < 0 || gridX >= currentLevel.width || gridY < 0 || gridY >= currentLevel.height) return true;
    const tileType = currentLevel.grid[gridY]?.[gridX];
    return tileType === TILE.WALL || tileType === TILE.OBSTACLE;
}

function isWallForLoS(gridX, gridY) { 
    const currentLevel = window.level || {}; if (!currentLevel.grid) return true;
    if (gridX < 0 || gridX >= currentLevel.width || gridY < 0 || gridY >= currentLevel.height) return true;
    const tileType = currentLevel.grid[gridY]?.[gridX];
    return tileType === TILE.WALL || tileType === TILE.EXPLOSIVE_CRATE;
}

function isSolidForPlayer(gridX, gridY) {
    const currentLevel = window.level || {}; if (!currentLevel.grid) return true;
    if (gridX < 0 || gridX >= currentLevel.width || gridY < 0 || gridY >= currentLevel.height) return true;
    const tileType = currentLevel.grid[gridY]?.[gridX];
    return tileType === TILE.WALL || tileType === TILE.OBSTACLE || tileType === TILE.ENTRANCE || tileType === TILE.EXPLOSIVE_CRATE;
}

function checkWallCollision(px, py, r) {
    const currentLevel = window.level || {}; if (!currentLevel.grid) return true;
    if (px - r < 0 || px + r >= currentLevel.width * TILE_SIZE || py - r < 0 || py + r >= currentLevel.height * TILE_SIZE) return true;
    const margin = 0.1;
    const checkPoints = [
        { x: px, y: py }, { x: px + r - margin, y: py }, { x: px - r + margin, y: py },
        { x: px, y: py + r - margin }, { x: px, y: py - r + margin },
        { x: px + (r-margin)*0.707, y: py + (r-margin)*0.707 }, { x: px - (r-margin)*0.707, y: py + (r-margin)*0.707 },
        { x: px + (r-margin)*0.707, y: py - (r-margin)*0.707 }, { x: px - (r-margin)*0.707, y: py - (r-margin)*0.707 }
    ];
    for (const p of checkPoints) {
        const gridX = Math.floor(p.x / TILE_SIZE); const gridY = Math.floor(p.y / TILE_SIZE);
        if (isSolidForPlayer(gridX, gridY)) return true;
    }
    return false;
}

function addExtraOpeningsToMazeRegion(levelData, regionBounds) {
    const { x1, y1, x2, y2 } = regionBounds;
    const openSidePerimeter = (wallCoordsProvider, getInnerTileCoords) => {
        const wallCoordinates = wallCoordsProvider(); if (wallCoordinates.length === 0) return;
        let eligibleSpots = [];
        for (const {x: wx, y: wy} of wallCoordinates) {
            if (wx<0||wx>=levelData.width||wy<0||wy>=levelData.height) continue;
            const {x: ix, y: iy} = getInnerTileCoords(wx, wy);
            if (ix<0||ix>=levelData.width||iy<0||iy>=levelData.height) continue;
            if (levelData.grid[wy]?.[wx]===TILE.WALL && levelData.grid[iy]?.[ix]===TILE.FLOOR) eligibleSpots.push({x:wx,y:wy});
        }
        if (eligibleSpots.length === 0) return; eligibleSpots.sort(()=>Math.random()-0.5);
        let openingsMade = 0;
        for (const spot of eligibleSpots) {
            if (openingsMade >= MAZE_MAX_OPENINGS_PER_SIDE) break;
            if (Math.random() < MAZE_EXTRA_OPENING_CHANCE) {
                 if (levelData.grid[spot.y]?.[spot.x] === TILE.WALL) { levelData.grid[spot.y][spot.x] = TILE.FLOOR; openingsMade++; }
            }
        }
        if (openingsMade < MAZE_MIN_OPENINGS_PER_SIDE_TARGET) {
            for (const spot of eligibleSpots) {
                if (openingsMade >= MAZE_MAX_OPENINGS_PER_SIDE || openingsMade >= MAZE_MIN_OPENINGS_PER_SIDE_TARGET) break;
                if (levelData.grid[spot.y]?.[spot.x] === TILE.WALL) { levelData.grid[spot.y][spot.x] = TILE.FLOOR; openingsMade++; }
            }
        }
    };
    if(y1>=0 && y1<levelData.height-1) openSidePerimeter(()=>Array.from({length:x2-x1+1},(_,i)=>({x:x1+i,y:y1})), (wx,wy)=>({x:wx,y:wy+1}));
    if(y2>0 && y2<levelData.height) openSidePerimeter(()=>Array.from({length:x2-x1+1},(_,i)=>({x:x1+i,y:y2})), (wx,wy)=>({x:wx,y:wy-1}));
    if(x1>=0 && x1<levelData.width-1) openSidePerimeter(()=>Array.from({length:y2-1-(y1+1)+1},(_,i)=>({x:x1,y:y1+1+i})), (wx,wy)=>({x:wx+1,y:wy}));
    if(x2>0 && x2<levelData.width) openSidePerimeter(()=>Array.from({length:y2-1-(y1+1)+1},(_,i)=>({x:x2,y:y1+1+i})), (wx,wy)=>({x:wx-1,y:wy}));
}

function pickStartEndUrban(level) {
    const START_AREA_RADIUS_LOCAL = (typeof START_AREA_RADIUS !== 'undefined') ? START_AREA_RADIUS : 3;
    let startCandidates = []; 
    if (typeof DISTRICT_TYPE_URBAN !== 'undefined' && DISTRICT_TYPE_URBAN.RESIDENTIAL) {
        for (let y=1;y<level.height-1;y++) for (let x=1;x<Math.floor(level.width*0.4);x++) if (level.grid[y]?.[x]===TILE.FLOOR && level.districtGrid[y]?.[x]===DISTRICT_TYPE_URBAN.RESIDENTIAL) startCandidates.push({x,y});
    }
    if (startCandidates.length===0) for (let y=1;y<level.height-1;y++) for (let x=1;x<Math.floor(level.width*0.4);x++) if (level.grid[y]?.[x]===TILE.FLOOR) startCandidates.push({x,y});
    if (startCandidates.length===0) for (let y=1;y<level.height-1;y++) for (let x=1;x<level.width-1;x++) if (level.grid[y]?.[x]===TILE.FLOOR) startCandidates.push({x,y});
    
    let startTile; if(startCandidates.length>0)startTile=startCandidates[getRandomInt(0,startCandidates.length-1)]; else { console.warn("Forcing start point!");startTile={x:Math.max(1,Math.floor(level.width*0.1)),y:Math.max(1,Math.floor(level.height*0.5))};if(level.grid[startTile.y]?.[startTile.x]!==undefined&&level.grid[startTile.y])level.grid[startTile.y][startTile.x]=TILE.FLOOR;else{console.error("Can't force start!");return false;}}
    level.startX = startTile.x*TILE_SIZE+TILE_SIZE/2; level.startY = startTile.y*TILE_SIZE+TILE_SIZE/2;
    for (let dy=-START_AREA_RADIUS_LOCAL;dy<=START_AREA_RADIUS_LOCAL;dy++) for (let dx=-START_AREA_RADIUS_LOCAL;dx<=START_AREA_RADIUS_LOCAL;dx++) {const gx=startTile.x+dx;const gy=startTile.y+dy;if(gx>0&&gx<level.width-1&&gy>0&&gy<level.height-1){if(level.grid[gy]?.[gx]!==undefined&&level.grid[gy][gx]!==TILE.ENTRANCE&&level.grid[gy])level.grid[gy][gx]=TILE.FLOOR;if(level.fogGrid?.[gy]?.[gx]!==undefined&&level.fogGrid[gy])level.fogGrid[gy][gx]=FOG_STATE.REVEALED;}} if(level.fogGrid?.[startTile.y]?.[startTile.x]!==undefined&&level.fogGrid[startTile.y])level.fogGrid[startTile.y][startTile.x]=FOG_STATE.REVEALED;
    
    let endCandidates = []; let allFloorTiles = []; const endSearchStartX=Math.floor(level.width*0.6); for(let y=1;y<level.height-1;y++)for(let x=1;x<level.width-1;x++)if(level.grid[y]?.[x]===TILE.FLOOR){allFloorTiles.push({x,y});if(x>=endSearchStartX)endCandidates.push({x,y});}
    let endTile=null; 
    if(typeof PF!=='undefined'&&PF.Grid&&PF.AStarFinder&&endCandidates.length>0&&level.finder){
        const tempPfGrid=new PF.Grid(level.width,level.height);
        for(let r=0;r<level.height;r++)for(let c=0;c<level.width;c++){const t=level.grid[r]?.[c];tempPfGrid.setWalkableAt(c,r,t===TILE.FLOOR||t===TILE.EXPLOSIVE_CRATE);}
        endCandidates.sort(()=>Math.random()-0.5);
        for(const cand of endCandidates){const clone=tempPfGrid.clone();try{const path=level.finder.findPath(startTile.x,startTile.y,cand.x,cand.y,clone);if(path&&path.length>0){endTile=cand;break;}}catch(e){/*ignore*/}}
        if(endTile)console.log("End by pathfinding.");
    } else if(endCandidates.length===0) console.warn("No east candidates for end point pathfinding.");
    if(!endTile){console.warn("Distance fallback for end point.");let maxDistSq=-1;const candidatesToSearch=endCandidates.length>0?endCandidates:allFloorTiles;if(candidatesToSearch.length===0)console.error("No floor tiles for end point fallback!");else{for(const cand of candidatesToSearch){if(distance(startTile.x,startTile.y,cand.x,cand.y)<Math.min(level.width,level.height)*0.5)continue;const dSq=distance(startTile.x,startTile.y,cand.x,cand.y);if(dSq>maxDistSq){maxDistSq=dSq;endTile=cand;}}}}
    if(!endTile){console.warn("Forcing end location.");endTile={x:level.width-2,y:Math.max(1,Math.floor(level.height/2))};if(level.grid[endTile.y]?.[endTile.x]!==TILE.FLOOR&&level.grid[endTile.y]?.[endTile.x]!==undefined&&level.grid[endTile.y])level.grid[endTile.y][endTile.x]=TILE.FLOOR;}
    level.endX = endTile.x*TILE_SIZE+TILE_SIZE/2; level.endY = endTile.y*TILE_SIZE+TILE_SIZE/2; console.log(`Placed Start: (${startTile.x},${startTile.y}), End: (${endTile.x},${endTile.y})`); return true;
}

function addEntrancesUrban(level) {
    const NUM_EXITS_LOCAL = (typeof NUM_EXITS !== 'undefined') ? NUM_EXITS : 2;
    const MIN_ENTRANCE_EXIT_DISTANCE_FACTOR_LOCAL = (typeof MIN_ENTRANCE_EXIT_DISTANCE_FACTOR !== 'undefined') ? MIN_ENTRANCE_EXIT_DISTANCE_FACTOR : 0.3;
    if(!level.startX||!level.endX){console.error("Start/end missing for entrances.");level.entrances=[];return;} level.entrances=[];
    const minEntranceExitDistSq=(level.width*MIN_ENTRANCE_EXIT_DISTANCE_FACTOR_LOCAL*TILE_SIZE)**2;
    const candidatesByEdge = { top:[],bottom:[],left:[],right:[] };
    for(let x=1;x<level.width-1;x++){if(level.grid[1]?.[x]===TILE.FLOOR)candidatesByEdge.top.push({x,y:0,edge:'top'}); if(level.grid[level.height-2]?.[x]===TILE.FLOOR)candidatesByEdge.bottom.push({x,y:level.height-1,edge:'bottom'});}
    for(let y=1;y<level.height-1;y++){if(level.grid[y]?.[1]===TILE.FLOOR)candidatesByEdge.left.push({x:0,y,edge:'left'}); if(level.grid[y]?.[level.width-2]===TILE.FLOOR)candidatesByEdge.right.push({x:level.width-1,y,edge:'right'});}
    for (const edge in candidatesByEdge) candidatesByEdge[edge].sort(()=>Math.random()-0.5);
    let entrancesCreated=0; const targetEntrances=NUM_EXITS_LOCAL*2; const minEntranceSeparation=Math.max(3,Math.floor(Math.min(level.width,level.height)/(targetEntrances*1.5||1)));
    const placedCoords=[];
    const placeCandidate = (cand) => {
        const candCenterX=cand.x*TILE_SIZE+TILE_SIZE/2; const candCenterY=cand.y*TILE_SIZE+TILE_SIZE/2;
        if(((candCenterX-level.endX)**2+(candCenterY-level.endY)**2) < minEntranceExitDistSq) return false;
        for(const ex of placedCoords) if(distance(cand.x,cand.y,ex.x,ex.y) < minEntranceSeparation) return false;
        if(level.grid[cand.y]?.[cand.x]!==undefined && level.grid[cand.y]){level.grid[cand.y][cand.x]=TILE.ENTRANCE;level.entrances.push({x:cand.x,y:cand.y});placedCoords.push({x:cand.x,y:cand.y});return true;} return false;
    };
    const edges=['top','bottom','left','right'].sort(()=>Math.random()-0.5); const targetPerEdge=Math.max(1,Math.floor(targetEntrances/edges.length));
    for(const edge of edges){let placedOnEdge=0; while(placedOnEdge<targetPerEdge && entrancesCreated<targetEntrances && candidatesByEdge[edge].length>0){if(placeCandidate(candidatesByEdge[edge].shift())){entrancesCreated++;placedOnEdge++;}}}
    let allRemaining=[].concat(...Object.values(candidatesByEdge)).sort(()=>Math.random()-0.5);
    while(entrancesCreated<targetEntrances && allRemaining.length>0) if(placeCandidate(allRemaining.shift())) entrancesCreated++;
    console.log(`Entrances placed: ${level.entrances.length}/${targetEntrances} target.`); if(level.entrances.length===0&&targetEntrances>0)console.warn("Failed to place any entrances!");
}

function buildPathfinderGridUrban(level) {
    if(typeof PF==='undefined'||!PF.Grid){console.error("PF missing!");level.pathfinderGrid=null;return;}
    level.pathfinderGrid=new PF.Grid(level.width,level.height);
    for(let y=0;y<level.height;y++) for(let x=0;x<level.width;x++){const t=level.grid[y]?.[x];level.pathfinderGrid.setWalkableAt(x,y,(t===TILE.FLOOR||t===TILE.ENTRANCE||t===TILE.EXPLOSIVE_CRATE));}
    console.log("Pathfinder grid built.");
}

function scatterRubbleUrban(levelData, densityFactor = 1.0) {
    const RUBBLE_CHANCE_LOCAL = (typeof RUBBLE_CHANCE !== 'undefined') ? RUBBLE_CHANCE : 0.0075; 
    const RUBBLE_CLUSTER_CHANCE_LOCAL = (typeof RUBBLE_CLUSTER_CHANCE !== 'undefined') ? RUBBLE_CLUSTER_CHANCE : 0.05; 
    const MAX_CLUSTER_SIZE_LOCAL = (typeof MAX_CLUSTER_SIZE !== 'undefined') ? MAX_CLUSTER_SIZE : 2; 
    const START_AREA_RADIUS_EFFECTIVE = (typeof START_AREA_RADIUS !== 'undefined') ? START_AREA_RADIUS : 3;
    const MIN_DIST_TO_START_END_SQ_LOCAL = (START_AREA_RADIUS_EFFECTIVE + 2)**2;

    for (let y = 1; y < levelData.height - 1; y++) {
        for (let x = 1; x < levelData.width - 1; x++) {
            if (levelData.grid[y][x] !== TILE.FLOOR || !(Math.random() < RUBBLE_CHANCE_LOCAL * densityFactor)) continue;

            const startDistSq = (x - Math.floor(levelData.startX / TILE_SIZE))**2 + (y - Math.floor(levelData.startY / TILE_SIZE))**2;
            const endDistSq = (levelData.endX > 0 && levelData.endY > 0) ? (x - Math.floor(levelData.endX / TILE_SIZE))**2 + (y - Math.floor(levelData.endY / TILE_SIZE))**2 : Infinity;
            if (startDistSq <= MIN_DIST_TO_START_END_SQ_LOCAL || endDistSq <= MIN_DIST_TO_START_END_SQ_LOCAL) continue;

            levelData.grid[y][x] = TILE.OBSTACLE;
            let currentClusterSize = 1;

            if (Math.random() < RUBBLE_CLUSTER_CHANCE_LOCAL) {
                const clusterQueue = [{x, y}];
                const visitedForCluster = new Set([`${x},${y}`]);

                while(clusterQueue.length > 0 && currentClusterSize < MAX_CLUSTER_SIZE_LOCAL) {
                    const currentRubble = clusterQueue.shift();
                    const deltas = [{dx:0,dy:1},{dx:0,dy:-1},{dx:1,dy:0},{dx:-1,dy:0}];
                    deltas.sort(() => Math.random() - 0.5);

                    for (const delta of deltas) {
                        if (currentClusterSize >= MAX_CLUSTER_SIZE_LOCAL) break;
                        const nx = currentRubble.x + delta.dx; const ny = currentRubble.y + delta.dy;
                        const nKey = `${nx},${ny}`;

                        if (nx>0 && nx<levelData.width-1 && ny>0 && ny<levelData.height-1 && levelData.grid[ny][nx]===TILE.FLOOR && !visitedForCluster.has(nKey)) {
                            const nStartDistSq = (nx - Math.floor(levelData.startX/TILE_SIZE))**2 + (ny - Math.floor(levelData.startY/TILE_SIZE))**2;
                            const nEndDistSq = (levelData.endX>0&&levelData.endY>0)?(nx - Math.floor(levelData.endX/TILE_SIZE))**2 + (ny - Math.floor(levelData.endY/TILE_SIZE))**2 : Infinity;
                            if (nStartDistSq > MIN_DIST_TO_START_END_SQ_LOCAL && nEndDistSq > MIN_DIST_TO_START_END_SQ_LOCAL) {
                                levelData.grid[ny][nx] = TILE.OBSTACLE; currentClusterSize++;
                                visitedForCluster.add(nKey); clusterQueue.push({x: nx, y: ny});
                            }
                        }
                    }
                }
            }
        }
    }
}

function generateOpenFieldRegion(levelData, bounds) {
    const { x1, y1, x2, y2 } = bounds;
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) {
        if (x>=0&&x<levelData.width&&y>=0&&y<levelData.height) {
            levelData.grid[y][x] = TILE.FLOOR;
            if(typeof DISTRICT_TYPE_URBAN!=='undefined'&& DISTRICT_TYPE_URBAN.OPEN_FIELD) levelData.districtGrid[y][x]=DISTRICT_TYPE_URBAN.OPEN_FIELD;
        }
    }
    const regionWidth = x2 - x1 + 1; const regionHeight = y2 - y1 + 1;
    const area = regionWidth * regionHeight;
    const MIN_COVER_SEPARATION_LOCAL = 3; 
    let numCoverItems = 0;
    if (area > 30) numCoverItems = Math.min(1, Math.max(0, Math.floor(area / 200))); // Even more sparse, max 1-2

    let placedCover = [];
    for (let i = 0; i < numCoverItems; i++) {
        for (let attempt = 0; attempt < 15; attempt++) { 
            const cx = getRandomInt(x1 + 1, x2 - 1); const cy = getRandomInt(y1 + 1, y2 - 1);
            if (cx<=x1||cx>=x2||cy<=y1||cy>=y2) continue; 
            if (cx<0||cx>=levelData.width||cy<0||cy>=levelData.height||levelData.grid[cy][cx]!==TILE.FLOOR) continue;
            let tooClose=false; for(const pc of placedCover) if(distance(cx,cy,pc.x,pc.y)<MIN_COVER_SEPARATION_LOCAL){tooClose=true;break;}
            if (!tooClose) { levelData.grid[cy][cx]=TILE.OBSTACLE; placedCover.push({x:cx,y:cy}); break; }
        }
    }
}

function spawnExplosiveCrates(levelData) {
    const totalTiles = levelData.width * levelData.height;
    const generousDefaultCrates = Math.max(5, Math.floor(totalTiles / 150)); 
    const MAX_EXPLOSIVE_CRATES_LOCAL = (typeof MAX_EXPLOSIVE_CRATES !== 'undefined' && MAX_EXPLOSIVE_CRATES > 0) ? MAX_EXPLOSIVE_CRATES : generousDefaultCrates;

    const START_AREA_RADIUS_EFFECTIVE = (typeof START_AREA_RADIUS !== 'undefined') ? START_AREA_RADIUS : 3;
    if (MAX_EXPLOSIVE_CRATES_LOCAL<=0||typeof ExplosiveCrate==='undefined'){if(MAX_EXPLOSIVE_CRATES_LOCAL>0 && typeof ExplosiveCrate==='undefined')console.warn("ExplosiveCrate class undefined.");return;}
    if(!window.explosiveCrates)window.explosiveCrates=[]; else window.explosiveCrates=[];

    const candidateObstacles = [];
    for (let y=0;y<levelData.height;y++) for (let x=0;x<levelData.width;x++) {
        if (levelData.grid[y]?.[x] === TILE.OBSTACLE) { 
            const startDistSq=(x-Math.floor(levelData.startX/TILE_SIZE))**2+(y-Math.floor(levelData.startY/TILE_SIZE))**2;
            const endDistSq=(levelData.endX>0&&levelData.endY>0)?(x-Math.floor(levelData.endX/TILE_SIZE))**2+(y-Math.floor(levelData.endY/TILE_SIZE))**2:Infinity;
            if (startDistSq>(START_AREA_RADIUS_EFFECTIVE+2)**2 && endDistSq>(START_AREA_RADIUS_EFFECTIVE+2)**2) {
                let score=0; let adjacentObstacles=0; let adjacentFloors=0;
                const deltas=[{dx:0,dy:1},{dx:0,dy:-1},{dx:1,dy:0},{dx:-1,dy:0},{dx:1,dy:1},{dx:1,dy:-1},{dx:-1,dy:1},{dx:-1,dy:-1}];
                for(const d of deltas){const nx=x+d.dx;const ny=y+d.dy; if(nx>=0&&nx<levelData.width&&ny>=0&&ny<levelData.height){
                    if(levelData.grid[ny][nx]===TILE.OBSTACLE||levelData.grid[ny][nx]===TILE.EXPLOSIVE_CRATE)adjacentObstacles++;
                    if(levelData.grid[ny][nx]===TILE.FLOOR)adjacentFloors++;
                }}
                score += adjacentObstacles * 2; 
                if (adjacentFloors === 1 && adjacentObstacles < 2) score += 5; 
                else if (adjacentFloors > 2) score += adjacentFloors; 

                candidateObstacles.push({ x, y, score });
            }
        }
    }
    candidateObstacles.sort((a,b)=>b.score-a.score);
    let cratesSpawned=0;
    for(const tile of candidateObstacles){if(cratesSpawned>=MAX_EXPLOSIVE_CRATES_LOCAL)break; if(levelData.grid[tile.y]?.[tile.x]===TILE.OBSTACLE){
        levelData.grid[tile.y][tile.x]=TILE.EXPLOSIVE_CRATE;
        const crateX=tile.x*TILE_SIZE+TILE_SIZE/2; const crateY=tile.y*TILE_SIZE+TILE_SIZE/2;
        window.explosiveCrates.push(new ExplosiveCrate(crateX,crateY,tile.x,tile.y)); cratesSpawned++;
    }}
    console.log(`Spawned ${cratesSpawned} explosive crates (target: ${MAX_EXPLOSIVE_CRATES_LOCAL}, strategic).`);
}

function generateLevel(levelData, widthTiles, heightTiles) {
    console.log(`Starting HYBRID level generation (${widthTiles}x${heightTiles})...`);
    levelData.width = widthTiles; levelData.height = heightTiles;
    
    // Check for essential constants
    const criticalConstants = [
        "TILE_SIZE", "TILE", "FOG_STATE", "START_AREA_RADIUS", "NUM_EXITS", 
        "MIN_ENTRANCE_EXIT_DISTANCE_FACTOR", "ZONE_TYPE", "DISTRICT_TYPE_URBAN", 
        "MAX_STREET_THICKNESS_URBAN", "CARVING_DENSITY_FACTOR", 
        "LOOP_CREATION_PROBABILITY", "ROADBLOCK_PLACE_ATTEMPTS", 
        "STITCH_CHANCE_OPEN", "GUARANTEED_STITCHES_OPEN"
    ];
    for (const name of criticalConstants) {
        let isDefined = false;
        if (typeof window !== 'undefined' && typeof window[name] !== 'undefined') isDefined = true;
        else if (typeof self !== 'undefined' && typeof self[name] !== 'undefined') isDefined = true;
        else { 
            try { if (eval(`typeof ${name}`) !== 'undefined') isDefined = true; } 
            catch (e) { /* ignore */ }
        }
        if (!isDefined) {
             console.error(`CRITICAL: Essential global constant ${name} is missing! Aborting level generation.`);
             return; // Abort if critical constant is missing
        }
    }
    if(typeof TILE.EXPLOSIVE_CRATE==='undefined')console.warn("TILE.EXPLOSIVE_CRATE undefined. Crates may not function fully.");

    const MAX_STREET_THICKNESS_URBAN_LOCAL = MAX_STREET_THICKNESS_URBAN;
    levelData.grid = Array.from({length:heightTiles},()=>Array(widthTiles).fill(TILE.WALL));
    levelData.districtGrid = Array.from({length:heightTiles},()=>Array(widthTiles).fill(DISTRICT_TYPE_URBAN.NONE));
    levelData.fogGrid = Array.from({length:heightTiles},()=>Array(widthTiles).fill(FOG_STATE.HIDDEN));
    levelData.blocks = [];

    const numRegionCols=5;const numRegionRows=5;const regionW=Math.floor(widthTiles/numRegionCols);const regionH=Math.floor(heightTiles/numRegionRows);const numTotalRegions=numRegionCols*numRegionRows;
    const zoneTypeCounts = Object.fromEntries(Object.values(ZONE_TYPE).map(zt => [zt,0]));
    let regionCellKeys=[];
    for(let r=0;r<numRegionRows;r++)for(let c=0;c<numRegionCols;c++){regionCellKeys.push({r,c});const rnd=Math.random();let determinedZone;
        if(rnd<0.03)determinedZone=ZONE_TYPE.MONOLITH_PLAZA;
        else if(rnd<0.30)determinedZone=ZONE_TYPE.OPEN_FIELD; 
        else if(rnd<0.45)determinedZone=ZONE_TYPE.MAZE_RUINS; 
        else if(rnd<0.60)determinedZone=ZONE_TYPE.DENSE_URBAN; 
        else determinedZone=ZONE_TYPE.URBAN;
        if(zoneTypeCounts.hasOwnProperty(determinedZone))zoneTypeCounts[determinedZone]++;else zoneTypeCounts[ZONE_TYPE.URBAN]++;
    }
    let maxMonoliths=0;if(numTotalRegions>=20)maxMonoliths=2;else if(numTotalRegions>=10)maxMonoliths=1;
    if(zoneTypeCounts[ZONE_TYPE.MONOLITH_PLAZA]>maxMonoliths){const ex=zoneTypeCounts[ZONE_TYPE.MONOLITH_PLAZA]-maxMonoliths;zoneTypeCounts[ZONE_TYPE.MONOLITH_PLAZA]=maxMonoliths;zoneTypeCounts[ZONE_TYPE.URBAN]+=ex;}
    const minRegionsForDiversity=9; 
    if(numTotalRegions>=minRegionsForDiversity){
        const targetOpenFields = Math.max(3, Math.floor(numTotalRegions / 5)); 
        if(zoneTypeCounts[ZONE_TYPE.OPEN_FIELD] < targetOpenFields && zoneTypeCounts[ZONE_TYPE.URBAN]>0){ 
            const neededOpenFields = targetOpenFields - zoneTypeCounts[ZONE_TYPE.OPEN_FIELD];
            const toConvert = Math.min(neededOpenFields, zoneTypeCounts[ZONE_TYPE.URBAN]);
            zoneTypeCounts[ZONE_TYPE.OPEN_FIELD] += toConvert; zoneTypeCounts[ZONE_TYPE.URBAN] -= toConvert;
        }
        if(zoneTypeCounts[ZONE_TYPE.MAZE_RUINS]===0&&zoneTypeCounts[ZONE_TYPE.URBAN]>0&&numTotalRegions > 5){zoneTypeCounts[ZONE_TYPE.MAZE_RUINS]++;zoneTypeCounts[ZONE_TYPE.URBAN]--;}
    }

    regionCellKeys.sort(()=>Math.random()-0.5);const regionZoneMap=new Map();
    const assignCells=(count,zone)=>{for(let i=0;i<count;i++){if(regionCellKeys.length===0)break;const ref=regionCellKeys.pop();regionZoneMap.set(`${ref.r},${ref.c}`,zone);}};
    const zonePriority = [ZONE_TYPE.MONOLITH_PLAZA, ZONE_TYPE.OPEN_FIELD, ZONE_TYPE.MAZE_RUINS, ZONE_TYPE.DENSE_URBAN, ZONE_TYPE.URBAN]; 
    for(const zone of zonePriority) if (zone !== ZONE_TYPE.URBAN) assignCells(zoneTypeCounts[zone], zone);
    assignCells(zoneTypeCounts[ZONE_TYPE.URBAN] + regionCellKeys.length, ZONE_TYPE.URBAN);

    const regionGenOrder=[];for(let r=0;r<numRegionRows;r++)for(let c=0;c<numRegionCols;c++)regionGenOrder.push({r,c});regionGenOrder.sort(()=>Math.random()-0.5);
    for(const reg of regionGenOrder){const rL=reg.r;const cL=reg.c;const x1r=cL*regionW;const y1r=rL*regionH;
        const x2r=(cL===numRegionCols-1)?widthTiles-1:(cL+1)*regionW-1;const y2r=(rL===numRegionRows-1)?heightTiles-1:(rL+1)*regionH-1;
        const bounds={x1:x1r,y1:y1r,x2:x2r,y2:y2r};const zone=regionZoneMap.get(`${rL},${cL}`) || ZONE_TYPE.URBAN;
        if(zone===ZONE_TYPE.URBAN){layOutStreetsUrbanInBounds(levelData,bounds,false);assignDistrictsUrbanInBounds(levelData,bounds,false);}
        else if(zone===ZONE_TYPE.DENSE_URBAN){layOutStreetsUrbanInBounds(levelData,bounds,true);assignDistrictsUrbanInBounds(levelData,bounds,true);}
        else if(zone===ZONE_TYPE.MAZE_RUINS){generateMazeRegion(levelData,bounds);addExtraOpeningsToMazeRegion(levelData,bounds);}
        else if(zone===ZONE_TYPE.OPEN_FIELD){generateOpenFieldRegion(levelData,bounds);} 
        else if(zone===ZONE_TYPE.MONOLITH_PLAZA){generateMonolithPlazaRegion(levelData,bounds);}
    }
    
    const stitchChance = STITCH_CHANCE_OPEN; 
    const guaranteedStitches = GUARANTEED_STITCHES_OPEN; 

    for(let r=0;r<numRegionRows-1;r++){const yC=(r+1)*regionH;let potStitches=[],actStitches=0;for(let s=-Math.floor(MAX_STREET_THICKNESS_URBAN_LOCAL/2);s<=Math.floor(MAX_STREET_THICKNESS_URBAN_LOCAL/2);s++){const yS=yC+s;if(yS<=0||yS>=heightTiles-1)continue;for(let xS=1;xS<widthTiles-1;xS++){if(levelData.grid[yS]?.[xS]===TILE.WALL&&levelData.grid[yS-1]?.[xS]===TILE.FLOOR&&levelData.grid[yS+1]?.[xS]===TILE.FLOOR){potStitches.push({x:xS,y:yS});if(Math.random()<stitchChance&&levelData.grid[yS]){levelData.grid[yS][xS]=TILE.FLOOR;actStitches++;}}}}if(actStitches<guaranteedStitches&&potStitches.length>0){potStitches.sort(()=>Math.random()-0.5);for(let k=0;k<potStitches.length && actStitches < guaranteedStitches;k++){const{x,y}=potStitches[k];if(levelData.grid[y]?.[x]===TILE.WALL){levelData.grid[y][x]=TILE.FLOOR; actStitches++;}}}}
    for(let c=0;c<numRegionCols-1;c++){const xC=(c+1)*regionW;let potStitches=[],actStitches=0;for(let s=-Math.floor(MAX_STREET_THICKNESS_URBAN_LOCAL/2);s<=Math.floor(MAX_STREET_THICKNESS_URBAN_LOCAL/2);s++){const xS=xC+s;if(xS<=0||xS>=widthTiles-1)continue;for(let yS=1;yS<heightTiles-1;yS++){if(levelData.grid[yS]?.[xS]===TILE.WALL&&levelData.grid[yS]?.[xS-1]===TILE.FLOOR&&levelData.grid[yS]?.[xS+1]===TILE.FLOOR){potStitches.push({x:xS,y:yS});if(Math.random()<stitchChance&&levelData.grid[yS]){levelData.grid[yS][xS]=TILE.FLOOR;actStitches++;}}}}if(actStitches<guaranteedStitches&&potStitches.length>0){potStitches.sort(()=>Math.random()-0.5);for(let k=0;k<potStitches.length && actStitches < guaranteedStitches;k++){const{x,y}=potStitches[k];if(levelData.grid[y]?.[x]===TILE.WALL){levelData.grid[y][x]=TILE.FLOOR; actStitches++;}}}}


    createLoopsUrban(levelData);
    carveOpenAreasUrban(levelData); 
    carveBuildingCorners(levelData);
    if(!pickStartEndUrban(levelData)){console.error("Start/End placement failed.");return;}
    scatterRubbleUrban(levelData, 0.25); 
    spawnExplosiveCrates(levelData); 
    placeRoadblocks(levelData); 
    addEntrancesUrban(levelData);buildPathfinderGridUrban(levelData);
    console.log("Finished HYBRID level generation (favoring openness).");window.level=levelData;
    if(typeof window!=='undefined'){window.staticBufferNeedsRedraw=true;window.previouslyRevealedStaticTiles=new Set();}
}

function spawnPowerups(level, playerClassId) {
    window.powerups = []; 
    const floorTiles = [];
    const MIN_POWERUP_SEPARATION_TILES_LOCAL = Math.floor(POWERUP_MIN_SEPARATION_UNITS / TILE_SIZE);
    const MAX_PLACEMENT_ATTEMPTS_PER_POWERUP_LOCAL = (typeof MAX_PLACEMENT_ATTEMPTS_PER_POWERUP !== 'undefined') ? MAX_PLACEMENT_ATTEMPTS_PER_POWERUP : 10;
    const CANDIDATE_SELECTION_ATTEMPTS_LOCAL = (typeof CANDIDATE_SELECTION_ATTEMPTS !== 'undefined') ? CANDIDATE_SELECTION_ATTEMPTS : 3;
    const START_AREA_RADIUS_EFFECTIVE=(typeof START_AREA_RADIUS!=='undefined')?START_AREA_RADIUS:3;

    for(let y=0;y<level.height;y++)for(let x=0;x<level.width;x++){if(level.grid[y]?.[x]===TILE.FLOOR){
        const startDistSq=(x-Math.floor(level.startX/TILE_SIZE))**2+(y-Math.floor(level.startY/TILE_SIZE))**2;
        const endDistSq=(level.endX>0&&level.endY>0)?(x-Math.floor(level.endX/TILE_SIZE))**2+(y-Math.floor(level.endY/TILE_SIZE))**2:Infinity;
        if(startDistSq>(START_AREA_RADIUS_EFFECTIVE+3)**2 && endDistSq>(START_AREA_RADIUS_EFFECTIVE+3)**2)floorTiles.push({x,y});
    }}
    if(floorTiles.length===0){console.warn("No suitable floor tiles for powerups.");return;}
    if(typeof powerupConfig==='undefined'||powerupConfig===null){console.warn("powerupConfig missing.");return;}
    if(typeof Powerup!=='function'){console.error("Powerup class constructor missing.");return;}

    const classSpecificPu=[],genericPu=[];
    for(const type in powerupConfig){const pD=powerupConfig[type];if(pD.classId===playerClassId)classSpecificPu.push(type);else if(pD.classId===null)genericPu.push(type);}
    classSpecificPu.sort(()=>Math.random()-0.5);genericPu.sort(()=>Math.random()-0.5);
    let spawnedCount=0;const maxPups=(typeof MAX_POWERUPS_ON_MAP!=='undefined')?MAX_POWERUPS_ON_MAP:10;const totalAttemptsBudget=maxPups*25;

    for(let i=0;i<totalAttemptsBudget && spawnedCount<maxPups && floorTiles.length>0; i++){
        let puType=null, chosenList=null;const prefClass=Math.random()<0.6;
        if(prefClass&&classSpecificPu.length>0){puType=classSpecificPu[classSpecificPu.length-1];chosenList=classSpecificPu;}
        else if(genericPu.length>0){puType=genericPu[genericPu.length-1];chosenList=genericPu;}
        else if(classSpecificPu.length>0){puType=classSpecificPu[classSpecificPu.length-1];chosenList=classSpecificPu;}

        if(puType&&floorTiles.length>0){
            let finalTile=null, finalTileIndexInFloorTiles=-1; // Renamed to avoid confusion with cand.index
            let potentialCandidates=[];
            for(let attempt=0;attempt<CANDIDATE_SELECTION_ATTEMPTS_LOCAL&&floorTiles.length>0;attempt++){
                const randIdx=getRandomInt(0,floorTiles.length-1);const currentTile=floorTiles[randIdx];let connectivity=0;
                for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(dx===0&&dy===0)continue;if(level.grid[currentTile.y+dy]?.[currentTile.x+dx]===TILE.FLOOR)connectivity++;}
                potentialCandidates.push({tile:currentTile,index:randIdx,connectivity});
            }
            potentialCandidates.sort((a,b)=>b.connectivity-a.connectivity);

            for(const cand of potentialCandidates){let isSeparated=true;
                for(const p of window.powerups){const pxG=Math.floor(p.x/TILE_SIZE);const pyG=Math.floor(p.y/TILE_SIZE);if(distance(cand.tile.x,cand.tile.y,pxG,pyG)<MIN_POWERUP_SEPARATION_TILES_LOCAL){isSeparated=false;break;}}
                if(isSeparated){finalTile=cand.tile;finalTileIndexInFloorTiles=cand.index;break;}
            }

            if(!finalTile){ // Fallback if no good candidate found via connectivity/separation
                for(let attempt=0;attempt<MAX_PLACEMENT_ATTEMPTS_PER_POWERUP_LOCAL&&floorTiles.length>0;attempt++){
                    const randIdx=getRandomInt(0,floorTiles.length-1);const tempTile=floorTiles[randIdx];let isSeparated=true;
                    for(const p of window.powerups){const pxG=Math.floor(p.x/TILE_SIZE);const pyG=Math.floor(p.y/TILE_SIZE);if(distance(tempTile.x,tempTile.y,pxG,pyG)<MIN_POWERUP_SEPARATION_TILES_LOCAL){isSeparated=false;break;}}
                    if(isSeparated){finalTile=tempTile;finalTileIndexInFloorTiles=randIdx;break;}
                    if(attempt===MAX_PLACEMENT_ATTEMPTS_PER_POWERUP_LOCAL-1||floorTiles.length<5){finalTile=tempTile;finalTileIndexInFloorTiles=randIdx;break;}
                }
            }
            
            if(finalTile && finalTileIndexInFloorTiles !== -1 && finalTileIndexInFloorTiles < floorTiles.length){ 
                 // Check if the tile at finalTileIndexInFloorTiles is indeed finalTile to prevent race conditions if floorTiles was modified
                if (floorTiles[finalTileIndexInFloorTiles] && floorTiles[finalTileIndexInFloorTiles].x === finalTile.x && floorTiles[finalTileIndexInFloorTiles].y === finalTile.y) {
                    floorTiles.splice(finalTileIndexInFloorTiles,1); 
                } else { // If not, search for it (slower, but safer)
                    const actualIndex = floorTiles.findIndex(ft => ft.x === finalTile.x && ft.y === finalTile.y);
                    if (actualIndex > -1) floorTiles.splice(actualIndex, 1);
                    else { finalTile = null; /* Tile already taken by another process/powerup */ }
                }

                if (finalTile && chosenList)chosenList.pop(); // Only pop if successfully placed
                if (finalTile) {
                    const pX=finalTile.x*TILE_SIZE+TILE_SIZE/2;const pY=finalTile.y*TILE_SIZE+TILE_SIZE/2;
                    window.powerups.push(new Powerup(pX,pY,puType));spawnedCount++;
                }

            } else if(floorTiles.length===0)break;
        } else if(!puType&&classSpecificPu.length===0&&genericPu.length===0)break;
    }
    console.log(`Spawned ${spawnedCount} powerups (refined).`);
}

function spawnRandomPowerups(count, playerClassIdContext) {
    if (!window.level || !window.level.grid || !window.powerups || typeof Powerup !== 'function' || typeof powerupConfig === 'undefined') {
        console.warn("Cannot spawn random powerups: Missing level, powerups array, Powerup class, or powerupConfig.");
        return;
    }

    const floorTiles = [];
    const MIN_POWERUP_SEPARATION_TILES_LOCAL = Math.floor(POWERUP_MIN_SEPARATION_UNITS / TILE_SIZE);

     for (let y = 0; y < window.level.height; y++) {
        for (let x = 0; x < window.level.width; x++) {
            if (window.level.grid[y]?.[x] === TILE.FLOOR) {
                let tooCloseToExisting = false;
                for (const p of window.powerups) {
                    const pxG = Math.floor(p.x / TILE_SIZE);
                    const pyG = Math.floor(p.y / TILE_SIZE);
                    if (distance(x,y,pxG,pyG) < MIN_POWERUP_SEPARATION_TILES_LOCAL) {
                        tooCloseToExisting = true;
                        break;
                    }
                }
                if (window.player && distance(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, window.player.x, window.player.y) < TILE_SIZE * 5) {
                    tooCloseToExisting = true; // Don't spawn right on player
                }
                if (!tooCloseToExisting) {
                    floorTiles.push({ x, y });
                }
            }
        }
    }
    if (floorTiles.length === 0) { console.warn("No suitable floor tiles for spawning random powerups."); return; }

    let spawned = 0;
    const availablePowerupTypes = Object.values(PowerupType); 
    floorTiles.sort(() => Math.random() - 0.5); // Shuffle available spots

    for (let i = 0; i < count && floorTiles.length > 0 && window.powerups.length < MAX_POWERUPS_ON_MAP; i++) {
        const tile = floorTiles.pop(); // Take a random pre-vetted tile
        if (!tile) continue;

        let typeToSpawn;
        let attempt = 0;
        do {
            typeToSpawn = getRandomElement(availablePowerupTypes);
            attempt++;
        } while (powerupConfig[typeToSpawn] && powerupConfig[typeToSpawn].classId !== null && powerupConfig[typeToSpawn].classId !== playerClassIdContext && attempt < 20)
        
        if (powerupConfig[typeToSpawn] && powerupConfig[typeToSpawn].classId !== null && powerupConfig[typeToSpawn].classId !== playerClassIdContext) {
            const genericTypes = availablePowerupTypes.filter(t => powerupConfig[t] && powerupConfig[t].classId === null);
            if (genericTypes.length > 0) typeToSpawn = getRandomElement(genericTypes);
            else continue; 
        }
        if(!powerupConfig[typeToSpawn] || typeToSpawn === PowerupType.GENERIC_SPAWN_1_POWERUP || typeToSpawn === PowerupType.GENERIC_SPAWN_2_POWERUPS || typeToSpawn === PowerupType.GENERIC_SPAWN_3_POWERUPS || typeToSpawn === PowerupType.GENERIC_SPAWN_5_POWERUPS || typeToSpawn === PowerupType.GENERIC_SPAWN_7_POWERUPS ) {
            // Avoid self-recursive spawn powerups, or pick another if this happens
            const filteredTypes = availablePowerupTypes.filter(t => t !== PowerupType.GENERIC_SPAWN_1_POWERUP && t !== PowerupType.GENERIC_SPAWN_2_POWERUPS && t !== PowerupType.GENERIC_SPAWN_3_POWERUPS && t !== PowerupType.GENERIC_SPAWN_5_POWERUPS && t !== PowerupType.GENERIC_SPAWN_7_POWERUPS && (!powerupConfig[t] || powerupConfig[t].classId === null || powerupConfig[t].classId === playerClassIdContext));
            if (filteredTypes.length > 0) typeToSpawn = getRandomElement(filteredTypes);
            else continue;
        }
        if(!powerupConfig[typeToSpawn]) continue;


        const pX = tile.x * TILE_SIZE + TILE_SIZE / 2;
        const pY = tile.y * TILE_SIZE + TILE_SIZE / 2;
        window.powerups.push(new Powerup(pX, pY, typeToSpawn));
        spawned++;
    }
    console.log(`Spawned ${spawned} additional random powerups.`);
}
// --- END OF FILE level_generator.js ---