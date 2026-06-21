/* ====================================
   SCRIPT PRINCIPAL - LÓGICA DA APLICAÇÃO
   Arquivo: js/script.js
   
   Este arquivo contém toda a lógica de:
   - Criação, edição e remoção de cards
   - Gestão de dados no localStorage
   - Controlador da interface
   - Lógica de revisão espaçada
   
   Estrutura de um Card no localStorage:
   {
       id: "1718192384920_0.8392",           // ID único
       wordEnglish: "width",                 // Palavra em inglês
       phraseEnglish: "Element width",       // Frase em inglês (opcional)
       wordPortuguese: "largura",            // Palavra em português
       phrasePortuguese: "Largura elemento", // Frase em português (opcional)
       dataCriacao: "2026-06-11T10:30:00",  // Data de criação
       proximaRevisao: "2026-07-01T10:30:00" // Data próxima revisão (20 dias)
   }
   ==================================== */

// ====================================
// 1. VARIÁVEIS GLOBAIS
// ====================================

// Array para armazenar cards durante a revisão
let cardsParaRevisar = [];

// Índice do card atual na revisão
let indiceCardAtual = 0;

// Card atualmente sendo editado
let cardEmEdicao = null;

// Chave do localStorage onde cards são armazenados
const CHAVE_CARDS = 'flashcards_cards';

// ====================================
// 2. INICIALIZAÇÃO
// ====================================

// Quando a página carrega, faz certas operações
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Página carregada - Inicializando aplicação');
    
    // Se estamos na página inicial, atualiza o resumo
    if (document.getElementById('cardsCreated')) {
        atualizarResumoProgresso();
        
        // Verifica se há um card a ser editado (vindo de decks.html)
        const cardIdParaEditar = sessionStorage.getItem('cardIdParaEditar');
        if (cardIdParaEditar) {
            console.log(`📝 Restaurando edição do card: ${cardIdParaEditar}`);
            abrirFormularioEdicao(cardIdParaEditar);
            // Remove o ID do sessionStorage para não repetir na próxima navegação
            sessionStorage.removeItem('cardIdParaEditar');
        }
    }
    
    // Se estamos na página de decks, carrega a lista
    if (document.getElementById('cardsContainer')) {
        carregarListaCards();
    }
});

// ====================================
// 3. FUNÇÕES DA PÁGINA INICIAL (index.html)
// ====================================

/**
 * Abre o formulário modal para criar/editar um card
 * Chamado pelo botão "Criação de novo card"
 * 
 * Vinculado a: <button onclick="abrirFormularioCriacao()">
 * Usa: Elemento com id='formModal'
 */
function abrirFormularioCriacao() {
    // Limpa o formulário (valores vazios)
    document.getElementById('cardForm').reset();
    
    // Limpa a edição anterior (se houver)
    cardEmEdicao = null;
    
    // Mostra o modal
    const modal = document.getElementById('formModal');
    modal.classList.remove('hidden');
    
    // Define o título do modal como "Criar novo card"
    document.querySelector('.modal-header h2').textContent = 'Criar novo card';
    
    console.log('📝 Formulário de criação aberto');
}

/**
 * Abre o formulário para EDITAR um card específico
 * Preenchido com os dados do card
 * 
 * @param {string} id - ID do card a editar
 * 
 * Vinculado a: Botão "Editar" em decks.html
 */
function abrirFormularioEdicao(id) {
    // Procura o card no localStorage
    const cards = obterTodosCards();
    const card = cards.find(c => c.id === id);
    
    if (!card) {
        console.warn(`Card com ID ${id} não encontrado`);
        return;
    }
    
    // Verifica se estamos ainda em decks.html
    // Se sim, salva o ID no sessionStorage e navega para index.html
    if (document.getElementById('cardsContainer')) {
        console.log(`🔄 Preparando edição do card: ${card.wordEnglish}`);
        sessionStorage.setItem('cardIdParaEditar', id);
        navegarPara('index.html');
        return;
    }
    
    // Se chegou aqui, já estamos em index.html
    // Salva qual card está sendo editado
    cardEmEdicao = id;
    
    // Preenche o formulário com os dados do card
    document.getElementById('wordEnglish').value = card.wordEnglish;
    document.getElementById('phraseEnglish').value = card.phraseEnglish || '';
    document.getElementById('wordPortuguese').value = card.wordPortuguese;
    document.getElementById('phrasePortuguese').value = card.phrasePortuguese || '';
    
    // Mostra o modal
    const modal = document.getElementById('formModal');
    modal.classList.remove('hidden');
    
    // Muda o título para indicar edição
    document.querySelector('.modal-header h2').textContent = 'Editar card';
    
    console.log(`✏️ Formulário de edição aberto para card: ${card.wordEnglish}`);
}

