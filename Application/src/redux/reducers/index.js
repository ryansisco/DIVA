import { combineReducers } from 'redux';

export const createReducer = (actionName, initialData) => {
    const initialState = {
        data: initialData,
        type: `${actionName}_NOT_STARTED`
    };

    return (state = initialState, action) => {
        switch(action.type) {
            case `${actionName}_UPDATE`:
                return {
                    ...state,
                    type: action.type,
                    data: action.payload
                };
            case `${actionName}_SUCCESS`:
                return {
                    ...state,
                    type: action.type,
                    data: action.payload
                };
            default:
                return state;
        }
    }
}

export default combineReducers({
    cameraReducer: createReducer('CAMERA', {data: 10, type: 'CAMERA_UPDATE'})
});