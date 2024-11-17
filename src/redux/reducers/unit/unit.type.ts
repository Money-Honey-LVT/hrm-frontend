import { IUnit } from '@/types/models/IUnit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';

export interface UnitState {
  isFetching: boolean;
  units: IUnit[];
}

export enum UnitActionType {
  UNIT_ACTION_PENDING = 'UNIT_ACTION_PENDING',
  UNIT_ACTION_FAILURE = 'UNIT_ACTION_FAILURE',

  GET_ALL_UNIT_SUCCESS = 'GET_ALL_UNIT_SUCCESS_ACTION_SUCCESS',
  CREATE_UNIT_SUCCESS = 'CREATE_UNIT_SUCCESS',
  UPDATE_UNIT_SUCCESS = 'UPDATE_UNIT_SUCCESS',
  DELETE_UNIT_SUCCESS = 'DELETE_UNIT_SUCCESS',
  GET_DETAILS_UNIT_SUCCESS = 'GET_DETAILS_UNIT_SUCCESS',
}

export interface UnitActionPending {
  type: UnitActionType.UNIT_ACTION_PENDING;
}

export interface UnitActionFailure {
  type: UnitActionType.UNIT_ACTION_FAILURE;
}

export interface GetAllUnitSuccess {
  type: UnitActionType.GET_ALL_UNIT_SUCCESS;
  payload: IUnit[];
}

export interface CreateUnitSuccess {
  type: UnitActionType.CREATE_UNIT_SUCCESS;
}

export interface UpdateUnitSuccess {
  type: UnitActionType.UPDATE_UNIT_SUCCESS;
}

export interface DeleteUnitSuccess {
  type: UnitActionType.DELETE_UNIT_SUCCESS;
}
export interface GetDetailsUnitSuccess {
  type: UnitActionType.GET_DETAILS_UNIT_SUCCESS;
}

export type UnitAction =
  | UnitActionPending
  | UnitActionFailure
  | GetAllUnitSuccess
  | CreateUnitSuccess
  | UpdateUnitSuccess
  | DeleteUnitSuccess
  | GetDetailsUnitSuccess

export type UnitThunkAction = ThunkAction<
  void,
  RootState,
  undefined,
  UnitAction
>;
