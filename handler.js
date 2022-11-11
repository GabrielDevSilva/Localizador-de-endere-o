"use strict";

const axios = require("axios");

module.exports.searchCep = async (event) => {
  try {
    let cep = String(event.queryStringParameters?.cep)
      ?.trim()
      ?.replace(/[a-zA-B.-]/g, "");
    if (!cep) throw new Error("campo vazio");
    if (!/\d{8}/.test(cep) || cep.length !== 8) throw new Error("CEP inválido");
    if (validateCep(cep)) throw new Error("CEP inválido");
    const url = `http://viacep.com.br/ws/${cep}/json/`;
    const address = (await axios.get(url))?.data;
    if (!address) throw new Error("CEP não encontrado");
    const location = `${address.logradouro} - ${address.bairro}, ${address.localidade} - ${address.uf}`;
    return {
      statusCode: 200,
      body: {
        address,
        location,
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
