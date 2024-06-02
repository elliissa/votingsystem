-- Create the users table to manage user roles
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       user_id VARCHAR(255) UNIQUE NOT NULL,
                       role VARCHAR(50) CHECK (role IN ('admin', 'voter', 'candidate', 'user')) DEFAULT 'user'
);

-- Create the queue table with a foreign key reference to users
CREATE TABLE queue (
                       id SERIAL PRIMARY KEY,
                       user_id VARCHAR(255) NOT NULL,
                       position INT NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create the candidates table
CREATE TABLE candidates (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL
);

-- Create the votes table with foreign key references to users and candidates
-- Ensure a user can vote for only one candidate
CREATE TABLE votes (
                       id SERIAL PRIMARY KEY,
                       user_id VARCHAR(255) NOT NULL UNIQUE,
                       candidate_id INT NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES users(user_id),
                       FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- Add indexes for performance optimization (optional but recommended)
CREATE INDEX idx_queue_user_id ON queue(user_id);
CREATE INDEX idx_queue_position ON queue(position);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
