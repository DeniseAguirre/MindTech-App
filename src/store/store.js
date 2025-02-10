import axios from "axios";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = "https://mindtech-back.onrender.com/";

const useStore = create((set, get) => ({
  allProducts: [],
  oneProduct: [],
  user: undefined,
  token: undefined,
  cart: { items: [], total: 0 },
  favorites: [],
  selectCheckboxes: [],
  isLoading: false,
  error: null,

  initializeStore: async () => {
    set({ isLoading: true });
    try {
      const [token, cartData, favoritesData, allProductsData] =
        await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("cart"),
          AsyncStorage.getItem("favorites"),
          AsyncStorage.getItem("allProducts"),
        ]);

      set({
        token,
        cart: cartData ? JSON.parse(cartData) : { items: [], total: 0 },
        favorites: favoritesData ? JSON.parse(favoritesData) : [],
        allProducts: allProductsData ? JSON.parse(allProductsData) : [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error al inicializar la tienda", isLoading: false });
    }
  },

  getAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(apiUrl + "products/all");
      const products = response.data.products;
      await AsyncStorage.setItem("allProducts", JSON.stringify(products));
      set({ allProducts: products, isLoading: false });
    } catch (error) {
      set({ error: "Error al obtener productos", isLoading: false });
    }
  },

  getOneProduct: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(apiUrl + "products/one?one=" + id);
      set({ oneProduct: response.data.product, isLoading: false });
    } catch (error) {
      set({ error: "Error al obtener el producto", isLoading: false });
    }
  },

  login: async (token) => {
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
        token: undefined,
        user: undefined,

        cart: { items: [], total: 0 },
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error al cerrar sesión", isLoading: false });
    }
  },

  getUser: async (email) => {
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

  addToCart: async (product) => {
    set({ isLoading: true });
    try {
      const { cart } = get();
      const existingItem = cart.items.find(
        (item) => item.product_id === product.product_id
      );
      let updatedCart;
      if (existingItem) {
        updatedCart = {
          ...cart,
          items: cart.items.map((item) =>
            item.product_id === product.product_id
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

  removeFromCart: async (productId) => {
    set({ isLoading: true });
    try {
      const { cart } = get();
      const updatedItems = cart.items.filter(
        (item) => item.product_id !== productId
      );
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

  toggleFavorite: async (product) => {
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
      return {
        success: false,
        error: error.message || "Error al actualizar favoritos",
      };
    }
  },

  setSelectCheckboxes: (checkboxes) => set({ selectCheckboxes: checkboxes }),

  deleteProducts: async (dataDelete) => {
    set({ isLoading: true });
    try {
      await axios.delete(apiUrl + "products/delete", { data: dataDelete });
      set({ isLoading: false });
      get().getAllProducts();
    } catch (error) {
      set({ error: "Error al eliminar productos", isLoading: false });
    }
  },

  createProduct: async (newProduct) => {
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
      throw new Error(error.message);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useStore;
