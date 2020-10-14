interface CommonStateI {
  count: number,
  user: UserI,
  menu: Array<MenuItemI>;
  menuArray: Array<MenuItemI>;
  menuRoutes: MenuRoutesI;
  dicts: Array<DictI>;
  baseDicts: Array<DictI>;
  menuTitles: MenuTitlesI;
  fullScreen: boolean;
  articles: Array<ArticleI>;
}
