export class Environment {
    static readonly port: string = '7248';
    static readonly apiEndpoint: string = 'https://localhost';
    static readonly baseUrl: string = this.apiEndpoint + ':' + this.port;
  }