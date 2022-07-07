import { Router } from 'express';
import is from '@sindresorhus/is';
import { postService } from '../services';

const postRouter = Router();

// 게시글 등록
postRouter.post('/register', async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }

    const newPost = await postService.addPost(req.body);

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

export { postRouter };
