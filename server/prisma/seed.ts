import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_TEMPLATES = [
  {
    name: 'Mapa de Iluminação',
    objectiveType: 'lighting-map',
    content:
      'Um mapa de iluminação define o posicionamento de todas as fontes de luz para uma cena ou locação. Inclui: tipo de luz (natural, artificial, mista), equipamento necessário (refletores, difusores, gelatinas), diagramas de posicionamento, e notas sobre a atmosfera desejada pelo diretor.',
    checklist: [
      'Visitar locação e avaliar luz natural',
      'Definir esquema de iluminação por cena',
      'Listar equipamento necessário',
      'Criar diagrama de posicionamento',
      'Validar com o diretor',
    ],
  },
  {
    name: 'Moodboard Visual',
    objectiveType: 'moodboard',
    content:
      'Um moodboard é uma coleção visual de referências que comunicam o tom, estilo e atmosfera pretendidos. Pode incluir fotografias, frames de filmes, paletas de cores, texturas e tipografia. Serve como referência visual partilhada entre departamentos.',
    checklist: [
      'Reunir referências visuais (filmes, fotografia, arte)',
      'Definir paleta de cores dominante',
      'Organizar por cena ou por tema',
      'Partilhar com o diretor para validação',
    ],
  },
  {
    name: 'Pesquisa Sonora',
    objectiveType: 'sound-research',
    content:
      'Pesquisa sonora envolve a recolha e análise de referências de som para o projeto. Inclui: ambientes sonoros, efeitos especiais, referências musicais, e notas sobre a paisagem sonora desejada. Fundamental para alinhar som com a visão artística.',
    checklist: [
      'Identificar ambientes sonoros por locação',
      'Reunir referências musicais',
      'Listar efeitos sonoros necessários',
      'Avaliar necessidade de gravação em campo',
      'Alinhar com diretor e compositor',
    ],
  },
  {
    name: 'Conceito de Figurino',
    objectiveType: 'costume-concept',
    content:
      'O conceito de figurino define a identidade visual de cada personagem através da roupa. Considera época, classe social, arco dramático, paleta de cores do filme, e praticidade para filmagem. Inclui referências visuais e sketches.',
    checklist: [
      'Analisar cada personagem e seu arco',
      'Definir paleta de cores por personagem',
      'Reunir referências visuais',
      'Criar sketches ou descrições detalhadas',
      'Orçar peças necessárias',
      'Validar com diretor e direção de arte',
    ],
  },
  {
    name: 'Planta de Cenário',
    objectiveType: 'set-design',
    content:
      'A planta de cenário é o desenho técnico do espaço onde a cena acontece. Define mobiliário, adereços, posicionamento de elementos, e como o espaço se relaciona com o enquadramento da câmera. Pode ser um espaço construído ou uma locação adaptada.',
    checklist: [
      'Tirar medidas da locação/estúdio',
      'Criar planta baixa em escala',
      'Definir posicionamento de mobília e adereços',
      'Marcar posições de câmera',
      'Listar materiais e props necessários',
      'Validar com diretor e DP',
    ],
  },
  {
    name: 'Storyboard',
    objectiveType: 'storyboard',
    content:
      'O storyboard é a representação visual sequencial das cenas do filme. Cada quadro mostra enquadramento, movimento de câmera, posição dos atores e ação principal. Serve como guia visual para toda a equipa durante a filmagem.',
    checklist: [
      'Dividir cena em planos/shots',
      'Desenhar ou gerar cada quadro',
      'Anotar movimentos de câmera',
      'Incluir notas de ação e diálogo',
      'Revisar sequência com diretor',
    ],
  },
  {
    name: 'Shot List',
    objectiveType: 'shot-list',
    content:
      'A shot list é a lista detalhada de todos os planos a filmar, organizada por cena e por ordem de filmagem. Inclui: número do plano, tipo de plano, lente, movimento de câmera, descrição da ação, e tempo estimado.',
    checklist: [
      'Listar todos os planos por cena',
      'Definir tipo de plano e lente',
      'Estimar tempo de filmagem por plano',
      'Ordenar por eficiência de filmagem',
      'Validar com AD e DP',
    ],
  },
  {
    name: 'Calendário de Locações',
    objectiveType: 'location-schedule',
    content:
      'O calendário de locações organiza as visitas de repérage, datas de filmagem por locação, e logística associada. Inclui: endereço, contactos, permissões necessárias, horários de luz natural, e condições de acesso.',
    checklist: [
      'Listar todas as locações necessárias',
      'Agendar visitas de repérage',
      'Verificar permissões e licenças',
      'Documentar condições de acesso',
      'Definir datas de filmagem por locação',
    ],
  },
  {
    name: 'Pesquisa de Referências',
    objectiveType: 'reference-research',
    content:
      'Pesquisa de referências visuais, narrativas ou técnicas que informam as decisões criativas do projeto. Pode incluir filmes, séries, fotografias, pinturas, música, ou qualquer material que ajude a comunicar a visão artística.',
    checklist: [
      'Definir área de pesquisa',
      'Reunir referências relevantes',
      'Organizar por categoria/tema',
      'Criar documento ou apresentação',
      'Partilhar com equipa relevante',
    ],
  },
  {
    name: 'Prop List',
    objectiveType: 'prop-list',
    content:
      'A lista de adereços documenta todos os objetos necessários em cena, organizados por cena e locação. Para cada prop: descrição, quantidade, onde conseguir (compra, aluguer, fabricação), estado necessário, e responsável.',
    checklist: [
      'Extrair props do guião por cena',
      'Categorizar: existentes vs. a adquirir',
      'Orçar aquisições necessárias',
      'Atribuir responsável por prop',
      'Verificar continuidade entre cenas',
    ],
  },
  {
    name: 'Breakdown de Cena',
    objectiveType: 'scene-breakdown',
    content:
      'O breakdown de cena é a análise detalhada de todos os elementos necessários para filmar cada cena. Cruza informação de todos os departamentos: figurino, maquilhagem, props, efeitos, figurantes, veículos, e necessidades técnicas.',
    checklist: [
      'Ler e analisar a cena no guião',
      'Listar personagens e figurantes',
      'Identificar figurino e maquilhagem',
      'Listar props e adereços',
      'Identificar necessidades técnicas especiais',
      'Estimar tempo de preparação e filmagem',
    ],
  },
  {
    name: 'Paleta de Cores do Filme',
    objectiveType: 'color-palette',
    content:
      'A paleta de cores define a linguagem cromática do filme como um todo ou por cena/ato. Informa decisões de cenografia, figurino, iluminação e color grading. Deve refletir as emoções e temas narrativos do projeto.',
    checklist: [
      'Analisar temas e emoções por ato',
      'Definir cores dominantes e complementares',
      'Criar swatches visuais',
      'Validar com diretor e DP',
      'Partilhar com arte, figurino e pós-produção',
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // ─── System Templates ───
  console.log('  → Creating system templates...');
  for (const template of SYSTEM_TEMPLATES) {
    await prisma.template.upsert({
      where: {
        id: template.objectiveType, // Use objectiveType as deterministic ID for upsert
      },
      update: {
        name: template.name,
        content: template.content,
        checklist: template.checklist,
      },
      create: {
        id: template.objectiveType,
        name: template.name,
        objectiveType: template.objectiveType,
        content: template.content,
        checklist: template.checklist,
        isSystem: true,
      },
    });
  }
  console.log(`  ✓ ${SYSTEM_TEMPLATES.length} system templates created`);

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
