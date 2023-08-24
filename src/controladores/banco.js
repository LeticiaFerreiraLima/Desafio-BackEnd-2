//importação do banco de dados
const { 
    banco, 
    contas, 
    depositos, 
    saques, 
    transferencias } = require('../bancodedados.js'); 

//importação de middlewares
const { 
    validarSenhaBanco, 
    validarPreenchimento, 
    validarDadosRepetidos, 
    validarDadosContasDiferentes,
    validarExistenciaConta_Param, 
    validarExistenciaConta_Body, 
    validarExistenciaConta_Query, 
    validarSenhaUsuario_Query, 
    validarSenhaUsuario_Body, 
    } = require('../middleWares/intermediarios.js'); 

    //importação da lib date-fns
    const {format} = require('date-fns')

let proximoNumeroConta = 1; //variável para incrementar número da conta

//LISTAR CONTAS
const listarContas = async (req, res) => {
    validarSenhaBanco;
    return res.status(200).json(contas);
};

//ADICIONAR CONTA
const criarConta = async (req, res) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body; 

    validarPreenchimento
    validarDadosRepetidos

    const novaConta = {
        numero: String(proximoNumeroConta++), //incrementa o numero
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    contas.push(novaConta);

    return res.status(201).send(); // uso do send porque não é retornada nenhuma mensagem

};

//ATUALIZAR CONTA
const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const {contaExistente} = req; //recebimento da constante para verificar existencia da conta;

    validarExistenciaConta_Param;
    validarPreenchimento;
    validarDadosContasDiferentes;

    contaExistente.usuario.nome = nome;
    contaExistente.usuario.cpf = cpf;
    contaExistente.usuario.data_nascimento = data_nascimento;
    contaExistente.usuario.telefone = telefone;
    contaExistente.usuario.email = email;
    contaExistente.usuario.senha = senha;

    return res.status(200).send();

};

//DELETAR CONTA
const deletarConta = async (req, res) => {
    const {contaExistente} = req;

    validarExistenciaConta_Param;

    if(contaExistente.saldo !== 0) {
        return res.status(400).json({mensagem: "A conta só pode ser removida se o saldo for zero!"});
    };

    contas.splice(contaExistente, 1);
    return res.status(204).send();
};

//DEPOSITAR PARA UMA CONTA
const depositar = async (req, res) => {
    const {numero_conta, valor} = req.body;
    const {contaExistente} = req;
    const valorDeposito = Number(valor);
    const data = new Date(); // Obter data atual
    const dataFormatada = format(data, 'dd/MM/yyyy HH:mm:ss'); 

    if(!numero_conta || !valor) {
        return res.status(400).json({mensagem: 'É necessário informar o número da conta e o valor que deseja depositar.'}) 
    };

    validarExistenciaConta_Body;


    if(valorDeposito <= 0) {
        return res.status(400).json({mensagem: 'Não é possível depositar o valor informado.'})
    };

    contaExistente.saldo = contaExistente.saldo + valorDeposito;
    
    const novoDeposito = {
        dataFormatada,
        numero_conta,
        valor: valorDeposito
    }; 

    depositos.push(novoDeposito);
    return res.status(201).send();
};

// SACAR
const sacar = async (req, res) => {
    const {numero_conta, valor, senha} = req.body;
    const {contaExistente} = req;
    const valorSaque = Number(valor);
    const data = new Date(); // Obter data atual
    const dataFormatada = format(data, 'dd/MM/yyyy HH:mm:ss');

    if(!numero_conta || !valor || !senha) {
        return res.status(400).json({mensagem: 'É necessário informar o número da conta, a senha e o valor que deseja sacar.'}); 
    };

    validarExistenciaConta_Body;
    validarSenhaUsuario_Body;

    //conferir se há saldo suficiente
    if(valorSaque > contaExistente.saldo) {
        return res.status(400).json({ mensagem: "não há saldo suficiente para a transação." });
    };

    if(valorSaque <= 0) {
        return res.status(400).json({ mensagem: "Não é possível sacar o valor informado." });
    };

    contaExistente.saldo = contaExistente.saldo - valorSaque;
    
    const novoSaque = {
        dataFormatada,
        numero_conta,
        valor: valorSaque
    };

    saques.push(novoSaque);
    return res.status(201).send();
};

//TRANSFERIR
const transferir = async (req, res) => {
    const {numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    const valorTransferir = Number(valor);
    const data = new Date(); // Obter data atual
    const dataFormatada = format(data, 'dd/MM/yyyy HH:mm:ss');

    if(!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({mensagem: 'É necessário informar o número da conta de origem, de destino, a senha e o valor que deseja transferir.'}); 
    };


    //validar existencia da conta de origem
    const contaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem;
    });
    
    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'O número da conta de origem informada não é válido' })
    };

    // validar conta de destino
    const contaDestino = contas.find((conta) => {
        return conta.numero === numero_conta_destino;
    });
    
    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'O número da conta de destino informada não é válido' })
    }; 

    //verificarSenha
    if(senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: "A senha informada é inválida!" });
    }

    //conferir se há saldo suficiente
    if(valorTransferir > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: "não há saldo suficiente para a transação." });
    };

    if(valorTransferir <= 0) {
        return res.status(400).json({ mensagem: "Não é possível transferir o valor informado." });
    };

    contaOrigem.saldo -= valorTransferir;
    contaDestino.saldo += valorTransferir;

    const novaTransferencia = {
        dataFormatada,
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valorTransferir
    }

    transferencias.push(novaTransferencia);
    return res.status(201).send();
 };


//CONSULTAR SALDO
const consultarSaldo = async (req, res) => {
    const {numero_conta, senha} = req.query;
    const {contaExistente} = req;
    

    if(!numero_conta || !senha) {
        return res.status(400).json({mensagem: 'É necessário informar o número da conta, a senha e o valor que deseja sacar.'}); 
    };
 
    validarExistenciaConta_Query;
    validarSenhaUsuario_Query;

    return res.status(200).json(contaExistente.saldo)
    
};

//EXTRATO 
const exibirExtrato = async (req, res) => {
    const {numero_conta, senha} = req.query;

    if(!numero_conta || !senha) {
        return res.status(400).json({mensagem: 'É necessário informar o número da conta, a senha e o valor que deseja sacar.'}); 
    };

    validarExistenciaConta_Query;
    validarSenhaUsuario_Query;

    const historicoDepositos = depositos.filter(deposito => deposito.numero_conta === numero_conta);
    
    const historicoSaques = saques.filter(saque => saque.numero_conta === numero_conta);

    const historicoTransferenciasEnviadas = transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);

    const historicoTransferenciasRecebidas = transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta);

    const extratoUsuario = {
        historicoDepositos,
        historicoSaques,
        historicoTransferenciasEnviadas,
        historicoTransferenciasRecebidas
    };

    return res.status(200).json(extratoUsuario);

}

module.exports = { 
    listarContas, 
    criarConta, 
    atualizarConta, 
    deletarConta, 
    depositar, 
    sacar, 
    consultarSaldo, 
    transferir,
    exibirExtrato
};
