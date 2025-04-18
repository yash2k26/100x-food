'use client';
import { useState } from 'react';

export default function HundredXFood() {
  const [credits, setCredits] = useState(100);
  const [message, setMessage] = useState('');
  const [orderHistory, setOrderHistory] = useState<{ [key: string]: number }>({});
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalLoading, setFinalLoading] = useState(false);
  const [confirmationPage, setConfirmationPage] = useState(false);

  const foodItems = [
    { name: 'Veg Sandwich', price: 20 },
    { name: 'Idli', price: 15 },
    { name: 'Pasta', price: 30 },
    { name: 'Fried Rice', price: 40 },
    { name: 'Lassi', price: 15 },
  ];

  const handleOrder = (name: string, price: number) => {
    if (credits >= price) {
      setCredits(credits - price);
      setOrderHistory(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
      setMessage('Order placed!');
    } else {
      setMessage('Not enough credits');
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const adjustQuantity = (name: string, price: number, delta: number) => {
    setOrderHistory(prev => {
      const current = prev[name] || 0;
      const newQty = current + delta;
      if (delta > 0 && credits >= price) {
        setCredits(credits - price);
        return { ...prev, [name]: newQty };
      } else if (delta < 0 && current > 0) {
        setCredits(credits + price);
        if (newQty === 0) {
          const rest = Object.fromEntries(
            Object.entries(prev).filter(([key]) => key !== name)
          );
          return rest;
        }
        return { ...prev, [name]: newQty };
      }
      return prev;
    });
  };

  const openSummary = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSummary(true);
    }, 1200);
  };

  const handleFinalOrder = () => {
    setFinalLoading(true);
    setTimeout(() => {
      setFinalLoading(false);
      setConfirmationPage(true);
      setTimeout(() => {
        setCredits(100);
        setOrderHistory({});
        setConfirmationPage(false);
        setShowSummary(false);
      }, 5000);
    }, 1500);
  };

  const totalSpent = Object.entries(orderHistory).reduce((acc, [name, qty]) => {
    const price = foodItems.find(item => item.name === name)?.price || 0;
    return acc + price * qty;
  }, 0);

  const LoadingScreen = ({ text }: { text: string }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-6">
      <div className="animate-bounce text-3xl sm:text-4xl font-bold mb-4">
        <span className="text-white">100</span>
        <span className="text-blue-500">x</span>
        <span className="text-white">food</span>
      </div>
      <p className="text-base sm:text-xl">{text}</p>
    </div>
  );

  if (loading) return <LoadingScreen text="Preparing your summary..." />;
  if (finalLoading) return <LoadingScreen text="Placing your order..." />;
  if (confirmationPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-6">
        <h2 className="text-2xl sm:text-3xl mb-4">Your order is placed 🍽️</h2>
        <p className="text-base sm:text-lg mb-2">Please relax and code 💻</p>
        <div className="animate-bounce text-3xl sm:text-4xl font-bold mt-4">
          <span className="text-white">100</span>
          <span className="text-blue-500">x</span>
          <span className="text-white">food</span>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="min-h-screen bg-black text-white p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl mb-4 text-center">Your Order Summary</h2>
        {Object.entries(orderHistory).length === 0 ? (
          <p className="text-center">No items selected.</p>
        ) : (
          <ul className="mb-6 space-y-3">
            {Object.entries(orderHistory).map(([name, qty]) => {
              const price = foodItems.find(item => item.name === name)?.price || 0;
              return (
                <li key={name} className="flex items-center justify-between">
                  <span className="text-sm sm:text-base">{name} (x{qty}) - {price * qty} pts</span>
                  <div className="flex">
                    <button onClick={() => adjustQuantity(name, price, 1)} className="bg-blue-600 px-2 py-1 rounded mx-1 text-sm">+</button>
                    <button onClick={() => adjustQuantity(name, price, -1)} className="bg-red-500 px-2 py-1 rounded text-sm">-</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mb-4 text-center text-sm sm:text-base">Total Spent: <strong>{totalSpent}</strong> pts</p>
        <div className="flex justify-center">
          <button onClick={handleFinalOrder} className="bg-green-600 px-6 py-2 rounded text-white text-base sm:text-lg">Order!</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-4 sm:p-6 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        <span className="text-white">100</span>
        <span className="text-blue-500">x</span>
        <span className="text-white">food</span> 🍽️
      </h1>

      <p className="text-base sm:text-lg text-center mb-2">Available Credits: <strong>{credits}</strong></p>
      <p className="text-center mb-4 text-sm text-yellow-400">{message}</p>

      <div className="space-y-4">
        {foodItems.map(item => (
          <div key={item.name} className="flex items-center justify-between border-b border-gray-700 pb-2">
            <span className="text-sm sm:text-base">{item.name} - {item.price} pts</span>
            {orderHistory[item.name] ? (
              <div className="flex items-center">
                <button onClick={() => adjustQuantity(item.name, item.price, -1)} className="bg-red-600 px-2 py-1 rounded text-sm">-</button>
                <span className="mx-2 text-sm">{orderHistory[item.name]}</span>
                <button onClick={() => adjustQuantity(item.name, item.price, 1)} className="bg-green-600 px-2 py-1 rounded text-sm">+</button>
              </div>
            ) : (
              <button onClick={() => handleOrder(item.name, item.price)} className="bg-blue-500 px-4 py-1 rounded text-sm">Order</button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={openSummary} className="bg-yellow-500 text-black px-6 py-2 rounded text-base sm:text-lg">Order List</button>
      </div>
    </main>
  );
}
