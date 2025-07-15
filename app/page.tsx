"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Download } from "lucide-react"
import jsPDF from "jspdf"

interface FormData {
  date: string
  time: string
  illnessCause: string
  serverRequired: string
  canGetOver: string
  reasons: string[]
  additionalComments: string
}

export default function SwedishFormPage() {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    time: "",
    illnessCause: "",
    serverRequired: "",
    canGetOver: "",
    reasons: [],
    additionalComments: "",
  })

  const reasonOptions = [
    "Jag är en idiot",
    "Jag är en grinolle",
    "Jag är tunnhudad/vek",
    "Jag är en liten bitch",
    "Jag vill ha tutte",
    "Jag kände mig påhoppad",
    "Jag är bättre än alla andra",
    "Jag är pryd",
    "Det var inte mitt skämt",
    "Livet är bara så orättvist",
    "Ingen gillade mina selfies idag",
    "Annat (förtydliga nedan)",
  ]

  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        reasons: [...prev.reasons, reason],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        reasons: prev.reasons.filter((r) => r !== reason),
      }))
    }
  }

  const generatePDF = () => {
    const pdf = new jsPDF()

  // Set PDF metadata
  pdf.setProperties({
    title: "Lättkänslighetsrapport",
    subject: "Lättkänslighetsrapport PDF Export"
  });

  // Get page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // === 1. Background Color ===
  pdf.setFillColor(211, 208, 162); // Light beige background
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // === 2. Black Header Bar ===
  pdf.setFillColor(0, 0, 0); // Black
  pdf.rect(15, 15, 180, 15, "F");

  // Header Text
  pdf.setTextColor(255, 255, 255); // White text
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("LÄTTKÄNKHETSRAPPORT", 105, 26, { align: "center" });

  // === 3. Body ===
  pdf.setTextColor(0, 0, 0); // Reset to black text
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);

  let yPos = 45;

    // Date and time section
    pdf.setFont("helvetica", "bold")
    pdf.text("Datum för kränkning:", 20, yPos)
    pdf.setFont("helvetica", "normal")
    pdf.text(formData.date || "_____________", 75, yPos)

    pdf.setFont("helvetica", "bold")
    pdf.text("Tid:", 140, yPos)
    pdf.setFont("helvetica", "normal")
    pdf.text(formData.time || "_______", 155, yPos)

    yPos += 15

    // Illness cause section
    pdf.setFont("helvetica", "bold")
    pdf.text("Vad orsakade kränkningen?", 20, yPos)
    yPos += 10

    pdf.setFont("helvetica", "normal")
    const checkbox1 = formData.illnessCause === "posted" ? "[X]" : "[ ]"
    const checkbox2 = formData.illnessCause === "image" ? "[X]" : "[ ]"

    pdf.text(`${checkbox1} Någon postade den`, 25, yPos)
    pdf.text(`${checkbox2} Kränkande bild på Nätet`, 110, yPos)
    yPos += 15

    // Server required section
    pdf.setFont("helvetica", "bold")
    pdf.text("Krävdes en servett för tårarna?", 20, yPos)
    yPos += 10

    pdf.setFont("helvetica", "normal")
    const serverYes = formData.serverRequired === "yes" ? "[X]" : "[ ]"
    const serverNo = formData.serverRequired === "no" ? "[X]" : "[ ]"

    pdf.text(`${serverYes} Ja`, 25, yPos)
    pdf.text(`${serverNo} Nej`, 70, yPos)
    yPos += 15

    // Can get over section
    pdf.setFont("helvetica", "bold")
    pdf.text("Tror du att du kan komma över detta?", 20, yPos)
    yPos += 10

    pdf.setFont("helvetica", "normal")
    const overYes = formData.canGetOver === "yes" ? "[X]" : "[ ]"
    const overNo = formData.canGetOver === "no" ? "[X]" : "[ ]"
    const overConfused = formData.canGetOver === "confused" ? "[X]" : "[ ]"

    pdf.text(`${overYes} Ja`, 25, yPos)
    pdf.text(`${overNo} Nej`, 70, yPos)
    pdf.text(`${overConfused} Jag förstår inte frågan`, 115, yPos)
    yPos += 20

    // Reasons section
    pdf.setFont("helvetica", "bold")
    pdf.text("Orsak till rapporten (kryssa i flera eller alla alternativ)", 20, yPos)
    yPos += 12

    pdf.setFont("helvetica", "normal")
    const leftColumnReasons = reasonOptions.slice(0, 6)
    const rightColumnReasons = reasonOptions.slice(6, 12)

    // Left column
    leftColumnReasons.forEach((reason, index) => {
      const isChecked = formData.reasons.includes(reason)
      const checkbox = isChecked ? "[X]" : "[ ]"
      pdf.text(`${checkbox} ${reason}`, 25, yPos + index * 10)
    })

    // Right column
    rightColumnReasons.forEach((reason, index) => {
      const isChecked = formData.reasons.includes(reason)
      const checkbox = isChecked ? "[X]" : "[ ]"
      pdf.text(`${checkbox} ${reason}`, 110, yPos + index * 10)
    })

    yPos += 70

    // Additional comments section
    pdf.setFont("helvetica", "bold")
    pdf.text("Ytterligare kommentarer:", 20, yPos)
    yPos += 15

    pdf.setFont("helvetica", "normal")

    // Draw lines for the comment area with proper spacing
    const lineSpacing = 15
    for (let i = 0; i < 4; i++) {
      pdf.line(20, yPos + i * lineSpacing, 190, yPos + i * lineSpacing)
    }

    // Add the actual comments if they exist - position text properly on the lines
    if (formData.additionalComments.trim()) {
      const lines = pdf.splitTextToSize(formData.additionalComments, 165)
      // Position each line of text properly on the corresponding line
      lines.forEach((line: string, index: number) => {
        if (index < 4) {
          // Only show up to 4 lines
          pdf.text(line, 22, yPos + index * lineSpacing - 3)
        }
      })
    }

    yPos += 25

    // Footer note
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "italic")
    const footerText = "(Om du anser dig vara mer utbildad än andra, vänligen bifoga bilaga. Max 10st A4)"
    pdf.text(footerText, 20, yPos + 27)

    // Calculate final position after footer with proper padding
    const finalYPos = yPos + 25

    // Add border around the entire form - ensure it encompasses all content properly
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(1)
    pdf.rect(10, 10, 190, finalYPos - 5)

    pdf.save("lattkankthetsrapport.pdf")
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-yellow-100 border-2 border-black">
          <CardHeader className="bg-black text-white text-center">
            <h1 className="text-2xl font-bold">LÄTTKÄNKHETSRAPPORT</h1>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Date and Time */}
            <div className="flex gap-4 items-center">
              <Label className="font-semibold">Datum för kränkning:</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-40"
              />
              <Label className="font-semibold ml-4">Tid:</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="w-32"
              />
            </div>

            {/* Illness Cause */}
            <div>
              <Label className="font-semibold block mb-2">Vad orsakade kränkningen?</Label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="posted"
                    checked={formData.illnessCause === "posted"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, illnessCause: checked ? "posted" : "" }))
                    }
                  />
                  <Label htmlFor="posted">Någon postade den</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="image"
                    checked={formData.illnessCause === "image"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, illnessCause: checked ? "image" : "" }))
                    }
                  />
                  <Label htmlFor="image">Kränkande bild på Nätet</Label>
                </div>
              </div>
            </div>

            {/* Server Required */}
            <div>
              <Label className="font-semibold block mb-2">Krävdes en servett för tårarna?</Label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="server-yes"
                    checked={formData.serverRequired === "yes"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, serverRequired: checked ? "yes" : "" }))
                    }
                  />
                  <Label htmlFor="server-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="server-no"
                    checked={formData.serverRequired === "no"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, serverRequired: checked ? "no" : "" }))
                    }
                  />
                  <Label htmlFor="server-no">Nej</Label>
                </div>
              </div>
            </div>

            {/* Can Get Over */}
            <div>
              <Label className="font-semibold block mb-2">Tror du att du kan komma över detta?</Label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="over-yes"
                    checked={formData.canGetOver === "yes"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, canGetOver: checked ? "yes" : "" }))
                    }
                  />
                  <Label htmlFor="over-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="over-no"
                    checked={formData.canGetOver === "no"}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, canGetOver: checked ? "no" : "" }))}
                  />
                  <Label htmlFor="over-no">Nej</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="over-confused"
                    checked={formData.canGetOver === "confused"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, canGetOver: checked ? "confused" : "" }))
                    }
                  />
                  <Label htmlFor="over-confused">Jag förstår inte frågan</Label>
                </div>
              </div>
            </div>

            {/* Reasons */}
            <div>
              <Label className="font-semibold block mb-2">
                Orsak till rapporten (kryssa i flera eller alla alternativ)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {reasonOptions.map((reason, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`reason-${index}`}
                      checked={formData.reasons.includes(reason)}
                      onCheckedChange={(checked) => handleReasonChange(reason, checked as boolean)}
                    />
                    <Label htmlFor={`reason-${index}`} className="text-sm">
                      {reason}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Comments */}
            <div>
              <Label className="font-semibold block mb-2">Ytterligare kommentarer:</Label>
              <Textarea
                value={formData.additionalComments}
                onChange={(e) => setFormData((prev) => ({ ...prev, additionalComments: e.target.value }))}
                placeholder="Skriv dina ytterligare kommentarer här..."
                className="min-h-[100px]"
              />
            </div>

            {/* Footer Note */}
            <div className="text-sm italic text-gray-600 border-t pt-4">
              (Om du anser dig vara mer utbildad än andra, vänligen bifoga bilaga. Max 10st A4)
            </div>

            {/* Export Button */}
            <div className="flex justify-center pt-4">
              <Button onClick={generatePDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportera som PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
