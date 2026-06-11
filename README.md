# 📚 Flashcards - Guia de Início Rápido

## O que é este projeto?

**Flashcards** é um site responsivo para aprender e praticar **inglês técnico** usando a técnica de **repetição espaçada**. Ele foi desenvolvido para programadores que querem melhorar seu vocabulário e compreensão de termos técnicos em inglês.

---

## 🚀 Como Usar

### 1. Abrir o Site

1. Navegue até a pasta do projeto
2. Abra o arquivo **`index.html`** em seu navegador web
3. O site é totalmente responsivo - funciona em desktop, tablet e celular!

### 2. Criar seu Primeiro Card

1. Na página inicial, clique em **"Criação de novo card"**
2. Preencha os campos:
   - **Palavra / termo (inglês)**: Ex: "width"
   - **Frase em inglês (opcional)**: Ex: "The width property defines the element's size"
   - **Palavra / termo (português)**: Ex: "largura"
   - **Frase em português (opcional)**: Ex: "A propriedade largura define o tamanho do elemento"
3. Clique em **"Adesionar novo card / salvar"**
4. Parabéns! Seu primeiro card foi criado! 🎉

### 3. Ver Cards Criados

1. Na página inicial, clique em **"Ver card existentes"**
2. Todos os cards que você criou serão exibidos
3. Você pode:
   - **Editar**: Modifique qualquer informação
   - **Remover**: Delete cards que não quer mais

### 4. Começar uma Revisão

1. Na página inicial, clique em **"Começar a revisão"**
2. Para cada card:
   - Veja a palavra/termo em inglês
   - Clique nos botões 🔊 para ouvir a pronúncia
   - Tente responder mentalmente
   - Clique "Ver o cartão em Português" para ver a resposta
   - Clique "Próximo card" para continuar
3. Após revisar todos os cards, clique **"Finalizar revisão"**

### 5. Manual Completo

Para instruções detalhadas, clique em **"Manual do site"** na página inicial.

---

## 📁 Estrutura do Projeto

```
flashcards-v3/
│
├── index.html              # 📄 Página inicial (INÍCIO)
├── decks.html              # 📄 Página de cards existentes
├── review.html             # 📄 Página de revisão
├── manual.html             # 📄 Manual do site
│
├── css/
│   └── styles.css          # 🎨 Estilos responsivos (todo o design)
│
├── js/
│   ├── script.js           # ⚙️ Lógica principal (criar, editar, remover, revisar)
│   ├── utils.js            # 🔧 Funções utilitárias comuns
│   └── audio.js            # 🔊 Funções de áudio (text-to-speech)
│
├── data/                   # 📊 Pasta para dados (reservada para futuro)
│
└── README.md               # 📖 Este arquivo
```

---

## 🎨 Cores Utilizadas

- **Preto**: `#000000` - Texto e botões principais
- **Branco**: `#FFFFFF` - Fundo
- **Cinza**: `#D9D9D9` - Cards, campos e elementos secundários

---

## 💾 Armazenamento de Dados

**Todos os seus cards são salvos no navegador!**

- Os dados são armazenados no **localStorage** do navegador
- Você pode acessar o site offline após a primeira visita
- ⚠️ **NÃO limpe o cache/histórico do navegador** ou seus cards serão perdidos!

### Estrutura de um Card (localStorage):
```javascript
{
  id: "1718192384920_0.8392",           // ID único
  wordEnglish: "width",                 // Palavra em inglês
  phraseEnglish: "Element width",       // Frase em inglês (opcional)
  wordPortuguese: "largura",            // Palavra em português
  phrasePortuguese: "Largura elemento", // Frase em português (opcional)
  dataCriacao: "2026-06-11T10:30:00",  // Data de criação
  proximaRevisao: "2026-07-01T10:30:00" // Próxima revisão (+20 dias)
}
```

---

## 🔊 Áudio (Text-to-Speech)

O site usa a **Web Speech API** para pronunciar as palavras:

