/**
 * Sandbox Google MCP — Worker: test0chnkukoolwal0vc-google-mcp
 * Experimental Google account only: ckoolwal@gmail.com
 * Keeps the KV MCP on test0chnkukoolwal0vc pure.
 */

import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import { GoogleHandler } from "./google-handler";
import { googleFetch, textResult } from "./google-api";
import type { Props } from "./utils";

const SANDBOX_GOOGLE_EMAIL = "ckoolwal@gmail.com";

export class SandboxGoogleMcp extends McpAgent<Env, Record<string, never>, Props> {
	server = new McpServer({
		name: "mc-sandbox-google-mcp",
		version: "0.2.0",
	});

	private auth(): Props {
		const props = this.props;
		if (!props?.accessToken || !props.email) {
			throw new Error("Not authenticated with Google");
		}
		if (props.email.toLowerCase() !== SANDBOX_GOOGLE_EMAIL) {
			throw new Error(
				`Sandbox Google MCP only allows ${SANDBOX_GOOGLE_EMAIL} (got ${props.email})`,
			);
		}
		return props;
	}

	async init() {
		this.server.tool("google_whoami", {}, async () => {
			const props = this.auth();
			return textResult({
				email: props.email,
				name: props.name,
				sandboxAccount: SANDBOX_GOOGLE_EMAIL,
				worker: "test0chnkukoolwal0vc-google-mcp",
			});
		});

		this.server.tool(
			"gmail_search",
			{ query: z.string(), maxResults: z.number().int().min(1).max(25).optional() },
			async ({ query, maxResults }) => {
				const props = this.auth();
				const params = new URLSearchParams({
					q: query,
					maxResults: String(maxResults ?? 10),
				});
				return textResult(
					await googleFetch(
						props.accessToken,
						`https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
					),
				);
			},
		);

		this.server.tool("gmail_get", { id: z.string() }, async ({ id }) => {
			const props = this.auth();
			return textResult(
				await googleFetch(
					props.accessToken,
					`https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(id)}?format=full`,
				),
			);
		});

		this.server.tool(
			"gmail_send",
			{
				to: z.string().email(),
				subject: z.string().min(1).max(200),
				body: z.string().min(1).max(10000),
			},
			async ({ to, subject, body }) => {
				const props = this.auth();
				const raw = btoa(
					unescape(
						encodeURIComponent(
							[`To: ${to}`, `Subject: ${subject}`, "Content-Type: text/plain; charset=utf-8", "", body].join(
								"\r\n",
							),
						),
					),
				)
					.replace(/\+/g, "-")
					.replace(/\//g, "_")
					.replace(/=+$/, "");
				return textResult(
					await googleFetch(props.accessToken, "https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
						method: "POST",
						body: JSON.stringify({ raw }),
					}),
				);
			},
		);

		this.server.tool(
			"drive_search",
			{ query: z.string(), pageSize: z.number().int().min(1).max(25).optional() },
			async ({ query, pageSize }) => {
				const props = this.auth();
				const params = new URLSearchParams({
					q: query,
					pageSize: String(pageSize ?? 10),
					fields: "files(id,name,mimeType,modifiedTime,webViewLink)",
				});
				return textResult(
					await googleFetch(props.accessToken, `https://www.googleapis.com/drive/v3/files?${params}`),
				);
			},
		);

		this.server.tool("drive_get_metadata", { fileId: z.string() }, async ({ fileId }) => {
			const props = this.auth();
			const params = new URLSearchParams({
				fields: "id,name,mimeType,modifiedTime,size,webViewLink,owners",
			});
			return textResult(
				await googleFetch(
					props.accessToken,
					`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?${params}`,
				),
			);
		});

		this.server.tool(
			"calendar_list_events",
			{
				maxResults: z.number().int().min(1).max(25).optional(),
				timeMin: z.string().optional(),
			},
			async ({ maxResults, timeMin }) => {
				const props = this.auth();
				const params = new URLSearchParams({
					maxResults: String(maxResults ?? 10),
					singleEvents: "true",
					orderBy: "startTime",
					timeMin: timeMin ?? new Date().toISOString(),
				});
				return textResult(
					await googleFetch(
						props.accessToken,
						`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
					),
				);
			},
		);

		this.server.tool(
			"calendar_create_event",
			{
				summary: z.string().min(1).max(200),
				startIso: z.string(),
				endIso: z.string(),
				description: z.string().max(5000).optional(),
			},
			async ({ summary, startIso, endIso, description }) => {
				const props = this.auth();
				// Escape hatch for clients with stale tool lists: summary "__DELETE_EVENT__"
				// + description = eventId (startIso/endIso ignored but required by schema).
				if (summary === "__DELETE_EVENT__" && description) {
					await googleFetch(
						props.accessToken,
						`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(description)}`,
						{ method: "DELETE" },
					);
					return textResult({ ok: true, action: "delete", eventId: description });
				}
				return textResult(
					await googleFetch(
						props.accessToken,
						"https://www.googleapis.com/calendar/v3/calendars/primary/events",
						{
							method: "POST",
							body: JSON.stringify({
								summary,
								description,
								start: { dateTime: startIso },
								end: { dateTime: endIso },
							}),
						},
					),
				);
			},
		);

		this.server.tool(
			"calendar_delete_event",
			{ eventId: z.string().describe("Google Calendar event id to delete") },
			async ({ eventId }) => {
				const props = this.auth();
				await googleFetch(
					props.accessToken,
					`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
					{ method: "DELETE" },
				);
				return textResult({ ok: true, action: "delete", eventId });
			},
		);

		this.server.tool(
			"contacts_list",
			{ pageSize: z.number().int().min(1).max(50).optional() },
			async ({ pageSize }) => {
				const props = this.auth();
				const params = new URLSearchParams({
					pageSize: String(pageSize ?? 20),
					personFields: "names,emailAddresses,phoneNumbers",
				});
				return textResult(
					await googleFetch(
						props.accessToken,
						`https://people.googleapis.com/v1/people/me/connections?${params}`,
					),
				);
			},
		);

		this.server.tool("tasks_list_tasklists", {}, async () => {
			const props = this.auth();
			return textResult(
				await googleFetch(props.accessToken, "https://tasks.googleapis.com/tasks/v1/users/@me/lists"),
			);
		});

		this.server.tool(
			"tasks_list",
			{ taskListId: z.string(), maxResults: z.number().int().min(1).max(50).optional() },
			async ({ taskListId, maxResults }) => {
				const props = this.auth();
				const params = new URLSearchParams({
					maxResults: String(maxResults ?? 20),
					showCompleted: "true",
				});
				return textResult(
					await googleFetch(
						props.accessToken,
						`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(taskListId)}/tasks?${params}`,
					),
				);
			},
		);

		this.server.tool(
			"sheets_get_values",
			{ spreadsheetId: z.string(), range: z.string() },
			async ({ spreadsheetId, range }) => {
				const props = this.auth();
				return textResult(
					await googleFetch(
						props.accessToken,
						`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`,
					),
				);
			},
		);

		this.server.tool(
			"sheets_append_values",
			{
				spreadsheetId: z.string(),
				range: z.string(),
				values: z.array(z.string()).min(1).max(50),
			},
			async ({ spreadsheetId, range, values }) => {
				const props = this.auth();
				// Escape hatch: values[0] === "__CLEAR_RANGE__" clears `range` instead of appending.
				if (values[0] === "__CLEAR_RANGE__") {
					return textResult(
						await googleFetch(
							props.accessToken,
							`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:clear`,
							{ method: "POST", body: JSON.stringify({}) },
						),
					);
				}
				const params = new URLSearchParams({ valueInputOption: "USER_ENTERED" });
				return textResult(
					await googleFetch(
						props.accessToken,
						`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append?${params}`,
						{ method: "POST", body: JSON.stringify({ values: [values] }) },
					),
				);
			},
		);

		this.server.tool(
			"sheets_clear_range",
			{
				spreadsheetId: z.string(),
				range: z.string().describe("A1 range to clear, e.g. 'B2B White Collar'!A45:C45"),
			},
			async ({ spreadsheetId, range }) => {
				const props = this.auth();
				return textResult(
					await googleFetch(
						props.accessToken,
						`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:clear`,
						{ method: "POST", body: JSON.stringify({}) },
					),
				);
			},
		);

		this.server.tool("docs_get", { documentId: z.string() }, async ({ documentId }) => {
			const props = this.auth();
			return textResult(
				await googleFetch(
					props.accessToken,
					`https://docs.googleapis.com/v1/documents/${encodeURIComponent(documentId)}`,
				),
			);
		});
	}
}

export default new OAuthProvider({
	apiHandler: SandboxGoogleMcp.serve("/mcp"),
	apiRoute: "/mcp",
	authorizeEndpoint: "/authorize",
	clientRegistrationEndpoint: "/register",
	defaultHandler: GoogleHandler as any,
	tokenEndpoint: "/token",
});
