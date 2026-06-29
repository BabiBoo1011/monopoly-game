/* ======================================================
   MONOPOLY GO! GAME ENGINE (APP.JS) - CỜ TỶ PHÚ BUBI
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. GAME STATE & CONSTANTS
    // ----------------------------------------------------
    const BOARD_SIZE = 15;
    const TOTAL_TILES = 56;

    const MULTIPLIERS = [1, 2, 3, 5];
    let currentMultiplierIdx = 0;

    let gameState = {
        totalTurns: 15,
        turnsLeft: 15,
        cups: 0,
        shields: 3,
        maxShields: 3,
        currentTileIndex: 0,
        isRolling: false,
        soundEnabled: true
    };

    // Special tiles map (0-indexed)
    const TILE_TYPES = {
        0:  { type: 'start', label: 'GO!', icon: '🚩', desc: 'Xuất phát' },
        
        // Reward Tiles
        4:  { type: 'reward-5', label: '+5 Cúp', icon: '🏆', val: 5 },
        12: { type: 'reward-5', label: '+5 Cúp', icon: '🏆', val: 5 },
        20: { type: 'reward-5', label: '+5 Cúp', icon: '🏆', val: 5 },
        32: { type: 'reward-5', label: '+5 Cúp', icon: '🏆', val: 5 },
        44: { type: 'reward-5', label: '+5 Cúp', icon: '🏆', val: 5 },
        52: { type: 'reward-5', label: '+5 Cúp', icon: '🏆', val: 5 },
        
        8:  { type: 'reward-10', label: '+10 Cúp', icon: '🥇', val: 10 },
        24: { type: 'reward-10', label: '+10 Cúp', icon: '🥇', val: 10 },
        38: { type: 'reward-10', label: '+10 Cúp', icon: '🥇', val: 10 },
        48: { type: 'reward-10', label: '+10 Cúp', icon: '🥇', val: 10 },
        
        16: { type: 'reward-15', label: '+15 Cúp', icon: '👑', val: 15 },
        36: { type: 'reward-15', label: '+15 Cúp', icon: '👑', val: 15 },
        50: { type: 'reward-15', label: '+15 Cúp', icon: '👑', val: 15 },
        
        27: { type: 'reward-20', label: '+20 Cúp', icon: '💎', val: 20 },
        54: { type: 'reward-20', label: '+20 Cúp', icon: '💎', val: 20 },
        
        // Action Tiles
        7:  { type: 'move-back', label: 'Lùi 3 Ô', icon: '⏪', val: -3 },
        26: { type: 'move-back', label: 'Lùi 3 Ô', icon: '⏪', val: -3 },
        45: { type: 'move-back', label: 'Lùi 3 Ô', icon: '⏪', val: -3 },
        
        18: { type: 'move-back', label: 'Lùi 5 Ô', icon: '⏮️', val: -5 },
        39: { type: 'move-back', label: 'Lùi 5 Ô', icon: '⏮️', val: -5 },
        
        10: { type: 'move-forward', label: 'Tiến 3 Ô', icon: '⏩', val: 3 },
        29: { type: 'move-forward', label: 'Tiến 3 Ô', icon: '⏩', val: 3 },
        47: { type: 'move-forward', label: 'Tiến 3 Ô', icon: '⏩', val: 3 },
        
        22: { type: 'move-forward', label: 'Tiến 5 Ô', icon: '⏭️', val: 5 },
        53: { type: 'move-forward', label: 'Tiến 5 Ô', icon: '⏭️', val: 5 },
        
        14: { type: 'back-to-start', label: 'Về GO!', icon: '🔄', val: 'start' },
        42: { type: 'back-to-start', label: 'Về GO!', icon: '🔄', val: 'start' }
    };

    const tilesList = [];

    // ----------------------------------------------------
    // 2. DOM ELEMENTS
    // ----------------------------------------------------
    const boardEl = document.getElementById('board');
    const cupsCountEl = document.getElementById('cups-count');
    const shieldsCountEl = document.getElementById('shields-count');
    const turnsLeftEl = document.getElementById('turns-left');
    const rollBtn = document.getElementById('roll-btn');
    const goDiceCostEl = document.getElementById('go-dice-cost');
    const multiplierBtn = document.getElementById('multiplier-btn');
    const multiplierValEl = document.getElementById('multiplier-val');
    const dice3d = document.getElementById('dice-3d');
    const eventLog = document.getElementById('event-log');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const restartBtn = document.getElementById('restart-btn');
    const quickInfoBtn = document.getElementById('quick-info-btn');
    
    // Modals
    const setupModal = document.getElementById('setup-modal');
    const startGameBtn = document.getElementById('start-game-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const customTurnsInput = document.getElementById('custom-turns-input');
    
    const gameoverModal = document.getElementById('gameover-modal');
    const finalCupsValue = document.getElementById('final-cups-value');
    const ratingMsg = document.getElementById('gameover-rating-msg');
    const playAgainBtn = document.getElementById('play-again-btn');

    let playerTokenEl = null;

    // ----------------------------------------------------
    // 3. SOUND SYNTHESIZER
    // ----------------------------------------------------
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSound(type) {
        if (!gameState.soundEnabled) return;
        try {
            initAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const now = audioCtx.currentTime;

            if (type === 'roll') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
                osc.start(now); osc.stop(now + 0.12);
            } else if (type === 'step') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.07);
                osc.start(now); osc.stop(now + 0.07);
            } else if (type === 'reward') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.07);
                osc.frequency.setValueAtTime(783.99, now + 0.14);
                osc.frequency.setValueAtTime(1046.50, now + 0.21);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
                osc.start(now); osc.stop(now + 0.35);
            } else if (type === 'penalty') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(280, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.25);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                osc.start(now); osc.stop(now + 0.25);
            } else if (type === 'win') {
                [440, 554.37, 659.25, 880].forEach((freq, idx) => {
                    const subOsc = audioCtx.createOscillator();
                    const subGain = audioCtx.createGain();
                    subOsc.connect(subGain); subGain.connect(audioCtx.destination);
                    subOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
                    subGain.gain.setValueAtTime(0.2, now + idx * 0.09);
                    subGain.gain.linearRampToValueAtTime(0.01, now + idx * 0.09 + 0.18);
                    subOsc.start(now + idx * 0.09); subOsc.stop(now + idx * 0.09 + 0.18);
                });
            }
        } catch (e) { console.warn(e); }
    }

    // ----------------------------------------------------
    // 4. BOARD GRID INITIALIZATION
    // ----------------------------------------------------
    function computePerimeterPositions() {
        const positions = [];
        for (let c = 1; c <= 15; c++) positions.push({ r: 1, c: c });
        for (let r = 2; r <= 15; r++) positions.push({ r: r, c: 15 });
        for (let c = 14; c >= 1; c--) positions.push({ r: 15, c: c });
        for (let r = 14; r >= 2; r--) positions.push({ r: r, c: 1 });
        return positions;
    }

    function initBoard() {
        const centerPanel = document.querySelector('.board-center');
        boardEl.innerHTML = '';
        boardEl.appendChild(centerPanel);

        const positions = computePerimeterPositions();

        for (let i = 0; i < TOTAL_TILES; i++) {
            const pos = positions[i];
            const tileData = TILE_TYPES[i] || { type: 'normal', label: `${i}`, icon: '⭐' };
            
            const tileEl = document.createElement('div');
            tileEl.className = `tile ${tileData.type}`;
            tileEl.style.gridRow = pos.r;
            tileEl.style.gridColumn = pos.c;

            tileEl.innerHTML = `
                <span class="tile-number">${i}</span>
                <span class="tile-icon">${tileData.icon}</span>
                <span class="tile-label">${tileData.label}</span>
            `;

            boardEl.appendChild(tileEl);
            tilesList.push({ el: tileEl, pos: pos, data: tileData });
        }

        playerTokenEl = document.createElement('div');
        playerTokenEl.className = 'player-token';
        boardEl.appendChild(playerTokenEl);

        moveTokenToTile(0, false);
    }

    function moveTokenToTile(tileIndex, animateHop = true) {
        const targetTile = tilesList[tileIndex];
        if (!targetTile) return;

        playerTokenEl.style.gridRow = targetTile.pos.r;
        playerTokenEl.style.gridColumn = targetTile.pos.c;

        if (animateHop) {
            playerTokenEl.classList.add('hopping');
            playSound('step');
            setTimeout(() => playerTokenEl.classList.remove('hopping'), 250);
        }
    }

    // ----------------------------------------------------
    // 5. GAME MECHANICS & MULTIPLIER LOGIC
    // ----------------------------------------------------
    function addLog(message, type = 'system') {
        eventLog.innerHTML = `<div class="log-entry ${type}">${message}</div>`;
    }

    function updateHUD() {
        cupsCountEl.textContent = gameState.cups;
        shieldsCountEl.textContent = `${gameState.shields}/${gameState.maxShields}`;
        turnsLeftEl.textContent = gameState.turnsLeft;

        const currentMult = MULTIPLIERS[currentMultiplierIdx];
        multiplierValEl.textContent = `x${currentMult}`;
        goDiceCostEl.textContent = currentMult;

        if (gameState.turnsLeft < currentMult) {
            // Auto adjust multiplier if turns left are less than cost
            let validIdx = 0;
            for (let i = MULTIPLIERS.length - 1; i >= 0; i--) {
                if (MULTIPLIERS[i] <= gameState.turnsLeft) { validIdx = i; break; }
            }
            currentMultiplierIdx = validIdx;
            const adjustedMult = MULTIPLIERS[currentMultiplierIdx];
            multiplierValEl.textContent = `x${adjustedMult}`;
            goDiceCostEl.textContent = adjustedMult;
        }

        rollBtn.disabled = gameState.turnsLeft <= 0 || gameState.isRolling;
    }

    multiplierBtn.addEventListener('click', () => {
        if (gameState.isRolling) return;
        currentMultiplierIdx = (currentMultiplierIdx + 1) % MULTIPLIERS.length;
        updateHUD();
        playSound('step');
    });

    function rollDice() {
        const cost = MULTIPLIERS[currentMultiplierIdx];
        if (gameState.isRolling || gameState.turnsLeft < cost) return;
        
        gameState.isRolling = true;
        rollBtn.disabled = true;
        initAudio();

        // Deduct turns based on multiplier
        gameState.turnsLeft -= cost;
        updateHUD();

        dice3d.classList.add('rolling');
        let rollSoundInterval = setInterval(() => playSound('roll'), 120);

        const diceVal = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
            clearInterval(rollSoundInterval);
            dice3d.classList.remove('rolling');
            dice3d.className = `dice-3d show-${diceVal}`;
            
            addLog(`🎲 Bubi tung được ${diceVal} điểm với Hệ số x${cost}!`, 'move');

            stepByStepMove(diceVal, cost);
        }, 800);
    }

    function stepByStepMove(stepsLeft, mult) {
        if (stepsLeft <= 0) {
            evaluateTileLanding(mult);
            return;
        }

        gameState.currentTileIndex = (gameState.currentTileIndex + 1) % TOTAL_TILES;
        moveTokenToTile(gameState.currentTileIndex, true);

        setTimeout(() => stepByStepMove(stepsLeft - 1, mult), 300);
    }

    function evaluateTileLanding(mult) {
        const currentTile = tilesList[gameState.currentTileIndex].data;
        
        setTimeout(() => {
            if (currentTile.type.startsWith('reward')) {
                const addCups = currentTile.val * mult;
                gameState.cups += addCups;
                updateHUD();
                playSound('reward');
                addLog(`🎉 Tuyệt vời! Bubi nhận +${addCups} Cúp (x${mult})!`, 'reward');
                finishTurn();
            } else if (currentTile.type === 'move-forward') {
                const steps = currentTile.val;
                playSound('reward');
                addLog(`🚀 Tiến thêm ${steps} ô nữa nè!`, 'move');
                setTimeout(() => executeBonusMove(steps, mult), 600);
            } else if (currentTile.type === 'move-back') {
                const steps = Math.abs(currentTile.val);
                playSound('penalty');
                addLog(`⚠️ Ôi không! Bị lùi ${steps} ô!`, 'penalty');
                setTimeout(() => executeBonusMove(-steps, mult), 600);
            } else if (currentTile.type === 'back-to-start') {
                playSound('penalty');
                addLog(`🌀 Bay thẳng về điểm GO!`, 'penalty');
                setTimeout(() => {
                    gameState.currentTileIndex = 0;
                    moveTokenToTile(0, true);
                    finishTurn();
                }, 600);
            } else {
                finishTurn();
            }
        }, 300);
    }

    function executeBonusMove(steps, mult) {
        const dir = steps > 0 ? 1 : -1;
        stepByStepMoveBonus(Math.abs(steps), dir, mult);
    }

    function stepByStepMoveBonus(stepsLeft, direction, mult) {
        if (stepsLeft <= 0) {
            const landedTile = tilesList[gameState.currentTileIndex].data;
            if (landedTile.type.startsWith('reward')) {
                const addCups = landedTile.val * mult;
                gameState.cups += addCups;
                updateHUD();
                playSound('reward');
                addLog(`🏆 Thưởng thêm +${addCups} Cúp!`, 'reward');
            }
            finishTurn();
            return;
        }

        gameState.currentTileIndex = (gameState.currentTileIndex + direction + TOTAL_TILES) % TOTAL_TILES;
        moveTokenToTile(gameState.currentTileIndex, true);

        setTimeout(() => stepByStepMoveBonus(stepsLeft - 1, direction, mult), 300);
    }

    function finishTurn() {
        gameState.isRolling = false;
        updateHUD();

        if (gameState.turnsLeft <= 0) {
            rollBtn.disabled = true;
            setTimeout(showGameOverModal, 1000);
        }
    }

    // ----------------------------------------------------
    // 6. MODALS & EVENTS
    // ----------------------------------------------------
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            customTurnsInput.value = btn.dataset.turns;
        });
    });

    startGameBtn.addEventListener('click', () => {
        let turns = parseInt(customTurnsInput.value, 10);
        if (isNaN(turns) || turns <= 0) turns = 15;

        gameState.totalTurns = turns;
        gameState.turnsLeft = turns;
        gameState.cups = 0;
        gameState.currentTileIndex = 0;
        gameState.isRolling = false;
        currentMultiplierIdx = 0;

        updateHUD();
        moveTokenToTile(0, false);
        setupModal.classList.remove('active');
        addLog(`🔥 Monopoly GO! Sẵn sàng với ${turns} lượt xúc xắc!`, 'system');
    });

    function showGameOverModal() {
        playSound('win');
        finalCupsValue.textContent = gameState.cups;

        let rating = "Bubi chơi đỉnh cao quá!";
        if (gameState.cups >= 150) rating = "🌟 SIÊU TỶ PHÚ! Bubi thống trị Monopoly GO!";
        else if (gameState.cups >= 80) rating = "🔥 XUẤT SẮC! Bubi thu thập bão Cúp Vàng!";

        ratingMsg.textContent = rating;
        gameoverModal.classList.add('active');
    }

    playAgainBtn.addEventListener('click', () => {
        gameoverModal.classList.remove('active');
        setupModal.classList.add('active');
    });

    restartBtn.addEventListener('click', () => setupModal.classList.add('active'));
    soundToggleBtn.addEventListener('click', () => {
        gameState.soundEnabled = !gameState.soundEnabled;
        soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    });

    quickInfoBtn.addEventListener('click', () => {
        addLog(`💡 Mẹo: Dùng nút NHÂN (x2, x3, x5) để nhân gấp nhiều lần Cúp Vàng!`, 'system');
    });

    rollBtn.addEventListener('click', rollDice);

    // Init game
    initBoard();
    updateHUD();
});
