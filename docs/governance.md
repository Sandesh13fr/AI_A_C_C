# Governance

The platform is decision-support software. It cannot produce legal determinations, confirmed violations, enforcement recommendations, or legal advice.

## Allowed Finding Types

- `potential_risk`
- `possible_gap`
- `weak_commitment`
- `ambiguous_language`
- `needs_human_review`

## Backend Enforcement

`backend/app/core/governance.py` provides:

- allowed finding type checks
- forbidden phrase detection
- confidence range validation
- rule citation requirements
- jurisdiction requirement checks
- export sign-off gate checks
- chat response validation
- standard export disclaimer

## Export Rule

`external_publication` and `partner_share` exports must include a sign-off. Draft/internal outputs still carry the disclaimer.

## Chat Rule

Chat must stay scoped to a document, analysis run, rulebook, or selected retrieval context. If evidence is insufficient, the answer should say so rather than infer beyond retrieved context.
