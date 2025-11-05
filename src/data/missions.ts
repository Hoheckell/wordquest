export interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'flashcard' | 'case-study'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number // Em segundos
  dragItems?: { id: string; text: string }[]
  dropZones?: { id: string; label: string; correctItemId: string }[]
}

export interface Mission {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number // Em minutos
  questions: Question[]
  icon: string // Nome do ícone do lucide-vue-next
  color: string // Classe de cor do Tailwind
}

export const missions: Mission[] = [
  {
    id: 'basics-interface',
    title: 'Conhecendo a Interface',
    description: 'Domine os elementos básicos da interface do Word.',
    category: 'Fundamentos',
    difficulty: 'easy',
    estimatedTime: 4,
    icon: 'LayoutDashboard',
    color: 'bg-blue-500',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Qual é a função da Faixa de Opções (Ribbon) no Microsoft Word?',
        options: [
          'Exibir apenas o texto do documento',
          'Organizar comandos e ferramentas em guias temáticas',
          'Salvar automaticamente o documento',
          'Verificar a ortografia'
        ],
        correctAnswer: 'Organizar comandos e ferramentas em guias temáticas',
        explanation: 'A Faixa de Opções organiza todas as ferramentas em guias como Página Inicial, Inserir, Design, etc., facilitando o acesso.',
        difficulty: 'easy',
        timeLimit: 30
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'A Barra de Ferramentas de Acesso Rápido é fixa e não pode ser personalizada pelo usuário.',
        correctAnswer: 'false',
        explanation: 'Você pode adicionar ou remover seus comandos favoritos da Barra de Ferramentas de Acesso Rápido para agilizar seu trabalho.',
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        id: 'q3',
        type: 'drag-drop',
        question: 'Associe cada elemento da interface com sua função principal:',
        dragItems: [
          { id: 'item1', text: 'Faixa de Opções' },
          { id: 'item2', text: 'Barra de Status' },
          { id: 'item3', text: 'Régua' }
        ],
        dropZones: [
          { id: 'zone1', label: 'Mostra informações como contagem de palavras e zoom.', correctItemId: 'item2' },
          { id: 'zone2', label: 'Permite ajustar margens e tabulações visualmente.', correctItemId: 'item3' },
          { id: 'zone3', label: 'Contém as guias com todos os comandos e ferramentas.', correctItemId: 'item1' }
        ],
        correctAnswer: ['item2', 'item3', 'item1'],
        explanation: 'Barra de Status (informações), Régua (margens) e Faixa de Opções (comandos) são partes essenciais da interface.',
        difficulty: 'medium',
        timeLimit: 45
      },
      {
        id: 'q4',
        type: 'flashcard',
        question: 'Qual atalho do teclado abre a caixa de diálogo "Salvar Como"?',
        correctAnswer: 'F12',
        explanation: 'A tecla F12 é o atalho universal para "Salvar Como", permitindo que você salve o documento com um novo nome ou em um novo local.',
        difficulty: 'easy',
        timeLimit: 25
      }
    ]
  },
  {
    id: 'formatting-text',
    title: 'Formatação de Texto',
    description: 'Aprenda a formatar textos como um profissional.',
    category: 'Formatação',
    difficulty: 'easy',
    estimatedTime: 5,
    icon: 'TextCursor',
    color: 'bg-green-500',
    questions: [
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'Qual atalho de teclado aplica formatação de ITÁLICO ao texto selecionado?',
        options: ['Ctrl + I', 'Ctrl + B', 'Ctrl + U', 'Ctrl + N'],
        correctAnswer: 'Ctrl + I',
        explanation: 'Ctrl + I (Italic) aplica ou remove o estilo de fonte itálico do texto selecionado.',
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        id: 'q6',
        type: 'case-study',
        question: 'Você precisa criar um documento formal para um trabalho acadêmico (normas ABNT). Qual combinação de fonte e tamanho é mais recomendada?',
        options: [
          'Comic Sans MS, 14pt',
          'Arial ou Times New Roman, 12pt',
          'Impact, 10pt',
          'Courier New, 11pt'
        ],
        correctAnswer: 'Arial ou Times New Roman, 12pt',
        explanation: 'Arial e Times New Roman, ambas no tamanho 12, são as fontes padrão para trabalhos acadêmicos e documentos formais.',
        difficulty: 'easy',
        timeLimit: 35
      },
      {
        id: 'q7',
        type: 'true-false',
        question: 'A ferramenta "Pincel de Formatação" copia apenas a cor e o tamanho da fonte, mas não outros estilos como negrito ou itálico.',
        correctAnswer: 'false',
        explanation: 'O Pincel de Formatação é poderoso e copia TODA a formatação de um trecho de texto para ser aplicada em outro.',
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'Para aplicar um efeito de "tacha" ou "riscado" em um texto, qual opção você usaria?',
        options: [
          'Sublinhado',
          'Tachado',
          'Sobrescrito',
          'Subscrito'
        ],
        correctAnswer: 'Tachado',
        explanation: 'A formatação "Tachado" desenha uma linha no meio do texto, útil para indicar revisões ou itens removidos.',
        difficulty: 'medium',
        timeLimit: 30
      }
    ]
  },
  {
    id: 'paragraphs-alignment',
    title: 'Parágrafos e Alinhamento',
    description: 'Organize seus parágrafos com precisão e clareza.',
    category: 'Formatação',
    difficulty: 'medium',
    estimatedTime: 6,
    icon: 'AlignLeft',
    color: 'bg-purple-500',
    questions: [
      {
        id: 'q9',
        type: 'drag-drop',
        question: 'Associe o tipo de alinhamento com sua descrição:',
        dragItems: [
          { id: 'item1', text: 'À Esquerda' },
          { id: 'item2', text: 'Centralizado' },
          { id: 'item3', text: 'Justificado' }
        ],
        dropZones: [
          { id: 'zone1', label: 'Alinha o texto uniformemente nas margens esquerda e direita.', correctItemId: 'item3' },
          { id: 'zone2', label: 'Ideal para títulos e capas.', correctItemId: 'item2' },
          { id: 'zone3', label: 'Alinhamento padrão para a maioria dos textos.', correctItemId: 'item1' }
        ],
        correctAnswer: ['item3', 'item2', 'item1'],
        explanation: 'Justificado (jornais), Centralizado (títulos) e À Esquerda (padrão) são os principais tipos de alinhamento.',
        difficulty: 'medium',
        timeLimit: 40
      },
      {
        id: 'q10',
        type: 'true-false',
        question: 'O recuo da primeira linha de um parágrafo só pode ser configurado usando a tecla Tab.',
        correctAnswer: 'false',
        explanation: 'Você pode configurar o recuo da primeira linha de forma precisa na caixa de diálogo "Parágrafo" ou arrastando o marcador na régua.',
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        id: 'q11',
        type: 'multiple-choice',
        question: 'Qual é a finalidade do "Espaçamento Antes" e "Depois" de um parágrafo?',
        options: [
          'Aumentar o tamanho da fonte',
          'Adicionar espaço vertical entre parágrafos sem usar "Enter"',
          'Alterar as margens da página',
          'Criar um recuo horizontal'
        ],
        correctAnswer: 'Adicionar espaço vertical entre parágrafos sem usar "Enter"',
        explanation: 'Essa configuração permite um controle preciso do espaço entre parágrafos, resultando em um documento mais profissional.',
        difficulty: 'medium',
        timeLimit: 35
      },
      {
        id: 'q12',
        type: 'flashcard',
        question: 'Qual atalho do teclado justifica o parágrafo selecionado?',
        correctAnswer: 'Ctrl + J',
        explanation: 'Ctrl + J (Justify) alinha o texto selecionado em ambas as margens, esquerda e direita.',
        difficulty: 'easy',
        timeLimit: 20
      }
    ]
  },
  {
    id: 'lists-tables',
    title: 'Listas e Tabelas',
    description: 'Aprenda a organizar informações com listas e tabelas.',
    category: 'Organização',
    difficulty: 'medium',
    estimatedTime: 7,
    icon: 'Table',
    color: 'bg-orange-500',
    questions: [
      {
        id: 'q13',
        type: 'multiple-choice',
        question: 'Para transformar um parágrafo em um item de lista com marcadores, você deve clicar no botão de:',
        options: [
          'Numeração',
          'Marcadores',
          'Recuo',
          'Estilos'
        ],
        correctAnswer: 'Marcadores',
        explanation: 'O botão de "Marcadores" na guia "Página Inicial" cria listas não ordenadas, geralmente com símbolos como pontos ou traços.',
        difficulty: 'easy',
        timeLimit: 30
      },
      {
        id: 'q14',
        type: 'true-false',
        question: 'Uma vez que uma tabela é criada, não é possível adicionar ou remover linhas e colunas.',
        correctAnswer: 'false',
        explanation: 'O Word oferece ferramentas flexíveis para inserir, excluir e mesclar células, linhas e colunas a qualquer momento.',
        difficulty: 'easy',
        timeLimit: 25
      },
      {
        id: 'q15',
        type: 'case-study',
        question: 'Você está criando um cronograma semanal de atividades. Qual é a melhor forma de organizar os dias da semana e as tarefas correspondentes?',
        options: [
          'Usar uma lista com marcadores',
          'Escrever um parágrafo para cada dia',
          'Criar uma tabela com colunas para os dias e linhas para os horários/tarefas',
          'Usar SmartArt'
        ],
        correctAnswer: 'Criar uma tabela com colunas para os dias e linhas para os horários/tarefas',
        explanation: 'Tabelas são a ferramenta ideal para organizar informações em uma estrutura de grade, como um cronograma.',
        difficulty: 'medium',
        timeLimit: 40
      },
      {
        id: 'q16',
        type: 'multiple-choice',
        question: 'Para adicionar uma nova linha ao final de uma tabela, qual é o método mais rápido?',
        options: [
          'Ir para a guia Layout e clicar em "Inserir Abaixo"',
          'Clicar com o botão direito na última linha e escolher "Inserir"',
          'Posicionar o cursor na última célula da tabela e pressionar a tecla Tab',
          'Copiar e colar uma linha existente'
        ],
        correctAnswer: 'Posicionar o cursor na última célula da tabela e pressionar a tecla Tab',
        explanation: 'Pressionar Tab na última célula é um atalho extremamente rápido e prático para adicionar uma nova linha ao final da tabela.',
        difficulty: 'medium',
        timeLimit: 35
      }
    ]
  },
  {
    id: 'images-graphics',
    title: 'Imagens e Gráficos',
    description: 'Insira e manipule elementos visuais para enriquecer seus documentos.',
    category: 'Mídia',
    difficulty: 'hard',
    estimatedTime: 6,
    icon: 'Image',
    color: 'bg-pink-500',
    questions: [
      {
        id: 'q17',
        type: 'multiple-choice',
        question: 'Qual opção de "Quebra de Texto Automática" faz com que o texto contorne a forma exata de uma imagem?',
        options: [
          'Quadrado',
          'Justo',
          'Através',
          'Alinhado com o texto'
        ],
        correctAnswer: 'Justo',
        explanation: 'A opção "Justo" (Tight) faz com que o texto se ajuste de perto aos contornos da imagem, criando um efeito visual mais integrado.',
        difficulty: 'medium',
        timeLimit: 30
      },
      {
        id: 'q18',
        type: 'true-false',
        question: 'É possível aplicar filtros de cor e efeitos artísticos a uma imagem diretamente no Word.',
        correctAnswer: 'true',
        explanation: 'Sim, a guia "Formato da Imagem" oferece uma variedade de ferramentas de edição, incluindo correções, cor, efeitos artísticos e estilos.',
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        id: 'q19',
        type: 'drag-drop',
        question: 'Associe o tipo de elemento visual com seu uso ideal:',
        dragItems: [
          { id: 'item1', text: 'Forma' },
          { id: 'item2', text: 'SmartArt' },
          { id: 'item3', text: 'Gráfico' }
        ],
        dropZones: [
          { id: 'zone1', label: 'Para representar dados numéricos e tendências.', correctItemId: 'item3' },
          { id: 'zone2', label: 'Para criar diagramas de processo, hierarquia ou ciclo.', correctItemId: 'item2' },
          { id: 'zone3', label: 'Para adicionar setas, caixas de texto e outros elementos de desenho.', correctItemId: 'item1' }
        ],
        correctAnswer: ['item3', 'item2', 'item1'],
        explanation: 'Gráficos para números, SmartArt para processos e Formas para desenhos são as escolhas certas para cada necessidade.',
        difficulty: 'hard',
        timeLimit: 45
      },
      {
        id: 'q20',
        type: 'case-study',
        question: 'Você precisa criar um organograma simples da sua equipe. Qual ferramenta do Word é a mais rápida e apropriada para isso?',
        options: [
          'Desenhar caixas e linhas com a ferramenta Formas',
          'Inserir um Gráfico de Pizza',
          'Inserir um elemento SmartArt do tipo "Hierarquia"',
          'Criar uma tabela e digitar os nomes'
        ],
        correctAnswer: 'Inserir um elemento SmartArt do tipo "Hierarquia"',
        explanation: 'O SmartArt é projetado exatamente para isso, oferecendo layouts de organograma prontos e fáceis de preencher.',
        difficulty: 'medium',
        timeLimit: 35
      }
    ]
  },
  {
    id: 'review-final',
    title: 'Revisão e Finalização',
    description: 'Revise, proteja e finalize seus documentos como um profissional.',
    category: 'Produtividade',
    difficulty: 'hard',
    estimatedTime: 5,
    icon: 'CheckCircle',
    color: 'bg-teal-500',
    questions: [
      {
        id: 'q21',
        type: 'multiple-choice',
        question: 'Qual ferramenta é usada para verificar erros de ortografia e gramática em todo o documento?',
        options: [
          'Localizar e Substituir',
          'Verificador de Ortografia e Gramática (F7)',
          'Contar Palavras',
          'Dicionário de Sinônimos'
        ],
        correctAnswer: 'Verificador de Ortografia e Gramática (F7)',
        explanation: 'Pressionar F7 ou ir até a guia "Revisão" ativa o verificador completo, que sugere correções de ortografia e gramática.',
        difficulty: 'easy',
        timeLimit: 25
      },
      {
        id: 'q22',
        type: 'true-false',
        question: 'A função "Controlar Alterações" apenas destaca o texto que foi adicionado, mas não mostra o que foi excluído.',
        correctAnswer: 'false',
        explanation: 'O "Controlar Alterações" é uma ferramenta completa que mostra todas as edições: inserções, exclusões e alterações de formatação.',
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        id: 'q23',
        type: 'multiple-choice',
        question: 'Para garantir que a formatação do seu documento não seja alterada quando aberto em outro computador, qual é o formato de arquivo mais seguro para salvá-lo?',
        options: [
          '.docx',
          '.txt',
          '.pdf',
          '.rtf'
        ],
        correctAnswer: '.pdf',
        explanation: 'PDF (Portable Document Format) foi criado para preservar a aparência exata de um documento, independentemente do dispositivo ou sistema operacional.',
        difficulty: 'medium',
        timeLimit: 35
      },
      {
        id: 'q24',
        type: 'flashcard',
        question: 'Qual atalho do teclado abre a ferramenta "Localizar e Substituir"?',
        correctAnswer: 'Ctrl + U',
        explanation: 'Ctrl + U (em português) ou Ctrl + H (em inglês) abre a caixa de diálogo para localizar e substituir texto no documento.',
        difficulty: 'easy',
        timeLimit: 20
      }
    ]
  }
]

