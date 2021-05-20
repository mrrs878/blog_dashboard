/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:52:22
 * @LastEditTime: 2021-02-26 18:57:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/components/MErrorBoundary/index.tsx
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import style from './index.module.less';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class MErrorBoundary extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={style.errorPage}>
          <div className={style.errorPageContainer}>
            <div className={style.errorPageMain}>
              <h3>
                <strong>哦豁</strong>
                出错了！
              </h3>
              <div className={style.errorPageActions}>
                <div>
                  <h4>可能原因：</h4>
                  <ul>
                    <li>服务器内部错误</li>
                    <li>资源加载错误</li>
                  </ul>
                </div>
                <div>
                  <h4>可以尝试：</h4>
                  <ul>
                    <li>联系管理员(mrrs878@foxmail.com)</li>
                    <li>返回上一页</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default MErrorBoundary;
