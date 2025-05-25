// --- START OF FILE constants.js ---

// --- constants.js ---

// --- Constants ---
const TILE_SIZE = 32;
const PLAYER_SIZE = TILE_SIZE * 0.6;
const ZOMBIE_SIZE = TILE_SIZE * 0.5; 
const MERC_SIZE = TILE_SIZE * 0.6 * 1.5; 
const GUN_BARREL_OFFSET = PLAYER_SIZE * 0.6;

// --- Time Scaling ---
const NORMAL_TIME_SCALE = 1.0;
const BULLET_TIME_SCALE = 0.3;
// Recon's Bullet Time
const RECON_BULLET_TIME_DURATION = 2000 + 350;
var RECON_BULLET_TIME_COOLDOWN = Math.round(10000 * 0.90); 

// --- Entity Owner Types (for Projectile Immunity) ---
const OwnerType = { PLAYER: 'player', TURRET: 'turret', DRONE: 'drone', MERCENARY: 'mercenary', ENEMY: 'enemy' };

// --- Weapon Definitions ---
const WEAPON_ID = {
    RAILGUN: 0, MACHINEGUN: 1, FLAMETHROWER: 2, AUTOSHOTGUN: 3,
    PSI_BLADES: 99, ENGINEER_SMG: 4, TURRET_HMG: 100
};

// --- General Projectile Settings ---
const PROJECTILE_LIFESPAN_DEFAULT = 1.0; 
const PROJECTILE_LENGTH_DEFAULT = 15;
const PROJECTILE_WIDTH_DEFAULT = 3;
const MG_PROJECTILE_LENGTH = PROJECTILE_LENGTH_DEFAULT * 1.2;
const PARTICLE_BOUNCE_DAMPING = 0.5;
const SHOTGUN_PELLET_SPEED_VARIATION = 0.45;
const PROJECTILE_OWNER_IMMUNITY_DURATION = 0.05; 
const SHOTGUN_PELLET_LIFESPAN = 0.44;
var AUTOSHOTGUN_STUN_DURATION = Math.round(122 * 1.15); 

// --- Flamethrower Specific Constants ---
var FLAME_PARTICLE_DAMAGE = 0.89 * 1.60; 
var FLAMETHROWER_PARTICLE_LIFESPAN_BASE = 679 * 1.17; 

// --- Machinegun Wall Hit Particle Constants ---
const MG_WALL_SPARK_COUNT = 4;
const MG_WALL_SPARK_SPEED_MIN = 200;
const MG_WALL_SPARK_SPEED_MAX = 500;
const MG_WALL_SPARK_LIFESPAN = 150; 
const MG_WALL_SPARK_RADIUS = 2.5;
const MG_WALL_SPARK_BOUNCES = 1;
const MG_WALL_SPARK_DAMPING = 0.3;

// --- Shotgun Wall Hit Particle Constants ---
const SHOTGUN_WALL_SPARK_COUNT = 3;
const SHOTGUN_WALL_SPARK_SPEED_MIN = 150;
const SHOTGUN_WALL_SPARK_SPEED_MAX = 400;
const SHOTGUN_WALL_SPARK_LIFESPAN = 120; 
const SHOTGUN_WALL_SPARK_RADIUS = 2.0;
const SHOTGUN_WALL_SPARK_BOUNCES = 0;
const SHOTGUN_WALL_SPARK_DAMPING = 0.5;

// --- Psion Constants ---
const PSION_SHIELD_HP = 77; 
var PSION_SHIELD_REGEN_RATE = (7 * 3) * 0.75 * 0.9; 
const PSION_SHIELD_REGEN_DELAY = 2000 / 4;
const PSION_SHIELD_REGEN_DELAY_ZERO = 50;
var PSI_BLADE_RANGE_BASE = 69 * 1.10; 
var PSI_BLADE_DAMAGE = 44;    
const PSI_BLADE_ARC_ANGLE = (Math.PI / 2) * 0.6 * 0.7;
const PSI_BLADE_MIN_ATTACK_INTERVAL = 100;
const PSI_BLADE_EFFECT_DURATION = 100;
const PSI_BLADE_MAX_SIZE_MULTIPLIER = 2.90; // Cap at 290%
var PSION_XRAY_RANGE = Math.round(144 * 2.2); 

// Psi Blast Constants
const PSI_BLAST_COOLDOWN = 369;
const PSI_BLAST_CAST_DELAY = 160;
const PSI_BLAST_MIN_SHIELD_COST = 6;
var PSI_BLAST_MAX_PARTICLES = Math.round(90 * 1.25); 
var PSI_BLAST_MIN_PARTICLES = 14; 
const PSI_BLAST_PARTICLE_SPEED = 369 * 2.6;
const PSI_BLAST_MAX_STUN_DURATION = 400; 
var PSI_BLAST_MAX_LIFESPAN = 0.45 * 1.22; 
const PSI_BLAST_MAX_BASE_RADIUS = 8; 
var PSI_BLAST_BASE_DAMAGE_MULTIPLIER = 1.0; 
const PSI_BLAST_PARTICLE_COLOR_START = [255, 150, 255];
const PSI_BLAST_PARTICLE_COLOR_END = [100, 0, 150];
const PSI_BLAST_PARTICLE_DAMPING = 1.5;

// --- Brawler Constants ---
const BRAWLER_DASH_CHARGES = 2; 
const BRAWLER_DASH_RECHARGE_TIME = Math.round(1500 * 1.17);
const BRAWLER_DASH_DURATION = Math.round(88 * 1.30 * 1.22);
const BRAWLER_DASH_SPEED_FACTOR_MOD = 1.30;
var BRAWLER_PASSIVE_REGEN_AMOUNT = 5; 
var BRAWLER_PASSIVE_REGEN_INTERVAL = 1000; 


// --- Marine Constants ---
const MARINE_PASSIVE_REGEN_AMOUNT = 1;
const MARINE_PASSIVE_REGEN_INTERVAL = 2000;

// --- Engineer & Turret Constants ---
const ENGINEER_MAX_TURRETS = 2;
const ENGINEER_DRONE_COUNT = 5;
const ENGINEER_MERC_COUNT = 0;
const TURRET_DEPLOY_TIME = 600;
var TURRET_HP = 300; 
const TURRET_SIZE = TILE_SIZE * 0.7 * 1.6; 
const TURRET_BASE_DRAW_SCALE = 1.0; 
const TURRET_TOP_DRAW_SCALE = 1.0;  
const TURRET_FALLBACK_COLOR = 'darkgrey'; 
const TURRET_FALLBACK_STROKE_COLOR = 'grey';
const TURRET_FALLBACK_BARREL_COLOR = '#555';
const TURRET_SPEED_FACTOR = 0.80;
const TURRET_RETURN_SPEED_FACTOR = 1.5;
const TURRET_MIN_PLACEMENT_DISTANCE = TILE_SIZE * 1.5 * 1.5; 


// --- Turret HMG Stats ---
const TURRET_HMG_BASE_STATS = { 
    id: WEAPON_ID.TURRET_HMG, 
    rpm: Math.round(420), 
    damageMin: Math.round(12 * 1.25), 
    damageMax: Math.round(22 * 1.25),
    projectileSpeed: 1420, penetration: 2, ricochets: 0, projectileLength: MG_PROJECTILE_LENGTH * 1.2,
    projectileWidth: PROJECTILE_WIDTH_DEFAULT * 1.6, range: 700, spread: 4 * (Math.PI / 180),
    magSize: Infinity, reloadTime: 0, auto: true, isRaycast: false
};

// --- Weapon Array ---
const weapons = [
    { id: WEAPON_ID.RAILGUN, name: "Railgun", rpm: Math.round(122 * 1.07 * 3), damageMin: Math.round(96 * 1.22 * 1.22), damageMax: Math.round(189 * 1.22 * 1.22), magSize: 10, reloadTime: Math.round(1440 * 0.69), spreadStand: 0.1*(Math.PI/180), spreadWalk: 0.5*(Math.PI/180), spreadRun: 1.5*(Math.PI/180), projectileSpeed: Infinity, penetration: Infinity, ricochets: 0, pellets: 1, auto: false, isRaycast: true },
    { id: WEAPON_ID.MACHINEGUN, name: "Machinegun", rpm: 600, damageMin: Math.round((8 + 1) * 1.11 * 1.10), damageMax: Math.round((15 + 1) * 1.15 * 1.10), magSize: 120, reloadTime: Math.round(1250 * 0.85), spreadStand: 2.5*(Math.PI/180), spreadWalk: 6*(Math.PI/180), spreadRun: 14*(Math.PI/180), projectileSpeed: 1350, penetration: 1, ricochets: 1, pellets: 1, auto: true, isRaycast: false },
    { id: WEAPON_ID.FLAMETHROWER, name: "Flamethrower", rpm: Math.round(1000 * 0.76), magSize: 100, reloadTime: 1800 * 0.69, spreadStand: 7.2 * (Math.PI / 180), spreadWalk: 10.8 * (Math.PI / 180), spreadRun: 14.4 * (Math.PI / 180), particleSpeed: 910, particleLifespan: FLAMETHROWER_PARTICLE_LIFESPAN_BASE, particleDamping: 3.08, particleBaseRadius: TILE_SIZE * 0.081, particleSizeGrowFactor: 4.83, particleCountPerShot: Math.round(10 * 1.16 * 1.10), wallHitParticleCount: 3, wallHitAOELifespan: 190, pellets: 1, auto: true, isRaycast: false, damageMin: 0, damageMax: 0, penetration: 0, ricochets: 0 },
    { id: WEAPON_ID.AUTOSHOTGUN, name: "Autoshotgun", rpm: Math.round(220), damageMin: Math.round(4 * 0.90 * 1.10 * 1.20), damageMax: Math.round(7 * 0.90 * 1.10 * 1.20), magSize: 20, reloadTime: Math.round(1400 * 0.80), spreadStand: (11*(Math.PI/180)*1.2 * 0.85) * 0.70, spreadWalk: (15*(Math.PI/180)*1.2 * 0.85) * 0.70, spreadRun: (23*(Math.PI/180)*1.2 * 0.85) * 0.70, projectileSpeed: 1190, penetration: 0, ricochets: 0, pellets: 11, auto: true, isRaycast: false },
    { id: WEAPON_ID.PSI_BLADES, name: "Psi Blades", rpm: Infinity, damageMin: PSI_BLADE_DAMAGE, damageMax: PSI_BLADE_DAMAGE, magSize: Infinity, reloadTime: 0, spreadStand: 0, spreadWalk: 0, spreadRun: 0, projectileSpeed: 0, penetration: Infinity, ricochets: 0, pellets: 0, auto: false, isRaycast: false },
    { id: WEAPON_ID.ENGINEER_SMG, name: "SMG", rpm: 1130, damageMin: Math.round(6 * 1.25), damageMax: Math.round(9 * 1.25), magSize: 50, reloadTime: 1100, spreadStand: 3*(Math.PI/180), spreadWalk: 7*(Math.PI/180), spreadRun: 15*(Math.PI/180), projectileSpeed: 1200, penetration: 1, ricochets: 1, pellets: 1, auto: true, isRaycast: false }
];


// --- Mercenary Weapon Definition ---
const MERC_WEAPON = { name: "Merc SMG", rpm: 300, damageMin: 8, damageMax: 11, magSize: 20, reloadTime: 1700, spread: 9 * (Math.PI / 180), projectileSpeed: 930, penetration: 0, ricochets: 0, range: 510 };

// Player Base Settings
const BASE_PLAYER_SPEED_WALK = 169; const BASE_PLAYER_SPEED_RUN = 250; const PLAYER_DASH_SPEED_FACTOR = 4.17;
const PLAYER_DASH_AFTERIMAGE_INTERVAL = 39;

// Grenade Settings
const GRENADE_COOLDOWN = 240;
const GRENADE_SPEED = 410;
const GRENADE_FUSE_TIME = 2500;
const GRENADE_PARTICLE_COUNT = 87; const GRENADE_PARTICLE_SPEED = 790;
const GRENADE_PARTICLE_LIFESPAN = 0.22 * 0.96;
const GRENADE_PARTICLE_DAMAGE = 11; const GRENADE_PARTICLE_LENGTH = 8;
const GRENADE_PARTICLE_WIDTH = 4;
const GRENADE_BOUNCE_CHANCE = 0.99; const GRENADE_BOUNCE_DAMPING = 0.5; const GRENADE_COUNT_START = 17;
const GRENADE_EXPLOSION_RADIUS_FACTOR = 0.89;
const GRENADE_SLOWDOWN_TIME_POINT_MARINE = 0.6 * 1000;
const GRENADE_STOP_TIME_POINT_MARINE = (0.6 + 0.33) * 1000;

