import {
  ExclamationTriangleIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

const Exclamation = ({
  children,
  icon,
  type,
}: {
  children: React.ReactNode;
  icon?: boolean;
  type?: "alert" | "error" | "success" | "info";
}) => (
  <div>
    <div className={`exclamation bg-${type ?? "info"}`}>
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
