import { Combobox } from "@headlessui/react";
import { useMatches, useNavigate, useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import type {
  AccountModel,
  CampaignModel,
  ContextType,
  ItemModel,
} from "~/lib/models";
import { TagIcons } from "../Actions";
import Loader from "../Loader";

export default function SearchDialog() {
  const [searching, setSearching] = useState(false);
  const [items, setItems] = useState<{
    actions: any;
    accounts: any;
    campaigns: any;
  }>({ actions: [], accounts: [], campaigns: [] });
  const [query, setQuery] = useState("");
  const matches = useMatches();
  const accounts: AccountModel[] = matches[1].data.accounts;
  const status: ItemModel[] = matches[1].data.status;
  const tags: ItemModel[] = matches[1].data.tags;
  const navigate = useNavigate();
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = matches[0].data.env;
  const supabaseClient = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const getSearch = async (query: string) => {
    if (query.length > 2) {
      setSearching(() => true);
      let _accounts = accounts.filter(
        (account) =>
          account.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(query) || account.short.includes(query)
      );
      setItems({
        actions: [],
        accounts: _accounts,

        campaigns: [],
      });

      const [{ data: actions }, { data: campaigns }] = await Promise.all([
        supabaseClient.rpc("search_for_actions", {
          query: `%${query.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}%`,
        }),
        supabaseClient.rpc("search_for_campaigns", {
          query: `%${query.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}%`,
        }),
      ]);

      setItems({ actions, accounts: _accounts, campaigns });
      setSearching(() => false);
    }
  };

  const context: ContextType = useOutletContext();

  return (
    <Combobox
      as="div"
      value={undefined}
      className="relative"
      onChange={(value: any) => {
        navigate(
          "slug" in value
            ? `/dashboard/${value.slug}`
            : "actions" in value
            ? `/dashboard/${
                accounts.filter((account) => account.id === value.account)[0]
                  .slug
              }/campaign/${value.id}`
            : `/dashboard/${
                accounts.filter((account) => account.id === value.account)[0]
                  .slug
              }/action/${value.id}`
        );

        context.search.set(false);
      }}
    >
      <Combobox.Input
        className="rounded-xl bg-gray-1000 px-6 py-4 text-2xl font-medium antialiased placeholder-gray-600"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          getSearch(event.target.value);
        }}
        placeholder="Buscar..."
        autoComplete="off"
      />
      {/* {searching && (
        <div className="absolute right-4 top-3">
          <Loader />
        </div>
      )} */}

      <Combobox.Options>
        {query.length > 2 && (
          <div className="relative py-4">
            <div className="absolute left-0 right-0 top-0 h-[1px]  bg-gradient-to-r from-transparent dark:via-brand-700"></div>
            <div className="absolute left-0 right-0 top-0 h-8 bg-gradient-radial-t dark:from-brand-900/50"></div>
            <div className="no-scrollbars max-h-[40vh] overflow-hidden overflow-y-auto">
              {/* Accounts */}
              {items.accounts.length > 0 ? (
                <div>
                  <div className="px-6 py-1 text-xl font-bold tracking-wide">
                    Clientes
                  </div>
                  {items.accounts.map(
                    (account: AccountModel, index: number) => (
                      <Combobox.Option
                        key={index}
                        value={account}
                        as={Fragment}
                      >
                        {({ selected, active }) => (
                          <div
                            className={`dropdown-item flex items-center justify-between font-medium ${
                              active || selected ? "bg-brand text-white" : ""
                            }`}
                          >
                            <div>{account.name}</div>
                          </div>
                        )}
                      </Combobox.Option>
                    )
                  )}
                </div>
              ) : null}
              {/* Actions */}
              {items.actions.length > 0 ? (
                <div>
                  <div className="px-6 pb-1 pt-6 text-xl font-bold">Ações</div>
                  {items.actions.map((action: any, index: number) => (
                    <Combobox.Option key={index} value={action} as={Fragment}>
                      {({ selected, active }) => (
                        <div
                          className={`dropdown-item flex items-center justify-between gap-4 font-medium ${
                            active || selected ? "bg-brand text-white" : ""
                          }`}
                        >
                          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {action.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <div>
                              <TagIcons
                                type={
                                  tags.filter((tag) => tag.id === action.tag)[0]
                                    .slug
                                }
                                className="h-4 w-4"
                              />
                            </div>
                            <div
                              className={`bg-${
                                status.filter(
                                  (status) => status.id === action.status
                                )[0].slug
                              } text-xx rounded-lg px-1 py-0.5 uppercase`}
                            >
                              {
                                status.filter(
                                  (status) => status.id === action.status
                                )[0].name
                              }
                            </div>
                            <div className="text-xx font-bold uppercase">
                              {
                                accounts.filter(
                                  (account) => account.id === action.account
                                )[0].short
                              }
                            </div>
                            <div className="text-xx whitespace-nowrap">
                              {dayjs(action.date).format(
                                "DD[/]MM [às] HH[:]mm"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Combobox.Option>
                  ))}
                </div>
              ) : (
                searching && (
                  <div className="flex items-center justify-center gap-4 p-4">
                    <Loader size="small" />
                    <div>Procurando por Ações</div>
                  </div>
                )
              )}
              {/* Campaigns */}
              {items.campaigns.length > 0 ? (
                <div>
                  <div className="px-6 pb-1 pt-6 text-xl font-bold">
                    Campanhas
                  </div>
                  {items.campaigns.map(
                    (campaign: CampaignModel, index: number) => (
                      <Combobox.Option
                        key={index}
                        value={campaign}
                        as={Fragment}
                      >
                        {({ selected, active }) => (
                          <div
                            className={`dropdown-item font-medium ${
                              active || selected ? "bg-brand text-white" : ""
                            }`}
                          >
                            {campaign.name}
                          </div>
                        )}
                      </Combobox.Option>
                    )
                  )}
                </div>
              ) : (
                searching && (
                  <div className="flex items-center justify-center gap-4 p-4">
                    <Loader size="small" />
                    <div>Procurando por campanhas</div>
                  </div>
                )
              )}
              {!searching &&
                query.length > 2 &&
                items.actions.length === 0 &&
                items.campaigns.length === 0 &&
                items.accounts.length === 0 && (
                  <div className="p-4 text-center">
                    Nenhum resultado para o termo{" "}
                    <strong className="font-bold">{query}</strong> foi
                    encontrado.
                  </div>
                )}
            </div>
          </div>
        )}
      </Combobox.Options>
    </Combobox>
  );
}
