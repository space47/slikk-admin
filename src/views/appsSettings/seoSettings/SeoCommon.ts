export type SubLinkTypes = {
    id: number
    name: string
    url: string
    type: string
    sub_links: SubLinkTypes[] | null
}

export type PopularLinksTypes = {
    id: number
    name: string
    url: string
    type: string
    sub_links: SubLinkTypes[] | null
}
