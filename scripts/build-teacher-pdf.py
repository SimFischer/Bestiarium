import json
import subprocess
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets/teacher/Bestiarium-Lehrkraefte-Spickzettel.pdf"
SOURCE = """
import { teacherGuideConfig, teacherGuideBlockRows } from './js/teacher-guide.js';
const guide = structuredClone(teacherGuideConfig);
for (const tab of guide.tabs) for (const block of tab.blocks || []) block.rows = teacherGuideBlockRows(block);
console.log(JSON.stringify(guide));
"""
guide = json.loads(subprocess.check_output(
    ["node", "--input-type=module", "-e", SOURCE], cwd=ROOT, encoding="utf-8"
))
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
INK = colors.HexColor("#493523")
GOLD = colors.HexColor("#a68045")
PAPER = colors.HexColor("#fcf7ea")
LINE = colors.HexColor("#d7c3a0")
WIDTH = A4[0] - 32 * mm
styles = {
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5,
                           leading=14.3, textColor=INK, spaceAfter=7,
                           splitLongWords=True, alignment=TA_LEFT),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=10,
                            leading=13.5, textColor=INK, spaceAfter=4),
    "title": ParagraphStyle("title", fontName="Times-Bold", fontSize=24,
                            leading=28, textColor=INK, spaceAfter=14, keepWithNext=True),
    "heading": ParagraphStyle("heading", fontName="Times-Bold", fontSize=15,
                              leading=18, textColor=INK, spaceBefore=12,
                              spaceAfter=8, keepWithNext=True),
    "card": ParagraphStyle("card", fontName="Times-Bold", fontSize=12,
                           leading=15, textColor=INK, spaceAfter=5, keepWithNext=True),
    "label": ParagraphStyle("label", fontName="Helvetica-Bold", fontSize=10,
                            leading=13.5, textColor=INK),
    "motto": ParagraphStyle("motto", fontName="Times-BoldItalic", fontSize=14,
                            leading=19, textColor=INK, spaceAfter=0),
}


def paragraph(text, style="body"):
    text = text.replace("→", " > ").replace("☐", "[ ]")
    return Paragraph(escape(text), styles[style])


def boxed(rows, widths, header=False):
    table = Table(rows, colWidths=widths, hAlign="LEFT", repeatRows=1 if header else 0)
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LINEBELOW", (0, 0), (-1, -1), .5, LINE),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [PAPER, colors.white]),
    ]))
    if header:
        table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#efdfbd"))]))
    return table


def prose(data, story):
    for text in data.get("paragraphs", []):
        story.append(paragraph(text))
    for text in data.get("items", data.get("checklist", [])):
        item = Table([[paragraph("[ ]" if "checklist" in data else "•", "small"), paragraph(text)]],
                     colWidths=[14, WIDTH - 14])
        item.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 1),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(item)
    cards = data.get("cards", [])
    for i in range(0, len(cards), 2):
        cells = [[paragraph(label, "card"), paragraph(text, "small")] for label, text in cards[i:i + 2]]
        if len(cells) == 1:
            cells.append("")
        story.extend([boxed([cells], [WIDTH / 2, WIDTH / 2]), Spacer(1, 6)])


def furniture(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(.8)
    canvas.line(16 * mm, A4[1] - 13 * mm, A4[0] - 16 * mm, A4[1] - 13 * mm)
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(16 * mm, A4[1] - 10 * mm, "BESTIARIUM  |  Lehrkrafthilfe")
    canvas.drawString(16 * mm, 11 * mm, "Smartboard, Begleitpräsentation und analoge Unterrichtsmaterialien")
    canvas.drawRightString(A4[0] - 16 * mm, 11 * mm, f"{doc.page}")
    canvas.restoreState()


story = []
for index, tab in enumerate(guide["tabs"]):
    if index:
        story.append(PageBreak())
    story.append(paragraph(tab["title"], "title"))
    prose(tab, story)
    if tab.get("motto"):
        story.extend([boxed([[paragraph(tab["motto"], "motto")]], [WIDTH]), Spacer(1, 9)])
    for number, block in enumerate(tab.get("blocks", []), 1):
        rows = [[paragraph(label, "label"), paragraph(text)] for label, text in block["rows"]]
        story.append(KeepTogether([
            paragraph(f'{number}. {block["title"]}', "heading"),
            boxed(rows, [89, WIDTH - 89]),
        ]))
    for section in tab.get("sections", []):
        story.append(paragraph(section["title"], "heading"))
        prose(section, story)
    if tab.get("problems"):
        rows = [[paragraph("Problem", "label"), paragraph("Lösung", "label")]]
        rows += [[paragraph(problem, "label"), paragraph(solution)] for problem, solution in tab["problems"]]
        story.append(boxed(rows, [145, WIDTH - 145], header=True))

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=16 * mm,
                        leftMargin=16 * mm, topMargin=20 * mm, bottomMargin=20 * mm,
                        title="Bestiarium – Lehrkräfte-Spickzettel", author="Bestiarium",
                        invariant=1, pageCompression=1)
doc.build(story, onFirstPage=furniture, onLaterPages=furniture)
print(OUTPUT)
