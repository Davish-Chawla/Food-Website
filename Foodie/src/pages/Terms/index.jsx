import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';

const TermsPage = () => {
  return (
    <div className="pt-32 pb-24 bg-[var(--bg-light)] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <SectionHeader 
          label="Legal"
          title="Terms &"
          highlight="Conditions"
          subtitle="Please read these terms carefully before using our service."
        />
        <Card className="p-10 md:p-16 space-y-10" shadow="lg">
          <section className="space-y-4">
            <h3 className="text-xl font-black text-[var(--dark)]">1. Acceptance of Terms</h3>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
              By accessing and using FoodieHub, you agree to be bound by these terms and conditions. If you do not agree, please do not use our service.
            </p>
          </section>
          <section className="space-y-4">
            <h3 className="text-xl font-black text-[var(--dark)]">2. Delivery Policy</h3>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
              We strive to deliver your food within the estimated time. However, delays may occur due to traffic, weather, or high demand. We are not liable for such delays.
            </p>
          </section>
          <section className="space-y-4">
            <h3 className="text-xl font-black text-[var(--dark)]">3. Cancellation & Refunds</h3>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
              Orders can be cancelled within 5 minutes of placement. Refunds for valid cancellations will be processed within 5-7 business days.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
