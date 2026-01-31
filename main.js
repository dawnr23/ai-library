class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.numbers = [];
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
      </style>
      <div class="lotto-container">
        <div class="buttons-container">
          <button id="generate">Generate Numbers</button>
          <button id="copy" disabled>Copy Numbers</button>
        </div>
        <div class="numbers-container"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.getElementById('generate').addEventListener('click', () => this.generateNumbers());
    this.shadowRoot.getElementById('copy').addEventListener('click', () => this.copyNumbers());
  }

  generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    this.numbers = Array.from(numbers).sort((a, b) => a - b);
    this.renderNumbers(this.numbers);
    this.shadowRoot.getElementById('copy').disabled = false;
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