import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030c18] text-slate-100 flex items-center justify-center p-6 dir-rtl font-sans">
          <div className="max-w-md w-full bg-[#081b33] border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-5 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">خطای غیرمنتظره رخ داده است</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                سامانه هوشمند آپتوس ایران با مشکلی مواجه شده است. با کلیک روی دکمه زیر می‌توانید مجدداً تلاش کنید.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-[11px] font-mono text-amber-300 text-left dir-ltr overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f05a24] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d97706] text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>تلاش مجدد و بارگذاری سیستم</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
