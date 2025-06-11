document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game');
    const attemptsElement = document.getElementById('attempts');
    const normalModeButton = document.getElementById('normal-mode');
    const hardModeButton = document.getElementById('hard-mode');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let attempts = 5;
    let cardValues = [];

    normalModeButton.addEventListener('click', () => setDifficulty(5, false));
    hardModeButton.addEventListener('click', () => setDifficulty(3, true));

    function generateCardValues(hardMode) {
        const letters = hardMode ? 'ABCDEFGHIJK' : 'ABCDEFGH';
        cardValues = [];
        for (let letter of letters) {
            cardValues.push(letter, letter);
        }
    }

    function setDifficulty(attemptsCount, isHardMode) {
        attempts = attemptsCount;
        attemptsElement.textContent = attempts;
        generateCardValues(isHardMode);
        resetGame();
    }

    function resetGame() {
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
        reshuffleCards();
    }

    function flipCard() {
        if (lockBoard || this === firstCard || attempts <= 0) return;

        this.classList.add('flipped');
        this.textContent = this.dataset.value;

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        isMatch ? handleMatch() : handleMismatch();
    }

    function handleMatch() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    function handleMismatch() {
        firstCard.classList.add('mismatch');
        secondCard.classList.add('mismatch');

        lockBoard = true;
        attempts--;
        attemptsElement.textContent = attempts;

        setTimeout(() => {
            firstCard.classList.remove('flipped', 'mismatch');
            secondCard.classList.remove('flipped', 'mismatch');
            firstCard.textContent = '';
            secondCard.textContent = '';
            resetBoard();

            if (attempts <= 0) {
                alert('Suas tentativas acabaram! Jogo encerrado.');
            }
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function showCardsBeforeStart() {
        // Mostra as cartas brevemente antes de iniciar o jogo
        const cards = [];
        cardValues.forEach(value => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = value;
            cardElement.textContent = value;
            cardElement.classList.add('flipped');
            gameContainer.appendChild(cardElement);
            cards.push(cardElement);
        });

        // Esconde as cartas após 10 segundos
        setTimeout(() => {
            cards.forEach(card => {
                card.textContent = '';
                card.classList.remove('flipped');
            });
            setTimeout(() => {
                cards.forEach(card => {
                    card.addEventListener('click', flipCard);
                });
            }, 500);
        }, 10000);
    }

    function reshuffleCards() {
        cardValues.sort(() => Math.random() - 0.5);

        const gridSize = Math.sqrt(cardValues.length);
        gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
        gameContainer.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;

        showCardsBeforeStart();
    }

    // Inicializa o jogo no modo normal
    setDifficulty(5, false);
});
