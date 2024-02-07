import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReplyEntity } from '../entities/reply.entity';
import { GlobalExcMsg } from 'src/exceptionHandle/exceptionMessage/global.exception.message';
import { $Enums, Reply } from '@prisma/client';
import { ReplyException } from 'src/exceptionHandle/customException/reply.exception';
import { ReplyExcMsg } from 'src/exceptionHandle/exceptionMessage/reply.exception.message';
import { validateFoundData } from 'src/common/validate.found-data';
import { findLastIdOrDefault, ltLastIdCondition } from 'prisma-no-offset';
import { ReplyPage } from '../dto/response/reply-page.dto';
import { ReplyOptimizedPageDto } from '../dto/response/reply-optimized-page.dto';
import { ReplyRepoConstant } from './constant/reply.repository.constant';

@Injectable()
export class ReplyRepository {
  constructor(private prisma: PrismaService) {}

  async save(reply: ReplyEntity) {
    await this.prisma.reply.create({ data: reply }).catch((err) => {
      if (err.code == GlobalExcMsg.UNIQUE_CONSTRAINTS_CODE) {
        throw new HttpException(
          GlobalExcMsg.IGNORE_UNIQUE_CONSTRAINTS,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    });
  }

  async updateReplyByIdAndWriterId(
    content: string,
    id: bigint,
    writer_id: string,
  ) {
    await this.prisma.reply
      .update({
        data: { content: content, reply_state: $Enums.ReplyState.EDITED },
        where: { id: id, writer_id: writer_id },
      })
      .catch(() => {
        throw new ReplyException(
          ReplyExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async deleteOneByIdAndWriterId(id: bigint, writer_id: string) {
    await this.prisma.reply
      .delete({
        where: { id: id, writer_id: writer_id },
      })
      .catch(() => {
        throw new ReplyException(
          ReplyExcMsg.ID_OR_WRITER_ID_IS_BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
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
