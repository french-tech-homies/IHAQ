declare global {
  interface Window {
    APP_CONFIG: { REACT_APP_API_SVC: string };
  }
}

class ConfigService {
  get API_URL() {
    return window.APP_CONFIG.REACT_APP_API_SVC;
  }
}

export const configService = new ConfigService();
