1. Pré-requisitos
Para executar este projeto, será necessário ter o seguinte software instalado na máquina:

Node.js (v16 ou superior): Inclui o gerenciador de pacotes npm.

MySQL Server: O banco de dados. (Recomenda-se também o MySQL Workbench ou outro cliente de BD para facilitar a visualização).

Quasar CLI: A interface de linha de comando para projetos Quasar.

Para instalar, rode no terminal: npm install -g @quasar/cli

2. Configuração do Banco de Dados (MySQL)
O primeiro passo é criar o banco de dados e a tabela que armazenará os dados.

Inicie o MySQL Server na sua máquina.

Acesse o MySQL (seja pelo terminal ou por um cliente gráfico como o Workbench).

Crie o Banco de Dados: O nome utilizado no código é todo_ubi.

SQL:

CREATE DATABASE todo_ubi;

USE todo_ubi;

Crie a Tabela de Tarefas: Copie e execute o script SQL abaixo para criar a tabela tarefas.

SQL

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    data_final DATE,
    prioridade INT,
    status INT
);

Verifique: Após a execução, a tabela tarefas deve existir dentro do banco todo_ubi e estar pronta para receber dados.

3. Configuração do Back-end (Express API)
O back-end é o servidor que o front-end irá consumir.

Navegue até a pasta do back-end:
cd caminho/para/projeto-todo-ubi/backend

Inicie o projeto Node.js:
npm init -y

Instale as dependências necessárias:
npm install express mysql2 cors

⚠️ AÇÃO OBRIGATÓRIA: Configure a Conexão do BD Abra o arquivo server.js e localize o objeto dbConfig. É crucial que você altere os dados user e password para os dados do seu MySQL local.

Inicie o Servidor Back-end:
node server.js

Verificação: Se tudo deu certo, você verá a seguinte mensagem no terminal, indicando que a API está rodando na porta 3000.

Servidor da API rodando em http://localhost:3000 e na sua rede local.

4. Configuração do Front-end (Quasar)
O front-end é a interface com o usuário.

Navegue até a pasta do front-end:
cd caminho/para/projeto-todo-ubi/frontend
Instale as dependências do Quasar:
npm install

⚠️ AÇÃO OBRIGATÓRIA: Configure a URL da API O projeto Quasar precisa saber onde o back-end está rodando.

Procure o arquivo de configuração do Axios (quasar-project/src/boot/axios.js). Garanta que a baseURL esteja configurada corretamente.

Inicie a Aplicação Quasar:

npm run dev:android
