-- Server-only RPC functions for the commerce layer (Step 3). These are only
-- ever called via the service-role client from trusted server code (server
-- actions, the Stripe webhook handler) — never from the browser — so
-- execute is explicitly revoked from anon/authenticated below.

-- decrement_inventory --------------------------------------------------------
-- Called from the Stripe webhook after a successful payment, once per
-- physical order_item. No-ops for formats that don't track stock.

create or replace function public.decrement_inventory(
  p_book_format_id uuid,
  p_quantity integer
)
returns void
language plpgsql
as $$
begin
  update public.inventory
  set
    quantity_on_hand = greatest(quantity_on_hand - p_quantity, 0),
    stock_status = case
      when greatest(quantity_on_hand - p_quantity, 0) = 0 then 'out_of_stock'
      when greatest(quantity_on_hand - p_quantity, 0) <= reorder_threshold then 'low_stock'
      else 'in_stock'
    end
  where book_format_id = p_book_format_id
    and tracks_stock = true
    and quantity_on_hand is not null;
end;
$$;

comment on function public.decrement_inventory(uuid, integer) is
  'Atomically reduces stock for a physical format after a paid order and recomputes stock_status. Service-role only.';

revoke all on function public.decrement_inventory(uuid, integer) from public, anon, authenticated;

-- merge_guest_basket -----------------------------------------------------------
-- Called right after a successful sign-in/sign-up when a guest basket
-- cookie is present. Folds the guest basket's items into the user's active
-- basket (summing quantities for formats already present), then retires
-- the guest basket. Returns the resulting basket id.

create or replace function public.merge_guest_basket(
  p_guest_basket_id uuid,
  p_user_id uuid
)
returns uuid
language plpgsql
as $$
declare
  v_user_basket_id uuid;
begin
  select id into v_user_basket_id
  from public.baskets
  where user_id = p_user_id and status = 'active'
  limit 1;

  if v_user_basket_id is null then
    insert into public.baskets (user_id, status)
    values (p_user_id, 'active')
    returning id into v_user_basket_id;
  end if;

  if p_guest_basket_id is not null and p_guest_basket_id <> v_user_basket_id then
    update public.basket_items ui
    set quantity = ui.quantity + gi.quantity
    from public.basket_items gi
    where gi.basket_id = p_guest_basket_id
      and ui.basket_id = v_user_basket_id
      and ui.book_format_id = gi.book_format_id;

    insert into public.basket_items (basket_id, book_format_id, quantity, unit_price_amount)
    select v_user_basket_id, gi.book_format_id, gi.quantity, gi.unit_price_amount
    from public.basket_items gi
    where gi.basket_id = p_guest_basket_id
      and not exists (
        select 1 from public.basket_items ui
        where ui.basket_id = v_user_basket_id
          and ui.book_format_id = gi.book_format_id
      );

    delete from public.basket_items where basket_id = p_guest_basket_id;
    update public.baskets set status = 'converted' where id = p_guest_basket_id;
  end if;

  return v_user_basket_id;
end;
$$;

comment on function public.merge_guest_basket(uuid, uuid) is
  'Merges a guest basket into the signed-in user''s active basket after login/signup. Service-role only.';

revoke all on function public.merge_guest_basket(uuid, uuid) from public, anon, authenticated;
