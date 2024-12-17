export class Environment {
    static readonly port: string = '7172';
    static readonly apiEndpoint: string = 'https://localhost';
    static readonly baseUrl: string = this.apiEndpoint + ':' + this.port;
  }