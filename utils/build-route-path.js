export function buildRoutePath(path) {
  //criacao de regex para identificar os route params
  const routeParametersRegex = /:([a-zA-Z]+)/g;

  //?<$1> nomear/separar grupo
  const pathWithParams = path.replace(
    routeParametersRegex,
    `(?<$1>[a-z0-9\-_]+)`,
  );

  //(?<query>\\?(.*))?$ => adicao de regex para identificar os query params
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  //pathRegex => `path`:([a-zA-Z]+)
  //pathRegex => `path`^(?<$1>[a-z0-9\-_]+)(?<query>\\?(.*))?$
  return pathRegex;
}
