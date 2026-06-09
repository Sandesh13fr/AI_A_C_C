from __future__ import annotations


def precision_recall_f1(true_positive: int, false_positive: int, false_negative: int) -> dict:
    precision = true_positive / max(1, true_positive + false_positive)
    recall = true_positive / max(1, true_positive + false_negative)
    f1 = 2 * precision * recall / max(0.0001, precision + recall)
    return {"precision": precision, "recall": recall, "f1": f1}
