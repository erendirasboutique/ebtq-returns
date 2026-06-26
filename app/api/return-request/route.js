function getEnv(name, fallback = "") {
  return process.env[name] || fallback;
}
async function saveReturnToGoogleSheets(returnData) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Missing GOOGLE_SHEETS_WEBHOOK_URL");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(returnData)
    });
  } catch (error) {
    console.error("Google Sheets save failed:", error);
  }
}

function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      return value !== undefined && value !== null && String(value).trim() !== "";
    })
  );
}

function pickCheapestRate(rates, preferredCarrier) {
  const validRates = Array.isArray(rates)
    ? rates.filter((rate) => rate.object_id && rate.amount)
    : [];

  if (validRates.length === 0) return null;

  const carrierRates = preferredCarrier
    ? validRates.filter((rate) =>
        String(rate.provider || "")
          .toLowerCase()
          .includes(String(preferredCarrier).toLowerCase())
      )
    : validRates;

  const pool = carrierRates.length > 0 ? carrierRates : validRates;

  return pool.sort((a, b) => Number(a.amount) - Number(b.amount))[0];
}

function carrierTrackingUrl(carrier, trackingNumber) {
  if (!trackingNumber) return null;

  const c = String(carrier || "").toLowerCase();

  if (c.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${encodeURIComponent(
      trackingNumber
    )}`;
  }

  if (c.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(
      trackingNumber
    )}`;
  }

  if (c.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(
      trackingNumber
    )}`;
  }

  return null;
}

export async function POST(request) {
  try {
    const token = process.env.SHIPPO_API_TOKEN;

    if (!token) {
      return Response.json(
        {
          ok: false,
          message: "Missing SHIPPO_API_TOKEN in Vercel Environment Variables."
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const customerAddress = cleanObject({
      name: body.name,
      street1: body.street1,
      street2: body.street2,
      city: body.city,
      state: body.state,
      zip: body.zip,
      country: body.country || "US",
      phone: body.phone,
      email: body.email
    });

    const merchantAddress = cleanObject({
      name: getEnv("MERCHANT_NAME", "Erendira's Boutique"),
      street1: getEnv("MERCHANT_STREET1"),
      street2: getEnv("MERCHANT_STREET2"),
      city: getEnv("MERCHANT_CITY"),
      state: getEnv("MERCHANT_STATE"),
      zip: getEnv("MERCHANT_ZIP"),
      country: getEnv("MERCHANT_COUNTRY", "US"),
      phone: getEnv("MERCHANT_PHONE"),
      email: getEnv("MERCHANT_EMAIL")
    });

    const parcel = {
      length: String(body.length || "10"),
      width: String(body.width || "8"),
      height: String(body.height || "2"),
      distance_unit: "in",
      weight: String(body.weight || "1"),
      mass_unit: "lb"
    };

    const orderNumber = String(body.orderNumber || "").trim();
    const originalTrackingNumber = String(body.trackingNumber || "").trim();
    const preferredCarrier = String(body.carrier || "usps").trim();
    const returnPolicyAccepted = Boolean(body.returnPolicyAccepted);

    const missing = [];

    if (!customerAddress.name) missing.push("name");
    if (!customerAddress.email) missing.push("email");
    if (!customerAddress.phone) missing.push("phone");
    if (!customerAddress.street1) missing.push("street1");
    if (!customerAddress.city) missing.push("city");
    if (!customerAddress.state) missing.push("state");
    if (!customerAddress.zip) missing.push("zip");
    if (!orderNumber) missing.push("orderNumber");
    if (!originalTrackingNumber) missing.push("trackingNumber");
    if (!parcel.weight) missing.push("weight");
    if (!returnPolicyAccepted) missing.push("returnPolicyAccepted");

    if (missing.length > 0) {
      return Response.json(
        {
          ok: false,
          message: "Missing required fields.",
          missing
        },
        { status: 400 }
      );
    }

    const missingMerchant = [];

    if (!merchantAddress.street1) missingMerchant.push("MERCHANT_STREET1");
    if (!merchantAddress.city) missingMerchant.push("MERCHANT_CITY");
    if (!merchantAddress.state) missingMerchant.push("MERCHANT_STATE");
    if (!merchantAddress.zip) missingMerchant.push("MERCHANT_ZIP");
    if (!merchantAddress.phone) missingMerchant.push("MERCHANT_PHONE");
    if (!merchantAddress.email) missingMerchant.push("MERCHANT_EMAIL");

    if (missingMerchant.length > 0) {
      return Response.json(
        {
          ok: false,
          message:
            "Missing your boutique return address in Vercel Environment Variables.",
          missing: missingMerchant
        },
        { status: 500 }
      );
    }

    const shipmentResponse = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address_from: merchantAddress,
        address_to: customerAddress,
        parcels: [parcel],
        async: false,
        extra: {
          is_return: true
        },
        metadata: `Return for order ${orderNumber}; original tracking ${originalTrackingNumber}`
      })
    });

    const shipment = await shipmentResponse.json();

    if (!shipmentResponse.ok) {
      return Response.json(
        {
          ok: false,
          message: "Shippo could not create the return shipment.",
          details: shipment
        },
        { status: shipmentResponse.status }
      );
    }

    const selectedRate = pickCheapestRate(shipment.rates, preferredCarrier);

    if (!selectedRate) {
      return Response.json(
        {
          ok: false,
          message: "No return shipping rates were available.",
          details: shipment
        },
        { status: 400 }
      );
    }

    const transactionResponse = await fetch(
      "https://api.goshippo.com/transactions/",
      {
        method: "POST",
        headers: {
          Authorization: `ShippoToken ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rate: selectedRate.object_id,
          label_file_type: "PDF_4x6",
          async: false
        })
      }
    );

    const transaction = await transactionResponse.json();

    if (!transactionResponse.ok || transaction.status === "ERROR") {
      return Response.json(
        {
          ok: false,
          message: "Shippo could not create the return label.",
          details: transaction
        },
        { status: transactionResponse.status || 400 }
      );
    }
await saveReturnToGoogleSheets({
  name: customerAddress.name,
  email: customerAddress.email,
  phone: customerAddress.phone,
  orderNumber,
  originalTrackingNumber,
  reason: body.reason || "",
  details: body.details || "",
  carrier: selectedRate.provider,
  service:
    selectedRate.servicelevel?.name ||
    selectedRate.servicelevel?.token ||
    "",
  amount: selectedRate.amount,
  currency: selectedRate.currency,
  labelUrl: transaction.label_url,
  returnTrackingNumber: transaction.tracking_number,
  trackingUrlProvider:
    transaction.tracking_url_provider ||
    carrierTrackingUrl(selectedRate.provider, transaction.tracking_number),
  eta: transaction.eta
});
    return Response.json({
      ok: true,
      orderNumber,
      originalTrackingNumber,
      carrier: selectedRate.provider,
      service:
        selectedRate.servicelevel?.name ||
        selectedRate.servicelevel?.token ||
        "",
      amount: selectedRate.amount,
      currency: selectedRate.currency,
      labelUrl: transaction.label_url,
      returnTrackingNumber: transaction.tracking_number,
      trackingUrlProvider:
        transaction.tracking_url_provider ||
        carrierTrackingUrl(selectedRate.provider, transaction.tracking_number),
      eta: transaction.eta
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: "Return label creation failed.",
        error: error.message
      },
      { status: 500 }
    );
  }
}
