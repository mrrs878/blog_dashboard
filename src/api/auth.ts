/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-07 13:07:22
 * @LastEditTime: 2021-09-14 21:45:58
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\api\auth.ts
 */
import ajax from '../tool/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/auth`;

export const GET_PUZZLE_IMG = (): Promise<IGetPuzzleImgRes> => ajax.get(`${BASE_URL}/puzzleImg`);
export const CHECK_PUZZLE = (data: ICheckPuzzleReq): Promise<ICheckPuzzleRes> => ajax.get(`${BASE_URL}/verifyPuzzle/${data.session}/${data.left}`);
export const GET_PERMISSION_URLS = (): Promise<IGetPermissionUrlsRes> => ajax.get(`${BASE_URL}/permissionUrl`);
export const LOGIN = (data: ILoginReq): Promise<ILoginRes> => ajax.post(`${BASE_URL}/login`, data);
export const AUTO_LOGIN = (): Promise<ILoginRes> => ajax.get(`${BASE_URL}/autoLogin`);
