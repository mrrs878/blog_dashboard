import ajax from '../tools/ajax';

const BASE_URL = 'https://gitee.com/api/v5/repos/mrrs878/blog';

export const GET_PATH_CONTENT = (): Promise<GetRepoPathContentResI> => ajax.get(`${BASE_URL}/contents/src/assets/markdown/articles`);
export const GET_FILE_BLOB = (param: GetFileBlogReqI): Promise<GetFileBlogResI> => ajax.get(`${BASE_URL}/git/blobs/${param.sha}`);