// --- Class Definitions ---
const CLASS_ID = { RECON: 0, MARINE: 1, DEVASTATOR: 2, BRAWLER: 3, PSION: 4, ENGINEER: 5 };
const classes = [
    {
        id: CLASS_ID.RECON, name: "Recon", hp: 30, speedMultiplier: 1.25, weaponId: WEAPON_ID.RAILGUN,
        ability: { type: 'bullet_time', uses: Infinity, cooldown: RECON_BULLET_TIME_COOLDOWN, duration: RECON_BULLET_TIME_DURATION },
        passive: { type: 'fog_wall_vision' },
        description: `Fast scout. Railgun. Bullet Time. Sees walls in fog. No Drones.`,
        color: 'cyan'
    },
    {
        id: CLASS_ID.MARINE, name: "Marine", hp: 45, speedMultiplier: 1.00, weaponId: WEAPON_ID.MACHINEGUN,
        ability: { type: 'grenade', uses: GRENADE_COUNT_START, cooldown: GRENADE_COOLDOWN },
        passive: { type: 'hp_regen' },
        description: `Soldier (45HP, regen). Machinegun (+10% DMG). Timed Frag Grenades. 6 Mercenaries.`,
        color: 'green'
    },
    {
        id: CLASS_ID.DEVASTATOR, name: "Devastator", hp: 60, speedMultiplier: 0.95, weaponId: WEAPON_ID.FLAMETHROWER,
        ability: { type: 'rpg', uses: 40, cooldown: Math.round(950 * 0.70)}, 
        passive: { type: '99% explosion_resistance'}, 
        description: `Area denial. Flamethrower (+60% DMG, +10% Particles, +20% Range, Fast Reload). RPG (40 rounds, +50% Center Dmg, Smaller Blast). No Mercs.`,
        color: 'orange'
    },
    {
        id: CLASS_ID.BRAWLER, name: "Brawler", hp: Math.round(99), speedMultiplier: 0.85, weaponId: WEAPON_ID.AUTOSHOTGUN,
        ability: { type: 'dash', uses: BRAWLER_DASH_CHARGES, maxUses: BRAWLER_DASH_CHARGES, rechargeTime: BRAWLER_DASH_RECHARGE_TIME, duration: BRAWLER_DASH_DURATION },
        passive: { type: 'hp_regen_brawler'},
        description: `Durable CQC (Regen +5HP/s). Autoshotgun (+20% DMG, Stun +15%). Speed Dash. 3 Mercs.`,
        color: 'red'
    },
    {
        id: CLASS_ID.PSION, name: "Psion", hp: 20, speedMultiplier: 1.15, weaponId: WEAPON_ID.PSI_BLADES,
        ability: { type: 'psi_blast', cooldown: PSI_BLAST_COOLDOWN },
        passive: { type: 'shield_regen, xray_enhanced' },
        description: `Agile (15HP, Shield). X-Ray Vision. Psi Blades. Psi Blast.`,
        color: '#b742f5'
    },
    {
        id: CLASS_ID.ENGINEER, name: "Engineer", hp: 25, speedMultiplier: 0.90, weaponId: WEAPON_ID.ENGINEER_SMG,
        ability: { type: 'turret', cooldown: TURRET_DEPLOY_TIME + 100 },
        passive: { type: 'drone_support' },
        description: `Tactical (+10% Speed). SMG. Deploys 2 HMG Turrets. 5 Support Drones.`,
        color: '#a8a8a8'}
];

// RPG Settings
const RPG_SPEED = Math.round(707 * 1.25);
const RPG_EXPLOSION_RADIUS = TILE_SIZE * 3.5 * 0.80 * 1.15; 
var RPG_DAMAGE_CENTER = Math.round(297 * 1.20 * 1.50 * 1.35); 
var RPG_DAMAGE_EDGE = Math.round(22 * 1.20 * 1.35); 
const RPG_EXPLOSION_PARTICLE_COUNT = Math.round(190 * 0.75);
const RPG_EXPLOSION_PARTICLE_SPEED = 410;
const RPG_EXPLOSION_PARTICLE_LIFESPAN = 0.2;
const RPG_PARTICLE_LENGTH = 9;
const RPG_PARTICLE_WIDTH = 7;
const RPG_PARTICLE_CONE_ANGLE = Math.PI * 1.8;
const RPG_PARTICLE_SPEED_BIAS_FACTOR = 1.7;
const RPG_SMOKE_INTERVAL = Math.round(30 / 2);
const RPG_SMOKE_LIFESPAN = 777;
const RPG_SMOKE_SIZE = 6;
const RPG_FLASH_PARTICLE_COUNT = Math.round(420 * 0.75);
const RPG_FLASH_PARTICLE_SPEED_MIN = 1200;
const RPG_FLASH_PARTICLE_SPEED_MAX = 1500;
const RPG_FLASH_PARTICLE_LIFESPAN_MIN = 150;
const RPG_FLASH_PARTICLE_LIFESPAN_MAX = 370;
const RPG_STUN_DURATION = 1000;
const RPG_SHOCKWAVE_MAX_RADIUS = RPG_EXPLOSION_RADIUS * 1.2; 
const RPG_SHOCKWAVE_LIFESPAN = 310;
const RPG_BLOCK_DESTRUCTION_RADIUS = 55;

// Drone Settings (Player Owned) - Modifiable by Engineer powerups
var DRONE_PROJECTILE_DAMAGE = 7; 
var DRONE_FIRE_RATE = 3; 

const DRONE_TARGETING_RANGE = 600; const DRONE_PROJECTILE_LENGTH = 12;
const DRONE_PROJECTILE_WIDTH = 3;
const DRONE_PROJECTILE_SPEED = 850; const DRONE_SWITCH_TARGET_COOLDOWN = 250;
const DRONE_VISION_RADIUS = 10;
const DRONE_SIZE_MULTIPLIER = 0.3; 
const DRONE_RADIUS_LOGIC = PLAYER_SIZE * DRONE_SIZE_MULTIPLIER / 2; 
const DRONE_DRAW_SCALE = 3.2; 
const DRONE_FALLBACK_COLOR = 'lightblue'; 
const DRONE_FOLLOW_DISTANCE = TILE_SIZE * 1.5;
const DRONE_SEPARATION_DISTANCE = TILE_SIZE * 1.0;
const DRONE_SPEED = BASE_PLAYER_SPEED_RUN * 1.1 * 3.09;
const DRONE_ACCELERATION_FACTOR = 2.2;
const DRONE_NOISE_AMPLITUDE = TILE_SIZE * 0.4;
const DRONE_NOISE_FREQUENCY_X = 0.2;
const DRONE_NOISE_FREQUENCY_Y = 0.2;
const DRONE_LEAD_FACTOR = 0.5;


// --- Zombie Settings ---
const ZOMBIE_TYPE = {
    REGULAR: 0, TANK: 1, TYRANT: 2, RUNNER: 3, SPITTER: 4, BLOATER: 5, SCREAMER: 6, HIVE_MASTER: 7, DRONE: 8, HEAVY: 9
};
const ZOMBIE_BASE_RADIUS = ZOMBIE_SIZE / 2;
const ZOMBIE_REGULAR_COLOR = '#68a92f';
const ZOMBIE_REGULAR_SPEED_TIERS = [50, 55, 60, 65, 70];
const ZOMBIE_REGULAR_HP_TIERS = [5, 8, 12, 18];
const ZOMBIE_REGULAR_ATTACK_DAMAGE_MIN = 1;
const ZOMBIE_REGULAR_ATTACK_DAMAGE_MAX = 2;
const ZOMBIE_REGULAR_RADIUS_MULT = 1.5;

const HEAVY_ZOMBIE_HP = 89;
const HEAVY_ZOMBIE_COLOR = '#4a7520';
const HEAVY_ZOMBIE_RADIUS_MULT = 1.85;
const HEAVY_ZOMBIE_CHANCE_INITIAL = 0.15;
const HEAVY_ZOMBIE_CHANCE_MID = 0.65;
const HEAVY_ZOMBIE_CHANCE_LATE = 0.95;

const TANK_CHANCE = 0.077 * 1.31; const TANK_SPEED = 45; const TANK_HP = 369; const TANK_DMG = 5; const TANK_COLOR = '#236713'; const TANK_RADIUS_MULT = 3.43;
const TYRANT_SPAWN_CHANCE = 0.00179 * 0.61 * 0.89; const TYRANT_SPEED = Math.round(35 * 1.20 * 1.19); const TYRANT_HP = Math.round(4540); const TYRANT_DMG = 37; const TYRANT_COLOR = '#003b19'; const TYRANT_RADIUS_MULT = 4.96;
const RUNNER_CHANCE = 0.05; const RUNNER_SPEED = 100; const RUNNER_HP = 10; const RUNNER_DMG = 1; const RUNNER_COLOR = '#d9a027'; const RUNNER_RADIUS_MULT = 1.6;
const SPITTER_CHANCE = 0.08 * 0.74 * 0.7; // Reduced spitter chance
const SPITTER_SPEED = 50; const SPITTER_HP = 117; const SPITTER_COLOR = '#7c37a8'; const SPITTER_RADIUS_MULT = 2.8; const SPITTER_ATTACK_RANGE = 450; const SPITTER_ATTACK_COOLDOWN = 1800; const SPITTER_PROJECTILE_SPEED = 500; const SPITTER_PROJECTILE_DAMAGE = 4; const SPITTER_PROJECTILE_COLOR = 'lime'; const SPITTER_PROJECTILE_RADIUS = 9; const SPITTER_PROJECTILE_LIFESPAN = 1.5; const SPITTER_PROJECTILE_STATIONARY_ACCURACY = 0.05; const SPITTER_PROJECTILE_MOVING_ACCURACY = 0.15;
const BLOATER_CHANCE = 0.037 * 0.6; // Reduced bloater chance
const BLOATER_SPEED = 22; const BLOATER_HP = 777; const BLOATER_COLOR = '#a86d32'; const BLOATER_RADIUS_MULT = 4.5; const BLOATER_EXPLOSION_RADIUS = TILE_SIZE * 4.7 * 1.40; const BLOATER_EXPLOSION_DAMAGE_MAX = 40; const BLOATER_EXPLOSION_DAMAGE_MIN = 10; 
const BLOATER_EXPLOSION_PARTICLE_COUNT = Math.round(90 * 1.8 * 0.4); // Further reduced for performance
const BLOATER_EXPLOSION_PARTICLE_SPEED = 300; const BLOATER_EXPLOSION_PARTICLE_LIFESPAN = 0.31; const BLOATER_EXPLOSION_PARTICLE_LENGTH = 9; const BLOATER_EXPLOSION_PARTICLE_WIDTH = 6; const BLOATER_EXPLOSION_PARTICLE_DAMAGE = 1; const BLOATER_EXPLOSION_COLOR_PRIMARY = 'rgba(100, 180, 50, 0.8)'; const BLOATER_EXPLOSION_COLOR_SECONDARY = 'rgba(160, 120, 80, 0.6)';
const SCREAMER_CHANCE = 0.03 * 0.70; const SCREAMER_SPEED = 61; const SCREAMER_HP = 196; const SCREAMER_COLOR = '#cf597e'; const SCREAMER_RADIUS_MULT = 3.0; const SCREAMER_ABILITY_RANGE = TILE_SIZE * 7.5; const SCREAMER_ABILITY_COOLDOWN = 6000; const SCREAMER_ABILITY_DURATION = 3000; const SCREAMER_SLOW_FACTOR = 0.4; const SCREAMER_CAST_TIME = 700;
const HIVE_MASTER_SPAWN_CHANCE = 0.0017; const HIVE_MASTER_HP = 1169; const HIVE_MASTER_SPEED = 27; const HIVE_MASTER_COLOR = '#f5d742'; const HIVE_MASTER_RADIUS_MULT = 3.97; const HIVE_MASTER_INTERNAL_SPAWN_INTERVAL = 400; const HIVE_MASTER_MAX_ACTIVE_DRONES = 41;
const ZOMBIE_DRONE_HP = 3; const ZOMBIE_DRONE_SPEED = 81; const ZOMBIE_DRONE_DMG = 1; const ZOMBIE_DRONE_COLOR = '#f5f5a3'; 
const ZOMBIE_DRONE_RADIUS_MULT = 1.4;
const ZOMBIE_DRONE_DRAW_SCALE = 2.1; 