/**
 * Fecha o formulário modal
 * Chamado pelo botão "Cancelar" ou botão "✕"
 * 
 * Vinculado a: <button onclick="fecharFormulario()">
 * Usa: Elemento com id='formModal'
 */
function fecharFormulario() {
    // Esconde o modal
    const modal = document.getElementById('formModal');
    modal.classList.add('hidden');
    
    // Limpa a edição
    cardEmEdicao = null;
    
    // Limpa o formulário
    document.getElementById('cardForm').reset();
    
    console.log('❌ Formulário fechado');
}

/**
 * Salva um novo card ou atualiza um existente
 * Chamado pelo formulário ao fazer submit
 * 
 * Vinculado a: <form id="cardForm" onsubmit="salvarNovoCard(event)">
 * Usa: elementos com id dos campos do formulário
 */
function salvarNovoCard(evento) {
    // Previne o envio padrão do formulário
    evento.preventDefault();
    
    // Obtém os valores do formulário
    const wordEnglish = limparTexto(document.getElementById('wordEnglish').value);
    const phraseEnglish = limparTexto(document.getElementById('phraseEnglish').value);
    const wordPortuguese = limparTexto(document.getElementById('wordPortuguese').value);
    const phrasePortuguese = limparTexto(document.getElementById('phrasePortuguese').value);
    
    // ====== VALIDAÇÕES ======
    
    // Campos obrigatórios
    if (estaVazio(wordEnglish)) {
        alert('Preencha: Palavra / termo (inglês)');
        return;
    }
    
    if (estaVazio(wordPortuguese)) {
        alert('Preencha: Palavra / termo (português)');
        return;
    }
    
    // Obtém os cards atuais
    let cards = obterTodosCards();
    
    if (cardEmEdicao) {
        // ====== MODO EDIÇÃO ======
        
        // Encontra o card a editar
        const indice = cards.findIndex(c => c.id === cardEmEdicao);
        
        if (indice !== -1) {
            // Atualiza os dados do card (mantém ID e datas originais)
            cards[indice].wordEnglish = wordEnglish;
            cards[indice].phraseEnglish = phraseEnglish;
            cards[indice].wordPortuguese = wordPortuguese;
            cards[indice].phrasePortuguese = phrasePortuguese;
            
            console.log(`✏️ Card atualizado: ${wordEnglish}`);
        }
    } else {
        // ====== MODO CRIAÇÃO (novo card) ======
        
        // Cria um novo objeto card
        const novoCard = {
            id: gerarID(),                                    // ID único
            wordEnglish: wordEnglish,                        // Palavra em inglês
            phraseEnglish: phraseEnglish,                    // Frase em inglês (opcional)
            wordPortuguese: wordPortuguese,                  // Palavra em português
            phrasePortuguese: phrasePortuguese,              // Frase em português (opcional)
            dataCriacao: new Date().toISOString(),           // Data de criação
            proximaRevisao: calcularProximaRevisao().toISOString() // Próxima revisão (+20 dias)
        };
        
        // Adiciona o novo card ao array
        cards.push(novoCard);
        
        console.log(`✨ Novo card criado: ${wordEnglish}`);
    }
    
    // Salva os cards no localStorage
    salvarTodosCards(cards);
    
    // Limpa as variáveis
    cardEmEdicao = null;
    
    // Fecha o formulário
    fecharFormulario();
    
    // Atualiza o resumo do progresso
    atualizarResumoProgresso();
    
    // Mostra mensagem de sucesso
    alert('Card salvo com sucesso!');
}

