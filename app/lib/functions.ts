import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type {
  AccountModel,
  ActionModel,
  ItemModel,
  MonthType,
} from "~/lib/models";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Fortaleza");

export const getPeriod = ({ period }: { period?: string | null }) => {
  const day = dayjs(period ?? new Date());

  const firstDayOfCurrentMonth = day.startOf("month");
  const lastDayOfCurrentMonth = day.endOf("month");
  const firstDayOfPeriod = firstDayOfCurrentMonth.startOf("week");
  const lastDayOfPeriod = lastDayOfCurrentMonth.endOf("week");
  const days: Array<Dayjs> = [];
  const diffDays = lastDayOfPeriod.diff(firstDayOfPeriod, "days") + 1;

  for (let index = 0; index < diffDays; index++) {
    days.push(firstDayOfPeriod.add(index, "day"));
  }

  return {
    firstDayOfCurrentMonth,
    lastDayOfCurrentMonth,
    firstDayOfPeriod,
    lastDayOfPeriod,
    days,
  };
};

export const getYear = (currentDate: Dayjs) => {
  const firstDayOfCurrentYear = currentDate.startOf("year");

  const year: Array<MonthType> = [];

  function getDaysOnMonth(month: number) {
    const Month = dayjs().month(month);
    const First = Month.startOf("month");
    const Last = Month.endOf("month");
    return Last.diff(First, "days") + 1;
  }

  for (let month = 0; month < 12; month++) {
    let current = firstDayOfCurrentYear.add(month, "month").clone();
    const Month: MonthType = [];
    for (let day = 0; day < getDaysOnMonth(month); day++) {
      Month.push({ date: current.add(day, "day") });
    }
    year.push(Month);
  }

  return { firstDayOfCurrentYear, year };
};

export function actionsByPriority(actions: ActionModel[]) {
  return actions.sort((a, b) =>
    a.status.priority > b.status.priority ? -1 : 1
  );
}

export function actionsByCategory(actions: ActionModel[], tags: ItemModel[]) {
  const categories = tags.map((tag, index) => {
    let category: { tag: ItemModel; actions: ActionModel[] } = {
      tag: tag,
      actions: [],
    };

    let _actions = actionsByPriority(
      actions.filter((action) => action.tag.slug === tag.slug)
    );

    category.actions = _actions;

    return category;
  });

  return categories;
}
export function actionsByAccount(
  actions: ActionModel[],
  accounts: AccountModel[]
) {
  const _accounts = accounts.map((_account, index) => {
    let accountGroup: { account: AccountModel; actions: ActionModel[] } = {
      account: _account,
      actions: [],
    };
    let _actions = actionsByPriority(
      actions.filter((action) => action.account.id === _account.id)
    );
    accountGroup.actions = _actions;
    return accountGroup;
  });
  return _accounts;
}

export function shortWord(word: string) {
  return `${word[0]}${word
    .substring(1)
    .toLowerCase()
    .replace(/[aeiouáí]/g, "")}`;
}
