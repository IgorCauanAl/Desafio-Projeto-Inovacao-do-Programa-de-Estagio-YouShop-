import { Campanha, CampanhaResumo } from '../models/campanha.model';

const AVATAR_LUCAS =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB6dYwx2bZ5szjIKE9LdiJYo1NZ7V9YGerKdyV0a6ry52UBP8pkXjMPfJB3WJh1Y9frNXh3uXAUw89XEZWDdws8ES1S4-Ywco5tiBJsurFL-DCk27trn0kGTqMZOB_JjAb5_wfEFkCUCXXtjwb4HLs7Yw548LaRk4U-cQdDgELA8HGH5O8xPvMzPthTSLB23c-dtDNpYyIhQzIoEpXn4dNDT7HlejNFuQ9xCgkPAGNq';
const AVATAR_CAMILA =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDKrLDyhaR5d2vq_k1VoZV7fQ5nNm_3I6jX90w1_DicWo1ZfmUROxdEvr6KMyz4czdblIhD07GUMmXZORnIUci53TE7kqi54jngSmfFfLrCQ1YK0chRIBMTm0n0RjdSMwxMQx6NB-BtMGX9cMUqIM6SL80VY0FtfmmGxbUzvALky7rU2xJKrL3RHYiHQGwypFPBYngrK_FaMxq6TB2g1-eQ_cIVG8SlgpxB_2h1oy3B';
const AVATAR_RAFAEL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDmBkVkqYdyJ6VYiaQEie_b8Cs1f5Dw4aJic16nF_ySqoUdFosN_BuMwyYb3ulqSovoyhwym82OzLJ6ff9DJwyg2XRaxeb6WiLMLRerw6BWes2gnGzNo3mpXh7M6T3bD5CV32lKjOftNn86J6iJnWcrTv_WnWj6xDFsjL-bTZDbXlAPxYAKY51KN7JHj7DAHJgLMbRjP-7g2jr_WMLYwXaI92nFDwFxyWeXdQb2Gydy';
const VIDEO_LUCAS =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDMLihb90vg5uLmvh0Y8lCnVAlHaIIWa95-H8MsIdLdjZdwe9Lu-2r0ZY63Ybl9iC3Gv2eL4v9xHE3RvvoZBS7EqWtppwA4bDm-Gs2SHZF3oCyFX0SDwF-lws6iWSwxHtsUJ4itw08ZUGyV9qqQRtyivatfsm0wIsIVBCAELVqq42kcNsUXakgbXJIhhW8k_J7LJpQVv_sEplRwGaxdoAGe2N9lXzGh-nSUsMkZ54ni';

