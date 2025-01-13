import { DOMParser } from "xmldom";
import { replaceDescription } from "../utils";
import getTagsMap from "./getTagsMap";
import { Config, ProductType } from "../types/types";

interface CreateUrlParams {
    _id?: string,
    id: string | null,
    name: string | null,
    isAvailable: boolean,
    quantity: number,
    url: string | null,
    priceToShow: number,
    price: number,
    images: (string | null)[],
    vendor: string | null,
    description: string | null,
    params: {
        name: string | null,
        value: string | null
    }[],
    category:string,
    isFetched: boolean,
}

type GetElementDataConfig = {
  parent: Element;
  value: string;
  attributeOf?: string;
  many?: boolean;
};

function getElementData(config: GetElementDataConfig): Element | Element[] | string | string[] | null {
  const { parent, value, attributeOf, many } = config;

  if (attributeOf) {
    // If `attributeOf` matches the parent's tag name, fetch the parent's attribute
    if (attributeOf === parent.tagName) {
      return parent.getAttribute(value); // Return the attribute value of the parent
    } else {
      // Otherwise, fetch child elements based on `attributeOf`
      const elements = Array.from(parent.getElementsByTagName(attributeOf));
      if (value === "Content") {
        if (!many) {
          return elements[0]?.textContent?.trim() || null; // Single element's textContent
        }
        return elements.map((el) => el.textContent?.trim() || "").filter(Boolean); // All matching textContent
      } else {
        if (!many) {
          return elements[0]?.getAttribute(value) || null; // Single element's attribute
        }
        return elements.map((el) => el.getAttribute(value)).filter(Boolean) as string[]; // All matching attributes
      }
    }
  } else {
    // No `attributeOf`, fetch child elements based on `value`
    const elements = Array.from(parent.getElementsByTagName(value));
    if (value === "Content") {
      
      return parent?.textContent?.trim() || null; // Single element's textContent
    } else {
      if (!many) {
        return elements[0] || null; // Single element
      }
      return elements; // All matching elements
    }
  }
}




