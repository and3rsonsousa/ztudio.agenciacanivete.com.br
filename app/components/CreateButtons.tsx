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
  showSmallAction,
}: {
  celebration?: boolean;
  campaign?: boolean;
  action?: boolean;
  showSmallAction?: boolean;
}) {
  const context: {
    actions: {
      openDialogAction: boolean;
      setOpenDialogAction: React.Dispatch<React.SetStateAction<boolean>>;
    };
    campaigns: {
      openDialogCampaign: boolean;
      setOpenDialogCampaign: React.Dispatch<React.SetStateAction<boolean>>;
    };
    celebrations: {
      openDialogCelebration: boolean;
      setOpenDialogCelebration: React.Dispatch<React.SetStateAction<boolean>>;
    };
  } = useOutletContext();

  return (
    <div className="flex items-center justify-end gap-2 p-4 ">
      {/* Dialog for Celebrations */}
      {celebration && !showSmallAction && (
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
      {campaign && !showSmallAction && (
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
        <div
          className={`${
            showSmallAction ? "fixed right-4 bottom-4 z-10" : "ml-4"
          } `}
        >
          <Button
            primary
            icon
            squared={showSmallAction}
            large={showSmallAction}
            onClick={() => {
              context.actions.setOpenDialogAction(true);
            }}
            title="Cmd + Shift + K"
          >
            {!showSmallAction && (
              <div className="whitespace-nowrap">Nova Ação</div>
            )}
            <DocumentPlusIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
