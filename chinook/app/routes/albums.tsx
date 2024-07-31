import {json, type LoaderFunctionArgs, redirect} from "@remix-run/node";
import {Outlet, useLoaderData, useNavigate} from "@remix-run/react";
import {createSelectSchema} from "drizzle-zod";
import {useState} from "react";
import type {z} from "zod";
import {db} from "~/db.server";
import {album_viewInChinook} from "../../drizzle/schema";
import {Select} from '@mantine/core';

const AlbumViewSchema = createSelectSchema(album_viewInChinook);
type AlbumView = z.infer<typeof AlbumViewSchema>;

export const loader = async ({request}: LoaderFunctionArgs) => {
    const {searchParams} = new URL(request.url);
    const albums = await db.query.album_viewInChinook.findMany();
    if (searchParams.has('album')) {
        return redirect(`/albums/${searchParams.get('album')}/tracks#tracks`);
    }
    return json({albums});
};

export default function Albums() {
    const {albums} = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    function getAlbum(selectedAlbum: string | null): AlbumView | undefined {
        return albums.find((album) => album.album_id === parseInt(selectedAlbum || '0'));
    }

    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);

    const groupedAlbums = groupBy(albums, a => a.artist || 'Unknown');
    const comboBoxData = Object.keys(groupedAlbums).map((artist) => ({
        group: artist,
        items: groupedAlbums[artist].map((album) => ({
            label: album.title || 'Unknown',
            value: String(album.album_id),
        }))
    }));

    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

    return (
        <>
            <h1>Albums</h1>

            <Select data={[...comboBoxData]} placeholder={"Pick an album"} searchable name={"album"}
                    value={selectedAlbum}
                    onChange={(value) => {
                        setSelectedAlbum(value)
                        const album = getAlbum(value)
                        album ? navigate(`/albums/${album?.album_id}/tracks`) : navigate(`/albums`)
                    }}
                    label={"Albums"}
                    clearable
            />
            <Outlet/>
        </>
    );
}
