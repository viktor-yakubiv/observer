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
  static filter(repos, { type, lang, stars }) {
    return repos.filter((repo) => {
      const typeMatch = type === REPO_ANY ||
        (type === REPO_FORK && repo.fork) ||
        (type === REPO_SOURCE && !repo.fork);

      return typeMatch &&
        repo.startgazes_count >= stars &&
        (!lang || repo.language === lang);
    });
  }

  static sort(repos, prop, dir = 1) {
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
      repos: null,
      dialog: null,

      filters: {
        type: REPO_ANY,
        lang: null,
        stars: 0,
      },

      sort: null,
    };

    this.updates = {};

    this.present = this.present.bind(this);
  }

  present(data, render = this.render) {
    if (!data) return;

    if (data.owner || data.repos) {
      this.data.owner = data.owner || this.data.owner;
      this.updates.owner = true;

      this.data.repos = data.repos || null;
      this.updates.repos = true;
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

    if (this.updates.repos || this.updates.filters) {
      Model.filter(this.data.repos, this.data.filters);
    }

    if (this.updates.repos || this.updates.sort) {
      Model.sort(this.data.repos, this.data.sort);
    }

    render(this);
  }
}
