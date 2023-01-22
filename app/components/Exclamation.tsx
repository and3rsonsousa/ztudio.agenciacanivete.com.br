import { AlertTriangle, ThumbsDown, ThumbsUp } from "lucide-react";

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
            <ThumbsUp className={large ? `w-8` : small ? "w-4" : "w-6"} />
          ) : type === "error" ? (
            <ThumbsDown className={large ? `w-8` : small ? "w-4" : "w-6"} />
          ) : (
            <AlertTriangle className={large ? `w-8` : small ? "w-4" : "w-6"} />
          )}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  </div>
);

export default Exclamation;