export default function getProductsData(xmlString: string, config: Config) {
  if (!xmlString) {
    console.log("No XML data found");
    return null;
  }

  const xmlDocument = new DOMParser().parseFromString(xmlString, "text/xml");

  // const product = xmlDocument.getElementsByTagName("offer")[0];
  // if (!product) {
  //   console.log("No product data found in the XML");
  //   return null;
  // }

  const categories = [] as { name: string, id: string, ref: string}[];
  const categoriesElements = getElementData({...config.paths.Start.categories, parent: xmlDocument.documentElement, many: true}) as Element[];

  for (let i = 0; i < categoriesElements.length; i++) {
    const categoryElement = categoriesElements[i];

    const name = getElementData({...config.paths.Categories.name, parent: categoryElement}) as string;
    const id = getElementData({...config.paths.Categories.category_id, parent: categoryElement}) as string;
    const ref = getElementData({...config.paths.Categories.reference_by, parent: categoryElement}) as string;
    categories.push({ name, id, ref })
  }

  const products = getElementData({...config.paths.Start.products, parent: xmlDocument.documentElement, many: true}) as Element[];

  if (!products) {
     console.log("No product data found in the XML");
     return null;
  }

  const result: CreateUrlParams[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    // // Extract attributes and elements
    const id = getElementData({...config.paths.Products.id, parent: product }) as string;
    const isAvailableValue = getElementData({...config.paths.Products.available, parent: product }) as string;
    const quantityElement = getElementData({...config.paths.Products.quantity, parent: product }) as Element;
    const urlElement = getElementData({...config.paths.Products.url, parent: product }) as Element;
    const priceToShowElement = getElementData({...config.paths.Products.discount_price, parent: product }) as Element;
    const priceElement = getElementData({...config.paths.Products.price, parent: product }) as Element;
    const imagesElements = getElementData({...config.paths.Products.images, parent: product, many: true }) as Element[];
    const vendorElement = getElementData({...config.paths.Products.vendor, parent: product }) as Element;
    const nameElement = getElementData({...config.paths.Products.name, parent: product }) as Element;
    const descriptionElement = getElementData({...config.paths.Products.description, parent: product }) as Element;
    const paramsElements = getElementData({...config.paths.Products.params, parent: product, many: true }) as Element[];
    const categoryIdElement = getElementData({...config.paths.Products.category, parent: product }) as Element;
  
    // const isAvailableAttribute = product.getAttribute("available");
    // const quantityElement = product.getElementsByTagName("stock_quantity")[0];
    // const urlElement = product.getElementsByTagName("url")[0];
    // const priceToShowElement = product.getElementsByTagName("price")[0];
    // const priceElement = product.getElementsByTagName("price_old")[0];
    // const categoryIdElement = product.getElementsByTagName("categoryId")[0];
    // const imagesElements = product.getElementsByTagName("picture");
    // const vendorElement = product.getElementsByTagName("vendor")[0];
    // const nameElement = product.getElementsByTagName("name_ua")[0] || product.getElementsByTagName("name")[0];
    // const descriptionElement = product.getElementsByTagName("description_ua")[0] || product.getElementsByTagName("description")[0];
    // const paramElements = product.getElementsByTagName("param");
  
    const images: string[] = [];
    const params: { name: string; value: string}[] = [];
  
    const isAvailable = isAvailableValue === "true";
    const quantity = quantityElement ? parseFloat(quantityElement.textContent || "0") : 0;
    const url = urlElement ? urlElement.textContent : "" as string;
    const priceToShow = priceToShowElement ? parseFloat(priceToShowElement.textContent || "0") : 0;
    let price = priceElement ? parseFloat(priceElement.textContent || "0") : 0;
    if (price === 0 || price === null) {
      price = priceToShow;
    }
    const categoryId = categoryIdElement ? categoryIdElement.textContent : "";
    const vendor = vendorElement ? vendorElement.textContent : "" as string;
    const name = nameElement ? nameElement.textContent : "" as string;
    const description = descriptionElement ? replaceDescription(descriptionElement.textContent || "") : "" as string;
  
  
    // Determine category
  
    let category = "";
    if (categoryId) {
      category = categories.filter(category => category.ref === categoryId)[0]?.name;
    }
  
    // Collect images
    for (let i = 0; i < imagesElements.length; i++) {
       const image = imagesElements[i].textContent;
       if (image) images.push(image);
    }
  
    for (let i = 0; i < paramsElements.length; i++) {
      const paramElement = paramsElements[i];
  
      const name = getElementData({...config.paths.Params.name, parent: paramElement}) as string;
      const value = getElementData({...config.paths.Params.value, parent: paramElement}) as string;
  
      if(name) {
          params.push({ name, value: value ? value : "Не вказано"})
      }
    }
  
    // // Collect and organize parameters
    // let widthParam = null;
    // let heightParam = null;
    // let modelParam = null;
    // let deepParam = null;
    // let typeParam = null;
    // let colorParam = null;
  
    // for (let i = 0; i < paramElements.length; i++) {
    //   const paramName = paramElements[i].getAttribute("name");
    //   const paramValue = paramElements[i].textContent || null; // Default to `null` if `textContent` is `undefined`
    
    //   if (["Ширина, см", "Width, cm"].includes(paramName || "")) {
    //     widthParam = { name: paramName, value: paramValue };
    //   } else if (["Висота, см", "Height, cm"].includes(paramName || "")) {
    //     heightParam = { name: paramName, value: paramValue };
    //   } else if (["Артикул", "SKU"].includes(paramName || "")) {
    //     const formattedValue = paramValue?.replace(/ /g, "_") || null; // Ensure it remains `string | null`
    //     modelParam = { name: "Товар", value: formattedValue };
    //   } else if (["Глибина, см", "Depth, cm"].includes(paramName || "")) {
    //     deepParam = { name: paramName, value: paramValue };
    //   } else if (["Вид", "Kind"].includes(paramName || "")) {
    //     typeParam = { name: paramName, value: paramValue };
    //   } else if (["Колір", "Color"].includes(paramName || "")) {
    //     colorParam = { name: paramName, value: paramValue };
    //   } else {
    //     params.push({ name: paramName, value: paramValue });
    //   }
    // }
    
  
    // // Add prioritized parameters to the beginning of the params array
    // if (colorParam) params.unshift(colorParam);
    // if (typeParam) params.unshift(typeParam);
    // if (deepParam) params.unshift(deepParam);
    // if (heightParam) params.unshift(heightParam);
    // if (widthParam) params.unshift(widthParam);
    // if (modelParam) params.unshift(modelParam);
  
    // Construct the product object
    const sampleProduct = {
      id,
      name: name as string,
      isAvailable,
      quantity,
      url: url as string,
      priceToShow,
      price,
      images,
      vendor: vendor as string,
      description,
      params,
      category,
      isFetched: true,
    };

    result.push(sampleProduct)
  }

  return result;
}
