import { bindings, defineConfig } from "cf/config";

/**
 * Secret-like files were detected but not read or migrated: .dev.vars, .dev.vars.d, .env, .env.production. Only `secrets.required` entries are migrated.
 * @see https://developers.cloudflare.com/workers/configuration/secrets/
 */


export default defineConfig({
	worker: {
		name: "dr-blog",
		compatibilityDate: "2025-12-13",
		compatibilityFlags: [
			"nodejs_compat",
		],
		entrypoint: "./workers/app.ts",
		placement: {
			mode: "smart",
		},
		observability: {
			enabled: true,
		},
		env: {
			database: bindings.hyperdrive({
				id: "063e869b7f084a7a82b49f1ef8397a6c",
				dev: {
					connectionString: "postgresql://postgres:password@localhost:25432/postgres?schema=blog_drizzle",
				},
			}),
			ASSETS: bindings.assets(),
			DATABASE_URL: bindings.secret(),
			GOOGLE_PROJECT_ID: bindings.secret(),
			GOOGLE_PRIVATE_KEY: bindings.secret(),
			GOOGLE_CLIENT_EMAIL: bindings.secret(),
			NEXT_PUBLIC_projectId: bindings.secret(),
			NEXT_PUBLIC_apiKey: bindings.secret(),
			NEXT_PUBLIC_measurementId: bindings.secret(),
			NEXT_PUBLIC_OGP_URL: bindings.secret(),
			NEXT_PUBLIC_IMAGE_URL: bindings.secret(),
			SECRET_KEY: bindings.secret(),
		},
	},
});