const ZOMBIE_SPAWN_INTERVAL_START = 1000 / 1.30;
const ZOMBIE_SPAWN_INTERVAL_MIN = 180;
const ZOMBIE_SPAWN_INTERVAL_SCALE_TIME = 240 * 1.3; 
const ZOMBIE_SPAWN_MIDGAME_PEAK_TIME = 100 * 1.3; 
const ZOMBIE_SPAWN_MIDGAME_SLOWDOWN = 1.20; 
const ZOMBIE_SPAWN_BATCH_SIZE_START = 6;
const ZOMBIE_SPAWN_BATCH_SIZE_MAX = 30;
const ZOMBIE_SPAWN_BATCH_SCALE_TIME = 300 * 1.3; 
const ZOMBIE_SPAWN_CAP_INTERVAL = 150;
const ZOMBIE_SPAWN_CAP_BATCH = 40;
const MAX_ZOMBIES = 1400;
const ZOMBIE_ATTACK_COOLDOWN = 650;
const ZOMBIE_TARGET_PRIORITY = { PLAYER: 10, MERCENARY: 6, TURRET: 5, DRONE: 1 };
const ENTRANCE_SPAWN_WEIGHT = 8;
const OFFSCREEN_SPAWN_WEIGHT = 2;
const ZOMBIE_MAX_SPAWN_DISTANCE = 2000;
const ZOMBIE_DESPAWN_DISTANCE = 2250; 
const ZOMBIE_DESPAWN_DISTANCE_SQ = ZOMBIE_DESPAWN_DISTANCE * ZOMBIE_DESPAWN_DISTANCE; 
const ZOMBIE_DESPAWN_CHECK_INTERVAL = 5000; 
const ZOMBIE_RIGHT_EDGE_SPAWN_BIAS = 0.3;

// Mercenary Settings
const MERC_HP = 31;
const MERC_SPEED = 144; 
const MERC_RADIUS_LOGIC = MERC_SIZE / 2; 
const MERC_DRAW_SCALE = 1.07; 
const MERC_FALLBACK_COLOR = '#2d47cf'; 
const MERC_FOLLOW_DISTANCE_MIN = TILE_SIZE * 1.2 * 1.5; 
const MERC_FOLLOW_DISTANCE_MAX = TILE_SIZE * 2.2 * 1.5; 
const MERC_SEPARATION_DISTANCE = TILE_SIZE * 0.8 * 1.5; 
const MERC_PATHFINDING_COOLDOWN = 1.0;
const MERC_VISION_RADIUS = 14;


// --- Map Settings & Generation ---
const MAP_ASPECT_RATIO = 7; 
const START_AREA_RADIUS = 3; 
const LOOP_CREATION_PROBABILITY = 0.10 * 1.5; 
const CARVING_DENSITY_FACTOR = 90; 
const CARVING_MIN_SIZE = 2; 
const CARVING_MAX_SIZE = 4; 
const NUM_EXITS = 8; 
const MIN_ENTRANCE_EXIT_DISTANCE_FACTOR = 0.25;
const RUBBLE_CHANCE = 0.015 * 0.5 * 0.5; 
const RUBBLE_CLUSTER_CHANCE = 0.1 * 0.5; 
const MAX_CLUSTER_SIZE = 2;
const ROADBLOCK_PLACE_ATTEMPTS = Math.floor(12 * 2.5 * 0.15); 
const STITCH_CHANCE_OPEN = 0.99; 
const GUARANTEED_STITCHES_OPEN = 4; 

// --- Urban Generator Specific Constants ---
const MIN_BLOCK_URBAN_NORMAL = 6; const MAX_BLOCK_URBAN_NORMAL = 16;
const MIN_BLOCK_URBAN_DENSE = 4; const MAX_BLOCK_URBAN_DENSE = 10;
const ALLEY_CHANCE_URBAN = 0.65; const MIN_STREET_THICKNESS_URBAN = 2; const MAX_STREET_THICKNESS_URBAN = 3;
const STREET_THICKNESS_DENSE_URBAN = 2; const ALLEY_MIN_WIDTH = 1; const ALLEY_MAX_WIDTH = 1;
const PRIMARY_QUARTER_SHIFT_MAX_URBAN = 2; const SECONDARY_STREET_SEGMENT_SHIFT_MAX = 1;
const RUBBLE_DENSITY_URBAN = 0.007; 
const RUBBLE_DENSITY_SLUM_MULTIPLIER_URBAN = 3.8;
const RUBBLE_DENSITY_TOXIC_MULTIPLIER_URBAN = 4.2; 
const RUBBLE_DENSITY_INDUSTRIAL_MULTIPLIER_URBAN = 3.0;
const RUBBLE_DENSITY_PARK_MULTIPLIER_URBAN = 0.05; 
const RUBBLE_DENSITY_MAZE_MULTIPLIER_URBAN = 0.8;
const URBAN_CARVING_MIN_SIZE = 2; const URBAN_CARVING_MAX_SIZE = 4; 
const ROADBLOCK_THICKNESS = 2; const ROADBLOCK_LENGTH = 4; 
const BUILDING_CORNER_CARVE_CHANCE = 0.20; const BUILDING_CORNER_CARVE_MIN_SIZE = 3; const BUILDING_CORNER_CARVE_MAX_SIZE = 5;
const MONOLITH_MARGIN = 2;

const DISTRICT_TYPE_URBAN = {
    INDUSTRIAL: 'INDUSTRIAL', COMMERCIAL: 'COMMERCIAL', RESIDENTIAL: 'RESIDENTIAL', SLUM: 'SLUM', PARK: 'PARK',
    TOXIC: 'TOXIC', MAZE_RUIN: 'MAZE_RUIN', DENSE_URBAN_CORE: 'DENSE_URBAN_CORE', OPEN_FIELD: 'OPEN_FIELD', MONOLITH_PLAZA: 'MONOLITH_PLAZA', NONE: 'NONE'
};
const DISTRICT_POOL_URBAN = [
  { type: DISTRICT_TYPE_URBAN.INDUSTRIAL,  w: 3 }, { type: DISTRICT_TYPE_URBAN.COMMERCIAL,  w: 4 },
  { type: DISTRICT_TYPE_URBAN.RESIDENTIAL, w: 5 }, { type: DISTRICT_TYPE_URBAN.SLUM,        w: 4 },
  { type: DISTRICT_TYPE_URBAN.PARK,        w: 3 }, { type: DISTRICT_TYPE_URBAN.TOXIC,       w: 2 }
];
const DISTRICT_OVERLAY_TINTS_URBAN = { 
    [DISTRICT_TYPE_URBAN.INDUSTRIAL]:       'rgba(140,140,160,0.075)', 
    [DISTRICT_TYPE_URBAN.COMMERCIAL]:       'rgba(80,120,180,0.075)',
    [DISTRICT_TYPE_URBAN.RESIDENTIAL]:      'rgba(100,160,100,0.075)', 
    [DISTRICT_TYPE_URBAN.SLUM]:             'rgba(90,70,50,0.075)',
    [DISTRICT_TYPE_URBAN.PARK]:             'rgba(60,120,60,0.125)', 
    [DISTRICT_TYPE_URBAN.TOXIC]:            'rgba(100,180,60,0.10)',
    [DISTRICT_TYPE_URBAN.MAZE_RUIN]:        'rgba(70,70,70,0.05)', 
    [DISTRICT_TYPE_URBAN.DENSE_URBAN_CORE]: 'rgba(100,100,120,0.05)',
    [DISTRICT_TYPE_URBAN.OPEN_FIELD]:       'rgba(100,140,80,0.075)', 
    [DISTRICT_TYPE_URBAN.MONOLITH_PLAZA]:   'rgba(120,120,120,0.05)',
    [DISTRICT_TYPE_URBAN.NONE]:             'rgba(0,0,0,0)' 
};
var showDistrictTint = true; 

const ZONE_TYPE = { URBAN: 'URBAN', MAZE_RUINS: 'MAZE_RUINS', DENSE_URBAN: 'DENSE_URBAN', OPEN_FIELD: 'OPEN_FIELD', MONOLITH_PLAZA: 'MONOLITH_PLAZA' };


// Fog of War Settings
const PLAYER_VISION_RADIUS = 17;
const FOG_STATE = { HIDDEN: 0, REVEALED: 1, WALL_VISIBLE: 2 };
const FOG_COLOR_HIDDEN_STANDARD = 'rgba(0, 0, 0, 1)';
const FOG_COLOR_HIDDEN_RECON = 'rgba(0, 0, 0, 0.9)';
const FOG_COLOR_WALL_VISIBLE_RECON = 'rgba(0, 0, 0, 0.9)';
const FOG_LOS_STEP_SCALE = 0.4;

// Tile Types Enum & Colors
const TILE = { FLOOR: 0, WALL: 1, OBSTACLE: 2, ENTRANCE: 3, EXPLOSIVE_CRATE: 4 }; 
const COLOR_FLOOR = '#333';
const COLOR_WALL = '#a6a6a6';
const COLOR_OBSTACLE = '#c0c0c0';
const COLOR_ENTRANCE = '#8B0000';
const COLOR_WALL_STROKE = '#555';
const COLOR_EXPLOSIVE_CRATE = 'darkorange'; 


// Railgun Effect
const RAILGUN_EFFECT_DURATION = 100; const RAILGUN_COLOR = 'rgba(0, 180, 255, 0.8)'; const RAILGUN_WIDTH = 5;
const RAILGUN_PARTICLE_LIFESPAN = 150; 
const RAILGUN_PARTICLE_RADIUS = 3; const RAILGUN_PARTICLE_COLOR_TRAIL = 'rgba(80, 180, 220, 0.6)';
const RAILGUN_PARTICLE_SPAWN_DELAY = 50; 

// Railgun Wall Hit Particle Constants
const RAILGUN_WALL_PARTICLE_COUNT = 15;
const RAILGUN_WALL_PARTICLE_SPEED_MIN = 250;
const RAILGUN_WALL_PARTICLE_SPEED_MAX = 600;
const RAILGUN_WALL_PARTICLE_LIFESPAN = 200;
const RAILGUN_WALL_PARTICLE_RADIUS_MIN = 1.5;
const RAILGUN_WALL_PARTICLE_RADIUS_MAX = 3.5;
const RAILGUN_WALL_PARTICLE_COLOR = [0, 200, 255]; 


// Debuff visuals
const SLOW_EFFECT_COLOR = 'rgba(0, 150, 255, 0.3)';

// --- Powerup System ---
const POWERUP_SIZE = TILE_SIZE * 0.55;
const MAX_POWERUPS_ON_MAP = Math.round(180 * 1.30 * 0.7); 
const POWERUP_MIN_SEPARATION_UNITS = 250; 
const POWERUP_COLOR_DEFAULT = 'gold';
const POWERUP_MESSAGE_BASE_DURATION = 3200 + 1200; 

