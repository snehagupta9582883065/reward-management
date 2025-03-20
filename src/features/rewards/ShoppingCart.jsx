import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Trash2, Plus, Minus, CreditCard, AlertTriangle } from 'lucide-react';
import { removeFromCart, updateCartItemQuantity, redeemRewards, clearCart } from './rewardsSlice';

function ShoppingCartComponent({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, status } = useSelector((state) => state.rewards);
  const { points: userPoints } = useSelector((state) => state.users);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    notes: ''
  });
  const [confirmationData, setConfirmationData] = useState(null);

  const totalPoints = cart.reduce((total, item) => total + (item.points * item.quantity), 0);
  const isCartEmpty = cart.length === 0;
  const hasEnoughPoints = userPoints >= totalPoints;

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    setCheckoutStep('confirmation');
  };

  const handleConfirmRedeem = () => {
    dispatch(redeemRewards({
      rewardIds: cart.map(item => ({ id: item.id, quantity: item.quantity })),
      userDetails: formData
    }))
      .unwrap()
      .then(result => {
        setConfirmationData(result);
        setCheckoutStep('success');
      })
      .catch(error => {
        console.error('Redemption failed:', error);
      });
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const renderCartItems = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Your Cart
        </h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {isCartEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <ShoppingCart className="w-12 h-12 mb-2" />
          <p>Your cart is empty</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => navigate('/rewards')}
          >
            Browse Rewards
          </button>
        </div>
      ) : (
        <>
          <div className="divide-y">
            {cart.map(item => (
              <div key={item.id} className="py-4 flex">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-blue-600 font-bold">{item.points} points</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-md">
                      <button 
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold mb-2">
              <span>Total Points:</span>
              <span>{totalPoints} points</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Your Balance:</span>
              <span>{userPoints} points</span>
            </div>
            
            {!hasEnoughPoints && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>You don't have enough points ({totalPoints - userPoints} more needed)</span>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-lg ${
                  hasEnoughPoints 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => hasEnoughPoints && setCheckoutStep('details')}
                disabled={!hasEnoughPoints}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderDetailsForm = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <button 
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => setCheckoutStep('cart')}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-bold">Redemption Details</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <form onSubmit={handleSubmitDetails}>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          {cart.some(item => item.category === 'physical') && (
            <div>
              <label className="block text-gray-700 mb-1">Shipping Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 mb-1">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
            />
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold mb-4">
              <span>Total Points:</span>
              <span>{totalPoints} points</span>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Continue to Confirmation
            </button>
          </div>
        </div>
      </form>
    </>
  );

  const renderConfirmation = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <button 
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => setCheckoutStep('details')}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-bold">Confirm Redemption</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Please Review Your Order</h3>
          <p className="text-sm text-blue-700">
            You are about to redeem {cart.length} {cart.length === 1 ? 'item' : 'items'} for a total of {totalPoints} points.
          </p>
        </div>
        
        <div className="border rounded-lg divide-y">
          {cart.map(item => (
            <div key={item.id} className="p-3 flex items-center">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-10 h-10 object-cover rounded-md"
              />
              <div className="ml-3 flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex justify-between text-sm">
                  <span>{item.points} points</span>
                  <span>x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <div className="font-medium mb-1">Redemption Details:</div>
          <div className="text-sm text-gray-700">
            <p><span className="font-bold">Name:</span> {formData.name}</p>
            <p><span className="font-bold">Email:</span> {formData.email}</p>
            {formData.address && (
              <p><span className="font-bold">Address:</span> {formData.address}</p>
            )}
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-bold mb-4">
            <span>Total Points:</span>
            <span>{totalPoints} points</span>
          </div>
          
          <button
            onClick={handleConfirmRedeem}
            disabled={status.redemption === 'loading'}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
            {status.redemption === 'loading' ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Processing...
              </span>
            ) : (
              <span>Confirm Redemption</span>
            )}
          </button>
        </div>
      </div>
    </>
  );

  const renderSuccess = () => (
    <>
      <div className="flex justify-end">
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>
      
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Redemption Successful!</h2>
        <p className="text-gray-600 mb-4">Your order has been confirmed</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p><span className="font-bold">Order Number:</span> {confirmationData.orderNumber}</p>
          <p><span className="font-bold">Items:</span> {confirmationData.items}</p>
          <p><span className="font-bold">Date:</span> {new Date(confirmationData.redemptionDate).toLocaleString()}</p>
          <p><span className="font-bold">Status:</span> {confirmationData.status}</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/rewards/history')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Redemption History
          </button>
          <button
            onClick={() => navigate('/rewards')}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div>
      {checkoutStep === 'cart' && renderCartItems()}
      {checkoutStep === 'details' && renderDetailsForm()}
      {checkoutStep === 'confirmation' && renderConfirmation()}
      {checkoutStep === 'success' && renderSuccess()}
    </div>
  );
}

export default ShoppingCartComponent;