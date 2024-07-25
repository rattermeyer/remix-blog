import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createSelectSchema } from "drizzle-zod";
import {
	type MRT_ColumnDef,
	MantineReactTable,
	useMantineReactTable,
} from "mantine-react-table";
import { useMemo } from "react";
import type { z } from "zod";
import { db } from "~/db.server";
import { album_viewInChinook } from "../../drizzle/schema";

const AlbumViewSchema = createSelectSchema(album_viewInChinook);
type AlbumView = z.infer<typeof AlbumViewSchema>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const albums = await db.query.album_viewInChinook.findMany();
	return json({ albums });
};

export default function Albums() {
	const { albums } = useLoaderData<typeof loader>();
	const columns = useMemo<MRT_ColumnDef<AlbumView>[]>(
		() => [
			{
				accessorKey: "title",
				header: "Title",
				enableGrouping: false,
			},
			{
				accessorKey: "artist",
				header: "Artist",
				enableGrouping: true,
			},
			{
				accessorKey: "number_of_tracks",
				header: "Number of Tracks",
				enableGrouping: false,
			},
			{
				accessorFn: (album) =>
					`${Math.floor((album.length_milliseconds || 0) / 1000 / 60)}`,
				header: "Length in Minutes",
				enableGrouping: false,
			},
		],
		[],
	);
	const table = useMantineReactTable({
		columns,
		data: albums,
		enableGrouping: true,
	});
	return (
		<>
			<h1>Albums</h1>
			<MantineReactTable table={table} />
		</>
	);
}
