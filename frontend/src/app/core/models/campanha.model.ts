export type NivelRisco = 'critico' | 'atencao' | 'alinhado';

export type StatusCampanha = 'Em Deliberação' | 'Resolvido';

export type AcaoOperacional =
  | 'Notificar Creator'
  | 'Notificar Produtor'
  | 'Gerar Dossiê / Restrição'
  | 'Aprovar / Ignorar';

export interface CampanhaResumo {
  id: string;
  titulo: string;
  creator: string;
  produtor: string;
  nivel: NivelRisco;
  ico: number;
}

export interface Diagnostico {
  titulo: string;
  resumo: string;
  detalhe: string;
  destaque: string;
  minuto: string;
  chamados: number;
  causaRaiz: string;
  confianca: string;
  escopo: 'Divergente' | 'Alinhado';
  prazo: 'Divergente' | 'Alinhado';
  preco: 'Divergente' | 'Alinhado';
}

export interface ResumoEvidencia {
  icone: string;
  label: string;
  titulo: string;
  rodapeIcone: string;
  rodapeTexto: string;
  rodapeDetalhe: string;
  destaque?: string;
  destaqueSufixo?: string;
}

export interface EvidenciaCreator {
  midia: string;
  duracao: string;
  minutoPromessa: string;
  percentualLinhaDoTempo: number;
  transcricao: string;
  confiancaTranscricao: string;
  origem: string;
  imagem: string;
}

export interface EvidenciaProdutor {
  formato: string;
  inconsistencia: string;
  prazoAcesso: string;
  garantia: string;
  garantiaDetalhe: string;
  sku: string;
  valor: string;
}

export interface Ticket {
  id: string;
  tempo: string;
  mensagem: string;
  categoria: string;
  icone: string;
}

export interface EvidenciaCompradores {
  total: string;
  tickets: Ticket[];
  tmr: string;
  frustracao: string;
}

export interface Evidencias {
  creator: EvidenciaCreator;
  produtor: EvidenciaProdutor;
  compradores: EvidenciaCompradores;
  resumos: ResumoEvidencia[];
}

export interface Campanha extends CampanhaResumo {
  status: StatusCampanha;
  diagnostico: Diagnostico;
  evidencias: Evidencias;
}

export interface MetricasDashboard {
  indiceMedio: number;
  variacao: string;
  totalCampanhas: number;
  criticos: number;
  atencao: number;
  alinhados: number;
  relatosHoje: string;
}

export interface DashboardResponse {
  metricas: MetricasDashboard;
  campanhas: CampanhaResumo[];
}

export interface ReprocessamentoResult {
  campanhaId: string;
  ico: number;
  escopo: string;
  ferramentas: string[];
  mensagem: string;
  detalhe: string;
  resumoCausaRaiz?: string;
  confianca?: string;
  origem?: string;
  reprocessadoEm: string;
}

export interface AcaoRegistrada {
  campanhaId: string;
  acao: AcaoOperacional;
  payload: {
    acao: AcaoOperacional;
    campanhaId: string;
    evidencia: string;
    status: StatusCampanha;
    registradoEm: string;
  };
}

export interface Notificacao {
  titulo: string;
  mensagem: string;
  detalhe?: string;
  tipo: 'acao' | 'auditoria';
}
