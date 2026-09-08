// ============================================================
// SCRIPT.JS — Minimal Store Checkout
// ============================================================
// Este arquivo contém toda a lógica JavaScript da página:
//   1. Alternância de tema (Light Mode / Dark Mode)
//   2. Troca entre abas de pagamento (Cartão, PIX, Boleto)
//   3. Botões de copiar (chave PIX e linha digitável do boleto)
//   4. Validação de cupom de desconto
//   5. Máscaras de formatação para campos de formulário
// ============================================================


// ============================================================
// 1. ALTERNÂNCIA DE TEMA (LIGHT MODE / DARK MODE)
// ============================================================
// O tema é controlado pela classe "dark" no elemento <html>.
// Quando a classe "dark" está presente, o Tailwind CSS aplica
// automaticamente todas as variantes dark: (ex: dark:bg-gray-900).
// Também atualizamos o atributo data-theme no <html> conforme
// solicitado na atividade.
// ============================================================

// Referência ao elemento <html> da página
var elementoHtml = document.documentElement;

// Referências aos elementos do botão de troca de tema no cabeçalho
var botaoTema = document.getElementById('botao-tema');
var iconeTema = document.getElementById('icone-tema');
var textoTema = document.getElementById('texto-tema');

/**
 * Carrega o tema salvo no navegador do usuário.
 * Se o usuário já escolheu um tema antes, ele é recuperado
 * do localStorage. Caso contrário, inicia no modo claro (light).
 */
function carregarTema() {
    // Busca o tema salvo no localStorage do navegador
    var temaSalvo = localStorage.getItem('theme');

    // Se o tema salvo for "dark", ativa o modo escuro
    if (temaSalvo === 'dark') {
        ativarModoEscuro();
    } else {
        // Caso contrário, ativa o modo claro (padrão)
        ativarModoClaro();
    }
}

/**
 * Ativa o Modo Escuro (Dark Mode).
 * - Adiciona a classe "dark" no <html> (necessário para o Tailwind)
 * - Define o atributo data-theme="dark" no <html>
 * - Atualiza o ícone e texto do botão para indicar "Light mode"
 * - Salva a preferência no localStorage
 */
function ativarModoEscuro() {
    // Adiciona a classe "dark" — o Tailwind vai aplicar as variantes dark:
    elementoHtml.classList.add('dark');

    // Define o atributo data-theme="dark" conforme solicitado na atividade
    elementoHtml.setAttribute('data-theme', 'dark');

    // Atualiza o botão: mostra ícone de sol (para indicar que clicando volta ao claro)
    iconeTema.textContent = '☀️';
    textoTema.textContent = 'Light mode';

    // Salva a preferência no navegador para manter ao recarregar a página
    localStorage.setItem('theme', 'dark');
}

/**
 * Ativa o Modo Claro (Light Mode).
 * - Remove a classe "dark" do <html>
 * - Define o atributo data-theme="light" no <html>
 * - Atualiza o ícone e texto do botão para indicar "Dark mode"
 * - Salva a preferência no localStorage
 */
function ativarModoClaro() {
    // Remove a classe "dark" — o Tailwind volta às classes padrão (light)
    elementoHtml.classList.remove('dark');

    // Define o atributo data-theme="light" conforme solicitado na atividade
    elementoHtml.setAttribute('data-theme', 'light');

    // Atualiza o botão: mostra ícone de lua (para indicar que clicando vai ao escuro)
    iconeTema.textContent = '🌙';
    textoTema.textContent = 'Dark mode';

    // Salva a preferência no navegador
    localStorage.setItem('theme', 'light');
}

/**
 * Alterna entre os temas Light e Dark.
 * Verifica se o modo escuro está ativo e troca para o oposto.
 * Isso permite alternar sem recarregar a página.
 */
function alternarTema() {
    // Se a classe "dark" está presente, o modo escuro está ativo
    if (elementoHtml.classList.contains('dark')) {
        ativarModoClaro();   // Troca para claro
    } else {
        ativarModoEscuro();  // Troca para escuro
    }
}

// Adiciona o evento de clique no botão de alternância de tema
botaoTema.addEventListener('click', alternarTema);

