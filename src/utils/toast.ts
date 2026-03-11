// Simple toast utility - no React hooks, no context, no useEffect
// This approach works like login/signup - direct DOM manipulation

export interface ToastOptions {
  type: 'success' | 'error';
  message: string;
  duration?: number;
}

class SimpleToast {
  private container: HTMLDivElement | null = null;
  private toastCount = 0;

  private createContainer() {
    if (this.container) return this.container;
    
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
    return this.container;
  }

  show(options: ToastOptions) {
    const container = this.createContainer();
    const toastId = ++this.toastCount;
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      background-color: ${options.type === 'success' ? '#0d1f17' : '#1f0d0d'};
      border: 1px solid ${options.type === 'success' ? '#10b981' : '#ef4444'};
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 320px;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
      pointer-events: auto;
      transform: translateX(-400px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Icon
    const icon = document.createElement('div');
    icon.style.cssText = `
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    `;
    icon.innerHTML = options.type === 'success' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="9,11 12,14 22,4"></polyline></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

    // Message
    const message = document.createElement('div');
    message.style.cssText = `
      flex: 1;
      color: white;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    `;
    message.textContent = options.message;

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
      background: transparent;
      border: none;
      color: #a0a0b8;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    `;
    closeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    
    closeBtn.onmouseenter = () => closeBtn.style.color = 'white';
    closeBtn.onmouseleave = () => closeBtn.style.color = '#a0a0b8';

    const removeToast = () => {
      toast.style.transform = 'translateX(-400px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        // Clean up container if empty
        if (container && container.children.length === 0) {
          document.body.removeChild(container);
          this.container = null;
        }
      }, 300);
    };

    closeBtn.onclick = removeToast;

    toast.appendChild(icon);
    toast.appendChild(message);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);

    // Auto remove
    const duration = options.duration || 4000;
    setTimeout(removeToast, duration);
  }

  success(message: string, duration?: number) {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration?: number) {
    this.show({ type: 'error', message, duration });
  }
}

// Export singleton instance
export const toast = new SimpleToast();