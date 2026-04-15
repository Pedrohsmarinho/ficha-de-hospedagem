import React, { useState } from "react";
import type { HospedagemFormData, Companion } from "./types";

const maskCPF = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskCNPJ = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");

const maskCEP = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");

const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10)
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};

const emptyCompanion = (id: number): Companion => ({
  id,
  nome: "",
  dataNascimento: "",
  documento: "",
  cpf: "",
});

interface VerdesArcosHospedagemFormProps {
  onSave: (data: HospedagemFormData) => void;
}

export const VerdesArcosHospedagemForm = ({ onSave }: VerdesArcosHospedagemFormProps) => {
  const [form, setForm] = useState<HospedagemFormData>({
    periodoInicio: "",
    periodoFim: "",
    tipoApartamento: "",

    tipoPessoa: "PF",

    // Campos PF
    nome: "",
    rg: "",
    cpf: "",
    dataNasc: "",

    // Campos CNPJ
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    inscricaoEstadual: "",
    responsavel: "",

    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",

    telResidencial: "",
    telComercial: "",
    celular: "",

    profissao: "",
    email: "",

    formaPagamento: "",
    numeroDiarias: 0,
    valorTotal: "",

    acompanhantes: [emptyCompanion(1)],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let maskedValue = value;
    if (name === "cpf") maskedValue = maskCPF(value);
    else if (name === "cnpj") maskedValue = maskCNPJ(value);
    else if (name === "cep") maskedValue = maskCEP(value);
    else if (name === "telResidencial" || name === "telComercial" || name === "celular")
      maskedValue = maskPhone(value);

    setForm((prev: HospedagemFormData) => {
      const newForm = { ...prev, [name]: maskedValue };
      
      // Calcular diárias automaticamente quando as datas mudarem
      if (name === "periodoInicio" || name === "periodoFim") {
        if (newForm.periodoInicio && newForm.periodoFim) {
          const inicio = new Date(newForm.periodoInicio);
          const fim = new Date(newForm.periodoFim);
          const diferencaDias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diferencaDias > 0) {
            newForm.numeroDiarias = diferencaDias;
          }
        }
      }
      
      return newForm;
    });
  };

  const handleCompanionChange = (
    id: number,
    field: keyof Companion,
    value: string
  ) => {
    const maskedValue = field === "cpf" ? maskCPF(value) : value;
    setForm((prev: HospedagemFormData) => ({
      ...prev,
      acompanhantes: prev.acompanhantes.map((ac) =>
        ac.id === id ? { ...ac, [field]: maskedValue } : ac
      ),
    }));
  };

  const addCompanion = () => {
    setForm((prev: HospedagemFormData) => ({
      ...prev,
      acompanhantes: [...prev.acompanhantes, emptyCompanion(Date.now())],
    }));
  };

  const removeCompanion = (id: number) => {
    setForm((prev: HospedagemFormData) => ({
      ...prev,
      acompanhantes: prev.acompanhantes.filter((ac) => ac.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar se as diárias foram calculadas
    if (!form.numeroDiarias || form.numeroDiarias <= 0) {
      alert("⚠️ Por favor, preencha as datas de check-in e check-out para calcular o número de diárias.");
      return;
    }
    
    // Salvar hóspede
    onSave(form);
    
    // Limpar formulário
    setForm({
      periodoInicio: "",
      periodoFim: "",
      tipoApartamento: "",
      tipoPessoa: "PF",
      nome: "",
      rg: "",
      cpf: "",
      dataNasc: "",
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      inscricaoEstadual: "",
      responsavel: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      telResidencial: "",
      telComercial: "",
      celular: "",
      profissao: "",
      email: "",
      formaPagamento: "",
      numeroDiarias: 0,
      valorTotal: "",
      acompanhantes: [emptyCompanion(1)],
    });
    
    alert("✅ Hóspede cadastrado com sucesso!\n\nVocê pode ver todos os hóspedes na lista abaixo e exportar para Excel quando desejar.");
    
    // Scroll suave para a lista
    setTimeout(() => {
      const listaElement = document.querySelector('.hospedes-list-container');
      if (listaElement) {
        listaElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="ficha-container">
      <div className="header">
        <img src="/logo.svg" alt="Pousada Verdes Arcos" className="header-logo" />
        <h1>Pousada Verdes Arcos</h1>
        <h2>Ficha de Hospedagem</h2>
      </div>

      <form onSubmit={handleSubmit} className="ficha-form">
        {/* Período / Tipo */}
        <fieldset>
          <legend>Período da Hospedagem</legend>
          <div className="row">
            <label>
              Período de:
              <input
                type="date"
                name="periodoInicio"
                value={form.periodoInicio}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Até:
              <input
                type="date"
                name="periodoFim"
                value={form.periodoFim}
                onChange={handleChange}
                required
              />
            </label>
              <label>
                Tipo de apartamento:
                <select
                  name="tipoApartamento"
                  value={form.tipoApartamento}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="Individual">🛏️ Individual</option>
                  <option value="Duplo ou Casal">🛏️🛏️ Duplo ou Casal</option>
                  <option value="Triplo">🛏️🛏️🛏️ Triplo</option>
                </select>
              </label>
          </div>
        </fieldset>

        {/* Tipo de Pessoa */}
        <fieldset>
          <legend>Tipo de Cadastro</legend>
          <div className="row tipo-pessoa-selector">
            <label className="radio-label">
              <input
                type="radio"
                name="tipoPessoa"
                value="PF"
                checked={form.tipoPessoa === "PF"}
                onChange={handleChange}
              />
              <span className="radio-text">
                👤 Pessoa Física (CPF)
              </span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="tipoPessoa"
                value="CNPJ"
                checked={form.tipoPessoa === "CNPJ"}
                onChange={handleChange}
              />
              <span className="radio-text">
                🏢 Pessoa Jurídica (CNPJ)
              </span>
            </label>
          </div>
        </fieldset>

        {/* Dados principais - Pessoa Física */}
        {form.tipoPessoa === "PF" && (
          <fieldset>
            <legend>Dados do Hóspede (Pessoa Física)</legend>
            <div className="row">
              <label className="full-width">
                Nome completo:
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo do hóspede"
                />
              </label>
            </div>
            <div className="row">
              <label>
                RG:
                <input
                  type="text"
                  name="rg"
                  value={form.rg}
                  onChange={handleChange}
                  placeholder="00.000.000-0"
                />
              </label>
              <label>
                CPF:
                <input
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  required={form.tipoPessoa === "PF"}
                  placeholder="000.000.000-00"
                />
              </label>
              <label>
                Data de Nascimento:
                <input
                  type="date"
                  name="dataNasc"
                  value={form.dataNasc}
                  onChange={handleChange}
                />
              </label>
            </div>
          </fieldset>
        )}

        {/* Dados principais - Pessoa Jurídica */}
        {form.tipoPessoa === "CNPJ" && (
          <fieldset>
            <legend>Dados da Empresa (Pessoa Jurídica)</legend>
            <div className="row">
              <label className="full-width">
                Razão Social:
                <input
                  type="text"
                  name="razaoSocial"
                  value={form.razaoSocial}
                  onChange={handleChange}
                  required
                  placeholder="Razão social da empresa"
                />
              </label>
            </div>
            <div className="row">
              <label className="full-width">
                Nome Fantasia:
                <input
                  type="text"
                  name="nomeFantasia"
                  value={form.nomeFantasia}
                  onChange={handleChange}
                  placeholder="Nome fantasia (opcional)"
                />
              </label>
            </div>
            <div className="row">
              <label>
                CNPJ:
                <input
                  type="text"
                  name="cnpj"
                  value={form.cnpj}
                  onChange={handleChange}
                  required={form.tipoPessoa === "CNPJ"}
                  placeholder="00.000.000/0000-00"
                />
              </label>
              <label>
                Inscrição Estadual:
                <input
                  type="text"
                  name="inscricaoEstadual"
                  value={form.inscricaoEstadual}
                  onChange={handleChange}
                  placeholder="IE (opcional)"
                />
              </label>
            </div>
            <div className="row">
              <label className="full-width">
                Nome do Responsável:
                <input
                  type="text"
                  name="responsavel"
                  value={form.responsavel}
                  onChange={handleChange}
                  placeholder="Nome completo do responsável pela reserva (opcional)"
                />
              </label>
            </div>
          </fieldset>
        )}

        {/* Endereço */}
        <fieldset>
          <legend>Endereço</legend>
          <div className="row">
            <label className="full-width">
              Endereço:
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Rua, número, complemento"
              />
            </label>
          </div>
          <div className="row">
            <label>
              Bairro:
              <input
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
              />
            </label>
            <label>
              CEP:
              <input
                type="text"
                name="cep"
                value={form.cep}
                onChange={handleChange}
                placeholder="00000-000"
              />
            </label>
          </div>
          <div className="row">
            <label>
              Cidade:
              <input
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
              />
            </label>
            <label>
              Estado:
              <input
                type="text"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="UF"
                maxLength={2}
              />
            </label>
          </div>
        </fieldset>

        {/* Contato */}
        <fieldset>
          <legend>Contato</legend>
          <div className="row">
            <label>
              Tel. Residencial:
              <input
                type="tel"
                name="telResidencial"
                value={form.telResidencial}
                onChange={handleChange}
                placeholder="(00) 0000-0000"
              />
            </label>
            <label>
              Tel. Comercial:
              <input
                type="tel"
                name="telComercial"
                value={form.telComercial}
                onChange={handleChange}
                placeholder="(00) 0000-0000"
              />
            </label>
            <label>
              Celular:
              <input
                type="tel"
                name="celular"
                value={form.celular}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </label>
          </div>
          <div className="row">
            <label>
              Profissão:
              <input
                type="text"
                name="profissao"
                value={form.profissao}
                onChange={handleChange}
              />
            </label>
            <label>
              E-mail:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
              />
            </label>
          </div>
        </fieldset>

        {/* Dados de Pagamento */}
        <fieldset>
          <legend>Informações de Pagamento</legend>
          <div className="row">
            <label>
              Forma de Pagamento:
              <select
                name="formaPagamento"
                value={form.formaPagamento}
                onChange={handleChange}
                required
              >
                <option value="">Selecione a forma de pagamento</option>
                <option value="Pix">💰 Pix</option>
                <option value="Dinheiro">💵 Dinheiro</option>
                <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
                <option value="Cartão de Débito">💳 Cartão de Débito</option>
              </select>
            </label>
            <label>
              Número de Diárias:
              <input
                type="text"
                name="numeroDiarias"
                value={form.numeroDiarias > 0 ? form.numeroDiarias : ""}
                readOnly
                placeholder="Preencha as datas acima"
                className="readonly-field"
                title="Calculado automaticamente com base nas datas"
              />
            </label>
            <label>
              Valor Total (R$):
              <input
                type="number"
                name="valorTotal"
                value={form.valorTotal}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                min="0"
                required
              />
            </label>
          </div>
          
        </fieldset>

        {/* Acompanhantes */}
        <fieldset>
          <legend>
            Informações dos Acompanhantes{" "}
            <span style={{ fontWeight: 400, fontSize: "0.9em" }}>
              (CPF obrigatório para maiores de 18 anos)
            </span>
          </legend>

          {form.acompanhantes.map((ac, index) => (
            <div key={ac.id} className="acompanhante-row">
              <div className="acompanhante-header">
                <strong>Acompanhante {index + 1}</strong>
              </div>
              <div className="row">
                <label>
                  Nome completo:
                  <input
                    type="text"
                    value={ac.nome}
                    onChange={(e) =>
                      handleCompanionChange(ac.id, "nome", e.target.value)
                    }
                    placeholder="Nome do acompanhante"
                  />
                </label>
                <label>
                  Data de Nascimento:
                  <input
                    type="date"
                    value={ac.dataNascimento}
                    onChange={(e) =>
                      handleCompanionChange(
                        ac.id,
                        "dataNascimento",
                        e.target.value
                      )
                    }
                  />
                </label>
              </div>
              <div className="row">
                <label>
                  Documento (RG):
                  <input
                    type="text"
                    value={ac.documento}
                    onChange={(e) =>
                      handleCompanionChange(ac.id, "documento", e.target.value)
                    }
                    placeholder="RG"
                  />
                </label>
                <label>
                  CPF:
                  <input
                    type="text"
                    value={ac.cpf ?? ""}
                    onChange={(e) =>
                      handleCompanionChange(ac.id, "cpf", e.target.value)
                    }
                    placeholder="Obrigatório se +18 anos"
                  />
                </label>
                {form.acompanhantes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCompanion(ac.id)}
                    className="remove-btn"
                  >
                    ✕ Remover
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="button" onClick={addCompanion} className="add-btn">
            + Adicionar Acompanhante
          </button>
        </fieldset>

        <div className="actions">
          <button type="submit" className="submit-btn">
            💾 Salvar Ficha de Hospedagem
          </button>
        </div>
      </form>
    </div>
  );
};
