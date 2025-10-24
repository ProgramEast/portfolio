// =====================================================================================
// JS de controle dos projetos e carousel (arquivo separado: js/js.js)
// Mantive seus comentários e estrutura, corrigi pontos que causavam erro quando os elementos
// faltavam (por exemplo carousel-indicators) e garanti compatibilidade com Bootstrap 5.
// =====================================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1) Definição dos projetos (substitua caminhos/textos pelas suas imagens/descrições reais)
    const projects = {
        stayfit: {
            cover: 'img/Tela.png',
            profile: 'img/icon_stayFit.svg',
            desc: 'Descrição do Stay Fit — Lorem ipsum... (substitua pelo texto real).',
            slides: ['img/desk_stayfit.png', 'img/web_chuleta.png']
        },
        chuleta: {
            cover: 'img/web_chuleta.png',
            profile: 'img/chuleta_icon.svg',
            desc: 'Descrição do Chuleta — Deleniti accusantium... (substitua).',
            slides: ['img/web_chuleta.png', 'img/chuleta_s2.png']
        },
        adm: {
            cover: 'img/adm_cover.png',
            profile: 'img/ADM.svg',
            desc: 'ADM — painel administrativo e funcionalidades (substitua pelo texto real).',
            slides: ['img/adm_dash.png', 'img/adm_users.png']
        },
        mente: {
            cover: 'img/mente_cover.png',
            profile: 'img/MENTE_RENOVADA.svg',
            desc: 'Mente Renovada — descrição resumida do projeto (substitua).',
            slides: ['img/mente_1.png', 'img/mente_2.png']
        }
    };

    // 2) Helpers para acessar elementos do DOM que vamos atualizar
    const el = {
        imgCapa: document.getElementById('img-capa'), // imagem de capa do cartão
        imgProj: document.getElementById('img-proj'), // imagem de perfil do projeto (círculo)
        pDesc: document.getElementById('p_corpo-card-proj'), // parágrafo com a descrição
        carouselInner: document.querySelector('#carrosel-projeto .carousel-inner'), // onde ficam os .carousel-item
        carouselIndicators: document.querySelector('#carrosel-projeto .carousel-indicators'), // indicadores (dots) se existirem
        carouselEl: document.getElementById('carrosel-projeto'), // elemento do carrossel (para controlar via bootstrap)
        descItensText: document.getElementById('desc-itens-text')
    };

    // cria container de indicadores se não existir e atualiza referência
    function ensureIndicatorsContainer() {
        if (!el.carouselEl) return;
        if (!el.carouselIndicators) {
            const indicators = el.carouselEl.querySelector('.carousel-indicators');
            if (!indicators) {
                const div = document.createElement('div');
                div.className = 'carousel-indicators';
                // insere antes do .carousel-inner (padrão do Bootstrap)
                const inner = el.carouselEl.querySelector('.carousel-inner');
                if (inner) el.carouselEl.insertBefore(div, inner);
                else el.carouselEl.appendChild(div);
                el.carouselIndicators = div;
            } else {
                el.carouselIndicators = indicators;
            }
        }
    }

    /**
     * Recria os slides do carrossel com as imagens passadas.
     * Também recria os indicadores, se o container de indicadores existir.
     * @param {string[]} slidePaths - array com caminhos das imagens
     */
    function rebuildCarousel(slidePaths) {
        // checagens de segurança
        if (!el.carouselInner) {
            // tenta reatribuir (caso o seletor tenha sido chamado antes do DOM estar pronto)
            el.carouselInner = document.querySelector('#carrosel-projeto .carousel-inner');
            if (!el.carouselInner) {
                console.warn('carousel-inner não encontrado. Verifique se o elemento #carrosel-projeto .carousel-inner existe no HTML.');
                return;
            }
        }

        ensureIndicatorsContainer();

        // limpa o conteúdo atual dos slides
        el.carouselInner.innerHTML = '';

        // cria cada carousel-item e adiciona na carousel-inner
        slidePaths.forEach((src, i) => {
            const item = document.createElement('div');
            item.className = 'carousel-item' + (i === 0 ? ' active' : '');

            const img = document.createElement('img');
            img.className = 'd-block w-100';
            img.src = src;
            img.alt = `slide-${i}`;

            item.appendChild(img);
            el.carouselInner.appendChild(item);
        });

        // se houver indicadores (dots), recria-os para corresponder ao número de slides
        if (el.carouselIndicators) {
            el.carouselIndicators.innerHTML = '';
            slidePaths.forEach((_, i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('data-bs-target', '#carrosel-projeto');
                btn.setAttribute('data-bs-slide-to', String(i));
                btn.setAttribute('aria-label', `Slide ${i + 1}`);
                if (i === 0) {
                    btn.className = 'active';
                    btn.setAttribute('aria-current', 'true');
                }
                el.carouselIndicators.appendChild(btn);
            });
        }

        // reinicializa / obtém a instância do carousel do Bootstrap e garante que volte ao slide 0
        if (el.carouselEl && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
            try {
                const carousel = bootstrap.Carousel.getOrCreateInstance(el.carouselEl);
                carousel.to(0);
            } catch (err) {
                console.warn('Não foi possível controlar o bootstrap carousel via JS:', err);
            }
        }
    }

    /**
     * Carrega um projeto (capa, perfil, descrição e slides)
     * @param {string} id - id do projeto no objeto projects
     */
    function loadProject(id) {
        const p = projects[id];
        if (!p) {
            console.warn('Projeto não encontrado:', id);
            return;
        }

        // atualiza capa (se existir o elemento)
        if (el.imgCapa) el.imgCapa.src = p.cover;
        // atualiza ícone/perfil do projeto
        if (el.imgProj) el.imgProj.src = p.profile;
        // atualiza descrição (texto)
        if (el.pDesc) el.pDesc.textContent = p.desc;
        if (el.descItensText) {
            const pNode = el.descItensText.querySelector('p');
            if (pNode) pNode.textContent = p.desc;
        }

        // recria os slides do carrossel com as imagens do projeto
        rebuildCarousel(p.slides);
    }

    // 3) Conecta os ícones na faixa de projetos com o atributo data-project
    document.querySelectorAll('.icon-proj').forEach(icon => {
        const pid = icon.dataset.project;
        if (!pid) return;
        icon.addEventListener('click', () => {
            loadProject(pid);
            document.querySelectorAll('.icon-proj').forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
        });
    });

    // 4) Carrega um projeto padrão ao abrir a página
    if (projects.stayfit) loadProject('stayfit');
});
