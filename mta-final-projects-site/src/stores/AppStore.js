import {makeObservable} from "mobx"

class AppStore {
  isLoading = false;
  constructor() {
    makeObservable(this)
  }
}

const appStore = new AppStore()
export default appStore