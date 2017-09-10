import {
  REPO_ANY,
  REPO_FORK,
  REPO_SOURCE,

  PROP_ISSUES,
  PROP_STARS,
  PROP_NAME,
  PROP_UPDATED,
} from '../config';


export function filter(repos, filters) {
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

    return Object.values(mathings).reduce((res, val) => (res && val), true);
  });
}

export function sort(repos, prop, dir = 1) {
  if (!repos) return;

  const compareMap = {};

  compareMap[PROP_UPDATED] = (a, b) =>
    (dir * (a[prop].getTime() - b[prop].getTime()));

  compareMap[PROP_STARS] = (a, b) => (dir * (a[prop] - b[prop]));
  compareMap[PROP_ISSUES] = compareMap[PROP_STARS];

  compareMap[PROP_NAME] = (a, b) => (dir * (a[prop].localeCompare(b[prop])));

  if (prop in compareMap) repos.sort(compareMap[prop]);
}
