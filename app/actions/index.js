import * as api from './api';

export async function init(present = this.present) {
  present({});
}

export async function loadOwner(name, present = this.present) {
  Promise.all([
    api.fetchUser(name),
    api.fetchUserRepos(name),

    api.fetchOrg(name),
    api.fetchOrgRepos(name),
  ]).then(([user, userRepos, org, orgRepos]) => {
    const owner = user || org;
    const repos = userRepos || orgRepos;

    present({ owner, repos });
  });
}

export async function openRepo({ owner, repo }, present = this.present) {
  console.log('Fetch repository', owner, repo);
}

export async function filter({ param, value }, present = this.present) {
  const filters = {};

  filters[param] = value;

  present(filters);
}

export async function sort(prop, present = this.present) {
  present({ sort: prop });
}
