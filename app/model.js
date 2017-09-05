import {
  REPO_ANY,
  REPO_FORK,
  REPO_SOURCE,

  PROP_ISSUES,
  PROP_STARS,
  PROP_NAME,
  PROP_UPDATED,
} from './config';


export default class Model {
  static filter(repos, filters) {
    if (!repos) return repos;

    const updatedAfter = new Date(filters.updatedAfter).getTime();

    return repos.filter((repo) => {
      const mathings = {
        type:
          (filters.type === REPO_ANY) ||
          (filters.type === REPO_FORK && repo.fork) ||
          (filters.type === REPO_SOURCE && !repo.fork),
        starCount:
          repo.stargazersCount >= filters.starredGt,
        updatedAfter:
          repo.updatedAt.getTime() >= updatedAfter,
        language:
          (!filters.language || repo.language === filters.language),
        issueCount:
          (repo.openIssuesCount > 0) === filters.hasOpenIssues,
      };

      return Object.values(mathings).reduce((res, val) => (res && val));
    });
  }

  static sort(repos, prop, dir = 1) {
    if (!repos) return;

    const compareMap = {};

    compareMap[PROP_UPDATED] = (a, b) =>
      (dir * (a[prop].getTime() - b[prop].getTime()));

    compareMap[PROP_STARS] = (a, b) => (dir * (a[prop] - b[prop]));
    compareMap[PROP_ISSUES] = compareMap[PROP_STARS];

    compareMap[PROP_NAME] = (a, b) => (dir * (a[prop].localeCompare(b[prop])));

    if (prop in compareMap) repos.sort(compareMap[prop]);
  }

  constructor(render) {
    this.render = render;

    this.data = {
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

    this.updates = { init: true };

    this.present = this.present.bind(this);
  }

  async present(data, render = this.render) {
    if (process.env.NODE_ENV === 'development') {
      console.log('%cPRESENT', 'color: green;', data);
    }

    this.updates = {};

    if (!data) return;

    if (data.owner) {
      this.data.owner = data.owner || this.data.owner;
      this.updates.owner = true;

      this.data.repos = {
        fetched: [],
        next: null,

        used: [],
      };
      this.updates.repos = true;
    }

    if (data.repos) {
      this.data.repos.fetched = this.data.repos.fetched
        .concat(data.repos.map(repo => Object.assign(repo, {
          updatedAt: new Date(repo.updatedAt),
          createdAt: new Date(repo.createdAt),
        })));
      this.data.repos.next = data.next || null;
      this.updates.repos = true;
    }

    if (data.repo && this.data.repos.fetched) {
      const repo = this.data.repos.fetched
        .find(({ fullName }) => (data.repo.fullName === fullName));

      if (process.env.DEBUG) {
        console.log('%cREPO', 'color: brown;', repo);
      }

      if (repo) {
        Object.assign(repo, data.repo);

        repo.updatedAt = new Date(repo.updatedAt);
        repo.createdAt = new Date(repo.createdAt);

        this.data.dialog = repo;
        this.updates.dialog = true;
      }
    }

    if (data.filters) {
      const filters = this.data.filters;

      Object.keys(data.filters).forEach((name) => {
        if (Object.prototype.hasOwnProperty.call(filters, name)) {
          filters[name] = data.filters[name];
          this.updates.filters = true;
        }
      });
    }

    if (data.sort) {
      this.data.sort = data.sort;
      this.updates.sort = true;
    }

    // TODO: Remove in case of pure usage of present method
    if (data.init) {
      this.data = data.init;
      this.updates.init = true;
    }

    if (this.updates.repos || this.updates.filters) {
      const { repos, filters } = this.data;

      repos.used = Model.filter(repos.fetched, filters);
    }

    if (this.updates.repos || this.updates.filters || this.updates.sort) {
      Model.sort(this.data.repos.used, this.data.sort);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('%cMODEL', 'color: green;', this);
    }

    render(this);
  }
}
