import { Frown, Laugh, Meh } from "lucide-react";

const Exclamation = ({
  children,
  icon,
  type,
  size,
}: {
  children: React.ReactNode;
  icon?: boolean;
  type?: "alert" | "error" | "success" | "info";
  size?: "large" | "small";
}) => (
  <div className="text-left">
    <div className={`exclamation bg-${type ?? "info"} ${size ?? ""}`}>
      {icon ? (
        <div className="exclamation-icon">
          {type === "success" ? (
            <Laugh />
          ) : type === "error" ? (
            <Frown />
          ) : (
            <Meh />
          )}
        </div>
      ) : null}
      <div className="exclamation-text">{children}</div>
    </div>
  </div>
);

export default Exclamation;