// ====================================
// 4. FUNÇÕES DE GERENCIAMENTO DE CARDS
// ====================================

/**
 * Retorna TODOS os cards armazenados no localStorage
 * 
 * @returns {array} - Array de todos os cards
 * 
 * Uso: const cards = obterTodosCards()
 */
function obterTodosCards() {
    return obterDoLocalStorage(CHAVE_CARDS, []);
}

/**
 * Salva TODOS os cards no localStorage
 * 
 * @param {array} cards - Array de cards a salvar
 * 
 * Uso: salvarTodosCards(cardsArray)
 */
function salvarTodosCards(cards) {
    salvarNoLocalStorage(CHAVE_CARDS, cards);
}

/**
 * Remove um card pelo ID
 * Chamado pelo botão "Remover" em decks.html
 * 
 * @param {string} id - ID do card a remover
 * 
 * Vinculado a: <button onclick="removerCard('id_aqui')">
 */
function removerCard(id) {
    // Pede confirmação
    if (!confirm('Tem certeza que deseja remover este card?')) {
        return; // Usuário cancelou
    }
    
    // Obtém os cards
    let cards = obterTodosCards();
    
    // Procura o card a remover
    const indice = cards.findIndex(c => c.id === id);
    
    if (indice === -1) {
        alert('Card não encontrado');
        return;
    }
    
    // Obtém dados do card para log
    const cardRemovido = cards[indice];
    
    // Remove o card do array (remove 1 item no índice encontrado)
    cards.splice(indice, 1);
    
    // Salva no localStorage
    salvarTodosCards(cards);
    
    console.log(`🗑️ Card removido: ${cardRemovido.wordEnglish}`);
    
    // Atualiza a lista
    carregarListaCards();
    
    // Atualiza o resumo
    atualizarResumoProgresso();
    
    // Mostra mensagem de sucesso
    alert('Card removido com sucesso!');
}

// ====================================
// 5. PÁGINA DE DECKS EXISTENTES (decks.html)
// ====================================

/**
 * Carrega e exibe todos os cards criados
 * Chamado quando a página decks.html carrega
 * 
 * Vinculado a: <div id="cardsContainer" class="cards-grid">
 * Usa: Elemento com id='cardsContainer'
 */
function carregarListaCards() {
    // Obtém o container onde cards serão exibidos
    const container = document.getElementById('cardsContainer');
    
    if (!container) {
        console.warn('Container de cards não encontrado');
        return;
    }
    
    // Obtém todos os cards
    const cards = obterTodosCards();
    
    // Limpa o container
    container.innerHTML = '';
    
    // Se não há cards, mostra mensagem
    if (cards.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum card criado. <a href="index.html">Crie seu primeiro!</a></p>';
        console.log('📭 Nenhum card criado ainda');
        return;
    }
    
    // Para cada card, cria um elemento HTML e adiciona ao container
    cards.forEach(card => {
        const cardHTML = criarElementoCard(card);
        container.appendChild(cardHTML);
    });
    
    console.log(`✓ ${cards.length} card(s) carregado(s)`);
}

/**
 * Cria o elemento HTML para um card individual
 * 
 * @param {object} card - Objeto do card
 * @returns {HTMLElement} - Elemento DOM do card
 * 
 * Uso: const cardElement = criarElementoCard(cardObject)
 */
function criarElementoCard(card) {
    // Container do card
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-item';
    
    // Título: Palavra em inglês
    const wordDiv = document.createElement('p');
    wordDiv.className = 'card-item-word';
    wordDiv.textContent = card.wordEnglish;
    cardDiv.appendChild(wordDiv);
    
    // Se houver frase em inglês, mostra
    if (card.phraseEnglish) {
        const phraseDiv = document.createElement('p');
        phraseDiv.className = 'card-item-phrase';
        phraseDiv.textContent = card.phraseEnglish;
        cardDiv.appendChild(phraseDiv);
    }
    
    // Container de botões
    const btnContainer = document.createElement('div');
    btnContainer.className = 'card-item-actions';
    
    // Botão: Editar
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn btn-primary';
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = () => abrirFormularioEdicao(card.id);
    btnContainer.appendChild(btnEditar);
    
    // Botão: Remover
    const btnRemover = document.createElement('button');
    btnRemover.className = 'btn btn-secondary';
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = () => removerCard(card.id);
    btnContainer.appendChild(btnRemover);
    
    cardDiv.appendChild(btnContainer);
    
    return cardDiv;
}

