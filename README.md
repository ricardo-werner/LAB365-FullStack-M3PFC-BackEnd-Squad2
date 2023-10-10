<h1 align=center>
LAB365-FullStack-M03-Projeto Final: Marketplace de Farmácia
</h1>

---

## 🏁 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Features](#-features)
- [Demonstração da Aplicação](#-demonstração-da-aplicação)
- [Pré-requisitos](#-pré-requisitos)
- [Instalar e rodar o Backend](#-instalar-e-rodar-o-backend)
- [Tecnologias](#-tecnologias)
- [Melhorias](#melhorias)
- [Autor](#autor)
- [Licença](#licença)
- [Status do Projeto](#status-do-projeto)


---

### 💻 Sobre o Projeto

<p>
O projeto tem por objetivo desenvolver um sistema Marketplace de produtos farmacêuticos capaz de fazer a gestão de vários vendedores (farmácias), clientes vendas e dentro de uma única plataforma. 
</p>

---

### ✨ Features

- [x] Cadastro de usuário
- [x] Login do Usuário
- [x] Autenticação e autorizações
- [x] Atualização do Status do Usuário no Sistema
- [x] Atualização de Senha do Usuário
- [x] Listagem de Usuário pelo identificador
- [x] Cadastro de Depósito
- [x] Listagem de Depósitos
- [x] Listagem de Depósito pelo identificador
- [x] Exclusão de Depósito
- [x] Cadastro de medicamentos
- [x] Atualização dos dados de Depósitos
- [x] Atualização do Status do Depósito no Sistema
- [x] Cadastro de Medicamento
- [x] Atualização dos dados de Medicamento
- [x] Listagem de Medicamentos
- [x] Listagem de Medicamento pelo identificador
- [x] Exclusão de Medicamento

---

# M3P-BackEnd-Squad2
# LAB365-FullStack-M03-ProjFinal-Marketplace
## Projeto Avaliativo do Módulo3
## LAB365- FullStack - Itaguaçu
### Projeto realizado em squad, formado pelos alunos desenvolvedores:
- Carlos Hnerique Moreira Junior (Github - https://www.github.com/chmjr)
- Debora Patricia Santos de Souza (Github - https://www.github.com/deborasous )
- Rafael Zampieron (Github - https://www.github.com/rafazamp )
- Ricardo Werner Grosscklauss (Github - https://www.github.com/ricado-werner)

#### Criação de sistema de Marketplace (E-Commerce):
- Frontend - React.JS
- Backend - Node.JS, Express, Sequelize em banco de dados PostgreSQL
#### Nome do sistema: PharmaSellticos
<p align="center">
  <!--img width="480" src="src/assets/to_readme/logoInst.jpg"-->
</p>

### 🔗 Links
*** links das redes sociais de cada participante


Status - Em Desenvolvimento

### Demonstração

Estrutura geral do back-end das Tabelas
<p align="center">
  <!--img width="480" src="src/assets/to_readme/geralTabelas.jpg"-->
</p>

Estrutura geral do back-end dos Usuários
<p align="center">
  <!--img width="480" src="src/assets/to_readme/usuarioTable.jpg"-->
</p>

Estrutura geral do back-end dos Medicamentos
<p align="center">
  <!--img width="480" src="src/assets/to_readme/depositoTable.jpg"-->
</p>
Estrutura geral do back-end do Gateway de Pagamento
<p align="center">
  <!--img width="480" src="src/assets/to_readme/medicamentoTable.jpg"-->
</p>

### O Desafio
Neste projeto foi proposto criar um sistema completo, com front-end e back-end,  para administrarmos um app de Marketplace(E-Commerce) de forma online, codificado em React.JS e Node.JS

### Formato do Sistema

### Back-end

### Requisitos da Aplicação

| Item | Descrição                                                                    |
| ---- | ---------------------------------------------------------------------------- |
| 1    | Ser uma API Rest desenvolvida em Node.JS com uso do Express.js.              |
| 2    | Utilizar o banco de dados PostgreSQL.                                        |
| 3    | Ser planejado utilizando o modelo Kanban na ferramenta Trello.               |
| 4    | Ser versionado no GITHub, possuindo uma documentação detalhada no readme.md. |
| 5    | Deverá ser gravado um vídeo de apreentação do sistema.                       |

### Formato do Sistema

| Item                                         | Descrição                                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Carregamento de Dados Iniciais               | Deve ser utilizado como Sistema Gerenciador de BD o PostgreSQL                                       |
| Cadastro de Usuário                          | Serviço de cadastro de usuário com dados completos, definição de Endpoint com status                 |
| Login do Usuário                             | Serviço para realizar o login, definição de Endpoint com status                                      |
| Atualização dos Dados de Usuário             | Serviço para alterar/atualizar os dados do usuário, definição de Endpoint com status                 |
| Atualização do Status do Usuário no Sistema  | Serviço para alterar/atualizar o status do usuário, definição de Endpoint com status                 |
| Atualização de Senha do Usuário              | Serviço para alterar/atualizar a senha de determinado usuário, definição do Endpoint com status      |
| Listagem de Usuário pelo indentificador      | Serviço de consulta de usuário pelo ID, definição de Endpoint com status                             |
| Cadastro de Despósito                        | Serviço de cadastro de DEpósito com dados completos, definição de Endpoint com status                |
| Atualização dos dados de Despósito           | Serviço para alterar/atualizar os dados de determinado depósito , definção de Endpoint com status    |
| Atualização do Status do Depósito no Sistema | Serviço apra alterar/atualizar o status do depósito no sistema, definição de Endpoint com status     |
| Listagem de Depósitos                        | Serviço de listagem de depósitos cadastrados, definição do Endpoint com status                       |
| Listagem de Depósito pelo identificador      | Serviço de consulta de depósito pelo ID, definição de Endpoint com status                            |
| Exclusão de Depósitos                        | Serviço para excluir um depósito pelo ID, definição de Endpoint com status                           |
| Cadastro de Medicamentos                     | Serviço de cadastro de Medicamentos com dados completos, definição de Endpoint com status            |
| Atualização dos dados de Medicamentos        | Serviço para alterar/atualizar os dados de determinado medicamento, definição de Endpoint com status |
| Listagem de Medicamentos                     | Serviço de listagem de medicamentos cadastrados, definição de Endpoint com status                    |
| Listagem de Medicamentos pelo indentificador | Serviço de listagem de medicamentos pelo ID, definição de Endpoint com status                        |
| Exclusão de Medicamento                      | Serviço para excluir um medicamento pelo ID, definição de Endpoint com status                        |

### Plano do Projeto

No desenvolvimento desta aplicação, colocamos em prática:

| Item | Descrição  |
| ---- | ---------- |
|  1   | Node.JS    |
|  2   | Express.JS |
|  3   | Sequelize  |
|  4   | PostgreSQL |
|  5   | Swagger    |
|  6   | Deploy     |
|  7   | Skills     |
|  8   | Squad      |

### Tecnologias utilizadas:

- Visual Studio Code
- NodeJS (compilação Vite - página oficial - https://vitejs.dev/ )
- Trello


## Para utilizar este projeto como base, faça o seguinte passo-a-passo:

### Nota - Para que o sistema funcione corretamente, primeiramente é necessário ter instalado no seu computador:
- Node.JS
- Node Package Manager(NPM)
- PostgreSQL (Base de dados)
- DBeaver (Gerenciador de banco de dados)

Clone o projeto para a sua máquina
```bash
git@github.com:FullStack-Itaguacu/M3P-BackEnd-Squad2.git
```
Obs: necessário configurar SSH [(veja como clicando aqui)](https://www.youtube.com/watch?v=n-H1eFSsugo)

Instale as dependências.

### Backend
```bash
npm install
```

- Rode o projeto

```bash
npm run start:dev


## Autores:
Turma: Full-Stack - Itaguaçu
Squad: ItaguaDevs
Mentoria: Prof. Pedro Henrique Silva
Senai/SC: Serviço Nacional de Aprendizagem Industrial
LAB365: espaço do @senai.sc para desenvolver as habilidades do futuro
Floripa Mais Tech  
