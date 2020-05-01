DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
node -r esm "$DIR/src/huff.js" $1 $2 $3