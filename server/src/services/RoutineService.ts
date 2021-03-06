import { routineModel, RoutineModel } from '../db';
import { userService } from './UserService';
import { checkRoutine } from '../utils';
import { Types } from 'mongoose';
export interface RoutineInfo {
  userId: string;
  routine_name: string;
  routine_list: Array<Exercise>;
}

export interface Routine {
  routine_name: string;
  routine_list: Array<Exercise>;
  _id: Types.ObjectId;
}

export interface Exercise {
  name: string;
  count?: number;
  set?: number;
  weight?: number;
}

interface ErrorWithStatus {
  status?: number;
  message: string;
  stack?: string;
}

class RoutineService {
  constructor(private routineModel: RoutineModel) {}

  async findByUserId(userId: string) {
    const foundRoutine = await this.routineModel.findByUserId(userId);
    return foundRoutine;
  }

  async findRoutineByObjectId(routineId: string) {
    const result = await this.routineModel.findRoutineByObjectId(routineId);
    return result;
  }

  async searchRoutine(userId: string, keyword: string) {
    const foundUser = await userService.findByUserId(userId);
    if (!foundUser) {
      throw new Error('해당 유저를 찾지 못했습니다.');
    }

    const routineList = await this.routineModel.searchRoutine(userId, keyword);
    return routineList;
  }

  async addRoutine(routineInfo: RoutineInfo) {
    const { userId, routine_name, routine_list } = routineInfo;
    // 검사 코드 추가

    const foundUser = await userService.findByUserId(userId);
    if (!foundUser) {
      throw new Error('해당 유저를 찾지 못했습니다.');
    }
    const newRoutineList = checkRoutine(routine_list);

    const newRoutine = {
      userId,
      routine_name,
      routine_list: newRoutineList,
    };

    const createdNewRoutine = await this.routineModel.create(newRoutine);

    return createdNewRoutine;
  }

  async deleteRoutine(userId: string, routineId: string) {
    const foundRoutine = await this.routineModel.findRoutineByObjectId(
      routineId
    );

    if (!foundRoutine) {
      throw new Error('해당 루틴을 찾지 못했습니다.');
    }

    if (foundRoutine.userId !== userId) {
      const error: ErrorWithStatus = new Error('작성자만 삭제할 수 있습니다.');
      error.status = 403;
      throw error;
    }

    const deletedRoutine = await this.routineModel.deleteByRoutineId(routineId);
    return deletedRoutine;
  }

  async patchRoutine(
    userId: string,
    routineId: string,
    toUpdateInfo: Partial<RoutineInfo>
  ) {
    const foundRoutine = await this.routineModel.findRoutineByObjectId(
      routineId
    );

    if (!foundRoutine) {
      throw new Error('해당 루틴을 찾지 못했습니다.');
    }

    if (foundRoutine.userId !== userId) {
      const error: ErrorWithStatus = new Error('작성자만 수정할 수 있습니다.');
      error.status = 403;
      throw error;
    }

    const updatedRoutine = await this.routineModel.update(
      routineId,
      toUpdateInfo
    );

    return updatedRoutine;
  }
}
const routineService = new RoutineService(routineModel);

export { routineService };
