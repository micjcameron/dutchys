/**
 * LocalStorage utilities for Sauna Configurator
 * Handles saving and restoring user progress and selections
 */

const STORAGE_KEY = 'configurator-state';
const STORAGE_VERSION = '1.0.0';
const SESSION_KEY = 'configurator-session';
const PRODUCT_SNAPSHOT_KEY = 'configurator-product';
const CART_STORAGE_KEY = 'sauna-cart';
const CART_VERSION = '1.0.0';
const LAST_PAYMENT_ID_KEY = 'last-payment-id';
export const CART_UPDATED_EVENT = 'sauna-cart-updated';

/**
 * Save configurator state to localStorage
 * @param {Object} state - The current configurator state
 * @param {number} currentStep - The current step number
 */
const resolveConfiguratorKey = (productType, key) => `${productType}-${key}`;

export const saveConfiguratorState = (state, currentStep, productType = 'hottub') => {
  try {
    const dataToSave = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      currentStep,
      state,
      // Add metadata for debugging/analytics
      metadata: {
        totalSteps: 16,
        hasSelections: Object.values(state).some(value => 
          value !== null && value !== undefined && 
          (Array.isArray(value) ? value.length > 0 : true)
        )
      }
    };

    localStorage.setItem(resolveConfiguratorKey(productType, STORAGE_KEY), JSON.stringify(dataToSave));
    console.log('=== SAVING STATE TO LOCALSTORAGE ===');
    console.log('Timestamp:', dataToSave.timestamp);
    console.log('Current step:', currentStep);
    console.log('Selected model:', state.selectedModel);
    console.log('Selected shape:', state.selectedShape);
    console.log('Stack trace:', new Error().stack);
    console.log('=== END SAVE ===');
    return true;
  } catch (error) {
    console.error('Failed to save configurator state:', error);
    return false;
  }
};

/**
 * Load configurator state from localStorage
 * @returns {Object|null} - The saved state or null if not found/invalid
 */
export const loadConfiguratorState = (productType = 'hottub') => {
  try {
    const savedData = localStorage.getItem(resolveConfiguratorKey(productType, STORAGE_KEY));
    
    if (!savedData) {
      console.log('No saved configurator state found');
      return null;
    }

    const parsedData = JSON.parse(savedData);
    console.log('Loaded configurator state from localStorage:', parsedData);
    
    // Check if the saved data is from a compatible version
    if (parsedData.version !== STORAGE_VERSION) {
      console.warn('Saved configurator state is from a different version, clearing...');
      clearConfiguratorState(productType);
      return null;
    }

    // Check if the data is not too old (optional: 7 days)
    const savedTime = new Date(parsedData.timestamp);
    const now = new Date();
    const daysDiff = (now - savedTime) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      console.log('Saved configurator state is too old, clearing...');
      clearConfiguratorState(productType);
      return null;
    }

    console.log('Configurator state loaded from localStorage');
    return {
      currentStep: parsedData.currentStep || 1,
      state: parsedData.state || {},
      metadata: parsedData.metadata || {}
    };
  } catch (error) {
    console.error('Failed to load configurator state:', error);
    clearConfiguratorState(productType); // Clear corrupted data
    return null;
  }
};

/**
 * Clear configurator state from localStorage
 */
export const clearConfiguratorState = (productType = 'hottub') => {
  try {
    localStorage.removeItem(resolveConfiguratorKey(productType, STORAGE_KEY));
    console.log('Configurator state cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Failed to clear configurator state:', error);
    return false;
  }
};

export const getConfiguratorSessionId = (productType = 'hottub') => {
  try {
    return localStorage.getItem(resolveConfiguratorKey(productType, SESSION_KEY));
  } catch (error) {
    console.error('Failed to read configurator session ID:', error);
    return null;
  }
};

export const setConfiguratorSessionId = (id, productType = 'hottub') => {
  try {
    localStorage.setItem(resolveConfiguratorKey(productType, SESSION_KEY), id);
    return true;
  } catch (error) {
    console.error('Failed to save configurator session ID:', error);
    return false;
  }
};

export const clearConfiguratorSessionId = (productType = 'hottub') => {
  try {
    localStorage.removeItem(resolveConfiguratorKey(productType, SESSION_KEY));
    return true;
  } catch (error) {
    console.error('Failed to clear configurator session ID:', error);
    return false;
  }
};

