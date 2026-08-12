#!/usr/bin/env python3
"""Rebuild and verify the original standalone HTML from text-only payload chunks."""

from __future__ import annotations

import base64
import gzip
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
OUTPUT = ROOT / MANIFEST["source_file"]

parts = [
    (ROOT / "payload" / f"part-{index:02d}.b64").read_text(encoding="ascii").strip()
    for index in range(MANIFEST["parts"])
]
payload = "".join(parts).encode("ascii")

payload_hash = hashlib.sha256(payload).hexdigest()
if payload_hash != MANIFEST["payload_base64_sha256"]:
    raise SystemExit(
        "Payload SHA-256 mismatch: "
        f"expected {MANIFEST['payload_base64_sha256']}, got {payload_hash}"
    )

source = gzip.decompress(base64.b64decode(payload, validate=True))
source_hash = hashlib.sha256(source).hexdigest()
if source_hash != MANIFEST["source_sha256"]:
    raise SystemExit(
        "Source SHA-256 mismatch: "
        f"expected {MANIFEST['source_sha256']}, got {source_hash}"
    )

OUTPUT.write_bytes(source)
print(f"Created: {OUTPUT}")
print(f"Bytes:   {len(source)}")
print(f"SHA-256: {source_hash}")
