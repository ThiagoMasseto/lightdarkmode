// ========================================
// Script.js — Minimal Store Checkout
// Alternância Light/Dark Mode + Interações
// ========================================

// ====================
// 1. TEMA (DARK MODE)
// ====================

const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

// Carrega o tema salvo no localStorage ou usa 'light' como padrão
function carregarTema() {
    const temaSalvo = localStorage.getItem('theme');
    if (temaSalvo === 'dark') {
        ativarDarkMode();
    } else {
        ativarLightMode();
    }
}

// Ativa o Dark Mode: adiciona a classe 'dark' e define data-theme="dark"
function ativarDarkMode() {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light mode';
    localStorage.setItem('theme', 'dark');
}

// Ativa o Light Mode: remove a classe 'dark' e define data-theme="light"
function ativarLightMode() {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Dark mode';
    localStorage.setItem('theme', 'light');
}

// Alterna entre os temas sem recarregar a página
function alternarTema() {
    if (html.classList.contains('dark')) {
        ativarLightMode();
    } else {
        ativarDarkMode();
    }
}

// Evento de clique no botão de alternância de tema
themeToggle.addEventListener('click', alternarTema);

// Carrega o tema ao iniciar a página
carregarTema();


// ==============================
// 2. ABAS DE FORMA DE PAGAMENTO
// ==============================

const tabs = document.querySelectorAll('.payment-tab');
const contents = document.querySelectorAll('.payment-content');
const btnFinalizarText = document.getElementById('btn-finalizar-text');
const totalValor = document.getElementById('total-valor');
const totalParcelas = document.getElementById('total-parcelas');
const linhaDesconto = document.getElementById('linha-desconto');
const valorDesconto = document.getElementById('valor-desconto');

// Classes para a aba ativa e inativa
const classesAtiva = ['bg-gray-50', 'dark:bg-gray-800', 'text-gray-900', 'dark:text-white', 'border-2', 'border-gray-900', 'dark:border-white', 'rounded-xl'];
const classesInativa = ['text-gray-500', 'dark:text-gray-400'];

function ativarAba(tabSelecionada) {
    const metodo = tabSelecionada.getAttribute('data-tab');

    // Atualiza estilos das abas
    tabs.forEach(function(tab) {
        classesAtiva.forEach(function(cls) { tab.classList.remove(cls); });
        classesInativa.forEach(function(cls) { tab.classList.add(cls); });
    });
    classesInativa.forEach(function(cls) { tabSelecionada.classList.remove(cls); });
    classesAtiva.forEach(function(cls) { tabSelecionada.classList.add(cls); });

    // Mostra/esconde o conteúdo correspondente
    contents.forEach(function(content) {
        content.classList.add('hidden');
    });
    var conteudoAtivo = document.getElementById('content-' + metodo);
    if (conteudoAtivo) {
        conteudoAtivo.classList.remove('hidden');
    }

    // Atualiza o botão e valores conforme o método de pagamento
    atualizarResumo(metodo);
}

function atualizarResumo(metodo) {
    if (metodo === 'cartao') {
        totalValor.textContent = 'R$ 260,10';
        totalParcelas.textContent = '3x de R$ 86,70 sem juros';
        totalParcelas.classList.remove('hidden');
        btnFinalizarText.textContent = 'Finalizar Pedido • R$ 260,10';
        linhaDesconto.classList.remove('hidden');
        valorDesconto.textContent = '- R$ 28,90';
    } else if (metodo === 'pix') {
        totalValor.textContent = 'R$ 274,55';
        totalParcelas.textContent = 'Desconto de 5% aplicado no PIX';
        totalParcelas.classList.remove('hidden');
        btnFinalizarText.textContent = 'Gerar Código PIX • R$ 274,55';
        linhaDesconto.classList.remove('hidden');
        valorDesconto.textContent = '- R$ 14,45';
    } else if (metodo === 'boleto') {
        totalValor.textContent = 'R$ 289,00';
        totalParcelas.textContent = 'Compensação em até 3 dias úteis';
        totalParcelas.classList.remove('hidden');
        btnFinalizarText.textContent = 'Gerar Boleto Bancário';
        linhaDesconto.classList.add('hidden');
    }
}

// Adiciona eventos de clique a cada aba
tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        ativarAba(tab);
    });
});


// ==============================
// 3. COPIAR CHAVE PIX / BOLETO
// ==============================

function configurarBotaoCopiar(botaoId, textoCopiar) {
    var botao = document.getElementById(botaoId);
    if (!botao) return;

    botao.addEventListener('click', function() {
        navigator.clipboard.writeText(textoCopiar).then(function() {
            var spanTexto = botao.querySelector('span');
            var textoOriginal = spanTexto.textContent;
            spanTexto.textContent = 'Copiado!';
            botao.classList.add('bg-emerald-600');
            setTimeout(function() {
                spanTexto.textContent = textoOriginal;
                botao.classList.remove('bg-emerald-600');
            }, 2000);
        });
    });
}

configurarBotaoCopiar('btn-copiar-pix', '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890');
configurarBotaoCopiar('btn-copiar-boleto', '23793.38128 60000.000003 00000.000400 1 84340000026010');


// ==============================
// 4. CUPOM DE DESCONTO
// ==============================

var cupomInput = document.getElementById('cupom-input');
var btnAplicarCupom = document.getElementById('btn-aplicar-cupom');
var cupomMsg = document.getElementById('cupom-msg');

btnAplicarCupom.addEventListener('click', function() {
    var cupom = cupomInput.value.trim().toUpperCase();
    cupomMsg.classList.remove('hidden');

    if (cupom === 'DESCONTO10' || cupom === 'MINIMAL10') {
        cupomMsg.textContent = '✓ Cupom aplicado com sucesso! -10% de desconto.';
        cupomMsg.classList.remove('text-red-500');
        cupomMsg.classList.add('text-emerald-600', 'dark:text-emerald-400');
        cupomInput.classList.add('border-emerald-500');
    } else if (cupom === '') {
        cupomMsg.textContent = 'Digite um cupom para aplicar.';
        cupomMsg.classList.remove('text-emerald-600', 'dark:text-emerald-400');
        cupomMsg.classList.add('text-red-500');
    } else {
        cupomMsg.textContent = '✗ Cupom inválido. Tente novamente.';
        cupomMsg.classList.remove('text-emerald-600', 'dark:text-emerald-400');
        cupomMsg.classList.add('text-red-500');
    }
});


// ==============================
// 5. MÁSCARAS DE INPUT
// ==============================

function aplicarMascara(inputId, formatarFn) {
    var input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', function(e) {
        var valor = e.target.value.replace(/\D/g, '');
        e.target.value = formatarFn(valor);
    });
}

// Máscara CPF: 000.000.000-00
aplicarMascara('cpf', function(v) {
    v = v.substring(0, 11);
    if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    return v;
});

// Máscara Telefone: (00) 00000-0000
aplicarMascara('telefone', function(v) {
    v = v.substring(0, 11);
    if (v.length > 6) return v.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    if (v.length > 2) return v.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    return v;
});

// Máscara CEP: 00.000-000
aplicarMascara('cep', function(v) {
    v = v.substring(0, 8);
    if (v.length > 5) return v.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2-$3');
    if (v.length > 2) return v.replace(/(\d{2})(\d{1,3})/, '$1.$2');
    return v;
});
