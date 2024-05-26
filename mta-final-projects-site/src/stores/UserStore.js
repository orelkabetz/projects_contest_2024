import {makeAutoObservable, makeObservable, observable} from "mobx"

import appStore from "./AppStore";

class UserStore {
  /**
  * @param user has "type" and "name" in it  
  */
  user = null
  constructor() {
    makeObservable(this)
  }

  async getDataFromToken(token) {
    const res = await fetch('http://localhost:3001/check-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    const resData = await res.json()
    if (!resData.success) return;
    this.user = resData.user;
    return true
  }

  logout() {
    localStorage.removeItem("token");
    this.user = null;
  }
}

const userStore = new UserStore()
export default userStore