export const clearConfiguratorProductSnapshot = (productType = 'hottub') => {
  try {
    localStorage.removeItem(resolveConfiguratorKey(productType, PRODUCT_SNAPSHOT_KEY));
    return true;
  } catch (error) {
    console.error('Failed to clear configurator snapshot:', error);
    return false;
  }
};

export const saveConfiguratorProductSnapshot = (snapshot, productType = 'hottub') => {
  try {
    localStorage.setItem(resolveConfiguratorKey(productType, PRODUCT_SNAPSHOT_KEY), JSON.stringify(snapshot));
    return true;
  } catch (error) {
    console.error('Failed to save configurator snapshot:', error);
    return false;
  }
};

export const loadConfiguratorProductSnapshot = (productType = 'hottub') => {
  try {
    const saved = localStorage.getItem(resolveConfiguratorKey(productType, PRODUCT_SNAPSHOT_KEY));
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load configurator snapshot:', error);
    return null;
  }
};

export const clearConfiguratorSessionData = (productType = 'hottub') => {
  const clearedState = clearConfiguratorState(productType);
  const clearedSession = clearConfiguratorSessionId(productType);
  const clearedSnapshot = clearConfiguratorProductSnapshot(productType);
  return clearedState && clearedSession && clearedSnapshot;
};

/**
 * Check if there's saved progress
 * @returns {boolean} - True if there's saved progress
 */
export const hasSavedProgress = (productType = 'hottub') => {
  try {
    const savedData = localStorage.getItem(resolveConfiguratorKey(productType, STORAGE_KEY));
    return savedData !== null;
  } catch (error) {
    console.error('Failed to check for saved progress:', error);
    return false;
  }
};

/**
 * Get saved progress summary for display
 * @returns {Object|null} - Summary of saved progress
 */
export const getSavedProgressSummary = (productType = 'hottub') => {
  try {
    const savedData = localStorage.getItem(resolveConfiguratorKey(productType, STORAGE_KEY));
    
    if (!savedData) {
      return null;
    }

    const parsedData = JSON.parse(savedData);
    
    return {
      currentStep: parsedData.currentStep || 1,
      totalSteps: 16,
      progress: Math.round(((parsedData.currentStep || 1) / 16) * 100),
      lastSaved: new Date(parsedData.timestamp).toLocaleString('nl-NL'),
      hasSelections: parsedData.metadata?.hasSelections || false
    };
  } catch (error) {
    console.error('Failed to get progress summary:', error);
    return null;
  }
};

/**
 * Auto-save configurator state (debounced)
 * @param {Object} state - The current configurator state
 * @param {number} currentStep - The current step number
 * @param {number} delay - Debounce delay in milliseconds (default: 1000)
 */
let saveTimeout = null;
export const autoSaveConfiguratorState = (state, currentStep, delay = 1000, productType = 'hottub') => {
  console.log('=== AUTO-SAVE TRIGGERED ===');
  console.log('Current step:', currentStep);
  console.log('Selected model:', state.selectedModel);
  console.log('Selected shape:', state.selectedShape);
  console.log('Stack trace:', new Error().stack);
  
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Set new timeout
  saveTimeout = setTimeout(() => {
    console.log('Auto-save timeout executing...');
    saveConfiguratorState(state, currentStep, productType);
  }, delay);
};

/**
 * Restore configurator state with validation
 * @param {Object} initialState - The initial state object
 * @returns {Object} - Restored state with validation
 */
export const restoreConfiguratorState = (initialState, productType = 'hottub') => {
  const savedData = loadConfiguratorState(productType);
  
  if (!savedData) {
    return {
      currentStep: 1,
      state: initialState
    };
  }

  // Merge saved state with initial state to handle new fields
  const mergedState = { ...initialState, ...savedData.state };
  
  return {
    currentStep: savedData.currentStep,
    state: mergedState
  };
};

/**
 * Restore object references for complex objects
 * This ensures that restored objects match the original data structure
 * @param {Object} restoredState - The restored state object
 * @param {Object} dataSources - Object containing all data sources
 * @returns {Object} - State with proper object references
 */