const PowerupType = {
    // Recon
    RECON_COOLDOWN_REDUCTION: 'RECON_COOLDOWN_REDUCTION', 
    RECON_RAILGUN_DAMAGE_SMALL: 'RECON_RAILGUN_DAMAGE_SMALL', 
    RECON_RAILGUN_MAG_10: 'RECON_RAILGUN_MAG_10',
    RECON_RAILGUN_MAG_20: 'RECON_RAILGUN_MAG_20',
    RECON_BT_CD_ONE_SEC: 'RECON_BT_CD_ONE_SEC', 
    RECON_RAILGUN_DAMAGE_LARGE: 'RECON_RAILGUN_DAMAGE_LARGE',
    RECON_RAILGUN_FIRE_RATE: 'RECON_RAILGUN_FIRE_RATE', 
    RECON_BT_CD_HALF_SEC: 'RECON_BT_CD_HALF_SEC',     
    RECON_BT_CD_TWO_SEC: 'RECON_BT_CD_TWO_SEC',       
    RECON_RAILGUN_DMG_50: 'RECON_RAILGUN_DMG_50',
    RECON_RAILGUN_DMG_30: 'RECON_RAILGUN_DMG_30',
    RECON_RAILGUN_DMG_70: 'RECON_RAILGUN_DMG_70',
    RECON_RAILGUN_FIRE_RATE_35: 'RECON_RAILGUN_FIRE_RATE_35',
    RECON_RAILGUN_DMG_PLUS_31: 'RECON_RAILGUN_DMG_PLUS_31',
    RECON_RAILGUN_MAG_PLUS_5: 'RECON_RAILGUN_MAG_PLUS_5',
    RECON_RAILGUN_FIRE_RATE_20P: 'RECON_RAILGUN_FIRE_RATE_20P',
    RECON_RAILGUN_FIRE_RATE_30P: 'RECON_RAILGUN_FIRE_RATE_30P',
    RECON_RAILGUN_MAG_PLUS_15: 'RECON_RAILGUN_MAG_PLUS_15',


    // Marine
    MARINE_EXTRA_MERCS: 'MARINE_EXTRA_MERCS', 
    MARINE_EXTRA_GRENADES: 'MARINE_EXTRA_GRENADES', 
    MARINE_MG_MAG_SIZE: 'MARINE_MG_MAG_SIZE', 
    MARINE_COMMANDO_KIT: 'MARINE_COMMANDO_KIT', 
    MARINE_MG_DAMAGE_SMALL: 'MARINE_MG_DAMAGE_SMALL',
    MARINE_MG_DAMAGE_TINY: 'MARINE_MG_DAMAGE_TINY', 
    MARINE_EXTRA_MERCS_LARGE: 'MARINE_EXTRA_MERCS_LARGE',
    MARINE_EXTRA_GRENADES_LARGE: 'MARINE_EXTRA_GRENADES_LARGE',
    MARINE_MG_DMG_PLUS_1: 'MARINE_MG_DMG_PLUS_1',
    MARINE_MG_DMG_PLUS_2: 'MARINE_MG_DMG_PLUS_2',
    MARINE_MG_FIRE_RATE_30: 'MARINE_MG_FIRE_RATE_30',
    MARINE_MG_FIRE_RATE_20: 'MARINE_MG_FIRE_RATE_20',
    MARINE_MG_DMG_PLUS_3: 'MARINE_MG_DMG_PLUS_3',
    MARINE_MG_DMG_PLUS_5: 'MARINE_MG_DMG_PLUS_5',
    MARINE_MG_MAG_PLUS_30: 'MARINE_MG_MAG_PLUS_30',
    MARINE_MG_PEN_RICOCHET: 'MARINE_MG_PEN_RICOCHET',

    // Devastator
    DEVASTATOR_FLAME_MAG: 'DEVASTATOR_FLAME_MAG', 
    DEVASTATOR_RPG_ROUNDS: 'DEVASTATOR_RPG_ROUNDS', 
    DEVASTATOR_EXTRA_MERCS: 'DEVASTATOR_EXTRA_MERCS', 
    DEVASTATOR_FLAME_PARTICLES_X2: 'DEVASTATOR_FLAME_PARTICLES_X2',
    DEVASTATOR_FLAME_PARTICLE_DMG_PLUS_1: 'DEVASTATOR_FLAME_PARTICLE_DMG_PLUS_1',
    DEVASTATOR_RPG_DMG_X2: 'DEVASTATOR_RPG_DMG_X2',
    DEVASTATOR_FLAME_MAG_LARGE: 'DEVASTATOR_FLAME_MAG_LARGE',
    DEVASTATOR_FLAME_LIFE_30: 'DEVASTATOR_FLAME_LIFE_30',
    DEVASTATOR_FLAME_RATE_30: 'DEVASTATOR_FLAME_RATE_30',
    DEVASTATOR_FLAME_DMG_PLUS_1: 'DEVASTATOR_FLAME_DMG_PLUS_1', 
    DEVASTATOR_FLAME_LIFE_20: 'DEVASTATOR_FLAME_LIFE_20',
    DEVASTATOR_RPG_DMG_PLUS_50P: 'DEVASTATOR_RPG_DMG_PLUS_50P',
    DEVASTATOR_RPG_DMG_PLUS_70P: 'DEVASTATOR_RPG_DMG_PLUS_70P',
    DEVASTATOR_RPG_DMG_PLUS_30P: 'DEVASTATOR_RPG_DMG_PLUS_30P',


    // Brawler
    BRAWLER_SHOTGUN_PELLETS: 'BRAWLER_SHOTGUN_PELLETS', 
    BRAWLER_BONUS_HP_LARGE: 'BRAWLER_BONUS_HP_LARGE', 
    BRAWLER_SHOTGUN_DMG_PLUS_7: 'BRAWLER_SHOTGUN_DMG_PLUS_7',
    BRAWLER_DASH_MAX_PLUS_3: 'BRAWLER_DASH_MAX_PLUS_3',
    BRAWLER_SHOTGUN_DMG_PLUS_5: 'BRAWLER_SHOTGUN_DMG_PLUS_5',
    BRAWLER_SHOTGUN_MAG_PLUS_30: 'BRAWLER_SHOTGUN_MAG_PLUS_30',
    BRAWLER_SHOTGUN_FIRE_RATE: 'BRAWLER_SHOTGUN_FIRE_RATE',
    BRAWLER_SHOTGUN_DMG_PLUS_1: 'BRAWLER_SHOTGUN_DMG_PLUS_1',
    BRAWLER_SHOTGUN_DMG_PLUS_2: 'BRAWLER_SHOTGUN_DMG_PLUS_2',
    BRAWLER_SHOTGUN_MAG_PLUS_10: 'BRAWLER_SHOTGUN_MAG_PLUS_10',
    BRAWLER_DASH_PLUS_1: 'BRAWLER_DASH_PLUS_1',
    BRAWLER_DASH_PLUS_2: 'BRAWLER_DASH_PLUS_2',
    BRAWLER_HP_REGEN_X2: 'BRAWLER_HP_REGEN_X2',
    BRAWLER_REGEN_PLUS_3: 'BRAWLER_REGEN_PLUS_3',
    BRAWLER_REGEN_PLUS_7: 'BRAWLER_REGEN_PLUS_7',
    BRAWLER_SHOTGUN_STUN_X2: 'BRAWLER_SHOTGUN_STUN_X2',

    // Psion
    PSION_MAX_SHIELD: 'PSION_MAX_SHIELD', 
    PSION_BLADE_DAMAGE_SMALL: 'PSION_BLADE_DAMAGE_SMALL', 
    PSION_XRAY_RANGE_BONUS: 'PSION_XRAY_RANGE_BONUS', 
    PSION_BLADE_SIZE_X2: 'PSION_BLADE_SIZE_X2', 
    PSION_BLADE_DAMAGE_LARGE: 'PSION_BLADE_DAMAGE_LARGE', 
    PSION_SHIELD_PLUS_100: 'PSION_SHIELD_PLUS_100',
    PSION_SHIELD_REGEN_X3: 'PSION_SHIELD_REGEN_X3',
    PSION_BLADE_SIZE_PLUS_50P: 'PSION_BLADE_SIZE_PLUS_50P',
    PSION_BLADE_SIZE_PLUS_30P: 'PSION_BLADE_SIZE_PLUS_30P',
    PSION_BLAST_PARTICLES_X2: 'PSION_BLAST_PARTICLES_X2',
    PSION_BLAST_PARTICLE_LIFE_30P: 'PSION_BLAST_PARTICLE_LIFE_30P',
    PSION_BLAST_DMG_40P: 'PSION_BLAST_DMG_40P',
    PSION_BLAST_DMG_20P: 'PSION_BLAST_DMG_20P',
    PSION_BLADE_DMG_PLUS_22: 'PSION_BLADE_DMG_PLUS_22',
    PSION_BLADE_DMG_PLUS_11: 'PSION_BLADE_DMG_PLUS_11',
    PSION_BLADE_SIZE_PLUS_20P: 'PSION_BLADE_SIZE_PLUS_20P',
    PSION_SHIELD_PLUS_69: 'PSION_SHIELD_PLUS_69',
    PSION_SHIELD_PLUS_77: 'PSION_SHIELD_PLUS_77',
    PSION_SHIELD_REGEN_PLUS_3: 'PSION_SHIELD_REGEN_PLUS_3',
    PSION_SHIELD_REGEN_PLUS_2: 'PSION_SHIELD_REGEN_PLUS_2',
    PSION_SHIELD_REGEN_PLUS_1: 'PSION_SHIELD_REGEN_PLUS_1',
    PSION_XRAY_PLUS_89: 'PSION_XRAY_PLUS_89',


    // Engineer
    ENGINEER_EXTRA_DRONES_CLASS: 'ENGINEER_EXTRA_DRONES_CLASS', 
    ENGINEER_SMG_MAG: 'ENGINEER_SMG_MAG', 
    ENGINEER_TURRET_DMG_X2: 'ENGINEER_TURRET_DMG_X2',
    ENGINEER_TURRET_FIRE_RATE_PLUS_50: 'ENGINEER_TURRET_FIRE_RATE_PLUS_50',
    ENGINEER_SMG_DMG_X2: 'ENGINEER_SMG_DMG_X2', 
    ENGINEER_SMG_DMG_PLUS_50P: 'ENGINEER_SMG_DMG_PLUS_50P', 
    ENGINEER_TURRET_DMG_PLUS_3: 'ENGINEER_TURRET_DMG_PLUS_3',
    ENGINEER_TURRET_FIRE_RATE_10P: 'ENGINEER_TURRET_FIRE_RATE_10P',
    ENGINEER_TURRET_FIRE_RATE_20P: 'ENGINEER_TURRET_FIRE_RATE_20P',
    ENGINEER_TURRET_DMG_PLUS_4: 'ENGINEER_TURRET_DMG_PLUS_4',
    ENGINEER_SMG_DMG_PLUS_3: 'ENGINEER_SMG_DMG_PLUS_3',
    ENGINEER_SMG_DMG_PLUS_2: 'ENGINEER_SMG_DMG_PLUS_2',
    ENGINEER_DRONE_DMG_PLUS_2: 'ENGINEER_DRONE_DMG_PLUS_2',
    ENGINEER_DRONE_DMG_PLUS_1: 'ENGINEER_DRONE_DMG_PLUS_1',
    ENGINEER_DRONE_DMG_PLUS_5: 'ENGINEER_DRONE_DMG_PLUS_5',
    ENGINEER_DRONE_FIRE_RATE_20P: 'ENGINEER_DRONE_FIRE_RATE_20P',
    ENGINEER_DRONE_FIRE_RATE_10P: 'ENGINEER_DRONE_FIRE_RATE_10P',
    ENGINEER_SMG_DMG_PLUS_5: 'ENGINEER_SMG_DMG_PLUS_5', 
    ENGINEER_DRONE_FIRE_RATE_30P: 'ENGINEER_DRONE_FIRE_RATE_30P',
    ENGINEER_TURRET_DMG_PLUS_30P: 'ENGINEER_TURRET_DMG_PLUS_30P',
    ENGINEER_TURRET_FIRE_RATE_25P: 'ENGINEER_TURRET_FIRE_RATE_25P',
    
    // Generic
    GENERIC_BONUS_HP: 'GENERIC_BONUS_HP', 
    GENERIC_SPEED_BOOST: 'GENERIC_SPEED_BOOST', 
    GENERIC_EXTRA_DRONES: 'GENERIC_EXTRA_DRONES', 
    GENERIC_EXTRA_MERCS: 'GENERIC_EXTRA_MERCS', 
    ADRENAL_OVERCHARGE: 'ADRENAL_OVERCHARGE', 
    GENERIC_EXTRA_DRONES_LARGE: 'GENERIC_EXTRA_DRONES_LARGE', 
    GENERIC_EXTRA_MERCS_LARGE: 'GENERIC_EXTRA_MERCS_LARGE',   
    GENERIC_FOG_CLEAR: 'GENERIC_FOG_CLEAR',                 
    GENERIC_SPAWN_7_POWERUPS: 'GENERIC_SPAWN_7_POWERUPS',
    GENERIC_KILL_NEARBY_1000: 'GENERIC_KILL_NEARBY_1000',
    GENERIC_SPEED_BOOST_LARGE: 'GENERIC_SPEED_BOOST_LARGE', 
    GENERIC_KILL_NEARBY_500: 'GENERIC_KILL_NEARBY_500',
    GENERIC_SPAWN_4_POWERUPS: 'GENERIC_SPAWN_4_POWERUPS', 
    GENERIC_SPEED_PLUS_10P: 'GENERIC_SPEED_PLUS_10P',
    GENERIC_HP_PLUS_20: 'GENERIC_HP_PLUS_20',
    GENERIC_SPAWN_1_POWERUP: 'GENERIC_SPAWN_1_POWERUP',
    GENERIC_SPAWN_2_POWERUPS: 'GENERIC_SPAWN_2_POWERUPS',
    GENERIC_SPAWN_3_POWERUPS: 'GENERIC_SPAWN_3_POWERUPS',
    GENERIC_HP_PLUS_45: 'GENERIC_HP_PLUS_45',
    GENERIC_EXTRA_DRONES_2: 'GENERIC_EXTRA_DRONES_2',
    GENERIC_EXTRA_MERCS_2: 'GENERIC_EXTRA_MERCS_2',
    GENERIC_TRIGGER_BULLET_TIME: 'GENERIC_TRIGGER_BULLET_TIME',
    GENERIC_STUN_ALL_4S_A: 'GENERIC_STUN_ALL_4S_A', 
    GENERIC_STUN_ALL_4S_B: 'GENERIC_STUN_ALL_4S_B'  
};

