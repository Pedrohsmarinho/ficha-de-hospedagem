export type Companion = {
  id: number;
  nome: string;
  dataNascimento: string;
  documento: string;
  cpf?: string;
};

export type TipoPessoa = "PF" | "CNPJ";
export type FormaPagamento = "Pix" | "Dinheiro" | "Cartão de Crédito" | "Cartão de Débito";

export type HospedagemFormData = {
  periodoInicio: string;
  periodoFim: string;
  tipoApartamento: string;

  // Tipo de pessoa
  tipoPessoa: TipoPessoa;

  // Campos para Pessoa Física (PF)
  nome: string;
  rg: string;
  cpf: string;
  dataNasc: string;

  // Campos para Pessoa Jurídica (CNPJ)
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  responsavel: string; // Nome do responsável pela empresa

  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;

  telResidencial: string;
  telComercial: string;
  celular: string;

  profissao: string;
  email: string;

  // Dados de pagamento
  formaPagamento: FormaPagamento | "";
  numeroDiarias: number;
  valorTotal: string;

  acompanhantes: Companion[];
};
