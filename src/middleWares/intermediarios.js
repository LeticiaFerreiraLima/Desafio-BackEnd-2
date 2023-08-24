const { banco, contas } = require('../bancodedados');

//Função para validação da senha do banco informada na requisição
const validarSenhaBanco = (req, res, next) => {
    const {senha_banco} = req.query;

    if (!senha_banco) {
        return res.status(401).json({ mensagem: "A senha não foi informada." });
    };

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    };

    next();
};

//Função criada para validar se todos os dados foram informados
const validarPreenchimento = (req, res, next) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;

    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({mensagem: 'Todos os campos são de preenchimento obrigatório'})
    };

    next();
};

//validar repetição de email e cpf
const validarDadosRepetidos = (req, res, next) => {
    const  {cpf, email} = req.body;

    const cpfRepetido = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });
    const emailRepetido = contas.find((conta) => {
        return conta.usuario.email === email;
    });

    if(cpfRepetido || emailRepetido) {
        return res.status(400).json({mensagem: 'Já existe uma conta com o cpf ou e-mail informado'});
    };

    next();
};

const validarDadosContasDiferentes = (req, res, next) => {
    const { numeroConta } = req.params;

    const contasDiferentes = contas.filter(conta => conta.numero !== numeroConta);

    if (contasDiferentes.length > 0) {
        const cpfRepetido = contasDiferentes.find((conta) => {
            return conta.usuario.cpf === cpf;
        });
        const emailRepetido = contasDiferentes.find((conta) => {
            return conta.usuario.email === email;
        });

        if (cpfRepetido || emailRepetido) {
            return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado' });
        };
    }; 

    next();
}

//função para verificar se a conta existe baseado no número informado nos parâmetros de rota
const validarExistenciaConta_Param = (req, res, next) => {
    const { numeroConta } = req.params;

    const contaExistente = contas.find((conta) => {
        return conta.numero === numeroConta;
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'O número da conta informada não é válido' })
    }; 

    req.contaExistente = contaExistente;

    next();
};

//função para verificar se a conta existe baseado no número informado no corpo da requisição
const validarExistenciaConta_Body = (req, res, next) => {
    const { numero_conta } = req.body

    const contaExistente = contas.find((conta) => {
        return conta.numero === numero_conta;
    });
    
    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'O número da conta informada não é válido' })
    }; 

    req.contaExistente = contaExistente;

    next();
};

//função para verificar se a conta existe, quando o número de conta é passado como query params.
const validarExistenciaConta_Query = (req, res, next) => {
    const { numero_conta } = req.query;

    const contaExistente = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'O número da conta informada não é válido' })
    }; 

    req.contaExistente = contaExistente;

    next();
};


//Função para validar a senha do cliente, quando ela é passada como query params.
const validarSenhaUsuario_Query = (req, res, next) => {
    const {senha} = req.query;
    const {contaExistente} = req;

    validarExistenciaConta_Query;

    if (!senha) {
        return res.status(401).json({ mensagem: "A senha não foi informada." });
    };

    if(senha !== contaExistente.usuario.senha) {
        return res.status(401).json({ mensagem: "A senha informada é inválida!" });
    };

    next();
};

//Função para validar a senha do cliente, quando ela é passada no corpo da requisição;
const validarSenhaUsuario_Body = (req, res, next) => {
    const {senha} = req.body;
    const {contaExistente} = req;

    validarExistenciaConta_Body;

    if (!senha) {
        return res.status(401).json({ mensagem: "A senha não foi informada." });
    };

    if(senha !== contaExistente.usuario.senha) {
        return res.status(401).json({ mensagem: "A senha informada é inválida!" });
    };
    
    next();
};


module.exports = {validarSenhaBanco, validarPreenchimento, validarDadosRepetidos, validarExistenciaConta_Body, validarExistenciaConta_Param, validarExistenciaConta_Query, validarSenhaUsuario_Body, validarSenhaUsuario_Query, validarDadosContasDiferentes};