// --- START OF FILE turret.js ---
// Assumes globals: Math, console, distance, normalizeVector, getRandomInt, hasLineOfSight, TILE_SIZE, FOG_STATE, BASE_PLAYER_SPEED_WALK, createExplosion, level, performance, window (for player, zombies, mercenaries, turrets, playSound, frameCount, imgTurretBase, imgTurretTop)
// Assumes constants: All constants from constants.js (e.g., TURRET_HP, TURRET_SIZE, TURRET_BASE_DRAW_SCALE, TURRET_TOP_DRAW_SCALE, TURRET_FALLBACK_COLOR, TURRET_HMG_BASE_STATS etc.)
// Assumes classes: Projectile, TurretState, OwnerType (these should be defined due to correct index.html load order)

const TurretState = { INACTIVE: 'inactive', DEPLOYING: 'deploying', ACTIVE: 'active', RETURNING: 'returning', DESTROYED: 'destroyed' };

function setTurretGlobals(playerRef, zombieArr, mercArr, turretArr) {
    // This function is now effectively a no-op
}

class Turret {
    constructor(x, y, owner, id) {
        this.owner = owner; this.id = id; this.x = x; this.y = y;
        this.hp = TURRET_HP;
        this.maxHp = TURRET_HP;
        this.radius = TURRET_SIZE / 2; 
        this.angle = owner.angle; 
        this.baseAngle = owner.angle; 
        this.targetZombie = null; this.fireTimer = 0;
        
        // Create a mutable deep copy of base weapon stats for this turret instance
        this.weapon = JSON.parse(JSON.stringify(TURRET_HMG_BASE_STATS)); 
        this.fireInterval = 60000 / this.weapon.rpm; 

        this.state = TurretState.DEPLOYING;
        this.deployTimer = TURRET_DEPLOY_TIME;
        this.path = [];
        this.pathCooldown = 0.7 + Math.random() * 0.3; 
        this.pathTimer = Math.random() * this.pathCooldown;
        this.targetNodeIndex = 0;
        this.lastPathRequestTime = 0;
        this.failedPathAttempts = 0;
        this.lastPathTargetPos = {x:0, y:0};

        this.speed = BASE_PLAYER_SPEED_WALK * TURRET_SPEED_FACTOR;
        this.returnSpeed = BASE_PLAYER_SPEED_WALK * TURRET_RETURN_SPEED_FACTOR;
        this.active = true;
    }

