class validarErros extends Error {
  constructor(message) {
    super(message);
    this.name = 'validarErros';
  }
}

function validarNome(nome) {
  if (!nome || nome.trim() === '') {
    throw new Error('O campo Nome não pode ser vazio.');
  }
}

function validarEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new validarErros(
      'O campo email está em um formato inválido ou vazio.'
    );
  }
}

function validarTelefone(telefone) {
  if (telefone < 0 || !/^[0-9]+$/.test(telefone)) {
    throw new validarErros('O campo telefone deve conter apenas números e não pode ser negativo.');
  }
}

function validarCPF(cpf) {
  const cpfRegex = /^\d{11}$/;
  if (!cpfRegex.test(cpf)) {
    throw new validarErros('O campo CPF está em um formato inválido.');
  }
}

function validarSenha(senha) {
  if (
    senha.length < 8 ||
    !/[a-z]/.test(senha) ||
    !/[A-Z]/.test(senha) ||
    !/\d/.test(senha) ||
    !/[@#$%^&+=!*-]/.test(senha)
  ) {
    throw new validarErros('O campo senha está em um formato inválido.');
  }
}

function validarTipoUsuario(tipoUsuario) {
  const tiposPermitidos = ['Administrador', 'Comprador'];
  if (!tiposPermitidos.includes(tipoUsuario)) {
    throw new Error('Tipo de usuário inválido.');
  }
}

module.exports = {
  validarNome,
  validarErros,
  validarEmail,
  validarTelefone,
  validarCPF,
  validarSenha,
  validarTipoUsuario,
};
