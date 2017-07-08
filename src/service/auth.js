
import fetch from './fetch';

export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    fetch.post('auth/login', {username, password})
      .then(res => {
        if( res.success === false ){
          reject(res.message);
        } else {
          session.set(res);
          resolve(res);
        }
    }, err => reject(err));
  });
};

export const session = {
  sessionInfo: {
    name: "系统管理员",
    username: "admin",
    id: "59280dd72001a64700fee81d",
    role: 2
  },
  set(info){
    this.sessionInfo = info;
  },
  get(){
    return this.sessionInfo;
  },
  clear(){
    this.sessionInfo = null;
  }
};