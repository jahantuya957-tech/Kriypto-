CREATE TABLE signals (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20),
  timeframe VARCHAR(10),
  strategy TEXT,
  signal VARCHAR(10),
  entry_price NUMERIC,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  score INT,
  grade VARCHAR(5),
  status VARCHAR(20),
  entry_time TIMESTAMP,
  exit_time TIMESTAMP,
  profit_percent NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signal_tracking (
  id SERIAL PRIMARY KEY,
  signal_id INT,
  current_price NUMERIC,
  highest_price NUMERIC,
  lowest_price NUMERIC,
  current_profit NUMERIC,
  drawdown NUMERIC,
  tp_hit BOOLEAN DEFAULT FALSE,
  sl_hit BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20),
  enabled BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  scanner_interval INT DEFAULT 60,
  tp_percent NUMERIC DEFAULT 2,
  sl_percent NUMERIC DEFAULT 1,
  minimum_score INT DEFAULT 70,
  active BOOLEAN DEFAULT TRUE
);
