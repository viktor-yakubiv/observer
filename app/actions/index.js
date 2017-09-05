import camelize from 'camelize';
import * as api from './api';
import * as config from '../config';
import { parseLocation } from '../router';


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

export async function filter({ type, name, value, checked },
  present = this.present,
) {
  const filters = {};

  if (name === 'type') {
    filters[name] = ({
      all: config.REPO_ANY,
      fork: config.REPO_FORK,
      source: config.REPO_SOURCE,
    })[name];
  } else if (type === 'number') {
    filters[name] = +value;
  } else if (type === 'checkbox') {
    filters[name] = checked;
  } else {
    filters[name] = value;
  }

  present(camelize({ filters }));
}

export async function sort(prop, present = this.present) {
  present({ sort: prop });
}


export async function restoreState(state, present = this.present) {
  present({
    init: state,
  });
}

export async function init(location, present = this.present) {
  const { owner, repo } = parseLocation(location);
  const data = {};
  let queries = 0;

  if (!owner && !repo) {
    present({});
  }


  const saveData = (proposal) => {
    console.log(proposal);

    Object.assign(data, proposal);
    queries -= 1;

    if (!queries) {
      if (process.env.NODE_ENV === 'development') {
        console.log('%cINIT', 'color: blue;', data);
      }

      present(data);
    }
  };

  if (owner) {
    await loadOwner(owner, saveData);
    queries += 1;
  }

  if (repo) {
    await openRepo(`${owner}/${repo}`, saveData);
    queries += 1;
  }
}
