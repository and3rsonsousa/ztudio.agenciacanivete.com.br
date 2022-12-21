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
            <HandThumbUpIcon />
          ) : type === "error" ? (
            <HandThumbDownIcon />
          ) : (
            <ExclamationTriangleIcon />
          )}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  </div>
);

export default Exclamation;