    takeDamage(amount, sourceType = 'unknown') {
        if (this.state === TurretState.DESTROYED || this.state === TurretState.INACTIVE) return;
        if (this.state === TurretState.RETURNING) amount *= 2;

        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.state = TurretState.DESTROYED;
            console.log(`Turret ${this.id} destroyed!`);
            if (typeof playSound === 'function') playSound('TURRET_DESTROYED', { volume: 0.8 });
            if (typeof createExplosion === 'function' && typeof window.player !== 'undefined' && typeof window.zombies !== 'undefined' && typeof window.mercenaries !== 'undefined' && typeof window.turrets !== 'undefined') {
                 createExplosion( this.x, this.y, TILE_SIZE * 1.5, 10, 2, 20, 200, 0.15, 6, 3, 1, window.player, window.zombies, window.mercenaries, window.turrets, window.explosiveCrates, null, null, null, null );
            } else {
                console.error("Could not create turret destruction explosion - createExplosion or global entity references missing?");
            }
        }
    }

    update(effectiveDt, zombies, isWallFunc, pathfinderGrid, finder, projectiles_ref, player) {
        if (this.state === TurretState.DESTROYED || this.state === TurretState.INACTIVE) {
            this.active = false;
            return;
        }
        this.active = true;
        const now = performance.now();

        // Update individual turret's weapon stats if the base template has changed
        if (this.weapon.rpm !== TURRET_HMG_BASE_STATS.rpm) {
            this.weapon.rpm = TURRET_HMG_BASE_STATS.rpm;
            this.fireInterval = 60000 / this.weapon.rpm;
        }
         if (this.weapon.damageMin !== TURRET_HMG_BASE_STATS.damageMin || this.weapon.damageMax !== TURRET_HMG_BASE_STATS.damageMax) {
            this.weapon.damageMin = TURRET_HMG_BASE_STATS.damageMin;
            this.weapon.damageMax = TURRET_HMG_BASE_STATS.damageMax;
        }


        if (this.state === TurretState.DEPLOYING) {
            this.deployTimer -= effectiveDt * 1000;
            if (this.deployTimer <= 0) { 
                this.state = TurretState.ACTIVE; 
                this.baseAngle = this.angle; 
            } else {
                this.angle = this.owner.angle; 
                this.baseAngle = this.owner.angle; 
            }
            return;
        }

        if (this.state === TurretState.RETURNING) {
            const distToPlayer = distance(this.x, this.y, player.x, player.y);
            if (distToPlayer < this.radius + player.radius + TILE_SIZE * 0.2) { 
                 this.state = TurretState.INACTIVE;
                 this.active = false;
                 // console.log(`Turret ${this.id} returned (HP: ${this.hp.toFixed(0)}).`); // Less verbose
                 return;
            }

            this.pathTimer += effectiveDt;
            let needsNewPath = false;
            if (this.path.length === 0 || this.targetNodeIndex >= this.path.length || this.failedPathAttempts > 0) {
                needsNewPath = true;
            } else {
                const lastNodeInPath = this.path[this.path.length - 1];
                const pathEndGoalDist = distance(lastNodeInPath[0] * TILE_SIZE + TILE_SIZE / 2, lastNodeInPath[1] * TILE_SIZE + TILE_SIZE / 2, player.x, player.y);
                if (pathEndGoalDist > TILE_SIZE * 2) needsNewPath = true;
            }
            if (Math.abs(player.x - this.lastPathTargetPos.x) > TILE_SIZE || Math.abs(player.y - this.lastPathTargetPos.y) > TILE_SIZE) {
                needsNewPath = true;
            }

            const canPathfindThisFrame = (this.id % 5 === (window.frameCount || 0) % 5); 

            if (canPathfindThisFrame && this.pathTimer >= this.pathCooldown && pathfinderGrid && finder && needsNewPath && (now - this.lastPathRequestTime > 300)) {
                this.pathTimer = 0;
                this.lastPathRequestTime = now;
                const startX = Math.floor(this.x / TILE_SIZE); const startY = Math.floor(this.y / TILE_SIZE);
                const endX = Math.floor(player.x / TILE_SIZE); const endY = Math.floor(player.y / TILE_SIZE);
                if (!isWallFunc(startX, startY) && !isWallFunc(endX, endY) && (startX !== endX || startY !==endY)) {
                     try {
                        const gridClone = pathfinderGrid.clone(); 
                        this.path = finder.findPath(startX, startY, endX, endY, gridClone);
                        this.targetNodeIndex = 0;
                        this.lastPathTargetPos.x = player.x;
                        this.lastPathTargetPos.y = player.y;
                        if(this.path.length > 0) this.failedPathAttempts = 0; else this.failedPathAttempts++;
                    }
                     catch (e) { this.path = []; this.failedPathAttempts++; }
                } else { this.path = []; this.failedPathAttempts++; }
            }

            let targetX = player.x; let targetY = player.y;
            if (this.path.length > 0 && this.targetNodeIndex < this.path.length) {
                const targetNode = this.path[this.targetNodeIndex];
                targetX = targetNode[0] * TILE_SIZE + TILE_SIZE / 2;
                targetY = targetNode[1] * TILE_SIZE + TILE_SIZE / 2;
                if (distance(this.x, this.y, targetX, targetY) < TILE_SIZE * 0.7) { 
                    this.targetNodeIndex++;
                    if (this.targetNodeIndex >= this.path.length) { this.path = []; targetX = player.x; targetY = player.y; }
                }
            }
            const dx = targetX - this.x; const dy = targetY - this.y;
            const distToTarget = Math.sqrt(dx * dx + dy * dy);
            if (distToTarget > this.radius * 0.1) { 
                const moveNorm = normalizeVector(dx, dy);
                const currentSpeed = this.returnSpeed;
                let nextX = this.x + moveNorm.x * currentSpeed * effectiveDt;
                let nextY = this.y + moveNorm.y * currentSpeed * effectiveDt;
                
                if (!isWallFunc(Math.floor(nextX / TILE_SIZE), Math.floor(this.y / TILE_SIZE))) { this.x = nextX; }
                if (!isWallFunc(Math.floor(this.x / TILE_SIZE), Math.floor(nextY / TILE_SIZE))) { this.y = nextY; }
            }
            this.angle = Math.atan2(dy, dx); 
            this.baseAngle = this.angle; 
            return;
        }

        if (this.state === TurretState.ACTIVE) {
            this.targetZombie = null;
            let closestDistSq = this.weapon.range * this.weapon.range;
            zombies.forEach(zombie => {
                if (zombie.hp <= 0) return;
                const distSq = distance(this.x, this.y, zombie.x, zombie.y) ** 2;
                if (distSq < closestDistSq) {
                    const targetTileX = Math.floor(zombie.x / TILE_SIZE);
                    const targetTileY = Math.floor(zombie.y / TILE_SIZE);
                    if (typeof level !== 'undefined' && level.fogGrid?.[targetTileY]?.[targetTileX] === FOG_STATE.REVEALED && hasLineOfSight(this.x, this.y, zombie.x, zombie.y, isWallFunc)) {
                        closestDistSq = distSq;
                        this.targetZombie = zombie;
                    }
                }
            });

            this.fireTimer -= effectiveDt * 1000;
            if (this.targetZombie && this.fireTimer <= 0) {
                this.angle = Math.atan2(this.targetZombie.y - this.y, this.targetZombie.x - this.x); 
                const shotAngle = this.angle + (Math.random() - 0.5) * this.weapon.spread;
                const barrelOffset = this.radius * 0.8;  
                const barrelStartX = this.x + Math.cos(this.angle) * barrelOffset;
                const barrelStartY = this.y + Math.sin(this.angle) * barrelOffset;
                const damage = getRandomInt(this.weapon.damageMin, this.weapon.damageMax);
                projectiles_ref.push(new Projectile( barrelStartX, barrelStartY, shotAngle, damage, this.weapon.projectileSpeed, this.weapon.penetration, this.weapon.ricochets, this.weapon.projectileLength, this.weapon.projectileWidth, false, false, this.weapon.id, this, OwnerType.TURRET ));
                if (typeof playSound === 'function') playSound('TURRET_HMG_SHOOT', { volume: 0.5 });
                this.fireTimer = this.fireInterval;
            }
        }
    }
    draw(ctx, offsetX, offsetY) {
        if (this.state === TurretState.INACTIVE && !this.active) return;

        const ownerGridX = this.owner ? Math.floor(this.owner.x / TILE_SIZE) : -1;
        const ownerGridY = this.owner ? Math.floor(this.owner.y / TILE_SIZE) : -1;
        const selfGridX = Math.floor(this.x / TILE_SIZE); const selfGridY = Math.floor(this.y / TILE_SIZE);
        const ownerVisible = this.owner && typeof level !== 'undefined' && level.fogGrid?.[ownerGridY]?.[ownerGridX] === FOG_STATE.REVEALED;
        const selfVisible = typeof level !== 'undefined' && level.fogGrid?.[selfGridY]?.[selfGridX] === FOG_STATE.REVEALED;

        if (!selfVisible && !ownerVisible && this.state !== TurretState.RETURNING && this.state !== TurretState.DESTROYED ) {
            if (this.state !== TurretState.ACTIVE && this.state !== TurretState.DEPLOYING) return;
        }


        ctx.save();
        ctx.translate(this.x - offsetX, this.y - offsetY);
        let alpha = 1.0;

        if (this.state === TurretState.DEPLOYING) { alpha = 1.0 - (this.deployTimer / TURRET_DEPLOY_TIME); ctx.globalAlpha = alpha * 0.5 + 0.5; }
        else if (this.state === TurretState.RETURNING) { alpha = 0.6; ctx.globalAlpha = alpha; }
        else if (this.state === TurretState.DESTROYED) {
             ctx.fillStyle = '#444'; ctx.strokeStyle = '#222'; ctx.lineWidth = 2;
             const numFragments = 5;
             for(let i=0; i< numFragments; ++i) {
                 const fragAngle = Math.PI * 2 * (i/numFragments) + Math.PI/4;
                 const fragDist = this.radius * (0.4 + Math.random()*0.3); 
                 const fragSize = this.radius * (0.2 + Math.random()*0.2); 
                 ctx.save();
                 ctx.rotate(fragAngle);
                 ctx.translate(fragDist, 0);
                 ctx.fillRect(-fragSize/2, -fragSize/2, fragSize, fragSize);
                 ctx.strokeRect(-fragSize/2, -fragSize/2, fragSize, fragSize);
                 ctx.restore();
             }
             ctx.restore();
             return;
        }
        
        const drawRadiusBase = this.radius * TURRET_BASE_DRAW_SCALE;
        const drawRadiusTop = this.radius * TURRET_TOP_DRAW_SCALE;

        if (window.imgTurretBase && window.imgTurretBase.complete && window.imgTurretBase.naturalHeight !== 0) {
            ctx.save();
            ctx.rotate(this.baseAngle);
            ctx.drawImage(window.imgTurretBase, -drawRadiusBase, -drawRadiusBase, drawRadiusBase * 2, drawRadiusBase * 2);
            ctx.restore();
        } else { 
            ctx.fillStyle = (typeof TURRET_FALLBACK_COLOR !== 'undefined' ? TURRET_FALLBACK_COLOR : 'darkgrey');
            ctx.strokeStyle = (typeof TURRET_FALLBACK_STROKE_COLOR !== 'undefined' ? TURRET_FALLBACK_STROKE_COLOR : 'grey');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2); 
            ctx.fill();
            ctx.stroke();
        }

        if (this.state === TurretState.ACTIVE || (this.state === TurretState.DEPLOYING && alpha > 0.8) || this.state === TurretState.RETURNING ) {
            if (window.imgTurretTop && window.imgTurretTop.complete && window.imgTurretTop.naturalHeight !== 0) {
                ctx.save();
                ctx.rotate(this.angle);
                ctx.drawImage(window.imgTurretTop, -drawRadiusTop, -drawRadiusTop, drawRadiusTop * 2, drawRadiusTop * 2);
                ctx.restore();
            } else { 
                 ctx.save();
                 ctx.rotate(this.angle);
                 ctx.fillStyle = (typeof TURRET_FALLBACK_BARREL_COLOR !== 'undefined' ? TURRET_FALLBACK_BARREL_COLOR : '#555');
                 const barrelLength = this.radius * 1.1; 
                 const barrelWidth = this.radius * 0.4;  
                 ctx.fillRect(this.radius * 0.3, -barrelWidth / 2, barrelLength, barrelWidth);
                 ctx.restore();
            }
        }
        
        ctx.restore(); 

        if ((this.state === TurretState.ACTIVE || this.state === TurretState.DEPLOYING) && this.hp < this.maxHp && this.hp > 0) {
            const barWidth = this.radius * 1.5; const barHeight = 4; 
            const barX = this.x - offsetX - barWidth / 2;
            const barY = this.y - offsetY - (this.radius * Math.max(TURRET_BASE_DRAW_SCALE, TURRET_TOP_DRAW_SCALE)) - barHeight - 6; 
            const hpRatio = this.maxHp > 0 ? this.hp / this.maxHp : 0;
            ctx.fillStyle = '#555'; ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = hpRatio > 0.5 ? 'lime' : (hpRatio > 0.2 ? 'yellow' : 'red');
            ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
            ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
    }
}
// --- END OF FILE turret.js ---