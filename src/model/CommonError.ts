/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-03-03 23:31:24
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\model\CommonError.ts
 */
class CommonError implements CommonErrorI {
  message: string;

  name: string;

  stack: string;

  date: number;

  constructor(message: string, name: string, stack: string, date: number) {
    this.message = message;
    this.name = name;
    this.stack = stack;
    this.date = date;
  }
}

export default CommonError;
