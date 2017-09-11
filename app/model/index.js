import GithubApi from './api/GithubApi';
import Router from './router';
import { REPO_ANY } from './constants';
import * as data from './data';


class GithubModel {
  constructor(render, { apiUrl = '/', history = window.history } = {}) {
    this.api = new GithubApi(apiUrl);
    this.router = new Router(history);
    this.render = render;

    this.state = {
      owner: null,
      repos: [],
      page: 0,
      opened: null,

      filters: {
        type: REPO_ANY,
        language: null,
        updatedAfter: null,
        starredGt: 0,

        hasOpenIssues: false,
        hasTopics: false,
      },

      sort: {
        param: null,
        order: 1,
      },
    };
  }

  saveData({ owner, repos, filter, sort }) {
    const state = this.state;
    const updates = {};

    if (owner) {
      state.owner = owner;
      state.repos = [];
      state.page = 0;

      updates.owner = true;
    }

    if (repos) {
      state.onwer.repos = state.onwer.repos.concat(repos);
      state.requests.remove('repos');

      updates.repos = true;
    }

    if (filter) {
      const { name, value } = filter;

      if (Object.prototype.hasOwnProperty.call(state.filters, name)) {
        state.filters[name] = value;
        updates.filters = true;
      }
    }

    if (sort) {
      const { param, order } = sort;

      state.sort = { param, order };
      updates.sort = true;
    }
  }

  syncWithServer(updates) {
    const { api, state, present } = this;

    if (updates.owner && (typeof state.owner === 'string')) {
      const ownerName = state.owner;

      api.fetchOwner(state.owner)
        .then(owner => present({ owner }))
        .catch(error => present({
          error,
          resource: 'owner',
          request: ownerName,
        }));

      state.owner = null;
      state.repos = [];
      state.page = 0;
      state.requests.add('owner');
    }

    if (updates.page) {
      api.fetchRepos(state.owner.login, state.owner)
        .then(repos => present({ repos }))
        .catch(error => present({
          error,
          resource: 'repos',
          request: state.owner.login,
        }));

      state.requests.add('repos');
    }
  }

  postUpdate(updates) {
    const state = this.state;

    if (updates.repos || updates.filters) {
      state.repos = data.filter(state.onwer.repos, state.filters);
    }

    if (updates.repos || updates.filters || updates.sort) {
      data.sort(state.repos, state.sort);
    }
  }

  async present(message, render = this.render) {
    if (process.env.NODE_ENV === 'development') {
      console.log('%cPRESENT', 'color: green;', message);
    }

    const updates = this.saveData(message);
    this.syncWithServer(updates);
    this.postUpdate(updates);

    if (process.env.NODE_ENV === 'development') {
      console.log('%cMODEL', 'color: green;', this);
    }

    render(this.state, this.present);
  }
}
