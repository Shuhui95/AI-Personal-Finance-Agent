import { useEffect } from "react";
import "./Notification.css";

function Notification({
  message,
  type = "success",
  onClose,
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message, onClose]);

  return (
    <div
      className={`notification notification-${type}`}
      role="status"
    >
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Notification;