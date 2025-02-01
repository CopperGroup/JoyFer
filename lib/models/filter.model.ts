import mongoose from "mongoose";

const filterSchema = new mongoose.Schema({
    categories: [
        {
            categoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Categoty"
            },
            params: [
                {
                    name: {
                        type: String
                    },
                    totalProducts: {
                        type: Number
                    },
                    type: {
                        type: String
                    }
                }
            ]
        }
    ]
})

const Filter = mongoose.models.Filter || mongoose.model("Filter", filterSchema);

export default Filter;