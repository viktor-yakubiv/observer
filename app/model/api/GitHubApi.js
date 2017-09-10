import Api from './Api';


// const OWNER_USER = 'User';
const OWNER_ORG = 'Organization';


export default class GitHubApi extends Api {
  static postProcessRepo(repo) {
    Object.assign({}, repo, {
      createdAt: new Date(repo.createdAt),
      updatedAt: new Date(repo.updatedAt),
    });
  }


  fetchOwner(login) {
    return Promise.all([
      this.raw(`users/${login}`),
      this.raw(`orgs/${login}`),
    ]).then(([user, org]) => {
      if (!user.ok && !org.ok) throw new Error('Does not exists');

      return Api.processResponse(user.ok ? user : org);
    });
  }

  fetchRepos(ownerLogin, { type, page }) {
    const scope = type === OWNER_ORG ? 'orgs' : 'users';
    const url = `${scope}/${ownerLogin}/repos`;

    return this.get(url, { page }).then(repos =>
      Promise.resolve(repos.map(GitHubApi.postProcessRepo)));
  }

  fetchRepoDetails(ownerLogin, repoName) {
    const baseUrl = `repos/${ownerLogin}/${repoName}`;

    return Promise.all([
      this.get(baseUrl),
      this.get(`${baseUrl}/contributors`),
      this.get(`${baseUrl}/languages`),
      this.get(`${baseUrl}/pulls`),
    ]).then(([repo, contributors, languages, pulls]) => (Promise.resolve(
      Object.assign(GitHubApi.postProcessRepo(repo), {
        contributors,
        languages,
        pulls,
      }))
    ));
  }
}
