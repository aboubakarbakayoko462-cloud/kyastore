export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  reference: string;
  category: string | null;
  stock: number;
  created_at: string;
};
