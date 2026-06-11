/* ====================================
   FUNÇÕES UTILITÁRIAS COMUNS
   Arquivo: js/utils.js
   
   Este arquivo contém funções que são usadas em múltiplas páginas
   e não estão vinculadas a uma página específica.
   
   Funções disponíveis:
   - navegarPara() - Redireciona para outra página
   - salvarNoLocalStorage() - Salva dados no localStorage
   - obterDoLocalStorage() - Recupera dados do localStorage
   - removerDoLocalStorage() - Remove dados do localStorage
   - limparLocalStorage() - Limpa todo o localStorage
   - gerarID() - Gera um ID único
   ==================================== */

// ====================================
// 1. NAVEGAÇÃO ENTRE PÁGINAS
// ====================================

/**
 * Redireciona o usuário para outra página
 * @param {string} pagina - Nome do arquivo HTML (ex: 'index.html', 'decks.html')
 * 
 * Uso: navegarPara('index.html')
 * Vinculado a: Todos os botões de navegação
 */
function navegarPara(pagina) {
    window.location.href = pagina;
}

// ====================================
// 2. GERENCIAMENTO DE LOCALSTORAGE
// ====================================

/**
 * Salva dados no localStorage do navegador
 * localStorage persiste dados mesmo após fechar o navegador
 * 
 * @param {string} chave - Nome da chave para armazenar (ex: 'cards', 'usuario')
 * @param {any} valor - Valor a ser armazenado (será convertido para JSON)
 * 
 * Uso: salvarNoLocalStorage('cards', cardsArray)
 * Importante: Sempre salve em formato JSON para poder recuperar depois
 */
function salvarNoLocalStorage(chave, valor) {
    try {
        // Converte o valor para JSON (string) antes de salvar
        const jsonString = JSON.stringify(valor);
        localStorage.setItem(chave, jsonString);
        console.log(`✓ Salvo no localStorage: ${chave}`);
    } catch (erro) {
        console.error('Erro ao salvar no localStorage:', erro);
        alert('Erro ao salvar dados. Tente novamente.');
    }
}

/**
 * Recupera dados do localStorage do navegador
 * 
 * @param {string} chave - Nome da chave a recuperar
 * @param {any} padraoVazio - Valor padrão se a chave não existir (opcional)
 * @returns {any} - Valor armazenado ou valor padrão
 * 
 * Uso: const cards = obterDoLocalStorage('cards', [])
 * Se 'cards' não existir, retorna um array vazio []
 */
function obterDoLocalStorage(chave, padraoVazio = null) {
    try {
        // Recupera o valor do localStorage
        const jsonString = localStorage.getItem(chave);
        
        // Se não existir, retorna o padrão
        if (jsonString === null) {
            return padraoVazio;
        }
        
        // Converte a string JSON de volta para objeto/array
        return JSON.parse(jsonString);
    } catch (erro) {
        console.error('Erro ao recuperar do localStorage:', erro);
        return padraoVazio;
    }
}

/**
 * Remove uma chave específica do localStorage
 * 
 * @param {string} chave - Nome da chave a remover
 * 
 * Uso: removerDoLocalStorage('cards')
 */
function removerDoLocalStorage(chave) {
    try {
        localStorage.removeItem(chave);
        console.log(`✓ Removido do localStorage: ${chave}`);
    } catch (erro) {
        console.error('Erro ao remover do localStorage:', erro);
    }
}

/**
 * Limpa TODO o localStorage
 * ⚠️ ATENÇÃO: Isto irá deletar TODOS os dados armazenados!
 * 
 * Uso: limparLocalStorage()
 */
function limparLocalStorage() {
    try {
        if (confirm('Tem certeza? Isto vai deletar TODOS os cards!')) {
            localStorage.clear();
            console.log('✓ localStorage limpo');
            alert('Todos os dados foram deletados');
            location.reload();
        }
    } catch (erro) {
        console.error('Erro ao limpar localStorage:', erro);
    }
}

// ====================================
// 3. GERAÇÃO DE IDs ÚNICOS
// ====================================

/**
 * Gera um ID único baseado em timestamp e número aleatório
 * Usado para identificar cada card de forma única
 * 
 * @returns {string} - ID único (ex: '1718192384920_0.8392')
 * 
 * Uso: const id = gerarID()
 */
function gerarID() {
    // Combina timestamp com número aleatório para garantir unicidade
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ====================================
// 4. FUNÇÕES DE DATA E HORA
// ====================================

/**
 * Formata uma data em formato legível em português
 * 
 * @param {Date|string|number} data - Data a formatar
 * @returns {string} - Data formatada (ex: '11 de junho de 2026')
 * 
 * Uso: const dataFormatada = formatarData(new Date())
 */
function formatarData(data) {
    if (typeof data === 'string' || typeof data === 'number') {
        data = new Date(data);
    }
    
    const opcoes = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        locale: 'pt-BR'
    };
    
    return data.toLocaleDateString('pt-BR', opcoes);
}

