const personagem = document.getElementById('personagem');
const coelho = document.getElementById('coelho');
const cenario = document.getElementById('cenario');
const porta = document.getElementById('porta');
const transicao = document.getElementById('transicao');
const balaoFala = document.getElementById('balao-fala');
const balaoFala2 = document.getElementById('balao-fala2');
const fundoVideo = document.getElementById('fundo-video');

const telaStart = document.getElementById('tela-start');
const btnJogar = document.getElementById('btn-jogar');
const telaIntro = document.getElementById('tela-intro');
const videoIntro = document.getElementById('video-intro');
const videoCena3 = document.getElementById('video-cena3');
const btnPular = document.getElementById('btn-pular');
const musicaFundo = document.getElementById('musica-fundo');
const cena2 = document.getElementById('cena2');
const cena3 = document.getElementById('cena3');
const textoFala = document.getElementById('texto-fala'); 
const textoFala2 = document.getElementById('texto-fala2'); 

let posX = 100;      // Posição do personagem 1
let posCoelho = 1200;// Posição fixa do coelho no cenário 2
const velocidade = 8;
let saiuDoCenario = false;
let naIntroducao = true;
let emDialogo = false;
let etapaDialogoCena2 = 0; // Controla as falas da cena 2
let coelhoJaFalou = false; // Garante que o coelho só aborde o jogador 1 vez

const teclas = {
    esq: false,
    dir: false
};

// Clique para iniciar vídeo e música
btnJogar.addEventListener('click', () => {
    telaStart.style.display = 'none';

    if (musicaFundo) {
        musicaFundo.volume = 0.2; 
        musicaFundo.play().catch(() => {});
    }

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
    
    if (musicaFundo) {
        musicaFundo.volume = 0.1;
    }
    
    balaoFala.style.display = 'block';
    emDialogo = true;
    
    window.focus();
}

videoIntro.addEventListener('ended', finalizarIntro);
btnPular.addEventListener('click', finalizarIntro);

function fecharDialogo() {
    if (!emDialogo) return;

    if (saiuDoCenario) {
        // Conversa inicial do Cenário 2 (Porta)
        if (etapaDialogoCena2 === 0) {
            balaoFala.style.display = 'none';
            balaoFala2.style.display = 'block';
            etapaDialogoCena2 = 1;
            window.focus();
            return;
        } else if (etapaDialogoCena2 === 1) {
            balaoFala2.style.display = 'none';
            emDialogo = false;
            window.focus();
            return;
        } 
        
        // --- CONVERSA DE PROXIMIDADE COM O COELHO ---
        else if (etapaDialogoCena2 === 2) {
            // 2ª fala: Protagonista ("Um coelho?")
            balaoFala2.style.display = 'none';
            textoFala.innerText = "Um coelho?";
            balaoFala.style.left = Math.max(20, posX - 50) + 'px'; // Acompanha a protagonista
            balaoFala.style.display = 'block';
            etapaDialogoCena2 = 3;
            window.focus();
            return;
        } else if (etapaDialogoCena2 === 3) {
            // 3ª fala: Coelho ("Você está perdida?")
            balaoFala.style.display = 'none';
            textoFala2.innerText = "Você está perdida?";
            balaoFala2.style.left = (posCoelho - 40) + 'px';
            balaoFala2.style.display = 'block';
            etapaDialogoCena2 = 4;
            window.focus();
            return;
        } else if (etapaDialogoCena2 === 4) {
            // 4ª fala: Protagonista ("Você sabe falar!!?")
            balaoFala2.style.display = 'none';
            textoFala.innerText = "Você sabe falar!!?";
            balaoFala.style.left = Math.max(20, posX - 50) + 'px';
            balaoFala.style.display = 'block';
            etapaDialogoCena2 = 5;
            window.focus();
            return;
        } else if (etapaDialogoCena2 === 5) {
            // 5ª fala: Coelho ("E por que não saberia?...")
            balaoFala.style.display = 'none';
            textoFala2.innerText = "E por que não saberia? Afinal, o que faz aqui no espaço da linha cronológica?";
            balaoFala2.style.left = (posCoelho - 40) + 'px';
            balaoFala2.style.display = 'block';
            etapaDialogoCena2 = 6;
            window.focus();
            return;
        } else if (etapaDialogoCena2 === 6) {
            // 6ª fala: Protagonista ("Espaço da linha?..")
            balaoFala2.style.display = 'none';
            textoFala.innerText = "Espaço da linha?..";
            balaoFala.style.left = Math.max(20, posX - 50) + 'px';
            balaoFala.style.display = 'block';
            etapaDialogoCena2 = 7;
            window.focus();
            return;
        } else if (etapaDialogoCena2 === 7) {
            // 7ª fala: Coelho ("vou te explicar melhor!!") e dispara a transição
            balaoFala.style.display = 'none';
            textoFala2.innerText = "vou te explicar melhor!!";
            balaoFala2.style.left = (posCoelho - 40) + 'px';
            balaoFala2.style.display = 'block';
            etapaDialogoCena2 = 8; // Última etapa antes da transição
            window.focus();
            return;
        } else if (etapaDialogoCena2 === 8) {
            // FECHA O ÚLTIMO BALÃO E FAZ A TRANSIÇÃO PARA A CENA 3
            balaoFala2.style.display = 'none';
            
            // Ativa o efeito de escurecer a tela
            transicao.style.opacity = '1';

            setTimeout(() => {
                // Esconde a cena 2 e o personagem
                cena2.style.display = 'none';
                personagem.style.display = 'none';
                
                // Mostra a Cena 3 (vídeo) e força o play para garantir que rode
                cena3.style.display = 'block';
                videoCena3.currentTime = 0;
                videoCena3.play().catch((erro) => {
                    console.log("Erro ao iniciar vídeo da cena 3:", erro);
                });

                // A música de fundo continua tocando sem ser tocada (nenhum comando pause aqui!)
                if (musicaFundo) {
                    musicaFundo.volume = 0.1; // Mantém o volume de fundo agradável
                }
                videoCena3.addEventListener('ended', () => {
                   // Redireciona para o outro repositório/projeto
                window.location.href = "URL_OU_CAMINHO_DO_OUTRO_PROJETO";
});

                // Clareia a tela de volta
                transicao.style.opacity = '0';
                
                emDialogo = false; 
            }, 800);

            window.focus();
            return;
        }
    }

    emDialogo = false;
    balaoFala.style.display = 'none';
    window.focus();
}
balaoFala.addEventListener('click', fecharDialogo);
balaoFala2.addEventListener('click', fecharDialogo);

// Leitura do teclado
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

    if (event.key === 'ArrowLeft' || event.key === 'a') {
        teclas.esq = true;
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        teclas.dir = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        teclas.esq = false;
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        teclas.dir = false;
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

            posCoelho = 1200; 
            coelho.style.left = posCoelho + 'px';
            coelho.style.display = 'block';

            transicao.style.opacity = '0';
            
            etapaDialogoCena2 = 0;
            textoFala.innerText = "Que....lugar é esse??";
            balaoFala.style.left = "150px"; 
            balaoFala.style.display = 'block';

            textoFala2.innerText = "...";
            balaoFala2.style.left = (posCoelho - 30) + 'px';
            balaoFala2.style.display = 'none';

            emDialogo = true; 
        }, 800);
    }
}

