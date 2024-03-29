import { Injectable, Logger } from '@nestjs/common';
import { CreateReplyDto } from '../dto/request/create-reply.dto';
import { UpdateReplydto } from '../dto/request/update-reply.dto';
import { RemoveReplyDto } from '../dto/request/remove-reply.dto';
import { ReplyEntity } from '../entities/reply.entity';
import { ReplyServiceLog } from '../log/reply-service.log';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Reply } from '@prisma/client';
import { validateFoundData } from 'src/common/found-data.validator';
import { findLastIdOrDefault, ltLastIdCondition } from 'prisma-no-offset';
import { ReplyPage } from '../dto/response/reply-page.dto';
import { ReplyRepoConstant } from './constant/reply-query.constant';

@Injectable()
export class ReplyService {
  private readonly logger = new Logger(ReplyService.name);

  constructor(private prisma: PrismaService) {}

  async createReply(createReplyDto: CreateReplyDto) {
    const { writerId: writer_id, postId: post_id, content } = createReplyDto;
    const reply = ReplyEntity.create(writer_id, post_id, content);
    await this.prisma.reply.create({ data: reply });
    this.logger.log(ReplyServiceLog.CREATE_REPLY_SUCCESS + writer_id);
  }

  async updateReply(updateReplyDto: UpdateReplydto, id: bigint) {
    const { content, writerId: writer_id } = updateReplyDto;
    await this.prisma.reply.update({
      data: { content: content, reply_state: $Enums.ReplyState.EDITED },
      where: { id: id, writer_id: writer_id },
    });
    this.logger.log(ReplyServiceLog.UPDATE_REPLY_SUCCESS + id);
  }

  async removeReply(removeReplyDto: RemoveReplyDto, id: bigint) {
    const { writerId: writer_id } = removeReplyDto;
    await this.prisma.reply.delete({
      where: { id: id, writer_id: writer_id },
    });
    this.logger.log(ReplyServiceLog.REMOVE_REPLY_SUCCESS + id);
  }

  async getOneById(id: bigint): Promise<Reply> {
    return await this.prisma.reply
      .findUnique({
        where: { id: id },
      })
      .then((reply) => {
        validateFoundData(reply);
        return reply;
      });
  }

  async getReplyPageByPostId(post_id: bigint, lastId: bigint) {
    const lastIdCondition = ltLastIdCondition(lastId);
    const replies: ReplyPage[] = await this.prisma.reply.findMany({
      where: {
        AND: [{ post_id: post_id }, lastIdCondition],
      },
      orderBy: { id: 'desc' },
      take: ReplyRepoConstant.PAGE_SIZE,
    });

    return {
      replyPages: replies,
      metadata: { lastId: findLastIdOrDefault(replies) },
    };
  }
}
