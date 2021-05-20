/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-23 18:24:16
 * @LastEditTime: 2021-05-20 14:15:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/store/index.ts
 */
import {
  createContext, useCallback, useContext, useRef,
} from 'react';

enum Actions {
  UPDATE_MODEL,
  UPDATE_USER,
  UPDATE_ADDRESSES,
  UPDATE_FULLSCREEN,
  UPDATE_MENU,
  UPDATE_MENU_ARRAY,
  UPDATE_MENU_ROUTES,
  UPDATE_MENU_TITLES,
  UPDATE_PERMISSION_URLS,
  UPDATE_TAGS,
  UPDATE_ARTICLES,
}

type UpdateModel<T extends keyof IState> =
IActions<Actions.UPDATE_MODEL, { modelName: T, modelValue: IState[T] }>;
type UpdateUser = IActions<Actions.UPDATE_USER, IUser>;
type UpdateAddresses = IActions<Actions.UPDATE_ADDRESSES, Array<string>>;
type UpdateFullScreen = IActions<Actions.UPDATE_FULLSCREEN, boolean>;
type UpdateMenu = IActions<Actions.UPDATE_MENU, Array<IMenuItem>>;
type UpdateMenuArray = IActions<Actions.UPDATE_MENU_ARRAY, Array<IMenuItem>>;
type UpdateMenuRoutes = IActions<Actions.UPDATE_MENU_ROUTES, Record<string, string>>;
type UpdateMenuTitles = IActions<Actions.UPDATE_MENU_TITLES, Record<string, string>>;
type UpdatePermissionUrls = IActions<Actions.UPDATE_PERMISSION_URLS, Array<IPermissionUrl>>;
type UpdateTags = IActions<Actions.UPDATE_TAGS, Array<ITag>>;

type Action = UpdateModel<keyof IState>|UpdateUser|UpdateAddresses|UpdateFullScreen|UpdateMenu|
UpdateMenuArray|UpdateMenuRoutes|UpdateMenuTitles|UpdatePermissionUrls|UpdateTags;

const defaultState: IState = {
  user: {
    name: '', age: -1, address: '', id: -1, role: -1,
  },
  addresses: [],
  fullScreen: false,
  menu: [],
  menuArray: [],
  menuRoutes: {},
  menuTitles: {},
  permissionUrls: [],
  tags: [],
  articles: [],
};

const StoreContext = createContext<{ state: IState, dispatch: React.Dispatch<Action> }>(
  {
    state: defaultState,
    dispatch: () => null,
  },
);

type g<T extends keyof IState> = (value: IState[T]) => IState[T];

function useModel<T extends keyof IState>(modelName: T)
  : [IState[T], (newModel: IState[T]|g<T>) => void] {
  const { state, dispatch } = useContext(StoreContext);
  const stateRef = useRef<IState>(state);
  stateRef.current = state;
  const updateFunction = useCallback((modelValue: IState[T]|g<T>) => dispatch(
    {
      type: Actions.UPDATE_MODEL,
      data: {
        modelName,
        modelValue: typeof modelValue === 'function' ? modelValue(stateRef.current[modelName]) : modelValue,
      },
    },
  ), [dispatch, modelName]);
  return [
    stateRef.current[modelName],
    updateFunction,
  ];
}

function useFullScreen(): [boolean, () => void, () => void] {
  const { state, dispatch } = useContext(StoreContext);
  const fullScreen = useCallback(() => dispatch(
    { type: Actions.UPDATE_FULLSCREEN, data: true },
  ), [dispatch]);
  const exitFullScreen = useCallback(() => dispatch(
    { type: Actions.UPDATE_FULLSCREEN, data: false },
  ),
  [dispatch]);
  return [
    state.fullScreen,
    fullScreen,
    exitFullScreen,
  ];
}

function useUser(): [IUser, (newModel: IUser|g<'user'>) => void, () => void] {
  const { state, dispatch } = useContext(StoreContext);
  const stateRef = useRef<IState>(state);
  stateRef.current = state;
  const login = useCallback((modelValue: IUser|g<'user'>) => dispatch(
    {
      type: Actions.UPDATE_USER,
      data: typeof modelValue === 'function' ? modelValue(stateRef.current.user) : modelValue,
    },
  ), [dispatch]);
  const logout = useCallback(() => dispatch(
    {
      type: Actions.UPDATE_USER,
      data: {
        name: '', age: -1, address: '', id: -1, role: -1,
      },
    },
  ), [dispatch]);
  return [
    stateRef.current.user,
    login,
    logout,
  ];
}

// type Equals<X, Y> =
//     (<T>() => T extends X ? 1 : 2) extends
//     (<T>() => T extends Y ? 1 : 2) ? true : false;

function reducer(state: IState, action: Action): IState {
  switch (action.type) {
    case Actions.UPDATE_MODEL: {
      return { ...state, [action.data.modelName]: action.data.modelValue };
    }
    case Actions.UPDATE_USER:
      return { ...state, user: action.data };
    case Actions.UPDATE_ADDRESSES:
      return { ...state, addresses: action.data };
    case Actions.UPDATE_FULLSCREEN:
      return { ...state, fullScreen: action.data };
    case Actions.UPDATE_PERMISSION_URLS:
      return { ...state, permissionUrls: action.data };
    default:
      return state;
  }
}

export {
  reducer, StoreContext, defaultState, useFullScreen, useModel, useUser,
};
