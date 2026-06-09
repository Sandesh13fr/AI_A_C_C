from __future__ import annotations


def compile_rulebook(rulebook: dict, rules: list[dict]) -> dict:
    return {"rulebook": rulebook, "rules": rules, "compiled": True}
