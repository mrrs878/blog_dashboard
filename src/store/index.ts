/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-23 18:24:16
 * @LastEditTime: 2021-03-26 13:05:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/store/index.ts
 */
import { createContext, useCallback, useContext } from 'react';

enum Actions {
  UPDATE_MODEL,
  UPDATE_USER,
  UPDATE_ADDRESSES,
  UPDATE_FULLSCREEN,
  UPDATE_MENU,
  UPDATE_MENU_ROUTES,
  UPDATE_MENU_TITLES,
  UPDATE_DICTS,
  UPDATE_BASE_DICTS,
  UPDATE_ARTICLES,
}

type UpdateModel<T extends keyof IState> =
IActions<Actions.UPDATE_MODEL, { modelName: T, modelValue: IState[T] }>;
type UpdateUser = IActions<Actions.UPDATE_USER, IUser>;
type UpdateAddresses = IActions<Actions.UPDATE_ADDRESSES, Array<string>>;
type UpdateFullScreen = IActions<Actions.UPDATE_FULLSCREEN, boolean>;
type UpdateMenu = IActions<Actions.UPDATE_MENU, Array<IMenuItem>>;
type UpdateMenuRoutes = IActions<Actions.UPDATE_MENU_ROUTES, Record<string, string>>;
type UpdateMenuTitles = IActions<Actions.UPDATE_MENU_TITLES, Record<string, string>>;

type Action = UpdateModel<keyof IState>|UpdateUser|UpdateAddresses|UpdateFullScreen|UpdateMenu|
UpdateMenuRoutes|UpdateMenuTitles;

const defaultState: IState = {
  user: {} as any,
  addresses: [],
  fullScreen: false,
  menu: [],
  menuTree: [],
  menuRoutes: {},
  menuTitles: {},
  dicts: [],
  baseDicts: [],
  articles: [],
};

const StoreContext = createContext<{ state: IState, dispatch: React.Dispatch<Action> }>(
  {
    state: defaultState,
    dispatch: () => null,
  },
);

function useModel<T extends keyof IState>(modelName: T)
  : [IState[T], (newModel: IState[T]) => void] {
  const { state, dispatch } = useContext(StoreContext);
  const updateFunction = useCallback((modelValue: IState[T]) => dispatch(
    { type: Actions.UPDATE_MODEL, data: { modelName, modelValue } },
  ), [dispatch, modelName]);
  return [
    state[modelName],
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
    default:
      return state;
  }
}

export {
  reducer, StoreContext, defaultState, useFullScreen, useModel,
};
