"use server";

import { ObjectId } from "mongoose";
import Category from "../models/category.model";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { ProductType } from "../types/types";
import clearCache from "./cache";
import { clearCatalogCache } from "./redis/catalog.actions";
import { deleteProduct } from "./product.actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface FetchCategoriesPropertiesParams {
  page?: number; // Current page
  limit?: number; // Items per page
  search?: string; // Search term for category name
}

export async function updateCategories(
  products: ProductType[],
  productOperation: "create" | "update" | "delete"
) {
  try {
    connectToDB();

    // Fetch all existing categories
    const existingCategories = await Category.find();
    const categoryMap = new Map(
      existingCategories.map((cat) => [cat.name, cat])
    );

    // Process products and categorize them
    const updatedCategories: Record<
      string,
      { productIds: string[]; totalValue: number }
    > = {};

    for (const product of products) {
      const categoryName = product.category;
      const price = product.priceToShow || 0;

      // Initialize the category in the updated map if not already present
      if (!updatedCategories[categoryName]) {
        const existingCategory = categoryMap.get(categoryName);
        updatedCategories[categoryName] = {
          productIds: existingCategory ? [...existingCategory.products] : [],
          totalValue: existingCategory ? existingCategory.totalValue : 0,
        };
      }

      // Perform operations based on the type
      const category = updatedCategories[categoryName];
      if (productOperation === "create" || productOperation === "update") {
        if (!category.productIds.includes(product._id)) {
          category.productIds.push(product._id);
          category.totalValue += price;
        }
      } else if (productOperation === "delete") {
        const index = category.productIds.indexOf(product._id);
        if (index !== -1) {
          category.productIds.splice(index, 1);
          category.totalValue -= price;
        }
      }
    }

    // Prepare data for database operations
    const categoryOps = Object.entries(updatedCategories).map(
      async ([name, { productIds, totalValue }]) => {
        if (categoryMap.has(name)) {
          // Update existing category
          await Category.updateOne(
            { name },
            { products: productIds, totalValue }
          );
        } else if (productOperation === "create" || productOperation === "update") {
          // Create new category
          await Category.create({ name, products: productIds, totalValue });
        }
      }
    );

    // Execute database operations
    await Promise.all(categoryOps);

    // Clear cache if relevant
    clearCache("updateProduct");
  } catch (error: any) {
    throw new Error(
      `Error updating categories with products: ${error.message}`
    );
  }
}

export async function fetchCategoriesProperties() {
  try {
    connectToDB();

    // const skip = (page - 1) * limit;

    // const query = search
    //   ? { name: { $regex: search, $options: "i" } }
    //   : {};

    const categories = await Category.find()
      .populate("products")

    const categoriesList = categories.map((category) => {
      const totalProducts = category.products.length;
      const totalValue = category.totalValue || 0; // Use the existing `totalValue` field
      const averageProductPrice =
        totalProducts > 0 ? parseFloat((totalValue / totalProducts).toFixed(2)) : 0;

      return {
        category: {name: category.name, _id: category._id},
        values: {
          totalProducts,
          totalValue,
          averageProductPrice,
          stringifiedProducts: JSON.stringify(category.products),
        },
      };
    });

    return categoriesList;
  } catch (error: any) {
    throw new Error(`Error fetching categories properties: ${error.message}`);
  }
}

export async function fetchCategory({ categoryId }: { categoryId: string }) {
  try {
    connectToDB();

    // Fetch the category by its ID and populate its products
    const categoryData = await Category.findById(categoryId).populate("products");

    if (!categoryData) {
      throw new Error("Category not found");
    }

    const products = categoryData.products;
    const category = {
      _id: categoryData._id,
      categoryName: categoryData.name,
      totalProducts: 0,
      totalValue: 0,
      averageProductPrice: 0,
      averageDiscountPercentage: 0,
    };

    let totalPriceWithoutDiscount = 0;

    for (const product of products) {
      category.totalProducts += 1;
      category.totalValue += product.priceToShow;
      totalPriceWithoutDiscount += product.price;
    }

    category.averageProductPrice =
      category.totalProducts !== 0 ? category.totalValue / category.totalProducts : 0;

    category.averageDiscountPercentage = 100 - parseInt(
      (
        (totalPriceWithoutDiscount !== 0
          ? category.totalValue / totalPriceWithoutDiscount
          : 0) * 100
      ).toFixed(0)
    );

    return { ...category, stringifiedProducts: JSON.stringify(products) };
  } catch (error: any) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
}

