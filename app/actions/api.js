import camelize from 'camelize';
import { API_URL } from '../config';

export function call(resource, params) {
  return fetch(`${API_URL}/${resource}`, params)
    .then(response => response.json())
    .then(object => Promise.resolve(camelize(object)));
}

export function fetchUser(name) {
  return this.call(`users/${name}`);
}

export function fetchOrg(name) {
  return this.call(`orgs/${name}`);
}

export function fetchUserRepos(name) {
  return this.call(`users/${name}/repos`);
}

export function fetchOrgRepos(name) {
  return this.call(`orgs/${name}/repos`);
}


export function fetchRepo(name) {
  return this.call(`repos/${name}`);
}

export function fetchContributors(repo) {
  return this.call(`repos/${repo}/contributors`);
}

export function fetchLanguages(repo) {
  return this.call(`repos/${repo}/languages`);
}

export function fetchPulls(repo) {
  return this.call(`repos/${repo}/pulls?sort=popularity`);
}
