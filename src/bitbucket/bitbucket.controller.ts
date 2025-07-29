import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { BitbucketService } from './bitbucket.service';
import { AddPrCommentDto } from './dto/add-pr-comment.dto';

@Controller('bitbucket')
export class BitbucketController {
  constructor(private readonly bitbucketService: BitbucketService) {}

  @Get('workspaces')
  async listWorkspaces(): Promise<unknown> {
    return await this.bitbucketService.listWorkspaces();
  }

  @Get('repos')
  async listRepos(@Query('workspace') workspace: string): Promise<unknown> {
    return await this.bitbucketService.listRepos(workspace);
  }

  @Get('prs')
  async listPrs(
    @Query('workspace') workspace: string,
    @Query('repo') repo: string,
  ): Promise<unknown> {
    return await this.bitbucketService.listPrs(workspace, repo);
  }

  @Post('pr/comment')
  async addPrComment(@Body() dto: AddPrCommentDto): Promise<unknown> {
    return await this.bitbucketService.addPrComment(dto);
  }
}
