const initialState = { type: null, msg: null };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data;

    case 'REMOVE_NOTIFICATION':
      return { type: null, msg: null };

    default:
      return state;
  }
};

export const createSetNotification = (notification) => ({
  type: 'SET_NOTIFICATION',
  data: notification,
});

export const createRemoveNotification = () => ({
  type: 'REMOVE_NOTIFICATION',
});

export default reducer;
