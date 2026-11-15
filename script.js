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

// Clique único e limpo para iniciar vídeo e música
btnJogar.addEventListener('click', () => {
    telaStart.style.display = 'none';

    // Inicia a música de fundo mais baixa durante a introdução
    if (musicaFundo) {
        musicaFundo.volume = 0.2; 
        musicaFundo.play().catch(() => {});
    }

    // Inicia o vídeo de introdução do zero e com som
    videoIntro.currentTime = 0;
    videoIntro.muted = false;
    videoIntro.play().catch((erro) => {
        console.log("Vídeo não pôde iniciar, indo para o laboratório:", erro);
        finalizarIntro();
    });
});

function finalizarIntro() {
    if (!naIntroducao) return;
    naIntroducao = false;
    videoIntro.pause();
    telaIntro.style.display = 'none';
    
    // Aumenta o volume da música quando o jogo começa
    if (musicaFundo) {
        musicaFundo.volume = 0.5;
    }
    
    balaoFala.style.display = 'block';
    emDialogo = true;
}

videoIntro.addEventListener('ended', finalizarIntro);
btnPular.addEventListener('click', finalizarIntro);

function fecharDialogo() {
    if (!emDialogo) return;
    emDialogo = false;
    balaoFala.style.display = 'none';
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
            cenario.style.backgroundColor = '#000';
            personagem.style.display = 'none';
            porta.style.display = 'none';
        }, 800);
    }
}

function atualizarJogo() {
    if (saiuDoCenario) return;

    if (!naIntroducao && !emDialogo) {
        const limiteEsquerdo = 0;
        const limiteDireito = cenario.clientWidth - personagem.clientWidth;

        if ((teclas.ArrowLeft || teclas.a) && posX > limiteEsquerdo) {
            posX -= velocidade;
            personagem.style.transform = 'scaleX(-1)';
        }

        if ((teclas.ArrowRight || teclas.d) && posX < limiteDireito) {
            posX += velocidade;
            personagem.style.transform = 'scaleX(1)';
        }

        personagem.style.left = posX + 'px';
        verificarColisaoPorta();
    }

    requestAnimationFrame(atualizarJogo);
}

atualizarJogo();