export const CAMPANHAS_MOCK: Campanha[] = [
  {
    id: 'CMP-8492',
    titulo: 'Mentoria Express',
    creator: 'Lucas Mendes',
    produtor: 'Instituto Pro',
    nivel: 'critico',
    ico: 34,
    status: 'Em Deliberação',
    diagnostico: {
      titulo: 'Divergência de Entrega',
      resumo:
        'O Creator promete mentoria ao vivo',
      detalhe: ', mas o Produtor cadastrou apenas aulas gravadas. Isso gerou 58 chamados de compradores nas últimas 24h.',
      destaque: '(minuto 01:12)',
      minuto: '01:12',
      chamados: 58,
      causaRaiz: 'Causa-raiz identificada',
      confianca: 'Auditoria algorítmica confiável (98.4%)',
      escopo: 'Divergente',
      prazo: 'Alinhado',
      preco: 'Alinhado',
    },
    evidencias: {
      creator: {
        midia: 'Reels • Instagram',
        duracao: '01:45',
        minutoPromessa: '01:12',
        percentualLinhaDoTempo: 68,
        transcricao:
          '“Quem entrar hoje ganha acompanhamento ao vivo comigo toda semana para destravar seus primeiros resultados.”',
        confiancaTranscricao: 'Transcrição Automática Whisper v3 • Confiança 99.4%',
        origem: 'Instagram • Postado há 2 dias',
        imagem: VIDEO_LUCAS,
      },
      produtor: {
        formato: '100% Gravado',
        inconsistencia: 'Inconsistência: Nenhuma sessão ao vivo cadastrada',
        prazoAcesso: 'Imediato (12 meses)',
        garantia: '7 dias',
        garantiaDetalhe: 'Garantia incondicional padrão',
        sku: 'SKU #MNT-091',
        valor: 'R$ 997,00',
      },
      compradores: {
        total: '58',
        tickets: [
          {
            id: 'TK-3921',
            tempo: 'há 3h',
            mensagem: '“Comprei pela mentoria ao vivo e só tem aula gravada.”',
            categoria: 'Solicitação de Reembolso imediato',
            icone: 'support_agent',
          },
          {
            id: 'TK-3894',
            tempo: 'há 5h',
            mensagem: '“Onde está o link das chamadas semanais prometidas no Instagram?”',
            categoria: 'Dúvida sobre cronograma',
            icone: 'help_center',
          },
        ],
        tmr: '18 min',
        frustracao: '92%',
      },
      resumos: [
        {
          icone: 'smart_display',
          label: 'Promessa do Creator',
          titulo: 'Mentoria ao vivo semanal inclusa',
          rodapeIcone: 'schedule',
          rodapeTexto: '01:12',
          rodapeDetalhe: 'Vídeo de Lançamento',
        },
        {
          icone: 'inventory_2',
          label: 'Oferta do Produtor',
          titulo: 'Acesso a 12 módulos gravados',
          rodapeIcone: 'shopping_cart_checkout',
          rodapeTexto: 'Checkout Oficial',
          rodapeDetalhe: 'SKU #MNT-091',
        },
        {
          icone: 'support_agent',
          label: 'Relatos dos Compradores',
          titulo: 'Relatos de divergência de entrega',
          rodapeIcone: '',
          rodapeTexto: 'Tickets abertos em 24h',
          rodapeDetalhe: 'Fila prioritária',
          destaque: '58',
          destaqueSufixo: 'pico atípico',
        },
      ],
    },
  },
  {
    id: 'CMP-8510',
    titulo: 'GlowSkin Protocol',
    creator: 'Camila Rocha',
    produtor: 'GlowSkin',
    nivel: 'atencao',
    ico: 68,
    status: 'Em Deliberação',
    diagnostico: {
      titulo: 'Divergência de Prazo',
      resumo: 'O Creator destaca resultado em 15 dias',
      detalhe: ', mas o Produtor cadastrou um protocolo de 90 dias. Isso gerou 17 chamados de compradores nas últimas 24h.',
      destaque: '(minuto 00:48)',
      minuto: '00:48',
      chamados: 17,
      causaRaiz: 'Causa-raiz em investigação',
      confianca: 'Auditoria algorítmica confiável (94.1%)',
      escopo: 'Alinhado',
      prazo: 'Divergente',
      preco: 'Alinhado',
    },
    evidencias: {
      creator: {
        midia: 'Reels • Instagram',
        duracao: '01:20',
        minutoPromessa: '00:48',
        percentualLinhaDoTempo: 60,
        transcricao:
          '“Em apenas 15 dias você vai notar a diferença no seu skin, sem precisar de mais nada.”',
        confiancaTranscricao: 'Transcrição Automática Whisper v3 • Confiança 98.2%',
        origem: 'Instagram • Postado há 4 dias',
        imagem: AVATAR_CAMILA,
      },
      produtor: {
        formato: 'Protocolo de 90 dias',
        inconsistencia: 'Inconsistência: prazo prometido não validado em estudos',
        prazoAcesso: 'Imediato (3 meses)',
        garantia: '30 dias',
        garantiaDetalhe: 'Garantia condicional padrão',
        sku: 'SKU GLW-220',
        valor: 'R$ 189,90',
      },
      compradores: {
        total: '17',
        tickets: [
          {
            id: 'TK-4102',
            tempo: 'há 7h',
            mensagem: '“Passaram 20 dias e ainda não vi resultado nenhum.”',
            categoria: 'Dúvida sobre prazo de eficácia',
            icone: 'help_center',
          },
        ],
        tmr: '11 min',
        frustracao: '46%',
      },
      resumos: [
        {
          icone: 'smart_display',
          label: 'Promessa do Creator',
          titulo: 'Resultado visível em 15 dias',
          rodapeIcone: 'schedule',
          rodapeTexto: '00:48',
          rodapeDetalhe: 'Vídeo de Lançamento',
        },
        {
          icone: 'inventory_2',
          label: 'Oferta do Produtor',
          titulo: 'Protocolo completo de 90 dias',
          rodapeIcone: 'shopping_cart_checkout',
          rodapeTexto: 'Checkout Oficial',
          rodapeDetalhe: 'SKU GLW-220',
        },
        {
          icone: 'support_agent',
          label: 'Relatos dos Compradores',
          titulo: 'Relatos de prazo não cumprido',
          rodapeIcone: '',
          rodapeTexto: 'Tickets abertos em 24h',
          rodapeDetalhe: 'Acompanhar',
          destaque: '17',
          destaqueSufixo: 'acima da média',
        },
      ],
    },
  },
  {
    id: 'CMP-8477',
    titulo: 'FitBox Challenge',
    creator: 'Rafael Costa',
    produtor: 'FitBox',
    nivel: 'alinhado',
    ico: 96,
    status: 'Em Deliberação',
    diagnostico: {
      titulo: 'Alinhamento Confirmado',
      resumo: 'O Creator informa o formato do treino exatamente como cadastrado',
      detalhe: ', sem divergências no checkout. Apenas 2 chamados de esclarecimento nas últimas 24h.',
      destaque: '(minuto 00:31)',
      minuto: '00:31',
      chamados: 2,
      causaRaiz: 'Sem divergências relevantes',
      confianca: 'Auditoria algorítmica confiável (99.1%)',
      escopo: 'Alinhado',
      prazo: 'Alinhado',
      preco: 'Alinhado',
    },
    evidencias: {
      creator: {
        midia: 'Reels • Instagram',
        duracao: '01:02',
        minutoPromessa: '00:31',
        percentualLinhaDoTempo: 50,
        transcricao:
          '“São 12 treinos gravados, com acesso imediato por um ano e garantia de 7 dias.”',
        confiancaTranscricao: 'Transcrição Automática Whisper v3 • Confiança 99.0%',
        origem: 'Instagram • Postado há 1 dia',
        imagem: AVATAR_RAFAEL,
      },
      produtor: {
        formato: '100% Gravado',
        inconsistencia: 'Sem inconsistências detectadas',
        prazoAcesso: 'Imediato (12 meses)',
        garantia: '7 dias',
        garantiaDetalhe: 'Garantia incondicional padrão',
        sku: 'SKU FTB-014',
        valor: 'R$ 297,00',
      },
      compradores: {
        total: '2',
        tickets: [
          {
            id: 'TK-3871',
            tempo: 'há 9h',
            mensagem: '“Só queria confirmar se o acesso é imediato mesmo.”',
            categoria: 'Dúvida simples',
            icone: 'help_center',
          },
        ],
        tmr: '4 min',
        frustracao: '8%',
      },
      resumos: [
        {
          icone: 'smart_display',
          label: 'Promessa do Creator',
          titulo: '12 treinos gravados com acesso imediato',
          rodapeIcone: 'schedule',
          rodapeTexto: '00:31',
          rodapeDetalhe: 'Vídeo de Lançamento',
        },
        {
          icone: 'inventory_2',
          label: 'Oferta do Produtor',
          titulo: '12 módulos gravados',
          rodapeIcone: 'shopping_cart_checkout',
          rodapeTexto: 'Checkout Oficial',
          rodapeDetalhe: 'SKU FTB-014',
        },
        {
          icone: 'support_agent',
          label: 'Relatos dos Compradores',
          titulo: 'Sem relatos de divergência',
          rodapeIcone: '',
          rodapeTexto: 'Tickets abertos em 24h',
          rodapeDetalhe: 'Normal',
          destaque: '2',
          destaqueSufixo: 'dentro da média',
        },
      ],
    },
  },
];

export const CAMPANHAS_RESUMO: CampanhaResumo[] = CAMPANHAS_MOCK.map(
  ({ id, titulo, creator, produtor, nivel, ico }) => ({ id, titulo, creator, produtor, nivel, ico }),
);

export const CREATOR_AVATARS = [AVATAR_CAMILA, AVATAR_LUCAS, AVATAR_RAFAEL];

export const METRICAS_DASHBOARD = {
  indiceMedio: 78,
  variacao: '+3.4%',
  totalCampanhas: 45,
  criticos: 4,
  atencao: 9,
  alinhados: 32,
  relatosHoje: '+142',
};
