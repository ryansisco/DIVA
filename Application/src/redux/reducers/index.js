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

const initialGraphicOptions = {
	color: {
		x: '#FF0000',
		y: '#00FF00',
		z: '#0000FF',
		d: '#ff00ff',
		background: 'white' 
	},
	colorMenus:{
		x: false,
		y: false,
		z: false,
		d: false
	},
	thickness:{
		a:1,
		b:2,
		c:3,
		d:4,
		e:5
	},
	visualization: 'scatterplot',
	rotate: false,
	axesLabels: true,
	axesNames: true
}

export default combineReducers({
    graphData: createReducer('GRAPH', []),
    graphicOptions: createReducer('GRAPHIC_OPTIONS', initialGraphicOptions)
});