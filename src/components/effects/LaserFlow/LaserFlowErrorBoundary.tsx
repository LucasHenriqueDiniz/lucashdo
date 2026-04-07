'use client';

import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';

type LaserFlowErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type LaserFlowErrorBoundaryState = {
  hasError: boolean;
};

export class LaserFlowErrorBoundary extends Component<
  LaserFlowErrorBoundaryProps,
  LaserFlowErrorBoundaryState
> {
  public override state: LaserFlowErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  public override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('LaserFlow rendering error:', error);
    this.props.onError?.(error, info);
  }

  public override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
