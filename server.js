import http from 'node:http';
import { json } from './middleware/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';
import 'dotenv/config.js';

let PORT = process.env.PORT || 3332;

const server = http.createServer(async (request, response) => {
  await json(request, response);

  const route = routes.find((route) => {
    return route.method === request.method && route.path.test(request.url);
  });

  if (route) {
    const routeParams = request.url.match(route.path);
    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = query ? extractQueryParams(query) : {};

    return route.handler(request, response);
  }

  return response.writeHead(404).end('Rota não existe.');
});

server.listen(3332);

export default server;
//criar servidor, adicionar porta no listen do servidor
//adicionar middleware de json ou qualquer outro formato
//procurar uma rota com base nos dados de method e url da requisicao e se essa rota existir, chamar a funcao handler dela para que seja executada
//adicionar no path da minha rota (no arquivo routes), a funcao de buildRoutePath com o path como parametro => meu path da rota agora vai ser transformado em uma regex e essa regex precisa testar true para q rota ser validada e essa validao eh feita durante o methodo find no server - routes.find()
//se a rota existir, eh feito o retorno dos valores do regex (grupos) com o metodo match - routeParams
//nem sempre uma query params vai existir, entao eh preciso fazer uma validacao para caso nao exista, se nao existir retornar um {} vazio para nao dar erro
