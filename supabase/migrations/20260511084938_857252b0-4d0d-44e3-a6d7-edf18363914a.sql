
-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.track_order(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_order(TEXT, TEXT) TO anon, authenticated;

-- Tighten public insert policies with basic validation
DROP POLICY "orders_public_insert" ON public.orders;
CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT
WITH CHECK (
  length(customer_name) BETWEEN 1 AND 200
  AND customer_phone ~ '^[0-9]{10}$'
  AND customer_pincode ~ '^[0-9]{6}$'
  AND length(customer_address) BETWEEN 5 AND 1000
  AND total >= 0
  AND status = 'Pending Confirmation'
);

DROP POLICY "newsletter_public_insert" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_public_insert" ON public.newsletter_subscribers FOR INSERT
WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255);
