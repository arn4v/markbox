---
title: Data Models
seo_title: Data Models
layout: "../../components/DocsLayout"
---

## Bookmark

```typescript
type Bookmark = {
	id: string;
	title: string;
	url: string;
	tags: Tag[];
	createdAt: string;
	updatedAt: string;
};
```

## Tag

```typescript
export type Tag = {
	id: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
};
```

For the full database schema refer to [prisma.schema](https://github.com/arn4v/bookmarky/blob/main/prisma/schema.prisma)
