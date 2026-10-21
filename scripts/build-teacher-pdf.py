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
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets/teacher/Bestiarium-Lehrkraefte-Spickzettel.pdf"
SOURCE = """
import { teacherGuideConfig, teacherGuideMilestoneLabel } from './js/teacher-guide.js';
const guide = structuredClone(teacherGuideConfig);
for (const tab of guide.tabs) for (const block of tab.blocks || []) block.milestoneLabel = teacherGuideMilestoneLabel(block);
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
WIDTH = A4[0] - 28 * mm
styles = {
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.3,
                           leading=13, textColor=INK, spaceAfter=6,
                           splitLongWords=True, alignment=TA_LEFT),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=10,
                            leading=12.5, textColor=INK, spaceAfter=4),
    "title": ParagraphStyle("title", fontName="Times-Bold", fontSize=24,
                            leading=28, textColor=INK, spaceAfter=14, keepWithNext=True),
    "heading": ParagraphStyle("heading", fontName="Times-Bold", fontSize=15,
                              leading=18, textColor=INK, spaceBefore=12,
                              spaceAfter=7, keepWithNext=True),
    "card": ParagraphStyle("card", fontName="Times-Bold", fontSize=12,
                           leading=15, textColor=INK, spaceAfter=5, keepWithNext=True),
    "label": ParagraphStyle("label", fontName="Helvetica-Bold", fontSize=10,
                            leading=12.5, textColor=INK),
    "motto": ParagraphStyle("motto", fontName="Times-BoldItalic", fontSize=14,
                            leading=19, textColor=INK, spaceAfter=0),
}


def paragraph(text, style="body", label=None):
    text = text.replace("→", " > ").replace("☐", "[ ]")
    return Paragraph((f"<b>{escape(label)}.</b> " if label else "") + escape(text).replace("\n", "<br/>"), styles[style])


def boxed(rows, widths, header=False, padding=5, background=None):
    table = Table(rows, colWidths=widths, hAlign="LEFT", repeatRows=1 if header else 0)
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), padding),
        ("BOTTOMPADDING", (0, 0), (-1, -1), padding),
        ("LINEBELOW", (0, 0), (-1, -1), .5, LINE),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [PAPER, colors.white]),
    ]))
    if header:
        table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dfc18c"))]))
    if background:
        table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(background))]))
    return table


def prose(data, story):
    for text in data.get("paragraphs", []):
        story.append(paragraph(text))


def note(title, texts, width=WIDTH, green=False, checklist=False):
    body = [paragraph(title, "card")]
    body += [paragraph(("[ ] " if checklist else "") + text, "small") for text in texts]
    return boxed([[body]], [width], background="#e8eedf" if green else "#f6e8c9")


def columns(left, right):
    table = Table([[left, right]], colWidths=[WIDTH / 2, WIDTH / 2], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("RIGHTPADDING", (0, 0), (0, 0), 8),
        ("LEFTPADDING", (1, 0), (1, 0), 8),
        ("RIGHTPADDING", (1, 0), (1, 0), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return table


def problems_table(problems, width=WIDTH, compact=False):
    rows = [[paragraph("Problem", "label"), paragraph("Lösung", "label")]]
    rows += [[paragraph(problem, "label"), paragraph(solution, "small")] for problem, solution in problems]
    fraction = .38 if width < WIDTH else .29
    return boxed(rows, [width * fraction, width * (1 - fraction)], header=True, padding=3 if compact else 4)


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


overview, quick, sequence, problems = guide["tabs"]
story = [paragraph("BESTIARIUM", "title"), paragraph(overview["subtitle"]),
         paragraph("Worum geht es?", "card")]
prose({"paragraphs": overview["paragraphs"]}, story)
story += [boxed([[paragraph(overview["motto"], "motto")]], [WIDTH]), Spacer(1, 10)]
half = WIDTH / 2 - 8
left = [paragraph("So ist die App aufgebaut", "card")]
for label, text in overview["cards"]:
    left.extend([paragraph(text, "small", label), Spacer(1, 5)])
right = [paragraph("Gut zu wissen", "card")]
right += [paragraph("• " + text, "small") for text in overview["knowledge"]]
right += [Spacer(1, 8), paragraph("Unterrichtsweg", "card"),
          paragraph(" → ".join(overview["route"]), "small"), Spacer(1, 8),
          note("Vor der ersten Stunde", overview["preparation"], half, checklist=True)]
story += [columns(left, right), Spacer(1, 9),
          note("Reale und phantastische Tiere", overview["didactics"], green=True), PageBreak()]

story += [paragraph(quick["title"], "title")]
left = [paragraph("Im Unterricht", "heading")]
for label, text in quick["cards"]:
    left.extend([paragraph(text, "small", label), Spacer(1, 5)])
left += [note(quick["notes"][0][0], quick["notes"][0][1], half), Spacer(1, 8),
         note(quick["notes"][1][0], quick["notes"][1][1], half)]
right = [paragraph("Wenn etwas hakt – Kurzfassung", "heading"),
         problems_table(quick["quickProblems"], half, compact=True), Spacer(1, 9),
         note(quick["notes"][2][0], quick["notes"][2][1], half)]
story += [columns(left, right), PageBreak(), paragraph("Unterrichtsverlauf", "title")]
story += [paragraph(text, "small") for text in sequence["notes"][1:]]
story += [note("Drei Ebenen", ["APP: Rahmen & Freischaltungen · PRÄSENTATION: Unterrichtsführung · MATERIAL: analoge Schülerarbeit"])]
for number, block in enumerate(sequence["blocks"], 1):
    rows = [[paragraph(f'{number}. {block["title"]}', "heading"), "", ""],
            [paragraph("Ziel: " + block["focus"], "small"), "", ""],
            [note("Du brauchst", ["MATERIAL · " + block["material"], "PRÄSENTATION · " + block["presentation"]], WIDTH - 12), "", ""],
            [paragraph("Phase", "label"), paragraph("Was machst du?", "label"), paragraph("Material / App", "label")]]
    for phase in block["phases"]:
        rows.append([paragraph(phase["phase"].replace(" · ", "\n"), "label"), paragraph(phase["action"], "small"),
                     [paragraph(phase["medium"], "label"), paragraph(phase["reference"], "small")]])
    rows.append([paragraph(block["milestoneLabel"], "small"), "", ""])
    if block.get("tips"):
        rows.append([note("Differenzierung", block["tips"], WIDTH - 12, green=True), "", ""])
    flow = boxed(rows, [85, WIDTH - 191, 106], padding=4)
    flow.repeatRows = (0, 3)
    flow.setStyle(TableStyle([
        *[("SPAN", (0, i), (-1, i)) for i in [0, 1, 2, 4 + len(block["phases"])]],
        ("BACKGROUND", (0, 0), (-1, 2), colors.white),
        ("LINEBELOW", (0, 0), (-1, 2), 0, colors.white),
        ("BACKGROUND", (0, 3), (-1, 3), colors.HexColor("#dfc18c")),
        ("LEFTPADDING", (0, 0), (-1, 2), 0),
        ("RIGHTPADDING", (0, 0), (-1, 2), 0),
        ("TOPPADDING", (0, 0), (-1, 2), 1),
        ("BOTTOMPADDING", (0, 0), (-1, 2), 2),
        ("NOSPLIT", (0, 0), (-1, 4)),
        ("NOSPLIT", (0, 3 + len(block["phases"])), (-1, -1)),
    ]))
    if block.get("tips"):
        flow.setStyle(TableStyle([("SPAN", (0, len(rows) - 1), (-1, len(rows) - 1))]))
    medium_colors = {"APP": "#f1dfb9", "PRÄSENTATION": "#e2ebef", "MATERIAL": "#e6ecdc"}
    flow.setStyle(TableStyle([("BACKGROUND", (2, i), (2, i), colors.HexColor(medium_colors[phase["medium"]]))
                              for i, phase in enumerate(block["phases"], 4)]))
    story.extend([flow, Spacer(1, 8)])
for section in sequence.get("sections", []):
    story.append(paragraph(section["title"], "heading"))
    prose(section, story)
story += [PageBreak(), paragraph(problems["title"], "title")]
prose(problems, story)
story.append(problems_table(problems["problems"], compact=True))

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=14 * mm,
                        leftMargin=14 * mm, topMargin=19 * mm, bottomMargin=18 * mm,
                        title="Bestiarium – Lehrkräfte-Spickzettel", author="Bestiarium",
                        invariant=1, pageCompression=1)
doc.build(story, onFirstPage=furniture, onLaterPages=furniture)
print(OUTPUT)
