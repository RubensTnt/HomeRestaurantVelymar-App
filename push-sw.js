self.addEventListener("push", (event) => {
  const payload = parsePushPayload(event);
  const title = payload.title || "Villa Velymar";
  const options = {
    body: payload.body || "Promemoria admin disponibile.",
    data: {
      url: payload.url || "./admin/messages",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(event.notification.data?.url || "./admin/messages", self.registration.scope).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const matchingClient = clientList.find((client) => client.url === targetUrl || client.url.startsWith(targetUrl));
      if (matchingClient) return matchingClient.focus();
      return self.clients.openWindow(targetUrl);
    }),
  );
});

function parsePushPayload(event) {
  if (!event.data) return {};

  try {
    return event.data.json();
  } catch (_error) {
    return {
      title: "Villa Velymar",
      body: event.data.text(),
    };
  }
}
