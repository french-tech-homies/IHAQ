import axios, { AxiosInstance } from "axios";
import { configService } from "./config.service";

const API_URL = "http://" + configService.API_URL;

export interface IMessage {
  id: string;
  author: string;
  message: string;
  likes?: number;
  timestamp: number;
}

export class MessageService {
  client: AxiosInstance;
  constructor() {
    this.client = axios.create({ baseURL: API_URL });
  }
  async getMessages() {
    const { data } = await this.client.get<IMessage[]>("/messages");
    if (data) {
      return data;
    }
    return [];
  }

  async postMessage(message: IMessage) {
    const { data } = await this.client.post<IMessage>("/message", message);
    return data;
  }
}

export const messageService = new MessageService();
