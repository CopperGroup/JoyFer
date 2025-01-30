import { fetchCategoriesParams } from "@/lib/actions/categories.actions";

const Page = async () => {

    const categoriesParams = await fetchCategoriesParams("json");

    console.log(categoriesParams);
    
    return (
        <section className="px-10 py-20 w-full max-[360px]:px-4">
            <h1 className="text-heading1-bold drop-shadow-text-blue">Налаштування фільтру</h1>

        </section>
    )
}

export default Page