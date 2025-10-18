// Route Mapping Configuration for Sofia Public Transport
// Maps internal route_id to passenger-visible route numbers

const ROUTE_MAPPING = {
    // Confirmed mappings
    "A77": "67",  // Confirmed: A77 is Bus 67
    
    // Add more confirmed mappings here as discovered
    // Example format:
    // "A12": "12",
    // "TM20": "20",
    // "TB6": "6",
};

/**
 * Get the passenger-visible route number from a route_id
 * @param {string} routeId - The internal route ID (e.g., "A77", "TM20")
 * @returns {string} - The route number passengers see (e.g., "67", "20")
 */
function getRouteNumber(routeId) {
    // Check if we have a confirmed mapping
    if (ROUTE_MAPPING[routeId]) {
        return ROUTE_MAPPING[routeId];
    }
    
    // Fallback: remove prefix (A, TM, TB)
    // This might not be accurate for all routes
    return routeId.replace(/^(TM|TB|A)/, '');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ROUTE_MAPPING, getRouteNumber };
}