export const getBadgeInfo = (badgeType: string) => {
  const badges: Record<string, { name: string; description: string; icon: string; color: string }> = {
    streak_3: {
      name: 'Sequência Tripla',
      description: 'Acertou 3 questões seguidas!',
      icon: 'Zap',
      color: 'text-yellow-500'
    },
    perfect_mission: {
      name: 'Perfeição Total',
      description: '100% de acertos em uma missão.',
      icon: 'Star',
      color: 'text-purple-500'
    },
    genius_idea: {
      name: 'Ideia Genial',
      description: 'Resposta correta e muito rápida!',
      icon: 'Lightbulb',
      color: 'text-blue-500'
    },
    flawless_theme: {
      name: 'Impecável',
      description: 'Completou uma missão sem errar.',
      icon: 'Trophy',
      color: 'text-orange-500'
    },
    speed_master: {
      name: 'Mestre da Velocidade',
      description: 'Completou uma missão em tempo recorde.',
      icon: 'Rocket',
      color: 'text-red-500'
    },
    first_mission: {
      name: 'Primeiros Passos',
      description: 'Completou sua primeira missão.',
      icon: 'Flag',
      color: 'text-green-500'
    }
  }
  
  return badges[badgeType] || { name: badgeType, description: 'Conquista especial.', icon: 'Award', color: 'text-gray-500' }
}
