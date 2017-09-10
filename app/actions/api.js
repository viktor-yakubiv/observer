import camelize from 'camelize';
import { API_URL } from '../config';

export default class GitHubApi {
  static prepareUrl(resource, params, rootUrl) {
    let url = rootUrl ? `${rootUrl}/${resource}` : resource;

    if (params) {
      url += Object.keys(params)
        .map((key) => {
          const keyEncoded = encodeURIComponent(key);
          const valEncoded = encodeURIComponent(params[key]);

          return `${keyEncoded}=${valEncoded}`;
        })
        .join('&');
    }

    return url;
  }

  static processResponse(response) {
    return response.json()
      .then(object => Promise.resolve(camelize(object)));
  }


  constructor(rootUrl) {
    this.rootUrl = rootUrl;
  }

  call(resource, params, rootUrl = this.rootUrl) {
    return fetch(GitHubApi.prepareUrl(resource, params, rootUrl));
  }
}
