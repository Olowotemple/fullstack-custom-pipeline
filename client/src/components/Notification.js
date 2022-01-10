import { useSelector } from 'react-redux';

const Notification = ({ successStyle, errorStyle }) => {
  const notification = useSelector((state) => state.notification);
  if (!notification.msg) {
    return null;
  }
  const { type, msg } = notification;
  return (
    <div
      style={type === 'success' ? successStyle : errorStyle}
      className="Notification"
    >
      {msg}
    </div>
  );
};

export default Notification;
