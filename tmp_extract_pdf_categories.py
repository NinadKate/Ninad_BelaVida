from pypdf import PdfReader
import re

pdf_path = r"d:\kinesis-projects\bellavida\prd\NEW PRODUCTS CATALOG OCT 25.pdf"
reader = PdfReader(pdf_path)
text = "\n".join((page.extract_text() or "") for page in reader.pages)
lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
lines = [line for line in lines if line]

candidates = []
for line in lines:
    if 2 <= len(line) <= 35 and re.fullmatch(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ&/ +'-]+", line):
        alpha_count = sum(ch.isalpha() for ch in line)
        if alpha_count >= 3:
            candidates.append(line)

unique = []
for value in candidates:
    if value not in unique:
        unique.append(value)

print(f"PAGES {len(reader.pages)}")
print(f"TEXT_CHARS {len(text)}")
print("CANDIDATE_LINES")
for item in unique[:400]:
    print(item)
