// --- START OF FILE projectile_base.js ---

// Assumes globals: Math, console, distance, normalizeVector, dotProduct, TILE_SIZE, FOG_STATE, window (for level, player, zombies, mercenaries, turrets, explosiveCrates)
// Assumes constants: All constants from constants.js are global (PROJECTILE_LENGTH_DEFAULT, WEAPON_ID, etc.)
// Assumes classes: OwnerType, Drone, ZOMBIE_TYPE, Mercenary, Turret, TurretState, Zombie, Player, ExplosiveCrate (these should be defined due to correct index.html load order)

class Projectile {
    constructor(x, y, angle, damage, speed, penetration, ricochets, length = PROJECTILE_LENGTH_DEFAULT, width = PROJECTILE_WIDTH_DEFAULT, ignoreWalls = false, isShotgunPellet = false, weaponId = -1, owner = null, ownerType = OwnerType.PLAYER) {
        this.x = x; this.y = y; this.radius = width / 2; this.damage = damage; this.speed = speed; this.vx = Math.cos(angle) * this.speed; this.vy = Math.sin(angle) * this.speed; this.angle = angle; this.length = length; this.width = width;
        this.lifespan = PROJECTILE_LIFESPAN_DEFAULT;
        this.active = true; this.penetrationLeft = penetration; this.maxRicochets = ricochets; this.ricochetsLeft = ricochets; this.hitTargets = new Set(); this.justBounced = false; this.ignoreWalls = ignoreWalls; this.isShotgunPellet = isShotgunPellet; this.weaponId = weaponId; this.hitWallThisFrame = false; this.wallHitX = 0; this.wallHitY = 0; this.wallHitAngle = 0;
        this.owner = owner;
        this.ownerType = ownerType;
        this.ownerImmunityTimer = PROJECTILE_OWNER_IMMUNITY_DURATION;

        this.isAcid = (ownerType === OwnerType.ENEMY && owner && typeof ZOMBIE_TYPE !== 'undefined' && owner.type === ZOMBIE_TYPE.SPITTER);
        this.color = this.isAcid && typeof SPITTER_PROJECTILE_COLOR !== 'undefined' ? SPITTER_PROJECTILE_COLOR : 'yellow';

        if (penetration === Infinity && typeof WEAPON_ID !== 'undefined' && weaponId === WEAPON_ID.RAILGUN) this.color = 'cyan';
    }

