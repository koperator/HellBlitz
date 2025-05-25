// --- START OF FILE sounds.js ---

// Global object to hold all loaded sound effects
window.gameSounds = {};

// Sound definitions: { alias: { path: "path/to/sound.wav", baseVolume: 1.0 } }
// Paths are now flat (no "sounds/" prefix) and all lowercase.
const SOUND_DEFINITIONS = {
    // Player Weapons
    MACHINEGUN_SHOOT: { path: "machinegunshoot01.wav", baseVolume: 0.289 },
    SHOTGUN_SHOOT:    { path: "shotgunshoot01.wav", baseVolume: 0.44525 },
    RAILGUN_SHOOT:    { path: "railgunshoot01.wav", baseVolume: 0.5625 },
    FLAMETHROWER_LOOP:{ path: "flamethrowerloop01.wav", baseVolume: 0.95 },
    FLAMETHROWER_START:{ path: "flamethrowerstart01.wav", baseVolume: 0.9 },
    FLAMETHROWER_END: { path: "flamethrowerend01.wav", baseVolume: 0.9 },
    PSI_BLADE_SWING:  { path: "psibladeswing01.wav", baseVolume: 0.69375 },
    SMG_SHOOT:        { path: "smgshoot01.wav", baseVolume: 0.49 },

    // Player Abilities
    GRENADE_EXPLODE:  { path: "grenadeexplode01.wav", baseVolume: 0.58 },
    GRENADE_THROW:    { path: "grenadethrow01.wav", baseVolume: 0.12 },
    RPG_SHOOT:        { path: "rpgshoot01.wav", baseVolume: 0.33 },
    RPG_EXPLODE:      { path: "rpgexplode01.wav", baseVolume: 0.6 },
    DASH:             { path: "dash01.wav", baseVolume: 0.78125 },
    BULLET_TIME_ENTER:{ path: "bullettimeenter01.wav", baseVolume: 0.63875 },
    BULLET_TIME_EXIT: { path: "bullettimeexit01.wav", baseVolume: 0.621875 },
    PSI_BLAST_CHARGE: { path: "psiblastcharge01.wav", baseVolume: 0.81875 },
    PSI_BLAST_FIRE:   { path: "psiblastfire01.wav", baseVolume: 0.6875 },
    TURRET_DEPLOY:    { path: "turretdeploy01.wav", baseVolume: 1.0 },
    TURRET_RECALL:    { path: "turretrecall01.wav", baseVolume: 1.0 },
    TURRET_DESTROYED: { path: "turretdestroyed01.wav", baseVolume: 0.6875 },

    // Other Player Actions
    RELOAD_START:     { path: "reloadstart01.wav", baseVolume: 0.5625 },
    RELOAD_END:       { path: "reloadend01.wav", baseVolume: 0.5625 },
    PLAYER_HURT:      { path: "playerhurt01.wav", baseVolume: 0.59375 },
    PLAYER_DEATH:     { path: "playerdeath01.wav", baseVolume: 0.705625 },

    // Mercenary & Drone
    MERC_SMG_SHOOT:   { path: "mercsmgshoot01.wav", baseVolume: 0.35625 },
    DRONE_SHOOT:      { path: "droneshoot01.wav", baseVolume: 0.29375 },
    DRONE_DESTROYED:  { path: "dronedestroyed01.wav", baseVolume: 0.75 },

    // Turret (Player owned HMG)
    TURRET_HMG_SHOOT: { path: "turrethmgshoot01.wav", baseVolume: 0.53125 },

    // Enemy Sounds
    BLOATER_EXPLODE:  { path: "bloaterexplode01.wav", baseVolume: 0.625 },
    SCREAMER_SCREAM:  { path: "screamerscream01.wav", baseVolume: 0.675 },
    SPITTER_SPIT:     { path: "spitterspit01.wav", baseVolume: 0.53125 },

    // UI & General
    POWERUP_PICKUP:   { path: "powerup.mp3", baseVolume: 0.71875 }, // was _powerup.mp3
    GAME_START:       { path: "gamestart01.wav", baseVolume: 0.63125 },
    LEVEL_WIN:        { path: "levelwin01.wav", baseVolume: 0.65625 },
    UI_CLICK:         { path: "uiclick01.wav", baseVolume: 0.7 }, // Example, add actual file
    UI_SELECT:        { path: "uiselect01.wav", baseVolume: 0.7 },// Example, add actual file


    BACKGROUND_MUSIC: { path: "music.mp3", baseVolume: 0.15 }, // was _music.mp3
};


function loadAllGameSounds() {
    if (typeof AssetManager === 'undefined') {
        console.error("Sound loading requires AssetManager to be defined.");
        return;
    }
    console.log("Queueing game sounds for loading...");
    for (const alias in SOUND_DEFINITIONS) {
        AssetManager.addAsset(SOUND_DEFINITIONS[alias].path, 'audio', alias);
    }
}

function assignLoadedGameSounds() {
    if (typeof AssetManager === 'undefined') {
        console.error("Sound assignment requires AssetManager to be defined.");
        return;
    }
    console.log("Assigning loaded game sounds...");
    for (const alias in SOUND_DEFINITIONS) {
        const asset = AssetManager.getAsset(alias);
        if (asset) {
            window.gameSounds[alias] = asset;
            window.gameSounds[alias].baseVolume = SOUND_DEFINITIONS[alias].baseVolume;
        } else {
            console.warn(`Sound asset for alias "${alias}" (path: ${SOUND_DEFINITIONS[alias].path}) not found in AssetManager after loading.`);
            window.gameSounds[alias] = null;
        }
    }
}

function playSound(alias, options = {}) {
    if (window.gameSounds && window.gameSounds[alias]) {
        const sound = window.gameSounds[alias];
        
        // For looping sounds, we might not want to reset currentTime if it's already playing
        if (!sound.loop || sound.paused || sound.currentTime === 0 || sound.ended) {
            sound.currentTime = 0;
        }


        const baseVol = sound.baseVolume !== undefined ? sound.baseVolume : 1.0;
        const optionVol = options.volume !== undefined ? options.volume : 1.0;
        sound.volume = baseVol * optionVol;
        sound.volume = Math.max(0, Math.min(1, sound.volume));

        sound.loop = options.loop !== undefined ? options.loop : false;

        // Check if sound is already playing and is supposed to loop; if so, don't restart
        if (sound.loop && !sound.paused && sound.currentTime > 0) {
            // It's already playing and looping, do nothing unless volume changed
            // The volume set above will apply on next loop iteration or immediately.
        } else {
            sound.play().catch(e => {
                if (e.name === 'NotAllowedError') {
                    // console.warn(`Sound playback for "${alias}" prevented by autoplay policy.`);
                } else {
                    // console.warn(`Error playing sound "${alias}":`, e); // Less verbose
                }
            });
        }
        return sound;
    } else {
        // console.warn(`Sound with alias "${alias}" not found or not loaded.`);
        return null;
    }
}

console.log("sounds.js loaded.");
// --- END OF FILE sounds.js ---