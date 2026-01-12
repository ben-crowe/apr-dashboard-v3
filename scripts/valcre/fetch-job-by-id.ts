import fetch from "node-fetch";

async function fetchJobById(jobId: number) {
  // Authenticate
  const authResponse = await fetch("https://auth.valcre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: "c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh",
      client_secret:
        "6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ",
      username: "chris.chornohos@valta.ca",
      password: "Valvalta1!",
      grant_type: "password",
      scope: "offline_access",
      audience: "https://valcre.api.com",
    }),
  });

  const authData: any = await authResponse.json();
  const token = authData.access_token;

  // Fetch job by ID
  const jobUrl = `https://api-core.valcre.com/api/v1/Jobs(${jobId})`;
  const jobResponse = await fetch(jobUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!jobResponse.ok) {
    throw new Error(`Failed to fetch job: ${jobResponse.statusText}`);
  }

  const job: any = await jobResponse.json();

  console.log("\n📋 JOB DETAILS:\n");
  console.log(`Job ID: ${job.Id}`);
  console.log(`Job Number: ${job.Number}`);
  console.log(`Job Name: ${job.Name}`);
  console.log(`Status: ${job.Status}`);
  console.log(`Fee: $${job.Fee}`);
  console.log(`Retainer: $${job.Retainer}`);
  console.log("\n💬 COMMENT FIELDS:\n");
  console.log(`ClientComments: ${job.ClientComments || "(empty)"}`);
  console.log(`Comments (General/Internal): ${job.Comments || "(empty)"}`);
  console.log(`DeliveryComments: ${job.DeliveryComments || "(empty)"}`);
  console.log(`PaymentComments: ${job.PaymentComments || "(empty)"}`);
  console.log("\n📦 FULL JOB OBJECT:\n");
  console.log(JSON.stringify(job, null, 2));
}

fetchJobById(724219).catch(console.error);
