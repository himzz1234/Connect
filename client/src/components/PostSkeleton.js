import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PostSkeleton() {
  return (
    <div className="bg-bodySecondary px-6 py-4 mb-2 rounded-md">
      <div className="flex items-center space-x-4">
        <Skeleton
          circle
          width={44}
          height={44}
          baseColor="#adb4b6"
          highlightColor="#e4e6e7"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Skeleton
              width={100}
              height={8}
              baseColor="#adb4b6"
              highlightColor="#e4e6e7"
            />
          </div>
          <Skeleton
            width={60}
            height={8}
            baseColor="#adb4b6"
            highlightColor="#e4e6e7"
          />
        </div>
      </div>

      <div className="my-6">
        <Skeleton height={150} baseColor="#adb4b6" highlightColor="#e4e6e7" />
      </div>
    </div>
  );
}

export default PostSkeleton;
