import axios from "axios";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: Category;
  brand: Brand;
  price: number;
  quantity: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
}
interface Brand {
  _id: string;
  name: string;
}

interface Cart {
  items: Product[];
  total: number;
}

interface Store {
  allProducts: Product[];
  oneProduct: Product[];
  user: object | null;
  token: string | null;
  cart: Cart;
  favorites: Product[];
  categories: any[];
  brands: any[];
  selectCheckboxes: any[];
  isLoading: boolean;
  error: string | null;

  initializeStore: () => Promise<void>;
  getAllProducts: () => Promise<void>;
  getCategories: () => Promise<void>;
  getBrands: () => Promise<void>;
  getOneProduct: (id: string) => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  getUser: (email: string) => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleFavorite: (product: Product) => Promise<void>;
  setSelectCheckboxes: (checkboxes: any[]) => void;
  deleteProducts: (dataDelete: any) => Promise<void>;
  createProduct: (newProduct: any) => Promise<any>;
  clearError: () => void;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const useStore = create<Store>((set, get) => ({
  allProducts: [],
  oneProduct: [],
  user: null,
  token: null,
  cart: { items: [], total: 0 },
  favorites: [],
  categories: [],
  brands: [],
  selectCheckboxes: [],
  isLoading: false,
  error: null,

  initializeStore: async () => {
    set({ isLoading: true });
    try {
      const [
        token,
        cartData,
        favoritesData,
        allProductsData,
        categoriesData,
        brandsData,
      ] = await Promise.all([
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("cart"),
        AsyncStorage.getItem("favorites"),
        AsyncStorage.getItem("allProducts"),
        AsyncStorage.getItem("categories"),
        AsyncStorage.getItem("brands"),
      ]);

      set({
        token,
        cart: cartData ? JSON.parse(cartData) : { items: [], total: 0 },
        favorites: favoritesData ? JSON.parse(favoritesData) : [],
        allProducts: allProductsData ? JSON.parse(allProductsData) : [],
        categories: categoriesData ? JSON.parse(categoriesData) : [],
        brands: brandsData ? JSON.parse(brandsData) : [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error al inicializar la tienda", isLoading: false });
    }
  },

  getAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${apiUrl}products/all`);
      const products = response.data.products;
      await AsyncStorage.setItem("allProducts", JSON.stringify(products));
      set({ allProducts: products, isLoading: false });
    } catch (error) {
      set({ error: "Error al obtener productos", isLoading: false });
    }
  },

  getCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${apiUrl}categories`);
      const categories = response.data.categories;
      await AsyncStorage.setItem("categories", JSON.stringify(categories));
      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: "Error al obtener categorías", isLoading: false });
    }
  },

  getBrands: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${apiUrl}brands`);
      const brands = response.data.brands;
      await AsyncStorage.setItem("brands", JSON.stringify(brands));
      set({ brands, isLoading: false });
    } catch (error) {
      set({ error: "Error al obtener marcas", isLoading: false });
    }
  },

  getOneProduct: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(apiUrl + "products/one?one=" + id);
      set({ oneProduct: response.data.product, isLoading: false });
    } catch (error) {
      set({ error: "Error al obtener el producto", isLoading: false });
    }
  },

  login: async (token: string) => {
    set({ isLoading: true });
    try {
      await AsyncStorage.setItem("token", token);
      set({ token, isLoading: false });
    } catch (error) {
      set({ error: "Error al iniciar sesión", isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("cart");
      set({
        token: null,
        user: null,
        cart: { items: [], total: 0 },
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error al cerrar sesión", isLoading: false });
    }
  },

  getUser: async (email: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(apiUrl + "users/one?one=" + email);
      const user = response.data.user;
      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: "Error al obtener el usuario", isLoading: false });
    }
  },

  addToCart: async (product: Product) => {
    set({ isLoading: true });
    try {
      const { cart } = get();
      const existingItem = cart.items.find((item) => item._id === product._id);
      let updatedCart;
      if (existingItem) {
        updatedCart = {
          ...cart,
          items: cart.items.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        updatedCart = {
          ...cart,
          items: [...cart.items, { ...product, quantity: 1 }],
        };
      }
      updatedCart.total = updatedCart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      set({ error: "Error al añadir al carrito", isLoading: false });
    }
  },

  removeFromCart: async (productId: string) => {
    set({ isLoading: true });
    try {
      const { cart } = get();
      const updatedItems = cart.items.filter((item) => item._id !== productId);
      const updatedCart = {
        items: updatedItems,
        total: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      };
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      set({ error: "Error al eliminar del carrito", isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.removeItem("cart");
      set({ cart: { items: [], total: 0 }, isLoading: false });
    } catch (error) {
      set({ error: "Error al vaciar el carrito", isLoading: false });
    }
  },

  toggleFavorite: async (product: Product): Promise<void> => {
    const { favorites } = get();
    set({ isLoading: true });
    try {
      let updatedFavorites;
      const isFavorite = favorites.some((fav) => fav._id === product._id);

      if (isFavorite) {
        updatedFavorites = favorites.filter((fav) => fav._id !== product._id);
      } else {
        updatedFavorites = [...favorites, product];
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      set({ favorites: updatedFavorites, isLoading: false });
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
      set({ error: "Error al actualizar favoritos", isLoading: false });
    }
  },

  setSelectCheckboxes: (checkboxes: any[]) =>
    set({ selectCheckboxes: checkboxes }),

  deleteProducts: async (dataDelete: any) => {
    set({ isLoading: true });
    try {
      await axios.delete(apiUrl + "products/delete", { data: dataDelete });
      set({ isLoading: false });
      get().getAllProducts();
    } catch (error) {
      set({ error: "Error al eliminar productos", isLoading: false });
    }
  },

  createProduct: async (newProduct: any) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        apiUrl + "products/create",
        newProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({ isLoading: false });
      get().getAllProducts();
      return response.data;
    } catch (error) {
      set({ error: "Error al crear producto", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useStore;
