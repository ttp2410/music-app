import { combineReducers, createStore } from 'redux'

const adminState = {
	musicData: []
}

function adminReducer(state = adminState, action) {
    switch (action.type) {
        case 'update/musicData':
            return { ...state, musicData: action.payload }
        default:
            return state
    }
}

const store = createStore(adminReducer);
export default store;