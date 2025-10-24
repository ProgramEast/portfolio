document.addEventListener('DOMContentLoaded', () => {

    // 1) Definição dos projetos (Substitua caminhos/textos pelas suas imagens/descrições reais)
    const projects = {
        stayfit: {
            cover: 'img/Tela.png',
            profile: 'img/icon_stayFit.svg',
            desc: 'Descrição do Stay Fit — Lorem ipsum... (substitua pelo texto real).',
            slides: ['img/web_stayfit.png', 'img/web_chuleta.png']
        },
        chuleta: {
            cover: 'img/Tela2.png',
            profile: 'img/chuleta_icon.svg',
            desc: 'Descrição do Chuleta — Deleniti accusantium... (substitua).',
            slides: ['img/web_chuleta.png', 'img/desk_stayfit.png']
        },
        adm: {
            cover: 'img/Tela3.png',
            profile: 'img/ADM.svg',
            desc: 'ADM — painel administrativo e funcionalidades (substitua pelo texto real).',
            slides: ['img/desk_stayfit.png', 'img/renovada_mente.png']
        },
        mente: {
            cover: 'img/Tela4.png',
            profile: 'img/MENTE_RENOVADA.svg',
            desc: 'Mente Renovada — descrição resumida do projeto (substitua).',
            slides: ['img/renovada_mente.png', 'img/web_stayfit.png']
        }
    };

    // 2) Helpers para acessar elementos do DOM que vamos atualizar
    const el = {
        imgCapa: document.getElementById('img-capa'), // Imagem de capa do cartão
        imgProj: document.getElementById('img-proj'), // Imagem de perfil do projeto (círculo)
        pDesc: document.getElementById('p_corpo-card-proj'), // Parágrafo com a descrição
        carouselInner: document.querySelector('#carrosel-projeto .carousel-inner'), // Onde ficam os .carousel-item
        carouselIndicators: document.querySelector('#carrosel-projeto .carousel-indicators'), // Indicadores (dots) se existirem
        carouselEl: document.getElementById('carrosel-projeto'), // Elemento do carrossel (para controlar via bootstrap)
        descItensText: document.getElementById('desc-itens-text')
    };

    // Cria container de indicadores se não existir e atualiza referência
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
        // Checagens de segurança
        if (!el.carouselInner) {
            // tenta reatribuir (caso o seletor tenha sido chamado antes do DOM estar pronto)
            el.carouselInner = document.querySelector('#carrosel-projeto .carousel-inner');
            if (!el.carouselInner) {
                console.warn('carousel-inner não encontrado. Verifique se o elemento #carrosel-projeto .carousel-inner existe no HTML.');
                return;
            }
        }

        ensureIndicatorsContainer();

        // Limpa o conteúdo atual dos slides
        el.carouselInner.innerHTML = '';

        // Cria cada carousel-item e adiciona na carousel-inner
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

        // Se houver indicadores (dots), recria-os para corresponder ao número de slides
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

        // Reinicializa / Obtém a instância do carousel do Bootstrap e garante que volte ao slide 0
        if (el.carouselEl && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
            try {
                const carousel = bootstrap.Carousel.getOrCreateInstance(el.carouselEl);
                carousel.to(0);
            } catch (err) {
                console.warn('Não foi possível controlar o bootstrap carousel via JS:', err);
            }
        }
    }

    // Posiciona o #foto-perfil-proj para que o centro do círculo fique exatamente na borda inferior de #foto-capa
    function positionProfileCircle() {
        const wrapper = document.getElementById('foto-perfil-proj');
        const fotoCapa = document.getElementById('foto-capa');
        const card = wrapper ? wrapper.closest('.div-1-card') : null;

        if (!wrapper || !fotoCapa || !card) return;

        // Em dispositivos menores usamos o comportamento relative definido no CSS
        if (window.innerWidth <= 991) {
            wrapper.style.position = '';
            wrapper.style.top = '';
            wrapper.style.transform = '';
            wrapper.style.left = '';
            return;
        }

        // offsetTop e offsetHeight são relativos ao offsetParent; aqui card é o offsetParent esperado
        const offsetTop = fotoCapa.offsetTop;
        const offsetHeight = fotoCapa.offsetHeight;

        // Queremos que o centro do círculo esteja exatamente na linha inferior de fotoCapa
        const centerY = offsetTop + offsetHeight;

        wrapper.style.position = 'absolute';
        wrapper.style.left = '50%';
        wrapper.style.top = centerY + 'px';
        wrapper.style.transform = 'translate(-50%, -50%)';
    }

    // Ajusta a posição ao redimensionar (debounce)
    window.addEventListener('resize', () => {
        if (window._posProfileTimeout) clearTimeout(window._posProfileTimeout);
        window._posProfileTimeout = setTimeout(() => {
            positionProfileCircle();
        }, 80);
    });

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

        // Atualiza capa (se existir o elemento)
        if (el.imgCapa) el.imgCapa.src = p.cover;
        // Atualiza ícone/perfil do projeto
        if (el.imgProj) el.imgProj.src = p.profile;
        // Atualiza descrição (texto)
        if (el.pDesc) el.pDesc.textContent = p.desc;
        if (el.descItensText) {
            const pNode = el.descItensText.querySelector('p');
            if (pNode) pNode.textContent = p.desc;
        }

        // Recria os slides do carrossel com as imagens do projeto
        rebuildCarousel(p.slides);

        // Chama o reposicionamento do círculo após a atualização (pequeno timeout para garantir render)
        setTimeout(positionProfileCircle, 40);
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

    // Assina o evento load da imagem da capa para reposicionar quando ela terminar de carregar
    if (el.imgCapa) {
        el.imgCapa.addEventListener('load', positionProfileCircle);
    }

    // 4) Carrega um projeto padrão ao abrir a página
    if (projects.stayfit) loadProject('stayfit');

    // Garante posicionamento inicial (após carregar o projeto padrão)
    setTimeout(positionProfileCircle, 60);
});
