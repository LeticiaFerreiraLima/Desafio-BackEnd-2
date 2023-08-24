![](https://i.imgur.com/xG74tOh.png)

# Desafio do Módulo 2 - Back-end

Projeto desenvolvido para a conclusão do módulo de API's, do curso de desenvolvimento Back end da [Cubos Academy](https://cubos.academy/), na 

## Proposta do desafio

O objetivo foi desenvolver uma API de arquitetura REST para um banco digital, o Banco Cubos. A API deve permitir criar contas, atualizar dados, realizar transações, exibir extratos de contas e entre outros. Para isso, foram usadas bibliotecas e frameworks de Node.js para implementar as funcionalidades requeridas.

## Tecnologias e ferramentas usadas
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![VS Code](https://img.shields.io/badge/VS%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

Frameworks:
> [Insomnia REST](https://insomnia.rest/), que permite testar e depurar API's.
> [Express](https://expressjs.com/pt-br/), que fornece uma série de recursos para aplicações web.

Biblioteca: 
> [Date-fns](https://date-fns.org/), que permite manipulação de datas em Javascript.

Utilitário:
> [Nodemon](https://www.npmjs.com/package/nodemon)
Seu papel é construir uma RESTful API que permita:


## Instalações
1. Você deve possuir o Node.js instalado em sua máquina. Para mais informações, acesse [aqui](https://nodejs.org/pt-br/about).
2. Para iniciar o projeto em Node.js em seu terminal:

 ```javascript
 npm init //caso queira personalizar as configurações iniciais do projeto
 ``` 
  ```javascript
 npm init -y //caso não deseje passar pelas configurações iniciais
 ``` 
  
3. Demais instalações

| Tecnologia | Versão | Comando para instalar |
|:----------|------|---------------------|
|Express| 4.18.2| ``` npm install express ``` |
|Nodemon  |  3.0.1 | ```npm install date-fns --save``` |
|Date-fns  |  2.30.0 |  ```npm install -D nodemon```|

Foi definido o comando ```npm run dev```, nos scripts do package.json, para automatizar a execução do projeto.

## Funcionalidades requeridas
-   Criar conta bancária 
-   Listar contas bancárias 
-   Atualizar os dados do usuário da conta bancária 
-   Excluir uma conta bancária 
-   Depósitar em uma conta bancária 
-   Sacar de uma conta bancária 
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária 
-   Emitir extrato bancário

Para desenvolver a API, foi usado o arquivo `bancodedados.js`. Este possui um objeto que contém as informações do Banco Cubos e onde serão inseridos objetos de contas e transações.

```javascript
{
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
}
```

Foram usados os seguintes status codes de respostas de API's:

| Status | Significado |
|:------------|------|
|200 (OK)| requisição bem sucedida|
|201 (Created)| requisição bem sucedida e algo foi criado|
|204 (No Content)| requisição bem sucedida, sem conteúdo no corpo da resposta|
|400 (Bad Request)| o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido|
|401 (Unauthorized)| o usuário não está autenticado (logado)|
|404 (Not Found)| o servidor não pode encontrar o recurso solicitado|


 
## Endpoints

### Listar contas bancárias


| Método HTTP | Rota |
|:------------|------|
|GET| `/contas?senha_banco=Cubos123Bank`|

Essa função permite listar todas as contas bancárias existentes. Para isso, ela verificar se a senha do banco foi informada como query params (senha_banco), na url, valida a senha do Banco Cubos e lista as contas, seguindo o exemplo abaixo:


```javascript
[
    {
        "numero": "1",
        "saldo": 0,
        "usuario": {
            "nome": "Maria Silva",
            "cpf": "00000011114",
            "data_nascimento": "2000-03-15",
            "telefone": "40028922",
            "email": "maria@email.com",
            "senha": "1234"
        }
    },
]

```

![Listar](/imagens/listar.png)

### Criar conta bancária

| Método HTTP | Rota |
|:------------|------|
|POST| `/contas`|

Essa função permite criar uma conta bancária, gerando um número único para identificação da conta (número da conta) e atribuindo um saldo(0). A conta deve obrigatoriamente possuir: nome, cpf, data de nascimento, telefone, email e senha. Essas informações devem ser passadas como objetos do corpo da requisição, exemplo:

```javascript
{
            "nome": "Ana Souza",
            "cpf": "11111111111",
            "data_nascimento": "2004-05-25",
            "telefone": "40038933",
            "email": "ana@email.com",
            "senha": "2523"
}
```
Caso já exista uma conta de mesmo CPF ou email, a conta não pode ser criada.

![Criar](/imagens/criarConta.png)

### Atualizar usuário da conta bancária

| Método HTTP | Rota |
|:------------|------|
|PUT| `/contas/:numeroConta/usuario`|

A função permite atualizar os dados de um usuário, para isso ela verificar se todos os campos foram informados no corpo da requisição (mesmas informações de criação de usuário), verifica se o CPF ou email já existem e atualiza os dados.

```javascript
{
            "nome": "Ana Souza Lima",
            "cpf": "11111111111",
            "data_nascimento": "2004-05-25",
            "telefone": "40038933",
            "email": "analima@email.com",
            "senha": "2523"
}
```
![Atualizar](/imagens/atualizar.png)

### Excluir Conta

| Método HTTP | Rota |
|:------------|------|
|DELETE| `/contas/:numeroConta`|

Essa função permite excluir uma conta bancária existente. Para isso, verifica se o número de conta informado como parâmetro de rota é válido, verifica se o saldo é 0 e então exclui.

![Deletar](/imagens/deletar.png)

### Depositar

| Método HTTP | Rota |
|:------------|------|
|POST| `/transacoes/depositar`|

Essa função permite somar o valor de um depósito ao saldo de uma conta válida e registrar essa transação no objeto depositos, do banco de dados. 
Para isso, ela verifica se o número da conta (numero_conta) e o valor a depositar foram passados no corpo da requisição, verifica a existência da conta, o valor (não pode ser negativo ou zero) e realiza a soma. Após realizar, é criado um objeto contendo as informações passadas e a data. Exemplo:

Requisição
```javascript
{
	"numero_conta": "1",
	"valor": 500
}
```

Registro de depósito
```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 500
}
```

![Depósito](/imagens/deposito.png)

### Sacar

| Método HTTP | Rota |
|:------------|------|
|POST| `/transacoes/sacar`|

Essa função permite subtrair o valor de um depósito ao saldo de uma conta válida e registrar essa transação no objeto saldos, do banco de dados. Para isso, ela verifica se o número da conta (numero_conta) e o valor a sacar e a senha foram passados no corpo da requisição. Valida a existência da conta, o valor (conta deve possuir saldo suficiente) e realiza o saque. Após realizar, é criado um objeto contendo as informações passadas e a data. Exemplo:

Requisição
```javascript
{
	"numero_conta": "1",
	"valor": 200,
    "senha": "2325"
}
```

Registro de um saque
```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 200
}
```

![Saque](/imagens/saque.png)

### Tranferir

| Método HTTP | Rota |
|:------------|------|
|POST| `/transacoes/transferir`|

Essa função permite transferir um valor de uma conta para outra e registrar essa transação no objeto transferências, do banco de dados. Para isso, ela verifica se o número da conta de origem e destino, o valor e a senha da conta de origem foram passados no corpo da requisição. Valida a existência das contas, o valor (conta de origem deve possuir saldo suficiente) e realiza a transferência. O valor transferido é subtraído do saldo da conta de origem e adicionado no saldo da conta de destino. Após realizar, é criado um objeto contendo as informações passadas e a data. Exemplo:

Requisição
```javascript

{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}
```

Registro de uma transferência

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 10000
}
```

![Tranferência](/imagens/transferencia.png)

### Saldo

| Método HTTP | Rota |
|:------------|------|
|DELETE| `/contas/:numeroConta`|
#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Essa função permite acessar o saldo de uma conta bancária. É verificado se todas as informações foram passadas na query params da url (numero da conta e senha), validada a existência da conta e a senha (se está correta) e exibido o saldo da conta informada. Exemplo:

Requisição - query params

    -   numero_conta
    -   senha

Resposta
```javascript
{
    "saldo": 13000
}
```

![Saldo](/imagens/saldo.png)

### Extrato

| Método HTTP | Rota |
|:------------|------|
|GET| `/contas/extrato?numero_conta=123&senha=123`|

Essea função lista as transações de uma conta específica que já foram realizadas.  É verificado se todas as informações foram passadas na query params da url (numero da conta e senha), validada a existência da conta e a senha (se está correta) e exibido o extrato da conta informada, contendo todas as transações já realizadas (depósitos, saques, transferências enviadas e recebidas). Exemplo:

Requisição - query params

    -   numero_conta
    -   senha

Resposta
```javascript
{
  "depositos": [
    {
      "data": "2021-08-18 20:46:03",
      "numero_conta": "1",
      "valor": 10000
    },
    {
      "data": "2021-08-18 20:46:06",
      "numero_conta": "1",
      "valor": 10000
    }
  ],
  "saques": [
    {
      "data": "2021-08-18 20:46:18",
      "numero_conta": "1",
      "valor": 1000
    }
  ],
  "transferenciasEnviadas": [
    {
      "data": "2021-08-18 20:47:10",
      "numero_conta_origem": "1",
      "numero_conta_destino": "2",
      "valor": 5000
    }
  ],
  "transferenciasRecebidas": [
    {
      "data": "2021-08-18 20:47:24",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    },
    {
      "data": "2021-08-18 20:47:26",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    }
  ]
}
```

![Extrato](/imagens/extrato.png)
> Dúvidas ou sugestões sobre o que foi feito no projeto? Entre em contato comigo via [LinkedIn](https://www.linkedin.com/in/leticia-ferreira-lima/)