const powerupConfig = {
    // Recon
    [PowerupType.RECON_COOLDOWN_REDUCTION]: { name: "Coolant Flush", description: "Bullet Time Cooldown -1.5s", classId: CLASS_ID.RECON, color: 'lightblue',
        apply: (player) => { RECON_BULLET_TIME_COOLDOWN = Math.max(500, RECON_BULLET_TIME_COOLDOWN - 1500); player.abilityCooldownTimer = Math.min(player.abilityCooldownTimer, RECON_BULLET_TIME_COOLDOWN); player.classData.ability.cooldown = RECON_BULLET_TIME_COOLDOWN; } },
    [PowerupType.RECON_RAILGUN_DAMAGE_SMALL]: { name: "Heavy Slugs", description: "Railgun Damage +80", classId: CLASS_ID.RECON, color: 'darkcyan', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.damageMin += 80; weapon.damageMax += 80;} } },
    [PowerupType.RECON_RAILGUN_MAG_10]: { name: "Railgun Mag Pouch", description: "Railgun Mag +10", classId: CLASS_ID.RECON, color: 'teal',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.magSize += 10; } } },
    [PowerupType.RECON_RAILGUN_MAG_20]: { name: "Railgun Ammo Crate", description: "Railgun Mag +20", classId: CLASS_ID.RECON, color: 'darkturquoise',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.magSize += 20; } } },
    [PowerupType.RECON_BT_CD_ONE_SEC]: { name: "Focus Matrix", description: "Bullet Time Cooldown -1s", classId: CLASS_ID.RECON, color: 'paleturquoise', 
        apply: (player) => { RECON_BULLET_TIME_COOLDOWN = Math.max(500, RECON_BULLET_TIME_COOLDOWN - 1000); player.abilityCooldownTimer = Math.min(player.abilityCooldownTimer, RECON_BULLET_TIME_COOLDOWN); player.classData.ability.cooldown = RECON_BULLET_TIME_COOLDOWN;} },
    [PowerupType.RECON_RAILGUN_DAMAGE_LARGE]: { name: "Overcharged Slugs", description: "Railgun Damage +120", classId: CLASS_ID.RECON, color: '#008080', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.damageMin += 120; weapon.damageMax += 120;} } },
    [PowerupType.RECON_RAILGUN_FIRE_RATE]: { name: "Rapid Capacitor", description: "Railgun Fire Rate +40%", classId: CLASS_ID.RECON, color: '#20B2AA', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.rpm = Math.round(weapon.rpm * 1.40); } } },
    [PowerupType.RECON_BT_CD_HALF_SEC]: { name: "Chrono-Stabilizer", description: "Bullet Time CD -0.5s", classId: CLASS_ID.RECON, color: 'lightcyan',
        apply: (player) => { RECON_BULLET_TIME_COOLDOWN = Math.max(500, RECON_BULLET_TIME_COOLDOWN - 500); player.abilityCooldownTimer = Math.min(player.abilityCooldownTimer, RECON_BULLET_TIME_COOLDOWN); player.classData.ability.cooldown = RECON_BULLET_TIME_COOLDOWN; } },
    [PowerupType.RECON_BT_CD_TWO_SEC]: { name: "Temporal Accelerator", description: "Bullet Time CD -2s", classId: CLASS_ID.RECON, color: 'cyan',
        apply: (player) => { RECON_BULLET_TIME_COOLDOWN = Math.max(500, RECON_BULLET_TIME_COOLDOWN - 2000); player.abilityCooldownTimer = Math.min(player.abilityCooldownTimer, RECON_BULLET_TIME_COOLDOWN); player.classData.ability.cooldown = RECON_BULLET_TIME_COOLDOWN;} },
    [PowerupType.RECON_RAILGUN_DMG_50]: { name: "Tungsten Core", description: "Railgun Dmg +50", classId: CLASS_ID.RECON, color: '#48D1CC', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.damageMin += 50; weapon.damageMax += 50;} } },
    [PowerupType.RECON_RAILGUN_DMG_30]: { name: "Sharpened Flechettes", description: "Railgun Dmg +30", classId: CLASS_ID.RECON, color: '#AFEEEE', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.damageMin += 30; weapon.damageMax += 30;} } },
    [PowerupType.RECON_RAILGUN_DMG_70]: { name: "Depleted Uranium", description: "Railgun Dmg +70", classId: CLASS_ID.RECON, color: '#00CED1', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.damageMin += 70; weapon.damageMax += 70;} } },
    [PowerupType.RECON_RAILGUN_FIRE_RATE_35]: { name: "Magnetic Accelerator", description: "Railgun Fire Rate +35%", classId: CLASS_ID.RECON, color: '#40E0D0', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.RAILGUN); if(weapon) { weapon.rpm = Math.round(weapon.rpm * 1.35); } } },
    [PowerupType.RECON_RAILGUN_DMG_PLUS_31]: { name: "Focused Beam", description: "Railgun Dmg +31", classId: CLASS_ID.RECON, color: 'turquoise',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.RAILGUN); if (weapon) { weapon.damageMin += 31; weapon.damageMax += 31; } } },
    [PowerupType.RECON_RAILGUN_MAG_PLUS_5]: { name: "Extra Cells", description: "Railgun Mag +5", classId: CLASS_ID.RECON, color: 'mediumturquoise',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.RAILGUN); if (weapon) { weapon.magSize += 5; } } },
    [PowerupType.RECON_RAILGUN_FIRE_RATE_20P]: { name: "Quick Cycle Chamber", description: "Railgun Fire Rate +20%", classId: CLASS_ID.RECON, color: 'aquamarine',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.RAILGUN); if (weapon) { weapon.rpm = Math.round(weapon.rpm * 1.20); } } },
    [PowerupType.RECON_RAILGUN_FIRE_RATE_30P]: { name: "High-Speed Inductors", description: "Railgun Fire Rate +30%", classId: CLASS_ID.RECON, color: 'darkturquoise',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.RAILGUN); if (weapon) { weapon.rpm = Math.round(weapon.rpm * 1.30); } } },
    [PowerupType.RECON_RAILGUN_MAG_PLUS_15]: { name: "Overcharged Battery", description: "Railgun Mag +15", classId: CLASS_ID.RECON, color: 'cadetblue',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.RAILGUN); if (weapon) { weapon.magSize += 15; } } },


    // Marine
    [PowerupType.MARINE_EXTRA_MERCS]: { name: "Reinforcements", description: "+2 Mercenaries", classId: CLASS_ID.MARINE, color: 'darkgreen',
        apply: (player) => { player.queuedPowerupMercs = (player.queuedPowerupMercs || 0) + 2; } },
    [PowerupType.MARINE_EXTRA_GRENADES]: { name: "Extra Ordinance", description: "+10 Grenades", classId: CLASS_ID.MARINE, color: 'olive',
        apply: (player) => { player.abilityUsesTotal += 10; player.abilityUsesLeft += 10;} },
    [PowerupType.MARINE_MG_MAG_SIZE]: { name: "Extended Mag", description: "Machinegun Mag +50", classId: CLASS_ID.MARINE, color: 'darkolivegreen',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.MACHINEGUN); if(weapon) { weapon.magSize += 50; } } },
    [PowerupType.MARINE_COMMANDO_KIT]: { name: "Commando Kit", description: "MG Mag +30 & +5 Grenades", classId: CLASS_ID.MARINE, color: '#38761d',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.MACHINEGUN); if(weapon) { weapon.magSize += 30; } player.abilityUsesTotal += 5; player.abilityUsesLeft += 5; } },
    [PowerupType.MARINE_MG_DAMAGE_SMALL]: { name: "AP Rounds", description: "Machinegun Dmg +5", classId: CLASS_ID.MARINE, color: 'forestgreen',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.MACHINEGUN); if(weapon) { weapon.damageMin += 5; weapon.damageMax += 5;} } },
    [PowerupType.MARINE_MG_DAMAGE_TINY]: { name: "Hot Loads", description: "Machinegun Dmg +10", classId: CLASS_ID.MARINE, color: '#228B22', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.MACHINEGUN); if(weapon) { weapon.damageMin += 10; weapon.damageMax += 10;} } },
    [PowerupType.MARINE_EXTRA_MERCS_LARGE]: { name: "Mercenary Squad", description: "+5 Mercenaries", classId: CLASS_ID.MARINE, color: '#006400', 
        apply: (player) => { player.queuedPowerupMercs = (player.queuedPowerupMercs || 0) + 5; } },
    [PowerupType.MARINE_EXTRA_GRENADES_LARGE]: { name: "Grenade Cache", description: "+30 Grenades", classId: CLASS_ID.MARINE, color: '#556B2F', 
        apply: (player) => { player.abilityUsesTotal += 30; player.abilityUsesLeft += 30;} },
    [PowerupType.MARINE_MG_DMG_PLUS_1]: { name: "FMJ Rounds", description: "MG Dmg +1", classId: CLASS_ID.MARINE, color: 'limegreen',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.MACHINEGUN); if(weapon) { weapon.damageMin += 1; weapon.damageMax += 1;} } },
    [PowerupType.MARINE_MG_DMG_PLUS_2]: { name: "Improved Propellant", description: "MG Dmg +2", classId: CLASS_ID.MARINE, color: '#32CD32', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.MACHINEGUN); if(weapon) { weapon.damageMin += 2; weapon.damageMax += 2;} } },
    [PowerupType.MARINE_MG_FIRE_RATE_30]: { name: "Light Bolt Carrier", description: "MG Fire Rate +30%", classId: CLASS_ID.MARINE, color: '#90EE90', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.MACHINEGUN); if(weapon) { weapon.rpm = Math.round(weapon.rpm * 1.30); } } },
    [PowerupType.MARINE_MG_FIRE_RATE_20]: { name: "Tuned Trigger", description: "MG Fire Rate +20%", classId: CLASS_ID.MARINE, color: '#98FB98', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.MACHINEGUN); if(weapon) { weapon.rpm = Math.round(weapon.rpm * 1.20); } } },
    [PowerupType.MARINE_MG_DMG_PLUS_3]: { name: "Heavy Rounds", description: "MG Dmg +3", classId: CLASS_ID.MARINE, color: 'seagreen',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.MACHINEGUN); if (weapon) { weapon.damageMin += 3; weapon.damageMax += 3; } } },
    [PowerupType.MARINE_MG_DMG_PLUS_5]: { name: "Incendiary Rounds", description: "MG Dmg +5", classId: CLASS_ID.MARINE, color: 'darkseagreen',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.MACHINEGUN); if (weapon) { weapon.damageMin += 5; weapon.damageMax += 5; } } },
    [PowerupType.MARINE_MG_MAG_PLUS_30]: { name: "Belt Feed", description: "MG Mag +30", classId: CLASS_ID.MARINE, color: 'olivedrab',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.MACHINEGUN); if (weapon) { weapon.magSize += 30; } } },
    [PowerupType.MARINE_MG_PEN_RICOCHET]: { name: "Tungsten Penetrator", description: "MG Pen +1, Ricochet +1", classId: CLASS_ID.MARINE, color: 'darkolivegreen',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.MACHINEGUN); if (weapon) { weapon.penetration = (weapon.penetration || 0) + 1; weapon.ricochets = (weapon.ricochets || 0) + 1; } } },
        
    // Devastator
    [PowerupType.DEVASTATOR_FLAME_MAG]: { name: "Fuel Tank", description: "Flamethrower Mag +100", classId: CLASS_ID.DEVASTATOR, color: 'darkorange',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.FLAMETHROWER); if(weapon) { weapon.magSize += 100; } } },
    [PowerupType.DEVASTATOR_RPG_ROUNDS]: { name: "More Rockets", description: "+7 RPG Rounds", classId: CLASS_ID.DEVASTATOR, color: 'orangered',
        apply: (player) => { player.abilityUsesTotal += 7; player.abilityUsesLeft += 7;} },
    [PowerupType.DEVASTATOR_EXTRA_MERCS]: { name: "Escort Team", description: "+2 Mercenaries", classId: CLASS_ID.DEVASTATOR, color: 'sienna',
        apply: (player) => { player.queuedPowerupMercs = (player.queuedPowerupMercs || 0) + 2; } },
    [PowerupType.DEVASTATOR_FLAME_PARTICLES_X2]: { name: "Particle Accelerator", description: "Flamethrower Particles x2", classId: CLASS_ID.DEVASTATOR, color: '#FF8C00', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.FLAMETHROWER); if(weapon) { weapon.particleCountPerShot = Math.round((weapon.particleCountPerShot || 10) * 2); } } },
    [PowerupType.DEVASTATOR_FLAME_PARTICLE_DMG_PLUS_1]: { name: "Incendiary Mix", description: "Flamethrower +1 Dmg/Particle", classId: CLASS_ID.DEVASTATOR, color: '#FF4500', 
        apply: (player) => { FLAME_PARTICLE_DAMAGE += 1; } }, 
    [PowerupType.DEVASTATOR_RPG_DMG_X2]: { name: "HE Rockets", description: "RPG Damage x2", classId: CLASS_ID.DEVASTATOR, color: '#DC143C', 
        apply: (player) => { RPG_DAMAGE_CENTER *= 2; RPG_DAMAGE_EDGE *= 2; } }, 
    [PowerupType.DEVASTATOR_FLAME_MAG_LARGE]: { name: "Expanded Fuel Tank", description: "Flamethrower Mag +150", classId: CLASS_ID.DEVASTATOR, color: '#FF7F50', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.FLAMETHROWER); if(weapon) { weapon.magSize += 150; } } },
    [PowerupType.DEVASTATOR_FLAME_LIFE_30]: { name: "Lingering Flames", description: "Flamer Particle Life +30%", classId: CLASS_ID.DEVASTATOR, color: '#FFA07A', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.FLAMETHROWER); if(weapon) { FLAMETHROWER_PARTICLE_LIFESPAN_BASE *= 1.30; weapon.particleLifespan = FLAMETHROWER_PARTICLE_LIFESPAN_BASE; } } },
    [PowerupType.DEVASTATOR_FLAME_RATE_30]: { name: "High-Pressure Nozzle", description: "Flamer Fire Rate +30%", classId: CLASS_ID.DEVASTATOR, color: '#FA8072', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.FLAMETHROWER); if(weapon) { weapon.rpm = Math.round(weapon.rpm * 1.30); } } },
    [PowerupType.DEVASTATOR_FLAME_DMG_PLUS_1]: { name: "Napalm Enhancer", description: "Flamer Dmg/Particle +1", classId: CLASS_ID.DEVASTATOR, color: '#E9967A', 
        apply: (player) => { FLAME_PARTICLE_DAMAGE += 1; } },
    [PowerupType.DEVASTATOR_FLAME_LIFE_20]: { name: "Extended Burn", description: "Flamer Particle Life +20%", classId: CLASS_ID.DEVASTATOR, color: '#F08080', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.FLAMETHROWER); if(weapon) { FLAMETHROWER_PARTICLE_LIFESPAN_BASE *= 1.20; weapon.particleLifespan = FLAMETHROWER_PARTICLE_LIFESPAN_BASE; } } },
    [PowerupType.DEVASTATOR_RPG_DMG_PLUS_50P]: { name: "Shaped Charge", description: "RPG Dmg +50%", classId: CLASS_ID.DEVASTATOR, color: 'crimson',
        apply: (player) => { RPG_DAMAGE_CENTER = Math.round(RPG_DAMAGE_CENTER * 1.5); RPG_DAMAGE_EDGE = Math.round(RPG_DAMAGE_EDGE * 1.5); } },
    [PowerupType.DEVASTATOR_RPG_DMG_PLUS_70P]: { name: "Thermobaric Warhead", description: "RPG Dmg +70%", classId: CLASS_ID.DEVASTATOR, color: 'firebrick',
        apply: (player) => { RPG_DAMAGE_CENTER = Math.round(RPG_DAMAGE_CENTER * 1.7); RPG_DAMAGE_EDGE = Math.round(RPG_DAMAGE_EDGE * 1.7); } },
    [PowerupType.DEVASTATOR_RPG_DMG_PLUS_30P]: { name: "High Explosive Mix", description: "RPG Dmg +30%", classId: CLASS_ID.DEVASTATOR, color: 'indianred',
        apply: (player) => { RPG_DAMAGE_CENTER = Math.round(RPG_DAMAGE_CENTER * 1.3); RPG_DAMAGE_EDGE = Math.round(RPG_DAMAGE_EDGE * 1.3); } },


    // Brawler
    [PowerupType.BRAWLER_SHOTGUN_PELLETS]: { name: "Flechette Rounds", description: "Autoshotgun +8 Pellets", classId: CLASS_ID.BRAWLER, color: 'darkred',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.AUTOSHOTGUN); if(weapon) { weapon.pellets += 8; } } },
    [PowerupType.BRAWLER_BONUS_HP_LARGE]: { name: "Trauma Plates", description: "+100 HP", classId: CLASS_ID.BRAWLER, color: 'maroon',
        apply: (player) => { player.maxHp += 100; player.hp += 100; } },
    [PowerupType.BRAWLER_SHOTGUN_DMG_PLUS_7]: { name: "Magnum Buckshot", description: "Autoshotgun Dmg +7/Pellet", classId: CLASS_ID.BRAWLER, color: '#800000', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.AUTOSHOTGUN); if(weapon) { weapon.damageMin += 7; weapon.damageMax += 7;} } },
    [PowerupType.BRAWLER_DASH_MAX_PLUS_3]: { name: "Adrenal Glands", description: "+3 Max Dash Charges", classId: CLASS_ID.BRAWLER, color: '#B22222', 
        apply: (player) => { player.abilityMaxCharges += 3; player.abilityCharges +=3; player.abilityUsesLeft = player.abilityCharges; } },
    [PowerupType.BRAWLER_SHOTGUN_DMG_PLUS_5]: { name: "Heavy Hitter", description: "Autoshotgun Dmg +5/Pellet", classId: CLASS_ID.BRAWLER, color: '#A52A2A', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.AUTOSHOTGUN); if(weapon) { weapon.damageMin += 5; weapon.damageMax += 5;} } },
    [PowerupType.BRAWLER_SHOTGUN_MAG_PLUS_30]: { name: "Drum Magazine", description: "Autoshotgun Mag +30", classId: CLASS_ID.BRAWLER, color: '#D2691E', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.AUTOSHOTGUN); if(weapon) { weapon.magSize += 30; } } },
    [PowerupType.BRAWLER_SHOTGUN_FIRE_RATE]: { name: "Hair Trigger", description: "Autoshotgun Fire Rate +35%", classId: CLASS_ID.BRAWLER, color: '#CD5C5C', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.AUTOSHOTGUN); if(weapon) { weapon.rpm = Math.round(weapon.rpm * 1.35); } } },
    [PowerupType.BRAWLER_SHOTGUN_DMG_PLUS_1]: { name: "00 Buck", description: "Autoshotgun Dmg +1/Pellet", classId: CLASS_ID.BRAWLER, color: '#F08080', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.AUTOSHOTGUN); if(weapon) { weapon.damageMin += 1; weapon.damageMax += 1;} } },
    [PowerupType.BRAWLER_SHOTGUN_DMG_PLUS_2]: { name: "Impact Rounds", description: "Autoshotgun Dmg +2/Pellet", classId: CLASS_ID.BRAWLER, color: '#E9967A', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.AUTOSHOTGUN); if(weapon) { weapon.damageMin += 2; weapon.damageMax += 2;} } },
    [PowerupType.BRAWLER_SHOTGUN_MAG_PLUS_10]: { name: "Shell Loops", description: "Autoshotgun Mag +10", classId: CLASS_ID.BRAWLER, color: '#FFA07A', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.AUTOSHOTGUN); if(weapon) { weapon.magSize += 10; } } },
    [PowerupType.BRAWLER_DASH_PLUS_1]: { name: "Combat Agility", description: "+1 Max Dash Charge", classId: CLASS_ID.BRAWLER, color: '#FF6347', 
        apply: (player) => { player.abilityMaxCharges += 1; player.abilityCharges +=1; player.abilityUsesLeft = player.abilityCharges; } },
    [PowerupType.BRAWLER_DASH_PLUS_2]: { name: "Enhanced Reflexes", description: "+2 Max Dash Charges", classId: CLASS_ID.BRAWLER, color: '#FF4500', 
        apply: (player) => { player.abilityMaxCharges += 2; player.abilityCharges +=2; player.abilityUsesLeft = player.abilityCharges; } },
    [PowerupType.BRAWLER_HP_REGEN_X2]: { name: "Hyper-Metabolism", description: "HP Regen x2", classId: CLASS_ID.BRAWLER, color: '#FF0000', 
        apply: (player) => { BRAWLER_PASSIVE_REGEN_AMOUNT *= 2;} },
    [PowerupType.BRAWLER_REGEN_PLUS_3]: { name: "Cellular Regeneration", description: "Regen +3 HP/s", classId: CLASS_ID.BRAWLER, color: 'firebrick',
        apply: (player) => { BRAWLER_PASSIVE_REGEN_AMOUNT += 3; } },
    [PowerupType.BRAWLER_REGEN_PLUS_7]: { name: "Bio-Augmentation", description: "Regen +7 HP/s", classId: CLASS_ID.BRAWLER, color: 'darkred',
        apply: (player) => { BRAWLER_PASSIVE_REGEN_AMOUNT += 7; } },
    [PowerupType.BRAWLER_SHOTGUN_STUN_X2]: { name: "Concussive Shells", description: "Autoshotgun Stun x2", classId: CLASS_ID.BRAWLER, color: 'red',
        apply: (player) => { AUTOSHOTGUN_STUN_DURATION *= 2; } },


    // Psion
    [PowerupType.PSION_MAX_SHIELD]: { name: "Shield Capacitor", description: "+89 Max Shield", classId: CLASS_ID.PSION, color: 'darkviolet',
        apply: (player) => { player.maxShieldHp += 89; player.shieldHp += 89; } },
    [PowerupType.PSION_BLADE_DAMAGE_SMALL]: { name: "Focused Psionics", description: "Psi Blades +44 Dmg", classId: CLASS_ID.PSION, color: 'purple',
        apply: (player) => { PSI_BLADE_DAMAGE += 44; const weapon = weapons.find(w=>w.id === WEAPON_ID.PSI_BLADES); if(weapon) { weapon.damageMin = PSI_BLADE_DAMAGE; weapon.damageMax = PSI_BLADE_DAMAGE;} } },
    [PowerupType.PSION_XRAY_RANGE_BONUS]: { name: "Clairvoyance", description: "X-Ray Range +169", classId: CLASS_ID.PSION, color: 'indigo',
        apply: (player) => { PSION_XRAY_RANGE += 169; } }, 
    [PowerupType.PSION_BLADE_SIZE_X2]: { name: "Warp Blades", description: "Psi Blades Size +100%", classId: CLASS_ID.PSION, color: '#DA70D6', 
        apply: (player) => { player.psiBladeSizeMultiplier = Math.min(PSI_BLADE_MAX_SIZE_MULTIPLIER, (player.psiBladeSizeMultiplier || 1.0) * 2.0); PSI_BLADE_RANGE_BASE *= 2.0; PSI_BLADE_RANGE_BASE = Math.min(PSI_BLADE_RANGE_BASE, (69 * 1.10) * PSI_BLADE_MAX_SIZE_MULTIPLIER) /* Cap base range too if multiplier hits cap*/ ;} }, 
    [PowerupType.PSION_BLADE_DAMAGE_LARGE]: { name: "Psionic Overcharge", description: "Psi Blades +37 Dmg", classId: CLASS_ID.PSION, color: '#BA55D3', 
        apply: (player) => { PSI_BLADE_DAMAGE += 37; const weapon = weapons.find(w=>w.id === WEAPON_ID.PSI_BLADES); if(weapon) { weapon.damageMin = PSI_BLADE_DAMAGE; weapon.damageMax = PSI_BLADE_DAMAGE;} } },
    [PowerupType.PSION_SHIELD_PLUS_100]: { name: "Aegis Field", description: "Shield +100", classId: CLASS_ID.PSION, color: '#9932CC', 
        apply: (player) => { player.maxShieldHp += 100; player.shieldHp += 100; } },
    [PowerupType.PSION_SHIELD_REGEN_X3]: { name: "Rapid Recharge", description: "Shield Regen x3", classId: CLASS_ID.PSION, color: '#8A2BE2', 
        apply: (player) => { PSION_SHIELD_REGEN_RATE *= 3; } },
    [PowerupType.PSION_BLADE_SIZE_PLUS_50P]: { name: "Kinetic Edge", description: "Psi Blades Size +50%", classId: CLASS_ID.PSION, color: '#DDA0DD', 
        apply: (player) => { player.psiBladeSizeMultiplier = Math.min(PSI_BLADE_MAX_SIZE_MULTIPLIER, (player.psiBladeSizeMultiplier || 1.0) * 1.5); PSI_BLADE_RANGE_BASE *= 1.5; PSI_BLADE_RANGE_BASE = Math.min(PSI_BLADE_RANGE_BASE, (69 * 1.10) * PSI_BLADE_MAX_SIZE_MULTIPLIER) ;} },
    [PowerupType.PSION_BLADE_SIZE_PLUS_30P]: { name: "Extended Reach", description: "Psi Blades Size +30%", classId: CLASS_ID.PSION, color: '#EE82EE', 
        apply: (player) => { player.psiBladeSizeMultiplier = Math.min(PSI_BLADE_MAX_SIZE_MULTIPLIER, (player.psiBladeSizeMultiplier || 1.0) * 1.3); PSI_BLADE_RANGE_BASE *= 1.3; PSI_BLADE_RANGE_BASE = Math.min(PSI_BLADE_RANGE_BASE, (69 * 1.10) * PSI_BLADE_MAX_SIZE_MULTIPLIER) ;} },
    [PowerupType.PSION_BLAST_PARTICLES_X2]: { name: "Psionic Nova", description: "Psi Blast Particles x2", classId: CLASS_ID.PSION, color: '#FF00FF', 
        apply: (player) => { PSI_BLAST_MAX_PARTICLES *= 2; PSI_BLAST_MIN_PARTICLES = Math.max(1, PSI_BLAST_MIN_PARTICLES * 2); } }, 
    [PowerupType.PSION_BLAST_PARTICLE_LIFE_30P]: { name: "Lingering Echoes", description: "Psi Blast Particle Life +30%", classId: CLASS_ID.PSION, color: '#FF00FF',
        apply: (player) => { PSI_BLAST_MAX_LIFESPAN *= 1.3; } },
    [PowerupType.PSION_BLAST_DMG_40P]: { name: "Destructive Harmonics", description: "Psi Blast Dmg +40%", classId: CLASS_ID.PSION, color: '#800080', 
        apply: (player) => { PSI_BLAST_BASE_DAMAGE_MULTIPLIER = (PSI_BLAST_BASE_DAMAGE_MULTIPLIER || 1.0) * 1.4; } },
    [PowerupType.PSION_BLAST_DMG_20P]: { name: "Focused Blast", description: "Psi Blast Dmg +20%", classId: CLASS_ID.PSION, color: '#4B0082', 
        apply: (player) => { PSI_BLAST_BASE_DAMAGE_MULTIPLIER = (PSI_BLAST_BASE_DAMAGE_MULTIPLIER || 1.0) * 1.2; } },
    [PowerupType.PSION_BLADE_DMG_PLUS_22]: { name: "Sharpened Will", description: "Psi Blades +22 Dmg", classId: CLASS_ID.PSION, color: '#9400D3', 
        apply: (player) => { PSI_BLADE_DAMAGE += 22; const weapon = weapons.find(w=>w.id === WEAPON_ID.PSI_BLADES); if(weapon) { weapon.damageMin = PSI_BLADE_DAMAGE; weapon.damageMax = PSI_BLADE_DAMAGE;} } },
    [PowerupType.PSION_BLADE_DMG_PLUS_11]: { name: "Minor Psionic Edge", description: "Psi Blades +11 Dmg", classId: CLASS_ID.PSION, color: '#9370DB', 
        apply: (player) => { PSI_BLADE_DAMAGE += 11; const weapon = weapons.find(w=>w.id === WEAPON_ID.PSI_BLADES); if(weapon) { weapon.damageMin = PSI_BLADE_DAMAGE; weapon.damageMax = PSI_BLADE_DAMAGE;} } },
    [PowerupType.PSION_BLADE_SIZE_PLUS_20P]: { name: "Slight Reach", description: "Psi Blades Size +20%", classId: CLASS_ID.PSION, color: '#C71585', 
        apply: (player) => { player.psiBladeSizeMultiplier = Math.min(PSI_BLADE_MAX_SIZE_MULTIPLIER, (player.psiBladeSizeMultiplier || 1.0) * 1.2); PSI_BLADE_RANGE_BASE *= 1.2; PSI_BLADE_RANGE_BASE = Math.min(PSI_BLADE_RANGE_BASE, (69 * 1.10) * PSI_BLADE_MAX_SIZE_MULTIPLIER) ;} },
    [PowerupType.PSION_SHIELD_PLUS_69]: { name: "Energy Barrier", description: "Shield +69", classId: CLASS_ID.PSION, color: '#DB7093', 
        apply: (player) => { player.maxShieldHp += 69; player.shieldHp += 69; } },
    [PowerupType.PSION_SHIELD_PLUS_77]: { name: "Fortified Psionics", description: "Shield +77", classId: CLASS_ID.PSION, color: '#C71585', 
        apply: (player) => { player.maxShieldHp += 77; player.shieldHp += 77; } },
    [PowerupType.PSION_SHIELD_REGEN_PLUS_3]: { name: "Quick Charge", description: "Shield Regen +3/s", classId: CLASS_ID.PSION, color: '#D8BFD8', 
        apply: (player) => { PSION_SHIELD_REGEN_RATE += 3; } },
    [PowerupType.PSION_SHIELD_REGEN_PLUS_2]: { name: "Steady Flow", description: "Shield Regen +2/s", classId: CLASS_ID.PSION, color: '#E6E6FA', 
        apply: (player) => { PSION_SHIELD_REGEN_RATE += 2; } },
    [PowerupType.PSION_SHIELD_REGEN_PLUS_1]: { name: "Trickle Charge", description: "Shield Regen +1/s", classId: CLASS_ID.PSION, color: '#FFF0F5', 
        apply: (player) => { PSION_SHIELD_REGEN_RATE += 1; } },
    [PowerupType.PSION_XRAY_PLUS_89]: { name: "Psionic Sight", description: "X-Ray Vision +89", classId: CLASS_ID.PSION, color: '#483D8B', 
        apply: (player) => { PSION_XRAY_RANGE += 89; } },

    // Engineer
    [PowerupType.ENGINEER_EXTRA_DRONES_CLASS]: { name: "Drone Swarm", description: "+3 Drones (Engineer)", classId: CLASS_ID.ENGINEER, color: 'dimgray',
        apply: (player) => { player.queuedPowerupDrones = (player.queuedPowerupDrones || 0) + 3; } },
    [PowerupType.ENGINEER_SMG_MAG]: { name: "SMG Extended Mag", description: "SMG Mag +50", classId: CLASS_ID.ENGINEER, color: 'slategray',
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.ENGINEER_SMG); if(weapon) { weapon.magSize += 50; } } },
    [PowerupType.ENGINEER_TURRET_DMG_X2]: { name: "Armor Piercing Turrets", description: "Turret Damage x2.2", classId: CLASS_ID.ENGINEER, color: '#708090', 
        apply: (player) => { TURRET_HMG_BASE_STATS.damageMin =Math.round(TURRET_HMG_BASE_STATS.damageMin*2.2); TURRET_HMG_BASE_STATS.damageMax =Math.round(TURRET_HMG_BASE_STATS.damageMax*2.2); player.turrets.forEach(t => { if (t.weapon) { t.weapon.damageMin = TURRET_HMG_BASE_STATS.damageMin; t.weapon.damageMax = TURRET_HMG_BASE_STATS.damageMax; } }); } }, 
    [PowerupType.ENGINEER_TURRET_FIRE_RATE_PLUS_50]: { name: "Turret Overclock", description: "Turret Fire Rate +60%", classId: CLASS_ID.ENGINEER, color: '#778899',  
        apply: (player) => { TURRET_HMG_BASE_STATS.rpm = Math.round(TURRET_HMG_BASE_STATS.rpm * 1.6); player.turrets.forEach(t => { if(t.weapon) { t.weapon.rpm = TURRET_HMG_BASE_STATS.rpm; t.fireInterval = 60000 / t.weapon.rpm; } });} },
    [PowerupType.ENGINEER_SMG_DMG_X2]: { name: "SMG High Caliber", description: "SMG Damage +100%", classId: CLASS_ID.ENGINEER, color: '#2F4F4F', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.ENGINEER_SMG); if(weapon) { weapon.damageMin *= 2; weapon.damageMax *= 2;} } },
    [PowerupType.ENGINEER_SMG_DMG_PLUS_50P]: { name: "SMG +P Rounds", description: "SMG Damage +50%", classId: CLASS_ID.ENGINEER, color: '#696969', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.ENGINEER_SMG); if(weapon) { weapon.damageMin = Math.round(weapon.damageMin * 1.5); weapon.damageMax = Math.round(weapon.damageMax * 1.5);} } },
    [PowerupType.ENGINEER_TURRET_DMG_PLUS_3]: { name: "Turret Calibration", description: "Turret Dmg +5", classId: CLASS_ID.ENGINEER, color: 'silver', // Buffed
        apply: (player) => { TURRET_HMG_BASE_STATS.damageMin +=5; TURRET_HMG_BASE_STATS.damageMax +=5; player.turrets.forEach(t => { if (t.weapon) { t.weapon.damageMin = TURRET_HMG_BASE_STATS.damageMin; t.weapon.damageMax = TURRET_HMG_BASE_STATS.damageMax; } }); } },
    [PowerupType.ENGINEER_TURRET_FIRE_RATE_10P]: { name: "Turret Autoloader", description: "Turret Fire Rate +15%", classId: CLASS_ID.ENGINEER, color: 'lightgray', // Buffed
        apply: (player) => { TURRET_HMG_BASE_STATS.rpm = Math.round(TURRET_HMG_BASE_STATS.rpm * 1.15); player.turrets.forEach(t => { if(t.weapon) { t.weapon.rpm = TURRET_HMG_BASE_STATS.rpm; t.fireInterval = 60000 / t.weapon.rpm; } });} },
    [PowerupType.ENGINEER_TURRET_FIRE_RATE_20P]: { name: "Turret Advanced Loader", description: "Turret Fire Rate +30%", classId: CLASS_ID.ENGINEER, color: 'gainsboro', // Buffed
        apply: (player) => { TURRET_HMG_BASE_STATS.rpm = Math.round(TURRET_HMG_BASE_STATS.rpm * 1.3); player.turrets.forEach(t => { if(t.weapon) { t.weapon.rpm = TURRET_HMG_BASE_STATS.rpm; t.fireInterval = 60000 / t.weapon.rpm; } });} },
    [PowerupType.ENGINEER_TURRET_DMG_PLUS_4]: { name: "Heavy Turret Barrels", description: "Turret Dmg +7", classId: CLASS_ID.ENGINEER, color: 'darkgray', // Buffed
        apply: (player) => { TURRET_HMG_BASE_STATS.damageMin +=7; TURRET_HMG_BASE_STATS.damageMax +=7; player.turrets.forEach(t => { if (t.weapon) { t.weapon.damageMin = TURRET_HMG_BASE_STATS.damageMin; t.weapon.damageMax = TURRET_HMG_BASE_STATS.damageMax; } }); } },
    [PowerupType.ENGINEER_SMG_DMG_PLUS_3]: { name: "SMG Fine-Tuning", description: "SMG Dmg +3", classId: CLASS_ID.ENGINEER, color: '#A9A9A9', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.ENGINEER_SMG); if(weapon) { weapon.damageMin += 3; weapon.damageMax += 3;} } },
    [PowerupType.ENGINEER_SMG_DMG_PLUS_2]: { name: "SMG Polished Barrel", description: "SMG Dmg +2", classId: CLASS_ID.ENGINEER, color: '#BEBEBE', 
        apply: (player) => { const weapon = weapons.find(w=>w.id === WEAPON_ID.ENGINEER_SMG); if(weapon) { weapon.damageMin += 2; weapon.damageMax += 2;} } },
    [PowerupType.ENGINEER_DRONE_DMG_PLUS_2]: { name: "Drone Laser Upgrade", description: "Drone Dmg +2", classId: CLASS_ID.ENGINEER, color: 'lightsteelblue',
        apply: (player) => { DRONE_PROJECTILE_DAMAGE += 2; } },
    [PowerupType.ENGINEER_DRONE_DMG_PLUS_1]: { name: "Drone Targeting Chip", description: "Drone Dmg +1", classId: CLASS_ID.ENGINEER, color: 'aliceblue',
        apply: (player) => { DRONE_PROJECTILE_DAMAGE += 1; } },
    [PowerupType.ENGINEER_DRONE_DMG_PLUS_5]: { name: "Drone Heavy Caliber", description: "Drone Dmg +5", classId: CLASS_ID.ENGINEER, color: 'steelblue',
        apply: (player) => { DRONE_PROJECTILE_DAMAGE += 5; } },
    [PowerupType.ENGINEER_DRONE_FIRE_RATE_20P]: { name: "Drone Rapid Fire", description: "Drone Fire Rate +20%", classId: CLASS_ID.ENGINEER, color: 'lightblue',
        apply: (player) => { DRONE_FIRE_RATE = Math.round(DRONE_FIRE_RATE * 1.20); } },
    [PowerupType.ENGINEER_DRONE_FIRE_RATE_10P]: { name: "Drone Quick Cycle", description: "Drone Fire Rate +10%", classId: CLASS_ID.ENGINEER, color: 'powderblue',
        apply: (player) => { DRONE_FIRE_RATE = Math.round(DRONE_FIRE_RATE * 1.10); } },
    [PowerupType.ENGINEER_SMG_DMG_PLUS_5]: { name: "SMG Impact Rounds", description: "SMG Dmg +5", classId: CLASS_ID.ENGINEER, color: 'darkslategray',
        apply: (player) => { const weapon = weapons.find(w => w.id === WEAPON_ID.ENGINEER_SMG); if (weapon) { weapon.damageMin += 5; weapon.damageMax += 5; } } },
    [PowerupType.ENGINEER_DRONE_FIRE_RATE_30P]: { name: "Drone Overclock", description: "Drone Fire Rate +30%", classId: CLASS_ID.ENGINEER, color: 'deepskyblue',
        apply: (player) => { DRONE_FIRE_RATE = Math.round(DRONE_FIRE_RATE * 1.30); } },
    [PowerupType.ENGINEER_TURRET_DMG_PLUS_30P]: { name: "Turret HMG Rounds", description: "Turret Dmg +50%", classId: CLASS_ID.ENGINEER, color: 'gray', // Buffed
        apply: (player) => { TURRET_HMG_BASE_STATS.damageMin = Math.round(TURRET_HMG_BASE_STATS.damageMin * 1.5); TURRET_HMG_BASE_STATS.damageMax = Math.round(TURRET_HMG_BASE_STATS.damageMax * 1.5); player.turrets.forEach(t => { if (t.weapon) { t.weapon.damageMin = TURRET_HMG_BASE_STATS.damageMin; t.weapon.damageMax = TURRET_HMG_BASE_STATS.damageMax; } });} },
    [PowerupType.ENGINEER_TURRET_FIRE_RATE_25P]: { name: "Turret Gatling Mod", description: "Turret Fire Rate +40%", classId: CLASS_ID.ENGINEER, color: 'darkgray', // Buffed
        apply: (player) => { TURRET_HMG_BASE_STATS.rpm = Math.round(TURRET_HMG_BASE_STATS.rpm * 1.40); player.turrets.forEach(t => { if(t.weapon) { t.weapon.rpm = TURRET_HMG_BASE_STATS.rpm; t.fireInterval = 60000 / t.weapon.rpm; } });} },
    
    // Generic
    [PowerupType.GENERIC_BONUS_HP]: { name: "Adrenaline Shot", description: "+20 HP", classId: null, color: 'lightcoral', 
        apply: (player) => { player.maxHp += 20; player.hp += 20; } }, 
    [PowerupType.GENERIC_SPEED_BOOST]: { name: "Stims", description: "+15% Speed", classId: null, color: 'lightgreen', 
        apply: (player) => { player.speedMultiplierBase = (player.speedMultiplierBase || 1.0) * 1.15; player.recalculateSpeeds(); } },
    [PowerupType.GENERIC_EXTRA_DRONES]: { name: "Drone Controller", description: "+2 Drones (Generic)", classId: null, color: 'lightskyblue',
        apply: (player) => { player.queuedPowerupDrones = (player.queuedPowerupDrones || 0) + 2; } }, 
    [PowerupType.GENERIC_EXTRA_MERCS]: { name: "Mercenary Contract", description: "+2 Mercs (Generic)", classId: null, color: 'lightgoldenrodyellow',
        apply: (player) => { player.queuedPowerupMercs = (player.queuedPowerupMercs || 0) + 2; } }, 
    [PowerupType.ADRENAL_OVERCHARGE]: { name: "Adrenal Overcharge", description: "+40 HP & +5% Speed", classId: null, color: '#FFD700', 
        apply: (player) => { player.maxHp += 40; player.hp += 40; player.speedMultiplierBase = (player.speedMultiplierBase || 1.0) * 1.05; player.recalculateSpeeds(); } },
    [PowerupType.GENERIC_EXTRA_DRONES_LARGE]: { name: "Drone Uplink", description: "+4 Drones", classId: null, color: 'deepskyblue',
        apply: (player) => { player.queuedPowerupDrones = (player.queuedPowerupDrones || 0) + 4; } },
    [PowerupType.GENERIC_EXTRA_MERCS_LARGE]: { name: "Mercenary Battalion", description: "+4 Mercs", classId: null, color: 'khaki',
        apply: (player) => { player.queuedPowerupMercs = (player.queuedPowerupMercs || 0) + 4; } },
    [PowerupType.GENERIC_FOG_CLEAR]: { name: "Satellite Scan", description: "Reveal Entire Map", classId: null, color: 'ghostwhite',
        apply: (player) => {
            if (window.level && window.level.fogGrid) {
                for (let y = 0; y < window.level.height; y++) {
                    for (let x = 0; x < window.level.width; x++) {
                        if (window.level.fogGrid[y]?.[x] !== undefined) {
                            window.level.fogGrid[y][x] = FOG_STATE.REVEALED;
                        }
                    }
                }
                if (typeof setMinimapNeedsUpdateFlag === 'function') setMinimapNeedsUpdateFlag(); 
                if (typeof window !== 'undefined') { 
                    window.staticBufferNeedsRedraw = true;
                    if(window.previouslyRevealedStaticTiles) window.previouslyRevealedStaticTiles.clear(); 
                }
            }
        }
    },
    [PowerupType.GENERIC_SPAWN_7_POWERUPS]: { name: "Power Surge", description: "Spawn 7 Powerups", classId: null, color: 'violet', 
        apply: (player) => { if (typeof spawnRandomPowerups === 'function') spawnRandomPowerups(7, player.classData.id); else console.warn("spawnRandomPowerups function not defined."); } },
    [PowerupType.GENERIC_KILL_NEARBY_1000]: { name: "Smart Bomb", description: "Kill Zombies in 1000 Range", classId: null, color: 'salmon',
        apply: (player) => { if (window.zombies) window.zombies.forEach(z => { if (z.hp > 0 && distance(player.x, player.y, z.x, z.y) < 1000) z.takeDamage(z.hp * 2, 'smart_bomb'); }); } }, 
    [PowerupType.GENERIC_SPEED_BOOST_LARGE]: { name: "Hyper Stims", description: "+20% Speed", classId: null, color: '#90EE90',  
        apply: (player) => { player.speedMultiplierBase = (player.speedMultiplierBase || 1.0) * 1.20; player.recalculateSpeeds(); } },
    [PowerupType.GENERIC_KILL_NEARBY_500]: { name: "Concussion Wave", description: "Kill Zombies in 500 Range", classId: null, color: 'lightsalmon',
        apply: (player) => { if (window.zombies) window.zombies.forEach(z => { if (z.hp > 0 && distance(player.x, player.y, z.x, z.y) < 500) z.takeDamage(z.hp * 2, 'concussion_wave'); }); } },
    [PowerupType.GENERIC_SPAWN_4_POWERUPS]: { name: "Supply Drop", description: "Spawn 4 Powerups", classId: null, color: 'plum', 
        apply: (player) => { if (typeof spawnRandomPowerups === 'function') spawnRandomPowerups(4, player.classData.id); else console.warn("spawnRandomPowerups function not defined."); } },
    [PowerupType.GENERIC_SPEED_PLUS_10P]: { name: "Agility Training", description: "+7% Speed", classId: null, color: 'palegreen', 
        apply: (player) => { player.speedMultiplierBase = (player.speedMultiplierBase || 1.0) * 1.07; player.recalculateSpeeds(); } },
    [PowerupType.GENERIC_HP_PLUS_20]: { name: "Medkit", description: "+20 HP", classId: null, color: 'pink',
        apply: (player) => { player.maxHp += 20; player.hp += 20; } },
    [PowerupType.GENERIC_SPAWN_1_POWERUP]: { name: "Lucky Find", description: "Spawn 1 Powerup", classId: null, color: 'thistle',
        apply: (player) => { if (typeof spawnRandomPowerups === 'function') spawnRandomPowerups(1, player.classData.id); } },
    [PowerupType.GENERIC_SPAWN_2_POWERUPS]: { name: "Small Cache", description: "Spawn 2 Powerups", classId: null, color: 'lightpink',
        apply: (player) => { if (typeof spawnRandomPowerups === 'function') spawnRandomPowerups(2, player.classData.id); } },
    [PowerupType.GENERIC_SPAWN_3_POWERUPS]: { name: "Moderate Cache", description: "Spawn 3 Powerups", classId: null, color: 'hotpink',
        apply: (player) => { if (typeof spawnRandomPowerups === 'function') spawnRandomPowerups(3, player.classData.id); } },
    [PowerupType.GENERIC_HP_PLUS_45]: { name: "Trauma Kit", description: "+45 HP", classId: null, color: 'deeppink',
        apply: (player) => { player.maxHp += 45; player.hp += 45; } },
    [PowerupType.GENERIC_EXTRA_DRONES_2]: { name: "Drone Pair", description: "+2 Drones", classId: null, color: 'skyblue',
        apply: (player) => { player.queuedPowerupDrones = (player.queuedPowerupDrones || 0) + 2; } },
    [PowerupType.GENERIC_EXTRA_MERCS_2]: { name: "Reinforcement Team", description: "+2 Mercs", classId: null, color: 'wheat',
        apply: (player) => { player.queuedPowerupMercs = (player.queuedPowerupMercs || 0) + 2; } },
    [PowerupType.GENERIC_TRIGGER_BULLET_TIME]: { name: "Temporal Shift", description: "Trigger Bullet Time", classId: null, color: 'powderblue',
        apply: (player) => {
            if (!player.isBulletTimeActive && typeof RECON_BULLET_TIME_DURATION !== 'undefined' && typeof BULLET_TIME_SCALE !== 'undefined') {
                player.isBulletTimeActive = true;
                player.bulletTimeTimer = RECON_BULLET_TIME_DURATION; 
                window.gameTimeScale = BULLET_TIME_SCALE;
                if (typeof playSound === 'function') playSound('BULLET_TIME_ENTER');
            }
        } },
    [PowerupType.GENERIC_STUN_ALL_4S_A]: { name: "Flashbang Wave", description: "Stun All Enemies for 4s", classId: null, color: 'whitesmoke',
        apply: (player) => { if (typeof playSound === 'function') playSound('PSI_BLAST_FIRE', {volume: 0.7}); if (window.zombies) window.zombies.forEach(z => { if (z.hp > 0 && z.stunTimer !== undefined) z.stunTimer = Math.max(z.stunTimer || 0, 4000); }); } },
    [PowerupType.GENERIC_STUN_ALL_4S_B]: { name: "System Shock", description: "Stun All Enemies for 4s", classId: null, color: '#F8F8FF', 
        apply: (player) => { if (typeof playSound === 'function') playSound('PSI_BLAST_FIRE', {volume: 0.7}); if (window.zombies) window.zombies.forEach(z => { if (z.hp > 0 && z.stunTimer !== undefined) z.stunTimer = Math.max(z.stunTimer || 0, 4000); }); } },
};

// --- Explosive Crate Constants ---
const MAX_EXPLOSIVE_CRATES = 11;
const EXPLOSIVE_CRATE_HP = 1; 
const EXPLOSIVE_CRATE_RADIUS = TILE_SIZE * 0.4;
const EXPLOSIVE_CRATE_EXPLOSION_RADIUS = TILE_SIZE * 2.5;
const EXPLOSIVE_CRATE_EXPLOSION_DAMAGE_MAX = 100;
const EXPLOSIVE_CRATE_EXPLOSION_DAMAGE_MIN = 20;
const EXPLOSIVE_CRATE_EXPLOSION_PARTICLE_COUNT = 30; 
const EXPLOSIVE_CRATE_EXPLOSION_PARTICLE_SPEED = 350;
const EXPLOSIVE_CRATE_EXPLOSION_PARTICLE_LIFESPAN = 0.25;
const EXPLOSIVE_CRATE_PARTICLE_LENGTH = 7;
const EXPLOSIVE_CRATE_PARTICLE_WIDTH = 5;
// --- END OF FILE constants.js ---