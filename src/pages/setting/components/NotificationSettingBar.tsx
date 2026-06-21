import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const NotificationSettingBar = () => {
  return (
    <Link
      to="/setting/notification"
      className="flex items-center justify-between rounded-xl bg-neutral-800 px-[1.25rem] py-[1.03rem]"
    >
      <span className="body-lg-regular text-primary">알림 설정</span>
      <FontAwesomeIcon
        icon={faAngleRight}
        className="text-tertiary h-icon-md w-icon-md"
      />
    </Link>
  );
};

export default NotificationSettingBar;
