
export const serverUrl = "http://139.224.2.4:9000/";

function formatParam(params){
  let ret = [];
  for(let i in params){
    if( Array.isArray(params[i]) ){
      params[i].forEach(item => {
        ret.push(i + "=" + item)
      });
    } else {
      ret.push(i + "=" + params[i]);
    }
  }
  return ret.join("&");
}

let fetchApi = (url, params) => {
  return new Promise((resolve, reject) => {
    if(typeof params.body === 'object'){
      if( params.method === 'GET' ) {
        params.body = formatParam(params.body);
      } else {
        params.body = JSON.stringify(params.body);
      }
    }
    params.headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    if( params.method === 'GET' ){
      url += ("?" + params.body + "&r=" + Math.random()*1e20 + Date.now());
      delete params.body;
    }
    return fetch(serverUrl + "api/" + url, params)
      .then(res => {
        if( res === "false" || res === false || res === "error" ){
          throw 'server error';
        } else {
          return res.json();
        }
      })
      .then(data => {
        console.log(data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

fetchApi.post = (url, params = {}) => {
  return fetchApi(url, Object.assign({body: params}, {method: 'POST'}));
};

fetchApi.get = (url, params = {}) => {
  return fetchApi(url, Object.assign({body: params}, {method: 'GET'}));
};

export default fetchApi;
