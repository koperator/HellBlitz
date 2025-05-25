// --- START OF FILE explosive_crate.js ---

// Assumes globals: Math, console, TILE_SIZE, FOG_STATE, window (for level, player, zombies, mercenaries, turrets, explosiveCrates, playSound, imgExplosiveCrate), createExplosion (from projectile_effects.js)
// Assumes constants: All constants from constants.js (e.g., EXPLOSIVE_CRATE_HP, EXPLOSIVE_CRATE_RADIUS, EXPLOSIVE_CRATE_EXPLOSION_*, COLOR_EXPLOSIVE_CRATE)

class ExplosiveCrate {
    constructor(worldX, worldY, gridX, gridY) {
        this.x = worldX; // Center X in world coordinates
        this.y = worldY; // Center Y in world coordinates
        this.gridX = gridX; // Grid X for reference
        this.gridY = gridY; // Grid Y for reference
        this.hp = EXPLOSIVE_CRATE_HP; // Set to 1 in constants.js for one-hit explosion
        this.maxHp = EXPLOSIVE_CRATE_HP;
        this.radius = EXPLOSIVE_CRATE_RADIUS;
        this.active = true;
        this.color = COLOR_EXPLOSIVE_CRATE; // Fallback color
        this.image = window.imgExplosiveCrate; // Sprite image
    }

    takeDamage(amount, sourceType = 'unknown') {
        if (!this.active) return;
        
        // Any positive damage amount will trigger explosion due to HP being 1
        if (amount > 0) {
            this.hp -= amount; 
            if (this.hp <= 0) {
                this.hp = 0; // Ensure HP doesn't go negative
                this.explode(); // This will set active to false
            }
        }
    }

    explode() {
        if (!this.active) return; 
        this.active = false;

        // Remove from level grid (turn into floor)
        if (window.level && window.level.grid && window.level.grid[this.gridY]) {
            window.level.grid[this.gridY][this.gridX] = TILE.FLOOR;
            if (window.level.pathfinderGrid && typeof window.level.pathfinderGrid.setWalkableAt === 'function') {
                window.level.pathfinderGrid.setWalkableAt(this.gridX, this.gridY, true);
            }
             if (typeof window !== 'undefined') {
                 window.staticBufferNeedsRedraw = true;
                 if (window.previouslyRevealedStaticTiles) {
                    window.previouslyRevealedStaticTiles.delete(`${this.gridX},${this.gridY}`);
                 }
            }
        }

        if (typeof createExplosion === 'function') {
            createExplosion(
                this.x, this.y,
                EXPLOSIVE_CRATE_EXPLOSION_RADIUS,
                EXPLOSIVE_CRATE_EXPLOSION_DAMAGE_MAX,
                EXPLOSIVE_CRATE_EXPLOSION_DAMAGE_MIN,
                EXPLOSIVE_CRATE_EXPLOSION_PARTICLE_COUNT,
                EXPLOSIVE_CRATE_EXPLOSION_PARTICLE_SPEED,
                EXPLOSIVE_CRATE_EXPLOSION_PARTICLE_LIFESPAN,
                EXPLOSIVE_CRATE_PARTICLE_LENGTH,
                EXPLOSIVE_CRATE_PARTICLE_WIDTH,
                0, 
                window.player, window.zombies, window.mercenaries, window.turrets, window.explosiveCrates.filter(c => c !== this), // Pass other crates
                null, null, null, 'RPG_EXPLODE', 0.7 
            );
        } else {
            console.error("createExplosion function not found for ExplosiveCrate.");
        }

        // The main game loop in game_logic.js will filter this out from window.explosiveCrates because this.active is false
    }

    update(effectiveDt) {
        // Static for now
    }

    draw(ctx, offsetX, offsetY) {
        if (!this.active) return;

        const fGridX = Math.floor(this.x / TILE_SIZE);
        const fGridY = Math.floor(this.y / TILE_SIZE);
        if (typeof window.level !== 'undefined' && window.level.fogGrid &&
            window.level.fogGrid[fGridY]?.[fGridX] !== FOG_STATE.REVEALED &&
            window.level.fogGrid[fGridY]?.[fGridX] !== FOG_STATE.WALL_VISIBLE) {
            return;
        }

        ctx.save();
        ctx.translate(this.x - offsetX, this.y - offsetY);

        if (this.image && this.image.complete && this.image.naturalHeight !== 0) {
            ctx.drawImage(this.image, -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        }

        // No HP bar needed if it explodes on 1 hit. Can be re-added if HP > 1.
        ctx.restore();
    }
}
// --- END OF FILE explosive_crate.js ---