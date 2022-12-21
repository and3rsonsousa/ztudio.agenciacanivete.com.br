import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useParams } from "@remix-run/react";
import { useState } from "react";
import type { DayModel } from "~/lib/models";
import ActionList from "./ActionList";
import Button from "./Button";
import Celebration from "./Celebrations";
import CreateButtons from "./CreateButtons";
import Exclamation from "./Exclamation";

const DayInfo = ({ day }: { day: DayModel }) => {
  const [view, setView] = useState(true);
  const { slug } = useParams();

  return (
    <div
      className={`mt-16 flex flex-shrink-0 flex-col overflow-hidden pt-16 lg:mt-0 ${
        view ? "lg:w-80" : "lg:w-12"
      } lg:pt-0`}
    >
      {day !== undefined ? (
        <>
          <div className="px-4 py-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              {view && (
                <h5 className="text-xs">
                  {day.date.format("D [de] MMMM [de] YYYY")}
                </h5>
              )}
              <div className={`${!view ? "-ml-2" : ""} hidden lg:block`}>
                <Button link small icon squared onClick={() => setView(!view)}>
                  {view ? (
                    <ArrowRightIcon className="mr-0.5" />
                  ) : (
                    <ArrowLeftIcon className="ml-0.5" />
                  )}
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
          {view && (
            <ActionList
              actions={day.actions}
              hideAccount={slug !== undefined}
              showDateAndTime={slug !== undefined}
            />
          )}
        </>
      ) : (
        <div className="flex flex-auto p-8">
          <Exclamation icon>Escolha um dia no calendário ao lado</Exclamation>
        </div>
      )}

      {view && <CreateButtons action campaign celebration />}
    </div>
  );
};

export default DayInfo;
