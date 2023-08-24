const express = require('express');
const rotas = express();

//importação de controladores
const { 
    listarContas, 
    criarConta, 
    atualizarConta, 
    deletarConta, 
    depositar, sacar, 
    consultarSaldo, transferir, exibirExtrato
} = require('./controladores/banco');

//importação de middlewares
const {
    validarSenhaBanco, 
    validarPreenchimento, 
    validarDadosRepetidos,
    validarDadosContasDiferentes,
    validarExistenciaConta_Body, 
    validarExistenciaConta_Param, 
    validarExistenciaConta_Query, 
    validarSenhaUsuario_Query, 
    validarSenhaUsuario_Body, 
} = require('./middleWares/intermediarios');

//end points
rotas.get('/contas', validarSenhaBanco, listarContas);
rotas.post('/contas', validarPreenchimento, validarDadosRepetidos, criarConta);
rotas.put('/contas/:numeroConta/usuario', validarExistenciaConta_Param, validarPreenchimento, validarDadosContasDiferentes, atualizarConta);
rotas.delete('/contas/:numeroConta', validarExistenciaConta_Param, deletarConta);
rotas.post('/transacoes/depositar', validarExistenciaConta_Body, depositar);
rotas.post('/transacoes/sacar', validarExistenciaConta_Body, validarSenhaUsuario_Body, sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', validarExistenciaConta_Query, validarSenhaUsuario_Query, consultarSaldo);
rotas.get('/contas/extrato', validarExistenciaConta_Query, validarSenhaUsuario_Query, exibirExtrato);

module.exports = rotas;