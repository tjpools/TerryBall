// Game State
let selectedNumbers = [];
let selectedPower = null;
let winningNumbers = [];
let winningPower = null;
let currentMode = 'classic'; // 'classic' or 'terrybucks'

// Separate stats for each mode
let stats = {
    classic: {
        gamesPlayed: 0,
        wins: 0
    },
    terrybucks: {
        gamesPlayed: 0,
        wins: 0,
        debt: 0,  // Total TerryBucks owed
        totalPayouts: 0,  // Total amount won from all payouts
        partialWins: 0  // Number of partial wins (non-jackpot payouts)
    }
};

// Initialize the game
function initGame() {
    createNumberButtons();
    setupEventListeners();
    loadStats();
    updateStatsDisplay();
}

// Create number buttons (1-30)
function createNumberButtons() {
    const container = document.getElementById('mainNumbers');
    for (let i = 1; i <= 30; i++) {
        const button = document.createElement('button');
        button.className = 'number-btn';
        button.textContent = i;
        button.dataset.number = i;
        button.addEventListener('click', () => toggleNumber(i, button));
        container.appendChild(button);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mode toggle buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    // Power number buttons
    document.querySelectorAll('.power-btn').forEach(btn => {
        btn.addEventListener('click', () => selectPower(parseInt(btn.dataset.power)));
    });

    // Quick Pick button
    document.getElementById('quickPickBtn').addEventListener('click', quickPick);

    // Clear button
    document.getElementById('clearBtn').addEventListener('click', clearSelection);

    // Play button
    document.getElementById('playBtn').addEventListener('click', playGame);

    // Play Again button
    document.getElementById('playAgainBtn').addEventListener('click', resetGame);

    // Simulation buttons
    document.getElementById('simulate100').addEventListener('click', () => runSimulation(100));
    document.getElementById('simulate1000').addEventListener('click', () => runSimulation(1000));
    document.getElementById('simulate10000').addEventListener('click', () => runSimulation(10000));

    // Reset stats button
    document.getElementById('resetStats').addEventListener('click', resetAllStats);

    // Cost calculator
    document.getElementById('costPerPlay').addEventListener('input', updateCostCalculator);
}

// Initialize cost calculator
function updateCostCalculator() {
    const costPerPlay = parseFloat(document.getElementById('costPerPlay').value) || 2;
    const totalCombinations = 285012;
    const totalCost = costPerPlay * totalCombinations;
    
    document.getElementById('totalCost').textContent = `$${totalCost.toLocaleString()}`;
    document.getElementById('breakEven').textContent = `$${totalCost.toLocaleString()}`;
}

// Toggle number selection
function toggleNumber(number, button) {
    const index = selectedNumbers.indexOf(number);
    
    if (index > -1) {
        // Deselect
        selectedNumbers.splice(index, 1);
        button.classList.remove('selected');
    } else {
        // Select if less than 5 numbers
        if (selectedNumbers.length < 5) {
            selectedNumbers.push(number);
            button.classList.add('selected');
        }
    }
    
    // Update disabled state for other buttons
    updateNumberButtons();
    updateSelectedDisplay();
}

// Update number buttons state
function updateNumberButtons() {
    const buttons = document.querySelectorAll('.number-btn');
    buttons.forEach(btn => {
        const number = parseInt(btn.dataset.number);
        if (selectedNumbers.length >= 5 && !selectedNumbers.includes(number)) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
}

// Update selected numbers display
function updateSelectedDisplay() {
    const display = document.getElementById('selectedMain');
    if (selectedNumbers.length === 0) {
        display.textContent = 'Select 5 numbers';
    } else {
        const sorted = [...selectedNumbers].sort((a, b) => a - b);
        display.textContent = sorted.join(', ');
    }
}

// Select power number
function selectPower(power) {
    selectedPower = power;
    
    // Update button states
    document.querySelectorAll('.power-btn').forEach(btn => {
        if (parseInt(btn.dataset.power) === power) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    // Update display
    document.getElementById('selectedPower').textContent = power;
}

// Quick Pick - randomly select numbers
function quickPick() {
    // Clear current selection
    clearSelection();
    
    // Generate 5 random unique numbers
    const numbers = [];
    while (numbers.length < 5) {
        const num = Math.floor(Math.random() * 30) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    
    // Select the numbers
    selectedNumbers = numbers;
    numbers.forEach(num => {
        const button = document.querySelector(`[data-number="${num}"]`);
        button.classList.add('selected');
    });
    
    // Select random power number
    const power = Math.floor(Math.random() * 2) + 1;
    selectPower(power);
    
    updateNumberButtons();
    updateSelectedDisplay();
}

// Clear selection
function clearSelection() {
    // Clear main numbers
    selectedNumbers = [];
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.classList.remove('selected', 'disabled');
    });
    updateSelectedDisplay();
    
    // Clear power number
    selectedPower = null;
    document.querySelectorAll('.power-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('selectedPower').textContent = 'Not selected';
}

// Generate winning numbers
function generateWinningNumbers() {
    const numbers = [];
    while (numbers.length < 5) {
        const num = Math.floor(Math.random() * 30) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    winningNumbers = numbers.sort((a, b) => a - b);
    winningPower = Math.floor(Math.random() * 2) + 1;
}

// Check match results (returns detailed match info)
function checkWin() {
    const matchingNumbers = selectedNumbers.filter(num => winningNumbers.includes(num)).length;
    const matchingPower = selectedPower === winningPower;
    
    return {
        matches: matchingNumbers,
        powerMatch: matchingPower,
        isJackpot: matchingNumbers === 5 && matchingPower
    };
}

// Calculate payout based on matches (TerryBucks mode)
function calculatePayout(matchResult) {
    const { matches, powerMatch } = matchResult;
    
    // Graduated payout structure
    if (matches === 5 && powerMatch) return 100000;  // Jackpot!
    if (matches === 5 && !powerMatch) return 100;    // So close!
    if (matches === 4 && powerMatch) return 50;      // Almost there!
    if (matches === 4 && !powerMatch) return 10;     // Getting close!
    if (matches === 3 && powerMatch) return 5;       // Making progress!
    if (matches === 3 && !powerMatch) return 2;      // Break even!
    if (matches === 2 && powerMatch) return 1;       // Half back!
    if (matches === 1 && powerMatch) return 0.50;    // Something!
    
    return 0; // No payout
}

// Generate enticing result message
function getResultMessage(matchResult, payout, mode) {
    const { matches, powerMatch } = matchResult;
    
    if (mode === 'classic') {
        if (matchResult.isJackpot) {
            return '🎉 JACKPOT! YOU WIN! 🎉';
        }
        const powerMsg = powerMatch ? ' Power matched!' : '';
        return `No win. Matched ${matches}/5 numbers.${powerMsg}`;
    }
    
    // TerryBucks mode - more psychological
    if (matchResult.isJackpot) {
        return '🎉 JACKPOT! $100,000! 🎉<br><small>Now paying back your debt...</small>';
    }
    
    if (payout > 0) {
        const messages = {
            100: '💰 <strong>5 numbers!</strong> So close to the jackpot! Just needed the power!',
            50: '🎯 <strong>4 numbers + Power!</strong> Almost had it! Keep playing!',
            10: '✨ <strong>4 numbers!</strong> You\'re getting hot! One more number next time!',
            5: '⭐ <strong>3 numbers + Power!</strong> You\'re in the zone! Getting closer!',
            2: '💚 <strong>3 numbers!</strong> Break even on this play! Momentum building!',
            1: '🔥 <strong>2 numbers + Power!</strong> Half your money back! You\'re feeling it!',
            0.5: '💫 <strong>Power match!</strong> Something back! Lady Luck is watching!'
        };
        return messages[payout] + `<br><small>Won $${payout.toFixed(2)}</small>`;
    }
    
    // No payout - but still encouraging!
    const powerMsg = powerMatch ? ' and the Power!' : '';
    if (matches === 2) return `💭 Matched ${matches}${powerMsg}. So close to a payout!`;
    if (matches === 1) return `🎱 Matched ${matches}${powerMsg}. Just need a few more!`;
    return `🎲 No matches this time. Next one could be the big one!`;
}

// Switch game mode
function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update mode description
    const modeDesc = document.getElementById('modeDescription');
    if (mode === 'classic') {
        modeDesc.innerHTML = '<p>🎯 <strong>Classic Mode:</strong> Play the odds. Experience pure probability. Track your results.</p>';
    } else {
        modeDesc.innerHTML = "<p>💰 <strong>TerryBucks Mode:</strong> Each play costs $2 (borrowed as debt). <strong>Partial wins pay back debt:</strong> Match 5+Power=$100K, 5 alone=$100, 4+Power=$50, 4 alone=$10, 3+Power=$5, 3 alone=$2, 2+Power=$1, 1+Power=$0.50. Feel like you're winning? Check your debt. 🎰</p>";
    }
    
    // Show/hide TerryBucks panel
    const terryBucksPanel = document.getElementById('terryBucksPanel');
    if (terryBucksPanel) {
        terryBucksPanel.style.display = mode === 'terrybucks' ? 'block' : 'none';
    }
    
    // Update stats display
    updateStatsDisplay();
    
    // Clear selection for fresh start
    clearSelection();
    document.getElementById('results').style.display = 'none';
}

// Play the game
function playGame() {
    // Validate selection
    if (selectedNumbers.length !== 5) {
        alert('Please select exactly 5 numbers!');
        return;
    }
    
    if (selectedPower === null) {
        alert('Please select a power number!');
        return;
    }
    
    // Generate winning numbers
    generateWinningNumbers();
    
    // Check for win
    const matchResult = checkWin();
    
    // Update stats based on mode
    if (currentMode === 'classic') {
        stats.classic.gamesPlayed++;
        if (matchResult.isJackpot) {
            stats.classic.wins++;
        }
    } else {
        // TerryBucks mode - graduated payouts
        stats.terrybucks.gamesPlayed++;
        stats.terrybucks.debt += 2; // Add $2 debt per play
        
        // Calculate payout
        const payout = calculatePayout(matchResult);
        
        if (payout > 0) {
            // Track total payouts
            stats.terrybucks.totalPayouts += payout;
            
            // Got a payout - reduce debt
            stats.terrybucks.debt = Math.max(0, stats.terrybucks.debt - payout);
            
            // Track jackpot wins and partial wins separately
            if (matchResult.isJackpot) {
                stats.terrybucks.wins++;
            } else {
                stats.terrybucks.partialWins++;
            }
        }
    }
    
    saveStats();
    updateStatsDisplay();
    
    // Display results
    displayResults(matchResult);
}

// Display results
function displayResults(matchResult) {
    const resultsSection = document.getElementById('results');
    const winningMainDiv = document.getElementById('winningMain');
    const winningPowerDiv = document.getElementById('winningPower');
    const messageDiv = document.getElementById('resultMessage');
    
    // Clear previous results
    winningMainDiv.innerHTML = '';
    winningPowerDiv.innerHTML = '';
    
    // Display winning main numbers
    winningNumbers.forEach(num => {
        const ball = document.createElement('div');
        ball.className = 'winning-ball';
        if (selectedNumbers.includes(num)) {
            ball.classList.add('match');
        }
        ball.textContent = num;
        winningMainDiv.appendChild(ball);
    });
    
    // Display winning power number
    const powerLabel = document.createElement('span');
    powerLabel.textContent = 'Power:';
    powerLabel.style.fontSize = '1.2em';
    powerLabel.style.fontWeight = 'bold';
    
    const powerBall = document.createElement('div');
    powerBall.className = 'winning-ball power';
    if (selectedPower === winningPower) {
        powerBall.classList.add('match');
    }
    powerBall.textContent = winningPower;
    
    winningPowerDiv.appendChild(powerLabel);
    winningPowerDiv.appendChild(powerBall);
    
    // Calculate payout for message
    const payout = currentMode === 'terrybucks' ? calculatePayout(matchResult) : 0;
    
    // Display message
    const message = getResultMessage(matchResult, payout, currentMode);
    
    if (matchResult.isJackpot) {
        messageDiv.className = 'result-message winner';
    } else if (payout > 0 && currentMode === 'terrybucks') {
        messageDiv.className = 'result-message partial-win';
    } else {
        messageDiv.className = 'result-message loser';
    }
    
    messageDiv.innerHTML = message;
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Reset game for new round
function resetGame() {
    clearSelection();
    document.getElementById('results').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('powerballStats', JSON.stringify(stats));
}

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('powerballStats');
    if (saved) {
        const loaded = JSON.parse(saved);
        // Handle old format or new format
        if (loaded.classic && loaded.terrybucks) {
            stats = loaded;
        } else {
            // Old format - migrate to classic mode
            stats.classic = {
                gamesPlayed: loaded.gamesPlayed || 0,
                wins: loaded.wins || 0
            };
        }
    }
}

// Update stats display
function updateStatsDisplay() {
    const modeStats = currentMode === 'classic' ? stats.classic : stats.terrybucks;
    
    document.getElementById('gamesPlayed').textContent = modeStats.gamesPlayed;
    document.getElementById('wins').textContent = modeStats.wins;
    
    const winRate = modeStats.gamesPlayed > 0 
        ? ((modeStats.wins / modeStats.gamesPlayed) * 100).toFixed(4) 
        : 0;
    document.getElementById('winRate').textContent = winRate + '%';

    // Calculate expected wins
    const expectedWins = modeStats.gamesPlayed > 0 
        ? (modeStats.gamesPlayed / 285012).toFixed(4)
        : 0;
    document.getElementById('expectedWins').textContent = expectedWins;

    // Calculate money spent (Classic) or debt (TerryBucks)
    const moneySpent = modeStats.gamesPlayed * 2;
    document.getElementById('moneySpent').textContent = `$${moneySpent.toLocaleString()}`;

    // Calculate deviation
    const deviation = modeStats.gamesPlayed > 0
        ? (modeStats.wins - parseFloat(expectedWins)).toFixed(4)
        : 0;
    document.getElementById('deviation').textContent = deviation;
    
    // Update TerryBucks-specific display if in that mode
    if (currentMode === 'terrybucks') {
        updateTerryBucksDisplay();
    }
}

// Update TerryBucks specific display
function updateTerryBucksDisplay() {
    const tbStats = stats.terrybucks;
    const debtDisplay = document.getElementById('terryBucksDebt');
    const netDisplay = document.getElementById('terryBucksNet');
    const warningDisplay = document.getElementById('terryBucksWarning');
    
    if (debtDisplay) {
        debtDisplay.textContent = `$${tbStats.debt.toFixed(2)}`;
    }
    
    if (netDisplay) {
        // Net = Total payouts - Total spent
        const totalSpent = tbStats.gamesPlayed * 2;
        const netValue = tbStats.totalPayouts - totalSpent;
        netDisplay.textContent = `$${netValue.toFixed(2)}`;
        netDisplay.className = netValue >= 0 ? 'terrybucks-positive' : 'terrybucks-negative';
    }
    
    // Show warnings at different thresholds with psychological messaging
    if (warningDisplay) {
        let warning = '';
        const totalSpent = tbStats.gamesPlayed * 2;
        const winRate = tbStats.partialWins > 0 ? ((tbStats.partialWins / tbStats.gamesPlayed) * 100).toFixed(1) : 0;
        
        if (tbStats.debt >= 10000) {
            warning = `⚠️ <strong>Deep in the hole!</strong> Debt: $${tbStats.debt.toFixed(2)}. You've "won" ${tbStats.partialWins} times (${winRate}% win rate!) but still owe money. See the trap?`;
        } else if (tbStats.debt >= 1000) {
            warning = `⚠️ <strong>The Loop Tightens:</strong> $${tbStats.debt.toFixed(2)} debt despite ${tbStats.partialWins} "wins". Each payout feels like progress... but check the math.`;
        } else if (tbStats.debt >= 100) {
            warning = `💭 <strong>Winning but losing:</strong> You've won ${tbStats.partialWins}x, collected $${tbStats.totalPayouts.toFixed(2)}, but owe $${tbStats.debt.toFixed(2)}. The house edge is subtle.`;
        } else if (tbStats.partialWins > 0 && tbStats.debt > 0) {
            warning = `🎰 <strong>Feeling lucky?</strong> ${tbStats.partialWins} payouts totaling $${tbStats.totalPayouts.toFixed(2)}, but you're still $${tbStats.debt.toFixed(2)} in debt. That's the magic!`;
        } else if (tbStats.gamesPlayed > 0) {
            warning = `💰 Current debt: $${tbStats.debt.toFixed(2)}. The trap is subtle at first... wait for the "wins".`;
        }
        
        warningDisplay.innerHTML = warning;
    }
}

// Run simulation
async function runSimulation(numGames) {
    const buttons = document.querySelectorAll('.btn-analytics');
    buttons.forEach(btn => btn.disabled = true);

    let wins = 0;
    const batchSize = 1000;
    const batches = Math.ceil(numGames / batchSize);

    for (let batch = 0; batch < batches; batch++) {
        const gamesInBatch = Math.min(batchSize, numGames - batch * batchSize);
        
        for (let i = 0; i < gamesInBatch; i++) {
            // Generate random player selection
            const playerNumbers = [];
            while (playerNumbers.length < 5) {
                const num = Math.floor(Math.random() * 30) + 1;
                if (!playerNumbers.includes(num)) {
                    playerNumbers.push(num);
                }
            }
            const playerPower = Math.floor(Math.random() * 2) + 1;

            // Generate winning numbers
            const winNumbers = [];
            while (winNumbers.length < 5) {
                const num = Math.floor(Math.random() * 30) + 1;
                if (!winNumbers.includes(num)) {
                    winNumbers.push(num);
                }
            }
            const winPower = Math.floor(Math.random() * 2) + 1;

            // Check for win
            const matchingNumbers = playerNumbers.filter(num => winNumbers.includes(num)).length;
            if (matchingNumbers === 5 && playerPower === winPower) {
                wins++;
            }
        }

        // Allow UI to update between batches
        if (batch < batches - 1) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    displaySimulationResults(numGames, wins);
    buttons.forEach(btn => btn.disabled = false);
}

// Display simulation results
function displaySimulationResults(numGames, wins) {
    const resultsSection = document.getElementById('simulationResults');
    const expectedWins = numGames / 285012;
    const actualWinRate = numGames > 0 ? ((wins / numGames) * 100).toFixed(6) : 0;
    const expectedWinRate = (1 / 285012 * 100).toFixed(6);

    document.getElementById('simGames').textContent = numGames.toLocaleString();
    document.getElementById('simWins').textContent = wins;
    document.getElementById('simWinRate').textContent = actualWinRate + '%';
    document.getElementById('simExpected').textContent = expectedWins.toFixed(4);

    // Generate insight
    const insightDiv = document.getElementById('probabilityInsight');
    let insight = '';

    if (wins === 0) {
        insight = `<strong>Zero wins!</strong> This is ${wins === 0 && numGames < 100000 ? 'quite normal' : 'expected'} behavior. `;
        insight += `With ${numGames.toLocaleString()} plays, you'd expect about ${expectedWins.toFixed(2)} wins. `;
        insight += `The randomness means sometimes you'll get 0, sometimes more than expected.`;
    } else if (wins > expectedWins * 1.5) {
        insight = `<strong>Lucky simulation!</strong> You got ${wins} wins vs expected ${expectedWins.toFixed(2)}. `;
        insight += `This is statistical variance. Run it again and you'll likely see different results.`;
    } else {
        insight = `<strong>Results align with theory!</strong> ${wins} wins is close to the expected ${expectedWins.toFixed(2)}. `;
        insight += `Your actual win rate of ${actualWinRate}% is near the theoretical ${expectedWinRate}%.`;
    }

    insight += `<br><br><em>Key lesson: Even with ${numGames.toLocaleString()} plays, wins are rare. The combinatorial engine (285,012 possibilities) ensures this.</em>`;

    insightDiv.innerHTML = insight;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Reset all statistics
function resetAllStats() {
    const modeName = currentMode === 'classic' ? 'Classic Mode' : 'TerryBucks Mode';
    if (confirm(`Are you sure you want to reset ${modeName} statistics? This cannot be undone.`)) {
        if (currentMode === 'classic') {
            stats.classic = { gamesPlayed: 0, wins: 0 };
        } else {
            stats.terrybucks = { gamesPlayed: 0, wins: 0, debt: 0, totalPayouts: 0, partialWins: 0 };
        }
        saveStats();
        updateStatsDisplay();
        
        // Hide simulation results
        document.getElementById('simulationResults').style.display = 'none';
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    updateCostCalculator();
});
