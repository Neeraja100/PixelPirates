const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Simple utility to strip HTML tags from strings before sending (Frontend sanitization layer)
function sanitizeData(data) {
  if (typeof data === 'string') {
    return data.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  if (data !== null && typeof data === 'object' && !(data instanceof FormData)) {
    const sanitized = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeData(data[key]);
      }
    }
    return sanitized;
  }
  return data;
}

async function request(path, options = {}) {
  // Sanitize JSON bodies before sending
  if (options.body && typeof options.body === 'string' && !(options.body instanceof FormData)) {
     try {
       const parsed = JSON.parse(options.body);
       options.body = JSON.stringify(sanitizeData(parsed));
     } catch(e) {
       // Ignore if not JSON
     }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: options.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Mask generic backend errors for safety, expose only safe client-facing ones
    let errorMsg = "Our servers encountered an issue. Please try again.";
    if ([400, 413, 429].includes(response.status)) {
        errorMsg = payload.detail || "Invalid request or payload too large.";
    } else if (response.status === 422) {
        // FastAPI validation errors (422) return an array in `detail`
        if (Array.isArray(payload.detail)) {
            errorMsg = "Validation Error: " + payload.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join(", ");
        } else {
            errorMsg = payload.detail || "Validation Error.";
        }
    } else if (response.status === 404) {
        errorMsg = "Session expired or data not found.";
    }
    
    throw new Error(errorMsg);
  }
  return payload;
}

export const api = {
  startSession(profile) {
    return request("/sessions/start", {
      method: "POST",
      body: JSON.stringify({ profile, auto_clear_on_refresh: true }),
    });
  },
  getSession(sessionId) {
    return request(`/sessions/${sessionId}`);
  },
  addTransactions(sessionId, transactions) {
    return request("/transactions", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId, transactions }),
    });
  },
  replaceTransactions(sessionId, transactions) {
    return request("/transactions/replace", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId, transactions }),
    });
  },
  parseText(sessionId, text) {
    return request("/parse-text-input", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId, text }),
    });
  },
  uploadStatement(sessionId, file) {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);
    return request("/upload-statement", {
      method: "POST",
      body: formData,
    });
  },
  metrics(sessionId) {
    return request("/metrics", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });
  },
  personality(sessionId) {
    return request("/generate-personality", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });
  },
  insights(sessionId) {
    return request("/generate-insights", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });
  },
  actions(sessionId) {
    return request("/generate-actions", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });
  },
  nudge(sessionId) {
    return request("/nudge/test", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });
  },
  deleteAll(sessionId) {
    return request(`/sessions/${sessionId}`, {
      method: "DELETE",
    });
  },
};
