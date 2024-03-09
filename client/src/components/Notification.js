import React from "react";

function Notification({ notification }) {
  const displayNotificationContent = () => {
    switch (notification.type) {
      case "Like": {
        return (
          <div className="flex-1 flex items-center">
            <div className="flex-1">
              <p className="text-[13px] font-normal">
                <span className="font-semibold">
                  {notification.sender.username}
                </span>{" "}
                liked your post
              </p>
            </div>

            {notification.post.img && (
              <img
                src={notification.post.img}
                width={36}
                height={36}
                className="rounded-sm object-cover"
              />
            )}
          </div>
        );
      }

      case "Comment": {
        return (
          <div className="flex-1 flex items-center">
            <div className="flex-1">
              <p className="text-[13px] font-normal">
                <span className="font-semibold">
                  {notification.sender.username}
                </span>{" "}
                commented on your post:
              </p>
              <p className="text-[12px] font-normal">
                {notification.comment?.text}
              </p>
            </div>

            {notification.post.img && (
              <img
                src={notification.post.img}
                width={36}
                height={36}
                className="rounded-sm object-cover"
              />
            )}
          </div>
        );
      }

      case "Follow": {
        <div className="flex-1 flex items-center">
          <div className="flex-1">
            <p className="text-[13px] font-normal">
              <span className="font-semibold">
                {notification.sender.username}
              </span>{" "}
              started following you!
            </p>
          </div>
        </div>;
      }
    }
  };

  return (
    <div
      className={`flex items-center space-x-2 border-t-2 px-2 py-3 ${
        !notification.isread && "bg-gray-200"
      }`}
    >
      <img
        src={notification.sender.profilePicture}
        className="object-cover bg-red-500 h-8 w-8 rounded-full"
      />

      {displayNotificationContent()}
    </div>
  );
}

export default Notification;
