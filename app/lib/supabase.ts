import { createServerClient } from "@supabase/auth-helpers-remix";

// export const supabase = createClient(
//   "https://prmvfibheijucdazdfzc.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY4MzI1MCwiZXhwIjoxOTU5MjU5MjUwfQ.ElgtQJthx_B3DM_zIL2acASAo_J_F9HclpLDv1m_hQ0",
//   {
//     global: {
//       fetch: fetch.bind(self),
//     },
//   }
// );

export const getSupabase = (request: Request) => {
  const response = new Response();
  return {
    supabase: createServerClient(
      "https://prmvfibheijucdazdfzc.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY4MzI1MCwiZXhwIjoxOTU5MjU5MjUwfQ.ElgtQJthx_B3DM_zIL2acASAo_J_F9HclpLDv1m_hQ0",
      {
        request,
        response,
      }
    ),
    response,
  };
};
