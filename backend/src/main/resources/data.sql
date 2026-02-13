DROP TABLE IF EXISTS subscriptions;

INSERT INTO subscriptions (name, category, currency, monthly_price, usage_count, usage_unit, target_usage_count, max_shared_users, current_shared_users, sharing_plan_price, start_date) 
VALUES ('넷플릭스 스탠다드', 'OTT', 'KRW', 17000, 5, '편', 4, 2, 1, 17000, '2024-03-01');

INSERT INTO subscriptions (name, category, currency, monthly_price, usage_count, usage_unit, target_usage_count, max_shared_users, current_shared_users, sharing_plan_price, start_date) 
VALUES ('유튜브 프리미엄', '영상', 'KRW', 14900, 60, '시간', 20, 6, 1, 29900, '2023-12-15');

INSERT INTO subscriptions (name, category, currency, monthly_price, usage_count, usage_unit, target_usage_count, max_shared_users, current_shared_users, sharing_plan_price, start_date) 
VALUES ('ChatGPT Plus', '생산성', 'USD', 23.00, 45, '회', 50, 1, 1, 0, '2024-01-05'); 

INSERT INTO subscriptions (name, category, currency, monthly_price, usage_count, usage_unit, target_usage_count, max_shared_users, current_shared_users, sharing_plan_price, start_date) 
VALUES ('Adobe Creative Cloud', '생산성', 'KRW', 24000, 10, '시간', 10, 1, 1, 0, '2023-11-20');