/**
 * Calcula quantos dias se passaram desde uma data
 * 
 * @param {Date|string|number} data - Data de referência
 * @returns {number} - Número de dias desde a data
 * 
 * Uso: const diasAtras = diasDesde(cardData)
 */
function diasDesde(data) {
    if (typeof data === 'string' || typeof data === 'number') {
        data = new Date(data);
    }
    
    const hoje = new Date();
    const diferenca = hoje - data;
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    
    return dias;
}

/**
 * Calcula a data de próxima revisão (20 dias a partir de agora)
 * 
 * @returns {Date} - Data de próxima revisão
 * 
 * Uso: const proximaRevisao = calcularProximaRevisao()
 */
function calcularProximaRevisao() {
    const hoje = new Date();
    const proximaRevisao = new Date(hoje);
    proximaRevisao.setDate(proximaRevisao.getDate() + 20);
    return proximaRevisao;
}

// ====================================
// 5. FUNÇÕES DE VALIDAÇÃO
// ====================================

/**
 * Valida se uma string está vazia ou apenas com espaços
 * 
 * @param {string} texto - Texto a validar
 * @returns {boolean} - true se vazio, false se preenchido
 * 
 * Uso: if (estaVazio(palavra)) { alert('Preencha o campo!') }
 */
function estaVazio(texto) {
    return typeof texto !== 'string' || texto.trim() === '';
}

/**
 * Remove espaços extras de um texto (início, fim e entre palavras)
 * 
 * @param {string} texto - Texto a limpar
 * @returns {string} - Texto limpo
 * 
 * Uso: const textoLimpo = limparTexto(texto)
 */
function limparTexto(texto) {
    return texto.trim().replace(/\s+/g, ' ');
}

// ====================================
// 6. FUNÇÕES AUXILIARES
// ====================================

/**
 * Cria um elemento HTML com atributos
 * 
 * @param {string} tag - Tag HTML (ex: 'div', 'button', 'p')
 * @param {string} classname - Classe CSS (opcional)
 * @param {object} atributos - Atributos adicionais (opcional)
 * @returns {HTMLElement} - Elemento criado
 * 
 * Uso: const btn = criarElemento('button', 'btn btn-primary', { onclick: minhaFuncao })
 */
function criarElemento(tag, classname = '', atributos = {}) {
    const elemento = document.createElement(tag);
    
    if (classname) {
        elemento.className = classname;
    }
    
    // Adiciona atributos extras
    Object.keys(atributos).forEach(chave => {
        if (chave === 'onclick') {
            // Para onclick, atribui como função
            elemento.onclick = atributos[chave];
        } else {
            elemento.setAttribute(chave, atributos[chave]);
        }
    });
    
    return elemento;
}

/**
 * Copia um texto para a área de transferência
 * 
 * @param {string} texto - Texto a copiar
 * 
 * Uso: copiarParaAreaTransferencia('Texto copiado!')
 */
function copiarParaAreaTransferencia(texto) {
    try {
        // Cria um textarea temporário
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        document.body.appendChild(textarea);
        
        // Seleciona e copia
        textarea.select();
        document.execCommand('copy');
        
        // Remove o elemento
        document.body.removeChild(textarea);
        
        console.log('✓ Texto copiado para área de transferência');
    } catch (erro) {
        console.error('Erro ao copiar:', erro);
    }
}

// ====================================
// 7. CONSOLELOG PARA DEBUG
// ====================================

/**
 * Log melhorado com emoji e timestamp
 * Útil para debug durante desenvolvimento
 * 
 * @param {string} mensagem - Mensagem a exibir
 * @param {any} dados - Dados a exibir (opcional)
 * 
 * Uso: logDebug('Cards carregados', cardsArray)
 */
function logDebug(mensagem, dados = null) {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    console.log(`[${timestamp}] 📝 ${mensagem}`, dados);
}

/**
 * Log de erro com emoji
 * 
 * @param {string} mensagem - Mensagem de erro
 * @param {any} erro - Objeto de erro (opcional)
 * 
 * Uso: logErro('Falha ao carregar cards', err)
 */
function logErro(mensagem, erro = null) {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    console.error(`[${timestamp}] ❌ ${mensagem}`, erro);
}

// ====================================
// 8. INICIALIZAÇÃO DO CONSOLE
// ====================================

// Quando o arquivo carrega, mostra que as utilidades estão prontas
console.log('%c✓ Funções utilitárias carregadas com sucesso!', 'color: green; font-weight: bold;');
