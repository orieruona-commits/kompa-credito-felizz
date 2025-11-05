import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentUrl, applicationId } = await req.json();

    if (!documentUrl || !applicationId) {
      throw new Error('Document URL and Application ID are required');
    }

    console.log('Starting document verification for application:', applicationId);

    // Get Lovable API key
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Download the document from storage
    console.log('Fetching document from URL:', documentUrl);
    const documentResponse = await fetch(documentUrl);
    if (!documentResponse.ok) {
      throw new Error('Failed to fetch document');
    }

    // Convert to base64
    const arrayBuffer = await documentResponse.arrayBuffer();
    const base64Document = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    // Determine MIME type from URL
    const fileExtension = documentUrl.split('.').pop()?.toLowerCase();
    let mimeType = 'application/pdf';
    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (fileExtension === 'png') {
      mimeType = 'image/png';
    }

    console.log('Sending document to AI for verification...');

    // Call Lovable AI Gateway for document verification
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an AI document verification assistant for a loan application system. Analyze uploaded documents and provide a structured assessment.

Your response MUST be valid JSON with this exact structure:
{
  "isComplete": boolean,
  "isValid": boolean,
  "confidence": number (0-100),
  "documentType": string,
  "findings": {
    "strengths": [string],
    "concerns": [string],
    "missingInformation": [string]
  },
  "extractedData": {
    "name": string or null,
    "idNumber": string or null,
    "date": string or null,
    "amount": string or null
  },
  "recommendation": "approve" | "review" | "reject",
  "reason": string
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this loan application supporting document. Check for: 1) Completeness - does it contain all necessary information? 2) Validity - does it appear legitimate? 3) Extract any relevant data (name, ID numbers, dates, amounts). Respond ONLY with the JSON structure specified.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Document}`
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI credits depleted. Please add credits to your workspace.');
      }
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('AI verification service unavailable');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No response from AI verification');
    }

    console.log('AI response received:', aiContent);

    // Parse AI response (should be JSON)
    let verificationResult;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      verificationResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: create a basic result
      verificationResult = {
        isComplete: false,
        isValid: false,
        confidence: 50,
        documentType: 'unknown',
        findings: {
          strengths: [],
          concerns: ['Unable to fully analyze document'],
          missingInformation: []
        },
        extractedData: {},
        recommendation: 'review',
        reason: 'Document requires manual review due to analysis error'
      };
    }

    // Determine status based on AI recommendation
    let status = 'pending';
    if (verificationResult.recommendation === 'approve' && verificationResult.confidence >= 80) {
      status = 'verified';
    } else if (verificationResult.recommendation === 'reject') {
      status = 'rejected';
    }

    // Update application with verification results
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabase
      .from('applications')
      .update({
        document_verification_status: status,
        document_verification_result: verificationResult,
        document_verified_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application:', updateError);
      throw updateError;
    }

    console.log('Document verification completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        status,
        result: verificationResult,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in verify-document function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
