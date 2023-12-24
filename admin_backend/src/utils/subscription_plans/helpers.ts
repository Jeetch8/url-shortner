interface ProductPlan {
  validity: number;
  price: number;
  price_id: string;
}

interface ProductPlans {
  monthly: ProductPlan;
  annual: ProductPlan;
}

interface ProductFeatures {
  link_generation: number | string;
  landing_page: number | string;
  custom_domains: number | string;
  link_redirects: boolean;
  link_expiration: boolean;
  link_stats: boolean;
  link_cloaking: boolean;
  referrer_hiding: boolean;
  region_targeting: boolean;
  device_targeting: boolean;
  link_password_protection: boolean;
  export_clicks_data: boolean;
  team_members: number;
  workspaces: number;
  custom_404_redirect: boolean;
  bulk_create_links: boolean;
  link_export: boolean;
}

export interface Product {
  product_name: string;
  db_product_title: string;
  product_id: string;
  plans: ProductPlans;
  features: ProductFeatures;
}

import {
  BadRequestError,
  InternalServerError,
} from "@shared/utils/CustomErrors";
import { plans } from "./plans.json";

export const getAllPlans = () => plans as Product[];

export const getUserSubscribedPlan = (
  price_id: string,
  interval_Count: number,
  product_id: string
): Product | undefined => {
  let duration: "monthly" | "annual";
  if (interval_Count === 1) duration = "monthly";
  else if (interval_Count === 12) duration = "annual";
  else throw new BadRequestError("Something went wrong on strip side");
  return plans.find((product) => {
    if (product.product_id === product_id) {
      if (price_id === product.plans[duration].price_id) return product;
    }
  });
};

export const getProductWithPriceId = (price_id: string) => {
  const duration: ["monthly", "annual"] = ["monthly", "annual"];
  const product = plans.find((product) => {
    return duration.find((el) => {
      if (product.plans[el].price_id === price_id)
        return { ...product, plan_name: el };
    });
  });
  if (!product) throw new InternalServerError("Something went wrong");
  const data: Product & { plan_name: "annual" | "monthly" } = {
    ...product,
    plan_name: "monthly",
  };
  if (product.plans.annual.price_id === price_id) data.plan_name = "annual";
  return data;
};

// const product_plans_arr = [
//     {
//       product_name: "Personal pack",
//       product_id: "prod_QHzeiL2eIVt49u",
//       plans: {
//         monthly: {
//           validaity: 30,
//           price: 7,
//           price_id: "price_1PRPeySGLuU49Vk9pQDAOejZ",
//         },
//         biannual: {
//           validity: 180,
//           price: 30,
//           price_id: "price_1PRPeySGLuU49Vk9pQDAOejZ",
//         },
//         annual: {
//           validity: 360,
//           price: 100,
//           price_id: "price_1PRQIKSGLuU49Vk9Q5fEkAXo",
//         },
//       },
//       features: {
//         link_generations: 100,
//         landing_page: 5,
//         custom_domains: 5,
//         qr_codes: 50,
//         link_redirects: true,
//         link_passwords: true,
//         link_expiration: true,
//         link_stats: true,
//         bulk_link_creation: false,
//         link_cloaking: true,
//         referrer_hiding: true,
//         region_targeting: false,
//         device_targeting: false,
//         password_protection: true,
//         export_clicks_data: true,
//       },
//     },
//     {
//       product_name: "Team pack",
//       product_id: "prod_QI0MtvbwoavrzV",
//       plans: {
//         monthly: {
//           validty: 30,
//           price: 25,
//           price_id: "price_1PRQM3SGLuU49Vk9iwn5oeCd",
//         },
//         biannual: {
//           validity: 180,
//           price: 130,
//           price_id: "price_1PRQM3SGLuU49Vk9gcVOJZgL",
//         },
//         annual: {
//           validity: 360,
//           price: 200,
//           price_id: "price_1PRQM3SGLuU49Vk924w0OpEH",
//         },
//       },
//     },
//     {
//       product_name: "Enterprise pack",
//       product_id: "prod_QI0R2yiwdHLneS",
//       plans: {
//         monthly: {
//           validity: 30,
//           price: 70,
//           price_id: "price_1PRQQnSGLuU49Vk9rNFS49nn",
//         },
//         biannual: {
//           validity: 180,
//           price: 360,
//           price_id: "price_1PRQQnSGLuU49Vk9qsuw6t0x",
//         },
//         annual: {
//           validity: 360,
//           price: 600,
//           price_id: "price_1PRQQnSGLuU49Vk99boo1Ebs",
//         },
//       },
//     },
//   ];
