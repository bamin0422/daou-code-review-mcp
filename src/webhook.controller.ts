import { Controller, Post, Headers, Body, HttpCode, Get } from '@nestjs/common';

interface BitbucketPullRequest {
  id?: number;
  title?: string;
}
interface BitbucketWebhookPayload {
  pullrequest?: BitbucketPullRequest;
}

@Controller()
export class WebhookController {
  @Get()
  root() {
    return { status: 'ok', message: 'Bitbucket Webhook Server is running.' };
  }
  @Get('webhook/bitbucket')
  getWebhookBitbucket() {
    return {
      status: 'ok',
      message: 'Bitbucket Webhook endpoint (GET) is alive.',
    };
  }

  @Post('webhook/bitbucket')
  @HttpCode(200)
  handleBitbucketWebhook(
    @Headers('x-event-key') eventKey: string,
    @Body() payload: BitbucketWebhookPayload,
  ) {
    if (eventKey === 'pullrequest:created') {
      const pr = payload.pullrequest;
      const prId = pr?.id ?? '알수없음';
      const prTitle = pr?.title ?? '제목없음';
      console.log('새 PR 생성 감지:', prId, prTitle);
      // 여기에 원하는 추가 동작 구현 가능
    }
    return { status: 'received' };
  }
}
