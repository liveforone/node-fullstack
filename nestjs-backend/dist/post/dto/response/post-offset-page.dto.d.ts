import { PostPage } from './post-page.dto';
export interface PostOffsetPageDto {
    readonly postPages: PostPage[];
    readonly metadata: {
        readonly pageNumber: number;
    };
}
