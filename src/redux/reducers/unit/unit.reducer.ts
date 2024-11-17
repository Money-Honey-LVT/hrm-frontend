import { Reducer } from 'redux';
import {
  UnitAction,
  UnitActionType,
  UnitState
} from './unit.type';

const initialState: UnitState = {
  isFetching: false,
  units: []
};

const unitReducer: Reducer<UnitState, UnitAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UnitActionType.UNIT_ACTION_PENDING:
      return { ...state, isFetching: true };
    case UnitActionType.UNIT_ACTION_FAILURE:
      return { ...state, isFetching: false };
    case UnitActionType.GET_ALL_UNIT_SUCCESS:
      return { ...state, isFetching: false, units: action.payload };
    case UnitActionType.CREATE_UNIT_SUCCESS:
    case UnitActionType.UPDATE_UNIT_SUCCESS:
    case UnitActionType.DELETE_UNIT_SUCCESS:
    case UnitActionType.GET_DETAILS_UNIT_SUCCESS:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

export default unitReducer;
