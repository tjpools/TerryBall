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
        netWinnings: 0  // Total winnings minus debt
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

// Check if player wins
function checkWin() {
    const matchingNumbers = selectedNumbers.filter(num => winningNumbers.includes(num)).length;
    const matchingPower = selectedPower === winningPower;
    
    return matchingNumbers === 5 && matchingPower;
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
        modeDesc.innerHTML = '<p>💰 <strong>TerryBucks Mode:</strong> Every play costs $2, but you "borrow" it as TerryBucks debt. Win $100,000, but you must pay back your debt first. Can you escape the leverage trap?</p>';
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
    const isWinner = checkWin();
    
    // Update stats based on mode
    if (currentMode === 'classic') {
        stats.classic.gamesPlayed++;
        if (isWinner) {
            stats.classic.wins++;
        }
    } else {
        // TerryBucks mode
        stats.terrybucks.gamesPlayed++;
        stats.terrybucks.debt += 2; // Add $2 debt per play
        
        if (isWinner) {
            stats.terrybucks.wins++;
            // Win $100,000 but must pay back debt
            const winAmount = 100000;
            const debtBefore = stats.terrybucks.debt;
            stats.terrybucks.debt = Math.max(0, stats.terrybucks.debt - winAmount);
            stats.terrybucks.netWinnings += (winAmount - debtBefore);
        }
    }
    
    saveStats();
    updateStatsDisplay();
    
    // Display results
    displayResults(isWinner);
}

// Display results
function displayResults(isWinner) {
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
    
    // Display message
    if (isWinner) {
        messageDiv.className = 'result-message winner';
        messageDiv.textContent = '🎉 JACKPOT! YOU WIN! 🎉';
    } else {
        messageDiv.className = 'result-message loser';
        const matches = selectedNumbers.filter(num => winningNumbers.includes(num)).length;
        const powerMatch = selectedPower === winningPower ? ' Power matched!' : '';
        messageDiv.textContent = `No win. Matched ${matches}/5 numbers.${powerMatch}`;
    }
    
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
        debtDisplay.textContent = `$${tbStats.debt.toLocaleString()}`;
    }
    
    if (netDisplay) {
        const netValue = (tbStats.wins * 100000) - tbStats.debt;
        netDisplay.textContent = `$${netValue.toLocaleString()}`;
        netDisplay.className = netValue >= 0 ? 'terrybucks-positive' : 'terrybucks-negative';
    }
    
    // Show warnings at different thresholds
    if (warningDisplay) {
        let warning = '';
        const playsToBreakEven = Math.ceil(tbStats.debt / 100000);
        
        if (tbStats.debt >= 10000) {
            warning = `⚠️ <strong>Deep in debt!</strong> You owe $${tbStats.debt.toLocaleString()} TerryBucks. You need ${playsToBreakEven} wins just to break even. The loop tightens...`;
        } else if (tbStats.debt >= 1000) {
            warning = `⚠️ <strong>Debt accumulating:</strong> $${tbStats.debt.toLocaleString()} TerryBucks owed. Still trying to escape? That's the strange loop.`;
        } else if (tbStats.debt >= 100) {
            warning = `💭 You've borrowed $${tbStats.debt.toLocaleString()} TerryBucks. Each play digs deeper. Notice the pattern?`;
        } else if (tbStats.gamesPlayed > 0) {
            warning = `💰 Current debt: $${tbStats.debt.toLocaleString()} TerryBucks. The trap is subtle at first...`;
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
            stats.terrybucks = { gamesPlayed: 0, wins: 0, debt: 0, netWinnings: 0 };
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
