"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-dist/swagger-ui.css";

export default function ApiDocsPage() {
  return <SwaggerUI url="/openapi.json" />;
}