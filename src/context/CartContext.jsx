import React, { createContext, useContext, useReducer } from 'react';

// 1. Añadir 'isSidebarOpen' al estado inicial
const initialState = {
  items: [],
  isSidebarOpen: false,
};

const CartContext = createContext(initialState);

// 2. Añadir acciones para abrir/cerrar el sidebar
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const itemExists = state.items.find(item => item.id === action.payload.id);
      if (itemExists) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    }
    case 'UPDATE_QUANTITY': {
        return {
            ...state,
            items: state.items.map(item =>
              item.id === action.payload.id
                ? { ...item, quantity: action.payload.quantity }
                : item
            ).filter(item => item.quantity > 0),
        };
    }
    case 'CLEAR_CART': {
        return {
            ...state,
            items: [],
        };
    }
    case 'OPEN_SIDEBAR': {
        return { ...state, isSidebarOpen: true };
    }
    case 'CLOSE_SIDEBAR': {
        return { ...state, isSidebarOpen: false };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 3. Modificar addToCart para que también abra el sidebar
  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    dispatch({ type: 'OPEN_SIDEBAR' });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: productId } });
  };
  
  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  }

  // 4. Exponer las nuevas funciones y el estado
  const closeSidebar = () => {
    dispatch({ type: 'CLOSE_SIDEBAR' });
  }

  return (
    <CartContext.Provider value={{ 
        items: state.items, 
        isSidebarOpen: state.isSidebarOpen,
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        closeSidebar
    }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  return useContext(CartContext);
};