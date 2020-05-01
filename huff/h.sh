    HUFFMAN="./huff.sh"
    FILE="test.txt"

    echo "======================================================="
    echo -n "$FILE compressed in "
     "$HUFFMAN" "$FILE" -c "$FILE".compressed
    echo -n "$FILE decompressed in "
     "$HUFFMAN" "$FILE".compressed -x "$FILE".decompressed
    cmp "$FILE" "$FILE".decompressed || echo "Decompressed file differs from original one!!!"