//extrair query params
// ex => ?search=Taline
export function extractQueryParams(query) {
  //substr(1) vai remover o primeiro caractere, no caso eh o ?
  //query.substr(1).split('&') => ['search=taline']
  return query
    .substr(1)
    .split('&')
    .reduce((queryParams, param) => {
      //param.split('=') => ['search', 'taline']
      const [key, value] = param.split('=');

      // queryParams[key] = value => {"search" : "taline"}
      queryParams[key] = value;

      return queryParams;
    }, {});
}
