import type { ActionModel } from "~/lib/models";
import { ActionMedium } from "./Actions";
import Exclamation from "./Exclamation";

export default function ActionList({
  actions,
  hideAccount,
  showDateAndTime,
}: {
  actions: ActionModel[];
  hideAccount?: boolean;
  showDateAndTime?: boolean;
}) {
  return (
    <div className="no-scrollbars flex h-full flex-col overflow-auto p-4">
      {actions && actions.length > 0 ? (
        actions.map((action, i) => (
          <ActionMedium
            action={action}
            key={i}
            hideAccount={hideAccount}
            showDateAndTime={showDateAndTime}
          />
        ))
      ) : (
        <Exclamation icon>Nenhuma ação para exibir.</Exclamation>
      )}
    </div>
  );
}