- 🎙️ Clique em **"🔊 Ouvir em inglês"** para ouvir a pronúncia em inglês
- 🎙️ Clique em **"🔊 Ouvir frase em inglês"** para ouvir a frase
- 🎙️ Clique em **"🔊 Ouvir em Português"** para ouvir em português

### Navegadores Suportados:
- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari

---

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:

- **📱 Celular**: 320px em diante
- **📊 Tablet**: 768px em diante
- **💻 Desktop**: 1024px em diante

Os layouts se adaptam automaticamente ao tamanho da tela!

---

## 🔧 Funcionalidades Técnicas

### Revisão Espaçada
- Cada card tem uma **data de próxima revisão**
- A cada 20 dias que um card é criado, ele fica com prioridade de revisão
- Cards são sempre revisados em ordem de prioridade (próximas revisões primeiro)

### Gerenciamento de Cards
- ✏️ Criar cards
- ✏️ Editar cards
- 🗑️ Remover cards
- 📋 Listar todos os cards

### Interface de Revisão
- 🎯 Exibição clara do card
- 🎙️ Áudio em inglês e português
- ➡️ Navegação fácil entre cards
- 📊 Contador de progresso (ex: "3 de 10")

---

## ⚙️ Como Funciona Internamente

### Fluxo de Criação de Card:

1. Usuário clica em "Criação de novo card"
2. Modal se abre com formulário vazio
3. Usuário preenche os campos obrigatórios
4. Clica em "Adesionar novo card / salvar"
5. O script valida os dados
6. Se válido, cria um novo objeto com:
   - ID único
   - Data de criação
   - Data de próxima revisão (+20 dias)
7. Salva no localStorage
8. Atualiza a página

### Fluxo de Revisão:

1. Usuário clica em "Começar a revisão"
2. Sistema carrega TODOS os cards do localStorage
3. **Ordena por "próxima revisão"** (mais próximas primeiro)
4. Mostra o primeiro card
5. Usuário pode:
   - Ouvir em inglês
   - Ver a resposta em português
   - Ouvir em português
   - Avançar para próximo
6. Após último card, revisão termina

---

## 🐛 Solução de Problemas

### Problema: Meus cards desapareceram
**Solução**: Você pode ter limpado o cache. Os dados são armazenados localmente no navegador.

### Problema: Áudio não funciona
**Solução**: 
- Use um navegador moderno (Chrome, Firefox, Edge)
- Verifique se o volume está ativado
- Alguns navegadores podem pedir permissão

### Problema: Site não aparece responsivo no celular
**Solução**:
- Certifique-se de que JavaScript está habilitado
- Tente recarregar a página
- Tente outro navegador

### Problema: Não consigo editar um card
**Solução**:
- Abra o Inspetor do navegador (F12)
- Verifique se há erros no console
- Tente remover e recriar o card

---

## 📞 Suporte e Dúvidas

Se você tiver dúvidas sobre como usar o site:

1. Consulte o **Manual do Site** (botão dentro da aplicação)
2. Verifique o **troubleshooting** acima
3. Abra o **Inspetor do Navegador** (F12) e verifique o console

---

## 📝 Comentários no Código

**TODOS os arquivos possuem comentários detalhados explicando:**
- O que cada função faz
- Como cada seção funciona
- Linhas de código complexas
- Referências entre arquivos

Abra qualquer arquivo `.js` ou `.html` para entender melhor!

---

## 🚀 Próximos Passos (Futuro)

Possíveis melhorias:
- Sincronizar cards com um banco de dados na nuvem
- Sistema de pontuação/gamificação
- Exportar/importar cards
- Múltiplos decks
- Temas escuros/claros
- Aplicativo mobile

---

## 📜 Licença

Este projeto é gratuito e de código aberto!

---

## 🙏 Agradecimentos

Obrigado por usar o **Flashcards**! 

Esperamos que este site ajude você a melhorar seu inglês técnico e aumentar sua produtividade! 🚀

---

**Criado com ❤️ para programadores que querem aprender inglês**
