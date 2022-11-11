const { searchCep } = require("./handler");
const axios = require("axios");
const mock = {
  address: {
    cep: "44076-762",
    logradouro: "Rua Virginópolis",
    complemento: "",
    bairro: "Parque Getúlio Vargas",
    localidade: "Feira de Santana",
    uf: "BA",
    ibge: "2910800",
    gia: "",
    ddd: "75",
    siafi: "3515",
  },
  location: "Rua Virginópolis - Parque Getúlio Vargas, Feira de Santana - BA",
};
jest.mock("axios");
describe("Should not work", () => {
  describe("teste cep vazio", () => {
    test("sem variável", async () => {
      const response = await searchCep({});
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("campo vazio");
    });
    test("variável vazia", async () => {
      const response = await searchCep({
        queryStringParameters: {
          cep: "",
        },
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("campo vazio");
    });
  });
  describe("string correta", () => {
    test("menor que oito", async () => {
      const response = await searchCep({
        queryStringParameters: {
          cep: "0000000",
        },
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("CEP inválido");
    });
    test("menor que oito - apenas números", async () => {
      const response = await searchCep({
        queryStringParameters: {
          cep: 1000000,
        },
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("CEP inválido");
    });
    test("menor que oito com letra", async () => {
      const response = await searchCep({
        queryStringParameters: {
          cep: "00a000",
        },
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("CEP inválido");
    });
    test("maior que oito", async () => {
      const response = await searchCep({
        queryStringParameters: {
          cep: "000000000",
        },
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("CEP inválido");
    });
    test("maior que oito - apenas números", async () => {
      const response = await searchCep({
        queryStringParameters: {
          cep: 100000000,
        },
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("CEP inválido");
    });
    test("maior que oito com letra", async () => {
      const response = await searchCep({
        queryStringParameters: {
          cep: "00a0000000",
        },
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("CEP inválido");
    });
    test("igual oito com letra", async () => {
      const response = await searchCep({
        queryStringParameters: {
          cep: "00a00000",
        },
      });
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("CEP inválido");
    });
  });
});

describe("should work", () => {
  beforeAll(() => {
    axios.get.mockImplementation(() =>
      Promise.resolve({ statusCode: 200, data: mock.address })
    );
  });
  test("igual oito", async () => {
    const response = await searchCep({
      queryStringParameters: {
        cep: "44076762",
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.location).toBe(mock.location);
    expect(response.body.address).toMatchObject(mock.address);
  });
  test("igual oito", async () => {
    const response = await searchCep({
      queryStringParameters: {
        cep: "44.076-762",
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.location).toBe(mock.location);
    expect(response.body.address).toMatchObject(mock.address);
  });
});
