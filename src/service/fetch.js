import Toast from 'react-native-root-toast';

export const serverUrl = "http://fpserver.qtdatas.com/";

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
      url += ("?" + params.body + "&_=" + Math.random()*1e20 + Date.now());
      delete params.body;
    }
    return fetch(serverUrl + "api/" + url, params)
      .then(res => {
        if( res === "error" ){
          throw 'server error';
        } else {
          return res.json();
        }
      })
      .then(data => {
        //console.log(data)
        resolve(data);
      })
      .catch(err => {
        Toast.show("与服务器连接失败", {duration: Toast.durations.LONG});
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
