import { Combobox } from "@headlessui/react";
import { useMatches, useNavigate, useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Fragment, useState } from "react";
import type {
  AccountModel,
  ActionModel,
  CampaignModel,
  ContextType,
} from "~/lib/models";
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
  const navigate = useNavigate();
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = matches[0].data.env;
  const supabaseClient = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const getSearch = async (query: string) => {
    if (query.length > 2) {
      setSearching(() => true);
      const [{ data: actions }, { data: campaigns }, { data: accounts }] =
        await Promise.all([
          supabaseClient.rpc("search_for_actions", {
            query: `%${query
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}%`,
          }),
          supabaseClient.rpc("search_for_campaigns", {
            query: `%${query
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}%`,
          }),
          supabaseClient.rpc("search_for_accounts", {
            query: `%${query
              .split("")
              .join("%")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}%`,
          }),
        ]);

      setItems({ actions, accounts, campaigns });
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
        className="field-default"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          getSearch(event.target.value);
        }}
      />
      {searching && (
        <div className="absolute right-4 top-3">
          <Loader />
        </div>
      )}

      <Combobox.Options className="py-4">
        {query.length > 2 ? (
          <div className="no-scrollbars max-h-[40vh] overflow-hidden overflow-y-auto">
            {/* Accounts */}
            {items.accounts.length > 0 ? (
              <div>
                <div className="px-6 py-1 text-xl font-bold tracking-wide">
                  Clientes
                </div>
                {items.accounts.map((account: AccountModel, index: number) => (
                  <Combobox.Option key={index} value={account} as={Fragment}>
                    {({ selected, active }) => (
                      <div
                        className={`dropdown-item font-medium ${
                          active || selected ? "bg-brand text-white" : ""
                        }`}
                      >
                        {account.name}
                      </div>
                    )}
                  </Combobox.Option>
                ))}
              </div>
            ) : null}
            {/* Actions */}
            {items.actions.length > 0 ? (
              <div>
                <div className="px-6 pb-1 pt-6 text-xl font-bold">Ações</div>
                {items.actions.map((action: ActionModel, index: number) => (
                  <Combobox.Option key={index} value={action} as={Fragment}>
                    {({ selected, active }) => (
                      <div
                        className={`dropdown-item font-medium ${
                          active || selected ? "bg-brand text-white" : ""
                        }`}
                      >
                        {action.name}
                      </div>
                    )}
                  </Combobox.Option>
                ))}
              </div>
            ) : null}
            {/* Campaigns */}
            {items.campaigns.length > 0 ? (
              <div>
                <div className="px-6 pb-1 pt-6 text-xl font-bold">
                  Campanhas
                </div>
                {items.campaigns.map(
                  (campaign: CampaignModel, index: number) => (
                    <Combobox.Option key={index} value={campaign} as={Fragment}>
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
            ) : null}
          </div>
        ) : (
          query.length >= 3 && (
            <div className="p-4 text-center">
              Nenhum resultado para o termo{" "}
              <strong className="font-bold">{query}</strong> foi encontrado.
            </div>
          )
        )}
      </Combobox.Options>
    </Combobox>
  );
}