export async function setCategoryDiscount({categoryId, percentage}: {categoryId: string, percentage: number}) {
  try {
    connectToDB();

    // Fetch the category by its ID and populate its products

    console.log(percentage)
    const category = await Category.findById(categoryId).populate("products");

    if (!category) {
      throw new Error("Category not found");
    }

    const products = category.products;
    let totalValue = 0;
    for (const product of products) {
      const priceWithDiscount = product.price - product.price * (percentage / 100);
      product.priceToShow = priceWithDiscount;

      await product.save();
      totalValue += priceWithDiscount
    }

    // Clear the cache after updating product prices
    await clearCatalogCache();
    clearCache("updateProduct");

  } catch (error: any) {
    throw new Error(`Error changing discount for all the products in the category: ${error.message}`);
  }
}

export async function changeCategoryName({ categoryId, newName }: { categoryId: string, newName: string }) {
  try {
    connectToDB();

    // Find the category by its _id
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    // Update the category name
    category.name = newName;
    await category.save();

    // Update the category name in all associated products
    await Product.updateMany(
      { _id: { $in: category.products } }, // Find products linked to this category
      { $set: { category: newName } } // Update their category name
    );

    await clearCatalogCache();

    clearCache("updateProduct");
  } catch (error: any) {
    throw new Error(`Error changing category's name: ${error.message}`);
  }
}

export async function moveProductsToCategory({
  initialCategoryId,
  targetCategoryId,
  productIds,
}: {
  initialCategoryId: string;
  targetCategoryId: string;
  productIds: string[];
}) {
  try {
    connectToDB();

    const initialCategory = await Category.findById(initialCategoryId);
    if (!initialCategory) {
      throw new Error(`Initial category with ID ${initialCategoryId} not found`);
    }

    const targetCategory = await Category.findById(targetCategoryId);
    if (!targetCategory) {
      throw new Error(`Target category with ID ${targetCategoryId} not found`);
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { category: targetCategory.name } }
    );

    initialCategory.products = initialCategory.products.filter(
      (productId: string) => !productIds.includes(productId.toString())
    );
    await initialCategory.save();

    targetCategory.products.push(...productIds);
    await targetCategory.save();

    await clearCatalogCache();
    clearCache("updateProduct");
    revalidatePath(`/admin/categories/edit/${initialCategoryId}`)
  } catch (error: any) {
    throw new Error(`Error moving products to another category: ${error.message}`);
  }
}

export async function getCategoriesNamesAndIds(): Promise<{ name: string; categoryId: string; }[]> {
  try {
    connectToDB();

    const categories = await Category.find();

    const categoriesNamesAndIdsArray = categories.map(category => ({ name: category.name, categoryId: category._id}))

    return categoriesNamesAndIdsArray
  } catch (error: any) {
    throw new Error(`Error fetching all categories names an _ids: ${error.message}`)
  }
}

export async function createNewCategory({ name, products, previousCategoryId }: { name: string, products: ProductType[], previousCategoryId?: string }) {
  try {
    connectToDB();

    const productIds = products.map(product => product._id);

    if(previousCategoryId) {
      const previousCategory = await Category.findById(previousCategoryId);

      previousCategory.products = previousCategory.products.filter(
        (product: ObjectId) => !productIds.includes(product.toString())
      );
      
      await previousCategory.save();

      revalidatePath(`/admin/categories/edit/${previousCategoryId}`)
    }

    const totalValue = products.reduce((sum, product) => sum + product.priceToShow, 0);

    const createdCategory = await Category.create({
      name,
      totalValue,
      products: productIds
    })

  } catch (error: any) {
    throw new Error(`Error creating new category: ${error.message}`)
  }
}

type DeleteCategoryProps = {
  categoryId: string;
  removeProducts: boolean
};

export async function deleteCategory(props: DeleteCategoryProps) {
    try {
        await connectToDB();

        const category = await Category.findById(props.categoryId).populate("products");

        if (!category) {
            throw new Error("Category not found.");
        }

        const productIds: string[] = category.products.map((product: any) => product._id.toString());

        if (props.removeProducts) {
            for (const productId of productIds) {
                await deleteProduct({ product_id: productId });
            }
        }
        await Category.findByIdAndDelete(props.categoryId);

        // Clear cache
        await clearCatalogCache();
        clearCache("updateProduct");
    } catch (error: any) {
        throw new Error(`Error deleting category: ${error.message}`);
    }
}
export async function fetchCategoriesProducts(categoryId: string, type?: 'json') {
  try {
    // Connect to the database
    await connectToDB();

    // Find the category by _id
    const category = await Category.findById(categoryId).populate('products');

    if (!category) {
      throw new Error('Category not found');
    }

    const products = category.products;

    // Return the products in the specified format
    if (type === 'json') {
      return JSON.stringify(products);
    } else {
      return products;
    }
  } catch (error: any) {
    throw new Error(`Error fetching category products: ${error.message}`);
  }
}

