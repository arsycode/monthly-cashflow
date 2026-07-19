-- Import your historical Monthly Cashflow.xlsx data (Dec 2025 - Jul 2026)
-- into the cashflow app. Run this AFTER supabase/schema.sql.
--
-- 1. Replace 'YOUR_LOGIN_EMAIL' below with the email you use to sign into the app.
-- 2. Run this whole file in Supabase SQL Editor, in one go.
--
-- Each spreadsheet category becomes one entry per month, with label = category
-- name (your sheet tracked one total per category per month, not itemized
-- transactions, so that's preserved here). A few near-duplicate category names
-- across months (e.g. "All Tax" / "Tax", "Office Things" / "Office/Business")
-- were merged into one consistent name so they track together over time.

create temporary table _me as
  select id as user_id from auth.users where email = 'YOUR_LOGIN_EMAIL' limit 1;

-- Fail loudly if the email didn't match, instead of silently importing nothing.
do $$
begin
  if (select count(*) from _me) = 0 then
    raise exception 'No auth user found for that email — check YOUR_LOGIN_EMAIL above.';
  end if;
end $$;

-- 1) Make sure every category from the sheet exists (skips ones you already have).
create unique index if not exists categories_user_name_type_idx
  on categories (user_id, name, type);

insert into categories (user_id, name, type)
select (select user_id from _me), v.name, v.type
from (values
  ('Airfare', 'expense'),
  ('Airpods Pro 3', 'expense'),
  ('Bodycare & Barber', 'expense'),
  ('Casing hp', 'expense'),
  ('Clothing', 'expense'),
  ('Eating Out', 'expense'),
  ('Fuel', 'expense'),
  ('Gamesir Nova 2 Lite', 'expense'),
  ('Groceries', 'expense'),
  ('Gym Membership', 'expense'),
  ('Hobbies', 'expense'),
  ('Huawei Scale 3 Pro', 'expense'),
  ('Interest Income', 'income'),
  ('Internet', 'expense'),
  ('Investments', 'income'),
  ('Maintenance / Improvements', 'expense'),
  ('Medicine / Supplement', 'expense'),
  ('Misc.', 'income'),
  ('Office / Business', 'expense'),
  ('Part Time', 'income'),
  ('Public Transporation', 'expense'),
  ('Relation Fund', 'expense'),
  ('Relationship Saving', 'expense'),
  ('Rent', 'expense'),
  ('Repairs / Maintenance', 'expense'),
  ('Salary / Wages', 'income'),
  ('Tax', 'expense')
) as v(name, type)
on conflict (user_id, name, type) do nothing;

