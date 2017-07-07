

let fetchApi = (url, params) => {
  return new Promise((resolve, reject) => {
    return fetch(url, params)
      .then(res => res.json())
      .then(jsonData => {
        resolve(jsonData);
      })
      .catch(err => {
        reject(err);
      });
  });
};

fetchApi.post = (url, params = {}) => {
  return fetchApi(url, Object.assign({body: params}, {method: 'post'}));
};

fetchApi.get = (url, params = {}) => {
  return fetchApi(url, Object.assign({body: params}, {method: 'get'}));
};

export default fetchApi;
