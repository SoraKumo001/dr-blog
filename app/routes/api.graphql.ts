import { parse, serialize, type SerializeOptions } from "cookie";
import { createYoga } from "graphql-yoga";
import { type Context, db } from "../server/db";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromToken } from "~/libs/getUserFromToken";
import { schema } from "~/server/graphql/schema";
import { storage } from "~/server/libs/getStorage";


const yoga = createYoga<
  {
    request: Request;
    env: { [key: string]: string };
    responseCookies: string[];
  },
  Context
>({
  schema,
  fetchAPI: { Response },
  context: async ({ request: req, env, responseCookies }) => {
    const cookies = parse(req.headers.get("Cookie") || "");
    const token = cookies["auth-token"];
    const user = await getUserFromToken({ token, secret: env.SECRET_KEY });
    const setCookie = (
      name: string,
      value: string,
      options?: SerializeOptions
    ) => {
      const result = serialize(name, value, options);
      responseCookies.push(result);
      return result;
    };
    
    const storageService = storage({
      projectId: env.GOOGLE_PROJECT_ID ?? "",
      clientEmail: env.GOOGLE_CLIENT_EMAIL ?? "",
      privateKey: env.GOOGLE_PRIVATE_KEY ?? "",
    });

    return {
      req,
      env,
      db: db,
      user,
      cookies,
      setCookie,
      storageService,
    } as never;
  },
});

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.cloudflare.env as unknown as { [key: string]: string };
  const responseCookies: string[] = [];
  try {
    const response = await yoga.handleRequest(request, {
      request,
      env,
      responseCookies,
    });
    for (const cookie of responseCookies) {
      response.headers.append("set-cookie", cookie);
    }
    return new Response(response.body, response);
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as unknown as { [key: string]: string };
  const responseCookies: string[] = [];
  const response = await yoga.handleRequest(request, {
    request,
    env,
    responseCookies,
  });
  for (const cookie of responseCookies) {
    response.headers.append("set-cookie", cookie);
  }
  return new Response(response.body, response);
}
