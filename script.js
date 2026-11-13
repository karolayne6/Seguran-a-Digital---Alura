const senha = document.getElementById("senha");
const mostrar = document.getElementById("mostrar");
const barra = document.getElementById("barra");
const resultado = document.getElementById("resultado");
const dica = document.getElementById("dica");

const requisitos = {
    tamanho: document.getElementById("tamanho"),
    maiuscula: document.getElementById("maiuscula"),
    minuscula: document.getElementById("minuscula"),
    numero: document.getElementById("numero"),
    simbolo: document.getElementById("simbolo")
};

// Atualiza os indicadores de segurança
function atualizarRequisito(elemento, aprovado, texto) {
    elemento.textContent =
        (aprovado ? "✅ " : "❌ ") + texto;
}

// Analisa a senha digitada
function analisarSenha() {

    const valor = senha.value;

    const temTamanho = valor.length >= 12;
    const temMaiuscula = /[A-Z]/.test(valor);
    const temMinuscula = /[a-z]/.test(valor);
    const temNumero = /[0-9]/.test(valor);
    const temSimbolo = /[^A-Za-z0-9]/.test(valor);

    atualizarRequisito(
        requisitos.tamanho,
        temTamanho,
        "Pelo menos 12 caracteres"
    );

    atualizarRequisito(
        requisitos.maiuscula,
        temMaiuscula,
        "Letras maiúsculas"
    );

    atualizarRequisito(
        requisitos.minuscula,
        temMinuscula,
        "Letras minúsculas"
    );

    atualizarRequisito(
        requisitos.numero,
        temNumero,
        "Números"
    );

    atualizarRequisito(
        requisitos.simbolo,
        temSimbolo,
        "Símbolos"
    );

    // Calcula a pontuação
    const pontos = [
        temTamanho,
        temMaiuscula,
        temMinuscula,
        temNumero,
        temSimbolo
    ].filter(Boolean).length;

    // Calcula o tamanho estimado do alfabeto
    let alfabeto = 0;

    if (/[a-z]/.test(valor)) alfabeto += 26;
    if (/[A-Z]/.test(valor)) alfabeto += 26;
    if (/[0-9]/.test(valor)) alfabeto += 10;
    if (/[^A-Za-z0-9]/.test(valor)) alfabeto += 32;

    // Estimativa de entropia em bits
    let entropia = 0;

    if (valor.length > 0 && alfabeto > 0) {
        entropia =
            valor.length * Math.log2(alfabeto);
    }

    document.getElementById("quantidade").textContent =
        valor.length;

    document.getElementById("alfabeto").textContent =
        alfabeto;

    document.getElementById("entropia").textContent =
        entropia.toFixed(2) + " bits";

    // Classificação da senha
    let nivel = "";
    let porcentagem = 0;
    let recomendacao = "";

    if (valor.length === 0) {
        nivel = "Aguardando análise...";
        porcentagem = 0;
        recomendacao =
            "Digite uma senha fictícia para começar.";
    } else if (pontos <= 2) {
        nivel = "Fraca";
        porcentagem = 25;
        recomendacao =
            "Aumente o comprimento e combine diferentes tipos de caracteres.";
    } else if (pontos === 3) {
        nivel = "Razoável";
        porcentagem = 50;
        recomendacao =
            "Sua senha pode melhorar. Acrescente mais variedade e comprimento.";
    } else if (pontos === 4) {
        nivel = "Boa";
        porcentagem = 75;
        recomendacao =
            "Bom resultado! Considere aumentar ainda mais o comprimento.";
    } else {
        nivel = "Atende aos cinco requisitos";
        porcentagem = 100;
        recomendacao =
            "Você cumpriu todos os requisitos deste verificador. Isso não garante que a senha seja segura.";
    }

    barra.style.width = porcentagem + "%";
    resultado.textContent = "Resultado: " + nivel;
    dica.textContent = recomendacao;

    if (valor.length === 0) {
        resultado.style.color = "#18243b";
        barra.style.background = "#cccccc";
    } else if (pontos <= 2) {
        resultado.style.color = "#d93025";
        barra.style.background = "#e74c3c";
    } else if (pontos === 3) {
        resultado.style.color = "#d18b00";
        barra.style.background = "#f1c40f";
    } else {
        resultado.style.color = "#16834a";
        barra.style.background = "#2ecc71";
    }
}

// Analisa automaticamente enquanto digita
senha.addEventListener("input", analisarSenha);

// Mostra ou esconde o campo
mostrar.addEventListener("click", () => {

    if (senha.type === "password") {
        senha.type = "text";
        mostrar.textContent = "Ocultar";
    } else {
        senha.type = "password";
        mostrar.textContent = "Mostrar";
    }

});

// Limpa os campos e os resultados
document.getElementById("limpar").addEventListener("click", () => {

    senha.value = "";
    analisarSenha();

});

analisarSenha();