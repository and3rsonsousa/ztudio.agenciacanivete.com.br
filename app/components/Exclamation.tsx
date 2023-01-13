import {
  ExclamationTriangleIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

const Exclamation = ({
  children,
  icon,
  type,
  large,
  small,
}: {
  children: React.ReactNode;
  icon?: boolean;
  type?: "alert" | "error" | "success" | "info";
  large?: boolean;
  small?: boolean;
}) => (
  <div className="text-left">
    <div
      className={`exclamation bg-${type ?? "info"} ${
        large ? "text-base" : small ? "text-xx" : "text-sm"
      }`}
    >
      {icon ? (
        <div>
          {type === "success" ? (
            <HandThumbUpIcon
              className={large ? `w-8` : small ? "w-4" : "w-6"}
            />
          ) : type === "error" ? (
            <HandThumbDownIcon
              className={large ? `w-8` : small ? "w-4" : "w-6"}
            />
          ) : (
            <ExclamationTriangleIcon
              className={large ? `w-8` : small ? "w-4" : "w-6"}
            />
          )}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  </div>
);

export default Exclamation;
