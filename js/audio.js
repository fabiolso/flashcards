/* ====================================
   FUNÇÕES DE ÁUDIO (TEXT-TO-SPEECH)
   Arquivo: js/audio.js
   
   Usa Web Speech API para pronunciar textos em inglês e português
   Suporta navegadores modernos: Chrome, Firefox, Edge, Safari
   
   Funções disponíveis:
   - ouvirEmIngles() - Pronuncia palavra em inglês
   - ouvirFraseEmIngles() - Pronuncia frase em inglês
   - ouvirEmPortugues() - Pronuncia palavra em português
   - falarTexto() - Função base para síntese de fala
   ==================================== */

// ====================================
// 1. VERIFICAR SUPORTE A WEB SPEECH API
// ====================================

// Verifica se o navegador suporta Web Speech API
const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
const speechSynthesis = window.speechSynthesis || window.webkitSpeechSynthesis;

// Flag para controlar se há áudio sendo reproduzido
let audioEmReproducao = false;

// Registra se a API está disponível
if (speechSynthesis && SpeechSynthesisUtterance) {
    console.log('%c✓ Web Speech API disponível - Áudio funcionará', 'color: green;');
} else {
    console.warn('%c⚠️ Web Speech API não disponível - Áudio não funcionará', 'color: orange;');
}

// ====================================
// 2. FUNÇÕES DE ÁUDIO PARA REVISÃO
// ====================================

/**
 * Pronuncia a palavra/termo em inglês
 * Chamada pelo botão "🔊 Ouvir em inglês" na página review.html
 * 
 * Vinculado ao: Elemento HTML com id='reviewWordEnglish'
 * 
 * Uso: <button onclick="ouvirEmIngles()">🔊 Ouvir em inglês</button>
 */
function ouvirEmIngles() {
    // Obtém a palavra em inglês que está sendo exibida
    const palavra = document.getElementById('reviewWordEnglish');
    
    if (palavra && palavra.textContent) {
        const texto = palavra.textContent.trim();
        // Pronuncia em inglês (idioma: en-US)
        falarTexto(texto, 'en-US');
    } else {
        console.warn('Nenhuma palavra em inglês encontrada');
    }
}

/**
 * Pronuncia a frase em inglês
 * Chamada pelo botão "🔊 Ouvir frase em inglês" na página review.html
 * 
 * Vinculado ao: Elemento HTML com id='reviewPhraseEnglish'
 * 
 * Uso: <button onclick="ouvirFraseEmIngles()">🔊 Ouvir frase em inglês</button>
 */
function ouvirFraseEmIngles() {
    // Obtém a frase em inglês que está sendo exibida
    const frase = document.getElementById('reviewPhraseEnglish');
    
    if (frase && frase.textContent && frase.textContent !== '-') {
        const texto = frase.textContent.trim();
        // Pronuncia em inglês (idioma: en-US)
        falarTexto(texto, 'en-US');
    } else {
        console.warn('Nenhuma frase em inglês encontrada');
    }
}

/**
 * Pronuncia a palavra/termo em português
 * Chamada pelo botão "🔊 Ouvir em Português" na página review.html
 * 
 * Vinculado ao: Elemento HTML com id='reviewWordPortuguese'
 * 
 * Uso: <button onclick="ouvirEmPortugues()">🔊 Ouvir em Português</button>
 */
function ouvirEmPortugues() {
    // Obtém a palavra em português que está sendo exibida
    const palavra = document.getElementById('reviewWordPortuguese');
    
    if (palavra && palavra.textContent) {
        const texto = palavra.textContent.trim();
        // Pronuncia em português (idioma: pt-BR)
        falarTexto(texto, 'pt-BR');
    } else {
        console.warn('Nenhuma palavra em português encontrada');
    }
}

// ====================================
// 3. FUNÇÃO BASE DE SÍNTESE DE FALA
// ====================================

/**
 * Função base para pronunciar qualquer texto
 * Usa Web Speech API (SpeechSynthesis)
 * 
 * @param {string} texto - Texto a ser pronunciado
 * @param {string} idioma - Código do idioma (ex: 'en-US', 'pt-BR')
 * @param {number} velocidade - Velocidade da fala (0.5 a 2, padrão: 1)
 * @param {number} volume - Volume (0 a 1, padrão: 1)
 * @param {number} pitch - Tom da voz (0.5 a 2, padrão: 1)
 * 
 * Uso: falarTexto('Hello', 'en-US')
 */
