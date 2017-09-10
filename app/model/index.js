import { REPO_ANY } from '../config';
import { filter, sort } from './helpers';


export default class GitHubClientModel {
  constructor(render) {
    this.render = render;

    this.state = {
      owner: null,
      repos: {
        fetched: [],
        next: null,

        used: [],
      },
      dialog: null,

      filters: {
        type: REPO_ANY,
        language: null,
        updatedAfter: null,
        starredGt: 0,

        hasOpenIssues: false,
        hasTopics: false,
      },

      sort: null,
    };

    this.present = this.present.bind(this);
  }

  saveData(data) {
    const state = this.state;
    const updates = {};

    if (data.owner) {
      state.owner = data.owner || state.owner;
      updates.owner = true;

      state.repos = {
        fetched: [],
        next: null,

        used: [],
      };
      updates.repos = true;
    }

    if (data.repos) {
      state.repos.fetched = state.repos.fetched
        .concat(data.repos.map(repo => Object.assign(repo, {
          updatedAt: new Date(repo.updatedAt),
          createdAt: new Date(repo.createdAt),
        })));
      state.repos.next = data.next || null;
      updates.repos = true;
    }

    if (data.repo && state.repos.fetched) {
      const repo = state.repos.fetched
        .find(({ fullName }) => (data.repo.fullName === fullName));

      if (repo) {
        Object.assign(repo, data.repo);

        repo.updatedAt = new Date(repo.updatedAt);
        repo.createdAt = new Date(repo.createdAt);

        state.dialog = repo;
        updates.dialog = true;
      }
    }

    if (data.filters) {
      const filters = state.filters;

      Object.keys(data.filters).forEach((name) => {
        if (Object.prototype.hasOwnProperty.call(filters, name)) {
          filters[name] = data.filters[name];
          updates.filters = true;
        }
      });
    }

    if (data.sort) {
      state.sort = data.sort;
      updates.sort = true;
    }

    return updates;
  }

  postUpdate(updates) {
    const state = this.state;

    if (updates.repos || updates.filters) {
      const { repos, filters } = state;

      repos.used = filter(repos.fetched, filters);
    }

    if (updates.repos || updates.filters || updates.sort) {
      sort(state.repos.used, state.sort);
    }
  }

  async present(data, render = this.render) {
    if (process.env.NODE_ENV === 'development') {
      console.log('%cPRESENT', 'color: green;', data);
    }

    if (!data) return;

    const updates = this.saveData(data);
    this.postUpdate(updates);

    // TODO: Remove in case of pure usage of present method
    // if (data.init) {
    //   state = data.init;
    //   updates.init = true;
    // }

    if (process.env.NODE_ENV === 'development') {
      console.log('%cMODEL', 'color: green;', this);
    }

    render(this.state, this.present);
  }
}