export const restoreObjectReferences = (restoredState, dataSources) => {
  const { productModels, allHeatingOptions, allMaterials, allOptions } = dataSources;
  
  console.log('=== RESTORING OBJECT REFERENCES ===');
  console.log('Restored state keys:', Object.keys(restoredState));
  console.log('Selected shape:', restoredState.selectedShape);
  console.log('Selected model:', restoredState.selectedModel);
  
  // Helper function to find object by id in array
  const findById = (array, id) => array.find(item => item.id === id);
  
  // Restore model reference
  if (restoredState.selectedModel?.id) {
    console.log('Restoring model:', restoredState.selectedModel.id);
    const foundModel = findById(productModels, restoredState.selectedModel.id);
    console.log('Found model:', foundModel ? `${foundModel.shape} ${foundModel.size}` : 'not found');
    restoredState.selectedModel = foundModel || restoredState.selectedModel;
  }
  
  // Restore heating reference
  if (restoredState.selectedHeating?.id) {
    restoredState.selectedHeating = findById(allHeatingOptions, restoredState.selectedHeating.id) || restoredState.selectedHeating;
  }
  
  // Restore material references
  if (restoredState.selectedInternalMaterial?.id) {
    restoredState.selectedInternalMaterial = findById(allMaterials.internal, restoredState.selectedInternalMaterial.id) || restoredState.selectedInternalMaterial;
  }
  
  if (restoredState.selectedExternalMaterial?.id) {
    restoredState.selectedExternalMaterial = findById(allMaterials.external, restoredState.selectedExternalMaterial.id) || restoredState.selectedExternalMaterial;
  }
  
  // Restore color references
  if (restoredState.selectedInternalColor?.id && restoredState.selectedInternalMaterial?.colors) {
    restoredState.selectedInternalColor = findById(restoredState.selectedInternalMaterial.colors, restoredState.selectedInternalColor.id) || restoredState.selectedInternalColor;
  }
  
  if (restoredState.selectedExternalColor?.id && restoredState.selectedExternalMaterial?.colors) {
    restoredState.selectedExternalColor = findById(restoredState.selectedExternalMaterial.colors, restoredState.selectedExternalColor.id) || restoredState.selectedExternalColor;
  }
  
  // Restore insulation reference
  if (restoredState.selectedInsulation?.id) {
    // Note: insulationOptions might not exist in allOptions, need to check the data structure
    restoredState.selectedInsulation = restoredState.selectedInsulation;
  }
  
  // Restore array references - handle multiple selections
  if (restoredState.selectedSpaSystems?.length) {
    console.log('Restoring spa systems:', restoredState.selectedSpaSystems);
    restoredState.selectedSpaSystems = restoredState.selectedSpaSystems.map(system => {
      const found = findById(allOptions.spaSystems, system.id);
      console.log(`Spa system ${system.id}:`, found ? 'found' : 'not found');
      return found || system;
    });
  }
  
  if (restoredState.selectedLEDs?.length) {
    console.log('Restoring LEDs:', restoredState.selectedLEDs);
    restoredState.selectedLEDs = restoredState.selectedLEDs.map(led => {
      const found = findById(allOptions.ledOptions, led.id);
      console.log(`LED ${led.id}:`, found ? 'found' : 'not found');
      return found || led;
    });
  }
  
  if (restoredState.selectedLids?.length) {
    restoredState.selectedLids = restoredState.selectedLids.map(lid => 
      findById(allOptions.lidOptions, lid.id) || lid
    );
  }
  
  if (restoredState.selectedFiltration?.length) {
    console.log('Restoring filtration:', restoredState.selectedFiltration);
    restoredState.selectedFiltration = restoredState.selectedFiltration.map(filter => {
      const found = findById(allOptions.filtrationOptions, filter.id);
      console.log(`Filtration ${filter.id}:`, found ? 'found' : 'not found');
      return found || filter;
    });
  }
  
  if (restoredState.selectedSandFilters?.length) {
    // Note: sandFilterOptions might not exist in allOptions, need to check the data structure
    restoredState.selectedSandFilters = restoredState.selectedSandFilters;
  }
  
  if (restoredState.selectedStairs?.length) {
    restoredState.selectedStairs = restoredState.selectedStairs.map(stair => 
      findById(allOptions.stairsOptions, stair.id) || stair
    );
  }
  
  if (restoredState.selectedControlUnits?.length) {
    restoredState.selectedControlUnits = restoredState.selectedControlUnits.map(unit => 
      findById(allOptions.controlUnits, unit.id) || unit
    );
  }
  
  if (restoredState.selectedExtras?.length) {
    restoredState.selectedExtras = restoredState.selectedExtras.map(extra => 
      findById(allOptions.extraOptions, extra.id) || extra
    );
  }
  
  console.log('=== RESTORATION COMPLETE ===');
  console.log('Final restored state:');
  console.log('- selectedShape:', restoredState.selectedShape);
  console.log('- selectedModel:', restoredState.selectedModel ? `${restoredState.selectedModel.shape} ${restoredState.selectedModel.size}` : 'None');
  console.log('- selectedHeating:', restoredState.selectedHeating?.name || 'None');
  
  return restoredState;
};

