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
};

export type ActionModel = {
  id: string;
  name: string;
  date: string;
  account?: string;
  tag?: string;
  status?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  Account?: AccountModel;
  Tag?: ItemModel;
  Status?: ItemModel;
};

export type ActionModelFull = {
  id: string;
  name: string;
  date: string;
  account?: AccountModel;
  tag: ItemModel;
  status: ItemModel;
  description?: string;
  campaign?: CampaignModel;
  created_at: string;
  updated_at: string;
  creator: PersonModel;
  responsible: PersonModel;
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
