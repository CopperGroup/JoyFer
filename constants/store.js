export const Store = {
    name: "FO Scandinavia",
    currency: "UAH",
    currency_sign: "₴",
}

const Filter = {
    categories: [{
        categoryRef: "id",
        filterParams: [{
            name: "Width",
            type: ["Select", "Slider-unit", "Slider-number"],
        }]
    }]
}