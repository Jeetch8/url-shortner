export interface ProductPlan {
  validity: number;
  price: number;
  price_id: string;
}

export interface ProductPlans {
  monthly: ProductPlan;
  annual: ProductPlan;
}

export interface ProductFeatures {
  link_generation: number | string;
  landing_page: number | string;
  custom_domains: number | string;
  link_redirects: boolean;
  link_expiration: boolean;
  link_stats: boolean;
  custom_link_sharing_preview: boolean;
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
