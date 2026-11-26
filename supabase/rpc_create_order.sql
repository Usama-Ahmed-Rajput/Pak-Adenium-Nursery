-- ==================================================================
-- ATOMIC ORDER CREATION RPC FOR PAK ADENIUM NURSERY
-- Function: public.create_order_atomic
-- ==================================================================

CREATE OR REPLACE FUNCTION public.create_order_atomic(
    p_order_payload JSONB,
    p_order_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_item RECORD;
    v_product RECORD;
    v_image_url TEXT;
    v_order_id UUID := gen_random_uuid();
    v_order_number VARCHAR(50);
    v_subtotal NUMERIC(12, 2) := 0;
    v_item_price NUMERIC(12, 2);
    v_item_total NUMERIC(12, 2);
    v_shipping_fee NUMERIC(12, 2);
    v_free_threshold NUMERIC(12, 2);
    v_default_shipping NUMERIC(12, 2);
    v_total NUMERIC(12, 2);
    v_exists BOOLEAN;
BEGIN
    -- Validate items array
    IF p_order_items IS NULL OR jsonb_array_length(p_order_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;

    -- 1. Lock requested product rows with FOR UPDATE to prevent concurrent overselling
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_order_items) AS x(product_id UUID, quantity INT)
    LOOP
        IF v_item.quantity IS NULL OR v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Item quantity must be greater than zero';
        END IF;

        -- Lock row and verify product exists and is published
        SELECT id, name, price, sale_price, stock_quantity, sku, is_published
        INTO v_product
        FROM public.products
        WHERE id = v_item.product_id AND is_published = TRUE
        FOR UPDATE;

        IF NOT FOUND THEN
            IF EXISTS (SELECT 1 FROM public.products WHERE id = v_item.product_id) THEN
                RAISE EXCEPTION 'Product "%" is no longer available for purchase', v_item.product_id;
            ELSE
                RAISE EXCEPTION 'Product not found: %', v_item.product_id;
            END IF;
        END IF;

        IF v_product.stock_quantity < v_item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for "%". Available: %, Requested: %', 
                v_product.name, v_product.stock_quantity, v_item.quantity;
        END IF;

        -- Authoritative price calculation
        v_item_price := COALESCE(v_product.sale_price, v_product.price);
        v_item_total := v_item_price * v_item.quantity;
        v_subtotal := v_subtotal + v_item_total;
    END LOOP;

    -- 2. Read shipping configuration from site_settings
    SELECT 
        COALESCE((value->>'free_shipping_threshold')::NUMERIC, 5000),
        COALESCE((value->>'default_shipping_fee')::NUMERIC, 350)
    INTO v_free_threshold, v_default_shipping
    FROM public.site_settings
    WHERE key = 'shipping';

    IF v_subtotal >= COALESCE(v_free_threshold, 5000) THEN
        v_shipping_fee := 0;
    ELSE
        v_shipping_fee := COALESCE(v_default_shipping, 350);
    END IF;

    v_total := v_subtotal + v_shipping_fee;

    -- 3. Collision-safe order_number generation (loop until unique)
    LOOP
        v_order_number := 'PAK-' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0');
        SELECT EXISTS (SELECT 1 FROM public.orders WHERE order_number = v_order_number) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;

    -- 4. Insert order record
    INSERT INTO public.orders (
        id, order_number, customer_name, customer_phone, customer_whatsapp, customer_email,
        province, city, area, shipping_address, order_notes,
        subtotal, shipping_fee, discount, total, payment_method, payment_status, order_status,
        access_token_hash, created_at, updated_at
    ) VALUES (
        v_order_id, v_order_number,
        p_order_payload->>'customer_name',
        p_order_payload->>'customer_phone',
        p_order_payload->>'customer_whatsapp',
        NULLIF(p_order_payload->>'customer_email', ''),
        p_order_payload->>'province',
        p_order_payload->>'city',
        NULLIF(p_order_payload->>'area', ''),
        p_order_payload->>'shipping_address',
        NULLIF(p_order_payload->>'order_notes', ''),
        v_subtotal, v_shipping_fee, 0, v_total,
        p_order_payload->>'payment_method',
        'Pending', 'Pending',
        NULLIF(p_order_payload->>'access_token_hash', ''),
        NOW(), NOW()
    );

    -- 5. Insert order items, decrement stock, and log inventory change
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_order_items) AS x(product_id UUID, quantity INT)
    LOOP
        SELECT id, name, price, sale_price, stock_quantity, sku
        INTO v_product
        FROM public.products
        WHERE id = v_item.product_id;

        v_item_price := COALESCE(v_product.sale_price, v_product.price);
        v_item_total := v_item_price * v_item.quantity;

        -- Fetch primary or first image_url from public.product_images for order_items
        SELECT image_url
        INTO v_image_url
        FROM public.product_images
        WHERE product_id = v_product.id
        ORDER BY is_primary DESC, display_order ASC
        LIMIT 1;

        INSERT INTO public.order_items (
            id, order_id, product_id, product_name, product_sku, unit_price, quantity, total_price, image_url, created_at
        ) VALUES (
            gen_random_uuid(),
            v_order_id,
            v_product.id,
            v_product.name,
            v_product.sku,
            v_item_price,
            v_item.quantity,
            v_item_total,
            v_image_url,
            NOW()
        );

        -- Decrement stock
        UPDATE public.products
        SET stock_quantity = stock_quantity - v_item.quantity,
            updated_at = NOW()
        WHERE id = v_product.id;

        -- Record inventory log entry
        INSERT INTO public.inventory_logs (
            id, product_id, change_amount, previous_quantity, new_quantity, reason, reference_id, created_at
        ) VALUES (
            gen_random_uuid(),
            v_product.id,
            -v_item.quantity,
            v_product.stock_quantity,
            v_product.stock_quantity - v_item.quantity,
            'Order Fulfillment',
            v_order_number,
            NOW()
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal', v_subtotal,
        'shipping_fee', v_shipping_fee,
        'total', v_total
    );
END;
$$;

-- Restrict execution permissions: only service_role (backend) should execute this SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.create_order_atomic(JSONB, JSONB) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_order_atomic(JSONB, JSONB) FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_order_atomic(JSONB, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_atomic(JSONB, JSONB) TO service_role;
