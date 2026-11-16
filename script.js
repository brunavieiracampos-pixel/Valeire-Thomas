
const personagem = document.getElementById('personagem');
const cenario = document.getElementById('cenario');
const porta = document.getElementById('porta');
const transicao = document.getElementById('transicao');
const balaoFala = document.getElementById('balao-fala');
const fundoVideo = document.getElementById('fundo-video');

const telaStart = document.getElementById('tela-start');
const btnJogar = document.getElementById('btn-jogar');
const telaIntro = document.getElementById('tela-intro');
const videoIntro = document.getElementById('video-intro');
const btnPular = document.getElementById('btn-pular');
const musicaFundo = document.getElementById('musica-fundo');
const cena2 = document.getElementById('cena2');
const textoFala = document.getElementById('texto-fala');

let posX = 100;
const velocidade = 8;
let saiuDoCenario = false;
let naIntroducao = true;
let emDialogo = false;

const teclas = {
    ArrowLeft: false,
    ArrowRight: false,
    a: false,
    d: false
};

let toqueEsquerda = false;
let toqueDireita = false;
let toqueAtivo = false;
let idToque = null;

cenario.style.touchAction = 'none';

function atualizarDirecaoToque(ponto) {
    const rect = cenario.getBoundingClientRect();
    const meioDaTela = rect.left + rect.width / 2;

    toqueEsquerda = ponto.clientX < meioDaTela;
    toqueDireita = !toqueEsquerda;
}

function limparToque() {
    toqueEsquerda = false;
    toqueDireita = false;
    toqueAtivo = false;
    idToque = null;
}

cenario.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return;

    if (naIntroducao || emDialogo) {
        limparToque();
        return;
    }

    event.preventDefault();
    toqueAtivo = true;
    idToque = event.pointerId;

    try {
        cenario.setPointerCapture(event.pointerId);
    } catch (erro) {
        console.log('Captura do toque indisponível:', erro);
    }

    atualizarDirecaoToque(event);
});

cenario.addEventListener('pointermove', (event) => {
    if (!toqueAtivo || event.pointerId !== idToque) return;

    if (naIntroducao || emDialogo) {
        limparToque();
        return;
    }

    event.preventDefault();
    atualizarDirecaoToque(event);
});

cenario.addEventListener('pointerup', (event) => {
    if (event.pointerId === idToque) {
        limparToque();
    }
});

cenario.addEventListener('pointercancel', (event) => {
    if (event.pointerId === idToque) {
        limparToque();
    }
});

cenario.addEventListener('lostpointercapture', (event) => {
    if (event.pointerId === idToque) {
        limparToque();
    }
});

async function prepararTelaDoJogo() {
    try {
        if (cenario.requestFullscreen && !document.fullscreenElement) {
            await cenario.requestFullscreen();
        }

        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
        }
    } catch (erro) {
        console.log('Não foi possível ativar a orientação horizontal:', erro);
    }
}

btnJogar.addEventListener('click', () => {
    prepararTelaDoJogo();
    telaStart.style.display = 'none';

    if (musicaFundo) {
        musicaFundo.volume = 0.2;
        musicaFundo.play().catch(() => {});
    }

    videoIntro.currentTime = 0;
    videoIntro.muted = false;
    videoIntro.play().catch((erro) => {
        console.log('Vídeo não pôde iniciar, indo para o laboratório:', erro);
        finalizarIntro();
    });
});

function finalizarIntro() {
    if (!naIntroducao) return;

    naIntroducao = false;
    videoIntro.pause();
    telaIntro.style.display = 'none';

    if (musicaFundo) {
        musicaFundo.volume = 0.1;
    }

    balaoFala.style.display = 'block';
    emDialogo = true;
    limparToque();
}

videoIntro.addEventListener('ended', finalizarIntro);
btnPular.addEventListener('click', finalizarIntro);

function fecharDialogo() {
    if (!emDialogo) return;

    emDialogo = false;
    balaoFala.style.display = 'none';
    limparToque();
}

balaoFala.addEventListener('click', fecharDialogo);

window.addEventListener('keydown', (event) => {
    if (naIntroducao) {
        if (event.key === 'Escape') finalizarIntro();
        return;
    }

    if (emDialogo) {
        if (event.key === ' ' || event.key === 'Enter') {
            fecharDialogo();
        }
        return;
    }

    if (event.key in teclas) {
        teclas[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key in teclas) {
        teclas[event.key] = false;
    }
});

function verificarColisaoPorta() {
    if (saiuDoCenario) return;

    const rectPersonagem = personagem.getBoundingClientRect();
    const rectPorta = porta.getBoundingClientRect();

    if (
        rectPersonagem.right >= rectPorta.left &&
        rectPersonagem.left <= rectPorta.right &&
        rectPersonagem.bottom >= rectPorta.top &&
        rectPersonagem.top <= rectPorta.bottom
    ) {
        saiuDoCenario = true;
        transicao.style.opacity = '1';

        setTimeout(() => {
            fundoVideo.style.display = 'none';
            porta.style.display = 'none';
            cena2.style.display = 'block';

            posX = 100;
            personagem.style.left = posX + 'px';
            personagem.style.transform = 'scaleX(1)';
            personagem.style.display = 'block';

            transicao.style.opacity = '0';

            textoFala.innerText = 'Que....lugar é esse??';
            balaoFala.style.left = '150px';
            balaoFala.style.display = 'block';
            emDialogo = true;
            limparToque();
        }, 800);
    }
}

function atualizarJogo() {
    if (!naIntroducao && !emDialogo) {
        const limiteEsquerdo = 0;
        const limiteDireito = cenario.clientWidth - personagem.clientWidth;

        const indoParaEsquerda =
            teclas.ArrowLeft || teclas.a || toqueEsquerda;

        const indoParaDireita =
            teclas.ArrowRight || teclas.d || toqueDireita;

        if (indoParaEsquerda && posX > limiteEsquerdo) {
            posX -= velocidade;
            personagem.style.transform = 'scaleX(-1)';
        }

        if (indoParaDireita && posX < limiteDireito) {
            posX += velocidade;
            personagem.style.transform = 'scaleX(1)';
        }

        posX = Math.max(limiteEsquerdo, Math.min(posX, limiteDireito));
        personagem.style.left = posX + 'px';

        if (!saiuDoCenario) {
            verificarColisaoPorta();
        }
    }

    requestAnimationFrame(atualizarJogo);
}

atualizarJogo();
;

