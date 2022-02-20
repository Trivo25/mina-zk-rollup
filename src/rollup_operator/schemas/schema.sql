-- CREATE TABLE pending_transactions (
--   transaction_id SERIAL PRIMARY KEY,
--   from varchar(55) NOT NULL,
--   to varchar(255) NOT NULL,
-- 	pending boolean DEFAULT true,
--   time_added timestamp NOT NULL DEFAULT NOW(),

--   FOREIGN KEY (from) REFERENCES accounts(public_key) ON DELETE CASCADE,
--   FOREIGN KEY (to) REFERENCES accounts(public_key) ON DELETE CASCADE
-- );

-- CREATE TABLE accounts (
--   public_key varchar(55) NOT NULL,
--   nonce integer NOT NULL,
--   balance bigint NOT NULL,
--   PRIMARY KEY (public_key),
--   UNIQUE (public_key)
-- )