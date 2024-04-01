import React from "react";
import { truncate } from "../helpers";

function Notification({ notification }) {
  const displayNotificationContent = () => {
    switch (notification.type) {
      case "Like": {
        return (
          <div className="flex-1">
            <p className="sm:text-[13.5px] text-[11.5px] font-normal">
              <span className="text-[13px] sm:text-[13.5px] font-medium">
                {truncate(notification.sender.username)}
              </span>{" "}
              liked your post
            </p>
          </div>
        );
      }

      case "Comment": {
        return (
          <div className="flex-1">
            <p className="sm:text-[13.5px] text-[11.5px] font-normal">
              <span className="text-[13px] sm:text-[13.5px] font-medium">
                {truncate(notification.sender.username)}
              </span>{" "}
              commented on your post:
            </p>
            <p className="text-[12px] font-normal">
              {notification.comment?.text}
            </p>
          </div>
        );
      }
    }
  };

  return (
    <div
      className={`flex items-start space-x-2 px-2 py-4 h-16 ${
        !notification.isread && "bg-gray-200"
      }`}
    >
      <img
        src={notification.sender.profilePicture}
        className="object-cover h-9 w-9 rounded-full"
      />

      <div className="flex-1 flex items-start h-full">
        {displayNotificationContent()}

        {notification.post.img && (
          <img
            src={notification.post.img}
            className="rounded-sm object-cover h-full w-14"
          />
        )}
      </div>
    </div>
  );
}

export default Notification;