// Carrega o tema salvo assim que a página abre
carregarTema();


// ============================================================
// 2. ABAS DE FORMA DE PAGAMENTO (CARTÃO / PIX / BOLETO)
// ============================================================
// Ao clicar em uma aba, o conteúdo correspondente é exibido
// e os valores no resumo são atualizados conforme o método.
// ============================================================

// Seleciona todas as abas de pagamento pela classe "aba-pagamento"
var todasAbas = document.querySelectorAll('.aba-pagamento');

// Seleciona todos os painéis de conteúdo pela classe "conteudo-pagamento"
var todosConteudos = document.querySelectorAll('.conteudo-pagamento');

// Referências aos elementos do resumo que mudam conforme o método
var textoBotaoFinalizar = document.getElementById('texto-botao-finalizar');
var valorTotal = document.getElementById('valor-total');
var textoParcelas = document.getElementById('texto-parcelas');
var linhaDesconto = document.getElementById('linha-desconto');
var valorDesconto = document.getElementById('valor-desconto');

// Classes visuais que definem uma aba como ATIVA (selecionada)
var classesAbaAtiva = [
    'bg-gray-50',        // Fundo cinza claro
    'dark:bg-gray-800',  // Fundo escuro no dark mode
    'text-gray-900',     // Texto escuro
    'dark:text-white',   // Texto claro no dark mode
    'border-2',          // Borda espessa
    'border-gray-900',   // Borda escura
    'dark:border-white', // Borda clara no dark mode
    'rounded-xl'         // Cantos arredondados
];

// Classes visuais que definem uma aba como INATIVA (não selecionada)
var classesAbaInativa = [
    'text-gray-500',       // Texto cinza
    'dark:text-gray-400'   // Texto cinza claro no dark mode
];

/**
 * Ativa uma aba de pagamento específica.
 * - Remove o estilo ativo de todas as abas
 * - Aplica o estilo ativo na aba clicada
 * - Esconde todos os conteúdos e mostra apenas o correspondente
 * - Atualiza os valores no resumo da compra
 *
 * @param {HTMLElement} abaSelecionada - O botão da aba que foi clicado
 */
function ativarAba(abaSelecionada) {
    // Pega o valor do atributo data-aba (ex: "cartao", "pix", "boleto")
    var metodo = abaSelecionada.getAttribute('data-aba');

    // PASSO 1: Remove as classes ativas de TODAS as abas
    // e adiciona as classes inativas em cada uma
    todasAbas.forEach(function(aba) {
        // Remove cada classe ativa
        classesAbaAtiva.forEach(function(classe) {
            aba.classList.remove(classe);
        });
        // Adiciona cada classe inativa
        classesAbaInativa.forEach(function(classe) {
            aba.classList.add(classe);
        });
    });

    // PASSO 2: Na aba que foi clicada, faz o inverso:
    // remove as classes inativas e adiciona as classes ativas
    classesAbaInativa.forEach(function(classe) {
        abaSelecionada.classList.remove(classe);
    });
    classesAbaAtiva.forEach(function(classe) {
        abaSelecionada.classList.add(classe);
    });

    // PASSO 3: Esconde TODOS os painéis de conteúdo
    todosConteudos.forEach(function(conteudo) {
        conteudo.classList.add('hidden'); // Adiciona "hidden" para esconder
    });

    // PASSO 4: Mostra apenas o painel correspondente à aba clicada
    // O ID do painel segue o padrão: "conteudo-" + valor do data-aba
    var painelAtivo = document.getElementById('conteudo-' + metodo);
    if (painelAtivo) {
        painelAtivo.classList.remove('hidden'); // Remove "hidden" para mostrar
    }

    // PASSO 5: Atualiza os valores no resumo da compra
    atualizarResumo(metodo);
}

/**
 * Atualiza os textos e valores do resumo da compra
 * de acordo com o método de pagamento selecionado.
 *
 * @param {string} metodo - "cartao", "pix" ou "boleto"
 */
