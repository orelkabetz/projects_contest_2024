import {makeAutoObservable} from "mobx"

class AppStorage {
  isLoading = false;
  constructor() {
    makeAutoObservable(this)
  }
}

const appStorage = new AppStorage()
export default appStorage