-- 2) Import every month's entries.
insert into entries (user_id, category_id, month, label, projected, actual)
select (select user_id from _me), c.id, v.month, v.name, v.projected, v.actual
from (values
  ('2025-12', 'Salary / Wages', 'income', 6500000, 7734000),
  ('2025-12', 'Interest Income', 'income', 0, 150000),
  ('2025-12', 'Rent', 'expense', 474411, 474411),
  ('2025-12', 'Internet', 'expense', 60000, 60000),
  ('2025-12', 'Tax', 'expense', 18500, 18500),
  ('2025-12', 'Fuel', 'expense', 127000, 127000),
  ('2025-12', 'Public Transporation', 'expense', 20000, 20000),
  ('2025-12', 'Repairs / Maintenance', 'expense', 375000, 375000),
  ('2025-12', 'Groceries', 'expense', 1034075, 1034075),
  ('2025-12', 'Clothing', 'expense', 445777, 445777),
  ('2025-12', 'Bodycare & Barber', 'expense', 90000, 90000),
  ('2025-12', 'Relationship Saving', 'expense', 100000, 120000),
  ('2025-12', 'Medicine / Supplement', 'expense', 20000, 20000),
  ('2025-12', 'Airfare', 'expense', 744000, 744000),
  ('2026-01', 'Salary / Wages', 'income', 7734000, 7734000),
  ('2026-01', 'Interest Income', 'income', 150000, 150000),
  ('2026-01', 'Rent', 'expense', 200000, 45000),
  ('2026-01', 'Internet', 'expense', 50000, 75000),
  ('2026-01', 'Tax', 'expense', 0, 18000),
  ('2026-01', 'Fuel', 'expense', 200000, 80500),
  ('2026-01', 'Repairs / Maintenance', 'expense', 0, 98739),
  ('2026-01', 'Groceries', 'expense', 1000000, 1406500),
  ('2026-01', 'Eating Out', 'expense', 200000, 0),
  ('2026-01', 'Clothing', 'expense', 0, 54770),
  ('2026-01', 'Relationship Saving', 'expense', 100000, 0),
  ('2026-01', 'Hobbies', 'expense', 0, 55500),
  ('2026-01', 'Office / Business', 'expense', 0, 417255),
  ('2026-01', 'Gym Membership', 'expense', 150000, 175000),
  ('2026-01', 'Medicine / Supplement', 'expense', 0, 5000),
  ('2026-02', 'Salary / Wages', 'income', 7734000, 7734000),
  ('2026-02', 'Interest Income', 'income', 150000, 250000),
  ('2026-02', 'Misc.', 'income', 0, 10000),
  ('2026-02', 'Rent', 'expense', 200000, 233850),
  ('2026-02', 'Internet', 'expense', 50000, 50000),
  ('2026-02', 'Maintenance / Improvements', 'expense', 0, 116115),
  ('2026-02', 'Tax', 'expense', 0, 7000),
  ('2026-02', 'Fuel', 'expense', 200000, 130000),
  ('2026-02', 'Repairs / Maintenance', 'expense', 0, 510585),
  ('2026-02', 'Groceries', 'expense', 1000000, 343150),
  ('2026-02', 'Eating Out', 'expense', 200000, 376263),
  ('2026-02', 'Clothing', 'expense', 0, 105000),
  ('2026-02', 'Relationship Saving', 'expense', 100000, 100000),
  ('2026-02', 'Office / Business', 'expense', 0, 701921),
  ('2026-02', 'Gym Membership', 'expense', 150000, 0),
  ('2026-02', 'Relation Fund', 'expense', 0, 95000),
  ('2026-03', 'Salary / Wages', 'income', 7734000, 8734000),
  ('2026-03', 'Interest Income', 'income', 150000, 400000),
  ('2026-03', 'Misc.', 'income', 0, 270000),
  ('2026-03', 'Rent', 'expense', 200000, 552900),
  ('2026-03', 'Internet', 'expense', 50000, 50000),
  ('2026-03', 'Tax', 'expense', 0, 8500),
  ('2026-03', 'Fuel', 'expense', 200000, 382500),
  ('2026-03', 'Groceries', 'expense', 1000000, 130300),
  ('2026-03', 'Eating Out', 'expense', 200000, 600300),
  ('2026-03', 'Bodycare & Barber', 'expense', 0, 283369),
  ('2026-03', 'Relationship Saving', 'expense', 100000, 100000),
  ('2026-03', 'Office / Business', 'expense', 0, 34700),
  ('2026-03', 'Gym Membership', 'expense', 150000, 0),
  ('2026-03', 'Medicine / Supplement', 'expense', 0, 63000),
  ('2026-04', 'Salary / Wages', 'income', 8734000, 7734000),
  ('2026-04', 'Part Time', 'income', 400000, 50000),
  ('2026-04', 'Investments', 'income', 0, 71343),
  ('2026-04', 'Misc.', 'income', 270000, 0),
  ('2026-04', 'Rent', 'expense', 552900, 917400),
  ('2026-04', 'Internet', 'expense', 50000, 50000),
  ('2026-04', 'Tax', 'expense', 8500, 17500),
  ('2026-04', 'Fuel', 'expense', 382500, 158000),
  ('2026-04', 'Repairs / Maintenance', 'expense', 0, 350000),
  ('2026-04', 'Groceries', 'expense', 130300, 32000),
  ('2026-04', 'Eating Out', 'expense', 600300, 533500),
  ('2026-04', 'Clothing', 'expense', 0, 50000),
  ('2026-04', 'Bodycare & Barber', 'expense', 283369, 64450),
  ('2026-04', 'Relationship Saving', 'expense', 100000, 0),
  ('2026-04', 'Office / Business', 'expense', 34700, 0),
  ('2026-04', 'Gym Membership', 'expense', 0, 2500000),
  ('2026-04', 'Medicine / Supplement', 'expense', 63000, 178300),
  ('2026-05', 'Salary / Wages', 'income', 7734000, 7734000),
  ('2026-05', 'Part Time', 'income', 50000, 250000),
  ('2026-05', 'Investments', 'income', 71343, 0),
  ('2026-05', 'Rent', 'expense', 917400, 330690),
  ('2026-05', 'Internet', 'expense', 50000, 50000),
  ('2026-05', 'Tax', 'expense', 17500, 17500),
  ('2026-05', 'Fuel', 'expense', 158000, 135000),
  ('2026-05', 'Repairs / Maintenance', 'expense', 350000, 0),
  ('2026-05', 'Groceries', 'expense', 32000, 208456),
  ('2026-05', 'Eating Out', 'expense', 533500, 377300),
  ('2026-05', 'Clothing', 'expense', 50000, 150000),
  ('2026-05', 'Bodycare & Barber', 'expense', 64450, 0),
  ('2026-05', 'Relationship Saving', 'expense', 0, 700000),
  ('2026-05', 'Office / Business', 'expense', 0, 40491),
  ('2026-05', 'Gym Membership', 'expense', 2500000, 0),
  ('2026-05', 'Medicine / Supplement', 'expense', 178300, 0),
  ('2026-05', 'Airpods Pro 3', 'expense', 0, 2700000),
  ('2026-05', 'Casing hp', 'expense', 0, 41098),
  ('2026-05', 'Gamesir Nova 2 Lite', 'expense', 0, 325150),
  ('2026-06', 'Salary / Wages', 'income', 7734000, 7734000),
  ('2026-06', 'Part Time', 'income', 250000, 425000),
  ('2026-06', 'Rent', 'expense', 330690, 1218300),
  ('2026-06', 'Internet', 'expense', 50000, 50000),
  ('2026-06', 'Tax', 'expense', 17500, 6000),
  ('2026-06', 'Fuel', 'expense', 135000, 85000),
  ('2026-06', 'Public Transporation', 'expense', 0, 90000),
  ('2026-06', 'Groceries', 'expense', 208456, 179000),
  ('2026-06', 'Eating Out', 'expense', 377300, 477251),
  ('2026-06', 'Clothing', 'expense', 150000, 0),
  ('2026-06', 'Bodycare & Barber', 'expense', 0, 98502),
  ('2026-06', 'Relationship Saving', 'expense', 700000, 0),
  ('2026-06', 'Office / Business', 'expense', 40491, 700000),
  ('2026-06', 'Medicine / Supplement', 'expense', 0, 878000),
  ('2026-06', 'Airpods Pro 3', 'expense', 2700000, 1382004),
  ('2026-06', 'Casing hp', 'expense', 41098, 61000),
  ('2026-06', 'Gamesir Nova 2 Lite', 'expense', 325150, 0),
  ('2026-07', 'Salary / Wages', 'income', 7734000, 0),
  ('2026-07', 'Part Time', 'income', 425000, 0),
  ('2026-07', 'Rent', 'expense', 1218300, 0),
  ('2026-07', 'Internet', 'expense', 50000, 0),
  ('2026-07', 'Tax', 'expense', 6000, 0),
  ('2026-07', 'Fuel', 'expense', 85000, 0),
  ('2026-07', 'Public Transporation', 'expense', 90000, 0),
  ('2026-07', 'Groceries', 'expense', 179000, 0),
  ('2026-07', 'Eating Out', 'expense', 477251, 0),
  ('2026-07', 'Bodycare & Barber', 'expense', 98502, 0),
  ('2026-07', 'Office / Business', 'expense', 700000, 0),
  ('2026-07', 'Medicine / Supplement', 'expense', 878000, 0),
  ('2026-07', 'Huawei Scale 3 Pro', 'expense', 1382004, 0),
  ('2026-07', 'Casing hp', 'expense', 61000, 0)
) as v(month, name, type, projected, actual)
join categories c
  on c.user_id = (select user_id from _me)
  and c.name = v.name
  and c.type = v.type;
