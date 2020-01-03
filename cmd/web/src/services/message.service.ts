import axios, { AxiosInstance } from 'axios';

const API_URL = 'http://localhost:8080';
export interface IMessage {
  id: string;
  author: string;
  message: string;
  likes: number;
}

export class MessageService {
  client: AxiosInstance;
  constructor() {
    this.client = axios.create({ baseURL: API_URL });
  }
  async getMessages() {
    const { data } = await this.client.get<IMessage[]>('/messages');
    return data;
  }

  async postMessage(message:IMessage) {
    const { data } = await this.client.post<IMessage>('/message', message);
    return data;
  }
}

export const messageService = new MessageService();
