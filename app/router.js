const history = window.history;

export function parseLocation({ pathname }) {
  // eslint-disable-next-line
  const route = pathname.slice(0, __webpack_public_path__.length);
  const [owner, repo] = route.split('/');

  return {
    owner,
    repo,
  };
}

export function renderRoute(model) {
  const { owner, dialog } = model.data;
  // eslint-disable-next-line
  let path = __webpack_public_path__;

  if (owner) path += owner.login;
  if (dialog) path += `/${dialog.name}`;

  return path;
}

export function updateRoute(model) {
  const path = renderRoute(model);

  if (model.updates.init) {
    history.replaceState(model.data, '', path);
  } else {
    history.pushState(Object.assign({}, model.data), '', path);
  }
}
