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
  actions: string[] | ActionModel[];
};

export type ActionModel = {
  id: string;
  name: string;
  date: string;
  account?: string;
  tag?: string;
  status?: string;
  description?: string;
  date_end?: string;
  created_at?: string;
  updated_at?: string;
  position?: 1 | 2 | 3;
};

export type ActionModelFull = {
  id: string;
  name: string;
  date: string;
  account?: AccountModel;
  tag: ItemModel;
  status: ItemModel;
  description?: string;
  date_end?: string;
  created_at?: string;
  updated_at?: string;
};

export type ItemModel = {
  id: string;
  name: string;
  slug: string;
};

export type DayModel = {
  date: Date;
  holidays: ActionModel[];
  actions: ActionModel[];
};

export type DropdownOptions = Array<
  { id: string; text: string; href: string } | "divider" | (() => {})
>;
