import React, { Component } from 'react';
import { page_process } from '$Src/Library/Background';

class TabListener extends Component {
  componentDidMount() {
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
      registration.addEventListener('activate', this.handleActivated);
      registration.addEventListener('fetch', this.handleUpdated);
    }).catch((err) => {
      console.error('Service worker registration failed:', err);
    });
  }

  componentWillUnmount() {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration.removeEventListener('activate', this.handleActivated);
        registration.removeEventListener('fetch', this.handleUpdated);
      }
    });
  }

  handleActivated = (event) => {
    // handle 'activate' event
  }

  handleUpdated = (event) => {
    if (event.request.method === 'GET' && event.request.cache === 'default') {
      page_process();
    }
  }

  render() {
    return null;
  }
}

export default TabListener;
