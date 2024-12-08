import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIProvider {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('The OPENAI_API_KEY environment variable is missing ');
    }

    this.openai = new OpenAI({
      baseURL: 'https://api.deepinfra.com/v1/openai',
      apiKey,
    });
  }

  getInstance(): OpenAI {
    return this.openai;
  }
}
