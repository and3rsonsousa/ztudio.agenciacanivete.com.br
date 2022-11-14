import {
  CalendarDaysIcon,
  ChevronRightIcon,
  PlusIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useMatches, useOutletContext } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import type { DayModel } from "~/lib/models";
import ActionList from "./ActionList";
import Celebration from "./Celebrations";
import Exclamation from "./Exclamation";
import Button from "./Forms/Button";

const DayInfo = ({ day }: { day: DayModel }) => {
  const matches = useMatches();
  const [view, setView] = useState(true);
  const account = matches[2].data.account;
  const context: {
    date: {
      dateOfTheDay: Dayjs;
      setDateOfTheDay: (b?: Dayjs) => void;
    };
    actions: {
      openDialogAction: boolean;
      setOpenDialogAction: (b?: boolean) => void;
    };
    campaigns: {
      openDialogCampaign: boolean;
      setOpenDialogCampaign: (b?: boolean) => void;
    };
    celebrations: {
      openDialogCelebration: boolean;
      setOpenDialogCelebration: (b?: boolean) => void;
    };
  } = useOutletContext();

  return (
    <div
      className={`mt-16 flex flex-shrink-0 flex-col overflow-hidden border-t pt-16 lg:mt-0 ${
        view ? "lg:w-80" : "lg:w-12"
      } lg:border-0 lg:pt-0`}
    >
      {day !== undefined ? (
        <>
          <div className="border-b p-4 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between">
              {view && (
                <h5 className="text-xs">
                  {day.date.format("D [de] MMMM [de] YYYY")}
                </h5>
              )}
              <div className={!view ? "-ml-2" : ""}>
                <Button link small icon onClick={() => setView(!view)}>
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>

            {/* Celebrations */}
            {view && day.celebrations.length > 0 ? (
              <div className=" mt-4 flex flex-col">
                {day.celebrations.map((celebration, index) => (
                  <Celebration celebration={celebration} key={index} />
                ))}
              </div>
            ) : null}
          </div>
          {view && <ActionList actions={day.actions} hideAccount={!!account} />}
        </>
      ) : (
        <div className="flex flex-auto p-8">
          <Exclamation icon>Escolha um dia no calendário ao lado</Exclamation>
        </div>
      )}

      {view && (
        <div className="flex items-center justify-end gap-2 border-t p-4 dark:border-gray-800">
          {/* Dialog for Celebrations */}
          <div>
            <Button
              link
              icon
              onClick={() => {
                context.date.setDateOfTheDay(day.date);
                context.celebrations.setOpenDialogCelebration(true);
              }}
            >
              <StarIcon />
            </Button>
          </div>
          <div>
            <Button
              link
              icon
              onClick={() => {
                context.date.setDateOfTheDay(day.date);
                context.campaigns.setOpenDialogCampaign(true);
              }}
            >
              <CalendarDaysIcon />
            </Button>
          </div>
          <div className="ml-4">
            <Button
              primary
              onClick={() => {
                context.date.setDateOfTheDay(day.date);
                context.actions.setOpenDialogAction(true);
              }}
            >
              Nova Ação <PlusIcon />
            </Button>
          </div>

          {/* Dialog for Campaigns */}

          {/* Dialog for Actions */}
        </div>
      )}
    </div>
  );
};

export default DayInfo;
