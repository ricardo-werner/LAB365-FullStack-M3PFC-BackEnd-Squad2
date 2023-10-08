const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "Pharmacellticos",
    description:
      "Squad2",
  },
  host: "localhost:3333",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Usuários",
      description: "Endpoints de Usuários",
    },
    {
      name: "Vendas",
      description: "Endpoints de Vendas",
    },
    {
      name: "Carrinho",
      description: "Endpoints de Carrinho",
    },
    {
      name: "Pedidos",
      description: "Endpoints de Pedidos",
    },
    {
      name: "Produtos",
      description: "Endpoints de Produtos",
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header", // can be "header", "query" or "cookie"
      name: "Authorization", // name of the header, query parameter or cookie
      description: "any description...",
    },
  },
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  definitions: {
    Parents: {
      father: "Simon Doe",
      mother: "Marie Doe",
    },
    User: {
      name: "Jhon Doe",
      age: 29,
      parents: {
        $ref: "#/definitions/Parents",
      },
      diplomas: [
        {
          school: "XYZ University",
          year: 2020,
          completed: true,
          internship: {
            hours: 290,
            location: "XYZ Company",
          },
        },
      ],
    },
    AddUser: {
      $name: "Jhon Doe",
      $age: 29,
      about: "",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("../index"); // Your project's root file
});
