#!/bin/sh

# Ensure the environment variable is correctly passed
if [ -z "$GIT_RESPOSITORY_URL" ]; then
  echo "Error: GIT_RESPOSITORY_URL is not set"
  exit 1
fi

echo "Cloning repository: $GIT_RESPOSITORY_URL"

# Clone the repository
git clone "$GIT_RESPOSITORY_URL" /home/app/output || {
  echo "Error: Failed to clone repository"
  exit 1
}

# Run the Node.js script
exec node /home/app/script.mjs
