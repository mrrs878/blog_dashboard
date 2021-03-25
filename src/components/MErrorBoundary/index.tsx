/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:52:22
 * @LastEditTime: 2021-02-26 18:57:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/components/MErrorBoundary/index.tsx
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';

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
      return <h1>Sorry.. there was an error</h1>;
    }
    return this.props.children;
  }
}

export default MErrorBoundary;
