class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.numbers = []; // Will now hold an array of arrays for multiple sets
    this.history = [];
    this.favorites = [];
    this.minNumber = 1;
    this.maxNumber = 45;
    this.numBalls = 6;
    this.numSets = 1; // New property for number of sets
    this.currentTheme = 'default'; // Default theme
    this.shadowRoot.innerHTML = `
      <style>
        :host {
            --bg-color: #f0f4f8;
            --container-bg: #ffffff;
            --text-color: #333;
            --primary-btn-bg: #28a745;
            --primary-btn-hover: #218838;
            --secondary-btn-bg: #007bff;
            --secondary-btn-hover: #0069d9;
            --danger-btn-bg: #dc3545;
            --danger-btn-hover: #c82333;
            --info-btn-bg: #6c757d;
            --info-btn-hover: #5a6268;
            --warning-btn-bg: #ffc107;
            --warning-btn-hover: #e0a800;
            --border-color: #e0e6ed;
            --input-border: #c8d3db;
            --history-bg: #f8f9fa;
        }

        :host(.dark-theme) {
            --bg-color: #2c3e50;
            --container-bg: #34495e;
            --text-color: #ecf0f1;
            --primary-btn-bg: #27ae60;
            --primary-btn-hover: #229954;
            --secondary-btn-bg: #3498db;
            --secondary-btn-hover: #2980b9;
            --danger-btn-bg: #e74c3c;
            --danger-btn-hover: #c0392b;
            --info-btn-bg: #7f8c8d;
            --info-btn-hover: #6c757d;
            --warning-btn-bg: #f39c12;
            --warning-btn-hover: #e67e22;
            --border-color: #3f5d79;
            --input-border: #4d6a84;
            --history-bg: #2b3b4a;
        }

        .lotto-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-radius: 10px;
          background-color: var(--container-bg);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 600px; /* Limit width to make history more readable */
          color: var(--text-color);
        }
        .input-group {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .input-group label {
            font-weight: bold;
            color: var(--text-color);
        }
        .input-group input {
            padding: 8px;
            border-radius: 5px;
            border: 1px solid var(--input-border);
            width: 60px;
            text-align: center;
            font-size: 1em;
            background-color: var(--container-bg);
            color: var(--text-color);
        }
        .buttons-container {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        button {
          padding: 10px 20px;
          font-size: 1.2em;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background-color: var(--primary-btn-bg);
          color: white;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: var(--primary-btn-hover);
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        #generate { background-color: var(--primary-btn-bg); }
        #generate:hover { background-color: var(--primary-btn-hover); }
        #copy { background-color: var(--secondary-btn-bg); }
        #copy:hover { background-color: var(--secondary-btn-hover); }
        #reset { background-color: var(--danger-btn-bg); }
        #reset:hover { background-color: var(--danger-btn-hover); }
        #save-state, #load-state, #share, #smart-pick { background-color: var(--info-btn-bg); }
        #save-state:hover, #load-state:hover, #share:hover, #smart-pick:hover { background-color: var(--info-btn-hover); }
        #clear-history { background-color: var(--warning-btn-bg); color: var(--text-color); }
        #clear-history:hover { background-color: var(--warning-btn-hover); }


        .numbers-container {
          display: flex;
          flex-direction: column; /* Changed for multiple sets */
          gap: 15px; /* Gap between sets */
          margin-bottom: 20px;
          width: 100%;
        }
        .number-set-display {
          display: flex;
          flex-wrap: wrap;
          gap: 10px; /* Gap between balls in a set */
          justify-content: center;
          padding: 10px;
          border: 1px dashed #ccc;
          border-radius: 8px;
          background-color: var(--history-bg);
        }
        .number-ball {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 1.5em;
          font-weight: bold;
          color: white;
        }
        .history-section, .favorites-section {
          width: 100%;
          margin-top: 20px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          text-align: center;
        }
        .history-section h3, .favorites-section h3 {
          color: var(--text-color);
          margin-bottom: 15px;
        }
        #history-container, #favorites-container {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid var(--input-border);
          background-color: var(--history-bg);
          padding: 10px;
          border-radius: 5px;
          text-align: left;
        }
        .history-item, .favorite-item {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 8px;
          padding-bottom: 5px;
          border-bottom: 1px dotted var(--input-border);
          align-items: center;
        }
        .history-item:last-child, .favorite-item:last-child {
          border-bottom: none;
        }
        .history-item .number-ball, .favorite-item .number-ball {
            width: 30px;
            height: 30px;
            font-size: 0.9em;
        }
        .favorite-item button.delete-favorite {
            background-color: var(--danger-btn-bg);
            color: white;
            padding: 5px 10px;
            font-size: 0.8em;
            border-radius: 5px;
            margin-left: auto;
            cursor: pointer;
        }
        .favorite-item button.delete-favorite:hover {
            background-color: var(--danger-btn-hover);
        }
        .favorite-item-set {
            cursor: pointer;
            display: flex;
            gap: 5px;
            align-items: center;
        }
        .favorite-item-set:hover {
            opacity: 0.8;
        }
        .theme-selector {
            margin-bottom: 20px;
            text-align: center;
        }
        .theme-selector label {
            font-weight: bold;
            margin-right: 10px;
            color: var(--text-color);
        }
        .theme-selector select {
            padding: 8px;
            border-radius: 5px;
            border: 1px solid var(--input-border);
            background-color: var(--container-bg);
            color: var(--text-color);
            font-size: 1em;
        }
      </style>
      <div class="lotto-container">
        <div class="theme-selector">
            <label for="theme-select">Theme:</label>
            <select id="theme-select">
                <option value="default">Default</option>
                <option value="dark-theme">Dark</option>
            </select>
        </div>
        <div class="input-group">
            <label for="min-number">Min:</label>
            <input type="number" id="min-number" value="1" min="1" max="99">
            <label for="max-number">Max:</label>
            <input type="number" id="max-number" value="45" min="1" max="99">
            <label for="num-balls">Balls:</label>
            <input type="number" id="num-balls" value="6" min="1" max="10">
            <label for="num-sets">Sets:</label>
            <input type="number" id="num-sets" value="1" min="1" max="5">
        </div>
        <div class="buttons-container">
          <button id="generate">Generate Numbers</button>
          <button id="copy" disabled>Copy Numbers</button>
          <button id="reset">Reset</button>
        </div>
        <div class="numbers-container"></div>
        <div class="action-buttons">
          <button id="save-state">Save State</button>
          <button id="load-state">Load State</button>
          <button id="save-favorite" disabled>Save to Favorites</button>
          <button id="share" disabled>Share</button>
          <button id="smart-pick">Smart Pick</button>
        </div>
        <div class="history-section">
          <h3>Generated Numbers History</h3>
          <button id="clear-history">Clear History</button>
          <div id="history-container">
            <p>No numbers generated yet.</p>
          </div>
        </div>
        <div class="favorites-section">
          <h3>My Favorites</h3>
          <div id="favorites-container">
            <p>No favorites saved yet.</p>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.getElementById('generate').addEventListener('click', () => this.generateNumbers());
    this.shadowRoot.getElementById('copy').addEventListener('click', () => this.copyNumbers());
    this.shadowRoot.getElementById('reset').addEventListener('click', () => this.resetAll());
    this.shadowRoot.getElementById('clear-history').addEventListener('click', () => this.clearHistory());
    this.shadowRoot.getElementById('save-state').addEventListener('click', () => this.saveState());
    this.shadowRoot.getElementById('load-state').addEventListener(() => this.loadState());
    this.shadowRoot.getElementById('save-favorite').addEventListener('click', () => this.saveFavorite());
    this.shadowRoot.getElementById('share').addEventListener('click', () => this.shareNumbers());
    this.shadowRoot.getElementById('smart-pick').addEventListener('click', () => this.generateSmartPick());


    this.minNumberInput = this.shadowRoot.getElementById('min-number');
    this.maxNumberInput = this.shadowRoot.getElementById('max-number');
    this.numBallsInput = this.shadowRoot.getElementById('num-balls');
    this.numSetsInput = this.shadowRoot.getElementById('num-sets');
    this.themeSelect = this.shadowRoot.getElementById('theme-select');

    this.minNumberInput.addEventListener('change', () => this.updateRange());
    this.maxNumberInput.addEventListener('change', () => this.updateRange());
    this.numBallsInput.addEventListener('change', () => this.updateNumBalls());
    this.numSetsInput.addEventListener('change', () => this.updateNumSets());
    this.themeSelect.addEventListener('change', () => this.setTheme(this.themeSelect.value));


    this.loadState(); // Attempt to load state on initialization
    this.renderHistory();
    this.renderFavorites();
  }

  setTheme(theme) {
    this.currentTheme = theme;
    // Apply theme to the host element
    if (theme === 'dark-theme') {
      this.host.classList.add('dark-theme');
    } else {
      this.host.classList.remove('dark-theme');
    }
    this.saveState(); // Persist theme selection
  }

  updateRange() {
    const newMin = parseInt(this.minNumberInput.value);
    const newMax = parseInt(this.maxNumberInput.value);

    if (newMin >= newMax || newMin < 1 || newMax > 99) {
      alert('Invalid range: Min must be less than Max, and numbers must be between 1 and 99.');
      // Revert to last valid state or default
      this.minNumberInput.value = this.minNumber;
      this.maxNumberInput.value = this.maxNumber;
      return;
    }
    this.minNumber = newMin;
    this.maxNumber = newMax;
    this.saveState(); // Save updated range
  }

  updateNumBalls() {
    const newNumBalls = parseInt(this.numBallsInput.value);
    if (newNumBalls < 1 || newNumBalls > (this.maxNumber - this.minNumber + 1)) {
        alert('Invalid number of balls: Must be a positive number and not exceed the range size.');
        this.numBallsInput.value = this.numBalls; // Revert to last valid state
        return;
    }
    this.numBalls = newNumBalls;
    this.saveState(); // Save updated number of balls
  }

  updateNumSets() {
    const newNumSets = parseInt(this.numSetsInput.value);
    if (newNumSets < 1 || newNumSets > 10) { // Limit number of sets for display purposes
        alert('Invalid number of sets: Must be between 1 and 10.');
        this.numSetsInput.value = this.numSets;
        return;
    }
    this.numSets = newNumSets;
    this.saveState(); // Save updated number of sets
  }

  generateNumbers() {
    const generatedSets = [];
    for (let i = 0; i < this.numSets; i++) {
        const numbers = new Set();
        while (numbers.size < this.numBalls) {
            const randomNumber = Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber;
            numbers.add(randomNumber);
        }
        generatedSets.push(Array.from(numbers).sort((a, b) => a - b));
    }
    this.numbers = generatedSets;
    this.renderNumbers(this.numbers);
    this.shadowRoot.getElementById('copy').disabled = false;
    this.shadowRoot.getElementById('save-favorite').disabled = false;
    this.shadowRoot.getElementById('share').disabled = false;
    this.addNumbersToHistory(this.numbers); // Add all generated sets to history
    this.saveState(); // Save state after generating numbers
  }

  generateSmartPick() {
    const allNumbersInHistory = this.history.flat(); // Flatten all numbers from history
    const frequencyMap = {};
    for (let i = this.minNumber; i <= this.maxNumber; i++) {
        frequencyMap[i] = 0; // Initialize all possible numbers to 0 frequency
    }
    allNumbersInHistory.forEach(num => {
        if (num >= this.minNumber && num <= this.maxNumber) {
            frequencyMap[num]++;
        }
    });

    const sortedNumbers = Object.entries(frequencyMap)
        .sort(([, freqA], [, freqB]) => freqB - freqA) // Sort by frequency descending
        .map(([num]) => parseInt(num)); // Get just the numbers

    const smartPickSet = new Set();
    // Take a portion of "hot" numbers, ensuring not to exceed numBalls or available unique hot numbers
    const hotNumbersCount = Math.min(Math.floor(this.numBalls / 2), sortedNumbers.length);
    for (let i = 0; smartPickSet.size < hotNumbersCount && i < sortedNumbers.length; i++) {
        smartPickSet.add(sortedNumbers[i]);
    }

    // Fill the rest with random unique numbers
    while (smartPickSet.size < this.numBalls) {
        const randomNumber = Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber;
        if (smartPickSet.size === (this.maxNumber - this.minNumber + 1)) { // All numbers in range are picked
            break;
        }
        smartPickSet.add(randomNumber);
    }
    
    const generatedSet = Array.from(smartPickSet).sort((a, b) => a - b);
    this.numbers = [generatedSet]; // Smart pick generates one set
    this.renderNumbers(this.numbers);
    this.shadowRoot.getElementById('copy').disabled = false;
    this.shadowRoot.getElementById('save-favorite').disabled = false;
    this.shadowRoot.getElementById('share').disabled = false;
    this.addNumbersToHistory(this.numbers); // Add the smart pick set to history
    this.saveState(); // Save state
  }

  addNumbersToHistory(generatedSets) {
    generatedSets.forEach(set => {
        this.history.unshift(set); // Add each set to the beginning
        if (this.history.length > 5) { // Keep only last 5 history items
            this.history.pop();
        }
    });
    this.renderHistory();
  }

  renderHistory() {
    const historyContainer = this.shadowRoot.getElementById('history-container');
    historyContainer.innerHTML = '';
    if (this.history.length === 0) {
      historyContainer.innerHTML = '<p>No numbers generated yet.</p>';
      return;
    }
    this.history.forEach(historicNumbers => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historicNumbers.forEach(number => {
        const ball = document.createElement('div');
        ball.className = 'number-ball';
        ball.textContent = number;
        ball.style.backgroundColor = this.getColor(number);
        historyItem.appendChild(ball);
      });
      historyContainer.appendChild(historyItem);
    });
  }

  clearHistory() {
    this.history = [];
    this.renderHistory();
    this.saveState(); // Save state after clearing history
  }

  saveFavorite() {
    if (this.numbers.length === 0) {
      alert('Generate numbers first before saving to favorites!');
      return;
    }
    // Save all current generated sets as one favorite entry
    const currentSetsString = JSON.stringify(this.numbers);
    const isDuplicate = this.favorites.some(fav => JSON.stringify(fav) === currentSetsString);

    if (isDuplicate) {
      alert('This set of numbers is already in your favorites!');
      return;
    }

    this.favorites.push([...this.numbers]); // Save a copy of all sets
    this.saveState();
    this.renderFavorites();
    alert('Numbers saved to favorites!');
  }

  loadFavorite(favoriteSets) {
    this.numbers = [...favoriteSets];
    this.renderNumbers(this.numbers);
    this.shadowRoot.getElementById('copy').disabled = false;
    this.shadowRoot.getElementById('save-favorite').disabled = false;
    this.shadowRoot.getElementById('share').disabled = false;
    alert('Favorite numbers loaded!');
  }

  deleteFavorite(index) {
    this.favorites.splice(index, 1);
    this.saveState();
    this.renderFavorites();
    alert('Favorite deleted!');
  }

  renderFavorites() {
    const favoritesContainer = this.shadowRoot.getElementById('favorites-container');
    favoritesContainer.innerHTML = '';
    if (this.favorites.length === 0) {
      favoritesContainer.innerHTML = '<p>No favorites saved yet.</p>';
      return;
    }
    this.favorites.forEach((favSets, index) => {
      const favoriteItem = document.createElement('div');
      favoriteItem.className = 'favorite-item';
      const numberSetWrapper = document.createElement('div');
      numberSetWrapper.className = 'favorite-item-set';
      numberSetWrapper.addEventListener('click', () => this.loadFavorite(favSets));

      favSets.forEach((favNumbers, setIndex) => {
          favNumbers.forEach(number => {
            const ball = document.createElement('div');
            ball.className = 'number-ball';
            ball.textContent = number;
            ball.style.backgroundColor = this.getColor(number);
            numberSetWrapper.appendChild(ball);
          });
          if (setIndex < favSets.length - 1) {
              const separator = document.createElement('span');
              separator.textContent = ' | ';
              separator.style.margin = '0 5px';
              numberSetWrapper.appendChild(separator);
          }
      });
      

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-favorite';
      deleteButton.textContent = 'X';
      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent loading when deleting
        this.deleteFavorite(index);
      });

      favoriteItem.appendChild(numberSetWrapper);
      favoriteItem.appendChild(deleteButton);
      favoritesContainer.appendChild(favoriteItem);
    });
  }

  resetAll() {
    this.numbers = [];
    this.history = [];
    this.favorites = [];
    this.shadowRoot.querySelector('.numbers-container').innerHTML = '';
    this.shadowRoot.getElementById('copy').disabled = true;
    this.shadowRoot.getElementById('save-favorite').disabled = true;
    this.shadowRoot.getElementById('share').disabled = true;
    this.minNumber = 1;
    this.maxNumber = 45;
    this.numBalls = 6;
    this.numSets = 1;
    this.minNumberInput.value = this.minNumber;
    this.maxNumberInput.value = this.maxNumber;
    this.numBallsInput.value = this.numBalls;
    this.numSetsInput.value = this.numSets;
    localStorage.removeItem('lottoGeneratorState'); // Clear all data from local storage
    this.renderHistory();
    this.renderFavorites();
    alert('All data reset!');
  }

  shareNumbers() {
    if (this.numbers.length === 0) {
      alert('Generate numbers first before sharing!');
      return;
    }

    // Join all sets into a single string for sharing
    const allNumbersFlat = this.numbers.map(set => set.join('-')).join('_');
    const shareUrl = `${window.location.origin}${window.location.pathname}?numbers=${allNumbersFlat}&min=${this.minNumber}&max=${this.maxNumber}&count=${this.numBalls}&sets=${this.numSets}`;


    if (navigator.share) {
      navigator.share({
        title: 'Lotto Numbers',
        text: `Check out my lotto numbers: ${this.numbers.map(set => set.join(', ')).join(' | ')}`,
        url: shareUrl,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert(`Shareable URL copied to clipboard: ${shareUrl}`);
      }, () => {
        alert('Failed to copy shareable URL.');
      });
    }
  }

  saveState() {
    const state = {
      numbers: this.numbers,
      history: this.history,
      favorites: this.favorites,
      minNumber: this.minNumber,
      maxNumber: this.maxNumber,
      numBalls: this.numBalls,
      numSets: this.numSets,
      currentTheme: this.currentTheme
    };
    localStorage.setItem('lottoGeneratorState', JSON.stringify(state));
    // alert('State saved to local storage!');
  }

  loadState() {
    const savedState = localStorage.getItem('lottoGeneratorState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.numbers = state.numbers || [];
      this.history = state.history || [];
      this.favorites = state.favorites || [];
      this.minNumber = state.minNumber || 1;
      this.maxNumber = state.maxNumber || 45;
      this.numBalls = state.numBalls || 6;
      this.numSets = state.numSets || 1;
      this.currentTheme = state.currentTheme || 'default';

      this.minNumberInput.value = this.minNumber;
      this.maxNumberInput.value = this.maxNumber;
      this.numBallsInput.value = this.numBalls;
      this.numSetsInput.value = this.numSets;
      this.themeSelect.value = this.currentTheme; // Set the theme selector
      this.setTheme(this.currentTheme); // Apply the loaded theme

      this.renderNumbers(this.numbers);
      this.renderHistory();
      this.renderFavorites();
      this.shadowRoot.getElementById('copy').disabled = this.numbers.length === 0;
      this.shadowRoot.getElementById('save-favorite').disabled = this.numbers.length === 0;
      this.shadowRoot.getElementById('share').disabled = this.numbers.length === 0;
      // alert('State loaded from local storage!');
    } else {
      // alert('No saved state found.');
    }
  }

  copyNumbers() {
    if (this.numbers.length === 0) return;
    const textToCopy = this.numbers.map((set, index) => `Set ${index + 1}: ${set.join(', ')}`).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Copied to clipboard!');
    }, () => {
      alert('Failed to copy.');
    });
  }

  renderNumbers(setsOfNumbers) {
    const container = this.shadowRoot.querySelector('.numbers-container');
    container.innerHTML = '';
    setsOfNumbers.forEach((numbers, index) => {
        const setDisplay = document.createElement('div');
        setDisplay.className = 'number-set-display';
        const setTitle = document.createElement('h4');
        setTitle.textContent = `Set ${index + 1}`;
        setTitle.style.marginBottom = '10px';
        setTitle.style.width = '100%';
        setTitle.style.textAlign = 'center';
        setDisplay.appendChild(setTitle);

        numbers.forEach(number => {
            const ball = document.createElement('div');
            ball.className = 'number-ball';
            ball.textContent = number;
            ball.style.backgroundColor = this.getColor(number);
            setDisplay.appendChild(ball);
        });
        container.appendChild(setDisplay);
    });
  }

  getColor(number) {
    if (number <= 10) return '#fbc400';
    if (number <= 20) return '#69c8f2';
    if (number <= 30) return '#ff7272';
    if (number <= 40) return '#aaa';
    return '#b0d840';
  }
}

customElements.define('lotto-generator', LottoGenerator);