// função para checar se a protagonista chegou perto do coelho
function verificarProximidadeCoelho() {
    if (!saiuDoCenario || coelhoJaFalou || emDialogo) return;

    if (Math.abs(posX - posCoelho) < 300) {
        coelhoJaFalou = true; 
        etapaDialogoCena2 = 2; // Inicia a sequência de diálogos perto do coelho

        // 1ª fala: Coelho ("snif*snif*")
        balaoFala.style.display = 'none';
        textoFala2.innerText = "snif*snif*";
        balaoFala2.style.left = (posCoelho - 40) + 'px';
        balaoFala2.style.display = 'block';

        emDialogo = true; // Trava o jogo
    }
}

function atualizarJogo() {
    if (!naIntroducao && !emDialogo) {
        const limiteEsquerdo = 0;
        const limiteDireito = cenario.clientWidth - personagem.clientWidth;

        if (teclas.esq && posX > limiteEsquerdo) {
            posX -= velocidade;
            personagem.style.transform = 'scaleX(-1)';
        }

        if (teclas.dir && posX < limiteDireito) {
            posX += velocidade;
            personagem.style.transform = 'scaleX(1)';
        }

        personagem.style.left = posX + 'px';

        if (!saiuDoCenario) {
            verificarColisaoPorta();
        } else {
            verificarProximidadeCoelho(); // Fica vigiando se chegou perto do coelho
        }
    }

    requestAnimationFrame(atualizarJogo);
}

atualizarJogo();