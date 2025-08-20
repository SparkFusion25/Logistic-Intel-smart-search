import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false });
  
  const {
    customer_name,
    customer_email,
    origin,
    destination,
    mode,
    cargo_description,
    weight,
    dimensions,
    incoterm,
    estimated_cost,
    valid_until,
    notes
  } = req.body || {};

  try {
    // Generate quote ID
    const quoteId = `QTE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Logistics Quote', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Quote ID: ${quoteId}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Valid Until: ${valid_until || 'N/A'}`, 20, 70);
    
    doc.text('Customer Details:', 20, 90);
    doc.text(`Name: ${customer_name || 'N/A'}`, 25, 100);
    doc.text(`Email: ${customer_email || 'N/A'}`, 25, 110);
    
    doc.text('Shipment Details:', 20, 130);
    doc.text(`Origin: ${origin || 'N/A'}`, 25, 140);
    doc.text(`Destination: ${destination || 'N/A'}`, 25, 150);
    doc.text(`Mode: ${mode || 'N/A'}`, 25, 160);
    doc.text(`Cargo: ${cargo_description || 'N/A'}`, 25, 170);
    doc.text(`Weight: ${weight || 'N/A'}`, 25, 180);
    doc.text(`Dimensions: ${dimensions || 'N/A'}`, 25, 190);
    doc.text(`Incoterm: ${incoterm || 'N/A'}`, 25, 200);
    
    doc.text(`Estimated Cost: $${estimated_cost || '0'}`, 20, 220);
    
    if (notes) {
      doc.text('Notes:', 20, 240);
      doc.text(notes, 25, 250);
    }
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // Upload PDF to Supabase Storage
    const fileName = `quotes/${quoteId}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ success: false, error: 'Failed to upload PDF' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Store quote record
    const { error: dbError } = await supabase
      .from('quotes')
      .insert({
        quote_id: quoteId,
        customer_name,
        customer_email,
        origin,
        destination,
        mode,
        cargo_description,
        weight,
        dimensions,
        incoterm,
        estimated_cost: estimated_cost ? Number(estimated_cost) : null,
        valid_until,
        notes,
        pdf_url: urlData.publicUrl,
        status: 'draft'
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return res.status(200).json({
      success: true,
      quoteId,
      pdf_url: urlData.publicUrl,
      html_preview: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Logistics Quote</h1>
          <p><strong>Quote ID:</strong> ${quoteId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Valid Until:</strong> ${valid_until || 'N/A'}</p>
          <h2>Customer Details</h2>
          <p><strong>Name:</strong> ${customer_name || 'N/A'}</p>
          <p><strong>Email:</strong> ${customer_email || 'N/A'}</p>
          <h2>Shipment Details</h2>
          <p><strong>Origin:</strong> ${origin || 'N/A'}</p>
          <p><strong>Destination:</strong> ${destination || 'N/A'}</p>
          <p><strong>Mode:</strong> ${mode || 'N/A'}</p>
          <p><strong>Cargo:</strong> ${cargo_description || 'N/A'}</p>
          <p><strong>Weight:</strong> ${weight || 'N/A'}</p>
          <p><strong>Dimensions:</strong> ${dimensions || 'N/A'}</p>
          <p><strong>Incoterm:</strong> ${incoterm || 'N/A'}</p>
          <h2>Pricing</h2>
          <p><strong>Estimated Cost:</strong> $${estimated_cost || '0'}</p>
          ${notes ? `<h2>Notes</h2><p>${notes}</p>` : ''}
        </div>
      `
    });
  } catch (error) {
    console.error('Quote generation error:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate quote' });
  }
}