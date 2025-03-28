export interface notionFormData {
	name: string;
	email: string;
	category: string;
	portfoolio: string;
	services: string[];
	avatar: File;
}

export interface Notiondb {
	properties: {
		Name: { title: Array<{ text: { content: string } }> };
		Field: { type: 'rich_text'; rich_text: [{ text: { content: string } }] };
		Formid: { type: 'rich_text'; rich_text: [{ text: { content: string } }] };
		Email: { type: 'email'; email: string };
		Portfolio: { type: 'url'; url: string };
		Category: { type: 'select'; select: { name: string } };
		Services: {
			type: 'multi_select';
			multi_select: [{ name: string; color: string; description: string }];
		};
		Status: { type: 'status'; status: { name: string } };
		Listed: { type: 'select'; select: { name: string } };
		id: string;
		created_time: string;
		last_edited_time: string;
	};
}

export interface NotionResponse {
	properties: {
		Name: { title: Array<{ plain_text: string }> };
		Category: { select: { name: string } };
		Services: { multi_select: Array<{ name: string }> };
		Portfolio: { url: string };
		WorksMedia: { files: Array<{ file: { url: string } }> };
	};
}

export interface APIData {
	name: string;
	category: string;
	portfolio: string;
	services: string[];
}

export interface PublicPageData {
	name: string;
	totalPages: number;
	categories: string[];
	services: string[];
}
