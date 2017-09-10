import camelize from 'camelize';

export default class Api {
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

  raw(resource, params, rootUrl = this.rootUrl) {
    return fetch(Api.prepareUrl(resource, params, rootUrl));
  }

  get(resource, params, rootUrl = this.rootUrl) {
    return this.raw(resource, params, rootUrl)
      .then(Api.processResponse);
  }
}
