
// ==========================================
// VAULT 2 - THE FORGOTTEN CYPHER
// ==========================================

// GAME SETTINGS

const CORRECT_ANSWER = "TEST";
const SECRET_KEYWORD = "SHADOW";

let secondsLeft = 90;
let attemptsLeft = 3;

let timerInterval = null;
let gameFinished = false;
let hintUsed = false;


// HTML ELEMENTS

const terminalForm = document.getElementById("terminalForm");
const commandInput = document.getElementById("commandInput");
const terminalOutput = document.getElementById("terminalOutput");

const timerDisplay = document.getElementById("timer");
const attemptsDisplay = document.getElementById("attempts");

const gameMessage = document.getElementById("gameMessage");

const restartBtn = document.getElementById("restartBtn");
const nextVaultBtn = document.getElementById("nextVaultBtn");


// ==========================================
// TERMINAL OUTPUT
// ==========================================

function printToTerminal(message, className = "green") {

    const line = document.createElement("p");

    line.className = className;
    line.textContent = "> " + message;

    terminalOutput.appendChild(line);

    const terminal = document.getElementById("terminal");

    terminal.scrollTop = terminal.scrollHeight;
}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        if (gameFinished) return;

        secondsLeft--;

        updateTimer();

        if (secondsLeft <= 0) {

            secondsLeft = 0;

            updateTimer();

            endGame();
        }

    }, 1000);
}


function updateTimer() {

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

    if (secondsLeft <= 15) {

        timerDisplay.style.color = "#ef4444";

    } else {

        timerDisplay.style.color = "#facc15";
    }
}


// ==========================================
// ATTEMPTS
// ==========================================

function updateAttempts() {

    attemptsDisplay.textContent =
        String(attemptsLeft).padStart(2, "0");
}


// ==========================================
// COMMAND: HELP
// ==========================================

function showHelp() {

    printToTerminal("AVAILABLE COMMANDS:", "yellow");

    printToTerminal("HELP - Display available commands");

    printToTerminal("SCAN - Inspect encrypted transmission");

    printToTerminal("HINT - Request a cryptographic hint");

    printToTerminal("DECODE [ANSWER] - Submit decoded message");

    printToTerminal("CLEAR - Clear terminal history");

}


// ==========================================
// COMMAND: SCAN
// ==========================================

function scanMessage() {

    printToTerminal("SCANNING TRANSMISSION...", "cyan");

    printToTerminal("ENCRYPTED TEXT: UFTU", "yellow");

    printToTerminal("CIPHER TYPE: CAESAR SUBSTITUTION");

    printToTerminal("UNKNOWN SHIFT DETECTED.");

    printToTerminal("HINT: INSPECT THE FIRST LETTER.");

    printToTerminal("OR TYPE YOUR DECODED WORD DIRECTLY.");
}


// ==========================================
// COMMAND: HINT
// ==========================================

function revealHint() {

    if (hintUsed) {

        printToTerminal("HINT ALREADY ACCESSED.", "yellow");

        return;
    }

    hintUsed = true;

    printToTerminal("ARCHITECT'S NOTE FOUND.", "cyan");

    printToTerminal(
        "THE LETTER U SHOULD BECOME T.",
        "yellow"
    );

    printToTerminal(
        "APPLY THE SAME RULE TO EVERY LETTER."
    );

}


// ==========================================
// CAESAR CIPHER DECRYPTION
// ==========================================

function caesarDecrypt(text, shift) {

    return text.replace(/[a-z]/gi, letter => {

        const base = letter === letter.toUpperCase()
            ? 65
            : 97;

        const code = letter.charCodeAt(0) - base;

        const decoded = (code - shift + 26) % 26;

        return String.fromCharCode(decoded + base);

    });
}


// ==========================================
// COMMAND: DECODE
// ==========================================

function decodeMessage(answer) {

    if (!answer) {

        printToTerminal(
            "ERROR: PLEASE ENTER A MESSAGE.",
            "yellow"
        );

        return;
    }

    printToTerminal(
        "PROCESSING DECRYPTION REQUEST...",
        "cyan"
    );

    const decoded = answer.trim().toUpperCase();

    if (decoded === CORRECT_ANSWER) {

        unlockVault();

    } else {

        attemptsLeft--;

        updateAttempts();

        printToTerminal(
            "DECRYPTION FAILED. INCORRECT MESSAGE.",
            "yellow"
        );

        printToTerminal(
            attemptsLeft + " ATTEMPTS REMAINING."
        );

        if (attemptsLeft <= 0) {

            endGame();
        }
    }
}


