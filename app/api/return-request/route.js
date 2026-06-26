export async function POST(request) {
  try {
    const formData = await request.formData();

    const data = {
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      orderNumber: formData.get("orderNumber") || "",
      trackingNumber: formData.get("trackingNumber") || "",
      reason: formData.get("reason") || "",
      details: formData.get("details") || "",
      language: formData.get("language") || "en",
      photoCount: formData.getAll("photos").filter(Boolean).length
    };

    // Version 1 only collects requests. No paid return label is created.
    console.log("New return request:", data);

    return Response.json({
      ok: true,
      message: "Return request received.",
      request: data
    });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Return request failed.", error: error.message },
      { status: 500 }
    );
  }
}
