const messageReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_GROUP_MESSAGES':
      return { ...state, messages: action.messages };
    case 'SEND_MESSAGE_SUCCESS':
      return { ...state, messageSent: action.messageSent };
    default:
      return state;
  }
};
export default messageReducer;

