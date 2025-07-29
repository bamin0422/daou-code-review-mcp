import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface BitbucketUser {
  display_name?: string;
  nickname?: string;
}

interface BitbucketLinks {
  html?: { href: string };
}

interface BitbucketPullRequest {
  id: number;
  title: string;
  description?: string;
  author?: BitbucketUser;
  links?: BitbucketLinks;
}

interface BitbucketRepository {
  full_name: string;
}

interface BitbucketWebhookPayload {
  pullrequest?: BitbucketPullRequest;
  repository?: BitbucketRepository;
}

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  async createReviewForPR(payload: BitbucketWebhookPayload) {
    const pr = payload.pullrequest;
    const repo = payload.repository;
    if (!pr || !repo) {
      this.logger.error('PR 또는 Repository 정보가 없습니다.');
      return;
    }
    const prId = pr.id;
    const repoFullName = repo.full_name;
    const prAuthor =
      pr.author?.display_name || pr.author?.nickname || 'unknown';
    const prTitle = pr.title;
    const prDescription = pr.description;
    const prLink = pr.links?.html?.href;

    this.logger.log(
      `PR #${prId} in repo ${repoFullName}에 대한 코드 리뷰 생성 시도`,
    );

    // Bitbucket API를 통해 PR에 코멘트(리뷰) 생성
    // 실제 사용시에는 OAuth 토큰 등 인증 필요
    const BITBUCKET_USERNAME = process.env.BITBUCKET_USERNAME;
    const BITBUCKET_APP_PASSWORD = process.env.BITBUCKET_APP_PASSWORD;
    if (!BITBUCKET_USERNAME || !BITBUCKET_APP_PASSWORD) {
      this.logger.error('Bitbucket 인증 정보가 없습니다.');
      return;
    }

    const comment = `자동 코드 리뷰\n\n- PR 제목: ${prTitle}\n- 작성자: ${prAuthor}\n- 설명: ${prDescription || '없음'}\n- [PR 바로가기](${prLink})`;

    const url = `https://api.bitbucket.org/2.0/repositories/${repoFullName}/pullrequests/${prId}/comments`;
    try {
      const response = await axios.post(
        url,
        { content: { raw: comment } },
        {
          auth: {
            username: BITBUCKET_USERNAME,
            password: BITBUCKET_APP_PASSWORD,
          },
        },
      );
      this.logger.log(
        `코드 리뷰(코멘트) 생성 성공: ${JSON.stringify(response.data)}`,
      );
    } catch (error: unknown) {
      let errorMsg = '';
      if (typeof error === 'object' && error !== null) {
        const err = error as { response?: { data?: any }; message?: string };
        if (err.response && err.response.data) {
          errorMsg = JSON.stringify(err.response.data);
        } else if (err.message) {
          errorMsg = err.message;
        } else {
          errorMsg = JSON.stringify(err);
        }
      } else {
        errorMsg = String(error);
      }
      this.logger.error(`코드 리뷰(코멘트) 생성 실패: ${errorMsg}`);
    }
  }
}
