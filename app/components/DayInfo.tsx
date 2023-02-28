import { useOutletContext, useParams } from "@remix-run/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ContextType, DayModel } from "~/lib/models";
import ActionList from "./ActionList";
import Button from "./Button";
import Celebration from "./Celebrations";
import CreateButtons from "./CreateButtons";
import DataFlow from "./DataFlow";
import Exclamation from "./Exclamation";

const DayInfo = ({ day }: { day: DayModel }) => {
  const context: ContextType = useOutletContext();
  const { slug } = useParams();

  return (
    <div
      className={`flex flex-shrink-0 flex-col overflow-hidden ${
        context.sidebar.open ? "lg:w-80" : "lg:w-12"
      } lg:pt-0`}
    >
      {day !== undefined ? (
        <>
          <div className="px-4 py-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              {context.sidebar.open && (
                <h5 className="text-xs">
                  {day.date.format("D [de] MMMM [de] YYYY")}
                </h5>
              )}
              <div
                className={`${
                  !context.sidebar.open ? "-ml-2" : ""
                } hidden lg:block`}
              >
                <Button
                  link
                  small
                  icon
                  squared
                  onClick={() => context.sidebar.set(!context.sidebar.open)}
                >
                  {context.sidebar.open ? (
                    <ArrowRight className="mr-0.5" />
                  ) : (
                    <ArrowLeft className="ml-0.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Celebrations */}
            {context.sidebar.open && day.celebrations.length > 0 ? (
              <div className="mt-4 flex flex-col">
                {day.celebrations.map((celebration, index) => (
                  <Celebration celebration={celebration} key={index} />
                ))}
              </div>
            ) : null}
          </div>
          {context.sidebar.open && (
            <>
              <div className="mx-auto">
                <DataFlow actions={day.actions} />
              </div>
              <ActionList
                actions={day.actions}
                hideAccount={slug !== undefined}
                showDateAndTime={slug !== undefined}
                className="p-4"
              />
            </>
          )}
        </>
      ) : (
        context.sidebar.open && (
          <div className="flex flex-auto p-8">
            <Exclamation icon>Escolha um dia no calendário ao lado</Exclamation>
          </div>
        )
      )}

      <CreateButtons
        action
        campaign
        celebration
        showSmallAction={!context.sidebar.open}
      />
    </div>
  );
};

export default DayInfo;
