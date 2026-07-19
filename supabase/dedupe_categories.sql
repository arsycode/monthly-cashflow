-- Run this BEFORE re-running schema.sql's unique index (or import_historical_data.sql).
-- Safely merges duplicate (user_id, name, type) categories: repoints any entries
-- pointing at a duplicate to the oldest surviving row, then deletes the duplicates.

with ranked as (
  select id, user_id, name, type,
         row_number() over (partition by user_id, name, type order by created_at asc, id asc) as rn,
         first_value(id) over (partition by user_id, name, type order by created_at asc, id asc) as keep_id
  from categories
)
update entries e
set category_id = r.keep_id
from ranked r
where e.category_id = r.id and r.rn > 1;

with ranked as (
  select id,
         row_number() over (partition by user_id, name, type order by created_at asc, id asc) as rn
  from categories
)
delete from categories c
using ranked r
where c.id = r.id and r.rn > 1;
