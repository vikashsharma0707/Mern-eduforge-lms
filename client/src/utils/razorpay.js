import { paymentApi } from '../services';
import { toast } from 'react-toastify';

export async function payForCourse(courseId, onSuccess) {
  try {
    const { data } = await paymentApi.createOrder(courseId);
    const { order, keyId } = data;
    const rzp = new window.Razorpay({
      key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'EduForge LMS',
      description: 'Course purchase',
      handler: async (response) => {
        try {
          await paymentApi.verify(response);
          toast.success('Payment successful! You are enrolled.');
          onSuccess && onSuccess();
        } catch {
          toast.error('Payment verification failed');
        }
      },
      theme: { color: '#e11d48' },
    });
    rzp.open();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Could not initiate payment');
  }
}
