import { createContext, useContext } from 'react';
import userStore from './UserStore';
import appStore from './AppStore';
import { observer } from 'mobx-react-lite';

const store = {
  userStore,
  appStore
};

const StoreContext = createContext(store);


export const StoreProvider = observer(({ children }) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
});

export const useStore = () => useContext(StoreContext);
export default store;