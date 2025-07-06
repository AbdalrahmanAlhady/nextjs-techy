'use client';

import { useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation?order_id=${orderId}`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'An unexpected error occurred.');
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full !mt-8" size="lg">
        <span id="button-text">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
          ) : (
            'Pay now'
          )}
        </span>
      </Button>
      {message && <div id="payment-message" className="text-red-500 text-sm font-medium">{message}</div>}
    </form>
  );
}

export default function PaymentForm({ clientSecret, orderId }: { clientSecret: string; orderId: string; }) {
  const stripePromise = useMemo(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
   console.log(publishableKey);
    if (!publishableKey) {
      console.error("Stripe publishable key is not set. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file.");
      return null;
    }
    return loadStripe(publishableKey);
  }, []);

  if (!stripePromise) {
    return (
      <div className="text-red-500 p-4 border border-red-500 rounded-md bg-red-50">
        <p className="font-bold">Stripe Configuration Error</p>
        <p>The Stripe publishable key is not set. Please ensure the <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> environment variable is configured correctly.</p>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#000000',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm orderId={orderId} />
        </Elements>
      )}
    </div>
  );
}