// ====================================
// 6. PÁGINA DE REVISÃO (review.html)
// ====================================

/**
 * Carrega cards e exibe o próximo para revisão
 * Chamado quando review.html carrega
 * 
 * Ordena cards por "Próxima revisão (lembrete)"
 * Cards com próxima revisão mais próxima vêm primeiro
 */
function exibirProximoCard() {
    // Carrega e ordena os cards para revisão
    carregarCardsParaRevisao();
    
    // Se não há cards
    if (cardsParaRevisar.length === 0) {
        console.log('📭 Nenhum card para revisar');
        
        // Mostra mensagem vazia
        const noCardsSection = document.getElementById('noCardsMessage');
        if (noCardsSection) {
            noCardsSection.classList.remove('hidden');
        }
        return;
    }
    
    // Reseta o índice
    indiceCardAtual = 0;
    
    // Mostra o primeiro card
    mostrarCard(0);
}

/**
 * Carrega e ordena cards para revisão
 * Ordena por data de "Próxima revisão"
 * Cards com próxima revisão mais próxima vêm PRIMEIRO
 * 
 * Uso: carregarCardsParaRevisao()
 */
function carregarCardsParaRevisao() {
    // Obtém todos os cards
    const cards = obterTodosCards();
    
    // Ordena por data de próxima revisão (mais próximas primeiro)
    cardsParaRevisar = cards.sort((a, b) => {
        const dataA = new Date(a.proximaRevisao);
        const dataB = new Date(b.proximaRevisao);
        return dataA - dataB; // Ascendente: próximas revisões primeiro
    });
    
    console.log(`📚 ${cardsParaRevisar.length} card(s) carregado(s) para revisão`);
}

/**
 * Mostra um card específico na página de revisão
 * 
 * @param {number} indice - Índice do card a mostrar (começa em 0)
 */
function mostrarCard(indice) {
    // Validação: índice válido?
    if (indice < 0 || indice >= cardsParaRevisar.length) {
        console.warn(`Índice inválido: ${indice}`);
        return;
    }
    
    // Obtém o card
    const card = cardsParaRevisar[indice];
    
    // Preenche os campos em inglês
    document.getElementById('reviewWordEnglish').textContent = card.wordEnglish;
    document.getElementById('reviewPhraseEnglish').textContent = card.phraseEnglish || '-';
    
    // Preenche os campos em português
    document.getElementById('reviewWordPortuguese').textContent = card.wordPortuguese;
    document.getElementById('reviewPhrasePortuguese').textContent = card.phrasePortuguese || '-';
    
    // Mostra/esconde campos vazios
    const englishPhraseContainer = document.getElementById('englishPhraseContainer');
    const portuguesePhraseContainer = document.getElementById('portuguesePhraseContainer');
    
    if (!card.phraseEnglish) {
        englishPhraseContainer?.classList.add('hidden');
    } else {
        englishPhraseContainer?.classList.remove('hidden');
    }
    
    if (!card.phrasePortuguese) {
        portuguesePhraseContainer?.classList.add('hidden');
    } else {
        portuguesePhraseContainer?.classList.remove('hidden');
    }
    
    // Volta para o lado inglês (esconde português)
    const portugueseSide = document.getElementById('portugueseSide');
    const englishSide = document.getElementById('englishSide');
    
    if (englishSide) englishSide.classList.remove('hidden');
    if (portugueseSide) portugueseSide.classList.add('hidden');
    
    // Atualiza a contagem
    atualizarContagemRevisao();
    
    console.log(`📍 Exibindo card ${indice + 1} de ${cardsParaRevisar.length}: ${card.wordEnglish}`);
}

