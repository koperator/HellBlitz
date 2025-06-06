// --- START OF FILE player_combat.js ---

if (typeof Player === 'undefined') { console.error("Player class not defined before player_combat.js"); }

Player.prototype.startReload = function() {
    if (!this.reloading && this.ammo < this.currentWeapon.magSize && this.currentWeapon.id !== WEAPON_ID.PSI_BLADES && this.currentWeapon.magSize !== Infinity) {
        this.reloading = true;
        this.reloadTimer = 0;
        this.fireTimer = 0; 
        if (typeof playSound === 'function') playSound('RELOAD_START');
    }
};

Player.prototype.shootPsiBlade = function(psiBladeEffects_ref, zombies_ref) {
    if (typeof playSound === 'function') playSound('PSI_BLADE_SWING');

    const currentPsiBladeRange = PSI_BLADE_RANGE_BASE * this.psiBladeSizeMultiplier;
    const currentPsiBladeDamage = PSI_BLADE_DAMAGE; 

    if (typeof TemporarySpriteEffect !== 'undefined' && window.imgPsiBladeSprite && typeof window.temporarySpriteEffects !== 'undefined') {
        const effectX = this.x + Math.cos(this.angle) * (currentPsiBladeRange * 0.3); // Use current range for visual offset
        const effectY = this.y + Math.sin(this.angle) * (currentPsiBladeRange * 0.3);
        window.temporarySpriteEffects.push(new TemporarySpriteEffect(
            effectX, effectY,
            window.imgPsiBladeSprite,
            100, 
            0.7 * this.psiBladeSizeMultiplier, 1.3 * this.psiBladeSizeMultiplier, 
            this.angle,
            // Use currentPsiBladeRange for the sprite's base dimensions before its own scaling
            { width: currentPsiBladeRange * 1.5, height: currentPsiBladeRange * 0.6 }, 
            this.psiBladeMirrorState, 1.0
        ));
        this.psiBladeMirrorState *= -1;
    }


    zombies_ref.forEach(zombie => {
        if (zombie.hp <= 0) return;
        const distSq = (this.x - zombie.x)**2 + (this.y - zombie.y)**2;
        if (distSq <= (currentPsiBladeRange + zombie.radius) ** 2) { 
            const angleToZombie = Math.atan2(zombie.y - this.y, zombie.x - this.x);
            const angleDiffToCenter = angleDiff(this.angle, angleToZombie);
            if (Math.abs(angleDiffToCenter) <= PSI_BLADE_ARC_ANGLE / 2) { 
                zombie.takeDamage(currentPsiBladeDamage, 'psi_blade');
            }
        }
    });
};

