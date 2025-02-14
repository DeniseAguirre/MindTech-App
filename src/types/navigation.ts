import { Product } from "../interfaces/IProduct";

export type RootStackParamList = {
  TabNavigator: undefined;
  Home: undefined; // Si no tiene parámetros
  Details: { item: Product }; // Detalles de un producto
  Search: { searchQuery?: string };
  Register: undefined;
  MyCart: {};
};
