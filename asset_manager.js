// --- START OF FILE asset_manager.js ---
window.AssetManager = {
    assets: {}, // For assets it loads directly (like audio)
    queue: [],  // For assets it loads directly
    externalTasks: [], // For tasks like your image loaders
    successCount: 0,
    errorCount: 0,
    externalTasksCompleted: 0,
    downloadAllCallback: null,
    progressCallback: null,

    // For assets AssetManager loads itself (e.g., audio)
    addAsset(path, type = 'image', alias = null) {
        this.queue.push({ path, type, alias: alias || path });
    },

    // For registering external loading processes
    addExternalLoadingTask(taskName) {
        this.externalTasks.push({ name: taskName, completed: false });
    },

    completeExternalLoadingTask(taskName) {
        const task = this.externalTasks.find(t => t.name === taskName);
        if (task && !task.completed) {
            task.completed = true;
            this.externalTasksCompleted++;
            console.log(`AssetManager: External task COMPLETED - ${taskName}. Status: ${this.externalTasksCompleted}/${this.externalTasks.length}`);
            this.updateProgress();
            this.checkIfAllDone();
        } else if (task && task.completed) {
            console.warn(`AssetManager: External task ${taskName} was already marked completed.`);
        } else {
            console.warn(`AssetManager: Attempted to complete unknown external task - ${taskName}`);
        }
    },

    updateProgress() {
        if (this.progressCallback) {
            const directQueueTotal = this.queue.length;
            const externalTasksTotal = this.externalTasks.length;
            const totalItems = directQueueTotal + externalTasksTotal;
            const completedItems = this.successCount + this.errorCount + this.externalTasksCompleted;
            // console.log(`AssetManager Progress: Direct ${this.successCount + this.errorCount}/${directQueueTotal}, External ${this.externalTasksCompleted}/${externalTasksTotal}`);
            this.progressCallback(completedItems, totalItems);
        }
    },

    downloadAll(callbackProgress, callbackDone) {
        this.downloadAllCallback = callbackDone;
        this.progressCallback = callbackProgress;
        console.log(`AssetManager: downloadAll called. Direct queue: ${this.queue.length}, External tasks: ${this.externalTasks.length}`);

        this.updateProgress(); // Initial progress update

        if (this.queue.length === 0 && this.externalTasks.length === 0) {
            if(this.downloadAllCallback) {
                console.log("AssetManager: Nothing to load, calling downloadAllCallback immediately.");
                this.downloadAllCallback();
                this.downloadAllCallback = null; // Prevent multiple calls
            }
            return;
        }

        // Start loading direct assets
        if (this.queue.length > 0) {
            this.queue.forEach(assetInfo => {
                if (assetInfo.type === 'image') {
                    const img = new Image();
                    img.addEventListener("load", () => {
                        console.log("AssetManager: Loaded direct asset (img): " + assetInfo.path);
                        this.successCount += 1;
                        this.assets[assetInfo.alias] = img;
                        this.updateProgress();
                        this.checkIfAllDone();
                    });
                    img.addEventListener("error", (e) => {
                        console.error("AssetManager: Error loading direct asset (img): " + assetInfo.path + ". Attempted src: " + img.src + ". Event: ", e);
                        this.errorCount += 1;
                        this.assets[assetInfo.alias] = null;
                        this.updateProgress();
                        this.checkIfAllDone();
                    });
                    console.log(`AssetManager: Assigning src for direct image ${assetInfo.alias}: ${assetInfo.path}`);
                    img.src = assetInfo.path;
                } else if (assetInfo.type === 'audio') {
                    const audio = new Audio();
                    audio.addEventListener("canplaythrough", () => {
                        console.log("AssetManager: Loaded direct asset (audio): " + assetInfo.path);
                        this.successCount += 1;
                        this.assets[assetInfo.alias] = audio;
                        this.updateProgress();
                        this.checkIfAllDone();
                    });
                     audio.addEventListener("error", (e) => {
                        console.error("AssetManager: Error loading direct asset (audio): " + assetInfo.path + ". Event: ", e);
                        this.errorCount += 1;
                        this.assets[assetInfo.alias] = null;
                        this.updateProgress();
                        this.checkIfAllDone();
                    });
                    audio.preload = "auto"; // Important for reliable loading
                    console.log(`AssetManager: Assigning src for direct audio ${assetInfo.alias}: ${assetInfo.path}`);
                    audio.src = assetInfo.path;
                    audio.load(); // Explicitly call load for Audio elements
                }
            });
        }
        // Important: Check if all done even if only external tasks remain or if direct queue was empty initially.
        // This handles the case where external tasks might complete before downloadAll is even fully processed
        // or if there were no direct assets to begin with.
        this.checkIfAllDone();
    },

    isDone() {
        const directAssetsDone = (this.queue.length === this.successCount + this.errorCount);
        const externalTasksDone = (this.externalTasks.length === this.externalTasksCompleted);
        return directAssetsDone && externalTasksDone;
    },

    checkIfAllDone() {
        // console.log(`AssetManager status check: Direct ${this.successCount + this.errorCount}/${this.queue.length}, External ${this.externalTasksCompleted}/${this.externalTasks.length}. IsDone: ${this.isDone()}`);
        if (this.isDone() && this.downloadAllCallback) {
            console.log("AssetManager: All tasks and assets reported complete. Firing main callback.");
            this.downloadAllCallback();
            this.downloadAllCallback = null; // Prevent multiple calls
        }
    },

    getAsset(alias) {
        if (this.assets[alias]) {
            return this.assets[alias];
        }
        // console.warn(`Asset with alias "${alias}" not found in AssetManager direct assets.`);
        return null;
    },

    reset() {
         this.assets = {};
         this.queue = [];
         this.externalTasks = [];
         this.successCount = 0;
         this.errorCount = 0;
         this.externalTasksCompleted = 0;
         this.downloadAllCallback = null;
         this.progressCallback = null;
         console.log("AssetManager: Reset.");
    }
};
// --- END OF FILE asset_manager.js ---