Player.prototype.shootProjectile = function(projectiles_ref, flameParticlesRef, isWallFuncRef) {
    const weapon = this.currentWeapon; 
    const barrelOffset = GUN_BARREL_OFFSET;
    const barrelStartX = this.x + Math.cos(this.angle) * barrelOffset;
    const barrelStartY = this.y + Math.sin(this.angle) * barrelOffset;

    if (typeof playSound === 'function') {
        switch (weapon.id) {
            case WEAPON_ID.MACHINEGUN:
                playSound('MACHINEGUN_SHOOT');
                break;
            case WEAPON_ID.AUTOSHOTGUN:
                playSound('SHOTGUN_SHOOT');
                break;
            case WEAPON_ID.ENGINEER_SMG:
                playSound('SMG_SHOOT');
                break;
            case WEAPON_ID.FLAMETHROWER:
                if (!this.flamethrowerLoopSound || this.flamethrowerLoopSound.paused) {
                    if (this.flamethrowerLoopSound && typeof this.flamethrowerLoopSound.stop === 'function') {
                        this.flamethrowerLoopSound.stop();
                    }
                    this.flamethrowerLoopSound = playSound('FLAMETHROWER_LOOP', { loop: true });
                    playSound('FLAMETHROWER_START');
                }
                break;
        }
    }


    if (weapon.id === WEAPON_ID.FLAMETHROWER) {
        if (typeof FlameParticle === 'undefined') { console.warn("FlameParticle class not defined for flamethrower"); return;}
        const particlesToSpawn = weapon.particleCountPerShot || 10; 
        for (let i = 0; i < particlesToSpawn; i++) {
            const shotAngle = this.angle + (Math.random() - 0.5) * this.spread;
            flameParticlesRef.push(new FlameParticle( barrelStartX, barrelStartY, shotAngle, weapon.particleSpeed, weapon.particleLifespan, weapon ));
        }
    } else {
        if (typeof Projectile === 'undefined' || typeof getRandomInt === 'undefined') { console.warn("Projectile or getRandomInt not defined"); return; }
        const pellets = weapon.pellets || 1;
        for (let i = 0; i < pellets; i++) {
            const shotAngle = this.angle + (Math.random() - 0.5) * this.spread;
            const damage = getRandomInt(weapon.damageMin, weapon.damageMax);
            let projSpeed = weapon.projectileSpeed;
            let projLength = PROJECTILE_LENGTH_DEFAULT;
            let projWidth = PROJECTILE_WIDTH_DEFAULT;
            const isShotgun = weapon.id === WEAPON_ID.AUTOSHOTGUN;
            let projLifespan = PROJECTILE_LIFESPAN_DEFAULT;

            if (isShotgun) {
                projSpeed *= (1 + (Math.random() - 0.5) * SHOTGUN_PELLET_SPEED_VARIATION);
                projLifespan = SHOTGUN_PELLET_LIFESPAN;
            }
            if (weapon.id === WEAPON_ID.MACHINEGUN) { projLength = MG_PROJECTILE_LENGTH; }

            const newProjectile = new Projectile(barrelStartX, barrelStartY, shotAngle, damage, projSpeed, weapon.penetration, weapon.ricochets, projLength, projWidth, false, isShotgun, weapon.id, this, OwnerType.PLAYER);
            newProjectile.lifespan = projLifespan;
            projectiles_ref.push(newProjectile); 
        }
    }
};

