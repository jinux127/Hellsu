import { Router } from 'express';
import is from '@sindresorhus/is';
import { postService, userService } from '../services';
import { loginRequired, upload } from '../middlewares/';
import { getTagList, getPostImageList } from '../utils';

const postRouter = Router();

// 게시글 리스트 가져오기 (전체)
postRouter.get('/all', async (req, res, next) => {
  try {
    const postListAll = await postService.getAllPost();

    res.status(200).json(postListAll);
  } catch (error) {
    next(error);
  }
});

// 게시글 리스트 가져오기 (유저 별)
postRouter.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const isUserExist = await userService.findByUserId(userId);

    if (!isUserExist) {
      throw new Error('존재하지 않는 유저입니다.');
    }

    const postList = await postService.getPostListByUserId(userId);

    res.status(200).json(postList);
  } catch (error) {
    next(error);
  }
});

// 게시글 리스트 가져오기 (게시글 object ID 이용)
postRouter.get('/article/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postService.getPostById(postId);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// 게시글 리스트 가져오기 (유저 + 월 별 + 무한스크롤)
postRouter.get('/list/month', async (req, res, next) => {
  try {
    const { userId, year, month, limit, reqNumber } = req.query;

    const isUserExist = await userService.findByUserId(userId as string);

    if (!isUserExist) {
      throw new Error('존재하지 않는 유저입니다.');
    }

    const date = {
      year: year as string,
      month: parseInt(month as string),
    };
    const conditions = {
      limit: parseInt(limit as string),
      reqNumber: parseInt(reqNumber as string),
    };

    const postList = await postService.getPostListByDate(
      userId as string,
      date,
      conditions
    );

    res.status(200).json(postList);
  } catch (error) {
    next(error);
  }
});

postRouter.get('/grass', loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const isUserExist = await userService.findByUserId(userId as string);

    if (!isUserExist) {
      throw new Error('존재하지 않는 유저입니다.');
    }
    if (!req.query.year || !req.query.month) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const dateList = await postService.getDateList(userId, year, month);
      res.status(200).json(dateList);
      return;
    }

    const year = Number(req.query.year);
    const month = Number(req.query.month);
    const dateList = await postService.getDateList(userId, year, month);
    res.status(200).json(dateList);
  } catch (error) {
    next(error);
  }
});

// 게시글 등록
postRouter.post(
  '/register',
  loginRequired,
  upload.array('post_image'),
  async (req, res, next) => {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요.'
        );
      }

      const userId = req.currentUserId;
      const { contents, tag_list, is_open, meal, routine } = req.body;
      // 'a,b,c'로 태그를 받아와 배열로 만들어줌
      const newTagList = tag_list ? getTagList(tag_list) : [];

      // req.files의 location을 받아옴
      const postImages = getPostImageList(
        req.files as {
          [fieldname: string]: Express.Multer.File[];
        }
      );

      const data = {
        userId,
        contents,
        tag_list: newTagList,
        post_image: postImages,
        is_open,
        meal,
        routine,
      };
      const newPost = await postService.addPost(data);

      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }
);

// 좋아요
postRouter.post('/like', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }
    const userId = req.currentUserId;
    const { postId } = req.body;
    postId;

    // 유저의 liked 배열에 postId가 있는지 검사
    const isExistPostId = await userService.isExistPostId(userId, postId);

    // 없다면 좋아요 + 1
    if (isExistPostId) {
      throw new Error('이미 좋아요를 누른 게시글 입니다.');
    }

    const updatedPost = await postService.updateLike(postId);

    const pushLike = await userService.pushPostIdInLikedArray(userId, postId);

    res.status(201).json(updatedPost);
    // 유저의 liked 배열에 postId 추가
  } catch (error) {
    next(error);
  }
});

// 게시글 삭제
postRouter.delete('/', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }

    const userId = req.currentUserId;
    const { postId } = req.body;

    const result = await postService.deletePost(userId, postId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 게시글 수정
postRouter.patch(
  '/:postId',
  loginRequired,
  upload.array('post_image'),
  async (req, res, next) => {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요.'
        );
      }

      const userId = req.currentUserId;
      const postId = req.params.postId;
      let postImages = undefined;
      let imageArrayLength = 0;
      if (req.files) {
        postImages = getPostImageList(
          req.files as {
            [fieldname: string]: Express.Multer.File[];
          }
        );
        imageArrayLength = postImages.length;
      }

      const { contents, is_open, tag_list, meal, routine } = req.body;

      const newTagList = tag_list ? getTagList(tag_list) : undefined;

      const toUpdateInfo = {
        ...(contents && { contents }),
        ...(imageArrayLength > 0 && { post_image: postImages }),
        ...(is_open && { is_open }),
        ...(newTagList && { tag_list: newTagList }),
        ...(meal && { meal }),
        ...(routine && { routine }),
      };

      const updatedPost = await postService.updatePost(
        userId,
        postId,
        toUpdateInfo
      );
      res.status(201).json(updatedPost);
    } catch (error) {
      next(error);
    }
  }
);

// 댓글 등록
postRouter.post('/comment', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }
    const { postId, content } = req.body;
    const userId = req.currentUserId;

    const data = {
      author: userId,
      content,
    };

    const result = await postService.addComment(postId, data);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// 댓글 수정
postRouter.patch('/comment/patch', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }

    const { commentId, content } = req.body;
    const userId = req.currentUserId;

    const result = await postService.updateComment(commentId, userId, content);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 댓글 삭제
postRouter.delete('/comment', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }

    const { commentId } = req.body;
    const userId = req.currentUserId;

    const result = await postService.deleteComment(userId, commentId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export { postRouter };