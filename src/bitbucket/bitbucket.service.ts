import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AddPrCommentDto } from './dto/add-pr-comment.dto';

@Injectable()
export class BitbucketService {
  private readonly apiBase = 'https://api.bitbucket.org/2.0';

  private getAuth() {
    const username = process.env.ATLASSIAN_BITBUCKET_USERNAME;
    const password = process.env.ATLASSIAN_BITBUCKET_APP_PASSWORD;
    if (!username || !password) {
      throw new Error('Bitbucket 인증 정보가 없습니다. 환경변수를 확인하세요.');
    }
    return { username, password };
  }

  async listWorkspaces(): Promise<unknown> {
    const res = await axios.get(`${this.apiBase}/workspaces`, {
      auth: this.getAuth(),
    });
    return res.data;
  }

  async listRepos(workspace: string): Promise<unknown> {
    const res = await axios.get(`${this.apiBase}/repositories/${workspace}`, {
      auth: this.getAuth(),
    });
    return res.data;
  }

  async listPrs(workspace: string, repo: string): Promise<unknown> {
    const res = await axios.get(
      `${this.apiBase}/repositories/${workspace}/${repo}/pullrequests`,
      {
        auth: this.getAuth(),
      },
    );
    return res.data;
  }

  async addPrComment(dto: AddPrCommentDto): Promise<unknown> {
    const { workspace, repo, prId, content } = dto;
    const res = await axios.post(
      `${this.apiBase}/repositories/${workspace}/${repo}/pullrequests/${prId}/comments`,
      { content: { raw: content } },
      { auth: this.getAuth() },
    );
    return res.data;
  }
}
