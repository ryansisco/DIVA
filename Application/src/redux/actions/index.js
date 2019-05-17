const createAction = (actionName) => {
    return (item) => {
        return dispatch => {
            dispatch({
                type: `${actionName}_LOADING`
            });
            dispatch({
                type: `${actionName}_UPDATE`,
                payload: item
            });
        }
    }
}

export const updateGraphData = createAction('GRAPH');
export const updateGraphicOptions = createAction('GRAPHIC_OPTIONS');
