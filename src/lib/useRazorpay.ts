"use client";

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

interface UseRazorpayOptions {
  onSuccess?: () => void;
}

/**
 * Shared hook for Razorpay payment flow.
 * Eliminates duplication between ShowroomGrid and template/[id] page.
 */
export function useRazorpay(options?: UseRazorpayOptions) {
  const [statusMap, setStatusMap] = useState<Record<string, PaymentStatus>>({});

  const getStatus = useCallback((postId: string): PaymentStatus => {
    return statusMap[postId] || 'idle';
  }, [statusMap]);

  const setStatus = useCallback((postId: string, status: PaymentStatus) => {
    setStatusMap(prev => ({ ...prev, [postId]: status }));
  }, []);

  const resetStatusAfterDelay = useCallback((postId: string, delayMs = 3000) => {
    setTimeout(() => setStatus(postId, 'idle'), delayMs);
  }, [setStatus]);

  const initiatePurchase = useCallback(async (post: { id: string; title: string; price?: string | null }) => {
    if (!post.price || parseFloat(post.price) <= 0) return;

    const postId = post.id;
    setStatus(postId, 'processing');

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create order");
        setStatus(postId, 'failed');
        resetStatusAfterDelay(postId);
        return;
      }

      const rzpOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "PowerBI Templates",
        description: post.title,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setStatus(postId, 'success');
              toast.success("Payment successful!");
              options?.onSuccess?.();
            } else {
              setStatus(postId, 'failed');
              toast.error("Payment verification failed.");
              resetStatusAfterDelay(postId);
            }
          } catch {
            setStatus(postId, 'failed');
            toast.error("Error verifying payment");
            resetStatusAfterDelay(postId);
          }
        },
        modal: {
          ondismiss: function () {
            setStatus(postId, 'idle');
          },
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on("payment.failed", function () {
        setStatus(postId, 'failed');
        resetStatusAfterDelay(postId);
      });
      rzp.open();
    } catch {
      setStatus(postId, 'failed');
      toast.error("An error occurred while initializing checkout");
      resetStatusAfterDelay(postId);
    }
  }, [setStatus, resetStatusAfterDelay, options]);

  return { initiatePurchase, getStatus, setStatus };
}
