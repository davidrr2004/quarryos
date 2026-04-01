import pypdf

reader = pypdf.PdfReader('quarryos-backend-spec.pdf')
text = '\n'.join([page.extract_text() for page in reader.pages])

with open('parsed_pdf.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("Extracted PDF to parsed_pdf.txt")
