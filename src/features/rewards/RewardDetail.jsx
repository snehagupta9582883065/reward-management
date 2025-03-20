import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart, Calendar, Gift, Truck, Clock, AlertTriangle } from 'lucide-react';
import { fetchRewardDetails, addToCart } from './rewardsSlice';

function RewardDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentReward, status, cart } = useSelector((state) => state.rewards);
    const { points: userPoints } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchRewardDetails(id));
    }, [id, dispatch]);

    const handleAddToCart = () => {
        dispatch(addToCart(currentReward));
    };

    const isInCart = cart.some(item => item.id === Number(id));
    const isAffordable = currentReward && userPoints >= currentReward.points;

    if (status.currentReward === 'loading') {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status.currentReward === 'failed' || !currentReward) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <AlertTriangle className="w-12 h-12 mb-2" />
                <p>Failed to load reward details</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => navigate('/rewards')}
                >
                    Back to Rewards
                </button>
            </div>
        );
    }
    const renderCategoryIcon = () => {
        switch (currentReward.category) {
            case 'digital':
                return <Gift className="w-6 h-6 text-purple-500" />;
            case 'physical':
                return <Truck className="w-6 h-6 text-green-500" />;
            case 'experience':
                return <Calendar className="w-6 h-6 text-orange-500" />;
            default:
                return <Gift className="w-6 h-6 text-blue-500" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button
                onClick={() => navigate('/rewards')}
                className="flex items-center text-blue-600 mb-6 hover:text-blue-800"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Rewards
            </button>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-2/5">
                        <img
                            src={currentReward.image}
                            alt={currentReward.name}
                            className="w-full h-64 md:h-full object-cover"
                        />
                    </div>

                    <div className="md:w-3/5 p-6">
                        <div className="flex items-center mb-4">
                            {renderCategoryIcon()}
                            <h1 className="text-2xl font-bold ml-2">{currentReward.name}</h1>
                        </div>

                        <div className="flex items-center mb-4">
                            <span className="text-lg font-bold text-blue-600 mr-2">{currentReward.points} points</span>
                            <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                {currentReward.availability}
                            </span>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-gray-700">{currentReward.longDescription || currentReward.description}</p>
                        </div>

                        <div className="border-t pt-4 mb-6">
                            <h2 className="text-lg font-semibold mb-2">Details</h2>
                            {currentReward.category === 'digital' && (
                                <div className="flex items-center text-gray-700">
                                    <Clock className="w-5 h-5 mr-2 text-purple-500" />
                                    <span>Expires after {currentReward.details?.expiryDays || 30} days</span>
                                </div>
                            )}
                            {currentReward.category === 'physical' && (
                                <div className="flex items-center text-gray-700">
                                    <Truck className="w-5 h-5 mr-2 text-green-500" />
                                    <span>Ships in {currentReward.details?.shippingDays || '3-5'} business days</span>
                                </div>
                            )}
                            {currentReward.category === 'experience' && (
                                <div className="flex items-center text-gray-700">
                                    <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                                    <span>Book within {currentReward.details?.bookingWindow || '14'} days</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4">
                            {!isAffordable && (
                                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center text-yellow-800 mb-2">
                                    <AlertTriangle className="w-5 h-5 mr-2" />
                                    <span>You need {currentReward.points - userPoints} more points to redeem this reward</span>
                                </div>
                            )}

                            <button
                                className={`flex items-center px-6 py-3 rounded-lg ${isAffordable
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                onClick={handleAddToCart}
                                disabled={!isAffordable || isInCart}
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {isInCart ? 'In Cart' : 'Add to Cart'}
                            </button>

                            {isInCart && (
                                <button
                                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    onClick={() => navigate('/rewards/cart')}
                                >
                                    View Cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RewardDetail;
