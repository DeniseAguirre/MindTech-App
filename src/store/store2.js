// import axios from "axios";
// import { create } from "zustand";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const apiUrl = "https://mindtech-back.onrender.com/";

// const useStore = create((set) => ({
//   allProducts: [],
//   getAllProducts: async () => {
//     try {
//       const response = await axios.get(apiUrl + "products/all");
//       console.log("response", response.data.products);
//       set({ allProducts: response.data.products });
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   },
//   oneProduct: [],
//   getOneProduct: async (id) => {
//     try {
//       const response = await axios.get(apiUrl + "products/one?one=" + id);
//       set({ oneProduct: response.data.product });
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     }
//   },
//   user: undefined,
//   token: undefined,
//   initializeToken: async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       set({ token: token });
//     } catch (error) {
//       console.error("Error fetching token:", error);
//     }
//   },
//   getUser: async (user) => {
//     try {
//       const response = await axios.get(apiUrl + "users/one?one=" + user);
//       set({ user: response.data.user });
//       await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     }
//   },

//   login: async (token) => {
//     try {
//       console.log("token", token);
//       set({ token: token });
//     } catch (error) {
//       console.error("Error fetching token:", error);
//     }
//   },
//   logout: async () => {
//     try {
//       set({ token: undefined });
//     } catch (error) {
//       console.error("Error fetching token:", error);
//     }
//   },
//   cartItems: [],
//   setCartItems: (items) => set({ cartItems: items }),
//   removeCartItem: (productId) => {
//     set((state) => ({
//       cartItems: state.cartItems.filter((item) => item._id !== productId),
//     }));
//   },
//   selectCheckboxes: [],
//   setSelectCheckboxes: (checkboxes) =>
//     set((state) => ({
//       selectCheckboxes: checkboxes,
//     })),
//   deleteProducts: async (dataDelete) => {
//     try {
//       await axios.delete(apiUrl + "products/delete", dataDelete);
//       console.log("borrado con exito");
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   createProduct: async (newProduct) => {
//     try {
//       const response = await axios.post(
//         apiUrl + "products/create",
//         newProduct,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error creating product:", error);
//       throw new Error(error.message);
//     }
//   },

//   cart: undefined,
//   setCart: (parametro) => set({ cart: parametro }),

//   favorites: [],
//   handleFavorite: (itemId, itemName, imagen) => {
//     set((state) => {
//       if (state.favorites.some((fav) => fav._id === itemId)) {
//         return {
//           favorites: state.favorites.filter((fav) => fav._id !== itemId),
//         };
//       } else {
//         return {
//           favorites: [
//             ...state.favorites,
//             { _id: itemId, name: itemName, images: imagen },
//           ],
//         };
//       }
//     });
//     axios
//       .post(`${apiUrl}products/rating`, { _id: itemId, name: itemName })
//       .then((response) => {
//         if (response.status !== 200) {
//           throw new Error("Failed to add/remove favorite");
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   },

//   removeFavorite: (id) => {
//     set((state) => ({
//       favorites: state.favorites.filter((fav) => fav._id !== id),
//     }));
//   },
// }));

// export default useStore;
