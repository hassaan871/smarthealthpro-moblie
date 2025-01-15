const showAlertMessage = (
  setShowAlert,
  setAlertMessage,
  setAlertType,
  setAlertActions,
  message,
  type,
  actions = []
) => {
  setShowAlert(true);
  setAlertMessage(message);
  setAlertType(type);
  setAlertActions(actions);
};

export default showAlertMessage;
