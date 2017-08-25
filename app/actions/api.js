import camelize from 'camelize';
import { API_URL } from '../config';

export function call(resource, params) {
  return fetch(`${this.url}/${resource}`, params)
    .then(response => response.json())
    .then(object => Promise.resolve(() => camelize(object)));
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