function atualizarResumo(metodo) {
    if (metodo === 'cartao') {
        // Cartão: total com desconto padrão (10%)
        valorTotal.textContent = 'R$ 260,10';
        textoParcelas.textContent = '3x de R$ 86,70 sem juros';
        textoParcelas.classList.remove('hidden');
        textoBotaoFinalizar.textContent = 'Finalizar Pedido • R$ 260,10';
        linhaDesconto.classList.remove('hidden');
        valorDesconto.textContent = '- R$ 28,90';

    } else if (metodo === 'pix') {
        // PIX: desconto de 5% (preço especial)
        valorTotal.textContent = 'R$ 274,55';
        textoParcelas.textContent = 'Desconto de 5% aplicado no PIX';
        textoParcelas.classList.remove('hidden');
        textoBotaoFinalizar.textContent = 'Gerar Código PIX • R$ 274,55';
        linhaDesconto.classList.remove('hidden');
        valorDesconto.textContent = '- R$ 14,45';

    } else if (metodo === 'boleto') {
        // Boleto: sem desconto, valor cheio
        valorTotal.textContent = 'R$ 289,00';
        textoParcelas.textContent = 'Compensação em até 3 dias úteis';
        textoParcelas.classList.remove('hidden');
        textoBotaoFinalizar.textContent = 'Gerar Boleto Bancário';
        linhaDesconto.classList.add('hidden'); // Esconde a linha de desconto
    }
}

// Adiciona o evento de clique em cada aba de pagamento
todasAbas.forEach(function(aba) {
    aba.addEventListener('click', function() {
        ativarAba(aba);
    });
});


// ============================================================
// 3. BOTÕES DE COPIAR (PIX E BOLETO)
// ============================================================
// Ao clicar no botão "Copiar", o texto é copiado para a
// área de transferência e o botão mostra "Copiado!" por 2 segundos.
// ============================================================

/**
 * Configura um botão de copiar texto para a área de transferência.
 * Após copiar, mostra a mensagem "Copiado!" por 2 segundos.
 *
 * @param {string} idBotao - O ID do botão no HTML
 * @param {string} textoParaCopiar - O texto que será copiado
 */
function configurarBotaoCopiar(idBotao, textoParaCopiar) {
    // Busca o botão pelo ID
    var botao = document.getElementById(idBotao);

    // Se o botão não existir na página, não faz nada
    if (!botao) return;

    // Adiciona o evento de clique no botão
    botao.addEventListener('click', function() {
        // Usa a API do navegador para copiar o texto
        navigator.clipboard.writeText(textoParaCopiar).then(function() {
            // Encontra o <span> dentro do botão que contém o texto "Copiar"
            var spanTexto = botao.querySelector('span');
            var textoOriginal = spanTexto.textContent;

            // Muda o texto para "Copiado!" como feedback visual
            spanTexto.textContent = 'Copiado!';

            // Depois de 2 segundos, volta ao texto original
            setTimeout(function() {
                spanTexto.textContent = textoOriginal;
            }, 2000);
        });
    });
}

