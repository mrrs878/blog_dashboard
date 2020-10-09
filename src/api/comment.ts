import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_BASE_URL || '/';

export const GET_AUTHOR_COMMENTS = (): Promise<GetAuthCommentsResI> => ajax.get(`${BASE_URL}/comment/author`);
export const GET_ARTICLE_COMMENTS = (data: GetCommentsReqI): Promise<GetCommentsResI> => ajax.get(`${BASE_URL}/comment/article/${data.id}`);
export const GET_COMMENT = (data: GetCommentReqI): Promise<GetCommentResI> => ajax.get(`${BASE_URL}/comment/detail/${data.id}`);
export const ADD_COMMENT = (data: AddCommentReqI): Promise<AddCommentResI> => ajax.post(`${BASE_URL}/comment`, data);
