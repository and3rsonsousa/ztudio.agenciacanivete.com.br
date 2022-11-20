import type { Dayjs } from "dayjs";
export type PersonModel = {
  id: string;
  name: string;
  email: string;
  admin: Boolean;
  user: string;
};

export type UserModel = {
  id: string;
  email?: string;
};

export type AccountModel = {
  id: string;
  name: string;
  slug: string;
  users: string[];
};

export type CampaignModel = {
  id: string;
  name: string;
  description: string;
  account: string;
  date_start: string;
  date_end: string;
  actions: ActionModel[];
  created_at?: string;
  updated_at?: string;
  status: string;
  Status?: ItemModel;
  Account?: AccountModel;
  Action?: ActionModel[];
};

export type ActionModel = {
  id: string;
  name: string;
  date: string;
  description: string;
  created_at: string;
  updated_at: string;
  creator: PersonModel;
  responsible: PersonModel;
  tag: ItemModel;
  status: ItemModel & { priority: number };
  account: AccountModel;
  campaign: CampaignModel;
};

export type CelebrationModel = {
  id: string;
  name: string;
  date: string;
  is_holiday: boolean;
};

export type ItemModel = {
  id: string;
  name: string;
  slug: string;
};

export type DayModel = {
  date: Dayjs;
  actions: ActionModel[];
  celebrations: CelebrationModel[];
  campaigns: CampaignModel[];
};

export type DropdownOptions = Array<
  { id: string; text: string; href: string } | "divider" | (() => {})
>;

export type MonthType = Array<{
  date: Dayjs;
}>;
