/*
 * @Author: your name
 * @Date: 2020-7-1 13:16:42
 * @LastEditTime: 2021-02-03 16:23:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /my-app/src/tools/Chain.ts
 */

const NEXT_SUCCESSOR = 'nextSuccessor';

class Chain {
  private fn: Function;

  private successor: Chain | null;

  constructor(fn: Function) {
    this.fn = fn;
    this.successor = null;
  }

  setNextSuccessor(successor: Chain) {
    this.successor = successor;
  }

  passRequest(...argument: Array<any>): any {
    const res = this.fn.call(this, ...argument);
    if (res === NEXT_SUCCESSOR) {
      return this.successor?.passRequest(...argument);
    }
    return res;
  }
}

export { NEXT_SUCCESSOR };
export default Chain;
