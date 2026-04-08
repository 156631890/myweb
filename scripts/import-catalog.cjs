const endpoint = process.env.CATALOG_REFRESH_URL || "http://127.0.0.1:3000/api/catalog/refresh";

async function main() {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload && payload.message ? payload.message : `Import failed with status ${response.status}`;
    throw new Error(message);
  }

  console.log(
    JSON.stringify(
        {
          ok: true,
          refreshedAt: payload.refreshedAt,
          importedCount: payload.importedCount,
          writtenCount: payload.writtenCount,
          writtenPath: payload.writtenPath,
          lockedFeeds: payload.lockedFeeds ?? [],
        },
        null,
        2
      )
    );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
