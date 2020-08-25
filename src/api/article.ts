import ajax from '../tools/ajax';

console.log(process.env.REACT_APP_BASE_URL);

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_BASE_URL || ''}/article`;

export const GET_ARTICLES = (): Promise<GetArticlesResI> => ajax.get(`${BASE_URL}/all`);
