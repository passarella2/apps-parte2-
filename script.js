// --- 1. Navegação e Tema (Comuns a todas as páginas) ---

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');

/**
 * Alterna a visibilidade do menu de navegação em dispositivos móveis.
 */
function toggleMenu() {
    navMenu.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    const isActive = navMenu.classList.contains('active');
    icon.classList.toggle('fa-bars', !isActive);
    icon.classList.toggle('fa-times', isActive);
}

/**
 * Alterna entre tema claro e escuro.
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon', newTheme === 'light');
    icon.classList.toggle('fa-sun', newTheme === 'dark');
}

/**
 * Aplica o tema salvo ao carregar a página.
 */
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Configura o ícone inicial
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon', savedTheme === 'light');
    icon.classList.toggle('fa-sun', savedTheme === 'dark');
}

// Event Listeners Comuns
hamburger?.addEventListener('click', toggleMenu);
themeToggle?.addEventListener('click', toggleTheme);
document.addEventListener('DOMContentLoaded', applySavedTheme);


// --- 2. Funcionalidades dos Apps (Executadas apenas em apps.html) ---

// App 1: Calculadora
window.calculate = function() {
    const num1 = parseFloat(document.getElementById('calc-input1').value);
    const num2 = parseFloat(document.getElementById('calc-input2').value);
    const operator = document.getElementById('calc-operator').value;
    const resultElement = document.getElementById('calc-result');
    let result = '';

    if (isNaN(num1) || isNaN(num2)) {
        result = 'Erro: Insira números válidos.';
    } else {
        try {
            switch (operator) {
                case '+': result = num1 + num2; break;
                case '-': result = num1 - num2; break;
                case '*': result = num1 * num2; break;
                case '/': 
                    if (num2 === 0) throw new Error('Divisão por zero!');
                    result = num1 / num2;
                    break;
                default: result = 'Erro: Operador inválido.';
            }
        } catch (e) {
            result = e.message;
        }
    }
    
    resultElement.textContent = `Resultado: ${typeof result === 'number' ? result.toFixed(2) : result}`;
}

// App 2: To-Do List
window.addTodo = function() {
    const input = document.getElementById('todo-input');
    const task = input.value.trim();
    if (task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task}</span>
            <button onclick="removeTodo(this)"><i class="fas fa-trash-alt"></i></button>
        `;
        document.getElementById('todo-list').appendChild(li);
        input.value = '';
    }
}

window.removeTodo = function(button) {
    button.parentElement.remove();
}

// App 3: Contador de Palavras (Atualiza em tempo real)
window.countWords = function() {
    const text = document.getElementById('word-input')?.value || '';
    const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = wordsArray.length;
    const charCount = text.length;

    document.getElementById('word-count').textContent = `Palavras: ${wordCount}`;
    document.getElementById('char-count').textContent = `Caracteres: ${charCount}`;
}

document.getElementById('word-input')?.addEventListener('input', window.countWords);

// App 4: Gerador de Senhas (Com cópia)
window.generatePassword = function() {
    const length = parseInt(document.getElementById('pass-length').value);
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;
    const output = document.getElementById('generated-pass');
    
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let password = '';
    
    if (chars.length === 0) {
        output.textContent = 'Erro: Selecione opções.';
        return;
    }
    
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    output.textContent = password;
}

// Inicializa a senha ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('generated-pass')) {
        window.generatePassword();
        document.getElementById('generated-pass').addEventListener('click', (e) => {
            navigator.clipboard.writeText(e.target.textContent).then(() => {
                alert('Senha copiada para a área de transferência!');
            }).catch(err => {
                console.error('Falha ao copiar:', err);
            });
        });
    }
});


// App 5: Quiz Interativo
let quizState = {
    currentQuestion: 0,
    score: 0,
    questions: [
        { 
            q: 'Qual é a linguagem de marcação fundamental da web?', 
            options: ['CSS', 'Python', 'HTML', 'JavaScript'], 
            a: 'HTML' 
        },
        { 
            q: 'Qual propriedade CSS muda a cor do texto?', 
            options: ['background-color', 'font-color', 'color', 'text-style'], 
            a: 'color' 
        },
        { 
            q: 'Qual função JS exibe mensagem na console?', 
            options: ['alert()', 'console.log()', 'print()', 'display()'], 
            a: 'console.log()' 
        }
    ]
};

window.startQuiz = function() {
    quizState.currentQuestion = 0;
    quizState.score = 0;
    loadQuestion();
    document.getElementById('quiz-start-btn').textContent = 'Próxima Pergunta';
    document.getElementById('quiz-score').textContent = `Pontuação: 0/${quizState.questions.length}`;
}

window.loadQuestion = function() {
    const qElement = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    const startBtn = document.getElementById('quiz-start-btn');
    const currentQ = quizState.questions[quizState.currentQuestion];

    if (!currentQ) {
        qElement.textContent = 'Parabéns! Quiz Finalizado.';
        optionsContainer.innerHTML = '';
        startBtn.style.display = 'block';
        startBtn.textContent = 'Recomeçar Quiz';
        startBtn.onclick = window.startQuiz;
        return;
    }
    
    qElement.textContent = `Pergunta ${quizState.currentQuestion + 1}: ${currentQ.q}`;
    optionsContainer.innerHTML = '';
    startBtn.style.display = 'none';

    currentQ.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => window.checkAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

window.checkAnswer = function(selectedOption) {
    const currentQ = quizState.questions[quizState.currentQuestion];
    const optionsContainer = document.getElementById('quiz-options');
    const startBtn = document.getElementById('quiz-start-btn');

    Array.from(optionsContainer.children).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentQ.a) {
            btn.style.backgroundColor = 'green';
        } else if (btn.textContent === selectedOption) {
            btn.style.backgroundColor = 'red';
        }
    });

    if (selectedOption === currentQ.a) {
        quizState.score++;
    }
    
    document.getElementById('quiz-score').textContent = `Pontuação: ${quizState.score}/${quizState.questions.length}`;
    
    quizState.currentQuestion++;
    startBtn.style.display = 'block';
    startBtn.textContent = quizState.currentQuestion < quizState.questions.length ? 'Próxima Pergunta' : 'Ver Resultado Final';
    startBtn.onclick = window.loadQuestion;
}

// App 6: Relógio
let clockInterval;
let isRunning = true;

window.updateClock = function() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('pt-BR');
}

window.toggleClock = function() {
    const button = document.getElementById('clock-toggle');
    if (isRunning) {
        clearInterval(clockInterval);
        button.textContent = 'Iniciar';
        button.style.backgroundColor = '#28a745';
    } else {
        clockInterval = setInterval(window.updateClock, 1000);
        button.textContent = 'Pausar';
        button.style.backgroundColor = '#007bff';
    }
    isRunning = !isRunning;
}

// Inicializa o Relógio ao carregar, se estiver na página de apps
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('clock')) {
        window.updateClock(); // Primeira chamada imediata
        clockInterval = setInterval(window.updateClock, 1000);
    }
});