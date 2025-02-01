"use server";

import Filter from "../models/filter.model";
import { connectToDB } from "../mongoose";
import { CreateFilterProps, FilterType } from "../types/types";

export async function fetchFilter(): Promise<FilterType>;
export async function fetchFilter(type: 'json'): Promise<string>;

export async function fetchFilter(type?: 'json') {
   try {
    connectToDB()

    const filter = await Filter.findOne();
      
    if(type === 'json'){
      return JSON.stringify(filter)
    } else {
      return filter
    }
   } catch (error: any) {
     throw new Error(`${error.message}`)
   }
}

export async function createFilter(categoriesObject: CreateFilterProps): Promise<FilterType>;
export async function createFilter(categoriesObject: CreateFilterProps, type: 'json'): Promise<string>;

export async function createFilter(categoriesObject: CreateFilterProps, type?: 'json') {
  try {
    await connectToDB();

    const constructFilterCategories = (data: CreateFilterProps) => {
      return Object.entries(data).map(([categoryId, categoryData]) => ({
        categoryId,
        params: Object.values(categoryData.params).map(param => ({
          name: param.name,
          totalProducts: param.totalProducts,
          type: param.type,
        })),
      }));
    };

    const categories = constructFilterCategories(categoriesObject);

    // Ensure only one filter exists
    let filter = await Filter.findOne(); // Check if a filter document exists

    if (filter) {
      // Update the existing filter
      filter.categories = categories;
      await filter.save();
    } else {
      // Create a new filter if none exists
      filter = await Filter.create({ categories });
    }

    return type === 'json' ? JSON.stringify(filter) : filter;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}
