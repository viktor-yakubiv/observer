import * as api from './api';

export async function init(present = this.present) {
  present({});
}

export async function loadOwner(name, present = this.present) {
  present({ owner: name });

  Promise.all([
    api.fetchUser(name),
    api.fetchUserRepos(name),

    api.fetchOrg(name),
    api.fetchOrgRepos(name),
  ]).then(([user, userRepos, org, orgRepos]) => {
    console.log(user, org);
    const owner = user || org;
    const repos = userRepos || orgRepos;

    present({ owner, repos });
  });
}

export async function openRepo(name, present = this.present) {
  Promise.all([
    api.fetchRepo(name),
    api.fetchContributors(name),
    api.fetchLanguages(name),
    api.fetchPulls(name),
  ]).then(([repo, contributors, languages, pulls]) => {
    present({
      repo: Object.assign(repo, {
        contributors,
        languages,
        pulls,
      }),
    });
  });
}

export async function filter({ param, value }, present = this.present) {
  const filters = {};

  filters[param] = value;

  present(filters);
}

export async function sort(prop, present = this.present) {
  present({ sort: prop });
}