Player.prototype.shootRaycast = function(zombies_ref, isWallFunc) {
    if (typeof playSound === 'function') playSound('RAILGUN_SHOOT');

    const weapon = this.currentWeapon; 
    const angle = this.angle + (Math.random() - 0.5) * this.spread;
    const damage = getRandomInt(weapon.damageMin, weapon.damageMax);
    const rayDx = Math.cos(angle); const rayDy = Math.sin(angle);
    const maxRange = (typeof canvas !== 'undefined' ? Math.max(canvas.width, canvas.height) : 1000) * 2;
    let hitPoint = { x: this.x + rayDx * maxRange, y: this.y + rayDy * maxRange };
    let rayDist = maxRange;
    let hitWall = false;

    const step = TILE_SIZE / 4;
    for (let d = TILE_SIZE*0.5; d < maxRange; d += step) {
        const checkX = this.x + rayDx * d; const checkY = this.y + rayDy * d;
        const gridX = Math.floor(checkX / TILE_SIZE); const gridY = Math.floor(checkY / TILE_SIZE);
        if (isWallFunc(gridX, gridY)) { 
            hitPoint = { x: checkX, y: checkY };
            rayDist = d;
            hitWall = true;
            break;
        }
    }

    if (hitWall && typeof RailgunWallParticle !== 'undefined' && typeof window.wallSparkParticles !== 'undefined') {
        for (let j = 0; j < RAILGUN_WALL_PARTICLE_COUNT; j++) {
            const sparkAngle = Math.atan2(rayDy, rayDx) + Math.PI + (Math.random() - 0.5) * Math.PI * 0.9;
            const sparkSpeed = getRandomInt(RAILGUN_WALL_PARTICLE_SPEED_MIN, RAILGUN_WALL_PARTICLE_SPEED_MAX);
            window.wallSparkParticles.push(new RailgunWallParticle(hitPoint.x, hitPoint.y, sparkAngle, sparkSpeed));
        }
    }

    zombies_ref.forEach(zombie => { if (zombie.hp <= 0) return; const vecToZombieX = zombie.x - this.x; const vecToZombieY = zombie.y - this.y; const projLen = dotProduct(vecToZombieX, vecToZombieY, rayDx, rayDy); if(projLen < 0 || projLen > rayDist) return; const closestPointX = this.x + rayDx * projLen; const closestPointY = this.y + rayDy * projLen; const distToRaySq = distance(zombie.x, zombie.y, closestPointX, closestPointY) ** 2; if (distToRaySq < (zombie.radius + RAILGUN_WIDTH/2)**2) { zombie.takeDamage(damage, 'railgun'); } });
    
    if (window.explosiveCrates && typeof ExplosiveCrate !== 'undefined') {
        window.explosiveCrates.forEach(crate => {
            if (!crate.active) return;
            const vecToCrateX = crate.x - this.x;
            const vecToCrateY = crate.y - this.y;
            const projLen = dotProduct(vecToCrateX, vecToCrateY, rayDx, rayDy);
            if (projLen < 0 || projLen > rayDist) return; 

            const closestPointX = this.x + rayDx * projLen;
            const closestPointY = this.y + rayDy * projLen;
            const distToRaySq = distance(crate.x, crate.y, closestPointX, closestPointY) ** 2;

            if (distToRaySq < (crate.radius + RAILGUN_WIDTH / 2) ** 2) {
                if (typeof crate.takeDamage === 'function') {
                    crate.takeDamage(damage, 'railgun');
                }
            }
        });
    }


    const beamLength = distance(this.x, this.y, hitPoint.x, hitPoint.y);
    
    if (typeof RailgunParticle !== 'undefined' && typeof window.railgunParticles !== 'undefined') {
        const numTrailParticles = Math.max(5, Math.floor(beamLength / (TILE_SIZE * 0.5)));
        for (let i = 0; i < numTrailParticles; i++) {
            const fraction = i / Math.max(1, numTrailParticles - 1);
            const particleX = this.x + rayDx * beamLength * fraction;
            const particleY = this.y + rayDy * beamLength * fraction;
            window.railgunParticles.push(new RailgunParticle(particleX, particleY));
        }
    } else {
        console.warn("RailgunParticle class or window.railgunParticles not defined for shootRaycast trail.");
    }

    if (typeof window.railgunEffects !== 'undefined') {
        const effectParticlePositions = [];
        const numEffectIndicatorParticles = Math.max(5, Math.floor(beamLength / (TILE_SIZE * 0.5))); 
        for (let i = 0; i < numEffectIndicatorParticles; i++) {
            const fraction = i / Math.max(1, numEffectIndicatorParticles - 1);
            effectParticlePositions.push({
                x: this.x + rayDx * beamLength * fraction,
                y: this.y + rayDy * beamLength * fraction
            });
        }
        window.railgunEffects.push({
            startX: this.x,
            startY: this.y,
            endX: hitPoint.x,
            endY: hitPoint.y,
            timer: RAILGUN_EFFECT_DURATION,
            particlesSpawned: true, 
            particlePositions: effectParticlePositions 
        });
    } else {
        console.warn("window.railgunEffects not defined for shootRaycast main beam.");
    }
};

Player.prototype.switchWeapon = function(index) {
    if(typeof window.weapons !== 'undefined' && index >= 0 && index < window.weapons.length && index !== this.currentWeaponIndex) {
        if (this.currentWeapon.id === WEAPON_ID.FLAMETHROWER && this.flamethrowerLoopSound && !this.flamethrowerLoopSound.paused) {
            this.flamethrowerLoopSound.pause();
            this.flamethrowerLoopSound.currentTime = 0;
            if (typeof playSound === 'function') playSound('FLAMETHROWER_END');
        }

        this.currentWeaponIndex = index;
        this.currentWeapon = JSON.parse(JSON.stringify(window.weapons[this.currentWeaponIndex]));
        this.reloading = false;
        this.reloadTimer = 0;
        this.fireTimer = 0;
        this.ammo = this.currentWeapon.magSize;
        this.spread = this.currentWeapon.spreadStand;
    }
};
// --- END OF FILE player_combat.js ---