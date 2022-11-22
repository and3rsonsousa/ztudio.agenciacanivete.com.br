import {
  DocumentPlusIcon,
  FolderPlusIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useOutletContext } from "@remix-run/react";
import Button from "./Button";

export default function CreateButtons({
  celebration,
  campaign,
  action,
}: {
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
            squared
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
            squared
            onClick={() => {
              context.campaigns.setOpenDialogCampaign(true);
            }}
          >
            <FolderPlusIcon />
          </Button>
        </div>
      )}
      {action && (
        <div className="ml-4">
          <Button
            primary
            icon
            onClick={() => {
              context.actions.setOpenDialogAction(true);
            }}
          >
            <div className="whitespace-nowrap">Nova Ação</div>
            <DocumentPlusIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
