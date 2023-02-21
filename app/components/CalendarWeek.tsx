import { useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import type { ActionModel, CelebrationModel, PeriodType } from "~/lib/models";
import { ActionMedium } from "./Actions";

const WeekView = ({
  period,
  actions,
}: {
  period: PeriodType;
  actions: ActionModel[];
}) => {
  const matches = useMatches();
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;

  return (
    <div className="h-full overflow-hidden  lg:flex">
      <div className="grid w-auto grid-cols-7 overflow-hidden">
        {period.map((day, index) => {
          return (
            <div key={index} className="h-full overflow-hidden">
              <div className="px-1">
                <h5>{day.date.format("D")}</h5>
                <div>{/* Celebrations */}</div>
                <div>{/* Campaings */}</div>
              </div>
              <div className="no-scrollbars h-full overflow-hidden overflow-y-auto px-1">
                <div className="pb-24">
                  {/* Actions */}
                  {actions
                    .filter(
                      (action) =>
                        dayjs(action.date).format("YYYY-MM-DD") ===
                        day.date.format("YYYY-MM-DD")
                    )
                    .map((action) => (
                      <ActionMedium
                        action={action}
                        hideAccount={false}
                        key={action.id}
                        showDateAndTime={true}
                        wrap
                      />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