function falarTexto(texto, idioma = 'pt-BR', velocidade = 1, volume = 1, pitch = 1) {
    // Validações
    if (!speechSynthesis || !SpeechSynthesisUtterance) {
        alert('Seu navegador não suporta áudio. Tente usar Chrome, Firefox ou Edge.');
        return;
    }
    
    if (!texto || texto.trim() === '') {
        console.warn('Texto vazio - nada a pronunciar');
        return;
    }
    
    // Se há áudio sendo reproduzido, para antes de iniciar novo
    if (audioEmReproducao) {
        speechSynthesis.cancel();
    }
    
    try {
        // Cria uma nova utterância (unidade de fala)
        const utterance = new SpeechSynthesisUtterance(texto);
        
        // Configura propriedades da fala
        utterance.lang = idioma;                // Idioma
        utterance.rate = velocidade;            // Velocidade
        utterance.volume = volume;              // Volume
        utterance.pitch = pitch;                // Tom
        
        // Callback quando a fala começa
        utterance.onstart = () => {
            audioEmReproducao = true;
            console.log(`🔊 Pronunciando em ${idioma}: "${texto}"`);
        };
        
        // Callback quando a fala termina
        utterance.onend = () => {
            audioEmReproducao = false;
            console.log('✓ Áudio concluído');
        };
        
        // Callback em caso de erro
        utterance.onerror = (evento) => {
            audioEmReproducao = false;
            console.error('Erro ao pronunciar:', evento.error);
        };
        
        // Inicia a reprodução de áudio
        speechSynthesis.speak(utterance);
        
    } catch (erro) {
        audioEmReproducao = false;
        console.error('Erro na síntese de fala:', erro);
        alert('Erro ao reproduzir áudio. Tente novamente.');
    }
}

// ====================================
// 4. CONTROLE DE ÁUDIO GLOBAL
// ====================================

/**
 * Para qualquer áudio em reprodução
 * Útil para cancelar áudio quando sai da página
 * 
 * Uso: pararAudio()
 */
function pararAudio() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
        audioEmReproducao = false;
        console.log('⏹️ Áudio parado');
    }
}

/**
 * Pausa o áudio em reprodução
 * (Nota: nem todos os navegadores suportam pause)
 * 
 * Uso: pausarAudio()
 */
function pausarAudio() {
    if (speechSynthesis && speechSynthesis.pause) {
        speechSynthesis.pause();
        console.log('⏸️ Áudio pausado');
    }
}

/**
 * Retoma o áudio pausado
 * (Nota: nem todos os navegadores suportam resume)
 * 
 * Uso: resumirAudio()
 */
function resumirAudio() {
    if (speechSynthesis && speechSynthesis.resume) {
        speechSynthesis.resume();
        console.log('▶️ Áudio retomado');
    }
}

// ====================================
// 5. OBTER VOZES DISPONÍVEIS
// ====================================

/**
 * Retorna lista de vozes disponíveis no navegador
 * Útil para debug e seleção de vozes específicas
 * 
 * @returns {array} - Array de vozes disponíveis
 * 
 * Uso: const vozes = obterVozesDisponiveis()
 */
function obterVozesDisponiveis() {
    if (!speechSynthesis) return [];
    
    // speechSynthesis.getVoices() é assíncrono em alguns navegadores
    return speechSynthesis.getVoices();
}

/**
 * Lista todas as vozes disponíveis no console (para debug)
 * 
 * Uso: listarVozesDebug()
 */
function listarVozesDebug() {
    const vozes = obterVozesDisponiveis();
    
    if (vozes.length === 0) {
        console.log('Nenhuma voz disponível');
        return;
    }
    
    console.log('=== VOZES DISPONÍVEIS ===');
    vozes.forEach((voz, index) => {
        console.log(`${index}: ${voz.name} (${voz.lang}) - ${voz.default ? 'PADRÃO' : ''}`);
    });
}

// ====================================
// 6. LISTENER PARA QUANDO A PÁGINA SAIR
// ====================================

// Para qualquer áudio em reprodução quando sai da página
window.addEventListener('beforeunload', () => {
    pararAudio();
});

// ====================================
// 7. INICIALIZAÇÃO DO CONSOLE
// ====================================

// Quando o arquivo carrega, mostra que o áudio está pronto
console.log('%c✓ Funções de áudio carregadas com sucesso!', 'color: green; font-weight: bold;');
