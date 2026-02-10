# 🏡 Pousada Verdes Arcos - Ficha de Hospedagem

Sistema de cadastro de hóspedes para a Pousada Verdes Arcos, desenvolvido em React + TypeScript.

## 🚀 Funcionalidades

- ✅ **Cadastro para Pessoa Física (CPF) e Pessoa Jurídica (CNPJ)**
  - Campos específicos para cada tipo
  - PF: Nome, RG, CPF, Data de Nascimento
  - CNPJ: Razão Social, Nome Fantasia, CNPJ, Inscrição Estadual, Responsável
- ✅ Cadastro completo de hóspedes
- ✅ Dados de período e tipo de apartamento
- ✅ Informações de endereço e contato
- ✅ Cadastro de acompanhantes (com validação de CPF para maiores de 18 anos)
- ✅ **Lista de todos os hóspedes cadastrados**
- ✅ **Filtros por data (hoje, semana, mês ou período personalizado)**
- ✅ **Exportação para Excel (.xlsx)** com todos os dados (PF e CNPJ)
- ✅ Armazenamento local (LocalStorage) - dados não são perdidos ao recarregar
- ✅ Interface moderna e responsiva
- ✅ Validação de campos obrigatórios

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm (vem com o Node.js)

## 🔧 Instalação

1. Navegue até a pasta do projeto:
```bash
cd pousada-verdes-arcos
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como executar

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto será aberto em `http://localhost:5173`

## 🏗️ Build para produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`

Para visualizar a versão de produção localmente:

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
pousada-verdes-arcos/
├── src/
│   ├── App.tsx                          # Componente principal (gerencia estado)
│   ├── App.css                          # Estilos globais
│   ├── main.tsx                         # Entrada da aplicação
│   ├── types.ts                         # Tipos TypeScript
│   ├── VerdesArcosHospedagemForm.tsx   # Componente do formulário
│   ├── HospedesList.tsx                 # Componente da lista e exportação
│   └── HospedesList.css                 # Estilos da lista
├── index.html                           # HTML principal
├── package.json                         # Dependências
├── tsconfig.json                        # Configuração TypeScript
├── vite.config.ts                       # Configuração Vite
└── README.md                            # Este arquivo
```

## 🎨 Tecnologias Utilizadas

- **React** 18.2 - Biblioteca JavaScript para interfaces
- **TypeScript** 5.3 - Superset tipado do JavaScript
- **Vite** 5.0 - Build tool moderna e rápida
- **XLSX** 0.18 - Biblioteca para exportação de planilhas Excel
- **LocalStorage API** - Armazenamento local dos dados
- **CSS3** - Estilização com gradientes e animações

## 📝 Como usar o sistema

### Cadastrar novo hóspede:
1. Preencha o período de hospedagem e tipo de apartamento
2. **Escolha o tipo de cadastro:**
   - 👤 **Pessoa Física (CPF)**: Para hóspedes individuais
   - 🏢 **Pessoa Jurídica (CNPJ)**: Para empresas fazendo reservas corporativas
3. Complete os dados do hóspede (os campos mudam de acordo com o tipo escolhido):
   - **PF**: Nome, RG, CPF, Data de Nascimento
   - **CNPJ**: Razão Social, Nome Fantasia, CNPJ, Inscrição Estadual, Nome do Responsável
4. Adicione informações de endereço e contato
5. Caso haja acompanhantes, preencha os dados e adicione mais clicando no botão "Adicionar Acompanhante"
6. Clique em "💾 Salvar Ficha de Hospedagem"
7. O hóspede será adicionado à lista automaticamente

### Gerenciar lista de hóspedes:
1. Role a página para ver a **Lista de Hóspedes Cadastrados**
2. Use os filtros para visualizar hóspedes de períodos específicos:
   - **Hoje**: mostra apenas hóspedes presentes hoje
   - **Esta Semana**: mostra hóspedes da semana atual
   - **Este Mês**: mostra hóspedes do mês atual
   - **Período personalizado**: escolha datas específicas
3. Clique em **"📊 Exportar para Excel"** para baixar uma planilha com todos os dados filtrados
4. A planilha incluirá:
   - Dados completos do hóspede principal
   - Informações de todos os acompanhantes
   - Nome do arquivo com data (ex: `hospedes_verdes_arcos_2026-02-05_a_2026-02-12.xlsx`)

### Exemplo de uso prático:
- **Ao final do dia**: Filtre por "Hoje" e exporte os check-ins do dia
- **Ao final da semana**: Filtre por "Esta Semana" e exporte o relatório semanal
- **Relatório mensal**: Filtre por "Este Mês" para ter todos os hóspedes do mês

## 🔄 Próximas melhorias sugeridas

- [x] Lista de hóspedes cadastrados
- [x] Filtros por data
- [x] Exportação para Excel
- [x] Salvamento local (LocalStorage)
- [ ] Integração com backend/API
- [ ] Exportação para PDF
- [ ] Máscaras para CPF, telefone e CEP
- [ ] Validação avançada de CPF
- [ ] Busca de endereço por CEP (ViaCEP)
- [ ] Busca/pesquisa de hóspedes por nome
- [ ] Edição de hóspedes cadastrados
- [ ] Estatísticas e dashboard (ocupação, receita, etc)

## 📄 Licença

Este projeto foi criado para a Pousada Verdes Arcos.

---

Desenvolvido com ❤️ para a Pousada Verdes Arcos