    update(effectiveDt, isWallFunc) {
        if (!this.active) return;
        if (this.ownerImmunityTimer > 0) { this.ownerImmunityTimer -= effectiveDt; }

        this.justBounced = false; this.hitWallThisFrame = false;
        const prevX = this.x; const prevY = this.y;
        let nextX = this.x + this.vx * effectiveDt;
        let nextY = this.y + this.vy * effectiveDt;
        this.lifespan -= effectiveDt;
        if (this.lifespan <= 0) { this.active = false; return; }

        if (!this.ignoreWalls) {
            const currentGridX = Math.floor(nextX / TILE_SIZE); const currentGridY = Math.floor(nextY / TILE_SIZE);
            if (isWallFunc(currentGridX, currentGridY)) { // isWallFunc now checks for explosive crates too
                const prevGridX = Math.floor(prevX / TILE_SIZE); const prevGridY = Math.floor(prevY / TILE_SIZE);
                let wallNormalX = 0; let wallNormalY = 0; let hitVertical = false; let hitHorizontal = false;
                if (prevGridX !== currentGridX && !isWallFunc(prevGridX, currentGridY)) { wallNormalX = (nextX > prevX) ? -1 : 1; hitVertical = true; }
                if (prevGridY !== currentGridY && !isWallFunc(currentGridX, prevGridY)) { wallNormalY = (nextY > prevY) ? -1 : 1; hitHorizontal = true; }
                if (!hitVertical && !hitHorizontal) { if (Math.abs(this.vx) > Math.abs(this.vy)) wallNormalX = (this.vx > 0) ? -1 : 1; else wallNormalY = (this.vy > 0) ? -1 : 1; }
                const norm = normalizeVector(wallNormalX, wallNormalY); wallNormalX = norm.x; wallNormalY = norm.y;
                this.hitWallThisFrame = true; this.wallHitX = prevX; this.wallHitY = prevY; this.wallHitAngle = this.angle;
                const normVel = normalizeVector(this.vx, this.vy); const dotIncidence = dotProduct(normVel.x, normVel.y, wallNormalX, wallNormalY); const ricochetChance = (1.0 - Math.abs(dotIncidence)) * 0.9 + 0.05;
                let didRicochet = false;
                if (this.ricochetsLeft > 0 && Math.random() < ricochetChance) {
                    this.ricochetsLeft--; this.penetrationLeft = 0; this.justBounced = true;
                    const reflectFactor = 2 * dotProduct(this.vx, this.vy, wallNormalX, wallNormalY);
                    this.vx -= reflectFactor * wallNormalX; this.vy -= reflectFactor * wallNormalY;
                    this.x = prevX + this.vx * effectiveDt * 0.1; this.y = prevY + this.vy * effectiveDt * 0.1;
                    this.angle = Math.atan2(this.vy, this.vx);
                    nextX = this.x + this.vx * effectiveDt; nextY = this.y + this.vy * effectiveDt;
                    didRicochet = true;
                }
                if (!didRicochet) { this.active = false; this.x = prevX; this.y = prevY; return; }
            }
        }

        if(this.active) { this.x = nextX; this.y = nextY; } else { return; }

        if (!this.justBounced) {
            let hitSolid = false;
            const friendlyOwnerTypes = [OwnerType.PLAYER, OwnerType.TURRET, OwnerType.MERCENARY, OwnerType.DRONE];
            const isFriendlyProjectile = friendlyOwnerTypes.includes(this.ownerType);

            const checkCollision = (target) => {
                if (!target || this.hitTargets.has(target)) return false;
                let isActive = false;
                let targetRadius = PLAYER_SIZE / 2; 

                const PlayerClass = typeof Player !== 'undefined' ? Player : null;
                const TurretClass = typeof Turret !== 'undefined' ? Turret : null;
                const MercenaryClass = typeof Mercenary !== 'undefined' ? Mercenary : null;
                const DroneClass = typeof Drone !== 'undefined' ? Drone : null;
                const ZombieClass = typeof Zombie !== 'undefined' ? Zombie : null;
                const TurretStateEnum = typeof TurretState !== 'undefined' ? TurretState : null;
                const ExplosiveCrateClass = typeof ExplosiveCrate !== 'undefined' ? ExplosiveCrate : null;


                if (PlayerClass && target instanceof PlayerClass) { isActive = target.active; targetRadius = target.radius;}
                else if (TurretClass && TurretStateEnum && target instanceof TurretClass) { isActive = target.state === TurretStateEnum.ACTIVE || target.state === TurretStateEnum.DEPLOYING; targetRadius = target.radius;}
                else if (MercenaryClass && target instanceof MercenaryClass) { isActive = target.active; targetRadius = target.radius; }
                else if (DroneClass && target instanceof DroneClass) { isActive = target.active; targetRadius = PLAYER_SIZE * DRONE_SIZE_MULTIPLIER / 2; }
                else if (ZombieClass && target instanceof ZombieClass) { isActive = target.hp > 0; targetRadius = target.radius;}
                else if (ExplosiveCrateClass && target instanceof ExplosiveCrateClass) { isActive = target.active; targetRadius = target.radius; }
                else { return false; } 

                if (!isActive || (target.hp !== undefined && target.hp <= 0)) return false;
                if (target === this.owner && this.ownerImmunityTimer > 0) return false;

                if (distance(this.x, this.y, target.x, target.y) < this.radius + targetRadius) {
                    let damageDealt = false;
                    if (typeof target.takeDamage === 'function') {
                        target.takeDamage(this.damage, 'bullet');
                        damageDealt = true;
                    } else if ((DroneClass && target instanceof DroneClass) || (ExplosiveCrateClass && target instanceof ExplosiveCrateClass)) { 
                        if (target.hp !== undefined) {
                            target.hp -= this.damage;
                            if(target.hp <= 0) { target.hp = 0; if(target.active !== undefined) target.active = false; }
                            damageDealt = true;
                        }
                    }

                    if(damageDealt) {
                        this.hitTargets.add(target);
                        if (this.isShotgunPellet && typeof AUTOSHOTGUN_STUN_DURATION !== 'undefined' && AUTOSHOTGUN_STUN_DURATION > 0 && typeof target.stunTimer !== 'undefined') {
                            target.stunTimer = Math.max(target.stunTimer || 0, AUTOSHOTGUN_STUN_DURATION);
                        }
                        return true;
                    }
                }
                return false;
            };

            const targetsToTest = [];
            if (isFriendlyProjectile) {
                if (window.zombies) targetsToTest.push(...window.zombies);
                if (window.explosiveCrates) targetsToTest.push(...window.explosiveCrates); // Friendly projectiles can hit crates
            } else { // Enemy projectile
                if (window.player) targetsToTest.push(window.player);
                if (window.mercenaries) targetsToTest.push(...window.mercenaries);
                if (window.turrets) targetsToTest.push(...window.turrets);
                if (window.player && window.player.drones) targetsToTest.push(...window.player.drones);
                if (window.explosiveCrates) targetsToTest.push(...window.explosiveCrates); // Enemy projectiles can hit crates
            }
            
            for (const entity of targetsToTest) {
                if (checkCollision(entity)) {
                    hitSolid = true;
                    const ZombieClass = typeof Zombie !== 'undefined' ? Zombie : null;
                    const isTyrant = ZombieClass && entity instanceof ZombieClass && typeof ZOMBIE_TYPE !== 'undefined' && typeof entity.type !== 'undefined' && entity.type === ZOMBIE_TYPE.TYRANT;
                    if (isTyrant) this.penetrationLeft = 0;
                    
                    // Projectiles usually stop on first crate hit unless they have high penetration
                    const ExplosiveCrateClass = typeof ExplosiveCrate !== 'undefined' ? ExplosiveCrate : null;
                    if (ExplosiveCrateClass && entity instanceof ExplosiveCrateClass && this.penetrationLeft !== Infinity) {
                         this.penetrationLeft = 0; // Or reduce by 1 if you want crates to be penetrable
                    }

                    if(this.penetrationLeft <= 0 && this.penetrationLeft !== Infinity) break;
                }
            }


            if (hitSolid) {
                if (this.penetrationLeft > 0 && this.penetrationLeft !== Infinity) {
                    this.penetrationLeft--;
                }
                if (this.penetrationLeft <= 0 && this.penetrationLeft !== Infinity) {
                    this.active = false;
                    return;
                }
            }
        }
    }

    draw(ctx, offsetX, offsetY) {
        if (!this.active) return;
        const gridX = Math.floor(this.x / TILE_SIZE);
        const gridY = Math.floor(this.y / TILE_SIZE);
        if (!this.ignoreWalls && typeof window.level !== 'undefined' && window.level.fogGrid?.[gridY]?.[gridX] !== FOG_STATE.REVEALED && window.level.fogGrid?.[gridY]?.[gridX] !== FOG_STATE.WALL_VISIBLE) return;


        ctx.save();
        ctx.translate(this.x - offsetX, this.y - offsetY);
        ctx.rotate(this.angle);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(-this.length / 2, 0);
        ctx.lineTo(this.length / 2, 0);
        ctx.stroke();
        if (this.isAcid) {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(-this.length / 2, -this.width / 3, this.length, this.width * 0.66);
            ctx.globalAlpha = 1.0;
        }
        ctx.restore();
    }
}
// --- END OF FILE projectile_base.js ---