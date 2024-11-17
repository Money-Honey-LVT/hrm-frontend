import { AppDispatch } from '@/redux/store';
import { UnitActionType, UnitThunkAction } from './unit.type';
import { useCallApi } from '@/configs/api';
import { API_URLS } from '@/configs/api/endpoint';
import { NotiType, renderNotification } from '@/utils/notifications';
import {
  CreateUnitPayload,
  UpdateUnitPayload
} from '@/configs/api/payload';
import { Callback } from '@/types/others/callback';

const getAllUnit =
  (): UnitThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: UnitActionType.UNIT_ACTION_PENDING });

    return []
  };

const createUnit =
  (payload: CreateUnitPayload, cb?: Callback): UnitThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: UnitActionType.UNIT_ACTION_PENDING });

    const api = API_URLS.Unit.create();

    const { response, error } = await useCallApi({ ...api, payload });
    if (!error && response?.status === 200) {
      dispatch({ type: UnitActionType.CREATE_UNIT_SUCCESS });
      renderNotification('Tạo đơn vị thành công', NotiType.SUCCESS);
      cb?.onSuccess?.();
    } else {
      dispatch({ type: UnitActionType.UNIT_ACTION_FAILURE });
      renderNotification('Tạo mới đơn vị thất bại', NotiType.ERROR);
    }
  };

const updateUnit =
  (
    payload: UpdateUnitPayload,
    id: string | undefined,
    cb?: Callback
  ): UnitThunkAction =>
  async (dispatch: AppDispatch) => {
    if (!id) {
      return;
    }

    dispatch({ type: UnitActionType.UNIT_ACTION_PENDING });

    const api = API_URLS.Unit.update(id);

    const { response, error } = await useCallApi({ ...api, payload });
    if (!error && response?.status === 200) {
      dispatch({ type: UnitActionType.UPDATE_UNIT_SUCCESS });
      renderNotification(
        'Cập nhật thông tin đơn vị thành công',
        NotiType.SUCCESS
      );
      cb?.onSuccess?.();
    } else {
      dispatch({ type: UnitActionType.UNIT_ACTION_FAILURE });
      renderNotification(
        'Cập nhật thông tin đơn vị thất bại',
        NotiType.ERROR
      );
    }
  };

const deleteUnit =
  (id: string | undefined, cb?: Callback): UnitThunkAction =>
  async (dispatch: AppDispatch) => {
    if (!id) return;
    dispatch({ type: UnitActionType.UNIT_ACTION_PENDING });

    const api = API_URLS.Unit.delete(id);

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({ type: UnitActionType.DELETE_UNIT_SUCCESS });
      renderNotification('Xoá đơn vị thành công', NotiType.SUCCESS);
      cb?.onSuccess?.();
    } else {
      dispatch({ type: UnitActionType.UNIT_ACTION_FAILURE });
      renderNotification('Xoá đơn vị thất bại', NotiType.ERROR);
    }
  };

export const UnitActions = {
  getAllUnit,
  createUnit,
  updateUnit,
  deleteUnit,
};