// Configura o botão de copiar a chave PIX
configurarBotaoCopiar(
    'botao-copiar-pix',
    '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);

// Configura o botão de copiar a linha digitável do boleto
configurarBotaoCopiar(
    'botao-copiar-boleto',
    '23793.38128 60000.000003 00000.000400 1 84340000026010'
);


// ============================================================
// 4. CUPOM DE DESCONTO
// ============================================================
// O usuário pode digitar um código de cupom e clicar em "Aplicar".
// Se o cupom for válido, mostra mensagem de sucesso em verde.
// Se for inválido ou vazio, mostra mensagem de erro em vermelho.
// ============================================================

// Referências aos elementos do cupom
var campoCupom = document.getElementById('campo-cupom');
var botaoAplicarCupom = document.getElementById('botao-aplicar-cupom');
var mensagemCupom = document.getElementById('mensagem-cupom');

// Evento de clique no botão "Aplicar" do cupom
botaoAplicarCupom.addEventListener('click', function() {
    // Pega o valor digitado, remove espaços e converte para maiúsculo
    var cupom = campoCupom.value.trim().toUpperCase();

    // Torna a mensagem visível
    mensagemCupom.classList.remove('hidden');

    // Verifica se o cupom é válido
    if (cupom === 'DESCONTO10' || cupom === 'MINIMAL10') {
        // Cupom válido: mostra mensagem de sucesso em verde
        mensagemCupom.textContent = '✓ Cupom aplicado com sucesso! -10% de desconto.';
        mensagemCupom.classList.remove('text-red-500');
        mensagemCupom.classList.add('text-emerald-600', 'dark:text-emerald-400');
        campoCupom.classList.add('border-emerald-500');

    } else if (cupom === '') {
        // Campo vazio: avisa para digitar um cupom
        mensagemCupom.textContent = 'Digite um cupom para aplicar.';
        mensagemCupom.classList.remove('text-emerald-600', 'dark:text-emerald-400');
        mensagemCupom.classList.add('text-red-500');

    } else {
        // Cupom inválido: mostra mensagem de erro em vermelho
        mensagemCupom.textContent = '✗ Cupom inválido. Tente novamente.';
        mensagemCupom.classList.remove('text-emerald-600', 'dark:text-emerald-400');
        mensagemCupom.classList.add('text-red-500');
    }
});


// ============================================================
// 5. MÁSCARAS DE FORMATAÇÃO PARA CAMPOS DE FORMULÁRIO
// ============================================================
// As máscaras formatam automaticamente o que o usuário digita.
// Exemplo: ao digitar "14399033984", o campo mostra "143.990.339-84"
// ============================================================

/**
 * Aplica uma máscara de formatação em um campo de input.
 * A cada caractere digitado, o valor é limpo (só números)
 * e reformatado pela função passada como parâmetro.
 *
 * @param {string} idCampo - O ID do input no HTML
 * @param {function} funcaoFormatar - Função que recebe só números e retorna formatado
 */
function aplicarMascara(idCampo, funcaoFormatar) {
    // Busca o campo pelo ID
    var campo = document.getElementById(idCampo);

    // Se o campo não existir na página, não faz nada
    if (!campo) return;

    // Adiciona o evento "input" que é disparado a cada caractere digitado
    campo.addEventListener('input', function(evento) {
        // Remove tudo que NÃO é número (letras, pontos, traços, etc.)
        var apenasNumeros = evento.target.value.replace(/\D/g, '');

        // Aplica a função de formatação e atualiza o valor do campo
        evento.target.value = funcaoFormatar(apenasNumeros);
    });
}

// ---- Máscara para CPF: 000.000.000-00 ----
aplicarMascara('campo-cpf', function(numeros) {
    // Limita a 11 dígitos (tamanho do CPF)
    numeros = numeros.substring(0, 11);

    // Aplica a formatação progressivamente conforme o usuário digita
    if (numeros.length > 9) {
        // Formato completo: 000.000.000-00
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }
    if (numeros.length > 6) {
        // Formato parcial: 000.000.000
        return numeros.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    }
    if (numeros.length > 3) {
        // Formato parcial: 000.000
        return numeros.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    // Menos de 4 dígitos: sem formatação
    return numeros;
});

// ---- Máscara para Telefone: (00) 00000-0000 ----
aplicarMascara('campo-telefone', function(numeros) {
    // Limita a 11 dígitos (DDD + celular)
    numeros = numeros.substring(0, 11);

    if (numeros.length > 6) {
        // Formato completo: (00) 00000-0000
        return numeros.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    }
    if (numeros.length > 2) {
        // Formato parcial: (00) 00000
        return numeros.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    }
    // Menos de 3 dígitos: sem formatação
    return numeros;
});

// ---- Máscara para CEP: 00.000-000 ----
aplicarMascara('campo-cep', function(numeros) {
    // Limita a 8 dígitos (tamanho do CEP)
    numeros = numeros.substring(0, 8);

    if (numeros.length > 5) {
        // Formato completo: 00.000-000
        return numeros.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2-$3');
    }
    if (numeros.length > 2) {
        // Formato parcial: 00.000
        return numeros.replace(/(\d{2})(\d{1,3})/, '$1.$2');
    }
    // Menos de 3 dígitos: sem formatação
    return numeros;
});
