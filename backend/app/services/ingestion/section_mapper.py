from __future__ import annotations


def split_into_chunks(text: str, max_chars: int = 1800) -> list[dict]:
    chunks: list[dict] = []
    cursor = 0
    for index in range(0, len(text), max_chars):
        raw_text = text[index : index + max_chars].strip()
        if raw_text:
            chunks.append({"chunk_index": len(chunks), "chunk_type": "body", "char_start": cursor, "char_end": cursor + len(raw_text), "raw_text": raw_text})
        cursor += max_chars
    return chunks
