import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
  return (
    <div className="pt-24 min-h-screen bg-[#F8F9FA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100"
        >
           <p className="text-[#FF4757] font-black text-xs uppercase tracking-[0.2em] mb-4">— LEGAL BITS</p>
          <h1 className="text-4xl font-black text-[#2F3542] mb-12">Terms & <span className="text-[#FF4757]">Conditions</span></h1>
          
          <div className="space-y-12 text-[#747D8C] leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-[#2F3542] mb-4 uppercase tracking-wider">1. Acceptance of Terms</h2>
              <p className="font-medium">
                By accessing and using FoodieHub, you agree to be bound by these Terms and Conditions. 
                If you do not agree with any part of these terms, you must not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#2F3542] mb-4 uppercase tracking-wider">2. User Accounts</h2>
              <p className="font-medium">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#2F3542] mb-4 uppercase tracking-wider">3. Ordering & Delivery</h2>
              <p className="font-medium">
                Orders are subject to availability and acceptance. Delivery times are estimates and 
                may vary due to traffic, weather, or other unforeseen circumstances. 
                We reserve the right to refuse service to anyone at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#2F3542] mb-4 uppercase tracking-wider">4. Pricing & Payment</h2>
              <p className="font-medium">
                All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise. 
                Payments can be made via card, UPI, or cash on delivery.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#2F3542] mb-4 uppercase tracking-wider">5. Refunds & Cancellations</h2>
              <p className="font-medium">
                Cancellations are only permitted within 2 minutes of placing an order. 
                Refunds will be processed to the original payment method within 5-7 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#2F3542] mb-4 uppercase tracking-wider">6. Limitation of Liability</h2>
              <p className="font-medium">
                FoodieHub shall not be liable for any indirect, incidental, or consequential damages 
                arising out of the use of our services or products.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm font-black text-[#2F3542] uppercase tracking-tighter">Last Updated: May 2026</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
