document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1) Definição Dos Projetos (Substitua Caminhos/Texto Pelas Suas Imagens/Descrições Reais)
    const projects = {
        stayfit: {
            title: 'STAY FIT',
            cover: 'img/Tela.png',
            profile: 'img/icon_stayFit.svg',
            desc: 'Plataforma web responsiva para academias com agendamento de aulas, painel para instrutores, controle de planos e histórico de treinos. Interface intuitiva para alunos e administradores.',
            slides: ['img/web_stayfit.png', 'img/web_stayfit2.png', 'img/web_stayfit3.png', 'img/web_stayfit4.png'],
            coverBg: '#d59e1a',     // Cor do topo do card (exemplo)
            bodyBg: '#c4c4c4',      // Cor do corpo do card
            accent: '#f06a9f'       // Cor "rosa" / destaque do projeto
        },
        chuleta: {
            title: 'CHULETA QUENTE',
            cover: 'img/Tela2.png',
            profile: 'img/chuleta_icon.svg',
            desc: 'Site institucional para restaurante com cardápio dinâmico, galeria de fotos, sistema de reservas e integração para promoções. Foco em experiência visual e facilidade para o cliente conhecer pratos, horários e fazer reserva.',
            slides: ['img/web_chuleta.png', 'img/web_chuleta2.png', 'img/web_chuleta3.png', 'img/web_chuleta4.png'],
            coverBg: '#6fbf73',
            bodyBg: '#eaeaea',
            accent: '#ff6b6b'
        },
        adm: {
            title: 'STAY FIT (ADM)',
            cover: 'img/Tela3.png',
            profile: 'img/ADM.svg',
            desc: 'Aplicação desktop otimizada para gestão interna da academia: cadastro de alunos, controle financeiro, emissão de recibos, relatórios detalhados e sincronização com o sistema web. Ideal para uso em recepção e administração.',
            slides: ['img/desk_stayfit.png', 'img/desk_stayfit2.png', 'img/desk_stayfit3.png', 'img/desk_stayfit4.png'],
            coverBg: '#2b93d6',
            bodyBg: '#f4f4f4',
            accent: '#844feb'
        },
        mente: {
            title: 'MENTE RENOVADA',
            cover: 'img/Tela4.png',
            profile: 'img/MENTE_RENOVADA.svg',
            desc: 'Portal para clínica psicológica com área institucional, agendamento de sessões, perfil dos profissionais e recursos informativos sobre atendimento. Voltado para aproximação com pacientes e gestão segura de horários.',
            slides: ['img/renovada_mente.png', 'img/renovada_mente2.png', 'img/renovada_mente3.png', 'img/renovada_mente4.png'],
            coverBg: '#db9f1b',
            bodyBg: '#f8f8f0ff',
            accent: '#d5e221ff'
        }
    };

    // 2) Helpers Para Acessar Elementos Do DOM Que Vamos Atualizar
    const el = {
        h2Title: document.querySelector('.h2-card-1'), // Título Dinâmico
        imgCapa: document.getElementById('img-capa'), // Imagem De Capa Do Cartão
        imgProj: document.getElementById('img-proj'), // Imagem De Perfil Do Projeto (Círculo)
        pDesc: document.getElementById('p_corpo-card-proj'), // Parágrafo Do Corpo Do Cartão (Primeiro Quadrado)
        carouselInner: document.querySelector('#carrosel-projeto .carousel-inner'), // Onde Ficam Os .carousel-item
        carouselIndicators: document.querySelector('#carrosel-projeto .carousel-indicators'), // Indicadores (dots)
        carouselEl: document.getElementById('carrosel-projeto'), // Elemento Do Carrossel (Para Controlar Via Bootstrap)
        descItensText: document.getElementById('desc-itens-text') // Segundo Quadrado (Onde Colocar A Descrição)
    };

    // Cria Container De Indicadores Se Não Existir E Atualiza Referência
    function ensureIndicatorsContainer() {
        if (!el.carouselEl) return;
        if (!el.carouselIndicators) {
            const indicators = el.carouselEl.querySelector('.carousel-indicators');
            if (!indicators) {
                const div = document.createElement('div');
                div.className = 'carousel-indicators';
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
     * Recria Os Slides Do Carrossel Com As Imagens Passadas.
     * Também Recria Os Indicadores, Se O Container De Indicadores Existir.
     * @param {string[]} slidePaths - Array Com Caminhos Das Imagens
     */
    function rebuildCarousel(slidePaths) {
        // Checagens De Segurança
        if (!el.carouselInner) {
            el.carouselInner = document.querySelector('#carrosel-projeto .carousel-inner');
            if (!el.carouselInner) {
                console.warn('carousel-inner não encontrado. Verifique se o elemento #carrosel-projeto .carousel-inner existe no HTML.');
                return;
            }
        }

        ensureIndicatorsContainer();

        // Limpa O Conteúdo Atual Dos Slides
        el.carouselInner.innerHTML = '';

        // Cria Cada Carousel-Item E Adiciona Na Carousel-Inner
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

        // Se Houver Indicadores (dots), Recria-Os Para Corresponder Ao Número De Slides
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

        // Reinicializa / Obtém A Instância Do Carousel Do Bootstrap E Garante Que Volte Ao Slide 0
        if (el.carouselEl && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
            try {
                const carousel = bootstrap.Carousel.getOrCreateInstance(el.carouselEl);
                carousel.to(0);
            } catch (err) {
                console.warn('Não foi possível controlar o bootstrap carousel via JS:', err);
            }
        }
    }

    // Posiciona O #foto-perfil-proj Para Que O Centro Do Círculo Fique Exatamente Na Borda Inferior De #foto-capa
    function positionProfileCircle() {
        const wrapper = document.getElementById('foto-perfil-proj');
        const fotoCapa = document.getElementById('foto-capa');
        const card = wrapper ? wrapper.closest('.div-1-card') : null;

        if (!wrapper || !fotoCapa || !card) return;

        // Em Dispositivos Menores Usamos O Comportamento Relative Definido No CSS
        if (window.innerWidth <= 991) {
            wrapper.style.position = '';
            wrapper.style.top = '';
            wrapper.style.transform = '';
            wrapper.style.left = '';
            return;
        }

        // OffsetTop E OffsetHeight São Relativos Ao OffsetParent; Aqui Card É O OffsetParent Esperado
        const offsetTop = fotoCapa.offsetTop;
        const offsetHeight = fotoCapa.offsetHeight;

        // Queremos Que O Centro Do Círculo Esteja Exatamente Na Linha Inferior De fotoCapa
        const centerY = offsetTop + offsetHeight;

        wrapper.style.position = 'absolute';
        wrapper.style.left = '50%';
        wrapper.style.top = centerY + 'px';
        wrapper.style.transform = 'translate(-50%, -50%)';
    }

    // Ajusta A Posição Ao Redimensionar (Debounce)
    window.addEventListener('resize', () => {
        if (window._posProfileTimeout) clearTimeout(window._posProfileTimeout);
        window._posProfileTimeout = setTimeout(() => {
            positionProfileCircle();
        }, 80);
    });

    /**
     * Carrega Um Projeto (Capa, Perfil, Descrição E Slides)
     * @param {string} id - Id Do Projeto No Objeto Projects
     */
    function loadProject(id) {
        const p = projects[id];
        if (!p) {
            console.warn('Projeto não encontrado:', id);
            return;
        }

        // Atualiza Título (Se Existir O Elemento)
        if (el.h2Title) el.h2Title.textContent = p.title;

        // Atualiza Capa (Se Existir O Elemento)
        if (el.imgCapa) el.imgCapa.src = p.cover;

        // Atualiza Ícone/Perfil Do Projeto
        if (el.imgProj) el.imgProj.src = p.profile;

        // Atualiza Descrição: limpar Primeiro Quadrado e Atualizar Apenas Segundo Quadrado
        if (el.pDesc) {
            // Limpa o parágrafo do corpo do cartão (primeiro quadrado) para não exibir a descrição ali
            el.pDesc.textContent = '';
        }
        if (el.descItensText) {
            const pNode = el.descItensText.querySelector('p');
            if (pNode) pNode.textContent = p.desc || '';
        }

        // Recria Os Slides Do Carrossel Com As Imagens Do Projeto
        rebuildCarousel(p.slides);

        // Atualiza Variáveis CSS Para Mudar Cores Do Card E Dos "Quadrados"
        document.documentElement.style.setProperty('--cover-bg', p.coverBg || '#cfff7a');
        document.documentElement.style.setProperty('--body-bg', p.bodyBg || '#c4c4c4');
        document.documentElement.style.setProperty('--accent-color', p.accent || '#844feb');

        // Adiciona Classe Selected Ao Ícone Clicado (Garante Consistência Visual)
        document.querySelectorAll('.icon-proj').forEach(i => {
            if (i.dataset.project === id) i.classList.add('selected');
            else i.classList.remove('selected');
        });

        // Chama O Reposicionamento Do Círculo Após A Atualização (Pequeno Timeout Para Garantir Render)
        setTimeout(positionProfileCircle, 40);
    }

    // 3) Conecta Os Ícones Na Faixa De Projetos Com O Atributo data-project
    document.querySelectorAll('.icon-proj').forEach(icon => {
        const pid = icon.dataset.project;
        if (!pid) return;
        icon.addEventListener('click', () => {
            loadProject(pid);
            document.querySelectorAll('.icon-proj').forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
        });
    });

    // Assina O Evento load Da Imagem Da Capa Para Reposicionar Quando Ela Terminar De Carregar
    if (el.imgCapa) {
        el.imgCapa.addEventListener('load', positionProfileCircle);
    }

    // 4) Carrega Um Projeto Padrão Ao Abrir A Página
    if (projects.stayfit) loadProject('stayfit');

    // Garante Posicionamento Inicial (Após Carregar O Projeto Padrão)
    setTimeout(positionProfileCircle, 60);
});
