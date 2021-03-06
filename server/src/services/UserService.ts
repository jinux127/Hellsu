import { userModel, UserModel, UserInfo } from '../db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface RequiredInfo {
  userId: string;
  currentPassword: string;
}
interface LoginInfo {
  userId: string;
  password: string;
}

interface ErrorWithStatus {
  status?: number;
  message: string;
  stack?: string;
}

class UserService {
  constructor(private userModel: UserModel) {}

  async findByUserId(userId: string) {
    const user = await this.userModel.findByUserId(userId);

    if (!user) {
      throw new Error('해당 유저를 찾지 못했습니다.');
    }

    return user;
  }

  // 좋아요 눌렀는지 검사
  async isExistPostId(userId: string, postId: string) {
    const findUser = await this.findByUserId(userId);
    if (!findUser) {
      throw new Error('해당 유저를 찾지 못했습니다.');
    }

    const isExistPostId = await this.userModel.findUserLike(userId, postId);

    return isExistPostId;
  }

  async checkLiked(userId: string, postId: string) {
    const isLiked = await this.userModel.findUserLike(userId, postId);

    return isLiked;
  }

  async manipulateLikedArray(userId: string, postId: string, mode: string) {
    const Liked = await this.userModel.manipulateLikedArray(
      userId,
      postId,
      mode
    );

    return Liked;
  }

  // 유저 정보 등록
  async addUser(userInfo: UserInfo) {
    const { name, nickname, userId, password } = userInfo;

    // 아이디 중복검사
    const user = await this.userModel.findByUserId(userId);
    if (user) {
      throw new Error(
        '이 아이디는 현재 사용중입니다. 다른 아이디를 입력해주세요.'
      );
    }

    // 중복 x -> 회원가입
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = {
      name,
      nickname,
      userId,
      password: hashedPassword,
    };

    const createdNewUser = await this.userModel.create(newUserInfo);

    return createdNewUser;
  }

  // 유저 정보 수정
  async patchUser(requiredInfo: RequiredInfo, toUpdateInfo: Partial<UserInfo>) {
    const { userId, currentPassword } = requiredInfo;

    const user = await this.userModel.findByUserId(userId);

    if (!user) {
      throw new Error('해당 유저를 찾지 못했습니다.');
    }

    // 비밀번호 확인
    const correctPasswordHash = user.password;
    const isCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isCorrect) {
      const error: ErrorWithStatus = new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.'
      );
      throw error;
    }

    // 업데이트
    // 패스워드는 해싱 후 전달해야함.
    const { password } = toUpdateInfo;

    if (password) {
      const newPasswordHashed = await bcrypt.hash(password, 10);
      toUpdateInfo.password = newPasswordHashed;
    }

    const updatedUser = await this.userModel.update(userId, toUpdateInfo);

    return updatedUser;
  }

  // 유저 정보 삭제
  async deleteUser(userId: string, password: string) {
    const user = await this.userModel.findByUserId(userId);

    if (!user) {
      throw new Error('해당 유저를 찾지 못했습니다.');
    }

    // 비밀번호 확인
    const correctPasswordHash = user.password;
    const isCorrect = await bcrypt.compare(password, correctPasswordHash);

    // 불일치
    if (!isCorrect) {
      const error: ErrorWithStatus = new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.'
      );
      throw error;
    }

    const result = await this.userModel.deleteUser(userId);

    return result;
  }
  async getUserToken(loginInfo: LoginInfo) {
    const { userId, password } = loginInfo;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('해당 유저를 찾지 못했습니다.');
    }

    const correctPasswordHash = user.password;

    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      const error: ErrorWithStatus = new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.'
      );
      throw error;
    }

    const nickname = user.nickname;
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // accessToken은 5분으로 설정
    const accessToken = jwt.sign({ userId, nickname }, secretKey, {
      expiresIn: '5m',
    });

    // refreshToken은 7일로 설정
    const refreshToken = jwt.sign({}, secretKey, {
      expiresIn: '7d',
    });

    this.setRefreshToken(userId, refreshToken);

    return { accessToken, userId };
  }

  async setRefreshToken(userId: string, refreshToken: string) {
    const updatedUser = await this.userModel.setRefreshToken(
      userId,
      refreshToken
    );
  }
}
const userService = new UserService(userModel);

export { userService };
