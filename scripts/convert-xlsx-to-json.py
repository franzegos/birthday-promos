#!/usr/bin/env python3
"""Convert Philippine_Birthday_Promos_Database_2026.xlsx to src/data/birthday-promos.json."""

from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "Philippine_Birthday_Promos_Database_2026.xlsx"
OUT = ROOT / "src" / "data" / "birthday-promos.json"

HEADER_MAP = {
    "Brand": "brand",
    "Category": "category",
    "Niche": "niche",
    "Offer": "offer",
    "Offer Value (PHP est.)": "offerValuePhpEst",
    "Exact Birthday": "exactBirthday",
    "Birth Month": "birthMonth",
    "Other Validity Period": "otherValidityPeriod",
    "Required Companions": "requiredCompanions",
    "Minimum Spend (PHP)": "minimumSpendPhp",
    "Membership Required": "membershipRequired",
    "App Required": "appRequired",
    "Card Required": "cardRequired",
    "ID Requirement": "idRequirement",
    "Reservation Required": "reservationRequired",
    "Participating Branches": "participatingBranches",
    "Location / Region": "locationRegion",
    "Blackout Dates": "blackoutDates",
    "Promo Validity End": "promoValidityEnd",
    "Official Source URL": "officialSourceUrl",
    "Other Sources": "otherSources",
    "Source Type": "sourceType",
    "Verification Status": "verificationStatus",
    "Last Checked": "lastChecked",
    "Notes": "notes",
}


def serialize(value: object) -> object:
    if value is None:
        return None
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, str):
        stripped = value.strip()
        return stripped if stripped else None
    return value


def main() -> None:
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb["Birthday Promos"]
    rows = list(ws.iter_rows(values_only=True))
    headers = [header.strip() if header else header for header in rows[0]]
    keys = [HEADER_MAP[header] for header in headers]

    promos = []
    for row in rows[1:]:
        if not row or not row[0]:
            continue
        promos.append(
            {key: serialize(value) for key, value in zip(keys, row, strict=True)}
        )

    output = {
        "meta": {
            "title": "Ultimate Philippine Birthday Promos Database",
            "compiled": "2026-09-10",
            "totalEntries": len(promos),
            "sourceFile": XLSX.name,
        },
        "promos": promos,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(promos)} promos to {OUT}")


if __name__ == "__main__":
    main()
