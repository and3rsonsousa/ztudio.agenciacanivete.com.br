import type { ActionModel } from "~/lib/models";
import { ActionMedium } from "./Actions";
import Exclamation from "./Exclamation";
import Scrollable from "./Scrollable";

export default function ActionList({
  actions,
  hideAccount,
  showDateAndTime,
}: {
  actions: ActionModel[];
  hideAccount?: boolean;
  showDateAndTime?: boolean;
}) {
  return actions && actions.length > 0 ? (
    <Scrollable>
      <div className="h-full w-full p-4">
        {actions.map((action, i) => (
          <ActionMedium
            action={action}
            key={i}
            hideAccount={hideAccount}
            showDateAndTime={showDateAndTime}
          />
        ))}
      </div>
    </Scrollable>
  ) : (
    <Exclamation icon>Nenhuma ação para exibir.</Exclamation>
  );
}
