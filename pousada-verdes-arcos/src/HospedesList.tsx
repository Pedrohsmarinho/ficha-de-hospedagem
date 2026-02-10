import React, { useState, useMemo } from "react";
import type { HospedagemFormData } from "./types";
import * as XLSX from "xlsx";

interface HospedesListProps {
  hospedes: HospedagemFormData[];
  onDeleteHospede: (index: number) => void;
}

export const HospedesList: React.FC<HospedesListProps> = ({
  hospedes,
  onDeleteHospede,
}) => {
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Filtrar hóspedes por data
  const hospedesFiltrados = useMemo(() => {
    if (!filtroInicio && !filtroFim) return hospedes;

    return hospedes.filter((h) => {
      const dataInicio = new Date(h.periodoInicio);
      const dataFim = new Date(h.periodoFim);

      let dentroDoFiltro = true;

      if (filtroInicio) {
        const filtroInicioDate = new Date(filtroInicio);
        // Verifica se o hóspede estava presente nesse período
        dentroDoFiltro = dentroDoFiltro && dataFim >= filtroInicioDate;
      }

      if (filtroFim) {
        const filtroFimDate = new Date(filtroFim);
        dentroDoFiltro = dentroDoFiltro && dataInicio <= filtroFimDate;
      }

      return dentroDoFiltro;
    });
  }, [hospedes, filtroInicio, filtroFim]);

  // Função para exportar para Excel
  const exportarParaExcel = () => {
    if (hospedesFiltrados.length === 0) {
      alert("Nenhum hóspede para exportar!");
      return;
    }

    // Preparar dados para o Excel
    const dadosParaExportar = hospedesFiltrados.flatMap((hospede) => {
      // Linha principal com dados do hóspede
      const linhaPrincipal = {
        "Check-in": hospede.periodoInicio,
        "Check-out": hospede.periodoFim,
        "Tipo Apartamento": hospede.tipoApartamento,
        "Tipo Pessoa": hospede.tipoPessoa,
        
        // Dados PF
        Nome: hospede.tipoPessoa === "PF" ? hospede.nome : "",
        RG: hospede.tipoPessoa === "PF" ? hospede.rg : "",
        CPF: hospede.tipoPessoa === "PF" ? hospede.cpf : "",
        "Data Nasc.": hospede.tipoPessoa === "PF" ? hospede.dataNasc : "",
        
        // Dados CNPJ
        "Razão Social": hospede.tipoPessoa === "CNPJ" ? hospede.razaoSocial : "",
        "Nome Fantasia": hospede.tipoPessoa === "CNPJ" ? hospede.nomeFantasia : "",
        CNPJ: hospede.tipoPessoa === "CNPJ" ? hospede.cnpj : "",
        "Inscrição Estadual": hospede.tipoPessoa === "CNPJ" ? hospede.inscricaoEstadual : "",
        Responsável: hospede.tipoPessoa === "CNPJ" ? hospede.responsavel : "",
        
        Endereço: hospede.endereco,
        Bairro: hospede.bairro,
        Cidade: hospede.cidade,
        Estado: hospede.estado,
        CEP: hospede.cep,
        "Tel. Residencial": hospede.telResidencial,
        "Tel. Comercial": hospede.telComercial,
        Celular: hospede.celular,
        Profissão: hospede.profissao,
        Email: hospede.email,
        "Forma de Pagamento": hospede.formaPagamento,
        "Número de Diárias": hospede.numeroDiarias,
        "Valor Total (R$)": hospede.valorTotal,
        "Valor por Diária (R$)": hospede.numeroDiarias && hospede.valorTotal 
          ? (parseFloat(hospede.valorTotal) / hospede.numeroDiarias).toFixed(2)
          : "",
        Tipo: "HÓSPEDE PRINCIPAL",
        "Acompanhante Nome": "",
        "Acompanhante Data Nasc.": "",
        "Acompanhante Doc": "",
        "Acompanhante CPF": "",
      };

      // Se houver acompanhantes, criar linhas adicionais
      if (hospede.acompanhantes.length > 0 && hospede.acompanhantes[0].nome) {
        const linhasAcompanhantes = hospede.acompanhantes
          .filter((ac) => ac.nome)
          .map((ac) => ({
            "Check-in": hospede.periodoInicio,
            "Check-out": hospede.periodoFim,
            "Tipo Apartamento": hospede.tipoApartamento,
            "Tipo Pessoa": hospede.tipoPessoa,
            Nome: hospede.tipoPessoa === "PF" ? hospede.nome : hospede.razaoSocial,
            RG: "",
            CPF: "",
            "Data Nasc.": "",
            "Razão Social": "",
            "Nome Fantasia": "",
            CNPJ: "",
            "Inscrição Estadual": "",
            Responsável: "",
            Endereço: "",
            Bairro: "",
            Cidade: "",
            Estado: "",
            CEP: "",
            "Tel. Residencial": "",
            "Tel. Comercial": "",
            Celular: "",
            Profissão: "",
            Email: "",
            "Forma de Pagamento": "",
            "Número de Diárias": "",
            "Valor Total (R$)": "",
            "Valor por Diária (R$)": "",
            Tipo: "ACOMPANHANTE",
            "Acompanhante Nome": ac.nome,
            "Acompanhante Data Nasc.": ac.dataNascimento,
            "Acompanhante Doc": ac.documento,
            "Acompanhante CPF": ac.cpf || "",
          }));

        return [linhaPrincipal, ...linhasAcompanhantes];
      }

      return [linhaPrincipal];
    });

    // Criar planilha
    const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hóspedes");

    // Definir larguras das colunas
    const columnWidths = [
      { wch: 12 }, // Check-in
      { wch: 12 }, // Check-out
      { wch: 15 }, // Tipo Apartamento
      { wch: 30 }, // Nome
      { wch: 15 }, // RG
      { wch: 15 }, // CPF
      { wch: 12 }, // Data Nasc
      { wch: 35 }, // Endereço
      { wch: 20 }, // Bairro
      { wch: 20 }, // Cidade
      { wch: 8 }, // Estado
      { wch: 12 }, // CEP
      { wch: 15 }, // Tel. Residencial
      { wch: 15 }, // Tel. Comercial
      { wch: 15 }, // Celular
      { wch: 20 }, // Profissão
      { wch: 25 }, // Email
      { wch: 20 }, // Tipo
      { wch: 30 }, // Acompanhante Nome
      { wch: 12 }, // Acompanhante Data Nasc
      { wch: 15 }, // Acompanhante Doc
      { wch: 15 }, // Acompanhante CPF
    ];
    worksheet["!cols"] = columnWidths;

    // Gerar nome do arquivo
    let nomeArquivo = "hospedes_verdes_arcos";
    if (filtroInicio && filtroFim) {
      nomeArquivo += `_${filtroInicio}_a_${filtroFim}`;
    } else if (filtroInicio) {
      nomeArquivo += `_a_partir_de_${filtroInicio}`;
    } else if (filtroFim) {
      nomeArquivo += `_ate_${filtroFim}`;
    }
    nomeArquivo += ".xlsx";

    // Fazer download
    XLSX.writeFile(workbook, nomeArquivo);
  };

  const limparFiltros = () => {
    setFiltroInicio("");
    setFiltroFim("");
  };

  const definirHoje = () => {
    const hoje = new Date().toISOString().split("T")[0];
    setFiltroInicio(hoje);
    setFiltroFim(hoje);
  };

  const definirEstaSemana = () => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje);
    primeiroDia.setDate(hoje.getDate() - hoje.getDay());
    const ultimoDia = new Date(primeiroDia);
    ultimoDia.setDate(primeiroDia.getDate() + 6);

    setFiltroInicio(primeiroDia.toISOString().split("T")[0]);
    setFiltroFim(ultimoDia.toISOString().split("T")[0]);
  };

  const definirEsteMes = () => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    setFiltroInicio(primeiroDia.toISOString().split("T")[0]);
    setFiltroFim(ultimoDia.toISOString().split("T")[0]);
  };

  return (
    <div className="hospedes-list-container">
      <div className="list-header">
        <h2>📋 Lista de Hóspedes Cadastrados</h2>
        <p className="list-subtitle">
          Total: <strong>{hospedesFiltrados.length}</strong> hóspede(s)
          {hospedesFiltrados.length !== hospedes.length &&
            ` (${hospedes.length} no total)`}
        </p>
      </div>

      <div className="list-actions">
        <button
          type="button"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="filter-toggle-btn"
        >
          🔍 {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>

        {hospedesFiltrados.length > 0 && (
          <button
            type="button"
            onClick={exportarParaExcel}
            className="export-btn"
          >
            📊 Exportar para Excel
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="filter-section">
          <h3>Filtrar por período de hospedagem:</h3>
          <div className="filter-row">
            <label>
              Data inicial:
              <input
                type="date"
                value={filtroInicio}
                onChange={(e) => setFiltroInicio(e.target.value)}
              />
            </label>
            <label>
              Data final:
              <input
                type="date"
                value={filtroFim}
                onChange={(e) => setFiltroFim(e.target.value)}
              />
            </label>
          </div>

          <div className="filter-shortcuts">
            <button type="button" onClick={definirHoje}>
              Hoje
            </button>
            <button type="button" onClick={definirEstaSemana}>
              Esta Semana
            </button>
            <button type="button" onClick={definirEsteMes}>
              Este Mês
            </button>
            <button type="button" onClick={limparFiltros}>
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {hospedesFiltrados.length === 0 ? (
        <div className="empty-state">
          <p>😊 Nenhum hóspede cadastrado ainda.</p>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            {hospedes.length > 0
              ? "Ajuste os filtros para ver os hóspedes cadastrados."
              : "Preencha o formulário acima para adicionar o primeiro hóspede."}
          </p>
        </div>
      ) : (
        <div className="hospedes-grid">
          {hospedesFiltrados.map((hospede, index) => {
            const indexOriginal = hospedes.indexOf(hospede);
            return (
              <div key={indexOriginal} className="hospede-card">
                <div className="card-header">
                  <div>
                    <h3>
                      {hospede.tipoPessoa === "PF" 
                        ? hospede.nome 
                        : hospede.razaoSocial || hospede.nomeFantasia}
                    </h3>
                    <span className="tipo-badge">
                      {hospede.tipoPessoa === "PF" ? "👤 Pessoa Física" : "🏢 Pessoa Jurídica"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteHospede(indexOriginal)}
                    className="delete-card-btn"
                    title="Remover hóspede"
                  >
                    🗑️
                  </button>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Período:</span>
                    <span className="value">
                      {new Date(hospede.periodoInicio).toLocaleDateString(
                        "pt-BR"
                      )}{" "}
                      até{" "}
                      {new Date(hospede.periodoFim).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="label">Apartamento:</span>
                    <span className="value">{hospede.tipoApartamento}</span>
                  </div>

                  {hospede.tipoPessoa === "PF" ? (
                    <>
                      <div className="info-row">
                        <span className="label">CPF:</span>
                        <span className="value">{hospede.cpf || "Não informado"}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">RG:</span>
                        <span className="value">{hospede.rg || "Não informado"}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="info-row">
                        <span className="label">CNPJ:</span>
                        <span className="value">{hospede.cnpj || "Não informado"}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Responsável:</span>
                        <span className="value">{hospede.responsavel || "Não informado"}</span>
                      </div>
                    </>
                  )}

                  <div className="info-row">
                    <span className="label">Celular:</span>
                    <span className="value">
                      {hospede.celular || "Não informado"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">
                      {hospede.email || "Não informado"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="label">Cidade:</span>
                    <span className="value">
                      {hospede.cidade
                        ? `${hospede.cidade} - ${hospede.estado}`
                        : "Não informado"}
                    </span>
                  </div>

                  <div className="info-row payment-info">
                    <span className="label">Pagamento:</span>
                    <span className="value">
                      {hospede.formaPagamento || "Não informado"}
                    </span>
                  </div>

                  <div className="info-row payment-info">
                    <span className="label">Diárias:</span>
                    <span className="value">
                      {hospede.numeroDiarias 
                        ? `${hospede.numeroDiarias} ${hospede.numeroDiarias === 1 ? 'diária' : 'diárias'}`
                        : "Não informado"}
                    </span>
                  </div>

                  <div className="info-row payment-info">
                    <span className="label">Valor Total:</span>
                    <span className="value valor-destaque">
                      {hospede.valorTotal 
                        ? `R$ ${parseFloat(hospede.valorTotal).toFixed(2)}`
                        : "Não informado"}
                    </span>
                  </div>

                  {hospede.numeroDiarias && hospede.valorTotal && (
                    <div className="info-row payment-info">
                      <span className="label">Valor/Diária:</span>
                      <span className="value">
                        R$ {(parseFloat(hospede.valorTotal) / hospede.numeroDiarias).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {hospede.acompanhantes.some((ac) => ac.nome) && (
                    <div className="acompanhantes-info">
                      <span className="label">Acompanhantes:</span>
                      <ul>
                        {hospede.acompanhantes
                          .filter((ac) => ac.nome)
                          .map((ac) => (
                            <li key={ac.id}>
                              {ac.nome}
                              {ac.dataNascimento &&
                                ` (${new Date(
                                  ac.dataNascimento
                                ).toLocaleDateString("pt-BR")})`}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
