export GIT_RESPOSITORY_URL=process.env.GIT_RESPOSITORY_URL

git clone "$GIT_RESPOSITORY_URL" /home/app/output

exec node script.mjs