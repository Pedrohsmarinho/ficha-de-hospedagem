import React, { useState, useEffect } from "react";
import { VerdesArcosHospedagemForm } from "./VerdesArcosHospedagemForm";
import { HospedesList } from "./HospedesList";
import type { HospedagemFormData } from "./types";
import "./App.css";
import "./HospedesList.css";

const STORAGE_KEY = "verdes_arcos_hospedes";

const App: React.FC = () => {
  const [hospedes, setHospedes] = useState<HospedagemFormData[]>([]);
  const [carregouDados, setCarregouDados] = useState(false);

  // Carregar hóspedes do LocalStorage ao iniciar
  useEffect(() => {
    const hospedesSalvos = localStorage.getItem(STORAGE_KEY);
    if (hospedesSalvos) {
      try {
        setHospedes(JSON.parse(hospedesSalvos));
      } catch (error) {
        console.error("Erro ao carregar hóspedes:", error);
      }
    }
    setCarregouDados(true);
  }, []);

  // Salvar hóspedes no LocalStorage sempre que a lista mudar (após carregar)
  useEffect(() => {
    if (carregouDados) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hospedes));
    }
  }, [hospedes, carregouDados]);

  const handleNovoHospede = (novoHospede: HospedagemFormData) => {
    setHospedes((prev) => [...prev, novoHospede]);
  };

  const handleDeleteHospede = (index: number) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover este hóspede da lista?"
      )
    ) {
      setHospedes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="app-container">
      <VerdesArcosHospedagemForm onSave={handleNovoHospede} />
      <HospedesList hospedes={hospedes} onDeleteHospede={handleDeleteHospede} />
    </div>
  );
};

export default App;
