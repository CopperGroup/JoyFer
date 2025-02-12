import { Store } from "@/constants/store";
import { fetchCatalog } from "@/lib/actions/redis/catalog.actions";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const filtredProducts: any[] = await fetchCatalog();

    const productEntries: MetadataRoute.Sitemap = filtredProducts.map(({ _id }) => ({
        url: `${Store.domain}/catalog/${_id}`,
    }))

    return [
        {
            url: `${Store.domain}/`
        },
        {
            url: `${Store.domain}/info/contacts`
        },
        {
            url: `${Store.domain}/info/warranty-services`
        },
        {
            url: `${Store.domain}/info/delivery-payment`
        },
        ...productEntries
    ]
}