import {
  StarIcon,
  CalendarDaysIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useOutletContext } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import Button from "./Forms/Button";

export default function CreateButtons({
  date,
  celebration,
  campaign,
  action,
}: {
  date: Dayjs;
  celebration?: boolean;
  campaign?: boolean;
  action?: boolean;
}) {
  const context: {
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
    <div className="flex items-center justify-end gap-2 border-t p-4 dark:border-gray-800">
      {/* Dialog for Celebrations */}
      {celebration && (
        <div>
          <Button
            link
            icon
            onClick={() => {
              context.celebrations.setOpenDialogCelebration(true);
            }}
          >
            <StarIcon />
          </Button>
        </div>
      )}
      {campaign && (
        <div>
          <Button
            link
            icon
            onClick={() => {
              context.campaigns.setOpenDialogCampaign(true);
            }}
          >
            <CalendarDaysIcon />
          </Button>
        </div>
      )}
      {action && (
        <div className="ml-4">
          <Button
            primary
            onClick={() => {
              context.actions.setOpenDialogAction(true);
            }}
          >
            Nova Ação <PlusIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
