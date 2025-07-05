import React from 'react';

const MarketPricesCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Market Prices</h3>
        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
          Live
        </span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Today's Trend</span>
          <span className="text-sm font-medium text-green-600">↗ +2.3%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-3 text-gray-800">Current Prices</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">W</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Wheat</div>
                <div className="text-xs text-gray-500">Per kg</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">₹28.50</div>
              <div className="text-xs text-green-600">+₹1.20</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-sm font-bold">C</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Corn</div>
                <div className="text-xs text-gray-500">Per kg</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">₹22.80</div>
              <div className="text-xs text-red-600">-₹0.50</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">T</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Tomatoes</div>
                <div className="text-xs text-gray-500">Per kg</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">₹45.20</div>
              <div className="text-xs text-green-600">+₹3.10</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">P</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Peppers</div>
                <div className="text-xs text-gray-500">Per kg</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">₹38.90</div>
              <div className="text-xs text-green-600">+₹1.80</div>
            </div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <button className="text-sm text-[#34A853] hover:text-[#22C55E] font-medium">
            View All Prices
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketPricesCard; 