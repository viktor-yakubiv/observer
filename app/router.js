const history = window.history;

export function parseLocation({ pathname }) {
  const [, owner, repo] = pathname.split('/');

  return {
    owner,
    repo,
  };
}

export function renderRoute(model) {
  const { owner, dialog } = model.data;
  let path = '';

  if (owner) path += `/${owner.login}`;
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
