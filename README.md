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


### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint deve excluir uma conta bancária existente.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta passado como parametro na URL é válido
    -   Permitir excluir uma conta bancária apenas se o saldo for 0 (zero)
    -   Remover a conta do objeto de persistência de dados.

-   **Requisição**

    -   Numero da conta bancária (passado como parâmetro na rota)

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "A conta só pode ser removida se o saldo for zero!"
}
```

### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint deverá somar o valor do depósito ao saldo de uma conta válida e registrar essa transação.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta e o valor do deposito foram informados no body
    -   Verificar se a conta bancária informada existe
    -   Não permitir depósitos com valores negativos ou zerados
    -   Somar o valor de depósito ao saldo da conta encontrada

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// POST /transacoes/depositar
{
	"numero_conta": "1",
	"valor": 1900
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O número da conta e o valor são obrigatórios!"
}
```

#### Exemplo do registro de um depósito

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint deverá realizar o saque de um valor em uma determinada conta bancária e registrar essa transação.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta, o valor do saque e a senha foram informados no body
    -   Verificar se a conta bancária informada existe
    -   Verificar se a senha informada é uma senha válida para a conta informada
    -   Verificar se há saldo disponível para saque
    -   Subtrair o valor sacado do saldo da conta encontrada

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor
    -   senha

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// POST /transacoes/sacar
{
	"numero_conta": "1",
	"valor": 1900,
    "senha": "123456"
}
```
#### Exemplo de Resposta
```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O valor não pode ser menor que zero!"
}
```

#### Exemplo do registro de um saque

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint deverá permitir a transferência de recursos (dinheiro) de uma conta bancária para outra e registrar essa transação.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body
    -   Verificar se a conta bancária de origem informada existe
    -   Verificar se a conta bancária de destino informada existe
    -   Verificar se a senha informada é uma senha válida para a conta de origem informada
    -   Verificar se há saldo disponível na conta de origem para a transferência
    -   Subtrair o valor da transfência do saldo na conta de origem
    -   Somar o valor da transferência no saldo da conta de destino

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// POST /transacoes/transferir
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}
```
#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Saldo insuficiente!"
}
```

#### Exemplo do registro de uma transferência

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 10000
}
```

### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Esse endpoint deverá retornar o saldo de uma conta bancária.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verificar se a conta bancária informada existe
    -   Verificar se a senha informada é uma senha válida
    -   Exibir o saldo da conta bancária em questão

-   **Requisição** - query params

    -   numero_conta
    -   senha

-   **Resposta**

    -   Saldo da conta

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
{
    "saldo": 13000
}
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Conta bancária não encontada!"
}
```

### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Esse endpoint deverá listar as transações realizadas de uma conta específica.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verificar se a conta bancária informada existe
    -   Verificar se a senha informada é uma senha válida
    -   Retornar a lista de transferências, depósitos e saques da conta em questão.

-   **Requisição** - query params

    -   numero_conta
    -   senha

-   **Resposta**
    -   Relatório da conta

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
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

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Conta bancária não encontada!"
}
```

**LEMBRE-SE**: Feito é melhor do que perfeito, mas não faça mal feito!!!

###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio`