/**
 * Mostra o lado português (resposta) do card
 * Chamado pelo botão "Ver o cartão em Português"
 * 
 * Usa: Elementos com id='englishSide' e 'portugueseSide'
 */
function mostrarLadoPortugues() {
    const englishSide = document.getElementById('englishSide');
    const portugueseSide = document.getElementById('portugueseSide');
    
    if (englishSide) englishSide.classList.add('hidden');
    if (portugueseSide) portugueseSide.classList.remove('hidden');
    
    console.log('🔄 Lado português do card revelado');
}

/**
 * Avança para o próximo card
 * Chamado pelo botão "Próximo card"
 * 
 * Usa: Elemento com id='reviewCounter'
 */
function proximoCard() {
    // Incrementa o índice
    indiceCardAtual++;
    
    // Se passou do total, revisão terminou
    if (indiceCardAtual >= cardsParaRevisar.length) {
        finalizarRevisao();
        return;
    }
    
    // Mostra o próximo card
    mostrarCard(indiceCardAtual);
}

/**
 * Atualiza o contador de cards na revisão
 * Mostra algo tipo: "3 de 10"
 * 
 * Usa: Elemento com id='reviewCounter'
 */
function atualizarContagemRevisao() {
    const counter = document.getElementById('reviewCounter');
    
    if (counter && cardsParaRevisar.length > 0) {
        const numero = indiceCardAtual + 1; // +1 porque começa em 0
        const total = cardsParaRevisar.length;
        counter.textContent = `${numero} de ${total}`;
    }
}

/**
 * Finaliza a revisão e volta para o início
 * Chamado pelo botão "Finalizar revisão"
 * 
 * Redireciona para: index.html
 */
function finalizarRevisao() {
    console.log('✅ Revisão finalizada');
    
    // Limpa os arrays
    cardsParaRevisar = [];
    indiceCardAtual = 0;
    
    // Volta para o início
    alert('Revisão concluída! Parabéns! 🎉');
    navegarPara('index.html');
}

// ====================================
// 7. RESUMO DO PROGRESSO (index.html)
// ====================================

/**
 * Atualiza o resumo do progresso na página inicial
 * Mostra:
 * - Total de cards criados
 * - Data da próxima revisão
 * 
 * Usa: Elementos com id='cardsCreated' e 'nextReview'
 */
function atualizarResumoProgresso() {
    // Obtém todos os cards
    const cards = obterTodosCards();
    
    // ====== CARDS CRIADOS ======
    const cardsCreatedElement = document.getElementById('cardsCreated');
    if (cardsCreatedElement) {
        cardsCreatedElement.textContent = cards.length;
    }
    
    // ====== PRÓXIMA REVISÃO ======
    const nextReviewElement = document.getElementById('nextReview');
    if (nextReviewElement) {
        if (cards.length === 0) {
            // Se não há cards, mostra "Nenhuma"
            nextReviewElement.textContent = 'Nenhuma';
        } else {
            // Ordena por próxima revisão e pega a mais próxima
            const cardProximo = cards.reduce((prev, current) => {
                const prevData = new Date(prev.proximaRevisao);
                const currentData = new Date(current.proximaRevisao);
                return prevData < currentData ? prev : current;
            });
            
            // Formata a data para mostrar
            const dataProxima = new Date(cardProximo.proximaRevisao);
            const dataFormatada = formatarData(dataProxima);
            nextReviewElement.textContent = dataFormatada;
        }
    }
    
    console.log(`📊 Resumo atualizado: ${cards.length} card(s) criado(s)`);
}

// ====================================
// 8. LISTENER DO FORMULÁRIO
// ====================================

// Quando o formulário é enviado, salva o card
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cardForm');
    if (form) {
        form.addEventListener('submit', salvarNovoCard);
    }
});

// ====================================
// 9. INICIALIZAÇÃO DO CONSOLE
// ====================================

console.log('%c✓ Script principal carregado com sucesso!', 'color: green; font-weight: bold;');
