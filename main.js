class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.numbers = [];
    this.history = [];
    this.shadowRoot.innerHTML = `
      <style>
        .lotto-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-radius: 10px;
          background-color: #f0f0f0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 600px; /* Limit width to make history more readable */
        }
        .buttons-container {
          display: flex;
          gap: 10px;
        }
        button {
          padding: 10px 20px;
          font-size: 1.2em;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background-color: #4CAF50;
          color: white;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #45a049;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .numbers-container {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
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
        .history-section {
          width: 100%;
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
          text-align: center;
        }
        .history-section h3 {
          color: #555;
          margin-bottom: 15px;
        }
        #history-container {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #eee;
          background-color: #fff;
          padding: 10px;
          border-radius: 5px;
          text-align: left;
        }
        .history-item {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 8px;
          padding-bottom: 5px;
          border-bottom: 1px dotted #eee;
        }
        .history-item:last-child {
          border-bottom: none;
        }
        .history-item .number-ball {
            width: 30px;
            height: 30px;
            font-size: 0.9em;
        }
      </style>
      <div class="lotto-container">
        <div class="buttons-container">
          <button id="generate">Generate Numbers</button>
          <button id="copy" disabled>Copy Numbers</button>
        </div>
        <div class="numbers-container"></div>
        <div class="history-section">
          <h3>Generated Numbers History</h3>
          <button id="clear-history">Clear History</button>
          <div id="history-container">
            <p>No numbers generated yet.</p>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.getElementById('generate').addEventListener('click', () => this.generateNumbers());
    this.shadowRoot.getElementById('copy').addEventListener('click', () => this.copyNumbers());
    this.shadowRoot.getElementById('clear-history').addEventListener('click', () => this.clearHistory());
    this.renderHistory();
  }

  generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    this.numbers = Array.from(numbers).sort((a, b) => a - b);
    this.renderNumbers(this.numbers);
    this.shadowRoot.getElementById('copy').disabled = false;
    this.addNumbersToHistory(this.numbers);
  }

  addNumbersToHistory(numbers) {
    this.history.unshift(numbers); // Add to the beginning
    if (this.history.length > 5) { // Keep only last 5 history items
      this.history.pop();
    }
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
  }

  copyNumbers() {
    navigator.clipboard.writeText(this.numbers.join(', ')).then(() => {
      alert('Copied to clipboard!');
    }, () => {
      alert('Failed to copy.');
    });
  }

  renderNumbers(numbers) {
    const container = this.shadowRoot.querySelector('.numbers-container');
    container.innerHTML = '';
    numbers.forEach(number => {
      const ball = document.createElement('div');
      ball.className = 'number-ball';
      ball.textContent = number;
      ball.style.backgroundColor = this.getColor(number);
      container.appendChild(ball);
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