import ajax from '../tools/ajax';

const BASE_URL = 'http://api.blog.mrrs.top/api';
// const BASE_URL = 'http://localhost:3000/api';

export const GET_PATH_CONTENT = (): Promise<GetRepoPathContentResI> => ajax.get(`${BASE_URL}/contents/src/assets/markdown/articles`);
export const GET_ALL_ARTICLES = (): Promise<GetArticlesResI> => ajax.get(`${BASE_URL}/article/all`);
export const GET_ARTICLE = (param: GetArticleReqT): Promise<GetArticleResI> => ajax.get(`${BASE_URL}/article/${param.id}`);
export const GET_FILE_BLOB = (param: GetFileBlogReqI): Promise<GetFileBlogResI> => ajax.get(`${BASE_URL}/git/blobs/${param.sha}`);
export const UPDATE_ARTICLE = (data: UpdateArticleReqI): Promise<GetFileBlogResI> => ajax.put(`${BASE_URL}/article/${data._id}`, data);
