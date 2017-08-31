function ready() {
  return true;
}

function owner({ data }) {
  return data.owner && data.repos &&
    (typeof data.owner === 'object') && (typeof data.repos === 'object');
}

function dialog({ data }) {
  return data.dialog;
}

export {
  dialog,
  owner,
  ready,
};
