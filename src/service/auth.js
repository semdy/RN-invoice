
import fetch from './fetch';
import storage from '../service/storage';

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

export const logout = () => {
  return new Promise((resolve, reject) => {
      session.clear();
      resolve();
  });
};

export const session = {
  sessionInfo: null,
  set(info){
    this.sessionInfo = info;
    return storage.save({
      key: 'session',
      data: info,
      expires: 1000 * 3600 * 24
    });
  },
  get(){
    return this.sessionInfo;
  },
  load(){
    return new Promise((resolve, reject) => {
      storage.load({
        key: 'session'
      }).then(res => {
        this.sessionInfo = res;
        resolve(res);
      }).catch(err => {
        this.sessionInfo = null;
        reject(err);
      });
    });
  },
  clear(){
    this.sessionInfo = null;
    return storage.remove({
      key: 'session'
    });
  }
};