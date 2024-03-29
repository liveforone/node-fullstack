import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReplyEntity } from '../entities/reply.entity';
import { $Enums, Reply } from '@prisma/client';
import { validateFoundData } from 'src/common/found-data.validator';
import { findLastIdOrDefault, ltLastIdCondition } from 'prisma-no-offset';
import { ReplyPage } from '../dto/response/reply-page.dto';
import { ReplyOptimizedPageDto } from '../dto/response/reply-optimized-page.dto';
import { ReplyRepoConstant } from './constant/reply-repository.constant';

@Injectable()
export class ReplyRepository {
  constructor(private prisma: PrismaService) {}

  async save(reply: ReplyEntity) {
    //유니크 제약 조건 사항 없음
    await this.prisma.reply.create({ data: reply });
  }

  async updateReplyByIdAndWriterId(
    content: string,
    id: bigint,
    writer_id: string,
  ) {
    await this.prisma.reply.update({
      data: { content: content, reply_state: $Enums.ReplyState.EDITED },
      where: { id: id, writer_id: writer_id },
    });
  }

  async deleteOneByIdAndWriterId(id: bigint, writer_id: string) {
    await this.prisma.reply.delete({
      where: { id: id, writer_id: writer_id },
    });
  }

  async findOneById(id: bigint): Promise<Reply> {
    const reply = await this.prisma.reply.findUnique({
      where: { id: id },
    });
    validateFoundData(reply);
    return reply;
  }

  //post_id로 조회
  async findReplyPageByPostId(
    post_id: bigint,
    lastId: bigint,
  ): Promise<ReplyOptimizedPageDto> {
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