// ==========================================
// VAULT UNLOCK
// ==========================================

function unlockVault() {

    gameFinished = true;

    clearInterval(timerInterval);

    printToTerminal("DECRYPTION SUCCESSFUL!", "green");

    printToTerminal("ACCESS GRANTED.", "green");

    printToTerminal("VAULT 02 UNLOCKED.", "yellow");

    printToTerminal(
        "CLUE #2: " + SECRET_KEYWORD,
        "yellow"
    );

    gameMessage.innerHTML =
        " <strong>VAULT 2 UNLOCKED!</strong><br><br>" +
        "CLUE #2: " + SECRET_KEYWORD;

    gameMessage.style.color = "#4ade80";

    restartBtn.style.display = "none";

    nextVaultBtn.style.display = "block";

    // Save the clue for later vaults.

    localStorage.setItem(
        "vault2Clue",
        SECRET_KEYWORD
    );
}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameFinished = true;

    clearInterval(timerInterval);

    printToTerminal("SYSTEM LOCKED.", "yellow");

    printToTerminal(
        "THE ARCHITECT HAS DENIED ACCESS.",
        "yellow"
    );

    gameMessage.textContent =
        "MISSION FAILED. RESTART TO TRY AGAIN.";

    gameMessage.style.color = "#ef4444";

    restartBtn.style.display = "block";
}


// ==========================================
// CLEAR TERMINAL
// ==========================================

function clearTerminal() {

    terminalOutput.innerHTML = "";

    printToTerminal("ARCHITECT_OS TERMINAL READY.");

    printToTerminal("TYPE HELP TO VIEW COMMANDS.", "yellow");
}


// ==========================================
// COMMAND PROCESSOR
// ==========================================

function processCommand(command) {

    if (gameFinished) {

        printToTerminal(
            "SYSTEM LOCKED. RESTART THE VAULT.",
            "yellow"
        );

        return;
    }

    const parts = command.trim().split(/\s+/);

    const action = parts[0].toLowerCase();

    const argument = parts.slice(1).join(" ");

    switch (action) {

        case "help":

            showHelp();

            break;

        case "scan":

            scanMessage();

            break;

        case "hint":

            revealHint();

            break;

        case "decode":

            decodeMessage(argument);

            break;

        case "clear":

            clearTerminal();

            break;

        case "status":
            printToTerminal(
                `TIME: ${secondsLeft}s | ATTEMPTS: ${attemptsLeft}`,
                "cyan"
            );
            break;

        default:

            printToTerminal(
                "UNKNOWN COMMAND. TYPE HELP.",
                "yellow"
            );
    }
}


// ==========================================
// TERMINAL INPUT
// ==========================================

terminalForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const command = commandInput.value.trim();

    if (!command) return;

    printToTerminal(command, "cyan");

    processCommand(command);

    commandInput.value = "";

});


// ==========================================
// RESTART GAME
// ==========================================

function resetVault2() {

    clearInterval(timerInterval);

    secondsLeft = 90;

    attemptsLeft = 3;

    gameFinished = false;

    hintUsed = false;

    terminalOutput.innerHTML = "";

    gameMessage.textContent = "";

    restartBtn.style.display = "none";

    nextVaultBtn.style.display = "none";

    timerDisplay.style.color = "#facc15";

    updateTimer();

    updateAttempts();

    printToTerminal("INITIALIZING ARCHITECT_OS...");

    printToTerminal("CONNECTION ESTABLISHED.");

    printToTerminal("ENCRYPTED MESSAGE DETECTED.", "yellow");

    printToTerminal("TRANSMISSION: UFTU", "cyan");

    printToTerminal("TYPE HELP TO VIEW COMMANDS.", "yellow");

    startTimer();

    commandInput.focus();
}


// ==========================================
// BUTTON EVENTS
// ==========================================

restartBtn.addEventListener("click", resetVault2);

nextVaultBtn.addEventListener("click", () => {

    gameMessage.textContent =
        "Vault 3 is ready to be connected to your game!";

});


// ==========================================
// START GAME
// ==========================================

updateTimer();

updateAttempts();

startTimer();
