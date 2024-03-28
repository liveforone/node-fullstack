import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReplyService } from '../service/reply.service';
import { ReplyUrl } from './constant/reply-url.constant';
import { CreateReplyDto } from '../dto/request/create-reply.dto';
import { ReplyResponse } from './response/reply.response';
import { UpdateReplydto } from '../dto/request/update-reply.dto';
import { ReplyControllerConstant } from './constant/reply-controller.constant';
import { RemoveReplyDto } from '../dto/request/remove-reply.dto';
import { DEFAULT_LAST_ID, LAST_ID } from 'prisma-no-offset';

@Controller(ReplyUrl.ROOT)
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Get(ReplyUrl.DETAIL)
  async getReplydetailInfo(@Param(ReplyControllerConstant.ID) id: bigint) {
    return await this.replyService.getOneById(id);
  }

  @Get(ReplyUrl.BELONG_POST)
  async getRepliesBelongPostPage(
    @Param(ReplyControllerConstant.POST_ID) postId: bigint,
    @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID,
  ) {
    return await this.replyService.getReplyPageByPostId(postId, lastId);
  }

  @Post()
  async createReply(@Body() createReplyDto: CreateReplyDto) {
    await this.replyService.createReply(createReplyDto);
    return ReplyResponse.CREATE_REPLY_SUCCESS;
  }

  @Patch(ReplyUrl.UPDATE)
  async updateReply(
    @Body() updateReplyDto: UpdateReplydto,
    @Param(ReplyControllerConstant.ID) id: bigint,
  ) {
    await this.replyService.updateReply(updateReplyDto, id);
    return ReplyResponse.UPDATE_REPLY_SUCCESS;
  }

  @Delete(ReplyUrl.REMOVE)
  async removeReply(
    @Body() removeReplyDto: RemoveReplyDto,
    @Param(ReplyControllerConstant.ID) id: bigint,
  ) {
    await this.replyService.removeReply(removeReplyDto, id);
    return ReplyResponse.REMOVE_REPLY_SUCCESS;
  }
}