// Cart storage helpers
const emitCartUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
};

export const loadCart = () => {
  try {
    const savedData = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedData) {
      return { items: [], cartId: null };
    }

    const parsedData = JSON.parse(savedData);
    if (parsedData.version !== CART_VERSION || !Array.isArray(parsedData.items)) {
      return { items: [], cartId: null };
    }

    return { items: parsedData.items, cartId: parsedData.cartId ?? null };
  } catch (error) {
    console.error('Failed to load cart:', error);
    return { items: [], cartId: null };
  }
};

export const saveCart = (items, cartId) => {
  try {
    const existingCartId = cartId !== undefined ? cartId : loadCart().cartId;
    const dataToSave = {
      version: CART_VERSION,
      updatedAt: new Date().toISOString(),
      items,
      cartId: existingCartId ?? null,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
    emitCartUpdated();
    return true;
  } catch (error) {
    console.error('Failed to save cart:', error);
    return false;
  }
};

export const addCartItem = (item) => {
  const cart = loadCart();

  if (!item) {
    return cart.items;
  }

  if (item.type === 'configurator') {
    const newItem = {
      id: item.id || `config-${Date.now()}`,
      type: 'configurator',
      productType: item.productType,
      quantity: item.quantity || 1,
      title: item.title,
      description: item.description,
      image: item.image,
      priceIncl: item.priceIncl,
      priceExcl: item.priceExcl,
      options: item.options || [],
      metadata: item.metadata || {},
    };
    cart.items.push(newItem);
    saveCart(cart.items, cart.cartId);
    return cart.items;
  }

  const productId = item.productId || item.id;
  if (!productId) {
    return cart.items;
  }

  const existing = cart.items.find((entry) => entry.productId === productId);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
  } else {
    cart.items.push({
      type: 'product',
      productType: item.productType,
      productId,
      quantity: item.quantity || 1,
    });
  }

  saveCart(cart.items, cart.cartId);
  return cart.items;
};

export const updateCartItemQuantity = (itemOrId, quantity) => {
  const cart = loadCart();
  const nextQuantity = Math.max(
    1,
    typeof itemOrId === 'string' ? quantity || 1 : itemOrId.quantity || 1
  );

  const target = typeof itemOrId === 'string' ? { id: itemOrId, productId: itemOrId } : itemOrId;

  const existing = cart.items.find(
    (entry) =>
      (target.id && entry.id === target.id) ||
      (target.productId && entry.productId === target.productId)
  );

  if (!existing) {
    return cart.items;
  }

  existing.quantity = nextQuantity;
  saveCart(cart.items, cart.cartId);
  return cart.items;
};

export const removeCartItem = (itemOrId) => {
  const cart = loadCart();
  const target = typeof itemOrId === 'string' ? { id: itemOrId, productId: itemOrId } : itemOrId;
  const nextItems = cart.items.filter(
    (entry) =>
      !(target.id && entry.id === target.id) &&
      !(target.productId && entry.productId === target.productId)
  );
  const nextCartId = nextItems.length === 0 ? null : cart.cartId;
  saveCart(nextItems, nextCartId);
  return nextItems;
};

export const clearCart = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    emitCartUpdated();
    return true;
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return false;
  }
};

export const getCartId = () => {
  return loadCart().cartId;
};

export const setCartId = (cartId) => {
  const cart = loadCart();
  return saveCart(cart.items, cartId);
};

export const clearCartId = () => {
  const cart = loadCart();
  return saveCart(cart.items, null);
};

export const setLastPaymentId = (paymentId) => {
  try {
    localStorage.setItem(LAST_PAYMENT_ID_KEY, paymentId);
    return true;
  } catch (error) {
    console.error('Failed to save payment ID:', error);
    return false;
  }
};

export const getLastPaymentId = () => {
  try {
    return localStorage.getItem(LAST_PAYMENT_ID_KEY);
  } catch (error) {
    console.error('Failed to read payment ID:', error);
    return null;
  }
};

export const clearLastPaymentId = () => {
  try {
    localStorage.removeItem(LAST_PAYMENT_ID_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear payment ID:', error);
    return false;
  }
};
